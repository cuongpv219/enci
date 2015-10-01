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
        if ((typeof score != 'undefined') && !isNaN(score) && (parseInt(score) == score) && score >= 0) {
            $.post(
                scoreUrl, 
                {
                    'user_id' : userId,
                    'value' : score,
                    'token' : Math.random(1000000)
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
                'token' : Math.random(1000000)
            }).success(function(result) {
            if (result == '1') {
                window.location.replace(nextActivityUrl);
            }
        });
    }
}