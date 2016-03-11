define(['jquery', 'underscore', 'plugin/worker!counting.js'], function ($, _, counter) {
    var webSocket = WS.connect('ws://127.0.0.1:8080');

    webSocket.on('socket/connect', function (session) {
        //session is an Autobahn JS WAMP session.
        console.log('Successfully Connected!');

        //the callback function in 'subscribe' is called everytime an event is published in that channel.
        session.subscribe('acme/channel', function (uri, payload) {
            if ($.isPlainObject(payload) && 'input' in payload) {
                var input = payload.input;

                counter.postMessage(input);
                counter.onmessage = function (e) {
                    switch (e.data) {
                        case 'module loaded':
                            counter.postMessage(input);
                            break;
                        default:
                            session.publish('acme/channel', e.data);
                            break;
                    }
                };
            } else {
                console.log(payload);
            }
        });

        console.log("tell I'm ready");
        session.publish('acme/channel', {
            ready: true
        });
    });

    webSocket.on('socket/disconnect', function (error) {
        //error provides us with some insight into the disconnection: error.reason and error.code
        console.log('Disconnected for ' + error.reason + ' with code ' + error.code);
    });
});
