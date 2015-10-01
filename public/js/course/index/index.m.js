$(document).ready(function() {
    $('#btn-view-more').click(function(){
        if(parseInt(pageCourse) > 0) {
            var txt = 'Xem thêm các khóa khác';
            $(this).text('');
            if(typeof(idCourse) === 'undefined') {
                idCourse = null;
            }
            $(this).prepend('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
            $.post(urlCourse + '/page/' + (pageCourse + 1), {id: idCourse}, function(data, status){
                var fscolon = data.indexOf(';');
                pageCourse = parseInt(data.substr(0, fscolon));
                if(pageCourse == 0) {
                    $(this).addClass('disabled');
                }
                var reviews = $.parseHTML(data.substr(fscolon+1));
                $(reviews).appendTo('#courseList');
                removeLoading('#btn-view-more', txt);
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