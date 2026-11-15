import { RebostClient as e } from "/assets/client.js";
// ../../../github/Edutictac/edutictac-commons-release-beta6.1/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function t(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var n = {}, r = [], i = () => {}, a = () => !1, o = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), s = (e) => e.startsWith("onUpdate:"), c = Object.assign, l = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, u = Object.prototype.hasOwnProperty, d = (e, t) => u.call(e, t), f = Array.isArray, p = (e) => S(e) === "[object Map]", m = (e) => S(e) === "[object Set]", h = (e) => S(e) === "[object Date]", g = (e) => typeof e == "function", _ = (e) => typeof e == "string", v = (e) => typeof e == "symbol", y = (e) => typeof e == "object" && !!e, b = (e) => (y(e) || g(e)) && g(e.then) && g(e.catch), x = Object.prototype.toString, S = (e) => x.call(e), C = (e) => S(e).slice(8, -1), w = (e) => S(e) === "[object Object]", T = (e) => _(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ t(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), te = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, E = /-\w/g, D = te((e) => e.replace(E, (e) => e.slice(1).toUpperCase())), O = /\B([A-Z])/g, k = te((e) => e.replace(O, "-$1").toLowerCase()), ne = te((e) => e.charAt(0).toUpperCase() + e.slice(1)), re = te((e) => e ? `on${ne(e)}` : ""), A = (e, t) => !Object.is(e, t), ie = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, j = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, M = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ae, oe = () => ae ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function se(e) {
	if (f(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = _(r) ? N(r) : se(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (_(e) || y(e)) return e;
}
var ce = /;(?![^(]*\))/g, le = /:([^]+)/, ue = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function N(e) {
	let t = {};
	return e.replace(ue, (e) => e.startsWith("/*") ? "" : e).split(ce).forEach((e) => {
		if (e) {
			let n = e.split(le);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function de(e) {
	let t = "";
	if (_(e)) t = e;
	else if (f(e)) for (let n = 0; n < e.length; n++) {
		let r = de(e[n]);
		r && (t += r + " ");
	}
	else if (y(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var fe = /* @__PURE__ */ t("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function pe(e) {
	return !!e || e === "";
}
function me(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = P(e[i], t[i], n);
	return r;
}
function he(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && P(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function ge(e, t, n) {
	let r = p(e), i = p(t);
	if (r || i || (r = m(e), i = m(t), r || i)) return r && i ? he(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !P(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function _e(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function P(e, t, n) {
	if (e === t) return !0;
	let r = h(e), i = h(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = v(e), i = v(t), r || i ? e === t : (r = f(e), i = f(t), r || i ? r && i ? _e(e, t, n, me) : !1 : (r = y(e), i = y(t), r || i ? !r || !i ? !1 : _e(e, t, n, ge) : String(e) === String(t))));
}
function ve(e, t) {
	return e.findIndex((e) => P(e, t));
}
var ye = (e) => !!(e && e.__v_isRef === !0), F = (e) => _(e) ? e : e == null ? "" : f(e) || y(e) && (e.toString === x || !g(e.toString)) ? ye(e) ? F(e.value) : JSON.stringify(e, be, 2) : String(e), be = (e, t) => ye(t) ? be(e, t.value) : p(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[xe(t, r) + " =>"] = n, e), {}) } : m(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => xe(e)) } : v(t) ? xe(t) : y(t) && !f(t) && !w(t) ? String(t) : t, xe = (e, t = "") => v(e) ? `Symbol(${e.description ?? t})` : e, I, Se = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && I && (I.active ? (this.parent = I, this.index = (I.scopes || (I.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = I;
			try {
				return I = this, e();
			} finally {
				I = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = I, I = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (I === this) I = this.prevScope;
			else {
				let e = I;
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
function Ce() {
	return I;
}
var L, we = /* @__PURE__ */ new WeakSet(), Te = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, I && (I.active ? I.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, we.has(this) && (we.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ke(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, He(this), Me(this);
		let e = L, t = Re;
		L = this, Re = !0;
		try {
			return this.fn();
		} finally {
			Ne(this), L = e, Re = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ie(e);
			this.deps = this.depsTail = void 0, He(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? we.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Pe(this) && this.run();
	}
	get dirty() {
		return Pe(this);
	}
}, Ee = 0, De, Oe;
function ke(e, t = !1) {
	e.flags |= 8, t ? (e.next = Oe, Oe = e) : (e.next = De, De = e);
}
function Ae() {
	Ee++;
}
function je() {
	if (--Ee > 0) return;
	if (Oe) {
		let e = Oe;
		for (Oe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; De;) {
		let t = De;
		for (De = void 0; t;) {
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
function Me(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ne(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ie(r), Le(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Pe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Fe(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Fe(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ue) || (e.globalVersion = Ue, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Pe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = L, r = Re;
	L = e, Re = !0;
	try {
		Me(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		L = n, Re = r, Ne(e), e.flags &= -3;
	}
}
function Ie(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ie(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Le(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Re = !0, ze = [];
function Be() {
	ze.push(Re), Re = !1;
}
function Ve() {
	let e = ze.pop();
	Re = e === void 0 || e;
}
function He(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = L;
		L = void 0;
		try {
			t();
		} finally {
			L = e;
		}
	}
}
var Ue = 0, We = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ge = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!L || !Re || L === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== L) t = this.activeLink = new We(L, this), L.deps ? (t.prevDep = L.depsTail, L.depsTail.nextDep = t, L.depsTail = t) : L.deps = L.depsTail = t, Ke(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = L.depsTail, t.nextDep = void 0, L.depsTail.nextDep = t, L.depsTail = t, L.deps === t && (L.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ue++, this.notify(e);
	}
	notify(e) {
		Ae();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			je();
		}
	}
};
function Ke(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ke(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var qe = /* @__PURE__ */ new WeakMap(), Je = /* @__PURE__ */ Symbol(""), Ye = /* @__PURE__ */ Symbol(""), Xe = /* @__PURE__ */ Symbol("");
function R(e, t, n) {
	if (Re && L) {
		let t = qe.get(e);
		t || qe.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ge()), r.map = t, r.key = n), r.track();
	}
}
function Ze(e, t, n, r, i, a) {
	let o = qe.get(e);
	if (!o) {
		Ue++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ae(), t === "clear") o.forEach(s);
	else {
		let i = f(e), a = i && T(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Xe || !v(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Xe)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Je)), p(e) && s(o.get(Ye)));
				break;
			case "delete":
				i || (s(o.get(Je)), p(e) && s(o.get(Ye)));
				break;
			case "set": p(e) && s(o.get(Je));
		}
	}
	je();
}
function Qe(e) {
	let t = /* @__PURE__ */ B(e);
	return t === e || (R(t, "iterate", Xe), /* @__PURE__ */ z(e)) ? t : /* @__PURE__ */ Lt(e) ? /* @__PURE__ */ It(e) ? t.map((e) => Vt(Bt(e))) : t.map(Vt) : t.map(Bt);
}
function $e(e) {
	return R(e = /* @__PURE__ */ B(e), "iterate", Xe), e;
}
function et(e, t) {
	return /* @__PURE__ */ Lt(e) ? Vt(/* @__PURE__ */ It(e) ? Bt(t) : t) : Bt(t);
}
var tt = {
	__proto__: null,
	[Symbol.iterator]() {
		return nt(this, Symbol.iterator, (e) => et(this, e));
	},
	concat(...e) {
		return Qe(this).concat(...e.map((e) => f(e) ? Qe(e) : e));
	},
	entries() {
		return nt(this, "entries", (e) => (e[1] = et(this, e[1]), e));
	},
	every(e, t) {
		return at(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return at(this, "filter", e, t, (e) => e.map((e) => et(this, e)), arguments);
	},
	find(e, t) {
		return at(this, "find", e, t, (e) => et(this, e), arguments);
	},
	findIndex(e, t) {
		return at(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return at(this, "findLast", e, t, (e) => et(this, e), arguments);
	},
	findLastIndex(e, t) {
		return at(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return at(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return st(this, "includes", e);
	},
	indexOf(...e) {
		return st(this, "indexOf", e);
	},
	join(e) {
		return Qe(this).join(e);
	},
	lastIndexOf(...e) {
		return st(this, "lastIndexOf", e);
	},
	map(e, t) {
		return at(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ct(this, "pop");
	},
	push(...e) {
		return ct(this, "push", e);
	},
	reduce(e, ...t) {
		return ot(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ot(this, "reduceRight", e, t);
	},
	shift() {
		return ct(this, "shift");
	},
	some(e, t) {
		return at(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ct(this, "splice", e);
	},
	toReversed() {
		return Qe(this).toReversed();
	},
	toSorted(e) {
		return Qe(this).toSorted(e);
	},
	toSpliced(...e) {
		return Qe(this).toSpliced(...e);
	},
	unshift(...e) {
		return ct(this, "unshift", e);
	},
	values() {
		return nt(this, "values", (e) => et(this, e));
	}
};
function nt(e, t, n) {
	let r = $e(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ z(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => rt(a.next(), n), i !== it[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => rt(a._next(), n);
	}
	return a;
}
function rt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var it = Array.prototype;
function at(e, t, n, r, i, a) {
	let o = $e(e), s = o !== e && !/* @__PURE__ */ z(e), c = o[t];
	if (c !== it[t]) {
		let t = c.apply(e, a);
		return s ? Bt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, et(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ot(e, t, n, r) {
	let i = $e(e), a = i !== e && !/* @__PURE__ */ z(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = et(e, t)), n.call(this, t, et(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? et(e, c) : c;
}
function st(e, t, n) {
	let r = /* @__PURE__ */ B(e);
	R(r, "iterate", Xe);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Rt(n[0]) ? (n[0] = /* @__PURE__ */ B(n[0]), r[t](...n)) : i;
}
function ct(e, t, n = []) {
	Be(), Ae();
	let r = (/* @__PURE__ */ B(e))[t].apply(e, n);
	return je(), Ve(), r;
}
var lt = /* @__PURE__ */ t("__proto__,__v_isRef,__isVue"), ut = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(v));
function dt(e) {
	v(e) || (e = String(e));
	let t = /* @__PURE__ */ B(this);
	return R(t, "has", e), t.hasOwnProperty(e);
}
var ft = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? At : kt : i ? Ot : Dt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = f(e);
		if (!r) {
			let e;
			if (a && (e = tt[t])) return e;
			if (t === "hasOwnProperty") return dt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ V(e) ? e : n);
		if ((v(t) ? ut.has(t) : lt(t)) || (r || R(e, "get", t), i)) return o;
		if (/* @__PURE__ */ V(o)) {
			let e = a && T(t) ? o : o.value;
			return r && y(e) ? /* @__PURE__ */ Pt(e) : e;
		}
		return y(o) ? r ? /* @__PURE__ */ Pt(o) : /* @__PURE__ */ Mt(o) : o;
	}
}, pt = class extends ft {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = f(e) && T(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Lt(i);
			if (!/* @__PURE__ */ z(n) && !/* @__PURE__ */ Lt(n) && (i = /* @__PURE__ */ B(i), n = /* @__PURE__ */ B(n)), !a && /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : d(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ V(e) ? e : r);
		return e === /* @__PURE__ */ B(r) && s && (o ? A(n, i) && Ze(e, "set", t, n, i) : Ze(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = d(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ze(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return v(t) && ut.has(t) || R(e, "has", t), n;
	}
	ownKeys(e) {
		return R(e, "iterate", f(e) ? "length" : Je), Reflect.ownKeys(e);
	}
}, mt = class extends ft {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, ht = /* @__PURE__ */ new pt(), gt = /* @__PURE__ */ new mt(), _t = /* @__PURE__ */ new pt(!0), vt = (e) => e, yt = (e) => Reflect.getPrototypeOf(e);
function bt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ B(i), o = p(a), s = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? vt : t ? Vt : Bt;
		return !t && R(a, "iterate", l ? Ye : Je), c(Object.create(u), { next() {
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
function xt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function St(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ B(r), a = /* @__PURE__ */ B(n);
			e || (A(n, a) && R(i, "get", n), R(i, "get", a));
			let { has: o } = yt(i), s = t ? vt : e ? Vt : Bt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && R(/* @__PURE__ */ B(t), "iterate", Je), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ B(n), i = /* @__PURE__ */ B(t);
			return e || (A(t, i) && R(r, "has", t), R(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ B(a), s = t ? vt : e ? Vt : Bt;
			return !e && R(o, "iterate", Je), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return c(n, e ? {
		add: xt("add"),
		set: xt("set"),
		delete: xt("delete"),
		clear: xt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ B(this), r = yt(n), i = /* @__PURE__ */ B(e), a = !t && !/* @__PURE__ */ z(e) && !/* @__PURE__ */ Lt(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), Ze(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ z(n) || /* @__PURE__ */ Lt(n) || (n = /* @__PURE__ */ B(n));
			let r = /* @__PURE__ */ B(this), { has: i, get: a } = yt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ B(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && Ze(r, "set", e, n, s) : Ze(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ B(this), { has: n, get: r } = yt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ B(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ze(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ B(this), t = e.size !== 0, n = e.clear();
			return t && Ze(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = bt(r, e, t);
	}), n;
}
function Ct(e, t) {
	let n = St(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(d(n, i) && i in r ? n : r, i, a);
}
var wt = { get: /* @__PURE__ */ Ct(!1, !1) }, Tt = { get: /* @__PURE__ */ Ct(!1, !0) }, Et = { get: /* @__PURE__ */ Ct(!0, !1) }, Dt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap();
function jt(e) {
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
function Mt(e) {
	return /* @__PURE__ */ Lt(e) ? e : Ft(e, !1, ht, wt, Dt);
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
	return Ft(e, !1, _t, Tt, Ot);
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return Ft(e, !0, gt, Et, kt);
}
function Ft(e, t, n, r, i) {
	if (!y(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = jt(C(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return /* @__PURE__ */ Lt(e) ? /* @__PURE__ */ It(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ B(t) : e;
}
function zt(e) {
	return !d(e, "__v_skip") && Object.isExtensible(e) && j(e, "__v_skip", !0), e;
}
var Bt = (e) => y(e) ? /* @__PURE__ */ Mt(e) : e, Vt = (e) => y(e) ? /* @__PURE__ */ Pt(e) : e;
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
		this.dep = new Ge(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ B(e), this._value = t ? e : Bt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ z(e) || /* @__PURE__ */ Lt(e);
		e = n ? e : /* @__PURE__ */ B(e), A(e, t) && (this._rawValue = e, this._value = n ? e : Bt(e), this.dep.trigger());
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
	return /* @__PURE__ */ It(e) ? e : new Proxy(e, Wt);
}
var Kt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ge(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ue - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && L !== this) return ke(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Fe(this), e && (e.version = this.dep.version), this._value;
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
	let { immediate: a, deep: o, once: s, scheduler: c, augmentJob: u, call: d } = r, p = (e) => o ? e : /* @__PURE__ */ z(e) || o === !1 || o === 0 ? $t(e, 1) : $t(e), m, h, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ V(e) ? (h = () => e.value, y = /* @__PURE__ */ z(e)) : /* @__PURE__ */ It(e) ? (h = () => p(e), y = !0) : f(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ It(e) || /* @__PURE__ */ z(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ V(e)) return e.value;
		if (/* @__PURE__ */ It(e)) return p(e);
		if (g(e)) return d ? d(e, 2) : e();
	})) : h = g(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (_) {
			Be();
			try {
				_();
			} finally {
				Ve();
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
	let x = Ce(), S = () => {
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
				if (e || o || y || (b ? n.some((e, t) => A(e, C[t])) : A(n, C))) {
					let e = Xt;
					Be();
					try {
						_ && _(), Xt = m;
						let e = [
							n,
							C === Jt ? void 0 : b && C[0] === Jt ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						Xt = e, Ve();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Te(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => Zt(e, !1, m), _ = m.onStop = () => {
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
// ../../../github/Edutictac/edutictac-commons-release-beta6.1/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
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
			Be(), en(o, null, 10, [
				e,
				i,
				a
			]), Ve();
			return;
		}
	}
	rn(e, r, a, i, s);
}
function rn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var W = [], an = -1, on = [], sn = null, cn = 0, ln = /* @__PURE__ */ Promise.resolve(), un = null;
function dn(e) {
	let t = un || ln;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function fn(e) {
	let t = an + 1, n = W.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = W[r], a = bn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function pn(e) {
	if (!(e.flags & 1)) {
		let t = bn(e), n = W[W.length - 1];
		!n || !(e.flags & 2) && t >= bn(n) ? W.push(e) : W.splice(fn(t), 0, e), e.flags |= 1, mn();
	}
}
function mn() {
	un ||= ln.then(xn);
}
function hn(e) {
	if (!f(e)) sn && e.id === -1 ? sn.splice(cn + 1, 0, e) : e.flags & 1 || (on.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) on.push(e[t]);
	mn();
}
function gn(e, t, n, r = an + 1) {
	for (; r < W.length; r++) {
		let n = W[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			W.splice(r, 1), r = e ? r - 1 : an, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function _n(e, t, n = 0) {
	if (on.length) {
		let e = on, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < on.length; i++) {
				let a = on[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? on[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => bn(e) - bn(t));
		if (on.length = r, sn) {
			for (let e = 0; e < i.length; e++) sn.push(i[e]);
			return;
		}
		for (sn = i, cn = 0; cn < sn.length; cn++) {
			let e = sn[cn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		sn = null, cn = 0;
	}
}
var vn = !1;
function yn(e, t) {
	if (vn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(on);
	e(), vn = !0;
	try {
		gn(void 0, t), _n(void 0, n, t);
	} finally {
		vn = !1;
	}
}
var bn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function xn(e) {
	try {
		for (an = 0; an < W.length; an++) {
			let e = W[an];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), en(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; an < W.length; an++) {
			let e = W[an];
			e && (e.flags &= -2);
		}
		an = -1, W.length = 0, _n(e), un = null, (W.length || on.length) && xn(e);
	}
}
var G = null, Sn = null;
function Cn(e) {
	let t = G;
	return G = e, Sn = e && e.type.__scopeId || null, t;
}
function wn(e, t = G, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ai(-1);
		let i = Cn(t), a = ni.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ni.length; e > a; e--) ri();
			Cn(i), r._d && ai(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Tn(e, t) {
	if (G === null) return e;
	let r = zi(G), i = e.dirs ||= [];
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
function En(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Be(), tn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ve());
	}
}
function Dn(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function On(e, t, n = !1) {
	let r = Ei();
	if (r || dr) {
		let i = dr ? dr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && g(t) ? t.call(r && r.proxy) : t;
	}
}
var kn = /* @__PURE__ */ Symbol.for("v-scx"), An = () => On(kn);
function jn(e, t, n) {
	return Mn(e, t, n);
}
function Mn(e, t, r = n) {
	let { immediate: a, deep: o, flush: s, once: l } = r, u = c({}, r), d = t && a || !t && s !== "post", f;
	if (Mi) {
		if (s === "sync") {
			let e = An();
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
		e.i = p, K(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : pn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Qt(e, t, u);
	return Mi && (f ? f.push(h) : d && h()), h;
}
var Nn = /* @__PURE__ */ Symbol("_vte"), Pn = (e) => e.__isTeleport, Fn = /* @__PURE__ */ Symbol("_leaveCb");
function In(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ei) {
			t = n;
			break;
		}
	}
	return t;
}
function Ln(e) {
	if (!Kn(e)) return Pn(e.type) && e.children ? In(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && g(n.default)) return n.default();
	}
}
function Rn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Rn(Pn(n.type) && Ln(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === q && f(e.children)) {
		let n = _r(e.children, !1);
		n && Rn(n, t);
	}
}
function zn(e) {
	if (e.component) return zn(e.component.subTree);
	if (e.type === q) {
		let t = f(e.children) && _r(e.children, !1);
		return t ? zn(t) : void 0;
	}
	if (e.type !== ei) return e;
}
function Bn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Vn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Hn = /* @__PURE__ */ new WeakMap();
function Un(e, t, r, i, o = !1) {
	if (f(e)) {
		e.forEach((e, n) => Un(e, t && (f(t) ? t[n] : t), r, i, o));
		return;
	}
	if (Gn(i) && !o) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Un(e, t, r, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? zi(i.component) : i.el, c = o ? null : s, { i: u, r: p } = e, m = t && t.r, h = u.refs === n ? u.refs = {} : u.refs, v = u.setupState, y = /* @__PURE__ */ B(v), b = v === n ? a : (e) => !Vn(h, e) && d(y, e), x = (e, t) => !(t && Vn(h, t));
	if (m != null && m !== p) {
		if (Wn(t), _(m)) h[m] = null, b(m) && (v[m] = null);
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
					i(), Hn.delete(e);
				};
				t.id = -1, Hn.set(e, t), K(t, r);
			} else Wn(e), i();
		}
	}
}
function Wn(e) {
	let t = Hn.get(e);
	t && (t.flags |= 8, Hn.delete(e));
}
oe().requestIdleCallback, oe().cancelIdleCallback;
var Gn = (e) => !!e.type.__asyncLoader, Kn = (e) => e.type.__isKeepAlive;
function qn(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Be();
			let i = ki(n), a = tn(t, n, e, r);
			return i(), Ve(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Jn = (e) => (t, n = $) => {
	Mi && e !== "sp" || qn(e, (...e) => t(...e), n);
}, Yn = Jn("m"), Xn = Jn("bum"), Zn = "components";
function Qn(e, t) {
	return tr(Zn, e, !0, t) || e;
}
var $n = /* @__PURE__ */ Symbol.for("v-ndc");
function er(e) {
	return _(e) ? tr(Zn, e, !1) || e : e || $n;
}
function tr(e, t, n = !0, r = !1) {
	let i = G || $;
	if (i) {
		let n = i.type;
		if (e === Zn) {
			let e = Bi(n, !1);
			if (e && (e === t || e === D(t) || e === ne(D(t)))) return n;
		}
		let a = nr(i[e] || n[e], t) || nr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function nr(e, t) {
	return e && (e[t] || e[D(t)] || e[ne(D(t))]);
}
function rr(e, t, n, r) {
	let i, a = n && n[r], o = f(e);
	if (o || _(e)) {
		let n = o && /* @__PURE__ */ It(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ z(e), s = /* @__PURE__ */ Lt(e), e = $e(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Vt(Bt(e[n])) : Bt(e[n]) : e[n], n, void 0, a && a[n]);
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
var ir = (e) => e ? ji(e) ? zi(e) : ir(e.parent) : null, ar = /* @__PURE__ */ c(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ir(e.parent),
	$root: (e) => ir(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		pn(e.update);
	},
	$nextTick: (e) => e.n ||= dn.bind(e.proxy),
	$watch: (e) => i
}), or = (e, t) => e !== n && !e.__isScriptSetup && d(e, t), sr = {
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
			else if (or(i, t)) return s[t] = 1, i[t];
			else if (d(o, t)) return s[t] = 3, o[t];
			else if (r !== n && d(r, t)) return s[t] = 4, r[t];
			else s[t] = 0;
		}
		let u = ar[t], f, p;
		if (u) return t === "$attrs" && R(e.attrs, "get", ""), u(e);
		if ((f = c.__cssModules) && (f = f[t])) return f;
		if (r !== n && d(r, t)) return s[t] = 4, r[t];
		if (p = l.config.globalProperties, d(p, t)) return p[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return or(i, t) ? (i[t] = n, !0) : d(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || or(t, s) || d(a, s) || d(r, s) || d(ar, s) || d(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? d(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function cr() {
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
var lr = 0;
function ur(e, t) {
	return function(n, r = null) {
		g(n) || (n = c({}, n)), r != null && !y(r) && (r = null);
		let i = cr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, l = i.app = {
			_uid: lr++,
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
					let u = l._ceVNode || fi(n, r);
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
				let t = dr;
				dr = l;
				try {
					return e();
				} finally {
					dr = t;
				}
			}
		};
		return l;
	};
}
var dr = null, fr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${k(t)}Modifiers`];
function pr(e, t, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || n, a = r, o = t.startsWith("update:"), s = o && fr(i, t.slice(7));
	s && (s.trim && (a = r.map((e) => _(e) ? e.trim() : e)), s.number && (a = a.map(M)));
	let c, l = i[c = re(t)] || i[c = re(D(t))];
	!l && o && (l = i[c = re(k(t))]), l && tn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, tn(u, e, 6, a);
	}
}
function mr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (f(a) ? a.forEach((e) => o[e] = null) : c(o, a), y(e) && r.set(e, o), o) : (y(e) && r.set(e, null), null);
}
function hr(e, t) {
	return !e || !o(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), d(e, t[0].toLowerCase() + t.slice(1)) || d(e, k(t)) || d(e, t));
}
function gr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Cn(e), v, y;
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
			}) : e(f, null)), y = t.props ? c : vr(c);
		}
	} catch (t) {
		ni.length = 0, nn(t, e, 1), v = fi(ei);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(s) && (y = yr(y, a)), b = hi(b, y, !1, !0));
	}
	return n.dirs && (b = hi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Rn(Pn(b.type) && Ln(b) || b, n.transition), v = b, Cn(_), v;
}
function _r(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ci(r)) {
			if (r.type !== ei || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var vr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || o(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, yr = (e, t) => {
	let n = {};
	for (let r in e) s(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function br(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? xr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Sr(o, r, n) && !hr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || xr(r, o, l) : !!o;
	return !1;
}
function xr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!d(e, a) || Sr(t, e, a) && !hr(n, a)) return !0;
	}
	return !1;
}
function Sr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && y(r) && y(i) ? !P(r, i) : r !== i;
}
function Cr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var wr = {}, Tr = () => Object.create(wr), Er = (e) => Object.getPrototypeOf(e) === wr;
function Dr(e, t, n, r = !1) {
	let i = {}, a = Tr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), kr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Nt(i) : e.type.props ? i : a, e.attrs = a;
}
function Or(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ B(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (hr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (d(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = D(o);
						i[t] = Ar(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		kr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (d(t, a) || (r = k(a)) !== a && d(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Ar(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && d(t, e) || (delete a[e], l = !0);
	}
	l && Ze(e.attrs, "set", "");
}
function kr(e, t, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let n in t) {
		if (ee(n)) continue;
		let l = t[n], u;
		a && d(a, u = D(n)) ? !o || !o.includes(u) ? r[u] = l : (c ||= {})[u] = l : hr(e.emitsOptions, n) || n in i && l === i[n] || (i[n] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ B(r), i = c || n;
		for (let n = 0; n < o.length; n++) {
			let s = o[n];
			r[s] = Ar(a, t, s, i[s], e, !d(i, s));
		}
	}
	return s;
}
function Ar(e, t, n, r, i, a) {
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === k(n)) && (r = !0));
	}
	return r;
}
function jr(e, t, i = !1) {
	let a = t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, l = {}, u = [];
	if (!s) return y(e) && a.set(e, r), r;
	if (f(s)) for (let e = 0; e < s.length; e++) {
		let t = D(s[e]);
		Mr(t) && (l[t] = n);
	}
	else if (s) for (let e in s) {
		let t = D(e);
		if (Mr(t)) {
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
function Mr(e) {
	return e[0] !== "$" && !ee(e);
}
var Nr = (e) => e === "_" || e === "_ctx" || e === "$stable", Pr = (e) => f(e) ? e.map(_i) : [_i(e)], Fr = (e, t, n) => {
	if (t._n) return t;
	let r = wn((...e) => Pr(t(...e)), n);
	return r._c = !1, r;
}, Ir = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Nr(n)) continue;
		let i = e[n];
		if (g(i)) t[n] = Fr(n, i, r);
		else if (i != null) {
			let e = Pr(i);
			t[n] = () => e;
		}
	}
}, Lr = (e, t) => {
	let n = Pr(t);
	e.slots.default = () => n;
}, Rr = (e, t, n) => {
	for (let r in t) (n || !Nr(r)) && (e[r] = t[r]);
}, zr = (e, t, n) => {
	let r = e.slots = Tr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Rr(r, t, n), n && j(r, "_", e, !0)) : Ir(t, r);
	} else t && Lr(e, t);
}, Br = (e, t, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = n;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? r && e === 1 ? o = !1 : Rr(a, t, r) : (o = !t.$stable, Ir(t, a)), s = t;
	} else t && (Lr(e, t), s = { default: 1 });
	if (o) for (let e in a) !Nr(e) && s[e] == null && delete a[e];
}, K = Qr;
function Vr(e) {
	return Hr(e);
}
function Hr(e, t) {
	let a = oe();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = i, insertStaticContent: _ } = e, v = (e, t, n, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !li(e, t) && (i = he(e), N(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === r && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case $r:
				y(e, t, n, i);
				break;
			case ei:
				b(e, t, n, i);
				break;
			case ti:
				e ?? x(t, n, i, s);
				break;
			case q:
				ne(e, t, n, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, i, a, o, s, c, l) : f & 6 ? re(e, t, n, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, i, a, o, s, c, l, _e);
		}
		d != null && a ? Un(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Un(e.ref, null, o, e, !0);
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
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, Ur(e, a), s, u), _ && En(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && xi(f, r, e);
		}
		_ && En(e, null, r, "beforeMount");
		let v = Gr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && K(() => {
			try {
				f && xi(f, r, e), v && g.enter(d), _ && En(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Zr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? vi(e[l]) : _i(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, t, r, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || n, h = t.props || n, g;
		if (r && Wr(r, !1), (g = h.onVnodeBeforeUpdate) && xi(g, r, t, e), f && En(t, e, r, "beforeUpdate"), r && Wr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, Ur(t, a), o) : s || se(e, t, l, null, r, i, Ur(t, a), o, !1), u > 0) {
			if (u & 16) k(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && k(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && K(() => {
			g && xi(g, r, t, e), f && En(t, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Xr(c), d = u && (c.type === q || !li(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, k = (e, t, r, i, a) => {
		if (t !== r) {
			if (t !== n) for (let n in t) !ee(n) && !(n in r) && c(e, n, t[n], null, a, i);
			for (let n in r) {
				if (ee(n)) continue;
				let o = r[n], s = t[n];
				o !== s && n !== "value" && c(e, n, s, o, a, i);
			}
			"value" in r && c(e, "value", t.value, r.value, a);
		}
	}, ne = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Kr(e, t, !0)) : se(e, t, n, f, i, a, s, c, l);
	}, re = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : A(t, n, r, i, a, o, c) : j(e, t, c);
	}, A = (e, t, n, r, i, a, o) => {
		let s = e.component = Ti(e, r, i);
		if (Kn(e) && (s.ctx.renderer = _e), Ni(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, M, o, a), !e.el) {
				let r = s.subTree = fi(ei);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else M(s, e, t, n, i, a, o);
	}, j = (e, t, n) => {
		let r = t.component = e.component;
		if (br(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ae(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, M = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Jr(e);
					if (n) {
						t && (t.el = c.el, ae(e, t, o)), n.asyncDep.then(() => {
							K(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Wr(e, !1), t ? (t.el = c.el, ae(e, t, o)) : t = c, n && ie(n), (d = t.props && t.props.onVnodeBeforeUpdate) && xi(d, s, t, c), Wr(e, !0);
				let f = gr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), he(p), e, i, a), t.el = f.el, u === null && Cr(e, f.el), r && K(r, i), (d = t.props && t.props.onVnodeUpdated) && K(() => xi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Gn(t);
				if (Wr(e, !1), l && ie(l), !m && (o = c && c.onVnodeBeforeMount) && xi(o, d, t), Wr(e, !0), s && ve) {
					let t = () => {
						e.subTree = gr(e), ve(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = gr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && K(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					K(() => xi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Gn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && K(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Te(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => pn(u), Wr(e, !0), l();
	}, ae = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Or(e, t.props, r, n), Br(e, t.children, n), Be(), gn(e), Ve();
	}, se = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				ce(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && me(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? le(l, d, n, r, i, a, o, s, c) : me(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, ce = (e, t, n, i, a, o, s, c, l) => {
		e ||= r, t ||= r;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? vi(t[p]) : _i(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? me(e, a, o, !0, !1, f) : E(t, n, i, a, o, s, c, l, f);
	}, le = (e, t, n, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? vi(t[u]) : _i(t[u]);
			if (li(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? vi(t[p]) : _i(t[p]);
			if (li(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, r = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? vi(t[u]) : _i(t[u]), n, r, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) N(e[u], a, o, !0), u++;
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
					N(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && li(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? N(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? qr(C) : r;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, r = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Xr(f) : i;
				C[u] === 0 ? v(null, r, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ue(r, n, p, 2) : _--);
			}
		}
	}, ue = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) ue(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, _e);
		else if (c === q) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ue(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === ti) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Fn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), K(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Fn];
					a._isLeaving && a[Fn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, N = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Be(), Un(s, null, n, e, !0), Ve()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Gn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && xi(_, t, e), u & 6) pe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && En(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, _e, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? me(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && me(c, t, n), r && de(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && K(() => {
			_ && xi(_, t, e), h && En(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, de = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === q;
		if (a && !i) {
			fe(n, r);
			return;
		}
		if (t === ti) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? zn(e) : e, c = () => {
			a ? m(n) && fe(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, fe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, pe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Yr(c), Yr(l), r && ie(r), i.stop(), a ? (a.flags |= 8, N(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, N(o, e, t, n)), s && K(s, t), K(() => {
			e.isUnmounted = !0;
		}, t);
	}, me = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) N(e[o], t, n, r, i);
	}, he = (e) => {
		if (e.shapeFlag & 6) return he(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Nn];
		return n ? h(n) : t;
	}, ge = (e, t, n) => {
		yn(() => {
			e == null ? t._vnode && N(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : wi());
	}, _e = {
		p: v,
		um: N,
		m: ue,
		r: de,
		mt: A,
		mc: E,
		pc: se,
		pbc: O,
		n: he,
		o: e
	}, P, ve;
	return t && ([P, ve] = t(_e)), {
		render: ge,
		hydrate: P,
		createApp: ur(ge, P)
	};
}
function Ur({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Wr({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Gr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Kr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (f(r) && f(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = vi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Kr(t, a)), a.type === $r && (a.patchFlag === -1 && (a = i[e] = vi(a)), a.el = t.el), a.type === ei && !a.el && (a.el = t.el);
	}
}
function qr(e) {
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
function Jr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Jr(t);
}
function Yr(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Xr(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Xr(t.subTree) : null;
}
var Zr = (e) => e.__isSuspense;
function Qr(e, t) {
	t && t.pendingBranch ? f(e) ? t.effects.push(...e) : t.effects.push(e) : hn(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), $r = /* @__PURE__ */ Symbol.for("v-txt"), ei = /* @__PURE__ */ Symbol.for("v-cmt"), ti = /* @__PURE__ */ Symbol.for("v-stc"), ni = [], J = null;
function Y(e = !1) {
	ni.push(J = e ? null : []);
}
function ri() {
	ni.pop(), J = ni[ni.length - 1] || null;
}
var ii = 1;
function ai(e, t = !1) {
	ii += e, e < 0 && J && t && (J.hasOnce = !0);
}
function oi(e) {
	return e.dynamicChildren = ii > 0 ? J || r : null, ri(), ii > 0 && J && J.push(e), e;
}
function X(e, t, n, r, i, a) {
	return oi(Z(e, t, n, r, i, a, !0));
}
function si(e, t, n, r, i) {
	return oi(fi(e, t, n, r, i, !0));
}
function ci(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function li(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ui = ({ key: e }) => e ?? null, di = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : _(e) || /* @__PURE__ */ V(e) || g(e) ? {
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
		key: t && ui(t),
		ref: t && di(t),
		scopeId: Sn,
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
	return s ? (yi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= _(n) ? 8 : 16), ii > 0 && !o && J && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && J.push(c), c;
}
var fi = pi;
function pi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== $n || (e = ei), ci(e)) {
		let r = hi(e, t, !0);
		return n && yi(r, n), ii > 0 && !a && J && (r.shapeFlag & 6 ? J[J.indexOf(e)] = r : J.push(r)), r.patchFlag = -2, r;
	}
	if (Vi(e) && (e = e.__vccOpts), t) {
		t = mi(t);
		let { class: e, style: n } = t;
		e && !_(e) && (t.class = de(e)), y(n) && (/* @__PURE__ */ Rt(n) && !f(n) && (n = c({}, n)), t.style = se(n));
	}
	let o = _(e) ? 1 : Zr(e) ? 128 : Pn(e) ? 64 : y(e) ? 4 : g(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function mi(e) {
	return e ? /* @__PURE__ */ Rt(e) || Er(e) ? c({}, e) : e : null;
}
function hi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? bi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ui(l),
		ref: t && t.ref ? n && a ? f(a) ? a.concat(di(t)) : [a, di(t)] : di(t) : a,
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
		ssContent: e.ssContent && hi(e.ssContent),
		ssFallback: e.ssFallback && hi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Rn(u, c.clone(u)), u;
}
function gi(e = " ", t = 0) {
	return fi($r, null, e, t);
}
function Q(e = "", t = !1) {
	return t ? (Y(), si(ei, null, e)) : fi(ei, null, e);
}
function _i(e) {
	return e == null || typeof e == "boolean" ? fi(ei) : f(e) ? fi(q, null, e.slice()) : ci(e) ? vi(e) : fi($r, null, String(e));
}
function vi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : hi(e);
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
			!r && !Er(t) ? t._ctx = G : r === 3 && G && (G.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (g(t)) {
		if (r & 65) {
			yi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: G
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [gi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function bi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = de([t.class, r.class]));
		else if (e === "style") t.style = se([t.style, r.style]);
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
var Si = cr(), Ci = 0;
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
		scope: new Se(!0),
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
		propsOptions: jr(i, a),
		emitsOptions: mr(i, a),
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = pr.bind(null, o), e.ce && e.ce(o), o;
}
var $ = null, Ei = () => $ || G, Di, Oi;
{
	let e = oe(), t = (t, n) => {
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
	Dr(e, r, a, t), zr(e, i, n || t);
	let o = a ? Pi(e, t) : void 0;
	return t && Oi(!1), o;
}
function Pi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, sr);
	let { setup: r } = n;
	if (r) {
		Be();
		let n = e.setupContext = r.length > 1 ? Ri(e) : null, i = ki(e), a = en(r, e, 0, [e.props, n]), o = b(a);
		if (Ve(), i(), (o || e.sp) && !Gn(e) && Bn(e), o) {
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
	return R(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Gt(zt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ar) return ar[n](e);
		},
		has(e, t) {
			return t in e || t in ar;
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
		aa.test(n) ? e.setProperty(k(r), n.replace(aa, ""), "important") : e[r] = n;
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
	r = ne(r);
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
function fa(e, t, n, r, i, a = fe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(da, t.slice(6, t.length)) : e.setAttributeNS(da, t, n) : n == null || a && !pe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : v(n) ? String(n) : n);
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
		r === "boolean" ? n = pe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : k(e.slice(2)), t];
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
	return f(t) ? (e) => ie(t, e) : t;
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
	return t && (e = e.trim()), n && (e = M(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? M(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Ia = {
	deep: !0,
	created(e, t, n) {
		e[Ma] = ka(n), ma(e, "change", () => {
			let t = e._modelValue, n = Va(e), r = e.checked, i = e[Ma];
			if (f(t)) {
				let e = ve(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (m(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Ha(e, r));
		});
	},
	mounted: La,
	beforeUpdate(e, t, n) {
		e[Ma] = ka(n), La(e, t, n);
	}
};
function La(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (f(t)) i = ve(t, r.props.value) > -1;
	else if (m(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = P(t, Ha(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Ra = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, ma(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? M(Va(e)) : Va(e)), r = e.multiple, i = r ? m(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? f(i) ? t.slice() : t : i];
			try {
				e[Ma](i);
			} finally {
				dn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Ma] = ka(r);
	},
	mounted(e, { value: t }) {
		Ba(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Ma] = ka(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && za(t, n[1], n[0]) || Ba(e, t);
	}
};
function za(e, t, n) {
	if (!n || f(e)) return P(e, t);
	if (m(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Ba(e, t) {
	let n = e.multiple, r = f(t);
	if (!n || r || m(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Va(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : ve(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (P(Va(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Va(e) {
	return "_value" in e ? e._value : e.value;
}
function Ha(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Ua = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Wa = {
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
	exact: (e, t) => Ua.some((n) => e[`${n}Key`] && !t.includes(n))
}, Ga = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Wa[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Ka = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, qa = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = k(n.key);
		if (t.some((e) => e === r || Ka[e] === r)) return e(n);
	}));
}, Ja = /* @__PURE__ */ c({ patchProp: Ea }, Zi), Ya;
function Xa() {
	return Ya ||= Vr(Ja);
}
var Za = ((...e) => {
	let t = Xa().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = $a(e);
		if (!r) return;
		let i = t._component;
		g(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Qa(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Qa(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function $a(e) {
	return _(e) ? document.querySelector(e) : e;
}
// services/portal/src/rebost/AssetCard.vue
var eo = ["aria-label"], to = ["src", "alt"], no = ["value"], ro = {
	key: 2,
	class: "credit"
}, io = { key: 3 }, ao = { class: "actions" }, oo = ["aria-expanded"], so = ["hidden"], co = {
	__name: "AssetCard",
	props: {
		item: {
			type: Object,
			required: !0
		},
		nested: Boolean
	},
	setup(e) {
		let t = e, { api: n, t: r, locale: i, authenticated: a, picking: o, familySelection: s, types: c, run: l, refresh: u, chooseCollection: d, preview: f, select: p, download: m, report: h } = On("rebost"), g = /* @__PURE__ */ H(""), _ = /* @__PURE__ */ H(""), v = /* @__PURE__ */ H(""), y = /* @__PURE__ */ H(!1), b = /* @__PURE__ */ H(null), x = !0, S = 0, C = Hi(() => {
			if (!["catalog", "scratch"].includes(t.item.collection)) return t.item.name;
			let e = t.item.names || {};
			return e[i.value] || i.value === "va" && e.ca || e.es || e.ca || e.en || t.item.name || t.item.id;
		}), w = Hi(() => !t.nested && t.item.collection === "scratch" && t.item.family?.count > 1), T = Hi(() => ["catalog", "scratch"].includes(t.item.collection) ? t.item : t.item.provenance);
		jn(() => t.item, async (e) => {
			g.value = e.name, _.value = e.type, y.value = !1, b.value = null;
			let t = ++S;
			URL.revokeObjectURL(v.value), v.value = "";
			try {
				let r = await n.read(e.id, !0);
				x && t === S && (v.value = URL.createObjectURL(r));
			} catch (e) {
				x && t === S && h(e);
			}
		}, { immediate: !0 }), Xn(() => {
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
		function te() {
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
		function E() {
			confirm(r("rebost.confirm")) && l(async () => {
				await n.remove(t.item), await u();
			});
		}
		return (t, i) => {
			let d = Qn("AssetCard", !0);
			return Y(), si(er(e.nested ? "section" : "article"), {
				"data-id": e.item.id,
				class: de({
					"family-costume": e.nested,
					"expanded-family": y.value
				})
			}, {
				default: wn(() => [
					Z("button", {
						type: "button",
						class: "image secondary",
						"aria-label": U(r)("rebost.view") + ": " + C.value,
						onClick: i[0] ||= (t) => U(l)(() => U(f)(e.item, C.value))
					}, [Z("img", {
						src: v.value || void 0,
						alt: C.value
					}, null, 8, to)], 8, eo),
					U(o) || e.item.readonly ? (Y(), X(q, { key: 0 }, [(Y(), si(er(e.nested ? "h3" : "h2"), null, {
						default: wn(() => [gi(F(C.value), 1)]),
						_: 1
					})), Z("span", null, F(U(r)("rebost." + e.item.type)), 1)], 64)) : (Y(), X(q, { key: 1 }, [Z("label", null, [gi(F(U(r)("rebost.name")), 1), Tn(Z("input", {
						"onUpdate:modelValue": i[1] ||= (e) => g.value = e,
						maxlength: "200",
						required: ""
					}, null, 512), [[Fa, g.value]])]), Z("label", null, [gi(F(U(r)("rebost.filter")), 1), Tn(Z("select", { "onUpdate:modelValue": i[2] ||= (e) => _.value = e }, [(Y(!0), X(q, null, rr(U(c), (e) => (Y(), X("option", {
						key: e,
						value: e
					}, F(U(r)("rebost." + e)), 9, no))), 128))], 512), [[Ra, _.value]])])], 64)),
					T.value && !e.nested ? (Y(), X("p", ro, F(T.value.attribution) + " · " + F(T.value.license), 1)) : Q("", !0),
					w.value ? (Y(), X("span", io, F(e.item.family.count) + " " + F(U(r)("rebost.costumeCount")), 1)) : Q("", !0),
					Z("small", null, F(e.item.width) + " × " + F(e.item.height) + " px", 1),
					Z("div", ao, [
						U(o) ? (Y(), X("button", {
							key: 0,
							type: "button",
							onClick: i[3] ||= (t) => U(p)(e.item, C.value, w.value && U(s))
						}, F(w.value && U(s) ? U(r)("rebost.addFamily") : U(r)("rebost.choose")), 1)) : e.item.readonly ? (Y(), X("button", {
							key: 1,
							type: "button",
							onClick: te
						}, F(U(a) ? w.value ? U(r)("rebost.saveImage") : U(r)("rebost.saveCopy") : U(r)("rebost.loginToSave")), 1)) : (Y(), X(q, { key: 2 }, [
							Z("button", {
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
							}, F(U(r)("rebost.save")), 1),
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
							}, F(U(r)("rebost.duplicate")), 1),
							Z("button", {
								type: "button",
								class: "danger",
								onClick: E
							}, F(U(r)("rebost.remove")), 1)
						], 64)),
						T.value && !U(o) ? (Y(), X(q, { key: 3 }, [Z("button", {
							type: "button",
							class: "secondary",
							onClick: i[6] ||= (t) => U(l)(() => U(m)(e.item))
						}, F(U(r)("rebost.source")), 1), Z("button", {
							type: "button",
							class: "secondary",
							onClick: i[7] ||= (t) => U(l)(() => U(m)(e.item, !0))
						}, F(U(r)("rebost.license")), 1)], 64)) : Q("", !0),
						w.value ? (Y(), X("button", {
							key: 4,
							class: "secondary",
							type: "button",
							"aria-expanded": y.value,
							onClick: ee
						}, F(y.value ? U(r)("rebost.hideCostumes") : U(r)("rebost.costumes")), 9, oo)) : Q("", !0)
					]),
					b.value ? (Y(), X("div", {
						key: 4,
						class: "family-variants",
						hidden: !y.value
					}, [(Y(!0), X(q, null, rr(b.value, (e) => (Y(), si(d, {
						key: e.id,
						item: e,
						nested: ""
					}, null, 8, ["item"]))), 128))], 8, so)) : Q("", !0)
				]),
				_: 1
			}, 8, ["data-id", "class"]);
		};
	}
}, lo = {
	id: "banks",
	class: "panel banks-panel"
}, uo = ["placeholder"], fo = { class: "banks-free" }, po = ["disabled"], mo = {
	key: 0,
	class: "banks-note"
}, ho = {
	key: 1,
	class: "banks-login",
	role: "alert"
}, go = ["href"], _o = {
	key: 2,
	role: "status"
}, vo = { class: "banks-title" }, yo = {
	key: 0,
	class: "banks-state"
}, bo = {
	key: 1,
	class: "banks-state"
}, xo = {
	key: 2,
	class: "banks-state"
}, So = {
	key: 0,
	class: "banks-grid"
}, Co = { class: "image" }, wo = ["src", "alt"], To = { class: "credit" }, Eo = ["title"], Do = ["href"], Oo = { class: "actions" }, ko = ["disabled", "onClick"], Ao = ["onClick"], jo = 6, Mo = {
	__name: "BanksPanel",
	setup(e) {
		let { api: t, t: n, locale: r, authenticated: i, run: a, report: o } = On("rebost"), s = String(window.commonsDeployment?.bankSearchUrl || "").replace(/\/$/, ""), c = [
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
		], l = /* @__PURE__ */ H(""), u = /* @__PURE__ */ H(!0), d = /* @__PURE__ */ H(!1), f = /* @__PURE__ */ H(!1), p = /* @__PURE__ */ H(""), m = /* @__PURE__ */ H([]), h = /* @__PURE__ */ H(/* @__PURE__ */ new Set()), g = /* @__PURE__ */ Mt({}), _ = /* @__PURE__ */ H(/* @__PURE__ */ new Set()), v = /* @__PURE__ */ H(""), y = null, b = 0, x = () => ({
			ca: "va",
			va: "va",
			es: "es",
			en: "en"
		})[r.value] || "es", S = (e) => !/(^|[^A-Za-z])NC([^A-Za-z]|$)|non[- ]?commercial/i.test(e || ""), C = (e) => e.provider + ":" + e.id, w = (e) => h.value.has(e.id) ? e.items : e.items.slice(0, jo);
		async function T(e, t) {
			let n = await fetch(s + e, {
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
		function ee() {
			for (let e of Object.keys(g)) URL.revokeObjectURL(g[e]), delete g[e];
		}
		async function te(e, t) {
			await Promise.all(e.map(async (e) => {
				if (!g[C(e)]) try {
					let n = await (await T(`/api/image-banks/${e.provider}/${encodeURIComponent(e.id)}/thumbnail`, y?.signal)).blob();
					t === b && (g[C(e)] = URL.createObjectURL(n));
				} catch {}
			}));
		}
		async function E() {
			let e = l.value.trim();
			if (!e || !s) return;
			y?.abort(), y = new AbortController();
			let t = ++b;
			ee(), h.value = /* @__PURE__ */ new Set(), _.value = /* @__PURE__ */ new Set(), p.value = "", f.value = !1, d.value = !0, m.value = c.map((e) => ({
				...e,
				status: "pending",
				items: []
			})), await Promise.all(m.value.map(async (n, r) => {
				try {
					let i = new URLSearchParams({
						q: e,
						language: x()
					}), a = await (await T(`/api/image-banks/${n.id}/search?${i}`, y.signal)).json();
					if (t !== b) return;
					let o = u.value && !n.nc ? a.items.filter((e) => S(e.license)) : a.items;
					m.value[r] = {
						...n,
						status: "done",
						items: o
					}, te(o.slice(0, jo), t);
				} catch (e) {
					if (t !== b || e.name === "AbortError") return;
					e.login && (f.value = !0), m.value[r] = {
						...n,
						status: e.login ? "login" : "error",
						items: []
					};
				}
			})), t === b && (d.value = !1);
		}
		function D(e) {
			h.value = new Set(h.value).add(e.id), te(e.items, b);
		}
		async function O(e) {
			i.value ? (v.value = C(e), p.value = "", await a(async () => {
				try {
					let r = await (await T(`/api/image-banks/${e.provider}/${encodeURIComponent(e.id)}/content`)).blob(), i = r.type.split(";")[0];
					if (![
						"image/png",
						"image/jpeg",
						"image/webp"
					].includes(i)) throw Error("image_format");
					return await t.add(new File([r], "image", { type: i }), (e.title || "Imatge").slice(0, 200), "illustration", e.credit || "", e.license || ""), _.value = new Set(_.value).add(C(e)), n("rebost.banksSaved");
				} catch (e) {
					if (e.status === 401) return o(e);
					throw e.status ? e : Object.assign(/* @__PURE__ */ Error("operation_failed"), { status: 0 });
				}
			}), v.value = "") : p.value = n("rebost.banksSaveLogin");
		}
		return Xn(() => {
			y?.abort(), b++, ee();
		}), (e, t) => (Y(), X("section", lo, [
			Z("form", {
				class: "banks-search",
				onSubmit: Ga(E, ["prevent"])
			}, [
				Z("label", null, [Z("span", null, F(U(n)("rebost.search")), 1), Tn(Z("input", {
					"onUpdate:modelValue": t[0] ||= (e) => l.value = e,
					type: "search",
					maxlength: "80",
					placeholder: U(n)("rebost.banksPlaceholder")
				}, null, 8, uo), [[Fa, l.value]])]),
				Z("label", fo, [Tn(Z("input", {
					"onUpdate:modelValue": t[1] ||= (e) => u.value = e,
					type: "checkbox"
				}, null, 512), [[Ia, u.value]]), gi(" " + F(U(n)("rebost.banksFreeOnly")), 1)]),
				Z("button", {
					type: "submit",
					disabled: d.value || !l.value.trim()
				}, F(d.value ? U(n)("rebost.banksSearching") : U(n)("rebost.search")), 9, po)
			], 32),
			d.value ? (Y(), X("p", mo, F(U(n)("rebost.banksSlow")), 1)) : Q("", !0),
			f.value ? (Y(), X("p", ho, [gi(F(U(n)("rebost.banksLogin")) + " ", 1), Z("a", {
				class: "button-link secondary",
				href: U(s),
				target: "_blank",
				rel: "noopener noreferrer"
			}, F(U(n)("rebost.banksOpenEducrea")), 9, go)])) : Q("", !0),
			p.value ? (Y(), X("p", _o, F(p.value), 1)) : Q("", !0),
			(Y(!0), X(q, null, rr(m.value, (e) => (Y(), X(q, { key: e.id }, [
				Z("h3", vo, [gi(F(e.name), 1), e.status === "pending" ? (Y(), X("span", yo, " · " + F(U(n)("rebost.banksSearching")), 1)) : e.status === "error" ? (Y(), X("span", bo, " · " + F(U(n)("rebost.banksFailed")), 1)) : e.status === "done" && !e.items.length ? (Y(), X("span", xo, " · " + F(U(n)("rebost.banksEmpty")), 1)) : Q("", !0)]),
				e.items.length ? (Y(), X("div", So, [(Y(!0), X(q, null, rr(w(e), (r) => (Y(), X("article", {
					key: C(r),
					class: "bank-card"
				}, [
					Z("div", Co, [Z("img", {
						src: g[C(r)] || void 0,
						alt: r.title
					}, null, 8, wo)]),
					Z("h4", null, F(r.title), 1),
					Z("p", To, [
						S(r.license) ? Q("", !0) : (Y(), X("span", {
							key: 0,
							class: "nc-badge",
							title: U(n)("rebost.banksNcTitle")
						}, "NC", 8, Eo)),
						gi(" " + F(r.license) + " ", 1),
						r.source_url ? (Y(), X(q, { key: 1 }, [t[2] ||= gi(" · ", -1), Z("a", {
							href: r.source_url,
							target: "_blank",
							rel: "noopener noreferrer"
						}, F(e.name), 9, Do)], 64)) : Q("", !0)
					]),
					Z("div", Oo, [Z("button", {
						type: "button",
						disabled: v.value === C(r) || _.value.has(C(r)),
						onClick: (e) => O(r)
					}, F(_.value.has(C(r)) ? U(n)("rebost.banksSaved") : U(n)("rebost.banksSave")), 9, ko)])
				]))), 128))])) : Q("", !0),
				e.items.length > jo && !h.value.has(e.id) ? (Y(), X("button", {
					key: 1,
					type: "button",
					class: "secondary",
					onClick: (t) => D(e)
				}, F(U(n)("rebost.banksMore")) + " · " + F(e.name) + " (" + F(e.items.length - jo) + ")", 9, Ao)) : Q("", !0)
			], 64))), 128))
		]));
	}
};
// services/portal/src/shared/usePortalTranslations.js
function No() {
	let e = /* @__PURE__ */ H(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), Xn(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
}
// services/portal/src/rebost/RebostApp.vue
var Po = { class: "topbar" }, Fo = {
	key: 0,
	class: "brand-lockup"
}, Io = { class: "topbar-actions" }, Lo = {
	key: 0,
	id: "accountWidget"
}, Ro = { class: "single-layout rebost-layout" }, zo = { class: "role-heading" }, Bo = {
	id: "intro",
	class: "teacher-intro"
}, Vo = ["hidden"], Ho = { id: "accessHint" }, Uo = { class: "actions" }, Wo = ["target"], Go = ["target"], Ko = ["disabled", "hidden"], qo = { id: "mine" }, Jo = { class: "library-toolbar panel" }, Yo = ["aria-label"], Xo = ["aria-pressed"], Zo = ["hidden", "aria-pressed"], Qo = ["hidden", "aria-pressed"], $o = ["hidden", "aria-pressed"], es = { id: "collectionHint" }, ts = ["hidden"], ns = ["aria-label", "onKeydown"], rs = { id: "uploadText" }, is = { id: "formats" }, as = { id: "uploadTypeLabel" }, os = ["value"], ss = ["hidden"], cs = { id: "searchLabel" }, ls = ["placeholder"], us = { id: "filterLabel" }, ds = ["value"], fs = ["hidden"], ps = ["aria-label", "hidden"], ms = ["hidden"], hs = ["aria-label"], gs = ["src", "alt"];
// services/portal/src/rebost/main.js
Za({
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
		let l = /* @__PURE__ */ H(window.i18nPortal.getLang()), u = No(), d = /* @__PURE__ */ H(!1), f = /* @__PURE__ */ H(!1), p = /* @__PURE__ */ H(!1), m = /* @__PURE__ */ H([]), h = i ? "" : String(window.commonsDeployment?.bankSearchUrl || ""), g = /* @__PURE__ */ H([
			"mine",
			"catalog",
			"scratch",
			...h ? ["banks"] : []
		].includes(r.get("collection")) ? r.get("collection") : ""), _ = /* @__PURE__ */ H(""), v = /* @__PURE__ */ H(i ? a : ""), y = /* @__PURE__ */ H("sprite"), b = /* @__PURE__ */ H([]), x = /* @__PURE__ */ H(""), S = /* @__PURE__ */ H(""), C = /* @__PURE__ */ H(!1), w = /* @__PURE__ */ H(null), T = /* @__PURE__ */ H(null), ee = /* @__PURE__ */ H(""), te = /* @__PURE__ */ H(""), E = Hi(() => g.value === "mine" && !f.value), D = Hi(() => u("rebost." + (g.value || "mine"))), O = !0, k = 0, ne, re = "";
		function A() {
			l.value = window.i18nPortal.getLang();
		}
		function ie(e) {
			S.value = u("rebost." + e.message) === "rebost." + e.message ? "error" : e.message, e.status === 401 && (f.value = !1, g.value === "mine" && (k++, b.value = [], x.value = "", fe()));
		}
		async function j(e) {
			if (!p.value && O) {
				p.value = !0, S.value = "working";
				try {
					let t = await e();
					O && (S.value = typeof t == "string" ? t : "", S.value && document.getElementById("status")?.scrollIntoView({ block: "nearest" }));
				} catch (e) {
					[404, 412].includes(e.status) && await M().catch(() => {}), O && ie(e);
				} finally {
					p.value = !1;
				}
			}
		}
		async function M(e = !1) {
			let t = ++k;
			if (g.value === "banks") {
				b.value = [], x.value = "";
				return;
			}
			if (E.value) {
				b.value = [], x.value = "", fe();
				return;
			}
			let r = JSON.stringify([
				g.value,
				_.value,
				v.value
			]);
			e &&= r === re;
			let i = await n.list({
				collection: g.value,
				q: _.value,
				type: v.value,
				cursor: e ? x.value : "",
				grouped: g.value === "scratch"
			});
			O && t === k && (g.value !== "mine" || f.value) && (b.value = e ? [...b.value, ...i.items] : i.items, x.value = i.next_cursor, re = r);
		}
		async function ae(e) {
			g.value = e, _.value = "", v.value = i ? a : "", clearTimeout(ne);
			let t = new URL(location.href);
			t.searchParams.set("collection", e), history.replaceState(null, "", t), b.value = [], x.value = "", await M();
		}
		function oe() {
			clearTimeout(ne), ne = setTimeout(async () => {
				O && (p.value ? oe() : await j(() => M()));
			}, 250);
		}
		async function se(e) {
			i || E.value || g.value !== "mine" || !d.value || await j(async () => {
				try {
					for (let t of e) await n.add(t, t.name.replace(/\.[^.]+$/, "").slice(0, 200) || "Imatge", y.value);
				} catch (e) {
					throw await M().catch(() => {}), e;
				}
				try {
					await M();
				} catch (e) {
					return ie(e), "saved_refresh_failed";
				}
				return "image_saved";
			});
		}
		function ce() {
			d.value && !p.value && w.value.click();
		}
		function le(e) {
			let t = [...e.target.files];
			e.target.value = "", se(t);
		}
		function ue(e) {
			C.value = !1, se([...e.dataTransfer.files]);
		}
		function N() {
			URL.revokeObjectURL(ee.value), ee.value = "", te.value = "";
		}
		function fe() {
			T.value?.close(), N();
		}
		async function pe(e, t) {
			let r = await n.read(e.id);
			O && (e.collection !== "mine" || f.value) && (N(), ee.value = URL.createObjectURL(r), te.value = t, T.value.showModal());
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
			i && e.key === "Escape" && !T.value?.open && window.parent.postMessage({
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
		async function P() {
			if (d.value && !p.value && !_e && O) {
				_e = !0;
				try {
					let e;
					try {
						await n.me(), e = !0;
					} catch (t) {
						if (t.status !== 401) throw t;
						e = !1;
					}
					if (!O || e === f.value) return;
					f.value = e, e || (k++, b.value = [], x.value = "", fe()), await j(() => M());
				} catch (e) {
					O && ie(e);
				} finally {
					_e = !1;
				}
			}
		}
		function ve(e) {
			e.persisted || (k++, b.value = [], N());
		}
		return Dn("rebost", {
			api: n,
			t: u,
			locale: l,
			authenticated: f,
			picking: i,
			familySelection: o,
			types: s,
			run: j,
			refresh: M,
			chooseCollection: ae,
			preview: pe,
			select: me,
			download: ge,
			report: ie
		}), Yn(async () => {
			document.body.classList.toggle("picking", i), window.addEventListener("edutictac:langchange", A), window.addEventListener("focus", P), window.addEventListener("edutictac:sessionchange", P), window.addEventListener("pagehide", ve), document.addEventListener("keydown", he), await j(async () => {
				let e;
				try {
					e = await n.me(), f.value = !0;
				} catch (t) {
					if (t.status !== 401) throw t;
					e = await n.catalogs();
				}
				m.value = e.capabilities, g.value ||= f.value ? "mine" : "catalog", (g.value === "catalog" && !m.value.includes("catalog") || g.value === "scratch" && !m.value.includes("scratch_catalog")) && (g.value = "mine"), d.value = !0, await M();
			});
		}), Xn(() => {
			O = !1, k++, clearTimeout(ne), N(), window.removeEventListener("edutictac:langchange", A), window.removeEventListener("focus", P), window.removeEventListener("edutictac:sessionchange", P), window.removeEventListener("pagehide", ve), document.removeEventListener("keydown", he), document.body.classList.remove("picking");
		}), (e, t) => (Y(), X(q, null, [Z("header", Po, [U(i) ? Q("", !0) : (Y(), X("div", Fo, [...t[13] ||= [Z("img", {
			src: "/commons-mark.svg",
			alt: "",
			width: "46",
			height: "46"
		}, null, -1), Z("div", null, [Z("p", { class: "eyebrow" }, "EduTicTac Commons"), Z("h1", null, "EduTicTac Rebost")], -1)]])), Z("div", Io, [U(i) ? (Y(), X("p", {
			key: 1,
			id: "sessionStatus",
			class: de(["status session-status", { signed: f.value }]),
			role: "status"
		}, F(d.value ? f.value ? U(u)("rebost.signedIn") : U(u)("rebost.signedOut") : U(u)("rebost.checkingSession")), 3)) : (Y(), X("edutictac-account", Lo))])]), Z("main", Ro, [
			Z("div", zo, [
				t[14] ||= Z("p", { class: "eyebrow" }, "EduTicTac Rebost", -1),
				Z("h2", null, F(U(u)("rebost.heading")), 1),
				Z("p", Bo, F(U(u)("rebost.intro")), 1)
			]),
			Z("p", {
				id: "status",
				class: de({
					success: ["success", "image_saved"].includes(S.value),
					error: S.value && ![
						"success",
						"image_saved",
						"working"
					].includes(S.value)
				}),
				role: "status",
				"aria-live": "polite"
			}, F(S.value ? U(u)("rebost." + S.value) : ""), 3),
			Z("section", {
				id: "access",
				class: "panel",
				hidden: !d.value || f.value || U(i) && g.value !== "mine"
			}, [Z("p", Ho, F(U(u)("rebost.access")), 1), Z("div", Uo, [Z("a", {
				class: "button-link secondary",
				id: "studentLogin",
				href: "/student.html?next=%2Fassets%2F",
				target: U(i) ? "_blank" : void 0,
				rel: "noopener noreferrer"
			}, F(U(u)("rebost.student")), 9, Wo), Z("a", {
				class: "button-link",
				id: "oidcLogin",
				href: "/api/auth/oidc/login?next=%2Fassets%2F",
				target: U(i) ? "_blank" : void 0,
				rel: "noopener noreferrer"
			}, F(U(u)("rebost.oidc")), 9, Go)])], 8, Vo),
			Z("fieldset", {
				id: "controls",
				disabled: p.value || !d.value,
				hidden: !d.value
			}, [
				Z("legend", qo, F(D.value), 1),
				Z("div", Jo, [
					Z("div", {
						id: "collections",
						class: "collections",
						role: "group",
						"aria-label": U(u)("rebost.collection")
					}, [
						Z("button", {
							id: "mineTab",
							class: "secondary",
							type: "button",
							"aria-pressed": g.value === "mine",
							onClick: t[0] ||= (e) => j(() => ae("mine"))
						}, F(U(u)("rebost.mine")) + F(f.value ? "" : " · " + U(u)("common.login")), 9, Xo),
						Z("button", {
							id: "catalogTab",
							class: "secondary",
							type: "button",
							hidden: !m.value.includes("catalog"),
							"aria-pressed": g.value === "catalog",
							onClick: t[1] ||= (e) => j(() => ae("catalog"))
						}, F(U(u)("rebost.catalog")), 9, Zo),
						Z("button", {
							id: "banksTab",
							class: "secondary",
							type: "button",
							hidden: !U(h),
							"aria-pressed": g.value === "banks",
							onClick: t[2] ||= (e) => j(() => ae("banks"))
						}, F(U(u)("rebost.banks")), 9, Qo),
						Z("button", {
							id: "scratchTab",
							class: "secondary",
							type: "button",
							hidden: !m.value.includes("scratch_catalog"),
							"aria-pressed": g.value === "scratch",
							onClick: t[3] ||= (e) => j(() => ae("scratch"))
						}, F(U(u)("rebost.scratch")), 9, $o)
					], 8, Yo),
					Z("p", es, F(U(i) ? U(u)("rebost.pickHint") : g.value === "mine" ? U(u)("rebost.privateHint") : g.value === "banks" ? U(u)("rebost.banksHint") : g.value === "scratch" ? U(u)("rebost.scratchHint") : U(u)("rebost.catalogHint")), 1),
					Z("div", {
						id: "uploadArea",
						hidden: U(i) || g.value !== "mine" || !f.value
					}, [Z("section", {
						id: "drop",
						tabindex: "0",
						role: "button",
						"aria-label": U(u)("rebost.upload"),
						class: de({ drag: C.value }),
						onClick: ce,
						onKeydown: [qa(Ga(ce, ["self", "prevent"]), ["enter"]), qa(Ga(ce, ["self", "prevent"]), ["space"])],
						onDragenter: t[5] ||= Ga((e) => C.value = !0, ["prevent"]),
						onDragover: t[6] ||= Ga((e) => C.value = !0, ["prevent"]),
						onDragleave: t[7] ||= (e) => C.value = !1,
						onDrop: Ga(ue, ["prevent"])
					}, [
						Z("strong", rs, F(U(u)("rebost.upload")), 1),
						Z("p", is, F(U(u)("rebost.formats")), 1),
						Z("input", {
							id: "files",
							ref_key: "filesInput",
							ref: w,
							type: "file",
							accept: "image/png,image/jpeg,image/webp",
							multiple: "",
							hidden: "",
							onClick: t[4] ||= Ga(() => {}, ["stop"]),
							onChange: le
						}, null, 544)
					], 42, ns), Z("label", null, [Z("span", as, F(U(u)("rebost.uploadType")), 1), Tn(Z("select", {
						id: "uploadType",
						"onUpdate:modelValue": t[8] ||= (e) => y.value = e
					}, [(Y(), X(q, null, rr(s, (e) => Z("option", {
						key: e,
						value: e
					}, F(U(u)("rebost." + e)), 9, os)), 64))], 512), [[Ra, y.value]])])], 8, ts),
					Z("div", {
						class: "filters",
						hidden: E.value || g.value === "banks"
					}, [Z("label", null, [Z("span", cs, F(U(u)("rebost.search")), 1), Tn(Z("input", {
						id: "search",
						"onUpdate:modelValue": t[9] ||= (e) => _.value = e,
						type: "search",
						placeholder: U(u)("rebost.searchPlaceholder"),
						maxlength: "200",
						onInput: oe
					}, null, 40, ls), [[Fa, _.value]])]), Z("label", null, [Z("span", us, F(U(u)("rebost.filter")), 1), Tn(Z("select", {
						id: "filter",
						"onUpdate:modelValue": t[10] ||= (e) => v.value = e,
						onChange: t[11] ||= (e) => j(() => M())
					}, [(Y(!0), X(q, null, rr(U(c), (e) => (Y(), X("option", {
						key: e,
						value: e
					}, F(e ? U(u)("rebost." + e) : U(u)("rebost.all")), 9, ds))), 128))], 544), [[Ra, v.value]])])], 8, ss)
				]),
				g.value === "banks" && U(h) ? (Y(), si(Mo, { key: 0 })) : Q("", !0),
				Z("p", {
					id: "empty",
					hidden: E.value || g.value === "banks" || b.value.length > 0 || p.value
				}, F(U(u)("rebost.empty")), 9, fs),
				Z("section", {
					id: "grid",
					"aria-label": D.value,
					hidden: E.value || g.value === "banks"
				}, [(Y(!0), X(q, null, rr(b.value, (e) => (Y(), si(co, {
					key: e.id,
					item: e
				}, null, 8, ["item"]))), 128))], 8, ps),
				Z("button", {
					id: "more",
					type: "button",
					hidden: E.value || g.value === "banks" || !x.value,
					onClick: t[12] ||= (e) => j(() => M(!0))
				}, F(U(u)("rebost.more")), 9, ms)
			], 8, Ko),
			Z("dialog", {
				id: "preview",
				ref_key: "dialog",
				ref: T,
				"aria-label": U(u)("rebost.view"),
				onClose: N
			}, [Z("button", {
				id: "closePreview",
				type: "button",
				onClick: fe
			}, F(U(u)("rebost.close")), 1), Z("img", {
				id: "previewImage",
				src: ee.value || void 0,
				alt: te.value
			}, null, 8, gs)], 40, hs)
		])], 64));
	}
}).mount("#rebost");
