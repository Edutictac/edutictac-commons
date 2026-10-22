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
}, D = /-\w/g, O = E((e) => e.replace(D, (e) => e.slice(1).toUpperCase())), k = /\B([A-Z])/g, A = E((e) => e.replace(k, "-$1").toLowerCase()), ee = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), j = E((e) => e ? `on${ee(e)}` : ""), M = (e, t) => !Object.is(e, t), N = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, P = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, F = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, te, ne = () => te ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function I(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? oe(r) : I(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var re = /;(?![^(]*\))/g, ie = /:([^]+)/, ae = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function oe(e) {
	let t = {};
	return e.replace(ae, (e) => e.startsWith("/*") ? "" : e).split(re).forEach((e) => {
		if (e) {
			let n = e.split(ie);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function L(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = L(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var se = /* @__PURE__ */ e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function ce(e) {
	return !!e || e === "";
}
function R(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = z(e[i], t[i], n);
	return r;
}
function le(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && z(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function ue(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? le(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !z(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function de(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function z(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? de(e, t, n, R) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : de(e, t, n, ue) : String(e) === String(t))));
}
function fe(e, t) {
	return e.findIndex((e) => z(e, t));
}
var pe = (e) => !!(e && e.__v_isRef === !0), B = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? pe(e) ? B(e.value) : JSON.stringify(e, me, 2) : String(e), me = (e, t) => pe(t) ? me(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[he(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => he(e)) } : _(t) ? he(t) : v(t) && !d(t) && !C(t) ? String(t) : t, he = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, V, ge = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && V && (V.active ? (this.parent = V, this.index = (V.scopes || (V.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = V;
			try {
				return V = this, e();
			} finally {
				V = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = V, V = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (V === this) V = this.prevScope;
			else {
				let e = V;
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
function _e() {
	return V;
}
var H, ve = /* @__PURE__ */ new WeakSet(), ye = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, V && (V.active ? V.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, ve.has(this) && (ve.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ce(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Fe(this), Ee(this);
		let e = H, t = U;
		H = this, U = !0;
		try {
			return this.fn();
		} finally {
			De(this), H = e, U = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ae(e);
			this.deps = this.depsTail = void 0, Fe(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? ve.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Oe(this) && this.run();
	}
	get dirty() {
		return Oe(this);
	}
}, be = 0, xe, Se;
function Ce(e, t = !1) {
	e.flags |= 8, t ? (e.next = Se, Se = e) : (e.next = xe, xe = e);
}
function we() {
	be++;
}
function Te() {
	if (--be > 0) return;
	if (Se) {
		let e = Se;
		for (Se = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; xe;) {
		let t = xe;
		for (xe = void 0; t;) {
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
function Ee(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function De(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ae(r), je(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Oe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ke(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function ke(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ie) || (e.globalVersion = Ie, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Oe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = H, r = U;
	H = e, U = !0;
	try {
		Ee(e);
		let n = e.fn(e._value);
		(t.version === 0 || M(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		H = n, U = r, De(e), e.flags &= -3;
	}
}
function Ae(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ae(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function je(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var U = !0, Me = [];
function Ne() {
	Me.push(U), U = !1;
}
function Pe() {
	let e = Me.pop();
	U = e === void 0 || e;
}
function Fe(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = H;
		H = void 0;
		try {
			t();
		} finally {
			H = e;
		}
	}
}
var Ie = 0, Le = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Re = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!H || !U || H === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== H) t = this.activeLink = new Le(H, this), H.deps ? (t.prevDep = H.depsTail, H.depsTail.nextDep = t, H.depsTail = t) : H.deps = H.depsTail = t, ze(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = H.depsTail, t.nextDep = void 0, H.depsTail.nextDep = t, H.depsTail = t, H.deps === t && (H.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ie++, this.notify(e);
	}
	notify(e) {
		we();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Te();
		}
	}
};
function ze(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) ze(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Be = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ Symbol(""), He = /* @__PURE__ */ Symbol(""), Ue = /* @__PURE__ */ Symbol("");
function W(e, t, n) {
	if (U && H) {
		let t = Be.get(e);
		t || Be.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Re()), r.map = t, r.key = n), r.track();
	}
}
function We(e, t, n, r, i, a) {
	let o = Be.get(e);
	if (!o) {
		Ie++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (we(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ue || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ue)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ve)), f(e) && s(o.get(He)));
				break;
			case "delete":
				i || (s(o.get(Ve)), f(e) && s(o.get(He)));
				break;
			case "set": f(e) && s(o.get(Ve));
		}
	}
	Te();
}
function Ge(e) {
	let t = /* @__PURE__ */ G(e);
	return t === e || (W(t, "iterate", Ue), /* @__PURE__ */ jt(e)) ? t : /* @__PURE__ */ At(e) ? /* @__PURE__ */ kt(e) ? t.map((e) => Ft(Pt(e))) : t.map(Ft) : t.map(Pt);
}
function Ke(e) {
	return W(e = /* @__PURE__ */ G(e), "iterate", Ue), e;
}
function qe(e, t) {
	return /* @__PURE__ */ At(e) ? Ft(/* @__PURE__ */ kt(e) ? Pt(t) : t) : Pt(t);
}
var Je = {
	__proto__: null,
	[Symbol.iterator]() {
		return Ye(this, Symbol.iterator, (e) => qe(this, e));
	},
	concat(...e) {
		return Ge(this).concat(...e.map((e) => d(e) ? Ge(e) : e));
	},
	entries() {
		return Ye(this, "entries", (e) => (e[1] = qe(this, e[1]), e));
	},
	every(e, t) {
		return Qe(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Qe(this, "filter", e, t, (e) => e.map((e) => qe(this, e)), arguments);
	},
	find(e, t) {
		return Qe(this, "find", e, t, (e) => qe(this, e), arguments);
	},
	findIndex(e, t) {
		return Qe(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Qe(this, "findLast", e, t, (e) => qe(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Qe(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Qe(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return et(this, "includes", e);
	},
	indexOf(...e) {
		return et(this, "indexOf", e);
	},
	join(e) {
		return Ge(this).join(e);
	},
	lastIndexOf(...e) {
		return et(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Qe(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return tt(this, "pop");
	},
	push(...e) {
		return tt(this, "push", e);
	},
	reduce(e, ...t) {
		return $e(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return $e(this, "reduceRight", e, t);
	},
	shift() {
		return tt(this, "shift");
	},
	some(e, t) {
		return Qe(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return tt(this, "splice", e);
	},
	toReversed() {
		return Ge(this).toReversed();
	},
	toSorted(e) {
		return Ge(this).toSorted(e);
	},
	toSpliced(...e) {
		return Ge(this).toSpliced(...e);
	},
	unshift(...e) {
		return tt(this, "unshift", e);
	},
	values() {
		return Ye(this, "values", (e) => qe(this, e));
	}
};
function Ye(e, t, n) {
	let r = Ke(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ jt(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Xe(a.next(), n), i !== Ze[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => Xe(a._next(), n);
	}
	return a;
}
function Xe(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Ze = Array.prototype;
function Qe(e, t, n, r, i, a) {
	let o = Ke(e), s = o !== e && !/* @__PURE__ */ jt(e), c = o[t];
	if (c !== Ze[t]) {
		let t = c.apply(e, a);
		return s ? Pt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, qe(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function $e(e, t, n, r) {
	let i = Ke(e), a = i !== e && !/* @__PURE__ */ jt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = qe(e, t)), n.call(this, t, qe(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? qe(e, c) : c;
}
function et(e, t, n) {
	let r = /* @__PURE__ */ G(e);
	W(r, "iterate", Ue);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Mt(n[0]) ? (n[0] = /* @__PURE__ */ G(n[0]), r[t](...n)) : i;
}
function tt(e, t, n = []) {
	Ne(), we();
	let r = (/* @__PURE__ */ G(e))[t].apply(e, n);
	return Te(), Pe(), r;
}
var nt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), rt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function it(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ G(this);
	return W(t, "has", e), t.hasOwnProperty(e);
}
var at = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Ct : St : i ? xt : bt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = Je[t])) return e;
			if (t === "hasOwnProperty") return it;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ K(e) ? e : n);
		if ((_(t) ? rt.has(t) : nt(t)) || (r || W(e, "get", t), i)) return o;
		if (/* @__PURE__ */ K(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Dt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Dt(o) : /* @__PURE__ */ Tt(o) : o;
	}
}, ot = class extends at {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ At(i);
			if (!/* @__PURE__ */ jt(n) && !/* @__PURE__ */ At(n) && (i = /* @__PURE__ */ G(i), n = /* @__PURE__ */ G(n)), !a && /* @__PURE__ */ K(i) && !/* @__PURE__ */ K(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ K(e) ? e : r);
		return e === /* @__PURE__ */ G(r) && s && (o ? M(n, i) && We(e, "set", t, n, i) : We(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && We(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && rt.has(t) || W(e, "has", t), n;
	}
	ownKeys(e) {
		return W(e, "iterate", d(e) ? "length" : Ve), Reflect.ownKeys(e);
	}
}, st = class extends at {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, ct = /* @__PURE__ */ new ot(), lt = /* @__PURE__ */ new st(), ut = /* @__PURE__ */ new ot(!0), dt = (e) => e, ft = (e) => Reflect.getPrototypeOf(e);
function pt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ G(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? dt : t ? Ft : Pt;
		return !t && W(a, "iterate", l ? He : Ve), s(Object.create(u), { next() {
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
function mt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function ht(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ G(r), a = /* @__PURE__ */ G(n);
			e || (M(n, a) && W(i, "get", n), W(i, "get", a));
			let { has: o } = ft(i), s = t ? dt : e ? Ft : Pt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && W(/* @__PURE__ */ G(t), "iterate", Ve), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ G(n), i = /* @__PURE__ */ G(t);
			return e || (M(t, i) && W(r, "has", t), W(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ G(a), s = t ? dt : e ? Ft : Pt;
			return !e && W(o, "iterate", Ve), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: mt("add"),
		set: mt("set"),
		delete: mt("delete"),
		clear: mt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ G(this), r = ft(n), i = /* @__PURE__ */ G(e), a = !t && !/* @__PURE__ */ jt(e) && !/* @__PURE__ */ At(e) ? i : e;
			return r.has.call(n, a) || M(e, a) && r.has.call(n, e) || M(i, a) && r.has.call(n, i) || (n.add(a), We(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ jt(n) || /* @__PURE__ */ At(n) || (n = /* @__PURE__ */ G(n));
			let r = /* @__PURE__ */ G(this), { has: i, get: a } = ft(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ G(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? M(n, s) && We(r, "set", e, n, s) : We(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ G(this), { has: n, get: r } = ft(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ G(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && We(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ G(this), t = e.size !== 0, n = e.clear();
			return t && We(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = pt(r, e, t);
	}), n;
}
function gt(e, t) {
	let n = ht(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
}
var _t = { get: /* @__PURE__ */ gt(!1, !1) }, vt = { get: /* @__PURE__ */ gt(!1, !0) }, yt = { get: /* @__PURE__ */ gt(!0, !1) }, bt = /* @__PURE__ */ new WeakMap(), xt = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap(), Ct = /* @__PURE__ */ new WeakMap();
function wt(e) {
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
function Tt(e) {
	return /* @__PURE__ */ At(e) ? e : Ot(e, !1, ct, _t, bt);
}
// @__NO_SIDE_EFFECTS__
function Et(e) {
	return Ot(e, !1, ut, vt, xt);
}
// @__NO_SIDE_EFFECTS__
function Dt(e) {
	return Ot(e, !0, lt, yt, St);
}
function Ot(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = wt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
	return /* @__PURE__ */ At(e) ? /* @__PURE__ */ kt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function At(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function G(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ G(t) : e;
}
function Nt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && P(e, "__v_skip", !0), e;
}
var Pt = (e) => v(e) ? /* @__PURE__ */ Tt(e) : e, Ft = (e) => v(e) ? /* @__PURE__ */ Dt(e) : e;
// @__NO_SIDE_EFFECTS__
function K(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function q(e) {
	return It(e, !1);
}
function It(e, t) {
	return /* @__PURE__ */ K(e) ? e : new Lt(e, t);
}
var Lt = class {
	constructor(e, t) {
		this.dep = new Re(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ G(e), this._value = t ? e : Pt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ jt(e) || /* @__PURE__ */ At(e);
		e = n ? e : /* @__PURE__ */ G(e), M(e, t) && (this._rawValue = e, this._value = n ? e : Pt(e), this.dep.trigger());
	}
};
function J(e) {
	return /* @__PURE__ */ K(e) ? e.value : e;
}
var Rt = {
	get: (e, t, n) => t === "__v_raw" ? e : J(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ K(i) && !/* @__PURE__ */ K(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function zt(e) {
	return /* @__PURE__ */ kt(e) ? e : new Proxy(e, Rt);
}
var Bt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Re(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ie - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && H !== this) return Ce(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return ke(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Vt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Bt(r, i, n);
}
var Ht = {}, Ut = /* @__PURE__ */ new WeakMap(), Wt = void 0;
function Gt(e, t = !1, n = Wt) {
	if (n) {
		let t = Ut.get(n);
		t || Ut.set(n, t = []), t.push(e);
	}
}
function Kt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ jt(e) || o === !1 || o === 0 ? qt(e, 1) : qt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ K(e) ? (g = () => e.value, y = /* @__PURE__ */ jt(e)) : /* @__PURE__ */ kt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ kt(e) || /* @__PURE__ */ jt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ K(e)) return e.value;
		if (/* @__PURE__ */ kt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Ne();
			try {
				_();
			} finally {
				Pe();
			}
		}
		let t = Wt;
		Wt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Wt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => qt(e(), t);
	}
	let x = _e(), S = () => {
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
	let C = b ? Array(e.length).fill(Ht) : Ht, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => M(e, C[t])) : M(t, C))) {
					let e = Wt;
					Ne();
					try {
						_ && _(), Wt = m;
						let e = [
							t,
							C === Ht ? void 0 : b && C[0] === Ht ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Wt = e, Pe();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new ye(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Gt(e, !1, m), _ = m.onStop = () => {
		let e = Ut.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Ut.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function qt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ K(e)) qt(e.value, t, n);
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
			Ne(), Jt(o, null, 10, [
				e,
				i,
				a
			]), Pe();
			return;
		}
	}
	Zt(e, r, a, i, s);
}
function Zt(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Y = [], Qt = -1, $t = [], en = null, tn = 0, nn = /* @__PURE__ */ Promise.resolve(), rn = null;
function an(e) {
	let t = rn || nn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function on(e) {
	let t = Qt + 1, n = Y.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Y[r], a = mn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function sn(e) {
	if (!(e.flags & 1)) {
		let t = mn(e), n = Y[Y.length - 1];
		!n || !(e.flags & 2) && t >= mn(n) ? Y.push(e) : Y.splice(on(t), 0, e), e.flags |= 1, cn();
	}
}
function cn() {
	rn ||= nn.then(hn);
}
function ln(e) {
	if (!d(e)) en && e.id === -1 ? en.splice(tn + 1, 0, e) : e.flags & 1 || ($t.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) $t.push(e[t]);
	cn();
}
function un(e, t, n, r = Qt + 1) {
	for (; r < Y.length; r++) {
		let n = Y[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Y.splice(r, 1), r = e ? r - 1 : Qt, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function dn(e, t, n = 0) {
	if ($t.length) {
		let e = $t, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < $t.length; i++) {
				let a = $t[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? $t[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => mn(e) - mn(t));
		if ($t.length = r, en) {
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
	let n = t === void 0 ? void 0 : new Set($t);
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
		for (Qt = 0; Qt < Y.length; Qt++) {
			let e = Y[Qt];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Jt(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Qt < Y.length; Qt++) {
			let e = Y[Qt];
			e && (e.flags &= -2);
		}
		Qt = -1, Y.length = 0, dn(e), rn = null, (Y.length || $t.length) && hn(e);
	}
}
var gn = null, _n = null;
function vn(e) {
	let t = gn;
	return gn = e, _n = e && e.type.__scopeId || null, t;
}
function yn(e, t = gn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && si(-1);
		let i = vn(t), a = ri.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ri.length; e > a; e--) ai();
			vn(i), r._d && si(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function bn(e, n) {
	if (gn === null) return e;
	let r = Wi(gn), i = e.dirs ||= [];
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
function xn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ne(), Yt(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Pe());
	}
}
function Sn(e, t, n = !1) {
	let r = ji();
	if (r || fr) {
		let i = fr ? fr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Cn = /* @__PURE__ */ Symbol.for("v-scx"), wn = () => Sn(Cn);
function Tn(e, t, n) {
	return En(e, t, n);
}
function En(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Li) {
		if (c === "sync") {
			let e = wn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = Ai;
	u.call = (e, t, n) => Yt(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		e.i = p, X(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : sn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Kt(e, n, u);
	return Li && (f ? f.push(h) : d && h()), h;
}
var Dn = /* @__PURE__ */ new WeakMap(), On = /* @__PURE__ */ Symbol("_vte"), kn = (e) => e.__isTeleport, An = (e) => e && (e.disabled || e.disabled === ""), jn = (e) => e && (e.defer || e.defer === ""), Mn = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Nn = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Pn = (e, t) => {
	let n = e && e.to;
	return g(n) ? t ? t(n) : null : n;
}, Fn = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = An(t.props), { dynamicChildren: y } = t, b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = An(e.props), r = e.target = Pn(e.props, m), a = Bn(r, e, h, p);
			r && (o !== "svg" && Mn(r) ? o = "svg" : o !== "mathml" && Nn(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), zn(e, !1)));
		}, S = (e) => {
			let t = () => {
				if (Dn.get(e) === t) {
					if (Dn.delete(e), An(e.props)) {
						let t = _(e.el) || n;
						b(e, t, e.anchor), zn(e, !0);
					}
					x(e);
				}
			};
			Dn.set(e, t), X(t, a);
		};
		if (e == null) {
			let e = t.el = h(""), i = t.anchor = h("");
			if (p(e, n, r), p(i, n, r), jn(t.props) || a && a.pendingBranch) {
				S(t);
				return;
			}
			v && (b(t, n, i), zn(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = Dn.get(e);
			if (u) {
				u.flags |= 8, Dn.delete(e), S(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = An(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || Mn(p) ? o = "svg" : (o === "mathml" || Nn(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), qr(e, t, !0)) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : In(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = Pn(t.props, m);
				e && (t.target = e, In(t, e, null, l, 0));
			} else g && In(t, p, h, l, 1);
			zn(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = An(f), m = a || !p, h = Dn.get(e);
		if (h && (h.flags |= 8, Dn.delete(e)), d && (i(l), i(u)), a && i(c), !h && (p || d) && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, m, !!i.dynamicChildren);
		}
	},
	move: In,
	hydrate: Ln
};
function In(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && (e.targetStart && r(e.targetStart, t, n), r(e.targetAnchor, t, n), n = e.targetAnchor);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !Dn.has(e) && (!d || An(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function Ln(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
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
	let m = t.target = Pn(t.props, c), h = An(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || Bn(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || Bn(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), zn(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var Rn = Fn;
function zn(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function Bn(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[On] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var Vn = /* @__PURE__ */ Symbol("_leaveCb");
function Hn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ti) {
			t = n;
			break;
		}
	}
	return t;
}
function Un(e) {
	if (!Qn(e)) return kn(e.type) && e.children ? Hn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Wn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Wn(kn(n.type) && Un(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === Z && d(e.children)) {
		let n = vr(e.children, !1);
		n && Wn(n, t);
	}
}
function Gn(e) {
	if (e.component) return Gn(e.component.subTree);
	if (e.type === Z) {
		let t = d(e.children) && vr(e.children, !1);
		return t ? Gn(t) : void 0;
	}
	if (e.type !== ti) return e;
}
function Kn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function qn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Jn = /* @__PURE__ */ new WeakMap();
function Yn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Yn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Zn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Yn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Wi(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ G(v), b = v === t ? i : (e) => !qn(_, e) && u(y, e), x = (e, t) => !(t && qn(_, t));
	if (m != null && m !== p) {
		if (Xn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ K(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) Jt(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ K(p);
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
					i(), Jn.delete(e);
				};
				t.id = -1, Jn.set(e, t), X(t, r);
			} else Xn(e), i();
		}
	}
}
function Xn(e) {
	let t = Jn.get(e);
	t && (t.flags |= 8, Jn.delete(e));
}
ne().requestIdleCallback, ne().cancelIdleCallback;
var Zn = (e) => !!e.type.__asyncLoader, Qn = (e) => e.type.__isKeepAlive;
function $n(e, t, n = Ai, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ne();
			let i = Pi(n), a = Yt(t, n, e, r);
			return i(), Pe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var er = (e) => (t, n = Ai) => {
	Li && e !== "sp" || $n(e, (...e) => t(...e), n);
}, tr = er("m"), nr = er("bum"), rr = /* @__PURE__ */ Symbol.for("v-ndc");
function ir(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ kt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ jt(e), s = /* @__PURE__ */ At(e), e = Ke(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ft(Pt(e[n])) : Pt(e[n]) : e[n], n, void 0, a && a[n]);
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
var ar = (e) => e ? Ii(e) ? Wi(e) : ar(e.parent) : null, or = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ar(e.parent),
	$root: (e) => ar(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		sn(e.update);
	},
	$nextTick: (e) => e.n ||= an.bind(e.proxy),
	$watch: (e) => r
}), sr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), cr = {
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
			else if (sr(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = or[n], f, p;
		if (d) return n === "$attrs" && W(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return sr(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || sr(t, s) || u(a, s) || u(r, s) || u(or, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function lr() {
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
var ur = 0;
function dr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = lr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: ur++,
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
				c && (Yt(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = fr;
				fr = l;
				try {
					return e();
				} finally {
					fr = t;
				}
			}
		};
		return l;
	};
}
var fr = null, pr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${O(t)}Modifiers`] || e[`${A(t)}Modifiers`];
function mr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && pr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(F)));
	let c, l = i[c = j(n)] || i[c = j(O(n))];
	!l && o && (l = i[c = j(A(n))]), l && Yt(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Yt(u, e, 6, a);
	}
}
function hr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function gr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, A(t)) || u(e, t));
}
function _r(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = vn(e), v, y;
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
			}) : e(f, null)), y = t.props ? c : yr(c);
		}
	} catch (t) {
		ri.length = 0, Xt(t, e, 1), v = hi(ti);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = br(y, a)), b = vi(b, y, !1, !0));
	}
	return n.dirs && (b = vi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Wn(kn(b.type) && Un(b) || b, n.transition), v = b, vn(_), v;
}
function vr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (di(r)) {
			if (r.type !== ti || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var yr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, br = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function xr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Sr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Cr(o, r, n) && !gr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Sr(r, o, l) : !!o;
	return !1;
}
function Sr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!u(e, a) || Cr(t, e, a) && !gr(n, a)) return !0;
	}
	return !1;
}
function Cr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !z(r, i) : r !== i;
}
function wr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Tr = {}, Er = () => Object.create(Tr), Dr = (e) => Object.getPrototypeOf(e) === Tr;
function Or(e, t, n, r = !1) {
	let i = {}, a = Er();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ar(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Et(i) : e.type.props ? i : a, e.attrs = a;
}
function kr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ G(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (gr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = O(o);
						i[t] = jr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Ar(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = A(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = jr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && We(e.attrs, "set", "");
}
function Ar(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = O(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : gr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ G(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = jr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function jr(e, t, n, r, i, a) {
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === A(n)) && (r = !0));
	}
	return r;
}
function Mr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = O(c[e]);
		Nr(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = O(e);
		if (Nr(t)) {
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
function Nr(e) {
	return e[0] !== "$" && !T(e);
}
var Pr = (e) => e === "_" || e === "_ctx" || e === "$stable", Fr = (e) => d(e) ? e.map(xi) : [xi(e)], Ir = (e, t, n) => {
	if (t._n) return t;
	let r = yn((...e) => Fr(t(...e)), n);
	return r._c = !1, r;
}, Lr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Pr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Ir(n, i, r);
		else if (i != null) {
			let e = Fr(i);
			t[n] = () => e;
		}
	}
}, Rr = (e, t) => {
	let n = Fr(t);
	e.slots.default = () => n;
}, zr = (e, t, n) => {
	for (let r in t) (n || !Pr(r)) && (e[r] = t[r]);
}, Br = (e, t, n) => {
	let r = e.slots = Er();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (zr(r, t, n), n && P(r, "_", e, !0)) : Lr(t, r);
	} else t && Rr(e, t);
}, Vr = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : zr(a, n, r) : (o = !n.$stable, Lr(n, a)), s = n;
	} else n && (Rr(e, n), s = { default: 1 });
	if (o) for (let e in a) !Pr(e) && s[e] == null && delete a[e];
}, X = $r;
function Hr(e) {
	return Ur(e);
}
function Ur(e, i) {
	let a = ne();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !fi(e, t) && (i = ue(e), L(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case ei:
				y(e, t, r, i);
				break;
			case ti:
				b(e, t, r, i);
				break;
			case ni:
				e ?? x(t, r, i, s);
				break;
			case Z:
				j(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? M(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, z);
		}
		d != null && a ? Yn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Yn(e.ref, null, o, e, !0);
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
				n && n._beginPatch(), k(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, E = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, Wr(e, a), s, u), _ && xn(e, null, r, "created"), D(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Ti(f, r, e);
		}
		_ && xn(e, null, r, "beforeMount");
		let v = Kr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && X(() => {
			try {
				f && Ti(f, r, e), v && g.enter(d), _ && xn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, D = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Qr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				D(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Si(e[l]) : xi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Gr(r, !1), (g = h.onVnodeBeforeUpdate) && Ti(g, r, n, e), f && xn(n, e, r, "beforeUpdate"), r && Gr(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? A(e.dynamicChildren, d, l, r, i, Wr(n, a), o) : s || re(e, n, l, null, r, i, Wr(n, a), o, !1), u > 0) {
			if (u & 16) ee(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ee(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && X(() => {
			g && Ti(g, r, n, e), f && xn(n, e, r, "updated");
		}, i);
	}, A = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Zr(c), d = u && (c.type === Z || !fi(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, ee = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, j = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (A(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && qr(e, t, !0)) : re(e, t, n, f, i, a, s, c, l);
	}, M = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : P(t, n, r, i, a, o, c) : F(e, t, c);
	}, P = (e, t, n, r, i, a, o) => {
		let s = e.component = ki(e, r, i);
		if (Qn(e) && (s.ctx.renderer = z), Ri(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, te, o, a), !e.el) {
				let r = s.subTree = hi(ti);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else te(s, e, t, n, i, a, o);
	}, F = (e, t, n) => {
		let r = t.component = e.component;
		if (xr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, I(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, te = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Yr(e);
					if (n) {
						t && (t.el = c.el, I(e, t, o)), n.asyncDep.then(() => {
							X(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Gr(e, !1), t ? (t.el = c.el, I(e, t, o)) : t = c, n && N(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ti(d, s, t, c), Gr(e, !0);
				let f = _r(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ue(p), e, i, a), t.el = f.el, u === null && wr(e, f.el), r && X(r, i), (d = t.props && t.props.onVnodeUpdated) && X(() => Ti(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Zn(t);
				if (Gr(e, !1), l && N(l), !m && (o = c && c.onVnodeBeforeMount) && Ti(o, d, t), Gr(e, !0), s && pe) {
					let t = () => {
						e.subTree = _r(e), pe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = _r(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && X(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					X(() => Ti(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Zn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && X(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new ye(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => sn(u), Gr(e, !0), l();
	}, I = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, kr(e, t.props, r, n), Vr(e, t.children, n), Ne(), un(e), Pe();
	}, re = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ae(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				ie(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && le(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ae(l, d, n, r, i, a, o, s, c) : le(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, ie = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? Si(t[p]) : xi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? le(e, a, o, !0, !1, f) : O(t, r, i, a, o, s, c, l, f);
	}, ae = (e, t, r, i, a, o, s, c, l) => {
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
		} else if (u > p) for (; u <= f;) L(e[u], a, o, !0), u++;
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
					L(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && fi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? L(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Jr(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Zr(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? oe(n, r, p, 2) : _--);
			}
		}
	}, oe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) oe(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, z);
		else if (c === Z) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) oe(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === ni) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Vn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), X(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Vn];
					a._isLeaving && a[Vn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, L = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ne(), Yn(s, null, n, e, !0), Pe()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Zn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ti(_, t, e), u & 6) R(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && xn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, z, r) : l && !l.hasOnce && (a !== Z || d > 0 && d & 64) ? le(l, t, n, !1, !0) : (a === Z && d & 384 || !i && u & 16) && le(c, t, n), r && se(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && X(() => {
			_ && Ti(_, t, e), h && xn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, se = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === Z;
		if (a && !i) {
			ce(n, r);
			return;
		}
		if (t === ni) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? Gn(e) : e, c = () => {
			a ? m(n) && ce(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, ce = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, R = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Xr(c), Xr(l), r && N(r), i.stop(), a ? (a.flags |= 8, L(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, L(o, e, t, n)), s && X(s, t), X(() => {
			e.isUnmounted = !0;
		}, t);
	}, le = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) L(e[o], t, n, r, i);
	}, ue = (e) => {
		if (e.shapeFlag & 6) return ue(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[On];
		return n ? h(n) : t;
	}, de = (e, t, n) => {
		pn(() => {
			e == null ? t._vnode && L(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Oi());
	}, z = {
		p: v,
		um: L,
		m: oe,
		r: se,
		mt: P,
		mc: O,
		pc: re,
		pbc: A,
		n: ue,
		o: e
	}, fe, pe;
	return i && ([fe, pe] = i(z)), {
		render: de,
		hydrate: fe,
		createApp: dr(de, fe)
	};
}
function Wr({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Gr({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Kr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function qr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Si(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && qr(t, a)), a.type === ei && (a.patchFlag === -1 && (a = i[e] = Si(a)), a.el = t.el), a.type === ti && !a.el && (a.el = t.el);
	}
}
function Jr(e) {
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
function Yr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Yr(t);
}
function Xr(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Zr(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Zr(t.subTree) : null;
}
var Qr = (e) => e.__isSuspense;
function $r(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : ln(e);
}
var Z = /* @__PURE__ */ Symbol.for("v-fgt"), ei = /* @__PURE__ */ Symbol.for("v-txt"), ti = /* @__PURE__ */ Symbol.for("v-cmt"), ni = /* @__PURE__ */ Symbol.for("v-stc"), ri = [], Q = null;
function ii(e = !1) {
	ri.push(Q = e ? null : []);
}
function ai() {
	ri.pop(), Q = ri[ri.length - 1] || null;
}
var oi = 1;
function si(e, t = !1) {
	oi += e, e < 0 && Q && t && (Q.hasOnce = !0);
}
function ci(e) {
	return e.dynamicChildren = oi > 0 ? Q || n : null, ai(), oi > 0 && Q && Q.push(e), e;
}
function li(e, t, n, r, i, a) {
	return ci($(e, t, n, r, i, a, !0));
}
function ui(e, t, n, r, i) {
	return ci(hi(e, t, n, r, i, !0));
}
function di(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function fi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var pi = ({ key: e }) => e ?? null, mi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ K(e) || h(e) ? {
	i: gn,
	r: e,
	k: t,
	f: !!n
} : e);
function $(e, t = null, n = null, r = 0, i = null, a = e === Z ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && pi(t),
		ref: t && mi(t),
		scopeId: _n,
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
		ctx: gn
	};
	return s ? (Ci(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), oi > 0 && !o && Q && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Q.push(c), c;
}
var hi = gi;
function gi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== rr || (e = ti), di(e)) {
		let r = vi(e, t, !0);
		return n && Ci(r, n), oi > 0 && !a && Q && (r.shapeFlag & 6 ? Q[Q.indexOf(e)] = r : Q.push(r)), r.patchFlag = -2, r;
	}
	if (Gi(e) && (e = e.__vccOpts), t) {
		t = _i(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = L(e)), v(n) && (/* @__PURE__ */ Mt(n) && !d(n) && (n = s({}, n)), t.style = I(n));
	}
	let o = g(e) ? 1 : Qr(e) ? 128 : kn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return $(e, t, n, r, i, o, a, !0);
}
function _i(e) {
	return e ? /* @__PURE__ */ Mt(e) || Dr(e) ? s({}, e) : e : null;
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
		patchFlag: t && e.type !== Z ? o === -1 ? 16 : o | 16 : o,
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
	return c && r && Wn(u, c.clone(u)), u;
}
function yi(e = " ", t = 0) {
	return hi(ei, null, e, t);
}
function bi(e = "", t = !1) {
	return t ? (ii(), ui(ti, null, e)) : hi(ti, null, e);
}
function xi(e) {
	return e == null || typeof e == "boolean" ? hi(ti) : d(e) ? hi(Z, null, e.slice()) : di(e) ? Si(e) : hi(ei, null, String(e));
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
			!r && !Dr(t) ? t._ctx = gn : r === 3 && gn && (gn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			Ci(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: gn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [yi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function wi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = L([t.class, r.class]));
		else if (e === "style") t.style = I([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ti(e, t, n, r = null) {
	Yt(e, t, 7, [n, r]);
}
var Ei = lr(), Di = 0;
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
		scope: new ge(!0),
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
		propsOptions: Mr(i, a),
		emitsOptions: hr(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = mr.bind(null, o), e.ce && e.ce(o), o;
}
var Ai = null, ji = () => Ai || gn, Mi, Ni;
{
	let e = ne(), t = (t, n) => {
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
	Or(e, r, a, t), Br(e, i, n || t);
	let o = a ? zi(e, t) : void 0;
	return t && Ni(!1), o;
}
function zi(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, cr);
	let { setup: r } = n;
	if (r) {
		Ne();
		let n = e.setupContext = r.length > 1 ? Ui(e) : null, i = Pi(e), a = Jt(r, e, 0, [e.props, n]), o = y(a);
		if (Pe(), i(), (o || e.sp) && !Zn(e) && Kn(e), o) {
			if (a.then(Fi, Fi), t) return a.then((n) => {
				Ni(!0);
				try {
					Bi(e, n, t);
				} finally {
					Ni(!1);
				}
			}).catch((t) => {
				Xt(t, e, 0);
			});
			e.asyncDep = a;
		} else Bi(e, a, t);
	} else Vi(e, t);
}
function Bi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = zt(t)), Vi(e, n);
}
function Vi(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var Hi = { get(e, t) {
	return W(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(zt(Nt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in or) return or[n](e);
		},
		has(e, t) {
			return t in e || t in or;
		}
	}) : e.proxy;
}
function Gi(e) {
	return h(e) && "__vccOpts" in e;
}
var Ki = (e, t) => /* @__PURE__ */ Vt(e, t, Li), qi = "3.5.44", Ji = void 0, Yi = typeof window < "u" && window.trustedTypes;
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
		la.test(n) ? e.setProperty(A(r), n.replace(la, ""), "important") : e[r] = n;
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
	let r = O(t);
	if (r !== "filter" && r in e) return fa[t] = r;
	r = ee(r);
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
function ga(e, t, n, r, i, a = se(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ha, t.slice(6, t.length)) : e.setAttributeNS(ha, t, n) : n == null || a && !ce(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
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
		r === "boolean" ? n = ce(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : A(e.slice(2)), t];
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
				e && Yt(e, t, 5, a);
			}
		} else Yt(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Da(), n;
}
var ka = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Aa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? ra(e, r, c) : t === "style" ? ca(e, n, r) : a(t) ? o(t) || xa(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ja(e, t, r, c)) ? (_a(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || ga(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ma(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? _a(e, O(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ga(e, t, r, c));
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
	let r = O(t);
	return Array.isArray(n) ? n.some((e) => O(e) === r) : Object.keys(n).some((e) => O(e) === r);
}
var Na = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => N(t, e) : t;
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
	return t && (e = e.trim()), n && (e = F(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? F(e.value) : e.value, c = t ?? "";
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
				let e = fe(t, n), a = e !== -1;
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
	if (d(t)) i = fe(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = z(t, Ka(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Ha = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, va(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? F(Ga(e)) : Ga(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[Ia](i);
			} finally {
				an(() => {
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
	if (!n || d(e)) return z(e, t);
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
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : fe(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (z(Ga(a), t)) {
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
	return Za ||= Hr(Xa);
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
// admin/src/format.js
function no(e) {
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
var ro = [
	"play",
	"eduhoot",
	"recursos",
	"quiosc"
], io = {
	"commons-modules-job": /^edutictac-commons-modules-\d{14}-[a-f0-9]{8}$/,
	"commons-backup-job": /^edutictac-commons-(?:backup-\d{14}-[a-f0-9]{8}|restore-\d{14})$/,
	"commons-images-job": /^edutictac-commons-(?:update|rollback)-\d{14}$/
};
function ao() {
	let e = location.pathname.startsWith("/admin/") ? "/admin" : "", t = /* @__PURE__ */ q(window.i18nAdmin.getLang()), n = (e, n) => (t.value, window.i18nAdmin.t(e, n)), { renderStatus: r, renderUpdateStatus: i } = no(n), a = /* @__PURE__ */ q(!1), o = /* @__PURE__ */ q(!1), s = /* @__PURE__ */ q(!1), c = /* @__PURE__ */ q(!1), l = /* @__PURE__ */ q(!0), u = /* @__PURE__ */ q(null), d = /* @__PURE__ */ q(null), f = /* @__PURE__ */ q([]), p = /* @__PURE__ */ q(""), m = /* @__PURE__ */ q(), h = /* @__PURE__ */ q(!1), g = /* @__PURE__ */ q(!1), _ = /* @__PURE__ */ q("status.checking"), v = /* @__PURE__ */ q(""), y = /* @__PURE__ */ q({ key: "common.actionPlaceholder" }), b = /* @__PURE__ */ q(""), x = /* @__PURE__ */ Tt({
		username: "",
		name: "",
		email: ""
	}), S = /* @__PURE__ */ q(null), C = /* @__PURE__ */ q(""), w = /* @__PURE__ */ q(!1), T = /* @__PURE__ */ q(""), E = /* @__PURE__ */ q(""), D = /* @__PURE__ */ q(null), O = /* @__PURE__ */ q(!1), k = 0, A = 0, ee = 0, j = 0, M = 0, N = 0, P = /* @__PURE__ */ q(null), F = /* @__PURE__ */ q(!1), te = Ki(() => O.value ? "paused" : F.value ? "polling" : P.value === null ? "idle" : "waiting"), ne = Ki(() => s.value || !!D.value || d.value?.phase === "applying"), I = Ki(() => l.value && a.value && !ne.value), re = Ki(() => !!d.value?.manageable), ie = Ki(() => (u.value?.backups || []).filter((e) => !e.error)), ae = Ki(() => ie.value.filter((e) => e.update)), oe = Ki(() => u.value?.backup_secondary || {
		enabled: !1,
		mount: "",
		last: {}
	}), L = Ki(() => v.value ? n(v.value) : u.value ? r(u.value) : n("status.signInToView")), se = Ki(() => y.value.log === void 0 ? y.value.updates ? i(y.value.updates) : y.value.key ? n(y.value.key, y.value.vars) : y.value.text || "" : y.value.log + "\n\n" + n(y.value.key)), ce = Ki(() => n(p.value || (a.value ? d.value ? re.value ? ne.value ? "modules.applying" : d.value.error ? "modules.failed" : d.value.configured ? "modules.ready" : "modules.firstHint" : "modules.updateInstaller" : "modules.unavailable" : "modules.signIn"))), R = Ki(() => {
		if (!a.value) return "";
		let e = oe.value, t = e.last || {}, r = t.error === "invalid_configuration" ? "failed" : e.enabled ? t.result || "ready" : "disabled", i = [
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
	function le(e, t) {
		try {
			t === null ? sessionStorage.removeItem(e) : sessionStorage.setItem(e, t);
		} catch {}
	}
	function ue() {
		for (let [e, t] of Object.entries(io)) {
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
				le(e, null);
			}
		}
		return null;
	}
	function de() {
		S.value = null, x.username = "", x.name = "", x.email = "", b.value = "";
	}
	function z() {
		m.value?.close(), h.value = !1, g.value = !0;
	}
	function fe() {
		++k, ++A, ++ee, ++j, a.value = !1, s.value = !1, y.value = { key: "common.actionPlaceholder" }, u.value = null, d.value = null, f.value = [], de(), T.value = "", E.value = "", C.value = "", w.value = !1, v.value = "", p.value = "", z();
	}
	async function pe(t, n = {}, r = () => !0) {
		let i = k, a = N, o = await fetch(e + t, {
			credentials: "same-origin",
			cache: "no-store",
			...n
		});
		if (o.status === 401 || o.status === 403) {
			i === k && a === N && l.value && r() && (fe(), _.value = "status.authRequired");
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
	function B(e, t = !1) {
		y.value = {
			key: e,
			error: t
		};
	}
	async function me() {
		if (!a.value || !l.value) return;
		let e = k, t = ++ee;
		try {
			let n = await pe("/api/modules", {}, () => t === ee);
			if (e !== k || t !== ee || !l.value) return;
			d.value && n.revision === d.value.revision && n.phase !== "failed" || (f.value = ro.filter((e) => n.enabled?.includes(e))), d.value = n, p.value = "", n.manageable && !n.configured && !ne.value && !g.value && (h.value = !0);
		} catch {
			e === k && t === ee && (d.value = null, p.value = "modules.unavailable");
		}
	}
	async function he() {
		if (!l.value) return;
		let e = k, t = ++A;
		o.value = !0;
		try {
			let n = await pe("/api/status", {}, () => t === A);
			if (e !== k || t !== A || !l.value) return;
			a.value = !0, u.value = n, v.value = "", _.value = "status.connected", ie.value.some((e) => e.name === T.value) || (T.value = ie.value[0]?.name || ""), ae.value.some((e) => e.name === E.value) || (E.value = ae.value[0]?.name || ""), w.value || (C.value = oe.value.mount || ""), await me(), D.value && !F.value && P.value === null && ge();
		} catch {
			e === k && t === A && (fe(), _.value = "status.disconnected", v.value = "admin.loadError");
		} finally {
			t !== A && a.value || (o.value = !1);
		}
	}
	function V() {
		P.value !== null && clearTimeout(P.value), P.value = null;
	}
	function ge() {
		V(), l.value && D.value && !O.value && (P.value = setTimeout(_e, 3e3));
	}
	async function _e() {
		if (F.value || !D.value || !l.value) return;
		F.value = !0, P.value = null;
		let e = D.value, t = N, n = A, r = () => t === N && l.value && D.value === e;
		try {
			let i = await pe("/api/job-status?unit=" + encodeURIComponent(e.unit), {}, () => r() && n === A);
			if (!r()) return;
			M = 0, i.running ? (y.value = {
				log: i.log || "",
				key: "job.running"
			}, Date.now() - e.startedAt > H(e) ? ve() : ge()) : (le(e.key, null), D.value = ue(), y.value = {
				log: i.log || "",
				key: i.result === "success" ? "job.success" : "job.failed",
				error: i.result !== "success"
			}, await he(), (r() || t === N && l.value && D.value) && ge());
		} catch {
			if (!r()) return;
			M++, Date.now() - e.startedAt > H(e) || e.key !== "commons-backup-job" && M > 30 ? ve() : (B("job.reconnecting"), ge());
		} finally {
			t === N && (F.value = !1);
		}
	}
	function H(e) {
		return e.key === "commons-backup-job" ? 18e5 : 6e5;
	}
	function ve() {
		O.value = !0, B("job.timeout", !0);
	}
	function ye() {
		D.value && !s.value && (D.value = {
			...D.value,
			startedAt: Date.now()
		}, M = 0, O.value = !1, ge());
	}
	function be(e, t) {
		if (!io[t]?.test(e)) throw Error("invalid_job");
		D.value = {
			unit: e,
			key: t,
			startedAt: Date.now()
		}, le(t, e), O.value = !1, M = 0, ge();
	}
	async function xe(e, t = {}, r = null) {
		if (!I.value) return;
		s.value = !0, S.value = null;
		let i = k, a = ++j;
		B("common.executing");
		try {
			let o = await pe(e, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...e === "/api/modules" ? { "X-Commons-Modules": "1" } : e.startsWith("/api/backup/") ? { "X-Commons-Backup": "1" } : {}
				},
				body: JSON.stringify(t)
			});
			if (i !== k || a !== j || !l.value) return;
			if (!o.ok) throw Error(o.output || "operation_failed");
			r ? (be(o.unit, r), r === "commons-modules-job" && z()) : (y.value = { text: o.output || n("job.success") }, await he());
		} catch (t) {
			if (i !== k || a !== j || !l.value) return;
			if (e === "/api/modules") {
				if (await me(), i !== k) return;
				let e = [
					"configuration_changed",
					"operation_busy",
					"quiosc_not_prepared",
					"host_runner_unavailable"
				].includes(t.message) ? "modules.error." + t.message : "modules.failed";
				p.value = e, B(e, !0);
			} else B("admin.operationError", !0);
		} finally {
			a === j && (s.value = !1);
		}
	}
	function Se() {
		if (re.value && I.value) return xe("/api/modules", {
			enabled: ro.filter((e) => f.value.includes(e)),
			revision: d.value.revision
		}, "commons-modules-job");
	}
	async function Ce() {
		if (!I.value) return;
		let e = Object.fromEntries(Object.entries(x).map(([e, t]) => [e, t.trim()]));
		if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,149}$/.test(e.username) || !e.name) return;
		s.value = !0, S.value = null, b.value = "teachers.creating";
		let t = k, n = ++j;
		try {
			let n = await pe("/api/teachers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(e)
			});
			if (t !== k || !l.value) return;
			if (!n.teacher?.username || !n.teacher?.temporary_password) throw Error("invalid_teacher");
			de(), S.value = {
				username: n.teacher.username,
				password: n.teacher.temporary_password
			};
		} catch {
			t === k && l.value && (b.value = "admin.teacherError");
		} finally {
			n === j && (s.value = !1);
		}
	}
	async function we() {
		if (!I.value) return;
		s.value = !0, B("images.checking");
		let e = k, t = ++j;
		try {
			let n = await pe("/api/updates");
			e === k && t === j && l.value && (y.value = n.output ? {
				text: n.output,
				error: n.ok === !1
			} : {
				updates: n,
				error: n.ok === !1
			});
		} catch {
			e === k && t === j && B("admin.operationError", !0);
		} finally {
			t === j && (s.value = !1);
		}
	}
	function Te(e, t) {
		if (I.value && window.confirm(n(t))) return xe(e);
	}
	function Ee() {
		if (I.value && window.confirm(n("backup.createConfirm"))) return xe("/api/backup/create", {}, "commons-backup-job");
	}
	function De(e) {
		if (!I.value) return;
		let t = {
			restore: T.value,
			rollback: E.value
		}, r = e === "restore" ? "backup.restore" : e === "rollback" ? "images.rollback" : "images.update";
		if (e !== "update" && !t[e]) B(e === "restore" ? "backup.noneSelected" : "images.rollbackNone", !0);
		else if (window.prompt(n(r + "Prompt", { backup: t[e] })) !== n(r + "ConfirmWord")) B(r + "Cancelled");
		else return xe("/api/" + (e === "restore" ? "backup/restore" : "images/" + e), e === "update" ? {} : { backup: t[e] }, e === "restore" ? "commons-backup-job" : "commons-images-job");
	}
	function Oe(e) {
		if (I.value) {
			if (e === "configure" && (!C.value.trim().startsWith("/") || C.value.trim() === "/")) B("secondary.error.invalid_configuration", !0);
			else return w.value = !1, xe("/api/backup/secondary", e === "configure" ? {
				action: e,
				mount: C.value.trim()
			} : { action: e }, "commons-backup-job");
		}
	}
	async function ke() {
		if (c.value) return;
		c.value = !0, ++N, V(), F.value = !1, fe(), s.value = !0, o.value = !1, y.value = { key: "common.actionPlaceholder" }, _.value = "status.disconnected";
		let e = j;
		try {
			await fetch("/api/auth/oidc/logout", {
				method: "POST",
				credentials: "same-origin",
				cache: "no-store"
			});
		} catch {
			e === j && l.value && (_.value = "status.authRequired");
		} finally {
			e === j && (s.value = !1, c.value = !1);
		}
	}
	function Ae() {
		s.value || (location.href = "/api/auth/oidc/login?next=%2Fadmin%2F");
	}
	function je() {
		t.value = window.i18nAdmin.getLang();
	}
	function U() {
		l.value = !1, ++N, V(), F.value = !1, fe(), s.value = !1, c.value = !1, y.value = { key: "common.actionPlaceholder" }, o.value = !1, document.getElementById("adminApp")?.setAttribute("hidden", "");
	}
	async function Me(e) {
		e.persisted && (l.value = !0, document.getElementById("adminApp")?.removeAttribute("hidden"), D.value = ue(), O.value = !1, await he(), ge());
	}
	return tr(() => {
		D.value = ue(), D.value && B("modules.applying"), he(), ge(), window.addEventListener("edutictac:langchange", je), window.addEventListener("pagehide", U), window.addEventListener("pageshow", Me);
	}), nr(() => {
		U(), window.removeEventListener("edutictac:langchange", je), window.removeEventListener("pagehide", U), window.removeEventListener("pageshow", Me);
	}), {
		t: n,
		language: t,
		authorized: a,
		checking: o,
		pending: s,
		loggingOut: c,
		busy: ne,
		canWrite: I,
		status: u,
		statusText: L,
		output: y,
		actionText: se,
		apiMessage: _,
		modules: d,
		selected: f,
		moduleManageable: re,
		moduleError: p,
		modulesNotice: ce,
		wizard: m,
		wizardOpen: h,
		dismissed: g,
		closeWizard: z,
		teacher: x,
		teacherMessage: b,
		credential: S,
		clearTeacher: de,
		mount: C,
		mountDirty: w,
		restore: T,
		rollback: E,
		backups: ie,
		rollbacks: ae,
		secondary: oe,
		secondaryText: R,
		job: D,
		pollState: te,
		trackingPaused: O,
		loadStatus: he,
		applyModules: Se,
		createTeacher: Ce,
		checkUpdates: we,
		confirmed: Te,
		backupCreate: Ee,
		typedAction: De,
		secondaryAction: Oe,
		operation: xe,
		logout: ke,
		login: Ae,
		resumeTracking: ye
	};
}
// admin/src/AdminApp.vue
var oo = { class: "topbar" }, so = { class: "topbar-actions" }, co = {
	id: "apiStatus",
	class: "status",
	role: "status"
}, lo = ["title"], uo = ["aria-current"], fo = ["aria-current"], po = ["aria-current"], mo = ["aria-current"], ho = { class: "single-layout" }, go = {
	class: "panel",
	"aria-labelledby": "loginTitle"
}, _o = { class: "panel-heading" }, vo = { class: "eyebrow" }, yo = { id: "loginTitle" }, bo = { class: "actions" }, xo = ["disabled"], So = ["disabled"], Co = ["disabled"], wo = {
	id: "modulesPanel",
	class: "panel",
	"aria-labelledby": "modulesTitle"
}, To = { class: "panel-heading" }, Eo = { class: "eyebrow" }, Do = { id: "modulesTitle" }, Oo = {
	class: "panel",
	"aria-labelledby": "teacherTitle"
}, ko = { class: "panel-heading" }, Ao = { class: "eyebrow" }, jo = { id: "teacherTitle" }, Mo = ["disabled"], No = { class: "actions" }, Po = { type: "submit" }, Fo = {
	class: "panel",
	"aria-labelledby": "statusTitle"
}, Io = { class: "panel-heading" }, Lo = { class: "eyebrow" }, Ro = { id: "statusTitle" }, zo = {
	class: "panel",
	"aria-labelledby": "actionsTitle"
}, Bo = { class: "panel-heading" }, Vo = { class: "eyebrow" }, Ho = { id: "actionsTitle" }, Uo = { class: "actions" }, Wo = ["disabled"], Go = ["disabled"], Ko = ["disabled"], qo = ["disabled"], Jo = { class: "hint" }, Yo = { for: "secondaryMount" }, Xo = { class: "hint" }, Zo = { class: "actions" }, Qo = {
	id: "secondarySave",
	type: "submit"
}, $o = ["disabled"], es = ["disabled"], ts = {
	id: "secondaryStatus",
	role: "status",
	"aria-live": "polite"
}, ns = ["disabled"], rs = {
	key: 0,
	value: ""
}, is = ["value"], as = { class: "actions" }, os = ["disabled"], ss = { class: "panel-heading compact" }, cs = { class: "eyebrow" }, ls = { class: "actions" }, us = ["disabled"], ds = ["disabled"], fs = ["disabled"], ps = {
	key: 0,
	value: ""
}, ms = ["value"], hs = { class: "actions" }, gs = ["disabled"], _s = { class: "panel-heading compact" }, vs = { class: "eyebrow" }, ys = { class: "hint" }, bs = { class: "actions" }, xs = ["disabled"], Ss = ["disabled"], Cs = ["data-state"], ws = {
	class: "lang-switcher",
	role: "group",
	"aria-label": "Idioma"
}, Ts = ["aria-current"], Es = ["aria-current"], Ds = ["aria-current"], Os = ["aria-current"], ks = { id: "modulesWizardTitle" }, As = ["disabled"], js = { class: "module-choice" }, Ms = { class: "module-choice" }, Ns = { class: "module-choice" }, Ps = { class: "module-choice" }, Fs = ["disabled"], Is = ["hidden"], Ls = { class: "hint" }, Rs = {
	id: "modulesNotice",
	role: "status",
	"aria-live": "polite"
}, zs = { class: "actions" }, Bs = ["disabled"], Vs = ["hidden"], Hs = {
	__name: "AdminApp",
	setup(e) {
		let { t, language: n, authorized: r, checking: i, pending: a, loggingOut: o, canWrite: s, statusText: c, output: l, actionText: u, apiMessage: d, modules: f, selected: p, moduleManageable: m, modulesNotice: h, wizard: g, wizardOpen: _, closeWizard: v, teacher: y, teacherMessage: b, credential: x, clearTeacher: S, mount: C, mountDirty: w, restore: T, rollback: E, backups: D, rollbacks: O, secondary: k, secondaryText: A, job: ee, pollState: j, trackingPaused: M, loadStatus: N, applyModules: P, createTeacher: F, checkUpdates: te, confirmed: ne, backupCreate: I, typedAction: re, secondaryAction: ie, operation: ae, logout: oe, login: se, resumeTracking: ce } = ao();
		return Tn(_, async (e) => {
			await an(), e && !g.value?.open ? g.value?.showModal() : !e && g.value?.open && g.value.close();
		}), (e, R) => (ii(), li(Z, null, [
			$("header", oo, [$("div", null, [R[32] ||= $("p", { class: "eyebrow" }, "EduTicTac Commons", -1), $("h1", null, B(J(t)("admin.title")), 1)]), $("div", so, [$("span", co, B(J(t)(J(d))), 1), $("div", {
				class: "lang-switcher",
				role: "group",
				"aria-label": "Idioma",
				title: J(t)("common.lang.label")
			}, [
				$("button", {
					type: "button",
					"data-lang": "ca",
					class: L({ active: J(n) === "ca" }),
					"aria-current": J(n) === "ca" ? "true" : void 0,
					title: "Català"
				}, "CA", 10, uo),
				$("button", {
					type: "button",
					"data-lang": "va",
					class: L({ active: J(n) === "va" }),
					"aria-current": J(n) === "va" ? "true" : void 0,
					title: "Valencià"
				}, "VA", 10, fo),
				$("button", {
					type: "button",
					"data-lang": "es",
					class: L({ active: J(n) === "es" }),
					"aria-current": J(n) === "es" ? "true" : void 0,
					title: "Español"
				}, "ES", 10, po),
				$("button", {
					type: "button",
					"data-lang": "en",
					class: L({ active: J(n) === "en" }),
					"aria-current": J(n) === "en" ? "true" : void 0,
					title: "English"
				}, "EN", 10, mo)
			], 8, lo)])]),
			$("main", ho, [
				$("section", go, [$("div", _o, [$("p", vo, B(J(t)("login.access")), 1), $("h2", yo, B(J(t)("login.title")), 1)]), $("div", bo, [
					$("button", {
						id: "loginBtn",
						onClick: R[0] ||= (...e) => J(se) && J(se)(...e),
						disabled: J(a),
						type: "button"
					}, B(J(t)("login.enter")), 9, xo),
					$("button", {
						id: "logoutBtn",
						onClick: R[1] ||= (...e) => J(oe) && J(oe)(...e),
						disabled: J(o),
						type: "button",
						class: "secondary"
					}, B(J(t)("login.logout")), 9, So),
					$("button", {
						id: "refreshBtn",
						onClick: R[2] ||= (...e) => J(N) && J(N)(...e),
						disabled: J(i) || J(a),
						type: "button",
						class: "secondary"
					}, B(J(t)("login.refresh")), 9, Co)
				])]),
				$("section", wo, [$("div", To, [$("p", Eo, B(J(t)("modules.label")), 1), $("h2", Do, B(J(t)("modules.title")), 1)]), R[33] ||= $("div", { id: "modulesFormHome" }, null, -1)]),
				$("section", Oo, [
					$("div", ko, [$("p", Ao, B(J(t)("teachers.label")), 1), $("h2", jo, B(J(t)("teachers.title")), 1)]),
					$("form", {
						id: "teacherForm",
						onSubmit: R[6] ||= Ya((...e) => J(F) && J(F)(...e), ["prevent"])
					}, [$("fieldset", {
						disabled: !J(s),
						class: "teacher-fields"
					}, [
						$("label", null, [$("span", null, B(J(t)("teachers.username")), 1), bn($("input", {
							id: "teacherUsername",
							"onUpdate:modelValue": R[3] ||= (e) => J(y).username = e,
							required: "",
							autocomplete: "off",
							pattern: "[A-Za-z0-9][A-Za-z0-9._-]{2,149}"
						}, null, 512), [[za, J(y).username]])]),
						$("label", null, [$("span", null, B(J(t)("teachers.name")), 1), bn($("input", {
							id: "teacherName",
							"onUpdate:modelValue": R[4] ||= (e) => J(y).name = e,
							required: "",
							autocomplete: "name"
						}, null, 512), [[za, J(y).name]])]),
						$("label", null, [$("span", null, B(J(t)("teachers.email")), 1), bn($("input", {
							id: "teacherEmail",
							"onUpdate:modelValue": R[5] ||= (e) => J(y).email = e,
							type: "email",
							autocomplete: "email"
						}, null, 512), [[za, J(y).email]])]),
						$("div", No, [$("button", Po, B(J(t)("teachers.create")), 1)])
					], 8, Mo)], 32),
					$("div", {
						id: "teacherOutput",
						class: L(["output", {
							empty: !J(x) && !J(b),
							error: J(b) === "admin.teacherError"
						}]),
						role: "status"
					}, B(J(x) ? J(t)("teachers.created", {
						username: J(x).username,
						password: J(x).password
					}) : J(t)(J(b) || "teachers.help")), 3),
					J(x) ? (ii(), li("button", {
						key: 0,
						id: "clearTeacherCredential",
						class: "secondary",
						onClick: R[7] ||= (...e) => J(S) && J(S)(...e)
					}, B(J(t)("admin.clearCredential")), 1)) : bi("", !0)
				]),
				$("section", Fo, [$("div", Io, [$("p", Lo, B(J(t)("status.label")), 1), $("h2", Ro, B(J(t)("status.title")), 1)]), $("div", {
					id: "statusOutput",
					class: L(["output", { empty: !J(r) }])
				}, B(J(c)), 3)]),
				$("section", zo, [
					$("div", Bo, [$("p", Vo, B(J(t)("common.actions")), 1), $("h2", Ho, B(J(t)("backup.title")), 1)]),
					$("div", Uo, [
						$("button", {
							id: "backupCreateBtn",
							onClick: R[8] ||= (...e) => J(I) && J(I)(...e),
							disabled: !J(s),
							type: "button"
						}, B(J(t)("backup.create")), 9, Wo),
						$("button", {
							id: "timerInstallBtn",
							onClick: R[9] ||= (e) => J(ne)("/api/backup-timer/install", "backup.installTimerConfirm"),
							disabled: !J(s),
							type: "button"
						}, B(J(t)("backup.installTimer")), 9, Go),
						$("button", {
							id: "timerUninstallBtn",
							onClick: R[10] ||= (e) => J(ne)("/api/backup-timer/uninstall", "backup.uninstallTimerConfirm"),
							disabled: !J(s),
							type: "button",
							class: "secondary"
						}, B(J(t)("backup.uninstallTimer")), 9, Ko)
					]),
					$("form", {
						id: "secondaryForm",
						onSubmit: R[15] ||= Ya((e) => J(ie)("configure"), ["prevent"])
					}, [$("fieldset", {
						id: "secondaryControls",
						disabled: !J(s)
					}, [
						$("legend", null, B(J(t)("secondary.title")), 1),
						$("p", Jo, B(J(t)("secondary.help")), 1),
						$("label", Yo, B(J(t)("secondary.mount")), 1),
						bn($("input", {
							id: "secondaryMount",
							"onUpdate:modelValue": R[11] ||= (e) => /* @__PURE__ */ K(C) ? C.value = e : null,
							onInput: R[12] ||= (e) => w.value = !0,
							type: "text",
							placeholder: "/media/commons-backup",
							autocomplete: "off",
							maxlength: "1024",
							required: ""
						}, null, 544), [[za, J(C)]]),
						$("p", Xo, B(J(t)("secondary.mounted")), 1),
						$("div", Zo, [
							$("button", Qo, B(J(t)("secondary.save")), 1),
							$("button", {
								id: "secondaryCopy",
								onClick: R[13] ||= (e) => J(ie)("copy"),
								disabled: !J(s) || !J(k).enabled,
								type: "button",
								class: "secondary"
							}, B(J(t)("secondary.copy")), 9, $o),
							$("button", {
								id: "secondaryDisable",
								onClick: R[14] ||= (e) => J(ie)("disable"),
								disabled: !J(s) || !J(k).enabled,
								type: "button",
								class: "secondary"
							}, B(J(t)("secondary.disable")), 9, es)
						])
					], 8, qo), $("p", ts, B(J(A)), 1)], 32),
					$("label", null, [$("span", null, B(J(t)("backup.restoreLabel")), 1), bn($("select", {
						id: "restoreBackupSelect",
						"onUpdate:modelValue": R[16] ||= (e) => /* @__PURE__ */ K(T) ? T.value = e : null,
						disabled: !J(s) || !J(D).length
					}, [J(D).length ? bi("", !0) : (ii(), li("option", rs, B(J(t)("backup.noneAvailable")), 1)), (ii(!0), li(Z, null, ir(J(D), (e) => (ii(), li("option", {
						key: e.name,
						value: e.name
					}, B(e.name) + " (" + B(e.created_at || J(t)("backup.noDate")) + ")", 9, is))), 128))], 8, ns), [[Ha, J(T)]])]),
					$("div", as, [$("button", {
						id: "backupRestoreBtn",
						onClick: R[17] ||= (e) => J(re)("restore"),
						disabled: !J(s) || !J(T),
						type: "button",
						class: "danger"
					}, B(J(t)("backup.restore")), 9, os)]),
					$("div", ss, [$("p", cs, B(J(t)("images.label")), 1), $("h2", null, B(J(t)("images.title")), 1)]),
					$("div", ls, [$("button", {
						id: "imagesCheckBtn",
						onClick: R[18] ||= (...e) => J(te) && J(te)(...e),
						disabled: !J(s),
						type: "button",
						class: "secondary"
					}, B(J(t)("images.check")), 9, us), $("button", {
						id: "imagesUpdateBtn",
						onClick: R[19] ||= (e) => J(re)("update"),
						disabled: !J(s),
						type: "button",
						class: "danger"
					}, B(J(t)("images.update")), 9, ds)]),
					$("label", null, [$("span", null, B(J(t)("images.rollbackLabel")), 1), bn($("select", {
						id: "rollbackBackupSelect",
						"onUpdate:modelValue": R[20] ||= (e) => /* @__PURE__ */ K(E) ? E.value = e : null,
						disabled: !J(s) || !J(O).length
					}, [J(O).length ? bi("", !0) : (ii(), li("option", ps, B(J(t)("images.rollbackNone")), 1)), (ii(!0), li(Z, null, ir(J(O), (e) => (ii(), li("option", {
						key: e.name,
						value: e.name
					}, B(e.name) + " (→ " + B(e.update.previous_image_tag) + ")", 9, ms))), 128))], 8, fs), [[Ha, J(E)]])]),
					$("div", hs, [$("button", {
						id: "imagesRollbackBtn",
						onClick: R[21] ||= (e) => J(re)("rollback"),
						disabled: !J(s) || !J(E),
						type: "button",
						class: "danger"
					}, B(J(t)("images.rollback")), 9, gs)]),
					$("div", _s, [$("p", vs, B(J(t)("content.label")), 1), $("h2", null, B(J(t)("content.title")), 1)]),
					$("p", ys, B(J(t)("content.help")), 1),
					$("div", bs, [$("button", {
						id: "contentResourcesSyncBtn",
						onClick: R[22] ||= (e) => J(ae)("/api/content-sync/resources"),
						disabled: !J(s),
						type: "button",
						class: "secondary"
					}, B(J(t)("content.resources")), 9, xs), $("button", {
						id: "contentEduhootSyncBtn",
						onClick: R[23] ||= (e) => J(ae)("/api/content-sync/eduhoot"),
						disabled: !J(s),
						type: "button",
						class: "secondary"
					}, B(J(t)("content.eduhoot")), 9, Ss)]),
					$("div", {
						id: "actionOutput",
						class: L(["output", {
							empty: J(l).key === "common.actionPlaceholder",
							error: J(l).error
						}]),
						role: "status"
					}, B(J(u)), 3),
					J(ee) ? (ii(), li("div", {
						key: 0,
						id: "jobTracking",
						"data-state": J(j),
						role: "status"
					}, [yi(B(J(t)("admin.tracking")), 1), J(M) ? (ii(), li("button", {
						key: 0,
						id: "jobResume",
						class: "secondary",
						onClick: R[24] ||= (...e) => J(ce) && J(ce)(...e)
					}, B(J(t)("admin.resumeTracking")), 1)) : bi("", !0)], 8, Cs)) : bi("", !0)
				])
			]),
			$("dialog", {
				ref_key: "wizard",
				ref: g,
				id: "modulesWizard",
				onCancel: R[25] ||= Ya((...e) => J(v) && J(v)(...e), ["prevent"]),
				"aria-labelledby": "modulesWizardTitle"
			}, [
				$("div", ws, [
					$("button", {
						type: "button",
						"data-lang": "ca",
						class: L({ active: J(n) === "ca" }),
						"aria-current": J(n) === "ca" ? "true" : void 0
					}, "CA", 10, Ts),
					$("button", {
						type: "button",
						"data-lang": "va",
						class: L({ active: J(n) === "va" }),
						"aria-current": J(n) === "va" ? "true" : void 0
					}, "VA", 10, Es),
					$("button", {
						type: "button",
						"data-lang": "es",
						class: L({ active: J(n) === "es" }),
						"aria-current": J(n) === "es" ? "true" : void 0
					}, "ES", 10, Ds),
					$("button", {
						type: "button",
						"data-lang": "en",
						class: L({ active: J(n) === "en" }),
						"aria-current": J(n) === "en" ? "true" : void 0
					}, "EN", 10, Os)
				]),
				$("h2", ks, B(J(t)("modules.firstTitle")), 1),
				R[34] ||= $("div", { id: "modulesWizardContent" }, null, -1)
			], 544),
			(ii(), ui(Rn, { to: J(_) ? "#modulesWizardContent" : "#modulesFormHome" }, [$("form", {
				id: "modulesForm",
				onSubmit: R[31] ||= Ya((...e) => J(P) && J(P)(...e), ["prevent"])
			}, [
				$("p", null, B(J(t)("modules.core")), 1),
				$("fieldset", {
					id: "modulesChoices",
					disabled: !J(s) || !J(m)
				}, [
					$("legend", null, B(J(t)("modules.choose")), 1),
					$("label", js, [bn($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[26] ||= (e) => /* @__PURE__ */ K(p) ? p.value = e : null,
						value: "play"
					}, null, 512), [[Ba, J(p)]]), $("span", null, [R[35] ||= $("strong", null, "EduTicTac Play", -1), $("small", null, B(J(t)("modules.play")), 1)])]),
					$("label", Ms, [bn($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[27] ||= (e) => /* @__PURE__ */ K(p) ? p.value = e : null,
						value: "eduhoot"
					}, null, 512), [[Ba, J(p)]]), $("span", null, [R[36] ||= $("strong", null, "EduHoot", -1), $("small", null, B(J(t)("modules.eduhoot")), 1)])]),
					$("label", Ns, [bn($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[28] ||= (e) => /* @__PURE__ */ K(p) ? p.value = e : null,
						value: "recursos"
					}, null, 512), [[Ba, J(p)]]), $("span", null, [$("strong", null, B(J(t)("modules.resourcesName")), 1), $("small", null, B(J(t)("modules.recursos")), 1)])]),
					$("label", Ps, [bn($("input", {
						type: "checkbox",
						name: "module",
						"onUpdate:modelValue": R[29] ||= (e) => /* @__PURE__ */ K(p) ? p.value = e : null,
						value: "quiosc",
						disabled: !J(f)?.available?.quiosc && !J(p).includes("quiosc")
					}, null, 8, Fs), [[Ba, J(p)]]), $("span", null, [R[37] ||= $("strong", null, "EduTicTac Quiosc", -1), $("small", null, B(J(t)("modules.quiosc")), 1)])])
				], 8, As),
				$("p", {
					id: "modulesQuioscHint",
					hidden: !!J(f)?.available?.quiosc,
					class: "hint"
				}, B(J(t)("modules.quioscPreparation")), 9, Is),
				$("p", Ls, B(J(t)("modules.retention")), 1),
				$("p", Rs, B(J(h)), 1),
				$("div", zs, [$("button", {
					id: "modulesApply",
					type: "submit",
					disabled: !J(s) || !J(m)
				}, B(J(t)("modules.apply")), 9, Bs), $("button", {
					id: "modulesLater",
					type: "button",
					class: "secondary",
					hidden: !J(_),
					onClick: R[30] ||= (...e) => J(v) && J(v)(...e)
				}, B(J(t)("modules.later")), 9, Vs)])
			], 32)], 8, ["to"]))
		], 64));
	}
};
// admin/src/main.js
function Us(e) {
	return $a(Hs).mount(e);
}
export { Us as mountAdmin };
