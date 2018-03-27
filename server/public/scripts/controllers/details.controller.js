myApp.controller('DetailsController', ['UserService', '$location', '$scope', function (UserService, $location, $scope) {
    // console.log('DetailsController created');
    let self = this;
    self.userService = UserService;
    self.makeChart = UserService.makeChart;
    self.today = new Date();
    self.minDate = new Date(UserService.selectedZipData.startTrackDate);
    self.chartData = [
        {
            // ctx: document.getElementById('temp'),
            // dataPoints: UserService.datePie.selectedDatesWeather.map(item => item.main.temp),
            chartLabel: 'Temperature ˚F',
            chartColor: 'pink'
        },
        {
            // ctx: document.getElementById('pressure'),
            // dataPoints: UserService.datePie.selectedDatesWeather.map(item => item.main.pressure),
            chartLabel: 'Atmospheric Pressure (hPa)',
            chartColor: 'lightblue'
        },
        {
            // ctx: document.getElementById('clouds'),
            // dataPoints: UserService.datePie.selectedDatesWeather.map(item => item.clouds.all),
            chartLabel: '% Cloud Cover',
            chartColor: 'gray'
        },
        {
            // ctx: document.getElementById('windspeed'),
            // dataPoints: UserService.datePie.selectedDatesWeather.map(item => item.wind.speed),
            chartLabel: 'Windspeed (miles/hour)',
            chartColor: 'lightgreen'
        }
    ];

    self.goBack = () => {
        UserService.timeSlice = {};
        $location.path('/dashboard');
    }

    self.rerouteOnRefresh = () => {
        if(!UserService.selectedZipData[0]){
            $location.path('/dashboard');
        } else {
            self.bakeDatePie();
        }
    }

    self.getZipData = () => {
        UserService.selectedTime.time = '';
        UserService.timeSlice = {}
        zip = UserService.selectedLocation.location.slice(0,5);
        for(let zipcode of UserService.zipcodes.list){
            // console.log(UserService.zipcodes.list);
            if(zipcode.weatherData.zipcode == zip){
                UserService.selectedZipData = zipcode.weatherData.weather;                
            }
        }
    }

    self.cutTimeSlice = () => {
        let time = UserService.selectedTime.time;
        for(let slice of UserService.datePie.selectedDatesWeather){
            if (slice.dt.slice(slice.dt.indexOf(',') + 2) == time){
                 UserService.timeSlice = slice;
            }
        }
    }; // END self.cutTimeSlice

    self.bakeDatePie = () => {
        let selectedDate = new Date(UserService.selectedDate.date).toDateString();
        console.log('selectedDate', selectedDate);
        
        if(UserService.selectedZipData[0]){
            UserService.datePie.selectedDatesWeather = [];
            for (let clump of UserService.selectedZipData) {
                let clumpDate = new Date(clump.dt).toDateString()
                if (clumpDate == selectedDate) {
                    clump.dt = new Date(clump.dt).toLocaleString();
                    UserService.datePie.selectedDatesWeather.push(clump);
                }
            }
            UserService.datePie.date.date = new Date(UserService.datePie.selectedDatesWeather[0].dt).toDateString();
            UserService.datePie.date.sunrise = new Date(UserService.datePie.selectedDatesWeather[0].sys.sunrise).toLocaleTimeString();
            UserService.datePie.date.sunset = new Date(UserService.datePie.selectedDatesWeather[0].sys.sunset).toLocaleTimeString();
            // console.log(UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2)));
            console.log(UserService.datePie.date.date);
            console.log(UserService.datePie.selectedDatesWeather);
            // self.makeChart(self.chartData[0].ctx, self.chartData[0].dataPoints, self.chartData[0].chartLabel, self.chartData[0].chartColor)
            for(let i = 0; i < self.chartData.length; i++){
                self.makeChart(i, self.chartData[i].chartLabel, self.chartData[i].chartColor);
            }
            
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
        // let ctx = document.getElementById('temp');
        let ctx = ctxArray[i].ctx;
        // console.log(ctx);
        // console.log('dataPoints', dataPoints);
        // console.log('chartLabel', chartLabel);
    
        
        let tempChart = new Chart(ctx, {
            type: 'line',
            data: {
                // labels: UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2)),
                labels: timesArray,
                datasets: [
                    {
                        // label: 'temperature ˚F',
                        label: chartLabel,
                        // borderColor: 'pink',
                        borderColor: chartColor,
                        // data: UserService.datePie.selectedDatesWeather.map(item => item.main.temp),
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
