(function(angular) {
    var module = angular.module('cronjobs.directives', []);

    module.directive('logstable', logstable);
    logstable.$inject = ['$parse', '$http'];

    function logstable($parse, $http) {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: '/webapp/common/directives/logs.directive.partial.html',
            link: function(scope, elem, attrs, ctrls, transcludeFn) {

                scope.paging = {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 10
                };

                scope.fetchPage = fetchPage;
                fetchPage(1);

                scope.$watch("startDate", function() {
                    if (scope.endDate) {
                        fetchPage(1);
                    }
                });

                scope.$watch("endDate", function() {
                    if (scope.startDate) {
                        fetchPage(1);
                    }
                });

                function fetchPage(page) {
                    var baseQuery = "/api/logs?";

                    scope.fetchingLogs = true;
                    scope.paging.currentPage = page;

                    //check if job is present
                    if (attrs.job) {
                        baseQuery += "$filter=JobId eq '" + attrs.job + "'";
                    }
                    //check if user is requesting status
                    if (scope.successFilter) {
                        if (attrs.job)
                            baseQuery += "and Success eq '" + scope.successFilter + "'";
                        else
                            baseQuery += "$filter=Success eq '" + scope.successFilter + "'";
                    }

                    //check for date filters
                    if (scope.startDate && scope.endDate) {
                        var tStartDate = new moment(scope.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS')
                        var tEndDate = new moment(scope.endDate).format('YYYY-MM-DDTHH:mm:ss.SSS')
                        if (attrs.job || scope.successFilter) {
                            baseQuery += "and RunTime gte '" + tStartDate + "' and RunTime lte '" + tEndDate + "'";
                        } else {
                            baseQuery += "$filter=RunTime gte '" + tStartDate + "' and RunTime lte '" + scope.endDate + "'";
                        }
                    }

                    var countquery = baseQuery + "&$select=_id"

                    //get the total count of items 
                    $http.get(countquery)
                        .success(function(response) {
                            scope.paging.totalItems = response.length;
                        })
                        .error(function() {
                            scope.paging.totalItems = 0;
                        });

                    baseQuery += '&$top=' + scope.paging.itemsPerPage;
                    baseQuery += '&$skip=' + scope.paging.itemsPerPage * (page - 1);
                    baseQuery += '&$orderBy=RunTime desc';
                    $http.get(baseQuery)
                        .success(function(response) {
                            scope.jobLogs = response
                            scope.fetchingLogs = false;
                        });
                }
            }
        }
    }
})(angular);
