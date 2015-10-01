$(document).ready(function() {    
    $('.class-working-item-selected-delete').live('click', function() {
        var acceptDeletion = confirm("Bạn có đồng ý loại bỏ bài tập này ra khỏi danh sách?");
        if (acceptDeletion) {
            $(this).parent().remove();
            values = '';
            $('.class-working-item-selected').each(function() {
                values += $(this).attr('data-value') + '###';
            });
            $('#source_content').val(values);
        }
    });
    
    function buildActivityList() {
        var values = $('#source_content').val();
        if (typeof(values) !== 'undefined') {
            insertContent = '';
            activitySources = values.split('###');
            for (var i = 0; i < activitySources.length; i++) {
                value = activitySources[i];
                if (value != '') {
                    elements = value.split('|||');
                    if (elements[1] == 'courseitem') {
                        insertContent += '<div data-value="' + value + '" class="class-working-item-selected"><div class="class-working-item-selected-delete" title="Loại bài tập này"></div><div class="class-working-item-selected-link"><a target="_blank" href="/shark/public/course/study/try/id/' + elements[0] + '">' + elements[2] + ' (khóa học)</a></div></div>';
                    } else {
                        insertContent += '<div data-value="' + value + '" class="class-working-item-selected"><div class="class-working-item-selected-delete" title="Loại bài tập này"></div><div class="class-working-item-selected-link"><a target="_blank" href="/shark/public/library/study/try/id/' + elements[0] + '">' + elements[2] + ' (bài học)</a></div></div>';
                    }
                }
            }
            $(insertContent).insertAfter($('#source_content_input_helper'));
        }
    }
    
    buildActivityList();
});