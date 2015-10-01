$(document).ready(function() {
    if (defaultLanguage == 'vi') {
        multiLangSystem.activity_guide_text = 'Kéo từ vào chỗ trống phù hợp';
    } else {
        multiLangSystem.activity_guide_text = 'Drag words to the appropriate blanks';
    }

    var canPlay = true;
    var canClickRedo = false;

    // Tinh chỉnh dữ liệu    
    var count = activityContent.group.length; //number of word groups
    var countQuestion = 0;
    var questionGroupArr = [];

    for (var i = 0; i < count; i++) {
        var obj = JSON.parse(activityContent.group[i].question);

        if (obj.reading) {
            obj.reading = Ucan.Function.HTML.editMediaUrl(obj.reading);
        }
        
        if (obj.paragraph) {
            obj.paragraph = Ucan.Function.HTML.editMediaUrl(obj.paragraph);
        }

        if (obj.type == '0') {
            questionArr = [];
            questionGroupArr[questionGroupArr.length] = questionArr;
        } else {
            switch (obj.type) {
                case '1':
                    countQuestion++;
                    var arr = obj.choices.split("||");
                    var choiceArr = [];
                    var answer = -1;
                    for (var j = 0; j < arr.length; j++) {
                        choiceArr[j] = $.trim(arr[j]);
                        if (choiceArr[j].indexOf("#") == 0) {
                            answer = j;
                            choiceArr[j] = choiceArr[j].substring(1);
                        }
                    }
                    obj.choiceArr = choiceArr;
                    obj.answer = answer;
                    break;
                case '6':
                    countQuestion++;
                    var arr = obj.choices.split("||");
                    var choiceArr = [];
                    var answer = 0;
                    for (var j = 0; j < arr.length; j++) {
                        choiceArr[j] = $.trim(arr[j]);
                        if (choiceArr[j].indexOf("#") == 0) {
                            answer += Math.pow(2, j);
                            choiceArr[j] = choiceArr[j].substring(1);
                        }
                    }
                    obj.choiceArr = choiceArr;
                    obj.answer = answer;
                    break;
                case '7':
                    countQuestion++;
                    var arr = obj.choices.split("||");
                    var choiceArr = [];
                    var answer = -1;
                    var maxLength = 1;
                    for (var j = 0; j < arr.length; j++) {
                        choiceArr[j] = $.trim(arr[j]);
                        if (choiceArr[j].indexOf("#") == 0) {
                            answer = j;
                            choiceArr[j] = choiceArr[j].substring(1);
                        }
                        maxLength = (choiceArr[j].length > maxLength) ? choiceArr[j].length : maxLength;
                    }
                    var choiceClass = (maxLength < 3) ? 'shortest' : ((maxLength < 6) ? 'short' : ((maxLength < 9) ? 'long' : 'longest'));
                    obj.choiceArr = choiceArr;
                    obj.answer = answer;
                    obj.choiceClass = choiceClass;
                    break;
                case '2':
                    countQuestion++;
                    var arr = obj.words.split("||");
                    var wordArr = [];
                    for (var j = 0; j < arr.length; j++) {
                        wordArr[j] = $.trim(arr[j]).toLowerCase();
                    }
                    obj.wordArr = wordArr;
                    obj.answer = wordArr.join(' ');
                    break;
                case '3':
                    var paragraphHtml = obj.paragraph;
                    var pattern = /\[([^\]])+\]/g;
                    // to get strings in [] bracket
                    var choiceList = [];
                    var choiceStrArr = paragraphHtml.match(pattern);
                    for (var j = 0; j < choiceStrArr.length; j++) {
                        var choiceStr = choiceStrArr[j].substring(1, choiceStrArr[j].length - 1);
                        var choiceObj = new Object();
                        var arr = choiceStr.split("||");
                        var choiceArr = [];
                        var answer = -1;
                        for (var k = 0; k < arr.length; k++) {
                            choiceArr[k] = $.trim(arr[k]);
                            if (choiceArr[k].indexOf("#") == 0) {
                                answer = k;
                                choiceArr[k] = choiceArr[k].substring(1);
                            }
                        }
                        choiceObj.answer = answer;
                        choiceObj.choiceArr = choiceArr;
                        choiceList[choiceList.length] = choiceObj;
                    }
                    pattern = /\[([^\]])+\]/;
                    for (var j = 0; j < choiceList.length; j++) {
                        var strReplace = '<span class="choosecorrectanswer-choices-container" data-group="' + (questionGroupArr.length - 1) + '" data-index="' + (questionGroupArr[questionGroupArr.length - 1].length) + '" data-order="' + j + '">';
                        for (var k = 0; k < choiceList[j].choiceArr.length; k++) {
                            strReplace += ((k == 0) ? '' : ' / ') + '<span class="choosecorrectanswer-choice" data-index="' + k + '">' + choiceList[j].choiceArr[k] + '</span>';
                        }
                        strReplace += '</span>';
                        paragraphHtml = paragraphHtml.replace(pattern, strReplace)
                    }
                    obj.paragraphHtml = paragraphHtml;
                    obj.choiceList = choiceList;
                    countQuestion += choiceList.length;
                    break;
                case '4':
                    var paragraphHtml = obj.paragraph;
                    var pattern = /\[([^\]])+\]/g;
                    // to get strings in [] bracket
                    var answersList = [];
                    var answerStrList = [];
                    var answersStrArr = paragraphHtml.match(pattern);
                    var blankClass = '';
                    if (answersStrArr) {
                        blankClass = getCompletetextBlankClass(answersStrArr);
                        for (var j = 0; j < answersStrArr.length; j++) {
                            var answersStr = answersStrArr[j].substring(1, answersStrArr[j].length - 1);
                            var arr = answersStr.split("/");
                            answersList[answersList.length] = arr;
                            answerStrList[answerStrList.length] = answersStr;
                        }
                    }

                    pattern = /\[([^\]])+\]/;
                    for (var j = 0; j < answersList.length; j++) {
                        var strReplace = '<input type="text" class="completetext-blank completetext-blank-' + blankClass + '" data-group="' + (questionGroupArr.length - 1) + '" data-index="' + (questionGroupArr[questionGroupArr.length - 1].length) + '" data-order="' + j + '">';
                        paragraphHtml = paragraphHtml.replace(pattern, strReplace)
                    }
                    obj.paragraphHtml = paragraphHtml;
                    obj.answersList = answersList;
                    obj.answerStrList = answerStrList;
                    countQuestion += answersList.length;
                    break;
                case '5':
                    var paragraphHtml = obj.paragraph;
                    var pattern = /\[([^\]])+\]/g;
                    // to get strings in [] bracket
                    var answerStrList = [];
                    var answersStrArr = paragraphHtml.match(pattern);
                    var blankClass = getCompletetextBlankClass(answersStrArr);
                    var underscoreStr = (blankClass == 'shortest') ? '_______' : ((blankClass == 'short') ? '______________' : ((blankClass == 'long') ? '_____________________' : '____________________________'));
                    for (var j = 0; j < answersStrArr.length; j++) {
                        var answersStr = answersStrArr[j].substring(1, answersStrArr[j].length - 1);
                        answerStrList[answerStrList.length] = answersStr;
                    }
                    pattern = /\[([^\]])+\]/;
                    for (var j = 0; j < answerStrList.length; j++) {
                        var strReplace = '<span class="completetextwithgivenword-blank" data-group="' + (questionGroupArr.length - 1) + '" data-index="' + (questionGroupArr[questionGroupArr.length - 1].length) + '" data-order="' + j + '"><span class="underscore">' + underscoreStr + '</span></span>';
                        paragraphHtml = paragraphHtml.replace(pattern, strReplace);
                    }
                    obj.paragraphHtml = paragraphHtml;
                    obj.answerStrList = answerStrList;
                    obj.underscoreStr = underscoreStr;
                    countQuestion += answerStrList.length;
                    break;
            }
            questionGroupArr[questionGroupArr.length - 1][questionGroupArr[questionGroupArr.length - 1].length] = obj;
        }
    }

    function getCompletetextBlankClass(arr) {
        var retStr = '';
        var maxLength = 0;
        for (var i = 0; i < arr.length; i++) {
            var str = htmlEncode(arr[i]);
            var avrLength = str.length / ((str.match('/')) ? str.match('/').length + 1 : 1);
            if (avrLength > maxLength) {
                maxLength = avrLength;
            }
        }
        if (maxLength < 10) {
            retStr = 'shortest';
        } else if (maxLength < 20) {
            retStr = 'short';
        } else if (maxLength < 30) {
            retStr = 'long';
        } else {
            retStr = 'longest';
        }
        return retStr;
    }

    function displayActivity() {
        for (var i = 0; i < questionGroupArr.length; i++) {
            var questionArr = questionGroupArr[i];
            var html = '';
            for (var j = 0; j < questionArr.length; j++) {
                var obj = questionArr[j];
                html += '<div class="question-wrapper" data-group="' + i + '" data-index="' + j + '" data-type="' + obj.type + '" data-answer="' + ((obj.type == 6) ? '0' : '-1') + '">';
                switch (obj.type)
                {
                    case '1':
                        var question = obj.question.replace('[]', '<span class="blank">__________</span>');
                        html += '<div class="multiplechoice-ask">' + question + '</div>';
                        for (var k = 0; k < obj.choiceArr.length; k++) {
                            html += '<div class="multiplechoice-choice-container" data-index="' + k + '"><div class="multiplechoice-choice global-choice-square"></div><span class="multiplechoice-choice-text">' + obj.choiceArr[k] + '</span></div>';
                        }
                        break;
                    case '6':
                        html += '<div class="checklist-ask">' + obj.question + '</div>';
                        for (var k = 0; k < obj.choiceArr.length; k++) {
                            html += '<div class="checklist-choice-container" data-index="' + k + '"><div class="checklist-choice global-choice-square"></div><span class="checklist-choice-text">' + obj.choiceArr[k] + '</span></div>';
                        }
                        break;
                    case '7':
                        html += '<div class="marktrueanswer-order">1.</div><div class="marktrueanswer-choices">';
                        for (var k = 0; k < obj.choiceArr.length; k++) {
                            html += '<div class="marktrueanswer-choice marktrueanswer-choice-' + obj.choiceClass + ' unselected" data-index="' + k + '">' + obj.choiceArr[k] + '</div>';
                        }
                        html += '</div><div class="marktrueanswer-sentence">' + (obj.sentence ? obj.sentence : '') + '</div>';
                        break;
                    case '2':
                        var ranArr = shuffle(obj.wordArr.slice(0));
                        html += '<ul class="sortword-list sortable">';
                        for (var k = 0; k < ranArr.length; k++) {
                            html += '<li class="sortword-word">' + ranArr[k] + '</li>';
                        }
                        html += '</ul><div class="sortword-icon-placeholder"></div>'
                        break;
                    case '3':
                        html += obj.paragraphHtml;
                        break;
                    case '4':
                        html += obj.paragraphHtml;
                        break;
                    case '5':
                        html += '<div class="completetextwithgivenword-wordlist" data-group="' + i + '" data-index="' + j + '">';
                        ranArr = shuffle(obj.answerStrList.slice(0));
                        for (var k = 0; k < ranArr.length; k++) {
                            html += '<span class="completetextwithgivenword-word">' + ranArr[k] + '</span>';
                        }
                        html += '</div><div class="activity-guide"><div class="activity-guide-wrap"><img alt="arrow" src="/shark/public/themes/blueocean/img/down-arrow-pointer.png"><div class="activity-guide-text">' + multiLangSystem.activity_guide_text + '</div></div></div><div class="completetextwithgivenword-paragraph">';
                        html += obj.paragraphHtml;
                        html += '</div>';
                        break;
                }
                if (obj.explanation) {
                    html += '<div class="question-explanation"> * ' + obj.explanation + '</div>';
                }
                html += '</div>';
            }
            $('#group-question_' + i).append(html);
            $('.group-container').each(function() {
                var order = 1;
                $(this).find('.question-wrapper[data-type="7"]').each(function() {
                    $(this).children('.marktrueanswer-order').text(order + '.');
                    order++;
                });
            });
        }

        // Multiplechoie
        $('.multiplechoice-choice-container').click(function() {
            if (!canPlay)
                return;
            $(this).siblings('.multiplechoice-choice-container').children('.multiplechoice-choice').removeClass('checked');
            $(this).children('.multiplechoice-choice').addClass('checked');
            // Cap nhat lua chon
            $(this).siblings('.multiplechoice-ask').children('.blank').html($(this).text()).addClass('checked-blank');
            $(this).parent().attr('data-answer', $(this).attr('data-index'));
        });

        // Checklist
        $('.checklist-choice-container').click(function() {
            if (!canPlay)
                return;
            if ($(this).children('.checklist-choice').hasClass('checked')) {
                $(this).children('.checklist-choice').removeClass('checked');
            } else {
                $(this).children('.checklist-choice').addClass('checked');
            }
            var answer = 0;
            $(this).parent().find('.checklist-choice').each(function() {
                if ($(this).hasClass('checked')) {
                    answer += Math.pow(2, parseInt($(this).parent().attr('data-index')));
                }
            });
            // Cap nhat lua chon
            $(this).parent().attr('data-answer', answer);
        });

        // MarkTrueAnswer
        $('.marktrueanswer-choice').click(function() {
            if (!canPlay)
                return;
            $(this).siblings('.marktrueanswer-choice').removeClass('selected').addClass('unselected');
            $(this).removeClass('unselected').addClass('selected');
            // Cap nhat lua chon
            $(this).parent().parent().attr('data-answer', $(this).attr('data-index'));
        });

        // Sortword
        $(".sortable").sortable({
            opacity: 0.8,
            revert: true,
            cursor: "move",
            start: function(event, ui) {
                ui.helper.css("width", (ui.helper.width() + 1) + 'px');
            }
        });

        // Choosecorrectanswer
        $(".choosecorrectanswer-choice").click(function() {
            if (canPlay == false)
                return;
            $(this).parent().attr('data-answer', $(this).attr('data-index'));
            $(this).siblings().animate({
                "opacity": "0.3"
            }, 500).animate({
                "color": "#8c8c8c",
                "opacity": "1"
            }, 500).removeClass("chosen");

            $(this).animate({
                "opacity": "0.3"
            }, 500).animate({
                "color": "#f5770f",
                "opacity": "1"
            }, 500).addClass("chosen");
        });

        // Completetextwithgivenword
        $(".completetextwithgivenword-wordlist span").draggable({
            revert: "invalid",
            helper: "clone"
        });

        $(".completetextwithgivenword-blank").droppable({
            accept: ".completetextwithgivenword-word",
            over: function(event, ui) {
                if ($(this).attr('data-group') == ui.draggable.parent().attr('data-group')
                        && $(this).attr('data-index') == ui.draggable.parent().attr('data-index')) {
                    $(this).addClass('completetextwithgivenword-blank-over');
                }

            },
            out: function(event, ui) {
                $(this).removeClass('completetextwithgivenword-blank-over');
            },
            drop: function(event, ui) {
                $(this).removeClass('completetextwithgivenword-blank-over');
                if (!($(this).attr('data-group') == ui.draggable.parent().attr('data-group')
                        && $(this).attr('data-index') == ui.draggable.parent().attr('data-index'))) {
                    return;
                }
                // keo tu o trong vao o trong	
                if (ui.draggable.parent().hasClass("completetextwithgivenword-blank")) {
                    ui.draggable.parent().append($(this).children());
                    $(this).append((ui.draggable).css({
                        'color': '#f5770f'
                    }));
                }
                // keo tu list vao o trong	
                if (!(ui.draggable.parent().hasClass("completetextwithgivenword-blank"))) {
                    if ($(this).children().hasClass("completetextwithgivenword-word")) {
                        ui.draggable.parent().append($(this).children().css('color', ''));
                    }
                    $(this).children().remove();
                    $(this).append((ui.draggable).css({
                        'color': '#f5770f'
                    }));
                }

                $(this).fadeOut(200).fadeIn(500);
            }
        });

        $(".completetextwithgivenword-wordlist").droppable({
            accept: ".completetextwithgivenword-blank .completetextwithgivenword-word",
            drop: function(event, ui) {
                if (!($(this).attr('data-group') == ui.draggable.parent().attr('data-group')
                        && $(this).attr('data-index') == ui.draggable.parent().attr('data-index'))) {
                    return;
                }
                ui.draggable.parent().append('<span class="underscore">' + questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].underscoreStr + '</span>');
                $(this).append(' ').append((ui.draggable).css({
                    'color': ''
                }));
            }
        });
    }

    displayActivity();
    
    editMediaUrl();

    function editMediaUrl() {
        $('.group-reading').each(function() {
           $(this).html(Ucan.Function.HTML.editMediaUrl($(this).html())); 
        });
    }

    // View answers
    $("#show-answer").click(function() {
        $('.checked').removeClass('checked');
        $('.marktrueanswer-choice').addClass('unselected').removeClass('selected');
        $('.question-wrapper').each(function() {
            switch ($(this).attr('data-type'))
            {   //Multiplechoice
                case '1':
                    var answer = questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answer;
                    $(this).children('.multiplechoice-choice-container[data-index="' + answer + '"]').children('.multiplechoice-choice').addClass('checked');
                    $(this).children('.multiplechoice-ask').children('.blank').html(questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].choiceArr[answer]).addClass('checked-blank');
                    break;
                case '6':
                    var answer = questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answer;
                    for (var i = 0; i < questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].choiceArr.length; i++) {
                        if (answer & 1) {
                            $(this).children('.checklist-choice-container[data-index="' + i + '"]').children('.checklist-choice').addClass('checked')
                        }
                        answer = Math.floor(answer / 2);
                    }
                    break;
                case '7':
                    var answer = questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answer;
                    $(this).children('.marktrueanswer-choices').children('.marktrueanswer-choice[data-index="' + answer + '"]').addClass('selected').removeClass('unselected');
                    break;
                case '6':
                case '2':
                    var index = 0;
                    var arr = questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].wordArr;
                    $(this).children('.sortword-list').children('.sortword-word').each(function() {
                        $(this).text(arr[index++]);
                    });
                    break;
            }
        });
        // ChooseCorrectAswer
        $('.choosecorrectanswer-choice').animate({
            "opacity": "0.3"
        }, 500).animate({
            "color": "#8c8c8c",
            "opacity": "1"
        }, 500);
        $('.choosecorrectanswer-choices-container').each(function() {
            var answer = questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].choiceList[$(this).attr('data-order')].answer;
            $(this).children('.choosecorrectanswer-choice[data-index="' + answer + '"]').animate({
                "opacity": "0.3"
            }, 500).animate({
                "color": "#f5770f",
                "opacity": "1"
            }, 500);
        });
        // CompleteText
        $('.completetext-blank').each(function() {
            $(this).val(htmlEncode(questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answerStrList[$(this).attr('data-order')]));
        });
        // Completetextwithgivenword
        $('.completetextwithgivenword-blank').each(function() {
            $(this).children().text(questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answerStrList[$(this).attr('data-order')]);
        });
        $('.completetextwithgivenword-blank').css({
            'color': '#f5770f'
        }).fadeOut(500).fadeIn(500);
        $('.checked').fadeOut(500).fadeIn(500);
        $('.marktrueanswer-choices .selected').fadeOut(500).fadeIn(500);
        $('.sortable').fadeOut(500).fadeIn(500);
        $('.question-explanation').show();
    });

    //get Result
    $("#loadResult").click(function() {
        if (!canPlay) {
            return;
        }
        $(".cp-jplayer").jPlayer("stop");
        $(".sortable").sortable('disable');
        canPlay = false;
        var numberOfTrueAnswers = 0;
        $('.question-wrapper').each(function() {
            switch ($(this).attr('data-type'))
            {
                case '1': //Multiplechoice
                    if (questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answer == $(this).attr('data-answer')) {
                        numberOfTrueAnswers++;
                        insertTrueFalseIcon(true, $(this).children('.multiplechoice-ask'));
                    } else {
                        insertTrueFalseIcon(false, $(this).children('.multiplechoice-ask'));
                    }
                    $(this).children('.multiplechoice-ask').children('.true-icon,.false-icon').addClass('multiplechoice-icon');
                    break;
                case '6': //Checklist
                    if (questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answer == $(this).attr('data-answer')) {
                        numberOfTrueAnswers++;
                        insertTrueFalseIcon(true, $(this).children('.checklist-ask'));
                    } else {
                        insertTrueFalseIcon(false, $(this).children('.checklist-ask'));
                    }
                    $(this).children('.checklist-ask').children('.true-icon,.false-icon').addClass('checklist-icon');
                    break;
                case '7': //MarkTrueAnswer
                    if (questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answer == $(this).attr('data-answer')) {
                        numberOfTrueAnswers++;
                        insertTrueFalseIconAfter(true, $(this).children('.marktrueanswer-sentence'));
                    } else {
                        insertTrueFalseIconAfter(false, $(this).children('.marktrueanswer-sentence'));
                    }
                    $(this).children('.true-icon,.false-icon').addClass('marktrueanswer-icon');
                    break;
                case '2': //SordWord
                    var answer = '';
                    $(this).children('.sortword-list').children('.sortword-word').each(function() {
                        answer += ' ' + $(this).text();
                    });
                    if ($.trim(answer) == htmlEncode(questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answer)) {
                        numberOfTrueAnswers++;
                        insertTrueFalseIconAfter(true, $(this).children('.sortword-list'));
                    } else {
                        insertTrueFalseIconAfter(false, $(this).children('.sortword-list'));
                    }
                    $(this).children('.true-icon,.false-icon').addClass('sortword-icon');
                    break;
                case '3': //SordWord
                    break;
            }
        });

        $('.choosecorrectanswer-choices-container').each(function() {
            if (questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].choiceList[$(this).attr('data-order')].answer == $(this).attr('data-answer')) {
                numberOfTrueAnswers++;
                insertTrueFalseIcon(true, $(this));
            } else {
                insertTrueFalseIcon(false, $(this));
            }
        });

        $('.completetext-blank').each(function() {
            var isCorrect = false;
            var answersList = questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answersList[$(this).attr('data-order')];
            for (var i = 0; i < answersList.length; i++) {
                if (isEqualString($(this).val(), htmlEncode(answersList[i]))) {
                    isCorrect = true;
                    break;
                }
            }
            if (isCorrect) {
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, $(this));
            } else {
                insertTrueFalseIconAfter(false, $(this));
            }
        });

        $('.completetextwithgivenword-blank').each(function() {
            if (isEqualString(questionGroupArr[$(this).attr('data-group')][$(this).attr('data-index')].answerStrList[$(this).attr('data-order')], $(this).text())) {
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, $(this));
            } else {
                insertTrueFalseIconAfter(false, $(this));
            }
        });

        // Nhấp nháy icon đúng sai.
        $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + countQuestion);
        score = Math.floor((numberOfTrueAnswers / countQuestion) * 100);
        $("#score-text").text(score);
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
        canClickRedo = true;
    });

    $("#redo").click(function() {
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;

        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $('.question-explanation').hide();
            $('.question-wrapper').remove();
            displayActivity();
        });
    });
});