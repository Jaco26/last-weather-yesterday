myApp.controller('HomeController', ['UserService', function (UserService) {
    console.log('UserController created');
    let self = this;
    self.userService = UserService;

    self.timeToView = '';

    self.getZipData = () => {
        console.log('UserService.dateCtrls.location', UserService.dateCtrls.location);
        UserService.dateCtrls.time = '';
        UserService.timeSlice = {}
        zip = UserService.dateCtrls.location.slice(0,5);
        for(let zipcode of UserService.zipcodes.list){
            if(zipcode.weatherData.zipcode == zip){
                UserService.currentZipData = zipcode.weatherData.weather;
                console.log('UserService.currentZipData', UserService.currentZipData);
                
            }
        }
    }

    self.setTimeData = () => {
        let time = UserService.dateCtrls.time;
        for(let slice of UserService.currentZipData){
            if(slice.dt == time){
                 UserService.timeSlice = slice;
            }
        }
    }

    // self.myDate = new Date();
    // self.minDate = new Date(self.userService.userObject.zipcode[0].startTrackDate); // / 1000;
    // self.maxDate = self.myDate;

    
}]);
