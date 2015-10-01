$(document).ready(function() {
    $('body').prepend('<div class="loading-progress">processing</div>');
    $('body').append('<div id="transparent-background"></div>');
    
    $('.wordset-item-edit').live('click', function() {
        moveAjaxLoader($(this).parent());
        title = $(this).parent().children(':nth-child(2)').text();
        $.get($(this).attr('data-url'), function(form) {
            $('#wordset-edit-detail-title').text(title);
            $('#wordset-edit-form-wrapper').html(form);
            hideAjaxLoader();
            $('#wordset-edit').fadeIn(500);
            $('#transparent-background').show();
        });
    });
    
    $('#edit_wordset_form').live('submit', function() {
        $('.form-error').remove();
        data = $('#edit_wordset_form').serialize();
        $('.loading-progress').slideDown(500);
        console.log(data);
        $.post($('#edit_wordset_form').attr('action'), data)
        .success(function(result) {
            $('.loading-progress').slideUp(500);
            console.log(result);
            if (result['content-type'] == 'error') {
                errors = $.parseJSON(result['data']);
                displayFormErrors(errors);
            } else {
                wordset = result['data'];
                console.log(wordset);
                $('#edit_wordset_form :input').each(function() {
                    if ($(this).attr('type') != 'submit' && 
                        $(this).attr('type') != 'button' && 
                        $(this).attr('type') != 'hidden') {
                        $(this).val('');
                    }
                });
                $('.wordset-item[data-id="' + wordset.id + '"]').children('.wordset-item-title').html(wordset.title);
                $('.wordset-item[data-id="' + wordset.id + '"]').children('.wordset-item-description').html(wordset.description);
                $('.wordset-item').attr('style', null);
                $('.wordset-item[data-id="' + wordset.id + '"]').css('background', '#F2F2F2').focus();
                $('#wordset-edit').hide();
                $('#transparent-background').hide();
            }
        });
        
        return false;
    });
});

