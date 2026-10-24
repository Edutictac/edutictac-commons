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
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), T = (e) => {
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
};
function Ee() {
	return j;
}
var M, De = /* @__PURE__ */ new WeakSet(), Oe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, j && (j.active ? j.effects.push(this) : this.flags &= -2);
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
		this.flags |= 2, We(this), Fe(this);
		let e = M, t = N;
		M = this, N = !0;
		try {
			return this.fn();
		} finally {
			Ie(this), M = e, N = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) ze(e);
			this.deps = this.depsTail = void 0, We(this), this.onStop && this.onStop(), this.flags &= -2;
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
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ge) || (e.globalVersion = Ge, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Le(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = M, r = N;
	M = e, N = !0;
	try {
		Fe(e);
		let n = e.fn(e._value);
		(t.version === 0 || O(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, N = r, Ie(e), e.flags &= -3;
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
var N = !0, Ve = [];
function He() {
	Ve.push(N), N = !1;
}
function Ue() {
	let e = Ve.pop();
	N = e === void 0 || e;
}
function We(e) {
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
var Ge = 0, Ke = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, qe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!M || !N || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new Ke(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, Je(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ge++, this.notify(e);
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
	if (N && M) {
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
	if (Ne(), t === "clear") o.forEach(s);
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
	Pe();
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
	He(), Ne();
	let r = (/* @__PURE__ */ I(e))[t].apply(e, n);
	return Pe(), Ue(), r;
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
		return e === /* @__PURE__ */ I(r) && s && (o ? O(n, i) && $e(e, "set", t, n, i) : $e(e, "add", t, n)), s;
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
			e || (O(n, a) && P(i, "get", n), P(i, "get", a));
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
			return e || (O(t, i) && P(r, "has", t), P(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
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
			return r.has.call(n, a) || O(e, a) && r.has.call(n, e) || O(i, a) && r.has.call(n, i) || (n.add(a), $e(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ F(n) || /* @__PURE__ */ zt(n) || (n = /* @__PURE__ */ I(n));
			let r = /* @__PURE__ */ I(this), { has: i, get: a } = xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ I(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? O(n, s) && $e(r, "set", e, n, s) : $e(r, "add", e, n), this;
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
	return !u(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
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
		e = n ? e : /* @__PURE__ */ I(e), O(e, t) && (this._rawValue = e, this._value = n ? e : L(e), this.dep.trigger());
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
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return Me(this, !0), !0;
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
	let x = Ee(), S = () => {
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
				if (e || o || y || (b ? t.some((e, t) => O(e, C[t])) : O(t, C))) {
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
	return u && u(w), m = new Oe(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => $t(e, !1, m), _ = m.onStop = () => {
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
// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
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
		r._d && ci(-1);
		let i = wn(t), a = ai.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ai.length; e > a; e--) oi();
			wn(i), r._d && ci(1);
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
	if (r || mr) {
		let i = mr ? mr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
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
		e.i = p, K(e, p && p.suspense);
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
			Nn.set(e, t), K(t, a);
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
			if (o === "svg" || Rn(p) ? o = "svg" : (o === "mathml" || zn(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), Yr(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Hn(t, n, r, l, 1);
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
		for (let n of e) if (n.type !== ri) {
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
	else if (e.transition = t, e.type === q && d(e.children)) {
		let n = br(e.children, !1);
		n && Xn(n, t);
	}
}
function Zn(e) {
	if (e.component) return Zn(e.component.subTree);
	if (e.type === q) {
		let t = d(e.children) && br(e.children, !1);
		return t ? Zn(t) : void 0;
	}
	if (e.type !== ri) return e;
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
				t.id = -1, er.set(e, t), K(t, r);
			} else nr(e), i();
		}
	}
}
function nr(e) {
	let t = er.get(e);
	t && (t.flags |= 8, er.delete(e));
}
le().requestIdleCallback, le().cancelIdleCallback;
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
var W = ((e) => (t, n = ki) => {
	Ii || ar(e, (...e) => t(...e), n);
})("bum"), or = /* @__PURE__ */ Symbol.for("v-ndc");
function G(e, t, n, r) {
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
var sr = (e) => e ? Fi(e) ? Ui(e) : sr(e.parent) : null, cr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
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
		mn(e.update);
	},
	$nextTick: (e) => e.n ||= fn.bind(e.proxy),
	$watch: (e) => r
}), lr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), ur = {
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
			else if (lr(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = cr[n], f, p;
		if (d) return n === "$attrs" && P(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return lr(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || lr(t, s) || u(a, s) || u(r, s) || u(cr, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function dr() {
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
var fr = 0;
function pr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = dr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: fr++,
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
					let u = l._ceVNode || hi(n, r);
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
				let t = mr;
				mr = l;
				try {
					return e();
				} finally {
					mr = t;
				}
			}
		};
		return l;
	};
}
var mr = null, hr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${D(t)}Modifiers`];
function gr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && hr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(se)));
	let c, l = i[c = ie(n)] || i[c = ie(E(n))];
	!l && o && (l = i[c = ie(D(n))]), l && rn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, rn(u, e, 6, a);
	}
}
function _r(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function vr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, D(t)) || u(e, t));
}
function yr(e) {
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
			}) : e(f, null)), y = t.props ? c : xr(c);
		}
	} catch (t) {
		ai.length = 0, an(t, e, 1), v = hi(ri);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Sr(y, a)), b = vi(b, y, !1, !0));
	}
	return n.dirs && (b = vi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Xn(Fn(b.type) && Yn(b) || b, n.transition), v = b, wn(_), v;
}
function br(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (di(r)) {
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
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Sr = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
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
		if (!u(e, a) || Tr(t, e, a) && !vr(n, a)) return !0;
	}
	return !1;
}
function Tr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !xe(r, i) : r !== i;
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
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ I(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (vr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = E(o);
						i[t] = Nr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Mr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = D(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Nr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && $e(e.attrs, "set", "");
}
function Mr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ee(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : vr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ I(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Nr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Nr(e, t, n, r, i, a) {
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === D(n)) && (r = !0));
	}
	return r;
}
function Pr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = E(c[e]);
		Fr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = E(e);
		if (Fr(t)) {
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
function Fr(e) {
	return e[0] !== "$" && !ee(e);
}
var Ir = (e) => e === "_" || e === "_ctx" || e === "$stable", Lr = (e) => d(e) ? e.map(bi) : [bi(e)], Rr = (e, t, n) => {
	if (t._n) return t;
	let r = Tn((...e) => Lr(t(...e)), n);
	return r._c = !1, r;
}, zr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ir(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Rr(n, i, r);
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
}, Ur = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Vr(a, n, r) : (o = !n.$stable, zr(n, a)), s = n;
	} else n && (Br(e, n), s = { default: 1 });
	if (o) for (let e in a) !Ir(e) && s[e] == null && delete a[e];
}, K = ti;
function Wr(e) {
	return Gr(e);
}
function Gr(e, i) {
	let a = le();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !fi(e, t) && (i = ye(e), k(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case ni:
				y(e, t, r, i);
				break;
			case ri:
				b(e, t, r, i);
				break;
			case ii:
				e ?? x(t, r, i, s);
				break;
			case q:
				ie(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? O(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, xe);
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
				n && n._beginPatch(), ne(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, Kr(e, a), s, u), _ && Dn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && wi(f, r, e);
		}
		_ && Dn(e, null, r, "beforeMount");
		let v = Jr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && K(() => {
			try {
				f && wi(f, r, e), v && g.enter(d), _ && Dn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ei(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? xi(e[l]) : bi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && qr(r, !1), (g = h.onVnodeBeforeUpdate) && wi(g, r, n, e), f && Dn(n, e, r, "beforeUpdate"), r && qr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? D(e.dynamicChildren, d, l, r, i, Kr(n, a), o) : s || de(e, n, l, null, r, i, Kr(n, a), o, !1), u > 0) {
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
			g && wi(g, r, n, e), f && Dn(n, e, r, "updated");
		}, i);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || $r(c), d = u && (c.type === q || !fi(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, re = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ee(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ee(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ie = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Yr(e, t, !0)) : de(e, t, n, f, i, a, s, c, l);
	}, O = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : se(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = Oi(e, r, i);
		if (ir(e) && (s.ctx.renderer = xe), Li(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o, a), !e.el) {
				let r = s.subTree = hi(ri);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (Cr(e, t, n)) {
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
					let n = Zr(e);
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
				qr(e, !1), t ? (t.el = c.el, ue(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && wi(d, s, t, c), qr(e, !0);
				let f = yr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && Er(e, f.el), r && K(r, i), (d = t.props && t.props.onVnodeUpdated) && K(() => wi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = rr(t);
				if (qr(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && wi(o, d, t), qr(e, !0), s && A) {
					let t = () => {
						e.subTree = yr(e), A(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = yr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && K(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					K(() => wi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && rr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && K(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Oe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => mn(u), qr(e, !0), l();
	}, ue = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, jr(e, t.props, r, n), Ur(e, t.children, n), He(), _n(e), Ue();
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
			let n = t[p] = l ? xi(t[p]) : bi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ve(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? xi(t[u]) : bi(t[u]);
			if (fi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? xi(t[p]) : bi(t[p]);
			if (fi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? xi(t[u]) : bi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) k(e[u], a, o, !0), u++;
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
					k(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && fi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? k(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Xr(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || $r(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? me(n, r, p, 2) : _--);
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
		} else if (c === ii) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[qn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), K(() => l.enter(a), i));
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
	}, k = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (He(), tr(s, null, n, e, !0), Ue()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !rr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && wi(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Dn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, xe, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && ve(c, t, n), r && he(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && K(() => {
			_ && wi(_, t, e), h && Dn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, he = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === q;
		if (a && !i) {
			ge(n, r);
			return;
		}
		if (t === ii) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Zn(e) : e, c = () => {
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
		Qr(c), Qr(l), r && ae(r), i.stop(), a ? (a.flags |= 8, k(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, k(o, e, t, n)), s && K(s, t), K(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) k(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Pn];
		return n ? h(n) : t;
	}, be = (e, t, n) => {
		bn(() => {
			e == null ? t._vnode && k(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Di());
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
		createApp: pr(be, Se)
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
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = xi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Yr(t, a)), a.type === ni && (a.patchFlag === -1 && (a = i[e] = xi(a)), a.el = t.el), a.type === ri && !a.el && (a.el = t.el);
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
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : gn(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), ni = /* @__PURE__ */ Symbol.for("v-txt"), ri = /* @__PURE__ */ Symbol.for("v-cmt"), ii = /* @__PURE__ */ Symbol.for("v-stc"), ai = [], J = null;
function Y(e = !1) {
	ai.push(J = e ? null : []);
}
function oi() {
	ai.pop(), J = ai[ai.length - 1] || null;
}
var si = 1;
function ci(e, t = !1) {
	si += e, e < 0 && J && t && (J.hasOnce = !0);
}
function li(e) {
	return e.dynamicChildren = si > 0 ? J || n : null, oi(), si > 0 && J && J.push(e), e;
}
function X(e, t, n, r, i, a) {
	return li(Z(e, t, n, r, i, a, !0));
}
function ui(e, t, n, r, i) {
	return li(hi(e, t, n, r, i, !0));
}
function di(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function fi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var pi = ({ key: e }) => e ?? null, mi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ R(e) || h(e) ? {
	i: U,
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
		key: t && pi(t),
		ref: t && mi(t),
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
	return s ? (Si(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), si > 0 && !o && J && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && J.push(c), c;
}
var hi = gi;
function gi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== or || (e = ri), di(e)) {
		let r = vi(e, t, !0);
		return n && Si(r, n), si > 0 && !a && J && (r.shapeFlag & 6 ? J[J.indexOf(e)] = r : J.push(r)), r.patchFlag = -2, r;
	}
	if (Wi(e) && (e = e.__vccOpts), t) {
		t = _i(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = k(e)), v(n) && (/* @__PURE__ */ Bt(n) && !d(n) && (n = s({}, n)), t.style = ue(n));
	}
	let o = g(e) ? 1 : ei(e) ? 128 : Fn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function _i(e) {
	return e ? /* @__PURE__ */ Bt(e) || kr(e) ? s({}, e) : e : null;
}
function vi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ci(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && pi(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(mi(t)) : [a, mi(t)] : mi(t) : a,
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
		ssContent: e.ssContent && vi(e.ssContent),
		ssFallback: e.ssFallback && vi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Xn(u, c.clone(u)), u;
}
function yi(e = " ", t = 0) {
	return hi(ni, null, e, t);
}
function Q(e = "", t = !1) {
	return t ? (Y(), ui(ri, null, e)) : hi(ri, null, e);
}
function bi(e) {
	return e == null || typeof e == "boolean" ? hi(ri) : d(e) ? hi(q, null, e.slice()) : di(e) ? xi(e) : hi(ni, null, String(e));
}
function xi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : vi(e);
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
			!r && !kr(t) ? t._ctx = U : r === 3 && U && (U.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
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
	} else t = String(t), r & 64 ? (n = 16, t = [yi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ci(...e) {
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
function wi(e, t, n, r = null) {
	rn(e, t, 7, [n, r]);
}
var Ti = dr(), Ei = 0;
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
		propsOptions: Pr(i, a),
		emitsOptions: _r(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = gr.bind(null, o), e.ce && e.ce(o), o;
}
var ki = null, Ai = () => ki || U, ji, Mi;
{
	let e = le(), t = (t, n) => {
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
			if (n in cr) return cr[n](e);
		},
		has(e, t) {
			return t in e || t in cr;
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
		sa.test(n) ? e.setProperty(D(r), n.replace(sa, ""), "important") : e[r] = n;
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
	let r = E(t);
	if (r !== "filter" && r in e) return ua[t] = r;
	r = re(r);
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
function ma(e, t, n, r, i, a = he(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(pa, t.slice(6, t.length)) : e.setAttributeNS(pa, t, n) : n == null || a && !ge(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
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
		r === "boolean" ? n = ge(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : D(e.slice(2)), t];
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
	t === "class" ? ta(e, r, c) : t === "style" ? oa(e, n, r) : a(t) ? o(t) || ya(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ka(e, t, r, c)) ? (ha(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || ma(e, t, r, c, s, t !== "value")) : e._isVueCE && (Aa(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ha(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ma(e, t, r, c));
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
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var ja = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ae(t, e) : t;
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
	return t && (e = e.trim()), n && (e = se(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? se(e.value) : e.value, c = t ?? "";
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
	return Ha ||= Wr(Va);
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
	return W(() => {
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
	return window.addEventListener("edutictac:langchange", t), W(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
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
		}), (e, t) => (Y(), X(q, null, [
			Z("form", {
				class: "grid-fields",
				onSubmit: t[2] ||= Ba((...e) => B(h) && B(h)(...e), ["prevent"])
			}, [Z("label", null, [Z("span", null, A(B(r)("teacher.itineraryTitleLabel")), 1), En(Z("input", {
				id: "itineraryTitle",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ R(o) ? o.value = e : null,
				type: "text",
				disabled: !B(i).teacher || !B(i).group || B(l),
				placeholder: B(r)("teacher.itineraryTitlePlaceholder")
			}, null, 8, Ya), [[La, B(o)]])]), Z("div", Xa, [Z("button", {
				id: "createItinerary",
				type: "submit",
				disabled: B(f)
			}, A(B(r)("teacher.createItinerary")), 9, Za), Z("button", {
				id: "loadItineraries",
				type: "button",
				class: "secondary",
				disabled: !B(i).teacher || !B(i).group || B(l),
				onClick: t[1] ||= (...e) => B(m) && B(m)(...e)
			}, A(B(r)("teacher.loadItineraries")), 9, Qa)])], 32),
			Z("p", $a, A(B(r)("teacher.itineraryHint")), 1),
			Z("div", {
				id: "itinerariesOutput",
				class: k(["output", { empty: !B(a).length }]),
				"aria-busy": B(c) || B(l)
			}, [
				B(u) ? (Y(), X("p", to, A(B(r)(B(u))), 1)) : Q("", !0),
				!B(i).teacher || !B(i).group ? (Y(), X("p", no, A(B(r)("teacher.itinerariesEmpty")), 1)) : B(c) && !B(a).length ? (Y(), X("p", ro, A(B(r)("teacher.itinerary.loading")), 1)) : B(s) && !B(a).length ? (Y(), X("p", io, A(B(r)("teacher.itinerariesEmptyList")), 1)) : Q("", !0),
				B(a).length ? (Y(), X(q, { key: 4 }, [
					Z("p", ao, A(B(r)("teacher.itinerary.selectionHint")), 1),
					B(d) ? (Y(), X("button", {
						key: 0,
						class: "compact secondary",
						type: "button",
						"data-clear-group-itinerary": "",
						disabled: B(f),
						onClick: t[3] ||= (e) => B(v)(null)
					}, A(B(r)("teacher.itinerary.clearSelection")), 9, oo)) : (Y(), X("p", so, A(B(r)("teacher.itinerary.noSelection")), 1)),
					Z("div", co, [(Y(!0), X(q, null, G(B(a), (e) => (Y(), X("article", {
						key: e.id,
						class: "card itinerary-card"
					}, [
						Z("strong", null, A(e.title), 1),
						e.is_selected ? (Y(), X("small", lo, A(B(r)("teacher.itinerary.selected")), 1)) : (Y(), X("button", {
							key: 1,
							class: "compact secondary",
							type: "button",
							"data-select-group-itinerary": e.id,
							"aria-label": B(r)("teacher.itinerary.selectLabel", { title: e.title }),
							disabled: B(f),
							onClick: (t) => B(v)(e.id)
						}, A(B(r)("teacher.itinerary.select")), 9, uo)),
						Z("small", null, A(B(r)("teacher.itinerarySteps", { count: e.items.length })), 1),
						Z("ol", null, [(Y(!0), X(q, null, G(e.items, (t, n) => (Y(), X("li", { key: t.assignment_id }, [Z("span", null, A(B(y)(t.assignment_id)), 1), Z("div", fo, [(Y(), X(q, null, G([
							"up",
							"down",
							"remove"
						], (i) => Z("button", {
							key: i,
							class: "compact secondary",
							type: "button",
							"data-edit-itinerary": e.id,
							"data-itinerary-assignment": t.assignment_id,
							"data-itinerary-action": i,
							"aria-label": B(r)(`teacher.itinerary.${i}Label`, { title: B(y)(t.assignment_id) }),
							disabled: B(f) || i === "up" && n === 0 || i === "down" && n === e.items.length - 1,
							onClick: (n) => B(g)(e, t.assignment_id, i)
						}, A(B(r)(`teacher.itinerary.${i}`)), 9, po)), 64))])]))), 128))]),
						Z("small", null, A(B(r)("teacher.itinerary.removeHint")), 1),
						B(i).assignment ? (Y(), X("button", {
							key: 2,
							class: "compact secondary",
							type: "button",
							"data-add-itinerary-item": e.id,
							disabled: B(f),
							onClick: (t) => B(_)(e)
						}, A(B(r)("teacher.addSelectedActivity")), 9, mo)) : (Y(), X("small", ho, A(B(r)("teacher.selectAssignmentHint")), 1))
					]))), 128))])
				], 64)) : Q("", !0)
			], 10, eo)
		], 64));
	}
}, _o = ["aria-label", "aria-busy"], vo = {
	key: 0,
	role: "alert"
}, yo = { key: 0 }, bo = { key: 1 }, xo = { key: 2 }, So = [
	"data-select-group",
	"aria-pressed",
	"disabled",
	"onClick"
], Co = { class: "actions" }, wo = ["disabled"], To = {
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
		return t({ setContext: l }), W(() => {
			c = !1, s++;
		}), (e, t) => (Y(), X("section", {
			"aria-label": B(r)("teacher.groups"),
			"aria-busy": a.value
		}, [
			Z("h3", null, A(B(r)("teacher.groups")), 1),
			o.value ? (Y(), X("p", vo, A(B(r)(o.value)), 1)) : Q("", !0),
			Z("div", { class: k(["output", { empty: !i.value.teacher || !i.value.groups.length }]) }, [i.value.teacher ? i.value.groups.length ? (Y(), X("table", xo, [Z("thead", null, [Z("tr", null, [
				Z("th", null, A(B(r)("teacher.groupOpaque")), 1),
				Z("th", null, A(B(r)("teacher.tenant")), 1),
				Z("th", null, A(B(r)("teacher.active")), 1),
				Z("th", null, A(B(r)("common.select")), 1)
			])]), Z("tbody", null, [(Y(!0), X(q, null, G(i.value.groups, (e) => (Y(), X("tr", { key: e.id }, [
				Z("td", null, A(e.name), 1),
				Z("td", null, A(e.tenant_id), 1),
				Z("td", null, A(e.active ?? 0), 1),
				Z("td", null, [Z("button", {
					type: "button",
					class: "compact secondary",
					"data-select-group": e.id,
					"aria-pressed": i.value.group?.id === e.id,
					disabled: a.value,
					onClick: (t) => d(e.id)
				}, A(B(r)("common.select")), 9, So)])
			]))), 128))])])) : (Y(), X("p", bo, A(B(r)("common.tableEmpty")), 1)) : (Y(), X("p", yo, A(B(r)("teacher.errors.loginFirst")), 1))], 2),
			Z("div", Co, [Z("button", {
				id: "deleteGroup",
				type: "button",
				class: "danger",
				disabled: !i.value.teacher || !i.value.group || a.value,
				onClick: f
			}, A(B(r)("teacher.deleteGroup")), 9, wo)])
		], 8, _o));
	}
}, Eo = { class: "hint" }, Do = ["placeholder", "disabled"], Oo = { class: "actions" }, ko = ["disabled"], Ao = ["disabled"], jo = ["aria-busy"], Mo = {
	key: 0,
	role: "alert"
}, No = {
	key: 1,
	role: "status"
}, Po = { key: 2 }, Fo = { key: 3 }, Io = { key: 4 }, Lo = { key: 5 }, Ro = {
	key: 0,
	class: "actions"
}, zo = [
	"data-make-owner",
	"disabled",
	"onClick"
], Bo = [
	"data-remove-member",
	"disabled",
	"onClick"
], Vo = {
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
		}), W(() => {
			m = !1, p++;
		}), (e, t) => (Y(), X(q, null, [
			Z("p", Eo, A(B(r)("teacher.membersHint")), 1),
			Z("form", {
				class: "grid-fields",
				onSubmit: Ba(x, ["prevent"])
			}, [Z("label", null, [Z("span", null, A(B(r)("teacher.memberIdLabel")), 1), En(Z("input", {
				id: "memberTeacherId",
				"onUpdate:modelValue": t[0] ||= (e) => o.value = e,
				type: "text",
				maxlength: "128",
				placeholder: B(r)("teacher.memberIdPlaceholder"),
				autocomplete: "off",
				disabled: f.value || l.value
			}, null, 8, Do), [[La, o.value]])]), Z("div", Oo, [Z("button", {
				id: "addGroupMember",
				type: "submit",
				class: "secondary",
				disabled: f.value || l.value
			}, A(B(r)("teacher.addMember")), 9, ko), Z("button", {
				id: "loadGroupMembers",
				type: "button",
				class: "secondary",
				disabled: f.value,
				onClick: b
			}, A(B(r)("teacher.loadMembers")), 9, Ao)])], 32),
			Z("div", {
				id: "membersOutput",
				class: k(["output", { empty: !c.value }]),
				"aria-busy": s.value
			}, [
				u.value ? (Y(), X("p", Mo, A(B(r)(u.value)), 1)) : Q("", !0),
				d.value ? (Y(), X("p", No, A(d.value), 1)) : Q("", !0),
				!i.value.teacher || !i.value.group ? (Y(), X("p", Po, A(B(r)("teacher.membersEmpty")), 1)) : !c.value && !u.value ? (Y(), X("p", Fo, A(B(r)("teacher.membersPrompt")), 1)) : c.value && !a.value.length ? (Y(), X("p", Io, A(B(r)("common.tableEmpty")), 1)) : Q("", !0),
				a.value.length ? (Y(), X("table", Lo, [Z("thead", null, [Z("tr", null, [
					Z("th", null, A(B(r)("teacher.memberIdLabel")), 1),
					Z("th", null, A(B(r)("common.status")), 1),
					Z("th", null, A(B(r)("common.date")), 1),
					Z("th", null, A(B(r)("teacher.memberActions")), 1)
				])]), Z("tbody", null, [(Y(!0), X(q, null, G(a.value, (e) => (Y(), X("tr", { key: e.teacher_id }, [
					Z("td", null, A(e.teacher_id), 1),
					Z("td", null, A(B(r)(e.role === "owner" ? "teacher.roleOwner" : "teacher.roleTeacher")), 1),
					Z("td", null, A(e.created_at), 1),
					Z("td", null, [e.role === "owner" ? Q("", !0) : (Y(), X("div", Ro, [Z("button", {
						type: "button",
						class: "compact secondary",
						"data-make-owner": e.teacher_id,
						disabled: f.value || l.value,
						onClick: (t) => C(e)
					}, A(B(r)("teacher.makeOwner")), 9, zo), Z("button", {
						type: "button",
						class: "compact danger",
						"data-remove-member": e.teacher_id,
						disabled: f.value || l.value,
						onClick: (t) => S(e)
					}, A(B(r)("teacher.removeMember")), 9, Bo)]))])
				]))), 128))])])) : Q("", !0)
			], 10, jo)
		], 64));
	}
};
// services/portal/src/teacher/useCredentials.js
function Ho({ api: e, onCreated: t, onRefresh: n, onSessionExpired: r }) {
	let i = /* @__PURE__ */ Ut({
		teacher: !1,
		group: null,
		identities: [],
		groups: []
	}), a = /* @__PURE__ */ z("centre"), o = /* @__PURE__ */ z(6), s = /* @__PURE__ */ z(6), c = /* @__PURE__ */ z([]), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z(""), f = $(() => i.value.teacher ? i.value.identities.filter((e) => !i.value.group || e.group_id === i.value.group.id) : []), p = $(() => !i.value.teacher || l.value || u.value), m = 0, h = !0;
	function g() {
		c.value = [], d.value = "";
	}
	function _(e) {
		if (e.teacher !== i.value.teacher || e.group?.id !== i.value.group?.id) m++, g(), l.value = !1, u.value = !1;
		else if (e.identities !== i.value.identities) {
			u.value = !1;
			let t = new Set(e.identities.filter((e) => e.active !== 0 && e.active !== !1).map((e) => e.id));
			c.value = c.value.filter((e) => t.has(e.id));
		}
		i.value = e;
	}
	function v(e) {
		e.status === 401 ? (r(), d.value = "teacher.errors.loginFirst") : (u.value = !0, [403, 404].includes(e.status) ? (g(), d.value = "teacher.groupAccessUnavailable") : d.value = "teacher.credentialsOperationError");
	}
	async function y(e) {
		try {
			await n();
		} catch (t) {
			if (!e.current()) return;
			[
				401,
				403,
				404
			].includes(t.status) ? v(t) : (u.value = !0, d.value = "teacher.credentialsRefreshError");
		}
	}
	async function b(e) {
		if (p.value) return;
		let t = {
			version: m,
			current() {
				return h && this.version === m && i.value.teacher;
			},
			adopt() {
				this.version = m, l.value = !0;
			}
		};
		l.value = !0, d.value = "";
		try {
			await e(t);
		} catch (e) {
			t.current() && v(e);
		} finally {
			h && t.version === m && (l.value = !1);
		}
	}
	function x(e) {
		if (!e.group?.id || !Array.isArray(e.identities) || e.identities.length > 120 || e.identities.some((e) => !e.id || typeof e.public_code != "string" || !/^\d{4}(\d{2})?$/.test(e.pin))) throw Error("invalid_batch");
		return e.identities.map(({ id: e, public_code: t, pin: n }) => ({
			id: e,
			public_code: t,
			pin: n
		}));
	}
	function S() {
		if (!Number.isInteger(o.value) || o.value < 1 || o.value > 30) d.value = "teacher.credentialsCountError";
		else return b(async (n) => {
			let r = await e("/api/identities/batch", {
				method: "POST",
				body: JSON.stringify({
					tenant_id: a.value.trim() || "centre",
					count: o.value,
					pin_length: 4
				})
			});
			if (!n.current()) return;
			let i = x(r);
			t({
				group: r.group,
				count: i.length
			}), n.adopt(), c.value = i, d.value = "teacher.groupCreated", await y(n);
		});
	}
	function C() {
		if (!i.value.group) return;
		if (!Number.isInteger(s.value) || s.value < 1 || s.value > 120) {
			d.value = "teacher.credentialsCountError";
			return;
		}
		let t = i.value.group.id;
		return b(async (n) => {
			let r = await e(`/api/teacher/groups/${encodeURIComponent(t)}/identities`, {
				method: "POST",
				body: JSON.stringify({
					count: s.value,
					pin_length: 4
				})
			});
			if (!n.current()) return;
			let i = x(r);
			if (r.group.id !== t) throw Error("wrong_group");
			c.value = i, d.value = "teacher.credentialsAdded", await y(n);
		});
	}
	function w(t) {
		return b(async (n) => {
			c.value = c.value.filter((e) => e.id !== t.id);
			let r = await e(`/api/identities/${encodeURIComponent(t.id)}/regenerate-pin`, { method: "POST" });
			if (n.current()) {
				if (r.id !== t.id || !/^\d{4}(\d{2})?$/.test(r.pin)) throw Error("invalid_pin");
				c.value = [...c.value, {
					id: t.id,
					public_code: t.public_code,
					pin: r.pin
				}], d.value = "teacher.pinRegenerated", await y(n);
			}
		});
	}
	function ee(t, n) {
		if (n) return b(async (n) => {
			c.value = c.value.filter((e) => e.id !== t.id), await e(`/api/identities/${encodeURIComponent(t.id)}/revoke`, { method: "POST" }), n.current() && (d.value = "teacher.credentialsRevoked", await y(n));
		});
	}
	function T() {
		m++, g(), l.value = !1;
	}
	return window.addEventListener("pagehide", T), W(() => {
		h = !1, T(), window.removeEventListener("pagehide", T);
	}), {
		context: i,
		tenant: a,
		count: o,
		additionalCount: s,
		fresh: c,
		pending: l,
		blocked: u,
		feedback: d,
		identities: f,
		unavailable: p,
		setContext: _,
		create: S,
		add: C,
		regenerate: w,
		revoke: ee
	};
}
// services/portal/src/teacher/credentialExports.js
function Uo(e, t) {
	let n = (e) => {
		let t = String(e);
		return /^[=+@-]/.test(t) && (t = "'" + t), "\"" + t.replaceAll("\"", "\"\"") + "\"";
	}, r = [["codi", "pin"], ...e.map((e) => [e.public_code, e.pin])], i = URL.createObjectURL(new Blob([r.map((e) => e.map(n).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" })), a = document.createElement("a");
	a.href = i, a.download = `edutictac-${String(t || "grup").replace(/[^\p{L}\p{N}_-]/gu, "-").slice(0, 80)}.csv`, document.body.append(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 1e3);
}
function Wo(e, t, n) {
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
var Go = ["disabled"], Ko = ["disabled"], qo = { class: "actions" }, Jo = ["disabled"], Yo = ["role"], Xo = { key: 0 }, Zo = { key: 1 }, Qo = ["aria-label"], $o = { class: "pin-notice" }, es = ["aria-label"], ts = ["disabled"], ns = ["disabled"], rs = { class: "cards" }, is = ["aria-busy"], as = { key: 0 }, os = { key: 1 }, ss = { key: 2 }, cs = { class: "inline-actions" }, ls = [
	"data-regenerate-pin",
	"disabled",
	"onClick"
], us = [
	"data-revoke-identity",
	"disabled",
	"onClick"
], ds = { class: "subsection-heading" }, fs = { class: "eyebrow" }, ps = ["disabled"], ms = { class: "actions" }, hs = ["disabled"], gs = {
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
		window.addEventListener("pagehide", a), W(() => window.removeEventListener("pagehide", a));
		let { context: o, tenant: s, count: c, additionalCount: l, fresh: u, pending: d, feedback: f, identities: p, unavailable: m, setContext: h, create: g, add: _, regenerate: v, revoke: y } = Ho(n);
		function b() {
			Wo(u.value, o.value.group?.group_code, r) || (f.value = "teacher.credentialsPopupBlocked");
		}
		function x(e) {
			y(e, confirm(r("teacher.confirmRevoke", { label: e.public_code })));
		}
		return t({ setContext: h }), (e, t) => (Y(), X(q, null, [Z("form", {
			class: "grid-fields",
			onSubmit: t[2] ||= Ba((...e) => B(g) && B(g)(...e), ["prevent"])
		}, [
			Z("label", null, [Z("span", null, A(B(r)("teacher.tenantLabel")), 1), En(Z("input", {
				id: "tenantId",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ R(s) ? s.value = e : null,
				type: "text",
				maxlength: "200",
				disabled: B(m)
			}, null, 8, Go), [[La, B(s)]])]),
			Z("label", null, [Z("span", null, A(B(r)("common.students")), 1), En(Z("input", {
				id: "identityCount",
				"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ R(c) ? c.value = e : null,
				type: "number",
				min: "1",
				max: "30",
				required: "",
				disabled: B(m)
			}, null, 8, Ko), [[
				La,
				B(c),
				void 0,
				{ number: !0 }
			]])]),
			Z("div", qo, [Z("button", {
				id: "createBatch",
				type: "submit",
				disabled: B(m)
			}, A(B(r)("teacher.generateCredentials")), 9, Jo)])
		], 32), (Y(), ui(Wn, { to: "#credentialsDetails" }, [
			B(f) ? (Y(), X("p", {
				key: 0,
				role: B(f).includes("Error") || B(f).includes("Unavailable") || B(f).includes("loginFirst") || B(f).includes("Blocked") ? "alert" : "status"
			}, [yi(A(B(r)(B(f))) + " ", 1), B(f) === "teacher.groupCreated" ? (Y(), X("strong", Xo, A(B(o).group?.group_code), 1)) : B(f) === "teacher.pinRegenerated" ? (Y(), X("strong", Zo, A(B(u).at(-1)?.public_code), 1)) : Q("", !0)], 8, Yo)) : Q("", !0),
			B(o).teacher && B(u).length ? (Y(), X("section", {
				key: 1,
				id: "freshCredentials",
				ref_key: "freshPanel",
				ref: i,
				"aria-label": B(r)("teacher.generateCredentials")
			}, [
				Z("p", $o, A(B(r)("teacher.credentialsFreshHint")), 1),
				Z("div", {
					class: "export-actions",
					"aria-label": B(r)("teacher.exports")
				}, [Z("button", {
					type: "button",
					class: "secondary",
					"data-print-batch": "",
					disabled: B(d),
					onClick: b
				}, A(B(r)("teacher.printBatch")), 9, ts), Z("button", {
					type: "button",
					class: "secondary",
					"data-download-batch-csv": "",
					disabled: B(d),
					onClick: t[3] ||= (e) => B(Uo)(B(u), B(o).group?.group_code)
				}, A(B(r)("teacher.downloadBatchCsv")), 9, ns)], 8, es),
				Z("div", rs, [(Y(!0), X(q, null, G(B(u), (e) => (Y(), X("article", {
					key: e.id,
					class: "credential"
				}, [Z("strong", null, A(e.public_code), 1), Z("span", null, "PIN " + A(e.pin), 1)]))), 128))])
			], 8, Qo)) : Q("", !0),
			Z("section", {
				id: "credentialsOutput",
				class: k(["output", { empty: !B(o).teacher || !B(p).length }]),
				"aria-busy": B(d)
			}, [Z("h3", null, A(B(o).group ? B(r)("teacher.activeCredentials") : B(r)("teacher.recentCredentials")), 1), B(o).teacher ? B(p).length ? (Y(), X("table", ss, [Z("thead", null, [Z("tr", null, [
				Z("th", null, A(B(r)("common.code")), 1),
				Z("th", null, A(B(r)("common.group")), 1),
				Z("th", null, A(B(r)("teacher.pinUpdated")), 1),
				Z("th", null, A(B(r)("teacher.credentialActions")), 1)
			])]), Z("tbody", null, [(Y(!0), X(q, null, G(B(p), (e) => (Y(), X("tr", { key: e.id }, [
				Z("td", null, A(e.public_code), 1),
				Z("td", null, A(B(o).groups.find((t) => t.id === e.group_id)?.name || e.group_name || e.group_id), 1),
				Z("td", null, A(e.pin_rotated_at || ""), 1),
				Z("td", null, [Z("div", cs, [Z("button", {
					type: "button",
					class: "compact secondary",
					"data-regenerate-pin": e.id,
					disabled: B(m),
					onClick: (t) => B(v)(e)
				}, A(B(r)("teacher.regeneratePin")), 9, ls), Z("button", {
					type: "button",
					class: "compact danger",
					"data-revoke-identity": e.id,
					disabled: B(m),
					onClick: (t) => x(e)
				}, A(B(r)("teacher.revoke")), 9, us)])])
			]))), 128))])])) : (Y(), X("p", os, A(B(r)("common.tableEmpty")), 1)) : (Y(), X("p", as, A(B(r)("teacher.errors.loginFirst")), 1))], 10, is),
			Z("div", ds, [Z("span", fs, A(B(r)("teacher.groupTools")), 1)]),
			Z("form", {
				class: "grid-fields",
				onSubmit: t[5] ||= Ba((...e) => B(_) && B(_)(...e), ["prevent"])
			}, [Z("label", null, [Z("span", null, A(B(r)("teacher.addStudentsCount")), 1), En(Z("input", {
				id: "additionalIdentityCount",
				"onUpdate:modelValue": t[4] ||= (e) => /* @__PURE__ */ R(l) ? l.value = e : null,
				type: "number",
				min: "1",
				max: "120",
				required: "",
				disabled: B(m) || !B(o).group
			}, null, 8, ps), [[
				La,
				B(l),
				void 0,
				{ number: !0 }
			]])]), Z("div", ms, [Z("button", {
				id: "addGroupIdentities",
				type: "submit",
				class: "secondary",
				disabled: B(m) || !B(o).group
			}, A(B(r)("teacher.addStudents")), 9, hs)])], 32)
		]))], 64));
	}
}, _s = ["aria-busy"], vs = {
	key: 0,
	role: "alert"
}, ys = { key: 1 }, bs = { key: 0 }, xs = { class: "teacher-context" }, Ss = { key: 0 }, Cs = { key: 0 }, ws = ["aria-label"], Ts = ["href"], Es = ["href"], Ds = ["href"], Os = { key: 0 }, ks = { key: 2 }, As = { key: 3 }, js = [
	"data-select-assignment",
	"aria-pressed",
	"disabled",
	"onClick"
], Ms = {
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
		}), W(() => {
			c = !1, s++;
		}), (e, t) => (Y(), X("section", {
			id: "teacherOutput",
			class: k(["output", { empty: !i.value.teacher }]),
			"aria-busy": a.value || i.value.teacher && !i.value.dataReady
		}, [o.value ? (Y(), X("p", vs, A(B(r)(o.value)), 1)) : Q("", !0), i.value.teacher ? (Y(), X(q, { key: 2 }, [
			i.value.summary ? (Y(), X("p", bs, [Z("strong", null, A(i.value.summary.active || 0), 1), yi(" " + A(B(r)("teacher.activeOfTotal", { total: i.value.summary.total || 0 })), 1)])) : Q("", !0),
			Z("div", xs, [
				Z("p", null, [yi(A(B(r)(i.value.group ? "teacher.groupSelected" : "teacher.noGroupSelected")) + " ", 1), i.value.group ? (Y(), X("strong", Ss, A(i.value.group.group_code || i.value.group.name), 1)) : Q("", !0)]),
				Z("p", null, [yi(A(B(r)(i.value.assignment ? "teacher.activitySelected" : "teacher.noActivitySelected")) + " ", 1), i.value.assignment && i.value.dataReady ? (Y(), X("strong", Cs, A(i.value.assignments.find((e) => e.id === i.value.assignment.id)?.title || ""), 1)) : Q("", !0)]),
				Z("div", {
					class: "export-actions",
					"aria-label": B(r)("teacher.exports")
				}, [i.value.group ? (Y(), X(q, { key: 0 }, [Z("a", {
					class: "button-link",
					href: `/api/groups/${encodeURIComponent(i.value.group.id)}/cards`,
					target: "_blank",
					rel: "noopener"
				}, A(B(r)("teacher.cards")), 9, Ts), Z("a", {
					class: "button-link secondary",
					href: `/api/groups/${encodeURIComponent(i.value.group.id)}/csv`,
					target: "_blank",
					rel: "noopener"
				}, A(B(r)("teacher.csvCodes")), 9, Es)], 64)) : Q("", !0), Z("a", {
					class: "button-link secondary",
					href: "/api/teacher/stats.csv" + (i.value.group ? "?group_id=" + encodeURIComponent(i.value.group.id) : ""),
					target: "_blank",
					rel: "noopener"
				}, A(B(r)("teacher.csvStats")), 9, Ds)], 8, ws)
			]),
			Z("h3", null, A(B(r)("teacher.assignments")), 1),
			i.value.dataReady ? i.value.assignments.length ? (Y(), X("table", As, [Z("thead", null, [Z("tr", null, [
				Z("th", null, A(B(r)("common.title")), 1),
				Z("th", null, A(B(r)("common.group")), 1),
				Z("th", null, A(B(r)("common.activity")), 1),
				Z("th", null, A(B(r)("common.select")), 1)
			])]), Z("tbody", null, [(Y(!0), X(q, null, G(i.value.assignments, (e) => (Y(), X("tr", { key: e.id }, [
				Z("td", null, A(e.title), 1),
				Z("td", null, A(i.value.groups.find((t) => t.id === e.group_id)?.name || e.group_id), 1),
				Z("td", null, A(e.activity_id), 1),
				Z("td", null, [Z("button", {
					type: "button",
					class: "compact secondary",
					"data-select-assignment": e.id,
					"aria-pressed": i.value.assignment?.id === e.id,
					disabled: a.value,
					onClick: (t) => d(e.id)
				}, A(B(r)("common.select")), 9, js)])
			]))), 128))])])) : (Y(), X("p", ks, A(B(r)("common.tableEmpty")), 1)) : (Y(), X(q, { key: 1 }, [o.value ? Q("", !0) : (Y(), X("p", Os, A(B(r)("teacher.assignmentsLoading")), 1))], 64))
		], 64)) : (Y(), X("p", ys, A(B(r)("teacher.errors.loginFirst")), 1))], 10, _s));
	}
};
// services/portal/src/teacher/useResults.js
function Ns(e, t) {
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
	return W(() => {
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
var Ps = { class: "actions" }, Fs = ["disabled"], Is = ["disabled"], Ls = ["aria-busy"], Rs = {
	key: 0,
	role: "alert"
}, zs = { key: 1 }, Bs = {
	key: 2,
	role: "status"
}, Vs = { key: 3 }, Hs = {
	key: 0,
	class: "hint"
}, Us = { key: 1 }, Ws = { key: 2 }, Gs = [
	"data-mark-completed",
	"data-unmark-completed",
	"disabled",
	"onClick"
], Ks = { key: 3 }, qs = {
	__name: "ResultsPanel",
	props: {
		api: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), { context: i, assignment: a, rows: o, mode: s, ready: c, loading: l, pending: u, feedback: d, unavailable: f, setContext: p, load: m, complete: h } = Ns(n.api, n.onSessionExpired);
		return t({ setContext: p }), (e, t) => (Y(), X(q, null, [Z("div", Ps, [Z("button", {
			id: "loadResults",
			type: "button",
			disabled: B(f),
			onClick: t[0] ||= (e) => B(m)("results")
		}, A(B(r)("teacher.viewResults")), 9, Fs), Z("button", {
			id: "loadRanking",
			type: "button",
			class: "secondary",
			disabled: B(f),
			onClick: t[1] ||= (e) => B(m)("ranking")
		}, A(B(r)("teacher.viewRanking")), 9, Is)]), Z("div", {
			id: "resultsOutput",
			class: k(["output", { empty: !B(c) }]),
			"aria-busy": B(l) || B(u)
		}, [
			B(d) ? (Y(), X("p", Rs, A(B(r)(B(d))), 1)) : Q("", !0),
			B(i).teacher && B(a) && B(i).dataReady ? (Y(), X("p", zs, [Z("strong", null, A(B(a).title || B(a).activity_id), 1)])) : Q("", !0),
			B(l) ? (Y(), X("p", Bs, A(B(r)("teacher.resultsLoading")), 1)) : !B(c) && !B(d) ? (Y(), X("p", Vs, A(B(r)("teacher.resultsPlaceholder")), 1)) : Q("", !0),
			B(i).teacher && B(a) && B(i).dataReady && B(c) ? (Y(), X(q, { key: 4 }, [B(s) === "ranking" ? (Y(), X("p", Hs, A(B(r)("teacher.activityRanking")), 1)) : Q("", !0), B(o).length ? B(s) === "results" ? (Y(), X("table", Ws, [Z("thead", null, [Z("tr", null, [
				Z("th", null, A(B(r)("common.code")), 1),
				Z("th", null, A(B(r)("common.attempts")), 1),
				Z("th", null, A(B(r)("common.bestScore")), 1),
				Z("th", null, A(B(r)("common.lastScoreAt")), 1),
				Z("th", null, A(B(r)("common.status")), 1),
				Z("th", null, A(B(r)("teacher.markCompleted")), 1)
			])]), Z("tbody", null, [(Y(!0), X(q, null, G(B(o), (e) => (Y(), X("tr", { key: e.identity_id }, [
				Z("td", null, A(e.public_code), 1),
				Z("td", null, A(e.attempts), 1),
				Z("td", null, A(e.best_score ?? ""), 1),
				Z("td", null, A(e.last_score_at || ""), 1),
				Z("td", null, A(B(r)(e.completed ? "student.done" : "student.pending")), 1),
				Z("td", null, [Z("button", {
					type: "button",
					class: "compact secondary",
					"data-mark-completed": e.completed ? void 0 : B(a).id + ":" + e.identity_id,
					"data-unmark-completed": e.completed ? B(a).id + ":" + e.identity_id : void 0,
					disabled: B(f) || B(l),
					onClick: (t) => B(h)(e)
				}, A(B(r)(e.completed ? "teacher.unmarkCompleted" : "teacher.markCompleted")), 9, Gs)])
			]))), 128))])])) : (Y(), X("table", Ks, [Z("thead", null, [Z("tr", null, [
				Z("th", null, A(B(r)("common.code")), 1),
				Z("th", null, A(B(r)("common.score")), 1),
				Z("th", null, A(B(r)("common.date")), 1)
			])]), Z("tbody", null, [(Y(!0), X(q, null, G(B(o), (e, t) => (Y(), X("tr", { key: t }, [
				Z("td", null, A(e.public_code), 1),
				Z("td", null, A(e.score), 1),
				Z("td", null, A(e.ts), 1)
			]))), 128))])])) : (Y(), X("p", Us, A(B(r)("common.tableEmpty")), 1))], 64)) : Q("", !0)
		], 10, Ls)], 64));
	}
};
// services/portal/src/teacher/resourceAssignment.js
function Js(e, t, n = window.location) {
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
function Ys(e, t, n) {
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
			y = v.map((e) => Js(e, c));
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
	return W(() => {
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
var Xs = ["placeholder"], Zs = { class: "actions" }, Qs = ["disabled"], $s = ["disabled"], ec = ["disabled"], tc = { key: 0 }, nc = ["aria-busy"], rc = {
	key: 0,
	role: "status"
}, ic = {
	key: 1,
	role: "status"
}, ac = {
	key: 2,
	role: "status"
}, oc = { key: 3 }, sc = {
	key: 4,
	class: "hint"
}, cc = {
	key: 5,
	class: "cards"
}, lc = [
	"data-assign-resource",
	"disabled",
	"onClick"
], uc = {
	__name: "ResourcesPanel",
	props: {
		api: Function,
		onSessionExpired: Function,
		onAssigned: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ja(), { context: i, search: a, rows: o, loaded: s, basket: c, loading: l, pending: u, feedback: d, completedCount: f, unavailable: p, setContext: m, load: h, assign: g } = Ys(n.api, n.onSessionExpired, n.onAssigned);
		return t({ setContext: m }), (e, t) => (Y(), X(q, null, [
			Z("form", {
				class: "grid-fields",
				onSubmit: t[3] ||= Ba((e) => B(h)(!1), ["prevent"])
			}, [Z("label", null, [Z("span", null, A(B(r)("teacher.resourcesSearch")), 1), En(Z("input", {
				id: "resourceSearch",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ R(a) ? a.value = e : null,
				type: "search",
				placeholder: B(r)("teacher.resourcesPlaceholder")
			}, null, 8, Xs), [[La, B(a)]])]), Z("div", Zs, [
				Z("button", {
					id: "searchResources",
					type: "submit",
					class: "secondary",
					disabled: B(u) || !B(i).resourcesEnabled
				}, A(B(r)("teacher.resourcesButton")), 9, Qs),
				B(i).favoritesEnabled === !1 ? Q("", !0) : (Y(), X("button", {
					key: 0,
					id: "loadFavoriteResources",
					type: "button",
					class: "secondary",
					disabled: B(u) || !B(i).teacher || !B(i).resourcesEnabled,
					onClick: t[1] ||= (e) => B(h)(!0)
				}, A(B(r)("teacher.favoritesButton")), 9, $s)),
				B(i).favoritesEnabled === !1 ? Q("", !0) : (Y(), X("button", {
					key: 1,
					id: "assignFavoriteResources",
					type: "button",
					disabled: B(p) || !B(c) || !B(o).length,
					onClick: t[2] ||= (e) => B(g)()
				}, A(B(r)("teacher.assignBasket")), 9, ec))
			])], 32),
			B(i).teacher && B(i).group ? (Y(), X("p", tc, [yi(A(B(r)("teacher.groupSelected")) + " ", 1), Z("strong", null, A(B(i).group.group_code || B(i).group.name), 1)])) : Q("", !0),
			Z("div", {
				id: "resourcesOutput",
				class: k(["output", { empty: !B(o).length }]),
				"aria-busy": B(l) || B(u)
			}, [
				B(d) ? (Y(), X("p", rc, A(B(r)(B(d), { count: B(f) })), 1)) : Q("", !0),
				B(u) ? (Y(), X("p", ic, A(B(r)("teacher.assigningBasket")), 1)) : B(l) ? (Y(), X("p", ac, A(B(r)("teacher.resourcesLoading")), 1)) : !B(o).length && !B(d) ? (Y(), X("p", oc, A(B(r)(B(s) ? "teacher.resourcesEmpty" : "teacher.resourcesHint")), 1)) : Q("", !0),
				B(c) && B(o).length ? (Y(), X("p", sc, A(B(r)("teacher.basketHint", { count: B(o).length })), 1)) : Q("", !0),
				B(o).length ? (Y(), X("div", cc, [(Y(!0), X(q, null, G(B(o), (e, t) => (Y(), X("article", {
					key: t,
					class: "card"
				}, [
					Z("strong", null, A(e.title || e.external_id), 1),
					Z("small", null, A(e.provider || e.format || "resource") + " · " + A(e.subject || ""), 1),
					Z("button", {
						class: "compact secondary",
						type: "button",
						"data-assign-resource": e.external_id,
						disabled: B(p),
						onClick: (t) => B(g)(e)
					}, A(B(r)("teacher.assignResource")), 9, lc)
				]))), 128))])) : Q("", !0)
			], 10, nc)
		], 64));
	}
}, dc = {
	key: 0,
	id: "adminGroups",
	class: "panel teacher-collapsible"
}, fc = { class: "panel-summary" }, pc = { class: "eyebrow" }, mc = ["aria-busy"], hc = { class: "hint" }, gc = {
	key: 0,
	role: "alert"
}, _c = { key: 0 }, vc = { key: 1 }, yc = [
	"data-admin-group",
	"aria-pressed",
	"disabled",
	"onClick"
], bc = ["aria-label"], xc = { class: "actions" }, Sc = ["disabled"], Cc = {
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
		return t({ setContext: p }), W(() => {
			f = !1, d++;
		}), (t, n) => i.value ? (Y(), X("details", dc, [Z("summary", fc, [Z("span", pc, A(B(r)("admin.groupsEyebrow")), 1), Z("strong", null, A(B(r)("admin.groupsTitle")), 1)]), Z("div", {
			class: "panel-content",
			"aria-busy": s.value
		}, [
			Z("p", hc, A(B(r)("admin.groupsHint")), 1),
			c.value ? (Y(), X("p", gc, A(B(r)(c.value)), 1)) : Q("", !0),
			Z("div", { class: k(["output", { empty: !a.value.length }]) }, [a.value.length ? (Y(), X("table", vc, [Z("thead", null, [Z("tr", null, [
				Z("th", null, A(B(r)("teacher.groupOpaque")), 1),
				Z("th", null, A(B(r)("admin.owner")), 1),
				Z("th", null, A(B(r)("admin.collaborators")), 1),
				Z("th", null, A(B(r)("common.date")), 1),
				Z("th", null, A(B(r)("admin.manage")), 1)
			])]), Z("tbody", null, [(Y(!0), X(q, null, G(a.value, (e) => (Y(), X("tr", { key: e.id }, [
				Z("td", null, A(e.group_code), 1),
				Z("td", null, A(e.owner_id || B(r)("admin.noOwner")), 1),
				Z("td", null, A(e.collaborators), 1),
				Z("td", null, A((e.created_at || "").slice(0, 10)), 1),
				Z("td", null, [Z("button", {
					type: "button",
					class: "compact secondary",
					"data-admin-group": e.id,
					"aria-pressed": o.value?.id === e.id,
					disabled: s.value,
					onClick: (t) => h(e)
				}, A(B(r)("admin.manage")), 9, yc)])
			]))), 128))])])) : (Y(), X("p", _c, A(B(r)("common.tableEmpty")), 1))], 2),
			o.value ? (Y(), X("section", {
				key: 1,
				"aria-label": B(r)("admin.selectedGroup", { group: o.value.group_code })
			}, [
				Z("h3", null, A(B(r)("admin.selectedGroup", { group: o.value.group_code })), 1),
				hi(Vo, {
					ref_key: "members",
					ref: l,
					api: e.api,
					"on-session-expired": e.onSessionExpired
				}, null, 8, ["api", "on-session-expired"]),
				Z("div", xc, [Z("button", {
					id: "adminDeleteGroup",
					type: "button",
					class: "danger",
					disabled: s.value,
					onClick: g
				}, A(B(r)("teacher.deleteGroup")), 9, Sc)])
			], 8, bc)) : Q("", !0)
		], 8, mc)])) : Q("", !0);
	}
}, wc = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.odg,.txt,.md,.csv,.png,.jpg,.jpeg,.webp,.gif,.mp3,.ogg,.wav,.m4a,.mp4,.webm,.epub,.zip", Tc = /* @__PURE__ */ new Set([
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
function Ec(e, t, n) {
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
		r.value = e, t && (w(), c.value = "shared", s.value && e.enabled && e.groupId && E());
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
	function te(e) {
		i.value = [], l.value = !1, e.status === 401 ? (f.value = "files.sessionExpired", n?.()) : f.value = "files.error." + (Tc.has(e.message) ? e.message : "operation");
	}
	async function E(e = !0) {
		if (!r.value.enabled || !r.value.groupId) return;
		let t = g, n = ++_;
		u.value = !0, l.value = !1, e && (f.value = "");
		try {
			let e = await T(b.value, { method: "GET" });
			if (!C(t) || n !== _) return;
			if (!Array.isArray(e.files) || !e.settings || !e.usage) throw Error("invalid_files");
			i.value = e.files, a.value = e.settings, o.value = e.usage, l.value = !0;
		} catch (e) {
			C(t) && n === _ && te(e);
		} finally {
			C(t) && n === _ && (u.value = !1);
		}
	}
	function ne(e) {
		s.value = e.target.open, s.value && !l.value && !u.value && !d.value && E();
	}
	async function D(e) {
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
			C(o) && te(e);
		} finally {
			C(o) && (d.value = !1, await E(!1));
		}
	}
	async function re(e) {
		if (S.value || !l.value || !window.confirm(t("files.confirmDelete", { name: e.relative_path }))) return;
		let n = g;
		d.value = !0, f.value = "", p.value = 0, m.value = 0;
		try {
			await T(b.value + "/" + encodeURIComponent(e.id), { method: "DELETE" }), C(n) && (f.value = "files.deleted");
		} catch (e) {
			C(n) && te(e);
		} finally {
			C(n) && (d.value = !1, await E(!1));
		}
	}
	async function ie(e) {
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
			C(r) && await D(t);
		} catch (e) {
			C(r) && te(e);
		}
	}
	function O() {
		w();
	}
	function ae(e) {
		e.persisted && s.value && E();
	}
	return window.addEventListener("pagehide", O), window.addEventListener("pageshow", ae), W(() => {
		v = !1, w(), window.removeEventListener("pagehide", O), window.removeEventListener("pageshow", ae);
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
		load: E,
		toggle: ne,
		upload: D,
		remove: re,
		drop: ie
	};
}
// services/portal/src/files/ClassroomFilesBrowser.vue
var Dc = { key: 0 }, Oc = { class: "actions" }, kc = ["aria-pressed"], Ac = ["aria-pressed"], jc = ["disabled"], Mc = {
	key: 0,
	class: "hint"
}, Nc = {
	key: 1,
	role: "status"
}, Pc = {
	key: 2,
	role: "status",
	"data-files-feedback": ""
}, Fc = { key: 3 }, Ic = [
	"value",
	"max",
	"aria-label"
], Lc = { class: "hint" }, Rc = { key: 0 }, zc = { class: "actions" }, Bc = ["aria-disabled"], Vc = ["accept", "disabled"], Hc = ["aria-disabled"], Uc = ["disabled"], Wc = { role: "status" }, Gc = [
	"value",
	"max",
	"aria-label"
], Kc = { key: 3 }, qc = { class: "file-list" }, Jc = ["data-classroom-file"], Yc = { key: 0 }, Xc = { class: "actions" }, Zc = ["href", "aria-disabled"], Qc = ["disabled", "onClick"], $c = {
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
		let t = e, n = Ja(), { settings: r, usage: i, tab: a, ready: o, loading: s, pending: c, feedback: l, done: u, total: d, search: f, visible: p, disabled: m, base: h, setContext: g, load: _, toggle: v, upload: y, remove: b, drop: x } = Ec(t.api, n, t.onSessionExpired);
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
		function te(e) {
			let t = Array.from(e.target.files || []);
			e.target.value = "", y(t);
		}
		return (t, i) => (Y(), X("details", {
			class: "classroom-files",
			"data-classroom-files": "",
			onToggle: i[6] ||= (...e) => B(v) && B(v)(...e)
		}, [
			Z("summary", null, [Z("strong", null, A(B(n)("files.title")), 1)]),
			Z("p", null, A(B(n)(S.value ? "files.studentHint" : "files.teacherHint")), 1),
			!e.enabled || !e.groupId ? (Y(), X("p", Dc, A(B(n)("files.selectGroup")), 1)) : (Y(), X(q, { key: 1 }, [
				Z("div", Oc, [
					Z("button", {
						type: "button",
						"data-files-tab": "shared",
						"aria-pressed": B(a) === "shared",
						onClick: i[0] ||= (e) => a.value = "shared"
					}, A(B(n)("files.shared")), 9, kc),
					Z("button", {
						type: "button",
						"data-files-tab": "submission",
						"aria-pressed": B(a) === "submission",
						onClick: i[1] ||= (e) => a.value = "submission"
					}, A(B(n)(S.value ? "files.mine" : "files.submissions")), 9, Ac),
					Z("button", {
						type: "button",
						class: "secondary",
						"data-files-refresh": "",
						disabled: B(m),
						onClick: i[2] ||= (e) => B(_)()
					}, A(B(n)("files.refresh")), 9, jc)
				]),
				S.value && B(a) === "submission" ? (Y(), X("p", Mc, A(B(n)("files.privateHint")), 1)) : Q("", !0),
				B(s) ? (Y(), X("p", Nc, A(B(n)("files.loading")), 1)) : Q("", !0),
				B(l) ? (Y(), X("p", Pc, A(B(n)(B(l), { count: B(u) })), 1)) : Q("", !0),
				B(u) && B(l) && B(l) !== "files.saved" ? (Y(), X("p", Fc, A(B(n)("files.partial", { count: B(u) })), 1)) : Q("", !0),
				B(o) ? (Y(), X(q, { key: 4 }, [
					Z("p", null, A(B(n)("files.quota", {
						used: T(w.value),
						limit: T(ee.value)
					})), 1),
					Z("progress", {
						value: w.value || 0,
						max: ee.value || 1,
						"aria-label": B(n)("files.space")
					}, null, 8, Ic),
					Z("p", Lc, A(B(n)("files.limit", { limit: T(B(r).max_file_bytes) })), 1),
					S.value && !B(r).students_can_upload ? (Y(), X("p", Rc, A(B(n)("files.uploadDisabled")), 1)) : Q("", !0),
					C.value || B(c) ? (Y(), X("div", {
						key: 1,
						class: "files-upload",
						onDragover: i[3] ||= Ba(() => {}, ["prevent"]),
						onDrop: i[4] ||= Ba((e) => C.value && B(x)(e), ["prevent"])
					}, [Z("p", null, A(B(n)("files.drop")), 1), Z("div", zc, [Z("label", {
						class: "button-link",
						"aria-disabled": !C.value
					}, [yi(A(B(n)("files.choose")), 1), Z("input", {
						"data-files-input": "",
						type: "file",
						multiple: "",
						accept: B(wc),
						disabled: !C.value,
						onChange: te
					}, null, 40, Vc)], 8, Bc), Z("label", {
						class: "button-link secondary",
						"aria-disabled": !C.value
					}, [yi(A(B(n)("files.chooseFolder")), 1), Z("input", {
						"data-files-folder": "",
						type: "file",
						multiple: "",
						webkitdirectory: "",
						disabled: !C.value,
						onChange: te
					}, null, 40, Uc)], 8, Hc)])], 32)) : Q("", !0),
					B(c) ? (Y(), X(q, { key: 2 }, [Z("p", Wc, A(B(n)("files.progress", {
						done: B(u),
						total: B(d)
					})), 1), Z("progress", {
						value: B(u),
						max: B(d) || 1,
						"aria-label": B(n)("files.progress", {
							done: B(u),
							total: B(d)
						})
					}, null, 8, Gc)], 64)) : Q("", !0),
					Z("label", null, [yi(A(B(n)("files.search")), 1), En(Z("input", {
						"onUpdate:modelValue": i[5] ||= (e) => /* @__PURE__ */ R(f) ? f.value = e : null,
						type: "search",
						"data-files-search": ""
					}, null, 512), [[La, B(f)]])]),
					!B(p).length && !B(s) ? (Y(), X("p", Kc, A(B(n)("files.empty")), 1)) : Q("", !0),
					Z("ul", qc, [(Y(!0), X(q, null, G(B(p), (e) => (Y(), X("li", {
						key: e.id,
						"data-classroom-file": e.id
					}, [Z("div", null, [Z("strong", null, A(e.relative_path), 1), Z("small", null, [yi(A(T(e.size)) + " MiB", 1), !S.value && e.public_code ? (Y(), X("span", Yc, " · " + A(e.public_code), 1)) : Q("", !0)])]), Z("div", Xc, [Z("a", {
						href: B(m) ? void 0 : B(h) + "/" + encodeURIComponent(e.id) + "/download",
						class: "button-link secondary",
						"aria-disabled": B(m),
						"data-file-download": ""
					}, A(B(n)("files.download")), 9, Zc), !S.value || e.scope === "submission" ? (Y(), X("button", {
						key: 0,
						type: "button",
						class: "secondary",
						disabled: B(m),
						"data-file-delete": "",
						onClick: (t) => B(b)(e)
					}, A(B(n)("files.delete")), 9, Qc)) : Q("", !0)])], 8, Jc))), 128))])
				], 64)) : Q("", !0)
			], 64))
		], 32));
	}
}, el = {
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
		return t({ setContext: r }), (t, r) => (Y(), ui($c, {
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
function tl(e, t) {
	return Wa(go, t).mount(e);
}
function nl(e, t) {
	return Wa(To, t).mount(e);
}
function rl(e, t) {
	return Wa(Vo, t).mount(e);
}
function il(e, t) {
	return Wa(gs, t).mount(e);
}
function al(e, t) {
	return Wa(Ms, t).mount(e);
}
function ol(e, t) {
	return Wa(qs, t).mount(e);
}
function sl(e, t) {
	return Wa(uc, t).mount(e);
}
function cl(e, t) {
	return Wa(Cc, t).mount(e);
}
function ll(e, t) {
	return Wa(el, t).mount(e);
}
export { cl as mountAdminGroups, al as mountAssignments, ll as mountClassroomFiles, il as mountCredentials, nl as mountGroups, tl as mountItineraries, rl as mountMembers, sl as mountResources, ol as mountResults };
