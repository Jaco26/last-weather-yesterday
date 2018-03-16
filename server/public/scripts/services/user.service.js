myApp.service('UserService', ['$http', '$location', function ($http, $location) {
    console.log('UserService Loaded');
    let self = this;
    self.userObject = {};
    self.zipcode = {list: []}
    
    self.newZip = {zipcode: ''}


    self.getuser = function () {
        console.log('UserService -- getuser');
        $http.get('/api/user').then(function (response) {
            if (response.data.username) {
                // user has a curret session on the server
                self.userObject = response.data;
                self.zipcode.list = [];
                for(let i = 0; i < self.userObject.zipcodeDate.length; i++){
                    console.log(i);
                    self.getUserZips(i);
                }
                console.log('UserService -- getuser -- User Data: ', self.userObject.username);
            } else {
                console.log('UserService -- getuser -- failure');
                // user has no session, bounce them back to the login page
                $location.path("/home");
            }
        }, function (response) {
            console.log('UserService -- getuser -- failure: ', response);
            $location.path("/home");
        });
    },

    self.logout = function () {
        console.log('UserService -- logout');
        $http.get('/api/user/logout').then(function (response) {
            console.log('UserService -- logout -- logged out');
            $location.path("/home");
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
            url: `/database/zipcode/${self.userObject.zipcodeDate[index].zipcode}`
        }).then(response => {
            self.zipcode.list = [...self.zipcode.list, response.data];
            console.log(self.zipcode.list);
        }).catch(error => {
            console.log(error);            
        });
    }

    // Init 
  
    
}]);


// [...self.userObject, taco: {/*...self.userObject.zipcodeDate,*/ ...response.data }};