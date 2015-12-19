(function(window, document) {
    'use strict';

    function demoController() {

        function setAnswer(value) {
            document.getElementById('answer').value = value;
        }

        function noCommand() {
            setAnswer('false');
            gunwiz.functions.submit();
        }

        function yesCommand() {
            setAnswer('true');
            gunwiz.functions.submit();
        }

        return {
            noCommand: noCommand,
            yesCommand: yesCommand
        }
    }

    gunwiz.controller('demoController', demoController);

})(window, document);