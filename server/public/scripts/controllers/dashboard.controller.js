myApp.controller('DashboardController', ['UserService', '$mdDialog', '$location', function (UserService, $mdDialog , $location) {
    const self = this;
    self.userService = UserService;

    self.showAddzipDialog = function (ev) {
        $mdDialog.show({
            contentElement: '#myDialog',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    self.showDetails = (zipcode, startTrackDate) => {
        console.log('ZIPCODE', zipcode, 'START TRACK DATE', startTrackDate);
        $location.path('/details');
    }

    self.menter = (x) => {
        let card = document.querySelector(`#card-${x}`);
        card.style.backgroundColor = '#99ffdd';
        card.style.cursor = 'pointer';
        
    }

    self.mleave = (x) => {
        document.querySelector(`#card-${x}`).style.backgroundColor = 'white'   
    }

    
}]); // END ManageController