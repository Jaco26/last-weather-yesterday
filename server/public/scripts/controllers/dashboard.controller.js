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
        UserService.selectedDate.date = new Date();
        UserService.selectedLocation.location = `${city}, ${zipcode}`;
        console.log(UserService.userObject.zipcode);
        for (let zip of UserService.zipcodes.list) {
            if (zip.weatherData.zipcode == zipcode) {
                // console.log('zip.weatherData', zip.weatherData);
                UserService.selectedZipData.zipcode = zip.weatherData.zipcode
                UserService.selectedZipData.zipId = zip.weatherData._id
                UserService.selectedZipData.weather = zip.weatherData.weather;
            }
        }
        for (let comment of UserService.userObject.comments) {
            if(comment.relatedZip == UserService.selectedZipData.zipId){
                UserService.selectedZipData.comments.push(comment);
            }
        }
        if(UserService.selectedZipData.weather[0]){
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