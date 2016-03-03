requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: '../assetic/jquery',
        underscore: '../assetic/underscore'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        }
    }
});
