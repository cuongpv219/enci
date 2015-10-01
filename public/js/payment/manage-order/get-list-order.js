$(document).ready(function(){    
    $(".input-small").datepicker({ 
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    });



    $('#dark-background').click(function() {
        $('#dark-background').fadeOut(100);
        $('#edit-order-box').fadeOut(100);
    });
});