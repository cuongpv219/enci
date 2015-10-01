$(document).ready(function() {	
    var canPlay = true;
    var canClickRedo = false;
    
    function checkTextTypedByLearner(text, answer){
        var multiple_answer = answer.split("/");
        for (var i = 0; i < multiple_answer.length; i++){
            if (isEqualString(text, multiple_answer[i])) return true;
        }
        return false;
    }
	
    function displayActivity() {
        answers = []; //array of true answers
        var paragraph = Ucan.Function.HTML.editMediaUrl(activityContent.paragraph);	
        var paragraphHtml = '<div id="paragraph2">' + paragraph + '</div>';	
        var pattern = /\[([^\]])+\]/g; //regular expression
        answers = paragraphHtml.match(pattern);
        paragraphHtml = paragraphHtml.replace(pattern, '<span class="blank"><input type="text" class="text"/></span>');
        
        $('#paragraph-container').append($(paragraphHtml));
        $(".text:first").focus();
    }
	
    var answers = []; //array of true answers
    displayActivity();
        
    // View answers
    $("#show-answer").click(function() {
        var j = 0;
        $(".text").each(function() {
            var ans = answers[j].substring(1,answers[j].length - 1);
            $(this).val(ans);
            j++;
        });
    });
        
    var numberOfTrueAnswers = 0;
    //get Result
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        canPlay = false;
        $(".cp-jplayer").jPlayer("stop");
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0;
        var j = 0;
        $(".text").each(function() {
            if (checkTextTypedByLearner($(this).val(),htmlEncode(answers[j].substring(1,answers[j].length - 1)))){
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
    });
	
    $("#redo").click(function() {
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
        
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $("#paragraph2").remove();
            displayActivity();        
        });
    });
    
    $("#show-answer").click(function() {
        $(".text").val('');
        var j = 0;
        $(".text").each(function() {
            $(this).val(htmlEncode(answers[j].substring(1,answers[j].length - 1)));
            j++;
        });
        $(".text").css('width','').fadeOut(500).fadeIn(500);
    });
});
