$(document).ready(function() {
    
    var PLAYER_NAME = 'fc_audio_player';
    var activedStep = null;
    var activedItem = null;
    var intervalId = null;
    var step1 = $('#step1-overview');
    var step2 = $('#step2-en-vi');
    var step3 = $('#step3-vi-en');
    var wordListFromJson = [];
    
    init();
    createEvents();
    jumpStep(1);
    $('.front-flat-menu-item-active').removeClass('front-flat-menu-item-active').addClass('front-flat-menu-item-inactive');
    $('#front-flat-menu-item-1').addClass('front-flat-menu-item-active').removeClass('front-flat-menu-item-inactive');

    function jumpStep(index) {
        if (index != 1) {
            $('#fc-auto-mode').hide();
            $('#fc-total-words').hide();
        }
        
        switch (parseInt(index)) {
            case 1:
                activedStep = step1.show();
                activedItem = step1.find('.word-list-item .item.active').first();
                listen();
                $('#fc-footer-navigator .btn-next-step').show();
                $('#fc-footer-navigator .btn-apply').hide();
                step2.hide();
                step3.hide();
                toggleTab(1);
                break;
                
            case 2:
                activedStep = step2.show();
                activedItem = step2.find('.word-list-item .item.active').first();
                listen();
                $('#fc-footer-navigator .btn-next-step').show();
                $('#fc-footer-navigator .btn-apply').hide();
                step1.hide();
                step3.hide();
                toggleTab(2);
                break;
                
            case 3:
                activedStep = step3.show();
                activedItem = step3.find('.word-list-item .item.active').first();
                listen();
                $('#fc-footer-navigator .btn-next-step').hide();
                $('#fc-footer-navigator .btn-apply').show();
                step1.hide();
                step2.hide();
                toggleTab(3);
                break;
                
            default:
                console.log('Error ' + index);
        }
        disableEnableNextPrev();
        
        // Title header
        if (activedStep) {
            $('#fc-step-title').text(activedStep.attr('data-title-header'));
        }
        
        // Display item
        if (activedItem) {
            activedItem.show();
        }
        
        // Focus textbox
        $('.user-input', activedStep).focus();
        toggleFinished();
        
        // Process
        computeProgress();
        
        // Disable auto mode
        clearInterval(intervalId);
    }
    
    function nextItem(timeDelay) {
        timeDelay = timeDelay ? timeDelay : 0;
        if ($(activedItem).index() < wordListFromJson.length - 1) {
            $('.btn.btn-next-word').removeClass('disable');
            $(activedItem).stop(true, true).delay(timeDelay).hide(0, function() {
                activedItem = $(activedItem).next().addClass('active').show();
                toggleFinished();
                computeProgress();
                focusUserInput();
                disableEnableNextPrev();
                $(activedItem).siblings('.item').removeClass('active').hide();
                listen();
            });
        }
    }
    
    function prevItem(timeDelay) {
        timeDelay = timeDelay ? timeDelay : 0;
        if ($(activedItem).index() > 0) {
            $('.btn.btn-prev-word').removeClass('disable');
            $(activedItem).stop(true, true).delay(timeDelay).hide(0, function() {
                activedItem = $(activedItem).prev().addClass('active').show();
                toggleFinished();
                computeProgress();
                focusUserInput();
                disableEnableNextPrev();
                $(activedItem).siblings('.item').removeClass('active').hide();
                listen();
            });
        }
    }

    function disableEnableNextPrev() {
        $('.btn.btn-prev-word, .btn.btn-next-word').removeClass('disable');
        if ($(activedItem).index() == 0) {
            $('.btn.btn-prev-word').addClass('disable');
            return;
        } else {
            $('.btn.btn-prev-word').removeClass('disable');
        }
        if ($(activedItem).index() == $('.word-list-item .item', activedStep).size() - 1) {
            $('.btn.btn-next-word').addClass('disable');
        } else {
            $('.btn.btn-next-word').removeClass('disable');
        }
    }

    function toggleFinished() {
        var finished = getItemFromFinishedList(activedItem.attr('data-id'));
        if (finished) {
            $(finished).addClass('focus').siblings().removeClass('focus');
        } else {
            $('.finished-words .focus').removeClass('focus');
        }
    }

    function getItemFromFinishedList(id) {
        var found = null;
        $('.finished-words li', activedStep).each(function() {
            if ($(this).attr('data-id') == id) {
                found = $(this);
                return false;
            }
        });
        return found;
    }

    function computeProgress() {
        var total = wordListFromJson.length;
        var index = $(activedItem).index() + 1;
        var process = index / total * 100;
        if (index == total) {
            process = 100;
        }
        $('#fc-progress .bar').css('width', process + '%');
    }

    function createEvents() {
        $('#step-list .step').click(function() {
            var index = $(this).attr('data-index');
            jumpStep(index);
        }).hover(function() {
            $(this).addClass('global-green-bar');
        }, function() {
            if (!$(this).hasClass('active')) {
                $(this).removeClass('global-green-bar');
            }
        });
        
        $('#chk-auto-mode').click(function() {
            if ($(this).hasClass('checked')) {
                $(this).removeClass('checked');
                clearInterval(intervalId);
            } else {
                $(this).addClass('checked');
                autoMode();
            }
        });
        
        // Next item
        $('#fc-footer-navigator .btn-next-word').click(function() {
            nextItem();
        });
        
        // Prev item
        $('#fc-footer-navigator .btn-prev-word').click(function() {
            prevItem();
        });
        
        // Next step
        $('#fc-footer-navigator .btn-next-step').click(function() {
            if (activedStep.attr('data-index') < 3) {
                jumpStep(parseInt(activedStep.attr('data-index')) + 1);
            }
        });
        
        // Listen
        $('.word-list-item .btn-listen').click(function() {
            listen();
        });
        
        // Kiểm tra gõ tiếng Anh
        $('#step2-en-vi .english .btn-check').click(function() {
            var textbox = $(this).prev();
            if (!$.trim($(textbox).val())) {
                nextItem();
            } else {
                checkEnVi($(textbox));
            }
        });
        $('#step2-en-vi .english .user-input').keypress(function(event) {
            if (event.keyCode == 13) {
                if (!$.trim($(this).val())) {
                    nextItem();
                } else {
                    checkEnVi($(this));
                }
            }
        });
        
        // Kiểm tra gõ tiếng Việt
        $('#step3-vi-en .vietnamese .btn-check').click(function() {
            var textbox = $(this).prev();
            if (!$.trim($(textbox).val())) {
                nextItem();
            } else {
                checkViEn($(textbox));
            }
        });
        $('#step3-vi-en .vietnamese .user-input').keypress(function(event) {
            if (event.keyCode == 13) {
                if (!$.trim($(this).val())) {
                    nextItem();
                } else {
                    checkViEn($(this));
                }
            }
        });
        
        // Click random
        $('.random-list li').click(function() {
            var id = $(this).attr('data-id');
            var parentId = $(this).parents('.item:first').attr('data-id');
            var finished = getItemFromFinishedList(parentId);
            if ($(finished).hasClass('true')) {
                return;
            }
            
            if (id == $(finished).attr('data-real-id')) {
                finishTrueWord(getWordById(id));
                $(this).addClass('true').siblings().removeClass('true false');
                nextItem(1000);
            } else {
                finishWrongWord(getWordById(parentId));
                $(this).addClass('false').siblings().removeClass('true false');
            }
            $(this).addClass('choice').siblings().removeClass('choice');
        });
        
        // Keyboard
        $(document).keyup(function(event) {
            event.preventDefault();
            if (event.keyCode == 37) {
                prevItem();
            } else if (event.keyCode == 39) {
                nextItem();
            }
        });
        
        $('.finished-words li').click(function() {
            var id = $(this).attr('data-id');
            jumpToItem(id);
        });
        
        $('#fc-footer-navigator .btn-apply').attr('value','Practise now!');
    }
    
    function toggleTab(index) {
        $('#step-list .step[data-index=' + index + ']')
                .addClass('global-green-bar active')
                .siblings().removeClass('global-green-bar active');
    }
    
    function jumpToItem(id) {
        $(activedItem).siblings('.item').each(function() {
            if ($(this).attr('data-id') == id) {
                activedItem = $(this).show(0, function() {
                    $(activedItem).hide();
                });
                toggleFinished();
                return false;
            } else {
                $(this).hide();
            }
        });
        return activedItem;
    }
    
    function checkEnVi(textbox) {
        var id = textbox.attr('data-id');
        var wordById = getWordById(id);
        if (compareTwoString(textbox.val(), wordById.title)) {
            finishTrueWord(wordById);
            nextItem(1500);
        } else {
            finishWrongWord(wordById);
        }
    }
    
    function checkViEn(textbox) {
        var id = textbox.attr('data-id');
        var wordById = getWordById(id);
        if (compareTwoString(textbox.val(), wordById.shortMeaning)) {
            finishTrueWord(wordById);
        } else {
            finishWrongWord(wordById);
        }
        nextItem();
    }
    
    function finishTrueWord(word) {
        playSound(Ucan.Resource.Audio.getHitSound(), true, PLAYER_NAME);
        var finished = getItemFromFinishedList(word.id);
        $(finished).removeClass('false').addClass('true');
    }
    
    function finishWrongWord(word) {
        playSound(Ucan.Resource.Audio.getMissSound(), true, PLAYER_NAME);
        var finished = getItemFromFinishedList(word.id);
        $(finished).removeClass('true').addClass('false');
    }
    
    function existedInFinishedWords(word) {
        var existed = null;
        $(activedStep).find('.finished-words li').each(function() {
            if ($(this).attr('data-id') == word.id) {
                existed = $(this);
                return false;
            }
        });
        return existed;
    }
    
    function focusUserInput() {
        $(activedItem).find('.user-input').focus();
    }
    
    function findItemById(id) {
        var found = null;
        $(activedItem).siblings('.item').each(function() {
            if ($(this).attr('data-id') == id) {
                found = $(this);
                return false;
            }
        });
        return found;
    }
    
    function getWordById(id) {
        for (var i = 0; i < wordListFromJson.length; i++) {
            if (wordListFromJson[i  ].id == id) {
                return wordListFromJson[i];
            }
        }
        return null;
    }
    
    function autoMode() {
        intervalId = setInterval(function() {
            nextItem();
        }, 5000);
    }
    
    function listen() {
        if (activedItem) {
            playSound('http://ucan.vn' + $('.btn-listen', activedItem).attr('data-audio'), true, 'fc_audio_player');
        }
    }
    
    function init() {
        for (var id in wordList) {
            wordListFromJson.push({
                id : id,
                title : wordList[id].title,
                pronunciation : wordList[id].pronunciation,
                shortMeaning : wordList[id].short_meaning
            });
            
            // Step 1
            $('#step1-overview .word-list-item').append(
                '<li class="item active" data-id="' + id + '">'
                + '<h2 class="english">' 
                + '<button class="btn btn-listen" title="Listen" data-audio="' + wordList[id].audio + '"></button>'
                + wordList[id].title 
                + '</h2>'
                + '<h3 class="pronunciation">/' + wordList[id].pronunciation + '/</h3>'
                + '<div class="split"></div>'
                + '<h2 class="vietnamese">' + wordList[id].short_meaning + '</h2>'
                + '</li>'
                );
                    
            // Step 2
            $('#step2-en-vi .word-list-item').append(
                '<li class="item active" data-id="' + id + '">'
                + '<h1 class="vietnamese">' + wordList[id].short_meaning + '</h1>'
                + '<div class="split"></div>'
                + '<h3 class="pronunciation">'
                + '<span class="text">/' + wordList[id].pronunciation + '/<span></h3>'
                + '<h2 class="english">'
                + '<button class="btn btn-listen" title="Listen" data-audio="' + wordList[id].audio + '"></button>'
                + '<input type="text" class="user-input global-textbox-shadow-inset-1" data-id="' + id + '"/>'
                + '<button class="btn-check frontend-green-button">Check</button>'
                + '</h2>'
                + '</li>'
                );
            $('#step2-en-vi .finished-words').append('<li data-id="' + id + '">' + wordList[id].short_meaning + '</li>');
            
            
            // Step 3
            var randomList = getRandomList(id);
            randomList.push(wordList[id]);
            shuffle(randomList);
            var html = '';
            for (var i = 0; i < randomList.length; i++) {
                html += '<li data-id="' + randomList[i].id + '">' + randomList[i].short_meaning + '</li>';
            }
            $('#step3-vi-en .word-list-item').append(
                '<li class="item active" data-id="' + id + '">'
                + '<ul class="random-list">' + html + '</ul>'
                + '<div class="split"></div>'
                + '<h2 class="english">'
                + '<button class="btn btn-listen" title="Listen" data-audio="' + wordList[id].audio + '" ></button>'
                + '<span>' + wordList[id].title + '</span>'
                + '</h2>'
                + '</li>'
                );
            $('#step3-vi-en .finished-words').append('<li data-id="' + id + '" data-real-id="' + wordList[id].id + '">' + wordList[id].title + '</li>');
        }
    }
    
    function getRandomList(curId) {
        var count = 0;
        var randomArr = [];
        for (var id in wordList) {
            if (id != curId) {
                randomArr.push(wordList[id]);
                count++;
            }
        }
        return shuffle(randomArr).slice(0, 3);
    }
});