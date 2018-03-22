myApp.controller('ManageController', ['UserService', '$mdDialog', function (UserService, $mdDialog) {
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

    
}]); // END ManageController