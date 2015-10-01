$(document).ready(function() {
    $('.library-tracking-detail-by-person').live('click', function() {
        url = $(this).attr('data-url');
        window.open(url, '_blank');
    });
});