var app = angular.module('smartdictApp', []);
var baseUrl = "/shark/public/";

app.controller('smartdictController', ['$scope', '$http', 'flickrService', '$window', 'similarWordsFactory',  
    function($scope, $http, flickrService, $window, similarWordsFactory) {
        
    $scope.image = '';
    $scope.flickr = {
        'images' : [],
        'currentPage' : 0,
        'pages' : 0,
        'perPage' : 0,
        'searchInProgress' : false,
        'cropMode' : false
    };
    
    $scope.searchActivated = false;
    $scope.uploading = false;
    $scope.currentSearchTerm = '';
    $scope.similarWordSelected = false;
    $scope.copying = false;
    
    $http.get(baseUrl + '/smartwords/index/lastest').success(function(response) {
        $scope.suggestedWords = response;
    });
    
    $scope.flickrSearch = function() {
        $scope.$watch('term', function() {
            if ($scope.term !== $scope.currentSearchTerm) {
                $scope.currentSearchTerm = $scope.term;
                $scope.flickr.currentPage = 0;
            }
        });
        
        $scope.searchActivated = true;
        $scope.flickr.searchInProgress = true;
        flickrService.searchImages($scope.term, $scope.flickr.currentPage)
            .success(function(flickrImageList) {
                $scope.pages = flickrImageList.photos.pages;
                $scope.flickr.perPage = flickrImageList.photos.perPage;
                $scope.flickr.images = [];
                
                for (var i = 0; i < flickrImageList.photos.photo.length; i++) {
                    var photo = flickrImageList.photos.photo[i];
                    var commonSrc = "http://farm" + 
                            photo.farm + 
                            ".staticflickr.com/" + 
                            photo.server + "/" + 
                            photo.id + 
                            "_" + 
                            photo.secret;
                    $scope.flickr.images.push({
                        'thumb' : commonSrc + '_s.jpg',
                        'image' : commonSrc + '_n.jpg'
                    });
                }
                $scope.flickr.searchInProgress = false;
            }); 
        
        
    };
    
    $scope.thumbHover = function(index) {
        $scope.tempImage = '';
        $scope.image = '';
        $scope.uploaded = false;
        $scope.tempImage = $scope.flickr.images[index].image;
    };
    
    $scope.thumbClicked = function(index) {
        $scope.tempImage = '';
        $scope.image = $scope.flickr.images[index].image;
        $scope.flickr.cropMode = true;
    };
    
    $scope.disableCropMode = function() {
        $scope.flickr.cropMode = false;
        $scope.image = '';
        $scope.uploaded = false;
        $scope.flickrSearch();
    };
    
    $scope.nextPage = function() {
        $scope.flickr.currentPage++;
        $scope.flickrSearch();
    };
    
    $scope.prevPage = function() {
        if ($scope.flickr.currentPage > 0) {
            $scope.flickr.currentPage--;
            $scope.flickrSearch();
        }
    };
    
    $scope.selected = function(cords){
        $scope.cords = cords;
    };
    
    $scope.cropImage = function() {
        $scope.uploading = true;
        var json = {
            targetFolder: targetFolder,
            word: $scope.word,
            imageLink: $scope.image.toString(),
            x: $scope.cords.x,
            y: $scope.cords.y,
            w: $scope.cords.w,
            h: $scope.cords.h,
        };
        
        var url = baseUrl + '/smartwords/index/upload-image';
        $http.post(url, json)
                .success(function(response){
            $scope.image = resourceUrl + response.link; 
            $scope.uploading = false;
            $scope.uploaded = true;
        });
    };
    
    $scope.complete = function() {
        $scope.saving = true;
        var json = {
            urlImage: $scope.image,
            id: $scope.id
        };
        var url = baseUrl + '/smartwords/index/insert-image';
        
        $http.post(url, json).success(function(response){
           $scope.saving = false;
           $window.location.href = $scope.currentUrl;
        });
        
//        $window.location.href = $scope.currentUrl;
    };
    
    $scope.mediaUrl = function(src) {
        return resourceUrl + src;
    };
    
    $scope.selectSimilar = function(index) {
        $scope.similarWordSelected = $scope.suggestedWords[index];
    };
    
    $scope.copyImage = function() {
        $scope.copying = true;
        var json = {
            urlImage: $scope.similarWordSelected.image,
            id: $scope.id
        };
        var url = baseUrl + '/smartwords/index/insert-image';
        
        $http.post(url, json).success(function(response){
           $scope.copying = false;
           $window.location.href = $scope.currentUrl;
        });
        
//        $window.location.href = $scope.currentUrl;
    };
}]);

app.directive('imgCropped', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {src: '@', selected: '&', aspectRatio: '=', sizeWidth: '=', sizeHeight: '='},
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
                    element.after('<img class="crop-image" />');
                    myImg = element.next();
                    myImg.attr('src', nv);
                    $(myImg).Jcrop({
                        trackDocument: true,
                        onSelect: function(x) {
                            scope.$apply(function() {
                                scope.selected({cords: x});
                            });
                        },
                        onChange: function(x) {
                            scope.$apply(function() {
                                scope.selected({cords: x});
                            });
                        },
                        aspectRatio: scope.aspectRatio
                                //setSelect: [0, 0, 400, 400],
                    }, function() {
                        // Use the API to get the real image size   
                        var bounds = this.getBounds();
                        boundx = bounds[0];
                        boundy = bounds[1];
                        this.animateTo([0, 0, 400, 300]);
                    });
                }
            });

            scope.$on('$destroy', clear);
        }
    };
});

app.factory('flickrService', ['$http', function($http) {
    var api_key = '8e929a7c0dec59c357993872a3320310';
    var url = 'https://api.flickr.com/services/rest/';

    return {
        searchImages: function(text, page) {
            params = {
                method: 'flickr.photos.search',
                api_key: api_key,
                text: text,
                per_page: 24,
                page: page,
                safe_search: 1,
                media: 'photos',
                sort: 'relevance',
                format: 'json',
                content_type: 1,
                jsoncallback: 'JSON_CALLBACK'
            };
            return $http.jsonp(url, {
                params: params
            });
        }
    };
}]);

app.factory('similarWordsFactory', ['$http', function($http) {
    var url = '/shark/public/smartwords/index/lastest?callback=JSON_CALLBACK';

    return {
        getLastest: function() {
            $http.jsonp(url).success(function(response) {
                console.log(response);
            });
//            return s;
//            return $http.jsonp(url);
        }
    };
}]);