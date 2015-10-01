$(document).ready(function() {
    var canPlay = true;
    var canClickRedo = false;

    //split Sentences into answers and sentences with blank
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
        maxLength = maxLength<5?5:maxLength;
        underscoreString = ''; 
        for (var j = 0; j < maxLength; j++){
            underscoreString += '_';
        }
    }

    var count = activityContent.group.length; //number of sentences
    var underscoreString;
    var answers = []; //array of true answers
    var shuffed_answers = [];

    function displayActivity() {
        count = activityContent.group.length; //number of sentences
        var wordListHtml = ""; //to display given words
        var sentenceListHtml = '<ul id="sentences">'; // to display sentences needing to fill in the blank
        var sentences = []; //array of sentences
        answers = []; //array of learner's answers
        shuffed_answers = [];
        var order = 0;
        for(i=0;i<count;i++){ 
            sentences[i] = activityContent.group[i].sentence;
            var subsentence = splitString(sentences[i]);
            if (subsentence != false){	
                order++;
                sentenceListHtml += '<li class="sentence">' + order + '. ' + subsentence[1] + 
                '<span class="blank" id="content' + i + '"><span class="underscore"></span></span> ' 
                + subsentence[2] + '</li>';
                var tempArr = subsentence[0].split('/');
                for(var k=0;k<tempArr.length;k++) {
                    answers.push(tempArr[k]);
                    shuffed_answers.push(tempArr[k])
                }
            }else{
                answers[i] = '';
                shuffed_answers[i] = '';
            }
        }
        getReplaceUnderscoreString(answers);
        sentenceListHtml += '</ul>';
        shuffed_answers = shuffle(shuffed_answers);
        for (i=0;i<shuffed_answers.length;i++){
            wordListHtml += '<span class="word">' + shuffed_answers[i] + '</span> ';
        }
        //display given words and sentences with blank
        $('#word-list').append($(wordListHtml));
        $('#sentence-list').append($(sentenceListHtml));
        $('.underscore').text(underscoreString);
        $("#word-list span").draggable({
            revert:"invalid",
            helper: "clone"
        });
	
        $(".blank").droppable({
            accept: "#word-list span, #sentences li span ",
            over: function(event, ui){
                $(this).addClass('blank-over');
            },
            out: function(event, ui){
                $(this).removeClass('blank-over');
            },
            drop: function( event, ui ) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).removeClass('blank-over');
                if (ui.draggable.parent().hasClass("blank")){
                    ui.draggable.parent().append($(this).children('span'));
                    $(this).append(ui.draggable);	
                }
			
                if (!ui.draggable.parent().hasClass("blank")){
                    if ($(this).children().hasClass("word")) {
                        ui.draggable.parent().append($(this).children('span'));
                    }
                    $(this).children('span').remove();
                    $(this).append(ui.draggable); 
                }

            }
        });
        
        $("#word-list").droppable({
            accept: "#sentences li span",
            drop: function( event, ui ) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                ui.draggable.parent().append('<span class="underscore">' + underscoreString + '</span>');
                $( this ).append(' ').append(ui.draggable);
            }
        });
    }
    //display activity html
    displayActivity();
    
    // View answers
    $("#show-answer").click(function() {
        var j = 0;
        $(".sentence .blank").each(function() {
            iconPos = "#content" + j;
            $(this).html('<span class="word">' + answers[j] + '</span>');
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
            var sentences = [];
            var subsentence = [];
            iconPos = "#content" + j;
            sentences[j] = activityContent.group[j].sentence;
            subsentence = splitString(sentences[j]);
            var tempArray = subsentence[0].split('/');
            var ittrue = 0;
            for(k=0;k<tempArray.length;k++) {
                if ($(this).children().text() == tempArray[k]){	
                    ittrue = 1;
                }
            }
            if(ittrue==1) {
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, iconPos);
            } else {
                insertTrueFalseIconAfter(false, iconPos);
            }
            j++;
        });
        
        // Nh?p nháy icon dúng sai
        $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
		
        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
        score = Math.floor((numberOfTrueAnswers / count) * 100);
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
            $("#word-list").html("");
            $("#sentence-list").html("");
            displayActivity();
        });
    });
});