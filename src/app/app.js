angular.module('iotAdminApplication', [
    'pascalprecht.translate',
    'configVersion',
    'tmh.dynamicLocale',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngFileSaver',
    'toastr',
    'utils',
    'config',
    'templates-app',
    'applications'
])
.config(function($routeProvider) {
    'use strict';

    $routeProvider.otherwise({redirectTo:'applications'});

})
.config(function ($translateProvider, Configuration, $translatePartialLoaderProvider) {
    'use strict';

    $translatePartialLoaderProvider.addPart('main');

    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'assets/i18n/{part}/{lang}.json'
    });

    $translateProvider
        .registerAvailableLanguageKeys(['fr-fr', 'en-gb'], {
             'en*': 'en-gb',
             'fr*': 'fr-fr',
             '*'  : 'en-gb'
         })
        .determinePreferredLanguage()
        .fallbackLanguage(Configuration.defaultlanguage);
    
    $translateProvider.useSanitizeValueStrategy('escape');
})
.config(function(tmhDynamicLocaleProvider, Configuration) {
     'use strict';

     tmhDynamicLocaleProvider.defaultLocale(Configuration.defaultlanguage);
     tmhDynamicLocaleProvider.localeLocationPattern('assets/libs/angular-i18n/angular-locale_{{locale}}.js');
})
.run(function ($rootScope, $translate, tmhDynamicLocale) {
    'use strict';

    $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
        $translate.refresh();
    });

    $rootScope.$on('$translateChangeSuccess', function(event, data) {
        tmhDynamicLocale.set(data.language);
    });

})
.run(function($rootScope, VERSION) {
    'use strict';
    $rootScope.VERSION = VERSION;
});
