/*
 * Author: Dinh Doan
 */
$(document).ready(function() {

    var count = activityContent.group.length;
    var canPlay = true;	
    var canClickRedo = false;
    var characters = getCharacters();
    var clauses = getClauses();
    var i, j;
    
    displayActivity();
    createEvents();

    function displayActivity() {
        var characterNames = '';
        var characterImages = '';
        for (i = 0; i < characters.length; i++) {
            characterNames += '<div class="cell character">' + characters[i].name + '</div>';
            characterImages += '<div class="cell character"><img src="' + resourceUrl + characters[i].image + '" alt="" /></div>';
        }
        $('#character-list .cell:first').after(characterNames);
        $('#table-content .cell:first').after(characterImages);
        
        for (i = 0; i < clauses.length; i++) {
            var row = '';
            row += '<div class="row">'
            + '<div class="cell clause" data-id="' + clauses[i].id + '">' + clauses[i].title + '</div>';
            
            for (j = 0; j < characters.length; j++) {
                row += '<div class="cell"><div class="global-choice-square-green-1" data-character="' + characters[j].name + '"></div></div>'
            }
            row += '<div class="cell true-false-icon"></div></div>';
            $('#table-content').append(row);
        }
    }
    
    function getClauses() {
        var data = [];
        for (i = 0; i < count; i++) {
            var characters = [];
            var splitted = activityContent.group[i].character.split('/');
            for (j = 0; j < splitted.length; j++) {
                characters.push($.trim(splitted[j]));
            }
            data.push(new Clause(i, activityContent.group[i].sentence, characters));
        }
        return data;
    }
    
    function getCharacters() {
        var list = activityContent.character_list;
        var data = [];
        for (i = 0; i < list.length; i++) {
            data.push(new Character(i, $.trim(list[i].character), list[i].image));
        }
        return data;
    }
    
    function Character(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }
    
    function Clause(id, title, characterList) {
        this.id = id;
        this.title = title;
        this.characterList = characterList;
    }
    
    function checkResult(clauseId, choosedCharacters) {
        var foundClause = getClauseById(clauseId);
        if (choosedCharacters.length != foundClause.characterList.length) {
            return false;
        }
        
        for (j = 0; j < choosedCharacters.length; j++) {
            if (foundClause.characterList.indexOf(choosedCharacters[j]) == -1) {
                return false;
            }
        }
        return true;
    }
    
    function createEvents() {
        $('#table-content .global-choice-square-green-1').click(function() {
            if ($(this).hasClass('checked')) {
                $(this).removeClass('checked');
            } else if (canPlay) {
                $(this).addClass('checked');
            }
        });
        
        $("#loadResult").click(function(){
            if (!canPlay) {
                return;
            }
            canPlay = false;
            playSound(Ucan.Resource.Audio.getShowResultSound());
            
            var numberOfTrueAnswers = 0;
            $('#table-content .clause').each(function() {
                var clauseId = $(this).attr('data-id');
                var choosedCharacters = [];
                var row = $(this).parents('.row:first');
                row.find('.global-choice-square-green-1.checked').each(function() {
                    choosedCharacters.push($(this).attr('data-character'));
                });
                
                if (checkResult(clauseId, choosedCharacters)) {
                    numberOfTrueAnswers++;
                    insertTrueFalseIcon(true, $(this).siblings('.cell.true-false-icon'));
                } else {
                    insertTrueFalseIcon(false, $(this).siblings('.cell.true-false-icon'));
                }
            });
        
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
                $('.cell.true-false-icon').html('');
                $('#table-content .global-choice-square-green-1').removeClass('checked');
            });
        });
    
        $("#show-answer").click(function() {
            $('#table-content .clause').each(function() {
                var clauseId = $(this).attr('data-id');
                var foundClause = getClauseById(clauseId);
                if (foundClause) {
                    $(this).siblings('.cell').children('.global-choice-square-green-1').each(function() {
                        $(this).removeClass('checked');
                        for (j = 0; j < clauses[i].characterList.length; j++) {
                            if (clauses[i].characterList.indexOf($(this).attr('data-character')) != -1) {
                                $(this).addClass('checked');
                            }
                        }
                    });
                }
            });
            $('.global-choice-square-green-1.checked').ucanAnimateAnswers();
        });
    }
    
    function getClauseById(id) {
        for (i = 0; i < clauses.length; i++) {
            if (clauses[i].id == id) {
                return clauses[i];
            }
        }
        return null;
    }
});