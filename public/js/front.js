$(document).ready(function() {
    $('.ucan-login-box-popup').click(function() {
        $('#dark-background').show(0, function() {
            $('#global-ucan-login-box').show(300);
        });
        return false;
    });

    $('#global-ucan-login-close-icon').click(function() {
        $('#global-ucan-login-box').hide(300, function() {
            $('#dark-background').hide();
        });
    });

    $('#button-cancel-banner-edge').click( function(){
        $('#banner-edge-box').css('display','none');
    });
});
