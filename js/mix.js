(function(a, b) {
    a.MixItUp = function() {
        var c = this;
        c._execAction("_constructor", 0);
        a.extend(c, {
            selectors: {
                target: ".mix",
                filter: ".filter",
                sort: ".sort"
            },
            animation: {
                enable: true,
                effects: "fade scale",
                duration: 600,
                easing: "ease",
                perspectiveDistance: "3000",
                perspectiveOrigin: "50% 50%",
                queue: true,
                queueLimit: 1,
                animateChangeLayout: false,
                animateResizeContainer: true,
                animateResizeTargets: false,
                staggerSequence: false,
                reverseOut: false
            },
            callbacks: {
                onMixLoad: false,
                onMixStart: false,
                onMixBusy: false,
                onMixEnd: false,
                onMixFail: false,
                _user: false
            },
            controls: {
                enable: true,
                live: false,
                toggleFilterButtons: false,
                toggleLogic: "or",
                activeClass: "active"
            },
            layout: {
                // display: "inline-block",
                display: "block",
                containerClass: "",
                containerClassFail: "fail"
            },
            load: {
                filter: "all",
                sort: false
            },
            _$body: null,
            _$container: null,
            _$targets: null,
            _$parent: null,
            _$sortButtons: null,
            _$filterButtons: null,
            _suckMode: false,
            _mixing: false,
            _sorting: false,
            _clicking: false,
            _loading: true,
            _changingLayout: false,
            _changingClass: false,
            _changingDisplay: false,
            _origOrder: [],
            _startOrder: [],
            _newOrder: [],
            _activeFilter: null,
            _toggleArray: [],
            _toggleString: "",
            _activeSort: "default:asc",
            _newSort: null,
            _startHeight: null,
            _newHeight: null,
            _incPadding: true,
            _newDisplay: null,
            _newClass: null,
            _targetsBound: 0,
            _targetsDone: 0,
            _queue: [],
            _$show: a(),
            _$hide: a()
        });
        c._execAction("_constructor", 1)
    };
    a.MixItUp.prototype = {
        constructor: a.MixItUp,
        _instances: {},
        _handled: {
            _filter: {},
            _sort: {}
        },
        _bound: {
            _filter: {},
            _sort: {}
        },
        _actions: {},
        _filters: {},
        extend: function(d) {
            for (var c in d) {
                a.MixItUp.prototype[c] = d[c]
            }
        },
        addAction: function(f, c, e, d) {
            a.MixItUp.prototype._addHook("_actions", f, c, e, d)
        },
        addFilter: function(f, c, e, d) {
            a.MixItUp.prototype._addHook("_filters", f, c, e, d)
        },
        _addHook: function(e, g, c, f, d) {
            var i = a.MixItUp.prototype[e],
                h = {};
            d = (d === 1 || d === "post") ? "post" : "pre";
            h[g] = {};
            h[g][d] = {};
            h[g][d][c] = f;
            a.extend(true, i, h)
        },
        _init: function(f, d) {
            var c = this;
            c._execAction("_init", 0, arguments);
            d && a.extend(true, c, d);
            c._$body = a("body");
            c._domNode = f;
            c._$container = a(f);
            c._$container.addClass(c.layout.containerClass);
            c._id = f.id;
            c._platformDetect();
            c._brake = c._getPrefixedCSS("transition", "none");
            c._refresh(true);
            c._$parent = c._$targets.parent().length ? c._$targets.parent() : c._$container;
            if (c.load.sort) {
                c._newSort = c._parseSort(c.load.sort);
                c._newSortString = c.load.sort;
                c._activeSort = c.load.sort;
                c._sort();
                c._printSort()
            }
            c._activeFilter = c.load.filter === "all" ? c.selectors.target : c.load.filter === "none" ? "" : c.load.filter;
            c.controls.enable && c._bindHandlers();
            if (c.controls.toggleFilterButtons) {
                c._buildToggleArray();
                for (var e = 0; e < c._toggleArray.length; e++) {
                    c._updateControls({
                        filter: c._toggleArray[e],
                        sort: c._activeSort
                    }, true)
                }
            } else {
                if (c.controls.enable) {
                    c._updateControls({
                        filter: c._activeFilter,
                        sort: c._activeSort
                    })
                }
            }
            c._filter();
            c._init = true;
            c._$container.data("mixItUp", c);
            c._execAction("_init", 1, arguments);
            c._buildState();
            c._$targets.css(c._brake);
            c._goMix(c.animation.enable)
        },
        _platformDetect: function() {
            var f = this,
                j = ["Webkit", "Moz", "O", "ms"],
                i = ["webkit", "moz"],
                d = window.navigator.appVersion.match(/Chrome\/(\d+)\./) || false,
                e = typeof InstallTrigger !== "undefined",
                g = function(l) {
                    for (var k = 0; k < j.length; k++) {
                        if (j[k] + "Transition" in l.style) {
                            return {
                                prefix: "-" + j[k].toLowerCase() + "-",
                                vendor: j[k]
                            }
                        }
                    }
                    return "transition" in l.style ? "" : false
                },
                h = g(f._domNode);
            f._execAction("_platformDetect", 0);
            f._chrome = d ? parseInt(d[1], 10) : false;
            f._ff = e ? parseInt(window.navigator.userAgent.match(/rv:([^)]+)\)/)[1]) : false;
            f._prefix = h.prefix;
            f._vendor = h.vendor;
            f._suckMode = window.atob && f._prefix ? false : true;
            f._suckMode && (f.animation.enable = false);
            (f._ff && f._ff <= 4) && (f.animation.enable = false);
            for (var c = 0; c < i.length && !window.requestAnimationFrame; c++) {
                window.requestAnimationFrame = window[i[c] + "RequestAnimationFrame"]
            }
            if (typeof Object.getPrototypeOf !== "function") {
                if (typeof "test".__proto__ === "object") {
                    Object.getPrototypeOf = function(k) {
                        return k.__proto__
                    }
                } else {
                    Object.getPrototypeOf = function(k) {
                        return k.constructor.prototype
                    }
                }
            }
            if (f._domNode.nextElementSibling === b) {
                Object.defineProperty(Element.prototype, "nextElementSibling", {
                    get: function() {
                        var k = this.nextSibling;
                        while (k) {
                            if (k.nodeType === 1) {
                                return k
                            }
                            k = k.nextSibling
                        }
                        return null
                    }
                })
            }
            f._execAction("_platformDetect", 1)
        },
        _refresh: function(m, d) {
            var n = this;
            n._execAction("_refresh", 0, arguments);
            n._$targets = n._$container.find(n.selectors.target);
            for (var h = 0; h < n._$targets.length; h++) {
                var k = n._$targets[h];
                if (k.dataset === b || d) {
                    k.dataset = {};
                    for (var g = 0; g < k.attributes.length; g++) {
                        var l = k.attributes[g],
                            c = l.name,
                            f = l.value;
                        if (c.indexOf("data-") > -1) {
                            var e = n._helpers._camelCase(c.substring(5, c.length));
                            k.dataset[e] = f
                        }
                    }
                }
                if (k.mixParent === b) {
                    k.mixParent = n._id
                }
            }
            if ((n._$targets.length && m) || (!n._origOrder.length && n._$targets.length)) {
                n._origOrder = [];
                for (var h = 0; h < n._$targets.length; h++) {
                    var k = n._$targets[h];
                    n._origOrder.push(k)
                }
            }
            n._execAction("_refresh", 1, arguments)
        },
        _bindHandlers: function() {
            var c = this,
                e = a.MixItUp.prototype._bound._filter,
                d = a.MixItUp.prototype._bound._sort;
            c._execAction("_bindHandlers", 0);
            if (c.controls.live) {
                c._$body.on("click.mixItUp." + c._id, c.selectors.sort, function() {
                    c._processClick(a(this), "sort")
                }).on("click.mixItUp." + c._id, c.selectors.filter, function() {
                    c._processClick(a(this), "filter")
                })
            } else {
                c._$sortButtons = a(c.selectors.sort);
                c._$filterButtons = a(c.selectors.filter);
                c._$sortButtons.on("click.mixItUp." + c._id, function() {
                    c._processClick(a(this), "sort")
                });
                c._$filterButtons.on("click.mixItUp." + c._id, function() {
                    c._processClick(a(this), "filter")
                })
            }
            e[c.selectors.filter] = (e[c.selectors.filter] === b) ? 1 : e[c.selectors.filter] + 1;
            d[c.selectors.sort] = (d[c.selectors.sort] === b) ? 1 : d[c.selectors.sort] + 1;
            c._execAction("_bindHandlers", 1)
        },
        _processClick: function(j, i) {
            var e = this,
                d = function(m, k, n) {
                    var l = a.MixItUp.prototype;
                    l._handled["_" + k][e.selectors[k]] = (l._handled["_" + k][e.selectors[k]] === b) ? 1 : l._handled["_" + k][e.selectors[k]] + 1;
                    if (l._handled["_" + k][e.selectors[k]] === l._bound["_" + k][e.selectors[k]]) {
                        m[(n ? "remove" : "add") + "Class"](e.controls.activeClass);
                        delete l._handled["_" + k][e.selectors[k]]
                    }
                };
            e._execAction("_processClick", 0, arguments);
            if (!e._mixing || (e.animation.queue && e._queue.length < e.animation.queueLimit)) {
                e._clicking = true;
                if (i === "sort") {
                    var g = j.attr("data-sort");
                    if (!j.hasClass(e.controls.activeClass) || g.indexOf("random") > -1) {
                        a(e.selectors.sort).removeClass(e.controls.activeClass);
                        d(j, i);
                        e.sort(g)
                    }
                }
                if (i === "filter") {
                    var h = j.attr("data-filter"),
                        c, f = e.controls.toggleLogic === "or" ? "," : "";
                    if (!e.controls.toggleFilterButtons) {
                        if (!j.hasClass(e.controls.activeClass)) {
                            a(e.selectors.filter).removeClass(e.controls.activeClass);
                            d(j, i);
                            e.filter(h)
                        }
                    } else {
                        e._buildToggleArray();
                        if (!j.hasClass(e.controls.activeClass)) {
                            d(j, i);
                            e._toggleArray.push(h)
                        } else {
                            d(j, i, true);
                            c = e._toggleArray.indexOf(h);
                            e._toggleArray.splice(c, 1)
                        }
                        e._toggleArray = a.grep(e._toggleArray, function(k) {
                            return (k)
                        });
                        e._toggleString = e._toggleArray.join(f);
                        e.filter(e._toggleString)
                    }
                }
                e._execAction("_processClick", 1, arguments)
            } else {
                if (typeof e.callbacks.onMixBusy === "function") {
                    e.callbacks.onMixBusy.call(e._domNode, e._state, e)
                }
                e._execAction("_processClickBusy", 1, arguments)
            }
        },
        _buildToggleArray: function() {
            var c = this,
                f = c._activeFilter.replace(/\s/g, "");
            c._execAction("_buildToggleArray", 0, arguments);
            if (c.controls.toggleLogic === "or") {
                c._toggleArray = f.split(",")
            } else {
                c._toggleArray = f.split(".");
                !c._toggleArray[0] && c._toggleArray.shift();
                for (var d = 0, e; e = c._toggleArray[d]; d++) {
                    c._toggleArray[d] = "." + e
                }
            }
            c._execAction("_buildToggleArray", 1, arguments)
        },
        _updateControls: function(j, h) {
            var d = this,
                c = {
                    filter: j.filter,
                    sort: j.sort
                },
                k = function(i, l) {
                    try {
                        (h && g === "filter" && !(c.filter === "none" || c.filter === "")) ? i.filter(l).addClass(d.controls.activeClass): i.removeClass(d.controls.activeClass).filter(l).addClass(d.controls.activeClass)
                    } catch (m) {}
                },
                g = "filter",
                f = null;
            d._execAction("_updateControls", 0, arguments);
            (j.filter === b) && (c.filter = d._activeFilter);
            (j.sort === b) && (c.sort = d._activeSort);
            (c.filter === d.selectors.target) && (c.filter = "all");
            for (var e = 0; e < 2; e++) {
                f = d.controls.live ? a(d.selectors[g]) : d["_$" + g + "Buttons"];
                f && k(f, "[data-" + g + '="' + c[g] + '"]');
                g = "sort"
            }
            d._execAction("_updateControls", 1, arguments)
        },
        _filter: function() {
            var d = this;
            d._execAction("_filter", 0);
            for (var e = 0; e < d._$targets.length; e++) {
                var c = a(d._$targets[e]);
                if (c.is(d._activeFilter)) {
                    d._$show = d._$show.add(c)
                } else {
                    d._$hide = d._$hide.add(c)
                }
            }
            d._execAction("_filter", 1)
        },
        _sort: function() {
            var c = this,
                e = function(l) {
                    var h = l.slice(),
                        g = h.length,
                        k = g;
                    while (k--) {
                        var m = parseInt(Math.random() * g);
                        var j = h[k];
                        h[k] = h[m];
                        h[m] = j
                    }
                    return h
                };
            c._execAction("_sort", 0);
            c._startOrder = [];
            for (var d = 0; d < c._$targets.length; d++) {
                var f = c._$targets[d];
                c._startOrder.push(f)
            }
            switch (c._newSort[0].sortBy) {
                case "default":
                    c._newOrder = c._origOrder;
                    break;
                case "random":
                    c._newOrder = e(c._startOrder);
                    break;
                case "custom":
                    c._newOrder = c._newSort[0].order;
                    break;
                default:
                    c._newOrder = c._startOrder.concat().sort(function(h, g) {
                        return c._compare(h, g)
                    })
            }
            c._execAction("_sort", 1)
        },
        _compare: function(f, e, j) {
            j = j ? j : 0;
            var g = this,
                d = g._newSort[j].order,
                c = function(k) {
                    return k.dataset[g._newSort[j].sortBy] || 0
                },
                i = isNaN(c(f) * 1) ? c(f).toLowerCase() : c(f) * 1,
                h = isNaN(c(e) * 1) ? c(e).toLowerCase() : c(e) * 1;
            if (i < h) {
                return d === "asc" ? -1 : 1
            }
            if (i > h) {
                return d === "asc" ? 1 : -1
            }
            if (i === h && g._newSort.length > j + 1) {
                return g._compare(f, e, j + 1)
            }
            return 0
        },
        _printSort: function(g) {
            var n = this,
                d = g ? n._startOrder : n._newOrder,
                h = n._$parent[0].querySelectorAll(n.selectors.target),
                e = h.length ? h[h.length - 1].nextElementSibling : null,
                m = document.createDocumentFragment();
            n._execAction("_printSort", 0, arguments);
            for (var f = 0; f < h.length; f++) {
                var j = h[f],
                    l = j.nextSibling;
                if (j.style.position === "absolute") {
                    continue
                }
                if (l && l.nodeName === "#text") {
                    n._$parent[0].removeChild(l)
                }
                n._$parent[0].removeChild(j)
            }
            for (var f = 0; f < d.length; f++) {
                var c = d[f];
                if (n._newSort[0].sortBy === "default" && n._newSort[0].order === "desc" && !g) {
                    var k = m.firstChild;
                    m.insertBefore(c, k);
                    m.insertBefore(document.createTextNode(" "), c)
                } else {
                    m.appendChild(c);
                    m.appendChild(document.createTextNode(" "))
                }
            }
            e ? n._$parent[0].insertBefore(m, e) : n._$parent[0].appendChild(m);
            n._execAction("_printSort", 1, arguments)
        },
        _parseSort: function(g) {
            var d = this,
                j = typeof g === "string" ? g.split(" ") : [g],
                c = [];
            for (var e = 0; e < j.length; e++) {
                var h = typeof g === "string" ? j[e].split(":") : ["custom", j[e]],
                    f = {
                        sortBy: d._helpers._camelCase(h[0]),
                        order: h[1] || "asc"
                    };
                c.push(f);
                if (f.sortBy === "default" || f.sortBy === "random") {
                    break
                }
            }
            return d._execFilter("_parseSort", c, arguments)
        },
        _parseEffects: function() {
            var d = this,
                e = {
                    opacity: "",
                    transformIn: "",
                    transformOut: "",
                    filter: ""
                },
                g = function(k, l, i) {
                    if (d.animation.effects.indexOf(k) > -1) {
                        if (l) {
                            var j = d.animation.effects.indexOf(k + "(");
                            if (j > -1) {
                                var n = d.animation.effects.substring(j),
                                    h = /\(([^)]+)\)/.exec(n),
                                    m = h[1];
                                return {
                                    val: m
                                }
                            }
                        }
                        return true
                    } else {
                        return false
                    }
                },
                f = function(h, i) {
                    if (i) {
                        return h.charAt(0) === "-" ? h.substr(1, h.length) : "-" + h
                    } else {
                        return h
                    }
                },
                c = function(k, n) {
                    var l = [
                        ["scale", ".01"],
                        ["translateX", "20px"],
                        ["translateY", "20px"],
                        ["translateZ", "20px"],
                        ["rotateX", "90deg"],
                        ["rotateY", "90deg"],
                        ["rotateZ", "180deg"]
                    ];
                    for (var j = 0; j < l.length; j++) {
                        var o = l[j][0],
                            m = l[j][1],
                            h = n && o !== "scale";
                        e[k] += g(o) ? o + "(" + f(g(o, true).val || m, h) + ") " : ""
                    }
                };
            e.opacity = g("fade") ? g("fade", true).val || "0" : "1";
            c("transformIn");
            d.animation.reverseOut ? c("transformOut", true) : (e.transformOut = e.transformIn);
            e.transition = {};
            e.transition = d._getPrefixedCSS("transition", "all " + d.animation.duration + "ms " + d.animation.easing + ", opacity " + d.animation.duration + "ms linear");
            d.animation.stagger = g("stagger") ? true : false;
            d.animation.staggerDuration = parseInt(g("stagger") ? (g("stagger", true).val ? g("stagger", true).val : 100) : 100);
            return d._execFilter("_parseEffects", e)
        },
        _buildState: function(c) {
            var d = this,
                e = {};
            d._execAction("_buildState", 0);
            e = {
                activeFilter: d._activeFilter === "" ? "none" : d._activeFilter,
                activeSort: c && d._newSortString ? d._newSortString : d._activeSort,
                fail: !d._$show.length && d._activeFilter !== "",
                $targets: d._$targets,
                $show: d._$show,
                $hide: d._$hide,
                totalTargets: d._$targets.length,
                totalShow: d._$show.length,
                totalHide: d._$hide.length,
                display: c && d._newDisplay ? d._newDisplay : d.layout.display
            };
            if (c) {
                return d._execFilter("_buildState", e)
            } else {
                d._state = e;
                d._execAction("_buildState", 1)
            }
        },
        _goMix: function(g) {
            var f = this,
                h = function() {
                    if (f._chrome && (f._chrome === 31)) {
                        d(f._$parent[0])
                    }
                    f._setInter();
                    e()
                },
                e = function() {
                    var k = window.pageYOffset,
                        l = window.pageXOffset,
                        j = document.documentElement.scrollHeight;
                    f._getInterMixData();
                    f._setFinal();
                    f._getFinalMixData();
                    (window.pageYOffset !== k) && window.scrollTo(l, k);
                    f._prepTargets();
                    if (window.requestAnimationFrame) {
                        requestAnimationFrame(c)
                    } else {
                        setTimeout(function() {
                            c()
                        }, 20)
                    }
                },
                c = function() {
                    f._animateTargets();
                    if (f._targetsBound === 0) {
                        f._cleanUp()
                    }
                },
                d = function(j) {
                    var k = j.parentElement,
                        l = document.createElement("div"),
                        m = document.createDocumentFragment();
                    k.insertBefore(l, j);
                    m.appendChild(j);
                    k.replaceChild(j, l)
                },
                i = f._buildState(true);
            f._execAction("_goMix", 0, arguments);
            !f.animation.duration && (g = false);
            f._mixing = true;
            f._$container.removeClass(f.layout.containerClassFail);
            if (typeof f.callbacks.onMixStart === "function") {
                f.callbacks.onMixStart.call(f._domNode, f._state, i, f)
            }
            f._$container.trigger("mixStart", [f._state, i, f]);
            f._getOrigMixData();
            if (g && !f._suckMode) {
                window.requestAnimationFrame ? requestAnimationFrame(h) : h()
            } else {
                f._cleanUp()
            }
            f._execAction("_goMix", 1, arguments)
        },
        _getTargetData: function(f, d) {
            var c = this,
                e;
            f.dataset[d + "PosX"] = f.offsetLeft;
            f.dataset[d + "PosY"] = f.offsetTop;
            if (c.animation.animateResizeTargets) {
                e = !c._suckMode ? window.getComputedStyle(f) : {
                    marginBottom: "",
                    marginRight: ""
                };
                f.dataset[d + "MarginBottom"] = parseInt(e.marginBottom);
                f.dataset[d + "MarginRight"] = parseInt(e.marginRight);
                f.dataset[d + "Width"] = f.offsetWidth;
                f.dataset[d + "Height"] = f.offsetHeight
            }
        },
        _getOrigMixData: function() {
            var d = this,
                g = !d._suckMode ? window.getComputedStyle(d._$parent[0]) : {
                    boxSizing: ""
                },
                c = g.boxSizing || g[d._vendor + "BoxSizing"];
            d._incPadding = (c === "border-box");
            d._execAction("_getOrigMixData", 0);
            !d._suckMode && (d.effects = d._parseEffects());
            d._$toHide = d._$hide.filter(":visible");
            d._$toShow = d._$show.filter(":hidden");
            d._$pre = d._$targets.filter(":visible");
            d._startHeight = d._incPadding ? d._$parent.outerHeight() : d._$parent.height();
            for (var e = 0; e < d._$pre.length; e++) {
                var f = d._$pre[e];
                d._getTargetData(f, "orig")
            }
            d._execAction("_getOrigMixData", 1)
        },
        _setInter: function() {
            var c = this;
            c._execAction("_setInter", 0);
            if (c._changingLayout && c.animation.animateChangeLayout) {
                c._$toShow.css("display", c._newDisplay);
                if (c._changingClass) {
                    c._$container.removeClass(c.layout.containerClass).addClass(c._newClass)
                }
            } else {
                c._$toShow.css("display", c.layout.display)
            }
            c._execAction("_setInter", 1)
        },
        _getInterMixData: function() {
            var c = this;
            c._execAction("_getInterMixData", 0);
            for (var d = 0; d < c._$toShow.length; d++) {
                var e = c._$toShow[d];
                c._getTargetData(e, "inter")
            }
            for (var d = 0; d < c._$pre.length; d++) {
                var e = c._$pre[d];
                c._getTargetData(e, "inter")
            }
            c._execAction("_getInterMixData", 1)
        },
        _setFinal: function() {
            var c = this;
            c._execAction("_setFinal", 0);
            c._sorting && c._printSort();
            c._$toHide.removeStyle("display");
            if (c._changingLayout && c.animation.animateChangeLayout) {
                c._$pre.css("display", c._newDisplay)
            }
            c._execAction("_setFinal", 1)
        },
        _getFinalMixData: function() {
            var c = this;
            c._execAction("_getFinalMixData", 0);
            for (var d = 0; d < c._$toShow.length; d++) {
                var e = c._$toShow[d];
                c._getTargetData(e, "final")
            }
            for (var d = 0; d < c._$pre.length; d++) {
                var e = c._$pre[d];
                c._getTargetData(e, "final")
            }
            c._newHeight = c._incPadding ? c._$parent.outerHeight() : c._$parent.height();
            c._sorting && c._printSort(true);
            c._$toShow.removeStyle("display");
            c._$pre.css("display", c.layout.display);
            if (c._changingClass && c.animation.animateChangeLayout) {
                c._$container.removeClass(c._newClass).addClass(c.layout.containerClass)
            }
            c._execAction("_getFinalMixData", 1)
        },
        _prepTargets: function() {
            var c = this,
                d = {
                    _in: c._getPrefixedCSS("transform", c.effects.transformIn),
                    _out: c._getPrefixedCSS("transform", c.effects.transformOut)
                };
            c._execAction("_prepTargets", 0);
            if (c.animation.animateResizeContainer) {
                c._$parent.css("height", c._startHeight + "px")
            }
            for (var f = 0; f < c._$toShow.length; f++) {
                var g = c._$toShow[f],
                    e = a(g);
                g.style.opacity = c.effects.opacity;
                g.style.display = (c._changingLayout && c.animation.animateChangeLayout) ? c._newDisplay : c.layout.display;
                e.css(d._in);
                if (c.animation.animateResizeTargets) {
                    g.style.width = g.dataset.finalWidth + "px";
                    g.style.height = g.dataset.finalHeight + "px";
                    g.style.marginRight = -(g.dataset.finalWidth - g.dataset.interWidth) + (g.dataset.finalMarginRight * 1) + "px";
                    g.style.marginBottom = -(g.dataset.finalHeight - g.dataset.interHeight) + (g.dataset.finalMarginBottom * 1) + "px"
                }
            }
            for (var f = 0; f < c._$pre.length; f++) {
                var g = c._$pre[f],
                    e = a(g),
                    h = {
                        x: g.dataset.origPosX - g.dataset.interPosX,
                        y: g.dataset.origPosY - g.dataset.interPosY
                    },
                    d = c._getPrefixedCSS("transform", "translate(" + h.x + "px," + h.y + "px)");
                e.css(d);
                if (c.animation.animateResizeTargets) {
                    g.style.width = g.dataset.origWidth + "px";
                    g.style.height = g.dataset.origHeight + "px";
                    if (g.dataset.origWidth - g.dataset.finalWidth) {
                        g.style.marginRight = -(g.dataset.origWidth - g.dataset.interWidth) + (g.dataset.origMarginRight * 1) + "px"
                    }
                    if (g.dataset.origHeight - g.dataset.finalHeight) {
                        g.style.marginBottom = -(g.dataset.origHeight - g.dataset.interHeight) + (g.dataset.origMarginBottom * 1) + "px"
                    }
                }
            }
            c._execAction("_prepTargets", 1)
        },
        _animateTargets: function() {
            var m = this;
            m._execAction("_animateTargets", 0);
            m._targetsDone = 0;
            m._targetsBound = 0;
            m._$parent.css(m._getPrefixedCSS("perspective", m.animation.perspectiveDistance + "px")).css(m._getPrefixedCSS("perspective-origin", m.animation.perspectiveOrigin));
            if (m.animation.animateResizeContainer) {
                m._$parent.css(m._getPrefixedCSS("transition", "height " + m.animation.duration + "ms ease")).css("height", m._newHeight + "px")
            }
            for (var f = 0; f < m._$toShow.length; f++) {
                var c = m._$toShow[f],
                    n = a(c),
                    d = {
                        x: c.dataset.finalPosX - c.dataset.interPosX,
                        y: c.dataset.finalPosY - c.dataset.interPosY
                    },
                    g = m._getDelay(f),
                    k = {};
                c.style.opacity = "";
                for (var e = 0; e < 2; e++) {
                    var l = e === 0 ? l = m._prefix : "";
                    if (m._ff && m._ff <= 20) {
                        k[l + "transition-property"] = "all";
                        k[l + "transition-timing-function"] = m.animation.easing + "ms";
                        k[l + "transition-duration"] = m.animation.duration + "ms"
                    }
                    k[l + "transition-delay"] = g + "ms";
                    k[l + "transform"] = "translate(" + d.x + "px," + d.y + "px)"
                }
                if (m.effects.transform || m.effects.opacity) {
                    m._bindTargetDone(n)
                }(m._ff && m._ff <= 20) ? n.css(k): n.css(m.effects.transition).css(k)
            }
            for (var f = 0; f < m._$pre.length; f++) {
                var c = m._$pre[f],
                    n = a(c),
                    d = {
                        x: c.dataset.finalPosX - c.dataset.interPosX,
                        y: c.dataset.finalPosY - c.dataset.interPosY
                    },
                    g = m._getDelay(f);
                if (!(c.dataset.finalPosX === c.dataset.origPosX && c.dataset.finalPosY === c.dataset.origPosY)) {
                    m._bindTargetDone(n)
                }
                n.css(m._getPrefixedCSS("transition", "all " + m.animation.duration + "ms " + m.animation.easing + " " + g + "ms"));
                n.css(m._getPrefixedCSS("transform", "translate(" + d.x + "px," + d.y + "px)"));
                if (m.animation.animateResizeTargets) {
                    if (c.dataset.origWidth - c.dataset.finalWidth && c.dataset.finalWidth * 1) {
                        c.style.width = c.dataset.finalWidth + "px";
                        c.style.marginRight = -(c.dataset.finalWidth - c.dataset.interWidth) + (c.dataset.finalMarginRight * 1) + "px"
                    }
                    if (c.dataset.origHeight - c.dataset.finalHeight && c.dataset.finalHeight * 1) {
                        c.style.height = c.dataset.finalHeight + "px";
                        c.style.marginBottom = -(c.dataset.finalHeight - c.dataset.interHeight) + (c.dataset.finalMarginBottom * 1) + "px"
                    }
                }
            }
            if (m._changingClass) {
                m._$container.removeClass(m.layout.containerClass).addClass(m._newClass)
            }
            for (var f = 0; f < m._$toHide.length; f++) {
                var c = m._$toHide[f],
                    n = a(c),
                    g = m._getDelay(f),
                    h = {};
                for (var e = 0; e < 2; e++) {
                    var l = e === 0 ? l = m._prefix : "";
                    h[l + "transition-delay"] = g + "ms";
                    h[l + "transform"] = m.effects.transformOut;
                    h.opacity = m.effects.opacity
                }
                n.css(m.effects.transition).css(h);
                if (m.effects.transform || m.effects.opacity) {
                    m._bindTargetDone(n)
                }
            }
            m._execAction("_animateTargets", 1)
        },
        _bindTargetDone: function(d) {
            var c = this,
                e = d[0];
            c._execAction("_bindTargetDone", 0, arguments);
            if (!e.dataset.bound) {
                e.dataset.bound = true;
                c._targetsBound++;
                d.on("webkitTransitionEnd.mixItUp transitionend.mixItUp", function(f) {
                    if ((f.originalEvent.propertyName.indexOf("transform") > -1 || f.originalEvent.propertyName.indexOf("opacity") > -1) && a(f.originalEvent.target).is(c.selectors.target)) {
                        d.off(".mixItUp");
                        e.dataset.bound = "";
                        c._targetDone()
                    }
                })
            }
            c._execAction("_bindTargetDone", 1, arguments)
        },
        _targetDone: function() {
            var c = this;
            c._execAction("_targetDone", 0);
            c._targetsDone++;
            (c._targetsDone === c._targetsBound) && c._cleanUp();
            c._execAction("_targetDone", 1)
        },
        _cleanUp: function() {
            var d = this,
                e = d.animation.animateResizeTargets ? "transform opacity width height margin-bottom margin-right" : "transform opacity",
                c = function() {
                    d._$targets.removeStyle("transition", d._prefix)
                };
            d._execAction("_cleanUp", 0);
            !d._changingLayout ? d._$show.css("display", d.layout.display) : d._$show.css("display", d._newDisplay);
            d._$targets.css(d._brake);
            d._$targets.removeStyle(e, d._prefix).removeAttr("data-inter-pos-x data-inter-pos-y data-final-pos-x data-final-pos-y data-orig-pos-x data-orig-pos-y data-orig-height data-orig-width data-final-height data-final-width data-inter-width data-inter-height data-orig-margin-right data-orig-margin-bottom data-inter-margin-right data-inter-margin-bottom data-final-margin-right data-final-margin-bottom");
            d._$hide.removeStyle("display");
            d._$parent.removeStyle("height transition perspective-distance perspective perspective-origin-x perspective-origin-y perspective-origin perspectiveOrigin", d._prefix);
            if (d._sorting) {
                d._printSort();
                d._activeSort = d._newSortString;
                d._sorting = false
            }
            if (d._changingLayout) {
                if (d._changingDisplay) {
                    d.layout.display = d._newDisplay;
                    d._changingDisplay = false
                }
                if (d._changingClass) {
                    d._$parent.removeClass(d.layout.containerClass).addClass(d._newClass);
                    d.layout.containerClass = d._newClass;
                    d._changingClass = false
                }
                d._changingLayout = false
            }
            d._refresh();
            d._buildState();
            if (d._state.fail) {
                d._$container.addClass(d.layout.containerClassFail)
            }
            d._$show = a();
            d._$hide = a();
            if (window.requestAnimationFrame) {
                requestAnimationFrame(c)
            }
            d._mixing = false;
            if (typeof d.callbacks._user === "function") {
                d.callbacks._user.call(d._domNode, d._state, d)
            }
            if (typeof d.callbacks.onMixEnd === "function") {
                d.callbacks.onMixEnd.call(d._domNode, d._state, d)
            }
            d._$container.trigger("mixEnd", [d._state, d]);
            if (d._state.fail) {
                (typeof d.callbacks.onMixFail === "function") && d.callbacks.onMixFail.call(d._domNode, d._state, d);
                d._$container.trigger("mixFail", [d._state, d])
            }
            if (d._loading) {
                (typeof d.callbacks.onMixLoad === "function") && d.callbacks.onMixLoad.call(d._domNode, d._state, d);
                d._$container.trigger("mixLoad", [d._state, d])
            }
            if (d._queue.length) {
                d._execAction("_queue", 0);
                d.multiMix(d._queue[0][0], d._queue[0][1], d._queue[0][2]);
                d._queue.splice(0, 1)
            }
            d._execAction("_cleanUp", 1);
            d._loading = false
        },
        _getPrefixedCSS: function(j, h, c) {
            var d = this,
                f = {},
                g = "",
                e = -1;
            for (e = 0; e < 2; e++) {
                g = e === 0 ? d._prefix : "";
                c ? f[g + j] = g + h : f[g + j] = h
            }
            return d._execFilter("_getPrefixedCSS", f, arguments)
        },
        _getDelay: function(e) {
            var c = this,
                f = typeof c.animation.staggerSequence === "function" ? c.animation.staggerSequence.call(c._domNode, e, c._state) : e,
                d = c.animation.stagger ? f * c.animation.staggerDuration : 0;
            return c._execFilter("_getDelay", d, arguments)
        },
        _parseMultiMixArgs: function(f) {
            var e = this,
                d = {
                    command: null,
                    animate: e.animation.enable,
                    callback: null
                };
            for (var g = 0; g < f.length; g++) {
                var c = f[g];
                if (c !== null) {
                    if (typeof c === "object" || typeof c === "string") {
                        d.command = c
                    } else {
                        if (typeof c === "boolean") {
                            d.animate = c
                        } else {
                            if (typeof c === "function") {
                                d.callback = c
                            }
                        }
                    }
                }
            }
            return e._execFilter("_parseMultiMixArgs", d, arguments)
        },
        _parseInsertArgs: function(f) {
            var e = this,
                d = {
                    index: 0,
                    $object: a(),
                    multiMix: {
                        filter: e._state.activeFilter
                    },
                    callback: null
                };
            for (var g = 0; g < f.length; g++) {
                var c = f[g];
                if (typeof c === "number") {
                    d.index = c
                } else {
                    if (typeof c === "object" && c instanceof a) {
                        d.$object = c
                    } else {
                        if (typeof c === "object" && e._helpers._isElement(c)) {
                            d.$object = a(c)
                        } else {
                            if (typeof c === "object" && c !== null) {
                                d.multiMix = c
                            } else {
                                if (typeof c === "boolean" && !c) {
                                    d.multiMix = false
                                } else {
                                    if (typeof c === "function") {
                                        d.callback = c
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return e._execFilter("_parseInsertArgs", d, arguments)
        },
        _execAction: function(d, h, e) {
            var c = this,
                g = h ? "post" : "pre";
            if (!c._actions.isEmptyObject && c._actions.hasOwnProperty(d)) {
                for (var f in c._actions[d][g]) {
                    c._actions[d][g][f].call(c, e)
                }
            }
        },
        _execFilter: function(d, g, e) {
            var c = this;
            if (!c._filters.isEmptyObject && c._filters.hasOwnProperty(d)) {
                for (var f in c._filters[d]) {
                    return c._filters[d][f].call(c, e)
                }
            } else {
                return g
            }
        },
        _helpers: {
            _camelCase: function(c) {
                return c.replace(/-([a-z])/g, function(d) {
                    return d[1].toUpperCase()
                })
            },
            _isElement: function(c) {
                if (window.HTMLElement) {
                    return c instanceof HTMLElement
                } else {
                    return (c !== null && c.nodeType === 1 && c.nodeName === "string")
                }
            }
        },
        isMixing: function() {
            var c = this;
            return c._execFilter("isMixing", c._mixing)
        },
        filter: function() {
            var c = this,
                d = c._parseMultiMixArgs(arguments);
            c._clicking && (c._toggleString = "");
            c.multiMix({
                filter: d.command
            }, d.animate, d.callback)
        },
        sort: function() {
            var c = this,
                d = c._parseMultiMixArgs(arguments);
            c.multiMix({
                sort: d.command
            }, d.animate, d.callback)
        },
        changeLayout: function() {
            var c = this,
                d = c._parseMultiMixArgs(arguments);
            c.multiMix({
                changeLayout: d.command
            }, d.animate, d.callback)
        },
        multiMix: function() {
            var c = this,
                d = c._parseMultiMixArgs(arguments);
            c._execAction("multiMix", 0, arguments);
            if (!c._mixing) {
                if (c.controls.enable && !c._clicking) {
                    c.controls.toggleFilterButtons && c._buildToggleArray();
                    c._updateControls(d.command, c.controls.toggleFilterButtons)
                }(c._queue.length < 2) && (c._clicking = false);
                delete c.callbacks._user;
                if (d.callback) {
                    c.callbacks._user = d.callback
                }
                var e = d.command.sort,
                    f = d.command.filter,
                    g = d.command.changeLayout;
                c._refresh();
                if (e) {
                    c._newSort = c._parseSort(e);
                    c._newSortString = e;
                    c._sorting = true;
                    c._sort()
                }
                if (f !== b) {
                    f = (f === "all") ? c.selectors.target : f;
                    c._activeFilter = f
                }
                c._filter();
                if (g) {
                    c._newDisplay = (typeof g === "string") ? g : g.display || c.layout.display;
                    c._newClass = g.containerClass || "";
                    if (c._newDisplay !== c.layout.display || c._newClass !== c.layout.containerClass) {
                        c._changingLayout = true;
                        c._changingClass = (c._newClass !== c.layout.containerClass);
                        c._changingDisplay = (c._newDisplay !== c.layout.display)
                    }
                }
                c._$targets.css(c._brake);
                c._goMix(d.animate ^ c.animation.enable ? d.animate : c.animation.enable);
                c._execAction("multiMix", 1, arguments)
            } else {
                if (c.animation.queue && c._queue.length < c.animation.queueLimit) {
                    c._queue.push(arguments);
                    (c.controls.enable && !c._clicking) && c._updateControls(d.command);
                    c._execAction("multiMixQueue", 1, arguments)
                } else {
                    if (typeof c.callbacks.onMixBusy === "function") {
                        c.callbacks.onMixBusy.call(c._domNode, c._state, c)
                    }
                    c._$container.trigger("mixBusy", [c._state, c]);
                    c._execAction("multiMixBusy", 1, arguments)
                }
            }
        },
        insert: function() {
            var c = this,
                d = c._parseInsertArgs(arguments),
                j = (typeof d.callback === "function") ? d.callback : null,
                h = document.createDocumentFragment(),
                g = (function() {
                    c._refresh();
                    if (c._$targets.length) {
                        return (d.index < c._$targets.length || !c._$targets.length) ? c._$targets[d.index] : c._$targets[c._$targets.length - 1].nextElementSibling
                    } else {
                        return c._$parent[0].children[0]
                    }
                })();
            c._execAction("insert", 0, arguments);
            if (d.$object) {
                for (var e = 0; e < d.$object.length; e++) {
                    var f = d.$object[e];
                    h.appendChild(f);
                    h.appendChild(document.createTextNode(" "))
                }
                c._$parent[0].insertBefore(h, g)
            }
            c._execAction("insert", 1, arguments);
            if (typeof d.multiMix === "object") {
                c.multiMix(d.multiMix, j)
            }
        },
        prepend: function() {
            var c = this,
                d = c._parseInsertArgs(arguments);
            c.insert(0, d.$object, d.multiMix, d.callback)
        },
        append: function() {
            var c = this,
                d = c._parseInsertArgs(arguments);
            c.insert(c._state.totalTargets, d.$object, d.multiMix, d.callback)
        },
        getOption: function(e) {
            var d = this,
                c = function(m, n) {
                    var k = n.split("."),
                        h = k.pop(),
                        f = k.length,
                        g = 1,
                        j = k[0] || n;
                    while ((m = m[j]) && g < f) {
                        j = k[g];
                        g++
                    }
                    if (m !== b) {
                        return m[h] !== b ? m[h] : m
                    }
                };
            return e ? d._execFilter("getOption", c(d, e), arguments) : d
        },
        setOptions: function(d) {
            var c = this;
            c._execAction("setOptions", 0, arguments);
            typeof d === "object" && a.extend(true, c, d);
            c._execAction("setOptions", 1, arguments)
        },
        getState: function() {
            var c = this;
            return c._execFilter("getState", c._state, c)
        },
        forceRefresh: function() {
            var c = this;
            c._refresh(false, true)
        },
        destroy: function(e) {
            var c = this,
                g = a.MixItUp.prototype._bound._filter,
                f = a.MixItUp.prototype._bound._sort;
            c._execAction("destroy", 0, arguments);
            c._$body.add(a(c.selectors.sort)).add(a(c.selectors.filter)).off(".mixItUp");
            for (var d = 0; d < c._$targets.length; d++) {
                var h = c._$targets[d];
                e && (h.style.display = "");
                delete h.mixParent
            }
            c._execAction("destroy", 1, arguments);
            if (g[c.selectors.filter] && g[c.selectors.filter] > 1) {
                g[c.selectors.filter]--
            } else {
                if (g[c.selectors.filter] === 1) {
                    delete g[c.selectors.filter]
                }
            }
            if (f[c.selectors.sort] && f[c.selectors.sort] > 1) {
                f[c.selectors.sort]--
            } else {
                if (f[c.selectors.sort] === 1) {
                    delete f[c.selectors.sort]
                }
            }
            delete a.MixItUp.prototype._instances[c._id]
        }
    };
    a.fn.mixItUp = function() {
        var d = arguments,
            e = [],
            c, f = function(j, i) {
                var g = new a.MixItUp(),
                    h = function() {
                        return ("00000" + (Math.random() * 16777216 << 0).toString(16)).substr(-6).toUpperCase()
                    };
                g._execAction("_instantiate", 0, arguments);
                j.id = !j.id ? "MixItUp" + h() : j.id;
                if (!g._instances[j.id]) {
                    g._instances[j.id] = g;
                    g._init(j, i)
                }
                g._execAction("_instantiate", 1, arguments)
            };
        c = this.each(function() {
            if (d && typeof d[0] === "string") {
                var g = a.MixItUp.prototype._instances[this.id];
                if (d[0] === "isLoaded") {
                    e.push(g ? true : false)
                } else {
                    var h = g[d[0]](d[1], d[2], d[3]);
                    if (h !== b) {
                        e.push(h)
                    }
                }
            } else {
                f(this, d[0])
            }
        });
        if (e.length) {
            return e.length > 1 ? e : e[0]
        } else {
            return c
        }
    };
    a.fn.removeStyle = function(c, d) {
        d = d ? d : "";
        return this.each(function() {
            var g = this,
                h = c.split(" ");
            for (var f = 0; f < h.length; f++) {
                for (var e = 0; e < 4; e++) {
                    switch (e) {
                        case 0:
                            var k = h[f];
                            break;
                        case 1:
                            var k = a.MixItUp.prototype._helpers._camelCase(k);
                            break;
                        case 2:
                            var k = d + h[f];
                            break;
                        case 3:
                            var k = a.MixItUp.prototype._helpers._camelCase(d + h[f])
                    }
                    if (g.style[k] !== b && typeof g.style[k] !== "unknown" && g.style[k].length > 0) {
                        g.style[k] = ""
                    }
                    if (!d && e === 1) {
                        break
                    }
                }
            }
            if (g.attributes && g.attributes.style && g.attributes.style !== b && g.attributes.style.value === "") {
                g.attributes.removeNamedItem("style")
            }
        })
    }
})(jQuery);