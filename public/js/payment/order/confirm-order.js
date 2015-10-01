$(document).ready(function() {
//    $("#comfortable_shipping_time").click(function() {
//        $("#error").hide();
//        $('#transport-time label').show();
//    });

    $("#cancel").click(function() {
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

//    $("#order-form").submit(function() {
//        if ($("#comfortable_shipping_time").val() == null || $("#comfortable_shipping_time").val() == "") {
//            $("#error").show();
//            $('#transport-time label').hide();
//            $('#comfortable_shipping_time').focus();
//            return false;
//        }
//        return true;
//    });
});