$(document).ready(function() {

    var count = activityContent.group.length;
    var sentences = [];
    var canPlay = true;
    var canClickRedo = false;

    displayActivity();
    
    function displayActivity() {
        var html = "";
        for (i = 0; i < count; i++) {
            html += '<div id="sentences_' + i + '" class="sentences">';
            html += '<ul id="questions_' + i + '" class="sentences-number">';
            sentences[i] = htmlEncode(activityContent.group[i].sentence.toLowerCase());
            words = sentences[i].split("||");
            shuffle_array = shuffle(words);
            html += '<li  class="questions">' + (i + 1) + '</li>';
            html += '<div style="clear:both"></div>';
            html += '</ul>';
            html += '<ul class="sortable" id="sentence_' + i + '" >';
            for (var j = 0; j < shuffle_array.length; j++) {
                html += '<li class="ui-state-default" id="partten_' + i + '_' + j + '">';
                html += shuffle_array[j];
                html += '</li>';
            }
            html += '<div style="clear:both"></div>';
            html += '</ul>';
            html += '<ul class="answers"><li id="true-false-icon_' + i + '"></li></ul>';
            html += '<div style="clear:both"></div>';
            html += '</div>';
        }

        $('#sentences').html(html);
        
        for (i = 0; i < count; i++) {
            $("#questions_" + i).css({
                "height": ($('#sentence_' + i).height() + 'px')
            });
        }
        
        if (!canPlay) {
            return;
        }
        
        $(".sortable").sortable({
            opacity: 0.8,
            revert: true,
            cursor: "move",
            containment: "#activity-container",
            start: function(event, ui) {
                ui.helper.css("width", (ui.helper.width() + 1) + 'px');
            },
            stop: function(event, ui) {
                playSound(Ucan.Resource.Audio.getHitSound());
            }
        });
        $("#sentences ul").disableSelection();
    }

    var numberOfTrueAnswers = 0;
    
    $("#loadResult").click(function() {
        if (!canPlay) {
            return;
        }
        
        canPlay = false;
        numberOfTrueAnswers = 0;
        playSound(Ucan.Resource.Audio.getShowResultSound());
        $(".sortable").sortable('disable');
        
        var j = 0;
        $(".sortable").each(function() {
            var answers = [];
            $(this).children('li').each(function() {
                answers[answers.length] = $(this).text();
            });

            if (sentences[j] === answers.join("||")) {
                numberOfTrueAnswers++;
                insertTrueFalseIcon(true, "#true-false-icon_" + j);
                $("#true-false-icon_" + j).attr("class", "true-icon");
            } else {
                insertTrueFalseIcon(false, "#true-false-icon_" + j);
                $("#true-false-icon_" + j).attr("class", "false-icon");
                console.log(sentences[j], answers.join('||'));
            }
            j++;
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

        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $('#sentences').html('');
            displayActivity();
            $('.ui-state-default').fadeOut(500).fadeIn(500);
        });
    });

    $("#show-answer").click(function() {
        var i = 0;
        $('.sortable').each(function() {
            html = '';
            words = sentences[i].split("||");
            for (var j = 0; j < words.length; j++) {
                html += '<li class="ui-state-default" id="partten_' + i + '_' + j + '">';
                html += words[j];
                html += '</li>';
            }
            html += '<div style="clear:both"></div>';
            $(this).html(html);
            i++;
        });
        
        $('.sortable').fadeOut(500).fadeIn(500);
    });
});