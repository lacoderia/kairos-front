'use strict';

angular.
    module('kairos').
    config(['$locationProvider', '$routeProvider', '$mdThemingProvider', 'localStorageServiceProvider',
        function config($locationProvider, $routeProvider, $mdThemingProvider, localStorageServiceProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('light-green')
                .accentPalette('blue');

            localStorageServiceProvider.setPrefix('');
            localStorageServiceProvider.setStorageCookie(45, '/');
            localStorageServiceProvider.setStorageCookieDomain('');

            var maintenance = false;

            var authenticate = ['$q', '$location', 'sessionService', 'loginService', function ($q, $location, sessionService, loginService) {
                var deferred = $q.defer();

                if(maintenance) {
                    if($location.path() == '/soon'){
                        deferred.resolve();
                    }
                    $location.path("/soon");
                } else {
                    if(sessionService.isHttpHeaders()){
                        sessionService.configHttpHeaders();

                        loginService.getCurrentSession()
                            .then(function(data){

                                if(data.user){
                                    deferred.resolve();
                                    if($location.path() == '/login' || $location.path() == '/intro'){
                                        $location.path("/home");
                                    }
                                }else{
                                    if($location.path() == '/login'){
                                        deferred.resolve();
                                    } else {
                                        deferred.reject('Not logged in');
                                        $location.path("/login");
                                    }
                                }
                            }, function(response){
                                if($location.path() == '/login'){
                                    deferred.resolve();
                                } else {
                                    deferred.reject('Not logged in');
                                    $location.path("/login");
                                }
                            });

                    } else {
                        if($location.path() == '/login'){
                            deferred.resolve();
                        } else {
                            deferred.reject('Not logged in');
                            $location.path("/login");
                        }
                    }
                }

                return deferred.promise;
            }];

            $locationProvider.hashPrefix('!');

            $routeProvider.
                when('/soon', {
                    template: '<soon layout-fill layout="column" flex></soon>',
                    resolve: authenticate,
                    view: 'soon'
                }).
                when('/login', {
                    template: '<login layout-fill layout="column" flex></login>',
                    resolve: authenticate,
                    view: 'login'
                }).
                when('/intro', {
                    template: '<intro></intro>',
                    resolve: authenticate,
                    view: 'intro'
                }).
                when('/home', {
                    template: '<home layout-fill layout="column" flex></home>',
                    resolve: authenticate,
                    view: 'home'
                }).
                otherwise('/intro');
    }]);