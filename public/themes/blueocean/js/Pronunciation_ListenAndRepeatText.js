var recordStatus = 'normal';
var paragraph = [];
var flashDisplayed = false;
var canRecord = false;
var overlayBackground = null;

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
        'left' : '-999999px',
        'width' : '1px',
        'height' : '1px'
    });
    
    if (overlayBackground) {
        overlayBackground.click();
    }
}

function playComplete(event){
    $('#play-button').attr('src', baseUrl + '/themes/blueocean/img/start-play-button-enable.png');
    $('#stop-button').attr('src', baseUrl + '/themes/blueocean/img/stop-button-disable.png');
    recordStatus = 'normal';
}

$(document).ready(function() {
    overlayBackground = Ucan.Function.HTML.createOverlayBackground($('#audio-recorder-holder'));
    
    // Kiểm tra xem có Flash Player chưa, 
    // chưa có thì remove cái div chứa thông báo đi ko thì bị đơ + ko click đc vào cái j hết
    if (!hasFlashPlugin()) {
        hidePromptFlash();
        $('#audio-recorder-holder').remove();
        canRecord = false;
    }
    
    
    initData();
    var count = activityContent.group.length; //number of sentences
    var introVideo = activityContent.introVideo;
    var curTabIndex = 0;
    var buttonHtml = '';    
    var hasRecorded = false;
    for(var i = count - 1; i>= 0; i--){
        var offset = introVideo != undefined && introVideo != ''? 2: 1;
        buttonHtml+='<div id="sentence-button_' + i + '" data-order="' + (i + offset) + '" class="inactive-button navigator-button global-float-right unselected" data-active="0">' + (i + 1) + '</div>';
    }
    $('#record-button-set').hide();
    $("#navigator-bar").children().first().before(buttonHtml);
    if(((activityContent.homeTitle == "")||(activityContent.homeTitle != undefined)) && ((activityContent.introVideo == "")||(activityContent.introVideo == undefined))) {
        moveToTab('1');
        $('#home-title-button').hide();
    }
    else {
        moveToTab('0');
    }
        
    $('.navigator-button').click(function(){
        moveToTab($(this).attr('data-order'));
    });
    
    $('#home-title-start-button').click(function(){
        moveToTab('1');
    });
    
    $('#next-button').click(function(){
        var offset = introVideo != undefined && introVideo != ''? 1: 0;
        if (curTabIndex < count + offset){
            moveToTab((curTabIndex + 1).toString());
        }
    });
    
    $('#previous-button').click(function(){
        var offset = introVideo != undefined && introVideo != ''? 0: 1;
        if (curTabIndex>offset){
            moveToTab((curTabIndex - 1).toString());
        }
    });
    
    function moveToTab(index){ 
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activateTabAndButton(index);
    }
    
    function inactivateAllTabAndNavigatorButton(){
        $('.cp-jplayer').jPlayer("stop");
        pauseAllVideoJs();
        stopRecordAndPlay();
        $('#phase-content-container').children().css('display','none');
        $('.navigator-button').addClass('unselected');
        $('.navigator-button').attr('data-active','0');
    }
    $('.sentence-tab').each(function(index) {
        $(this).find('.paragraph-container').append('<div id="paragraph_' + index + '" class="paragraph-child">' + Ucan.Function.HTML.editMediaUrl(paragraph[index].paragraph) + '</div>');
    });
    
    function activateTabAndButton(index){
        curTabIndex = parseInt(index);
        switch(index) {
            case '0':
                $('#record-button-set').hide();
                $('#audio-recorder-holder').show();
                $('#home-title-tab').css('display','block');
                $('#home-title-button').attr('data-active','1');
                $('#home-title-button').addClass('selected').removeClass('unselected');
                $('#previous-button').css({
                    'margin-left':'390px'
                }); 
                  
                break;
            case '1':
                $('#record-button-set').hide();
                if (introVideo != undefined && introVideo != '') {
                    $('#intro-video-tab').css('display','block');
                    $('#intro-video_container > video').css('height','315px').parent().css('width','560px');
                    $('#intro-video-button').attr('data-active','1');
                    $('#intro-video-button').addClass('selected').removeClass('unselected');
                    $f("intro-video").play();
                    $('#previous-button').css({
                        'margin-left':'390px'
                    }); 
                    break;
                } 
            default:
                var offset = introVideo != undefined && introVideo != ''? 2: 1;
                $('#sentence-tab-' + (index - offset)).css('display','block');
                $('#sentence-button_' + (index - offset)).attr('data-active','1');
                $('#record-button-set').show();
                
                $("#sentence-audio-"+ (index - offset)).jPlayer("play");
                $('#previous-button').css({
                    'margin-left':'470px'
                }); 
                $('#record-button-set').css({
                    'margin-left':'370px'
                });
                //                if ($('#sentence-tab-' + (index - offset)).children('.sentence-audio-container').size() > 0) {
                //                }
                //                else{
                //                }
                if($f("sentence-video-"+ (index - offset)) != null) { 
                    $f("sentence-video-"+ (index - offset)).play();
                }
                break;
        }
    }    
    
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
    
    function initData() {
        for (var i = 0; i < activityContent.group.length; i++) {
            var iter = activityContent.group[i];
            var obj = {};
            obj.audio = iter.sentenceAudio;
            obj.paragraph = (iter.paragraph != undefined)?iter.paragraph:"";
            paragraph.push(obj);
        }
    }
});