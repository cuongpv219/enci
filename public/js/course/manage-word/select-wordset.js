$(document).ready(function() {
    $('#select-wordset-button').click(function() {
        wordsetId = $('input[name=wordset-select]:checked', '#wordset-list-wrapper').val();
        outputObject = window.opener.$('#' + window.opener.callerObject.attr('data-outputsource'));
        outputObject.val(wordsetId);
        window.close();
    });
});

