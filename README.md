# gunwiz
A simple library for building industrial mobile computer wizard web apps.

Support for Windows Mobile 6.5 / Windows CE (very old!) browsers.
Tested with Motorola MC9190 device.

Attributes
--

* data-gw-controller: attach controller by name, usage:
        <table data-gw-controller="myControllerName"></table>
* data-gw-hotkey: link with hotkey, use "ESC" or "ENTER" for special Esc or Enter buttons, usage:
        <a href="myUrl" data-gw-hotkey="K">My command</a> where K is a capitalized key
* data-gw-optional: the submit will not require the value, so the value is optional, usage:
        <input type="text" data-gw-optional></input>
* data-gw-click: handles click event and executes the required function, usage:
        <a href="#" data-gw-hotkey="K" data-gw-click="myCommand()">My command</a>
* data-gw-info: injects application info string into the containing element, usage:
        <span data-gw-info></span>

Check out [gunwiz-demo](https://github.com/enrico-padovani/gunwiz/tree/master/demo) for a full example. It runs on express and use vash (razor) view engine.