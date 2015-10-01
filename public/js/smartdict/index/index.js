var app = angular.module('smartdictApp', []);
var baseUrl = "/shark/public/";

app.controller("smartdictController", ['$scope', 'translateService', 'smartWordService', '$sce', '$http','$log',
    function($scope, translateService, smartWordService, $sce, $http, $log) {
        //audio.play();
        $scope.init = function(){
            $scope.isMouseover = false;
            $scope.thumbClickUrl = null;
            $scope.uploading = false;
            $scope.uploaded = false;
            $scope.clicked = false;
        };
        $scope.init();
        $scope.targetFolder = "upload/userfiles/users/3/2324/img/";
        $scope.translate = function() {
            translateService.translate('en', 'vn', $scope.word)
                    .success(function(response) {
                        $scope.translatedWord = response.data.translation[0].translationText;
                    });
        };
        $scope.getWordToEdit = function() {
            $scope.init();
            smartWordService.getWordToEdit()
                    .success(function(response) {
                        $scope.word = response;
                        $scope.word.full_meaning = $sce.trustAsHtml($scope.word.full_meaning);
                    });
        };
        $scope.getWordById = function(id){
            $scope.init();
            smartWordService.getWordById(id)
                    .success(function(response) {
                        $scope.word = response;
                        $scope.word.full_meaning = $sce.trustAsHtml($scope.word.full_meaning);
                    });
        };
        $scope.$watch("linkImageUrl",function(newVal, oldVal){
            $scope.thumbClickUrl = $sce.trustAsResourceUrl(newVal);
            $scope.clicked = true;
            $scope.typeImage = 'url';
        });
        
        $scope.thumbMouseover = function(url){
            $scope.isMouseover = true;
            $scope.thumbMouseoverUrl = $sce.trustAsResourceUrl(url);
            $scope.clicked = false;
        };
        $scope.thumbClick = function(url){
            $scope.thumbClickUrl = $sce.trustAsResourceUrl(url);
            $scope.clicked = true;
            $scope.typeImage = 'flickr';
        };
        $scope.selected = function(cords, width, heigh){
            $scope.cords = cords;
        };
        $scope.cancelClick = function(){
            $scope.thumbClickUrl = null;
            $scope.uploaded = false;
        };
        
        $scope.uploadImage = function(){
            $scope.uploading = true;
            
            var json = {
                targetFolder: targetFolder,
                word: $scope.word.title,
                imageLink: $scope.thumbClickUrl.toString(),
                x: $scope.cords.x,
                y: $scope.cords.y,
                w: $scope.cords.w,
                h: $scope.cords.h,
                type: $scope.typeImage
            };
            var url = baseUrl + '/smartdict/index/upload-image';
            $http.post(url, json)
                    .success(function(response){
                $scope.finalImage = resourceUrl + response.link; 
                $scope.uploading = false;
                $scope.uploaded = true;
                  $scope.thumbClickUrl = "";
            });
        };
        $scope.completing = false;
        $scope.completeNext = function(){
            $scope.completing = true;
            var json={
                urlImage: $scope.finalImage,
                id: $scope.word.id
            };
            var url = baseUrl + '/smartdict/index/insert-image';
            $http.post(url, json)
                    .success(function(response){
               $scope.completing = false;
               $scope.word.image = $scope.finalImage;
               $scope.thumbClickUrl = "";
               $scope.getWordToEdit();         
            });
        };
        $scope.complete = function(){
            $scope.completing = true;
            var json={
                urlImage: $scope.finalImage,
                id: $scope.word.id
            };
            var url = baseUrl + '/smartdict/index/insert-image';
            $http.post(url, json)
                    .success(function(response){
               $scope.completing = false;
               $scope.word.image = $scope.finalImage;
               //$scope.getWordToEdit();         
            });
        };  
    }
]);

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
                    element.after('<img class ="crop-image" style="width:400px;"  />');
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

app.directive('imageSearch', function(flickrService) {
    return {
        restrict: 'EA',
        scope: {
            keySearch: '@',
            isShow: '@',
            onThumbMouseover: '&',
            onThumbClicked: '&',
            onCancelSearch: '&',
            onPreviousClick: '&',
            onNextClick: '&'
        },
        template: '<div class = "flickr-search-zone" ng-show ="isShow">' +
                '<i class="fa fa-spinner fa-spin" ng-show ="flickr.pending">' +
                '</i>' +
                '<input id ="ugc-item-search-key" class = "input-feilds" type ="text" ng-model ="keySearch">' +
                '<button id="flickr-search-image-button" class ="search-button front-grey-button" ng-click ="searchImages(keySearch, 1);">Tìm ảnh</button>' +
                '<button id="flickr-search-cancel-button" class="search-button front-grey-button" ng-click ="cancelSearch()" >Quay lại </button>' +
                '<div class="flickr-result">' +
                '<div class="flickr-ok" ng-show ="!flickr.pending">' +
                '<div ng-repeat="thumb in flickr.thumb_list">' +
                '<img title="Bấm để chọn ảnh đại diện cho bộ từ" class="thumb_images" style="float:left;" ng-mouseover ="thumbMouseover($index)" ng-click ="thumbClicked($index)" src="{{thumb.image_src}}">' +
                '</div>' +
                '<div style="clear:both"></div>' +
                '<div id="control_image" ng-hide="flickr.thumb_list.length==0">' +
                '<button class="front-grey-button" ng-click="previous_page()" ng-disabled="flickr.page <=1;">Trước</button>' +
                '<button class="front-grey-button" ng-click="next_page()" ng-disabled="flickr.page >= flickr.pages;">Sau</button>' +
                '</div>' +
                '<div ng-show ="flickr.pages==0">No result</div>' +
                '</div>' +
                '</div>' +
                '</div>',
        link: function(scope, elem, attrs) {
            scope.$watch('keySearch', function(newValue, oldValue) {
                if (newValue) {
                    if (scope.isShow == "true" && scope.keySearch != '') {
                        scope.searchImages(scope.keySearch, 1);
                    }
                }
            }, true);
            scope.flickr = {};
            scope.flickr.page = 1;
            scope.flickr.thumb_list = [];
            scope.thumbMouseover = function(index) {
                scope.onThumbMouseover({url: scope.flickr.thumb_list[index].image_src});
            };
            scope.thumbClicked = function(index) {
                scope.onThumbClicked({url: scope.flickr.thumb_list[index].image_src});
            };
            scope.hide = function() {
                scope.isShow = false;

            };
            scope.next_page = function() {
                scope.flickr.page++;
                scope.searchImages(scope.keySearch, scope.flickr.page);
                scope.onNextClick();
            };
            scope.previous_page = function() {
                scope.flickr.page--;
                scope.searchImages(scope.keySearch, scope.flickr.page);
                scope.onPreviousClick();
            };
            scope.cancelSearch = function() {
                scope.isShow = false;
                scope.onCancelSearch();
            };
            scope.searchImages = function(text, page) {
                scope.flickr.pending = true;
                flickrService.searchImages(text, page)
                        .success(function(response) {
                            scope.flickr.pages = response.photos.pages;
                            scope.flickr.thumb_list = [];
                            for (var i = 0; i < response.photos.photo.length; ++i) {
                                var thumb_object = {};
                                var photo = response.photos.photo[i];
                                var common_src = "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret;
                                thumb_object.thumb_src = common_src + "_s.jpg";
                                thumb_object.image_src = common_src + "_n.jpg";
                                scope.flickr.thumb_list.push(thumb_object);
                            }
                            scope.flickr.pending = false;
                        })
                        .error(function(error, status) {

                        });
            };
        }
    };
});

app.factory('flickrService', ['$http', function($http) {
        var api_key = '8e929a7c0dec59c357993872a3320310';
        var url = 'http://api.flickr.com/services/rest/';

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


app.factory('smartWordService', ['$http', function($http) {
        var instance = {};
        instance.getWordToEdit = function() {
            return $http.get(baseUrl + "/smartdict/index/get");
        };
        instance.getWordById = function(id){
            return $http.get(baseUrl + "/smartdict/index/get/id/"+id);
        };
        return instance;
    }]);
app.factory('translateService', ['$http', function($http) {
        var serviceInstance = {};

        serviceInstance.translate = function(fromCode, toCode, word) {
            return $http({
                method: 'JSONP',
                url: 'https://www.googleapis.com/language/translate/v2?key=AIzaSyCXZPVIG5OpDxBP_v9aJvj3bx2q-9Vo-zE&source=' + encodeURIComponent(fromCode) + '&target=' + encodeURIComponent(toCode) + '&q=' + encodeURIComponent(word)
            });
        };
        return serviceInstance;
    }]);


