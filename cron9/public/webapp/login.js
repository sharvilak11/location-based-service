(function (window, angular) {
    var login = angular.module('cronjobs.login', []);
    login.controller('LoginController', ['$scope', '$window', '$http', '$timeout', LoginController]);

    function LoginController($scope, $window, $http, $timeout) {
        $scope.invalid = false;
        $scope.credentials = {
            username: null,
            password: null
        }
        $scope.login = function () {
            $('#login-box').removeClass('animated flipInY');
            $('#login-box').removeClass('animated wobble');
            $scope.credentials.grant_type = 'password';
            $http.post(window.cab9Endpoint + "token", "username=" + encodeURIComponent($scope.credentials.username) +
                "&password=" + encodeURIComponent($scope.credentials.password) +
                "&grant_type=password")
                .success(function (data) {
                    if (data.Claims.indexOf('Cron:') == -1) {
                        $window.location = '/webapp/index.html';
                        $window.sessionStorage.setItem("AUTH_TKN", data.TokenString);
                        $('#login-box').addClass('animated bounceOutUp')
                    } else {
                        $scope.invalid = true;
                    }
                }).error(function (err, status) {
                    $scope.invalid = true;
                    $('#login-box').addClass('animated wobble');
                });
        };
    }

})(window, angular);