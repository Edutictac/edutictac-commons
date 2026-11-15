// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n));
// node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function l(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var u = {}, d = [], f = () => {}, p = () => !1, m = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), h = (e) => e.startsWith("onUpdate:"), g = Object.assign, _ = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, v = Object.prototype.hasOwnProperty, y = (e, t) => v.call(e, t), b = Array.isArray, x = (e) => k(e) === "[object Map]", S = (e) => k(e) === "[object Set]", C = (e) => k(e) === "[object Date]", w = (e) => typeof e == "function", T = (e) => typeof e == "string", E = (e) => typeof e == "symbol", D = (e) => typeof e == "object" && !!e, ee = (e) => (D(e) || w(e)) && w(e.then) && w(e.catch), O = Object.prototype.toString, k = (e) => O.call(e), te = (e) => k(e).slice(8, -1), ne = (e) => k(e) === "[object Object]", A = (e) => T(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, re = /* @__PURE__ */ l(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), j = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ie = /-\w/g, M = j((e) => e.replace(ie, (e) => e.slice(1).toUpperCase())), ae = /\B([A-Z])/g, oe = j((e) => e.replace(ae, "-$1").toLowerCase()), se = j((e) => e.charAt(0).toUpperCase() + e.slice(1)), ce = j((e) => e ? `on${se(e)}` : ""), N = (e, t) => !Object.is(e, t), le = (e, ...t) => {
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
	if (b(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = T(r) ? ve(r) : me(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (T(e) || D(e)) return e;
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
function ye(e) {
	let t = "";
	if (T(e)) t = e;
	else if (b(e)) for (let n = 0; n < e.length; n++) {
		let r = ye(e[n]);
		r && (t += r + " ");
	}
	else if (D(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var be = /* @__PURE__ */ l("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function xe(e) {
	return !!e || e === "";
}
function Se(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Ee(e[i], t[i], n);
	return r;
}
function Ce(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Ee(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function we(e, t, n) {
	let r = x(e), i = x(t);
	if (r || i || (r = S(e), i = S(t), r || i)) return r && i ? Ce(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Ee(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Te(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Ee(e, t, n) {
	if (e === t) return !0;
	let r = C(e), i = C(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = E(e), i = E(t), r || i ? e === t : (r = b(e), i = b(t), r || i ? r && i ? Te(e, t, n, Se) : !1 : (r = D(e), i = D(t), r || i ? !r || !i ? !1 : Te(e, t, n, we) : String(e) === String(t))));
}
function De(e, t) {
	return e.findIndex((e) => Ee(e, t));
}
var Oe = (e) => !!(e && e.__v_isRef === !0), P = (e) => T(e) ? e : e == null ? "" : b(e) || D(e) && (e.toString === O || !w(e.toString)) ? Oe(e) ? P(e.value) : JSON.stringify(e, ke, 2) : String(e), ke = (e, t) => Oe(t) ? ke(e, t.value) : x(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ae(t, r) + " =>"] = n, e), {}) } : S(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ae(e)) } : E(t) ? Ae(t) : D(t) && !b(t) && !ne(t) ? String(t) : t, Ae = (e, t = "") => E(e) ? `Symbol(${e.description ?? t})` : e, F, je = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && F && (F.active ? (this.parent = F, this.index = (F.scopes || (F.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = F;
			try {
				return F = this, e();
			} finally {
				F = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = F, F = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (F === this) F = this.prevScope;
			else {
				let e = F;
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
function Me() {
	return F;
}
var I, Ne = /* @__PURE__ */ new WeakSet(), Pe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, F && (F.active ? F.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ne.has(this) && (Ne.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Re(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ze(this), Ve(this);
		let e = I, t = qe;
		I = this, qe = !0;
		try {
			return this.fn();
		} finally {
			He(this), I = e, qe = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ge(e);
			this.deps = this.depsTail = void 0, Ze(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ne.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ue(this) && this.run();
	}
	get dirty() {
		return Ue(this);
	}
}, Fe = 0, Ie, Le;
function Re(e, t = !1) {
	e.flags |= 8, t ? (e.next = Le, Le = e) : (e.next = Ie, Ie = e);
}
function ze() {
	Fe++;
}
function Be() {
	if (--Fe > 0) return;
	if (Le) {
		let e = Le;
		for (Le = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ie;) {
		let t = Ie;
		for (Ie = void 0; t;) {
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
function Ve(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function He(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ge(r), Ke(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ue(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (We(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function We(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Qe) || (e.globalVersion = Qe, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ue(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = I, r = qe;
	I = e, qe = !0;
	try {
		Ve(e);
		let n = e.fn(e._value);
		(t.version === 0 || N(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		I = n, qe = r, He(e), e.flags &= -3;
	}
}
function Ge(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ge(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ke(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var qe = !0, Je = [];
function Ye() {
	Je.push(qe), qe = !1;
}
function Xe() {
	let e = Je.pop();
	qe = e === void 0 || e;
}
function Ze(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = I;
		I = void 0;
		try {
			t();
		} finally {
			I = e;
		}
	}
}
var Qe = 0, $e = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, et = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!I || !qe || I === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== I) t = this.activeLink = new $e(I, this), I.deps ? (t.prevDep = I.depsTail, I.depsTail.nextDep = t, I.depsTail = t) : I.deps = I.depsTail = t, tt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = I.depsTail, t.nextDep = void 0, I.depsTail.nextDep = t, I.depsTail = t, I.deps === t && (I.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Qe++, this.notify(e);
	}
	notify(e) {
		ze();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Be();
		}
	}
};
function tt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) tt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var nt = /* @__PURE__ */ new WeakMap(), rt = /* @__PURE__ */ Symbol(""), it = /* @__PURE__ */ Symbol(""), at = /* @__PURE__ */ Symbol("");
function L(e, t, n) {
	if (qe && I) {
		let t = nt.get(e);
		t || nt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new et()), r.map = t, r.key = n), r.track();
	}
}
function ot(e, t, n, r, i, a) {
	let o = nt.get(e);
	if (!o) {
		Qe++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (ze(), t === "clear") o.forEach(s);
	else {
		let i = b(e), a = i && A(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === at || !E(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(at)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(rt)), x(e) && s(o.get(it)));
				break;
			case "delete":
				i || (s(o.get(rt)), x(e) && s(o.get(it)));
				break;
			case "set": x(e) && s(o.get(rt));
		}
	}
	Be();
}
function st(e) {
	let t = /* @__PURE__ */ R(e);
	return t === e || (L(t, "iterate", at), /* @__PURE__ */ qt(e)) ? t : /* @__PURE__ */ Kt(e) ? /* @__PURE__ */ Gt(e) ? t.map((e) => Zt(Xt(e))) : t.map(Zt) : t.map(Xt);
}
function ct(e) {
	return L(e = /* @__PURE__ */ R(e), "iterate", at), e;
}
function lt(e, t) {
	return /* @__PURE__ */ Kt(e) ? Zt(/* @__PURE__ */ Gt(e) ? Xt(t) : t) : Xt(t);
}
var ut = {
	__proto__: null,
	[Symbol.iterator]() {
		return dt(this, Symbol.iterator, (e) => lt(this, e));
	},
	concat(...e) {
		return st(this).concat(...e.map((e) => b(e) ? st(e) : e));
	},
	entries() {
		return dt(this, "entries", (e) => (e[1] = lt(this, e[1]), e));
	},
	every(e, t) {
		return mt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return mt(this, "filter", e, t, (e) => e.map((e) => lt(this, e)), arguments);
	},
	find(e, t) {
		return mt(this, "find", e, t, (e) => lt(this, e), arguments);
	},
	findIndex(e, t) {
		return mt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return mt(this, "findLast", e, t, (e) => lt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return mt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return mt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return gt(this, "includes", e);
	},
	indexOf(...e) {
		return gt(this, "indexOf", e);
	},
	join(e) {
		return st(this).join(e);
	},
	lastIndexOf(...e) {
		return gt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return mt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return _t(this, "pop");
	},
	push(...e) {
		return _t(this, "push", e);
	},
	reduce(e, ...t) {
		return ht(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ht(this, "reduceRight", e, t);
	},
	shift() {
		return _t(this, "shift");
	},
	some(e, t) {
		return mt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return _t(this, "splice", e);
	},
	toReversed() {
		return st(this).toReversed();
	},
	toSorted(e) {
		return st(this).toSorted(e);
	},
	toSpliced(...e) {
		return st(this).toSpliced(...e);
	},
	unshift(...e) {
		return _t(this, "unshift", e);
	},
	values() {
		return dt(this, "values", (e) => lt(this, e));
	}
};
function dt(e, t, n) {
	let r = ct(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ qt(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => ft(a.next(), n), i !== pt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => ft(a._next(), n);
	}
	return a;
}
function ft(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var pt = Array.prototype;
function mt(e, t, n, r, i, a) {
	let o = ct(e), s = o !== e && !/* @__PURE__ */ qt(e), c = o[t];
	if (c !== pt[t]) {
		let t = c.apply(e, a);
		return s ? Xt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, lt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ht(e, t, n, r) {
	let i = ct(e), a = i !== e && !/* @__PURE__ */ qt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = lt(e, t)), n.call(this, t, lt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? lt(e, c) : c;
}
function gt(e, t, n) {
	let r = /* @__PURE__ */ R(e);
	L(r, "iterate", at);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Jt(n[0]) ? (n[0] = /* @__PURE__ */ R(n[0]), r[t](...n)) : i;
}
function _t(e, t, n = []) {
	Ye(), ze();
	let r = (/* @__PURE__ */ R(e))[t].apply(e, n);
	return Be(), Xe(), r;
}
var vt = /* @__PURE__ */ l("__proto__,__v_isRef,__isVue"), yt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(E));
function bt(e) {
	E(e) || (e = String(e));
	let t = /* @__PURE__ */ R(this);
	return L(t, "has", e), t.hasOwnProperty(e);
}
var xt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? zt : Rt : i ? Lt : It).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = b(e);
		if (!r) {
			let e;
			if (a && (e = ut[t])) return e;
			if (t === "hasOwnProperty") return bt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ z(e) ? e : n);
		if ((E(t) ? yt.has(t) : vt(t)) || (r || L(e, "get", t), i)) return o;
		if (/* @__PURE__ */ z(o)) {
			let e = a && A(t) ? o : o.value;
			return r && D(e) ? /* @__PURE__ */ Ut(e) : e;
		}
		return D(o) ? r ? /* @__PURE__ */ Ut(o) : /* @__PURE__ */ Vt(o) : o;
	}
}, St = class extends xt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = b(e) && A(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Kt(i);
			if (!/* @__PURE__ */ qt(n) && !/* @__PURE__ */ Kt(n) && (i = /* @__PURE__ */ R(i), n = /* @__PURE__ */ R(n)), !a && /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : y(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ z(e) ? e : r);
		return e === /* @__PURE__ */ R(r) && s && (o ? N(n, i) && ot(e, "set", t, n, i) : ot(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = y(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && ot(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return E(t) && yt.has(t) || L(e, "has", t), n;
	}
	ownKeys(e) {
		return L(e, "iterate", b(e) ? "length" : rt), Reflect.ownKeys(e);
	}
}, Ct = class extends xt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, wt = /* @__PURE__ */ new St(), Tt = /* @__PURE__ */ new Ct(), Et = /* @__PURE__ */ new St(!0), Dt = (e) => e, Ot = (e) => Reflect.getPrototypeOf(e);
function kt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ R(i), o = x(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Dt : t ? Zt : Xt;
		return !t && L(a, "iterate", c ? it : rt), g(Object.create(l), { next() {
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
function At(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function jt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ R(r), a = /* @__PURE__ */ R(n);
			e || (N(n, a) && L(i, "get", n), L(i, "get", a));
			let { has: o } = Ot(i), s = t ? Dt : e ? Zt : Xt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && L(/* @__PURE__ */ R(t), "iterate", rt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ R(n), i = /* @__PURE__ */ R(t);
			return e || (N(t, i) && L(r, "has", t), L(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ R(a), s = t ? Dt : e ? Zt : Xt;
			return !e && L(o, "iterate", rt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return g(n, e ? {
		add: At("add"),
		set: At("set"),
		delete: At("delete"),
		clear: At("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ R(this), r = Ot(n), i = /* @__PURE__ */ R(e), a = !t && !/* @__PURE__ */ qt(e) && !/* @__PURE__ */ Kt(e) ? i : e;
			return r.has.call(n, a) || N(e, a) && r.has.call(n, e) || N(i, a) && r.has.call(n, i) || (n.add(a), ot(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ qt(n) || /* @__PURE__ */ Kt(n) || (n = /* @__PURE__ */ R(n));
			let r = /* @__PURE__ */ R(this), { has: i, get: a } = Ot(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ R(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? N(n, s) && ot(r, "set", e, n, s) : ot(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ R(this), { has: n, get: r } = Ot(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ R(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && ot(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ R(this), t = e.size !== 0, n = e.clear();
			return t && ot(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = kt(r, e, t);
	}), n;
}
function Mt(e, t) {
	let n = jt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(y(n, i) && i in r ? n : r, i, a);
}
var Nt = { get: /* @__PURE__ */ Mt(!1, !1) }, Pt = { get: /* @__PURE__ */ Mt(!1, !0) }, Ft = { get: /* @__PURE__ */ Mt(!0, !1) }, It = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new WeakMap(), Rt = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap();
function Bt(e) {
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
function Vt(e) {
	return /* @__PURE__ */ Kt(e) ? e : Wt(e, !1, wt, Nt, It);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return Wt(e, !1, Et, Pt, Lt);
}
// @__NO_SIDE_EFFECTS__
function Ut(e) {
	return Wt(e, !0, Tt, Ft, Rt);
}
function Wt(e, t, n, r, i) {
	if (!D(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Bt(te(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return /* @__PURE__ */ Kt(e) ? /* @__PURE__ */ Gt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ R(t) : e;
}
function Yt(e) {
	return !y(e, "__v_skip") && Object.isExtensible(e) && ue(e, "__v_skip", !0), e;
}
var Xt = (e) => D(e) ? /* @__PURE__ */ Vt(e) : e, Zt = (e) => D(e) ? /* @__PURE__ */ Ut(e) : e;
// @__NO_SIDE_EFFECTS__
function z(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	return Qt(e, !1);
}
function Qt(e, t) {
	return /* @__PURE__ */ z(e) ? e : new $t(e, t);
}
var $t = class {
	constructor(e, t) {
		this.dep = new et(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ R(e), this._value = t ? e : Xt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ qt(e) || /* @__PURE__ */ Kt(e);
		e = n ? e : /* @__PURE__ */ R(e), N(e, t) && (this._rawValue = e, this._value = n ? e : Xt(e), this.dep.trigger());
	}
};
function V(e) {
	return /* @__PURE__ */ z(e) ? e.value : e;
}
var en = {
	get: (e, t, n) => t === "__v_raw" ? e : V(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ z(i) && !/* @__PURE__ */ z(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function tn(e) {
	return /* @__PURE__ */ Gt(e) ? e : new Proxy(e, en);
}
var nn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new et(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Qe - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && I !== this) return Re(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return We(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function rn(e, t, n = !1) {
	let r, i;
	return w(e) ? r = e : (r = e.get, i = e.set), new nn(r, i, n);
}
var an = {}, on = /* @__PURE__ */ new WeakMap(), sn = void 0;
function cn(e, t = !1, n = sn) {
	if (n) {
		let t = on.get(n);
		t || on.set(n, t = []), t.push(e);
	}
}
function ln(e, t, n = u) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ qt(e) || i === !1 || i === 0 ? un(e, 1) : un(e), d, p, m, h, g = !1, v = !1;
	if (/* @__PURE__ */ z(e) ? (p = () => e.value, g = /* @__PURE__ */ qt(e)) : /* @__PURE__ */ Gt(e) ? (p = () => l(e), g = !0) : b(e) ? (v = !0, g = e.some((e) => /* @__PURE__ */ Gt(e) || /* @__PURE__ */ qt(e)), p = () => e.map((e) => {
		if (/* @__PURE__ */ z(e)) return e.value;
		if (/* @__PURE__ */ Gt(e)) return l(e);
		if (w(e)) return c ? c(e, 2) : e();
	})) : p = w(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (m) {
			Ye();
			try {
				m();
			} finally {
				Xe();
			}
		}
		let t = sn;
		sn = d;
		try {
			return c ? c(e, 3, [h]) : e(h);
		} finally {
			sn = t;
		}
	} : f, t && i) {
		let e = p, t = i === !0 ? Infinity : i;
		p = () => un(e(), t);
	}
	let y = Me(), x = () => {
		d.stop(), y && y.active && _(y.effects, d);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			try {
				return e(...t);
			} finally {
				x();
			}
		};
	}
	let S = v ? Array(e.length).fill(an) : an, C = (e) => {
		if (d.flags & 1 && (d.dirty || e)) {
			if (t) {
				let n = d.run();
				if (e || i || g || (v ? n.some((e, t) => N(e, S[t])) : N(n, S))) {
					let e = sn;
					Ye();
					try {
						m && m(), sn = d;
						let e = [
							n,
							S === an ? void 0 : v && S[0] === an ? [] : S,
							h
						];
						S = n, c ? c(t, 3, e) : t(...e);
					} finally {
						sn = e, Xe();
					}
				}
			} else d.run();
		}
	};
	return s && s(C), d = new Pe(p), d.scheduler = o ? () => o(C, !1) : C, h = (e) => cn(e, !1, d), m = d.onStop = () => {
		let e = on.get(d);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			on.delete(d);
		}
	}, t ? r ? C(!0) : S = d.run() : o ? o(C.bind(null, !0), !0) : d.run(), x.pause = d.pause.bind(d), x.resume = d.resume.bind(d), x.stop = x, x;
}
function un(e, t = Infinity, n) {
	if (t <= 0 || !D(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ z(e)) un(e.value, t, n);
	else if (b(e)) for (let r = 0; r < e.length; r++) un(e[r], t, n);
	else if (S(e) || x(e)) e.forEach((e) => {
		un(e, t, n);
	});
	else if (ne(e)) {
		for (let r in e) un(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && un(e[r], t, n);
	}
	return e;
}
// node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function dn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		pn(e, t, n);
	}
}
function fn(e, t, n, r) {
	if (w(e)) {
		let i = dn(e, t, n, r);
		return i && ee(i) && i.catch((e) => {
			pn(e, t, n);
		}), i;
	}
	if (b(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(fn(e[a], t, n, r));
		return i;
	}
}
function pn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || u;
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
			Ye(), dn(a, null, 10, [
				e,
				i,
				o
			]), Xe();
			return;
		}
	}
	mn(e, n, i, r, o);
}
function mn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var H = [], hn = -1, gn = [], _n = null, vn = 0, yn = /* @__PURE__ */ Promise.resolve(), bn = null;
function xn(e) {
	let t = bn || yn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Sn(e) {
	let t = hn + 1, n = H.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = H[r], a = An(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Cn(e) {
	if (!(e.flags & 1)) {
		let t = An(e), n = H[H.length - 1];
		!n || !(e.flags & 2) && t >= An(n) ? H.push(e) : H.splice(Sn(t), 0, e), e.flags |= 1, wn();
	}
}
function wn() {
	bn ||= yn.then(jn);
}
function Tn(e) {
	if (!b(e)) _n && e.id === -1 ? _n.splice(vn + 1, 0, e) : e.flags & 1 || (gn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) gn.push(e[t]);
	wn();
}
function En(e, t, n, r = hn + 1) {
	for (; r < H.length; r++) {
		let n = H[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			H.splice(r, 1), r = e ? r - 1 : hn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Dn(e, t, n = 0) {
	if (gn.length) {
		let e = gn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < gn.length; i++) {
				let a = gn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? gn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => An(e) - An(t));
		if (gn.length = r, _n) {
			for (let e = 0; e < i.length; e++) _n.push(i[e]);
			return;
		}
		for (_n = i, vn = 0; vn < _n.length; vn++) {
			let e = _n[vn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		_n = null, vn = 0;
	}
}
var On = !1;
function kn(e, t) {
	if (On) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(gn);
	e(), On = !0;
	try {
		En(void 0, t), Dn(void 0, n, t);
	} finally {
		On = !1;
	}
}
var An = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function jn(e) {
	try {
		for (hn = 0; hn < H.length; hn++) {
			let e = H[hn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), dn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; hn < H.length; hn++) {
			let e = H[hn];
			e && (e.flags &= -2);
		}
		hn = -1, H.length = 0, Dn(e), bn = null, (H.length || gn.length) && jn(e);
	}
}
var U = null, Mn = null;
function Nn(e) {
	let t = U;
	return U = e, Mn = e && e.type.__scopeId || null, t;
}
function Pn(e, t = U, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ui(-1);
		let i = Nn(t), a = oi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = oi.length; e > a; e--) ci();
			Nn(i), r._d && ui(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function W(e, t) {
	if (U === null) return e;
	let n = Wi(U), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = u] = t[e];
		i && (w(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && un(a), r.push({
			dir: i,
			instance: n,
			value: a,
			oldValue: void 0,
			arg: o,
			modifiers: s
		}));
	}
	return e;
}
function Fn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ye(), fn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Xe());
	}
}
function In(e, t, n = !1) {
	let r = ji();
	if (r || hr) {
		let i = hr ? hr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && w(t) ? t.call(r && r.proxy) : t;
	}
}
var Ln = /* @__PURE__ */ Symbol.for("v-scx"), Rn = () => In(Ln);
function zn(e, t, n) {
	return Bn(e, t, n);
}
function Bn(e, t, n = u) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = g({}, n), c = t && r || !t && a !== "post", l;
	if (Li) {
		if (a === "sync") {
			let e = Rn();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = f, e.resume = f, e.pause = f, e;
		}
	}
	let d = Ai;
	s.call = (e, t, n) => fn(e, d, t, n);
	let p = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = d, K(e, d && d.suspense);
	} : a !== "sync" && (p = !0, s.scheduler = (e, t) => {
		t ? e() : Cn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), p && (e.flags |= 2, d && (e.id = d.uid, e.i = d));
	};
	let m = ln(e, t, s);
	return Li && (l ? l.push(m) : c && m()), m;
}
var Vn = /* @__PURE__ */ Symbol("_vte"), Hn = (e) => e.__isTeleport, Un = /* @__PURE__ */ Symbol("_leaveCb");
function Wn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ii) {
			t = n;
			break;
		}
	}
	return t;
}
function Gn(e) {
	if (!er(e)) return Hn(e.type) && e.children ? Wn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && w(n.default)) return n.default();
	}
}
function Kn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Kn(Hn(n.type) && Gn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === q && b(e.children)) {
		let n = xr(e.children, !1);
		n && Kn(n, t);
	}
}
function qn(e) {
	if (e.component) return qn(e.component.subTree);
	if (e.type === q) {
		let t = b(e.children) && xr(e.children, !1);
		return t ? qn(t) : void 0;
	}
	if (e.type !== ii) return e;
}
function Jn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Yn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Xn = /* @__PURE__ */ new WeakMap();
function Zn(e, t, n, r, i = !1) {
	if (b(e)) {
		e.forEach((e, a) => Zn(e, t && (b(t) ? t[a] : t), n, r, i));
		return;
	}
	if ($n(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Zn(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Wi(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, d = s.refs === u ? s.refs = {} : s.refs, f = s.setupState, m = /* @__PURE__ */ R(f), h = f === u ? p : (e) => !Yn(d, e) && y(m, e), g = (e, t) => !(t && Yn(d, t));
	if (l != null && l !== c) {
		if (Qn(t), T(l)) d[l] = null, h(l) && (f[l] = null);
		else if (/* @__PURE__ */ z(l)) {
			let e = t;
			g(l, e.k) && (l.value = null), e.k && (d[e.k] = null);
		}
	}
	if (w(c)) dn(c, s, 12, [o, d]);
	else {
		let t = T(c), r = /* @__PURE__ */ z(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? h(c) ? f[c] : d[c] : g(c) || !e.k ? c.value : d[e.k];
					if (i) b(n) && _(n, a);
					else if (b(n)) n.includes(a) || n.push(a);
					else if (t) d[c] = [a], h(c) && (f[c] = d[c]);
					else {
						let t = [a];
						g(c, e.k) && (c.value = t), e.k && (d[e.k] = t);
					}
				} else t ? (d[c] = o, h(c) && (f[c] = o)) : r && (g(c, e.k) && (c.value = o), e.k && (d[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), Xn.delete(e);
				};
				t.id = -1, Xn.set(e, t), K(t, n);
			} else Qn(e), s();
		}
	}
}
function Qn(e) {
	let t = Xn.get(e);
	t && (t.flags |= 8, Xn.delete(e));
}
pe().requestIdleCallback, pe().cancelIdleCallback;
var $n = (e) => !!e.type.__asyncLoader, er = (e) => e.type.__isKeepAlive;
function tr(e, t, n = Ai, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ye();
			let i = Pi(n), a = fn(t, n, e, r);
			return i(), Xe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var nr = (e) => (t, n = Ai) => {
	Li && e !== "sp" || tr(e, (...e) => t(...e), n);
}, rr = nr("m"), ir = nr("bum"), ar = /* @__PURE__ */ Symbol.for("v-ndc");
function G(e, t, n, r) {
	let i, a = n && n[r], o = b(e);
	if (o || T(e)) {
		let n = o && /* @__PURE__ */ Gt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ qt(e), s = /* @__PURE__ */ Kt(e), e = ct(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Zt(Xt(e[n])) : Xt(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (D(e)) {
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
function or(e, t, n, r, i, a) {
	if (n ??= {}, U.ce || U.parent && $n(U.parent) && U.parent.ce) {
		let e = a != null && n.key == null ? g({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), J(), fi(q, null, [Z("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = oi.length;
	J();
	let c;
	try {
		let i = o && sr(o(n)), s = n.key || a || i && i.key;
		c = fi(q, { key: (s && !E(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = oi.length; e > s; e--) ci();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function sr(e) {
	return e.some((e) => !pi(e) || !(e.type === ii || e.type === q && !sr(e.children))) ? e : null;
}
var cr = (e) => e ? Ii(e) ? Wi(e) : cr(e.parent) : null, lr = /* @__PURE__ */ g(/* @__PURE__ */ Object.create(null), {
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
		Cn(e.update);
	},
	$nextTick: (e) => e.n ||= xn.bind(e.proxy),
	$watch: (e) => f
}), ur = (e, t) => e !== u && !e.__isScriptSetup && y(e, t), dr = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: r, data: i, props: a, accessCache: o, type: s, appContext: c } = e;
		if (t[0] !== "$") {
			let e = o[t];
			if (e !== void 0) switch (e) {
				case 1: return r[t];
				case 2: return i[t];
				case 4: return n[t];
				case 3: return a[t];
			}
			else if (ur(r, t)) return o[t] = 1, r[t];
			else if (y(a, t)) return o[t] = 3, a[t];
			else if (n !== u && y(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = lr[t], d, f;
		if (l) return t === "$attrs" && L(e.attrs, "get", ""), l(e);
		if ((d = s.__cssModules) && (d = d[t])) return d;
		if (n !== u && y(n, t)) return o[t] = 4, n[t];
		if (f = c.config.globalProperties, y(f, t)) return f[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return ur(i, t) ? (i[t] = n, !0) : y(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || ur(t, s) || y(a, s) || y(r, s) || y(lr, s) || y(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? y(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function fr() {
	return {
		app: null,
		config: {
			isNativeTag: p,
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
		w(n) || (n = g({}, n)), r != null && !D(r) && (r = null);
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
				return a.has(e) || (e && w(e.install) ? (a.add(e), e.install(c, ...t)) : w(e) && (a.add(e), e(c, ...t))), c;
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
					let u = c._ceVNode || Z(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Wi(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (fn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
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
var hr = null, gr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${M(t)}Modifiers`] || e[`${oe(t)}Modifiers`];
function _r(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || u, i = n, a = t.startsWith("update:"), o = a && gr(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => T(e) ? e.trim() : e)), o.number && (i = i.map(de)));
	let s, c = r[s = ce(t)] || r[s = ce(M(t))];
	!c && a && (c = r[s = ce(oe(t))]), c && fn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, fn(l, e, 6, i);
	}
}
function vr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (b(a) ? a.forEach((e) => o[e] = null) : g(o, a), D(e) && r.set(e, o), o) : (D(e) && r.set(e, null), null);
}
function yr(e, t) {
	return !e || !m(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), y(e, t[0].toLowerCase() + t.slice(1)) || y(e, oe(t)) || y(e, t));
}
function br(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: g } = e, _ = Nn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = xi(l.call(t, e, u, d, p, f, m)), y = s;
		} else {
			let e = t;
			v = xi(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), y = t.props ? s : Sr(s);
		}
	} catch (t) {
		oi.length = 0, pn(t, e, 1), v = Z(ii);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(h) && (y = Cr(y, a)), b = yi(b, y, !1, !0));
	}
	return n.dirs && (b = yi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Kn(Hn(b.type) && Gn(b) || b, n.transition), v = b, Nn(_), v;
}
function xr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (pi(r)) {
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
	for (let n in e) (n === "class" || n === "style" || m(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Cr = (e, t) => {
	let n = {};
	for (let r in e) h(r) && r.slice(9) in t || (n[r] = e[r]);
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
		if (!y(e, a) || Er(t, e, a) && !yr(n, a)) return !0;
	}
	return !1;
}
function Er(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && D(r) && D(i) ? !Ee(r, i) : r !== i;
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
	e.props = n ? r ? i : /* @__PURE__ */ Ht(i) : e.type.props ? i : a, e.attrs = a;
}
function Mr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ R(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (yr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (y(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = M(o);
						i[t] = Pr(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Nr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (y(t, a) || (r = oe(a)) !== a && y(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Pr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && y(t, e) || (delete a[e], l = !0);
	}
	l && ot(e.attrs, "set", "");
}
function Nr(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (re(c)) continue;
		let l = t[c], u;
		i && y(i, u = M(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : yr(e.emitsOptions, c) || c in r && l === r[c] || (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ R(n), r = s || u;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Pr(i, t, s, r[s], e, !y(r, s));
		}
	}
	return o;
}
function Pr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = y(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && w(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Pi(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === oe(n)) && (r = !0));
	}
	return r;
}
function Fr(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return D(e) && r.set(e, d), d;
	if (b(a)) for (let e = 0; e < a.length; e++) {
		let t = M(a[e]);
		Ir(t) && (o[t] = u);
	}
	else if (a) for (let e in a) {
		let t = M(e);
		if (Ir(t)) {
			let n = a[e], r = o[t] = b(n) || w(n) ? { type: n } : g({}, n), i = r.type, c = !1, l = !0;
			if (b(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = w(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = w(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || y(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return D(e) && r.set(e, c), c;
}
function Ir(e) {
	return e[0] !== "$" && !re(e);
}
var Lr = (e) => e === "_" || e === "_ctx" || e === "$stable", Rr = (e) => b(e) ? e.map(xi) : [xi(e)], zr = (e, t, n) => {
	if (t._n) return t;
	let r = Pn((...e) => Rr(t(...e)), n);
	return r._c = !1, r;
}, Br = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Lr(n)) continue;
		let i = e[n];
		if (w(i)) t[n] = zr(n, i, r);
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
		e ? (Hr(r, t, n), n && ue(r, "_", e, !0)) : Br(t, r);
	} else t && Vr(e, t);
}, Wr = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = u;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Hr(i, t, n) : (a = !t.$stable, Br(t, i)), o = t;
	} else t && (Vr(e, t), o = { default: 1 });
	if (a) for (let e in i) !Lr(e) && o[e] == null && delete i[e];
}, K = ni;
function Gr(e) {
	return Kr(e);
}
function Kr(e, t) {
	let n = pe();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = f, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !mi(e, t) && (r = he(e), N(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === d && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: f } = t;
		switch (l) {
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
				te(e, t, n, r, i, a, o, s, c);
				break;
			default: f & 1 ? w(e, t, n, r, i, a, o, s, c) : f & 6 ? ne(e, t, n, r, i, a, o, s, c) : (f & 64 || f & 128) && l.process(e, t, n, r, i, a, o, s, c, _e);
		}
		u != null && i ? Zn(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Zn(e.ref, null, a, e, !0);
	}, y = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, b = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
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
	}, T = (e, t, n, i, s, c, l, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = o(e.type, c, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, i, s, qr(e, c), l, u), _ && Fn(e, null, i, "created"), E(d, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !re(e) && a(d, e, null, m[e], c, i);
			"value" in m && a(d, "value", null, m.value, c), (f = m.onVnodeBeforeMount) && Ti(f, i, e);
		}
		_ && Fn(e, null, i, "beforeMount");
		let v = Yr(s, g);
		v && g.beforeEnter(d), r(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && K(() => {
			try {
				f && Ti(f, i, e), v && g.enter(d), _ && Fn(e, null, i, "mounted");
			} finally {}
		}, s);
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
	}, ee = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let m = e.props || u, h = t.props || u, g;
		if (n && Jr(n, !1), (g = h.onVnodeBeforeUpdate) && Ti(g, n, t, e), f && Fn(t, e, n, "beforeUpdate"), n && Jr(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(c, ""), d ? O(e.dynamicChildren, d, c, n, r, qr(t, i), o) : s || ae(e, t, c, null, n, r, qr(t, i), o, !1), l > 0) {
			if (l & 16) k(c, m, h, n, i);
			else if (l & 2 && m.class !== h.class && a(c, "class", null, h.class, i), l & 4 && a(c, "style", m.style, h.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = m[r], s = h[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && p(c, t.children);
		} else !s && d == null && k(c, m, h, n, i);
		((g = h.onVnodeUpdated) || f) && K(() => {
			g && Ti(g, n, t, e), f && Fn(t, e, n, "updated");
		}, r);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || ei(c), d = u && (c.type === q || !mi(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, k = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== u) for (let o in t) !re(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (re(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, te = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), D(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Xr(e, t, !0)) : ae(e, t, n, f, a, o, c, l, u);
	}, ne = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : A(t, n, r, i, a, o, c) : j(e, t, c);
	}, A = (e, t, n, r, i, a, o) => {
		let s = e.component = ki(e, r, i);
		if (er(e) && (s.ctx.renderer = _e), Ri(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o, a), !e.el) {
				let r = s.subTree = Z(ii);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, j = (e, t, n) => {
		let r = t.component = e.component;
		if (wr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, M(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, ie = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Qr(e);
					if (n) {
						t && (t.el = c.el, M(e, t, o)), n.asyncDep.then(() => {
							K(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Jr(e, !1), t ? (t.el = c.el, M(e, t, o)) : t = c, n && le(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ti(d, s, t, c), Jr(e, !0);
				let f = br(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), he(p), e, i, a), t.el = f.el, u === null && Dr(e, f.el), r && K(r, i), (d = t.props && t.props.onVnodeUpdated) && K(() => Ti(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = $n(t);
				if (Jr(e, !1), l && le(l), !m && (o = c && c.onVnodeBeforeMount) && Ti(o, d, t), Jr(e, !0), s && ye) {
					let t = () => {
						e.subTree = br(e), ye(s, e.subTree, e, i, null);
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
				(t.shapeFlag & 256 || d && $n(d.vnode) && d.vnode.shapeFlag & 256) && e.a && K(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Pe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Cn(u), Jr(e, !0), l();
	}, M = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Mr(e, t.props, r, n), Wr(e, t.children, n), Ye(), En(e), Xe();
	}, ae = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				se(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				oe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && me(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? se(l, d, n, r, i, a, o, s, c) : me(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, oe = (e, t, n, r, i, a, o, s, c) => {
		e ||= d, t ||= d;
		let l = e.length, u = t.length, f = Math.min(l, u), p = 0;
		for (; p < f; p++) {
			let r = t[p] = c ? Si(t[p]) : xi(t[p]);
			v(e[p], r, n, null, i, a, o, s, c);
		}
		l > u ? me(e, i, a, !0, !1, f) : D(t, n, r, i, a, o, s, c, f);
	}, se = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, f = e.length - 1, p = u - 1;
		for (; l <= f && l <= p;) {
			let r = e[l], u = t[l] = c ? Si(t[l]) : xi(t[l]);
			if (mi(r, u)) v(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= f && l <= p;) {
			let r = e[f], l = t[p] = c ? Si(t[p]) : xi(t[p]);
			if (mi(r, l)) v(r, l, n, null, i, a, o, s, c);
			else break;
			f--, p--;
		}
		if (l > f) {
			if (l <= p) {
				let e = p + 1, d = e < u ? t[e].el : r;
				for (; l <= p;) v(null, t[l] = c ? Si(t[l]) : xi(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > p) for (; l <= f;) N(e[l], i, a, !0), l++;
		else {
			let m = l, h = l, g = /* @__PURE__ */ new Map();
			for (l = h; l <= p; l++) {
				let e = t[l] = c ? Si(t[l]) : xi(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (l = 0; l < b; l++) C[l] = 0;
			for (l = m; l <= f; l++) {
				let r = e[l];
				if (y >= b) {
					N(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && mi(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? N(r, i, a, !0) : (C[u - h] = l + 1, u >= S ? S = u : x = !0, v(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let w = x ? Zr(C) : d;
			for (_ = w.length - 1, l = b - 1; l >= 0; l--) {
				let e = h + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || ei(f) : r;
				C[l] === 0 ? v(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== w[_] ? ce(d, n, p, 2) : _--);
			}
		}
	}, ce = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) ce(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, _e);
		else if (c === q) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) ce(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === ai) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[Un] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), K(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[Un];
					s._isLeaving && s[Un](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, N = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ye(), Zn(s, null, n, e, !0), Xe()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !$n(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ti(_, t, e), u & 6) fe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Fn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, _e, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? me(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && me(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && K(() => {
			_ && Ti(_, t, e), h && Fn(e, null, t, "unmounted"), v && (e.el = null);
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
		let s = o ? qn(e) : e, c = () => {
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
		$r(c), $r(l), r && le(r), i.stop(), a ? (a.flags |= 8, N(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, N(o, e, t, n)), s && K(s, t), K(() => {
			e.isUnmounted = !0;
		}, t);
	}, me = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) N(e[o], t, n, r, i);
	}, he = (e) => {
		if (e.shapeFlag & 6) return he(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Vn];
		return n ? h(n) : t;
	}, ge = (e, t, n) => {
		kn(() => {
			e == null ? t._vnode && N(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Oi());
	}, _e = {
		p: v,
		um: N,
		m: ce,
		r: ue,
		mt: A,
		mc: D,
		pc: ae,
		pbc: O,
		n: he,
		o: e
	}, ve, ye;
	return t && ([ve, ye] = t(_e)), {
		render: ge,
		hydrate: ve,
		createApp: mr(ge, ve)
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
	if (b(r) && b(i)) for (let e = 0; e < r.length; e++) {
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
	t && t.pendingBranch ? b(e) ? t.effects.push(...e) : t.effects.push(e) : Tn(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), ri = /* @__PURE__ */ Symbol.for("v-txt"), ii = /* @__PURE__ */ Symbol.for("v-cmt"), ai = /* @__PURE__ */ Symbol.for("v-stc"), oi = [], si = null;
function J(e = !1) {
	oi.push(si = e ? null : []);
}
function ci() {
	oi.pop(), si = oi[oi.length - 1] || null;
}
var li = 1;
function ui(e, t = !1) {
	li += e, e < 0 && si && t && (si.hasOnce = !0);
}
function di(e) {
	return e.dynamicChildren = li > 0 ? si || d : null, ci(), li > 0 && si && si.push(e), e;
}
function Y(e, t, n, r, i, a) {
	return di(X(e, t, n, r, i, a, !0));
}
function fi(e, t, n, r, i) {
	return di(Z(e, t, n, r, i, !0));
}
function pi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function mi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var hi = ({ key: e }) => e ?? null, gi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : T(e) || /* @__PURE__ */ z(e) || w(e) ? {
	i: U,
	r: e,
	k: t,
	f: !!n
} : e);
function X(e, t = null, n = null, r = 0, i = null, a = e === q ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && hi(t),
		ref: t && gi(t),
		scopeId: Mn,
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
	return s ? (Ci(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= T(n) ? 8 : 16), li > 0 && !o && si && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && si.push(c), c;
}
var Z = _i;
function _i(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== ar || (e = ii), pi(e)) {
		let r = yi(e, t, !0);
		return n && Ci(r, n), li > 0 && !a && si && (r.shapeFlag & 6 ? si[si.indexOf(e)] = r : si.push(r)), r.patchFlag = -2, r;
	}
	if (Gi(e) && (e = e.__vccOpts), t) {
		t = vi(t);
		let { class: e, style: n } = t;
		e && !T(e) && (t.class = ye(e)), D(n) && (/* @__PURE__ */ Jt(n) && !b(n) && (n = g({}, n)), t.style = me(n));
	}
	let o = T(e) ? 1 : ti(e) ? 128 : Hn(e) ? 64 : D(e) ? 4 : w(e) ? 2 : 0;
	return X(e, t, n, r, i, o, a, !0);
}
function vi(e) {
	return e ? /* @__PURE__ */ Jt(e) || Ar(e) ? g({}, e) : e : null;
}
function yi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? wi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && hi(l),
		ref: t && t.ref ? n && a ? b(a) ? a.concat(gi(t)) : [a, gi(t)] : gi(t) : a,
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
	return c && r && Kn(u, c.clone(u)), u;
}
function bi(e = " ", t = 0) {
	return Z(ri, null, e, t);
}
function Q(e = "", t = !1) {
	return t ? (J(), fi(ii, null, e)) : Z(ii, null, e);
}
function xi(e) {
	return e == null || typeof e == "boolean" ? Z(ii) : b(e) ? Z(q, null, e.slice()) : pi(e) ? Si(e) : Z(ri, null, String(e));
}
function Si(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : yi(e);
}
function Ci(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (b(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ci(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Ar(t) ? t._ctx = U : r === 3 && U && (U.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (w(t)) {
		if (r & 65) {
			Ci(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: U
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [bi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function wi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = ye([t.class, r.class]));
		else if (e === "style") t.style = me([t.style, r.style]);
		else if (m(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(b(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !h(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ti(e, t, n, r = null) {
	fn(e, t, 7, [n, r]);
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
		scope: new je(!0),
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
		propsDefaults: u,
		inheritAttrs: r.inheritAttrs,
		ctx: u,
		data: u,
		props: u,
		attrs: u,
		slots: u,
		refs: u,
		setupState: u,
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
var Ai = null, ji = () => Ai || U, Mi, Ni;
{
	let e = pe(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Mi = t("__VUE_INSTANCE_SETTERS__", (e) => Ai = e), Ni = t("__VUE_SSR_SETTERS__", (e) => Li = e);
}
var Pi = (e) => {
	let t = Ai;
	return Mi(e), e.scope.on(), () => {
		e.scope.off(), Mi(t);
	};
}, Fi = () => {
	Ai && Ai.scope.off(), Mi(null);
};
function Ii(e) {
	return e.vnode.shapeFlag & 4;
}
var Li = !1;
function Ri(e, t = !1, n = !1) {
	t && Ni(t);
	let { props: r, children: i } = e.vnode, a = Ii(e);
	jr(e, r, a, t), Ur(e, i, n || t);
	let o = a ? zi(e, t) : void 0;
	return t && Ni(!1), o;
}
function zi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, dr);
	let { setup: r } = n;
	if (r) {
		Ye();
		let n = e.setupContext = r.length > 1 ? Ui(e) : null, i = Pi(e), a = dn(r, e, 0, [e.props, n]), o = ee(a);
		if (Xe(), i(), (o || e.sp) && !$n(e) && Jn(e), o) {
			if (a.then(Fi, Fi), t) return a.then((n) => {
				Ni(!0);
				try {
					Bi(e, n, t);
				} finally {
					Ni(!1);
				}
			}).catch((t) => {
				pn(t, e, 0);
			});
			e.asyncDep = a;
		} else Bi(e, a, t);
	} else Vi(e, t);
}
function Bi(e, t, n) {
	w(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : D(t) && (e.setupState = tn(t)), Vi(e, n);
}
function Vi(e, t, n) {
	let r = e.type;
	e.render ||= r.render || f;
}
var Hi = { get(e, t) {
	return L(e, "get", ""), e[t];
} };
function Ui(e) {
	return {
		attrs: new Proxy(e.attrs, Hi),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Wi(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(tn(Yt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in lr) return lr[n](e);
		},
		has(e, t) {
			return t in e || t in lr;
		}
	}) : e.proxy;
}
function Gi(e) {
	return w(e) && "__vccOpts" in e;
}
var Ki = (e, t) => /* @__PURE__ */ rn(e, t, Li), qi = "3.5.44", Ji = void 0, Yi = typeof window < "u" && window.trustedTypes;
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
var ia = /* @__PURE__ */ Symbol("_vod"), aa = /* @__PURE__ */ Symbol("_vsh"), oa = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[ia] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : sa(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), sa(e, !0), r.enter(e)) : r.leave(e, () => {
			sa(e, !1);
		}) : sa(e, t));
	},
	beforeUnmount(e, { value: t }) {
		sa(e, t);
	}
};
function sa(e, t) {
	e.style.display = t ? e[ia] : "none", e[aa] = !t;
}
var ca = /* @__PURE__ */ Symbol(""), la = /(?:^|;)\s*display\s*:/;
function ua(e, t, n) {
	let r = e.style, i = T(n), a = !1;
	if (n && !i) {
		if (t) {
			if (T(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? fa(r, t, "");
			}
			else for (let e in t) n[e] ?? fa(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? fa(r, i, "") : ga(e, i, !T(t) && t ? t[i] : void 0, o) || fa(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ca];
			e && (n += ";" + e), r.cssText = n, a = la.test(n);
		}
	} else t && e.removeAttribute("style");
	ia in e && (i && t === n || (e[ia] = a ? r.display : ""), e[aa] && (r.display = "none"));
}
var da = /\s*!important$/;
function fa(e, t, n) {
	if (b(n)) n.forEach((n) => fa(e, t, n));
	else if (n ??= "", t.startsWith("--")) da.test(n) ? e.setProperty(t, n.replace(da, ""), "important") : e.setProperty(t, n);
	else {
		let r = ha(e, t);
		da.test(n) ? e.setProperty(oe(r), n.replace(da, ""), "important") : e[r] = n;
	}
}
var pa = [
	"Webkit",
	"Moz",
	"ms"
], ma = {};
function ha(e, t) {
	let n = ma[t];
	if (n) return n;
	let r = M(t);
	if (r !== "filter" && r in e) return ma[t] = r;
	r = se(r);
	for (let n = 0; n < pa.length; n++) {
		let i = pa[n] + r;
		if (i in e) return ma[t] = i;
	}
	return t;
}
function ga(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && T(r) && n === r;
}
var _a = "http://www.w3.org/1999/xlink";
function va(e, t, n, r, i, a = be(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(_a, t.slice(6, t.length)) : e.setAttributeNS(_a, t, n) : n == null || a && !xe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : E(n) ? String(n) : n);
}
function ya(e, t, n, r, i) {
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
		r === "boolean" ? n = xe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function ba(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function xa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Sa = /* @__PURE__ */ Symbol("_vei");
function Ca(e, t, n, r, i = null) {
	let a = e[Sa] || (e[Sa] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ea(t);
		r ? ba(e, n, a[t] = Aa(r, i), s) : o && (xa(e, n, o, s), a[t] = void 0);
	}
}
var wa = /(Once|Passive|Capture)$/, Ta = /^on:?(?:Once|Passive|Capture)$/;
function Ea(e) {
	let t, n;
	for (; (n = e.match(wa)) && !Ta.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : oe(e.slice(2)), t];
}
var Da = 0, Oa = /* @__PURE__ */ Promise.resolve(), ka = () => Da ||= (Oa.then(() => Da = 0), Date.now());
function Aa(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (b(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && fn(e, t, 5, a);
			}
		} else fn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ka(), n;
}
var ja = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ma = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? ra(e, r, o) : t === "style" ? ua(e, n, r) : m(t) ? h(t) || Ca(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Na(e, t, r, o)) ? (ya(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || va(e, t, r, o, a, t !== "value")) : e._isVueCE && (Pa(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !T(r))) ? ya(e, M(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), va(e, t, r, o));
};
function Na(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && ja(t) && w(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return ja(t) && T(n) ? !1 : t in e;
}
function Pa(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = M(t);
	return Array.isArray(n) ? n.some((e) => M(e) === r) : Object.keys(n).some((e) => M(e) === r);
}
var Fa = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return b(t) ? (e) => le(t, e) : t;
};
function Ia(e) {
	e.target.composing = !0;
}
function La(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Ra = /* @__PURE__ */ Symbol("_assign"), za = /* @__PURE__ */ Symbol("_initialValue");
function Ba(e, t, n) {
	return t && (e = e.trim()), n && (e = de(e)), e;
}
var $ = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[za] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[za] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Ra] = Fa(i);
		let a = r || i.props && i.props.type === "number";
		ba(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Ra](Ba(e.value, n, a));
		}), (n || a) && ba(e, "change", () => {
			e.value = Ba(e.value, n, a);
		}), t || (ba(e, "compositionstart", Ia), ba(e, "compositionend", La), ba(e, "change", La));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[za];
		delete e[za], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Ra](Ba(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Ra] = Fa(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? de(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Va = {
	deep: !0,
	created(e, t, n) {
		e[Ra] = Fa(n), ba(e, "change", () => {
			let t = e._modelValue, n = qa(e), r = e.checked, i = e[Ra];
			if (b(t)) {
				let e = De(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (S(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Ja(e, r));
		});
	},
	mounted: Ha,
	beforeUpdate(e, t, n) {
		e[Ra] = Fa(n), Ha(e, t, n);
	}
};
function Ha(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (b(t)) i = De(t, r.props.value) > -1;
	else if (S(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ee(t, Ja(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Ua = {
	created(e, { value: t }, n) {
		e.checked = Ee(t, n.props.value), e[Ra] = Fa(n), ba(e, "change", () => {
			e[Ra](qa(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[Ra] = Fa(r), t !== n && (e.checked = Ee(t, r.props.value));
	}
}, Wa = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, ba(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? de(qa(e)) : qa(e)), r = e.multiple, i = r ? S(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? b(i) ? t.slice() : t : i];
			try {
				e[Ra](i);
			} finally {
				xn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Ra] = Fa(r);
	},
	mounted(e, { value: t }) {
		Ka(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Ra] = Fa(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && Ga(t, n[1], n[0]) || Ka(e, t);
	}
};
function Ga(e, t, n) {
	if (!n || b(e)) return Ee(e, t);
	if (S(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Ka(e, t) {
	let n = e.multiple, r = b(t);
	if (!n || r || S(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = qa(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : De(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Ee(qa(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function qa(e) {
	return "_value" in e ? e._value : e.value;
}
function Ja(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Ya = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Xa = {
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
	exact: (e, t) => Ya.some((n) => e[`${n}Key`] && !t.includes(n))
}, Za = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Xa[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Qa = /* @__PURE__ */ g({ patchProp: Ma }, ta), $a;
function eo() {
	return $a ||= Gr(Qa);
}
var to = ((...e) => {
	let t = eo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ro(e);
		if (!r) return;
		let i = t._component;
		w(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, no(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function no(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ro(e) {
	return T(e) ? document.querySelector(e) : e;
}
// services/play/src/model.js
var io = [
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
], ao = [
	"multiple-choice",
	"true-false",
	"fill-blanks",
	"drag-text",
	"mark-words",
	"matching",
	"classify",
	"ordering"
], oo = {
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
}, so = (e) => JSON.parse(JSON.stringify(e));
function co(e = "multiple-choice") {
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
	]), e === "compound" && (t.activities = [co(), co()], t.passPercentage = 60, t.randomQuestions = !1), t;
}
function lo(e) {
	return {
		...co(io.includes(e?.type) ? e.type : "multiple-choice"),
		...so(e)
	};
}
function uo(e, t) {
	let n = {
		type: e.type,
		title: String(e.title || "").trim(),
		question: String(e.question || "").trim(),
		language: t,
		subject: e.subject || "",
		educational_stage: e.educational_stage || "",
		educational_level: e.educational_level || "",
		tags: so(e.tags || [])
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
	}[n.type] || []) n[t] = so(e[t]);
	return n.type === "compound" && (n.activities = e.activities.map((e) => {
		let n = uo(e, t);
		return e.sourceActivityId && (n.sourceActivityId = e.sourceActivityId), n;
	})), e.visibility && (n.visibility = e.visibility), n;
}
function fo(e, t) {
	let n = [];
	e.title || n.push(t("errors.title")), e.question || n.push(t("errors.question"));
	let r = (e, r) => {
		e && n.push(t("errors." + r));
	};
	return e.type === "multiple-choice" && (r(e.answers.length < 2 || e.answers.length > 8 || e.answers.some((e) => !e.text.trim()), "answers"), r(!e.answers.some((e) => e.correct), "correct")), e.type === "memory" && r(e.cards.length < 2 || e.cards.length > 12 || e.cards.some((e) => !e.text.trim()), "cards"), e.type === "matching" && r(e.pairs.length < 2 || e.pairs.length > 8 || e.pairs.some((e) => !e.left.trim() || !e.right.trim()), "pairs"), ["classify", "ordering"].includes(e.type) && (r(e.categories.length < 2 || e.categories.length > 12 || e.categories.some((e) => !e.name.trim()), "categories"), r(e.items.length < 3 || e.items.length > 12 || e.items.some((t) => !t.text.trim() || !Number.isInteger(Number(t.category)) || t.category < 0 || t.category >= e.categories.length), "items")), [
		"fill-blanks",
		"drag-text",
		"mark-words"
	].includes(e.type) && r(!/\*[^*]+\*/.test(e.text), "fillBlanks"), e.type === "dialog-cards" && r(e.cards.length < 3 || e.cards.length > 15 || e.cards.some((e) => !e.front.trim() || !e.back.trim()), "dialogCards"), e.type === "crossword" && (r(e.words.length < 4 || e.words.length > 10 || e.words.some((e) => !/^[a-záéíóúüñ]+$/i.test(e.answer) || e.answer.length > 20 || !e.clue.trim()), "crossword"), r(new Set(e.words.map((e) => e.answer.toLowerCase())).size !== e.words.length, "crosswordUnique")), e.type === "find-words" && (r(e.words.length < 4 || e.words.length > 12 || e.words.some((e) => !/^[a-záéíóúüñ]+$/i.test(e) || e.length > 15), "findWords"), r(new Set(e.words.map((e) => e.toLowerCase())).size !== e.words.length, "findWordsUnique")), e.type === "compound" && ((e.activities.length < 2 || e.activities.length > 10 || !Number.isFinite(e.passPercentage) || e.passPercentage < 0 || e.passPercentage > 100) && n.push(t("compound.error")), e.activities.forEach((e, r) => n.push(...fo(e, t).map((e) => `${r + 1}. ${e}`)))), n;
}
async function po(e) {
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
function mo(e, t) {
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
function ho() {
	let e = location.pathname === "/play" || location.pathname.startsWith("/play/") ? "/play" : "", t = "edutictac-play-draft", n = window.commonsLanguage.read(), r = /* @__PURE__ */ B([
		"es",
		"ca",
		"va",
		"en"
	].includes(n) ? n : "es"), i = /* @__PURE__ */ B({}), a = (e) => e.split(".").reduce((e, t) => e?.[t], i.value) || e, o = /* @__PURE__ */ B("home"), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(co()), u = /* @__PURE__ */ B(null), d = /* @__PURE__ */ B(""), f = /* @__PURE__ */ B(""), p = /* @__PURE__ */ B(!1), m = /* @__PURE__ */ B(0), h = /* @__PURE__ */ B(""), g = /* @__PURE__ */ B(""), _ = /* @__PURE__ */ B({}), v = /* @__PURE__ */ B(null), y = /* @__PURE__ */ B(!1), b = /* @__PURE__ */ B(null), x = {}, S = /* @__PURE__ */ B({}), C = /* @__PURE__ */ Vt({
		subjects: "",
		educational_stages: "",
		levels: "",
		tags: ""
	}), w = /* @__PURE__ */ B(""), T = /* @__PURE__ */ Vt({
		items: [],
		total: 0,
		offset: 0,
		hasMore: !1,
		term: "",
		type: "",
		loading: !1,
		error: !1
	}), E = /* @__PURE__ */ Vt({
		items: [],
		term: "",
		loading: !1,
		error: !1
	}), D = /* @__PURE__ */ B(), ee = /* @__PURE__ */ B(""), O = /* @__PURE__ */ B("");
	try {
		O.value = localStorage.getItem("edutictac-play-admin-token") || "", localStorage.removeItem("edutictac-play-admin-token");
	} catch {}
	let k = 0, te = 0, ne = 0, A = 0, re = 0, j = !0, ie = "", M = mo(e, (e) => {
		u.value?.id === e && j && (f.value = "resultSaved");
	}), ae = Ki(() => c.value || m.value > 0), oe = Ki(() => ["published", "updated"].includes(u.value?.recursos?.status)), se = Ki(() => a(l.value.type === "compound" ? "compound.editor" : l.value.type === "multiple-choice" ? "editorTitle" : oo[l.value.type] + "Editor"));
	function ce() {
		let e = localStorage.getItem("edutictac-play-creator-key");
		return e && /^[A-Za-z0-9_-]{16,128}$/.test(e) || (e = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2) + Date.now().toString(36), localStorage.setItem("edutictac-play-creator-key", e)), e;
	}
	async function N(t, n = {}) {
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
		return N(e, {
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
			c.value || ue(e);
		}
	};
	function de(e) {
		if (typeof e != "string") return;
		let t = e.startsWith("//") ? location.protocol + e : e;
		try {
			if (t && !["http:", "https:"].includes(new URL(t).protocol)) return;
		} catch {
			return;
		}
		if (b.value = t, document.getElementById("edutictacAccountScript")) return;
		let n = document.createElement("link");
		n.rel = "stylesheet", n.href = t + "/assets/account-widget.css", document.head.append(n);
		let r = document.createElement("script");
		r.id = "edutictacAccountScript", r.defer = !0, r.src = t + "/assets/account-widget.js", document.head.append(r);
	}
	function fe() {
		j && s.value && xe();
	}
	function pe(e) {
		io.includes(e) && !ae.value && (x[l.value.type] = l.value, x[e] || (x[e] = {
			...co(e),
			title: l.value.title,
			question: l.value.question
		}), l.value = x[e], o.value = "editor", d.value = "", ++k);
	}
	function me(e) {
		c.value || (++k, o.value = e, f.value = "", d.value = "", D.value?.close(), ++A);
	}
	async function he(n = !1) {
		if (ae.value) return;
		let i = uo(l.value, r.value), s = fo(i, a);
		if (d.value = s.join(" "), s.length) return;
		c.value = !0;
		let m = k;
		try {
			n && localStorage.setItem(t, JSON.stringify({
				...i,
				_owner: _.value.actor || ""
			}));
			let r = await le(n ? "/previews" : "/activities", i);
			if (m !== k || !j || (u.value = r, n || await xe(), m !== k || !j)) return;
			o.value = "previewPanel", f.value = n ? "" : "saved", p.value = !1, n || localStorage.removeItem(t), history.replaceState({}, "", n ? e + "/" + M.query() : e + "/" + r.id + M.query());
		} catch (e) {
			if (m === k && j) {
				let t = e.details?.join(" ");
				d.value = e.status === 401 ? a("loginToSave") : t || a(n ? "previewError" : "saveError"), f.value = "saveError", p.value = !0;
			}
		} finally {
			m === k && (c.value = !1);
		}
	}
	async function ge() {
		let e = ++ne, t = k;
		T.loading = !0, T.error = !1;
		try {
			let n = await N("/activities?" + new URLSearchParams({
				limit: "12",
				offset: T.offset,
				q: T.term.trim(),
				type: T.type
			}));
			if (e !== ne || t !== k || !j) return;
			Object.assign(T, {
				items: n.items,
				total: n.total,
				offset: n.offset,
				hasMore: n.hasMore
			});
		} catch {
			e === ne && t === k && (T.error = !0);
		} finally {
			e === ne && (T.loading = !1);
		}
	}
	function _e() {
		me("library"), T.offset = 0, ge();
	}
	function ve(e = 0) {
		T.offset = e, ge();
	}
	function ye() {
		c.value || (O.value = ee.value.trim(), ee.value = "", w.value = "", ++ne, ge());
	}
	async function be(n, r = !1) {
		if (c.value || !window.confirm(a(r ? "libraryConfirmDelete" : "deleteConfirm"))) return;
		c.value = !0;
		let i = k;
		try {
			if (await N("/activities/" + n, {
				method: "DELETE",
				headers: O.value ? { "X-Admin-Token": O.value } : {}
			}), i !== k || !j) return;
			r ? await ge() : (u.value = null, localStorage.removeItem(t), history.replaceState({}, "", e + "/"), o.value = "home");
		} catch {
			i === k && (f.value = "deleteError", p.value = !0, r && (T.error = !0));
		} finally {
			i === k && (c.value = !1);
		}
	}
	async function xe() {
		let e = k;
		try {
			let t = await N("/publication/me");
			if (e !== k || !j) return;
			if (_.value = t, v.value = null, t.can_submit && u.value?.id && !u.value.id.startsWith("preview-")) {
				let t = u.value.id, n = await N("/submissions/" + t);
				e === k && u.value?.id === t && j && (v.value = n);
			}
		} catch {
			e === k && (_.value = {}, v.value = null);
		}
	}
	async function Se() {
		if (c.value || !_.value.can_submit || !u.value?.id) return;
		c.value = !0;
		let e = k, t = u.value.id;
		try {
			let n = await le("/submissions/" + t, { revision: v.value?.revision || 0 }, { "X-Play-Review": "1" });
			if (e !== k || !j) return;
			v.value = n, f.value = "reviewSent", p.value = !1;
		} catch {
			e === k && (f.value = "reviewSubmitError", p.value = !0);
		} finally {
			e === k && (c.value = !1);
		}
	}
	async function Ce(e = !1) {
		if (c.value || !_.value.can_publish || !u.value?.id || u.value.id.startsWith("preview-")) return;
		c.value = !0;
		let t = k, n = u.value.id;
		f.value = e ? "unpublishRecursosLoading" : "publishRecursosLoading";
		try {
			let r = await le("/recursos/" + (e ? "unpublish" : "publish"), { activity_id: n });
			if (t !== k || u.value?.id !== n || !j) return;
			u.value.recursos = r, f.value = e ? "unpublishRecursosDone" : "publishRecursosDone", p.value = !1;
		} catch {
			t === k && (f.value = e ? "unpublishRecursosError" : "publishRecursosError", p.value = !0);
		} finally {
			t === k && (c.value = !1);
		}
	}
	async function we() {
		let e = ++re;
		try {
			let t = await N("/catalog");
			if (e !== re || !j) return;
			S.value = t;
			for (let e of Object.keys(C)) C[e] = (t[e] || []).join("\n");
		} catch {}
	}
	async function Te() {
		if (c.value) return;
		if (!O.value) {
			w.value = "catalogTokenRequired";
			return;
		}
		c.value = !0;
		let e = k;
		try {
			await le("/catalog", {
				...Object.fromEntries(Object.entries(C).map(([e, t]) => [e, t.split("\n").map((e) => e.trim()).filter(Boolean)])),
				labels: S.value.labels || {}
			}, { "X-Admin-Token": O.value }), e === k && j && (w.value = "catalogSaved", await we());
		} catch {
			e === k && (w.value = "catalogError");
		} finally {
			e === k && (c.value = !1);
		}
	}
	async function Ee() {
		let e = ++A, t = k;
		E.loading = !0, E.error = !1;
		try {
			let n = await N("/activities?" + new URLSearchParams({
				limit: "100",
				q: E.term.trim()
			}));
			if (e !== A || t !== k || !j) return;
			E.items = n.items.filter((e) => ao.includes(e.type));
		} catch {
			e === A && (E.error = !0);
		} finally {
			e === A && (E.loading = !1);
		}
	}
	async function De() {
		ae.value || (E.term = "", E.items = [], D.value.showModal(), Ee());
	}
	async function Oe(e) {
		if (c.value || l.value.type !== "compound" || l.value.activities.length >= 10) return;
		let t = k, n = A, r = l.value;
		c.value = !0;
		try {
			let i = await N("/activities/" + e);
			if (t !== k || n !== A || l.value !== r || !D.value.open || !j) return;
			if (!ao.includes(i.type)) throw Error();
			r.activities.push({
				...lo(i),
				sourceActivityId: e
			}), D.value.close(), f.value = "bank.copied";
		} catch {
			t === k && (E.error = !0);
		} finally {
			t === k && (c.value = !1);
		}
	}
	function P() {
		++A, D.value?.close();
	}
	function ke(t) {
		t && !t.startsWith("preview-") && (g.value = new URL(e + "/" + t, location.origin).href);
	}
	function Ae() {
		g.value = "";
	}
	async function F() {
		try {
			await navigator.clipboard.writeText(location.href), f.value = "copied", p.value = !1;
		} catch {
			f.value = "copyError", p.value = !0;
		}
	}
	async function je() {
		let n = k;
		await ue(r.value);
		try {
			await M.launch();
		} catch {
			d.value = a("launchError");
			return;
		}
		if (n !== k || !j || (M.flush(), we(), await xe(), n !== k || !j)) return;
		N("/config").then((e) => {
			y.value = !!e.integrated, de(e.commonsBase);
			try {
				let t = new URL(e.commonsUrl);
				e.demo && ["http:", "https:"].includes(t.protocol) && !t.username && !t.password && (h.value = t.href);
			} catch {}
		}).catch(() => {});
		let i = location.pathname.match(RegExp("^" + e + "/([A-Za-z0-9]{8})$"))?.[1] || new URLSearchParams(location.search).get("activity");
		if (i) try {
			if (!/^[A-Za-z0-9]{8}$/.test(i)) throw Error();
			let e = await N("/activities/" + i);
			if (n !== k || !j || (u.value = e, await xe(), n !== k || !j)) return;
			l.value = lo(e), x[l.value.type] = l.value, o.value = "previewPanel", f.value = "saved";
		} catch {
			d.value = a("libraryError");
		}
		else try {
			let e = JSON.parse(localStorage.getItem(t) || "null");
			e && io.includes(e.type) && (!e._owner || e._owner === _.value.actor) && (l.value = lo(e), x[l.value.type] = l.value);
		} catch {
			localStorage.removeItem(t);
		}
		s.value = !0, document.documentElement.dataset.playReady = "true";
	}
	function Me() {
		ie = _.value.actor || "", document.getElementById("playApp")?.setAttribute("hidden", ""), j = !1, ++k, ++ne, ++A, ++re, O.value = "", ee.value = "", _.value = {}, v.value = null, c.value = !1, D.value?.close();
	}
	async function I(e) {
		if (e.persisted) {
			if (j = !0, !s.value) await je(), document.getElementById("playApp")?.removeAttribute("hidden");
			else {
				if (await xe(), ie && ie !== _.value.actor && (u.value = null, l.value = co(), Object.keys(x).forEach((e) => delete x[e]), o.value = "home", localStorage.removeItem(t)), u.value?.visibility === "private") try {
					u.value = await N("/activities/" + u.value.id);
				} catch {
					u.value = null, l.value = co(), o.value = "home";
				}
				await xn(), document.getElementById("playApp")?.removeAttribute("hidden"), we(), o.value === "library" && ge();
			}
		}
	}
	function Ne() {
		M.flush();
	}
	return rr(() => {
		je(), window.addEventListener("online", Ne), window.addEventListener("pagehide", Me), window.addEventListener("pageshow", I), window.addEventListener("edutictac:sessionchange", fe);
	}), ir(() => {
		Me(), window.removeEventListener("online", Ne), window.removeEventListener("pagehide", Me), window.removeEventListener("pageshow", I), window.removeEventListener("edutictac:sessionchange", fe);
	}), {
		capabilities: _,
		submission: v,
		integrated: y,
		commonsBase: b,
		submitReview: Se,
		loadPublication: xe,
		base: e,
		TYPES: io,
		CHILD_TYPES: ao,
		TYPE_LABELS: oo,
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
		qrUrl: g,
		showQr: ke,
		closeQr: Ae,
		catalog: S,
		catalogDraft: C,
		catalogMessage: w,
		library: T,
		bank: E,
		bankDialog: D,
		adminInput: ee,
		adminToken: O,
		published: oe,
		editorTitle: se,
		choose: pe,
		go: me,
		changeLanguage: ue,
		saveActivity: he,
		loadLibrary: ge,
		openLibrary: _e,
		filterLibrary: ve,
		applyToken: ye,
		removeActivity: be,
		publication: Ce,
		saveCatalog: Te,
		openBank: De,
		loadBank: Ee,
		addFromBank: Oe,
		closeBank: P,
		copy: F,
		onStatement: M.report
	};
}
// services/play/src/CompoundStep.vue
var go = { class: "compound-step" }, _o = { class: "section-heading" }, vo = { class: "compound-step-number" }, yo = ["disabled"], bo = {
	key: 0,
	class: "compound-source"
}, xo = ["value", "disabled"], So = ["value"], Co = ["disabled"], wo = ["disabled"], To = { class: "compound-details" }, Eo = { key: 0 }, Do = ["value", "disabled"], Oo = { key: 1 }, ko = ["disabled"], Ao = { value: !0 }, jo = { value: !1 }, Mo = { key: 2 }, No = ["disabled"], Po = { key: 3 }, Fo = ["value", "disabled"], Io = ["value", "disabled"], Lo = ["value", "disabled"], Ro = {
	__name: "CompoundStep",
	props: {
		step: Object,
		index: Number,
		t: Function,
		disabled: Boolean
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(""), c = {};
		function l() {
			let e = n.step;
			i.value = (e.answers || []).map((e) => (e.correct ? "*" : "") + e.text).join("\n"), a.value = (e.pairs || []).map((e) => e.left + " | " + e.right).join("\n"), o.value = (e.categories || []).map((e) => e.name).join(", "), s.value = (e.items || []).map((e) => e.text + " | " + e.category).join("\n");
		}
		function u(e) {
			let t = n.step;
			c[t.type] = so(t), Object.assign(t, c[e] || co(e), {
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
		return zn(() => n.step, l, { immediate: !0 }), (t, n) => (J(), Y("article", go, [
			X("div", _o, [
				X("strong", vo, P(e.index + 1) + ".", 1),
				X("button", {
					type: "button",
					class: "button secondary compound-remove",
					disabled: e.disabled,
					onClick: n[0] ||= (e) => r("remove")
				}, P(e.t("compound.remove")), 9, yo),
				e.step.sourceActivityId ? (J(), Y("small", bo, P(e.t("bank.source")) + ": " + P(e.step.sourceActivityId), 1)) : Q("", !0)
			]),
			X("label", null, [X("span", null, P(e.t("compound.type")), 1), X("select", {
				class: "compound-type",
				value: e.step.type,
				disabled: e.disabled,
				onChange: n[1] ||= (e) => u(e.target.value)
			}, [(J(!0), Y(q, null, G(V(ao), (t) => (J(), Y("option", {
				key: t,
				value: t
			}, P(e.t(V(oo)[t])), 9, So))), 128))], 40, xo)]),
			X("label", null, [X("span", null, P(e.t("compound.stepTitle")), 1), W(X("input", {
				"onUpdate:modelValue": n[2] ||= (t) => e.step.title = t,
				class: "compound-title",
				maxlength: "200",
				required: "",
				disabled: e.disabled
			}, null, 8, Co), [[$, e.step.title]])]),
			X("label", null, [X("span", null, P(e.t("compound.stepQuestion")), 1), W(X("textarea", {
				"onUpdate:modelValue": n[3] ||= (t) => e.step.question = t,
				class: "compound-question",
				maxlength: "2000",
				required: "",
				disabled: e.disabled
			}, null, 8, wo), [[$, e.step.question]])]),
			X("div", To, [e.step.type === "multiple-choice" ? (J(), Y("label", Eo, [X("span", null, P(e.t("compound.answers")), 1), X("textarea", {
				class: "compound-answers",
				value: i.value,
				disabled: e.disabled,
				onInput: n[4] ||= (e) => d("answers", e.target.value)
			}, null, 40, Do)])) : e.step.type === "true-false" ? (J(), Y("label", Oo, [X("span", null, P(e.t("correctAnswer")), 1), W(X("select", {
				"onUpdate:modelValue": n[5] ||= (t) => e.step.correct = t,
				class: "compound-correct",
				disabled: e.disabled
			}, [X("option", Ao, P(e.t("true")), 1), X("option", jo, P(e.t("false")), 1)], 8, ko), [[Wa, e.step.correct]])])) : [
				"fill-blanks",
				"drag-text",
				"mark-words"
			].includes(e.step.type) ? (J(), Y("label", Mo, [X("span", null, P(e.t("compound.text")), 1), W(X("textarea", {
				"onUpdate:modelValue": n[6] ||= (t) => e.step.text = t,
				class: "compound-text",
				disabled: e.disabled
			}, null, 8, No), [[$, e.step.text]])])) : e.step.type === "matching" ? (J(), Y("label", Po, [X("span", null, P(e.t("compound.pairs")), 1), X("textarea", {
				class: "compound-pairs",
				value: a.value,
				disabled: e.disabled,
				onInput: n[7] ||= (e) => d("pairs", e.target.value)
			}, null, 40, Fo)])) : (J(), Y(q, { key: 4 }, [X("label", null, [X("span", null, P(e.t("compound.categories")), 1), X("input", {
				class: "compound-categories",
				value: o.value,
				disabled: e.disabled,
				onInput: n[8] ||= (e) => d("categories", e.target.value)
			}, null, 40, Io)]), X("label", null, [X("span", null, P(e.t("compound.items")), 1), X("textarea", {
				class: "compound-items",
				value: s.value,
				disabled: e.disabled,
				onInput: n[9] ||= (e) => d("items", e.target.value)
			}, null, 40, Lo)])], 64))])
		]));
	}
}, zo = {
	key: 0,
	id: "answersField"
}, Bo = { id: "answers" }, Vo = ["onUpdate:modelValue", "aria-label"], Ho = { class: "correct" }, Uo = ["checked", "onChange"], Wo = ["aria-label", "onClick"], Go = ["disabled"], Ko = {
	key: 1,
	id: "truthField"
}, qo = { class: "choice" }, Jo = { class: "choice" }, Yo = {
	key: 2,
	id: "memoryField"
}, Xo = { id: "cards" }, Zo = ["onUpdate:modelValue", "aria-label"], Qo = { class: "match-image-label" }, $o = ["onChange"], es = ["src"], ts = ["aria-label", "onClick"], ns = ["disabled"], rs = {
	key: 3,
	id: "matchingField"
}, is = { id: "matches" }, as = ["onUpdate:modelValue", "aria-label"], os = { class: "match-image-label" }, ss = ["data-side", "onChange"], cs = ["src"], ls = ["aria-label", "onClick"], us = ["disabled"], ds = { id: "categories" }, fs = [
	"onUpdate:modelValue",
	"readonly",
	"aria-label"
], ps = ["aria-label", "onClick"], ms = ["disabled"], hs = { id: "classifyItems" }, gs = ["onUpdate:modelValue", "aria-label"], _s = { class: "match-image-label" }, vs = ["onChange"], ys = ["src"], bs = ["onUpdate:modelValue", "aria-label"], xs = ["value"], Ss = ["aria-label", "onClick"], Cs = ["disabled"], ws = ["id"], Ts = ["id"], Es = {
	key: 6,
	id: "findWordsField"
}, Ds = { id: "findWords" }, Os = ["onUpdate:modelValue", "aria-label"], ks = ["aria-label", "onClick"], As = ["disabled"], js = {
	key: 7,
	id: "dialogCardsField"
}, Ms = { id: "dialogCards" }, Ns = ["onUpdate:modelValue", "aria-label"], Ps = ["onUpdate:modelValue", "aria-label"], Fs = ["aria-label", "onClick"], Is = ["disabled"], Ls = {
	key: 8,
	id: "crosswordField"
}, Rs = { id: "crosswordWords" }, zs = ["onUpdate:modelValue", "aria-label"], Bs = ["onUpdate:modelValue", "aria-label"], Vs = ["aria-label", "onClick"], Hs = ["disabled"], Us = {
	key: 9,
	id: "compoundField"
}, Ws = { id: "compoundSteps" }, Gs = ["disabled"], Ks = ["disabled"], qs = { class: "choice" }, Js = {
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
				let e = await po(o);
				a.get(t)?.get(n) === s && (t[n] = e);
			} catch {
				a.get(t)?.get(n) === s && r("image-error");
			} finally {
				e.target.value = "", r("image-busy", -1);
			}
		}
		return (t, n) => e.form.type === "multiple-choice" ? (J(), Y("fieldset", zo, [
			X("legend", null, P(e.t("answers")), 1),
			X("div", Bo, [(J(!0), Y(q, null, G(e.form.answers, (t, r) => (J(), Y("div", {
				key: r,
				class: "answer-row"
			}, [
				W(X("input", {
					"onUpdate:modelValue": (e) => t.text = e,
					class: "answer-text",
					maxlength: "500",
					"aria-label": e.t("answers")
				}, null, 8, Vo), [[$, t.text]]),
				X("label", Ho, [X("input", {
					class: "answer-correct",
					type: "radio",
					name: "correct",
					checked: t.correct,
					onChange: (t) => e.form.answers.forEach((e, t) => e.correct = t === r)
				}, null, 40, Uo), n[15] ||= X("span", null, "✓", -1)]),
				X("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.answers.splice(r, 1)
				}, "×", 8, Wo)
			]))), 128))]),
			X("button", {
				id: "addAnswer",
				type: "button",
				class: "button secondary",
				disabled: e.form.answers.length >= 8,
				onClick: n[0] ||= (t) => e.form.answers.push({
					text: "",
					correct: !1
				})
			}, P(e.t("addAnswer")), 9, Go)
		])) : e.form.type === "true-false" ? (J(), Y("fieldset", Ko, [
			X("legend", null, P(e.t("correctAnswer")), 1),
			X("label", qo, [W(X("input", {
				id: "correctTrue",
				"onUpdate:modelValue": n[1] ||= (t) => e.form.correct = t,
				type: "radio",
				name: "truth",
				value: !0
			}, null, 512), [[Ua, e.form.correct]]), X("span", null, P(e.t("true")), 1)]),
			X("label", Jo, [W(X("input", {
				id: "correctFalse",
				"onUpdate:modelValue": n[2] ||= (t) => e.form.correct = t,
				type: "radio",
				name: "truth",
				value: !1
			}, null, 512), [[Ua, e.form.correct]]), X("span", null, P(e.t("false")), 1)])
		])) : e.form.type === "memory" ? (J(), Y("fieldset", Yo, [
			X("legend", null, P(e.t("pairs")), 1),
			X("div", Xo, [(J(!0), Y(q, null, G(e.form.cards, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row memory-row"
			}, [X("div", null, [
				W(X("input", {
					"onUpdate:modelValue": (e) => t.text = e,
					class: "card-text",
					maxlength: "120",
					"aria-label": e.t("pair")
				}, null, 8, Zo), [[$, t.text]]),
				X("label", Qo, [bi(P(e.t("imageLeft")), 1), X("input", {
					class: "memory-image",
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					onChange: (e) => s(e, t)
				}, null, 40, $o)]),
				t.image ? (J(), Y("img", {
					key: 0,
					src: t.image,
					class: "editor-thumbnail",
					alt: ""
				}, null, 8, es)) : Q("", !0)
			]), X("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.cards.splice(n, 1)
			}, "×", 8, ts)]))), 128))]),
			X("button", {
				id: "addCard",
				type: "button",
				class: "button secondary",
				disabled: e.form.cards.length >= 12,
				onClick: n[3] ||= (t) => e.form.cards.push({
					text: "",
					image: ""
				})
			}, P(e.t("addPair")), 9, ns)
		])) : e.form.type === "matching" ? (J(), Y("fieldset", rs, [
			X("legend", null, P(e.t("relations")), 1),
			X("div", is, [(J(!0), Y(q, null, G(e.form.pairs, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row matching-row"
			}, [(J(), Y(q, null, G(["left", "right"], (n) => X("div", { key: n }, [
				W(X("input", {
					"onUpdate:modelValue": (e) => t[n] = e,
					class: ye("match-" + n),
					maxlength: "120",
					"aria-label": e.t(n)
				}, null, 10, as), [[$, t[n]]]),
				X("label", os, [bi(P(e.t(n === "left" ? "imageLeft" : "imageRight")), 1), X("input", {
					class: "match-image",
					"data-side": n,
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					onChange: (e) => s(e, t, n + "Image")
				}, null, 40, ss)]),
				t[n + "Image"] ? (J(), Y("img", {
					key: 0,
					src: t[n + "Image"],
					class: "editor-thumbnail",
					alt: ""
				}, null, 8, cs)) : Q("", !0)
			])), 64)), X("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.pairs.splice(n, 1)
			}, "×", 8, ls)]))), 128))]),
			X("button", {
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
			}, P(e.t("addRelation")), 9, us)
		])) : ["classify", "ordering"].includes(e.form.type) ? (J(), Y("fieldset", {
			key: 4,
			id: "classifyField",
			class: ye({ "ordering-mode": e.form.type === "ordering" })
		}, [
			X("legend", null, P(e.t(e.form.type === "ordering" ? "positions" : "categories")), 1),
			X("div", ds, [(J(!0), Y(q, null, G(e.form.categories, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row"
			}, [W(X("input", {
				"onUpdate:modelValue": (e) => t.name = e,
				class: "category-name",
				maxlength: "120",
				readonly: e.form.type === "ordering",
				"aria-label": e.t("category")
			}, null, 8, fs), [[$, t.name]]), X("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (e) => o(n)
			}, "×", 8, ps)]))), 128))]),
			X("button", {
				id: "addCategory",
				type: "button",
				class: "button secondary",
				disabled: e.form.categories.length >= 12,
				onClick: n[5] ||= (t) => e.form.categories.push({ name: e.form.type === "ordering" ? String(e.form.categories.length + 1) : "" })
			}, P(e.t(e.form.type === "ordering" ? "addPosition" : "addCategory")), 9, ms),
			X("legend", null, P(e.t(e.form.type === "ordering" ? "steps" : "items")), 1),
			X("div", hs, [(J(!0), Y(q, null, G(e.form.items, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row classify-row"
			}, [
				X("div", null, [
					W(X("input", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "classify-text",
						maxlength: "120",
						"aria-label": e.t("item")
					}, null, 8, gs), [[$, t.text]]),
					X("label", _s, [bi(P(e.t("imageLeft")), 1), X("input", {
						class: "classify-image",
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						onChange: (e) => s(e, t)
					}, null, 40, vs)]),
					t.image ? (J(), Y("img", {
						key: 0,
						src: t.image,
						class: "editor-thumbnail",
						alt: ""
					}, null, 8, ys)) : Q("", !0)
				]),
				W(X("select", {
					"onUpdate:modelValue": (e) => t.category = e,
					class: "classify-category",
					"aria-label": e.t("category")
				}, [(J(!0), Y(q, null, G(e.form.categories, (t, n) => (J(), Y("option", {
					key: n,
					value: n
				}, P(t.name || e.t("category") + " " + (n + 1)), 9, xs))), 128))], 8, bs), [[
					Wa,
					t.category,
					void 0,
					{ number: !0 }
				]]),
				X("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.items.splice(n, 1)
				}, "×", 8, Ss)
			]))), 128))]),
			X("button", {
				id: "addClassifyItem",
				type: "button",
				class: "button secondary",
				disabled: e.form.items.length >= 12,
				onClick: n[6] ||= (t) => e.form.items.push({
					text: "",
					category: 0,
					image: ""
				})
			}, P(e.t(e.form.type === "ordering" ? "addStep" : "addItem")), 9, Cs)
		], 2)) : [
			"fill-blanks",
			"drag-text",
			"mark-words"
		].includes(e.form.type) ? (J(), Y("fieldset", {
			key: 5,
			id: {
				"fill-blanks": "fillBlanks",
				"drag-text": "dragText",
				"mark-words": "markWords"
			}[e.form.type] + "Field"
		}, [
			X("legend", null, P(e.t(e.form.type === "fill-blanks" ? "fillText" : e.form.type === "drag-text" ? "dragTextText" : "markWordsText")), 1),
			W(X("textarea", {
				id: {
					"fill-blanks": "fillBlanks",
					"drag-text": "dragText",
					"mark-words": "markWords"
				}[e.form.type] + "Text",
				"onUpdate:modelValue": n[7] ||= (t) => e.form.text = t,
				maxlength: "5000"
			}, null, 8, Ts), [[$, e.form.text]]),
			X("small", null, P(e.t("fillHint")), 1)
		], 8, ws)) : e.form.type === "find-words" ? (J(), Y("fieldset", Es, [
			X("legend", null, P(e.t("findWordsList")), 1),
			X("div", Ds, [(J(!0), Y(q, null, G(e.form.words, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row"
			}, [W(X("input", {
				"onUpdate:modelValue": (t) => e.form.words[n] = t,
				class: "find-word",
				maxlength: "15",
				"aria-label": e.t("findWordsPlaceholder")
			}, null, 8, Os), [[$, e.form.words[n]]]), X("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.words.splice(n, 1)
			}, "×", 8, ks)]))), 128))]),
			X("button", {
				id: "addFindWord",
				type: "button",
				class: "button secondary",
				disabled: e.form.words.length >= 12,
				onClick: n[8] ||= (t) => e.form.words.push("")
			}, P(e.t("addWord")), 9, As)
		])) : e.form.type === "dialog-cards" ? (J(), Y("fieldset", js, [
			X("legend", null, P(e.t("dialogCardsList")), 1),
			X("div", Ms, [(J(!0), Y(q, null, G(e.form.cards, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row"
			}, [
				W(X("input", {
					"onUpdate:modelValue": (e) => t.front = e,
					class: "dialog-front",
					maxlength: "500",
					"aria-label": e.t("dialogFront")
				}, null, 8, Ns), [[$, t.front]]),
				W(X("input", {
					"onUpdate:modelValue": (e) => t.back = e,
					class: "dialog-back",
					maxlength: "500",
					"aria-label": e.t("dialogBack")
				}, null, 8, Ps), [[$, t.back]]),
				X("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.cards.splice(n, 1)
				}, "×", 8, Fs)
			]))), 128))]),
			X("button", {
				id: "addDialogCard",
				type: "button",
				class: "button secondary",
				disabled: e.form.cards.length >= 15,
				onClick: n[9] ||= (t) => e.form.cards.push({
					front: "",
					back: ""
				})
			}, P(e.t("addDialogCard")), 9, Is)
		])) : e.form.type === "crossword" ? (J(), Y("fieldset", Ls, [
			X("legend", null, P(e.t("crosswordList")), 1),
			X("div", Rs, [(J(!0), Y(q, null, G(e.form.words, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row"
			}, [
				W(X("input", {
					"onUpdate:modelValue": (e) => t.answer = e,
					class: "crossword-answer",
					maxlength: "20",
					"aria-label": e.t("crosswordAnswer")
				}, null, 8, zs), [[$, t.answer]]),
				W(X("input", {
					"onUpdate:modelValue": (e) => t.clue = e,
					class: "crossword-clue",
					maxlength: "300",
					"aria-label": e.t("crosswordClue")
				}, null, 8, Bs), [[$, t.clue]]),
				X("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.words.splice(n, 1)
				}, "×", 8, Vs)
			]))), 128))]),
			X("button", {
				id: "addCrosswordWord",
				type: "button",
				class: "button secondary",
				disabled: e.form.words.length >= 10,
				onClick: n[10] ||= (t) => e.form.words.push({
					answer: "",
					clue: ""
				})
			}, P(e.t("addCrosswordWord")), 9, Hs)
		])) : e.form.type === "compound" ? (J(), Y("fieldset", Us, [
			X("legend", null, P(e.t("compound.steps")), 1),
			X("div", Ws, [(J(!0), Y(q, null, G(e.form.activities, (t, n) => (J(), fi(Ro, {
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
			X("button", {
				id: "addCompoundStep",
				type: "button",
				class: "button secondary",
				disabled: e.form.activities.length >= 10,
				onClick: n[11] ||= (t) => e.form.activities.push(V(co)())
			}, P(e.t("compound.add")), 9, Gs),
			X("button", {
				id: "addCompoundFromBank",
				type: "button",
				class: "button secondary",
				disabled: e.form.activities.length >= 10,
				onClick: n[12] ||= (e) => r("bank")
			}, P(e.t("bank.add")), 9, Ks),
			X("label", null, [X("span", null, P(e.t("compound.pass")), 1), W(X("input", {
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
			X("label", qs, [W(X("input", {
				id: "compoundRandom",
				"onUpdate:modelValue": n[14] ||= (t) => e.form.randomQuestions = t,
				type: "checkbox"
			}, null, 512), [[Va, e.form.randomQuestions]]), X("span", null, P(e.t("compound.random")), 1)])
		])) : Q("", !0);
	}
}, Ys = {
	key: 0,
	role: "alert"
}, Xs = {
	__name: "H5PPlayer",
	props: {
		base: String,
		activity: Object,
		onStatement: Function
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(), r = /* @__PURE__ */ B(!1), i = 0, a = () => {};
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
		return zn(() => t.activity?.id, async (e) => {
			let s = ++i;
			if (a(), r.value = !1, await xn(), e && n.value) {
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
		}, { immediate: !0 }), ir(() => {
			++i, a();
		}), (e, t) => (J(), Y(q, null, [X("div", {
			id: "player",
			ref_key: "container",
			ref: n
		}, null, 512), r.value ? (J(), Y("p", Ys, [or(e.$slots, "default")])) : Q("", !0)], 64));
	}
}, Zs = {
	id: "playReviews",
	class: "panel"
}, Qs = { class: "section-heading" }, $s = ["disabled"], ec = {
	key: 0,
	role: "alert",
	class: "error"
}, tc = {
	key: 1,
	id: "reviewMessage",
	role: "status"
}, nc = {
	key: 2,
	role: "status"
}, rc = { key: 3 }, ic = {
	id: "playReviewList",
	class: "library-grid"
}, ac = [
	"data-review-id",
	"disabled",
	"onClick"
], oc = { class: "actions" }, sc = ["disabled"], cc = ["disabled"], lc = {
	key: 4,
	id: "playReviewDetail"
}, uc = ["disabled"], dc = { class: "actions" }, fc = ["disabled"], pc = ["disabled"], mc = ["disabled"], hc = {
	__name: "ReviewPanel",
	props: {
		base: String,
		t: Function
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B([]), r = /* @__PURE__ */ B(null), i = /* @__PURE__ */ B(!1), a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(""), c = /* @__PURE__ */ B(0), l = /* @__PURE__ */ B(!1), u = 0, d = !0;
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
		return rr(() => {
			p(), window.addEventListener("pagehide", g), window.addEventListener("pageshow", _);
		}), ir(() => {
			g(), window.removeEventListener("pagehide", g), window.removeEventListener("pageshow", _);
		}), (t, u) => (J(), Y("section", Zs, [
			X("div", Qs, [X("h1", null, P(e.t("reviewsTitle")), 1), X("button", {
				id: "refreshReviews",
				class: "button secondary",
				disabled: i.value,
				onClick: u[0] ||= (e) => p()
			}, P(e.t("refresh")), 9, $s)]),
			a.value ? (J(), Y("p", ec, P(e.t(a.value)), 1)) : Q("", !0),
			o.value ? (J(), Y("p", tc, P(e.t(o.value)), 1)) : Q("", !0),
			i.value ? (J(), Y("p", nc, P(e.t("libraryLoading")), 1)) : Q("", !0),
			!i.value && !n.value.length ? (J(), Y("p", rc, P(e.t("reviewsEmpty")), 1)) : Q("", !0),
			X("div", ic, [(J(!0), Y(q, null, G(n.value, (t) => (J(), Y("article", {
				key: t.id,
				class: "library-card"
			}, [
				X("h2", null, P(t.title), 1),
				X("p", null, P(t.class_name) + " · " + P(e.t("reviewStatus." + t.status)), 1),
				X("button", {
					class: "button",
					"data-review-id": t.id,
					disabled: i.value,
					onClick: (e) => m(t.id)
				}, P(e.t("reviewOpen")), 9, ac)
			]))), 128))]),
			X("div", oc, [X("button", {
				id: "reviewsPrev",
				class: "button secondary",
				disabled: i.value || c.value === 0,
				onClick: u[1] ||= (e) => p(Math.max(0, c.value - 25))
			}, P(e.t("libraryPrev")), 9, sc), X("button", {
				id: "reviewsNext",
				class: "button secondary",
				disabled: i.value || !l.value,
				onClick: u[2] ||= (e) => p(c.value + 25)
			}, P(e.t("libraryNext")), 9, cc)]),
			r.value ? (J(), Y("section", lc, [
				X("h2", null, P(r.value.title), 1),
				X("p", null, P(e.t("reviewStatus." + r.value.status)), 1),
				Z(Xs, {
					base: e.base,
					activity: r.value.activity
				}, {
					default: Pn(() => [bi(P(e.t("playerError")), 1)]),
					_: 1
				}, 8, ["base", "activity"]),
				X("label", null, [bi(P(e.t("reviewFeedback")), 1), W(X("textarea", {
					id: "reviewFeedback",
					"onUpdate:modelValue": u[3] ||= (e) => s.value = e,
					maxlength: "2000",
					disabled: i.value
				}, null, 8, uc), [[$, s.value]])]),
				X("div", dc, [
					r.value.status === "pending" ? (J(), Y("button", {
						key: 0,
						id: "approvePlay",
						class: "button",
						disabled: i.value,
						onClick: u[4] ||= (e) => h("approve")
					}, P(e.t("reviewApprove")), 9, fc)) : Q("", !0),
					r.value.status === "pending" ? (J(), Y("button", {
						key: 1,
						id: "returnPlay",
						class: "button secondary",
						disabled: i.value,
						onClick: u[5] ||= (e) => h("return")
					}, P(e.t("reviewReturn")), 9, pc)) : Q("", !0),
					r.value.status === "approved" ? (J(), Y("button", {
						key: 2,
						id: "withdrawPlay",
						class: "button secondary",
						disabled: i.value,
						onClick: u[6] ||= (e) => h("withdraw")
					}, P(e.t("unpublishRecursos")), 9, mc)) : Q("", !0)
				])
			])) : Q("", !0)
		]));
	}
}, gc = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	var n = function() {
		var e = function(e, t) {
			var r = e, a = n[t], p = null, m = 0, h = null, g = [], v = {}, y = function(e, t) {
				m = r * 4 + 17, p = function(e) {
					for (var t = Array(e), n = 0; n < e; n += 1) {
						t[n] = Array(e);
						for (var r = 0; r < e; r += 1) t[n][r] = null;
					}
					return t;
				}(m), b(0, 0), b(m - 7, 0), b(0, m - 7), C(), S(), T(e, t), r >= 7 && w(e), h ??= ee(r, a, g), E(h, t);
			}, b = function(e, t) {
				for (var n = -1; n <= 7; n += 1) if (!(e + n <= -1 || m <= e + n)) for (var r = -1; r <= 7; r += 1) t + r <= -1 || m <= t + r || (0 <= n && n <= 6 && (r == 0 || r == 6) || 0 <= r && r <= 6 && (n == 0 || n == 6) || 2 <= n && n <= 4 && 2 <= r && r <= 4 ? p[e + n][t + r] = !0 : p[e + n][t + r] = !1);
			}, x = function() {
				for (var e = 0, t = 0, n = 0; n < 8; n += 1) {
					y(!0, n);
					var r = i.getLostPoint(v);
					(n == 0 || e > r) && (e = r, t = n);
				}
				return t;
			}, S = function() {
				for (var e = 8; e < m - 8; e += 1) p[e][6] ?? (p[e][6] = e % 2 == 0);
				for (var t = 8; t < m - 8; t += 1) p[6][t] ?? (p[6][t] = t % 2 == 0);
			}, C = function() {
				for (var e = i.getPatternPosition(r), t = 0; t < e.length; t += 1) for (var n = 0; n < e.length; n += 1) {
					var a = e[t], o = e[n];
					if (p[a][o] == null) for (var s = -2; s <= 2; s += 1) for (var c = -2; c <= 2; c += 1) s == -2 || s == 2 || c == -2 || c == 2 || s == 0 && c == 0 ? p[a + s][o + c] = !0 : p[a + s][o + c] = !1;
				}
			}, w = function(e) {
				for (var t = i.getBCHTypeNumber(r), n = 0; n < 18; n += 1) {
					var a = !e && (t >> n & 1) == 1;
					p[Math.floor(n / 3)][n % 3 + m - 8 - 3] = a;
				}
				for (var n = 0; n < 18; n += 1) {
					var a = !e && (t >> n & 1) == 1;
					p[n % 3 + m - 8 - 3][Math.floor(n / 3)] = a;
				}
			}, T = function(e, t) {
				for (var n = a << 3 | t, r = i.getBCHTypeInfo(n), o = 0; o < 15; o += 1) {
					var s = !e && (r >> o & 1) == 1;
					o < 6 ? p[o][8] = s : o < 8 ? p[o + 1][8] = s : p[m - 15 + o][8] = s;
				}
				for (var o = 0; o < 15; o += 1) {
					var s = !e && (r >> o & 1) == 1;
					o < 8 ? p[8][m - o - 1] = s : o < 9 ? p[8][15 - o - 1 + 1] = s : p[8][15 - o - 1] = s;
				}
				p[m - 8][8] = !e;
			}, E = function(e, t) {
				for (var n = -1, r = m - 1, a = 7, o = 0, s = i.getMaskFunction(t), c = m - 1; c > 0; c -= 2) for (c == 6 && --c;;) {
					for (var l = 0; l < 2; l += 1) if (p[r][c - l] == null) {
						var u = !1;
						o < e.length && (u = (e[o] >>> a & 1) == 1), s(r, c - l) && (u = !u), p[r][c - l] = u, --a, a == -1 && (o += 1, a = 7);
					}
					if (r += n, r < 0 || m <= r) {
						r -= n, n = -n;
						break;
					}
				}
			}, D = function(e, t) {
				for (var n = 0, r = 0, a = 0, s = Array(t.length), c = Array(t.length), l = 0; l < t.length; l += 1) {
					var u = t[l].dataCount, d = t[l].totalCount - u;
					r = Math.max(r, u), a = Math.max(a, d), s[l] = Array(u);
					for (var f = 0; f < s[l].length; f += 1) s[l][f] = 255 & e.getBuffer()[f + n];
					n += u;
					var p = i.getErrorCorrectPolynomial(d), m = o(s[l], p.getLength() - 1).mod(p);
					c[l] = Array(p.getLength() - 1);
					for (var f = 0; f < c[l].length; f += 1) {
						var h = f + m.getLength() - c[l].length;
						c[l][f] = h >= 0 ? m.getAt(h) : 0;
					}
				}
				for (var g = 0, f = 0; f < t.length; f += 1) g += t[f].totalCount;
				for (var _ = Array(g), v = 0, f = 0; f < r; f += 1) for (var l = 0; l < t.length; l += 1) f < s[l].length && (_[v] = s[l][f], v += 1);
				for (var f = 0; f < a; f += 1) for (var l = 0; l < t.length; l += 1) f < c[l].length && (_[v] = c[l][f], v += 1);
				return _;
			}, ee = function(e, t, n) {
				for (var r = s.getRSBlocks(e, t), a = c(), o = 0; o < n.length; o += 1) {
					var l = n[o];
					a.put(l.getMode(), 4), a.put(l.getLength(), i.getLengthInBits(l.getMode(), e)), l.write(a);
				}
				for (var u = 0, o = 0; o < r.length; o += 1) u += r[o].dataCount;
				if (a.getLengthInBits() > u * 8) throw "code length overflow. (" + a.getLengthInBits() + ">" + u * 8 + ")";
				for (a.getLengthInBits() + 4 <= u * 8 && a.put(0, 4); a.getLengthInBits() % 8 != 0;) a.putBit(!1);
				for (; !(a.getLengthInBits() >= u * 8 || (a.put(236, 8), a.getLengthInBits() >= u * 8));) a.put(17, 8);
				return D(a, r);
			};
			v.addData = function(e, t) {
				t ||= "Byte";
				var n = null;
				switch (t) {
					case "Numeric":
						n = l(e);
						break;
					case "Alphanumeric":
						n = u(e);
						break;
					case "Byte":
						n = d(e);
						break;
					case "Kanji":
						n = f(e);
						break;
					default: throw "mode:" + t;
				}
				g.push(n), h = null;
			}, v.isDark = function(e, t) {
				if (e < 0 || m <= e || t < 0 || m <= t) throw e + "," + t;
				return p[e][t];
			}, v.getModuleCount = function() {
				return m;
			}, v.make = function() {
				if (r < 1) {
					for (var e = 1; e < 40; e++) {
						for (var t = s.getRSBlocks(e, a), n = c(), o = 0; o < g.length; o++) {
							var l = g[o];
							n.put(l.getMode(), 4), n.put(l.getLength(), i.getLengthInBits(l.getMode(), e)), l.write(n);
						}
						for (var u = 0, o = 0; o < t.length; o++) u += t[o].dataCount;
						if (n.getLengthInBits() <= u * 8) break;
					}
					r = e;
				}
				y(!1, x());
			}, v.createTableTag = function(e, t) {
				e ||= 2, t = t === void 0 ? e * 4 : t;
				var n = "";
				n += "<table style=\"", n += " border-width: 0px; border-style: none;", n += " border-collapse: collapse;", n += " padding: 0px; margin: " + t + "px;", n += "\">", n += "<tbody>";
				for (var r = 0; r < v.getModuleCount(); r += 1) {
					n += "<tr>";
					for (var i = 0; i < v.getModuleCount(); i += 1) n += "<td style=\"", n += " border-width: 0px; border-style: none;", n += " border-collapse: collapse;", n += " padding: 0px; margin: 0px;", n += " width: " + e + "px;", n += " height: " + e + "px;", n += " background-color: ", n += v.isDark(r, i) ? "#000000" : "#ffffff", n += ";", n += "\"/>";
					n += "</tr>";
				}
				return n += "</tbody>", n += "</table>", n;
			}, v.createSvgTag = function(e, t, n, r) {
				var i = {};
				typeof arguments[0] == "object" && (i = arguments[0], e = i.cellSize, t = i.margin, n = i.alt, r = i.title), e ||= 2, t = t === void 0 ? e * 4 : t, n = typeof n == "string" ? { text: n } : n || {}, n.text = n.text || null, n.id = n.text ? n.id || "qrcode-description" : null, r = typeof r == "string" ? { text: r } : r || {}, r.text = r.text || null, r.id = r.text ? r.id || "qrcode-title" : null;
				var a = v.getModuleCount() * e + t * 2, o, s, c, l, u = "", d = "l" + e + ",0 0," + e + " -" + e + ",0 0,-" + e + "z ";
				for (u += "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"", u += i.scalable ? "" : " width=\"" + a + "px\" height=\"" + a + "px\"", u += " viewBox=\"0 0 " + a + " " + a + "\" ", u += " preserveAspectRatio=\"xMinYMin meet\"", u += r.text || n.text ? " role=\"img\" aria-labelledby=\"" + O([r.id, n.id].join(" ").trim()) + "\"" : "", u += ">", u += r.text ? "<title id=\"" + O(r.id) + "\">" + O(r.text) + "</title>" : "", u += n.text ? "<description id=\"" + O(n.id) + "\">" + O(n.text) + "</description>" : "", u += "<rect width=\"100%\" height=\"100%\" fill=\"white\" cx=\"0\" cy=\"0\"/>", u += "<path d=\"", c = 0; c < v.getModuleCount(); c += 1) for (l = c * e + t, o = 0; o < v.getModuleCount(); o += 1) v.isDark(c, o) && (s = o * e + t, u += "M" + s + "," + l + d);
				return u += "\" stroke=\"transparent\" fill=\"black\"/>", u += "</svg>", u;
			}, v.createDataURL = function(e, t) {
				e ||= 2, t = t === void 0 ? e * 4 : t;
				var n = v.getModuleCount() * e + t * 2, r = t, i = n - t;
				return _(n, n, function(t, n) {
					if (r <= t && t < i && r <= n && n < i) {
						var a = Math.floor((t - r) / e), o = Math.floor((n - r) / e);
						return +!v.isDark(o, a);
					}
					return 1;
				});
			}, v.createImgTag = function(e, t, n) {
				e ||= 2, t = t === void 0 ? e * 4 : t;
				var r = v.getModuleCount() * e + t * 2, i = "";
				return i += "<img", i += " src=\"", i += v.createDataURL(e, t), i += "\"", i += " width=\"", i += r, i += "\"", i += " height=\"", i += r, i += "\"", n && (i += " alt=\"", i += O(n), i += "\""), i += "/>", i;
			};
			var O = function(e) {
				for (var t = "", n = 0; n < e.length; n += 1) {
					var r = e.charAt(n);
					switch (r) {
						case "<":
							t += "&lt;";
							break;
						case ">":
							t += "&gt;";
							break;
						case "&":
							t += "&amp;";
							break;
						case "\"":
							t += "&quot;";
							break;
						default: t += r;
					}
				}
				return t;
			}, k = function(e) {
				var t = 1;
				e = e === void 0 ? t * 2 : e;
				var n = v.getModuleCount() * t + e * 2, r = e, i = n - e, a, o, s, c, l, u = {
					"██": "█",
					"█ ": "▀",
					" █": "▄",
					"  ": " "
				}, d = {
					"██": "▀",
					"█ ": "▀",
					" █": " ",
					"  ": " "
				}, f = "";
				for (a = 0; a < n; a += 2) {
					for (s = Math.floor((a - r) / t), c = Math.floor((a + 1 - r) / t), o = 0; o < n; o += 1) l = "█", r <= o && o < i && r <= a && a < i && v.isDark(s, Math.floor((o - r) / t)) && (l = " "), r <= o && o < i && r <= a + 1 && a + 1 < i && v.isDark(c, Math.floor((o - r) / t)) ? l += " " : l += "█", f += e < 1 && a + 1 >= i ? d[l] : u[l];
					f += "\n";
				}
				return n % 2 && e > 0 ? f.substring(0, f.length - n - 1) + Array(n + 1).join("▀") : f.substring(0, f.length - 1);
			};
			return v.createASCII = function(e, t) {
				if (e ||= 1, e < 2) return k(t);
				--e, t = t === void 0 ? e * 2 : t;
				var n = v.getModuleCount() * e + t * 2, r = t, i = n - t, a, o, s, c, l = Array(e + 1).join("██"), u = Array(e + 1).join("  "), d = "", f = "";
				for (a = 0; a < n; a += 1) {
					for (s = Math.floor((a - r) / e), f = "", o = 0; o < n; o += 1) c = 1, r <= o && o < i && r <= a && a < i && v.isDark(s, Math.floor((o - r) / e)) && (c = 0), f += c ? l : u;
					for (s = 0; s < e; s += 1) d += f + "\n";
				}
				return d.substring(0, d.length - 1);
			}, v.renderTo2dContext = function(e, t) {
				t ||= 2;
				for (var n = v.getModuleCount(), r = 0; r < n; r++) for (var i = 0; i < n; i++) e.fillStyle = v.isDark(r, i) ? "black" : "white", e.fillRect(r * t, i * t, t, t);
			}, v;
		};
		e.stringToBytesFuncs = { default: function(e) {
			for (var t = [], n = 0; n < e.length; n += 1) {
				var r = e.charCodeAt(n);
				t.push(r & 255);
			}
			return t;
		} }, e.stringToBytes = e.stringToBytesFuncs.default, e.createStringToBytes = function(e, t) {
			var n = function() {
				for (var n = h(e), r = function() {
					var e = n.read();
					if (e == -1) throw "eof";
					return e;
				}, i = 0, a = {};;) {
					var o = n.read();
					if (o == -1) break;
					var s = r(), c = r(), l = r(), u = String.fromCharCode(o << 8 | s);
					a[u] = c << 8 | l, i += 1;
				}
				if (i != t) throw i + " != " + t;
				return a;
			}(), r = 63;
			return function(e) {
				for (var t = [], i = 0; i < e.length; i += 1) {
					var a = e.charCodeAt(i);
					if (a < 128) t.push(a);
					else {
						var o = n[e.charAt(i)];
						typeof o == "number" ? (o & 255) == o ? t.push(o) : (t.push(o >>> 8), t.push(o & 255)) : t.push(r);
					}
				}
				return t;
			};
		};
		var t = {
			MODE_NUMBER: 1,
			MODE_ALPHA_NUM: 2,
			MODE_8BIT_BYTE: 4,
			MODE_KANJI: 8
		}, n = {
			L: 1,
			M: 0,
			Q: 3,
			H: 2
		}, r = {
			PATTERN000: 0,
			PATTERN001: 1,
			PATTERN010: 2,
			PATTERN011: 3,
			PATTERN100: 4,
			PATTERN101: 5,
			PATTERN110: 6,
			PATTERN111: 7
		}, i = function() {
			var e = [
				[],
				[6, 18],
				[6, 22],
				[6, 26],
				[6, 30],
				[6, 34],
				[
					6,
					22,
					38
				],
				[
					6,
					24,
					42
				],
				[
					6,
					26,
					46
				],
				[
					6,
					28,
					50
				],
				[
					6,
					30,
					54
				],
				[
					6,
					32,
					58
				],
				[
					6,
					34,
					62
				],
				[
					6,
					26,
					46,
					66
				],
				[
					6,
					26,
					48,
					70
				],
				[
					6,
					26,
					50,
					74
				],
				[
					6,
					30,
					54,
					78
				],
				[
					6,
					30,
					56,
					82
				],
				[
					6,
					30,
					58,
					86
				],
				[
					6,
					34,
					62,
					90
				],
				[
					6,
					28,
					50,
					72,
					94
				],
				[
					6,
					26,
					50,
					74,
					98
				],
				[
					6,
					30,
					54,
					78,
					102
				],
				[
					6,
					28,
					54,
					80,
					106
				],
				[
					6,
					32,
					58,
					84,
					110
				],
				[
					6,
					30,
					58,
					86,
					114
				],
				[
					6,
					34,
					62,
					90,
					118
				],
				[
					6,
					26,
					50,
					74,
					98,
					122
				],
				[
					6,
					30,
					54,
					78,
					102,
					126
				],
				[
					6,
					26,
					52,
					78,
					104,
					130
				],
				[
					6,
					30,
					56,
					82,
					108,
					134
				],
				[
					6,
					34,
					60,
					86,
					112,
					138
				],
				[
					6,
					30,
					58,
					86,
					114,
					142
				],
				[
					6,
					34,
					62,
					90,
					118,
					146
				],
				[
					6,
					30,
					54,
					78,
					102,
					126,
					150
				],
				[
					6,
					24,
					50,
					76,
					102,
					128,
					154
				],
				[
					6,
					28,
					54,
					80,
					106,
					132,
					158
				],
				[
					6,
					32,
					58,
					84,
					110,
					136,
					162
				],
				[
					6,
					26,
					54,
					82,
					110,
					138,
					166
				],
				[
					6,
					30,
					58,
					86,
					114,
					142,
					170
				]
			], n = 1335, i = 7973, s = 21522, c = {}, l = function(e) {
				for (var t = 0; e != 0;) t += 1, e >>>= 1;
				return t;
			};
			return c.getBCHTypeInfo = function(e) {
				for (var t = e << 10; l(t) - l(n) >= 0;) t ^= n << l(t) - l(n);
				return (e << 10 | t) ^ s;
			}, c.getBCHTypeNumber = function(e) {
				for (var t = e << 12; l(t) - l(i) >= 0;) t ^= i << l(t) - l(i);
				return e << 12 | t;
			}, c.getPatternPosition = function(t) {
				return e[t - 1];
			}, c.getMaskFunction = function(e) {
				switch (e) {
					case r.PATTERN000: return function(e, t) {
						return (e + t) % 2 == 0;
					};
					case r.PATTERN001: return function(e, t) {
						return e % 2 == 0;
					};
					case r.PATTERN010: return function(e, t) {
						return t % 3 == 0;
					};
					case r.PATTERN011: return function(e, t) {
						return (e + t) % 3 == 0;
					};
					case r.PATTERN100: return function(e, t) {
						return (Math.floor(e / 2) + Math.floor(t / 3)) % 2 == 0;
					};
					case r.PATTERN101: return function(e, t) {
						return e * t % 2 + e * t % 3 == 0;
					};
					case r.PATTERN110: return function(e, t) {
						return (e * t % 2 + e * t % 3) % 2 == 0;
					};
					case r.PATTERN111: return function(e, t) {
						return (e * t % 3 + (e + t) % 2) % 2 == 0;
					};
					default: throw "bad maskPattern:" + e;
				}
			}, c.getErrorCorrectPolynomial = function(e) {
				for (var t = o([1], 0), n = 0; n < e; n += 1) t = t.multiply(o([1, a.gexp(n)], 0));
				return t;
			}, c.getLengthInBits = function(e, n) {
				if (1 <= n && n < 10) switch (e) {
					case t.MODE_NUMBER: return 10;
					case t.MODE_ALPHA_NUM: return 9;
					case t.MODE_8BIT_BYTE: return 8;
					case t.MODE_KANJI: return 8;
					default: throw "mode:" + e;
				}
				else if (n < 27) switch (e) {
					case t.MODE_NUMBER: return 12;
					case t.MODE_ALPHA_NUM: return 11;
					case t.MODE_8BIT_BYTE: return 16;
					case t.MODE_KANJI: return 10;
					default: throw "mode:" + e;
				}
				else if (n < 41) switch (e) {
					case t.MODE_NUMBER: return 14;
					case t.MODE_ALPHA_NUM: return 13;
					case t.MODE_8BIT_BYTE: return 16;
					case t.MODE_KANJI: return 12;
					default: throw "mode:" + e;
				}
				else throw "type:" + n;
			}, c.getLostPoint = function(e) {
				for (var t = e.getModuleCount(), n = 0, r = 0; r < t; r += 1) for (var i = 0; i < t; i += 1) {
					for (var a = 0, o = e.isDark(r, i), s = -1; s <= 1; s += 1) if (!(r + s < 0 || t <= r + s)) for (var c = -1; c <= 1; c += 1) i + c < 0 || t <= i + c || (s != 0 || c != 0) && o == e.isDark(r + s, i + c) && (a += 1);
					a > 5 && (n += 3 + a - 5);
				}
				for (var r = 0; r < t - 1; r += 1) for (var i = 0; i < t - 1; i += 1) {
					var l = 0;
					e.isDark(r, i) && (l += 1), e.isDark(r + 1, i) && (l += 1), e.isDark(r, i + 1) && (l += 1), e.isDark(r + 1, i + 1) && (l += 1), (l == 0 || l == 4) && (n += 3);
				}
				for (var r = 0; r < t; r += 1) for (var i = 0; i < t - 6; i += 1) e.isDark(r, i) && !e.isDark(r, i + 1) && e.isDark(r, i + 2) && e.isDark(r, i + 3) && e.isDark(r, i + 4) && !e.isDark(r, i + 5) && e.isDark(r, i + 6) && (n += 40);
				for (var i = 0; i < t; i += 1) for (var r = 0; r < t - 6; r += 1) e.isDark(r, i) && !e.isDark(r + 1, i) && e.isDark(r + 2, i) && e.isDark(r + 3, i) && e.isDark(r + 4, i) && !e.isDark(r + 5, i) && e.isDark(r + 6, i) && (n += 40);
				for (var u = 0, i = 0; i < t; i += 1) for (var r = 0; r < t; r += 1) e.isDark(r, i) && (u += 1);
				var d = Math.abs(100 * u / t / t - 50) / 5;
				return n += d * 10, n;
			}, c;
		}(), a = function() {
			for (var e = Array(256), t = Array(256), n = 0; n < 8; n += 1) e[n] = 1 << n;
			for (var n = 8; n < 256; n += 1) e[n] = e[n - 4] ^ e[n - 5] ^ e[n - 6] ^ e[n - 8];
			for (var n = 0; n < 255; n += 1) t[e[n]] = n;
			var r = {};
			return r.glog = function(e) {
				if (e < 1) throw "glog(" + e + ")";
				return t[e];
			}, r.gexp = function(t) {
				for (; t < 0;) t += 255;
				for (; t >= 256;) t -= 255;
				return e[t];
			}, r;
		}();
		function o(e, t) {
			if (e.length === void 0) throw e.length + "/" + t;
			var n = function() {
				for (var n = 0; n < e.length && e[n] == 0;) n += 1;
				for (var r = Array(e.length - n + t), i = 0; i < e.length - n; i += 1) r[i] = e[i + n];
				return r;
			}(), r = {};
			return r.getAt = function(e) {
				return n[e];
			}, r.getLength = function() {
				return n.length;
			}, r.multiply = function(e) {
				for (var t = Array(r.getLength() + e.getLength() - 1), n = 0; n < r.getLength(); n += 1) for (var i = 0; i < e.getLength(); i += 1) t[n + i] ^= a.gexp(a.glog(r.getAt(n)) + a.glog(e.getAt(i)));
				return o(t, 0);
			}, r.mod = function(e) {
				if (r.getLength() - e.getLength() < 0) return r;
				for (var t = a.glog(r.getAt(0)) - a.glog(e.getAt(0)), n = Array(r.getLength()), i = 0; i < r.getLength(); i += 1) n[i] = r.getAt(i);
				for (var i = 0; i < e.getLength(); i += 1) n[i] ^= a.gexp(a.glog(e.getAt(i)) + t);
				return o(n, 0).mod(e);
			}, r;
		}
		var s = function() {
			var e = [
				[
					1,
					26,
					19
				],
				[
					1,
					26,
					16
				],
				[
					1,
					26,
					13
				],
				[
					1,
					26,
					9
				],
				[
					1,
					44,
					34
				],
				[
					1,
					44,
					28
				],
				[
					1,
					44,
					22
				],
				[
					1,
					44,
					16
				],
				[
					1,
					70,
					55
				],
				[
					1,
					70,
					44
				],
				[
					2,
					35,
					17
				],
				[
					2,
					35,
					13
				],
				[
					1,
					100,
					80
				],
				[
					2,
					50,
					32
				],
				[
					2,
					50,
					24
				],
				[
					4,
					25,
					9
				],
				[
					1,
					134,
					108
				],
				[
					2,
					67,
					43
				],
				[
					2,
					33,
					15,
					2,
					34,
					16
				],
				[
					2,
					33,
					11,
					2,
					34,
					12
				],
				[
					2,
					86,
					68
				],
				[
					4,
					43,
					27
				],
				[
					4,
					43,
					19
				],
				[
					4,
					43,
					15
				],
				[
					2,
					98,
					78
				],
				[
					4,
					49,
					31
				],
				[
					2,
					32,
					14,
					4,
					33,
					15
				],
				[
					4,
					39,
					13,
					1,
					40,
					14
				],
				[
					2,
					121,
					97
				],
				[
					2,
					60,
					38,
					2,
					61,
					39
				],
				[
					4,
					40,
					18,
					2,
					41,
					19
				],
				[
					4,
					40,
					14,
					2,
					41,
					15
				],
				[
					2,
					146,
					116
				],
				[
					3,
					58,
					36,
					2,
					59,
					37
				],
				[
					4,
					36,
					16,
					4,
					37,
					17
				],
				[
					4,
					36,
					12,
					4,
					37,
					13
				],
				[
					2,
					86,
					68,
					2,
					87,
					69
				],
				[
					4,
					69,
					43,
					1,
					70,
					44
				],
				[
					6,
					43,
					19,
					2,
					44,
					20
				],
				[
					6,
					43,
					15,
					2,
					44,
					16
				],
				[
					4,
					101,
					81
				],
				[
					1,
					80,
					50,
					4,
					81,
					51
				],
				[
					4,
					50,
					22,
					4,
					51,
					23
				],
				[
					3,
					36,
					12,
					8,
					37,
					13
				],
				[
					2,
					116,
					92,
					2,
					117,
					93
				],
				[
					6,
					58,
					36,
					2,
					59,
					37
				],
				[
					4,
					46,
					20,
					6,
					47,
					21
				],
				[
					7,
					42,
					14,
					4,
					43,
					15
				],
				[
					4,
					133,
					107
				],
				[
					8,
					59,
					37,
					1,
					60,
					38
				],
				[
					8,
					44,
					20,
					4,
					45,
					21
				],
				[
					12,
					33,
					11,
					4,
					34,
					12
				],
				[
					3,
					145,
					115,
					1,
					146,
					116
				],
				[
					4,
					64,
					40,
					5,
					65,
					41
				],
				[
					11,
					36,
					16,
					5,
					37,
					17
				],
				[
					11,
					36,
					12,
					5,
					37,
					13
				],
				[
					5,
					109,
					87,
					1,
					110,
					88
				],
				[
					5,
					65,
					41,
					5,
					66,
					42
				],
				[
					5,
					54,
					24,
					7,
					55,
					25
				],
				[
					11,
					36,
					12,
					7,
					37,
					13
				],
				[
					5,
					122,
					98,
					1,
					123,
					99
				],
				[
					7,
					73,
					45,
					3,
					74,
					46
				],
				[
					15,
					43,
					19,
					2,
					44,
					20
				],
				[
					3,
					45,
					15,
					13,
					46,
					16
				],
				[
					1,
					135,
					107,
					5,
					136,
					108
				],
				[
					10,
					74,
					46,
					1,
					75,
					47
				],
				[
					1,
					50,
					22,
					15,
					51,
					23
				],
				[
					2,
					42,
					14,
					17,
					43,
					15
				],
				[
					5,
					150,
					120,
					1,
					151,
					121
				],
				[
					9,
					69,
					43,
					4,
					70,
					44
				],
				[
					17,
					50,
					22,
					1,
					51,
					23
				],
				[
					2,
					42,
					14,
					19,
					43,
					15
				],
				[
					3,
					141,
					113,
					4,
					142,
					114
				],
				[
					3,
					70,
					44,
					11,
					71,
					45
				],
				[
					17,
					47,
					21,
					4,
					48,
					22
				],
				[
					9,
					39,
					13,
					16,
					40,
					14
				],
				[
					3,
					135,
					107,
					5,
					136,
					108
				],
				[
					3,
					67,
					41,
					13,
					68,
					42
				],
				[
					15,
					54,
					24,
					5,
					55,
					25
				],
				[
					15,
					43,
					15,
					10,
					44,
					16
				],
				[
					4,
					144,
					116,
					4,
					145,
					117
				],
				[
					17,
					68,
					42
				],
				[
					17,
					50,
					22,
					6,
					51,
					23
				],
				[
					19,
					46,
					16,
					6,
					47,
					17
				],
				[
					2,
					139,
					111,
					7,
					140,
					112
				],
				[
					17,
					74,
					46
				],
				[
					7,
					54,
					24,
					16,
					55,
					25
				],
				[
					34,
					37,
					13
				],
				[
					4,
					151,
					121,
					5,
					152,
					122
				],
				[
					4,
					75,
					47,
					14,
					76,
					48
				],
				[
					11,
					54,
					24,
					14,
					55,
					25
				],
				[
					16,
					45,
					15,
					14,
					46,
					16
				],
				[
					6,
					147,
					117,
					4,
					148,
					118
				],
				[
					6,
					73,
					45,
					14,
					74,
					46
				],
				[
					11,
					54,
					24,
					16,
					55,
					25
				],
				[
					30,
					46,
					16,
					2,
					47,
					17
				],
				[
					8,
					132,
					106,
					4,
					133,
					107
				],
				[
					8,
					75,
					47,
					13,
					76,
					48
				],
				[
					7,
					54,
					24,
					22,
					55,
					25
				],
				[
					22,
					45,
					15,
					13,
					46,
					16
				],
				[
					10,
					142,
					114,
					2,
					143,
					115
				],
				[
					19,
					74,
					46,
					4,
					75,
					47
				],
				[
					28,
					50,
					22,
					6,
					51,
					23
				],
				[
					33,
					46,
					16,
					4,
					47,
					17
				],
				[
					8,
					152,
					122,
					4,
					153,
					123
				],
				[
					22,
					73,
					45,
					3,
					74,
					46
				],
				[
					8,
					53,
					23,
					26,
					54,
					24
				],
				[
					12,
					45,
					15,
					28,
					46,
					16
				],
				[
					3,
					147,
					117,
					10,
					148,
					118
				],
				[
					3,
					73,
					45,
					23,
					74,
					46
				],
				[
					4,
					54,
					24,
					31,
					55,
					25
				],
				[
					11,
					45,
					15,
					31,
					46,
					16
				],
				[
					7,
					146,
					116,
					7,
					147,
					117
				],
				[
					21,
					73,
					45,
					7,
					74,
					46
				],
				[
					1,
					53,
					23,
					37,
					54,
					24
				],
				[
					19,
					45,
					15,
					26,
					46,
					16
				],
				[
					5,
					145,
					115,
					10,
					146,
					116
				],
				[
					19,
					75,
					47,
					10,
					76,
					48
				],
				[
					15,
					54,
					24,
					25,
					55,
					25
				],
				[
					23,
					45,
					15,
					25,
					46,
					16
				],
				[
					13,
					145,
					115,
					3,
					146,
					116
				],
				[
					2,
					74,
					46,
					29,
					75,
					47
				],
				[
					42,
					54,
					24,
					1,
					55,
					25
				],
				[
					23,
					45,
					15,
					28,
					46,
					16
				],
				[
					17,
					145,
					115
				],
				[
					10,
					74,
					46,
					23,
					75,
					47
				],
				[
					10,
					54,
					24,
					35,
					55,
					25
				],
				[
					19,
					45,
					15,
					35,
					46,
					16
				],
				[
					17,
					145,
					115,
					1,
					146,
					116
				],
				[
					14,
					74,
					46,
					21,
					75,
					47
				],
				[
					29,
					54,
					24,
					19,
					55,
					25
				],
				[
					11,
					45,
					15,
					46,
					46,
					16
				],
				[
					13,
					145,
					115,
					6,
					146,
					116
				],
				[
					14,
					74,
					46,
					23,
					75,
					47
				],
				[
					44,
					54,
					24,
					7,
					55,
					25
				],
				[
					59,
					46,
					16,
					1,
					47,
					17
				],
				[
					12,
					151,
					121,
					7,
					152,
					122
				],
				[
					12,
					75,
					47,
					26,
					76,
					48
				],
				[
					39,
					54,
					24,
					14,
					55,
					25
				],
				[
					22,
					45,
					15,
					41,
					46,
					16
				],
				[
					6,
					151,
					121,
					14,
					152,
					122
				],
				[
					6,
					75,
					47,
					34,
					76,
					48
				],
				[
					46,
					54,
					24,
					10,
					55,
					25
				],
				[
					2,
					45,
					15,
					64,
					46,
					16
				],
				[
					17,
					152,
					122,
					4,
					153,
					123
				],
				[
					29,
					74,
					46,
					14,
					75,
					47
				],
				[
					49,
					54,
					24,
					10,
					55,
					25
				],
				[
					24,
					45,
					15,
					46,
					46,
					16
				],
				[
					4,
					152,
					122,
					18,
					153,
					123
				],
				[
					13,
					74,
					46,
					32,
					75,
					47
				],
				[
					48,
					54,
					24,
					14,
					55,
					25
				],
				[
					42,
					45,
					15,
					32,
					46,
					16
				],
				[
					20,
					147,
					117,
					4,
					148,
					118
				],
				[
					40,
					75,
					47,
					7,
					76,
					48
				],
				[
					43,
					54,
					24,
					22,
					55,
					25
				],
				[
					10,
					45,
					15,
					67,
					46,
					16
				],
				[
					19,
					148,
					118,
					6,
					149,
					119
				],
				[
					18,
					75,
					47,
					31,
					76,
					48
				],
				[
					34,
					54,
					24,
					34,
					55,
					25
				],
				[
					20,
					45,
					15,
					61,
					46,
					16
				]
			], t = function(e, t) {
				var n = {};
				return n.totalCount = e, n.dataCount = t, n;
			}, r = {}, i = function(t, r) {
				switch (r) {
					case n.L: return e[(t - 1) * 4 + 0];
					case n.M: return e[(t - 1) * 4 + 1];
					case n.Q: return e[(t - 1) * 4 + 2];
					case n.H: return e[(t - 1) * 4 + 3];
					default: return;
				}
			};
			return r.getRSBlocks = function(e, n) {
				var r = i(e, n);
				if (r === void 0) throw "bad rs block @ typeNumber:" + e + "/errorCorrectionLevel:" + n;
				for (var a = r.length / 3, o = [], s = 0; s < a; s += 1) for (var c = r[s * 3 + 0], l = r[s * 3 + 1], u = r[s * 3 + 2], d = 0; d < c; d += 1) o.push(t(l, u));
				return o;
			}, r;
		}(), c = function() {
			var e = [], t = 0, n = {};
			return n.getBuffer = function() {
				return e;
			}, n.getAt = function(t) {
				return (e[Math.floor(t / 8)] >>> 7 - t % 8 & 1) == 1;
			}, n.put = function(e, t) {
				for (var r = 0; r < t; r += 1) n.putBit((e >>> t - r - 1 & 1) == 1);
			}, n.getLengthInBits = function() {
				return t;
			}, n.putBit = function(n) {
				var r = Math.floor(t / 8);
				e.length <= r && e.push(0), n && (e[r] |= 128 >>> t % 8), t += 1;
			}, n;
		}, l = function(e) {
			var n = t.MODE_NUMBER, r = e, i = {};
			i.getMode = function() {
				return n;
			}, i.getLength = function(e) {
				return r.length;
			}, i.write = function(e) {
				for (var t = r, n = 0; n + 2 < t.length;) e.put(a(t.substring(n, n + 3)), 10), n += 3;
				n < t.length && (t.length - n == 1 ? e.put(a(t.substring(n, n + 1)), 4) : t.length - n == 2 && e.put(a(t.substring(n, n + 2)), 7));
			};
			var a = function(e) {
				for (var t = 0, n = 0; n < e.length; n += 1) t = t * 10 + o(e.charAt(n));
				return t;
			}, o = function(e) {
				if ("0" <= e && e <= "9") return e.charCodeAt(0) - 48;
				throw "illegal char :" + e;
			};
			return i;
		}, u = function(e) {
			var n = t.MODE_ALPHA_NUM, r = e, i = {};
			i.getMode = function() {
				return n;
			}, i.getLength = function(e) {
				return r.length;
			}, i.write = function(e) {
				for (var t = r, n = 0; n + 1 < t.length;) e.put(a(t.charAt(n)) * 45 + a(t.charAt(n + 1)), 11), n += 2;
				n < t.length && e.put(a(t.charAt(n)), 6);
			};
			var a = function(e) {
				if ("0" <= e && e <= "9") return e.charCodeAt(0) - 48;
				if ("A" <= e && e <= "Z") return e.charCodeAt(0) - 65 + 10;
				switch (e) {
					case " ": return 36;
					case "$": return 37;
					case "%": return 38;
					case "*": return 39;
					case "+": return 40;
					case "-": return 41;
					case ".": return 42;
					case "/": return 43;
					case ":": return 44;
					default: throw "illegal char :" + e;
				}
			};
			return i;
		}, d = function(n) {
			var r = t.MODE_8BIT_BYTE, i = e.stringToBytes(n), a = {};
			return a.getMode = function() {
				return r;
			}, a.getLength = function(e) {
				return i.length;
			}, a.write = function(e) {
				for (var t = 0; t < i.length; t += 1) e.put(i[t], 8);
			}, a;
		}, f = function(n) {
			var r = t.MODE_KANJI, i = e.stringToBytesFuncs.SJIS;
			if (!i) throw "sjis not supported.";
			(function(e, t) {
				var n = i(e);
				if (n.length != 2 || (n[0] << 8 | n[1]) != t) throw "sjis not supported.";
			})("友", 38726);
			var a = i(n), o = {};
			return o.getMode = function() {
				return r;
			}, o.getLength = function(e) {
				return ~~(a.length / 2);
			}, o.write = function(e) {
				for (var t = a, n = 0; n + 1 < t.length;) {
					var r = (255 & t[n]) << 8 | 255 & t[n + 1];
					if (33088 <= r && r <= 40956) r -= 33088;
					else if (57408 <= r && r <= 60351) r -= 49472;
					else throw "illegal char at " + (n + 1) + "/" + r;
					r = (r >>> 8 & 255) * 192 + (r & 255), e.put(r, 13), n += 2;
				}
				if (n < t.length) throw "illegal char at " + (n + 1);
			}, o;
		}, p = function() {
			var e = [], t = {};
			return t.writeByte = function(t) {
				e.push(t & 255);
			}, t.writeShort = function(e) {
				t.writeByte(e), t.writeByte(e >>> 8);
			}, t.writeBytes = function(e, n, r) {
				n ||= 0, r ||= e.length;
				for (var i = 0; i < r; i += 1) t.writeByte(e[i + n]);
			}, t.writeString = function(e) {
				for (var n = 0; n < e.length; n += 1) t.writeByte(e.charCodeAt(n));
			}, t.toByteArray = function() {
				return e;
			}, t.toString = function() {
				var t = "";
				t += "[";
				for (var n = 0; n < e.length; n += 1) n > 0 && (t += ","), t += e[n];
				return t += "]", t;
			}, t;
		}, m = function() {
			var e = 0, t = 0, n = 0, r = "", i = {}, a = function(e) {
				r += String.fromCharCode(o(e & 63));
			}, o = function(e) {
				if (!(e < 0)) {
					if (e < 26) return 65 + e;
					if (e < 52) return 97 + (e - 26);
					if (e < 62) return 48 + (e - 52);
					if (e == 62) return 43;
					if (e == 63) return 47;
				}
				throw "n:" + e;
			};
			return i.writeByte = function(r) {
				for (e = e << 8 | r & 255, t += 8, n += 1; t >= 6;) a(e >>> t - 6), t -= 6;
			}, i.flush = function() {
				if (t > 0 && (a(e << 6 - t), e = 0, t = 0), n % 3 != 0) for (var i = 3 - n % 3, o = 0; o < i; o += 1) r += "=";
			}, i.toString = function() {
				return r;
			}, i;
		}, h = function(e) {
			var t = e, n = 0, r = 0, i = 0, a = {};
			a.read = function() {
				for (; i < 8;) {
					if (n >= t.length) {
						if (i == 0) return -1;
						throw "unexpected end of file./" + i;
					}
					var e = t.charAt(n);
					if (n += 1, e == "=") return i = 0, -1;
					e.match(/^\s$/) || (r = r << 6 | o(e.charCodeAt(0)), i += 6);
				}
				var a = r >>> i - 8 & 255;
				return i -= 8, a;
			};
			var o = function(e) {
				if (65 <= e && e <= 90) return e - 65;
				if (97 <= e && e <= 122) return e - 97 + 26;
				if (48 <= e && e <= 57) return e - 48 + 52;
				if (e == 43) return 62;
				if (e == 47) return 63;
				throw "c:" + e;
			};
			return a;
		}, g = function(e, t) {
			var n = e, r = t, i = Array(e * t), a = {};
			a.setPixel = function(e, t, r) {
				i[t * n + e] = r;
			}, a.write = function(e) {
				e.writeString("GIF87a"), e.writeShort(n), e.writeShort(r), e.writeByte(128), e.writeByte(0), e.writeByte(0), e.writeByte(0), e.writeByte(0), e.writeByte(0), e.writeByte(255), e.writeByte(255), e.writeByte(255), e.writeString(","), e.writeShort(0), e.writeShort(0), e.writeShort(n), e.writeShort(r), e.writeByte(0);
				var t = 2, i = s(t);
				e.writeByte(t);
				for (var a = 0; i.length - a > 255;) e.writeByte(255), e.writeBytes(i, a, 255), a += 255;
				e.writeByte(i.length - a), e.writeBytes(i, a, i.length - a), e.writeByte(0), e.writeString(";");
			};
			var o = function(e) {
				var t = e, n = 0, r = 0, i = {};
				return i.write = function(e, i) {
					if (e >>> i) throw "length over";
					for (; n + i >= 8;) t.writeByte(255 & (e << n | r)), i -= 8 - n, e >>>= 8 - n, r = 0, n = 0;
					r = e << n | r, n += i;
				}, i.flush = function() {
					n > 0 && t.writeByte(r);
				}, i;
			}, s = function(e) {
				for (var t = 1 << e, n = (1 << e) + 1, r = e + 1, a = c(), s = 0; s < t; s += 1) a.add(String.fromCharCode(s));
				a.add(String.fromCharCode(t)), a.add(String.fromCharCode(n));
				var l = p(), u = o(l);
				u.write(t, r);
				var d = 0, f = String.fromCharCode(i[d]);
				for (d += 1; d < i.length;) {
					var m = String.fromCharCode(i[d]);
					d += 1, a.contains(f + m) ? f += m : (u.write(a.indexOf(f), r), a.size() < 4095 && (a.size() == 1 << r && (r += 1), a.add(f + m)), f = m);
				}
				return u.write(a.indexOf(f), r), u.write(n, r), u.flush(), l.toByteArray();
			}, c = function() {
				var e = {}, t = 0, n = {};
				return n.add = function(r) {
					if (n.contains(r)) throw "dup key:" + r;
					e[r] = t, t += 1;
				}, n.size = function() {
					return t;
				}, n.indexOf = function(t) {
					return e[t];
				}, n.contains = function(t) {
					return e[t] !== void 0;
				}, n;
			};
			return a;
		}, _ = function(e, t, n) {
			for (var r = g(e, t), i = 0; i < t; i += 1) for (var a = 0; a < e; a += 1) r.setPixel(a, i, n(a, i));
			var o = p();
			r.write(o);
			for (var s = m(), c = o.toByteArray(), l = 0; l < c.length; l += 1) s.writeByte(c[l]);
			return s.flush(), "data:image/gif;base64," + s;
		};
		return e;
	}();
	(function() {
		n.stringToBytesFuncs["UTF-8"] = function(e) {
			function t(e) {
				for (var t = [], n = 0; n < e.length; n++) {
					var r = e.charCodeAt(n);
					r < 128 ? t.push(r) : r < 2048 ? t.push(192 | r >> 6, 128 | r & 63) : r < 55296 || r >= 57344 ? t.push(224 | r >> 12, 128 | r >> 6 & 63, 128 | r & 63) : (n++, r = 65536 + ((r & 1023) << 10 | e.charCodeAt(n) & 1023), t.push(240 | r >> 18, 128 | r >> 12 & 63, 128 | r >> 6 & 63, 128 | r & 63));
				}
				return t;
			}
			return t(e);
		};
	})(), (function(n) {
		typeof define == "function" && define.amd ? define([], n) : typeof e == "object" && (t.exports = n());
	})(function() {
		return n;
	});
})))()), _c = { class: "qr-card" }, vc = { id: "qrDialogTitle" }, yc = ["aria-label"], bc = { class: "qr-note" }, xc = ["value", "aria-label"], Sc = { class: "qr-actions" }, Cc = {
	class: "qr-status",
	role: "status"
}, wc = {
	__name: "QrShare",
	props: {
		url: {
			type: String,
			required: !0
		},
		t: {
			type: Function,
			required: !0
		}
	},
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ B(), a = /* @__PURE__ */ B(), o = /* @__PURE__ */ B(), s = /* @__PURE__ */ B("");
		function c() {
			let e = a.value;
			if (!e) return;
			let t = (0, gc.default)(0, "M");
			t.addData(n.url), t.make();
			let r = t.getModuleCount(), i = r + 8, o = Math.max(220, Math.min(300, Math.floor(window.innerWidth * .7))), s = window.devicePixelRatio || 1, c = Math.floor(o * s / i), l = c * i;
			e.width = l, e.height = l, e.style.width = o + "px", e.style.height = o + "px";
			let u = e.getContext("2d");
			u.fillStyle = "#fff", u.fillRect(0, 0, l, l), u.fillStyle = "#111";
			for (let e = 0; e < r; e += 1) for (let n = 0; n < r; n += 1) t.isDark(e, n) && u.fillRect((n + 4) * c, (e + 4) * c, c, c);
		}
		function l() {
			i.value?.open && i.value.close(), r("close");
		}
		function u(e) {
			e.target === i.value && l();
		}
		async function d() {
			try {
				await navigator.clipboard.writeText(n.url), s.value = n.t("copied");
			} catch {
				s.value = n.t("copyError");
			}
			window.setTimeout(() => {
				s.value = "";
			}, 2500);
		}
		return rr(() => {
			i.value?.showModal(), c(), o.value?.focus();
		}), ir(() => {
			i.value?.open && i.value.close();
		}), (t, n) => (J(), Y("dialog", {
			ref_key: "dialog",
			ref: i,
			class: "qr-dialog",
			"aria-labelledby": "qrDialogTitle",
			onCancel: Za(l, ["prevent"]),
			onClick: u
		}, [X("div", _c, [
			X("h2", vc, P(e.t("qrTitle")), 1),
			X("p", null, P(e.t("qrHint")), 1),
			X("canvas", {
				ref_key: "canvas",
				ref: a,
				class: "qr-canvas",
				role: "img",
				"aria-label": e.t("qrAria")
			}, null, 8, yc),
			X("p", bc, P(e.t("qrNote")), 1),
			X("input", {
				class: "qr-url",
				type: "text",
				readonly: "",
				value: e.url,
				"aria-label": e.t("copy"),
				onFocus: n[0] ||= (e) => e.target.select()
			}, null, 40, xc),
			X("div", Sc, [X("button", {
				type: "button",
				class: "button",
				onClick: d
			}, P(e.t("copy")), 1), X("button", {
				ref_key: "closeButton",
				ref: o,
				type: "button",
				class: "button secondary",
				onClick: l
			}, P(e.t("qrClose")), 513)]),
			X("p", Cc, P(s.value), 1)
		])], 544));
	}
}, Tc = { class: "topbar" }, Ec = ["href"], Dc = { class: "topbar-actions" }, Oc = [
	"data-base",
	"data-home",
	"data-lang"
], kc = {
	key: 1,
	class: "language"
}, Ac = ["value", "disabled"], jc = { class: "shell" }, Mc = {
	key: 0,
	class: "actions"
}, Nc = ["href"], Pc = {
	key: 1,
	role: "status"
}, Fc = {
	id: "home",
	class: "panel hero"
}, Ic = {
	key: 0,
	class: "test-phase",
	role: "note"
}, Lc = {
	key: 1,
	id: "demoNotice",
	class: "test-phase demo-notice",
	role: "note"
}, Rc = ["href"], zc = {
	key: 2,
	class: "muted"
}, Bc = { class: "actions" }, Vc = ["href"], Hc = { class: "type-grid" }, Uc = [
	"data-type",
	"disabled",
	"onClick"
], Wc = { class: "type-icon" }, Gc = { class: "actions" }, Kc = {
	id: "editor",
	class: "panel",
	"aria-labelledby": "editorTitle"
}, qc = { class: "section-heading" }, Jc = { id: "editorTitle" }, Yc = ["disabled"], Xc = ["disabled"], Zc = ["placeholder"], Qc = ["placeholder"], $c = { id: "catalogField" }, el = ["id", "onUpdate:modelValue"], tl = ["value"], nl = ["value"], rl = ["value"], il = {
	id: "formError",
	class: "error",
	role: "alert"
}, al = { class: "actions" }, ol = ["disabled"], sl = ["disabled"], cl = {
	key: 2,
	id: "previewPanel",
	class: "panel",
	"aria-labelledby": "previewTitle"
}, ll = { class: "section-heading" }, ul = { class: "eyebrow" }, dl = { id: "previewTitle" }, fl = ["disabled"], pl = {
	key: 0,
	id: "previewActions",
	class: "actions"
}, ml = ["disabled"], hl = {
	key: 1,
	id: "savedActions",
	class: "actions"
}, gl = ["href"], _l = ["disabled"], vl = ["disabled"], yl = ["disabled"], bl = ["disabled"], xl = {
	key: 2,
	id: "submissionStatus",
	role: "status"
}, Sl = { key: 0 }, Cl = {
	key: 3,
	class: "error",
	role: "alert"
}, wl = {
	id: "library",
	class: "panel",
	"aria-labelledby": "libraryTitle"
}, Tl = { class: "section-heading" }, El = { id: "libraryTitle" }, Dl = ["disabled"], Ol = ["placeholder", "aria-label"], kl = ["aria-label"], Al = { value: "" }, jl = ["value"], Ml = ["disabled"], Nl = {
	id: "libraryStatus",
	class: "library-status",
	role: "status"
}, Pl = {
	id: "libraryList",
	class: "library-grid"
}, Fl = {
	key: 0,
	class: "library-status"
}, Il = { class: "library-meta" }, Ll = { class: "library-card-actions" }, Rl = ["href"], zl = ["href"], Bl = ["aria-label", "onClick"], Vl = ["disabled", "onClick"], Hl = { class: "actions" }, Ul = ["disabled"], Wl = ["disabled"], Gl = { class: "library-admin" }, Kl = ["disabled"], ql = { class: "muted" }, Jl = { id: "catalogAdminEditor" }, Yl = { class: "muted" }, Xl = ["id", "onUpdate:modelValue"], Zl = ["disabled"], Ql = {
	id: "catalogStatus",
	class: "muted",
	role: "status"
}, $l = { class: "section-heading" }, eu = {
	type: "submit",
	class: "button secondary"
}, tu = {
	id: "compoundBankList",
	class: "bank-list"
}, nu = {
	key: 0,
	class: "library-status"
}, ru = {
	key: 1,
	role: "alert"
}, iu = {
	key: 2,
	class: "library-status"
}, au = { class: "library-meta" }, ou = ["disabled", "onClick"], su = {
	key: 4,
	class: "error",
	role: "alert"
}, cu = {
	__name: "PlayApp",
	setup(e) {
		let t = ho(), { capabilities: n, submission: r, integrated: i, commonsBase: a, submitReview: o, loadPublication: s, base: c, TYPES: l, TYPE_LABELS: u, language: d, t: f, view: p, ready: m, busy: h, form: g, saved: _, formError: v, message: y, messageError: b, savingDisabled: x, demoUrl: S, qrUrl: C, showQr: w, closeQr: T, catalog: E, catalogDraft: D, catalogMessage: ee, library: O, bank: k, bankDialog: te, adminInput: ne, adminToken: A, published: re, editorTitle: j, choose: ie, go: M, changeLanguage: ae, saveActivity: oe, openLibrary: se, filterLibrary: ce, applyToken: N, removeActivity: le, publication: ue, saveCatalog: de, openBank: fe, loadBank: pe, addFromBank: me, closeBank: he, copy: ge, onStatement: _e } = t, ve = [
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
		function be(e) {
			let t = d.value === "va" ? "ca" : d.value;
			return E.value.labels?.[e]?.[t] || e;
		}
		return (e, s) => (J(), Y(q, null, [X("header", Tc, [X("a", {
			class: "brand",
			href: V(c) + "/"
		}, "EduTicTac Play", 8, Ec), X("div", Dc, [V(a) === null ? Q("", !0) : (J(), Y("edutictac-account", {
			key: 0,
			id: "accountWidget",
			"data-base": V(a),
			"data-home": V(i) ? (V(a) || "") + "/" : null,
			"data-lang": V(d),
			"data-no-reload": ""
		}, null, 8, Oc)), V(a) === null ? (J(), Y("label", kc, [X("span", null, P(V(f)("language")), 1), X("select", {
			id: "language",
			value: V(d),
			disabled: V(h),
			onChange: s[0] ||= (e) => V(ae)(e.target.value)
		}, [...s[34] ||= [
			X("option", { value: "es" }, "ES", -1),
			X("option", { value: "ca" }, "CA", -1),
			X("option", { value: "va" }, "VA", -1),
			X("option", { value: "en" }, "EN", -1)
		]], 40, Ac)])) : Q("", !0)])]), X("main", jc, [
			V(i) && !V(n).can_publish && !V(n).can_submit ? (J(), Y("p", Mc, [X("a", {
				class: "button secondary",
				href: V(c) + "/api/publication/login"
			}, P(V(f)("teacherLogin")), 9, Nc), X("span", null, P(V(f)("loginToSave")), 1)])) : Q("", !0),
			V(m) ? Q("", !0) : (J(), Y("p", Pc, P(V(f)("libraryLoading")), 1)),
			W(X("section", Fc, [
				s[35] ||= X("p", { class: "eyebrow" }, "EduTicTac Commons", -1),
				X("h1", null, P(V(f)("homeTitle")), 1),
				X("p", null, P(V(f)("homeIntro")), 1),
				V(S) ? (J(), Y("p", Ic, [X("strong", null, P(V(f)("testPhaseTitle")), 1), bi(" " + P(V(f)("testPhaseNotice")), 1)])) : Q("", !0),
				V(S) ? (J(), Y("p", Lc, [
					X("strong", null, P(V(f)("demoTitle")), 1),
					bi(" " + P(V(f)("demoNotice")) + " ", 1),
					X("a", {
						id: "demoLink",
						href: V(S)
					}, P(V(f)("demoLink")), 9, Rc)
				])) : (J(), Y("p", zc, P(V(f)(V(i) ? "productionNotice" : "anonymousNotice")), 1)),
				X("div", Bc, [V(n).can_review ? (J(), Y("button", {
					key: 0,
					id: "openReviews",
					class: "button",
					onClick: s[1] ||= (e) => V(M)("reviews")
				}, P(V(f)("reviewsTitle")), 1)) : Q("", !0), V(i) && !V(n).can_publish && !V(n).can_submit ? (J(), Y("a", {
					key: 1,
					id: "playLogin",
					class: "button secondary",
					href: V(c) + "/api/publication/login"
				}, P(V(f)("teacherLogin")), 9, Vc)) : Q("", !0)]),
				X("div", Hc, [(J(!0), Y(q, null, G(V(l), (e, t) => (J(), Y("button", {
					key: e,
					class: "type-card",
					"data-type": e,
					disabled: V(h),
					onClick: (t) => V(ie)(e)
				}, [
					X("span", Wc, P(ve[t]), 1),
					X("strong", null, P(V(f)(V(u)[e])), 1),
					X("small", null, P(V(f)(e === "compound" ? "compound.help" : V(u)[e] + "Help")), 1)
				], 8, Uc))), 128))]),
				X("div", Gc, [X("button", {
					id: "openLibrary",
					type: "button",
					class: "button secondary",
					onClick: s[2] ||= (...e) => V(se) && V(se)(...e)
				}, P(V(f)("libraryOpen")), 1)])
			], 512), [[oa, V(p) === "home" && V(m)]]),
			W(X("section", Kc, [X("div", qc, [X("div", null, [s[36] ||= X("p", { class: "eyebrow" }, "EduTicTac Play", -1), X("h1", Jc, P(V(j)), 1)]), X("button", {
				id: "backHome",
				class: "button secondary",
				disabled: V(h),
				onClick: s[3] ||= (e) => V(M)("home")
			}, P(V(f)("back")), 9, Yc)]), X("form", {
				id: "activityForm",
				novalidate: "",
				onSubmit: s[10] ||= Za((e) => V(oe)(!0), ["prevent"])
			}, [
				X("fieldset", {
					class: "editor-controls",
					disabled: V(h)
				}, [
					X("label", null, [X("span", null, P(V(f)("title")), 1), W(X("input", {
						id: "title",
						"onUpdate:modelValue": s[4] ||= (e) => V(g).title = e,
						maxlength: "200",
						required: "",
						placeholder: V(f)("titlePlaceholder")
					}, null, 8, Zc), [[$, V(g).title]])]),
					X("label", null, [X("span", null, P(V(f)("question")), 1), W(X("textarea", {
						id: "question",
						"onUpdate:modelValue": s[5] ||= (e) => V(g).question = e,
						maxlength: "2000",
						required: "",
						placeholder: V(f)("questionPlaceholder")
					}, null, 8, Qc), [[$, V(g).question]])]),
					(J(), fi(Js, {
						key: V(g),
						form: V(g),
						t: V(f),
						busy: V(h),
						onBank: V(fe),
						onImageError: s[6] ||= (e) => v.value = V(f)("imageError"),
						onImageBusy: s[7] ||= (e) => V(t).imageTasks.value += e
					}, null, 8, [
						"form",
						"t",
						"busy",
						"onBank"
					])),
					X("fieldset", $c, [
						X("legend", null, P(V(f)("catalog.legend")), 1),
						(J(), Y(q, null, G([
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
						], (e) => X("label", { key: e.id }, [X("span", null, P(V(f)("catalog." + e.label)), 1), W(X("select", {
							id: e.id,
							"onUpdate:modelValue": (t) => V(g)[e.key] = t
						}, [
							s[37] ||= X("option", { value: "" }, null, -1),
							V(g)[e.key] && !(V(E)[e.list] || []).includes(V(g)[e.key]) ? (J(), Y("option", {
								key: 0,
								value: V(g)[e.key]
							}, P(be(V(g)[e.key])), 9, tl)) : Q("", !0),
							(J(!0), Y(q, null, G(V(E)[e.list] || [], (e) => (J(), Y("option", {
								key: e,
								value: e
							}, P(be(e)), 9, nl))), 128))
						], 8, el), [[Wa, V(g)[e.key]]])])), 64)),
						X("label", null, [X("span", null, P(V(f)("catalog.tags")), 1), W(X("select", {
							id: "activityTags",
							"onUpdate:modelValue": s[8] ||= (e) => V(g).tags = e,
							multiple: "",
							size: "4"
						}, [(J(!0), Y(q, null, G([.../* @__PURE__ */ new Set([...V(E).tags || [], ...V(g).tags || []])], (e) => (J(), Y("option", {
							key: e,
							value: e
						}, P(be(e)), 9, rl))), 128))], 512), [[Wa, V(g).tags]])])
					])
				], 8, Xc),
				X("p", il, P(V(v)), 1),
				X("div", al, [X("button", {
					id: "preview",
					type: "submit",
					class: "button",
					disabled: V(x)
				}, P(V(f)("preview")), 9, ol), X("button", {
					id: "save",
					type: "button",
					class: "button secondary",
					disabled: V(x),
					onClick: s[9] ||= (e) => V(oe)(!1)
				}, P(V(f)("save")), 9, sl)])
			], 32)], 512), [[oa, V(p) === "editor" && V(m)]]),
			V(p) === "previewPanel" && V(_) ? (J(), Y("section", cl, [
				X("div", ll, [X("div", null, [X("p", ul, P(V(f)("previewEyebrow")), 1), X("h1", dl, P(V(_).title), 1)]), X("button", {
					id: "edit",
					class: "button secondary",
					disabled: V(h),
					onClick: s[11] ||= (e) => V(M)("editor")
				}, P(V(f)("edit")), 9, fl)]),
				Z(Xs, {
					base: V(c),
					activity: V(_),
					"on-statement": V(_e)
				}, {
					default: Pn(() => [bi(P(V(f)("playerError")), 1)]),
					_: 1
				}, 8, [
					"base",
					"activity",
					"on-statement"
				]),
				V(_).id.startsWith("preview-") ? (J(), Y("div", pl, [X("button", {
					id: "savePreview",
					class: "button",
					disabled: V(x),
					onClick: s[12] ||= (e) => V(oe)(!1)
				}, P(V(f)("save")), 9, ml), X("span", null, P(V(f)("previewOnly")), 1)])) : (J(), Y("div", hl, [
					X("a", {
						id: "download",
						class: "button",
						href: V(c) + "/api/activities/" + V(_).id + "/download"
					}, P(V(f)("download")), 9, gl),
					!V(re) && V(n).can_publish ? (J(), Y("button", {
						key: 0,
						id: "publishRecursos",
						class: "button",
						disabled: V(h),
						onClick: s[13] ||= (e) => V(ue)(!1)
					}, P(V(f)("publishRecursos")), 9, _l)) : V(re) && V(n).can_publish ? (J(), Y("button", {
						key: 1,
						id: "unpublishRecursos",
						class: "button secondary",
						disabled: V(h),
						onClick: s[14] ||= (e) => V(ue)(!0)
					}, P(V(f)("unpublishRecursos")), 9, vl)) : Q("", !0),
					V(n).can_submit ? (J(), Y("button", {
						key: 2,
						id: "submitPlayReview",
						class: "button",
						disabled: V(h) || ["pending", "approved"].includes(V(r)?.status),
						onClick: s[15] ||= (...e) => V(o) && V(o)(...e)
					}, P(V(f)("reviewSubmit")), 9, yl)) : Q("", !0),
					X("button", {
						id: "copy",
						class: "button secondary",
						onClick: s[16] ||= (...e) => V(ge) && V(ge)(...e)
					}, P(V(f)("copy")), 1),
					X("button", {
						id: "qrShare",
						type: "button",
						class: "button secondary",
						onClick: s[17] ||= (e) => V(w)(V(_).id)
					}, P(V(f)("qr")), 1),
					V(_).owned ? (J(), Y("button", {
						key: 3,
						id: "deleteSaved",
						class: "button secondary",
						disabled: V(h),
						onClick: s[18] ||= (e) => V(le)(V(_).id)
					}, P(V(f)("deleteActivity")), 9, bl)) : Q("", !0)
				])),
				V(r) ? (J(), Y("p", xl, [bi(P(V(f)("reviewStatus." + V(r).status)), 1), V(r).feedback ? (J(), Y("span", Sl, " · " + P(V(r).feedback), 1)) : Q("", !0)])) : Q("", !0),
				X("p", {
					id: "savedMessage",
					class: ye({ error: V(b) }),
					role: "status"
				}, P(V(y) ? V(f)(V(y)) : ""), 3),
				V(v) ? (J(), Y("p", Cl, P(V(v)), 1)) : Q("", !0)
			])) : Q("", !0),
			W(X("section", wl, [
				X("div", Tl, [X("div", null, [s[38] ||= X("p", { class: "eyebrow" }, "EduTicTac Play", -1), X("h1", El, P(V(f)("libraryTitle")), 1)]), X("button", {
					id: "libraryBack",
					class: "button secondary",
					disabled: V(h),
					onClick: s[19] ||= (e) => V(M)("home")
				}, P(V(f)("back")), 9, Dl)]),
				X("form", {
					class: "library-filters",
					onSubmit: s[23] ||= Za((e) => V(ce)(), ["prevent"])
				}, [
					W(X("input", {
						id: "librarySearch",
						"onUpdate:modelValue": s[20] ||= (e) => V(O).term = e,
						type: "search",
						placeholder: V(f)("librarySearchPlaceholder"),
						"aria-label": V(f)("libraryFilter")
					}, null, 8, Ol), [[$, V(O).term]]),
					W(X("select", {
						id: "libraryType",
						"onUpdate:modelValue": s[21] ||= (e) => V(O).type = e,
						"aria-label": V(f)("compound.type"),
						onChange: s[22] ||= (e) => V(ce)()
					}, [X("option", Al, P(V(f)("libraryAllTypes")), 1), (J(!0), Y(q, null, G(V(l), (e) => (J(), Y("option", {
						key: e,
						value: e
					}, P(V(f)(V(u)[e])), 9, jl))), 128))], 40, kl), [[Wa, V(O).type]]),
					X("button", {
						id: "libraryFilter",
						type: "submit",
						class: "button secondary",
						disabled: V(h)
					}, P(V(f)("libraryFilter")), 9, Ml)
				], 32),
				X("p", Nl, P(V(O).loading ? V(f)("libraryLoading") : V(O).error ? V(f)("libraryError") : V(f)("libraryStatus").replace(":from", V(O).total ? V(O).offset + 1 : 0).replace(":to", V(O).offset + V(O).items.length).replace(":total", V(O).total)), 1),
				X("div", Pl, [!V(O).loading && !V(O).error && !V(O).items.length ? (J(), Y("p", Fl, P(V(f)("libraryEmpty")), 1)) : Q("", !0), (J(!0), Y(q, null, G(V(O).items, (e) => (J(), Y("article", {
					key: e.id,
					class: "library-card"
				}, [
					X("h2", null, P(e.title), 1),
					X("p", Il, P(V(f)(V(u)[e.type] || e.type)) + " · " + P((e.createdAt || "").slice(0, 10)) + P(e.owned ? " · " + V(f)("libraryYours") : ""), 1),
					X("div", Ll, [
						X("a", {
							class: "button",
							href: V(c) + "/" + e.id
						}, P(V(f)("libraryOpenActivity")), 9, Rl),
						X("a", {
							class: "button secondary",
							href: V(c) + "/api/activities/" + e.id + "/download"
						}, P(V(f)("download")), 9, zl),
						X("button", {
							type: "button",
							class: "button secondary",
							"aria-label": V(f)("qrAria"),
							onClick: (t) => V(w)(e.id)
						}, P(V(f)("qr")), 9, Bl),
						e.owned || V(A) ? (J(), Y("button", {
							key: 0,
							type: "button",
							class: "button secondary",
							disabled: V(h),
							onClick: (t) => V(le)(e.id, !0)
						}, P(V(f)("libraryDelete")), 9, Vl)) : Q("", !0)
					])
				]))), 128))]),
				X("div", Hl, [X("button", {
					id: "libraryPrev",
					type: "button",
					class: "button secondary",
					disabled: V(O).loading || V(h) || V(O).offset <= 0,
					onClick: s[24] ||= (e) => V(ce)(Math.max(0, V(O).offset - 12))
				}, P(V(f)("libraryPrev")), 9, Ul), X("button", {
					id: "libraryNext",
					type: "button",
					class: "button secondary",
					disabled: V(O).loading || V(h) || !V(O).hasMore,
					onClick: s[25] ||= (e) => V(ce)(V(O).offset + 12)
				}, P(V(f)("libraryNext")), 9, Wl)]),
				X("details", Gl, [
					X("summary", null, P(V(f)("libraryAdmin")), 1),
					X("label", null, [X("span", null, P(V(f)("libraryAdminToken")), 1), W(X("input", {
						id: "libraryToken",
						"onUpdate:modelValue": s[26] ||= (e) => /* @__PURE__ */ z(ne) ? ne.value = e : null,
						type: "password",
						autocomplete: "off"
					}, null, 512), [[$, V(ne)]])]),
					X("button", {
						id: "libraryTokenSave",
						type: "button",
						class: "button secondary",
						disabled: V(h),
						onClick: s[27] ||= (...e) => V(N) && V(N)(...e)
					}, P(V(f)("libraryTokenSave")), 9, Kl),
					X("p", ql, P(V(f)("libraryAdminHelp")), 1),
					X("div", Jl, [X("fieldset", null, [
						X("legend", null, P(V(f)("catalogAdmin")), 1),
						X("p", Yl, P(V(f)("catalogAdminHelp")), 1),
						(J(), Y(q, null, G([
							"subjects",
							"educational_stages",
							"levels",
							"tags"
						], (e, t) => X("label", { key: e }, [X("span", null, P(V(f)("catalog." + [
							"subject",
							"stage",
							"level",
							"tags"
						][t])), 1), W(X("textarea", {
							id: [
								"catalogSubjects",
								"catalogStages",
								"catalogLevels",
								"catalogTags"
							][t],
							"onUpdate:modelValue": (t) => V(D)[e] = t,
							rows: "3"
						}, null, 8, Xl), [[$, V(D)[e]]])])), 64)),
						X("button", {
							id: "catalogSave",
							type: "button",
							class: "button secondary",
							disabled: V(h),
							onClick: s[28] ||= (...e) => V(de) && V(de)(...e)
						}, P(V(f)("catalogSave")), 9, Zl),
						X("p", Ql, P(V(ee) ? V(f)(V(ee)) : ""), 1)
					])])
				])
			], 512), [[oa, V(p) === "library" && V(m)]]),
			V(p) === "reviews" && V(n).can_review ? (J(), Y(q, { key: 3 }, [X("button", {
				id: "reviewsBack",
				class: "button secondary",
				onClick: s[29] ||= (e) => V(M)("home")
			}, P(V(f)("back")), 1), Z(hc, {
				base: V(c),
				t: V(f)
			}, null, 8, ["base", "t"])], 64)) : Q("", !0),
			X("dialog", {
				ref_key: "bankDialog",
				ref: te,
				id: "compoundBankDialog",
				onCancel: s[33] ||= (...e) => V(he) && V(he)(...e)
			}, [X("form", {
				method: "dialog",
				class: "bank-dialog",
				onSubmit: s[32] ||= Za((...e) => V(he) && V(he)(...e), ["prevent"])
			}, [
				X("div", $l, [X("h2", null, P(V(f)("bank.title")), 1), X("button", eu, P(V(f)("bank.close")), 1)]),
				X("label", null, [X("span", null, P(V(f)("bank.search")), 1), W(X("input", {
					id: "compoundBankSearch",
					"onUpdate:modelValue": s[30] ||= (e) => V(k).term = e,
					type: "search",
					onInput: s[31] ||= (...e) => V(pe) && V(pe)(...e)
				}, null, 544), [[$, V(k).term]])]),
				X("div", tu, [V(k).loading ? (J(), Y("p", nu, P(V(f)("bank.loading")), 1)) : V(k).error ? (J(), Y("p", ru, P(V(f)("libraryError")), 1)) : V(k).items.length ? Q("", !0) : (J(), Y("p", iu, P(V(f)("bank.empty")), 1)), (J(!0), Y(q, null, G(V(k).items, (e) => (J(), Y("article", {
					key: e.id,
					class: "library-card"
				}, [X("div", null, [X("h3", null, P(e.title), 1), X("p", au, P(V(f)(V(u)[e.type])), 1)]), X("button", {
					type: "button",
					class: "button",
					disabled: V(h),
					onClick: (t) => V(me)(e.id)
				}, P(V(f)("bank.addOne")), 9, ou)]))), 128))])
			], 32)], 544),
			V(p) === "home" && V(v) ? (J(), Y("p", su, P(V(v)), 1)) : Q("", !0),
			V(C) ? (J(), fi(wc, {
				key: 5,
				url: V(C),
				t: V(f),
				onClose: V(T)
			}, null, 8, [
				"url",
				"t",
				"onClose"
			])) : Q("", !0)
		])], 64));
	}
};
// services/play/src/main.js
function lu(e) {
	return to(cu).mount(e);
}
export { lu as mountPlay };
