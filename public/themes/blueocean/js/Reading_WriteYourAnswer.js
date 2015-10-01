function editGUI(){
    $('#activity-board, #sentence-list, #reading-board, #reading-container').css('height','');
    var maxHeight = Math.max(450,$('#activity-board').height());
    $('#activity-board').height(maxHeight);
    $('#reading-board').height(maxHeight-19);
    $('#left-board').height(maxHeight-19);
    $('#reading-container').height(maxHeight - 40); 
    if (activityContent.reading.length > 1) {
        if($('#sentence-list').height() < maxHeight - 150) {
        
            $('#sentence-list').height(maxHeight- 150);
        }
    }
    else {
        if($('#sentence-list').height() < maxHeight - 100) {
        
            $('#sentence-list').height(maxHeight- 100);
        }
    }
    $('#reading-container').ucanJScrollPane('#reading-board');
}
$(document).ready(function() {
    if (defaultLanguage == 'en') {
        multiLangSystem.title_answer = "Difference"
    } else {
        multiLangSystem.title_answer = "Đáp án"
    }
    
    function moveToTab(index) {
        curTabIndex = parseInt(index);
        $('.global-tab-container').ucanMoveToTab(index);
        inactiveAllTabAndButton();
        activeTabAndButton(index);
    }
    function inactiveAllTabAndButton() {
        $('.sentence').hide();
    }
    function activeTabAndButton(index) {
        for (var i=0; i < count; i++) {
            if(activityContent.group[i].page == undefined) {
                if (index == 0) 
                {
                    $('#sentence_'+i).show();
                }
            }
            else {
                if ((parseInt(index)+1) == activityContent.group[i].page) {
                    $('#sentence_'+i).show();
                }
            }
        }
        $('#reading-container').remove();
        $('#reading-board').append('<div id="reading-container"></div>');
        $('#reading-container').html(Ucan.Function.HTML.editMediaUrl(activityContent.reading[index].page));
        editGUI();
    }
    //display activity board html
    var curTabIndex = 0;
    var count = activityContent.group.length; //number of sentences
    function displayActivity() {
        var sentenceListHtml = '<ul id="sentences">'; // to display sentences needing to fill in the blank
        var buttonHtml = '';
        for (var i=activityContent.reading.length-1;i>=0; i--) {
            buttonHtml += '<div id="sentence-button_'+(activityContent.reading.length-1-i)+'" data-order="'+(activityContent.reading.length-1-i)+'" class="inactive-button unselected">'+((activityContent.reading.length-i))+'</div>'
        }
        for(i=0;i<count;i++){
            sentenceListHtml += '<li id="sentence_'+i+'" class="sentence"><span class="order-char">' + (i+1) + '. </span>'+ activityContent.group[i].sentence +
            '<br><span class="textbox"><textarea class="text" type="text" tabindex='+ (i+1) +' rows="2" cols="30"></textarea></span>' +
            '<br><span class ="showdiff">' + multiLangSystem.title_answer + '</span>' +
            '<span class="result">&nbsp&nbsp' + activityContent.group[i].result + '</span></li>';
        }
        sentenceListHtml += '</ul>';
        //display given words and sentences with blank
        $('#question-link').append(buttonHtml);
        $('#sentence-list').append($(sentenceListHtml));
        // An hien vi du
        $('.inactive-button').click(function() {
            
            curTabIndex = parseInt($(this).attr('data-order'));
            console.log(curTabIndex);
            moveToTab(curTabIndex);
        })
        if (activityContent.reading.length < 2) {
            $('#question-link').hide();
            $('#next-link').hide();
            $('#prev-link').hide();
            $('#loadResult').css({
                'margin':'0 auto',
                'float':'none'
            });
        }
        $('#next-link').click(function() {
            if(curTabIndex < activityContent.reading.length-1) {
                moveToTab(++curTabIndex);
            }
        })
        $('#prev-link').click(function() {
            if(curTabIndex >0) {
                moveToTab(--curTabIndex);
            }
        })
        $(".showdiff").click(	
            function(){
           
                if($(this).parent().children('.result').css("display") == "none") {
                    $(this).parent().children('.result').css({
                        "color":"white",
                        "display":"inline"
                    });
                    $(this).parent().children('.result').animate({
                        "color":"#a6a6a6"
                    },0);
                    editGUI();
                }
                else {
                    $(this).parent().children('.result').animate({
                        "color":"white"
                    },0, function(){
                        editGUI();
                        $(this).css({
                            "display":"none"
                        });
                    });
                    editGUI();
                }
            });
        
        $(".text:first").focus();
    }
    displayActivity();
    moveToTab(0);
    //get Result
    $("#loadResult").click(function(){
        playSound(Ucan.Resource.Audio.getShowResultSound());
        var first = $(".sentence:first");
        flashSentence(first);
        
    });
    
    function flashSentence(e) {
        if($(e).text()!= ''){
            $(e).children('.result').css({
                "color":"white",
                "display":"inline"
            });
            $(e).children('.result').animate({
                "color":"#a6a6a6"
            },1500, function(){
                flashSentence($(this).parent().next());
            });
            editGUI();
        }
    }
});
