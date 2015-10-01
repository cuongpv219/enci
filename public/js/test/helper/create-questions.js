angular.module('app', ['CreateTestHelper', 'TestCommon', 'ui.sortable', 'ngSanitize'])

.directive('ckEditor', function() {
    return {
        require: '?ngModel',
        restrict: 'C',
        link: function(scope, elm, attr, ngModel) {
          var ck = CKEDITOR.replace(elm[0], {
            enterMode: CKEDITOR.ENTER_DIV
          });
          
          if (!ngModel) {
            return;
          }
    
          ck.on('pasteState', function() {
            scope.$apply(function() {
              ngModel.$setViewValue(ck.getData());
                
            });
          });   
    
          ngModel.$render = function(value) {
            ck.setData(ngModel.$viewValue);
          };
        }
    };
})

.directive('modal', function(TestTemplate) {
    return {
        restrict: 'E',
        replace: true,
        scope: false,
        templateUrl: TestTemplate.getModalTemplate()
    };
})

.directive('questionActions', function(TestTemplate) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: TestTemplate.getQuestionActionsTemplate()
    };
})

.directive('modalFooterActions', function(TestTemplate) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: TestTemplate.getModalFooterActionsTemplate()
    };  
})

.directive('divider', function(TestTemplate) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: TestTemplate.getDividerTemplate()
    };
})

.directive('separateWindow', function() {
    return {
        restrict: 'C',
        link: function(scope, e) {
            e.draggable();
            e.appendTo('body');
        }
    };
})

.controller('questionsCtrl', function($sce, $scope, 
        TestTemplate, InputHelper, Activity, OrderCalculator, Provider) {

    $scope.baseUrl = baseUrl;
    $scope.orderer = OrderCalculator;

    var storage = InputHelper.getStorage();
    $scope.activityNames = [
        'Multiple Choice',
        'Multiple Choice Inline',
        'Choose Correct Answer',
        'Fill In Blanks'
    ];

    $scope.sortableOptions = {
        handle: '.move',
        placeholder: "ui-state-highlight",
        opacity: 0.75,
        revert: true,
        scroll: true,
        scrollSensitivity: 10
    };

    /*
    * 1 trang nhiều activity
    */
    $scope.activityTemp = Activity.create();
    $scope.activities = [];

    /**
    * Object trung gian
    */
    $scope.temp = {};

    /**
     * Dựng lại nếu đã có dữ liệu. Không thì tạo mới
     */
    try {
        var storageValue = storage.val();

        if (storageValue && $.trim(storageValue) !== '') {
            $scope.activities = angular.fromJson(storageValue);

            for (var i = 0; i < $scope.activities.length; i++) {
                Activity.setTemplates($scope.activities[i]);
                Provider.provideOrderer($scope.activities[i]);
            }
            $scope.currentActivity = $scope.activities[0];
        }
    } catch (ex) {
        window.console.error(ex);
        window.alert('Dữ liệu không hợp lệ!');
        return;
    }

    $scope.addActivity = function() {
        $scope.currentActivity = angular.copy(Activity.create($scope.activityTemp.name));
        Provider.provideOrderer($scope.currentActivity);
        $scope.activities.push($scope.currentActivity);
    };

    $scope.removeActivity = function(activity) {
        if (confirm('Toàn bộ câu hỏi trong dạng này sẽ bị xóa?')) {
            Ucan.Array.deleteElement(activity, $scope.activities);
        }
    }

    $scope.setCurrentActivity = function(activity) {
        $scope.currentActivity = activity;
    }

    $scope.openAddModal = function(activity, event) {
        if (!event || (event && event.keyCode === 13)) {
            $scope.currentActivity = activity;
            $scope.editting = false;
            $scope.temp = {};
            $('#questionModal').modal();
        }
    };

    $scope.addQuestion = function() {
        if (!$scope.temp) {
            return;
        }

        $scope.currentActivity.questions.push($scope.temp);
        $scope.temp = {};
    };

    $scope.deleteQuestion = function(question, questions) {
        Ucan.Array.deleteElement(question, questions);
    };

    $scope.editQuestion = function(question) {
        $scope.temp = question;
        $scope.editting = true;
        $('#questionModal').modal();
    };

    $scope.finishEditting = function() {
        $scope.editting = false;
        $('#questionModal').modal('hide');
    };

    $scope.bindHtml = function(html) {
        return $sce.trustAsHtml(html);
    };

    $scope.saveAllData = function() {
        if ($scope.activities.length === 0) {
            if (confirm("Chưa có activity nào. Bạn có muốn đóng lại không?")) {
                window.close();
            }
        } else {
            for (var i = 0; i < $scope.activities.length; i++) {
                delete $scope.activities[i].template;
            }

            storage.val(angular.toJson($scope.activities));

            if (confirm("Dữ liệu đã được cập nhật. Bạn có muốn đóng lại không?")) {
                window.close();
            }
        }
    }
})


/***************** Multiple Choice Inline ********************/

.controller('multipleChoiceInline', function($scope) {
    $scope.options = [0, 1, 2, 3, 4, 5];
})


/***************** Choose Correct Answer ********************/

.controller('chooseCorrectAnswer', function($scope, $timeout) {

    $scope.addEmptyQuestion = function(temp) {
        if (!$scope.temp.list) {
            $scope.temp.list = [{answers: []}];
        } else {
            $scope.temp.list.push({answers: []});
        }
    };

    $scope.addEmptyAnswer = function(question) {
        question.answers.push(null);
    };

    $scope.removeQuestion = function(question, questions) {
        Ucan.Array.deleteElement(question, questions);
    };

    $scope.removeAnswer = function(answer, question) {
        Ucan.Array.deleteElement(answer, question.answers);
    };
})


/***************** Fill In Blanks ********************/

.controller('fillInBlanks', function($scope, $timeout) {

    $scope.addEmptyQuestion = function(temp) {
        if (!$scope.temp.list) {
            $scope.temp.list = [{answers: []}];
        } else {
            $scope.temp.list.push({answers: []});
        }
    };

    $scope.addEmptyAnswer = function(question) {
        question.answers.push(null);
    };

    $scope.removeQuestion = function(question, questions) {
        Ucan.Array.deleteElement(question, questions);
    };

    $scope.removeAnswer = function(answer, question) {
        Ucan.Array.deleteElement(answer, question.answers);
    };
})
;