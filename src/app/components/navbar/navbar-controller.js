angular.module('navbar')
.controller('NavbarController', function ($scope, $location) {
    'use strict';

    $scope.isSectionActive = function (sectionName) {
        return !! (new RegExp('^/' + sectionName + '(?:/.*|)').test($location.path()));
    };

});
