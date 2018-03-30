myApp.controller('CommentsController', ['UserService', function(UserService){
    let self = this;
    self.userService = UserService;
    self.postComment = UserService.postComment;
    self.updateComment = UserService.updateComment;
    self.deleteComment = UserService.deleteComment;

 


}])