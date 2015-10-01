$(document).ready(function() {
    $('.course-item-info').click(function() {
        url = $(this).attr('data-url');
        if (url) {
            window.location = url;
        }
    });
});