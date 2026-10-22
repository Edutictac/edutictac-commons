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
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", ee = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, w = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), T = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, te = /-\w/g, E = T((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, D = T((e) => e.replace(ne, "-$1").toLowerCase()), re = T((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = T((e) => e ? `on${re(e)}` : ""), O = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
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
}, ce, le = () => ce ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ue(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? me(r) : ue(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var de = /;(?![^(]*\))/g, fe = /:([^]+)/, pe = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function me(e) {
	let t = {};
	return e.replace(pe, (e) => e.startsWith("/*") ? "" : e).split(de).forEach((e) => {
		if (e) {
			let n = e.split(fe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function k(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = k(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var he = /* @__PURE__ */ e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function ge(e) {
	return !!e || e === "";
}
function _e(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = xe(e[i], t[i], n);
	return r;
}
function ve(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && xe(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function ye(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? ve(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !xe(e[r], t[r], n)) return !1;
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
function xe(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? be(e, t, n, _e) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : be(e, t, n, ye) : String(e) === String(t))));
}
var Se = (e) => !!(e && e.__v_isRef === !0), A = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Se(e) ? A(e.value) : JSON.stringify(e, Ce, 2) : String(e), Ce = (e, t) => Se(t) ? Ce(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[we(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => we(e)) } : _(t) ? we(t) : v(t) && !d(t) && !C(t) ? String(t) : t, we = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, j, Te = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && j && (j.active ? (this.parent = j, this.index = (j.scopes || (j.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = j;
			try {
				return j = this, e();
			} finally {
				j = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = j, j = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (j === this) j = this.prevScope;
			else {
				let e = j;
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
}, M, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, j && (j.active ? j.effects.push(this) : this.flags &= -2);
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
		let e = M, t = N;
		M = this, N = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), M = e, N = t, this.flags &= -3;
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
	let t = e.dep, n = M, r = N;
	M = e, N = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || O(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, N = r, Fe(e), e.flags &= -3;
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
var N = !0, Be = [];
function Ve() {
	Be.push(N), N = !1;
}
function He() {
	let e = Be.pop();
	N = e === void 0 || e;
}
function Ue(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = M;
		M = void 0;
		try {
			t();
		} finally {
			M = e;
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
		if (!M || !N || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new Ge(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
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
function P(e, t, n) {
	if (N && M) {
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
		let i = d(e), a = i && ee(n);
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
	let t = /* @__PURE__ */ L(e);
	return t === e || (P(t, "iterate", Ze), /* @__PURE__ */ Lt(e)) ? t : /* @__PURE__ */ I(e) ? /* @__PURE__ */ It(e) ? t.map((e) => Bt(R(e))) : t.map(Bt) : t.map(R);
}
function et(e) {
	return P(e = /* @__PURE__ */ L(e), "iterate", Ze), e;
}
function F(e, t) {
	return /* @__PURE__ */ I(e) ? Bt(/* @__PURE__ */ It(e) ? R(t) : t) : R(t);
}
var tt = {
	__proto__: null,
	[Symbol.iterator]() {
		return nt(this, Symbol.iterator, (e) => F(this, e));
	},
	concat(...e) {
		return $e(this).concat(...e.map((e) => d(e) ? $e(e) : e));
	},
	entries() {
		return nt(this, "entries", (e) => (e[1] = F(this, e[1]), e));
	},
	every(e, t) {
		return at(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return at(this, "filter", e, t, (e) => e.map((e) => F(this, e)), arguments);
	},
	find(e, t) {
		return at(this, "find", e, t, (e) => F(this, e), arguments);
	},
	findIndex(e, t) {
		return at(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return at(this, "findLast", e, t, (e) => F(this, e), arguments);
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
		return nt(this, "values", (e) => F(this, e));
	}
};
function nt(e, t, n) {
	let r = et(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ Lt(e)) {
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
	let o = et(e), s = o !== e && !/* @__PURE__ */ Lt(e), c = o[t];
	if (c !== it[t]) {
		let t = c.apply(e, a);
		return s ? R(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, F(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ot(e, t, n, r) {
	let i = et(e), a = i !== e && !/* @__PURE__ */ Lt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = F(e, t)), n.call(this, t, F(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? F(e, c) : c;
}
function st(e, t, n) {
	let r = /* @__PURE__ */ L(e);
	P(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Rt(n[0]) ? (n[0] = /* @__PURE__ */ L(n[0]), r[t](...n)) : i;
}
function ct(e, t, n = []) {
	Ve(), Me();
	let r = (/* @__PURE__ */ L(e))[t].apply(e, n);
	return Ne(), He(), r;
}
var lt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ut = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function dt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ L(this);
	return P(t, "has", e), t.hasOwnProperty(e);
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
		let o = Reflect.get(e, t, /* @__PURE__ */ z(e) ? e : n);
		if ((_(t) ? ut.has(t) : lt(t)) || (r || P(e, "get", t), i)) return o;
		if (/* @__PURE__ */ z(o)) {
			let e = a && ee(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Pt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Pt(o) : /* @__PURE__ */ Mt(o) : o;
	}
}, pt = class extends ft {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && ee(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ I(i);
			if (!/* @__PURE__ */ Lt(n) && !/* @__PURE__ */ I(n) && (i = /* @__PURE__ */ L(i), n = /* @__PURE__ */ L(n)), !a && /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ z(e) ? e : r);
		return e === /* @__PURE__ */ L(r) && s && (o ? O(n, i) && Qe(e, "set", t, n, i) : Qe(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Qe(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && ut.has(t) || P(e, "has", t), n;
	}
	ownKeys(e) {
		return P(e, "iterate", d(e) ? "length" : Ye), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ L(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? vt : t ? Bt : R;
		return !t && P(a, "iterate", l ? Xe : Ye), s(Object.create(u), { next() {
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
			let r = this.__v_raw, i = /* @__PURE__ */ L(r), a = /* @__PURE__ */ L(n);
			e || (O(n, a) && P(i, "get", n), P(i, "get", a));
			let { has: o } = yt(i), s = t ? vt : e ? Bt : R;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && P(/* @__PURE__ */ L(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ L(n), i = /* @__PURE__ */ L(t);
			return e || (O(t, i) && P(r, "has", t), P(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ L(a), s = t ? vt : e ? Bt : R;
			return !e && P(o, "iterate", Ye), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: xt("add"),
		set: xt("set"),
		delete: xt("delete"),
		clear: xt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ L(this), r = yt(n), i = /* @__PURE__ */ L(e), a = !t && !/* @__PURE__ */ Lt(e) && !/* @__PURE__ */ I(e) ? i : e;
			return r.has.call(n, a) || O(e, a) && r.has.call(n, e) || O(i, a) && r.has.call(n, i) || (n.add(a), Qe(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Lt(n) || /* @__PURE__ */ I(n) || (n = /* @__PURE__ */ L(n));
			let r = /* @__PURE__ */ L(this), { has: i, get: a } = yt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ L(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? O(n, s) && Qe(r, "set", e, n, s) : Qe(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ L(this), { has: n, get: r } = yt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ L(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Qe(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ L(this), t = e.size !== 0, n = e.clear();
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
	return /* @__PURE__ */ I(e) ? e : Ft(e, !1, ht, wt, Dt);
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
	return /* @__PURE__ */ I(e) ? /* @__PURE__ */ It(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function I(e) {
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
function L(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ L(t) : e;
}
function zt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
}
var R = (e) => v(e) ? /* @__PURE__ */ Mt(e) : e, Bt = (e) => v(e) ? /* @__PURE__ */ Pt(e) : e;
// @__NO_SIDE_EFFECTS__
function z(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	return Vt(e, !1);
}
function Vt(e, t) {
	return /* @__PURE__ */ z(e) ? e : new Ht(e, t);
}
var Ht = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ L(e), this._value = t ? e : R(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Lt(e) || /* @__PURE__ */ I(e);
		e = n ? e : /* @__PURE__ */ L(e), O(e, t) && (this._rawValue = e, this._value = n ? e : R(e), this.dep.trigger());
	}
};
function V(e) {
	return /* @__PURE__ */ z(e) ? e.value : e;
}
var Ut = {
	get: (e, t, n) => t === "__v_raw" ? e : V(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Wt(e) {
	return /* @__PURE__ */ It(e) ? e : new Proxy(e, Ut);
}
var Gt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return je(this, !0), !0;
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
function Kt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Gt(r, i, n);
}
function qt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ z(e)) qt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) qt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		qt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) qt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && qt(e[r], t, n);
	}
	return e;
}
// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Jt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Xt(e, t, n);
	}
}
function Yt(e, t, n, r) {
	if (h(e)) {
		let i = Jt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Xt(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Yt(e[a], t, n, r));
		return i;
	}
}
function Xt(e, n, r, i = !0) {
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
			Ve(), Jt(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	Zt(e, r, a, i, s);
}
function Zt(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var H = [], U = -1, W = [], Qt = null, $t = 0, en = /* @__PURE__ */ Promise.resolve(), tn = null;
function nn(e) {
	let t = tn || en;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function rn(e) {
	let t = U + 1, n = H.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = H[r], a = fn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function an(e) {
	if (!(e.flags & 1)) {
		let t = fn(e), n = H[H.length - 1];
		!n || !(e.flags & 2) && t >= fn(n) ? H.push(e) : H.splice(rn(t), 0, e), e.flags |= 1, on();
	}
}
function on() {
	tn ||= en.then(pn);
}
function sn(e) {
	if (!d(e)) Qt && e.id === -1 ? Qt.splice($t + 1, 0, e) : e.flags & 1 || (W.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) W.push(e[t]);
	on();
}
function cn(e, t, n, r = U + 1) {
	for (; r < H.length; r++) {
		let n = H[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			H.splice(r, 1), r = e ? r - 1 : U, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function ln(e, t, n = 0) {
	if (W.length) {
		let e = W, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < W.length; i++) {
				let a = W[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? W[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => fn(e) - fn(t));
		if (W.length = r, Qt) {
			for (let e = 0; e < i.length; e++) Qt.push(i[e]);
			return;
		}
		for (Qt = i, $t = 0; $t < Qt.length; $t++) {
			let e = Qt[$t];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Qt = null, $t = 0;
	}
}
var un = !1;
function dn(e, t) {
	if (un) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(W);
	e(), un = !0;
	try {
		cn(void 0, t), ln(void 0, n, t);
	} finally {
		un = !1;
	}
}
var fn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function pn(e) {
	try {
		for (U = 0; U < H.length; U++) {
			let e = H[U];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Jt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; U < H.length; U++) {
			let e = H[U];
			e && (e.flags &= -2);
		}
		U = -1, H.length = 0, ln(e), tn = null, (H.length || W.length) && pn(e);
	}
}
var G = null, mn = null;
function hn(e) {
	let t = G;
	return G = e, mn = e && e.type.__scopeId || null, t;
}
function gn(e, t = G, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && zr(-1);
		let i = hn(t), a = Ir.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ir.length; e > a; e--) Lr();
			hn(i), r._d && zr(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function _n(e, n) {
	if (G === null) return e;
	let r = yi(G), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && qt(o), i.push({
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
function vn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ve(), Yt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
var yn = /* @__PURE__ */ Symbol("_vte"), bn = (e) => e.__isTeleport, xn = /* @__PURE__ */ Symbol("_leaveCb");
function Sn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== J) {
			t = n;
			break;
		}
	}
	return t;
}
function Cn(e) {
	if (!Mn(e)) return bn(e.type) && e.children ? Sn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function wn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		wn(bn(n.type) && Cn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === q && d(e.children)) {
		let n = Qn(e.children, !1);
		n && wn(n, t);
	}
}
function Tn(e) {
	if (e.component) return Tn(e.component.subTree);
	if (e.type === q) {
		let t = d(e.children) && Qn(e.children, !1);
		return t ? Tn(t) : void 0;
	}
	if (e.type !== J) return e;
}
function En(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Dn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var On = /* @__PURE__ */ new WeakMap();
function kn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => kn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (jn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && kn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? yi(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ L(v), b = v === t ? i : (e) => !Dn(_, e) && u(y, e), x = (e, t) => !(t && Dn(_, t));
	if (m != null && m !== p) {
		if (An(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ z(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) Jt(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ z(p);
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
					i(), On.delete(e);
				};
				t.id = -1, On.set(e, t), K(t, r);
			} else An(e), i();
		}
	}
}
function An(e) {
	let t = On.get(e);
	t && (t.flags |= 8, On.delete(e));
}
le().requestIdleCallback, le().cancelIdleCallback;
var jn = (e) => !!e.type.__asyncLoader, Mn = (e) => e.type.__isKeepAlive;
function Nn(e, t, n = oi, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ve();
			let i = li(n), a = Yt(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Pn = (e) => (t, n = oi) => {
	fi && e !== "sp" || Nn(e, (...e) => t(...e), n);
}, Fn = Pn("m"), In = Pn("bum"), Ln = /* @__PURE__ */ Symbol.for("v-ndc");
function Rn(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ It(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Lt(e), s = /* @__PURE__ */ I(e), e = et(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Bt(R(e[n])) : R(e[n]) : e[n], n, void 0, a && a[n]);
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
var zn = (e) => e ? di(e) ? yi(e) : zn(e.parent) : null, Bn = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => zn(e.parent),
	$root: (e) => zn(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		an(e.update);
	},
	$nextTick: (e) => e.n ||= nn.bind(e.proxy),
	$watch: (e) => r
}), Vn = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), Hn = {
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
			else if (Vn(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = Bn[n], f, p;
		if (d) return n === "$attrs" && P(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Vn(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Vn(t, s) || u(a, s) || u(r, s) || u(Bn, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Un() {
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
var Wn = 0;
function Gn(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Un(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Wn++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Si,
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
					let u = l._ceVNode || Kr(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, yi(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (Yt(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Kn;
				Kn = l;
				try {
					return e();
				} finally {
					Kn = t;
				}
			}
		};
		return l;
	};
}
var Kn = null, qn = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${D(t)}Modifiers`];
function Jn(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && qn(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(se)));
	let c, l = i[c = ie(n)] || i[c = ie(E(n))];
	!l && o && (l = i[c = ie(D(n))]), l && Yt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Yt(u, e, 6, a);
	}
}
function Yn(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function Xn(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, D(t)) || u(e, t));
}
function Zn(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = hn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Zr(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Zr(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : $n(c);
		}
	} catch (t) {
		Ir.length = 0, Xt(t, e, 1), v = Kr(J);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = er(y, a)), b = Yr(b, y, !1, !0));
	}
	return n.dirs && (b = Yr(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && wn(bn(b.type) && Cn(b) || b, n.transition), v = b, hn(_), v;
}
function Qn(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (Hr(r)) {
			if (r.type !== J || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var $n = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, er = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function tr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? nr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (rr(o, r, n) && !Xn(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || nr(r, o, l) : !!o;
	return !1;
}
function nr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!u(e, a) || rr(t, e, a) && !Xn(n, a)) return !0;
	}
	return !1;
}
function rr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !xe(r, i) : r !== i;
}
function ir({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var ar = {}, or = () => Object.create(ar), sr = (e) => Object.getPrototypeOf(e) === ar;
function cr(e, t, n, r = !1) {
	let i = {}, a = or();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ur(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Nt(i) : e.type.props ? i : a, e.attrs = a;
}
function lr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ L(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Xn(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = E(o);
						i[t] = dr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		ur(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = D(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = dr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && Qe(e.attrs, "set", "");
}
function ur(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (w(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Xn(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ L(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = dr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function dr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = li(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === D(n)) && (r = !0));
	}
	return r;
}
function fr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = E(c[e]);
		pr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = E(e);
		if (pr(t)) {
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
function pr(e) {
	return e[0] !== "$" && !w(e);
}
var mr = (e) => e === "_" || e === "_ctx" || e === "$stable", hr = (e) => d(e) ? e.map(Zr) : [Zr(e)], gr = (e, t, n) => {
	if (t._n) return t;
	let r = gn((...e) => hr(t(...e)), n);
	return r._c = !1, r;
}, _r = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (mr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = gr(n, i, r);
		else if (i != null) {
			let e = hr(i);
			t[n] = () => e;
		}
	}
}, vr = (e, t) => {
	let n = hr(t);
	e.slots.default = () => n;
}, yr = (e, t, n) => {
	for (let r in t) (n || !mr(r)) && (e[r] = t[r]);
}, br = (e, t, n) => {
	let r = e.slots = or();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (yr(r, t, n), n && oe(r, "_", e, !0)) : _r(t, r);
	} else t && vr(e, t);
}, xr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : yr(a, n, r) : (o = !n.$stable, _r(n, a)), s = n;
	} else n && (vr(e, n), s = { default: 1 });
	if (o) for (let e in a) !mr(e) && s[e] == null && delete a[e];
}, K = Nr;
function Sr(e) {
	return Cr(e);
}
function Cr(e, i) {
	let a = le();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ur(e, t) && (i = ye(e), k(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Pr:
				y(e, t, r, i);
				break;
			case J:
				b(e, t, r, i);
				break;
			case Fr:
				e ?? x(t, r, i, s);
				break;
			case q:
				ie(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? ee(e, t, r, i, a, o, s, c, l) : f & 6 ? O(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, xe);
		}
		d != null && a ? kn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && kn(e.ref, null, o, e, !0);
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
	}, ee = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), ne(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, wr(e, a), s, u), _ && vn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !w(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && ti(f, r, e);
		}
		_ && vn(e, null, r, "beforeMount");
		let v = Er(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && K(() => {
			try {
				f && ti(f, r, e), v && g.enter(d), _ && vn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Mr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Qr(e[l]) : Zr(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Tr(r, !1), (g = h.onVnodeBeforeUpdate) && ti(g, r, n, e), f && vn(n, e, r, "beforeUpdate"), r && Tr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? D(e.dynamicChildren, d, l, r, i, wr(n, a), o) : s || de(e, n, l, null, r, i, wr(n, a), o, !1), u > 0) {
			if (u & 16) re(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && re(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && K(() => {
			g && ti(g, r, n, e), f && vn(n, e, r, "updated");
		}, i);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || jr(c), d = u && (c.type === q || !Ur(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, re = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !w(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (w(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ie = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Dr(e, t, !0)) : de(e, t, n, f, i, a, s, c, l);
	}, O = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : se(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = ai(e, r, i);
		if (Mn(e) && (s.ctx.renderer = xe), pi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o, a), !e.el) {
				let r = s.subTree = Kr(J);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (tr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ue(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = kr(e);
					if (n) {
						t && (t.el = c.el, ue(e, t, o)), n.asyncDep.then(() => {
							K(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Tr(e, !1), t ? (t.el = c.el, ue(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && ti(d, s, t, c), Tr(e, !0);
				let f = Zn(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && ir(e, f.el), r && K(r, i), (d = t.props && t.props.onVnodeUpdated) && K(() => ti(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = jn(t);
				if (Tr(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && ti(o, d, t), Tr(e, !0), s && A) {
					let t = () => {
						e.subTree = Zn(e), A(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Zn(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && K(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					K(() => ti(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && jn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && K(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => an(u), Tr(e, !0), l();
	}, ue = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, lr(e, t.props, r, n), xr(e, t.children, n), Ve(), cn(e), He();
	}, de = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				pe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ve(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? pe(l, d, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? Qr(t[p]) : Zr(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ve(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Qr(t[u]) : Zr(t[u]);
			if (Ur(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Qr(t[p]) : Zr(t[p]);
			if (Ur(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Qr(t[u]) : Zr(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) k(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Qr(t[u]) : Zr(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					k(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ur(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? k(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let ee = x ? Or(C) : n;
			for (_ = ee.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || jr(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== ee[_] ? me(n, r, p, 2) : _--);
			}
		}
	}, me = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) me(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, xe);
		else if (c === q) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) me(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === Fr) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[xn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), K(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[xn];
					a._isLeaving && a[xn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, k = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ve(), kn(s, null, n, e, !0), He()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !jn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ti(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && vn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, xe, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && ve(c, t, n), r && he(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && K(() => {
			_ && ti(_, t, e), h && vn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, he = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === q;
		if (a && !i) {
			ge(n, r);
			return;
		}
		if (t === Fr) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Tn(e) : e, c = () => {
			a ? m(n) && ge(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, ge = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, _e = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ar(c), Ar(l), r && ae(r), i.stop(), a ? (a.flags |= 8, k(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, k(o, e, t, n)), s && K(s, t), K(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) k(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[yn];
		return n ? h(n) : t;
	}, be = (e, t, n) => {
		dn(() => {
			e == null ? t._vnode && k(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : ii());
	}, xe = {
		p: v,
		um: k,
		m: me,
		r: he,
		mt: oe,
		mc: E,
		pc: de,
		pbc: D,
		n: ye,
		o: e
	}, Se, A;
	return i && ([Se, A] = i(xe)), {
		render: be,
		hydrate: Se,
		createApp: Gn(be, Se)
	};
}
function wr({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Tr({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Er(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Dr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Qr(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Dr(t, a)), a.type === Pr && (a.patchFlag === -1 && (a = i[e] = Qr(a)), a.el = t.el), a.type === J && !a.el && (a.el = t.el);
	}
}
function Or(e) {
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
function kr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : kr(t);
}
function Ar(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function jr(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? jr(t.subTree) : null;
}
var Mr = (e) => e.__isSuspense;
function Nr(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : sn(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), Pr = /* @__PURE__ */ Symbol.for("v-txt"), J = /* @__PURE__ */ Symbol.for("v-cmt"), Fr = /* @__PURE__ */ Symbol.for("v-stc"), Ir = [], Y = null;
function X(e = !1) {
	Ir.push(Y = e ? null : []);
}
function Lr() {
	Ir.pop(), Y = Ir[Ir.length - 1] || null;
}
var Rr = 1;
function zr(e, t = !1) {
	Rr += e, e < 0 && Y && t && (Y.hasOnce = !0);
}
function Br(e) {
	return e.dynamicChildren = Rr > 0 ? Y || n : null, Lr(), Rr > 0 && Y && Y.push(e), e;
}
function Z(e, t, n, r, i, a) {
	return Br(Q(e, t, n, r, i, a, !0));
}
function Vr(e, t, n, r, i) {
	return Br(Kr(e, t, n, r, i, !0));
}
function Hr(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ur(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Wr = ({ key: e }) => e ?? null, Gr = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ z(e) || h(e) ? {
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
		key: t && Wr(t),
		ref: t && Gr(t),
		scopeId: mn,
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
	return s ? ($r(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Rr > 0 && !o && Y && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Y.push(c), c;
}
var Kr = qr;
function qr(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Ln || (e = J), Hr(e)) {
		let r = Yr(e, t, !0);
		return n && $r(r, n), Rr > 0 && !a && Y && (r.shapeFlag & 6 ? Y[Y.indexOf(e)] = r : Y.push(r)), r.patchFlag = -2, r;
	}
	if (bi(e) && (e = e.__vccOpts), t) {
		t = Jr(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = k(e)), v(n) && (/* @__PURE__ */ Rt(n) && !d(n) && (n = s({}, n)), t.style = ue(n));
	}
	let o = g(e) ? 1 : Mr(e) ? 128 : bn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Q(e, t, n, r, i, o, a, !0);
}
function Jr(e) {
	return e ? /* @__PURE__ */ Rt(e) || sr(e) ? s({}, e) : e : null;
}
function Yr(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ei(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Wr(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Gr(t)) : [a, Gr(t)] : Gr(t) : a,
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
		ssContent: e.ssContent && Yr(e.ssContent),
		ssFallback: e.ssFallback && Yr(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && wn(u, c.clone(u)), u;
}
function Xr(e = " ", t = 0) {
	return Kr(Pr, null, e, t);
}
function $(e = "", t = !1) {
	return t ? (X(), Vr(J, null, e)) : Kr(J, null, e);
}
function Zr(e) {
	return e == null || typeof e == "boolean" ? Kr(J) : d(e) ? Kr(q, null, e.slice()) : Hr(e) ? Qr(e) : Kr(Pr, null, String(e));
}
function Qr(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Yr(e);
}
function $r(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), $r(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !sr(t) ? t._ctx = G : r === 3 && G && (G.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			$r(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: G
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Xr(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ei(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = ue([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ti(e, t, n, r = null) {
	Yt(e, t, 7, [n, r]);
}
var ni = Un(), ri = 0;
function ii() {
	return ri;
}
function ai(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || ni, o = {
		uid: ri++,
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
		scope: new Te(!0),
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
		propsOptions: fr(i, a),
		emitsOptions: Yn(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Jn.bind(null, o), e.ce && e.ce(o), o;
}
var oi = null, si, ci;
{
	let e = le(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	si = t("__VUE_INSTANCE_SETTERS__", (e) => oi = e), ci = t("__VUE_SSR_SETTERS__", (e) => fi = e);
}
var li = (e) => {
	let t = oi;
	return si(e), e.scope.on(), () => {
		e.scope.off(), si(t);
	};
}, ui = () => {
	oi && oi.scope.off(), si(null);
};
function di(e) {
	return e.vnode.shapeFlag & 4;
}
var fi = !1;
function pi(e, t = !1, n = !1) {
	t && ci(t);
	let { props: r, children: i } = e.vnode, a = di(e);
	cr(e, r, a, t), br(e, i, n || t);
	let o = a ? mi(e, t) : void 0;
	return t && ci(!1), o;
}
function mi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Hn);
	let { setup: r } = n;
	if (r) {
		Ve();
		let n = e.setupContext = r.length > 1 ? vi(e) : null, i = li(e), a = Jt(r, e, 0, [e.props, n]), o = y(a);
		if (He(), i(), (o || e.sp) && !jn(e) && En(e), o) {
			if (a.then(ui, ui), t) return a.then((n) => {
				ci(!0);
				try {
					hi(e, n, t);
				} finally {
					ci(!1);
				}
			}).catch((t) => {
				Xt(t, e, 0);
			});
			e.asyncDep = a;
		} else hi(e, a, t);
	} else gi(e, t);
}
function hi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Wt(t)), gi(e, n);
}
function gi(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var _i = { get(e, t) {
	return P(e, "get", ""), e[t];
} };
function vi(e) {
	return {
		attrs: new Proxy(e.attrs, _i),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function yi(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Wt(zt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Bn) return Bn[n](e);
		},
		has(e, t) {
			return t in e || t in Bn;
		}
	}) : e.proxy;
}
function bi(e) {
	return h(e) && "__vccOpts" in e;
}
var xi = (e, t) => /* @__PURE__ */ Kt(e, t, fi), Si = "3.5.44", Ci = void 0, wi = typeof window < "u" && window.trustedTypes;
if (wi) try {
	Ci = /* @__PURE__ */ wi.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ti = Ci ? (e) => Ci.createHTML(e) : (e) => e, Ei = "http://www.w3.org/2000/svg", Di = "http://www.w3.org/1998/Math/MathML", Oi = typeof document < "u" ? document : null, ki = Oi && /* @__PURE__ */ Oi.createElement("template"), Ai = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Oi.createElementNS(Ei, e) : t === "mathml" ? Oi.createElementNS(Di, e) : n ? Oi.createElement(e, { is: n }) : Oi.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Oi.createTextNode(e),
	createComment: (e) => Oi.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Oi.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			ki.innerHTML = Ti(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = ki.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, ji = /* @__PURE__ */ Symbol("_vtc");
function Mi(e, t, n) {
	let r = e[ji];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Ni = /* @__PURE__ */ Symbol("_vod"), Pi = /* @__PURE__ */ Symbol("_vsh"), Fi = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Ni] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Ii(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Ii(e, !0), r.enter(e)) : r.leave(e, () => {
			Ii(e, !1);
		}) : Ii(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Ii(e, t);
	}
};
function Ii(e, t) {
	e.style.display = t ? e[Ni] : "none", e[Pi] = !t;
}
var Li = /* @__PURE__ */ Symbol(""), Ri = /(?:^|;)\s*display\s*:/;
function zi(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Vi(r, t, "");
			}
			else for (let e in t) n[e] ?? Vi(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Vi(r, i, "") : Gi(e, i, !g(t) && t ? t[i] : void 0, o) || Vi(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Li];
			e && (n += ";" + e), r.cssText = n, a = Ri.test(n);
		}
	} else t && e.removeAttribute("style");
	Ni in e && (i && t === n || (e[Ni] = a ? r.display : ""), e[Pi] && (r.display = "none"));
}
var Bi = /\s*!important$/;
function Vi(e, t, n) {
	if (d(n)) n.forEach((n) => Vi(e, t, n));
	else if (n ??= "", t.startsWith("--")) Bi.test(n) ? e.setProperty(t, n.replace(Bi, ""), "important") : e.setProperty(t, n);
	else {
		let r = Wi(e, t);
		Bi.test(n) ? e.setProperty(D(r), n.replace(Bi, ""), "important") : e[r] = n;
	}
}
var Hi = [
	"Webkit",
	"Moz",
	"ms"
], Ui = {};
function Wi(e, t) {
	let n = Ui[t];
	if (n) return n;
	let r = E(t);
	if (r !== "filter" && r in e) return Ui[t] = r;
	r = re(r);
	for (let n = 0; n < Hi.length; n++) {
		let i = Hi[n] + r;
		if (i in e) return Ui[t] = i;
	}
	return t;
}
function Gi(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var Ki = "http://www.w3.org/1999/xlink";
function qi(e, t, n, r, i, a = he(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ki, t.slice(6, t.length)) : e.setAttributeNS(Ki, t, n) : n == null || a && !ge(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Ji(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ti(n) : n);
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
function Yi(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Xi(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Zi = /* @__PURE__ */ Symbol("_vei");
function Qi(e, t, n, r, i = null) {
	let a = e[Zi] || (e[Zi] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ta(t);
		r ? Yi(e, n, a[t] = aa(r, i), s) : o && (Xi(e, n, o, s), a[t] = void 0);
	}
}
var $i = /(Once|Passive|Capture)$/, ea = /^on:?(?:Once|Passive|Capture)$/;
function ta(e) {
	let t, n;
	for (; (n = e.match($i)) && !ea.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : D(e.slice(2)), t];
}
var na = 0, ra = /* @__PURE__ */ Promise.resolve(), ia = () => na ||= (ra.then(() => na = 0), Date.now());
function aa(e, t) {
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
				e && Yt(e, t, 5, a);
			}
		} else Yt(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ia(), n;
}
var oa = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, sa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Mi(e, r, c) : t === "style" ? zi(e, n, r) : a(t) ? o(t) || Qi(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ca(e, t, r, c)) ? (Ji(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || qi(e, t, r, c, s, t !== "value")) : e._isVueCE && (la(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Ji(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), qi(e, t, r, c));
};
function ca(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && oa(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return oa(t) && g(n) ? !1 : t in e;
}
function la(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var ua = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ae(t, e) : t;
};
function da(e) {
	e.target.composing = !0;
}
function fa(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var pa = /* @__PURE__ */ Symbol("_assign"), ma = /* @__PURE__ */ Symbol("_initialValue");
function ha(e, t, n) {
	return t && (e = e.trim()), n && (e = se(e)), e;
}
var ga = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[ma] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[ma] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[pa] = ua(i);
		let a = r || i.props && i.props.type === "number";
		Yi(e, t ? "change" : "input", (t) => {
			t.target.composing || e[pa](ha(e.value, n, a));
		}), (n || a) && Yi(e, "change", () => {
			e.value = ha(e.value, n, a);
		}), t || (Yi(e, "compositionstart", da), Yi(e, "compositionend", fa), Yi(e, "change", fa));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[ma];
		delete e[ma], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[pa](ha(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[pa] = ua(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? se(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, _a = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], va = {
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
	exact: (e, t) => _a.some((n) => e[`${n}Key`] && !t.includes(n))
}, ya = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = va[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, ba = /* @__PURE__ */ s({ patchProp: sa }, Ai), xa;
function Sa() {
	return xa ||= Sr(ba);
}
var Ca = ((...e) => {
	let t = Sa().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ta(e);
		if (!r) return;
		let i = t._component;
		h(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, wa(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function wa(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ta(e) {
	return g(e) ? document.querySelector(e) : e;
}
// services/portal/src/shared/usePortalTranslations.js
function Ea() {
	let e = /* @__PURE__ */ B(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), In(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
}
// services/portal/src/student/launch.js
function Da(e, t = window.location) {
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
function Oa(e, t, n, r = window.location) {
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
function ka(e) {
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
var Aa = /* @__PURE__ */ "🦊.🐱.🐶.🐼.🐧.🐸.🦉.🦄.🐰.🐢.🐙.🦁.🐨.🐝.🐯.🐻.🦕.🦖.🐉.🚀.🌈.⚽️.🏀.🏆.🎮.🎧.📚.🎨".split(".");
function ja(e, t) {
	let n = /* @__PURE__ */ B(null), r = /* @__PURE__ */ B([]), i = /* @__PURE__ */ B(null), a = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(""), c = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(!1), u = /* @__PURE__ */ B(!1), d = /* @__PURE__ */ B(!0), f = /* @__PURE__ */ B(!1), p = /* @__PURE__ */ B(""), m = 0, h = 0, g = 0, _ = !0, v = /* @__PURE__ */ new Set(), y = xi(() => r.value.filter((e) => e.completed).length), b = xi(() => c.value ? r.value : r.value.filter((e) => !e.completed)), x = xi(() => !l.value || d.value || f.value || u.value), S = (e) => _ && m === e;
	function C() {
		m++, h++, n.value = null, r.value = [], i.value = null, o.value = "", s.value = "", c.value = !1, l.value = !1, u.value = !1;
		for (let e of v) e.close();
		v.clear();
	}
	function ee() {
		C(), p.value = "student.sessionExpired", t();
	}
	function w(e) {
		let t = {
			"edutictac-play": "play",
			play: "play",
			eduhoot: "eduhoot",
			resource: "recursos"
		}[e.app_id];
		return !t || !a.value || a.value.includes(t);
	}
	async function T(a = !1) {
		if (!a && (!n.value || d.value || f.value)) return;
		let o = m, s = ++h, c = n.value?.id;
		u.value = !0, l.value = !1, r.value = [], i.value = null, p.value = "";
		try {
			let u = await e("/api/student/dashboard", { method: "GET" });
			if (!S(o) || s !== h) return;
			if (!u.identity?.id || c && u.identity.id !== c || !Array.isArray(u.assignments)) throw Error("invalid_dashboard");
			n.value = u.identity, r.value = u.assignments, i.value = u.selected_itinerary || null, l.value = !0, a && (t(), ka(n.value));
		} catch (e) {
			if (!S(o) || s !== h) return;
			e.status === 401 ? a && !c ? (C(), p.value = "") : ee() : p.value = "student.loadError";
		} finally {
			S(o) && s === h && (u.value = !1);
		}
	}
	async function te() {
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
			n.value = o.identity, t(), ka(n.value) || await T(!0);
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
	async function E() {
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
	async function ne(t) {
		if (x.value || !Aa.includes(t)) return;
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
			S(r) && (e.status === 401 ? ee() : p.value = "student.iconError");
		} finally {
			_ && (f.value = !1);
		}
	}
	async function D(t) {
		if (x.value || !w(t) || !r.value.includes(t)) return;
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
			if (!S(n) || !w(t)) return;
			if (!o.token) throw Error("invalid_launch");
			if (!i) {
				window.location.assign(Oa(t, o.token, window.i18nPortal.getLang()));
				return;
			}
			let s;
			if (String(t.activity_id).startsWith("teacher-upload:")) s = new URL(`/api/student/activity-assignments/${encodeURIComponent(t.id)}/resource`, window.location.origin), s.searchParams.set("launch_token", o.token), s = s.toString();
			else {
				if (s = Da(t.launch_url), !s) {
					let r = await e("/resources-api/resources?" + new URLSearchParams({
						q: t.activity_id,
						limit: "50"
					}), { method: "GET" });
					if (!S(n) || !w(t)) return;
					let i = (r.items || []).find((e) => e.external_id === t.activity_id);
					s = Da(i?.play_url || i?.source_url || i?.reuse_url || i?.download_url);
				}
				if (!s) throw Error("missing_resource");
			}
			if (!S(n) || !w(t)) return;
			if (a.closed) throw Error("closed_popup");
			a.location.replace(s), v.delete(a), a = null, r.value = r.value.map((e) => e.id === t.id ? {
				...e,
				started: !0
			} : e);
		} catch (e) {
			S(n) && (e.status === 401 ? ee() : p.value = "student.launchError");
		} finally {
			a && (v.delete(a), a.close()), _ && (f.value = !1);
		}
	}
	function re() {
		document.getElementById("studentOutput")?.setAttribute("hidden", ""), C(), g++, d.value = !1;
	}
	async function ie(e) {
		if (e.persisted) {
			let e = ++g;
			d.value = !0, await T(!0), _ && e === g && (d.value = !1, document.getElementById("studentOutput")?.removeAttribute("hidden"));
		}
	}
	let O = () => {
		document.visibilityState === "visible" && n.value && !d.value && !f.value && T();
	};
	return Fn(async () => {
		let t = ++g;
		window.addEventListener("pagehide", re), window.addEventListener("pageshow", ie), window.addEventListener("focus", O), document.addEventListener("visibilitychange", O), e("/api/modules/status", { method: "GET" }).then((e) => {
			_ && Array.isArray(e.enabled) && (a.value = e.enabled);
		}).catch(() => {}), await T(!0), _ && t === g && (d.value = !1);
	}), In(() => {
		_ = !1, C(), window.removeEventListener("pagehide", re), window.removeEventListener("pageshow", ie), window.removeEventListener("focus", O), document.removeEventListener("visibilitychange", O);
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
		enabled: w,
		login: te,
		logout: E,
		load: T,
		icon: ne,
		launch: D
	};
}
// services/portal/src/student/StudentPanel.vue
var Ma = { class: "panel-heading" }, Na = { class: "eyebrow" }, Pa = { class: "grid-fields" }, Fa = ["disabled"], Ia = ["disabled"], La = { class: "actions" }, Ra = ["disabled"], za = {
	id: "studentSessionActions",
	class: "actions"
}, Ba = ["disabled"], Va = ["aria-busy"], Ha = {
	key: 0,
	role: "status"
}, Ua = ["disabled"], Wa = { key: 2 }, Ga = ["aria-label"], Ka = { class: "student-profile__summary" }, qa = {
	class: "student-profile__icon",
	"aria-hidden": "true"
}, Ja = { class: "muted" }, Ya = ["aria-label"], Xa = [
	"data-student-icon",
	"aria-pressed",
	"title",
	"disabled",
	"onClick"
], Za = { class: "actions" }, Qa = ["disabled"], $a = {
	key: 0,
	role: "status"
}, eo = {
	key: 0,
	"data-student-itinerary": ""
}, to = ["aria-pressed"], no = {
	key: 2,
	class: "empty"
}, ro = ["aria-label"], io = { key: 0 }, ao = [
	"data-launch-eduhoot-assignment",
	"disabled",
	"onClick"
], oo = [
	"data-launch-play-assignment",
	"disabled",
	"onClick"
], so = [
	"data-launch-document-assignment",
	"disabled",
	"onClick"
], co = [
	"data-launch-resource-assignment",
	"disabled",
	"onClick"
], lo = ["disabled"], uo = {
	__name: "StudentPanel",
	props: {
		api: Function,
		onSessionChanged: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ea(), { identity: i, assignments: a, itinerary: o, code: s, pin: c, history: l, ready: u, loading: d, authPending: f, writing: p, feedback: m, completed: h, visible: g, disabled: _, enabled: v, login: y, logout: b, load: x, icon: S, launch: C } = ja(n.api, n.onSessionChanged);
		return t({ logout: b }), (e, t) => (X(), Z(q, null, [
			_n(Q("form", {
				id: "studentLoginPanel",
				onSubmit: t[2] ||= ya((...e) => V(y) && V(y)(...e), ["prevent"])
			}, [
				Q("div", Ma, [Q("p", Na, A(V(r)("student.access")), 1), Q("h3", null, A(V(r)("student.loginTitle")), 1)]),
				Q("div", Pa, [Q("label", null, [Q("span", null, A(V(r)("student.codeLabel")), 1), _n(Q("input", {
					id: "studentCode",
					"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ z(s) ? s.value = e : null,
					type: "text",
					maxlength: "3",
					placeholder: "K7P",
					autocomplete: "off",
					autocapitalize: "characters",
					spellcheck: "false",
					disabled: V(f)
				}, null, 8, Fa), [[ga, V(s)]])]), Q("label", null, [Q("span", null, A(V(r)("student.pinLabel")), 1), _n(Q("input", {
					id: "studentPin",
					"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ z(c) ? c.value = e : null,
					type: "password",
					inputmode: "numeric",
					maxlength: "6",
					autocomplete: "off",
					disabled: V(f)
				}, null, 8, Ia), [[ga, V(c)]])])]),
				Q("div", La, [Q("button", {
					id: "studentLogin",
					type: "submit",
					disabled: V(f) || V(p) || V(m) === "student.logoutError"
				}, A(V(r)("student.login")), 9, Ra)])
			], 544), [[Fi, !V(i)]]),
			_n(Q("div", za, [Q("button", {
				id: "studentLogout",
				type: "button",
				class: "secondary",
				disabled: V(f),
				onClick: t[3] ||= (...e) => V(b) && V(b)(...e)
			}, A(V(r)("student.logout")), 9, Ba)], 512), [[Fi, V(i)]]),
			Q("div", {
				id: "studentOutput",
				class: k(["output", { empty: !V(i) }]),
				"aria-busy": V(d) || V(f) || V(p)
			}, [
				V(m) ? (X(), Z("p", Ha, A(V(r)(V(m))), 1)) : $("", !0),
				V(m) === "student.logoutError" ? (X(), Z("button", {
					key: 1,
					type: "button",
					disabled: V(f),
					onClick: t[4] ||= (...e) => V(b) && V(b)(...e)
				}, A(V(r)("student.logout")), 9, Ua)) : $("", !0),
				!V(i) && !V(m) ? (X(), Z("p", Wa, A(V(r)("student.loginPrompt")), 1)) : $("", !0),
				V(i) ? (X(), Z(q, { key: 3 }, [
					Q("section", {
						class: "student-profile",
						"aria-label": V(r)("student.profileAria")
					}, [Q("div", Ka, [Q("span", qa, A(V(i).avatar_icon || "🙂"), 1), Q("div", null, [Q("p", null, [
						Xr(A(V(r)("student.hello")) + " ", 1),
						Q("strong", null, A(V(i).public_code), 1),
						t[8] ||= Xr(".", -1)
					]), Q("p", Ja, A(V(r)("student.iconHint")), 1)])]), Q("div", {
						class: "student-icon-picker",
						role: "group",
						"aria-label": V(r)("student.iconPickerAria")
					}, [(X(!0), Z(q, null, Rn(V(Aa), (e) => (X(), Z("button", {
						key: e,
						type: "button",
						class: k(["student-icon", { selected: V(i).avatar_icon === e }]),
						"data-student-icon": e,
						"aria-pressed": V(i).avatar_icon === e,
						title: V(r)("student.chooseIcon") + " " + e,
						disabled: V(_),
						onClick: (t) => V(S)(e)
					}, A(e), 11, Xa))), 128))], 8, Ya)], 8, Ga),
					Q("div", Za, [Q("button", {
						id: "refreshStudent",
						type: "button",
						class: "secondary compact",
						disabled: V(f) || V(p) || V(d),
						onClick: t[5] ||= (e) => V(x)()
					}, A(V(r)("student.refresh")), 9, Qa)]),
					V(d) ? (X(), Z("p", $a, A(V(r)("student.loading")), 1)) : $("", !0),
					V(u) ? (X(), Z(q, { key: 1 }, [
						V(o) ? (X(), Z("h3", eo, A(V(r)("student.itineraryTitle", { title: V(o).title })), 1)) : $("", !0),
						Q("p", null, [
							Xr(A(V(r)("student.progressLabel")) + " ", 1),
							Q("strong", null, A(V(h)) + "/" + A(V(a).length), 1),
							Xr(" " + A(V(r)("student.progressCompleted")), 1)
						]),
						V(h) ? (X(), Z("button", {
							key: 1,
							type: "button",
							class: "compact secondary history-toggle",
							"data-toggle-student-history": "true",
							"aria-pressed": V(l),
							onClick: t[6] ||= (e) => l.value = !V(l)
						}, A(V(r)(V(l) ? "student.hideHistory" : "student.showHistory")), 9, to)) : $("", !0),
						V(g).length ? (X(), Z("div", {
							key: 3,
							class: "student-table-scroll",
							tabindex: "0",
							role: "region",
							"aria-label": V(r)("student.subtitle")
						}, [Q("table", null, [Q("thead", null, [Q("tr", null, [
							Q("th", null, A(V(r)("common.activity")), 1),
							Q("th", null, A(V(r)("common.status")), 1),
							Q("th", null, A(V(r)("common.bestScore")), 1),
							Q("th", null, A(V(r)("common.lastScoreAt")), 1),
							Q("th", null, A(V(r)("student.openPlay")), 1)
						])]), Q("tbody", null, [(X(!0), Z(q, null, Rn(V(g), (e) => (X(), Z("tr", { key: e.id }, [
							Q("td", null, A(e.title || e.activity_id), 1),
							Q("td", null, A(V(r)(e.completed ? "student.done" : e.started ? "student.inProgress" : "student.pending")), 1),
							Q("td", null, A(e.best_score ?? ""), 1),
							Q("td", null, A(e.last_score_at || ""), 1),
							Q("td", null, [V(v)(e) ? e.app_id === "eduhoot" ? (X(), Z("button", {
								key: 1,
								type: "button",
								class: "compact secondary",
								"data-launch-eduhoot-assignment": e.id,
								disabled: V(_),
								onClick: (t) => V(C)(e)
							}, A(V(r)("student.openEduhoot")), 9, ao)) : ["play", "edutictac-play"].includes(e.app_id) ? (X(), Z("button", {
								key: 2,
								type: "button",
								class: "compact secondary",
								"data-launch-play-assignment": e.id,
								disabled: V(_),
								onClick: (t) => V(C)(e)
							}, A(V(r)("student.openPlay")), 9, oo)) : e.app_id === "resource" && String(e.activity_id).startsWith("teacher-upload:") ? (X(), Z("button", {
								key: 3,
								type: "button",
								class: "compact secondary",
								"data-launch-document-assignment": e.id,
								disabled: V(_),
								onClick: (t) => V(C)(e)
							}, A(V(r)("student.openResource")), 9, so)) : e.app_id === "resource" ? (X(), Z("button", {
								key: 4,
								type: "button",
								class: "compact secondary",
								"data-launch-resource-assignment": e.id,
								disabled: V(_),
								onClick: (t) => V(C)(e)
							}, A(V(r)("student.openResource")), 9, co)) : $("", !0) : (X(), Z("small", io, A(V(r)("student.moduleDisabled")), 1))])
						]))), 128))])])], 8, ro)) : (X(), Z("p", no, A(V(r)("student.noPending")), 1))
					], 64)) : $("", !0)
				], 64)) : $("", !0),
				!V(i) && V(m) === "student.loadError" ? (X(), Z("button", {
					key: 4,
					type: "button",
					class: "secondary",
					disabled: V(d) || V(f),
					onClick: t[7] ||= (e) => V(x)(!0)
				}, A(V(r)("student.refresh")), 9, lo)) : $("", !0)
			], 10, Va)
		], 64));
	}
};
// services/portal/src/student/main.js
function fo(e, t) {
	return Ca(uo, t).mount(e);
}
export { fo as mountStudent };
