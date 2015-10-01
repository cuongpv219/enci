$(document).ready(function() {
    $('.lecture, .series-item-info').click(function() {
        url = $(this).attr('data-url');
        window.location = url;
    });
});