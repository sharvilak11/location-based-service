(function (window, angular) {
    var app = angular.module("cronjobs");

    app.controller("HeaderController", headerController);

    headerController.$inject = ["$scope", "$window"];

    function headerController($scope, $window) {
        $scope.logout = function () {
            $window.location = '/index.html';
            $window.sessionStorage.removeItem("AUTH_TKN");
            $window.sessionStorage.removeItem("TenantId");
        }
    }

}(window, angular));