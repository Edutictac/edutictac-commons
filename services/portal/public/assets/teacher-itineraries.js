// ../edutictac-commons/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), T = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, E = /-\w/g, D = T((e) => e.replace(E, (e) => e.slice(1).toUpperCase())), te = /\B([A-Z])/g, O = T((e) => e.replace(te, "-$1").toLowerCase()), ne = T((e) => e.charAt(0).toUpperCase() + e.slice(1)), re = T((e) => e ? `on${ne(e)}` : ""), k = (e, t) => !Object.is(e, t), ie = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ae = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, oe = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, se, ce = () => se ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function le(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? pe(r) : le(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
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
function A(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = A(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var me = /* @__PURE__ */ e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function he(e) {
	return !!e || e === "";
}
function ge(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = be(e[i], t[i], n);
	return r;
}
function _e(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && be(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function ve(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? _e(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !be(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ye(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function be(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? ye(e, t, n, ge) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : ye(e, t, n, ve) : String(e) === String(t))));
}
var xe = (e) => !!(e && e.__v_isRef === !0), j = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? xe(e) ? j(e.value) : JSON.stringify(e, Se, 2) : String(e), Se = (e, t) => xe(t) ? Se(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ce(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ce(e)) } : _(t) ? Ce(t) : v(t) && !d(t) && !C(t) ? String(t) : t, Ce = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, M, we = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && M && (M.active ? (this.parent = M, this.index = (M.scopes || (M.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = M;
			try {
				return M = this, e();
			} finally {
				M = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = M, M = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (M === this) M = this.prevScope;
			else {
				let e = M;
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
	return M;
}
var N, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, M && (M.active ? M.effects.push(this) : this.flags &= -2);
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
		let e = N, t = Be;
		N = this, Be = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), N = e, Be = t, this.flags &= -3;
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
	let t = e.dep, n = N, r = Be;
	N = e, Be = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || k(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		N = n, Be = r, Fe(e), e.flags &= -3;
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
		let e = N;
		N = void 0;
		try {
			t();
		} finally {
			N = e;
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
		if (!N || !Be || N === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== N) t = this.activeLink = new Ke(N, this), N.deps ? (t.prevDep = N.depsTail, N.depsTail.nextDep = t, N.depsTail = t) : N.deps = N.depsTail = t, Je(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = N.depsTail, t.nextDep = void 0, N.depsTail.nextDep = t, N.depsTail = t, N.deps === t && (N.deps = e);
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
function P(e, t, n) {
	if (Be && N) {
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
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Qe || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Qe)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Xe)), f(e) && s(o.get(Ze)));
				break;
			case "delete":
				i || (s(o.get(Xe)), f(e) && s(o.get(Ze)));
				break;
			case "set": f(e) && s(o.get(Xe));
		}
	}
	Ne();
}
function et(e) {
	let t = /* @__PURE__ */ I(e);
	return t === e || (P(t, "iterate", Qe), /* @__PURE__ */ F(e)) ? t : /* @__PURE__ */ zt(e) ? /* @__PURE__ */ Rt(e) ? t.map((e) => Ht(L(e))) : t.map(Ht) : t.map(L);
}
function tt(e) {
	return P(e = /* @__PURE__ */ I(e), "iterate", Qe), e;
}
function nt(e, t) {
	return /* @__PURE__ */ zt(e) ? Ht(/* @__PURE__ */ Rt(e) ? L(t) : t) : L(t);
}
var rt = {
	__proto__: null,
	[Symbol.iterator]() {
		return it(this, Symbol.iterator, (e) => nt(this, e));
	},
	concat(...e) {
		return et(this).concat(...e.map((e) => d(e) ? et(e) : e));
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
	if (r !== e && !/* @__PURE__ */ F(e)) {
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
	let o = tt(e), s = o !== e && !/* @__PURE__ */ F(e), c = o[t];
	if (c !== ot[t]) {
		let t = c.apply(e, a);
		return s ? L(t) : t;
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
	let i = tt(e), a = i !== e && !/* @__PURE__ */ F(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = nt(e, t)), n.call(this, t, nt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? nt(e, c) : c;
}
function lt(e, t, n) {
	let r = /* @__PURE__ */ I(e);
	P(r, "iterate", Qe);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Bt(n[0]) ? (n[0] = /* @__PURE__ */ I(n[0]), r[t](...n)) : i;
}
function ut(e, t, n = []) {
	He(), Me();
	let r = (/* @__PURE__ */ I(e))[t].apply(e, n);
	return Ne(), Ue(), r;
}
var dt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ft = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function pt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ I(this);
	return P(t, "has", e), t.hasOwnProperty(e);
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
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = rt[t])) return e;
			if (t === "hasOwnProperty") return pt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ R(e) ? e : n);
		if ((_(t) ? ft.has(t) : dt(t)) || (r || P(e, "get", t), i)) return o;
		if (/* @__PURE__ */ R(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ It(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ It(o) : /* @__PURE__ */ Pt(o) : o;
	}
}, ht = class extends mt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ zt(i);
			if (!/* @__PURE__ */ F(n) && !/* @__PURE__ */ zt(n) && (i = /* @__PURE__ */ I(i), n = /* @__PURE__ */ I(n)), !a && /* @__PURE__ */ R(i) && !/* @__PURE__ */ R(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ R(e) ? e : r);
		return e === /* @__PURE__ */ I(r) && s && (o ? k(n, i) && $e(e, "set", t, n, i) : $e(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && $e(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && ft.has(t) || P(e, "has", t), n;
	}
	ownKeys(e) {
		return P(e, "iterate", d(e) ? "length" : Xe), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ I(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? bt : t ? Ht : L;
		return !t && P(a, "iterate", l ? Ze : Xe), s(Object.create(u), { next() {
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
function Ct(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function wt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ I(r), a = /* @__PURE__ */ I(n);
			e || (k(n, a) && P(i, "get", n), P(i, "get", a));
			let { has: o } = xt(i), s = t ? bt : e ? Ht : L;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && P(/* @__PURE__ */ I(t), "iterate", Xe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ I(n), i = /* @__PURE__ */ I(t);
			return e || (k(t, i) && P(r, "has", t), P(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ I(a), s = t ? bt : e ? Ht : L;
			return !e && P(o, "iterate", Xe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: Ct("add"),
		set: Ct("set"),
		delete: Ct("delete"),
		clear: Ct("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ I(this), r = xt(n), i = /* @__PURE__ */ I(e), a = !t && !/* @__PURE__ */ F(e) && !/* @__PURE__ */ zt(e) ? i : e;
			return r.has.call(n, a) || k(e, a) && r.has.call(n, e) || k(i, a) && r.has.call(n, i) || (n.add(a), $e(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ F(n) || /* @__PURE__ */ zt(n) || (n = /* @__PURE__ */ I(n));
			let r = /* @__PURE__ */ I(this), { has: i, get: a } = xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ I(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? k(n, s) && $e(r, "set", e, n, s) : $e(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ I(this), { has: n, get: r } = xt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ I(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && $e(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ I(this), t = e.size !== 0, n = e.clear();
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
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
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
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Nt(S(e));
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
function F(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function I(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ I(t) : e;
}
function Vt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && ae(e, "__v_skip", !0), e;
}
var L = (e) => v(e) ? /* @__PURE__ */ Pt(e) : e, Ht = (e) => v(e) ? /* @__PURE__ */ It(e) : e;
// @__NO_SIDE_EFFECTS__
function R(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	return Wt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Ut(e) {
	return Wt(e, !0);
}
function Wt(e, t) {
	return /* @__PURE__ */ R(e) ? e : new Gt(e, t);
}
var Gt = class {
	constructor(e, t) {
		this.dep = new qe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ I(e), this._value = t ? e : L(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ F(e) || /* @__PURE__ */ zt(e);
		e = n ? e : /* @__PURE__ */ I(e), k(e, t) && (this._rawValue = e, this._value = n ? e : L(e), this.dep.trigger());
	}
};
function B(e) {
	return /* @__PURE__ */ R(e) ? e.value : e;
}
var Kt = {
	get: (e, t, n) => t === "__v_raw" ? e : B(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ R(i) && !/* @__PURE__ */ R(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function qt(e) {
	return /* @__PURE__ */ Rt(e) ? e : new Proxy(e, Kt);
}
var Jt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new qe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ge - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && N !== this) return je(this, !0), !0;
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
function Yt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Jt(r, i, n);
}
var Xt = {}, Zt = /* @__PURE__ */ new WeakMap(), Qt = void 0;
function $t(e, t = !1, n = Qt) {
	if (n) {
		let t = Zt.get(n);
		t || Zt.set(n, t = []), t.push(e);
	}
}
function en(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ F(e) || o === !1 || o === 0 ? tn(e, 1) : tn(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ R(e) ? (g = () => e.value, y = /* @__PURE__ */ F(e)) : /* @__PURE__ */ Rt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Rt(e) || /* @__PURE__ */ F(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ R(e)) return e.value;
		if (/* @__PURE__ */ Rt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			He();
			try {
				_();
			} finally {
				Ue();
			}
		}
		let t = Qt;
		Qt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Qt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => tn(e(), t);
	}
	let x = Te(), S = () => {
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
	let C = b ? Array(e.length).fill(Xt) : Xt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => k(e, C[t])) : k(t, C))) {
					let e = Qt;
					He();
					try {
						_ && _(), Qt = m;
						let e = [
							t,
							C === Xt ? void 0 : b && C[0] === Xt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Qt = e, Ue();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new De(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => $t(e, !1, m), _ = m.onStop = () => {
		let e = Zt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Zt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function tn(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ R(e)) tn(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) tn(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		tn(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) tn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && tn(e[r], t, n);
	}
	return e;
}
// ../edutictac-commons/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function nn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		an(e, t, n);
	}
}
function rn(e, t, n, r) {
	if (h(e)) {
		let i = nn(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			an(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(rn(e[a], t, n, r));
		return i;
	}
}
function an(e, n, r, i = !0) {
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
			He(), nn(o, null, 10, [
				e,
				i,
				a
			]), Ue();
			return;
		}
	}
	on(e, r, a, i, s);
}
function on(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var V = [], H = -1, sn = [], cn = null, ln = 0, un = /* @__PURE__ */ Promise.resolve(), dn = null;
function fn(e) {
	let t = dn || un;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function pn(e) {
	let t = H + 1, n = V.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = V[r], a = xn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function mn(e) {
	if (!(e.flags & 1)) {
		let t = xn(e), n = V[V.length - 1];
		!n || !(e.flags & 2) && t >= xn(n) ? V.push(e) : V.splice(pn(t), 0, e), e.flags |= 1, hn();
	}
}
function hn() {
	dn ||= un.then(Sn);
}
function gn(e) {
	if (!d(e)) cn && e.id === -1 ? cn.splice(ln + 1, 0, e) : e.flags & 1 || (sn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) sn.push(e[t]);
	hn();
}
function _n(e, t, n, r = H + 1) {
	for (; r < V.length; r++) {
		let n = V[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			V.splice(r, 1), r = e ? r - 1 : H, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function vn(e, t, n = 0) {
	if (sn.length) {
		let e = sn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < sn.length; i++) {
				let a = sn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? sn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => xn(e) - xn(t));
		if (sn.length = r, cn) {
			for (let e = 0; e < i.length; e++) cn.push(i[e]);
			return;
		}
		for (cn = i, ln = 0; ln < cn.length; ln++) {
			let e = cn[ln];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		cn = null, ln = 0;
	}
}
var yn = !1;
function bn(e, t) {
	if (yn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(sn);
	e(), yn = !0;
	try {
		_n(void 0, t), vn(void 0, n, t);
	} finally {
		yn = !1;
	}
}
var xn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Sn(e) {
	try {
		for (H = 0; H < V.length; H++) {
			let e = V[H];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), nn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; H < V.length; H++) {
			let e = V[H];
			e && (e.flags &= -2);
		}
		H = -1, V.length = 0, vn(e), dn = null, (V.length || sn.length) && Sn(e);
	}
}
var U = null, Cn = null;
function wn(e) {
	let t = U;
	return U = e, Cn = e && e.type.__scopeId || null, t;
}
function Tn(e, t = U, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && li(-1);
		let i = wn(t), a = oi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = oi.length; e > a; e--) si();
			wn(i), r._d && li(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function En(e, n) {
	if (U === null) return e;
	let r = Ui(U), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && tn(o), i.push({
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
function Dn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (He(), rn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ue());
	}
}
function On(e, t, n = !1) {
	let r = Ai();
	if (r || hr) {
		let i = hr ? hr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var kn = /* @__PURE__ */ Symbol.for("v-scx"), An = () => On(kn);
function jn(e, t, n) {
	return Mn(e, t, n);
}
function Mn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Ii) {
		if (c === "sync") {
			let e = An();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = ki;
	u.call = (e, t, n) => rn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		e.i = p, G(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : mn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = en(e, n, u);
	return Ii && (f ? f.push(h) : d && h()), h;
}
var Nn = /* @__PURE__ */ new WeakMap(), Pn = /* @__PURE__ */ Symbol("_vte"), Fn = (e) => e.__isTeleport, In = (e) => e && (e.disabled || e.disabled === ""), Ln = (e) => e && (e.defer || e.defer === ""), Rn = (e) => typeof SVGElement < "u" && e instanceof SVGElement, zn = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Bn = (e, t) => {
	let n = e && e.to;
	return g(n) ? t ? t(n) : null : n;
}, Vn = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = In(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = In(e.props), r = e.target = Bn(e.props, m), a = Kn(r, e, h, p);
			r && (o !== "svg" && Rn(r) ? o = "svg" : o !== "mathml" && zn(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), Gn(e, !1)));
		}, S = (e) => {
			let t = () => {
				if (Nn.get(e) === t) {
					if (Nn.delete(e), In(e.props)) {
						let t = _(e.el) || n;
						b(e, t, e.anchor), Gn(e, !0);
					}
					x(e);
				}
			};
			Nn.set(e, t), G(t, a);
		};
		if (e == null) {
			let e = t.el = h(""), i = t.anchor = h("");
			if (p(e, n, r), p(i, n, r), Ln(t.props) || a && a.pendingBranch) {
				S(t);
				return;
			}
			v && (b(t, n, i), Gn(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = Nn.get(e);
			if (u) {
				u.flags |= 8, Nn.delete(e), S(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = In(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || Rn(p) ? o = "svg" : (o === "mathml" || zn(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), Xr(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Hn(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = Bn(t.props, m);
				e && (t.target = e, Hn(t, e, null, l, 0));
			} else g && Hn(t, p, h, l, 1);
			Gn(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = In(f), m = a || !p, h = Nn.get(e);
		if (h && (h.flags |= 8, Nn.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, m, !!i.dynamicChildren);
		}
	},
	move: Hn,
	hydrate: Un
};
function Hn(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && (e.targetStart && r(e.targetStart, t, n), r(e.targetAnchor, t, n), n = e.targetAnchor);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !Nn.has(e) && (!d || In(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function Un(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
	function f(e, n) {
		let r = n;
		for (; r;) {
			if (r && r.nodeType === 8) {
				if (r.data === "teleport start anchor") t.targetStart = r;
				else if (r.data === "teleport anchor") {
					t.targetAnchor = r, e._lpa = t.targetAnchor && o(t.targetAnchor);
					break;
				}
			}
			r = o(r);
		}
	}
	function p(e, t) {
		t.anchor = d(o(e), t, s(e), n, r, i, a);
	}
	let m = t.target = Bn(t.props, c), h = In(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || Kn(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || Kn(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), Gn(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var Wn = Vn;
function Gn(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function Kn(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[Pn] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var qn = /* @__PURE__ */ Symbol("_leaveCb");
function Jn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ii) {
			t = n;
			break;
		}
	}
	return t;
}
function Yn(e) {
	if (!ir(e)) return Fn(e.type) && e.children ? Jn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Xn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Xn(Fn(n.type) && Yn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === K && d(e.children)) {
		let n = xr(e.children, !1);
		n && Xn(n, t);
	}
}
function Zn(e) {
	if (e.component) return Zn(e.component.subTree);
	if (e.type === K) {
		let t = d(e.children) && xr(e.children, !1);
		return t ? Zn(t) : void 0;
	}
	if (e.type !== ii) return e;
}
function Qn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function $n(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var er = /* @__PURE__ */ new WeakMap();
function tr(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => tr(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (rr(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && tr(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Ui(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ I(v), b = v === t ? i : (e) => !$n(_, e) && u(y, e), x = (e, t) => !(t && $n(_, t));
	if (m != null && m !== p) {
		if (nr(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ R(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) nn(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ R(p);
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
					i(), er.delete(e);
				};
				t.id = -1, er.set(e, t), G(t, r);
			} else nr(e), i();
		}
	}
}
function nr(e) {
	let t = er.get(e);
	t && (t.flags |= 8, er.delete(e));
}
ce().requestIdleCallback, ce().cancelIdleCallback;
var rr = (e) => !!e.type.__asyncLoader, ir = (e) => e.type.__isKeepAlive;
function ar(e, t, n = ki, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			He();
			let i = Ni(n), a = rn(t, n, e, r);
			return i(), Ue(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var or = ((e) => (t, n = ki) => {
	Ii || ar(e, (...e) => t(...e), n);
})("bum"), sr = /* @__PURE__ */ Symbol.for("v-ndc");
function W(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Rt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ F(e), s = /* @__PURE__ */ zt(e), e = tt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ht(L(e[n])) : L(e[n]) : e[n], n, void 0, a && a[n]);
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
var cr = (e) => e ? Fi(e) ? Ui(e) : cr(e.parent) : null, lr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
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
		mn(e.update);
	},
	$nextTick: (e) => e.n ||= fn.bind(e.proxy),
	$watch: (e) => r
}), ur = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), dr = {
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
			else if (ur(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = lr[n], f, p;
		if (d) return n === "$attrs" && P(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return ur(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || ur(t, s) || u(a, s) || u(r, s) || u(lr, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function fr() {
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
var pr = 0;
function mr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = fr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: pr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Gi,
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
					let u = l._ceVNode || gi(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Ui(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (rn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = hr;
				hr = l;
				try {
					return e();
				} finally {
					hr = t;
				}
			}
		};
		return l;
	};
}
var hr = null, gr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function _r(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && gr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(oe)));
	let c, l = i[c = re(n)] || i[c = re(D(n))];
	!l && o && (l = i[c = re(O(n))]), l && rn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, rn(u, e, 6, a);
	}
}
function vr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function yr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, O(t)) || u(e, t));
}
function br(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = wn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = bi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = bi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Sr(c);
		}
	} catch (t) {
		oi.length = 0, an(t, e, 1), v = gi(ii);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Cr(y, a)), b = yi(b, y, !1, !0));
	}
	return n.dirs && (b = yi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Xn(Fn(b.type) && Yn(b) || b, n.transition), v = b, wn(_), v;
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
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Cr = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
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
		if (!u(e, a) || Er(t, e, a) && !yr(n, a)) return !0;
	}
	return !1;
}
function Er(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !be(r, i) : r !== i;
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
	e.props = n ? r ? i : /* @__PURE__ */ Ft(i) : e.type.props ? i : a, e.attrs = a;
}
function Mr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ I(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (yr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = D(o);
						i[t] = Pr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Nr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = O(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Pr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && $e(e.attrs, "set", "");
}
function Nr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ee(t)) continue;
		let l = n[t], d;
		a && u(a, d = D(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : yr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ I(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Pr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Pr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ni(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === O(n)) && (r = !0));
	}
	return r;
}
function Fr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = D(c[e]);
		Ir(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = D(e);
		if (Ir(t)) {
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
function Ir(e) {
	return e[0] !== "$" && !ee(e);
}
var Lr = (e) => e === "_" || e === "_ctx" || e === "$stable", Rr = (e) => d(e) ? e.map(bi) : [bi(e)], zr = (e, t, n) => {
	if (t._n) return t;
	let r = Tn((...e) => Rr(t(...e)), n);
	return r._c = !1, r;
}, Br = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Lr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = zr(n, i, r);
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
		e ? (Hr(r, t, n), n && ae(r, "_", e, !0)) : Br(t, r);
	} else t && Vr(e, t);
}, Wr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Hr(a, n, r) : (o = !n.$stable, Br(n, a)), s = n;
	} else n && (Vr(e, n), s = { default: 1 });
	if (o) for (let e in a) !Lr(e) && s[e] == null && delete a[e];
}, G = ni;
function Gr(e) {
	return Kr(e);
}
function Kr(e, i) {
	let a = ce();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !pi(e, t) && (i = ve(e), A(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case ri:
				y(e, t, r, i);
				break;
			case ii:
				b(e, t, r, i);
				break;
			case ai:
				e ?? x(t, r, i, s);
				break;
			case K:
				re(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? k(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, be);
		}
		d != null && a ? tr(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && tr(e.ref, null, o, e, !0);
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
				n && n._beginPatch(), te(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, qr(e, a), s, u), _ && Dn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && wi(f, r, e);
		}
		_ && Dn(e, null, r, "beforeMount");
		let v = Yr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && G(() => {
			try {
				f && wi(f, r, e), v && g.enter(d), _ && Dn(e, null, r, "mounted");
			} finally {}
		}, i);
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
			let c = e[l] = s ? xi(e[l]) : bi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, te = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Jr(r, !1), (g = h.onVnodeBeforeUpdate) && wi(g, r, n, e), f && Dn(n, e, r, "beforeUpdate"), r && Jr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, qr(n, a), o) : s || ue(e, n, l, null, r, i, qr(n, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && G(() => {
			g && wi(g, r, n, e), f && Dn(n, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || ei(c), d = u && (c.type === K || !pi(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, ne = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ee(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ee(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, re = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Xr(e, t, !0)) : ue(e, t, n, f, i, a, s, c, l);
	}, k = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ae(t, n, r, i, a, o, c) : oe(e, t, c);
	}, ae = (e, t, n, r, i, a, o) => {
		let s = e.component = Oi(e, r, i);
		if (ir(e) && (s.ctx.renderer = be), Li(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, se, o, a), !e.el) {
				let r = s.subTree = gi(ii);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else se(s, e, t, n, i, a, o);
	}, oe = (e, t, n) => {
		let r = t.component = e.component;
		if (wr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, se = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Qr(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							G(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Jr(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && ie(n), (d = t.props && t.props.onVnodeBeforeUpdate) && wi(d, s, t, c), Jr(e, !0);
				let f = br(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ve(p), e, i, a), t.el = f.el, u === null && Dr(e, f.el), r && G(r, i), (d = t.props && t.props.onVnodeUpdated) && G(() => wi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = rr(t);
				if (Jr(e, !1), l && ie(l), !m && (o = c && c.onVnodeBeforeMount) && wi(o, d, t), Jr(e, !0), s && j) {
					let t = () => {
						e.subTree = br(e), j(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = br(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && G(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					G(() => wi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && rr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && G(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => mn(u), Jr(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Mr(e, t.props, r, n), Wr(e, t.children, n), He(), _n(e), Ue();
	}, ue = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				de(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && _e(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? fe(l, d, n, r, i, a, o, s, c) : _e(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, de = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? xi(t[p]) : bi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? _e(e, a, o, !0, !1, f) : D(t, r, i, a, o, s, c, l, f);
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? xi(t[u]) : bi(t[u]);
			if (pi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? xi(t[p]) : bi(t[p]);
			if (pi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? xi(t[u]) : bi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) A(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? xi(t[u]) : bi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					A(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && pi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? A(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Zr(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || ei(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? pe(n, r, p, 2) : _--);
			}
		}
	}, pe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) pe(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, be);
		else if (c === K) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) pe(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === ai) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[qn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), G(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[qn];
					a._isLeaving && a[qn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, A = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (He(), tr(s, null, n, e, !0), Ue()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !rr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && wi(_, t, e), u & 6) ge(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Dn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== K || d > 0 && d & 64) ? _e(l, t, n, !1, !0) : (a === K && d & 384 || !i && u & 16) && _e(c, t, n), r && me(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && G(() => {
			_ && wi(_, t, e), h && Dn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, me = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === K;
		if (a && !i) {
			he(n, r);
			return;
		}
		if (t === ai) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Zn(e) : e, c = () => {
			a ? m(n) && he(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, he = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ge = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		$r(c), $r(l), r && ie(r), i.stop(), a ? (a.flags |= 8, A(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, A(o, e, t, n)), s && G(s, t), G(() => {
			e.isUnmounted = !0;
		}, t);
	}, _e = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) A(e[o], t, n, r, i);
	}, ve = (e) => {
		if (e.shapeFlag & 6) return ve(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Pn];
		return n ? h(n) : t;
	}, ye = (e, t, n) => {
		bn(() => {
			e == null ? t._vnode && A(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Di());
	}, be = {
		p: v,
		um: A,
		m: pe,
		r: me,
		mt: ae,
		mc: D,
		pc: ue,
		pbc: O,
		n: ve,
		o: e
	}, xe, j;
	return i && ([xe, j] = i(be)), {
		render: ye,
		hydrate: xe,
		createApp: mr(ye, xe)
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
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = xi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Xr(t, a)), a.type === ri && (a.patchFlag === -1 && (a = i[e] = xi(a)), a.el = t.el), a.type === ii && !a.el && (a.el = t.el);
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
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : gn(e);
}
var K = /* @__PURE__ */ Symbol.for("v-fgt"), ri = /* @__PURE__ */ Symbol.for("v-txt"), ii = /* @__PURE__ */ Symbol.for("v-cmt"), ai = /* @__PURE__ */ Symbol.for("v-stc"), oi = [], q = null;
function J(e = !1) {
	oi.push(q = e ? null : []);
}
function si() {
	oi.pop(), q = oi[oi.length - 1] || null;
}
var ci = 1;
function li(e, t = !1) {
	ci += e, e < 0 && q && t && (q.hasOnce = !0);
}
function ui(e) {
	return e.dynamicChildren = ci > 0 ? q || n : null, si(), ci > 0 && q && q.push(e), e;
}
function Y(e, t, n, r, i, a) {
	return ui(X(e, t, n, r, i, a, !0));
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
var mi = ({ key: e }) => e ?? null, hi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ R(e) || h(e) ? {
	i: U,
	r: e,
	k: t,
	f: !!n
} : e);
function X(e, t = null, n = null, r = 0, i = null, a = e === K ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && mi(t),
		ref: t && hi(t),
		scopeId: Cn,
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
		ctx: U
	};
	return s ? (Si(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), ci > 0 && !o && q && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && q.push(c), c;
}
var gi = _i;
function _i(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== sr || (e = ii), fi(e)) {
		let r = yi(e, t, !0);
		return n && Si(r, n), ci > 0 && !a && q && (r.shapeFlag & 6 ? q[q.indexOf(e)] = r : q.push(r)), r.patchFlag = -2, r;
	}
	if (Wi(e) && (e = e.__vccOpts), t) {
		t = vi(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = A(e)), v(n) && (/* @__PURE__ */ Bt(n) && !d(n) && (n = s({}, n)), t.style = le(n));
	}
	let o = g(e) ? 1 : ti(e) ? 128 : Fn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return X(e, t, n, r, i, o, a, !0);
}
function vi(e) {
	return e ? /* @__PURE__ */ Bt(e) || Ar(e) ? s({}, e) : e : null;
}
function yi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ci(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && mi(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(hi(t)) : [a, hi(t)] : hi(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== K ? o === -1 ? 16 : o | 16 : o,
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
	return c && r && Xn(u, c.clone(u)), u;
}
function Z(e = " ", t = 0) {
	return gi(ri, null, e, t);
}
function Q(e = "", t = !1) {
	return t ? (J(), di(ii, null, e)) : gi(ii, null, e);
}
function bi(e) {
	return e == null || typeof e == "boolean" ? gi(ii) : d(e) ? gi(K, null, e.slice()) : fi(e) ? xi(e) : gi(ri, null, String(e));
}
function xi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : yi(e);
}
function Si(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Si(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Ar(t) ? t._ctx = U : r === 3 && U && (U.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			Si(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: U
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Z(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ci(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = le([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function wi(e, t, n, r = null) {
	rn(e, t, 7, [n, r]);
}
var Ti = fr(), Ei = 0;
function Di() {
	return Ei;
}
function Oi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Ti, o = {
		uid: Ei++,
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
		scope: new we(!0),
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
		propsOptions: Fr(i, a),
		emitsOptions: vr(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = _r.bind(null, o), e.ce && e.ce(o), o;
}
var ki = null, Ai = () => ki || U, ji, Mi;
{
	let e = ce(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ji = t("__VUE_INSTANCE_SETTERS__", (e) => ki = e), Mi = t("__VUE_SSR_SETTERS__", (e) => Ii = e);
}
var Ni = (e) => {
	let t = ki;
	return ji(e), e.scope.on(), () => {
		e.scope.off(), ji(t);
	};
}, Pi = () => {
	ki && ki.scope.off(), ji(null);
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
		He();
		let n = e.setupContext = r.length > 1 ? Hi(e) : null, i = Ni(e), a = nn(r, e, 0, [e.props, n]), o = y(a);
		if (Ue(), i(), (o || e.sp) && !rr(e) && Qn(e), o) {
			if (a.then(Pi, Pi), t) return a.then((n) => {
				Mi(!0);
				try {
					zi(e, n, t);
				} finally {
					Mi(!1);
				}
			}).catch((t) => {
				an(t, e, 0);
			});
			e.asyncDep = a;
		} else zi(e, a, t);
	} else Bi(e, t);
}
function zi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = qt(t)), Bi(e, n);
}
function Bi(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var Vi = { get(e, t) {
	return P(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(qt(Vt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in lr) return lr[n](e);
		},
		has(e, t) {
			return t in e || t in lr;
		}
	}) : e.proxy;
}
function Wi(e) {
	return h(e) && "__vccOpts" in e;
}
var $ = (e, t) => /* @__PURE__ */ Yt(e, t, Ii), Gi = "3.5.44", Ki = void 0, qi = typeof window < "u" && window.trustedTypes;
if (qi) try {
	Ki = /* @__PURE__ */ qi.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ji = Ki ? (e) => Ki.createHTML(e) : (e) => e, Yi = "http://www.w3.org/2000/svg", Xi = "http://www.w3.org/1998/Math/MathML", Zi = typeof document < "u" ? document : null, Qi = Zi && /* @__PURE__ */ Zi.createElement("template"), $i = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Zi.createElementNS(Yi, e) : t === "mathml" ? Zi.createElementNS(Xi, e) : n ? Zi.createElement(e, { is: n }) : Zi.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Zi.createTextNode(e),
	createComment: (e) => Zi.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Zi.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Qi.innerHTML = Ji(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Qi.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, ea = /* @__PURE__ */ Symbol("_vtc");
function ta(e, t, n) {
	let r = e[ea];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var na = /* @__PURE__ */ Symbol("_vod"), ra = /* @__PURE__ */ Symbol("_vsh"), ia = /* @__PURE__ */ Symbol(""), aa = /(?:^|;)\s*display\s*:/;
function oa(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? ca(r, t, "");
			}
			else for (let e in t) n[e] ?? ca(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ca(r, i, "") : fa(e, i, !g(t) && t ? t[i] : void 0, o) || ca(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ia];
			e && (n += ";" + e), r.cssText = n, a = aa.test(n);
		}
	} else t && e.removeAttribute("style");
	na in e && (i && t === n || (e[na] = a ? r.display : ""), e[ra] && (r.display = "none"));
}
var sa = /\s*!important$/;
function ca(e, t, n) {
	if (d(n)) n.forEach((n) => ca(e, t, n));
	else if (n ??= "", t.startsWith("--")) sa.test(n) ? e.setProperty(t, n.replace(sa, ""), "important") : e.setProperty(t, n);
	else {
		let r = da(e, t);
		sa.test(n) ? e.setProperty(O(r), n.replace(sa, ""), "important") : e[r] = n;
	}
}
var la = [
	"Webkit",
	"Moz",
	"ms"
], ua = {};
function da(e, t) {
	let n = ua[t];
	if (n) return n;
	let r = D(t);
	if (r !== "filter" && r in e) return ua[t] = r;
	r = ne(r);
	for (let n = 0; n < la.length; n++) {
		let i = la[n] + r;
		if (i in e) return ua[t] = i;
	}
	return t;
}
function fa(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var pa = "http://www.w3.org/1999/xlink";
function ma(e, t, n, r, i, a = me(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(pa, t.slice(6, t.length)) : e.setAttributeNS(pa, t, n) : n == null || a && !he(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function ha(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ji(n) : n);
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
		r === "boolean" ? n = he(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function ga(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function _a(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var va = /* @__PURE__ */ Symbol("_vei");
function ya(e, t, n, r, i = null) {
	let a = e[va] || (e[va] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Sa(t);
		r ? ga(e, n, a[t] = Ea(r, i), s) : o && (_a(e, n, o, s), a[t] = void 0);
	}
}
var ba = /(Once|Passive|Capture)$/, xa = /^on:?(?:Once|Passive|Capture)$/;
function Sa(e) {
	let t, n;
	for (; (n = e.match(ba)) && !xa.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : O(e.slice(2)), t];
}
var Ca = 0, wa = /* @__PURE__ */ Promise.resolve(), Ta = () => Ca ||= (wa.then(() => Ca = 0), Date.now());
function Ea(e, t) {
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
				e && rn(e, t, 5, a);
			}
		} else rn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ta(), n;
}
var Da = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Oa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? ta(e, r, c) : t === "style" ? oa(e, n, r) : a(t) ? o(t) || ya(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ka(e, t, r, c)) ? (ha(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || ma(e, t, r, c, s, t !== "value")) : e._isVueCE && (Aa(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ha(e, D(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ma(e, t, r, c));
};
function ka(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Da(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Da(t) && g(n) ? !1 : t in e;
}
function Aa(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = D(t);
	return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
}
var ja = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ie(t, e) : t;
};
function Ma(e) {
	e.target.composing = !0;
}
function Na(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Pa = /* @__PURE__ */ Symbol("_assign"), Fa = /* @__PURE__ */ Symbol("_initialValue");
function Ia(e, t, n) {
	return t && (e = e.trim()), n && (e = oe(e)), e;
}
var La = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Fa] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Fa] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Pa] = ja(i);
		let a = r || i.props && i.props.type === "number";
		ga(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Pa](Ia(e.value, n, a));
		}), (n || a) && ga(e, "change", () => {
			e.value = Ia(e.value, n, a);
		}), t || (ga(e, "compositionstart", Ma), ga(e, "compositionend", Na), ga(e, "change", Na));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Fa];
		delete e[Fa], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Pa](Ia(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Pa] = ja(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? oe(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Ra = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], za = {
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
	exact: (e, t) => Ra.some((n) => e[`${n}Key`] && !t.includes(n))
}, Ba = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = za[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Va = /* @__PURE__ */ s({ patchProp: Oa }, $i), Ha;
function Ua() {
	return Ha ||= Gr(Va);
}
var Wa = ((...e) => {
	let t = Ua().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ka(e);
		if (!r) return;
		let i = t._component;
		h(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ga(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ga(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ka(e) {
	return g(e) ? document.querySelector(e) : e;
}
// services/portal/src/teacher/useItineraries.js
function qa(e, t) {
	let n = /* @__PURE__ */ Ut({
		teacher: !1,
		group: null,
		assignments: [],
		assignment: null
	}), r = /* @__PURE__ */ z([]), i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(""), l = 0, u = 0, d = 0, f = !0, p = $(() => r.value.find((e) => e.is_selected)), m = $(() => !n.value.teacher || !n.value.group || !a.value || s.value);
	function h(e) {
		let t = e.teacher !== n.value.teacher || e.group?.id !== n.value.group?.id;
		n.value = e, t && (l++, u++, d++, r.value = [], i.value = "", a.value = !1, o.value = !1, s.value = !1, c.value = "");
	}
	function g(e) {
		return f && e === l && n.value.teacher && !!n.value.group;
	}
	function _(e) {
		return e.status === 401 && (r.value = [], a.value = !1, t(), c.value = "teacher.errors.loginFirst", !0);
	}
	async function v() {
		if (!n.value.teacher || !n.value.group) return !1;
		let t = l, i = ++u, s = n.value.group.id;
		a.value = !1, o.value = !0, c.value = "";
		try {
			let n = await e(`/api/teacher/itineraries?group_id=${encodeURIComponent(s)}`, { method: "GET" });
			return !g(t) || i !== u ? !1 : (r.value = n.itineraries || [], a.value = !0, !0);
		} catch (e) {
			return g(t) && i === u && !_(e) && (c.value = "teacher.itinerary.loadError"), !1;
		} finally {
			f && t === l && i === u && (o.value = !1);
		}
	}
	async function y(t, n) {
		if (m.value) return;
		let r = l, a = ++d;
		s.value = !0, c.value = "";
		try {
			if (await e(t, {
				method: t === "/api/teacher/itineraries" ? "POST" : "PUT",
				body: JSON.stringify(n)
			}), !g(r) || a !== d) return;
			t === "/api/teacher/itineraries" && (i.value = ""), await v();
		} catch (e) {
			if (!g(r) || a !== d || _(e)) return;
			let t = await v();
			if (!g(r) || a !== d) return;
			c.value = e.status === 409 && t ? "teacher.itinerary.conflict" : "teacher.itinerary.saveError";
		} finally {
			f && r === l && a === d && (s.value = !1);
		}
	}
	function b() {
		if (!i.value.trim()) c.value = "teacher.errors.enterItineraryTitle";
		else return y("/api/teacher/itineraries", {
			title: i.value.trim(),
			group_id: n.value.group?.id
		});
	}
	function x(e, t, n) {
		let r = e.items.map((e) => e.assignment_id), i = [...r], a = i.indexOf(t);
		if (!(a < 0)) {
			if (n === "remove") i.splice(a, 1);
			else {
				let e = a + (n === "up" ? -1 : 1);
				if (e < 0 || e >= i.length) return;
				[i[a], i[e]] = [i[e], i[a]];
			}
			return y(`/api/teacher/itineraries/${encodeURIComponent(e.id)}/items`, {
				assignment_ids: i,
				expected_assignment_ids: r
			});
		}
	}
	function S(e) {
		let t = n.value.assignment?.id;
		if (!t) {
			c.value = "teacher.errors.selectActivityFirst";
			return;
		}
		let r = e.items.map((e) => e.assignment_id);
		if (!r.includes(t)) return y(`/api/teacher/itineraries/${encodeURIComponent(e.id)}/items`, {
			assignment_ids: [...r, t],
			expected_assignment_ids: r
		});
	}
	function C(e) {
		return y(`/api/teacher/groups/${encodeURIComponent(n.value.group?.id)}/itinerary`, {
			itinerary_id: e,
			expected_itinerary_id: p.value?.id || null
		});
	}
	function w(e) {
		return n.value.assignments.find((t) => t.id === e)?.title || e;
	}
	return or(() => {
		f = !1, l++, u++, d++;
	}), {
		context: n,
		itineraries: r,
		title: i,
		ready: a,
		loading: o,
		pending: s,
		feedback: c,
		selected: p,
		unavailable: m,
		setContext: h,
		load: v,
		create: b,
		edit: x,
		add: S,
		select: C,
		assignmentTitle: w
	};
}
// services/portal/src/shared/usePortalTranslations.js
function Ja() {
	let e = /* @__PURE__ */ z(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), or(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
}
// services/portal/src/teacher/ItinerariesPanel.vue
var Ya = ["disabled", "placeholder"], Xa = { class: "actions" }, Za = ["disabled"], Qa = ["disabled"], $a = { class: "hint" }, eo = ["aria-busy"], to = {
	key: 0,
	role: "alert"
}, no = { key: 1 }, ro = {
	key: 2,
	role: "status"
}, io = { key: 3 }, ao = { class: "hint" }, oo = ["disabled"], so = { key: 1 }, co = { class: "cards itinerary-cards" }, lo = {
	key: 0,
	role: "status"
}, uo = [
	"data-select-group-itinerary",
	"aria-label",
	"disabled",
	"onClick"
], fo = { class: "actions" }, po = [
	"data-edit-itinerary",
	"data-itinerary-assignment",
	"data-itinerary-action",
	"aria-label",
	"disabled",
	"onClick"
], mo = [
	"data-add-itinerary-item",
	"disabled",
	"onClick"
], ho = { key: 3 }, go = {
	__name: "ItinerariesPanel",
	props: {
		api: {
			type: Function,
			required: !0
		},
		onSessionExpired: {
			type: Function,
			required: !0
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), { context: i, itineraries: a, title: o, ready: s, loading: c, pending: l, feedback: u, selected: d, unavailable: f, setContext: p, load: m, create: h, edit: g, add: _, select: v, assignmentTitle: y } = qa(n.api, n.onSessionExpired);
		return t({
			setContext: p,
			load: m
		}), (e, t) => (J(), Y(K, null, [
			X("form", {
				class: "grid-fields",
				onSubmit: t[2] ||= Ba((...e) => B(h) && B(h)(...e), ["prevent"])
			}, [X("label", null, [X("span", null, j(B(r)("teacher.itineraryTitleLabel")), 1), En(X("input", {
				id: "itineraryTitle",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ R(o) ? o.value = e : null,
				type: "text",
				disabled: !B(i).teacher || !B(i).group || B(l),
				placeholder: B(r)("teacher.itineraryTitlePlaceholder")
			}, null, 8, Ya), [[La, B(o)]])]), X("div", Xa, [X("button", {
				id: "createItinerary",
				type: "submit",
				disabled: B(f)
			}, j(B(r)("teacher.createItinerary")), 9, Za), X("button", {
				id: "loadItineraries",
				type: "button",
				class: "secondary",
				disabled: !B(i).teacher || !B(i).group || B(l),
				onClick: t[1] ||= (...e) => B(m) && B(m)(...e)
			}, j(B(r)("teacher.loadItineraries")), 9, Qa)])], 32),
			X("p", $a, j(B(r)("teacher.itineraryHint")), 1),
			X("div", {
				id: "itinerariesOutput",
				class: A(["output", { empty: !B(a).length }]),
				"aria-busy": B(c) || B(l)
			}, [
				B(u) ? (J(), Y("p", to, j(B(r)(B(u))), 1)) : Q("", !0),
				!B(i).teacher || !B(i).group ? (J(), Y("p", no, j(B(r)("teacher.itinerariesEmpty")), 1)) : B(c) && !B(a).length ? (J(), Y("p", ro, j(B(r)("teacher.itinerary.loading")), 1)) : B(s) && !B(a).length ? (J(), Y("p", io, j(B(r)("teacher.itinerariesEmptyList")), 1)) : Q("", !0),
				B(a).length ? (J(), Y(K, { key: 4 }, [
					X("p", ao, j(B(r)("teacher.itinerary.selectionHint")), 1),
					B(d) ? (J(), Y("button", {
						key: 0,
						class: "compact secondary",
						type: "button",
						"data-clear-group-itinerary": "",
						disabled: B(f),
						onClick: t[3] ||= (e) => B(v)(null)
					}, j(B(r)("teacher.itinerary.clearSelection")), 9, oo)) : (J(), Y("p", so, j(B(r)("teacher.itinerary.noSelection")), 1)),
					X("div", co, [(J(!0), Y(K, null, W(B(a), (e) => (J(), Y("article", {
						key: e.id,
						class: "card itinerary-card"
					}, [
						X("strong", null, j(e.title), 1),
						e.is_selected ? (J(), Y("small", lo, j(B(r)("teacher.itinerary.selected")), 1)) : (J(), Y("button", {
							key: 1,
							class: "compact secondary",
							type: "button",
							"data-select-group-itinerary": e.id,
							"aria-label": B(r)("teacher.itinerary.selectLabel", { title: e.title }),
							disabled: B(f),
							onClick: (t) => B(v)(e.id)
						}, j(B(r)("teacher.itinerary.select")), 9, uo)),
						X("small", null, j(B(r)("teacher.itinerarySteps", { count: e.items.length })), 1),
						X("ol", null, [(J(!0), Y(K, null, W(e.items, (t, n) => (J(), Y("li", { key: t.assignment_id }, [X("span", null, j(B(y)(t.assignment_id)), 1), X("div", fo, [(J(), Y(K, null, W([
							"up",
							"down",
							"remove"
						], (i) => X("button", {
							key: i,
							class: "compact secondary",
							type: "button",
							"data-edit-itinerary": e.id,
							"data-itinerary-assignment": t.assignment_id,
							"data-itinerary-action": i,
							"aria-label": B(r)(`teacher.itinerary.${i}Label`, { title: B(y)(t.assignment_id) }),
							disabled: B(f) || i === "up" && n === 0 || i === "down" && n === e.items.length - 1,
							onClick: (n) => B(g)(e, t.assignment_id, i)
						}, j(B(r)(`teacher.itinerary.${i}`)), 9, po)), 64))])]))), 128))]),
						X("small", null, j(B(r)("teacher.itinerary.removeHint")), 1),
						B(i).assignment ? (J(), Y("button", {
							key: 2,
							class: "compact secondary",
							type: "button",
							"data-add-itinerary-item": e.id,
							disabled: B(f),
							onClick: (t) => B(_)(e)
						}, j(B(r)("teacher.addSelectedActivity")), 9, mo)) : (J(), Y("small", ho, j(B(r)("teacher.selectAssignmentHint")), 1))
					]))), 128))])
				], 64)) : Q("", !0)
			], 10, eo)
		], 64));
	}
}, _o = ["aria-label", "aria-busy"], vo = {
	key: 0,
	role: "alert"
}, yo = { key: 0 }, bo = { key: 1 }, xo = { key: 2 }, So = { key: 0 }, Co = {
	key: 1,
	class: "hint"
}, wo = [
	"data-select-group",
	"aria-pressed",
	"disabled",
	"onClick"
], To = {
	key: 3,
	class: "hint"
}, Eo = { class: "actions" }, Do = ["disabled"], Oo = {
	__name: "GroupSelector",
	props: {
		api: Function,
		onSelect: Function,
		onDeleted: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), i = /* @__PURE__ */ Ut({
			teacher: !1,
			group: null,
			groups: []
		}), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(""), s = 0, c = !0;
		function l(e) {
			(e.teacher !== i.value.teacher || e.group?.id !== i.value.group?.id) && (s++, a.value = !1, o.value = ""), i.value = e;
		}
		function u(e, t) {
			c && s === t && (e.status === 401 ? (n.onSessionExpired(), o.value = "teacher.errors.loginFirst") : o.value = [403, 404].includes(e.status) ? "teacher.groupAccessUnavailable" : "teacher.groupOperationError");
		}
		async function d(e) {
			if (!i.value.teacher || a.value) return;
			let t = n.onSelect(e), r = s;
			a.value = !0, o.value = "";
			try {
				await t;
			} catch (e) {
				u(e, r);
			} finally {
				c && s === r && (a.value = !1);
			}
		}
		async function f() {
			if (!i.value.teacher || !i.value.group || a.value) return;
			let e = i.value.group;
			if (!confirm(r("teacher.confirmDeleteGroup", { group: e.group_code || e.name }))) return;
			let t = s;
			a.value = !0, o.value = "";
			try {
				await n.api(`/api/teacher/groups/${encodeURIComponent(e.id)}`, { method: "DELETE" }), c && await n.onDeleted(e.id);
			} catch (e) {
				u(e, t);
			} finally {
				c && s === t && (a.value = !1);
			}
		}
		return t({ setContext: l }), or(() => {
			c = !1, s++;
		}), (e, t) => (J(), Y("section", {
			"aria-label": B(r)("teacher.groups"),
			"aria-busy": a.value
		}, [
			X("h3", null, j(B(r)("teacher.groups")), 1),
			o.value ? (J(), Y("p", vo, j(B(r)(o.value)), 1)) : Q("", !0),
			X("div", { class: A(["output", { empty: !i.value.teacher || !i.value.groups.length }]) }, [i.value.teacher ? i.value.groups.length ? (J(), Y("table", xo, [X("thead", null, [X("tr", null, [
				X("th", null, j(B(r)("teacher.groupLabel")), 1),
				X("th", null, j(B(r)("teacher.tenant")), 1),
				X("th", null, j(B(r)("teacher.active")), 1),
				X("th", null, j(B(r)("common.select")), 1)
			])]), X("tbody", null, [(J(!0), Y(K, null, W(i.value.groups, (e) => (J(), Y("tr", { key: e.id }, [
				X("td", null, [
					e.label ? (J(), Y("strong", So, j(e.label), 1)) : Q("", !0),
					e.label ? (J(), Y("span", Co, " · ")) : Q("", !0),
					Z(j(e.name), 1)
				]),
				X("td", null, j(e.tenant_id), 1),
				X("td", null, j(e.active ?? 0), 1),
				X("td", null, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-select-group": e.id,
					"aria-pressed": i.value.group?.id === e.id,
					disabled: a.value,
					onClick: (t) => d(e.id)
				}, j(B(r)("common.select")), 9, wo)])
			]))), 128))])])) : (J(), Y("p", bo, j(B(r)("common.tableEmpty")), 1)) : (J(), Y("p", yo, j(B(r)("teacher.errors.loginFirst")), 1)), i.value.teacher && i.value.groupsTotal > i.value.groups.length ? (J(), Y("p", To, j(B(r)("teacher.groupsLimit", {
				shown: i.value.groups.length,
				total: i.value.groupsTotal
			})), 1)) : Q("", !0)], 2),
			X("div", Eo, [X("button", {
				id: "deleteGroup",
				type: "button",
				class: "danger",
				disabled: !i.value.teacher || !i.value.group || a.value,
				onClick: f
			}, j(B(r)("teacher.deleteGroup")), 9, Do)])
		], 8, _o));
	}
}, ko = { class: "hint" }, Ao = ["placeholder", "disabled"], jo = { class: "actions" }, Mo = ["disabled"], No = ["disabled"], Po = ["aria-busy"], Fo = {
	key: 0,
	role: "alert"
}, Io = {
	key: 1,
	role: "status"
}, Lo = { key: 2 }, Ro = { key: 3 }, zo = { key: 4 }, Bo = { key: 5 }, Vo = {
	key: 0,
	class: "actions"
}, Ho = [
	"data-make-owner",
	"disabled",
	"onClick"
], Uo = [
	"data-remove-member",
	"disabled",
	"onClick"
], Wo = {
	__name: "GroupMembersPanel",
	props: {
		api: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), i = /* @__PURE__ */ Ut({
			teacher: !1,
			group: null
		}), a = /* @__PURE__ */ z([]), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(""), f = $(() => !i.value.teacher || !i.value.group || s.value), p = 0, m = !0;
		function h(e) {
			(e.teacher !== i.value.teacher || e.group?.id !== i.value.group?.id) && (p++, a.value = [], o.value = "", s.value = !1, c.value = !1, l.value = !1, u.value = "", d.value = ""), i.value = e;
		}
		function g(e) {
			return m && p === e && i.value.teacher && i.value.group;
		}
		function _(e, t) {
			g(t) && (a.value = [], c.value = !1, l.value = !0, e.status === 401 ? (n.onSessionExpired(), u.value = "teacher.errors.loginFirst") : u.value = [403, 404].includes(e.status) ? "teacher.groupAccessUnavailable" : e.status === 409 ? "teacher.ownerChanged" : e.status === 422 ? "teacher.invalidMemberId" : "teacher.membersOperationError");
		}
		async function v(e, t) {
			let r = await n.api(`/api/teacher/groups/${encodeURIComponent(e)}/members`, { method: "GET" });
			if (g(t)) {
				if (r.group_id !== e) throw Error("wrong_group");
				a.value = r.members || [], c.value = !0, l.value = !1;
			}
		}
		async function y(e) {
			if (f.value) return;
			let t = p, n = i.value.group.id;
			s.value = !0, u.value = "", d.value = "";
			try {
				await e(n, t);
			} catch (e) {
				_(e, t);
			} finally {
				m && p === t && (s.value = !1);
			}
		}
		function b() {
			return y(v);
		}
		function x() {
			if (l.value) return;
			let e = o.value.trim();
			if (!/^(?:oidc:)?[A-Za-z0-9:_-]{3,128}$/.test(e) || e.length > 128) u.value = "teacher.invalidMemberId";
			else return y(async (t, r) => {
				await n.api(`/api/teacher/groups/${encodeURIComponent(t)}/members`, {
					method: "POST",
					body: JSON.stringify({
						teacher_id: e,
						role: "teacher"
					})
				}), g(r) && (o.value = "", await v(t, r));
			});
		}
		function S(e) {
			if (!l.value && e.role !== "owner" && confirm(r("teacher.confirmRemoveMember", { id: e.teacher_id }))) return y(async (t, r) => {
				await n.api(`/api/teacher/groups/${encodeURIComponent(t)}/members/${encodeURIComponent(e.teacher_id)}`, { method: "DELETE" }), g(r) && await v(t, r);
			});
		}
		function C(e) {
			if (l.value || e.role === "owner" || !confirm(r("teacher.confirmMakeOwner", { id: e.teacher_id }))) return;
			let t = a.value.find((e) => e.role === "owner")?.teacher_id || "";
			return y(async (i, o) => {
				let s = await n.api(`/api/teacher/groups/${encodeURIComponent(i)}/owner`, {
					method: "PUT",
					body: JSON.stringify({
						teacher_id: e.teacher_id,
						expected_owner_id: t
					})
				});
				if (g(o)) {
					if (s.group_id !== i) throw Error("wrong_group");
					a.value = s.members || [], c.value = !0, d.value = r("teacher.ownerTransferred", { id: s.owner_id });
				}
			});
		}
		return t({
			setContext: h,
			load: b
		}), or(() => {
			m = !1, p++;
		}), (e, t) => (J(), Y(K, null, [
			X("p", ko, j(B(r)("teacher.membersHint")), 1),
			X("form", {
				class: "grid-fields",
				onSubmit: Ba(x, ["prevent"])
			}, [X("label", null, [X("span", null, j(B(r)("teacher.memberIdLabel")), 1), En(X("input", {
				id: "memberTeacherId",
				"onUpdate:modelValue": t[0] ||= (e) => o.value = e,
				type: "text",
				maxlength: "128",
				placeholder: B(r)("teacher.memberIdPlaceholder"),
				autocomplete: "off",
				disabled: f.value || l.value
			}, null, 8, Ao), [[La, o.value]])]), X("div", jo, [X("button", {
				id: "addGroupMember",
				type: "submit",
				class: "secondary",
				disabled: f.value || l.value
			}, j(B(r)("teacher.addMember")), 9, Mo), X("button", {
				id: "loadGroupMembers",
				type: "button",
				class: "secondary",
				disabled: f.value,
				onClick: b
			}, j(B(r)("teacher.loadMembers")), 9, No)])], 32),
			X("div", {
				id: "membersOutput",
				class: A(["output", { empty: !c.value }]),
				"aria-busy": s.value
			}, [
				u.value ? (J(), Y("p", Fo, j(B(r)(u.value)), 1)) : Q("", !0),
				d.value ? (J(), Y("p", Io, j(d.value), 1)) : Q("", !0),
				!i.value.teacher || !i.value.group ? (J(), Y("p", Lo, j(B(r)("teacher.membersEmpty")), 1)) : !c.value && !u.value ? (J(), Y("p", Ro, j(B(r)("teacher.membersPrompt")), 1)) : c.value && !a.value.length ? (J(), Y("p", zo, j(B(r)("common.tableEmpty")), 1)) : Q("", !0),
				a.value.length ? (J(), Y("table", Bo, [X("thead", null, [X("tr", null, [
					X("th", null, j(B(r)("teacher.memberIdLabel")), 1),
					X("th", null, j(B(r)("common.status")), 1),
					X("th", null, j(B(r)("common.date")), 1),
					X("th", null, j(B(r)("teacher.memberActions")), 1)
				])]), X("tbody", null, [(J(!0), Y(K, null, W(a.value, (e) => (J(), Y("tr", { key: e.teacher_id }, [
					X("td", null, j(e.teacher_id), 1),
					X("td", null, j(B(r)(e.role === "owner" ? "teacher.roleOwner" : "teacher.roleTeacher")), 1),
					X("td", null, j(e.created_at), 1),
					X("td", null, [e.role === "owner" ? Q("", !0) : (J(), Y("div", Vo, [X("button", {
						type: "button",
						class: "compact secondary",
						"data-make-owner": e.teacher_id,
						disabled: f.value || l.value,
						onClick: (t) => C(e)
					}, j(B(r)("teacher.makeOwner")), 9, Ho), X("button", {
						type: "button",
						class: "compact danger",
						"data-remove-member": e.teacher_id,
						disabled: f.value || l.value,
						onClick: (t) => S(e)
					}, j(B(r)("teacher.removeMember")), 9, Uo)]))])
				]))), 128))])])) : Q("", !0)
			], 10, Po)
		], 64));
	}
};
// services/portal/src/teacher/useCredentials.js
function Go({ api: e, onCreated: t, onRefresh: n, onSessionExpired: r }) {
	let i = /* @__PURE__ */ Ut({
		teacher: !1,
		group: null,
		identities: [],
		groups: []
	}), a = /* @__PURE__ */ z("centre"), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(6), c = /* @__PURE__ */ z(6), l = /* @__PURE__ */ z([]), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z(!1), f = /* @__PURE__ */ z(""), p = $(() => i.value.teacher ? i.value.identities.filter((e) => !i.value.group || e.group_id === i.value.group.id) : []), m = $(() => !i.value.teacher || u.value || d.value), h = 0, g = !0;
	function _() {
		l.value = [], f.value = "";
	}
	function v(e) {
		if (e.teacher !== i.value.teacher || e.group?.id !== i.value.group?.id) h++, _(), u.value = !1, d.value = !1;
		else if (e.identities !== i.value.identities) {
			d.value = !1;
			let t = new Set(e.identities.filter((e) => e.active !== 0 && e.active !== !1).map((e) => e.id));
			l.value = l.value.filter((e) => t.has(e.id));
		}
		i.value = e;
	}
	function y(e) {
		e.status === 401 ? (r(), f.value = "teacher.errors.loginFirst") : (d.value = !0, [403, 404].includes(e.status) ? (_(), f.value = "teacher.groupAccessUnavailable") : f.value = "teacher.credentialsOperationError");
	}
	async function b(e) {
		try {
			await n();
		} catch (t) {
			if (!e.current()) return;
			[
				401,
				403,
				404
			].includes(t.status) ? y(t) : (d.value = !0, f.value = "teacher.credentialsRefreshError");
		}
	}
	async function x(e) {
		if (m.value) return;
		let t = {
			version: h,
			current() {
				return g && this.version === h && i.value.teacher;
			},
			adopt() {
				this.version = h, u.value = !0;
			}
		};
		u.value = !0, f.value = "";
		try {
			await e(t);
		} catch (e) {
			t.current() && y(e);
		} finally {
			g && t.version === h && (u.value = !1);
		}
	}
	function S(e) {
		if (!e.group?.id || !Array.isArray(e.identities) || e.identities.length > 120 || e.identities.some((e) => !e.id || typeof e.public_code != "string" || !/^\d{4}(\d{2})?$/.test(e.pin))) throw Error("invalid_batch");
		return e.identities.map(({ id: e, public_code: t, pin: n }) => ({
			id: e,
			public_code: t,
			pin: n
		}));
	}
	function C() {
		if (!Number.isInteger(s.value) || s.value < 1 || s.value > 30) f.value = "teacher.credentialsCountError";
		else return x(async (n) => {
			let r = await e("/api/identities/batch", {
				method: "POST",
				body: JSON.stringify({
					tenant_id: a.value.trim() || "centre",
					label: o.value.trim(),
					count: s.value,
					pin_length: 4
				})
			});
			if (!n.current()) return;
			let i = S(r);
			t({
				group: r.group,
				count: i.length
			}), n.adopt(), l.value = i, f.value = "teacher.groupCreated", await b(n);
		});
	}
	function w() {
		if (!i.value.group) return;
		if (!Number.isInteger(c.value) || c.value < 1 || c.value > 120) {
			f.value = "teacher.credentialsCountError";
			return;
		}
		let t = i.value.group.id;
		return x(async (n) => {
			let r = await e(`/api/teacher/groups/${encodeURIComponent(t)}/identities`, {
				method: "POST",
				body: JSON.stringify({
					count: c.value,
					pin_length: 4
				})
			});
			if (!n.current()) return;
			let i = S(r);
			if (r.group.id !== t) throw Error("wrong_group");
			l.value = i, f.value = "teacher.credentialsAdded", await b(n);
		});
	}
	function ee(t) {
		return x(async (n) => {
			l.value = l.value.filter((e) => e.id !== t.id);
			let r = await e(`/api/identities/${encodeURIComponent(t.id)}/regenerate-pin`, { method: "POST" });
			if (n.current()) {
				if (r.id !== t.id || !/^\d{4}(\d{2})?$/.test(r.pin)) throw Error("invalid_pin");
				l.value = [...l.value, {
					id: t.id,
					public_code: t.public_code,
					pin: r.pin
				}], f.value = "teacher.pinRegenerated", await b(n);
			}
		});
	}
	function T(t, n) {
		if (n) return x(async (n) => {
			l.value = l.value.filter((e) => e.id !== t.id), await e(`/api/identities/${encodeURIComponent(t.id)}/revoke`, { method: "POST" }), n.current() && (f.value = "teacher.credentialsRevoked", await b(n));
		});
	}
	function E() {
		h++, _(), u.value = !1;
	}
	return window.addEventListener("pagehide", E), or(() => {
		g = !1, E(), window.removeEventListener("pagehide", E);
	}), {
		context: i,
		tenant: a,
		label: o,
		count: s,
		additionalCount: c,
		fresh: l,
		pending: u,
		blocked: d,
		feedback: f,
		identities: p,
		unavailable: m,
		setContext: v,
		create: C,
		add: w,
		regenerate: ee,
		revoke: T
	};
}
// services/portal/src/teacher/credentialExports.js
function Ko(e, t) {
	let n = (e) => {
		let t = String(e);
		return /^[=+@-]/.test(t) && (t = "'" + t), "\"" + t.replaceAll("\"", "\"\"") + "\"";
	}, r = [["codi", "pin"], ...e.map((e) => [e.public_code, e.pin])], i = URL.createObjectURL(new Blob([r.map((e) => e.map(n).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" })), a = document.createElement("a");
	a.href = i, a.download = `edutictac-${String(t || "grup").replace(/[^\p{L}\p{N}_-]/gu, "-").slice(0, 80)}.csv`, document.body.append(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 1e3);
}
function qo(e, t, n) {
	let r = window.open("", "_blank");
	if (!r) return !1;
	r.opener = null;
	let i = r.document;
	i.documentElement.lang = document.documentElement.lang, i.title = `EduTicTac ${t || ""}`;
	let a = i.createElement("meta");
	a.httpEquiv = "Content-Security-Policy", a.content = "default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'", i.head.append(a);
	let o = i.createElement("style");
	o.textContent = "body{font:16px Arial,sans-serif;margin:16px;color:#111}main{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}article{border:1px dashed #555;padding:10px;break-inside:avoid}h2{font-size:18px;margin:0 0 8px}p{margin:6px 0 2px}strong,em{display:block;font-size:26px;font-style:normal}small{display:block;margin-top:10px}@media print{body{margin:8mm}}", i.head.append(o);
	let s = i.createElement("main");
	for (let t of e) {
		let e = i.createElement("article");
		for (let [r, a] of [
			["h2", "EduTicTac"],
			["p", n("common.code")],
			["strong", t.public_code],
			["p", "PIN"],
			["em", t.pin],
			["small", n("common.useAsStudent")]
		]) {
			let t = i.createElement(r);
			t.textContent = a, e.append(t);
		}
		s.append(e);
	}
	return i.body.append(s), r.focus(), r.requestAnimationFrame(() => {
		r.closed || r.print();
	}), !0;
}
// services/portal/src/teacher/CredentialsPanel.vue
var Jo = ["disabled"], Yo = ["placeholder", "disabled"], Xo = ["disabled"], Zo = { class: "actions" }, Qo = ["disabled"], $o = ["role"], es = { key: 0 }, ts = { key: 1 }, ns = ["aria-label"], rs = { class: "pin-notice" }, is = ["aria-label"], as = ["disabled"], os = ["disabled"], ss = { class: "cards" }, cs = ["aria-busy"], ls = { key: 0 }, us = { key: 1 }, ds = { key: 2 }, fs = { class: "inline-actions" }, ps = [
	"data-regenerate-pin",
	"disabled",
	"onClick"
], ms = [
	"data-revoke-identity",
	"disabled",
	"onClick"
], hs = { class: "subsection-heading" }, gs = { class: "eyebrow" }, _s = ["disabled"], vs = { class: "actions" }, ys = ["disabled"], bs = {
	__name: "CredentialsPanel",
	props: {
		api: Function,
		onCreated: Function,
		onRefresh: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), i = /* @__PURE__ */ z(null), a = () => {
			i.value && (i.value.hidden = !0);
		};
		window.addEventListener("pagehide", a), or(() => window.removeEventListener("pagehide", a));
		let { context: o, tenant: s, label: c, count: l, additionalCount: u, fresh: d, pending: f, feedback: p, identities: m, unavailable: h, setContext: g, create: _, add: v, regenerate: y, revoke: b } = Go(n);
		function x() {
			qo(d.value, o.value.group?.group_code, r) || (p.value = "teacher.credentialsPopupBlocked");
		}
		function S(e) {
			b(e, confirm(r("teacher.confirmRevoke", { label: e.public_code })));
		}
		function C(e) {
			let t = o.value.groups.find((t) => t.id === e);
			return t?.label || t?.name || e;
		}
		return t({ setContext: g }), (e, t) => (J(), Y(K, null, [X("form", {
			class: "grid-fields",
			onSubmit: t[3] ||= Ba((...e) => B(_) && B(_)(...e), ["prevent"])
		}, [
			X("label", null, [X("span", null, j(B(r)("teacher.tenantLabel")), 1), En(X("input", {
				id: "tenantId",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ R(s) ? s.value = e : null,
				type: "text",
				maxlength: "200",
				disabled: B(h)
			}, null, 8, Jo), [[La, B(s)]])]),
			X("label", null, [X("span", null, j(B(r)("teacher.groupLabel")), 1), En(X("input", {
				id: "groupLabel",
				"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ R(c) ? c.value = e : null,
				type: "text",
				maxlength: "80",
				placeholder: B(r)("teacher.groupLabelPlaceholder"),
				disabled: B(h)
			}, null, 8, Yo), [[La, B(c)]])]),
			X("label", null, [X("span", null, j(B(r)("common.students")), 1), En(X("input", {
				id: "identityCount",
				"onUpdate:modelValue": t[2] ||= (e) => /* @__PURE__ */ R(l) ? l.value = e : null,
				type: "number",
				min: "1",
				max: "30",
				required: "",
				disabled: B(h)
			}, null, 8, Xo), [[
				La,
				B(l),
				void 0,
				{ number: !0 }
			]])]),
			X("div", Zo, [X("button", {
				id: "createBatch",
				type: "submit",
				disabled: B(h)
			}, j(B(r)("teacher.generateCredentials")), 9, Qo)])
		], 32), (J(), di(Wn, { to: "#credentialsDetails" }, [
			B(p) ? (J(), Y("p", {
				key: 0,
				role: B(p).includes("Error") || B(p).includes("Unavailable") || B(p).includes("loginFirst") || B(p).includes("Blocked") ? "alert" : "status"
			}, [Z(j(B(r)(B(p))) + " ", 1), B(p) === "teacher.groupCreated" ? (J(), Y("strong", es, j(B(o).group?.label || B(o).group?.group_code), 1)) : B(p) === "teacher.pinRegenerated" ? (J(), Y("strong", ts, j(B(d).at(-1)?.public_code), 1)) : Q("", !0)], 8, $o)) : Q("", !0),
			B(o).teacher && B(d).length ? (J(), Y("section", {
				key: 1,
				id: "freshCredentials",
				ref_key: "freshPanel",
				ref: i,
				"aria-label": B(r)("teacher.generateCredentials")
			}, [
				X("p", rs, j(B(r)("teacher.credentialsFreshHint")), 1),
				X("div", {
					class: "export-actions",
					"aria-label": B(r)("teacher.exports")
				}, [X("button", {
					type: "button",
					class: "secondary",
					"data-print-batch": "",
					disabled: B(f),
					onClick: x
				}, j(B(r)("teacher.printBatch")), 9, as), X("button", {
					type: "button",
					class: "secondary",
					"data-download-batch-csv": "",
					disabled: B(f),
					onClick: t[4] ||= (e) => B(Ko)(B(d), B(o).group?.group_code)
				}, j(B(r)("teacher.downloadBatchCsv")), 9, os)], 8, is),
				X("div", ss, [(J(!0), Y(K, null, W(B(d), (e) => (J(), Y("article", {
					key: e.id,
					class: "credential"
				}, [X("strong", null, j(e.public_code), 1), X("span", null, "PIN " + j(e.pin), 1)]))), 128))])
			], 8, ns)) : Q("", !0),
			X("section", {
				id: "credentialsOutput",
				class: A(["output", { empty: !B(o).teacher || !B(m).length }]),
				"aria-busy": B(f)
			}, [X("h3", null, j(B(o).group ? B(r)("teacher.activeCredentials") : B(r)("teacher.recentCredentials")), 1), B(o).teacher ? B(m).length ? (J(), Y("table", ds, [X("thead", null, [X("tr", null, [
				X("th", null, j(B(r)("common.code")), 1),
				X("th", null, j(B(r)("common.group")), 1),
				X("th", null, j(B(r)("teacher.pinUpdated")), 1),
				X("th", null, j(B(r)("teacher.credentialActions")), 1)
			])]), X("tbody", null, [(J(!0), Y(K, null, W(B(m), (e) => (J(), Y("tr", { key: e.id }, [
				X("td", null, j(e.public_code), 1),
				X("td", null, j(C(e.group_id)), 1),
				X("td", null, j(e.pin_rotated_at || ""), 1),
				X("td", null, [X("div", fs, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-regenerate-pin": e.id,
					disabled: B(h),
					onClick: (t) => B(y)(e)
				}, j(B(r)("teacher.regeneratePin")), 9, ps), X("button", {
					type: "button",
					class: "compact danger",
					"data-revoke-identity": e.id,
					disabled: B(h),
					onClick: (t) => S(e)
				}, j(B(r)("teacher.revoke")), 9, ms)])])
			]))), 128))])])) : (J(), Y("p", us, j(B(r)("common.tableEmpty")), 1)) : (J(), Y("p", ls, j(B(r)("teacher.errors.loginFirst")), 1))], 10, cs),
			X("div", hs, [X("span", gs, j(B(r)("teacher.groupTools")), 1)]),
			X("form", {
				class: "grid-fields",
				onSubmit: t[6] ||= Ba((...e) => B(v) && B(v)(...e), ["prevent"])
			}, [X("label", null, [X("span", null, j(B(r)("teacher.addStudentsCount")), 1), En(X("input", {
				id: "additionalIdentityCount",
				"onUpdate:modelValue": t[5] ||= (e) => /* @__PURE__ */ R(u) ? u.value = e : null,
				type: "number",
				min: "1",
				max: "120",
				required: "",
				disabled: B(h) || !B(o).group
			}, null, 8, _s), [[
				La,
				B(u),
				void 0,
				{ number: !0 }
			]])]), X("div", vs, [X("button", {
				id: "addGroupIdentities",
				type: "submit",
				class: "secondary",
				disabled: B(h) || !B(o).group
			}, j(B(r)("teacher.addStudents")), 9, ys)])], 32)
		]))], 64));
	}
}, xs = ["aria-busy"], Ss = {
	key: 0,
	role: "alert"
}, Cs = { key: 1 }, ws = { key: 0 }, Ts = { class: "teacher-context" }, Es = { key: 0 }, Ds = { key: 0 }, Os = ["aria-label"], ks = ["href"], As = ["href"], js = ["href"], Ms = { key: 0 }, Ns = { key: 2 }, Ps = { key: 3 }, Fs = [
	"data-select-assignment",
	"aria-pressed",
	"disabled",
	"onClick"
], Is = {
	__name: "AssignmentsPanel",
	props: {
		onSelect: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), i = /* @__PURE__ */ Ut({
			teacher: !1,
			group: null,
			groups: [],
			assignments: [],
			assignment: null,
			summary: null,
			dataReady: !1
		}), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(""), s = 0, c = !0;
		function l(e) {
			e.teacher !== i.value.teacher || e.group?.id !== i.value.group?.id || e.assignment?.id !== i.value.assignment?.id ? (s++, a.value = !1, o.value = "") : e.dataReady && (o.value = ""), i.value = e;
		}
		function u(e) {
			e.status === 401 ? (n.onSessionExpired(), o.value = "teacher.errors.loginFirst") : o.value = [403, 404].includes(e.status) ? "teacher.assignmentAccessUnavailable" : "teacher.assignmentsLoadError";
		}
		async function d(e) {
			if (!i.value.teacher || !i.value.dataReady || a.value) return;
			let t = n.onSelect(e), r = s;
			a.value = !0;
			try {
				await t;
			} catch (e) {
				c && r === s && u(e);
			} finally {
				c && r === s && (a.value = !1);
			}
		}
		return t({
			setContext: l,
			report: u
		}), or(() => {
			c = !1, s++;
		}), (e, t) => (J(), Y("section", {
			id: "teacherOutput",
			class: A(["output", { empty: !i.value.teacher }]),
			"aria-busy": a.value || i.value.teacher && !i.value.dataReady
		}, [o.value ? (J(), Y("p", Ss, j(B(r)(o.value)), 1)) : Q("", !0), i.value.teacher ? (J(), Y(K, { key: 2 }, [
			i.value.summary ? (J(), Y("p", ws, [X("strong", null, j(i.value.summary.active || 0), 1), Z(" " + j(B(r)("teacher.activeOfTotal", { total: i.value.summary.total || 0 })), 1)])) : Q("", !0),
			X("div", Ts, [
				X("p", null, [Z(j(B(r)(i.value.group ? "teacher.groupSelected" : "teacher.noGroupSelected")) + " ", 1), i.value.group ? (J(), Y("strong", Es, j(i.value.group.label || i.value.group.group_code || i.value.group.name), 1)) : Q("", !0)]),
				X("p", null, [Z(j(B(r)(i.value.assignment ? "teacher.activitySelected" : "teacher.noActivitySelected")) + " ", 1), i.value.assignment && i.value.dataReady ? (J(), Y("strong", Ds, j(i.value.assignments.find((e) => e.id === i.value.assignment.id)?.title || ""), 1)) : Q("", !0)]),
				X("div", {
					class: "export-actions",
					"aria-label": B(r)("teacher.exports")
				}, [i.value.group ? (J(), Y(K, { key: 0 }, [X("a", {
					class: "button-link",
					href: `/api/groups/${encodeURIComponent(i.value.group.id)}/cards`,
					target: "_blank",
					rel: "noopener"
				}, j(B(r)("teacher.cards")), 9, ks), X("a", {
					class: "button-link secondary",
					href: `/api/groups/${encodeURIComponent(i.value.group.id)}/csv`,
					target: "_blank",
					rel: "noopener"
				}, j(B(r)("teacher.csvCodes")), 9, As)], 64)) : Q("", !0), X("a", {
					class: "button-link secondary",
					href: "/api/teacher/stats.csv" + (i.value.group ? "?group_id=" + encodeURIComponent(i.value.group.id) : ""),
					target: "_blank",
					rel: "noopener"
				}, j(B(r)("teacher.csvStats")), 9, js)], 8, Os)
			]),
			X("h3", null, j(B(r)("teacher.assignments")), 1),
			i.value.dataReady ? i.value.assignments.length ? (J(), Y("table", Ps, [X("thead", null, [X("tr", null, [
				X("th", null, j(B(r)("common.title")), 1),
				X("th", null, j(B(r)("common.group")), 1),
				X("th", null, j(B(r)("common.activity")), 1),
				X("th", null, j(B(r)("common.select")), 1)
			])]), X("tbody", null, [(J(!0), Y(K, null, W(i.value.assignments, (e) => (J(), Y("tr", { key: e.id }, [
				X("td", null, j(e.title), 1),
				X("td", null, j(i.value.groups.find((t) => t.id === e.group_id)?.label || i.value.groups.find((t) => t.id === e.group_id)?.name || e.group_id), 1),
				X("td", null, j(e.activity_id), 1),
				X("td", null, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-select-assignment": e.id,
					"aria-pressed": i.value.assignment?.id === e.id,
					disabled: a.value,
					onClick: (t) => d(e.id)
				}, j(B(r)("common.select")), 9, Fs)])
			]))), 128))])])) : (J(), Y("p", Ns, j(B(r)("common.tableEmpty")), 1)) : (J(), Y(K, { key: 1 }, [o.value ? Q("", !0) : (J(), Y("p", Ms, j(B(r)("teacher.assignmentsLoading")), 1))], 64))
		], 64)) : (J(), Y("p", Cs, j(B(r)("teacher.errors.loginFirst")), 1))], 10, xs));
	}
};
// services/portal/src/teacher/useResults.js
function Ls(e, t) {
	let n = /* @__PURE__ */ Ut({
		teacher: !1,
		group: null,
		assignment: null,
		assignments: [],
		dataReady: !1
	}), r = $(() => n.value.assignments.find((e) => e.id === n.value.assignment?.id)), i = /* @__PURE__ */ z([]), a = /* @__PURE__ */ z("results"), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z(""), u = 0, d = 0, f = !0, p = $(() => !n.value.teacher || !r.value || !n.value.dataReady || c.value);
	function m() {
		u++, d++, i.value = [], o.value = !1, s.value = !1, c.value = !1, l.value = "";
	}
	function h(e) {
		let t = e.teacher !== n.value.teacher || e.group?.id !== n.value.group?.id || e.assignment?.id !== n.value.assignment?.id;
		n.value = e, (t || e.dataReady && !r.value) && m();
	}
	function g(e) {
		return f && u === e && n.value.teacher && r.value;
	}
	function _(e, n = !1) {
		i.value = [], o.value = !1, e.status === 401 ? (t(), l.value = "teacher.errors.loginFirst") : l.value = [403, 404].includes(e.status) ? "teacher.assignmentAccessUnavailable" : n ? "teacher.resultsSaveError" : "teacher.resultsLoadError";
	}
	async function v(t = "results") {
		if (!n.value.teacher || !r.value || !n.value.dataReady) return;
		let c = r.value, p = u, m = ++d;
		a.value = t, s.value = !0, o.value = !1, i.value = [], l.value = "";
		try {
			let n = await e(t === "ranking" ? "/api/rankings?" + new URLSearchParams({
				app_id: c.app_id,
				activity_id: c.activity_id,
				limit: "20"
			}) : `/api/teacher/activity-assignments/${encodeURIComponent(c.id)}/results`, { method: "GET" });
			if (!g(p) || m !== d) return;
			if (t === "results" && n.assignment?.id !== c.id) throw Error("wrong_assignment");
			let r = t === "ranking" ? n : n.results;
			if (!Array.isArray(r)) throw Error("invalid_results");
			i.value = r, o.value = !0;
		} catch (e) {
			g(p) && m === d && _(e);
		} finally {
			f && u === p && m === d && (s.value = !1);
		}
	}
	async function y(t) {
		if (p.value || s.value || !o.value || a.value !== "results") return;
		let n = r.value, i = u;
		c.value = !0, l.value = "";
		try {
			await e(`/api/teacher/activity-assignments/${encodeURIComponent(n.id)}/students/${encodeURIComponent(t.identity_id)}/complete`, { method: t.completed ? "DELETE" : "POST" }), g(i) && await v("results");
		} catch (e) {
			g(i) && _(e, !0);
		} finally {
			f && u === i && (c.value = !1);
		}
	}
	return or(() => {
		f = !1, m();
	}), {
		context: n,
		assignment: r,
		rows: i,
		mode: a,
		ready: o,
		loading: s,
		pending: c,
		feedback: l,
		unavailable: p,
		setContext: h,
		load: v,
		complete: y
	};
}
// services/portal/src/teacher/ResultsPanel.vue
var Rs = { class: "actions" }, zs = ["disabled"], Bs = ["disabled"], Vs = ["aria-busy"], Hs = {
	key: 0,
	role: "alert"
}, Us = { key: 1 }, Ws = {
	key: 2,
	role: "status"
}, Gs = { key: 3 }, Ks = {
	key: 0,
	class: "hint"
}, qs = { key: 1 }, Js = { key: 2 }, Ys = [
	"data-mark-completed",
	"data-unmark-completed",
	"disabled",
	"onClick"
], Xs = { key: 3 }, Zs = {
	__name: "ResultsPanel",
	props: {
		api: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), { context: i, assignment: a, rows: o, mode: s, ready: c, loading: l, pending: u, feedback: d, unavailable: f, setContext: p, load: m, complete: h } = Ls(n.api, n.onSessionExpired);
		return t({ setContext: p }), (e, t) => (J(), Y(K, null, [X("div", Rs, [X("button", {
			id: "loadResults",
			type: "button",
			disabled: B(f),
			onClick: t[0] ||= (e) => B(m)("results")
		}, j(B(r)("teacher.viewResults")), 9, zs), X("button", {
			id: "loadRanking",
			type: "button",
			class: "secondary",
			disabled: B(f),
			onClick: t[1] ||= (e) => B(m)("ranking")
		}, j(B(r)("teacher.viewRanking")), 9, Bs)]), X("div", {
			id: "resultsOutput",
			class: A(["output", { empty: !B(c) }]),
			"aria-busy": B(l) || B(u)
		}, [
			B(d) ? (J(), Y("p", Hs, j(B(r)(B(d))), 1)) : Q("", !0),
			B(i).teacher && B(a) && B(i).dataReady ? (J(), Y("p", Us, [X("strong", null, j(B(a).title || B(a).activity_id), 1)])) : Q("", !0),
			B(l) ? (J(), Y("p", Ws, j(B(r)("teacher.resultsLoading")), 1)) : !B(c) && !B(d) ? (J(), Y("p", Gs, j(B(r)("teacher.resultsPlaceholder")), 1)) : Q("", !0),
			B(i).teacher && B(a) && B(i).dataReady && B(c) ? (J(), Y(K, { key: 4 }, [B(s) === "ranking" ? (J(), Y("p", Ks, j(B(r)("teacher.activityRanking")), 1)) : Q("", !0), B(o).length ? B(s) === "results" ? (J(), Y("table", Js, [X("thead", null, [X("tr", null, [
				X("th", null, j(B(r)("common.code")), 1),
				X("th", null, j(B(r)("common.attempts")), 1),
				X("th", null, j(B(r)("common.bestScore")), 1),
				X("th", null, j(B(r)("common.lastScoreAt")), 1),
				X("th", null, j(B(r)("common.status")), 1),
				X("th", null, j(B(r)("teacher.markCompleted")), 1)
			])]), X("tbody", null, [(J(!0), Y(K, null, W(B(o), (e) => (J(), Y("tr", { key: e.identity_id }, [
				X("td", null, j(e.public_code), 1),
				X("td", null, j(e.attempts), 1),
				X("td", null, j(e.best_score ?? ""), 1),
				X("td", null, j(e.last_score_at || ""), 1),
				X("td", null, j(B(r)(e.completed ? "student.done" : "student.pending")), 1),
				X("td", null, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-mark-completed": e.completed ? void 0 : B(a).id + ":" + e.identity_id,
					"data-unmark-completed": e.completed ? B(a).id + ":" + e.identity_id : void 0,
					disabled: B(f) || B(l),
					onClick: (t) => B(h)(e)
				}, j(B(r)(e.completed ? "teacher.unmarkCompleted" : "teacher.markCompleted")), 9, Ys)])
			]))), 128))])])) : (J(), Y("table", Xs, [X("thead", null, [X("tr", null, [
				X("th", null, j(B(r)("common.code")), 1),
				X("th", null, j(B(r)("common.score")), 1),
				X("th", null, j(B(r)("common.date")), 1)
			])]), X("tbody", null, [(J(!0), Y(K, null, W(B(o), (e, t) => (J(), Y("tr", { key: t }, [
				X("td", null, j(e.public_code), 1),
				X("td", null, j(e.score), 1),
				X("td", null, j(e.ts), 1)
			]))), 128))])])) : (J(), Y("p", qs, j(B(r)("common.tableEmpty")), 1))], 64)) : Q("", !0)
		], 10, Vs)], 64));
	}
};
// services/portal/src/teacher/resourceAssignment.js
function Qs(e, t, n = window.location) {
	if (typeof e.external_id != "string" || !e.external_id) throw Error("invalid_resource");
	let r = e.play_url || e.source_url || e.reuse_url || e.download_url || "", i = "";
	if (r) {
		let e = new URL(r, n.origin);
		if (!["http:", "https:"].includes(e.protocol) || e.username || e.password) throw Error("invalid_resource_url");
		let t = (e) => [
			"localhost",
			"127.0.0.1",
			"[::1]",
			"::1"
		].includes(e);
		t(e.hostname) && !t(n.hostname) && (e.hostname = n.hostname, e.port === "8086" && n.port === "18082" && (e.port = "18086")), i = e.toString();
	}
	let a = ["edutictac-play", "eduhoot"].includes(e.provider) ? e.provider : "resource";
	return {
		group_id: t,
		app_id: a,
		activity_id: a === "edutictac-play" && e.external_id.startsWith("edutictac-play:") ? e.external_id.slice(15) : e.external_id,
		title: e.title || e.external_id,
		launch_url: i
	};
}
// services/portal/src/teacher/useResources.js
function $s(e, t, n) {
	let r = /* @__PURE__ */ Ut({
		teacher: !1,
		group: null,
		dataReady: !1,
		resourcesEnabled: !0,
		favoritesEnabled: !0
	}), i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z([]), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z(""), f = /* @__PURE__ */ z(0), p = 0, m = 0, h = !0, g = $(() => !r.value.teacher || !r.value.group || !r.value.dataReady || !r.value.resourcesEnabled || c.value || l.value || u.value);
	function _(e) {
		return h && e === p;
	}
	function v(e) {
		(e.teacher !== r.value.teacher || e.group?.id !== r.value.group?.id || e.resourcesEnabled !== r.value.resourcesEnabled || e.favoritesEnabled !== r.value.favoritesEnabled) && (p++, m++, a.value = [], o.value = !1, s.value = !1, c.value = !1, u.value = !1, d.value = "", f.value = 0), r.value = e;
	}
	async function y(t = !1) {
		if (!r.value.resourcesEnabled || l.value || t && (!r.value.teacher || r.value.favoritesEnabled === !1)) return;
		let n = p, h = ++m;
		a.value = [], o.value = !1, s.value = t, c.value = !0, d.value = "", u.value = !1, f.value = 0;
		try {
			let r = new URLSearchParams({ limit: "24" });
			i.value.trim() && r.set("q", i.value.trim());
			let s = await e(t ? "/resources-api/teacher/favorites?limit=48" : "/resources-api/resources?" + r, { method: "GET" });
			if (!_(n) || h !== m) return;
			if (!Array.isArray(s.items)) throw Error("invalid_resources");
			a.value = s.items, o.value = !0;
		} catch {
			_(n) && h === m && (d.value = t ? "teacher.favoritesUnavailable" : "teacher.resourcesUnavailable");
		} finally {
			_(n) && h === m && (c.value = !1);
		}
	}
	async function b(i) {
		if (g.value) return;
		let o = p, c = r.value.group.id, m = r.value.assignment?.id, v = i ? [i] : [...a.value];
		if (!v.length || !i && !s.value) return;
		let y;
		try {
			y = v.map((e) => Qs(e, c));
		} catch {
			d.value = "teacher.invalidResource";
			return;
		}
		l.value = !0, d.value = "", f.value = 0;
		let b = null, x = null;
		try {
			for (let t = 0; t < v.length && _(o); t++) {
				let n = await e("/api/teacher/activity-assignments", {
					method: "POST",
					body: JSON.stringify(y[t])
				});
				if (!_(o)) break;
				if (!n.assignment?.id || n.assignment.group_id !== c) throw Error("invalid_assignment");
				b = n.assignment, f.value++, s.value && (a.value = a.value.filter((e) => e !== v[t]));
			}
		} catch (e) {
			x = e, _(o) && (u.value = !0, e.status === 401 ? (t(), d.value = "teacher.errors.loginFirst") : d.value = "teacher.resourceAssignmentError");
		}
		try {
			_(o) && b && (await n({
				groupId: c,
				assignment: b,
				selectedId: m
			}), _(o) && !x && (d.value = "teacher.basketAssigned"));
		} catch (e) {
			_(o) && (u.value = !0, e.status === 401 && t(), d.value = "teacher.resourceRefreshError");
		} finally {
			h && (l.value = !1);
		}
	}
	return or(() => {
		h = !1, p++, m++, a.value = [];
	}), {
		context: r,
		search: i,
		rows: a,
		loaded: o,
		basket: s,
		loading: c,
		pending: l,
		blocked: u,
		feedback: d,
		completedCount: f,
		unavailable: g,
		setContext: v,
		load: y,
		assign: b
	};
}
// services/portal/src/teacher/ResourcesPanel.vue
var ec = ["placeholder"], tc = { class: "actions" }, nc = ["disabled"], rc = ["disabled"], ic = ["disabled"], ac = { key: 0 }, oc = ["aria-busy"], sc = {
	key: 0,
	role: "status"
}, cc = {
	key: 1,
	role: "status"
}, lc = {
	key: 2,
	role: "status"
}, uc = { key: 3 }, dc = {
	key: 4,
	class: "hint"
}, fc = {
	key: 5,
	class: "cards"
}, pc = [
	"data-assign-resource",
	"disabled",
	"onClick"
], mc = {
	__name: "ResourcesPanel",
	props: {
		api: Function,
		onSessionExpired: Function,
		onAssigned: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), { context: i, search: a, rows: o, loaded: s, basket: c, loading: l, pending: u, feedback: d, completedCount: f, unavailable: p, setContext: m, load: h, assign: g } = $s(n.api, n.onSessionExpired, n.onAssigned);
		return t({ setContext: m }), (e, t) => (J(), Y(K, null, [
			X("form", {
				class: "grid-fields",
				onSubmit: t[3] ||= Ba((e) => B(h)(!1), ["prevent"])
			}, [X("label", null, [X("span", null, j(B(r)("teacher.resourcesSearch")), 1), En(X("input", {
				id: "resourceSearch",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ R(a) ? a.value = e : null,
				type: "search",
				placeholder: B(r)("teacher.resourcesPlaceholder")
			}, null, 8, ec), [[La, B(a)]])]), X("div", tc, [
				X("button", {
					id: "searchResources",
					type: "submit",
					class: "secondary",
					disabled: B(u) || !B(i).resourcesEnabled
				}, j(B(r)("teacher.resourcesButton")), 9, nc),
				B(i).favoritesEnabled === !1 ? Q("", !0) : (J(), Y("button", {
					key: 0,
					id: "loadFavoriteResources",
					type: "button",
					class: "secondary",
					disabled: B(u) || !B(i).teacher || !B(i).resourcesEnabled,
					onClick: t[1] ||= (e) => B(h)(!0)
				}, j(B(r)("teacher.favoritesButton")), 9, rc)),
				B(i).favoritesEnabled === !1 ? Q("", !0) : (J(), Y("button", {
					key: 1,
					id: "assignFavoriteResources",
					type: "button",
					disabled: B(p) || !B(c) || !B(o).length,
					onClick: t[2] ||= (e) => B(g)()
				}, j(B(r)("teacher.assignBasket")), 9, ic))
			])], 32),
			B(i).teacher && B(i).group ? (J(), Y("p", ac, [Z(j(B(r)("teacher.groupSelected")) + " ", 1), X("strong", null, j(B(i).group.label || B(i).group.group_code || B(i).group.name), 1)])) : Q("", !0),
			X("div", {
				id: "resourcesOutput",
				class: A(["output", { empty: !B(o).length }]),
				"aria-busy": B(l) || B(u)
			}, [
				B(d) ? (J(), Y("p", sc, j(B(r)(B(d), { count: B(f) })), 1)) : Q("", !0),
				B(u) ? (J(), Y("p", cc, j(B(r)("teacher.assigningBasket")), 1)) : B(l) ? (J(), Y("p", lc, j(B(r)("teacher.resourcesLoading")), 1)) : !B(o).length && !B(d) ? (J(), Y("p", uc, j(B(r)(B(s) ? "teacher.resourcesEmpty" : "teacher.resourcesHint")), 1)) : Q("", !0),
				B(c) && B(o).length ? (J(), Y("p", dc, j(B(r)("teacher.basketHint", { count: B(o).length })), 1)) : Q("", !0),
				B(o).length ? (J(), Y("div", fc, [(J(!0), Y(K, null, W(B(o), (e, t) => (J(), Y("article", {
					key: t,
					class: "card"
				}, [
					X("strong", null, j(e.title || e.external_id), 1),
					X("small", null, j(e.provider || e.format || "resource") + " · " + j(e.subject || ""), 1),
					X("button", {
						class: "compact secondary",
						type: "button",
						"data-assign-resource": e.external_id,
						disabled: B(p),
						onClick: (t) => B(g)(e)
					}, j(B(r)("teacher.assignResource")), 9, pc)
				]))), 128))])) : Q("", !0)
			], 10, oc)
		], 64));
	}
}, hc = {
	key: 0,
	id: "adminGroups",
	class: "panel teacher-collapsible"
}, gc = { class: "panel-summary" }, _c = { class: "eyebrow" }, vc = ["aria-busy"], yc = { class: "hint" }, bc = {
	key: 0,
	role: "alert"
}, xc = { key: 0 }, Sc = { key: 1 }, Cc = { key: 0 }, wc = { key: 1 }, Tc = [
	"data-admin-group",
	"aria-pressed",
	"disabled",
	"onClick"
], Ec = ["aria-label"], Dc = { class: "actions" }, Oc = ["disabled"], kc = {
	__name: "AdminGroupsPanel",
	props: {
		api: Function,
		onDeleted: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), i = /* @__PURE__ */ z(!1), a = /* @__PURE__ */ z([]), o = /* @__PURE__ */ Ut(null), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(null), u = !1, d = 0, f = !0;
		function p(e) {
			!!e.teacher !== u && (u = !!e.teacher, d++, i.value = !1, a.value = [], o.value = null, c.value = "", u && m());
		}
		async function m() {
			let e = d;
			s.value = !0;
			try {
				let t = await n.api("/api/admin/groups", { method: "GET" });
				if (!f || e !== d) return;
				a.value = t.groups || [], i.value = !0, c.value = "", o.value && !a.value.some((e) => e.id === o.value.id) && (o.value = null);
			} catch (t) {
				if (!f || e !== d) return;
				[401, 403].includes(t.status) ? (i.value = !1, a.value = []) : i.value && (c.value = "admin.loadError");
			} finally {
				f && e === d && (s.value = !1);
			}
		}
		async function h(e) {
			o.value = e, c.value = "", await fn(), l.value?.setContext({
				teacher: !0,
				group: {
					id: e.id,
					group_code: e.group_code
				}
			}), l.value?.load();
		}
		async function g() {
			let e = o.value;
			if (!e || s.value || !confirm(r("teacher.confirmDeleteGroup", { group: e.group_code }))) return;
			let t = d;
			s.value = !0, c.value = "";
			try {
				if (await n.api(`/api/teacher/groups/${encodeURIComponent(e.id)}`, { method: "DELETE" }), !f || t !== d) return;
				o.value = null, await n.onDeleted?.(e.id);
			} catch (e) {
				if (!f || t !== d) return;
				e.status === 401 && n.onSessionExpired(), c.value = "teacher.groupOperationError";
			} finally {
				f && t === d && (s.value = !1, await m());
			}
		}
		return t({ setContext: p }), or(() => {
			f = !1, d++;
		}), (t, n) => i.value ? (J(), Y("details", hc, [X("summary", gc, [X("span", _c, j(B(r)("admin.groupsEyebrow")), 1), X("strong", null, j(B(r)("admin.groupsTitle")), 1)]), X("div", {
			class: "panel-content",
			"aria-busy": s.value
		}, [
			X("p", yc, j(B(r)("admin.groupsHint")), 1),
			c.value ? (J(), Y("p", bc, j(B(r)(c.value)), 1)) : Q("", !0),
			X("div", { class: A(["output", { empty: !a.value.length }]) }, [a.value.length ? (J(), Y("table", Sc, [X("thead", null, [X("tr", null, [
				X("th", null, j(B(r)("teacher.groupOpaque")), 1),
				X("th", null, j(B(r)("admin.owner")), 1),
				X("th", null, j(B(r)("admin.collaborators")), 1),
				X("th", null, j(B(r)("common.date")), 1),
				X("th", null, j(B(r)("admin.manage")), 1)
			])]), X("tbody", null, [(J(!0), Y(K, null, W(a.value, (e) => (J(), Y("tr", { key: e.id }, [
				X("td", null, [
					e.label ? (J(), Y("strong", Cc, j(e.label), 1)) : Q("", !0),
					e.label ? (J(), Y("span", wc, " · ")) : Q("", !0),
					Z(j(e.group_code), 1)
				]),
				X("td", null, j(e.owner_id || B(r)("admin.noOwner")), 1),
				X("td", null, j(e.collaborators), 1),
				X("td", null, j((e.created_at || "").slice(0, 10)), 1),
				X("td", null, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-admin-group": e.id,
					"aria-pressed": o.value?.id === e.id,
					disabled: s.value,
					onClick: (t) => h(e)
				}, j(B(r)("admin.manage")), 9, Tc)])
			]))), 128))])])) : (J(), Y("p", xc, j(B(r)("common.tableEmpty")), 1))], 2),
			o.value ? (J(), Y("section", {
				key: 1,
				"aria-label": B(r)("admin.selectedGroup", { group: o.value.group_code })
			}, [
				X("h3", null, j(B(r)("admin.selectedGroup", { group: o.value.group_code })), 1),
				gi(Wo, {
					ref_key: "members",
					ref: l,
					api: e.api,
					"on-session-expired": e.onSessionExpired
				}, null, 8, ["api", "on-session-expired"]),
				X("div", Dc, [X("button", {
					id: "adminDeleteGroup",
					type: "button",
					class: "danger",
					disabled: s.value,
					onClick: g
				}, j(B(r)("teacher.deleteGroup")), 9, Oc)])
			], 8, Ec)) : Q("", !0)
		], 8, vc)])) : Q("", !0);
	}
}, Ac = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.odg,.txt,.md,.csv,.png,.jpg,.jpeg,.webp,.gif,.mp3,.ogg,.wav,.m4a,.mp4,.webm,.epub,.zip", jc = /* @__PURE__ */ new Set([
	"file_too_large",
	"files_quota_exceeded",
	"files_count_limit",
	"files_disk_full",
	"student_upload_disabled",
	"file_type_not_allowed",
	"file_content_not_allowed",
	"invalid_path",
	"file_not_found",
	"files_busy",
	"upload_rate_limit"
]);
function Mc(e, t, n) {
	let r = /* @__PURE__ */ Ut({
		enabled: !1,
		groupId: "",
		identityId: ""
	}), i = /* @__PURE__ */ z([]), a = /* @__PURE__ */ z(null), o = /* @__PURE__ */ z(null), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z("shared"), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z(!1), f = /* @__PURE__ */ z(""), p = /* @__PURE__ */ z(0), m = /* @__PURE__ */ z(0), h = /* @__PURE__ */ z(""), g = 0, _ = 0, v = !0, y = /* @__PURE__ */ new Set(), b = $(() => r.value.identityId ? "/api/student/group-files" : `/api/teacher/groups/${encodeURIComponent(r.value.groupId)}/files`), x = $(() => i.value.filter((e) => e.scope === (c.value === "shared" ? "shared" : "submission") && e.relative_path.toLocaleLowerCase().includes(h.value.toLocaleLowerCase()))), S = $(() => !r.value.enabled || !r.value.groupId || d.value || u.value);
	function C(e) {
		return v && e === g && r.value.enabled && !!r.value.groupId;
	}
	function w() {
		g++, _++;
		for (let e of y) e.abort();
		y.clear(), i.value = [], a.value = null, o.value = null, l.value = !1, u.value = !1, d.value = !1, f.value = "", p.value = 0, m.value = 0, h.value = "";
	}
	function ee(e) {
		let t = e.enabled !== r.value.enabled || e.groupId !== r.value.groupId || e.identityId !== r.value.identityId;
		r.value = e, t && (w(), c.value = "shared", s.value && e.enabled && e.groupId && D());
	}
	async function T(t, n = {}) {
		let r = new AbortController();
		y.add(r);
		try {
			return await e(t, {
				...n,
				signal: r.signal
			});
		} finally {
			y.delete(r);
		}
	}
	function E(e) {
		i.value = [], l.value = !1, e.status === 401 ? (f.value = "files.sessionExpired", n?.()) : f.value = "files.error." + (jc.has(e.message) ? e.message : "operation");
	}
	async function D(e = !0) {
		if (!r.value.enabled || !r.value.groupId) return;
		let t = g, n = ++_;
		u.value = !0, l.value = !1, e && (f.value = "");
		try {
			let e = await T(b.value, { method: "GET" });
			if (!C(t) || n !== _) return;
			if (!Array.isArray(e.files) || !e.settings || !e.usage) throw Error("invalid_files");
			i.value = e.files, a.value = e.settings, o.value = e.usage, l.value = !0;
		} catch (e) {
			C(t) && n === _ && E(e);
		} finally {
			C(t) && n === _ && (u.value = !1);
		}
	}
	function te(e) {
		s.value = e.target.open, s.value && !l.value && !u.value && !d.value && D();
	}
	async function O(e) {
		if (S.value || !l.value) return;
		let n = Array.from(e || []);
		if (!n.length) return;
		if (n.length > 1e3) {
			f.value = "files.error.files_count_limit";
			return;
		}
		let o = g, s = b.value;
		d.value = !0, f.value = "", p.value = 0, m.value = n.length;
		try {
			for (let e of n) {
				if (!C(o)) return;
				if (e.size > a.value.max_file_bytes) throw Error("file_too_large");
				let n = e.webkitRelativePath || e.relativePath || e.name, c = i.value.some((e) => e.relative_path === n && e.scope === (r.value.identityId ? "submission" : "shared"));
				if (c && !window.confirm(t("files.replace", { name: n }))) continue;
				let l = () => ({
					method: "POST",
					body: e,
					headers: {
						"Content-Type": "application/octet-stream",
						"X-File-Path": encodeURIComponent(n),
						...c ? { "X-File-Replace": "1" } : {}
					}
				});
				try {
					await T(s, l());
				} catch (e) {
					if (e.status !== 409 || e.message !== "file_exists" || !C(o)) throw e;
					if (!window.confirm(t("files.replace", { name: n }))) continue;
					c = !0, await T(s, l());
				}
				if (!C(o)) return;
				p.value++;
			}
			C(o) && (f.value = "files.saved");
		} catch (e) {
			C(o) && E(e);
		} finally {
			C(o) && (d.value = !1, await D(!1));
		}
	}
	async function ne(e) {
		if (S.value || !l.value || !window.confirm(t("files.confirmDelete", { name: e.relative_path }))) return;
		let n = g;
		d.value = !0, f.value = "", p.value = 0, m.value = 0;
		try {
			await T(b.value + "/" + encodeURIComponent(e.id), { method: "DELETE" }), C(n) && (f.value = "files.deleted");
		} catch (e) {
			C(n) && E(e);
		} finally {
			C(n) && (d.value = !1, await D(!1));
		}
	}
	async function re(e) {
		if (S.value || !l.value) return;
		let t = [];
		async function n(e, r = "") {
			if (t.length >= 1e3) throw Error("files_count_limit");
			if (e.isFile) {
				let n = await new Promise((t, n) => e.file(t, n));
				n.relativePath = r + n.name, t.push(n);
			} else if (e.isDirectory) {
				let t = e.createReader(), i;
				do {
					i = await new Promise((e, n) => t.readEntries(e, n));
					for (let t of i) await n(t, r + e.name + "/");
				} while (i.length);
			}
		}
		let r = g;
		try {
			let i = Array.from(e.dataTransfer?.items || []).map((e) => e.webkitGetAsEntry?.());
			if (i.length && i.every(Boolean)) for (let e of i) await n(e);
			else t.push(...Array.from(e.dataTransfer?.files || []));
			C(r) && await O(t);
		} catch (e) {
			C(r) && E(e);
		}
	}
	function k() {
		w();
	}
	function ie(e) {
		e.persisted && s.value && D();
	}
	return window.addEventListener("pagehide", k), window.addEventListener("pageshow", ie), or(() => {
		v = !1, w(), window.removeEventListener("pagehide", k), window.removeEventListener("pageshow", ie);
	}), {
		context: r,
		rows: i,
		settings: a,
		usage: o,
		open: s,
		tab: c,
		ready: l,
		loading: u,
		pending: d,
		feedback: f,
		done: p,
		total: m,
		search: h,
		visible: x,
		disabled: S,
		base: b,
		setContext: ee,
		load: D,
		toggle: te,
		upload: O,
		remove: ne,
		drop: re
	};
}
// services/portal/src/files/ClassroomFilesBrowser.vue
var Nc = { key: 0 }, Pc = { class: "actions" }, Fc = ["aria-pressed"], Ic = ["aria-pressed"], Lc = ["disabled"], Rc = {
	key: 0,
	class: "hint"
}, zc = {
	key: 1,
	role: "status"
}, Bc = {
	key: 2,
	role: "status",
	"data-files-feedback": ""
}, Vc = { key: 3 }, Hc = [
	"value",
	"max",
	"aria-label"
], Uc = { class: "hint" }, Wc = { key: 0 }, Gc = { class: "actions" }, Kc = ["aria-disabled"], qc = ["accept", "disabled"], Jc = ["aria-disabled"], Yc = ["disabled"], Xc = { role: "status" }, Zc = [
	"value",
	"max",
	"aria-label"
], Qc = { key: 3 }, $c = { class: "file-list" }, el = ["data-classroom-file"], tl = { key: 0 }, nl = { class: "actions" }, rl = ["href", "aria-disabled"], il = ["disabled", "onClick"], al = {
	__name: "ClassroomFilesBrowser",
	props: {
		api: Function,
		onSessionExpired: Function,
		enabled: Boolean,
		groupId: String,
		identityId: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = Ja(), { settings: r, usage: i, tab: a, ready: o, loading: s, pending: c, feedback: l, done: u, total: d, search: f, visible: p, disabled: m, base: h, setContext: g, load: _, toggle: v, upload: y, remove: b, drop: x } = Mc(t.api, n, t.onSessionExpired);
		jn(() => [
			t.enabled,
			t.groupId,
			t.identityId
		], () => g({
			enabled: t.enabled,
			groupId: t.groupId,
			identityId: t.identityId
		}), { immediate: !0 });
		let S = $(() => !!t.identityId), C = $(() => o.value && !m.value && (S.value ? a.value === "submission" && r.value?.students_can_upload : a.value === "shared")), w = $(() => S.value ? i.value?.student_bytes : i.value?.group_bytes), ee = $(() => S.value ? r.value?.student_quota_bytes : r.value?.group_quota_bytes), T = (e) => ((e || 0) / 1048576).toLocaleString(void 0, { maximumFractionDigits: 2 });
		function E(e) {
			let t = Array.from(e.target.files || []);
			e.target.value = "", y(t);
		}
		return (t, i) => (J(), Y("details", {
			class: "classroom-files",
			"data-classroom-files": "",
			onToggle: i[6] ||= (...e) => B(v) && B(v)(...e)
		}, [
			X("summary", null, [X("strong", null, j(B(n)("files.title")), 1)]),
			X("p", null, j(B(n)(S.value ? "files.studentHint" : "files.teacherHint")), 1),
			!e.enabled || !e.groupId ? (J(), Y("p", Nc, j(B(n)("files.selectGroup")), 1)) : (J(), Y(K, { key: 1 }, [
				X("div", Pc, [
					X("button", {
						type: "button",
						"data-files-tab": "shared",
						"aria-pressed": B(a) === "shared",
						onClick: i[0] ||= (e) => a.value = "shared"
					}, j(B(n)("files.shared")), 9, Fc),
					X("button", {
						type: "button",
						"data-files-tab": "submission",
						"aria-pressed": B(a) === "submission",
						onClick: i[1] ||= (e) => a.value = "submission"
					}, j(B(n)(S.value ? "files.mine" : "files.submissions")), 9, Ic),
					X("button", {
						type: "button",
						class: "secondary",
						"data-files-refresh": "",
						disabled: B(m),
						onClick: i[2] ||= (e) => B(_)()
					}, j(B(n)("files.refresh")), 9, Lc)
				]),
				S.value && B(a) === "submission" ? (J(), Y("p", Rc, j(B(n)("files.privateHint")), 1)) : Q("", !0),
				B(s) ? (J(), Y("p", zc, j(B(n)("files.loading")), 1)) : Q("", !0),
				B(l) ? (J(), Y("p", Bc, j(B(n)(B(l), { count: B(u) })), 1)) : Q("", !0),
				B(u) && B(l) && B(l) !== "files.saved" ? (J(), Y("p", Vc, j(B(n)("files.partial", { count: B(u) })), 1)) : Q("", !0),
				B(o) ? (J(), Y(K, { key: 4 }, [
					X("p", null, j(B(n)("files.quota", {
						used: T(w.value),
						limit: T(ee.value)
					})), 1),
					X("progress", {
						value: w.value || 0,
						max: ee.value || 1,
						"aria-label": B(n)("files.space")
					}, null, 8, Hc),
					X("p", Uc, j(B(n)("files.limit", { limit: T(B(r).max_file_bytes) })), 1),
					S.value && !B(r).students_can_upload ? (J(), Y("p", Wc, j(B(n)("files.uploadDisabled")), 1)) : Q("", !0),
					C.value || B(c) ? (J(), Y("div", {
						key: 1,
						class: "files-upload",
						onDragover: i[3] ||= Ba(() => {}, ["prevent"]),
						onDrop: i[4] ||= Ba((e) => C.value && B(x)(e), ["prevent"])
					}, [X("p", null, j(B(n)("files.drop")), 1), X("div", Gc, [X("label", {
						class: "button-link",
						"aria-disabled": !C.value
					}, [Z(j(B(n)("files.choose")), 1), X("input", {
						"data-files-input": "",
						type: "file",
						multiple: "",
						accept: B(Ac),
						disabled: !C.value,
						onChange: E
					}, null, 40, qc)], 8, Kc), X("label", {
						class: "button-link secondary",
						"aria-disabled": !C.value
					}, [Z(j(B(n)("files.chooseFolder")), 1), X("input", {
						"data-files-folder": "",
						type: "file",
						multiple: "",
						webkitdirectory: "",
						disabled: !C.value,
						onChange: E
					}, null, 40, Yc)], 8, Jc)])], 32)) : Q("", !0),
					B(c) ? (J(), Y(K, { key: 2 }, [X("p", Xc, j(B(n)("files.progress", {
						done: B(u),
						total: B(d)
					})), 1), X("progress", {
						value: B(u),
						max: B(d) || 1,
						"aria-label": B(n)("files.progress", {
							done: B(u),
							total: B(d)
						})
					}, null, 8, Zc)], 64)) : Q("", !0),
					X("label", null, [Z(j(B(n)("files.search")), 1), En(X("input", {
						"onUpdate:modelValue": i[5] ||= (e) => /* @__PURE__ */ R(f) ? f.value = e : null,
						type: "search",
						"data-files-search": ""
					}, null, 512), [[La, B(f)]])]),
					!B(p).length && !B(s) ? (J(), Y("p", Qc, j(B(n)("files.empty")), 1)) : Q("", !0),
					X("ul", $c, [(J(!0), Y(K, null, W(B(p), (e) => (J(), Y("li", {
						key: e.id,
						"data-classroom-file": e.id
					}, [X("div", null, [X("strong", null, j(e.relative_path), 1), X("small", null, [Z(j(T(e.size)) + " MiB", 1), !S.value && e.public_code ? (J(), Y("span", tl, " · " + j(e.public_code), 1)) : Q("", !0)])]), X("div", nl, [X("a", {
						href: B(m) ? void 0 : B(h) + "/" + encodeURIComponent(e.id) + "/download",
						class: "button-link secondary",
						"aria-disabled": B(m),
						"data-file-download": ""
					}, j(B(n)("files.download")), 9, rl), !S.value || e.scope === "submission" ? (J(), Y("button", {
						key: 0,
						type: "button",
						class: "secondary",
						disabled: B(m),
						"data-file-delete": "",
						onClick: (t) => B(b)(e)
					}, j(B(n)("files.delete")), 9, il)) : Q("", !0)])], 8, el))), 128))])
				], 64)) : Q("", !0)
			], 64))
		], 32));
	}
}, ol = {
	__name: "ClassroomFilesPanel",
	props: {
		api: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = /* @__PURE__ */ Ut({
			teacher: !1,
			group: null
		});
		function r(e) {
			n.value = e;
		}
		return t({ setContext: r }), (t, r) => (J(), di(al, {
			api: e.api,
			"on-session-expired": e.onSessionExpired,
			enabled: n.value.teacher,
			"group-id": n.value.group?.id || ""
		}, null, 8, [
			"api",
			"on-session-expired",
			"enabled",
			"group-id"
		]));
	}
};
// services/portal/src/teacher/main.js
function sl(e, t) {
	return Wa(go, t).mount(e);
}
function cl(e, t) {
	return Wa(Oo, t).mount(e);
}
function ll(e, t) {
	return Wa(Wo, t).mount(e);
}
function ul(e, t) {
	return Wa(bs, t).mount(e);
}
function dl(e, t) {
	return Wa(Is, t).mount(e);
}
function fl(e, t) {
	return Wa(Zs, t).mount(e);
}
function pl(e, t) {
	return Wa(mc, t).mount(e);
}
function ml(e, t) {
	return Wa(kc, t).mount(e);
}
function hl(e, t) {
	return Wa(ol, t).mount(e);
}
export { ml as mountAdminGroups, dl as mountAssignments, hl as mountClassroomFiles, ul as mountCredentials, cl as mountGroups, sl as mountItineraries, ll as mountMembers, pl as mountResources, fl as mountResults };
