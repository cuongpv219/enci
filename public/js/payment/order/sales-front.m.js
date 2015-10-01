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
