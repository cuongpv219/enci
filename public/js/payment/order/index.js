$(document).ready(function() {
    $('#btn-add-new-address').click(function(event) {
        event.preventDefault();
        $('#new-address-box').removeClass('hide');
    });
    
    $('#city_or_province').change(function(event) {
        event.preventDefault();        
        $.ajax({
            url: baseUrl + "/payment/ajax/get-districts",
            async: false,
            type: "POST",
            cache: false,                      
            data: { 
                city: $("#city_or_province").val()
            },                                                                                         
            error: function(xhr, error) {
                return false;
            },
            success: function(data) {
                if (data) {
                    $('#district').html(data);
                }                                 
            }
        });
    });
});