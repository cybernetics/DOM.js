/*
 *  DOM.js
 *
 *  Author: Richard Gorman
 *  Version: 1.1.0
 *
 *  @todo:
 *  - Add comments O_O
 *______________________*/




(function( window ) {

    'use strict';

    var DOM = function( selector, context ) {
        return new DOM.init( selector, context );
    };

    var _isElement = function( obj ) {
        return obj.nodeType === 1;
    }

    var _isDocument = function( obj ) {
        return obj.nodeType === 9;
    } 

    var _query = function( selector, context, p ) {
        var match, matches;

        context = context || document;

        if ( typeof selector !== 'string' ) {
            console.error('DOM - ' + selector + ' is not a valid selector.');
            return p = false;
        }

        if ( ! _isElement( context ) && ! _isDocument( context ) ) {
            console.error('DOM - ' + context + ' is not a valid scontext.');
            return p = false;
        }

        matches = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/.exec( selector );

        if ( matches !== null ) {

            // #id
            if ( matches[1] !== undefined ) {

                if ( _isDocument( context ) ) {
                    match = document.getElementById( matches[1] );

                    if ( match !== null ) {
                        p.push( match );
                    }
                }
            }

            // <tag>
            else if (matches[2] !== undefined) {
                [].push.apply( p, document.getElementsByTagName( matches[2] ) );
            }

            // .class
            else if (matches[3] !== undefined) {
                [].push.apply( p, document.getElementsByClassName( matches[3] ) );
            }
        }
        else {
            [].push.apply( p, document.querySelectorAll( selector ) );
        }

        return true;
    };

    DOM.prototype.extend = DOM.extend = function() {
        var target = this,
            i = 0,
            key;

        if ( arguments.length > 1 ) {
            target = arguments[0];
            i = 1;
        }

        for ( ; i < arguments.length; i++ ) {
            for ( key in arguments[i] ) {
                if ( arguments[i].hasOwnProperty( key ) ) {
                    target[key] = arguments[i][key];
                }
            }
        }

        return target;
    };

    DOM.extend({

        each: function(object, callback) {
            if (!object) {
                return false;
            }

            for (var i = object.length; i--;) {
                callback.apply(object[i], [i]);
            }

            return this;
        },

        init: function( selector, context ) {

            // Stop here if no selector found.
            if ( ! selector ) {
                return false;
            }

            // Just return here if selector is already a DOM object.
            if ( selector instanceof DOM ) {
                return selector;
            }
            
            // If the selector is a single node then return it.
            if ( _isElement( selector ) || _isDocument( selector ) ) {
                this[0] = selector;
                this.length = 1;

                return this;
            }

            // Okay so we actually have to go and find something...

            this.length = 0;

            // We need to borrow some array functions...
            this.pop = [].pop;
            this.push = [].push;
            this.splice = [].splice;

            // If selector is an Array then iterate, check for nodes, setup and return them.
            if (Array.isArray(selector)) {
                for (var i = selector.length; i--;) {
                    if ( _isElement( selector[i] ) || _isDocument( selector[i] ) ) {
                        this[i] = selector[i];
                        this.length++;
                    }
                }

                return this;
            }

            // Ok, the selector should be a string. Let's query the DOM.
            _query( selector, this.context, this );

            return this;
        },

        onanimationend: (function() {
            var t, el = document.createElement('fakeelement'),

            animations = {
                'animation':'animationend',
                'OAnimation':'oAnimationEnd',
                'MozAnimation':'animationend',
                'WebkitAnimation':'webkitAnimationEnd'
            }

            for (t in animations) {
                if(el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(),

        ontransitionend: (function() {
            var t, el = document.createElement('fakeelement'),

            transitions = {
                'transition':'transitionend',
                'OTransition':'oTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            }

            for (t in transitions) {
                if(el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        })(),

        touchsupport: (function() {
            return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
        })()

    });

    DOM.prototype.extend({

        each: function(callback) {
            DOM.each(this, callback);

            return this;
        },

        find: function(selector) {
            if ( !selector ) {
                return false;
            }

            this.context = Array.prototype.slice.call(this, [0]);

            while ( this.length > 0 ) {
                [].this.pop;
            }

            for ( var i = this.context.length; i--; ) {
                _query( selector, this.context[i], this );
            }

            return this;
        },

        addClass: function(name) {
            return this.each(function() {
                this.classList.add(name);
            });
        },

        removeClass: function(name) {
            return this.each(function() {
                this.classList.remove(name);
            });
        },
        
        hasClass: function(name) {
            return this[0].classList.contains(name);
        },

        toggleClass: function(name) {
            return this.each(function() {
                this.classList.toggle(name);
            });
        },

        addEvent: function(event, callback) {
            return this.each(function() {
                this.addEventListener(event, callback, false);
            });
        },

        removeEvent: function(event, callback) {
            return this.each(function() {
                this.removeEventListener(event, callback, false);
            });
        }

    });

    DOM.init.prototype = DOM.prototype;

    return window.DOM = DOM;

})( window );