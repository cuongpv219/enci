function editGUI(){
    if($('#activity-board').height() > $('#reading-board').height()) {
        $('#activity-board').css({
            'border-left':'solid 1px #f2f2f2'
        });
        $('#reading-board').css('border-right','none');
        $('#reading-board').height($('#activity-board').height());
    }
    else{
        if ($('#activity-board').height() < 450) {
            if($('#reading-board').height()>460 ) {
                $('#reading-board').height(460);
            }
        }
        else {
            $('#reading-board').height($('#activity-board').height() + 30);
        }
        $('#activity-board').css('border-left','none');
    }
    $('#reading-board').ucanJScrollPane('#reading-board');
}

$(document).ready(function() {
    var canPlay = true;
    var pattern = /\[(.*?)\]/g; //regular expression
    var sentences =   [];
    sentences = activityContent.reading.match(pattern);
    shuffle(sentences);
    var mainBoardHtml = $('#main-board').html();
    
    function displayActivity() {        
        answers = []; //array of true answers
        shuffed_answers = [];
        var wordListHtml = ""; //to display given words
        paragraph = activityContent.reading;	
        var paragraphHtml = paragraph;
        var pattern = /\[([^\]])+\]/g; //regular expression to get strings in [] bracket
        answers = paragraphHtml.match(pattern);
        underscoreString = '_______________';
        shuffed_answers = paragraphHtml.match(pattern);
        shuffed_answers = shuffle(shuffed_answers);
        paragraphHtml = paragraphHtml.replace(pattern, '<span class="blank"><span class="underscore">' + underscoreString + '</span></span>');
        $('#reading-board').append(Ucan.Function.HTML.editMediaUrl(paragraphHtml));
	
        for (i=0;i<answers.length;i++){
            wordListHtml += '<div class="sentence-container sentence-container-unselect" data-index="' + i + '"><div class="represent-number">' + (i + 1) + '</div><div class="sentence">' + shuffed_answers[i].substring(1,shuffed_answers[i].length - 1) + '</div></div> ';
        }
        $('#activity-board').append($(wordListHtml));          
        editGUI();
        
        $("#activity-board .sentence-container").draggable({
            helper: "clone",
            start: function(event,ui){
                var text = ui.helper.children('.sentence').text();
                var number = ui.helper.children('.represent-number').text();
                ui.helper.text(number + '.' + getFirstWords(text)).switchClass('sentence-container','sentence-container-dragging');
                $(this).data('draggable').offset.click.top = 15;
                $(this).data('draggable').offset.click.left = 75;
            }
        });
        
        $("#reading-board .blank").droppable({
            accept: "#activity-board .sentence-container, #reading-board .drop-sentence",
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
                    $(this).append((ui.draggable));
                }
                // keo tu list vao o trong	
                if (!(ui.draggable.parent().hasClass("blank")) && $(this).hasClass("blank")){
                    if ($(this).children().hasClass("drop-sentence")) {
                        $('.sentence-container[data-index="' + $(this).children('.drop-sentence').attr('data-index') + '"]').draggable('enable').switchClass('sentence-container-select','sentence-container-unselect');
                    }
                    $(this).html('<span class="drop-sentence" data-index="' + ui.draggable.attr('data-index') + '">' + ui.draggable.children('.sentence').text() + '</span>'); 
                    $(this).children('.drop-sentence').draggable({
                        helper: "clone",
                        start: function(event,ui){
                            var text = ui.helper.text();
                            var number = parseInt(ui.helper.attr('data-index')) + 1;
                            ui.helper.text(number + '.' + getFirstWords(text)).switchClass('drop-sentence','drop-sentence-dragging');
                            $(this).data('draggable').offset.click.top = 20;
                            $(this).data('draggable').offset.click.left = 75;
                            $('#draggable-holder').css('top',$('#reading-board .jspPane').css('top'));
                            $('#draggable-holder').append(ui.helper);
                        }
                    });
                    ui.draggable.draggable('disable').switchClass('sentence-container-unselect','sentence-container-select');
                }
			
                $(this).fadeOut(200).fadeIn(500);
            }
        });
        
        $('#activity-board').droppable({
            accept: "#reading-board .drop-sentence",
            drop: function( event, ui ) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $('.sentence-container[data-index="' + ui.draggable.attr('data-index') + '"]').draggable('enable').switchClass('sentence-container-select','sentence-container-unselect');
                ui.draggable.parent().html('<span class="underscore">' + underscoreString + '</span>');
            }
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
            $("#reading-board .blank").each(function() {    
                var ans = htmlEncode(answers[j]);
                if ($(this).children().text() ==  ans.substring(1,ans.length - 1)) {
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
    }
    displayActivity();
    
    // View answers
    $("#show-answer").click(function() {
        var j = 0;
        $("#reading-board .blank").each(function() {
            var ans = htmlEncode(answers[j]);
            var ans = ans.substring(1,ans.length - 1);
            $(this).html('<span class="drop-sentence">' + ans + '</span>');
            j++;
        });
        $("#reading-board .blank").fadeOut(500).fadeIn(500);
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
            $('#main-board').html(mainBoardHtml);
            displayActivity();                            
        });
    });
    
});

function getFirstWords(str){
    var pos = str.indexOf(' ',20);
    if (pos > -1) {
        return (str.substring(0,pos) + '...');
    } else {
        return str
    }
}