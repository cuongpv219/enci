var choices = [];
var answers = [];
var canPlay = true;
var count = activityContent.question.length;
var unShowClickResult = 0;
var score;
var pageNumber = 1;
for(i=0;i<count;i++) {
    if (pageNumber < activityContent.question[i].page) {
        pageNumber = activityContent.question[i].page;
    }
}
var listpage = [];
$(document).ready(function() {
    var numViewedPage = 0 ;
    //check a word contain [#] or not
    var curTabIndex =0;
    function normalizedChoice(choice){
        var retStr = $.trim(choice);
        if (retStr.indexOf("#") == 0 ){
            return retStr.substring(1); 
        } else return retStr; 			
    }
    function moveToTab(index) {
        curTabIndex = parseInt(index);
        $('.global-tab-container').ucanMoveToTab(index);
        inactiveAllTabAndButton();
        activeTabAndButton(index);
        numViewedPage++;
        
    }
    function activeTabAndButton(index) {
        if (activityContent.page != undefined) {
            if(activityContent.page[index] != undefined) 
            {
                if(activityContent.page[index].picture != undefined)  {
                    $('.questions').addClass('havepicture').removeClass('nopicture');
                    $('#picture_'+index).show();
                    $('#picture-container').css({
                        'padding':'20px'
                    });
                }
                else {
                    $('.questions').addClass('nopicture').removeClass('havepicture');  
                    $('#picture-container').css({
                        'padding':'0px'
                    });
                } 
            }
            else {
                $('.questions').addClass('nopicture').removeClass('havepicture');        
                $('#picture-container').css({
                    'padding':'0px'
                });
            }
        }
        else {
            $('.questions').addClass('nopicture').removeClass('havepicture');        
            $('#picture-container').css({
                'padding':'0px'
            });
        }
        if (index == 0) {
            for (var i = 0; i < count;i++) {
                if ((parseInt(activityContent.question[i].page) == (index+1))||(activityContent.question[i].page == undefined)) {
                    $('#question-container_'+i).show();
                }
            }
        }
        else {
            for (i=0; i<count; i++)  {
                if (parseInt(activityContent.question[i].page) == (index+1)) {
                    $('#question-container_'+i).show();
                }
            }
        }
    }
    function inactiveAllTabAndButton() {
        $('.question-container').hide();
        $('.picture').hide();
    }
    function orderQuestion() {
        var order = 0;
        for (var i=0; i<pageNumber; i++) {
            for (var j=0;j<count; j++) {
                if(activityContent.question[j].page == undefined) {
                    if (i==0) {
                        $('#question-container_'+j +' .order-question').append(++order+'. ');
                    }
                }
                else {
                    if(activityContent.question[j].page==(i+1)) {
                        $('#question-container_'+j +' .order-question').append(++order+'. ');
                    }
                }
            }
        }
    }
    function displayActivity(){
        var html = "";
        canPlay = true;
        choices = [];
        answers = [];
        var pictureHtml ="";
        for (i=0; i<pageNumber; i++) {
            if(activityContent.page != undefined)
                if(activityContent.page[i] != undefined) 
                {
                    if(activityContent.page[i].picture != undefined) {
                        pictureHtml += '<img id="picture_'+i+'" class="picture" src='+resourceUrl+activityContent.page[i].picture+'>' ;
                    }
                }
        }
        $('#picture-container').append(pictureHtml);
        for(var i = 0; i < count; i++){
            if(activityContent.question[i].page != undefined) {
                if(jQuery.inArray(parseInt(activityContent.question[i].page),listpage) == -1){
                    listpage.push(parseInt(activityContent.question[i].page))
                }
            }
            html += '<div class="question-container" id="question-container_'+i+'"><div id="explain_'+i+'" class="explaination"></div><img class="triangle" src="' + baseUrl + '/themes/blueocean/img/triangle.png'+'"/><span class="ask-container">';
            var question_tmp = ''; 
            //tao blank 		
            question_tmp = activityContent.question[i].ask.split("[]");
            if(question_tmp[1] != undefined)
            {
                html +='<span class="order-question"></span>' + question_tmp[0] + '<span class="blank">_______ </span>' + question_tmp[1] + '<span class="order-char"></span><span id="true-false-icon_' + i + '"></span></span>';
            }
            else {
                html += '<span class="order-question"></span>' + question_tmp[0] +  '<span class="order-char"></span><span id="true-false-icon_' + i + '"></span></span>';
            }
            choices[i] = activityContent.question[i].choice.split("||");
            for (j=0; j< choices[i].length; j++){
                html += '<div class="choice-container" id="choice-container_' + i + "_" + j + '" value="0">';
                html += '<div id="check_' + i +'_'+ j +'" class="choice global-choice-square" value="0"></div>';
                html += '<span class="radio-label">' + normalizedChoice(choices[i][j]).split("--")[0] + '</span></div>';
                if (isAnswer(choices[i][j])){
                    answers[i] = j;
                }
            }
            html += '</div>';
        }
        var questionHtml ='';
        for (i = 0; i < listpage.length; i++) {
            questionHtml +='<div id="sentence-button_' + i + '" data-order="'+ i +'" class="inactive-button unselected">' + (i + 1) + '</div>'
        }
        $('#question-link').append(questionHtml);
        if(listpage.length<2) {
            $('#question-link').hide();
            $('#loadResult').css({
                'margin-right':'420px'
            })
        }
        else {
            $('#next-link').show();
            $('#prev-link').show();
            $('#question-link').show();
        }
        $(".questions").append(html); //display content
        $('.inactive-button').click(function() {
            moveToTab(parseInt($(this).attr('data-order')));
        })
        $('.choice-container').click(function()  {
            if (!canPlay) return;
            playSound(Ucan.Resource.Audio.getClickedSound());
            // Thay doi gia tri cua cac check box cung cap
            $(this).siblings('.choice-container').attr('value','0');
            $(this).siblings('.choice-container').children('.choice').removeClass('checked');
            // Thay doi gia tri cua check box hien tai
            $(this).attr('value','1');
            $(this).children('.choice').addClass('checked');
            // Cap nhat lua chon vao o trong
            $(this).parent().children().eq(2).find('.blank').html($(this).text()).addClass('checked-blank');
        } );
        moveToTab(0);
        $('#next-link').click(function(){
            if (curTabIndex < listpage.length-1){
                moveToTab(curTabIndex + 1) ;
            }
        });
        $('#prev-link').click(function(){
            if(curTabIndex > 0) {
                moveToTab(curTabIndex - 1 );
            }
        });
    }
   
    displayActivity();
    orderQuestion();
    //get Result
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function(){
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) && (listpage.length > 1)){
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
    
    $("#redo").click(function() {
        unShowClickResult = 0;
        numViewedPage = 0;
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
        
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay =  true;
            $('.questions').html('');
            $('#question-link').html('');
            displayActivity();
        });
    });
    
    $("#show-answer").click(function() {
        $('.choice').attr('value','0');
        $('.choice').removeClass('checked');
        for(j=0; j< count; j++){
            var rightChoice = $('#choice-container_' + j + '_' + answers[j]);
            $(rightChoice).attr("value","0");
            $(rightChoice).children('.choice').addClass('checked');
            $(rightChoice).parent().find('.blank').html($(rightChoice).text()).addClass('checked-blank');
        }
        $('.checked').fadeOut(500).fadeIn(500);
    });
});

function isAnswer(word){
    if ($.trim(word).indexOf("#") == 0) return true;
    else return false;
}

function loadResult(){
    if (!canPlay) return;
    canPlay = false;
    numberOfTrueAnswers = 0;
    playSound(Ucan.Resource.Audio.getShowResultSound());
    numberOfTrueAnswers = 0;
    var answers = [];
    var choices = [];
    for (var i=0; i<count;i ++) {
        choices[i] = activityContent.question[i].choice.split("||");
        for(var k= 0; k<choices[i].length; k++)
        {
            if (isAnswer(choices[i][k])){
                answers[i] = k;
            }
        }
    }
    for(var j=0; j< count; j++){
            
        if ($('#choice-container_' + j + '_' + answers[j]).attr('value') == '1'){
            numberOfTrueAnswers++;
            insertTrueFalseIconAfter(true, "#true-false-icon_" + j);
        }
        else {
            insertTrueFalseIconAfter(false, "#true-false-icon_" + j);
        }
        for ( k=0; k<choices[j].length;k++) {
            if($('#choice-container_'+j+'_'+k).attr('value') == '1') {
                if(choices[j][k].split("--")[1] != undefined) {
                    $('#explain_'+j).html(choices[j][k].split("--")[1]).show();
                    if($('#question-container_'+j).height() < ($('#explain_'+j).height()+40))
                        $('#question-container_'+j).height($('#explain_'+j).height()+40);
                    $('#explain_'+j).siblings('.triangle').show();
                }   
            }
        }
    }
            
    // Nhấp nháy icon đúng sai.
    $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
		
    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
    score = Math.floor((numberOfTrueAnswers / count) * 100);
    $("#score-text").text(score);
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
    canClickRedo = true;
}