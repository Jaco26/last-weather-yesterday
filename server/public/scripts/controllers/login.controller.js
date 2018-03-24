myApp.controller('LoginController', ['$http', '$location', 'UserService', function ($http, $location, UserService) {
    console.log('LoginController created');
    let self = this;
    self.user = {
        username: '',
        password: '',
        passwordConfirm: '',
        firstZipcode: {zipcode: ''},
    };
    self.message = '';

    self.getuser = UserService.getuser;

    self.login = function () {
        if (self.user.username === '' || self.user.password === '') {
            self.message = "Enter your username and password!";
        } else {
            console.log('sending to server...', self.user);
            $http.post('/api/user/login', self.user).then(
                function (response) {
                    if (response.status == 200) {
                        console.log('success: ', response.data);
                        // location works with SPA (ng-route)
                        $location.path('/dashboard');
                    } else {
                        console.log('failure error: ', response);
                        self.message = "Incorrect credentials. Please try again.";
                    }
                },
                function (response) {
                    console.log('failure error: ', response);
                    self.message = "Incorrect credentials. Please try again.";
                });
        }
    };

    self.registerUser = function () {
        if (self.user.username === '' || self.user.password === '' || self.user.passwordConfirm === '') {
            self.message = "Choose a username and password!";
        } else if (self.user.password !== self.user.passwordConfirm) {
            self.message = "Oops! Your password didn't match your password confirmation";
        } else if (self.user.firstZipcode.zipcode.match(/\D/) || self.user.firstZipcode.zipcode.length !== 5) {
            self.message = 'Enter a valid zipcode';
        } else {
            console.log('sending to server...', self.user);
            $http.post('/api/user/register', self.user).then(function (response) {
                console.log('success');
                $location.path('/login');
            },
                function (response) {
                    console.log('error');
                    self.message = "Something went wrong. Please try again."
                });
        }
    }

}]);
