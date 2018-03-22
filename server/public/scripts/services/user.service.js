myApp.service('UserService', ['$http', '$location', function ($http, $location) {
    console.log('UserService Loaded');
    let self = this;
    self.userObject = {}; // Holds username, _id, comments, zipcodes, and photos array
    self.primaryZipCurrentWeather = {}; // Holds the returned current weather for users primary zip
    self.zipcodes = {list: []}; // Holds a list of zipcodes––and associated weather data––associated with the user; each includes the date the user started tracking it.
    self.newZip = {zipcode: ''}; // For a user adds a new zipcode while they are logged on
    self.selectedLocation = { location: '' }; // Holds the selected location (City, Zipcode) for which to view weater data
    self.selectedDate = {date: ''}; // Holds the selected date for which to view weater data
    self.selectedTime = { time: ''}; // Holds the selected time point for which to view weather data
    self.selectedZipData = {}; // Holds all available weather objects for the selected zipcode (selectedLocation.location) and its startTrackDate 
    self.timeSlice = {}; // Holds all weather data for the selected time (selectedTime.time) 
    // self.weatherQueryTimeInterval = {}; // NOT YET USED... MAY NOT USE...


    self.getuser = function () {
        console.log('UserService -- getuser');
        $http.get('/api/user').then(function (response) {
            if (response.data.userInfo.username) {
                // user has a curret session on the server
                self.userObject = response.data.userInfo;
                self.primaryZipCurrentWeather = response.data.currentWeather; 
                self.zipcodes.list = [];
                for(let i = 0; i < self.userObject.zipcode.length; i++){
                    self.getUserZips(i);
                }
                // console.log('UserService -- getuser -- User Data: ', self.userObject.username);
            } else {
                console.log('UserService -- getuser -- failure');
                // user has no session, bounce them back to the login page
                $location.path("/login");
            }
        }, function (response) {
            console.log('UserService -- getuser -- failure: ', response);
            $location.path("/login");
        });
    },

    self.logout = function () {
        console.log('UserService -- logout');
        $http.get('/api/user/logout').then(function (response) {
            console.log('UserService -- logout -- logged out');
            $location.path("/login");
            self.userObject = {};
            self.zipcode.list = [];
        });
    }

    self.submitZip = () => {
        if (self.newZip.zipcode.match(/\D/) || self.newZip.zipcode.length !== 5){
            alert('Enter a valid zipcode')
        } else {
            $http({
                method: 'POST',
                url: `/database/zipcode/${self.userObject._id}`,
                data: self.newZip
            }).then(response => {
                self.getuser();
                self.newZip.zipcode = '';
            }).catch(error => {
                console.log('error');
            });
        }
    }

    // GET all user's zipcodes and associated weather data
    self.getUserZips = (index) => {
        let zipcode = {};
        $http({
            method: 'GET',
            url: `/database/zipcode/${self.userObject.zipcode[index].zipId}`
        }).then(response => {
            zipcode.weatherData = response.data;
            for(let i = 0; i < response.data.weather.length; i++) {
                response.data.weather[i].dt = new Date(response.data.weather[i].dt * 1000).toLocaleString();
                let trackDate = self.userObject.zipcode.filter(zip => {
                    if (zip.zipId == response.data._id) {
                        return zip.startTrackDate;
                    }
                });      
                zipcode.startTrackDate = new Date(trackDate[0].startTrackDate).toDateString();   
            }
            // console.log('ZIPCODE LIST:', self.zipcodes.list);
            self.zipcodes.list = [...self.zipcodes.list, zipcode];
        }).catch(error => {
            console.log(error);            
        });
    } // END self.getUserZips
   
    // Init 
    self.getuser();

}]);



