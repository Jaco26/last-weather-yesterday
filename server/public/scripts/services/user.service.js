myApp.service('UserService', ['$http', '$location', '$rootScope', function ($http, $location, $rootScope) {
    console.log('UserService Loaded');
    let self = this;
    self.userObject = {
        username: '',
        _id: '',
        zipcode: [],
        comments: [],
        photos: [],
    }; // Holds username, _id, comments, zipcodes, and photos array
    self.zipcodes = {list: []}; // Holds a list of zipcodes––and associated weather data––associated with the user; each includes the date the user started tracking it.
    self.selectedZipData = {
        zipcode: '',
        zipId: '',
        startTrackDate: '',
        allWeather: [],
        weatherByDate: [],
        commentsByDate: [],
        photosByDate: []
    }; // Holds all available weather objects for the selected zipcode (selectedLocation.location) and its startTrackDate 
    self.newZip = {zipcode: ''}; // For a user adds a new zipcode while they are logged on
    self.selectedLocation = { location: '' }; // Holds the selected location (City, Zipcode) for which to view weather data
    self.selectedDate = {
        date: '', 
        sunrise: '',
        sunset: '',
        weather: [], 
        comments: [], 
        photos: []
    }; // Holds the selected date for which to view weater data
    self.selectedTime = { time: ''}; // Holds the selected time point for which to view weather data
    self.timeSlice = {}; // Holds all weather data for the selected time (selectedTime.time) 
    self.newComment = {comment: ''};
    // self.weatherQueryTimeInterval = {}; // NOT YET USED... MAY NOT USE...


    self.getuser = function () {
        console.log('UserService -- getuser');
        $http.get('/api/user').then(function (response) {
            if (response.data.userInfo.username) {
                // user has a curret session on the server
                self.userObject = response.data.userInfo;
                self.zipcodes.list = [];
                for(let i = 0; i < self.userObject.zipcode.length; i++){
                    self.getUsersZipcodeData(i);
                }     
                self.getUserComments();
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
            swal('Enter a valid zipcode!')
        } else {
            $http({
                method: 'POST',
                url: `/api/zipcode/${self.userObject._id}`,
                data: self.newZip
            }).then(response => {
                response.status == 201 ? swal("We've begun tracking " + self.newZip.zipcode + " for you!"): null;
                self.getuser();
                self.newZip.zipcode = '';
            }).catch(error => {
                error.status == 403 ? swal(`You've reached your maximum of three zipcodes to track!`, 
                `Since this project was for a school assignment with a two week deadline, immediatly
                followed by another work intersive project (which I am in the middle of now 4/8/2018) 
                I have not yet written the database logic to allow you to manage your zipcodes once you have chosen them. 
                You should be able to manage your zipcodes by mid-may. Until then, I hope you enjoy what you have :)`): null;
                error.status == 401 ? swal("You're already tracking that zipcode"): null;
                console.log('error', error);
            });
        }
    }

    // GET all user's zipcodes and associated weather data
    self.getUsersZipcodeData = (index) => {
        let zipcode = {};
        $http({
            method: 'GET',
            url: `/api/zipcode/${self.userObject.zipcode[index].zipId}`
        }).then(response => {
            zipcode.weatherData = response.data;
            for (let chunk of response.data.weather) {
                let trackDate = self.userObject.zipcode.filter(zip => zip.zipId == response.data._id ? zip.startTrackDate : null);
                zipcode.startTrackDate = new Date(trackDate[0].startTrackDate).toDateString();
            }
            self.zipcodes.list = [...self.zipcodes.list, zipcode];;
        }).catch(error => {
            console.log(error);            
        });
    } // END self.getUserZips


    // ADD A COMMENT
    self.postComment = () => {
        let commentPackage = {
            comment: self.newComment.comment,
            relatedDate: new Date(self.selectedDate.date).toLocaleDateString(),
            relatedZip: self.selectedZipData.zipId,
            dateAdded: new Date(),
        }
        $http({
            method: 'POST', 
            url: `api/comment/${self.userObject._id}`,
            data: commentPackage,
        }).then(response => {
            swal('Success!')
            self.getuser();
            self.newComment.comment = '';
        }).catch(err => {
            console.log(err);
        })
          
    }
    // GET COMMENTS
    self.getUserComments = () => {
        $http({
            method: 'GET',
            url: `/api/comment/blabla`,
        }).then(response => {
            self.userObject.comments = [];
            for(let comment of response.data){
                comment.comment.dateAdded = new Date(comment.comment.dateAdded).toLocaleString();
                self.userObject.comments.push(comment);
            }
            if(self.selectedZipData.zipId){
                self.selectedZipData.commentsByDate.forEach(date => date.comments = []);
                $rootScope.parseCommentsByZipcodeAndDate(self.selectedZipData.zipId);
                $rootScope.viewCommentsByDate();
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // UPDATE COMMENT
    self.updateComment = (index, updatedComment) => {
        let commentId = self.selectedDate.comments[index].refIds.commentId;
        $http({
            method: 'PUT',
            url: `/api/comment/${commentId}`,
            data: {updatedComment: updatedComment},
        }).then(response => {
            self.getuser();
        }).catch(err => {
            console.log(err);
        }); 
    }

    self.deleteComment = (index) => {
        let commentId = self.selectedDate.comments[index].refIds.commentId;
        let objectId = self.selectedDate.comments[index].refIds._id;
        $http({
            method: 'DELETE',
            url: `/api/comment/${commentId}/${objectId}`,
        }).then(response => {
            self.getuser();
        }).catch(err => {
            console.log(err);
        });
    }
   
    // ngInit
    self.init = () => {
        self.getuser();
        self.timeSlice = {};
        self.selectedTime.time = {};
        self.selectedDate.date = '';
        self.selectedZipData.comments = [];
    }
   
}]);



