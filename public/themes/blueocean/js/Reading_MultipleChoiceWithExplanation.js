
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
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        
        $('#activity-board').css('height','');
        if($('#activity-board').height() < ($('#reading-board').height()+20) )
            $('#activity-board').height($('#reading-board').height() + 20);
    }
    
    function inactivateAllTabAndNavigatorButton() {
        $('.checkanswer1').hide();
        $("#questions").children().hide();
        $('#question-link div').css({
            "background":"url(" + baseUrl + "/themes/blueocean/img/number-tab-inactive-background.png)",
            "color":"#000",
            "border":"1px solid #D9D9D9"
        });
    }
    function activeTabAndButton(index) {
        $('.cp-container').hide();
        $('#check-answer').css ({
            'border':'none'
        })
        $('#question-container_' + index).show();
        $('#reading-board').html(reading[index]);
        $('#sentence-button_'+ index).css({
            "background":"url(" + baseUrl + "/themes/blueocean/img/sentence-button-active.png)",
            "border":"1px solid #0097DA",
            "color":"#fff"
        });
        $('#check-answer_'+index).show();
        
        if (canPlay == false) {
            var choices = activityContent.question[index].choice.split("||");
            for (var j=0; j<choices.length;j++)
            {
                if($('#check-answer_'+index+'_'+j).attr("value") == 1 ){
                    $('#check-answer_'+index+'_'+j).show();
                }
            }
        }
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
        canPlay = true;
        $('.true').hide();
        $('.false').show();
        var buttonHtml = "";
        var questionHtml = "";
        var check_AnswerHtml = "";
        answerhtml = "";
        $('#blue-nagivator').css({
            'margin-bottom':'0px'
        })
        $('#main-board').css({
            'border-top':'1px solid #ddd'
        })

        for(var i = 0; i < count; i++){
            buttonHtml +='<div id="sentence-button_' + (count-i-1) + '" order="' + (count-i-1) + '" class="inactive-button">' + (count-i) + '<img class="false" src="'+baseUrl +'/themes/blueocean/img/tab-false-icon.png'+'">'+'</img>'+'<img class="true" src="'+baseUrl +'/themes/blueocean/img/tab-true-icon.png'+'">'+'</img>'+ '</div>';   
            var choices = activityContent.question[i].choice.split("||");
            questionHtml += '<div id=question-container_' + i + '>' ;
            questionHtml +='<p class="ask-container">' + activityContent.question[i].ask  + '<span id="true-false-icon_'+ i +'"></span></p>';
            check_AnswerHtml += '<div id="check-answer_'+i+'" class="checkanswer1" >';
            for(var j = 0; j < choices.length; j++){
                questionHtml += '<div value="0" id="choice-container_' + i + '_' + j + '" class="choice-container" order1 = "'+i+'" order2="'+j+'" style="color: black;"><div value="0" class="choice global-choice-square" id="check_' + i + '_' + j + '"></div><label class="label1" for="radio_' + i + '_' + j +'">' + normalizedworld(choices[j]).split('--')[0] + '</label></div>';
                check_AnswerHtml += '<div id = "check-answer_'+ i + '_' + j +'" value="0" class="checkAnswer">  <span>' +normalizedworld(choices[j]).split('--')[1] +'<img class="img-check" src="'+baseUrl+'/img/icons/triangle.png"/> </span></div>' ;
                check_AnswerHtml += '';
            }         
            check_AnswerHtml +='</div>';            
            questionHtml += '</div>';
        }
        $('#check-answer').append(check_AnswerHtml);
        $('#question-link').append(buttonHtml);
        $('#questions').append(questionHtml);
        moveToTab(0);

        $('.inactive-button').click(function(){		
            var id = $(this).attr('order');
            moveToTab(id);
        });
        $('.choice-container').click(function(){
            if (!canPlay) return;
            
            playSound(Ucan.Resource.Audio.getClickedSound()); 
            var order1 = parseInt($(this).attr("order1"));
            var order2 = parseInt($(this).attr("order2"));
            $('#check-answer_'+order1).children('.checkAnswer').hide();
            $('#check-answer_'+order1+'_'+order2).show();
            if ($(this).attr("value") == "0") {
                $(this).attr("value","1");
                $(this).siblings().attr("value",0);
                $(this).css({
                    "color":"#000"
                });
                $(this).children('.choice').addClass('checked');
                $(this).siblings().children('.choice').removeClass('checked');
            }
        
        });
    }    
    
    var count = activityContent.question.length; //number of question
    var reading =[];
    for(i=0;i<count;i++) {
        reading[i] = activityContent.question[i].reading;
    }
     var answer =[];
    for(i=0;i<count;i++) {
        answer[i] = activityContent.question[i].answer;
    }
    var canPlay = true;
    var canViewAnswer = true;
    var answerhtml='';
    var curTabIndex = 0;
    var numberOfTrueAnswers = 0;
    displayActivity();

    $("#loadResult").click(function(){
        if (!canPlay) return;
        canPlay = false;
        numberOfTrueAnswers = 0;
        playSound(Ucan.Resource.Audio.getShowResultSound());
		
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
        $('#question-link').show();
        $('#check-answer').html('');
        $('#activity-board').show();
        $('#reading-board').show();
        for(var k=0; k<count;k++){
            $('#answer_'+k).remove();
        }
        $('.answer-number').remove();
        $('#next-prev').show();
        displayActivity();        
    });
    
    $("#show-answer").click(function() {
        if (canViewAnswer == false) return;
        $('#main-board > div').hide();
        $('#question-link').hide();
        $('.cp-container').show();
        $('#blue-nagivator').css({
            'margin-bottom':'20px'
        })
        $('#main-board').css({
            'border-top':'none'
        })
        $('#main-board').append(answerhtml);
       
        for (var i=0; i < count; i++){   
            var choices = activityContent.question[i].choice.split("||");   
            answerhtml += '<div> <div class="answer-number"> '+(i+1)+'</div> <div class="answer-view" id="answer_'+i+'"> </div> </div>';       
            for(var j = 0; j < choices.length; j++){
                if (isAnswer(choices[j]))
                {
                    $("#choice-container_"+i+'_'+j).children('.choice').addClass('checked').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
                    $("#choice-container_"+i+'_'+j).siblings(".choice-container").children('.choice').removeClass('checked');
                    $("#choice-container_"+i+'_'+j).attr("value",1); 
                }
            }
        }
        $('#main-board').append(answerhtml);
        for(var k=0; k<count;k++){
            $('#answer_'+k).html(answer[k]);
        }
        canViewAnswer = false;
    });
});