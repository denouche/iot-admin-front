angular.module('iot-admin-api-module')
.service('IotAminApiService', function (Configuration, $http) {
    'use strict';

    this.getApplications = function() {
        return $http({
            method: 'GET',
            url: Configuration.apiBasePath + '/applications'
        })
        .then(function(data) {
            return data.data;
        });
    };

});
