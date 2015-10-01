$(document).ready(function() {

    if (defaultLanguage == 'en') {
        multiLangSystem.title_difference = "Difference"
    } else {
        multiLangSystem.title_difference = "So sánh"
    }
    function displayActivity(){
        var leftSentenceListHtml = '<ul id="sentences">'; // to display sentences needing to fill in the blank
        var rightSentenceListHtml = '<ul id="sentences">'; 
        
        for(i=0;i<count;i++){
            if (i%2 == 0) {
                leftSentenceListHtml += '<li class="sentence"><span class="order-char">' + (i+1) + '. </span>'+ activityContent.group[i].sentence 
                + '<span class="true-false-icon"></span>' +
                '<br><span class="textbox"><textarea class="text" type="text" tabindex="'+ (i+1) +'"></textarea></span><span class="diff-container"></span></li> ';
            } else {
                rightSentenceListHtml += '<li class="sentence"><span class="order-char">' + (i+1) + '. </span>'+ activityContent.group[i].sentence 
                + '<span class="true-false-icon"></span>' +
                '<br><span class="textbox"><textarea class="text" type="text" tabindex="'+ (i+1) +'"></textarea></span><span class="diff-container"></span></li> ';
            }
        }
        leftSentenceListHtml += '</ul>';
        rightSentenceListHtml += '</ul>';
	
        //display given words and sentences with blank
        $('#left-sentence-list').append($(leftSentenceListHtml));
        $('#right-sentence-list').append($(rightSentenceListHtml));
	
        $(".text:first").focus();
    }
    
    var count = activityContent.group.length; //number of sentences
    var numberOfTrueAnswers = 0;
    var canPlay = true;
    var canClickRedo = false;
    
    displayActivity();
    
    //get Result
    $("#loadResult").click(function(){
        if (!canPlay) return;
        canPlay = false;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0;
        $(".sentence").each(function() {
            var index = $(this).children('.textbox').children().attr('tabindex') - 1;
            var answers = activityContent.group[index].result.split("/");
            var isCorrect = false;
            var mostCorrectIndex = 0;
            var minNumOfDiff = 0;
            var inputText = ($(this).children('.textbox').children().val() != null)?$(this).children('.textbox').children().val():'';
            
            // So sanh voi tung dap an
            for (var i = 0; i < answers.length; i++) { 
                var encodeHtml = htmlEncode(answers[i]);
                if (encodeHtml.toLowerCase().replace(/[^A-z0-9']/g, ' ').replace(/ +/g, ' ').replace(/^\s+|\s+$/g,"") 
                    == inputText.toLowerCase().replace(/[^A-z0-9']/g, ' ').replace(/ +/g, ' ').replace(/^\s+|\s+$/g,"")) {
                    isCorrect = true;
                    minNumOfDiff = 0;
                    mostCorrectIndex = i;
                    break;  
                } else {
                    if (i==0){
                        mostCorrectIndex = 0;
                        minNumOfDiff = getNumOfDiff(encodeHtml, inputText);
                    }
                    else{
                        if (minNumOfDiff > getNumOfDiff(encodeHtml, inputText)){
                            mostCorrectIndex = i;
                            minNumOfDiff = getNumOfDiff(encodeHtml, inputText);
                        }
                    }
                }
            }
            
            // Neu ket qua sai
            if (!isCorrect) {    
                // Hien thi cau dung
                var resultHtml = '<br class="clear"><span class="result"> ' + answers[mostCorrectIndex] + '</span>' ;
                if ($(this).children().hasClass("result")){
                    $(this).children('.result').remove();  
                }
                $(this).children('.textbox').after(resultHtml);
                // Hien thi icon
                $(this).children('.true-false-icon').children().remove();
                insertTrueFalseIcon(false, $(this).children('.true-false-icon'));
                // Hien thi show diff
                if (!$(this).children('.diff-container').children().hasClass("showdiff")) {
                    $(this).children('.diff-container').append('<br><span id="showdiff' + index + '" class ="showdiff">' + multiLangSystem.title_difference + '</span> ');     
                    $("#showdiff"+ index).click(
                        function(){
                            if (!$(this).parent().children().hasClass("difference")) {                                                                                
                                var encodeHtml = $(this).parent().parent().children('.result').text();
                                var strCompare = getCompareSentence(encodeHtml,$(this).parent().parent().children('.textbox').children('textarea').val());
                                var compareHtml = '<span class="difference">' + strCompare + '</span>';                                
                                $(this).parent().append(compareHtml);
                                // Co ca remove va add 
                                if($(this).parent().children('.difference').children('add').length != 0 && 
                                    $(this).parent().children('.difference').children('rem').length != 0 ) {
                                    $(this).parent().children('.difference').children('add').css({
                                        'color':'#fff', 
                                        'font-size':'0px'
                                    });
                                    $(this).parent().children('.difference').children('rem').css({
                                        'color':'#000', 
                                        'text-decoration':''
                                    });
                                    $(this).parent().children('.difference').children('rem').animate({
                                        'color':'#808080',
                                        'opacity':'0.3'
                                    },1000,function(){
                                        $(this).css({
                                            'text-decoration':'line-through'
                                        });
                                        $(this).parent().children('add').animate({
                                            'color':'#FF0000',
                                            'font-size':'14px'
                                        },500);
                                    });
                                } 
                                // Chi co add
                                else if ($(this).parent().children('.difference').children('add').length != 0){
                                    $(this).parent().children('.difference').children('add').css({
                                        'color':'#fff', 
                                        'font-size':'0px'
                                    });
                                    $(this).parent().children('.difference').children('add').animate({
                                        'color':'#FF0000',
                                        'font-size':'14px'
                                    },500);
                                }
                                // Chi co rem
                                else if ($(this).parent().children('.difference').children('add').length != 0){
                                    $(this).parent().children('.difference').children('rem').css({
                                        'color':'#000', 
                                        'text-decoration':''
                                    });
                                    $(this).parent().children('.difference').children('rem').animate({
                                        'color':'#808080',
                                        'opacity':'0.3'
                                    },1000,function(){
                                        $(this).css({
                                            'text-decoration':'line-through'
                                        });
                                    });
                                }
                            } 
                            else {
                                $(this).parent().children(".difference").remove();
                            }
                        });
                }    
            // Neu ket qua dung
            }
            else {
                numberOfTrueAnswers++;
                var resultHtml = '<br class="clear"><span class="result" style="display: none; "> ' + answers[mostCorrectIndex] + '</span>' ;
                if ($(this).children().hasClass("result")){
                    $(this).children('.result').remove();  
                }
                $(this).children('.textbox').after(resultHtml);
                // Hien thi icon
                $(this).children('.true-false-icon').children().remove();
                insertTrueFalseIcon(true, $(this).children('.true-false-icon'));
            }
        });
        // Nhấp nháy icon đúng sai
        $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
		
        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
        score = Math.floor((numberOfTrueAnswers / count) * 100);
        $("#score-text").text(score);
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
        canClickRedo = true;
    });
	
    $("#redo").click(function() {
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
        
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $('#left-sentence-list').html('');
            $('#right-sentence-list').html('');
            displayActivity();
        });
    }); 
    
    $('#show-answer').click(function(){
        $('.result').css({
            'display':''
        }).animate({
            'opacity':'0.3'
        },500,function(){
            $(this).animate({
                'opacity':'1'
            },500);
        })
    })
});