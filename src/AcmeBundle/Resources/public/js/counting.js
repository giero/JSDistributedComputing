importScripts('../assetic/underscore.js');

onmessage = function (event) {
    count(parseInt(event.data));
};

function count(input) {
    setTimeout(function () {
        var result = {
            input: input,
            result: input + input
        };

        console.log('Calculated ', result);
        postMessage(result);
    }, _.random(1000, 4000));
}
