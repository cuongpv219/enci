$(document).ready(function() {
    $('#user-writes-review-button').click(function() {
        $('#add-review-form-placeholder').slideDown(500);
        return false;
    });
    
    $('#add-review-form-placeholder-close').click(function() {
        $('#add-review-form-placeholder').slideUp(200);
        return false;
    });
    
    $('#finished-activity-message-close-icon').click(function() {
        $('#finished-activity-messages').hide("slide", {
            direction: "left"
        }, 1000);
    });
    
    
        /**
     * Chèn thêm một từ mới
     */
    $('#add-review-form').live('submit', function() {
        $('#write-course-review-box-loader').show();
        $('.add-review-form-error').remove();
        data = $(this).serialize();
        $.post($(this).attr('action'), data)
        .success(function(result) {
            $('#write-course-review-box-loader').hide();
            $('.loading-progress').slideUp(500);
            if (result['content-type'] === 'error') {
                errors = $.parseJSON(result['data']);
                displayAddReviewFormError(errors);
            } else {
                $('#add-review-form').remove();
                $('#add-review-form-placeholder-title').remove();
                $('#write-course-review-box').remove();
                $('#add-review-form-placeholder').append(reviewCompletedMessage);
            }
        });
        
        /**
         * Hiển thị lỗi form
         */
        function displayAddReviewFormError(errors) {
            for (element in errors) {
                errMessages = '';
                for (errType in errors[element]) {
                    errMessages += '<li>' + errors[element][errType] + '</li>';
                }
                $('#' + element).parent().append(
                    '<ul class="add-review-form-error">' +
                    errMessages +
                    '</li>');
            }
        }
        return false;
    });
    
    
});