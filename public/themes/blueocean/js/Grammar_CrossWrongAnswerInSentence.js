$(document).ready(function() {

    //split Sentences into answers and sentences with blank
    function splitString(string) {
        var firstIndex = string.indexOf('[');
        var lastIndex = string.indexOf(']');
        var subString = [];

        if ((firstIndex != -1) && (lastIndex != -1) && (firstIndex < lastIndex)) {
            subString[0] = string.substring(firstIndex + 1, lastIndex);
            subString[1] = string.substring(0, firstIndex);
            subString[2] = string.substring(lastIndex + 1, string.length);
            return subString;
        }

        return false;
    }

    //check if a phrase contains #
    function isAnswer(string) {
        if ($.trim(string.indexOf("#")) == 0) {
            return true;
        } else {
            return false;
        }
    }

    function normalizeString(string) {
        if (isAnswer(string) == false)
            return string;
        else
            return $.trim(string).substring(1, string.length);
    }

    var count = activityContent.group.length; //number of word groups
    var canPlay = true;
    var canClickRedo = false;
    var sentences = [];
    var choices = [];

    function displayActivity() {
        var html = '<ul id="sentences">';
        var order = 0;

        for (i = 0; i < count; i++) {
            sentences[i] = activityContent.group[i].words;
            var subsentence = splitString(sentences[i]);

            if (subsentence != false) {
                order++;
                choices[i] = subsentence[0].split("||");
                html += '<li class="sentence">' + order + '. ' + subsentence[1];
                html += '<span id="choice_' + i + '" class="choices-container">\n';

                for (j = 0; j < choices[i].length; j++) {
                    html += (j > 0) ? ' / ' : "";
                    html += '<span class="choice" id="choice_' + i + '_' + j + '">' + normalizeString(choices[i][j]) + '</span>';
                }

                html += '</span>' + subsentence[2] + '<span class="true-false-icon"></li>';
            }
        }

        html += '</ul>';

        $("#sentences-container").append(html);

        $(".choice").click(function() {
            if (canPlay == false) {
                return;
            }

            playSound(Ucan.Resource.Audio.getClickedSound2());

            $(this).siblings().animate({
                "opacity": "0.3"
            }, 500, function() {
                $(this).css('text-decoration', '');
            }).animate({
                "color": "#4375b1",
                "opacity": "1"
            }, 500).removeClass("chosen");

            $(this).animate({
                "opacity": "0.3"
            }, 500, function() {
                $(this).css('text-decoration', 'line-through');
            }).animate({
                "color": "#C12942",
                "opacity": "1"
            }, 500).addClass("chosen");
        });
    }

    //display activity html
    displayActivity();

    $("#show-answer").click(function() {
        var i = 0;
        $("li.sentence").each(function() {
            var answer_temp;
            for (j = 0; j < choices[i].length; j++) {
                if (isAnswer(choices[i][j])) {
                    answer_temp = $.trim(choices[i][j]);
                }

                var tmp = $('#choice_' + i + '_' + j);
                if ('#' + $.trim($(tmp).text()) == answer_temp) {
                    $(tmp).css({
                        'text-decoration': 'line-through',
                        'color': '#C12942',
                        'opacity': '1'
                    });
                    $(tmp).addClass('visited');
                    $(tmp).siblings().css({
                        'text-decoration': 'none',
                        'background-color': 'white',
                        'cursor': 'pointer',
                        'color': '#4375B1',
                        'font-style': 'italic'
                    });
                }
            }
            i++;
        });

        $('.visited').fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
    });

    //get Result
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function() {
        if (canPlay == false) {
            return;
        }
        canPlay = false;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0; //reset after clicking result

        $("#sentences .sentence").each(function(i) {
            if ($('.chosen', this).size() == 0) {
                insertTrueFalseIcon(false, $(this).find('.true-false-icon'));
            } else {
                var answer_temp;

                for (var j = 0; j < choices[i].length; j++) {
                    if (isAnswer(choices[i][j])) {
                        answer_temp = $.trim(choices[i][j]);
                    }
                }

                if ('#' + $.trim($('.chosen', this).text()) == answer_temp) {
                    numberOfTrueAnswers++;
                    insertTrueFalseIcon(true, $(this).find('.true-false-icon'));
                } else {
                    insertTrueFalseIcon(false, $(this).find('.true-false-icon'));
                }
            }
        });

        // Nhấp nháy icon đúng sai
        $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();

        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
        score = Math.floor((numberOfTrueAnswers / count) * 100);
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
            numberOfTrueAnswers = 0;
            $("#sentences-container").html("");
            displayActivity();
        });
    });
});
