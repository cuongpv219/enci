/**
 * author: Dinh Doan
 */
var canPlay = true;
var canClickRedo = false;
var count;
var answers = [];
var numberOfTrueAnswers = 0;
var unShowClickResult = 0;
var score;
$(document).ready(function() {
    var pattern = /\[([^\]])+\]/g;
    var paragraphs = [];
    var numViewedPage = 0 ;
    count = activityContent.group.length;
    for (var i = 0; i < activityContent.group.length; i++) {
        paragraphs.push(activityContent.group[i].paragraph.replace(pattern, '<input type="text" class="blank"/>'))
        answers = answers.concat(activityContent.group[i].paragraph.match(pattern));
    }
    
    displayActivity();
    
    function editGUI() {
        $('.blank').autoGrowInput({
            comfortZone: 5,
            minWidth: 90,
            maxWidth: 140
        });
    }
    function moveToTab(index) {
        $('.paragraph.order' + index).fadeIn(200).siblings('.paragraph').hide();
        $('.global-tab-container').ucanMoveToTab(index);
        numViewedPage++;
    }
    function displayActivity() {
        $('.video-outer-click-result').hide();
        for (var i = 0; i < paragraphs.length; i++) {
            $('#text-container').append('<div class="paragraph order' + i + '">' + paragraphs[i] + '</div>');
            if (paragraphs.length > 1) {
                $('.global-tab-container').append('<div class="unselected" data-order="'+ i +'">' + (i + 1) + '</div>');
            }
        }
        
        var nextBack = '';
        if (paragraphs.length > 1) {
            nextBack = '<div id="back-tab" class="global-button-orange-1">' + multiLangSystem.button_back + '</div>'
            + '<div id="next-tab" class="global-button-orange-1">' + multiLangSystem.button_next + '</div>';
        } else {
            $('.global-tab-container').remove();
        }
        
        $('#text-container').append('<div id="submitDiv" class="global-submit-div">'
            + nextBack
            + '<div id="loadResult" class="global-button-green-1">' + multiLangSystem.button_submit + '</div>'
            + '</div>');
        
        /*
         * Event for click 
         */
        $('.global-tab-container .unselected').click(function() {
            moveToTab($(this).attr('data-order'));
        });
        
        $('#next-tab').click(function() {
            var order = $('.global-tab-container .selected').attr('data-order');
            if (order < paragraphs.length - 1) {
                moveToTab(parseInt(order) + 1);
            }
        });
        $('#back-tab').click(function() {
            var order = $('.global-tab-container .selected').attr('data-order');
            if (order > 0) {
                moveToTab(parseInt(order) - 1);
            }
        });
        $("#multipage-confirm-dialog-button-no").click(function(){
            $('.video-outer').show();
            $('.video-outer-click-result').hide();
        });
        $("#multipage-confirm-dialog-button-yes").click(function(){
            $('.video-outer').show();
            $('.video-outer-click-result').hide();
        });
        moveToTab(0);
        $('#loadResult').click(function() {
            if (!canPlay) {
                return;
            }
            $(document).keyup(function(e){
                if(e.keyCode == 13) {
                    $('#multipage-confirm-dialog-button-no').click();
                }
            });
            if((numViewedPage == 1) && (count > 1)){
                unShowClickResult++;
                $('.video-outer').hide();
                $('.video-outer-click-result').show();
                if(unShowClickResult == 1){
                    $('.overlay-black').show();
                    $('#multipage-confirm-dialog').fadeIn(500);
                }
            }
            else{
                loadResult();
            }
        });
        
        $('#redo').click(function() {
            if (!canClickRedo) {
                return;
            }
            canClickRedo = false;
            unShowClickResult = 0;
            numViewedPage = 0;
            $("#show-result").hide('slide', {
                direction: 'left'
            }, Ucan.Constants.getHideResultSpeed(), function() {
                canPlay = true;
                $('#text-container').html('');
                $('.global-tab-container').html('');
                $('#show-result').slideUp(1000);
                displayActivity();
                try {
                    if($f()) {
                        $f().stop();
                    }
                    if((activityContent.video.indexOf('1:')==0))
                    {
                        document.getElementById("my_player").pauseVideo();
                    }
                }
                catch (err) {
        
                }
            });
        });
        
        $('#show-answer').click(function() {
            $('.blank').each(function(index) {
                $(this).val(htmlEncode(answers[index].replace('[', '').replace(']', '')));
            });
        });
        
        editGUI();
    }
    
});

function checkTextTypedByLearner(text, answer){
    var multiAnswer = answer.split("/");
    for (var i=0; i < multiAnswer.length;i++){
        if (text && multiAnswer[i] && isEqualString(text, multiAnswer[i])) {
            return true;
        }
    }
    return false;
}

function loadResult() {
    $('#my_player').show();
    try {
        if($f()) {
            $f().stop();
        }
        if((activityContent.video.indexOf('1:')==0))
        {
            document.getElementById("my_player").pauseVideo();
        }
    }
    catch (err) {
        
    }
    canPlay = false;
    playSound(Ucan.Resource.Audio.getShowResultSound());
    var numberOfTrueAnswers = 0;
    $('.blank').each(function(index) {
        if (checkTextTypedByLearner(htmlEncode($(this).val()), htmlEncode(answers[index].toString().replace('[', '').replace(']', '')))){
            numberOfTrueAnswers++;	
            insertTrueFalseIconAfter(true, this);
        } else {
            insertTrueFalseIconAfter(false, this);
        }
    });
    $('.true-icon').css({
        "margin":"-2px 2px 0px 1px",
        'width':'18px',
        'height':'18px'
    });
    $('.false-icon').css({
        "margin":"-2px 2px 0px 1px",
        'width':'18px',
        'height':'18px'
    });
        
    // Nh?p nháy icon đúng sai
    $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
		
    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + answers.length);
    score = Math.floor((numberOfTrueAnswers / answers.length) * 100);
    $("#score-text").text(score);
    if (answers.length == 0) {
        window.location.replace(nextActivityUrl);
    } else {
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
        canClickRedo = true;   
    }
}