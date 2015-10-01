$(document).ready(function() {
    var canPlay = true;
    var canClickRedo = false;
	
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
        
    function displayActivity() {
        answers = []; //array of true answers
        shuffed_answers = [];
        var wordListHtml = ""; //to display given words
        paragraph = activityContent.paragraph;	
        var paragraphHtml = ucanMarkupToHtml(paragraph);	
        var pattern = /\[([^\]])+\]/g; //regular expression to get strings in [] bracket
        answers = paragraphHtml.match(pattern);
        getReplaceUnderscoreString(answers);
        shuffed_answers = paragraphHtml.match(pattern);
        shuffed_answers = shuffle(shuffed_answers);
        paragraphHtml = paragraphHtml.replace(pattern, '<span class="blank"><span>' + underscoreString + '</span></span>');
    
        //display paragraph with blank
        $('#paragraph-container').append(Ucan.Function.HTML.editMediaUrl(paragraphHtml));
	
        for (i=0;i<answers.length;i++){
            wordListHtml += '<span class="word">' + shuffed_answers[i].substring(1,shuffed_answers[i].length - 1).toLowerCase() + '</span> ';
        }
        $('#word-list').append($(wordListHtml));
        $(".text:first").focus();
	
        $("#word-list span").draggable({
            revert:"invalid",
            helper: "clone"
        });
        
        $("#paragraph-container .blank").droppable({
            accept: "#word-list span, #paragraph-container .word ",
            over: function(event, ui){
                $(this).addClass('blank-over');
            },
            out: function(event, ui){
                $(this).removeClass('blank-over');
            },
            drop: function( event, ui ) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).removeClass('blank-over');
                if (ui.draggable.parent().hasClass("blank") && $(this).hasClass("blank")){
                    ui.draggable.parent().append($(this).children());
                    $(this).append((ui.draggable).css({
                        'color':'#f5770f'
                    }));	
                }
			
                if (!(ui.draggable.parent().hasClass("blank")) && $(this).hasClass("blank")){
                    if ($(this).children().hasClass("word")) {
                        ui.draggable.parent().append($(this).children().css({
                            'color':'black'
                        }));
                    }
                    $(this).children().remove();
                    $(this).append((ui.draggable).css({
                        'color':'#f5770f'
                    })); 
                }
			
                $(this).fadeOut(200).fadeIn(500);
            }
        });
        
        $("#word-list").droppable({
            accept: "#paragraph-container .word",
            
            drop: function( event, ui ) {
                playSound(Ucan.Resource.Audio.getClickedSound())
                ui.draggable.parent().append('<span>' + underscoreString + '</span>');
                $(this).append(' ').append((ui.draggable).css({
                    'color':'black'
                }));
            }
        });
    }
    
    var answers = []; //array of true answers
    var underscoreString;
    var shuffed_answers = [];
    displayActivity();
	
    // View answers
    $("#show-answer").click(function() {
        var j = 0;
        $("#paragraph-container .blank").each(function() {
            var ans = answers[j].substring(1,answers[j].length - 1);
            $(this).text(htmlEncode(ans)).css({
                'color': '#f5770f',
                'font-weight':'bold'
            });
            j++;
        });
        $("#paragraph-container .blank").fadeOut(500).fadeIn(500);
    });
        
    var numberOfTrueAnswers = 0;
    //get Result
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        canPlay = false;
        $('.ui-draggable').draggable("disable");
        $('.cp-jplayer').jPlayer("stop");
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0;
        var j = 0;
        $("#paragraph-container .blank").each(function() {
            if (compareTwoString(htmlEncode($(this).children().text()), htmlEncode(answers[j].substring(1,answers[j].length - 1)))) {
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, this);
            } else {
                insertTrueFalseIconAfter(false, this);
            }
            j++;
        });
        $('.true-icon').css({
            "margin":"-10px 5px 0px 1px",
            "box-shadow":"none",
            "border":"none",
            'width':'18px',
            'height':'18px'
        });
        $('.false-icon').css({
            "margin":"-5px 5px 0px 1px",
            "box-shadow":"none",
            "border":"none",
            'width':'18px',
            'height':'18px'
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
            $("#paragraph-container").html("");
            $("#word-list").html("");
            canPlay = true;
            displayActivity();
        });
    });
});