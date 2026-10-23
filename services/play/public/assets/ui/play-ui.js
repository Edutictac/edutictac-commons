// node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), E = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ee = /-\w/g, D = E((e) => e.replace(ee, (e) => e.slice(1).toUpperCase())), te = /\B([A-Z])/g, O = E((e) => e.replace(te, "-$1").toLowerCase()), k = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), ne = E((e) => e ? `on${k(e)}` : ""), A = (e, t) => !Object.is(e, t), re = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ie = (e, t, n, r = !1) => {
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
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? de(r) : ce(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var j = /;(?![^(]*\))/g, le = /:([^]+)/, ue = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function de(e) {
	let t = {};
	return e.replace(ue, (e) => e.startsWith("/*") ? "" : e).split(j).forEach((e) => {
		if (e) {
			let n = e.split(le);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function M(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = M(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var fe = /* @__PURE__ */ e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function N(e) {
	return !!e || e === "";
}
function pe(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = P(e[i], t[i], n);
	return r;
}
function me(e, t, n) {
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
function he(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? me(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !P(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ge(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function P(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? ge(e, t, n, pe) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : ge(e, t, n, he) : String(e) === String(t))));
}
function _e(e, t) {
	return e.findIndex((e) => P(e, t));
}
var ve = (e) => !!(e && e.__v_isRef === !0), F = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? ve(e) ? F(e.value) : JSON.stringify(e, ye, 2) : String(e), ye = (e, t) => ve(t) ? ye(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[be(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => be(e)) } : _(t) ? be(t) : v(t) && !d(t) && !C(t) ? String(t) : t, be = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, I, xe = class {
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
function Se() {
	return I;
}
var L, Ce = /* @__PURE__ */ new WeakSet(), we = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, I && (I.active ? I.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ce.has(this) && (Ce.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Oe(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ve(this), je(this);
		let e = L, t = Le;
		L = this, Le = !0;
		try {
			return this.fn();
		} finally {
			Me(this), L = e, Le = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Fe(e);
			this.deps = this.depsTail = void 0, Ve(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ce.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ne(this) && this.run();
	}
	get dirty() {
		return Ne(this);
	}
}, Te = 0, Ee, De;
function Oe(e, t = !1) {
	e.flags |= 8, t ? (e.next = De, De = e) : (e.next = Ee, Ee = e);
}
function ke() {
	Te++;
}
function Ae() {
	if (--Te > 0) return;
	if (De) {
		let e = De;
		for (De = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ee;) {
		let t = Ee;
		for (Ee = void 0; t;) {
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
function je(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Me(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Fe(r), Ie(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ne(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Pe(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Pe(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === He) || (e.globalVersion = He, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ne(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = L, r = Le;
	L = e, Le = !0;
	try {
		je(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		L = n, Le = r, Me(e), e.flags &= -3;
	}
}
function Fe(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Fe(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ie(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Le = !0, Re = [];
function ze() {
	Re.push(Le), Le = !1;
}
function Be() {
	let e = Re.pop();
	Le = e === void 0 || e;
}
function Ve(e) {
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
var He = 0, Ue = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, We = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!L || !Le || L === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== L) t = this.activeLink = new Ue(L, this), L.deps ? (t.prevDep = L.depsTail, L.depsTail.nextDep = t, L.depsTail = t) : L.deps = L.depsTail = t, Ge(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = L.depsTail, t.nextDep = void 0, L.depsTail.nextDep = t, L.depsTail = t, L.deps === t && (L.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, He++, this.notify(e);
	}
	notify(e) {
		ke();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ae();
		}
	}
};
function Ge(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ge(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ke = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ Symbol(""), Je = /* @__PURE__ */ Symbol(""), Ye = /* @__PURE__ */ Symbol("");
function R(e, t, n) {
	if (Le && L) {
		let t = Ke.get(e);
		t || Ke.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new We()), r.map = t, r.key = n), r.track();
	}
}
function Xe(e, t, n, r, i, a) {
	let o = Ke.get(e);
	if (!o) {
		He++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (ke(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ye || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ye)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(qe)), f(e) && s(o.get(Je)));
				break;
			case "delete":
				i || (s(o.get(qe)), f(e) && s(o.get(Je)));
				break;
			case "set": f(e) && s(o.get(qe));
		}
	}
	Ae();
}
function Ze(e) {
	let t = /* @__PURE__ */ z(e);
	return t === e || (R(t, "iterate", Ye), /* @__PURE__ */ Lt(e)) ? t : /* @__PURE__ */ It(e) ? /* @__PURE__ */ Ft(e) ? t.map((e) => Vt(Bt(e))) : t.map(Vt) : t.map(Bt);
}
function Qe(e) {
	return R(e = /* @__PURE__ */ z(e), "iterate", Ye), e;
}
function $e(e, t) {
	return /* @__PURE__ */ It(e) ? Vt(/* @__PURE__ */ Ft(e) ? Bt(t) : t) : Bt(t);
}
var et = {
	__proto__: null,
	[Symbol.iterator]() {
		return tt(this, Symbol.iterator, (e) => $e(this, e));
	},
	concat(...e) {
		return Ze(this).concat(...e.map((e) => d(e) ? Ze(e) : e));
	},
	entries() {
		return tt(this, "entries", (e) => (e[1] = $e(this, e[1]), e));
	},
	every(e, t) {
		return it(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return it(this, "filter", e, t, (e) => e.map((e) => $e(this, e)), arguments);
	},
	find(e, t) {
		return it(this, "find", e, t, (e) => $e(this, e), arguments);
	},
	findIndex(e, t) {
		return it(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return it(this, "findLast", e, t, (e) => $e(this, e), arguments);
	},
	findLastIndex(e, t) {
		return it(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return it(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ot(this, "includes", e);
	},
	indexOf(...e) {
		return ot(this, "indexOf", e);
	},
	join(e) {
		return Ze(this).join(e);
	},
	lastIndexOf(...e) {
		return ot(this, "lastIndexOf", e);
	},
	map(e, t) {
		return it(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return st(this, "pop");
	},
	push(...e) {
		return st(this, "push", e);
	},
	reduce(e, ...t) {
		return at(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return at(this, "reduceRight", e, t);
	},
	shift() {
		return st(this, "shift");
	},
	some(e, t) {
		return it(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return st(this, "splice", e);
	},
	toReversed() {
		return Ze(this).toReversed();
	},
	toSorted(e) {
		return Ze(this).toSorted(e);
	},
	toSpliced(...e) {
		return Ze(this).toSpliced(...e);
	},
	unshift(...e) {
		return st(this, "unshift", e);
	},
	values() {
		return tt(this, "values", (e) => $e(this, e));
	}
};
function tt(e, t, n) {
	let r = Qe(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ Lt(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => nt(a.next(), n), i !== rt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => nt(a._next(), n);
	}
	return a;
}
function nt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var rt = Array.prototype;
function it(e, t, n, r, i, a) {
	let o = Qe(e), s = o !== e && !/* @__PURE__ */ Lt(e), c = o[t];
	if (c !== rt[t]) {
		let t = c.apply(e, a);
		return s ? Bt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, $e(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function at(e, t, n, r) {
	let i = Qe(e), a = i !== e && !/* @__PURE__ */ Lt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = $e(e, t)), n.call(this, t, $e(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? $e(e, c) : c;
}
function ot(e, t, n) {
	let r = /* @__PURE__ */ z(e);
	R(r, "iterate", Ye);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Rt(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), r[t](...n)) : i;
}
function st(e, t, n = []) {
	ze(), ke();
	let r = (/* @__PURE__ */ z(e))[t].apply(e, n);
	return Ae(), Be(), r;
}
var ct = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), lt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function ut(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ z(this);
	return R(t, "has", e), t.hasOwnProperty(e);
}
var dt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? kt : Ot : i ? Dt : Et).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = et[t])) return e;
			if (t === "hasOwnProperty") return ut;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ B(e) ? e : n);
		if ((_(t) ? lt.has(t) : ct(t)) || (r || R(e, "get", t), i)) return o;
		if (/* @__PURE__ */ B(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Nt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Nt(o) : /* @__PURE__ */ jt(o) : o;
	}
}, ft = class extends dt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ It(i);
			if (!/* @__PURE__ */ Lt(n) && !/* @__PURE__ */ It(n) && (i = /* @__PURE__ */ z(i), n = /* @__PURE__ */ z(n)), !a && /* @__PURE__ */ B(i) && !/* @__PURE__ */ B(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ B(e) ? e : r);
		return e === /* @__PURE__ */ z(r) && s && (o ? A(n, i) && Xe(e, "set", t, n, i) : Xe(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Xe(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && lt.has(t) || R(e, "has", t), n;
	}
	ownKeys(e) {
		return R(e, "iterate", d(e) ? "length" : qe), Reflect.ownKeys(e);
	}
}, pt = class extends dt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, mt = /* @__PURE__ */ new ft(), ht = /* @__PURE__ */ new pt(), gt = /* @__PURE__ */ new ft(!0), _t = (e) => e, vt = (e) => Reflect.getPrototypeOf(e);
function yt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ z(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? _t : t ? Vt : Bt;
		return !t && R(a, "iterate", l ? Je : qe), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function bt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function xt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ z(r), a = /* @__PURE__ */ z(n);
			e || (A(n, a) && R(i, "get", n), R(i, "get", a));
			let { has: o } = vt(i), s = t ? _t : e ? Vt : Bt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && R(/* @__PURE__ */ z(t), "iterate", qe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ z(n), i = /* @__PURE__ */ z(t);
			return e || (A(t, i) && R(r, "has", t), R(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ z(a), s = t ? _t : e ? Vt : Bt;
			return !e && R(o, "iterate", qe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: bt("add"),
		set: bt("set"),
		delete: bt("delete"),
		clear: bt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ z(this), r = vt(n), i = /* @__PURE__ */ z(e), a = !t && !/* @__PURE__ */ Lt(e) && !/* @__PURE__ */ It(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), Xe(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Lt(n) || /* @__PURE__ */ It(n) || (n = /* @__PURE__ */ z(n));
			let r = /* @__PURE__ */ z(this), { has: i, get: a } = vt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ z(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && Xe(r, "set", e, n, s) : Xe(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ z(this), { has: n, get: r } = vt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ z(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Xe(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ z(this), t = e.size !== 0, n = e.clear();
			return t && Xe(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = yt(r, e, t);
	}), n;
}
function St(e, t) {
	let n = xt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
}
var Ct = { get: /* @__PURE__ */ St(!1, !1) }, wt = { get: /* @__PURE__ */ St(!1, !0) }, Tt = { get: /* @__PURE__ */ St(!0, !1) }, Et = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap();
function At(e) {
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
function jt(e) {
	return /* @__PURE__ */ It(e) ? e : Pt(e, !1, mt, Ct, Et);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return Pt(e, !1, gt, wt, Dt);
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
	return Pt(e, !0, ht, Tt, Ot);
}
function Pt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = At(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return /* @__PURE__ */ It(e) ? /* @__PURE__ */ Ft(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ z(t) : e;
}
function zt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && ie(e, "__v_skip", !0), e;
}
var Bt = (e) => v(e) ? /* @__PURE__ */ jt(e) : e, Vt = (e) => v(e) ? /* @__PURE__ */ Nt(e) : e;
// @__NO_SIDE_EFFECTS__
function B(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function V(e) {
	return Ht(e, !1);
}
function Ht(e, t) {
	return /* @__PURE__ */ B(e) ? e : new Ut(e, t);
}
var Ut = class {
	constructor(e, t) {
		this.dep = new We(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ z(e), this._value = t ? e : Bt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Lt(e) || /* @__PURE__ */ It(e);
		e = n ? e : /* @__PURE__ */ z(e), A(e, t) && (this._rawValue = e, this._value = n ? e : Bt(e), this.dep.trigger());
	}
};
function H(e) {
	return /* @__PURE__ */ B(e) ? e.value : e;
}
var Wt = {
	get: (e, t, n) => t === "__v_raw" ? e : H(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ B(i) && !/* @__PURE__ */ B(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Gt(e) {
	return /* @__PURE__ */ Ft(e) ? e : new Proxy(e, Wt);
}
var Kt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new We(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = He - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && L !== this) return Oe(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Pe(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function qt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Kt(r, i, n);
}
var Jt = {}, Yt = /* @__PURE__ */ new WeakMap(), Xt = void 0;
function Zt(e, t = !1, n = Xt) {
	if (n) {
		let t = Yt.get(n);
		t || Yt.set(n, t = []), t.push(e);
	}
}
function Qt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Lt(e) || o === !1 || o === 0 ? $t(e, 1) : $t(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ B(e) ? (g = () => e.value, y = /* @__PURE__ */ Lt(e)) : /* @__PURE__ */ Ft(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Ft(e) || /* @__PURE__ */ Lt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ B(e)) return e.value;
		if (/* @__PURE__ */ Ft(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			ze();
			try {
				_();
			} finally {
				Be();
			}
		}
		let t = Xt;
		Xt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Xt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => $t(e(), t);
	}
	let x = Se(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			try {
				return e(...t);
			} finally {
				S();
			}
		};
	}
	let C = b ? Array(e.length).fill(Jt) : Jt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => A(e, C[t])) : A(t, C))) {
					let e = Xt;
					ze();
					try {
						_ && _(), Xt = m;
						let e = [
							t,
							C === Jt ? void 0 : b && C[0] === Jt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Xt = e, Be();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new we(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Zt(e, !1, m), _ = m.onStop = () => {
		let e = Yt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Yt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function $t(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ B(e)) $t(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) $t(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		$t(e, t, n);
	});
	else if (C(e)) {
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
	if (h(e)) {
		let i = en(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			nn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(tn(e[a], t, n, r));
		return i;
	}
}
function nn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			ze(), en(o, null, 10, [
				e,
				i,
				a
			]), Be();
			return;
		}
	}
	rn(e, r, a, i, s);
}
function rn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var U = [], an = -1, on = [], sn = null, cn = 0, ln = /* @__PURE__ */ Promise.resolve(), un = null;
function dn(e) {
	let t = un || ln;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function fn(e) {
	let t = an + 1, n = U.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = U[r], a = bn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function pn(e) {
	if (!(e.flags & 1)) {
		let t = bn(e), n = U[U.length - 1];
		!n || !(e.flags & 2) && t >= bn(n) ? U.push(e) : U.splice(fn(t), 0, e), e.flags |= 1, mn();
	}
}
function mn() {
	un ||= ln.then(xn);
}
function hn(e) {
	if (!d(e)) sn && e.id === -1 ? sn.splice(cn + 1, 0, e) : e.flags & 1 || (on.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) on.push(e[t]);
	mn();
}
function gn(e, t, n, r = an + 1) {
	for (; r < U.length; r++) {
		let n = U[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			U.splice(r, 1), r = e ? r - 1 : an, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
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
		for (an = 0; an < U.length; an++) {
			let e = U[an];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), en(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; an < U.length; an++) {
			let e = U[an];
			e && (e.flags &= -2);
		}
		an = -1, U.length = 0, _n(e), un = null, (U.length || on.length) && xn(e);
	}
}
var W = null, Sn = null;
function Cn(e) {
	let t = W;
	return W = e, Sn = e && e.type.__scopeId || null, t;
}
function wn(e, t = W, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ei(-1);
		let i = Cn(t), a = Xr.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Xr.length; e > a; e--) Qr();
			Cn(i), r._d && ei(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function G(e, n) {
	if (W === null) return e;
	let r = Fi(W), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
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
		c && (ze(), tn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Be());
	}
}
function En(e, t, n = !1) {
	let r = Si();
	if (r || ar) {
		let i = ar ? ar._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Dn = /* @__PURE__ */ Symbol.for("v-scx"), On = () => En(Dn);
function kn(e, t, n) {
	return An(e, t, n);
}
function An(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Oi) {
		if (c === "sync") {
			let e = On();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = xi;
	u.call = (e, t, n) => tn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		e.i = p, q(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : pn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Qt(e, n, u);
	return Oi && (f ? f.push(h) : d && h()), h;
}
var jn = /* @__PURE__ */ Symbol("_vte"), Mn = (e) => e.__isTeleport, Nn = /* @__PURE__ */ Symbol("_leaveCb");
function Pn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Jr) {
			t = n;
			break;
		}
	}
	return t;
}
function Fn(e) {
	if (!Wn(e)) return Mn(e.type) && e.children ? Pn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function In(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		In(Mn(n.type) && Fn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === J && d(e.children)) {
		let n = dr(e.children, !1);
		n && In(n, t);
	}
}
function Ln(e) {
	if (e.component) return Ln(e.component.subTree);
	if (e.type === J) {
		let t = d(e.children) && dr(e.children, !1);
		return t ? Ln(t) : void 0;
	}
	if (e.type !== Jr) return e;
}
function Rn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function zn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Bn = /* @__PURE__ */ new WeakMap();
function Vn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Vn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Un(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Vn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Fi(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ z(v), b = v === t ? i : (e) => !zn(_, e) && u(y, e), x = (e, t) => !(t && zn(_, t));
	if (m != null && m !== p) {
		if (Hn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ B(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) en(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ B(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), Bn.delete(e);
				};
				t.id = -1, Bn.set(e, t), q(t, r);
			} else Hn(e), i();
		}
	}
}
function Hn(e) {
	let t = Bn.get(e);
	t && (t.flags |= 8, Bn.delete(e));
}
se().requestIdleCallback, se().cancelIdleCallback;
var Un = (e) => !!e.type.__asyncLoader, Wn = (e) => e.type.__isKeepAlive;
function Gn(e, t, n = xi, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			ze();
			let i = Ti(n), a = tn(t, n, e, r);
			return i(), Be(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Kn = (e) => (t, n = xi) => {
	Oi && e !== "sp" || Gn(e, (...e) => t(...e), n);
}, qn = Kn("m"), Jn = Kn("bum"), Yn = /* @__PURE__ */ Symbol.for("v-ndc");
function K(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Ft(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Lt(e), s = /* @__PURE__ */ It(e), e = Qe(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Vt(Bt(e[n])) : Bt(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (v(e)) {
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
function Xn(e, t, n, r, i, a) {
	if (n ??= {}, W.ce || W.parent && Un(W.parent) && W.parent.ce) {
		let e = a != null && n.key == null ? s({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), Y(), ni(J, null, [si("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let c = Xr.length;
	Y();
	let l;
	try {
		let i = o && Zn(o(n)), s = n.key || a || i && i.key;
		l = ni(J, { key: (s && !_(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Xr.length; e > c; e--) Qr();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), l;
}
function Zn(e) {
	return e.some((e) => !ri(e) || !(e.type === Jr || e.type === J && !Zn(e.children))) ? e : null;
}
var Qn = (e) => e ? Di(e) ? Fi(e) : Qn(e.parent) : null, $n = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Qn(e.parent),
	$root: (e) => Qn(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		pn(e.update);
	},
	$nextTick: (e) => e.n ||= dn.bind(e.proxy),
	$watch: (e) => r
}), er = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), tr = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (er(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = $n[n], f, p;
		if (d) return n === "$attrs" && R(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return er(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || er(t, s) || u(a, s) || u(r, s) || u($n, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function nr() {
	return {
		app: null,
		config: {
			isNativeTag: i,
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
var rr = 0;
function ir(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = nr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: rr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ri,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
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
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || si(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Fi(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (tn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = ar;
				ar = l;
				try {
					return e();
				} finally {
					ar = t;
				}
			}
		};
		return l;
	};
}
var ar = null, or = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function sr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && or(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(ae)));
	let c, l = i[c = ne(n)] || i[c = ne(D(n))];
	!l && o && (l = i[c = ne(O(n))]), l && tn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, tn(u, e, 6, a);
	}
}
function cr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function lr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, O(t)) || u(e, t));
}
function ur(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Cn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = fi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = fi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : fr(c);
		}
	} catch (t) {
		Xr.length = 0, nn(t, e, 1), v = si(Jr);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = pr(y, a)), b = ui(b, y, !1, !0));
	}
	return n.dirs && (b = ui(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && In(Mn(b.type) && Fn(b) || b, n.transition), v = b, Cn(_), v;
}
function dr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ri(r)) {
			if (r.type !== Jr || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var fr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, pr = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function mr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? hr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (gr(o, r, n) && !lr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || hr(r, o, l) : !!o;
	return !1;
}
function hr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!u(e, a) || gr(t, e, a) && !lr(n, a)) return !0;
	}
	return !1;
}
function gr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !P(r, i) : r !== i;
}
function _r({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var vr = {}, yr = () => Object.create(vr), br = (e) => Object.getPrototypeOf(e) === vr;
function xr(e, t, n, r = !1) {
	let i = {}, a = yr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Cr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Mt(i) : e.type.props ? i : a, e.attrs = a;
}
function Sr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ z(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (lr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = D(o);
						i[t] = wr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Cr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = O(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = wr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && Xe(e.attrs, "set", "");
}
function Cr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = D(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : lr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ z(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = wr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function wr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ti(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === O(n)) && (r = !0));
	}
	return r;
}
function Tr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = D(c[e]);
		Er(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = D(e);
		if (Er(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let p = [l, f];
	return v(e) && a.set(e, p), p;
}
function Er(e) {
	return e[0] !== "$" && !T(e);
}
var Dr = (e) => e === "_" || e === "_ctx" || e === "$stable", Or = (e) => d(e) ? e.map(fi) : [fi(e)], kr = (e, t, n) => {
	if (t._n) return t;
	let r = wn((...e) => Or(t(...e)), n);
	return r._c = !1, r;
}, Ar = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Dr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = kr(n, i, r);
		else if (i != null) {
			let e = Or(i);
			t[n] = () => e;
		}
	}
}, jr = (e, t) => {
	let n = Or(t);
	e.slots.default = () => n;
}, Mr = (e, t, n) => {
	for (let r in t) (n || !Dr(r)) && (e[r] = t[r]);
}, Nr = (e, t, n) => {
	let r = e.slots = yr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Mr(r, t, n), n && ie(r, "_", e, !0)) : Ar(t, r);
	} else t && jr(e, t);
}, Pr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Mr(a, n, r) : (o = !n.$stable, Ar(n, a)), s = n;
	} else n && (jr(e, n), s = { default: 1 });
	if (o) for (let e in a) !Dr(e) && s[e] == null && delete a[e];
}, q = Kr;
function Fr(e) {
	return Ir(e);
}
function Ir(e, i) {
	let a = se();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ii(e, t) && (i = he(e), M(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case qr:
				y(e, t, r, i);
				break;
			case Jr:
				b(e, t, r, i);
				break;
			case Yr:
				e ?? x(t, r, i, s);
				break;
			case J:
				ne(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? A(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, P);
		}
		d != null && a ? Vn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Vn(e.ref, null, o, e, !0);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) E(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), te(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, E = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, Lr(e, a), s, u), _ && Tn(e, null, r, "created"), ee(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && gi(f, r, e);
		}
		_ && Tn(e, null, r, "beforeMount");
		let v = zr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && q(() => {
			try {
				f && gi(f, r, e), v && g.enter(d), _ && Tn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ee = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Gr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? pi(e[l]) : fi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, te = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Rr(r, !1), (g = h.onVnodeBeforeUpdate) && gi(g, r, n, e), f && Tn(n, e, r, "beforeUpdate"), r && Rr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, Lr(n, a), o) : s || j(e, n, l, null, r, i, Lr(n, a), o, !1), u > 0) {
			if (u & 16) k(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && k(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && q(() => {
			g && gi(g, r, n, e), f && Tn(n, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Wr(c), d = u && (c.type === J || !ii(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, k = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ne = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Br(e, t, !0)) : j(e, t, n, f, i, a, s, c, l);
	}, A = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ie(t, n, r, i, a, o, c) : ae(e, t, c);
	}, ie = (e, t, n, r, i, a, o) => {
		let s = e.component = bi(e, r, i);
		if (Wn(e) && (s.ctx.renderer = P), ki(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, oe, o, a), !e.el) {
				let r = s.subTree = si(Jr);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else oe(s, e, t, n, i, a, o);
	}, ae = (e, t, n) => {
		let r = t.component = e.component;
		if (mr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ce(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, oe = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Hr(e);
					if (n) {
						t && (t.el = c.el, ce(e, t, o)), n.asyncDep.then(() => {
							q(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Rr(e, !1), t ? (t.el = c.el, ce(e, t, o)) : t = c, n && re(n), (d = t.props && t.props.onVnodeBeforeUpdate) && gi(d, s, t, c), Rr(e, !0);
				let f = ur(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), he(p), e, i, a), t.el = f.el, u === null && _r(e, f.el), r && q(r, i), (d = t.props && t.props.onVnodeUpdated) && q(() => gi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Un(t);
				if (Rr(e, !1), l && re(l), !m && (o = c && c.onVnodeBeforeMount) && gi(o, d, t), Rr(e, !0), s && ve) {
					let t = () => {
						e.subTree = ur(e), ve(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ur(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && q(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					q(() => gi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Un(d.vnode) && d.vnode.shapeFlag & 256) && e.a && q(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new we(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => pn(u), Rr(e, !0), l();
	}, ce = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Sr(e, t.props, r, n), Pr(e, t.children, n), ze(), gn(e), Be();
	}, j = (e, t, n, r, i, a, o, s, c = !1) => {
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
		m & 8 ? (u & 16 && me(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ue(l, d, n, r, i, a, o, s, c) : me(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, le = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? pi(t[p]) : fi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? me(e, a, o, !0, !1, f) : D(t, r, i, a, o, s, c, l, f);
	}, ue = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? pi(t[u]) : fi(t[u]);
			if (ii(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? pi(t[p]) : fi(t[p]);
			if (ii(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? pi(t[u]) : fi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) M(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? pi(t[u]) : fi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					M(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ii(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? M(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Vr(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Wr(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? de(n, r, p, 2) : _--);
			}
		}
	}, de = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) de(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, P);
		else if (c === J) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === Yr) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Nn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), q(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Nn];
					a._isLeaving && a[Nn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, M = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (ze(), Vn(s, null, n, e, !0), Be()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Un(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && gi(_, t, e), u & 6) pe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Tn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, P, r) : l && !l.hasOnce && (a !== J || d > 0 && d & 64) ? me(l, t, n, !1, !0) : (a === J && d & 384 || !i && u & 16) && me(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && q(() => {
			_ && gi(_, t, e), h && Tn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === J;
		if (a && !i) {
			N(n, r);
			return;
		}
		if (t === Yr) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Ln(e) : e, c = () => {
			a ? m(n) && N(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, N = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, pe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ur(c), Ur(l), r && re(r), i.stop(), a ? (a.flags |= 8, M(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, M(o, e, t, n)), s && q(s, t), q(() => {
			e.isUnmounted = !0;
		}, t);
	}, me = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) M(e[o], t, n, r, i);
	}, he = (e) => {
		if (e.shapeFlag & 6) return he(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[jn];
		return n ? h(n) : t;
	}, ge = (e, t, n) => {
		yn(() => {
			e == null ? t._vnode && M(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : yi());
	}, P = {
		p: v,
		um: M,
		m: de,
		r: fe,
		mt: ie,
		mc: D,
		pc: j,
		pbc: O,
		n: he,
		o: e
	}, _e, ve;
	return i && ([_e, ve] = i(P)), {
		render: ge,
		hydrate: _e,
		createApp: ir(ge, _e)
	};
}
function Lr({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Rr({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function zr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Br(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = pi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Br(t, a)), a.type === qr && (a.patchFlag === -1 && (a = i[e] = pi(a)), a.el = t.el), a.type === Jr && !a.el && (a.el = t.el);
	}
}
function Vr(e) {
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
function Hr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Hr(t);
}
function Ur(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Wr(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Wr(t.subTree) : null;
}
var Gr = (e) => e.__isSuspense;
function Kr(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : hn(e);
}
var J = /* @__PURE__ */ Symbol.for("v-fgt"), qr = /* @__PURE__ */ Symbol.for("v-txt"), Jr = /* @__PURE__ */ Symbol.for("v-cmt"), Yr = /* @__PURE__ */ Symbol.for("v-stc"), Xr = [], Zr = null;
function Y(e = !1) {
	Xr.push(Zr = e ? null : []);
}
function Qr() {
	Xr.pop(), Zr = Xr[Xr.length - 1] || null;
}
var $r = 1;
function ei(e, t = !1) {
	$r += e, e < 0 && Zr && t && (Zr.hasOnce = !0);
}
function ti(e) {
	return e.dynamicChildren = $r > 0 ? Zr || n : null, Qr(), $r > 0 && Zr && Zr.push(e), e;
}
function X(e, t, n, r, i, a) {
	return ti(Z(e, t, n, r, i, a, !0));
}
function ni(e, t, n, r, i) {
	return ti(si(e, t, n, r, i, !0));
}
function ri(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ii(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ai = ({ key: e }) => e ?? null, oi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ B(e) || h(e) ? {
	i: W,
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
		key: t && ai(t),
		ref: t && oi(t),
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
		ctx: W
	};
	return s ? (mi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), $r > 0 && !o && Zr && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Zr.push(c), c;
}
var si = ci;
function ci(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Yn || (e = Jr), ri(e)) {
		let r = ui(e, t, !0);
		return n && mi(r, n), $r > 0 && !a && Zr && (r.shapeFlag & 6 ? Zr[Zr.indexOf(e)] = r : Zr.push(r)), r.patchFlag = -2, r;
	}
	if (Ii(e) && (e = e.__vccOpts), t) {
		t = li(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = M(e)), v(n) && (/* @__PURE__ */ Rt(n) && !d(n) && (n = s({}, n)), t.style = ce(n));
	}
	let o = g(e) ? 1 : Gr(e) ? 128 : Mn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function li(e) {
	return e ? /* @__PURE__ */ Rt(e) || br(e) ? s({}, e) : e : null;
}
function ui(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? hi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ai(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(oi(t)) : [a, oi(t)] : oi(t) : a,
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
		ssContent: e.ssContent && ui(e.ssContent),
		ssFallback: e.ssFallback && ui(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && In(u, c.clone(u)), u;
}
function di(e = " ", t = 0) {
	return si(qr, null, e, t);
}
function Q(e = "", t = !1) {
	return t ? (Y(), ni(Jr, null, e)) : si(Jr, null, e);
}
function fi(e) {
	return e == null || typeof e == "boolean" ? si(Jr) : d(e) ? si(J, null, e.slice()) : ri(e) ? pi(e) : si(qr, null, String(e));
}
function pi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ui(e);
}
function mi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), mi(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !br(t) ? t._ctx = W : r === 3 && W && (W.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			mi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: W
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [di(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function hi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = M([t.class, r.class]));
		else if (e === "style") t.style = ce([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function gi(e, t, n, r = null) {
	tn(e, t, 7, [n, r]);
}
var _i = nr(), vi = 0;
function yi() {
	return vi;
}
function bi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || _i, o = {
		uid: vi++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new xe(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Tr(i, a),
		emitsOptions: cr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = sr.bind(null, o), e.ce && e.ce(o), o;
}
var xi = null, Si = () => xi || W, Ci, wi;
{
	let e = se(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ci = t("__VUE_INSTANCE_SETTERS__", (e) => xi = e), wi = t("__VUE_SSR_SETTERS__", (e) => Oi = e);
}
var Ti = (e) => {
	let t = xi;
	return Ci(e), e.scope.on(), () => {
		e.scope.off(), Ci(t);
	};
}, Ei = () => {
	xi && xi.scope.off(), Ci(null);
};
function Di(e) {
	return e.vnode.shapeFlag & 4;
}
var Oi = !1;
function ki(e, t = !1, n = !1) {
	t && wi(t);
	let { props: r, children: i } = e.vnode, a = Di(e);
	xr(e, r, a, t), Nr(e, i, n || t);
	let o = a ? Ai(e, t) : void 0;
	return t && wi(!1), o;
}
function Ai(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, tr);
	let { setup: r } = n;
	if (r) {
		ze();
		let n = e.setupContext = r.length > 1 ? Pi(e) : null, i = Ti(e), a = en(r, e, 0, [e.props, n]), o = y(a);
		if (Be(), i(), (o || e.sp) && !Un(e) && Rn(e), o) {
			if (a.then(Ei, Ei), t) return a.then((n) => {
				wi(!0);
				try {
					ji(e, n, t);
				} finally {
					wi(!1);
				}
			}).catch((t) => {
				nn(t, e, 0);
			});
			e.asyncDep = a;
		} else ji(e, a, t);
	} else Mi(e, t);
}
function ji(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Gt(t)), Mi(e, n);
}
function Mi(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var Ni = { get(e, t) {
	return R(e, "get", ""), e[t];
} };
function Pi(e) {
	return {
		attrs: new Proxy(e.attrs, Ni),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Fi(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Gt(zt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in $n) return $n[n](e);
		},
		has(e, t) {
			return t in e || t in $n;
		}
	}) : e.proxy;
}
function Ii(e) {
	return h(e) && "__vccOpts" in e;
}
var Li = (e, t) => /* @__PURE__ */ qt(e, t, Oi), Ri = "3.5.44", zi = void 0, Bi = typeof window < "u" && window.trustedTypes;
if (Bi) try {
	zi = /* @__PURE__ */ Bi.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Vi = zi ? (e) => zi.createHTML(e) : (e) => e, Hi = "http://www.w3.org/2000/svg", Ui = "http://www.w3.org/1998/Math/MathML", Wi = typeof document < "u" ? document : null, Gi = Wi && /* @__PURE__ */ Wi.createElement("template"), Ki = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Wi.createElementNS(Hi, e) : t === "mathml" ? Wi.createElementNS(Ui, e) : n ? Wi.createElement(e, { is: n }) : Wi.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Wi.createTextNode(e),
	createComment: (e) => Wi.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Wi.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Gi.innerHTML = Vi(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Gi.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, qi = /* @__PURE__ */ Symbol("_vtc");
function Ji(e, t, n) {
	let r = e[qi];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Yi = /* @__PURE__ */ Symbol("_vod"), Xi = /* @__PURE__ */ Symbol("_vsh"), Zi = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Yi] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Qi(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Qi(e, !0), r.enter(e)) : r.leave(e, () => {
			Qi(e, !1);
		}) : Qi(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Qi(e, t);
	}
};
function Qi(e, t) {
	e.style.display = t ? e[Yi] : "none", e[Xi] = !t;
}
var $i = /* @__PURE__ */ Symbol(""), ea = /(?:^|;)\s*display\s*:/;
function ta(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? ra(r, t, "");
			}
			else for (let e in t) n[e] ?? ra(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ra(r, i, "") : sa(e, i, !g(t) && t ? t[i] : void 0, o) || ra(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[$i];
			e && (n += ";" + e), r.cssText = n, a = ea.test(n);
		}
	} else t && e.removeAttribute("style");
	Yi in e && (i && t === n || (e[Yi] = a ? r.display : ""), e[Xi] && (r.display = "none"));
}
var na = /\s*!important$/;
function ra(e, t, n) {
	if (d(n)) n.forEach((n) => ra(e, t, n));
	else if (n ??= "", t.startsWith("--")) na.test(n) ? e.setProperty(t, n.replace(na, ""), "important") : e.setProperty(t, n);
	else {
		let r = oa(e, t);
		na.test(n) ? e.setProperty(O(r), n.replace(na, ""), "important") : e[r] = n;
	}
}
var ia = [
	"Webkit",
	"Moz",
	"ms"
], aa = {};
function oa(e, t) {
	let n = aa[t];
	if (n) return n;
	let r = D(t);
	if (r !== "filter" && r in e) return aa[t] = r;
	r = k(r);
	for (let n = 0; n < ia.length; n++) {
		let i = ia[n] + r;
		if (i in e) return aa[t] = i;
	}
	return t;
}
function sa(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var ca = "http://www.w3.org/1999/xlink";
function la(e, t, n, r, i, a = fe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ca, t.slice(6, t.length)) : e.setAttributeNS(ca, t, n) : n == null || a && !N(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function ua(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Vi(n) : n);
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
		r === "boolean" ? n = N(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function da(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function fa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var pa = /* @__PURE__ */ Symbol("_vei");
function ma(e, t, n, r, i = null) {
	let a = e[pa] || (e[pa] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = _a(t);
		r ? da(e, n, a[t] = xa(r, i), s) : o && (fa(e, n, o, s), a[t] = void 0);
	}
}
var ha = /(Once|Passive|Capture)$/, ga = /^on:?(?:Once|Passive|Capture)$/;
function _a(e) {
	let t, n;
	for (; (n = e.match(ha)) && !ga.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : O(e.slice(2)), t];
}
var va = 0, ya = /* @__PURE__ */ Promise.resolve(), ba = () => va ||= (ya.then(() => va = 0), Date.now());
function xa(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
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
	return n.value = e, n.attached = ba(), n;
}
var Sa = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ca = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Ji(e, r, c) : t === "style" ? ta(e, n, r) : a(t) ? o(t) || ma(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : wa(e, t, r, c)) ? (ua(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || la(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ta(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ua(e, D(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), la(e, t, r, c));
};
function wa(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Sa(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Sa(t) && g(n) ? !1 : t in e;
}
function Ta(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = D(t);
	return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
}
var Ea = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => re(t, e) : t;
};
function Da(e) {
	e.target.composing = !0;
}
function Oa(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ka = /* @__PURE__ */ Symbol("_assign"), Aa = /* @__PURE__ */ Symbol("_initialValue");
function ja(e, t, n) {
	return t && (e = e.trim()), n && (e = ae(e)), e;
}
var $ = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Aa] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Aa] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[ka] = Ea(i);
		let a = r || i.props && i.props.type === "number";
		da(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ka](ja(e.value, n, a));
		}), (n || a) && da(e, "change", () => {
			e.value = ja(e.value, n, a);
		}), t || (da(e, "compositionstart", Da), da(e, "compositionend", Oa), da(e, "change", Oa));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Aa];
		delete e[Aa], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[ka](ja(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ka] = Ea(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ae(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Ma = {
	deep: !0,
	created(e, t, n) {
		e[ka] = Ea(n), da(e, "change", () => {
			let t = e._modelValue, n = Ra(e), r = e.checked, i = e[ka];
			if (d(t)) {
				let e = _e(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (p(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(za(e, r));
		});
	},
	mounted: Na,
	beforeUpdate(e, t, n) {
		e[ka] = Ea(n), Na(e, t, n);
	}
};
function Na(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = _e(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = P(t, za(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Pa = {
	created(e, { value: t }, n) {
		e.checked = P(t, n.props.value), e[ka] = Ea(n), da(e, "change", () => {
			e[ka](Ra(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[ka] = Ea(r), t !== n && (e.checked = P(t, r.props.value));
	}
}, Fa = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, da(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ae(Ra(e)) : Ra(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[ka](i);
			} finally {
				dn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[ka] = Ea(r);
	},
	mounted(e, { value: t }) {
		La(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[ka] = Ea(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && Ia(t, n[1], n[0]) || La(e, t);
	}
};
function Ia(e, t, n) {
	if (!n || d(e)) return P(e, t);
	if (p(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function La(e, t) {
	let n = e.multiple, r = d(t);
	if (!n || r || p(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Ra(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : _e(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (P(Ra(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Ra(e) {
	return "_value" in e ? e._value : e.value;
}
function za(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
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
}, Ua = /* @__PURE__ */ s({ patchProp: Ca }, Ki), Wa;
function Ga() {
	return Wa ||= Fr(Ua);
}
var Ka = ((...e) => {
	let t = Ga().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ja(e);
		if (!r) return;
		let i = t._component;
		h(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, qa(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function qa(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ja(e) {
	return g(e) ? document.querySelector(e) : e;
}
// services/play/src/model.js
var Ya = [
	"multiple-choice",
	"true-false",
	"memory",
	"matching",
	"classify",
	"ordering",
	"fill-blanks",
	"find-words",
	"drag-text",
	"mark-words",
	"dialog-cards",
	"crossword",
	"compound"
], Xa = [
	"multiple-choice",
	"true-false",
	"fill-blanks",
	"drag-text",
	"mark-words",
	"matching",
	"classify",
	"ordering"
], Za = {
	"multiple-choice": "multipleChoice",
	"true-false": "trueFalse",
	memory: "memory",
	matching: "matching",
	classify: "classify",
	ordering: "ordering",
	"fill-blanks": "fillBlanks",
	"find-words": "findWords",
	"drag-text": "dragText",
	"mark-words": "markWords",
	"dialog-cards": "dialogCards",
	crossword: "crossword",
	compound: "compound.card"
}, Qa = (e) => JSON.parse(JSON.stringify(e));
function $a(e = "multiple-choice") {
	let t = {
		type: e,
		title: "",
		question: "",
		subject: "",
		educational_stage: "",
		educational_level: "",
		tags: []
	};
	return e === "multiple-choice" && (t.answers = [{
		text: "",
		correct: !0
	}, {
		text: "",
		correct: !1
	}]), e === "true-false" && (t.correct = !0), e === "memory" && (t.cards = [{
		text: "",
		image: ""
	}, {
		text: "",
		image: ""
	}]), e === "matching" && (t.pairs = [{
		left: "",
		right: "",
		leftImage: "",
		rightImage: ""
	}, {
		left: "",
		right: "",
		leftImage: "",
		rightImage: ""
	}]), ["classify", "ordering"].includes(e) && (t.categories = (e === "ordering" ? [
		"1",
		"2",
		"3"
	] : ["", ""]).map((e) => ({ name: e })), t.items = Array.from({ length: 3 }, () => ({
		text: "",
		category: 0,
		image: ""
	}))), [
		"fill-blanks",
		"drag-text",
		"mark-words"
	].includes(e) && (t.text = ""), e === "find-words" && (t.words = [
		"agua",
		"tierra",
		"planta",
		"animal"
	]), e === "dialog-cards" && (t.cards = [
		{
			front: "Capital de Francia",
			back: "París"
		},
		{
			front: "Planeta rojo",
			back: "Marte"
		},
		{
			front: "2 + 2",
			back: "4"
		}
	]), e === "crossword" && (t.words = [
		{
			answer: "planeta",
			clue: "Cuerpo que gira alrededor de una estrella"
		},
		{
			answer: "océano",
			clue: "Gran extensión de agua salada"
		},
		{
			answer: "montaña",
			clue: "Elevación natural del terreno"
		},
		{
			answer: "bosque",
			clue: "Lugar poblado de árboles"
		}
	]), e === "compound" && (t.activities = [$a(), $a()], t.passPercentage = 60, t.randomQuestions = !1), t;
}
function eo(e) {
	return {
		...$a(Ya.includes(e?.type) ? e.type : "multiple-choice"),
		...Qa(e)
	};
}
function to(e, t) {
	let n = {
		type: e.type,
		title: String(e.title || "").trim(),
		question: String(e.question || "").trim(),
		language: t,
		subject: e.subject || "",
		educational_stage: e.educational_stage || "",
		educational_level: e.educational_level || "",
		tags: Qa(e.tags || [])
	};
	for (let t of {
		"multiple-choice": ["answers"],
		"true-false": ["correct"],
		memory: ["cards"],
		matching: ["pairs"],
		classify: ["categories", "items"],
		ordering: ["categories", "items"],
		"fill-blanks": ["text"],
		"drag-text": ["text"],
		"mark-words": ["text"],
		"find-words": ["words"],
		"dialog-cards": ["cards"],
		crossword: ["words"],
		compound: ["passPercentage", "randomQuestions"]
	}[n.type] || []) n[t] = Qa(e[t]);
	return n.type === "compound" && (n.activities = e.activities.map((e) => {
		let n = to(e, t);
		return e.sourceActivityId && (n.sourceActivityId = e.sourceActivityId), n;
	})), e.visibility && (n.visibility = e.visibility), n;
}
function no(e, t) {
	let n = [];
	e.title || n.push(t("errors.title")), e.question || n.push(t("errors.question"));
	let r = (e, r) => {
		e && n.push(t("errors." + r));
	};
	return e.type === "multiple-choice" && (r(e.answers.length < 2 || e.answers.length > 8 || e.answers.some((e) => !e.text.trim()), "answers"), r(!e.answers.some((e) => e.correct), "correct")), e.type === "memory" && r(e.cards.length < 2 || e.cards.length > 12 || e.cards.some((e) => !e.text.trim()), "cards"), e.type === "matching" && r(e.pairs.length < 2 || e.pairs.length > 8 || e.pairs.some((e) => !e.left.trim() || !e.right.trim()), "pairs"), ["classify", "ordering"].includes(e.type) && (r(e.categories.length < 2 || e.categories.length > 12 || e.categories.some((e) => !e.name.trim()), "categories"), r(e.items.length < 3 || e.items.length > 12 || e.items.some((t) => !t.text.trim() || !Number.isInteger(Number(t.category)) || t.category < 0 || t.category >= e.categories.length), "items")), [
		"fill-blanks",
		"drag-text",
		"mark-words"
	].includes(e.type) && r(!/\*[^*]+\*/.test(e.text), "fillBlanks"), e.type === "dialog-cards" && r(e.cards.length < 3 || e.cards.length > 15 || e.cards.some((e) => !e.front.trim() || !e.back.trim()), "dialogCards"), e.type === "crossword" && (r(e.words.length < 4 || e.words.length > 10 || e.words.some((e) => !/^[a-záéíóúüñ]+$/i.test(e.answer) || e.answer.length > 20 || !e.clue.trim()), "crossword"), r(new Set(e.words.map((e) => e.answer.toLowerCase())).size !== e.words.length, "crosswordUnique")), e.type === "find-words" && (r(e.words.length < 4 || e.words.length > 12 || e.words.some((e) => !/^[a-záéíóúüñ]+$/i.test(e) || e.length > 15), "findWords"), r(new Set(e.words.map((e) => e.toLowerCase())).size !== e.words.length, "findWordsUnique")), e.type === "compound" && ((e.activities.length < 2 || e.activities.length > 10 || !Number.isFinite(e.passPercentage) || e.passPercentage < 0 || e.passPercentage > 100) && n.push(t("compound.error")), e.activities.forEach((e, r) => n.push(...no(e, t).map((e) => `${r + 1}. ${e}`)))), n;
}
async function ro(e) {
	if (!e || ![
		"image/png",
		"image/jpeg",
		"image/webp"
	].includes(e.type) || e.size > 12582912) throw Error("image");
	let t = await createImageBitmap(e);
	try {
		let e = Math.min(1, 640 / t.width, 360 / t.height), n = document.createElement("canvas");
		n.width = Math.max(1, Math.round(t.width * e)), n.height = Math.max(1, Math.round(t.height * e)), n.getContext("2d").drawImage(t, 0, 0, n.width, n.height);
		let r = .78, i;
		do
			i = await new Promise((e) => n.toBlob(e, "image/webp", r)), r -= .08;
		while (i && i.size > 409600 && r >= .4);
		if (!i || i.type !== "image/webp" || i.size > 409600) throw Error("image");
		return await new Promise((e, t) => {
			let n = new FileReader();
			n.onload = () => e(n.result), n.onerror = t, n.readAsDataURL(i);
		});
	} finally {
		t.close();
	}
}
// services/play/src/commons.js
function io(e, t) {
	let n = new URLSearchParams(location.search), r = "edutictac-play-result-queue", i = n.get("assignment_id") || "", a = n.get("launch_context") || "", o = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + "-" + Math.random().toString(36).slice(2), s = () => {
		try {
			let e = JSON.parse(localStorage.getItem(r) || "[]");
			return Array.isArray(e) ? e : [];
		} catch {
			return [];
		}
	};
	function c(e) {
		if (!e.launch_context) return;
		let t = s();
		t.some((t) => t.result_id === e.result_id && t.assignment_id === e.assignment_id) || (t.push(e), localStorage.setItem(r, JSON.stringify(t.slice(-20))));
	}
	async function l(t) {
		try {
			return await fetch(e + "/api/commons/score", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(t)
			});
		} catch {
			return null;
		}
	}
	async function u() {
		if (navigator.onLine) for (let e of s()) {
			let t = await l(e);
			if (!t || !t.ok && t.status >= 500) continue;
			let n = s().filter((t) => t.result_id !== e.result_id || t.assignment_id !== e.assignment_id);
			n.length ? localStorage.setItem(r, JSON.stringify(n)) : localStorage.removeItem(r);
		}
	}
	async function d() {
		let t = n.get("launch_token");
		if (t && !a) {
			let n = await fetch(e + "/api/commons/launch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: t })
			});
			if (!n.ok) throw Error("launch");
			let r = await n.json();
			i = r.assignment.id, a = r.context_id;
			let o = new URL(location.href);
			o.searchParams.delete("launch_token"), o.searchParams.set("assignment_id", i), o.searchParams.set("launch_context", a), history.replaceState({}, "", o.pathname + o.search);
		}
	}
	function f() {
		let e = new URLSearchParams();
		return i && e.set("assignment_id", i), a && e.set("launch_context", a), e.size ? "?" + e : "";
	}
	async function p(e, n) {
		if (!i || !n || n.startsWith("preview-")) return;
		let r = e?.result || {}, s = String(e?.verb?.id || "").split("/").pop();
		if (![
			"completed",
			"passed",
			"failed"
		].includes(s) && r.completion !== !0 || !r.score || r.score.raw === void 0 || r.score.max === void 0) return;
		let u = Number(r.score.max), d = Number(r.score.raw);
		if (!Number.isFinite(u) || u <= 0 || !Number.isFinite(d)) return;
		let f = String(e.id || `urn:edutictac-play:${o}`), p = {
			activity_id: n,
			assignment_id: i,
			launch_context: a,
			result_id: f,
			score: Math.max(0, Math.min(100, Math.round(d / u * 100))),
			metadata: {
				source: "h5p-xapi",
				statement_id: f,
				raw_score: d,
				max_score: u,
				verb: s,
				attempt: 1
			}
		}, m = await l(p);
		m?.ok ? t(n) : (!m || m.status >= 500) && c(p);
	}
	return {
		launch: d,
		query: f,
		report: p,
		flush: u
	};
}
// services/portal/public/assets/language-preference.js
(function() {
	let e = [
		"es",
		"ca",
		"va",
		"en"
	], t = [
		"edutictac-lang",
		"edutictac-portal-lang",
		"edutictac-play-lang"
	], n = (t) => e.includes(t);
	function r() {
		let e = document.cookie.split(";").map((e) => e.trim()).find((e) => e.startsWith("edutictac_language="))?.slice(19);
		if (n(e)) return e;
		try {
			for (let e of t) {
				let t = localStorage.getItem(e);
				if (n(t)) return t;
			}
		} catch {}
		return null;
	}
	function i({ parameter: e = "lang" } = {}) {
		let t = new URLSearchParams(location.search).get(e);
		return n(t) ? t : r();
	}
	function a(e, { parameter: r = "lang" } = {}) {
		if (!n(e)) return;
		try {
			for (let n of t) localStorage.setItem(n, e);
		} catch {}
		let i = location.hostname === "edutictac.es" || location.hostname.endsWith(".edutictac.es");
		document.cookie = "edutictac_language=" + e + "; Path=/; Max-Age=31536000; SameSite=Lax" + (i ? "; Domain=edutictac.es" : "") + (location.protocol === "https:" ? "; Secure" : "");
		let a = new URL(location.href);
		a.searchParams.has(r) && (a.searchParams.set(r, e), history.replaceState(history.state, "", a.pathname + a.search + a.hash));
	}
	window.commonsLanguage = Object.freeze({
		read: i,
		stored: r,
		remember: a
	});
})();
// services/play/src/usePlay.js
function ao() {
	let e = location.pathname === "/play" || location.pathname.startsWith("/play/") ? "/play" : "", t = "edutictac-play-draft", n = window.commonsLanguage.read(), r = /* @__PURE__ */ V([
		"es",
		"ca",
		"va",
		"en"
	].includes(n) ? n : "es"), i = /* @__PURE__ */ V({}), a = (e) => e.split(".").reduce((e, t) => e?.[t], i.value) || e, o = /* @__PURE__ */ V("home"), s = /* @__PURE__ */ V(!1), c = /* @__PURE__ */ V(!1), l = /* @__PURE__ */ V($a()), u = /* @__PURE__ */ V(null), d = /* @__PURE__ */ V(""), f = /* @__PURE__ */ V(""), p = /* @__PURE__ */ V(!1), m = /* @__PURE__ */ V(0), h = /* @__PURE__ */ V(""), g = /* @__PURE__ */ V({}), _ = /* @__PURE__ */ V(null), v = /* @__PURE__ */ V(!1), y = {}, b = /* @__PURE__ */ V({}), x = /* @__PURE__ */ jt({
		subjects: "",
		educational_stages: "",
		levels: "",
		tags: ""
	}), S = /* @__PURE__ */ V(""), C = /* @__PURE__ */ jt({
		items: [],
		total: 0,
		offset: 0,
		hasMore: !1,
		term: "",
		type: "",
		loading: !1,
		error: !1
	}), w = /* @__PURE__ */ jt({
		items: [],
		term: "",
		loading: !1,
		error: !1
	}), T = /* @__PURE__ */ V(), E = /* @__PURE__ */ V(""), ee = /* @__PURE__ */ V("");
	try {
		ee.value = localStorage.getItem("edutictac-play-admin-token") || "", localStorage.removeItem("edutictac-play-admin-token");
	} catch {}
	let D = 0, te = 0, O = 0, k = 0, ne = 0, A = !0, re = "", ie = io(e, (e) => {
		u.value?.id === e && A && (f.value = "resultSaved");
	}), ae = Li(() => c.value || m.value > 0), oe = Li(() => ["published", "updated"].includes(u.value?.recursos?.status)), se = Li(() => a(l.value.type === "compound" ? "compound.editor" : l.value.type === "multiple-choice" ? "editorTitle" : Za[l.value.type] + "Editor"));
	function ce() {
		let e = localStorage.getItem("edutictac-play-creator-key");
		return e && /^[A-Za-z0-9_-]{16,128}$/.test(e) || (e = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2) + Date.now().toString(36), localStorage.setItem("edutictac-play-creator-key", e)), e;
	}
	async function j(t, n = {}) {
		let r = await fetch(e + "/api" + t, {
			credentials: "same-origin",
			cache: "no-store",
			...n,
			headers: {
				"X-Play-Creator": ce(),
				...n.headers
			}
		}), i = await r.json();
		if (!r.ok) {
			let e = /* @__PURE__ */ Error("request");
			throw e.status = r.status, e.details = Array.isArray(i.errors) ? i.errors : [], e;
		}
		return i;
	}
	function le(e, t, n = {}) {
		return j(e, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...n
			},
			body: JSON.stringify(t)
		});
	}
	async function ue(t) {
		if (![
			"es",
			"ca",
			"va",
			"en"
		].includes(t)) return;
		let n = ++te;
		try {
			let a = await fetch(e + "/i18n/" + (t === "va" ? "ca" : t) + ".json");
			if (!a.ok) throw Error();
			let o = await a.json();
			if (t === "va") {
				let t = await fetch(e + "/i18n/va.json");
				if (!t.ok) throw Error();
				o = {
					...o,
					...await t.json()
				};
			}
			if (n !== te || !A) return;
			i.value = o, r.value = t, document.documentElement.lang = t === "va" ? "ca" : t, window.commonsLanguage.remember(t);
		} catch {
			d.value = "languageError";
		}
	}
	function de(e) {
		Ya.includes(e) && !ae.value && (y[l.value.type] = l.value, y[e] || (y[e] = {
			...$a(e),
			title: l.value.title,
			question: l.value.question
		}), l.value = y[e], o.value = "editor", d.value = "", ++D);
	}
	function M(e) {
		c.value || (++D, o.value = e, f.value = "", d.value = "", T.value?.close(), ++k);
	}
	async function fe(n = !1) {
		if (ae.value) return;
		let i = to(l.value, r.value), s = no(i, a);
		if (d.value = s.join(" "), s.length) return;
		c.value = !0;
		let m = D;
		try {
			n && localStorage.setItem(t, JSON.stringify({
				...i,
				_owner: g.value.actor || ""
			}));
			let r = await le(n ? "/previews" : "/activities", i);
			if (m !== D || !A || (u.value = r, n || await P(), m !== D || !A)) return;
			o.value = "previewPanel", f.value = n ? "" : "saved", p.value = !1, n || localStorage.removeItem(t), history.replaceState({}, "", n ? e + "/" + ie.query() : e + "/" + r.id + ie.query());
		} catch (e) {
			if (m === D && A) {
				let t = e.details?.join(" ");
				d.value = e.status === 401 ? a("loginToSave") : t || a(n ? "previewError" : "saveError"), f.value = "saveError", p.value = !0;
			}
		} finally {
			m === D && (c.value = !1);
		}
	}
	async function N() {
		let e = ++O, t = D;
		C.loading = !0, C.error = !1;
		try {
			let n = await j("/activities?" + new URLSearchParams({
				limit: "12",
				offset: C.offset,
				q: C.term.trim(),
				type: C.type
			}));
			if (e !== O || t !== D || !A) return;
			Object.assign(C, {
				items: n.items,
				total: n.total,
				offset: n.offset,
				hasMore: n.hasMore
			});
		} catch {
			e === O && t === D && (C.error = !0);
		} finally {
			e === O && (C.loading = !1);
		}
	}
	function pe() {
		M("library"), C.offset = 0, N();
	}
	function me(e = 0) {
		C.offset = e, N();
	}
	function he() {
		c.value || (ee.value = E.value.trim(), E.value = "", S.value = "", ++O, N());
	}
	async function ge(n, r = !1) {
		if (c.value || !window.confirm(a(r ? "libraryConfirmDelete" : "deleteConfirm"))) return;
		c.value = !0;
		let i = D;
		try {
			if (await j("/activities/" + n, {
				method: "DELETE",
				headers: ee.value ? { "X-Admin-Token": ee.value } : {}
			}), i !== D || !A) return;
			r ? await N() : (u.value = null, localStorage.removeItem(t), history.replaceState({}, "", e + "/"), o.value = "home");
		} catch {
			i === D && (f.value = "deleteError", p.value = !0, r && (C.error = !0));
		} finally {
			i === D && (c.value = !1);
		}
	}
	async function P() {
		let e = D;
		try {
			let t = await j("/publication/me");
			if (e !== D || !A) return;
			if (g.value = t, _.value = null, t.can_submit && u.value?.id && !u.value.id.startsWith("preview-")) {
				let t = u.value.id, n = await j("/submissions/" + t);
				e === D && u.value?.id === t && A && (_.value = n);
			}
		} catch {
			e === D && (g.value = {}, _.value = null);
		}
	}
	async function _e() {
		if (c.value || !g.value.can_submit || !u.value?.id) return;
		c.value = !0;
		let e = D, t = u.value.id;
		try {
			let n = await le("/submissions/" + t, { revision: _.value?.revision || 0 }, { "X-Play-Review": "1" });
			if (e !== D || !A) return;
			_.value = n, f.value = "reviewSent", p.value = !1;
		} catch {
			e === D && (f.value = "reviewSubmitError", p.value = !0);
		} finally {
			e === D && (c.value = !1);
		}
	}
	async function ve(e = !1) {
		if (c.value || !g.value.can_publish || !u.value?.id || u.value.id.startsWith("preview-")) return;
		c.value = !0;
		let t = D, n = u.value.id;
		f.value = e ? "unpublishRecursosLoading" : "publishRecursosLoading";
		try {
			let r = await le("/recursos/" + (e ? "unpublish" : "publish"), { activity_id: n });
			if (t !== D || u.value?.id !== n || !A) return;
			u.value.recursos = r, f.value = e ? "unpublishRecursosDone" : "publishRecursosDone", p.value = !1;
		} catch {
			t === D && (f.value = e ? "unpublishRecursosError" : "publishRecursosError", p.value = !0);
		} finally {
			t === D && (c.value = !1);
		}
	}
	async function F() {
		let e = ++ne;
		try {
			let t = await j("/catalog");
			if (e !== ne || !A) return;
			b.value = t;
			for (let e of Object.keys(x)) x[e] = (t[e] || []).join("\n");
		} catch {}
	}
	async function ye() {
		if (c.value) return;
		if (!ee.value) {
			S.value = "catalogTokenRequired";
			return;
		}
		c.value = !0;
		let e = D;
		try {
			await le("/catalog", {
				...Object.fromEntries(Object.entries(x).map(([e, t]) => [e, t.split("\n").map((e) => e.trim()).filter(Boolean)])),
				labels: b.value.labels || {}
			}, { "X-Admin-Token": ee.value }), e === D && A && (S.value = "catalogSaved", await F());
		} catch {
			e === D && (S.value = "catalogError");
		} finally {
			e === D && (c.value = !1);
		}
	}
	async function be() {
		let e = ++k, t = D;
		w.loading = !0, w.error = !1;
		try {
			let n = await j("/activities?" + new URLSearchParams({
				limit: "100",
				q: w.term.trim()
			}));
			if (e !== k || t !== D || !A) return;
			w.items = n.items.filter((e) => Xa.includes(e.type));
		} catch {
			e === k && (w.error = !0);
		} finally {
			e === k && (w.loading = !1);
		}
	}
	async function I() {
		ae.value || (w.term = "", w.items = [], T.value.showModal(), be());
	}
	async function xe(e) {
		if (c.value || l.value.type !== "compound" || l.value.activities.length >= 10) return;
		let t = D, n = k, r = l.value;
		c.value = !0;
		try {
			let i = await j("/activities/" + e);
			if (t !== D || n !== k || l.value !== r || !T.value.open || !A) return;
			if (!Xa.includes(i.type)) throw Error();
			r.activities.push({
				...eo(i),
				sourceActivityId: e
			}), T.value.close(), f.value = "bank.copied";
		} catch {
			t === D && (w.error = !0);
		} finally {
			t === D && (c.value = !1);
		}
	}
	function Se() {
		++k, T.value?.close();
	}
	async function L() {
		try {
			await navigator.clipboard.writeText(location.href), f.value = "copied", p.value = !1;
		} catch {
			f.value = "copyError", p.value = !0;
		}
	}
	async function Ce() {
		let n = D;
		await ue(r.value);
		try {
			await ie.launch();
		} catch {
			d.value = a("launchError");
			return;
		}
		if (n !== D || !A || (ie.flush(), F(), await P(), n !== D || !A)) return;
		j("/config").then((e) => {
			v.value = !!e.integrated;
			try {
				let t = new URL(e.commonsUrl);
				e.demo && ["http:", "https:"].includes(t.protocol) && !t.username && !t.password && (h.value = t.href);
			} catch {}
		}).catch(() => {});
		let i = location.pathname.match(RegExp("^" + e + "/([A-Za-z0-9]{8})$"))?.[1] || new URLSearchParams(location.search).get("activity");
		if (i) try {
			if (!/^[A-Za-z0-9]{8}$/.test(i)) throw Error();
			let e = await j("/activities/" + i);
			if (n !== D || !A || (u.value = e, await P(), n !== D || !A)) return;
			l.value = eo(e), y[l.value.type] = l.value, o.value = "previewPanel", f.value = "saved";
		} catch {
			d.value = a("libraryError");
		}
		else try {
			let e = JSON.parse(localStorage.getItem(t) || "null");
			e && Ya.includes(e.type) && (!e._owner || e._owner === g.value.actor) && (l.value = eo(e), y[l.value.type] = l.value);
		} catch {
			localStorage.removeItem(t);
		}
		s.value = !0, document.documentElement.dataset.playReady = "true";
	}
	function we() {
		re = g.value.actor || "", document.getElementById("playApp")?.setAttribute("hidden", ""), A = !1, ++D, ++O, ++k, ++ne, ee.value = "", E.value = "", g.value = {}, _.value = null, c.value = !1, T.value?.close();
	}
	async function Te(e) {
		if (e.persisted) {
			if (A = !0, !s.value) await Ce(), document.getElementById("playApp")?.removeAttribute("hidden");
			else {
				if (await P(), re && re !== g.value.actor && (u.value = null, l.value = $a(), Object.keys(y).forEach((e) => delete y[e]), o.value = "home", localStorage.removeItem(t)), u.value?.visibility === "private") try {
					u.value = await j("/activities/" + u.value.id);
				} catch {
					u.value = null, l.value = $a(), o.value = "home";
				}
				await dn(), document.getElementById("playApp")?.removeAttribute("hidden"), F(), o.value === "library" && N();
			}
		}
	}
	function Ee() {
		ie.flush();
	}
	return qn(() => {
		Ce(), window.addEventListener("online", Ee), window.addEventListener("pagehide", we), window.addEventListener("pageshow", Te);
	}), Jn(() => {
		we(), window.removeEventListener("online", Ee), window.removeEventListener("pagehide", we), window.removeEventListener("pageshow", Te);
	}), {
		capabilities: g,
		submission: _,
		integrated: v,
		submitReview: _e,
		loadPublication: P,
		base: e,
		TYPES: Ya,
		CHILD_TYPES: Xa,
		TYPE_LABELS: Za,
		language: r,
		t: a,
		view: o,
		ready: s,
		busy: c,
		form: l,
		saved: u,
		formError: d,
		message: f,
		messageError: p,
		imageTasks: m,
		savingDisabled: ae,
		demoUrl: h,
		catalog: b,
		catalogDraft: x,
		catalogMessage: S,
		library: C,
		bank: w,
		bankDialog: T,
		adminInput: E,
		adminToken: ee,
		published: oe,
		editorTitle: se,
		choose: de,
		go: M,
		changeLanguage: ue,
		saveActivity: fe,
		loadLibrary: N,
		openLibrary: pe,
		filterLibrary: me,
		applyToken: he,
		removeActivity: ge,
		publication: ve,
		saveCatalog: ye,
		openBank: I,
		loadBank: be,
		addFromBank: xe,
		closeBank: Se,
		copy: L,
		onStatement: ie.report
	};
}
// services/play/src/CompoundStep.vue
var oo = { class: "compound-step" }, so = { class: "section-heading" }, co = { class: "compound-step-number" }, lo = ["disabled"], uo = {
	key: 0,
	class: "compound-source"
}, fo = ["value", "disabled"], po = ["value"], mo = ["disabled"], ho = ["disabled"], go = { class: "compound-details" }, _o = { key: 0 }, vo = ["value", "disabled"], yo = { key: 1 }, bo = ["disabled"], xo = { value: !0 }, So = { value: !1 }, Co = { key: 2 }, wo = ["disabled"], To = { key: 3 }, Eo = ["value", "disabled"], Do = ["value", "disabled"], Oo = ["value", "disabled"], ko = {
	__name: "CompoundStep",
	props: {
		step: Object,
		index: Number,
		t: Function,
		disabled: Boolean
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ V(""), a = /* @__PURE__ */ V(""), o = /* @__PURE__ */ V(""), s = /* @__PURE__ */ V(""), c = {};
		function l() {
			let e = n.step;
			i.value = (e.answers || []).map((e) => (e.correct ? "*" : "") + e.text).join("\n"), a.value = (e.pairs || []).map((e) => e.left + " | " + e.right).join("\n"), o.value = (e.categories || []).map((e) => e.name).join(", "), s.value = (e.items || []).map((e) => e.text + " | " + e.category).join("\n");
		}
		function u(e) {
			let t = n.step;
			c[t.type] = Qa(t), Object.assign(t, c[e] || $a(e), {
				type: e,
				title: t.title,
				question: t.question
			}), l();
		}
		function d(e, t) {
			let r = n.step;
			e === "answers" && (i.value = t, r.answers = t.split("\n").map((e) => ({
				text: e.replace(/^\*/, "").trim(),
				correct: e.trim().startsWith("*")
			}))), e === "pairs" && (a.value = t, r.pairs = t.split("\n").map((e, t) => {
				let n = e.split("|");
				return {
					...r.pairs?.[t],
					left: (n[0] || "").trim(),
					right: (n[1] || "").trim()
				};
			})), e === "categories" && (o.value = t, r.categories = t.split(",").map((e) => ({ name: e.trim() }))), e === "items" && (s.value = t, r.items = t.split("\n").map((e, t) => {
				let n = e.split("|");
				return {
					...r.items?.[t],
					text: (n[0] || "").trim(),
					category: Number((n[1] || "").trim())
				};
			}));
		}
		return kn(() => n.step, l, { immediate: !0 }), (t, n) => (Y(), X("article", oo, [
			Z("div", so, [
				Z("strong", co, F(e.index + 1) + ".", 1),
				Z("button", {
					type: "button",
					class: "button secondary compound-remove",
					disabled: e.disabled,
					onClick: n[0] ||= (e) => r("remove")
				}, F(e.t("compound.remove")), 9, lo),
				e.step.sourceActivityId ? (Y(), X("small", uo, F(e.t("bank.source")) + ": " + F(e.step.sourceActivityId), 1)) : Q("", !0)
			]),
			Z("label", null, [Z("span", null, F(e.t("compound.type")), 1), Z("select", {
				class: "compound-type",
				value: e.step.type,
				disabled: e.disabled,
				onChange: n[1] ||= (e) => u(e.target.value)
			}, [(Y(!0), X(J, null, K(H(Xa), (t) => (Y(), X("option", {
				key: t,
				value: t
			}, F(e.t(H(Za)[t])), 9, po))), 128))], 40, fo)]),
			Z("label", null, [Z("span", null, F(e.t("compound.stepTitle")), 1), G(Z("input", {
				"onUpdate:modelValue": n[2] ||= (t) => e.step.title = t,
				class: "compound-title",
				maxlength: "200",
				required: "",
				disabled: e.disabled
			}, null, 8, mo), [[$, e.step.title]])]),
			Z("label", null, [Z("span", null, F(e.t("compound.stepQuestion")), 1), G(Z("textarea", {
				"onUpdate:modelValue": n[3] ||= (t) => e.step.question = t,
				class: "compound-question",
				maxlength: "2000",
				required: "",
				disabled: e.disabled
			}, null, 8, ho), [[$, e.step.question]])]),
			Z("div", go, [e.step.type === "multiple-choice" ? (Y(), X("label", _o, [Z("span", null, F(e.t("compound.answers")), 1), Z("textarea", {
				class: "compound-answers",
				value: i.value,
				disabled: e.disabled,
				onInput: n[4] ||= (e) => d("answers", e.target.value)
			}, null, 40, vo)])) : e.step.type === "true-false" ? (Y(), X("label", yo, [Z("span", null, F(e.t("correctAnswer")), 1), G(Z("select", {
				"onUpdate:modelValue": n[5] ||= (t) => e.step.correct = t,
				class: "compound-correct",
				disabled: e.disabled
			}, [Z("option", xo, F(e.t("true")), 1), Z("option", So, F(e.t("false")), 1)], 8, bo), [[Fa, e.step.correct]])])) : [
				"fill-blanks",
				"drag-text",
				"mark-words"
			].includes(e.step.type) ? (Y(), X("label", Co, [Z("span", null, F(e.t("compound.text")), 1), G(Z("textarea", {
				"onUpdate:modelValue": n[6] ||= (t) => e.step.text = t,
				class: "compound-text",
				disabled: e.disabled
			}, null, 8, wo), [[$, e.step.text]])])) : e.step.type === "matching" ? (Y(), X("label", To, [Z("span", null, F(e.t("compound.pairs")), 1), Z("textarea", {
				class: "compound-pairs",
				value: a.value,
				disabled: e.disabled,
				onInput: n[7] ||= (e) => d("pairs", e.target.value)
			}, null, 40, Eo)])) : (Y(), X(J, { key: 4 }, [Z("label", null, [Z("span", null, F(e.t("compound.categories")), 1), Z("input", {
				class: "compound-categories",
				value: o.value,
				disabled: e.disabled,
				onInput: n[8] ||= (e) => d("categories", e.target.value)
			}, null, 40, Do)]), Z("label", null, [Z("span", null, F(e.t("compound.items")), 1), Z("textarea", {
				class: "compound-items",
				value: s.value,
				disabled: e.disabled,
				onInput: n[9] ||= (e) => d("items", e.target.value)
			}, null, 40, Oo)])], 64))])
		]));
	}
}, Ao = {
	key: 0,
	id: "answersField"
}, jo = { id: "answers" }, Mo = ["onUpdate:modelValue", "aria-label"], No = { class: "correct" }, Po = ["checked", "onChange"], Fo = ["aria-label", "onClick"], Io = ["disabled"], Lo = {
	key: 1,
	id: "truthField"
}, Ro = { class: "choice" }, zo = { class: "choice" }, Bo = {
	key: 2,
	id: "memoryField"
}, Vo = { id: "cards" }, Ho = ["onUpdate:modelValue", "aria-label"], Uo = { class: "match-image-label" }, Wo = ["onChange"], Go = ["src"], Ko = ["aria-label", "onClick"], qo = ["disabled"], Jo = {
	key: 3,
	id: "matchingField"
}, Yo = { id: "matches" }, Xo = ["onUpdate:modelValue", "aria-label"], Zo = { class: "match-image-label" }, Qo = ["data-side", "onChange"], $o = ["src"], es = ["aria-label", "onClick"], ts = ["disabled"], ns = { id: "categories" }, rs = [
	"onUpdate:modelValue",
	"readonly",
	"aria-label"
], is = ["aria-label", "onClick"], as = ["disabled"], os = { id: "classifyItems" }, ss = ["onUpdate:modelValue", "aria-label"], cs = { class: "match-image-label" }, ls = ["onChange"], us = ["src"], ds = ["onUpdate:modelValue", "aria-label"], fs = ["value"], ps = ["aria-label", "onClick"], ms = ["disabled"], hs = ["id"], gs = ["id"], _s = {
	key: 6,
	id: "findWordsField"
}, vs = { id: "findWords" }, ys = ["onUpdate:modelValue", "aria-label"], bs = ["aria-label", "onClick"], xs = ["disabled"], Ss = {
	key: 7,
	id: "dialogCardsField"
}, Cs = { id: "dialogCards" }, ws = ["onUpdate:modelValue", "aria-label"], Ts = ["onUpdate:modelValue", "aria-label"], Es = ["aria-label", "onClick"], Ds = ["disabled"], Os = {
	key: 8,
	id: "crosswordField"
}, ks = { id: "crosswordWords" }, As = ["onUpdate:modelValue", "aria-label"], js = ["onUpdate:modelValue", "aria-label"], Ms = ["aria-label", "onClick"], Ns = ["disabled"], Ps = {
	key: 9,
	id: "compoundField"
}, Fs = { id: "compoundSteps" }, Is = ["disabled"], Ls = ["disabled"], Rs = { class: "choice" }, zs = {
	__name: "ActivityFields",
	props: {
		form: Object,
		t: Function,
		busy: Boolean
	},
	emits: [
		"bank",
		"image-error",
		"image-busy"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = 0, a = /* @__PURE__ */ new WeakMap();
		function o(e) {
			n.form.categories.splice(e, 1), n.form.items.forEach((t) => {
				t.category === e ? t.category = 0 : t.category > e && t.category--;
			}), n.form.type === "ordering" && n.form.categories.forEach((e, t) => e.name = String(t + 1));
		}
		async function s(e, t, n = "image") {
			let o = e.target.files?.[0];
			if (!o) return;
			let s = ++i, c = a.get(t) || /* @__PURE__ */ new Map();
			c.set(n, s), a.set(t, c), r("image-busy", 1);
			try {
				let e = await ro(o);
				a.get(t)?.get(n) === s && (t[n] = e);
			} catch {
				a.get(t)?.get(n) === s && r("image-error");
			} finally {
				e.target.value = "", r("image-busy", -1);
			}
		}
		return (t, n) => e.form.type === "multiple-choice" ? (Y(), X("fieldset", Ao, [
			Z("legend", null, F(e.t("answers")), 1),
			Z("div", jo, [(Y(!0), X(J, null, K(e.form.answers, (t, r) => (Y(), X("div", {
				key: r,
				class: "answer-row"
			}, [
				G(Z("input", {
					"onUpdate:modelValue": (e) => t.text = e,
					class: "answer-text",
					maxlength: "500",
					"aria-label": e.t("answers")
				}, null, 8, Mo), [[$, t.text]]),
				Z("label", No, [Z("input", {
					class: "answer-correct",
					type: "radio",
					name: "correct",
					checked: t.correct,
					onChange: (t) => e.form.answers.forEach((e, t) => e.correct = t === r)
				}, null, 40, Po), n[15] ||= Z("span", null, "✓", -1)]),
				Z("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.answers.splice(r, 1)
				}, "×", 8, Fo)
			]))), 128))]),
			Z("button", {
				id: "addAnswer",
				type: "button",
				class: "button secondary",
				disabled: e.form.answers.length >= 8,
				onClick: n[0] ||= (t) => e.form.answers.push({
					text: "",
					correct: !1
				})
			}, F(e.t("addAnswer")), 9, Io)
		])) : e.form.type === "true-false" ? (Y(), X("fieldset", Lo, [
			Z("legend", null, F(e.t("correctAnswer")), 1),
			Z("label", Ro, [G(Z("input", {
				id: "correctTrue",
				"onUpdate:modelValue": n[1] ||= (t) => e.form.correct = t,
				type: "radio",
				name: "truth",
				value: !0
			}, null, 512), [[Pa, e.form.correct]]), Z("span", null, F(e.t("true")), 1)]),
			Z("label", zo, [G(Z("input", {
				id: "correctFalse",
				"onUpdate:modelValue": n[2] ||= (t) => e.form.correct = t,
				type: "radio",
				name: "truth",
				value: !1
			}, null, 512), [[Pa, e.form.correct]]), Z("span", null, F(e.t("false")), 1)])
		])) : e.form.type === "memory" ? (Y(), X("fieldset", Bo, [
			Z("legend", null, F(e.t("pairs")), 1),
			Z("div", Vo, [(Y(!0), X(J, null, K(e.form.cards, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row memory-row"
			}, [Z("div", null, [
				G(Z("input", {
					"onUpdate:modelValue": (e) => t.text = e,
					class: "card-text",
					maxlength: "120",
					"aria-label": e.t("pair")
				}, null, 8, Ho), [[$, t.text]]),
				Z("label", Uo, [di(F(e.t("imageLeft")), 1), Z("input", {
					class: "memory-image",
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					onChange: (e) => s(e, t)
				}, null, 40, Wo)]),
				t.image ? (Y(), X("img", {
					key: 0,
					src: t.image,
					class: "editor-thumbnail",
					alt: ""
				}, null, 8, Go)) : Q("", !0)
			]), Z("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.cards.splice(n, 1)
			}, "×", 8, Ko)]))), 128))]),
			Z("button", {
				id: "addCard",
				type: "button",
				class: "button secondary",
				disabled: e.form.cards.length >= 12,
				onClick: n[3] ||= (t) => e.form.cards.push({
					text: "",
					image: ""
				})
			}, F(e.t("addPair")), 9, qo)
		])) : e.form.type === "matching" ? (Y(), X("fieldset", Jo, [
			Z("legend", null, F(e.t("relations")), 1),
			Z("div", Yo, [(Y(!0), X(J, null, K(e.form.pairs, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row matching-row"
			}, [(Y(), X(J, null, K(["left", "right"], (n) => Z("div", { key: n }, [
				G(Z("input", {
					"onUpdate:modelValue": (e) => t[n] = e,
					class: M("match-" + n),
					maxlength: "120",
					"aria-label": e.t(n)
				}, null, 10, Xo), [[$, t[n]]]),
				Z("label", Zo, [di(F(e.t(n === "left" ? "imageLeft" : "imageRight")), 1), Z("input", {
					class: "match-image",
					"data-side": n,
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					onChange: (e) => s(e, t, n + "Image")
				}, null, 40, Qo)]),
				t[n + "Image"] ? (Y(), X("img", {
					key: 0,
					src: t[n + "Image"],
					class: "editor-thumbnail",
					alt: ""
				}, null, 8, $o)) : Q("", !0)
			])), 64)), Z("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.pairs.splice(n, 1)
			}, "×", 8, es)]))), 128))]),
			Z("button", {
				id: "addMatch",
				type: "button",
				class: "button secondary",
				disabled: e.form.pairs.length >= 8,
				onClick: n[4] ||= (t) => e.form.pairs.push({
					left: "",
					right: "",
					leftImage: "",
					rightImage: ""
				})
			}, F(e.t("addRelation")), 9, ts)
		])) : ["classify", "ordering"].includes(e.form.type) ? (Y(), X("fieldset", {
			key: 4,
			id: "classifyField",
			class: M({ "ordering-mode": e.form.type === "ordering" })
		}, [
			Z("legend", null, F(e.t(e.form.type === "ordering" ? "positions" : "categories")), 1),
			Z("div", ns, [(Y(!0), X(J, null, K(e.form.categories, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row"
			}, [G(Z("input", {
				"onUpdate:modelValue": (e) => t.name = e,
				class: "category-name",
				maxlength: "120",
				readonly: e.form.type === "ordering",
				"aria-label": e.t("category")
			}, null, 8, rs), [[$, t.name]]), Z("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (e) => o(n)
			}, "×", 8, is)]))), 128))]),
			Z("button", {
				id: "addCategory",
				type: "button",
				class: "button secondary",
				disabled: e.form.categories.length >= 12,
				onClick: n[5] ||= (t) => e.form.categories.push({ name: e.form.type === "ordering" ? String(e.form.categories.length + 1) : "" })
			}, F(e.t(e.form.type === "ordering" ? "addPosition" : "addCategory")), 9, as),
			Z("legend", null, F(e.t(e.form.type === "ordering" ? "steps" : "items")), 1),
			Z("div", os, [(Y(!0), X(J, null, K(e.form.items, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row classify-row"
			}, [
				Z("div", null, [
					G(Z("input", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "classify-text",
						maxlength: "120",
						"aria-label": e.t("item")
					}, null, 8, ss), [[$, t.text]]),
					Z("label", cs, [di(F(e.t("imageLeft")), 1), Z("input", {
						class: "classify-image",
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						onChange: (e) => s(e, t)
					}, null, 40, ls)]),
					t.image ? (Y(), X("img", {
						key: 0,
						src: t.image,
						class: "editor-thumbnail",
						alt: ""
					}, null, 8, us)) : Q("", !0)
				]),
				G(Z("select", {
					"onUpdate:modelValue": (e) => t.category = e,
					class: "classify-category",
					"aria-label": e.t("category")
				}, [(Y(!0), X(J, null, K(e.form.categories, (t, n) => (Y(), X("option", {
					key: n,
					value: n
				}, F(t.name || e.t("category") + " " + (n + 1)), 9, fs))), 128))], 8, ds), [[
					Fa,
					t.category,
					void 0,
					{ number: !0 }
				]]),
				Z("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.items.splice(n, 1)
				}, "×", 8, ps)
			]))), 128))]),
			Z("button", {
				id: "addClassifyItem",
				type: "button",
				class: "button secondary",
				disabled: e.form.items.length >= 12,
				onClick: n[6] ||= (t) => e.form.items.push({
					text: "",
					category: 0,
					image: ""
				})
			}, F(e.t(e.form.type === "ordering" ? "addStep" : "addItem")), 9, ms)
		], 2)) : [
			"fill-blanks",
			"drag-text",
			"mark-words"
		].includes(e.form.type) ? (Y(), X("fieldset", {
			key: 5,
			id: {
				"fill-blanks": "fillBlanks",
				"drag-text": "dragText",
				"mark-words": "markWords"
			}[e.form.type] + "Field"
		}, [
			Z("legend", null, F(e.t(e.form.type === "fill-blanks" ? "fillText" : e.form.type === "drag-text" ? "dragTextText" : "markWordsText")), 1),
			G(Z("textarea", {
				id: {
					"fill-blanks": "fillBlanks",
					"drag-text": "dragText",
					"mark-words": "markWords"
				}[e.form.type] + "Text",
				"onUpdate:modelValue": n[7] ||= (t) => e.form.text = t,
				maxlength: "5000"
			}, null, 8, gs), [[$, e.form.text]]),
			Z("small", null, F(e.t("fillHint")), 1)
		], 8, hs)) : e.form.type === "find-words" ? (Y(), X("fieldset", _s, [
			Z("legend", null, F(e.t("findWordsList")), 1),
			Z("div", vs, [(Y(!0), X(J, null, K(e.form.words, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row"
			}, [G(Z("input", {
				"onUpdate:modelValue": (t) => e.form.words[n] = t,
				class: "find-word",
				maxlength: "15",
				"aria-label": e.t("findWordsPlaceholder")
			}, null, 8, ys), [[$, e.form.words[n]]]), Z("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.words.splice(n, 1)
			}, "×", 8, bs)]))), 128))]),
			Z("button", {
				id: "addFindWord",
				type: "button",
				class: "button secondary",
				disabled: e.form.words.length >= 12,
				onClick: n[8] ||= (t) => e.form.words.push("")
			}, F(e.t("addWord")), 9, xs)
		])) : e.form.type === "dialog-cards" ? (Y(), X("fieldset", Ss, [
			Z("legend", null, F(e.t("dialogCardsList")), 1),
			Z("div", Cs, [(Y(!0), X(J, null, K(e.form.cards, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row"
			}, [
				G(Z("input", {
					"onUpdate:modelValue": (e) => t.front = e,
					class: "dialog-front",
					maxlength: "500",
					"aria-label": e.t("dialogFront")
				}, null, 8, ws), [[$, t.front]]),
				G(Z("input", {
					"onUpdate:modelValue": (e) => t.back = e,
					class: "dialog-back",
					maxlength: "500",
					"aria-label": e.t("dialogBack")
				}, null, 8, Ts), [[$, t.back]]),
				Z("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.cards.splice(n, 1)
				}, "×", 8, Es)
			]))), 128))]),
			Z("button", {
				id: "addDialogCard",
				type: "button",
				class: "button secondary",
				disabled: e.form.cards.length >= 15,
				onClick: n[9] ||= (t) => e.form.cards.push({
					front: "",
					back: ""
				})
			}, F(e.t("addDialogCard")), 9, Ds)
		])) : e.form.type === "crossword" ? (Y(), X("fieldset", Os, [
			Z("legend", null, F(e.t("crosswordList")), 1),
			Z("div", ks, [(Y(!0), X(J, null, K(e.form.words, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row"
			}, [
				G(Z("input", {
					"onUpdate:modelValue": (e) => t.answer = e,
					class: "crossword-answer",
					maxlength: "20",
					"aria-label": e.t("crosswordAnswer")
				}, null, 8, As), [[$, t.answer]]),
				G(Z("input", {
					"onUpdate:modelValue": (e) => t.clue = e,
					class: "crossword-clue",
					maxlength: "300",
					"aria-label": e.t("crosswordClue")
				}, null, 8, js), [[$, t.clue]]),
				Z("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.words.splice(n, 1)
				}, "×", 8, Ms)
			]))), 128))]),
			Z("button", {
				id: "addCrosswordWord",
				type: "button",
				class: "button secondary",
				disabled: e.form.words.length >= 10,
				onClick: n[10] ||= (t) => e.form.words.push({
					answer: "",
					clue: ""
				})
			}, F(e.t("addCrosswordWord")), 9, Ns)
		])) : e.form.type === "compound" ? (Y(), X("fieldset", Ps, [
			Z("legend", null, F(e.t("compound.steps")), 1),
			Z("div", Fs, [(Y(!0), X(J, null, K(e.form.activities, (t, n) => (Y(), ni(ko, {
				key: t,
				step: t,
				index: n,
				t: e.t,
				disabled: e.busy,
				onRemove: (t) => e.form.activities.splice(n, 1)
			}, null, 8, [
				"step",
				"index",
				"t",
				"disabled",
				"onRemove"
			]))), 128))]),
			Z("button", {
				id: "addCompoundStep",
				type: "button",
				class: "button secondary",
				disabled: e.form.activities.length >= 10,
				onClick: n[11] ||= (t) => e.form.activities.push(H($a)())
			}, F(e.t("compound.add")), 9, Is),
			Z("button", {
				id: "addCompoundFromBank",
				type: "button",
				class: "button secondary",
				disabled: e.form.activities.length >= 10,
				onClick: n[12] ||= (e) => r("bank")
			}, F(e.t("bank.add")), 9, Ls),
			Z("label", null, [Z("span", null, F(e.t("compound.pass")), 1), G(Z("input", {
				id: "compoundPass",
				"onUpdate:modelValue": n[13] ||= (t) => e.form.passPercentage = t,
				type: "number",
				min: "0",
				max: "100"
			}, null, 512), [[
				$,
				e.form.passPercentage,
				void 0,
				{ number: !0 }
			]])]),
			Z("label", Rs, [G(Z("input", {
				id: "compoundRandom",
				"onUpdate:modelValue": n[14] ||= (t) => e.form.randomQuestions = t,
				type: "checkbox"
			}, null, 512), [[Ma, e.form.randomQuestions]]), Z("span", null, F(e.t("compound.random")), 1)])
		])) : Q("", !0);
	}
}, Bs = {
	key: 0,
	role: "alert"
}, Vs = {
	__name: "H5PPlayer",
	props: {
		base: String,
		activity: Object,
		onStatement: Function
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ V(), r = /* @__PURE__ */ V(!1), i = 0, a = () => {};
		async function o() {
			return window._h5pReady || (window._h5pReady = new Promise((e, n) => {
				let r = document.createElement("script");
				r.src = t.base + "/assets/main.bundle.js", r.onload = () => {
					window._h5pCtor = window.H5PStandalone, e();
				}, r.onerror = () => {
					window._h5pReady = null, n(/* @__PURE__ */ Error("runtime"));
				}, document.head.append(r);
			})), await window._h5pReady, window._h5pCtor || window.H5PStandalone;
		}
		return kn(() => t.activity?.id, async (e) => {
			let s = ++i;
			if (a(), r.value = !1, await dn(), e && n.value) {
				n.value.replaceChildren();
				try {
					let r = await o();
					if (s !== i) return;
					let c = document.createElement("div");
					if (c.id = "h5p-container", n.value.replaceChildren(c), await new r.H5P(c, {
						h5pJsonPath: `${t.base}/api/activities/${e}/h5p`,
						librariesPath: t.base + "/h5p-libraries",
						frameJs: t.base + "/assets/frame.bundle.js",
						frameCss: t.base + "/assets/h5p.css",
						frame: !0,
						fullScreen: !0
					}), s !== i) {
						c.remove();
						return;
					}
					let l = window.H5P?.externalDispatcher, u = (n) => {
						s === i && t.onStatement?.(n.data?.statement, e);
					};
					l?.on("xAPI", u);
					let d = () => {
						if (s !== i || t.activity?.type !== "crossword") return;
						let e = c.querySelector("iframe"), n = e?.contentDocument;
						if (!e || !n) return;
						let r = n.querySelector(".h5p-crossword");
						e.style.height = `${Math.max(r?.scrollHeight || n.body?.scrollHeight || 0, 420) + 8}px`;
					}, f = [setTimeout(d, 100), setTimeout(d, 500)];
					window.addEventListener("resize", d, { passive: !0 }), a = () => {
						l?.off?.("xAPI", u), f.forEach(clearTimeout), window.removeEventListener("resize", d), c.remove();
					};
				} catch {
					s === i && (r.value = !0);
				}
			}
		}, { immediate: !0 }), Jn(() => {
			++i, a();
		}), (e, t) => (Y(), X(J, null, [Z("div", {
			id: "player",
			ref_key: "container",
			ref: n
		}, null, 512), r.value ? (Y(), X("p", Bs, [Xn(e.$slots, "default")])) : Q("", !0)], 64));
	}
}, Hs = {
	id: "playReviews",
	class: "panel"
}, Us = { class: "section-heading" }, Ws = ["disabled"], Gs = {
	key: 0,
	role: "alert",
	class: "error"
}, Ks = {
	key: 1,
	id: "reviewMessage",
	role: "status"
}, qs = {
	key: 2,
	role: "status"
}, Js = { key: 3 }, Ys = {
	id: "playReviewList",
	class: "library-grid"
}, Xs = [
	"data-review-id",
	"disabled",
	"onClick"
], Zs = { class: "actions" }, Qs = ["disabled"], $s = ["disabled"], ec = {
	key: 4,
	id: "playReviewDetail"
}, tc = ["disabled"], nc = { class: "actions" }, rc = ["disabled"], ic = ["disabled"], ac = ["disabled"], oc = {
	__name: "ReviewPanel",
	props: {
		base: String,
		t: Function
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ V([]), r = /* @__PURE__ */ V(null), i = /* @__PURE__ */ V(!1), a = /* @__PURE__ */ V(""), o = /* @__PURE__ */ V(""), s = /* @__PURE__ */ V(""), c = /* @__PURE__ */ V(0), l = /* @__PURE__ */ V(!1), u = 0, d = !0;
		async function f(e, n = {}) {
			let r = await fetch(t.base + "/api/reviews" + e, {
				credentials: "same-origin",
				cache: "no-store",
				...n
			}), i = await r.json();
			if (!r.ok) throw Error();
			return i;
		}
		async function p(e = c.value) {
			if (i.value) return;
			i.value = !0;
			let t = ++u;
			a.value = "", r.value = null, s.value = "";
			try {
				let r = await f("?offset=" + e);
				if (t !== u || !d) return;
				n.value = r.items, c.value = r.offset, l.value = r.more;
			} catch {
				t === u && (a.value = "reviewError", n.value = []);
			} finally {
				t === u && (i.value = !1);
			}
		}
		async function m(e) {
			if (i.value) return;
			i.value = !0;
			let t = ++u;
			r.value = null, s.value = "", a.value = "", o.value = "";
			try {
				let n = await f("/" + e);
				t === u && d && (r.value = n);
			} catch {
				t === u && (a.value = "reviewError");
			} finally {
				t === u && (i.value = !1);
			}
		}
		async function h(e) {
			if (i.value || !r.value) return;
			if (e === "return" && !s.value.trim()) {
				a.value = "feedbackRequired";
				return;
			}
			i.value = !0;
			let t = ++u, c = r.value;
			a.value = "";
			try {
				let i = await f("/" + c.id, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Play-Review": "1"
					},
					body: JSON.stringify({
						decision: e,
						revision: c.revision,
						feedback: s.value.trim()
					})
				});
				if (t !== u || !d) return;
				r.value = {
					...c,
					...i
				}, n.value = n.value.map((e) => e.id === c.id ? {
					...e,
					...i
				} : e), o.value = e === "approve" ? "reviewApproved" : e === "return" ? "reviewReturned" : "reviewWithdrawn";
			} catch {
				t === u && (a.value = "reviewDecisionError");
			} finally {
				t === u && (i.value = !1);
			}
		}
		function g() {
			d = !1, ++u, n.value = [], r.value = null, s.value = "", i.value = !1;
		}
		function _(e) {
			e.persisted && (d = !0, p());
		}
		return qn(() => {
			p(), window.addEventListener("pagehide", g), window.addEventListener("pageshow", _);
		}), Jn(() => {
			g(), window.removeEventListener("pagehide", g), window.removeEventListener("pageshow", _);
		}), (t, u) => (Y(), X("section", Hs, [
			Z("div", Us, [Z("h1", null, F(e.t("reviewsTitle")), 1), Z("button", {
				id: "refreshReviews",
				class: "button secondary",
				disabled: i.value,
				onClick: u[0] ||= (e) => p()
			}, F(e.t("refresh")), 9, Ws)]),
			a.value ? (Y(), X("p", Gs, F(e.t(a.value)), 1)) : Q("", !0),
			o.value ? (Y(), X("p", Ks, F(e.t(o.value)), 1)) : Q("", !0),
			i.value ? (Y(), X("p", qs, F(e.t("libraryLoading")), 1)) : Q("", !0),
			!i.value && !n.value.length ? (Y(), X("p", Js, F(e.t("reviewsEmpty")), 1)) : Q("", !0),
			Z("div", Ys, [(Y(!0), X(J, null, K(n.value, (t) => (Y(), X("article", {
				key: t.id,
				class: "library-card"
			}, [
				Z("h2", null, F(t.title), 1),
				Z("p", null, F(t.class_name) + " · " + F(e.t("reviewStatus." + t.status)), 1),
				Z("button", {
					class: "button",
					"data-review-id": t.id,
					disabled: i.value,
					onClick: (e) => m(t.id)
				}, F(e.t("reviewOpen")), 9, Xs)
			]))), 128))]),
			Z("div", Zs, [Z("button", {
				id: "reviewsPrev",
				class: "button secondary",
				disabled: i.value || c.value === 0,
				onClick: u[1] ||= (e) => p(Math.max(0, c.value - 25))
			}, F(e.t("libraryPrev")), 9, Qs), Z("button", {
				id: "reviewsNext",
				class: "button secondary",
				disabled: i.value || !l.value,
				onClick: u[2] ||= (e) => p(c.value + 25)
			}, F(e.t("libraryNext")), 9, $s)]),
			r.value ? (Y(), X("section", ec, [
				Z("h2", null, F(r.value.title), 1),
				Z("p", null, F(e.t("reviewStatus." + r.value.status)), 1),
				si(Vs, {
					base: e.base,
					activity: r.value.activity
				}, {
					default: wn(() => [di(F(e.t("playerError")), 1)]),
					_: 1
				}, 8, ["base", "activity"]),
				Z("label", null, [di(F(e.t("reviewFeedback")), 1), G(Z("textarea", {
					id: "reviewFeedback",
					"onUpdate:modelValue": u[3] ||= (e) => s.value = e,
					maxlength: "2000",
					disabled: i.value
				}, null, 8, tc), [[$, s.value]])]),
				Z("div", nc, [
					r.value.status === "pending" ? (Y(), X("button", {
						key: 0,
						id: "approvePlay",
						class: "button",
						disabled: i.value,
						onClick: u[4] ||= (e) => h("approve")
					}, F(e.t("reviewApprove")), 9, rc)) : Q("", !0),
					r.value.status === "pending" ? (Y(), X("button", {
						key: 1,
						id: "returnPlay",
						class: "button secondary",
						disabled: i.value,
						onClick: u[5] ||= (e) => h("return")
					}, F(e.t("reviewReturn")), 9, ic)) : Q("", !0),
					r.value.status === "approved" ? (Y(), X("button", {
						key: 2,
						id: "withdrawPlay",
						class: "button secondary",
						disabled: i.value,
						onClick: u[6] ||= (e) => h("withdraw")
					}, F(e.t("unpublishRecursos")), 9, ac)) : Q("", !0)
				])
			])) : Q("", !0)
		]));
	}
}, sc = { class: "topbar" }, cc = ["href"], lc = { class: "language" }, uc = ["value", "disabled"], dc = { class: "shell" }, fc = {
	key: 0,
	class: "actions"
}, pc = ["href"], mc = {
	key: 1,
	role: "status"
}, hc = {
	id: "home",
	class: "panel hero"
}, gc = {
	key: 0,
	class: "test-phase",
	role: "note"
}, _c = {
	key: 1,
	id: "demoNotice",
	class: "test-phase demo-notice",
	role: "note"
}, vc = ["href"], yc = {
	key: 2,
	class: "muted"
}, bc = { class: "actions" }, xc = ["href"], Sc = { class: "type-grid" }, Cc = [
	"data-type",
	"disabled",
	"onClick"
], wc = { class: "type-icon" }, Tc = { class: "actions" }, Ec = {
	id: "editor",
	class: "panel",
	"aria-labelledby": "editorTitle"
}, Dc = { class: "section-heading" }, Oc = { id: "editorTitle" }, kc = ["disabled"], Ac = ["disabled"], jc = ["placeholder"], Mc = ["placeholder"], Nc = { id: "catalogField" }, Pc = ["id", "onUpdate:modelValue"], Fc = ["value"], Ic = ["value"], Lc = ["value"], Rc = {
	id: "formError",
	class: "error",
	role: "alert"
}, zc = { class: "actions" }, Bc = ["disabled"], Vc = ["disabled"], Hc = {
	key: 2,
	id: "previewPanel",
	class: "panel",
	"aria-labelledby": "previewTitle"
}, Uc = { class: "section-heading" }, Wc = { class: "eyebrow" }, Gc = { id: "previewTitle" }, Kc = ["disabled"], qc = {
	key: 0,
	id: "previewActions",
	class: "actions"
}, Jc = ["disabled"], Yc = {
	key: 1,
	id: "savedActions",
	class: "actions"
}, Xc = ["href"], Zc = ["disabled"], Qc = ["disabled"], $c = ["disabled"], el = ["disabled"], tl = {
	key: 2,
	id: "submissionStatus",
	role: "status"
}, nl = { key: 0 }, rl = {
	key: 3,
	class: "error",
	role: "alert"
}, il = {
	id: "library",
	class: "panel",
	"aria-labelledby": "libraryTitle"
}, al = { class: "section-heading" }, ol = { id: "libraryTitle" }, sl = ["disabled"], cl = ["placeholder", "aria-label"], ll = ["aria-label"], ul = { value: "" }, dl = ["value"], fl = ["disabled"], pl = {
	id: "libraryStatus",
	class: "library-status",
	role: "status"
}, ml = {
	id: "libraryList",
	class: "library-grid"
}, hl = {
	key: 0,
	class: "library-status"
}, gl = { class: "library-meta" }, _l = { class: "library-card-actions" }, vl = ["href"], yl = ["href"], bl = ["disabled", "onClick"], xl = { class: "actions" }, Sl = ["disabled"], Cl = ["disabled"], wl = { class: "library-admin" }, Tl = ["disabled"], El = { class: "muted" }, Dl = { id: "catalogAdminEditor" }, Ol = { class: "muted" }, kl = ["id", "onUpdate:modelValue"], Al = ["disabled"], jl = {
	id: "catalogStatus",
	class: "muted",
	role: "status"
}, Ml = { class: "section-heading" }, Nl = {
	type: "submit",
	class: "button secondary"
}, Pl = {
	id: "compoundBankList",
	class: "bank-list"
}, Fl = {
	key: 0,
	class: "library-status"
}, Il = {
	key: 1,
	role: "alert"
}, Ll = {
	key: 2,
	class: "library-status"
}, Rl = { class: "library-meta" }, zl = ["disabled", "onClick"], Bl = {
	key: 4,
	class: "error",
	role: "alert"
}, Vl = {
	__name: "PlayApp",
	setup(e) {
		let t = ao(), { capabilities: n, submission: r, integrated: i, submitReview: a, loadPublication: o, base: s, TYPES: c, TYPE_LABELS: l, language: u, t: d, view: f, ready: p, busy: m, form: h, saved: g, formError: _, message: v, messageError: y, savingDisabled: b, demoUrl: x, catalog: S, catalogDraft: C, catalogMessage: w, library: T, bank: E, bankDialog: ee, adminInput: D, adminToken: te, published: O, editorTitle: k, choose: ne, go: A, changeLanguage: re, saveActivity: ie, openLibrary: ae, filterLibrary: oe, applyToken: se, removeActivity: ce, publication: j, saveCatalog: le, openBank: ue, loadBank: de, addFromBank: fe, closeBank: N, copy: pe, onStatement: me } = t, he = [
			"✓",
			"¿?",
			"▦",
			"↔",
			"⇄",
			"☷",
			"＿",
			"⌕",
			"↔",
			"✓",
			"▣",
			"▦",
			"➜"
		];
		function ge(e) {
			let t = u.value === "va" ? "ca" : u.value;
			return S.value.labels?.[e]?.[t] || e;
		}
		return (e, o) => (Y(), X(J, null, [Z("header", sc, [Z("a", {
			class: "brand",
			href: H(s) + "/"
		}, "EduTicTac Play", 8, cc), Z("label", lc, [Z("span", null, F(H(d)("language")), 1), Z("select", {
			id: "language",
			value: H(u),
			disabled: H(m),
			onChange: o[0] ||= (e) => H(re)(e.target.value)
		}, [...o[33] ||= [
			Z("option", { value: "es" }, "ES", -1),
			Z("option", { value: "ca" }, "CA", -1),
			Z("option", { value: "va" }, "VA", -1),
			Z("option", { value: "en" }, "EN", -1)
		]], 40, uc)])]), Z("main", dc, [
			H(i) && !H(n).can_publish && !H(n).can_submit ? (Y(), X("p", fc, [Z("a", {
				class: "button secondary",
				href: H(s) + "/api/publication/login"
			}, F(H(d)("teacherLogin")), 9, pc), Z("span", null, F(H(d)("loginToSave")), 1)])) : Q("", !0),
			H(p) ? Q("", !0) : (Y(), X("p", mc, F(H(d)("libraryLoading")), 1)),
			G(Z("section", hc, [
				o[34] ||= Z("p", { class: "eyebrow" }, "EduTicTac Commons", -1),
				Z("h1", null, F(H(d)("homeTitle")), 1),
				Z("p", null, F(H(d)("homeIntro")), 1),
				H(x) ? (Y(), X("p", gc, [Z("strong", null, F(H(d)("testPhaseTitle")), 1), di(" " + F(H(d)("testPhaseNotice")), 1)])) : Q("", !0),
				H(x) ? (Y(), X("p", _c, [
					Z("strong", null, F(H(d)("demoTitle")), 1),
					di(" " + F(H(d)("demoNotice")) + " ", 1),
					Z("a", {
						id: "demoLink",
						href: H(x)
					}, F(H(d)("demoLink")), 9, vc)
				])) : (Y(), X("p", yc, F(H(d)(H(i) ? "productionNotice" : "anonymousNotice")), 1)),
				Z("div", bc, [H(n).can_review ? (Y(), X("button", {
					key: 0,
					id: "openReviews",
					class: "button",
					onClick: o[1] ||= (e) => H(A)("reviews")
				}, F(H(d)("reviewsTitle")), 1)) : Q("", !0), H(i) && !H(n).can_publish && !H(n).can_submit ? (Y(), X("a", {
					key: 1,
					id: "playLogin",
					class: "button secondary",
					href: H(s) + "/api/publication/login"
				}, F(H(d)("teacherLogin")), 9, xc)) : Q("", !0)]),
				Z("div", Sc, [(Y(!0), X(J, null, K(H(c), (e, t) => (Y(), X("button", {
					key: e,
					class: "type-card",
					"data-type": e,
					disabled: H(m),
					onClick: (t) => H(ne)(e)
				}, [
					Z("span", wc, F(he[t]), 1),
					Z("strong", null, F(H(d)(H(l)[e])), 1),
					Z("small", null, F(H(d)(e === "compound" ? "compound.help" : H(l)[e] + "Help")), 1)
				], 8, Cc))), 128))]),
				Z("div", Tc, [Z("button", {
					id: "openLibrary",
					type: "button",
					class: "button secondary",
					onClick: o[2] ||= (...e) => H(ae) && H(ae)(...e)
				}, F(H(d)("libraryOpen")), 1)])
			], 512), [[Zi, H(f) === "home" && H(p)]]),
			G(Z("section", Ec, [Z("div", Dc, [Z("div", null, [o[35] ||= Z("p", { class: "eyebrow" }, "EduTicTac Play", -1), Z("h1", Oc, F(H(k)), 1)]), Z("button", {
				id: "backHome",
				class: "button secondary",
				disabled: H(m),
				onClick: o[3] ||= (e) => H(A)("home")
			}, F(H(d)("back")), 9, kc)]), Z("form", {
				id: "activityForm",
				novalidate: "",
				onSubmit: o[10] ||= Ha((e) => H(ie)(!0), ["prevent"])
			}, [
				Z("fieldset", {
					class: "editor-controls",
					disabled: H(m)
				}, [
					Z("label", null, [Z("span", null, F(H(d)("title")), 1), G(Z("input", {
						id: "title",
						"onUpdate:modelValue": o[4] ||= (e) => H(h).title = e,
						maxlength: "200",
						required: "",
						placeholder: H(d)("titlePlaceholder")
					}, null, 8, jc), [[$, H(h).title]])]),
					Z("label", null, [Z("span", null, F(H(d)("question")), 1), G(Z("textarea", {
						id: "question",
						"onUpdate:modelValue": o[5] ||= (e) => H(h).question = e,
						maxlength: "2000",
						required: "",
						placeholder: H(d)("questionPlaceholder")
					}, null, 8, Mc), [[$, H(h).question]])]),
					(Y(), ni(zs, {
						key: H(h),
						form: H(h),
						t: H(d),
						busy: H(m),
						onBank: H(ue),
						onImageError: o[6] ||= (e) => _.value = H(d)("imageError"),
						onImageBusy: o[7] ||= (e) => H(t).imageTasks.value += e
					}, null, 8, [
						"form",
						"t",
						"busy",
						"onBank"
					])),
					Z("fieldset", Nc, [
						Z("legend", null, F(H(d)("catalog.legend")), 1),
						(Y(), X(J, null, K([
							{
								id: "subject",
								key: "subject",
								list: "subjects",
								label: "subject"
							},
							{
								id: "educationalStage",
								key: "educational_stage",
								list: "educational_stages",
								label: "stage"
							},
							{
								id: "educationalLevel",
								key: "educational_level",
								list: "levels",
								label: "level"
							}
						], (e) => Z("label", { key: e.id }, [Z("span", null, F(H(d)("catalog." + e.label)), 1), G(Z("select", {
							id: e.id,
							"onUpdate:modelValue": (t) => H(h)[e.key] = t
						}, [
							o[36] ||= Z("option", { value: "" }, null, -1),
							H(h)[e.key] && !(H(S)[e.list] || []).includes(H(h)[e.key]) ? (Y(), X("option", {
								key: 0,
								value: H(h)[e.key]
							}, F(ge(H(h)[e.key])), 9, Fc)) : Q("", !0),
							(Y(!0), X(J, null, K(H(S)[e.list] || [], (e) => (Y(), X("option", {
								key: e,
								value: e
							}, F(ge(e)), 9, Ic))), 128))
						], 8, Pc), [[Fa, H(h)[e.key]]])])), 64)),
						Z("label", null, [Z("span", null, F(H(d)("catalog.tags")), 1), G(Z("select", {
							id: "activityTags",
							"onUpdate:modelValue": o[8] ||= (e) => H(h).tags = e,
							multiple: "",
							size: "4"
						}, [(Y(!0), X(J, null, K([.../* @__PURE__ */ new Set([...H(S).tags || [], ...H(h).tags || []])], (e) => (Y(), X("option", {
							key: e,
							value: e
						}, F(ge(e)), 9, Lc))), 128))], 512), [[Fa, H(h).tags]])])
					])
				], 8, Ac),
				Z("p", Rc, F(H(_)), 1),
				Z("div", zc, [Z("button", {
					id: "preview",
					type: "submit",
					class: "button",
					disabled: H(b)
				}, F(H(d)("preview")), 9, Bc), Z("button", {
					id: "save",
					type: "button",
					class: "button secondary",
					disabled: H(b),
					onClick: o[9] ||= (e) => H(ie)(!1)
				}, F(H(d)("save")), 9, Vc)])
			], 32)], 512), [[Zi, H(f) === "editor" && H(p)]]),
			H(f) === "previewPanel" && H(g) ? (Y(), X("section", Hc, [
				Z("div", Uc, [Z("div", null, [Z("p", Wc, F(H(d)("previewEyebrow")), 1), Z("h1", Gc, F(H(g).title), 1)]), Z("button", {
					id: "edit",
					class: "button secondary",
					disabled: H(m),
					onClick: o[11] ||= (e) => H(A)("editor")
				}, F(H(d)("edit")), 9, Kc)]),
				si(Vs, {
					base: H(s),
					activity: H(g),
					"on-statement": H(me)
				}, {
					default: wn(() => [di(F(H(d)("playerError")), 1)]),
					_: 1
				}, 8, [
					"base",
					"activity",
					"on-statement"
				]),
				H(g).id.startsWith("preview-") ? (Y(), X("div", qc, [Z("button", {
					id: "savePreview",
					class: "button",
					disabled: H(b),
					onClick: o[12] ||= (e) => H(ie)(!1)
				}, F(H(d)("save")), 9, Jc), Z("span", null, F(H(d)("previewOnly")), 1)])) : (Y(), X("div", Yc, [
					Z("a", {
						id: "download",
						class: "button",
						href: H(s) + "/api/activities/" + H(g).id + "/download"
					}, F(H(d)("download")), 9, Xc),
					!H(O) && H(n).can_publish ? (Y(), X("button", {
						key: 0,
						id: "publishRecursos",
						class: "button",
						disabled: H(m),
						onClick: o[13] ||= (e) => H(j)(!1)
					}, F(H(d)("publishRecursos")), 9, Zc)) : H(O) && H(n).can_publish ? (Y(), X("button", {
						key: 1,
						id: "unpublishRecursos",
						class: "button secondary",
						disabled: H(m),
						onClick: o[14] ||= (e) => H(j)(!0)
					}, F(H(d)("unpublishRecursos")), 9, Qc)) : Q("", !0),
					H(n).can_submit ? (Y(), X("button", {
						key: 2,
						id: "submitPlayReview",
						class: "button",
						disabled: H(m) || ["pending", "approved"].includes(H(r)?.status),
						onClick: o[15] ||= (...e) => H(a) && H(a)(...e)
					}, F(H(d)("reviewSubmit")), 9, $c)) : Q("", !0),
					Z("button", {
						id: "copy",
						class: "button secondary",
						onClick: o[16] ||= (...e) => H(pe) && H(pe)(...e)
					}, F(H(d)("copy")), 1),
					H(g).owned ? (Y(), X("button", {
						key: 3,
						id: "deleteSaved",
						class: "button secondary",
						disabled: H(m),
						onClick: o[17] ||= (e) => H(ce)(H(g).id)
					}, F(H(d)("deleteActivity")), 9, el)) : Q("", !0)
				])),
				H(r) ? (Y(), X("p", tl, [di(F(H(d)("reviewStatus." + H(r).status)), 1), H(r).feedback ? (Y(), X("span", nl, " · " + F(H(r).feedback), 1)) : Q("", !0)])) : Q("", !0),
				Z("p", {
					id: "savedMessage",
					class: M({ error: H(y) }),
					role: "status"
				}, F(H(v) ? H(d)(H(v)) : ""), 3),
				H(_) ? (Y(), X("p", rl, F(H(_)), 1)) : Q("", !0)
			])) : Q("", !0),
			G(Z("section", il, [
				Z("div", al, [Z("div", null, [o[37] ||= Z("p", { class: "eyebrow" }, "EduTicTac Play", -1), Z("h1", ol, F(H(d)("libraryTitle")), 1)]), Z("button", {
					id: "libraryBack",
					class: "button secondary",
					disabled: H(m),
					onClick: o[18] ||= (e) => H(A)("home")
				}, F(H(d)("back")), 9, sl)]),
				Z("form", {
					class: "library-filters",
					onSubmit: o[22] ||= Ha((e) => H(oe)(), ["prevent"])
				}, [
					G(Z("input", {
						id: "librarySearch",
						"onUpdate:modelValue": o[19] ||= (e) => H(T).term = e,
						type: "search",
						placeholder: H(d)("librarySearchPlaceholder"),
						"aria-label": H(d)("libraryFilter")
					}, null, 8, cl), [[$, H(T).term]]),
					G(Z("select", {
						id: "libraryType",
						"onUpdate:modelValue": o[20] ||= (e) => H(T).type = e,
						"aria-label": H(d)("compound.type"),
						onChange: o[21] ||= (e) => H(oe)()
					}, [Z("option", ul, F(H(d)("libraryAllTypes")), 1), (Y(!0), X(J, null, K(H(c), (e) => (Y(), X("option", {
						key: e,
						value: e
					}, F(H(d)(H(l)[e])), 9, dl))), 128))], 40, ll), [[Fa, H(T).type]]),
					Z("button", {
						id: "libraryFilter",
						type: "submit",
						class: "button secondary",
						disabled: H(m)
					}, F(H(d)("libraryFilter")), 9, fl)
				], 32),
				Z("p", pl, F(H(T).loading ? H(d)("libraryLoading") : H(T).error ? H(d)("libraryError") : H(d)("libraryStatus").replace(":from", H(T).total ? H(T).offset + 1 : 0).replace(":to", H(T).offset + H(T).items.length).replace(":total", H(T).total)), 1),
				Z("div", ml, [!H(T).loading && !H(T).error && !H(T).items.length ? (Y(), X("p", hl, F(H(d)("libraryEmpty")), 1)) : Q("", !0), (Y(!0), X(J, null, K(H(T).items, (e) => (Y(), X("article", {
					key: e.id,
					class: "library-card"
				}, [
					Z("h2", null, F(e.title), 1),
					Z("p", gl, F(H(d)(H(l)[e.type] || e.type)) + " · " + F((e.createdAt || "").slice(0, 10)) + F(e.owned ? " · " + H(d)("libraryYours") : ""), 1),
					Z("div", _l, [
						Z("a", {
							class: "button",
							href: H(s) + "/" + e.id
						}, F(H(d)("libraryOpenActivity")), 9, vl),
						Z("a", {
							class: "button secondary",
							href: H(s) + "/api/activities/" + e.id + "/download"
						}, F(H(d)("download")), 9, yl),
						e.owned || H(te) ? (Y(), X("button", {
							key: 0,
							type: "button",
							class: "button secondary",
							disabled: H(m),
							onClick: (t) => H(ce)(e.id, !0)
						}, F(H(d)("libraryDelete")), 9, bl)) : Q("", !0)
					])
				]))), 128))]),
				Z("div", xl, [Z("button", {
					id: "libraryPrev",
					type: "button",
					class: "button secondary",
					disabled: H(T).loading || H(m) || H(T).offset <= 0,
					onClick: o[23] ||= (e) => H(oe)(Math.max(0, H(T).offset - 12))
				}, F(H(d)("libraryPrev")), 9, Sl), Z("button", {
					id: "libraryNext",
					type: "button",
					class: "button secondary",
					disabled: H(T).loading || H(m) || !H(T).hasMore,
					onClick: o[24] ||= (e) => H(oe)(H(T).offset + 12)
				}, F(H(d)("libraryNext")), 9, Cl)]),
				Z("details", wl, [
					Z("summary", null, F(H(d)("libraryAdmin")), 1),
					Z("label", null, [Z("span", null, F(H(d)("libraryAdminToken")), 1), G(Z("input", {
						id: "libraryToken",
						"onUpdate:modelValue": o[25] ||= (e) => /* @__PURE__ */ B(D) ? D.value = e : null,
						type: "password",
						autocomplete: "off"
					}, null, 512), [[$, H(D)]])]),
					Z("button", {
						id: "libraryTokenSave",
						type: "button",
						class: "button secondary",
						disabled: H(m),
						onClick: o[26] ||= (...e) => H(se) && H(se)(...e)
					}, F(H(d)("libraryTokenSave")), 9, Tl),
					Z("p", El, F(H(d)("libraryAdminHelp")), 1),
					Z("div", Dl, [Z("fieldset", null, [
						Z("legend", null, F(H(d)("catalogAdmin")), 1),
						Z("p", Ol, F(H(d)("catalogAdminHelp")), 1),
						(Y(), X(J, null, K([
							"subjects",
							"educational_stages",
							"levels",
							"tags"
						], (e, t) => Z("label", { key: e }, [Z("span", null, F(H(d)("catalog." + [
							"subject",
							"stage",
							"level",
							"tags"
						][t])), 1), G(Z("textarea", {
							id: [
								"catalogSubjects",
								"catalogStages",
								"catalogLevels",
								"catalogTags"
							][t],
							"onUpdate:modelValue": (t) => H(C)[e] = t,
							rows: "3"
						}, null, 8, kl), [[$, H(C)[e]]])])), 64)),
						Z("button", {
							id: "catalogSave",
							type: "button",
							class: "button secondary",
							disabled: H(m),
							onClick: o[27] ||= (...e) => H(le) && H(le)(...e)
						}, F(H(d)("catalogSave")), 9, Al),
						Z("p", jl, F(H(w) ? H(d)(H(w)) : ""), 1)
					])])
				])
			], 512), [[Zi, H(f) === "library" && H(p)]]),
			H(f) === "reviews" && H(n).can_review ? (Y(), X(J, { key: 3 }, [Z("button", {
				id: "reviewsBack",
				class: "button secondary",
				onClick: o[28] ||= (e) => H(A)("home")
			}, F(H(d)("back")), 1), si(oc, {
				base: H(s),
				t: H(d)
			}, null, 8, ["base", "t"])], 64)) : Q("", !0),
			Z("dialog", {
				ref_key: "bankDialog",
				ref: ee,
				id: "compoundBankDialog",
				onCancel: o[32] ||= (...e) => H(N) && H(N)(...e)
			}, [Z("form", {
				method: "dialog",
				class: "bank-dialog",
				onSubmit: o[31] ||= Ha((...e) => H(N) && H(N)(...e), ["prevent"])
			}, [
				Z("div", Ml, [Z("h2", null, F(H(d)("bank.title")), 1), Z("button", Nl, F(H(d)("bank.close")), 1)]),
				Z("label", null, [Z("span", null, F(H(d)("bank.search")), 1), G(Z("input", {
					id: "compoundBankSearch",
					"onUpdate:modelValue": o[29] ||= (e) => H(E).term = e,
					type: "search",
					onInput: o[30] ||= (...e) => H(de) && H(de)(...e)
				}, null, 544), [[$, H(E).term]])]),
				Z("div", Pl, [H(E).loading ? (Y(), X("p", Fl, F(H(d)("bank.loading")), 1)) : H(E).error ? (Y(), X("p", Il, F(H(d)("libraryError")), 1)) : H(E).items.length ? Q("", !0) : (Y(), X("p", Ll, F(H(d)("bank.empty")), 1)), (Y(!0), X(J, null, K(H(E).items, (e) => (Y(), X("article", {
					key: e.id,
					class: "library-card"
				}, [Z("div", null, [Z("h3", null, F(e.title), 1), Z("p", Rl, F(H(d)(H(l)[e.type])), 1)]), Z("button", {
					type: "button",
					class: "button",
					disabled: H(m),
					onClick: (t) => H(fe)(e.id)
				}, F(H(d)("bank.addOne")), 9, zl)]))), 128))])
			], 32)], 544),
			H(f) === "home" && H(_) ? (Y(), X("p", Bl, F(H(_)), 1)) : Q("", !0)
		])], 64));
	}
};
// services/play/src/main.js
function Hl(e) {
	return Ka(Vl).mount(e);
}
export { Hl as mountPlay };
