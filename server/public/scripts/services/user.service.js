myApp.service('UserService', ['$http', '$location', function ($http, $location) {
    console.log('UserService Loaded');
    let self = this;
    self.userObject = {};
    self.primaryZipCurrentWeather = {};
    self.zipcodes = {list: []}
    
    self.newZip = {zipcode: ''}


    self.getuser = function () {
        console.log('UserService -- getuser');
        $http.get('/api/user').then(function (response) {
            if (response.data.userInfo.username) {
                // user has a curret session on the server
                self.userObject = response.data.userInfo;
                self.primaryZipCurrentWeather = response.data.currentWeather; 
                self.zipcodes.list = [];
                console.log('USER OBJECT:', self.userObject);
                console.log('PRIMARY ZIP CURRENT WEATHER:', self.primaryZipCurrentWeather);
                for(let i = 0; i < self.userObject.zipcode.length; i++){
                    self.getUserZips(i);
                }
                console.log(self.userObject);
                console.log('UserService -- getuser -- User Data: ', self.userObject.username);
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
        $http({
            method: 'GET',
            url: `/database/zipcode/${self.userObject.zipcode[index].zipId}`
        }).then(response => {
            for(let item of response.data.weather) {
                item.dt = new Date(item.dt * 1000).toLocaleString();
            }
            self.zipcodes.list = [...self.zipcodes.list, response.data];
            console.log(self.zipcodes.list);
        }).catch(error => {
            console.log(error);            
        });
    }

    // Init 
  
    
}]);


// [...self.userObject, taco: {/*...self.userObject.zipcodeDate,*/ ...response.data }};



