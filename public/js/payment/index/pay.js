angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});

var app = angular.module('app', []);

app.controller('paymentIndexCtrl', function($scope) {
    $scope.payment_method = null;
    $scope.mobile_type = null;
    $scope.sms_type = null;
    $scope.home_type = null;
    $scope.credit_type = null;
    $scope.atm_type = null;
    $scope.home_call = null;
    
    $scope.changeMobileType = function($mobile){        
        $scope.mobile_type = $mobile;
    };
    
    $scope.changeAtmType = function($atm){
        $scope.atm_type = $atm;
    };
    
    $scope.changeCreditType = function($credit){
        $scope.credit_type = $credit;
    };        
    
    $scope.changePaymentMethod = function($paymentMethod){
        $scope.payment_method = $paymentMethod;
        if ($paymentMethod == 'mobile_card'){
            $scope.atm_type = null;
            $scope.credit_type = null;
            $scope.home_type = null;
            $scope.sms_type = null;
        } else if ($paymentMethod == 'mobile_sms'){
            $scope.mobile_type = null;
            $scope.credit_type = null;
            $scope.atm_type = null;
            $scope.home_type = null;
        } else if ($paymentMethod == 'ucan_home'){
            $scope.mobile_type = null;
            $scope.credit_type = null;
            $scope.atm_type = null;
            $scope.sms_type = null;
        } else if ($paymentMethod == 'ucan_code'){
            $scope.sms_type = null;
            $scope.mobile_type = null;
            $scope.credit_type = null;
            $scope.atm_type = null;
        } else {
            $scope.sms_type = null;
            $scope.mobile_type = null;
            $scope.atm_type = null;
            $scope.credit_type = null;
            $scope.home_type = null;
        }
    };
});
