angular.element(document).ready(function() {
    angular.bootstrap(document, ['ugcApp']);
});

var app = angular.module('ugcApp', []);

var apiRestUgc = function($http) {
    var urlBase = baseUrl + '/ugc/ajaxugc';
    var dataFactory = {};

    dataFactory.getUgcs = function() {
        return $http.get(urlBase);
    };
    dataFactory.getUgc = function(id) {
        return $http.get(urlBase + '/get/id/' + id);
    };
    dataFactory.insertUgc = function(params) {
        return $http.post(urlBase + '/post/', params);
    };
    dataFactory.updateUgc = function(params) {
        return $http.post(urlBase + '/put/', params);
    };
    dataFactory.registerCompetitionUgc = function(params) {
        return $http.post(urlBase + '/register-competition/', params);
    };
    return dataFactory;
};

var apiRestUgcitem = function($http) {
    var urlBase = baseUrl + '/ugc/ajaxugcitem';
    var dataFactory = {};

    dataFactory.getUgcitems = function() {
        return $http.get(urlBase);
    };
    dataFactory.getUgcitem = function(id) {
        return $http.get(urlBase + '/get/id/' + id);
    };
    dataFactory.insertUgcitem = function(params) {
        console.log('test ' + urlBase);
        return $http.post(urlBase + '/post/', params);
    };

    dataFactory.updateUgcitem = function(params) {
        return $http.post(urlBase + '/put/', params);
    };

    dataFactory.deleteUgcitem = function(params) {
        return $http.post(urlBase + '/delete/', params);
    };
    return dataFactory;
};


app.factory('restUgcFactory', ['$http', apiRestUgc]);
app.factory('restUgcitemFactory', ['$http', apiRestUgcitem]);

app.controller('manageUgcCtrl', function($scope, $log, restUgcFactory, restUgcitemFactory) {
    $scope.baseUrl = baseUrl;
    $scope.ugcListGame = [];
    $scope.listGame = listGame;
    $scope.ugcList = [];
    $scope.participated = [];
    $scope.findIndexCategoryById = function(id) {
        for (var i = 0; i < $scope.categories.length; i += 1) {
            if ($scope.categories[i].id == id)
                return i;
        }
        return -1;
    };

    $scope.deleteUgc = function(id, index, title) {
        var msgbox = $dialog.messageBox('Delete '+title, 'Are you sure', [{label: 'Yes, I\'m sure', result: 'yes'}, {label: 'No', result: 'no'}]);
        msgbox.open().then(function(result) {
            if (result === 'yes') {
                params = {
                    id: id,
                    is_deleted: 1
                };
                restUgcFactory.updateUgc(params)
                        .success(function() {
                    $scope.ugcList.splice(index, 1);
                });
            }
        });
    };

    $scope.registerCompetitionUgc = function(id, index) {
        
        if (id > 0) {
            params = {
                'ugc_id': id,
                'is_deleted':0
            };
            restUgcFactory.registerCompetitionUgc(params)
                .success(function(response){
                    $scope.participated[index] = true;
                });
        }
    };
});
