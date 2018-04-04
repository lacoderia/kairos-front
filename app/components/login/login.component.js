(function(angular) {
    'use strict';

    function loginController($rootScope, $q, $timeout, $location, $mdToast, loginService, routingService) {

        /**
         *
         * @type {loginController}
         */
        var ctrl = this;

        var resetToken = undefined;

        ctrl.loading = false;

        ctrl.countries = [
            {"name": "México"},
            {"name": "Colombia"},
            {"name": "España"}
        ];

        // Object that holds all possible views
        ctrl.VIEWS = {
            LOGIN: 'login',
            SIGNUP: 'signup',
            FORGOT: 'forgot',
            RESET: 'reset',
            WAIT: 'wait'
        };

        var currentView = ctrl.VIEWS.SIGNUP;

        // Object that holds all possible sign in views
        ctrl.SUBVIEWS = {
            USER: 'user',
            ADDRESS: 'address'
        };

        var currentSubView = ctrl.SUBVIEWS.USER;

        // Object that holds the username and password values
        ctrl.credentials = {
            email: '',
            password: undefined
        };

        // Object that holds new user parameters
        /*ctrl.newUser = {
            name: 'Pedro',
            lastname: 'Picapiedra',
            externalId: '123',
            sponsorExternalId: '456',
            placementExternalId: '789',
            transactionNumber: 'REF001',
            iuvareId: '123456A',
            phone: '123456789',
            email: 'email@email.com',
            password: 'password',
            confirmation: 'password'
        };*/

        ctrl.newUser = {
            name: undefined,
            lastname: undefined,
            externalId: undefined,
            sponsorExternalId: undefined,
            placementExternalId: undefined,
            transactionNumber: undefined,
            iuvareId: undefined,
            phone: undefined,
            email: '',
            password: '',
            confirmation: ''
        };

        // Object that holds new address parameters
        ctrl.newAddress = {
            address: undefined,
            zip: undefined,
            city: undefined,
            state: undefined,
            country: undefined
        };

        // Object that holds the recover password data
        ctrl.forgot = {
            email: ''
        };

        // Object that holds the recover password data
        ctrl.reset = {
            password: undefined,
            confirmation: undefined
        };

        // Private variables
        var originalCredentials = angular.copy(ctrl.credentials);
        var originalNewUser = angular.copy(ctrl.newUser);
        var originalNewAddress = angular.copy(ctrl.newAddress);
        var originalForgot = angular.copy(ctrl.forgot);
        var originalReset = angular.copy(ctrl.reset);

        // Function that returns if the parameter view is the current view
        ctrl.isCurrentView = function(view){
            return (view == currentView);
        };

        // Function that returns if the parameter subView is the current subview
        ctrl.isCurrentSubView = function(subView){
            return (subView == currentSubView);
        };

        // Function that toggles to login view
        ctrl.changeView = function(view){
            resetViewForm(view);
            currentView = view;
        };

        // Function that toggles signup views
        ctrl.changeSubView = function(subView){
            currentSubView = subView;
        };

        // Function to reset forms
        var resetViewForm = function(formName){

            switch(formName){
                case 'login':
                    ctrl.credentials = angular.copy(originalCredentials);
                    break;
                case 'signup':
                    ctrl.newUser = angular.copy(originalNewUser);
                    ctrl.newAddress = angular.copy(originalNewAddress);
                    ctrl.changeSubView(ctrl.SUBVIEWS.USER);
                    break;
                case 'forgot':
                    ctrl.forgot = angular.copy(originalForgot);
                    break;
                case 'reset':
                    ctrl.reset = angular.copy(originalReset);
                    break;
                default:
                    break;
            }
        };

        // Function to authenticate a user
        ctrl.login = function() {
            document.activeElement.blur();

            if(ctrl.loginForm.$valid) {

                ctrl.loading = true;

                loginService.login(ctrl.credentials)
                    .then(function(data) {
                        if(data.user){
                            $location.path('/home');
                        }
                        ctrl.loading = false;
                    }, function(error) {
                        var errorText = 'Ocurrió un error, por favor inténtalo más tarde...';
                        if(error && error.errors){
                            errorText = error.errors[0].title;
                        }

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(errorText)
                                .position('top right')
                        );

                        ctrl.loading = false;
                    });
            }

        };

        // Function to register a new user
        ctrl.signUpUser = function() {
            document.activeElement.blur();

            if(ctrl.signupUserForm.$valid) {
                ctrl.changeSubView(ctrl.SUBVIEWS.ADDRESS);
            }
        };

        // Function to register a new user
        ctrl.signUp = function() {
            document.activeElement.blur();

            if(ctrl.signupAddressForm.$valid) {

                ctrl.loading = true;

                loginService.getIpInfo()
                    .then(function (location) {
                        var location = location;

                        var user = {
                            first_name: ctrl.newUser.name,
                            last_name: ctrl.newUser.lastname,
                            email: ctrl.newUser.email,
                            external_id: ctrl.newUser.externalId,
                            sponsor_external_id: ctrl.newUser.sponsorExternalId,
                            placement_external_id: ctrl.newUser.placementExternalId,
                            transaction_number: ctrl.newUser.transactionNumber,
                            iuvare_id: ctrl.newUser.iuvareId,
                            phone: ctrl.newUser.phone,
                            password: ctrl.newUser.password,
                            password_confirmation: ctrl.newUser.confirmation
                        };

                        loginService.registerUser(user)
                            .then(function(data) {

                                var address = {
                                    address: ctrl.newAddress.address,
                                    zip: ctrl.newAddress.zip,
                                    country: ctrl.newAddress.country,
                                    state: ctrl.newAddress.state,
                                    location: location
                                };

                                loginService.registerAddress(address)
                                    .then(function(data) {

                                        ctrl.loading = false;
                                        $location.path('/home');

                                    }, function(error) {
                                        var errorText = 'Ocurrió un error, por favor inténtalo más tarde...';
                                        if(error && error.errors){
                                            errorText = error.errors[0].title;
                                        }

                                        $mdToast.show(
                                            $mdToast.simple()
                                                .textContent(errorText)
                                                .position('top right')
                                        );

                                        ctrl.loading = false;
                                    });

                            }, function(error) {
                                var errorText = 'Ocurrió un error, por favor inténtalo más tarde...';
                                if(error && error.errors){
                                    errorText = error.errors[0].title;
                                }

                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent(errorText)
                                        .position('top right')
                                );

                                ctrl.loading = false;
                            });

                    }, function(error) {
                        var errorText = 'Ocurrió un error, por favor inténtalo más tarde...';
                        if(error && error.errors){
                            errorText = error.errors[0].title;
                        }

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(errorText)
                                .position('top right')
                        );

                        ctrl.loading = false;
                    });

            }


        };

        // Function to recover user password
        ctrl.recoverPassword = function() {
            document.activeElement.blur();

            if(ctrl.forgotForm.$valid) {

                ctrl.loading = true;

                loginService.recoverPassword(ctrl.forgot)
                    .then(function(data) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('You\'ll receive an email with further instructions to recover your password.')
                                .position('top right')
                        );
                        ctrl.loading = false;
                    }, function(error) {
                        var errorText = 'Ocurrió un error, por favor inténtalo más tarde...';
                        if(error && error.errors){
                            errorText = error.errors[0].title;
                        }

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(errorText)
                                .position('top right')
                        );

                        ctrl.loading = false;
                    });
            }
        };

        // Function to reset user password
        ctrl.resetPassword = function() {
            document.activeElement.blur();

            var reset = {
                reset_password_token: resetToken,
                password: ctrl.reset.password,
                password_confirmation: ctrl.reset.confirmation
            };

            if(ctrl.resetForm.$valid) {

                ctrl.loading = true;

                loginService.resetPassword(reset)
                    .then(function(data) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Your password was updated.')
                                .position('top right')
                        );
                        ctrl.loading = false;
                    }, function(error) {
                        var errorText = 'Ocurrió un error, por favor inténtalo más tarde...';
                        if(error && error.errors){
                            errorText = error.errors[0].title;
                        }

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(errorText)
                                .position('top right')
                        );

                        ctrl.loading = false;
                    });
            }
        };

        this.$onInit = function() {
            resetToken = routingService.getParam('reset_password_token');
            $timeout(function(){
                if (resetToken) {
                    ctrl.changeView(ctrl.VIEWS.RESET);
                }
            }, 0);
        };

    }

    angular
        .module('login')
        .component('login', {
            templateUrl: 'components/login/login.template.html',
            controller: loginController,
            bindings: {

            }
        });

})(window.angular);