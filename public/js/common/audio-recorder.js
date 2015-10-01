var recordStatus = 'normal';
var hasRecorded;
var canRecord = false;
var flashDisplayed = false;

function onMicStatus(event){
    if (event == 'Unmuted'){
        canRecord = true;
        hidePromptFlash();
    } else if (event == "Muted") {
        if (!flashDisplayed) {
            flashDisplayed = true;
        } else {
            hidePromptFlash();
        }
    }
}
function hidePromptFlash() {
    $('#audio-recorder-holder').css({
        'left' : '-3000px'
        ,
        'width' : '1px'
        ,
        'height' : '1px'
    });
}

function playComplete(event){
    $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/start-play-button-enable.png');
    $('#stop-button').attr('src', baseUrl + '/themes/blueocean/img/stop-button-disable.png');
    recordStatus = 'normal';
}

/**
 * Kiểm tra xem Adobe Flash Player có available ko 
 */
function hasFlash() {
    var hasFlash = false; 
    try { 
        var fo = (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash']) ? navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin : 0;
        if(fo) hasFlash = true;
    } catch(e){
        if(navigator.mimeTypes ['application/x-shockwave-flash'] != undefined) {
            hasFlash = true; 
        }
    }
    return hasFlash;
}

$(document).ready(function() {
    var docWidth = $(document).width();
    var docHeight = $(document).height();
    var flashRecordWindowTop = docHeight / 2 - $('#audio-recorder-holder').height() / 2;
    var flashRecordWindowLeft = docWidth / 2 - $('#audio-recorder-holder').width() / 2;
    $('#audio-recorder-holder').css({
        'top' : 0,
        'left' : 0
        ,
        'width' : docWidth
        ,
        'height' : docHeight
        ,
        'background-color' : 'black'
        ,
        'opacity' : 0.3
        ,
        'padding-top' : flashRecordWindowTop
        ,
        'padding-left' : flashRecordWindowLeft
    });
    
    function stopRecordAndPlay(){
        if (recordStatus == 'playing'){
            document.getElementById("audio-recorder").stopPlaying();
            $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/start-play-button-enable.png');
        }
        if (recordStatus == 'recording'){
            document.getElementById("audio-recorder").stopRecording();
            $('#record-button').attr('src', baseUrl + '/themes/blueocean/img/start-record-button.png');
        }        
        $('#stop-button').attr('src', baseUrl + '/themes/blueocean/img/stop-button-disable.png');
        recordStatus = 'normal';
    }
    
    $('#stop-button').click(function(){
        stopRecordAndPlay();
    });
    
    $('#record-button').hover(function(){
        if (recordStatus == 'recording') return;
        $('#record-button').attr('src', baseUrl + '/themes/blueocean/img/recording-button.png');
    },function(){
        if (recordStatus == 'recording') return;
        $('#record-button').attr('src', baseUrl + '/themes/blueocean/img/start-record-button.png');
    });
    
    $('#record-button').click(function(){
        if (!canRecord) {
            alert('Microphone is not available');
            return;
        }
            
        if (!hasRecorded) {
            $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/start-play-button-enable.png');
            hasRecorded = true;
        }
        if (recordStatus == 'playing'){
            document.getElementById("audio-recorder").stopPlaying();
            $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/start-play-button-enable.png');
        }
        document.getElementById("audio-recorder").startRecording();
        $('#record-button').attr('src', baseUrl + '/themes/blueocean/img/recording-button.png');
        $('#stop-button').attr('src', baseUrl + '/themes/blueocean/img/stop-button-enable.png');
        recordStatus = 'recording';
    });
    
    $('#play-button').hover(function(){
        if (recordStatus == 'playing' || !hasRecorded) return;
        $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/playing-button.png');
    },function(){
        if (recordStatus == 'playing' || !hasRecorded) return;
        $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/start-play-button-enable.png');
    });
    
    $('#play-button').click(function(){
        if (!hasRecorded) return;
        if (recordStatus == 'recording'){
            document.getElementById("audio-recorder").stopRecording();
            $('#record-button').attr('src', baseUrl + '/themes/blueocean/img/start-record-button.png');
        }
        document.getElementById("audio-recorder").playSound();
        $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/playing-button.png');
        $('#stop-button').attr('src', baseUrl + '/themes/blueocean/img/stop-button-enable.png');
        recordStatus = 'playing';
    }); 
});