"""Optional Commons identity boundary for the resources bank's Llibres service."""
import re
import httpx
from fastapi import APIRouter, HTTPException, Request, Response
from assets import check_origin


def install_books(app, library, oidc, bank_url, app_token):
    router = APIRouter(prefix="/api/llibres", tags=["Llibres"])

    def publisher(request):
        identity = oidc(request)
        if not identity:
            raise HTTPException(401, "publication_login_required")
        if identity.get("role") not in {"profesor", "administrador"}:
            raise HTTPException(403, "publication_teacher_required")
        # Reuse revocation, expiry and individual identity; never a shared token owner.
        return library.principal(request)

    async def forward(path, method="GET", body=None, actor=None, revision=None):
        headers = {}
        if actor:
            if not app_token:
                raise HTTPException(503, "publication_unavailable")
            headers = {"Authorization":"Bearer " + app_token, "X-Llibres-Publisher":actor}
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
            return {"can_publish":True}
        except HTTPException as exc:
            return {"can_publish":False, "reason":exc.detail}

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

    app.include_router(router)
