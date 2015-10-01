$(document).ready(function() {
    $('#btn-view-more').click(function(){
        if(parseInt(pageLibrary) > 0) {
            var txt = 'Xem thêm các bài học khác';
            $(this).text('');
            if(typeof(idLibrary) === 'undefined') {
                idLibrary = null;
            }
            $(this).prepend('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
            $.post(urlLibrary + '/page/' + (pageLibrary + 1), {id: idLibrary}, function(data, status){
                var fscolon = data.indexOf(';');
                pageLibrary = parseInt(data.substr(0, fscolon));
                if(pageLibrary == 0) {
                    $(this).addClass('disabled');
                }
                var reviews = $.parseHTML(data.substr(fscolon+1));
                $(reviews).appendTo('#libraryList');
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
