angular.element(document).ready(function() {
    angular.bootstrap(document, ['discussionApp']);
});

var app = angular.module('discussionApp', []);
app.filter('time_a_go', function() {
    return function(text) {
        var dateParts = text.split("-");
        var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
        return moment(jsDate).fromNow();
    };
});

app.directive('confirmationNeeded', function ($rootScope) {
  return {
    priority: 1,
    terminal: true,
    link: function (scope, element, attr) {
      var msg = attr.confirmationNeeded || "Are you sure?";
      var clickAction = attr.ngClick;
      element.bind('click',function () {
        if (window.confirm(msg) ) {
          scope.$eval(clickAction);
          $rootScope.$apply();
        }
      });
    }
  };
}
);
var apiRestDiscussionpost = function($http) {
    var urlBase = baseUrl + '/discussion/ajaxdiscussionpost';
    var dataFactory = {};

    dataFactory.getDiscussionposts = function() {
        return $http.get(urlBase);
    };
    dataFactory.getDiscussionpost = function(id) {
        return $http.get(urlBase + '/get/id/' + id);
    };
    dataFactory.getDiscussionreplys = function(id) {
        return $http.get(urlBase + '/get-discussionreply/discussionpost-id/' + id);
    };
    dataFactory.upvotePost = function(params) {
        return $http.post(urlBase + '/upvote', params);
    };
    dataFactory.insertDiscussionpost = function(params) {
        return $http.post(urlBase + '/post/', params);
    };
    dataFactory.updateDiscussionpost = function(params) {
        return $http.post(urlBase + '/put/', params);
    };
    dataFactory.deleteDiscussionpost = function(params) {
        return $http.post(urlBase + '/delete/', params);
    };
    return dataFactory;
};

var apiRestDiscussionreply = function($http, $log) {
    var urlBase = baseUrl + '/discussion/ajaxdiscussionreply';
    var dataFactory = {};
    dataFactory.getDiscussionreplys = function() {
        return $http.get(urlBase);
    };
    dataFactory.insertDiscussionreply = function(params) {
        return $http.post(urlBase + '/post/', params);
    };
    dataFactory.editDiscussionreply = function(params) {
        return $http.post(urlBase + '/put', params);
    };
    dataFactory.upvoteReply = function(params) {
        return $http.post(urlBase + '/upvote', params);
    };
    dataFactory.deleteDiscussionreply = function(params) {
        return $http.post(urlBase + '/delete', params);
    };
    return dataFactory;
};

app.factory('restDiscussionpostFactory', ['$http', apiRestDiscussionpost]);
app.factory('restDiscussionreplyFactory', ['$http','$log', apiRestDiscussionreply]);

app.controller('detailCtrl', function($scope, $log, restDiscussionpostFactory, restDiscussionreplyFactory) {
    $scope.page = 1;
    $scope.replyEditingIndex = -1;
    //$scope.discussionpostList = [];
    $scope.getDiscussionreplys = function(discussionPostId) {
        restDiscussionpostFactory.getDiscussionreplys(discussionPostId)
                .success(function(response) {
                    $scope.discussionreplys = response;
                });
    };
   
    $scope.postReply = function() {
        var params = {
            discussion_post_id: $scope.post.id,
            content: $scope.replyText
        };

        restDiscussionreplyFactory.insertDiscussionreply(params)
                .success(function(response) {
                    $scope.replys = response['replys'];
                    $scope.replyText = "";
                });
    };
    $scope.deletePost = function(){
        var params = {
            id: $scope.post.id
        };
        
        restDiscussionpostFactory.deleteDiscussionpost(params)
                .success(function(response){
           if (response.status === "ok"){
               $log.log('ok');
               window.location.assign(baseUrl + "/discussionpost/index");
           };         
        });
        
    };
    $scope.edittingPost = false;
    $scope.editPost = function(){
        $scope.postEdit.id = $scope.post.id;
        var params = {
            id: $scope.postEdit.id,
            title: $scope.postEdit.title,
            content: $scope.postEdit.content,
            category_id: $scope.category.id
        };
        
        restDiscussionpostFactory.updateDiscussionpost(params)
                .success(function(response){
           if (response.status == "ok"){
               $scope.edittingPost = false;
               $scope.post = $scope.postEdit;
           };         
        });
        
    };
    $scope.editReply = function(index, content) {
        var params = {
            id: $scope.replys[index].id,
            content: content
        };

        restDiscussionreplyFactory.editDiscussionreply(params)
                .success(function(response) {
                    if (response.status === "ok") {
                        $scope.replys[index].content = content;
                        $scope.replyEditingIndex = -1;
                    }
                });
    };
    
    $scope.deleteReply = function(index) {
        var params = {
            id: $scope.replys[index].id
        };
        //$log.log('abc');
        restDiscussionreplyFactory.deleteDiscussionreply(params)
                .success(function(response) {
                    
                    if (response.status === "ok") {
                        $scope.replys.splice(index,1);
                    }
                });
    };
    
    $scope.postDiscussionpost = function() {
        var params = {
            title: $scope.postTitle,
            content: $scope.postDescription
        };
        restDiscussionpostFactory.insertDiscussionpost(params)
                .success(function(response) {
                    $scope.discussionposts.unshift(response['post']);
                    $scope.postTitle = "";
                    $scope.postDescription = "";
                });
    };
    $scope.upvotePost = function() {
        var params = {
            item_id: $scope.post.id
        };
        restDiscussionpostFactory.upvotePost(params)
                .success(function(response) {
                    if (response['status'] === 'success') {
                        $scope.post.upvote_count = response['upvoteCount'];
                        $scope.post.hasLiked = true;
                    }
                });
    };
    $scope.upvoteReply = function(replyIndex) {
        var params = {
            item_id: $scope.replys[replyIndex].id
        };
        restDiscussionreplyFactory.upvoteReply(params)
                .success(function(response) {
                    if (response['status'] === 'success') {
                        $scope.replys[replyIndex].upvote_count = response['upvoteCount'];
                        $scope.replys[replyIndex].hasLiked = true;
                    }
                });
    };
    
    $scope.hasRightToEditReply = function(index){
        return $scope.replys[index].creator_id === $scope.user.id;
    };
    
    $scope.hasRightToEditPost = function(){
        return $scope.post.creator_id === $scope.user.id;
    };
});
