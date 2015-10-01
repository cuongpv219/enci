$(document).ready(function() {
    $('#cancel').click(function() {
        window.location = baseUrl + '/payment/order';
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