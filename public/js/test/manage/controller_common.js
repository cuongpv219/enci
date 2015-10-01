$(document).ready(function() {
	$('.confirm-delete').click(function(event) {
		event.preventDefault();
		var href = $(this).attr('href');
        var result = confirm('Are you sure?');
        if (result) {
            window.location = href;
        }
	});
});