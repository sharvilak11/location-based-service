(function (window, angular) {
    var module = angular.module("cronjobs.jobs", []);

    module.config(moduleConfig);

    moduleConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function moduleConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/', '/jobs/');
        $urlRouterProvider.when('', '/jobs/');

        $stateProvider.state('base.jobs', {
            url: '/jobs/:period?',
            views: {
                'layout@': {
                    templateUrl: '/webapp/layout/layout.partial.html'
                },
                'nav-view@base.jobs': {
                    templateUrl: '/webapp/jobs/all/sidebar.partial.html',
                },
                'content-view@base.jobs': {
                    templateUrl: '/webapp/jobs/all/table.partial.html',
                    controller: 'JobsTableController'
                }
            },
            resolve: {
                rJobs: ['$http', function ($http) {
                    return $http.get("/api/cronjobs")
                        .success(function (response) {
                            response = response.map(function (job) {
                                return $http.get("/api/logs?$filter=Success eq true and JobId eq '" + job._id + "'&$top=1&$orderBy=RunTime%20desc")
                                    .success(function (res) {
                                        job.LastRan = res[0] ? res[0].RunTime : null;
                                        return job;
                                    });
                            });
                            return response;
                        });
                }]
            }
        })
            .state('base.job-details', {
                url: '/jobs/details/:_id',
                views: {
                    'layout@': {
                        templateUrl: '/webapp/layout/layout.partial.html'
                    },
                    'nav-view@base.job-details': {
                        templateUrl: '/webapp/jobs/item/sidebar.partial.html',
                        controller: ['rJobs', '$scope', '$stateParams', function (rJobs, $scope, $stateParams) {
                            $scope.jobs = rJobs.data;
                        }]
                    },
                    'content-view@base.job-details': {
                        templateUrl: '/webapp/jobs/item/details.partial.html',
                        controller: 'JobDetailsController'
                    }
                },
                resolve: {
                    rJobs: ['$http', function ($http) {
                        return $http.get("/api/cronjobs")
                            .success(function (response) {
                                return response;
                            });
                    }],
                    rJob: ['rJobs', '$stateParams', function (rJobs, $stateParams) {
                        for (var i = 0; i < rJobs.data.length; i++) {
                            if ($stateParams._id == rJobs.data[i]._id) {
                                return rJobs.data[i];
                            }
                        }
                    }]
                }
            })
    }

})(window, angular);