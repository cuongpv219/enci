
$(document).ready(function(){
	
    function isAnswer(word){
        if (word.indexOf("#") == 0) return true;
        else return false;
    }
    function normalizedworld(word){
        if (isAnswer(word) == false) {
            return word;
        } else {
            return word.substring(1);
        }
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
        curTabIndex = parseInt(index);
        $('.global-tab-container').ucanMoveToTab(curTabIndex);
        
        if($('#activity-board').height() < ($('#reading-board').height() + 20)) {
            $('#activity-board').height($('#reading-board').height() + 20);
        }
        
        $("#questions").children().hide();
        $('#question-container_' + index).show();
        $('#reading-board').html(activityContent.question[index].reading);
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
    
    function displayActivity(){
        $('#main-board > div').show();
        $('#question-link').show();
        $('.cp-container').hide();
        canPlay = true;
        var buttonHtml = "";
        var questionHtml = "";
        for(var i = 0; i < count; i++){
            var questiontmp = activityContent.question[i].ask.split("[]");
            buttonHtml +='<div id="sentence-button_' + (count-i-1) + '" data-order="' + (count-i-1) + '" class="inactive-button unselected">'  +'<img class="false" src="'+baseUrl +'/themes/blueocean/img/true-false-cross-red-24.png'+'">'+'</img>'+'<img class="true" src="'+baseUrl +'/themes/blueocean/img/true-false-tick-green-24.png'+'">'+'</img>' + (count-i) + '</div>';   
            var choices = activityContent.question[i].choice.split("||");
            questionHtml += '<div id=question-container_' + i + '>' ;
            questionHtml +='<p class="ask-container">' + questiontmp[0] + ' ' + '<span class ="blank">_______ </span>' + ' ' + questiontmp[1] + '</p>';
            for (var j = 0; j < choices.length; j++){
                questionHtml += '<div value="0" id="choice-container_' + i + '_' + j + '" class="choice-container" style="color: black;"><div value="0" class="choice global-choice-square-2" id="check_' + i + '_' + j + '"></div><label for="radio_' + i + '_' + j +'">' + normalizedworld(choices[j]) + '</label></div>';
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
        $('.choice-container').click(function() {
            if (!canPlay) {
                return;
            }
            playSound(Ucan.Resource.Audio.getClickedSound());
            var  temp = $(this).text();
            $(this).parent().children().eq(0).children().eq(0).html('').html(temp).css({
                'color':'#f8883c',
                'font-size':'14px'
            });
            if ($(this).attr("value") == "0") {
                $(this).attr("value","1");
                $(this).siblings().attr("value",0);
                $(this).css({
                    "color":"#000"
                });
                $(this).find('.choice').addClass('checked');
                $(this).siblings('.choice-container').find('.choice').removeClass('checked');
            }
        
        });
    }    
    
    var count = activityContent.question.length; //number of question
    var canPlay = true;
    var answerhtml = '';
    var curTabIndex = 0;
    var numberOfTrueAnswers = 0;
    displayActivity();
    var canViewAnswer = true;
    $("#loadResult").click(function(){
        if (!canPlay) return;
        canPlay = false;
        numberOfTrueAnswers = 0;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        
        for(i=0; i< count; i++){
            var inputValue = -1;
            var choices = activityContent.question[i].choice.split("||");
            for(j=0;j<choices.length;j++){
                inputValue = ($('#choice-container_' + i + '_' + j).attr("value") == "1")?j:inputValue;
            }
            if (inputValue != -1)
                if (isAnswer(choices[inputValue])) {
                    numberOfTrueAnswers ++;
                    $('#sentence-button_'+i).children('.true').show();
                } 
                else {
                    $('#sentence-button_'+i).children('.false').show();       
                }
            else
            {
                $('#sentence-button_'+i).children('.false').show();              
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
        canViewAnswer = true;
        $('.cp-jplayer').jPlayer("stop");
        $("#show-result").slideUp(1200);
        $('#question-link').html('');
        $('#questions').html('');
        $('.answer-view').remove();
        answerhtml = '';
        displayActivity();
        
    });
    
    $("#show-answer").click(function() {
        if (canViewAnswer == false) {
            return;
        }
        
        $('#main-board > div').hide();
        $('#question-link').hide();
        if  (activityContent.listening_audio != "") $('.cp-container').show();
        answerhtml += '<div id="answer-container">';
        for(var i=0; i < count; i++){   
            var questiontmp = activityContent.question[i].ask.split("||");
            answerhtml += '<div class="answer-view" id="answer_'+i+'"><p class="ask-container">'+ '<span id="true-false-icon_'+ i +'"></span>' + '&nbsp&nbsp&nbsp&nbsp'  + questiontmp[0] + ' ' ; 
            var choices = activityContent.question[i].choice.split("||");   
            for(var j=0; j<choices.length; j++){
                if (isAnswer(choices[j]))
                {
                    answerhtml += '<span class="true-answer">' + normalizedworld(choices[j]) + '</span>' ;                    
                }
            }
            for(j=0; j<choices.length; j++){
                if (($('#choice-container_'+i+'_'+j).attr("value")=='1') && !isAnswer(choices[j])) {
                    answerhtml += ' ' + '<span class="false-answer">' + normalizedworld(choices[j]) + '</span>';
                }
            }
            answerhtml += ' ' + questiontmp[1] + '<span id="true-false-icon_'+ i +'"></span></p> </div>';       
            
        }
        answerhtml += '</div>';
        $('#main-board').append(answerhtml);
        for(i=0; i< count; i++) {
            if ( $('#sentence-button_'+i).children('.true').css('display') == 'block')
            {
                insertTrueFalseIcon(true, "#true-false-icon_" + i);
                $("#true-false-icon_" + i).attr("class","true-icon");
            }
    
            else {
                insertTrueFalseIcon(false, "#true-false-icon_" + i);
                $("#true-false-icon_" + i).attr("class","false-icon");
            }
        }
        canViewAnswer = false;
    });
});
    