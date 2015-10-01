
$(document).ready(function(){
	
    function isAnswer(word){
        if (word.indexOf("#") == 0) return true;
        else return false;
    }
    function normalizedworld(word){
        if (isAnswer(word) == false) return word;
        else return word.substring(1, word.lenght);
    }
    function trueAnswer(words){
        choice = words.split("||");
        for (var i=0; i<choice.lenght;i++)
        {
            if (isAnswer(choice[i])) return choice[i];
        }
        return false;
    }    
        
    function moveToTab(index){
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        $('#activity-board').css('height','');
        if($('#activity-board').height() < ($('#reading-board').height()+20) )
            $('#activity-board').height($('#reading-board').height() + 20);
    }
    
    function inactivateAllTabAndNavigatorButton() {
        $(".dialog-audio-container").hide();
        $(".cp-jplayer").jPlayer("stop");
        $("#questions").children().hide();
    }
    function activeTabAndButton(index) {
        $('#dialog-audio-container-'+index).show();
        $('#dialog-audio-'+index).jPlayer("play");
        $('#question-container_'+index).show();
        var isLast = true;
        for(var i = count-1; i >= 0;i-- ){
            if ($('#question-container_' + i).css('display') == "block"){
                if(isLast){
                    isLast = false;
                } else {
                    $('#question-container_' + i).css('border-bottom','1px solid #ddd');
                }
            }
        }
    }
    $('#next-link').click(function(){
        if (curTabIndex < number-1){
            moveToTab(curTabIndex + 1) ;
        }
    });
    $('#prev-link').click(function(){
        if(curTabIndex > 0) {
            moveToTab(curTabIndex - 1 );
        }
    });
    
    function displayActivity(){
        canPlay = true;
        $(".cp-jplayer").jPlayer("stop");
        var buttonHtml = "";
        var questionHtml = "";
        //var readingHtml ="";
        for (var k=0; k< number; k++)
            buttonHtml +='<div id="sentence-button_' + (number-k-1) + '" data-order="' + (number-k-1) + '" class="inactive-button unselected">' + (number-k) + '</div>';   
        for(var i = 0; i < count; i++){
            var choices = activityContent.question[i].choice.split("||");

            questionHtml += '<div id=question-container_' + i + ' class="question-container">' ;
            questionHtml +='<p class="ask-container">' + activityContent.question[i].ask.replace(/\[(.*?)\]/,"")  + '<span id="true-false-icon_'+ i +'"></span></p>';
            for(var j = 0; j < choices.length; j++){
                questionHtml += '<div value="0" id="choice-container_' + i + '_' + j + '" class="choice-container" style="color: black;"><div value="0" class="choice global-choice-square-2" id="check_' + i + '_' + j + '"></div><label for="radio_' + i + '_' + j +'" class="senten-text">' + normalizedworld(choices[j]) + '</label></div>';
            }
            questionHtml += '</div>';
        }

        $('#question-link').append(buttonHtml);
        $('#questions').append(questionHtml);
        moveToTab(0);

        $('.inactive-button').click(function(){		
            var id = $(this).attr('data-order');
            moveToTab(id);
        });
        $('.choice-container').click(function(){
            if (!canPlay) return;
            if ($(this).attr("value") == "0") {
                $(this).attr("value","1");
                $(this).siblings().attr("value",0);
                $(this).children().addClass('checked');
                $(this).siblings().children().siblings('.choice').attr("value", "0").removeClass('checked');
                $(this).css({
                    "color":"#000"
                });
            }
        
        });
        $('.choice-container').hover(function() {
            if($(this).attr("value") == "0") {
                $(this).css({
                    "color":"#fca710"
                });
            }
        }, function(){
            if($(this).attr("value") == "0") {
                $(this).css({
                    "color":"#000"
                });
            }
        });
    }    
    
    var count = activityContent.question.length; //number of question
    var number = 0;
    var canPlay = true;
    var curTabIndex = 0;
    var askSentences = [];
    var numberOfTrueAnswers = 0;
    for(i=0; i<count; i++){
        askSentences[i] = activityContent.question[i].ask;  
    }
    for (i=0; i<count; i++) {
        if (activityContent.question[i].listening_audio != "a") {
            number++;
        }
    }
    var groupArr = [];
    for(var i = 0; i < count; i++){
        if ($.inArray($.trim(activityContent.question[i].listening_audio),groupArr) == -1){
            groupArr[groupArr.length] = $.trim(activityContent.question[i].listening_audio);
        }
    }
    number = groupArr.length;
    displayActivity();

   
    $("#loadResult").click(function(){
        if (!canPlay) return;
        canPlay = false;
        numberOfTrueAnswers = 0;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        $('.cp-jplayer').jPlayer('stop');
        for(i=0; i< count; i++){
            var inputValue = -1;
            var choices = activityContent.question[i].choice.split("||");
            for(j=0;j<choices.length;j++){
                inputValue = ($('#choice-container_' + i + '_' + j).attr("value") == "1")?j:inputValue;
            }
            if (inputValue != -1)
                if (isAnswer(choices[inputValue])) {
                    numberOfTrueAnswers ++;
                    insertTrueFalseIcon(true, "#true-false-icon_" + i);
                    $("#true-false-icon_" + i).attr("class","true-icon");
                } 
                else {
                    insertTrueFalseIcon(false, "#true-false-icon_" + i);
                    $("#true-false-icon_" + i).attr("class","false-icon");       
                }
            else
            {
                insertTrueFalseIcon(false, "#true-false-icon_" + i);
                $("#true-false-icon_" + i).attr("class","false-icon");            
            }                   
        }
        // Nhấp nháy icon đúng sai
        $(".true-icon").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        $(".false-icon").fadeOut(500).fadeIn(500);
		
        $('#activity-container').animate({
            opacity:0.3
        }, 1000, function() {
            $(".true-icon").css({
                "visibility":"visible"
            });
            $(".false-icon").css({
                "visibility":"visible"
            });
            $(".true-icon").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
            $('#activity-container').animate({
                opacity:1
            }, 1000);
        });
		
        if (numberOfTrueAnswers < 10) {
            $("#num-of-correct-answers-result").html('0' + numberOfTrueAnswers);
        } else {
            $("#num-of-correct-answers-result").html(numberOfTrueAnswers);
        }
        score = Math.floor((numberOfTrueAnswers/count) * 100);
        if (score < 10) {
            $("#score-text").html('0' + score);
        } else {
            $("#score-text").html(score);
        }      
        $("#show-result").slideDown(2000);
    });
    
    $("#redo").click(function() {
        numberOfTrueAnswers = 0;
        canPlay = true;
        $("#show-result").slideUp(1200,function(){
            $('#question-link').html('');
            $('#questions').html('');
            displayActivity();
        })
    });
    
    $("#show-answer").click(function() {
        for(var i=0; i < count; i++){   
            var choices = activityContent.question[i].choice.split("||");   
            for(var j=0; j<choices.length; j++){
                if (isAnswer(choices[j]))
                {
                    
                    $("#choice-container_"+i+'_'+j).children().addClass('checked');
                    $("#choice-container_"+i+'_'+j).siblings(".choice-container").children().removeClass('checked');
                    $("#choice-container_"+i+'_'+j).attr("value",1); 
                    $("#choice-container_"+i+'_'+j).children().css({
                        "color":"#fca710"
                    });
                }
            }
        }
    });
});
    
