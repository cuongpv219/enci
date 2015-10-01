function articleCtrl($scope, $http) {

  $scope.articles = [];
  $scope.mediaUrl = mediaUrl;
  $scope.totalItems = totalItems;
  $scope.page = 1;

  $scope.viewMore = function() {
    if ($scope.isEnded()) {
      return;
    }

    $http.get(window.location.origin + loadArticleUrl + '/page/' + $scope.page++)
      .success(function(data, status, headers, config) {
        $scope.articles = $scope.articles.concat(data);
      })
  };

  $scope.detail = function(article) {
    return detailUrl.replace('-9999', article.id)
              .replace('slug', article.slug);
  };

  $scope.isEnded = function() {
    return $scope.articles.length >= totalItems;
  }

  $scope.viewMore();
}