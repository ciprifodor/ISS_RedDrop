(function () {
    'use strict'
    var app = angular.module('RedDrop');
    app.controller('AdminMainController', ['$location', '$cookies', '$http', '$mdDialog', 'apiIP', function ($location, $cookies, $http, $mdDialog, apiIP) {
        var vm = this;

        vm.adminToken = $cookies.get("adminToken");

        if (!vm.adminToken) {
            $location.path("/admin/login");
        }

        vm.goToHospitalsPage = function () {
            $location.path("/crud/hospital");
        };

        vm.goToFillAnalysisPage=function () {
            $location.path("/admin/bloodanalysis")
        };

        vm.visits = [];
        vm.requests = [];
        vm.bloodStocks = [];
        vm.bloodBagTypes = [];
        vm.bloodTypes = [];

        $http.get(apiIP + '/api/bloodbagtype/getall?token=' + vm.adminToken).then(function (response) {
            vm.bloodBagTypes = response.data;
        }, function (reason) {
        });

        $http.get(apiIP + '/api/bloodtype/getall?token=' + vm.adminToken).then(function (response) {
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

        vm.openFillAnalysisDialog = function (donationVisitToken) {
            $mdDialog.show({
                controller: function ($mdDialog, $http, apiIP) {
                    var vm = this;

                    vm.adminToken = $cookies.get("adminToken");

                    vm.analysis = {};
                    vm.analysis.uuid = "";
                    vm.analysis.donationVisit = donationVisitToken;
                    vm.bloodTypes = [];

                    if (!vm.adminToken) {
                        $location.path("/admin/login");
                    }
                    $http.get(apiIP + '/api/bloodtype/getall?token=' + vm.adminToken).then(function (response) {
                        vm.bloodTypes = response.data;
                        vm.patientBloodType = vm.bloodTypes[0];
                    }, function (reason) {

                    });

                    vm.tryRegisterAnalysis = function () {
                        vm.analysis.bloodtype = vm.patientBloodType.uuid;
                        $http({
                            method: 'POST',
                            url: apiIP + '/api/analysisresult/add?token=' + vm.adminToken,
                            data: vm.analysis
                        }).then($mdDialog.hide(), $mdDialog.hide());
                    };
                },
                controllerAs: 'ctrl',
                templateUrl: '/views/directives/FillAnalysisResultDirective.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            }).then();
        };
        
        vm.confirmVisitDialog=function (donationVisitToken) {
            $http.get(apiIP + '/api/donationvisit/markdone?token=' + vm.adminToken+"&donationVisitUUID="+donationVisitToken).then(function (response) {
                if(!response.data.successful) {
                    $mdDialog.show({
                        controller: function ($mdDialog, $http, apiIP) {
                            var vm = this;

                            vm.adminToken = $cookies.get("adminToken");
                            vm.bloodTypes = [];

                            if (!vm.adminToken) {
                                $location.path("/admin/login");
                            }
                            $http.get(apiIP + '/api/bloodtype/getall?token=' + vm.adminToken).then(function (response) {
                                vm.bloodTypes = response.data;
                                vm.patientBloodType = vm.bloodTypes[0];
                            }, function (reason) {

                            });


                            vm.markDone = function () {
                                $http.get(apiIP + '/api/donationvisit/markdone?token=' + vm.adminToken + "&donationVisitUUID=" + donationVisitToken + "&bloodTypeUUID=" + vm.patientBloodType.uuid).then(function (response) {
                                    $mdDialog.hide();
                                }, function (reason) {
                                    $mdDialog.hide();
                                });
                            };
                        },
                        controllerAs: 'ctrl',
                        templateUrl: '/views/dialogs/VisitConfirmationDialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true
                    }).then(vm.refreshVisitList, vm.refreshVisitList);
                } else {
                    vm.refreshVisitList();
                }
            }, function (reason) {

            });

            
        }

        vm.openAddBloodBagDialog=function(){
            $mdDialog.show({
                controller: 'BloodBagAddController',
                controllerAs: 'ctrl',
                templateUrl: '/views/dialogs/BloodBagAddDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            }).then();
        };

        vm.refreshVisitList = function () {
            $http.get(apiIP + '/api/donationvisit/getunvisitedvisits?token=' + vm.adminToken).then(function (response) {
                vm.visits = response.data;
            }, function (reason) {
            });
        };

        vm.refreshBloodBagStocks = function () {
            $http.get(apiIP + '/api/bloodbag/stock?token=' + vm.adminToken).then(function (response) {
                vm.bloodStocks = response.data;
                for (var key in vm.bloodStocks) {
                    vm.bloodStocks[key].stock = vm.convertStock(response.data[key].stock);
                }
            }, function (reason) {
            });
        };

        vm.deleteDonationVisit= function (visitId) {
            $http.get(apiIP + '/api/donationvisit/delete?token=' + vm.adminToken + '&uuid=' + visitId).then(function (response) {
                vm.refreshVisitList();
            }, function (reason) {
                vm.refreshVisitList();
            });
        };

        vm.refreshRequestList = function () {
            $http.get(apiIP + '/api/bloodrequest/getall?token=' + vm.adminToken).then(function (response) {
                vm.requests = response.data;
            }, function (reason) {
            });
        };

        vm.refreshBloodBagStocks();
        vm.refreshVisitList();
        vm.refreshRequestList();

    }]);
})();