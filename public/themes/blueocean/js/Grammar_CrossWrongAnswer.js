$(document).ready(function() {

    function displayActivity() {
        canPlay = true;
        answers = [];
        var paragraph = activityContent.paragraph;
        var paragraphHtml = Ucan.Function.HTML.editMediaUrl(ucanMarkupToHtml(paragraph));

        // to get strings in [[]] bracket
        paragraphHtml = paragraphHtml.replace(/\[/g, '<span class="choices-container">');
        paragraphHtml = paragraphHtml.replace(/\]/g, '</span>');

        //display paragraph
        $('#paragraph-container').append($(paragraphHtml));
        //change display
        $('.choices-container').each(function() {
            var curGroupOrder = answers.length;
            answers[curGroupOrder] = 0;
            var choices = $(this).text().split('||');
            var choiceHtml = '';
            $(this).html('');
            for (i = 0; i < choices.length; i++) {
                if ($.trim(choices[i]).indexOf("#") == 0) {
                    choiceHtml += '<span class="choice" order="' + i + '">' + $.trim(choices[i]).substr(1) + '</span>';
                    answers[curGroupOrder] += Math.pow(2, i);
                }
                else {
                    choiceHtml += '<span class="choice" order="' + i + '">' + $.trim(choices[i]) + '</span>';
                }
                choiceHtml = (i == (choices.length - 1)) ? choiceHtml : choiceHtml + ' / ';
            }
            $(this).append(choiceHtml);
        });

        $(".choice").click(function() {
            if (canPlay == false)
                return;
            playSound(Ucan.Resource.Audio.getClickedSound2());
            if (!$(this).hasClass('chosen')) {
                $(this).animate({
                    "opacity": "0.3"
                }, 500, function() {
                    $(this).css('text-decoration', 'line-through');
                }).animate({
                    "color": "#C12942",
                    "opacity": "1"
                }, 500).addClass("chosen");
            }
            else {
                $(this).animate({
                    "opacity": "0.3"
                }, 500, function() {
                    $(this).css('text-decoration', '');
                }).animate({
                    "color": "#4375B1",
                    "opacity": "1"
                }, 500).removeClass("chosen");
            }
        });
    }

    var canPlay = true;
    var answers = [];
    var canClickRedo = false;

    displayActivity();

    var numberOfTrueAnswers = 0;
    //get Result
    $("#loadResult").click(function() {
        if (canPlay == false)
            return;
        canPlay = false;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0;
        var j = 0;
        $('.choices-container').each(function() {
            var selectValue = 0;
            $(this).children('.chosen').each(function() {
                selectValue += Math.pow(2, $(this).attr('order'));
            });

            if (selectValue == answers[j]) {
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, $(this).last());
            }
            else {
                insertTrueFalseIconAfter(false, $(this).last());
            }
            j++;
        });

        $('.true-icon').css({
            margin: "-10px 2px 0px 1px",
            boxShadow: "none",
            border: "none",
            width: '18px',
            height: '18px'
        });
        $('.false-icon').css({
            margin: "-5px 2px 0px 1px",
            boxShadow: "none",
            border: "none",
            width: '18px',
            height: '18px'
        });

        // Nhấp nháy icon đúng sai
        $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();

        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + answers.length);
        score = Math.floor((numberOfTrueAnswers / answers.length) * 100);
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
        canPlay = true;

        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            $("#paragraph-container").html("");
            displayActivity();
        });
    });

    $("#show-answer").click(function() {
        $('.chosen').removeClass('.chosen');

        $('.choice').animate({
            "opacity": "0.3"
        }, 500, function() {
            $(this).css('text-decoration', '');
        }).animate({
            "color": "#4f81bd",
            "opacity": "1"
        }, 500);

        var j = 0;
        $('.choices-container').each(function() {
            var answerArr = answers[j].toString(2);
            $(this).children('.choice').each(function() {
                if (answerArr[answerArr.length - 1 - $(this).attr('order')] == '1') {
                    $(this).addClass('answer');
                }
            });
            j++;
        });
        $('.answer').animate({
            "opacity": "0.3"
        }, 500, function() {
            $(this).css('text-decoration', 'line-through');
        }).animate({
            "color": "#C12942",
            "opacity": "1"
        }, 500);
    });
});