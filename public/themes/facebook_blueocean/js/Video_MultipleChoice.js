var choices = [];
var answers = [];
var canPlay = true;
var canClickRedo = false;
var unShowClickResult = 0;
var count;
var curTabIndex ;
var pageNumber
$(document).ready(function(){
    var numViewedPage = 0 ;
    count = activityContent.question.length;	//number of questions
    pageNumber = 1;
    for(var i=0 ;i<count; i++) {
        if(activityContent.question[i].page != undefined) {
            if(activityContent.question[i].page > pageNumber) {
                pageNumber = activityContent.question[i].page;
            }
        }
    }
    curTabIndex = 0;
    //check a word contain [#] or not
    function isAnswer(word){
        if (word.indexOf("#") == 0) {
            return true;
        } else {
            return false;
        }
    }
    
    //normalize a word ( cut off [#] if necessary)
    function normalizedWord(word){
        if ( isAnswer(word) == false) {
            //alert('aaa');
            return word;
        } else { 
            //alert('bbb');
            return word.substring(1)
        };
    }
    function moveToTab(index) {
        curTabIndex = parseInt(index);
        $('.global-tab-container').ucanMoveToTab(index);
        inactiveAllTabAndButton();
        activeTabAndButton(index);
        numViewedPage++;
    }
    function inactiveAllTabAndButton() {
        $('.question-container').hide();
    }
    function activeTabAndButton(index){
        for(var i=0; i<count;i++){
            if(activityContent.question[i].page == undefined) {
                if (index==0) {
                    $('#question-container_'+i).show();
                }
            }
            else if((parseInt(activityContent.question[i].page)-1) == index) {
                $('#question-container_'+i).show();
            }
        }
    }
    function insertOrder() {
        var orderChar = 0;
        for(var i=0; i<pageNumber;i++) {
            for (var k=0; k<count; k++) {
                if(activityContent.question[k].page == undefined) {
                    if(i==0) {
                        $('#question-container_'+k +' .order-char').html((++orderChar)+'.');
                    }
                }
                else {
                    if ((parseInt(i)+1)==activityContent.question[k].page) {
                        $('#question-container_'+k +' .order-char').html((++orderChar)+'.');
                    }   
                }
            }
        }
    }
    function displayActivity() {
        var html = "";
        var buttonHtml ='';
        canPlay = true;
        choices = [];
        answers = [];
        for (var i=pageNumber-1; i >= 0; i--) {
            buttonHtml += '<div id="sentence-button_'+(pageNumber-1-i)+'" data-order="'+(pageNumber-1-i)+'" class="inactive-button unselected">'+(pageNumber-i)+'</div>';
        }
        for(i = 0; i < count; i++){ 
            var ask = '';
            if (typeof activityContent.question[i].ask != undefined){
                ask=activityContent.question[i].ask;
            }
            var askArr = ask.split('[]');
            if(askArr[1]==undefined) {
                html += '<div id="question-container_'+ i +'" class="question-container" ><span class="ask-container"><span class="order-char"></span>' + askArr[0] + '<span id="true-false-icon_' + i + '"></span></span>';
            }
            else {
                html += '<div id="question-container_'+ i +'" class="question-container" ><span class="ask-container"><span class="order-char"></span>' + askArr[0] +'<span class="blank"> _______ </span>' + askArr[1] + '<span id="true-false-icon_' + i + '"></span></span>';
            }
            choices[i] = activityContent.question[i].choice.split("||");
            
            for (var j=0; j< choices[i].length; j++){
                html += '<div class="choice-container" id="choice-container_' + i + "_" + j + '" value="0">';
                html += '<div id="check_' + i +'_'+ j +'" class="choice global-choice-square" value="0"></div>';
                html += '<span class="radio-label">' + normalizedWord(choices[i][j]) + '</span></div>';
                if (isAnswer(choices[i][j])){
                    answers[i] = j;
                }
            }
            html += '</div>';
        }
        $('#question-link').append(buttonHtml);
        $('#question-container').append(html);
        $('.inactive-button').click(function() {
            curTabIndex = parseInt($(this).attr('data-order'));
            moveToTab(curTabIndex);
        });
        if(pageNumber <2) {
            $('#question-link').hide();
            $('#next-link').hide();
            $('#prev-link').hide();
            $('#loadResult').css({
                'float':'none',
                'margin':'0 auto'
            });
        }
        $('.choice-container').click(function(){
            if (!canPlay) return;
            // Thay doi gia tri cua cac check box cung cap
            $(this).siblings('.choice-container').attr('value','0');
            $(this).siblings('.choice-container').children('.choice').removeClass('checked');
            $(this).siblings('.ask-container').find('.blank').html(' '+$(this).text()+ ' ').addClass('checked-blank');
            // Thay doi gia tri cua check box hien tai
            $(this).attr('value','1');
            $(this).children('.choice').addClass('checked');
        });
        insertOrder();
    }
    $('.video-outer-click-result').hide();
    
    $("#multipage-confirm-dialog-button-no").click(function(){
        $('#my_player').show();
        $('.video-outer-click-result').hide();
    });
        
    $("#multipage-confirm-dialog-button-yes").click(function(){
        $('#my_player').show();
        $('.video-outer-click-result').hide();
    }); 
    
    $('#prev-link').click(function() {
        if(curTabIndex >0 )
        {
            moveToTab(--curTabIndex);
        }
    })
    $('#next-link').click(function() {
        if(curTabIndex < pageNumber-1)
        {
            moveToTab(++curTabIndex);
        }
    })
    setTimeout (function() {
        displayActivity();
        moveToTab(0);
    },500 )
    $("#loadResult").click(function(){
        if (!canPlay) return;
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) && (pageNumber > 1)){
            $('#my_player').hide();
            $('.video-outer-click-result').show();
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
            $("#question-container").html('');
            $("#question-link").html('');
            displayActivity();
            moveToTab(0);
            if($f()) {
                $f().stop();
            }
            if((activityContent.video.indexOf('1:')==0))
            {
                setTimeout(500,function(){
                    document.getElementById("my_player").pauseVideo()
                });
            }
        })
    });
    $("#show-answer").click(function() {
        playSound(Ucan.Resource.Audio.getShowAnswerSound());
        $('.choice').attr('value','0');
        $('.choice').removeClass('checked');
        for(var j = 0; j < count; j++){
            var rightChoice = $('#choice-container_' + j + '_' + answers[j]);
            $(rightChoice).attr("value","0");
            $(rightChoice).children('.choice').addClass('checked');
            $(rightChoice).siblings('.ask-container').find('.blank').html(' '+$(rightChoice).text()+' ').addClass('checked-blank').fadeOut(500).fadeIn(500);
        }
        $('.checked').fadeOut(500).fadeIn(500);
    });
    
});

function loadResult(){
    $('#my_player').show();
    try {
        if($f()) {
            $f().stop();
        }
        if((activityContent.video.indexOf('1:')==0))
        {
            document.getElementById("my_player").pauseVideo();
        }
    }
    catch (err) {
        
    }
    
    canPlay = false;
    numberOfTrueAnswers = 0;
       
    playSound(Ucan.Resource.Audio.getShowResultSound());
    numberOfTrueAnswers = 0;
	
    for(j=0; j< count; j++){
        if ($('#choice-container_' + j + '_' + answers[j]).attr('value') == '1'){
            numberOfTrueAnswers++;
            insertTrueFalseIconAfter(true, "#true-false-icon_" + j);
        }
        else {
            insertTrueFalseIconAfter(false, "#true-false-icon_" + j);
        }
    }
    $('.true-icon').css({
        "margin":"-10px 2px 0px 1px",
        "box-shadow":"none",
        "border":"none",
        'width':'18px',
        'height':'18px'
    });
    $('.false-icon').css({
        "margin":"-4px 2px -2px 1px",
        "box-shadow":"none",
        "border":"none",
        'width':'18px',
        'height':'18px'
    });	
        
    // Nhấp nháy icon đúng sai
    $('.true-icon, .false-icon').ucanAnimateTrueFalseIcon();
                
    $('input:radio').button("disable");
    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
    score = Math.floor((numberOfTrueAnswers / count) * 100);
    $("#score-text").text(score);
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
    canClickRedo = true;
}