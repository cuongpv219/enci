var count;
var entireText = [];
var numViewedPage = 0;
var unShowClickResult = 0;
var answers = [];
var canClickRedo = false;
$(document).ready(function() {
    var curTabIndex =0;
    count = activityContent.group.length;
    for(i=0; i<count; i++) {
        entireText[i] = ucanMarkupToHtml(activityContent.group[i].paragraph);
        var pattern = /\[([^\]])+\]/g;
        answers = answers.concat(entireText[i].match(pattern));
        entireText[i] = entireText[i].replace(pattern, '<span class="blank">___________</span>');
    }
    var canPlay = true;
    
    
    displayActivity();
    moveToTab(0);
    editGUI();
    function moveToTab(index) {
        curTabIndex = parseInt(index);
        $('.global-tab-container').ucanMoveToTab(index);
        inactiveAllTabAndButton();
        activeTabAndButton(index);
        numViewedPage++;
    }
    function inactiveAllTabAndButton() {
        $('.paragraph-container').hide();
    }
    function activeTabAndButton(index){
        $('#paragraph_'+index).show();
    }
    function displayActivity() {
        $('.video-outer-click-result').hide();
        var wordArr = shuffle(Object.create(answers));
        var buttonHtml ='';
        for (var i = 0; i < wordArr.length; i++) {
            $('.word-container').append('<span class="word">' + $.trim(wordArr[i].replace('[', '').replace(']', '')) + '</span>');
        }
        for (i=count-1; i >= 0; i--) {
            buttonHtml += '<div id="sentence-button_'+(count-1-i)+'" data-order="'+(count-1-i)+'" class="inactive-button unselected">'+(count-i)+'</div>';
        }
        $('#question-link').append(buttonHtml);
        var paragraphHtml = '';
        for(i=0;i<count;i++) {
            paragraphHtml += '<div id="paragraph_'+i+'" class="paragraph-container">'+entireText[i]+'</div>';
        }
        
        $('.paragraph').html(paragraphHtml);
        // Embed video
        if(count < 2) {
            $('#question-link').hide();
            $('#prev-link').hide();
            $('#next-link').hide();
            $('#loadResult').css({
                'float':'none',
                'margin':'0 auto'
            });
        }
        $('.inactive-button').click(function() {
            curTabIndex = parseInt($(this).attr('data-order'));
            moveToTab(curTabIndex);
        })
        $('.word').draggable({
            revert: 'invalid',
            helper: 'clone',
            drag: function(event, ui) {
                ui.helper.css({
                    'color' : '#F5770F'
                })
            }
        });
        
        $('.blank').droppable({
            accept: '.word',
            drop: function(event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                if (ui.draggable.parent().hasClass('word-container')) { // n?u kéo t? khung
                    if ($(this).children('.word').size() > 0) { // ô đích đ? có đáp án
                        ui.draggable.parent().append($(this).children('.word'));
                    }
                    $(this).text('').append(ui.draggable);
                } else { // kéo t? ô đ? có đáp án
                    if ($(this).children('.word').size() > 0) { // ô đích đ? có đáp án
                        ui.draggable.parent().append($(this).children('.word'));
                        $(this).append(ui.draggable);
                    } else { // ô đích chưa có đáp án
                        var tmp = ui.draggable.parent();
                        $(this).text('').append(ui.draggable);
                        tmp.text('___________').css('color', '#bfbfbf');
                    }
                }
                
                $(this).css({
                    'color' : '#F5770F',
                    'background-color' : 'white'
                });
                
            },
            over: function(event, ui) {
                $(this).css('background-color', '#e6f1ff');
            },
            out: function(event, ui) {
                $(this).css('background-color', 'white');
            }
        });
        
        $('.word-container').droppable({
            accept: '.word',
            drop: function(event, ui) {
                if (ui.draggable.parent().hasClass('blank')) {
                    playSound(Ucan.Resource.Audio.getClickedSound());
                    var tmp = ui.draggable.parent();
                    $(this).append(ui.draggable);
                    tmp.text('___________').css('color', '#bfbfbf');
                }
            }
        });
        
        $("#multipage-confirm-dialog-button-no").click(function(){
            $('.video-outer').show();
            $('.video-outer-click-result').hide();
        });
        
        $("#multipage-confirm-dialog-button-yes").click(function(){
            $('.video-outer').show();
            $('.video-outer-click-result').hide();
        });
        
        $('#next-link').click(function(){
            if (curTabIndex < count-1){
                moveToTab(curTabIndex + 1) ;
            }
        });
        
        $('#prev-link').click(function(){
            if(curTabIndex > 0) {
                moveToTab(curTabIndex - 1 );
            }
        });
        
        $('#redo').click(function() {
            if (!canClickRedo) {
                return;
            }
            canClickRedo = false;
            unShowClickResult = 0;
            numViewedPage = 0;
            $("#show-result").hide('slide', {
                direction: 'left'
            }, Ucan.Constants.getHideResultSpeed(), function() {
                canPlay = true;
                $('.word-container').html('');
                $('.paragraph').html('');
                $('.paragraph-container').html('');
                $('#question-link').html('');
                $('#show-result').slideUp(1000);
                displayActivity();
                moveToTab(0);
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
        
        $('#show-answer').click(function() {
            $('.word-container').html('');
            $('.blank').each(function(index) {
                if ($(this).children('.word').size() < 1) {
                    $(this).text(answers[index].replace('[', '').replace(']', ''));
                } else {
                    $(this).children('.word').text(answers[index].replace('[', '').replace(']', ''));
                }
            });
            $('.blank').fadeOut(500).fadeIn(500);
        });
    }
    $("#loadResult").click(function(){
        if (!canPlay) return;
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) && (count > 1)){
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
    
    function editGUI() {
        var videoHeight = $('.video-container').height();
        var textHeight = $('.text-container').height();
        var max = videoHeight > textHeight ? videoHeight : textHeight;
        $('.text-container').height(max);
        $('.paragraph').height(max - 61);
        $('.video-container').height(max);
    }
});
function loadResult(){
    $('#my_player').show();
    canClickRedo = true;
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
    $('.word').draggable('disable');
            
    var numberOfTrueAnswers = 0;
    $('.blank').each(function(index) {
        var tmp = '[' + $(this).children('.word').text() + ']';
        if ($.trim(tmp).toLowerCase() == $.trim(answers[index]).toLowerCase()) {
            numberOfTrueAnswers++;
            insertTrueFalseIconAfter(true, this);
        } else {
            insertTrueFalseIconAfter(false, this);
        }
    });
            
    $('.true-icon').css({
        "margin":"-8px 2px 0px 1px",
        'width':'18px',
        'height':'18px'
    });
    $('.false-icon').css({
        "margin":"-2px 2px 0px 1px",
        'width':'18px',
        'height':'18px'
    });
            
    // Nhấp nháy icon đúng sai
    $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
		
    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + answers.length);
    score = Math.floor((numberOfTrueAnswers / answers.length) * 100);
    $("#score-text").text(score);
    if (answers.length == 0) {
        window.location.replace(nextActivityUrl);
    } else {
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
    }
}