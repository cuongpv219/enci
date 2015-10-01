$(document).ready(function() {
    $('.course-detail-showmore').showMore({
        speedDown: 300,
        speedUp: 300,
        height: '210px',
        showText: 'Xem thêm',
        hideText: 'Thu lại'
    });
    $('#btn-viewmore').click(function(){
        if(parseInt(page) > 0) {
            var txt = 'Xem thêm';
            $(this).text('');
            $(this).prepend('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
    		$.get(url + '/page/' + (page + 1), function(data, status){
                var fscolon = data.indexOf(';');
                page = parseInt(data.substr(0, fscolon));
                if(page == 0) {
                    $(this).addClass('disabled');
                }
    			var reviews = $.parseHTML(data.substr(fscolon+1));
    			$(reviews).appendTo('.course-detail-reviews .list-group');
                removeLoading('#btn-viewmore', txt);
    		});
        } else {
            $(this).addClass('disabled');
        }
    });
    function removeLoading(obj, txt) {
        $(obj).find("span").remove();
        $(obj).text(txt);
    }
});
