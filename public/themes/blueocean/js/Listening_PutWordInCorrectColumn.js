$(document).ready(function(){
    var canPlay = true;
    var count = activityContent.group.length;
    var words = [];
    var resultGroup = [];
    
    function displayActivity() {
        var mergedGroup = [];
        resultGroup = [];
        for (var i = 0;i < count; i++){
            var categoryTitle = htmlEncode(activityContent.group[i].category_title);
            // kiem tra xem co nhap title khong
            titleAccepted = true;
            if (activityContent.group[i].category_title == null){
                titleAccepted = false;
            }
            var image = activityContent.group[i].image;
            // neu khong co anh thi khong cho hien
            if(image == null){
                $('#groups-container-image').hide();
            }
            else{
                $('#groups-container-image').show();
            }
            words[i] = $.trim(activityContent.group[i].words).split(',');
            resultGroup[i] = htmlEncode($.trim(activityContent.group[i].words)).split(',');
            mergedGroup = shuffle(mergedGroup.concat(words[i]));
            $('#groups-container-image').append('<div class="item-image"><img class="item-picture" src="'+ resourceUrl + image+ '" ></img></div>');
            $('#groups-container-content').append('<div class="item-content" id="group_' + i + '"></div>');
        }

        // neu khong co title
        for (i = 0; i < count; i++) {
            if (!titleAccepted) {
                $('#groups-container-title').append('<div class="item-title"></div>');
            } else {
                $('#groups-container-title').append('<div class="item-title">' + htmlEncode(activityContent.group[i].category_title) + '</div>');
            }
        }
        if (!titleAccepted) {
            $('.item-title').css({
                'border-left':'none'
            });
        }

        
        for (i = 0; i< mergedGroup.length;i++){
            $('#word-list').append('<div  class="word">' + mergedGroup[i] + '<span class="trueFalseIcon"></span></div>');
        }
        
        //keo tha tu
        $(".word").draggable({
            helper: 'clone',
            revert: 'invalid'
        });
        
        $('.item-content').droppable({
            accept: '.word',
            drop: function (event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).append((ui.draggable).css({
                    'color':'#black',
                    'width':'172px'
                }));	
            }
        });
        
        $("#word-list").droppable({
            drop: function (event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).append((ui.draggable).css({
                    'color':'#black'
                }));
            }
        });
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
        $(".item-content").hover("disable");
        playSound(Ucan.Resource.Audio.getShowResultSound());
        var numberOfTrueAnswers = 0;
        var j = 0;
        $(".item-content").each(function() {
            $(this).children().each(function(){
                var answer = $(this).text();
                if (belongTo(answer, resultGroup[j])) {
                    numberOfTrueAnswers++;
                    insertTrueFalseIcon(true, $(this).children(".trueFalseIcon"));
                } else {
                    insertTrueFalseIcon(false, $(this).children(".trueFalseIcon"));
                }
            });
            j++;
        });
        
        $(".true-icon").css({
            "margin":"-9px 0px -3px 5px"
        });
        $(".false-icon").css({
            "margin":"-5px 0px -3px 5px"
        });
        
        // Nhấp nháy icon đúng sai
        $(".true-icon").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        $(".false-icon").fadeIn(500).fadeOut(500).fadeIn(500);
        
        if (numberOfTrueAnswers < 10) {
            $("#num-of-correct-answers-result").html('0' + numberOfTrueAnswers);
        } else {
            $("#num-of-correct-answers-result").html(numberOfTrueAnswers);
        }
        score = Math.floor((numberOfTrueAnswers/numberOfWords) * 100);
        if (score < 10) {
            $("#score-text").html('0' + score);
        } else {
            $("#score-text").html(score);
        }
        $("#show-result").slideDown(2000);
    });
    
    var category_title = [];
    var canViewAnswer = true;
    $("#show-answer").click(function() {
        if (canViewAnswer) {
            var j = 0;
            $(".word").each(function() {
                var content = $(this).text();
                for (var k = 0; k < words.length; k++) {
                    if (belongTo($.trim(content), resultGroup[k])) {
                        $('#group_' + k).append('<div class="key">' + content + '</div>');
                    }
                }
                j++;
            });
            
            canViewAnswer = false;
            $('.key').fadeIn(1000).fadeOut(1000).fadeIn(1000);
        }
    });
    
    $("#redo").click(function() {
        $("#show-result").slideUp(1200, function(){
            $("#groups-container-title").html('');
            $("#groups-container-image").html('');
            $("#groups-container-content").html('');
            $("#word-list").html('');
            displayActivity();     
        });
        canPlay = true;
        canViewAnswer = true;
    });
});