(function (window, angular) {
    var app = angular.module("cronjobs");

    app.controller("HomeController", homeController);

    homeController.$inject = ["$scope", "$interval"];

    function homeController($scope, $interval) {}

}(window, angular));