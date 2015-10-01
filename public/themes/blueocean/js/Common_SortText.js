var count = 1;
for(i=0;i<activityContent.sentences_list.length;i++) {
    if(activityContent.sentences_list[i].page != undefined) {
        if(count < parseInt(activityContent.sentences_list[i].page))  {
            count = parseInt(activityContent.sentences_list[i].page);
        }
    }
}
function editGUI(){
    $('#activity-board').height('');
    if($("#activity-board").height()<$('#picture-board').height()) {
        $('#activity-board').height($('#picture-board').height());
    }
}
$(document).ready(function(){
    var canPlay = true;
    var canClickRedo = false;
    var currentTabIndex =0;
    function moveToTab(index) {
        currentTabIndex = index;
        $('.global-tab-container').ucanMoveToTab(index);
        inactiveAllTabAndButton();
        activeTabandButton(index);
    }
    function activeTabandButton(index) {
        if($('#dialog-audio-container-'+index).size()==0) {
            $('#audios-dialogs-container').hide();
            $('#activity-board').css({
                'border-left':'none',
                'width':'736px'
            });
            $('.sentence').css('width','736px');
            $('.sentence-container').css('width','660px');
        }
        else {
            $('#audios-dialogs-container').show();
            $('#activity-board').css({
                'border-left':'1px solid #d8d8d8',
                'width':'586px'
            });
            $('.sentence').css('width','586px');
            $('.sentence-container').css('width','510px');
        }
        $('#dialog-audio-container-'+index).show();
        $('#picture_'+index).show();
        setTimeout(function(){
            editGUI();
        },100)
        for(var i=0; i<activityContent.sentences_list.length;i++) {
            if(activityContent.sentences_list[i].page) {
                if (parseInt(activityContent.sentences_list[i].page) == (index+1)) {
                    $('#sentence_'+i).show();
                }
            }
        }
    }
    function inactiveAllTabAndButton() {
        $('.sentence').hide();
        $('.picture').hide();
        $('.dialog-audio-container').hide();
    }
    function displayActivity() {
        var sentenceHtml = '';
        var sindex = 0;
        for(i=0;i<activityContent.page.length;i++) {
            $('#picture-board').append('<img id="picture_'+i+'" class="picture" src="'+resourceUrl+activityContent.page[i].image+'">');
            $("#question-link").append('<div id="question_'+ i + '" data-order="' + i + '" class="inactive-button unselected ">'+ (i + 1) + '<img class="false" src="'+baseUrl +'/themes/blueocean/img/tab-false-icon.png'+'">'+'</img>'+'<img class="true" src="'+baseUrl +'/themes/blueocean/img/tab-true-icon.png'+'">'+'</img>' +' </div>');
            var tempArr = [];
            var tempArrSentence = [];
            for(var j=0; j<activityContent.sentences_list.length;j++) {
                if (parseInt(activityContent.sentences_list[j].page)==(i+1)) {
                    tempArr.push(activityContent.sentences_list[j]);
                    tempArrSentence.push(activityContent.sentences_list[j]);
                    
                }
            }
            shuffle(tempArrSentence);
            sentenceHtml += '<div id="sentences_'+i+'">';
            for(var k=0;k<tempArr.length;k++) {
                sentenceHtml += '<div id="sentence_'+sindex+'" class="sentence"><div id="sentence-number_'+sindex+'" class="sentence-number">'+(k+1)+'</div><div id="sentence-container_'+sindex+'" data-value="'+tempArrSentence[k].order+'" class="sentence-container">'+tempArrSentence[k].sentence+'</div></div>' ;
                sindex++;
            }
            sentenceHtml += '</div>';
        } 
        $('#activity-board').append(sentenceHtml);
        $('.sentence-container').draggable({
            revert:"invalid",
            helper:"clone"
        });
        $('.sentence-container').droppable({
            accept: '.sentence-container',
            drop: function(event,ui) {
                var temp = $(this).text();
                var tempvalue =$(this).attr('data-value');
                $(this).html('').append(ui.draggable.text()).attr('data-value',ui.draggable.attr('data-value'));
                ui.draggable.html('').append(temp).attr('data-value',tempvalue);
            }
        });
        $('.inactive-button').click(function(){
            currentTabIndex = parseInt($(this).attr('data-order'));
            moveToTab(currentTabIndex);
        })
        moveToTab(0);
        $('.sentence-container').hover(function(){
            $(this).css({'color':'#cf190f'});
        },function(){
            $(this).css('color','#000');
        })
    }
    displayActivity();
    
    $('#next-link').click(function(){
        if(currentTabIndex<(count-1)) {
            currentTabIndex++;
            moveToTab(currentTabIndex);
        }
    })
    $('#prev-link').click(function(){
        if(currentTabIndex > 0) {
            currentTabIndex--;
            moveToTab(currentTabIndex);
        }
    })
    $('#redo').click(function(){
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
        
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $('#question-link').html('');
            $('#activity-board').html('');
            $('#picture-board').html('');
            displayActivity();
        });
    })
    $('#loadResult').click(function(){
        numberOfTrueAnswers = 0;
        for(var i=0;i<count;i++){
            var iftrue = true;
            $('#sentences_'+i+' .sentence').each(function(){
                if(parseInt($(this).children().eq(0).text())!=parseInt($(this).children().eq(1).attr('data-value'))){
                    iftrue = false;
                }
            });
            if(iftrue == true) {
                numberOfTrueAnswers++;
            }
        }
        		
        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
        score = Math.floor((numberOfTrueAnswers / count) * 100);
        $("#score-text").text(score);
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
        canClickRedo = true;
    });
})