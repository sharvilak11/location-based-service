(function (window, angular) {
    var module = angular.module("cronjobs.logs", []);

    module.config(moduleConfig);

    moduleConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function moduleConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('base.logs', {
                url: '/logs/:JobId?',
                views: {
                    'layout@': {
                        templateUrl: '/webapp/layout/layout.partial.html'
                    },
                    'nav-view@base.logs': {
                        templateUrl: '/webapp/logs/sidebar.partial.html',
                        controller: ['rJobs', '$scope', function (rJobs, $scope) {
                            $scope.jobs = rJobs.data;
                    }]
                    },
                    'content-view@base.logs': {
                        templateUrl: '/webapp/logs/logs.partial.html',
                        controller: ['rJobs', '$scope', '$stateParams', function (rJobs, $scope, $stateParams) {
                            if (!$stateParams.JobId) {
                                $scope.job = null;
                                $scope.filter = "ALL";
                            } else {
                                $scope.job = $stateParams.JobId;
                                $scope.filter = rJobs.data.filter(function (job, index) {
                                    return job._id == $stateParams.JobId
                                })[0].Name;
                            }
                    }]
                    }
                },
                resolve: {
                    rJobs: ['$http', function ($http) {
                        return $http.get("/api/cronjobs")
                            .success(function (response) {
                                return response;
                            });
                }]
                }
            })
    }

})(window, angular);