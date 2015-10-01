$(document).ready(function() {
    
    $('body').prepend('<div class="loading-progress">processing</div>');
    $('#add_word_image_input_helper').appendTo($('#add_word_image').parent());
    $('#add_word_audio_input_helper').appendTo($('#add_word_audio').parent());
    $('#add_word_audio_select_input_helper').appendTo($('#add_word_audio').parent());
    $('#add_word_video_input_helper').appendTo($('#add_word_video').parent());
    
    $('body').append('<div id="transparent-background"></div>');
    
    /**
     * Chèn thêm một từ mới
     */
    $('#add_word_form').live('submit', function() {
        $('.add-word-form-error').remove();
        data = $(this).serialize();
        $('.loading-progress').slideDown(500);
        $.post($(this).attr('action'), data)
        .success(function(result) {
            $('.loading-progress').slideUp(500);
            if (result['content-type'] == 'error') {
                errors = $.parseJSON(result['data']);
                displayWordAddFormErrors(errors);
            } else {
                word = result['data'];
                detailWordUrl = result['detail-word-url'];
                editWordUrl = result['edit-word-url'];
                deleteWordUrl = result['delete-word-url'];
                addNewWord(word, detailWordUrl, editWordUrl, deleteWordUrl);
            }
        });
        
        /**
         * Hiển thị lỗi form
         */
        function displayWordAddFormErrors(errors) {
            for (element in errors) {
                errMessages = '';
                for (errType in errors[element]) {
                    errMessages += '<li>' + errors[element][errType] + '</li>';
                }
                $('#' + element).parent().append(
                    '<ul class="add-word-form-error">' +
                    errMessages +
                    '</li>');
                
            }
        }
        
        function addNewWord(word, detailWordUrl, editWordUrl, deleteWordUrl) {
            $('#add_word_form :input').each(function() {
                if ($(this).attr('type') != 'submit' && 
                    $(this).attr('type') != 'button' && 
                    $(this).attr('type') != 'hidden') {
                    $(this).val('');
                }
            });
            
            $('#word-list').prepend(
                '<div class="word-item" data-id="' + word.id + '">' +
                '<span class="word-item-title word-item-cell">' + word.title + '</span>' +
                '<span class="word-item-meaning word-item-cell">' + word.meaning + '</span>' +
                '<span class="word-item-detail word-item-cell" data-url="' + detailWordUrl + '">' + detailMessage + '</span>' +
                '<span class="word-item-edit word-item-cell" data-url="' + editWordUrl + '">' + editMessage + '</span>' +
                '<span class="word-item-delete word-item-cell" data-url="' + deleteWordUrl + '">' + deleteMessage + '</span>' +
                '</div>');
            $('#number-of-words').html($('.word-item').length);
            $(".word-item").first().next().attr('style', null);
            $('.word-item').attr('style', null);
            $(".word-item").first().css('background', '#F2F2F2');
        }
        
        return false;
    });
    
    $('#add_word_form').keypress(function(e) {
        if ( e.which == 13) {
            var caller = e.target || e.srcElement;
            if (caller.type == 'text') {
                return false;
            }
        }
        return true;
    });
    
    
    $('#edit_word_form').live('keypress', function(e) {
        if ( e.which == 13) {
            var caller = e.target || e.srcElement;
            if (caller.type == 'text') {
                return false;
            }
        }
        return true;
    });
        
    $('.input_helper').live('click', function() {
        return false;
    });
    
    $('.word-item-detail').live('click', function() {
        dataUrl = $(this).attr('data-url');
        moveAjaxLoader($(this).parent());
        $.get(dataUrl, function(word) {
            hideAjaxLoader();
            $('#transparent-background').show();
            html = '<div class="word-detail-title">' + word.title + '</div>';
            html += '<ul>';
            html += '<li><span class="word-detail-field">Meaning:</span>' + word.meaning + '</li>';
            html += '<li><span class="word-detail-field">Native:</span>' + word.native_meaning + '</li>';
            html += '<li><span class="word-detail-field">IPA Phonetic:</span>' + word.ipa_phonetic + '</li>';
            html += '<li><span class="word-detail-field">Sample:</span>' + word.sample + '</li>';
            html += '<li><span class="word-detail-field">Image:</span><img class="word-detail-img" src="' + word.image + '" alt="' + word.title +'" /></li>';
            html += '<li><span class="word-detail-field">Audio:</span><audio controls="controls"><source src="' 
                    + word.audio + '" />Your browse does not support the audio tag</audio></li>';
            html += '<li><span class="word-detail-field">Video:</span>' + word.video + '</li>';
            html += '<li><span class="word-detail-field">Extra:</span>' + word.extra + '</li>';
            html += '</ul>';
            $('#word-detail-info').html(html);
            $('#word-detail').fadeIn(500);
        });
        
    });

    $('.word-item-edit').live('click', function() {
        dataUrl = $(this).attr('data-url');
        moveAjaxLoader($(this).parent());
        title = $(this).parent().children(':first').html();
        $.get(dataUrl, function(text) {
            hideAjaxLoader();
            $('#word-edit-detail-title').html(title);
            $('#word-edit-form-wrapper').html(text);
            $('#edit_word_image_input_helper').appendTo($('#edit_word_image').parent());
            $('#edit_word_audio_input_helper').appendTo($('#edit_word_audio').parent());
            $('#edit_word_audio_select_input_helper').appendTo($('#edit_word_audio').parent());
            $('#edit_word_video_input_helper').appendTo($('#edit_word_video').parent());
            $('#word-detail').hide();
            $('#transparent-background').show();
            $('#word-edit').fadeIn(200);
        });
        
    });

    $('.word-item-delete').live('click', function() {
        dataUrl = $(this).attr('data-url');
        title = $(this).parent().children(':first').html();
        $('#word-delete-detail-title').html(title);
        id = $(this).parent().attr('data-id');
        $('#word-delete').attr('data-id', id);
        $('#word-delete').attr('data-url', dataUrl);
        $('#transparent-background').show();
        $('#word-delete').fadeIn(500);
    });
    
    $('#delete-word-accept-button').live('click', function() {
        dataUrl = $('#word-delete').attr('data-url');
        id = $('#word-delete').attr('data-id');
        $.get(dataUrl, function(text) {
            if (text == '1') {
                $('#transparent-background').hide();
                $('#word-delete').fadeOut(500);
                $(this).parent().remove();
                $('.word-item[data-id="' + id + '"]').remove();
                $('#number-of-words').html($('.word-item').length);
            }
        });
    });
    
    $('#delete-word-deny-button').live('click', function() {
        $('#transparent-background').hide();
        $('#word-delete').fadeOut(500);
    });
    
    $('#word-detail-close-button').click(function() {
        $('#word-detail').fadeOut(500);
        $('#transparent-background').hide();
    });
    
    $('#word-edit-close-button').click(function() {
        $('#word-edit').fadeOut(500, function() {
            $('#transparent-background').hide();
        });
    });
    
    $('#word-delete-close-button').click(function() {
        $('#word-delete').fadeOut(500, function() {
            $('#transparent-background').hide();
        });
    });
    
    
    $('#edit_word_submit_button').live('click', function() {
        $('.edit-word-form-error').remove();
        data = $('#edit_word_form').serialize();
        $('.loading-progress').slideDown(500);
        $.post($('#edit_word_form').attr('action'), data)
        .success(function(result) {
            $('.loading-progress').slideUp(500);
            console.log(result);
            if (result['content-type'] == 'error') {
                errors = $.parseJSON(result['data']);
                displayEditFormErrors(errors);
            } else {
                word = result['data'];
                editWord(word);
            }
        });
        
        /**
         * Hiển thị lỗi form
         */
        function displayEditFormErrors(errors) {
            for (element in errors) {
                errMessages = '';
                for (errType in errors[element]) {
                    errMessages += '<li>' + errors[element][errType] + '</li>';
                }
                $('#' + element).parent().append(
                    '<ul class="edit-word-form-error">' +
                    errMessages +
                    '</li>');
            }
        }
        
        function editWord(word) {
            $('#edit_word_form :input').each(function() {
                if ($(this).attr('type') != 'submit' && 
                    $(this).attr('type') != 'button' && 
                    $(this).attr('type') != 'hidden') {
                    $(this).val('');
                }
            });
            $('.word-item[data-id="' + word.id + '"]').children('.word-item-title').html(word.title);
            $('.word-item[data-id="' + word.id + '"]').children('.word-item-meaning').html(word.meaning);
            $('.word-item').attr('style', null);
            $('.word-item[data-id="' + word.id + '"]').css('background', '#F2F2F2').focus();
            $('#word-edit').hide();
            $('#transparent-background').hide();
        }        
        return false;
    });
    
});