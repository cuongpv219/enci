function testCtrl($scope, $http) {

  var page = 1;
  $scope.tests = [];
  $scope.mediaUrl = mediaUrl;
  $scope.totalItems = totalItems;

  $scope.viewMore = function() {
    $http.get(window.location.origin + loadTestUrl + '/page/' + page++)
      .success(function(data, status, headers, config) {
        $scope.tests = $scope.tests.concat(data);
      });
  };

  $scope.detail = function(test) {
    return detailUrl.replace('-9999', test.id);
  };

  $scope.isEnded = function() {
    return $scope.tests.length >= totalItems;
  }


  $scope.viewMore();
}