$(document).ready(function() {

    function displayActivity() {
        pictures = [];
        var picturesHtml = "";
        var sentencesHtml = "";
        var randomInputArr = shuffle(activityContent.group);
        var picturesHtmlArr = [];
        
        for (var i = 0; i < count; i++) {
            if ($.inArray(randomInputArr[i].character, pictures) == -1) {
                picturesHtmlArr[pictures.length] = '<div class="character-picture-holder" ><img class="character-picture" src="' + resourceUrl + randomInputArr[i].character + '" pictureId="' + pictures.length + '" /></div>';
                sentencesHtml += '<div class="sentence-holder"><div class="represent-picture represent-picture-unmatch" pictureId="' + pictures.length + '"></div><span class="sentence" sentenceId="' + i + '">' + randomInputArr[i].sentence + '</span></div>';
                pictures[pictures.length] = randomInputArr[i].character;
            } else {
                sentencesHtml += '<div class="sentence-holder"><div class="represent-picture represent-picture-unmatch" pictureId="' + $.inArray(randomInputArr[i].character, pictures) + '"></div><span class="sentence">' + randomInputArr[i].sentence + '</span></div>';
            }
        }
        
        picturesHtmlArr = shuffle(picturesHtmlArr);
        
        for (k = 0; k < picturesHtmlArr.length; k++) {
            picturesHtml += picturesHtmlArr[k];
        }

        $('#pictures-container').append(picturesHtml);
        $('#sentences-container').append(sentencesHtml);

        if ($('#reading-board').height() > $('#activity-board').height()) {
            if ($('#activity-board').height() > 500) {
                $('#reading-container').height($('#activity-board').height() - 20);
            } else {
                $('#reading-container').height(500);
            }
            $('#activity-container').height($('#reading-container').height() + $('#activity-example').height() + 40);
        } else {
            $('#activity-container').height($('#activity-board').height() + $('#activity-example').height() + 40);
        }

        if (pictures.length == 2) {
            $('.character-picture-holder').css({
                marginLeft: "30px",
                width: "150px",
                height: "150px"
            });
            $('.character-picture').css({
                width: "150px",
                height: "150px"
            });
        }

        $('.character-picture').draggable({
            revert: "invalid",
            helper: "clone",
            start: function(event, ui) {
                ui.helper.css({
                    width: "38px",
                    height: "38px",
                    border: "1px solid #ff3430"
                });
                $(this).data('draggable').offset.click.top = 19;
                $(this).data('draggable').offset.click.left = 19;
            }
        });

        $('.sentence-holder').droppable({
            accept: ".character-picture",
                    
            over: function(event, ui) {
                $(this).children('.represent-picture')
                        .removeClass('represent-picture-match represent-picture-unmatch')
                        .addClass('represent-picture-over');
                playSound(Ucan.Resource.Audio.getClickedSound());
            },
                    
            out: function(event, ui) {
                if ($(this).children('.represent-picture').children().length > 0) {
                    $(this).children('.represent-picture')
                            .removeClass('represent-picture-over')
                            .addClass('represent-picture-match');
                } else {
                    $(this).children('.represent-picture')
                            .removeClass('represent-picture-over')
                            .addClass('represent-picture-unmatch');
                }
            },
                    
            drop: function(event, ui) {
                if (!canPlay) {
                    return;
                }
                
                playSound(Ucan.Resource.Audio.getClickedSound());
                
                $(this).children('.represent-picture')
                        .removeClass('represent-picture-over')
                        .addClass('represent-picture-match')
                        .children().remove();

                $(this).children('.represent-picture').append((ui.draggable.clone().css({
                    width: "38px",
                    height: "38px"
                }))).animate({
                    opacity: "0.3"
                }, 500, function() {
                    $(this).animate({
                        opacity: "1"
                    }, 500);
                });
            }
        });
    }

    var count = activityContent.group.length; //number of word groups
    var canPlay = true;
    var pictures = [];
    var canClickRedo = false;

    $('#reading-container')
            .html(Ucan.Function.HTML.editMediaUrl(activityContent.reading))
            .ucanJScrollPane('#reading-board');

    displayActivity();

    $("#loadResult").click(function() {
        if (!canPlay) {
            return;
        }
        
        canPlay = false;
        
        $('.character-picture').draggable('disable');
        playSound(Ucan.Resource.Audio.getShowResultSound());
        var numberOfTrueAnswers = 0; //reset after clicking result

        $('.sentence-holder').each(function() {
            if ($(this).children('.represent-picture').attr('pictureId') == $(this).children('.represent-picture').children('img').attr('pictureId')) {
                numberOfTrueAnswers++
                insertTrueFalseIcon(true, $(this));
            } else {
                insertTrueFalseIcon(false, $(this));
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

        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $("#pictures-container").html("");
            $("#sentences-container").html("");
            numberOfTrueAnswers = 0;
            displayActivity();
        });
    });

    $("#show-answer").click(function() {
        $('.represent-picture').each(function() {
            $(this).html('<img class="character-picture" src="' 
                    + resourceUrl + pictures[$(this).attr("pictureId")] + '" style="width: 38px; height: 38px; ">')
                    .fadeOut(500).fadeIn(500);
        });
    });
});