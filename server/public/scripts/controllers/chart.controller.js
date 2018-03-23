myApp.controller('ChartController', ['UserService',  function(UserService) {
    const self = this;
    self.userService = UserService;

    const ctx = document.getElementById('temp');
    const tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['temperature ˚F'],
            datasets: [
                {
                    label: 'temperature ˚F',
                    backgroundColor: 'lightgray',
                    backgroundColor: 'darkgray',
                    data: UserService.datePie.selectedDatesWeather.map(item => item.main.temp),
                },
            ]
        },
        options: {
            
        }
       
    })

    console.log(UserService.datePie.selectedDatesWeather.map(item => item.main.temp));
    
    

}]); // END ChartController

