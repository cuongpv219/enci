angular.module('app', [])

.controller('listenCtrl', function($scope) {
	threeSixtyPlayer.config.playRingColor = '#0070c0';

	$scope.today = new Date();
	$scope.subjects = [
		{
			img: baseUrl + "/img/global/home/5.jpg",
			audio: baseUrl + "/audio/correct.mp3"
		}
	];
});