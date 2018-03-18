myApp.service('UserService', ['$http', '$location', function ($http, $location) {
    console.log('UserService Loaded');
    let self = this;
    self.userObject = {};
    self.zipcodes = {list: []}
    
    self.newZip = {zipcode: ''}


    self.getuser = function () {
        console.log('UserService -- getuser');
        $http.get('/api/user').then(function (response) {
            if (response.data.username) {
                // user has a curret session on the server
                self.userObject = response.data;
                self.zipcodes.list = [];
                for(let i = 0; i < self.userObject.zipcodeDate.length; i++){
                    console.log(i);
                    self.getUserZips(i);
                }
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
            url: `/database/zipcode/${self.userObject.zipcodeDate[index].zipcode}`
        }).then(response => {
            self.zipcodes.list = [...self.zipcodes.list, response.data];
            console.log(self.zipcodes.list);
        }).catch(error => {
            console.log(error);            
        });
    }

    // Init 
  
    
}]);


// [...self.userObject, taco: {/*...self.userObject.zipcodeDate,*/ ...response.data }};



