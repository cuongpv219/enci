$(document).ready(function(){
    var canPlay = true;
    var count = activityContent.group.length;
    var words = [];
    var resultGroup = [];
    
    function displayActivity() {
        var mergedGroup = [];
        resultGroup = [];
        for (var i = 0; i < count; i++){
            var categoryTitle = htmlEncode(activityContent.group[i].category_title);
            var image = activityContent.group[i].image;
            if (!image){
                $('#groups-container-image').hide();
            }
            else{
                $('#groups-container-image').show();
            }
            words[i] = $.trim(activityContent.group[i].words).split(',');
            resultGroup[i] = htmlEncode($.trim(activityContent.group[i].words)).split(',');
            mergedGroup = shuffle(mergedGroup.concat(words[i]));
            $('#groups-container-title').append('<div class="item-title">'+ categoryTitle +'</div>');
            $('#groups-container-image').append('<div class="item-image" data-order="' + i + '"><img class="item-picture" src="'+ resourceUrl + image+ '" ></img></div>');
            $('#groups-container-content').append('<div class="item-content" data-order="' + i + '" id="group_' + i + '"></div>');
            $('#key-row').append('<div class="key"></div>');
        }
        
        for (i = 0; i< mergedGroup.length;i++){
            $('#word-list').append('<div class="word global-correct-column-word-in-list">' + mergedGroup[i] + '<span class="trueFalseIcon"></span></div>');
        }
        
        //keo tha tu
        $(".word").draggable({
            helper: 'clone',
            revert: 'invalid',
            stack: '.text',
            refreshPositions: true
        });
        
        $('.item-content, .item-image').droppable({
            accept: '.word',
            over: function() {
                makeStyleDroppableOver($(this));
            },
            out: function() {
                removeStyleDroppableOver($(this));
            },
            drop: function (event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $('.item-content[data-order="' + $(this).attr('data-order') + '"]').append((ui.draggable));
                removeStyleDroppableOver($(this));
            }
        });
        
        $("#word-list").droppable({
            drop: function (event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).append(ui.draggable);
                $(this).removeClass('over', 200);
            },
            over: function() {
                $(this).addClass('over', 200);
            },
            out: function() {
                $(this).removeClass('over', 200);
            }
        });
    }
    
    function makeStyleDroppableOver(targetDoppable) {
        $('.item-content[data-order="' + $(targetDoppable).attr('data-order') + '"]').css('background', '#f2f2f2');
        $('.item-image[data-order="' + $(targetDoppable).attr('data-order') + '"]').css('background', '#f2f2f2');
    }
    
    function removeStyleDroppableOver(targetDoppable) {
        $('.item-content[data-order="' + $(targetDoppable).attr('data-order') + '"]').css('background', 'transparent');
        $('.item-image[data-order="' + $(targetDoppable).attr('data-order') + '"]').css('background', 'transparent');
    }
    
    function belongTo(word, wordList){
        for (var i=0; i < wordList.length; i++){
            if (word == wordList[i]) {
                return true;
            }
        }
        return false;
    }
    
    displayActivity();
    
    var numberOfWords = 0;
    for (i = 0; i < words.length; i++) {
        numberOfWords += words[i].length;
    }
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        canPlay = false;
        $('.word').draggable('disable');
        playSound(Ucan.Resource.Audio.getShowResultSound());
        var numberOfTrueAnswers = 0;
        $(".item-content").each(function(index) {
            $(this).children().each(function(){
                var answer = $(this).text();
                if (belongTo(answer, resultGroup[index])) {
                    numberOfTrueAnswers++; 
                    insertTrueFalseIcon(true, $(this).children(".trueFalseIcon"));
                } else {
                    insertTrueFalseIcon(false, $(this).children(".trueFalseIcon"));
                }
            });
        });
        
        // Nhấp nháy icon đúng sai
        $(".item-content .true-icon, .item-content .false-icon").ucanAnimateTrueFalseIcon();
        
        $("#num-of-correct-answers-result").text(numberOfCorrect + '/' + wordCount);
        score = Math.floor((numberOfCorrect / wordCount) * 100);
        $("#score-text").text(score);
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
    });
    
    $("#show-answer").click(function() {
        if (!$('#key-row .key').text()) {
            $('#groups-container-content').after('<div class="#key-row"></div>');
            $('#key-row .key').each(function(index) {
                for (var i = 0; i < words[index].length; i++) {
                    $(this).append('<div>' + words[index][i] + '</div>');
                }
            });
        }
            
        $('#key-row .key').css('display', 'table-cell').children().ucanAnimateAnswers();
    });
    
    $("#redo").click(function() {
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            $("#groups-container-title").html('');
            $("#groups-container-image").html('');
            $("#groups-container-content").html('');
            $('#key-row').html('');
            $("#word-list").html('');
            displayActivity();     
            canPlay = true;
        });
    });
});