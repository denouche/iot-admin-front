angular.module('applications')
.controller('ApplicationVersionsController', function ($scope, IotAminApiService, Alerter, FileSaver) {
    'use strict';
    
    $scope.model.availableVersions = null;
    $scope.model.versions = {
        application: null,
        availablePlateforms: ['esp8266', 'raspberry'],
        availableVersions: null,
        inlineAdd: false,
        toAdd: null
        /*,
        toAddPossibleNextVersions: null*/
    };

    function init() {
        $scope.model.versions.availableVersions = null;
        IotAminApiService.getApplicationVersions($scope.model.versions.application._id)
            .then(function(data) {
                data.forEach(function(e) {
                    e.metadata = {
                        edition: false
                    };
                });
                data.sort(function(a, b) {
                    return compareVersions(b.name, a.name);
                });
                $scope.model.versions.availableVersions = _.groupBy(data, 'name');
            }, function(err) {
                console.error(err);
                Alerter.error('Une erreur est survenue lors du chargement des informations');
            });
    }

    $scope.$on('events.application.tab.versions', function(event, application) {
        $scope.model.versions.application = application;
        if($scope.application &&
            $scope.application._id &&
            $scope.model.selected.application &&
            $scope.model.selected.application._id &&
            $scope.application._id === $scope.model.selected.application._id) {
            init();
        }
    });

    $scope.showInlineAdd = function() {
        /*
        var splitted = [];
        if($scope.model.versions.availableVersions && _.keys($scope.model.versions.availableVersions).length > 0) {
            splitted = _.keys($scope.model.versions.availableVersions)[0].split('.');
        }
        else {
            splitted = ['0', '0', '0'];
        }
        $scope.model.versions.toAddPossibleNextVersions = [];
        $scope.model.versions.toAddPossibleNextVersions.push([splitted[0], splitted[1], parseInt(splitted[2]) +  1].join('.'));
        $scope.model.versions.toAddPossibleNextVersions.push([splitted[0], parseInt(splitted[1]) + 1, 0].join('.'));
        $scope.model.versions.toAddPossibleNextVersions.push([parseInt(splitted[0]) + 1, 0, 0].join('.'));
        */
        $scope.model.versions.toAdd = {};
        $scope.model.versions.inlineAdd = true;
    };

    $scope.resetInlineAdd = function() {
        angular.element(document.querySelector('#versionsToAddFirmware')).val(null);
        $scope.model.versions.toAdd = {};
        $scope.model.versions.inlineAdd = false;
    };

    $scope.saveInlineAdd = function() {
        $scope.model.versions.toAdd.application = $scope.model.versions.application.name;
        IotAminApiService.addVersion($scope.model.versions.toAdd)
            .then(function() {
                Alerter.success('Version ajoutée avec succès');
                init();
                $scope.resetInlineAdd();
            }, function(err) {
                console.error('Error while saving version', err);
                Alerter.error('Une erreur est survenue lors de la création de la version');
            });
    };

    $scope.downloadVersion = function(v) {
        IotAminApiService.downloadVersion(v._id)
            .then(function(data) {
                var blob = new Blob([data], { type: 'application/octet-stream' });
                FileSaver.saveAs(blob, [$scope.model.versions.application.name, v.name, v.plateform].join('_') + '.bin');
            }, function(err) {
                console.error('Error while downloadVersion', err);
                Alerter.error('Une erreur est survenue lors du téléchargement du firmware de la version');
            });
    };

    $scope.deleteVersion = function(v) {
        IotAminApiService.deleteVersion(v._id)
            .then(function() {
                Alerter.success('Version supprimée avec succès');
                init();
            }, function(err) {
                console.error('Error while deleting version', err);
                Alerter.error('Une erreur est survenue lors de la suppression de la version');
            });
    };

    $scope.editVersion = function(version) {
        version.metadata.edition = true;
    };

    $scope.resetVersionEdition = function(version) {
        version.firmware = null;
        angular.element(document.querySelector('#versionToEditFirmware-' + version._id)).val(null);
        version.metadata.edition = false;
    };

    $scope.saveVersion = function(version) {
        console.log('saveVersion', version);
        IotAminApiService.modifyVersion(version)
            .then(function() {
                Alerter.success('Version ajoutée avec succès');
                init();
                $scope.resetInlineAdd();
            }, function(err) {
                console.error('Error while saving version', err);
                Alerter.error('Une erreur est survenue lors de la création de la version');
            });
    };

});
