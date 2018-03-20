myApp.controller('HomeController', ['UserService', function (UserService) {
    console.log('UserController created');
    let self = this;
    self.userService = UserService;

    self.currentZipData = {};
    self.weatherQueryTimeInterval = {};
    self.timeSlice = {};
    self.timeToView = '';

    self.getZipData = (zip) => {
        // zip = zip.slice(0, 5);
        for(let zipcode of UserService.zipcodes.list){
            if(zipcode.zipcode == zip){
                self.currentZipData = zipcode;
            }
        }
    }

    self.setTimeData = (time) => {
        for(let slice of self.currentZipData.weather){
            if(slice.dt == time){
                self.timeSlice = slice;
            }
        }
    }

    self.myDate = new Date();
    self.minDate = new Date(self.userService.userObject.zipcode[0].startTrackDate); // / 1000;
    self.maxDate = self.myDate;

    self.hi = () => {
        console.log(self.maxDate);
        
    }



    // const ctx = document.querySelector('#weeklyWeatherChart').getContext('2d');
    // // console.log(ctx);
    // const weatherChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //         datasets: [{
    //             label: 'Temp',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }]
    //         }
    //     }
    // });

}]);
