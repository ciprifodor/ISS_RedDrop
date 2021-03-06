(function () {
    'use strict'
    var app = angular.module('RedDrop');
    app.controller('RequestManagementController', ['$location', '$cookies', '$http', '$mdDialog', function ($location, $cookies, $http, $mdDialog) {
        var vm = this;

        vm.adminToken = $cookies.get("adminToken");

        if (!vm.adminToken) {
            $location.path("/admin/login");
        }

        vm.requests = [];
        vm.bloodStocks = [];
        vm.bloodBagTypes = [];
        vm.bloodTypes = [];

        $http.get('/api/bloodbagtype/getall?token=' + vm.adminToken).then(function (response) {
            vm.bloodBagTypes = response.data;
        }, function (reason) {
        });

        $http.get('/api/bloodtype/getall?token=' + vm.adminToken).then(function (response) {
            vm.bloodTypes = response.data;
        }, function (reason) {
        });

        vm.getBloodTypeByUUID = function (uuid) {
            for (var i in vm.bloodTypes) {
                if (vm.bloodTypes[i].uuid === uuid) {
                    return vm.bloodTypes[i].type;
                }
            }
            return "";
        };

        vm.getBloodBagTypeByUUID = function (uuid) {
            for (var i in vm.bloodBagTypes) {
                if (vm.bloodBagTypes[i].uuid === uuid) {
                    return vm.bloodBagTypes[i].name;
                }
            }
            return "";
        };

        vm.convertStock = function (stock) {
            var result = [];
            for (var bagStock in stock) {
                result.push({
                    uuid: bagStock,
                    name: vm.getBloodBagTypeByUUID(bagStock),
                    value: stock[bagStock]
                });
            }
            return result;
        };

        vm.solveRequest = function (requestToken) {
            $http.get('/api/bloodrequest/solve?token=' + vm.adminToken + "&uuid=" + requestToken).then(function (response) {
                vm.refreshBloodBagStocks();
                vm.refreshRequestList();
            }, function (reason) {
            });
        };

        vm.refreshBloodBagStocks = function () {
            $http.get('/api/bloodbag/stock?token=' + vm.adminToken).then(function (response) {
                vm.bloodStocks = response.data;
                for (var key in vm.bloodStocks) {
                    vm.bloodStocks[key].stock = vm.convertStock(response.data[key].stock);
                }
            }, function (reason) {
            });
        };

        vm.refreshRequestList = function () {
            $http.get('/api/bloodrequest/getall?token=' + vm.adminToken).then(function (response) {
                vm.requests = response.data;
            }, function (reason) {
            });
        };

        vm.refreshBloodBagStocks();
        vm.refreshRequestList();

    }]);
})();