$(document).ready(function() {
    isActivityRadios = $('input:radio[name=is_activity]');
    isActivityRadios.filter('[value=1]').attr('checked', true);
    $('input:radio[name=type]:first').attr('checked', true);
    
    $('input[name=is_activity]:radio').change(function() {
        
        if ($(this).attr('id') == 'activity_type_radio_selected') {
            $('input:radio[name=type]:first').attr('checked', true);
            $('#select_type_is_not_activity').fadeOut(500);
            $('#select_type_is_activity').fadeIn(500);
        } else {
            typeRadios = $('input:radio[name=type]');
            typeRadios.filter('[value=Node_Common]').attr('checked', true);
            $('#select_type_is_activity').fadeOut(500);
            $('#select_type_is_not_activity').fadeIn(500);
        }
    });
    
    $('.activity-type-select-box').live('click', function() {
        $(this).find('input:radio[name=type]').attr('checked', true);
    });
    
    $('.activity-type-select-box').live('dblclick',  function() {
        $(this).find('input:radio[name=type]').attr('checked', true);
        $('#add-type-form').submit();
    })
});