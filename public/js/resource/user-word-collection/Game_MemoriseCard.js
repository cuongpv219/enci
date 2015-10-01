var startTime;
var timer;
var canPlay;
function timedCount(){
    if (!canPlay) return;
    var curTime = new Date() - startTime;
    var hour = Math.floor(curTime/3600000);
    curTime -= hour * 3600000;
    var minute = Math.floor(curTime/60000);
    curTime -= minute * 60000;
    var second = Math.floor(curTime/1000);
    $('#timer-label').text((hour<10?('0' + hour):hour) + ':' + (minute<10?('0' + minute):minute) + ':' + (second<10?('0' + second):second));
    timer = setTimeout("timedCount()",1000);
}
        
$(document).ready(function() {
    $('.front-flat-menu-item-active').removeClass('front-flat-menu-item-active').addClass('front-flat-menu-item-inactive');
    $('#front-flat-menu-item-4').addClass('front-flat-menu-item-active').removeClass('front-flat-menu-item-inactive');
    var speed = 300;
    var realScore = 0;
    var click = 0;
    //var count = activityContent.group.length; //number of word groups
    var numOfWord = activityContent.numOfWord;
    var ranWordArr;
    var ranNumArr;
    var revealNum;
    function editGUI(){
        $('.word-image:first').load(function(){
            var imageHeight = 130*this.height/this.width;    
            $('.back-image,.front-image').height(imageHeight);
            $('.plus-ten,.minus-one,.word-term-ipa').css('line-height',imageHeight + 'px');
            $('.card-wrap').height(imageHeight + 10);
        })        
    }
    
    function flipCard(cardContainerId){
        var des = '.back-image';
        var org = '.front-image';
        var isFlip = parseInt($('#' + cardContainerId).attr('data-flip'));
        if (isFlip == 0) {
            org = '.back-image';
            des = '.front-image';
        }
        //        $('#' + cardContainerId).children().stop(true,true);
        $('#' + cardContainerId).children(org).animate({
            'width':'0px',
            'margin-left':'65px'
        },speed,function(){
            $(this).hide();
            $(this).siblings(des).show().animate({
                'width':'130px',
                'margin-left':'0px'
            },speed,function(){
                $(this).parent().attr('data-flip',1-isFlip);
                checkCard();
            });
        })
    }
    
    function checkCard(){
        var flipCardArr = $('.not-selected[data-flip="1"]');
        if(flipCardArr.length == 2){
            if($(flipCardArr[0]).attr('data-value') != $(flipCardArr[1]).attr('data-value')){
                playSound(baseUrl + '/audio/wrong.mp3');
                realScore -= 1;
                $('#score-label').text(realScore + ' poins');
                turnbackCard($(flipCardArr[0]).attr('id'));
                turnbackCard($(flipCardArr[1]).attr('id'));
            } else {
                $('.term-blank:first').text(ranWordArr[$(flipCardArr[0]).attr('data-value')].term).addClass('word-term').removeClass('term-blank');
                playSound(resourceUrl + ranWordArr[$(flipCardArr[0]).attr('data-value')].audio);
                realScore += 10;
                revealNum++
                $('#score-label').text(realScore + ' points');
                destroyCard($(flipCardArr[0]).attr('id'));
                destroyCard($(flipCardArr[1]).attr('id'));
                if (revealNum == numOfWord) {
                    finishGame();
                }
            }
        }
    }
    
    function turnbackCard(cardContainerId){
        flipCard(cardContainerId);
        $('#' + cardContainerId).children('.minus-one').show().animate({
            'font-size':'60px',
            'opacity':1
        },2*speed,function(){
            $(this).css({
                'font-size':'20px',
                'opacity':0.3
            }).hide();
        });
    }
    
    function destroyCard(cardContainerId){
        $('#' + cardContainerId).removeClass('not-selected').children('.front-image,.back-image').animate({
            'opacity':0
        },speed,function(){
            $(this).siblings('.plus-ten').show().animate({
                'font-size':'60px',
                'opacity':1
            },speed,function(){
                $(this).css({
                    'font-size':'20px',
                    'opacity':0.3
                }).hide();
            });
        })
    }
    
    function displayActivity(){
        canPlay = true;
        revealNum = 0;
        $('#memorise-game-result-board').hide();
        $('#card-container,#word-term-container').show();
        ranWordArr = shuffle(activityContent.card);
        ranNumArr = generateRandomArr(numOfWord*2);
        
        for(var i = 0; i < numOfWord; i++){
            if (ranWordArr[i].image != null) {
                $('#card-wrap-'+ranNumArr[2*i]).attr('data-value',i).append('<img class="word-image front-image" src="' + resourceUrl + ranWordArr[i].image + '" alt="Word image">');
            } 
            else {
                $('#card-wrap-'+ranNumArr[2*i]).attr('data-value',i).append('<div class="word-term-ipa  front-image">' + ranWordArr[i].words + '</div>');
            }
            
            $('#card-wrap-'+ranNumArr[2*i + 1]).attr('data-value',i).append('<div class="word-term-ipa front-image">' + ranWordArr[i].term + '</span></div>');
        }
        $('.front-image').hide().css({
            'width':'0px',
            'margin-left':'70px'
        });
        $('.plus-ten,.minus-one').css({
            'font-size':'20px',
            'opacity':0.3
        }).hide();
        
        startTime = new Date();
        timer = setTimeout("timedCount()",1000);
    }
    
    function finishGame(){
        canPlay = false;
        $('#result-board-point').text(realScore);
        $('#result-board-time').text($('#timer-label').text());
        $('#result-board-click').text(click);
        $('#card-container,#word-term-container').fadeOut(1000,function(){
            playSound(baseUrl + '/audio/memorise-game/cheer.mp3');
            $('#memorise-game-result-board').fadeIn(1000);
        });
        if (realScore >= 8 * numOfWord) {
            score = 100;
        } else if (realScore <= 0) {
            score = 0;
        } else {
            score = Math.floor((realScore / (8 * numOfWord)) * 100);
        }
        $("#score-text").text(score);
        var numOfCorrect = numOfWord - $('.not-selected').length/2;
        $("#num-of-correct-answers-result").text(numOfCorrect + '/' + numOfWord);
    }
    
    displayActivity();
    editGUI();
    
    $('.card-wrap').click(function(){
        if ($(this).hasClass('not-selected') && ($('.not-selected[data-flip="1"]').length <= 2)) {
            click++;
            flipCard($(this).attr('id'));   
        }
    })
        
    $('#play-again, #redo').click(function(){
        $('.front-image').remove();
        $('.word-term').text('').addClass('term-blank').removeClass('word-term');
        $('.card-wrap').attr('data-flip','0').addClass('not-selected');
        $('.back-image').show().css({
            'width':'130px',
            'margin-left':'0px',
            'opacity':'1'
        });
        $('#score-label').text('0 points');
        displayActivity();
        editGUI();
    });
    
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        finishGame();
    }); 
    
    $("#go-to-next").click(function(){
        window.location.replace(nextActivityUrl);
    }); 
    
});