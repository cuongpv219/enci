$(document).ready(function() {
    var id;
    
    $('.series-item').click(function() {
        url = $(this).attr('data-url');
        window.location = url;
    });
    
    $('.series-item-helper').click(function() {
        id = $('.serie-selection', this).attr('checked', 'checked').attr('data-id');
    });
    
    $('.series-item-helper').dblclick(function() {
        id = $('.serie-selection', this).attr('checked', 'checked').attr('data-id');
        acceptSelection();
    });
    
    $('button.accept-selection').click(function() {
        acceptSelection();
    });
    
    function acceptSelection() {
        if (id) {
            outputObject = window.opener.$('#' + window.opener.callerObject.attr('data-outputsource'));
            var old = outputObject.val().replace(/\s*/g, '').split(',');
            
            if (old.indexOf(id) == -1) {
                old.push(id);
            }
            
            for (var i = 0; i < old.length; i++) {
                if (!old[i]) {
                    old.splice(i, 1);
                }
            }
            
            outputObject.val(old.join(', '));
            window.close();
        } else {
            alert("You must choose an item");
        }
    }
});