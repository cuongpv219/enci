$('#article img').each(function() {
    if ($(this).width() >= $('#article').width()) {
        $(this).css('height', 'auto');
    }
});
