import { LIMITS as e, RebostClient as t } from "/assets/client.js";
import { cancelMessage as n, postToParent as r, selectionMessage as i } from "/assets/rebost-selection.js";
// ../../../../../../home/daizan/github/Edutictac/edutictac-commons/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function a(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var o = {}, s = [], c = () => {}, l = () => !1, u = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), d = (e) => e.startsWith("onUpdate:"), f = Object.assign, p = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, m = Object.prototype.hasOwnProperty, h = (e, t) => m.call(e, t), g = Array.isArray, _ = (e) => E(e) === "[object Map]", v = (e) => E(e) === "[object Set]", y = (e) => E(e) === "[object Date]", b = (e) => typeof e == "function", x = (e) => typeof e == "string", S = (e) => typeof e == "symbol", C = (e) => typeof e == "object" && !!e, w = (e) => (C(e) || b(e)) && b(e.then) && b(e.catch), T = Object.prototype.toString, E = (e) => T.call(e), D = (e) => E(e).slice(8, -1), O = (e) => E(e) === "[object Object]", k = (e) => x(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ a(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), A = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, te = /-\w/g, j = A((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, re = A((e) => e.replace(ne, "-$1").toLowerCase()), M = A((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = A((e) => e ? `on${M(e)}` : ""), N = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, oe = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, se = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, P, F = () => P ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function I(e) {
	if (g(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = x(r) ? de(r) : I(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (x(e) || C(e)) return e;
}
var ce = /;(?![^(]*\))/g, le = /:([^]+)/, ue = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function de(e) {
	let t = {};
	return e.replace(ue, (e) => e.startsWith("/*") ? "" : e).split(ce).forEach((e) => {
		if (e) {
			let n = e.split(le);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function fe(e) {
	let t = "";
	if (x(e)) t = e;
	else if (g(e)) for (let n = 0; n < e.length; n++) {
		let r = fe(e[n]);
		r && (t += r + " ");
	}
	else if (C(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var pe = /* @__PURE__ */ a("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function me(e) {
	return !!e || e === "";
}
function he(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = ye(e[i], t[i], n);
	return r;
}
function ge(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && ye(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function _e(e, t, n) {
	let r = _(e), i = _(t);
	if (r || i || (r = v(e), i = v(t), r || i)) return r && i ? ge(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !ye(e[r], t[r], n)) return !1;
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
function ye(e, t, n) {
	if (e === t) return !0;
	let r = y(e), i = y(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = S(e), i = S(t), r || i ? e === t : (r = g(e), i = g(t), r || i ? r && i ? ve(e, t, n, he) : !1 : (r = C(e), i = C(t), r || i ? !r || !i ? !1 : ve(e, t, n, _e) : String(e) === String(t))));
}
function be(e, t) {
	return e.findIndex((e) => ye(e, t));
}
var xe = (e) => !!(e && e.__v_isRef === !0), L = (e) => x(e) ? e : e == null ? "" : g(e) || C(e) && (e.toString === T || !b(e.toString)) ? xe(e) ? L(e.value) : JSON.stringify(e, Se, 2) : String(e), Se = (e, t) => xe(t) ? Se(e, t.value) : _(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ce(t, r) + " =>"] = n, e), {}) } : v(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ce(e)) } : S(t) ? Ce(t) : C(t) && !g(t) && !O(t) ? String(t) : t, Ce = (e, t = "") => S(e) ? `Symbol(${e.description ?? t})` : e, R, we = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && R && (R.active ? (this.parent = R, this.index = (R.scopes || (R.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = R;
			try {
				return R = this, e();
			} finally {
				R = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = R, R = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (R === this) R = this.prevScope;
			else {
				let e = R;
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
function Te() {
	return R;
}
var z, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, R && (R.active ? R.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ee.has(this) && (Ee.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || je(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, We(this), Pe(this);
		let e = z, t = Be;
		z = this, Be = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), z = e, Be = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Re(e);
			this.deps = this.depsTail = void 0, We(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ee.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ie(this) && this.run();
	}
	get dirty() {
		return Ie(this);
	}
}, Oe = 0, ke, Ae;
function je(e, t = !1) {
	e.flags |= 8, t ? (e.next = Ae, Ae = e) : (e.next = ke, ke = e);
}
function Me() {
	Oe++;
}
function Ne() {
	if (--Oe > 0) return;
	if (Ae) {
		let e = Ae;
		for (Ae = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; ke;) {
		let t = ke;
		for (ke = void 0; t;) {
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
function Pe(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Fe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Re(r), ze(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ie(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Le(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Le(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ge) || (e.globalVersion = Ge, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ie(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = z, r = Be;
	z = e, Be = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || N(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		z = n, Be = r, Fe(e), e.flags &= -3;
	}
}
function Re(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Re(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ze(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Be = !0, Ve = [];
function He() {
	Ve.push(Be), Be = !1;
}
function Ue() {
	let e = Ve.pop();
	Be = e === void 0 || e;
}
function We(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = z;
		z = void 0;
		try {
			t();
		} finally {
			z = e;
		}
	}
}
var Ge = 0, Ke = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, qe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!z || !Be || z === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== z) t = this.activeLink = new Ke(z, this), z.deps ? (t.prevDep = z.depsTail, z.depsTail.nextDep = t, z.depsTail = t) : z.deps = z.depsTail = t, Je(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = z.depsTail, t.nextDep = void 0, z.depsTail.nextDep = t, z.depsTail = t, z.deps === t && (z.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ge++, this.notify(e);
	}
	notify(e) {
		Me();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ne();
		}
	}
};
function Je(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Je(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ye = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol(""), Qe = /* @__PURE__ */ Symbol("");
function B(e, t, n) {
	if (Be && z) {
		let t = Ye.get(e);
		t || Ye.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new qe()), r.map = t, r.key = n), r.track();
	}
}
function $e(e, t, n, r, i, a) {
	let o = Ye.get(e);
	if (!o) {
		Ge++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Me(), t === "clear") o.forEach(s);
	else {
		let i = g(e), a = i && k(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Qe || !S(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Qe)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Xe)), _(e) && s(o.get(Ze)));
				break;
			case "delete":
				i || (s(o.get(Xe)), _(e) && s(o.get(Ze)));
				break;
			case "set": _(e) && s(o.get(Xe));
		}
	}
	Ne();
}
function et(e) {
	let t = /* @__PURE__ */ V(e);
	return t === e || (B(t, "iterate", Qe), /* @__PURE__ */ Bt(e)) ? t : /* @__PURE__ */ zt(e) ? /* @__PURE__ */ Rt(e) ? t.map((e) => Wt(Ut(e))) : t.map(Wt) : t.map(Ut);
}
function tt(e) {
	return B(e = /* @__PURE__ */ V(e), "iterate", Qe), e;
}
function nt(e, t) {
	return /* @__PURE__ */ zt(e) ? Wt(/* @__PURE__ */ Rt(e) ? Ut(t) : t) : Ut(t);
}
var rt = {
	__proto__: null,
	[Symbol.iterator]() {
		return it(this, Symbol.iterator, (e) => nt(this, e));
	},
	concat(...e) {
		return et(this).concat(...e.map((e) => g(e) ? et(e) : e));
	},
	entries() {
		return it(this, "entries", (e) => (e[1] = nt(this, e[1]), e));
	},
	every(e, t) {
		return st(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return st(this, "filter", e, t, (e) => e.map((e) => nt(this, e)), arguments);
	},
	find(e, t) {
		return st(this, "find", e, t, (e) => nt(this, e), arguments);
	},
	findIndex(e, t) {
		return st(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return st(this, "findLast", e, t, (e) => nt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return st(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return st(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return lt(this, "includes", e);
	},
	indexOf(...e) {
		return lt(this, "indexOf", e);
	},
	join(e) {
		return et(this).join(e);
	},
	lastIndexOf(...e) {
		return lt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return st(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ut(this, "pop");
	},
	push(...e) {
		return ut(this, "push", e);
	},
	reduce(e, ...t) {
		return ct(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ct(this, "reduceRight", e, t);
	},
	shift() {
		return ut(this, "shift");
	},
	some(e, t) {
		return st(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ut(this, "splice", e);
	},
	toReversed() {
		return et(this).toReversed();
	},
	toSorted(e) {
		return et(this).toSorted(e);
	},
	toSpliced(...e) {
		return et(this).toSpliced(...e);
	},
	unshift(...e) {
		return ut(this, "unshift", e);
	},
	values() {
		return it(this, "values", (e) => nt(this, e));
	}
};
function it(e, t, n) {
	let r = tt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ Bt(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => at(a.next(), n), i !== ot[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => at(a._next(), n);
	}
	return a;
}
function at(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var ot = Array.prototype;
function st(e, t, n, r, i, a) {
	let o = tt(e), s = o !== e && !/* @__PURE__ */ Bt(e), c = o[t];
	if (c !== ot[t]) {
		let t = c.apply(e, a);
		return s ? Ut(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, nt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ct(e, t, n, r) {
	let i = tt(e), a = i !== e && !/* @__PURE__ */ Bt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = nt(e, t)), n.call(this, t, nt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? nt(e, c) : c;
}
function lt(e, t, n) {
	let r = /* @__PURE__ */ V(e);
	B(r, "iterate", Qe);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Vt(n[0]) ? (n[0] = /* @__PURE__ */ V(n[0]), r[t](...n)) : i;
}
function ut(e, t, n = []) {
	He(), Me();
	let r = (/* @__PURE__ */ V(e))[t].apply(e, n);
	return Ne(), Ue(), r;
}
var dt = /* @__PURE__ */ a("__proto__,__v_isRef,__isVue"), ft = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(S));
function pt(e) {
	S(e) || (e = String(e));
	let t = /* @__PURE__ */ V(this);
	return B(t, "has", e), t.hasOwnProperty(e);
}
var mt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Mt : jt : i ? At : kt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = g(e);
		if (!r) {
			let e;
			if (a && (e = rt[t])) return e;
			if (t === "hasOwnProperty") return pt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ H(e) ? e : n);
		if ((S(t) ? ft.has(t) : dt(t)) || (r || B(e, "get", t), i)) return o;
		if (/* @__PURE__ */ H(o)) {
			let e = a && k(t) ? o : o.value;
			return r && C(e) ? /* @__PURE__ */ It(e) : e;
		}
		return C(o) ? r ? /* @__PURE__ */ It(o) : /* @__PURE__ */ Pt(o) : o;
	}
}, ht = class extends mt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = g(e) && k(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ zt(i);
			if (!/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ zt(n) && (i = /* @__PURE__ */ V(i), n = /* @__PURE__ */ V(n)), !a && /* @__PURE__ */ H(i) && !/* @__PURE__ */ H(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : h(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ H(e) ? e : r);
		return e === /* @__PURE__ */ V(r) && s && (o ? N(n, i) && $e(e, "set", t, n, i) : $e(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = h(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && $e(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return S(t) && ft.has(t) || B(e, "has", t), n;
	}
	ownKeys(e) {
		return B(e, "iterate", g(e) ? "length" : Xe), Reflect.ownKeys(e);
	}
}, gt = class extends mt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, _t = /* @__PURE__ */ new ht(), vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new ht(!0), bt = (e) => e, xt = (e) => Reflect.getPrototypeOf(e);
function St(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ V(i), o = _(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? bt : t ? Wt : Ut;
		return !t && B(a, "iterate", c ? Ze : Xe), f(Object.create(l), { next() {
			let { value: e, done: t } = l.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [u(e[0]), u(e[1])] : u(e),
				done: t
			};
		} });
	};
}
function Ct(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function wt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ V(r), a = /* @__PURE__ */ V(n);
			e || (N(n, a) && B(i, "get", n), B(i, "get", a));
			let { has: o } = xt(i), s = t ? bt : e ? Wt : Ut;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && B(/* @__PURE__ */ V(t), "iterate", Xe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ V(n), i = /* @__PURE__ */ V(t);
			return e || (N(t, i) && B(r, "has", t), B(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ V(a), s = t ? bt : e ? Wt : Ut;
			return !e && B(o, "iterate", Xe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return f(n, e ? {
		add: Ct("add"),
		set: Ct("set"),
		delete: Ct("delete"),
		clear: Ct("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ V(this), r = xt(n), i = /* @__PURE__ */ V(e), a = !t && !/* @__PURE__ */ Bt(e) && !/* @__PURE__ */ zt(e) ? i : e;
			return r.has.call(n, a) || N(e, a) && r.has.call(n, e) || N(i, a) && r.has.call(n, i) || (n.add(a), $e(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Bt(n) || /* @__PURE__ */ zt(n) || (n = /* @__PURE__ */ V(n));
			let r = /* @__PURE__ */ V(this), { has: i, get: a } = xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ V(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? N(n, s) && $e(r, "set", e, n, s) : $e(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ V(this), { has: n, get: r } = xt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ V(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && $e(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ V(this), t = e.size !== 0, n = e.clear();
			return t && $e(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = St(r, e, t);
	}), n;
}
function Tt(e, t) {
	let n = wt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(h(n, i) && i in r ? n : r, i, a);
}
var Et = { get: /* @__PURE__ */ Tt(!1, !1) }, Dt = { get: /* @__PURE__ */ Tt(!1, !0) }, Ot = { get: /* @__PURE__ */ Tt(!0, !1) }, kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap();
function Nt(e) {
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
function Pt(e) {
	return /* @__PURE__ */ zt(e) ? e : Lt(e, !1, _t, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return Lt(e, !1, yt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Lt(e, !0, vt, Ot, jt);
}
function Lt(e, t, n, r, i) {
	if (!C(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Nt(D(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return /* @__PURE__ */ zt(e) ? /* @__PURE__ */ Rt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function V(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ V(t) : e;
}
function Ht(e) {
	return !h(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
}
var Ut = (e) => C(e) ? /* @__PURE__ */ Pt(e) : e, Wt = (e) => C(e) ? /* @__PURE__ */ It(e) : e;
// @__NO_SIDE_EFFECTS__
function H(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function U(e) {
	return Gt(e, !1);
}
function Gt(e, t) {
	return /* @__PURE__ */ H(e) ? e : new Kt(e, t);
}
var Kt = class {
	constructor(e, t) {
		this.dep = new qe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ V(e), this._value = t ? e : Ut(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Bt(e) || /* @__PURE__ */ zt(e);
		e = n ? e : /* @__PURE__ */ V(e), N(e, t) && (this._rawValue = e, this._value = n ? e : Ut(e), this.dep.trigger());
	}
};
function W(e) {
	return /* @__PURE__ */ H(e) ? e.value : e;
}
var qt = {
	get: (e, t, n) => t === "__v_raw" ? e : W(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ H(i) && !/* @__PURE__ */ H(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Jt(e) {
	return /* @__PURE__ */ Rt(e) ? e : new Proxy(e, qt);
}
var Yt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new qe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ge - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && z !== this) return je(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Le(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Xt(e, t, n = !1) {
	let r, i;
	return b(e) ? r = e : (r = e.get, i = e.set), new Yt(r, i, n);
}
var Zt = {}, Qt = /* @__PURE__ */ new WeakMap(), $t = void 0;
function en(e, t = !1, n = $t) {
	if (n) {
		let t = Qt.get(n);
		t || Qt.set(n, t = []), t.push(e);
	}
}
function tn(e, t, n = o) {
	let { immediate: r, deep: i, once: a, scheduler: s, augmentJob: l, call: u } = n, d = (e) => i ? e : /* @__PURE__ */ Bt(e) || i === !1 || i === 0 ? nn(e, 1) : nn(e), f, m, h, _, v = !1, y = !1;
	if (/* @__PURE__ */ H(e) ? (m = () => e.value, v = /* @__PURE__ */ Bt(e)) : /* @__PURE__ */ Rt(e) ? (m = () => d(e), v = !0) : g(e) ? (y = !0, v = e.some((e) => /* @__PURE__ */ Rt(e) || /* @__PURE__ */ Bt(e)), m = () => e.map((e) => {
		if (/* @__PURE__ */ H(e)) return e.value;
		if (/* @__PURE__ */ Rt(e)) return d(e);
		if (b(e)) return u ? u(e, 2) : e();
	})) : m = b(e) ? t ? u ? () => u(e, 2) : e : () => {
		if (h) {
			He();
			try {
				h();
			} finally {
				Ue();
			}
		}
		let t = $t;
		$t = f;
		try {
			return u ? u(e, 3, [_]) : e(_);
		} finally {
			$t = t;
		}
	} : c, t && i) {
		let e = m, t = i === !0 ? Infinity : i;
		m = () => nn(e(), t);
	}
	let x = Te(), S = () => {
		f.stop(), x && x.active && p(x.effects, f);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			try {
				return e(...t);
			} finally {
				S();
			}
		};
	}
	let C = y ? Array(e.length).fill(Zt) : Zt, w = (e) => {
		if (f.flags & 1 && (f.dirty || e)) {
			if (t) {
				let n = f.run();
				if (e || i || v || (y ? n.some((e, t) => N(e, C[t])) : N(n, C))) {
					let e = $t;
					He();
					try {
						h && h(), $t = f;
						let e = [
							n,
							C === Zt ? void 0 : y && C[0] === Zt ? [] : C,
							_
						];
						C = n, u ? u(t, 3, e) : t(...e);
					} finally {
						$t = e, Ue();
					}
				}
			} else f.run();
		}
	};
	return l && l(w), f = new De(m), f.scheduler = s ? () => s(w, !1) : w, _ = (e) => en(e, !1, f), h = f.onStop = () => {
		let e = Qt.get(f);
		if (e) {
			if (u) u(e, 4);
			else for (let t of e) t();
			Qt.delete(f);
		}
	}, t ? r ? w(!0) : C = f.run() : s ? s(w.bind(null, !0), !0) : f.run(), S.pause = f.pause.bind(f), S.resume = f.resume.bind(f), S.stop = S, S;
}
function nn(e, t = Infinity, n) {
	if (t <= 0 || !C(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ H(e)) nn(e.value, t, n);
	else if (g(e)) for (let r = 0; r < e.length; r++) nn(e[r], t, n);
	else if (v(e) || _(e)) e.forEach((e) => {
		nn(e, t, n);
	});
	else if (O(e)) {
		for (let r in e) nn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && nn(e[r], t, n);
	}
	return e;
}
// ../../../../../../home/daizan/github/Edutictac/edutictac-commons/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function rn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		on(e, t, n);
	}
}
function an(e, t, n, r) {
	if (b(e)) {
		let i = rn(e, t, n, r);
		return i && w(i) && i.catch((e) => {
			on(e, t, n);
		}), i;
	}
	if (g(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(an(e[a], t, n, r));
		return i;
	}
}
function on(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: s } = t && t.appContext.config || o;
	if (t) {
		let r = t.parent, i = t.proxy, o = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, o) === !1) return;
			}
			r = r.parent;
		}
		if (a) {
			He(), rn(a, null, 10, [
				e,
				i,
				o
			]), Ue();
			return;
		}
	}
	sn(e, n, i, r, s);
}
function sn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var G = [], cn = -1, ln = [], un = null, dn = 0, fn = /* @__PURE__ */ Promise.resolve(), pn = null;
function mn(e) {
	let t = pn || fn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function hn(e) {
	let t = cn + 1, n = G.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = G[r], a = Cn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function gn(e) {
	if (!(e.flags & 1)) {
		let t = Cn(e), n = G[G.length - 1];
		!n || !(e.flags & 2) && t >= Cn(n) ? G.push(e) : G.splice(hn(t), 0, e), e.flags |= 1, _n();
	}
}
function _n() {
	pn ||= fn.then(wn);
}
function vn(e) {
	if (!g(e)) un && e.id === -1 ? un.splice(dn + 1, 0, e) : e.flags & 1 || (ln.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) ln.push(e[t]);
	_n();
}
function yn(e, t, n, r = cn + 1) {
	for (; r < G.length; r++) {
		let n = G[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			G.splice(r, 1), r = e ? r - 1 : cn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function bn(e, t, n = 0) {
	if (ln.length) {
		let e = ln, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < ln.length; i++) {
				let a = ln[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? ln[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Cn(e) - Cn(t));
		if (ln.length = r, un) {
			for (let e = 0; e < i.length; e++) un.push(i[e]);
			return;
		}
		for (un = i, dn = 0; dn < un.length; dn++) {
			let e = un[dn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		un = null, dn = 0;
	}
}
var xn = !1;
function Sn(e, t) {
	if (xn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(ln);
	e(), xn = !0;
	try {
		yn(void 0, t), bn(void 0, n, t);
	} finally {
		xn = !1;
	}
}
var Cn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function wn(e) {
	try {
		for (cn = 0; cn < G.length; cn++) {
			let e = G[cn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), rn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; cn < G.length; cn++) {
			let e = G[cn];
			e && (e.flags &= -2);
		}
		cn = -1, G.length = 0, bn(e), pn = null, (G.length || ln.length) && wn(e);
	}
}
var K = null, Tn = null;
function En(e) {
	let t = K;
	return K = e, Tn = e && e.type.__scopeId || null, t;
}
function Dn(e, t = K, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && li(-1);
		let i = En(t), a = ai.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ai.length; e > a; e--) si();
			En(i), r._d && li(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function On(e, t) {
	if (K === null) return e;
	let n = Ui(K), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, s, c = o] = t[e];
		i && (b(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && nn(a), r.push({
			dir: i,
			instance: n,
			value: a,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function kn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (He(), an(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ue());
	}
}
function An(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function jn(e, t, n = !1) {
	let r = Ai();
	if (r || mr) {
		let i = mr ? mr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && b(t) ? t.call(r && r.proxy) : t;
	}
}
var Mn = /* @__PURE__ */ Symbol.for("v-scx"), Nn = () => jn(Mn);
function Pn(e, t, n) {
	return Fn(e, t, n);
}
function Fn(e, t, n = o) {
	let { immediate: r, deep: i, flush: a, once: s } = n, l = f({}, n), u = t && r || !t && a !== "post", d;
	if (Ii) {
		if (a === "sync") {
			let e = Nn();
			d = e.__watcherHandles ||= [];
		} else if (!u) {
			let e = () => {};
			return e.stop = c, e.resume = c, e.pause = c, e;
		}
	}
	let p = $;
	l.call = (e, t, n) => an(e, p, t, n);
	let m = !1;
	a === "post" ? l.scheduler = (e) => {
		e.i = p, q(e, p && p.suspense);
	} : a !== "sync" && (m = !0, l.scheduler = (e, t) => {
		t ? e() : gn(e);
	}), l.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = tn(e, t, l);
	return Ii && (d ? d.push(h) : u && h()), h;
}
var In = /* @__PURE__ */ Symbol("_vte"), Ln = (e) => e.__isTeleport, Rn = /* @__PURE__ */ Symbol("_leaveCb");
function zn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ri) {
			t = n;
			break;
		}
	}
	return t;
}
function Bn(e) {
	if (!Yn(e)) return Ln(e.type) && e.children ? zn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && b(n.default)) return n.default();
	}
}
function Vn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Vn(Ln(n.type) && Bn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === J && g(e.children)) {
		let n = br(e.children, !1);
		n && Vn(n, t);
	}
}
function Hn(e) {
	if (e.component) return Hn(e.component.subTree);
	if (e.type === J) {
		let t = g(e.children) && br(e.children, !1);
		return t ? Hn(t) : void 0;
	}
	if (e.type !== ri) return e;
}
function Un(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Wn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Gn = /* @__PURE__ */ new WeakMap();
function Kn(e, t, n, r, i = !1) {
	if (g(e)) {
		e.forEach((e, a) => Kn(e, t && (g(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Jn(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Kn(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ui(r.component) : r.el, s = i ? null : a, { i: c, r: u } = e, d = t && t.r, f = c.refs === o ? c.refs = {} : c.refs, m = c.setupState, _ = /* @__PURE__ */ V(m), v = m === o ? l : (e) => !Wn(f, e) && h(_, e), y = (e, t) => !(t && Wn(f, t));
	if (d != null && d !== u) {
		if (qn(t), x(d)) f[d] = null, v(d) && (m[d] = null);
		else if (/* @__PURE__ */ H(d)) {
			let e = t;
			y(d, e.k) && (d.value = null), e.k && (f[e.k] = null);
		}
	}
	if (b(u)) rn(u, c, 12, [s, f]);
	else {
		let t = x(u), r = /* @__PURE__ */ H(u);
		if (t || r) {
			let o = () => {
				if (e.f) {
					let n = t ? v(u) ? m[u] : f[u] : y(u) || !e.k ? u.value : f[e.k];
					if (i) g(n) && p(n, a);
					else if (g(n)) n.includes(a) || n.push(a);
					else if (t) f[u] = [a], v(u) && (m[u] = f[u]);
					else {
						let t = [a];
						y(u, e.k) && (u.value = t), e.k && (f[e.k] = t);
					}
				} else t ? (f[u] = s, v(u) && (m[u] = s)) : r && (y(u, e.k) && (u.value = s), e.k && (f[e.k] = s));
			};
			if (s) {
				let t = () => {
					o(), Gn.delete(e);
				};
				t.id = -1, Gn.set(e, t), q(t, n);
			} else qn(e), o();
		}
	}
}
function qn(e) {
	let t = Gn.get(e);
	t && (t.flags |= 8, Gn.delete(e));
}
F().requestIdleCallback, F().cancelIdleCallback;
var Jn = (e) => !!e.type.__asyncLoader, Yn = (e) => e.type.__isKeepAlive;
function Xn(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			He();
			let i = Ni(n), a = an(t, n, e, r);
			return i(), Ue(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Zn = (e) => (t, n = $) => {
	Ii && e !== "sp" || Xn(e, (...e) => t(...e), n);
}, Qn = Zn("m"), $n = Zn("bum"), er = "components";
function tr(e, t) {
	return ir(er, e, !0, t) || e;
}
var nr = /* @__PURE__ */ Symbol.for("v-ndc");
function rr(e) {
	return x(e) ? ir(er, e, !1) || e : e || nr;
}
function ir(e, t, n = !0, r = !1) {
	let i = K || $;
	if (i) {
		let n = i.type;
		if (e === er) {
			let e = Wi(n, !1);
			if (e && (e === t || e === j(t) || e === M(j(t)))) return n;
		}
		let a = ar(i[e] || n[e], t) || ar(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function ar(e, t) {
	return e && (e[t] || e[j(t)] || e[M(j(t))]);
}
function or(e, t, n, r) {
	let i, a = n && n[r], o = g(e);
	if (o || x(e)) {
		let n = o && /* @__PURE__ */ Rt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Bt(e), s = /* @__PURE__ */ zt(e), e = tt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Wt(Ut(e[n])) : Ut(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (C(e)) {
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
var sr = (e) => e ? Fi(e) ? Ui(e) : sr(e.parent) : null, cr = /* @__PURE__ */ f(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => sr(e.parent),
	$root: (e) => sr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		gn(e.update);
	},
	$nextTick: (e) => e.n ||= mn.bind(e.proxy),
	$watch: (e) => c
}), lr = (e, t) => e !== o && !e.__isScriptSetup && h(e, t), ur = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: r, data: i, props: a, accessCache: s, type: c, appContext: l } = e;
		if (t[0] !== "$") {
			let e = s[t];
			if (e !== void 0) switch (e) {
				case 1: return r[t];
				case 2: return i[t];
				case 4: return n[t];
				case 3: return a[t];
			}
			else if (lr(r, t)) return s[t] = 1, r[t];
			else if (h(a, t)) return s[t] = 3, a[t];
			else if (n !== o && h(n, t)) return s[t] = 4, n[t];
			else s[t] = 0;
		}
		let u = cr[t], d, f;
		if (u) return t === "$attrs" && B(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== o && h(n, t)) return s[t] = 4, n[t];
		if (f = l.config.globalProperties, h(f, t)) return f[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return lr(i, t) ? (i[t] = n, !0) : h(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || lr(t, s) || h(a, s) || h(r, s) || h(cr, s) || h(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? h(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function dr() {
	return {
		app: null,
		config: {
			isNativeTag: l,
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
var fr = 0;
function pr(e, t) {
	return function(n, r = null) {
		b(n) || (n = f({}, n)), r != null && !C(r) && (r = null);
		let i = dr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: fr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: qi,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && b(e.install) ? (a.add(e), e.install(c, ...t)) : b(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || gi(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ui(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (an(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = mr;
				mr = c;
				try {
					return e();
				} finally {
					mr = t;
				}
			}
		};
		return c;
	};
}
var mr = null, hr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${j(t)}Modifiers`] || e[`${re(t)}Modifiers`];
function gr(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || o, i = n, a = t.startsWith("update:"), s = a && hr(r, t.slice(7));
	s && (s.trim && (i = n.map((e) => x(e) ? e.trim() : e)), s.number && (i = i.map(se)));
	let c, l = r[c = ie(t)] || r[c = ie(j(t))];
	!l && a && (l = r[c = ie(re(t))]), l && an(l, e, 6, i);
	let u = r[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, an(u, e, 6, i);
	}
}
function _r(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (g(a) ? a.forEach((e) => o[e] = null) : f(o, a), C(e) && r.set(e, o), o) : (C(e) && r.set(e, null), null);
}
function vr(e, t) {
	return !e || !u(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), h(e, t[0].toLowerCase() + t.slice(1)) || h(e, re(t)) || h(e, t));
}
function yr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = En(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = xi(l.call(t, e, u, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = xi(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(f, null)), y = t.props ? s : xr(s);
		}
	} catch (t) {
		ai.length = 0, on(t, e, 1), v = gi(ri);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(d) && (y = Sr(y, a)), b = yi(b, y, !1, !0));
	}
	return n.dirs && (b = yi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Vn(Ln(b.type) && Bn(b) || b, n.transition), v = b, En(_), v;
}
function br(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (fi(r)) {
			if (r.type !== ri || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var xr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || u(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Sr = (e, t) => {
	let n = {};
	for (let r in e) d(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function Cr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? wr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Tr(o, r, n) && !vr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || wr(r, o, l) : !!o;
	return !1;
}
function wr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!h(e, a) || Tr(t, e, a) && !vr(n, a)) return !0;
	}
	return !1;
}
function Tr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && C(r) && C(i) ? !ye(r, i) : r !== i;
}
function Er({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Dr = {}, Or = () => Object.create(Dr), kr = (e) => Object.getPrototypeOf(e) === Dr;
function Ar(e, t, n, r = !1) {
	let i = {}, a = Or();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Mr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Ft(i) : e.type.props ? i : a, e.attrs = a;
}
function jr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ V(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (vr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (h(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = j(o);
						i[t] = Nr(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Mr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (h(t, a) || (r = re(a)) !== a && h(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Nr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && h(t, e) || (delete a[e], l = !0);
	}
	l && $e(e.attrs, "set", "");
}
function Mr(e, t, n, r) {
	let [i, a] = e.propsOptions, s = !1, c;
	if (t) for (let o in t) {
		if (ee(o)) continue;
		let l = t[o], u;
		i && h(i, u = j(o)) ? !a || !a.includes(u) ? n[u] = l : (c ||= {})[u] = l : vr(e.emitsOptions, o) || o in r && l === r[o] || (r[o] = l, s = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ V(n), r = c || o;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Nr(i, t, s, r[s], e, !h(r, s));
		}
	}
	return s;
}
function Nr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = h(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && b(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ni(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === re(n)) && (r = !0));
	}
	return r;
}
function Pr(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, c = {}, l = [];
	if (!a) return C(e) && r.set(e, s), s;
	if (g(a)) for (let e = 0; e < a.length; e++) {
		let t = j(a[e]);
		Fr(t) && (c[t] = o);
	}
	else if (a) for (let e in a) {
		let t = j(e);
		if (Fr(t)) {
			let n = a[e], r = c[t] = g(n) || b(n) ? { type: n } : f({}, n), i = r.type, o = !1, s = !0;
			if (g(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = b(t) && t.name;
				if (n === "Boolean") {
					o = !0;
					break;
				}
				n === "String" && (s = !1);
			}
			else o = b(i) && i.name === "Boolean";
			r[0] = o, r[1] = s, (o || h(r, "default")) && l.push(t);
		}
	}
	let u = [c, l];
	return C(e) && r.set(e, u), u;
}
function Fr(e) {
	return e[0] !== "$" && !ee(e);
}
var Ir = (e) => e === "_" || e === "_ctx" || e === "$stable", Lr = (e) => g(e) ? e.map(xi) : [xi(e)], Rr = (e, t, n) => {
	if (t._n) return t;
	let r = Dn((...e) => Lr(t(...e)), n);
	return r._c = !1, r;
}, zr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ir(n)) continue;
		let i = e[n];
		if (b(i)) t[n] = Rr(n, i, r);
		else if (i != null) {
			let e = Lr(i);
			t[n] = () => e;
		}
	}
}, Br = (e, t) => {
	let n = Lr(t);
	e.slots.default = () => n;
}, Vr = (e, t, n) => {
	for (let r in t) (n || !Ir(r)) && (e[r] = t[r]);
}, Hr = (e, t, n) => {
	let r = e.slots = Or();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Vr(r, t, n), n && oe(r, "_", e, !0)) : zr(t, r);
	} else t && Br(e, t);
}, Ur = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, s = o;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Vr(i, t, n) : (a = !t.$stable, zr(t, i)), s = t;
	} else t && (Br(e, t), s = { default: 1 });
	if (a) for (let e in i) !Ir(e) && s[e] == null && delete i[e];
}, q = ti;
function Wr(e) {
	return Gr(e);
}
function Gr(e, t) {
	let n = F();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = c, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !pi(e, t) && (r = fe(e), I(e, i, a, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === s && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case ni:
				y(e, t, n, r);
				break;
			case ri:
				b(e, t, n, r);
				break;
			case ii:
				e ?? x(t, n, r, o);
				break;
			case J:
				te(e, t, n, r, i, a, o, c, l);
				break;
			default: f & 1 ? w(e, t, n, r, i, a, o, c, l) : f & 6 ? j(e, t, n, r, i, a, o, c, l) : (f & 64 || f & 128) && u.process(e, t, n, r, i, a, o, c, l, me);
		}
		d != null && i ? Kn(d, e && e.ref, a, t || e, !t) : d == null && e && e.ref != null && Kn(e.ref, null, a, e, !0);
	}, y = (e, t, n, i) => {
		if (e == null) r(t.el = u(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, i) => {
		e == null ? r(t.el = d(t.children || ""), n, i) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = h(e), r(e, n, i), e = a;
		r(t, n, i);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), i(e), e = n;
		i(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), O(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, i, o, s, c, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, s, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, i, o, Kr(e, s), c, u), _ && kn(e, null, i, "created"), E(d, e, e.scopeId, c, i), m) {
			for (let e in m) e !== "value" && !ee(e) && a(d, e, null, m[e], s, i);
			"value" in m && a(d, "value", null, m.value, s), (f = m.onVnodeBeforeMount) && Ti(f, i, e);
		}
		_ && kn(e, null, i, "beforeMount");
		let v = Jr(o, g);
		v && g.beforeEnter(d), r(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && q(() => {
			try {
				f && Ti(f, i, e), v && g.enter(d), _ && kn(e, null, i, "mounted");
			} finally {}
		}, o);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ei(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Si(e[l]) : xi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, O = (e, t, n, r, i, s, c) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || o, h = t.props || o, g;
		if (n && qr(n, !1), (g = h.onVnodeBeforeUpdate) && Ti(g, n, t, e), f && kn(t, e, n, "beforeUpdate"), n && qr(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, c = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? k(e.dynamicChildren, d, l, n, r, Kr(t, i), s) : c || N(e, t, l, null, n, r, Kr(t, i), s, !1), u > 0) {
			if (u & 16) A(l, m, h, n, i);
			else if (u & 2 && m.class !== h.class && a(l, "class", null, h.class, i), u & 4 && a(l, "style", m.style, h.style, i), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = m[r], s = h[r];
					(s !== o || r === "value") && a(l, r, o, s, i, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !c && d == null && A(l, m, h, n, i);
		((g = h.onVnodeUpdated) || f) && q(() => {
			g && Ti(g, n, t, e), f && kn(t, e, n, "updated");
		}, r);
	}, k = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || $r(c), d = u && (c.type === J || !pi(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, A = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== o) for (let o in t) !ee(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (ee(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, te = (e, t, n, i, a, o, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), D(t.children || [], n, f, a, o, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (k(e.dynamicChildren, m, n, a, o, s, c), (t.key != null || a && t === a.subTree) && Yr(e, t, !0)) : N(e, t, n, f, a, o, s, c, l);
	}, j = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ne(t, n, r, i, a, o, c) : re(e, t, c);
	}, ne = (e, t, n, r, i, a, o) => {
		let s = e.component = ki(e, r, i);
		if (Yn(e) && (s.ctx.renderer = me), Li(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, M, o, a), !e.el) {
				let r = s.subTree = gi(ri);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else M(s, e, t, n, i, a, o);
	}, re = (e, t, n) => {
		let r = t.component = e.component;
		if (Cr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ie(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, M = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Zr(e);
					if (n) {
						t && (t.el = c.el, ie(e, t, o)), n.asyncDep.then(() => {
							q(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				qr(e, !1), t ? (t.el = c.el, ie(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ti(d, s, t, c), qr(e, !0);
				let f = yr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), fe(p), e, i, a), t.el = f.el, u === null && Er(e, f.el), r && q(r, i), (d = t.props && t.props.onVnodeUpdated) && q(() => Ti(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Jn(t);
				if (qr(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && Ti(o, d, t), qr(e, !0), s && ge) {
					let t = () => {
						e.subTree = yr(e), ge(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = yr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && q(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					q(() => Ti(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Jn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && q(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => gn(u), qr(e, !0), l();
	}, ie = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, jr(e, t.props, r, n), Ur(e, t.children, n), He(), yn(e), Ue();
	}, N = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				se(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				oe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && de(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? se(l, d, n, r, i, a, o, s, c) : de(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, oe = (e, t, n, r, i, a, o, c, l) => {
		e ||= s, t ||= s;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? Si(t[p]) : xi(t[p]);
			v(e[p], r, n, null, i, a, o, c, l);
		}
		u > d ? de(e, i, a, !0, !1, f) : D(t, n, r, i, a, o, c, l, f);
	}, se = (e, t, n, r, i, a, o, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], s = t[u] = l ? Si(t[u]) : xi(t[u]);
			if (pi(r, s)) v(r, s, n, null, i, a, o, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], s = t[p] = l ? Si(t[p]) : xi(t[p]);
			if (pi(r, s)) v(r, s, n, null, i, a, o, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, s = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? Si(t[u]) : xi(t[u]), n, s, i, a, o, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) I(e[u], i, a, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Si(t[u]) : xi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					I(r, i, a, !0);
					continue;
				}
				let s;
				if (r.key != null) s = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && pi(r, t[_])) {
					s = _;
					break;
				}
				s === void 0 ? I(r, i, a, !0) : (C[s - h] = u + 1, s >= S ? S = s : x = !0, v(r, t[s], n, null, i, a, o, c, l), y++);
			}
			let w = x ? Xr(C) : s;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, s = t[e], f = t[e + 1], p = e + 1 < d ? f.el || $r(f) : r;
				C[u] === 0 ? v(null, s, n, p, i, a, o, c, l) : x && (_ < 0 || u !== w[_] ? P(s, n, p, 2) : _--);
			}
		}
	}, P = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) P(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, me);
		else if (c === J) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) P(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === ii) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[Rn] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), q(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[Rn];
					s._isLeaving && s[Rn](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, I = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (He(), Kn(s, null, n, e, !0), Ue()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Jn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ti(_, t, e), u & 6) ue(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && kn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, me, r) : l && !l.hasOnce && (a !== J || d > 0 && d & 64) ? de(l, t, n, !1, !0) : (a === J && d & 384 || !i && u & 16) && de(c, t, n), r && ce(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && q(() => {
			_ && Ti(_, t, e), h && kn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ce = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === J;
		if (o && !a) {
			le(n, r);
			return;
		}
		if (t === ii) {
			C(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Hn(e) : e, c = () => {
			o ? m(n) && le(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, le = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), i(e), e = n;
		i(t);
	}, ue = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Qr(c), Qr(l), r && ae(r), i.stop(), a ? (a.flags |= 8, I(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, I(o, e, t, n)), s && q(s, t), q(() => {
			e.isUnmounted = !0;
		}, t);
	}, de = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) I(e[o], t, n, r, i);
	}, fe = (e) => {
		if (e.shapeFlag & 6) return fe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[In];
		return n ? h(n) : t;
	}, pe = (e, t, n) => {
		Sn(() => {
			e == null ? t._vnode && I(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Oi());
	}, me = {
		p: v,
		um: I,
		m: P,
		r: ce,
		mt: ne,
		mc: D,
		pc: N,
		pbc: k,
		n: fe,
		o: e
	}, he, ge;
	return t && ([he, ge] = t(me)), {
		render: pe,
		hydrate: he,
		createApp: pr(pe, he)
	};
}
function Kr({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function qr({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Jr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Yr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (g(r) && g(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Si(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Yr(t, a)), a.type === ni && (a.patchFlag === -1 && (a = i[e] = Si(a)), a.el = t.el), a.type === ri && !a.el && (a.el = t.el);
	}
}
function Xr(e) {
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
function Zr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Zr(t);
}
function Qr(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function $r(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? $r(t.subTree) : null;
}
var ei = (e) => e.__isSuspense;
function ti(e, t) {
	t && t.pendingBranch ? g(e) ? t.effects.push(...e) : t.effects.push(e) : vn(e);
}
var J = /* @__PURE__ */ Symbol.for("v-fgt"), ni = /* @__PURE__ */ Symbol.for("v-txt"), ri = /* @__PURE__ */ Symbol.for("v-cmt"), ii = /* @__PURE__ */ Symbol.for("v-stc"), ai = [], oi = null;
function Y(e = !1) {
	ai.push(oi = e ? null : []);
}
function si() {
	ai.pop(), oi = ai[ai.length - 1] || null;
}
var ci = 1;
function li(e, t = !1) {
	ci += e, e < 0 && oi && t && (oi.hasOnce = !0);
}
function ui(e) {
	return e.dynamicChildren = ci > 0 ? oi || s : null, si(), ci > 0 && oi && oi.push(e), e;
}
function X(e, t, n, r, i, a) {
	return ui(Z(e, t, n, r, i, a, !0));
}
function di(e, t, n, r, i) {
	return ui(gi(e, t, n, r, i, !0));
}
function fi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function pi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var mi = ({ key: e }) => e ?? null, hi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : x(e) || /* @__PURE__ */ H(e) || b(e) ? {
	i: K,
	r: e,
	k: t,
	f: !!n
} : e);
function Z(e, t = null, n = null, r = 0, i = null, a = e === J ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && mi(t),
		ref: t && hi(t),
		scopeId: Tn,
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
	return s ? (Ci(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= x(n) ? 8 : 16), ci > 0 && !o && oi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && oi.push(c), c;
}
var gi = _i;
function _i(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== nr || (e = ri), fi(e)) {
		let r = yi(e, t, !0);
		return n && Ci(r, n), ci > 0 && !a && oi && (r.shapeFlag & 6 ? oi[oi.indexOf(e)] = r : oi.push(r)), r.patchFlag = -2, r;
	}
	if (Gi(e) && (e = e.__vccOpts), t) {
		t = vi(t);
		let { class: e, style: n } = t;
		e && !x(e) && (t.class = fe(e)), C(n) && (/* @__PURE__ */ Vt(n) && !g(n) && (n = f({}, n)), t.style = I(n));
	}
	let o = x(e) ? 1 : ei(e) ? 128 : Ln(e) ? 64 : C(e) ? 4 : b(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function vi(e) {
	return e ? /* @__PURE__ */ Vt(e) || kr(e) ? f({}, e) : e : null;
}
function yi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? wi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && mi(l),
		ref: t && t.ref ? n && a ? g(a) ? a.concat(hi(t)) : [a, hi(t)] : hi(t) : a,
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
		ssContent: e.ssContent && yi(e.ssContent),
		ssFallback: e.ssFallback && yi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Vn(u, c.clone(u)), u;
}
function bi(e = " ", t = 0) {
	return gi(ni, null, e, t);
}
function Q(e = "", t = !1) {
	return t ? (Y(), di(ri, null, e)) : gi(ri, null, e);
}
function xi(e) {
	return e == null || typeof e == "boolean" ? gi(ri) : g(e) ? gi(J, null, e.slice()) : fi(e) ? Si(e) : gi(ni, null, String(e));
}
function Si(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : yi(e);
}
function Ci(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (g(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ci(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !kr(t) ? t._ctx = K : r === 3 && K && (K.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (b(t)) {
		if (r & 65) {
			Ci(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: K
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [bi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function wi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = fe([t.class, r.class]));
		else if (e === "style") t.style = I([t.style, r.style]);
		else if (u(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(g(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !d(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ti(e, t, n, r = null) {
	an(e, t, 7, [n, r]);
}
var Ei = dr(), Di = 0;
function Oi() {
	return Di;
}
function ki(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || Ei, a = {
		uid: Di++,
		vnode: e,
		type: r,
		parent: t,
		appContext: i,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new we(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(i.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Pr(r, i),
		emitsOptions: _r(r, i),
		emit: null,
		emitted: null,
		propsDefaults: o,
		inheritAttrs: r.inheritAttrs,
		ctx: o,
		data: o,
		props: o,
		attrs: o,
		slots: o,
		refs: o,
		setupState: o,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = gr.bind(null, a), e.ce && e.ce(a), a;
}
var $ = null, Ai = () => $ || K, ji, Mi;
{
	let e = F(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ji = t("__VUE_INSTANCE_SETTERS__", (e) => $ = e), Mi = t("__VUE_SSR_SETTERS__", (e) => Ii = e);
}
var Ni = (e) => {
	let t = $;
	return ji(e), e.scope.on(), () => {
		e.scope.off(), ji(t);
	};
}, Pi = () => {
	$ && $.scope.off(), ji(null);
};
function Fi(e) {
	return e.vnode.shapeFlag & 4;
}
var Ii = !1;
function Li(e, t = !1, n = !1) {
	t && Mi(t);
	let { props: r, children: i } = e.vnode, a = Fi(e);
	Ar(e, r, a, t), Hr(e, i, n || t);
	let o = a ? Ri(e, t) : void 0;
	return t && Mi(!1), o;
}
function Ri(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ur);
	let { setup: r } = n;
	if (r) {
		He();
		let n = e.setupContext = r.length > 1 ? Hi(e) : null, i = Ni(e), a = rn(r, e, 0, [e.props, n]), o = w(a);
		if (Ue(), i(), (o || e.sp) && !Jn(e) && Un(e), o) {
			if (a.then(Pi, Pi), t) return a.then((n) => {
				Mi(!0);
				try {
					zi(e, n, t);
				} finally {
					Mi(!1);
				}
			}).catch((t) => {
				on(t, e, 0);
			});
			e.asyncDep = a;
		} else zi(e, a, t);
	} else Bi(e, t);
}
function zi(e, t, n) {
	b(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : C(t) && (e.setupState = Jt(t)), Bi(e, n);
}
function Bi(e, t, n) {
	let r = e.type;
	e.render ||= r.render || c;
}
var Vi = { get(e, t) {
	return B(e, "get", ""), e[t];
} };
function Hi(e) {
	return {
		attrs: new Proxy(e.attrs, Vi),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ui(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Jt(Ht(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in cr) return cr[n](e);
		},
		has(e, t) {
			return t in e || t in cr;
		}
	}) : e.proxy;
}
function Wi(e, t = !0) {
	return b(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Gi(e) {
	return b(e) && "__vccOpts" in e;
}
var Ki = (e, t) => /* @__PURE__ */ Xt(e, t, Ii), qi = "3.5.44", Ji = void 0, Yi = typeof window < "u" && window.trustedTypes;
if (Yi) try {
	Ji = /* @__PURE__ */ Yi.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Xi = Ji ? (e) => Ji.createHTML(e) : (e) => e, Zi = "http://www.w3.org/2000/svg", Qi = "http://www.w3.org/1998/Math/MathML", $i = typeof document < "u" ? document : null, ea = $i && /* @__PURE__ */ $i.createElement("template"), ta = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? $i.createElementNS(Zi, e) : t === "mathml" ? $i.createElementNS(Qi, e) : n ? $i.createElement(e, { is: n }) : $i.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => $i.createTextNode(e),
	createComment: (e) => $i.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => $i.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			ea.innerHTML = Xi(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = ea.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, na = /* @__PURE__ */ Symbol("_vtc");
function ra(e, t, n) {
	let r = e[na];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var ia = /* @__PURE__ */ Symbol("_vod"), aa = /* @__PURE__ */ Symbol("_vsh"), oa = /* @__PURE__ */ Symbol(""), sa = /(?:^|;)\s*display\s*:/;
function ca(e, t, n) {
	let r = e.style, i = x(n), a = !1;
	if (n && !i) {
		if (t) {
			if (x(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? ua(r, t, "");
			}
			else for (let e in t) n[e] ?? ua(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ua(r, i, "") : ma(e, i, !x(t) && t ? t[i] : void 0, o) || ua(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[oa];
			e && (n += ";" + e), r.cssText = n, a = sa.test(n);
		}
	} else t && e.removeAttribute("style");
	ia in e && (i && t === n || (e[ia] = a ? r.display : ""), e[aa] && (r.display = "none"));
}
var la = /\s*!important$/;
function ua(e, t, n) {
	if (g(n)) n.forEach((n) => ua(e, t, n));
	else if (n ??= "", t.startsWith("--")) la.test(n) ? e.setProperty(t, n.replace(la, ""), "important") : e.setProperty(t, n);
	else {
		let r = pa(e, t);
		la.test(n) ? e.setProperty(re(r), n.replace(la, ""), "important") : e[r] = n;
	}
}
var da = [
	"Webkit",
	"Moz",
	"ms"
], fa = {};
function pa(e, t) {
	let n = fa[t];
	if (n) return n;
	let r = j(t);
	if (r !== "filter" && r in e) return fa[t] = r;
	r = M(r);
	for (let n = 0; n < da.length; n++) {
		let i = da[n] + r;
		if (i in e) return fa[t] = i;
	}
	return t;
}
function ma(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && x(r) && n === r;
}
var ha = "http://www.w3.org/1999/xlink";
function ga(e, t, n, r, i, a = pe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ha, t.slice(6, t.length)) : e.setAttributeNS(ha, t, n) : n == null || a && !me(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : S(n) ? String(n) : n);
}
function _a(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Xi(n) : n);
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
function va(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function ya(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var ba = /* @__PURE__ */ Symbol("_vei");
function xa(e, t, n, r, i = null) {
	let a = e[ba] || (e[ba] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = wa(t);
		r ? va(e, n, a[t] = Oa(r, i), s) : o && (ya(e, n, o, s), a[t] = void 0);
	}
}
var Sa = /(Once|Passive|Capture)$/, Ca = /^on:?(?:Once|Passive|Capture)$/;
function wa(e) {
	let t, n;
	for (; (n = e.match(Sa)) && !Ca.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : re(e.slice(2)), t];
}
var Ta = 0, Ea = /* @__PURE__ */ Promise.resolve(), Da = () => Ta ||= (Ea.then(() => Ta = 0), Date.now());
function Oa(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (g(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && an(e, t, 5, a);
			}
		} else an(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Da(), n;
}
var ka = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Aa = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? ra(e, r, o) : t === "style" ? ca(e, n, r) : u(t) ? d(t) || xa(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ja(e, t, r, o)) ? (_a(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || ga(e, t, r, o, a, t !== "value")) : e._isVueCE && (Ma(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !x(r))) ? _a(e, j(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ga(e, t, r, o));
};
function ja(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && ka(t) && b(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return ka(t) && x(n) ? !1 : t in e;
}
function Ma(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = j(t);
	return Array.isArray(n) ? n.some((e) => j(e) === r) : Object.keys(n).some((e) => j(e) === r);
}
var Na = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return g(t) ? (e) => ae(t, e) : t;
};
function Pa(e) {
	e.target.composing = !0;
}
function Fa(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Ia = /* @__PURE__ */ Symbol("_assign"), La = /* @__PURE__ */ Symbol("_initialValue");
function Ra(e, t, n) {
	return t && (e = e.trim()), n && (e = se(e)), e;
}
var za = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[La] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[La] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Ia] = Na(i);
		let a = r || i.props && i.props.type === "number";
		va(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Ia](Ra(e.value, n, a));
		}), (n || a) && va(e, "change", () => {
			e.value = Ra(e.value, n, a);
		}), t || (va(e, "compositionstart", Pa), va(e, "compositionend", Fa), va(e, "change", Fa));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[La];
		delete e[La], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Ia](Ra(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Ia] = Na(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? se(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Ba = {
	deep: !0,
	created(e, t, n) {
		e[Ia] = Na(n), va(e, "change", () => {
			let t = e._modelValue, n = Ga(e), r = e.checked, i = e[Ia];
			if (g(t)) {
				let e = be(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (v(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Ka(e, r));
		});
	},
	mounted: Va,
	beforeUpdate(e, t, n) {
		e[Ia] = Na(n), Va(e, t, n);
	}
};
function Va(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (g(t)) i = be(t, r.props.value) > -1;
	else if (v(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = ye(t, Ka(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Ha = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, va(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? se(Ga(e)) : Ga(e)), r = e.multiple, i = r ? v(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? g(i) ? t.slice() : t : i];
			try {
				e[Ia](i);
			} finally {
				mn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Ia] = Na(r);
	},
	mounted(e, { value: t }) {
		Wa(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Ia] = Na(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && Ua(t, n[1], n[0]) || Wa(e, t);
	}
};
function Ua(e, t, n) {
	if (!n || g(e)) return ye(e, t);
	if (v(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Wa(e, t) {
	let n = e.multiple, r = g(t);
	if (!n || r || v(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Ga(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : be(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (ye(Ga(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Ga(e) {
	return "_value" in e ? e._value : e.value;
}
function Ka(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var qa = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Ja = {
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
	exact: (e, t) => qa.some((n) => e[`${n}Key`] && !t.includes(n))
}, Ya = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Ja[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Xa = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Za = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = re(n.key);
		if (t.some((e) => e === r || Xa[e] === r)) return e(n);
	}));
}, Qa = /* @__PURE__ */ f({ patchProp: Aa }, ta), $a;
function eo() {
	return $a ||= Wr(Qa);
}
var to = ((...e) => {
	let t = eo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ro(e);
		if (!r) return;
		let i = t._component;
		b(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, no(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function no(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ro(e) {
	return x(e) ? document.querySelector(e) : e;
}
// services/portal/src/rebost/AssetCard.vue
var io = ["aria-label"], ao = ["src", "alt"], oo = ["value"], so = {
	key: 2,
	class: "credit"
}, co = { key: 3 }, lo = { class: "actions" }, uo = ["aria-expanded"], fo = ["hidden"], po = {
	__name: "AssetCard",
	props: {
		item: {
			type: Object,
			required: !0
		},
		nested: Boolean
	},
	setup(e) {
		let t = e, { api: n, t: r, locale: i, authenticated: a, picking: o, familySelection: s, types: c, run: l, refresh: u, chooseCollection: d, preview: f, select: p, download: m, report: h } = jn("rebost"), g = /* @__PURE__ */ U(""), _ = /* @__PURE__ */ U(""), v = /* @__PURE__ */ U(""), y = /* @__PURE__ */ U(!1), b = /* @__PURE__ */ U(null), x = !0, S = 0, C = Ki(() => {
			if (!["catalog", "scratch"].includes(t.item.collection)) return t.item.name;
			let e = t.item.names || {};
			return e[i.value] || i.value === "va" && e.ca || e.es || e.ca || e.en || t.item.name || t.item.id;
		}), w = Ki(() => !t.nested && t.item.collection === "scratch" && t.item.family?.count > 1), T = Ki(() => ["catalog", "scratch"].includes(t.item.collection) ? t.item : t.item.provenance);
		Pn(() => t.item, async (e) => {
			g.value = e.name, _.value = e.type, y.value = !1, b.value = null;
			let t = ++S;
			URL.revokeObjectURL(v.value), v.value = "";
			try {
				let r = await n.thumbnail(e.id);
				x && t === S && (v.value = URL.createObjectURL(r));
			} catch (e) {
				x && t === S && h(e);
			}
		}, { immediate: !0 }), $n(() => {
			x = !1, S++, URL.revokeObjectURL(v.value);
		});
		async function E() {
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
		function D() {
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
		function O() {
			confirm(r("rebost.confirm")) && l(async () => {
				await n.remove(t.item), await u();
			});
		}
		return (t, i) => {
			let d = tr("AssetCard", !0);
			return Y(), di(rr(e.nested ? "section" : "article"), {
				"data-id": e.item.id,
				class: fe({
					"family-costume": e.nested,
					"expanded-family": y.value
				})
			}, {
				default: Dn(() => [
					Z("button", {
						type: "button",
						class: "image secondary",
						"aria-label": W(r)("rebost.view") + ": " + C.value,
						onClick: i[0] ||= (t) => W(l)(() => W(f)(e.item, C.value))
					}, [Z("img", {
						src: v.value || void 0,
						alt: C.value
					}, null, 8, ao)], 8, io),
					W(o) || e.item.readonly ? (Y(), X(J, { key: 0 }, [(Y(), di(rr(e.nested ? "h3" : "h2"), null, {
						default: Dn(() => [bi(L(C.value), 1)]),
						_: 1
					})), Z("span", null, L(W(r)("rebost." + e.item.type)), 1)], 64)) : (Y(), X(J, { key: 1 }, [Z("label", null, [bi(L(W(r)("rebost.name")), 1), On(Z("input", {
						"onUpdate:modelValue": i[1] ||= (e) => g.value = e,
						maxlength: "200",
						required: ""
					}, null, 512), [[za, g.value]])]), Z("label", null, [bi(L(W(r)("rebost.filter")), 1), On(Z("select", { "onUpdate:modelValue": i[2] ||= (e) => _.value = e }, [(Y(!0), X(J, null, or(W(c), (e) => (Y(), X("option", {
						key: e,
						value: e
					}, L(W(r)("rebost." + e)), 9, oo))), 128))], 512), [[Ha, _.value]])])], 64)),
					T.value && !e.nested ? (Y(), X("p", so, L(T.value.attribution) + " · " + L(T.value.license), 1)) : Q("", !0),
					w.value ? (Y(), X("span", co, L(e.item.family.count) + " " + L(W(r)("rebost.costumeCount")), 1)) : Q("", !0),
					Z("small", null, L(e.item.width) + " × " + L(e.item.height) + " px", 1),
					Z("div", lo, [
						W(o) ? (Y(), X("button", {
							key: 0,
							type: "button",
							onClick: i[3] ||= (t) => W(p)(e.item, C.value, w.value && W(s))
						}, L(w.value && W(s) ? W(r)("rebost.addFamily") : W(r)("rebost.choose")), 1)) : e.item.readonly ? (Y(), X("button", {
							key: 1,
							type: "button",
							onClick: D
						}, L(W(a) ? w.value ? W(r)("rebost.saveImage") : W(r)("rebost.saveCopy") : W(r)("rebost.loginToSave")), 1)) : (Y(), X(J, { key: 2 }, [
							Z("button", {
								type: "button",
								onClick: i[4] ||= (t) => {
									W(l)(async () => {
										await W(n).update(e.item, {
											name: g.value,
											type: _.value
										});
										try {
											await W(u)();
										} catch (e) {
											return W(h)(e), "saved_refresh_failed";
										}
										return "success";
									});
								}
							}, L(W(r)("rebost.save")), 1),
							Z("button", {
								type: "button",
								class: "secondary",
								onClick: i[5] ||= (t) => {
									W(l)(async () => {
										await W(n).duplicate(e.item);
										try {
											await W(u)();
										} catch (e) {
											return W(h)(e), "saved_refresh_failed";
										}
										return "image_saved";
									});
								}
							}, L(W(r)("rebost.duplicate")), 1),
							Z("button", {
								type: "button",
								class: "danger",
								onClick: O
							}, L(W(r)("rebost.remove")), 1)
						], 64)),
						T.value && !W(o) ? (Y(), X(J, { key: 3 }, [Z("button", {
							type: "button",
							class: "secondary",
							onClick: i[6] ||= (t) => W(l)(() => W(m)(e.item))
						}, L(W(r)("rebost.source")), 1), Z("button", {
							type: "button",
							class: "secondary",
							onClick: i[7] ||= (t) => W(l)(() => W(m)(e.item, !0))
						}, L(W(r)("rebost.license")), 1)], 64)) : Q("", !0),
						w.value ? (Y(), X("button", {
							key: 4,
							class: "secondary",
							type: "button",
							"aria-expanded": y.value,
							onClick: E
						}, L(y.value ? W(r)("rebost.hideCostumes") : W(r)("rebost.costumes")), 9, uo)) : Q("", !0)
					]),
					b.value ? (Y(), X("div", {
						key: 4,
						class: "family-variants",
						hidden: !y.value
					}, [(Y(!0), X(J, null, or(b.value, (e) => (Y(), di(d, {
						key: e.id,
						item: e,
						nested: ""
					}, null, 8, ["item"]))), 128))], 8, fo)) : Q("", !0)
				]),
				_: 1
			}, 8, ["data-id", "class"]);
		};
	}
}, mo = {
	id: "banks",
	class: "panel banks-panel"
}, ho = ["placeholder"], go = { class: "banks-free" }, _o = ["disabled"], vo = {
	key: 0,
	class: "banks-note"
}, yo = {
	key: 1,
	class: "banks-login",
	role: "alert"
}, bo = ["href"], xo = {
	key: 2,
	role: "status"
}, So = { class: "banks-title" }, Co = {
	key: 0,
	class: "banks-state"
}, wo = {
	key: 1,
	class: "banks-state"
}, To = {
	key: 2,
	class: "banks-state"
}, Eo = {
	key: 0,
	class: "banks-grid"
}, Do = { class: "image" }, Oo = ["src", "alt"], ko = { class: "credit" }, Ao = ["title"], jo = ["href"], Mo = { class: "actions" }, No = ["disabled", "onClick"], Po = ["onClick"], Fo = 6, Io = {
	__name: "BanksPanel",
	props: {
		base: {
			type: String,
			default: ""
		},
		server: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		let { api: t, t: n, locale: r, authenticated: i, picking: a, pickType: o, select: s, run: c, report: l } = jn("rebost"), u = e, d = u.base.replace(/\/$/, ""), f = u.server ? "/api/assets/v1/banks" : "/api/image-banks", p = [
			{
				id: "arasaac",
				name: "ARASAAC",
				nc: !0
			},
			{
				id: "wikimedia",
				name: "Wikimedia Commons"
			},
			{
				id: "met",
				name: "The Met"
			},
			{
				id: "icons",
				name: "Iconos y emojis"
			},
			{
				id: "openverse",
				name: "Openverse"
			}
		], m = /* @__PURE__ */ U(p), h = /* @__PURE__ */ U(""), g = /* @__PURE__ */ U(!0), _ = /* @__PURE__ */ U(!1), v = /* @__PURE__ */ U(!1), y = /* @__PURE__ */ U(""), b = /* @__PURE__ */ U([]), x = /* @__PURE__ */ U(/* @__PURE__ */ new Set()), S = /* @__PURE__ */ Pt({}), C = /* @__PURE__ */ U(/* @__PURE__ */ new Set()), w = /* @__PURE__ */ U(""), T = null, E = 0, D = () => ({
			ca: "va",
			va: "va",
			es: "es",
			en: "en"
		})[r.value] || "es", O = (e) => !/(^|[^A-Za-z])NC([^A-Za-z]|$)|non[- ]?commercial/i.test(e || ""), k = (e) => e.provider + ":" + e.id, ee = (e) => x.value.has(e.id) ? e.items : e.items.slice(0, Fo);
		async function A(e, t) {
			let n = await fetch(d + e, {
				credentials: "include",
				signal: t
			});
			if (n.status === 401) {
				let e = /* @__PURE__ */ Error("login");
				throw e.login = !0, e;
			}
			if (!n.ok) throw Error("bank_error");
			return n;
		}
		function te() {
			for (let e of Object.keys(S)) URL.revokeObjectURL(S[e]), delete S[e];
		}
		async function j(e, t) {
			await Promise.all(e.map(async (e) => {
				if (!S[k(e)]) try {
					let n = await (await A(`${f}/${e.provider}/${encodeURIComponent(e.id)}/thumbnail`, T?.signal)).blob();
					t === E && (S[k(e)] = URL.createObjectURL(n));
				} catch {}
			}));
		}
		async function ne() {
			let e = h.value.trim();
			if (!e || !u.server && !d) return;
			T?.abort(), T = new AbortController();
			let t = ++E;
			te(), x.value = /* @__PURE__ */ new Set(), C.value = /* @__PURE__ */ new Set(), y.value = "", v.value = !1, _.value = !0, b.value = m.value.map((e) => ({
				...e,
				status: "pending",
				items: []
			})), await Promise.all(b.value.map(async (n, r) => {
				try {
					let i = new URLSearchParams({
						q: e,
						language: D()
					}), a = await (await A(`${f}/${n.id}/search?${i}`, T.signal)).json();
					if (t !== E) return;
					let o = g.value && !n.nc ? a.items.filter((e) => O(e.license)) : a.items;
					b.value[r] = {
						...n,
						status: "done",
						items: o
					}, j(o.slice(0, Fo), t);
				} catch (e) {
					if (t !== E || e.name === "AbortError") return;
					e.login && (v.value = !0), b.value[r] = {
						...n,
						status: e.login ? "login" : "error",
						items: []
					};
				}
			})), t === E && (_.value = !1);
		}
		function re(e) {
			x.value = new Set(x.value).add(e.id), j(e.items, E);
		}
		async function M(e) {
			i.value ? (w.value = k(e), y.value = "", await c(async () => {
				try {
					let r = await (await A(`${f}/${e.provider}/${encodeURIComponent(e.id)}/content`)).blob(), i = r.type.split(";")[0];
					if (![
						"image/png",
						"image/jpeg",
						"image/webp"
					].includes(i)) throw Error("image_format");
					let c = (e.title || "Imatge").slice(0, 200), l = await t.add(new File([r], "image", { type: i }), {
						name: c,
						type: a && o === "background" ? "background" : "illustration",
						credit: e.credit || "",
						license: e.license || ""
					});
					return C.value = new Set(C.value).add(k(e)), a ? (s(l, c, !1), "") : n("rebost.banksSaved");
				} catch (e) {
					if (e.status === 401) return l(e);
					throw e.status ? e : Object.assign(/* @__PURE__ */ Error("operation_failed"), { status: 0 });
				}
			}), w.value = "") : y.value = n("rebost.banksSaveLogin");
		}
		return Qn(async () => {
			if (u.server) try {
				let e = new Set((await (await A(f)).json()).providers.map((e) => e.id));
				m.value = p.filter((t) => e.has(t.id));
			} catch {}
		}), $n(() => {
			T?.abort(), E++, te();
		}), (t, r) => (Y(), X("section", mo, [
			Z("form", {
				class: "banks-search",
				onSubmit: Ya(ne, ["prevent"])
			}, [
				Z("label", null, [Z("span", null, L(W(n)("rebost.banksSearchLabel")), 1), On(Z("input", {
					"onUpdate:modelValue": r[0] ||= (e) => h.value = e,
					type: "search",
					maxlength: "80",
					placeholder: W(n)("rebost.banksPlaceholder")
				}, null, 8, ho), [[za, h.value]])]),
				Z("label", go, [On(Z("input", {
					"onUpdate:modelValue": r[1] ||= (e) => g.value = e,
					type: "checkbox"
				}, null, 512), [[Ba, g.value]]), bi(" " + L(W(n)("rebost.banksFreeOnly")), 1)]),
				Z("button", {
					type: "submit",
					disabled: _.value || !h.value.trim()
				}, L(_.value ? W(n)("rebost.banksSearching") : W(n)("rebost.banksSearchButton")), 9, _o)
			], 32),
			_.value ? (Y(), X("p", vo, L(W(n)("rebost.banksSlow")), 1)) : Q("", !0),
			v.value ? (Y(), X("p", yo, [bi(L(W(n)("rebost.banksLogin")) + " ", 1), e.server ? Q("", !0) : (Y(), X("a", {
				key: 0,
				class: "button-link secondary",
				href: W(d),
				target: "_blank",
				rel: "noopener noreferrer"
			}, L(W(n)("rebost.banksOpenEducrea")), 9, bo))])) : Q("", !0),
			y.value ? (Y(), X("p", xo, L(y.value), 1)) : Q("", !0),
			(Y(!0), X(J, null, or(b.value, (e) => (Y(), X(J, { key: e.id }, [
				Z("h3", So, [bi(L(e.name), 1), e.status === "pending" ? (Y(), X("span", Co, " · " + L(W(n)("rebost.banksSearching")), 1)) : e.status === "error" ? (Y(), X("span", wo, " · " + L(W(n)("rebost.banksFailed")), 1)) : e.status === "done" && !e.items.length ? (Y(), X("span", To, " · " + L(W(n)("rebost.banksEmpty")), 1)) : Q("", !0)]),
				e.items.length ? (Y(), X("div", Eo, [(Y(!0), X(J, null, or(ee(e), (t) => (Y(), X("article", {
					key: k(t),
					class: "bank-card"
				}, [
					Z("div", Do, [Z("img", {
						src: S[k(t)] || void 0,
						alt: t.title
					}, null, 8, Oo)]),
					Z("h4", null, L(t.title), 1),
					Z("p", ko, [
						O(t.license) ? Q("", !0) : (Y(), X("span", {
							key: 0,
							class: "nc-badge",
							title: W(n)("rebost.banksNcTitle")
						}, "NC", 8, Ao)),
						bi(" " + L(t.license) + " ", 1),
						t.source_url ? (Y(), X(J, { key: 1 }, [r[2] ||= bi(" · ", -1), Z("a", {
							href: t.source_url,
							target: "_blank",
							rel: "noopener noreferrer"
						}, L(e.name), 9, jo)], 64)) : Q("", !0)
					]),
					Z("div", Mo, [Z("button", {
						type: "button",
						disabled: w.value === k(t) || C.value.has(k(t)),
						onClick: (e) => M(t)
					}, L(C.value.has(k(t)) ? W(n)("rebost.banksSaved") : W(a) ? W(n)("rebost.banksSaveChoose") : W(n)("rebost.banksSave")), 9, No)])
				]))), 128))])) : Q("", !0),
				e.items.length > Fo && !x.value.has(e.id) ? (Y(), X("button", {
					key: 1,
					type: "button",
					class: "secondary",
					onClick: (t) => re(e)
				}, L(W(n)("rebost.banksMore")) + " · " + L(e.name) + " (" + L(e.items.length - Fo) + ")", 9, Po)) : Q("", !0)
			], 64))), 128))
		]));
	}
};
// services/portal/src/shared/usePortalTranslations.js
function Lo() {
	let e = /* @__PURE__ */ U(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), $n(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
}
// services/portal/src/rebost/RebostApp.vue
var Ro = { class: "topbar" }, zo = {
	key: 0,
	class: "brand-lockup"
}, Bo = { class: "topbar-actions" }, Vo = {
	key: 0,
	id: "accountWidget"
}, Ho = { class: "single-layout rebost-layout" }, Uo = { class: "role-heading" }, Wo = {
	id: "intro",
	class: "teacher-intro"
}, Go = ["hidden"], Ko = { id: "accessHint" }, qo = { class: "actions" }, Jo = ["target"], Yo = ["target"], Xo = ["disabled", "hidden"], Zo = { id: "mine" }, Qo = { class: "library-toolbar panel" }, $o = ["aria-label"], es = ["aria-pressed"], ts = ["hidden", "aria-pressed"], ns = ["hidden", "aria-pressed"], rs = ["hidden", "aria-pressed"], is = { id: "collectionHint" }, as = ["hidden"], os = ["aria-label", "onKeydown"], ss = { id: "uploadText" }, cs = { id: "formats" }, ls = { id: "uploadTypeLabel" }, us = ["value"], ds = ["hidden"], fs = { id: "searchLabel" }, ps = ["placeholder"], ms = { id: "filterLabel" }, hs = ["value"], gs = ["hidden"], _s = ["aria-label", "hidden"], vs = ["hidden"], ys = ["aria-label"], bs = ["src", "alt"];
// services/portal/src/rebost/main.js
to({
	__name: "RebostApp",
	setup(a) {
		let o = new t();
		window.commonsDeployment?.mode;
		let s = new URLSearchParams(location.search), c = s.get("mode") === "pick" && window.parent !== window, l = s.get("type") === "background" ? "background" : "sprite", u = c && l === "sprite" && s.get("supports_families") === "1" && s.get("selection") === "sprite", d = [
			"sprite",
			"background",
			"object",
			"illustration"
		], f = c ? l === "background" ? ["background"] : [
			"sprite",
			"object",
			"illustration"
		] : ["", ...d];
		c && [
			"es",
			"ca",
			"va",
			"en"
		].includes(s.get("lang")) && window.i18nPortal.setLang(s.get("lang"));
		let p = /* @__PURE__ */ U(window.i18nPortal.getLang()), m = Lo(), h = /* @__PURE__ */ U(!1), g = /* @__PURE__ */ U(!1), _ = /* @__PURE__ */ U(!1), v = /* @__PURE__ */ U([]), y = /* @__PURE__ */ U(String(window.commonsDeployment?.bankSearchUrl || "")), b = Ki(() => v.value.includes("banks")), x = Ki(() => b.value || !!y.value), S = /* @__PURE__ */ U([
			"mine",
			"catalog",
			"scratch",
			"banks"
		].includes(s.get("collection")) ? s.get("collection") : ""), C = /* @__PURE__ */ U(""), w = /* @__PURE__ */ U(c ? l : ""), T = /* @__PURE__ */ U("sprite"), E = /* @__PURE__ */ U([]), D = /* @__PURE__ */ U(""), O = /* @__PURE__ */ U(""), k = /* @__PURE__ */ U(!1), ee = /* @__PURE__ */ U(null), A = /* @__PURE__ */ U(null), te = /* @__PURE__ */ U(""), j = /* @__PURE__ */ U(""), ne = Ki(() => S.value === "mine" && !g.value), re = Ki(() => m("rebost." + (S.value || "mine"))), M = !0, ie = 0, N, ae = "";
		function oe() {
			p.value = window.i18nPortal.getLang();
		}
		function se(e) {
			O.value = m("rebost." + e.message) === "rebost." + e.message ? "error" : e.message, e.status === 401 && (g.value = !1, S.value === "mine" && (ie++, E.value = [], D.value = "", he()));
		}
		async function P(e) {
			if (!_.value && M) {
				_.value = !0, O.value = "working";
				try {
					let t = await e();
					M && (O.value = typeof t == "string" ? t : "", O.value && document.getElementById("status")?.scrollIntoView({ block: "nearest" }));
				} catch (e) {
					[404, 412].includes(e.status) && await F().catch(() => {}), M && se(e);
				} finally {
					_.value = !1;
				}
			}
		}
		async function F(e = !1) {
			let t = ++ie;
			if (S.value === "banks") {
				E.value = [], D.value = "";
				return;
			}
			if (ne.value) {
				E.value = [], D.value = "", he();
				return;
			}
			let n = JSON.stringify([
				S.value,
				C.value,
				w.value
			]);
			e &&= n === ae;
			let r = await o.list({
				collection: S.value,
				q: C.value,
				type: w.value,
				cursor: e ? D.value : "",
				grouped: S.value === "scratch"
			});
			M && t === ie && (S.value !== "mine" || g.value) && (E.value = e ? [...E.value, ...r.items] : r.items, D.value = r.next_cursor, ae = n);
		}
		async function I(e) {
			S.value = e, C.value = "", w.value = c ? l : "", clearTimeout(N);
			let t = new URL(location.href);
			t.searchParams.set("collection", e), history.replaceState(null, "", t), E.value = [], D.value = "", await F();
		}
		function ce() {
			clearTimeout(N), N = setTimeout(async () => {
				M && (_.value ? ce() : await P(() => F()));
			}, 250);
		}
		async function le(e) {
			c || ne.value || S.value !== "mine" || !h.value || await P(async () => {
				try {
					for (let t of e) await o.add(t, {
						name: t.name.replace(/\.[^.]+$/, "").slice(0, 200) || "Imatge",
						type: T.value
					});
				} catch (e) {
					throw await F().catch(() => {}), e;
				}
				try {
					await F();
				} catch (e) {
					return se(e), "saved_refresh_failed";
				}
				return "image_saved";
			});
		}
		function ue() {
			h.value && !_.value && ee.value.click();
		}
		function de(e) {
			let t = [...e.target.files];
			e.target.value = "", le(t);
		}
		function pe(e) {
			k.value = !1, le([...e.dataTransfer.files]);
		}
		function me() {
			URL.revokeObjectURL(te.value), te.value = "", j.value = "";
		}
		function he() {
			A.value?.close(), me();
		}
		async function ge(e, t) {
			let n = await o.content(e.id);
			M && (e.collection !== "mine" || g.value) && (me(), te.value = URL.createObjectURL(n), j.value = t, A.value.showModal());
		}
		function _e(e, t, n) {
			r(i({
				request: s.get("request"),
				id: e.id,
				name: t,
				family: n ? e.family : null
			}));
		}
		function ve(e) {
			c && e.key === "Escape" && !A.value?.open && r(n(s.get("request")));
		}
		async function ye(n, r = !1) {
			let i = await o.blob(t.itemPath(n.id) + (r ? "/license" : "/source"), r ? e.license : e.source), a = URL.createObjectURL(i), s = document.createElement("a");
			s.href = a, s.download = n.id + (r ? ".license.txt" : ".source.svg"), document.body.append(s), s.click(), s.remove(), setTimeout(() => URL.revokeObjectURL(a), 1e3);
		}
		let be = !1;
		async function xe() {
			if (h.value && !_.value && !be && M) {
				be = !0;
				try {
					let e;
					try {
						await o.me(), e = !0;
					} catch (t) {
						if (t.status !== 401) throw t;
						e = !1;
					}
					if (!M || e === g.value) return;
					g.value = e, e || (ie++, E.value = [], D.value = "", he()), await P(() => F());
				} catch (e) {
					M && se(e);
				} finally {
					be = !1;
				}
			}
		}
		function Se(e) {
			e.persisted || (ie++, E.value = [], me());
		}
		return An("rebost", {
			api: o,
			t: m,
			locale: p,
			authenticated: g,
			picking: c,
			pickType: l,
			familySelection: u,
			types: d,
			run: P,
			refresh: F,
			chooseCollection: I,
			preview: ge,
			select: _e,
			download: ye,
			report: se
		}), Qn(async () => {
			document.body.classList.toggle("picking", c), window.addEventListener("edutictac:langchange", oe), window.addEventListener("focus", xe), window.addEventListener("edutictac:sessionchange", xe), window.addEventListener("pagehide", Se), document.addEventListener("keydown", ve), await P(async () => {
				let e;
				try {
					e = await o.me(), g.value = !0;
				} catch (t) {
					if (t.status !== 401) throw t;
					e = await o.catalogs();
				}
				v.value = e.capabilities, typeof e.bank_search_url == "string" && e.bank_search_url && (y.value = e.bank_search_url), S.value === "banks" && !x.value && (S.value = ""), S.value ||= g.value ? "mine" : "catalog", (S.value === "catalog" && !v.value.includes("catalog") || S.value === "scratch" && !v.value.includes("scratch_catalog")) && (S.value = "mine"), h.value = !0, await F();
			});
		}), $n(() => {
			M = !1, ie++, clearTimeout(N), me(), window.removeEventListener("edutictac:langchange", oe), window.removeEventListener("focus", xe), window.removeEventListener("edutictac:sessionchange", xe), window.removeEventListener("pagehide", Se), document.removeEventListener("keydown", ve), document.body.classList.remove("picking");
		}), (e, t) => (Y(), X(J, null, [Z("header", Ro, [W(c) ? Q("", !0) : (Y(), X("div", zo, [...t[13] ||= [Z("img", {
			src: "/assets/commons-mark.svg",
			alt: "",
			width: "46",
			height: "46"
		}, null, -1), Z("div", null, [Z("p", { class: "eyebrow" }, "EduTicTac Commons"), Z("h1", null, "EduTicTac Rebost")], -1)]])), Z("div", Bo, [W(c) ? (Y(), X("p", {
			key: 1,
			id: "sessionStatus",
			class: fe(["status session-status", { signed: g.value }]),
			role: "status"
		}, L(h.value ? g.value ? W(m)("rebost.signedIn") : W(m)("rebost.signedOut") : W(m)("rebost.checkingSession")), 3)) : (Y(), X("edutictac-account", Vo))])]), Z("main", Ho, [
			Z("div", Uo, [
				t[14] ||= Z("p", { class: "eyebrow" }, "EduTicTac Rebost", -1),
				Z("h2", null, L(W(m)("rebost.heading")), 1),
				Z("p", Wo, L(W(m)("rebost.intro")), 1)
			]),
			Z("p", {
				id: "status",
				class: fe({
					success: ["success", "image_saved"].includes(O.value),
					error: O.value && ![
						"success",
						"image_saved",
						"working"
					].includes(O.value)
				}),
				role: "status",
				"aria-live": "polite"
			}, L(O.value ? W(m)("rebost." + O.value) : ""), 3),
			Z("section", {
				id: "access",
				class: "panel",
				hidden: !h.value || g.value || W(c) && !["mine", "banks"].includes(S.value)
			}, [Z("p", Ko, L(W(m)("rebost.access")), 1), Z("div", qo, [Z("a", {
				class: "button-link secondary",
				id: "studentLogin",
				href: "/student.html?next=%2Fassets%2F",
				target: W(c) ? "_blank" : void 0,
				rel: "noopener noreferrer"
			}, L(W(m)("rebost.student")), 9, Jo), Z("a", {
				class: "button-link",
				id: "oidcLogin",
				href: "/api/auth/oidc/login?next=%2Fassets%2F",
				target: W(c) ? "_blank" : void 0,
				rel: "noopener noreferrer"
			}, L(W(m)("rebost.oidc")), 9, Yo)])], 8, Go),
			Z("fieldset", {
				id: "controls",
				disabled: _.value || !h.value,
				hidden: !h.value
			}, [
				Z("legend", Zo, L(re.value), 1),
				Z("div", Qo, [
					Z("div", {
						id: "collections",
						class: "collections",
						role: "group",
						"aria-label": W(m)("rebost.collection")
					}, [
						Z("button", {
							id: "mineTab",
							class: "secondary",
							type: "button",
							"aria-pressed": S.value === "mine",
							onClick: t[0] ||= (e) => P(() => I("mine"))
						}, L(W(m)("rebost.mine")) + L(g.value ? "" : " · " + W(m)("common.login")), 9, es),
						Z("button", {
							id: "catalogTab",
							class: "secondary",
							type: "button",
							hidden: !v.value.includes("catalog"),
							"aria-pressed": S.value === "catalog",
							onClick: t[1] ||= (e) => P(() => I("catalog"))
						}, L(W(m)("rebost.catalog")), 9, ts),
						Z("button", {
							id: "banksTab",
							class: "secondary",
							type: "button",
							hidden: !x.value,
							"aria-pressed": S.value === "banks",
							onClick: t[2] ||= (e) => P(() => I("banks"))
						}, L(W(m)("rebost.banks")), 9, ns),
						Z("button", {
							id: "scratchTab",
							class: "secondary",
							type: "button",
							hidden: !v.value.includes("scratch_catalog"),
							"aria-pressed": S.value === "scratch",
							onClick: t[3] ||= (e) => P(() => I("scratch"))
						}, L(W(m)("rebost.scratch")), 9, rs)
					], 8, $o),
					Z("p", is, L(S.value === "banks" ? W(m)("rebost.banksHint") : W(c) ? W(m)("rebost.pickHint") : S.value === "mine" ? W(m)("rebost.privateHint") : S.value === "scratch" ? W(m)("rebost.scratchHint") : W(m)("rebost.catalogHint")), 1),
					Z("div", {
						id: "uploadArea",
						hidden: W(c) || S.value !== "mine" || !g.value
					}, [Z("section", {
						id: "drop",
						tabindex: "0",
						role: "button",
						"aria-label": W(m)("rebost.upload"),
						class: fe({ drag: k.value }),
						onClick: ue,
						onKeydown: [Za(Ya(ue, ["self", "prevent"]), ["enter"]), Za(Ya(ue, ["self", "prevent"]), ["space"])],
						onDragenter: t[5] ||= Ya((e) => k.value = !0, ["prevent"]),
						onDragover: t[6] ||= Ya((e) => k.value = !0, ["prevent"]),
						onDragleave: t[7] ||= (e) => k.value = !1,
						onDrop: Ya(pe, ["prevent"])
					}, [
						Z("strong", ss, L(W(m)("rebost.upload")), 1),
						Z("p", cs, L(W(m)("rebost.formats")), 1),
						Z("input", {
							id: "files",
							ref_key: "filesInput",
							ref: ee,
							type: "file",
							accept: "image/png,image/jpeg,image/webp",
							multiple: "",
							hidden: "",
							onClick: t[4] ||= Ya(() => {}, ["stop"]),
							onChange: de
						}, null, 544)
					], 42, os), Z("label", null, [Z("span", ls, L(W(m)("rebost.uploadType")), 1), On(Z("select", {
						id: "uploadType",
						"onUpdate:modelValue": t[8] ||= (e) => T.value = e
					}, [(Y(), X(J, null, or(d, (e) => Z("option", {
						key: e,
						value: e
					}, L(W(m)("rebost." + e)), 9, us)), 64))], 512), [[Ha, T.value]])])], 8, as),
					Z("div", {
						class: "filters",
						hidden: ne.value || S.value === "banks"
					}, [Z("label", null, [Z("span", fs, L(W(m)("rebost.search")), 1), On(Z("input", {
						id: "search",
						"onUpdate:modelValue": t[9] ||= (e) => C.value = e,
						type: "search",
						placeholder: W(m)("rebost.searchPlaceholder"),
						maxlength: "200",
						onInput: ce
					}, null, 40, ps), [[za, C.value]])]), Z("label", null, [Z("span", ms, L(W(m)("rebost.filter")), 1), On(Z("select", {
						id: "filter",
						"onUpdate:modelValue": t[10] ||= (e) => w.value = e,
						onChange: t[11] ||= (e) => P(() => F())
					}, [(Y(!0), X(J, null, or(W(f), (e) => (Y(), X("option", {
						key: e,
						value: e
					}, L(e ? W(m)("rebost." + e) : W(m)("rebost.all")), 9, hs))), 128))], 544), [[Ha, w.value]])])], 8, ds)
				]),
				S.value === "banks" && x.value ? (Y(), di(Io, {
					key: 0,
					base: b.value ? "" : y.value,
					server: b.value
				}, null, 8, ["base", "server"])) : Q("", !0),
				Z("p", {
					id: "empty",
					hidden: ne.value || S.value === "banks" || E.value.length > 0 || _.value
				}, L(W(m)("rebost.empty")), 9, gs),
				Z("section", {
					id: "grid",
					"aria-label": re.value,
					hidden: ne.value || S.value === "banks"
				}, [(Y(!0), X(J, null, or(E.value, (e) => (Y(), di(po, {
					key: e.id,
					item: e
				}, null, 8, ["item"]))), 128))], 8, _s),
				Z("button", {
					id: "more",
					type: "button",
					hidden: ne.value || S.value === "banks" || !D.value,
					onClick: t[12] ||= (e) => P(() => F(!0))
				}, L(W(m)("rebost.more")), 9, vs)
			], 8, Xo),
			Z("dialog", {
				id: "preview",
				ref_key: "dialog",
				ref: A,
				"aria-label": W(m)("rebost.view"),
				onClose: me
			}, [Z("button", {
				id: "closePreview",
				type: "button",
				onClick: he
			}, L(W(m)("rebost.close")), 1), Z("img", {
				id: "previewImage",
				src: te.value || void 0,
				alt: j.value
			}, null, 8, bs)], 40, ys)
		])], 64));
	}
}).mount("#rebost");
