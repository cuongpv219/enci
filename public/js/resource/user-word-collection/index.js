var $url
$(document).ready(function() {
    // LISTEN
    $('#collection-filter-list .listen').click(function() {
        var url = $(this).attr('data-url');
        playSound('http://ucan.vn' + url, true, 'user_word_collection_player');
    });
    
    // REMOVE
    $('#collection-filter-list .remove').click(function() {
        var id = $(this).parent().find('.title').attr('data-id');
        var url = baseUrl + '/resource/user-word-collection/delete/deleteid/' + id ;
        console.log(url);
        var td = $(this);
        $.post(url ,function(data){
            if(data) {
                var tr = td.parent('tr:first');
                td.siblings('td').stop(true, true).animate({
                    'opacity' : 0.3
                }, 500, function() {
                    tr.remove();
                });
            }
        });
        
    });
   
    // Date picker
    $("#datetime-choice-wrapper .time").datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
    });
    $('.thtitle .show-hide-column').click(function(){
        
        if ($('.thtitle').attr('data-value')==0) {
            $('.title span').addClass('titleblur');
            $(this).html('').append("Hiện");
            $('.thtitle').attr('data-value',1);
        }
        else {
            $('.title span').removeClass('titleblur');
            $(this).html('').append("Ẩn");
            $('.thtitle').attr('data-value',0);
        }
    });
    
      $('.thmeaning .show-hide-column').click(function(){
        
        if ($('.thmeaning').attr('data-value')==0) {
            $(this).html('').append("Hiện");
            $('.meaning span').addClass('meaningblur');
            $('.thmeaning').attr('data-value',1);
        }
        else {
            $('.meaning span').removeClass('meaningblur');
            $(this).html('').append("Ẩn");
            $('.thmeaning').attr('data-value',0);
        }
    });
    // Close date picker
    $('#datetime-choice-wrapper .btn-cancel').click(function() {
        $('#datetime-choice-wrapper').stop(true, true).fadeOut(300);
    });
    
    // Show date picker
    $('#collection-navigator-choices .item:last').click(function(e) {
        if (!$(e.target).is('.btn-cancel')) {
            $('#datetime-choice-wrapper').stop(true, true).fadeIn(300);
        }
    });
});
