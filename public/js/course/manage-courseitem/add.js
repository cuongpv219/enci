$(document).ready(function() {
    $('#courseitem_preview_button').click(function() {
        form = $('#courseitem-add-form');
		oldActionUrl = form.attr('action');
		form.attr('action', previewUrl);
		form.attr('target', '_blank');
		form.submit();
		form.attr('action', oldActionUrl);
		form.removeAttr('target');
    });
});