$(document).ready(function() {
    $('#user-writes-review-button').click(function() {
        $('#add-review-form-placeholder').slideDown(500);
        return false;
    });

    $('#add-review-form-placeholder-close').click(function() {
        $('#add-review-form-placeholder').slideUp(200);
        return false;
    });


    /**
     * Chèn thêm một từ mới
     */
    $('#add-review-form').submit(function() {
        $('#write-course-review-box-loader').show();
        $('.add-review-form-error').remove();
        data = $(this).serialize();
        $.post($(this).attr('action'), data)
                .success(function(result) {
                    $('#write-course-review-box-loader').hide();
                    $('.loading-progress').slideUp(500);
                    if (result['content-type'] === 'error') {
                        errors = $.parseJSON(result['data']);
                        displayAddReviewFormError(errors);
                    } else {
                        $('#add-review-form').remove();
                        $('#add-review-form-placeholder-title').remove();
                        $('#write-course-review-box').remove();
                        $('#add-review-form-placeholder').append(reviewCompletedMessage);
                    }
                });

        /**
         * Hiển thị lỗi form
         */
        function displayAddReviewFormError(errors) {
            for (element in errors) {
                errMessages = '';
                for (errType in errors[element]) {
                    errMessages += '<li>' + errors[element][errType] + '</li>';
                }
                $('#' + element).parent().append(
                        '<ul class="add-review-form-error">' +
                        errMessages +
                        '</li>');
            }
        }
        return false;
    });

    /*
     * Next activity
     */
    $('#loadResult').click(function() {
        if (activityContent.practical == 0) {
            Ucan.Function.Navigation.nextActivity();
        }
    });
});

angular.element(document).ready(function() {
    angular.bootstrap(document, ['ugcApp']);
});

var app = angular.module('ugcApp', []);

var apiRestUgc = function($http) {
    var urlBase = baseUrl + '/ugc/ajaxugc';
    var dataFactory = {};

    dataFactory.getUgcs = function() {
        return $http.get(urlBase);
    };
    
    dataFactory.getUgc = function(id) {
        return $http.get(urlBase + '/get/id/' + id);
    };
    dataFactory.insertUgc = function(params) {
        return $http.post(urlBase + '/post/', params);
    };
    dataFactory.updateUgc = function(params) {
        return $http.post(urlBase + '/put/', params);
    };
    dataFactory.likeUgc = function(params){
        return $http.post(urlBase + '/like/', params);
    };
    dataFactory.likeFacebookUgc = function(params){
        return $http.post(urlBase + '/like-facebook/', params);
    };
    dataFactory.shareUgc = function(params){
        return $http.post(urlBase + '/share/', params);
    };
    return dataFactory;
};

var apiRestUgcitem = function($http) {
    var urlBase = baseUrl + '/ugc/ajaxugcitem';
    var dataFactory = {};

    dataFactory.getUgcitems = function() {
        return $http.get(urlBase);
    };
    dataFactory.getUgcitem = function(id) {
        return $http.get(urlBase + '/get/id/' + id);
    };
    dataFactory.insertUgcitem = function(params) {
        return $http.post(urlBase + '/post/', params);
    };

    dataFactory.updateUgcitem = function(params) {
        return $http.post(urlBase + '/put/', params);
    };

    dataFactory.deleteUgcitem = function(params) {
        return $http.post(urlBase + '/delete/', params);
    };
    return dataFactory;
};
app.factory('restUgcFactory', ['$http', apiRestUgc]);
app.factory('restUgcitemFactory', ['$http', apiRestUgcitem]);

app.controller('studyUgcCtrl', function($scope, $log, restUgcFactory) {
    $scope.baseUrl = baseUrl;
    
    $scope.likeThisUgc = function() {
        var params = {
            item_id: $scope.wordsetId
        };
         restUgcFactory.likeUgc(params)
                .success(function(response) {
            $scope.isLiked = true;
        });
    };
    
    $scope.likeFacebookUgc = function() {
        $log.log($scope.wordsetId);
        var params = {
            item_id: $scope.wordsetId
        };
         restUgcFactory.likeFacebookUgc(params)
                .success(function(response) {
            $log.log('success '+response);
        });
    };
    
    $scope.shareThisUgc = function() {
        var params = {
            item_id: $scope.wordsetId
        };
         restUgcFactory.shareUgc(params)
                .success(function(response) {
            
        });
    };
});
