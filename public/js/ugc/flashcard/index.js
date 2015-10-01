angular.element(document).ready(function() {
    angular.bootstrap(document, ['ugcApp']);
});

var app = angular.module('ugcApp', []);

app.controller('studyIndexCtrl', function($scope, $log) {
    $scope.categories = [];
});

$(document).ready(function() {
    $('#list-search .levels').change(function() {
        $(this).parent().submit();
    });
    
    $('#list-search .levels option').each(function() {
        if ($(this).val() === filterLevel) {
            $(this).prop('selected', 'selected');
        }
    });
});
