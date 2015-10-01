$(document).ready(function() {	
	
    function displayActivity(){
        canPlay = true;
        answers = [];
        
        var paragraph = activityContent.paragraph;	
        var paragraphHtml = ucanMarkupToHtml(paragraph);	
	
        // to get strings in [[]] bracket
        paragraphHtml = paragraphHtml.replace(/\[/g, '<span class="choices-container">');
        paragraphHtml = paragraphHtml.replace(/\]/g, '</span>');
    
        //display paragraph
        $('#paragraph-container').append(Ucan.Function.HTML.editMediaUrl(paragraphHtml));
	
        //change display
        $('.choices-container').each(function(){
            var choices = $(this).text().split('||');
            var choiceHtml = '';
            $(this).html('');
            for(i=0;i<choices.length;i++){
                if(choices[i].indexOf("#") != -1) {
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
	
        $(".choice").click(function(){
            if (canPlay==false) return;
            playSound(Ucan.Resource.Audio.getClickedSound2());
            $(this).siblings().stop(true, true).animate({
                "opacity":"0.3"
            },500, function(){
                $(this).css('text-decoration','');
            }).animate({
                "color":"#4375b1",
                "opacity":"1"
            },500).removeClass("chosen");
            
            $(this).animate({
                "opacity":"0.3"
            },500, function(){
                $(this).css('text-decoration','line-through');
            }).stop(true, true).animate({
                "color":"#C12942",
                "opacity":"1"
            },500).addClass("chosen");
        });   
    }
    
    var canPlay = true;
    var answers = [];
    var canClickRedo = false;
    
    displayActivity();
    
    var numberOfTrueAnswers = 0;
    //get Result
    $("#loadResult").click(function(){
        if (canPlay==false) return;
        canPlay = false;
        $(".cp-jplayer").jPlayer("stop");
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0;
        var j = 0;
        $('.choices-container').each(function(){
            if($(this).children('.chosen').attr('order') == answers[j]){
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, $(this).last());
            }
            else {
                insertTrueFalseIconAfter(false, $(this).last());
            }
            j++;
        });        
        
        // Nhấp nháy icon đúng sai
        $('.true-icon, .false-icon').ucanAnimateTrueFalseIcon();
                
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
    
    $("#show-answer").click(function() {
        $('.choice').css({
            "text-decoration":"",
            "color":"#4f81bd"
        }).removeClass('.chosen');
        
        var j = 0;
        $('.choices-container').each(function(){
            $(this).children('.choice').eq(answers[j]).addClass('answer');
            j++;
        });
        $('.answer').animate({
            "opacity":"0.3"
        },500, function(){
            $(this).css('text-decoration','line-through');
        }).animate({
            "color":"#C12942",
            "opacity":"1"
        },500);
    });
});