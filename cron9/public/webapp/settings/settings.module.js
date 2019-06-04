(function (window, angular) {
    var module = angular.module("cronjobs.settings", []);

    module.config(moduleConfig);

    moduleConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function moduleConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('base.settings', {
                url: '/settings',
                views: {
                    'layout@': {
                        templateUrl: '/webapp/layout/layout.partial.html'
                    },
                    'content-view@base.settings': {
                        templateUrl: '/webapp/settings/settings.partial.html'
                    }
                }
            })
    }
})(window, angular);