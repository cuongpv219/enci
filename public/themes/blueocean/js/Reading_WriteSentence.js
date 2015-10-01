function editGUI(){
    $('#activity-board, #reading-board, #sentence-list, #reading-container').css({
        'height':''
    });
    var maxHeight = Math.max(450,$('#activity-board').height());
    $('#activity-board').height(maxHeight);
    $('#reading-board').height(maxHeight);
    $('#reading-container').height(maxHeight-20); 
    $('#reading-container').ucanJScrollPane('#reading-board');
    if (activityContent.reading.length < 2)
    {
        if($('#sentence-list').height() < (maxHeight-100)) {
            $('#sentence-list').height(maxHeight- 100) ;
        }
    }
    else {
        if($('#sentence-list').height() < (maxHeight-150)) {
            $('#sentence-list').height(maxHeight- 150) ;
        }
    }
}
  
$(document).ready(function() {
    
    if (defaultLanguage == 'en') {
        multiLangSystem.title_answer = "Difference"
    } else {
        multiLangSystem.title_answer = "So sánh"
    }
    
    function moveToTab(index) {
        $('.global-tab-container').ucanMoveToTab(index);
        inActiveAllTabAndButton();
        activeTabAndButton(index);
    }
    function inActiveAllTabAndButton() {
        $('.sentence').hide();
        $('#reading-container').remove();
    }
    function activeTabAndButton(index) {
        var readingHtml = '<div id="reading-container"></div>';
        $('#reading-board').append(readingHtml);
        $('#reading-container').append(Ucan.Function.HTML.editMediaUrl(activityContent.reading[index].page));
        for (var i=0; i<count; i++) {
            if(activityContent.group[i].page == undefined) {
                if (index==0)
                {
                    $('#sentence_'+i).show();
                }
            }
            else {
                if (activityContent.group[i].page == (parseInt(index)+1))  {
                    $('#sentence_'+i).show();
                }
            }
        }
        editGUI();
    }
    function insertOrder() {
        var orderChar = 0;
        for(var i=0; i<activityContent.reading.length;i++) {
            for (var k=0; k<count; k++) {
                if(activityContent.group[k].page == undefined) {
                    if(i==0) {
                        $('#sentence_'+k +' .order-char').html((++orderChar)+'.');
                    }
                }
                else {
                    if ((parseInt(i)+1)==activityContent.group[k].page) {
                        $('#sentence_'+k +' .order-char').html((++orderChar)+'.');
                    }   
                }
            }
        }
    }
    var curTabIndex = 0;
    function displayActivity(){
        var sentenceListHtml = '<ul id="sentences">'; // to display sentences needing to fill in the blank
        if (activityContent.reading) {
            for (var i = 0; i<activityContent.reading.length ; i++) {
                $('#question-link').append('<div id="sentence-button'+ i +'" data-order="'+i+'" class="inactive-button unselected">'+(i+1)+'</div>');
            }
        }
        for(i=0;i<count;i++){
            sentenceListHtml += '<li id="sentence_'+i+'" class="sentence"><span class="order-char"> </span>'+ activityContent.group[i].sentence 
            + '<span class="true-false-icon"></span>' +
            '<br><span class="textbox"><textarea class="text" type="text" tabindex="'+ (i+1) +'"></textarea></span><span class="diff-container"></span></li> ';
        }
        sentenceListHtml += '</ul>';
	
        //display given words and sentences with blank
        $('#sentence-list').append($(sentenceListHtml));
        $(".text:first").focus();
        $('.inactive-button').click(function() {
            curTabIndex = $(this).attr('data-order');
            moveToTab(curTabIndex);
        })
        insertOrder();
    }
    $('#next-link').click(function() {
        if(curTabIndex < activityContent.reading.length - 1)
            moveToTab(++curTabIndex);
    })
    $('#prev-link').click(function() {
        if (curTabIndex > 0)
            moveToTab(--curTabIndex);
    }) 
    var count = activityContent.group.length; //number of sentences
    var numberOfTrueAnswers = 0;
    var canPlay = true;
    
    displayActivity();
    if (activityContent.reading.length < 2) {
        $('#question-link').hide();
        $('#next-link').hide();
        $('#prev-link').hide();
        $('#loadResult').css({
            'margin':'0 auto', 
            'float':'none'
        });
    }
    moveToTab(0);
    //get Result
    $("#loadResult").click(function(){
        if (!canPlay) return;
        canPlay = false;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0;
        $(".sentence").each(function() {
            var index = $(this).children('.textbox').children().attr('tabindex') - 1;
            
            var answers = activityContent.group[index].result.split("||");
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
                $(this).children('.true-false-icon').append(' <img  src="'+ baseUrl +'/themes/blueocean/img/true-false-cross-red-24.png" />').addClass('false-icon');

                // Hien thi show diff
                if (!$(this).children('.diff-container').children().hasClass("showdiff")) {
                    $(this).children('.diff-container').append('<br><span id="showdiff' + index + '" class ="showdiff">' + multiLangSystem.title_answer + '</span> ');     
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
                resultHtml = '<br class="clear"><span class="result" style="display: none; "> ' + answers[mostCorrectIndex] + '</span>' ;
                if ($(this).children().hasClass("result")){
                    $(this).children('.result').remove();  
                }
                $(this).children('.textbox').after(resultHtml);
                // Hien thi icon
                $(this).children('.true-false-icon').children().remove();
                $(this).children('.true-false-icon').append(' <img  src="'+ baseUrl +'/themes/blueocean/img/true-false-tick-green-24.png" />').addClass('true-icon');
            }
        });
        // Nhấp nháy icon đúng sai
        $(".true-icon").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
        $(".false-icon").fadeIn(500).fadeOut(500).fadeIn(500);
        
        if (numberOfTrueAnswers < 10) {
            $("#num-of-correct-answers-result").html('0' + numberOfTrueAnswers);
        } else {
            $("#num-of-correct-answers-result").html(numberOfTrueAnswers);
        }
        score = Math.floor((numberOfTrueAnswers/count) * 100);
        if (score < 10) {
            $("#score-text").html('0' + score);
        } else {
            $("#score-text").html(score);
        }
        //$('#show-result-comments').html(showMessage(score));
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
        editGUI();
    });
	
    $("#redo").click(function() {
        numberOfTrueAnswers = 0;
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $("#sentence-list").html('');
            $("#question-link").html('');
            displayActivity();
            moveToTab(0);
        })
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