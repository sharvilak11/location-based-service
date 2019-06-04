(function (window, angular) {
    var app = angular.module("cronjobs.jobs");
    app.controller("JobDetailsController", jobDetailsController);

    jobDetailsController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$state', 'rJob'];

    function jobDetailsController($scope, $http, $rootScope, $stateParams, $state, rJob) {
        $scope.job = rJob;
        $scope.job.$jobCron = $scope.job.Cron.substr(3, $scope.job.Cron.length);
        $scope.job.$successContacts = $scope.job.OnSuccessContacts.split(',');
        $scope.job.$failureContacts = $scope.job.OnFailureContacts.split(',');
        if ($scope.job.ScheduleDate) {
            debugger
            $scope.job.$hour = moment($scope.job.ScheduleDate).hour();
            $scope.job.$min = moment($scope.job.ScheduleDate).minute();
        }
        $scope.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        $scope.mins = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

        $scope.viewMode = true;
        $scope.viewMode = true;

        $scope.openCalendar = function (event) {
            $scope.scheduleDateCalendarIsOpen = true;
            event.preventDefault();
            event.stopPropagation();
        }
        $scope.dateOptions = {
            showWeeks: false
        };
        $scope.saveJob = function (myOutput) {
            $scope.job.Cron = "00 " + myOutput;
            $http.put("/api/cronjobs?_id=" + $scope.job._id, $scope.job)
                .success(function (job) {
                    $state.go("base.job-details", $stateParams, {
                        reload: true
                    })
                });
        }

        $scope.changeView = function (myOutput) {
            $scope.viewMode = $scope.viewMode == false ? true : false;
        }

        $scope.updateJob = function () {
            if ($scope.job.ScheduleDate) {
                $scope.job.Cron = "";
                debugger
                $scope.job.ScheduleDate = moment($scope.job.ScheduleDate).hour($scope.job.$hour).minutes($scope.job.$min).format();
            } else
                $scope.job.Cron = "00 " + $scope.myOutput;
            $scope.viewMode = true;
            $http.post("/api/editjob?_id=" + $scope.job._id, $scope.job)
                .then(function (job) {
                    swal({
                        title: "Jobs Updated",
                        text: "Changes have been updated.",
                        type: "success"
                    });
                    $state.go("base.job-details", $stateParams, {
                        reload: true
                    })
                }, function () {
                    swal({
                        title: "Some Error Occured.",
                        text: "Some error has occured.",
                        type: "error"
                    });
                });
        }
    }

}(window, angular));