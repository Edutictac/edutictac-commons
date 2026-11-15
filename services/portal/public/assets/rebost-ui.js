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
}, m = Object.prototype.hasOwnProperty, h = (e, t) => m.call(e, t), g = Array.isArray, _ = (e) => E(e) === "[object Map]", v = (e) => E(e) === "[object Set]", y = (e) => E(e) === "[object Date]", b = (e) => typeof e == "function", x = (e) => typeof e == "string", S = (e) => typeof e == "symbol", C = (e) => typeof e == "object" && !!e, w = (e) => (C(e) || b(e)) && b(e.then) && b(e.catch), T = Object.prototype.toString, E = (e) => T.call(e), D = (e) => E(e).slice(8, -1), ee = (e) => E(e) === "[object Object]", te = (e) => x(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ne = /* @__PURE__ */ a(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), re = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ie = /-\w/g, O = re((e) => e.replace(ie, (e) => e.slice(1).toUpperCase())), k = /\B([A-Z])/g, A = re((e) => e.replace(k, "-$1").toLowerCase()), ae = re((e) => e.charAt(0).toUpperCase() + e.slice(1)), oe = re((e) => e ? `on${ae(e)}` : ""), j = (e, t) => !Object.is(e, t), se = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, M = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, N = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ce, le = () => ce ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function P(e) {
	if (g(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = x(r) ? pe(r) : P(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (x(e) || C(e)) return e;
}
var ue = /;(?![^(]*\))/g, de = /:([^]+)/, fe = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function pe(e) {
	let t = {};
	return e.replace(fe, (e) => e.startsWith("/*") ? "" : e).split(ue).forEach((e) => {
		if (e) {
			let n = e.split(de);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function me(e) {
	let t = "";
	if (x(e)) t = e;
	else if (g(e)) for (let n = 0; n < e.length; n++) {
		let r = me(e[n]);
		r && (t += r + " ");
	}
	else if (C(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var he = /* @__PURE__ */ a("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function ge(e) {
	return !!e || e === "";
}
function _e(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = F(e[i], t[i], n);
	return r;
}
function ve(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && F(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function ye(e, t, n) {
	let r = _(e), i = _(t);
	if (r || i || (r = v(e), i = v(t), r || i)) return r && i ? ve(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !F(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function be(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function F(e, t, n) {
	if (e === t) return !0;
	let r = y(e), i = y(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = S(e), i = S(t), r || i ? e === t : (r = g(e), i = g(t), r || i ? r && i ? be(e, t, n, _e) : !1 : (r = C(e), i = C(t), r || i ? !r || !i ? !1 : be(e, t, n, ye) : String(e) === String(t))));
}
function xe(e, t) {
	return e.findIndex((e) => F(e, t));
}
var Se = (e) => !!(e && e.__v_isRef === !0), I = (e) => x(e) ? e : e == null ? "" : g(e) || C(e) && (e.toString === T || !b(e.toString)) ? Se(e) ? I(e.value) : JSON.stringify(e, Ce, 2) : String(e), Ce = (e, t) => Se(t) ? Ce(e, t.value) : _(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[we(t, r) + " =>"] = n, e), {}) } : v(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => we(e)) } : S(t) ? we(t) : C(t) && !g(t) && !ee(t) ? String(t) : t, we = (e, t = "") => S(e) ? `Symbol(${e.description ?? t})` : e, L, Te = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && L && (L.active ? (this.parent = L, this.index = (L.scopes || (L.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = L;
			try {
				return L = this, e();
			} finally {
				L = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = L, L = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (L === this) L = this.prevScope;
			else {
				let e = L;
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
function Ee() {
	return L;
}
var R, De = /* @__PURE__ */ new WeakSet(), Oe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, L && (L.active ? L.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, De.has(this) && (De.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Me(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ge(this), Fe(this);
		let e = R, t = Ve;
		R = this, Ve = !0;
		try {
			return this.fn();
		} finally {
			Ie(this), R = e, Ve = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) ze(e);
			this.deps = this.depsTail = void 0, Ge(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? De.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Le(this) && this.run();
	}
	get dirty() {
		return Le(this);
	}
}, ke = 0, Ae, je;
function Me(e, t = !1) {
	e.flags |= 8, t ? (e.next = je, je = e) : (e.next = Ae, Ae = e);
}
function Ne() {
	ke++;
}
function Pe() {
	if (--ke > 0) return;
	if (je) {
		let e = je;
		for (je = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ae;) {
		let t = Ae;
		for (Ae = void 0; t;) {
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
function Fe(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ie(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), ze(r), Be(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Le(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Re(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Re(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ke) || (e.globalVersion = Ke, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Le(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = R, r = Ve;
	R = e, Ve = !0;
	try {
		Fe(e);
		let n = e.fn(e._value);
		(t.version === 0 || j(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		R = n, Ve = r, Ie(e), e.flags &= -3;
	}
}
function ze(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) ze(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Be(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ve = !0, He = [];
function Ue() {
	He.push(Ve), Ve = !1;
}
function We() {
	let e = He.pop();
	Ve = e === void 0 || e;
}
function Ge(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = R;
		R = void 0;
		try {
			t();
		} finally {
			R = e;
		}
	}
}
var Ke = 0, qe = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Je = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!R || !Ve || R === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== R) t = this.activeLink = new qe(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, Ye(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ke++, this.notify(e);
	}
	notify(e) {
		Ne();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Pe();
		}
	}
};
function Ye(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ye(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Xe = /* @__PURE__ */ new WeakMap(), Ze = /* @__PURE__ */ Symbol(""), Qe = /* @__PURE__ */ Symbol(""), $e = /* @__PURE__ */ Symbol("");
function z(e, t, n) {
	if (Ve && R) {
		let t = Xe.get(e);
		t || Xe.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Je()), r.map = t, r.key = n), r.track();
	}
}
function et(e, t, n, r, i, a) {
	let o = Xe.get(e);
	if (!o) {
		Ke++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ne(), t === "clear") o.forEach(s);
	else {
		let i = g(e), a = i && te(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === $e || !S(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get($e)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ze)), _(e) && s(o.get(Qe)));
				break;
			case "delete":
				i || (s(o.get(Ze)), _(e) && s(o.get(Qe)));
				break;
			case "set": _(e) && s(o.get(Ze));
		}
	}
	Pe();
}
function tt(e) {
	let t = /* @__PURE__ */ B(e);
	return t === e || (z(t, "iterate", $e), /* @__PURE__ */ Vt(e)) ? t : /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e) ? t.map((e) => Gt(Wt(e))) : t.map(Gt) : t.map(Wt);
}
function nt(e) {
	return z(e = /* @__PURE__ */ B(e), "iterate", $e), e;
}
function rt(e, t) {
	return /* @__PURE__ */ Bt(e) ? Gt(/* @__PURE__ */ zt(e) ? Wt(t) : t) : Wt(t);
}
var it = {
	__proto__: null,
	[Symbol.iterator]() {
		return at(this, Symbol.iterator, (e) => rt(this, e));
	},
	concat(...e) {
		return tt(this).concat(...e.map((e) => g(e) ? tt(e) : e));
	},
	entries() {
		return at(this, "entries", (e) => (e[1] = rt(this, e[1]), e));
	},
	every(e, t) {
		return ct(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ct(this, "filter", e, t, (e) => e.map((e) => rt(this, e)), arguments);
	},
	find(e, t) {
		return ct(this, "find", e, t, (e) => rt(this, e), arguments);
	},
	findIndex(e, t) {
		return ct(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ct(this, "findLast", e, t, (e) => rt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ct(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ct(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ut(this, "includes", e);
	},
	indexOf(...e) {
		return ut(this, "indexOf", e);
	},
	join(e) {
		return tt(this).join(e);
	},
	lastIndexOf(...e) {
		return ut(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ct(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return dt(this, "pop");
	},
	push(...e) {
		return dt(this, "push", e);
	},
	reduce(e, ...t) {
		return lt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return lt(this, "reduceRight", e, t);
	},
	shift() {
		return dt(this, "shift");
	},
	some(e, t) {
		return ct(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return dt(this, "splice", e);
	},
	toReversed() {
		return tt(this).toReversed();
	},
	toSorted(e) {
		return tt(this).toSorted(e);
	},
	toSpliced(...e) {
		return tt(this).toSpliced(...e);
	},
	unshift(...e) {
		return dt(this, "unshift", e);
	},
	values() {
		return at(this, "values", (e) => rt(this, e));
	}
};
function at(e, t, n) {
	let r = nt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ Vt(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => ot(a.next(), n), i !== st[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => ot(a._next(), n);
	}
	return a;
}
function ot(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var st = Array.prototype;
function ct(e, t, n, r, i, a) {
	let o = nt(e), s = o !== e && !/* @__PURE__ */ Vt(e), c = o[t];
	if (c !== st[t]) {
		let t = c.apply(e, a);
		return s ? Wt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, rt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function lt(e, t, n, r) {
	let i = nt(e), a = i !== e && !/* @__PURE__ */ Vt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = rt(e, t)), n.call(this, t, rt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? rt(e, c) : c;
}
function ut(e, t, n) {
	let r = /* @__PURE__ */ B(e);
	z(r, "iterate", $e);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Ht(n[0]) ? (n[0] = /* @__PURE__ */ B(n[0]), r[t](...n)) : i;
}
function dt(e, t, n = []) {
	Ue(), Ne();
	let r = (/* @__PURE__ */ B(e))[t].apply(e, n);
	return Pe(), We(), r;
}
var ft = /* @__PURE__ */ a("__proto__,__v_isRef,__isVue"), pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(S));
function mt(e) {
	S(e) || (e = String(e));
	let t = /* @__PURE__ */ B(this);
	return z(t, "has", e), t.hasOwnProperty(e);
}
var ht = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Nt : Mt : i ? jt : At).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = g(e);
		if (!r) {
			let e;
			if (a && (e = it[t])) return e;
			if (t === "hasOwnProperty") return mt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ V(e) ? e : n);
		if ((S(t) ? pt.has(t) : ft(t)) || (r || z(e, "get", t), i)) return o;
		if (/* @__PURE__ */ V(o)) {
			let e = a && te(t) ? o : o.value;
			return r && C(e) ? /* @__PURE__ */ Lt(e) : e;
		}
		return C(o) ? r ? /* @__PURE__ */ Lt(o) : /* @__PURE__ */ Ft(o) : o;
	}
}, gt = class extends ht {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = g(e) && te(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Bt(i);
			if (!/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (i = /* @__PURE__ */ B(i), n = /* @__PURE__ */ B(n)), !a && /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : h(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ V(e) ? e : r);
		return e === /* @__PURE__ */ B(r) && s && (o ? j(n, i) && et(e, "set", t, n, i) : et(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = h(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && et(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return S(t) && pt.has(t) || z(e, "has", t), n;
	}
	ownKeys(e) {
		return z(e, "iterate", g(e) ? "length" : Ze), Reflect.ownKeys(e);
	}
}, _t = class extends ht {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new _t(), bt = /* @__PURE__ */ new gt(!0), xt = (e) => e, St = (e) => Reflect.getPrototypeOf(e);
function Ct(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ B(i), o = _(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? xt : t ? Gt : Wt;
		return !t && z(a, "iterate", c ? Qe : Ze), f(Object.create(l), { next() {
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
function wt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Tt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ B(r), a = /* @__PURE__ */ B(n);
			e || (j(n, a) && z(i, "get", n), z(i, "get", a));
			let { has: o } = St(i), s = t ? xt : e ? Gt : Wt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && z(/* @__PURE__ */ B(t), "iterate", Ze), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ B(n), i = /* @__PURE__ */ B(t);
			return e || (j(t, i) && z(r, "has", t), z(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ B(a), s = t ? xt : e ? Gt : Wt;
			return !e && z(o, "iterate", Ze), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return f(n, e ? {
		add: wt("add"),
		set: wt("set"),
		delete: wt("delete"),
		clear: wt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ B(this), r = St(n), i = /* @__PURE__ */ B(e), a = !t && !/* @__PURE__ */ Vt(e) && !/* @__PURE__ */ Bt(e) ? i : e;
			return r.has.call(n, a) || j(e, a) && r.has.call(n, e) || j(i, a) && r.has.call(n, i) || (n.add(a), et(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Vt(n) || /* @__PURE__ */ Bt(n) || (n = /* @__PURE__ */ B(n));
			let r = /* @__PURE__ */ B(this), { has: i, get: a } = St(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ B(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? j(n, s) && et(r, "set", e, n, s) : et(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ B(this), { has: n, get: r } = St(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ B(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && et(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ B(this), t = e.size !== 0, n = e.clear();
			return t && et(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ct(r, e, t);
	}), n;
}
function Et(e, t) {
	let n = Tt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(h(n, i) && i in r ? n : r, i, a);
}
var Dt = { get: /* @__PURE__ */ Et(!1, !1) }, Ot = { get: /* @__PURE__ */ Et(!1, !0) }, kt = { get: /* @__PURE__ */ Et(!0, !1) }, At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap();
function Pt(e) {
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
function Ft(e) {
	return /* @__PURE__ */ Bt(e) ? e : Rt(e, !1, vt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Rt(e, !1, bt, Ot, jt);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return Rt(e, !0, yt, kt, Mt);
}
function Rt(e, t, n, r, i) {
	if (!C(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Pt(D(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ B(t) : e;
}
function Ut(e) {
	return !h(e, "__v_skip") && Object.isExtensible(e) && M(e, "__v_skip", !0), e;
}
var Wt = (e) => C(e) ? /* @__PURE__ */ Ft(e) : e, Gt = (e) => C(e) ? /* @__PURE__ */ Lt(e) : e;
// @__NO_SIDE_EFFECTS__
function V(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function H(e) {
	return Kt(e, !1);
}
function Kt(e, t) {
	return /* @__PURE__ */ V(e) ? e : new qt(e, t);
}
var qt = class {
	constructor(e, t) {
		this.dep = new Je(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ B(e), this._value = t ? e : Wt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Vt(e) || /* @__PURE__ */ Bt(e);
		e = n ? e : /* @__PURE__ */ B(e), j(e, t) && (this._rawValue = e, this._value = n ? e : Wt(e), this.dep.trigger());
	}
};
function U(e) {
	return /* @__PURE__ */ V(e) ? e.value : e;
}
var Jt = {
	get: (e, t, n) => t === "__v_raw" ? e : U(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Yt(e) {
	return /* @__PURE__ */ zt(e) ? e : new Proxy(e, Jt);
}
var Xt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Je(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ke - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && R !== this) return Me(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Re(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Zt(e, t, n = !1) {
	let r, i;
	return b(e) ? r = e : (r = e.get, i = e.set), new Xt(r, i, n);
}
var Qt = {}, $t = /* @__PURE__ */ new WeakMap(), en = void 0;
function tn(e, t = !1, n = en) {
	if (n) {
		let t = $t.get(n);
		t || $t.set(n, t = []), t.push(e);
	}
}
function nn(e, t, n = o) {
	let { immediate: r, deep: i, once: a, scheduler: s, augmentJob: l, call: u } = n, d = (e) => i ? e : /* @__PURE__ */ Vt(e) || i === !1 || i === 0 ? rn(e, 1) : rn(e), f, m, h, _, v = !1, y = !1;
	if (/* @__PURE__ */ V(e) ? (m = () => e.value, v = /* @__PURE__ */ Vt(e)) : /* @__PURE__ */ zt(e) ? (m = () => d(e), v = !0) : g(e) ? (y = !0, v = e.some((e) => /* @__PURE__ */ zt(e) || /* @__PURE__ */ Vt(e)), m = () => e.map((e) => {
		if (/* @__PURE__ */ V(e)) return e.value;
		if (/* @__PURE__ */ zt(e)) return d(e);
		if (b(e)) return u ? u(e, 2) : e();
	})) : m = b(e) ? t ? u ? () => u(e, 2) : e : () => {
		if (h) {
			Ue();
			try {
				h();
			} finally {
				We();
			}
		}
		let t = en;
		en = f;
		try {
			return u ? u(e, 3, [_]) : e(_);
		} finally {
			en = t;
		}
	} : c, t && i) {
		let e = m, t = i === !0 ? Infinity : i;
		m = () => rn(e(), t);
	}
	let x = Ee(), S = () => {
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
	let C = y ? Array(e.length).fill(Qt) : Qt, w = (e) => {
		if (f.flags & 1 && (f.dirty || e)) {
			if (t) {
				let n = f.run();
				if (e || i || v || (y ? n.some((e, t) => j(e, C[t])) : j(n, C))) {
					let e = en;
					Ue();
					try {
						h && h(), en = f;
						let e = [
							n,
							C === Qt ? void 0 : y && C[0] === Qt ? [] : C,
							_
						];
						C = n, u ? u(t, 3, e) : t(...e);
					} finally {
						en = e, We();
					}
				}
			} else f.run();
		}
	};
	return l && l(w), f = new Oe(m), f.scheduler = s ? () => s(w, !1) : w, _ = (e) => tn(e, !1, f), h = f.onStop = () => {
		let e = $t.get(f);
		if (e) {
			if (u) u(e, 4);
			else for (let t of e) t();
			$t.delete(f);
		}
	}, t ? r ? w(!0) : C = f.run() : s ? s(w.bind(null, !0), !0) : f.run(), S.pause = f.pause.bind(f), S.resume = f.resume.bind(f), S.stop = S, S;
}
function rn(e, t = Infinity, n) {
	if (t <= 0 || !C(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ V(e)) rn(e.value, t, n);
	else if (g(e)) for (let r = 0; r < e.length; r++) rn(e[r], t, n);
	else if (v(e) || _(e)) e.forEach((e) => {
		rn(e, t, n);
	});
	else if (ee(e)) {
		for (let r in e) rn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && rn(e[r], t, n);
	}
	return e;
}
// ../../../../../../home/daizan/github/Edutictac/edutictac-commons/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function an(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		sn(e, t, n);
	}
}
function on(e, t, n, r) {
	if (b(e)) {
		let i = an(e, t, n, r);
		return i && w(i) && i.catch((e) => {
			sn(e, t, n);
		}), i;
	}
	if (g(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(on(e[a], t, n, r));
		return i;
	}
}
function sn(e, t, n, r = !0) {
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
			Ue(), an(a, null, 10, [
				e,
				i,
				o
			]), We();
			return;
		}
	}
	cn(e, n, i, r, s);
}
function cn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var W = [], ln = -1, un = [], dn = null, fn = 0, pn = /* @__PURE__ */ Promise.resolve(), mn = null;
function hn(e) {
	let t = mn || pn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function gn(e) {
	let t = ln + 1, n = W.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = W[r], a = wn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function _n(e) {
	if (!(e.flags & 1)) {
		let t = wn(e), n = W[W.length - 1];
		!n || !(e.flags & 2) && t >= wn(n) ? W.push(e) : W.splice(gn(t), 0, e), e.flags |= 1, vn();
	}
}
function vn() {
	mn ||= pn.then(Tn);
}
function yn(e) {
	if (!g(e)) dn && e.id === -1 ? dn.splice(fn + 1, 0, e) : e.flags & 1 || (un.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) un.push(e[t]);
	vn();
}
function bn(e, t, n, r = ln + 1) {
	for (; r < W.length; r++) {
		let n = W[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			W.splice(r, 1), r = e ? r - 1 : ln, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function xn(e, t, n = 0) {
	if (un.length) {
		let e = un, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < un.length; i++) {
				let a = un[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? un[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => wn(e) - wn(t));
		if (un.length = r, dn) {
			for (let e = 0; e < i.length; e++) dn.push(i[e]);
			return;
		}
		for (dn = i, fn = 0; fn < dn.length; fn++) {
			let e = dn[fn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		dn = null, fn = 0;
	}
}
var Sn = !1;
function Cn(e, t) {
	if (Sn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(un);
	e(), Sn = !0;
	try {
		bn(void 0, t), xn(void 0, n, t);
	} finally {
		Sn = !1;
	}
}
var wn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Tn(e) {
	try {
		for (ln = 0; ln < W.length; ln++) {
			let e = W[ln];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), an(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; ln < W.length; ln++) {
			let e = W[ln];
			e && (e.flags &= -2);
		}
		ln = -1, W.length = 0, xn(e), mn = null, (W.length || un.length) && Tn(e);
	}
}
var G = null, En = null;
function Dn(e) {
	let t = G;
	return G = e, En = e && e.type.__scopeId || null, t;
}
function On(e, t = G, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && li(-1);
		let i = Dn(t), a = oi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = oi.length; e > a; e--) si();
			Dn(i), r._d && li(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function kn(e, t) {
	if (G === null) return e;
	let n = Ui(G), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, s, c = o] = t[e];
		i && (b(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && rn(a), r.push({
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
function An(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ue(), on(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), We());
	}
}
function jn(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function Mn(e, t, n = !1) {
	let r = Ai();
	if (r || hr) {
		let i = hr ? hr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && b(t) ? t.call(r && r.proxy) : t;
	}
}
var Nn = /* @__PURE__ */ Symbol.for("v-scx"), Pn = () => Mn(Nn);
function Fn(e, t, n) {
	return In(e, t, n);
}
function In(e, t, n = o) {
	let { immediate: r, deep: i, flush: a, once: s } = n, l = f({}, n), u = t && r || !t && a !== "post", d;
	if (Ii) {
		if (a === "sync") {
			let e = Pn();
			d = e.__watcherHandles ||= [];
		} else if (!u) {
			let e = () => {};
			return e.stop = c, e.resume = c, e.pause = c, e;
		}
	}
	let p = $;
	l.call = (e, t, n) => on(e, p, t, n);
	let m = !1;
	a === "post" ? l.scheduler = (e) => {
		e.i = p, K(e, p && p.suspense);
	} : a !== "sync" && (m = !0, l.scheduler = (e, t) => {
		t ? e() : _n(e);
	}), l.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = nn(e, t, l);
	return Ii && (d ? d.push(h) : u && h()), h;
}
var Ln = /* @__PURE__ */ Symbol("_vte"), Rn = (e) => e.__isTeleport, zn = /* @__PURE__ */ Symbol("_leaveCb");
function Bn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ii) {
			t = n;
			break;
		}
	}
	return t;
}
function Vn(e) {
	if (!Xn(e)) return Rn(e.type) && e.children ? Bn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && b(n.default)) return n.default();
	}
}
function Hn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Hn(Rn(n.type) && Vn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === q && g(e.children)) {
		let n = xr(e.children, !1);
		n && Hn(n, t);
	}
}
function Un(e) {
	if (e.component) return Un(e.component.subTree);
	if (e.type === q) {
		let t = g(e.children) && xr(e.children, !1);
		return t ? Un(t) : void 0;
	}
	if (e.type !== ii) return e;
}
function Wn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Gn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Kn = /* @__PURE__ */ new WeakMap();
function qn(e, t, n, r, i = !1) {
	if (g(e)) {
		e.forEach((e, a) => qn(e, t && (g(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Yn(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && qn(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ui(r.component) : r.el, s = i ? null : a, { i: c, r: u } = e, d = t && t.r, f = c.refs === o ? c.refs = {} : c.refs, m = c.setupState, _ = /* @__PURE__ */ B(m), v = m === o ? l : (e) => !Gn(f, e) && h(_, e), y = (e, t) => !(t && Gn(f, t));
	if (d != null && d !== u) {
		if (Jn(t), x(d)) f[d] = null, v(d) && (m[d] = null);
		else if (/* @__PURE__ */ V(d)) {
			let e = t;
			y(d, e.k) && (d.value = null), e.k && (f[e.k] = null);
		}
	}
	if (b(u)) an(u, c, 12, [s, f]);
	else {
		let t = x(u), r = /* @__PURE__ */ V(u);
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
					o(), Kn.delete(e);
				};
				t.id = -1, Kn.set(e, t), K(t, n);
			} else Jn(e), o();
		}
	}
}
function Jn(e) {
	let t = Kn.get(e);
	t && (t.flags |= 8, Kn.delete(e));
}
le().requestIdleCallback, le().cancelIdleCallback;
var Yn = (e) => !!e.type.__asyncLoader, Xn = (e) => e.type.__isKeepAlive;
function Zn(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ue();
			let i = Ni(n), a = on(t, n, e, r);
			return i(), We(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Qn = (e) => (t, n = $) => {
	Ii && e !== "sp" || Zn(e, (...e) => t(...e), n);
}, $n = Qn("m"), er = Qn("bum"), tr = "components";
function nr(e, t) {
	return ar(tr, e, !0, t) || e;
}
var rr = /* @__PURE__ */ Symbol.for("v-ndc");
function ir(e) {
	return x(e) ? ar(tr, e, !1) || e : e || rr;
}
function ar(e, t, n = !0, r = !1) {
	let i = G || $;
	if (i) {
		let n = i.type;
		if (e === tr) {
			let e = Wi(n, !1);
			if (e && (e === t || e === O(t) || e === ae(O(t)))) return n;
		}
		let a = or(i[e] || n[e], t) || or(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function or(e, t) {
	return e && (e[t] || e[O(t)] || e[ae(O(t))]);
}
function sr(e, t, n, r) {
	let i, a = n && n[r], o = g(e);
	if (o || x(e)) {
		let n = o && /* @__PURE__ */ zt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Vt(e), s = /* @__PURE__ */ Bt(e), e = nt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Gt(Wt(e[n])) : Wt(e[n]) : e[n], n, void 0, a && a[n]);
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
var cr = (e) => e ? Fi(e) ? Ui(e) : cr(e.parent) : null, lr = /* @__PURE__ */ f(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => cr(e.parent),
	$root: (e) => cr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		_n(e.update);
	},
	$nextTick: (e) => e.n ||= hn.bind(e.proxy),
	$watch: (e) => c
}), ur = (e, t) => e !== o && !e.__isScriptSetup && h(e, t), dr = {
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
			else if (ur(r, t)) return s[t] = 1, r[t];
			else if (h(a, t)) return s[t] = 3, a[t];
			else if (n !== o && h(n, t)) return s[t] = 4, n[t];
			else s[t] = 0;
		}
		let u = lr[t], d, f;
		if (u) return t === "$attrs" && z(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== o && h(n, t)) return s[t] = 4, n[t];
		if (f = l.config.globalProperties, h(f, t)) return f[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return ur(i, t) ? (i[t] = n, !0) : h(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || ur(t, s) || h(a, s) || h(r, s) || h(lr, s) || h(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? h(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function fr() {
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
var pr = 0;
function mr(e, t) {
	return function(n, r = null) {
		b(n) || (n = f({}, n)), r != null && !C(r) && (r = null);
		let i = fr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: pr++,
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
				s && (on(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = hr;
				hr = c;
				try {
					return e();
				} finally {
					hr = t;
				}
			}
		};
		return c;
	};
}
var hr = null, gr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${O(t)}Modifiers`] || e[`${A(t)}Modifiers`];
function _r(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || o, i = n, a = t.startsWith("update:"), s = a && gr(r, t.slice(7));
	s && (s.trim && (i = n.map((e) => x(e) ? e.trim() : e)), s.number && (i = i.map(N)));
	let c, l = r[c = oe(t)] || r[c = oe(O(t))];
	!l && a && (l = r[c = oe(A(t))]), l && on(l, e, 6, i);
	let u = r[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, on(u, e, 6, i);
	}
}
function vr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (g(a) ? a.forEach((e) => o[e] = null) : f(o, a), C(e) && r.set(e, o), o) : (C(e) && r.set(e, null), null);
}
function yr(e, t) {
	return !e || !u(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), h(e, t[0].toLowerCase() + t.slice(1)) || h(e, A(t)) || h(e, t));
}
function br(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Dn(e), v, y;
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
			}) : e(f, null)), y = t.props ? s : Sr(s);
		}
	} catch (t) {
		oi.length = 0, sn(t, e, 1), v = gi(ii);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(d) && (y = Cr(y, a)), b = yi(b, y, !1, !0));
	}
	return n.dirs && (b = yi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Hn(Rn(b.type) && Vn(b) || b, n.transition), v = b, Dn(_), v;
}
function xr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (fi(r)) {
			if (r.type !== ii || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var Sr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || u(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Cr = (e, t) => {
	let n = {};
	for (let r in e) d(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function wr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Tr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Er(o, r, n) && !yr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Tr(r, o, l) : !!o;
	return !1;
}
function Tr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!h(e, a) || Er(t, e, a) && !yr(n, a)) return !0;
	}
	return !1;
}
function Er(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && C(r) && C(i) ? !F(r, i) : r !== i;
}
function Dr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Or = {}, kr = () => Object.create(Or), Ar = (e) => Object.getPrototypeOf(e) === Or;
function jr(e, t, n, r = !1) {
	let i = {}, a = kr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Nr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ It(i) : e.type.props ? i : a, e.attrs = a;
}
function Mr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ B(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (yr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (h(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = O(o);
						i[t] = Pr(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Nr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (h(t, a) || (r = A(a)) !== a && h(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Pr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && h(t, e) || (delete a[e], l = !0);
	}
	l && et(e.attrs, "set", "");
}
function Nr(e, t, n, r) {
	let [i, a] = e.propsOptions, s = !1, c;
	if (t) for (let o in t) {
		if (ne(o)) continue;
		let l = t[o], u;
		i && h(i, u = O(o)) ? !a || !a.includes(u) ? n[u] = l : (c ||= {})[u] = l : yr(e.emitsOptions, o) || o in r && l === r[o] || (r[o] = l, s = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ B(n), r = c || o;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Pr(i, t, s, r[s], e, !h(r, s));
		}
	}
	return s;
}
function Pr(e, t, n, r, i, a) {
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === A(n)) && (r = !0));
	}
	return r;
}
function Fr(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, c = {}, l = [];
	if (!a) return C(e) && r.set(e, s), s;
	if (g(a)) for (let e = 0; e < a.length; e++) {
		let t = O(a[e]);
		Ir(t) && (c[t] = o);
	}
	else if (a) for (let e in a) {
		let t = O(e);
		if (Ir(t)) {
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
function Ir(e) {
	return e[0] !== "$" && !ne(e);
}
var Lr = (e) => e === "_" || e === "_ctx" || e === "$stable", Rr = (e) => g(e) ? e.map(xi) : [xi(e)], zr = (e, t, n) => {
	if (t._n) return t;
	let r = On((...e) => Rr(t(...e)), n);
	return r._c = !1, r;
}, Br = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Lr(n)) continue;
		let i = e[n];
		if (b(i)) t[n] = zr(n, i, r);
		else if (i != null) {
			let e = Rr(i);
			t[n] = () => e;
		}
	}
}, Vr = (e, t) => {
	let n = Rr(t);
	e.slots.default = () => n;
}, Hr = (e, t, n) => {
	for (let r in t) (n || !Lr(r)) && (e[r] = t[r]);
}, Ur = (e, t, n) => {
	let r = e.slots = kr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Hr(r, t, n), n && M(r, "_", e, !0)) : Br(t, r);
	} else t && Vr(e, t);
}, Wr = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, s = o;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Hr(i, t, n) : (a = !t.$stable, Br(t, i)), s = t;
	} else t && (Vr(e, t), s = { default: 1 });
	if (a) for (let e in i) !Lr(e) && s[e] == null && delete i[e];
}, K = ni;
function Gr(e) {
	return Kr(e);
}
function Kr(e, t) {
	let n = le();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = c, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !pi(e, t) && (r = me(e), P(e, i, a, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === s && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case ri:
				y(e, t, n, r);
				break;
			case ii:
				b(e, t, n, r);
				break;
			case ai:
				e ?? x(t, n, r, o);
				break;
			case q:
				ie(e, t, n, r, i, a, o, c, l);
				break;
			default: f & 1 ? w(e, t, n, r, i, a, o, c, l) : f & 6 ? O(e, t, n, r, i, a, o, c, l) : (f & 64 || f & 128) && u.process(e, t, n, r, i, a, o, c, l, ge);
		}
		d != null && i ? qn(d, e && e.ref, a, t || e, !t) : d == null && e && e.ref != null && qn(e.ref, null, a, e, !0);
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
				n && n._beginPatch(), ee(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, i, o, s, c, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, s, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, i, o, qr(e, s), c, u), _ && An(e, null, i, "created"), E(d, e, e.scopeId, c, i), m) {
			for (let e in m) e !== "value" && !ne(e) && a(d, e, null, m[e], s, i);
			"value" in m && a(d, "value", null, m.value, s), (f = m.onVnodeBeforeMount) && Ti(f, i, e);
		}
		_ && An(e, null, i, "beforeMount");
		let v = Yr(o, g);
		v && g.beforeEnter(d), r(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && K(() => {
			try {
				f && Ti(f, i, e), v && g.enter(d), _ && An(e, null, i, "mounted");
			} finally {}
		}, o);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ti(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Si(e[l]) : xi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ee = (e, t, n, r, i, s, c) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || o, h = t.props || o, g;
		if (n && Jr(n, !1), (g = h.onVnodeBeforeUpdate) && Ti(g, n, t, e), f && An(t, e, n, "beforeUpdate"), n && Jr(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, c = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? te(e.dynamicChildren, d, l, n, r, qr(t, i), s) : c || j(e, t, l, null, n, r, qr(t, i), s, !1), u > 0) {
			if (u & 16) re(l, m, h, n, i);
			else if (u & 2 && m.class !== h.class && a(l, "class", null, h.class, i), u & 4 && a(l, "style", m.style, h.style, i), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = m[r], s = h[r];
					(s !== o || r === "value") && a(l, r, o, s, i, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !c && d == null && re(l, m, h, n, i);
		((g = h.onVnodeUpdated) || f) && K(() => {
			g && Ti(g, n, t, e), f && An(t, e, n, "updated");
		}, r);
	}, te = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || ei(c), d = u && (c.type === q || !pi(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, re = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== o) for (let o in t) !ne(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (ne(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ie = (e, t, n, i, a, o, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), D(t.children || [], n, f, a, o, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (te(e.dynamicChildren, m, n, a, o, s, c), (t.key != null || a && t === a.subTree) && Xr(e, t, !0)) : j(e, t, n, f, a, o, s, c, l);
	}, O = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : k(t, n, r, i, a, o, c) : A(e, t, c);
	}, k = (e, t, n, r, i, a, o) => {
		let s = e.component = ki(e, r, i);
		if (Xn(e) && (s.ctx.renderer = ge), Li(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o, a), !e.el) {
				let r = s.subTree = gi(ii);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, A = (e, t, n) => {
		let r = t.component = e.component;
		if (wr(e, t, n)) {
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
					let n = Qr(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							K(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Jr(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && se(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ti(d, s, t, c), Jr(e, !0);
				let f = br(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), me(p), e, i, a), t.el = f.el, u === null && Dr(e, f.el), r && K(r, i), (d = t.props && t.props.onVnodeUpdated) && K(() => Ti(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Yn(t);
				if (Jr(e, !1), l && se(l), !m && (o = c && c.onVnodeBeforeMount) && Ti(o, d, t), Jr(e, !0), s && ve) {
					let t = () => {
						e.subTree = br(e), ve(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = br(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && K(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					K(() => Ti(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Yn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && K(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Oe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => _n(u), Jr(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Mr(e, t.props, r, n), Wr(e, t.children, n), Ue(), bn(e), We();
	}, j = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				N(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				M(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && pe(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? N(l, d, n, r, i, a, o, s, c) : pe(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, M = (e, t, n, r, i, a, o, c, l) => {
		e ||= s, t ||= s;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? Si(t[p]) : xi(t[p]);
			v(e[p], r, n, null, i, a, o, c, l);
		}
		u > d ? pe(e, i, a, !0, !1, f) : D(t, n, r, i, a, o, c, l, f);
	}, N = (e, t, n, r, i, a, o, c, l) => {
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
		} else if (u > p) for (; u <= f;) P(e[u], i, a, !0), u++;
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
					P(r, i, a, !0);
					continue;
				}
				let s;
				if (r.key != null) s = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && pi(r, t[_])) {
					s = _;
					break;
				}
				s === void 0 ? P(r, i, a, !0) : (C[s - h] = u + 1, s >= S ? S = s : x = !0, v(r, t[s], n, null, i, a, o, c, l), y++);
			}
			let w = x ? Zr(C) : s;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, s = t[e], f = t[e + 1], p = e + 1 < d ? f.el || ei(f) : r;
				C[u] === 0 ? v(null, s, n, p, i, a, o, c, l) : x && (_ < 0 || u !== w[_] ? ce(s, n, p, 2) : _--);
			}
		}
	}, ce = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) ce(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, ge);
		else if (c === q) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) ce(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === ai) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[zn] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), K(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[zn];
					s._isLeaving && s[zn](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, P = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ue(), qn(s, null, n, e, !0), We()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Yn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ti(_, t, e), u & 6) fe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && An(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ge, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? pe(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && pe(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && K(() => {
			_ && Ti(_, t, e), h && An(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === q;
		if (o && !a) {
			de(n, r);
			return;
		}
		if (t === ai) {
			C(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Un(e) : e, c = () => {
			o ? m(n) && de(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, de = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), i(e), e = n;
		i(t);
	}, fe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		$r(c), $r(l), r && se(r), i.stop(), a ? (a.flags |= 8, P(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, P(o, e, t, n)), s && K(s, t), K(() => {
			e.isUnmounted = !0;
		}, t);
	}, pe = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) P(e[o], t, n, r, i);
	}, me = (e) => {
		if (e.shapeFlag & 6) return me(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Ln];
		return n ? h(n) : t;
	}, he = (e, t, n) => {
		Cn(() => {
			e == null ? t._vnode && P(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Oi());
	}, ge = {
		p: v,
		um: P,
		m: ce,
		r: ue,
		mt: k,
		mc: D,
		pc: j,
		pbc: te,
		n: me,
		o: e
	}, _e, ve;
	return t && ([_e, ve] = t(ge)), {
		render: he,
		hydrate: _e,
		createApp: mr(he, _e)
	};
}
function qr({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Jr({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Yr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Xr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (g(r) && g(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Si(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Xr(t, a)), a.type === ri && (a.patchFlag === -1 && (a = i[e] = Si(a)), a.el = t.el), a.type === ii && !a.el && (a.el = t.el);
	}
}
function Zr(e) {
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
function Qr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Qr(t);
}
function $r(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function ei(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? ei(t.subTree) : null;
}
var ti = (e) => e.__isSuspense;
function ni(e, t) {
	t && t.pendingBranch ? g(e) ? t.effects.push(...e) : t.effects.push(e) : yn(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), ri = /* @__PURE__ */ Symbol.for("v-txt"), ii = /* @__PURE__ */ Symbol.for("v-cmt"), ai = /* @__PURE__ */ Symbol.for("v-stc"), oi = [], J = null;
function Y(e = !1) {
	oi.push(J = e ? null : []);
}
function si() {
	oi.pop(), J = oi[oi.length - 1] || null;
}
var ci = 1;
function li(e, t = !1) {
	ci += e, e < 0 && J && t && (J.hasOnce = !0);
}
function ui(e) {
	return e.dynamicChildren = ci > 0 ? J || s : null, si(), ci > 0 && J && J.push(e), e;
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
var mi = ({ key: e }) => e ?? null, hi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : x(e) || /* @__PURE__ */ V(e) || b(e) ? {
	i: G,
	r: e,
	k: t,
	f: !!n
} : e);
function Z(e, t = null, n = null, r = 0, i = null, a = e === q ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && mi(t),
		ref: t && hi(t),
		scopeId: En,
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
		ctx: G
	};
	return s ? (Ci(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= x(n) ? 8 : 16), ci > 0 && !o && J && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && J.push(c), c;
}
var gi = _i;
function _i(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== rr || (e = ii), fi(e)) {
		let r = yi(e, t, !0);
		return n && Ci(r, n), ci > 0 && !a && J && (r.shapeFlag & 6 ? J[J.indexOf(e)] = r : J.push(r)), r.patchFlag = -2, r;
	}
	if (Gi(e) && (e = e.__vccOpts), t) {
		t = vi(t);
		let { class: e, style: n } = t;
		e && !x(e) && (t.class = me(e)), C(n) && (/* @__PURE__ */ Ht(n) && !g(n) && (n = f({}, n)), t.style = P(n));
	}
	let o = x(e) ? 1 : ti(e) ? 128 : Rn(e) ? 64 : C(e) ? 4 : b(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function vi(e) {
	return e ? /* @__PURE__ */ Ht(e) || Ar(e) ? f({}, e) : e : null;
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
		patchFlag: t && e.type !== q ? o === -1 ? 16 : o | 16 : o,
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
	return c && r && Hn(u, c.clone(u)), u;
}
function bi(e = " ", t = 0) {
	return gi(ri, null, e, t);
}
function Q(e = "", t = !1) {
	return t ? (Y(), di(ii, null, e)) : gi(ii, null, e);
}
function xi(e) {
	return e == null || typeof e == "boolean" ? gi(ii) : g(e) ? gi(q, null, e.slice()) : fi(e) ? Si(e) : gi(ri, null, String(e));
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
			!r && !Ar(t) ? t._ctx = G : r === 3 && G && (G.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (b(t)) {
		if (r & 65) {
			Ci(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: G
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [bi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function wi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = me([t.class, r.class]));
		else if (e === "style") t.style = P([t.style, r.style]);
		else if (u(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(g(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !d(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ti(e, t, n, r = null) {
	on(e, t, 7, [n, r]);
}
var Ei = fr(), Di = 0;
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
		scope: new Te(!0),
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
		propsOptions: Fr(r, i),
		emitsOptions: vr(r, i),
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = _r.bind(null, a), e.ce && e.ce(a), a;
}
var $ = null, Ai = () => $ || G, ji, Mi;
{
	let e = le(), t = (t, n) => {
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
	jr(e, r, a, t), Ur(e, i, n || t);
	let o = a ? Ri(e, t) : void 0;
	return t && Mi(!1), o;
}
function Ri(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, dr);
	let { setup: r } = n;
	if (r) {
		Ue();
		let n = e.setupContext = r.length > 1 ? Hi(e) : null, i = Ni(e), a = an(r, e, 0, [e.props, n]), o = w(a);
		if (We(), i(), (o || e.sp) && !Yn(e) && Wn(e), o) {
			if (a.then(Pi, Pi), t) return a.then((n) => {
				Mi(!0);
				try {
					zi(e, n, t);
				} finally {
					Mi(!1);
				}
			}).catch((t) => {
				sn(t, e, 0);
			});
			e.asyncDep = a;
		} else zi(e, a, t);
	} else Bi(e, t);
}
function zi(e, t, n) {
	b(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : C(t) && (e.setupState = Yt(t)), Bi(e, n);
}
function Bi(e, t, n) {
	let r = e.type;
	e.render ||= r.render || c;
}
var Vi = { get(e, t) {
	return z(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Yt(Ut(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in lr) return lr[n](e);
		},
		has(e, t) {
			return t in e || t in lr;
		}
	}) : e.proxy;
}
function Wi(e, t = !0) {
	return b(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Gi(e) {
	return b(e) && "__vccOpts" in e;
}
var Ki = (e, t) => /* @__PURE__ */ Zt(e, t, Ii), qi = "3.5.44", Ji = void 0, Yi = typeof window < "u" && window.trustedTypes;
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
		la.test(n) ? e.setProperty(A(r), n.replace(la, ""), "important") : e[r] = n;
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
	let r = O(t);
	if (r !== "filter" && r in e) return fa[t] = r;
	r = ae(r);
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
function ga(e, t, n, r, i, a = he(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ha, t.slice(6, t.length)) : e.setAttributeNS(ha, t, n) : n == null || a && !ge(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : S(n) ? String(n) : n);
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
		r === "boolean" ? n = ge(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : A(e.slice(2)), t];
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
				e && on(e, t, 5, a);
			}
		} else on(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Da(), n;
}
var ka = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Aa = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? ra(e, r, o) : t === "style" ? ca(e, n, r) : u(t) ? d(t) || xa(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ja(e, t, r, o)) ? (_a(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || ga(e, t, r, o, a, t !== "value")) : e._isVueCE && (Ma(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !x(r))) ? _a(e, O(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ga(e, t, r, o));
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
	let r = O(t);
	return Array.isArray(n) ? n.some((e) => O(e) === r) : Object.keys(n).some((e) => O(e) === r);
}
var Na = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return g(t) ? (e) => se(t, e) : t;
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
	return t && (e = e.trim()), n && (e = N(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? N(e.value) : e.value, c = t ?? "";
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
				let e = xe(t, n), a = e !== -1;
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
	if (g(t)) i = xe(t, r.props.value) > -1;
	else if (v(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = F(t, Ka(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Ha = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, va(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? N(Ga(e)) : Ga(e)), r = e.multiple, i = r ? v(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? g(i) ? t.slice() : t : i];
			try {
				e[Ia](i);
			} finally {
				hn(() => {
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
	if (!n || g(e)) return F(e, t);
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
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : xe(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (F(Ga(a), t)) {
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
		let r = A(n.key);
		if (t.some((e) => e === r || Xa[e] === r)) return e(n);
	}));
}, Qa = /* @__PURE__ */ f({ patchProp: Aa }, ta), $a;
function eo() {
	return $a ||= Gr(Qa);
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
		let t = e, { api: n, t: r, locale: i, authenticated: a, picking: o, familySelection: s, types: c, run: l, refresh: u, chooseCollection: d, preview: f, select: p, download: m, report: h } = Mn("rebost"), g = /* @__PURE__ */ H(""), _ = /* @__PURE__ */ H(""), v = /* @__PURE__ */ H(""), y = /* @__PURE__ */ H(!1), b = /* @__PURE__ */ H(null), x = !0, S = 0, C = Ki(() => {
			if (!["catalog", "scratch"].includes(t.item.collection)) return t.item.name;
			let e = t.item.names || {};
			return e[i.value] || i.value === "va" && e.ca || e.es || e.ca || e.en || t.item.name || t.item.id;
		}), w = Ki(() => !t.nested && t.item.collection === "scratch" && t.item.family?.count > 1), T = Ki(() => ["catalog", "scratch"].includes(t.item.collection) ? t.item : t.item.provenance);
		Fn(() => t.item, async (e) => {
			g.value = e.name, _.value = e.type, y.value = !1, b.value = null;
			let t = ++S;
			URL.revokeObjectURL(v.value), v.value = "";
			try {
				let r = await n.thumbnail(e.id);
				x && t === S && (v.value = URL.createObjectURL(r));
			} catch (e) {
				x && t === S && h(e);
			}
		}, { immediate: !0 }), er(() => {
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
		function ee() {
			confirm(r("rebost.confirm")) && l(async () => {
				await n.remove(t.item), await u();
			});
		}
		return (t, i) => {
			let d = nr("AssetCard", !0);
			return Y(), di(ir(e.nested ? "section" : "article"), {
				"data-id": e.item.id,
				class: me({
					"family-costume": e.nested,
					"expanded-family": y.value
				})
			}, {
				default: On(() => [
					Z("button", {
						type: "button",
						class: "image secondary",
						"aria-label": U(r)("rebost.view") + ": " + C.value,
						onClick: i[0] ||= (t) => U(l)(() => U(f)(e.item, C.value))
					}, [Z("img", {
						src: v.value || void 0,
						alt: C.value
					}, null, 8, ao)], 8, io),
					U(o) || e.item.readonly ? (Y(), X(q, { key: 0 }, [(Y(), di(ir(e.nested ? "h3" : "h2"), null, {
						default: On(() => [bi(I(C.value), 1)]),
						_: 1
					})), Z("span", null, I(U(r)("rebost." + e.item.type)), 1)], 64)) : (Y(), X(q, { key: 1 }, [Z("label", null, [bi(I(U(r)("rebost.name")), 1), kn(Z("input", {
						"onUpdate:modelValue": i[1] ||= (e) => g.value = e,
						maxlength: "200",
						required: ""
					}, null, 512), [[za, g.value]])]), Z("label", null, [bi(I(U(r)("rebost.filter")), 1), kn(Z("select", { "onUpdate:modelValue": i[2] ||= (e) => _.value = e }, [(Y(!0), X(q, null, sr(U(c), (e) => (Y(), X("option", {
						key: e,
						value: e
					}, I(U(r)("rebost." + e)), 9, oo))), 128))], 512), [[Ha, _.value]])])], 64)),
					T.value && !e.nested ? (Y(), X("p", so, I(T.value.attribution) + " · " + I(T.value.license), 1)) : Q("", !0),
					w.value ? (Y(), X("span", co, I(e.item.family.count) + " " + I(U(r)("rebost.costumeCount")), 1)) : Q("", !0),
					Z("small", null, I(e.item.width) + " × " + I(e.item.height) + " px", 1),
					Z("div", lo, [
						U(o) ? (Y(), X("button", {
							key: 0,
							type: "button",
							onClick: i[3] ||= (t) => U(p)(e.item, C.value, w.value && U(s))
						}, I(w.value && U(s) ? U(r)("rebost.addFamily") : U(r)("rebost.choose")), 1)) : e.item.readonly ? (Y(), X("button", {
							key: 1,
							type: "button",
							onClick: D
						}, I(U(a) ? w.value ? U(r)("rebost.saveImage") : U(r)("rebost.saveCopy") : U(r)("rebost.loginToSave")), 1)) : (Y(), X(q, { key: 2 }, [
							Z("button", {
								type: "button",
								onClick: i[4] ||= (t) => {
									U(l)(async () => {
										await U(n).update(e.item, {
											name: g.value,
											type: _.value
										});
										try {
											await U(u)();
										} catch (e) {
											return U(h)(e), "saved_refresh_failed";
										}
										return "success";
									});
								}
							}, I(U(r)("rebost.save")), 1),
							Z("button", {
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
							}, I(U(r)("rebost.duplicate")), 1),
							Z("button", {
								type: "button",
								class: "danger",
								onClick: ee
							}, I(U(r)("rebost.remove")), 1)
						], 64)),
						T.value && !U(o) ? (Y(), X(q, { key: 3 }, [Z("button", {
							type: "button",
							class: "secondary",
							onClick: i[6] ||= (t) => U(l)(() => U(m)(e.item))
						}, I(U(r)("rebost.source")), 1), Z("button", {
							type: "button",
							class: "secondary",
							onClick: i[7] ||= (t) => U(l)(() => U(m)(e.item, !0))
						}, I(U(r)("rebost.license")), 1)], 64)) : Q("", !0),
						w.value ? (Y(), X("button", {
							key: 4,
							class: "secondary",
							type: "button",
							"aria-expanded": y.value,
							onClick: E
						}, I(y.value ? U(r)("rebost.hideCostumes") : U(r)("rebost.costumes")), 9, uo)) : Q("", !0)
					]),
					b.value ? (Y(), X("div", {
						key: 4,
						class: "family-variants",
						hidden: !y.value
					}, [(Y(!0), X(q, null, sr(b.value, (e) => (Y(), di(d, {
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
	props: { base: {
		type: String,
		required: !0
	} },
	setup(e) {
		let { api: t, t: n, locale: r, authenticated: i, picking: a, pickType: o, select: s, run: c, report: l } = Mn("rebost"), u = e.base.replace(/\/$/, ""), d = [
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
		], f = /* @__PURE__ */ H(""), p = /* @__PURE__ */ H(!0), m = /* @__PURE__ */ H(!1), h = /* @__PURE__ */ H(!1), g = /* @__PURE__ */ H(""), _ = /* @__PURE__ */ H([]), v = /* @__PURE__ */ H(/* @__PURE__ */ new Set()), y = /* @__PURE__ */ Ft({}), b = /* @__PURE__ */ H(/* @__PURE__ */ new Set()), x = /* @__PURE__ */ H(""), S = null, C = 0, w = () => ({
			ca: "va",
			va: "va",
			es: "es",
			en: "en"
		})[r.value] || "es", T = (e) => !/(^|[^A-Za-z])NC([^A-Za-z]|$)|non[- ]?commercial/i.test(e || ""), E = (e) => e.provider + ":" + e.id, D = (e) => v.value.has(e.id) ? e.items : e.items.slice(0, Fo);
		async function ee(e, t) {
			let n = await fetch(u + e, {
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
			for (let e of Object.keys(y)) URL.revokeObjectURL(y[e]), delete y[e];
		}
		async function ne(e, t) {
			await Promise.all(e.map(async (e) => {
				if (!y[E(e)]) try {
					let n = await (await ee(`/api/image-banks/${e.provider}/${encodeURIComponent(e.id)}/thumbnail`, S?.signal)).blob();
					t === C && (y[E(e)] = URL.createObjectURL(n));
				} catch {}
			}));
		}
		async function re() {
			let e = f.value.trim();
			if (!e || !u) return;
			S?.abort(), S = new AbortController();
			let t = ++C;
			te(), v.value = /* @__PURE__ */ new Set(), b.value = /* @__PURE__ */ new Set(), g.value = "", h.value = !1, m.value = !0, _.value = d.map((e) => ({
				...e,
				status: "pending",
				items: []
			})), await Promise.all(_.value.map(async (n, r) => {
				try {
					let i = new URLSearchParams({
						q: e,
						language: w()
					}), a = await (await ee(`/api/image-banks/${n.id}/search?${i}`, S.signal)).json();
					if (t !== C) return;
					let o = p.value && !n.nc ? a.items.filter((e) => T(e.license)) : a.items;
					_.value[r] = {
						...n,
						status: "done",
						items: o
					}, ne(o.slice(0, Fo), t);
				} catch (e) {
					if (t !== C || e.name === "AbortError") return;
					e.login && (h.value = !0), _.value[r] = {
						...n,
						status: e.login ? "login" : "error",
						items: []
					};
				}
			})), t === C && (m.value = !1);
		}
		function ie(e) {
			v.value = new Set(v.value).add(e.id), ne(e.items, C);
		}
		async function O(e) {
			i.value ? (x.value = E(e), g.value = "", await c(async () => {
				try {
					let r = await (await ee(`/api/image-banks/${e.provider}/${encodeURIComponent(e.id)}/content`)).blob(), i = r.type.split(";")[0];
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
					return b.value = new Set(b.value).add(E(e)), a ? (s(l, c, !1), "") : n("rebost.banksSaved");
				} catch (e) {
					if (e.status === 401) return l(e);
					throw e.status ? e : Object.assign(/* @__PURE__ */ Error("operation_failed"), { status: 0 });
				}
			}), x.value = "") : g.value = n("rebost.banksSaveLogin");
		}
		return er(() => {
			S?.abort(), C++, te();
		}), (e, t) => (Y(), X("section", mo, [
			Z("form", {
				class: "banks-search",
				onSubmit: Ya(re, ["prevent"])
			}, [
				Z("label", null, [Z("span", null, I(U(n)("rebost.banksSearchLabel")), 1), kn(Z("input", {
					"onUpdate:modelValue": t[0] ||= (e) => f.value = e,
					type: "search",
					maxlength: "80",
					placeholder: U(n)("rebost.banksPlaceholder")
				}, null, 8, ho), [[za, f.value]])]),
				Z("label", go, [kn(Z("input", {
					"onUpdate:modelValue": t[1] ||= (e) => p.value = e,
					type: "checkbox"
				}, null, 512), [[Ba, p.value]]), bi(" " + I(U(n)("rebost.banksFreeOnly")), 1)]),
				Z("button", {
					type: "submit",
					disabled: m.value || !f.value.trim()
				}, I(m.value ? U(n)("rebost.banksSearching") : U(n)("rebost.banksSearchButton")), 9, _o)
			], 32),
			m.value ? (Y(), X("p", vo, I(U(n)("rebost.banksSlow")), 1)) : Q("", !0),
			h.value ? (Y(), X("p", yo, [bi(I(U(n)("rebost.banksLogin")) + " ", 1), Z("a", {
				class: "button-link secondary",
				href: U(u),
				target: "_blank",
				rel: "noopener noreferrer"
			}, I(U(n)("rebost.banksOpenEducrea")), 9, bo)])) : Q("", !0),
			g.value ? (Y(), X("p", xo, I(g.value), 1)) : Q("", !0),
			(Y(!0), X(q, null, sr(_.value, (e) => (Y(), X(q, { key: e.id }, [
				Z("h3", So, [bi(I(e.name), 1), e.status === "pending" ? (Y(), X("span", Co, " · " + I(U(n)("rebost.banksSearching")), 1)) : e.status === "error" ? (Y(), X("span", wo, " · " + I(U(n)("rebost.banksFailed")), 1)) : e.status === "done" && !e.items.length ? (Y(), X("span", To, " · " + I(U(n)("rebost.banksEmpty")), 1)) : Q("", !0)]),
				e.items.length ? (Y(), X("div", Eo, [(Y(!0), X(q, null, sr(D(e), (r) => (Y(), X("article", {
					key: E(r),
					class: "bank-card"
				}, [
					Z("div", Do, [Z("img", {
						src: y[E(r)] || void 0,
						alt: r.title
					}, null, 8, Oo)]),
					Z("h4", null, I(r.title), 1),
					Z("p", ko, [
						T(r.license) ? Q("", !0) : (Y(), X("span", {
							key: 0,
							class: "nc-badge",
							title: U(n)("rebost.banksNcTitle")
						}, "NC", 8, Ao)),
						bi(" " + I(r.license) + " ", 1),
						r.source_url ? (Y(), X(q, { key: 1 }, [t[2] ||= bi(" · ", -1), Z("a", {
							href: r.source_url,
							target: "_blank",
							rel: "noopener noreferrer"
						}, I(e.name), 9, jo)], 64)) : Q("", !0)
					]),
					Z("div", Mo, [Z("button", {
						type: "button",
						disabled: x.value === E(r) || b.value.has(E(r)),
						onClick: (e) => O(r)
					}, I(b.value.has(E(r)) ? U(n)("rebost.banksSaved") : U(a) ? U(n)("rebost.banksSaveChoose") : U(n)("rebost.banksSave")), 9, No)])
				]))), 128))])) : Q("", !0),
				e.items.length > Fo && !v.value.has(e.id) ? (Y(), X("button", {
					key: 1,
					type: "button",
					class: "secondary",
					onClick: (t) => ie(e)
				}, I(U(n)("rebost.banksMore")) + " · " + I(e.name) + " (" + I(e.items.length - Fo) + ")", 9, Po)) : Q("", !0)
			], 64))), 128))
		]));
	}
};
// services/portal/src/shared/usePortalTranslations.js
function Lo() {
	let e = /* @__PURE__ */ H(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), er(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
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
		let p = /* @__PURE__ */ H(window.i18nPortal.getLang()), m = Lo(), h = /* @__PURE__ */ H(!1), g = /* @__PURE__ */ H(!1), _ = /* @__PURE__ */ H(!1), v = /* @__PURE__ */ H([]), y = /* @__PURE__ */ H(String(window.commonsDeployment?.bankSearchUrl || "")), b = /* @__PURE__ */ H([
			"mine",
			"catalog",
			"scratch",
			"banks"
		].includes(s.get("collection")) ? s.get("collection") : ""), x = /* @__PURE__ */ H(""), S = /* @__PURE__ */ H(c ? l : ""), C = /* @__PURE__ */ H("sprite"), w = /* @__PURE__ */ H([]), T = /* @__PURE__ */ H(""), E = /* @__PURE__ */ H(""), D = /* @__PURE__ */ H(!1), ee = /* @__PURE__ */ H(null), te = /* @__PURE__ */ H(null), ne = /* @__PURE__ */ H(""), re = /* @__PURE__ */ H(""), ie = Ki(() => b.value === "mine" && !g.value), O = Ki(() => m("rebost." + (b.value || "mine"))), k = !0, A = 0, ae, oe = "";
		function j() {
			p.value = window.i18nPortal.getLang();
		}
		function se(e) {
			E.value = m("rebost." + e.message) === "rebost." + e.message ? "error" : e.message, e.status === 401 && (g.value = !1, b.value === "mine" && (A++, w.value = [], T.value = "", he()));
		}
		async function M(e) {
			if (!_.value && k) {
				_.value = !0, E.value = "working";
				try {
					let t = await e();
					k && (E.value = typeof t == "string" ? t : "", E.value && document.getElementById("status")?.scrollIntoView({ block: "nearest" }));
				} catch (e) {
					[404, 412].includes(e.status) && await N().catch(() => {}), k && se(e);
				} finally {
					_.value = !1;
				}
			}
		}
		async function N(e = !1) {
			let t = ++A;
			if (b.value === "banks") {
				w.value = [], T.value = "";
				return;
			}
			if (ie.value) {
				w.value = [], T.value = "", he();
				return;
			}
			let n = JSON.stringify([
				b.value,
				x.value,
				S.value
			]);
			e &&= n === oe;
			let r = await o.list({
				collection: b.value,
				q: x.value,
				type: S.value,
				cursor: e ? T.value : "",
				grouped: b.value === "scratch"
			});
			k && t === A && (b.value !== "mine" || g.value) && (w.value = e ? [...w.value, ...r.items] : r.items, T.value = r.next_cursor, oe = n);
		}
		async function ce(e) {
			b.value = e, x.value = "", S.value = c ? l : "", clearTimeout(ae);
			let t = new URL(location.href);
			t.searchParams.set("collection", e), history.replaceState(null, "", t), w.value = [], T.value = "", await N();
		}
		function le() {
			clearTimeout(ae), ae = setTimeout(async () => {
				k && (_.value ? le() : await M(() => N()));
			}, 250);
		}
		async function P(e) {
			c || ie.value || b.value !== "mine" || !h.value || await M(async () => {
				try {
					for (let t of e) await o.add(t, {
						name: t.name.replace(/\.[^.]+$/, "").slice(0, 200) || "Imatge",
						type: C.value
					});
				} catch (e) {
					throw await N().catch(() => {}), e;
				}
				try {
					await N();
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
			e.target.value = "", P(t);
		}
		function fe(e) {
			D.value = !1, P([...e.dataTransfer.files]);
		}
		function pe() {
			URL.revokeObjectURL(ne.value), ne.value = "", re.value = "";
		}
		function he() {
			te.value?.close(), pe();
		}
		async function ge(e, t) {
			let n = await o.content(e.id);
			k && (e.collection !== "mine" || g.value) && (pe(), ne.value = URL.createObjectURL(n), re.value = t, te.value.showModal());
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
			c && e.key === "Escape" && !te.value?.open && r(n(s.get("request")));
		}
		async function ye(n, r = !1) {
			let i = await o.blob(t.itemPath(n.id) + (r ? "/license" : "/source"), r ? e.license : e.source), a = URL.createObjectURL(i), s = document.createElement("a");
			s.href = a, s.download = n.id + (r ? ".license.txt" : ".source.svg"), document.body.append(s), s.click(), s.remove(), setTimeout(() => URL.revokeObjectURL(a), 1e3);
		}
		let be = !1;
		async function F() {
			if (h.value && !_.value && !be && k) {
				be = !0;
				try {
					let e;
					try {
						await o.me(), e = !0;
					} catch (t) {
						if (t.status !== 401) throw t;
						e = !1;
					}
					if (!k || e === g.value) return;
					g.value = e, e || (A++, w.value = [], T.value = "", he()), await M(() => N());
				} catch (e) {
					k && se(e);
				} finally {
					be = !1;
				}
			}
		}
		function xe(e) {
			e.persisted || (A++, w.value = [], pe());
		}
		return jn("rebost", {
			api: o,
			t: m,
			locale: p,
			authenticated: g,
			picking: c,
			pickType: l,
			familySelection: u,
			types: d,
			run: M,
			refresh: N,
			chooseCollection: ce,
			preview: ge,
			select: _e,
			download: ye,
			report: se
		}), $n(async () => {
			document.body.classList.toggle("picking", c), window.addEventListener("edutictac:langchange", j), window.addEventListener("focus", F), window.addEventListener("edutictac:sessionchange", F), window.addEventListener("pagehide", xe), document.addEventListener("keydown", ve), await M(async () => {
				let e;
				try {
					e = await o.me(), g.value = !0;
				} catch (t) {
					if (t.status !== 401) throw t;
					e = await o.catalogs();
				}
				v.value = e.capabilities, typeof e.bank_search_url == "string" && e.bank_search_url && (y.value = e.bank_search_url), b.value === "banks" && !y.value && (b.value = ""), b.value ||= g.value ? "mine" : "catalog", (b.value === "catalog" && !v.value.includes("catalog") || b.value === "scratch" && !v.value.includes("scratch_catalog")) && (b.value = "mine"), h.value = !0, await N();
			});
		}), er(() => {
			k = !1, A++, clearTimeout(ae), pe(), window.removeEventListener("edutictac:langchange", j), window.removeEventListener("focus", F), window.removeEventListener("edutictac:sessionchange", F), window.removeEventListener("pagehide", xe), document.removeEventListener("keydown", ve), document.body.classList.remove("picking");
		}), (e, t) => (Y(), X(q, null, [Z("header", Ro, [U(c) ? Q("", !0) : (Y(), X("div", zo, [...t[13] ||= [Z("img", {
			src: "/assets/commons-mark.svg",
			alt: "",
			width: "46",
			height: "46"
		}, null, -1), Z("div", null, [Z("p", { class: "eyebrow" }, "EduTicTac Commons"), Z("h1", null, "EduTicTac Rebost")], -1)]])), Z("div", Bo, [U(c) ? (Y(), X("p", {
			key: 1,
			id: "sessionStatus",
			class: me(["status session-status", { signed: g.value }]),
			role: "status"
		}, I(h.value ? g.value ? U(m)("rebost.signedIn") : U(m)("rebost.signedOut") : U(m)("rebost.checkingSession")), 3)) : (Y(), X("edutictac-account", Vo))])]), Z("main", Ho, [
			Z("div", Uo, [
				t[14] ||= Z("p", { class: "eyebrow" }, "EduTicTac Rebost", -1),
				Z("h2", null, I(U(m)("rebost.heading")), 1),
				Z("p", Wo, I(U(m)("rebost.intro")), 1)
			]),
			Z("p", {
				id: "status",
				class: me({
					success: ["success", "image_saved"].includes(E.value),
					error: E.value && ![
						"success",
						"image_saved",
						"working"
					].includes(E.value)
				}),
				role: "status",
				"aria-live": "polite"
			}, I(E.value ? U(m)("rebost." + E.value) : ""), 3),
			Z("section", {
				id: "access",
				class: "panel",
				hidden: !h.value || g.value || U(c) && !["mine", "banks"].includes(b.value)
			}, [Z("p", Ko, I(U(m)("rebost.access")), 1), Z("div", qo, [Z("a", {
				class: "button-link secondary",
				id: "studentLogin",
				href: "/student.html?next=%2Fassets%2F",
				target: U(c) ? "_blank" : void 0,
				rel: "noopener noreferrer"
			}, I(U(m)("rebost.student")), 9, Jo), Z("a", {
				class: "button-link",
				id: "oidcLogin",
				href: "/api/auth/oidc/login?next=%2Fassets%2F",
				target: U(c) ? "_blank" : void 0,
				rel: "noopener noreferrer"
			}, I(U(m)("rebost.oidc")), 9, Yo)])], 8, Go),
			Z("fieldset", {
				id: "controls",
				disabled: _.value || !h.value,
				hidden: !h.value
			}, [
				Z("legend", Zo, I(O.value), 1),
				Z("div", Qo, [
					Z("div", {
						id: "collections",
						class: "collections",
						role: "group",
						"aria-label": U(m)("rebost.collection")
					}, [
						Z("button", {
							id: "mineTab",
							class: "secondary",
							type: "button",
							"aria-pressed": b.value === "mine",
							onClick: t[0] ||= (e) => M(() => ce("mine"))
						}, I(U(m)("rebost.mine")) + I(g.value ? "" : " · " + U(m)("common.login")), 9, es),
						Z("button", {
							id: "catalogTab",
							class: "secondary",
							type: "button",
							hidden: !v.value.includes("catalog"),
							"aria-pressed": b.value === "catalog",
							onClick: t[1] ||= (e) => M(() => ce("catalog"))
						}, I(U(m)("rebost.catalog")), 9, ts),
						Z("button", {
							id: "banksTab",
							class: "secondary",
							type: "button",
							hidden: !y.value,
							"aria-pressed": b.value === "banks",
							onClick: t[2] ||= (e) => M(() => ce("banks"))
						}, I(U(m)("rebost.banks")), 9, ns),
						Z("button", {
							id: "scratchTab",
							class: "secondary",
							type: "button",
							hidden: !v.value.includes("scratch_catalog"),
							"aria-pressed": b.value === "scratch",
							onClick: t[3] ||= (e) => M(() => ce("scratch"))
						}, I(U(m)("rebost.scratch")), 9, rs)
					], 8, $o),
					Z("p", is, I(b.value === "banks" ? U(m)("rebost.banksHint") : U(c) ? U(m)("rebost.pickHint") : b.value === "mine" ? U(m)("rebost.privateHint") : b.value === "scratch" ? U(m)("rebost.scratchHint") : U(m)("rebost.catalogHint")), 1),
					Z("div", {
						id: "uploadArea",
						hidden: U(c) || b.value !== "mine" || !g.value
					}, [Z("section", {
						id: "drop",
						tabindex: "0",
						role: "button",
						"aria-label": U(m)("rebost.upload"),
						class: me({ drag: D.value }),
						onClick: ue,
						onKeydown: [Za(Ya(ue, ["self", "prevent"]), ["enter"]), Za(Ya(ue, ["self", "prevent"]), ["space"])],
						onDragenter: t[5] ||= Ya((e) => D.value = !0, ["prevent"]),
						onDragover: t[6] ||= Ya((e) => D.value = !0, ["prevent"]),
						onDragleave: t[7] ||= (e) => D.value = !1,
						onDrop: Ya(fe, ["prevent"])
					}, [
						Z("strong", ss, I(U(m)("rebost.upload")), 1),
						Z("p", cs, I(U(m)("rebost.formats")), 1),
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
					], 42, os), Z("label", null, [Z("span", ls, I(U(m)("rebost.uploadType")), 1), kn(Z("select", {
						id: "uploadType",
						"onUpdate:modelValue": t[8] ||= (e) => C.value = e
					}, [(Y(), X(q, null, sr(d, (e) => Z("option", {
						key: e,
						value: e
					}, I(U(m)("rebost." + e)), 9, us)), 64))], 512), [[Ha, C.value]])])], 8, as),
					Z("div", {
						class: "filters",
						hidden: ie.value || b.value === "banks"
					}, [Z("label", null, [Z("span", fs, I(U(m)("rebost.search")), 1), kn(Z("input", {
						id: "search",
						"onUpdate:modelValue": t[9] ||= (e) => x.value = e,
						type: "search",
						placeholder: U(m)("rebost.searchPlaceholder"),
						maxlength: "200",
						onInput: le
					}, null, 40, ps), [[za, x.value]])]), Z("label", null, [Z("span", ms, I(U(m)("rebost.filter")), 1), kn(Z("select", {
						id: "filter",
						"onUpdate:modelValue": t[10] ||= (e) => S.value = e,
						onChange: t[11] ||= (e) => M(() => N())
					}, [(Y(!0), X(q, null, sr(U(f), (e) => (Y(), X("option", {
						key: e,
						value: e
					}, I(e ? U(m)("rebost." + e) : U(m)("rebost.all")), 9, hs))), 128))], 544), [[Ha, S.value]])])], 8, ds)
				]),
				b.value === "banks" && y.value ? (Y(), di(Io, {
					key: 0,
					base: y.value
				}, null, 8, ["base"])) : Q("", !0),
				Z("p", {
					id: "empty",
					hidden: ie.value || b.value === "banks" || w.value.length > 0 || _.value
				}, I(U(m)("rebost.empty")), 9, gs),
				Z("section", {
					id: "grid",
					"aria-label": O.value,
					hidden: ie.value || b.value === "banks"
				}, [(Y(!0), X(q, null, sr(w.value, (e) => (Y(), di(po, {
					key: e.id,
					item: e
				}, null, 8, ["item"]))), 128))], 8, _s),
				Z("button", {
					id: "more",
					type: "button",
					hidden: ie.value || b.value === "banks" || !T.value,
					onClick: t[12] ||= (e) => M(() => N(!0))
				}, I(U(m)("rebost.more")), 9, vs)
			], 8, Xo),
			Z("dialog", {
				id: "preview",
				ref_key: "dialog",
				ref: te,
				"aria-label": U(m)("rebost.view"),
				onClose: pe
			}, [Z("button", {
				id: "closePreview",
				type: "button",
				onClick: he
			}, I(U(m)("rebost.close")), 1), Z("img", {
				id: "previewImage",
				src: ne.value || void 0,
				alt: re.value
			}, null, 8, bs)], 40, ys)
		])], 64));
	}
}).mount("#rebost");
