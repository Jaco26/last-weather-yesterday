myApp.controller('DetailsController', ['UserService', '$location', '$scope', '$rootScope', function (UserService, $location, $scope, $rootScope) {
    // console.log('DetailsController created');
    let self = this;
    self.userService = UserService;
    self.selectedDatesTimes = [];
    self.today = new Date();
    self.minDate = new Date(UserService.selectedZipData.startTrackDate);
    self.newComment = { comment: '' };
    self.updateComment = {comment: ''};

    self.chartData = [
        { chartLabel: 'Temperature ˚F', chartColor: 'pink' },
        { chartLabel: 'Atmospheric Pressure (hPa)', chartColor: 'lightblue' },
        { chartLabel: '% Cloud Cover', chartColor: 'gray' },
        { chartLabel: 'Windspeed (miles/hour)', chartColor: 'lightgreen' }
    ];

    self.goBack = () => {
        UserService.timeSlice = {};
        $location.path('/dashboard');
    }

    self.rerouteOnRefresh = () => {
        if(!UserService.selectedZipData.allWeather[0]){
            $location.path('/dashboard');
        } else {
            self.viewWeatherByDate();
            $rootScope.viewCommentsByDate();
        }
    }

    self.nextDay = () => {
        let thisDay = UserService.selectedDate.date;
        let nextDay = new Date(thisDay.setDate(thisDay.getDate() + 1)).toDateString();
        if (new Date(nextDay) > new Date(UserService.selectedZipData.weatherByDate[UserService.selectedZipData.weatherByDate.length -1].date)){
            new Date(thisDay.setDate(thisDay.getDate() - 1));
            swal(`There\'s no data for ${new Date(nextDay).toLocaleDateString()}`)
        } else {
            UserService.selectedDate.date = new Date(nextDay);
            self.viewWeatherByDate();
            $rootScope.viewCommentsByDate();
        }
    }

    self.prevDay = () => {
        let thisDay = UserService.selectedDate.date;
        let prevDay = new Date(thisDay.setDate(thisDay.getDate() - 1)).toDateString();
        if(new Date(prevDay) < new Date(UserService.selectedZipData.weatherByDate[0].date)){
            new Date(thisDay.setDate(thisDay.getDate() + 1));
            swal(`There\'s no data for ${new Date(prevDay).toLocaleDateString()}`);
        } else {
            UserService.selectedDate.date = new Date(prevDay);
            self.viewWeatherByDate();
            $rootScope.viewCommentsByDate();
        }
    
    }

    self.getZipData = () => {
        UserService.selectedTime.time = '';
        UserService.timeSlice = {}
        zip = UserService.selectedLocation.location.slice(0,5);
        for(let zipcode of UserService.zipcodes.list){
            if(zipcode.weatherData.zipcode == zip){
                UserService.selectedZipData.allWeather = zipcode.weatherData.weather;                
            }
        }
    }

    self.cutTimeSlice = (timePassedIn) => {
        let time = UserService.selectedTime.time;
        if(timePassedIn) {
            UserService.selectedTime.time = timePassedIn;
            time = UserService.selectedTime.time;
        } 
        for(let slice of UserService.selectedDate.weather){
            if (slice.dt.slice(slice.dt.indexOf(',') + 2) == time){
                UserService.timeSlice = slice;
            }
        }
    }; // END self.cutTimeSlice

    self.viewWeatherByDate = () => {
        UserService.timeSlice = {};
        let selectedDate = new Date(UserService.selectedDate.date).toDateString();
        for(let date of UserService.selectedZipData.weatherByDate){
            if(date.date === selectedDate){
                UserService.selectedDate.weather = date.weather;
            } 
        }
        // if(!UserService.selectedDate.weather[0]){
        //     swal('There\'s no data for today!');
        // }
        UserService.selectedDate.sunset = new Date(UserService.selectedDate.weather[0].sys.sunset).toLocaleTimeString();
        UserService.selectedDate.sunrise = new Date(UserService.selectedDate.weather[0].sys.sunrise).toLocaleTimeString();
        self.selectedDatesTimes = UserService.selectedDate.weather.map(item => item.dt.slice(item.dt.indexOf(',') + 2)); 
        for (let i = 0; i < self.chartData.length; i++) {
            self.makeChart(i, self.chartData[i].chartLabel, self.chartData[i].chartColor);
        } 
    }

    $rootScope.viewCommentsByDate = () => {
        let selectedDate = new Date(UserService.selectedDate.date).toDateString();
        for(let date of UserService.selectedZipData.commentsByDate){
            if(date.date === selectedDate){
                UserService.selectedDate.comments = date.comments;
            }
        }
    }

    self.makeChart = (i, chartLabel, chartColor) => {
        Chart.defaults.global.elements.point.hitRadius = 15;     
        let ctxArray = [
            { ctx: document.getElementById('temp') }, 
            { ctx: document.getElementById('pressure') }, 
            { ctx: document.getElementById('clouds') }, 
            { ctx: document.getElementById('windspeed') } 
        ];
        let dataPointsArray = [
            { dataPoints: UserService.selectedDate.weather.map(item => item.main.temp) },
            { dataPoints: UserService.selectedDate.weather.map(item => item.main.pressure) },
            { dataPoints: UserService.selectedDate.weather.map(item => item.clouds.all) },
            { dataPoints: UserService.selectedDate.weather.map(item => item.wind.speed) },
        ];
        let timesArray = UserService.selectedDate.weather.map(item => item.dt.slice(item.dt.indexOf(',') + 2));
        let ctx = ctxArray[i].ctx;
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: timesArray,
                datasets: [
                    {
                        label: chartLabel,
                        borderColor: chartColor,
                        data: dataPointsArray[i].dataPoints,
                        fill: false
                    },
                ]
            },
            options: {
                events: ['click'],
                onClick: function (event, timesArray) {
                    $scope.$apply(function () {
                        //my non angular code
                        UserService.selectedTime.time = timesArray[0]._xScale.ticks[timesArray[0]._index];
                        self.cutTimeSlice();
                    });
                },
                tooltips: {
                    enabled: false,
                    mode: 'index',
                    intersect: true,
                }
            }
        });
    }
}]);


