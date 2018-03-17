myApp.controller('AboutController', ['UserService', function (UserService) {
    console.log('InfoController created');
    let self = this;
    self.userService = UserService;
}]);
