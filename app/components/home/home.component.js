(function(angular) {
    'use strict';

    function homeController($q, $timeout) {

        /**
         *
         * @type {Object}
         */
        var ctrl = this;

    }

    angular
        .module('home')
        .component('home', {
            templateUrl: 'components/home/home.template.html',
            controller: homeController,
            bindings: {

            }
        });

})(window.angular);