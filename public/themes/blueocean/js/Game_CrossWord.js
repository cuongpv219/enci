/**
 * Author: Dinh Doan
 */

function WordDOM(id, wordNumber, result, startPosition, uiSelected, verOrHor, clue) {
    this.id = id;
    this.wordNumber = wordNumber; // số thứ tự câu
    this.wordNumberDOM = null; // div tròn màu đỏ chứa số thứ tự
    this.startPosition = startPosition; // tọa độ bắt đầu của từ
    this.uiSelected = uiSelected; // mảng chứa các kí tự của từ
    this.verOrHor = verOrHor; // ngang hay dọc
    this.result = result; // đáp án
    this.clue = clue; // manh mối
    this.finish = false; // đã đc nhấn enter chưa
    this.keyIndex = -1; // vị trí của kí tự là KEY trong result
}

$(document).ready(function() {
    var audioSrc = baseUrl + '/audio/';
    var wordDOMArr = [];
    var gameScore = 0;
    var hintTimes = 5; // số lần được click hint
    var curWordDOM = null;
    var timeSeconds = 0;
    var intervalID;
    var AMOUNT_HORIZENTAL = 20;
    var AMOUNT_VERTICAL = 20;
    var characterActiveFocus = null; // textbox đang đc chọn
    var crossWordLang = {};
    
    if (defaultLanguage == 'en') {
        crossWordLang.cannot_use_hint = 'Cannot use hint';
        crossWordLang.used_hint = 'You cannot use hint more than once for each character';
        crossWordLang.choose_valid_cross_word = 'You must choose a valid Cross Word to use this function';
    } else {
        crossWordLang.cannot_use_hint = 'Không thể sử dụng gợi ý';
        crossWordLang.used_hint = 'Bạn không thể sử dụng hint nhiều lần cho 1 ô chữ';
        crossWordLang.choose_valid_cross_word = 'Bạn phải chọn 1 từ thích hợp để sử dụng chức năng này';
    }
    
    displayActivity();

    function displayActivity() {
        // Tạo lưới
        createGrid();
        
        // Xử lí dữ liệu đầu vào
        wordDOMArr = getData();
        
        // Dữ liệu cho phần Topic
        initTopicData();
        
        // KEY UP & FOCUS CHO TEXTBOX
        $('#words-wrapper .character').keyup(function(event) {
            if (!curWordDOM || curWordDOM.finish) {
                return;
            }

            switch (event.which) {
                case 13: // enter
                    pressEnter($(this));
                    break;
                    
                case 8: // backspace
                    pressBackspace($(this));
                    break;
                    
                case 9: // tab
                    break;
                    
                default: // any
                    var newChar = String.fromCharCode(event.which);
                    var pattern = /[^a-zA-Z0-9]/;
                    if (!newChar.match(pattern)) {
                        typeChar(newChar, $(this));
                    }
                    break;
            }
        }).focus(function() {
            if (!$(this).hasClass('character-active') || $(this).attr('data-finish')) {
                $(this).blur();
            } else {
                $(this).select();
            }
        });
        
        /*
         * EVENT CLICK
         */

        // Start game    
        $('#main-scene').show();
        for (var i = 0; i < wordDOMArr.length; i++) {
            insertWordNumber(wordDOMArr[i]); // Thêm dấu tròn đỏ
        }
                
        // Đếm thời gian
        intervalID = setInterval(increaseTime, 1000);
    
        // Click hint
        $('#info-board .btn-hint').click(function() {
            runHint(this);
        });
    
        // Game over
        $('#info-board #btn-endgame').click(function() {
            endGame();
        });
        
        // Finish - Next activity
        $('.btn-next-activity').click(function() {
            Ucan.Function.Navigation.nextActivity();
        });
        
        // Review Crossword
        $('#game-over .review').click(function() {
            reviewCrossword();
        });
    }
    
    /**
     * Review Crossword
     */
    function reviewCrossword() {
        $('#game-over-wrapper').fadeOut(500);
        $('#main-scene').fadeIn(500);
        
        if ($('#score-clue-wrapper').children('.clue-review').size() > 0) {
            return;
        }
        
        // Đổi màu wordNumber & character thành active và set text
        $('#score-clue-wrapper').html('');
        for (var i = 0; i < wordDOMArr.length; i++) {
            var wd = wordDOMArr[i];
            
            // WordNumber active
            var wnd = wd.wordNumberDOM;
            if (!wnd.hasClass('word-number-active')) {
                wnd.addClass('word-number-active').unbind('click');
                if (wnd.width() < 20) {
                    wnd.addClass('word-number-active');
                }
            }
            
            // Character active
            for (var j = 0; j < wd.uiSelected.length; j++) {
                wd.uiSelected[j].val(wd.result[j]).removeClass('character-active');
            }

            // Hiện màu vàng nền nếu có là KEY
            if (wd.keyIndex != -1) {
                $(wd.uiSelected[wd.keyIndex]).addClass('is-key');
            }
        }
        
        // Sort
        for (i = 0; i < wordDOMArr.length; i++) {
            for (j = i + 1; j < wordDOMArr.length; j++) {
                if (parseInt(wordDOMArr[j].wordNumber) < parseInt(wordDOMArr[i].wordNumber)) {
                    var tmp = wordDOMArr[j];
                    wordDOMArr[j] = wordDOMArr[i];
                    wordDOMArr[i] = tmp;
                }
            }
            
            // Hiện clue ở bên phải
            $('#score-clue-wrapper').append('<div class="clue-review">'
                + '<div class="number">' + wordDOMArr[i].wordNumber + '</div>'
                + '<div class="content">' + wordDOMArr[i].clue + '</div>'
                + '</div>');
        }
    }
    
    /**
     * End Game
     */
    function endGame() {
        clearInterval(intervalID);
        $('#game-over-wrapper').fadeIn(1000);
        $('#main-scene').hide();
        
        // Tính bonus
        var bonus = getBonus();
        
        $('#game-over .score .number').text(gameScore);
        $('#game-over .bonus .number').text(bonus);
        $('#game-over .play-time .number').text(secondsToHms(timeSeconds));
        $('#game-over .play-time .number').text(secondsToHms(timeSeconds));
        $('#game-over .total .number').text(gameScore + bonus);
    }
    
    /**
     * Tính bonus
     */
    function getBonus() {
        if (gameScore == wordDOMArr.length * 100) {
            return 1000;
        }
        return 0;
    }
    
    /**
     * Tăng thời gian
     */
    function increaseTime() {
        $('#game-board .time').text(secondsToHms(++timeSeconds));
    }
    
    /**
     * Chuyển từ số lượng giây thành HH:mm:ss
     * ví dụ: 16.4534 giây sẽ trở thành 00:00:16
     * @param seconds số giây
     */
    function secondsToHms(seconds) {
        seconds = Number(seconds);
        var h = Math.floor(seconds / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 3600 % 60);
        return ((h > 0 ? h + "." : "00.") + (m > 9 ? (h > 0 && m < 10 ? "0" : "") + m + "." : (m < 0 ? "00." : "0" + m + ".")) + (s < 10 ? "0" : "") + s);
    }
    
    /**
     * Khi click nút Hint thì disable 1 lần hint và Hiện 1 kí tự trong từ hiện tại
     */
    function runHint(btnHint) {
        if (!curWordDOM || curWordDOM.finish) {
            displayHintError(crossWordLang.choose_valid_cross_word);
            return;
        }
        
        if (hintTimes < 1) {
            displayHintError(crossWordLang.cannot_use_hint);
            return;
        }
        
        if (!characterActiveFocus.attr('data-hint')) {
            characterActiveFocus.attr('data-hint', 'used');
            playSound(audioSrc + 'cross_word_correct.mp3');
            $(btnHint).siblings('.hint-circle-active:first').removeClass('hint-circle-active').addClass('hint-circle-inactive');
            hintTimes--;
            for (var i = 0; i < curWordDOM.uiSelected.length; i++) {
                if (isSameCoordinate(characterActiveFocus, curWordDOM.uiSelected[i])) {
                    $(curWordDOM.uiSelected[i]).val(curWordDOM.result[i]);
                    jumpToFirstEmptyCharacter();
                    break;
                }
            }
        } else {
            displayHintError(crossWordLang.used_hint);
        }

        var finish = true;
        for (i = 0; i < curWordDOM.uiSelected.length; i++) {
            if ($.trim($(curWordDOM.uiSelected[i]).val()) == '') {
                finish = false;
            }
        }

        if (finish) {
            pressEnter();
        }
    }
    
    function displayHintError(msg) {
        $('#score-clue-wrapper > p').text(msg).stop(true, true).fadeIn(500).delay(2000).fadeOut(1000);
    }
    
    function jumpToFirstEmptyCharacter() {
        for (var i = 0; i < curWordDOM.uiSelected.length; i++) {
            if ($.trim($(curWordDOM.uiSelected[i]).val()) == '') {
                curWordDOM.uiSelected[i].focus();
                return;
            }
        }
    }
    
    /**
     * Event khi ấn enter
     */
    function pressEnter() {
        // Kiểm tra đúng sai
        var userAns = '';
        for (var i = 0; i < curWordDOM.uiSelected.length; i++) {
            var iter = $(curWordDOM.uiSelected[i]);
            userAns += iter.val();
        }
        if (!compareTwoString(userAns, curWordDOM.result)) {
            playSound(audioSrc + 'cross_word_incorrect.mp3');
            return false;
        }
        
        // Trả lời đúng
        for (i = 0; i < curWordDOM.uiSelected.length; i++) {
            $(curWordDOM.uiSelected[i]).removeClass('character-active');
        }
        playSound(audioSrc + 'cross_word_ding.mp3');
        
        // Hiện màu vàng nền nếu có là KEY
        if (curWordDOM.keyIndex != -1) {
            $(curWordDOM.uiSelected[curWordDOM.keyIndex]).addClass('is-key');
        }
        
        // Hiển thị tăng điểm
        increaseMark();
        
        // Thêm thuộc tính là đã Finish
        curWordDOM.finish = true;
        for (i = 0; i < curWordDOM.uiSelected.length; i++) {
            $(curWordDOM.uiSelected[i]).attr('data-finish', true);
            $(curWordDOM.uiSelected[i]).blur();
        }
        return true;
    }
    
    /**
     * Event khi ấn nút xóa
     */
    function pressBackspace(curTextBox) {
        var first = curWordDOM.uiSelected[0];
        if (isSameCoordinate(curTextBox, first)) {
            for (var i = 0; i < curWordDOM.uiSelected.length; i++) {
                if (!$(curWordDOM.uiSelected[i]).attr('data-finish')) {
                    curWordDOM.uiSelected[i].focus();
                    return;
                }
            }
            return; // thoát đệ quy nếu ở ô đầu tiên
        }
        
        if (curWordDOM.verOrHor == 0) {
            curTextBox = curTextBox.prev();
            if (curTextBox.attr('data-finish')) {
                pressBackspace(curTextBox);
                return;
            }
            curTextBox.focus().select();
        } else {
            curTextBox = getPreviousCharaterByVertical(curTextBox).focus().select();
        }
        
        if (curTextBox.attr('data-finish')) {
            pressBackspace(curTextBox);
        }
    }
    
    function isSameCoordinate(a, b) {
        if ($(a).attr('data-x') == $(b).attr('data-x')
            && $(a).attr('data-y') == $(b).attr('data-y')) {
            return true;
        }
        return false;
    }
    
    /**
     * Event khi gõ
     * @param newChar charCode đã được chuyển thành String
     * @param curTextBox textbox đang chứa con trỏ
     */
    function typeChar(newChar, curTextBox) {
        var last = curWordDOM.uiSelected[curWordDOM.uiSelected.length - 1];
        if (!curTextBox.attr('data-finish')) {
//            curTextBox.val(newChar);
            if (!remainEmptyCharacter()) {
                if (pressEnter()) {
                    return;
                }
            }
        }
        
        if (curWordDOM.verOrHor == 0) {
            curTextBox = curTextBox.next().focus().select();
        } else {
            curTextBox = getNextCharaterByVertical(curTextBox).focus().select();
        }
        if (isSamePosition(curTextBox, last)) {
            if (curTextBox.attr('data-finish')) {
                for (var i = curWordDOM.uiSelected.length - 1; i > 0; i--) {
                    if (!$(curWordDOM.uiSelected[i]).attr('data-finish')) {
                        $(curWordDOM.uiSelected[i]).focus();
                        break;
                    }
                }
            }
            return; // thoát đệ quy nếu ở ô cuối cùng
        }

        if (curTextBox.attr('data-finish')) {
            typeChar(newChar, curTextBox);
        }
    }
    
    function remainEmptyCharacter() {
        for (var i = 0; i < curWordDOM.uiSelected.length; i++) {
            if ($(curWordDOM.uiSelected[i]).val() == '') {
                return true;
            }
        }
        return false;
    }
    
    function isSamePosition(charA, charB) {
        if (charA.attr('data-x') == charB.attr('data-x')
            && charA.attr('data-y') == charB.attr('data-y')) {
            return true;
        }
        return false;
    }
    
    function getNextCharaterByVertical(curTextBox) {
        for (var i = 0; i < AMOUNT_HORIZENTAL; i++) {
            curTextBox = curTextBox.next();
        }
        return curTextBox;
    }
    function getPreviousCharaterByVertical(curTextBox) {
        for (var i = 0; i < AMOUNT_HORIZENTAL; i++) {
            curTextBox = curTextBox.prev('.character');
        }
        return curTextBox;
    }
    
    /**
     * Tăng điểm
     */
    function increaseMark() {
        gameScore += 100;
        $('#info-board .game-score .plus-mark').text('+100').stop(true, true).fadeIn(1000).fadeOut(1000);
        $('#info-board .game-score .value').text(gameScore);
    }
    
    /**
     * Tìm đối đượng WordDOM theo ID
     * @param id id của nó
     * @return WordDOM object
     */
    function getWordDOMByID(id) {
        for (var i = 0; i < wordDOMArr.length; i++) {
            if (wordDOMArr[i].id == id) {
                return wordDOMArr[i];
            }
        }
        return null;
    }
    
    function initTopicData() {
        $('#intro-scene').prepend('<div id="btn-start" class="global-button-orange-3 global-text-align-center">' + multiLangSystem.button_play_now + '</div>');
        $('#intro-scene').prepend('<img src="' + baseUrl 
            + '/themes/blueocean/img/Game-CrossWord-Intro.png" alt="Introduction"/>');
        
        // Topic content
        var topicIntro;
        if (activityContent.topic_intro.indexOf('[') != -1) {
            topicIntro = highlightInBracket(activityContent.topic_intro);
        } else {
            topicIntro = activityContent.topic_intro;
        }
        var topicImg = activityContent.topic_image;
        $('#game-topic').append('<div class="text">' + topicIntro + '</div><img src="' + resourceUrl + topicImg + '" alt="Introduction" />');
    }
    
    /**
     * Xử lí dữ liệu lấy đc từ util
     */
    function getData() {
        var words = activityContent.words.slice(0, -2).split('||');
        var data = [];
        for (var i = 0; i < words.length; i++) {
            // Create new instance
            var wordDOM = new WordDOM();
            var splitted = words[i].split('--');
            wordDOM.id = splitted[0];
            wordDOM.wordNumber = splitted[1];
            wordDOM.result = splitted[2];
            wordDOM.startPosition = splitted[3];
            wordDOM.verOrHor = splitted[4];
            wordDOM.clue = splitted[5];
            wordDOM.uiSelected = getReferrencesAndSetText(wordDOM);
            wordDOM.keyIndex = splitted[7];
            data.push(wordDOM);
        }
        
        return data;
    }
    
    /**
     * Tính index của kí tự là KEY trong thuộc tính result của WordDOM
     * @param result thuộc tính của WordDOM
     */
    function getKeyIndex(result) {
        result.indexOf('[');
    }
    
    /**
     * Tạo ra tham chiếu tương tự uiSelected giống bên util và set text cho từng ô
     * @param wd đối tượng WordDOM
     * @return mảng tham chiếu tới các từ đó
     */
    function getReferrencesAndSetText(wd) {
        var references = [];
        var x = wd.startPosition.split(',')[0];
        var y = wd.startPosition.split(',')[1];
        
        $('#words-wrapper .character').each(function() {
            if (x == $(this).attr('data-x') && y == $(this).attr('data-y')) {
                var curPos = $(this).css('visibility', 'visible').attr('data-belong-to', wd.id); // ô đầu tiên
                references.push(curPos);
                if (wd.verOrHor == 0) { // nếu là ngang
                    for (var i = 1; i < wd.result.length; i++) {
                        curPos = $(curPos).next().css('visibility', 'visible').attr('data-belong-to', wd.id);
                        references.push(curPos);
                    }
                } else { // nếu là dọc
                    for (i = 1; i < wd.result.length; i++) {
                        for (var j = 0; j < 20; j++) { // next 20 lần
                            curPos = curPos.next();
                        }
                        curPos.css('visibility', 'visible').attr('data-belong-to', wd.id);
                        references.push(curPos);
                    }
                }
                return false;
            }
            return true;
        });
        return references;
    }
    
    /**
     * Thêm dấu tròn đỏ - chỉ số của từ đang định thêm. Trong này code thêm cả lệnh click cho nó luôn
     * @param wd đối tượng WordDOM cần thao tác
     */
    function insertWordNumber(wd) {
        $('#game-board').append('<div class="word-number" data-belong-to="' + wd.id + '"></div>');
        
        var top = wd.uiSelected[0].position().top;
        var left = wd.uiSelected[0].position().left;
        wd.wordNumberDOM = $('#game-board .word-number:last').text(wd.wordNumber);
        if (wd.verOrHor == 0) {
            wd.wordNumberDOM.css({
                'top' : top + 31,
                'left' : left + 8
            });
        } else {
            wd.wordNumberDOM.css({
                'top' : top + 8,
                'left' : left + 31
            });
        }
        
        // Click vào word number
        wd.wordNumberDOM.click(function() {
            // Gán tham chiếu tới WordDOM hiện tại
            curWordDOM = wd;
            
            // Focus first
            for (var i = 0; i < curWordDOM.uiSelected.length; i++) {
                if (!$(curWordDOM.uiSelected[i]).attr('data-finish')) {
                    wd.uiSelected[i].focus();
                    break;
                }
            }
            
            // Bỏ chọn các câu khác
            for (i = 0; i < wordDOMArr.length; i++) {
                if (wordDOMArr[i].wordNumberDOM.hasClass('word-number-active')) {
                    for (var j = 0; j < wordDOMArr[i].uiSelected.length; j++) {
                        wordDOMArr[i].uiSelected[j].removeClass('character-active');
                    }

                    if (!wordDOMArr[i].finish) {
                        wordDOMArr[i].wordNumberDOM.removeClass('word-number-active');
                    }

                    // Áp dụng cho hình bé
                    if (!wordDOMArr[i].finish && wordDOMArr[i].wordNumberDOM.width() < 20) {
                        wordDOMArr[i].wordNumberDOM.addClass('word-number-small');
                    }
                    
                    if (!wordDOMArr[i].finish) {
                        break;
                    }
                }
            }
            
            // Thêm style active
            for (i = 0; i < wd.uiSelected.length; i++) {
                var iter = wd.uiSelected[i];
                iter.addClass('character-active');
            }

            // Change BG
            if ($(this).width() < 20) {
                $(this).addClass('word-number-active');
            } else {
                $(this).addClass('word-number-active');
            }
            
            // Set clue
            $('#info-board .clue').val(htmlEncode(wd.clue));
        });

        // Thu nhỏ số thứ tự nếu đè lên nhau với câu khác
        for (var i = 0; i < wordDOMArr.length; i++) {
            var x1 = wordDOMArr[i].uiSelected[0].attr('data-x');
            var y1 = wordDOMArr[i].uiSelected[0].attr('data-y');
            var x2 = wordDOMArr[i].uiSelected[wordDOMArr[i].uiSelected.length - 1].attr('data-x');
            var y2 = wordDOMArr[i].uiSelected[wordDOMArr[i].uiSelected.length - 1].attr('data-y');
            var xa = wd.uiSelected[0].attr('data-x');
            var ya = wd.uiSelected[0].attr('data-y');
            var xb = wd.uiSelected[wd.uiSelected.length - 1].attr('data-x');
            var yb = wd.uiSelected[wd.uiSelected.length - 1].attr('data-y');
            if ((x1 - xa) * (y1 - ya) == -1 
                && angleCoef(x1, y1, x2, y2) * angleCoef(xa, ya, xb, yb) == -1
                && !isJunction(wordDOMArr[i], wd)) {
                resizeWordNumberSmaller(wd);
                break;
            }
        }
    }
    
    /**
     * Kiểm tra 2 đường cắt nhau
     */
    function isJunction(wd1, wd2) {
        var vertical;
        var horizental;
        if (wd1.verOrHor == 0) {
            vertical = wd2;
            horizental = wd1;
        } else {
            vertical = wd1;
            horizental = wd2;
        }
        
        if (vertical.uiSelected[1].attr('data-x') == horizental.uiSelected[1].attr('data-x')) {
            return true; 
        }
        return false;
    }
    
    /**
     * Tính hệ số góc
     */
    function angleCoef(x1, y1, x2, y2) {
        if (x1 == x2 && y1 == y2) {
            return 0; // trung nhau
        }
        
        if (x1 == x2) {
            return 1;
        }
        
        if (y1 == y2) {
            return -1;
        }
        return 0;
    }
    
    /**
     * Thu nhỏ vòng tròn đỏ chứa số thứ tự khi đè lên nhau
     * @param obj đối tượng chưa wordNumber cần thu nhỏ
     */
    function resizeWordNumberSmaller(obj) {
        obj.wordNumberDOM.addClass('word-number-small').css({
            'top' : function() {
                if (obj.verOrHor == 0) {
                    return obj.uiSelected[0].position().top + 30;
                } else {
                    return obj.uiSelected[0].position().top + 14;
                }
            },
            'left' : function() {
                if (obj.verOrHor == 0) {
                    return obj.uiSelected[0].position().left + 14;
                } else {
                    return obj.uiSelected[0].position().left + 30;
                }
            }
        });
    }
    
    /**
     * Highlight kí tự trong ngoặc vuông, ví dụ ed trong từ cancelled
     * @param str Từ chứa [] để highlight
     * @return từ cũ nhưng nội dung abc[xxx] sẽ trở thành <b>abc&lt;span class="something"&gt;...&lt;/span&gt;</b>
     */
    function highlightInBracket(str) {
        var pattern = /\[(.*?)\]/g;
        var matchedStr = str.match(pattern).toString().replace(/\[/g, '').replace(/\]/g, '');
        var result = str.replace(pattern, '<span class="highlight">' + matchedStr + '</span>');
        return result;
    }
    
    /**
     * Kích cỡ lưới: 20 x 20
     */
    function createGrid() {
        for (var i = 0; i < AMOUNT_HORIZENTAL; i++) {
            for (var j = 0; j < AMOUNT_VERTICAL; j++) {
                var character = document.createElement('input');
                $(character).attr('type', 'text');
                $(character).attr('maxlength', '1');
                $(character).addClass('character');
                $(character).attr('data-x', j);
                $(character).attr('data-y', i);
                $(character).css({
                    'top': function() {
                        return i * 27;
                    },
                    'left': function() {
                        return j * 27;
                    }
                });
                $(character).focus(function() {
                    characterActiveFocus = $(this);
                });
                $('#words-wrapper').append(character);
            }
        }
    }
});