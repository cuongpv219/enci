
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
        $("#questions").children().hide();
    }
    function activeTabAndButton(index) {
        $('#question-container_' + index).show();
        $('#reading-board').html(reading[index]);
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
        var buttonHtml = "";
        var questionHtml = "";
        //var readingHtml ="";
        for(var i = 0; i < count; i++){
            buttonHtml +='<div id="sentence-button_' + (count-i-1) + '" data-order="' + (count-i-1) + '" class="inactive-button unselected">' + (count-i) + '</div>';   
            var choices = activityContent.question[i].choice.split("||");
            questionHtml += '<div id=question-container_' + i + '>' ;
            questionHtml +='<p class="ask-container">' + activityContent.question[i].ask  + '<span id="true-false-icon_'+ i +'"></span></p>';
            //$('#reading-board').html(ucanMarkupToHtml(reading[0]));
            for(var j = 0; j < choices.length; j++){
                questionHtml += '<div value="0" id="choice-container_' + i + '_' + j + '" class="choice-container" ><div value="0" class="choice global-choice-square-2" id="check_' + i + '_' + j + '"></div><label for="radio_' + i + '_' + j +'">' + normalizedworld(choices[j]) + '</label></div>';
            }
            questionHtml += '</div>';
        }

        $('#question-link').append(buttonHtml);
        $('#questions').append(questionHtml);
        // $('#reading-board').append(readingHtml);
        moveToTab(0);

        $('.inactive-button').click(function(){		
            var id = $(this).attr('data-order');
            moveToTab(id);
        });
        $('.choice-container').click(function(){
            if (!canPlay) return;
            playSound(Ucan.Resource.Audio.getClickedSound());
            if ($(this).attr("value") == "0") {
                $(this).attr("value","1");
                $(this).siblings().attr("value",0);
                $(this).children('.choice').addClass('checked');
                $(this).siblings().children('.choice').removeClass('checked');
            }
        });
    }    
    
    var count = activityContent.question.length; //number of question
    var reading = [];
    for(i=0;i<count;i++) {
       reading[i] = activityContent.question[i].reading;
    }
    var canPlay = true;
    var curTabIndex = 0;
    var numberOfTrueAnswers = 0;
    displayActivity();

   
    
    $("#redo").click(function() {
        numberOfTrueAnswers = 0;
        canPlay = true;
        $("#show-result").slideUp(1200);
        $('#question-link').html('');
        $('#questions').html('');
        displayActivity();
        
    });
    
    $("#show-answer").click(function() {
        for(var i=0; i < count; i++){   
            var choices = activityContent.question[i].choice.split("||");   
            for(var j=0; j<choices.length; j++){
                if (isAnswer(choices[j]))
                {
                     $("#choice-container_"+i+'_'+j).children('.choice').addClass('checked').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
                    $("#choice-container_"+i+'_'+j).siblings(".choice-container").children('.choice').removeClass('checked');
                    $("#choice-container_"+i+'_'+j).attr("value",1); 
                }
            }
        }
    });
});
    