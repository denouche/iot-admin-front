angular.module('applications')
.controller('ApplicationsController', function ($scope, IotAminApiService, Alerter) {
    'use strict';

    console.log('ApplicationsController');
    
    $scope.model = {
        availableApplications: [],
        selected: {
            application: null
        }
    };

    function init() {
    	IotAminApiService.getApplications()
    		.then(function(data) {
                $scope.model.availableApplications = _.forEach(data, function(e) {
                    e.metadata = {
                        isOpen: false
                    };
                });
    			console.log('availableApplications', data);
    		}, function(err) {
    			console.error(err);
    		});
    }

    init();

    $scope.selectApplication = function(app) {
        $scope.model.selected.application = app;
        $scope.selectTab('versions');
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

    $scope.deleteApplication = function(app) {
        app.metadata.isOpen = !app.metadata.isOpen;
        console.log('deleteApplication', app.metadata);
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
