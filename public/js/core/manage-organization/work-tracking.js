$(document).ready(function() {
    $('.work-tracking-detail-by-person').live('click', function() {
        url = $(this).attr('data-url');
        window.open(url, '_blank');
    });
});