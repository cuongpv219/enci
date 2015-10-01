function WordDOM(id, wordNumber, uiSelected, nav, verOrHor) {
    this.id = id;
    this.wordNumber = wordNumber; // div tròn màu đỏ (DOM)
    this.uiSelected = uiSelected;
    this.nav = nav; // bộ chứa info, button... (từng .row của #info-board)
    this.verOrHor = verOrHor;
    this.result = ''; // kết quả sau khi convert theo định dạng ...||...||
    this.imgUrl = null;
    this.clue = null;
    this.keyIndex = null;
    this.content = ''; // nội dung từ
}

WordDOM.prototype.removeItSelft = function(wordDOMArr) {
    this.wordNumber.remove();
    this.nav.remove();
    for (var i = 0; i < this.uiSelected.length; i++) {
        var us = this.uiSelected[i];
        if (!this.hasMultiReferences($(this), wordDOMArr)) {
            if ($(us).attr('data-belong-to') == this.id) {
                $(us).removeClass('selected', 500).text('');
            }
        }
    }
};

WordDOM.prototype.hasMultiReferences = function(curCharacter, wordDOMArr) {
    var curX = curCharacter.attr('data-x');
    var curY = curCharacter.attr('data-y');
    for (var j = 0; j < wordDOMArr.length; j++) { // ktra dung. hang
        if (wordDOMArr[j].id !== this.id) {
            for (var k = 0; k < wordDOMArr[j].uiSelected.length; k++) {
                var character = $(wordDOMArr[j].uiSelected[k]);
                if (character.attr('data-x') == curX
                        && character.attr('data-y') == curY) {
                    return true;
                }
            }
        }
    }
    return false;
};

WordDOM.prototype.createResult = function() {

    var word = $.trim(this.nav.find('.txt-content').val()).toUpperCase();
    var wordNumber = this.wordNumber.text();

    this.result = this.id + '--'
            + wordNumber + '--'
            + word + '--'
            + $(this.uiSelected[0]).attr('data-x') + ',' + $(this.uiSelected[0]).attr('data-y') + '--'
            + this.verOrHor + '--'
            + this.clue + '--'
            + ($(this.nav).find('.img-url').val()) + '--'
            + this.keyIndex;
};

$(document).ready(function() {
    outputObject = window.opener.$('#' + window.opener.callerObject.attr('data-outputsource'));
    var order = 0;
    var isChoosingKey = false;
    var curWordDOM;
    var wordDOMArr = []; // mảng các WordDOM
    var AMOUNT_HORIZENTAL = 20;
    var AMOUNT_VERTICAL = 20;
    var nav = '<div class="row-info">'
            + '<div class="title">Crossword\'s characters</div>'
            + '<input type="text" class="txt-number" title="Order"/>'
            + '<input type="text" class="txt-content" title="Crossword"/>'
            + '<button class="btn-remove">Remove</button>'
            + '<div class="clue">'
            + '<div class="title">Write clue for this crossword</div>'
            + '<textarea title="Write clue here"></textarea>'
            + '<div class="title">Browse images</div>'
            + '<div class="img-url-container">'
            + '<input type="text" class="img-url" />'
            + '<input type="button" class="btn-choose-img" data-url="' + browseHelperUrl + '" value="..." title="Click to choose image"/>'
            + '</div>'
            + '</div>'
            + '</div>';

    try {
        setWindowPreferences();
        createGrid();
        exchangeFromSource();
        createEventForWordDOMElements();
        createEventForKey();
    } catch (ex) {
        alert('There is error!');
    }

    $('#game-board #words-wrapper').selectable({
        start: function() {
            removeWordDOMEmpty();
        },
        stop: function() {
            if (!isChoosingKey && hasValidSelection()) {
                $('#row-wrapper').append(nav);
                var wn = insertWordNumber($(".ui-selected", this)); // thêm dấu tròn đỏ

                // Tạo đối tượng mới và gán tham chiếu tới các elements
                curWordDOM = new WordDOM(order, wn,
                        $('.ui-selected', this),
                        $('#info-board .row-info').last(),
                        verOrHor($('.ui-selected', this))
                        );

                wordDOMArr.push(curWordDOM);
                createEventForNavElems(curWordDOM);
                order++;
            } else if (!isChoosingKey) {
                $('.ui-selected').removeClass('ui-selected');
            }
        }
    }); // end selectable

    /*
     * Save and export
     */
    $('#converted-result .btn-accept-all').click(function() {
        outputObject.val(getResult());
        window.close();
    });

    function createEventForWordDOMElements() {
        for (var i = 0; i < wordDOMArr.length; i++) {
            wordDOMArr[i].createResult();
            createEventForNavElems(wordDOMArr[i]);
        }
    }

    function createEventForKey() {
        /*
         * Choose Key
         */
        $('#keyword #btn-choose-key').click(function() {
            if (wordDOMArr.length == 0) {
                alert('There is not any CrossWord item');
                return;
            }

            lockInforBoard();
            $(this).hide();
            $('#btn-cancel, #btn-accept-key').show();
            $('#game-board .character:not(".selected")').css('visibility', 'hidden');
            resetKey();
            removeWordDOMEmpty();
        });

        /*
         * Cancel
         */
        $('#keyword #btn-cancel').click(function() {
            $(this).hide();
            $('#keyword #btn-accept-key').removeAttr('disabled').hide();
            $('#keyword #btn-choose-key').show();
            $('#game-board .character:not(".selected")').css('visibility', 'visible');
            $('.ui-selected').removeClass('ui-selected');
            $('#keyword .content').html('');
            $('#game-board .is-key').removeClass('is-key');

            resetKey();
            unlockForChoosingKey();
        });

        /*
         * ACCEPT KEY
         */
        $('#keyword #btn-accept-key').click(function() {
            if (selectDuplicatedID()) {
                alert('Invalid KEY selection');
                return;
            }

            var keyNull = false;
            $('.ui-selected').each(function() {
                if ($.trim($(this).text()) == '' && $(this).attr('data-belong-to')) {
                    keyNull = true;
                    return false;
                }

                var targetX = $(this).attr('data-x');
                var targetY = $(this).attr('data-y');
                var wdByID = getWordDOMByID($(this).attr('data-belong-to'));
                wdByID.keyIndex = getKeyIndex(wdByID, targetX, targetY);

                // Hiển thị xâu key
                $('#keyword .content').append($(this).clone());

                // Thêm class cho key
                $(this).addClass('is-key').removeClass('ui-selected');
            });

            if (keyNull) {
                alert('Each character of KEY must be not empty');
                return;
            }

            if ($('.ui-selected').size() == 0) {
                alert('Key is empty');
                return;
            }
            $(this).hide();

            function getKeyIndex(wdByID, targetX, targetY) {
                for (var i = 0; i < $(wdByID.uiSelected).length; i++) {
                    var sourceX = $(wdByID.uiSelected[i]).attr('data-x');
                    var sourceY = $(wdByID.uiSelected[i]).attr('data-y');
                    if (targetX == sourceX && targetY == sourceY) {
                        return i;
                    }
                }
            }
        });
    }

    function resetKey() {
        for (var i = 0; i < wordDOMArr.length; i++) {
            wordDOMArr[i].keyIndex = null;
        }
        $('.is-key').removeClass('is-key');
    }

    function createEventForNavElems(wd) {
        $(wd.nav).attr('data-order', wd.id);
        $(wd.nav).find('.img-url').attr('id', 'img-url-order-' + wd.id);
        $(wd.nav).find('.btn-choose-img').attr('data-outputsource', 'img-url-order-' + wd.id);

        // Chose image
        $(wd.nav).find('.btn-choose-img').on('click', function() {
            open_input_helper($(this), 'chooseImage');
        });

        /*
         * FOCUS SHOW CLUE
         */
        $(wd.nav).find('input, textarea').focus(function() {
            $(this).parents('.row-info:first').find('.clue').show();
            $(this).parents('.row-info:first').siblings('.row-info').find('.clue').hide();
        });

        // Nhảy vào ô nhập số thứ tự
        $(wd.nav).find('.txt-number').focus();

        /*
         * KEY UP
         */
        $(wd.nav).find('input[type=text], .clue textarea').keyup(function(event) {
            if (event.which == 13 && !$(this).parent().hasClass('clue')) {
                accept(this);
            }
        });

        // On change
        $(wd.nav).find('input[type=text], .clue textarea').change(function(event) {
            accept(this);
        });

        /*
         * EVENT REMOVE
         */
        $(wd.nav).find('.btn-remove').click(function() {
            var choosedID = $(this).parents('.row-info').attr('data-order');
            wd = getWordDOMByID(choosedID);
            wd.removeItSelft(wordDOMArr);
            $('.ui-selected').removeClass('ui-selected');

            for (var i = 0; i < wordDOMArr.length; i++) {
                if (wordDOMArr[i].id == choosedID) {
                    wordDOMArr.splice(i, 1);
                    break;
                }
            }
        });
    }

    function exchangeFromSource() {
        if (!outputObject.val() || $.trim(outputObject.val()) == '') {
            wordDOMArr = [];
            order = 0;
        } else {
            wordDOMArr = getDataFromSource();
            order = parseInt(wordDOMArr[wordDOMArr.length - 1].id) + 1;
        }
    }

    function getDataFromSource() {
        var words = outputObject.val().split('||');
        var data = [];
        for (var i = 0; i < words.length; i++) {
            if (!words[i]) {
                continue;
            }

            // Create nav
            $('#row-wrapper').append(nav);

            // Create new instance
            var splitted = words[i].split('--');
            var wordDOM = new WordDOM();
            wordDOM.id = splitted[0];
            wordDOM.content = splitted[2];
            wordDOM.startPosition = splitted[3];
            wordDOM.verOrHor = splitted[4];
            wordDOM.clue = splitted[5];
            wordDOM.imgUrl = splitted[6];
            wordDOM.keyIndex = splitted[7];
            wordDOM.uiSelected = getReferrencesAndSetText(wordDOM);
            insertWordNumber(wordDOM.uiSelected); // word number
            wordDOM.wordNumber = $('#game-board .word-number:last').text(splitted[1]).show();

            wordDOM.nav = $('#info-board .row-info:last'); // refer nav
            wordDOM.nav.attr('data-order', wordDOM.id);
            wordDOM.nav.find('.img-url').attr('id', 'img-url-order-' + wordDOM.id);
            wordDOM.nav.find('.btn-choose-img').attr('data-outputsource', 'img-url-order-' + wordDOM.id);

            // Set data from source
            wordDOM.nav.find('.txt-number').val(wordDOM.wordNumber.text());
            wordDOM.nav.find('.txt-content').val(wordDOM.content);
            wordDOM.nav.find('.clue textarea').val(wordDOM.clue);
            wordDOM.nav.find('.img-url').val(isImageFormat(wordDOM.imgUrl) ? wordDOM.imgUrl : 'there is no image');

            // Set key
            for (var j = 0; j < wordDOM.uiSelected.length; j++) {
                if (j == wordDOM.keyIndex) {
                    wordDOM.uiSelected[j].addClass('is-key');
                    break;
                }
            }
            data.push(wordDOM);
        }
        return data;
    }

    function isImageFormat(imgUrl) {
        if (!imgUrl) {
            return false;
        }
        if (imgUrl.match(/.jpg$/i) || imgUrl.match(/.jpeg$/i) ||
                imgUrl.match(/.png$/i) || imgUrl.match(/.bmp$/i) ||
                imgUrl.match(/.tiff$/i) || imgUrl.match(/.gif$/i)
                || imgUrl.match(/.raw$/i)) {
            return true;
        }
        return false;
    }

    function getReferrencesAndSetText(wd) {
        var references = [];
        var x = wd.startPosition.split(',')[0];
        var y = wd.startPosition.split(',')[1];

        $('#words-wrapper .character').each(function() {

            if (x == $(this).attr('data-x') && y == $(this).attr('data-y')) {
                var curPos = $(this); // ô đầu tiên
                $(curPos).text(wd.content[0])
                        .addClass('selected').attr('data-belong-to', wd.id);
                references.push(curPos);

                if (wd.verOrHor == 1) {
                    for (i = 1; i < wd.content.length; i++) {
                        for (var j = 0; j < AMOUNT_HORIZENTAL; j++) { // next 20 lần
                            curPos = curPos.next();
                        }
                        curPos.text(wd.content[i])
                                .addClass('selected').attr('data-belong-to', wd.id);
                        references.push(curPos);
                    }
                } else {
                    for (var i = 1; i < wd.content.length; i++) {
                        curPos = $(curPos).next();
                        curPos.text(wd.content[i])
                                .addClass('selected').attr('data-belong-to', wd.id);
                        references.push(curPos);
                    }
                }

                return false;
            }
        });

        return references;
    }

    /**
     * Nếu chọn key mà có 2 ô cùng thuộc 1 từ thì return true
     */
    function selectDuplicatedID() {
        var tmp = [];
        var dup = false;

        $('.ui-selected').each(function() {
            var belongID = $(this).attr('data-belong-to');
            if (tmp.indexOf(belongID) == -1) {
                tmp.push(belongID);
                return true;
            } else {
                dup = true;
                return false;
            }
        });

        return dup;
    }

    /**
     * Xóa nếu như chưa điền j đã select cái mới
     */
    function removeWordDOMEmpty() {
        for (var i = 0; i < wordDOMArr.length; i++) {
            var wd = wordDOMArr[i];
            if (wd) {
                var number = $(wd.nav).find('.txt-number');
                var content = $(wd.nav).find('.txt-content');
                if ($.trim(number.val()) == '' && $.trim(content.val()) == '') {
                    $(wd.nav).remove();
                    wd.wordNumber.remove();
                    wordDOMArr.splice(i, 1);
                    break;
                } else {
                    $(wd.uiSelected).addClass('selected');
                }
            }
        }
    }

    /**
     * Lock khi đang chọn key
     */
    function lockInforBoard() {
        isChoosingKey = true;
        $('#info-board input').attr('disabled', 'disabled');
    }

    /**
     * Unlock khi đang chọn key
     */
    function unlockForChoosingKey() {
        isChoosingKey = false;
        $('#info-board input').removeAttr('disabled');
    }

    /**
     * ACCEPT FUNCTION
     */
    function accept(btnAcceptOrInput) {
        if ($.trim($(btnAcceptOrInput).parents('.row-info:first').find('.txt-content').val()) == '') {
            return;
        }

        curWordDOM = getWordDOMByID($(btnAcceptOrInput).parents('.row-info:first').attr('data-order'));

        if (!curWordDOM) {
            alert('curWordDOM is null. Cannot accept');
        }

        curWordDOM.wordNumber.text(curWordDOM.nav.find('.txt-number').val());

        var content = $.trim(curWordDOM.nav.find('.txt-content').val()).toUpperCase();
        curWordDOM.nav.find('.txt-content').val(content); // refer textbox content
        syncUISelected(content); // đồng bộ theo text

        // Tạo Result
        curWordDOM.imgUrl = $.trim(curWordDOM.nav.find('.clue .img-url').val());
        curWordDOM.clue = $.trim(curWordDOM.nav.find('.clue textarea').val());

        // Thu nhỏ số thứ tự nếu đè lên nhau với câu khác
        for (var i = 0; i < wordDOMArr.length; i++) {
            var x1 = $(wordDOMArr[i].uiSelected[0]).attr('data-x');
            var y1 = $(wordDOMArr[i].uiSelected[0]).attr('data-y');
            var x2 = $(wordDOMArr[i].uiSelected[wordDOMArr[i].uiSelected.length - 1]).attr('data-x');
            var y2 = $(wordDOMArr[i].uiSelected[wordDOMArr[i].uiSelected.length - 1]).attr('data-y');
            var xa = $(curWordDOM.uiSelected[0]).attr('data-x');
            var ya = $(curWordDOM.uiSelected[0]).attr('data-y');
            var xb = $(curWordDOM.uiSelected[curWordDOM.uiSelected.length - 1]).attr('data-x');
            var yb = $(curWordDOM.uiSelected[curWordDOM.uiSelected.length - 1]).attr('data-y');

            if ((x1 - xa) * (y1 - ya) == -1
                    && angleCoef(x1, y1, x2, y2) * angleCoef(xa, ya, xb, yb) == -1
                    && !isJunction(wordDOMArr[i], curWordDOM)) {
                resizeWordNumberSmaller(wordDOMArr[i]);
                resizeWordNumberSmaller(curWordDOM);
                break;
            }
        }
    }

    function syncUISelected(content) {
        var difAmount = Math.floor(Math.abs(content.length - curWordDOM.uiSelected.length));
        var currentNext = $(curWordDOM.uiSelected[curWordDOM.uiSelected.length - 1]);
        if (content.length > curWordDOM.uiSelected.length) {
            for (var i = 0; i < difAmount; i++) { // duyệt số lượng chênh lệch
                if (curWordDOM.verOrHor == 1) {
                    for (var j = 0; j < AMOUNT_HORIZENTAL; j++) {
                        currentNext = currentNext.next('.character');
                    }
                } else {
                    currentNext = currentNext.next('.character');
                }
                $.merge(curWordDOM.uiSelected, currentNext);
            }
        } else if (content.length < curWordDOM.uiSelected.length) {
            $(curWordDOM.uiSelected).each(function() {
                $(this).text('').removeClass('selected is-key').removeAttr('data-belong-to');
            });
            curWordDOM.uiSelected = curWordDOM.uiSelected.slice(0, -difAmount);
        }

        // Set text
        for (i = 0; i < curWordDOM.uiSelected.length; i++) {
            if (!curWordDOM.hasMultiReferences($(this), wordDOMArr)) {
                $(curWordDOM.uiSelected[i]).attr('data-belong-to', curWordDOM.id).switchClass('ui-selected', 'selected').text(content.charAt(i));
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

        if ($(vertical.uiSelected[1]).attr('data-x') == $(horizental.uiSelected[1]).attr('data-x')) {
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
     * @param wd đối tượng chưa wordNumber cần thu nhỏ
     */
    function resizeWordNumberSmaller(wd) {
        wd.wordNumber.addClass('word-number-small');
        wd.wordNumber.css({
            'top': function() {
                if (wd.verOrHor == 0) {
                    return $(wd.uiSelected[0]).position().top + 30;
                } else {
                    return $(wd.uiSelected[0]).position().top + 16;
                }
            },
            'left': function() {
                if (wd.verOrHor == 0) {
                    return $(wd.uiSelected[0]).position().left + 6;
                } else {
                    return $(wd.uiSelected[0]).position().left + 20;
                }
            }
        });
    }

    /**
     * Total RESULT
     */
    function getResult() {
        var result = '';
        for (var i = 0; i < wordDOMArr.length; i++) {
            wordDOMArr[i].createResult();
            result += wordDOMArr[i].result + (i == wordDOMArr.length - 1 ? '' : '||');
        }

        return result;
    }

    /**
     * Tìm đối đượng WordDOM theo ID
     */
    function getWordDOMByID(id) {
        for (var i = 0; i < wordDOMArr.length; i++) {
            if (wordDOMArr[i].id == id) {
                return wordDOMArr[i];
            }
        }

        return null;
    }

    /**
     * Thêm dấu tròn đỏ - chỉ số của từ đang định thêm
     */
    function insertWordNumber(uiSelected) {
        var wn = $(document.createElement('div')).addClass('word-number');
        $('#game-board').append(wn);
        var top = $(uiSelected[0]).position().top;
        var left = $(uiSelected[0]).position().left;

        if (verOrHor(uiSelected) == 0) {
            wn.css({
                top: top + 31,
                left: left
            });
        } else {
            wn.css({
                top: top + 8,
                left: left + 23
            });
        }
        return wn.show();
    }

    /**
     * Kiểm tra xem lựa chọn ngang hay dọc
     * @param selectedItems mảng chứa các ô selected
     * @return 0 nếu chọn theo hàng ngang. Ngược lại sẽ là chọn theo hàng dọc
     */
    function verOrHor(selectedItems) {
        if ($(selectedItems[0]).attr('data-x') == $(selectedItems[selectedItems.length - 1]).attr('data-x')) {
            return 1;
        }
        return 0;
    }

    /**
     * Kích cỡ lưới: 20 x 20
     */
    function createGrid() {
        for (var i = 0; i < AMOUNT_HORIZENTAL; i++) {
            for (var j = 0; j < AMOUNT_VERTICAL; j++) {
                var elem = document.createElement('li');
                $(elem).addClass('character');
                $(elem).attr('data-x', j);
                $(elem).attr('data-y', i);
                $(elem).css({
                    'top': function() {
                        return i * 26;
                    },
                    'left': function() {
                        return j * 26;
                    }
                });
                $('#words-wrapper').append(elem);
            }
        }
    }

    /**
     * Kiểm tra xem select nhiều hàng 1 lúc
     */
    function hasValidSelection() {
        var valid = true;
        if ($('.ui-selected:last').attr('data-x') !== $('.ui-selected:first').attr('data-x')
                && $('.ui-selected:last').attr('data-y') !== $('.ui-selected:first').attr('data-y')) {
            valid = false;
        }

        return valid;
    }

    function setWindowPreferences() {
        window.resizeTo(window.screen.width - 100, window.screen.height);
        window.moveTo(0, 0);
    }
});