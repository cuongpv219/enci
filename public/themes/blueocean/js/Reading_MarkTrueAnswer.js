function editGUI() {
    var readingBoardHeight = $("#reading-board").height();
    var activityHeight = $('#activity-board').height();
    
    var max = Math.max(readingBoardHeight, activityHeight);
    max = max > 500 ? 500 : max;
    
    $('#reading-board').height(max);
    $('#activity-board').height(max + 20);
    $('#sentences-wrapper').height($('#activity-board').height() - $('#submitDiv').height() - 40);
    $("#reading-board").ucanJScrollPane('#left-wrapper');
}

$(document).ready(function() {
    
    var count = activityContent.group.length; //number of sentences
    var firtCharArray = new Array();
    var answers = [];
    var canPlay = true;
    var canClickRedo = false;
    
    if ((activityContent.choices != undefined) && (activityContent.choices != "")) {
        firtCharArray = getFirtCharArray(activityContent.choices);
    } else {
        for (i = 0; i < count; i++) {
            if (activityContent.group[i].sentence.match(/\[(.*?)\]/)[0].replace('[', "").replace(']', "") != undefined) {
                if (jQuery.inArray(activityContent.group[i].sentence.match(/\[(.*?)\]/)[0].replace('[', "").replace(']', ""), firtCharArray) == -1) {
                    firtCharArray.push(activityContent.group[i].sentence.match(/\[(.*?)\]/)[0].replace('[', "").replace(']', ""));
                }
            }
        }
    }

    $('#reading-board').html(Ucan.Function.HTML.editMediaUrl(activityContent.reading));

    displayActivity();

    function displayActivity() {
        answers = [];
        var html = "";
        var title = "";
        var sentences = [];
        canPlay = true;
        
        if (count > 0) {
            var sentenseTitle = '';
            if (typeof activityContent.sentenseTitle != 'undefined') {
                sentenseTitle = activityContent.sentenseTitle;
            }
            title += '<span class="sentence-title">' + sentenseTitle + '</span>';
            for (var k = 0; k < firtCharArray.length; k++) {
                title += '<span id="title_' + k + '" class="choice-title">' + firtCharArray[k] + '</span>';
            }
            title += '<div class="answers"></div></div>';
            for (var i = 0; i < count; i++) {
                sentences[i] = activityContent.group[i].sentence.replace(/\[(.*?)\]/, "").replace(/^\s+|\s+$/g, "");
                var answer = activityContent.group[i].sentence.match(/\[(.*?)\]/)[0];
                answers[i] = $.inArray(answer.substr(1, answer.length - 2), firtCharArray);
                html += '<div class="sentences-row">';
                html += '<div class="sentences cell">' + sentences[i] + '</div>';

                for (var j = 0; j < firtCharArray.length; j++) {
                    html += '<div class="cell"><div id="check_' + i + '_' + j + '" class="choice global-choice-circle" value="0"></div></div>';
                }

                html += '<div class="answers cell"><div id="true-false-icon_' + i + '"></div></div>';
                html += '</div>';
            }
        }
        $("#activity-container .global-orange-bar").append(title);
        $("#sentences-wrapper").append(html);
        $('#sentences-wrapper .choice').click(function() {
            if (!canPlay) {
                return;
            }
            playSound(Ucan.Resource.Audio.getClickedSound());
            $(this).parents('.sentences-row:first').find('.choice').attr("value", "0").removeClass('checked');
            $(this).attr("value", "1").addClass('checked');
        });

        editGUI();
    }
    
    $("#loadResult").click(function() {
        if (!canPlay) {
            return;
        }
        canPlay = false;
        playSound(Ucan.Resource.Audio.getShowResultSound());

        var numberOfTrueAnswers = 0;
        for (var i = 0; i < count; i++) {
            var inputValue = -1;
            for (var j = 0; j < firtCharArray.length; j++) {
                inputValue = ($('#check_' + i + '_' + j).attr("value") == "1") ? j : inputValue;
            }
            if (answers[i] == inputValue) {
                numberOfTrueAnswers++;
                insertTrueFalseIcon(true, "#true-false-icon_" + i);
            }
            else {
                insertTrueFalseIcon(false, "#true-false-icon_" + i);
            }
        }
        // Nhấp nháy icon đúng sai
        $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();

        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
        score = Math.floor((numberOfTrueAnswers / count) * 100);
        $("#score-text").text(score);
        if (count == 0) {
            window.location.replace(nextActivityUrl);
        } else {
            $('#show-result').show('slide', {
                direction: "left"
            }, Ucan.Constants.getShowResultSpeed());
            canClickRedo = true;
        }
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
            $('#sentences-wrapper .choice').attr("value", "0").removeClass('checked');
            $('.answers .true-icon, .answers .false-icon').remove();
        });
    });

    $("#show-answer").click(function() {
        $('.choice.checked').attr("value", "0").removeClass('checked');
        for (var i = 0; i < count; i++) {
            var rightChoice = $('#check_' + i + '_' + answers[i]);
            $(rightChoice).attr("value", "0");
            $(rightChoice).addClass('checked').stop(true, true).fadeOut(500).fadeIn(500);
        }
    });
    function getFirtCharArray(groupChoice) {
        var choiceArray = groupChoice.split("/");
        var firtCharArray = [];
        for (i = 0; i < choiceArray.length; i++) {
            firtCharArray[i] = (choiceArray[i]).replace(/^\s+|\s+$/g, "").substring(0, 1);
        }
        return firtCharArray;
    }
});