$(document).ready(function() {
	var type = test.type;

	$('#title').change(function() {
		if (isMissingTOEICKeywords()) {
			alertAndFocus();
		}
	});

	$('#test-item-form').submit(function(event) {
		if (isMissingTOEICKeywords()) {
			alertAndFocus();
			event.preventDefault();
		}
	});

	$('.confirm-delete').click(function(event) {
		event.preventDefault();
		var href = $(this).attr('href');
        var result = confirm('Are you sure?');
        if (result) {
            window.location = href;
        }
	});

	function alertAndFocus() {
        $(this).focus();
    }

	function isMissingTOEICKeywords() {
		if (!test.type.toLowerCase() !== 'toeic') {
			return false;
		}

		var title = $('#title').val().toLowerCase();
		if (title.indexOf('listening') === -1 && title.indexOf('reading') === -1) {
            return true;
        }

        return false;
	}
});