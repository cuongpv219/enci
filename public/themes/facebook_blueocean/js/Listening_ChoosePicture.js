var canPlay = true;
var canClickRedo = false;
var count;
var unShowClickResult = 0;
var score;
function isAnswer(word){
    if (word.indexOf("#") >= 0) return true;
    else return false;
}
$(document).ready(function() {	
    var numViewedPage = 0 ;
    
    function normalizedworld(word){
        if (isAnswer(word) == false) return word;
        else return word.replace("#", "");
    }
    function trueAnswer(words){
        choice = words.split("||");
        for (var i=0; i<choice.length;i++)
        {
            if (isAnswer(choice[i])) return choice[i];
        }
        return false;
    }    
    function checkTextTypedByLearner(text, answer){
        var multiple_answer = answer.split("/");
        for (i=0; i<multiple_answer.length;i++){
            if (isEqualString(text, multiple_answer[i])) return true;
        }
        return false;
    }
	
    function moveToTab(index) {
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        numViewedPage++;
    }
    
    function inactivateAllTabAndNavigatorButton() {
        $(".dialog-audio-container").hide();
        $(".cp-jplayer").jPlayer("stop");
        $(".parapara").hide();
    }
    function activeTabAndButton(index) {
        $('#paragraph_' + index).show();
        $('#dialog-audio-container-'+index).show();
        $('#dialog-audio-'+index).jPlayer("play");
    }
    
    $('#next-link').click(function(){
        if (curTabIndex < count - 1){
            moveToTab(curTabIndex + 1) ;
        }
    });
    $('#prev-link').click(function(){
        if(curTabIndex > 0) {
            moveToTab(curTabIndex - 1 );
        }
    });

    function displayActivity() {
        answers = []; //array of true answers
        var paragraphHtml ='';
        var buttonHtml = "";

        count = activityContent.group.length;
        for (i=0; i<count; i++) {
            var pictures = [];
            paragraphHtml += '<div class="parapara" id="paragraph_'+i+'">';
            pictures[0]=normalizedworld(activityContent.group[i].words1);
            pictures[1]=normalizedworld(activityContent.group[i].words2);
            pictures[2]=normalizedworld(activityContent.group[i].words3);
            pictures[3]=normalizedworld(activityContent.group[i].words4);
            
            for (j=0; j<4;j++){
                paragraphHtml += '<div id="pictures_' + i + '_' + j + '" value="0" class="picture">'
                + '<img id="picture_' + i +'_'  + j + '"src="'+ resourceUrl + pictures[j] + '" class="img-container"/>'
                + '<div class="choice local-choice-square-2"></div>' +'<div style="clearBoth"> </div> </div>'
            }
            
            paragraphHtml +='</div>';	
            buttonHtml +='<div id="sentence-button_' + i + '" data-order="' + i + '" class="inactive-button unselected">' + (i + 1) + '<img class="false" src="'+baseUrl +'/themes/blueocean/img/tab-false-icon.png'+'">'+'</img>'+'<img class="true" src="'+baseUrl +'/themes/blueocean/img/tab-true-icon.png'+'">'+'</img>'+ '</div>';   
        }
        // to get strings in [] bracket
        var pattern = /\[\[([^\]])+\]\]/g; //regular expression
        answers = paragraphHtml.match(pattern);
        paragraphHtml = paragraphHtml.replace(pattern, '<span class="blank"><input type="text" class="text"/></span>');
        //display paragraph with blank
        $('#paragraph-number').append($(buttonHtml));
        $('#paragraph-container').append($(paragraphHtml));
        moveToTab(0);
        $('.inactive-button').click(function(){		
            var id = $(this).attr('data-order');
            moveToTab(id);
        });
        $('.picture ').click(function(){
            if (canPlay) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).find('.choice').show();
                $(this).siblings().find('.choice').hide();
                $(this).attr('value',1);
                $(this).siblings().children('.img-container-click').addClass('img-container');
                $(this).siblings().children('.img-container-click').removeClass('img-container-click');
                $(this).siblings().attr('value',0);
            }
        });           
    }   
    //var paragraph = activityContent.paragraph.split('{{{hr /}}}');
    var curTabIndex = 0;
    var answers = []; //array of true answers
    displayActivity();
    // View answers
    $("#show-answer").click(function() {
        var j = 0;
        $(".text").each(function() {
            var ans = answers[j].substring(1,answers[j].length - 1);
            $(this).val(ans);
            j++;
        });
    });
    
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
	
    $("#redo").click(function() {
        unShowClickResult = 0;
        numViewedPage = 0;
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
        canPlay = true;
        
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            $('#paragraph-number').html('');
            $('#paragraph-container').html('');
            displayActivity();          
        });
    });
    $('.img-container').hover(function(){
        $(this).removeClass('img-container');
        $(this).addClass('img-container-click');
    },function(){
        $(this).addClass('img-container');
        $(this).removeClass('img-container-click');
    });
    $("#show-answer").click(function() {
        for(var i=0;i<count;i ++){
            var inputImg = [];
            inputImg[0]=activityContent.group[i].words1;
            inputImg[1]=activityContent.group[i].words2;
            inputImg[2]=activityContent.group[i].words3;
            inputImg[3]=activityContent.group[i].words4;
            for(var k=0;k<4;k++) {
                if (isAnswer(inputImg[k])){
                    $('#pictures_'+i+'_'+k).find('.choice').show().fadeOut(500).fadeIn(500);
                    $('#pictures_'+i+'_'+k).siblings().find('.choice').hide();
                    $('#picture_'+i+'_'+k).parent().siblings().children('.img-container').css({
                        'opacity':'0.5'
                    });
                }
            }
        }
    });
});

function loadResult(){
    if (!canPlay) {
        return;
    }
    canPlay = false;
    $('.cp-jplayer').jPlayer("stop");
    playSound(Ucan.Resource.Audio.getShowResultSound());
    numberOfTrueAnswers = 0;
    for(i=0; i<count; i++){
        var j=0;
        var inputValue = -1;
        var inputImg = [];
        inputImg[0]=activityContent.group[i].words1;
        inputImg[1]=activityContent.group[i].words2;
        inputImg[2]=activityContent.group[i].words3;
        inputImg[3]=activityContent.group[i].words4;
        for(j=0; j<4; j++){
            inputValue = ($('#pictures_'+i+'_'+j).attr("value") == "1")?j:inputValue;
        }
        if(inputValue != -1) {
            if(isAnswer(inputImg[inputValue])){
                numberOfTrueAnswers++;
                $('#sentence-button_'+i).children('.true').show();
                $('#sentence-button_'+i).children('.true').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
            }
            else {
                $('#sentence-button_'+i).children('.false').show();
                $('#sentence-button_'+i).children('.false').fadeOut(500).fadeIn(500);
            }
        }           
        else {
            $('#sentence-button_'+i).children('.false').show();
            $('#sentence-button_'+i).children('.false').fadeOut(500).fadeIn(500);
        }
    }

    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
    score = Math.floor((numberOfTrueAnswers / count) * 100);
    $("#score-text").text(score);
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
    canClickRedo = true;
}