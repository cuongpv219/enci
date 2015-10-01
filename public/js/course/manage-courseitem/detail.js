$(document).ready(function() {
    $('#live-view-courseitem-button').live('click', function() {
        url = $(this).attr('href');
        window.open(url, '_blank');
        return false;
    });
});