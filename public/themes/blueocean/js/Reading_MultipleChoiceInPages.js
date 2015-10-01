var canClickRedo = false;
var canPlay = true;
var count;
var unShowClickResult = 0;
var score;

function isAnswer(word) {
    if (word.indexOf("#") == 0)
        return true;
    else
        return false;
}
$(document).ready(function() {
    var numViewedPage = 0;
    function normalizedworld(word) {
        if (isAnswer(word) == false)
            return word;
        else
            return word.substring(1, word.lenght);
    }
    function trueAnswer(words) {
        choice = words.split("||");
        for (var i = 0; i < choice.lenght; i++)
        {
            if (isAnswer(choice[i]))
                return choice[i];
        }
        return false;
    }

    function moveToTab(index) {
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        numViewedPage++;
    }

    function inactivateAllTabAndNavigatorButton() {
        $("#questions").children().hide();
    }
    function activeTabAndButton(index) {
        $('#reading-board').html(reading[index]);
        for (var i = 0; i < count; i++)
        {
            if (activityContent.question[i].page == undefined) {
                if (index == 0) {
                    $('#question-container_' + i).show();
                }
            }
            else {
                if ((parseInt(index) + 1) == activityContent.question[i].page) {
                    $('#question-container_' + i).show();
                }
            }
        }
    }
    function orderQuestion() {
        var order = 0;
        for (var i = 0; i < activityContent.reading.length; i++) {
            for (var j = 0; j < count; j++) {
                if (activityContent.question[j].page == undefined) {
                    if (i == 0) {
                        $('#question-container_' + j + ' .order-question').append(++order + '.');
                    }
                }
                else {
                    if (activityContent.question[j].page == (i + 1)) {
                        $('#question-container_' + j + ' .order-question').append(++order + '.');
                    }
                }
            }
        }
    }


    function displayActivity() {
        canPlay = true;
        var buttonHtml = "";
        var questionHtml = "";
        for (var i = 0; i < activityContent.reading.length; i++) {
            buttonHtml += '<div id="sentence-button_' + (activityContent.reading.length - i - 1) + '" data-order="' + (activityContent.reading.length - i - 1) + '" class="inactive-button unselected">' + (activityContent.reading.length - i) + '</div>';
        }
        for (i = 0; i < count; i++) {
            var choices = activityContent.question[i].choice.split("||");
            questionHtml += '<div id=question-container_' + i + '>';
            var questiontmp = activityContent.question[i].ask.split('[]');
            if (questiontmp[1] != undefined) {
                questionHtml += '<p id="ask-container_' + i + '" class="ask-container"><span class="order-question"></span>' + questiontmp[0] + '<span class="blank"> _____ </span>' + questiontmp[1] + '<span id="true-false-icon_' + i + '"></span> </p>';
            }
            else {
                questionHtml += '<p class="ask-container"><span class="order-question"></span>' + activityContent.question[i].ask + '<span id="true-false-icon_' + i + '"></span> </p>';
            }
            for (var j = 0; j < choices.length; j++) {
                questionHtml += '<div value="0" id="choice-container_' + i + '_' + j + '" class="choice-container" ><div value="0" class="choice global-choice-square-2 id="check_' + i + '_' + j + '"></div><label for="radio_' + i + '_' + j + '">' + normalizedworld(choices[j]) + '</label></div>';
            }
            questionHtml += '</div>';
        }
        $('.true').hide();
        $('.false').hide();
        $('#question-link').append(buttonHtml);
        $('#questions').append(questionHtml);

        $('.inactive-button').click(function() {
            var id = $(this).attr('data-order');
            moveToTab(id);
        });

        $('.choice-container').click(function() {
            if (!canPlay)
                return;
            playSound(Ucan.Resource.Audio.getClickedSound());
            if ($(this).attr("value") == "0") {
                $(this).attr("value", "1");
                $(this).siblings('.ask-container').find('.blank').html(' ' + $(this).text() + ' ').addClass('checked-blank');
                $(this).siblings().attr("value", 0);
                $(this).children('.choice').addClass('checked');
                $(this).siblings().children('.choice').removeClass('checked');
            }

        });

        $('#next-link').click(function() {
            if (curTabIndex < count - 1) {
                moveToTab(curTabIndex + 1);
            }
        });
        $('#prev-link').click(function() {
            if (curTabIndex > 0) {
                moveToTab(curTabIndex - 1);
            }
        });

        moveToTab(0);
        if (activityContent.reading.length < 2) {
            $('#prev-link').hide();
            $('#next-link').hide();
            $('#loadResult').css({
                'margin': '0 auto',
                'float': 'none'
            });
            $('#question-link').hide();
        }
    }

    function editGUI() {
        $('#questions').css('min-height', $('#main-board').height() - $('.global-submit-div').height());
    }

    count = activityContent.question.length; //number of question
    var reading = [];
    for (i = 0; i < activityContent.reading.length; i++) {
        reading[i] = Ucan.Function.HTML.editMediaUrl(activityContent.reading[i].page);
    }
    var curTabIndex = 0;
    var numberOfTrueAnswers = 0;

    displayActivity();
    orderQuestion();
    editGUI();

    $("#loadResult").click(function() {
        $(document).keyup(function(e) {
            if (e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if ((numViewedPage == 1) && (activityContent.reading.length > 1) ) {
            unShowClickResult++;
            if (unShowClickResult == 1) {
                $('.overlay-black').show();
                $('#multipage-confirm-dialog').fadeIn(500);
            }
        }
        else {
            loadResult();
        }
    });

    $("#redo").click(function() {
        unShowClickResult = 0;
        numViewedPage = 0;
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            $("#show-result").slideUp(1200);
            $('#question-link').html('');
            $('#questions').html('');
            displayActivity();
            canPlay = true;
        });
    });

    $("#show-answer").click(function() {
        for (var i = 0; i < count; i++) {
            var choices = activityContent.question[i].choice.split("||");
            for (var j = 0; j < choices.length; j++) {
                if (isAnswer(choices[j]))
                {
                    $("#choice-container_" + i + '_' + j).children('.choice').addClass('checked').fadeOut(500).fadeIn(500);
                    $("#choice-container_" + i + '_' + j).siblings(".choice-container").children('.choice').removeClass('checked');
                    $('#choice-container_' + i + '_' + j).siblings('.ask-container').find('.blank').html(' ' + $('#choice-container_' + i + '_' + j).text() + ' ').addClass('checked-blank');
                    $("#choice-container_" + i + '_' + j).attr("value", 1);
                }
            }
        }
    });
});

function isAnswer(word) {
    if (word.indexOf("#") == 0)
        return true;
    else
        return false;
}

function loadResult() {
    if (!canPlay)
        return;
    canPlay = false;
    numberOfTrueAnswers = 0;
    playSound(Ucan.Resource.Audio.getShowResultSound());

    for (var i = 0; i < count; i++) {
        var inputValue = -1;
        var choices = activityContent.question[i].choice.split("||");
        for (var j = 0; j < choices.length; j++) {
            inputValue = ($('#choice-container_' + i + '_' + j).attr("value") == "1") ? j : inputValue;
        }
        if (inputValue != -1) {
            if (isAnswer(choices[inputValue])) {
                numberOfTrueAnswers++;
                insertTrueFalseIcon(true, "#true-false-icon_" + i);
            }
            else {
                insertTrueFalseIcon(false, "#true-false-icon_" + i);
            }
        }
        else {
            insertTrueFalseIcon(false, "#true-false-icon_" + i);
        }
    }
    $('.true-icon').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
    $('.false-icon').fadeOut(500).fadeIn(500);
    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
    score = Math.floor((numberOfTrueAnswers / count) * 100);
    $("#score-text").text(score);
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
    canClickRedo = true;
}