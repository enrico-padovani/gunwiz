/**
 * GunWiz - A simple library for building industrial mobile computer wizard web apps 
 * @version v0.1.0
 * @link http://www.alchemists.it
 * @copyright 2015 Alchemists Srl. All rights reserved.
 * @author Enrico Padovani <enrico.padovani@alchemists.it>
 * @license MIT
 */
(function(window, document) {
    'use strict';

    /**
     * @description
     * 
     * Support for Windows Mobile 6.5 / Windows CE browsers.
     * Tested with Motorola MC9190 device.
     * 
     * Releases:
     *  v0.1.0 [2015-10-31] - Initial release
     * 
     * Attributes:
     *  data-gw-controller:   attach controller by name
     *                        usage: <table data-gw-controller="myControllerName"></table>
     *  data-gw-hotkey:       link with hotkey, use "ESC" or "ENTER" for special Esc or Enter buttons
     *                        usage: <a href="myUrl" data-gw-hotkey="K">My command</a> where K is a capitalized key
     *  data-gw-optional:     the submit will not require the value, so the value is optional
     *                        usage: <input type="text" data-gw-optional></input>
     *  data-gw-click:        handles click event and executes the required function
     *                        usage: <a href="#" data-gw-hotkey="K" data-gw-click="myCommand()">My command</a>
     *  data-gw-info:         injects application info string into the containing element
     *                        usage: <span data-gw-info></span>
     */

    /**
     * Create global variable for accessing the library.
     */
    var gunwiz = window.gunwiz || (window.gunwiz = {});

    // private fields
    var controllers = [],
        isBootstrapped = false;

    /**
     * Get a cross browser function for adding events.
     * @param target The element to attach the event.
     * @param type The event type to attach.
     * @param listener The callback function to execute when the attached event fires.
     */
    var on = (function() {
        if (window.addEventListener) {
            return function(target, type, listener) {
                target.addEventListener(type, listener, false);
            };
        } else {
            return function(object, sEvent, fpNotify) {
                object.attachEvent('on' + sEvent, fpNotify);
            };
        }
    }());

    /**
     * Get a cross browser document ready handy function.
     * @param callback The callback to execute when the document is ready.
     */
    function ready(callback) {
        /in/.test(document.readyState) ? setTimeout('gunwiz.ready(' + callback + ')', 9) : callback();
    }

    /**
     * Get all form elements of a given type.
     * @param type The type to search form elements with.
     * @return Returns an array of matching form elements.
     */
    function getFormElementsByType(type) {
        var matchingElements = [];
        if (document.forms.length === 0) {
            return matchingElements;
        }
        for (var i = 0; i < document.forms[0].elements.length; i += 1) {
            if (document.forms[0].elements[i].type === type) {
                matchingElements.push(document.forms[0].elements[i]);
            }
        }
        return matchingElements;
    }

    /**
     * Get all document elements with a given attribute.
     * @param attribute The attribute name to search elements with.
     * @return Returns an array of matching elements.
     */
    function getElementsByAttribute(attribute) {
        var matchingElements = [];
        var allElements = document.getElementsByTagName('*');
        for (var i = 0; i < allElements.length; i += 1) {
            if (allElements[i].getAttribute(attribute) !== null) {
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    }

    // whether true the element is focused
    function hasFocus(elem) {
        return elem === document.activeElement;
    }

    /**
     * Submits form data.
     * By default all form values are required in order to fire the form submit.
     * When optional attribute is provided, then submit will ingnore empty value check.
     * When submit is canceled, then the focus will be set on the first empty field.
     */
    function submit() {
        if (document.forms.length === 0) {
            return;
        }
        // enable submit only when all fields are filled in or optional attribute is present
        var elements = getFormElementsByType('text'),
            i,
            foundFocused = false;
        for (i = 0; i < elements.length; i += 1) {
            if (hasFocus(elements[i])) {
                foundFocused = true;
            }
            if (elements[i].value !== '') {
                continue;
            }
            // evaluate empty fields
            if (elements[i].getAttribute('data-gw-optional') !== null) {
                if (!hasFocus(elements[i]) && foundFocused) {
                    // set focus on current empty not yet focused field, do not submit
                    elements[i].focus();
                    return;
                } else if (i === elements.length - 1) {
                    // skip the last field and go for submit
                    continue;
                }
            } else {
                // set focus on current empty field, do not submit
                elements[i].focus();
                return;
            }
        }
        // ensure uppercase
        for (i = 0; i < elements.length; i += 1) {
            elements[i].value = elements[i].value.toUpperCase();
        }
        // go for submit
        document.forms[0].submit();
    }

    /**
     * Get or set a controller.
     * @param name The controller name.
     * @param controller The controller factory function.
     * @return Returns a controller object.
     */
    function controller(name, controller) {
        if (controller) {
            if (typeof controller !== 'function') {
                throw new Error('Controller \'' + name + '\' not a function');
            }
            // invoke controller factory function in order to get the controller object
            var controllerObject = controller();
            if (!controllerObject) {
                throw new Error('Controller \'' + name + '\' not a factory function');
            }
            controllers.push({
                name: name,
                controller: controllerObject
            });
            return controllerObject;
        }
        for (var i = 0; i < controllers.length; i += 1) {
            if (controllers[i].name === name) {
                return controllers[i].controller;
            }
        }
        throw new Error('Controller \'' + name + '\' not found');
    }

    /**
     * Try execute custom defined function.
     * @param target The target to retrieve the function name to run, can be an event containing the element or an element itself.
     */
    function tryExecuteFunction(target) {
        // get the target element and try read data-gw-click attribute
        var element = target.currentTarget || target.srcElement || target;
        var clickAttribute = element.getAttribute('data-gw-click');
        if (!clickAttribute) {
            return;
        }
        // since we handle simple cases with no parameters, just remove parenthesis and we're done
        clickAttribute = clickAttribute.replace('()', '');
        var controllerElements = getElementsByAttribute('data-gw-controller'),
            clickFunction;
        if (controllerElements.length === 1) {
            // the function to execute might be present into its containing controller
            clickFunction = controller(controllerElements[0].getAttribute('data-gw-controller'))[clickAttribute];
        } else {
            // the function to execute might be present into gunwiz global functions
            clickFunction = gunwiz.functions[clickAttribute];
        }
        if (typeof clickFunction === 'function') {
            clickFunction();
        }
    }

    /**
     * Application bootstrapping.
     * Handle global keyboard strokes for hotkey binding and attaches custom click events.
     * Focuses the first empty field, if no empty field is available, then the first field is focused.
     */
    function bootstrap() {
        // can only execute once!
        if (isBootstrapped) {
            return;
        }
        // set application info
        var info = getElementsByAttribute('data-gw-info'),
            i;
        if (info.length > 0) {
            info[0].appendChild(document.createTextNode(gunwiz.appTitle + ' v.' + gunwiz.appVersion + ' - by ' + gunwiz.appManufacturer));
        }
        // handle global key input
        document.onkeydown = function(evt) {
            var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
            var key = keyCode === 27 ? 'ESC' : keyCode === 13 ? 'ENTER' : String.fromCharCode(keyCode);
            // retrieve all hotkeys
            var hotKeys = getElementsByAttribute('data-gw-hotkey');
            // hotkeys navigation (anchors only)
            for (i = 0; i < hotKeys.length; i += 1) {
                if (hotKeys[i].getAttribute('data-gw-hotkey').toUpperCase() === key && hotKeys[i].href) {
                    if (hotKeys[i].href === window.location.href + '#') {
                        tryExecuteFunction(hotKeys[i]);
                    } else {
                        window.location.href = hotKeys[i].href;
                    }
                    return false;
                }
            }
            return true;
        }
        // set focus on first (empty) input element
        var elements = getFormElementsByType('text');
        if (elements.length > 0) {
            var isFocusSet = false;
            for (i = 0; i < elements.length; i += 1) {
                if (elements[i].value === '') {
                    elements[i].focus();
                    isFocusSet = true;
                    break;
                }
            }
            // fallback to the first field (all fields are filled in)
            if (!isFocusSet) {
                elements[0].focus();
            }
        }
        // disable default submit on form
        if (document.forms.length > 0) {
            document.forms[0].onsubmit = function() {
                return false;
            };
        }
        // attach click command
        var clickElements = getElementsByAttribute('data-gw-click');
        for (i = 0; i < clickElements.length; i += 1) {
            on(clickElements[i], 'click', function(e) {
                tryExecuteFunction(e);
            });
        }
        isBootstrapped = true;
    }

    /**
    * The application title.
    */
    gunwiz.appTitle = '';
    /**
    * The application version.
    */
    gunwiz.appVersion = '';
    /**
    * The application manufacturer.
    */
    gunwiz.appManufacturer = '';
    gunwiz.getFormElementsByType = getFormElementsByType;
    gunwiz.getElementsByAttribute = getElementsByAttribute;
    gunwiz.controller = controller;
    gunwiz.bootstrap = bootstrap;
    gunwiz.ready = ready;
    gunwiz.on = on;
    /**
     * Global object with common functions, can be used by data-gw-click.
     */
    gunwiz.functions = {
        submit: submit
    };

})(window, document);