"""Optional Commons identity boundary for the resources bank's Llibres service."""
import re
import json
import httpx
from fastapi import APIRouter, HTTPException, Request, Response
from assets import check_origin
from idapi.access import member_of, teacher_params


def install_books(app, library, oidc, bank_url, app_token, group_access):
    router = APIRouter(prefix="/api/llibres", tags=["Llibres"])

    def publisher(request):
        identity = oidc(request)
        if not identity:
            raise HTTPException(401, "publication_login_required")
        if identity.get("role") not in {"profesor", "administrador"}:
            raise HTTPException(403, "publication_teacher_required")
        # Reuse revocation, expiry and individual identity; never a shared token owner.
        return library.principal(request)

    def learner(request):
        # OIDC pupils have no verified Commons classroom binding yet. Do not
        # combine another person's pupil cookie with an OIDC identity.
        if oidc(request):
            raise HTTPException(403, "review_class_required")
        identity = library.student(request)
        if not identity:
            raise HTTPException(401, "publication_login_required")
        with library.connect() as db:
            group = db.execute("SELECT id,name FROM groups WHERE id=?", (identity["group_id"],)).fetchone()
        if not group:
            raise HTTPException(403, "review_class_required")
        return library.principal(request), group

    def classrooms(request):
        publisher(request)
        identity = oidc(request)
        with library.connect() as db:
            if identity["role"] == "administrador":
                rows = db.execute("SELECT id,name FROM groups ORDER BY id LIMIT 1001").fetchall()
            else:
                rows = db.execute(f"""SELECT g.id,g.name FROM groups g WHERE {member_of("g.id")}
                  ORDER BY g.id LIMIT 1001""", teacher_params(identity["id"])).fetchall()
        if len(rows)>1000: raise HTTPException(413, "publication_limit")
        return {r["id"]:r["name"] for r in rows}

    async def forward(path, method="GET", body=None, actor=None, revision=None, group=None):
        headers = {}
        if actor:
            if not app_token:
                raise HTTPException(503, "publication_unavailable")
            headers = {"Authorization":"Bearer " + app_token, "X-Llibres-Publisher":actor}
            if group:
                headers["X-Llibres-Group"] = group
            if revision:
                headers["If-Match"] = revision
        try:
            async with httpx.AsyncClient(timeout=90, follow_redirects=False) as client:
                result = await client.request(method, bank_url + path, headers=headers, content=body)
        except httpx.HTTPError:
            raise HTTPException(503, "publication_unavailable")
        if 300 <= result.status_code < 400 or result.status_code in (401, 403):
            raise HTTPException(503, "publication_unavailable")
        allowed = {k:v for k,v in result.headers.items() if k.lower() in {
            "content-type", "content-disposition", "content-security-policy", "cache-control",
            "x-content-type-options", "cross-origin-resource-policy", "referrer-policy"}}
        allowed.setdefault("cache-control", "no-store")
        return Response(result.content, status_code=result.status_code, headers=allowed)

    @router.get("/me")
    def me(request: Request):
        try:
            publisher(request)
            return {"can_publish":True, "can_submit":False, "can_review":True}
        except HTTPException as exc:
            reason = exc.detail
        try:
            _, group = learner(request)
            return {"can_publish":False, "can_submit":True, "can_review":False,
                    "class_name":group["name"] or group["id"]}
        except HTTPException:
            identity=oidc(request)
            if identity and identity.get("role")=="alumno": reason="review_class_required"
            return {"can_publish":False, "can_submit":False, "can_review":False, "reason":reason}

    @router.get("/source.zip")
    async def source():
        return await forward("/api/llibres/source.zip")

    @router.get("/books")
    async def books(request: Request):
        return await forward("/api/llibres/books?" + request.url.query)

    @router.get("/public/{book}/{path:path}")
    async def content(book: str, path: str):
        if not re.fullmatch(r"[a-f0-9]{32}", book) or not re.fullmatch(r"(?:index\.html|cover\.png|source\.elpx|images/[a-f0-9]{64}\.png|credits/[a-f0-9]{64}\.txt)", path):
            raise HTTPException(404, "not_found")
        return await forward(f"/api/llibres/public/{book}/{path}")

    @router.get("/mine/{draft}")
    @router.post("/mine/{draft}")
    @router.delete("/mine/{draft}")
    async def own(draft: str, request: Request):
        actor = publisher(request)
        if not re.fullmatch(r"[a-zA-Z0-9-]{16,64}", draft):
            raise HTTPException(422, "invalid_publication")
        body = None
        if request.method != "GET":
            check_origin(request)
        if request.method == "POST":
            chunks = bytearray()
            async for chunk in request.stream():
                if len(chunks) + len(chunk) > 30 * 1024 * 1024:
                    raise HTTPException(413, "publication_limit")
                chunks.extend(chunk)
            body = bytes(chunks)
        return await forward("/api/internal/llibres/" + draft, request.method, body, actor, request.headers.get("if-match"))

    @router.get("/submissions/{draft}")
    @router.post("/submissions/{draft}")
    @router.delete("/submissions/{draft}")
    async def submissions(draft: str, request: Request):
        actor, group = learner(request)
        if not re.fullmatch(r"[a-zA-Z0-9-]{16,64}", draft): raise HTTPException(422, "invalid_publication")
        body = None
        if request.method != "GET": check_origin(request)
        if request.method == "POST":
            from_body = bytearray()
            async for chunk in request.stream():
                if len(from_body)+len(chunk)>30*1024*1024: raise HTTPException(413, "publication_limit")
                from_body.extend(chunk)
            body = bytes(from_body)
        suffix = "?publication=1" if request.method == "DELETE" and request.query_params.get("publication")=="1" else ""
        return await forward("/api/internal/llibres/submissions/"+draft+suffix, request.method, body,
                             actor, request.headers.get("if-match"), group["id"])

    @router.get("/reviews")
    async def reviews(request: Request):
        actor = publisher(request)
        groups = classrooms(request)
        try: offset=int(request.query_params.get("offset", "0"))
        except ValueError: raise HTTPException(422, "invalid_publication")
        result = await forward("/api/internal/llibres/reviews", "POST", json.dumps({
            "groups":list(groups), "offset":offset, "all":request.query_params.get("all")=="1",
            "all_classes":oidc(request)["role"]=="administrador"}).encode(), actor)
        if result.status_code == 200:
            data=json.loads(result.body)
            for item in data["items"]: item["class_name"]=groups.get(item["group_id"], "")
            return Response(json.dumps(data),media_type="application/json",headers={"Cache-Control":"private, no-store"})
        return result

    async def review_scope(key, request):
        actor = publisher(request)
        if not re.fullmatch(r"[a-f0-9]{32}",key): raise HTTPException(404,"not_found")
        result = await forward("/api/internal/llibres/review-scope/"+key, actor=actor)
        if result.status_code != 200: raise HTTPException(result.status_code,"not_found")
        try:
            scope=json.loads(result.body)
            group=scope["group_id"]
            owner=scope["owner"]
        except (ValueError,KeyError,TypeError): raise HTTPException(503,"publication_unavailable")
        if not isinstance(group,str) or not re.fullmatch(r"[a-zA-Z0-9_-]{1,100}",group): raise HTTPException(503,"publication_unavailable")
        group_access(request,group,individual=True)
        return actor,group,owner

    @router.post("/reviews/{key}")
    async def review_decision(key: str, request: Request):
        check_origin(request)
        actor, group, owner = await review_scope(key, request)
        raw=bytearray()
        async for chunk in request.stream():
            if len(raw)+len(chunk)>8192: raise HTTPException(413,"publication_limit")
            raw.extend(chunk)
        try: data=json.loads(raw)
        except (ValueError,UnicodeDecodeError): raise HTTPException(422,"invalid_publication")
        if not isinstance(data,dict): raise HTTPException(422,"invalid_publication")
        if data.get("decision")=="approve":
            with library.connect() as db:
                active=db.execute("""SELECT 1 FROM asset_principals p JOIN student_identities i ON i.id=p.subject
                  WHERE p.id=? AND p.kind='student' AND p.issuer='commons' AND p.active=1
                  AND i.active=1 AND i.group_id=?""",(owner,group)).fetchone()
            if not active: raise HTTPException(409,"review_student_unavailable")
        return await forward("/api/internal/llibres/reviews/"+key, "POST", bytes(raw), actor,
                             request.headers.get("if-match"), group)

    @router.get("/reviews/{key}/files/{path:path}")
    async def review_file(key: str, path: str, request: Request):
        if not re.fullmatch(r"(?:index\.html|cover\.png|source\.elpx|images/[a-f0-9]{64}\.png|credits/[a-f0-9]{64}\.txt)", path):
            raise HTTPException(404,"not_found")
        actor, group, owner = await review_scope(key, request)
        return await forward(f"/api/internal/llibres/reviews/{key}/files/{path}", actor=actor, group=group)

    app.include_router(router)
