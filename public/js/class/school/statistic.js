var NoLectureChoice = 'Bạn chưa chọn bài học nào để xem thống kê!';
var LimitLectureChoice = 'Bạn không được chọn quá 15 bài học để xem thống kê!';
var app = angular.module('Application', []);
app.controller('Controller', ['$scope', '$http', '$compile', '$element', '$filter', 'lectureDetailsService',
    function($scope, $http, $compile, $element, $filter, lectureDetailsService) {
        $scope.lectures = [];
        $scope.itemIds = [];
        $scope.lectureDetails = [];
        $scope.course = {};
        $scope.lecture = {};
        $scope.lectureLoading = '';
        $scope.lectureDetailsLoading = '';
        //console.log('here!');

        $scope.itemFilter = function(item) {
            if(item.level <= 1) { console.log(item); return false; }
            else { return true; }
        }

        $scope.getLectureDetails = function(evt, lecture) {
            var elem = evt.target;
            elem = angular.element(elem);
            elem.parent().parent().find('a').removeClass('actived');
            elem.addClass('actived');

            $scope.lectureDetails = [];
            $scope.itemIds = [];
            $scope.lectureDetailsLoading = 'lecture-loading';

            if(parseInt(lecture.id) > 0 && parseInt($scope.course.id) > 0) {
                lectureDetailsService.list($scope.course.id, lecture.id).then(function(data) {
                    if(data.message == 'success') {
                        for(i in data.objs) {
                            data.objs[i].checked = false;
                        }
                        $scope.lectureDetails = data.objs;
                        $scope.lectureDetailsLoading = '';
                    } else {
                        console.log(data.message);
                    }
                });
            }
        }

        $scope.cbChange = function(id, checked) {
            var pos = false;
            for(i=0; i<$scope.itemIds.length; i++) {
                if($scope.itemIds[i] === id) {
                    pos = i;
                    break;
                }
            }
            if(checked === false) {
                if(pos !== false) {
                    $scope.itemIds.splice(pos, 1);
                }
            } else {
                if(pos === false) {
                    $scope.itemIds.push(id);
                }
            }
            //console.log($scope.itemIds);
        }

        $scope.viewStatistic = function(evt) {
            if($scope.itemIds.length > 0 && $scope.itemIds.length < 16) {
               console.log($scope.itemIds);
            } else if($scope.itemIds.length > 15) {
                evt.preventDefault();
                console.log(LimitLectureChoice);
                alert(LimitLectureChoice);
            } else {
                evt.preventDefault();
                console.log(NoLectureChoice);
                alert(NoLectureChoice);
            }
        }
}]);

app.directive('courseobj', ['lectureService', function(lectureService) {
    return {
        restrict: 'AE',
        link: function(scope, elem, attrs) {
            elem.bind('click', function(event) {
                //console.log(elem.parent().parent().find('a'));
                elem.parent().parent().find('a').removeClass('actived');
                elem.addClass('actived');
                scope.lectures = [];
                scope.lectureDetails = [];
                scope.lectureLoading = 'lecture-loading';
                var id = attrs.rel;

                lectureService.list(id).then(function(data) {
                    //console.log('list service');
                    if(data.message == 'success') {
                        scope.lectures = data.objs;
                        scope.lectureDetails = [];
                        scope.itemIds = [];
                        scope.course = {};
                        scope.course.id = id;
                        scope.lectureLoading = '';
                    } else {
                        console.log(data.message);
                    }
                });
            });
        }
    }
}]);

app.service('lectureService', function($http, $q) {
    return ({list: getObjs});
    function getObjs(id) {
        var request = $http({
            method: "get",
            responseType: "json",
            url: baseSchoolUrl+"getlectures/id/"+id,
            params: {}
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        if(!angular.isObject(response.data || !response.data.message)) {
            return ($q.reject("Unknow error occurred!"));
        }
        return ($q.reject(response.data.message));
    }

    function handleSuccess(response) {
        return (response.data);
    }
});

app.service('lectureDetailsService', function($http, $q) {
    return ({list: getObjs});
    function getObjs(id, lectureId) {
        var request = $http({
            method: "get",
            //responseType: "json",
            url: baseSchoolUrl+"getlecturesdetails/id/"+id+"/lecture-id/"+lectureId,
            params: {}
        });
        return (request.then(handleSuccess, handleError));
    }

    function handleError(response) {
        if(!angular.isObject(response.data || !response.data.message)) {
            return ($q.reject("Unknow error occurred!"));
        }
        return ($q.reject(response.data.message));
    }

    function handleSuccess(response) {
        return (response.data);
    }
});