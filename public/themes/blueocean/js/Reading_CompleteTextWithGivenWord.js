$(document).ready(function() {
    
    var count = activityContent.group.length; //number of sentences
    var underscoreString;
    var answers = []; //array of true answers
    var shuffed_answers = [];
    var canPlay = true;
    var canClickRedo = false;
    
    function splitString(string) {
        var firstIndex = string.indexOf('[');
        var lastIndex = string.indexOf(']');
        var subString = [];
        if ((firstIndex != -1) && (lastIndex != -1) && (firstIndex < lastIndex)){
            subString[0] = string.substring(firstIndex + 1, lastIndex);
            subString[1] = string.substring(0, firstIndex);
            subString[2] = string.substring(lastIndex + 1, string.length);
            return subString;
        }
        return false;
    }
    
    function getReplaceUnderscoreString(arr){
        var maxLength = 0;
        for (var i = 0; i < arr.length; i++){
            if (arr[i].length > maxLength){
                maxLength = arr[i].length;
            }
        }
        underscoreString = ''; 
        maxLength = maxLength<5?5:maxLength;
        for (var j = 0; j < maxLength; j++){
            underscoreString += '_';
        }
    }

    function displayActivity() {
        count = activityContent.group.length; //number of sentences
        var wordListHtml = ""; //to display given words
        var sentenceListHtml = '<ul id="sentences">'; // to display sentences needing to fill in the blank
        var sentences = []; //array of sentences
        answers = []; //array of learner's answers
        shuffed_answers = [];
        var order = 0;
        
        $('#reading-container').append(Ucan.Function.HTML.editMediaUrl(activityContent.reading));
        
        for (var i = 0; i < count; i++){ 
            sentences[i] = activityContent.group[i].sentence;
            var subsentence = splitString(sentences[i]);
            if (subsentence != false){	
                order++;
                sentenceListHtml += '<li class="sentence">' + order + '. ' + subsentence[1] + 
                '<span class="blank" id="content' + i + '"><span class="underscore"></span></span> ' 
                + subsentence[2] + '</li>';
                answers[i] = subsentence[0];
                shuffed_answers[i] = subsentence[0];
            } else{
                answers[i] = '';
                shuffed_answers[i] = '';
            }
        }
        
        getReplaceUnderscoreString(answers);
        sentenceListHtml += '</ul>';
        shuffed_answers = shuffle(shuffed_answers);
        
        for (i = 0; i < count; i++){
            wordListHtml += '<span class="word">' + shuffed_answers[i].toLowerCase() + '</span> ';
        }
        
        //display given words and sentences with blank
        $('#word-list').append($(wordListHtml));
        $('#sentence-list').append(sentenceListHtml);
        $('.underscore').text(underscoreString);
        
        if(($('#reading-board').height() > $('#activity-board').height()) ) {
            if($('#activity-board').height() > 500) {
                var maxHeight = $('#activity-board').height();
                $('#reading-container').height(maxHeight);
                $('#activity-board').height(maxHeight);
            } else {
                $('#reading-container').height(500);
                $('#activity-board').height(500);
            }    
            
            $('#sentence-list').height($('#activity-board').height()-$('#submitDiv').height()-$('#word-list').height()-$('#activity-guide').height()-120);
        } else {
            $('#reading-container').height($('#activity-board').height());
        }
        
        $('#reading-container').ucanJScrollPane('#reading-board');
        
        $("#word-list span").draggable({
            revert:"invalid",
            helper: "clone"
        });
	
        $("#sentences li").droppable({
            accept: "#word-list span, #sentences li span ",
            over: function(event, ui){
                $(this).find('.underscore').addClass('blank-over');
            },
            out: function(event, ui){
                $(this).find('.underscore').removeClass('blank-over');
            },
            drop: function( event, ui ) {
                $(this).find('.underscore').removeClass('blank-over');
                playSound(Ucan.Resource.Audio.getClickedSound());
                if (ui.draggable.parent().hasClass("blank") && $(this).children().hasClass("blank")){
                    ui.draggable.parent().append($(this).children('.blank').children('span'));
                    $(this).children('.blank').append(ui.draggable);	
                }
			
                if (!(ui.draggable.parent().hasClass("blank")) && $(this).children().hasClass("blank")){
                    if ($(this).children('.blank').children().hasClass("word")) {
                        ui.draggable.parent().append($(this).children('.blank').children('span'));
                    }
                    $(this).children('.blank').children('span').remove();
                    $(this).children('.blank').append(ui.draggable); 
                }

            }
        });
        $("#word-list").droppable({
            accept: "#sentences li span",
            drop: function( event, ui ) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                ui.draggable.parent().append('<span>' + underscoreString + '</span>');
                $( this ).append(' ').append(ui.draggable);
            }
        });
        
        $('#reading-board').html();
        
    }
    //display activity html
    displayActivity();
    
    // View answers
    $("#show-answer").click(function() {
        var j = 0;
        $(".sentence .blank").each(function() {
            iconPos = "#content" + j;
            $(this).children().text(answers[j]).switchClass('underscore','word');
            j++;
        });
        
        $('.blank').fadeOut(500).fadeIn(500);
    });
    
    //get Result
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        canPlay = false;
        $('.ui-draggable').draggable("disable");
        
        numberOfTrueAnswers = 0;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        var j = 0;
        $(".sentence .blank").each(function() {
            iconPos = "#content" + j;
            if ($(this).children().text() == answers[j].toLowerCase()){	
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, iconPos);
            } else {
                insertTrueFalseIconAfter(false, iconPos);
            }
            j++;
        });
        
        // Nhấp nháy icon đúng sai
        $(".true-icon").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        $(".false-icon").fadeOut(500).fadeIn(500);
		
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

        // Hiện ra bảng result
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
            $("#word-list").html("");
            $("#sentence-list").html("");
            displayActivity(); 
        });
    });
});