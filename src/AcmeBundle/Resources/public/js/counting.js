/**
 * based on:
 * 1) http://ruslanas.wri.lt/requirejs-in-web-worker/
 * 2) https://stackoverflow.com/questions/24409289/requirejs-inside-web-worker-onmessage-not-called
 */
importScripts('app.js');

require({baseUrl: './'}, ['require', 'underscore'], function (require, _) {
    postMessage('module loaded');
    onmessage = function (event) {
        var input = parseInt(event.data);
        setTimeout(function () {
            var result = {
                input: input,
                result: input + input
            };

            postMessage(result);
        }, _.random(1000, 4000));
    }
});
