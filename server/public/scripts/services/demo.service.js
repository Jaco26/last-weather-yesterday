myApp.service('DemoService', [function(){
    const self = this;
    self.demoData = { weatherByDate: [] };
    self.selectedDate = {
        date: '',
        sunrise: '',
        sunset: '',
        weather: [],
        times: [],
    };
    self.selectedTime = { time: '' };
    self.timeSlice = {};
    self.chartData = [
        { chartLabel: 'Temperature ˚F', chartColor: 'pink' },
        { chartLabel: 'Atmospheric Pressure (hPa)', chartColor: 'lightblue' },
        { chartLabel: '% Cloud Cover', chartColor: 'gray' },
        { chartLabel: 'Windspeed (miles/hour)', chartColor: 'lightgreen' }
    ];
    self.today = {date: new Date()};
    self.lastAvailableDate = {date: ''}


}]);