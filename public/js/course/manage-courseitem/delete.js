$(document).ready(function() {
    $('#refuse-delete-button').click(function() {
        window.location = $(this).attr('data-url');
    });
});