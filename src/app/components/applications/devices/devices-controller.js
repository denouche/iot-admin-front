angular.module('applications')
.controller('ApplicationDevicesController', function ($scope, IotAminApiService, Alerter) {
    'use strict';

    $scope.model.devices = {
        availableDevices: null
    };

    function initVersions() {
        IotAminApiService.getApplicationVersions($scope.application._id)
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
        IotAminApiService.getApplicationDevices($scope.application._id)
            .then(function(data) {
                $scope.model.devices.availableDevices = data;
                initVersions();
            }, function(err) {
                console.error(err);
                Alerter.error('Une erreur est survenue lors du chargement des informations');
            });
    }

    $scope.$on('events.application.tab.devices', function(event, application) {
        if(application && $scope.application._id && application._id === $scope.application._id) {
            init();
        }
    });

});
