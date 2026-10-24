import { RebostClient as e } from "/assets/client.js";
// node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function t(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var n = {}, r = [], i = () => {}, a = () => !1, o = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), s = (e) => e.startsWith("onUpdate:"), c = Object.assign, l = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, u = Object.prototype.hasOwnProperty, d = (e, t) => u.call(e, t), f = Array.isArray, p = (e) => S(e) === "[object Map]", m = (e) => S(e) === "[object Set]", h = (e) => S(e) === "[object Date]", g = (e) => typeof e == "function", _ = (e) => typeof e == "string", v = (e) => typeof e == "symbol", y = (e) => typeof e == "object" && !!e, b = (e) => (y(e) || g(e)) && g(e.then) && g(e.catch), x = Object.prototype.toString, S = (e) => x.call(e), C = (e) => S(e).slice(8, -1), w = (e) => S(e) === "[object Object]", T = (e) => _(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ t(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), E = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, te = /-\w/g, D = E((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, O = E((e) => e.replace(ne, "-$1").toLowerCase()), re = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = E((e) => e ? `on${re(e)}` : ""), k = (e, t) => !Object.is(e, t), A = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, j = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ae = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, oe, se = () => oe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ce(e) {
	if (f(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = _(r) ? M(r) : ce(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (_(e) || y(e)) return e;
}
var le = /;(?![^(]*\))/g, ue = /:([^]+)/, de = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function M(e) {
	let t = {};
	return e.replace(de, (e) => e.startsWith("/*") ? "" : e).split(le).forEach((e) => {
		if (e) {
			let n = e.split(ue);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function fe(e) {
	let t = "";
	if (_(e)) t = e;
	else if (f(e)) for (let n = 0; n < e.length; n++) {
		let r = fe(e[n]);
		r && (t += r + " ");
	}
	else if (y(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var pe = /* @__PURE__ */ t("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function me(e) {
	return !!e || e === "";
}
function he(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = N(e[i], t[i], n);
	return r;
}
function ge(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && N(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function _e(e, t, n) {
	let r = p(e), i = p(t);
	if (r || i || (r = m(e), i = m(t), r || i)) return r && i ? ge(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !N(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ve(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function N(e, t, n) {
	if (e === t) return !0;
	let r = h(e), i = h(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = v(e), i = v(t), r || i ? e === t : (r = f(e), i = f(t), r || i ? r && i ? ve(e, t, n, he) : !1 : (r = y(e), i = y(t), r || i ? !r || !i ? !1 : ve(e, t, n, _e) : String(e) === String(t))));
}
function ye(e, t) {
	return e.findIndex((e) => N(e, t));
}
var be = (e) => !!(e && e.__v_isRef === !0), P = (e) => _(e) ? e : e == null ? "" : f(e) || y(e) && (e.toString === x || !g(e.toString)) ? be(e) ? P(e.value) : JSON.stringify(e, xe, 2) : String(e), xe = (e, t) => be(t) ? xe(e, t.value) : p(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Se(t, r) + " =>"] = n, e), {}) } : m(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Se(e)) } : v(t) ? Se(t) : y(t) && !f(t) && !w(t) ? String(t) : t, Se = (e, t = "") => v(e) ? `Symbol(${e.description ?? t})` : e, F, Ce = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && F && (F.active ? (this.parent = F, this.index = (F.scopes || (F.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = F;
			try {
				return F = this, e();
			} finally {
				F = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = F, F = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (F === this) F = this.prevScope;
			else {
				let e = F;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function we() {
	return F;
}
var I, Te = /* @__PURE__ */ new WeakSet(), Ee = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, F && (F.active ? F.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Te.has(this) && (Te.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ae(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ue(this), Ne(this);
		let e = I, t = ze;
		I = this, ze = !0;
		try {
			return this.fn();
		} finally {
			Pe(this), I = e, ze = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Le(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Te.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Fe(this) && this.run();
	}
	get dirty() {
		return Fe(this);
	}
}, De = 0, Oe, ke;
function Ae(e, t = !1) {
	e.flags |= 8, t ? (e.next = ke, ke = e) : (e.next = Oe, Oe = e);
}
function je() {
	De++;
}
function Me() {
	if (--De > 0) return;
	if (ke) {
		let e = ke;
		for (ke = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Oe;) {
		let t = Oe;
		for (Oe = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Ne(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Le(r), Re(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Fe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ie(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ie(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === We) || (e.globalVersion = We, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Fe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = I, r = ze;
	I = e, ze = !0;
	try {
		Ne(e);
		let n = e.fn(e._value);
		(t.version === 0 || k(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		I = n, ze = r, Pe(e), e.flags &= -3;
	}
}
function Le(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Le(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Re(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ze = !0, Be = [];
function Ve() {
	Be.push(ze), ze = !1;
}
function He() {
	let e = Be.pop();
	ze = e === void 0 || e;
}
function Ue(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = I;
		I = void 0;
		try {
			t();
		} finally {
			I = e;
		}
	}
}
var We = 0, Ge = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ke = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!I || !ze || I === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== I) t = this.activeLink = new Ge(I, this), I.deps ? (t.prevDep = I.depsTail, I.depsTail.nextDep = t, I.depsTail = t) : I.deps = I.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = I.depsTail, t.nextDep = void 0, I.depsTail.nextDep = t, I.depsTail = t, I.deps === t && (I.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, We++, this.notify(e);
	}
	notify(e) {
		je();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Me();
		}
	}
};
function qe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) qe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Je = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ Symbol(""), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol("");
function L(e, t, n) {
	if (ze && I) {
		let t = Je.get(e);
		t || Je.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ke()), r.map = t, r.key = n), r.track();
	}
}
function Qe(e, t, n, r, i, a) {
	let o = Je.get(e);
	if (!o) {
		We++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (je(), t === "clear") o.forEach(s);
	else {
		let i = f(e), a = i && T(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ze || !v(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ze)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ye)), p(e) && s(o.get(Xe)));
				break;
			case "delete":
				i || (s(o.get(Ye)), p(e) && s(o.get(Xe)));
				break;
			case "set": p(e) && s(o.get(Ye));
		}
	}
	Me();
}
function $e(e) {
	let t = /* @__PURE__ */ z(e);
	return t === e || (L(t, "iterate", Ze), /* @__PURE__ */ R(e)) ? t : /* @__PURE__ */ Rt(e) ? /* @__PURE__ */ Lt(e) ? t.map((e) => Vt(B(e))) : t.map(Vt) : t.map(B);
}
function et(e) {
	return L(e = /* @__PURE__ */ z(e), "iterate", Ze), e;
}
function tt(e, t) {
	return /* @__PURE__ */ Rt(e) ? Vt(/* @__PURE__ */ Lt(e) ? B(t) : t) : B(t);
}
var nt = {
	__proto__: null,
	[Symbol.iterator]() {
		return rt(this, Symbol.iterator, (e) => tt(this, e));
	},
	concat(...e) {
		return $e(this).concat(...e.map((e) => f(e) ? $e(e) : e));
	},
	entries() {
		return rt(this, "entries", (e) => (e[1] = tt(this, e[1]), e));
	},
	every(e, t) {
		return ot(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ot(this, "filter", e, t, (e) => e.map((e) => tt(this, e)), arguments);
	},
	find(e, t) {
		return ot(this, "find", e, t, (e) => tt(this, e), arguments);
	},
	findIndex(e, t) {
		return ot(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ot(this, "findLast", e, t, (e) => tt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ot(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ot(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ct(this, "includes", e);
	},
	indexOf(...e) {
		return ct(this, "indexOf", e);
	},
	join(e) {
		return $e(this).join(e);
	},
	lastIndexOf(...e) {
		return ct(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ot(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return lt(this, "pop");
	},
	push(...e) {
		return lt(this, "push", e);
	},
	reduce(e, ...t) {
		return st(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return st(this, "reduceRight", e, t);
	},
	shift() {
		return lt(this, "shift");
	},
	some(e, t) {
		return ot(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return lt(this, "splice", e);
	},
	toReversed() {
		return $e(this).toReversed();
	},
	toSorted(e) {
		return $e(this).toSorted(e);
	},
	toSpliced(...e) {
		return $e(this).toSpliced(...e);
	},
	unshift(...e) {
		return lt(this, "unshift", e);
	},
	values() {
		return rt(this, "values", (e) => tt(this, e));
	}
};
function rt(e, t, n) {
	let r = et(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ R(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => it(a.next(), n), i !== at[t] && Object.defineProperties(e, {
				return: { get() {
					let e = a.return;
					return typeof e == "function" ? e.bind(a) : e;
				} },
				throw: { get() {
					let e = a.throw;
					return typeof e == "function" ? e.bind(a) : e;
				} }
			}), e;
		}
		a._next = a.next, a.next = () => it(a._next(), n);
	}
	return a;
}
function it(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var at = Array.prototype;
function ot(e, t, n, r, i, a) {
	let o = et(e), s = o !== e && !/* @__PURE__ */ R(e), c = o[t];
	if (c !== at[t]) {
		let t = c.apply(e, a);
		return s ? B(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, tt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function st(e, t, n, r) {
	let i = et(e), a = i !== e && !/* @__PURE__ */ R(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = tt(e, t)), n.call(this, t, tt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? tt(e, c) : c;
}
function ct(e, t, n) {
	let r = /* @__PURE__ */ z(e);
	L(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ zt(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), r[t](...n)) : i;
}
function lt(e, t, n = []) {
	Ve(), je();
	let r = (/* @__PURE__ */ z(e))[t].apply(e, n);
	return Me(), He(), r;
}
var ut = /* @__PURE__ */ t("__proto__,__v_isRef,__isVue"), dt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(v));
function ft(e) {
	v(e) || (e = String(e));
	let t = /* @__PURE__ */ z(this);
	return L(t, "has", e), t.hasOwnProperty(e);
}
var pt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? jt : At : i ? kt : Ot).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = f(e);
		if (!r) {
			let e;
			if (a && (e = nt[t])) return e;
			if (t === "hasOwnProperty") return ft;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ V(e) ? e : n);
		if ((v(t) ? dt.has(t) : ut(t)) || (r || L(e, "get", t), i)) return o;
		if (/* @__PURE__ */ V(o)) {
			let e = a && T(t) ? o : o.value;
			return r && y(e) ? /* @__PURE__ */ Ft(e) : e;
		}
		return y(o) ? r ? /* @__PURE__ */ Ft(o) : /* @__PURE__ */ Nt(o) : o;
	}
}, mt = class extends pt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = f(e) && T(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Rt(i);
			if (!/* @__PURE__ */ R(n) && !/* @__PURE__ */ Rt(n) && (i = /* @__PURE__ */ z(i), n = /* @__PURE__ */ z(n)), !a && /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : d(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ V(e) ? e : r);
		return e === /* @__PURE__ */ z(r) && s && (o ? k(n, i) && Qe(e, "set", t, n, i) : Qe(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = d(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Qe(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return v(t) && dt.has(t) || L(e, "has", t), n;
	}
	ownKeys(e) {
		return L(e, "iterate", f(e) ? "length" : Ye), Reflect.ownKeys(e);
	}
}, ht = class extends pt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, gt = /* @__PURE__ */ new mt(), _t = /* @__PURE__ */ new ht(), vt = /* @__PURE__ */ new mt(!0), yt = (e) => e, bt = (e) => Reflect.getPrototypeOf(e);
function xt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ z(i), o = p(a), s = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? yt : t ? Vt : B;
		return !t && L(a, "iterate", l ? Xe : Ye), c(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function St(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Ct(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ z(r), a = /* @__PURE__ */ z(n);
			e || (k(n, a) && L(i, "get", n), L(i, "get", a));
			let { has: o } = bt(i), s = t ? yt : e ? Vt : B;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && L(/* @__PURE__ */ z(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ z(n), i = /* @__PURE__ */ z(t);
			return e || (k(t, i) && L(r, "has", t), L(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ z(a), s = t ? yt : e ? Vt : B;
			return !e && L(o, "iterate", Ye), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return c(n, e ? {
		add: St("add"),
		set: St("set"),
		delete: St("delete"),
		clear: St("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ z(this), r = bt(n), i = /* @__PURE__ */ z(e), a = !t && !/* @__PURE__ */ R(e) && !/* @__PURE__ */ Rt(e) ? i : e;
			return r.has.call(n, a) || k(e, a) && r.has.call(n, e) || k(i, a) && r.has.call(n, i) || (n.add(a), Qe(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ R(n) || /* @__PURE__ */ Rt(n) || (n = /* @__PURE__ */ z(n));
			let r = /* @__PURE__ */ z(this), { has: i, get: a } = bt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ z(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? k(n, s) && Qe(r, "set", e, n, s) : Qe(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ z(this), { has: n, get: r } = bt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ z(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Qe(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ z(this), t = e.size !== 0, n = e.clear();
			return t && Qe(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = xt(r, e, t);
	}), n;
}
function wt(e, t) {
	let n = Ct(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(d(n, i) && i in r ? n : r, i, a);
}
var Tt = { get: /* @__PURE__ */ wt(!1, !1) }, Et = { get: /* @__PURE__ */ wt(!1, !0) }, Dt = { get: /* @__PURE__ */ wt(!0, !1) }, Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap();
function Mt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
	return /* @__PURE__ */ Rt(e) ? e : It(e, !1, gt, Tt, Ot);
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return It(e, !1, vt, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return It(e, !0, _t, Dt, At);
}
function It(e, t, n, r, i) {
	if (!y(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Mt(C(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return /* @__PURE__ */ Rt(e) ? /* @__PURE__ */ Lt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ z(t) : e;
}
function Bt(e) {
	return !d(e, "__v_skip") && Object.isExtensible(e) && j(e, "__v_skip", !0), e;
}
var B = (e) => y(e) ? /* @__PURE__ */ Nt(e) : e, Vt = (e) => y(e) ? /* @__PURE__ */ Ft(e) : e;
// @__NO_SIDE_EFFECTS__
function V(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function H(e) {
	return Ht(e, !1);
}
function Ht(e, t) {
	return /* @__PURE__ */ V(e) ? e : new Ut(e, t);
}
var Ut = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ z(e), this._value = t ? e : B(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ R(e) || /* @__PURE__ */ Rt(e);
		e = n ? e : /* @__PURE__ */ z(e), k(e, t) && (this._rawValue = e, this._value = n ? e : B(e), this.dep.trigger());
	}
};
function U(e) {
	return /* @__PURE__ */ V(e) ? e.value : e;
}
var Wt = {
	get: (e, t, n) => t === "__v_raw" ? e : U(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Gt(e) {
	return /* @__PURE__ */ Lt(e) ? e : new Proxy(e, Wt);
}
var Kt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && I !== this) return Ae(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ie(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function qt(e, t, n = !1) {
	let r, i;
	return g(e) ? r = e : (r = e.get, i = e.set), new Kt(r, i, n);
}
var Jt = {}, Yt = /* @__PURE__ */ new WeakMap(), Xt = void 0;
function Zt(e, t = !1, n = Xt) {
	if (n) {
		let t = Yt.get(n);
		t || Yt.set(n, t = []), t.push(e);
	}
}
function Qt(e, t, r = n) {
	let { immediate: a, deep: o, once: s, scheduler: c, augmentJob: u, call: d } = r, p = (e) => o ? e : /* @__PURE__ */ R(e) || o === !1 || o === 0 ? $t(e, 1) : $t(e), m, h, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ V(e) ? (h = () => e.value, y = /* @__PURE__ */ R(e)) : /* @__PURE__ */ Lt(e) ? (h = () => p(e), y = !0) : f(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Lt(e) || /* @__PURE__ */ R(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ V(e)) return e.value;
		if (/* @__PURE__ */ Lt(e)) return p(e);
		if (g(e)) return d ? d(e, 2) : e();
	})) : h = g(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (_) {
			Ve();
			try {
				_();
			} finally {
				He();
			}
		}
		let t = Xt;
		Xt = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			Xt = t;
		}
	} : i, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => $t(e(), t);
	}
	let x = we(), S = () => {
		m.stop(), x && x.active && l(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			try {
				return e(...t);
			} finally {
				S();
			}
		};
	}
	let C = b ? Array(e.length).fill(Jt) : Jt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => k(e, C[t])) : k(n, C))) {
					let e = Xt;
					Ve();
					try {
						_ && _(), Xt = m;
						let e = [
							n,
							C === Jt ? void 0 : b && C[0] === Jt ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						Xt = e, He();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Ee(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => Zt(e, !1, m), _ = m.onStop = () => {
		let e = Yt.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			Yt.delete(m);
		}
	}, t ? a ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function $t(e, t = Infinity, n) {
	if (t <= 0 || !y(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ V(e)) $t(e.value, t, n);
	else if (f(e)) for (let r = 0; r < e.length; r++) $t(e[r], t, n);
	else if (m(e) || p(e)) e.forEach((e) => {
		$t(e, t, n);
	});
	else if (w(e)) {
		for (let r in e) $t(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && $t(e[r], t, n);
	}
	return e;
}
// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function en(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		nn(e, t, n);
	}
}
function tn(e, t, n, r) {
	if (g(e)) {
		let i = en(e, t, n, r);
		return i && b(i) && i.catch((e) => {
			nn(e, t, n);
		}), i;
	}
	if (f(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(tn(e[a], t, n, r));
		return i;
	}
}
function nn(e, t, r, i = !0) {
	let a = t ? t.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = t && t.appContext.config || n;
	if (t) {
		let n = t.parent, i = t.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; n;) {
			let t = n.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, a) === !1) return;
			}
			n = n.parent;
		}
		if (o) {
			Ve(), en(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	rn(e, r, a, i, s);
}
function rn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var W = [], G = -1, an = [], on = null, sn = 0, cn = /* @__PURE__ */ Promise.resolve(), ln = null;
function un(e) {
	let t = ln || cn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function dn(e) {
	let t = G + 1, n = W.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = W[r], a = yn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function fn(e) {
	if (!(e.flags & 1)) {
		let t = yn(e), n = W[W.length - 1];
		!n || !(e.flags & 2) && t >= yn(n) ? W.push(e) : W.splice(dn(t), 0, e), e.flags |= 1, pn();
	}
}
function pn() {
	ln ||= cn.then(bn);
}
function mn(e) {
	if (!f(e)) on && e.id === -1 ? on.splice(sn + 1, 0, e) : e.flags & 1 || (an.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) an.push(e[t]);
	pn();
}
function hn(e, t, n, r = G + 1) {
	for (; r < W.length; r++) {
		let n = W[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			W.splice(r, 1), r = e ? r - 1 : G, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function gn(e, t, n = 0) {
	if (an.length) {
		let e = an, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < an.length; i++) {
				let a = an[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? an[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => yn(e) - yn(t));
		if (an.length = r, on) {
			for (let e = 0; e < i.length; e++) on.push(i[e]);
			return;
		}
		for (on = i, sn = 0; sn < on.length; sn++) {
			let e = on[sn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		on = null, sn = 0;
	}
}
var _n = !1;
function vn(e, t) {
	if (_n) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(an);
	e(), _n = !0;
	try {
		hn(void 0, t), gn(void 0, n, t);
	} finally {
		_n = !1;
	}
}
var yn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function bn(e) {
	try {
		for (G = 0; G < W.length; G++) {
			let e = W[G];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), en(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; G < W.length; G++) {
			let e = W[G];
			e && (e.flags &= -2);
		}
		G = -1, W.length = 0, gn(e), ln = null, (W.length || an.length) && bn(e);
	}
}
var K = null, xn = null;
function Sn(e) {
	let t = K;
	return K = e, xn = e && e.type.__scopeId || null, t;
}
function Cn(e, t = K, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ii(-1);
		let i = Sn(t), a = ti.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ti.length; e > a; e--) ni();
			Sn(i), r._d && ii(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function wn(e, t) {
	if (K === null) return e;
	let r = zi(K), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = n] = t[e];
		a && (g(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && $t(o), i.push({
			dir: a,
			instance: r,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function Tn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ve(), tn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function En(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function Dn(e, t, n = !1) {
	let r = Ei();
	if (r || ur) {
		let i = ur ? ur._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && g(t) ? t.call(r && r.proxy) : t;
	}
}
var On = /* @__PURE__ */ Symbol.for("v-scx"), kn = () => Dn(On);
function An(e, t, n) {
	return jn(e, t, n);
}
function jn(e, t, r = n) {
	let { immediate: a, deep: o, flush: s, once: l } = r, u = c({}, r), d = t && a || !t && s !== "post", f;
	if (Mi) {
		if (s === "sync") {
			let e = kn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = i, e.resume = i, e.pause = i, e;
		}
	}
	let p = $;
	u.call = (e, t, n) => tn(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		e.i = p, q(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : fn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Qt(e, t, u);
	return Mi && (f ? f.push(h) : d && h()), h;
}
var Mn = /* @__PURE__ */ Symbol("_vte"), Nn = (e) => e.__isTeleport, Pn = /* @__PURE__ */ Symbol("_leaveCb");
function Fn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== $r) {
			t = n;
			break;
		}
	}
	return t;
}
function In(e) {
	if (!Gn(e)) return Nn(e.type) && e.children ? Fn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && g(n.default)) return n.default();
	}
}
function Ln(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Ln(Nn(n.type) && In(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === J && f(e.children)) {
		let n = gr(e.children, !1);
		n && Ln(n, t);
	}
}
function Rn(e) {
	if (e.component) return Rn(e.component.subTree);
	if (e.type === J) {
		let t = f(e.children) && gr(e.children, !1);
		return t ? Rn(t) : void 0;
	}
	if (e.type !== $r) return e;
}
function zn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Bn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Vn = /* @__PURE__ */ new WeakMap();
function Hn(e, t, r, i, o = !1) {
	if (f(e)) {
		e.forEach((e, n) => Hn(e, t && (f(t) ? t[n] : t), r, i, o));
		return;
	}
	if (Wn(i) && !o) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Hn(e, t, r, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? zi(i.component) : i.el, c = o ? null : s, { i: u, r: p } = e, m = t && t.r, h = u.refs === n ? u.refs = {} : u.refs, v = u.setupState, y = /* @__PURE__ */ z(v), b = v === n ? a : (e) => !Bn(h, e) && d(y, e), x = (e, t) => !(t && Bn(h, t));
	if (m != null && m !== p) {
		if (Un(t), _(m)) h[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ V(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (g(p)) en(p, u, 12, [c, h]);
	else {
		let t = _(p), n = /* @__PURE__ */ V(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : h[p] : x(p) || !e.k ? p.value : h[e.k];
					if (o) f(n) && l(n, s);
					else if (f(n)) n.includes(s) || n.push(s);
					else if (t) h[p] = [s], b(p) && (v[p] = h[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (h[e.k] = t);
					}
				} else t ? (h[p] = c, b(p) && (v[p] = c)) : n && (x(p, e.k) && (p.value = c), e.k && (h[e.k] = c));
			};
			if (c) {
				let t = () => {
					i(), Vn.delete(e);
				};
				t.id = -1, Vn.set(e, t), q(t, r);
			} else Un(e), i();
		}
	}
}
function Un(e) {
	let t = Vn.get(e);
	t && (t.flags |= 8, Vn.delete(e));
}
se().requestIdleCallback, se().cancelIdleCallback;
var Wn = (e) => !!e.type.__asyncLoader, Gn = (e) => e.type.__isKeepAlive;
function Kn(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ve();
			let i = ki(n), a = tn(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var qn = (e) => (t, n = $) => {
	Mi && e !== "sp" || Kn(e, (...e) => t(...e), n);
}, Jn = qn("m"), Yn = qn("bum"), Xn = "components";
function Zn(e, t) {
	return er(Xn, e, !0, t) || e;
}
var Qn = /* @__PURE__ */ Symbol.for("v-ndc");
function $n(e) {
	return _(e) ? er(Xn, e, !1) || e : e || Qn;
}
function er(e, t, n = !0, r = !1) {
	let i = K || $;
	if (i) {
		let n = i.type;
		if (e === Xn) {
			let e = Bi(n, !1);
			if (e && (e === t || e === D(t) || e === re(D(t)))) return n;
		}
		let a = tr(i[e] || n[e], t) || tr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function tr(e, t) {
	return e && (e[t] || e[D(t)] || e[re(D(t))]);
}
function nr(e, t, n, r) {
	let i, a = n && n[r], o = f(e);
	if (o || _(e)) {
		let n = o && /* @__PURE__ */ Lt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ R(e), s = /* @__PURE__ */ Rt(e), e = et(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Vt(B(e[n])) : B(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (y(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
var rr = (e) => e ? ji(e) ? zi(e) : rr(e.parent) : null, ir = /* @__PURE__ */ c(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => rr(e.parent),
	$root: (e) => rr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		fn(e.update);
	},
	$nextTick: (e) => e.n ||= un.bind(e.proxy),
	$watch: (e) => i
}), ar = (e, t) => e !== n && !e.__isScriptSetup && d(e, t), or = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (t[0] !== "$") {
			let e = s[t];
			if (e !== void 0) switch (e) {
				case 1: return i[t];
				case 2: return a[t];
				case 4: return r[t];
				case 3: return o[t];
			}
			else if (ar(i, t)) return s[t] = 1, i[t];
			else if (d(o, t)) return s[t] = 3, o[t];
			else if (r !== n && d(r, t)) return s[t] = 4, r[t];
			else s[t] = 0;
		}
		let u = ir[t], f, p;
		if (u) return t === "$attrs" && L(e.attrs, "get", ""), u(e);
		if ((f = c.__cssModules) && (f = f[t])) return f;
		if (r !== n && d(r, t)) return s[t] = 4, r[t];
		if (p = l.config.globalProperties, d(p, t)) return p[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return ar(i, t) ? (i[t] = n, !0) : d(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || ar(t, s) || d(a, s) || d(r, s) || d(ir, s) || d(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? d(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function sr() {
	return {
		app: null,
		config: {
			isNativeTag: a,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var cr = 0;
function lr(e, t) {
	return function(n, r = null) {
		g(n) || (n = c({}, n)), r != null && !y(r) && (r = null);
		let i = sr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, l = i.app = {
			_uid: cr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ui,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && g(e.install) ? (a.add(e), e.install(l, ...t)) : g(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, c) {
				if (!s) {
					let u = l._ceVNode || di(n, r);
					return u.appContext = i, c === !0 ? c = "svg" : c === !1 && (c = void 0), o && t ? t(u, a) : e(u, a, c), s = !0, l._container = a, a.__vue_app__ = l, zi(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (tn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = ur;
				ur = l;
				try {
					return e();
				} finally {
					ur = t;
				}
			}
		};
		return l;
	};
}
var ur = null, dr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function fr(e, t, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || n, a = r, o = t.startsWith("update:"), s = o && dr(i, t.slice(7));
	s && (s.trim && (a = r.map((e) => _(e) ? e.trim() : e)), s.number && (a = a.map(ae)));
	let c, l = i[c = ie(t)] || i[c = ie(D(t))];
	!l && o && (l = i[c = ie(O(t))]), l && tn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, tn(u, e, 6, a);
	}
}
function pr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (f(a) ? a.forEach((e) => o[e] = null) : c(o, a), y(e) && r.set(e, o), o) : (y(e) && r.set(e, null), null);
}
function mr(e, t) {
	return !e || !o(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), d(e, t[0].toLowerCase() + t.slice(1)) || d(e, O(t)) || d(e, t));
}
function hr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Sn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = _i(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = _i(e.length > 1 ? e(f, {
				attrs: c,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? c : _r(c);
		}
	} catch (t) {
		ti.length = 0, nn(t, e, 1), v = di($r);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(s) && (y = vr(y, a)), b = mi(b, y, !1, !0));
	}
	return n.dirs && (b = mi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Ln(Nn(b.type) && In(b) || b, n.transition), v = b, Sn(_), v;
}
function gr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (si(r)) {
			if (r.type !== $r || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var _r = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || o(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, vr = (e, t) => {
	let n = {};
	for (let r in e) s(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function yr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? br(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (xr(o, r, n) && !mr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || br(r, o, l) : !!o;
	return !1;
}
function br(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!d(e, a) || xr(t, e, a) && !mr(n, a)) return !0;
	}
	return !1;
}
function xr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && y(r) && y(i) ? !N(r, i) : r !== i;
}
function Sr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Cr = {}, wr = () => Object.create(Cr), Tr = (e) => Object.getPrototypeOf(e) === Cr;
function Er(e, t, n, r = !1) {
	let i = {}, a = wr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Or(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Pt(i) : e.type.props ? i : a, e.attrs = a;
}
function Dr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ z(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (mr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (d(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = D(o);
						i[t] = kr(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Or(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (d(t, a) || (r = O(a)) !== a && d(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = kr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && d(t, e) || (delete a[e], l = !0);
	}
	l && Qe(e.attrs, "set", "");
}
function Or(e, t, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let n in t) {
		if (ee(n)) continue;
		let l = t[n], u;
		a && d(a, u = D(n)) ? !o || !o.includes(u) ? r[u] = l : (c ||= {})[u] = l : mr(e.emitsOptions, n) || n in i && l === i[n] || (i[n] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ z(r), i = c || n;
		for (let n = 0; n < o.length; n++) {
			let s = o[n];
			r[s] = kr(a, t, s, i[s], e, !d(i, s));
		}
	}
	return s;
}
function kr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = d(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && g(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = ki(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === O(n)) && (r = !0));
	}
	return r;
}
function Ar(e, t, i = !1) {
	let a = t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, l = {}, u = [];
	if (!s) return y(e) && a.set(e, r), r;
	if (f(s)) for (let e = 0; e < s.length; e++) {
		let t = D(s[e]);
		jr(t) && (l[t] = n);
	}
	else if (s) for (let e in s) {
		let t = D(e);
		if (jr(t)) {
			let n = s[e], r = l[t] = f(n) || g(n) ? { type: n } : c({}, n), i = r.type, a = !1, o = !0;
			if (f(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = g(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = g(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || d(r, "default")) && u.push(t);
		}
	}
	let p = [l, u];
	return y(e) && a.set(e, p), p;
}
function jr(e) {
	return e[0] !== "$" && !ee(e);
}
var Mr = (e) => e === "_" || e === "_ctx" || e === "$stable", Nr = (e) => f(e) ? e.map(_i) : [_i(e)], Pr = (e, t, n) => {
	if (t._n) return t;
	let r = Cn((...e) => Nr(t(...e)), n);
	return r._c = !1, r;
}, Fr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Mr(n)) continue;
		let i = e[n];
		if (g(i)) t[n] = Pr(n, i, r);
		else if (i != null) {
			let e = Nr(i);
			t[n] = () => e;
		}
	}
}, Ir = (e, t) => {
	let n = Nr(t);
	e.slots.default = () => n;
}, Lr = (e, t, n) => {
	for (let r in t) (n || !Mr(r)) && (e[r] = t[r]);
}, Rr = (e, t, n) => {
	let r = e.slots = wr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Lr(r, t, n), n && j(r, "_", e, !0)) : Fr(t, r);
	} else t && Ir(e, t);
}, zr = (e, t, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = n;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? r && e === 1 ? o = !1 : Lr(a, t, r) : (o = !t.$stable, Fr(t, a)), s = t;
	} else t && (Ir(e, t), s = { default: 1 });
	if (o) for (let e in a) !Mr(e) && s[e] == null && delete a[e];
}, q = Zr;
function Br(e) {
	return Vr(e);
}
function Vr(e, t) {
	let a = se();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = i, insertStaticContent: _ } = e, v = (e, t, n, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ci(e, t) && (i = ge(e), M(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === r && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Qr:
				y(e, t, n, i);
				break;
			case $r:
				b(e, t, n, i);
				break;
			case ei:
				e ?? x(t, n, i, s);
				break;
			case J:
				re(e, t, n, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, i, a, o, s, c, l) : f & 6 ? ie(e, t, n, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, i, a, o, s, c, l, ve);
		}
		d != null && a ? Hn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Hn(e.ref, null, o, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), D(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && te(e.children, d, null, r, i, Hr(e, a), s, u), _ && Tn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && xi(f, r, e);
		}
		_ && Tn(e, null, r, "beforeMount");
		let v = Wr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && q(() => {
			try {
				f && xi(f, r, e), v && g.enter(d), _ && Tn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Xr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, te = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? vi(e[l]) : _i(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, t, r, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || n, h = t.props || n, g;
		if (r && Ur(r, !1), (g = h.onVnodeBeforeUpdate) && xi(g, r, t, e), f && Tn(t, e, r, "beforeUpdate"), r && Ur(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? ne(e.dynamicChildren, d, l, r, i, Hr(t, a), o) : s || ce(e, t, l, null, r, i, Hr(t, a), o, !1), u > 0) {
			if (u & 16) O(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && O(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && q(() => {
			g && xi(g, r, t, e), f && Tn(t, e, r, "updated");
		}, i);
	}, ne = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Yr(c), d = u && (c.type === J || !ci(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, O = (e, t, r, i, a) => {
		if (t !== r) {
			if (t !== n) for (let n in t) !ee(n) && !(n in r) && c(e, n, t[n], null, a, i);
			for (let n in r) {
				if (ee(n)) continue;
				let o = r[n], s = t[n];
				o !== s && n !== "value" && c(e, n, s, o, a, i);
			}
			"value" in r && c(e, "value", t.value, r.value, a);
		}
	}, re = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), te(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ne(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Gr(e, t, !0)) : ce(e, t, n, f, i, a, s, c, l);
	}, ie = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : k(t, n, r, i, a, o, c) : j(e, t, c);
	}, k = (e, t, n, r, i, a, o) => {
		let s = e.component = Ti(e, r, i);
		if (Gn(e) && (s.ctx.renderer = ve), Ni(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o, a), !e.el) {
				let r = s.subTree = di($r);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, j = (e, t, n) => {
		let r = t.component = e.component;
		if (yr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, oe(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, ae = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = qr(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							q(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Ur(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && A(n), (d = t.props && t.props.onVnodeBeforeUpdate) && xi(d, s, t, c), Ur(e, !0);
				let f = hr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ge(p), e, i, a), t.el = f.el, u === null && Sr(e, f.el), r && q(r, i), (d = t.props && t.props.onVnodeUpdated) && q(() => xi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Wn(t);
				if (Ur(e, !1), l && A(l), !m && (o = c && c.onVnodeBeforeMount) && xi(o, d, t), Ur(e, !0), s && ye) {
					let t = () => {
						e.subTree = hr(e), ye(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = hr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && q(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					q(() => xi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Wn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && q(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ee(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => fn(u), Ur(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Dr(e, t.props, r, n), zr(e, t.children, n), Ve(), hn(e), He();
	}, ce = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ue(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && he(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ue(l, d, n, r, i, a, o, s, c) : he(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && te(d, n, r, i, a, o, s, c));
	}, le = (e, t, n, i, a, o, s, c, l) => {
		e ||= r, t ||= r;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? vi(t[p]) : _i(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? he(e, a, o, !0, !1, f) : te(t, n, i, a, o, s, c, l, f);
	}, ue = (e, t, n, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? vi(t[u]) : _i(t[u]);
			if (ci(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? vi(t[p]) : _i(t[p]);
			if (ci(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, r = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? vi(t[u]) : _i(t[u]), n, r, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) M(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? vi(t[u]) : _i(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					M(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ci(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? M(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Kr(C) : r;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, r = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Yr(f) : i;
				C[u] === 0 ? v(null, r, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? de(r, n, p, 2) : _--);
			}
		}
	}, de = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) de(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, ve);
		else if (c === J) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === ei) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Pn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), q(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Pn];
					a._isLeaving && a[Pn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, M = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ve(), Hn(s, null, n, e, !0), He()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Wn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && xi(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Tn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ve, r) : l && !l.hasOnce && (a !== J || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === J && d & 384 || !i && u & 16) && he(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && q(() => {
			_ && xi(_, t, e), h && Tn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === J;
		if (a && !i) {
			pe(n, r);
			return;
		}
		if (t === ei) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Rn(e) : e, c = () => {
			a ? m(n) && pe(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, pe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, me = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Jr(c), Jr(l), r && A(r), i.stop(), a ? (a.flags |= 8, M(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, M(o, e, t, n)), s && q(s, t), q(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) M(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Mn];
		return n ? h(n) : t;
	}, _e = (e, t, n) => {
		vn(() => {
			e == null ? t._vnode && M(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : wi());
	}, ve = {
		p: v,
		um: M,
		m: de,
		r: fe,
		mt: k,
		mc: te,
		pc: ce,
		pbc: ne,
		n: ge,
		o: e
	}, N, ye;
	return t && ([N, ye] = t(ve)), {
		render: _e,
		hydrate: N,
		createApp: lr(_e, N)
	};
}
function Hr({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ur({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Wr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Gr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (f(r) && f(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = vi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Gr(t, a)), a.type === Qr && (a.patchFlag === -1 && (a = i[e] = vi(a)), a.el = t.el), a.type === $r && !a.el && (a.el = t.el);
	}
}
function Kr(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function qr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : qr(t);
}
function Jr(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Yr(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Yr(t.subTree) : null;
}
var Xr = (e) => e.__isSuspense;
function Zr(e, t) {
	t && t.pendingBranch ? f(e) ? t.effects.push(...e) : t.effects.push(e) : mn(e);
}
var J = /* @__PURE__ */ Symbol.for("v-fgt"), Qr = /* @__PURE__ */ Symbol.for("v-txt"), $r = /* @__PURE__ */ Symbol.for("v-cmt"), ei = /* @__PURE__ */ Symbol.for("v-stc"), ti = [], Y = null;
function X(e = !1) {
	ti.push(Y = e ? null : []);
}
function ni() {
	ti.pop(), Y = ti[ti.length - 1] || null;
}
var ri = 1;
function ii(e, t = !1) {
	ri += e, e < 0 && Y && t && (Y.hasOnce = !0);
}
function ai(e) {
	return e.dynamicChildren = ri > 0 ? Y || r : null, ni(), ri > 0 && Y && Y.push(e), e;
}
function Z(e, t, n, r, i, a) {
	return ai(Q(e, t, n, r, i, a, !0));
}
function oi(e, t, n, r, i) {
	return ai(di(e, t, n, r, i, !0));
}
function si(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ci(e, t) {
	return e.type === t.type && e.key === t.key;
}
var li = ({ key: e }) => e ?? null, ui = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : _(e) || /* @__PURE__ */ V(e) || g(e) ? {
	i: K,
	r: e,
	k: t,
	f: !!n
} : e);
function Q(e, t = null, n = null, r = 0, i = null, a = e === J ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && li(t),
		ref: t && ui(t),
		scopeId: xn,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: K
	};
	return s ? (yi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= _(n) ? 8 : 16), ri > 0 && !o && Y && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Y.push(c), c;
}
var di = fi;
function fi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Qn || (e = $r), si(e)) {
		let r = mi(e, t, !0);
		return n && yi(r, n), ri > 0 && !a && Y && (r.shapeFlag & 6 ? Y[Y.indexOf(e)] = r : Y.push(r)), r.patchFlag = -2, r;
	}
	if (Vi(e) && (e = e.__vccOpts), t) {
		t = pi(t);
		let { class: e, style: n } = t;
		e && !_(e) && (t.class = fe(e)), y(n) && (/* @__PURE__ */ zt(n) && !f(n) && (n = c({}, n)), t.style = ce(n));
	}
	let o = _(e) ? 1 : Xr(e) ? 128 : Nn(e) ? 64 : y(e) ? 4 : g(e) ? 2 : 0;
	return Q(e, t, n, r, i, o, a, !0);
}
function pi(e) {
	return e ? /* @__PURE__ */ zt(e) || Tr(e) ? c({}, e) : e : null;
}
function mi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? bi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && li(l),
		ref: t && t.ref ? n && a ? f(a) ? a.concat(ui(t)) : [a, ui(t)] : ui(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== J ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && mi(e.ssContent),
		ssFallback: e.ssFallback && mi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Ln(u, c.clone(u)), u;
}
function hi(e = " ", t = 0) {
	return di(Qr, null, e, t);
}
function gi(e = "", t = !1) {
	return t ? (X(), oi($r, null, e)) : di($r, null, e);
}
function _i(e) {
	return e == null || typeof e == "boolean" ? di($r) : f(e) ? di(J, null, e.slice()) : si(e) ? vi(e) : di(Qr, null, String(e));
}
function vi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : mi(e);
}
function yi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (f(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), yi(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Tr(t) ? t._ctx = K : r === 3 && K && (K.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (g(t)) {
		if (r & 65) {
			yi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: K
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [hi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function bi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = fe([t.class, r.class]));
		else if (e === "style") t.style = ce([t.style, r.style]);
		else if (o(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(f(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !s(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function xi(e, t, n, r = null) {
	tn(e, t, 7, [n, r]);
}
var Si = sr(), Ci = 0;
function wi() {
	return Ci;
}
function Ti(e, t, r) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || Si, o = {
		uid: Ci++,
		vnode: e,
		type: i,
		parent: t,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Ce(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(a.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Ar(i, a),
		emitsOptions: pr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: n,
		inheritAttrs: i.inheritAttrs,
		ctx: n,
		data: n,
		props: n,
		attrs: n,
		slots: n,
		refs: n,
		setupState: n,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = fr.bind(null, o), e.ce && e.ce(o), o;
}
var $ = null, Ei = () => $ || K, Di, Oi;
{
	let e = se(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Di = t("__VUE_INSTANCE_SETTERS__", (e) => $ = e), Oi = t("__VUE_SSR_SETTERS__", (e) => Mi = e);
}
var ki = (e) => {
	let t = $;
	return Di(e), e.scope.on(), () => {
		e.scope.off(), Di(t);
	};
}, Ai = () => {
	$ && $.scope.off(), Di(null);
};
function ji(e) {
	return e.vnode.shapeFlag & 4;
}
var Mi = !1;
function Ni(e, t = !1, n = !1) {
	t && Oi(t);
	let { props: r, children: i } = e.vnode, a = ji(e);
	Er(e, r, a, t), Rr(e, i, n || t);
	let o = a ? Pi(e, t) : void 0;
	return t && Oi(!1), o;
}
function Pi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, or);
	let { setup: r } = n;
	if (r) {
		Ve();
		let n = e.setupContext = r.length > 1 ? Ri(e) : null, i = ki(e), a = en(r, e, 0, [e.props, n]), o = b(a);
		if (He(), i(), (o || e.sp) && !Wn(e) && zn(e), o) {
			if (a.then(Ai, Ai), t) return a.then((n) => {
				Oi(!0);
				try {
					Fi(e, n, t);
				} finally {
					Oi(!1);
				}
			}).catch((t) => {
				nn(t, e, 0);
			});
			e.asyncDep = a;
		} else Fi(e, a, t);
	} else Ii(e, t);
}
function Fi(e, t, n) {
	g(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : y(t) && (e.setupState = Gt(t)), Ii(e, n);
}
function Ii(e, t, n) {
	let r = e.type;
	e.render ||= r.render || i;
}
var Li = { get(e, t) {
	return L(e, "get", ""), e[t];
} };
function Ri(e) {
	return {
		attrs: new Proxy(e.attrs, Li),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function zi(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Gt(Bt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ir) return ir[n](e);
		},
		has(e, t) {
			return t in e || t in ir;
		}
	}) : e.proxy;
}
function Bi(e, t = !0) {
	return g(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Vi(e) {
	return g(e) && "__vccOpts" in e;
}
var Hi = (e, t) => /* @__PURE__ */ qt(e, t, Mi), Ui = "3.5.44", Wi = void 0, Gi = typeof window < "u" && window.trustedTypes;
if (Gi) try {
	Wi = /* @__PURE__ */ Gi.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ki = Wi ? (e) => Wi.createHTML(e) : (e) => e, qi = "http://www.w3.org/2000/svg", Ji = "http://www.w3.org/1998/Math/MathML", Yi = typeof document < "u" ? document : null, Xi = Yi && /* @__PURE__ */ Yi.createElement("template"), Zi = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Yi.createElementNS(qi, e) : t === "mathml" ? Yi.createElementNS(Ji, e) : n ? Yi.createElement(e, { is: n }) : Yi.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Yi.createTextNode(e),
	createComment: (e) => Yi.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Yi.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Xi.innerHTML = Ki(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Xi.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Qi = /* @__PURE__ */ Symbol("_vtc");
function $i(e, t, n) {
	let r = e[Qi];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var ea = /* @__PURE__ */ Symbol("_vod"), ta = /* @__PURE__ */ Symbol("_vsh"), na = /* @__PURE__ */ Symbol(""), ra = /(?:^|;)\s*display\s*:/;
function ia(e, t, n) {
	let r = e.style, i = _(n), a = !1;
	if (n && !i) {
		if (t) {
			if (_(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? oa(r, t, "");
			}
			else for (let e in t) n[e] ?? oa(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? oa(r, i, "") : ua(e, i, !_(t) && t ? t[i] : void 0, o) || oa(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[na];
			e && (n += ";" + e), r.cssText = n, a = ra.test(n);
		}
	} else t && e.removeAttribute("style");
	ea in e && (i && t === n || (e[ea] = a ? r.display : ""), e[ta] && (r.display = "none"));
}
var aa = /\s*!important$/;
function oa(e, t, n) {
	if (f(n)) n.forEach((n) => oa(e, t, n));
	else if (n ??= "", t.startsWith("--")) aa.test(n) ? e.setProperty(t, n.replace(aa, ""), "important") : e.setProperty(t, n);
	else {
		let r = la(e, t);
		aa.test(n) ? e.setProperty(O(r), n.replace(aa, ""), "important") : e[r] = n;
	}
}
var sa = [
	"Webkit",
	"Moz",
	"ms"
], ca = {};
function la(e, t) {
	let n = ca[t];
	if (n) return n;
	let r = D(t);
	if (r !== "filter" && r in e) return ca[t] = r;
	r = re(r);
	for (let n = 0; n < sa.length; n++) {
		let i = sa[n] + r;
		if (i in e) return ca[t] = i;
	}
	return t;
}
function ua(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && _(r) && n === r;
}
var da = "http://www.w3.org/1999/xlink";
function fa(e, t, n, r, i, a = pe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(da, t.slice(6, t.length)) : e.setAttributeNS(da, t, n) : n == null || a && !me(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : v(n) ? String(n) : n);
}
function pa(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ki(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		r === i && "_value" in e || (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = me(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function ma(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function ha(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var ga = /* @__PURE__ */ Symbol("_vei");
function _a(e, t, n, r, i = null) {
	let a = e[ga] || (e[ga] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ba(t);
		r ? ma(e, n, a[t] = wa(r, i), s) : o && (ha(e, n, o, s), a[t] = void 0);
	}
}
var va = /(Once|Passive|Capture)$/, ya = /^on:?(?:Once|Passive|Capture)$/;
function ba(e) {
	let t, n;
	for (; (n = e.match(va)) && !ya.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : O(e.slice(2)), t];
}
var xa = 0, Sa = /* @__PURE__ */ Promise.resolve(), Ca = () => xa ||= (Sa.then(() => xa = 0), Date.now());
function wa(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (f(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && tn(e, t, 5, a);
			}
		} else tn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ca(), n;
}
var Ta = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ea = (e, t, n, r, i, a) => {
	let c = i === "svg";
	t === "class" ? $i(e, r, c) : t === "style" ? ia(e, n, r) : o(t) ? s(t) || _a(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Da(e, t, r, c)) ? (pa(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || fa(e, t, r, c, a, t !== "value")) : e._isVueCE && (Oa(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !_(r))) ? pa(e, D(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), fa(e, t, r, c));
};
function Da(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Ta(t) && g(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Ta(t) && _(n) ? !1 : t in e;
}
function Oa(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = D(t);
	return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
}
var ka = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return f(t) ? (e) => A(t, e) : t;
};
function Aa(e) {
	e.target.composing = !0;
}
function ja(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Ma = /* @__PURE__ */ Symbol("_assign"), Na = /* @__PURE__ */ Symbol("_initialValue");
function Pa(e, t, n) {
	return t && (e = e.trim()), n && (e = ae(e)), e;
}
var Fa = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Na] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Na] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Ma] = ka(i);
		let a = r || i.props && i.props.type === "number";
		ma(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Ma](Pa(e.value, n, a));
		}), (n || a) && ma(e, "change", () => {
			e.value = Pa(e.value, n, a);
		}), t || (ma(e, "compositionstart", Aa), ma(e, "compositionend", ja), ma(e, "change", ja));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Na];
		delete e[Na], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Ma](Pa(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Ma] = ka(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ae(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Ia = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, ma(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ae(za(e)) : za(e)), r = e.multiple, i = r ? m(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? f(i) ? t.slice() : t : i];
			try {
				e[Ma](i);
			} finally {
				un(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Ma] = ka(r);
	},
	mounted(e, { value: t }) {
		Ra(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Ma] = ka(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && La(t, n[1], n[0]) || Ra(e, t);
	}
};
function La(e, t, n) {
	if (!n || f(e)) return N(e, t);
	if (m(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Ra(e, t) {
	let n = e.multiple, r = f(t);
	if (!n || r || m(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = za(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : ye(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (N(za(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function za(e) {
	return "_value" in e ? e._value : e.value;
}
var Ba = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Va = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => Ba.some((n) => e[`${n}Key`] && !t.includes(n))
}, Ha = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Va[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Ua = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Wa = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = O(n.key);
		if (t.some((e) => e === r || Ua[e] === r)) return e(n);
	}));
}, Ga = /* @__PURE__ */ c({ patchProp: Ea }, Zi), Ka;
function qa() {
	return Ka ||= Br(Ga);
}
var Ja = ((...e) => {
	let t = qa().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Xa(e);
		if (!r) return;
		let i = t._component;
		g(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ya(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ya(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Xa(e) {
	return _(e) ? document.querySelector(e) : e;
}
// services/portal/src/rebost/AssetCard.vue
var Za = ["aria-label"], Qa = ["src", "alt"], $a = ["value"], eo = {
	key: 2,
	class: "credit"
}, to = { key: 3 }, no = { class: "actions" }, ro = ["aria-expanded"], io = ["hidden"], ao = {
	__name: "AssetCard",
	props: {
		item: {
			type: Object,
			required: !0
		},
		nested: Boolean
	},
	setup(e) {
		let t = e, { api: n, t: r, locale: i, authenticated: a, picking: o, familySelection: s, types: c, run: l, refresh: u, chooseCollection: d, preview: f, select: p, download: m, report: h } = Dn("rebost"), g = /* @__PURE__ */ H(""), _ = /* @__PURE__ */ H(""), v = /* @__PURE__ */ H(""), y = /* @__PURE__ */ H(!1), b = /* @__PURE__ */ H(null), x = !0, S = 0, C = Hi(() => {
			if (!["catalog", "scratch"].includes(t.item.collection)) return t.item.name;
			let e = t.item.names || {};
			return e[i.value] || i.value === "va" && e.ca || e.es || e.ca || e.en || t.item.name || t.item.id;
		}), w = Hi(() => !t.nested && t.item.collection === "scratch" && t.item.family?.count > 1), T = Hi(() => ["catalog", "scratch"].includes(t.item.collection) ? t.item : t.item.provenance);
		An(() => t.item, async (e) => {
			g.value = e.name, _.value = e.type, y.value = !1, b.value = null;
			let t = ++S;
			URL.revokeObjectURL(v.value), v.value = "";
			try {
				let r = await n.read(e.id, !0);
				x && t === S && (v.value = URL.createObjectURL(r));
			} catch (e) {
				x && t === S && h(e);
			}
		}, { immediate: !0 }), Yn(() => {
			x = !1, S++, URL.revokeObjectURL(v.value);
		});
		async function ee() {
			await l(async () => {
				if (!b.value) {
					let e = await n.family(t.item.family.id);
					if (e.id !== t.item.family.id || e.revision !== t.item.family.revision) throw Error("revision_conflict");
					if (!x) return;
					b.value = e.items;
				}
				y.value = !y.value;
			});
		}
		function E() {
			return l(async () => {
				if (!a.value) return await d("mine"), "login_required";
				await n.duplicate(t.item);
				try {
					await d("mine");
				} catch (e) {
					return h(e), "saved_refresh_failed";
				}
				return "image_saved";
			});
		}
		function te() {
			confirm(r("rebost.confirm")) && l(async () => {
				await n.remove(t.item), await u();
			});
		}
		return (t, i) => {
			let d = Zn("AssetCard", !0);
			return X(), oi($n(e.nested ? "section" : "article"), {
				"data-id": e.item.id,
				class: fe({
					"family-costume": e.nested,
					"expanded-family": y.value
				})
			}, {
				default: Cn(() => [
					Q("button", {
						type: "button",
						class: "image secondary",
						"aria-label": U(r)("rebost.view") + ": " + C.value,
						onClick: i[0] ||= (t) => U(l)(() => U(f)(e.item, C.value))
					}, [Q("img", {
						src: v.value || void 0,
						alt: C.value
					}, null, 8, Qa)], 8, Za),
					U(o) || e.item.readonly ? (X(), Z(J, { key: 0 }, [(X(), oi($n(e.nested ? "h3" : "h2"), null, {
						default: Cn(() => [hi(P(C.value), 1)]),
						_: 1
					})), Q("span", null, P(U(r)("rebost." + e.item.type)), 1)], 64)) : (X(), Z(J, { key: 1 }, [Q("label", null, [hi(P(U(r)("rebost.name")), 1), wn(Q("input", {
						"onUpdate:modelValue": i[1] ||= (e) => g.value = e,
						maxlength: "200",
						required: ""
					}, null, 512), [[Fa, g.value]])]), Q("label", null, [hi(P(U(r)("rebost.filter")), 1), wn(Q("select", { "onUpdate:modelValue": i[2] ||= (e) => _.value = e }, [(X(!0), Z(J, null, nr(U(c), (e) => (X(), Z("option", {
						key: e,
						value: e
					}, P(U(r)("rebost." + e)), 9, $a))), 128))], 512), [[Ia, _.value]])])], 64)),
					T.value && !e.nested ? (X(), Z("p", eo, P(T.value.attribution) + " · " + P(T.value.license), 1)) : gi("", !0),
					w.value ? (X(), Z("span", to, P(e.item.family.count) + " " + P(U(r)("rebost.costumeCount")), 1)) : gi("", !0),
					Q("small", null, P(e.item.width) + " × " + P(e.item.height) + " px", 1),
					Q("div", no, [
						U(o) ? (X(), Z("button", {
							key: 0,
							type: "button",
							onClick: i[3] ||= (t) => U(p)(e.item, C.value, w.value && U(s))
						}, P(w.value && U(s) ? U(r)("rebost.addFamily") : U(r)("rebost.choose")), 1)) : e.item.readonly ? (X(), Z("button", {
							key: 1,
							type: "button",
							onClick: E
						}, P(U(a) ? w.value ? U(r)("rebost.saveImage") : U(r)("rebost.saveCopy") : U(r)("rebost.loginToSave")), 1)) : (X(), Z(J, { key: 2 }, [
							Q("button", {
								type: "button",
								onClick: i[4] ||= (t) => {
									U(l)(async () => {
										await U(n).update(e.item, g.value, _.value);
										try {
											await U(u)();
										} catch (e) {
											return U(h)(e), "saved_refresh_failed";
										}
										return "success";
									});
								}
							}, P(U(r)("rebost.save")), 1),
							Q("button", {
								type: "button",
								class: "secondary",
								onClick: i[5] ||= (t) => {
									U(l)(async () => {
										await U(n).duplicate(e.item);
										try {
											await U(u)();
										} catch (e) {
											return U(h)(e), "saved_refresh_failed";
										}
										return "image_saved";
									});
								}
							}, P(U(r)("rebost.duplicate")), 1),
							Q("button", {
								type: "button",
								class: "danger",
								onClick: te
							}, P(U(r)("rebost.remove")), 1)
						], 64)),
						T.value && !U(o) ? (X(), Z(J, { key: 3 }, [Q("button", {
							type: "button",
							class: "secondary",
							onClick: i[6] ||= (t) => U(l)(() => U(m)(e.item))
						}, P(U(r)("rebost.source")), 1), Q("button", {
							type: "button",
							class: "secondary",
							onClick: i[7] ||= (t) => U(l)(() => U(m)(e.item, !0))
						}, P(U(r)("rebost.license")), 1)], 64)) : gi("", !0),
						w.value ? (X(), Z("button", {
							key: 4,
							class: "secondary",
							type: "button",
							"aria-expanded": y.value,
							onClick: ee
						}, P(y.value ? U(r)("rebost.hideCostumes") : U(r)("rebost.costumes")), 9, ro)) : gi("", !0)
					]),
					b.value ? (X(), Z("div", {
						key: 4,
						class: "family-variants",
						hidden: !y.value
					}, [(X(!0), Z(J, null, nr(b.value, (e) => (X(), oi(d, {
						key: e.id,
						item: e,
						nested: ""
					}, null, 8, ["item"]))), 128))], 8, io)) : gi("", !0)
				]),
				_: 1
			}, 8, ["data-id", "class"]);
		};
	}
};
// services/portal/src/shared/usePortalTranslations.js
function oo() {
	let e = /* @__PURE__ */ H(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), Yn(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
}
// services/portal/src/rebost/RebostApp.vue
var so = { class: "topbar" }, co = {
	key: 0,
	class: "brand-lockup"
}, lo = { class: "topbar-actions" }, uo = {
	key: 0,
	id: "accountWidget"
}, fo = { class: "single-layout rebost-layout" }, po = { class: "role-heading" }, mo = {
	id: "intro",
	class: "teacher-intro"
}, ho = ["hidden"], go = { id: "accessHint" }, _o = { class: "actions" }, vo = ["target"], yo = ["target"], bo = ["disabled", "hidden"], xo = { id: "mine" }, So = { class: "library-toolbar panel" }, Co = ["aria-label"], wo = ["aria-pressed"], To = ["hidden", "aria-pressed"], Eo = ["hidden", "aria-pressed"], Do = { id: "collectionHint" }, Oo = ["hidden"], ko = ["aria-label", "onKeydown"], Ao = { id: "uploadText" }, jo = { id: "formats" }, Mo = { id: "uploadTypeLabel" }, No = ["value"], Po = ["hidden"], Fo = { id: "searchLabel" }, Io = ["placeholder"], Lo = { id: "filterLabel" }, Ro = ["value"], zo = ["hidden"], Bo = ["aria-label", "hidden"], Vo = ["hidden"], Ho = ["aria-label"], Uo = ["src", "alt"];
// services/portal/src/rebost/main.js
Ja({
	__name: "RebostApp",
	setup(t) {
		let n = new e();
		window.commonsDeployment?.mode;
		let r = new URLSearchParams(location.search), i = r.get("mode") === "pick" && window.parent !== window, a = r.get("type") === "background" ? "background" : "sprite", o = i && a === "sprite" && r.get("supports_families") === "1" && r.get("selection") === "sprite", s = [
			"sprite",
			"background",
			"object",
			"illustration"
		], c = i ? a === "background" ? ["background"] : [
			"sprite",
			"object",
			"illustration"
		] : ["", ...s];
		i && [
			"es",
			"ca",
			"va",
			"en"
		].includes(r.get("lang")) && window.i18nPortal.setLang(r.get("lang"));
		let l = /* @__PURE__ */ H(window.i18nPortal.getLang()), u = oo(), d = /* @__PURE__ */ H(!1), f = /* @__PURE__ */ H(!1), p = /* @__PURE__ */ H(!1), m = /* @__PURE__ */ H([]), h = /* @__PURE__ */ H([
			"mine",
			"catalog",
			"scratch"
		].includes(r.get("collection")) ? r.get("collection") : ""), g = /* @__PURE__ */ H(""), _ = /* @__PURE__ */ H(i ? a : ""), v = /* @__PURE__ */ H("sprite"), y = /* @__PURE__ */ H([]), b = /* @__PURE__ */ H(""), x = /* @__PURE__ */ H(""), S = /* @__PURE__ */ H(!1), C = /* @__PURE__ */ H(null), w = /* @__PURE__ */ H(null), T = /* @__PURE__ */ H(""), ee = /* @__PURE__ */ H(""), E = Hi(() => h.value === "mine" && !f.value), te = Hi(() => u("rebost." + (h.value || "mine"))), D = !0, ne = 0, O, re = "";
		function ie() {
			l.value = window.i18nPortal.getLang();
		}
		function k(e) {
			x.value = u("rebost." + e.message) === "rebost." + e.message ? "error" : e.message, e.status === 401 && (f.value = !1, h.value === "mine" && (ne++, y.value = [], b.value = "", M()));
		}
		async function A(e) {
			if (!p.value && D) {
				p.value = !0, x.value = "working";
				try {
					let t = await e();
					D && (x.value = typeof t == "string" ? t : "", x.value && document.getElementById("status")?.scrollIntoView({ block: "nearest" }));
				} catch (e) {
					[404, 412].includes(e.status) && await j().catch(() => {}), D && k(e);
				} finally {
					p.value = !1;
				}
			}
		}
		async function j(e = !1) {
			let t = ++ne;
			if (E.value) {
				y.value = [], b.value = "", M();
				return;
			}
			let r = JSON.stringify([
				h.value,
				g.value,
				_.value
			]);
			e &&= r === re;
			let i = await n.list({
				collection: h.value,
				q: g.value,
				type: _.value,
				cursor: e ? b.value : "",
				grouped: h.value === "scratch"
			});
			D && t === ne && (h.value !== "mine" || f.value) && (y.value = e ? [...y.value, ...i.items] : i.items, b.value = i.next_cursor, re = r);
		}
		async function ae(e) {
			h.value = e, g.value = "", _.value = i ? a : "", clearTimeout(O);
			let t = new URL(location.href);
			t.searchParams.set("collection", e), history.replaceState(null, "", t), y.value = [], b.value = "", await j();
		}
		function oe() {
			clearTimeout(O), O = setTimeout(async () => {
				D && (p.value ? oe() : await A(() => j()));
			}, 250);
		}
		async function se(e) {
			i || E.value || h.value !== "mine" || !d.value || await A(async () => {
				try {
					for (let t of e) await n.add(t, t.name.replace(/\.[^.]+$/, "").slice(0, 200) || "Imatge", v.value);
				} catch (e) {
					throw await j().catch(() => {}), e;
				}
				try {
					await j();
				} catch (e) {
					return k(e), "saved_refresh_failed";
				}
				return "image_saved";
			});
		}
		function ce() {
			d.value && !p.value && C.value.click();
		}
		function le(e) {
			let t = [...e.target.files];
			e.target.value = "", se(t);
		}
		function ue(e) {
			S.value = !1, se([...e.dataTransfer.files]);
		}
		function de() {
			URL.revokeObjectURL(T.value), T.value = "", ee.value = "";
		}
		function M() {
			w.value?.close(), de();
		}
		async function pe(e, t) {
			let r = await n.read(e.id);
			D && (e.collection !== "mine" || f.value) && (de(), T.value = URL.createObjectURL(r), ee.value = t, w.value.showModal());
		}
		function me(e, t, n) {
			window.parent.postMessage({
				format: "rebost-selection",
				version: 1,
				request: r.get("request") || "",
				id: e.id,
				name: t,
				...n ? {
					family: !0,
					familyRevision: e.family.revision
				} : {}
			}, location.origin);
		}
		function he(e) {
			i && e.key === "Escape" && !w.value?.open && window.parent.postMessage({
				format: "rebost-selection",
				version: 1,
				request: r.get("request") || "",
				cancel: !0
			}, location.origin);
		}
		async function ge(e, t = !1) {
			let r = await n.source(e.id, t), i = URL.createObjectURL(r), a = document.createElement("a");
			a.href = i, a.download = e.id + (t ? ".license.txt" : ".source.svg"), document.body.append(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 1e3);
		}
		let _e = !1;
		async function ve() {
			if (d.value && !p.value && !_e && D) {
				_e = !0;
				try {
					let e;
					try {
						await n.me(), e = !0;
					} catch (t) {
						if (t.status !== 401) throw t;
						e = !1;
					}
					if (!D || e === f.value) return;
					f.value = e, e || (ne++, y.value = [], b.value = "", M()), await A(() => j());
				} catch (e) {
					D && k(e);
				} finally {
					_e = !1;
				}
			}
		}
		function N(e) {
			e.persisted || (ne++, y.value = [], de());
		}
		return En("rebost", {
			api: n,
			t: u,
			locale: l,
			authenticated: f,
			picking: i,
			familySelection: o,
			types: s,
			run: A,
			refresh: j,
			chooseCollection: ae,
			preview: pe,
			select: me,
			download: ge,
			report: k
		}), Jn(async () => {
			document.body.classList.toggle("picking", i), window.addEventListener("edutictac:langchange", ie), window.addEventListener("focus", ve), window.addEventListener("edutictac:sessionchange", ve), window.addEventListener("pagehide", N), document.addEventListener("keydown", he), await A(async () => {
				let e;
				try {
					e = await n.me(), f.value = !0;
				} catch (t) {
					if (t.status !== 401) throw t;
					e = await n.catalogs();
				}
				m.value = e.capabilities, h.value ||= f.value ? "mine" : "catalog", (h.value === "catalog" && !m.value.includes("catalog") || h.value === "scratch" && !m.value.includes("scratch_catalog")) && (h.value = "mine"), d.value = !0, await j();
			});
		}), Yn(() => {
			D = !1, ne++, clearTimeout(O), de(), window.removeEventListener("edutictac:langchange", ie), window.removeEventListener("focus", ve), window.removeEventListener("edutictac:sessionchange", ve), window.removeEventListener("pagehide", N), document.removeEventListener("keydown", he), document.body.classList.remove("picking");
		}), (e, t) => (X(), Z(J, null, [Q("header", so, [U(i) ? gi("", !0) : (X(), Z("div", co, [...t[12] ||= [Q("img", {
			src: "/commons-mark.svg",
			alt: "",
			width: "46",
			height: "46"
		}, null, -1), Q("div", null, [Q("p", { class: "eyebrow" }, "EduTicTac Commons"), Q("h1", null, "EduTicTac Rebost")], -1)]])), Q("div", lo, [U(i) ? (X(), Z("p", {
			key: 1,
			id: "sessionStatus",
			class: fe(["status session-status", { signed: f.value }]),
			role: "status"
		}, P(d.value ? f.value ? U(u)("rebost.signedIn") : U(u)("rebost.signedOut") : U(u)("rebost.checkingSession")), 3)) : (X(), Z("edutictac-account", uo))])]), Q("main", fo, [
			Q("div", po, [
				t[13] ||= Q("p", { class: "eyebrow" }, "EduTicTac Rebost", -1),
				Q("h2", null, P(U(u)("rebost.heading")), 1),
				Q("p", mo, P(U(u)("rebost.intro")), 1)
			]),
			Q("p", {
				id: "status",
				class: fe({
					success: ["success", "image_saved"].includes(x.value),
					error: x.value && ![
						"success",
						"image_saved",
						"working"
					].includes(x.value)
				}),
				role: "status",
				"aria-live": "polite"
			}, P(x.value ? U(u)("rebost." + x.value) : ""), 3),
			Q("section", {
				id: "access",
				class: "panel",
				hidden: !d.value || f.value || U(i) && h.value !== "mine"
			}, [Q("p", go, P(U(u)("rebost.access")), 1), Q("div", _o, [Q("a", {
				class: "button-link secondary",
				id: "studentLogin",
				href: "/student.html?next=%2Fassets%2F",
				target: U(i) ? "_blank" : void 0,
				rel: "noopener noreferrer"
			}, P(U(u)("rebost.student")), 9, vo), Q("a", {
				class: "button-link",
				id: "oidcLogin",
				href: "/api/auth/oidc/login?next=%2Fassets%2F",
				target: U(i) ? "_blank" : void 0,
				rel: "noopener noreferrer"
			}, P(U(u)("rebost.oidc")), 9, yo)])], 8, ho),
			Q("fieldset", {
				id: "controls",
				disabled: p.value || !d.value,
				hidden: !d.value
			}, [
				Q("legend", xo, P(te.value), 1),
				Q("div", So, [
					Q("div", {
						id: "collections",
						class: "collections",
						role: "group",
						"aria-label": U(u)("rebost.collection")
					}, [
						Q("button", {
							id: "mineTab",
							class: "secondary",
							type: "button",
							"aria-pressed": h.value === "mine",
							onClick: t[0] ||= (e) => A(() => ae("mine"))
						}, P(U(u)("rebost.mine")) + P(f.value ? "" : " · " + U(u)("common.login")), 9, wo),
						Q("button", {
							id: "catalogTab",
							class: "secondary",
							type: "button",
							hidden: !m.value.includes("catalog"),
							"aria-pressed": h.value === "catalog",
							onClick: t[1] ||= (e) => A(() => ae("catalog"))
						}, P(U(u)("rebost.catalog")), 9, To),
						Q("button", {
							id: "scratchTab",
							class: "secondary",
							type: "button",
							hidden: !m.value.includes("scratch_catalog"),
							"aria-pressed": h.value === "scratch",
							onClick: t[2] ||= (e) => A(() => ae("scratch"))
						}, P(U(u)("rebost.scratch")), 9, Eo)
					], 8, Co),
					Q("p", Do, P(U(i) ? U(u)("rebost.pickHint") : h.value === "mine" ? U(u)("rebost.privateHint") : h.value === "scratch" ? U(u)("rebost.scratchHint") : U(u)("rebost.catalogHint")), 1),
					Q("div", {
						id: "uploadArea",
						hidden: U(i) || h.value !== "mine" || !f.value
					}, [Q("section", {
						id: "drop",
						tabindex: "0",
						role: "button",
						"aria-label": U(u)("rebost.upload"),
						class: fe({ drag: S.value }),
						onClick: ce,
						onKeydown: [Wa(Ha(ce, ["self", "prevent"]), ["enter"]), Wa(Ha(ce, ["self", "prevent"]), ["space"])],
						onDragenter: t[4] ||= Ha((e) => S.value = !0, ["prevent"]),
						onDragover: t[5] ||= Ha((e) => S.value = !0, ["prevent"]),
						onDragleave: t[6] ||= (e) => S.value = !1,
						onDrop: Ha(ue, ["prevent"])
					}, [
						Q("strong", Ao, P(U(u)("rebost.upload")), 1),
						Q("p", jo, P(U(u)("rebost.formats")), 1),
						Q("input", {
							id: "files",
							ref_key: "filesInput",
							ref: C,
							type: "file",
							accept: "image/png,image/jpeg,image/webp",
							multiple: "",
							hidden: "",
							onClick: t[3] ||= Ha(() => {}, ["stop"]),
							onChange: le
						}, null, 544)
					], 42, ko), Q("label", null, [Q("span", Mo, P(U(u)("rebost.uploadType")), 1), wn(Q("select", {
						id: "uploadType",
						"onUpdate:modelValue": t[7] ||= (e) => v.value = e
					}, [(X(), Z(J, null, nr(s, (e) => Q("option", {
						key: e,
						value: e
					}, P(U(u)("rebost." + e)), 9, No)), 64))], 512), [[Ia, v.value]])])], 8, Oo),
					Q("div", {
						class: "filters",
						hidden: E.value
					}, [Q("label", null, [Q("span", Fo, P(U(u)("rebost.search")), 1), wn(Q("input", {
						id: "search",
						"onUpdate:modelValue": t[8] ||= (e) => g.value = e,
						type: "search",
						placeholder: U(u)("rebost.searchPlaceholder"),
						maxlength: "200",
						onInput: oe
					}, null, 40, Io), [[Fa, g.value]])]), Q("label", null, [Q("span", Lo, P(U(u)("rebost.filter")), 1), wn(Q("select", {
						id: "filter",
						"onUpdate:modelValue": t[9] ||= (e) => _.value = e,
						onChange: t[10] ||= (e) => A(() => j())
					}, [(X(!0), Z(J, null, nr(U(c), (e) => (X(), Z("option", {
						key: e,
						value: e
					}, P(e ? U(u)("rebost." + e) : U(u)("rebost.all")), 9, Ro))), 128))], 544), [[Ia, _.value]])])], 8, Po)
				]),
				Q("p", {
					id: "empty",
					hidden: E.value || y.value.length > 0 || p.value
				}, P(U(u)("rebost.empty")), 9, zo),
				Q("section", {
					id: "grid",
					"aria-label": te.value,
					hidden: E.value
				}, [(X(!0), Z(J, null, nr(y.value, (e) => (X(), oi(ao, {
					key: e.id,
					item: e
				}, null, 8, ["item"]))), 128))], 8, Bo),
				Q("button", {
					id: "more",
					type: "button",
					hidden: E.value || !b.value,
					onClick: t[11] ||= (e) => A(() => j(!0))
				}, P(U(u)("rebost.more")), 9, Vo)
			], 8, bo),
			Q("dialog", {
				id: "preview",
				ref_key: "dialog",
				ref: w,
				"aria-label": U(u)("rebost.view"),
				onClose: de
			}, [Q("button", {
				id: "closePreview",
				type: "button",
				onClick: M
			}, P(U(u)("rebost.close")), 1), Q("img", {
				id: "previewImage",
				src: T.value || void 0,
				alt: ee.value
			}, null, 8, Uo)], 40, Ho)
		])], 64));
	}
}).mount("#rebost");
