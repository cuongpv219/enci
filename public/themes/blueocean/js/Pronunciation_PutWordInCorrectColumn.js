$(document).ready(function() {
    var canPlay = true;

    //check if a word belong to a category
    function belongTo(word, wordList){
        for (var i=0; i < wordList.length; i++){
            if (word == wordList[i]) {
                return true;
            }
        }
        return false;
    }
	
    var count = activityContent.group.length;
    var mergedGroup = [];
    var groups = [];
    var categoryHtml = '<thead class="categories">';
    var pictures = [];
    
    function displayActivity() {
        count = activityContent.group.length;
        mergedGroup = [];
        groups = [];
        categoryHtml = '<thead class="categories">';
        for(i=0;i<count;i++){ 
            pictures[i] = activityContent.group[i].image;
            categoryHtml += '<td value="' + i + '" class="picture" height="80px" ><img id="picture"src="' + resourceUrl + pictures[i] + '" class="img-container"/></td>';
        }
        categoryHtml += '</thead><tr class="categories">';
        for(var i = 0; i < count; i++){ 
            groups[i] = $.trim(activityContent.group[i].words).split(',');
            mergedGroup = mergedGroup.concat(groups[i]);
            categoryHtml += '<td class="category">'
            + '<ul id="group_' + i + '" class="sortable">'
            + '</ul>'
            + '</td>';
            
        }
        categoryHtml += '</tr>';
        $("#category-container").append(categoryHtml);
        //	$("#picture-container").append(pictureHtml);
        mergedGroup = shuffle(mergedGroup);
        html = '<ul id="list">';
        for (i=0; i< mergedGroup.length;i++){
            html += '<li class="word">' + mergedGroup[i] + '<span class="trueFalseIcon"></span></li>';
        }
        html += '</ul>';
        $("#wordList").append(html);
        $("#list").sortable({
            opacity: .8,
            containment: "#activity-container", 
            scroll:false,
            connectWith: ['#activity-container ul'],
            receive: function(event, ui) { 	
                ui.item.animate({
                    'background-color':'#F8EED0'
                }, 500);
            }
        });
        $("#category-container ul").sortable({
            opacity: .8,
            containment: "#activity-container", 
            scroll:false,
            connectWith: ['#activity-container ul'],
            over: function(event, ui) { 
                $(this).parent().css({
                    'background-color':'#f7f7f7'
                });
                $(this).css({
                    'background-color':'#f7f7f7'
                });
                $(this).children().css({
                    'background-color':'transparent'
                });
        	
            },
        
            out: function(event, ui) { 
                $(this).css({
                    'background-color':'transparent'
                });
                $(this).parent().css({
                    'background-color':'transparent'
                });
            },
        
            receive: function(event, ui) {
                $(this).css({
                    'background-color':'transparent'
                });
                $(this).parent().css({
                    'background-color':'transparent'
                });
			
                ui.item.animate({
                    'background-color':'#e5f6f7'
                }, 500, function() {
                    ui.item.animate({
                        'background-color':'transparent'
                    }, 500);
				
                });
                $(this).children().css({
                    'background-color':'trannsparent'
                });
            }
        });
    
        $("#category-container ul").droppable({
            drop: function( event, ui ) {
                playSound(Ucan.Resource.Audio.getClickedSound())
            }
        });
    
        var category_width = 100/count;
        $('.category').css({
            'width':category_width + '%'
        });
    }
    displayActivity();
    
    // View answers
    var canViewAnswer = true;
    $("#show-answer").click(function() {
        if (canViewAnswer) {
            $('td.category ul').each(function() {
                $(this).children('li:last').css({
                    'border-bottom' : '1px solid #6C6CB5'
                }); 
            });
            var j = 0;
          
            $("li.word").each(function() {
                $(this).css('opacity', '0.5');
                var content = $(this).text();
                for (var k = 0; k < groups.length; k++) {
                    if (belongTo($.trim(content), groups[k])) {
                        $('#group_' + k).append('<li class="key">' + content + '</li>');
                    }
                }
                j++;
            });
            canViewAnswer = false;
            $('.key').fadeIn(1000).fadeOut(1000).fadeIn(1000);
        }
    });
    
    //get Result
    var number_of_words = 0;
    for (i = 0; i < groups.length; i++) {
        number_of_words += groups[i].length;
    }
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        canPlay = false;
        $(".sortable").sortable("disable");
        
        playSound(Ucan.Resource.Audio.getShowResultSound());
        var numberOfTrueAnswers = 0;
        var j = 0;
        $(".sortable").each(function() {
            $(this).children().each(function(){
                var answer = $(this).text();
                if (belongTo(answer, groups[j])) {
                    numberOfTrueAnswers++;
                    insertTrueFalseIcon(true, $(this).children(".trueFalseIcon"));
                } else {
                    insertTrueFalseIcon(false, $(this).children(".trueFalseIcon"));
                }
            });
            j++;
        });
        
        $(".true-icon").css({
            "margin":"-9px 0px 0px 5px"
        });
        $(".false-icon").css({
            "margin":"-5px 0px 0px 5px"
        });
        
        // Nhấp nháy icon đúng sai
        $(".true-icon").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        $(".false-icon").fadeIn(500).fadeOut(500).fadeIn(500);
        
        if (numberOfTrueAnswers < 10) {
            $("#num-of-correct-answers-result").html('0' + numberOfTrueAnswers);
        } else {
            $("#num-of-correct-answers-result").html(numberOfTrueAnswers);
        }
        score = Math.floor((numberOfTrueAnswers/number_of_words) * 100);
        if (score < 10) {
            $("#score-text").html('0' + score);
        } else {
            $("#score-text").html(score);
        }
        $("#show-result").slideDown(2000);
    });
    
    $("#redo").click(function() {
        numberOfTrueAnswers = 0;
        $("#show-result").slideUp(1200, function(){
            $("#category-container").html("");
            $("#wordList").html("");
            displayActivity();            
        });
        canPlay = true;
        canViewAnswer = true;
    });
});