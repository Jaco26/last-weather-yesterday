myApp.controller('DashboardController', ['UserService', '$mdDialog', '$location', '$rootScope', function (UserService, $mdDialog , $location, $rootScope) {
    const self = this;
    self.userService = UserService;

    self.menter = (x) => {
        let card = document.querySelector(`#card-${x}`);
        card.style.backgroundColor = '#ffffff10';
    }

    self.mleave = (x) => {
        document.querySelector(`#card-${x}`).style.backgroundColor = 'white'
    }

    self.showAddzipDialog = function (ev) {
        $mdDialog.show({
            contentElement: '#add-zip',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            escapeToClose: true
        });
    };

    self.organizeLocationDetails = (zipcode, city, startTrackDate) => {
        UserService.selectedDate.date = new Date();
        UserService.selectedLocation.location = `${city}, ${zipcode}`;
        for (let zip of UserService.zipcodes.list) {
            if (zip.weatherData.zipcode == zipcode) {
                UserService.selectedZipData.zipcode = zip.weatherData.zipcode
                UserService.selectedZipData.zipId = zip.weatherData._id
                UserService.selectedZipData.startTrackDate = startTrackDate;
                UserService.selectedZipData.allWeather = zip.weatherData.weather;
                self.findHowManyUniqueDatesForSelectedZipcode();
                self.parseWeatherByDate();
                $rootScope.parseCommentsByZipcodeAndDate(zip.weatherData._id);
            }
        }
        for (let comment of UserService.userObject.comments) {
            if(comment.comment.relatedZip == UserService.selectedZipData.zipId){
                UserService.selectedZipData.comments.push(comment);
            }
        }
        if (UserService.selectedZipData.allWeather[0]){
            $location.path('/details');
        } else {
            swal('There\'s nothing here! Come back in an hour and you should see something...');
        }        
    }

    self.findHowManyUniqueDatesForSelectedZipcode = () => {
        UserService.selectedZipData.weatherByDate = [];
        UserService.selectedZipData.commentsByDate = [];
        UserService.selectedZipData.photosByDate = [];
        for (let i = 0; i < UserService.selectedZipData.allWeather.length; i++) {
            if(i > 0) {
                let date = new Date(UserService.selectedZipData.allWeather[i].dt).toDateString();
                let dateBefore = new Date(UserService.selectedZipData.allWeather[i - 1].dt).toDateString();
                if (date != dateBefore && UserService.selectedZipData.allWeather.length === 0) {
                    UserService.selectedZipData.weatherByDate.push({date: dateBefore, weather: []});
                    UserService.selectedZipData.weatherByDate.push({date: date, weather: []});
                    UserService.selectedZipData.commentsByDate.push({ date: dateBefore, comments: [] });
                    UserService.selectedZipData.commentsByDate.push({date: date, comments: [] });
                    UserService.selectedZipData.photosByDate.push({ date: dateBefore, photos: [] });
                    UserService.selectedZipData.photosByDate.push({ date: date, comments: [] });
                } else if (date != dateBefore){
                    UserService.selectedZipData.weatherByDate.push({date: date, weather: []});
                    UserService.selectedZipData.commentsByDate.push({ date: date, comments: [] });
                    UserService.selectedZipData.photosByDate.push({ date: date, photos: [] });
                }
            }  
        }
    }

    self.parseWeatherByDate = () => {
        for (let weatherObject of UserService.selectedZipData.allWeather){
            for(let date of UserService.selectedZipData.weatherByDate) {
                if (new Date(weatherObject.dt).toDateString() == date.date) {
                    weatherObject.dt = new Date(weatherObject.dt).toLocaleString();
                    date.weather.push(weatherObject)
                }
            }     
        }
    }

    $rootScope.parseCommentsByZipcodeAndDate = (zipcodeId) => {        
        for(let commentObject of UserService.userObject.comments){
            for(let date of UserService.selectedZipData.commentsByDate){                
                if (zipcodeId === commentObject.comment.relatedZip) {
                    if (new Date(commentObject.comment.relatedDate).toDateString() == date.date) {
                        commentObject.comment.relatedDate = new Date(commentObject.comment.relatedDate).toLocaleString();
                        date.comments.push(commentObject);
                    }
                }     
            }
        }
    }
  
}]); // END ManageController