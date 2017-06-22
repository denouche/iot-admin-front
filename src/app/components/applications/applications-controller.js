angular.module('applications')
.controller('ApplicationsController', function ($scope, IotAminApiService) {
    'use strict';

    console.log('ApplicationsController');
    
    $scope.model = {
    };

    function init() {
    	IotAminApiService.getApplications()
    		.then(function(data) {
    			console.log(data);
    		}, function(err) {
    			console.error(err);
    		});
    }

    init();

});
