(function(angular) {
    'use strict';

    function soonController($q, $timeout) {

        /**
         *
         * @type {Object}
         */
        var ctrl = this;

    }

    angular
        .module('soon')
        .component('soon', {
            templateUrl: 'components/soon/soon.template.html',
            controller: soonController,
            bindings: {

            }
        });

})(window.angular);