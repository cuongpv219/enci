$(document).ready(function() {
    $('#btn-view-more').click(function(){
        if(parseInt(pageUgc) > 0) {
            var txt = 'Xem thêm các bộ từ khác';
            $(this).text('');
            if(typeof(idUgc) === 'undefined') {
                idUgc = null;
            }
            $(this).prepend('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
            $.post(urlUgc + '/page/' + (pageUgc + 1), {id: idUgc}, function(data, status){
                var fscolon = data.indexOf(';');
                pageUgc = parseInt(data.substr(0, fscolon));
                if(pageUgc == 0) {
                    $(this).addClass('disabled');
                }
                var flashcard = $.parseHTML(data.substr(fscolon+1));
                $(flashcard).appendTo('#flashcardList');
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
