$(document).ready(function() {
    jQuery.fn.compare = function(t) {
        if (this.length != t.length) {
            return false;
        }
        var a = this.sort(),
        b = t.sort();
        for (var i = 0; t[i]; i++) {
            if (a[i] !== b[i]) { 
                return false;
            }
        }
        return true;
    };

    function displayActivity(){
        words1 = [];
        words2 = [];
        
        var words1Html = "";
        var words2Html = "";
        
        for(var i = 0;i<count;i++){ 
            var tempArr = [];
            var word = $.trim(activityContent.group[i].words);
            tempArr[0] = word.substring(word.indexOf(']') + 1,word.length);
            
            if (word[1] == 'L') {
                tempArr[1] = word.substring(3,word.indexOf(']')).split(',');
                words1[words1.length] = tempArr;
            } else {
                tempArr[1] = word.substring(3,word.indexOf(']'));
                words2[words2.length] = tempArr;
            }
        }
        
        words1 = shuffle(words1);
        words2 = shuffle(words2);
        
        for(var i = 0; i < words1.length; i++){ 
            words1Html += '<div class="phrases" id="phrase_' + i + '"><div class="phrase1">' + words1[i][0] + '</div><div class="leftorder">' + String.fromCharCode(65+i) + '</div></div>';
        }
        
        for(i = 0; i < words2.length; i++){ 
            words2Html += '<div class="phrases"><div class="phrase2">' + words2[i][0] + '</div><div class="rightorder" order="' + words2[i][1] + '">' + (i+1) + '</div></div>';
        }
        
        $("#phrases1").append(words1Html);
        $("#phrases2").append(words2Html);
        
        //Drag and drop
        $("#phrases2 .phrases").draggable({
            revert:"invalid",
            helper:"clone"
        });
        $("#phrases1 .phrases").droppable({
            accept: "#phrases2 .phrases",
            drop: function( event, ui ) {
                
                if (!canPlay) {
                    return;
                }   
                
                // Them so vao cuoi cau trai
                if (($(this).children('.selectorder').filter('[order|=' + ui.draggable.children('.rightorder').attr("order") + ']').length == 0) && ($(this).children('.selectorder').length < 4)) {
                    $(this).append(ui.draggable.children('.rightorder').clone().addClass("selectorder").draggable({
                        revert:"invalid",
                        helper:"clone"
                    }));        
                }
            
                // Doi mau hover thanh mau ban dau
                $(this).children('.phrase1').css({
                    'background-color': '#f7fdff',
                    'border': '2px solid #cdf2ff',
                    'border-right': '1px'
                });
            },
                    
            over: function(event, ui) { 
                $(this).children('.phrase1').css({
                    'background-color':'#ddf6ff',
                    'border': '2px solid #a3e7ff',
                    'border-right': '1px'
                });
                
                playSound(Ucan.Resource.Audio.getClickedSound());	    	
            },
                    
            out: function(event, ui) { 
                $(this).children('.phrase1').css({
                    'background-color': '#f7fdff',
                    'border': '2px solid #cdf2ff',
                    'border-right': '1px'
                });
            }
        });
        $("#phrase-container2").droppable({
            accept: ".selectorder",
                    
            drop: function( event, ui ) {
                playSound(Ucan.Resource.Audio.getClickedSound());	    	
                ui.draggable.remove();
            }
        });
    }

    //display activity html
    var count = activityContent.group.length; //number of word groups
    var canPlay = true;	
    var words1 = [];
    var words2 = [];
    
    displayActivity();    
	
    //get Result
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        
        canPlay = false;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        
        numberOfTrueAnswers = 0; //reset after clicking result
        
        for(var i = 0; i < words1.length; i++){ 
            var resultArr = [];
            for (var j = 0; j < $('#phrase_' + i).children(".selectorder").length; j++){
                resultArr[resultArr.length] = $($('#phrase_'+i).children(".selectorder")[j]).attr("order");
            }
            var markHtml = '<div class="true-false-icon"></div>';
            $('#phrase_'+i).append(markHtml);
            
            if ($(resultArr).compare(words1[i][1])) {
                numberOfTrueAnswers++;
                insertTrueFalseIcon(true, $('#phrase_'+i).children('.true-false-icon'));
            } else {
                insertTrueFalseIcon(false, $('#phrase_'+i).children('.true-false-icon'));
            }
            $('.true-icon').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
            $('.false-icon').fadeOut(500).fadeIn(500);
        }

        if (numberOfTrueAnswers < 10) {
            $("#num-of-correct-answers-result").html('0' + numberOfTrueAnswers);
        } else {
            $("#num-of-correct-answers-result").html(numberOfTrueAnswers);
        }
        score = Math.floor((numberOfTrueAnswers/words1.length) * 100);

        if (score < 10) {
            $("#score-text").html('0' + score);
        } else {
            $("#score-text").html(score);
        }
        
        $("#show-result").slideDown(2000);
        $("#phrases2 .phrases").draggable("disable");	
        $(".selectorder").draggable("disable");	
    });
    
    $("#redo").click(function() {
        $("#show-result").slideUp(1200, function(){
            canPlay = true;
            $("#phrases1").html("");
            $("#phrases2").html("");
            numberOfTrueAnswers = 0;
            displayActivity();
        });
    });
    
    $("#show-answer").click(function() {
        canPlay = false;
        $('.true-false-icon').remove();
        $('.selectorder').fadeIn(500).fadeOut(500,function(){
            $(this).remove();
            if ($('.selectorder').length == 0) {
                playSound(Ucan.Resource.Audio.getShowResultSound());
                for(i=0;i<words1.length;i++){ 
                    for (j=0;j<words1[i][1].length;j++){
                        var tempHtml = '<div class="rightorder selectorder">' + $('.rightorder[order="' + words1[i][1][j] + '"]').text() + '</div>';
                        $('#phrase_'+i).append(tempHtml);
                    }
                }
            }
        });
        
    });
	
});