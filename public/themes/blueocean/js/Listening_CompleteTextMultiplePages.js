var unShowClickResult = 0;
var numViewedPage = 0 ;
var canPlay = true;
var count;
var canClickRedo = false;
var answers = []; //array of true answers
var score;

$(document).ready(function() {	
    count = activityContent.group.length;
    var curTabIndex = 0;
    
    displayActivity();
    
    if (activityContent.group.length < 2) {
        $('#paragraph-number').hide();
        $('#prev-link').hide();
        $('#next-link').hide();
        $('#loadResult').css({'float':'none','margin':'0 auto'});
    }
    
    function moveToTab(index){
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        numViewedPage++;
    }
    
    function inactivateAllTabAndNavigatorButton() {
        $(".dialog-audio-container").hide();
        $('.cp-jplayer').jPlayer("stop");
        $(".parapara").hide();
    }
    function activeTabAndButton(index) {
        $('#paragraph_' + index).show();
        $('#dialog-audio-container-'+index).show();
        $('#dialog-audio-'+index).jPlayer("play");
        $('#sentence-button_'+ index).addClass('selected');
    }
    
    function displayActivity() {
        answers = []; //array of true answers
        var paragraphHtml ='';

        for (var i = 0; i < count; i++) {
            paragraphHtml += '<div class="parapara" id="paragraph_'+i+'">' + Ucan.Function.HTML.editMediaUrl(activityContent.group[i].paragraph) + '</div>';	
            $('#paragraph-number').append('<div id="sentence-button_' + i + '" data-order="' + i + '" class="inactive-button unselected">' + (i + 1) + '</div>');
        }
        var pattern = /\[([^\]])+\]/g; //regular expression
        answers = paragraphHtml.match(pattern);
        paragraphHtml = paragraphHtml.replace(pattern, '<span class="blank"><input type="text" class="text"/></span>');
        $('#paragraph-container').append($(paragraphHtml));
        moveToTab(0);

        $('.inactive-button').click(function(){		
            var id = $(this).attr('data-order');
            moveToTab(id);
        });
        $(".text:first").focus();
    }
    
    $('#next-link').click(function(){
        if (curTabIndex < count-1){
            moveToTab(curTabIndex + 1) ;
        }
    });
    $('#prev-link').click(function(){
        if(curTabIndex > 0) {
            moveToTab(curTabIndex - 1 );
        }
    });
    
    $("#show-answer").click(function() {
        var j = 0;
        $(".text").each(function() {
            var ans = htmlEncode(answers[j]);
            ans = ans.substring(1,ans.length - 1);
            $(this).val(ans);
            j++;
        });
        $(".text").css('width','').fadeOut(500).fadeIn(500);
    });
        
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function(){
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) && (count > 1)){
            unShowClickResult++;
            if(unShowClickResult == 1){
                $('.overlay-black').show();
                $('#multipage-confirm-dialog').fadeIn(500);
            }
        }
        else{
            loadResult();
        }
    });
	
    $("#redo").click(function() {
        unShowClickResult = 0;
        numViewedPage = 0;
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
        canPlay = true;
        
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            $('#paragraph-number').html('');
            $('#paragraph-container').html('');
            displayActivity();          
        });
    });
    
});

function checkTextTypedByLearner(text, answer){
    var multiple_answer = answer.split("/");
    for (i=0; i<multiple_answer.length;i++){
        if (isEqualString(text, multiple_answer[i])) return true;
    }
    return false;
}
    
function loadResult(){
    if (!canPlay) {
        return;
    }
    canPlay = false;
    $('.cp-jplayer').jPlayer("stop");
    playSound(Ucan.Resource.Audio.getShowResultSound());
    numberOfTrueAnswers = 0;
    var j = 0;
    $(".text").each(function() {
        ans = htmlEncode(answers[j]);
        if (checkTextTypedByLearner($(this).val(),ans.substring(1,ans.length - 1))){
            numberOfTrueAnswers++;	
            insertTrueFalseIconAfter(true, this);
        } else {
            insertTrueFalseIconAfter(false, this);
        }
        j++;
    });
    $('.true-icon').css({
        "margin":"-2px 2px 0px 1px",
        "box-shadow":"none",
        "border":"none",
        'width':'18px',
        'height':'18px'
    });
    $('.false-icon').css({
        "margin":"-2px 2px 0px 1px",
        "box-shadow":"none",
        "border":"none",
        'width':'18px',
        'height':'18px'
    });
        
    // Nhấp nháy icon đúng sai
    $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
		
    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + answers.length);
    score = Math.floor((numberOfTrueAnswers / answers.length) * 100);
    $("#score-text").text(score);
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
    canClickRedo = true;
}