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
}, ee = /-\w/g, D = E((e) => e.replace(ee, (e) => e.slice(1).toUpperCase())), O = /\B([A-Z])/g, te = E((e) => e.replace(O, "-$1").toLowerCase()), ne = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), k = E((e) => e ? `on${ne(e)}` : ""), A = (e, t) => !Object.is(e, t), j = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, re = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, M = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ie, ae = () => ie ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function oe(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? le(r) : oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var se = /;(?![^(]*\))/g, N = /:([^]+)/, ce = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function le(e) {
	let t = {};
	return e.replace(ce, (e) => e.startsWith("/*") ? "" : e).split(se).forEach((e) => {
		if (e) {
			let n = e.split(N);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function P(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = P(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ue = /* @__PURE__ */ e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function de(e) {
	return !!e || e === "";
}
function fe(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = F(e[i], t[i], n);
	return r;
}
function pe(e, t, n) {
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
function me(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? pe(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !F(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function he(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function F(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? he(e, t, n, fe) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : he(e, t, n, me) : String(e) === String(t))));
}
function ge(e, t) {
	return e.findIndex((e) => F(e, t));
}
var _e = (e) => !!(e && e.__v_isRef === !0), I = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? _e(e) ? I(e.value) : JSON.stringify(e, ve, 2) : String(e), ve = (e, t) => _e(t) ? ve(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ye(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ye(e)) } : _(t) ? ye(t) : v(t) && !d(t) && !C(t) ? String(t) : t, ye = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, L, be = class {
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
function xe() {
	return L;
}
var R, Se = /* @__PURE__ */ new WeakSet(), Ce = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, L && (L.active ? L.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Se.has(this) && (Se.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || De(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Be(this), Ae(this);
		let e = R, t = Ie;
		R = this, Ie = !0;
		try {
			return this.fn();
		} finally {
			je(this), R = e, Ie = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Pe(e);
			this.deps = this.depsTail = void 0, Be(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Se.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Me(this) && this.run();
	}
	get dirty() {
		return Me(this);
	}
}, we = 0, Te, Ee;
function De(e, t = !1) {
	e.flags |= 8, t ? (e.next = Ee, Ee = e) : (e.next = Te, Te = e);
}
function Oe() {
	we++;
}
function ke() {
	if (--we > 0) return;
	if (Ee) {
		let e = Ee;
		for (Ee = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Te;) {
		let t = Te;
		for (Te = void 0; t;) {
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
function Ae(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function je(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Pe(r), Fe(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Me(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ne(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ne(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ve) || (e.globalVersion = Ve, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Me(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = R, r = Ie;
	R = e, Ie = !0;
	try {
		Ae(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		R = n, Ie = r, je(e), e.flags &= -3;
	}
}
function Pe(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Pe(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Fe(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ie = !0, Le = [];
function Re() {
	Le.push(Ie), Ie = !1;
}
function ze() {
	let e = Le.pop();
	Ie = e === void 0 || e;
}
function Be(e) {
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
var Ve = 0, He = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ue = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!R || !Ie || R === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== R) t = this.activeLink = new He(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, We(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ve++, this.notify(e);
	}
	notify(e) {
		Oe();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			ke();
		}
	}
};
function We(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) We(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ge = /* @__PURE__ */ new WeakMap(), Ke = /* @__PURE__ */ Symbol(""), qe = /* @__PURE__ */ Symbol(""), Je = /* @__PURE__ */ Symbol("");
function z(e, t, n) {
	if (Ie && R) {
		let t = Ge.get(e);
		t || Ge.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ue()), r.map = t, r.key = n), r.track();
	}
}
function Ye(e, t, n, r, i, a) {
	let o = Ge.get(e);
	if (!o) {
		Ve++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Oe(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Je || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Je)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ke)), f(e) && s(o.get(qe)));
				break;
			case "delete":
				i || (s(o.get(Ke)), f(e) && s(o.get(qe)));
				break;
			case "set": f(e) && s(o.get(Ke));
		}
	}
	ke();
}
function Xe(e) {
	let t = /* @__PURE__ */ B(e);
	return t === e || (z(t, "iterate", Je), /* @__PURE__ */ It(e)) ? t : /* @__PURE__ */ Ft(e) ? /* @__PURE__ */ Pt(e) ? t.map((e) => Bt(zt(e))) : t.map(Bt) : t.map(zt);
}
function Ze(e) {
	return z(e = /* @__PURE__ */ B(e), "iterate", Je), e;
}
function Qe(e, t) {
	return /* @__PURE__ */ Ft(e) ? Bt(/* @__PURE__ */ Pt(e) ? zt(t) : t) : zt(t);
}
var $e = {
	__proto__: null,
	[Symbol.iterator]() {
		return et(this, Symbol.iterator, (e) => Qe(this, e));
	},
	concat(...e) {
		return Xe(this).concat(...e.map((e) => d(e) ? Xe(e) : e));
	},
	entries() {
		return et(this, "entries", (e) => (e[1] = Qe(this, e[1]), e));
	},
	every(e, t) {
		return rt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return rt(this, "filter", e, t, (e) => e.map((e) => Qe(this, e)), arguments);
	},
	find(e, t) {
		return rt(this, "find", e, t, (e) => Qe(this, e), arguments);
	},
	findIndex(e, t) {
		return rt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return rt(this, "findLast", e, t, (e) => Qe(this, e), arguments);
	},
	findLastIndex(e, t) {
		return rt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return rt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return at(this, "includes", e);
	},
	indexOf(...e) {
		return at(this, "indexOf", e);
	},
	join(e) {
		return Xe(this).join(e);
	},
	lastIndexOf(...e) {
		return at(this, "lastIndexOf", e);
	},
	map(e, t) {
		return rt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ot(this, "pop");
	},
	push(...e) {
		return ot(this, "push", e);
	},
	reduce(e, ...t) {
		return it(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return it(this, "reduceRight", e, t);
	},
	shift() {
		return ot(this, "shift");
	},
	some(e, t) {
		return rt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ot(this, "splice", e);
	},
	toReversed() {
		return Xe(this).toReversed();
	},
	toSorted(e) {
		return Xe(this).toSorted(e);
	},
	toSpliced(...e) {
		return Xe(this).toSpliced(...e);
	},
	unshift(...e) {
		return ot(this, "unshift", e);
	},
	values() {
		return et(this, "values", (e) => Qe(this, e));
	}
};
function et(e, t, n) {
	let r = Ze(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ It(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => tt(a.next(), n), i !== nt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => tt(a._next(), n);
	}
	return a;
}
function tt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var nt = Array.prototype;
function rt(e, t, n, r, i, a) {
	let o = Ze(e), s = o !== e && !/* @__PURE__ */ It(e), c = o[t];
	if (c !== nt[t]) {
		let t = c.apply(e, a);
		return s ? zt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Qe(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function it(e, t, n, r) {
	let i = Ze(e), a = i !== e && !/* @__PURE__ */ It(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Qe(e, t)), n.call(this, t, Qe(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Qe(e, c) : c;
}
function at(e, t, n) {
	let r = /* @__PURE__ */ B(e);
	z(r, "iterate", Je);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Lt(n[0]) ? (n[0] = /* @__PURE__ */ B(n[0]), r[t](...n)) : i;
}
function ot(e, t, n = []) {
	Re(), Oe();
	let r = (/* @__PURE__ */ B(e))[t].apply(e, n);
	return ke(), ze(), r;
}
var st = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ct = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function lt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ B(this);
	return z(t, "has", e), t.hasOwnProperty(e);
}
var ut = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Ot : Dt : i ? Et : Tt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = $e[t])) return e;
			if (t === "hasOwnProperty") return lt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ V(e) ? e : n);
		if ((_(t) ? ct.has(t) : st(t)) || (r || z(e, "get", t), i)) return o;
		if (/* @__PURE__ */ V(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Mt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Mt(o) : /* @__PURE__ */ At(o) : o;
	}
}, dt = class extends ut {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Ft(i);
			if (!/* @__PURE__ */ It(n) && !/* @__PURE__ */ Ft(n) && (i = /* @__PURE__ */ B(i), n = /* @__PURE__ */ B(n)), !a && /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ V(e) ? e : r);
		return e === /* @__PURE__ */ B(r) && s && (o ? A(n, i) && Ye(e, "set", t, n, i) : Ye(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ye(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && ct.has(t) || z(e, "has", t), n;
	}
	ownKeys(e) {
		return z(e, "iterate", d(e) ? "length" : Ke), Reflect.ownKeys(e);
	}
}, ft = class extends ut {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, pt = /* @__PURE__ */ new dt(), mt = /* @__PURE__ */ new ft(), ht = /* @__PURE__ */ new dt(!0), gt = (e) => e, _t = (e) => Reflect.getPrototypeOf(e);
function vt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ B(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? gt : t ? Bt : zt;
		return !t && z(a, "iterate", l ? qe : Ke), s(Object.create(u), { next() {
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
function yt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function bt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ B(r), a = /* @__PURE__ */ B(n);
			e || (A(n, a) && z(i, "get", n), z(i, "get", a));
			let { has: o } = _t(i), s = t ? gt : e ? Bt : zt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && z(/* @__PURE__ */ B(t), "iterate", Ke), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ B(n), i = /* @__PURE__ */ B(t);
			return e || (A(t, i) && z(r, "has", t), z(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ B(a), s = t ? gt : e ? Bt : zt;
			return !e && z(o, "iterate", Ke), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: yt("add"),
		set: yt("set"),
		delete: yt("delete"),
		clear: yt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ B(this), r = _t(n), i = /* @__PURE__ */ B(e), a = !t && !/* @__PURE__ */ It(e) && !/* @__PURE__ */ Ft(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), Ye(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ It(n) || /* @__PURE__ */ Ft(n) || (n = /* @__PURE__ */ B(n));
			let r = /* @__PURE__ */ B(this), { has: i, get: a } = _t(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ B(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && Ye(r, "set", e, n, s) : Ye(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ B(this), { has: n, get: r } = _t(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ B(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ye(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ B(this), t = e.size !== 0, n = e.clear();
			return t && Ye(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = vt(r, e, t);
	}), n;
}
function xt(e, t) {
	let n = bt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
}
var St = { get: /* @__PURE__ */ xt(!1, !1) }, Ct = { get: /* @__PURE__ */ xt(!1, !0) }, wt = { get: /* @__PURE__ */ xt(!0, !1) }, Tt = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap();
function kt(e) {
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
function At(e) {
	return /* @__PURE__ */ Ft(e) ? e : Nt(e, !1, pt, St, Tt);
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return Nt(e, !1, ht, Ct, Et);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return Nt(e, !0, mt, wt, Dt);
}
function Nt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = kt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return /* @__PURE__ */ Ft(e) ? /* @__PURE__ */ Pt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ B(t) : e;
}
function Rt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && re(e, "__v_skip", !0), e;
}
var zt = (e) => v(e) ? /* @__PURE__ */ At(e) : e, Bt = (e) => v(e) ? /* @__PURE__ */ Mt(e) : e;
// @__NO_SIDE_EFFECTS__
function V(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function H(e) {
	return Vt(e, !1);
}
function Vt(e, t) {
	return /* @__PURE__ */ V(e) ? e : new Ht(e, t);
}
var Ht = class {
	constructor(e, t) {
		this.dep = new Ue(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ B(e), this._value = t ? e : zt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ It(e) || /* @__PURE__ */ Ft(e);
		e = n ? e : /* @__PURE__ */ B(e), A(e, t) && (this._rawValue = e, this._value = n ? e : zt(e), this.dep.trigger());
	}
};
function U(e) {
	return /* @__PURE__ */ V(e) ? e.value : e;
}
var Ut = {
	get: (e, t, n) => t === "__v_raw" ? e : U(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Wt(e) {
	return /* @__PURE__ */ Pt(e) ? e : new Proxy(e, Ut);
}
var Gt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ue(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ve - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && R !== this) return De(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ne(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Kt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Gt(r, i, n);
}
var qt = {}, Jt = /* @__PURE__ */ new WeakMap(), Yt = void 0;
function Xt(e, t = !1, n = Yt) {
	if (n) {
		let t = Jt.get(n);
		t || Jt.set(n, t = []), t.push(e);
	}
}
function Zt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ It(e) || o === !1 || o === 0 ? Qt(e, 1) : Qt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ V(e) ? (g = () => e.value, y = /* @__PURE__ */ It(e)) : /* @__PURE__ */ Pt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Pt(e) || /* @__PURE__ */ It(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ V(e)) return e.value;
		if (/* @__PURE__ */ Pt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Re();
			try {
				_();
			} finally {
				ze();
			}
		}
		let t = Yt;
		Yt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Yt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => Qt(e(), t);
	}
	let x = xe(), S = () => {
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
	let C = b ? Array(e.length).fill(qt) : qt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => A(e, C[t])) : A(t, C))) {
					let e = Yt;
					Re();
					try {
						_ && _(), Yt = m;
						let e = [
							t,
							C === qt ? void 0 : b && C[0] === qt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Yt = e, ze();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Ce(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Xt(e, !1, m), _ = m.onStop = () => {
		let e = Jt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Jt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function Qt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ V(e)) Qt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Qt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Qt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) Qt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Qt(e[r], t, n);
	}
	return e;
}
// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function $t(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		tn(e, t, n);
	}
}
function en(e, t, n, r) {
	if (h(e)) {
		let i = $t(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			tn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(en(e[a], t, n, r));
		return i;
	}
}
function tn(e, n, r, i = !0) {
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
			Re(), $t(o, null, 10, [
				e,
				i,
				a
			]), ze();
			return;
		}
	}
	nn(e, r, a, i, s);
}
function nn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var W = [], rn = -1, an = [], on = null, sn = 0, cn = /* @__PURE__ */ Promise.resolve(), ln = null;
function un(e) {
	let t = ln || cn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function dn(e) {
	let t = rn + 1, n = W.length;
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
	if (!d(e)) on && e.id === -1 ? on.splice(sn + 1, 0, e) : e.flags & 1 || (an.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) an.push(e[t]);
	pn();
}
function hn(e, t, n, r = rn + 1) {
	for (; r < W.length; r++) {
		let n = W[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			W.splice(r, 1), r = e ? r - 1 : rn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
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
		for (rn = 0; rn < W.length; rn++) {
			let e = W[rn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), $t(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; rn < W.length; rn++) {
			let e = W[rn];
			e && (e.flags &= -2);
		}
		rn = -1, W.length = 0, gn(e), ln = null, (W.length || an.length) && bn(e);
	}
}
var G = null, xn = null;
function Sn(e) {
	let t = G;
	return G = e, xn = e && e.type.__scopeId || null, t;
}
function Cn(e, t = G, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ei(-1);
		let i = Sn(t), a = Xr.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Xr.length; e > a; e--) Qr();
			Sn(i), r._d && ei(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function K(e, n) {
	if (G === null) return e;
	let r = Fi(G), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Qt(o), i.push({
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
function wn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Re(), en(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), ze());
	}
}
function Tn(e, t, n = !1) {
	let r = Si();
	if (r || ir) {
		let i = ir ? ir._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var En = /* @__PURE__ */ Symbol.for("v-scx"), Dn = () => Tn(En);
function On(e, t, n) {
	return kn(e, t, n);
}
function kn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Oi) {
		if (c === "sync") {
			let e = Dn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = xi;
	u.call = (e, t, n) => en(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		e.i = p, Pr(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : fn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Zt(e, n, u);
	return Oi && (f ? f.push(h) : d && h()), h;
}
var An = /* @__PURE__ */ Symbol("_vte"), jn = (e) => e.__isTeleport, Mn = /* @__PURE__ */ Symbol("_leaveCb");
function Nn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Jr) {
			t = n;
			break;
		}
	}
	return t;
}
function Pn(e) {
	if (!Un(e)) return jn(e.type) && e.children ? Nn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Fn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Fn(jn(n.type) && Pn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === J && d(e.children)) {
		let n = ur(e.children, !1);
		n && Fn(n, t);
	}
}
function In(e) {
	if (e.component) return In(e.component.subTree);
	if (e.type === J) {
		let t = d(e.children) && ur(e.children, !1);
		return t ? In(t) : void 0;
	}
	if (e.type !== Jr) return e;
}
function Ln(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Rn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var zn = /* @__PURE__ */ new WeakMap();
function Bn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Bn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Hn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Bn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Fi(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ B(v), b = v === t ? i : (e) => !Rn(_, e) && u(y, e), x = (e, t) => !(t && Rn(_, t));
	if (m != null && m !== p) {
		if (Vn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ V(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) $t(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ V(p);
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
					i(), zn.delete(e);
				};
				t.id = -1, zn.set(e, t), Pr(t, r);
			} else Vn(e), i();
		}
	}
}
function Vn(e) {
	let t = zn.get(e);
	t && (t.flags |= 8, zn.delete(e));
}
ae().requestIdleCallback, ae().cancelIdleCallback;
var Hn = (e) => !!e.type.__asyncLoader, Un = (e) => e.type.__isKeepAlive;
function Wn(e, t, n = xi, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Re();
			let i = Ti(n), a = en(t, n, e, r);
			return i(), ze(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Gn = (e) => (t, n = xi) => {
	Oi && e !== "sp" || Wn(e, (...e) => t(...e), n);
}, Kn = Gn("m"), qn = Gn("bum"), Jn = /* @__PURE__ */ Symbol.for("v-ndc");
function q(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Pt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ It(e), s = /* @__PURE__ */ Ft(e), e = Ze(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Bt(zt(e[n])) : zt(e[n]) : e[n], n, void 0, a && a[n]);
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
function Yn(e, t, n, r, i, a) {
	if (n ??= {}, G.ce || G.parent && Hn(G.parent) && G.parent.ce) {
		let e = a != null && n.key == null ? s({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), Y(), ni(J, null, [si("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let c = Xr.length;
	Y();
	let l;
	try {
		let i = o && Xn(o(n)), s = n.key || a || i && i.key;
		l = ni(J, { key: (s && !_(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Xr.length; e > c; e--) Qr();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), l;
}
function Xn(e) {
	return e.some((e) => !ri(e) || !(e.type === Jr || e.type === J && !Xn(e.children))) ? e : null;
}
var Zn = (e) => e ? Di(e) ? Fi(e) : Zn(e.parent) : null, Qn = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Zn(e.parent),
	$root: (e) => Zn(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		fn(e.update);
	},
	$nextTick: (e) => e.n ||= un.bind(e.proxy),
	$watch: (e) => r
}), $n = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), er = {
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
			else if ($n(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = Qn[n], f, p;
		if (d) return n === "$attrs" && z(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return $n(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || $n(t, s) || u(a, s) || u(r, s) || u(Qn, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function tr() {
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
var nr = 0;
function rr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = tr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: nr++,
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
				c && (en(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = ir;
				ir = l;
				try {
					return e();
				} finally {
					ir = t;
				}
			}
		};
		return l;
	};
}
var ir = null, ar = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${te(t)}Modifiers`];
function or(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && ar(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(M)));
	let c, l = i[c = k(n)] || i[c = k(D(n))];
	!l && o && (l = i[c = k(te(n))]), l && en(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, en(u, e, 6, a);
	}
}
function sr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function cr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, te(t)) || u(e, t));
}
function lr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Sn(e), v, y;
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
			}) : e(f, null)), y = t.props ? c : dr(c);
		}
	} catch (t) {
		Xr.length = 0, tn(t, e, 1), v = si(Jr);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = fr(y, a)), b = ui(b, y, !1, !0));
	}
	return n.dirs && (b = ui(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Fn(jn(b.type) && Pn(b) || b, n.transition), v = b, Sn(_), v;
}
function ur(e, t = !0) {
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
var dr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, fr = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function pr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? mr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (hr(o, r, n) && !cr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || mr(r, o, l) : !!o;
	return !1;
}
function mr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!u(e, a) || hr(t, e, a) && !cr(n, a)) return !0;
	}
	return !1;
}
function hr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !F(r, i) : r !== i;
}
function gr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var _r = {}, vr = () => Object.create(_r), yr = (e) => Object.getPrototypeOf(e) === _r;
function br(e, t, n, r = !1) {
	let i = {}, a = vr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Sr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ jt(i) : e.type.props ? i : a, e.attrs = a;
}
function xr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ B(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (cr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = D(o);
						i[t] = Cr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Sr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = te(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Cr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && Ye(e.attrs, "set", "");
}
function Sr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = D(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : cr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ B(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Cr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Cr(e, t, n, r, i, a) {
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === te(n)) && (r = !0));
	}
	return r;
}
function wr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = D(c[e]);
		Tr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = D(e);
		if (Tr(t)) {
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
function Tr(e) {
	return e[0] !== "$" && !T(e);
}
var Er = (e) => e === "_" || e === "_ctx" || e === "$stable", Dr = (e) => d(e) ? e.map(fi) : [fi(e)], Or = (e, t, n) => {
	if (t._n) return t;
	let r = Cn((...e) => Dr(t(...e)), n);
	return r._c = !1, r;
}, kr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Er(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Or(n, i, r);
		else if (i != null) {
			let e = Dr(i);
			t[n] = () => e;
		}
	}
}, Ar = (e, t) => {
	let n = Dr(t);
	e.slots.default = () => n;
}, jr = (e, t, n) => {
	for (let r in t) (n || !Er(r)) && (e[r] = t[r]);
}, Mr = (e, t, n) => {
	let r = e.slots = vr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (jr(r, t, n), n && re(r, "_", e, !0)) : kr(t, r);
	} else t && Ar(e, t);
}, Nr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : jr(a, n, r) : (o = !n.$stable, kr(n, a)), s = n;
	} else n && (Ar(e, n), s = { default: 1 });
	if (o) for (let e in a) !Er(e) && s[e] == null && delete a[e];
}, Pr = Kr;
function Fr(e) {
	return Ir(e);
}
function Ir(e, i) {
	let a = ae();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ii(e, t) && (i = me(e), P(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
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
				k(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? A(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, F);
		}
		d != null && a ? Bn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Bn(e.ref, null, o, e, !0);
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
				n && n._beginPatch(), O(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, E = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, Lr(e, a), s, u), _ && wn(e, null, r, "created"), ee(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && gi(f, r, e);
		}
		_ && wn(e, null, r, "beforeMount");
		let v = zr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && Pr(() => {
			try {
				f && gi(f, r, e), v && g.enter(d), _ && wn(e, null, r, "mounted");
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
	}, O = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Rr(r, !1), (g = h.onVnodeBeforeUpdate) && gi(g, r, n, e), f && wn(n, e, r, "beforeUpdate"), r && Rr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? te(e.dynamicChildren, d, l, r, i, Lr(n, a), o) : s || se(e, n, l, null, r, i, Lr(n, a), o, !1), u > 0) {
			if (u & 16) ne(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ne(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && Pr(() => {
			g && gi(g, r, n, e), f && wn(n, e, r, "updated");
		}, i);
	}, te = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Wr(c), d = u && (c.type === J || !ii(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, ne = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, k = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (te(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Br(e, t, !0)) : se(e, t, n, f, i, a, s, c, l);
	}, A = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : re(t, n, r, i, a, o, c) : M(e, t, c);
	}, re = (e, t, n, r, i, a, o) => {
		let s = e.component = bi(e, r, i);
		if (Un(e) && (s.ctx.renderer = F), ki(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o, a), !e.el) {
				let r = s.subTree = si(Jr);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, M = (e, t, n) => {
		let r = t.component = e.component;
		if (pr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, oe(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, ie = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Hr(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							Pr(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Rr(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && j(n), (d = t.props && t.props.onVnodeBeforeUpdate) && gi(d, s, t, c), Rr(e, !0);
				let f = lr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), me(p), e, i, a), t.el = f.el, u === null && gr(e, f.el), r && Pr(r, i), (d = t.props && t.props.onVnodeUpdated) && Pr(() => gi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Hn(t);
				if (Rr(e, !1), l && j(l), !m && (o = c && c.onVnodeBeforeMount) && gi(o, d, t), Rr(e, !0), s && _e) {
					let t = () => {
						e.subTree = lr(e), _e(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = lr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Pr(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Pr(() => gi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Hn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Pr(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ce(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => fn(u), Rr(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, xr(e, t.props, r, n), Nr(e, t.children, n), Re(), hn(e), ze();
	}, se = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ce(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				N(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && pe(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ce(l, d, n, r, i, a, o, s, c) : pe(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, N = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? pi(t[p]) : fi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? pe(e, a, o, !0, !1, f) : D(t, r, i, a, o, s, c, l, f);
	}, ce = (e, t, r, i, a, o, s, c, l) => {
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
		} else if (u > p) for (; u <= f;) P(e[u], a, o, !0), u++;
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
					P(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ii(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? P(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Vr(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Wr(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? le(n, r, p, 2) : _--);
			}
		}
	}, le = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) le(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, F);
		else if (c === J) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) le(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === Yr) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Mn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), Pr(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Mn];
					a._isLeaving && a[Mn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, P = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Re(), Bn(s, null, n, e, !0), ze()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Hn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && gi(_, t, e), u & 6) fe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && wn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, F, r) : l && !l.hasOnce && (a !== J || d > 0 && d & 64) ? pe(l, t, n, !1, !0) : (a === J && d & 384 || !i && u & 16) && pe(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Pr(() => {
			_ && gi(_, t, e), h && wn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === J;
		if (a && !i) {
			de(n, r);
			return;
		}
		if (t === Yr) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? In(e) : e, c = () => {
			a ? m(n) && de(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, de = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, fe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ur(c), Ur(l), r && j(r), i.stop(), a ? (a.flags |= 8, P(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, P(o, e, t, n)), s && Pr(s, t), Pr(() => {
			e.isUnmounted = !0;
		}, t);
	}, pe = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) P(e[o], t, n, r, i);
	}, me = (e) => {
		if (e.shapeFlag & 6) return me(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[An];
		return n ? h(n) : t;
	}, he = (e, t, n) => {
		vn(() => {
			e == null ? t._vnode && P(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : yi());
	}, F = {
		p: v,
		um: P,
		m: le,
		r: ue,
		mt: re,
		mc: D,
		pc: se,
		pbc: te,
		n: me,
		o: e
	}, ge, _e;
	return i && ([ge, _e] = i(F)), {
		render: he,
		hydrate: ge,
		createApp: rr(he, ge)
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
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : mn(e);
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
var ai = ({ key: e }) => e ?? null, oi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ V(e) || h(e) ? {
	i: G,
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
		ctx: G
	};
	return s ? (mi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), $r > 0 && !o && Zr && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Zr.push(c), c;
}
var si = ci;
function ci(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Jn || (e = Jr), ri(e)) {
		let r = ui(e, t, !0);
		return n && mi(r, n), $r > 0 && !a && Zr && (r.shapeFlag & 6 ? Zr[Zr.indexOf(e)] = r : Zr.push(r)), r.patchFlag = -2, r;
	}
	if (Ii(e) && (e = e.__vccOpts), t) {
		t = li(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = P(e)), v(n) && (/* @__PURE__ */ Lt(n) && !d(n) && (n = s({}, n)), t.style = oe(n));
	}
	let o = g(e) ? 1 : Gr(e) ? 128 : jn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function li(e) {
	return e ? /* @__PURE__ */ Lt(e) || yr(e) ? s({}, e) : e : null;
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
	return c && r && Fn(u, c.clone(u)), u;
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
			!r && !yr(t) ? t._ctx = G : r === 3 && G && (G.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			mi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: G
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [di(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function hi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = P([t.class, r.class]));
		else if (e === "style") t.style = oe([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function gi(e, t, n, r = null) {
	en(e, t, 7, [n, r]);
}
var _i = tr(), vi = 0;
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
		scope: new be(!0),
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
		propsOptions: wr(i, a),
		emitsOptions: sr(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = or.bind(null, o), e.ce && e.ce(o), o;
}
var xi = null, Si = () => xi || G, Ci, wi;
{
	let e = ae(), t = (t, n) => {
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
	br(e, r, a, t), Mr(e, i, n || t);
	let o = a ? Ai(e, t) : void 0;
	return t && wi(!1), o;
}
function Ai(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, er);
	let { setup: r } = n;
	if (r) {
		Re();
		let n = e.setupContext = r.length > 1 ? Pi(e) : null, i = Ti(e), a = $t(r, e, 0, [e.props, n]), o = y(a);
		if (ze(), i(), (o || e.sp) && !Hn(e) && Ln(e), o) {
			if (a.then(Ei, Ei), t) return a.then((n) => {
				wi(!0);
				try {
					ji(e, n, t);
				} finally {
					wi(!1);
				}
			}).catch((t) => {
				tn(t, e, 0);
			});
			e.asyncDep = a;
		} else ji(e, a, t);
	} else Mi(e, t);
}
function ji(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Wt(t)), Mi(e, n);
}
function Mi(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var Ni = { get(e, t) {
	return z(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Wt(Rt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Qn) return Qn[n](e);
		},
		has(e, t) {
			return t in e || t in Qn;
		}
	}) : e.proxy;
}
function Ii(e) {
	return h(e) && "__vccOpts" in e;
}
var Li = (e, t) => /* @__PURE__ */ Kt(e, t, Oi), Ri = "3.5.44", zi = void 0, Bi = typeof window < "u" && window.trustedTypes;
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
		na.test(n) ? e.setProperty(te(r), n.replace(na, ""), "important") : e[r] = n;
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
	r = ne(r);
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
function la(e, t, n, r, i, a = ue(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ca, t.slice(6, t.length)) : e.setAttributeNS(ca, t, n) : n == null || a && !de(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
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
		r === "boolean" ? n = de(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : te(e.slice(2)), t];
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
				e && en(e, t, 5, a);
			}
		} else en(r, t, 5, [e]);
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
	return d(t) ? (e) => j(t, e) : t;
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
	return t && (e = e.trim()), n && (e = M(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? M(e.value) : e.value, c = t ?? "";
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
				let e = ge(t, n), a = e !== -1;
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
	if (d(t)) i = ge(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = F(t, za(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Pa = {
	created(e, { value: t }, n) {
		e.checked = F(t, n.props.value), e[ka] = Ea(n), da(e, "change", () => {
			e[ka](Ra(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[ka] = Ea(r), t !== n && (e.checked = F(t, r.props.value));
	}
}, Fa = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, da(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? M(Ra(e)) : Ra(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[ka](i);
			} finally {
				un(() => {
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
	if (!n || d(e)) return F(e, t);
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
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : ge(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (F(Ra(a), t)) {
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
	let e = location.pathname === "/play" || location.pathname.startsWith("/play/") ? "/play" : "", t = "edutictac-play-draft", n = window.commonsLanguage.read(), r = /* @__PURE__ */ H([
		"es",
		"ca",
		"va",
		"en"
	].includes(n) ? n : "es"), i = /* @__PURE__ */ H({}), a = (e) => e.split(".").reduce((e, t) => e?.[t], i.value) || e, o = /* @__PURE__ */ H("home"), s = /* @__PURE__ */ H(!1), c = /* @__PURE__ */ H(!1), l = /* @__PURE__ */ H($a()), u = /* @__PURE__ */ H(null), d = /* @__PURE__ */ H(""), f = /* @__PURE__ */ H(""), p = /* @__PURE__ */ H(!1), m = /* @__PURE__ */ H(0), h = /* @__PURE__ */ H(""), g = /* @__PURE__ */ H({}), _ = /* @__PURE__ */ H(null), v = /* @__PURE__ */ H(!1), y = /* @__PURE__ */ H(null), b = {}, x = /* @__PURE__ */ H({}), S = /* @__PURE__ */ At({
		subjects: "",
		educational_stages: "",
		levels: "",
		tags: ""
	}), C = /* @__PURE__ */ H(""), w = /* @__PURE__ */ At({
		items: [],
		total: 0,
		offset: 0,
		hasMore: !1,
		term: "",
		type: "",
		loading: !1,
		error: !1
	}), T = /* @__PURE__ */ At({
		items: [],
		term: "",
		loading: !1,
		error: !1
	}), E = /* @__PURE__ */ H(), ee = /* @__PURE__ */ H(""), D = /* @__PURE__ */ H("");
	try {
		D.value = localStorage.getItem("edutictac-play-admin-token") || "", localStorage.removeItem("edutictac-play-admin-token");
	} catch {}
	let O = 0, te = 0, ne = 0, k = 0, A = 0, j = !0, re = "", M = io(e, (e) => {
		u.value?.id === e && j && (f.value = "resultSaved");
	}), ie = Li(() => c.value || m.value > 0), ae = Li(() => ["published", "updated"].includes(u.value?.recursos?.status)), oe = Li(() => a(l.value.type === "compound" ? "compound.editor" : l.value.type === "multiple-choice" ? "editorTitle" : Za[l.value.type] + "Editor"));
	function se() {
		let e = localStorage.getItem("edutictac-play-creator-key");
		return e && /^[A-Za-z0-9_-]{16,128}$/.test(e) || (e = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2) + Date.now().toString(36), localStorage.setItem("edutictac-play-creator-key", e)), e;
	}
	async function N(t, n = {}) {
		let r = await fetch(e + "/api" + t, {
			credentials: "same-origin",
			cache: "no-store",
			...n,
			headers: {
				"X-Play-Creator": se(),
				...n.headers
			}
		}), i = await r.json();
		if (!r.ok) {
			let e = /* @__PURE__ */ Error("request");
			throw e.status = r.status, e.details = Array.isArray(i.errors) ? i.errors : [], e;
		}
		return i;
	}
	function ce(e, t, n = {}) {
		return N(e, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...n
			},
			body: JSON.stringify(t)
		});
	}
	async function le(t) {
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
			if (n !== te || !j) return;
			i.value = o, r.value = t, document.documentElement.lang = t === "va" ? "ca" : t, window.commonsLanguage.remember(t);
		} catch {
			d.value = "languageError";
		}
	}
	window.edutictacLanguage = {
		languages: [
			"ca",
			"va",
			"es",
			"en"
		],
		get: () => r.value,
		set: (e) => {
			c.value || le(e);
		}
	};
	function P(e) {
		if (typeof e != "string") return;
		let t = e.startsWith("//") ? location.protocol + e : e;
		try {
			if (t && !["http:", "https:"].includes(new URL(t).protocol)) return;
		} catch {
			return;
		}
		if (y.value = t, document.getElementById("edutictacAccountScript")) return;
		let n = document.createElement("link");
		n.rel = "stylesheet", n.href = t + "/assets/account-widget.css", document.head.append(n);
		let r = document.createElement("script");
		r.id = "edutictacAccountScript", r.defer = !0, r.src = t + "/assets/account-widget.js", document.head.append(r);
	}
	function ue() {
		j && s.value && I();
	}
	function de(e) {
		Ya.includes(e) && !ie.value && (b[l.value.type] = l.value, b[e] || (b[e] = {
			...$a(e),
			title: l.value.title,
			question: l.value.question
		}), l.value = b[e], o.value = "editor", d.value = "", ++O);
	}
	function fe(e) {
		c.value || (++O, o.value = e, f.value = "", d.value = "", E.value?.close(), ++k);
	}
	async function pe(n = !1) {
		if (ie.value) return;
		let i = to(l.value, r.value), s = no(i, a);
		if (d.value = s.join(" "), s.length) return;
		c.value = !0;
		let m = O;
		try {
			n && localStorage.setItem(t, JSON.stringify({
				...i,
				_owner: g.value.actor || ""
			}));
			let r = await ce(n ? "/previews" : "/activities", i);
			if (m !== O || !j || (u.value = r, n || await I(), m !== O || !j)) return;
			o.value = "previewPanel", f.value = n ? "" : "saved", p.value = !1, n || localStorage.removeItem(t), history.replaceState({}, "", n ? e + "/" + M.query() : e + "/" + r.id + M.query());
		} catch (e) {
			if (m === O && j) {
				let t = e.details?.join(" ");
				d.value = e.status === 401 ? a("loginToSave") : t || a(n ? "previewError" : "saveError"), f.value = "saveError", p.value = !0;
			}
		} finally {
			m === O && (c.value = !1);
		}
	}
	async function me() {
		let e = ++ne, t = O;
		w.loading = !0, w.error = !1;
		try {
			let n = await N("/activities?" + new URLSearchParams({
				limit: "12",
				offset: w.offset,
				q: w.term.trim(),
				type: w.type
			}));
			if (e !== ne || t !== O || !j) return;
			Object.assign(w, {
				items: n.items,
				total: n.total,
				offset: n.offset,
				hasMore: n.hasMore
			});
		} catch {
			e === ne && t === O && (w.error = !0);
		} finally {
			e === ne && (w.loading = !1);
		}
	}
	function he() {
		fe("library"), w.offset = 0, me();
	}
	function F(e = 0) {
		w.offset = e, me();
	}
	function ge() {
		c.value || (D.value = ee.value.trim(), ee.value = "", C.value = "", ++ne, me());
	}
	async function _e(n, r = !1) {
		if (c.value || !window.confirm(a(r ? "libraryConfirmDelete" : "deleteConfirm"))) return;
		c.value = !0;
		let i = O;
		try {
			if (await N("/activities/" + n, {
				method: "DELETE",
				headers: D.value ? { "X-Admin-Token": D.value } : {}
			}), i !== O || !j) return;
			r ? await me() : (u.value = null, localStorage.removeItem(t), history.replaceState({}, "", e + "/"), o.value = "home");
		} catch {
			i === O && (f.value = "deleteError", p.value = !0, r && (w.error = !0));
		} finally {
			i === O && (c.value = !1);
		}
	}
	async function I() {
		let e = O;
		try {
			let t = await N("/publication/me");
			if (e !== O || !j) return;
			if (g.value = t, _.value = null, t.can_submit && u.value?.id && !u.value.id.startsWith("preview-")) {
				let t = u.value.id, n = await N("/submissions/" + t);
				e === O && u.value?.id === t && j && (_.value = n);
			}
		} catch {
			e === O && (g.value = {}, _.value = null);
		}
	}
	async function ve() {
		if (c.value || !g.value.can_submit || !u.value?.id) return;
		c.value = !0;
		let e = O, t = u.value.id;
		try {
			let n = await ce("/submissions/" + t, { revision: _.value?.revision || 0 }, { "X-Play-Review": "1" });
			if (e !== O || !j) return;
			_.value = n, f.value = "reviewSent", p.value = !1;
		} catch {
			e === O && (f.value = "reviewSubmitError", p.value = !0);
		} finally {
			e === O && (c.value = !1);
		}
	}
	async function ye(e = !1) {
		if (c.value || !g.value.can_publish || !u.value?.id || u.value.id.startsWith("preview-")) return;
		c.value = !0;
		let t = O, n = u.value.id;
		f.value = e ? "unpublishRecursosLoading" : "publishRecursosLoading";
		try {
			let r = await ce("/recursos/" + (e ? "unpublish" : "publish"), { activity_id: n });
			if (t !== O || u.value?.id !== n || !j) return;
			u.value.recursos = r, f.value = e ? "unpublishRecursosDone" : "publishRecursosDone", p.value = !1;
		} catch {
			t === O && (f.value = e ? "unpublishRecursosError" : "publishRecursosError", p.value = !0);
		} finally {
			t === O && (c.value = !1);
		}
	}
	async function L() {
		let e = ++A;
		try {
			let t = await N("/catalog");
			if (e !== A || !j) return;
			x.value = t;
			for (let e of Object.keys(S)) S[e] = (t[e] || []).join("\n");
		} catch {}
	}
	async function be() {
		if (c.value) return;
		if (!D.value) {
			C.value = "catalogTokenRequired";
			return;
		}
		c.value = !0;
		let e = O;
		try {
			await ce("/catalog", {
				...Object.fromEntries(Object.entries(S).map(([e, t]) => [e, t.split("\n").map((e) => e.trim()).filter(Boolean)])),
				labels: x.value.labels || {}
			}, { "X-Admin-Token": D.value }), e === O && j && (C.value = "catalogSaved", await L());
		} catch {
			e === O && (C.value = "catalogError");
		} finally {
			e === O && (c.value = !1);
		}
	}
	async function xe() {
		let e = ++k, t = O;
		T.loading = !0, T.error = !1;
		try {
			let n = await N("/activities?" + new URLSearchParams({
				limit: "100",
				q: T.term.trim()
			}));
			if (e !== k || t !== O || !j) return;
			T.items = n.items.filter((e) => Xa.includes(e.type));
		} catch {
			e === k && (T.error = !0);
		} finally {
			e === k && (T.loading = !1);
		}
	}
	async function R() {
		ie.value || (T.term = "", T.items = [], E.value.showModal(), xe());
	}
	async function Se(e) {
		if (c.value || l.value.type !== "compound" || l.value.activities.length >= 10) return;
		let t = O, n = k, r = l.value;
		c.value = !0;
		try {
			let i = await N("/activities/" + e);
			if (t !== O || n !== k || l.value !== r || !E.value.open || !j) return;
			if (!Xa.includes(i.type)) throw Error();
			r.activities.push({
				...eo(i),
				sourceActivityId: e
			}), E.value.close(), f.value = "bank.copied";
		} catch {
			t === O && (T.error = !0);
		} finally {
			t === O && (c.value = !1);
		}
	}
	function Ce() {
		++k, E.value?.close();
	}
	async function we() {
		try {
			await navigator.clipboard.writeText(location.href), f.value = "copied", p.value = !1;
		} catch {
			f.value = "copyError", p.value = !0;
		}
	}
	async function Te() {
		let n = O;
		await le(r.value);
		try {
			await M.launch();
		} catch {
			d.value = a("launchError");
			return;
		}
		if (n !== O || !j || (M.flush(), L(), await I(), n !== O || !j)) return;
		N("/config").then((e) => {
			v.value = !!e.integrated, P(e.commonsBase);
			try {
				let t = new URL(e.commonsUrl);
				e.demo && ["http:", "https:"].includes(t.protocol) && !t.username && !t.password && (h.value = t.href);
			} catch {}
		}).catch(() => {});
		let i = location.pathname.match(RegExp("^" + e + "/([A-Za-z0-9]{8})$"))?.[1] || new URLSearchParams(location.search).get("activity");
		if (i) try {
			if (!/^[A-Za-z0-9]{8}$/.test(i)) throw Error();
			let e = await N("/activities/" + i);
			if (n !== O || !j || (u.value = e, await I(), n !== O || !j)) return;
			l.value = eo(e), b[l.value.type] = l.value, o.value = "previewPanel", f.value = "saved";
		} catch {
			d.value = a("libraryError");
		}
		else try {
			let e = JSON.parse(localStorage.getItem(t) || "null");
			e && Ya.includes(e.type) && (!e._owner || e._owner === g.value.actor) && (l.value = eo(e), b[l.value.type] = l.value);
		} catch {
			localStorage.removeItem(t);
		}
		s.value = !0, document.documentElement.dataset.playReady = "true";
	}
	function Ee() {
		re = g.value.actor || "", document.getElementById("playApp")?.setAttribute("hidden", ""), j = !1, ++O, ++ne, ++k, ++A, D.value = "", ee.value = "", g.value = {}, _.value = null, c.value = !1, E.value?.close();
	}
	async function De(e) {
		if (e.persisted) {
			if (j = !0, !s.value) await Te(), document.getElementById("playApp")?.removeAttribute("hidden");
			else {
				if (await I(), re && re !== g.value.actor && (u.value = null, l.value = $a(), Object.keys(b).forEach((e) => delete b[e]), o.value = "home", localStorage.removeItem(t)), u.value?.visibility === "private") try {
					u.value = await N("/activities/" + u.value.id);
				} catch {
					u.value = null, l.value = $a(), o.value = "home";
				}
				await un(), document.getElementById("playApp")?.removeAttribute("hidden"), L(), o.value === "library" && me();
			}
		}
	}
	function Oe() {
		M.flush();
	}
	return Kn(() => {
		Te(), window.addEventListener("online", Oe), window.addEventListener("pagehide", Ee), window.addEventListener("pageshow", De), window.addEventListener("edutictac:sessionchange", ue);
	}), qn(() => {
		Ee(), window.removeEventListener("online", Oe), window.removeEventListener("pagehide", Ee), window.removeEventListener("pageshow", De), window.removeEventListener("edutictac:sessionchange", ue);
	}), {
		capabilities: g,
		submission: _,
		integrated: v,
		commonsBase: y,
		submitReview: ve,
		loadPublication: I,
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
		savingDisabled: ie,
		demoUrl: h,
		catalog: x,
		catalogDraft: S,
		catalogMessage: C,
		library: w,
		bank: T,
		bankDialog: E,
		adminInput: ee,
		adminToken: D,
		published: ae,
		editorTitle: oe,
		choose: de,
		go: fe,
		changeLanguage: le,
		saveActivity: pe,
		loadLibrary: me,
		openLibrary: he,
		filterLibrary: F,
		applyToken: ge,
		removeActivity: _e,
		publication: ye,
		saveCatalog: be,
		openBank: R,
		loadBank: xe,
		addFromBank: Se,
		closeBank: Ce,
		copy: we,
		onStatement: M.report
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
		let n = e, r = t, i = /* @__PURE__ */ H(""), a = /* @__PURE__ */ H(""), o = /* @__PURE__ */ H(""), s = /* @__PURE__ */ H(""), c = {};
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
		return On(() => n.step, l, { immediate: !0 }), (t, n) => (Y(), X("article", oo, [
			Z("div", so, [
				Z("strong", co, I(e.index + 1) + ".", 1),
				Z("button", {
					type: "button",
					class: "button secondary compound-remove",
					disabled: e.disabled,
					onClick: n[0] ||= (e) => r("remove")
				}, I(e.t("compound.remove")), 9, lo),
				e.step.sourceActivityId ? (Y(), X("small", uo, I(e.t("bank.source")) + ": " + I(e.step.sourceActivityId), 1)) : Q("", !0)
			]),
			Z("label", null, [Z("span", null, I(e.t("compound.type")), 1), Z("select", {
				class: "compound-type",
				value: e.step.type,
				disabled: e.disabled,
				onChange: n[1] ||= (e) => u(e.target.value)
			}, [(Y(!0), X(J, null, q(U(Xa), (t) => (Y(), X("option", {
				key: t,
				value: t
			}, I(e.t(U(Za)[t])), 9, po))), 128))], 40, fo)]),
			Z("label", null, [Z("span", null, I(e.t("compound.stepTitle")), 1), K(Z("input", {
				"onUpdate:modelValue": n[2] ||= (t) => e.step.title = t,
				class: "compound-title",
				maxlength: "200",
				required: "",
				disabled: e.disabled
			}, null, 8, mo), [[$, e.step.title]])]),
			Z("label", null, [Z("span", null, I(e.t("compound.stepQuestion")), 1), K(Z("textarea", {
				"onUpdate:modelValue": n[3] ||= (t) => e.step.question = t,
				class: "compound-question",
				maxlength: "2000",
				required: "",
				disabled: e.disabled
			}, null, 8, ho), [[$, e.step.question]])]),
			Z("div", go, [e.step.type === "multiple-choice" ? (Y(), X("label", _o, [Z("span", null, I(e.t("compound.answers")), 1), Z("textarea", {
				class: "compound-answers",
				value: i.value,
				disabled: e.disabled,
				onInput: n[4] ||= (e) => d("answers", e.target.value)
			}, null, 40, vo)])) : e.step.type === "true-false" ? (Y(), X("label", yo, [Z("span", null, I(e.t("correctAnswer")), 1), K(Z("select", {
				"onUpdate:modelValue": n[5] ||= (t) => e.step.correct = t,
				class: "compound-correct",
				disabled: e.disabled
			}, [Z("option", xo, I(e.t("true")), 1), Z("option", So, I(e.t("false")), 1)], 8, bo), [[Fa, e.step.correct]])])) : [
				"fill-blanks",
				"drag-text",
				"mark-words"
			].includes(e.step.type) ? (Y(), X("label", Co, [Z("span", null, I(e.t("compound.text")), 1), K(Z("textarea", {
				"onUpdate:modelValue": n[6] ||= (t) => e.step.text = t,
				class: "compound-text",
				disabled: e.disabled
			}, null, 8, wo), [[$, e.step.text]])])) : e.step.type === "matching" ? (Y(), X("label", To, [Z("span", null, I(e.t("compound.pairs")), 1), Z("textarea", {
				class: "compound-pairs",
				value: a.value,
				disabled: e.disabled,
				onInput: n[7] ||= (e) => d("pairs", e.target.value)
			}, null, 40, Eo)])) : (Y(), X(J, { key: 4 }, [Z("label", null, [Z("span", null, I(e.t("compound.categories")), 1), Z("input", {
				class: "compound-categories",
				value: o.value,
				disabled: e.disabled,
				onInput: n[8] ||= (e) => d("categories", e.target.value)
			}, null, 40, Do)]), Z("label", null, [Z("span", null, I(e.t("compound.items")), 1), Z("textarea", {
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
			Z("legend", null, I(e.t("answers")), 1),
			Z("div", jo, [(Y(!0), X(J, null, q(e.form.answers, (t, r) => (Y(), X("div", {
				key: r,
				class: "answer-row"
			}, [
				K(Z("input", {
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
			}, I(e.t("addAnswer")), 9, Io)
		])) : e.form.type === "true-false" ? (Y(), X("fieldset", Lo, [
			Z("legend", null, I(e.t("correctAnswer")), 1),
			Z("label", Ro, [K(Z("input", {
				id: "correctTrue",
				"onUpdate:modelValue": n[1] ||= (t) => e.form.correct = t,
				type: "radio",
				name: "truth",
				value: !0
			}, null, 512), [[Pa, e.form.correct]]), Z("span", null, I(e.t("true")), 1)]),
			Z("label", zo, [K(Z("input", {
				id: "correctFalse",
				"onUpdate:modelValue": n[2] ||= (t) => e.form.correct = t,
				type: "radio",
				name: "truth",
				value: !1
			}, null, 512), [[Pa, e.form.correct]]), Z("span", null, I(e.t("false")), 1)])
		])) : e.form.type === "memory" ? (Y(), X("fieldset", Bo, [
			Z("legend", null, I(e.t("pairs")), 1),
			Z("div", Vo, [(Y(!0), X(J, null, q(e.form.cards, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row memory-row"
			}, [Z("div", null, [
				K(Z("input", {
					"onUpdate:modelValue": (e) => t.text = e,
					class: "card-text",
					maxlength: "120",
					"aria-label": e.t("pair")
				}, null, 8, Ho), [[$, t.text]]),
				Z("label", Uo, [di(I(e.t("imageLeft")), 1), Z("input", {
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
			}, I(e.t("addPair")), 9, qo)
		])) : e.form.type === "matching" ? (Y(), X("fieldset", Jo, [
			Z("legend", null, I(e.t("relations")), 1),
			Z("div", Yo, [(Y(!0), X(J, null, q(e.form.pairs, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row matching-row"
			}, [(Y(), X(J, null, q(["left", "right"], (n) => Z("div", { key: n }, [
				K(Z("input", {
					"onUpdate:modelValue": (e) => t[n] = e,
					class: P("match-" + n),
					maxlength: "120",
					"aria-label": e.t(n)
				}, null, 10, Xo), [[$, t[n]]]),
				Z("label", Zo, [di(I(e.t(n === "left" ? "imageLeft" : "imageRight")), 1), Z("input", {
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
			}, I(e.t("addRelation")), 9, ts)
		])) : ["classify", "ordering"].includes(e.form.type) ? (Y(), X("fieldset", {
			key: 4,
			id: "classifyField",
			class: P({ "ordering-mode": e.form.type === "ordering" })
		}, [
			Z("legend", null, I(e.t(e.form.type === "ordering" ? "positions" : "categories")), 1),
			Z("div", ns, [(Y(!0), X(J, null, q(e.form.categories, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row"
			}, [K(Z("input", {
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
			}, I(e.t(e.form.type === "ordering" ? "addPosition" : "addCategory")), 9, as),
			Z("legend", null, I(e.t(e.form.type === "ordering" ? "steps" : "items")), 1),
			Z("div", os, [(Y(!0), X(J, null, q(e.form.items, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row classify-row"
			}, [
				Z("div", null, [
					K(Z("input", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "classify-text",
						maxlength: "120",
						"aria-label": e.t("item")
					}, null, 8, ss), [[$, t.text]]),
					Z("label", cs, [di(I(e.t("imageLeft")), 1), Z("input", {
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
				K(Z("select", {
					"onUpdate:modelValue": (e) => t.category = e,
					class: "classify-category",
					"aria-label": e.t("category")
				}, [(Y(!0), X(J, null, q(e.form.categories, (t, n) => (Y(), X("option", {
					key: n,
					value: n
				}, I(t.name || e.t("category") + " " + (n + 1)), 9, fs))), 128))], 8, ds), [[
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
			}, I(e.t(e.form.type === "ordering" ? "addStep" : "addItem")), 9, ms)
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
			Z("legend", null, I(e.t(e.form.type === "fill-blanks" ? "fillText" : e.form.type === "drag-text" ? "dragTextText" : "markWordsText")), 1),
			K(Z("textarea", {
				id: {
					"fill-blanks": "fillBlanks",
					"drag-text": "dragText",
					"mark-words": "markWords"
				}[e.form.type] + "Text",
				"onUpdate:modelValue": n[7] ||= (t) => e.form.text = t,
				maxlength: "5000"
			}, null, 8, gs), [[$, e.form.text]]),
			Z("small", null, I(e.t("fillHint")), 1)
		], 8, hs)) : e.form.type === "find-words" ? (Y(), X("fieldset", _s, [
			Z("legend", null, I(e.t("findWordsList")), 1),
			Z("div", vs, [(Y(!0), X(J, null, q(e.form.words, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row"
			}, [K(Z("input", {
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
			}, I(e.t("addWord")), 9, xs)
		])) : e.form.type === "dialog-cards" ? (Y(), X("fieldset", Ss, [
			Z("legend", null, I(e.t("dialogCardsList")), 1),
			Z("div", Cs, [(Y(!0), X(J, null, q(e.form.cards, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row"
			}, [
				K(Z("input", {
					"onUpdate:modelValue": (e) => t.front = e,
					class: "dialog-front",
					maxlength: "500",
					"aria-label": e.t("dialogFront")
				}, null, 8, ws), [[$, t.front]]),
				K(Z("input", {
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
			}, I(e.t("addDialogCard")), 9, Ds)
		])) : e.form.type === "crossword" ? (Y(), X("fieldset", Os, [
			Z("legend", null, I(e.t("crosswordList")), 1),
			Z("div", ks, [(Y(!0), X(J, null, q(e.form.words, (t, n) => (Y(), X("div", {
				key: n,
				class: "answer-row"
			}, [
				K(Z("input", {
					"onUpdate:modelValue": (e) => t.answer = e,
					class: "crossword-answer",
					maxlength: "20",
					"aria-label": e.t("crosswordAnswer")
				}, null, 8, As), [[$, t.answer]]),
				K(Z("input", {
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
			}, I(e.t("addCrosswordWord")), 9, Ns)
		])) : e.form.type === "compound" ? (Y(), X("fieldset", Ps, [
			Z("legend", null, I(e.t("compound.steps")), 1),
			Z("div", Fs, [(Y(!0), X(J, null, q(e.form.activities, (t, n) => (Y(), ni(ko, {
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
				onClick: n[11] ||= (t) => e.form.activities.push(U($a)())
			}, I(e.t("compound.add")), 9, Is),
			Z("button", {
				id: "addCompoundFromBank",
				type: "button",
				class: "button secondary",
				disabled: e.form.activities.length >= 10,
				onClick: n[12] ||= (e) => r("bank")
			}, I(e.t("bank.add")), 9, Ls),
			Z("label", null, [Z("span", null, I(e.t("compound.pass")), 1), K(Z("input", {
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
			Z("label", Rs, [K(Z("input", {
				id: "compoundRandom",
				"onUpdate:modelValue": n[14] ||= (t) => e.form.randomQuestions = t,
				type: "checkbox"
			}, null, 512), [[Ma, e.form.randomQuestions]]), Z("span", null, I(e.t("compound.random")), 1)])
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
		let t = e, n = /* @__PURE__ */ H(), r = /* @__PURE__ */ H(!1), i = 0, a = () => {};
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
		return On(() => t.activity?.id, async (e) => {
			let s = ++i;
			if (a(), r.value = !1, await un(), e && n.value) {
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
		}, { immediate: !0 }), qn(() => {
			++i, a();
		}), (e, t) => (Y(), X(J, null, [Z("div", {
			id: "player",
			ref_key: "container",
			ref: n
		}, null, 512), r.value ? (Y(), X("p", Bs, [Yn(e.$slots, "default")])) : Q("", !0)], 64));
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
		let t = e, n = /* @__PURE__ */ H([]), r = /* @__PURE__ */ H(null), i = /* @__PURE__ */ H(!1), a = /* @__PURE__ */ H(""), o = /* @__PURE__ */ H(""), s = /* @__PURE__ */ H(""), c = /* @__PURE__ */ H(0), l = /* @__PURE__ */ H(!1), u = 0, d = !0;
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
		return Kn(() => {
			p(), window.addEventListener("pagehide", g), window.addEventListener("pageshow", _);
		}), qn(() => {
			g(), window.removeEventListener("pagehide", g), window.removeEventListener("pageshow", _);
		}), (t, u) => (Y(), X("section", Hs, [
			Z("div", Us, [Z("h1", null, I(e.t("reviewsTitle")), 1), Z("button", {
				id: "refreshReviews",
				class: "button secondary",
				disabled: i.value,
				onClick: u[0] ||= (e) => p()
			}, I(e.t("refresh")), 9, Ws)]),
			a.value ? (Y(), X("p", Gs, I(e.t(a.value)), 1)) : Q("", !0),
			o.value ? (Y(), X("p", Ks, I(e.t(o.value)), 1)) : Q("", !0),
			i.value ? (Y(), X("p", qs, I(e.t("libraryLoading")), 1)) : Q("", !0),
			!i.value && !n.value.length ? (Y(), X("p", Js, I(e.t("reviewsEmpty")), 1)) : Q("", !0),
			Z("div", Ys, [(Y(!0), X(J, null, q(n.value, (t) => (Y(), X("article", {
				key: t.id,
				class: "library-card"
			}, [
				Z("h2", null, I(t.title), 1),
				Z("p", null, I(t.class_name) + " · " + I(e.t("reviewStatus." + t.status)), 1),
				Z("button", {
					class: "button",
					"data-review-id": t.id,
					disabled: i.value,
					onClick: (e) => m(t.id)
				}, I(e.t("reviewOpen")), 9, Xs)
			]))), 128))]),
			Z("div", Zs, [Z("button", {
				id: "reviewsPrev",
				class: "button secondary",
				disabled: i.value || c.value === 0,
				onClick: u[1] ||= (e) => p(Math.max(0, c.value - 25))
			}, I(e.t("libraryPrev")), 9, Qs), Z("button", {
				id: "reviewsNext",
				class: "button secondary",
				disabled: i.value || !l.value,
				onClick: u[2] ||= (e) => p(c.value + 25)
			}, I(e.t("libraryNext")), 9, $s)]),
			r.value ? (Y(), X("section", ec, [
				Z("h2", null, I(r.value.title), 1),
				Z("p", null, I(e.t("reviewStatus." + r.value.status)), 1),
				si(Vs, {
					base: e.base,
					activity: r.value.activity
				}, {
					default: Cn(() => [di(I(e.t("playerError")), 1)]),
					_: 1
				}, 8, ["base", "activity"]),
				Z("label", null, [di(I(e.t("reviewFeedback")), 1), K(Z("textarea", {
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
					}, I(e.t("reviewApprove")), 9, rc)) : Q("", !0),
					r.value.status === "pending" ? (Y(), X("button", {
						key: 1,
						id: "returnPlay",
						class: "button secondary",
						disabled: i.value,
						onClick: u[5] ||= (e) => h("return")
					}, I(e.t("reviewReturn")), 9, ic)) : Q("", !0),
					r.value.status === "approved" ? (Y(), X("button", {
						key: 2,
						id: "withdrawPlay",
						class: "button secondary",
						disabled: i.value,
						onClick: u[6] ||= (e) => h("withdraw")
					}, I(e.t("unpublishRecursos")), 9, ac)) : Q("", !0)
				])
			])) : Q("", !0)
		]));
	}
}, sc = { class: "topbar" }, cc = ["href"], lc = { class: "topbar-actions" }, uc = [
	"data-base",
	"data-home",
	"data-lang"
], dc = {
	key: 1,
	class: "language"
}, fc = ["value", "disabled"], pc = { class: "shell" }, mc = {
	key: 0,
	class: "actions"
}, hc = ["href"], gc = {
	key: 1,
	role: "status"
}, _c = {
	id: "home",
	class: "panel hero"
}, vc = {
	key: 0,
	class: "test-phase",
	role: "note"
}, yc = {
	key: 1,
	id: "demoNotice",
	class: "test-phase demo-notice",
	role: "note"
}, bc = ["href"], xc = {
	key: 2,
	class: "muted"
}, Sc = { class: "actions" }, Cc = ["href"], wc = { class: "type-grid" }, Tc = [
	"data-type",
	"disabled",
	"onClick"
], Ec = { class: "type-icon" }, Dc = { class: "actions" }, Oc = {
	id: "editor",
	class: "panel",
	"aria-labelledby": "editorTitle"
}, kc = { class: "section-heading" }, Ac = { id: "editorTitle" }, jc = ["disabled"], Mc = ["disabled"], Nc = ["placeholder"], Pc = ["placeholder"], Fc = { id: "catalogField" }, Ic = ["id", "onUpdate:modelValue"], Lc = ["value"], Rc = ["value"], zc = ["value"], Bc = {
	id: "formError",
	class: "error",
	role: "alert"
}, Vc = { class: "actions" }, Hc = ["disabled"], Uc = ["disabled"], Wc = {
	key: 2,
	id: "previewPanel",
	class: "panel",
	"aria-labelledby": "previewTitle"
}, Gc = { class: "section-heading" }, Kc = { class: "eyebrow" }, qc = { id: "previewTitle" }, Jc = ["disabled"], Yc = {
	key: 0,
	id: "previewActions",
	class: "actions"
}, Xc = ["disabled"], Zc = {
	key: 1,
	id: "savedActions",
	class: "actions"
}, Qc = ["href"], $c = ["disabled"], el = ["disabled"], tl = ["disabled"], nl = ["disabled"], rl = {
	key: 2,
	id: "submissionStatus",
	role: "status"
}, il = { key: 0 }, al = {
	key: 3,
	class: "error",
	role: "alert"
}, ol = {
	id: "library",
	class: "panel",
	"aria-labelledby": "libraryTitle"
}, sl = { class: "section-heading" }, cl = { id: "libraryTitle" }, ll = ["disabled"], ul = ["placeholder", "aria-label"], dl = ["aria-label"], fl = { value: "" }, pl = ["value"], ml = ["disabled"], hl = {
	id: "libraryStatus",
	class: "library-status",
	role: "status"
}, gl = {
	id: "libraryList",
	class: "library-grid"
}, _l = {
	key: 0,
	class: "library-status"
}, vl = { class: "library-meta" }, yl = { class: "library-card-actions" }, bl = ["href"], xl = ["href"], Sl = ["disabled", "onClick"], Cl = { class: "actions" }, wl = ["disabled"], Tl = ["disabled"], El = { class: "library-admin" }, Dl = ["disabled"], Ol = { class: "muted" }, kl = { id: "catalogAdminEditor" }, Al = { class: "muted" }, jl = ["id", "onUpdate:modelValue"], Ml = ["disabled"], Nl = {
	id: "catalogStatus",
	class: "muted",
	role: "status"
}, Pl = { class: "section-heading" }, Fl = {
	type: "submit",
	class: "button secondary"
}, Il = {
	id: "compoundBankList",
	class: "bank-list"
}, Ll = {
	key: 0,
	class: "library-status"
}, Rl = {
	key: 1,
	role: "alert"
}, zl = {
	key: 2,
	class: "library-status"
}, Bl = { class: "library-meta" }, Vl = ["disabled", "onClick"], Hl = {
	key: 4,
	class: "error",
	role: "alert"
}, Ul = {
	__name: "PlayApp",
	setup(e) {
		let t = ao(), { capabilities: n, submission: r, integrated: i, commonsBase: a, submitReview: o, loadPublication: s, base: c, TYPES: l, TYPE_LABELS: u, language: d, t: f, view: p, ready: m, busy: h, form: g, saved: _, formError: v, message: y, messageError: b, savingDisabled: x, demoUrl: S, catalog: C, catalogDraft: w, catalogMessage: T, library: E, bank: ee, bankDialog: D, adminInput: O, adminToken: te, published: ne, editorTitle: k, choose: A, go: j, changeLanguage: re, saveActivity: M, openLibrary: ie, filterLibrary: ae, applyToken: oe, removeActivity: se, publication: N, saveCatalog: ce, openBank: le, loadBank: ue, addFromBank: de, closeBank: fe, copy: pe, onStatement: me } = t, he = [
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
		function F(e) {
			let t = d.value === "va" ? "ca" : d.value;
			return C.value.labels?.[e]?.[t] || e;
		}
		return (e, s) => (Y(), X(J, null, [Z("header", sc, [Z("a", {
			class: "brand",
			href: U(c) + "/"
		}, "EduTicTac Play", 8, cc), Z("div", lc, [U(a) === null ? Q("", !0) : (Y(), X("edutictac-account", {
			key: 0,
			id: "accountWidget",
			"data-base": U(a),
			"data-home": U(i) ? (U(a) || "") + "/" : null,
			"data-lang": U(d),
			"data-no-reload": ""
		}, null, 8, uc)), U(a) === null ? (Y(), X("label", dc, [Z("span", null, I(U(f)("language")), 1), Z("select", {
			id: "language",
			value: U(d),
			disabled: U(h),
			onChange: s[0] ||= (e) => U(re)(e.target.value)
		}, [...s[33] ||= [
			Z("option", { value: "es" }, "ES", -1),
			Z("option", { value: "ca" }, "CA", -1),
			Z("option", { value: "va" }, "VA", -1),
			Z("option", { value: "en" }, "EN", -1)
		]], 40, fc)])) : Q("", !0)])]), Z("main", pc, [
			U(i) && !U(n).can_publish && !U(n).can_submit ? (Y(), X("p", mc, [Z("a", {
				class: "button secondary",
				href: U(c) + "/api/publication/login"
			}, I(U(f)("teacherLogin")), 9, hc), Z("span", null, I(U(f)("loginToSave")), 1)])) : Q("", !0),
			U(m) ? Q("", !0) : (Y(), X("p", gc, I(U(f)("libraryLoading")), 1)),
			K(Z("section", _c, [
				s[34] ||= Z("p", { class: "eyebrow" }, "EduTicTac Commons", -1),
				Z("h1", null, I(U(f)("homeTitle")), 1),
				Z("p", null, I(U(f)("homeIntro")), 1),
				U(S) ? (Y(), X("p", vc, [Z("strong", null, I(U(f)("testPhaseTitle")), 1), di(" " + I(U(f)("testPhaseNotice")), 1)])) : Q("", !0),
				U(S) ? (Y(), X("p", yc, [
					Z("strong", null, I(U(f)("demoTitle")), 1),
					di(" " + I(U(f)("demoNotice")) + " ", 1),
					Z("a", {
						id: "demoLink",
						href: U(S)
					}, I(U(f)("demoLink")), 9, bc)
				])) : (Y(), X("p", xc, I(U(f)(U(i) ? "productionNotice" : "anonymousNotice")), 1)),
				Z("div", Sc, [U(n).can_review ? (Y(), X("button", {
					key: 0,
					id: "openReviews",
					class: "button",
					onClick: s[1] ||= (e) => U(j)("reviews")
				}, I(U(f)("reviewsTitle")), 1)) : Q("", !0), U(i) && !U(n).can_publish && !U(n).can_submit ? (Y(), X("a", {
					key: 1,
					id: "playLogin",
					class: "button secondary",
					href: U(c) + "/api/publication/login"
				}, I(U(f)("teacherLogin")), 9, Cc)) : Q("", !0)]),
				Z("div", wc, [(Y(!0), X(J, null, q(U(l), (e, t) => (Y(), X("button", {
					key: e,
					class: "type-card",
					"data-type": e,
					disabled: U(h),
					onClick: (t) => U(A)(e)
				}, [
					Z("span", Ec, I(he[t]), 1),
					Z("strong", null, I(U(f)(U(u)[e])), 1),
					Z("small", null, I(U(f)(e === "compound" ? "compound.help" : U(u)[e] + "Help")), 1)
				], 8, Tc))), 128))]),
				Z("div", Dc, [Z("button", {
					id: "openLibrary",
					type: "button",
					class: "button secondary",
					onClick: s[2] ||= (...e) => U(ie) && U(ie)(...e)
				}, I(U(f)("libraryOpen")), 1)])
			], 512), [[Zi, U(p) === "home" && U(m)]]),
			K(Z("section", Oc, [Z("div", kc, [Z("div", null, [s[35] ||= Z("p", { class: "eyebrow" }, "EduTicTac Play", -1), Z("h1", Ac, I(U(k)), 1)]), Z("button", {
				id: "backHome",
				class: "button secondary",
				disabled: U(h),
				onClick: s[3] ||= (e) => U(j)("home")
			}, I(U(f)("back")), 9, jc)]), Z("form", {
				id: "activityForm",
				novalidate: "",
				onSubmit: s[10] ||= Ha((e) => U(M)(!0), ["prevent"])
			}, [
				Z("fieldset", {
					class: "editor-controls",
					disabled: U(h)
				}, [
					Z("label", null, [Z("span", null, I(U(f)("title")), 1), K(Z("input", {
						id: "title",
						"onUpdate:modelValue": s[4] ||= (e) => U(g).title = e,
						maxlength: "200",
						required: "",
						placeholder: U(f)("titlePlaceholder")
					}, null, 8, Nc), [[$, U(g).title]])]),
					Z("label", null, [Z("span", null, I(U(f)("question")), 1), K(Z("textarea", {
						id: "question",
						"onUpdate:modelValue": s[5] ||= (e) => U(g).question = e,
						maxlength: "2000",
						required: "",
						placeholder: U(f)("questionPlaceholder")
					}, null, 8, Pc), [[$, U(g).question]])]),
					(Y(), ni(zs, {
						key: U(g),
						form: U(g),
						t: U(f),
						busy: U(h),
						onBank: U(le),
						onImageError: s[6] ||= (e) => v.value = U(f)("imageError"),
						onImageBusy: s[7] ||= (e) => U(t).imageTasks.value += e
					}, null, 8, [
						"form",
						"t",
						"busy",
						"onBank"
					])),
					Z("fieldset", Fc, [
						Z("legend", null, I(U(f)("catalog.legend")), 1),
						(Y(), X(J, null, q([
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
						], (e) => Z("label", { key: e.id }, [Z("span", null, I(U(f)("catalog." + e.label)), 1), K(Z("select", {
							id: e.id,
							"onUpdate:modelValue": (t) => U(g)[e.key] = t
						}, [
							s[36] ||= Z("option", { value: "" }, null, -1),
							U(g)[e.key] && !(U(C)[e.list] || []).includes(U(g)[e.key]) ? (Y(), X("option", {
								key: 0,
								value: U(g)[e.key]
							}, I(F(U(g)[e.key])), 9, Lc)) : Q("", !0),
							(Y(!0), X(J, null, q(U(C)[e.list] || [], (e) => (Y(), X("option", {
								key: e,
								value: e
							}, I(F(e)), 9, Rc))), 128))
						], 8, Ic), [[Fa, U(g)[e.key]]])])), 64)),
						Z("label", null, [Z("span", null, I(U(f)("catalog.tags")), 1), K(Z("select", {
							id: "activityTags",
							"onUpdate:modelValue": s[8] ||= (e) => U(g).tags = e,
							multiple: "",
							size: "4"
						}, [(Y(!0), X(J, null, q([.../* @__PURE__ */ new Set([...U(C).tags || [], ...U(g).tags || []])], (e) => (Y(), X("option", {
							key: e,
							value: e
						}, I(F(e)), 9, zc))), 128))], 512), [[Fa, U(g).tags]])])
					])
				], 8, Mc),
				Z("p", Bc, I(U(v)), 1),
				Z("div", Vc, [Z("button", {
					id: "preview",
					type: "submit",
					class: "button",
					disabled: U(x)
				}, I(U(f)("preview")), 9, Hc), Z("button", {
					id: "save",
					type: "button",
					class: "button secondary",
					disabled: U(x),
					onClick: s[9] ||= (e) => U(M)(!1)
				}, I(U(f)("save")), 9, Uc)])
			], 32)], 512), [[Zi, U(p) === "editor" && U(m)]]),
			U(p) === "previewPanel" && U(_) ? (Y(), X("section", Wc, [
				Z("div", Gc, [Z("div", null, [Z("p", Kc, I(U(f)("previewEyebrow")), 1), Z("h1", qc, I(U(_).title), 1)]), Z("button", {
					id: "edit",
					class: "button secondary",
					disabled: U(h),
					onClick: s[11] ||= (e) => U(j)("editor")
				}, I(U(f)("edit")), 9, Jc)]),
				si(Vs, {
					base: U(c),
					activity: U(_),
					"on-statement": U(me)
				}, {
					default: Cn(() => [di(I(U(f)("playerError")), 1)]),
					_: 1
				}, 8, [
					"base",
					"activity",
					"on-statement"
				]),
				U(_).id.startsWith("preview-") ? (Y(), X("div", Yc, [Z("button", {
					id: "savePreview",
					class: "button",
					disabled: U(x),
					onClick: s[12] ||= (e) => U(M)(!1)
				}, I(U(f)("save")), 9, Xc), Z("span", null, I(U(f)("previewOnly")), 1)])) : (Y(), X("div", Zc, [
					Z("a", {
						id: "download",
						class: "button",
						href: U(c) + "/api/activities/" + U(_).id + "/download"
					}, I(U(f)("download")), 9, Qc),
					!U(ne) && U(n).can_publish ? (Y(), X("button", {
						key: 0,
						id: "publishRecursos",
						class: "button",
						disabled: U(h),
						onClick: s[13] ||= (e) => U(N)(!1)
					}, I(U(f)("publishRecursos")), 9, $c)) : U(ne) && U(n).can_publish ? (Y(), X("button", {
						key: 1,
						id: "unpublishRecursos",
						class: "button secondary",
						disabled: U(h),
						onClick: s[14] ||= (e) => U(N)(!0)
					}, I(U(f)("unpublishRecursos")), 9, el)) : Q("", !0),
					U(n).can_submit ? (Y(), X("button", {
						key: 2,
						id: "submitPlayReview",
						class: "button",
						disabled: U(h) || ["pending", "approved"].includes(U(r)?.status),
						onClick: s[15] ||= (...e) => U(o) && U(o)(...e)
					}, I(U(f)("reviewSubmit")), 9, tl)) : Q("", !0),
					Z("button", {
						id: "copy",
						class: "button secondary",
						onClick: s[16] ||= (...e) => U(pe) && U(pe)(...e)
					}, I(U(f)("copy")), 1),
					U(_).owned ? (Y(), X("button", {
						key: 3,
						id: "deleteSaved",
						class: "button secondary",
						disabled: U(h),
						onClick: s[17] ||= (e) => U(se)(U(_).id)
					}, I(U(f)("deleteActivity")), 9, nl)) : Q("", !0)
				])),
				U(r) ? (Y(), X("p", rl, [di(I(U(f)("reviewStatus." + U(r).status)), 1), U(r).feedback ? (Y(), X("span", il, " · " + I(U(r).feedback), 1)) : Q("", !0)])) : Q("", !0),
				Z("p", {
					id: "savedMessage",
					class: P({ error: U(b) }),
					role: "status"
				}, I(U(y) ? U(f)(U(y)) : ""), 3),
				U(v) ? (Y(), X("p", al, I(U(v)), 1)) : Q("", !0)
			])) : Q("", !0),
			K(Z("section", ol, [
				Z("div", sl, [Z("div", null, [s[37] ||= Z("p", { class: "eyebrow" }, "EduTicTac Play", -1), Z("h1", cl, I(U(f)("libraryTitle")), 1)]), Z("button", {
					id: "libraryBack",
					class: "button secondary",
					disabled: U(h),
					onClick: s[18] ||= (e) => U(j)("home")
				}, I(U(f)("back")), 9, ll)]),
				Z("form", {
					class: "library-filters",
					onSubmit: s[22] ||= Ha((e) => U(ae)(), ["prevent"])
				}, [
					K(Z("input", {
						id: "librarySearch",
						"onUpdate:modelValue": s[19] ||= (e) => U(E).term = e,
						type: "search",
						placeholder: U(f)("librarySearchPlaceholder"),
						"aria-label": U(f)("libraryFilter")
					}, null, 8, ul), [[$, U(E).term]]),
					K(Z("select", {
						id: "libraryType",
						"onUpdate:modelValue": s[20] ||= (e) => U(E).type = e,
						"aria-label": U(f)("compound.type"),
						onChange: s[21] ||= (e) => U(ae)()
					}, [Z("option", fl, I(U(f)("libraryAllTypes")), 1), (Y(!0), X(J, null, q(U(l), (e) => (Y(), X("option", {
						key: e,
						value: e
					}, I(U(f)(U(u)[e])), 9, pl))), 128))], 40, dl), [[Fa, U(E).type]]),
					Z("button", {
						id: "libraryFilter",
						type: "submit",
						class: "button secondary",
						disabled: U(h)
					}, I(U(f)("libraryFilter")), 9, ml)
				], 32),
				Z("p", hl, I(U(E).loading ? U(f)("libraryLoading") : U(E).error ? U(f)("libraryError") : U(f)("libraryStatus").replace(":from", U(E).total ? U(E).offset + 1 : 0).replace(":to", U(E).offset + U(E).items.length).replace(":total", U(E).total)), 1),
				Z("div", gl, [!U(E).loading && !U(E).error && !U(E).items.length ? (Y(), X("p", _l, I(U(f)("libraryEmpty")), 1)) : Q("", !0), (Y(!0), X(J, null, q(U(E).items, (e) => (Y(), X("article", {
					key: e.id,
					class: "library-card"
				}, [
					Z("h2", null, I(e.title), 1),
					Z("p", vl, I(U(f)(U(u)[e.type] || e.type)) + " · " + I((e.createdAt || "").slice(0, 10)) + I(e.owned ? " · " + U(f)("libraryYours") : ""), 1),
					Z("div", yl, [
						Z("a", {
							class: "button",
							href: U(c) + "/" + e.id
						}, I(U(f)("libraryOpenActivity")), 9, bl),
						Z("a", {
							class: "button secondary",
							href: U(c) + "/api/activities/" + e.id + "/download"
						}, I(U(f)("download")), 9, xl),
						e.owned || U(te) ? (Y(), X("button", {
							key: 0,
							type: "button",
							class: "button secondary",
							disabled: U(h),
							onClick: (t) => U(se)(e.id, !0)
						}, I(U(f)("libraryDelete")), 9, Sl)) : Q("", !0)
					])
				]))), 128))]),
				Z("div", Cl, [Z("button", {
					id: "libraryPrev",
					type: "button",
					class: "button secondary",
					disabled: U(E).loading || U(h) || U(E).offset <= 0,
					onClick: s[23] ||= (e) => U(ae)(Math.max(0, U(E).offset - 12))
				}, I(U(f)("libraryPrev")), 9, wl), Z("button", {
					id: "libraryNext",
					type: "button",
					class: "button secondary",
					disabled: U(E).loading || U(h) || !U(E).hasMore,
					onClick: s[24] ||= (e) => U(ae)(U(E).offset + 12)
				}, I(U(f)("libraryNext")), 9, Tl)]),
				Z("details", El, [
					Z("summary", null, I(U(f)("libraryAdmin")), 1),
					Z("label", null, [Z("span", null, I(U(f)("libraryAdminToken")), 1), K(Z("input", {
						id: "libraryToken",
						"onUpdate:modelValue": s[25] ||= (e) => /* @__PURE__ */ V(O) ? O.value = e : null,
						type: "password",
						autocomplete: "off"
					}, null, 512), [[$, U(O)]])]),
					Z("button", {
						id: "libraryTokenSave",
						type: "button",
						class: "button secondary",
						disabled: U(h),
						onClick: s[26] ||= (...e) => U(oe) && U(oe)(...e)
					}, I(U(f)("libraryTokenSave")), 9, Dl),
					Z("p", Ol, I(U(f)("libraryAdminHelp")), 1),
					Z("div", kl, [Z("fieldset", null, [
						Z("legend", null, I(U(f)("catalogAdmin")), 1),
						Z("p", Al, I(U(f)("catalogAdminHelp")), 1),
						(Y(), X(J, null, q([
							"subjects",
							"educational_stages",
							"levels",
							"tags"
						], (e, t) => Z("label", { key: e }, [Z("span", null, I(U(f)("catalog." + [
							"subject",
							"stage",
							"level",
							"tags"
						][t])), 1), K(Z("textarea", {
							id: [
								"catalogSubjects",
								"catalogStages",
								"catalogLevels",
								"catalogTags"
							][t],
							"onUpdate:modelValue": (t) => U(w)[e] = t,
							rows: "3"
						}, null, 8, jl), [[$, U(w)[e]]])])), 64)),
						Z("button", {
							id: "catalogSave",
							type: "button",
							class: "button secondary",
							disabled: U(h),
							onClick: s[27] ||= (...e) => U(ce) && U(ce)(...e)
						}, I(U(f)("catalogSave")), 9, Ml),
						Z("p", Nl, I(U(T) ? U(f)(U(T)) : ""), 1)
					])])
				])
			], 512), [[Zi, U(p) === "library" && U(m)]]),
			U(p) === "reviews" && U(n).can_review ? (Y(), X(J, { key: 3 }, [Z("button", {
				id: "reviewsBack",
				class: "button secondary",
				onClick: s[28] ||= (e) => U(j)("home")
			}, I(U(f)("back")), 1), si(oc, {
				base: U(c),
				t: U(f)
			}, null, 8, ["base", "t"])], 64)) : Q("", !0),
			Z("dialog", {
				ref_key: "bankDialog",
				ref: D,
				id: "compoundBankDialog",
				onCancel: s[32] ||= (...e) => U(fe) && U(fe)(...e)
			}, [Z("form", {
				method: "dialog",
				class: "bank-dialog",
				onSubmit: s[31] ||= Ha((...e) => U(fe) && U(fe)(...e), ["prevent"])
			}, [
				Z("div", Pl, [Z("h2", null, I(U(f)("bank.title")), 1), Z("button", Fl, I(U(f)("bank.close")), 1)]),
				Z("label", null, [Z("span", null, I(U(f)("bank.search")), 1), K(Z("input", {
					id: "compoundBankSearch",
					"onUpdate:modelValue": s[29] ||= (e) => U(ee).term = e,
					type: "search",
					onInput: s[30] ||= (...e) => U(ue) && U(ue)(...e)
				}, null, 544), [[$, U(ee).term]])]),
				Z("div", Il, [U(ee).loading ? (Y(), X("p", Ll, I(U(f)("bank.loading")), 1)) : U(ee).error ? (Y(), X("p", Rl, I(U(f)("libraryError")), 1)) : U(ee).items.length ? Q("", !0) : (Y(), X("p", zl, I(U(f)("bank.empty")), 1)), (Y(!0), X(J, null, q(U(ee).items, (e) => (Y(), X("article", {
					key: e.id,
					class: "library-card"
				}, [Z("div", null, [Z("h3", null, I(e.title), 1), Z("p", Bl, I(U(f)(U(u)[e.type])), 1)]), Z("button", {
					type: "button",
					class: "button",
					disabled: U(h),
					onClick: (t) => U(de)(e.id)
				}, I(U(f)("bank.addOne")), 9, Vl)]))), 128))])
			], 32)], 544),
			U(p) === "home" && U(v) ? (Y(), X("p", Hl, I(U(v)), 1)) : Q("", !0)
		])], 64));
	}
};
// services/play/src/main.js
function Wl(e) {
	return Ka(Ul).mount(e);
}
export { Wl as mountPlay };
