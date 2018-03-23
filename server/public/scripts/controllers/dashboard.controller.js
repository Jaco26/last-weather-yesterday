myApp.controller('DashboardController', ['UserService', '$mdDialog', '$location', function (UserService, $mdDialog , $location) {
    const self = this;
    self.userService = UserService;

    self.showAddzipDialog = function (ev) {
        $mdDialog.show({
            contentElement: '#add-zip',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    self.showDetails = (zipcode, city, startTrackDate) => {
        UserService.selectedLocation.location = `${city}, ${zipcode}`;
        for (let zip of UserService.zipcodes.list) {
            if (zip.weatherData.zipcode == zipcode) {
                UserService.selectedZipData = zip.weatherData.weather;
            }
        }
        UserService.selectedZipData.startTrackDate = startTrackDate;
        $location.path('/details');
    }

    self.menter = (x) => {
        let card = document.querySelector(`#card-${x}`);
        card.style.backgroundColor = '#ffffff10';
    }

    self.mleave = (x) => {
        document.querySelector(`#card-${x}`).style.backgroundColor = 'white'   
    }

    // ngInit
    self.init = () => {
        UserService.getuser();
        UserService.timeSlice = {};
        UserService.selectedTime.time = {};
        UserService.selectedDate.date = '';
    }



}]); // END ManageController