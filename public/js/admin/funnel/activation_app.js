angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});

var app = angular.module('app', []);

activationRateData = {
    element: 'activation-rate-chart',
    data: [],
    xkey: ['working_day'],
    xLabels: "day",
    ykeys: ['activation_rate'],
    ymin: '0',
    hideOver: false,
    parseTime: false,
    labels: ['Tỉ lệ học (%)']
};

app.controller('ActivationController', function($scope, $http) {
    $scope.startDate = '01-07-2012';
    $scope.endDate = '01-09-2012';
    
    $scope.init = function() {
        $http({
            url: "/shark/public/admin/funnel/activation-rating-list",
            method: "POST",
            data: {
                startDate: $scope.startDate,
                endDate: $scope.endDate
            }
        }).success(function(list) {
            var data = [];
            for (key in list) {
                if (list[key] === null) {
                    data[key] = '0';
                }
                data[key] = list[key]['data'];
            }
            $scope.activationRateList = data;
            activationRateData.data = data;
            activationRateChart = Morris.Line(activationRateData);
        }).error(function(data) {
            //Fail to fetch data
        });
    }
    $scope.init();
});

app.directive('datepicker', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'dd/mm/yy',
                onSelect: function(dateText) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
});