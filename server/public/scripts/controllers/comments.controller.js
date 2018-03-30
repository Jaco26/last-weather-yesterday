myApp.controller('CommentsController', ['UserService', function(UserService){
    let self = this;
    self.userService = UserService;
    self.getUserComments = UserService.getUserComments;
    self.postComment = UserService.postComment;
    self.updateComment = UserService.updateComment;
    self.deleteComment = UserService.deleteComment;


    self.comments = UserService.datePie

    // Init
    self.getUserComments()


}])

