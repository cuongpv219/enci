var canPlay = true;
//var canClickRedo = false;
var count;
var unShowClickResult = 0;
var answers = [];
var score;
$(document).ready(function() {
    var numViewedPage = 0 ;
    //trim [#] from a word
    function normalizedWord(word){
        if ( isAnswer(word) == false) return word;
        else return word.substring(1);
    }
    //return true answer from string exacted from xml
    function trueAnswer(words){
        choice = words.split("||");
        for (i = 0; i < choice.length; i++){
            if (isAnswer(choice[i])) return choice[i];
        }
        return false;
    }
   
    var html = "";
    count = activityContent.question.length;	//number of questions
    
    function displayActivity(){
        html = "";
        for(var i = 0; i < count; i++) {
            $("#question-link").append('<div id="question_'+ i + '" data-order="' + i + '" class="inactive-button unselected ">'+ (i + 1) + '<img class="false" src="'+baseUrl +'/themes/blueocean/img/tab-false-icon.png'+'">'+'</img>'+'<img class="true" src="'+baseUrl +'/themes/blueocean/img/tab-true-icon.png'+'">'+'</img>' +' </div>');
        }
	
        //return i-th question and choices
        function getQuestion(i){
            var question = "";
            question += '<div id="question-container_'+i+'" class="question_container">';
            var questiontmp = activityContent.question[i].ask.split('[]');
            if (questiontmp[1] != undefined) {
                question += '<p class="ask-container">' + questiontmp[0]+'<span class="blank"> _______ </span>' +questiontmp[1]+ '</p>'
            }
            else {
                question += '<p class="ask-container">' + (i+1) + '. ' + activityContent.question[i].ask + '<span id="true-false-icon_'+ i +'"></span></p>';
            }
            var choices = activityContent.question[i].choice.split("||");
            for (j=0; j< choices.length; j++){
                question += '<div class="choice-container" id="choice-container_' + i + "_" + j + '" value="0" >';
                question += '<div id="check_' + i +'_'+ j +'" class="choice global-choice-square-2" value="0"></div>';
                question += '<label for="radio_' + i + '_' + j +'" >' + normalizedWord(choices[j]) + '</label>';
                question += '</div>';
			
                if (isAnswer(choices[j])){
                    answers[i] = j;
                }
            }
            question += '</div>';
            return question;
        }
	
        //display question matching with question-link
        $('#question-link div').each(function(){		
            id = $(this).attr('id').substring(9);
            question = getQuestion(parseInt(id));
            $("#questions").append(question);
        });
        $('#question-container_0').show();
        $('#question-link #question_0').addClass('question-link-div');
        //init next-link and prev-link
        var order_of_question = 0;
        canPlay = true;
        console.log(activityContent);
        function editGUI() {
            var maxHeight = 500;
            if(activityContent.pagination != null ) {
                if(activityContent.pagination !=1) { 
                    maxHeight = Math.max(500,$('#activity-board').height());
                }
            }
            else {
                maxHeight = Math.max(500,$('#activity-board').height());
            }
            $('#activity-board').height(maxHeight);
            $('#reading-board ').height(maxHeight + 20);
            $('#reading-container').height(maxHeight + 20);
            $('#questions').height(maxHeight-106);
        }
        editGUI();
        $('#question-link div').click(function(){
            moveToTab($(this).attr('data-order'));
            id = $(this).attr('data-order');
            question = getQuestion(parseInt(id));
            $("#questions > div").hide();
            $('#question-container_' + id).show();
            order_of_question = id;
            $(this).addClass('question-link-div');
        });
	
        //next-link click function
        $('#next-link').click(function(){
            if(order_of_question < count-1){
                order_of_question++;
                moveToTab(order_of_question);
            }
            question = getQuestion(parseInt(order_of_question));
            $("#questions > div").hide();
            $('#question-container_' + order_of_question).show();
            $('#question-link #question_' + order_of_question).addClass('question-link-div');
        });
	
        //prev-link click function
        $('#prev-link').click(function(){
            if(order_of_question > 0){
                order_of_question--;
                moveToTab(order_of_question);
            }
            question = getQuestion(parseInt(order_of_question));
            $("#questions > div").hide();
            $('#question-container_' + order_of_question).show();
            $('#question-link #question_' + order_of_question).addClass('question-link-div');
        });
       
        //Event Click 
        $('.choice-container').click(function(){
            if (!canPlay) {
                return;
            }
            playSound(Ucan.Resource.Audio.getClickedSound());
            // Thay doi gia tri cua cac check box cung cap
            $(this).siblings('.choice-container').attr('value','0');
            $(this).siblings('.ask-container').find('.blank').html($(this).text()+ ' ').addClass('checked-blank');
            $(this).siblings('.choice-container').css({
                'color':'black'
            });
            $(this).siblings('.choice-container').children('.choice').removeClass('checked');
            // Thay doi gia tri cua check box hien tai
            $(this).attr('value','1');
            $(this).css({
                'color':'#fc7c00'
            });
            $(this).children('.choice').addClass('checked');
        }); 
        if(activityContent.pagination == null) {
            $('#question-link').hide();
            $('#questions').css({
                'margin-top':'40px'
            });
            $("#questions > div").show();
            $('#prev-link').hide();
            $('#next-link').hide();
            $('#loadResult').css({
                'margin':'0 auto',
                'float':'none'
            });
            setTimeout(function(){ 
                editGUI();
            },500)
        }
        else {
            if(activityContent.pagination != 1) {
                $('#question-link').hide();
                $("#questions > div").show();
                $('#prev-link').hide();
                $('#next-link').hide();
                $('#loadResult').css({
                    'margin':'0 auto',
                    'float':'none'
                });
            
                setTimeout(function(){ 
                    editGUI();
                },500);
            }
            else {
                $("#questions > div").hide();
                $('#question-container_' + 0).show();
                moveToTab(0);
            }
        }
    }
    displayActivity();
    
    function moveToTab(index){
        $('.global-tab-container').ucanMoveToTab(index);
        numViewedPage++;
    }
    
    $('#reading-container').ucanJScrollPane('#reading-board');
   
    var numberOfTrueAnswers = 0;
    
    //get Result
    $("#loadResult").click(function(){
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) && (count > 1)){
            unShowClickResult++;
            if(unShowClickResult == 1){
                $('.overlay-black').show();
                $('#multipage-confirm-dialog').fadeIn(500);
            }
        }
        else{
            loadResult();
        }
    });
	
    // redo
    $("#redo").click(function() {
        unShowClickResult = 0;
        numViewedPage = 0;
        numberOfTrueAnswers = 0;
        canPlay = true;
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            $("#questions").html('');
            $("#question-link").html('');
            displayActivity();
        })
    });
    //     
    // View answers
    $("#show-answer").click(function() {
        playSound(Ucan.Resource.Audio.getShowResultSound());
        $('.choice').attr('value','0');
        $('.choice').children().remove();
        $('.choice-container').children('label').css({
            'color':'black'
        });
        $('.choice').removeClass('checked');
        for(var j=0; j< count; j++){
            var rightChoice = $('#choice-container_' + j + '_' + answers[j]);
            $(rightChoice).attr("value","0");
            $(rightChoice).children('.choice').addClass('checked').fadeOut(500).fadeIn(500);
            $(rightChoice).children('label').css({
                'color':'black'
            });
            $(rightChoice).siblings('.ask-container').find('.blank').html($(rightChoice).text()+' ').addClass('checked-blank');
        }
    });
//
    
});

//check if a word contains [#]
function isAnswer(word){
    if ( word.indexOf("#") == 0) return true;
    else return false;
}
function loadResult(){
    if (!canPlay) return;
    canPlay = false;
    numberOfTrueAnswers = 0;
    playSound(Ucan.Resource.Audio.getShowResultSound());
    for (var i=0; i<count; i++) {
        var choices = activityContent.question[i].choice.split("||");
        var inputValue = -1;
        for(var j=0;j<choices.length;j++){
            inputValue = ($('#choice-container_' + i + '_' + j).attr("value") == "1")?j:inputValue;
        }
        if(inputValue != -1) {
            if (isAnswer(choices[inputValue])) {
                numberOfTrueAnswers++;
                if(activityContent.pagination==1) {
                    $('#question_'+i).children('.true').show();
                    $('#question_'+i).children('.true').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
                }
                else {
                    insertTrueFalseIcon(true,"#true-false-icon_" + i);
                }
            }
            else {
                if(activityContent.pagination==1) { 
                    $('#question_'+i).children('.false').show();
                    $('#question_'+i).children('.false').fadeOut(500).fadeIn(500);
                }
                else {
                    insertTrueFalseIcon(false,"#true-false-icon_" + i);
                }
            }
        }           
        else {
            if (activityContent.pagination==1) {
                $('#question_'+i).children('.false').show();
                $('#question_'+i).children('.false').fadeOut(500).fadeIn(500);
            }
            else {
                insertTrueFalseIcon(false,"#true-false-icon_" + i);
            }
        }                   
    }
    if(activityContent.pagination != 1) {
        $('.true-icon').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        $('.false-icon').fadeIn(500).fadeOut(500).fadeIn(500);
    }
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
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
}
