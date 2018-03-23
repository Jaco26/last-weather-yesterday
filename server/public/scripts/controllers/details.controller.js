myApp.controller('DetailsController', ['UserService', '$location', function (UserService, $location) {
    // console.log('DetailsController created');
    let self = this;
    self.userService = UserService;
    self.today = new Date();
    self.minDate = new Date(UserService.selectedZipData.startTrackDate);

    self.goBack = () => {
        UserService.timeSlice = {};
        $location.path('/dashboard');
    }

    self.getZipData = () => {
        UserService.selectedTime.time = '';
        UserService.timeSlice = {}
        zip = UserService.selectedLocation.location.slice(0,5);
        for(let zipcode of UserService.zipcodes.list){
            // console.log(UserService.zipcodes.list);
            if(zipcode.weatherData.zipcode == zip){
                UserService.selectedZipData = zipcode.weatherData.weather;                
            }
        }
    }

    self.cutTimeSlice = () => {
        let time = UserService.selectedTime.time;
        for(let slice of UserService.selectedZipData){
            if(slice.dt == time){
                 UserService.timeSlice = slice;
            }
        }
    }

    self.bakeDatePie = () => {
        let selectedDate = new Date(UserService.selectedDate.date).toDateString();
        for(let clump of UserService.selectedZipData){
            clumpDate = new Date(clump.dt.slice(0, clump.dt.indexOf(','))).toDateString();
            if(clumpDate == selectedDate){
                UserService.datePie.selectedDatesWeather.push(clump);
            }
        }
    }

    self.showAlert = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#dialogContainer')))
                .clickOutsideToClose(true)
                .title('This is an alert title')
                .textContent('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
        );
    };

    





    // self.myDate = new Date();
    // self.minDate = new Date(self.userService.userObject.zipcode[0].startTrackDate); // / 1000;
    // self.maxDate = self.myDate;

    
}]);
