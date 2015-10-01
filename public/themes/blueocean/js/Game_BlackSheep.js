/**
 * Author: Dinh Doan
 */
$(document).ready(function() {
    displayActivity();
    
    if (defaultLanguage == 'en') {
        multiLangSystem.title_correct_many_times = ' in row';
        multiLangSystem.title_level = 'Level ';
    } else {
        multiLangSystem.title_correct_many_times = ' câu liên tiếp ';
        multiLangSystem.title_level = 'Cấp độ ';
    }
});

var audioSrc = baseUrl + '/audio/';
var groups = activityContent.word_groups;
var words; // Data

// Khởi tạo các biến cần dùng
var level = 1;
var score = 0;
var timeLeft = 20;
var correctTimes = 0; // số lần đúng (tạm)
var wrongTimes = 0; // số lần sai (tạm)
var totalCorrect = 0; // tổng số câu đúng
var curWordSet;
var key;  // đáp án của bộ từ đang làm
var intervalID;
var gameOver = false;
var msgList = []; // danh sách các message
var hasMsg = false;
var startTime; // thời gian bắt đầu

function displayActivity() {
    $('#intro-scene').prepend('<div id="btn-start" class="global-button-orange-3">' + multiLangSystem.button_play_now + '</div>');
    $('#intro-scene').prepend('<img src="' + baseUrl + '/themes/blueocean/img/Game-BlackSheep-Intro.png" alt="Introduction" />');
    
    // Start game    
    $('#btn-start').click(function() {
        $('#game-audio-intro').remove();
        $('#game-audio-intro').remove();
        $('#activity-container').append('<div class="submitDiv global-submit-div">'
            + '<div id="btn-endgame" class="global-button-green-1">' + multiLangSystem.button_finish + '</div>'
            + '</div>');
        $('#main-scene').fadeIn(500, function() {
            words = initData();
            startTime = new Date().getTime();
            displayNewWordSet();
        });
        $('#intro-scene').hide();
        $('#intro-scene').next('.submitDiv').hide();
        
        // Finish
        $('#btn-endgame').click(function() {
            endGame();
        });
    });
    
    // Play again
    $('#game-over .play-again').click(function() {
        playAgain();
    });
    
    $('#btn-load-result').on('click', function() {
        window.location = resourceUrl + nextActivityUrl;
    });
}

/**
* Sinh html hiển thị nhóm mới
*/
function displayNewWordSet() {
    if (gameOver || hasMsg) {
        return;
    }
    
    // Tạo bộ từ hiện tại
    curWordSet = getWordSet(level);
    key = curWordSet[0];
    shuffle(curWordSet);
    
    if ($('#game-board .unfinished').size() == 0) {
        $('#game-board').append('<div class="unfinished"><div class="word-group-wrapper"></div></div>');
    } else {
        $('#game-board .unfinished .word-group-wrapper').stop(true, true).html('').fadeOut(500);
    }
    
    $('#game-board .unfinished').css({
        'bottom' : function() {
            var finishedAmount = $('#game-board .finished').size();
            return finishedAmount * 50 + 14;
        }
    });
    
    for (var i = 0; i < curWordSet.length; i++) {
        $('#game-board .unfinished .word-group-wrapper').append('<div class="unselected" data-value="' + htmlEncode(curWordSet[i]) + '">' + curWordSet[i] + '</div>');
    }
    
    $('#game-board .unfinished .word-group-wrapper').stop(true, true).fadeIn(500);
    
    // Timer
    clearInterval(intervalID);
    runTimer();
    
    /*
    * CLICK EVENT ========
    */
    $('.unfinished .word-group-wrapper .unselected').click(function() {
        var userAns = $(this).attr('data-value');
        if (compareTwoString(userAns, htmlEncode(key))) {
            increaseScore();
            totalCorrect++;
            correctTimes++;
            
            // Điểm thưởng
            if (correctTimes != 0 && correctTimes % 5 == 0) {
                addPlusMark();
                hasMsg = true;
                var msg = {};
                msg.type = 1;
                msg.content = correctTimes + multiLangSystem.title_correct_many_times + '+' + correctTimes * 20;
                msgList.push(msg);
            }
            
            // Tăng Level
            if ((totalCorrect % 5 == 0) && (level < 10)) {
                level++;
                level = level > 9 ? 10 : level;
                hasMsg = true;
                msg = {};
                msg.type = 2;
                msg.content = multiLangSystem.title_level + level;
                msgList.push(msg);
            }
            
            // Hiển thị bộ từ mới khi ko có message
            if (!hasMsg) {
                displayNewWordSet();
            } else {
                displayMessage();
            }
        } else {
            playSound(audioSrc + 'incorrect.mp3');
            frozenWordSet($(this));
        }
        rebuildResult();
    });
}

var msgOffset = 0;
function displayMessage() {
    if (msgList.length == 0) {
        $('#game-board .unfinished').children().show();
        return;
    }
    $('#game-board .unfinished').children().hide();
    
    // type = 1: điểm thưởng
    // type = 2: level up
    var msgType = msgList[msgOffset].type;
    switch (msgType) {
        case 1:
            playSound(audioSrc + 'plusmark.mp3');
            break;
        case 2:
            playSound(audioSrc + 'levelup.mp3');
            break;
        default:
            break;
    }
    
    
    var msg = msgList[msgOffset].content;
    $('#game-board .unfinished').append('<h1 id="msg-board">' + msg + '</h1>');
    $('h1#msg-board').css({
        'width' : '100%'
        ,
        'text-align' : 'center'
        ,
        'max-height' : '38px'
        ,
        'bottom' : '2px'
        ,
        'background-color' : 'white'
        ,
        'position' : 'absolute'
        , 
        'color' : '#fca302'
        , 
        'font-size' : '26px'
        , 
        'font-weight' : 'bold'
        , 
        'display' : 'none'
    }).fadeIn(1000).fadeOut(1000, function() {
        $('h1#msg-board').remove();
        if (msgOffset == msgList.length - 1) {
            hasMsg = false;
            displayNewWordSet();
            $('#game-board .unfinished').children().show();
            msgList = [];
            msgOffset = 0;
            return;
        }
        msgOffset++;
        displayMessage();
    });
}

function runTimer() {
    switch (level) {
        case 1:
            timeLeft = 20;
            break;
        case 2:
            timeLeft = 19;
            break;
        case 3:
            timeLeft = 18;
            break;
        case 4:
            timeLeft = 17;
            break;
        case 5:
            timeLeft = 16;
            break;
        case 6:
            timeLeft = 15;
            break;
        case 7:
            timeLeft = 14;
            break;
        case 8:
            timeLeft = 13;
            break;
        case 9:
            timeLeft = 12;
            break;
        default:
            timeLeft = 10;
            break;
    }
    
    $('#game-board .time.number').text(timeLeft);
    intervalID = setInterval('decreaseTimeLeft()', 1000);
}

function decreaseTimeLeft() {
    if (gameOver || hasMsg) {
        return;
    }
    
    timeLeft--;
    $('#game-board .time.number').text(timeLeft);
    if (timeLeft == 0) {
        clearInterval(intervalID);
        frozenWordSet();
        displayNewWordSet();
    }
}

function increaseScore() {
    playSound(audioSrc + 'ding.mp3');
    var plus = level * 10;
    score += plus;
    $('#game-board .score.text').children('.plus-mark').hide().text('+ ' + plus).fadeIn(500).fadeOut(500);
}

function rebuildResult() {
    $('#game-board .level.number').text(level);
    $('#game-board .score.number').text(score);
}

/**
    * Đóng băng
    */
function frozenWordSet(objClicked) {
    if (!objClicked) { // hết time, tự động frozen
        $('#game-board .unfinished .unselected').unbind('click');
        $('#game-board .unfinished .unselected').each(function() {
            if (compareTwoString($(this).attr('data-value'), htmlEncode(key)))  {
                $(this).addClass('selected');
                return false;
            }
            return true;
        });
        $('#game-board .unfinished').removeClass('unfinished').addClass('finished');
    } else {
        objClicked.parent().parent().removeClass('unfinished').addClass('finished');
        objClicked.addClass('selected');
        objClicked.unbind('click').siblings('.unselected').unbind('click');
    }
    
    correctTimes = 0;
    wrongTimes++;
    if (wrongTimes == 6) {
        gameOver = true;
        endGame();
        clearInterval(intervalID);
    } else {
        displayNewWordSet();
    }
}

function playAgain() {
    $('#btn-load-result').parent().hide();
    $('#game-over').fadeOut(1000, function() {
        $('#main-scene').fadeIn(1000, function() {
            displayNewWordSet();
            resetMarks();
        });
        $('#btn-endgame').parent().show();
        $('#game-board').children('.result-board').siblings().remove();
    });
    resetMarks();
}

function resetMarks() {
    level = 1;
    score = 0;
    correctTimes = 0;
    wrongTimes = 0;
    totalCorrect = 0;
    gameOver = false;
    startTime = new Date().getTime();
}

function endGame() {
    playSound(audioSrc + 'gameover.mp3');
    $('#btn-endgame').parent().stop(true, true).fadeOut(1000);
    $('#main-scene').fadeOut(1000, function() {
        $('#game-over .score .number').text(score);
        $('#game-over .level .number').text(level);
        $('#game-over .time .number').text(secondsToHms((new Date().getTime() - startTime) / 1000));
        $('#game-over').fadeIn(1000);
        $('#game-over').after($('#btn-load-result').parent().show());
    });
}

/**
    * Chuyển từ số lượng giây thành HH:mm:ss
    * ví dụ: 16.4534 giây sẽ trở thành 00:00:16
    */
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + "." : "00.") + (m > 9 ? (h > 0 && m < 10 ? "0" : "") + m + "." : (m < 0 ? "00." : "0" + m + ".")) + (s < 10 ? "0" : "") + s);
}

/**
    * Thưởng điểm khi đúng liên tiếp
    */
function addPlusMark() {
    score += correctTimes * 20;
}

/**
    * Tạo ra 1 bộ từ tùy theo level
    * @param level số lượng trong bộ từ tạo ra phụ thuộc vào tham số này
    */
function getWordSet(level) {
    var wordSet = [];
    var wordAmount;
    if (level < 4) {
        wordAmount = 3;
    } else if (level > 3 && level < 7) {
        wordAmount = 4;
    } else if (level > 6 && level < 10) {
        wordAmount = 5;
    } else {
        wordAmount = 6;
    }
    
    var ranGroupIndex = randomFromTo(0, words.length - 1);
    var ranGroupChildIndex1 = randomFromTo(0, words[ranGroupIndex].length - 1);
    var ranGroupChildIndex2;
    
    // Chọn ra 2 Group Child, lặp như này để đảm bảo chúng ko bị trùng
    while (true) {
        ranGroupChildIndex2 = randomFromTo(0, words[ranGroupIndex].length - 1);
        if (ranGroupChildIndex2 != ranGroupChildIndex1) {
            break;
        }
    }
    
    // Chọn tập hợp từ
    var ranWordValue = words[ranGroupIndex][ranGroupChildIndex1][randomFromTo(0, words[ranGroupIndex][ranGroupChildIndex1].length - 1)];
    wordSet.push(ranWordValue); // key
    
    // Các từ còn lại
    var len = words[ranGroupIndex][ranGroupChildIndex2].length;
    var tmp = [];
    for (var i = 0; i < len; i++) {
        tmp.push(words[ranGroupIndex][ranGroupChildIndex2][i]);
    }
    shuffle(tmp);
    return wordSet.concat(tmp.slice(0, wordAmount - 1));
}

/**
    * Chia theo || và dấy phẩy để lấy word
    * <br />Sử dụng mảng 2 chiều
    * <ul>
    * <li>Chiều 1: Từng group được chia theo ||</li>
    * <li>Chiều 2: Từng word được chia theo dấu , từ group</li>
    * </ul>
    */
function initData() {
    var data = [];
    for (var i = 0; i < groups.length; i++) {
        var content = groups[i].content;
        var splitedGroup = content.split('||');
        var arrGroup = [];
        for (var j = 0; j < splitedGroup.length; j++) {
            var splitedWord = splitedGroup[j].split(','); // từng từ
            var arrWordInGroup = [];
            for (var k = 0; k < splitedWord.length; k++) {
                // Lưu từ
                arrWordInGroup.push($.trim(splitedWord[k]));
            }
            // Lưu từng cục ||
            arrGroup.push(arrWordInGroup);
        }
        // Lưu từng nhóm
        data.push(arrGroup);
    }
    return data;
}