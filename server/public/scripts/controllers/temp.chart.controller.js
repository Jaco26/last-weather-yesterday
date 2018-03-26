myApp.controller('TempchartController', ['UserService', '$scope', function(UserService, $scope){
    let self = this;
    self.UserService = UserService;
    // self.chart = {ctx: '', config: {}} 
    
    self.hello = 'Hello Hi'
    self.ctx = document.getElementById('temp');
    self.config = {
        type: 'line',
        data: {
        labels: UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2)),

            datasets: [
                {
                    label: 'temperature ˚F',
                    borderColor: 'pink',
                    data: UserService.datePie.selectedDatesWeather.map(item => item.main.temp),
                    fill: false
                },
            ]
        },
        options: {
            onClick: function (event, timesArray) {
                $scope.$apply(function () {
                    //my non angular code
                    UserService.selectedTime.time = timesArray[0]._xScale.ticks[timesArray[0]._index];
                    UserService.cutTimeSlice();
                });
            },
            tooltips: {
                enabled: false,
                mode: 'nearest',
                intersect: true,
            }
        }
    }

    UserService.makeChart(self.ctx, self.config);

}])