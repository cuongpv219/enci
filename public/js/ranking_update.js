$(document).ready(function() {
    function update_ranking() {
        $.get(
            updateRankingUrl).success(function(result) {
            if ($.trim(result) != '' && result != 'error') {
                $('#ranking-update-wrapper').html(result);
                xPos = $('.user-avatar').offset().left + ($('#user-avatar').width() / 2) - $('#ranking-update-wrapper').width() / 2 + 6;
                $('#ranking-update-wrapper').css({
                    'left': xPos
                });
                $('#ranking-update-wrapper').fadeIn(1000);
                setTimeout(closeUpdateRankingMessage, 5000);
            }
        });
    }

    function closeUpdateRankingMessage() {
        $('#ranking-update-wrapper').fadeOut(1000);
    }
    setInterval(update_ranking, 30000);
});