var recordStatus = 'normal';

function onMicStatus(event){
    if (event == 'Unmuted'){
        $('#record-button-set').show();
        $('#audio-recorder-holder').css('left',-2000);
    }
}

function playComplete(event){
    $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/start-play-button-enable.png');
    $('#stop-button').attr('src', baseUrl + '/themes/blueocean/img/stop-button-disable.png');
    recordStatus = 'normal';
}

$(document).ready(function() {
    
    function moveToTab(index){
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activateTabAndButton(index);
         if(index == 0){
            $('#previous-button').css({
                'margin-left':'380px'
            });
        }
        else{
            $('#previous-button').css({
                'margin-left':'470px'
            });
        }
    }

    function inactivateAllTabAndNavigatorButton(){
        pauseAllVideoJs();
        stopRecordAndPlay();
        $('#phase-content-container').children().css('display','none');
        $('.navigator-button').attr('data-active','0');
        $('.navigator-button').addClass('unselected');
        $('#audio-recorder-container').hide();        
    }

    function activateTabAndButton(index){
        curTabIndex = parseInt(index);
        switch(index) {
            case '0':
                $('#home-title-tab').css('display','block');
                $('#home-title-button').attr('data-active','1');
                $('#home-title-button').addClass('selected').removeClass('unselected');
                break;
                
            case '1':
                $('#intro-video-tab').css('display','block');
                $('#intro-video_container > video').css('height','315px').parent().css('width','560px');
                $('#intro-video-button').attr('data-active','1');
                $('#intro-video-button').addClass('selected').removeClass('unselected');
                break;
                
            default:
                $('#sentence-tab-' + (index - 2)).css('display','block');
                $('#sentence-button_' + (index - 2)).attr('data-active','1');
                $('#audio-recorder-container').show();
                $("#sentence-audio-"+ (index - 2)).jPlayer("play");
        }
    }

    $('#record-button-set').hide();
    var count = activityContent.group.length; //number of sentences
    var curTabIndex = 0;
    var buttonHtml = '';    
    var hasRecorded = false;
    for(var i = count - 1; i>= 0; i--){
        buttonHtml+='<div id="sentence-button_' + i + '" data-order="' + (i + 2) + '" class="inactive-button navigator-button ' + ((i>8)?"two-char":"one-char") + ' global-float-right unselected" data-active="0">' + (i+1) + '</div>';
    }
    $("#intro-video-button").before(buttonHtml);
    moveToTab('0');
        
    $('.navigator-button').click(function(){
        moveToTab($(this).attr('data-order'));
    });
    
    $('#home-title-start-button').click(function(){
        moveToTab('1');
    });
    
    $('#next-button').click(function(){
        if (curTabIndex<count + 1){
            moveToTab((curTabIndex + 1).toString());
        }
    });
    
    $('#previous-button').click(function(){
        if (curTabIndex>0){
            moveToTab((curTabIndex - 1).toString());
        }
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