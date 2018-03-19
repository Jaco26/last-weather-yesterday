myApp.controller('HomeController', ['UserService', function (UserService) {
    console.log('UserController created');
    let self = this;
    self.userService = UserService;

    self.currentZipData = {};
    self.weatherTimeInt = {};

    self.getZipData = (zip) => {
        // zip = zip.slice(0, 5);
        for(let zipcode of UserService.zipcodes.list){
            if(zipcode.zipcode == zip){
                self.currentZipData = zipcode;
            }
        }
        console.log(self.currentZipData);
        
    }

    // self.setTime = () => {
    //     for(let item of self.currentZipData.weather){
    //         if()
    //     }
    // }

}]);
