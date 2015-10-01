$(document).ready(function() {
    $('.select-activity-button').click(function() {
        values = '';
        insertContent = '';
        var activitySources = $(window.opener.$('#source_content')).val().split('###');
        var numOfActivitiesSelected = activitySources.length;
        var overWorkingFlag = false;
        $('#lecture-detail input[type=checkbox]').each(function() {
            if ($(this).is(':checked')) {
                if (numOfActivitiesSelected < 16) {
                    value = $(this).attr('value');
                    values += value + '###';
                    elements = value.split('|||');
                    insertContent += '<div data-value="' + value + '" class="class-working-item-selected"><div class="class-working-item-selected-delete" title="Loại bài tập này"></div><div class="class-working-item-selected-link"><a target="_blank" href="/shark/public/course/study/try/id/' + elements[0] + '">' + elements[2] + ' (khóa học)</a></div></div>';
                } else {
                    overWorkingFlag = true;
                }
                numOfActivitiesSelected++;
            }
        });
        outputObject = window.opener.$('#' + window.opener.callerObject.attr('data-outputsource'));
        outputObject.val(outputObject.val() + values);
        if (window.opener.$('.class-working-item-selected').length === 0) {
            $(insertContent).insertAfter(window.opener.$('#source_content_input_helper'));
        } else {
            $(insertContent).insertAfter(window.opener.$('.class-working-item-selected').last());
        }
        
        if (overWorkingFlag === true) {
            window.opener.alert('Chỉ được phép giao tối đa 15 bài tập!');
        }
        window.close();
    })
});