angular.element(document).ready(function() {
    angular.bootstrap(document, ['discussionApp']);
});

var app = angular.module('discussionApp', []);
app.filter('time_a_go',function(){
   return function(text){
       var dateParts = text.split("-");
       var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
       return moment(jsDate).fromNow();
   } 
});
  
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
    dataFactory.upvotePost = function(params){
        return $http.post(urlBase + '/upvote', params);
    };
    dataFactory.insertDiscussionpost = function(params) {
        return $http.post(urlBase + '/post/', params);
    };
    dataFactory.updateDiscussionpost = function(params) {
        return $http.post(urlBase + '/put/', params);
    };
    return dataFactory;
};

var apiRestDiscussionreply = function($http) {
    var urlBase = baseUrl + '/discussion/ajaxdiscussionreply';
    var dataFactory = {};
    dataFactory.getDiscussionreplys = function() {
        return $http.get(urlBase);
    };
    dataFactory.insertDiscussionreply = function(params) {
        return $http.post(urlBase + '/post/', params);
    };
    dataFactory.upvoteReply = function(params){
        return $http.post(urlBase + '/upvote', params);
    };
    dataFactory.deleteUgcitem = function(params) {
        return $http.post(urlBase + '/delete/', params);
    };
    return dataFactory;
};

app.factory('restDiscussionpostFactory', ['$http', apiRestDiscussionpost]);
app.factory('restDiscussionreplyFactory', ['$http', apiRestDiscussionreply]);

app.controller('indexCtrl', function($scope, $log, restDiscussionpostFactory, restDiscussionreplyFactory) {
    $scope.page = 1;
    //$scope.discussionpostList = [];
    $scope.getDiscussionposts = function() {
        restDiscussionpostFactory.getDiscussionposts()
                .success(function(response) {
            $log.log(response);
            $scope.discussionposts = response;

        });
    };
    $scope.expandToggles = function(index) {
        if ($scope.discussionposts[index].viewing) {
            $scope.discussionposts[index].viewing = false;
        }
        else {
            restDiscussionpostFactory.getDiscussionreplys($scope.discussionposts[index].id)
                    .success(function(response) {
                $log.log(response);
                $scope.discussionposts[index].replys = response;
                $scope.discussionposts[index].viewing = true;
            });
        }
    };
    $scope.postReply = function(index){
        var params = {
            discussion_post_id: $scope.discussionposts[index].id,
            content: $scope.discussionposts[index].replyText
        };
        
        restDiscussionreplyFactory.insertDiscussionreply(params)
            .success(function(response){
                $scope.discussionposts[index].replys = response['replys'];
                $scope.discussionposts[index].replyText = "";
            });
    };
    $scope.postDiscussionpost = function(){
        var params = {
            title: $scope.postTitle,
            content: $scope.postDescription,
            category_id: $scope.category.id
        };
        restDiscussionpostFactory.insertDiscussionpost(params)
            .success(function(response){
                $scope.discussionposts.unshift(response['post']);
                $scope.postTitle = "";
                $scope.postDescription = "";
            });
    };
    $scope.upvotePost = function(index){
        var params = {
            item_id: $scope.discussionposts[index].id
        };
        restDiscussionpostFactory.upvotePost(params)
            .success(function(response){
                if (response['status'] === 'success'){
                    $scope.discussionposts[index].upvote_count = response['upvoteCount'];
                    $scope.discussionposts[index].hasLiked = true;    
                }
            });
    };
    $scope.upvoteReply = function(postIndex, replyIndex){
        var params = {
            item_id: $scope.discussionposts[postIndex].replys[replyIndex].id
        };
        restDiscussionreplyFactory.upvoteReply(params)
            .success(function(response){
                if (response['status']==='success'){
                    $scope.discussionposts[postIndex].replys[replyIndex].upvote_count = response['upvoteCount'];
                    $scope.discussionposts[postIndex].replys[replyIndex].hasLiked = true;    
                }
            });
    };
    $scope.getDiscussionposts();
});
