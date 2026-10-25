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
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ee = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, te = /-\w/g, E = ee((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), D = /\B([A-Z])/g, O = ee((e) => e.replace(D, "-$1").toLowerCase()), k = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), A = ee((e) => e ? `on${k(e)}` : ""), j = (e, t) => !Object.is(e, t), M = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ne = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, N = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, P, re = () => P ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ie(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? se(r) : ie(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var ae = /;(?![^(]*\))/g, F = /:([^]+)/, oe = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function se(e) {
	let t = {};
	return e.replace(oe, (e) => e.startsWith("/*") ? "" : e).split(ae).forEach((e) => {
		if (e) {
			let n = e.split(F);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function I(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = I(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ce = /* @__PURE__ */ e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function le(e) {
	return !!e || e === "";
}
function ue(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = L(e[i], t[i], n);
	return r;
}
function de(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && L(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function fe(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? de(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !L(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function pe(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function L(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? pe(e, t, n, ue) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : pe(e, t, n, fe) : String(e) === String(t))));
}
function R(e, t) {
	return e.findIndex((e) => L(e, t));
}
var me = (e) => !!(e && e.__v_isRef === !0), z = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? me(e) ? z(e.value) : JSON.stringify(e, he, 2) : String(e), he = (e, t) => me(t) ? he(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ge(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ge(e)) } : _(t) ? ge(t) : v(t) && !d(t) && !C(t) ? String(t) : t, ge = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, B, _e = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && B && (B.active ? (this.parent = B, this.index = (B.scopes || (B.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = B;
			try {
				return B = this, e();
			} finally {
				B = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = B, B = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (B === this) B = this.prevScope;
			else {
				let e = B;
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
function ve() {
	return B;
}
var V, ye = /* @__PURE__ */ new WeakSet(), be = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, B && (B.active ? B.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, ye.has(this) && (ye.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || we(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Le(this), De(this);
		let e = V, t = Ne;
		V = this, Ne = !0;
		try {
			return this.fn();
		} finally {
			Oe(this), V = e, Ne = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) je(e);
			this.deps = this.depsTail = void 0, Le(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? ye.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		ke(this) && this.run();
	}
	get dirty() {
		return ke(this);
	}
}, xe = 0, Se, Ce;
function we(e, t = !1) {
	e.flags |= 8, t ? (e.next = Ce, Ce = e) : (e.next = Se, Se = e);
}
function Te() {
	xe++;
}
function Ee() {
	if (--xe > 0) return;
	if (Ce) {
		let e = Ce;
		for (Ce = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Se;) {
		let t = Se;
		for (Se = void 0; t;) {
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
function De(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Oe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), je(r), Me(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function ke(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ae(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ae(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Re) || (e.globalVersion = Re, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ke(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = V, r = Ne;
	V = e, Ne = !0;
	try {
		De(e);
		let n = e.fn(e._value);
		(t.version === 0 || j(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		V = n, Ne = r, Oe(e), e.flags &= -3;
	}
}
function je(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) je(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Me(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ne = !0, Pe = [];
function Fe() {
	Pe.push(Ne), Ne = !1;
}
function Ie() {
	let e = Pe.pop();
	Ne = e === void 0 || e;
}
function Le(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = V;
		V = void 0;
		try {
			t();
		} finally {
			V = e;
		}
	}
}
var Re = 0, ze = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Be = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!V || !Ne || V === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== V) t = this.activeLink = new ze(V, this), V.deps ? (t.prevDep = V.depsTail, V.depsTail.nextDep = t, V.depsTail = t) : V.deps = V.depsTail = t, Ve(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = V.depsTail, t.nextDep = void 0, V.depsTail.nextDep = t, V.depsTail = t, V.deps === t && (V.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Re++, this.notify(e);
	}
	notify(e) {
		Te();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ee();
		}
	}
};
function Ve(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ve(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var He = /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ Symbol(""), We = /* @__PURE__ */ Symbol(""), Ge = /* @__PURE__ */ Symbol("");
function H(e, t, n) {
	if (Ne && V) {
		let t = He.get(e);
		t || He.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Be()), r.map = t, r.key = n), r.track();
	}
}
function Ke(e, t, n, r, i, a) {
	let o = He.get(e);
	if (!o) {
		Re++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Te(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ge || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ge)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ue)), f(e) && s(o.get(We)));
				break;
			case "delete":
				i || (s(o.get(Ue)), f(e) && s(o.get(We)));
				break;
			case "set": f(e) && s(o.get(Ue));
		}
	}
	Ee();
}
function qe(e) {
	let t = /* @__PURE__ */ U(e);
	return t === e || (H(t, "iterate", Ge), /* @__PURE__ */ Nt(e)) ? t : /* @__PURE__ */ Mt(e) ? /* @__PURE__ */ jt(e) ? t.map((e) => Lt(It(e))) : t.map(Lt) : t.map(It);
}
function Je(e) {
	return H(e = /* @__PURE__ */ U(e), "iterate", Ge), e;
}
function Ye(e, t) {
	return /* @__PURE__ */ Mt(e) ? Lt(/* @__PURE__ */ jt(e) ? It(t) : t) : It(t);
}
var Xe = {
	__proto__: null,
	[Symbol.iterator]() {
		return Ze(this, Symbol.iterator, (e) => Ye(this, e));
	},
	concat(...e) {
		return qe(this).concat(...e.map((e) => d(e) ? qe(e) : e));
	},
	entries() {
		return Ze(this, "entries", (e) => (e[1] = Ye(this, e[1]), e));
	},
	every(e, t) {
		return et(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return et(this, "filter", e, t, (e) => e.map((e) => Ye(this, e)), arguments);
	},
	find(e, t) {
		return et(this, "find", e, t, (e) => Ye(this, e), arguments);
	},
	findIndex(e, t) {
		return et(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return et(this, "findLast", e, t, (e) => Ye(this, e), arguments);
	},
	findLastIndex(e, t) {
		return et(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return et(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return nt(this, "includes", e);
	},
	indexOf(...e) {
		return nt(this, "indexOf", e);
	},
	join(e) {
		return qe(this).join(e);
	},
	lastIndexOf(...e) {
		return nt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return et(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return rt(this, "pop");
	},
	push(...e) {
		return rt(this, "push", e);
	},
	reduce(e, ...t) {
		return tt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return tt(this, "reduceRight", e, t);
	},
	shift() {
		return rt(this, "shift");
	},
	some(e, t) {
		return et(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return rt(this, "splice", e);
	},
	toReversed() {
		return qe(this).toReversed();
	},
	toSorted(e) {
		return qe(this).toSorted(e);
	},
	toSpliced(...e) {
		return qe(this).toSpliced(...e);
	},
	unshift(...e) {
		return rt(this, "unshift", e);
	},
	values() {
		return Ze(this, "values", (e) => Ye(this, e));
	}
};
function Ze(e, t, n) {
	let r = Je(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ Nt(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Qe(a.next(), n), i !== $e[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => Qe(a._next(), n);
	}
	return a;
}
function Qe(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var $e = Array.prototype;
function et(e, t, n, r, i, a) {
	let o = Je(e), s = o !== e && !/* @__PURE__ */ Nt(e), c = o[t];
	if (c !== $e[t]) {
		let t = c.apply(e, a);
		return s ? It(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Ye(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function tt(e, t, n, r) {
	let i = Je(e), a = i !== e && !/* @__PURE__ */ Nt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Ye(e, t)), n.call(this, t, Ye(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Ye(e, c) : c;
}
function nt(e, t, n) {
	let r = /* @__PURE__ */ U(e);
	H(r, "iterate", Ge);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Pt(n[0]) ? (n[0] = /* @__PURE__ */ U(n[0]), r[t](...n)) : i;
}
function rt(e, t, n = []) {
	Fe(), Te();
	let r = (/* @__PURE__ */ U(e))[t].apply(e, n);
	return Ee(), Ie(), r;
}
var it = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), at = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function ot(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ U(this);
	return H(t, "has", e), t.hasOwnProperty(e);
}
var st = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Tt : wt : i ? Ct : St).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = Xe[t])) return e;
			if (t === "hasOwnProperty") return ot;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ W(e) ? e : n);
		if ((_(t) ? at.has(t) : it(t)) || (r || H(e, "get", t), i)) return o;
		if (/* @__PURE__ */ W(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ kt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ kt(o) : /* @__PURE__ */ Dt(o) : o;
	}
}, ct = class extends st {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Mt(i);
			if (!/* @__PURE__ */ Nt(n) && !/* @__PURE__ */ Mt(n) && (i = /* @__PURE__ */ U(i), n = /* @__PURE__ */ U(n)), !a && /* @__PURE__ */ W(i) && !/* @__PURE__ */ W(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ W(e) ? e : r);
		return e === /* @__PURE__ */ U(r) && s && (o ? j(n, i) && Ke(e, "set", t, n, i) : Ke(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ke(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && at.has(t) || H(e, "has", t), n;
	}
	ownKeys(e) {
		return H(e, "iterate", d(e) ? "length" : Ue), Reflect.ownKeys(e);
	}
}, lt = class extends st {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, ut = /* @__PURE__ */ new ct(), dt = /* @__PURE__ */ new lt(), ft = /* @__PURE__ */ new ct(!0), pt = (e) => e, mt = (e) => Reflect.getPrototypeOf(e);
function ht(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ U(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? pt : t ? Lt : It;
		return !t && H(a, "iterate", l ? We : Ue), s(Object.create(u), { next() {
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
function gt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function _t(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ U(r), a = /* @__PURE__ */ U(n);
			e || (j(n, a) && H(i, "get", n), H(i, "get", a));
			let { has: o } = mt(i), s = t ? pt : e ? Lt : It;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && H(/* @__PURE__ */ U(t), "iterate", Ue), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ U(n), i = /* @__PURE__ */ U(t);
			return e || (j(t, i) && H(r, "has", t), H(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ U(a), s = t ? pt : e ? Lt : It;
			return !e && H(o, "iterate", Ue), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: gt("add"),
		set: gt("set"),
		delete: gt("delete"),
		clear: gt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ U(this), r = mt(n), i = /* @__PURE__ */ U(e), a = !t && !/* @__PURE__ */ Nt(e) && !/* @__PURE__ */ Mt(e) ? i : e;
			return r.has.call(n, a) || j(e, a) && r.has.call(n, e) || j(i, a) && r.has.call(n, i) || (n.add(a), Ke(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ Nt(n) || /* @__PURE__ */ Mt(n) || (n = /* @__PURE__ */ U(n));
			let r = /* @__PURE__ */ U(this), { has: i, get: a } = mt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ U(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? j(n, s) && Ke(r, "set", e, n, s) : Ke(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ U(this), { has: n, get: r } = mt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ U(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ke(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ U(this), t = e.size !== 0, n = e.clear();
			return t && Ke(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = ht(r, e, t);
	}), n;
}
function vt(e, t) {
	let n = _t(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
}
var yt = { get: /* @__PURE__ */ vt(!1, !1) }, bt = { get: /* @__PURE__ */ vt(!1, !0) }, xt = { get: /* @__PURE__ */ vt(!0, !1) }, St = /* @__PURE__ */ new WeakMap(), Ct = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), Tt = /* @__PURE__ */ new WeakMap();
function Et(e) {
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
function Dt(e) {
	return /* @__PURE__ */ Mt(e) ? e : At(e, !1, ut, yt, St);
}
// @__NO_SIDE_EFFECTS__
function Ot(e) {
	return At(e, !1, ft, bt, Ct);
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
	return At(e, !0, dt, xt, wt);
}
function At(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Et(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return /* @__PURE__ */ Mt(e) ? /* @__PURE__ */ jt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function U(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ U(t) : e;
}
function Ft(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && ne(e, "__v_skip", !0), e;
}
var It = (e) => v(e) ? /* @__PURE__ */ Dt(e) : e, Lt = (e) => v(e) ? /* @__PURE__ */ kt(e) : e;
// @__NO_SIDE_EFFECTS__
function W(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function G(e) {
	return Rt(e, !1);
}
function Rt(e, t) {
	return /* @__PURE__ */ W(e) ? e : new zt(e, t);
}
var zt = class {
	constructor(e, t) {
		this.dep = new Be(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ U(e), this._value = t ? e : It(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Nt(e) || /* @__PURE__ */ Mt(e);
		e = n ? e : /* @__PURE__ */ U(e), j(e, t) && (this._rawValue = e, this._value = n ? e : It(e), this.dep.trigger());
	}
};
function K(e) {
	return /* @__PURE__ */ W(e) ? e.value : e;
}
var Bt = {
	get: (e, t, n) => t === "__v_raw" ? e : K(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ W(i) && !/* @__PURE__ */ W(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Vt(e) {
	return /* @__PURE__ */ jt(e) ? e : new Proxy(e, Bt);
}
var Ht = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Be(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Re - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && V !== this) return we(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ae(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Ut(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Ht(r, i, n);
}
var Wt = {}, Gt = /* @__PURE__ */ new WeakMap(), Kt = void 0;
function qt(e, t = !1, n = Kt) {
	if (n) {
		let t = Gt.get(n);
		t || Gt.set(n, t = []), t.push(e);
	}
}
function Jt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Nt(e) || o === !1 || o === 0 ? Yt(e, 1) : Yt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ W(e) ? (g = () => e.value, y = /* @__PURE__ */ Nt(e)) : /* @__PURE__ */ jt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ jt(e) || /* @__PURE__ */ Nt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ W(e)) return e.value;
		if (/* @__PURE__ */ jt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Fe();
			try {
				_();
			} finally {
				Ie();
			}
		}
		let t = Kt;
		Kt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Kt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => Yt(e(), t);
	}
	let x = ve(), S = () => {
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
	let C = b ? Array(e.length).fill(Wt) : Wt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => j(e, C[t])) : j(t, C))) {
					let e = Kt;
					Fe();
					try {
						_ && _(), Kt = m;
						let e = [
							t,
							C === Wt ? void 0 : b && C[0] === Wt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Kt = e, Ie();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new be(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => qt(e, !1, m), _ = m.onStop = () => {
		let e = Gt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Gt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function Yt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ W(e)) Yt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Yt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Yt(e, t, n);
	});
	else if (C(e)) {
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
			Fe(), Xt(o, null, 10, [
				e,
				i,
				a
			]), Ie();
			return;
		}
	}
	$t(e, r, a, i, s);
}
function $t(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var q = [], en = -1, tn = [], nn = null, rn = 0, an = /* @__PURE__ */ Promise.resolve(), on = null;
function sn(e) {
	let t = on || an;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function cn(e) {
	let t = en + 1, n = q.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = q[r], a = gn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function ln(e) {
	if (!(e.flags & 1)) {
		let t = gn(e), n = q[q.length - 1];
		!n || !(e.flags & 2) && t >= gn(n) ? q.push(e) : q.splice(cn(t), 0, e), e.flags |= 1, un();
	}
}
function un() {
	on ||= an.then(_n);
}
function dn(e) {
	if (!d(e)) nn && e.id === -1 ? nn.splice(rn + 1, 0, e) : e.flags & 1 || (tn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) tn.push(e[t]);
	un();
}
function fn(e, t, n, r = en + 1) {
	for (; r < q.length; r++) {
		let n = q[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			q.splice(r, 1), r = e ? r - 1 : en, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function pn(e, t, n = 0) {
	if (tn.length) {
		let e = tn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < tn.length; i++) {
				let a = tn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? tn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => gn(e) - gn(t));
		if (tn.length = r, nn) {
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
	let n = t === void 0 ? void 0 : new Set(tn);
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
		for (en = 0; en < q.length; en++) {
			let e = q[en];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Xt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; en < q.length; en++) {
			let e = q[en];
			e && (e.flags &= -2);
		}
		en = -1, q.length = 0, pn(e), on = null, (q.length || tn.length) && _n(e);
	}
}
var vn = null, yn = null;
function bn(e) {
	let t = vn;
	return vn = e, yn = e && e.type.__scopeId || null, t;
}
function xn(e, t = vn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ci(-1);
		let i = bn(t), a = ii.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ii.length; e > a; e--) oi();
			bn(i), r._d && ci(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function J(e, n) {
	if (vn === null) return e;
	let r = Wi(vn), i = e.dirs ||= [];
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
function Sn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Fe(), Zt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ie());
	}
}
function Cn(e, t, n = !1) {
	let r = ji();
	if (r || pr) {
		let i = pr ? pr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var wn = /* @__PURE__ */ Symbol.for("v-scx"), Tn = () => Cn(wn);
function En(e, t, n) {
	return Dn(e, t, n);
}
function Dn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Li) {
		if (c === "sync") {
			let e = Tn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = Ai;
	u.call = (e, t, n) => Zt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		e.i = p, Y(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : ln(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Jt(e, n, u);
	return Li && (f ? f.push(h) : d && h()), h;
}
var On = /* @__PURE__ */ new WeakMap(), kn = /* @__PURE__ */ Symbol("_vte"), An = (e) => e.__isTeleport, jn = (e) => e && (e.disabled || e.disabled === ""), Mn = (e) => e && (e.defer || e.defer === ""), Nn = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Pn = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Fn = (e, t) => {
	let n = e && e.to;
	return g(n) ? t ? t(n) : null : n;
}, In = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = jn(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = jn(e.props), r = e.target = Fn(e.props, m), a = Vn(r, e, h, p);
			r && (o !== "svg" && Nn(r) ? o = "svg" : o !== "mathml" && Pn(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), Bn(e, !1)));
		}, S = (e) => {
			let t = () => {
				if (On.get(e) === t) {
					if (On.delete(e), jn(e.props)) {
						let t = _(e.el) || n;
						b(e, t, e.anchor), Bn(e, !0);
					}
					x(e);
				}
			};
			On.set(e, t), Y(t, a);
		};
		if (e == null) {
			let e = t.el = h(""), i = t.anchor = h("");
			if (p(e, n, r), p(i, n, r), Mn(t.props) || a && a.pendingBranch) {
				S(t);
				return;
			}
			v && (b(t, n, i), Bn(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = On.get(e);
			if (u) {
				u.flags |= 8, On.delete(e), S(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = jn(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || Nn(p) ? o = "svg" : (o === "mathml" || Pn(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), Jr(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Ln(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = Fn(t.props, m);
				e && (t.target = e, Ln(t, e, null, l, 0));
			} else g && Ln(t, p, h, l, 1);
			Bn(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = jn(f), m = a || !p, h = On.get(e);
		if (h && (h.flags |= 8, On.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, m, !!i.dynamicChildren);
		}
	},
	move: Ln,
	hydrate: Rn
};
function Ln(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && (e.targetStart && r(e.targetStart, t, n), r(e.targetAnchor, t, n), n = e.targetAnchor);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !On.has(e) && (!d || jn(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function Rn(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
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
	let m = t.target = Fn(t.props, c), h = jn(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || Vn(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || Vn(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), Bn(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var zn = In;
function Bn(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function Vn(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[kn] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var Hn = /* @__PURE__ */ Symbol("_leaveCb");
function Un(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ni) {
			t = n;
			break;
		}
	}
	return t;
}
function Wn(e) {
	if (!$n(e)) return An(e.type) && e.children ? Un(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Gn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Gn(An(n.type) && Wn(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === X && d(e.children)) {
		let n = yr(e.children, !1);
		n && Gn(n, t);
	}
}
function Kn(e) {
	if (e.component) return Kn(e.component.subTree);
	if (e.type === X) {
		let t = d(e.children) && yr(e.children, !1);
		return t ? Kn(t) : void 0;
	}
	if (e.type !== ni) return e;
}
function qn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Jn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Yn = /* @__PURE__ */ new WeakMap();
function Xn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Xn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Qn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Xn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Wi(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ U(v), b = v === t ? i : (e) => !Jn(_, e) && u(y, e), x = (e, t) => !(t && Jn(_, t));
	if (m != null && m !== p) {
		if (Zn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ W(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) Xt(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ W(p);
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
					i(), Yn.delete(e);
				};
				t.id = -1, Yn.set(e, t), Y(t, r);
			} else Zn(e), i();
		}
	}
}
function Zn(e) {
	let t = Yn.get(e);
	t && (t.flags |= 8, Yn.delete(e));
}
re().requestIdleCallback, re().cancelIdleCallback;
var Qn = (e) => !!e.type.__asyncLoader, $n = (e) => e.type.__isKeepAlive;
function er(e, t, n = Ai, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Fe();
			let i = Pi(n), a = Zt(t, n, e, r);
			return i(), Ie(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var tr = (e) => (t, n = Ai) => {
	Li && e !== "sp" || er(e, (...e) => t(...e), n);
}, nr = tr("m"), rr = tr("bum"), ir = /* @__PURE__ */ Symbol.for("v-ndc");
function ar(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ jt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Nt(e), s = /* @__PURE__ */ Mt(e), e = Je(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Lt(It(e[n])) : It(e[n]) : e[n], n, void 0, a && a[n]);
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
var or = (e) => e ? Ii(e) ? Wi(e) : or(e.parent) : null, sr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => or(e.parent),
	$root: (e) => or(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		ln(e.update);
	},
	$nextTick: (e) => e.n ||= sn.bind(e.proxy),
	$watch: (e) => r
}), cr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), lr = {
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
			else if (cr(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = sr[n], f, p;
		if (d) return n === "$attrs" && H(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return cr(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || cr(t, s) || u(a, s) || u(r, s) || u(sr, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ur() {
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
var dr = 0;
function fr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = ur(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: dr++,
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
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Wi(u.component);
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
				let t = pr;
				pr = l;
				try {
					return e();
				} finally {
					pr = t;
				}
			}
		};
		return l;
	};
}
var pr = null, mr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${O(t)}Modifiers`];
function hr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && mr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(N)));
	let c, l = i[c = A(n)] || i[c = A(E(n))];
	!l && o && (l = i[c = A(O(n))]), l && Zt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Zt(u, e, 6, a);
	}
}
function gr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function _r(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, O(t)) || u(e, t));
}
function vr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = bn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = xi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = xi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : br(c);
		}
	} catch (t) {
		ii.length = 0, Qt(t, e, 1), v = hi(ni);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = xr(y, a)), b = vi(b, y, !1, !0));
	}
	return n.dirs && (b = vi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Gn(An(b.type) && Wn(b) || b, n.transition), v = b, bn(_), v;
}
function yr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (di(r)) {
			if (r.type !== ni || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var br = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, xr = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function Sr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Cr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (wr(o, r, n) && !_r(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Cr(r, o, l) : !!o;
	return !1;
}
function Cr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!u(e, a) || wr(t, e, a) && !_r(n, a)) return !0;
	}
	return !1;
}
function wr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !L(r, i) : r !== i;
}
function Tr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Er = {}, Dr = () => Object.create(Er), Or = (e) => Object.getPrototypeOf(e) === Er;
function kr(e, t, n, r = !1) {
	let i = {}, a = Dr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), jr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Ot(i) : e.type.props ? i : a, e.attrs = a;
}
function Ar(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ U(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (_r(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = E(o);
						i[t] = Mr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		jr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = O(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Mr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && Ke(e.attrs, "set", "");
}
function jr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : _r(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ U(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Mr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Mr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Pi(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === O(n)) && (r = !0));
	}
	return r;
}
function Nr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = E(c[e]);
		Pr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = E(e);
		if (Pr(t)) {
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
function Pr(e) {
	return e[0] !== "$" && !T(e);
}
var Fr = (e) => e === "_" || e === "_ctx" || e === "$stable", Ir = (e) => d(e) ? e.map(xi) : [xi(e)], Lr = (e, t, n) => {
	if (t._n) return t;
	let r = xn((...e) => Ir(t(...e)), n);
	return r._c = !1, r;
}, Rr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Fr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Lr(n, i, r);
		else if (i != null) {
			let e = Ir(i);
			t[n] = () => e;
		}
	}
}, zr = (e, t) => {
	let n = Ir(t);
	e.slots.default = () => n;
}, Br = (e, t, n) => {
	for (let r in t) (n || !Fr(r)) && (e[r] = t[r]);
}, Vr = (e, t, n) => {
	let r = e.slots = Dr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Br(r, t, n), n && ne(r, "_", e, !0)) : Rr(t, r);
	} else t && zr(e, t);
}, Hr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Br(a, n, r) : (o = !n.$stable, Rr(n, a)), s = n;
	} else n && (zr(e, n), s = { default: 1 });
	if (o) for (let e in a) !Fr(e) && s[e] == null && delete a[e];
}, Y = ei;
function Ur(e) {
	return Wr(e);
}
function Wr(e, i) {
	let a = re();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !fi(e, t) && (i = fe(e), I(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case ti:
				y(e, t, r, i);
				break;
			case ni:
				b(e, t, r, i);
				break;
			case ri:
				e ?? x(t, r, i, s);
				break;
			case X:
				A(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? j(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, L);
		}
		d != null && a ? Xn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Xn(e.ref, null, o, e, !0);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) ee(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), D(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, Gr(e, a), s, u), _ && Sn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Ti(f, r, e);
		}
		_ && Sn(e, null, r, "beforeMount");
		let v = qr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && Y(() => {
			try {
				f && Ti(f, r, e), v && g.enter(d), _ && Sn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || $r(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Si(e[l]) : xi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Kr(r, !1), (g = h.onVnodeBeforeUpdate) && Ti(g, r, n, e), f && Sn(n, e, r, "beforeUpdate"), r && Kr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, r, i, Gr(n, a), o) : s || ae(e, n, l, null, r, i, Gr(n, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && Y(() => {
			g && Ti(g, r, n, e), f && Sn(n, e, r, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Qr(c), d = u && (c.type === X || !fi(c, l) || c.shapeFlag & 198) ? m(u) : n;
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
	}, A = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Jr(e, t, !0)) : ae(e, t, n, f, i, a, s, c, l);
	}, j = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ne(t, n, r, i, a, o, c) : N(e, t, c);
	}, ne = (e, t, n, r, i, a, o) => {
		let s = e.component = ki(e, r, i);
		if ($n(e) && (s.ctx.renderer = L), Ri(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, P, o, a), !e.el) {
				let r = s.subTree = hi(ni);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else P(s, e, t, n, i, a, o);
	}, N = (e, t, n) => {
		let r = t.component = e.component;
		if (Sr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ie(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, P = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Xr(e);
					if (n) {
						t && (t.el = c.el, ie(e, t, o)), n.asyncDep.then(() => {
							Y(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Kr(e, !1), t ? (t.el = c.el, ie(e, t, o)) : t = c, n && M(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ti(d, s, t, c), Kr(e, !0);
				let f = vr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), fe(p), e, i, a), t.el = f.el, u === null && Tr(e, f.el), r && Y(r, i), (d = t.props && t.props.onVnodeUpdated) && Y(() => Ti(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Qn(t);
				if (Kr(e, !1), l && M(l), !m && (o = c && c.onVnodeBeforeMount) && Ti(o, d, t), Kr(e, !0), s && me) {
					let t = () => {
						e.subTree = vr(e), me(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = vr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Y(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Y(() => Ti(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Qn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Y(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new be(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => ln(u), Kr(e, !0), l();
	}, ie = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ar(e, t.props, r, n), Hr(e, t.children, n), Fe(), fn(e), Ie();
	}, ae = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				oe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				F(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && de(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? oe(l, d, n, r, i, a, o, s, c) : de(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, F = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? Si(t[p]) : xi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? de(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, oe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Si(t[u]) : xi(t[u]);
			if (fi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Si(t[p]) : xi(t[p]);
			if (fi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Si(t[u]) : xi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) I(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Si(t[u]) : xi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					I(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && fi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? I(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Yr(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Qr(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? se(n, r, p, 2) : _--);
			}
		}
	}, se = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) se(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, L);
		else if (c === X) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) se(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === ri) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Hn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), Y(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Hn];
					a._isLeaving && a[Hn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, I = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Fe(), Xn(s, null, n, e, !0), Ie()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Qn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ti(_, t, e), u & 6) ue(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Sn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, L, r) : l && !l.hasOnce && (a !== X || d > 0 && d & 64) ? de(l, t, n, !1, !0) : (a === X && d & 384 || !i && u & 16) && de(c, t, n), r && ce(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Y(() => {
			_ && Ti(_, t, e), h && Sn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ce = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === X;
		if (a && !i) {
			le(n, r);
			return;
		}
		if (t === ri) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Kn(e) : e, c = () => {
			a ? m(n) && le(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, le = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ue = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Zr(c), Zr(l), r && M(r), i.stop(), a ? (a.flags |= 8, I(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, I(o, e, t, n)), s && Y(s, t), Y(() => {
			e.isUnmounted = !0;
		}, t);
	}, de = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) I(e[o], t, n, r, i);
	}, fe = (e) => {
		if (e.shapeFlag & 6) return fe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[kn];
		return n ? h(n) : t;
	}, pe = (e, t, n) => {
		hn(() => {
			e == null ? t._vnode && I(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Oi());
	}, L = {
		p: v,
		um: I,
		m: se,
		r: ce,
		mt: ne,
		mc: E,
		pc: ae,
		pbc: O,
		n: fe,
		o: e
	}, R, me;
	return i && ([R, me] = i(L)), {
		render: pe,
		hydrate: R,
		createApp: fr(pe, R)
	};
}
function Gr({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Kr({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function qr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Jr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Si(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Jr(t, a)), a.type === ti && (a.patchFlag === -1 && (a = i[e] = Si(a)), a.el = t.el), a.type === ni && !a.el && (a.el = t.el);
	}
}
function Yr(e) {
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
function Xr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Xr(t);
}
function Zr(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Qr(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Qr(t.subTree) : null;
}
var $r = (e) => e.__isSuspense;
function ei(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : dn(e);
}
var X = /* @__PURE__ */ Symbol.for("v-fgt"), ti = /* @__PURE__ */ Symbol.for("v-txt"), ni = /* @__PURE__ */ Symbol.for("v-cmt"), ri = /* @__PURE__ */ Symbol.for("v-stc"), ii = [], ai = null;
function Z(e = !1) {
	ii.push(ai = e ? null : []);
}
function oi() {
	ii.pop(), ai = ii[ii.length - 1] || null;
}
var si = 1;
function ci(e, t = !1) {
	si += e, e < 0 && ai && t && (ai.hasOnce = !0);
}
function li(e) {
	return e.dynamicChildren = si > 0 ? ai || n : null, oi(), si > 0 && ai && ai.push(e), e;
}
function Q(e, t, n, r, i, a) {
	return li($(e, t, n, r, i, a, !0));
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
var pi = ({ key: e }) => e ?? null, mi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ W(e) || h(e) ? {
	i: vn,
	r: e,
	k: t,
	f: !!n
} : e);
function $(e, t = null, n = null, r = 0, i = null, a = e === X ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && pi(t),
		ref: t && mi(t),
		scopeId: yn,
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
		ctx: vn
	};
	return s ? (Ci(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), si > 0 && !o && ai && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && ai.push(c), c;
}
var hi = gi;
function gi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== ir || (e = ni), di(e)) {
		let r = vi(e, t, !0);
		return n && Ci(r, n), si > 0 && !a && ai && (r.shapeFlag & 6 ? ai[ai.indexOf(e)] = r : ai.push(r)), r.patchFlag = -2, r;
	}
	if (Gi(e) && (e = e.__vccOpts), t) {
		t = _i(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = I(e)), v(n) && (/* @__PURE__ */ Pt(n) && !d(n) && (n = s({}, n)), t.style = ie(n));
	}
	let o = g(e) ? 1 : $r(e) ? 128 : An(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return $(e, t, n, r, i, o, a, !0);
}
function _i(e) {
	return e ? /* @__PURE__ */ Pt(e) || Or(e) ? s({}, e) : e : null;
}
function vi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? wi(i || {}, t) : i, u = {
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
		patchFlag: t && e.type !== X ? o === -1 ? 16 : o | 16 : o,
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
	return c && r && Gn(u, c.clone(u)), u;
}
function yi(e = " ", t = 0) {
	return hi(ti, null, e, t);
}
function bi(e = "", t = !1) {
	return t ? (Z(), ui(ni, null, e)) : hi(ni, null, e);
}
function xi(e) {
	return e == null || typeof e == "boolean" ? hi(ni) : d(e) ? hi(X, null, e.slice()) : di(e) ? Si(e) : hi(ti, null, String(e));
}
function Si(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : vi(e);
}
function Ci(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ci(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Or(t) ? t._ctx = vn : r === 3 && vn && (vn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			Ci(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: vn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [yi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function wi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = I([t.class, r.class]));
		else if (e === "style") t.style = ie([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ti(e, t, n, r = null) {
	Zt(e, t, 7, [n, r]);
}
var Ei = ur(), Di = 0;
function Oi() {
	return Di;
}
function ki(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Ei, o = {
		uid: Di++,
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
		scope: new _e(!0),
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
		propsOptions: Nr(i, a),
		emitsOptions: gr(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = hr.bind(null, o), e.ce && e.ce(o), o;
}
var Ai = null, ji = () => Ai || vn, Mi, Ni;
{
	let e = re(), t = (t, n) => {
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
	kr(e, r, a, t), Vr(e, i, n || t);
	let o = a ? zi(e, t) : void 0;
	return t && Ni(!1), o;
}
function zi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, lr);
	let { setup: r } = n;
	if (r) {
		Fe();
		let n = e.setupContext = r.length > 1 ? Ui(e) : null, i = Pi(e), a = Xt(r, e, 0, [e.props, n]), o = y(a);
		if (Ie(), i(), (o || e.sp) && !Qn(e) && qn(e), o) {
			if (a.then(Fi, Fi), t) return a.then((n) => {
				Ni(!0);
				try {
					Bi(e, n, t);
				} finally {
					Ni(!1);
				}
			}).catch((t) => {
				Qt(t, e, 0);
			});
			e.asyncDep = a;
		} else Bi(e, a, t);
	} else Vi(e, t);
}
function Bi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Vt(t)), Vi(e, n);
}
function Vi(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var Hi = { get(e, t) {
	return H(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Vt(Ft(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in sr) return sr[n](e);
		},
		has(e, t) {
			return t in e || t in sr;
		}
	}) : e.proxy;
}
function Gi(e) {
	return h(e) && "__vccOpts" in e;
}
var Ki = (e, t) => /* @__PURE__ */ Ut(e, t, Li), qi = "3.5.44", Ji = void 0, Yi = typeof window < "u" && window.trustedTypes;
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
var ia = /* @__PURE__ */ Symbol("_vod"), aa = /* @__PURE__ */ Symbol("_vsh"), oa = /* @__PURE__ */ Symbol(""), sa = /(?:^|;)\s*display\s*:/;
function ca(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? ua(r, t, "");
			}
			else for (let e in t) n[e] ?? ua(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ua(r, i, "") : ma(e, i, !g(t) && t ? t[i] : void 0, o) || ua(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[oa];
			e && (n += ";" + e), r.cssText = n, a = sa.test(n);
		}
	} else t && e.removeAttribute("style");
	ia in e && (i && t === n || (e[ia] = a ? r.display : ""), e[aa] && (r.display = "none"));
}
var la = /\s*!important$/;
function ua(e, t, n) {
	if (d(n)) n.forEach((n) => ua(e, t, n));
	else if (n ??= "", t.startsWith("--")) la.test(n) ? e.setProperty(t, n.replace(la, ""), "important") : e.setProperty(t, n);
	else {
		let r = pa(e, t);
		la.test(n) ? e.setProperty(O(r), n.replace(la, ""), "important") : e[r] = n;
	}
}
var da = [
	"Webkit",
	"Moz",
	"ms"
], fa = {};
function pa(e, t) {
	let n = fa[t];
	if (n) return n;
	let r = E(t);
	if (r !== "filter" && r in e) return fa[t] = r;
	r = k(r);
	for (let n = 0; n < da.length; n++) {
		let i = da[n] + r;
		if (i in e) return fa[t] = i;
	}
	return t;
}
function ma(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var ha = "http://www.w3.org/1999/xlink";
function ga(e, t, n, r, i, a = ce(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ha, t.slice(6, t.length)) : e.setAttributeNS(ha, t, n) : n == null || a && !le(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function _a(e, t, n, r, i) {
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
		r === "boolean" ? n = le(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function va(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function ya(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var ba = /* @__PURE__ */ Symbol("_vei");
function xa(e, t, n, r, i = null) {
	let a = e[ba] || (e[ba] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = wa(t);
		r ? va(e, n, a[t] = Oa(r, i), s) : o && (ya(e, n, o, s), a[t] = void 0);
	}
}
var Sa = /(Once|Passive|Capture)$/, Ca = /^on:?(?:Once|Passive|Capture)$/;
function wa(e) {
	let t, n;
	for (; (n = e.match(Sa)) && !Ca.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : O(e.slice(2)), t];
}
var Ta = 0, Ea = /* @__PURE__ */ Promise.resolve(), Da = () => Ta ||= (Ea.then(() => Ta = 0), Date.now());
function Oa(e, t) {
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
	return n.value = e, n.attached = Da(), n;
}
var ka = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Aa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? ra(e, r, c) : t === "style" ? ca(e, n, r) : a(t) ? o(t) || xa(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ja(e, t, r, c)) ? (_a(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || ga(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ma(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? _a(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ga(e, t, r, c));
};
function ja(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && ka(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return ka(t) && g(n) ? !1 : t in e;
}
function Ma(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var Na = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => M(t, e) : t;
};
function Pa(e) {
	e.target.composing = !0;
}
function Fa(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Ia = /* @__PURE__ */ Symbol("_assign"), La = /* @__PURE__ */ Symbol("_initialValue");
function Ra(e, t, n) {
	return t && (e = e.trim()), n && (e = N(e)), e;
}
var za = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[La] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[La] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Ia] = Na(i);
		let a = r || i.props && i.props.type === "number";
		va(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Ia](Ra(e.value, n, a));
		}), (n || a) && va(e, "change", () => {
			e.value = Ra(e.value, n, a);
		}), t || (va(e, "compositionstart", Pa), va(e, "compositionend", Fa), va(e, "change", Fa));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[La];
		delete e[La], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Ia](Ra(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Ia] = Na(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? N(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Ba = {
	deep: !0,
	created(e, t, n) {
		e[Ia] = Na(n), va(e, "change", () => {
			let t = e._modelValue, n = Ga(e), r = e.checked, i = e[Ia];
			if (d(t)) {
				let e = R(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (p(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Ka(e, r));
		});
	},
	mounted: Va,
	beforeUpdate(e, t, n) {
		e[Ia] = Na(n), Va(e, t, n);
	}
};
function Va(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = R(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = L(t, Ka(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Ha = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, va(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? N(Ga(e)) : Ga(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[Ia](i);
			} finally {
				sn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Ia] = Na(r);
	},
	mounted(e, { value: t }) {
		Wa(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Ia] = Na(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && Ua(t, n[1], n[0]) || Wa(e, t);
	}
};
function Ua(e, t, n) {
	if (!n || d(e)) return L(e, t);
	if (p(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Wa(e, t) {
	let n = e.multiple, r = d(t);
	if (!n || r || p(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Ga(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : R(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (L(Ga(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Ga(e) {
	return "_value" in e ? e._value : e.value;
}
function Ka(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var qa = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Ja = {
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
	exact: (e, t) => qa.some((n) => e[`${n}Key`] && !t.includes(n))
}, Ya = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Ja[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Xa = /* @__PURE__ */ s({ patchProp: Aa }, ta), Za;
function Qa() {
	return Za ||= Ur(Xa);
}
var $a = ((...e) => {
	let t = Qa().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = to(e);
		if (!r) return;
		let i = t._component;
		h(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, eo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function eo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function to(e) {
	return g(e) ? document.querySelector(e) : e;
}
// admin/src/ClassroomFileSettings.vue
var no = {
	class: "panel",
	"data-files-settings": ""
}, ro = { key: 0 }, io = ["disabled"], ao = {
	key: 1,
	role: "status"
}, oo = {
	key: 2,
	role: "status",
	"data-files-settings-feedback": ""
}, so = ["disabled"], co = {
	type: "submit",
	"data-files-settings-save": ""
}, lo = {
	__name: "ClassroomFileSettings",
	props: {
		t: Function,
		authorized: Boolean,
		canWrite: Boolean
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ G(!1), r = /* @__PURE__ */ G(!1), i = /* @__PURE__ */ G(!1), a = /* @__PURE__ */ G(!1), o = /* @__PURE__ */ G(""), s = /* @__PURE__ */ G(null), c = /* @__PURE__ */ Dt({
			max: 50,
			group: 500,
			student: 50,
			upload: !0
		}), l = 0, u = null, d = (e) => ((e || 0) / 1048576).toLocaleString(void 0, { maximumFractionDigits: 2 });
		function f() {
			l++, u?.abort(), a.value = !1, r.value = !1, i.value = !1, o.value = "", s.value = null;
		}
		En(() => t.authorized, (e) => {
			f(), e && n.value && h();
		});
		async function p(e = {}) {
			u?.abort(), u = new AbortController();
			let t = await fetch("/api/admin/files/settings", {
				credentials: "same-origin",
				cache: "no-store",
				signal: u.signal,
				...e
			});
			if (!t.ok) throw Error("files_settings_failed");
			return t.json();
		}
		function m(e) {
			if (!e.settings) throw Error("invalid_files_settings");
			c.max = e.settings.max_file_bytes / 1048576, c.group = e.settings.group_quota_bytes / 1048576, c.student = e.settings.student_quota_bytes / 1048576, c.upload = e.settings.students_can_upload, s.value = e, a.value = !0;
		}
		async function h() {
			if (!t.authorized || i.value || r.value) return;
			let e = l;
			r.value = !0, o.value = "";
			try {
				let t = await p();
				e === l && m(t);
			} catch {
				e === l && (a.value = !1, o.value = "filesSettings.error");
			} finally {
				e === l && (r.value = !1);
			}
		}
		async function g() {
			if (!t.canWrite || i.value || r.value || !a.value) return;
			if (c.student > c.group || c.max > c.group) {
				o.value = "filesSettings.invalid";
				return;
			}
			let e = l;
			i.value = !0, o.value = "";
			try {
				let t = await p({
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						"X-Commons-Files": "1"
					},
					body: JSON.stringify({
						max_file_bytes: Math.round(c.max * 1048576),
						group_quota_bytes: Math.round(c.group * 1048576),
						student_quota_bytes: Math.round(c.student * 1048576),
						students_can_upload: c.upload
					})
				});
				e === l && (m(t), o.value = "filesSettings.saved");
			} catch {
				e === l && (o.value = "filesSettings.error");
			} finally {
				e === l && (i.value = !1);
			}
		}
		function _(e) {
			n.value = e.target.open, n.value && !a.value && h();
		}
		return rr(f), (t, n) => (Z(), Q("section", no, [$("details", { onToggle: _ }, [
			$("summary", null, [$("strong", null, z(e.t("filesSettings.title")), 1)]),
			$("p", null, z(e.t("filesSettings.help")), 1),
			e.authorized ? bi("", !0) : (Z(), Q("p", ro, z(e.t("filesSettings.signIn")), 1)),
			$("button", {
				type: "button",
				class: "secondary",
				"data-files-settings-refresh": "",
				disabled: !e.authorized || r.value || i.value,
				onClick: h
			}, z(e.t("login.refresh")), 9, io),
			r.value ? (Z(), Q("p", ao, z(e.t("filesSettings.loading")), 1)) : bi("", !0),
			o.value ? (Z(), Q("p", oo, z(e.t(o.value)), 1)) : bi("", !0),
			e.authorized && a.value ? (Z(), Q("form", {
				key: 3,
				onSubmit: Ya(g, ["prevent"])
			}, [$("fieldset", {
				disabled: !e.canWrite || r.value || i.value,
				class: "teacher-fields"
			}, [
				$("label", null, [yi(z(e.t("filesSettings.max")), 1), J($("input", {
					"onUpdate:modelValue": n[0] ||= (e) => c.max = e,
					"data-files-max": "",
					type: "number",
					min: "0.001",
					max: "100",
					step: "0.001",
					required: ""
				}, null, 512), [[
					za,
					c.max,
					void 0,
					{ number: !0 }
				]])]),
				$("label", null, [yi(z(e.t("filesSettings.group")), 1), J($("input", {
					"onUpdate:modelValue": n[1] ||= (e) => c.group = e,
					"data-files-group": "",
					type: "number",
					min: "0.001",
					max: "100000",
					step: "0.001",
					required: ""
				}, null, 512), [[
					za,
					c.group,
					void 0,
					{ number: !0 }
				]])]),
				$("label", null, [yi(z(e.t("filesSettings.student")), 1), J($("input", {
					"onUpdate:modelValue": n[2] ||= (e) => c.student = e,
					"data-files-student": "",
					type: "number",
					min: "0.001",
					max: "100000",
					step: "0.001",
					required: ""
				}, null, 512), [[
					za,
					c.student,
					void 0,
					{ number: !0 }
				]])]),
				$("label", null, [J($("input", {
					"onUpdate:modelValue": n[3] ||= (e) => c.upload = e,
					"data-files-upload": "",
					type: "checkbox"
				}, null, 512), [[Ba, c.upload]]), yi(z(e.t("filesSettings.allowUpload")), 1)]),
				$("button", co, z(e.t("filesSettings.save")), 1)
			], 8, so), $("p", null, z(e.t("filesSettings.usage", {
				used: d(s.value.usage.total_bytes),
				free: d(s.value.disk_free_bytes),
				count: s.value.usage.files
			})), 1)], 32)) : bi("", !0)
		], 32)]));
	}
};
// admin/src/format.js
function uo(e) {
	function t(t, n) {
		return `- ${t}: ${n.reachable ? "OK" : e("status.notResponding")} (${n.detail})`;
	}
	function n(t) {
		if (t.error) return `  - ${t.name}: ${t.error}`;
		let n = t.warnings && t.warnings.length ? ` | ${e("backup.warnings")}: ${t.warnings.join("; ")}` : "";
		return `  - ${t.name} (${t.created_at}, v${t.stack_version})${n}`;
	}
	function r(e, t) {
		return e.error ? `ERROR: ${e.error}` : e[t] || "?";
	}
	function i(i) {
		let a = [];
		a.push(e("status.stackVersion", { version: i.stack_version })), a.push(e("status.imagesLine", {
			registry: i.image_registry,
			tag: i.image_tag,
			eduhoot: i.eduhoot_tag
		})), a.push(e("status.updateChannel", { channel: i.update_channel || "testing" })), a.push(e("status.activeProfiles", { profiles: i.active_profiles.length ? i.active_profiles.join(", ") : e("status.none") })), a.push(""), a.push(e("status.services")), Object.entries(i.services).forEach(([e, n]) => {
			a.push(t(e, n));
		}), a.push(""), i.last_backup ? a.push(e("status.lastBackup", {
			name: i.last_backup.name,
			date: i.last_backup.created_at
		})) : a.push(e("status.lastBackupNone")), i.coverage_warnings && i.coverage_warnings.length && a.push(e("status.coverageWarnings", { warnings: i.coverage_warnings.join("; ") })), a.push(""), a.push(e("status.backupsAvailable", { count: i.backups.length })), i.backups.forEach((e) => a.push(n(e))), a.push("");
		let o = i.backup_timer.timer || {}, s = i.backup_timer.service || {};
		return a.push(e("status.backupTimer")), a.push(`  ${e("status.unitFileState")} ${r(o, "UnitFileState")}`), a.push(`  ${e("status.activeStateTimer")} ${r(o, "ActiveState")}`), a.push(`  ${e("status.lastRun")} ${r(o, "LastTriggerUSec")}`), a.push(`  ${e("status.nextRun")} ${r(o, "NextElapseUSecRealtime")}`), a.push(`  ${e("status.activeStateService")} ${r(s, "ActiveState")}`), a.push(`  ${e("status.lastRunResult")} ${r(s, "Result")}`), a.push(e("status.checkedAt", { date: i.checked_at })), a.join("\n");
	}
	function a(t) {
		let n = [];
		return n.push(`${e("status.registryLine")} ${t.registry}`), n.push(`${e("status.channelLine")} ${t.channel}`), [
			"commons",
			"eduhoot",
			"recursos"
		].forEach((r) => {
			let i = t[r];
			i && (n.push(""), n.push(`${r}:`), i.error ? n.push(`  ERROR: ${i.error}`) : (n.push(`  ${e("status.installed")} ${i.current || "-"}`), n.push(`  ${e("status.available")} ${i.candidate || "-"}`), n.push(`  ${e("status.updateAvailable")} ${i.update_available ? e("status.yes") : e("status.no")}`)));
		}), n.join("\n");
	}
	return {
		renderStatus: i,
		renderUpdateStatus: a
	};
}
// admin/src/useAdmin.js
var fo = [
	"play",
	"eduhoot",
	"recursos",
	"blocs",
	"llibres",
	"quiosc"
], po = {
	"commons-modules-job": /^edutictac-commons-modules-\d{14}-[a-f0-9]{8}$/,
	"commons-backup-job": /^edutictac-commons-(?:backup-\d{14}-[a-f0-9]{8}|restore-\d{14})$/,
	"commons-images-job": /^edutictac-commons-(?:update|rollback)-\d{14}$/,
	"commons-config-job": /^edutictac-commons-config-\d{14}-[a-f0-9]{8}$/
};
function mo() {
	let e = location.pathname.startsWith("/admin/") ? "/admin" : "", t = /* @__PURE__ */ G(window.i18nAdmin.getLang()), n = (e, n) => (t.value, window.i18nAdmin.t(e, n)), { renderStatus: r, renderUpdateStatus: i } = uo(n), a = /* @__PURE__ */ G(!1), o = /* @__PURE__ */ G(!1), s = /* @__PURE__ */ G(!1), c = /* @__PURE__ */ G(!1), l = /* @__PURE__ */ G(!0), u = /* @__PURE__ */ G(null), d = /* @__PURE__ */ G(null), f = /* @__PURE__ */ G([]), p = /* @__PURE__ */ G(""), m = /* @__PURE__ */ G(""), h = /* @__PURE__ */ G(""), g = /* @__PURE__ */ G(), _ = /* @__PURE__ */ G(!1), v = /* @__PURE__ */ G(!1), y = /* @__PURE__ */ G("status.checking"), b = /* @__PURE__ */ G(""), x = /* @__PURE__ */ G({ key: "common.actionPlaceholder" }), S = /* @__PURE__ */ G(""), C = /* @__PURE__ */ Dt({
		username: "",
		name: "",
		email: ""
	}), w = /* @__PURE__ */ G(null), T = /* @__PURE__ */ G(""), ee = /* @__PURE__ */ G(!1), te = /* @__PURE__ */ G(""), E = /* @__PURE__ */ G(""), D = /* @__PURE__ */ G(null), O = /* @__PURE__ */ G(!1), k = 0, A = 0, j = 0, M = 0, ne = 0, N = 0, P = /* @__PURE__ */ G(null), re = /* @__PURE__ */ G(!1), ie = Ki(() => O.value ? "paused" : re.value ? "polling" : P.value === null ? "idle" : "waiting"), ae = Ki(() => s.value || !!D.value || d.value?.phase === "applying"), F = Ki(() => l.value && a.value && !ae.value), oe = Ki(() => !!d.value?.manageable), se = Ki(() => !!d.value?.backup_key_required), I = Ki(() => !se.value || !!d.value?.backup_key_configured), ce = Ki(() => (u.value?.backups || []).filter((e) => !e.error)), le = Ki(() => ce.value.filter((e) => e.update)), ue = Ki(() => u.value?.backup_secondary || {
		enabled: !1,
		mount: "",
		last: {}
	}), de = Ki(() => b.value ? n(b.value) : u.value ? r(u.value) : n("status.signInToView")), fe = Ki(() => x.value.log === void 0 ? x.value.updates ? i(x.value.updates) : x.value.key ? n(x.value.key, x.value.vars) : x.value.text || "" : x.value.log + "\n\n" + n(x.value.key)), pe = Ki(() => n(p.value || (a.value ? d.value ? oe.value ? ae.value ? "modules.applying" : d.value.error ? "modules.failed" : d.value.configured ? "modules.ready" : "modules.firstHint" : "modules.updateInstaller" : "modules.unavailable" : "modules.signIn"))), L = Ki(() => {
		if (!a.value) return "";
		let e = ue.value, t = e.last || {}, r = t.error === "invalid_configuration" ? "failed" : e.enabled ? t.result || "ready" : "disabled", i = [
			n(`secondary.state.${r}`),
			t.backup || "",
			t.checked_at || ""
		];
		if (r === "failed" && t.error) {
			let e = `secondary.error.${t.error}`;
			i.push(n(e) === e ? n("secondary.error.copy_failed") : n(e));
		}
		return i.filter(Boolean).join(" · ");
	});
	function R(e, t) {
		try {
			t === null ? sessionStorage.removeItem(e) : sessionStorage.setItem(e, t);
		} catch {}
	}
	function me() {
		for (let [e, t] of Object.entries(po)) {
			let n;
			try {
				n = sessionStorage.getItem(e);
			} catch {
				return null;
			}
			if (n) {
				if (t.test(n)) return {
					key: e,
					unit: n,
					startedAt: Date.now()
				};
				R(e, null);
			}
		}
		return null;
	}
	function z() {
		w.value = null, C.username = "", C.name = "", C.email = "", S.value = "";
	}
	function he() {
		g.value?.close(), _.value = !1, v.value = !0;
	}
	function ge() {
		++k, ++A, ++j, ++M, a.value = !1, s.value = !1, x.value = { key: "common.actionPlaceholder" }, u.value = null, d.value = null, f.value = [], z(), te.value = "", E.value = "", T.value = "", ee.value = !1, b.value = "", p.value = "", he();
	}
	async function B(t, n = {}, r = () => !0) {
		let i = k, a = N, o = await fetch(e + t, {
			credentials: "same-origin",
			cache: "no-store",
			...n
		});
		if (o.status === 401 || o.status === 403) {
			i === k && a === N && l.value && r() && (ge(), y.value = "status.authRequired");
			let e = /* @__PURE__ */ Error("unauthorized");
			throw e.status = o.status, e;
		}
		let s = await o.json();
		if (!o.ok) {
			let e = Error(s.output || s.error || "operation_failed");
			throw e.status = o.status, e;
		}
		return s;
	}
	function _e(e, t = !1) {
		x.value = {
			key: e,
			error: t
		};
	}
	async function ve() {
		if (!a.value || !l.value) return;
		let e = k, t = ++j;
		try {
			let n = await B("/api/modules", {}, () => t === j);
			if (e !== k || t !== j || !l.value) return;
			d.value && n.revision === d.value.revision && n.phase !== "failed" || (f.value = fo.filter((e) => n.enabled?.includes(e))), d.value = n, p.value = "", n.backup_key_configured && !n.backup_key_required && h.value === "modules.backupSaving" && (h.value = "modules.backupSaved"), n.manageable && !n.configured && !ae.value && !v.value && (_.value = !0);
		} catch {
			e === k && t === j && (d.value = null, p.value = "modules.unavailable");
		}
	}
	async function V() {
		if (!l.value) return;
		let e = k, t = ++A;
		o.value = !0;
		try {
			let n = await B("/api/status", {}, () => t === A);
			if (e !== k || t !== A || !l.value) return;
			a.value = !0, u.value = n, b.value = "", y.value = "status.connected", ce.value.some((e) => e.name === te.value) || (te.value = ce.value[0]?.name || ""), le.value.some((e) => e.name === E.value) || (E.value = le.value[0]?.name || ""), ee.value || (T.value = ue.value.mount || ""), await ve(), D.value && !re.value && P.value === null && be();
		} catch {
			e === k && t === A && (ge(), y.value = "status.disconnected", b.value = "admin.loadError");
		} finally {
			t !== A && a.value || (o.value = !1);
		}
	}
	function ye() {
		P.value !== null && clearTimeout(P.value), P.value = null;
	}
	function be() {
		ye(), l.value && D.value && !O.value && (P.value = setTimeout(xe, 3e3));
	}
	async function xe() {
		if (re.value || !D.value || !l.value) return;
		re.value = !0, P.value = null;
		let e = D.value, t = N, n = A, r = () => t === N && l.value && D.value === e;
		try {
			let i = await B("/api/job-status?unit=" + encodeURIComponent(e.unit), {}, () => r() && n === A);
			if (!r()) return;
			ne = 0, i.running ? (x.value = {
				log: i.log || "",
				key: "job.running"
			}, Date.now() - e.startedAt > Se(e) ? Ce() : be()) : (R(e.key, null), D.value = me(), x.value = {
				log: i.log || "",
				key: i.result === "success" ? "job.success" : "job.failed",
				error: i.result !== "success"
			}, e.key === "commons-config-job" && i.result !== "success" && (h.value = "backup.key.save_failed"), await V(), (r() || t === N && l.value && D.value) && be());
		} catch {
			if (!r()) return;
			ne++, Date.now() - e.startedAt > Se(e) || e.key !== "commons-backup-job" && ne > 30 ? Ce() : (_e("job.reconnecting"), be());
		} finally {
			t === N && (re.value = !1);
		}
	}
	function Se(e) {
		return e.key === "commons-backup-job" ? 18e5 : 6e5;
	}
	function Ce() {
		O.value = !0, _e("job.timeout", !0);
	}
	function we() {
		D.value && !s.value && (D.value = {
			...D.value,
			startedAt: Date.now()
		}, ne = 0, O.value = !1, be());
	}
	function Te(e, t) {
		if (!po[t]?.test(e)) throw Error("invalid_job");
		D.value = {
			unit: e,
			key: t,
			startedAt: Date.now()
		}, R(t, e), O.value = !1, ne = 0, be();
	}
	async function Ee(e, t = {}, r = null) {
		if (!F.value) return;
		s.value = !0, w.value = null;
		let i = k, a = ++M;
		_e("common.executing");
		try {
			let o = await B(e, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...e === "/api/modules" ? { "X-Commons-Modules": "1" } : e.startsWith("/api/backup/") ? { "X-Commons-Backup": "1" } : {}
				},
				body: JSON.stringify(t)
			});
			if (i !== k || a !== M || !l.value) return;
			if (!o.ok) throw Error(o.output || "operation_failed");
			r ? (Te(o.unit, r), r === "commons-modules-job" && he()) : (x.value = { text: o.output || n("job.success") }, await V());
		} catch (t) {
			if (i !== k || a !== M || !l.value) return;
			if (e === "/api/modules") {
				if (await ve(), i !== k) return;
				let e = [
					"configuration_changed",
					"operation_busy",
					"quiosc_not_prepared",
					"host_runner_unavailable",
					"backup_key_required"
				].includes(t.message) ? "modules.error." + t.message : "modules.failed";
				p.value = e, _e(e, !0);
			} else _e("admin.operationError", !0);
		} finally {
			a === M && (s.value = !1);
		}
	}
	function De() {
		if (oe.value && F.value && I.value) return Ee("/api/modules", {
			enabled: fo.filter((e) => f.value.includes(e)),
			revision: d.value.revision
		}, "commons-modules-job");
	}
	async function Oe() {
		let e = m.value.trim();
		if (!F.value || !e) return;
		s.value = !0, h.value = "modules.backupSaving";
		let t = k, n = ++M;
		try {
			let r = await B("/api/backup/key", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Commons-Backup": "1"
				},
				body: JSON.stringify({ recipient: e })
			});
			if (t !== k || n !== M || !l.value) return;
			if (!r.ok) throw Error(r.output || "backup_key_save_failed");
			m.value = "", Te(r.unit, "commons-config-job");
		} catch (e) {
			t === k && n === M && l.value && (h.value = e.message === "invalid_recipient" ? "backup.key.invalid_recipient" : "backup.key.save_failed");
		} finally {
			n === M && (s.value = !1);
		}
	}
	async function ke() {
		if (!F.value) return;
		let e = Object.fromEntries(Object.entries(C).map(([e, t]) => [e, t.trim()]));
		if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,149}$/.test(e.username) || !e.name) return;
		s.value = !0, w.value = null, S.value = "teachers.creating";
		let t = k, n = ++M;
		try {
			let n = await B("/api/teachers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(e)
			});
			if (t !== k || !l.value) return;
			if (!n.teacher?.username || !n.teacher?.temporary_password) throw Error("invalid_teacher");
			z(), w.value = {
				username: n.teacher.username,
				password: n.teacher.temporary_password
			};
		} catch {
			t === k && l.value && (S.value = "admin.teacherError");
		} finally {
			n === M && (s.value = !1);
		}
	}
	async function Ae() {
		if (!F.value) return;
		s.value = !0, _e("images.checking");
		let e = k, t = ++M;
		try {
			let n = await B("/api/updates");
			e === k && t === M && l.value && (x.value = n.output ? {
				text: n.output,
				error: n.ok === !1
			} : {
				updates: n,
				error: n.ok === !1
			});
		} catch {
			e === k && t === M && _e("admin.operationError", !0);
		} finally {
			t === M && (s.value = !1);
		}
	}
	function je(e, t) {
		if (F.value && window.confirm(n(t))) return Ee(e);
	}
	function Me() {
		if (F.value && window.confirm(n("backup.createConfirm"))) return Ee("/api/backup/create", {}, "commons-backup-job");
	}
	function Ne(e) {
		if (!F.value) return;
		let t = {
			restore: te.value,
			rollback: E.value
		}, r = e === "restore" ? "backup.restore" : e === "rollback" ? "images.rollback" : "images.update";
		if (e !== "update" && !t[e]) _e(e === "restore" ? "backup.noneSelected" : "images.rollbackNone", !0);
		else if (window.prompt(n(r + "Prompt", { backup: t[e] })) !== n(r + "ConfirmWord")) _e(r + "Cancelled");
		else return Ee("/api/" + (e === "restore" ? "backup/restore" : "images/" + e), e === "update" ? {} : { backup: t[e] }, e === "restore" ? "commons-backup-job" : "commons-images-job");
	}
	function Pe(e) {
		if (F.value) {
			if (e === "configure" && (!T.value.trim().startsWith("/") || T.value.trim() === "/")) _e("secondary.error.invalid_configuration", !0);
			else return ee.value = !1, Ee("/api/backup/secondary", e === "configure" ? {
				action: e,
				mount: T.value.trim()
			} : { action: e }, "commons-backup-job");
		}
	}
	async function Fe() {
		if (c.value) return;
		c.value = !0, ++N, ye(), re.value = !1, ge(), s.value = !0, o.value = !1, x.value = { key: "common.actionPlaceholder" }, y.value = "status.disconnected";
		let e = M;
		try {
			await fetch("/api/auth/oidc/logout", {
				method: "POST",
				credentials: "same-origin",
				cache: "no-store"
			});
		} catch {
			e === M && l.value && (y.value = "status.authRequired");
		} finally {
			e === M && (s.value = !1, c.value = !1);
		}
	}
	function Ie() {
		s.value || (location.href = "/api/auth/oidc/login?next=%2Fadmin%2F");
	}
	function Le() {
		t.value = window.i18nAdmin.getLang();
	}
	function Re() {
		l.value = !1, ++N, ye(), re.value = !1, ge(), s.value = !1, c.value = !1, x.value = { key: "common.actionPlaceholder" }, o.value = !1, document.getElementById("adminApp")?.setAttribute("hidden", "");
	}
	async function ze(e) {
		e.persisted && (l.value = !0, document.getElementById("adminApp")?.removeAttribute("hidden"), D.value = me(), O.value = !1, await V(), be());
	}
	return nr(() => {
		D.value = me(), D.value && _e("modules.applying"), V(), be(), window.addEventListener("edutictac:langchange", Le), window.addEventListener("pagehide", Re), window.addEventListener("pageshow", ze);
	}), rr(() => {
		Re(), window.removeEventListener("edutictac:langchange", Le), window.removeEventListener("pagehide", Re), window.removeEventListener("pageshow", ze);
	}), {
		t: n,
		language: t,
		authorized: a,
		checking: o,
		pending: s,
		loggingOut: c,
		busy: ae,
		canWrite: F,
		status: u,
		statusText: de,
		output: x,
		actionText: fe,
		apiMessage: y,
		modules: d,
		selected: f,
		moduleManageable: oe,
		moduleError: p,
		modulesNotice: pe,
		wizard: g,
		wizardOpen: _,
		dismissed: v,
		closeWizard: he,
		teacher: C,
		teacherMessage: S,
		credential: w,
		clearTeacher: z,
		mount: T,
		mountDirty: ee,
		restore: te,
		rollback: E,
		backups: ce,
		rollbacks: le,
		secondary: ue,
		secondaryText: L,
		job: D,
		pollState: ie,
		trackingPaused: O,
		loadStatus: V,
		applyModules: De,
		saveBackupKey: Oe,
		backupRecipient: m,
		backupKeyMessage: h,
		backupKeyRequired: se,
		backupConfigured: I,
		createTeacher: ke,
		checkUpdates: Ae,
		confirmed: je,
		backupCreate: Me,
		typedAction: Ne,
		secondaryAction: Pe,
		operation: Ee,
		logout: Fe,
		login: Ie,
		resumeTracking: we
	};
}
// admin/src/AdminApp.vue
var ho = { class: "topbar" }, go = { class: "topbar-actions" }, _o = {
	id: "apiStatus",
	class: "status",
	role: "status"
}, vo = ["title"], yo = ["aria-current"], bo = ["aria-current"], xo = ["aria-current"], So = ["aria-current"], Co = { class: "single-layout" }, wo = {
	class: "panel",
	"aria-labelledby": "loginTitle"
}, To = { class: "panel-heading" }, Eo = { class: "eyebrow" }, Do = { id: "loginTitle" }, Oo = { class: "actions" }, ko = ["disabled"], Ao = ["disabled"], jo = ["disabled"], Mo = {
	id: "modulesPanel",
	class: "panel",
	"aria-labelledby": "modulesTitle"
}, No = { class: "panel-heading" }, Po = { class: "eyebrow" }, Fo = { id: "modulesTitle" }, Io = {
	class: "panel",
	"aria-labelledby": "teacherTitle"
}, Lo = { class: "panel-heading" }, Ro = { class: "eyebrow" }, zo = { id: "teacherTitle" }, Bo = ["disabled"], Vo = { class: "actions" }, Ho = { type: "submit" }, Uo = {
	class: "panel",
	"aria-labelledby": "statusTitle"
}, Wo = { class: "panel-heading" }, Go = { class: "eyebrow" }, Ko = { id: "statusTitle" }, qo = {
	class: "panel",
	"aria-labelledby": "actionsTitle"
}, Jo = { class: "panel-heading" }, Yo = { class: "eyebrow" }, Xo = { id: "actionsTitle" }, Zo = { class: "actions" }, Qo = ["disabled"], $o = ["disabled"], es = ["disabled"], ts = ["disabled"], ns = { class: "hint" }, rs = { for: "secondaryMount" }, is = { class: "hint" }, as = { class: "actions" }, os = {
	id: "secondarySave",
	type: "submit"
}, ss = ["disabled"], cs = ["disabled"], ls = {
	id: "secondaryStatus",
	role: "status",
	"aria-live": "polite"
}, us = ["disabled"], ds = {
	key: 0,
	value: ""
}, fs = ["value"], ps = { class: "actions" }, ms = ["disabled"], hs = { class: "panel-heading compact" }, gs = { class: "eyebrow" }, _s = { class: "actions" }, vs = ["disabled"], ys = ["disabled"], bs = ["disabled"], xs = {
	key: 0,
	value: ""
}, Ss = ["value"], Cs = { class: "actions" }, ws = ["disabled"], Ts = { class: "panel-heading compact" }, Es = { class: "eyebrow" }, Ds = { class: "hint" }, Os = { class: "actions" }, ks = ["disabled"], As = ["disabled"], js = ["data-state"], Ms = {
	class: "lang-switcher",
	role: "group",
	"aria-label": "Idioma"
}, Ns = ["aria-current"], Ps = ["aria-current"], Fs = ["aria-current"], Is = ["aria-current"], Ls = { id: "modulesWizardTitle" }, Rs = {
	key: 0,
	id: "backupKeyBox",
	class: "hint"
}, zs = ["placeholder"], Bs = { class: "actions" }, Vs = ["disabled"], Hs = {
	id: "backupKeyNotice",
	role: "status",
	"aria-live": "polite"
}, Us = {
	key: 1,
	class: "hint"
}, Ws = ["disabled"], Gs = { class: "module-choice" }, Ks = { class: "module-choice" }, qs = { class: "module-choice" }, Js = { class: "module-choice" }, Ys = { class: "module-choice" }, Xs = { class: "module-choice" }, Zs = ["disabled"], Qs = ["hidden"], $s = { class: "hint" }, ec = {
	id: "modulesNotice",
	role: "status",
	"aria-live": "polite"
}, tc = { class: "actions" }, nc = ["disabled"], rc = ["hidden"], ic = {
	__name: "AdminApp",
	setup(e) {
		let { t, language: n, authorized: r, checking: i, pending: a, loggingOut: o, canWrite: s, statusText: c, output: l, actionText: u, apiMessage: d, modules: f, selected: p, moduleManageable: m, modulesNotice: h, wizard: g, wizardOpen: _, closeWizard: v, teacher: y, teacherMessage: b, credential: x, clearTeacher: S, mount: C, mountDirty: w, restore: T, rollback: ee, backups: te, rollbacks: E, secondary: D, secondaryText: O, job: k, pollState: A, trackingPaused: j, loadStatus: M, applyModules: ne, saveBackupKey: N, backupRecipient: P, backupKeyMessage: re, backupKeyRequired: ie, backupConfigured: ae, createTeacher: F, checkUpdates: oe, confirmed: se, backupCreate: ce, typedAction: le, secondaryAction: ue, operation: de, logout: fe, login: pe, resumeTracking: L } = mo();
		return En(_, async (e) => {
			await sn(), e && !g.value?.open ? g.value?.showModal() : !e && g.value?.open && g.value.close();
		}), (e, R) => (Z(), Q(X, null, [
			$("header", ho, [$("div", null, [R[36] ||= $("p", { class: "eyebrow" }, "EduTicTac Commons", -1), $("h1", null, z(K(t)("admin.title")), 1)]), $("div", go, [$("span", _o, z(K(t)(K(d))), 1), $("div", {
				class: "lang-switcher",
				role: "group",
				"aria-label": "Idioma",
				title: K(t)("common.lang.label")
			}, [
				$("button", {
					type: "button",
					"data-lang": "ca",
					class: I({ active: K(n) === "ca" }),
					"aria-current": K(n) === "ca" ? "true" : void 0,
					title: "Català"
				}, "CA", 10, yo),
				$("button", {
					type: "button",
					"data-lang": "va",
					class: I({ active: K(n) === "va" }),
					"aria-current": K(n) === "va" ? "true" : void 0,
					title: "Valencià"
				}, "VA", 10, bo),
				$("button", {
					type: "button",
					"data-lang": "es",
					class: I({ active: K(n) === "es" }),
					"aria-current": K(n) === "es" ? "true" : void 0,
					title: "Español"
				}, "ES", 10, xo),
				$("button", {
					type: "button",
					"data-lang": "en",
					class: I({ active: K(n) === "en" }),
					"aria-current": K(n) === "en" ? "true" : void 0,
					title: "English"
				}, "EN", 10, So)
			], 8, vo)])]),
			$("main", Co, [
				$("section", wo, [$("div", To, [$("p", Eo, z(K(t)("login.access")), 1), $("h2", Do, z(K(t)("login.title")), 1)]), $("div", Oo, [
					$("button", {
						id: "loginBtn",
						onClick: R[0] ||= (...e) => K(pe) && K(pe)(...e),
						disabled: K(a),
						type: "button"
					}, z(K(t)("login.enter")), 9, ko),
					$("button", {
						id: "logoutBtn",
						onClick: R[1] ||= (...e) => K(fe) && K(fe)(...e),
						disabled: K(o),
						type: "button",
						class: "secondary"
					}, z(K(t)("login.logout")), 9, Ao),
					$("button", {
						id: "refreshBtn",
						onClick: R[2] ||= (...e) => K(M) && K(M)(...e),
						disabled: K(i) || K(a),
						type: "button",
						class: "secondary"
					}, z(K(t)("login.refresh")), 9, jo)
				])]),
				$("section", Mo, [$("div", No, [$("p", Po, z(K(t)("modules.label")), 1), $("h2", Fo, z(K(t)("modules.title")), 1)]), R[37] ||= $("div", { id: "modulesFormHome" }, null, -1)]),
				hi(lo, {
					t: K(t),
					authorized: K(r),
					"can-write": K(s)
				}, null, 8, [
					"t",
					"authorized",
					"can-write"
				]),
				$("section", Io, [
					$("div", Lo, [$("p", Ro, z(K(t)("teachers.label")), 1), $("h2", zo, z(K(t)("teachers.title")), 1)]),
					$("form", {
						id: "teacherForm",
						onSubmit: R[6] ||= Ya((...e) => K(F) && K(F)(...e), ["prevent"])
					}, [$("fieldset", {
						disabled: !K(s),
						class: "teacher-fields"
					}, [
						$("label", null, [$("span", null, z(K(t)("teachers.username")), 1), J($("input", {
							id: "teacherUsername",
							"onUpdate:modelValue": R[3] ||= (e) => K(y).username = e,
							required: "",
							autocomplete: "off",
							pattern: "[A-Za-z0-9][A-Za-z0-9._-]{2,149}"
						}, null, 512), [[za, K(y).username]])]),
						$("label", null, [$("span", null, z(K(t)("teachers.name")), 1), J($("input", {
							id: "teacherName",
							"onUpdate:modelValue": R[4] ||= (e) => K(y).name = e,
							required: "",
							autocomplete: "name"
						}, null, 512), [[za, K(y).name]])]),
						$("label", null, [$("span", null, z(K(t)("teachers.email")), 1), J($("input", {
							id: "teacherEmail",
							"onUpdate:modelValue": R[5] ||= (e) => K(y).email = e,
							type: "email",
							autocomplete: "email"
						}, null, 512), [[za, K(y).email]])]),
						$("div", Vo, [$("button", Ho, z(K(t)("teachers.create")), 1)])
					], 8, Bo)], 32),
					$("div", {
						id: "teacherOutput",
						class: I(["output", {
							empty: !K(x) && !K(b),
							error: K(b) === "admin.teacherError"
						}]),
						role: "status"
					}, z(K(x) ? K(t)("teachers.created", {
						username: K(x).username,
						password: K(x).password
					}) : K(t)(K(b) || "teachers.help")), 3),
					K(x) ? (Z(), Q("button", {
						key: 0,
						id: "clearTeacherCredential",
						class: "secondary",
						onClick: R[7] ||= (...e) => K(S) && K(S)(...e)
					}, z(K(t)("admin.clearCredential")), 1)) : bi("", !0)
				]),
				$("section", Uo, [$("div", Wo, [$("p", Go, z(K(t)("status.label")), 1), $("h2", Ko, z(K(t)("status.title")), 1)]), $("div", {
					id: "statusOutput",
					class: I(["output", { empty: !K(r) }])
				}, z(K(c)), 3)]),
				$("section", qo, [
					$("div", Jo, [$("p", Yo, z(K(t)("common.actions")), 1), $("h2", Xo, z(K(t)("backup.title")), 1)]),
					$("div", Zo, [
						$("button", {
							id: "backupCreateBtn",
							onClick: R[8] ||= (...e) => K(ce) && K(ce)(...e),
							disabled: !K(s),
							type: "button"
						}, z(K(t)("backup.create")), 9, Qo),
						$("button", {
							id: "timerInstallBtn",
							onClick: R[9] ||= (e) => K(se)("/api/backup-timer/install", "backup.installTimerConfirm"),
							disabled: !K(s),
							type: "button"
						}, z(K(t)("backup.installTimer")), 9, $o),
						$("button", {
							id: "timerUninstallBtn",
							onClick: R[10] ||= (e) => K(se)("/api/backup-timer/uninstall", "backup.uninstallTimerConfirm"),
							disabled: !K(s),
							type: "button",
							class: "secondary"
						}, z(K(t)("backup.uninstallTimer")), 9, es)
					]),
					$("form", {
						id: "secondaryForm",
						onSubmit: R[15] ||= Ya((e) => K(ue)("configure"), ["prevent"])
					}, [$("fieldset", {
						id: "secondaryControls",
						disabled: !K(s)
					}, [
						$("legend", null, z(K(t)("secondary.title")), 1),
						$("p", ns, z(K(t)("secondary.help")), 1),
						$("label", rs, z(K(t)("secondary.mount")), 1),
						J($("input", {
							id: "secondaryMount",
							"onUpdate:modelValue": R[11] ||= (e) => /* @__PURE__ */ W(C) ? C.value = e : null,
							onInput: R[12] ||= (e) => w.value = !0,
							type: "text",
							placeholder: "/media/commons-backup",
							autocomplete: "off",
							maxlength: "1024",
							required: ""
						}, null, 544), [[za, K(C)]]),
						$("p", is, z(K(t)("secondary.mounted")), 1),
						$("div", as, [
							$("button", os, z(K(t)("secondary.save")), 1),
							$("button", {
								id: "secondaryCopy",
								onClick: R[13] ||= (e) => K(ue)("copy"),
								disabled: !K(s) || !K(D).enabled,
								type: "button",
								class: "secondary"
							}, z(K(t)("secondary.copy")), 9, ss),
							$("button", {
								id: "secondaryDisable",
								onClick: R[14] ||= (e) => K(ue)("disable"),
								disabled: !K(s) || !K(D).enabled,
								type: "button",
								class: "secondary"
							}, z(K(t)("secondary.disable")), 9, cs)
						])
					], 8, ts), $("p", ls, z(K(O)), 1)], 32),
					$("label", null, [$("span", null, z(K(t)("backup.restoreLabel")), 1), J($("select", {
						id: "restoreBackupSelect",
						"onUpdate:modelValue": R[16] ||= (e) => /* @__PURE__ */ W(T) ? T.value = e : null,
						disabled: !K(s) || !K(te).length
					}, [K(te).length ? bi("", !0) : (Z(), Q("option", ds, z(K(t)("backup.noneAvailable")), 1)), (Z(!0), Q(X, null, ar(K(te), (e) => (Z(), Q("option", {
						key: e.name,
						value: e.name
					}, z(e.name) + " (" + z(e.created_at || K(t)("backup.noDate")) + ")", 9, fs))), 128))], 8, us), [[Ha, K(T)]])]),
					$("div", ps, [$("button", {
						id: "backupRestoreBtn",
						onClick: R[17] ||= (e) => K(le)("restore"),
						disabled: !K(s) || !K(T),
						type: "button",
						class: "danger"
					}, z(K(t)("backup.restore")), 9, ms)]),
					$("div", hs, [$("p", gs, z(K(t)("images.label")), 1), $("h2", null, z(K(t)("images.title")), 1)]),
					$("div", _s, [$("button", {
						id: "imagesCheckBtn",
						onClick: R[18] ||= (...e) => K(oe) && K(oe)(...e),
						disabled: !K(s),
						type: "button",
						class: "secondary"
					}, z(K(t)("images.check")), 9, vs), $("button", {
						id: "imagesUpdateBtn",
						onClick: R[19] ||= (e) => K(le)("update"),
						disabled: !K(s),
						type: "button",
						class: "danger"
					}, z(K(t)("images.update")), 9, ys)]),
					$("label", null, [$("span", null, z(K(t)("images.rollbackLabel")), 1), J($("select", {
						id: "rollbackBackupSelect",
						"onUpdate:modelValue": R[20] ||= (e) => /* @__PURE__ */ W(ee) ? ee.value = e : null,
						disabled: !K(s) || !K(E).length
					}, [K(E).length ? bi("", !0) : (Z(), Q("option", xs, z(K(t)("images.rollbackNone")), 1)), (Z(!0), Q(X, null, ar(K(E), (e) => (Z(), Q("option", {
						key: e.name,
						value: e.name
					}, z(e.name) + " (→ " + z(e.update.previous_image_tag) + ")", 9, Ss))), 128))], 8, bs), [[Ha, K(ee)]])]),
					$("div", Cs, [$("button", {
						id: "imagesRollbackBtn",
						onClick: R[21] ||= (e) => K(le)("rollback"),
						disabled: !K(s) || !K(ee),
						type: "button",
						class: "danger"
					}, z(K(t)("images.rollback")), 9, ws)]),
					$("div", Ts, [$("p", Es, z(K(t)("content.label")), 1), $("h2", null, z(K(t)("content.title")), 1)]),
					$("p", Ds, z(K(t)("content.help")), 1),
					$("div", Os, [$("button", {
						id: "contentResourcesSyncBtn",
						onClick: R[22] ||= (e) => K(de)("/api/content-sync/resources"),
						disabled: !K(s),
						type: "button",
						class: "secondary"
					}, z(K(t)("content.resources")), 9, ks), $("button", {
						id: "contentEduhootSyncBtn",
						onClick: R[23] ||= (e) => K(de)("/api/content-sync/eduhoot"),
						disabled: !K(s),
						type: "button",
						class: "secondary"
					}, z(K(t)("content.eduhoot")), 9, As)]),
					$("div", {
						id: "actionOutput",
						class: I(["output", {
							empty: K(l).key === "common.actionPlaceholder",
							error: K(l).error
						}]),
						role: "status"
					}, z(K(u)), 3),
					K(k) ? (Z(), Q("div", {
						key: 0,
						id: "jobTracking",
						"data-state": K(A),
						role: "status"
					}, [yi(z(K(t)("admin.tracking")), 1), K(j) ? (Z(), Q("button", {
						key: 0,
						id: "jobResume",
						class: "secondary",
						onClick: R[24] ||= (...e) => K(L) && K(L)(...e)
					}, z(K(t)("admin.resumeTracking")), 1)) : bi("", !0)], 8, js)) : bi("", !0)
				])
			]),
			$("dialog", {
				ref_key: "wizard",
				ref: g,
				id: "modulesWizard",
				onCancel: R[25] ||= Ya((...e) => K(v) && K(v)(...e), ["prevent"]),
				"aria-labelledby": "modulesWizardTitle"
			}, [
				$("div", Ms, [
					$("button", {
						type: "button",
						"data-lang": "ca",
						class: I({ active: K(n) === "ca" }),
						"aria-current": K(n) === "ca" ? "true" : void 0
					}, "CA", 10, Ns),
					$("button", {
						type: "button",
						"data-lang": "va",
						class: I({ active: K(n) === "va" }),
						"aria-current": K(n) === "va" ? "true" : void 0
					}, "VA", 10, Ps),
					$("button", {
						type: "button",
						"data-lang": "es",
						class: I({ active: K(n) === "es" }),
						"aria-current": K(n) === "es" ? "true" : void 0
					}, "ES", 10, Fs),
					$("button", {
						type: "button",
						"data-lang": "en",
						class: I({ active: K(n) === "en" }),
						"aria-current": K(n) === "en" ? "true" : void 0
					}, "EN", 10, Is)
				]),
				$("h2", Ls, z(K(t)("modules.firstTitle")), 1),
				R[38] ||= $("div", { id: "modulesWizardContent" }, null, -1)
			], 544),
			(Z(), ui(zn, { to: K(_) ? "#modulesWizardContent" : "#modulesFormHome" }, [$("form", {
				id: "modulesForm",
				onSubmit: R[35] ||= Ya((...e) => K(ne) && K(ne)(...e), ["prevent"])
			}, [
				$("p", null, z(K(t)("modules.core")), 1),
				K(ie) ? (Z(), Q("div", Rs, [
					$("p", null, [$("strong", null, z(K(t)("modules.backupTitle")), 1)]),
					$("p", null, z(K(t)("modules.backupHelp")), 1),
					$("label", null, [$("span", null, z(K(t)("modules.backupLabel")), 1), J($("input", {
						id: "backupKeyInput",
						"onUpdate:modelValue": R[26] ||= (e) => /* @__PURE__ */ W(P) ? P.value = e : null,
						type: "text",
						autocomplete: "off",
						spellcheck: "false",
						maxlength: "200",
						placeholder: K(t)("modules.backupPlaceholder")
					}, null, 8, zs), [[za, K(P)]])]),
					$("div", Bs, [$("button", {
						id: "backupKeySave",
						type: "button",
						class: "secondary",
						disabled: !K(s) || !K(P).trim(),
						onClick: R[27] ||= (...e) => K(N) && K(N)(...e)
					}, z(K(t)("modules.backupSave")), 9, Vs)]),
					$("p", Hs, z(K(re) ? K(t)(K(re)) : K(t)("modules.backupRequired")), 1)
				])) : K(ae) ? (Z(), Q("p", Us, z(K(t)("modules.backupConfigured")), 1)) : bi("", !0),
				$("fieldset", {
					id: "modulesChoices",
					disabled: !K(s) || !K(m)
				}, [
					$("legend", null, z(K(t)("modules.choose")), 1),
					$("label", Gs, [J($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[28] ||= (e) => /* @__PURE__ */ W(p) ? p.value = e : null,
						value: "play"
					}, null, 512), [[Ba, K(p)]]), $("span", null, [R[39] ||= $("strong", null, "EduTicTac Play", -1), $("small", null, z(K(t)("modules.play")), 1)])]),
					$("label", Ks, [J($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[29] ||= (e) => /* @__PURE__ */ W(p) ? p.value = e : null,
						value: "eduhoot"
					}, null, 512), [[Ba, K(p)]]), $("span", null, [R[40] ||= $("strong", null, "EduHoot", -1), $("small", null, z(K(t)("modules.eduhoot")), 1)])]),
					$("label", qs, [J($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[30] ||= (e) => /* @__PURE__ */ W(p) ? p.value = e : null,
						value: "recursos"
					}, null, 512), [[Ba, K(p)]]), $("span", null, [$("strong", null, z(K(t)("modules.resourcesName")), 1), $("small", null, z(K(t)("modules.recursos")), 1)])]),
					$("label", Js, [J($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[31] ||= (e) => /* @__PURE__ */ W(p) ? p.value = e : null,
						value: "blocs"
					}, null, 512), [[Ba, K(p)]]), $("span", null, [R[41] ||= $("strong", null, "EduTicTac Blocs", -1), $("small", null, z(K(t)("modules.blocs")), 1)])]),
					$("label", Ys, [J($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[32] ||= (e) => /* @__PURE__ */ W(p) ? p.value = e : null,
						value: "llibres"
					}, null, 512), [[Ba, K(p)]]), $("span", null, [R[42] ||= $("strong", null, "EduTicTac Llibres", -1), $("small", null, z(K(t)("modules.llibres")), 1)])]),
					$("label", Xs, [J($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[33] ||= (e) => /* @__PURE__ */ W(p) ? p.value = e : null,
						value: "quiosc",
						disabled: !K(f)?.available?.quiosc && !K(p).includes("quiosc")
					}, null, 8, Zs), [[Ba, K(p)]]), $("span", null, [R[43] ||= $("strong", null, "EduTicTac Quiosc", -1), $("small", null, z(K(t)("modules.quiosc")), 1)])])
				], 8, Ws),
				$("p", {
					id: "modulesQuioscHint",
					hidden: !!K(f)?.available?.quiosc,
					class: "hint"
				}, z(K(t)("modules.quioscPreparation")), 9, Qs),
				$("p", $s, z(K(t)("modules.retention")), 1),
				$("p", ec, z(K(h)), 1),
				$("div", tc, [$("button", {
					id: "modulesApply",
					type: "submit",
					disabled: !K(s) || !K(m) || !K(ae)
				}, z(K(t)("modules.apply")), 9, nc), $("button", {
					id: "modulesLater",
					type: "button",
					class: "secondary",
					hidden: !K(_),
					onClick: R[34] ||= (...e) => K(v) && K(v)(...e)
				}, z(K(t)("modules.later")), 9, rc)])
			], 32)], 8, ["to"]))
		], 64));
	}
};
// admin/src/main.js
function ac(e) {
	return $a(ic).mount(e);
}
export { ac as mountAdmin };
