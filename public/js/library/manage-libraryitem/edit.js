$(document).ready(function() {
    $('#libraryitem_preview_button').click(function() {
        form = $('#libraryitem-edit-form');
		oldActionUrl = form.attr('action');
		form.attr('action', previewUrl);
		form.attr('target', '_blank');
		form.submit();
		form.attr('action', oldActionUrl);
		form.removeAttr('target');
    });
});