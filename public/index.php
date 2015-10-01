<?php
// Status flag:
//$LoginSuccessful = false;
// 
//// Check username and password:
//if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])){
// 
//    $username = $_SERVER['PHP_AUTH_USER'];
//    $password = $_SERVER['PHP_AUTH_PW'];
// 
//    if ($username == 'ucan' && $password == '30062012'){
//        $LoginSuccessful = true;
//    }
//}
// 
//// Login passed successful?
//if (!$LoginSuccessful){
//
//    header('WWW-Authenticate: Basic realm="Secret page"');
//    header('HTTP/1.0 401 Unauthorized');
// 
//    print "Login failed!\n";
// 
//} else {
//    require '../application/application.php';
//}

require '../application/application.php';
?>
