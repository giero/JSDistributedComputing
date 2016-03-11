/**
 * based on:
 * 1) http://ruslanas.wri.lt/requirejs-in-web-worker/
 * 2) https://stackoverflow.com/questions/24409289/requirejs-inside-web-worker-onmessage-not-called
 */
importScripts('app.js');

require({baseUrl: './'}, ['require', 'underscore'], function (require, _) {
    postMessage('module loaded');
    onmessage = function (event) {
        setTimeout(function(){
            var max = parseInt(event.data),
                sum = 0;

            for (var i = 1; i <= max; i = i + 1) {
                slowDownAbit();

                sum = sum + i;
                var progress = {
                    i: i,
                    sum: sum
                };

                postMessage(progress);
            }

            slowDownAbit();
            var result = {
                input: max,
                result: sum
            };

            postMessage(result);
        }, _.random(1000, 4000))
    };

    function slowDownAbit() {
        var slowdown = 2e9;
        while (slowdown > 0) {
            slowdown -= 1;
        }
    }
});
