myApp.controller('DetailsController', ['UserService', '$location', '$scope', function (UserService, $location, $scope) {
    // console.log('DetailsController created');
    let self = this;
    self.userService = UserService;
    self.makeChart = UserService.makeChart;
    self.today = new Date();
    self.minDate = new Date(UserService.selectedZipData.startTrackDate);
    

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

    // self.cutTimeSlice = () => {
    //     let time = UserService.selectedTime.time;
    //     for(let slice of UserService.datePie.selectedDatesWeather){
    //         if (slice.dt.slice(slice.dt.indexOf(',') + 2) == time){
    //              UserService.timeSlice = slice;
    //         }
    //     }
    // }; // END self.cutTimeSlice

    self.bakeDatePie = () => {
        let selectedDate = new Date(UserService.selectedDate.date).toDateString();
        console.log('selectedDate', selectedDate);
        
        if(UserService.selectedZipData[0]){
            UserService.datePie.selectedDatesWeather = [];
            for (let clump of UserService.selectedZipData) {
                // console.log('-------- clump in bake date pie', clump);
                clumpDate = new Date(clump.dt.slice(0, clump.dt.indexOf(','))).toDateString();
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
        } else {
            alert('No data')
        }
    }; // END self.bakeDatePie



}]);
