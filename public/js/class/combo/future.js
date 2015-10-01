angular.module('app', [])

.controller('futureCtrl', function($scope) {
	$scope.menu = [
		'Tác giả',
		'Những câu nói của tác giả',
		'Lịch sử hình thành',
		'Ý nghĩa của ứng dụng lý thuyết',
		'Các phương pháp kết hợp',
	];

	$scope.menuIndex = 0;

	$scope.changeMenu = function(index) {
		$scope.menuIndex = index;
	}
});