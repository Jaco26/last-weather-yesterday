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
    }

    self.setTimeData = (time) => {
        for(let slice of self.currentZipData.weather){
            if(slice.dt == time){
                self.timeSlice = slice;
            }
        }
    }

    // self.myDate = new Date();
    // self.minDate = new Date(self.userService.userObject.zipcode[0].startTrackDate); // / 1000;
    // self.maxDate = self.myDate;

    
}]);
