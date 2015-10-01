$(document).ready(function() {

    var tip = activityContent.tip;
    
    if (tip === null || $.trim(activityContent.tip) === '') {
        inviHintHelp(true, false);
    } else {
        tip = Ucan.Function.HTML.editMediaUrl(tip);
        $('#hint-outer div.content').html(tip);    // in nội dung ra
        inviHintHelp(false, false);
    }

    var leftSpace = ($('body').width() - $('#hint-outer').width()) / 2;

    window.onresize = function(event) {
        leftSpace = ($('body').width() - $('#hint-outer').width()) / 2;
        $('#hint-outer').css({
            left: leftSpace
        });
        $('#video-board-outer').css({
            left: leftSpace
        });
    };

    // JScroll cho hint
    $('#hint-outer > .content').ucanJScrollPane('#hint-outer > .content');

    // Click hint
    $('#icon-hint').click(function() {
        $('#hint-outer').fadeIn(300).css({
            display: 'block',
            left: leftSpace
        });
    });

    $('#hint-outer').draggable({
        cancel: "#hint-outer .content"
    });

    // Ẩn hint
    $('#hint-outer .hint-header .global-button-close-board').click(function() {
        $('#hint-outer').fadeOut(180);
    });

    // Click help
    $('#icon-help').click(function() {
        $('#video-board-outer').fadeIn(300).css({
            display: 'block',
            left: leftSpace
        });
        $('#video-board-outer').draggable({
            cancel: '.btn-close-help'
        });
        $('#video-board-outer .video-js').height(360);
        $('#video-board-outer .video-js-box').width(640);
    });

    // Ẩn Help
    $('#video-board-outer .btn-close-help').click(function() {
        $('#video-board-outer').hide();
    });

    function inviHintHelp(inviHint, inviHelp) {
        var rightSpace = 0;
        
        if (inviHint) {
            $('#icon-hint').hide();
        } else {
            rightSpace += 30;
        }

        if (inviHelp) {
            $('#icon-help').hide();
        } else {
            rightSpace += 30;
        }

        $('#requestBottom .hline').width(function() {
            return $('#requestBottom').width() - rightSpace;
        });
    }
});