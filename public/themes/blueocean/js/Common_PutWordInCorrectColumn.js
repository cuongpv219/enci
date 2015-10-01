/*
 * Author: Dinh Doan 
 */

$(document).ready(function() {
    var ENCRYPT_KEY = 7; 
    var i, j; // counter
    var canSubmit = true;
    var redo = false;
    var canClickRedo = false;
    var wordGroups = createWordGroups();
    
    displayActivity();

    function WordGroup(id, title, imageUrl, wordList) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.wordList = wordList;
    }
    
    function Word(id, groupID, content) {
        this.id = id;
        this.groupID = groupID + ENCRYPT_KEY;
        this.content = content;
    }

    function displayActivity() {
        displayWordList();
        displayGroupTable();
        createEvents();
    }
    
    function createWordGroups() {
        var data = [];
        var wordID = 0;
        for (i = 0; i < activityContent.group.length; i++) {
            var iter = activityContent.group[i];
            var wordList = [];
            var wordSplitted = $.trim(iter.words).split(',');
            for (j = 0; j < wordSplitted.length; j++) {
                wordList.push(new Word(wordID++, iter.category_title, wordSplitted[j]));
            }
            data.push(new WordGroup(i, iter.category_title, iter.image, wordList));
        }
        return data;
    }
    
    function displayWordList() {
        var shuffleArray = [];
        for (i = 0; i < wordGroups.length; i++) {
            for (j = 0; j < wordGroups[i].wordList.length; j++) {
                var content = wordGroups[i].wordList[j].content;
                shuffleArray.push(content);
            }
        }
        shuffle(shuffleArray);
        for (i = 0; i < shuffleArray.length; i++) {
            $('#word-list').append('<div class="word global-correct-column-word-in-list"><span>' + shuffleArray[i] + '</span><div class="icon-true-false"></div></div>');
        }
    }
    
    function displayGroupTable() {
        if (redo) {
            return;
        }
        
        for (i = 0; i < wordGroups.length; i++) {
            $('#group-titles').append('<div class="cell global-blue-bar">' + (wordGroups[i].title ? wordGroups[i].title : '') + '</div>');
            $('#group-content-table').append('<div class="cell global-border-color-gray-3" data-group-id="' + wordGroups[i].id + '"></div>');
            $('#key-table').append('<div class="cell global-border-color-gray-3"></div>');
            
            if (wordGroups[i].imageUrl) {
                $('#group-content-table .cell').eq(i).append('<img src="' + resourceUrl + wordGroups[i].imageUrl + '" alt="Group image" />');
            }
        }
        
        if (activityContent.listening_audio) {
            $('#group-titles').prepend('<div class="cell empty global-blue-bar"></div>');
            $('#group-content-table').prepend('<div class="cell audio global-border-color-gray-3"></div>');
            $('#group-content-table .cell.audio').append($('#listening-audio'));
            $('#key-table').prepend('<div class="cell empty global-border-color-gray-3"></div>');
        }
        
        if (wordGroups.length > 4) {
            $('#group-content-table .cell > img').css('max-width', '90%');
        }
    }
    
    function createEvents() {
        /*
         * DRAGGABLE
         */
        $("#group-content-table .word, #word-list .word").draggable({
            helper: 'clone',
            revert: 'invalid',
            stack: '.text',
            refreshPositions: true
        });
        
        /*
         * DROPPABLE CELL
         */
        $('#group-content-table > .cell').not('.audio').droppable({
            accept: '.word',
            over: function() {
                $(this).addClass('over');
            },
            out: function() {
                $(this).removeClass('over');
            },
            drop: function (event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).append((ui.draggable));
                $(this).removeClass('over');
            }
        });
        
        /*
         * DROPPABLE WORDLIST
         */
        $("#word-list").droppable({
            drop: function (event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).append(ui.draggable);
                $(this).removeClass('over');
            },
            over: function() {
                $(this).addClass('over');
            },
            out: function() {
                $(this).removeClass('over');
            }
        });
        
        /*
         * SUBMIT
         */
        $('#loadResult').click(function() {
            if (!canSubmit) {
                return;
            }
            canSubmit = false;
            $('.word').draggable('disable');
            playSound(Ucan.Resource.Audio.getShowResultSound());
            
            var numberOfCorrect = 0;
            $("#group-content-table .word").each(function() {
                if ($(this).parent().attr('data-group-id') == getGroupID($(this).text())) {
                    numberOfCorrect++;
                    insertTrueFalseIconAfter(true, $(this).children('span'));
                } else {
                    insertTrueFalseIconAfter(false, $(this).children('span'));
                }
            });
            $('.word .true-icon, .word .false-icon').ucanAnimateTrueFalseIcon();
            
            if (numberOfCorrect < 10) {
                $("#num-of-correct-answers-result").html('0' + numberOfCorrect);
            } else {
                $("#num-of-correct-answers-result").html(numberOfCorrect);
            }
            
            var wordCount= 0;
            for (i = 0; i < wordGroups.length; i++) {
                wordCount += wordGroups[i].wordList.length;
            }
            score = Math.floor((numberOfCorrect / wordCount) * 100);
            $("#num-of-correct-answers-result").text(numberOfCorrect + '/' + wordCount);
            $("#score-text").text(score);
            $('#show-result').show('slide', {
                direction: "left"
            }, Ucan.Constants.getShowResultSpeed());
            canClickRedo = true;
        });
        
        /*
         * SHOW ANSWERS
         */
        $("#show-answer").click(function() {
            if ($('#key-table .cell').children().size() > 0) {
                return;
            }
            $('#key-table .cell').not('.empty').each(function(index) {
                for (i = 0; i < wordGroups[index].wordList.length; i++) {
                    var word = wordGroups[index].wordList[i];
                    $(this).append('<div class="key">' + word.content + '</div>');
                }
            });
            
            $('#key-table').show().children('.cell').css('display', 'table-cell').stop(true, true).fadeOut(500).fadeIn(500);
        });
        
        /*
         * REDO
         */
        $("#redo").click(function() {
            if (!canClickRedo) {
                return;
            }
            canClickRedo = false;
            
            $("#show-result").hide('slide', {
                direction: 'left'
            }, Ucan.Constants.getHideResultSpeed(), function() {
                canSubmit = true;
                redo = true;
            
                $('#group-content-table .cell').not('.audio').each(function() {
                    if ($(this).children('img').size() > 0) {
                        $('#group-content-table .cell > img').siblings().remove();
                    } else {
                        $(this).html('');
                    }
                });
                $('#word-list').html('');
                $('#key-table').hide().children('.cell').html('');
                displayActivity();
            });
        });
    }

    function getGroupID(wordContent) {
        for (i = 0; i < wordGroups.length; i++) {
            for (j = 0; j < wordGroups[i].wordList.length; j++) {
                if (compareTwoString(htmlEncode(wordGroups[i].wordList[j].content), wordContent)) {
                    return wordGroups[i].id;
                }
            }
        }
        return null;
    }
});