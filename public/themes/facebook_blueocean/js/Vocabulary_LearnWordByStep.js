var unShowClickResult = 0;
$(document).ready(function() {
    var numViewedPage = 0;
    var wordList; // danh sách object Word
    var stage = 0; //Xem đang ở giai đoạn nào
    var curTab = 0; // tab index đang được chọn
    var tabAmount; // số lượng tab
    var imgSrc = '';
    var audioSrc = '';
    var tabDOMArr = []; // mảng chứa TabDOM
    var curTabDOM = null; // lưu tab dom hiện hành
    var ITEM_PAGINATION = 4;
    var canPlay = 0;
    if (defaultLanguage == 'en') {
        multiLangSystem.order_type_answer_press_enter = "Type your answer and press Enter to continue";
        multiLangSystem.order_retype = "Retype answer to continue"
        multiLangSystem.order_click_right = "Click right button to continue"
        multiLangSystem.order_retype_and_press_enter = "Retype answer and press Enter to continue"
    }
    else if (defaultLanguage == "vi") {
        multiLangSystem.order_click_right = "Nhấn chuột vào nút đúng để tiếp tục"
        multiLangSystem.order_type_answer_press_enter = "Hãy nhập đáp án và ấn Enter để tiếp tục";
        multiLangSystem.order_retype = "Hãy nhập lại đáp án"
        multiLangSystem.order_retype_and_press_enter = "Hãy nhập lại đáp án và ấn Enter để tiếp tục"
    }
    if (activityContent.example == "") {
        displayActivity();
    }
    $('#activity-go-to-practice').click(function() {
        if (canPlay == 1)
            return;
        displayActivity();
        canPlay = 1;
    })
    $('#activity-practice-nav').click(function() {
        if (canPlay == 1)
            return;
        displayActivity();
        canPlay = 1;
    })
    /**
     * Giao diện chương trình
     */
    function displayActivity() {
        // Tạo danh sách đối tượng Word
        wordList = getData(activityContent.card);
        // Tính số lượng Tab
        tabAmount = getPaginationAmount(wordList.length, ITEM_PAGINATION);
        // Hiển thị các Tab và lệnh click cho nó
        displayTab();
        if (tabAmount < 2) {
            $('#activity-container .global-tab-container').hide();
        }
        // Nội dung ở giữa

        createContent();
        // hiện tab 0
        moveToTab(curTab);
    }
    /**
     * Tạo nội dung ở giữa. Lặp số lượng tab, 
     * ở mỗi tab sinh ra code html rồi append
     */
    function createContent() {
        for (var i = 0; i < tabAmount; i++) {
            // Làm quen
            var stageLookPicture = '';

            // Chọn ảnh
            var stageChoosePicture = '';

            // Gõ lại
            var stageTypeWord = '';

            // Chọn từ
            var stageChooseWord = '';

            // Sua lai tu cho dung
            var stageCorrectWord = '';

            // Tạo TabDOM
            var td = new TabDOM(i);

            // Tạo code HTML
            var tabContents = '<div id="link-to-tab-' + i + '" class="tab-content">';
            stageLookPicture += '<div data-order="0" class="stage-look-picture">' +
                    '<div class="pictures-block">';
            stageChoosePicture += '<div data-order="1" class="stage-choose-picture">' +
                    '<div class="pictures-block">';
            stageTypeWord += '<div data-order="2" class="stage-type-word">' +
                    '<div class="pictures-block">';
            stageCorrectWord += '<div data-order="4" class="stage-correct-word">' +
                    '<div class="pictures-block">';
            stageChooseWord += '<div data-order="3" class="stage-choose-word">' +
                    '<div class="pictures-block">';
            // 4 cái ảnh
            for (var j = 0; j < ITEM_PAGINATION; j++) {
                if (i * ITEM_PAGINATION + j >= wordList.length) {
                    break;
                }
                var word = wordList[i * ITEM_PAGINATION + j];
                td.wordList.push(word);
                stageLookPicture += '<div data-order="' + (i * ITEM_PAGINATION + j) + '" class="picture-wrapper">' +
                        '<img src="' + resourceUrl + word.img + '" alt="Image" title="' + word.term + '"/>' +
                        '<div class="caption">' + word.term + '</div>' +
                        '</div>';

                stageChoosePicture += '<div class="picture-wrapper">' +
                        '<img src="' + resourceUrl + word.img + '" alt="Image" title="Click to choose answer"/>' +
                        '<div class="caption"></div>' +
                        '</div>';

                stageTypeWord += '<div class="picture-wrapper">' +
                        '<img src="' + resourceUrl + word.img + '" alt="Image" />' +
                        '<div class="caption"></div>' +
                        '</div>';
            }

            // Đóng thẻ: hết pictures-block
            stageLookPicture += '</div>';

            /*
             * Các phần tử khác. Tùy thuộc vào từng stage
             */

            stageLookPicture += '<div class="navigator-button global-button-orange-1">' + multiLangSystem.button_continue + '</div>';
            // Đóng thẻ: hết stage-look-picture
            stageLookPicture += '</div>';

            // Đóng thẻ: hết pictures-block
            stageChoosePicture += '</div>';
            stageChoosePicture += '<div class="word-term"></div>';
            stageChoosePicture += '</div>'; // hết stage-choose-picture


            stageTypeWord += '<div class="typing-area">' +
                    '<input class="user-input" />' +
                    '<ul class="shuffle-letters"></ul>' +
                    '</div>';
            stageTypeWord += '<div class="explain"></div><div class="show-answer global-button-orange-1">' + multiLangSystem.button_show_answer + '</div></div>'; // hết pictures-block
            stageTypeWord += '</div>'; // hết stage-type-word

            stageChooseWord += '<div class="clue"></div>' +
                    '<div class="choices"></div>';
            stageChooseWord += '</div><div class="explain"></div> <div class="continue global-button-orange-1">' + multiLangSystem.button_continue + '</div></div>';
            stageCorrectWord += '<div class="clue"></div>' +
                    '<div class="true-false-container"><div class="right-button global-button-orange-1" value="0" id="radio_' + i + '_1' + '" >' + multiLangSystem.button_right + '</div>'
                    + '<div class="wrong-button global-button-orange-1" value="0" id="radio_' + i + '_0' + '" >' + multiLangSystem.button_wrong + '</div>'
                    + '<span><input type="text" name="textbox_' + i + '" disabled="disabled" class="inputtext"/></span></div><div id="infor-guide">' + multiLangSystem.order_type_answer_press_enter + '</div>';
            stageCorrectWord += '</div><div class="explain"></div><div class="continue global-button-orange-1">' + multiLangSystem.button_continue + '</div><div class="show-answer global-button-orange-1">' + multiLangSystem.button_show_answer + '</div></div>';

            // Đóng thẻ tab-content
            tabContents += stageLookPicture + stageChoosePicture + stageTypeWord + stageChooseWord + stageCorrectWord;
            tabContents += '</div>';

            // Append HTML
            $('#tab-contents').append(tabContents);

            // Tạo TabDOM & Stage
            td.dom = $('#link-to-tab-' + i);
            var stage = new Stage(0, 'Look at the picture and listen to the word', td.dom.find('.stage-look-picture'));
            td.stage.push(stage);
            stage = new Stage(1, 'Choose the correct picture', td.dom.find('.stage-choose-picture'));
            td.stage.push(stage);
            stage = new Stage(2, 'Type the word correctly', td.dom.find('.stage-type-word'));
            td.stage.push(stage);
            stage = new Stage(3, 'Choose the correct word', td.dom.find('.stage-choose-word'))
            td.stage.push(stage);
            stage = new Stage(4, 'Correct the wrong word', td.dom.find('.stage-correct-word'))
            td.stage.push(stage);
            tabDOMArr.push(td);
        }
    }

    /**
     * hiển thị các tab
     */
    function displayTab() {
        for (var i = 0; i < tabAmount; i++) {
            $('#activity-container .global-tab-container').append('<div class="unselected" data-order="' + i + '">' + (i + 1) + '</div>');
        }
        $('#activity-container .global-tab-container .unselected').click(function() {
            curTab = $(this).attr('data-order');
            moveToTab(curTab);
        });
    }

    /**
     * Nhảy tới tab khác
     */
    function moveToTab(index) {
        numViewedPage++;
        if (!canChangeTab()) {
            return;
        }
        $('#activity-container .global-tab-container').ucanMoveToTab(index);
        $('#link-to-tab-' + index).show().siblings('.tab-content').hide();
        curTabDOM = getTabDOMByID(index);
        curTabDOM.runStageEvent();
        curTab = index;
    }

    /**
     * Lấy TabDOM theo ID
     */
    function getTabDOMByID(id) {
        for (var i = 0; i < tabDOMArr.length; i++) {
            if (tabDOMArr[i].id == id) {
                return tabDOMArr[i];
            }
        }
        return null;
    }

    /**
     * Xử lí dữ liệu, thêm thắt các thứ cần thiết
     * @param wordsFromGroup danh sách từ trong Group ở database
     * @return dữ liệu đã được xử lí
     */
    function getData(wordsFromGroup) {
        var wordList = [];
        for (var i = 0; i < wordsFromGroup.length; i++) {
            var wfg = wordsFromGroup[i];

            // Kiểm tra xem nó có ảnh không
            var native_meaning = null;
            if (wfg.image == null || $.trim(wfg.image) == '') {
                native_meaning = wfg.native_meaning;
            }
            var clueword = (wfg.sample).toLowerCase().replace(new RegExp('(' + wfg.term + ')', 'gi'), '<span class="blank">_______</span>')
            var word = new Word(i, wfg.term, imgSrc + wfg.image, audioSrc + wfg.audio, clueword, native_meaning, wfg.extra);
            wordList.push(word);
        }

        //  Nếu cụm cuối chưa đủ bộ 4 từ thì ghép thêm
        var lackItem = wordsFromGroup.length - Math.floor(wordsFromGroup.length / ITEM_PAGINATION) * ITEM_PAGINATION;
        if (lackItem > 0)
        {
            lackItem = ITEM_PAGINATION - lackItem;
            var addword = [];
            for (i = 0; i < lackItem; i++) {
                // Kiem tra xem tu moi duoc tao random co trung voi nhung tu duoc them vao chua

                var concurence = 0;
                do {

                    concurence = 0;
                    addword[i] = Math.floor(Math.random() * (wordsFromGroup.length - lackItem));
                    for (j = 0; j < i; j++) {
                        if (addword[j] == addword[i]) {
                            concurence = 1;
                        }
                    }
                }
                while (concurence)
            }
            for (i = 0; i < lackItem; i++) {
                wordList.push(wordList[addword[i]]);
            }
        }
        return wordList;
    }
    /**
     * Kiểm tra xem có thể move sang tab khác không
     */
    function canChangeTab() {
        if (curTabDOM == null || curTabDOM.available) {
            return true;
        }
        return false;
    }

    function Word(id, term, img, audio, clueword, native_meaning, extra) {
        this.id = id;
        this.term = term;
        this.img = img;
        this.audio = audio;
        this.clue = clueword;
        this.native_meaning = native_meaning;
        this.explain = extra;
    }

    function TabDOM(id) {
        this.id = id;
        this.wordList = [];
        this.stage = [];
        this.currentStage = 0;
        this.dom = null;
        this.available = true; // lưu trạng thái nó đã chạy xong chưa
        this.runStageEvent = function() {
            switch (this.currentStage) {
                case 0:
                    processStage0(this);
                    break;

                case 1:
                    processStage1(this);
                    break;

                case 2:
                    processStage2(this);
                    break;

                case 3:
                    processStage3(this);
                    break;
                case 4:
                    processStage4(this);
                    break;
                default:
                    break;
            }

        };

        function processStage0(tabDOM) {
            if (tabDOM.stage[0].done) {
                return;
            }
            tabDOM.stage[0].dom.show();
            var audio = [];
            var pictureWrapper = tabDOM.stage[0].dom.find('.picture-wrapper');
            pictureWrapper.hide();
            for (var i = 1; i <= 4; i++) {
                $('.pictures-block .picture-wrapper:nth-child(' + i + ')').css({
                    'left': (244 * i - 222) + 'px'
                })
            }
            for (i = 0; i < tabDOM.wordList.length; i++) {
                var word = tabDOM.wordList[i];
                audio.push(resourceUrl + word.audio);
                // Nếu không có ảnh, chỉ hiện nghĩa tiếng anh
                if (word.img == "") {
                    tabDOM.stage[0].dom.find('.picture-wrapper').eq(i).children('img').replaceWith('<div class="blank-img"> ' + word.native_meaning + '</div>');
                }
            }
            pictureWrapper.click(function() {
                var index1 = parseInt($(this).attr('data-order'));
                index1 = index1 % 4;
                playSound(resourceUrl + tabDOM.wordList[index1].audio);
            })
            // Hiện từng ảnh
            var index = 0;
            run();
            tabDOM.available = false;
            function run() {
                try {
                    if (index == pictureWrapper.length) {
                        tabDOM.available = true;
                        tabDOM.stage[0].done = true;
                        tabDOM.stage[0].dom.find('.navigator-button').animate({
                            'opacity': 1
                        }, 1000);
                        return;
                    }
                    playSound(audio[index]);
                    $(pictureWrapper).eq(index++).stop(true, true).fadeIn(2000, function() {
                        run();
                    });
                } catch (exception) {
                    console.log(exception);
                }
            }

            // Click Continue button
            tabDOM.stage[0].dom.find('.navigator-button').click(function() {
                if (tabDOM.available) {
                    tabDOM.currentStage = 1;
                    changeToStage(tabDOM);
                }
            });
        }

        function processStage1(tabDOM) {
            if (tabDOM.stage[1].done) {
                return;
            }
            tabDOM.stage[1].done = true;
            tabDOM.stage[1].dom.show();

            //Hiển thị lại ảnh sau khi trộn
            shuffle(tabDOM.wordList);
            tabDOM.stage[1].dom.find('.picture-wrapper').each(function(index) {
                if (tabDOM.wordList[index].img != "") {
                    $(this).children('img').attr('src', resourceUrl + tabDOM.wordList[index].img);
                } else {
                    $(this).children('img').replaceWith('<div class="blank-img"> ' + tabDOM.wordList[index].native_meaning + '</div>');
                }
            });
            for (var i = 1; i <= 4; i++) {
                $('.pictures-block .picture-wrapper:nth-child(' + i + ')').css({
                    'left': (244 * i - 222) + 'px'
                })
            }
            // Random chọn chữ hiển thị
            var cloneWordList = shuffle(Object.create(tabDOM.wordList));
            var index = 0;
            var caption = cloneWordList[index].term;
            var canClick = true
            tabDOM.stage[1].dom.find('.word-term').text(caption);

            // Click chọn ảnh
            tabDOM.stage[1].dom.find('.picture-wrapper').click(function() {
                if ($(this).attr('data-done')) {
                    playSound(tabDOM.wordList[$(this).index()].audio);
                    return;
                }

                if (compareTwoString(tabDOM.wordList[$(this).index()].term, caption)) {
                    $(this).attr('data-done', true).children('.caption').text(caption);
                    playSound(resourceUrl + tabDOM.wordList[$(this).index()].audio);
                    tabDOM.stage[1].dom.find('.word-term').animate({
                        opacity: 0
                    }, 500, function() {
                        if (index == cloneWordList.length - 1) {
                            // Chuyển sang Stage mới
                            tabDOM.currentStage = 2;
                            changeToStage(tabDOM);
                            return;
                        }
                        caption = cloneWordList[++index].term;
                        $(this).text(caption);
                    }).animate({
                        opacity: 1
                    }, 500);
                } else {
                    var k = 1;

                    var pictureWrapper = $(this);
                    if (canClick == true)
                    {
                        var leftpos = parseInt($(this).css("left").replace("px", ""));
                    }
                    for (var i = 0; i < 15; i++)
                        setTimeout(function() {
                            $(pictureWrapper).css({
                                'left': k % 2 == 0 ? (leftpos + 15 - k) + 'px' : (leftpos - 15 + k) + 'px'
                            });
                            k++;
                            if (k == 16) {
                                canClick = true;
                            }
                            else {
                                canClick = false;
                            }
                        }, 50 * (1 + i));
                    playSound(Ucan.Resource.Audio.getMissSound());
                }
            });
        }

        function processStage2(tabDOM) {
            tabDOM.stage[2].dom.show();
            var stageDOM = tabDOM.stage[2].dom;
            if (tabDOM.stage[2].done) {
                return;
            }
            tabDOM.stage[2].done = true;

            // Hiển thị lại ảnh sau khi trộn
            shuffle(tabDOM.wordList);
            stageDOM.find('.picture-wrapper').each(function() {
                $(this).children('img').replaceWith('<div class="blank-img"></div>');
            });
            for (var i = 1; i <= 4; i++) {
                $('.pictures-block .picture-wrapper:nth-child(' + i + ')').css({
                    'left': (244 * i - 222) + 'px'
                })
            }
            // Ban đầu hiện ảnh 0
            var index = 0;
            var word = tabDOM.wordList[index];
            displayPair(index);

            var txt = stageDOM.find('.user-input').attr('maxlength', word.term.length).val('').focus();
            var userAns = $.trim(txt.val());

            // Bắt sự kiện gõ phím
            stageDOM.find('.user-input').keyup(function() {
                checkComplete($.trim(txt.val()), word);
            });
            stageDOM.find('.show-answer').click(function() {
                stageDOM.find('.explain').html('').append(word.term + '<p>' + multiLangSystem.order_retype + '</p>');
                stageDOM.find('.user-input').focus();
            })
            function displayPair(index) {
                stageDOM.find('.explain').html('');
                word = tabDOM.wordList[index];
                txt = stageDOM.find('.user-input').attr('maxlength', word.term.length).val('').focus();
                var curPicWrapper = stageDOM.find('.picture-wrapper').eq(index);
                var native_meaning = word.native_meaning;
                if (native_meaning == null) {
                    curPicWrapper.children('.blank-img').replaceWith('<img src="' + resourceUrl + word.img + '" alt="Picture" title="Type the word in the textbox below correctly" />');
                    curPicWrapper.children('img').hide().fadeIn(3000);
                } else {
                    curPicWrapper.children('.blank-img').text(native_meaning);
                    curPicWrapper.children('.blank-img').hide().fadeIn(3000);
                }

                // Trộn các kí tự để hiển thị ở dưới
                var shuffleText = shuffle(word.term.split(''));
                var ul = stageDOM.find('ul.shuffle-letters').html('');
                for (var i = 0; i < shuffleText.length; i++) {
                    ul.append('<li class="letter-inactive">' + shuffleText[i] + '</li>');
                }
                ul.children('li').click(function() {
                    var letter = $(this).text();
                    var oldAns = txt.val();
                    txt.val(oldAns + letter);
                    checkComplete(oldAns + letter, word);
                });
            }

            function checkComplete(userAns, word) {
                if (index == tabDOM.wordList.length) {
                    return;
                }

                // Cho textbox màu đỏ nếu sai
                if (word.term.toLowerCase().indexOf(userAns.toLowerCase()) != 0) {
                    txt.css('background-color', 'red');
                } else {
                    txt.next().children('li').removeClass('letter-active').addClass('letter-inactive');
                    // Active ô tìm thấy
                    for (var i = 0; i < userAns.length; i++) {
                        txt.next().children('li').each(function() {
                            if ($(this).hasClass('letter-inactive') && compareTwoString(userAns[i], $(this).text())) {
                                $(this).removeClass('letter-inactive').addClass('letter-active');
                                return false;
                            }
                            return true;
                        });
                    }
                    txt.css('background-color', 'white');
                }

                if (compareTwoString(userAns, word.term)) {
                    stageDOM.find('.picture-wrapper').eq(index).children('.caption').text(word.term);
                    playSound(resourceUrl + word.audio);
                    if (++index == tabDOM.wordList.length) {
                        tabDOM.currentStage += Math.floor(2 * Math.random() + 1)
                        changeToStage(tabDOM);
                    } else {
                        displayPair(index);
                    }
                }
            }
        }

        function processStage3(tabDOM) {
            tabDOM.stage[3].dom.show();
            if (tabDOM.stage[3].done) {
                return;
            }
            tabDOM.stage[3].done = true;
            shuffle(tabDOM.wordList);
            var cloneWordList = shuffle(Object.create(tabDOM.wordList));
            var index = 0;
            var word = tabDOM.wordList[index];
            var stageDOM = tabDOM.stage[3].dom;
            stageDOM.find('.clue').append(word.clue);
            stageDOM.find('.continue').css({
                'visibility': 'hidden'
            });
            stageDOM.find('.word-active').addClass('word-inactive').removeClass('word-inactive');
            for (var i = 0; i < cloneWordList.length; i++) {
                stageDOM.find('.choices').append('<div class="word global-border-thin-1" >' + cloneWordList[i].term + '</div>');
            }
            stageDOM.find('.choices .word').each(function() {
                $(this).click(function() {
                    var userAns = $(this).text();
                    if (stageDOM.find('.clue .blank-done').size() == 0 && compareTwoString(userAns, word.term)) {
                        stageDOM.find('.clue .blank').text(word.term).addClass('blank-done').removeClass('blank');
                        stageDOM.find('.explain').html('').append(word.explain);
                        if (((tabDOM.id + 1) != tabAmount) || ((index + 1) != cloneWordList.length))
                        {
                            stageDOM.find('.continue').css({
                                'visibility': 'visible'
                            });
                        }
                        $(this).addClass('word-active');
                        playSound(resourceUrl + word.audio);
                    } else if (stageDOM.find('.clue .blank-done').size() == 0 && !$(this).hasClass('word-active')) {
                        playSound(Ucan.Resource.Audio.getMissSound());
                        $(this).css({
                            'opacity': '0.2',
                            'cursor': 'text'
                        });
                    }
                });
            });
            stageDOM.find('.continue').click(function() {
                // Sang tu khac
                // Nếu xong rồi thì chuyển Tab
                if ((index + 1) == cloneWordList.length) {
                    if ((tabDOM.id + 1) < tabAmount) {
                        moveToTab(tabDOM.id + 1);
                        stageDOM.attr('data-finish', true);
                        index = 0;
                    }
                    return;

                } else {
                    stageDOM.find('.word').each(function() {
                        $(this).removeClass('word-active').addClass('word-inactive').css({
                            'opacity': 1,
                            'cursor': 'pointer'
                        })
                    })
                    word = tabDOM.wordList[++index];
                    stageDOM.find('.clue').html('').append(word.clue);
                }
                stageDOM.find('.explain').html('');
                stageDOM.find('.continue').css({
                    'visibility': 'hidden'
                });
            });
        }
        function processStage4(tabDOM) {
            tabDOM.stage[4].dom.show();
            if (tabDOM.stage[4].done) {
                return;
            }
            tabDOM.stage[4].done = true;
            shuffle(tabDOM.wordList);
            var cloneWordList = shuffle(Object.create(tabDOM.wordList));
            var index = 0;
            var word = tabDOM.wordList[index];
            var stageDOM = tabDOM.stage[4].dom;
            stageDOM.find('.continue').hide();
            stageDOM.find('.clue').append(word.clue);
            stageDOM.find('.clue').find('.blank').html('').append(cloneWordList[index].term.toLowerCase()).addClass('blank-done');
            stageDOM.find('.inputtext').each(function() {
                var word = tabDOM.wordList[index];
                $(this).keyup(function(event) {
                    if (event.which == 13) {
                        word = tabDOM.wordList[index];
                        if (compareTwoString($(this).val().toLowerCase(), word.term.toLowerCase())) {
                            playSound(resourceUrl + word.audio);
                            stageDOM.find('.explain').html('').append(word.explain);
                            stageDOM.find('.blank').html('').append(word.term.toLowerCase()).addClass('blank-done');
                            console.log(index + 1 + '--' + tabDOM.id);
                            stageDOM.find('.continue').show().css({'visibility': 'hidden'});
                            if (((tabDOM.id + 1) != tabAmount) || ((index + 1) != cloneWordList.length)) {
                                stageDOM.find('.continue').css({
                                    'visibility': 'visible'
                                });
                            }
                            stageDOM.find('#infor-guide').css({
                                'visibility': 'hidden'
                            });
                            stageDOM.find('.show-answer').hide();

                            $(this).parent().siblings('.wrong-button').addClass('global-button-green-1');
                            $(this).val('').attr('disabled', true);
                        } else {
                            playSound(Ucan.Resource.Audio.getMissSound());
                        }

                    }
                });
                stageDOM.find('.show-answer').click(function() {
                    stageDOM.find('#infor-guide').css({
                        'visibility': 'hidden'
                    });

                    if (compareTwoString(stageDOM.find('.blank').text().toLowerCase(), word.term.toLowerCase())) {
                        stageDOM.find('.explain').html('').append(word.term + '<p>' + multiLangSystem.order_click_right + '</p>')
                    } else {
                        stageDOM.find('.explain').html('').append(word.term + '<p>' + multiLangSystem.order_retype_and_press_enter + '</p>');
                        stageDOM.find('.inputtext').attr('disabled', false).focus();
                        stageDOM.find('.wrong-button').switchClass('global-button-orange-1', 'global-button-green-1');
                        stageDOM.find('.right-button').switchClass('global-button-green-1', 'global-button-orange-1');
                    }
                })
                stageDOM.find('.continue').click(function() {
                    // Nếu xong rồi thì chuyển Tab
                    stageDOM.find('#infor-guide').css({
                        'visibility': 'hidden'
                    });
                    if ((index + 1) == cloneWordList.length) {
                        if ((tabDOM.id + 1) < tabAmount) {
                            moveToTab(tabDOM.id + 1);
                            stageDOM.attr('data-finish', true);
                            index = 0;
                        }
                        return;

                    } else {
                        word = tabDOM.wordList[++index];
                        stageDOM.find('.clue').html('').append(word.clue);
                        stageDOM.find('.blank').html('').append(cloneWordList[index].term).addClass('blank-done');
                        stageDOM.find('.wrong-button').removeClass('global-button-green-1').addClass('global-button-orange-1');
                        stageDOM.find('.right-button').removeClass('global-button-green-1').addClass('global-button-orange-1');
                    }
                    stageDOM.find('.explain').html('');
                    stageDOM.find('.continue').hide();
                    stageDOM.find('.show-answer').show();
                });
            });
            stageDOM.find('.wrong-button').click(function() {
                stageDOM.find('#infor-guide').css({
                    'visibility': 'visible'
                });
                if ($(this).parents('.stage-correct-word').attr('data-finish')) {
                    return;
                }
                stageDOM.find('.inputtext').attr('disabled', false).focus();
                $(this).switchClass('global-button-orange-1', 'global-button-green-1');
                $(this).siblings('.right-button').switchClass('global-button-green-1', 'global-button-orange-1');
            });
            stageDOM.find('.right-button').click(function() {
                stageDOM.find('#infor-guide').css({
                    'visibility': 'hidden'
                });
                if ($(this).parents('.stage-correct-word').attr('data-finish')) {
                    return;
                }
                stageDOM.find('.inputtext').attr('disabled', true);
                $(this).switchClass('global-button-orange-1', 'global-button-green-1');
                $(this).siblings('.wrong-button').switchClass('global-button-green-1', 'global-button-orange-1');
                if (stageDOM.find('.blank').text() == tabDOM.wordList[index].term) {
                    word = tabDOM.wordList[index];
                    stageDOM.find('.explain').html('').append(word.explain);
                    playSound(resourceUrl + word.audio);
                    stageDOM.find('.continue').show();
                    if (((tabDOM.id + 1) != tabAmount) || ((index + 1) != cloneWordList.length)) {
                        stageDOM.find('.continue').css({
                            'visibility': 'visisble'
                        });
                    }
                    stageDOM.find('.show-answer').hide();
                    // Nếu xong rồi thì chuyển Tab

                } else {
                    playSound(Ucan.Resource.Audio.getMissSound());
                }
            });
        }
        function changeToStage(tabDOM) {
            if (tabDOM.currentStage == 1) { // nếu click nút continue thì phải hiện luôn, ko chần chừ
                changeToStageProcessing();
            } else {
                setTimeout(function() {
                    changeToStageProcessing();
                }, 1500);
            }
            function changeToStageProcessing() {
                for (var i = 0; i < tabDOM.stage.length; i++) {
                    if (tabDOM.stage[i].order == tabDOM.currentStage) {
                        tabDOM.stage[i].dom.fadeIn(1000).siblings().hide();
                        tabDOM.runStageEvent();
                        break;
                    }
                }
            }
        }
    }
    function Stage(order, name, dom) {
        this.order = order;
        this.name = name;
        this.dom = dom;
        this.done = false;
    }
    $("#finish").click(function() {
        $(document).keyup(function(e) {
            if (e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if ((numViewedPage == 1) && (tabAmount > 1)) {
            unShowClickResult++;
            if (unShowClickResult == 1) {
                $('.overlay-black').show();
                $('#multipage-confirm-dialog').fadeIn(500);
            }
        }
        else {
            window.location.replace(nextActivityUrl);
        }
    });
});

function loadResult() {
    window.location.replace(nextActivityUrl);
}
