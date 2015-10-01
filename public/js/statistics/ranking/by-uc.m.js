function rankingCtrl($scope, $http) {

  var page = 1;
  $scope.users = [];
  $scope.mediaUrl = mediaUrl;
  $scope.totalItems = totalItems;

  $scope.viewMore = function() {
    $http.get(window.location.origin + loadUserUrl + '/page/' + page++)
      .success(function(data, status, headers, config) {
        $scope.users = $scope.users.concat(data);
      });
  };

  $scope.isEnded = function() {
    return $scope.users.length >= totalItems;
  }

  $scope.viewMore();
}