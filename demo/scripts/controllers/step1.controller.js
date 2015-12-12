(function(window, document) {
    'use strict';

    function step1Controller() {

        function setConfirmation(value) {
            document.getElementById('MyCheckbox').value = value;
        }

        function discardCommand() {
            setConfirmation('false');
            gunwiz.functions.submit();
        }

        function confirmCommand() {
            setConfirmation('true');
            gunwiz.functions.submit();
        }

        return {
            discardCommand: discardCommand,
            confirmCommand: confirmCommand
        }
    }

    gunwiz.controller('inventoryMaterialController', inventoryMaterialController);

})(window, document);