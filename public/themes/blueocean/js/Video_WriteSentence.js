/*
 * author: Dinh Doan
 */
var unShowClickResult = 0;
var numberOfTab;
$(document).ready(function(){
    var numViewedPage = 0;
    var groups = activityContent.group;
    var countOfSentence = groups.length;
    numberOfTab = getPaginationAmount(countOfSentence, 2);
    if (defaultLanguage == 'en') {
        multiLangSystem.title_answer = "Difference"
    } else {
        multiLangSystem.title_answer = "Đáp án"
    }
    
    displayActivity();
    editGUI();
    
    function displayActivity() {
        var submitDiv = '<div id="submitDiv" class="global-submit-div">'
        + '<div id="finish" class="global-button-green-1">' + multiLangSystem.button_finish + '</div>';
        
        if (numberOfTab == 1) {
            $('.sentence-group-container').append('<div class="sentence-container order0"></div>');
            $('.global-tab-container').remove();
        } else {
            for (var i = 0; i < numberOfTab; i++) {
                $('.global-tab-container').append('<div class="unselected" data-order="' + i + '">' + (i + 1) + '</div>');
                $('.sentence-group-container').append('<div class="sentence-container order' + i + '"></div>');
            }
                
            submitDiv += '<div id="back-tab" class="global-button-orange-1">' + multiLangSystem.button_back + '</div>'
            + '<div id="next-tab" class="global-button-orange-1">' + multiLangSystem.button_next + '</div>'
        }
        submitDiv += '</div>';

        $('.sentence-container').each(function(index) {
            addSentence(this, index * 2);
            if (index == (numberOfTab - 1) && (countOfSentence % 2) == 1) {
                return;
            }
            addSentence(this, index * 2 + 1);
            
            function addSentence(sentenceContainer, i) {
                $(sentenceContainer).append('<div class="question">'
                    + '<span class="index">' + (i + 1) + '.</span>'
                    + '<span class="text">' + groups[i].sentence + '</span>'
                    + '</div>'
                    + '<textarea class="user-input"></textarea>'
                    + '<div class="answer">'
                    + '<span class="button">' + multiLangSystem.title_answer + '</span>'
                    + '<span class="text">' + groups[i].answer + '</span>'
                    + '</div>');
            }
        });

        $('.sentence-container.order0').show();
        $('.video-outer-click-result').hide();
        $('#right-board').append(submitDiv);
        
        // Embed video
        /*
         * Event for click 
         */
        var curTab = 0;
        $('.global-tab-container .unselected').click(function() {
            curTab = $(this).attr('data-order');
            moveToTab(curTab);
        });
        
        $('#next-tab').click(function() {
            if (curTab < $('.sentence-container').size() - 1) {
                curTab++;
                moveToTab(curTab);
            }
        });
        $('#back-tab').click(function() {
            if (curTab > 0) {
                curTab--;
                moveToTab(curTab);
            }
        });
        moveToTab(0);
        
        $('#right-board .button').click(function() {
            $(this).next('.text').stop(true, true).fadeIn(1000);
        });
    }
    $("#multipage-confirm-dialog-button-no").click(function(){
        $('.video-outer').show();
        $('.video-outer-click-result').hide();
    });
        
    $("#multipage-confirm-dialog-button-yes").click(function(){
        $('.video-outer').show();
        $('.video-outer-click-result').hide();
    });
     
    $("#finish").click(function(){
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) & (numberOfTab > 1)){
            $('.video-outer').hide();
            $('.video-outer-click-result').show();
            unShowClickResult++;
            if(unShowClickResult == 1){
                $('.overlay-black').show();
                $('#multipage-confirm-dialog').fadeIn();
            }
        }
        else{
            window.location.replace(nextActivityUrl);
        }
    });
    
    function moveToTab(index) {
        numViewedPage++;
        $('.sentence-container.order' + index).fadeIn(500);
        $('.sentence-container.order' + index).siblings('.sentence-container').hide();
        $('.global-tab-container .unselected').attr('data-order');
        $('.global-tab-container .unselected').each(function() {
            if ($(this).attr('data-order') == index) {
                $(this).removeClass('unselected').addClass('selected');
                $(this).siblings('.selected').removeClass('selected').addClass('unselected');
            } 
        });
    }

    function editGUI() {
        $('.user-input').autoResize({
            extraSpace: 20
        });
    }
});

function loadResult(){
    window.location.replace(nextActivityUrl);
}