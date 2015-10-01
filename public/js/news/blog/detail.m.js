TEMPLATE_DIR = baseUrl + '/html/news/blog/activity/';

app = angular.module('app', ['ngSanitize'])

.directive('activity', function($timeout, $compile, $http) {
  var v = function() {
    return '?' + randomFromTo(1, 9999);
  };

  return {
    restrict: 'E',
    link: function(scope, e, attrs) {
      var id = attrs.id;
      var module = attrs.type;
      var url = window.location.origin + ajaxUrl
                        .replace('moduleParam', module)
                        .replace('idParam', id);

      // Gửi ajax lấy course item
      $http.get(url)
        .success(function(data) {
          var activity = data;

          if (scope.activityNames.indexOf(activity.type) == -1) {
            window.console.error(activity.type + ' is not valid');
            e.hide();
            return;
          }

          activity.id = id;
          activity.template = TEMPLATE_DIR + activity.type + '.html' + v();
          scope.activities.push(activity);

          e.append('<div ng-include="getActivityTemplate(' + id + ')"></div>');

          // Recompile
          $compile(e.contents())(scope);
      });
    }
  }
})

.directive('commonCompleteSentenceWithMultipleChoice', function() {
  return {
    restrict: 'A',
    link: function(scope, e) {
    }
  }
})

.directive('commonMarkTrueAnswer', function() {
  return {
    restrict: 'A',
    link: function(scope, e) {
    }
  }
})

.controller('activityCtrl', function($scope, $http, $sce) {

  $scope.mediaUrl = mediaUrl;
  $scope.activities = [];
  $scope.activityNames = [
    'Common_CompleteSentenceWithMultipleChoice',
    // 'Common_MarkTrueAnswer'
  ];

  $scope.getActivityTemplate = function(id) {
    for (var i = 0; i < $scope.activities.length; i++) {
      if ($scope.activities[i].id == id) {
        return $scope.activities[i].template;
      }
    }
  };

  /**
  * Gán activity tương ứng cho các Controller con
  */
  $scope.setupActivity = function(scope) {
    for (var i = 0; i < $scope.activities.length; i++) {
      var activity = $scope.activities[i];
      if (activity.type == scope.type && !activity.assigned) {
        scope.order = i;
        activity.assigned = true;
        $scope.initActivityData(scope);
        break;
      }
    }
  };

  $scope.bindHtml = function(html) {
    return $sce.trustAsHtml(html);
  };

  $scope.initActivityData = function(scope) {
    scope.quesIndex = 0;
    scope.score = 0;
    scope.activity = angular.copy($scope.activities[scope.order]);
  }
})

.controller('Common_CompleteSentenceWithMultipleChoice_Ctrl', function($scope, $timeout) {

  /**
  * Hàm này chỉ được gọi sau khi đã setupActivity()
  */
  function prepareData() {
    for (var i = 0; i < $scope.activity.question.length; i++) {
      var ques = $scope.activity.question[i];
      ques.ask = ques.ask.replace('[]', '_______');
      ques.choice = ques.choice.split('||');
      
      // Cho thanh 2 dap an de test
      // ques.choice = ques.choice.slice(0, 2);

      for (var j = 0; j < ques.choice.length; j++) {
        var choice = ques.choice[j];
        if (choice.indexOf('#') != -1) {
          ques.choice[j] = choice.replace('#', '');
          ques.key = j;
          break;
        }
      }
    }
  }

  $scope.type = 'Common_CompleteSentenceWithMultipleChoice';
  $scope.setupActivity($scope);

  prepareData();

  $scope.next = function() {
    var ques = $scope.activity.question[$scope.quesIndex];
    if (ques.key == ques.userChoice) {
      ques.result = true;
      $scope.score++;
    } else {
      ques.result = false;
    }
    ques.completed = true;

    $timeout(function() {
      $scope.quesIndex++;
    }, ques.choice.length > 2 ? 3000 : 1200);
  };

  $scope.redo = function() {
    $scope.initActivityData($scope);
    prepareData();
  };
});
