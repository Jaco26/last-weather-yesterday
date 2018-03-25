myApp.controller('DashboardController', ['UserService', '$mdDialog', '$location', function (UserService, $mdDialog , $location) {
    const self = this;
    self.userService = UserService;

    self.showAddzipDialog = function (ev) {
        $mdDialog.show({
            contentElement: '#add-zip',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            escapeToClose: true
        });
    };

    self.showDetails = (zipcode, city, startTrackDate) => {
        UserService.selectedLocation.location = `${city}, ${zipcode}`;
        for (let zip of UserService.zipcodes.list) {
            if (zip.weatherData.zipcode == zipcode) {
                UserService.selectedZipData = zip.weatherData.weather;
            }
        }
        if(UserService.selectedZipData[0]){
            UserService.selectedZipData.startTrackDate = startTrackDate;
            $location.path('/details');
        } else {
            alert('There\'s nothing here! Come back in an hour and you should see something...');
        }
    }

    self.menter = (x) => {
        let card = document.querySelector(`#card-${x}`);
        card.style.backgroundColor = '#ffffff10';
    }

    self.mleave = (x) => {
        document.querySelector(`#card-${x}`).style.backgroundColor = 'white'   
    }

  


}]); // END ManageController