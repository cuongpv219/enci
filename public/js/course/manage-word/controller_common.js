
function moveAjaxLoader(object) {
    var pos = object.position();
    var width = object.outerWidth();
        
    $('#ajax-loader').css({
        position: 'absolute',
        top: (pos.top + 6) + 'px',
        left: (pos.left + width + 10) + 'px',
        display: 'block'
    });
}
    
function hideAjaxLoader() {
    $('#ajax-loader').attr('style', null);
}

function displayFormErrors(errors) {
    for (element in errors) {
        errMessages = '';
        for (errType in errors[element]) {
            errMessages += '<li>' + errors[element][errType] + '</li>';
        }
        $('#' + element).parent().append(
            '<ul class="form-error">' +
            errMessages +
            '</li>');
                
    }
}

$('.popup-close-button').live('click', function() {
    $(this).parent().fadeOut(500, function() {
        $('#transparent-background').hide();
    });
});