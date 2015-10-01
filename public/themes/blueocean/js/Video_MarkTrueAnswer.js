var count;
var groups;
var pageNumber = 1;
var canPlay = true;
var canClickRedo = false;
var unShowClickResult = 0;
$(document).ready(function() {
    var numViewedPage = 0;
    groups = activityContent.group;
    var choices = $.trim(activityContent.choices);
    var characters = choices.split('/');
    count = groups.length;
    var resized = false;
    for(var i=0 ;i < count; i++) {
        if(activityContent.group[i].page > pageNumber) {
            pageNumber = activityContent.group[i].page;
        }
    }
   
    function moveToTab(index) {
        curTabIndex = parseInt(index);
        $('.global-tab-container').ucanMoveToTab(index);
        inactiveAllTabAndButton();
        activeTabAndButton(index);
        numViewedPage++;
    }
    function inactiveAllTabAndButton() {
        $('.sentence-container').hide();
    }
    function activeTabAndButton(index){
        for(var i=0; i<count;i++){
            if(activityContent.group[i].page == undefined) {
                if (index==0) {
                    $('#sentence-container_'+i).show();
                }
            }
            else if((parseInt(activityContent.group[i].page)-1) == index) {
                $('#sentence-container_'+i).show();
            }
        }
    } 
    function displayActivity() {
        $('.video-outer-click-result').hide();
        var buttonHtml = "";
        for (var i=pageNumber-1; i >= 0; i--) {
            buttonHtml += '<div id="sentence-button_'+(pageNumber-1-i)+'" data-order="'+(pageNumber-1-i)+'" class="inactive-button unselected">'+(pageNumber-i)+'</div>';
        }
        var tmp = '<div id=sentence-container>'
        $('#question-link').append(buttonHtml);
        for (i = 0; i < count; i++) {
            tmp += '<div class="sentence-container" id="sentence-container_'+i+'">';
            for (var j = 0; j < characters.length; j++) {
                tmp += '<div class="unselected">' + characters[j] + '</div>';
            }
            tmp += '<div class="text">' + removeCharacterAcronym(groups[i].sentence) + '</div></div>';
           
        }
        tmp +='</div>';
        $('#right-board ').append(tmp);
        
        var nextBack = '';
        if (count > 1) {
            nextBack = '<div id="back-tab" class="global-button-orange-1">' + multiLangSystem.button_back + '</div>'
            + '<div id="next-tab" class="global-button-orange-1">' + multiLangSystem.button_next + '</div>';
        } else{
            $('.global-tab-container').remove();
        }
        
        $('#right-board').append('<div id="submitDiv" class="global-submit-div global-no-border-top">'
            +nextBack
            + '<div id="loadResult" class="global-button-green-1">' + multiLangSystem.button_submit + '</div>'
            + '</div>');
        
        if (!resized) {
            resized = true;
        }
        
        $("#multipage-confirm-dialog-button-no").click(function(){
            $('.video-outer').show();
            $('.video-outer-click-result').hide();
        });
        
        $("#multipage-confirm-dialog-button-yes").click(function(){
            $('.video-outer').show();
            $('.video-outer-click-result').hide();
        });
        
        $('#next-tab').click(function() {
            if(curTabIndex < pageNumber-1)
            {
                moveToTab(++curTabIndex);
            }
        });
        $('#back-tab').click(function() {
            if(curTabIndex >0 )
            {
                moveToTab(--curTabIndex);
            }
        });
        $('#right-board .unselected').click(function() {
            $(this).removeClass('unselected').addClass('selected');
            $(this).siblings('.selected').removeClass('selected').addClass('unselected');
        });
        
        if(pageNumber < 2) {
            $('#question-link').hide();
            $("#next-tab").hide();
            $('#back-tab').hide();
            $('#loadResult').css({
                'float':'none', 
                'margin':'0 auto'
            });
            
        }
        $('#loadResult').click(function() {
            if (!canPlay) return;
            $(document).keyup(function(e){
                if(e.keyCode == 13) {
                    $('#multipage-confirm-dialog-button-no').click();
                }
            });
            if((numViewedPage == 1) && (pageNumber > 1)){
                $('.video-outer').hide();
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
        
        $('#show-answer').click(function() {
            $('.sentence-container').each(function(i) {
                $(this).children('.unselected').each(function(j) {
                    if (groups[i].sentence.indexOf('[' + $(this).text() + ']') != - 1) {
                        $(this).removeClass('unselected').addClass('selected');
                        $(this).siblings('.selected').removeClass('selected').addClass('unselected');
                    }
                });
            });
            $('.sentence-container .selected').fadeOut(500).fadeIn(500);
        });
        
        $('#redo').click(function() {
            unShowClickResult = 0;
            numViewedPage = 0;
            if (!canClickRedo) {
                return;
            }
            canClickRedo = false;
        
            $("#show-result").hide('slide', {
                direction: 'left'
            }, Ucan.Constants.getHideResultSpeed(), function() {
                canPlay = true;
                $('#right-board').html('');
                $('#show-result').slideUp(1000);
                $('#question-link').html('');
                displayActivity();
                moveToTab(0);
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
            });
            
        });
        $('.inactive-button').click(function() {
            curTabIndex = parseInt($(this).attr('data-order'));
            moveToTab(curTabIndex);
        })
    }
    displayActivity();
    moveToTab(0);
    function removeCharacterAcronym(character) {
        var closedBracketIndex = character.indexOf(']');
        return character.substring(closedBracketIndex + 1, character.length - closedBracketIndex + 10);
    }
});

function loadResult(){
    var numberOfTrueAnswers = 0;
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
    playSound(Ucan.Resource.Audio.getShowResultSound());
            
    $('.sentence-container').each(function(index) {
        var answer = '[' + $(this).children('.selected').text() + ']' + $(this).children('.text').text();
        if ($.trim(answer) == $.trim(groups[index].sentence)) {
            numberOfTrueAnswers++;
            insertTrueFalseIconAfter(true, $(this).children('.text'));
        } else {
            insertTrueFalseIconAfter(false, $(this).children('.text'));
        }
    });
    $(".true-icon").css({
        "margin":"0px 0 0 8px"
    });
    $(".false-icon").css({
        "margin":"0px 0 0 8px"
    });
            
    // Nhấp nháy icon đúng sai
    $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
            
    $('#right-board .selected, #right-board .unselected').unbind('click');
            
    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
    score = Math.floor((numberOfTrueAnswers / count) * 100);
    $("#score-text").text(score);
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
    canClickRedo = true;
}