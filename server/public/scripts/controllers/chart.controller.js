myApp.controller('ChartController', ['UserService',  function(UserService) {
    const self = this;
    self.userService = UserService;

    const ctx = document.getElementById('temp');
    const tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2)),
            datasets: [
                {
                    label: 'temperature ˚F',
                    backgroundColor: 'lightgray',
                    // backgroundColor: 'darkgray',
                    data: UserService.datePie.selectedDatesWeather.map(item => item.main.temp),
                    // data: UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2)),
                },
            ]
        },
        // options: {
        //     scales: {
        //         yAxes: [{
        //             // ticks: {
        //             //     max: 60,
        //             //     min: 0,
        //             //     stepSize: 5,
        //             // },
        //         }],
        //         xAxes: {
        //             ticks: {
                        
        //             }
        //         }

        //     }
        // }
       
    })

    console.log(UserService.datePie.selectedDatesWeather.map(item => item.dt.slice(item.dt.indexOf(',') + 2)));
    
    

}]); // END ChartController

