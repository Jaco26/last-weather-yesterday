myApp.controller('ChartController', ['UserService',  function(UserService) {
    const self = this;
    self.userService = UserService;

    UserService.makeChart = self.makeChart;

    self.makeChart = () => {
        const ctx = document.getElementById('temp');
        const tempChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2)),
                datasets: [
                    {
                        label: 'temperature ˚F',
                        backgroundColor: 'lightgray',
                        data: UserService.datePie.selectedDatesWeather.map(item => item.main.temp),
                    },
                ]
            },
        });
    }
   

}]); // END ChartController

