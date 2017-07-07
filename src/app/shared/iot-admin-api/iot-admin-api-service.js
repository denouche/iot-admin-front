angular.module('iot-admin-api-module')
.service('IotAminApiService', function (Configuration, $http) {
    'use strict';

    this.createApplication = function() {
        return $http({
            method: 'POST',
            url: Configuration.apiBasePath + '/applications',
            data: {
                name: 'New application'
            }
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.deleteApplication = function(id) {
        return $http({
            method: 'DELETE',
            url: Configuration.apiBasePath + '/applications/' + id
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.modifyApplication = function(application) {
        return $http({
            method: 'PUT',
            url: Configuration.apiBasePath + '/applications/' + application._id,
            data: application
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.getApplications = function() {
        return $http({
            method: 'GET',
            url: Configuration.apiBasePath + '/applications'
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.getApplicationVersions = function(applicationId) {
        return $http({
            method: 'GET',
            url: Configuration.apiBasePath + '/applications/' + applicationId + '/versions'
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.getApplicationDevices = function(applicationId) {
        return $http({
            method: 'GET',
            url: Configuration.apiBasePath + '/applications/' + applicationId + '/devices'
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.addVersion = function(version) {
        var fd = new FormData();
        
        if(version.firmware) {
            fd.append('firmware', version.firmware);
        }

        fd.append('name', version.name);
        fd.append('plateform', version.plateform);
        fd.append('application', version.application);

        return $http({
            method: 'POST',
            url: Configuration.apiBasePath + '/versions',
            data: fd,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function (data) {
            return data.data;
        });
    };

    this.modifyVersion = function(version) {
        var fd = new FormData();
        
        if(version.firmware) {
            fd.append('firmware', version.firmware);
        }

        fd.append('name', version.name);
        fd.append('plateform', version.plateform);
        fd.append('application', version.application);

        return $http({
            method: 'PUT',
            url: Configuration.apiBasePath + '/versions/' + version._id,
            data: fd,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function (data) {
            return data.data;
        });
    };

    this.downloadVersion = function(versionId) {
        return $http({
            method: 'GET',
            url: Configuration.apiBasePath + '/versions/' + versionId + '/download',
            headers: {
                accept: 'application/octet-stream'
            },
            responseType: 'arraybuffer'
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.deleteVersion = function(versionId) {
        return $http({
            method: 'DELETE',
            url: Configuration.apiBasePath + '/versions/' + versionId
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.searchDevices = function(applicationName) {
        return $http({
            method: 'GET',
            url: Configuration.apiBasePath + '/devices',
            params: {
                application: applicationName
            }
        })
        .then(function(data) {
            return data.data;
        });
    };

    this.deleteDevice = function(deviceId) {
        return $http({
            method: 'DELETE',
            url: Configuration.apiBasePath + '/devices/' + deviceId
        })
        .then(function(data) {
            return data.data;
        });
    };

});
