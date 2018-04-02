myApp.controller('CommentsController', ['UserService', function(UserService){
    let self = this;
    self.userService = UserService;
    self.getUserComments = UserService.getUserComments;
    self.postComment = UserService.postComment;
    self.updateComment = UserService.updateComment;


    self.deleteComment = (index) => {
        swal({
            text: 'Once deleted, this comment will be gone for good!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then( (willDelete) => {
            if(willDelete){
                UserService.deleteComment(index);
                swal('Your comment is gone!!');
            } else {
                swal('Your comment is here to stay!!');
            }
        });
    }

    // self.postComment = () => {

    // }

}])

