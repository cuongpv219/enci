$(document).ready(function() {
    var score = null;
    function showBeforeDoing() {
        $('#activity-exmple-container').show();
    }
    
    function hideBeforeDoing() {
        $('#activity-exmple-container').hide();
    }
    
    function showActivityContent() {
        $('#activity-practice-container').show();
    }
    
    function hideActivityContent() {
        $('#activity-practice-container').hide();
    }
    
    var example = activityContent.example;
    if ((example != null && $.trim(example) != '')) {
//        $('#activity-practice-container').hide();
    } else {
        $('#activity-exmple-container').remove();
    }
    
    $('#activity-go-to-practice').click(function() {
        $('#activity-practice-nav').addClass('circle-active');
        $('#activity-example-nav').removeClass('circle-active');
        $('#activity-both-nav').removeClass('circle-active');
        showActivityContent();
        hideBeforeDoing();
    });
    
    $('#activity-practice-nav').click(function() {
        $(this).addClass('circle-active');
        $('#activity-example-nav').removeClass('circle-active');
        $('#activity-both-nav').removeClass('circle-active');
        showActivityContent();
        hideBeforeDoing();
    });
    
    $('#activity-example-nav').click(function() {
        $(this).addClass('circle-active');
        $('#activity-practice-nav').removeClass('circle-active');
        $('#activity-both-nav').removeClass('circle-active');
        showBeforeDoing();
        hideActivityContent();
    })
    
    $('#activity-both-nav').click(function() {
        $(this).addClass('circle-active');
        $('#activity-example-nav').removeClass('circle-active');
        $('#activity-practice-nav').removeClass('circle-active');
        showBeforeDoing();
        showActivityContent();
    });
    
    $('#next-activity').click(function() {
        if (nextActivityUrl != 'undefined') {
            window.location.replace(nextActivityUrl);
        }
    });
});