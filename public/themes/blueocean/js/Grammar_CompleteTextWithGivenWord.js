var stophover = false;
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
        var paragraphHtml = paragraph;
        var pattern = /\[([^\]])+\]/g; //regular expression to get strings in [] bracket
        answers = paragraphHtml.match(pattern);
        getReplaceUnderscoreString(answers);
        shuffed_answers = paragraphHtml.match(pattern);
        shuffed_answers = shuffle(shuffed_answers);
        paragraphHtml = paragraphHtml.replace(pattern, '<span class="blank"><span class="underscore">' + underscoreString + '</span></span>');
    
        //display paragraph with blank
        $('#paragraph-container').append(Ucan.Function.HTML.editMediaUrl(paragraphHtml));
	
        for (i=0;i<answers.length;i++){
            wordListHtml += '<span class="word">' + shuffed_answers[i].substring(1,shuffed_answers[i].length - 1).toLowerCase() + '</span> ';
        }
        $('#word-list').append($(wordListHtml));        
        $("#word-list span").draggable({
            revert:"invalid",
            helper: "clone",
            start: function(event,ui){
                if (ui.helper.parent().hasClass("blank")){
                    $('#draggable-holder').css('top',$('#paragraph-container .jspPane').css('top'));
                    $('#draggable-holder').append(ui.helper);
                }
                stophover = true;
            },
            stop: function(event,ui){
                stophover = false;
            }
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
                // keo tu o trong vao o trong	
                if (ui.draggable.parent().hasClass("blank") && $(this).hasClass("blank")){
                    ui.draggable.parent().append($(this).children());
                    $(this).append((ui.draggable).css({
                        'color':'#f5770f'
                    }));	
                }
                // keo tu list vao o trong	
                if (!(ui.draggable.parent().hasClass("blank")) && $(this).hasClass("blank")){
                    if ($(this).children().hasClass("word")) {
                        ui.draggable.parent().append($(this).children().css('color',''));
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
                ui.draggable.parent().append('<span class="underscore">' + underscoreString + '</span>');
                $(this).append(' ').append((ui.draggable).css({
                    'color':''
                }));
            }
        });
    }
    
    var answers = []; //array of true answers
    var underscoreString;
    var shuffed_answers = [];
    displayActivity();
    if ($('#paragraph-container').height() > 400) {
        $('#paragraph-container').height(400);
        $('#paragraph-container').ucanJScrollPane('#paragraph-wrapper');
    }
    // View answers
    $("#show-answer").click(function() {
        var j = 0;
        $("#paragraph-container .blank").each(function() {
            var ans = htmlEncode(answers[j]);
            var ans = ans.substring(1,ans.length - 1);
            $(this).text(ans).css({
                'color':'#f5770f', 
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
        
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0;
        var j = 0;
        $("#paragraph-container .blank").each(function() {    
            var ans = htmlEncode(answers[j]);
            if ($(this).children().text() ==  ans.substring(1,ans.length - 1).toLowerCase()) {
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, this);
            } else {
                insertTrueFalseIconAfter(false, this);
            }
            j++;
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
            $("#paragraph-wrapper").html("<div id='draggable-holder'></div><div id='paragraph-container'></div>");
            $("#word-list").html("");
            displayActivity();       
            var stophover = false;
            if ($('#paragraph-container').height() > 400) {
                $('#paragraph-container').height(400);
                $('#paragraph-container').ucanJScrollPane('#paragraph-wrapper')
            }         
        });
    });
});