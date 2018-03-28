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
    self.datePie = {date: {}, selectedDatesWeather: []}; // Holds all weather objects for a selected date...these come from selectedZipData
    self.timeSlice = {}; // Holds all weather data for the selected time (selectedTime.time) 
    // self.weatherQueryTimeInterval = {}; // NOT YET USED... MAY NOT USE...


    self.getuser = function () {
        console.log('HEYYYYY UserService -- getuser');
        $http.get('/api/user').then(function (response) {
            if (response.data.userInfo.username) {
                // user has a curret session on the server
                self.userObject = response.data.userInfo;
                self.zipcodes.list = [];
                for(let i = 0; i < self.userObject.zipcode.length; i++){
                    self.getUsersZipcodeData(i);
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
                response.status == 201 ? alert("We've begun tracking " + self.newZip.zipcode + " for you!"): null;
                self.getuser();
                self.newZip.zipcode = '';
            }).catch(error => {
                error.status == 403 ? alert("You're already tracking that zipcode"): null;
                console.log('error', error);
            });
        }
    }

    // GET all user's zipcodes and associated weather data
    self.getUsersZipcodeData = (index) => {
        let zipcode = {};
        $http({
            method: 'GET',
            url: `/database/zipcode/${self.userObject.zipcode[index].zipId}`
        }).then(response => {
            zipcode.weatherData = response.data;
            for (let chunk of response.data.weather) {
                let trackDate = self.userObject.zipcode.filter(zip => zip.zipId == response.data._id ? zip.startTrackDate : null);
                zipcode.startTrackDate = new Date(trackDate[0].startTrackDate).toDateString();
            }
            self.zipcodes.list = [...self.zipcodes.list, zipcode];
        }).catch(error => {
            console.log(error);            
        });
    } // END self.getUserZips

    self.submitComment = (newComment) => {
        let commentPackage = {
            comment: newComment.comment,
            relatedDate: new Date(self.selectedDate.date).toLocaleDateString(),
            relatedZip: self.selectedZipData.zipId,
            dateAdded: new Date().toLocaleString(),
        }
        $http({
            method: 'POST', 
            url: `api/user/comment/${self.userObject._id}`,
            data: commentPackage,
        }).then(response => {
            response.status == 201 ? alert('Note added!'): null;
            self.getuser();
            self.newComment.comment = '';
        }).catch(err => {
            console.log(err);
            alert(err.status + ' ' + err.statusText);
        })
          
    }
   
    // ngInit
    self.init = () => {
        self.getuser();
        self.timeSlice = {};
        self.selectedTime.time = {};
        self.selectedDate.date = '';
    }
   
}]);



