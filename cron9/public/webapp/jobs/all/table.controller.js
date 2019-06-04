(function (window, angular) {
    var app = angular.module("cronjobs.jobs");

    app.controller("JobsTableController", jobsTableController);

    jobsTableController.$inject = ['$scope', '$http', '$rootScope', '$state', '$stateParams', 'rJobs'];

    function jobsTableController($scope, $http, $rootScope, $state, $stateParams, rJobs) {
        $scope.jobs = rJobs.data;

        $scope.filteredJobs = [];

        filterJobs($stateParams.period);

        $scope.runJob = function (job) {
            swal({
                title: "Are you sure?",
                text: "Job Will start now.",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Run",
                closeOnConfirm: true
            }, function () {
                $http.post("/runjob", {
                    JobId: job._id
                }).then(function (job) {
                    swal({
                        title: "Job Started.",
                        text: "Please check logs for more info.",
                        type: "success"
                    });
                }, function () {
                    swal({
                        title: "Some Error Occured.",
                        text: "Some error has occured.",
                        type: "error"
                    });
                });
            })
        }

        function filterJobs(period) {
            if (period) {
                for (i = 0; i < $scope.jobs.length; i++) {
                    switch (period) {
                    case "Daily":
                        if (isDaily($scope.jobs[i]))
                            $scope.filteredJobs.push($scope.jobs[i]);
                        break;
                    case "Weekely":
                        if (isWeekely($scope.jobs[i]))
                            $scope.filteredJobs.push($scope.jobs[i]);
                        break;
                    case "Monthly":
                        if (isMonthly($scope.jobs[i]))
                            $scope.filteredJobs.push($scope.jobs[i]);
                        break;
                    case "Yearly":
                        if (isYearly($scope.jobs[i]))
                            $scope.filteredJobs.push($scope.jobs[i]);
                        break;
                    }
                }
            } else {
                $scope.filteredJobs = $scope.jobs;
            }
        }

        function isDaily(job) {
            var cronString = job.Cron.split(" ");
            if (cronString[2] != '*' && cronString[5] == '*' && cronString[1] != '*' && cronString[3] == '*') {
                if (cronString[4] == '*')
                    return true;
                else if (cronString[4] == moment().get('month') + 1)
                    return true;
            }
            return false;
        }

        function isWeekely(job) {
            var cronString = job.Cron.split(" ");
            if (cronString[5] != '*' && cronString[5].indexOf(',') == -1 && cronString[1] != '*' && cronString[2] != '*' && cronString[3] == '*') {
                if (cronString[4] == '*')
                    return true;
                else if (cronString[4] == moment().get('month') + 1)
                    return true;
            }
            return false;
        }

        function isMonthly(job) {
            var cronString = job.Cron.split(" ");
            if (cronString[1] != '*' && cronString[2] != '*' && cronString[3] != '*' && cronString[4] == '*' && cronString[5] == '*') {
                if (cronString[4] == '*')
                    return true;
                else if (cronString[4] == moment().get('month') + 1)
                    return true;
            }
            return false;
        }

    }

}(window, angular));