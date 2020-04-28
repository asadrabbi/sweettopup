var KTUtil = function() {

    var resizeHandlers = [];

    /** @type {object} breakpoints The device width breakpoints **/
    var breakpoints = {
        sm: 544, // Small screen / phone           
        md: 768, // Medium screen / tablet            
        lg: 1024, // Large screen / desktop        
        xl: 1200 // Extra large screen / wide desktop
    };

    /**
     * Handle window resize event with some 
     * delay to attach event handlers upon resize complete 
     */
    var _windowResizeHandler = function() {
        var _runResizeHandlers = function() {
            // reinitialize other subscribed elements
            for (var i = 0; i < resizeHandlers.length; i++) {
                var each = resizeHandlers[i];
                each.call();
            }
        };

        var timeout = false; // holder for timeout id
        var delay = 250; // delay after event is "complete" to run callback

        window.addEventListener('resize', function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                _runResizeHandlers();
            }, delay); // wait 50ms until window resize finishes.
        });
    };

    return {
        /**
         * Class main initializer.
         * @param {object} options.
         * @returns null
         */
        //main function to initiate the theme
        init: function(options) {
            if (options && options.breakpoints) {
                breakpoints = options.breakpoints;
            }

            _windowResizeHandler();
        },

        /**
         * Adds window resize event handler.
         * @param {function} callback function.
         */
        addResizeHandler: function(callback) {
            resizeHandlers.push(callback);
        },

        /**
         * Removes window resize event handler.
         * @param {function} callback function.
         */
        removeResizeHandler: function(callback) {
            for (var i = 0; i < resizeHandlers.length; i++) {
                if (callback === resizeHandlers[i]) {
                    delete resizeHandlers[i];
                }
            }
        },

        /**
         * Trigger window resize handlers.
         */
        runResizeHandlers: function() {
            _runResizeHandlers();
        },

        resize: function() {
            if (typeof(Event) === 'function') {
                // modern browsers
                window.dispatchEvent(new Event('resize'));
            } else {
                // for IE and other old browsers
                // causes deprecation warning on modern browsers
                var evt = window.document.createEvent('UIEvents'); 
                evt.initUIEvent('resize', true, false, window, 0); 
                window.dispatchEvent(evt);
            }
        },

        /**
         * Get GET parameter value from URL.
         * @param {string} paramName Parameter name.
         * @returns {string}  
         */
        getURLParam: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }

            return null;
        },

        /**
         * Checks whether current device is mobile touch.
         * @returns {boolean}  
         */
        isMobileDevice: function() {
            return (this.getViewPort().width < this.getBreakpoint('lg') ? true : false);
        },

        /**
         * Checks whether current device is desktop.
         * @returns {boolean}  
         */
        isDesktopDevice: function() {
            return KTUtil.isMobileDevice() ? false : true;
        },

        /**
         * Gets browser window viewport size. Ref:
         * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
         * @returns {object}  
         */
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        /**
         * Checks whether given device mode is currently activated.
         * @param {string} mode Responsive mode name(e.g: desktop,
         *     desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}  
         */
        isInResponsiveRange: function(mode) {
            var breakpoint = this.getViewPort().width;

            if (mode == 'general') {
                return true;
            } else if (mode == 'desktop' && breakpoint >= (this.getBreakpoint('lg') + 1)) {
                return true;
            } else if (mode == 'tablet' && (breakpoint >= (this.getBreakpoint('md') + 1) && breakpoint < this.getBreakpoint('lg'))) {
                return true;
            } else if (mode == 'mobile' && breakpoint <= this.getBreakpoint('md')) {
                return true;
            } else if (mode == 'desktop-and-tablet' && breakpoint >= (this.getBreakpoint('md') + 1)) {
                return true;
            } else if (mode == 'tablet-and-mobile' && breakpoint <= this.getBreakpoint('lg')) {
                return true;
            } else if (mode == 'minimal-desktop-and-below' && breakpoint <= this.getBreakpoint('xl')) {
                return true;
            }

            return false;
        },

        /**
         * Generates unique ID for give prefix.
         * @param {string} prefix Prefix for generated ID
         * @returns {boolean}  
         */
        getUniqueID: function(prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },

        /**
         * Gets window width for give breakpoint mode.
         * @param {string} mode Responsive mode name(e.g: xl, lg, md, sm)
         * @returns {number}  
         */
        getBreakpoint: function(mode) {
            return breakpoints[mode];
        },

        /**
         * Checks whether object has property matchs given key path.
         * @param {object} obj Object contains values paired with given key path
         * @param {string} keys Keys path seperated with dots
         * @returns {object}  
         */
        isset: function(obj, keys) {
            var stone;

            keys = keys || '';

            if (keys.indexOf('[') !== -1) {
                throw new Error('Unsupported object path notation.');
            }

            keys = keys.split('.');

            do {
                if (obj === undefined) {
                    return false;
                }

                stone = keys.shift();

                if (!obj.hasOwnProperty(stone)) {
                    return false;
                }

                obj = obj[stone];

            } while (keys.length);

            return true;
        },

        /**
         * Gets highest z-index of the given element parents
         * @param {object} el jQuery element object
         * @returns {number}  
         */
        getHighestZindex: function(el) {
            var elem = KTUtil.get(el),
                position, value;

            while (elem && elem !== document) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = KTUtil.css(elem, 'position');

                if (position === "absolute" || position === "relative" || position === "fixed") {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt(KTUtil.css(elem, 'z-index'));

                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }

                elem = elem.parentNode;
            }

            return null;
        },

        /**
         * Checks whether the element has any parent with fixed positionfreg
         * @param {object} el jQuery element object
         * @returns {boolean}  
         */
        hasFixedPositionedParent: function(el) {
            while (el && el !== document) {
                position = KTUtil.css(el, 'position');

                if (position === "fixed") {
                    return true;
                }

                el = el.parentNode;
            }

            return false;
        },

        /**
         * Simulates delay
         */
        sleep: function(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        },

        /**
         * Gets randomly generated integer value within given min and max range
         * @param {number} min Range start value
         * @param {number} max Range end value
         * @returns {number}
         */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Checks whether Angular library is included
         * @returns {boolean}  
         */
        isAngularVersion: function() {
            return window.Zone !== undefined ? true : false;
        },

        // jQuery Workarounds

        // Deep extend:  $.extend(true, {}, objA, objB);
        deepExtend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = KTUtil.deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        },

        // extend:  $.extend({}, objA, objB); 
        extend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }

            return out;
        },

        get: function(query) {
            var el;

            if (query === document) {
                return document;
            }

            if (!!(query && query.nodeType === 1)) {
                return query;
            }

            if (el = document.getElementById(query)) {
                return el;
            } else if (el = document.getElementsByTagName(query)) {
                return el[0];
            } else if (el = document.getElementsByClassName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        getByID: function(query) {
            if (!!(query && query.nodeType === 1)) {
                return query;
            }

            return document.getElementById(query);
        },

        getByTag: function(query) {
            var el;
            
            if (el = document.getElementsByTagName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        getByClass: function(query) {
            var el;
            
            if (el = document.getElementsByClassName(query)) {
                return el[0];
            } else {
                return null;
            }
        },

        /**
         * Checks whether the element has given classes
         * @param {object} el jQuery element object
         * @param {string} Classes string
         * @returns {boolean}  
         */
        hasClasses: function(el, classes) {
            if (!el) {
                return;
            }

            var classesArr = classes.split(" ");

            for (var i = 0; i < classesArr.length; i++) {
                if (KTUtil.hasClass(el, KTUtil.trim(classesArr[i])) == false) {
                    return false;
                }
            }

            return true;
        },

        hasClass: function(el, className) {
            if (!el) {
                return;
            }

            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        },

        addClass: function(el, className) {
            if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    if (classNames[i] && classNames[i].length > 0) {
                        el.classList.add(KTUtil.trim(classNames[i]));
                    }
                }
            } else if (!KTUtil.hasClass(el, className)) {
                for (var i = 0; i < classNames.length; i++) {
                    el.className += ' ' + KTUtil.trim(classNames[i]);
                }
            }
        },

        removeClass: function(el, className) {
          if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    el.classList.remove(KTUtil.trim(classNames[i]));
                }
            } else if (KTUtil.hasClass(el, className)) {
                for (var i = 0; i < classNames.length; i++) {
                    el.className = el.className.replace(new RegExp('\\b' + KTUtil.trim(classNames[i]) + '\\b', 'g'), '');
                }
            }
        },

        triggerCustomEvent: function(el, eventName, data) {
            if (window.CustomEvent) {
                var event = new CustomEvent(eventName, {
                    detail: data
                });
            } else {
                var event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }

            el.dispatchEvent(event);
        },

        triggerEvent: function(node, eventName) {
            // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
            var doc;
            if (node.ownerDocument) {
                doc = node.ownerDocument;
            } else if (node.nodeType == 9) {
                // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                doc = node;
            } else {
                throw new Error("Invalid node passed to fireEvent: " + node.id);
            }

            if (node.dispatchEvent) {
                // Gecko-style approach (now the standard) takes more work
                var eventClass = "";

                // Different events have different event classes.
                // If this switch statement can't map an eventName to an eventClass,
                // the event firing is going to fail.
                switch (eventName) {
                case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                case "mouseenter":
                case "mouseleave":
                case "mousedown":
                case "mouseup":
                    eventClass = "MouseEvents";
                    break;

                case "focus":
                case "change":
                case "blur":
                case "select":
                    eventClass = "HTMLEvents";
                    break;

                default:
                    throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                    break;
                }
                var event = doc.createEvent(eventClass);

                var bubbles = eventName == "change" ? false : true;
                event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                event.synthetic = true; // allow detection of synthetic events
                // The second parameter says go ahead with the default action
                node.dispatchEvent(event, true);
            } else if (node.fireEvent) {
                // IE-old school style
                var event = doc.createEventObject();
                event.synthetic = true; // allow detection of synthetic events
                node.fireEvent("on" + eventName, event);
            }
        },

        index: function( elm ){ 
            elm = KTUtil.get(elm);
            var c = elm.parentNode.children, i = 0;
            for(; i < c.length; i++ )
                if( c[i] == elm ) return i;
        },

        trim: function(string) {
            return string.trim();
        },

        eventTriggered: function(e) {
            if (e.currentTarget.dataset.triggered) {
                return true;
            } else {
                e.currentTarget.dataset.triggered = true;

                return false;
            }
        },

        remove: function(el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        },

        find: function(parent, query) {
            parent = KTUtil.get(parent);
            if (parent) {
                return parent.querySelector(query);
            }            
        },

        findAll: function(parent, query) {
            parent = KTUtil.get(parent);
            if (parent) {
                return parent.querySelectorAll(query);
            } 
        },

        insertAfter: function(el, referenceNode) {
            return referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        },

        parents: function(el, query) {
            function collectionHas(a, b) { //helper function (see below)
                for (var i = 0, len = a.length; i < len; i++) {
                    if (a[i] == b) return true;
                }

                return false;
            }

            function findParentBySelector(el, selector) {
                var all = document.querySelectorAll(selector);
                var cur = el.parentNode;

                while (cur && !collectionHas(all, cur)) { //keep going up until you find a match
                    cur = cur.parentNode; //go up
                }

                return cur; //will return null if not found
            }

            return findParentBySelector(el, query);
        },

        children: function(el, selector, log) {
            if (!el || !el.childNodes) {
                return;
            }

            var result = [],
                i = 0,
                l = el.childNodes.length;

            for (var i; i < l; ++i) {
                if (el.childNodes[i].nodeType == 1 && KTUtil.matches(el.childNodes[i], selector, log)) {
                    result.push(el.childNodes[i]);
                }
            }

            return result;
        },

        child: function(el, selector, log) {
            var children = KTUtil.children(el, selector, log);

            return children ? children[0] : null;
        },

        matches: function(el, selector, log) {
            var p = Element.prototype;
            var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

            if (el && el.tagName) {
                return f.call(el, selector);
            } else {
                return false;
            }
        },

        data: function(element) {
            element = KTUtil.get(element);

            return {
                set: function(name, data) {
                    if (element === undefined) {
                        return;
                    }

                    if (element.customDataTag === undefined) {
                        KTUtilElementDataStoreID++;
                        element.customDataTag = KTUtilElementDataStoreID;
                    }

                    if (KTUtilElementDataStore[element.customDataTag] === undefined) {
                        KTUtilElementDataStore[element.customDataTag] = {};
                    }

                    KTUtilElementDataStore[element.customDataTag][name] = data;
                },

                get: function(name) {
                    if (element === undefined) {
                        return;
                    }

                    if (element.customDataTag === undefined) { 
                        return null;
                    }

                    return this.has(name) ? KTUtilElementDataStore[element.customDataTag][name] : null;
                },

                has: function(name) {
                    if (element === undefined) {
                        return false;
                    }
                    
                    if (element.customDataTag === undefined) { 
                        return false;
                    }

                    return (KTUtilElementDataStore[element.customDataTag] && KTUtilElementDataStore[element.customDataTag][name]) ? true : false;
                },

                remove: function(name) {
                    if (element && this.has(name)) {
                        delete KTUtilElementDataStore[element.customDataTag][name];
                    }
                }
            };
        },

        outerWidth: function(el, margin) {
            var width;

            if (margin === true) {
                var width = parseFloat(el.offsetWidth);
                width += parseFloat(KTUtil.css(el, 'margin-left')) + parseFloat(KTUtil.css(el, 'margin-right'));

                return parseFloat(width);
            } else {
                var width = parseFloat(el.offsetWidth);

                return width;
            }
        },

        offset: function(elem) {
            var rect, win;
            elem = KTUtil.get(elem);

            if ( !elem ) {
                return;
            }

            // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
            // Support: IE <=11 only
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error

            if ( !elem.getClientRects().length ) {
                return { top: 0, left: 0 };
            }

            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;

            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        },

        height: function(el) {
            return KTUtil.css(el, 'height');
        },

        visible: function(el) {
            return !(el.offsetWidth === 0 && el.offsetHeight === 0);
        },

        attr: function(el, name, value) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            if (value !== undefined) {
                el.setAttribute(name, value);
            } else {
                return el.getAttribute(name);
            }
        },

        hasAttr: function(el, name) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            return el.getAttribute(name) ? true : false;
        },

        removeAttr: function(el, name) {
            el = KTUtil.get(el);

            if (el == undefined) {
                return;
            }

            el.removeAttribute(name);
        },

        animate: function(from, to, duration, update, easing, done) {
            /**
             * TinyAnimate.easings
             *  Adapted from jQuery Easing
             */
            var easings = {};
            var easing;

            easings.linear = function(t, b, c, d) {
                return c * t / d + b;
            };

            easing = easings.linear;

            // Early bail out if called incorrectly
            if (typeof from !== 'number' ||
                typeof to !== 'number' ||
                typeof duration !== 'number' ||
                typeof update !== 'function') {
                return;
            }

            // Create mock done() function if necessary
            if (typeof done !== 'function') {
                done = function() {};
            }

            // Pick implementation (requestAnimationFrame | setTimeout)
            var rAF = window.requestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 50);
            };

            // Animation loop
            var canceled = false;
            var change = to - from;

            function loop(timestamp) {
                var time = (timestamp || +new Date()) - start;

                if (time >= 0) {
                    update(easing(time, from, change, duration));
                }
                if (time >= 0 && time >= duration) {
                    update(to);
                    done();
                } else {
                    rAF(loop);
                }
            }

            update(from);

            // Start animation loop
            var start = window.performance && window.performance.now ? window.performance.now() : +new Date();

            rAF(loop);
        },

        actualCss: function(el, prop, cache) {
            el = KTUtil.get(el);
            var css = '';
            
            if (el instanceof HTMLElement === false) {
                return;
            }

            if (!el.getAttribute('kt-hidden-' + prop) || cache === false) {
                var value;

                // the element is hidden so:
                // making the el block so we can meassure its height but still be hidden
                css = el.style.cssText;
                el.style.cssText = 'position: absolute; visibility: hidden; display: block;';

                if (prop == 'width') {
                    value = el.offsetWidth;
                } else if (prop == 'height') {
                    value = el.offsetHeight;
                }

                el.style.cssText = css;

                // store it in cache
                el.setAttribute('kt-hidden-' + prop, value);

                return parseFloat(value);
            } else {
                // store it in cache
                return parseFloat(el.getAttribute('kt-hidden-' + prop));
            }
        },

        actualHeight: function(el, cache) {
            return KTUtil.actualCss(el, 'height', cache);
        },

        actualWidth: function(el, cache) {
            return KTUtil.actualCss(el, 'width', cache);
        },

        getScroll: function(element, method) {
            // The passed in `method` value should be 'Top' or 'Left'
            method = 'scroll' + method;
            return (element == window || element == document) ? (
                self[(method == 'scrollTop') ? 'pageYOffset' : 'pageXOffset'] ||
                (browserSupportsBoxModel && document.documentElement[method]) ||
                document.body[method]
            ) : element[method];
        },

        css: function(el, styleProp, value) {
            el = KTUtil.get(el);

            if (!el) {
                return;
            }

            if (value !== undefined) {
                el.style[styleProp] = value;
            } else {
                var value, defaultView = (el.ownerDocument || document).defaultView;
                // W3C standard way:
                if (defaultView && defaultView.getComputedStyle) {
                    // sanitize property name to css notation
                    // (hyphen separated words eg. font-Size)
                    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
                    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
                } else if (el.currentStyle) { // IE
                    // sanitize property name to camelCase
                    styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                        return letter.toUpperCase();
                    });
                    value = el.currentStyle[styleProp];
                    // convert other units to pixels on IE
                    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                        return (function(value) {
                            var oldLeft = el.style.left,
                                oldRsLeft = el.runtimeStyle.left;
                            el.runtimeStyle.left = el.currentStyle.left;
                            el.style.left = value || 0;
                            value = el.style.pixelLeft + "px";
                            el.style.left = oldLeft;
                            el.runtimeStyle.left = oldRsLeft;
                            return value;
                        })(value);
                    }
                    return value;
                }
            }
        },

        slide: function(el, dir, speed, callback, recalcMaxHeight) {
            if (!el || (dir == 'up' && KTUtil.visible(el) === false) || (dir == 'down' && KTUtil.visible(el) === true)) {
                return;
            }

            speed = (speed ? speed : 600);
            var calcHeight = KTUtil.actualHeight(el);
            var calcPaddingTop = false;
            var calcPaddingBottom = false;

            if (KTUtil.css(el, 'padding-top') && KTUtil.data(el).has('slide-padding-top') !== true) {
                KTUtil.data(el).set('slide-padding-top', KTUtil.css(el, 'padding-top'));
            }

            if (KTUtil.css(el, 'padding-bottom') && KTUtil.data(el).has('slide-padding-bottom') !== true) {
                KTUtil.data(el).set('slide-padding-bottom', KTUtil.css(el, 'padding-bottom'));
            }

            if (KTUtil.data(el).has('slide-padding-top')) {
                calcPaddingTop = parseInt(KTUtil.data(el).get('slide-padding-top'));
            }

            if (KTUtil.data(el).has('slide-padding-bottom')) {
                calcPaddingBottom = parseInt(KTUtil.data(el).get('slide-padding-bottom'));
            }

            if (dir == 'up') { // up          
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {
                        el.style.paddingTop = (calcPaddingTop - value) + 'px';
                    }, 'linear');
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = (calcPaddingBottom - value) + 'px';
                    }, 'linear');
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = (calcHeight - value) + 'px';
                }, 'linear', function() {
                    callback();
                    el.style.height = '';
                    el.style.display = 'none';
                });


            } else if (dir == 'down') { // down
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {
                        el.style.paddingTop = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingTop = '';
                    });
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingBottom = '';
                    });
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = value + 'px';
                }, 'linear', function() {
                    callback();
                    el.style.height = '';
                    el.style.display = '';
                    el.style.overflow = '';
                });
            }
        },

        slideUp: function(el, speed, callback) {
            KTUtil.slide(el, 'up', speed, callback);
        },

        slideDown: function(el, speed, callback) {
            KTUtil.slide(el, 'down', speed, callback);
        },

        show: function(el, display) {
            el.style.display = (display ? display : 'block');
        },

        hide: function(el) {
            el.style.display = 'none';
        },

        addEvent: function(el, type, handler, one) {
            el = KTUtil.get(el);
            if (typeof el !== 'undefined') {
                el.addEventListener(type, handler);
            }
        },

        removeEvent: function(el, type, handler) {
            el = KTUtil.get(el);
            el.removeEventListener(type, handler);
        },

        on: function(element, selector, event, handler) {
            if (!selector) {
                return;
            }

            var eventId = KTUtil.getUniqueID('event');

            KTUtilDelegatedEventHandlers[eventId] = function(e) {
                var targets = element.querySelectorAll(selector);
                var target = e.target;

                while (target && target !== element) {
                    for (var i = 0, j = targets.length; i < j; i++) {
                        if (target === targets[i]) {
                            handler.call(target, e);
                        }
                    }

                    target = target.parentNode;
                }
            }

            KTUtil.addEvent(element, event, KTUtilDelegatedEventHandlers[eventId]);

            return eventId;
        },

        off: function(element, event, eventId) {
            if (!element || !KTUtilDelegatedEventHandlers[eventId]) {
                return;
            }

            KTUtil.removeEvent(element, event, KTUtilDelegatedEventHandlers[eventId]);

            delete KTUtilDelegatedEventHandlers[eventId];
        },

        one: function onetime(el, type, callback) {
            el = KTUtil.get(el);

            el.addEventListener(type, function callee(e) {
                // remove event
                if (e.target && e.target.removeEventListener) {
                    e.target.removeEventListener(e.type, callee);                    
                }
                
                // call handler
                return callback(e);
            });
        },

        hash: function(str) {
            var hash = 0,
                i, chr;

            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        },

        animateClass: function(el, animationName, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.addClass(el, 'animated ' + animationName);

            KTUtil.one(el, animation, function() {
                KTUtil.removeClass(el, 'animated ' + animationName);
            });

            if (callback) {
                KTUtil.one(el, animation, callback);
            }
        },

        transitionEnd: function(el, callback) {
            var transition;
            var transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'mozTransitionEnd',
                WebkitTransition: 'webkitTransitionEnd',
                msTransition: 'msTransitionEnd'
            };

            for (var t in transitions) {
                if (el.style[t] !== undefined) {
                    transition = transitions[t];
                }
            }

            KTUtil.one(el, transition, callback);
        },

        animationEnd: function(el, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd'
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.one(el, animation, callback);
        },

        animateDelay: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-delay', value);
            }
        },

        animateDuration: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-duration', value);
            }
        },

        scrollTo: function(target, offset, duration) {
            var duration = duration ? duration : 500;
            var target = KTUtil.get(target);
            var targetPos = target ? KTUtil.offset(target).top : 0;
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var from, to;

            if (targetPos > scrollPos) {
                from = targetPos;
                to = scrollPos;
            } else {
                from = scrollPos;
                to = targetPos;
            }

            if (offset) {
                to += offset;
            }

            KTUtil.animate(from, to, duration, function(value) {
                document.documentElement.scrollTop = value;
                document.body.parentNode.scrollTop = value;
                document.body.scrollTop = value;
            }); //, easing, done
        },

        scrollTop: function(offset, duration) {
            KTUtil.scrollTo(null, offset, duration);
        },

        isArray: function(obj) {
            return obj && Array.isArray(obj);
        },

        ready: function(callback) {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
                callback();
            } else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        },

        isEmpty: function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        },

        numberString: function(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        detectIE: function() {
            var ua = window.navigator.userAgent;

            // Test values; Uncomment to check result …

            // IE 10
            // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

            // IE 11
            // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

            // Edge 12 (Spartan)
            // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

            // Edge 13
            // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }

            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }

            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }

            // other browser
            return false;
        },

        isRTL: function() {
            return (KTUtil.attr(KTUtil.get('html'), 'direction') == 'rtl');
        },

        // Scroller
        scrollInit: function(element, options) {
            if(!element) return;
            // Define init function
            function init() {
                var ps;
                var height;

                if (options.height instanceof Function) {
                    height = parseInt(options.height.call());
                } else {
                    height = parseInt(options.height);
                }

                // Destroy scroll on table and mobile modes
                if (options.disableForMobile && KTUtil.isInResponsiveRange('tablet-and-mobile')) {
                    if (ps = KTUtil.data(element).get('ps')) {
                        if (options.resetHeightOnDestroy) {
                            KTUtil.css(element, 'height', 'auto');
                        } else {
                            KTUtil.css(element, 'overflow', 'auto');
                            if (height > 0) {
                                KTUtil.css(element, 'height', height + 'px');
                            }
                        }

                        ps.destroy();
                        ps = KTUtil.data(element).remove('ps');
                    } else if (height > 0){
                        KTUtil.css(element, 'overflow', 'auto');
                        KTUtil.css(element, 'height', height + 'px');
                    }

                    return;
                }

                if (height > 0) {
                    KTUtil.css(element, 'height', height + 'px');
                }

                KTUtil.css(element, 'overflow', 'hidden');

                // Init scroll
                if (ps = KTUtil.data(element).get('ps')) {
                    ps.update();
                } else {
                    KTUtil.addClass(element, 'kt-scroll');
                    ps = new PerfectScrollbar(element, {
                        wheelSpeed: 0.5,
                        swipeEasing: true,
                        wheelPropagation: false,
                        minScrollbarLength: 40,
                        maxScrollbarLength: 300, 
                        suppressScrollX: KTUtil.attr(element, 'data-scroll-x') != 'true' ? true : false
                    });

                    KTUtil.data(element).set('ps', ps);
                }
            }

            // Init
            init();

            // Handle window resize
            if (options.handleWindowResize) {
                KTUtil.addResizeHandler(function() {
                    init();
                });
            }
        },

        scrollUpdate: function(element) {
            var ps;
            if (ps = KTUtil.data(element).get('ps')) {
                ps.update();
            }
        },

        scrollUpdateAll: function(parent) {
            var scrollers = KTUtil.findAll(parent, '.ps');
            for (var i = 0, len = scrollers.length; i < len; i++) {
                KTUtil.scrollerUpdate(scrollers[i]);
            }
        },

        scrollDestroy: function(element) {
            var ps;
            if (ps = KTUtil.data(element).get('ps')) {
                ps.destroy();
                ps = KTUtil.data(element).remove('ps');
            }
        },

        setHTML: function(el, html) {
            if (KTUtil.get(el)) {
                KTUtil.get(el).innerHTML = html;
            }
        },

        getHTML: function(el) {
            if (KTUtil.get(el)) {
                return KTUtil.get(el).innerHTML;
            }
        } 
    }
}();

// Initialize KTUtil class on document ready
KTUtil.ready(function() {
    KTUtil.init();
});


    function a (e) {
        var a = "KTDatatable",
            n = KTUtil,
            o = KTUtil;
        if (void 0 === n) throw new Error("Util class is required and must be included before KTDatatable");
        jQuery.fn.KTDatatable = function (i) {
            if (0 !== $(this).length) {
                var tableInstance = this;
                tableInstance.debug = !1, tableInstance.API = {
                    record: null,
                    value: null,
                    params: null
                };
                var r = {
                    isInit: !1,
                    cellOffset: 110,
                    iconOffset: 15,
                    stateId: "meta",
                    ajaxParams: {},
                    pagingObject: {},
                    init: function (t) {
                        var a, n = !1;
                        null === t.data.source && (r.extractTable(), n = !0),
                        r.setupBaseDOM.call(),
                        r.setupDOM(tableInstance.table),
                        r.setDataSourceQuery(r.getOption("data.source.read.params.query")),
                        $(tableInstance).on("kt-datatable--on-layout-updated", r.afterRender),
                        tableInstance.debug && r.stateRemove(r.stateId), 

                        $.each(r.getOption("extensions"), function (t, a) {
                            "function" == typeof e.fn.KTDatatable[t] && new e.fn.KTDatatable[t](l, a)
                        }), 

                        "remote" !== t.data.type && "local" !== t.data.type 
                        || ((!1 === t.data.saveState 
                        || !1 === t.data.saveState.cookie && !1 === t.data.saveState.webstorage) && r.stateRemove(r.stateId), 

                        "local" === t.data.type && "object" == typeof t.data.source 
                        && (tableInstance.dataSet = tableInstance.originalDataSet = r.dataMapCallback(t.data.source)), 
                        r.dataRender()), 
                        n 
                        && (
                                $(tableInstance.tableHead).find("tr").remove(), 
                                $(tableInstance.tableFoot).find("tr").remove()
                            ),
                            r.setHeadTitle(),
                            r.getOption("layout.footer") && r.setHeadTitle(tableInstance.tableFoot), 
                        void 0 !== t.layout.header && !1 === t.layout.header && $(tableInstance.table).find("thead").remove(), 
                        void 0 !== t.layout.footer && !1 === t.layout.footer && $(tableInstance.table).find("tfoot").remove(), 
                        null !== t.data.type && "local" !== t.data.type || (r.setupCellField.call(), 
                        r.setupTemplateCell.call(), 
                        r.setupSubDatatable.call(), 
                        r.setupSystemColumn.call(), 
                        r.redraw());
                        var o = !1;
                        return e(window).resize(function () {
                            o || (a = e(this).width(), o = !0), e(this).width() !== a && (a = e(this).width(), r.fullRender())
                        }), 
                        $(tableInstance).height(""), $(r.getOption("search.input")).on("keyup", function (t) {
                            r.getOption("search.onEnter") && 13 !== t.which || r.search(e(this).val())
                        }), tableInstance
                    },
                    extractTable: function () {
                        var t = [],
                            a = $(tableInstance).find("tr:first-child th").get().map(function (a, n) {
                                var o = e(a).data("field");
                                void 0 === o && (o = e(a).text().trim());
                                var l = {
                                    field: o,
                                    title: o
                                };
                                for (var r in i.columns) i.columns[r].field === o && (l = e.extend(!0, {}, i.columns[r], l));
                                return t.push(l), o
                            });
                        i.columns = t;
                        var o = [],
                            r = [];
                        $(tableInstance).find("tr").each(function () {
                            e(this).find("td").length && o.push(e(this).prop("attributes"));
                            var t = {};
                            e(this).find("td").each(function (e, n) {
                                t[a[e]] = n.innerHTML.trim()
                            }), n.isEmpty(t) || r.push(t)
                        }), i.data.attr.rowProps = o, i.data.source = r
                    },
                    layoutUpdate: function () {
                        r.setupSubDatatable.call(),
                        r.setupSystemColumn.call(),
                        r.setupHover.call(),
                        void 0 === i.detail && 1 === r.getDepth() && r.lockTable.call(),
                        r.columnHide.call(), r.resetScroll(), r.isLocked() || (r.redraw.call(),
                            r.isSubtable() || !0 !== r.getOption("rows.autoHide") || r.autoHide(),
                            $(tableInstance.table).find(".kt-datatable__row").css("height", "")),
                        r.rowEvenOdd.call(), r.sorting.call(), r.scrollbar.call(), r.isInit || (r.dropdownFix(), 
                        $(tableInstance).trigger("kt-datatable--on-init", {
                            table: $(tableInstance.wrap).attr("id"),
                            options: i
                        }), r.isInit = !0),
                        $(tableInstance).trigger("kt-datatable--on-layout-updated", {
                            table: $(tableInstance.wrap).attr("id")
                        })
                    },
                    lockTable: function () {
                        var t = {

                            lockEnabled: !1,

                            init: function () {
                                t.lockEnabled = r.lockEnabledColumns(), 0 === t.lockEnabled.left.length && 0 === t.lockEnabled.right.length || t.enable()
                            },

                            enable: function () {
                                $(tableInstance.table).find("thead,tbody,tfoot").each(function () {
                                    var a = this;
                                    0 === e(this).find(".kt-datatable__lock").length && $(this).ready(function () {
                                        ! function (a) {
                                            if (e(a).find(".kt-datatable__lock").length > 0) r.log("Locked container already exist in: ", a);
                                            else if (0 !== e(a).find(".kt-datatable__row").length) {
                                                var n = e("<div/>").addClass("kt-datatable__lock kt-datatable__lock--left"),
                                                    o = e("<div/>").addClass("kt-datatable__lock kt-datatable__lock--scroll"),
                                                    i = e("<div/>").addClass("kt-datatable__lock kt-datatable__lock--right");
                                                e(a).find(".kt-datatable__row").each(function () {
                                                    var t = e("<tr/>").addClass("kt-datatable__row").data("obj", e(this).data("obj")).appendTo(n),
                                                        a = e("<tr/>").addClass("kt-datatable__row").data("obj", e(this).data("obj")).appendTo(o),
                                                        l = e("<tr/>").addClass("kt-datatable__row").data("obj", e(this).data("obj")).appendTo(i);
                                                    e(this).find(".kt-datatable__cell").each(function () {
                                                        var n = e(this).data("locked");
                                                        void 0 !== n ? (void 0 === n.left && !0 !== n || e(this).appendTo(t), void 0 !== n.right && e(this).appendTo(l)) : e(this).appendTo(a)
                                                    }), e(this).remove()
                                                }), t.lockEnabled.left.length > 0 && (e(l.wrap).addClass("kt-datatable--lock"), e(n).appendTo(a)), (t.lockEnabled.left.length > 0 || t.lockEnabled.right.length > 0) && e(o).appendTo(a), t.lockEnabled.right.length > 0 && (e(l.wrap).addClass("kt-datatable--lock"), e(i).appendTo(a))
                                            } else r.log("No row exist in: ", a)
                                        }(a)
                                    })
                                })
                            }
                        };
                        return t.init(), t
                    },
                    fullRender: function () {
                        $(tableInstance.tableHead).empty(), r.setHeadTitle(), r.getOption("layout.footer") && 
                        (
                            $(tableInstance.tableFoot).empty(), 
                            r.setHeadTitle(tableInstance.tableFoot)
                        ),
                        r.spinnerCallback(!0),
                        $(tableInstance.wrap).removeClass("kt-datatable--loaded"), r.insertData()
                    },
                    lockEnabledColumns: function () {
                        var t = e(window).width(),
                            a = i.columns,
                            o = {
                                left: [],
                                right: []
                            };
                        return $.each(a, function (e, a) {
                            void 0 !== a.locked && (void 0 !== a.locked.left && n.getBreakpoint(a.locked.left) <= t && o.left.push(a.locked.left), void 0 !== a.locked.right && n.getBreakpoint(a.locked.right) <= t && o.right.push(a.locked.right))
                        }), o
                    },
                    afterRender: function (t, a) {
                        $(tableInstance).ready(function () {
                            r.isLocked() && r.redraw(),
                            $(tableInstance.tableBody).css("visibility", ""),
                            $(tableInstance.wrap).addClass("kt-datatable--loaded"), r.spinnerCallback(!1)
                        })
                    },
                    dropdownFix: function () {
                        var t;
                        e("body").on("show.bs.dropdown", ".kt-datatable .kt-datatable__body", function (a) {
                            t = e(a.target).find(".dropdown-menu"), e("body").append(t.detach()), t.css("display", "block"), t.position({
                                my: "right top",
                                at: "right bottom",
                                of: e(a.relatedTarget)
                            }),
                            tableInstance.closest(".modal").length && t.css("z-index", "2000")
                        }).on("hide.bs.dropdown", ".kt-datatable .kt-datatable__body", function (a) {
                            $(a.target).append(t.detach()), t.hide()
                        })
                    },
                    hoverTimer: 0,
                    isScrolling: !1,
                    setupHover: function () {
                        $(window).scroll(function (t) {
                            clearTimeout(r.hoverTimer), r.isScrolling = !0
                        }), $(tableInstance.tableBody).find(".kt-datatable__cell").off("mouseenter", "mouseleave").on("mouseenter", function () {
                            if (r.hoverTimer = setTimeout(function () {
                                r.isScrolling = !1
                            }, 200), !r.isScrolling) {
                                var t = e(this).closest(".kt-datatable__row").addClass("kt-datatable__row--hover"),
                                    a = e(t).index() + 1;
                                $(t).closest(".kt-datatable__lock").parent().find(".kt-datatable__row:nth-child(" + a + ")").addClass("kt-datatable__row--hover")
                            }
                        }).on("mouseleave", function () {
                            var t = e(this).closest(".kt-datatable__row").removeClass("kt-datatable__row--hover"),
                                a = e(t).index() + 1;
                            $(t).closest(".kt-datatable__lock").parent().find(".kt-datatable__row:nth-child(" + a + ")").removeClass("kt-datatable__row--hover")
                        })
                    },
                    adjustLockContainer: function () {
                        if (!r.isLocked()) return 0;
                        var t = $(tableInstance.tableHead).width(),
                            a = $(tableInstance.tableHead).find(".kt-datatable__lock--left").width(),
                            n = $(tableInstance.tableHead).find(".kt-datatable__lock--right").width();
                        void 0 === a && (a = 0), void 0 === n && (n = 0);
                        var o = Math.floor(t - a - n);
                        return e(l.table).find(".kt-datatable__lock--scroll").css("width", o), o
                    },
                    dragResize: function () {
                        var t, a, n = !1,
                            o = void 0;
                        $(tableInstance.tableHead).find(".kt-datatable__cell").mousedown(function (i) {
                            o = $(this), n = !0, t = i.pageX, a = $(this).width(), $(o).addClass("kt-datatable__cell--resizing")
                        }).mousemove(function (i) {
                            if (n) {
                                var r = e(o).index(),
                                    s = e(tableInstance.tableBody),
                                    d = e(o).closest(".kt-datatable__lock");
                                if (d) {
                                    var c = e(d).index();
                                    s = e(tableInstance.tableBody).find(".kt-datatable__lock").eq(c)
                                }
                                $(s).find(".kt-datatable__row").each(function (n, o) {
                                    e(o).find(".kt-datatable__cell").eq(r).width(a + (i.pageX - t)).children().width(a + (i.pageX - t))
                                }), e(o).children().css("width", a + (i.pageX - t))
                            }
                        }).mouseup(function () {
                            $(o).removeClass("kt-datatable__cell--resizing"), n = !1
                        }), $(document).mouseup(function () {
                            $(o).removeClass("kt-datatable__cell--resizing"), n = !1
                        })
                    },
                    initHeight: function () {
                        if (i.layout.height && i.layout.scroll) {
                            var t = $(tableInstance.tableHead).find(".kt-datatable__row").outerHeight(),
                                a = $(tableInstance.tableFoot).find(".kt-datatable__row").outerHeight(),
                                n = i.layout.height;
                            t > 0 && (n -= t), a > 0 && (n -= a), n -= 2, $(tableInstance.tableBody).css("max-height", n), $(tableInstance.tableBody).find(".kt-datatable__lock--scroll").css("height", n)
                        }
                    },
                    setupBaseDOM: function () {
                        tableInstance.initialDatatable = e(tableInstance).clone(), "TABLE" === e(tableInstance).prop("tagName") ? (tableInstance.table = e(tableInstance).removeClass("kt-datatable").addClass("kt-datatable__table"), 0 === e(tableInstance.table).parents(".kt-datatable").length && (tableInstance.table.wrap(e("<div/>").addClass("kt-datatable").addClass("kt-datatable--" + i.layout.theme)), tableInstance.wrap = e(l.table).parent())) : (tableInstance.wrap = e(tableInstance).addClass("kt-datatable").addClass("kt-datatable--" + i.layout.theme), tableInstance.table = e("<table/>").addClass("kt-datatable__table").appendTo(tableInstance)), void 0 !== i.layout.class && e(tableInstance.wrap).addClass(i.layout.class), e(tableInstance.table).removeClass("kt-datatable--destroyed").css("display", "block"), void 0 === e(tableInstance).attr("id") && (r.setOption("data.saveState", !1), e(tableInstance.table).attr("id", n.getUniqueID("kt-datatable--"))), r.getOption("layout.minHeight") && e(tableInstance.table).css("min-height", r.getOption("layout.minHeight")), r.getOption("layout.height") && e(tableInstance.table).css("max-height", r.getOption("layout.height")), null === i.data.type && e(tableInstance.table).css("width", "").css("display", ""), tableInstance.tableHead = e(tableInstance.table).find("thead"), 0 === e(tableInstance.tableHead).length && (tableInstance.tableHead = e("<thead/>").prependTo(tableInstance.table)), tableInstance.tableBody = e(tableInstance.table).find("tbody"), 0 === e(tableInstance.tableBody).length && (tableInstance.tableBody = e("<tbody/>").appendTo(tableInstance.table)), void 0 !== i.layout.footer && i.layout.footer && (tableInstance.tableFoot = e(tableInstance.table).find("tfoot"), 0 === e(tableInstance.tableFoot).length && (tableInstance.tableFoot = e("<tfoot/>").appendTo(tableInstance.table)))
                    },
                    setupCellField: function (t) {
                        void 0 === t && (t = $(tableInstance.table).children());
                        var a = i.columns;
                        $.each(t, function (t, n) {
                            $(n).find(".kt-datatable__row").each(function (t, n) {
                                $(n).find(".kt-datatable__cell").each(function (t, n) {
                                    void 0 !== a[t] && e(n).data(a[t])
                                })
                            })
                        })
                    },
                    setupTemplateCell: function (t) {
                        void 0 === t && (t = tableInstance.tableBody);
                        var a = i.columns;
                        e(t).find(".kt-datatable__row").each(function (t, n) {
                            var o = e(n).data("obj");
                            if (void 0 !== o) {
                                var i = r.getOption("rows.callback");
                                "function" == typeof i && i(e(n), o, t);
                                var s = r.getOption("rows.beforeTemplate");
                                "function" == typeof s && s(e(n), o, t), void 0 === o && (o = {}, e(n).find(".kt-datatable__cell").each(function (t, n) {
                                    var i = e.grep(a, function (t, a) {
                                        return e(n).data("field") === t.field
                                    })[0];
                                    void 0 !== i && (o[i.field] = e(n).text())
                                })), e(n).find(".kt-datatable__cell").each(function (n, i) {
                                    var s = e.grep(a, function (t, a) {
                                        return e(i).data("field") === t.field
                                    })[0];
                                    if (void 0 !== s && void 0 !== s.template) {
                                        var d = "";
                                        "string" == typeof s.template && (d = r.dataPlaceholder(s.template, o)), "function" == typeof s.template && (d = s.template(o, t, tableInstance)), "undefined" != typeof DOMPurify && (d = DOMPurify.sanitize(d));
                                        var c = document.createElement("span");
                                        c.innerHTML = d, e(i).html(c), void 0 !== s.overflow && (e(c).css("overflow", s.overflow), e(c).css("position", "relative"))
                                    }
                                });
                                var d = r.getOption("rows.afterTemplate");
                                "function" == typeof d && d(e(n), o, t)
                            }
                        })
                    },
                    setupSystemColumn: function () {
                        if (tableInstance.dataSet = tableInstance.dataSet || [], 0 !== tableInstance.dataSet.length) {
                            var t = i.columns;
                            $(tableInstance.tableBody).find(".kt-datatable__row").each(function (a, n) {
                                $(n).find(".kt-datatable__cell").each(function (a, n) {
                                    var o = e.grep(t, function (t, a) {
                                        return e(n).data("field") === t.field
                                    })[0];
                                    if (void 0 !== o) {
                                        var i = e(n).text();
                                        if (void 0 !== o.selector && !1 !== o.selector) {
                                            if (e(n).find('.kt-checkbox [type="checkbox"]').length > 0) return;
                                            e(n).addClass("kt-datatable__cell--check");
                                            var l = e("<label/>").addClass("kt-checkbox kt-checkbox--single").append(e("<input/>").attr("type", "checkbox").attr("value", i).on("click", function () {
                                                $(this).is(":checked") ? r.setActive(this) : r.setInactive(this)
                                            })).append("&nbsp;<span></span>");
                                            void 0 !== o.selector.class && e(l).addClass(o.selector.class), e(n).children().html(l)
                                        }
                                        if (void 0 !== o.subtable && o.subtable) {
                                            if ($(n).find(".kt-datatable__toggle-subtable").length > 0) return;
                                            $(n).children().html($("<a/>").addClass("kt-datatable__toggle-subtable").attr("href", "#").attr("data-value", i).append(e("<i/>").addClass(r.getOption("layout.icons.rowDetail.collapse"))))
                                        }
                                    }
                                })
                            });
                            var a = function (a) {
                                var n = e.grep(t, function (t, e) {
                                    return void 0 !== t.selector && !1 !== t.selector
                                })[0];
                                if (void 0 !== n && void 0 !== n.selector && !1 !== n.selector) {
                                    var o = e(a).find('[data-field="' + n.field + '"]');
                                    if (e(o).find('.kt-checkbox [type="checkbox"]').length > 0) return;
                                    e(o).addClass("kt-datatable__cell--check");
                                    var i = e("<label/>").addClass("kt-checkbox kt-checkbox--single kt-checkbox--all").append(e("<input/>").attr("type", "checkbox").on("click", function () {
                                        e(this).is(":checked") ? r.setActiveAll(!0) : r.setActiveAll(!1)
                                    })).append("&nbsp;<span></span>");
                                    void 0 !== n.selector.class && e(i).addClass(n.selector.class), e(o).children().html(i)
                                }
                            };
                            i.layout.header && a($(tableInstance.tableHead).find(".kt-datatable__row").first()), i.layout.footer && a(e(l.tableFoot).find(".kt-datatable__row").first())
                        }
                    },
                    adjustCellsWidth: function () {
                        var t = $(tableInstance.tableBody).innerWidth() - r.iconOffset,
                            a = $(tableInstance.tableBody).find(".kt-datatable__row:first-child").find(".kt-datatable__cell").not(".kt-datatable__toggle-detail").not(":hidden").length;
                        if (a > 0) {
                            t -= r.iconOffset * a;
                            var n = Math.floor(t / a);
                            n <= r.cellOffset && (n = r.cellOffset);
                            var o = {};
                            $(tableInstance.table).find(".kt-datatable__row").find(".kt-datatable__cell").not(".kt-datatable__toggle-detail").not(":hidden").each(function (t, a) {
                                var i = n,
                                    r = e(a).data("width");
                                if (void 0 !== r)
                                    if ("auto" === r) {
                                        var s = e(a).data("field");
                                        if (o[s]) i = o[s];
                                        else {
                                            var d = e(l.table).find('.kt-datatable__cell[data-field="' + s + '"]');
                                            i = o[s] = Math.max.apply(null, e(d).map(function () {
                                                return e(this).outerWidth()
                                            }).get())
                                        }
                                    } else i = r;
                                $(a).children().css("width", Math.ceil(i))
                            })
                        }
                        return tableInstance
                    },
                    adjustCellsHeight: function () {
                        e.each(e(l.table).children(), function (t, a) {
                            for (var n = e(a).find(".kt-datatable__row").first().parent().find(".kt-datatable__row").length, o = 1; o <= n; o++) {
                                var i = e(a).find(".kt-datatable__row:nth-child(" + o + ")");
                                if (e(i).length > 0) {
                                    var l = Math.max.apply(null, e(i).map(function () {
                                        return e(this).outerHeight()
                                    }).get());
                                    e(i).css("height", Math.ceil(l))
                                }
                            }
                        })
                    },
                    setupDOM: function (t) {
                        e(t).find("> thead").addClass("kt-datatable__head"), e(t).find("> tbody").addClass("kt-datatable__body"), e(t).find("> tfoot").addClass("kt-datatable__foot"), e(t).find("tr").addClass("kt-datatable__row"), e(t).find("tr > th, tr > td").addClass("kt-datatable__cell"), e(t).find("tr > th, tr > td").each(function (t, a) {
                            0 === e(a).find("span").length && e(a).wrapInner(e("<span/>").css("width", r.cellOffset))
                        })
                    },
                    scrollbar: function () {
                        var t = {
                            scrollable: null,
                            tableLocked: null,
                            initPosition: null,
                            init: function () {
                                var a = n.getViewPort().width;
                                if (i.layout.scroll) {
                                    e(tableInstance.wrap).addClass("kt-datatable--scroll");
                                    var o = e(tableInstance.tableBody).find(".kt-datatable__lock--scroll");

                                    e(o).find(".kt-datatable__row").length > 0 && e(o).length > 0 ? 
                                    (t.scrollHead = e(tableInstance.tableHead).find("> .kt-datatable__lock--scroll > .kt-datatable__row"),
                                    	t.scrollFoot = e(tableInstance.tableFoot).find("> .kt-datatable__lock--scroll > .kt-datatable__row"),
                                    	t.tableLocked = e(tableInstance.tableBody).find(".kt-datatable__lock:not(.kt-datatable__lock--scroll)"),

										r.getOption("layout.customScrollbar") && 10 != n.detectIE() && a > n.getBreakpoint("lg") ?
											t.initCustomScrollbar(o[0]) : t.initDefaultScrollbar(o)) : e(tableInstance.tableBody).find(".kt-datatable__row").length > 0
                                    			&& (t.scrollHead = e(tableInstance.tableHead).find("> .kt-datatable__row"),

                                    		t.scrollFoot = e(tableInstance.tableFoot).find("> .kt-datatable__row"),
                                    		r.getOption("layout.customScrollbar") && 10 != n.detectIE() && a > n.getBreakpoint("lg") ? 
                                    		t.initCustomScrollbar(tableInstance.tableBody) : t.initDefaultScrollbar(tableInstance.tableBody))
                                }
                            },
                            initDefaultScrollbar: function (a) {
                                t.initPosition = e(a).scrollLeft(),
                                e(a).css("overflow-y", "auto").off().on("scroll", t.onScrolling),
                                !0 !== r.getOption("rows.autoHide") && e(a).css("overflow-x", "auto")
                            },
                            onScrolling: function (a) {
                                var o = e(this).scrollLeft(),
                                    i = e(this).scrollTop();

                                n.isRTL() && (o -= t.initPosition), e(t.scrollHead).css("left", -o),
                                	e(t.scrollFoot).css("left", -o), e(t.tableLocked).each(function (t, a) {
                                    r.isLocked() && (i -= 1), e(a).css("top", -i)
                                })
                            },
                            initCustomScrollbar: function (a) {
                                t.scrollable = a, r.initScrollbar(a), t.initPosition = e(a).scrollLeft(), e(a).off().on("scroll", t.onScrolling)
                            }
                        };
                        return t.init(), t
                    },
                    initScrollbar: function (t, a) {
                        if (t && t.nodeName)
                            if ($(tableInstance.tableBody).css("overflow", ""), n.hasClass(t, "ps")) e(t).data("ps").update();
                            else {
                                var o = new PerfectScrollbar(t, Object.assign({}, {
                                    wheelSpeed: .5,
                                    swipeEasing: !0,
                                    minScrollbarLength: 40,
                                    maxScrollbarLength: 300,
                                    suppressScrollX: r.getOption("rows.autoHide") && !r.isLocked()
                                }, a));
                                $(t).data("ps", o), e(window).resize(function () {
                                    o.update()
                                })
                            }
                    },
                    setHeadTitle: function (t) {
                        void 0 === t && (t = tableInstance.tableHead), t = e(t)[0];
                        var a = i.columns,
                            o = t.getElementsByTagName("tr")[0],
                            s = t.getElementsByTagName("td");
                        void 0 === o && (o = document.createElement("tr"), t.appendChild(o)), $.each(a, function (t, a) {
                            var i = s[t];
                            if (void 0 === i && (i = document.createElement("th"),
                            	o.appendChild(i)),
                            	void 0 !== a.title && (i.innerHTML = a.title, i.setAttribute("data-field", a.field),
                            		n.addClass(i, a.class),
                            		void 0 !== a.autoHide && (!0 !== a.autoHide ? i.setAttribute("data-autohide-disabled", a.autoHide) : i.setAttribute("data-autohide-enabled", a.autoHide)),
                            		e(i).data(a)),
                            	void 0 !== a.attr && e.each(a.attr, function (t, e) {
                                i.setAttribute(t, e)
                            }), void 0 !== a.textAlign) {
                                var r = void 0 !== tableInstance.textAlign[a.textAlign] ? tableInstance.textAlign[a.textAlign] : "";
                                n.addClass(i, r)
                            }
                        }), r.setupDOM(t)
                    },
                    dataRender: function (t) {
                        $(tableInstance.table).siblings(".kt-datatable__pager").removeClass("kt-datatable--paging-loaded");
                        var a = function () {
                            tableInstance.dataSet = tableInstance.dataSet || [], r.localDataUpdate();
                            var t = r.getDataSourceParam("pagination");
                            0 === t.perpage && (t.perpage = i.data.pageSize || 10), t.total = tableInstance.dataSet.length;
                            var a = Math.max(t.perpage * (t.page - 1), 0),
                                n = Math.min(a + t.perpage, t.total);
                            return tableInstance.dataSet = $(tableInstance.dataSet).slice(a, n), t
                        },
                            n = function (t) {
                                var n = function (t, a) {
                                    e(t.pager).hasClass("kt-datatable--paging-loaded") || (e(t.pager).remove(), t.init(a)), e(t.pager).off().on("kt-datatable--on-goto-page", function (n) {
                                        e(t.pager).remove(), t.init(a)
                                    });
                                    var n = Math.max(a.perpage * (a.page - 1), 0),
                                        o = Math.min(n + a.perpage, a.total);
                                    r.localDataUpdate(), l.dataSet = e(l.dataSet).slice(n, o), r.insertData()
                                };
                                if ($(tableInstance.wrap).removeClass("kt-datatable--error"), i.pagination)
                                    if (i.data.serverPaging && "local" !== i.data.type) {
                                        var o = r.getObject("meta", t || null);
                                        r.pagingObject = null !== o ? r.paging(o) : r.paging(a(), n)
                                    } else r.pagingObject = r.paging(a(), n);
                                else r.localDataUpdate();
                                r.insertData()
                            };
                        "local" === i.data.type || !1 === i.data.serverSorting && "sort" === t || !1 === i.data.serverFiltering && "search" === t ? setTimeout(function () {
                            n(), r.setAutoColumns()
                        }) : r.getData().done(n)
                    },
                    insertData: function () {
                        tableInstance.dataSet = tableInstance.dataSet || [];
                        var t = r.getDataSourceParam(),
                            a = t.pagination,
                            o = (Math.max(a.page, 1) - 1) * a.perpage,
                            s = Math.min(a.page, a.pages) * a.perpage,
                            d = {};
                        void 0 !== i.data.attr.rowProps && i.data.attr.rowProps.length && (d = i.data.attr.rowProps.slice(o, s));
                        var c = document.createElement("tbody");
                        c.style.visibility = "hidden";
                        var u = i.columns.length;
                        if ($.each(tableInstance.dataSet, function (a, o) {
                            var s = document.createElement("tr");
                            s.setAttribute("data-row", a), e(s).data("obj", o), void 0 !== d[a] && e.each(d[a], function () {
                                s.setAttribute(this.name, this.value)
                            });
                            for (var p = 0; p < u; p += 1) {
                                var f = i.columns[p],
                                    g = [];
                                if (r.getObject("sort.field", t) === f.field && g.push("kt-datatable__cell--sorted"), void 0 !== f.textAlign) {
                                    var v = void 0 !== tableInstance.textAlign[f.textAlign] ? tableInstance.textAlign[f.textAlign] : "";
                                    g.push(v)
                                }
                                void 0 !== f.class && g.push(f.class);
                                var h = document.createElement("td");
                                n.addClass(h, g.join(" ")), h.setAttribute("data-field", f.field), void 0 !== f.autoHide && (!0 !== f.autoHide ? h.setAttribute("data-autohide-disabled", f.autoHide) : h.setAttribute("data-autohide-enabled", f.autoHide)), h.innerHTML = r.getObject(f.field, o), s.appendChild(h)
                            }
                            c.appendChild(s)
                        }), 0 === tableInstance.dataSet.length) {
                            var p = document.createElement("span");
                            n.addClass(p, "kt-datatable--error"), p.innerHTML = r.getOption("translate.records.noRecords"),
                            c.appendChild(p),
                            $(tableInstance.wrap).addClass("kt-datatable--error kt-datatable--loaded"), r.spinnerCallback(!1)
                        }
                        $(tableInstance.tableBody).replaceWith(c), 
                        tableInstance.tableBody = c, 
                        r.setupDOM(tableInstance.table), 
                        r.setupCellField([tableInstance.tableBody]),
                        r.setupTemplateCell(tableInstance.tableBody), 
                        r.layoutUpdate()
                    },
                    updateTableComponents: function () {
                        tableInstance.tableHead = $(tableInstance.table).children("thead"),
                        tableInstance.tableBody = $(tableInstance.table).children("tbody"), 
                        tableInstance.tableFoot = $(tableInstance.table).children("tfoot")
                    },
                    getData: function () {
                        var t = {
                            dataType: "json",
                            method: "POST",
                            data: {},
                            timeout: r.getOption("data.source.read.timeout") || 3e4
                        };
                        if ("local" === i.data.type && (t.url = i.data.source), "remote" === i.data.type) {
                            var a = r.getDataSourceParam();
                            r.getOption("data.serverPaging") || delete a.pagination, r.getOption("data.serverSorting") || delete a.sort, t.data = e.extend({}, t.data, a, r.getOption("data.source.read.params")), "string" != typeof (t = e.extend({}, t, r.getOption("data.source.read"))).url && (t.url = r.getOption("data.source.read")), "string" != typeof t.url && (t.url = r.getOption("data.source"))
                        }
                        return $.ajax(t).done(function (t, a, n) {
                            tableInstance.lastResponse = t, 
                            tableInstance.dataSet = tableInstance.originalDataSet = r.dataMapCallback(t),
                            r.setAutoColumns(), $(tableInstance).trigger("kt-datatable--on-ajax-done", [tableInstance.dataSet])
                        }).fail(function (t, a, n) {
                            $(tableInstance).trigger("kt-datatable--on-ajax-fail", [t]),
                            $(tableInstance.tableBody).html(e("<span/>").addClass("kt-datatable--error").html(r.getOption("translate.records.noRecords"))),
                            $(tableInstance.wrap).addClass("kt-datatable--error kt-datatable--loaded"), r.spinnerCallback(!1)
                        }).always(function () { })
                    },
                    paging: function (t, a) {
                        var o = {
                            meta: null,
                            pager: null,
                            paginateEvent: null,
                            pagerLayout: {
                                pagination: null,
                                info: null
                            },
                            callback: null,
                            init: function (t) {
                                o.meta = t, o.meta.page = parseInt(o.meta.page), 
                                o.meta.pages = parseInt(o.meta.pages),
                                o.meta.perpage = parseInt(o.meta.perpage),
                                o.meta.total = parseInt(o.meta.total),
                                o.meta.pages = Math.max(Math.ceil(o.meta.total / o.meta.perpage), 1),
                                o.meta.page > o.meta.pages && (o.meta.page = o.meta.pages),
                                o.paginateEvent = r.getTablePrefix(),
                                o.pager = $(tableInstance.table).siblings(".kt-datatable__pager"), 
                                $(o.pager).hasClass("kt-datatable--paging-loaded") 
                                    || 
                                ($(o.pager).remove(), 0 !== o.meta.pages && (r.setDataSourceParam("pagination", {
                                    page: o.meta.page,
                                    pages: o.meta.pages,
                                    perpage: o.meta.perpage,
                                    total: o.meta.total
                                }), 
                                o.callback = o.serverCallback, "function" == typeof a && (o.callback = a), 
                                o.addPaginateEvent(), 
                                o.populate(), 
                                o.meta.page = Math.max(o.meta.page || 1, o.meta.page),
                                $(tableInstance).trigger(o.paginateEvent, o.meta), 
                                o.pagingBreakpoint.call(), 
                                $(window).resize(o.pagingBreakpoint)))
                            },
                            serverCallback: function (t, e) {
                                r.dataRender()
                            },
                            populate: function () {
                                var t = r.getOption("layout.icons.pagination"),
                                    a = r.getOption("translate.toolbar.pagination.items.default");
                                o.pager = e("<div/>").addClass("kt-datatable__pager kt-datatable--paging-loaded");
                                var n = e("<ul/>").addClass("kt-datatable__pager-nav");
                                o.pagerLayout.pagination = n, e("<li/>").append(e("<a/>").attr("title", a.first).addClass("kt-datatable__pager-link kt-datatable__pager-link--first").append(e("<i/>").addClass(t.first)).on("click", o.gotoMorePage).attr("data-page", 1)).appendTo(n), e("<li/>").append(e("<a/>").attr("title", a.prev).addClass("kt-datatable__pager-link kt-datatable__pager-link--prev").append(e("<i/>").addClass(t.prev)).on("click", o.gotoMorePage)).appendTo(n), e("<li/>").append(e("<a/>").attr("title", a.more).addClass("kt-datatable__pager-link kt-datatable__pager-link--more-prev").html(e("<i/>").addClass(t.more)).on("click", o.gotoMorePage)).appendTo(n), e("<li/>").append(e("<input/>").attr("type", "text").addClass("kt-pager-input form-control").attr("title", a.input).on("keyup", function () {
                                    e(this).attr("data-page", Math.abs(e(this).val()))
                                }).on("keypress", function (t) {
                                    13 === t.which && o.gotoMorePage(t)
                                })).appendTo(n);
                                var i = r.getOption("toolbar.items.pagination.pages.desktop.pagesNumber"),
                                    s = Math.ceil(o.meta.page / i) * i,
                                    d = s - i;
                                s > o.meta.pages && (s = o.meta.pages);
                                for (var c = d; c < s; c++) {
                                    var u = c + 1;
                                    e("<li/>").append(e("<a/>").addClass("kt-datatable__pager-link kt-datatable__pager-link-number").text(u).attr("data-page", u).attr("title", u).on("click", o.gotoPage)).appendTo(n)
                                }
                                e("<li/>").append(e("<a/>").attr("title", a.more).addClass("kt-datatable__pager-link kt-datatable__pager-link--more-next").html(e("<i/>").addClass(t.more)).on("click", o.gotoMorePage)).appendTo(n), e("<li/>").append(e("<a/>").attr("title", a.next).addClass("kt-datatable__pager-link kt-datatable__pager-link--next").append(e("<i/>").addClass(t.next)).on("click", o.gotoMorePage)).appendTo(n), e("<li/>").append(e("<a/>").attr("title", a.last).addClass("kt-datatable__pager-link kt-datatable__pager-link--last").append(e("<i/>").addClass(t.last)).on("click", o.gotoMorePage).attr("data-page", o.meta.pages)).appendTo(n), r.getOption("toolbar.items.info") && (o.pagerLayout.info = e("<div/>").addClass("kt-datatable__pager-info").append(e("<span/>").addClass("kt-datatable__pager-detail"))), e.each(r.getOption("toolbar.layout"), function (t, a) {
                                    e(o.pagerLayout[a]).appendTo(o.pager)
                                });
                                var p = e("<select/>").addClass("selectpicker kt-datatable__pager-size").attr("title", r.getOption("translate.toolbar.pagination.items.default.select")).attr("data-width", "60px").val(o.meta.perpage).on("change", o.updatePerpage).prependTo(o.pagerLayout.info),
                                    f = r.getOption("toolbar.items.pagination.pageSizeSelect");
                                0 == f.length && (f = [10, 20, 30, 50, 100]), $.each(f, function (t, a) {
                                    var n = a; - 1 === a && (n = r.getOption("translate.toolbar.pagination.items.default.all")), e("<option/>").attr("value", a).html(n).appendTo(p)
                                }), 
                                $(tableInstance).ready(function () {
                                    $(".selectpicker").selectpicker().on("hide.bs.select", function () {
                                        $(this).closest(".bootstrap-select").removeClass("dropup")
                                    }).siblings(".dropdown-toggle").attr("title", r.getOption("translate.toolbar.pagination.items.default.select"))
                                }), o.paste()
                            },
                            paste: function () {
                                $.each($.unique(r.getOption("toolbar.placement")), function (t, a) {
                                    "bottom" === a && $(o.pager).clone(!0).insertAfter(tableInstance.table), 
                                    "top" === a && $(o.pager).clone(!0).addClass("kt-datatable__pager--top").insertBefore(tableInstance.table)
                                })
                            },
                            gotoMorePage: function (t) {
                                if (t.preventDefault(), "disabled" === e(this).attr("disabled")) return !1;
                                var a = $(this).attr("data-page");
                                return void 0 === a && (a = $(t.target).attr("data-page")), o.openPage(parseInt(a)), !1
                            },
                            gotoPage: function (t) {
                                t.preventDefault(), $(this).hasClass("kt-datatable__pager-link--active") 
                                    || o.openPage(parseInt(e(this).data("page")))
                            },
                            openPage: function (t) {
                                o.meta.page = parseInt(t), $(tableInstance).trigger(o.paginateEvent, o.meta),
                                o.callback(o, o.meta),
                                $(o.pager).trigger("kt-datatable--on-goto-page", o.meta)
                            },
                            updatePerpage: function (t) {
                                t.preventDefault(), o.pager = $(tableInstance.table).siblings(".kt-datatable__pager").removeClass("kt-datatable--paging-loaded"),
                                t.originalEvent && (o.meta.perpage = parseInt(e(this).val())),
                                $(o.pager).find("select.kt-datatable__pager-size").val(o.meta.perpage).attr("data-selected", o.meta.perpage),
                                r.setDataSourceParam("pagination", {
                                    page: o.meta.page,
                                    pages: o.meta.pages,
                                    perpage: o.meta.perpage,
                                    total: o.meta.total
                                }),
                                $(o.pager).trigger("kt-datatable--on-update-perpage", o.meta),
                                $(tableInstance).trigger(o.paginateEvent, o.meta),
                                o.callback(o, o.meta), o.updateInfo.call()
                            },
                            addPaginateEvent: function (t) {
                                $(tableInstance).off(o.paginateEvent).on(o.paginateEvent, function (t, a) {
                                    r.spinnerCallback(!0),
                                    o.pager = $(tableInstance.table).siblings(".kt-datatable__pager");
                                    var n = $(o.pager).find(".kt-datatable__pager-nav");
                                    $(n).find(".kt-datatable__pager-link--active").removeClass("kt-datatable__pager-link--active"),
                                    $(n).find('.kt-datatable__pager-link-number[data-page="' + a.page + '"]')
                                        .addClass("kt-datatable__pager-link--active"),
                                    $(n).find(".kt-datatable__pager-link--prev").attr("data-page", Math.max(a.page - 1, 1)),
                                    $(n).find(".kt-datatable__pager-link--next").attr("data-page", Math.min(a.page + 1, a.pages)),
                                    $(o.pager).each(function () {
                                        $(this).find('.kt-pager-input[type="text"]').prop("value", a.page)
                                    }),
                                    $(o.pager).find(".kt-datatable__pager-nav").show(),
                                    a.pages <= 1 && $(o.pager).find(".kt-datatable__pager-nav").hide(),
                                    r.setDataSourceParam("pagination", {
                                        page: o.meta.page,
                                        pages: o.meta.pages,
                                        perpage: o.meta.perpage,
                                        total: o.meta.total
                                    }), 

                                    $(o.pager).find("select.kt-datatable__pager-size").val(a.perpage).attr("data-selected", a.perpage), 
                                    $(tableInstance.table).find('.kt-checkbox > [type="checkbox"]').prop("checked", !1), 
                                    $(tableInstance.table).find(".kt-datatable__row--active").removeClass("kt-datatable__row--active"),
                                    o.updateInfo.call(), o.pagingBreakpoint.call()
                                })
                            },
                            updateInfo: function () {
                                var t = Math.max(o.meta.perpage * (o.meta.page - 1) + 1, 1),
                                    a = Math.min(t + o.meta.perpage - 1, o.meta.total);
                                $(o.pager).find(".kt-datatable__pager-info").find(".kt-datatable__pager-detail").html(r.dataPlaceholder(r.getOption("translate.toolbar.pagination.items.info"), {
                                    start: t,
                                    end: -1 === o.meta.perpage ? o.meta.total : a,
                                    pageSize: -1 === o.meta.perpage || o.meta.perpage >= o.meta.total ? o.meta.total : o.meta.perpage,
                                    total: o.meta.total
                                }))
                            },
                            pagingBreakpoint: function () {
                                var t = $(tableInstance.table).siblings(".kt-datatable__pager").find(".kt-datatable__pager-nav");
                                if (0 !== e(t).length) {
                                    var a = r.getCurrentPage(),
                                        i = e(t).find(".kt-pager-input").closest("li");
                                    $(t).find("li").show(),
                                    $.each(r.getOption("toolbar.items.pagination.pages"), function (l, s) {
                                        if (n.isInResponsiveRange(l)) {
                                            switch (l) {
                                                case "desktop":
                                                case "tablet":
                                                    Math.ceil(a / s.pagesNumber), s.pagesNumber, s.pagesNumber;
                                                    e(i).hide(), o.meta = r.getDataSourceParam("pagination"), o.paginationUpdate();
                                                    break;
                                                case "mobile":
                                                    e(i).show(), e(t).find(".kt-datatable__pager-link--more-prev").closest("li").hide(), e(t).find(".kt-datatable__pager-link--more-next").closest("li").hide(), e(t).find(".kt-datatable__pager-link-number").closest("li").hide()
                                            }
                                            return !1
                                        }
                                    })
                                }
                            },
                            paginationUpdate: function () {
                                var t = $(tableInstance.table).siblings(".kt-datatable__pager").find(".kt-datatable__pager-nav"),
                                    a = $(t).find(".kt-datatable__pager-link--more-prev"),
                                    n = $(t).find(".kt-datatable__pager-link--more-next"),
                                    i = $(t).find(".kt-datatable__pager-link--first"),
                                    s = $(t).find(".kt-datatable__pager-link--prev"),
                                    d = $(t).find(".kt-datatable__pager-link--next"),
                                    c = $(t).find(".kt-datatable__pager-link--last"),
                                    u = $(t).find(".kt-datatable__pager-link-number"),
                                    p = Math.max($(u).first().data("page") - 1, 1);
                                $(a).each(function (t, a) {
                                    $(a).attr("data-page", p)
                                }), 
                                1 === p ? $(a).parent().hide() : $(a).parent().show();
                                var f = Math.min(e(u).last().data("page") + 1, o.meta.pages);
                                $(n).each(function (t, a) {
                                    $(n).attr("data-page", f).show()
                                }),
                                f === o.meta.pages && f === $(u).last().data("page") ? $(n).parent().hide() : $(n).parent().show(),
                                1 === o.meta.page ? ($(i).attr("disabled", !0).addClass("kt-datatable__pager-link--disabled"),
                                $(s).attr("disabled", !0).addClass("kt-datatable__pager-link--disabled")) : ($(i).removeAttr("disabled").removeClass("kt-datatable__pager-link--disabled"), e(s).removeAttr("disabled").removeClass("kt-datatable__pager-link--disabled")), o.meta.page === o.meta.pages ? (e(d).attr("disabled", !0).addClass("kt-datatable__pager-link--disabled"), e(c).attr("disabled", !0).addClass("kt-datatable__pager-link--disabled")) : (e(d).removeAttr("disabled").removeClass("kt-datatable__pager-link--disabled"), e(c).removeAttr("disabled").removeClass("kt-datatable__pager-link--disabled"));
                                var g = r.getOption("toolbar.items.pagination.navigation");
                                g.first || $(i).remove(), g.prev || $(s).remove(), g.next || $(d).remove(), g.last || $(c).remove()
                            }
                        };
                        return o.init(t), o
                    },
                    columnHide: function () {
                        var t = n.getViewPort().width;
                        $.each(i.columns, function (a, o) {
                            if (void 0 !== o.responsive) {
                                var i = o.field,
                                    r = e.grep(e(tableInstance.table).find(".kt-datatable__cell"), function (t, a) {
                                        return i === e(t).data("field")
                                    });
                                n.getBreakpoint(o.responsive.hidden) >= t ? $(r).hide() : $(r).show(),
                                n.getBreakpoint(o.responsive.visible) <= t ? $(r).show() : $(r).hide()
                            }
                        })
                    },
                    setupSubDatatable: function () {
                        var t = r.getOption("detail.content");
                        if ("function" == typeof t && !($(tableInstance.table).find(".kt-datatable__subtable").length > 0)) {
                            $(tableInstance.wrap).addClass("kt-datatable--subtable"), i.columns[0].subtable = !0;
                            var a = function (a) {
                                a.preventDefault();
                                var n = e(this).closest(".kt-datatable__row"),
                                    o = e(n).next(".kt-datatable__row-subtable");
                                0 === $(o).length && (o = $("<tr/>").addClass("kt-datatable__row-subtable kt-datatable__row-loading").hide().append(e("<td/>").addClass("kt-datatable__subtable").attr("colspan", r.getTotalColumns())), e(n).after(o), e(n).hasClass("kt-datatable__row--even") && e(o).addClass("kt-datatable__row-subtable--even")), e(o).toggle();
                                var s = e(o).find(".kt-datatable__subtable"),
                                    d = e(this).closest("[data-field]:first-child").find(".kt-datatable__toggle-subtable").data("value"),
                                    c = e(this).find("i").removeAttr("class");
                                e(n).hasClass("kt-datatable__row--subtable-expanded") ? (e(c).addClass(r.getOption("layout.icons.rowDetail.collapse")), e(n).removeClass("kt-datatable__row--subtable-expanded"), e(l).trigger("kt-datatable--on-collapse-subtable", [n])) : (e(c).addClass(r.getOption("layout.icons.rowDetail.expand")), e(n).addClass("kt-datatable__row--subtable-expanded"), e(l).trigger("kt-datatable--on-expand-subtable", [n])), 0 === e(s).find(".kt-datatable").length && (e.map(l.dataSet, function (t, e) {
                                    return d === t[i.columns[0].field] && (a.data = t, !0)
                                }), a.detailCell = s, a.parentRow = n, a.subTable = s, t(a), e(s).children(".kt-datatable").on("kt-datatable--on-init", function (t) {
                                    e(o).removeClass("kt-datatable__row-loading")
                                }), "local" === r.getOption("data.type") && e(o).removeClass("kt-datatable__row-loading"))
                            },
                                n = i.columns;
                            e(tableInstance.tableBody).find(".kt-datatable__row").each(function (t, o) {
                                e(o).find(".kt-datatable__cell").each(function (t, o) {
                                    var i = e.grep(n, function (t, a) {
                                        return e(o).data("field") === t.field
                                    })[0];
                                    if (void 0 !== i) {
                                        var l = e(o).text();
                                        if (void 0 !== i.subtable && i.subtable) {
                                            if (e(o).find(".kt-datatable__toggle-subtable").length > 0) return;
                                            e(o).html(e("<a/>").addClass("kt-datatable__toggle-subtable").attr("href", "#").attr("data-value", l).attr("title", r.getOption("detail.title")).on("click", a).append(e("<i/>").css("width", e(o).data("width")).addClass(r.getOption("layout.icons.rowDetail.collapse"))))
                                        }
                                    }
                                })
                            })
                        }
                    },
                    dataMapCallback: function (t) {
                        var e = t;
                        return "function" == typeof r.getOption("data.source.read.map") ? r.getOption("data.source.read.map")(t) : (void 0 !== t && void 0 !== t.data && (e = t.data), e)
                    },
                    isSpinning: !1,
                    spinnerCallback: function (t, e) {
                        tableInstance.trigger("spinnerCallback",[ t,e ])
                    },
                    sortCallback: function (t, a, n) {
                        var o = n.type || "string",
                            i = n.format || "",
                            l = n.field;
                        return e(t).sort(function (t, e) {
                            var n = t[l],
                                r = e[l];
                            switch (o) {
                                case "date":
                                    if ("undefined" == typeof moment) throw new Error("Moment.js is required.");
                                    var s = moment(n, i).diff(moment(r, i));
                                    return "asc" === a ? s > 0 ? 1 : s < 0 ? -1 : 0 : s < 0 ? 1 : s > 0 ? -1 : 0;
                                case "number":
                                    return isNaN(parseFloat(n)) && null != n && (n = Number(n.replace(/[^0-9\.-]+/g, ""))), isNaN(parseFloat(r)) && null != r && (r = Number(r.replace(/[^0-9\.-]+/g, ""))), n = parseFloat(n), r = parseFloat(r), "asc" === a ? n > r ? 1 : n < r ? -1 : 0 : n < r ? 1 : n > r ? -1 : 0;
                                case "string":
                                default:
                                    return "asc" === a ? n > r ? 1 : n < r ? -1 : 0 : n < r ? 1 : n > r ? -1 : 0
                            }
                        })
                    },
                    log: function (t, e) {
                        void 0 === e && (e = ""), tableInstance.debug && console.log(t, e)
                    },
                    autoHide: function () {
                        var t = !1,
                            a = $(tableInstance.table).find("[data-autohide-enabled]");
                        a.length && (t = !0, a.hide());
                        var n = function (t) {
                            t.preventDefault();
                            var a = e(this).closest(".kt-datatable__row"),
                                n = e(a).next();
                            if (e(n).hasClass("kt-datatable__row-detail")) e(this).find("i").removeClass(r.getOption("layout.icons.rowDetail.expand")).addClass(r.getOption("layout.icons.rowDetail.collapse")), e(n).remove();
                            else {
                                $(this).find("i").removeClass(r.getOption("layout.icons.rowDetail.collapse")).addClass(r.getOption("layout.icons.rowDetail.expand"));
                                var o = e(a).find(".kt-datatable__cell:hidden").clone().show();
                                n = e("<tr/>").addClass("kt-datatable__row-detail").insertAfter(a);
                                var l = e("<td/>").addClass("kt-datatable__detail").attr("colspan", r.getTotalColumns()).appendTo(n),
                                    s = e("<table/>");
                                e(o).each(function () {
                                    var t = e(this).data("field"),
                                        a = e.grep(i.columns, function (e, a) {
                                            return t === e.field
                                        })[0];
                                    e(s).append(e('<tr class="kt-datatable__row"></tr>').append(e('<td class="kt-datatable__cell"></td>').append(e("<span/>").append(a.title))).append(this))
                                }), e(l).append(s)
                            }
                        };
                        setTimeout(function () {
                            $(tableInstance.table).find(".kt-datatable__cell").show(),
                            $(tableInstance.tableBody).each(function () {
                                for (var a = 0; $(this)[0].offsetWidth < $(this)[0].scrollWidth && a < i.columns.length;) $(tableInstance.table).find(".kt-datatable__row").each(function (a) {
                                    var n = e(this).find(".kt-datatable__cell:not(:hidden):not([data-autohide-disabled])").last();
                                    e(n).hide(), t = !0
                                }), a++
                            }), t && $(tableInstance.tableBody).find(".kt-datatable__row").each(function () {
                                0 === $(this).find(".kt-datatable__toggle-detail").length 
                                    && 
                                    $(this).prepend($("<td/>").addClass("kt-datatable__cell kt-datatable__toggle-detail").append(e("<a/>").addClass("kt-datatable__toggle-detail").attr("href", "").on("click", n).append('<i class="' + r.getOption("layout.icons.rowDetail.collapse") + '"></i>'))),
                                    0 === $(tableInstance.tableHead).find(".kt-datatable__toggle-detail").length ? ($(tableInstance.tableHead).find(".kt-datatable__row").first().prepend('<th class="kt-datatable__cell kt-datatable__toggle-detail"><span></span></th>'),
                                        $(tableInstance.tableFoot).find(".kt-datatable__row").first().prepend('<th class="kt-datatable__cell kt-datatable__toggle-detail"><span></span></th>')) : $(tableInstance.tableHead).find(".kt-datatable__toggle-detail").find("span")
                            })
                        }), r.adjustCellsWidth.call()
                    },
                    setAutoColumns: function () {
                        r.getOption("data.autoColumns") && ($.each(tableInstance.dataSet[0], function (t, a) {
                            0 === $.grep(i.columns, function (e, a) {
                                return t === e.field
                            }).length && i.columns.push({
                                field: t,
                                title: t
                            })
                        }), 
                        $(tableInstance.tableHead).find(".kt-datatable__row").remove(), r.setHeadTitle(),
                        r.getOption("layout.footer") && (e(l.tableFoot).find(".kt-datatable__row").remove(),
                            r.setHeadTitle(tableInstance.tableFoot)))
                    },
                    isLocked: function () {
                        var t = r.lockEnabledColumns();
                        return t.left.length > 0 || t.right.length > 0
                    },
                    isSubtable: function () {
                        return n.hasClass(tableInstance.wrap[0], "kt-datatable--subtable") || !1
                    },
                    getExtraSpace: function (t) {
                        return parseInt($(t).css("paddingRight")) + parseInt(e(t).css("paddingLeft")) + (parseInt(e(t).css("marginRight")) + parseInt(e(t).css("marginLeft"))) + Math.ceil(e(t).css("border-right-width").replace("px", ""))
                    },
                    dataPlaceholder: function (t, a) {
                        var n = t;
                        return e.each(a, function (t, e) {
                            n = n.replace("{{" + t + "}}", e)
                        }), n
                    },
                    getTableId: function (t) {
                        void 0 === t && (t = "");
                        var a = $(tableInstance).attr("id");
                        return void 0 === a && (a = e(l).attr("class").split(" ")[0]), a + t
                    },
                    getTablePrefix: function (t) {
                        return void 0 !== t && (t = "-" + t), r.getTableId() + "-" + r.getDepth() + t
                    },
                    getDepth: function () {
                        var t = 0,
                            a = tableInstance.table;
                        do {
                            a = e(a).parents(".kt-datatable__table"), t++
                        } while (e(a).length > 0);
                        return t
                    },
                    stateKeep: function (t, e) {
                        t = r.getTablePrefix(t), !1 !== r.getOption("data.saveState") && (r.getOption("data.saveState.webstorage") && localStorage && localStorage.setItem(t, JSON.stringify(e)), r.getOption("data.saveState.cookie") && Cookies.set(t, JSON.stringify(e)))
                    },
                    stateGet: function (t, e) {
                        if (t = r.getTablePrefix(t), !1 !== r.getOption("data.saveState")) {
                            var a = null;
                            return null != (a = r.getOption("data.saveState.webstorage") && localStorage ? localStorage.getItem(t) : Cookies.get(t)) ? JSON.parse(a) : void 0
                        }
                    },
                    stateUpdate: function (t, a) {
                        var n = r.stateGet(t);
                        null == n && (n = {}), r.stateKeep(t, e.extend({}, n, a))
                    },
                    stateRemove: function (t) {
                        t = r.getTablePrefix(t), localStorage && localStorage.removeItem(t), Cookies.remove(t)
                    },
                    getTotalColumns: function (t) {
                        return void 0 === t && (t = tableInstance.tableBody), $(t).find(".kt-datatable__row").first().find(".kt-datatable__cell").length
                    },
                    getOneRow: function (t, a, n) {
                        void 0 === n && (n = !0);
                        var o = $(t).find(".kt-datatable__row:not(.kt-datatable__row-detail):nth-child(" + a + ")");
                        return n && (o = o.find(".kt-datatable__cell")), o
                    },
                    sortColumn: function (t, a, n) {
                        void 0 === a && (a = "asc"), void 0 === n && (n = !1);
                        var o = e(t).index(),
                            i = e(l.tableBody).find(".kt-datatable__row"),
                            r = e(t).closest(".kt-datatable__lock").index(); - 1 !== r && (i = e(l.tableBody).find(".kt-datatable__lock:nth-child(" + (r + 1) + ")").find(".kt-datatable__row"));
                        var s = e(i).parent();
                        e(i).sort(function (t, i) {
                            var l = e(t).find("td:nth-child(" + o + ")").text(),
                                r = e(i).find("td:nth-child(" + o + ")").text();
                            return n && (l = parseInt(l), r = parseInt(r)), "asc" === a ? l > r ? 1 : l < r ? -1 : 0 : l < r ? 1 : l > r ? -1 : 0
                        }).appendTo(s)
                    },
                    sorting: function () {
                        var t = {
                            init: function () {
                                i.sortable && ($(tableInstance.tableHead).find(".kt-datatable__cell:not(.kt-datatable__cell--check)").addClass("kt-datatable__cell--sort").off("click").on("click", t.sortClick),
                                    t.setIcon())
                            },
                            setIcon: function () {
                                var t = r.getDataSourceParam("sort");
                                if (!e.isEmptyObject(t)) {
                                    var a = r.getColumnByField(t.field);
                                    if (void 0 === a || void 0 === a.sortable || !1 !== a.sortable) {
                                        var n = $(tableInstance.tableHead).find('.kt-datatable__cell[data-field="' + t.field + '"]').attr("data-sort", t.sort),
                                            o = $(n).find("span"),
                                            i = $(o).find("i"),
                                            s = r.getOption("layout.icons.sort");
                                        $(i).length > 0 ? e(i).removeAttr("class").addClass(s[t.sort]) : e(o).append(e("<i/>").addClass(s[t.sort])), e(n).addClass("kt-datatable__cell--sorted")
                                    }
                                }
                            },
                            sortClick: function (a) {
                                var o = r.getDataSourceParam("sort"),
                                    s = e(this).data("field"),
                                    d = r.getColumnByField(s);
                                if ((void 0 === d.sortable || !1 !== d.sortable) 
                                    && 
                                    ($(tableInstance.tableHead).find("th").removeClass("kt-datatable__cell--sorted"), 
                                        n.addClass(this, "kt-datatable__cell--sorted"),
                                        $(tableInstance.tableHead).find(".kt-datatable__cell > span > i").remove(), i.sortable)) {
                                    r.spinnerCallback(!0);
                                    var c = "desc";
                                    r.getObject("field", o) === s && (c = r.getObject("sort", o)), o = {
                                        field: s,
                                        sort: c = void 0 === c || "desc" === c ? "asc" : "desc"
                                    }, r.setDataSourceParam("sort", o), t.setIcon(), setTimeout(function () {
                                        r.dataRender("sort"),
                                        $(tableInstance).trigger("kt-datatable--on-sort", o)
                                    }, 300)
                                }
                            }
                        };
                        t.init()
                    },
                    localDataUpdate: function () {
                        var t = r.getDataSourceParam();
                        void 0 === tableInstance.originalDataSet && (tableInstance.originalDataSet = tableInstance.dataSet);
                        var a = r.getObject("sort.field", t),
                            n = r.getObject("sort.sort", t),
                            o = r.getColumnByField(a);
                        if (void 0 !== o && !0 !== r.getOption("data.serverSorting") ? "function" == typeof o.sortCallback ?

                         tableInstance.dataSet = o.sortCallback(tableInstance.originalDataSet, n, o) 
                         : tableInstance.dataSet = r.sortCallback(tableInstance.originalDataSet, n, o) 
                         : tableInstance.dataSet = tableInstance.originalDataSet,
                         "object" == typeof t.query && !r.getOption("data.serverFiltering")) {
                            t.query = t.query || {};
                            var i = function (t) {
                                for (var e in t)
                                    if (t.hasOwnProperty(e))
                                        if ("string" == typeof t[e]) {
                                            if (t[e].toLowerCase() == s || -1 !== t[e].toLowerCase().indexOf(s)) return !0
                                        } else if ("number" == typeof t[e]) {
                                            if (t[e] === s) return !0
                                        } else if ("object" == typeof t[e] && i(t[e])) return !0;
                                return !1
                            },
                                s = e(r.getOption("search.input")).val();
                            void 0 !== s && "" !== s && (s = s.toLowerCase(), tableInstance.dataSet = e.grep(tableInstance.dataSet, i), delete t.query[r.getGeneralSearchKey()]), e.each(t.query, function (e, a) {
                                "" === a && delete t.query[e]
                            }), tableInstance.dataSet = r.filterArray(tableInstance.dataSet, t.query), tableInstance.dataSet = tableInstance.dataSet.filter(function () {
                                return !0
                            })
                        }
                        return tableInstance.dataSet
                    },
                    filterArray: function (t, a, n) {
                        if ("object" != typeof t) return [];
                        if (void 0 === n && (n = "AND"), "object" != typeof a) return t;
                        if (n = n.toUpperCase(), -1 === e.inArray(n, ["AND", "OR", "NOT"])) return [];
                        var o = Object.keys(a).length,
                            i = [];
                        return e.each(t, function (t, l) {
                            var s = l,
                                d = 0;
                            $.each(a, function (t, e) {
                                e = e instanceof Array ? e : [e];
                                var a = r.getObject(t, s);
                                if (void 0 !== a && a) {
                                    var n = a.toString().toLowerCase();
                                    $.forEach(function (t, e) {
                                        t.toString().toLowerCase() != n && -1 === n.indexOf(t.toString().toLowerCase()) || d++
                                    })
                                }
                            }), ("AND" == n && d == o || "OR" == n && d > 0 || "NOT" == n && 0 == d) && (i[t] = l)
                        }), t = i
                    },
                    resetScroll: function () {
                        void 0 === i.detail && 1 === r.getDepth() && ($(tableInstance.table).find(".kt-datatable__row").css("left", 0),
                            $(tableInstance.table).find(".kt-datatable__lock").css("top", 0), 
                            $(tableInstance.tableBody).scrollTop(0))
                    },
                    getColumnByField: function (t) {
                        var a;
                        if (void 0 !== t) return e.each(i.columns, function (e, n) {
                            if (t === n.field) return a = n, !1
                        }), a
                    },
                    getDefaultSortColumn: function () {
                        var t;
                        return $.each(i.columns, function (a, n) {
                            if (void 0 !== n.sortable && -1 !== e.inArray(n.sortable, ["asc", "desc"])) return t = {
                                sort: n.sortable,
                                field: n.field
                            }, !1
                        }), t
                    },
                    getHiddenDimensions: function (t, a) {
                        var n = {
                            position: "absolute",
                            visibility: "hidden",
                            display: "block"
                        },
                            o = {
                                width: 0,
                                height: 0,
                                innerWidth: 0,
                                innerHeight: 0,
                                outerWidth: 0,
                                outerHeight: 0
                            },
                            i = e(t).parents().addBack().not(":visible");
                        a = "boolean" == typeof a && a;
                        var l = [];
                        return i.each(function () {
                            var t = {};
                            for (var e in n) t[e] = this.style[e], this.style[e] = n[e];
                            l.push(t)
                        }), o.width = e(t).width(), o.outerWidth = e(t).outerWidth(a), o.innerWidth = e(t).innerWidth(), o.height = e(t).height(), o.innerHeight = e(t).innerHeight(), o.outerHeight = e(t).outerHeight(a), i.each(function (t) {
                            var e = l[t];
                            for (var a in n) this.style[a] = e[a]
                        }), o
                    },
                    getGeneralSearchKey: function () {
                        var t = e(r.getOption("search.input"));
                        return e(t).prop("name") || e(t).prop("id")
                    },
                    getObject: function (t, e) {
                        return t.split(".").reduce(function (t, e) {
                            return null !== t && void 0 !== t[e] ? t[e] : null
                        }, e)
                    },
                    extendObj: function (t, e, a) {
                        var n = e.split("."),
                            o = 0;
                        return function t(e) {
                            var i = n[o++];
                            void 0 !== e[i] && null !== e[i] ? "object" != typeof e[i] && "function" != typeof e[i] && (e[i] = {}) : e[i] = {}, o === n.length ? e[i] = a : t(e[i])
                        }(t), t
                    },
                    rowEvenOdd: function () {
                        $(tableInstance.tableBody).find(".kt-datatable__row").removeClass("kt-datatable__row--even"),
                        $(tableInstance.wrap).hasClass("kt-datatable--subtable") ? 
                        $(tableInstance.tableBody).find(".kt-datatable__row:not(.kt-datatable__row-detail):even").addClass("kt-datatable__row--even") : 
                        $(tableInstance.tableBody).find(".kt-datatable__row:nth-child(even)").addClass("kt-datatable__row--even")
                    },
                    timer: 0,
                    redraw: function () {
                        return r.adjustCellsWidth.call(), r.isLocked() && (r.scrollbar(), r.resetScroll(),
                            r.adjustCellsHeight.call()), r.adjustLockContainer.call(), r.initHeight.call(), tableInstance
                    },
                    load: function () {
                        return r.reload(), tableInstance
                    },
                    reload: function () {
                        return function (t, e) {
                            clearTimeout(r.timer), r.timer = setTimeout(t, e)
                        }(function () {
                            i.data.serverFiltering || r.localDataUpdate(), r.dataRender(), e(tableInstance).trigger("kt-datatable--on-reloaded")
                        }, r.getOption("search.delay")), tableInstance
                    },
                    getRecord: function (t) {
                        return void 0 === tableInstance.tableBody && (tableInstance.tableBody = e(tableInstance.table).children("tbody")),
                        $(tableInstance.tableBody).find(".kt-datatable__cell:first-child").each(function (a, n) {
                            if (t == e(n).text()) {
                                var o = e(n).closest(".kt-datatable__row").index() + 1;
                                return tableInstance.API.record = tableInstance.API.value = r.getOneRow(tableInstance.tableBody, o), tableInstance
                            }
                        }), tableInstance
                    },
                    getColumn: function (colId) {
                        return r.setSelectedRecords(), tableInstance.API.value = $(tableInstance.API.record).find('[data-field="' + colId + '"]'), tableInstance
                    },

                    getVisibleFields: function () {
                        return tableInstance.tableHead.find('tr > th').map(function(index, column) {
                        	if(!($(this).is(":hidden"))){
                        		return $(this).data('field');
                        	}else{
                        		return null;
                        	}
                        });
                    },
                    destroy: function () {
                        $(tableInstance).parent().find(".kt-datatable__pager").remove();
                        var t = $(tableInstance.initialDatatable).addClass("kt-datatable--destroyed").show();
                        return $(tableInstance).replaceWith(t), e(tableInstance = t).trigger("kt-datatable--on-destroy"), r.isInit = !1, t = null
                    },
                    sort: function (column, sort) {
                        sort = void 0 === sort ? "asc" : sort, r.spinnerCallback(!0);
                        var n = {
                            field: column,
                            sort: sort
                        };
                        return r.setDataSourceParam("sort", n), setTimeout(function () {
                            r.dataRender("sort"),
                            $(tableInstance).trigger("kt-datatable--on-sort", n),
                            $(tableInstance.tableHead).find(".kt-datatable__cell > span > i").remove()
                        }, 300), tableInstance
                    },
                    getValue: function () {
                        return $(tableInstance.API.value).text()
                    },
                    setActive: function (t) {
                        "string" == typeof t && 
                            (t = $(tableInstance.tableBody).find('.kt-checkbox--single > [type="checkbox"][value="' + t + '"]')),
                            e(t).prop("checked", !0);
                        var a = [];
                        e(t).each(function (t, n) {
                            var o = e(n).closest("tr").addClass("kt-datatable__row--active"),
                                i = e(o).index() + 1;
                            e(o).closest("tbody").find("tr:nth-child(" + i + ")").not(".kt-datatable__row-subtable").addClass("kt-datatable__row--active");
                            var l = e(n).attr("value");
                            void 0 !== l && a.push(l)
                        }),
                        $(tableInstance).trigger("kt-datatable--on-check", [a])
                    },
                    setInactive: function (t) {
                        "string" == typeof t && (t = e(l.tableBody).find('.kt-checkbox--single > [type="checkbox"][value="' + t + '"]')), e(t).prop("checked", !1);
                        var a = [];
                        $(t).each(function (t, n) {
                            var o = e(n).closest("tr").removeClass("kt-datatable__row--active"),
                                i = e(o).index() + 1;
                            e(o).closest("tbody").find("tr:nth-child(" + i + ")").not(".kt-datatable__row-subtable").removeClass("kt-datatable__row--active");
                            var l = e(n).attr("value");
                            void 0 !== l && a.push(l)
                        }),
                        $(tableInstance).trigger("kt-datatable--on-uncheck", [a])
                    },
                    setActiveAll: function (t) {
                        var a = $(tableInstance.table).find("> tbody, > thead").find("tr").not(".kt-datatable__row-subtable").find('.kt-datatable__cell--check [type="checkbox"]');
                        t ? r.setActive(a) : r.setInactive(a)
                    },
                    setSelectedRecords: function () {
                        return tableInstance.API.record = $(tableInstance.tableBody).find(".kt-datatable__row--active"), tableInstance
                    },
                    getSelectedRecords: function () {
                        return r.setSelectedRecords(), tableInstance.API.record = tableInstance.rows(".kt-datatable__row--active").nodes(), tableInstance.API.record
                    },
                    getOption: function (t) {
                        return r.getObject(t, i)
                    },
                    setOption: function (t, e) {
                        i = r.extendObj(i, t, e)
                    },
                    search: function (t, a) {
                        void 0 !== a && (a = e.makeArray(a)), n = function () {
                            var n = r.getDataSourceQuery();
                            if (void 0 === a && void 0 !== t) {
                                var o = r.getGeneralSearchKey();
                                n[o] = t
                            }
                            "object" == typeof a && (e.each(a, function (e, a) {
                                n[a] = t
                            }), $.each(n, function (t, a) {
                                ("" === a || e.isEmptyObject(a)) && delete n[t]
                            })), r.setDataSourceQuery(n), i.data.serverFiltering || r.localDataUpdate(), r.dataRender("search")
                        }, o = r.getOption("search.delay"), clearTimeout(r.timer), r.timer = setTimeout(n, o);
                        var n, o
                    },
                    setDataSourceParam: function (t, a) {
                        tableInstance.API.params = $.extend({}, {
                            pagination: {
                                page: 1,
                                perpage: r.getOption("data.pageSize")
                            },
                            sort: r.getDefaultSortColumn(),
                            query: {}
                        }, 

                        tableInstance.API.params, r.stateGet(r.stateId)),
                        tableInstance.API.params = r.extendObj(tableInstance.API.params, t, a), 
                        r.stateKeep(r.stateId, tableInstance.API.params)
                    },
                    getDataSourceParam: function (t) {
                        return tableInstance.API.params = e.extend({}, {
                            pagination: {
                                page: 1,
                                perpage: r.getOption("data.pageSize")
                            },
                            sort: r.getDefaultSortColumn(),
                            query: {}
                        },

                        tableInstance.API.params, r.stateGet(r.stateId)), 
                        "string" == typeof t ? r.getObject(t, tableInstance.API.params) : tableInstance.API.params
                    },
                    getDataSourceQuery: function () {
                        return r.getDataSourceParam("query") || {}
                    },
                    setDataSourceQuery: function (t) {
                        r.setDataSourceParam("query", t)
                    },
                    getCurrentPage: function () {
                        return $(tableInstance.table)
                            .siblings(".kt-datatable__pager")
                            .last()
                            .find(".kt-datatable__pager-nav")
                            .find(".kt-datatable__pager-link.kt-datatable__pager-link--active")
                            .data("page") 
                            || 1
                    },
                    getPageSize: function () {
                        return $(tableInstance.table)
                        .siblings(".kt-datatable__pager")
                        .last()
                        .find("select.kt-datatable__pager-size").val() 
                        || 10
                    },
                    getTotalRows: function () {
                        return tableInstance.API.params.pagination.total
                    },
                    getDataSet: function () {
                        return tableInstance.originalDataSet
                    },
                    hideColumn: function (column_name) {

                        $.map(i.columns, function (e) {
                            return column_name === e.field && (e.responsive = {
                                hidden: "xl"
                            }), e
                        });
                        var hideColumn = $.grep($(tableInstance.table).find(".kt-datatable__cell"), function (column_cell, index) {
                            return column_name === $(column_cell).data("field")
                        });
                        $(hideColumn).hide()
                    },
                    showColumn: function (column_name) {
                        $.map(i.columns, function (e) {
                            return column_name === e.field && delete e.responsive, e
                        });
                        var showColumn = $.grep($(tableInstance.table).find(".kt-datatable__cell"), function (column_cell, index) {
                            return column_name === $(column_cell).data("field")
                        });
                        $(showColumn).show()
                    },
                    nodeTr: [],
                    nodeTd: [],
                    nodeCols: [],
                    recentNode: [],
                    table: function () {
                        if (void 0 !== tableInstance.table) return tableInstance.table
                    },
                    row: function (t) {
                        return r.rows(t), r.nodeTr = r.recentNode = e(r.nodeTr).first(), tableInstance
                    },
                    rows: function (e) {
                        return 
                        r.isLocked() ? 
                        r.nodeTr = r.recentNode = t(tableInstance.tableBody).find(e).filter(".kt-datatable__lock--scroll > .kt-datatable__row") 
                            :
                        r.nodeTr = r.recentNode = t(tableInstance.tableBody).find(e).filter(".kt-datatable__row"), 
                        tableInstance
                    },
                    column: function (t) {
                        return r.nodeCols = r.recentNode = e(l.tableBody).find(".kt-datatable__cell:nth-child(" + (t + 1) + ")"), tableInstance
                    },
                    columns: function (t) {
                        var a = tableInstance.table;
                        r.nodeTr === r.recentNode && (a = r.nodeTr);
                        var n = $(a).find('.kt-datatable__cell[data-field="' + t + '"]');
                        return n.length > 0 ? r.nodeCols = r.recentNode = n : r.nodeCols = r.recentNode = $(a).find(t).filter(".kt-datatable__cell"), l
                    },
                    cell: function (t) {
                        return r.cells(t), r.nodeTd = r.recentNode = e(r.nodeTd).first(), tableInstance
                    },
                    cells: function (t) {
                        var a = $(tableInstance.tableBody).find(".kt-datatable__cell");
                        return void 0 !== t && (a = $(a).filter(t)), r.nodeTd = r.recentNode = a, tableInstance
                    },
                    remove: function () {
                        return $(r.nodeTr.length) && r.nodeTr === r.recentNode && $(r.nodeTr).remove(), r.layoutUpdate(), tableInstance
                    },
                    visible: function (t) {
                        if (e(r.recentNode.length)) {
                            var a = r.lockEnabledColumns();
                            if (r.recentNode === r.nodeCols) {
                                var n = r.recentNode.index();
                                if (r.isLocked()) {
                                    var o = $(r.recentNode).closest(".kt-datatable__lock--scroll").length;
                                    o ? n += a.left.length + 1 : $(r.recentNode).closest(".kt-datatable__lock--right").length && (n += a.left.length + o + 1)
                                }
                            }
                            t ? (r.recentNode === r.nodeCols && delete i.columns[n].responsive, e(r.recentNode).show()) : (r.recentNode === r.nodeCols && r.setOption("columns." + n + ".responsive", {
                                hidden: "xl"
                            }), e(r.recentNode).hide()), r.redraw()
                        }
                    },
                    nodes: function () {
                        return r.recentNode
                    },
                    dataset: function () {
                        return tableInstance
                    },
                    gotoPage: function (t) {
                        r.pagingObject.openPage(t)
                    }
                };
                if ($.each(r, function (t, e) {
                    tableInstance[t] = e
                }), void 0 !== i)
                    if ("string" == typeof i) {
                        var s = i;
                        void 0 !== (tableInstance = $(this).data(a)) && (i = tableInstance.options, r[s].apply(this, Array.prototype.slice.call(arguments, 1)))
                    } else tableInstance.data(a) || $(this).hasClass("kt-datatable--loaded") || (tableInstance.dataSet = null, tableInstance.textAlign = {
                        left: "kt-datatable__cell--left",
                        center: "kt-datatable__cell--center",
                        right: "kt-datatable__cell--right"
                    }, i = e.extend(!0, {}, e.fn.KTDatatable.defaults, i), tableInstance.options = i, r.init.apply(this, [i]), e(tableInstance.wrap).data(a, tableInstance));
                else void 0 === (tableInstance = e(this).data(a)) && e.error("KTDatatable not initialized"), i = tableInstance.options;
                return tableInstance
            }
            console.log("No KTDatatable element exist.")
        },

        jQuery.fn.KTDatatable.defaults = {
            data: {
                type: "local",
                source: null,
                pageSize: 10,
                saveState: {
                    cookie: !1,
                    webstorage: !0
                },
                serverPaging: !1,
                serverFiltering: !1,
                serverSorting: !1,
                autoColumns: !1,
                attr: {
                    rowProps: []
                }
            },
            layout: {
                theme: "default",
                class: "kt-datatable--brand",
                scroll: !1,
                height: null,
                minHeight: 300,
                footer: !1,
                header: !0,
                customScrollbar: !0,
                spinner: {
                    overlayColor: "#000000",
                    opacity: 0,
                    type: "loader",
                    state: "brand",
                    message: !0
                },
                icons: {
                    sort: {
                        asc: "icofont-arrow-up",
                        desc: "icofont-arrow-down"
                    },
                    pagination: {
                        next: "icofont-arrow-right",
                        prev: "icofont-arrow-left",
                        first: "icofont-ui-previous",
                        last: "icofont-ui-next",
                        more: "icofont-navigation-menu"
                    },
                    rowDetail: {
                        expand: "icofont-expand-alt",
                        collapse: "icofont-collapse"
                    }
                }
            },
            sortable: !0,
            resizable: !1,
            filterable: !1,
            pagination: !0,
            editable: !1,
            columns: [],
            search: {
                onEnter: !1,
                input: null,
                delay: 400
            },
            rows: {
                callback: function () { },
                beforeTemplate: function () { },
                afterTemplate: function () { },
                autoHide: !0
            },
            toolbar: {
                layout: ["pagination", "info"],
                placement: ["bottom"],
                items: {
                    pagination: {
                        type: "default",
                        pages: {
                            desktop: {
                                layout: "default",
                                pagesNumber: 5
                            },
                            tablet: {
                                layout: "default",
                                pagesNumber: 3
                            },
                            mobile: {
                                layout: "compact"
                            }
                        },
                        navigation: {
                            prev: !0,
                            next: !0,
                            first: !0,
                            last: !0
                        },
                        pageSizeSelect: []
                    },
                    info: !0
                }
            },
            translate: {
                records: {
                    processing: "Please wait...",
                    noRecords: "No records found"
                },
                toolbar: {
                    pagination: {
                        items: {
                            default: {
                                first: "First",
                                prev: "Previous",
                                next: "Next",
                                last: "Last",
                                more: "More pages",
                                input: "Page number",
                                select: "Select page size",
                                all: "all"
                            },
                            info: "Showing {{start}} - {{end}} of {{total}}"
                        }
                    }
                }
            },
            extensions: {}
        }
    }(jQuery);


    a(jQuery);
    //b();

    $.fn.ktdtSerializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };