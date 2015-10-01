$(document).ready(function() {	
    var canPlay = true;
    var canClickRedo = false;
    
    function checkTextTypedByLearner(text, answer){
        var multiple_answer = answer.split("/");
        for (i=0; i<multiple_answer.length;i++){
            if (isEqualString(text, multiple_answer[i])) return true;
        }
        return false;
    }
	
    function editGui(){
        $('.text').autoGrowInput({
            comfortZone: 5,
            minWidth: 90,
            maxWidth: 140
        });
    }
    
    function displayActivity() {
        answers = []; //array of true answers
        paragraph = Ucan.Function.HTML.editMediaUrl(activityContent.paragraph);	
        var paragraphHtml = '<div class="paragraph">' + ucanMarkupToHtml(paragraph) + '</div>';	
	
        // to get strings in [] bracket
        var pattern = /\[([^\]])+\]/g; //regular expression
        answers = paragraphHtml.match(pattern);
        paragraphHtml = paragraphHtml.replace(pattern, '<span class="blank"><input type="text" class="text"/></span>');
        //display paragraph with blank
        $('#paragraph-container').append($(paragraphHtml));
	
        $(".text:first").focus();
        editGui();
    }
	
    var answers = []; //array of true answers
    displayActivity();
        
    // View answers
    $("#show-answer").click(function() {
        var j = 0;
        $(".text").each(function() {
            var ans = answers[j].substring(1,answers[j].length - 1);
            $(this).val(htmlEncode(ans)).fadeOut(500).fadeIn(500);
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
        
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0;
        var j = 0;
        $(".text").each(function() {
            if (checkTextTypedByLearner($(this).val(),htmlEncode(answers[j].substring(1,answers[j].length - 1)))){	//de chuan hoa xau nhap vao, bo cac dau cach thua o 2 dau + giua cac tu
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
            $("#paragraph-container").html("");
            displayActivity();
        });
    });
});