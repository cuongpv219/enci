$(document).ready(function() {
    $('.course-item').click(function() {
        url = $(this).attr('data-url');
        window.location = url;
    });
});