(function (window, angular) {
    var app = angular.module("cronjobs", [
        "ngSanitize",
        "ui.router",
        "ui.router.tabs",
        "ui.bootstrap",
        "angular-cron-jobs",
        "cronjobs.jobs",
        "cronjobs.logs",
        "cronjobs.directives",
        "cronjobs.settings",
        "cronjobs.login"
    ]);

    app.config(appConfig);
    app.run(appRun);

    appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

    function appConfig($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
            .state('base', {
                abstract: true,
                views: {
                    'header': {
                        templateUrl: '/webapp/layout/header.partial.html',
                        controller: 'HeaderController'
                    },
                    'footer': {
                        templateUrl: '/webapp/layout/footer.partial.html'
                    }
                }
            })
            .state('base.home', {
                url: '/',
                views: {
                    'layout@': {
                        templateUrl: '/webapp/home/home.partial.html',
                        controller: 'HomeController'
                    }
                }
            });
        $urlRouterProvider.otherwise('/jobs');
        $httpProvider.interceptors.push('RequestInterceptor');
    }

    app.service('RequestInterceptor', ['$rootScope', '$q', '$timeout', '$window', requestInterceptor]);

    function requestInterceptor($rootScope, $q, $timeout, $window) {
        return {
            request: function (config) {
                $rootScope.TOKEN = sessionStorage.getItem('AUTH_TKN');
                var token = $rootScope.TOKEN;
                if (token) {
                    config.headers.Authorization = "Bearer " + token;
                }
                return config || $q.when(config);
            },
            requestError: function (rejection) {
                return rejection || $q.reject(rejection);
            },
            response: function (config) {
                return config || $q.when(config);
            },
            responseError: function (response) {
                if (response.status === 401) {
                    window.location = "/login.html";
                    return;
                }
                return $q.reject(response);
            }
        };

        function requestCounter(value) {
            if (value > 0) {
                $('#loadingSplash').show();
            } else {
                $('#loadingSplash').hide();
            }
        }
    }
    appRun.$inject = ["$rootScope", "$timeout", "$state"];

    function appRun($rootScope, $timeout, $state) {
        _setupRouteChangeEvents();

        $rootScope.isState = function (state) {
            return $state.is(state);
        }

        function _setupRouteChangeEvents() {
            var loadingDebounce = null;

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                loadingDebounce = $timeout(function () {
                    $rootScope.loading = true;
                }, 500);
            });

            $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                $rootScope.loading = false;
            });

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (loadingDebounce) {
                    $timeout.cancel(loadingDebounce);
                    loadingDebounce = null;
                }
                $rootScope.loading = false;
            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                $rootScope.loading = false;
            });

            $rootScope.$on('$viewContentLoading', function (event, viewConfig, name) {
                //$rootScope.loading = true;
            });

            $rootScope.$on('$viewContentLoaded', function (event, name, el) {});
        }
    }
})(window, angular);