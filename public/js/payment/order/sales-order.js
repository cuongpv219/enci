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

    

    var currentBoxCmt = 1;
    setInterval(function(){
        nextBoxCmt = currentBoxCmt+1;
        if(nextBoxCmt == 3) nextBoxCmt =1;
        // console.log(nextUser);
        // console.log(currentBoxCmt);
        $('.box.box-'+currentBoxCmt).addClass('active').removeClass('deactive').siblings().addClass('deactive').removeClass('active');
        currentBoxCmt++;
        if (currentBoxCmt == 3) {currentBoxCmt = 1};
    }, 10000);

    $('.tree-item-node').click(function() {
        var id = $(this).attr('data-id');
        var order = $(this).attr('data-order');
        if (id == 1) {
            $(this).attr('data-id', 0);
            $('.up-down-icon-'+order).addClass('up-icon').removeClass('down-icon');
            $('.item-'+order).slideDown('slow');
        } else {
            $(this).attr('data-id', 1);
            $('.up-down-icon-'+order).addClass('down-icon').removeClass('up-icon');
            $('.item-'+order).slideUp('slow');
        }
    });

    $('.link-demo').click(function() {
        var href = $(this).attr('href');
        window.open(href, 'newwindow', 'width=1200, height=750'); 
        return false;
    });

    // $('#about .post-image').click(function() {
    //     var id = $(this).attr('data-id');
    //     $('#dark-background').fadeIn(500);
    // });

    // $('#dark-background').click(function() {
    //     $('#dark-background').fadeOut(500);
    // })
});