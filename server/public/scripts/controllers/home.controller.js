myApp.controller('HomeController', ['UserService', function (UserService) {
    console.log('UserController created');
    let self = this;
    self.userService = UserService;
    self.userObject = UserService.userObject;
    self.zipcodes = UserService.zipcodes;
    

    self.newZip = UserService.newZip

    self.submitZip = UserService.submitZip;

}]);
