$(document).ready(function() {
    var groupArr = [];
    var groups = [];
    var canPlay = true;
    var canClickRedo = false;

    var reading = activityContent.reading
            .replace(/\[/g, '<span class="select-word select-word-unmatch">')
            .replace(/\]/g, '</span>');
    
    $('#reading-container').append(Ucan.Function.HTML.editMediaUrl(reading));

    $('.select-word').each(function() {
        var wordArr = $(this).text().split('--');
        groupArr[groupArr.length] = wordArr;
        $(this).text(wordArr[0]).attr('data-index', groupArr.length).show();
    });

    var count = groupArr.length; //number of word groups
    $('.select-word').draggable({
        revert: "invalid",
        helper: "clone",
        start: function(event, ui) {
            $(this).data('draggable').offset.click.top = -7;
            $('#draggable-holder').css('top', $('#reading-container .jspPane').css('top'));
            $('#draggable-holder').append(ui.helper);
        }
    });

    displayActivity();

    function displayActivity() {
        canPlay = true;
        $('.select-word').draggable('enable').removeClass("select-word-match").addClass("select-word-unmatch");
        var sentenceHtml = '';
        groups = shuffle(groupArr);

        for (var i = 0; i < count; i++) {
            sentenceHtml += '<div class="group ' + (i != count - 1 ? "middle-group" : "last-group") + '"><div id="word_' + (i + 1) + '" class="word-container word-container-unmatch"></div><div id="sentence_' + (i + 1) + '" class="sentence-container">' + groups[i][1] + '</div></div>';
        }

        var readingHtml = "";
        readingHtml += '<div id="white"></div>';
        $('#reading-board').append(Ucan.Function.HTML.editMediaUrl(readingHtml));
        $("#sentence-container").append(sentenceHtml);

        var maxHeight = Math.max(500, $('#activity-board').height());
        $('#reading-board ').height(maxHeight - 40);
        $('#activity-board').height(maxHeight);
        $('#reading-container').height(maxHeight - 40);
        $('#activity-container').height(maxHeight + $('#activity-example').height() + 20);
        $('#sentence-container').height(maxHeight - 170);
        $('.word-container').draggable({
            revert: "invalid",
            helper: "clone",
            disable: "true"
        });

        $('.group').droppable({
            accept: ".select-word,.word-container",
            over: function(event, ui) {
                $(this).children('.word-container').removeClass('word-container-unmatch word-container-match').addClass('word-container-over');
            },
            out: function(event, ui) {
                if ($(this).children('.word-container').text() != '') {
                    $(this).children('.word-container').removeClass('word-container-over').addClass('word-container-match');
                } else {
                    $(this).children('.word-container').removeClass('word-container-over').addClass('word-container-unmatch');
                }
            },
            drop: function(event, ui) {
                $(this).children('.word-container').removeClass('word-container-over').addClass('word-container-match');
                // neu keo tu bai doc
                if (ui.draggable.hasClass('select-word')) {
                    ui.draggable.removeClass('select-word-unmatch').addClass('select-word-match').draggable('disable');

                    // neu o da co san tu
                    if ($(this).children('.word-container').text() != '') {
                        $('.select-word[data-index="' + $(this).children('.word-container').attr('data-index') + '"]')
                                .removeClass("select-word-match").addClass('select-word-unmatch')
                                .draggable('enable').fadeOut(500).fadeIn(500);
                    }
                    $(this).children('.word-container').text(ui.draggable.text()).draggable('enable');
                    $(this).children('.word-container').attr('data-index', ui.draggable.attr('data-index'));
                }
                // neu keo tu o khac
                else {
                    var tempText = $(this).children('.word-container').text();
                    var tempIndex = $(this).children('.word-container').attr('data-index');
                    if ($(this).children('.word-container').attr('id') == ui.draggable.attr('id'))
                        return;
                    $(this).children('.word-container').text(ui.draggable.text());
                    $(this).children('.word-container').attr('data-index', ui.draggable.attr('data-index'));
                    ui.draggable.text(tempText).attr('data-index', tempIndex);
                    $(this).children('.word-container').draggable('enable');
                    if (tempText == "")
                        ui.draggable.removeClass("word-container-match").addClass('word-container-unmatch').draggable("disable");
                }
                playSound(Ucan.Resource.Audio.getClickedSound());
            }
        });

        // Keo quay tro lai bai doc
        $('#reading-board').droppable({
            accept: ".word-container",
            drop: function(event, ui) {
                ui.draggable.draggable("disable");
                $('.select-word[data-index="' + ui.draggable.attr('data-index') + '"]')
                        .removeClass("select-word-match").addClass('select-word-unmatch')
                        .draggable('enable')
                        .fadeOut(200).fadeIn(200);

                ui.draggable.fadeOut(200, function() {
                    $(this).text("").attr('data-index', '').removeClass('word-container-match').addClass('word-container-unmatch');
                }).fadeIn(200);
                playSound(Ucan.Resource.Audio.getClickedSound());
            }
        });

        $('#reading-container').ucanJScrollPane('#reading-board');
    }

    //get Result
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function() {
        if (!canPlay)
            return;
        canPlay = false;
        $('.ui-draggable').draggable('disable');

        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0; //reset after clicking result

        for (i = 0; i < count; i++) {
            if ($('#word_' + (i + 1)).text().toLowerCase() == groups[i][0].toLowerCase()) {
                numberOfTrueAnswers++;
                insertTrueFalseIconAfter(true, $('#sentence_' + (i + 1)));
            }
            else {
                insertTrueFalseIconAfter(false, $('#sentence_' + (i + 1)));
            }
        }
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

    $('#redo').click(function() {
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;

        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $("#sentence-container").html("");
            displayActivity();
        });
    });

    $('#show-answer').click(function() {
        for (var i = 0; i < count; i++) {
            $('#word_' + (i + 1)).text(groups[i][0]);
        }
        $('.word-container').removeClass("word-container-unmatch").addClass('word-container-match').fadeOut(500).fadeIn(500);
    });

});
