var count;
var canPlay = true;
var canClickRedo = false;
var count;
var answers = [];
var unShowClickResult = 0;
$(document).ready(function() {	
    var numViewedPage = 0 ;
    var paragraphHtml ='';
    var curTabIndex = 0;
    count = activityContent.group.length;
    canPlay = true;
    // add tab
    for (var i = 0; i < count; i++) {
        paragraphHtml += '<div class="parapara" id="paragraph_'+i+'">' + activityContent.group[i].paragraph + '</div>';	
        $('#paragraph-number').append('<div id="sentence-button_' + i + '" data-order="' + i + '" class="inactive-button unselected">' + (i + 1) + '</div>');
    }
    function displayActivity(){
        // to get strings in [] bracket
        paragraphHtml = paragraphHtml.replace(/\[/g, '<span class="choices-container">');
        paragraphHtml = paragraphHtml.replace(/\]/g, '</span>');
        
        //display paragraph
        $('#paragraph-container').append(paragraphHtml);
        
        //change display
        $('.choices-container').each(function(){
            var choices = $(this).text().split('||');
            var choiceHtml = '';
            $(this).html('');
            for(i=0;i<choices.length;i++){
                if($.trim(choices[i]).indexOf("#") == 0) {
                    choiceHtml+='<span class="choice" order="' + i + '">' + $.trim(choices[i]).substr(1) + '</span>';
                    answers[answers.length] = i;
                }
                else {
                    choiceHtml+='<span class="choice" order="' + i + '">' + $.trim(choices[i]) + '</span>';
                }
                choiceHtml = (i==(choices.length-1))?choiceHtml:choiceHtml + ' / ';
            }
            $(this).append(choiceHtml);
        });
        moveToTab(0);
        $('.inactive-button').click(function(){		
            var id = $(this).attr('data-order');
            moveToTab(id);
        });
        
        if (activityContent.group.length < 2) {
            $('#paragraph-number').hide();
            $('#prev-link').hide();
            $('#next-link').hide();
            $('#loadResult').css({
                'float':'none',
                'margin':'0 auto'
            });
        }
        
        $(".choice").click(function(){
            if (canPlay==false) return;
            playSound(Ucan.Resource.Audio.getClickedSound2());
            $(this).siblings().stop(true, true).animate({
                "opacity":"0.3"
            },500).animate({
                "color":"#8c8c8c",
                "opacity":"1"
            },500).removeClass("chosen");
            $(this).stop(true, true).animate({
                "opacity":"0.3"
            },500).animate({
                "color":"#f5770f",
                "opacity":"1"                
            },500).addClass("chosen");
        }); 
        
    }
    $('.video-outer-click-result').hide();
    
    $("#multipage-confirm-dialog-button-no").click(function(){
        $('.video-outer').show();
        $('.video-outer-click-result').hide();
    });
    
    $("#multipage-confirm-dialog-button-yes").click(function(){
        $('.video-outer').show();
        $('.video-outer-click-result').hide();
    });
        
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
    
    displayActivity();
    
    function moveToTab(index){
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        numViewedPage++;
    }
    
    function inactivateAllTabAndNavigatorButton() {
        $(".parapara").hide();
    }
    
    function activeTabAndButton(index) {
        $('#paragraph_' + index).show();
        $('#sentence-button_'+ index).addClass('selected');
    }
    
    var numberOfTrueAnswers = 0;
    //get Result
    $("#loadResult").click(function(){
        if (!canPlay) return;
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) && (count > 1)){
            $('.video-outer').hide();
            $('.video-outer-click-result').show();
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
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
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
        unShowClickResult = 0;
        numViewedPage = 0;
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $("#paragraph-container").html("");
            displayActivity();
        });
    });
    
    $("#show-answer").click(function() {
        $('.chosen').removeClass('.chosen');
        
        $('.choice').animate({
            "opacity":"0.3"
        },500).animate({
            "color":"#8c8c8c",
            "opacity":"1"
        },500);
        
        var j = 0;
        $('.choices-container').each(function(){
            $(this).children('.choice').eq(answers[j]).addClass('answer');
            j++;
        });
        $('.answer').animate({
            "opacity":"0.3"
        },500).animate({
            "color":"#f5770f",
            "opacity":"1"
        },500);
    });
});

function loadResult(){
    if (canPlay==false) return;
    canPlay = false;
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
    playSound(Ucan.Resource.Audio.getShowResultSound());
    numberOfTrueAnswers = 0;
    var j = 0;
    $('.choices-container').each(function(){
        if($(this).children('.chosen').attr('order') == answers[j]){
            numberOfTrueAnswers++;
            insertTrueFalseIcon(true, $(this));
        }
        else {
            insertTrueFalseIcon(false, $(this));
        }
        j++;
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