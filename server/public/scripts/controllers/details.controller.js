myApp.controller('DetailsController', ['UserService', '$location', '$scope', function (UserService, $location, $scope) {
    // console.log('DetailsController created');
    let self = this;
    self.userService = UserService;
    self.selectedDatesTimes = [];
    self.today = new Date();
    self.minDate = new Date(UserService.selectedZipData.startTrackDate);
    self.newComment = { comment: '' };
    self.updateComment = {comment: ''};

    // self.postComment = UserService.postComment;
    // self.updateComment = UserService.updateComment;
    // self.deleteComment = UserService.deleteComment;

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
        if(!UserService.selectedZipData.weather){
            $location.path('/dashboard');
        } else {
            self.bakeDatePie();
        }
    }

    self.nextDay = () => {
        let thisDay = UserService.selectedDate.date;
        let nextDay = thisDay.setDate(thisDay.getDate() + 1);
        UserService.selectedDate.date = new Date(nextDay);
        self.bakeDatePie();
    }


    self.prevDay = () => {
        let thisDay = UserService.selectedDate.date;
        let prevDay = thisDay.setDate(thisDay.getDate() - 1);
        UserService.selectedDate.date = new Date(prevDay);
        self.bakeDatePie();
    }

    self.getZipData = () => {
        UserService.selectedTime.time = '';
        UserService.timeSlice = {}
        zip = UserService.selectedLocation.location.slice(0,5);
        for(let zipcode of UserService.zipcodes.list){
            if(zipcode.weatherData.zipcode == zip){
                UserService.selectedZipData.weather = zipcode.weatherData.weather;                
            }
        }
    }

    self.cutTimeSlice = (timePassedIn) => {
        let time
        if(timePassedIn) {
            UserService.selectedTime.time = timePassedIn;
            time = UserService.selectedTime.time;
        } else {
            time = UserService.selectedTime.time;
        }
        for(let slice of UserService.datePie.selectedDatesWeather){
            if (slice.dt.slice(slice.dt.indexOf(',') + 2) == time){
                UserService.timeSlice = slice;
            }
        }
    }; // END self.cutTimeSlice

    self.bakeDatePie = () => {
        UserService.timeSlice = {};
        let selectedDate = new Date(UserService.selectedDate.date).toDateString();
        if(UserService.selectedZipData.weather){
            UserService.datePie.selectedDatesWeather = [];
            for (let clump of UserService.selectedZipData.weather) {
                let clumpDate = new Date(clump.dt).toDateString()
                if (clumpDate == selectedDate) {
                    clump.dt = new Date(clump.dt).toLocaleString();
                    UserService.datePie.selectedDatesWeather.push(clump);
                }
            }
            UserService.datePie.date.date = new Date(UserService.datePie.selectedDatesWeather[0].dt).toDateString();
            UserService.datePie.date.sunrise = new Date(UserService.datePie.selectedDatesWeather[0].sys.sunrise).toLocaleTimeString();
            UserService.datePie.date.sunset = new Date(UserService.datePie.selectedDatesWeather[0].sys.sunset).toLocaleTimeString(); 
            UserService.datePie.comments = UserService.selectedZipData.comments.filter(item => new Date(item.comment.relatedDate).toLocaleString() == new Date(UserService.datePie.date.date).toLocaleString());
            for(let i = 0; i < self.chartData.length; i++){
                self.makeChart(i, self.chartData[i].chartLabel, self.chartData[i].chartColor);
            } 
            self.selectedDatesTimes = UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2));     
            console.log(UserService.selectedZipData.comments);
                   
        } else {
            alert('No data')
        }
    }; // END self.bakeDatePie

    self.makeChart = (i, chartLabel, chartColor) => {
        Chart.defaults.global.elements.point.hitRadius = 15;     
        let ctxArray = [
            { ctx: document.getElementById('temp') }, 
            { ctx: document.getElementById('pressure') }, 
            { ctx: document.getElementById('clouds') }, 
            { ctx: document.getElementById('windspeed') } 
        ];
        let dataPointsArray = [
            { dataPoints: UserService.datePie.selectedDatesWeather.map(item => item.main.temp) },
            { dataPoints: UserService.datePie.selectedDatesWeather.map(item => item.main.pressure) },
            { dataPoints: UserService.datePie.selectedDatesWeather.map(item => item.clouds.all) },
            { dataPoints: UserService.datePie.selectedDatesWeather.map(item => item.wind.speed) },
        ];
        let timesArray = UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2));
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


