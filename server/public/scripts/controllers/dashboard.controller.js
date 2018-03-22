myApp.controller('DashboardController', ['UserService', '$mdDialog', '$location', function (UserService, $mdDialog , $location) {
    const self = this;
    self.userService = UserService;

    self.showAddzipDialog = function (ev) {
        $mdDialog.show({
            contentElement: '#myDialog',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    self.showDetails = (zipcode, city, startTrackDate) => {
        // console.log('ZIPCODE', zipcode, 'START TRACK DATE', startTrackDate);
        UserService.dateCtrls.location = `${city}, ${zipcode}`;
        // console.log(UserService.dateCtrls.location);
        for (let zip of UserService.zipcodes.list) {
            if (zip.weatherData.zipcode == zipcode) {
                UserService.currentZipData = zip.weatherData.weather;
                console.log('UserService.currentZipData', UserService.currentZipData);
            }
        }
        $location.path('/details');
    }

    self.menter = (x) => {
        let card = document.querySelector(`#card-${x}`);
        card.style.backgroundColor = '#bbffee40';
        // card.style.cursor = 'pointer';
    }

    self.mleave = (x) => {
        document.querySelector(`#card-${x}`).style.backgroundColor = 'white'   
    }

    
}]); // END ManageController