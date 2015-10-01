function createToken(userId, activityId, type) {
//    var salt = 'ucan123456789';
    var beforeEncode = userId + salt + activityId + salt + type;
    return hex_md5(beforeEncode);
}

$(document).ready(function() {
    $('#loadResult').click(function() {
        onFinishActivity();
    });
    
    $('#redo').click(function() {
        $('#activity-result-ajax-box').show();
        $('#activity-uc-title').hide();
        $('#activity-uc-value').hide();
        $('#finished-activity-messages').hide();
    });
    
    $('#finished-activity-messages-button').click(function() {
        $('#finished-activity-messages').hide("slide", {
            direction: "left"
        }, 1000);
    });
    
});

function onFinishActivity() {
    if (activityContent.practical == '1') {
        if ((typeof score != 'undefined') && !isNaN(score) && (parseInt(score) == score) && score >= 0 && score <= 100) {
            $.post(
                scoreUrl, 
                {
                    'user_id' : userId,
                    'courseitem_id' : activityId,
                    'value' : score,
                    'token' : createToken(userId, activityId, 'course'),
                    'learning_info_id' : learningInfoId,
                    'lecture_id' : lectureId
                }).success(function(result) {
                if (typeof result.uc_got !== 'undefined') {
                    userUcText = $('#user-uc').text();
                    currentUc = Number(userUcText.substr(0, userUcText.length - 3));
                    $('#user-uc').text((currentUc + result.uc_got.data.uc) + ' UC');
                    $('#num-of-uc-got').text(currentUc + result.uc_got.data.uc);
                    $('#activity-result-ajax-box').hide();
                    $('#activity-uc-title').show();
                    $('#activity-uc-value').html(result.uc_got.data.uc).show();
                }
                currentLessonScore = Number($('#lecture-score').text());
                if (typeof currentActivityScore !== 'undefined') {
                    newLessonScore = Math.floor((currentLessonScore * Number(numOfCompletedPracticalActivities) - Number(currentActivityScore) + Number(score)) / Number(numOfCompletedPracticalActivities));
                } else {
                    newLessonScore = Math.floor((Number(currentLessonScore) * Number(numOfCompletedPracticalActivities )+ Number(score)) / (Number(numOfCompletedPracticalActivities) + 1));
                    currentProgress = Number($('#lecture-progress').text());
                    numOfCompletedActivities++;
                    numOfCompletedPracticalActivities++;
                    $('#lecture-progress').text(Math.floor((Number(numOfCompletedActivities) / Number(numOfActivities)) * 100) + '%');
                }
                $('#lecture-score').text(newLessonScore);
                currentActivityScore = score;
                if (typeof result.perfect_score !== 'undefined') {
                    $('#finished-activity-messages').show("slide", {
                        direction: "left"
                    }, 1000);
                    currentNumOfGoldMedals = Number($('#num-of-perfect_score').text());
                    $('#num-of-perfect_score').text(currentNumOfGoldMedals + 1);
                }
            });
        }
    } else {
        $.post(
            scoreUrl, 
            {
                'user_id' : userId,
                'courseitem_id' : activityId,
                'token' : createToken(userId, activityId, 'course'),
                'learning_info_id' : learningInfoId,
                'lecture_id' : lectureId
            }).success(function(result) {
            if (result == '1') {
                window.location.replace(nextActivityUrl);
            }
        });
    }
}