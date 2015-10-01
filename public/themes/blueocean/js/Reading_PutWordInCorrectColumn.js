/*
 * Author: Dinh Doan
 */

$(document).ready(function() {
    var groups = activityContent.group;
    var title = activityContent.title;
    var words = [];
    var pattern = /\[([^\]])+\]/g;
    var wordsInReading = activityContent.reading_text.match(pattern);
    var canPlay = true;
    var canClickRedo = false;

    displayActivity();

    function displayActivity() {
        words = [];
        $('#right-board-title').text(title);
        var html = activityContent.reading_text.replace(pattern, '<span class="global-correct-column-word-in-reading"></span>');
        $('#content-wrapper').append(Ucan.Function.HTML.editMediaUrl(html));
        $('#left-board .global-correct-column-word-in-reading').each(function(index) {
            var word = wordsInReading[index].replace('[', '').replace(']', '');
            $(this).append(word);
            $(this).attr('data-order', index);
        });

        if (groups[0].image) {
            $('.group-image-container').css('display', 'table-row');
        }
        if (groups[0].name) {
            $('.group-title-container').css('display', 'table-row');
        }

        for (var i = 0; i < groups.length; i++) {
            if (groups[i].image) {
                $('.group-image-container').append('<div class="column-image"><img src="' + groups[i].image + '" alt="image" title="' + groups[i].image + '"/></div>');
            }
            $('.group-title-container').append('<div class="column-title">' + groups[i].name + '</div>');
            $('.group-content-container').append('<div class="column-content"></div>');
            $('.group-key-container').append('<div class="column-key"></div>');
            words[i] = groups[i].words.split(',');
        }

        if (groups.length > 4) {
            $('.group-image-container .column-image > img').css('max-width', '90%');
        }

        createEvents();
        editGUI();
    }

    function editGUI() {
        $('#right-board .table').css({
            height: function() {
                if ($(this).attr('style')) {
                    return $(this).height();
                }
                return $(this).parents('.cell.right').height() - $('#submitDiv').height() - 36;
            }
        });

        var maxHeight = Math.max($('#left-board').height(), $('#right-board').height());
        maxHeight = maxHeight > 500 ? 500 : maxHeight;
        $('#left-board').height(maxHeight);
        $('#right-board').css('min-height', maxHeight);
        $('#right-board .table').height(maxHeight - $('#submitDiv').height() - 20);
        $('#content-wrapper').ucanJScrollPane('#left-board');
    }

    function createEvents() {
        /*
         * DRAG EVENT
         */
        $('#left-board .global-correct-column-word-in-reading').draggable({
            helper: 'clone',
            revert: 'invalid',
            appendTo: 'body'
        });

        /*
         * DROP EVENT
         */
        $('.column-content').droppable({
            accept: '#left-board .global-correct-column-word-in-reading, .dropped',
            over: function(event, ui) {
                if ($('.ui-draggable-dragging', this).size() < 1) {
                    $(this).addClass('over');
                }
            },
            out: function(event, ui) {
                $(this).removeClass('over');
            },
            drop: function(event, ui) {
                $(this).removeClass('over');
                if (ui.draggable.parent().hasClass('column-content')) {   // kéo từ cột đã có dữ liệu
                    var same = false;
                    $(this).children('.dropped').each(function() {
                        if ($.trim($(this).text()) == $.trim(ui.draggable.text())) {
                            same = true;
                        }
                    });
                    if (!same) {    // nếu tự kéo rồi thả vào chính nó thì ko làm j cả
                        playSound(Ucan.Resource.Audio.getClickedSound())
                        $(this).append(ui.draggable);
                    }
                } else {    // kéo từ đoạn văn vào
                    playSound(Ucan.Resource.Audio.getClickedSound())
                    ui.draggable.addClass('done').draggable("option", "disabled", true);
                    var sameGroup = ui.draggable.attr('data-same-group'); // nếu trùng từ thì xem nó là nhóm nào
                    if (sameGroup) {
                        $(this).append('<div class="dropped" data-order="' + ui.draggable.attr('data-order')
                                + '" data-same-group="' + sameGroup + '">' + ui.draggable.text() + '</div>');
                    } else {
                        $(this).append('<div class="dropped" data-order="' + ui.draggable.attr('data-order') + '">' + ui.draggable.text() + '</div>');
                    }
                    $(this).children('.dropped').draggable({
                        helper: 'clone',
                        revert: 'invalid'
                    });
                }
            }
        });

        $('#left-board').droppable({
            accept: '.dropped',
            drop: function(event, ui) {
                $(this).find('.done').each(function() {
                    if ($.trim($(this).text()) == $.trim(ui.draggable.text())) {
                        playSound(Ucan.Resource.Audio.getClickedSound())
                        $(this).removeClass('done')
                                .addClass('global-correct-column-word-in-reading')
                                .draggable("option", "disabled", false);
                        ui.draggable.remove();
                        return false;
                    }
                    return true;
                });
            }
        });

        $('#loadResult').click(function() {
            if (!canPlay) {
                return;
            }
            canPlay = false;
            playSound(Ucan.Resource.Audio.getShowResultSound());
            var numberOfTrueAnswers = 0;
            $('#right-board .column-content').each(function(i) {
                $(this).children('.dropped').each(function() {
                    var correct = false;
                    var sameGroup = $(this).attr('data-same-group'); // nếu trùng từ thì xem nó là nhóm nào
                    var userAns = $.trim($(this).text()).toLowerCase();
                    if (sameGroup) {
                        userAns += '#' + sameGroup;
                    }
                    for (var j = 0; j < words[i].length; j++) {
                        if (compareTwoString($(this).text(), words[i][j])) {
                            correct = true;
                            break;
                        }
                    }

                    if (correct) {
                        numberOfTrueAnswers++;
                        insertTrueFalseIcon(true, this);
                    } else {
                        insertTrueFalseIcon(false, this);
                    }
                });
            });
            $('.column-content .true-icon, .column-content .false-icon').ucanAnimateTrueFalseIcon();
            $('#left-board .global-correct-column-word-in-reading').draggable('disable');
            $('#right-board .dropped').draggable('disable');

            $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + wordsInReading.length);
            score = Math.floor((numberOfTrueAnswers / wordsInReading.length) * 100);
            $("#score-text").text(score);
            $('#show-result').show('slide', {
                direction: "left"
            }, Ucan.Constants.getShowResultSpeed());
            canClickRedo = true;
        });

        var clickedShowAns = false;
        $('#show-answer').click(function() {
            if (clickedShowAns) {
                return;
            }
            clickedShowAns = true;
            $('#right-board .column-key').each(function(i) {
                for (var j = 0; j < words[i].length; j++) {
                    $(this).append('<div class="key">' + words[i][j] + '</div>');
                }
            });
            $('.group-key-container').css('display', 'table-row');
            $('.column-key .key').fadeOut(500).fadeIn(500);
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
                $("#show-result").slideUp(1000);
                $('#content-wrapper').html('');
                $('.group-title-container').html('');
                $('.group-content-container').html('');
                $('.group-key-container').html('').hide();
                clickedShowAns = false;
                removeEvents();
                displayActivity();
            });
        });
    }

    function removeEvents() {
        $('#show-answer, #loadResult, #redo').unbind('click');
    }
});