myApp.controller('LoginController', ['$http', '$location', 'UserService', 'DemoService', '$scope', function ($http, $location, UserService, DemoService, $scope) {
    console.log('LoginController created');
    let self = this;
    self.user = {
        username: '',
        password: '',
        passwordConfirm: '',
        firstZipcode: { zipcode: '' },
    };
    self.message = '';

    self.getuser = UserService.getuser;
    // self.viewWeatherByDate();

    self.login = function () {
        if (self.user.username === '' || self.user.password === '') {
            self.message = "Enter your username and password!";
        } else {
            console.log('sending to server...');
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
            console.log('sending to server...');
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

    self.prepareDemoData = function () {
        $http({
            method: 'GET',
            url: '/api/zipcode'
        }).then(response => {
            forWhichDatesDidWeGetData(response.data);
        }).catch(err => {
            console.log(err);
        });
    }


    function forWhichDatesDidWeGetData(data) {
        DemoService.selectedDate.date = new Date();
        DemoService.demoData.weatherByDate = [];
        data.forEach((object, i, dataArray) => {
            if (i > 0) {
                let date = new Date(object.weather.dt).toDateString();
                let dateBefore = new Date(dataArray[i - 1].weather.dt).toDateString();
                if (date != dateBefore && DemoService.demoData.weatherByDate.length === 0) {
                    DemoService.demoData.weatherByDate.push({ date: dateBefore, weather: [] });
                    DemoService.demoData.weatherByDate.push({ date: date, weather: [] });
                } else if (date != dateBefore) {
                    DemoService.demoData.weatherByDate.push({ date: date, weather: [] });
                }
            }
        });
        parseWeatherByDate(data);
    }

    function parseWeatherByDate(data) {
        for (let weatherObj of data) {
            for (let date of DemoService.demoData.weatherByDate) {
                if (new Date(weatherObj.weather.dt).toDateString() == date.date) {
                    weatherObj.weather.dt = new Date(weatherObj.weather.dt).toLocaleString();
                    date.weather.push(weatherObj.weather)
                }
            }
        }
        DemoService.lastAvailableDate.date = new Date(DemoService.demoData.weatherByDate[0].date);        
        $location.path('/demo')
    }

}]);
