$(document).ready(function() {
    var top = (window.innerHeight - $('#show-result').height()) / 2;
    
    $('#show-result, #finished-activity-messages').css('top', top);
});