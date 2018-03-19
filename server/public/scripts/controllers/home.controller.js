myApp.controller('HomeController', ['UserService', function (UserService) {
    console.log('UserController created');
    let self = this;
    self.userService = UserService;

    self.currentZipData = {};
    self.weatherQueryTimeInterval = {};
    self.timeSlice = {};
    self.timeToView = '';

    self.getZipData = (zip) => {
        // zip = zip.slice(0, 5);
        for(let zipcode of UserService.zipcodes.list){
            if(zipcode.zipcode == zip){
                self.currentZipData = zipcode;
            }
        }
        console.log(self.currentZipData);
        
    }

    self.setTimeData = (time) => {
        for(let slice of self.currentZipData.weather){
            if(slice.dt == time){
                self.timeSlice = slice;
            }
        }
    }

    // self.setTime = () => {
    //     for(let item of self.currentZipData.weather){
    //         if()
    //     }
    // }

}]);
