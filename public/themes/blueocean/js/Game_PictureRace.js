var curPos = 0;
var curSpeed = 40;
var index = 0;
var count = activityContent.card.length;
var score = 0;
var level = 1;
var numbertrue = 0;
var surviveLeft = 5;
var jumpSpeed = 2;
var isPause = false;
var combo = 0;
var ranArr = generateRandomArr(count);
var minutes = 0;

function checkexitImg() {
    for(var i=0; i<count; i++) {
        if((parseInt($('#picture_'+i).css('left').replace("px","") ) > -122) && (parseInt($('#picture_'+i).css('left').replace("px","") ) < 1000)) 
            return true;
    }
    return false;
}

function levelUp(){
    $('#levelup').fadeOut(500,function(){
        isPause = false;
    });
   
    $('.picture').css({
        'left':'-122px',
        'display':'block'
    });
    $('.picture').attr("value",0);
    if((level%2) || (curSpeed<=20)) {
        jumpSpeed = jumpSpeed+1;
        numbertrue = 0;
    }
    else {
        curSpeed = curSpeed - 5;
        numbertrue = 0;
    }
    index = 0;
    curPos=0;
    ranArr = generateRandomArr(count);
}


function movePictures(){
    if (isPause) {
        setTimeout("movePictures()",curSpeed);
        return;
    }
    if(surviveLeft == 0) return;
    $('#survive').attr("value",curPos);
    curPos=curPos+jumpSpeed;
    $('.picture').each(function(){
        checkexitImg();
        for(var i=0; i<index; i++) {
            if((curPos>300*i)&&(parseInt($('#picture_'+ranArr[i]).css('left').replace("px","")) < 1000 )  && ($('#picture_'+ranArr[i]).attr("value")==0) ) 
            {
                $('#picture_'+ranArr[i]).css('left', (curPos-300*i) + 'px');
                if(parseInt($('#picture_'+ranArr[i]).css('left').replace("px","") ) >= 1000) {
                    $('.trueanswer').css({
                        'right':'0px',
                        'top':parseInt($('#picture_'+ranArr[i]).css('top').replace("px",""))+'px'
                    }).show();
                    $('.true-answer').html(activityContent.card[ranArr[i]].term);
                    setTimeout("$('.trueanswer').fadeOut(500)",1000);
                    for (var j=0; j<5;j++) {
                        if ( $('#survive_'+j).attr("value") == 0)  {
                            $('#survive_'+j).attr("value",1);
                            $('#survive_'+j).attr("src",baseUrl+'/themes/blueocean/img/dead.png');
                            surviveLeft--;
                            if (surviveLeft == 0) {
                                
                                $('#game-over').fadeIn(500, function() {
                                    $('#playagain').show();
                                    $('.picture').fadeOut(500);
                                    $('#game-board').css({
                                        'background-color':'#f5f5f5'
                                    });
                                })
                            }
                            break;
                        }
                    }
                }
            }  
           
            
        }
        
    })
    if (index <count) index ++;
    
    setTimeout("movePictures()",curSpeed);
}
$(document).ready(function() {
    function checkTextTypedByLearner(text, answer){
        var multiple_answer = answer.split("/");
        for (var i=0; i<multiple_answer.length;i++){
            if (isEqualString(text,multiple_answer[i])) return true;
        }
        return false;
    }
    $(document).keyup(function(event) {
        if((event.which == 13)) {
            var iftrue = false;
            var text_typed_by_learner = $('input:text[name=textbox]').val();
            for(var i=0; i<count; i++) {
                if((parseInt($('#picture_'+i).css('left').replace("px","") ) < 1000) && parseInt($('#picture_'+i).css('left').replace("px","") ) > -110)
                    if (checkTextTypedByLearner(text_typed_by_learner
                        .replace(/\s+/g, " ")
                        .replace(/^\s+|\s+$/g, "")
                        .toLowerCase()
                        , activityContent.card[i].term.toLowerCase())) {
                        var temp = parseInt($('#picture_'+i).css('left').replace("px","") );
                        $('#picture_'+i).fadeOut(500,function() {
                            $(this).attr("value",1);
                        }).css({
                            'left':'1000px'
                        });
                        $('.reward').css({
                            'left':temp+'px',
                            'top':$('#picture_'+i).css('top')
                        });
                        $('.reward').html('+1').stop(true,true).fadeIn(500).fadeOut(1000);
                        score=score+1;
                        playSound(Ucan.Resource.Audio.getHitSound()); 
                        numbertrue++;
                        combo++;
                        $('#score-number').html(score);
                        switch (numbertrue) {
                            case 6:
                                $('#levelup').html('LEVEL UP!').fadeIn(10);
                                isPause = true;
                                setTimeout("levelUp();",1000);
                                level++;
                                $('#level-number').html(level);
                                playSound(baseUrl + '/audio/game/blacksheep/levelup.mp3'); 
                                numbertrue =0;
                        //setTimeout("movePictures()",curSpeed);
                                
                        }
                        switch (combo) {
                            case 5:
                                $('#reward-combo').html('5 in row! +5').css({
                                    'left':'391px'
                                }).fadeIn(10);
                                setTimeout("$('#reward-combo').fadeOut(500)",1000);
                                score = score+5;
                                $('#score-number').html(score);
                                playSound(baseUrl + '/audio/game/blacksheep/plusmark.mp3'); 
                                break;
                            case 10:
                                $('#reward-combo').html('10 in row! +10').css({
                                    'left':'383px'
                                }).fadeIn(10);
                                setTimeout("$('#reward-combo').fadeOut(500)",15);
                                score = score + 10;
                                $('#score-number').html(score);
                                playSound(baseUrl + '/audio/game/blacksheep/plusmark.mp3'); 
                                break;
                            case 15:
                                $('#reward-combo').html('15 in row! +15').css({
                                    'left':'383px'
                                }).fadeIn(10);
                                setTimeout("$('#reward-combo').fadeOut(500)",1500);
                                score = score + 15;
                                $('#score-number').html(score);
                                playSound(baseUrl + '/audio/game/blacksheep/plusmark.mp3'); 
                                combo = 0;
                                break;
                        }
                        $('.inputtext').val("").focus();
                        iftrue = true;
                    }
                    else 
                        $('.inputtext').val("").focus();
                
            }
            if (!iftrue) {
                $('.punish').html('-2').stop(true,true).fadeIn(500).fadeOut(500);
                score=score-2;
                playSound(Ucan.Resource.Audio.getMissSound()); 
                combo = 0;
                $('#score-number').html(score);
            }
            if(!checkexitImg()) {
                for(var k=0; k<count; k++) {
                    if (curPos < 300 * k) {
                        curPos = 300*k; 
                        break;
                    }
             
                }
            }
        }
    });
    function displayActivity(){
        var pictures = [];
        var time= 0;
        $('.inputtext').click(function(){
            $(this).val("");
        });
        time = 0;
        minutes = 0;
          
        for(var i=0; i<count; i++) {
            pictures[i] = activityContent.card[i].image;
            var pictureHtml = "";
            pictureHtml += '<img class="picture" value="0" id="picture_'+i+'" src="'+ resourceUrl + pictures[i]+'"/>';
            var randompos = Math.floor(Math.random()*200);
            $('#game-board').append(pictureHtml);
            $('#picture_'+i).css({
                'top':60+randompos+'px'
            })                
        }
        $('.inputtext').val("").focus();
        setTimeout("movePictures()",300);
    }
    var time = 0;
    var minutes = 0;
    function flashText() {
        if ((time < 10) && (minutes<10))
            $('#timeleft').text('0'+minutes+':0'+time)
        else if((time<10)&&(minutes>=10))
            $('#timeleft').text(minutes+':'+time);
        else if ((time>=10)&&(minutes<10))
            $('#timeleft').text('0'+minutes+':'+time);
        else ('#timeleft').text(minutes+':'+time);
        time++;
        if (time==60) {
            minutes++;
            time = 0;
        }
    }
    displayActivity();
    setInterval(flashText, 1000);
    $('#playagain').click(function(){
        $('#game-board').show().css('background-color','#fff');
        $('.picture').css({
            'left':'-122px'
        })
        surviveLeft=5;
        level = 0;
        time = 0;
        curPos = 0;
        curSpeed = 40;
        jumpSpeed = 2;
        isPause = false;
        score = 0;
        index = 0;
        minutes = 0;
        $('#game-over').hide();
        $('#true-answer').show();
        $(this).hide();
        numbertrue = 0;
        combo = 0;
        for (var j=0; j<5; j++) {
            $('#survive_'+j).attr("value",0);
            $('#survive_'+j).attr("src",baseUrl+'/themes/blueocean/img/'+'alive.png');
        }
        $('#level-number').html('1');
        $('#score-number').html('0');
        displayActivity();
        $('.picture').show();
    })
    $('#loadResult').click(function() {
        surviveLeft = 0;
        if (score > 100) score = 100;
        if ((score < 10)&&(score >= 0))  {
            $("#score-text").html('0' + score);
        } else {
            score = 0;
            $("#score-text").html('0' +score);
        }
        $('#activity-result-correct-box').hide();
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
    })
    $('#redo').click(function(){
        $("#show-result").hide('slide', {
            direction: "left"
        }, Ucan.Constants.getHideResultSpeed(),function(){
            $('#game-board').show().css('background-color','#fff');
            $('.picture').css({
                'left':'-122px'
            });
            surviveLeft=5;
            level = 0;
            time = 0;
            curPos = 0;
            curSpeed = 40;
            jumpSpeed = 2;
            isPause = false;
            score = 0;
            index = 0;
            minutes = 0;
            $('#game-over').hide();
            $('#true-answer').show();
            $("#playagain").hide();
            numbertrue = 0;
            combo = 0;
            for (var j=0; j<5; j++) {
                $('#survive_'+j).attr("value",0);
                $('#survive_'+j).attr("src",baseUrl+'/themes/blueocean/img/'+'alive.png');
            }
            $('#level-number').html('1');
            $('#score-number').html('0');
            displayActivity();
            $('.picture').show();
        });
    })
});