angular.element(document).ready(function() {
    angular.bootstrap(document, ['ugcApp']);
});

var listGame = ['Vocabulary_LearnWordByFlashCard',
    'Game_PictureRace',
    'Game_MemoriesCard',
    'Pronunciation_WordRecognition',
    'Listening_ChoosePicture',
    'Common_MatchSentence',
    'Game_GuessAnswer',
    'Game_GuessPicture'];
var levels = [
    {'title': 'Mới bắt đầu (beginner)', 'value': 'beginner'},
    {'title': 'Cơ bản (elementary)', 'value': 'elementary'},
    {'title': 'Sơ trung (pre-intermediate)', 'value': 'pre-intermediate'},
    {'title': 'Trung cấp (intermediate)', 'value': 'intermediate'},
    {'title': 'Trên trung cấp (upper-intermediate)', 'value': 'upper-intermediate'},
    {'title': 'Cao cấp (advanced)', 'value': 'advanced'}
];
var app = angular.module('ugcApp', []);

function jsonp_callback(data) {
    // returning from async callbacks is (generally) meaningless
    console.log(data.found);
}

var apiAudioDictionary = function($http) {
    var dataFactory = {};
    dataFactory.uploadAudio = function(word) {
        params = {
            word: word,
            targetFolder: targetFolder
        };
        var url = baseUrl + '/ugc/flashcard/upload-audio-link';
        return $http.post(url, params);
    };
    return dataFactory;
};
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
    dataFactory.registerCompetitionUgc = function(params) {
        return $http.post(urlBase + '/register-competition/', params);
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

var apiFlickrSearchPhoto = function($http) {
    var api_key = '8e929a7c0dec59c357993872a3320310';
    var url = 'https://api.flickr.com/services/rest/';

    var dataFactory = {};
    dataFactory.searchImages = function(text, page) {
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
    };
    return dataFactory;
};

var apiUploadImage = function($http) {
    //var url = 'http://localhost/shark/public/news/article/crop-image';
    var url = baseUrl + '/ugc/flashcard/upload-image';
    var dataFactory = {};
    dataFactory.uploadImage = function(params) {
        return $http.post(url, params);
    };
    return dataFactory;
};
app.factory('restUgcFactory', ['$http', apiRestUgc]);
app.factory('restUgcitemFactory', ['$http', apiRestUgcitem]);
app.factory('flickrFactory', ['$http', apiFlickrSearchPhoto]);
app.factory('uploadImageFactory', ['$http', apiUploadImage]);
app.factory('audioDictFactory', ['$http', apiAudioDictionary]);


app.controller('createUgcCtrl', function($scope, $log, $window, $location, $http, restUgcFactory, restUgcitemFactory, flickrFactory, uploadImageFactory, audioDictFactory) {
    //Variables define
    $scope.targetFolder = targetFolder;
    $scope.resourceUrl = resourceUrl;
    $scope.baseUrl = baseUrl;
    $scope.ugc = {};
    $scope.ugc.id = ugcId;
    $scope.ugcControl = {};
    $scope.ugcControl.finishedCrop = false;
    $scope.ugcControl.isImageSearching = false;
    $scope.ugcControl.isUgcImageSearching = false;
    $scope.commonControl = {};
    $scope.commonControl.finishedUgc = false;
    $scope.ugcItem = {};
    $scope.ugcItem.listItem = [];
    $scope.ugcItem.itemCreating = {};
    $scope.ugcItem.control = {};
    $scope.ugcItem.control.uploadedImage = false;
    $scope.ugcItem.control.croppedImage = false;
    $scope.flickr = {};
    $scope.controlVariables = {};
    $scope.controlVariables.ugcCreateStep = 'ugcItem';
    $scope.controlVariables.clickedThumb = 0;
    $scope.controlVariables.flickrSearched = 0;
    $scope.ugc.summary_image = '';
    $scope.ugc.is_published;
    $scope.listGame = listGame;
    $scope.flickr.page = 1;
    $scope.imageUpload = {};
    $scope.ugcControl.step = 1;
    $scope.ugcControl.step1 = {};
    $scope.ugcControl.step2 = {};
    $scope.ugcControl.step2.imageUpload = {};
    $scope.ugcControl.step2.itemEditIndex = -1;
    $scope.ugcControl.step2.itemEdit = {};
    $scope.categories = [];
    $scope.ugcControl.validGameList = [];
    $scope.ugcControl.listGame = [];
    $scope.ugcControl.imageSrc = "";
    $scope.ugcControl.step1.isImageSrc = false;
    $scope.ugcControl.step2.isImageSrc = false;
    $scope.testBoolean = true;
    $scope.ugcControl.isSavingUgc = false;
    $scope.ugcControl.isUploadingImage = false;
    $scope.ugcControl.isUploadingAudio = false;
    $scope.ugcControl.isSavingUgcItem = false;
    $scope.ugcControl.isPublishing = false;
    $scope.levels = levels;

    $scope.searchImageUgcClick = function() {
        $scope.ugcControl.isUgcImageSearching = true;
        $scope.ugcControl.imageSrc = "";
        $scope.ugcControl.step1.isImageSrc = false;
    };
    $scope.ugcControl.removeImageUgcItem = function() {
        //$log.log('remove ugc item image');
        $scope.ugcItem.tempImage = $scope.ugcItem.itemCreating.image;
        $scope.ugcItem.itemCreating.image = "";
        $scope.ugcControl.imageSrc = "";
        $scope.ugcControl.step2.isImageSrc = false;

        //$scope.$apply();
    };

    $scope.previousUgcitemClick = function() {

        $scope.ugcControl.mouseOverUrl = "";
    };

    $scope.searchedAudio = true;
    $scope.getAudioDictionary = function(word) {
        $scope.searchedAudio = true;
        $scope.searchingAudio = true;

        audioDictFactory.uploadAudio(word)
                .success(function(response) {
            $scope.searchingAudio = false;
            if (response.success == 1) {
                $scope.ugcItem.itemCreating.audio = response.url;
//                $log.log(resourceUrl + response.url);
                playSound(resourceUrl + response.url);
            }

            else {
                $scope.searchedAudio = false;
                $scope.ugcItem.itemCreating.audio = "";
            }
        })
                .error(function(error) {
        });

    };
    $scope.maxImageSize = 209715;
    $scope.setFiles = function(element) {
        $scope.uploadError = "";

        $scope.$apply(function() {
            // Turn the FileList object into an Array
            $scope.files = [];
            for (var i = 0; i < element.files.length; i++) {
                if (element.files[i].size < $scope.maxImageSize) {
                    $scope.files.push(element.files[i]);
                }
            }
            $scope.progressVisible = false;
        });
    };

    $scope.uploadAudioFiles = function(element) {
        var url = $scope.baseUrl + "/ugc/flashcard/upload-audio";
        $scope.setAudioFiles(element, url);
    };
    $scope.setAudioFiles = function(element, url) {

        $scope.$apply(function() {
            $scope.audiofiles = [];
            for (var i = 0; i < element.files.length; i++) {
                $scope.audiofiles.push(element.files[i]);
            }
            $log.log('audio files' + $scope.audiofiles[0]);
            $scope.progressVisible = false;
        });

        if ($scope.audiofiles.length > 0) {
            $scope.ugcControl.isUploadingAudio = true;
            var fd = new FormData();

            fd.append("file", $scope.audiofiles[0]);
            fd.append("targetFolder", $scope.targetFolder);
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {

                var status = xhr.status;
                if (status == 200) {
                    $scope.ugcControl.isUploadingAudio = false;
                    $scope.ugcItem.itemCreating.audio = xhr.response;
                    $scope.$apply();
                } else {
                }
            };
            xhr.open("POST", url);
            xhr.send(fd);
        }
    };


    $scope.emptyFiles = function() {

        $scope.files = [];
    };

    $scope.uploadImage = function() {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file", $scope.files[0]);
        fd.append("cuong", "12345");
        var xhr = new XMLHttpRequest();

        xhr.open("POST", $scope.baseUrl + "/ugc/flashcard/upload-image");
        xhr.send(fd);
    };

    $scope.indexCategories = function(id) {
        $log.log('index categories ' + id);
        for (var i = 0; i < $scope.categories.length; ++i) {
            if ($scope.categories[i].id == id)
                return i;
        }
        return 0;
    };

    $scope.removeUgcItemImage = function() {
        $scope.ugcItem.itemCreating.image = '';
    };

    $scope.imageItemCreatingExist = function() {
        if ('image' in $scope.ugcItem.itemCreating)
            return $scope.ugcItem.itemCreating.image != "" && $scope.ugcItem.itemCreating.image != null;
        else
            return false;
    };

    $scope.editUgcItem = function(index) {
        $scope.ugcItem.itemCreating = $scope.ugcItem.tempImage;
        $scope.ugcItem.listItem[$scope.ugcControl.step2.itemEditIndex] = angular.copy($scope.ugcControl.step2.itemEdit);
        $scope.ugcControl.step2.itemEdit = angular.copy($scope.ugcItem.listItem[index]);
        $scope.ugcControl.step2.itemEditIndex = index;
        $scope.ugcItem.itemCreating = $scope.ugcItem.listItem[index];
    };

    $scope.ugcItem.control.deleteUgcItem = function() {
        $scope.isSubmittedUgcItem = true;
        var params = {};
        params.id = $scope.ugcItem.itemCreating.id;
        params.is_deleted = 1;
        $scope.ugcControl.isSavingUgcItem = true;
        restUgcitemFactory.deleteUgcitem(params)
                .success(function(response) {
            $scope.ugcItem.listItem.splice($scope.ugcControl.step2.itemEditIndex, 1);
            $scope.ugcControl.step2.itemEditIndex = -1;
            $scope.ugcItem.itemCreating = {};
            $scope.ugcControl.isSavingUgcItem = false;
        })
                .error(function(error) {
            //$scope.status = status;
        });
    };

    $scope.ugcItem.control.cancel = function() {
        $scope.searchedAudio = true;
        $scope.searchingAudio = false;
        $scope.isSubmittedUgcItem = false;
        $scope.ugcItem.itemCreating.image = $scope.ugcItem.tempImage;
        $scope.ugcItem.tempImage = "";
        $scope.emptyFiles();
        if ($scope.ugcControl.step2.itemEditIndex != -1) {
            $scope.ugcItem.listItem[$scope.ugcControl.step2.itemEditIndex] = $scope.ugcControl.step2.itemEdit;
            $scope.ugcControl.step2.itemEditIndex = -1;
            $scope.ugcItem.itemCreating = {};
        }
        else {
            $scope.ugcControl.step2.itemEditIndex = -1;
            $scope.ugcItem.itemCreating = {};
        }
    };

    $scope.ugcItem.control.edit = function(index) {
        $scope.searchedAudio = true;
        $scope.isSubmittedUgcItem = false;
        $scope.searchingAudio = false;
        var params = $scope.ugcItem.itemCreating;
        params.type = 'flash_card';
        params.ugc_id = $scope.ugc.id;
        $scope.ugcControl.isSavingUgcItem = true;

        restUgcitemFactory.updateUgcitem(params)
                .success(function(response) {
            $scope.ugcControl.isSavingUgcItem = false;
            $log.log(response.id);
            $scope.ugcItem.itemCreating.id = response.id;
            //$scope.ugcItem.listItem[index] = $scope.ugcItem.itemCreating;
            $scope.ugcItem.itemCreating = {};
            $scope.ugcControl.getValidGameList();
            $scope.ugcItem.control.uploadedImage = false;
            $scope.ugcItem.control.croppedImage = false;
            $scope.ugcControl.step2.itemEditIndex = -1;

        })
                .error(function(error) {
            //$scope.status = status;
        });

    };

    $scope.ugcItem.selected = function(cords, width, height) {
        $scope.ugcControl.step2.imageUpload.cords = cords;
    };

    $scope.isSubmittedUgcItem = false;

    $scope.ugcItem.control.create = function(form) {
        $scope.searchedAudio = true;
        $scope.isSubmittedUgcItem = true;
        $scope.searchingAudio = false;
        if ($scope.ugcItem.itemCreating.image == undefined) {
            $scope.ugcItem.itemCreating.image = "";
        }
        //$log.log('test');
        for (var ugcItem in $scope.ugcItem.listItem){
            //$log.log($scope.ugcItem.listItem[ugcItem].title);
            if ($scope.ugcItem.itemCreating.title == $scope.ugcItem.listItem[ugcItem].title){
                $window.alert('Từ này đã tồn tại trong flashcard');
                return;
            }
        }
        if (form.$valid && $scope.ugcItem.itemCreating.image && !$scope.ugcControl.isSavingUgcItem) {
            $scope.ugcControl.isSavingUgcItem = true;
            var params = $scope.ugcItem.itemCreating;
            params.type = 'flash_card';
            params.ugc_id = $scope.ugc.id;

            restUgcitemFactory.insertUgcitem(params)
                    .success(function(response) {
                // Can not delete
                $log.log(response.id);
                $scope.ugcControl.isSavingUgcItem = false;
                $scope.ugcItem.itemCreating.id = response.id;
                $scope.ugcItem.listItem.push($scope.ugcItem.itemCreating);
                $scope.ugcItem.itemCreating = {};
                $scope.ugcControl.getValidGameList();
                $scope.ugcItem.control.uploadedImage = false;
                $scope.ugcItem.control.croppedImage = false;

            })
                    .error(function(error) {
                //$scope.status = status;
            });

            $scope.ugcControl.updateGameList();
        }
        else {
            alert('Bạn nhập thiếu một số trường bắt buộc');
        }
    };

    $scope.ugcControl.updateGameList = function() {
        var params = {};
        params.id = $scope.ugc.id;

        params.valid_game = $scope.ugcControl.listGame.sort().toString();
        restUgcFactory.updateUgc(params)
                .success(function(response) {

        });

    };

    $scope.ugcControl.publish = function(publish) {

        if ($scope.ugcItem.listItem.length >= 4) {
            var params = {};
            params.id = $scope.ugc.id;
            if (publish !== null) {
                params.is_published = publish;
            }
            params.valid_game = $scope.ugcControl.listGame.sort().toString();
            $scope.ugcControl.isPublishing = true;
            restUgcFactory.updateUgc(params)
                    .success(function(response) {
                $scope.ugcControl.isPublishing = false;
                $scope.registerCompetitionUgc();
                if (publish !== null)
                    $scope.ugc.is_published = publish;
                window.location.assign($scope.baseUrl + "/ugc/flashcard/detail/id/" + $scope.ugc.id);
            });

            //$location.path( "http://"+baseUrl + "/ugc/flashcard/detail/id/322");
//            $scope.$apply();
        }

        else {
            alert('Hãy nhập trên 4 từ để hiển thị với mọi người nhé');
        }

    };

    $scope.ugcControl.getValidGameList = function() {
        $scope.ugcControl.validGameList = [];
        var imageCount = 0, audioCount = 0, meaningCount = 0, audioImageCount = 0, titleCount = 0;
        for (var i = 0; i < $scope.ugcItem.listItem.length; ++i) {
            if ($scope.ugcItem.listItem[i].title && $scope.ugcItem.listItem[i].title !== "") {
                titleCount++;
            }
            if ($scope.ugcItem.listItem[i].image && $scope.ugcItem.listItem[i].image !== "") {
                imageCount++;
                if ($scope.ugcItem.listItem[i].audio && $scope.ugcItem.listItem[i].audio !== "") {
                    audioImageCount++;
                }
            }
            if ($scope.ugcItem.listItem[i].audio && $scope.ugcItem.listItem[i].audio !== "") {
                $log.log('audio ' + $scope.ugcItem.listItem[i].audio);
                audioCount++;
            }
            if ($scope.ugcItem.listItem[i].meaning && $scope.ugcItem.listItem[i].meaning !== "")
                meaningCount++;
        }
        $log.log(i + " " + imageCount + " " + audioCount + " " + meaningCount + " " + audioImageCount);
        if (titleCount >= 2) {
            $scope.ugcControl.validGameList.push(4);
        }
        if (imageCount >= 2)
            $scope.ugcControl.validGameList.push(1, 2, 8);
        if (meaningCount >= 2)
            $scope.ugcControl.validGameList.push(6, 7);
        if (imageCount >= 8)
            $scope.ugcControl.validGameList.push(3);
        if (audioImageCount >= 4) {
            $scope.ugcControl.validGameList.push(5);
        }


        $scope.ugcControl.listGame = $scope.ugcControl.validGameList.slice(0).sort();
        $log.log($scope.ugcControl.listGame);

    };

    $scope.ugcControl.test = function(cords) {
        $log.log('test');
    };
    $scope.ugcControl.selected = function(cords, width, height) {
        //$log.log('Cuong');
        $scope.imageUpload.cords = cords;
        $scope.cropped = true;
        var rx = width / cords.w;
        var ry = height / cords.h;
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

    $scope.thumbUgcMouseover = function(url) {
        $log.log(url);
        $scope.ugcControl.ugcMouseOverUrl = url;
        $scope.ugcControl.isThumbUgcMouseover = true;
    };

    $scope.thumbUgcitemMouseover = function(url) {
        $scope.ugcControl.mouseOverUrl = url;
        $scope.ugcControl.isThumbUgcitemMouseover = true;
    };

    $scope.thumbUgcClicked = function(url) {
        $scope.ugcControl.step1.clickedUrl = url;
        $scope.ugcControl.step1.isThumbUgcClicked = true;
        $scope.ugcControl.ugcMouseOverUrl = "";
        $scope.ugcControl.isThumbUgcMouseover = false;
        //$scope.ugcControl.isUgcImageSearching = false;
    };

    $scope.thumbUgcitemClicked = function(url) {
        $scope.ugcControl.clickedUrl = url;
        $scope.ugcControl.mouseOverUrl = "";
        $scope.ugcControl.isThumbUgcitemClicked = true;
        $scope.ugcControl.isThumbUgcitemMouseover = false;

    };

    $scope.clickedThumb = function(index) {
        $scope.ugc.summary_image = $scope.flickr.thumb_list[index].image_src;
        $scope.controlVariables.clickedThumb = 1;
    };

    $scope.chooseOther = function() {
        $scope.controlVariables.clickedThumb = 0;
    };
    $scope.ugcItem.control.cropImage = function() {
        params = {
            img: $scope.ugcItem.itemCreating.image,
            x: $scope.ugcControl.step2.imageUpload.cords.x,
            y: $scope.ugcControl.step2.imageUpload.cords.y,
            //x2: $scope.imageUpload.cords.x2,
            //y2: $scope.imageUpload.cords.y2,
            w: $scope.ugcControl.step2.imageUpload.cords.w,
            h: $scope.ugcControl.step2.imageUpload.cords.h,
            boundx: boundx,
            boundy: boundy,
            resizeW: 400,
            resizeH: 300
        };
        uploadImageFactory.cropImage(params)
                .success(function(response) {
            $scope.ugcItem.control.croppedImage = true;
        })
                .error(function(error) {
        });
    };

    $scope.uploadImageCrop = function(url, successHandler, errorHandler) {

        $scope.ugcControl.isUploadingImage = true;
        var fd = new FormData();
        //Take the first selected file
//        if (isFile)
        fd.append("file", $scope.files[0]);
        fd.append("x", $scope.imageUpload.cords.x);
        fd.append("y", $scope.imageUpload.cords.y);
        fd.append("w", $scope.imageUpload.cords.w);
        fd.append("h", $scope.imageUpload.cords.h);
        fd.append("targetFolder", $scope.targetFolder);
        fd.append("resizeW", '270');
        fd.append("resizeH", '135');
        fd.append("boundx", $scope.boundx);
        fd.append("boundy", $scope.boundy);

        var xhr = new XMLHttpRequest();
        $scope.uploadError = "";
        xhr.onload = function() {
            var status = xhr.status;
            if (status == 200) {
                //$log.log(test);
                if (xhr.response != "1" && xhr.response != "0") {
                    $scope.ugc.summary_image = xhr.response;
                    $scope.ugcControl.step1.uploadedImage = true;
                    $scope.ugcControl.imageSrc = "";
                    $scope.ugcControl.step1.isImageSrc = false;
                    $scope.ugcControl.step1.hasSummaryImage = true;

                }
                else {
                    if (xhr.response == "0") {
                        $scope.uploadError = "Ảnh không đúng định dạng, bạn chi được nhập jpg và png";
                    }
                    else if (xhr.response == "1") {
                        $scope.uploadError = "Ảnh quá to vui lòng nhập ảnh dưới 2MB";
                    }
                }
                $scope.ugcControl.isUploadingImage = false;
                $scope.$apply();

            } else {
                errorHandler && errorHandler(status);
            }

        };
        xhr.open("POST", url);
        xhr.send(fd);
    };

    $scope.uploadImageCropUgcItem = function(url, successHandler, errorHandler) {
        var fd = new FormData();
        //Take the first selected file
//        if (isFile)
        $scope.ugcControl.isUploadingImage = true;
        fd.append("file", $scope.files[0]);
        fd.append("x", $scope.imageUpload.cords.x);
        fd.append("y", $scope.imageUpload.cords.y);
        fd.append("w", $scope.imageUpload.cords.w);
        fd.append("h", $scope.imageUpload.cords.h);
        fd.append("targetFolder", $scope.targetFolder);
        fd.append("resizeW", '400');
        fd.append("resizeH", '300');
        fd.append("boundx", $scope.boundx);
        fd.append("boundy", $scope.boundy);
        $scope.uploadError = "";
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var status = xhr.status;
            if (status == 200) {
                if (xhr.response != "1" && xhr.response != "0") {
                    $scope.ugcControl.isUploadingImage = false;
                    $scope.ugcItem.itemCreating.image = xhr.response;
                    $scope.ugcControl.step2.isImageSrc = "";
                    $scope.ugcControl.imageSrc = "";
                    $scope.$apply();
                }

            } else {
                errorHandler && errorHandler(status);
            }
        };
        xhr.open("POST", url);
        xhr.send(fd);
    };


    $scope.ugcControl.step1.isSummaryImage = function() {
        return $scope.ugc.summary_image != "" && $scope.ugc.summary_image != null;
    };


    $scope.uploadImageLink = function(cords, resizeW, resizeH, type) {
        var imageLink;
        $scope.ugcControl.isUploadingImage = true;

        if (type == 1) {
            imageLink = $scope.ugcControl.step1.clickedUrl;
        }
        else {
            imageLink = $scope.ugcControl.clickedUrl;
        }
//        var flickrResult = imageLink.substring(0,imageLink.length-5) + 'z.jpg';
        params = {
            imageLink: imageLink,
            x: cords.x,
            y: cords.y,
            w: cords.w,
            h: cords.h,
            targetFolder: $scope.targetFolder,
            resizeW: resizeW,
            resizeH: resizeH,
            boundx: $scope.boundx,
            boundy: $scope.boundy
        };
        uploadImageFactory.uploadImage(params)
                .success(function(response) {
            $scope.ugcControl.isUploadingImage = false;
            if (type == 1) {
                $scope.ugcControl.step1.uploadedImage = true;
                $scope.ugc.summary_image = response.link;
                $scope.ugcControl.step1.isThumbUgcClicked = false;
                $scope.ugcControl.isUgcImageSearching = false;
                $scope.ugcControl.step1.hasSummaryImage = true;
            }
            if (type == 2) {
                $scope.ugcItem.itemCreating.image = response.link;
                $scope.ugcItem.control.isImageSearching = false;
                $scope.ugcControl.isThumbUgcitemClicked = false;
            }

        });
    };
    $scope.ugcItemUploadImage = function() {
        $scope.uploadImageCropUgcItem($scope.baseUrl + "/ugc/flashcard/upload-image");

    };
    $scope.cancelbtnClick = function() {
        ugcControl.step1.isImageSrc = "";
    };
    $scope.okbtnClick = function() {
        $scope.uploadImageCrop($scope.baseUrl + "/ugc/flashcard/upload-image");


//        $scope.uploadImageCrop("http://localhost/shark/public/ugc/flashcard/upload-image", function(data) {
//                        $log.log(data);
//
//            $scope.ugcControl.step1.uploadedImage = true;
//            $scope.ugc.summary_image = data;
//         //   $log.log(data);
//        });

        //$scope.uploadImageLink(270,135);
    };

    $scope.completeUpload = function(ev) {
        console.log('completed');
        console.log(ev.responseText);

    };
    $scope.registerCompetitionUgc = function() {
        if ($scope.ugc.id > 0) {
            $log.log('test');
            var isDeleted = ($scope.isParticipateContest) ? 0 : 1;
            $log.log('delete '+isDeleted);
            params = {
                'ugc_id': $scope.ugc.id,
                'is_deleted':isDeleted
            };
            restUgcFactory.registerCompetitionUgc(params)
                .success(function(response){
            
                });
        }
    };
    $scope.isSubmittedUgc = false;
    
    $scope.addNewUgc = function(form) {
        $scope.isSubmittedUgc = true;
        if ($scope.ugc.summary_image == null)
            $scope.ugc.summary_image = "";

        if (form.$valid && $scope.ugc.summary_image) {
            $scope.ugcControl.isSavingUgc = true;
            var categoryId = null;
            if ($scope.ugc.category) {
                categoryId = $scope.ugc.category.id;
            }
            params = {
                title: $scope.ugc.title,
                type: 'flashcard',
                description: $scope.ugc.description,
                category: categoryId,
                valid_game: $scope.ugcControl.listGame.sort().toString(),
                summary_image: $scope.ugc.summary_image,
                level: $scope.ugc.level.value
            };

            if ($scope.ugc.id > 0) {
                params.id = $scope.ugc.id;
                restUgcFactory.updateUgc(params)
                        .success(function(response) {
                    $scope.ugcControl.step = 2;
                    $scope.ugcControl.isSavingUgc = false;
                    $scope.registerCompetitionUgc();
                });
            }
            else {
                restUgcFactory.insertUgc(params)
                        .success(function(response) {
                    $scope.ugcControl.isSavingUgc = false;
                    $scope.ugcControl.step = 2;
                    $scope.ugc.id = response.id;
                    $scope.commonControl.finishedUgc = true;
                    $scope.registerCompetitionUgc();
                    //$scope.ugc.publish = 1;
                })
                        .error(function(error) {
                });
            }
        }
        else {
            alert("Một số chỗ bắt buộc nhưng bạn chưa nhập");
        }
    };

    $scope.findIndexCategoryById = function(id) {
        for (var i = 0; i < $scope.categories.length; i += 1) {
            if ($scope.categories[i].id == id)
                return i;
        }
        return -1;
    };

    $scope.findIndexLevelByValue = function(value) {
        for (var i = 0; i < $scope.levels.length; i += 1) {
            if ($scope.levels[i].value == value)
                return i;
        }
        return -1;
    };

    $scope.getUgc = function(id) {
        $scope.ugcControl.getValidGameList();

        restUgcFactory.getUgc(id)
                .success(function(response) {
            //$scope.ugc = response.ugc;
            for (var prop in response.ugc) {
                $scope.ugc[prop] = response.ugc[prop];
            }

            var index = $scope.findIndexCategoryById($scope.ugc.categoryId);
            var indexLevel = $scope.findIndexLevelByValue(response.ugc.level);

            if (indexLevel != -1) {
                $scope.ugc.level = $scope.levels[indexLevel];
            }

            if (index != -1)
                $scope.ugc.category = $scope.categories[index];
            if ('summary_image' in response.ugc) {
                if (response.ugc.summary_image == "" || response.ugc.summary_image == null) {
                    $scope.ugcControl.step1.hasSummaryImage = false;
                }
                else {
                    $scope.ugcControl.step1.hasSummaryImage = true;
                }
            }
            else {
                $scope.ugcControl.step1.hasSummaryImage = false;
            }
            $scope.ugcItem.listItem = response.ugcItem;
            $scope.ugcControl.getValidGameList();
        })
                .error(function(error) {
        });
    };

    $scope.searchClick = function() {
        $scope.ugcItem.control.isImageSearching = true;
        $scope.ugcControl.step2.isImageSrc = false;
    };

    $scope.ugcControl.toogleSelection = function(index) {
        var id = $scope.ugcControl.listGame.indexOf(index);

        if (id > -1) {
            $scope.ugcControl.listGame.splice(id, 1);
        } else {
            $scope.ugcControl.listGame.push(index);
        }
    };

    $scope.ugcControl.step1.removeImage = function() {
//        $scope.ugcControl.isUgcImageSearching = false;
        $scope.ugc.summary_image = "";
        $scope.ugcControl.imageSrc = "";
        $scope.testBoolean = false;
        $scope.ugcControl.step1.isImageSrc = false;
        $scope.ugcControl.step1.hasSummaryImage = false;
//        $scope.ugcControl.finishedCrop = false;
//        $scope.ugcControl.step1.uploadedImage = false;
    };
    $scope.cancelSearchUgc = function() {
        $scope.ugcControl.isUgcImageSearching = false;
        $scope.ugcControl.ugcMouseOverUrl = '';
    };


    $scope.cancelSearchUgcitem = function() {
        $scope.ugcItem.control.isImageSearching = false;
        $scope.ugcControl.isThumbUgcitemClicked = false;
        $scope.ugcControl.isThumbUgcitemMouseover = false;


        $scope.ugcControl.mouseOverUrl = "";
    };

    //$scope.getUgc(1);
    if ($scope.ugc.id != -1)
        $scope.getUgc($scope.ugc.id);
    else
        $scope.ugc.level = $scope.levels[1];

});


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
                    element.after('<img class ="crop-image"  />');
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

app.directive('imageSearch', function(flickrFactory) {
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
                '<div id="ajax-loader-img" class="flickr-pendding" ng-show ="flickr.pending">' +
                '<img src="' + baseUrl + '/img/icons/ajax-loader.gif">' +
                '</div>' +
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
            scope.$watch('isShow', function(newValue, oldValue) {
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
                flickrFactory.searchImages(text, page)
                        .success(function(response) {
                    scope.flickr.pages = response.photos.pages;
                    scope.flickr.thumb_list = [];
                    for (var i = 0; i < response.photos.photo.length; ++i) {
                        var thumb_object = {};
                        var photo = response.photos.photo[i];
                        var common_src = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret;
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