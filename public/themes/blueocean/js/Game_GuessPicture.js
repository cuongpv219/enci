$(document).ready(function(){
    var count = activityContent.card.length; // dem so group
    var word = [];
    var picture = [];       // lấy ảnh từ dữ liệu
    var term = [];          // lấy từ từ csdl
    var curTabIndex;        // biến tab 
    var countIndex=0;      // mỗi lần click sai tăng 1 giá trị 
    var canPlay = true;
    var timeDown = 20; // đếm ngược thời gian.
    var textIntervalId;
    var imageIntervalId;
    var score = 0;      // tính điểm khi click đúng
    displayActivity();
    
    function displayActivity(){
        var htmlWord = '';
        var htmlPicture = '';
            word= shuffle(activityContent.card);
        for(var i = 0;i < count;i++){
            word = activityContent.card[i].term;
            term[i] = activityContent.card[i].term;
            picture[i] = activityContent.card[i].image;
            htmlWord += '<div id="word_'+ i +'" class="words hover-words"  data-value="0">'+ word +'</div>';
            htmlPicture += '<div  id="blur-image_' + i + '" class="picture"></div>';     
            htmlPicture += '<img  id="true-image_' + i + '" src="' + resourceUrl  + picture[i] + '" class="image" alt="guess-image" />';            
        }       
        $('#word').append(htmlWord);
        $('#guess-image').append(htmlPicture);
        $('#fist-page').show();
        $('#group-score').hide();
        $('#finish').hide();                
    }
    
    function startGame() {
        $('#fist-page').hide();
        $('.picture').children().remove();
        moveToTab(0);
    }
    
    $('#play-game').click(function(){
        $('#group-score').fadeOut(1000, function() {
            $('#group-score').fadeIn(2000);
            startGame();
        });        
    });
    
    $('#loadResult').click(function(){
        playSound(baseUrl + '/audio/Vocabulary_WordGame/report.mp3');
        $('#finish').fadeIn(500);
        $('#group-score').hide();
        $('#fist-page').hide();
    });
    
    $('#play-again').click(function(){
        $('#fist-page').fadeIn(500);
        $('#finish').hide();        
        $('#score-tab').text(0);
        score = 0;
    });
    
    $('.words').click(function(){
        var correct = false;
        if (!canPlay 
            || $(this).parent('.word').attr('data-done')
            || $(this).parent('.word').attr('data-wrong3')
            || $(this).attr('data-clicked'))  {
            return;
        }
        if($(this).text()==term[curTabIndex]) {
            correct = true;
        }

        $(this).attr('data-clicked', true);
        if (correct){
            timeOutFinish();
            playSound(Ucan.Resource.Audio.getCorrectSound());
            // Them thuoc tinh de biet la da xong roi
            $(this).parent('.word').attr('data-done', true);
            $(this).addClass('words-clicked-true').removeClass('hover-words');
            clearInterval(textIntervalId);
            $('#time-tab').text(timeDown);
            score = score + timeDown;
            $('#score-tab').text(score);
            $('#finish-score-content').text(score);
            $('#time-tab').removeClass();
            $('#blur-image_'+curTabIndex).hide();
            $('#true-image_'+curTabIndex).show();
        } else {
            playSound(Ucan.Resource.Audio.getHitSound());
            countIndex++;
            // Sai 3 lan ko cho click nua
            $(this).addClass('words-clicked').removeClass('hover-words');
            for(var m = 0; m < countIndex; m++){
                $('#image_'+ m ).attr("src",baseUrl+"/themes/blueocean/img/Game-CrossWord-Hint-Circle-Inactive.png" );
            }
              
            if(countIndex > 2) {
                timeOutFinish();
                clearInterval(textIntervalId);
                playSound(Ucan.Resource.Audio.getMissSound());
                $(this).parent('.word').attr('data-wrong3', true);
                $('#blur-image_'+curTabIndex).hide();
                $('#true-image_'+curTabIndex).show();
                for (i = 0;i < count;i++){
                    if($('#word_'+i).text() == term[curTabIndex]){
                        $('#word_'+i).addClass('words-clicked-true').removeClass('hover-words');
                    }
                }
            }
        }
    });
    
    $('.circle-next').click(function(){
        backClick();
        if (curTabIndex < count-1){
            $('#guess-image').fadeIn(1000,function(){
                moveToTab(curTabIndex + 1) ;
                countIndex = 0;
            });
        }
        else{
            $('#finish').fadeIn(1000);
            $('#group-score').fadeOut(1000);
            timeDown = 20;
        }
        clearInterval(timeOutID);
    });
    
    function inactivateAllTabAndNavigatorButton() {
        $("#guess-image").children().hide();        
    }
    
    function activeTabAndButton(index) {
        $('#blur-image_' + index).show();
    }
    
    // Chuyển tab
    function moveToTab(index){
        clearInterval(textIntervalId);
        clearInterval(imageIntervalId);
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        $('#true-image_' + index).hide();
        timeDown = 20;
        textIntervalId = setInterval(flashText, 1000);
        var amountCount = 5;
        imageIntervalId = setInterval(blurImage, 2000);
        blurImage();
        function blurImage() {
            var img = new Image();
            img.onload = function() {
                Pixastic.process(img, "blurfast", {
                    amount:amountCount
                }, function(newImage){
                    $("#blur-image_" + index).children().remove();
                    $("#blur-image_" + index).append(newImage);
                    $("#blur-image_" + index).children().addClass('image');
                });
                amountCount -= 0.5;
            }
            img.src = resourceUrl + activityContent.card[index].image;                  
        }
    }
    
    //Đếm ngược thoài gian khi đến -1 thì chuyển tab
    function flashText() {
        $('#time-tab').text(timeDown);
        timeDown--;
        if (timeDown == -1){
            playSound(baseUrl + '/audio/Vocabulary_WordGame/correct.mp3');
            $('.words').parent('.word').attr('data-wrong3', true);
            $('#true-image_'+curTabIndex).show();
            $('#blur-image_'+curTabIndex).hide();
            for (var i = 0;i < count;i++){
                if($('#word_'+i).text() == term[curTabIndex]){
                    $('#word_'+i).addClass('words-clicked-true').removeClass('hover-words');
                }
            }
            clearInterval(textIntervalId); 
            timeOutFinish();
        }
    }
    
    // dùng để click và hover lại sau moi lan chuyển tab
    function backClick(){
        countIndex = 0;
        for(var m = 0; m < 3; m++){
            $('#image_'+ m ).attr("src",baseUrl+"/themes/blueocean/img/game-false-icon-orange.png" );
        }
        $('.words').addClass('hover-words').removeAttr('words-clicked').removeAttr('data-clicked');
        $('.words').removeClass('words-clicked-true');
        $('.words').removeClass('words-clicked').removeAttr('words-clicked-true');
        $('.words').removeClass('data-clicked');
        $('.words').parent('.word').removeAttr('data-done').removeAttr('data-wrong3');
    }
    
    // thời gian chờ chuyển sang tab mới
    function timeOutFinish(){
        timeOutID = setInterval(timecount, 1000);
        var timeOut = 3; //thời gian chờ
        function timecount(){
            timeOut--;
            if(timeOut == 0){
                clearInterval(textIntervalId);
                if (curTabIndex == count-1) {
                    clearInterval(textIntervalId);
                    $('#group-score').hide();
                    $('#fist-page').hide();
                    $('#finish').show();
                } else {
                    backClick();
                    moveToTab(curTabIndex + 1) ;
                }
            }
        }
    }
    
});