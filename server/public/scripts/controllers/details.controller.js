myApp.controller('DetailsController', ['UserService', '$location', function (UserService, $location) {
    console.log('UserController created');
    let self = this;
    self.userService = UserService;

    self.timeToView = '';

    self.goBack = () => {
        $location.path('/dashboard');
    }


    self.getZipData = () => {
        console.log('UserService.selectedLocation.location', UserService.selectedLocation.location);
        UserService.selectedTime.time = '';
        UserService.timeSlice = {}
        zip = UserService.selectedLocation.location.slice(0,5);
        for(let zipcode of UserService.zipcodes.list){
            if(zipcode.weatherData.zipcode == zip){
                UserService.selectedZipData = zipcode.weatherData.weather;
                console.log('UserService.selectedZipData', UserService.selectedZipData);
                
            }
        }
    }

    self.setTimeData = () => {
        let time = UserService.selectedTime.time;
        for(let slice of UserService.selectedZipData){
            if(slice.dt == time){
                 UserService.timeSlice = slice;
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
