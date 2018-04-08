myApp.controller('DemoController', ['DemoService', '$http', '$scope', '$location', function (DemoService, $http, $scope, $location){
    const self = this;
    self.demoService = DemoService;
  
    self.init = () => {
        if(!DemoService.demoData.weatherByDate[0]){
            $location.path('/login');
        } else {
            self.viewWeatherByDate();
        }
    }
    
    self.viewWeatherByDate = () => {
        DemoService.timeSlice = {};
        let selectedDate = new Date(DemoService.selectedDate.date).toDateString();
        for (let date of DemoService.demoData.weatherByDate) {
            if (date.date == selectedDate) {
                DemoService.selectedDate.weather = date.weather;
            }
        }
        DemoService.selectedDate.sunset = new Date(DemoService.selectedDate.weather[0].sys.sunset).toLocaleTimeString();
        DemoService.selectedDate.sunrise = new Date(DemoService.selectedDate.weather[0].sys.sunrise).toLocaleTimeString();
        DemoService.selectedDate.times = DemoService.selectedDate.weather.map(item => item.dt.slice(item.dt.indexOf(',') + 2));
        DemoService.chartData.forEach((item, index) => {
            self.makeChart(index, item.chartLabel, item.chartColor);
        });
    }

    self.cutTimeSlice = (timePassedIn) => {
        let time = DemoService.selectedTime.time;
        if (timePassedIn) {
            DemoService.selectedTime.time = timePassedIn;
            time = DemoService.selectedTime.time;
        }
        for (let slice of DemoService.selectedDate.weather) {
            if (slice.dt.slice(slice.dt.indexOf(',') + 2) == time) {
                DemoService.timeSlice = slice;
            }
        }
    }

    self.nextDay = () => {
        let thisDay = DemoService.selectedDate.date;
        let nextDay = new Date(thisDay.setDate(thisDay.getDate() + 1)).toDateString();
        if (new Date(nextDay) > new Date(DemoService.demoData.weatherByDate.slice(-1)[0].date)) {
            new Date(thisDay.setDate(thisDay.getDate() - 1));
            swal(`There's no data for ${new Date(nextDay).toLocaleDateString()}`);
        } else {
            DemoService.selectedDate.date = new Date(nextDay);
            self.viewWeatherByDate();
        }
    }

    self.prevDay = () => {
        let thisDay = DemoService.selectedDate.date;
        let prevDay = new Date(thisDay.setDate(thisDay.getDate() - 1)).toDateString();
        if (new Date(prevDay) < new Date(DemoService.demoData.weatherByDate[0].date)) {
            new Date(thisDay.setDate(thisDay.getDate() + 1));
            swal(`There\'s no data for ${new Date(prevDay).toLocaleDateString()}`);
        } else {
            DemoService.selectedDate.date = new Date(prevDay);
            self.viewWeatherByDate();
        }
    }

    self.makeChart = (i, chartLabel, chartColor) => {
        Chart.defaults.global.elements.point.hitRadius = 15;
        let ctxArray = [
            { ctx: document.getElementById('demo-temp') },
            { ctx: document.getElementById('demo-pressure') },
            { ctx: document.getElementById('demo-clouds') },
            { ctx: document.getElementById('demo-windspeed') }
        ];
        let dataPointsArray = [
            { dataPoints: DemoService.selectedDate.weather.map(item => item.main.temp) },
            { dataPoints: DemoService.selectedDate.weather.map(item => item.main.pressure) },
            { dataPoints: DemoService.selectedDate.weather.map(item => item.clouds.all) },
            { dataPoints: DemoService.selectedDate.weather.map(item => item.wind.speed) },
        ];
        let timesArray = DemoService.selectedDate.weather.map(item => item.dt.slice(item.dt.indexOf(',') + 2));
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
                        DemoService.selectedTime.time = timesArray[0]._xScale.ticks[timesArray[0]._index];
                        self.cutTimeSlice();
                    });
                },
                tooltips: {
                    enabled: false,
                    mode: 'index',
                    intersect: true,
                },
                // scales: {
                //     yAxes: [{
                //         ticks: {
                //             beginAtZero: true,
                //         }
                //     }],
                // },
            }
        });
    }

}]);


