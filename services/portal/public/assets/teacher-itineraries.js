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
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), ee = (e) => x(e).slice(8, -1), S = (e) => x(e) === "[object Object]", te = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ne = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), re = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ie = /-\w/g, C = re((e) => e.replace(ie, (e) => e.slice(1).toUpperCase())), ae = /\B([A-Z])/g, w = re((e) => e.replace(ae, "-$1").toLowerCase()), oe = re((e) => e.charAt(0).toUpperCase() + e.slice(1)), se = re((e) => e ? `on${oe(e)}` : ""), ce = (e, t) => !Object.is(e, t), le = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ue = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, de = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, fe, pe = () => fe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function me(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? ve(r) : me(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var he = /;(?![^(]*\))/g, ge = /:([^]+)/, _e = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ve(e) {
	let t = {};
	return e.replace(_e, (e) => e.startsWith("/*") ? "" : e).split(he).forEach((e) => {
		if (e) {
			let n = e.split(ge);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function T(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = T(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ye = /* @__PURE__ */ e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function be(e) {
	return !!e || e === "";
}
function xe(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Te(e[i], t[i], n);
	return r;
}
function Se(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Te(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Ce(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? Se(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Te(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function we(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Te(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? we(e, t, n, xe) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : we(e, t, n, Ce) : String(e) === String(t))));
}
var Ee = (e) => !!(e && e.__v_isRef === !0), E = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Ee(e) ? E(e.value) : JSON.stringify(e, De, 2) : String(e), De = (e, t) => Ee(t) ? De(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Oe(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Oe(e)) } : _(t) ? Oe(t) : v(t) && !d(t) && !S(t) ? String(t) : t, Oe = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, D, ke = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && D && (D.active ? (this.parent = D, this.index = (D.scopes || (D.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = D;
			try {
				return D = this, e();
			} finally {
				D = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = D, D = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (D === this) D = this.prevScope;
			else {
				let e = D;
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
}, O, Ae = /* @__PURE__ */ new WeakSet(), je = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, D && (D.active ? D.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ae.has(this) && (Ae.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Fe(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, qe(this), Re(this);
		let e = O, t = k;
		O = this, k = !0;
		try {
			return this.fn();
		} finally {
			ze(this), O = e, k = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) He(e);
			this.deps = this.depsTail = void 0, qe(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ae.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Be(this) && this.run();
	}
	get dirty() {
		return Be(this);
	}
}, Me = 0, Ne, Pe;
function Fe(e, t = !1) {
	e.flags |= 8, t ? (e.next = Pe, Pe = e) : (e.next = Ne, Ne = e);
}
function Ie() {
	Me++;
}
function Le() {
	if (--Me > 0) return;
	if (Pe) {
		let e = Pe;
		for (Pe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ne;) {
		let t = Ne;
		for (Ne = void 0; t;) {
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
function Re(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ze(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), He(r), Ue(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Be(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ve(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ve(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Je) || (e.globalVersion = Je, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Be(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = O, r = k;
	O = e, k = !0;
	try {
		Re(e);
		let n = e.fn(e._value);
		(t.version === 0 || ce(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		O = n, k = r, ze(e), e.flags &= -3;
	}
}
function He(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) He(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ue(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var k = !0, We = [];
function Ge() {
	We.push(k), k = !1;
}
function Ke() {
	let e = We.pop();
	k = e === void 0 || e;
}
function qe(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = O;
		O = void 0;
		try {
			t();
		} finally {
			O = e;
		}
	}
}
var Je = 0, Ye = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Xe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!O || !k || O === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== O) t = this.activeLink = new Ye(O, this), O.deps ? (t.prevDep = O.depsTail, O.depsTail.nextDep = t, O.depsTail = t) : O.deps = O.depsTail = t, Ze(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = O.depsTail, t.nextDep = void 0, O.depsTail.nextDep = t, O.depsTail = t, O.deps === t && (O.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Je++, this.notify(e);
	}
	notify(e) {
		Ie();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Le();
		}
	}
};
function Ze(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ze(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Qe = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ Symbol(""), et = /* @__PURE__ */ Symbol(""), tt = /* @__PURE__ */ Symbol("");
function A(e, t, n) {
	if (k && O) {
		let t = Qe.get(e);
		t || Qe.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Xe()), r.map = t, r.key = n), r.track();
	}
}
function j(e, t, n, r, i, a) {
	let o = Qe.get(e);
	if (!o) {
		Je++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ie(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && te(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === tt || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(tt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get($e)), f(e) && s(o.get(et)));
				break;
			case "delete":
				i || (s(o.get($e)), f(e) && s(o.get(et)));
				break;
			case "set": f(e) && s(o.get($e));
		}
	}
	Le();
}
function nt(e) {
	let t = /* @__PURE__ */ P(e);
	return t === e || (A(t, "iterate", tt), /* @__PURE__ */ Bt(e)) ? t : /* @__PURE__ */ N(e) ? /* @__PURE__ */ zt(e) ? t.map((e) => Ut(F(e))) : t.map(Ut) : t.map(F);
}
function rt(e) {
	return A(e = /* @__PURE__ */ P(e), "iterate", tt), e;
}
function M(e, t) {
	return /* @__PURE__ */ N(e) ? Ut(/* @__PURE__ */ zt(e) ? F(t) : t) : F(t);
}
var it = {
	__proto__: null,
	[Symbol.iterator]() {
		return at(this, Symbol.iterator, (e) => M(this, e));
	},
	concat(...e) {
		return nt(this).concat(...e.map((e) => d(e) ? nt(e) : e));
	},
	entries() {
		return at(this, "entries", (e) => (e[1] = M(this, e[1]), e));
	},
	every(e, t) {
		return ct(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ct(this, "filter", e, t, (e) => e.map((e) => M(this, e)), arguments);
	},
	find(e, t) {
		return ct(this, "find", e, t, (e) => M(this, e), arguments);
	},
	findIndex(e, t) {
		return ct(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ct(this, "findLast", e, t, (e) => M(this, e), arguments);
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
		return nt(this).join(e);
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
		return nt(this).toReversed();
	},
	toSorted(e) {
		return nt(this).toSorted(e);
	},
	toSpliced(...e) {
		return nt(this).toSpliced(...e);
	},
	unshift(...e) {
		return dt(this, "unshift", e);
	},
	values() {
		return at(this, "values", (e) => M(this, e));
	}
};
function at(e, t, n) {
	let r = rt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ Bt(e)) {
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
	let o = rt(e), s = o !== e && !/* @__PURE__ */ Bt(e), c = o[t];
	if (c !== st[t]) {
		let t = c.apply(e, a);
		return s ? F(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, M(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function lt(e, t, n, r) {
	let i = rt(e), a = i !== e && !/* @__PURE__ */ Bt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = M(e, t)), n.call(this, t, M(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? M(e, c) : c;
}
function ut(e, t, n) {
	let r = /* @__PURE__ */ P(e);
	A(r, "iterate", tt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Vt(n[0]) ? (n[0] = /* @__PURE__ */ P(n[0]), r[t](...n)) : i;
}
function dt(e, t, n = []) {
	Ge(), Ie();
	let r = (/* @__PURE__ */ P(e))[t].apply(e, n);
	return Le(), Ke(), r;
}
var ft = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function mt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ P(this);
	return A(t, "has", e), t.hasOwnProperty(e);
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
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = it[t])) return e;
			if (t === "hasOwnProperty") return mt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ I(e) ? e : n);
		if ((_(t) ? pt.has(t) : ft(t)) || (r || A(e, "get", t), i)) return o;
		if (/* @__PURE__ */ I(o)) {
			let e = a && te(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Lt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Lt(o) : /* @__PURE__ */ Ft(o) : o;
	}
}, gt = class extends ht {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && te(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ N(i);
			if (!/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ N(n) && (i = /* @__PURE__ */ P(i), n = /* @__PURE__ */ P(n)), !a && /* @__PURE__ */ I(i) && !/* @__PURE__ */ I(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ I(e) ? e : r);
		return e === /* @__PURE__ */ P(r) && s && (o ? ce(n, i) && j(e, "set", t, n, i) : j(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && j(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && pt.has(t) || A(e, "has", t), n;
	}
	ownKeys(e) {
		return A(e, "iterate", d(e) ? "length" : $e), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ P(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? xt : t ? Ut : F;
		return !t && A(a, "iterate", l ? et : $e), s(Object.create(u), { next() {
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
function wt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Tt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ P(r), a = /* @__PURE__ */ P(n);
			e || (ce(n, a) && A(i, "get", n), A(i, "get", a));
			let { has: o } = St(i), s = t ? xt : e ? Ut : F;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && A(/* @__PURE__ */ P(t), "iterate", $e), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ P(n), i = /* @__PURE__ */ P(t);
			return e || (ce(t, i) && A(r, "has", t), A(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ P(a), s = t ? xt : e ? Ut : F;
			return !e && A(o, "iterate", $e), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: wt("add"),
		set: wt("set"),
		delete: wt("delete"),
		clear: wt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ P(this), r = St(n), i = /* @__PURE__ */ P(e), a = !t && !/* @__PURE__ */ Bt(e) && !/* @__PURE__ */ N(e) ? i : e;
			return r.has.call(n, a) || ce(e, a) && r.has.call(n, e) || ce(i, a) && r.has.call(n, i) || (n.add(a), j(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Bt(n) || /* @__PURE__ */ N(n) || (n = /* @__PURE__ */ P(n));
			let r = /* @__PURE__ */ P(this), { has: i, get: a } = St(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ P(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ce(n, s) && j(r, "set", e, n, s) : j(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ P(this), { has: n, get: r } = St(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ P(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && j(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ P(this), t = e.size !== 0, n = e.clear();
			return t && j(e, "clear", void 0, void 0, void 0), n;
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
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
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
	return /* @__PURE__ */ N(e) ? e : Rt(e, !1, vt, Dt, At);
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
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Pt(ee(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return /* @__PURE__ */ N(e) ? /* @__PURE__ */ zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function N(e) {
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
function P(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ P(t) : e;
}
function Ht(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && ue(e, "__v_skip", !0), e;
}
var F = (e) => v(e) ? /* @__PURE__ */ Ft(e) : e, Ut = (e) => v(e) ? /* @__PURE__ */ Lt(e) : e;
// @__NO_SIDE_EFFECTS__
function I(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function L(e) {
	return Gt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return Gt(e, !0);
}
function Gt(e, t) {
	return /* @__PURE__ */ I(e) ? e : new Kt(e, t);
}
var Kt = class {
	constructor(e, t) {
		this.dep = new Xe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ P(e), this._value = t ? e : F(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Bt(e) || /* @__PURE__ */ N(e);
		e = n ? e : /* @__PURE__ */ P(e), ce(e, t) && (this._rawValue = e, this._value = n ? e : F(e), this.dep.trigger());
	}
};
function R(e) {
	return /* @__PURE__ */ I(e) ? e.value : e;
}
var qt = {
	get: (e, t, n) => t === "__v_raw" ? e : R(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ I(i) && !/* @__PURE__ */ I(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Jt(e) {
	return /* @__PURE__ */ zt(e) ? e : new Proxy(e, qt);
}
var Yt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Xe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Je - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && O !== this) return Fe(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ve(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Xt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Yt(r, i, n);
}
function Zt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ I(e)) Zt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Zt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Zt(e, t, n);
	});
	else if (S(e)) {
		for (let r in e) Zt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Zt(e[r], t, n);
	}
	return e;
}
// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Qt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		en(e, t, n);
	}
}
function $t(e, t, n, r) {
	if (h(e)) {
		let i = Qt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			en(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push($t(e[a], t, n, r));
		return i;
	}
}
function en(e, n, r, i = !0) {
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
			Ge(), Qt(o, null, 10, [
				e,
				i,
				a
			]), Ke();
			return;
		}
	}
	tn(e, r, a, i, s);
}
function tn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var z = [], B = -1, V = [], nn = null, rn = 0, an = /* @__PURE__ */ Promise.resolve(), on = null;
function sn(e) {
	let t = on || an;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function cn(e) {
	let t = B + 1, n = z.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = z[r], a = gn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function ln(e) {
	if (!(e.flags & 1)) {
		let t = gn(e), n = z[z.length - 1];
		!n || !(e.flags & 2) && t >= gn(n) ? z.push(e) : z.splice(cn(t), 0, e), e.flags |= 1, un();
	}
}
function un() {
	on ||= an.then(_n);
}
function dn(e) {
	if (!d(e)) nn && e.id === -1 ? nn.splice(rn + 1, 0, e) : e.flags & 1 || (V.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) V.push(e[t]);
	un();
}
function fn(e, t, n, r = B + 1) {
	for (; r < z.length; r++) {
		let n = z[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			z.splice(r, 1), r = e ? r - 1 : B, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function pn(e, t, n = 0) {
	if (V.length) {
		let e = V, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < V.length; i++) {
				let a = V[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? V[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => gn(e) - gn(t));
		if (V.length = r, nn) {
			for (let e = 0; e < i.length; e++) nn.push(i[e]);
			return;
		}
		for (nn = i, rn = 0; rn < nn.length; rn++) {
			let e = nn[rn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		nn = null, rn = 0;
	}
}
var mn = !1;
function hn(e, t) {
	if (mn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(V);
	e(), mn = !0;
	try {
		fn(void 0, t), pn(void 0, n, t);
	} finally {
		mn = !1;
	}
}
var gn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function _n(e) {
	try {
		for (B = 0; B < z.length; B++) {
			let e = z[B];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Qt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; B < z.length; B++) {
			let e = z[B];
			e && (e.flags &= -2);
		}
		B = -1, z.length = 0, pn(e), on = null, (z.length || V.length) && _n(e);
	}
}
var H = null, vn = null;
function yn(e) {
	let t = H;
	return H = e, vn = e && e.type.__scopeId || null, t;
}
function bn(e, t = H, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Qr(-1);
		let i = yn(t), a = Yr.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Yr.length; e > a; e--) Xr();
			yn(i), r._d && Qr(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function xn(e, n) {
	if (H === null) return e;
	let r = Ai(H), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Zt(o), i.push({
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
function Sn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ge(), $t(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ke());
	}
}
var Cn = /* @__PURE__ */ new WeakMap(), wn = /* @__PURE__ */ Symbol("_vte"), Tn = (e) => e.__isTeleport, En = (e) => e && (e.disabled || e.disabled === ""), Dn = (e) => e && (e.defer || e.defer === ""), On = (e) => typeof SVGElement < "u" && e instanceof SVGElement, kn = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, An = (e, t) => {
	let n = e && e.to;
	return g(n) ? t ? t(n) : null : n;
}, jn = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = En(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = En(e.props), r = e.target = An(e.props, m), a = In(r, e, h, p);
			r && (o !== "svg" && On(r) ? o = "svg" : o !== "mathml" && kn(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), Fn(e, !1)));
		}, ee = (e) => {
			let t = () => {
				if (Cn.get(e) === t) {
					if (Cn.delete(e), En(e.props)) {
						let t = _(e.el) || n;
						b(e, t, e.anchor), Fn(e, !0);
					}
					x(e);
				}
			};
			Cn.set(e, t), W(t, a);
		};
		if (e == null) {
			let e = t.el = h(""), i = t.anchor = h("");
			if (p(e, n, r), p(i, n, r), Dn(t.props) || a && a.pendingBranch) {
				ee(t);
				return;
			}
			v && (b(t, n, i), Fn(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = Cn.get(e);
			if (u) {
				u.flags |= 8, Cn.delete(e), ee(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = En(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || On(p) ? o = "svg" : (o === "mathml" || kn(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), Br(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Mn(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = An(t.props, m);
				e && (t.target = e, Mn(t, e, null, l, 0));
			} else g && Mn(t, p, h, l, 1);
			Fn(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = En(f), m = a || !p, h = Cn.get(e);
		if (h && (h.flags |= 8, Cn.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, m, !!i.dynamicChildren);
		}
	},
	move: Mn,
	hydrate: Nn
};
function Mn(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && (e.targetStart && r(e.targetStart, t, n), r(e.targetAnchor, t, n), n = e.targetAnchor);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !Cn.has(e) && (!d || En(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function Nn(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
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
	let m = t.target = An(t.props, c), h = En(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || In(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || In(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), Fn(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var Pn = jn;
function Fn(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function In(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[wn] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var Ln = /* @__PURE__ */ Symbol("_leaveCb");
function Rn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== K) {
			t = n;
			break;
		}
	}
	return t;
}
function zn(e) {
	if (!Jn(e)) return Tn(e.type) && e.children ? Rn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Bn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Bn(Tn(n.type) && zn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === G && d(e.children)) {
		let n = dr(e.children, !1);
		n && Bn(n, t);
	}
}
function Vn(e) {
	if (e.component) return Vn(e.component.subTree);
	if (e.type === G) {
		let t = d(e.children) && dr(e.children, !1);
		return t ? Vn(t) : void 0;
	}
	if (e.type !== K) return e;
}
function Hn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Un(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Wn = /* @__PURE__ */ new WeakMap();
function Gn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Gn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (qn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Gn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Ai(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ P(v), b = v === t ? i : (e) => !Un(_, e) && u(y, e), x = (e, t) => !(t && Un(_, t));
	if (m != null && m !== p) {
		if (Kn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ I(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) Qt(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ I(p);
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
					i(), Wn.delete(e);
				};
				t.id = -1, Wn.set(e, t), W(t, r);
			} else Kn(e), i();
		}
	}
}
function Kn(e) {
	let t = Wn.get(e);
	t && (t.flags |= 8, Wn.delete(e));
}
pe().requestIdleCallback, pe().cancelIdleCallback;
var qn = (e) => !!e.type.__asyncLoader, Jn = (e) => e.type.__isKeepAlive;
function Yn(e, t, n = _i, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ge();
			let i = bi(n), a = $t(t, n, e, r);
			return i(), Ke(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Xn = ((e) => (t, n = _i) => {
	Ci || Yn(e, (...e) => t(...e), n);
})("bum"), Zn = /* @__PURE__ */ Symbol.for("v-ndc");
function U(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ zt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Bt(e), s = /* @__PURE__ */ N(e), e = rt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ut(F(e[n])) : F(e[n]) : e[n], n, void 0, a && a[n]);
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
var Qn = (e) => e ? Si(e) ? Ai(e) : Qn(e.parent) : null, $n = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
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
		ln(e.update);
	},
	$nextTick: (e) => e.n ||= sn.bind(e.proxy),
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
		if (d) return n === "$attrs" && A(e.attrs, "get", ""), d(e);
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
			version: Ni,
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
					let u = l._ceVNode || ai(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Ai(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && ($t(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
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
var ar = null, or = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${C(t)}Modifiers`] || e[`${w(t)}Modifiers`];
function sr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && or(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(de)));
	let c, l = i[c = se(n)] || i[c = se(C(n))];
	!l && o && (l = i[c = se(w(n))]), l && $t(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, $t(u, e, 6, a);
	}
}
function cr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function lr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, w(t)) || u(e, t));
}
function ur(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = yn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Q(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Q(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : fr(c);
		}
	} catch (t) {
		Yr.length = 0, en(t, e, 1), v = ai(K);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = pr(y, a)), b = ci(b, y, !1, !0));
	}
	return n.dirs && (b = ci(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Bn(Tn(b.type) && zn(b) || b, n.transition), v = b, yn(_), v;
}
function dr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ti(r)) {
			if (r.type !== K || r.children === "v-if") {
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
	return n === "style" && v(r) && v(i) ? !Te(r, i) : r !== i;
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
	e.props = n ? r ? i : /* @__PURE__ */ It(i) : e.type.props ? i : a, e.attrs = a;
}
function Sr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ P(i), [c] = e.propsOptions, l = !1;
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
						let t = C(o);
						i[t] = wr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Cr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = w(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = wr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && j(e.attrs, "set", "");
}
function Cr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ne(t)) continue;
		let l = n[t], d;
		a && u(a, d = C(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : lr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ P(r), i = c || t;
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
					let o = bi(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === w(n)) && (r = !0));
	}
	return r;
}
function Tr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = C(c[e]);
		Er(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = C(e);
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
	return e[0] !== "$" && !ne(e);
}
var Dr = (e) => e === "_" || e === "_ctx" || e === "$stable", Or = (e) => d(e) ? e.map(Q) : [Q(e)], kr = (e, t, n) => {
	if (t._n) return t;
	let r = bn((...e) => Or(t(...e)), n);
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
		e ? (Mr(r, t, n), n && ue(r, "_", e, !0)) : Ar(t, r);
	} else t && jr(e, t);
}, Pr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Mr(a, n, r) : (o = !n.$stable, Ar(n, a)), s = n;
	} else n && (jr(e, n), s = { default: 1 });
	if (o) for (let e in a) !Dr(e) && s[e] == null && delete a[e];
}, W = Kr;
function Fr(e) {
	return Ir(e);
}
function Ir(e, i) {
	let a = pe();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ni(e, t) && (i = Ce(e), T(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case qr:
				y(e, t, r, i);
				break;
			case K:
				b(e, t, r, i);
				break;
			case Jr:
				e ?? x(t, r, i, s);
				break;
			case G:
				se(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? te(e, t, r, i, a, o, s, c, l) : f & 6 ? ce(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, Te);
		}
		d != null && a ? Gn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Gn(e.ref, null, o, e, !0);
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
	}, ee = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, S = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, te = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) re(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), ae(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, re = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && C(e.children, d, null, r, i, Lr(e, a), s, u), _ && Sn(e, null, r, "created"), ie(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ne(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && $(f, r, e);
		}
		_ && Sn(e, null, r, "beforeMount");
		let v = zr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && W(() => {
			try {
				f && $(f, r, e), v && g.enter(d), _ && Sn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ie = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Gr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ie(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, C = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ui(e[l]) : Q(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ae = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Rr(r, !1), (g = h.onVnodeBeforeUpdate) && $(g, r, n, e), f && Sn(n, e, r, "beforeUpdate"), r && Rr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? w(e.dynamicChildren, d, l, r, i, Lr(n, a), o) : s || he(e, n, l, null, r, i, Lr(n, a), o, !1), u > 0) {
			if (u & 16) oe(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && oe(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && W(() => {
			g && $(g, r, n, e), f && Sn(n, e, r, "updated");
		}, i);
	}, w = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Wr(c), d = u && (c.type === G || !ni(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, oe = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ne(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ne(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, se = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), C(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (w(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Br(e, t, !0)) : he(e, t, n, f, i, a, s, c, l);
	}, ce = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ue(t, n, r, i, a, o, c) : de(e, t, c);
	}, ue = (e, t, n, r, i, a, o) => {
		let s = e.component = gi(e, r, i);
		if (Jn(e) && (s.ctx.renderer = Te), wi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, fe, o, a), !e.el) {
				let r = s.subTree = ai(K);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else fe(s, e, t, n, i, a, o);
	}, de = (e, t, n) => {
		let r = t.component = e.component;
		if (mr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, me(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, fe = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Hr(e);
					if (n) {
						t && (t.el = c.el, me(e, t, o)), n.asyncDep.then(() => {
							W(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Rr(e, !1), t ? (t.el = c.el, me(e, t, o)) : t = c, n && le(n), (d = t.props && t.props.onVnodeBeforeUpdate) && $(d, s, t, c), Rr(e, !0);
				let f = ur(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), Ce(p), e, i, a), t.el = f.el, u === null && _r(e, f.el), r && W(r, i), (d = t.props && t.props.onVnodeUpdated) && W(() => $(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = qn(t);
				if (Rr(e, !1), l && le(l), !m && (o = c && c.onVnodeBeforeMount) && $(o, d, t), Rr(e, !0), s && E) {
					let t = () => {
						e.subTree = ur(e), E(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ur(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && W(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					W(() => $(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && qn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && W(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new je(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => ln(u), Rr(e, !0), l();
	}, me = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Sr(e, t.props, r, n), Pr(e, t.children, n), Ge(), fn(e), Ke();
	}, he = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				_e(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				ge(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && Se(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? _e(l, d, n, r, i, a, o, s, c) : Se(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && C(d, n, r, i, a, o, s, c));
	}, ge = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? ui(t[p]) : Q(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? Se(e, a, o, !0, !1, f) : C(t, r, i, a, o, s, c, l, f);
	}, _e = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? ui(t[u]) : Q(t[u]);
			if (ni(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? ui(t[p]) : Q(t[p]);
			if (ni(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? ui(t[u]) : Q(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) T(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? ui(t[u]) : Q(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, ee = 0, S = Array(b);
			for (u = 0; u < b; u++) S[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					T(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (S[_ - h] === 0 && ni(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? T(n, a, o, !0) : (S[i - h] = u + 1, i >= ee ? ee = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let te = x ? Vr(S) : n;
			for (_ = te.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Wr(f) : i;
				S[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== te[_] ? ve(n, r, p, 2) : _--);
			}
		}
	}, ve = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) ve(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, Te);
		else if (c === G) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ve(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === Jr) ee(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Ln] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), W(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Ln];
					a._isLeaving && a[Ln](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, T = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ge(), Gn(s, null, n, e, !0), Ke()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !qn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && $(_, t, e), u & 6) xe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Sn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Te, r) : l && !l.hasOnce && (a !== G || d > 0 && d & 64) ? Se(l, t, n, !1, !0) : (a === G && d & 384 || !i && u & 16) && Se(c, t, n), r && ye(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && W(() => {
			_ && $(_, t, e), h && Sn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ye = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === G;
		if (a && !i) {
			be(n, r);
			return;
		}
		if (t === Jr) {
			S(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Vn(e) : e, c = () => {
			a ? m(n) && be(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, be = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, xe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ur(c), Ur(l), r && le(r), i.stop(), a ? (a.flags |= 8, T(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, T(o, e, t, n)), s && W(s, t), W(() => {
			e.isUnmounted = !0;
		}, t);
	}, Se = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) T(e[o], t, n, r, i);
	}, Ce = (e) => {
		if (e.shapeFlag & 6) return Ce(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[wn];
		return n ? h(n) : t;
	}, we = (e, t, n) => {
		hn(() => {
			e == null ? t._vnode && T(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : hi());
	}, Te = {
		p: v,
		um: T,
		m: ve,
		r: ye,
		mt: ue,
		mc: C,
		pc: he,
		pbc: w,
		n: Ce,
		o: e
	}, Ee, E;
	return i && ([Ee, E] = i(Te)), {
		render: we,
		hydrate: Ee,
		createApp: ir(we, Ee)
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
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ui(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Br(t, a)), a.type === qr && (a.patchFlag === -1 && (a = i[e] = ui(a)), a.el = t.el), a.type === K && !a.el && (a.el = t.el);
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
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : dn(e);
}
var G = /* @__PURE__ */ Symbol.for("v-fgt"), qr = /* @__PURE__ */ Symbol.for("v-txt"), K = /* @__PURE__ */ Symbol.for("v-cmt"), Jr = /* @__PURE__ */ Symbol.for("v-stc"), Yr = [], q = null;
function J(e = !1) {
	Yr.push(q = e ? null : []);
}
function Xr() {
	Yr.pop(), q = Yr[Yr.length - 1] || null;
}
var Zr = 1;
function Qr(e, t = !1) {
	Zr += e, e < 0 && q && t && (q.hasOnce = !0);
}
function $r(e) {
	return e.dynamicChildren = Zr > 0 ? q || n : null, Xr(), Zr > 0 && q && q.push(e), e;
}
function Y(e, t, n, r, i, a) {
	return $r(X(e, t, n, r, i, a, !0));
}
function ei(e, t, n, r, i) {
	return $r(ai(e, t, n, r, i, !0));
}
function ti(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ni(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ri = ({ key: e }) => e ?? null, ii = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ I(e) || h(e) ? {
	i: H,
	r: e,
	k: t,
	f: !!n
} : e);
function X(e, t = null, n = null, r = 0, i = null, a = e === G ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ri(t),
		ref: t && ii(t),
		scopeId: vn,
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
		ctx: H
	};
	return s ? (di(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Zr > 0 && !o && q && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && q.push(c), c;
}
var ai = oi;
function oi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Zn || (e = K), ti(e)) {
		let r = ci(e, t, !0);
		return n && di(r, n), Zr > 0 && !a && q && (r.shapeFlag & 6 ? q[q.indexOf(e)] = r : q.push(r)), r.patchFlag = -2, r;
	}
	if (ji(e) && (e = e.__vccOpts), t) {
		t = si(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = T(e)), v(n) && (/* @__PURE__ */ Vt(n) && !d(n) && (n = s({}, n)), t.style = me(n));
	}
	let o = g(e) ? 1 : Gr(e) ? 128 : Tn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return X(e, t, n, r, i, o, a, !0);
}
function si(e) {
	return e ? /* @__PURE__ */ Vt(e) || br(e) ? s({}, e) : e : null;
}
function ci(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? fi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ri(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(ii(t)) : [a, ii(t)] : ii(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== G ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ci(e.ssContent),
		ssFallback: e.ssFallback && ci(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Bn(u, c.clone(u)), u;
}
function li(e = " ", t = 0) {
	return ai(qr, null, e, t);
}
function Z(e = "", t = !1) {
	return t ? (J(), ei(K, null, e)) : ai(K, null, e);
}
function Q(e) {
	return e == null || typeof e == "boolean" ? ai(K) : d(e) ? ai(G, null, e.slice()) : ti(e) ? ui(e) : ai(qr, null, String(e));
}
function ui(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ci(e);
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
			!r && !br(t) ? t._ctx = H : r === 3 && H && (H.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			di(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: H
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [li(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function fi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = T([t.class, r.class]));
		else if (e === "style") t.style = me([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function $(e, t, n, r = null) {
	$t(e, t, 7, [n, r]);
}
var pi = nr(), mi = 0;
function hi() {
	return mi;
}
function gi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || pi, o = {
		uid: mi++,
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
		scope: new ke(!0),
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
var _i = null, vi, yi;
{
	let e = pe(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	vi = t("__VUE_INSTANCE_SETTERS__", (e) => _i = e), yi = t("__VUE_SSR_SETTERS__", (e) => Ci = e);
}
var bi = (e) => {
	let t = _i;
	return vi(e), e.scope.on(), () => {
		e.scope.off(), vi(t);
	};
}, xi = () => {
	_i && _i.scope.off(), vi(null);
};
function Si(e) {
	return e.vnode.shapeFlag & 4;
}
var Ci = !1;
function wi(e, t = !1, n = !1) {
	t && yi(t);
	let { props: r, children: i } = e.vnode, a = Si(e);
	xr(e, r, a, t), Nr(e, i, n || t);
	let o = a ? Ti(e, t) : void 0;
	return t && yi(!1), o;
}
function Ti(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, tr);
	let { setup: r } = n;
	if (r) {
		Ge();
		let n = e.setupContext = r.length > 1 ? ki(e) : null, i = bi(e), a = Qt(r, e, 0, [e.props, n]), o = y(a);
		if (Ke(), i(), (o || e.sp) && !qn(e) && Hn(e), o) {
			if (a.then(xi, xi), t) return a.then((n) => {
				yi(!0);
				try {
					Ei(e, n, t);
				} finally {
					yi(!1);
				}
			}).catch((t) => {
				en(t, e, 0);
			});
			e.asyncDep = a;
		} else Ei(e, a, t);
	} else Di(e, t);
}
function Ei(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Jt(t)), Di(e, n);
}
function Di(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var Oi = { get(e, t) {
	return A(e, "get", ""), e[t];
} };
function ki(e) {
	return {
		attrs: new Proxy(e.attrs, Oi),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ai(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Jt(Ht(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in $n) return $n[n](e);
		},
		has(e, t) {
			return t in e || t in $n;
		}
	}) : e.proxy;
}
function ji(e) {
	return h(e) && "__vccOpts" in e;
}
var Mi = (e, t) => /* @__PURE__ */ Xt(e, t, Ci), Ni = "3.5.44", Pi = void 0, Fi = typeof window < "u" && window.trustedTypes;
if (Fi) try {
	Pi = /* @__PURE__ */ Fi.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ii = Pi ? (e) => Pi.createHTML(e) : (e) => e, Li = "http://www.w3.org/2000/svg", Ri = "http://www.w3.org/1998/Math/MathML", zi = typeof document < "u" ? document : null, Bi = zi && /* @__PURE__ */ zi.createElement("template"), Vi = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? zi.createElementNS(Li, e) : t === "mathml" ? zi.createElementNS(Ri, e) : n ? zi.createElement(e, { is: n }) : zi.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => zi.createTextNode(e),
	createComment: (e) => zi.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => zi.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Bi.innerHTML = Ii(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Bi.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Hi = /* @__PURE__ */ Symbol("_vtc");
function Ui(e, t, n) {
	let r = e[Hi];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Wi = /* @__PURE__ */ Symbol("_vod"), Gi = /* @__PURE__ */ Symbol("_vsh"), Ki = /* @__PURE__ */ Symbol(""), qi = /(?:^|;)\s*display\s*:/;
function Ji(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Xi(r, t, "");
			}
			else for (let e in t) n[e] ?? Xi(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Xi(r, i, "") : ea(e, i, !g(t) && t ? t[i] : void 0, o) || Xi(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Ki];
			e && (n += ";" + e), r.cssText = n, a = qi.test(n);
		}
	} else t && e.removeAttribute("style");
	Wi in e && (i && t === n || (e[Wi] = a ? r.display : ""), e[Gi] && (r.display = "none"));
}
var Yi = /\s*!important$/;
function Xi(e, t, n) {
	if (d(n)) n.forEach((n) => Xi(e, t, n));
	else if (n ??= "", t.startsWith("--")) Yi.test(n) ? e.setProperty(t, n.replace(Yi, ""), "important") : e.setProperty(t, n);
	else {
		let r = $i(e, t);
		Yi.test(n) ? e.setProperty(w(r), n.replace(Yi, ""), "important") : e[r] = n;
	}
}
var Zi = [
	"Webkit",
	"Moz",
	"ms"
], Qi = {};
function $i(e, t) {
	let n = Qi[t];
	if (n) return n;
	let r = C(t);
	if (r !== "filter" && r in e) return Qi[t] = r;
	r = oe(r);
	for (let n = 0; n < Zi.length; n++) {
		let i = Zi[n] + r;
		if (i in e) return Qi[t] = i;
	}
	return t;
}
function ea(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var ta = "http://www.w3.org/1999/xlink";
function na(e, t, n, r, i, a = ye(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ta, t.slice(6, t.length)) : e.setAttributeNS(ta, t, n) : n == null || a && !be(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function ra(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ii(n) : n);
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
		r === "boolean" ? n = be(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function ia(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function aa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var oa = /* @__PURE__ */ Symbol("_vei");
function sa(e, t, n, r, i = null) {
	let a = e[oa] || (e[oa] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ua(t);
		r ? ia(e, n, a[t] = ma(r, i), s) : o && (aa(e, n, o, s), a[t] = void 0);
	}
}
var ca = /(Once|Passive|Capture)$/, la = /^on:?(?:Once|Passive|Capture)$/;
function ua(e) {
	let t, n;
	for (; (n = e.match(ca)) && !la.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : w(e.slice(2)), t];
}
var da = 0, fa = /* @__PURE__ */ Promise.resolve(), pa = () => da ||= (fa.then(() => da = 0), Date.now());
function ma(e, t) {
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
				e && $t(e, t, 5, a);
			}
		} else $t(r, t, 5, [e]);
	};
	return n.value = e, n.attached = pa(), n;
}
var ha = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ga = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Ui(e, r, c) : t === "style" ? Ji(e, n, r) : a(t) ? o(t) || sa(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : _a(e, t, r, c)) ? (ra(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || na(e, t, r, c, s, t !== "value")) : e._isVueCE && (va(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ra(e, C(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), na(e, t, r, c));
};
function _a(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && ha(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return ha(t) && g(n) ? !1 : t in e;
}
function va(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = C(t);
	return Array.isArray(n) ? n.some((e) => C(e) === r) : Object.keys(n).some((e) => C(e) === r);
}
var ya = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => le(t, e) : t;
};
function ba(e) {
	e.target.composing = !0;
}
function xa(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Sa = /* @__PURE__ */ Symbol("_assign"), Ca = /* @__PURE__ */ Symbol("_initialValue");
function wa(e, t, n) {
	return t && (e = e.trim()), n && (e = de(e)), e;
}
var Ta = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Ca] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Ca] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Sa] = ya(i);
		let a = r || i.props && i.props.type === "number";
		ia(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Sa](wa(e.value, n, a));
		}), (n || a) && ia(e, "change", () => {
			e.value = wa(e.value, n, a);
		}), t || (ia(e, "compositionstart", ba), ia(e, "compositionend", xa), ia(e, "change", xa));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Ca];
		delete e[Ca], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Sa](wa(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Sa] = ya(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? de(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Ea = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Da = {
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
	exact: (e, t) => Ea.some((n) => e[`${n}Key`] && !t.includes(n))
}, Oa = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Da[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, ka = /* @__PURE__ */ s({ patchProp: ga }, Vi), Aa;
function ja() {
	return Aa ||= Fr(ka);
}
var Ma = ((...e) => {
	let t = ja().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Pa(e);
		if (!r) return;
		let i = t._component;
		h(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Na(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Na(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Pa(e) {
	return g(e) ? document.querySelector(e) : e;
}
// services/portal/src/teacher/useItineraries.js
function Fa(e, t) {
	let n = /* @__PURE__ */ Wt({
		teacher: !1,
		group: null,
		assignments: [],
		assignment: null
	}), r = /* @__PURE__ */ L([]), i = /* @__PURE__ */ L(""), a = /* @__PURE__ */ L(!1), o = /* @__PURE__ */ L(!1), s = /* @__PURE__ */ L(!1), c = /* @__PURE__ */ L(""), l = 0, u = 0, d = 0, f = !0, p = Mi(() => r.value.find((e) => e.is_selected)), m = Mi(() => !n.value.teacher || !n.value.group || !a.value || s.value);
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
	function ee(e) {
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
	function S(e) {
		return y(`/api/teacher/groups/${encodeURIComponent(n.value.group?.id)}/itinerary`, {
			itinerary_id: e,
			expected_itinerary_id: p.value?.id || null
		});
	}
	function te(e) {
		return n.value.assignments.find((t) => t.id === e)?.title || e;
	}
	return Xn(() => {
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
		add: ee,
		select: S,
		assignmentTitle: te
	};
}
// services/portal/src/shared/usePortalTranslations.js
function Ia() {
	let e = /* @__PURE__ */ L(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), Xn(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
}
// services/portal/src/teacher/ItinerariesPanel.vue
var La = ["disabled", "placeholder"], Ra = { class: "actions" }, za = ["disabled"], Ba = ["disabled"], Va = { class: "hint" }, Ha = ["aria-busy"], Ua = {
	key: 0,
	role: "alert"
}, Wa = { key: 1 }, Ga = {
	key: 2,
	role: "status"
}, Ka = { key: 3 }, qa = { class: "hint" }, Ja = ["disabled"], Ya = { key: 1 }, Xa = { class: "cards itinerary-cards" }, Za = {
	key: 0,
	role: "status"
}, Qa = [
	"data-select-group-itinerary",
	"aria-label",
	"disabled",
	"onClick"
], $a = { class: "actions" }, eo = [
	"data-edit-itinerary",
	"data-itinerary-assignment",
	"data-itinerary-action",
	"aria-label",
	"disabled",
	"onClick"
], to = [
	"data-add-itinerary-item",
	"disabled",
	"onClick"
], no = { key: 3 }, ro = {
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
		let n = e, r = Ia(), { context: i, itineraries: a, title: o, ready: s, loading: c, pending: l, feedback: u, selected: d, unavailable: f, setContext: p, load: m, create: h, edit: g, add: _, select: v, assignmentTitle: y } = Fa(n.api, n.onSessionExpired);
		return t({
			setContext: p,
			load: m
		}), (e, t) => (J(), Y(G, null, [
			X("form", {
				class: "grid-fields",
				onSubmit: t[2] ||= Oa((...e) => R(h) && R(h)(...e), ["prevent"])
			}, [X("label", null, [X("span", null, E(R(r)("teacher.itineraryTitleLabel")), 1), xn(X("input", {
				id: "itineraryTitle",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ I(o) ? o.value = e : null,
				type: "text",
				disabled: !R(i).teacher || !R(i).group || R(l),
				placeholder: R(r)("teacher.itineraryTitlePlaceholder")
			}, null, 8, La), [[Ta, R(o)]])]), X("div", Ra, [X("button", {
				id: "createItinerary",
				type: "submit",
				disabled: R(f)
			}, E(R(r)("teacher.createItinerary")), 9, za), X("button", {
				id: "loadItineraries",
				type: "button",
				class: "secondary",
				disabled: !R(i).teacher || !R(i).group || R(l),
				onClick: t[1] ||= (...e) => R(m) && R(m)(...e)
			}, E(R(r)("teacher.loadItineraries")), 9, Ba)])], 32),
			X("p", Va, E(R(r)("teacher.itineraryHint")), 1),
			X("div", {
				id: "itinerariesOutput",
				class: T(["output", { empty: !R(a).length }]),
				"aria-busy": R(c) || R(l)
			}, [
				R(u) ? (J(), Y("p", Ua, E(R(r)(R(u))), 1)) : Z("", !0),
				!R(i).teacher || !R(i).group ? (J(), Y("p", Wa, E(R(r)("teacher.itinerariesEmpty")), 1)) : R(c) && !R(a).length ? (J(), Y("p", Ga, E(R(r)("teacher.itinerary.loading")), 1)) : R(s) && !R(a).length ? (J(), Y("p", Ka, E(R(r)("teacher.itinerariesEmptyList")), 1)) : Z("", !0),
				R(a).length ? (J(), Y(G, { key: 4 }, [
					X("p", qa, E(R(r)("teacher.itinerary.selectionHint")), 1),
					R(d) ? (J(), Y("button", {
						key: 0,
						class: "compact secondary",
						type: "button",
						"data-clear-group-itinerary": "",
						disabled: R(f),
						onClick: t[3] ||= (e) => R(v)(null)
					}, E(R(r)("teacher.itinerary.clearSelection")), 9, Ja)) : (J(), Y("p", Ya, E(R(r)("teacher.itinerary.noSelection")), 1)),
					X("div", Xa, [(J(!0), Y(G, null, U(R(a), (e) => (J(), Y("article", {
						key: e.id,
						class: "card itinerary-card"
					}, [
						X("strong", null, E(e.title), 1),
						e.is_selected ? (J(), Y("small", Za, E(R(r)("teacher.itinerary.selected")), 1)) : (J(), Y("button", {
							key: 1,
							class: "compact secondary",
							type: "button",
							"data-select-group-itinerary": e.id,
							"aria-label": R(r)("teacher.itinerary.selectLabel", { title: e.title }),
							disabled: R(f),
							onClick: (t) => R(v)(e.id)
						}, E(R(r)("teacher.itinerary.select")), 9, Qa)),
						X("small", null, E(R(r)("teacher.itinerarySteps", { count: e.items.length })), 1),
						X("ol", null, [(J(!0), Y(G, null, U(e.items, (t, n) => (J(), Y("li", { key: t.assignment_id }, [X("span", null, E(R(y)(t.assignment_id)), 1), X("div", $a, [(J(), Y(G, null, U([
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
							"aria-label": R(r)(`teacher.itinerary.${i}Label`, { title: R(y)(t.assignment_id) }),
							disabled: R(f) || i === "up" && n === 0 || i === "down" && n === e.items.length - 1,
							onClick: (n) => R(g)(e, t.assignment_id, i)
						}, E(R(r)(`teacher.itinerary.${i}`)), 9, eo)), 64))])]))), 128))]),
						X("small", null, E(R(r)("teacher.itinerary.removeHint")), 1),
						R(i).assignment ? (J(), Y("button", {
							key: 2,
							class: "compact secondary",
							type: "button",
							"data-add-itinerary-item": e.id,
							disabled: R(f),
							onClick: (t) => R(_)(e)
						}, E(R(r)("teacher.addSelectedActivity")), 9, to)) : (J(), Y("small", no, E(R(r)("teacher.selectAssignmentHint")), 1))
					]))), 128))])
				], 64)) : Z("", !0)
			], 10, Ha)
		], 64));
	}
}, io = ["aria-label", "aria-busy"], ao = {
	key: 0,
	role: "alert"
}, oo = { key: 0 }, so = { key: 1 }, co = { key: 2 }, lo = [
	"data-select-group",
	"aria-pressed",
	"disabled",
	"onClick"
], uo = { class: "actions" }, fo = ["disabled"], po = {
	__name: "GroupSelector",
	props: {
		api: Function,
		onSelect: Function,
		onDeleted: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ia(), i = /* @__PURE__ */ Wt({
			teacher: !1,
			group: null,
			groups: []
		}), a = /* @__PURE__ */ L(!1), o = /* @__PURE__ */ L(""), s = 0, c = !0;
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
		return t({ setContext: l }), Xn(() => {
			c = !1, s++;
		}), (e, t) => (J(), Y("section", {
			"aria-label": R(r)("teacher.groups"),
			"aria-busy": a.value
		}, [
			X("h3", null, E(R(r)("teacher.groups")), 1),
			o.value ? (J(), Y("p", ao, E(R(r)(o.value)), 1)) : Z("", !0),
			X("div", { class: T(["output", { empty: !i.value.teacher || !i.value.groups.length }]) }, [i.value.teacher ? i.value.groups.length ? (J(), Y("table", co, [X("thead", null, [X("tr", null, [
				X("th", null, E(R(r)("teacher.groupOpaque")), 1),
				X("th", null, E(R(r)("teacher.tenant")), 1),
				X("th", null, E(R(r)("teacher.active")), 1),
				X("th", null, E(R(r)("common.select")), 1)
			])]), X("tbody", null, [(J(!0), Y(G, null, U(i.value.groups, (e) => (J(), Y("tr", { key: e.id }, [
				X("td", null, E(e.name), 1),
				X("td", null, E(e.tenant_id), 1),
				X("td", null, E(e.active ?? 0), 1),
				X("td", null, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-select-group": e.id,
					"aria-pressed": i.value.group?.id === e.id,
					disabled: a.value,
					onClick: (t) => d(e.id)
				}, E(R(r)("common.select")), 9, lo)])
			]))), 128))])])) : (J(), Y("p", so, E(R(r)("common.tableEmpty")), 1)) : (J(), Y("p", oo, E(R(r)("teacher.errors.loginFirst")), 1))], 2),
			X("div", uo, [X("button", {
				id: "deleteGroup",
				type: "button",
				class: "danger",
				disabled: !i.value.teacher || !i.value.group || a.value,
				onClick: f
			}, E(R(r)("teacher.deleteGroup")), 9, fo)])
		], 8, io));
	}
}, mo = { class: "hint" }, ho = ["placeholder", "disabled"], go = { class: "actions" }, _o = ["disabled"], vo = ["disabled"], yo = ["aria-busy"], bo = {
	key: 0,
	role: "alert"
}, xo = { key: 1 }, So = { key: 2 }, Co = { key: 3 }, wo = { key: 4 }, To = [
	"data-remove-member",
	"disabled",
	"onClick"
], Eo = {
	__name: "GroupMembersPanel",
	props: {
		api: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ia(), i = /* @__PURE__ */ Wt({
			teacher: !1,
			group: null
		}), a = /* @__PURE__ */ L([]), o = /* @__PURE__ */ L(""), s = /* @__PURE__ */ L(!1), c = /* @__PURE__ */ L(!1), l = /* @__PURE__ */ L(!1), u = /* @__PURE__ */ L(""), d = Mi(() => !i.value.teacher || !i.value.group || s.value), f = 0, p = !0;
		function m(e) {
			(e.teacher !== i.value.teacher || e.group?.id !== i.value.group?.id) && (f++, a.value = [], o.value = "", s.value = !1, c.value = !1, l.value = !1, u.value = ""), i.value = e;
		}
		function h(e) {
			return p && f === e && i.value.teacher && i.value.group;
		}
		function g(e, t) {
			h(t) && (a.value = [], c.value = !1, l.value = !0, e.status === 401 ? (n.onSessionExpired(), u.value = "teacher.errors.loginFirst") : u.value = [403, 404].includes(e.status) ? "teacher.groupAccessUnavailable" : e.status === 422 ? "teacher.invalidMemberId" : "teacher.membersOperationError");
		}
		async function _(e, t) {
			let r = await n.api(`/api/teacher/groups/${encodeURIComponent(e)}/members`, { method: "GET" });
			if (h(t)) {
				if (r.group_id !== e) throw Error("wrong_group");
				a.value = r.members || [], c.value = !0, l.value = !1;
			}
		}
		async function v(e) {
			if (d.value) return;
			let t = f, n = i.value.group.id;
			s.value = !0, u.value = "";
			try {
				await e(n, t);
			} catch (e) {
				g(e, t);
			} finally {
				p && f === t && (s.value = !1);
			}
		}
		function y() {
			return v(_);
		}
		function b() {
			if (l.value) return;
			let e = o.value.trim();
			if (!/^(?:oidc:)?[A-Za-z0-9:_-]{3,128}$/.test(e) || e.length > 128) u.value = "teacher.invalidMemberId";
			else return v(async (t, r) => {
				await n.api(`/api/teacher/groups/${encodeURIComponent(t)}/members`, {
					method: "POST",
					body: JSON.stringify({
						teacher_id: e,
						role: "teacher"
					})
				}), h(r) && (o.value = "", await _(t, r));
			});
		}
		function x(e) {
			if (!l.value && e.role !== "owner" && confirm(r("teacher.confirmRemoveMember", { id: e.teacher_id }))) return v(async (t, r) => {
				await n.api(`/api/teacher/groups/${encodeURIComponent(t)}/members/${encodeURIComponent(e.teacher_id)}`, { method: "DELETE" }), h(r) && await _(t, r);
			});
		}
		return t({ setContext: m }), Xn(() => {
			p = !1, f++;
		}), (e, t) => (J(), Y(G, null, [
			X("p", mo, E(R(r)("teacher.membersHint")), 1),
			X("form", {
				class: "grid-fields",
				onSubmit: Oa(b, ["prevent"])
			}, [X("label", null, [X("span", null, E(R(r)("teacher.memberIdLabel")), 1), xn(X("input", {
				id: "memberTeacherId",
				"onUpdate:modelValue": t[0] ||= (e) => o.value = e,
				type: "text",
				maxlength: "128",
				placeholder: R(r)("teacher.memberIdPlaceholder"),
				autocomplete: "off",
				disabled: d.value || l.value
			}, null, 8, ho), [[Ta, o.value]])]), X("div", go, [X("button", {
				id: "addGroupMember",
				type: "submit",
				class: "secondary",
				disabled: d.value || l.value
			}, E(R(r)("teacher.addMember")), 9, _o), X("button", {
				id: "loadGroupMembers",
				type: "button",
				class: "secondary",
				disabled: d.value,
				onClick: y
			}, E(R(r)("teacher.loadMembers")), 9, vo)])], 32),
			X("div", {
				id: "membersOutput",
				class: T(["output", { empty: !c.value }]),
				"aria-busy": s.value
			}, [
				u.value ? (J(), Y("p", bo, E(R(r)(u.value)), 1)) : Z("", !0),
				!i.value.teacher || !i.value.group ? (J(), Y("p", xo, E(R(r)("teacher.membersEmpty")), 1)) : !c.value && !u.value ? (J(), Y("p", So, E(R(r)("teacher.membersPrompt")), 1)) : c.value && !a.value.length ? (J(), Y("p", Co, E(R(r)("common.tableEmpty")), 1)) : Z("", !0),
				a.value.length ? (J(), Y("table", wo, [X("thead", null, [X("tr", null, [
					X("th", null, E(R(r)("teacher.memberIdLabel")), 1),
					X("th", null, E(R(r)("common.status")), 1),
					X("th", null, E(R(r)("common.date")), 1),
					X("th", null, E(R(r)("teacher.removeMember")), 1)
				])]), X("tbody", null, [(J(!0), Y(G, null, U(a.value, (e) => (J(), Y("tr", { key: e.teacher_id }, [
					X("td", null, E(e.teacher_id), 1),
					X("td", null, E(e.role), 1),
					X("td", null, E(e.created_at), 1),
					X("td", null, [e.role === "owner" ? Z("", !0) : (J(), Y("button", {
						key: 0,
						type: "button",
						class: "compact danger",
						"data-remove-member": e.teacher_id,
						disabled: d.value || l.value,
						onClick: (t) => x(e)
					}, E(R(r)("teacher.removeMember")), 9, To))])
				]))), 128))])])) : Z("", !0)
			], 10, yo)
		], 64));
	}
};
// services/portal/src/teacher/useCredentials.js
function Do({ api: e, onCreated: t, onRefresh: n, onSessionExpired: r }) {
	let i = /* @__PURE__ */ Wt({
		teacher: !1,
		group: null,
		identities: [],
		groups: []
	}), a = /* @__PURE__ */ L("centre"), o = /* @__PURE__ */ L(6), s = /* @__PURE__ */ L(6), c = /* @__PURE__ */ L([]), l = /* @__PURE__ */ L(!1), u = /* @__PURE__ */ L(!1), d = /* @__PURE__ */ L(""), f = Mi(() => i.value.teacher ? i.value.identities.filter((e) => !i.value.group || e.group_id === i.value.group.id) : []), p = Mi(() => !i.value.teacher || l.value || u.value), m = 0, h = !0;
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
	function ee() {
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
	function S() {
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
	function te(t) {
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
	function ne(t, n) {
		if (n) return b(async (n) => {
			c.value = c.value.filter((e) => e.id !== t.id), await e(`/api/identities/${encodeURIComponent(t.id)}/revoke`, { method: "POST" }), n.current() && (d.value = "teacher.credentialsRevoked", await y(n));
		});
	}
	function re() {
		m++, g(), l.value = !1;
	}
	return window.addEventListener("pagehide", re), Xn(() => {
		h = !1, re(), window.removeEventListener("pagehide", re);
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
		create: ee,
		add: S,
		regenerate: te,
		revoke: ne
	};
}
// services/portal/src/teacher/credentialExports.js
function Oo(e, t) {
	let n = (e) => {
		let t = String(e);
		return /^[=+@-]/.test(t) && (t = "'" + t), "\"" + t.replaceAll("\"", "\"\"") + "\"";
	}, r = [["codi", "pin"], ...e.map((e) => [e.public_code, e.pin])], i = URL.createObjectURL(new Blob([r.map((e) => e.map(n).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" })), a = document.createElement("a");
	a.href = i, a.download = `edutictac-${String(t || "grup").replace(/[^\p{L}\p{N}_-]/gu, "-").slice(0, 80)}.csv`, document.body.append(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 1e3);
}
function ko(e, t, n) {
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
var Ao = ["disabled"], jo = ["disabled"], Mo = { class: "actions" }, No = ["disabled"], Po = ["role"], Fo = { key: 0 }, Io = { key: 1 }, Lo = ["aria-label"], Ro = { class: "pin-notice" }, zo = ["aria-label"], Bo = ["disabled"], Vo = ["disabled"], Ho = { class: "cards" }, Uo = ["aria-busy"], Wo = { key: 0 }, Go = { key: 1 }, Ko = { key: 2 }, qo = { class: "inline-actions" }, Jo = [
	"data-regenerate-pin",
	"disabled",
	"onClick"
], Yo = [
	"data-revoke-identity",
	"disabled",
	"onClick"
], Xo = { class: "subsection-heading" }, Zo = { class: "eyebrow" }, Qo = ["disabled"], $o = { class: "actions" }, es = ["disabled"], ts = {
	__name: "CredentialsPanel",
	props: {
		api: Function,
		onCreated: Function,
		onRefresh: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ia(), i = /* @__PURE__ */ L(null), a = () => {
			i.value && (i.value.hidden = !0);
		};
		window.addEventListener("pagehide", a), Xn(() => window.removeEventListener("pagehide", a));
		let { context: o, tenant: s, count: c, additionalCount: l, fresh: u, pending: d, feedback: f, identities: p, unavailable: m, setContext: h, create: g, add: _, regenerate: v, revoke: y } = Do(n);
		function b() {
			ko(u.value, o.value.group?.group_code, r) || (f.value = "teacher.credentialsPopupBlocked");
		}
		function x(e) {
			y(e, confirm(r("teacher.confirmRevoke", { label: e.public_code })));
		}
		return t({ setContext: h }), (e, t) => (J(), Y(G, null, [X("form", {
			class: "grid-fields",
			onSubmit: t[2] ||= Oa((...e) => R(g) && R(g)(...e), ["prevent"])
		}, [
			X("label", null, [X("span", null, E(R(r)("teacher.tenantLabel")), 1), xn(X("input", {
				id: "tenantId",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ I(s) ? s.value = e : null,
				type: "text",
				maxlength: "200",
				disabled: R(m)
			}, null, 8, Ao), [[Ta, R(s)]])]),
			X("label", null, [X("span", null, E(R(r)("common.students")), 1), xn(X("input", {
				id: "identityCount",
				"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ I(c) ? c.value = e : null,
				type: "number",
				min: "1",
				max: "30",
				required: "",
				disabled: R(m)
			}, null, 8, jo), [[
				Ta,
				R(c),
				void 0,
				{ number: !0 }
			]])]),
			X("div", Mo, [X("button", {
				id: "createBatch",
				type: "submit",
				disabled: R(m)
			}, E(R(r)("teacher.generateCredentials")), 9, No)])
		], 32), (J(), ei(Pn, { to: "#credentialsDetails" }, [
			R(f) ? (J(), Y("p", {
				key: 0,
				role: R(f).includes("Error") || R(f).includes("Unavailable") || R(f).includes("loginFirst") || R(f).includes("Blocked") ? "alert" : "status"
			}, [li(E(R(r)(R(f))) + " ", 1), R(f) === "teacher.groupCreated" ? (J(), Y("strong", Fo, E(R(o).group?.group_code), 1)) : R(f) === "teacher.pinRegenerated" ? (J(), Y("strong", Io, E(R(u).at(-1)?.public_code), 1)) : Z("", !0)], 8, Po)) : Z("", !0),
			R(o).teacher && R(u).length ? (J(), Y("section", {
				key: 1,
				id: "freshCredentials",
				ref_key: "freshPanel",
				ref: i,
				"aria-label": R(r)("teacher.generateCredentials")
			}, [
				X("p", Ro, E(R(r)("teacher.credentialsFreshHint")), 1),
				X("div", {
					class: "export-actions",
					"aria-label": R(r)("teacher.exports")
				}, [X("button", {
					type: "button",
					class: "secondary",
					"data-print-batch": "",
					disabled: R(d),
					onClick: b
				}, E(R(r)("teacher.printBatch")), 9, Bo), X("button", {
					type: "button",
					class: "secondary",
					"data-download-batch-csv": "",
					disabled: R(d),
					onClick: t[3] ||= (e) => R(Oo)(R(u), R(o).group?.group_code)
				}, E(R(r)("teacher.downloadBatchCsv")), 9, Vo)], 8, zo),
				X("div", Ho, [(J(!0), Y(G, null, U(R(u), (e) => (J(), Y("article", {
					key: e.id,
					class: "credential"
				}, [X("strong", null, E(e.public_code), 1), X("span", null, "PIN " + E(e.pin), 1)]))), 128))])
			], 8, Lo)) : Z("", !0),
			X("section", {
				id: "credentialsOutput",
				class: T(["output", { empty: !R(o).teacher || !R(p).length }]),
				"aria-busy": R(d)
			}, [X("h3", null, E(R(o).group ? R(r)("teacher.activeCredentials") : R(r)("teacher.recentCredentials")), 1), R(o).teacher ? R(p).length ? (J(), Y("table", Ko, [X("thead", null, [X("tr", null, [
				X("th", null, E(R(r)("common.code")), 1),
				X("th", null, E(R(r)("common.group")), 1),
				X("th", null, E(R(r)("teacher.pinUpdated")), 1),
				X("th", null, E(R(r)("teacher.credentialActions")), 1)
			])]), X("tbody", null, [(J(!0), Y(G, null, U(R(p), (e) => (J(), Y("tr", { key: e.id }, [
				X("td", null, E(e.public_code), 1),
				X("td", null, E(R(o).groups.find((t) => t.id === e.group_id)?.name || e.group_name || e.group_id), 1),
				X("td", null, E(e.pin_rotated_at || ""), 1),
				X("td", null, [X("div", qo, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-regenerate-pin": e.id,
					disabled: R(m),
					onClick: (t) => R(v)(e)
				}, E(R(r)("teacher.regeneratePin")), 9, Jo), X("button", {
					type: "button",
					class: "compact danger",
					"data-revoke-identity": e.id,
					disabled: R(m),
					onClick: (t) => x(e)
				}, E(R(r)("teacher.revoke")), 9, Yo)])])
			]))), 128))])])) : (J(), Y("p", Go, E(R(r)("common.tableEmpty")), 1)) : (J(), Y("p", Wo, E(R(r)("teacher.errors.loginFirst")), 1))], 10, Uo),
			X("div", Xo, [X("span", Zo, E(R(r)("teacher.groupTools")), 1)]),
			X("form", {
				class: "grid-fields",
				onSubmit: t[5] ||= Oa((...e) => R(_) && R(_)(...e), ["prevent"])
			}, [X("label", null, [X("span", null, E(R(r)("teacher.addStudentsCount")), 1), xn(X("input", {
				id: "additionalIdentityCount",
				"onUpdate:modelValue": t[4] ||= (e) => /* @__PURE__ */ I(l) ? l.value = e : null,
				type: "number",
				min: "1",
				max: "120",
				required: "",
				disabled: R(m) || !R(o).group
			}, null, 8, Qo), [[
				Ta,
				R(l),
				void 0,
				{ number: !0 }
			]])]), X("div", $o, [X("button", {
				id: "addGroupIdentities",
				type: "submit",
				class: "secondary",
				disabled: R(m) || !R(o).group
			}, E(R(r)("teacher.addStudents")), 9, es)])], 32)
		]))], 64));
	}
}, ns = ["aria-busy"], rs = {
	key: 0,
	role: "alert"
}, is = { key: 1 }, as = { key: 0 }, os = { class: "teacher-context" }, ss = { key: 0 }, cs = { key: 0 }, ls = ["aria-label"], us = ["href"], ds = ["href"], fs = ["href"], ps = { key: 0 }, ms = { key: 2 }, hs = { key: 3 }, gs = [
	"data-select-assignment",
	"aria-pressed",
	"disabled",
	"onClick"
], _s = {
	__name: "AssignmentsPanel",
	props: {
		onSelect: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ia(), i = /* @__PURE__ */ Wt({
			teacher: !1,
			group: null,
			groups: [],
			assignments: [],
			assignment: null,
			summary: null,
			dataReady: !1
		}), a = /* @__PURE__ */ L(!1), o = /* @__PURE__ */ L(""), s = 0, c = !0;
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
		}), Xn(() => {
			c = !1, s++;
		}), (e, t) => (J(), Y("section", {
			id: "teacherOutput",
			class: T(["output", { empty: !i.value.teacher }]),
			"aria-busy": a.value || i.value.teacher && !i.value.dataReady
		}, [o.value ? (J(), Y("p", rs, E(R(r)(o.value)), 1)) : Z("", !0), i.value.teacher ? (J(), Y(G, { key: 2 }, [
			i.value.summary ? (J(), Y("p", as, [X("strong", null, E(i.value.summary.active || 0), 1), li(" " + E(R(r)("teacher.activeOfTotal", { total: i.value.summary.total || 0 })), 1)])) : Z("", !0),
			X("div", os, [
				X("p", null, [li(E(R(r)(i.value.group ? "teacher.groupSelected" : "teacher.noGroupSelected")) + " ", 1), i.value.group ? (J(), Y("strong", ss, E(i.value.group.group_code || i.value.group.name), 1)) : Z("", !0)]),
				X("p", null, [li(E(R(r)(i.value.assignment ? "teacher.activitySelected" : "teacher.noActivitySelected")) + " ", 1), i.value.assignment && i.value.dataReady ? (J(), Y("strong", cs, E(i.value.assignments.find((e) => e.id === i.value.assignment.id)?.title || ""), 1)) : Z("", !0)]),
				X("div", {
					class: "export-actions",
					"aria-label": R(r)("teacher.exports")
				}, [i.value.group ? (J(), Y(G, { key: 0 }, [X("a", {
					class: "button-link",
					href: `/api/groups/${encodeURIComponent(i.value.group.id)}/cards`,
					target: "_blank",
					rel: "noopener"
				}, E(R(r)("teacher.cards")), 9, us), X("a", {
					class: "button-link secondary",
					href: `/api/groups/${encodeURIComponent(i.value.group.id)}/csv`,
					target: "_blank",
					rel: "noopener"
				}, E(R(r)("teacher.csvCodes")), 9, ds)], 64)) : Z("", !0), X("a", {
					class: "button-link secondary",
					href: "/api/teacher/stats.csv" + (i.value.group ? "?group_id=" + encodeURIComponent(i.value.group.id) : ""),
					target: "_blank",
					rel: "noopener"
				}, E(R(r)("teacher.csvStats")), 9, fs)], 8, ls)
			]),
			X("h3", null, E(R(r)("teacher.assignments")), 1),
			i.value.dataReady ? i.value.assignments.length ? (J(), Y("table", hs, [X("thead", null, [X("tr", null, [
				X("th", null, E(R(r)("common.title")), 1),
				X("th", null, E(R(r)("common.group")), 1),
				X("th", null, E(R(r)("common.activity")), 1),
				X("th", null, E(R(r)("common.select")), 1)
			])]), X("tbody", null, [(J(!0), Y(G, null, U(i.value.assignments, (e) => (J(), Y("tr", { key: e.id }, [
				X("td", null, E(e.title), 1),
				X("td", null, E(i.value.groups.find((t) => t.id === e.group_id)?.name || e.group_id), 1),
				X("td", null, E(e.activity_id), 1),
				X("td", null, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-select-assignment": e.id,
					"aria-pressed": i.value.assignment?.id === e.id,
					disabled: a.value,
					onClick: (t) => d(e.id)
				}, E(R(r)("common.select")), 9, gs)])
			]))), 128))])])) : (J(), Y("p", ms, E(R(r)("common.tableEmpty")), 1)) : (J(), Y(G, { key: 1 }, [o.value ? Z("", !0) : (J(), Y("p", ps, E(R(r)("teacher.assignmentsLoading")), 1))], 64))
		], 64)) : (J(), Y("p", is, E(R(r)("teacher.errors.loginFirst")), 1))], 10, ns));
	}
};
// services/portal/src/teacher/useResults.js
function vs(e, t) {
	let n = /* @__PURE__ */ Wt({
		teacher: !1,
		group: null,
		assignment: null,
		assignments: [],
		dataReady: !1
	}), r = Mi(() => n.value.assignments.find((e) => e.id === n.value.assignment?.id)), i = /* @__PURE__ */ L([]), a = /* @__PURE__ */ L("results"), o = /* @__PURE__ */ L(!1), s = /* @__PURE__ */ L(!1), c = /* @__PURE__ */ L(!1), l = /* @__PURE__ */ L(""), u = 0, d = 0, f = !0, p = Mi(() => !n.value.teacher || !r.value || !n.value.dataReady || c.value);
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
	return Xn(() => {
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
var ys = { class: "actions" }, bs = ["disabled"], xs = ["disabled"], Ss = ["aria-busy"], Cs = {
	key: 0,
	role: "alert"
}, ws = { key: 1 }, Ts = {
	key: 2,
	role: "status"
}, Es = { key: 3 }, Ds = {
	key: 0,
	class: "hint"
}, Os = { key: 1 }, ks = { key: 2 }, As = [
	"data-mark-completed",
	"data-unmark-completed",
	"disabled",
	"onClick"
], js = { key: 3 }, Ms = {
	__name: "ResultsPanel",
	props: {
		api: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ia(), { context: i, assignment: a, rows: o, mode: s, ready: c, loading: l, pending: u, feedback: d, unavailable: f, setContext: p, load: m, complete: h } = vs(n.api, n.onSessionExpired);
		return t({ setContext: p }), (e, t) => (J(), Y(G, null, [X("div", ys, [X("button", {
			id: "loadResults",
			type: "button",
			disabled: R(f),
			onClick: t[0] ||= (e) => R(m)("results")
		}, E(R(r)("teacher.viewResults")), 9, bs), X("button", {
			id: "loadRanking",
			type: "button",
			class: "secondary",
			disabled: R(f),
			onClick: t[1] ||= (e) => R(m)("ranking")
		}, E(R(r)("teacher.viewRanking")), 9, xs)]), X("div", {
			id: "resultsOutput",
			class: T(["output", { empty: !R(c) }]),
			"aria-busy": R(l) || R(u)
		}, [
			R(d) ? (J(), Y("p", Cs, E(R(r)(R(d))), 1)) : Z("", !0),
			R(i).teacher && R(a) && R(i).dataReady ? (J(), Y("p", ws, [X("strong", null, E(R(a).title || R(a).activity_id), 1)])) : Z("", !0),
			R(l) ? (J(), Y("p", Ts, E(R(r)("teacher.resultsLoading")), 1)) : !R(c) && !R(d) ? (J(), Y("p", Es, E(R(r)("teacher.resultsPlaceholder")), 1)) : Z("", !0),
			R(i).teacher && R(a) && R(i).dataReady && R(c) ? (J(), Y(G, { key: 4 }, [R(s) === "ranking" ? (J(), Y("p", Ds, E(R(r)("teacher.activityRanking")), 1)) : Z("", !0), R(o).length ? R(s) === "results" ? (J(), Y("table", ks, [X("thead", null, [X("tr", null, [
				X("th", null, E(R(r)("common.code")), 1),
				X("th", null, E(R(r)("common.attempts")), 1),
				X("th", null, E(R(r)("common.bestScore")), 1),
				X("th", null, E(R(r)("common.lastScoreAt")), 1),
				X("th", null, E(R(r)("common.status")), 1),
				X("th", null, E(R(r)("teacher.markCompleted")), 1)
			])]), X("tbody", null, [(J(!0), Y(G, null, U(R(o), (e) => (J(), Y("tr", { key: e.identity_id }, [
				X("td", null, E(e.public_code), 1),
				X("td", null, E(e.attempts), 1),
				X("td", null, E(e.best_score ?? ""), 1),
				X("td", null, E(e.last_score_at || ""), 1),
				X("td", null, E(R(r)(e.completed ? "student.done" : "student.pending")), 1),
				X("td", null, [X("button", {
					type: "button",
					class: "compact secondary",
					"data-mark-completed": e.completed ? void 0 : R(a).id + ":" + e.identity_id,
					"data-unmark-completed": e.completed ? R(a).id + ":" + e.identity_id : void 0,
					disabled: R(f) || R(l),
					onClick: (t) => R(h)(e)
				}, E(R(r)(e.completed ? "teacher.unmarkCompleted" : "teacher.markCompleted")), 9, As)])
			]))), 128))])])) : (J(), Y("table", js, [X("thead", null, [X("tr", null, [
				X("th", null, E(R(r)("common.code")), 1),
				X("th", null, E(R(r)("common.score")), 1),
				X("th", null, E(R(r)("common.date")), 1)
			])]), X("tbody", null, [(J(!0), Y(G, null, U(R(o), (e, t) => (J(), Y("tr", { key: t }, [
				X("td", null, E(e.public_code), 1),
				X("td", null, E(e.score), 1),
				X("td", null, E(e.ts), 1)
			]))), 128))])])) : (J(), Y("p", Os, E(R(r)("common.tableEmpty")), 1))], 64)) : Z("", !0)
		], 10, Ss)], 64));
	}
};
// services/portal/src/teacher/resourceAssignment.js
function Ns(e, t, n = window.location) {
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
function Ps(e, t, n) {
	let r = /* @__PURE__ */ Wt({
		teacher: !1,
		group: null,
		dataReady: !1,
		resourcesEnabled: !0
	}), i = /* @__PURE__ */ L(""), a = /* @__PURE__ */ L([]), o = /* @__PURE__ */ L(!1), s = /* @__PURE__ */ L(!1), c = /* @__PURE__ */ L(!1), l = /* @__PURE__ */ L(!1), u = /* @__PURE__ */ L(!1), d = /* @__PURE__ */ L(""), f = /* @__PURE__ */ L(0), p = 0, m = 0, h = !0, g = Mi(() => !r.value.teacher || !r.value.group || !r.value.dataReady || !r.value.resourcesEnabled || c.value || l.value || u.value);
	function _(e) {
		return h && e === p;
	}
	function v(e) {
		(e.teacher !== r.value.teacher || e.group?.id !== r.value.group?.id || e.resourcesEnabled !== r.value.resourcesEnabled) && (p++, m++, a.value = [], o.value = !1, s.value = !1, c.value = !1, u.value = !1, d.value = "", f.value = 0), r.value = e;
	}
	async function y(t = !1) {
		if (!r.value.resourcesEnabled || l.value || t && !r.value.teacher) return;
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
			y = v.map((e) => Ns(e, c));
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
	return Xn(() => {
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
var Fs = ["placeholder"], Is = { class: "actions" }, Ls = ["disabled"], Rs = ["disabled"], zs = ["disabled"], Bs = { key: 0 }, Vs = ["aria-busy"], Hs = {
	key: 0,
	role: "status"
}, Us = {
	key: 1,
	role: "status"
}, Ws = {
	key: 2,
	role: "status"
}, Gs = { key: 3 }, Ks = {
	key: 4,
	class: "hint"
}, qs = {
	key: 5,
	class: "cards"
}, Js = [
	"data-assign-resource",
	"disabled",
	"onClick"
], Ys = {
	__name: "ResourcesPanel",
	props: {
		api: Function,
		onSessionExpired: Function,
		onAssigned: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = Ia(), { context: i, search: a, rows: o, loaded: s, basket: c, loading: l, pending: u, feedback: d, completedCount: f, unavailable: p, setContext: m, load: h, assign: g } = Ps(n.api, n.onSessionExpired, n.onAssigned);
		return t({ setContext: m }), (e, t) => (J(), Y(G, null, [
			X("form", {
				class: "grid-fields",
				onSubmit: t[3] ||= Oa((e) => R(h)(!1), ["prevent"])
			}, [X("label", null, [X("span", null, E(R(r)("teacher.resourcesSearch")), 1), xn(X("input", {
				id: "resourceSearch",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ I(a) ? a.value = e : null,
				type: "search",
				placeholder: R(r)("teacher.resourcesPlaceholder")
			}, null, 8, Fs), [[Ta, R(a)]])]), X("div", Is, [
				X("button", {
					id: "searchResources",
					type: "submit",
					class: "secondary",
					disabled: R(u) || !R(i).resourcesEnabled
				}, E(R(r)("teacher.resourcesButton")), 9, Ls),
				X("button", {
					id: "loadFavoriteResources",
					type: "button",
					class: "secondary",
					disabled: R(u) || !R(i).teacher || !R(i).resourcesEnabled,
					onClick: t[1] ||= (e) => R(h)(!0)
				}, E(R(r)("teacher.favoritesButton")), 9, Rs),
				X("button", {
					id: "assignFavoriteResources",
					type: "button",
					disabled: R(p) || !R(c) || !R(o).length,
					onClick: t[2] ||= (e) => R(g)()
				}, E(R(r)("teacher.assignBasket")), 9, zs)
			])], 32),
			R(i).teacher && R(i).group ? (J(), Y("p", Bs, [li(E(R(r)("teacher.groupSelected")) + " ", 1), X("strong", null, E(R(i).group.group_code || R(i).group.name), 1)])) : Z("", !0),
			X("div", {
				id: "resourcesOutput",
				class: T(["output", { empty: !R(o).length }]),
				"aria-busy": R(l) || R(u)
			}, [
				R(d) ? (J(), Y("p", Hs, E(R(r)(R(d), { count: R(f) })), 1)) : Z("", !0),
				R(u) ? (J(), Y("p", Us, E(R(r)("teacher.assigningBasket")), 1)) : R(l) ? (J(), Y("p", Ws, E(R(r)("teacher.resourcesLoading")), 1)) : !R(o).length && !R(d) ? (J(), Y("p", Gs, E(R(r)(R(s) ? "teacher.resourcesEmpty" : "teacher.resourcesHint")), 1)) : Z("", !0),
				R(c) && R(o).length ? (J(), Y("p", Ks, E(R(r)("teacher.basketHint", { count: R(o).length })), 1)) : Z("", !0),
				R(o).length ? (J(), Y("div", qs, [(J(!0), Y(G, null, U(R(o), (e, t) => (J(), Y("article", {
					key: t,
					class: "card"
				}, [
					X("strong", null, E(e.title || e.external_id), 1),
					X("small", null, E(e.provider || e.format || "resource") + " · " + E(e.subject || ""), 1),
					X("button", {
						class: "compact secondary",
						type: "button",
						"data-assign-resource": e.external_id,
						disabled: R(p),
						onClick: (t) => R(g)(e)
					}, E(R(r)("teacher.assignResource")), 9, Js)
				]))), 128))])) : Z("", !0)
			], 10, Vs)
		], 64));
	}
};
// services/portal/src/teacher/main.js
function Xs(e, t) {
	return Ma(ro, t).mount(e);
}
function Zs(e, t) {
	return Ma(po, t).mount(e);
}
function Qs(e, t) {
	return Ma(Eo, t).mount(e);
}
function $s(e, t) {
	return Ma(ts, t).mount(e);
}
function ec(e, t) {
	return Ma(_s, t).mount(e);
}
function tc(e, t) {
	return Ma(Ms, t).mount(e);
}
function nc(e, t) {
	return Ma(Ys, t).mount(e);
}
export { ec as mountAssignments, $s as mountCredentials, Zs as mountGroups, Xs as mountItineraries, Qs as mountMembers, nc as mountResources, tc as mountResults };
