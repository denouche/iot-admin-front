angular.module('applications')
.controller('ApplicationDevicesController', function ($scope, IotAminApiService, Alerter) {
    'use strict';

    $scope.model.devices = {
        application: null,
        availableDevices: null
    };

    function initVersions() {
        IotAminApiService.getApplicationVersions($scope.model.devices.application._id)
            .then(function(data) {
                $scope.model.devices.availableDevices.forEach(function(e) {
                    if(!e.metadata) {
                        e.metadata = {};
                    }
                    var foundVersion = _.find(data, { _id: e._version, plateform: e.plateform });
                    if(foundVersion) {
                        e.metadata.version = foundVersion;
                    }
                });
            }, function(err) {
                console.error(err);
                Alerter.error('Une erreur est survenue lors du chargement des informations');
            });
    }

    function init() {
        $scope.model.devices.availableDevices = null;
        IotAminApiService.getApplicationDevices($scope.model.devices.application._id)
            .then(function(data) {
                $scope.model.devices.availableDevices = data;
                initVersions();
            }, function(err) {
                console.error(err);
                Alerter.error('Une erreur est survenue lors du chargement des informations');
            });
    }

    function initUnlinkedDevices() {
        IotAminApiService.searchDevices('')
                .then(function(data) {
                    $scope.model.devices.availableDevices = data;
                }, function(err) {
                    console.error(err);
                    Alerter.error('Une erreur est survenue lors du chargement des informations');
                });
    }

    $scope.$on('events.application.tab.devices', function(event, application) {
        $scope.model.devices.application = application;
        if($scope.application &&
            $scope.application._id &&
            $scope.model.devices.application &&
            $scope.model.devices.application._id &&
            $scope.application._id === $scope.model.devices.application._id) {
            init();
        }
        else if (!$scope.application && !application) {
            initUnlinkedDevices();
        }
    });

    $scope.deleteConfirmation = function(device){
        if (confirm("Delete device?")) {
            $scope.deleteDevice(device);
        }
    };

    $scope.deleteDevice = function(device) {
        IotAminApiService.deleteDevice(device._id)
            .then(function() {
                Alerter.success('Device supprimé avec succès');
                init();
            }, function(err) {
                console.error('Error while deleting device', err);
                Alerter.error('Une erreur est survenue lors de la suppression du device');
            });
    };

});
