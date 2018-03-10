myApp.service('UserService', ['$http', '$location', function ($http, $location) {
    console.log('UserService Loaded');
    let self = this;
    self.userObject = {};
    
    self.newZip = {zipcode: ''}

    self.getuser = function () {
        console.log('UserService -- getuser');
        $http.get('/api/user').then(function (response) {
            if (response.data.username) {
                // user has a curret session on the server
                self.userObject = response.data;
                console.log('UserService -- getuser -- User Data: ', self.userObject);
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
            });
        }

        self.submitZip = () => {
            if (self.newZip.zipcode.match(/\D/) || self.newZip.zipcode.length !== 5){
                alert('Enter a valid zipcode')
            } else {
                $http({
                    method: 'POST',
                    url: '/database/zipcode',
                    data: self.newZip,
                }).then(response => {
                    self.getuser();
                    self.newZip.zipcode = '';
                }).catch(error => {
                    console.log('error');
                });
            }
            
        }


}]);
