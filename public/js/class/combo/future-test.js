angular.module('AppTest', ['App'])
.controller('futureTestCtrl', function( $scope, ScoreCalculator) {
    $scope.computeResult = function() {
        $scope.pausePlayer();

        if ($scope.finishedTest) {
            return;
        }

        playSound(Ucan.Resource.Audio.getShowResultSound());

        /*
         * Lấy điểm mỗi part
         */

        var score = ScoreCalculator.computeByDefaultInTest(parts);

        window.location = 'result/score/' + score;
    }
}); 