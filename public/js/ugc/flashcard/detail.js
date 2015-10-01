$(document).ready(function() {
    $('#rate-box').click(function() {
        window.location.href = '#all-reviews';
    });
    
    $('#jump-all-reviews').click(function() {
        showUcanComments();
    });

    if (window.location.toString().indexOf('#all-reviews') !== -1) {
        showUcanComments();
    } else {
        showFacebookComments();
    }

    $('#comment-tabs a').click(function(event) {
        event.preventDefault();
        activeReviewTab($(this));
    });

    $('#add-review-form').submit(function() {
        data = $(this).serialize();

        $.post($(this).attr('action'), data)
                .success(function(result) {
                    if (result['content-type'] === 'error') {
                        errors = $.parseJSON(result['data']);
                        displayAddReviewFormError(errors);
                    } else {
                        window.location.reload();
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
    
    function activeReviewTab(tab) {
        $(tab).addClass('active').siblings().removeClass('active');
        $($(tab).attr('data-id') + '-comment-wrapper').show().siblings().hide();
    }
    
    function showFacebookComments() {
        activeReviewTab($('#comment-tabs a[data-id=#facebook]'));
    }
    
    function showUcanComments() {
        activeReviewTab($('#comment-tabs a[data-id=#ucan]'));
    }
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

app.controller('detailUgcCtrl', function($scope, $log, restUgcFactory) {
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
