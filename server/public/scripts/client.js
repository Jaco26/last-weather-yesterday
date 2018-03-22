var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    console.log('myApp -- config')
    $routeProvider
        .when('/', {
            redirectTo: 'dashboard'
        })
        .when('/login', {
            templateUrl: '/views/templates/login.html',
            controller: 'LoginController as vm',
        })
        .when('/register', {
            templateUrl: '/views/templates/register.html',
            controller: 'LoginController as vm'
        })
        .when('/details', {
            templateUrl: '/views/templates/details.html',
            controller: 'DetailsController as vm',
            // resolve: {
            //     getuser: function (UserService) {
            //         return UserService.getuser();
            //     }
            // }
        })
        .when('/about', {
            templateUrl: '/views/templates/about.html',
            controller: 'AboutController as vm',
            // resolve: {
            //     getuser: function (UserService) {
            //         return UserService.getuser();
            //     }
            // }
        }).when('/dashboard', {
            templateUrl: 'views/templates/dashboard.html',
            controller: 'DashboardController as vm',
            // resolve: {
            //     getuser: function(UserService) {
            //         return UserService.getuser();
            //     }
            // }
        })
        .otherwise({
            template: '<h1>404</h1>'
        });
}]);
