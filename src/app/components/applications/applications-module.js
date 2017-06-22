angular.module('applications', [
    'iot-admin-api-module'
])
.config(function($routeProvider) {
    'use strict';

    $routeProvider.when('/applications', {
        templateUrl: 'app/components/applications/applications-view.html',
        controller : 'ApplicationsController'
    });

});
