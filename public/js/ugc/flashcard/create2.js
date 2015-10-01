angular.element(document).ready(function() {
    angular.bootstrap(document, ['ugcApp']);
});

var app = angular.module('ugcApp', ['ngResource']);
function jsonp_callback(data) {
    // returning from async callbacks is (generally) meaningless
    console.log(data.found);
}

var apiRestUgc = function($http) {
    var urlBase = 'http://localhost/shark/public/ugc/RestfulUgc/';
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

    return dataFactory;

};

var apiFlickrSearchPhoto = function($http) {
    api_key = '8e929a7c0dec59c357993872a3320310';
    url = 'http://api.flickr.com/services/rest/';

    var dataFactory = {};
    dataFactory.searchImages = function(text, page) {
        params = {
            method: 'flickr.photos.search',
            api_key: api_key,
            text: text,
            per_page: 21,
            page: page,
            sort: 'relevance',
            format: 'json',
            jsoncallback: 'JSON_CALLBACK'
        };
        return $http.jsonp(url, {
            params: params
        });
    };
    return dataFactory;
};

app.factory('restUgcFactory', ['$http', apiRestUgc]);
app.factory('flickrFactory', ['$http', apiFlickrSearchPhoto]);

app.directive('imgCropped', function() {

    return {
        restrict: 'E',
        replace: true,
        scope: {src: '@', selected: '&'},
        link: function(scope, element, attr) {

            var myImg;

            var clear = function() {

                if (myImg) {

                    myImg.next().remove();

                    myImg.remove();

                    myImg = undefined;

                }

            };

            scope.$watch('src', function(nv) {

                clear();

                if (nv) {

                    element.after('<img />');

                    myImg = element.next();

                    myImg.attr('src', nv);

                    $(myImg).Jcrop({
                        trackDocument: true,
                        onSelect: function(x) {

                            scope.$apply(function() {

                                scope.selected({cords: x});

                            });

                      },
                        aspectRatio: 2

                    }, function() {

                        // Use the API to get the real image size   

                        var bounds = this.getBounds();

                        boundx = bounds[0];

                        boundy = bounds[1];

                    });

                }

            });

            scope.$on('$destroy', clear);

        }

    };

});  

app.controller('createUgcCtrl', function($scope, $log, restUgcFactory, flickrFactory) {
    $scope.ugc = {};
    $scope.flickr = {};
    $scope.flickr.thumb_list = [];
    $scope.ugc.description_image = '';
    $scope.flickr.page = 1;
    $scope.selected = function(cords) {
        $scope.cropped = true;

        var rx = 270 / cords.w;

        var ry = 135 / cords.h;

        $('#preview').css({
            width: Math.round(rx * boundx) + 'px',
            height: Math.round(ry * boundy) + 'px',
            marginLeft: '-' + Math.round(rx * cords.x) + 'px',
            marginTop: '-' + Math.round(ry * cords.y) + 'px'
            
        });
    };
    $scope.getUgc = function(id) {
        restUgcFactory.getUgc(id)
                .success(function(response, status) {
            $scope.status = response;
        })
                .error(function(error, status) {
            $scope.status = status;
        });
    };

    $scope.insertUgc = function(params) {
        restUgcFactory.insertUgc(params)
                .success(function(response, status) {
            $scope.status = response;
        })
                .error(function(error, status) {
            $scope.status = status;
        });
    };

    $scope.searchImages = function(text, page) {
        $scope.flickr.status = "pending";
        flickrFactory.searchImages(text, page)
                .success(function(response, status) {
            $scope.flickr.pages = response.photos.pages;
            $scope.flickr.thumb_list = [];
            for (var i = 0; i < response.photos.photo.length; ++i) {
                var thumb_object = {};
                var photo = response.photos.photo[i];
                var common_src = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret;
                thumb_object.thumb_src = common_src + "_s.jpg";
                thumb_object.image_src = common_src + "_n.jpg";
                $scope.flickr.thumb_list.push(thumb_object);
            }
            $scope.flickr.status = "ok";
        })
                .error(function(error, status) {
        });
    };
    $scope.mouseOverThumb = function(index) {
        $scope.ugc.description_image = $scope.flickr.thumb_list[index].image_src;
    };
    $scope.next_page = function() {
        $scope.flickr.page++;
        $scope.searchImages($scope.image_key_search, $scope.flickr.page);
        $log.log("page " + $scope.flickr.page);
    };
    $scope.previous_page = function() {
        $scope.flickr.page--;
        $scope.searchImages($scope.image_key_search, $scope.flickr.page);
        $log.log("page " + $scope.flickr.page);
    };
    $scope.getUgc(10);

});

