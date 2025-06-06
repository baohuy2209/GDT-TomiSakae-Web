if (typeof String.prototype.endsWith == "undefined") {
    String.prototype.endsWith = function (a) {
        return (this.substr(this.length - a.length) === a);
    };
}
if (typeof String.prototype.startsWith == "undefined") {
    String.prototype.startsWith = function (a) {
        return (this.substr(0, a.length) === a);
    };
}
if (typeof Number.prototype.truncateDecimals == "undefined") {
    Number.prototype.truncateDecimals = function (a) {
        var b = this - Math.pow(10, -a) / 2;
        b += b / Math.pow(2, 53);
        return b.toFixed(a);
    };
}
var UltimateLib = (function (b) {
    b.js = [];
    b.css = [];
    b.libraries = [{
        name: "Achievements",
        file: ""
    }, {
        name: "Configuration",
        file: ""
    }, {
        name: "Contracts",
        file: ""
    }, {
        name: "Dialog",
        file: ""
    }, {
        name: "Elements",
        file: ""
    }, {
        name: "GameData",
        file: ""
    }, {
        name: "NameGenerator",
        file: ""
    }, {
        name: "Notifications",
        file: ""
    }, {
        name: "PopupMenu",
        file: ""
    }, {
        name: "Publishers",
        file: ""
    }, {
        name: "Research",
        file: ""
    }, {
        name: "Storage",
        file: ""
    }, {
        name: "Update",
        file: ""
    }, {
        name: "Utils",
        file: ""
    }, {
        name: "Visuals",
        file: ""
    }, {
        name: "VisualTweaks",
        file: ""
    }];
    b.libraries3rd = [{
        name: "base64",
        file: ""
    }, {
        name: "underscore",
        file: ""
    }, {
        name: "github",
        file: ""
    }, {
        name: "foswig",
        file: ""
    }, {
        name: "jstorage",
        file: ""
    }, {
        name: "flot",
        file: ""
    }];

    function a(m) {
        var l = [];
        var j = require("fs");
        if (typeof j == "undefined") {
            return l;
        }
        var c = GDT.getRelativePath() + "/" + m + "/";
        var g = j.readdirSync(c);
        for (var k = 0; k < g.length; k++) {
            var e = g[k];
            var h = e.substring(e.lastIndexOf("/") + 1);
            try {
                var n = j.statSync(c + e);
                if (n.isFile()) {
                    l.push(c + e);
                }
            } catch (d) {
                b.Logger.log("UltimateLib.getFiles - Could not use acquire info on " + e, d);
            }
        }
        return l;
    }
    b.init = function () {
        var c = ModSupport.availableMods;
        $.each(c, function (f, g) {
            if (g.id == "UltimateLib") {
                b.mod = g;
            }
        });
        b.css = ["checkbox", "flot", "messages"];
        if (b.css && b.css.length > 0) {
            var e = $("head");
            $.each(b.css, function (f, g) {
                var h = $(document.createElement("link"));
                h.attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: "mods/UltimateLib/css/" + g + ".css",
                    media: "all"
                });
                e.append(h);
            });
        }
        var d = function (f) {
            UltimateLib.Logger.log("A module has been loaded. " + f);
        };
        GDT.on(GDT.eventKeys.mod.loaded, d);
    };
    b.initDev = function () {
        var e = ["3rd", "libs"];
        b.js = [];
        $.each(e, function (g, h) {
            var f = a(h);
            $.each(f, function (k, i) {
                var l = i.replace(/^.*[\\\/]/, "");
                l = l.substring(0, l.length - 3);
                switch (h) {
                    case "3rd":
                        b.libraries3rd.push({
                            name: l,
                            file: i
                        });
                        break;
                    case "libs":
                        b.libraries.push({
                            name: l,
                            file: i
                        });
                        break;
                    default:
                        break;
                }
                b.js.push(i);
            });
        });
        var c = ModSupport.availableMods;
        $.each(c, function (f, g) {
            if (g.id == "UltimateLib") {
                b.mod = g;
            }
        });
        var d = function (f) {
            UltimateLib.Logger.log("A module has been loaded. " + f);
        };
        GDT.on(GDT.eventKeys.mod.loaded, d);
    };
    b.mod;
    b.getObjByName = function (c) {
        var d = b[c];
        if (!d) {
            d = window[c];
        }
        if (!d) {
            d = eval(c);
        }
        return d;
    };
    return b;
})(UltimateLib || {});
UltimateLib.Logger = (function (b) {
    function a(d) {
        function c(e) {
            return (e >= 0 && e < 10) ? "0" + e : e + "";
        }
        return [
            [c(d.getFullYear()), c(d.getMonth() + 1), d.getDate()].join("-"), [c(d.getHours()), c(d.getMinutes()), c(d.getHours())].join(":")
        ].join(" ");
    }
    b.enabled = false;
    b.log = function (e, c) {
        if (!b.enabled) {
            return;
        }
        var f = a(new Date());
        var d = "";
        if (typeof c == "undefined") {
            d = f + ": " + e;
        } else {
            d = f + ": Error! " + e + "\n" + c.message;
        }
        console.log(d);
    };
    return b;
})(UltimateLib.Logger || {});
UltimateLib.Core = (function (a) {
    a.init = function () {
        UltimateLib.Logger.log("--- UltimateLib main library successfully loaded, now loading additional libs...");
        $.each(UltimateLib.libraries, function (c, f) {
            var e = UltimateLib.getObjByName("UltimateLib." + f.name);
            var d = e ? e.init : null;
            if (d !== undefined) {
                UltimateLib.Logger.log("# Calling UltimateLib internal init function on " + f.name + " (" + f.file + ").");
                d();
            }
        });
        UltimateLib.Logger.log("UltimateLib fully loaded.");
        UltimateLib.Logger.log("----------------------------------------------------------------------");
        var b = ModSupport.availableMods;
    };
    return a;
})(UltimateLib.Core || {});
var Base64 = (function () {
    var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var b = {
        encode: function (l) {
            var m = "";
            var c, d, e;
            var f, g, h, j;
            var k = 0;
            do {
                c = l.charCodeAt(k++);
                d = l.charCodeAt(k++);
                e = l.charCodeAt(k++);
                f = c >> 2;
                g = ((c & 3) << 4) | (d >> 4);
                h = ((d & 15) << 2) | (e >> 6);
                j = e & 63;
                if (isNaN(d)) {
                    h = j = 64;
                } else {
                    if (isNaN(e)) {
                        j = 64;
                    }
                }
                m = m + a.charAt(f) + a.charAt(g) + a.charAt(h) + a.charAt(j);
            } while (k < l.length);
            return m;
        },
        decode: function (l) {
            var m = "";
            var c, d, e;
            var f, g, h, j;
            var k = 0;
            l = l.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
                f = a.indexOf(l.charAt(k++));
                g = a.indexOf(l.charAt(k++));
                h = a.indexOf(l.charAt(k++));
                j = a.indexOf(l.charAt(k++));
                c = (f << 2) | (g >> 4);
                d = ((g & 15) << 4) | (h >> 2);
                e = ((h & 3) << 6) | j;
                m = m + String.fromCharCode(c);
                if (h != 64) {
                    m = m + String.fromCharCode(d);
                }
                if (j != 64) {
                    m = m + String.fromCharCode(e);
                }
            } while (k < l.length);
            return m;
        }
    };
    return b;
})();
if (typeof exports !== "undefined") {
    module.exports = Base64;
} else {
    window.Base64 = Base64;
} (function () {
    var V = this,
        at = V._,
        aj = {},
        ap = Array.prototype,
        ac = Object.prototype,
        aq = Function.prototype,
        al = ap.push,
        av = ap.slice,
        z = ap.concat,
        X = ap.unshift,
        af = ac.toString,
        K = ac.hasOwnProperty,
        aa = ap.forEach,
        an = ap.map,
        R = ap.reduce,
        aw = ap.reduceRight,
        ah = ap.filter,
        Z = ap.every,
        az = ap.some,
        I = ap.indexOf,
        ax = ap.lastIndexOf,
        W = Array.isArray,
        ar = Object.keys,
        ay = aq.bind,
        au = function (a) {
            if (a instanceof au) {
                return a;
            }
            if (!(this instanceof au)) {
                return new au(a);
            }
            this._wrapped = a;
        };
    typeof exports != "undefined" ? (typeof module != "undefined" && module.exports && (exports = module.exports = au), exports._ = au) : V._ = au, au.VERSION = "1.4.2";
    var ak = au.each = au.forEach = function (a, g, d) {
        if (a == null) {
            return;
        }
        if (aa && a.forEach === aa) {
            a.forEach(g, d);
        } else {
            if (a.length === +a.length) {
                for (var b = 0, f = a.length; b < f; b++) {
                    if (g.call(d, a[b], b, a) === aj) {
                        return;
                    }
                }
            } else {
                for (var c in a) {
                    if (au.has(a, c) && g.call(d, a[c], c, a) === aj) {
                        return;
                    }
                }
            }
        }
    };
    au.map = au.collect = function (a, d, b) {
        var c = [];
        return a == null ? c : an && a.map === an ? a.map(d, b) : (ak(a, function (f, g, h) {
            c[c.length] = d.call(b, f, g, h);
        }), c);
    }, au.reduce = au.foldl = au.inject = function (a, f, c, d) {
        var b = arguments.length > 2;
        a == null && (a = []);
        if (R && a.reduce === R) {
            return d && (f = au.bind(f, d)), b ? a.reduce(f, c) : a.reduce(f);
        }
        ak(a, function (g, i, h) {
            b ? c = f.call(d, c, g, i, h) : (c = g, b = !0);
        });
        if (!b) {
            throw new TypeError("Reduce of empty array with no initial value");
        }
        return c;
    }, au.reduceRight = au.foldr = function (a, h, c, f) {
        var b = arguments.length > 2;
        a == null && (a = []);
        if (aw && a.reduceRight === aw) {
            return f && (h = au.bind(h, f)), arguments.length > 2 ? a.reduceRight(h, c) : a.reduceRight(h);
        }
        var g = a.length;
        if (g !== +g) {
            var d = au.keys(a);
            g = d.length;
        }
        ak(a, function (j, e, i) {
            e = d ? d[--g] : --g, b ? c = h.call(f, c, a[e], e, i) : (c = a[e], b = !0);
        });
        if (!b) {
            throw new TypeError("Reduce of empty array with no initial value");
        }
        return c;
    }, au.find = au.detect = function (a, d, b) {
        var c;
        return Q(a, function (f, g, h) {
            if (d.call(b, f, g, h)) {
                return c = f, !0;
            }
        }), c;
    }, au.filter = au.select = function (a, d, b) {
        var c = [];
        return a == null ? c : ah && a.filter === ah ? a.filter(d, b) : (ak(a, function (f, g, h) {
            d.call(b, f, g, h) && (c[c.length] = f);
        }), c);
    }, au.reject = function (a, d, b) {
        var c = [];
        return a == null ? c : (ak(a, function (f, g, h) {
            d.call(b, f, g, h) || (c[c.length] = f);
        }), c);
    }, au.every = au.all = function (a, d, c) {
        d || (d = au.identity);
        var b = !0;
        return a == null ? b : Z && a.every === Z ? a.every(d, c) : (ak(a, function (f, h, g) {
            if (!(b = b && d.call(c, f, h, g))) {
                return aj;
            }
        }), !!b);
    };
    var Q = au.some = au.any = function (a, d, c) {
        d || (d = au.identity);
        var b = !1;
        return a == null ? b : az && a.some === az ? a.some(d, c) : (ak(a, function (f, h, g) {
            if (b || (b = d.call(c, f, h, g))) {
                return aj;
            }
        }), !!b);
    };
    au.contains = au.include = function (a, c) {
        var b = !1;
        return a == null ? b : I && a.indexOf === I ? a.indexOf(c) != -1 : (b = Q(a, function (d) {
            return d === c;
        }), b);
    }, au.invoke = function (a, c) {
        var b = av.call(arguments, 2);
        return au.map(a, function (d) {
            return (au.isFunction(c) ? c : d[c]).apply(d, b);
        });
    }, au.pluck = function (a, b) {
        return au.map(a, function (c) {
            return c[b];
        });
    }, au.where = function (a, b) {
        return au.isEmpty(b) ? [] : au.filter(a, function (c) {
            for (var d in b) {
                if (b[d] !== c[d]) {
                    return !1;
                }
            }
            return !0;
        });
    }, au.max = function (a, d, b) {
        if (!d && au.isArray(a) && a[0] === +a[0] && a.length < 65535) {
            return Math.max.apply(Math, a);
        }
        if (!d && au.isEmpty(a)) {
            return -Infinity;
        }
        var c = {
            computed: -Infinity
        };
        return ak(a, function (f, g, j) {
            var h = d ? d.call(b, f, g, j) : f;
            h >= c.computed && (c = {
                value: f,
                computed: h
            });
        }), c.value;
    }, au.min = function (a, d, b) {
        if (!d && au.isArray(a) && a[0] === +a[0] && a.length < 65535) {
            return Math.min.apply(Math, a);
        }
        if (!d && au.isEmpty(a)) {
            return Infinity;
        }
        var c = {
            computed: Infinity
        };
        return ak(a, function (f, g, j) {
            var h = d ? d.call(b, f, g, j) : f;
            h < c.computed && (c = {
                value: f,
                computed: h
            });
        }), c.value;
    }, au.shuffle = function (a) {
        var d, b = 0,
            c = [];
        return ak(a, function (f) {
            d = au.random(b++), c[b - 1] = c[d], c[d] = f;
        }), c;
    };
    var ae = function (a) {
        return au.isFunction(a) ? a : function (b) {
            return b[a];
        };
    };
    au.sortBy = function (a, d, b) {
        var c = ae(d);
        return au.pluck(au.map(a, function (f, h, g) {
            return {
                value: f,
                index: h,
                criteria: c.call(b, f, h, g)
            };
        }).sort(function (f, i) {
            var g = f.criteria,
                h = i.criteria;
            if (g !== h) {
                if (g > h || g === void 0) {
                    return 1;
                }
                if (g < h || h === void 0) {
                    return -1;
                }
            }
            return f.index < i.index ? -1 : 1;
        }), "value");
    };
    var ag = function (a, g, c, d) {
        var b = {},
            f = ae(g);
        return ak(a, function (h, e) {
            var i = f.call(c, h, e, a);
            d(b, i, h);
        }), b;
    };
    au.groupBy = function (a, c, b) {
        return ag(a, c, b, function (d, g, f) {
            (au.has(d, g) ? d[g] : d[g] = []).push(f);
        });
    }, au.countBy = function (a, c, b) {
        return ag(a, c, b, function (d, g, f) {
            au.has(d, g) || (d[g] = 0), d[g]++;
        });
    }, au.sortedIndex = function (a, h, c, f) {
        c = c == null ? au.identity : ae(c);
        var b = c.call(f, h),
            g = 0,
            d = a.length;
        while (g < d) {
            var j = g + d >>> 1;
            c.call(f, a[j]) < b ? g = j + 1 : d = j;
        }
        return g;
    }, au.toArray = function (a) {
        return a ? a.length === +a.length ? av.call(a) : au.values(a) : [];
    }, au.size = function (a) {
        return a.length === +a.length ? a.length : au.keys(a).length;
    }, au.first = au.head = au.take = function (a, c, b) {
        return c != null && !b ? av.call(a, 0, c) : a[0];
    }, au.initial = function (a, c, b) {
        return av.call(a, 0, a.length - (c == null || b ? 1 : c));
    }, au.last = function (a, c, b) {
        return c != null && !b ? av.call(a, Math.max(a.length - c, 0)) : a[a.length - 1];
    }, au.rest = au.tail = au.drop = function (a, c, b) {
        return av.call(a, c == null || b ? 1 : c);
    }, au.compact = function (a) {
        return au.filter(a, function (b) {
            return !!b;
        });
    };
    var G = function (a, c, b) {
        return ak(a, function (d) {
            au.isArray(d) ? c ? al.apply(b, d) : G(d, c, b) : b.push(d);
        }), b;
    };
    au.flatten = function (a, b) {
        return G(a, b, []);
    }, au.without = function (a) {
        return au.difference(a, av.call(arguments, 1));
    }, au.uniq = au.unique = function (a, h, c, f) {
        var b = c ? au.map(a, c, f) : a,
            g = [],
            d = [];
        return ak(b, function (e, i) {
            if (h ? !i || d[d.length - 1] !== e : !au.contains(d, e)) {
                d.push(e), g.push(a[i]);
            }
        }), g;
    }, au.union = function () {
        return au.uniq(z.apply(ap, arguments));
    }, au.intersection = function (a) {
        var b = av.call(arguments, 1);
        return au.filter(au.uniq(a), function (c) {
            return au.every(b, function (d) {
                return au.indexOf(d, c) >= 0;
            });
        });
    }, au.difference = function (a) {
        var b = z.apply(ap, av.call(arguments, 1));
        return au.filter(a, function (c) {
            return !au.contains(b, c);
        });
    }, au.zip = function () {
        var a = av.call(arguments),
            d = au.max(au.pluck(a, "length")),
            b = new Array(d);
        for (var c = 0; c < d; c++) {
            b[c] = au.pluck(a, "" + c);
        }
        return b;
    }, au.object = function (a, f) {
        var c = {};
        for (var d = 0, b = a.length; d < b; d++) {
            f ? c[a[d]] = f[d] : c[a[d][0]] = a[d][1];
        }
        return c;
    }, au.indexOf = function (a, f, c) {
        if (a == null) {
            return -1;
        }
        var d = 0,
            b = a.length;
        if (c) {
            if (typeof c != "number") {
                return d = au.sortedIndex(a, f), a[d] === f ? d : -1;
            }
            d = c < 0 ? Math.max(0, b + c) : c;
        }
        if (I && a.indexOf === I) {
            return a.indexOf(f, c);
        }
        for (; d < b; d++) {
            if (a[d] === f) {
                return d;
            }
        }
        return -1;
    }, au.lastIndexOf = function (a, f, c) {
        if (a == null) {
            return -1;
        }
        var d = c != null;
        if (ax && a.lastIndexOf === ax) {
            return d ? a.lastIndexOf(f, c) : a.lastIndexOf(f);
        }
        var b = d ? c : a.length;
        while (b--) {
            if (a[b] === f) {
                return b;
            }
        }
        return -1;
    }, au.range = function (a, g, c) {
        arguments.length <= 1 && (g = a || 0, a = 0), c = arguments[2] || 1;
        var d = Math.max(Math.ceil((g - a) / c), 0),
            b = 0,
            f = new Array(d);
        while (b < d) {
            f[b++] = a, a += c;
        }
        return f;
    };
    var am = function () { };
    au.bind = function (d, b) {
        var c, a;
        if (d.bind === ay && ay) {
            return ay.apply(d, av.call(arguments, 1));
        }
        if (!au.isFunction(d)) {
            throw new TypeError;
        }
        return a = av.call(arguments, 2), c = function () {
            if (this instanceof c) {
                am.prototype = d.prototype;
                var f = new am,
                    g = d.apply(f, a.concat(av.call(arguments)));
                return Object(g) === g ? g : f;
            }
            return d.apply(b, a.concat(av.call(arguments)));
        };
    }, au.bindAll = function (a) {
        var b = av.call(arguments, 1);
        return b.length == 0 && (b = au.functions(a)), ak(b, function (c) {
            a[c] = au.bind(a[c], a);
        }), a;
    }, au.memoize = function (a, c) {
        var b = {};
        return c || (c = au.identity),
            function () {
                var d = c.apply(this, arguments);
                return au.has(b, d) ? b[d] : b[d] = a.apply(this, arguments);
            };
    }, au.delay = function (a, c) {
        var b = av.call(arguments, 2);
        return setTimeout(function () {
            return a.apply(null, b);
        }, c);
    }, au.defer = function (a) {
        return au.delay.apply(au, [a, 1].concat(av.call(arguments, 1)));
    }, au.throttle = function (c, k) {
        var f, h, d, j, g, l, b = au.debounce(function () {
            g = j = !1;
        }, k);
        return function () {
            f = this, h = arguments;
            var a = function () {
                d = null, g && (l = c.apply(f, h)), b();
            };
            return d || (d = setTimeout(a, k)), j ? g = !0 : (j = !0, l = c.apply(f, h)), b(), l;
        };
    }, au.debounce = function (a, f, c) {
        var d, b;
        return function () {
            var h = this,
                g = arguments,
                i = function () {
                    d = null, c || (b = a.apply(h, g));
                },
                e = c && !d;
            return clearTimeout(d), d = setTimeout(i, f), e && (b = a.apply(h, g)), b;
        };
    }, au.once = function (a) {
        var c = !1,
            b;
        return function () {
            return c ? b : (c = !0, b = a.apply(this, arguments), a = null, b);
        };
    }, au.wrap = function (a, b) {
        return function () {
            var c = [a];
            return al.apply(c, arguments), b.apply(this, c);
        };
    }, au.compose = function () {
        var a = arguments;
        return function () {
            var c = arguments;
            for (var b = a.length - 1; b >= 0; b--) {
                c = [a[b].apply(this, c)];
            }
            return c[0];
        };
    }, au.after = function (a, b) {
        return a <= 0 ? b() : function () {
            if (--a < 1) {
                return b.apply(this, arguments);
            }
        };
    }, au.keys = ar || function (a) {
        if (a !== Object(a)) {
            throw new TypeError("Invalid object");
        }
        var c = [];
        for (var b in a) {
            au.has(a, b) && (c[c.length] = b);
        }
        return c;
    }, au.values = function (a) {
        var c = [];
        for (var b in a) {
            au.has(a, b) && c.push(a[b]);
        }
        return c;
    }, au.pairs = function (a) {
        var c = [];
        for (var b in a) {
            au.has(a, b) && c.push([b, a[b]]);
        }
        return c;
    }, au.invert = function (a) {
        var c = {};
        for (var b in a) {
            au.has(a, b) && (c[a[b]] = b);
        }
        return c;
    }, au.functions = au.methods = function (a) {
        var c = [];
        for (var b in a) {
            au.isFunction(a[b]) && c.push(b);
        }
        return c.sort();
    }, au.extend = function (a) {
        return ak(av.call(arguments, 1), function (c) {
            for (var b in c) {
                a[b] = c[b];
            }
        }), a;
    }, au.pick = function (a) {
        var c = {},
            b = z.apply(ap, av.call(arguments, 1));
        return ak(b, function (d) {
            d in a && (c[d] = a[d]);
        }), c;
    }, au.omit = function (a) {
        var d = {},
            c = z.apply(ap, av.call(arguments, 1));
        for (var b in a) {
            au.contains(c, b) || (d[b] = a[b]);
        }
        return d;
    }, au.defaults = function (a) {
        return ak(av.call(arguments, 1), function (c) {
            for (var b in c) {
                a[b] == null && (a[b] = c[b]);
            }
        }), a;
    }, au.clone = function (a) {
        return au.isObject(a) ? au.isArray(a) ? a.slice() : au.extend({}, a) : a;
    }, au.tap = function (a, b) {
        return b(a), a;
    };
    var ai = function (g, v, k, m) {
        if (g === v) {
            return g !== 0 || 1 / g == 1 / v;
        }
        if (g == null || v == null) {
            return g === v;
        }
        g instanceof au && (g = g._wrapped), v instanceof au && (v = v._wrapped);
        var j = af.call(g);
        if (j != af.call(v)) {
            return !1;
        }
        switch (j) {
            case "[object String]":
                return g == String(v);
            case "[object Number]":
                return g != +g ? v != +v : g == 0 ? 1 / g == 1 / v : g == +v;
            case "[object Date]":
            case "[object Boolean]":
                return +g == +v;
            case "[object RegExp]":
                return g.source == v.source && g.global == v.global && g.multiline == v.multiline && g.ignoreCase == v.ignoreCase;
        }
        if (typeof g != "object" || typeof v != "object") {
            return !1;
        }
        var p = k.length;
        while (p--) {
            if (k[p] == g) {
                return m[p] == v;
            }
        }
        k.push(g), m.push(v);
        var l = 0,
            w = !0;
        if (j == "[object Array]") {
            l = g.length, w = l == v.length;
            if (w) {
                while (l--) {
                    if (!(w = ai(g[l], v[l], k, m))) {
                        break;
                    }
                }
            }
        } else {
            var b = g.constructor,
                h = v.constructor;
            if (b !== h && !(au.isFunction(b) && b instanceof b && au.isFunction(h) && h instanceof h)) {
                return !1;
            }
            for (var d in g) {
                if (au.has(g, d)) {
                    l++;
                    if (!(w = au.has(v, d) && ai(g[d], v[d], k, m))) {
                        break;
                    }
                }
            }
            if (w) {
                for (d in v) {
                    if (au.has(v, d) && !(l--)) {
                        break;
                    }
                }
                w = !l;
            }
        }
        return k.pop(), m.pop(), w;
    };
    au.isEqual = function (a, b) {
        return ai(a, b, [], []);
    }, au.isEmpty = function (a) {
        if (a == null) {
            return !0;
        }
        if (au.isArray(a) || au.isString(a)) {
            return a.length === 0;
        }
        for (var b in a) {
            if (au.has(a, b)) {
                return !1;
            }
        }
        return !0;
    }, au.isElement = function (a) {
        return !!a && a.nodeType === 1;
    }, au.isArray = W || function (a) {
        return af.call(a) == "[object Array]";
    }, au.isObject = function (a) {
        return a === Object(a);
    }, ak(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (a) {
        au["is" + a] = function (b) {
            return af.call(b) == "[object " + a + "]";
        };
    }), au.isArguments(arguments) || (au.isArguments = function (a) {
        return !!a && !!au.has(a, "callee");
    }), typeof /./ != "function" && (au.isFunction = function (a) {
        return typeof a == "function";
    }), au.isFinite = function (a) {
        return au.isNumber(a) && isFinite(a);
    }, au.isNaN = function (a) {
        return au.isNumber(a) && a != +a;
    }, au.isBoolean = function (a) {
        return a === !0 || a === !1 || af.call(a) == "[object Boolean]";
    }, au.isNull = function (a) {
        return a === null;
    }, au.isUndefined = function (a) {
        return a === void 0;
    }, au.has = function (a, b) {
        return K.call(a, b);
    }, au.noConflict = function () {
        return V._ = at, this;
    }, au.identity = function (a) {
        return a;
    }, au.times = function (a, d, b) {
        for (var c = 0; c < a; c++) {
            d.call(b, c);
        }
    }, au.random = function (a, b) {
        return b == null && (b = a, a = 0), a + (0 | Math.random() * (b - a + 1));
    };
    var q = {
        escape: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "/": "&#x2F;"
        }
    };
    q.unescape = au.invert(q.escape);
    var U = {
        escape: new RegExp("[" + au.keys(q.escape).join("") + "]", "g"),
        unescape: new RegExp("(" + au.keys(q.unescape).join("|") + ")", "g")
    };
    au.each(["escape", "unescape"], function (a) {
        au[a] = function (b) {
            return b == null ? "" : ("" + b).replace(U[a], function (c) {
                return q[a][c];
            });
        };
    }), au.result = function (a, c) {
        if (a == null) {
            return null;
        }
        var b = a[c];
        return au.isFunction(b) ? b.call(a) : b;
    }, au.mixin = function (a) {
        ak(au.functions(a), function (c) {
            var b = au[c] = a[c];
            au.prototype[c] = function () {
                var d = [this._wrapped];
                return al.apply(d, arguments), Y.call(this, b.apply(au, d));
            };
        });
    };
    var ao = 0;
    au.uniqueId = function (a) {
        var b = ao++;
        return a ? a + b : b;
    }, au.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var ab = /(.)^/,
        J = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "  ": "t",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        ad = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    au.template = function (c, k, f) {
        f = au.defaults({}, f, au.templateSettings);
        var h = new RegExp([(f.escape || ab).source, (f.interpolate || ab).source, (f.evaluate || ab).source].join("|") + "|$", "g"),
            d = 0,
            j = "__p+='";
        c.replace(h, function (m, a, i, e, p) {
            j += c.slice(d, p).replace(ad, function (n) {
                return "\\" + J[n];
            }), j += a ? "'+\n((__t=(" + a + "))==null?'':_.escape(__t))+\n'" : i ? "'+\n((__t=(" + i + "))==null?'':__t)+\n'" : e ? "';\n" + e + "\n__p+='" : "", d = p + m.length;
        }), j += "';\n", f.variable || (j = "with(obj||{}){\n" + j + "}\n"), j = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + j + "return __p;\n";
        try {
            var g = new Function(f.variable || "obj", "_", j);
        } catch (l) {
            throw l.source = j, l;
        }
        if (k) {
            return g(k, au);
        }
        var b = function (a) {
            return g.call(this, a, au);
        };
        return b.source = "function(" + (f.variable || "obj") + "){\n" + j + "}", b;
    }, au.chain = function (a) {
        return au(a).chain();
    };
    var Y = function (a) {
        return this._chain ? au(a).chain() : a;
    };
    au.mixin(au), ak(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (a) {
        var b = ap[a];
        au.prototype[a] = function () {
            var c = this._wrapped;
            return b.apply(c, arguments), (a == "shift" || a == "splice") && c.length === 0 && delete c[0], Y.call(this, c);
        };
    }), ak(["concat", "join", "slice"], function (a) {
        var b = ap[a];
        au.prototype[a] = function () {
            return Y.call(this, b.apply(this._wrapped, arguments));
        };
    }), au.extend(au.prototype, {
        chain: function () {
            return this._chain = !0, this;
        },
        value: function () {
            return this._wrapped;
        }
    });
}).call(this);
(function (a) {
    a.foswig = {};
    a.foswig.MarkovChain = function (b) {
        function o(e) {
            e = e.toLowerCase();
            for (var h = d, k = 0; k < e.length;
                ++k) {
                if (h = h.children[e[k]], !h) {
                    return !1;
                }
            }
            return !0;
        }

        function f(e) {
            1 < e.length && f(e.substr(1));
            for (var h = d, k = 0; k < e.length;
                ++k) {
                var l = h.children[e[k]];
                l || (l = new g, h.children[e[k]] = l);
                h = l;
            }
        }

        function i(e) {
            this.b = e;
            this.a = [];
        }

        function g() {
            this.children = [];
        }
        var d = new g,
            c = new i(""),
            j = {};
        this.addWordsToChain = function (e) {
            for (var h = 0; h < e.length;
                ++h) {
                this.addWordToChain(e[h]);
            }
        };
        this.addWordToChain = function (e) {
            f(e.toLowerCase());
            for (var h = c, k = "", l = 0; l < e.length;
                ++l) {
                var n = e[l],
                    k = k + n;
                k.length > b && (k = k.substr(1));
                var m = j[k];
                m || (m = new i(n), j[k] = m);
                h.a.push(m);
                h = m;
            }
            h.a.push(null);
        };
        this.generateWord = function (h, k, l) {
            var m, n;
            do {
                n = !1;
                var p = Math.floor(Math.random() * c.a.length),
                    q = c.a[p];
                for (m = ""; q && m.length <= k;) {
                    m += q.b, p = Math.floor(Math.random() * q.a.length), q = q.a[p];
                }
                if (m.length > k || m.length < h) {
                    n = !0;
                }
            } while (n || !l && o(m));
            return m;
        };
    };
    "function" === typeof a.define && a.define.amd && a.define("foswig", [], function () {
        return a.foswig;
    });
})("undefined" !== typeof window ? window : this);
(function () {
    var D = "0.4.7",
        a = window.jQuery || window.$ || (window.$ = {}),
        C = {
            parse: window.JSON && (window.JSON.parse || window.JSON.decode) || String.prototype.evalJSON && function (F) {
                return String(F).evalJSON();
            } || a.parseJSON || a.evalJSON,
            stringify: Object.toJSON || window.JSON && (window.JSON.stringify || window.JSON.encode) || a.toJSON
        };
    if (!("parse" in C) || !("stringify" in C)) {
        throw new Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page");
    }
    var v = {
        __jstorage_meta: {
            CRC32: {}
        }
    },
        x = {
            jStorage: "{}"
        },
        w = null,
        y = 0,
        b = false,
        n = {},
        l = false,
        m = 0,
        r = {},
        q = +new Date(),
        A, B = {
            isXML: function (G) {
                var F = (G ? G.ownerDocument || G : 0).documentElement;
                return F ? F.nodeName !== "HTML" : false;
            },
            encode: function (H) {
                if (!this.isXML(H)) {
                    return false;
                }
                try {
                    return new XMLSerializer().serializeToString(H);
                } catch (F) {
                    try {
                        return H.xml;
                    } catch (G) { }
                }
                return false;
            },
            decode: function (H) {
                var F = ("DOMParser" in window && (new DOMParser()).parseFromString) || (window.ActiveXObject && function (I) {
                    var J = new ActiveXObject("Microsoft.XMLDOM");
                    J.async = "false";
                    J.loadXML(I);
                    return J;
                }),
                    G;
                if (!F) {
                    return false;
                }
                G = F.call("DOMParser" in window && (new DOMParser()) || window, H, "text/xml");
                return this.isXML(G) ? G : false;
            }
        };

    function j() {
        var M = false;
        if ("localStorage" in window) {
            try {
                window.localStorage.setItem("_tmptest", "tmpval");
                M = true;
                window.localStorage.removeItem("_tmptest");
            } catch (F) { }
        }
        if (M) {
            try {
                if (window.localStorage) {
                    x = window.localStorage;
                    b = "localStorage";
                    m = x.jStorage_update;
                }
            } catch (I) { }
        } else {
            if ("globalStorage" in window) {
                try {
                    if (window.globalStorage) {
                        if (window.location.hostname == "localhost") {
                            x = window.globalStorage["localhost.localdomain"];
                        } else {
                            x = window.globalStorage[window.location.hostname];
                        }
                        b = "globalStorage";
                        m = x.jStorage_update;
                    }
                } catch (J) { }
            } else {
                w = document.createElement("link");
                if (w.addBehavior) {
                    w.style.behavior = "url(#default#userData)";
                    document.getElementsByTagName("head")[0].appendChild(w);
                    try {
                        w.load("jStorage");
                    } catch (H) {
                        w.setAttribute("jStorage", "{}");
                        w.save("jStorage");
                        w.load("jStorage");
                    }
                    var G = "{}";
                    try {
                        G = w.getAttribute("jStorage");
                    } catch (K) { }
                    try {
                        m = w.getAttribute("jStorage_update");
                    } catch (L) { }
                    x.jStorage = G;
                    b = "userDataBehavior";
                } else {
                    w = null;
                    return;
                }
            }
        }
        k();
        i();
        u();
        h();
        if ("addEventListener" in window) {
            window.addEventListener("pageshow", function (N) {
                if (N.persisted) {
                    z();
                }
            }, false);
        }
    }

    function s() {
        var F = "{}";
        if (b == "userDataBehavior") {
            w.load("jStorage");
            try {
                F = w.getAttribute("jStorage");
            } catch (G) { }
            try {
                m = w.getAttribute("jStorage_update");
            } catch (H) { }
            x.jStorage = F;
        }
        k();
        i();
        h();
    }

    function u() {
        if (b == "localStorage" || b == "globalStorage") {
            if ("addEventListener" in window) {
                window.addEventListener("storage", z, false);
            } else {
                document.attachEvent("onstorage", z);
            }
        } else {
            if (b == "userDataBehavior") {
                setInterval(z, 1000);
            }
        }
    }

    function z() {
        var F;
        clearTimeout(l);
        l = setTimeout(function () {
            if (b == "localStorage" || b == "globalStorage") {
                F = x.jStorage_update;
            } else {
                if (b == "userDataBehavior") {
                    w.load("jStorage");
                    try {
                        F = w.getAttribute("jStorage_update");
                    } catch (G) { }
                }
            }
            if (F && F != m) {
                m = F;
                d();
            }
        }, 25);
    }

    function d() {
        var H = C.parse(C.stringify(v.__jstorage_meta.CRC32)),
            G;
        s();
        G = C.parse(C.stringify(v.__jstorage_meta.CRC32));
        var F, J = [],
            I = [];
        for (F in H) {
            if (H.hasOwnProperty(F)) {
                if (!G[F]) {
                    I.push(F);
                    continue;
                }
                if (H[F] != G[F] && String(H[F]).substr(0, 2) == "2.") {
                    J.push(F);
                }
            }
        }
        for (F in G) {
            if (G.hasOwnProperty(F)) {
                if (!H[F]) {
                    J.push(F);
                }
            }
        }
        f(J, "updated");
        f(I, "deleted");
    }

    function f(K, F) {
        K = [].concat(K || []);
        if (F == "flushed") {
            K = [];
            for (var J in n) {
                if (n.hasOwnProperty(J)) {
                    K.push(J);
                }
            }
            F = "deleted";
        }
        for (var G = 0, L = K.length; G < L; G++) {
            if (n[K[G]]) {
                for (var H = 0, I = n[K[G]].length; H < I; H++) {
                    n[K[G]][H](K[G], F);
                }
            }
            if (n["*"]) {
                for (var H = 0, I = n["*"].length; H < I; H++) {
                    n["*"][H](K[G], F);
                }
            }
        }
    }

    function p() {
        var G = (+new Date()).toString();
        if (b == "localStorage" || b == "globalStorage") {
            try {
                x.jStorage_update = G;
            } catch (F) {
                b = false;
            }
        } else {
            if (b == "userDataBehavior") {
                w.setAttribute("jStorage_update", G);
                w.save("jStorage");
            }
        }
        z();
    }

    function k() {
        if (x.jStorage) {
            try {
                v = C.parse(String(x.jStorage));
            } catch (F) {
                x.jStorage = "{}";
            }
        } else {
            x.jStorage = "{}";
        }
        y = x.jStorage ? String(x.jStorage).length : 0;
        if (!v.__jstorage_meta) {
            v.__jstorage_meta = {};
        }
        if (!v.__jstorage_meta.CRC32) {
            v.__jstorage_meta.CRC32 = {};
        }
    }

    function t() {
        e();
        try {
            x.jStorage = C.stringify(v);
            if (w) {
                w.setAttribute("jStorage", x.jStorage);
                w.save("jStorage");
            }
            y = x.jStorage ? String(x.jStorage).length : 0;
        } catch (F) { }
    }

    function c(F) {
        if (!F || (typeof F != "string" && typeof F != "number")) {
            throw new TypeError("Key name must be string or numeric");
        }
        if (F == "__jstorage_meta") {
            throw new TypeError("Reserved key name");
        }
        return true;
    }

    function i() {
        var H, J, L, G, K = Infinity,
            F = false,
            I = [];
        clearTimeout(A);
        if (!v.__jstorage_meta || typeof v.__jstorage_meta.TTL != "object") {
            return;
        }
        H = +new Date();
        L = v.__jstorage_meta.TTL;
        G = v.__jstorage_meta.CRC32;
        for (J in L) {
            if (L.hasOwnProperty(J)) {
                if (L[J] <= H) {
                    delete L[J];
                    delete G[J];
                    delete v[J];
                    F = true;
                    I.push(J);
                } else {
                    if (L[J] < K) {
                        K = L[J];
                    }
                }
            }
        }
        if (K != Infinity) {
            A = setTimeout(i, K - H);
        }
        if (F) {
            t();
            p();
            f(I, "deleted");
        }
    }

    function h() {
        var G, H;
        if (!v.__jstorage_meta.PubSub) {
            return;
        }
        var I, F = q;
        for (G = H = v.__jstorage_meta.PubSub.length - 1; G >= 0; G--) {
            I = v.__jstorage_meta.PubSub[G];
            if (I[0] > q) {
                F = I[0];
                g(I[1], I[2]);
            }
        }
        q = F;
    }

    function g(F, J) {
        if (r[F]) {
            for (var H = 0, I = r[F].length; H < I; H++) {
                try {
                    r[F][H](F, C.parse(C.stringify(J)));
                } catch (G) { }
            }
        }
    }

    function e() {
        if (!v.__jstorage_meta.PubSub) {
            return;
        }
        var H = +new Date() - 2000;
        for (var F = 0, G = v.__jstorage_meta.PubSub.length; F < G; F++) {
            if (v.__jstorage_meta.PubSub[F][0] <= H) {
                v.__jstorage_meta.PubSub.splice(F, v.__jstorage_meta.PubSub.length - F);
                break;
            }
        }
        if (!v.__jstorage_meta.PubSub.length) {
            delete v.__jstorage_meta.PubSub;
        }
    }

    function o(F, G) {
        if (!v.__jstorage_meta) {
            v.__jstorage_meta = {};
        }
        if (!v.__jstorage_meta.PubSub) {
            v.__jstorage_meta.PubSub = [];
        }
        v.__jstorage_meta.PubSub.unshift([+new Date, F, G]);
        t();
        p();
    }

    function E(K, J) {
        var I = K.length,
            F = J ^ I,
            G = 0,
            H;
        while (I >= 4) {
            H = ((K.charCodeAt(G) & 255)) | ((K.charCodeAt(++G) & 255) << 8) | ((K.charCodeAt(++G) & 255) << 16) | ((K.charCodeAt(++G) & 255) << 24);
            H = (((H & 65535) * 1540483477) + ((((H >>> 16) * 1540483477) & 65535) << 16));
            H ^= H >>> 24;
            H = (((H & 65535) * 1540483477) + ((((H >>> 16) * 1540483477) & 65535) << 16));
            F = (((F & 65535) * 1540483477) + ((((F >>> 16) * 1540483477) & 65535) << 16)) ^ H;
            I -= 4;
            ++G;
        }
        switch (I) {
            case 3:
                F ^= (K.charCodeAt(G + 2) & 255) << 16;
            case 2:
                F ^= (K.charCodeAt(G + 1) & 255) << 8;
            case 1:
                F ^= (K.charCodeAt(G) & 255);
                F = (((F & 65535) * 1540483477) + ((((F >>> 16) * 1540483477) & 65535) << 16));
        }
        F ^= F >>> 13;
        F = (((F & 65535) * 1540483477) + ((((F >>> 16) * 1540483477) & 65535) << 16));
        F ^= F >>> 15;
        return F >>> 0;
    }
    a.jStorage = {
        version: D,
        set: function (F, H, G) {
            c(F);
            G = G || {};
            if (typeof H == "undefined") {
                this.deleteKey(F);
                return H;
            }
            if (B.isXML(H)) {
                H = {
                    _is_xml: true,
                    xml: B.encode(H)
                };
            } else {
                if (typeof H == "function") {
                    return undefined;
                } else {
                    if (H && typeof H == "object") {
                        H = C.parse(C.stringify(H));
                    }
                }
            }
            v[F] = H;
            v.__jstorage_meta.CRC32[F] = "2." + E(C.stringify(H), 2538058380);
            this.setTTL(F, G.TTL || 0);
            f(F, "updated");
            return H;
        },
        get: function (G, F) {
            c(G);
            if (G in v) {
                if (v[G] && typeof v[G] == "object" && v[G]._is_xml) {
                    return B.decode(v[G].xml);
                } else {
                    return v[G];
                }
            }
            return typeof (F) == "undefined" ? null : F;
        },
        deleteKey: function (F) {
            c(F);
            if (F in v) {
                delete v[F];
                if (typeof v.__jstorage_meta.TTL == "object" && F in v.__jstorage_meta.TTL) {
                    delete v.__jstorage_meta.TTL[F];
                }
                delete v.__jstorage_meta.CRC32[F];
                t();
                p();
                f(F, "deleted");
                return true;
            }
            return false;
        },
        setTTL: function (G, H) {
            var F = +new Date();
            c(G);
            H = Number(H) || 0;
            if (G in v) {
                if (!v.__jstorage_meta.TTL) {
                    v.__jstorage_meta.TTL = {};
                }
                if (H > 0) {
                    v.__jstorage_meta.TTL[G] = F + H;
                } else {
                    delete v.__jstorage_meta.TTL[G];
                }
                t();
                i();
                p();
                return true;
            }
            return false;
        },
        getTTL: function (G) {
            var F = +new Date(),
                H;
            c(G);
            if (G in v && v.__jstorage_meta.TTL && v.__jstorage_meta.TTL[G]) {
                H = v.__jstorage_meta.TTL[G] - F;
                return H || 0;
            }
            return 0;
        },
        flush: function () {
            v = {
                __jstorage_meta: {
                    CRC32: {}
                }
            };
            t();
            p();
            f(null, "flushed");
            return true;
        },
        storageObj: function () {
            function G() { }
            G.prototype = v;
            return new G();
        },
        index: function () {
            var G = [],
                F;
            for (F in v) {
                if (v.hasOwnProperty(F) && F != "__jstorage_meta") {
                    G.push(F);
                }
            }
            return G;
        },
        storageSize: function () {
            return y;
        },
        currentBackend: function () {
            return b;
        },
        storageAvailable: function () {
            return !!b;
        },
        listenKeyChange: function (G, F) {
            c(G);
            if (!n[G]) {
                n[G] = [];
            }
            n[G].push(F);
        },
        stopListening: function (H, F) {
            c(H);
            if (!n[H]) {
                return;
            }
            if (!F) {
                delete n[H];
                return;
            }
            for (var G = n[H].length - 1; G >= 0; G--) {
                if (n[H][G] == F) {
                    n[H].splice(G, 1);
                }
            }
        },
        subscribe: function (G, F) {
            G = (G || "").toString();
            if (!G) {
                throw new TypeError("Channel not defined");
            }
            if (!r[G]) {
                r[G] = [];
            }
            r[G].push(F);
        },
        publish: function (F, G) {
            F = (F || "").toString();
            if (!F) {
                throw new TypeError("Channel not defined");
            }
            o(F, G);
        },
        reInit: function () {
            s();
        },
        noConflict: function (F) {
            delete window.$.jStorage;
            if (F) {
                window.jStorage = this;
            }
            return this;
        }
    };
    j();
})();
(function () {
    var e, c, a;
    if (typeof exports !== "undefined") {
        e = require("xmlhttprequest").XMLHttpRequest;
        a = require("underscore");
        c = require("./lib/base64.js");
    } else {
        a = window._;
        c = window.Base64;
    }
    if (typeof window !== "undefined" && typeof window.XMLHttpRequest !== "undefined") {
        e = window.XMLHttpRequest;
    }
    var b = "https://api.github.com";
    var d = function (h) {
        function f(l, m, j, i, n, o) {
            function k() {
                var q = m.indexOf("//") >= 0 ? m : b + m;
                return q + ((/\?/).test(q) ? "&" : "?") + (new Date()).getTime();
            }
            var p = new e();
            if (!n) {
                p.dataType = "json";
            }
            p.open(l, k(), !o);
            if (!o) {
                p.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status >= 200 && this.status < 300 || this.status === 304) {
                            i(null, n ? this.responseText : this.responseText ? JSON.parse(this.responseText) : true, this);
                        } else {
                            i({
                                path: m,
                                request: this,
                                error: this.status
                            });
                        }
                    }
                };
            }
            p.setRequestHeader("Accept", "application/vnd.github.raw+json");
            p.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            if ((h.token) || (h.username && h.password)) {
                p.setRequestHeader("Authorization", h.token ? "token " + h.token : "Basic " + c.encode(h.username + ":" + h.password));
            }
            j ? p.send(JSON.stringify(j)) : p.send();
            if (o) {
                return p.response;
            }
        }

        function g(k, i) {
            var l = [];
            (function j() {
                f("GET", k, null, function (m, p, q) {
                    if (m) {
                        return i(m);
                    }
                    l.push.apply(l, p);
                    var n = (q.getResponseHeader("link") || "").split(/\s*,\s*/g),
                        o = a.find(n, function (r) {
                            return /rel="next"/.test(r);
                        });
                    if (o) {
                        o = (/<(.*)>/.exec(o) || [])[1];
                    }
                    if (!o) {
                        i(m, l);
                    } else {
                        k = o;
                        j();
                    }
                });
            })();
        }
        d.User = function () {
            this.repos = function (i) {
                g("/user/repos?type=all&per_page=1000&sort=updated", function (j, k) {
                    i(j, k);
                });
            };
            this.orgs = function (i) {
                f("GET", "/user/orgs", null, function (j, k) {
                    i(j, k);
                });
            };
            this.gists = function (i) {
                f("GET", "/gists", null, function (j, k) {
                    i(j, k);
                });
            };
            this.notifications = function (i) {
                f("GET", "/notifications", null, function (j, k) {
                    i(j, k);
                });
            };
            this.show = function (k, i) {
                var j = k ? "/users/" + k : "/user";
                f("GET", j, null, function (l, m) {
                    i(l, m);
                });
            };
            this.userRepos = function (j, i) {
                g("/users/" + j + "/repos?type=all&per_page=1000&sort=updated", function (k, l) {
                    i(k, l);
                });
            };
            this.userGists = function (j, i) {
                f("GET", "/users/" + j + "/gists", null, function (k, l) {
                    i(k, l);
                });
            };
            this.orgRepos = function (j, i) {
                g("/orgs/" + j + "/repos?type=all&&page_num=1000&sort=updated&direction=desc", function (k, l) {
                    i(k, l);
                });
            };
            this.follow = function (j, i) {
                f("PUT", "/user/following/" + j, null, function (k, l) {
                    i(k, l);
                });
            };
            this.unfollow = function (j, i) {
                f("DELETE", "/user/following/" + j, null, function (k, l) {
                    i(k, l);
                });
            };
        };
        d.Repository = function (j) {
            var k = j.name;
            var o = j.user;
            var m = this;
            var l = "/repos/" + o + "/" + k;
            var i = {
                branch: null,
                sha: null
            };

            function n(p, q) {
                if (p === i.branch && i.sha) {
                    return q(null, i.sha);
                }
                m.getRef("heads/" + p, function (r, s) {
                    i.branch = p;
                    i.sha = s;
                    q(r, s);
                });
            }
            this.getRef = function (q, p) {
                f("GET", l + "/git/refs/" + q, null, function (r, s) {
                    if (r) {
                        return p(r);
                    }
                    p(null, s.object.sha);
                });
            };
            this.createRef = function (q, p) {
                f("POST", l + "/git/refs", q, p);
            };
            this.deleteRef = function (q, p) {
                f("DELETE", l + "/git/refs/" + q, j, p);
            };
            this.createRepo = function (q, p) {
                f("POST", "/user/repos", q, p);
            };
            this.deleteRepo = function (p) {
                f("DELETE", l, j, p);
            };
            this.listTags = function (p) {
                f("GET", l + "/tags", null, function (q, r) {
                    if (q) {
                        return p(q);
                    }
                    p(null, r);
                });
            };
            this.listPulls = function (q, p) {
                f("GET", l + "/pulls" + (q ? "?state=" + q : ""), null, function (r, s) {
                    if (r) {
                        return p(r);
                    }
                    p(null, s);
                });
            };
            this.getPull = function (q, p) {
                f("GET", l + "/pulls/" + q, null, function (r, s) {
                    if (r) {
                        return p(r);
                    }
                    p(null, s);
                });
            };
            this.compare = function (p, r, q) {
                f("GET", l + "/compare/" + p + "..." + r, null, function (t, s) {
                    if (t) {
                        return q(t);
                    }
                    q(null, s);
                });
            };
            this.listBranches = function (p) {
                f("GET", l + "/git/refs/heads", null, function (q, r) {
                    if (q) {
                        return p(q);
                    }
                    p(null, a.map(r, function (s) {
                        return a.last(s.ref.split("/"));
                    }));
                });
            };
            this.getBlob = function (q, p) {
                f("GET", l + "/git/blobs/" + q, null, p, "raw");
            };
            this.getSha = function (p, r, q) {
                if (r === "") {
                    return m.getRef("heads/" + p, q);
                }
                m.getTree(p + "?recursive=true", function (s, u) {
                    if (s) {
                        return q(s);
                    }
                    var t = a.select(u, function (v) {
                        return v.path === r;
                    })[0];
                    q(null, t ? t.sha : null);
                });
            };
            this.getTree = function (q, p) {
                f("GET", l + "/git/trees/" + q, null, function (r, s) {
                    if (r) {
                        return p(r);
                    }
                    p(null, s.tree);
                });
            };
            this.postBlob = function (q, p) {
                if (typeof (q) === "string") {
                    q = {
                        content: q,
                        encoding: "utf-8"
                    };
                }
                f("POST", l + "/git/blobs", q, function (r, s) {
                    if (r) {
                        return p(r);
                    }
                    p(null, s.sha);
                });
            };
            this.updateTree = function (p, t, q, r) {
                var s = {
                    base_tree: p,
                    tree: [{
                        path: t,
                        mode: "100644",
                        type: "blob",
                        sha: q
                    }]
                };
                f("POST", l + "/git/trees", s, function (u, v) {
                    if (u) {
                        return r(u);
                    }
                    r(null, v.sha);
                });
            };
            this.postTree = function (q, p) {
                f("POST", l + "/git/trees", {
                    tree: q
                }, function (r, s) {
                    if (r) {
                        return p(r);
                    }
                    p(null, s.sha);
                });
            };
            this.commit = function (s, t, r, p) {
                var q = {
                    message: r,
                    author: {
                        name: j.username
                    },
                    parents: [s],
                    tree: t
                };
                f("POST", l + "/git/commits", q, function (u, v) {
                    i.sha = v.sha;
                    if (u) {
                        return p(u);
                    }
                    p(null, v.sha);
                });
            };
            this.updateHead = function (r, q, p) {
                f("PATCH", l + "/git/refs/heads/" + r, {
                    sha: q
                }, function (s, t) {
                    p(s);
                });
            };
            this.show = function (p) {
                f("GET", l, null, p);
            };
            this.contents = function (p, r, q, s) {
                return f("GET", l + "/contents?ref=" + p + (r ? "&path=" + r : ""), null, q, "raw", s);
            };
            this.fork = function (p) {
                f("POST", l + "/forks", null, p);
            };
            this.branch = function (r, q, p) {
                if (arguments.length === 2 && typeof arguments[1] === "function") {
                    p = q;
                    q = r;
                    r = "master";
                }
                this.getRef("heads/" + r, function (s, t) {
                    if (s && p) {
                        return p(s);
                    }
                    m.createRef({
                        ref: "refs/heads/" + q,
                        sha: t
                    }, p);
                });
            };
            this.createPullRequest = function (q, p) {
                f("POST", l + "/pulls", q, p);
            };
            this.listHooks = function (p) {
                f("GET", l + "/hooks", null, p);
            };
            this.getHook = function (q, p) {
                f("GET", l + "/hooks/" + q, null, p);
            };
            this.createHook = function (q, p) {
                f("POST", l + "/hooks", q, p);
            };
            this.editHook = function (q, r, p) {
                f("PATCH", l + "/hooks/" + q, r, p);
            };
            this.deleteHook = function (q, p) {
                f("DELETE", l + "/hooks/" + q, null, p);
            };
            this.read = function (p, r, q) {
                m.getSha(p, r, function (s, t) {
                    if (!t) {
                        return q("not found", null);
                    }
                    m.getBlob(t, function (v, u) {
                        q(v, u, t);
                    });
                });
            };
            this.remove = function (p, r, q) {
                n(p, function (s, t) {
                    m.getTree(t + "?recursive=true", function (u, w) {
                        var v = a.reject(w, function (x) {
                            return x.path === r;
                        });
                        a.each(v, function (x) {
                            if (x.type === "tree") {
                                delete x.sha;
                            }
                        });
                        m.postTree(v, function (x, y) {
                            m.commit(t, y, "Deleted " + r, function (A, z) {
                                m.updateHead(p, z, function (B) {
                                    q(B);
                                });
                            });
                        });
                    });
                });
            };
            this.move = function (p, s, r, q) {
                n(p, function (t, u) {
                    m.getTree(u + "?recursive=true", function (v, w) {
                        a.each(w, function (x) {
                            if (x.path === s) {
                                x.path = r;
                            }
                            if (x.type === "tree") {
                                delete x.sha;
                            }
                        });
                        m.postTree(w, function (x, y) {
                            m.commit(u, y, "Deleted " + s, function (A, z) {
                                m.updateHead(p, z, function (B) {
                                    q(B);
                                });
                            });
                        });
                    });
                });
            };
            this.write = function (p, t, r, s, q) {
                n(p, function (u, v) {
                    if (u) {
                        return q(u);
                    }
                    m.postBlob(r, function (x, w) {
                        if (x) {
                            return q(x);
                        }
                        m.updateTree(v, t, w, function (y, z) {
                            if (y) {
                                return q(y);
                            }
                            m.commit(v, z, s, function (B, A) {
                                if (B) {
                                    return q(B);
                                }
                                m.updateHead(p, A, q);
                            });
                        });
                    });
                });
            };
            this.getCommits = function (q, p) {
                q = q || {};
                var u = l + "/commits";
                var r = [];
                if (q.sha) {
                    r.push("sha=" + encodeURIComponent(q.sha));
                }
                if (q.path) {
                    r.push("path=" + encodeURIComponent(q.path));
                }
                if (q.since) {
                    var s = q.since;
                    if (s.constructor === Date) {
                        s = s.toISOString();
                    }
                    r.push("since=" + encodeURIComponent(s));
                }
                if (q.until) {
                    var t = q.until;
                    if (t.constructor === Date) {
                        t = t.toISOString();
                    }
                    r.push("until=" + encodeURIComponent(t));
                }
                if (r.length > 0) {
                    u += "?" + r.join("&");
                }
                f("GET", u, null, p);
            };
        };
        d.Gist = function (k) {
            var j = k.id;
            var i = "/gists/" + j;
            this.read = function (l) {
                f("GET", i, null, function (m, n) {
                    l(m, n);
                });
            };
            this.create = function (m, l) {
                f("POST", "/gists", m, l);
            };
            this.del = function (l) {
                f("DELETE", i, null, function (m, n) {
                    l(m, n);
                });
            };
            this.fork = function (l) {
                f("POST", i + "/fork", null, function (m, n) {
                    l(m, n);
                });
            };
            this.update = function (m, l) {
                f("PATCH", i, m, function (n, o) {
                    l(n, o);
                });
            };
            this.star = function (l) {
                f("PUT", i + "/star", null, function (m, n) {
                    l(m, n);
                });
            };
            this.unstar = function (l) {
                f("DELETE", i + "/star", null, function (m, n) {
                    l(m, n);
                });
            };
            this.isStarred = function (l) {
                f("GET", i + "/star", null, function (m, n) {
                    l(m, n);
                });
            };
        };
        d.Issue = function (i) {
            var j = "/repos/" + i.user + "/" + i.repo + "/issues";
            this.list = function (l, k) {
                f("GET", j, l, function (m, n) {
                    k(m, n);
                });
            };
        };
        this.getIssues = function (j, i) {
            return new d.Issue({
                user: j,
                repo: i
            });
        };
        this.getRepo = function (j, i) {
            return new d.Repository({
                user: j,
                name: i
            });
        };
        this.getUser = function () {
            return new d.User();
        };
        this.getGist = function (i) {
            return new d.Gist({
                id: i
            });
        };
    };
    if (typeof exports !== "undefined") {
        module.exports = d;
    } else {
        window.Github = d;
    }
}).call(this);
UltimateLib.Achievements = (function (b) {
    UltimateLib.Logger.log("UltimateLib.Achievements loading...");
    b.init = function () {
        a();
        b.add(c);
    };

    function a() {
        var d = Achievements.getAllItems;
        Achievements.getAllItems = function () {
            var e = d();
            e.addRange(b.collection);
            return e;
        };
    }
    b.getTotalCount = function () {
        return Achievements.getAllItems.length;
    };
    b.getCustomCount = function () {
        return b.collection.length;
    };
    b.getAllItems = function () {
        return Achievements.getAllItems;
    };
    b.getCustomItems = function () {
        return b.collection;
    };
    b.exists = function (e) {
        var d = false;
        $.grep(e, function (f, g) {
            if (f.id === e) {
                d = true;
            }
        });
        return d;
    };
    b.get = function (e) {
        var d = $.grep(b.getAllItems(), function (f, g) {
            return f.id === e;
        });
        if (d.length < 1) {
            d = ["undefind"];
        }
        return d[0];
    };
    var c = {
        id: "UltimateLib",
        title: "UltimateLib",
        description: "Played a game with UltimateLib installed.",
        isAchieved: function (d) {
            return true;
        },
        tint: "white",
        value: 10,
        hidden: true,
        canEarnMultiple: false
    };
    b.create = function (d) {
        if (typeof Object.create !== "function") {
            Object.create = function (g) {
                function f() { }
                f.prototype = g;
                return new f();
            };
        }
        var e = Object.create(UltimateLib.Achievements.create.prototype);
        e.id = d.id;
        e.title = d.title;
        e.description = d.description;
        e.isAchieved = d.isAchieved;
        e.tint = d.tint ? d.tint : "green";
        e.value = d.value ? d.value : 10;
        e.hidden = d.hidden ? d.hidden : false;
        e.canEarnMultiple = d.canEarnMultiple ? d.canEarnMultiple : false;
        e.toString = function () {
            return "UltimateLib.Achievements " + e.title + ": " + e.description;
        };
        return e;
    };
    b.collection = [];
    b.add = function (d) {
        if (d instanceof UltimateLib.Achievements.create) {
            d.id = "UltimateLibAchievement-" + d.id;
            var e = 1;
            while (b.exists(d.id)) {
                d.id += "-" + e;
                e++;
            }
            b.collection.push(d);
        }
    };
    UltimateLib.Logger.log("UltimateLib.Achievements loaded :-)");
    return b;
})(UltimateLib.Achievements || {});
UltimateLib.Configuration = (function (a) {
    UltimateLib.Logger.log("UltimateLib.Configuration loading...");
    a.addTab = function (c, g, b) {
        var d = $(document.createElement("div"));
        d.attr({
            id: c
        });
        d.css({
            width: "100%",
            height: "auto",
            display: "block"
        });
        var e = $(document.createElement("div"));
        e.attr("id", c + "Container");
        d.append(e);
        e.append(b);
        var f = $("#UltimateLibConfigurationTabs");
        f.tabs("add", "#" + c, g);
        f.tabs("refresh");
        f.tabs("select", 0);
        $("#" + c).append(b);
        return d;
    };
    a.init = function () {
        var b = UltimateLib.Elements.SettingsPanel.children();
        var d = $(document.createElement("div"));
        d.attr("id", "UltimateLibConfigurationTabs");
        d.css({
            width: "100%",
            height: "auto"
        });
        var e = $(document.createElement("ul"));
        e.attr("id", "UltimateLibConfigurationTabsList");
        e.append('<li><a href="#UltimateLibConfigurationDefaultTabPanel">Game</a></li>');
        var c = $(document.createElement("div"));
        c.attr("id", "UltimateLibConfigurationDefaultTabPanel");
        e.appendTo(d);
        c.appendTo(d);
        b.appendTo(d.find("#UltimateLibConfigurationDefaultTabPanel").first());
        d.appendTo(UltimateLib.Elements.SettingsPanel);
        d.tabs();
        d.find(".ui-tabs .ui-tabs-nav li a").css({
            fontSize: "7pt"
        });
        UltimateLib.Visuals.Custom.setCss("advanceOptionsCss", "#newGameView .featureSelectionPanel { overflow-x: none; overflow-y: auto; }</style>");
        UltimateLib.Visuals.Custom.setCss("settingPanelCss", ".ui-dialog .ui-dialog-content { padding: .5em 1em 1em .5em; overflow-x: none; overflow-y: visible; }");
        UltimateLib.Logger.log("UltimateLib.Configuration init ran.");
    };
    a.addAdvancedOption = function (b) {
        var c = $("#newGameView").find(".featureSelectionPanel.featureSelectionPanelHiddenState");
        c.append(b);
    };
    UltimateLib.Logger.log("UltimateLib.Configuration loaded :-)");
    return a;
})(UltimateLib.Configuration || {});
UltimateLib.Contracts = (function (g) {
    UltimateLib.Logger.log("UltimateLib.Contracts loading...");
    g.init = function () {
        e();
        d();
        UltimateLib.Logger.log("UltimateLib.Contracts init ran.");
    };
    g.Small = [];
    g.Medium = [];
    g.Large = [];
    g.add = function (i) {
        if (!a(i)) {
            UltimateLib.Logger.log("Contract Failed Compatiblity Check: " + i.name);
            return;
        }
        var j = b(i);
        switch (j.size) {
            case "small":
                g.Small.push(j);
                break;
            case "medium":
                g.Medium.push(j);
                break;
            case "large":
                g.Large.push(j);
                break;
            default:
                break;
        }
        console.log("Contract Added: " + j.name);
        UltimateLib.Logger.log("Contract Added: " + j.name);
    };

    function a(i) {
        return (Checks.checkPropertiesPresent(i, ["title", "description", "requiredD", "requiredT", "payment", "penalty", "weeksToFinish", "rF", "size"]));
    }

    function h(j) {
        try {
            GDT.getDataStore("UL-Contracts").data[j].complete = true;
        } catch (i) {
            GDT.getDataStore("UL-Contracts").data[j] = {
                complete: true
            };
        }
    }

    function c(j) {
        var k;
        try {
            k = GDT.getDataStore("UL-Contracts").data[j].complete;
        } catch (i) {
            k = false;
        }
        return k;
    }

    function b(j) {
        if (j.repeatable === false) {
            var k = j.complete;
            var l = j.canTrigger;
            j.complete = function (n) {
                h(this.ulid);
                k(n);
            };
            j.canTrigger = function (n) {
                return c(this.ulid) !== true && l(n);
            };
        }
        if (j.repeatable === true) {
            var m = j.complete;
            j.complete = function (n) {
                h(this.ulid);
                m(n);
            };
        }
        var i = j;
        return {
            id: "genericContracts",
            ulid: "UL-Contracts-" + i.ulid,
            name: i.title,
            description: i.description,
            isRandom: i.isRandom,
            canTrigger: i.canTrigger,
            complete: i.complete,
            requiredD: i.requiredD,
            requiredT: i.requiredT,
            spawnedD: 0,
            spawnedT: 0,
            payment: i.payment,
            penalty: i.penalty,
            weeksToFinish: i.weeksToFinish,
            rF: i.rF,
            isGeneric: true,
            size: i.size
        };
    }

    function e() {
        var i = ProjectContracts.getAvailable;
        ProjectContracts.getAvailable = function (j, l) {
            var k = i(j, l);
            if (l === "generic") {
                k.addRange(UltimateLib.Contracts.collection(j));
                UltimateLib.Logger.log("Contract Collection Added");
            }
            return k;
        };
    }

    function d() {
        var i = ProjectContracts.genericContracts.complete;
        ProjectContracts.genericContracts.complete = function (j, m, k) {
            try {
                k.complete(j);
            } catch (l) { }
            i(j, m, k);
        };
    }

    function f(j, i) {
        if (j === true) {
            if ((1 === Math.floor((Math.random() * i) + 1)) === false) {
                j = false;
            }
        }
        if (j === false) {
            j = true;
        }
        return j;
    }
    g.collection = function (j) {
        var i = [];
        i.addRange(g.Small);
        UltimateLib.Logger.log("Small Contracts Added");
        if (j.flags.mediumContractsEnabled) {
            i.addRange(g.Medium);
            UltimateLib.Logger.log("Medium Contracts Added");
        }
        if (j.flags.largeContractsEnabled) {
            i.addRange(g.Large);
            UltimateLib.Logger.log("Large Contracts Added");
        }
        i = $.grep(i, function (k, l) {
            return k.canTrigger(j) && f(k.isRandom, k.randomChance);
        });
        return i;
    };
    UltimateLib.Logger.log("UltimateLib.Contracts loaded :-)");
    return g;
})(UltimateLib.Contracts || {});
UltimateLib.Dialog = (function (a) {
    UltimateLib.Logger.log("UltimateLib.Dialog loading...");
    a.createButton = function (d, f, g, c, e) {
        var b = $(document.createElement("div"));
        b.addClass("selectorButton whiteButton");
        b.css({
            display: "inline-block",
            position: "relative",
            marginLeft: "50px",
            width: g,
            height: c
        });
        b.attr({
            id: d
        });
        if (typeof (e) == "function") {
            $(b).on("click", e);
        } else {
            b.attr({
                id: d,
                onclick: e
            });
        }
        b.text(f);
        return b;
    };
    a.createSection = function (g, j, b) {
        var d = g + "Section";
        var e = g + "SectionTitle";
        var h = $(document.createElement("div"));
        h.attr({
            id: d
        });
        var f = $(document.createElement("div"));
        f.css({
            textAlign: "center",
            marginLeft: "50px",
            width: "450px"
        });
        f.attr({
            id: e
        });
        f.text(j);
        f.appendTo(h);
        for (var c = 0; c < b.length; c++) {
            b[c].appendTo(h);
        }
        return h;
    };
    a.createDialog = function (g, j, i) {
        var d = g + "Modal";
        var c = g + "Container";
        var e = g + "Top";
        var f = $(document.createElement("div"));
        f.attr({
            id: d
        });
        f.addClass("ow-overlay ow-closed");
        var b = $(document.createElement("div"));
        b.attr({
            id: c
        });
        b.addClass("windowBorder tallWindow");
        b.css({
            overflow: "auto",
            display: "none"
        });
        var h = $(document.createElement("div"));
        h.attr({
            id: e
        });
        h.addClass("windowTitle smallerWindowTitle");
        h.text(j);
        h.appendTo(b);
        $.each(i, function (k, l) {
            a.addSection(b, l);
        });
        return b;
    };
    a.clearSections = function (b) {
        $(".ultimatelib-dialog-section", b).remove();
    };
    a.addSection = function (b, c) {
        b.append(c);
    };
    UltimateLib.Logger.log("UltimateLib.Dialog loaded :-)");
    return a;
})(UltimateLib.Dialog || {});
UltimateLib.Elements = (function (a) {
    UltimateLib.Logger.log("UltimateLib.Elements loading...");
    a.init = function () {
        UltimateLib.Logger.log("UltimateLib.Elements init ran.");
    };
    a.Head = $("head");
    a.Body = $("body");
    a.SettingsPanel = $("#settingsPanel");
    a.GameContainerWrapper = $("#gameContainerWrapper");
    a.SimpleModalContainer = $("#simplemodal-container");
    UltimateLib.Logger.log("UltimateLib.Elements loaded :-)");
    return a;
})(UltimateLib.Elements || {});
UltimateLib.GameData = (function (c) {
    UltimateLib.Logger.log("UltimateLib.GameData loading...");
    c.init = function () { };
    var a = GameManager;
    var b = GameManager.company;
    c.timeTilNextEvent = function () {
        return GameManager.company.flags.nextRandomEvent - GameManage.gameTime;
    };
    c.News = (function (f) {
        var d = GameManager;
        var e = GameManager.company;
        f.oldStories = function () {
            var g = e.scheduledStoriesShown;
            var h = [];
            g.forEach(h.push(f.findStory));
            return h;
        };
        f.findStory = function (j) {
            var i = UltimateLib.Utils.getIds(j, Media.allScheduledStories);
            var g = Media.allScheduledStories[i[0]];
            var h = {
                id: g.id,
                header: g.notification.header,
                text: g.notification.text,
                date: g.date,
                image: g.notification.image ? g.notification.image : null
            };
            return h;
        };
        return f;
    })(c.News || {});
    c.Staff = (function (k) {
        var d = GameManager;
        var e = GameManager.company;
        k.findStaff = function (m) {
            var l = e.staff;
            return l[jQuery.inArray(m, staff)];
        };
        k.getStaff = function (q) {
            var p = q;
            var o = p.mod ? p.mod : "all";
            var m = p.filter ? p.filter : "all";
            var n = p.filterVal ? p.filterVal : null;
            var l = p.compare ? p.compare : "=";
            var t = p.sortKey ? p.sortKey : "none";
            var s = p.sortAsc ? p.sortAsc : null;
            var r;
            var u = e.staff;
            if (o == "all" || o == "filter" || o == "sum" || o == "id") {
                r = i(u, m, n, l);
                r = j(r, t, s);
                if (o == "filter") {
                    r = f(r, m);
                }
                if (o == "sum") {
                    r = g(r, m, n);
                }
                if (o == "id") {
                    r = UltimateLib.Utils.getIds(r, m);
                }
            }
            return r;
        };

        function g(m, n, q) {
            if (n == "all") {
                return undefined;
            }
            var o = [];
            $.grep(m, function (r, s) {
                switch (n) {
                    case "all":
                        o.push(r);
                        break;
                    case "id":
                        o.push(r.id);
                        break;
                    case "name":
                        o[0] += r.name + ", ";
                        break;
                    case "sex":
                        if (r.sex == "male") {
                            o.push("male");
                        }
                        if (r.sex == "female") {
                            o.push("female");
                        }
                        break;
                    case "salary":
                        o[0] += r.salary;
                        break;
                    case "experience":
                        o[0] += r.experience;
                        break;
                    case "speed":
                        o[0] += r.speadFactor;
                        break;
                    case "technology":
                        o[0] += r.techFactor;
                        break;
                    case "research":
                        o[0] += r.researchFactor;
                        break;
                    case "design":
                        o[0] += r.designFactor;
                        break;
                    case "quality":
                        o[0] += r.qualityFactor;
                        break;
                    case "efficiency":
                        o[0] += r.efficiency;
                        break;
                    default:
                        o = undefined;
                        break;
                }
                return false;
            });
            if (n == name) {
                o[0].substring(0, str.length - 2);
                var l = " and ";
                o[0].replace(/,\s([^,]+)$/, l + "$1");
            }
            if (n == "sex") {
                var p = o;
                o = [0, 0];
                $.grep(m, function (r, s) {
                    if (r == "male") {
                        o[0] += 1;
                    }
                    if (r == "female") {
                        o[1] += 1;
                    }
                });
            }
            return o;
        }

        function f(l, m) {
            var n = [];
            $.grep(l, function (o, p) {
                switch (m) {
                    case "all":
                        n.push(o);
                        break;
                    case "id":
                        n.push(o.id);
                        break;
                    case "name":
                        n.push(o.name);
                        break;
                    case "sex":
                        n.push(o.sex);
                        break;
                    case "salary":
                        n.push(o.salary);
                        break;
                    case "experience":
                        n.push(o.experience);
                        break;
                    case "speed":
                        n.push(o.speadFactor);
                        break;
                    case "technology":
                        n.push(o.techFactor);
                        break;
                    case "research":
                        n.push(o.researchFactor);
                        break;
                    case "design":
                        n.push(o.designFactor);
                        break;
                    case "quality":
                        n.push(o.qualityFactor);
                        break;
                    case "efficiency":
                        n.push(o.efficiency);
                        break;
                    default:
                        n = undefined;
                        break;
                }
                return false;
            });
            return n;
        }

        function i(l, n, p, m) {
            var o = $.grep(l, function (q, r) {
                switch (n) {
                    case "all":
                        result = true;
                        break;
                    case "id":
                        result = h(q.id, p, m);
                        break;
                    case "name":
                        result = h(q.name, p, m);
                        break;
                    case "sex":
                        result = h(q.sex, p, m);
                        break;
                    case "salary":
                        result = h(q.salary, p, m);
                        break;
                    case "experience":
                        result = h(q.experience, p, m);
                        break;
                    case "speed":
                        result = h(q.speadFactor, p, m);
                        break;
                    case "technology":
                        result = h(q.techFactor, p, m);
                        break;
                    case "research":
                        result = h(q.researchFactor, p, m);
                        break;
                    case "design":
                        result = h(q.designFactor, p, m);
                        break;
                    case "quality":
                        result = h(q.qualityFactor, p, m);
                        break;
                    case "efficiency":
                        result = h(q.efficiency, p, m);
                        break;
                    default:
                        result = undefined;
                        break;
                }
                return result;
            });
            return o;
        }

        function h(m, n, l) {
            return UltimateLib.Utils.compare(m, n, l);
        }

        function j(l, n, m) {
            var o;
            switch (n) {
                case "none":
                    o = l;
                    break;
                case "id":
                    o = l.sort(function (p, q) {
                        return p.id > q.id ? 1 : -1;
                    });
                    break;
                case "name":
                    o = l.sort(function (p, q) {
                        return p.name.toLowerCase() > q.name.toLowerCase() ? 1 : -1;
                    });
                    break;
                case "sex":
                    o = l.sort(function (p, q) {
                        return p.sex == q.sex ? 1 : -1;
                    });
                    break;
                case "salary":
                    o = l.sort(function (p, q) {
                        return p.salary > q.salary ? 1 : -1;
                    });
                    break;
                case "experience":
                    o = l.sort(function (p, q) {
                        return p.experience > q.experience ? 1 : -1;
                    });
                    break;
                case "speed":
                    o = l.sort(function (p, q) {
                        return p.speedFactor > q.speedFactor ? 1 : -1;
                    });
                    break;
                case "technology":
                    o = l.sort(function (p, q) {
                        return p.techFactor > q.techFactor ? 1 : -1;
                    });
                    break;
                case "research":
                    o = l.sort(function (p, q) {
                        return p.researchFactor > q.researchFactor ? 1 : -1;
                    });
                    break;
                case "design":
                    o = l.sort(function (p, q) {
                        return p.designFactor > q.designFactor ? 1 : -1;
                    });
                    break;
                case "quality":
                    o = l.sort(function (p, q) {
                        return p.qualityFactor > q.qualityFactor ? 1 : -1;
                    });
                    break;
                case "efficiency":
                    o = l.sort(function (p, q) {
                        return p.efficiency > q.efficiency ? 1 : -1;
                    });
                    break;
                default:
                    break;
            }
            if (n != "none" && m === true) {
                o.reverse();
            }
            return o;
        }
        return k;
    })(c.Staff || {});
    UltimateLib.Logger.log("UltimateLib.GameData loaded :-)");
    return c;
})(UltimateLib.GameData || {});
UltimateLib.Graphs = (function (a) {
    UltimateLib.Logger.log("UltimateLib.Graphs loading...");
    a.init = function () {
        UltimateLib.Logger.log("UltimateLib.Graphs init ran.");
    };
    UltimateLib.Logger.log("UltimateLib.Graphs loaded :-)");
    return a;
})(UltimateLib.Graphs || {});
UltimateLib.NameGenerator = (function (c) {
    UltimateLib.Logger.log("UltimateLib.NameGenerator loading...");
    var a = {
        adjectives: ["Digital", "Online", "Loud", "Quiet", "Black", "White", "Red", "Blue", "Yellow", "Green", "Pink", "Hard", "Soft", "Round", "Fast", "Slow", "Easy", "Tricky", "Tiny", "Big", "Giant", "Large", "Puny", "Heavy", "Light", "Dark", "Fast", "Speedy", "One", "Angry", "Happy", "Sad", "Mad", "Glad", "Rad", "Joy", "Love", "Naughty", "Flying", "Jumping", "Soaring", "Falling", "Dying", "Edible", "North", "South", "East", "West", "Late", "Early", "Never", "Always", "Midnight", "Upper", "Lower", "Inner", "Outer", "Rendered", "Rotten", "Fresh", "Altered", "Organic", "Sour", "Coastal", "Chill", "Healing", "Damaged", "Omatic", "PlayMaker", "GameMaker", "Makadam", "Cradle", "Sim", "Makers of", "Rooster", "Animal", "Squared", "Round", "Lined", "Cubed", "Triangled", "Sphered", "Great", "Awesome", "Best", "?ber"],
        nouns: ["Method", "Function", "Struct", "Class", "Library", "Bomb", "Missile", "Gun", "Weapon", "Tank", "Rocket", "Terminal", "Connection", "Joint", "Machine", "Engine", "Starship", "Sandwich", "Plane", "Saucer", "Airship", "Jet", "Boat", "Ship", "Window", "Screen", "Man", "Computer", "Happiness", "Sadness", "Anger", "Spoon", "Knife", "Fork", "Island", "Village", "City", "Town", "Mountain", "River", "Ocean", "Sea", "Coast", "Space", "World", "Earth", "Planet", "Night", "Day", "Star", "Sun", "Voyage", "Journey", "Time", "Destruction", "Ideas", "Everything", "King", "Queen", "Daughter", "Son", "Prince", "Princess", "Hangar", "Rainbow", "Signal", "Book", "Lawn", "Dog", "Cat", "Lion", "Horse", "Elephant", "Sloth", "Panda", "Turkey", "Possum", "Skunk", "Walrus", "Bear", "Wizard", "Warrior", "Knight", "Dragon", "Goblin", "Mage", "Soul", "Music", "Country", "Enemy", "History", "Doctor", "Scientist", "Engineer", "Janitor", "Landlord", "Butcher", "Astronaut", "Spaceman", "Hallway", "Ghost", "Spirit", "Visions", "Hour", "Day", "Month", "Year", "Second", "Minute", "Age", "Men", "Women", "Boys", "Girls", "Uncle", "Aunt", "Mother", "Father", "Yard", "Room", "Banana", "Apple", "Melon", "Cake", "Pie", "Tomato", "Celery", "Sawblade", "Drill", "Hammer", "Nail", "Knife", "Knives", "Graveyard", "Highway", "Midnight", "Death", "Tragedy", "Tomb", "Progress", "Tree", "Gem", "Diamond", "Ruby", "Pearl", "Sparkle", "Crown", "Unitrends", "Highwall", "Tran", "ColdLight", "Tableau", "Mobile", "Tablet", "Processor", "Cooler", "Geek", "Nerd", "Pro", "Redheart", "Blueheart", "Yellowheart", "Azureheart", "Pinkheart", "Momentum", "Dicendum", "Morendum", "Addendum", "Lorendum", "Mind", "Brain", "Idea", "Synapse", "Neuron", "Neuronal", "Monkey", "Gorilla", "Ape", "Orangutan", "iPipeline", "iProcess", "iDevelop", "iBest", "iWok", "Nitro", "Booster", "Turbo"],
        suffixes: ["Collective", "United", "Studio", "Interactive", "Games", "Group", "Team", "Community", "Alliance", "Company", "Direction", "Software", "Media", "Labs", "Ltd.", "Global", "Solutions", "Apps", "Technologies", "Park", "Systems", "Logic", "Services", "Associates", "Consulting", "Entertainment"]
    };
    var b = {
        male: {
            firstNames: ["Alessandro", "Ali", "Aaron", "Abdul", "Abe", "Abraham", "Adam", "Alex", "Alexander", "Arnold", "Austin", "Bill", "Bas", "Barry", "Ben", "Benton", "Blair", "Boris", "Bobby", "Bradley", "Brain", "Bruno", "Buster", "Chad", "Charles", "Christian", "Chico", "Carl", "Cedric", "Carlton", "Carlos", "Chang", "Claudio", "Colin", "Curtis", "Daniel", "Damian", "Darrell", "Dan", "Davis", "David", "Dean", "Dennis", "Devin", "Devon", "Diego", "Don", "Dylan", "Eugene", "Earl", "Edison", "Edmondo", "Edgar", "Eddy", "Ed", "Elijah", "Elliot", "Edwin", "Elvin", "Elvis", "Emanuel", "Emilio", "Evan", "Francesco", "Frank", "Francis", "Felipe", "Felix", "Floyd", "Fletcher", "Franklin", "Fred", "Frederick", "Freeman", "Fritz", "Garry", "Gastone", "Gary", "Gavin", "Gino", "Giovanni", "Graham", "Grant", "Greg", "Gregg", "Gregory", "Gus", "Guy", "Hank", "Hal", "Harold", "Harris", "Harrison", "Herbert", "Homer", "Horace", "Horacio", "Hugo", "Hunter", "Hugh", "Ivan", "Igor", "Ian", "Ismael", "Isaac", "Isaiah", "Irwin", "Irving", "John", "Justin", "Johann", "Juan", "Jake", "Jasper", "Jay", "Jeff", "Jefferson", "Jeffrey", "Jerome", "Joan", "Jonathan", "Jose", "Junior", "Karim", "Knut", "Kasey", "Kenneth", "Ken", "Kenny", "Kermit", "Kim", "King", "Kris", "Kristofer", "Loco", "Lee", "Long", "Lino", "Levi", "Lou", "Loyd", "Lucas", "Lorenzo", "Lynn", "Luther", "Mohammed", "Matthijs", "Mike", "Marc", "Mark", "Manfred", "Marek", "Marcellus", "Mario", "Marlon", "Marlin", "Merlin", "Marshall", "Michael", "Miguel", "Murray", "Nigel", "Nicolas", "Noah", "Nolan", "Nick", "Nicklas", "Noel", "Norris", "Oscar", "Oskar", "Osvald", "Omar", "Oliver", "Ollie", "Otto", "Owen", "Orlando", "Peter", "Patrick", "Pablo", "Paul", "Pedro", "Philip", "Phillip", "Preston", "Porter", "Paolo", "Pinto", "Quincy", "Quinn", "Quinton", "Roland", "Ronald", "Robert", "Rafael", "Roger", "Robin", "Ralf", "Ralph", "Rufus", "Renaldo", "Ridge", "Reuben", "Rene", "Sam", "Scott", "Samuel", "Seth", "Seymour", "Shaun", "Shawn", "Sergio", "Sean", "Saul", "Scot", "Scott", "Sid", "Spencer", "Stefan", "Stephan", "Stuart", "Steve", "Tarkan", "Ted", "Tom", "Todd", "Tomas", "Thomas", "Tobias", "Toby", "Tommy", "Ty", "Tyron", "Tyrese", "Tyrell", "Truman", "Troy", "Van", "Vance", "Vernon", "Vicente", "Virgil", "Vito", "Will", "Wayne", "Wilbert", "Walther", "Walter", "Weston", "Wesley", "Winfried", "Woodrow", "Winston", "Xavier", "Yuri", "Yong", "Young", "Zack", "Zachery", "Zane"]
        },
        female: {
            firstNames: ["Abbey", "Abigail", "Adela", "Adaline", "Adina", "Ariel", "Adriana", "Aiko", "Alana", "Alberta", "Alda", "Alanis", "Alannis", "Alexa", "Alice", "Alisa", "Amber", "Anna", "Angel", "Annie", "Ashley", "Aurora", "Barbara", "Bambi", "Becky", "Bee", "Bea", "Belinda", "Beth", "Betsy", "Bertha", "Bianca", "Brandi", "Brandie", "Bobbi", "Bonita", "Bridget", "Britt", "Brittany", "Buffy", "Camelia", "Carla", "Caren", "Candi", "Candy", "Candice", "Caroline", "Carol", "Cary", "Carry", "Catherina", "Cathy", "Celia", "Chanel", "Chantal", "Chang", "Charlie", "Cheryl", "Christina", "Chris", "Crystal", "Curtis", "Dacia", "Debby", "Deborah", "Daniela", "Dany", "Denice", "Denise", "Destiny", "Dolly", "Doria", "Dori", "Doreen", "Easter", "Eda", "Eleonora", "Emy", "Elia", "Elena", "Elsa", "Ena", "Etha", "Eva", "Exie", "Fae", "Fay", "Fawn", "Felipa", "Felicia", "Felicitas", "Flavia", "Fiona", "Francie", "Florence", "Frida", "Gabrielle", "Galina", "Gary", "Gina", "Gerri", "Gia", "Gloria", "Glory", "Goldie", "Grace", "Gwyn", "Hannah", "Ha", "Hazel", "Heather", "Heidi", "Hilary", "Holly", "Hyo", "Hyun", "Hui", "Ida", "Ina", "Inge", "Inga", "Ingrid", "Ines", "Irene", "Iris", "Isabel", "Iva", "Ivy", "Ivory", "Jackelyn", "Jaqueline", "Jada", "Jane", "Joanna", "Joel", "Jeanette", "Jeanice", "Jenni", "Jennifer", "Jessie", "Jessy", "Jessica", "Jolanda", "Judie", "Judith", "Juliette", "Julia", "Ka", "Kacey", "Kandi", "Kandice", "Karen", "Karolyn", "Karol", "Karrie", "Kate", "Katja", "Keira", "Kesha", "Kia", "Kimberly", "Kirstin", "Kimber", "Kris", "Klara", "Krystal", "Kyle", "Kylee", "Kym", "Lacey", "Laine", "Laila", "Lane", "Lang", "Larue", "Latricia", "Latina", "Laura", "Laureen", "Lavina", "Lea", "Leah", "Lela", "Lenni", "Lia", "Lina", "Linda", "Lindsay", "Loan", "Lola", "Lorrie", "Love", "Lydia", "Ma", "Mable", "Macy", "Madeleine", "Maggie", "Maureen", "Marie", "Mary", "Maria", "Manuela", "Margaret", "Meg", "Meredith", "Melody", "Mia", "Michaela", "Millie", "Melissa", "Molly", "Nadine", "Nada", "Naomi", "Noemi", "Nancy", "Ngan", "Nia", "Nicole", "Nikki", "Nola", "Nu", "Ola", "Olga", "Olivia", "Ora", "Paige", "Pamela", "Patricia", "Peggie", "Penny", "Pia", "Prudence", "Queen", "Qiana", "Rae", "Ramona", "Randee", "Reagan", "Ragina", "Rebecca", "Rhonda", "Ricki", "Robin", "Rosalba", "Rose", "Rosa", "Roxie", "Roxanne", "Ruby", "Ruth", "Sabine", "Sabrina", "Sandy", "Sandra", "Sally", "Sandra", "Sarah", "Serena", "Shakira", "Shanta", "Sheryl", "Shirley", "Silvya", "Silvana", "Sofia", "Sophie", "Stephanie", "Summer", "Sue", "Suzy", "Tabeah", "Tabatha", "Thea", "Tami", "Tarah", "Theresa", "Tesha", "Tia", "Tiara", "Trisha", "Tracey", "Tyra", "Ula", "Ute", "Ulrike", "Valerie", "Valeria", "Vanessa", "Vanda", "Verona", "Veronique", "Vickie", "Victoria", "Violett", "Vivian", "Vivienne", "Wanda", "Wonda", "Willow", "Wynona", "Xamara", "Xenia", "Xiao", "Yadira", "Yang", "Yasmin", "Yi", "Yolanda", "Yukiko", "Yuriko", "Yuki", "Yuonne", "Zelda", "Zenia", "Zandra", "Zora"]
        },
        lastNames: ["Alas", "Abair", "Abate", "Abell", "Abeles", "Aben", "Abbattista", "Abitz", "Ablao", "Abney", "Abraham", "Abrahams", "Albrecht", "Abramovich", "Abrey", "Abrew", "Ace", "Achs", "Acon", "Adas", "Adelstein", "Adham", "Aggen", "Agueros", "Aguilar", "Ahlborn", "Ahl", "Anders", "Ahrendt", "Airy", "Ajmeri", "Akashi", "Akeo", "Allen", "Baab", "Baah", "Babe", "Baban", "Babich", "Baca", "Babinyks", "Babson", "Bacani", "Babor", "Bachinsky", "Bachelor", "Backfisch", "Backhus", "Bradley", "Baglione", "Bahns", "Burns", "Browe", "Bruston", "Brailey", "Baldwin", "Bricks", "Brausil", "Brookes", "Broken", "Brick", "Bricks", "Bristol", "Bentley", "Bush", "Books", "Bunils", "Chan", "Caan", "Cabato", "Cassis", "Cabal", "Cada", "Caden", "Cagg", "Cahen", "Cohen", "Cahill", "Caires", "Cail", "Campsey", "Charleston", "Colpas", "Can", "Cannington", "Caetil", "Canterbury", "Cap", "Coasts", "Coalson", "Coates", "Cocks", "Cockrell", "Codd", "Cole", "Coles", "Corson", "Cox", "Carmack", "Cross", "Dallas", "Dost", "Dabek", "Dabrowski", "Dafoe", "Dahlenburg", "Dahl", "Daniels", "Danilson", "Danial", "Datz", "Dauby", "Decurtis", "Ded", "Dedio", "Dellon", "Dilan", "Dillons", "Dmitriev", "Doak", "Dobin", "Dominsky", "Domon", "Dors", "Dorosz", "Dorsa", "Druhan", "Drugs", "Drose", "Durham", "Duirieux", "Durette", "Dyroff", "Eagler", "Eam", "Eames", "Eakens", "Eck", "Ekels", "Echt", "Echler", "Ehringer", "Ehrle", "Erhardt", "Einstein", "Ekholm", "Enquist", "Ek", "Ekstrom", "Elarton", "Enneking", "Enriquez", "Emiliano", "Ennis", "Engine", "Eschbach", "Esswein", "Esher", "Eyers", "Eyestone", "Freeman", "Faaborg", "Fabi", "Fattore", "Faue", "Fauber", "Feltch", "Felsman", "Felz", "Felson", "Felser", "Felux", "Feuer", "Fire", "Fiddes", "Fiddler", "Fiedler", "Fidell", "Fleck", "Fleagle", "Flavell", "Floro", "Florke", "Flower", "Flunder", "Fluth", "Fly", "Gaal", "Gaber", "Gabelle", "Garic", "Garlick", "Garland", "Garlock", "Garmon", "Gimple", "Gindi", "Gim", "Giltner", "Gilster", "Gleave", "Gleiser", "Glazer", "Glynn", "Gnade", "Graham", "Granmlich", "Grames", "Gramberg", "Garcia", "Gonzales", "Granada", "Grett", "Grey", "Greyhound", "Gravius", "Guinn", "Guth", "Guzek", "Howard", "Hack", "Haan", "Haahr", "Haagen", "Hamrock", "Hampshire", "Hashi", "Heacox", "Headington", "Hedge", "Hefton", "Hefler", "Heggan", "Hecnk", "Hendler", "Heinz", "Hepker", "Hepinstall", "Hentzel", "Hermosa", "Hernandez", "Hermus", "Hguyen", "Hickel", "Hilbert", "Holter", "Holthaus", "Holtrey", "House", "Houton", "Huffin", "Hug", "Huryn", "Hurston", "Iansen", "Ianni", "Iannini", "Iames", "Imel", "Imbler", "Infield", "Ineson", "Ingleheart", "Ingraham", "Ingles", "Isler", "Ita", "Itterly", "Izzo", "Jones", "Jacks", "Jabs", "Jamison", "Johnsson", "Jandrik", "Jance", "Jancek", "Jamros", "Jefferson", "Jemal", "Jelleron", "Jewison", "Jewitt", "Jew", "Jolly", "Jonassen", "Johanson", "Juco", "Jue", "Jung", "Jungmeier", "Junkert", "Junez", "Klug", "Keating", "Kerry", "Kennedy", "Kaahanui", "Kabak", "Kaat", "Kadric", "Kaehr", "Kallenberg", "Kalosky", "Kowalski", "Kallmeyer", "Kanagy", "Kendric", "Keagy", "Keeney", "Keem", "Keep", "Keefover", "Kessler", "Ketelaar", "Kilcup", "Kilgus", "Kile", "Klein", "Kleinow", "Klopp", "Kloman", "Klosek", "Knife", "Knisley", "Knill", "Kotarksi", "Kothe", "Kruss", "Lee", "Laboe", "Laborn", "Labit", "Larew", "Lardin", "Larch", "Large", "Lawell", "Leach", "Lockley", "Leafty", "Leaming", "Lemmings", "Leagan", "Lepping", "Ler", "Lhereux", "Liam", "Lofthouse", "Logdes", "Locked", "Lohans", "Logan", "Lua", "Luber", "Liberow", "Lux", "Morgan", "Markos", "McLoud", "Miller", "Mables", "Maat", "Maas", "Marbles", "Maestro", "Magary", "Magao", "Malcot", "Malinovski", "Managhan", "Manas", "Mauser", "McAbee", "McIvory", "McCroy", "McCullar", "McCuin", "Malchin", "McMananamon", "Melan", "Melder", "Mullins", "Moulder", "Money", "Mocarksi", "Moates", "Motts", "Murty", "Nabi", "Nacci", "Nabers", "Neighbours", "Neiner", "Neihardt", "Newling", "Newitt", "Newill", "Newmark", "Nicholson", "Nickelsen", "Nickey", "Nichols", "Nixon", "Nivala", "Northway", "Northern", "North", "Norse", "Norvelle", "Oaks", "Oakley", "Oertel", "Oettel", "Oetting", "Ogg", "Oggs", "Ogles", "Olejarz", "Oldson", "Oldridge", "Oldman", "Oldmixon", "Ondrey", "Onal", "Onaka", "Oms", "Orlandi", "Orlowski", "Orlic", "Otto", "Ouelette", "Ouchida", "Ozoa", "Peterson", "Popovic", "Paananen", "Pabst", "Paetzold", "Paganucci", "Pavarotti", "Paeth", "Payor", "Paulson", "Patterson", "Peace", "Peacemaker", "Pearch", "Pearl", "Pearlstone", "Peebles", "Peddy", "Peers", "Peerson", "Pearson", "Pernot", "Perl", "Petering", "Poach", "Poates", "Picard", "Piccolo", "Picek", "Pigg", "Pegg", "Piggot", "Polster", "Pritschett", "Qi", "Quade", "Quebec", "Quelle", "Quong", "Quiz", "Quitoriano", "Rosek", "Raab", "Rabenau", "Rabourn", "Rachor", "Rackham", "Radcliff", "Ramirez", "Ramler", "randie", "Randle", "Randale", "Razzo", "Readling", "Readman", "Reilly", "Reinberg", "Remington", "Remos", "Remster", "Reynaurd", "Rhee", "Rhames", "Ribble", "Richards", "Richardson", "Roan", "Roaks", "Rob", "Roaden", "Roachford", "Rollet", "Ruff", "Rugg", "Rugen", "Schlau", "Sadler", "Saed", "Salzberg", "Salvetti", "Salveson", "Sawdon", "Saxby", "Scanlin", "Scanner", "Scarbord", "Schmidt", "Schnaars", "Scolari", "Scramlin", "Seabert", "Seacrest", "Seadler", "Seidl", "Settle", "Seum", "Shakles", "Shacklock", "Shadle", "sharrock", "Shatley", "Shoe", "Showmaker", "Shy", "Siciliani", "Siddons", "Slates", "Stiffler", "Slark", "Small", "Smeets", "Solt", "Solus", "Sparks", "Spalla", "Spin", "Spinnler", "Spinoza", "Springs", "Springwater", "Stack", "Stade", "Stecz", "Steeger", "Stedge", "Stephenson", "Stepp", "Stickle", "Stieg", "Stow", "Stoye", "Strock", "Stunts", "Styler", "Sublette", "Suchon", "Suby", "Swait", "Swag", "Swalley", "Swick", "Swetz", "Szynal", "Tabas", "Tabarez", "Takvorian", "Taratuta", "Tarber", "Tarbill", "Tardiff", "Tarkenton", "Tardo", "Taugher", "Taubmann", "Tee", "Ted", "Teufel", "Tempel", "Thai", "Thang", "Thaggard", "Thomasson", "Thomson", "Thompson", "Thys", "Thyberg", "Tok", "Townsend", "Tozzo", "Toxey", "Trinity", "Trines", "Trucks", "Uchida", "Udd", "Umbro", "Umsted", "Umbenhower", "Unsicker", "Unnerstall", "Uth", "Utter", "Uzzle", "Van der Wiel", "Van Bonkrost", "Van der Keen", "Vaeth", "Vagt", "Vaughn", "Vadell", "Vanavery", "Van Bemmel", "Van Auken", "Vazquez", "Vayo", "Viada", "Vryhof", "Vikings", "Valdez", "Wilders", "Williams", "Wacker", "Walcott", "Wilshire", "Willis", "Walsworth", "Walters", "Warney", "Warrenberg", "Woodfort", "Woods", "Winters", "Wenners", "Werner", "Werbelow", "Wheatle", "Wheller", "Weelis", "Wheels", "Wheet", "Weeds", "Wheeler", "Westinghouse", "Westham", "Wheaton", "Whitmore", "Whittaker", "Whitting", "Wice", "Wichner", "Winkey", "Winks", "Winker", "Wooden", "Woodhull", "Woodhill", "Wyatt", "Wust", "Wyan", "Wurz", "Wydnick", "Xander", "Xu", "Xuan", "Xi", "Xia", "Xavier", "Xue", "Ximenez", "Xenos", "Xanthos", "Young", "Younes", "Yabes", "Yale", "Yada", "Yacob", "Yamasaki", "Yan", "Yell", "Yellows", "Yelton", "Yelland", "Yonas", "Yonko", "Yu", "Yule", "Yvon", "Zaback", "Zaborski", "Zaccharias", "Zackery", "Zadnik", "Zanetti", "Zenz", "Zerbe", "Zebra", "Zhai", "Zalas", "Zhi", "Zinninger", "Zinzi", "Zucchero", "Zukic"]
    };
    c.init = function () { };
    c.generateCompanyName = function () {
        function d(f) {
            return f[Math.floor(Math.random() * f.length)];
        }
        var e = "";
        if (Math.random() < 0.7) {
            e += "" + d(a.adjectives);
            e += " " + d(a.nouns);
        } else {
            e += "" + d(a.nouns);
            e += " " + d(a.nouns);
        }
        if (Math.random() < 0.3) {
            e += " " + d(a.suffixes);
        }
        return e;
    };
    c.generatePlayerName = function (f) {
        function e(h) {
            return h[Math.floor(Math.random() * h.length)];
        }
        var d = f ? b.male.firstNames : b.female.firstNames;
        var g = "" + e(d);
        g += " " + e(b.lastNames);
        if (Math.random() < 0.3) {
            g += "-" + e(b.lastNames);
        }
        return g;
    };
    UltimateLib.Logger.log("UltimateLib.NameGenerator loaded :-)");
    return c;
})(UltimateLib.NameGenerator || {});
UltimateLib.Notifications = (function (a) {
    UltimateLib.Logger.log("UltimateLib.Notifications loading...");
    a.typeWriterDelay = {
        mode: "factor",
        value: 1
    };
    a.Items = [{
        id: "GDT_PlatformReleaseNews",
        name: "{PlatformReleaseNews}",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_News",
        name: "News",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_GameOffTheMarket",
        name: "Game off the market.",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_GameConference",
        name: "Game Conference",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_LabReport",
        name: "Lab report",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_NewResearch",
        name: "New Research!",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_ResearchComplete",
        name: "Research complete",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_IndustryNews",
        name: "Industry News",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_IndustryReport",
        name: "Industry Report",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_GameReport",
        name: "Game Report",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_MarketAnalysis",
        name: "Market Analysis",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_EngineComplete",
        name: "Engine complete!",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_GameReview",
        name: "Game review",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_Sequel",
        name: "Sequel",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_FirstWeekOfSales",
        name: "First week of sales!",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_Fans",
        name: "Fans",
        enabled: true,
        asOverlay: false
    }, {
        id: "GDT_SalesRecord",
        name: "Sales Record",
        enabled: true,
        asOverlay: false
    }, {
        id: "InfoStatsMod_BestGame",
        name: "Company's Best Game",
        enabled: true,
        asOverlay: false
    }];
    a.enableAll = function (b) {
        for (var c = 0; c < a.Items.length; c++) {
            a.Items[c].enabled = b;
        }
    };
    a.overlayAll = function (b) {
        for (var c = 0; c < a.Items.length; c++) {
            a.Items[c].asOverlay = b;
        }
    };
    a.setOverlay = function (c) {
        var b = 0;
        var d = false;
        while (b < a.Items.length && d === false) {
            if (a.Items[b].id == c.id) {
                a.Items[b].asOverlay = c.asOverlay;
                d = true;
            }
            b++;
        }
    };
    a.setEnabled = function (d) {
        var c = 0;
        var b = false;
        while (c < a.Items.length && b === false) {
            if (a.Items[c].id == d.id) {
                a.Items[c].enabled = d.enabled;
                b = true;
            }
            c++;
        }
    };
    a.getItemById = function (d) {
        var c = 0;
        var b = false;
        while (c < a.Items.length && b === false) {
            if (a.Items[c].id == d) {
                b = a.Items[c];
            }
            c++;
        }
        return b;
    };
    a.getItemByName = function (d) {
        var c = 0;
        var b = false;
        while (c < a.Items.length && b === false) {
            if (a.Items[c].name.localize() == d) {
                b = a.Items[c];
            }
            c++;
        }
        return b;
    };
    a.showSimpleNotification = function (b, e, d) {
        if (GameManager.company) {
            if (d) {
                var c = a.getItemByName(b.localize());
                if (!c) {
                    a.Items.push({
                        id: "Custom_" + b,
                        name: "{" + b + "}",
                        enabled: true,
                        asOverlay: d
                    });
                } else {
                    c.asOverlay = d;
                }
            }
            GameManager.company.notifications.push(new Notification({
                header: b,
                text: e
            }));
        }
    };
    a.init = function () {
        var c = null;
        var b = false;
        (function () {
            var d = $.fn.typewrite;
            $.fn.typewrite = function (e) {
                if (a.typeWriterDelay.mode == "factor") {
                    e.delay *= a.typeWriterDelay.value;
                } else {
                    e.delay = a.typeWriterDelay.value;
                }
                return d.apply(this, arguments);
            };
        })();
        (function () {
            var d = UI.showModalContent;
            UI.showModalContent = function (e, f) {
                d.apply(this, arguments);
                a.lastModalDialog = e;
            };
        })();
        (function () {
            var d = UI._showNotification;
            UI._showNotification = function (e, f) {
                d.apply(this, arguments);
                try {
                    var r = e;
                    var q = r.header;
                    var p = $("#simplemodal-container").find("#notificationContent");
                    var t = $(".notificationOption1").first();
                    $("#TweakModNotificationReplacement1").remove();
                    var w = $(document.createElement("div"));
                    w.attr({
                        id: "TweakModNotificationReplacement1"
                    });
                    w.appendTo($("body"));
                    var j = 1;
                    if (window.devicePixelRatio !== undefined) {
                        j = window.devicePixelRatio;
                    }
                    var v = $(window).width() * j;
                    var u = $(window).height() * j;
                    var i = $(document);
                    var g = (v * 0.5) - (230);
                    var h = (u * 0.5) - (120);
                    w.css({
                        position: "absolute",
                        left: g,
                        top: h,
                        width: 460,
                        height: "auto",
                        padding: 5,
                        backgroundColor: "#f0f0f0",
                        opacity: "0.9",
                        border: "4px solid rgb(255,209,123)",
                        display: "none",
                        zIndex: 8000,
                        boxShadow: "0 0 5px #888"
                    });
                    var o = false;
                    var m = false;
                    switch (e.header) {
                        case "{ReleaseGame}":
                            break;
                        case "{Reviews}":
                            break;
                        default:
                            var s = a.getItemByName(e.header);
                            if (s) {
                                b = true;
                                o = s.asOverlay;
                                m = s.enabled;
                            }
                            break;
                    }
                    if (m) {
                        if (o) {
                            var l = "<h3>" + e.header + "</h3>";
                            l += e.text.replace("\n", "<br/><br/>");
                            w.html(l).delay(500).fadeIn().delay(4000).fadeOut();
                            UltimateLib.Elements.SimpleModalContainer.css({
                                position: "absolute",
                                left: "-100px"
                            });
                            GameManager.company.activeNotifications.remove(e);
                            UI.closeModal();
                        }
                    }
                } catch (k) { }
            };
        })();
        UltimateLib.Logger.log("UltimateLib.Notifications init ran.");
    };
    UltimateLib.Logger.log("UltimateLib.Notifications loaded :-)");
    return a;
})(UltimateLib.Notifications || {});
UltimateLib.PopupMenu = (function (c) {
    UltimateLib.Logger.log("UltimateLib.PopupMenu loading...");
    var b = UI._showContextMenu;
    var a = [];
    c.init = function () {
        UltimateLib.Logger.log("UltimateLib.PopupMenu init ran.");
    };
    UI.ulPopupMenuItemClickHandler = function (d) { };
    c.update = function () {
        b = UI._showContextMenu;
        var d = function (e, f, g, i) {
            $.each(a, function (h, j) {
                f.push({
                    label: j.label.localize(),
                    action: function () {
                        Sound.click();
                        GameManager.resume(true);
                        if (typeof j.el == "undefined") {
                            return;
                        }
                        var k = j.el;
                        k.scrollTop();
                        k.gdDialog({
                            popout: !0,
                            close: !0,
                            onClose: function () {
                                if (j.pause) {
                                    GameManager.togglePause();
                                }
                            },
                            onOpen: function () {
                                if (j.pause) {
                                    GameManager.togglePause();
                                }
                            }
                        });
                    }
                });
            });
            b(e, f, g, i);
        };
        UI._showContextMenu = d;
    };
    c.addItem = function (d) {
        a.push(d);
    };
    c.createItem = function (e, d, f) {
        return {
            label: e,
            el: d,
            pause: f
        };
    };
    UltimateLib.Logger.log("UltimateLib.PopupMenu loaded :-)");
    return c;
})(UltimateLib.PopupMenu || {});
UltimateLib.Publishers = (function (h) {
    UltimateLib.Logger.log("UltimateLib.Publishers loading...");
    h.init = function () {
        f();
        e();
        UltimateLib.Logger.log("UltimateLib.Contracts init ran.");
    };
    h.Small = [];
    h.Medium = [];
    h.Large = [];
    h.AAA = [];
    h.MMO = [];
    h.add = function (j) {
        if (!b(j)) {
            console.log("failed");
            UltimateLib.Logger.log("Contract Failed Compatiblity Check: " + j.ulid);
            return;
        }
        var k = c(j);
        console.log(k);
        switch (k.gameSize) {
            case "small":
                h.Small.push(k);
                break;
            case "medium":
                h.Medium.push(k);
                break;
            case "large":
                h.Large.push(k);
                break;
            case "AAA":
                h.AAA.push(k);
                break;
            case "MMO":
                h.MMO.push(k);
                break;
            default:
                console.log("Incorrect Size");
                break;
        }
        console.log("Publisher Contract Added: " + k.name);
        UltimateLib.Logger.log("Publisher Contract Added: " + k.name);
    };

    function b(j) {
        return (Checks.checkPropertiesPresent(j, ["gameAudience", "minScore", "payment", "penalty", "royaltyRate"]));
    }

    function i(k) {
        try {
            GDT.getDataStore("UL-Publishers").data[k].complete = true;
        } catch (j) {
            GDT.getDataStore("UL-Publishers").data[k] = {
                complete: true
            };
        }
    }

    function d(k) {
        var l;
        try {
            l = GDT.getDataStore("UL-Publishers").data[k].complete;
        } catch (j) {
            l = false;
        }
        return l;
    }

    function c(k) {
        if (k.repeatable === false) {
            var l = k.complete;
            var m = k.canTrigger;
            k.complete = function (p) {
                i(this.ulid);
                l(p);
            };
            k.canTrigger = function (p) {
                return d(this.ulid) !== true && m(p);
            };
        }
        if (k.repeatable === true) {
            var n = k.complete;
            k.complete = function (p) {
                i(this.ulid);
                n(p);
            };
        }
        var j = k;
        var o = j.name ? j.name : (j.topic ? j.topic : "Any Topic".localize()) + " / " + (j.genre ? j.genre : "Any Genre".localize());
        console.log(o);
        return {
            id: "publisherContracts",
            ulid: "UL-Publishers-" + j.ulid,
            refNumber: Math.floor(Math.random() * 65535),
            type: "gameContract",
            name: o,
            description: "Publisher: {0}".localize().format(j.publisher),
            publisher: j.publisher,
            isRandom: j.isRandom,
            randomChance: j.randomChance ? j.randomChance : 1,
            canTrigger: j.canTrigger,
            complete: j.complete,
            repeatable: j.repeatable,
            topic: j.topic ? j.topic : undefined,
            genre: j.genre ? j.genre : undefined,
            platform: j.platform ? j.platform : undefined,
            gameSize: j.gameSize,
            gameAudience: j.audience,
            minScore: j.minScore,
            payment: j.payment,
            penalty: j.penalty,
            royaltyRate: j.royaltyRate,
            disabled: false
        };
    }

    function f() {
        var j = ProjectContracts.getAvailable;
        ProjectContracts.getAvailable = function (k, m) {
            var l = j(k, m);
            if (m === "gameContract") {
                l.addRange(UltimateLib.Publishers.collection(k));
                UltimateLib.Logger.log("Publisher Collection Added");
            }
            console.log(l);
            return l;
        };
    }

    function e() {
        var j = ProjectContracts.publisherContracts.complete;
        ProjectContracts.publisherContracts.complete = function (k, n, l) {
            try {
                l.complete(k);
            } catch (m) { }
            j(k, n, l);
        };
    }

    function g(k, j) {
        if (k === true) {
            if ((1 === Math.floor((Math.random() * j) + 1)) === false) {
                k = false;
            }
        }
        if (k === false) {
            k = true;
        }
        return k;
    }

    function a(l, j) {
        var k = false;
        $.grep(Platforms.getPlatformsOnMarket(j), function (m, n) {
            if (l === m.id || l === undefined) {
                k = true;
            }
        });
        return k;
    }
    h.collection = function (k) {
        var j = [];
        j.addRange(h.Small);
        UltimateLib.Logger.log("Small Contracts Added");
        console.log(h.Small);
        j.addRange(h.Medium);
        UltimateLib.Logger.log("Medium Contracts Added");
        console.log(h.Medium);
        if (k.canDevelopLargeGames()) {
            j.addRange(h.Large);
            UltimateLib.Logger.log("Large Contracts Added");
        }
        if (k.canDevelopAAAGames) {
            j.addRange(h.AAA);
            UltimateLib.Logger.log("AAA Contracts Added");
        }
        if (k.canDevelopMMOGames) {
            j.addRange(h.MMO);
            UltimateLib.Logger.log("MMO Contracts Added");
        }
        j = $.grep(j, function (l, m) {
            return l.canTrigger(k) && g(l.isRandom, l.randomChance) && a(l.platform, k);
        });
        console.log(j);
        return j;
    };
    UltimateLib.Logger.log("UltimateLib.Publishers loaded :-)");
    return h;
})(UltimateLib.Publishers || {});
UltimateLib.Research = (function (c) {
    UltimateLib.Logger.log("UltimateLib.Research loading...");
    c.init = function () {
        UltimateLib.Logger.log("UltimateLib.Research init ran.");
    };

    function a(i, k) {
        i.id = "UL-Research-" + i.id;
        if (k === 0) {
            var e = i.canResearch;
            i.canResearch = function (l) {
                return l.flags.hwLabUnlocked === true && e(l);
            };
        }
        if (i.repeatable === false) {
            var f = i.complete;
            var g = i.canResearch;
            i.complete = function (l) {
                GDT.getDataStore("UL-Research").data[this.id].complete = true;
                f(l);
            };
            i.canResearch = function (l) {
                var m = true;
                try {
                    if (GDT.getDataStore("UL-Research").data[this.id].complete === true) {
                        m = false;
                    }
                } catch (n) {
                    if (!GDT.getDataStore("UL-Research").data[this.id]) {
                        GDT.getDataStore("UL-Research").data[this.id] = {};
                    }
                    GDT.getDataStore("UL-Research").data[this.id].complete = false;
                }
                return m && g(l);
            };
        }
        if (i.repeatable === true) {
            var h = i.complete;
            i.complete = function (l) {
                GDT.getDataStore("UL-Research").data[this.id].complete = true;
                h(l);
            };
        }
        if (!(i.iconUri.length > 0)) {
            i.iconUri = GDT.getRelativePath() + "/img/defaultResearch.png";
        }
        var j = {
            id: i.id,
            name: i.name,
            pointsCost: i.pointsCost,
            canResearch: i.canResearch,
            iconUri: i.iconUri,
            description: i.description,
            targetZone: k,
            complete: i.complete
        };
        return j;
    }
    c.addSpecial = function (e) {
        if (!d(e)) {
            UltimateLib.Logger.log("Special Research Failed Compatiblity Check. " + e);
            return;
        }
        Research.SpecialItems.push(e);
        UltimateLib.Logger.log("Special Research Added");
    };
    c.addSpecialResearch = function (e) {
        if (!d(e)) {
            UltimateLib.Logger.log("Special Research Failed Compatiblity Check. " + e);
            return;
        }
        Research.SpecialItems.push(e);
        UltimateLib.Logger.log("Special Research Added");
    };
    c.addEngineResearch = function (e) {
        GDT.addResearchItem(e);
        UltimateLib.Logger.log("Engine Research Added");
    };

    function d(e) {
        return (Checks.checkPropertiesPresent(e, ["id", "name", "pointsCost", "duration", "cost", "category", "categoryDisplayName"]) && Checks.checkUniqueness(e, "id", Research.getAllItems()));
    }
    c.addLab = function (e) {
        if (!b(e)) {
            UltimateLib.Logger.log("Lab Research Failed Compatiblity Check. " + e);
            return;
        }
        Research.bigProjects.push(e);
        UltimateLib.Logger.log("Lab Research Added");
    };
    c.addRndResearch = function (e) {
        e = a(e, 2);
        if (!b(e)) {
            UltimateLib.Logger.log("RnD Lab Research Failed Compatiblity Check. " + e);
            return;
        }
        Research.bigProjects.push(e);
        UltimateLib.Logger.log("RnD Lab Research Added");
    };
    c.addHardwareResearch = function (e) {
        e = a(e, 0);
        if (!b(e)) {
            UltimateLib.Logger.log("Hardware Research Failed Compatiblity Check. " + e);
            return;
        }
        Research.bigProjects.push(e);
        UltimateLib.Logger.log("Hardware Research Research Added");
    };

    function b(e) {
        if (!(Checks.checkPropertiesPresent(e, ["id", "name", "pointsCost", "iconUri", "description"]) && Checks.checkUniqueness(e, "id", Research.getAllItems()))) {
            return false;
        }
        return true;
    }
    UltimateLib.Logger.log("UltimateLib.Research loaded :-)");
    return c;
})(UltimateLib.Research || {});
UltimateLib.Storage = (function (b) {
    UltimateLib.Logger.log("UltimateLib.Storage loading...");

    function a() {
        return $.jStorage.storageAvailable();
    }
    b.init = function () {
        UltimateLib.Logger.log("UltimateLib.Storage init ran.");
    };
    b.read = function (f, c) {
        try {
            if (a()) {
                UltimateLib.Logger.log("UltimateLib.Storage::read Trying to read from localStorage with ID UltimateLib.Storage." + f);
                if (typeof c !== undefined) {
                    return $.jStorage.get("UltimateLib.Storage." + f, c);
                } else {
                    return $.jStorage.get("UltimateLib.Storage." + f);
                }
            }
        } catch (d) {
            UltimateLib.Logger.log("UltimateLib.Storage::read An error occured trying to read from the local storage! Error: " + d.message);
            return false;
        }
    };
    b.write = function (f, c, g) {
        if (!$.jStorage.storageAvailable()) {
            return false;
        }
        try {
            if (typeof g !== undefined) {
                $.jStorage.set("UltimateLib.Storage." + f, c, {
                    TTL: g
                });
            } else {
                $.jStorage.set("UltimateLib.Storage." + f, c);
            }
            UltimateLib.Logger.log("UltimateLib.Storage::write LocalStorage was successfully written at ID UltimateLib.Storage." + f);
            return true;
        } catch (d) {
            UltimateLib.Logger.log("UltimateLib.Storage::write An error occured trying to write to the local storage! Error: " + d.message);
            return false;
        }
    };
    b.clearCache = function () {
        $.jStorage.flush();
    };
    b.getAllKeys = function () {
        return $.jStorage.index();
    };
    b.getStorageSize = function () {
        return $.jStorage.storageSize();
    };
    b.getStorageFreeSize = function () {
        return $.jStorage.storageAvailable();
    };
    b.reload = function () {
        $.jStorage.reInit();
    };
    b.onKeyChanged = function (e, d, c) {
        $.jStorage.listenKeyChange("UltimateLib.Storage." + e + "." + d, c);
    };
    b.removeListeners = function (e, d, c) {
        if (typeof c !== undefined) {
            $.jStorage.stopListening("UltimateLib.Storage." + e + "." + d, c);
        } else {
            $.jStorage.stopListening("UltimateLib.Storage." + e + "." + d);
        }
    };
    UltimateLib.Logger.log("UltimateLib.Storage loaded :-)");
    return b;
})(UltimateLib.Storage || {});
UltimateLib.Stats = (function (b) {
    UltimateLib.Logger.log("UltimateLib.Stats loading...");

    function a(c) {
        return typeof c != "undefined" && c != null;
    }
    b.init = function () {
        UltimateLib.Logger.log("UltimateLib.Stats init ran.");
    };
    b.getTotalGameRevenues = function (e) {
        var d = e ? e : GameManager.company;
        if (!d.gameLog || (d.gameLog && d.gameLog.length < 1)) {
            return 0;
        }
        var g = 0;
        for (var f = 0; f < d.gameLog.length; f++) {
            g += parseInt(d.gameLog[f].revenue);
        }
        return g;
    };
    b.getTotalGameCost = function (e) {
        var d = e ? e : GameManager.company;
        if (!d.gameLog || (d.gameLog && d.gameLog.length < 1)) {
            return 0;
        }
        var g = 0;
        for (var f = 0; f < d.gameLog.length; f++) {
            g += parseInt(d.gameLog[f].costs);
        }
        return g;
    };
    b.getTotalGameProfit = function (e) {
        var d = e ? e : GameManager.company;
        return b.getTotalGameRevenues(d) - b.getTotalGameCost(d);
    };
    b.getGamesWithHighestScore = function (e) {
        var d = e ? e : GameManager.company;
        if (!d.gameLog || (d.gameLog && d.gameLog.length < 1)) {
            return 0;
        }
        var h = [];
        var g = null;
        for (var f = 0; f < d.gameLog.length; f++) {
            if (g == null || d.gameLog[f].score >= g.score) {
                h.push(d.gameLog[f]);
                g = d.gameLog[f].score;
            }
        }
        return h;
    };
    b.getBestGame = function (f) {
        var d = f ? f : GameManager.company;
        if (!d.gameLog || (d.gameLog && d.gameLog.length < 1)) {
            return 0;
        }
        var n = null;
        var l = 0;
        var g = 0;
        var k = 0;
        var j = 0;
        for (var h = 0; h < d.gameLog.length; h++) {
            l = d.gameLog[h].revenue;
            g = d.gameLog[h].costs;
            k = l - g;
            if (n == null || k > j) {
                n = d.gameLog[h];
                j = k;
            }
        }
        var e = m.Utils.hasGameBeenReviewed(n);
        return {
            game: e ? n : m.LastBestGame,
            profit: j
        };
    };
    b.hasGameBeenReviewed = function (c) {
        return a(c) && c.reviewMessageDisplayed;
    };
    b.createGameSalesStats = function (f) {
        if (!f) {
            return undefined;
        }
        var k = 1;
        var l = f.releaseWeek;
        var j = f.salesCashLog;
        var g = GameManager.getGUID();
        var c = $(document.createElement("div"));
        c.attr("id", "ul-stats-gamesales-" + g);
        c.css("position", "relative").css("width", "500px").css("height", "160px");
        var e = [];
        for (var h = 0; h < j.length; h++) {
            e.push([k, j[h]]);
            k++;
        }
        var d = $(document.createElement("div"));
        d.attr("id", "ul-stats-gamesales-tooltip-" + g).css({
            position: "absolute",
            display: "none",
            border: "1px solid #333333",
            padding: "2px",
            "background-color": "#2222ff",
            color: "#ffffff",
            opacity: 0.8,
            zIndex: 9100
        });
        return {
            el: c,
            tip: d,
            data: e,
            id: g
        };
    };
    b.renderGameSalesStats = function (e, c) {
        c.el.appendTo(e);
        c.tip.appendTo(e);
        var d = $.plot(c.el, [c.data], {
            lines: {
                show: true,
                fill: true
            },
            points: {
                show: true,
                fillColor: "yellow"
            },
            xaxis: {
                tickSize: 1,
                tickFormatter: function (g, f) {
                    return parseInt(g);
                }
            },
            yaxis: {
                position: "left",
                tickFormatter: function (g, f) {
                    return UI.getShortNumberString(g);
                }
            },
            grid: {
                show: true,
                hoverable: true,
                clickable: true
            }
        });
        c.bind("plothover", function (f, i, h) {
            var g = "ul-stats-gamesales-tooltip-" + c.id;
            if (h) {
                var j = parseInt(h.datapoint[0].toFixed(2)),
                    k = UI.getShortNumberString(h.datapoint[1].toFixed(2));
                $("#" + g).html("Week " + j + " = " + k).css({
                    top: h.pageY + 5,
                    left: h.pageX + 5
                }).fadeIn(200);
            } else {
                $("#" + g).hide();
            }
        });
    };
    b.showGameSalesStats = function (c, d) {
        if (!c) {
            return;
        }
        c.el.show(d);
    };
    b.destroyGameSalesStats = function (c) {
        if (!c) {
            return;
        }
        c.el.remove();
        c.tip.remove();
        c = {};
    };
    UltimateLib.Logger.log("UltimateLib.Stats loaded :-)");
    return b;
})(UltimateLib.Stats || {});
UltimateLib.Utils = (function (a) {
    UltimateLib.Logger.log("UltimateLib.Utils loading...");

    function b(d, e) {
        return d.toLowerCase() > e.toLowerCase() ? 1 : -1;
    }

    function c(d, e) {
        return d > e ? 1 : -1;
    }
    a.getFormattedNumber = function (g) {
        var h = g.toString().replace(",", ".");
        var f = "";
        var e;
        if (h.indexOf(".") >= 0) {
            var d = h.substring(0, h.lastIndexOf("."));
            e = d.length - 1;
            if (e > 0) {
                f = h.substring(0, 1) + "E" + e;
            } else {
                f = h;
            }
        } else {
            e = h.length - 1;
            if (e > 0) {
                f = h.substring(0, 1) + "E" + e;
            } else {
                f = h;
            }
        }
        return f;
    };
    a.wait4 = function (f, e, d) {
        if (typeof f !== "undefined") {
            UltimateLib.Logger.log("Done waiting!");
            f = e;
        } else {
            UltimateLib.Logger.log("I wait4 " + d + " ms...");
            setTimeout(function () {
                wait();
            }, d);
        }
    };
    a.sort = function (d, g, e) {
        var f = [];
        if (g == "alpha") {
            f = d.sort(b);
        }
        if (g == "num") {
            f = d.sort(c);
        }
        if (e === false) {
            f.reverse();
        }
        return f;
    };
    a.compare = function (f, g, e) {
        var d = false;
        if ((e == "=" || e == "eq") && f == g) {
            d = true;
        }
        if ((e == "<" || e == "lt") && f < g) {
            d = true;
        }
        if ((e == ">" || e == "gt") && f > g) {
            d = true;
        }
        return d;
    };
    a.getIds = function (d) {
        var e = [];
        $.grep(d, function (f, g) {
            e.push(f.id);
        });
        return e;
    };
    a.percentage = function (g, d, e) {
        e = e ? true : false;
        if (g === 0 || d === 0) {
            return 0;
        }
        var f = g / d * 100;
        if (e === true) {
            f = Math.floor(f);
        }
        return f;
    };
    a.devStats = function () {
        var d = function (h, j) {
            var f;
            var i = "";
            var g = "";
            switch (j) {
                case "h1":
                    f = "background: #333; color: #bada55; font-weight:bold;";
                    h = "--- " + h + " ---";
                    i = Array((38 - h.length) + 1).join(" ");
                    g = Array(Math.floor((i.length / 2)) + 1).join(" ");
                    i = Array((i.length - g.length) + 1).join(" ");
                    break;
                case "h2":
                    f = "background: #333; color: #bada55; font-weight:bold;";
                    h = "-- " + h + " --";
                    i = Array((38 - h.length) + 1).join(" ");
                    g = Array(Math.floor((i.length / 2)) + 1).join(" ");
                    i = Array((i.length - g.length) + 1).join(" ");
                    break;
                case "h3":
                    f = "background: #333; color: #bada55; font-weight:bold;";
                    h = "- " + h + " -";
                    i = Array((38 - h.length) + 1).join(" ");
                    g = Array(Math.floor((i.length / 2)) + 1).join(" ");
                    i = Array((i.length - g.length) + 1).join(" ");
                    break;
                default:
                    i = Array((38 - h.length) + 1).join(" ");
                    f = "background: #333; color: #fff";
                    break;
            }
            h = " #  " + g + h + i + "  # ";
            if (j == "div") {
                console.log("%c " + (Array((38 + 6) + 1).join("#")) + " ", f);
                return;
            }
            if (f) {
                console.log(("%c" + h), f);
            } else {
                console.log(h);
            }
            return;
        };
        var e = Research;
        d("", "div");
        d("Development Stats", "h1");
        d("", "div");
        d("");
        d("", "div");
        d("Research Items", "h2");
        d("Basic Items: " + e.BasicItems.length);
        d("Special Items: " + e.SpecialItems.length);
        d("One Time Items: " + e.OneTimeItems.length);
        d("Lab Researches: " + e.bigProjects.length);
        d("");
        d("Game Engine Items", "h3");
        d("Engine Items: " + e.engineItems.length);
        d("Gameplay Items: " + e.gameplayItems.length);
        d("Story Items: " + e.storyItems.length);
        d("Dialog Items: " + e.dialogItems.length);
        d("Level Design Items: " + e.levelDesignItems.length);
        d("A.I. Items: " + e.aiItems.length);
        d("World Design Items: " + e.worldDesignItems.length);
        d("Graphic Items: " + e.graphicItems.length);
        d("Sound Items: " + e.soundItems.length);
        d("");
        d(" -- Total: " + (e.getAllItems().length + e.bigProjects.length));
        d("", "div");
        d("");
        d("", "div");
        d("Misc.", "h2");
        d("", "div");
        d("Achivements: " + Achievements.getAllItems().length);
        d("Platforms: " + Platforms.allPlatforms.length);
        d("Events: " + DecisionNotifications.getAllNotificationsObjects().length);
        d("Topics: " + Topics.topics.length);
        d("Mods: " + ModSupport.availableMods.length);
        d(" --Enabled: " + JSON.parse(DataStore.getValue("enabledMods")).length);
        d("", "div");
        d(" Powered by UltimateLib");
        d("", "div");
    };
    a.getActiveModsString = function () {
        var d = ModSupport.availableMods;
        return activeMods;
    };
    UltimateLib.Logger.log("UltimateLib.Utils loaded :-)");
    return a;
})(UltimateLib.Utils || {});
UltimateLib.Visuals = (function (a) {
    UltimateLib.Logger.log("UltimateLib.Visuals loading...");
    a.init = function () {
        a.Tweaks.init();
    };
    a.Custom = (function (b) {
        var c = "UL-Visuals-Custom";
        b.setCss = function (e, d) {
            e = c + e;
            if ($("#" + e).length === 0) {
                $("head").append('<style id="' + e + '" type="text/css"></style>');
            }
            $("head").find("#" + e).append(d);
        };
        b.addCss = function (e, d) {
            e = c + e;
            if ($("#" + e).length === 0) {
                $("head").append('<style id="' + e + '" type="text/css"></style>');
            }
            $("head").find("#" + e).html(d);
        };
        return b;
    })(a.Custom || {});
    a.setLayoutCss = function (c) {
        var b = $('link[href$="layout.css"]');
        b.attr("href", ".mods/" + c + "/css/layout.css");
    };
    a.Tweaks = (function (c) {
        var d = GDT.getDataStore("UltimateLib");
        var e = "ul-visuals-tweaks";
        c.init = function () {
            UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks init ran.");
            $("head").append('<style id="' + e + '" type="text/css"></style>');
            UltimateLib.Storage.write("SliderBG", {
                engine: "./mods/UltimateLib/img/defaultsbg.gif",
                gameplay: "./mods/UltimateLib/img/defaultsbg.gif",
                story: "./mods/UltimateLib/img/defaultsbg.gif",
                dialogs: "./mods/UltimateLib/img/defaultsbg.gif",
                level: "./mods/UltimateLib/img/defaultsbg.gif",
                ai: "./mods/UltimateLib/img/defaultsbg.gif",
                graphic: "./mods/UltimateLib/img/defaultsbg.gif",
                sound: "./mods/UltimateLib/img/defaultsbg.gif",
                world: "./mods/UltimateLib/img/defaultsbg.gif",
                cssset: false,
                watermarkset: false
            });
        };
        c.setRoundedWindows = function (f) {
            if (d.settings.roundedCorners === false) {
                UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setRoundedWindows = false.");
                return;
            }
            if (!(f >= 0)) {
                f = 15;
            }
            var g = $("#" + e);
            g.append(".windowBorder, .rsSlide, .selectionOverlayContainer, .ul-vt-window, .tallWindow, .wideWindow, .ui-dialog  { border-radius: " + f + "px !important; }");
            g.append(".notificationImageContainer, .featureStaffAsignPanel   { border-top-left-radius: " + f + "px !important; border-bottom-left-radius: " + f + "px !important; }");
            g.append(".featureSelectionPanel   { border-top-right-radius: " + f + "px !important; border-bottom-right-radius: " + f + "px !important; }");
            UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setRoundedWindows set.");
        };
        c.setScrollBar = function (f) {
            if (d.settings.scrollBar === false) {
                UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.scrollBar = false.");
                return;
            }
            var g = $("#" + e);
            switch (f) {
                case 1:
                    g.append("::-webkit-scrollbar { width: 12px; }");
                    g.append("::-webkit-scrollbar-track-piece { width: 6px; }");
                    g.append("::-webkit-scrollbar-track { width: 12px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);  border-radius: 8px; }");
                    g.append("::-webkit-scrollbar-thumb { border-radius: 8px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.4);  background: radial-gradient(ellipse at center, rgba(250,198,149,1) 0%,rgba(245,171,102,1) 47%,rgba(239,141,49,1) 100%); }");
                    UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setScrollBar 1 set.");
                    break;
                case 2:
                    g.append("::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); background-color: #F5F5F5; border-radius: 10px; }");
                    g.append("::-webkit-scrollbar { width: 10px; background-color: #F5F5F5; }");
                    g.append("::-webkit-scrollbar-thumb {border-radius: 10px; background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.44, rgb(122,153,217)), color-stop(0.72, rgb(73,125,189)), color-stop(0.86, rgb(28,58,148))); }");
                    UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setScrollBar 2 set.");
                    break;
                case 3:
                    g.append("::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); background-color: #F5F5F5; border-radius: 10px; }");
                    g.append("::-webkit-scrollbar { width: 10px; background-color: #F5F5F5; }");
                    g.append("::-webkit-scrollbar-thumb { background-color: #AAA; border-radius: 10px; background-image: -webkit-linear-gradient(90deg, rgba(0, 0, 0, .2) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, .2) 50%, rgba(0, 0, 0, .2) 75%, transparent 75%, transparent) }");
                    UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setScrollBar 3 set.");
                    break;
                default:
                    g.append("::-webkit-scrollbar { width: 12px; }");
                    g.append("::-webkit-scrollbar-track-piece { width: 6px; }");
                    g.append("::-webkit-scrollbar-track { width: 12px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);  border-radius: 8px; }");
                    g.append("::-webkit-scrollbar-thumb { border-radius: 8px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.4);  background: radial-gradient(ellipse at center, rgba(250,198,149,1) 0%,rgba(245,171,102,1) 47%,rgba(239,141,49,1) 100%); }");
                    UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setScrollBar default set.");
                    break;
            }
        };
        c.setRoundedButtons = function (f) {
            if (d.settings.roundedButtons === false) {
                UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.roundedButtons = false.");
                return;
            }
            if (!(f >= 0)) {
                f = 10;
            }
            var g = $("#" + e);
            g.append(".orangeButton, .deleteButton, .whiteButton, .selectorButton, .baseButton, .contextMenuButton, .gameSizeButton, .ul-vt-button { border-radius: " + f + "px; }");
            UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setRoundedButtons set.");
        };
        c.setRoundedBars = function (f) {
            if (d.settings.roundedBars === false) {
                UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setRoundedBars = false.");
                return;
            }
            if (!(f >= 0)) {
                f = 8;
            }
            var g = $("#" + e);
            g.append(".featureProgressContainer,  .staffItemBorder, .staffDTBarContainer, .rsNavItem, .rsThumb, .projectStatusCard, .selectableGameFeatureItem, .ul-vt-bar { border-radius: " + f + "px; }");
            g.append(".featurePreview1, .featureProgress, .ul-vt-bar-left { border-top-left-radius: " + f + "px; border-bottom-left-radius: " + f + "px }");
            g.append(".featurePreview3, .featureProgressGain, .ul-vt-bar-right { border-top-right-radius: " + f + "px; border-bottom-right-radius: " + f + "px }");
            UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setRoundedBars set.");
        };
        c.setTextBox = function (f) {
            if (d.settings.textBox === false) {
                UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setTextBox = false.");
                return;
            }
            if (!(f >= 0)) {
                f = 8;
            }
            var g = $("#" + e);
            g.append(".gameSalesCardCanvas {width: 220px;left: 3px;};");
            g.append("#gameTitle, .featureSelectionCategoryHeading, .gameSalesCard, .loadSaveButton, .cashLogContainer, .ul-vt-textbox { border-radius: " + f + "px; }");
            UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setTextBox set.");
        };
        c.setFancyGrads = function (f) {
            if (d.settings.fancyGrads === false) {
                UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setFancyGrads = false.");
                return;
            }
            var g = $("#" + e);
            switch (f) {
                case 1:
                    g.append(".feature1 .ui-slider-range, .featurePreview1 { background: linear-gradient(to bottom,  #a90329 0%,#8f0222 44%,#6d0019 100%); }");
                    g.append(".feature2 .ui-slider-range, .featurePreview2 { background: linear-gradient(to bottom, #c9de96 0%,#8ab66b 57%,#398235 100%); }");
                    g.append(".feature3 .ui-slider-range, .featurePreview3 { background: linear-gradient(to bottom, rgba(107,178,196,1) 0%,rgba(35,83,138,1) 100%); }");
                    break;
                default:
                    g.append(".feature1 .ui-slider-range, .featurePreview1 { background: linear-gradient(to bottom,  #a90329 0%,#8f0222 44%,#6d0019 100%); }");
                    g.append(".feature2 .ui-slider-range, .featurePreview2 { background: linear-gradient(to bottom, #c9de96 0%,#8ab66b 57%,#398235 100%); }");
                    g.append(".feature3 .ui-slider-range, .featurePreview3 { background: linear-gradient(to bottom, rgba(107,178,196,1) 0%,rgba(35,83,138,1) 100%); }");
                    break;
            }
            UltimateLib.Logger.log("UltimateLib.Visuals.Tweaks.setFancyGrads set.");
        };
        c.setWatermarks = function (f, h) {
            var g = $("#" + e);
            var i = UltimateLib.Storage.read("SliderBG");
            switch (f) {
                case "slider-all-img":
                    $("#selectFeatureMenuTemplate").find(".focusSliderWrapper").prepend('<img id="allsliderimg" class="ul-vt-slider-img" src="' + h + '"/>');
                    break;
                case "slider-engine-img":
                    i.engine = h;
                    break;
                case "slider-gameplay-img":
                    i.gameplay = h;
                    break;
                case "slider-story-img":
                    i.story = h;
                    break;
                case "slider-dialogs-img":
                    i.dialogs = h;
                    break;
                case "slider-level-img":
                    i.level = h;
                    break;
                case "slider-ai-img":
                    i.ai = h;
                    break;
                case "slider-world-img":
                    i.world = h;
                    break;
                case "slider-graphic-img":
                    i.graphic = h;
                    break;
                case "slider-sound-img":
                    i.sound = h;
                    break;
                case "slider-1":
                    g.append('#selectFeatureMenuTemplate .focusSliderWrapper .feature1 { background-image: url("' + h + '"); }');
                    break;
                case "slider-2":
                    g.append('#selectFeatureMenuTemplate .focusSliderWrapper .feature2 { background-image: url("' + h + '"); }');
                    break;
                case "slider-3":
                    g.append('#selectFeatureMenuTemplate .focusSliderWrapper .feature3 { background-image: url("' + h + '"); }');
                    break;
                case "development":
                    $("#resources").find("#selectFeatureMenuTemplate").prepend('<div id="development"></div>');
                    g.append('#development { background-image: url("' + h + '"); background-size:100% 100%; width:95%; height:95%; position:absolute; opacity:0.4;-webkit-filter: blur(7px);}');
                    break;
                case "development-1":
                    g.append('#selectFeatureMenuTemplate .focusSliderWrapper .feature1 { background-image: url("' + h + '"); }');
                    break;
                case "development-2":
                    g.append('#selectFeatureMenuTemplate .focusSliderWrapper .feature1 { background-image: url("' + h + '"); }');
                    break;
                case "development-3":
                    g.append('#selectFeatureMenuTemplate .focusSliderWrapper .feature1 { background-image: url("' + h + '"); }');
                    break;
                default:
                    break;
            }
            if (i.cssset === false) {
                g.append(".ul-vt-slider-img { width:80%; height:80%; border-width: 1px; border-style:solid; border-color:#828282; position:absolute; opacity:0.8; left: 17px; bottom: 70px; }");
                i.cssset = true;
            }
            if (i.watermarkset === false) {
                b();
                i.watermarkset = true;
            }
        };
        var b = function () {
            var f = UI.showFeatureList;
            UI.showFeatureList = function (g, l) {
                var h = UltimateLib.Storage.read("SliderBG");
                var m = $("#" + e);
                f(g, l);
                var i = $("#selectFeatureMenu").find(".focusSliderWrapper.feature1");
                var j = $("#selectFeatureMenu").find(".focusSliderWrapper.feature2");
                var k = $("#selectFeatureMenu").find(".focusSliderWrapper.feature3");
                if (GameManager.getCurrentDevStage() == 1) {
                    i.prepend('<img id="engine" class="ul-vt-slider-img" src="' + h.engine + '"/>');
                    j.prepend('<img id="gameplay" class="ul-vt-slider-img" src="' + h.gameplay + '"/>');
                    k.prepend('<img id="story" class="ul-vt-slider-img" src="' + h.story + '"/>');
                }
                if (GameManager.getCurrentDevStage() == 2) {
                    i.prepend('<img id="dialogs" class="ul-vt-slider-img" src="' + h.dialogs + '"/>');
                    j.prepend('<img id="level" class="ul-vt-slider-img" src="' + h.level + '"/>');
                    k.prepend('<img id="ai" class="ul-vt-slider-img" src="' + h.ai + '"/>');
                }
                if (GameManager.getCurrentDevStage() == 3) {
                    i.prepend('<img id="world" class="ul-vt-slider-img" src="' + h.world + '"/>');
                    j.prepend('<img id="graphic" class="ul-vt-slider-img" src="' + h.graphic + '"/>');
                    k.prepend('<img id="sound" class="ul-vt-slider-img" src="' + h.sound + '"/>');
                }
            };
        };
        c.setAllTweaks = function (f) {
            c.setRoundedWindows();
            c.setScrollBar();
            c.setRoundedButtons();
            c.setRoundedBars();
            c.setTextBox();
            c.setFancyGrads();
        };
        return c;
    })(a.Tweaks || {});
    UltimateLib.Logger.log("UltimateLib.Visuals loading...");
    return a;
})(UltimateLib.Visuals || {});
UltimateLib.VisualTweaks = (function (a) {
    UltimateLib.Logger.log("UltimateLib.VisualTweaks loading... - Deprecated");
    a.init = function () { };
    a.setAllTweaks = function (b) {
        UltimateLib.Visuals.Tweaks.setAllTweaks(b);
    };
    a.setRoundedWindows = function (b) {
        UltimateLib.Visuals.Tweaks.setRoundedWindows(b);
    };
    a.setScrollBar = function (b) {
        UltimateLib.Visuals.Tweaks.setScrollBar(b);
    };
    a.setRoundedButtons = function (b) {
        UltimateLib.Visuals.Tweaks.setRoundedButtons(b);
    };
    a.setRoundedBars = function (b) {
        UltimateLib.Visuals.Tweaks.setRoundedBars(b);
    };
    a.setTextBox = function (b) {
        UltimateLib.Visuals.Tweaks.setTextBox(b);
    };
    a.setFancyGrads = function (b) {
        UltimateLib.Visuals.Tweaks.setFancyGrads(b);
    };
    a.setWatermarks = function (b, c) {
        UltimateLib.Visuals.Tweaks.setWatermarks(b, c);
    };
    UltimateLib.Logger.log("UltimateLib.VisualTweaks loaded :-) - Deprecated");
    return a;
})(UltimateLib.VisualTweaks || {});
UltimateLib.Update = (function (b) {
    UltimateLib.Logger.log("UltimateLib.Update loading...");

    function a(k, l) {
        var j = 0;
        var g = k.split(".");
        var h = l.split(".");
        var d = Math.max(g.length, h.length);
        for (var c = 0; c < d; c++) {
            var e = (c < g.length) ? parseInt(g[c], 10) : 0;
            var f = (c < h.length) ? parseInt(h[c], 10) : 0;
            if (isNaN(e)) {
                e = 0;
            }
            if (isNaN(f)) {
                f = 0;
            }
            if (e != f) {
                j = (e > f) ? 1 : -1;
                break;
            }
        }
        return j;
    }
    b.init = function () {
        UltimateLib.Logger.log("UltimateLib.Update init ran.");
    };
    b.GitHub = (function (c) {
        c.getLatestVersionAvailable = function (h, g, d, e) {
            d = d ? d : "master";
            e = e ? e + "/" : "";
            var f = new Github({
                username: h
            });
            g = f.getRepo(h, g);
            g.read(d, e + "package.json", function (j, i) {
                if (j) {
                    UltimateLib.Logger.log("Could not read the specified GitHub data. The server responded:" + j);
                    return undefined;
                } else {
                    var k = JSON.parse(i);
                    return k.version;
                }
            });
        };
        c.hasNewerVersion = function (i, h, d, e) {
            d = d ? d : "master";
            e = e ? e + "/" : "";
            var f = new Github({
                username: i
            });
            var g = false;
            h = f.getRepo(i, h);
            h.read(d, e + "package.json", function (k, j) {
                g = false;
                if (k) {
                    UltimateLib.Logger.log("Could not read the specified GitHub data in UltimateLib.Update.hasNeverVersion. The server responded:" + k);
                } else {
                    var n = JSON.parse(j);
                    var m;
                    for (var l = 0; l < ModSupport.availableMods.length; l++) {
                        if (ModSupport.availableMods[l].id == n.id) {
                            m = ModSupport.availableMods[l];
                            break;
                        }
                    }
                    if (m) {
                        g = a(m.version, n.version) < 0;
                    }
                }
            });
        };
        c.notifyIfNewerVersion = function (i, h, d, e) {
            d = d ? d : "master";
            e = e ? e + "/" : "";
            var f = new Github({
                username: i
            });
            var g = false;
            h = f.getRepo(i, h);
            h.read(d, e + "package.json", function (r, l) {
                if (r) {
                    UltimateLib.Logger.log("Could not read the specified GitHub data. The server responded:" + r);
                } else {
                    var y = JSON.parse(l);
                    var u;
                    for (var t = 0; t < ModSupport.availableMods.length; t++) {
                        if (ModSupport.availableMods[t].id == y.id) {
                            u = ModSupport.availableMods[t];
                            break;
                        }
                    }
                    if (u) {
                        var k = a(u.version, y.version);
                        var s = "";
                        var j = "";
                        if (k < 0) {
                            s = "New version available";
                            j = "A new version of " + u.name + " is available.<br>Latest version: <strong>" + y.version + "</strong>";
                            var m = $(document);
                            var q = m.width();
                            var p = m.height();
                            var n = (q * 0.5) - 300;
                            var o = (p * 0.5) - 20;
                            var v = $(document.createElement("div"));
                            var w = $(document.createElement("div"));
                            var x = $(document.createElement("div"));
                            v.addClass("UltimateLibUpdateNotifierElement");
                            v.css({
                                width: "600",
                                height: 80,
                                border: "4px solid #ffffff",
                                opacity: 1,
                                textAlign: "center",
                                backgroundColor: "#eeeeee",
                                position: "absolute",
                                top: "5px",
                                left: n,
                                zIndex: 10000
                            });
                            w.addClass("icon-remove-sign");
                            w.css({
                                width: 16,
                                height: 16,
                                position: "relative",
                                top: "-40px",
                                left: "230px",
                                cursor: "pointer",
                                margin: 0,
                                padding: 0
                            });
                            w.attr("title", "Close this update notification");
                            x.addClass("icon-external-link");
                            x.css({
                                width: 16,
                                height: 16,
                                position: "relative",
                                top: "-39px",
                                left: "190px",
                                cursor: "pointer",
                                margin: 0,
                                padding: 0
                            });
                            x.attr("title", "Click here to browse to the update page (" + u.url + ")");
                            $("#gameContainerWrapper").append(v);
                            v.html("<h3>" + s + "</h3>" + j);
                            w.appendTo(v);
                            x.appendTo(v);
                            w.click(function () {
                                v.remove();
                            });
                            x.click(function () {
                                PlatformShim.openUrlExternal(u.url);
                                v.remove();
                            });
                        } else {
                            if (k === 0) {
                                s = "You are up-to-date";
                                j = "You are already using the latest version of " + u.name + "<br>Current version:  <strong>" + u.version + "</strong>";
                            }
                        }
                    }
                }
            });
        };
        return c;
    })(b.GitHub || {});
    return b;
})(UltimateLib.Update || {});
(function () {
    var b = function () { };
    var a = function () { };
    UltimateLib.init();
    UltimateLib.Logger.enabled = UltimateLib.mod.debug && UltimateLib.mod.debug === true;
    UltimateLib.Core.init();
})();