"use strict";
var global = require("./global.js");
var ASSERT = require("./assert.js");
var schedule;
if (global.process && typeof process.version === "string") {
    schedule = function Promise$_Scheduler(fn) {
        process.nextTick(fn);
    };
}
else if (global.MutationObserver || global.WebKitMutationObserver) {
    schedule = (function(){
        var MutationObserver = global.MutationObserver ||
            global.WebKitMutationObserver;
        var div = document.createElement("div");
        var queuedFn = void 0;
        var observer = new MutationObserver(
            function Promise$_Scheduler() {
                ASSERT(queuedFn !== void 0);
                var fn = queuedFn;
                queuedFn = void 0;
                fn();
            }
       );
        observer.observe(div, {
            attributes: true
        });
        return function Promise$_Scheduler(fn) {
            ASSERT(queuedFn === void 0);
            queuedFn = fn;
            div.setAttribute("class", "foo");
        };

    })();
}
else if (global.setTimeout) {
    schedule = function Promise$_Scheduler(fn) {
        setTimeout(fn, 0);
    };
}
else throw new Error("no async scheduler available");
module.exports = schedule;
