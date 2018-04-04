'use strict';

// Declare app level module which depends on views, and components
angular.module('kairos', [
    'ngRoute',
    'ngResource',
    'ngMessages',
    'ngMaterial',
    'LocalStorageModule',
    'intro',
    'login',
    'navigation',
    'home',
    'soon',
]);

angular.module('kairos')
    .constant('AUTH_API_URL_BASE', 'http://backend.prana.mx')
    .constant('API_URL_BASE', 'http://backend.prana.mx');

angular.module('kairos')
    .run(['$rootScope', '$route', 'routingService', function($rootScope, $route, routingService) {
        $rootScope.$on('$routeChangeSuccess', function() {
            routingService.setView($route.current.view);
        });
    }]);