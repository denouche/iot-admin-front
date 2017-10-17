angular.module('applications')
.controller('ApplicationsController', function ($scope, IotAminApiService, Alerter, $timeout) {
    'use strict';

    $scope.model = {
        availableApplications: [],
        loadingApplications: false,
        selected: {
            application: null
        },
        unlinkedDevices: {
            has: true,
            open: true
        }
    };

    function init() {
        $scope.model.loadingApplications = true;
    	IotAminApiService.getApplications()
    		.then(function(data) {
                $scope.model.availableApplications = _.forEach(data, function(e) {
                    e.metadata = {
                        isOpen: false,
                        edition: false
                    };
                });
                $scope.model.loadingApplications = false;
    			console.log('availableApplications', data);
    		}, function(err) {
    			console.error(err);
    		});
        IotAminApiService.searchDevices('')
                .then(function(data) {
                    console.log('ici', data);
                    if(data.length > 0) {
                        $scope.model.unlinkedDevices.has = true;
                        $timeout($scope.selectApplication); // Need to defer the loading
                    }
                }, function(err) {
                    console.error(err);
                    Alerter.error('Une erreur est survenue lors du chargement des informations');
                });
    }

    init();

    $scope.selectApplication = function(app) {
        $scope.model.selected.application = app;
        $scope.selectTab('devices');
    };

    $scope.selectTab = function(tabName) {
        $scope.$broadcast('events.application.tab.' + tabName, $scope.model.selected.application);
    };

    $scope.createApplication = function() {
        IotAminApiService.createApplication()
            .then(function() {
                Alerter.success("Application créée");
                init();
            }, function(err) {
                console.error(err);
                Alerter.error("Une erreur est survenue lors de la création de l'application");
            });
    };

    $scope.deleteConfirmation = function(app){
      if (confirm("Delete application?")) {
        $scope.deleteApplication(app);
      }
    };

    $scope.deleteApplication = function(app) {
        app.metadata.isOpen = !app.metadata.isOpen;
        app.metadata.isOpen = !app.metadata.isOpen;
        IotAminApiService.deleteApplication(app._id)
            .then(function() {
                Alerter.success("Application supprimée");
                init();
            }, function(err) {
                console.error(err);
                Alerter.error("Une erreur est survenue lors de la suppression de l'application");
            });
    };

    $scope.editApplication = function(app) {
        app.metadata.edition = true;
        app.metadata.newName = app.name;
    };

    $scope.saveEdition = function(app) {
        app.name = app.metadata.newName;
        IotAminApiService.modifyApplication(app)
            .then(function() {
                Alerter.success("Application modifiée");
                init();
            }, function(err) {
                console.error(err);
                Alerter.error("Une erreur est survenue lors de la modification de l'application");
            });
    };

    $scope.cancelEdition = function(app) {
        app.metadata.edition = false;
    };

});
