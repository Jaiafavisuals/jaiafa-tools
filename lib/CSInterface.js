/*
 * GridMate minimal CEP bridge.
 * CEP exposes window.__adobe_cep__ inside Adobe host panels.
 * We only need evalScript for GridMate v1, so this lightweight wrapper avoids
 * shipping unused SDK code while keeping the familiar CSInterface API shape.
 */
(function (global) {
    'use strict';

    function CSInterface() {}

    CSInterface.prototype.getSystemPath = function (pathType) {
        if (!global.__adobe_cep__ || typeof global.__adobe_cep__.getSystemPath !== 'function') return '';
        var path = global.__adobe_cep__.getSystemPath(pathType);
        try { path = decodeURI(path); } catch (ignore) {}
        return path.replace(/^file:\/\/\/([A-Za-z]:)/, '$1').replace(/^file:\/\//, '');
    };

    CSInterface.prototype.evalScript = function (script, callback) {
        if (!global.__adobe_cep__ || typeof global.__adobe_cep__.evalScript !== 'function') {
            if (callback) callback('EvalScript error. CEP bridge unavailable.');
            return;
        }
        global.__adobe_cep__.evalScript(script, callback || function () {});
    };

    global.CSInterface = CSInterface;
})(window);
