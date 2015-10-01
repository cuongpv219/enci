$(document).ready(function() {
    var characterList;
    var i;
    var callerObject = $(window.opener.callerObject);
    var editorForm = callerObject.parents('.editor-form-element-group:first');
    var outputObject = editorForm.find('#' + callerObject.attr('data-outputsource'));

    setWindowDisplay();
    initData();
    displayContent();
    createEvents();

    function displayContent() {
        var order = parseInt(editorForm.children('.editor-form-element-group-numbering').text()) - 1;
        var clause = editorForm.find('#group___sentence___' + order).val();
        $('#clause').text(clause);
        if (characterList.length === 0) {
            $('#message').text('You have not create any character').show();
            return;
        }
        for (i = 0; i < characterList.length; i++) {
            $('#character-list').append('<li class="character">'
                    + '<img src="' + characterList[i].image + '" alt="Image" />'
                    + '<input data-value="' + characterList[i].name + '" id="character-name-' + characterList[i].name + '" type="checkbox"/>'
                    + '<label for="character-name-' + characterList[i].name + '">' + characterList[i].name + '</label>'
                    + '</li>');
        }
        var choosedCharacters = $('#group___character___' + order, editorForm).val().split('/');
        for (i = 0; i < choosedCharacters.length; i++) {
            $('#character-list input[data-value="' + $.trim(choosedCharacters[i]) + '"]').attr('checked', true);
        }
    }

    function createEvents() {
        $('#btn-accept').click(function() {
            exportResult();
        });

        $('#btn-cancel').click(function() {
            window.close();
        });

        $('#character-list li').click(function() {
            var textbox = $(this).children('input');
            switchTextboxStatus(textbox);
            console.log('xx');
        });
        
        $('#character-list li input').click(function() {
            switchTextboxStatus($(this));
        });
        
        $('#character-list li label').click(function() {
            switchTextboxStatus($(this).siblings('input'));
        });
        
        function switchTextboxStatus(textbox) {
            if ($(textbox).is(':checked')) {
                $(textbox).prop('checked', false);
            } else {
                $(textbox).prop('checked', true);
            }
        }
    }

    function exportResult() {
        var result = '';
        $('input[type="checkbox"]:checked').each(function() {
            result += $(this).attr('data-value') + '/';
        });
        result = result.replace(/\/\s*$/, '');
        outputObject.val(result);
        window.close();
    }

    function initData() {
        characterList = getCharacterList();
    }

    function setWindowDisplay() {
        window.resizeTo(400, 400);
        var x = callerObject.position().left + $(window.opener.callerObject).width() + 50;
        var y = callerObject.position().top;
        window.moveTo(x, y);
    }

    function getCharacterList() {
        var characters = [];
        callerObject.parents('#tab-content-group').prev('#tab-content-character_list').find('.editor-form-element-group').each(function(index) {
            var order = $(this).attr('id').split('___')[1];
            characters.push(new Character(index, $(this).find('#character_list___character___' + order).val(), $(this).find('#character_list___image___' + order).val()));
        });
        return characters;
    }

    function Character(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }
});