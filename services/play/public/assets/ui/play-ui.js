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
}, te = /-\w/g, E = ee((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, D = ee((e) => e.replace(ne, "-$1").toLowerCase()), re = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = ee((e) => e ? `on${re(e)}` : ""), O = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, oe = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, k = (e) => {
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
function j(e) {
	return !!e || e === "";
}
function he(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = M(e[i], t[i], n);
	return r;
}
function ge(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && M(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function _e(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? ge(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !M(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ve(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function M(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? ve(e, t, n, he) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : ve(e, t, n, _e) : String(e) === String(t))));
}
function ye(e, t) {
	return e.findIndex((e) => M(e, t));
}
var be = (e) => !!(e && e.__v_isRef === !0), N = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? be(e) ? N(e.value) : JSON.stringify(e, xe, 2) : String(e), xe = (e, t) => be(t) ? xe(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Se(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Se(e)) } : _(t) ? Se(t) : v(t) && !d(t) && !C(t) ? String(t) : t, Se = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, P, Ce = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && P && (P.active ? (this.parent = P, this.index = (P.scopes || (P.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = P;
			try {
				return P = this, e();
			} finally {
				P = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = P, P = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (P === this) P = this.prevScope;
			else {
				let e = P;
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
function we() {
	return P;
}
var F, Te = /* @__PURE__ */ new WeakSet(), Ee = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, P && (P.active ? P.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Te.has(this) && (Te.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ae(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ue(this), Ne(this);
		let e = F, t = ze;
		F = this, ze = !0;
		try {
			return this.fn();
		} finally {
			Pe(this), F = e, ze = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Le(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Te.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Fe(this) && this.run();
	}
	get dirty() {
		return Fe(this);
	}
}, De = 0, Oe, ke;
function Ae(e, t = !1) {
	e.flags |= 8, t ? (e.next = ke, ke = e) : (e.next = Oe, Oe = e);
}
function je() {
	De++;
}
function Me() {
	if (--De > 0) return;
	if (ke) {
		let e = ke;
		for (ke = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Oe;) {
		let t = Oe;
		for (Oe = void 0; t;) {
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
function Ne(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Le(r), Re(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Fe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ie(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ie(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === We) || (e.globalVersion = We, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Fe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = F, r = ze;
	F = e, ze = !0;
	try {
		Ne(e);
		let n = e.fn(e._value);
		(t.version === 0 || O(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		F = n, ze = r, Pe(e), e.flags &= -3;
	}
}
function Le(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Le(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Re(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ze = !0, Be = [];
function Ve() {
	Be.push(ze), ze = !1;
}
function He() {
	let e = Be.pop();
	ze = e === void 0 || e;
}
function Ue(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = F;
		F = void 0;
		try {
			t();
		} finally {
			F = e;
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
		if (!F || !ze || F === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== F) t = this.activeLink = new Ge(F, this), F.deps ? (t.prevDep = F.depsTail, F.depsTail.nextDep = t, F.depsTail = t) : F.deps = F.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = F.depsTail, t.nextDep = void 0, F.depsTail.nextDep = t, F.depsTail = t, F.deps === t && (F.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, We++, this.notify(e);
	}
	notify(e) {
		je();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Me();
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
function I(e, t, n) {
	if (ze && F) {
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
	if (je(), t === "clear") o.forEach(s);
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
	Me();
}
function $e(e) {
	let t = /* @__PURE__ */ L(e);
	return t === e || (I(t, "iterate", Ze), /* @__PURE__ */ zt(e)) ? t : /* @__PURE__ */ Rt(e) ? /* @__PURE__ */ Lt(e) ? t.map((e) => Ut(Ht(e))) : t.map(Ut) : t.map(Ht);
}
function et(e) {
	return I(e = /* @__PURE__ */ L(e), "iterate", Ze), e;
}
function tt(e, t) {
	return /* @__PURE__ */ Rt(e) ? Ut(/* @__PURE__ */ Lt(e) ? Ht(t) : t) : Ht(t);
}
var nt = {
	__proto__: null,
	[Symbol.iterator]() {
		return rt(this, Symbol.iterator, (e) => tt(this, e));
	},
	concat(...e) {
		return $e(this).concat(...e.map((e) => d(e) ? $e(e) : e));
	},
	entries() {
		return rt(this, "entries", (e) => (e[1] = tt(this, e[1]), e));
	},
	every(e, t) {
		return ot(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ot(this, "filter", e, t, (e) => e.map((e) => tt(this, e)), arguments);
	},
	find(e, t) {
		return ot(this, "find", e, t, (e) => tt(this, e), arguments);
	},
	findIndex(e, t) {
		return ot(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ot(this, "findLast", e, t, (e) => tt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ot(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ot(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ct(this, "includes", e);
	},
	indexOf(...e) {
		return ct(this, "indexOf", e);
	},
	join(e) {
		return $e(this).join(e);
	},
	lastIndexOf(...e) {
		return ct(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ot(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return lt(this, "pop");
	},
	push(...e) {
		return lt(this, "push", e);
	},
	reduce(e, ...t) {
		return st(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return st(this, "reduceRight", e, t);
	},
	shift() {
		return lt(this, "shift");
	},
	some(e, t) {
		return ot(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return lt(this, "splice", e);
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
		return lt(this, "unshift", e);
	},
	values() {
		return rt(this, "values", (e) => tt(this, e));
	}
};
function rt(e, t, n) {
	let r = et(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ zt(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => it(a.next(), n), i !== at[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => it(a._next(), n);
	}
	return a;
}
function it(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var at = Array.prototype;
function ot(e, t, n, r, i, a) {
	let o = et(e), s = o !== e && !/* @__PURE__ */ zt(e), c = o[t];
	if (c !== at[t]) {
		let t = c.apply(e, a);
		return s ? Ht(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, tt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function st(e, t, n, r) {
	let i = et(e), a = i !== e && !/* @__PURE__ */ zt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = tt(e, t)), n.call(this, t, tt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? tt(e, c) : c;
}
function ct(e, t, n) {
	let r = /* @__PURE__ */ L(e);
	I(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Bt(n[0]) ? (n[0] = /* @__PURE__ */ L(n[0]), r[t](...n)) : i;
}
function lt(e, t, n = []) {
	Ve(), je();
	let r = (/* @__PURE__ */ L(e))[t].apply(e, n);
	return Me(), He(), r;
}
var ut = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), dt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function ft(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ L(this);
	return I(t, "has", e), t.hasOwnProperty(e);
}
var pt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? jt : At : i ? kt : Ot).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = nt[t])) return e;
			if (t === "hasOwnProperty") return ft;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ R(e) ? e : n);
		if ((_(t) ? dt.has(t) : ut(t)) || (r || I(e, "get", t), i)) return o;
		if (/* @__PURE__ */ R(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Ft(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Ft(o) : /* @__PURE__ */ Nt(o) : o;
	}
}, mt = class extends pt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Rt(i);
			if (!/* @__PURE__ */ zt(n) && !/* @__PURE__ */ Rt(n) && (i = /* @__PURE__ */ L(i), n = /* @__PURE__ */ L(n)), !a && /* @__PURE__ */ R(i) && !/* @__PURE__ */ R(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ R(e) ? e : r);
		return e === /* @__PURE__ */ L(r) && s && (o ? O(n, i) && Qe(e, "set", t, n, i) : Qe(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Qe(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return _(t) && dt.has(t) || I(e, "has", t), n;
	}
	ownKeys(e) {
		return I(e, "iterate", d(e) ? "length" : Ye), Reflect.ownKeys(e);
	}
}, ht = class extends pt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, gt = /* @__PURE__ */ new mt(), _t = /* @__PURE__ */ new ht(), vt = /* @__PURE__ */ new mt(!0), yt = (e) => e, bt = (e) => Reflect.getPrototypeOf(e);
function xt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ L(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? yt : t ? Ut : Ht;
		return !t && I(a, "iterate", l ? Xe : Ye), s(Object.create(u), { next() {
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
function St(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Ct(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ L(r), a = /* @__PURE__ */ L(n);
			e || (O(n, a) && I(i, "get", n), I(i, "get", a));
			let { has: o } = bt(i), s = t ? yt : e ? Ut : Ht;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && I(/* @__PURE__ */ L(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ L(n), i = /* @__PURE__ */ L(t);
			return e || (O(t, i) && I(r, "has", t), I(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ L(a), s = t ? yt : e ? Ut : Ht;
			return !e && I(o, "iterate", Ye), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: St("add"),
		set: St("set"),
		delete: St("delete"),
		clear: St("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ L(this), r = bt(n), i = /* @__PURE__ */ L(e), a = !t && !/* @__PURE__ */ zt(e) && !/* @__PURE__ */ Rt(e) ? i : e;
			return r.has.call(n, a) || O(e, a) && r.has.call(n, e) || O(i, a) && r.has.call(n, i) || (n.add(a), Qe(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ zt(n) || /* @__PURE__ */ Rt(n) || (n = /* @__PURE__ */ L(n));
			let r = /* @__PURE__ */ L(this), { has: i, get: a } = bt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ L(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? O(n, s) && Qe(r, "set", e, n, s) : Qe(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ L(this), { has: n, get: r } = bt(t), i = n.call(t, e);
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
		n[r] = xt(r, e, t);
	}), n;
}
function wt(e, t) {
	let n = Ct(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(u(n, i) && i in r ? n : r, i, a);
}
var Tt = { get: /* @__PURE__ */ wt(!1, !1) }, Et = { get: /* @__PURE__ */ wt(!1, !0) }, Dt = { get: /* @__PURE__ */ wt(!0, !1) }, Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap();
function Mt(e) {
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
function Nt(e) {
	return /* @__PURE__ */ Rt(e) ? e : It(e, !1, gt, Tt, Ot);
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return It(e, !1, vt, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return It(e, !0, _t, Dt, At);
}
function It(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Mt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return /* @__PURE__ */ Rt(e) ? /* @__PURE__ */ Lt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function L(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ L(t) : e;
}
function Vt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
}
var Ht = (e) => v(e) ? /* @__PURE__ */ Nt(e) : e, Ut = (e) => v(e) ? /* @__PURE__ */ Ft(e) : e;
// @__NO_SIDE_EFFECTS__
function R(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	return Wt(e, !1);
}
function Wt(e, t) {
	return /* @__PURE__ */ R(e) ? e : new Gt(e, t);
}
var Gt = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ L(e), this._value = t ? e : Ht(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ zt(e) || /* @__PURE__ */ Rt(e);
		e = n ? e : /* @__PURE__ */ L(e), O(e, t) && (this._rawValue = e, this._value = n ? e : Ht(e), this.dep.trigger());
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
	return /* @__PURE__ */ Lt(e) ? e : new Proxy(e, Kt);
}
var Jt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && F !== this) return Ae(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ie(this), e && (e.version = this.dep.version), this._value;
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
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ zt(e) || o === !1 || o === 0 ? tn(e, 1) : tn(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ R(e) ? (g = () => e.value, y = /* @__PURE__ */ zt(e)) : /* @__PURE__ */ Lt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Lt(e) || /* @__PURE__ */ zt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ R(e)) return e.value;
		if (/* @__PURE__ */ Lt(e)) return p(e);
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
	let x = we(), S = () => {
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
					Ve();
					try {
						_ && _(), Qt = m;
						let e = [
							t,
							C === Xt ? void 0 : b && C[0] === Xt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Qt = e, He();
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Ee(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => $t(e, !1, m), _ = m.onStop = () => {
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
			Ve(), nn(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	on(e, r, a, i, s);
}
function on(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var V = [], sn = -1, cn = [], ln = null, un = 0, dn = /* @__PURE__ */ Promise.resolve(), fn = null;
function pn(e) {
	let t = fn || dn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function mn(e) {
	let t = sn + 1, n = V.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = V[r], a = Sn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function hn(e) {
	if (!(e.flags & 1)) {
		let t = Sn(e), n = V[V.length - 1];
		!n || !(e.flags & 2) && t >= Sn(n) ? V.push(e) : V.splice(mn(t), 0, e), e.flags |= 1, gn();
	}
}
function gn() {
	fn ||= dn.then(Cn);
}
function _n(e) {
	if (!d(e)) ln && e.id === -1 ? ln.splice(un + 1, 0, e) : e.flags & 1 || (cn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) cn.push(e[t]);
	gn();
}
function vn(e, t, n, r = sn + 1) {
	for (; r < V.length; r++) {
		let n = V[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			V.splice(r, 1), r = e ? r - 1 : sn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function yn(e, t, n = 0) {
	if (cn.length) {
		let e = cn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < cn.length; i++) {
				let a = cn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? cn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Sn(e) - Sn(t));
		if (cn.length = r, ln) {
			for (let e = 0; e < i.length; e++) ln.push(i[e]);
			return;
		}
		for (ln = i, un = 0; un < ln.length; un++) {
			let e = ln[un];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		ln = null, un = 0;
	}
}
var bn = !1;
function xn(e, t) {
	if (bn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(cn);
	e(), bn = !0;
	try {
		vn(void 0, t), yn(void 0, n, t);
	} finally {
		bn = !1;
	}
}
var Sn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Cn(e) {
	try {
		for (sn = 0; sn < V.length; sn++) {
			let e = V[sn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), nn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; sn < V.length; sn++) {
			let e = V[sn];
			e && (e.flags &= -2);
		}
		sn = -1, V.length = 0, yn(e), fn = null, (V.length || cn.length) && Cn(e);
	}
}
var H = null, wn = null;
function Tn(e) {
	let t = H;
	return H = e, wn = e && e.type.__scopeId || null, t;
}
function En(e, t = H, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ti(-1);
		let i = Tn(t), a = Qr.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Qr.length; e > a; e--) $r();
			Tn(i), r._d && ti(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function U(e, n) {
	if (H === null) return e;
	let r = Ii(H), i = e.dirs ||= [];
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
		c && (Ve(), rn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function On(e, t, n = !1) {
	let r = Ci();
	if (r || sr) {
		let i = sr ? sr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
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
	if (ki) {
		if (c === "sync") {
			let e = An();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = Si;
	u.call = (e, t, n) => rn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		e.i = p, G(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : hn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = en(e, n, u);
	return ki && (f ? f.push(h) : d && h()), h;
}
var Nn = /* @__PURE__ */ Symbol("_vte"), Pn = (e) => e.__isTeleport, Fn = /* @__PURE__ */ Symbol("_leaveCb");
function In(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Xr) {
			t = n;
			break;
		}
	}
	return t;
}
function Ln(e) {
	if (!Kn(e)) return Pn(e.type) && e.children ? In(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Rn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Rn(Pn(n.type) && Ln(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === K && d(e.children)) {
		let n = pr(e.children, !1);
		n && Rn(n, t);
	}
}
function zn(e) {
	if (e.component) return zn(e.component.subTree);
	if (e.type === K) {
		let t = d(e.children) && pr(e.children, !1);
		return t ? zn(t) : void 0;
	}
	if (e.type !== Xr) return e;
}
function Bn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Vn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Hn = /* @__PURE__ */ new WeakMap();
function Un(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Un(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Gn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Un(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Ii(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ L(v), b = v === t ? i : (e) => !Vn(_, e) && u(y, e), x = (e, t) => !(t && Vn(_, t));
	if (m != null && m !== p) {
		if (Wn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
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
					i(), Hn.delete(e);
				};
				t.id = -1, Hn.set(e, t), G(t, r);
			} else Wn(e), i();
		}
	}
}
function Wn(e) {
	let t = Hn.get(e);
	t && (t.flags |= 8, Hn.delete(e));
}
ce().requestIdleCallback, ce().cancelIdleCallback;
var Gn = (e) => !!e.type.__asyncLoader, Kn = (e) => e.type.__isKeepAlive;
function qn(e, t, n = Si, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ve();
			let i = Ei(n), a = rn(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Jn = (e) => (t, n = Si) => {
	ki && e !== "sp" || qn(e, (...e) => t(...e), n);
}, Yn = Jn("m"), Xn = Jn("bum"), Zn = /* @__PURE__ */ Symbol.for("v-ndc");
function W(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Lt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ zt(e), s = /* @__PURE__ */ Rt(e), e = et(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ut(Ht(e[n])) : Ht(e[n]) : e[n], n, void 0, a && a[n]);
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
function Qn(e, t, n, r, i, a) {
	if (n ??= {}, H.ce || H.parent && Gn(H.parent) && H.parent.ce) {
		let e = a != null && n.key == null ? s({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), J(), ri(K, null, [ci("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let c = Qr.length;
	J();
	let l;
	try {
		let i = o && $n(o(n)), s = n.key || a || i && i.key;
		l = ri(K, { key: (s && !_(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Qr.length; e > c; e--) $r();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), l;
}
function $n(e) {
	return e.some((e) => !ii(e) || !(e.type === Xr || e.type === K && !$n(e.children))) ? e : null;
}
var er = (e) => e ? Oi(e) ? Ii(e) : er(e.parent) : null, tr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => er(e.parent),
	$root: (e) => er(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		hn(e.update);
	},
	$nextTick: (e) => e.n ||= pn.bind(e.proxy),
	$watch: (e) => r
}), nr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), rr = {
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
			else if (nr(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = tr[n], f, p;
		if (d) return n === "$attrs" && I(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return nr(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || nr(t, s) || u(a, s) || u(r, s) || u(tr, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ir() {
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
var ar = 0;
function or(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = ir(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: ar++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: zi,
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
					let u = l._ceVNode || ci(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Ii(u.component);
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
				let t = sr;
				sr = l;
				try {
					return e();
				} finally {
					sr = t;
				}
			}
		};
		return l;
	};
}
var sr = null, cr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${D(t)}Modifiers`];
function lr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && cr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(k)));
	let c, l = i[c = ie(n)] || i[c = ie(E(n))];
	!l && o && (l = i[c = ie(D(n))]), l && rn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, rn(u, e, 6, a);
	}
}
function ur(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function dr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, D(t)) || u(e, t));
}
function fr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Tn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = pi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = pi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : mr(c);
		}
	} catch (t) {
		Qr.length = 0, an(t, e, 1), v = ci(Xr);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = hr(y, a)), b = di(b, y, !1, !0));
	}
	return n.dirs && (b = di(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Rn(Pn(b.type) && Ln(b) || b, n.transition), v = b, Tn(_), v;
}
function pr(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ii(r)) {
			if (r.type !== Xr || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var mr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, hr = (e, t) => {
	let n = {};
	for (let r in e) o(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function gr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? _r(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (vr(o, r, n) && !dr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || _r(r, o, l) : !!o;
	return !1;
}
function _r(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!u(e, a) || vr(t, e, a) && !dr(n, a)) return !0;
	}
	return !1;
}
function vr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !M(r, i) : r !== i;
}
function yr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var br = {}, xr = () => Object.create(br), Sr = (e) => Object.getPrototypeOf(e) === br;
function Cr(e, t, n, r = !1) {
	let i = {}, a = xr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Tr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Pt(i) : e.type.props ? i : a, e.attrs = a;
}
function wr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ L(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (dr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = E(o);
						i[t] = Er(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Tr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (u(t, a) || (r = D(a)) !== a && u(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Er(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && u(t, e) || (delete a[e], l = !0);
	}
	l && Qe(e.attrs, "set", "");
}
function Tr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : dr(e.emitsOptions, t) || t in i && l === i[t] || (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ L(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Er(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Er(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ei(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === D(n)) && (r = !0));
	}
	return r;
}
function Dr(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = E(c[e]);
		Or(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = E(e);
		if (Or(t)) {
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
function Or(e) {
	return e[0] !== "$" && !T(e);
}
var kr = (e) => e === "_" || e === "_ctx" || e === "$stable", Ar = (e) => d(e) ? e.map(pi) : [pi(e)], jr = (e, t, n) => {
	if (t._n) return t;
	let r = En((...e) => Ar(t(...e)), n);
	return r._c = !1, r;
}, Mr = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (kr(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = jr(n, i, r);
		else if (i != null) {
			let e = Ar(i);
			t[n] = () => e;
		}
	}
}, Nr = (e, t) => {
	let n = Ar(t);
	e.slots.default = () => n;
}, Pr = (e, t, n) => {
	for (let r in t) (n || !kr(r)) && (e[r] = t[r]);
}, Fr = (e, t, n) => {
	let r = e.slots = xr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Pr(r, t, n), n && oe(r, "_", e, !0)) : Mr(t, r);
	} else t && Nr(e, t);
}, Ir = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Pr(a, n, r) : (o = !n.$stable, Mr(n, a)), s = n;
	} else n && (Nr(e, n), s = { default: 1 });
	if (o) for (let e in a) !kr(e) && s[e] == null && delete a[e];
}, G = Jr;
function Lr(e) {
	return Rr(e);
}
function Rr(e, i) {
	let a = ce();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ai(e, t) && (i = _e(e), A(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Yr:
				y(e, t, r, i);
				break;
			case Xr:
				b(e, t, r, i);
				break;
			case Zr:
				e ?? x(t, r, i, s);
				break;
			case K:
				ie(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? O(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, M);
		}
		d != null && a ? Un(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Un(e.ref, null, o, e, !0);
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
				n && n._beginPatch(), ne(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, zr(e, a), s, u), _ && Dn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && _i(f, r, e);
		}
		_ && Dn(e, null, r, "beforeMount");
		let v = Vr(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && G(() => {
			try {
				f && _i(f, r, e), v && g.enter(d), _ && Dn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || qr(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? mi(e[l]) : pi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Br(r, !1), (g = h.onVnodeBeforeUpdate) && _i(g, r, n, e), f && Dn(n, e, r, "beforeUpdate"), r && Br(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? D(e.dynamicChildren, d, l, r, i, zr(n, a), o) : s || ue(e, n, l, null, r, i, zr(n, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && G(() => {
			g && _i(g, r, n, e), f && Dn(n, e, r, "updated");
		}, i);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Kr(c), d = u && (c.type === K || !ai(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, re = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ie = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Hr(e, t, !0)) : ue(e, t, n, f, i, a, s, c, l);
	}, O = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : k(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = xi(e, r, i);
		if (Kn(e) && (s.ctx.renderer = M), Ai(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, se, o, a), !e.el) {
				let r = s.subTree = ci(Xr);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else se(s, e, t, n, i, a, o);
	}, k = (e, t, n) => {
		let r = t.component = e.component;
		if (gr(e, t, n)) {
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
					let n = Wr(e);
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
				Br(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && _i(d, s, t, c), Br(e, !0);
				let f = fr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), _e(p), e, i, a), t.el = f.el, u === null && yr(e, f.el), r && G(r, i), (d = t.props && t.props.onVnodeUpdated) && G(() => _i(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Gn(t);
				if (Br(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && _i(o, d, t), Br(e, !0), s && be) {
					let t = () => {
						e.subTree = fr(e), be(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = fr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && G(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					G(() => _i(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Gn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && G(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ee(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => hn(u), Br(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, wr(e, t.props, r, n), Ir(e, t.children, n), Ve(), vn(e), He();
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
		m & 8 ? (u & 16 && ge(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? fe(l, d, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, de = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? mi(t[p]) : pi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ge(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? mi(t[u]) : pi(t[u]);
			if (ai(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? mi(t[p]) : pi(t[p]);
			if (ai(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? mi(t[u]) : pi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) A(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? mi(t[u]) : pi(t[u]);
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
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ai(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? A(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Ur(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Kr(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? pe(n, r, p, 2) : _--);
			}
		}
	}, pe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) pe(e.component.subTree, t, n, r);
		else if (d & 128) e.suspense.move(t, n, r);
		else if (d & 64) c.move(e, t, n, M);
		else if (c === K) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) pe(u[e], t, n, r);
			o(e.anchor, t, n);
		} else if (c === Zr) S(e, t, n);
		else if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Fn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), G(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Fn];
					a._isLeaving && a[Fn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, A = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ve(), Un(s, null, n, e, !0), He()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Gn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && _i(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Dn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, M, r) : l && !l.hasOnce && (a !== K || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === K && d & 384 || !i && u & 16) && ge(c, t, n), r && me(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && G(() => {
			_ && _i(_, t, e), h && Dn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, me = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e, a = t === K;
		if (a && !i) {
			j(n, r);
			return;
		}
		if (t === Zr) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let o = a ? zn(e) : e, c = () => {
			a ? m(n) && j(n, r) : s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (o && o.shapeFlag & 1 && i && !i.persisted) {
			let { leave: e, delayLeave: t } = i, n = o.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, j = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, he = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Gr(c), Gr(l), r && ae(r), i.stop(), a ? (a.flags |= 8, A(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, A(o, e, t, n)), s && G(s, t), G(() => {
			e.isUnmounted = !0;
		}, t);
	}, ge = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) A(e[o], t, n, r, i);
	}, _e = (e) => {
		if (e.shapeFlag & 6) return _e(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Nn];
		return n ? h(n) : t;
	}, ve = (e, t, n) => {
		xn(() => {
			e == null ? t._vnode && A(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : bi());
	}, M = {
		p: v,
		um: A,
		m: pe,
		r: me,
		mt: oe,
		mc: E,
		pc: ue,
		pbc: D,
		n: _e,
		o: e
	}, ye, be;
	return i && ([ye, be] = i(M)), {
		render: ve,
		hydrate: ye,
		createApp: or(ve, ye)
	};
}
function zr({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Br({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Vr(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Hr(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = mi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Hr(t, a)), a.type === Yr && (a.patchFlag === -1 && (a = i[e] = mi(a)), a.el = t.el), a.type === Xr && !a.el && (a.el = t.el);
	}
}
function Ur(e) {
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
function Wr(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Wr(t);
}
function Gr(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Kr(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Kr(t.subTree) : null;
}
var qr = (e) => e.__isSuspense;
function Jr(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : _n(e);
}
var K = /* @__PURE__ */ Symbol.for("v-fgt"), Yr = /* @__PURE__ */ Symbol.for("v-txt"), Xr = /* @__PURE__ */ Symbol.for("v-cmt"), Zr = /* @__PURE__ */ Symbol.for("v-stc"), Qr = [], q = null;
function J(e = !1) {
	Qr.push(q = e ? null : []);
}
function $r() {
	Qr.pop(), q = Qr[Qr.length - 1] || null;
}
var ei = 1;
function ti(e, t = !1) {
	ei += e, e < 0 && q && t && (q.hasOnce = !0);
}
function ni(e) {
	return e.dynamicChildren = ei > 0 ? q || n : null, $r(), ei > 0 && q && q.push(e), e;
}
function Y(e, t, n, r, i, a) {
	return ni(X(e, t, n, r, i, a, !0));
}
function ri(e, t, n, r, i) {
	return ni(ci(e, t, n, r, i, !0));
}
function ii(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ai(e, t) {
	return e.type === t.type && e.key === t.key;
}
var oi = ({ key: e }) => e ?? null, si = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ R(e) || h(e) ? {
	i: H,
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
		key: t && oi(t),
		ref: t && si(t),
		scopeId: wn,
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
	return s ? (hi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), ei > 0 && !o && q && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && q.push(c), c;
}
var ci = li;
function li(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Zn || (e = Xr), ii(e)) {
		let r = di(e, t, !0);
		return n && hi(r, n), ei > 0 && !a && q && (r.shapeFlag & 6 ? q[q.indexOf(e)] = r : q.push(r)), r.patchFlag = -2, r;
	}
	if (Li(e) && (e = e.__vccOpts), t) {
		t = ui(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = A(e)), v(n) && (/* @__PURE__ */ Bt(n) && !d(n) && (n = s({}, n)), t.style = le(n));
	}
	let o = g(e) ? 1 : qr(e) ? 128 : Pn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return X(e, t, n, r, i, o, a, !0);
}
function ui(e) {
	return e ? /* @__PURE__ */ Bt(e) || Sr(e) ? s({}, e) : e : null;
}
function di(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? gi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && oi(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(si(t)) : [a, si(t)] : si(t) : a,
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
		ssContent: e.ssContent && di(e.ssContent),
		ssFallback: e.ssFallback && di(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Rn(u, c.clone(u)), u;
}
function fi(e = " ", t = 0) {
	return ci(Yr, null, e, t);
}
function Z(e = "", t = !1) {
	return t ? (J(), ri(Xr, null, e)) : ci(Xr, null, e);
}
function pi(e) {
	return e == null || typeof e == "boolean" ? ci(Xr) : d(e) ? ci(K, null, e.slice()) : ii(e) ? mi(e) : ci(Yr, null, String(e));
}
function mi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : di(e);
}
function hi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), hi(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Sr(t) ? t._ctx = H : r === 3 && H && (H.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			hi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: H
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [fi(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function gi(...e) {
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
function _i(e, t, n, r = null) {
	rn(e, t, 7, [n, r]);
}
var vi = ir(), yi = 0;
function bi() {
	return yi;
}
function xi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || vi, o = {
		uid: yi++,
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
		scope: new Ce(!0),
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
		propsOptions: Dr(i, a),
		emitsOptions: ur(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = lr.bind(null, o), e.ce && e.ce(o), o;
}
var Si = null, Ci = () => Si || H, wi, Ti;
{
	let e = ce(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	wi = t("__VUE_INSTANCE_SETTERS__", (e) => Si = e), Ti = t("__VUE_SSR_SETTERS__", (e) => ki = e);
}
var Ei = (e) => {
	let t = Si;
	return wi(e), e.scope.on(), () => {
		e.scope.off(), wi(t);
	};
}, Di = () => {
	Si && Si.scope.off(), wi(null);
};
function Oi(e) {
	return e.vnode.shapeFlag & 4;
}
var ki = !1;
function Ai(e, t = !1, n = !1) {
	t && Ti(t);
	let { props: r, children: i } = e.vnode, a = Oi(e);
	Cr(e, r, a, t), Fr(e, i, n || t);
	let o = a ? ji(e, t) : void 0;
	return t && Ti(!1), o;
}
function ji(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, rr);
	let { setup: r } = n;
	if (r) {
		Ve();
		let n = e.setupContext = r.length > 1 ? Fi(e) : null, i = Ei(e), a = nn(r, e, 0, [e.props, n]), o = y(a);
		if (He(), i(), (o || e.sp) && !Gn(e) && Bn(e), o) {
			if (a.then(Di, Di), t) return a.then((n) => {
				Ti(!0);
				try {
					Mi(e, n, t);
				} finally {
					Ti(!1);
				}
			}).catch((t) => {
				an(t, e, 0);
			});
			e.asyncDep = a;
		} else Mi(e, a, t);
	} else Ni(e, t);
}
function Mi(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = qt(t)), Ni(e, n);
}
function Ni(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var Pi = { get(e, t) {
	return I(e, "get", ""), e[t];
} };
function Fi(e) {
	return {
		attrs: new Proxy(e.attrs, Pi),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ii(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(qt(Vt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in tr) return tr[n](e);
		},
		has(e, t) {
			return t in e || t in tr;
		}
	}) : e.proxy;
}
function Li(e) {
	return h(e) && "__vccOpts" in e;
}
var Ri = (e, t) => /* @__PURE__ */ Yt(e, t, ki), zi = "3.5.44", Bi = void 0, Vi = typeof window < "u" && window.trustedTypes;
if (Vi) try {
	Bi = /* @__PURE__ */ Vi.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Hi = Bi ? (e) => Bi.createHTML(e) : (e) => e, Ui = "http://www.w3.org/2000/svg", Wi = "http://www.w3.org/1998/Math/MathML", Gi = typeof document < "u" ? document : null, Ki = Gi && /* @__PURE__ */ Gi.createElement("template"), qi = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Gi.createElementNS(Ui, e) : t === "mathml" ? Gi.createElementNS(Wi, e) : n ? Gi.createElement(e, { is: n }) : Gi.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Gi.createTextNode(e),
	createComment: (e) => Gi.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Gi.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ki.innerHTML = Hi(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ki.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ji = /* @__PURE__ */ Symbol("_vtc");
function Yi(e, t, n) {
	let r = e[Ji];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Xi = /* @__PURE__ */ Symbol("_vod"), Zi = /* @__PURE__ */ Symbol("_vsh"), Qi = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Xi] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : $i(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), $i(e, !0), r.enter(e)) : r.leave(e, () => {
			$i(e, !1);
		}) : $i(e, t));
	},
	beforeUnmount(e, { value: t }) {
		$i(e, t);
	}
};
function $i(e, t) {
	e.style.display = t ? e[Xi] : "none", e[Zi] = !t;
}
var ea = /* @__PURE__ */ Symbol(""), ta = /(?:^|;)\s*display\s*:/;
function na(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? ia(r, t, "");
			}
			else for (let e in t) n[e] ?? ia(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ia(r, i, "") : ca(e, i, !g(t) && t ? t[i] : void 0, o) || ia(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ea];
			e && (n += ";" + e), r.cssText = n, a = ta.test(n);
		}
	} else t && e.removeAttribute("style");
	Xi in e && (i && t === n || (e[Xi] = a ? r.display : ""), e[Zi] && (r.display = "none"));
}
var ra = /\s*!important$/;
function ia(e, t, n) {
	if (d(n)) n.forEach((n) => ia(e, t, n));
	else if (n ??= "", t.startsWith("--")) ra.test(n) ? e.setProperty(t, n.replace(ra, ""), "important") : e.setProperty(t, n);
	else {
		let r = sa(e, t);
		ra.test(n) ? e.setProperty(D(r), n.replace(ra, ""), "important") : e[r] = n;
	}
}
var aa = [
	"Webkit",
	"Moz",
	"ms"
], oa = {};
function sa(e, t) {
	let n = oa[t];
	if (n) return n;
	let r = E(t);
	if (r !== "filter" && r in e) return oa[t] = r;
	r = re(r);
	for (let n = 0; n < aa.length; n++) {
		let i = aa[n] + r;
		if (i in e) return oa[t] = i;
	}
	return t;
}
function ca(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var la = "http://www.w3.org/1999/xlink";
function ua(e, t, n, r, i, a = me(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(la, t.slice(6, t.length)) : e.setAttributeNS(la, t, n) : n == null || a && !j(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function da(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Hi(n) : n);
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
		r === "boolean" ? n = j(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function fa(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function pa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var ma = /* @__PURE__ */ Symbol("_vei");
function ha(e, t, n, r, i = null) {
	let a = e[ma] || (e[ma] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = va(t);
		r ? fa(e, n, a[t] = Sa(r, i), s) : o && (pa(e, n, o, s), a[t] = void 0);
	}
}
var ga = /(Once|Passive|Capture)$/, _a = /^on:?(?:Once|Passive|Capture)$/;
function va(e) {
	let t, n;
	for (; (n = e.match(ga)) && !_a.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : D(e.slice(2)), t];
}
var ya = 0, ba = /* @__PURE__ */ Promise.resolve(), xa = () => ya ||= (ba.then(() => ya = 0), Date.now());
function Sa(e, t) {
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
	return n.value = e, n.attached = xa(), n;
}
var Ca = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, wa = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Yi(e, r, c) : t === "style" ? na(e, n, r) : a(t) ? o(t) || ha(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Ta(e, t, r, c)) ? (da(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || ua(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ea(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? da(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ua(e, t, r, c));
};
function Ta(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Ca(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Ca(t) && g(n) ? !1 : t in e;
}
function Ea(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var Da = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ae(t, e) : t;
};
function Oa(e) {
	e.target.composing = !0;
}
function ka(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Q = /* @__PURE__ */ Symbol("_assign"), Aa = /* @__PURE__ */ Symbol("_initialValue");
function ja(e, t, n) {
	return t && (e = e.trim()), n && (e = k(e)), e;
}
var $ = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Aa] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Aa] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Q] = Da(i);
		let a = r || i.props && i.props.type === "number";
		fa(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Q](ja(e.value, n, a));
		}), (n || a) && fa(e, "change", () => {
			e.value = ja(e.value, n, a);
		}), t || (fa(e, "compositionstart", Oa), fa(e, "compositionend", ka), fa(e, "change", ka));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Aa];
		delete e[Aa], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Q](ja(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Q] = Da(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? k(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Ma = {
	deep: !0,
	created(e, t, n) {
		e[Q] = Da(n), fa(e, "change", () => {
			let t = e._modelValue, n = Ra(e), r = e.checked, i = e[Q];
			if (d(t)) {
				let e = ye(t, n), a = e !== -1;
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
		e[Q] = Da(n), Na(e, t, n);
	}
};
function Na(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = ye(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = M(t, za(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Pa = {
	created(e, { value: t }, n) {
		e.checked = M(t, n.props.value), e[Q] = Da(n), fa(e, "change", () => {
			e[Q](Ra(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[Q] = Da(r), t !== n && (e.checked = M(t, r.props.value));
	}
}, Fa = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, fa(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? k(Ra(e)) : Ra(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[Q](i);
			} finally {
				pn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Q] = Da(r);
	},
	mounted(e, { value: t }) {
		La(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Q] = Da(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, n && n[0] === e.multiple && Ia(t, n[1], n[0]) || La(e, t);
	}
};
function Ia(e, t, n) {
	if (!n || d(e)) return M(e, t);
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
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : ye(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (M(Ra(a), t)) {
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
}, Ua = /* @__PURE__ */ s({ patchProp: wa }, qi), Wa;
function Ga() {
	return Wa ||= Lr(Ua);
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
// services/play/src/usePlay.js
function ao() {
	let e = location.pathname === "/play" || location.pathname.startsWith("/play/") ? "/play" : "", t = "edutictac-play-draft", n = localStorage.getItem("edutictac-play-lang"), r = /* @__PURE__ */ z([
		"es",
		"ca",
		"va",
		"en"
	].includes(n) ? n : "es"), i = /* @__PURE__ */ z({}), a = (e) => e.split(".").reduce((e, t) => e?.[t], i.value) || e, o = /* @__PURE__ */ z("home"), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z($a()), u = /* @__PURE__ */ z(null), d = /* @__PURE__ */ z(""), f = /* @__PURE__ */ z(""), p = /* @__PURE__ */ z(!1), m = /* @__PURE__ */ z(0), h = /* @__PURE__ */ z(""), g = {}, _ = /* @__PURE__ */ z({}), v = /* @__PURE__ */ Nt({
		subjects: "",
		educational_stages: "",
		levels: "",
		tags: ""
	}), y = /* @__PURE__ */ z(""), b = /* @__PURE__ */ Nt({
		items: [],
		total: 0,
		offset: 0,
		hasMore: !1,
		term: "",
		type: "",
		loading: !1,
		error: !1
	}), x = /* @__PURE__ */ Nt({
		items: [],
		term: "",
		loading: !1,
		error: !1
	}), S = /* @__PURE__ */ z(), C = /* @__PURE__ */ z(""), w = /* @__PURE__ */ z("");
	try {
		w.value = localStorage.getItem("edutictac-play-admin-token") || "", localStorage.removeItem("edutictac-play-admin-token");
	} catch {}
	let T = 0, ee = 0, te = 0, E = 0, ne = 0, D = !0, re = io(e, (e) => {
		u.value?.id === e && D && (f.value = "resultSaved");
	}), ie = Ri(() => c.value || m.value > 0), O = Ri(() => ["published", "updated"].includes(u.value?.recursos?.status)), ae = Ri(() => a(l.value.type === "compound" ? "compound.editor" : l.value.type === "multiple-choice" ? "editorTitle" : Za[l.value.type] + "Editor"));
	function oe() {
		let e = localStorage.getItem("edutictac-play-creator-key");
		return e && /^[A-Za-z0-9_-]{16,128}$/.test(e) || (e = crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2) + Date.now().toString(36), localStorage.setItem("edutictac-play-creator-key", e)), e;
	}
	async function k(t, n = {}) {
		let r = await fetch(e + "/api" + t, {
			credentials: "same-origin",
			cache: "no-store",
			...n,
			headers: {
				"X-Play-Creator": oe(),
				...n.headers
			}
		}), i = await r.json();
		if (!r.ok) {
			let e = /* @__PURE__ */ Error("request");
			throw e.status = r.status, e.details = Array.isArray(i.errors) ? i.errors : [], e;
		}
		return i;
	}
	function se(e, t, n = {}) {
		return k(e, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...n
			},
			body: JSON.stringify(t)
		});
	}
	async function ce(t) {
		let n = ++ee;
		try {
			let a = await fetch(e + "/i18n/" + (t === "va" ? "ca" : t) + ".json");
			if (!a.ok) throw Error();
			let o = await a.json();
			if (n !== ee || !D) return;
			i.value = o, r.value = t, document.documentElement.lang = t === "va" ? "ca" : t, localStorage.setItem("edutictac-play-lang", t);
		} catch {
			d.value = "languageError";
		}
	}
	function le(e) {
		Ya.includes(e) && !ie.value && (g[l.value.type] = l.value, g[e] || (g[e] = {
			...$a(e),
			title: l.value.title,
			question: l.value.question
		}), l.value = g[e], o.value = "editor", d.value = "", ++T);
	}
	function ue(e) {
		c.value || (++T, o.value = e, f.value = "", d.value = "", S.value?.close(), ++E);
	}
	async function de(n = !1) {
		if (ie.value) return;
		let i = to(l.value, r.value), s = no(i, a);
		if (d.value = s.join(" "), s.length) return;
		c.value = !0;
		let m = T;
		try {
			n && localStorage.setItem(t, JSON.stringify(i));
			let r = await se(n ? "/previews" : "/activities", i);
			if (m !== T || !D) return;
			u.value = r, o.value = "previewPanel", f.value = n ? "" : "saved", p.value = !1, n || localStorage.removeItem(t), history.replaceState({}, "", n ? e + "/" + re.query() : e + "/" + r.id + re.query());
		} catch (e) {
			if (m === T && D) {
				let t = e.details?.join(" ");
				d.value = t || a(n ? "previewError" : "saveError"), f.value = "saveError", p.value = !0;
			}
		} finally {
			m === T && (c.value = !1);
		}
	}
	async function fe() {
		let e = ++te, t = T;
		b.loading = !0, b.error = !1;
		try {
			let n = await k("/activities?" + new URLSearchParams({
				limit: "12",
				offset: b.offset,
				q: b.term.trim(),
				type: b.type
			}));
			if (e !== te || t !== T || !D) return;
			Object.assign(b, {
				items: n.items,
				total: n.total,
				offset: n.offset,
				hasMore: n.hasMore
			});
		} catch {
			e === te && t === T && (b.error = !0);
		} finally {
			e === te && (b.loading = !1);
		}
	}
	function pe() {
		ue("library"), b.offset = 0, fe();
	}
	function A(e = 0) {
		b.offset = e, fe();
	}
	function me() {
		c.value || (w.value = C.value.trim(), C.value = "", y.value = "", ++te, fe());
	}
	async function j(n, r = !1) {
		if (c.value || !window.confirm(a(r ? "libraryConfirmDelete" : "deleteConfirm"))) return;
		c.value = !0;
		let i = T;
		try {
			if (await k("/activities/" + n, {
				method: "DELETE",
				headers: w.value ? { "X-Admin-Token": w.value } : {}
			}), i !== T || !D) return;
			r ? await fe() : (u.value = null, localStorage.removeItem(t), history.replaceState({}, "", e + "/"), o.value = "home");
		} catch {
			i === T && (f.value = "deleteError", p.value = !0, r && (b.error = !0));
		} finally {
			i === T && (c.value = !1);
		}
	}
	async function he(e = !1) {
		if (c.value || !u.value?.id || u.value.id.startsWith("preview-")) return;
		c.value = !0;
		let t = T, n = u.value.id;
		f.value = e ? "unpublishRecursosLoading" : "publishRecursosLoading";
		try {
			let r = await se("/recursos/" + (e ? "unpublish" : "publish"), { activity_id: n });
			if (t !== T || u.value?.id !== n || !D) return;
			u.value.recursos = r, f.value = e ? "unpublishRecursosDone" : "publishRecursosDone", p.value = !1;
		} catch {
			t === T && (f.value = e ? "unpublishRecursosError" : "publishRecursosError", p.value = !0);
		} finally {
			t === T && (c.value = !1);
		}
	}
	async function ge() {
		let e = ++ne;
		try {
			let t = await k("/catalog");
			if (e !== ne || !D) return;
			_.value = t;
			for (let e of Object.keys(v)) v[e] = (t[e] || []).join("\n");
		} catch {}
	}
	async function _e() {
		if (c.value) return;
		if (!w.value) {
			y.value = "catalogTokenRequired";
			return;
		}
		c.value = !0;
		let e = T;
		try {
			await se("/catalog", {
				...Object.fromEntries(Object.entries(v).map(([e, t]) => [e, t.split("\n").map((e) => e.trim()).filter(Boolean)])),
				labels: _.value.labels || {}
			}, { "X-Admin-Token": w.value }), e === T && D && (y.value = "catalogSaved", await ge());
		} catch {
			e === T && (y.value = "catalogError");
		} finally {
			e === T && (c.value = !1);
		}
	}
	async function ve() {
		let e = ++E, t = T;
		x.loading = !0, x.error = !1;
		try {
			let n = await k("/activities?" + new URLSearchParams({
				limit: "100",
				q: x.term.trim()
			}));
			if (e !== E || t !== T || !D) return;
			x.items = n.items.filter((e) => Xa.includes(e.type));
		} catch {
			e === E && (x.error = !0);
		} finally {
			e === E && (x.loading = !1);
		}
	}
	async function M() {
		ie.value || (x.term = "", x.items = [], S.value.showModal(), ve());
	}
	async function ye(e) {
		if (c.value || l.value.type !== "compound" || l.value.activities.length >= 10) return;
		let t = T, n = E, r = l.value;
		c.value = !0;
		try {
			let i = await k("/activities/" + e);
			if (t !== T || n !== E || l.value !== r || !S.value.open || !D) return;
			if (!Xa.includes(i.type)) throw Error();
			r.activities.push({
				...eo(i),
				sourceActivityId: e
			}), S.value.close(), f.value = "bank.copied";
		} catch {
			t === T && (x.error = !0);
		} finally {
			t === T && (c.value = !1);
		}
	}
	function be() {
		++E, S.value?.close();
	}
	async function N() {
		try {
			await navigator.clipboard.writeText(location.href), f.value = "copied", p.value = !1;
		} catch {
			f.value = "copyError", p.value = !0;
		}
	}
	async function xe() {
		await ce(r.value);
		try {
			await re.launch();
		} catch {
			d.value = a("launchError");
			return;
		}
		re.flush(), ge(), k("/config").then((e) => {
			try {
				let t = new URL(e.commonsUrl);
				e.demo && ["http:", "https:"].includes(t.protocol) && !t.username && !t.password && (h.value = t.href);
			} catch {}
		}).catch(() => {});
		let n = location.pathname.match(RegExp("^" + e + "/([A-Za-z0-9]{8})$"))?.[1] || new URLSearchParams(location.search).get("activity");
		if (n) try {
			if (!/^[A-Za-z0-9]{8}$/.test(n)) throw Error();
			let e = await k("/activities/" + n);
			u.value = e, l.value = eo(e), g[l.value.type] = l.value, o.value = "previewPanel", f.value = "saved";
		} catch {
			d.value = a("libraryError");
		}
		else try {
			let e = JSON.parse(localStorage.getItem(t) || "null");
			e && Ya.includes(e.type) && (l.value = eo(e), g[l.value.type] = l.value);
		} catch {
			localStorage.removeItem(t);
		}
		s.value = !0, document.documentElement.dataset.playReady = "true";
	}
	function Se() {
		D = !1, ++T, ++te, ++E, ++ne, w.value = "", C.value = "", c.value = !1, S.value?.close();
	}
	function P(e) {
		e.persisted && (D = !0, ge(), o.value === "library" && fe());
	}
	function Ce() {
		re.flush();
	}
	return Yn(() => {
		xe(), window.addEventListener("online", Ce), window.addEventListener("pagehide", Se), window.addEventListener("pageshow", P);
	}), Xn(() => {
		Se(), window.removeEventListener("online", Ce), window.removeEventListener("pagehide", Se), window.removeEventListener("pageshow", P);
	}), {
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
		catalog: _,
		catalogDraft: v,
		catalogMessage: y,
		library: b,
		bank: x,
		bankDialog: S,
		adminInput: C,
		adminToken: w,
		published: O,
		editorTitle: ae,
		choose: le,
		go: ue,
		changeLanguage: ce,
		saveActivity: de,
		loadLibrary: fe,
		openLibrary: pe,
		filterLibrary: A,
		applyToken: me,
		removeActivity: j,
		publication: he,
		saveCatalog: _e,
		openBank: M,
		loadBank: ve,
		addFromBank: ye,
		closeBank: be,
		copy: N,
		onStatement: re.report
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
		let n = e, r = t, i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(""), c = {};
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
		return jn(() => n.step, l, { immediate: !0 }), (t, n) => (J(), Y("article", oo, [
			X("div", so, [
				X("strong", co, N(e.index + 1) + ".", 1),
				X("button", {
					type: "button",
					class: "button secondary compound-remove",
					disabled: e.disabled,
					onClick: n[0] ||= (e) => r("remove")
				}, N(e.t("compound.remove")), 9, lo),
				e.step.sourceActivityId ? (J(), Y("small", uo, N(e.t("bank.source")) + ": " + N(e.step.sourceActivityId), 1)) : Z("", !0)
			]),
			X("label", null, [X("span", null, N(e.t("compound.type")), 1), X("select", {
				class: "compound-type",
				value: e.step.type,
				disabled: e.disabled,
				onChange: n[1] ||= (e) => u(e.target.value)
			}, [(J(!0), Y(K, null, W(B(Xa), (t) => (J(), Y("option", {
				key: t,
				value: t
			}, N(e.t(B(Za)[t])), 9, po))), 128))], 40, fo)]),
			X("label", null, [X("span", null, N(e.t("compound.stepTitle")), 1), U(X("input", {
				"onUpdate:modelValue": n[2] ||= (t) => e.step.title = t,
				class: "compound-title",
				maxlength: "200",
				required: "",
				disabled: e.disabled
			}, null, 8, mo), [[$, e.step.title]])]),
			X("label", null, [X("span", null, N(e.t("compound.stepQuestion")), 1), U(X("textarea", {
				"onUpdate:modelValue": n[3] ||= (t) => e.step.question = t,
				class: "compound-question",
				maxlength: "2000",
				required: "",
				disabled: e.disabled
			}, null, 8, ho), [[$, e.step.question]])]),
			X("div", go, [e.step.type === "multiple-choice" ? (J(), Y("label", _o, [X("span", null, N(e.t("compound.answers")), 1), X("textarea", {
				class: "compound-answers",
				value: i.value,
				disabled: e.disabled,
				onInput: n[4] ||= (e) => d("answers", e.target.value)
			}, null, 40, vo)])) : e.step.type === "true-false" ? (J(), Y("label", yo, [X("span", null, N(e.t("correctAnswer")), 1), U(X("select", {
				"onUpdate:modelValue": n[5] ||= (t) => e.step.correct = t,
				class: "compound-correct",
				disabled: e.disabled
			}, [X("option", xo, N(e.t("true")), 1), X("option", So, N(e.t("false")), 1)], 8, bo), [[Fa, e.step.correct]])])) : [
				"fill-blanks",
				"drag-text",
				"mark-words"
			].includes(e.step.type) ? (J(), Y("label", Co, [X("span", null, N(e.t("compound.text")), 1), U(X("textarea", {
				"onUpdate:modelValue": n[6] ||= (t) => e.step.text = t,
				class: "compound-text",
				disabled: e.disabled
			}, null, 8, wo), [[$, e.step.text]])])) : e.step.type === "matching" ? (J(), Y("label", To, [X("span", null, N(e.t("compound.pairs")), 1), X("textarea", {
				class: "compound-pairs",
				value: a.value,
				disabled: e.disabled,
				onInput: n[7] ||= (e) => d("pairs", e.target.value)
			}, null, 40, Eo)])) : (J(), Y(K, { key: 4 }, [X("label", null, [X("span", null, N(e.t("compound.categories")), 1), X("input", {
				class: "compound-categories",
				value: o.value,
				disabled: e.disabled,
				onInput: n[8] ||= (e) => d("categories", e.target.value)
			}, null, 40, Do)]), X("label", null, [X("span", null, N(e.t("compound.items")), 1), X("textarea", {
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
		return (t, n) => e.form.type === "multiple-choice" ? (J(), Y("fieldset", Ao, [
			X("legend", null, N(e.t("answers")), 1),
			X("div", jo, [(J(!0), Y(K, null, W(e.form.answers, (t, r) => (J(), Y("div", {
				key: r,
				class: "answer-row"
			}, [
				U(X("input", {
					"onUpdate:modelValue": (e) => t.text = e,
					class: "answer-text",
					maxlength: "500",
					"aria-label": e.t("answers")
				}, null, 8, Mo), [[$, t.text]]),
				X("label", No, [X("input", {
					class: "answer-correct",
					type: "radio",
					name: "correct",
					checked: t.correct,
					onChange: (t) => e.form.answers.forEach((e, t) => e.correct = t === r)
				}, null, 40, Po), n[15] ||= X("span", null, "✓", -1)]),
				X("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.answers.splice(r, 1)
				}, "×", 8, Fo)
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
			}, N(e.t("addAnswer")), 9, Io)
		])) : e.form.type === "true-false" ? (J(), Y("fieldset", Lo, [
			X("legend", null, N(e.t("correctAnswer")), 1),
			X("label", Ro, [U(X("input", {
				id: "correctTrue",
				"onUpdate:modelValue": n[1] ||= (t) => e.form.correct = t,
				type: "radio",
				name: "truth",
				value: !0
			}, null, 512), [[Pa, e.form.correct]]), X("span", null, N(e.t("true")), 1)]),
			X("label", zo, [U(X("input", {
				id: "correctFalse",
				"onUpdate:modelValue": n[2] ||= (t) => e.form.correct = t,
				type: "radio",
				name: "truth",
				value: !1
			}, null, 512), [[Pa, e.form.correct]]), X("span", null, N(e.t("false")), 1)])
		])) : e.form.type === "memory" ? (J(), Y("fieldset", Bo, [
			X("legend", null, N(e.t("pairs")), 1),
			X("div", Vo, [(J(!0), Y(K, null, W(e.form.cards, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row memory-row"
			}, [X("div", null, [
				U(X("input", {
					"onUpdate:modelValue": (e) => t.text = e,
					class: "card-text",
					maxlength: "120",
					"aria-label": e.t("pair")
				}, null, 8, Ho), [[$, t.text]]),
				X("label", Uo, [fi(N(e.t("imageLeft")), 1), X("input", {
					class: "memory-image",
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					onChange: (e) => s(e, t)
				}, null, 40, Wo)]),
				t.image ? (J(), Y("img", {
					key: 0,
					src: t.image,
					class: "editor-thumbnail",
					alt: ""
				}, null, 8, Go)) : Z("", !0)
			]), X("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.cards.splice(n, 1)
			}, "×", 8, Ko)]))), 128))]),
			X("button", {
				id: "addCard",
				type: "button",
				class: "button secondary",
				disabled: e.form.cards.length >= 12,
				onClick: n[3] ||= (t) => e.form.cards.push({
					text: "",
					image: ""
				})
			}, N(e.t("addPair")), 9, qo)
		])) : e.form.type === "matching" ? (J(), Y("fieldset", Jo, [
			X("legend", null, N(e.t("relations")), 1),
			X("div", Yo, [(J(!0), Y(K, null, W(e.form.pairs, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row matching-row"
			}, [(J(), Y(K, null, W(["left", "right"], (n) => X("div", { key: n }, [
				U(X("input", {
					"onUpdate:modelValue": (e) => t[n] = e,
					class: A("match-" + n),
					maxlength: "120",
					"aria-label": e.t(n)
				}, null, 10, Xo), [[$, t[n]]]),
				X("label", Zo, [fi(N(e.t(n === "left" ? "imageLeft" : "imageRight")), 1), X("input", {
					class: "match-image",
					"data-side": n,
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					onChange: (e) => s(e, t, n + "Image")
				}, null, 40, Qo)]),
				t[n + "Image"] ? (J(), Y("img", {
					key: 0,
					src: t[n + "Image"],
					class: "editor-thumbnail",
					alt: ""
				}, null, 8, $o)) : Z("", !0)
			])), 64)), X("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.pairs.splice(n, 1)
			}, "×", 8, es)]))), 128))]),
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
			}, N(e.t("addRelation")), 9, ts)
		])) : ["classify", "ordering"].includes(e.form.type) ? (J(), Y("fieldset", {
			key: 4,
			id: "classifyField",
			class: A({ "ordering-mode": e.form.type === "ordering" })
		}, [
			X("legend", null, N(e.t(e.form.type === "ordering" ? "positions" : "categories")), 1),
			X("div", ns, [(J(!0), Y(K, null, W(e.form.categories, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row"
			}, [U(X("input", {
				"onUpdate:modelValue": (e) => t.name = e,
				class: "category-name",
				maxlength: "120",
				readonly: e.form.type === "ordering",
				"aria-label": e.t("category")
			}, null, 8, rs), [[$, t.name]]), X("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (e) => o(n)
			}, "×", 8, is)]))), 128))]),
			X("button", {
				id: "addCategory",
				type: "button",
				class: "button secondary",
				disabled: e.form.categories.length >= 12,
				onClick: n[5] ||= (t) => e.form.categories.push({ name: e.form.type === "ordering" ? String(e.form.categories.length + 1) : "" })
			}, N(e.t(e.form.type === "ordering" ? "addPosition" : "addCategory")), 9, as),
			X("legend", null, N(e.t(e.form.type === "ordering" ? "steps" : "items")), 1),
			X("div", os, [(J(!0), Y(K, null, W(e.form.items, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row classify-row"
			}, [
				X("div", null, [
					U(X("input", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "classify-text",
						maxlength: "120",
						"aria-label": e.t("item")
					}, null, 8, ss), [[$, t.text]]),
					X("label", cs, [fi(N(e.t("imageLeft")), 1), X("input", {
						class: "classify-image",
						type: "file",
						accept: "image/png,image/jpeg,image/webp",
						onChange: (e) => s(e, t)
					}, null, 40, ls)]),
					t.image ? (J(), Y("img", {
						key: 0,
						src: t.image,
						class: "editor-thumbnail",
						alt: ""
					}, null, 8, us)) : Z("", !0)
				]),
				U(X("select", {
					"onUpdate:modelValue": (e) => t.category = e,
					class: "classify-category",
					"aria-label": e.t("category")
				}, [(J(!0), Y(K, null, W(e.form.categories, (t, n) => (J(), Y("option", {
					key: n,
					value: n
				}, N(t.name || e.t("category") + " " + (n + 1)), 9, fs))), 128))], 8, ds), [[
					Fa,
					t.category,
					void 0,
					{ number: !0 }
				]]),
				X("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.items.splice(n, 1)
				}, "×", 8, ps)
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
			}, N(e.t(e.form.type === "ordering" ? "addStep" : "addItem")), 9, ms)
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
			X("legend", null, N(e.t(e.form.type === "fill-blanks" ? "fillText" : e.form.type === "drag-text" ? "dragTextText" : "markWordsText")), 1),
			U(X("textarea", {
				id: {
					"fill-blanks": "fillBlanks",
					"drag-text": "dragText",
					"mark-words": "markWords"
				}[e.form.type] + "Text",
				"onUpdate:modelValue": n[7] ||= (t) => e.form.text = t,
				maxlength: "5000"
			}, null, 8, gs), [[$, e.form.text]]),
			X("small", null, N(e.t("fillHint")), 1)
		], 8, hs)) : e.form.type === "find-words" ? (J(), Y("fieldset", _s, [
			X("legend", null, N(e.t("findWordsList")), 1),
			X("div", vs, [(J(!0), Y(K, null, W(e.form.words, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row"
			}, [U(X("input", {
				"onUpdate:modelValue": (t) => e.form.words[n] = t,
				class: "find-word",
				maxlength: "15",
				"aria-label": e.t("findWordsPlaceholder")
			}, null, 8, ys), [[$, e.form.words[n]]]), X("button", {
				type: "button",
				class: "remove",
				"aria-label": e.t("remove"),
				onClick: (t) => e.form.words.splice(n, 1)
			}, "×", 8, bs)]))), 128))]),
			X("button", {
				id: "addFindWord",
				type: "button",
				class: "button secondary",
				disabled: e.form.words.length >= 12,
				onClick: n[8] ||= (t) => e.form.words.push("")
			}, N(e.t("addWord")), 9, xs)
		])) : e.form.type === "dialog-cards" ? (J(), Y("fieldset", Ss, [
			X("legend", null, N(e.t("dialogCardsList")), 1),
			X("div", Cs, [(J(!0), Y(K, null, W(e.form.cards, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row"
			}, [
				U(X("input", {
					"onUpdate:modelValue": (e) => t.front = e,
					class: "dialog-front",
					maxlength: "500",
					"aria-label": e.t("dialogFront")
				}, null, 8, ws), [[$, t.front]]),
				U(X("input", {
					"onUpdate:modelValue": (e) => t.back = e,
					class: "dialog-back",
					maxlength: "500",
					"aria-label": e.t("dialogBack")
				}, null, 8, Ts), [[$, t.back]]),
				X("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.cards.splice(n, 1)
				}, "×", 8, Es)
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
			}, N(e.t("addDialogCard")), 9, Ds)
		])) : e.form.type === "crossword" ? (J(), Y("fieldset", Os, [
			X("legend", null, N(e.t("crosswordList")), 1),
			X("div", ks, [(J(!0), Y(K, null, W(e.form.words, (t, n) => (J(), Y("div", {
				key: n,
				class: "answer-row"
			}, [
				U(X("input", {
					"onUpdate:modelValue": (e) => t.answer = e,
					class: "crossword-answer",
					maxlength: "20",
					"aria-label": e.t("crosswordAnswer")
				}, null, 8, As), [[$, t.answer]]),
				U(X("input", {
					"onUpdate:modelValue": (e) => t.clue = e,
					class: "crossword-clue",
					maxlength: "300",
					"aria-label": e.t("crosswordClue")
				}, null, 8, js), [[$, t.clue]]),
				X("button", {
					type: "button",
					class: "remove",
					"aria-label": e.t("remove"),
					onClick: (t) => e.form.words.splice(n, 1)
				}, "×", 8, Ms)
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
			}, N(e.t("addCrosswordWord")), 9, Ns)
		])) : e.form.type === "compound" ? (J(), Y("fieldset", Ps, [
			X("legend", null, N(e.t("compound.steps")), 1),
			X("div", Fs, [(J(!0), Y(K, null, W(e.form.activities, (t, n) => (J(), ri(ko, {
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
				onClick: n[11] ||= (t) => e.form.activities.push(B($a)())
			}, N(e.t("compound.add")), 9, Is),
			X("button", {
				id: "addCompoundFromBank",
				type: "button",
				class: "button secondary",
				disabled: e.form.activities.length >= 10,
				onClick: n[12] ||= (e) => r("bank")
			}, N(e.t("bank.add")), 9, Ls),
			X("label", null, [X("span", null, N(e.t("compound.pass")), 1), U(X("input", {
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
			X("label", Rs, [U(X("input", {
				id: "compoundRandom",
				"onUpdate:modelValue": n[14] ||= (t) => e.form.randomQuestions = t,
				type: "checkbox"
			}, null, 512), [[Ma, e.form.randomQuestions]]), X("span", null, N(e.t("compound.random")), 1)])
		])) : Z("", !0);
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
		let t = e, n = /* @__PURE__ */ z(), r = /* @__PURE__ */ z(!1), i = 0, a = () => {};
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
		return jn(() => t.activity?.id, async (e) => {
			let s = ++i;
			if (a(), r.value = !1, await pn(), e && n.value) {
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
		}, { immediate: !0 }), Xn(() => {
			++i, a();
		}), (e, t) => (J(), Y(K, null, [X("div", {
			id: "player",
			ref_key: "container",
			ref: n
		}, null, 512), r.value ? (J(), Y("p", Bs, [Qn(e.$slots, "default")])) : Z("", !0)], 64));
	}
}, Hs = { class: "topbar" }, Us = ["href"], Ws = { class: "language" }, Gs = ["value", "disabled"], Ks = { class: "shell" }, qs = {
	key: 0,
	role: "status"
}, Js = {
	id: "home",
	class: "panel hero"
}, Ys = {
	class: "test-phase",
	role: "note"
}, Xs = {
	key: 0,
	id: "demoNotice",
	class: "test-phase demo-notice",
	role: "note"
}, Zs = ["href"], Qs = { class: "type-grid" }, $s = [
	"data-type",
	"disabled",
	"onClick"
], ec = { class: "type-icon" }, tc = { class: "actions" }, nc = {
	id: "editor",
	class: "panel",
	"aria-labelledby": "editorTitle"
}, rc = { class: "section-heading" }, ic = { id: "editorTitle" }, ac = ["disabled"], oc = ["disabled"], sc = ["placeholder"], cc = ["placeholder"], lc = { id: "catalogField" }, uc = ["id", "onUpdate:modelValue"], dc = ["value"], fc = ["value"], pc = ["value"], mc = {
	id: "formError",
	class: "error",
	role: "alert"
}, hc = { class: "actions" }, gc = ["disabled"], _c = ["disabled"], vc = {
	key: 1,
	id: "previewPanel",
	class: "panel",
	"aria-labelledby": "previewTitle"
}, yc = { class: "section-heading" }, bc = { class: "eyebrow" }, xc = { id: "previewTitle" }, Sc = ["disabled"], Cc = {
	key: 0,
	id: "previewActions",
	class: "actions"
}, wc = ["disabled"], Tc = {
	key: 1,
	id: "savedActions",
	class: "actions"
}, Ec = ["href"], Dc = ["disabled"], Oc = ["disabled"], kc = ["disabled"], Ac = {
	key: 2,
	class: "error",
	role: "alert"
}, jc = {
	id: "library",
	class: "panel",
	"aria-labelledby": "libraryTitle"
}, Mc = { class: "section-heading" }, Nc = { id: "libraryTitle" }, Pc = ["disabled"], Fc = ["placeholder", "aria-label"], Ic = ["aria-label"], Lc = { value: "" }, Rc = ["value"], zc = ["disabled"], Bc = {
	id: "libraryStatus",
	class: "library-status",
	role: "status"
}, Vc = {
	id: "libraryList",
	class: "library-grid"
}, Hc = {
	key: 0,
	class: "library-status"
}, Uc = { class: "library-meta" }, Wc = { class: "library-card-actions" }, Gc = ["href"], Kc = ["href"], qc = ["disabled", "onClick"], Jc = { class: "actions" }, Yc = ["disabled"], Xc = ["disabled"], Zc = { class: "library-admin" }, Qc = ["disabled"], $c = { class: "muted" }, el = { id: "catalogAdminEditor" }, tl = { class: "muted" }, nl = ["id", "onUpdate:modelValue"], rl = ["disabled"], il = {
	id: "catalogStatus",
	class: "muted",
	role: "status"
}, al = { class: "section-heading" }, ol = {
	type: "submit",
	class: "button secondary"
}, sl = {
	id: "compoundBankList",
	class: "bank-list"
}, cl = {
	key: 0,
	class: "library-status"
}, ll = {
	key: 1,
	role: "alert"
}, ul = {
	key: 2,
	class: "library-status"
}, dl = { class: "library-meta" }, fl = ["disabled", "onClick"], pl = {
	key: 2,
	class: "error",
	role: "alert"
}, ml = {
	__name: "PlayApp",
	setup(e) {
		let t = ao(), { base: n, TYPES: r, TYPE_LABELS: i, language: a, t: o, view: s, ready: c, busy: l, form: u, saved: d, formError: f, message: p, messageError: m, savingDisabled: h, demoUrl: g, catalog: _, catalogDraft: v, catalogMessage: y, library: b, bank: x, bankDialog: S, adminInput: C, adminToken: w, published: T, editorTitle: ee, choose: te, go: E, changeLanguage: ne, saveActivity: D, openLibrary: re, filterLibrary: ie, applyToken: O, removeActivity: ae, publication: oe, saveCatalog: k, openBank: se, loadBank: ce, addFromBank: le, closeBank: ue, copy: de, onStatement: fe } = t, pe = [
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
		function me(e) {
			let t = a.value === "va" ? "ca" : a.value;
			return _.value.labels?.[e]?.[t] || e;
		}
		return (e, j) => (J(), Y(K, null, [X("header", Hs, [X("a", {
			class: "brand",
			href: B(n) + "/"
		}, "EduTicTac Play", 8, Us), X("label", Ws, [X("span", null, N(B(o)("language")), 1), X("select", {
			id: "language",
			value: B(a),
			disabled: B(l),
			onChange: j[0] ||= (e) => B(ne)(e.target.value)
		}, [...j[30] ||= [
			X("option", { value: "es" }, "ES", -1),
			X("option", { value: "ca" }, "CA", -1),
			X("option", { value: "va" }, "VA", -1),
			X("option", { value: "en" }, "EN", -1)
		]], 40, Gs)])]), X("main", Ks, [
			B(c) ? Z("", !0) : (J(), Y("p", qs, N(B(o)("libraryLoading")), 1)),
			U(X("section", Js, [
				j[31] ||= X("p", { class: "eyebrow" }, "EduTicTac Commons", -1),
				X("h1", null, N(B(o)("homeTitle")), 1),
				X("p", null, N(B(o)("homeIntro")), 1),
				X("p", Ys, [X("strong", null, N(B(o)("testPhaseTitle")), 1), fi(" " + N(B(o)("testPhaseNotice")), 1)]),
				B(g) ? (J(), Y("p", Xs, [
					X("strong", null, N(B(o)("demoTitle")), 1),
					fi(" " + N(B(o)("demoNotice")) + " ", 1),
					X("a", {
						id: "demoLink",
						href: B(g)
					}, N(B(o)("demoLink")), 9, Zs)
				])) : Z("", !0),
				X("div", Qs, [(J(!0), Y(K, null, W(B(r), (e, t) => (J(), Y("button", {
					key: e,
					class: "type-card",
					"data-type": e,
					disabled: B(l),
					onClick: (t) => B(te)(e)
				}, [
					X("span", ec, N(pe[t]), 1),
					X("strong", null, N(B(o)(B(i)[e])), 1),
					X("small", null, N(B(o)(e === "compound" ? "compound.help" : B(i)[e] + "Help")), 1)
				], 8, $s))), 128))]),
				X("div", tc, [X("button", {
					id: "openLibrary",
					type: "button",
					class: "button secondary",
					onClick: j[1] ||= (...e) => B(re) && B(re)(...e)
				}, N(B(o)("libraryOpen")), 1)])
			], 512), [[Qi, B(s) === "home" && B(c)]]),
			U(X("section", nc, [X("div", rc, [X("div", null, [j[32] ||= X("p", { class: "eyebrow" }, "EduTicTac Play", -1), X("h1", ic, N(B(ee)), 1)]), X("button", {
				id: "backHome",
				class: "button secondary",
				disabled: B(l),
				onClick: j[2] ||= (e) => B(E)("home")
			}, N(B(o)("back")), 9, ac)]), X("form", {
				id: "activityForm",
				novalidate: "",
				onSubmit: j[9] ||= Ha((e) => B(D)(!0), ["prevent"])
			}, [
				X("fieldset", {
					class: "editor-controls",
					disabled: B(l)
				}, [
					X("label", null, [X("span", null, N(B(o)("title")), 1), U(X("input", {
						id: "title",
						"onUpdate:modelValue": j[3] ||= (e) => B(u).title = e,
						maxlength: "200",
						required: "",
						placeholder: B(o)("titlePlaceholder")
					}, null, 8, sc), [[$, B(u).title]])]),
					X("label", null, [X("span", null, N(B(o)("question")), 1), U(X("textarea", {
						id: "question",
						"onUpdate:modelValue": j[4] ||= (e) => B(u).question = e,
						maxlength: "2000",
						required: "",
						placeholder: B(o)("questionPlaceholder")
					}, null, 8, cc), [[$, B(u).question]])]),
					(J(), ri(zs, {
						key: B(u),
						form: B(u),
						t: B(o),
						busy: B(l),
						onBank: B(se),
						onImageError: j[5] ||= (e) => f.value = B(o)("imageError"),
						onImageBusy: j[6] ||= (e) => B(t).imageTasks.value += e
					}, null, 8, [
						"form",
						"t",
						"busy",
						"onBank"
					])),
					X("fieldset", lc, [
						X("legend", null, N(B(o)("catalog.legend")), 1),
						(J(), Y(K, null, W([
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
						], (e) => X("label", { key: e.id }, [X("span", null, N(B(o)("catalog." + e.label)), 1), U(X("select", {
							id: e.id,
							"onUpdate:modelValue": (t) => B(u)[e.key] = t
						}, [
							j[33] ||= X("option", { value: "" }, null, -1),
							B(u)[e.key] && !(B(_)[e.list] || []).includes(B(u)[e.key]) ? (J(), Y("option", {
								key: 0,
								value: B(u)[e.key]
							}, N(me(B(u)[e.key])), 9, dc)) : Z("", !0),
							(J(!0), Y(K, null, W(B(_)[e.list] || [], (e) => (J(), Y("option", {
								key: e,
								value: e
							}, N(me(e)), 9, fc))), 128))
						], 8, uc), [[Fa, B(u)[e.key]]])])), 64)),
						X("label", null, [X("span", null, N(B(o)("catalog.tags")), 1), U(X("select", {
							id: "activityTags",
							"onUpdate:modelValue": j[7] ||= (e) => B(u).tags = e,
							multiple: "",
							size: "4"
						}, [(J(!0), Y(K, null, W([.../* @__PURE__ */ new Set([...B(_).tags || [], ...B(u).tags || []])], (e) => (J(), Y("option", {
							key: e,
							value: e
						}, N(me(e)), 9, pc))), 128))], 512), [[Fa, B(u).tags]])])
					])
				], 8, oc),
				X("p", mc, N(B(f)), 1),
				X("div", hc, [X("button", {
					id: "preview",
					type: "submit",
					class: "button",
					disabled: B(h)
				}, N(B(o)("preview")), 9, gc), X("button", {
					id: "save",
					type: "button",
					class: "button secondary",
					disabled: B(h),
					onClick: j[8] ||= (e) => B(D)(!1)
				}, N(B(o)("save")), 9, _c)])
			], 32)], 512), [[Qi, B(s) === "editor" && B(c)]]),
			B(s) === "previewPanel" && B(d) ? (J(), Y("section", vc, [
				X("div", yc, [X("div", null, [X("p", bc, N(B(o)("previewEyebrow")), 1), X("h1", xc, N(B(d).title), 1)]), X("button", {
					id: "edit",
					class: "button secondary",
					disabled: B(l),
					onClick: j[10] ||= (e) => B(E)("editor")
				}, N(B(o)("edit")), 9, Sc)]),
				ci(Vs, {
					base: B(n),
					activity: B(d),
					"on-statement": B(fe)
				}, {
					default: En(() => [fi(N(B(o)("playerError")), 1)]),
					_: 1
				}, 8, [
					"base",
					"activity",
					"on-statement"
				]),
				B(d).id.startsWith("preview-") ? (J(), Y("div", Cc, [X("button", {
					id: "savePreview",
					class: "button",
					disabled: B(h),
					onClick: j[11] ||= (e) => B(D)(!1)
				}, N(B(o)("save")), 9, wc), X("span", null, N(B(o)("previewOnly")), 1)])) : (J(), Y("div", Tc, [
					X("a", {
						id: "download",
						class: "button",
						href: B(n) + "/api/activities/" + B(d).id + "/download"
					}, N(B(o)("download")), 9, Ec),
					B(T) ? (J(), Y("button", {
						key: 1,
						id: "unpublishRecursos",
						class: "button secondary",
						disabled: B(l),
						onClick: j[13] ||= (e) => B(oe)(!0)
					}, N(B(o)("unpublishRecursos")), 9, Oc)) : (J(), Y("button", {
						key: 0,
						id: "publishRecursos",
						class: "button",
						disabled: B(l),
						onClick: j[12] ||= (e) => B(oe)(!1)
					}, N(B(o)("publishRecursos")), 9, Dc)),
					X("button", {
						id: "copy",
						class: "button secondary",
						onClick: j[14] ||= (...e) => B(de) && B(de)(...e)
					}, N(B(o)("copy")), 1),
					B(d).owned ? (J(), Y("button", {
						key: 2,
						id: "deleteSaved",
						class: "button secondary",
						disabled: B(l),
						onClick: j[15] ||= (e) => B(ae)(B(d).id)
					}, N(B(o)("deleteActivity")), 9, kc)) : Z("", !0)
				])),
				X("p", {
					id: "savedMessage",
					class: A({ error: B(m) }),
					role: "status"
				}, N(B(p) ? B(o)(B(p)) : ""), 3),
				B(f) ? (J(), Y("p", Ac, N(B(f)), 1)) : Z("", !0)
			])) : Z("", !0),
			U(X("section", jc, [
				X("div", Mc, [X("div", null, [j[34] ||= X("p", { class: "eyebrow" }, "EduTicTac Play", -1), X("h1", Nc, N(B(o)("libraryTitle")), 1)]), X("button", {
					id: "libraryBack",
					class: "button secondary",
					disabled: B(l),
					onClick: j[16] ||= (e) => B(E)("home")
				}, N(B(o)("back")), 9, Pc)]),
				X("form", {
					class: "library-filters",
					onSubmit: j[20] ||= Ha((e) => B(ie)(), ["prevent"])
				}, [
					U(X("input", {
						id: "librarySearch",
						"onUpdate:modelValue": j[17] ||= (e) => B(b).term = e,
						type: "search",
						placeholder: B(o)("librarySearchPlaceholder"),
						"aria-label": B(o)("libraryFilter")
					}, null, 8, Fc), [[$, B(b).term]]),
					U(X("select", {
						id: "libraryType",
						"onUpdate:modelValue": j[18] ||= (e) => B(b).type = e,
						"aria-label": B(o)("compound.type"),
						onChange: j[19] ||= (e) => B(ie)()
					}, [X("option", Lc, N(B(o)("libraryAllTypes")), 1), (J(!0), Y(K, null, W(B(r), (e) => (J(), Y("option", {
						key: e,
						value: e
					}, N(B(o)(B(i)[e])), 9, Rc))), 128))], 40, Ic), [[Fa, B(b).type]]),
					X("button", {
						id: "libraryFilter",
						type: "submit",
						class: "button secondary",
						disabled: B(l)
					}, N(B(o)("libraryFilter")), 9, zc)
				], 32),
				X("p", Bc, N(B(b).loading ? B(o)("libraryLoading") : B(b).error ? B(o)("libraryError") : B(o)("libraryStatus").replace(":from", B(b).total ? B(b).offset + 1 : 0).replace(":to", B(b).offset + B(b).items.length).replace(":total", B(b).total)), 1),
				X("div", Vc, [!B(b).loading && !B(b).error && !B(b).items.length ? (J(), Y("p", Hc, N(B(o)("libraryEmpty")), 1)) : Z("", !0), (J(!0), Y(K, null, W(B(b).items, (e) => (J(), Y("article", {
					key: e.id,
					class: "library-card"
				}, [
					X("h2", null, N(e.title), 1),
					X("p", Uc, N(B(o)(B(i)[e.type] || e.type)) + " · " + N((e.createdAt || "").slice(0, 10)) + N(e.owned ? " · " + B(o)("libraryYours") : ""), 1),
					X("div", Wc, [
						X("a", {
							class: "button",
							href: B(n) + "/" + e.id
						}, N(B(o)("libraryOpenActivity")), 9, Gc),
						X("a", {
							class: "button secondary",
							href: B(n) + "/api/activities/" + e.id + "/download"
						}, N(B(o)("download")), 9, Kc),
						e.owned || B(w) ? (J(), Y("button", {
							key: 0,
							type: "button",
							class: "button secondary",
							disabled: B(l),
							onClick: (t) => B(ae)(e.id, !0)
						}, N(B(o)("libraryDelete")), 9, qc)) : Z("", !0)
					])
				]))), 128))]),
				X("div", Jc, [X("button", {
					id: "libraryPrev",
					type: "button",
					class: "button secondary",
					disabled: B(b).loading || B(l) || B(b).offset <= 0,
					onClick: j[21] ||= (e) => B(ie)(Math.max(0, B(b).offset - 12))
				}, N(B(o)("libraryPrev")), 9, Yc), X("button", {
					id: "libraryNext",
					type: "button",
					class: "button secondary",
					disabled: B(b).loading || B(l) || !B(b).hasMore,
					onClick: j[22] ||= (e) => B(ie)(B(b).offset + 12)
				}, N(B(o)("libraryNext")), 9, Xc)]),
				X("details", Zc, [
					X("summary", null, N(B(o)("libraryAdmin")), 1),
					X("label", null, [X("span", null, N(B(o)("libraryAdminToken")), 1), U(X("input", {
						id: "libraryToken",
						"onUpdate:modelValue": j[23] ||= (e) => /* @__PURE__ */ R(C) ? C.value = e : null,
						type: "password",
						autocomplete: "off"
					}, null, 512), [[$, B(C)]])]),
					X("button", {
						id: "libraryTokenSave",
						type: "button",
						class: "button secondary",
						disabled: B(l),
						onClick: j[24] ||= (...e) => B(O) && B(O)(...e)
					}, N(B(o)("libraryTokenSave")), 9, Qc),
					X("p", $c, N(B(o)("libraryAdminHelp")), 1),
					X("div", el, [X("fieldset", null, [
						X("legend", null, N(B(o)("catalogAdmin")), 1),
						X("p", tl, N(B(o)("catalogAdminHelp")), 1),
						(J(), Y(K, null, W([
							"subjects",
							"educational_stages",
							"levels",
							"tags"
						], (e, t) => X("label", { key: e }, [X("span", null, N(B(o)("catalog." + [
							"subject",
							"stage",
							"level",
							"tags"
						][t])), 1), U(X("textarea", {
							id: [
								"catalogSubjects",
								"catalogStages",
								"catalogLevels",
								"catalogTags"
							][t],
							"onUpdate:modelValue": (t) => B(v)[e] = t,
							rows: "3"
						}, null, 8, nl), [[$, B(v)[e]]])])), 64)),
						X("button", {
							id: "catalogSave",
							type: "button",
							class: "button secondary",
							disabled: B(l),
							onClick: j[25] ||= (...e) => B(k) && B(k)(...e)
						}, N(B(o)("catalogSave")), 9, rl),
						X("p", il, N(B(y) ? B(o)(B(y)) : ""), 1)
					])])
				])
			], 512), [[Qi, B(s) === "library" && B(c)]]),
			X("dialog", {
				ref_key: "bankDialog",
				ref: S,
				id: "compoundBankDialog",
				onCancel: j[29] ||= (...e) => B(ue) && B(ue)(...e)
			}, [X("form", {
				method: "dialog",
				class: "bank-dialog",
				onSubmit: j[28] ||= Ha((...e) => B(ue) && B(ue)(...e), ["prevent"])
			}, [
				X("div", al, [X("h2", null, N(B(o)("bank.title")), 1), X("button", ol, N(B(o)("bank.close")), 1)]),
				X("label", null, [X("span", null, N(B(o)("bank.search")), 1), U(X("input", {
					id: "compoundBankSearch",
					"onUpdate:modelValue": j[26] ||= (e) => B(x).term = e,
					type: "search",
					onInput: j[27] ||= (...e) => B(ce) && B(ce)(...e)
				}, null, 544), [[$, B(x).term]])]),
				X("div", sl, [B(x).loading ? (J(), Y("p", cl, N(B(o)("bank.loading")), 1)) : B(x).error ? (J(), Y("p", ll, N(B(o)("libraryError")), 1)) : B(x).items.length ? Z("", !0) : (J(), Y("p", ul, N(B(o)("bank.empty")), 1)), (J(!0), Y(K, null, W(B(x).items, (e) => (J(), Y("article", {
					key: e.id,
					class: "library-card"
				}, [X("div", null, [X("h3", null, N(e.title), 1), X("p", dl, N(B(o)(B(i)[e.type])), 1)]), X("button", {
					type: "button",
					class: "button",
					disabled: B(l),
					onClick: (t) => B(le)(e.id)
				}, N(B(o)("bank.addOne")), 9, fl)]))), 128))])
			], 32)], 544),
			B(s) === "home" && B(f) ? (J(), Y("p", pl, N(B(f)), 1)) : Z("", !0)
		])], 64));
	}
};
// services/play/src/main.js
function hl(e) {
	return Ka(ml).mount(e);
}
export { hl as mountPlay };
