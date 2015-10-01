$(document).ready(function() {
    var count = activityContent.group.length; //number of sentences
    var canPlay = true;
    var curTabIndex = 0; 
    var wordlist = [];
    var score = 0;
    var countTrue = 0; // dem so lan click dung
    var countClick = 0; // dem so lan click sai
    var success = 0;
    var bonus = 0;
    var total = 0;
    var countIndex = [];
    var countWord = [];
    var time = activityContent.time; 
    var timeOutID;
    $('.front-flat-menu-item-active').removeClass('front-flat-menu-item-active').addClass('front-flat-menu-item-inactive');
    $('#front-flat-menu-item-2').addClass('front-flat-menu-item-active').removeClass('front-flat-menu-item-inactive');
    function displayActivity(){
        $('#time-tab').text(time);
        canPlay = true;
        var buttonHtml = "";
        var questionHtml = "";
        var questionHtml1 = "";
        var questionHtml2 = "";
        questionHtml2 += '<div><img src="' + baseUrl + '/themes/blueocean/img/Game-GuessAnswer-Intro.png" class=""></div>';
        questionHtml1 +='<div>';
        for(var i = 0; i < count; i++){
            countIndex[i] = 0;
            questionHtml += '<div id=question-container_' + i + ' class="question">' ;
            questionHtml +='<div class="ask-container">' + activityContent.group[i].category_title  + '</div>';
            questionHtml +='<div class="answers">';
            countWord[i] = activityContent.group[i].words.length;
            for( var k = 0;k < countWord[i] ; k++){
                if (activityContent.group[i].words[k] == ' '){
                    questionHtml +='<div class="blank" id="answer_'+ i +'_'+ k +' "></div>';
                } else if (activityContent.group[i].words[k] == '-'){
                    questionHtml +='<div class="hyphen" id="answer_'+ i +'_'+ k +' "></div>';
                } else {
                    questionHtml +='<div data-value="0" class="answer" id="answer_'+ i +'_'+ k +'"></div>';
                }   
            }
            
            questionHtml +='</div>';
            questionHtml += '<div class="Chances-remains">'+ multiLangSystem.text_Chances_remains +' <span style="font-size: 17px;">&darr;</span></div>';
            questionHtml +='<div class="image">';
            for(var m = 0; m < 5; m++){
                questionHtml +='<div class="images"><img id="image_'+ i +'_'+ m +'" src="' + baseUrl + '/themes/blueocean/img/game-false-icon-orange.png" class="circle-image">';
                questionHtml +='</div>';
            }
            questionHtml +='</div>';
            questionHtml +='<div class="image_'+ i +' circle-next">'+ multiLangSystem.button_skip +'</div>';
            questionHtml +='<div class="ops">Ops! You are out of click!</div>';
            questionHtml +='<div class="complete">Fantastic!</div>';
            questionHtml +='<div class="time">Time’s up!</div>';
            questionHtml +='<div class="list-word">';
            questionHtml +='<div class="list">';
            for(var j = 0; j < 26; j++){
                wordlist[j] =  String.fromCharCode(j+65) ;
                questionHtml +='<div class="word">';
                questionHtml += '<span class="words" id="words_'+ j +'" >'+ wordlist[j] +'</span>';
                questionHtml +='</div>';
            }
            questionHtml += '</div></div></div>';
           
        }
        $('#question-link').append(buttonHtml);
        $('#questions').append(questionHtml);
        $('.ops').hide();
        $('.complete').hide();
        $('.time').hide();
        $('#finish').hide();
        $('#group-score').show();
        $('.key-image').hide();
        $('#loadResult-next-activity').hide();
        //  $('#fist-page').show();
        $('#group-score').append(questionHtml1);
        $('#back-ground').append(questionHtml2);
        moveToTab(0);
        $('.inactive-button').click(function(){		
            var id = $(this).attr('order');
            moveToTab(id);
        });
        //  var countIndex=0;
        // replace ki tu dac biet
        var key = [];
        for (i = 0; i < count; i++) {  
            s = String(activityContent.group[i].words).toUpperCase();
            key[i] = s.replace(/[^a-zA-Z0-9]/g,'');
        }
        function strToBool (str) {
            return str === true || str.toLowerCase() === 'true';
        }
        $('.word').click(function(){
            if ($(this).attr('clicked')) {
                return;
            }
            $(this).attr('clicked', true);
            var correct = false;
            
            //kiem tra tu trong bang voi tu trong o va tra ra ket qua true
            for(var k = 0;k < countWord[curTabIndex]; k++ ){
                if($(this).text()== String(activityContent.group[curTabIndex].words[k]).toUpperCase()
                    &&( $('#answer_'+ curTabIndex +'_'+ k).attr("data-value")=="0")){
                    playSound(baseUrl + '/audio/Vocabulary_WordGame/correct.mp3');
                    $('#answer_'+ curTabIndex +'_'+ k ).append($(this).text());
                    $('#answer_'+ curTabIndex +'_'+ k ).attr("data-value","1");
                    correct = true;
           
                }
            }
            $('#score-tab').text('0');
            if(correct){
                $(this).addClass('word-selected-true');
                countTrue++;
                countClick++;
            }
            if (!correct) {
                $(this).addClass('word-active');
                $('#word')
                countIndex[curTabIndex]++;
                countClick++;
                for(var m = 0; m < countIndex[curTabIndex]; m++){
                    playSound(Ucan.Resource.Audio.getHitSound());
                    $('#image_'+ curTabIndex +'_'+ m ).attr("src",baseUrl+"/themes/blueocean/img/game-true-icon-gray.png" );
                }
            }
            success = Math.floor((countTrue/countClick)*100);
            bonus = success*10;
            total = bonus + score;
            $('#success-tab').text(+success +'%');
            $('#finish-success-content').text(+success +'%');
            $('#finish-bonus-content').text(bonus);
            $('#finish-total-content').text(total);
            //  click sai lon hon 5
            if (countIndex[curTabIndex] > 4) {
                for(var k = 0;k < countWord[curTabIndex]; k++ ){
                    if($('#answer_'+ curTabIndex +'_'+ k ).attr("data-value") == "0"){
                        $('#answer_'+ curTabIndex +'_'+ k ).append(String(activityContent.group[curTabIndex].words[k]).toUpperCase());
                        $('#answer_'+ curTabIndex +'_'+ k ).attr("data-value","1");
                    }
                }
                playSound(Ucan.Resource.Audio.getMissSound());
                $('#question-container_'+ curTabIndex ).children('.ops').show();
                $('#question-container_'+ curTabIndex ).children().children('.list').hide();
                timeOutFinish();
            }
            //click dung ( so lan sai nho hon 5)
            if(countIndex[curTabIndex] <= 4) {
                if($('#question-container_'+ curTabIndex).children('.answers').text() == key[curTabIndex]){
                    playSound(baseUrl + '/audio/excellent.mp3');
                    $('#question-container_'+ curTabIndex).children('.complete').show();
                    $('#question-container_'+ curTabIndex ).children().children('.list').hide();
                    score = score + 100;
                    timeOutFinish();
                }
            }
            $('#score-tab').text(score);
            $('#finish-score-content').text(score);
        });
        for(var i = 0; i < count; i++){
            $('.image_'+ i +'').click(function(){
                if (!canPlay) {
                    return;
                }
                if (curTabIndex < count-1){
                    clearInterval(timeOutID);
                    moveToTab(curTabIndex + 1) ;
                }
                else{
                    moveToTab(0);
                }
            });
        }
    }
    displayActivity();
    function moveToTab(index){
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        $('#activity-board').css('height','');
    }
    
    function inactivateAllTabAndNavigatorButton() {
        $("#questions").children().hide();
    }
    function activeTabAndButton(index) {
        $('#question-container_' + index).show();
    }
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
    
    var intervalID = setInterval(flashText, 1000);
    function flashText() {
        if (time == 0) {
            for(var k = 0;k < countWord[curTabIndex]; k++ ){
                if($('#answer_'+ curTabIndex +'_'+ k +'').attr("data-value") == "0"){
                    $('#answer_'+ curTabIndex +'_'+ k +'').append(String(activityContent.group[curTabIndex].words[k]).toUpperCase());
                    $('#answer_'+ curTabIndex +'_'+ k +'').attr("data-value","1");
                }
            }
            $('#question-container_'+ curTabIndex).children('.time').show();
            $('#question-container_'+ curTabIndex ).children().children('.list').hide();
            if (!canPlay) {
                return;
            }
            canPlay = false;
            $('#time-tab').text(time);
            return;
        }
        $('#time-tab').text(time);
        time--;
    }
    
    $('#loadResult').click(function(){
        playSound(baseUrl + '/audio/report.mp3');
        $('#tab-score').fadeOut(500);
        $('#group-score').fadeOut(100);
        $('#fist-page').fadeOut(100);
        $('#finish').fadeIn(500);
        $('#back-ground').html('');
        $(this).hide();
        $('#loadResult-next-activity').show();
    });
    
    $('#play-again').click(function(){
        canPlay = true;
        time = activityContent.time;
        $('#time-tab').text(time);
        score = 0;
        countClick = 0;
        countTrue = 0;
        countIndex[curTabIndex] = 0;
        $('#success-tab').text('0%');
        $('#score-tab').text(0);
        $('#questions').html("");
        $('#tab-score').fadeIn(500);
        $('#group-score').fadeIn(500);
        $('#finish').fadeOut(300);
        $('#loadResult').show();
        displayActivity();            
    });
    $('#play-game').click(function(){
        //        time = activityContent.time;
        $('#group-score').fadeIn(500);
        $('#fist-page').fadeOut(300);
    });
    function timeOutFinish(){
        timeOutID = setInterval(timecount, 1000);
        var timeOut = 3; //thời gian chờ
        function timecount(){
            timeOut--;
            if(timeOut == 0){
                if (curTabIndex == count-1) {
                    playSound(baseUrl + '/audio/report.mp3');
                    $('#tab-score').hide();
                    $('#group-score').hide();
                    $('#fist-page').hide();
                    $('#finish').show();
                    $('#back-ground').html('');
                    stopSound();
                } else {
                    moveToTab(curTabIndex + 1) ;
                    countIndex[curTabIndex] = 0;
                }
            }
        }
    }
});
