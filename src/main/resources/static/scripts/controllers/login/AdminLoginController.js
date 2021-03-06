(function(){
    'use strict'
    var app = angular.module('RedDrop');
    app.controller('AdminLoginController', ['$location', '$cookies', '$http', function($location, $cookies, $http)
    {
        var vm = this;

        vm.adminToken = $cookies.get("adminToken");

        if (vm.adminToken) {
            $location.path("/admin/main");
        }

        vm.tryLoginAdmin = function () {
            $http({
                method: 'POST',
                url: '/api/admin/login',
                data: {
                    cnp: vm.adminCNP,
                    password: vm.adminPassword
                }
            }).then(function (response) {
                if (response.data.succesful) {
                    $cookies.put("adminToken", response.data.token);
                    $location.path("/admin/main");
                }
            }, function (error) { });
        }

    }]);
})();