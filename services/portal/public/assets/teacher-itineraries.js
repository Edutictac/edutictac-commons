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
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), ee = (e) => x(e).slice(8, -1), te = (e) => x(e) === "[object Object]", ne = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, re = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ie = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ae = /-\w/g, S = ie((e) => e.replace(ae, (e) => e.slice(1).toUpperCase())), oe = /\B([A-Z])/g, C = ie((e) => e.replace(oe, "-$1").toLowerCase()), se = ie((e) => e.charAt(0).toUpperCase() + e.slice(1)), ce = ie((e) => e ? `on${se(e)}` : ""), w = (e, t) => !Object.is(e, t), le = (e, ...t) => {
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
var Ee = (e) => !!(e && e.__v_isRef === !0), E = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Ee(e) ? E(e.value) : JSON.stringify(e, De, 2) : String(e), De = (e, t) => Ee(t) ? De(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Oe(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Oe(e)) } : _(t) ? Oe(t) : v(t) && !d(t) && !te(t) ? String(t) : t, Oe = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, D, ke = class {
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
		(t.version === 0 || w(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
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
		let i = d(e), a = i && ne(n);
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
	let t = /* @__PURE__ */ I(e);
	return t === e || (A(t, "iterate", tt), /* @__PURE__ */ F(e)) ? t : /* @__PURE__ */ P(e) ? /* @__PURE__ */ Rt(e) ? t.map((e) => Vt(L(e))) : t.map(Vt) : t.map(L);
}
function rt(e) {
	return A(e = /* @__PURE__ */ I(e), "iterate", tt), e;
}
function M(e, t) {
	return /* @__PURE__ */ P(e) ? Vt(/* @__PURE__ */ Rt(e) ? L(t) : t) : L(t);
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
		return N(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return N(this, "filter", e, t, (e) => e.map((e) => M(this, e)), arguments);
	},
	find(e, t) {
		return N(this, "find", e, t, (e) => M(this, e), arguments);
	},
	findIndex(e, t) {
		return N(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return N(this, "findLast", e, t, (e) => M(this, e), arguments);
	},
	findLastIndex(e, t) {
		return N(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return N(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return lt(this, "includes", e);
	},
	indexOf(...e) {
		return lt(this, "indexOf", e);
	},
	join(e) {
		return nt(this).join(e);
	},
	lastIndexOf(...e) {
		return lt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return N(this, "map", e, t, void 0, arguments);
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
		return N(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ut(this, "splice", e);
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
		return ut(this, "unshift", e);
	},
	values() {
		return at(this, "values", (e) => M(this, e));
	}
};
function at(e, t, n) {
	let r = rt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ F(e)) {
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
function N(e, t, n, r, i, a) {
	let o = rt(e), s = o !== e && !/* @__PURE__ */ F(e), c = o[t];
	if (c !== st[t]) {
		let t = c.apply(e, a);
		return s ? L(t) : t;
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
function ct(e, t, n, r) {
	let i = rt(e), a = i !== e && !/* @__PURE__ */ F(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = M(e, t)), n.call(this, t, M(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? M(e, c) : c;
}
function lt(e, t, n) {
	let r = /* @__PURE__ */ I(e);
	A(r, "iterate", tt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ zt(n[0]) ? (n[0] = /* @__PURE__ */ I(n[0]), r[t](...n)) : i;
}
function ut(e, t, n = []) {
	Ge(), Ie();
	let r = (/* @__PURE__ */ I(e))[t].apply(e, n);
	return Le(), Ke(), r;
}
var dt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ft = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function pt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ I(this);
	return A(t, "has", e), t.hasOwnProperty(e);
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
			if (a && (e = it[t])) return e;
			if (t === "hasOwnProperty") return pt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ R(e) ? e : n);
		if ((_(t) ? ft.has(t) : dt(t)) || (r || A(e, "get", t), i)) return o;
		if (/* @__PURE__ */ R(o)) {
			let e = a && ne(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ It(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ It(o) : /* @__PURE__ */ Pt(o) : o;
	}
}, ht = class extends mt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && ne(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ P(i);
			if (!/* @__PURE__ */ F(n) && !/* @__PURE__ */ P(n) && (i = /* @__PURE__ */ I(i), n = /* @__PURE__ */ I(n)), !a && /* @__PURE__ */ R(i) && !/* @__PURE__ */ R(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ R(e) ? e : r);
		return e === /* @__PURE__ */ I(r) && s && (o ? w(n, i) && j(e, "set", t, n, i) : j(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && j(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && ft.has(t) || A(e, "has", t), n;
	}
	ownKeys(e) {
		return A(e, "iterate", d(e) ? "length" : $e), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ I(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? bt : t ? Vt : L;
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
function Ct(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function wt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ I(r), a = /* @__PURE__ */ I(n);
			e || (w(n, a) && A(i, "get", n), A(i, "get", a));
			let { has: o } = xt(i), s = t ? bt : e ? Vt : L;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && A(/* @__PURE__ */ I(t), "iterate", $e), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ I(n), i = /* @__PURE__ */ I(t);
			return e || (w(t, i) && A(r, "has", t), A(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ I(a), s = t ? bt : e ? Vt : L;
			return !e && A(o, "iterate", $e), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: Ct("add"),
		set: Ct("set"),
		delete: Ct("delete"),
		clear: Ct("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ I(this), r = xt(n), i = /* @__PURE__ */ I(e), a = !t && !/* @__PURE__ */ F(e) && !/* @__PURE__ */ P(e) ? i : e;
			return r.has.call(n, a) || w(e, a) && r.has.call(n, e) || w(i, a) && r.has.call(n, i) || (n.add(a), j(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ F(n) || /* @__PURE__ */ P(n) || (n = /* @__PURE__ */ I(n));
			let r = /* @__PURE__ */ I(this), { has: i, get: a } = xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ I(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? w(n, s) && j(r, "set", e, n, s) : j(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ I(this), { has: n, get: r } = xt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ I(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && j(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ I(this), t = e.size !== 0, n = e.clear();
			return t && j(e, "clear", void 0, void 0, void 0), n;
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
	return /* @__PURE__ */ P(e) ? e : Lt(e, !1, _t, Et, kt);
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
	let o = Nt(ee(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return /* @__PURE__ */ P(e) ? /* @__PURE__ */ Rt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function F(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function I(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ I(t) : e;
}
function Bt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && ue(e, "__v_skip", !0), e;
}
var L = (e) => v(e) ? /* @__PURE__ */ Pt(e) : e, Vt = (e) => v(e) ? /* @__PURE__ */ It(e) : e;
// @__NO_SIDE_EFFECTS__
function R(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	return Ut(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return Ut(e, !0);
}
function Ut(e, t) {
	return /* @__PURE__ */ R(e) ? e : new Wt(e, t);
}
var Wt = class {
	constructor(e, t) {
		this.dep = new Xe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ I(e), this._value = t ? e : L(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ F(e) || /* @__PURE__ */ P(e);
		e = n ? e : /* @__PURE__ */ I(e), w(e, t) && (this._rawValue = e, this._value = n ? e : L(e), this.dep.trigger());
	}
};
function B(e) {
	return /* @__PURE__ */ R(e) ? e.value : e;
}
var Gt = {
	get: (e, t, n) => t === "__v_raw" ? e : B(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ R(i) && !/* @__PURE__ */ R(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Kt(e) {
	return /* @__PURE__ */ Rt(e) ? e : new Proxy(e, Gt);
}
var qt = class {
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
function Jt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new qt(r, i, n);
}
function Yt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ R(e)) Yt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Yt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Yt(e, t, n);
	});
	else if (te(e)) {
		for (let r in e) Yt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Yt(e[r], t, n);
	}
	return e;
}
// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Xt(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Qt(e, t, n);
	}
}
function Zt(e, t, n, r) {
	if (h(e)) {
		let i = Xt(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Qt(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Zt(e[a], t, n, r));
		return i;
	}
}
function Qt(e, n, r, i = !0) {
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
			Ge(), Xt(o, null, 10, [
				e,
				i,
				a
			]), Ke();
			return;
		}
	}
	$t(e, r, a, i, s);
}
function $t(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var V = [], H = -1, U = [], en = null, tn = 0, nn = /* @__PURE__ */ Promise.resolve(), rn = null;
function an(e) {
	let t = rn || nn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function on(e) {
	let t = H + 1, n = V.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = V[r], a = mn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function sn(e) {
	if (!(e.flags & 1)) {
		let t = mn(e), n = V[V.length - 1];
		!n || !(e.flags & 2) && t >= mn(n) ? V.push(e) : V.splice(on(t), 0, e), e.flags |= 1, cn();
	}
}
function cn() {
	rn ||= nn.then(hn);
}
function ln(e) {
	if (!d(e)) en && e.id === -1 ? en.splice(tn + 1, 0, e) : e.flags & 1 || (U.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) U.push(e[t]);
	cn();
}
function un(e, t, n, r = H + 1) {
	for (; r < V.length; r++) {
		let n = V[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			V.splice(r, 1), r = e ? r - 1 : H, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function dn(e, t, n = 0) {
	if (U.length) {
		let e = U, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < U.length; i++) {
				let a = U[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? U[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => mn(e) - mn(t));
		if (U.length = r, en) {
			for (let e = 0; e < i.length; e++) en.push(i[e]);
			return;
		}
		for (en = i, tn = 0; tn < en.length; tn++) {
			let e = en[tn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		en = null, tn = 0;
	}
}
var fn = !1;
function pn(e, t) {
	if (fn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(U);
	e(), fn = !0;
	try {
		un(void 0, t), dn(void 0, n, t);
	} finally {
		fn = !1;
	}
}
var mn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function hn(e) {
	try {
		for (H = 0; H < V.length; H++) {
			let e = V[H];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Xt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; H < V.length; H++) {
			let e = V[H];
			e && (e.flags &= -2);
		}
		H = -1, V.length = 0, dn(e), rn = null, (V.length || U.length) && hn(e);
	}
}
var W = null, gn = null;
function _n(e) {
	let t = W;
	return W = e, gn = e && e.type.__scopeId || null, t;
}
function vn(e, t = W, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && zr(-1);
		let i = _n(t), a = Ir.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ir.length; e > a; e--) Lr();
			_n(i), r._d && zr(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function yn(e, n) {
	if (W === null) return e;
	let r = vi(W), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Yt(o), i.push({
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
function bn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ge(), Zt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ke());
	}
}
var xn = /* @__PURE__ */ Symbol("_vte"), Sn = (e) => e.__isTeleport, Cn = /* @__PURE__ */ Symbol("_leaveCb");
function wn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== q) {
			t = n;
			break;
		}
	}
	return t;
}
function Tn(e) {
	if (!Pn(e)) return Sn(e.type) && e.children ? wn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function En(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		En(Sn(n.type) && Tn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === K && d(e.children)) {
		let n = Qn(e.children, !1);
		n && En(n, t);
	}
}
function Dn(e) {
	if (e.component) return Dn(e.component.subTree);
	if (e.type === K) {
		let t = d(e.children) && Qn(e.children, !1);
		return t ? Dn(t) : void 0;
	}
	if (e.type !== q) return e;
}
function On(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function kn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var An = /* @__PURE__ */ new WeakMap();
function jn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => jn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Nn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && jn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? vi(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ I(v), b = v === t ? i : (e) => !kn(_, e) && u(y, e), x = (e, t) => !(t && kn(_, t));
	if (m != null && m !== p) {
		if (Mn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ R(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) Xt(p, f, 12, [l, _]);
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
					i(), An.delete(e);
				};
				t.id = -1, An.set(e, t), G(t, r);
			} else Mn(e), i();
		}
	}
}
function Mn(e) {
	let t = An.get(e);
	t && (t.flags |= 8, An.delete(e));
}
pe().requestIdleCallback, pe().cancelIdleCallback;
var Nn = (e) => !!e.type.__asyncLoader, Pn = (e) => e.type.__isKeepAlive;
function Fn(e, t, n = ai, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ge();
			let i = ci(n), a = Zt(t, n, e, r);
			return i(), Ke(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var In = ((e) => (t, n = ai) => {
	di || Fn(e, (...e) => t(...e), n);
})("bum"), Ln = /* @__PURE__ */ Symbol.for("v-ndc");
function Rn(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Rt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ F(e), s = /* @__PURE__ */ P(e), e = rt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Vt(L(e[n])) : L(e[n]) : e[n], n, void 0, a && a[n]);
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
var zn = (e) => e ? ui(e) ? vi(e) : zn(e.parent) : null, Bn = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
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
		sn(e.update);
	},
	$nextTick: (e) => e.n ||= an.bind(e.proxy),
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
		if (d) return n === "$attrs" && A(e.attrs, "get", ""), d(e);
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
			version: xi,
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
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, vi(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (Zt(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
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
var Kn = null, qn = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${S(t)}Modifiers`] || e[`${C(t)}Modifiers`];
function Jn(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && qn(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(de)));
	let c, l = i[c = ce(n)] || i[c = ce(S(n))];
	!l && o && (l = i[c = ce(C(n))]), l && Zt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Zt(u, e, 6, a);
	}
}
function Yn(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function Xn(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, C(t)) || u(e, t));
}
function Zn(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = _n(e), v, y;
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
			}) : e(f, null)), y = t.props ? c : $n(c);
		}
	} catch (t) {
		Ir.length = 0, Qt(t, e, 1), v = Kr(q);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = er(y, a)), b = Yr(b, y, !1, !0));
	}
	return n.dirs && (b = Yr(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && En(Sn(b.type) && Tn(b) || b, n.transition), v = b, _n(_), v;
}
function Qn(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (Hr(r)) {
			if (r.type !== q || r.children === "v-if") {
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
	return n === "style" && v(r) && v(i) ? !Te(r, i) : r !== i;
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
	e.props = n ? r ? i : /* @__PURE__ */ Ft(i) : e.type.props ? i : a, e.attrs = a;
}
function lr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ I(i), [c] = e.propsOptions, l = !1;
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
						let t = S(o);
						i[t] = dr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		ur(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = C(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = dr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && j(e.attrs, "set", "");
}
function ur(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (re(t)) continue;
		let l = n[t], d;
		a && u(a, d = S(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Xn(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ I(r), i = c || t;
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
					let o = ci(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === C(n)) && (r = !0));
	}
	return r;
}
function fr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = S(c[e]);
		pr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = S(e);
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
	return e[0] !== "$" && !re(e);
}
var mr = (e) => e === "_" || e === "_ctx" || e === "$stable", hr = (e) => d(e) ? e.map(Q) : [Q(e)], gr = (e, t, n) => {
	if (t._n) return t;
	let r = vn((...e) => hr(t(...e)), n);
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
		e ? (yr(r, t, n), n && ue(r, "_", e, !0)) : _r(t, r);
	} else t && vr(e, t);
}, xr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : yr(a, n, r) : (o = !n.$stable, _r(n, a)), s = n;
	} else n && (vr(e, n), s = { default: 1 });
	if (o) for (let e in a) !mr(e) && s[e] == null && delete a[e];
}, G = Nr;
function Sr(e) {
	return Cr(e);
}
function Cr(e, i) {
	let a = pe();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ur(e, t) && (i = Ce(e), T(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Pr:
				y(e, t, r, i);
				break;
			case q:
				b(e, t, r, i);
				break;
			case Fr:
				e ?? x(t, r, i, s);
				break;
			case K:
				ce(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? ne(e, t, r, i, a, o, s, c, l) : f & 6 ? w(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, Te);
		}
		d != null && a ? jn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && jn(e.ref, null, o, e, !0);
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
	}, te = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ne = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) ie(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), oe(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ie = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && S(e.children, d, null, r, i, wr(e, a), s, u), _ && bn(e, null, r, "created"), ae(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !re(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && $(f, r, e);
		}
		_ && bn(e, null, r, "beforeMount");
		let v = Er(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && G(() => {
			try {
				f && $(f, r, e), v && g.enter(d), _ && bn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ae = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Mr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ae(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, S = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Qr(e[l]) : Q(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, oe = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Tr(r, !1), (g = h.onVnodeBeforeUpdate) && $(g, r, n, e), f && bn(n, e, r, "beforeUpdate"), r && Tr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? C(e.dynamicChildren, d, l, r, i, wr(n, a), o) : s || he(e, n, l, null, r, i, wr(n, a), o, !1), u > 0) {
			if (u & 16) se(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && se(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && G(() => {
			g && $(g, r, n, e), f && bn(n, e, r, "updated");
		}, i);
	}, C = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || jr(c), d = u && (c.type === K || !Ur(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, se = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !re(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (re(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ce = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), S(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (C(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Dr(e, t, !0)) : he(e, t, n, f, i, a, s, c, l);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ue(t, n, r, i, a, o, c) : de(e, t, c);
	}, ue = (e, t, n, r, i, a, o) => {
		let s = e.component = ii(e, r, i);
		if (Pn(e) && (s.ctx.renderer = Te), fi(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, fe, o, a), !e.el) {
				let r = s.subTree = Kr(q);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else fe(s, e, t, n, i, a, o);
	}, de = (e, t, n) => {
		let r = t.component = e.component;
		if (tr(e, t, n)) {
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
					let n = kr(e);
					if (n) {
						t && (t.el = c.el, me(e, t, o)), n.asyncDep.then(() => {
							G(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Tr(e, !1), t ? (t.el = c.el, me(e, t, o)) : t = c, n && le(n), (d = t.props && t.props.onVnodeBeforeUpdate) && $(d, s, t, c), Tr(e, !0);
				let f = Zn(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), Ce(p), e, i, a), t.el = f.el, u === null && ir(e, f.el), r && G(r, i), (d = t.props && t.props.onVnodeUpdated) && G(() => $(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Nn(t);
				if (Tr(e, !1), l && le(l), !m && (o = c && c.onVnodeBeforeMount) && $(o, d, t), Tr(e, !0), s && E) {
					let t = () => {
						e.subTree = Zn(e), E(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Zn(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && G(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					G(() => $(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Nn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && G(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new je(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => sn(u), Tr(e, !0), l();
	}, me = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, lr(e, t.props, r, n), xr(e, t.children, n), Ge(), un(e), Ke();
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
		m & 8 ? (u & 16 && Se(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? _e(l, d, n, r, i, a, o, s, c) : Se(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && S(d, n, r, i, a, o, s, c));
	}, ge = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? Qr(t[p]) : Q(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? Se(e, a, o, !0, !1, f) : S(t, r, i, a, o, s, c, l, f);
	}, _e = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Qr(t[u]) : Q(t[u]);
			if (Ur(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Qr(t[p]) : Q(t[p]);
			if (Ur(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Qr(t[u]) : Q(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) T(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Qr(t[u]) : Q(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, ee = 0, te = Array(b);
			for (u = 0; u < b; u++) te[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					T(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (te[_ - h] === 0 && Ur(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? T(n, a, o, !0) : (te[i - h] = u + 1, i >= ee ? ee = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let ne = x ? Or(te) : n;
			for (_ = ne.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || jr(f) : i;
				te[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== ne[_] ? ve(n, r, p, 2) : _--);
			}
		}
	}, ve = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) ve(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, Te);
		else if (c === K) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ve(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === Fr) ee(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Cn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), G(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Cn];
					a._isLeaving && a[Cn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, T = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ge(), jn(s, null, n, e, !0), Ke()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Nn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && $(_, t, e), u & 6) xe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && bn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Te, r) : l && !l.hasOnce && (a !== K || d > 0 && d & 64) ? Se(l, t, n, !1, !0) : (a === K && d & 384 || !i && u & 16) && Se(c, t, n), r && ye(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && G(() => {
			_ && $(_, t, e), h && bn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ye = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === K;
		if (a && !i) {
			be(n, r);
			return;
		}
		if (t === Fr) {
			te(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Dn(e) : e, c = () => {
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
		Ar(c), Ar(l), r && le(r), i.stop(), a ? (a.flags |= 8, T(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, T(o, e, t, n)), s && G(s, t), G(() => {
			e.isUnmounted = !0;
		}, t);
	}, Se = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) T(e[o], t, n, r, i);
	}, Ce = (e) => {
		if (e.shapeFlag & 6) return Ce(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[xn];
		return n ? h(n) : t;
	}, we = (e, t, n) => {
		pn(() => {
			e == null ? t._vnode && T(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : ri());
	}, Te = {
		p: v,
		um: T,
		m: ve,
		r: ye,
		mt: ue,
		mc: S,
		pc: he,
		pbc: C,
		n: Ce,
		o: e
	}, Ee, E;
	return i && ([Ee, E] = i(Te)), {
		render: we,
		hydrate: Ee,
		createApp: Gn(we, Ee)
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
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Qr(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Dr(t, a)), a.type === Pr && (a.patchFlag === -1 && (a = i[e] = Qr(a)), a.el = t.el), a.type === q && !a.el && (a.el = t.el);
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
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : ln(e);
}
var K = /* @__PURE__ */ Symbol.for("v-fgt"), Pr = /* @__PURE__ */ Symbol.for("v-txt"), q = /* @__PURE__ */ Symbol.for("v-cmt"), Fr = /* @__PURE__ */ Symbol.for("v-stc"), Ir = [], J = null;
function Y(e = !1) {
	Ir.push(J = e ? null : []);
}
function Lr() {
	Ir.pop(), J = Ir[Ir.length - 1] || null;
}
var Rr = 1;
function zr(e, t = !1) {
	Rr += e, e < 0 && J && t && (J.hasOnce = !0);
}
function Br(e) {
	return e.dynamicChildren = Rr > 0 ? J || n : null, Lr(), Rr > 0 && J && J.push(e), e;
}
function X(e, t, n, r, i, a) {
	return Br(Z(e, t, n, r, i, a, !0));
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
var Wr = ({ key: e }) => e ?? null, Gr = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ R(e) || h(e) ? {
	i: W,
	r: e,
	k: t,
	f: !!n
} : e);
function Z(e, t = null, n = null, r = 0, i = null, a = e === K ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Wr(t),
		ref: t && Gr(t),
		scopeId: gn,
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
	return s ? ($r(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Rr > 0 && !o && J && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && J.push(c), c;
}
var Kr = qr;
function qr(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Ln || (e = q), Hr(e)) {
		let r = Yr(e, t, !0);
		return n && $r(r, n), Rr > 0 && !a && J && (r.shapeFlag & 6 ? J[J.indexOf(e)] = r : J.push(r)), r.patchFlag = -2, r;
	}
	if (yi(e) && (e = e.__vccOpts), t) {
		t = Jr(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = T(e)), v(n) && (/* @__PURE__ */ zt(n) && !d(n) && (n = s({}, n)), t.style = me(n));
	}
	let o = g(e) ? 1 : Mr(e) ? 128 : Sn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function Jr(e) {
	return e ? /* @__PURE__ */ zt(e) || sr(e) ? s({}, e) : e : null;
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
		patchFlag: t && e.type !== K ? o === -1 ? 16 : o | 16 : o,
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
	return c && r && En(u, c.clone(u)), u;
}
function Xr(e = " ", t = 0) {
	return Kr(Pr, null, e, t);
}
function Zr(e = "", t = !1) {
	return t ? (Y(), Vr(q, null, e)) : Kr(q, null, e);
}
function Q(e) {
	return e == null || typeof e == "boolean" ? Kr(q) : d(e) ? Kr(K, null, e.slice()) : Hr(e) ? Qr(e) : Kr(Pr, null, String(e));
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
			!r && !sr(t) ? t._ctx = W : r === 3 && W && (W.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			$r(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: W
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Xr(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ei(...e) {
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
	Zt(e, t, 7, [n, r]);
}
var ti = Un(), ni = 0;
function ri() {
	return ni;
}
function ii(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || ti, o = {
		uid: ni++,
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
var ai = null, oi, si;
{
	let e = pe(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	oi = t("__VUE_INSTANCE_SETTERS__", (e) => ai = e), si = t("__VUE_SSR_SETTERS__", (e) => di = e);
}
var ci = (e) => {
	let t = ai;
	return oi(e), e.scope.on(), () => {
		e.scope.off(), oi(t);
	};
}, li = () => {
	ai && ai.scope.off(), oi(null);
};
function ui(e) {
	return e.vnode.shapeFlag & 4;
}
var di = !1;
function fi(e, t = !1, n = !1) {
	t && si(t);
	let { props: r, children: i } = e.vnode, a = ui(e);
	cr(e, r, a, t), br(e, i, n || t);
	let o = a ? pi(e, t) : void 0;
	return t && si(!1), o;
}
function pi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Hn);
	let { setup: r } = n;
	if (r) {
		Ge();
		let n = e.setupContext = r.length > 1 ? _i(e) : null, i = ci(e), a = Xt(r, e, 0, [e.props, n]), o = y(a);
		if (Ke(), i(), (o || e.sp) && !Nn(e) && On(e), o) {
			if (a.then(li, li), t) return a.then((n) => {
				si(!0);
				try {
					mi(e, n, t);
				} finally {
					si(!1);
				}
			}).catch((t) => {
				Qt(t, e, 0);
			});
			e.asyncDep = a;
		} else mi(e, a, t);
	} else hi(e, t);
}
function mi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Kt(t)), hi(e, n);
}
function hi(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var gi = { get(e, t) {
	return A(e, "get", ""), e[t];
} };
function _i(e) {
	return {
		attrs: new Proxy(e.attrs, gi),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function vi(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Kt(Bt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Bn) return Bn[n](e);
		},
		has(e, t) {
			return t in e || t in Bn;
		}
	}) : e.proxy;
}
function yi(e) {
	return h(e) && "__vccOpts" in e;
}
var bi = (e, t) => /* @__PURE__ */ Jt(e, t, di), xi = "3.5.44", Si = void 0, Ci = typeof window < "u" && window.trustedTypes;
if (Ci) try {
	Si = /* @__PURE__ */ Ci.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var wi = Si ? (e) => Si.createHTML(e) : (e) => e, Ti = "http://www.w3.org/2000/svg", Ei = "http://www.w3.org/1998/Math/MathML", Di = typeof document < "u" ? document : null, Oi = Di && /* @__PURE__ */ Di.createElement("template"), ki = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Di.createElementNS(Ti, e) : t === "mathml" ? Di.createElementNS(Ei, e) : n ? Di.createElement(e, { is: n }) : Di.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Di.createTextNode(e),
	createComment: (e) => Di.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Di.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Oi.innerHTML = wi(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Oi.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ai = /* @__PURE__ */ Symbol("_vtc");
function ji(e, t, n) {
	let r = e[Ai];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Mi = /* @__PURE__ */ Symbol("_vod"), Ni = /* @__PURE__ */ Symbol("_vsh"), Pi = /* @__PURE__ */ Symbol(""), Fi = /(?:^|;)\s*display\s*:/;
function Ii(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Ri(r, t, "");
			}
			else for (let e in t) n[e] ?? Ri(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Ri(r, i, "") : Hi(e, i, !g(t) && t ? t[i] : void 0, o) || Ri(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Pi];
			e && (n += ";" + e), r.cssText = n, a = Fi.test(n);
		}
	} else t && e.removeAttribute("style");
	Mi in e && (i && t === n || (e[Mi] = a ? r.display : ""), e[Ni] && (r.display = "none"));
}
var Li = /\s*!important$/;
function Ri(e, t, n) {
	if (d(n)) n.forEach((n) => Ri(e, t, n));
	else if (n ??= "", t.startsWith("--")) Li.test(n) ? e.setProperty(t, n.replace(Li, ""), "important") : e.setProperty(t, n);
	else {
		let r = Vi(e, t);
		Li.test(n) ? e.setProperty(C(r), n.replace(Li, ""), "important") : e[r] = n;
	}
}
var zi = [
	"Webkit",
	"Moz",
	"ms"
], Bi = {};
function Vi(e, t) {
	let n = Bi[t];
	if (n) return n;
	let r = S(t);
	if (r !== "filter" && r in e) return Bi[t] = r;
	r = se(r);
	for (let n = 0; n < zi.length; n++) {
		let i = zi[n] + r;
		if (i in e) return Bi[t] = i;
	}
	return t;
}
function Hi(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var Ui = "http://www.w3.org/1999/xlink";
function Wi(e, t, n, r, i, a = ye(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ui, t.slice(6, t.length)) : e.setAttributeNS(Ui, t, n) : n == null || a && !be(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Gi(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? wi(n) : n);
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
function Ki(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function qi(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Ji = /* @__PURE__ */ Symbol("_vei");
function Yi(e, t, n, r, i = null) {
	let a = e[Ji] || (e[Ji] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Qi(t);
		r ? Ki(e, n, a[t] = na(r, i), s) : o && (qi(e, n, o, s), a[t] = void 0);
	}
}
var Xi = /(Once|Passive|Capture)$/, Zi = /^on:?(?:Once|Passive|Capture)$/;
function Qi(e) {
	let t, n;
	for (; (n = e.match(Xi)) && !Zi.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : C(e.slice(2)), t];
}
var $i = 0, ea = /* @__PURE__ */ Promise.resolve(), ta = () => $i ||= (ea.then(() => $i = 0), Date.now());
function na(e, t) {
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
				e && Zt(e, t, 5, a);
			}
		} else Zt(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ta(), n;
}
var ra = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ia = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? ji(e, r, c) : t === "style" ? Ii(e, n, r) : a(t) ? o(t) || Yi(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : aa(e, t, r, c)) ? (Gi(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || Wi(e, t, r, c, s, t !== "value")) : e._isVueCE && (oa(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Gi(e, S(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Wi(e, t, r, c));
};
function aa(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && ra(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return ra(t) && g(n) ? !1 : t in e;
}
function oa(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = S(t);
	return Array.isArray(n) ? n.some((e) => S(e) === r) : Object.keys(n).some((e) => S(e) === r);
}
var sa = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => le(t, e) : t;
};
function ca(e) {
	e.target.composing = !0;
}
function la(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ua = /* @__PURE__ */ Symbol("_assign"), da = /* @__PURE__ */ Symbol("_initialValue");
function fa(e, t, n) {
	return t && (e = e.trim()), n && (e = de(e)), e;
}
var pa = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[da] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[da] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[ua] = sa(i);
		let a = r || i.props && i.props.type === "number";
		Ki(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ua](fa(e.value, n, a));
		}), (n || a) && Ki(e, "change", () => {
			e.value = fa(e.value, n, a);
		}), t || (Ki(e, "compositionstart", ca), Ki(e, "compositionend", la), Ki(e, "change", la));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[da];
		delete e[da], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[ua](fa(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ua] = sa(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? de(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, ma = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ha = {
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
	exact: (e, t) => ma.some((n) => e[`${n}Key`] && !t.includes(n))
}, ga = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ha[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, _a = /* @__PURE__ */ s({ patchProp: ia }, ki), va;
function ya() {
	return va ||= Sr(_a);
}
var ba = ((...e) => {
	let t = ya().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Sa(e);
		if (!r) return;
		let i = t._component;
		h(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, xa(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function xa(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Sa(e) {
	return g(e) ? document.querySelector(e) : e;
}
// services/portal/src/teacher/useItineraries.js
function Ca(e, t) {
	let n = /* @__PURE__ */ Ht({
		teacher: !1,
		group: null,
		assignments: [],
		assignment: null
	}), r = /* @__PURE__ */ z([]), i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(""), l = 0, u = 0, d = 0, f = !0, p = bi(() => r.value.find((e) => e.is_selected)), m = bi(() => !n.value.teacher || !n.value.group || !a.value || s.value);
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
	function te(e) {
		return y(`/api/teacher/groups/${encodeURIComponent(n.value.group?.id)}/itinerary`, {
			itinerary_id: e,
			expected_itinerary_id: p.value?.id || null
		});
	}
	function ne(e) {
		return n.value.assignments.find((t) => t.id === e)?.title || e;
	}
	return In(() => {
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
		select: te,
		assignmentTitle: ne
	};
}
// services/portal/src/shared/usePortalTranslations.js
function wa() {
	let e = /* @__PURE__ */ z(window.i18nPortal.getLang()), t = () => {
		e.value = window.i18nPortal.getLang();
	};
	return window.addEventListener("edutictac:langchange", t), In(() => window.removeEventListener("edutictac:langchange", t)), (t, n) => (e.value, window.i18nPortal.t(t, n));
}
// services/portal/src/teacher/ItinerariesPanel.vue
var Ta = ["disabled", "placeholder"], Ea = { class: "actions" }, Da = ["disabled"], Oa = ["disabled"], ka = { class: "hint" }, Aa = ["aria-busy"], ja = {
	key: 0,
	role: "alert"
}, Ma = { key: 1 }, Na = {
	key: 2,
	role: "status"
}, Pa = { key: 3 }, Fa = { class: "hint" }, Ia = ["disabled"], La = { key: 1 }, Ra = { class: "cards itinerary-cards" }, za = {
	key: 0,
	role: "status"
}, Ba = [
	"data-select-group-itinerary",
	"aria-label",
	"disabled",
	"onClick"
], Va = { class: "actions" }, Ha = [
	"data-edit-itinerary",
	"data-itinerary-assignment",
	"data-itinerary-action",
	"aria-label",
	"disabled",
	"onClick"
], Ua = [
	"data-add-itinerary-item",
	"disabled",
	"onClick"
], Wa = { key: 3 }, Ga = {
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
		let n = e, r = wa(), { context: i, itineraries: a, title: o, ready: s, loading: c, pending: l, feedback: u, selected: d, unavailable: f, setContext: p, load: m, create: h, edit: g, add: _, select: v, assignmentTitle: y } = Ca(n.api, n.onSessionExpired);
		return t({
			setContext: p,
			load: m
		}), (e, t) => (Y(), X(K, null, [
			Z("form", {
				class: "grid-fields",
				onSubmit: t[2] ||= ga((...e) => B(h) && B(h)(...e), ["prevent"])
			}, [Z("label", null, [Z("span", null, E(B(r)("teacher.itineraryTitleLabel")), 1), yn(Z("input", {
				id: "itineraryTitle",
				"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ R(o) ? o.value = e : null,
				type: "text",
				disabled: !B(i).teacher || !B(i).group || B(l),
				placeholder: B(r)("teacher.itineraryTitlePlaceholder")
			}, null, 8, Ta), [[pa, B(o)]])]), Z("div", Ea, [Z("button", {
				id: "createItinerary",
				type: "submit",
				disabled: B(f)
			}, E(B(r)("teacher.createItinerary")), 9, Da), Z("button", {
				id: "loadItineraries",
				type: "button",
				class: "secondary",
				disabled: !B(i).teacher || !B(i).group || B(l),
				onClick: t[1] ||= (...e) => B(m) && B(m)(...e)
			}, E(B(r)("teacher.loadItineraries")), 9, Oa)])], 32),
			Z("p", ka, E(B(r)("teacher.itineraryHint")), 1),
			Z("div", {
				id: "itinerariesOutput",
				class: T(["output", { empty: !B(a).length }]),
				"aria-busy": B(c) || B(l)
			}, [
				B(u) ? (Y(), X("p", ja, E(B(r)(B(u))), 1)) : Zr("", !0),
				!B(i).teacher || !B(i).group ? (Y(), X("p", Ma, E(B(r)("teacher.itinerariesEmpty")), 1)) : B(c) && !B(a).length ? (Y(), X("p", Na, E(B(r)("teacher.itinerary.loading")), 1)) : B(s) && !B(a).length ? (Y(), X("p", Pa, E(B(r)("teacher.itinerariesEmptyList")), 1)) : Zr("", !0),
				B(a).length ? (Y(), X(K, { key: 4 }, [
					Z("p", Fa, E(B(r)("teacher.itinerary.selectionHint")), 1),
					B(d) ? (Y(), X("button", {
						key: 0,
						class: "compact secondary",
						type: "button",
						"data-clear-group-itinerary": "",
						disabled: B(f),
						onClick: t[3] ||= (e) => B(v)(null)
					}, E(B(r)("teacher.itinerary.clearSelection")), 9, Ia)) : (Y(), X("p", La, E(B(r)("teacher.itinerary.noSelection")), 1)),
					Z("div", Ra, [(Y(!0), X(K, null, Rn(B(a), (e) => (Y(), X("article", {
						key: e.id,
						class: "card itinerary-card"
					}, [
						Z("strong", null, E(e.title), 1),
						e.is_selected ? (Y(), X("small", za, E(B(r)("teacher.itinerary.selected")), 1)) : (Y(), X("button", {
							key: 1,
							class: "compact secondary",
							type: "button",
							"data-select-group-itinerary": e.id,
							"aria-label": B(r)("teacher.itinerary.selectLabel", { title: e.title }),
							disabled: B(f),
							onClick: (t) => B(v)(e.id)
						}, E(B(r)("teacher.itinerary.select")), 9, Ba)),
						Z("small", null, E(B(r)("teacher.itinerarySteps", { count: e.items.length })), 1),
						Z("ol", null, [(Y(!0), X(K, null, Rn(e.items, (t, n) => (Y(), X("li", { key: t.assignment_id }, [Z("span", null, E(B(y)(t.assignment_id)), 1), Z("div", Va, [(Y(), X(K, null, Rn([
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
						}, E(B(r)(`teacher.itinerary.${i}`)), 9, Ha)), 64))])]))), 128))]),
						Z("small", null, E(B(r)("teacher.itinerary.removeHint")), 1),
						B(i).assignment ? (Y(), X("button", {
							key: 2,
							class: "compact secondary",
							type: "button",
							"data-add-itinerary-item": e.id,
							disabled: B(f),
							onClick: (t) => B(_)(e)
						}, E(B(r)("teacher.addSelectedActivity")), 9, Ua)) : (Y(), X("small", Wa, E(B(r)("teacher.selectAssignmentHint")), 1))
					]))), 128))])
				], 64)) : Zr("", !0)
			], 10, Aa)
		], 64));
	}
}, Ka = ["aria-label", "aria-busy"], qa = {
	key: 0,
	role: "alert"
}, Ja = { key: 0 }, Ya = { key: 1 }, Xa = { key: 2 }, Za = [
	"data-select-group",
	"aria-pressed",
	"disabled",
	"onClick"
], Qa = { class: "actions" }, $a = ["disabled"], eo = {
	__name: "GroupSelector",
	props: {
		api: Function,
		onSelect: Function,
		onDeleted: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = wa(), i = /* @__PURE__ */ Ht({
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
		return t({ setContext: l }), In(() => {
			c = !1, s++;
		}), (e, t) => (Y(), X("section", {
			"aria-label": B(r)("teacher.groups"),
			"aria-busy": a.value
		}, [
			Z("h3", null, E(B(r)("teacher.groups")), 1),
			o.value ? (Y(), X("p", qa, E(B(r)(o.value)), 1)) : Zr("", !0),
			Z("div", { class: T(["output", { empty: !i.value.teacher || !i.value.groups.length }]) }, [i.value.teacher ? i.value.groups.length ? (Y(), X("table", Xa, [Z("thead", null, [Z("tr", null, [
				Z("th", null, E(B(r)("teacher.groupOpaque")), 1),
				Z("th", null, E(B(r)("teacher.tenant")), 1),
				Z("th", null, E(B(r)("teacher.active")), 1),
				Z("th", null, E(B(r)("common.select")), 1)
			])]), Z("tbody", null, [(Y(!0), X(K, null, Rn(i.value.groups, (e) => (Y(), X("tr", { key: e.id }, [
				Z("td", null, E(e.name), 1),
				Z("td", null, E(e.tenant_id), 1),
				Z("td", null, E(e.active ?? 0), 1),
				Z("td", null, [Z("button", {
					type: "button",
					class: "compact secondary",
					"data-select-group": e.id,
					"aria-pressed": i.value.group?.id === e.id,
					disabled: a.value,
					onClick: (t) => d(e.id)
				}, E(B(r)("common.select")), 9, Za)])
			]))), 128))])])) : (Y(), X("p", Ya, E(B(r)("common.tableEmpty")), 1)) : (Y(), X("p", Ja, E(B(r)("teacher.errors.loginFirst")), 1))], 2),
			Z("div", Qa, [Z("button", {
				id: "deleteGroup",
				type: "button",
				class: "danger",
				disabled: !i.value.teacher || !i.value.group || a.value,
				onClick: f
			}, E(B(r)("teacher.deleteGroup")), 9, $a)])
		], 8, Ka));
	}
}, to = { class: "hint" }, no = ["placeholder", "disabled"], ro = { class: "actions" }, io = ["disabled"], ao = ["disabled"], oo = ["aria-busy"], so = {
	key: 0,
	role: "alert"
}, co = { key: 1 }, lo = { key: 2 }, uo = { key: 3 }, fo = { key: 4 }, po = [
	"data-remove-member",
	"disabled",
	"onClick"
], mo = {
	__name: "GroupMembersPanel",
	props: {
		api: Function,
		onSessionExpired: Function
	},
	setup(e, { expose: t }) {
		let n = e, r = wa(), i = /* @__PURE__ */ Ht({
			teacher: !1,
			group: null
		}), a = /* @__PURE__ */ z([]), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(""), d = bi(() => !i.value.teacher || !i.value.group || s.value), f = 0, p = !0;
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
		return t({ setContext: m }), In(() => {
			p = !1, f++;
		}), (e, t) => (Y(), X(K, null, [
			Z("p", to, E(B(r)("teacher.membersHint")), 1),
			Z("form", {
				class: "grid-fields",
				onSubmit: ga(b, ["prevent"])
			}, [Z("label", null, [Z("span", null, E(B(r)("teacher.memberIdLabel")), 1), yn(Z("input", {
				id: "memberTeacherId",
				"onUpdate:modelValue": t[0] ||= (e) => o.value = e,
				type: "text",
				maxlength: "128",
				placeholder: B(r)("teacher.memberIdPlaceholder"),
				autocomplete: "off",
				disabled: d.value || l.value
			}, null, 8, no), [[pa, o.value]])]), Z("div", ro, [Z("button", {
				id: "addGroupMember",
				type: "submit",
				class: "secondary",
				disabled: d.value || l.value
			}, E(B(r)("teacher.addMember")), 9, io), Z("button", {
				id: "loadGroupMembers",
				type: "button",
				class: "secondary",
				disabled: d.value,
				onClick: y
			}, E(B(r)("teacher.loadMembers")), 9, ao)])], 32),
			Z("div", {
				id: "membersOutput",
				class: T(["output", { empty: !c.value }]),
				"aria-busy": s.value
			}, [
				u.value ? (Y(), X("p", so, E(B(r)(u.value)), 1)) : Zr("", !0),
				!i.value.teacher || !i.value.group ? (Y(), X("p", co, E(B(r)("teacher.membersEmpty")), 1)) : !c.value && !u.value ? (Y(), X("p", lo, E(B(r)("teacher.membersPrompt")), 1)) : c.value && !a.value.length ? (Y(), X("p", uo, E(B(r)("common.tableEmpty")), 1)) : Zr("", !0),
				a.value.length ? (Y(), X("table", fo, [Z("thead", null, [Z("tr", null, [
					Z("th", null, E(B(r)("teacher.memberIdLabel")), 1),
					Z("th", null, E(B(r)("common.status")), 1),
					Z("th", null, E(B(r)("common.date")), 1),
					Z("th", null, E(B(r)("teacher.removeMember")), 1)
				])]), Z("tbody", null, [(Y(!0), X(K, null, Rn(a.value, (e) => (Y(), X("tr", { key: e.teacher_id }, [
					Z("td", null, E(e.teacher_id), 1),
					Z("td", null, E(e.role), 1),
					Z("td", null, E(e.created_at), 1),
					Z("td", null, [e.role === "owner" ? Zr("", !0) : (Y(), X("button", {
						key: 0,
						type: "button",
						class: "compact danger",
						"data-remove-member": e.teacher_id,
						disabled: d.value || l.value,
						onClick: (t) => x(e)
					}, E(B(r)("teacher.removeMember")), 9, po))])
				]))), 128))])])) : Zr("", !0)
			], 10, oo)
		], 64));
	}
};
// services/portal/src/teacher/main.js
function ho(e, t) {
	return ba(Ga, t).mount(e);
}
function go(e, t) {
	return ba(eo, t).mount(e);
}
function _o(e, t) {
	return ba(mo, t).mount(e);
}
export { go as mountGroups, ho as mountItineraries, _o as mountMembers };
