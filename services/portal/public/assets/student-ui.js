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
}, ee = /-\w/g, D = E((e) => e.replace(ee, (e) => e.slice(1).toUpperCase())), te = /\B([A-Z])/g, O = E((e) => e.replace(te, "-$1").toLowerCase()), ne = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), re = E((e) => e ? `on${ne(e)}` : ""), k = (e, t) => !Object.is(e, t), ie = (e, ...t) => {
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
		this.flags |= 2, Ue(this), Pe(this);
		let e = N, t = P;
		N = this, P = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), N = e, P = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Re(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
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
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === We) || (e.globalVersion = We, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ie(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = N, r = P;
	N = e, P = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || k(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		N = n, P = r, Fe(e), e.flags &= -3;
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
var P = !0, Be = [];
function Ve() {
	Be.push(P), P = !1;
}
function He() {
	let e = Be.pop();
	P = e === void 0 || e;
}
function Ue(e) {
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
var We = 0, Ge = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ke = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!N || !P || N === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== N) t = this.activeLink = new Ge(N, this), N.deps ? (t.prevDep = N.depsTail, N.depsTail.nextDep = t, N.depsTail = t) : N.deps = N.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = N.depsTail, t.nextDep = void 0, N.depsTail.nextDep = t, N.depsTail = t, N.deps === t && (N.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, We++, this.notify(e);
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
function F(e, t, n) {
	if (P && N) {
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
	if (Me(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ze || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ze)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ye)), f(e) && s(o.get(Xe)));
				break;
			case "delete":
				i || (s(o.get(Ye)), f(e) && s(o.get(Xe)));
				break;
			case "set": f(e) && s(o.get(Ye));
		}
	}
	Ne();
}
function $e(e) {
	let t = /* @__PURE__ */ R(e);
	return t === e || (F(t, "iterate", Ze), /* @__PURE__ */ L(e)) ? t : /* @__PURE__ */ Lt(e) ? /* @__PURE__ */ It(e) ? t.map((e) => Bt(z(e))) : t.map(Bt) : t.map(z);
}
function et(e) {
	return F(e = /* @__PURE__ */ R(e), "iterate", Ze), e;
}
function I(e, t) {
	return /* @__PURE__ */ Lt(e) ? Bt(/* @__PURE__ */ It(e) ? z(t) : t) : z(t);
}
var tt = {
	__proto__: null,
	[Symbol.iterator]() {
		return nt(this, Symbol.iterator, (e) => I(this, e));
	},
	concat(...e) {
		return $e(this).concat(...e.map((e) => d(e) ? $e(e) : e));
	},
	entries() {
		return nt(this, "entries", (e) => (e[1] = I(this, e[1]), e));
	},
	every(e, t) {
		return at(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return at(this, "filter", e, t, (e) => e.map((e) => I(this, e)), arguments);
	},
	find(e, t) {
		return at(this, "find", e, t, (e) => I(this, e), arguments);
	},
	findIndex(e, t) {
		return at(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return at(this, "findLast", e, t, (e) => I(this, e), arguments);
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
		return $e(this).join(e);
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
		return $e(this).toReversed();
	},
	toSorted(e) {
		return $e(this).toSorted(e);
	},
	toSpliced(...e) {
		return $e(this).toSpliced(...e);
	},
	unshift(...e) {
		return ct(this, "unshift", e);
	},
	values() {
		return nt(this, "values", (e) => I(this, e));
	}
};
function nt(e, t, n) {
	let r = et(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ L(e)) {
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
	let o = et(e), s = o !== e && !/* @__PURE__ */ L(e), c = o[t];
	if (c !== it[t]) {
		let t = c.apply(e, a);
		return s ? z(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, I(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ot(e, t, n, r) {
	let i = et(e), a = i !== e && !/* @__PURE__ */ L(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = I(e, t)), n.call(this, t, I(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? I(e, c) : c;
}
function st(e, t, n) {
	let r = /* @__PURE__ */ R(e);
	F(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Rt(n[0]) ? (n[0] = /* @__PURE__ */ R(n[0]), r[t](...n)) : i;
}
function ct(e, t, n = []) {
	Ve(), Me();
	let r = (/* @__PURE__ */ R(e))[t].apply(e, n);
	return Ne(), He(), r;
}
var lt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ut = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function dt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ R(this);
	return F(t, "has", e), t.hasOwnProperty(e);
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
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = tt[t])) return e;
			if (t === "hasOwnProperty") return dt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ B(e) ? e : n);
		if ((_(t) ? ut.has(t) : lt(t)) || (r || F(e, "get", t), i)) return o;
		if (/* @__PURE__ */ B(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Pt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Pt(o) : /* @__PURE__ */ Mt(o) : o;
	}
}, pt = class extends ft {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Lt(i);
			if (!/* @__PURE__ */ L(n) && !/* @__PURE__ */ Lt(n) && (i = /* @__PURE__ */ R(i), n = /* @__PURE__ */ R(n)), !a && /* @__PURE__ */ B(i) && !/* @__PURE__ */ B(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ B(e) ? e : r);
		return e === /* @__PURE__ */ R(r) && s && (o ? k(n, i) && Qe(e, "set", t, n, i) : Qe(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Qe(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && ut.has(t) || F(e, "has", t), n;
	}
	ownKeys(e) {
		return F(e, "iterate", d(e) ? "length" : Ye), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ R(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? vt : t ? Bt : z;
		return !t && F(a, "iterate", l ? Xe : Ye), s(Object.create(u), { next() {
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
function xt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function St(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ R(r), a = /* @__PURE__ */ R(n);
			e || (k(n, a) && F(i, "get", n), F(i, "get", a));
			let { has: o } = yt(i), s = t ? vt : e ? Bt : z;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && F(/* @__PURE__ */ R(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ R(n), i = /* @__PURE__ */ R(t);
			return e || (k(t, i) && F(r, "has", t), F(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ R(a), s = t ? vt : e ? Bt : z;
			return !e && F(o, "iterate", Ye), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: xt("add"),
		set: xt("set"),
		delete: xt("delete"),
		clear: xt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ R(this), r = yt(n), i = /* @__PURE__ */ R(e), a = !t && !/* @__PURE__ */ L(e) && !/* @__PURE__ */ Lt(e) ? i : e;
			return r.has.call(n, a) || k(e, a) && r.has.call(n, e) || k(i, a) && r.has.call(n, i) || (n.add(a), Qe(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ L(n) || /* @__PURE__ */ Lt(n) || (n = /* @__PURE__ */ R(n));
			let r = /* @__PURE__ */ R(this), { has: i, get: a } = yt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ R(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? k(n, s) && Qe(r, "set", e, n, s) : Qe(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ R(this), { has: n, get: r } = yt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ R(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Qe(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ R(this), t = e.size !== 0, n = e.clear();
			return t && Qe(e, "clear", void 0, void 0, void 0), n;
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
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
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
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = jt(S(e));
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
function L(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ R(t) : e;
}
function zt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && ae(e, "__v_skip", !0), e;
}
var z = (e) => v(e) ? /* @__PURE__ */ Mt(e) : e, Bt = (e) => v(e) ? /* @__PURE__ */ Pt(e) : e;
// @__NO_SIDE_EFFECTS__
function B(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function V(e) {
	return Ht(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return Ht(e, !0);
}
function Ht(e, t) {
	return /* @__PURE__ */ B(e) ? e : new Ut(e, t);
}
var Ut = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ R(e), this._value = t ? e : z(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ L(e) || /* @__PURE__ */ Lt(e);
		e = n ? e : /* @__PURE__ */ R(e), k(e, t) && (this._rawValue = e, this._value = n ? e : z(e), this.dep.trigger());
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
	return /* @__PURE__ */ It(e) ? e : new Proxy(e, Wt);
}
var Kt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
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
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ L(e) || o === !1 || o === 0 ? $t(e, 1) : $t(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ B(e) ? (g = () => e.value, y = /* @__PURE__ */ L(e)) : /* @__PURE__ */ It(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ It(e) || /* @__PURE__ */ L(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ B(e)) return e.value;
		if (/* @__PURE__ */ It(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
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
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Xt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => $t(e(), t);
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
	let C = b ? Array(e.length).fill(Jt) : Jt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => k(e, C[t])) : k(t, C))) {
					let e = Xt;
					Ve();
					try {
						_ && _(), Xt = m;
						let e = [
							t,
							C === Jt ? void 0 : b && C[0] === Jt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Xt = e, He();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new De(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Zt(e, !1, m), _ = m.onStop = () => {
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
var U = [], W = -1, an = [], on = null, sn = 0, cn = /* @__PURE__ */ Promise.resolve(), ln = null;
function un(e) {
	let t = ln || cn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function dn(e) {
	let t = W + 1, n = U.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = U[r], a = yn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function fn(e) {
	if (!(e.flags & 1)) {
		let t = yn(e), n = U[U.length - 1];
		!n || !(e.flags & 2) && t >= yn(n) ? U.push(e) : U.splice(dn(t), 0, e), e.flags |= 1, pn();
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
function hn(e, t, n, r = W + 1) {
	for (; r < U.length; r++) {
		let n = U[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			U.splice(r, 1), r = e ? r - 1 : W, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
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
		for (W = 0; W < U.length; W++) {
			let e = U[W];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), en(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; W < U.length; W++) {
			let e = U[W];
			e && (e.flags &= -2);
		}
		W = -1, U.length = 0, gn(e), ln = null, (U.length || an.length) && bn(e);
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
		r._d && Zr(-1);
		let i = Sn(t), a = Jr.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Jr.length; e > a; e--) Yr();
			Sn(i), r._d && Zr(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function wn(e, n) {
	if (G === null) return e;
	let r = Mi(G), i = e.dirs ||= [];
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
		c && (Ve(), tn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function En(e, t, n = !1) {
	let r = yi();
	if (r || ir) {
		let i = ir ? ir._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
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
	if (Ti) {
		if (c === "sync") {
			let e = On();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = vi;
	u.call = (e, t, n) => tn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		e.i = p, K(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : fn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Qt(e, n, u);
	return Ti && (f ? f.push(h) : d && h()), h;
}
var jn = /* @__PURE__ */ Symbol("_vte"), Mn = (e) => e.__isTeleport, Nn = /* @__PURE__ */ Symbol("_leaveCb");
function Pn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== J) {
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
	else if (e.transition = t, e.type === q && d(e.children)) {
		let n = ur(e.children, !1);
		n && In(n, t);
	}
}
function Ln(e) {
	if (e.component) return Ln(e.component.subTree);
	if (e.type === q) {
		let t = d(e.children) && ur(e.children, !1);
		return t ? Ln(t) : void 0;
	}
	if (e.type !== J) return e;
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
	let s = a.shapeFlag & 4 ? Mi(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ R(v), b = v === t ? i : (e) => !zn(_, e) && u(y, e), x = (e, t) => !(t && zn(_, t));
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
				t.id = -1, Bn.set(e, t), K(t, r);
			} else Hn(e), i();
		}
	}
}
function Hn(e) {
	let t = Bn.get(e);
	t && (t.flags |= 8, Bn.delete(e));
}
ce().requestIdleCallback, ce().cancelIdleCallback;
var Un = (e) => !!e.type.__asyncLoader, Wn = (e) => e.type.__isKeepAlive;
function Gn(e, t, n = vi, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ve();
			let i = Si(n), a = tn(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Kn = (e) => (t, n = vi) => {
	Ti && e !== "sp" || Gn(e, (...e) => t(...e), n);
}, qn = Kn("m"), Jn = Kn("bum"), Yn = /* @__PURE__ */ Symbol.for("v-ndc");
function Xn(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ It(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ L(e), s = /* @__PURE__ */ Lt(e), e = et(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Bt(z(e[n])) : z(e[n]) : e[n], n, void 0, a && a[n]);
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
var Zn = (e) => e ? wi(e) ? Mi(e) : Zn(e.parent) : null, Qn = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
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
		if (d) return n === "$attrs" && F(e.attrs, "get", ""), d(e);
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
			version: Fi,
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
					let u = l._ceVNode || ii(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Mi(u.component);
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
var ir = null, ar = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${D(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function or(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && ar(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(oe)));
	let c, l = i[c = re(n)] || i[c = re(D(n))];
	!l && o && (l = i[c = re(O(n))]), l && tn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, tn(u, e, 6, a);
	}
}
function sr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function cr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, O(t)) || u(e, t));
}
function lr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Sn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = li(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = li(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : dr(c);
		}
	} catch (t) {
		Jr.length = 0, nn(t, e, 1), v = ii(J);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = fr(y, a)), b = si(b, y, !1, !0));
	}
	return n.dirs && (b = si(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && In(Mn(b.type) && Fn(b) || b, n.transition), v = b, Sn(_), v;
}
function ur(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ei(r)) {
			if (r.type !== J || r.children === "v-if") {
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
	return n === "style" && v(r) && v(i) ? !be(r, i) : r !== i;
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
	e.props = n ? r ? i : /* @__PURE__ */ Nt(i) : e.type.props ? i : a, e.attrs = a;
}
function xr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ R(i), [c] = e.propsOptions, l = !1;
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
		for (let a in s) t && (u(t, a) || (r = O(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Cr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && Qe(e.attrs, "set", "");
}
function Sr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = D(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : cr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ R(r), i = c || t;
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
					let o = Si(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === O(n)) && (r = !0));
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
var Er = (e) => e === "_" || e === "_ctx" || e === "$stable", Dr = (e) => d(e) ? e.map(li) : [li(e)], Or = (e, t, n) => {
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
		e ? (jr(r, t, n), n && ae(r, "_", e, !0)) : kr(t, r);
	} else t && Ar(e, t);
}, Nr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : jr(a, n, r) : (o = !n.$stable, kr(n, a)), s = n;
	} else n && (Ar(e, n), s = { default: 1 });
	if (o) for (let e in a) !Er(e) && s[e] == null && delete a[e];
}, K = Gr;
function Pr(e) {
	return Fr(e);
}
function Fr(e, i) {
	let a = ce();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ti(e, t) && (i = ve(e), A(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Kr:
				y(e, t, r, i);
				break;
			case J:
				b(e, t, r, i);
				break;
			case qr:
				e ?? x(t, r, i, s);
				break;
			case q:
				re(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? k(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, be);
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
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, Ir(e, a), s, u), _ && Tn(e, null, r, "created"), ee(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && pi(f, r, e);
		}
		_ && Tn(e, null, r, "beforeMount");
		let v = Rr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && K(() => {
			try {
				f && pi(f, r, e), v && g.enter(d), _ && Tn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ee = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Wr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ui(e[l]) : li(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, te = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Lr(r, !1), (g = h.onVnodeBeforeUpdate) && pi(g, r, n, e), f && Tn(n, e, r, "beforeUpdate"), r && Lr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, Ir(n, a), o) : s || ue(e, n, l, null, r, i, Ir(n, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && K(() => {
			g && pi(g, r, n, e), f && Tn(n, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Ur(c), d = u && (c.type === q || !ti(c, l) || c.shapeFlag & 198) ? m(u) : n;
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
	}, re = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && zr(e, t, !0)) : ue(e, t, n, f, i, a, s, c, l);
	}, k = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ae(t, n, r, i, a, o, c) : oe(e, t, c);
	}, ae = (e, t, n, r, i, a, o) => {
		let s = e.component = _i(e, r, i);
		if (Wn(e) && (s.ctx.renderer = be), Ei(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, se, o, a), !e.el) {
				let r = s.subTree = ii(J);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else se(s, e, t, n, i, a, o);
	}, oe = (e, t, n) => {
		let r = t.component = e.component;
		if (pr(e, t, n)) {
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
					let n = Vr(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							K(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Lr(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && ie(n), (d = t.props && t.props.onVnodeBeforeUpdate) && pi(d, s, t, c), Lr(e, !0);
				let f = lr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ve(p), e, i, a), t.el = f.el, u === null && gr(e, f.el), r && K(r, i), (d = t.props && t.props.onVnodeUpdated) && K(() => pi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Un(t);
				if (Lr(e, !1), l && ie(l), !m && (o = c && c.onVnodeBeforeMount) && pi(o, d, t), Lr(e, !0), s && j) {
					let t = () => {
						e.subTree = lr(e), j(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = lr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && K(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					K(() => pi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Un(d.vnode) && d.vnode.shapeFlag & 256) && e.a && K(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => fn(u), Lr(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, xr(e, t.props, r, n), Nr(e, t.children, n), Ve(), hn(e), He();
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
			let n = t[p] = l ? ui(t[p]) : li(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? _e(e, a, o, !0, !1, f) : D(t, r, i, a, o, s, c, l, f);
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? ui(t[u]) : li(t[u]);
			if (ti(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? ui(t[p]) : li(t[p]);
			if (ti(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? ui(t[u]) : li(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) A(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? ui(t[u]) : li(t[u]);
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
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ti(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? A(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Br(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ur(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? pe(n, r, p, 2) : _--);
			}
		}
	}, pe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) pe(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, be);
		else if (c === q) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) pe(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === qr) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Nn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), K(() => l.enter(a), i));
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
	}, A = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ve(), Vn(s, null, n, e, !0), He()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Un(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && pi(_, t, e), u & 6) ge(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Tn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? _e(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && _e(c, t, n), r && me(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && K(() => {
			_ && pi(_, t, e), h && Tn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, me = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === q;
		if (a && !i) {
			he(n, r);
			return;
		}
		if (t === qr) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Ln(e) : e, c = () => {
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
		Hr(c), Hr(l), r && ie(r), i.stop(), a ? (a.flags |= 8, A(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, A(o, e, t, n)), s && K(s, t), K(() => {
			e.isUnmounted = !0;
		}, t);
	}, _e = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) A(e[o], t, n, r, i);
	}, ve = (e) => {
		if (e.shapeFlag & 6) return ve(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[jn];
		return n ? h(n) : t;
	}, ye = (e, t, n) => {
		vn(() => {
			e == null ? t._vnode && A(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : gi());
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
		createApp: rr(ye, xe)
	};
}
function Ir({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Lr({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Rr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function zr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ui(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && zr(t, a)), a.type === Kr && (a.patchFlag === -1 && (a = i[e] = ui(a)), a.el = t.el), a.type === J && !a.el && (a.el = t.el);
	}
}
function Br(e) {
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
function Vr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Vr(t);
}
function Hr(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ur(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ur(t.subTree) : null;
}
var Wr = (e) => e.__isSuspense;
function Gr(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : mn(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), Kr = /* @__PURE__ */ Symbol.for("v-txt"), J = /* @__PURE__ */ Symbol.for("v-cmt"), qr = /* @__PURE__ */ Symbol.for("v-stc"), Jr = [], Y = null;
function X(e = !1) {
	Jr.push(Y = e ? null : []);
}
function Yr() {
	Jr.pop(), Y = Jr[Jr.length - 1] || null;
}
var Xr = 1;
function Zr(e, t = !1) {
	Xr += e, e < 0 && Y && t && (Y.hasOnce = !0);
}
function Qr(e) {
	return e.dynamicChildren = Xr > 0 ? Y || n : null, Yr(), Xr > 0 && Y && Y.push(e), e;
}
function Z(e, t, n, r, i, a) {
	return Qr(Q(e, t, n, r, i, a, !0));
}
function $r(e, t, n, r, i) {
	return Qr(ii(e, t, n, r, i, !0));
}
function ei(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ti(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ni = ({ key: e }) => e ?? null, ri = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ B(e) || h(e) ? {
	i: G,
	r: e,
	k: t,
	f: !!n
} : e);
function Q(e, t = null, n = null, r = 0, i = null, a = e === q ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ni(t),
		ref: t && ri(t),
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
	return s ? (di(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Xr > 0 && !o && Y && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Y.push(c), c;
}
var ii = ai;
function ai(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Yn || (e = J), ei(e)) {
		let r = si(e, t, !0);
		return n && di(r, n), Xr > 0 && !a && Y && (r.shapeFlag & 6 ? Y[Y.indexOf(e)] = r : Y.push(r)), r.patchFlag = -2, r;
	}
	if (Ni(e) && (e = e.__vccOpts), t) {
		t = oi(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = A(e)), v(n) && (/* @__PURE__ */ Rt(n) && !d(n) && (n = s({}, n)), t.style = le(n));
	}
	let o = g(e) ? 1 : Wr(e) ? 128 : Mn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Q(e, t, n, r, i, o, a, !0);
}
function oi(e) {
	return e ? /* @__PURE__ */ Rt(e) || yr(e) ? s({}, e) : e : null;
}
function si(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? fi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ni(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(ri(t)) : [a, ri(t)] : ri(t) : a,
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
		ssContent: e.ssContent && si(e.ssContent),
		ssFallback: e.ssFallback && si(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && In(u, c.clone(u)), u;
}
function ci(e = " ", t = 0) {
	return ii(Kr, null, e, t);
}
function $(e = "", t = !1) {
	return t ? (X(), $r(J, null, e)) : ii(J, null, e);
}
function li(e) {
	return e == null || typeof e == "boolean" ? ii(J) : d(e) ? ii(q, null, e.slice()) : ei(e) ? ui(e) : ii(Kr, null, String(e));
}
function ui(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : si(e);
}
function di(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), di(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !yr(t) ? t._ctx = G : r === 3 && G && (G.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			di(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: G
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [ci(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function fi(...e) {
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
function pi(e, t, n, r = null) {
	tn(e, t, 7, [n, r]);
}
var mi = tr(), hi = 0;
function gi() {
	return hi;
}
function _i(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || mi, o = {
		uid: hi++,
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
var vi = null, yi = () => vi || G, bi, xi;
{
	let e = ce(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	bi = t("__VUE_INSTANCE_SETTERS__", (e) => vi = e), xi = t("__VUE_SSR_SETTERS__", (e) => Ti = e);
}
var Si = (e) => {
	let t = vi;
	return bi(e), e.scope.on(), () => {
		e.scope.off(), bi(t);
	};
}, Ci = () => {
	vi && vi.scope.off(), bi(null);
};
function wi(e) {
	return e.vnode.shapeFlag & 4;
}
var Ti = !1;
function Ei(e, t = !1, n = !1) {
	t && xi(t);
	let { props: r, children: i } = e.vnode, a = wi(e);
	br(e, r, a, t), Mr(e, i, n || t);
	let o = a ? Di(e, t) : void 0;
	return t && xi(!1), o;
}
function Di(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, er);
	let { setup: r } = n;
	if (r) {
		Ve();
		let n = e.setupContext = r.length > 1 ? ji(e) : null, i = Si(e), a = en(r, e, 0, [e.props, n]), o = y(a);
		if (He(), i(), (o || e.sp) && !Un(e) && Rn(e), o) {
			if (a.then(Ci, Ci), t) return a.then((n) => {
				xi(!0);
				try {
					Oi(e, n, t);
				} finally {
					xi(!1);
				}
			}).catch((t) => {
				nn(t, e, 0);
			});
			e.asyncDep = a;
		} else Oi(e, a, t);
	} else ki(e, t);
}
function Oi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Gt(t)), ki(e, n);
}
function ki(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var Ai = { get(e, t) {
	return F(e, "get", ""), e[t];
} };
function ji(e) {
	return {
		attrs: new Proxy(e.attrs, Ai),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Mi(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Gt(zt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Qn) return Qn[n](e);
		},
		has(e, t) {
			return t in e || t in Qn;
		}
	}) : e.proxy;
}
function Ni(e) {
	return h(e) && "__vccOpts" in e;
}
var Pi = (e, t) => /* @__PURE__ */ qt(e, t, Ti), Fi = "3.5.44", Ii = void 0, Li = typeof window < "u" && window.trustedTypes;
if (Li) try {
	Ii = /* @__PURE__ */ Li.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ri = Ii ? (e) => Ii.createHTML(e) : (e) => e, zi = "http://www.w3.org/2000/svg", Bi = "http://www.w3.org/1998/Math/MathML", Vi = typeof document < "u" ? document : null, Hi = Vi && /* @__PURE__ */ Vi.createElement("template"), Ui = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Vi.createElementNS(zi, e) : t === "mathml" ? Vi.createElementNS(Bi, e) : n ? Vi.createElement(e, { is: n }) : Vi.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Vi.createTextNode(e),
	createComment: (e) => Vi.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Vi.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Hi.innerHTML = Ri(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Hi.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Wi = /* @__PURE__ */ Symbol("_vtc");
function Gi(e, t, n) {
	let r = e[Wi];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Ki = /* @__PURE__ */ Symbol("_vod"), qi = /* @__PURE__ */ Symbol("_vsh"), Ji = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Ki] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Yi(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Yi(e, !0), r.enter(e)) : r.leave(e, () => {
			Yi(e, !1);
		}) : Yi(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Yi(e, t);
	}
};
function Yi(e, t) {
	e.style.display = t ? e[Ki] : "none", e[qi] = !t;
}
var Xi = /* @__PURE__ */ Symbol(""), Zi = /(?:^|;)\s*display\s*:/;
function Qi(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? ea(r, t, "");
			}
			else for (let e in t) n[e] ?? ea(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ea(r, i, "") : ia(e, i, !g(t) && t ? t[i] : void 0, o) || ea(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Xi];
			e && (n += ";" + e), r.cssText = n, a = Zi.test(n);
		}
	} else t && e.removeAttribute("style");
	Ki in e && (i && t === n || (e[Ki] = a ? r.display : ""), e[qi] && (r.display = "none"));
}
var $i = /\s*!important$/;
function ea(e, t, n) {
	if (d(n)) n.forEach((n) => ea(e, t, n));
	else if (n ??= "", t.startsWith("--")) $i.test(n) ? e.setProperty(t, n.replace($i, ""), "important") : e.setProperty(t, n);
	else {
		let r = ra(e, t);
		$i.test(n) ? e.setProperty(O(r), n.replace($i, ""), "important") : e[r] = n;
	}
}
var ta = [
	"Webkit",
	"Moz",
	"ms"
], na = {};
function ra(e, t) {
	let n = na[t];
	if (n) return n;
	let r = D(t);
	if (r !== "filter" && r in e) return na[t] = r;
	r = ne(r);
	for (let n = 0; n < ta.length; n++) {
		let i = ta[n] + r;
		if (i in e) return na[t] = i;
	}
	return t;
}
function ia(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var aa = "http://www.w3.org/1999/xlink";
function oa(e, t, n, r, i, a = me(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(aa, t.slice(6, t.length)) : e.setAttributeNS(aa, t, n) : n == null || a && !he(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function sa(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ri(n) : n);
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
function ca(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function la(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var ua = /* @__PURE__ */ Symbol("_vei");
function da(e, t, n, r, i = null) {
	let a = e[ua] || (e[ua] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ma(t);
		r ? ca(e, n, a[t] = va(r, i), s) : o && (la(e, n, o, s), a[t] = void 0);
	}
}
var fa = /(Once|Passive|Capture)$/, pa = /^on:?(?:Once|Passive|Capture)$/;
function ma(e) {
	let t, n;
	for (; (n = e.match(fa)) && !pa.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : O(e.slice(2)), t];
}
var ha = 0, ga = /* @__PURE__ */ Promise.resolve(), _a = () => ha ||= (ga.then(() => ha = 0), Date.now());
function va(e, t) {
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
	return n.value = e, n.attached = _a(), n;
}
var ya = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ba = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Gi(e, r, c) : t === "style" ? Qi(e, n, r) : a(t) ? o(t) || da(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : xa(e, t, r, c)) ? (sa(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || oa(e, t, r, c, s, t !== "value")) : e._isVueCE && (Sa(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? sa(e, D(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), oa(e, t, r, c));
};
function xa(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && ya(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return ya(t) && g(n) ? !1 : t in e;
}
function Sa(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = D(t);
	return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
}
var Ca = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ie(t, e) : t;
};
function wa(e) {
	e.target.composing = !0;
}
function Ta(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Ea = /* @__PURE__ */ Symbol("_assign"), Da = /* @__PURE__ */ Symbol("_initialValue");
function Oa(e, t, n) {
	return t && (e = e.trim()), n && (e = oe(e)), e;
}
var ka = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Da] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Da] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Ea] = Ca(i);
		let a = r || i.props && i.props.type === "number";
		ca(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Ea](Oa(e.value, n, a));
		}), (n || a) && ca(e, "change", () => {
			e.value = Oa(e.value, n, a);
		}), t || (ca(e, "compositionstart", wa), ca(e, "compositionend", Ta), ca(e, "change", Ta));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Da];
		delete e[Da], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Ea](Oa(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Ea] = Ca(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? oe(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Aa = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ja = {
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
	exact: (e, t) => Aa.some((n) => e[`${n}Key`] && !t.includes(n))
}, Ma = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ja[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Na = /* @__PURE__ */ s({ patchProp: ba }, Ui), Pa;
function Fa() {
	return Pa ||= Pr(Na);
}
var Ia = ((...e) => {
	let t = Fa().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ra(e);
		if (!r) return;
		let i = t._component;
		h(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, La(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function La(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ra(e) {
	return g(e) ? document.querySelector(e) : e;
}
// services/portal/src/shared/usePortalTranslations.js
function za() {
	let e = /* @__PURE__ */ V(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), Jn(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
}
// services/portal/src/files/useClassroomFiles.js
var Ba = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.odg,.txt,.md,.csv,.png,.jpg,.jpeg,.webp,.gif,.mp3,.ogg,.wav,.m4a,.mp4,.webm,.epub,.zip", Va = /* @__PURE__ */ new Set([
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
function Ha(e, t, n) {
	let r = /* @__PURE__ */ Vt({
		enabled: !1,
		groupId: "",
		identityId: ""
	}), i = /* @__PURE__ */ V([]), a = /* @__PURE__ */ V(null), o = /* @__PURE__ */ V(null), s = /* @__PURE__ */ V(!1), c = /* @__PURE__ */ V("shared"), l = /* @__PURE__ */ V(!1), u = /* @__PURE__ */ V(!1), d = /* @__PURE__ */ V(!1), f = /* @__PURE__ */ V(""), p = /* @__PURE__ */ V(0), m = /* @__PURE__ */ V(0), h = /* @__PURE__ */ V(""), g = 0, _ = 0, v = !0, y = /* @__PURE__ */ new Set(), b = Pi(() => r.value.identityId ? "/api/student/group-files" : `/api/teacher/groups/${encodeURIComponent(r.value.groupId)}/files`), x = Pi(() => i.value.filter((e) => e.scope === (c.value === "shared" ? "shared" : "submission") && e.relative_path.toLocaleLowerCase().includes(h.value.toLocaleLowerCase()))), S = Pi(() => !r.value.enabled || !r.value.groupId || d.value || u.value);
	function C(e) {
		return v && e === g && r.value.enabled && !!r.value.groupId;
	}
	function w() {
		g++, _++;
		for (let e of y) e.abort();
		y.clear(), i.value = [], a.value = null, o.value = null, l.value = !1, u.value = !1, d.value = !1, f.value = "", p.value = 0, m.value = 0, h.value = "";
	}
	function T(e) {
		let t = e.enabled !== r.value.enabled || e.groupId !== r.value.groupId || e.identityId !== r.value.identityId;
		r.value = e, t && (w(), c.value = "shared", s.value && e.enabled && e.groupId && D());
	}
	async function E(t, n = {}) {
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
	function ee(e) {
		i.value = [], l.value = !1, e.status === 401 ? (f.value = "files.sessionExpired", n?.()) : f.value = "files.error." + (Va.has(e.message) ? e.message : "operation");
	}
	async function D(e = !0) {
		if (!r.value.enabled || !r.value.groupId) return;
		let t = g, n = ++_;
		u.value = !0, l.value = !1, e && (f.value = "");
		try {
			let e = await E(b.value, { method: "GET" });
			if (!C(t) || n !== _) return;
			if (!Array.isArray(e.files) || !e.settings || !e.usage) throw Error("invalid_files");
			i.value = e.files, a.value = e.settings, o.value = e.usage, l.value = !0;
		} catch (e) {
			C(t) && n === _ && ee(e);
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
					await E(s, l());
				} catch (e) {
					if (e.status !== 409 || e.message !== "file_exists" || !C(o)) throw e;
					if (!window.confirm(t("files.replace", { name: n }))) continue;
					c = !0, await E(s, l());
				}
				if (!C(o)) return;
				p.value++;
			}
			C(o) && (f.value = "files.saved");
		} catch (e) {
			C(o) && ee(e);
		} finally {
			C(o) && (d.value = !1, await D(!1));
		}
	}
	async function ne(e) {
		if (S.value || !l.value || !window.confirm(t("files.confirmDelete", { name: e.relative_path }))) return;
		let n = g;
		d.value = !0, f.value = "", p.value = 0, m.value = 0;
		try {
			await E(b.value + "/" + encodeURIComponent(e.id), { method: "DELETE" }), C(n) && (f.value = "files.deleted");
		} catch (e) {
			C(n) && ee(e);
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
			C(r) && ee(e);
		}
	}
	function k() {
		w();
	}
	function ie(e) {
		e.persisted && s.value && D();
	}
	return window.addEventListener("pagehide", k), window.addEventListener("pageshow", ie), Jn(() => {
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
		setContext: T,
		load: D,
		toggle: te,
		upload: O,
		remove: ne,
		drop: re
	};
}
// services/portal/src/files/ClassroomFilesBrowser.vue
var Ua = { key: 0 }, Wa = { class: "actions" }, Ga = ["aria-pressed"], Ka = ["aria-pressed"], qa = ["disabled"], Ja = {
	key: 0,
	class: "hint"
}, Ya = {
	key: 1,
	role: "status"
}, Xa = {
	key: 2,
	role: "status",
	"data-files-feedback": ""
}, Za = { key: 3 }, Qa = [
	"value",
	"max",
	"aria-label"
], $a = { class: "hint" }, eo = { key: 0 }, to = { class: "actions" }, no = ["aria-disabled"], ro = ["accept", "disabled"], io = ["aria-disabled"], ao = ["disabled"], oo = { role: "status" }, so = [
	"value",
	"max",
	"aria-label"
], co = { key: 3 }, lo = { class: "file-list" }, uo = ["data-classroom-file"], fo = { key: 0 }, po = { class: "actions" }, mo = ["href", "aria-disabled"], ho = ["disabled", "onClick"], go = {
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
		let t = e, n = za(), { settings: r, usage: i, tab: a, ready: o, loading: s, pending: c, feedback: l, done: u, total: d, search: f, visible: p, disabled: m, base: h, setContext: g, load: _, toggle: v, upload: y, remove: b, drop: x } = Ha(t.api, n, t.onSessionExpired);
		kn(() => [
			t.enabled,
			t.groupId,
			t.identityId
		], () => g({
			enabled: t.enabled,
			groupId: t.groupId,
			identityId: t.identityId
		}), { immediate: !0 });
		let S = Pi(() => !!t.identityId), C = Pi(() => o.value && !m.value && (S.value ? a.value === "submission" && r.value?.students_can_upload : a.value === "shared")), w = Pi(() => S.value ? i.value?.student_bytes : i.value?.group_bytes), T = Pi(() => S.value ? r.value?.student_quota_bytes : r.value?.group_quota_bytes), E = (e) => ((e || 0) / 1048576).toLocaleString(void 0, { maximumFractionDigits: 2 });
		function ee(e) {
			let t = Array.from(e.target.files || []);
			e.target.value = "", y(t);
		}
		return (t, i) => (X(), Z("details", {
			class: "classroom-files",
			"data-classroom-files": "",
			onToggle: i[6] ||= (...e) => H(v) && H(v)(...e)
		}, [
			Q("summary", null, [Q("strong", null, j(H(n)("files.title")), 1)]),
			Q("p", null, j(H(n)(S.value ? "files.studentHint" : "files.teacherHint")), 1),
			!e.enabled || !e.groupId ? (X(), Z("p", Ua, j(H(n)("files.selectGroup")), 1)) : (X(), Z(q, { key: 1 }, [
				Q("div", Wa, [
					Q("button", {
						type: "button",
						"data-files-tab": "shared",
						"aria-pressed": H(a) === "shared",
						onClick: i[0] ||= (e) => a.value = "shared"
					}, j(H(n)("files.shared")), 9, Ga),
					Q("button", {
						type: "button",
						"data-files-tab": "submission",
						"aria-pressed": H(a) === "submission",
						onClick: i[1] ||= (e) => a.value = "submission"
					}, j(H(n)(S.value ? "files.mine" : "files.submissions")), 9, Ka),
					Q("button", {
						type: "button",
						class: "secondary",
						"data-files-refresh": "",
						disabled: H(m),
						onClick: i[2] ||= (e) => H(_)()
					}, j(H(n)("files.refresh")), 9, qa)
				]),
				S.value && H(a) === "submission" ? (X(), Z("p", Ja, j(H(n)("files.privateHint")), 1)) : $("", !0),
				H(s) ? (X(), Z("p", Ya, j(H(n)("files.loading")), 1)) : $("", !0),
				H(l) ? (X(), Z("p", Xa, j(H(n)(H(l), { count: H(u) })), 1)) : $("", !0),
				H(u) && H(l) && H(l) !== "files.saved" ? (X(), Z("p", Za, j(H(n)("files.partial", { count: H(u) })), 1)) : $("", !0),
				H(o) ? (X(), Z(q, { key: 4 }, [
					Q("p", null, j(H(n)("files.quota", {
						used: E(w.value),
						limit: E(T.value)
					})), 1),
					Q("progress", {
						value: w.value || 0,
						max: T.value || 1,
						"aria-label": H(n)("files.space")
					}, null, 8, Qa),
					Q("p", $a, j(H(n)("files.limit", { limit: E(H(r).max_file_bytes) })), 1),
					S.value && !H(r).students_can_upload ? (X(), Z("p", eo, j(H(n)("files.uploadDisabled")), 1)) : $("", !0),
					C.value || H(c) ? (X(), Z("div", {
						key: 1,
						class: "files-upload",
						onDragover: i[3] ||= Ma(() => {}, ["prevent"]),
						onDrop: i[4] ||= Ma((e) => C.value && H(x)(e), ["prevent"])
					}, [Q("p", null, j(H(n)("files.drop")), 1), Q("div", to, [Q("label", {
						class: "button-link",
						"aria-disabled": !C.value
					}, [ci(j(H(n)("files.choose")), 1), Q("input", {
						"data-files-input": "",
						type: "file",
						multiple: "",
						accept: H(Ba),
						disabled: !C.value,
						onChange: ee
					}, null, 40, ro)], 8, no), Q("label", {
						class: "button-link secondary",
						"aria-disabled": !C.value
					}, [ci(j(H(n)("files.chooseFolder")), 1), Q("input", {
						"data-files-folder": "",
						type: "file",
						multiple: "",
						webkitdirectory: "",
						disabled: !C.value,
						onChange: ee
					}, null, 40, ao)], 8, io)])], 32)) : $("", !0),
					H(c) ? (X(), Z(q, { key: 2 }, [Q("p", oo, j(H(n)("files.progress", {
						done: H(u),
						total: H(d)
					})), 1), Q("progress", {
						value: H(u),
						max: H(d) || 1,
						"aria-label": H(n)("files.progress", {
							done: H(u),
							total: H(d)
						})
					}, null, 8, so)], 64)) : $("", !0),
					Q("label", null, [ci(j(H(n)("files.search")), 1), wn(Q("input", {
						"onUpdate:modelValue": i[5] ||= (e) => /* @__PURE__ */ B(f) ? f.value = e : null,
						type: "search",
						"data-files-search": ""
					}, null, 512), [[ka, H(f)]])]),
					!H(p).length && !H(s) ? (X(), Z("p", co, j(H(n)("files.empty")), 1)) : $("", !0),
					Q("ul", lo, [(X(!0), Z(q, null, Xn(H(p), (e) => (X(), Z("li", {
						key: e.id,
						"data-classroom-file": e.id
					}, [Q("div", null, [Q("strong", null, j(e.relative_path), 1), Q("small", null, [ci(j(E(e.size)) + " MiB", 1), !S.value && e.public_code ? (X(), Z("span", fo, " · " + j(e.public_code), 1)) : $("", !0)])]), Q("div", po, [Q("a", {
						href: H(m) ? void 0 : H(h) + "/" + encodeURIComponent(e.id) + "/download",
						class: "button-link secondary",
						"aria-disabled": H(m),
						"data-file-download": ""
					}, j(H(n)("files.download")), 9, mo), !S.value || e.scope === "submission" ? (X(), Z("button", {
						key: 0,
						type: "button",
						class: "secondary",
						disabled: H(m),
						"data-file-delete": "",
						onClick: (t) => H(b)(e)
					}, j(H(n)("files.delete")), 9, ho)) : $("", !0)])], 8, uo))), 128))])
				], 64)) : $("", !0)
			], 64))
		], 32));
	}
}, _o = {
	__name: "StudentFiles",
	props: {
		api: Function,
		onSessionExpired: Function,
		identity: Object
	},
	setup(e) {
		return (t, n) => (X(), $r(go, {
			api: e.api,
			"on-session-expired": e.onSessionExpired,
			enabled: !!e.identity,
			"group-id": e.identity.group_id,
			"identity-id": e.identity.id
		}, null, 8, [
			"api",
			"on-session-expired",
			"enabled",
			"group-id",
			"identity-id"
		]));
	}
};
// services/portal/src/student/launch.js
function vo(e, t = window.location) {
	if (!e) return "";
	let n = new URL(e, t.origin);
	if (!["http:", "https:"].includes(n.protocol) || n.username || n.password) throw Error("invalid_url");
	let r = (e) => [
		"localhost",
		"127.0.0.1",
		"::1",
		"[::1]"
	].includes(e);
	return r(n.hostname) && !r(t.hostname) && (n.hostname = t.hostname, n.port === "8086" && t.port === "18082" && (n.port = "18086")), n.toString();
}
function yo(e, t, n, r = window.location) {
	if (e.app_id === "eduhoot") {
		let i = ["localhost", "127.0.0.1"].includes(r.hostname) ? r.protocol : "http:", a = new URL("/solo/", `${i}//${r.hostname}:8090`);
		return a.searchParams.set("id", e.activity_id), a.searchParams.set("commonsLaunchToken", t), a.searchParams.set("lang", n), a.toString();
	}
	let i = {
		80: "8084",
		8082: "8084",
		18082: "18084"
	}[r.port || (r.protocol === "http:" ? "80" : "443")], a = i ? `${r.protocol}//${r.hostname}:${i}` : r.origin, o = new URL((i ? "/" : "/play/") + encodeURIComponent(e.activity_id), a);
	return o.searchParams.set("launch_token", t), o.toString();
}
function bo(e) {
	if (!e?.group_id) return !1;
	let t = new URLSearchParams(window.location.search).get("next");
	return [
		"/assets/",
		"/blocs-access.html",
		"/llibres-login.html?lang=es",
		"/llibres-login.html?lang=va"
	].includes(t) ? (window.location.replace(t), !0) : !1;
}
// services/portal/src/student/useStudent.js
var xo = /* @__PURE__ */ "🦊.🐱.🐶.🐼.🐧.🐸.🦉.🦄.🐰.🐢.🐙.🦁.🐨.🐝.🐯.🐻.🦕.🦖.🐉.🚀.🌈.⚽️.🏀.🏆.🎮.🎧.📚.🎨".split(".");
function So(e, t) {
	let n = /* @__PURE__ */ V(null), r = /* @__PURE__ */ V([]), i = /* @__PURE__ */ V(null), a = /* @__PURE__ */ V(null), o = /* @__PURE__ */ V(""), s = /* @__PURE__ */ V(""), c = /* @__PURE__ */ V(!1), l = /* @__PURE__ */ V(!1), u = /* @__PURE__ */ V(!1), d = /* @__PURE__ */ V(!0), f = /* @__PURE__ */ V(!1), p = /* @__PURE__ */ V(""), m = 0, h = 0, g = 0, _ = !0, v = /* @__PURE__ */ new Set(), y = Pi(() => r.value.filter((e) => e.completed).length), b = Pi(() => c.value ? r.value : r.value.filter((e) => !e.completed)), x = Pi(() => !l.value || d.value || f.value || u.value), S = (e) => _ && m === e;
	function C() {
		m++, h++, n.value = null, r.value = [], i.value = null, o.value = "", s.value = "", c.value = !1, l.value = !1, u.value = !1;
		for (let e of v) e.close();
		v.clear();
	}
	function w() {
		C(), p.value = "student.sessionExpired", t();
	}
	function T(e) {
		let t = {
			"edutictac-play": "play",
			play: "play",
			eduhoot: "eduhoot",
			resource: "recursos"
		}[e.app_id];
		return !t || !a.value || a.value.includes(t);
	}
	async function E(a = !1) {
		if (!a && (!n.value || d.value || f.value)) return;
		let o = m, s = ++h, c = n.value?.id;
		u.value = !0, l.value = !1, r.value = [], i.value = null, p.value = "";
		try {
			let u = await e("/api/student/dashboard", { method: "GET" });
			if (!S(o) || s !== h) return;
			if (!u.identity?.id || c && u.identity.id !== c || !Array.isArray(u.assignments)) throw Error("invalid_dashboard");
			n.value = u.identity, r.value = u.assignments, i.value = u.selected_itinerary || null, l.value = !0, a && (t(), bo(n.value));
		} catch (e) {
			if (!S(o) || s !== h) return;
			e.status === 401 ? a && !c ? (C(), p.value = "") : w() : p.value = "student.loadError";
		} finally {
			S(o) && s === h && (u.value = !1);
		}
	}
	async function ee() {
		if (d.value || f.value || p.value === "student.logoutError") return;
		let r = o.value.trim().toUpperCase(), i = s.value.trim();
		if (!/^[A-Z0-9]{3}$/.test(r) || !/^(?:\d{4}|\d{6})$/.test(i)) {
			s.value = "", p.value = "student.invalidLogin";
			return;
		}
		C();
		let a = m, c = ++g;
		d.value = !0, p.value = "";
		try {
			let o = await e("/api/auth/student", {
				method: "POST",
				body: JSON.stringify({
					public_code: r,
					pin: i
				})
			});
			if (!S(a)) return;
			if (!o.identity?.id) throw Error("invalid_identity");
			n.value = o.identity, t(), bo(n.value) || await E(!0);
		} catch (e) {
			S(a) && (p.value = e.status === 429 ? "student.tooManyAttempts" : [
				400,
				401,
				422
			].includes(e.status) ? "student.invalidLogin" : "student.loginError");
		} finally {
			_ && c === g && (d.value = !1);
		}
	}
	async function D() {
		if (d.value) return;
		C();
		let n = m, r = ++g;
		d.value = !0, p.value = "";
		try {
			await e("/api/auth/logout", { method: "POST" }), S(n) && (p.value = "student.logoutMessage");
		} catch (e) {
			S(n) && (p.value = e.status === 401 ? "student.logoutMessage" : "student.logoutError");
		} finally {
			_ && r === g && (d.value = !1, t());
		}
	}
	async function te(t) {
		if (x.value || !xo.includes(t)) return;
		let r = m;
		f.value = !0, p.value = "";
		try {
			let i = await e("/api/student/profile", {
				method: "PATCH",
				body: JSON.stringify({ avatar_icon: t })
			});
			if (!S(r)) return;
			if (i.identity?.id !== n.value.id) throw Error("invalid_identity");
			n.value = i.identity, p.value = "student.iconSaved";
		} catch (e) {
			S(r) && (e.status === 401 ? w() : p.value = "student.iconError");
		} finally {
			_ && (f.value = !1);
		}
	}
	async function O(t) {
		if (x.value || !T(t) || !r.value.includes(t)) return;
		let n = m, i = t.app_id === "resource", a;
		if (i) {
			if (a = window.open("", "_blank"), !a) {
				p.value = "student.popupBlocked";
				return;
			}
			a.opener = null, v.add(a);
		}
		f.value = !0, p.value = "";
		try {
			let o = await e("/api/student/launch-token", {
				method: "POST",
				body: JSON.stringify({ assignment_id: t.id })
			});
			if (!S(n) || !T(t)) return;
			if (!o.token) throw Error("invalid_launch");
			if (!i) {
				window.location.assign(yo(t, o.token, window.i18nPortal.getLang()));
				return;
			}
			let s;
			if (String(t.activity_id).startsWith("teacher-upload:")) s = new URL(`/api/student/activity-assignments/${encodeURIComponent(t.id)}/resource`, window.location.origin), s.searchParams.set("launch_token", o.token), s = s.toString();
			else {
				if (s = vo(t.launch_url), !s) {
					let r = await e("/resources-api/resources?" + new URLSearchParams({
						q: t.activity_id,
						limit: "50"
					}), { method: "GET" });
					if (!S(n) || !T(t)) return;
					let i = (r.items || []).find((e) => e.external_id === t.activity_id);
					s = vo(i?.play_url || i?.source_url || i?.reuse_url || i?.download_url);
				}
				if (!s) throw Error("missing_resource");
			}
			if (!S(n) || !T(t)) return;
			if (a.closed) throw Error("closed_popup");
			a.location.replace(s), v.delete(a), a = null, r.value = r.value.map((e) => e.id === t.id ? {
				...e,
				started: !0
			} : e);
		} catch (e) {
			S(n) && (e.status === 401 ? w() : p.value = "student.launchError");
		} finally {
			a && (v.delete(a), a.close()), _ && (f.value = !1);
		}
	}
	function ne() {
		document.getElementById("studentOutput")?.setAttribute("hidden", ""), C(), g++, d.value = !1;
	}
	async function re(e) {
		if (e.persisted) {
			let e = ++g;
			d.value = !0, await E(!0), _ && e === g && (d.value = !1, document.getElementById("studentOutput")?.removeAttribute("hidden"));
		}
	}
	let k = () => {
		document.visibilityState === "visible" && n.value && !d.value && !f.value && E();
	};
	return qn(async () => {
		let t = ++g;
		window.addEventListener("pagehide", ne), window.addEventListener("pageshow", re), window.addEventListener("focus", k), document.addEventListener("visibilitychange", k), e("/api/modules/status", { method: "GET" }).then((e) => {
			_ && Array.isArray(e.enabled) && (a.value = e.enabled);
		}).catch(() => {}), await E(!0), _ && t === g && (d.value = !1);
	}), Jn(() => {
		_ = !1, C(), window.removeEventListener("pagehide", ne), window.removeEventListener("pageshow", re), window.removeEventListener("focus", k), document.removeEventListener("visibilitychange", k);
	}), {
		identity: n,
		assignments: r,
		itinerary: i,
		code: o,
		pin: s,
		history: c,
		ready: l,
		loading: u,
		authPending: d,
		writing: f,
		feedback: p,
		completed: y,
		visible: b,
		disabled: x,
		enabled: T,
		login: ee,
		logout: D,
		load: E,
		icon: te,
		launch: O
	};
}
// services/portal/src/student/StudentPanel.vue
var Co = { class: "panel-heading" }, wo = { class: "eyebrow" }, To = { class: "grid-fields" }, Eo = ["disabled"], Do = ["disabled"], Oo = { class: "actions" }, ko = ["disabled"], Ao = {
	id: "studentSessionActions",
	class: "actions"
}, jo = ["disabled"], Mo = ["aria-busy"], No = {
	key: 0,
	role: "status"
}, Po = ["disabled"], Fo = { key: 2 }, Io = ["aria-label"], Lo = { class: "student-profile__summary" }, Ro = {
	class: "student-profile__icon",
	"aria-hidden": "true"
}, zo = { class: "muted" }, Bo = ["aria-label"], Vo = [
	"data-student-icon",
	"aria-pressed",
	"title",
	"disabled",
	"onClick"
], Ho = { class: "actions" }, Uo = ["disabled"], Wo = {
	key: 0,
	role: "status"
}, Go = {
	key: 0,
	"data-student-itinerary": ""
}, Ko = ["aria-pressed"], qo = {
	key: 2,
	class: "empty"
}, Jo = ["aria-label"], Yo = { key: 0 }, Xo = [
	"data-launch-eduhoot-assignment",
	"disabled",
	"onClick"
], Zo = [
	"data-launch-play-assignment",
	"disabled",
	"onClick"
], Qo = [
	"data-launch-document-assignment",
	"disabled",
	"onClick"
], $o = [
	"data-launch-resource-assignment",
	"disabled",
	"onClick"
], es = ["disabled"], ts = {
	__name: "StudentPanel",
	props: {
		api: Function,
		onSessionChanged: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = za(), { identity: i, assignments: a, itinerary: o, code: s, pin: c, history: l, ready: u, loading: d, authPending: f, writing: p, feedback: m, completed: h, visible: g, disabled: _, enabled: v, login: y, logout: b, load: x, icon: S, launch: C } = So(n.api, n.onSessionChanged);
		return t({ logout: b }), (t, n) => (X(), Z(q, null, [
			wn(Q("form", {
				id: "studentLoginPanel",
				onSubmit: n[2] ||= Ma((...e) => H(y) && H(y)(...e), ["prevent"])
			}, [
				Q("div", Co, [Q("p", wo, j(H(r)("student.access")), 1), Q("h3", null, j(H(r)("student.loginTitle")), 1)]),
				Q("div", To, [Q("label", null, [Q("span", null, j(H(r)("student.codeLabel")), 1), wn(Q("input", {
					id: "studentCode",
					"onUpdate:modelValue": n[0] ||= (e) => /* @__PURE__ */ B(s) ? s.value = e : null,
					type: "text",
					maxlength: "3",
					placeholder: "K7P",
					autocomplete: "off",
					autocapitalize: "characters",
					spellcheck: "false",
					disabled: H(f)
				}, null, 8, Eo), [[ka, H(s)]])]), Q("label", null, [Q("span", null, j(H(r)("student.pinLabel")), 1), wn(Q("input", {
					id: "studentPin",
					"onUpdate:modelValue": n[1] ||= (e) => /* @__PURE__ */ B(c) ? c.value = e : null,
					type: "password",
					inputmode: "numeric",
					maxlength: "6",
					autocomplete: "off",
					disabled: H(f)
				}, null, 8, Do), [[ka, H(c)]])])]),
				Q("div", Oo, [Q("button", {
					id: "studentLogin",
					type: "submit",
					disabled: H(f) || H(p) || H(m) === "student.logoutError"
				}, j(H(r)("student.login")), 9, ko)])
			], 544), [[Ji, !H(i)]]),
			wn(Q("div", Ao, [Q("button", {
				id: "studentLogout",
				type: "button",
				class: "secondary",
				disabled: H(f),
				onClick: n[3] ||= (...e) => H(b) && H(b)(...e)
			}, j(H(r)("student.logout")), 9, jo)], 512), [[Ji, H(i)]]),
			Q("div", {
				id: "studentOutput",
				class: A(["output", { empty: !H(i) }]),
				"aria-busy": H(d) || H(f) || H(p)
			}, [
				H(m) ? (X(), Z("p", No, j(H(r)(H(m))), 1)) : $("", !0),
				H(m) === "student.logoutError" ? (X(), Z("button", {
					key: 1,
					type: "button",
					disabled: H(f),
					onClick: n[4] ||= (...e) => H(b) && H(b)(...e)
				}, j(H(r)("student.logout")), 9, Po)) : $("", !0),
				!H(i) && !H(m) ? (X(), Z("p", Fo, j(H(r)("student.loginPrompt")), 1)) : $("", !0),
				H(i) ? (X(), Z(q, { key: 3 }, [
					Q("section", {
						class: "student-profile",
						"aria-label": H(r)("student.profileAria")
					}, [Q("div", Lo, [Q("span", Ro, j(H(i).avatar_icon || "🙂"), 1), Q("div", null, [Q("p", null, [
						ci(j(H(r)("student.hello")) + " ", 1),
						Q("strong", null, j(H(i).public_code), 1),
						n[8] ||= ci(".", -1)
					]), Q("p", zo, j(H(r)("student.iconHint")), 1)])]), Q("div", {
						class: "student-icon-picker",
						role: "group",
						"aria-label": H(r)("student.iconPickerAria")
					}, [(X(!0), Z(q, null, Xn(H(xo), (e) => (X(), Z("button", {
						key: e,
						type: "button",
						class: A(["student-icon", { selected: H(i).avatar_icon === e }]),
						"data-student-icon": e,
						"aria-pressed": H(i).avatar_icon === e,
						title: H(r)("student.chooseIcon") + " " + e,
						disabled: H(_),
						onClick: (t) => H(S)(e)
					}, j(e), 11, Vo))), 128))], 8, Bo)], 8, Io),
					Q("div", Ho, [Q("button", {
						id: "refreshStudent",
						type: "button",
						class: "secondary compact",
						disabled: H(f) || H(p) || H(d),
						onClick: n[5] ||= (e) => H(x)()
					}, j(H(r)("student.refresh")), 9, Uo)]),
					H(d) ? (X(), Z("p", Wo, j(H(r)("student.loading")), 1)) : $("", !0),
					(X(), $r(_o, {
						key: H(i).id,
						api: e.api,
						identity: H(i),
						"on-session-expired": () => H(x)(!0)
					}, null, 8, [
						"api",
						"identity",
						"on-session-expired"
					])),
					H(u) ? (X(), Z(q, { key: 1 }, [
						H(o) ? (X(), Z("h3", Go, j(H(r)("student.itineraryTitle", { title: H(o).title })), 1)) : $("", !0),
						Q("p", null, [
							ci(j(H(r)("student.progressLabel")) + " ", 1),
							Q("strong", null, j(H(h)) + "/" + j(H(a).length), 1),
							ci(" " + j(H(r)("student.progressCompleted")), 1)
						]),
						H(h) ? (X(), Z("button", {
							key: 1,
							type: "button",
							class: "compact secondary history-toggle",
							"data-toggle-student-history": "true",
							"aria-pressed": H(l),
							onClick: n[6] ||= (e) => l.value = !H(l)
						}, j(H(r)(H(l) ? "student.hideHistory" : "student.showHistory")), 9, Ko)) : $("", !0),
						H(g).length ? (X(), Z("div", {
							key: 3,
							class: "student-table-scroll",
							tabindex: "0",
							role: "region",
							"aria-label": H(r)("student.subtitle")
						}, [Q("table", null, [Q("thead", null, [Q("tr", null, [
							Q("th", null, j(H(r)("common.activity")), 1),
							Q("th", null, j(H(r)("common.status")), 1),
							Q("th", null, j(H(r)("common.bestScore")), 1),
							Q("th", null, j(H(r)("common.lastScoreAt")), 1),
							Q("th", null, j(H(r)("student.openPlay")), 1)
						])]), Q("tbody", null, [(X(!0), Z(q, null, Xn(H(g), (e) => (X(), Z("tr", { key: e.id }, [
							Q("td", null, j(e.title || e.activity_id), 1),
							Q("td", null, j(H(r)(e.completed ? "student.done" : e.started ? "student.inProgress" : "student.pending")), 1),
							Q("td", null, j(e.best_score ?? ""), 1),
							Q("td", null, j(e.last_score_at || ""), 1),
							Q("td", null, [H(v)(e) ? e.app_id === "eduhoot" ? (X(), Z("button", {
								key: 1,
								type: "button",
								class: "compact secondary",
								"data-launch-eduhoot-assignment": e.id,
								disabled: H(_),
								onClick: (t) => H(C)(e)
							}, j(H(r)("student.openEduhoot")), 9, Xo)) : ["play", "edutictac-play"].includes(e.app_id) ? (X(), Z("button", {
								key: 2,
								type: "button",
								class: "compact secondary",
								"data-launch-play-assignment": e.id,
								disabled: H(_),
								onClick: (t) => H(C)(e)
							}, j(H(r)("student.openPlay")), 9, Zo)) : e.app_id === "resource" && String(e.activity_id).startsWith("teacher-upload:") ? (X(), Z("button", {
								key: 3,
								type: "button",
								class: "compact secondary",
								"data-launch-document-assignment": e.id,
								disabled: H(_),
								onClick: (t) => H(C)(e)
							}, j(H(r)("student.openResource")), 9, Qo)) : e.app_id === "resource" ? (X(), Z("button", {
								key: 4,
								type: "button",
								class: "compact secondary",
								"data-launch-resource-assignment": e.id,
								disabled: H(_),
								onClick: (t) => H(C)(e)
							}, j(H(r)("student.openResource")), 9, $o)) : $("", !0) : (X(), Z("small", Yo, j(H(r)("student.moduleDisabled")), 1))])
						]))), 128))])])], 8, Jo)) : (X(), Z("p", qo, j(H(r)("student.noPending")), 1))
					], 64)) : $("", !0)
				], 64)) : $("", !0),
				!H(i) && H(m) === "student.loadError" ? (X(), Z("button", {
					key: 4,
					type: "button",
					class: "secondary",
					disabled: H(d) || H(f),
					onClick: n[7] ||= (e) => H(x)(!0)
				}, j(H(r)("student.refresh")), 9, es)) : $("", !0)
			], 10, Mo)
		], 64));
	}
};
// services/portal/src/student/main.js
function ns(e, t) {
	return Ia(ts, t).mount(e);
}
export { ns as mountStudent };
