$(document).ready(function() {
    $('.discussion-like-answer-info-box-quick-answer').autosize();
    $('.discussion-content').expander({
        slicePoint:       200,  // default is 100
        expandPrefix:     '... ', // default is '... '
        expandText:       'Xem thêm', // default is 'read more'
        //        collapseTimer:    5000, // re-collapses after 5 seconds; default is 0, so no re-collapsing
        userCollapseText: ''  // default is 'read less'
    }); 
    
    function getCaret(el) {
        if (el.selectionStart) {
            return el.selectionStart;
        } else if (document.selection) {
            el.focus();

            var r = document.selection.createRange();
            if (r == null) {
                return 0;
            }

            var re = el.createTextRange(),
            rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);

            return rc.text.length;
        }  
        return 0;
    }
    
    $(".discussion-like-answer-info-box-quick-answer").keyup(function(event) {
        //        while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
        //            $(this).height($(this).height() + 1);
        //        };
        if (event.keyCode == 13 && event.shiftKey) {
            var content = this.value;
            var caret = getCaret(this);
            this.value = content.substring(0, caret);
            //            this.value = content.substring(0, caret) +
            //            "\n" + content.substring(caret,content.length - 1);
            event.stopPropagation();
        } else if (event.keyCode == 13) {
            event.preventDefault();
        }
    });
    
    $(".discussion-like-answer-info-box-quick-answer").keydown(function(event) {
        if (event.keyCode == 13 && !event.shiftKey) {
            // prevent default behavior
            event.preventDefault();
            var id = $(this).attr('data-id');
            $('#post-answer-loader-' + id).removeClass('element-hidden');
            var url = $(this).attr('data-url');
            var data = {
                'content' : $(this).val()
            };
            
            postObject = $(this);
            $.post(url, data).success(function(result) {
                if (result != '0') {
                    $('#discussion-answer-list-box-' + id).append(result);
                    $('#post-answer-loader-' + id).addClass('element-hidden');
                    postObject.val('');
                    var numOfAnswers = parseInt($('#discussion-feedback-num-of-answers-' + id).text());
                    $('#discussion-feedback-num-of-answers-' + id).text(numOfAnswers + 1);
                    $('#discussion-feedback-num-of-answers-' + id).removeClass('discussion-feedback-num-of-answers-hidden')
                    .css({
                        'paddingLeft' : '18px'
                    });
                    $('#span-box-num-of-answers-' + id).text(numOfAnswers + 1);
                }
            });
        }
    });
    
    //    originalOffsetY = $('#class-discussion-header-bar-wrapper').offset().top;
    //    $(window).scroll(function() {
    //        if ($(window).scrollTop() >= originalOffsetY) {
    //            $('#class-discussion-header-bar-wrapper').addClass('sticky');
    //        } else {
    //            $('#class-discussion-header-bar-wrapper').removeClass('sticky');
    //        }
    //    });
    
    $('.discussion-like-action').live('click', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');
        var likeObject = $(this);
        $.post(href).success(function(result) {
            if (result == '1') {
                likeObject.removeClass('discussion-like-action').addClass('discussion-unlike-action');
                var id = parseInt(likeObject.attr('data-id'));
                likeObject.attr('href', href.replace('class-discussion', 'class-discussion-unlike'));
            
                var numOfLikes = parseInt($('#discussion-feedback-num-of-likes-' + id).text());
                $('#discussion-feedback-num-of-likes-' + id).text(numOfLikes + 1);
                $('#class-discussion-num-of-likes-' + id).text(numOfLikes + 1);
                $('#span-box-num-of-likes-' + id).text(numOfLikes + 1);
            
                $('#class-discussion-button-like-' + id)
                .removeClass('class-discussion-like-button-enabled')
                .addClass('class-discussion-like-button-disabled')
                .removeAttr('disabled');
                likeObject.text('Unlike');
                $('#discussion-feedback-num-of-likes-' + id).removeClass('discussion-feedback-num-of-likes-hidden')
                .css({
                    'paddingLeft' : '16px'
                });
            }
            
        });
    });
    
    $('.discussion-unlike-action').live('click', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');
        var unlikeObject = $(this);
        $.post(href).success(function(result) {
            if (result == '1') {
                unlikeObject.removeClass('discussion-unlike-action').addClass('discussion-like-action');
                var id = parseInt(unlikeObject.attr('data-id'));
                unlikeObject.attr('href', href.replace('class-discussion-unlike', 'class-discussion'));
            
                var numOfLikes = parseInt($('#discussion-feedback-num-of-likes-' + id).text());
                if (numOfLikes > 0) {
                    $('#discussion-feedback-num-of-likes-' + id).text(numOfLikes - 1);
                    $('#class-discussion-num-of-likes-' + id).text(numOfLikes - 1);
                    $('#span-box-num-of-likes-' + id).text(numOfLikes - 1);
                }
                
                $('#class-discussion-button-like-' + id)
                .removeClass('class-discussion-like-button-disabled')
                .addClass('class-discussion-like-button-enabled')
                .attr('disabled', 'disabled');
                
                unlikeObject.text('Like');
                $('#discussion-feedback-num-of-likes-' + id).removeClass('discussion-feedback-num-of-likes-hidden')
                .css({
                    'paddingLeft' : '16px'
                });
            }
            
        });
    });
    
    $('.class-discussion-like-button-enabled').live('click', function(event) {
        var href = $(this).attr('data-url');
        var likeObjectButton = $(this);
        $.post(href).success(function(result) {
            if (result == '1') {
                likeObjectButton.removeClass('class-discussion-like-button-enabled')
                .addClass('class-discussion-like-button-disabled')
                .removeAttr('disabled');
                    
                var id = parseInt(likeObjectButton.attr('data-id'));
                var likeObjectLink = $('#discussion-feedback-action-like-unlike-' + id);
                    
                likeObjectLink.removeClass('discussion-like-action').addClass('discussion-unlike-action');
                
                likeObjectLink.attr('href', href.replace('class-discussion-unlike', 'class-discussion'));
            
                var numOfLikes = parseInt($('#discussion-feedback-num-of-likes-' + id).text());
                $('#discussion-feedback-num-of-likes-' + id).text(numOfLikes + 1);
                $('#class-discussion-num-of-likes-' + id).text(numOfLikes + 1);
                $('#span-box-num-of-likes-' + id).text(numOfLikes + 1);
            
                likeObjectLink.text('Unlike');
                $('#discussion-feedback-num-of-likes-' + id).removeClass('discussion-feedback-num-of-likes-hidden')
                .css({
                    'paddingLeft' : '16px'
                });
            }
        });
    });
    
    $('.discussion-like-answer-info-box-quick-answer').live('focus', function(event) {
        var id = $(this).attr('data-id');
        $('#discussion-like-answer-info-box-quick-answer-help-' + id).removeClass('element-hidden');
    });
    
    $('.discussion-like-answer-info-box-quick-answer').live('blur', function(event) {
        var id = $(this).attr('data-id');
        $('#discussion-like-answer-info-box-quick-answer-help-' + id).addClass('element-hidden');
    });
    
    $('.discussion-feedback-action-detail').live('click', function(event) {
        var id = $(this).attr('data-id');
        $('#discussion-content-' + id).removeClass('element-hidden');
        event.preventDefault();
    });
    
    $('.view-all-discussion-answers').live('click', function(event) {
        event.preventDefault();
        var id = $(this).attr('data-id');
        $('#get-answers-loader-' + id).removeClass('element-hidden');
        var href = $(this).attr('href');
        
        $.post(href).success(function(result) {
            if (result != '0') {
                $('#discussion-answer-list-box-' + id).html(result);
                $('#get-answers-loader-' + id).addClass('element-hidden');
            }
        });
    });
    
    $('.discussion-feedback-action-answer').live('click', function(event) {
        event.preventDefault();
        var id = $(this).attr('data-id');
        $('#discussion-like-answer-info-box-quick-answer-' + id).focus();
    });
    
    $('.discussion-answer-item-delete').live('click', function(event) {
        var id = $(this).attr('data-id');
        var url = $(this).attr('data-url');
        
        $('#answer-delete-confirm-dialog').attr('data-id', id);
        
        $('#transparent-background').show();
        $('#answer-delete-confirm-dialog').show();
        
        
        $('#answer-delete-confirm-dialog-no-button').live('click', function() {
            $('#transparent-background').hide();
            $('#answer-delete-confirm-dialog').hide();    
        });
        
        $('#answer-delete-confirm-dialog-yes-button').live('click', function() {
            $.post(url).success(function(result) {
                if (result == '1') {
                    $('#transparent-background').hide();
                    $('#answer-delete-confirm-dialog').hide();
                    deletedId = $('#answer-delete-confirm-dialog').attr('data-id');
                    console.log(deletedId);
                    discussionId = $('#discussion-answer-item-' + deletedId).attr('data-discussion-id');
                    $('#span-box-num-of-answers-' + discussionId).text(parseInt($('#span-box-num-of-answers-' + discussionId).text()) - 1);
                    $('#discussion-answer-item-' + deletedId).remove();
                }
            }); 
        });
    });
    
    
    $('.discussion-like-list').live('click', function(event) {
        event.preventDefault();
        var url = $(this).attr('href');
        var id = $(this).attr('data-id');
        $('#get-likes-loader-' + id).removeClass('element-hidden');
        $.post(url).success(function(result) {
            if (result != '0' && result != 'false') {
                $('#discussion-like-list').html(result);
                $('#get-likes-loader-' + id).addClass('element-hidden');
                $('#discussion-like-list-box').show();
                $('#transparent-background').show();
            } else {
                $('#get-likes-loader-' + id).addClass('element-hidden');
            }
        }); 
    });
    
    $('#discussion-like-list-close').live('click', function(event) {
        $('#discussion-like-list-box').hide();
        $('#transparent-background').hide();
    });
    
    $('.class-answer-like-list').live('click', function(event) {
        event.preventDefault();
        var url = $(this).attr('href');
        var id = $(this).attr('data-id');
        $('#get-likes-loader-' + id).removeClass('element-hidden');
        $.post(url).success(function(result) {
            if (result != '0' && result != 'false') {
                $('#discussion-like-list').html(result);
                $('#get-likes-loader-' + id).addClass('element-hidden');
                $('#discussion-like-list-box').show();
                $('#transparent-background').show();
            } else {
                $('#get-likes-loader-' + id).addClass('element-hidden');
            }
        }); 
    });
    
    $('.class-answer-like-action').live('click', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');
        
        var likeObject = $(this);
        $.post(href).success(function(result) {
            if (result == '1') {
                likeObject.removeClass('class-answer-like-action').addClass('class-answer-unlike-action');
                var id = parseInt(likeObject.attr('data-id'));
                likeObject.attr('href', href.replace('class-answer-like', 'class-answer-unlike'));
            
                var numOfLikes = parseInt($('#class-answer-num-of-likes-' + id).text());
                $('#class-answer-num-of-likes-' + id).text(numOfLikes + 1);
                
                likeObject.text('Unlike');
                $('#class-answer-like-separator-' + id).removeClass('element-hidden');
                $('#class-answer-num-of-likes-' + id).removeClass('class-answer-feedback-num-of-likes-hidden')
                .css({
                    'paddingLeft' : '18px'
                });
            }
            
        });
    });
    
    $('.class-answer-unlike-action').live('click', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');
        
        var likeObject = $(this);
        $.post(href).success(function(result) {
            if (result == '1') {
                likeObject.removeClass('class-answer-unlike-action').addClass('class-answer-like-action');
                var id = parseInt(likeObject.attr('data-id'));
                likeObject.attr('href', href.replace('class-answer-unlike', 'class-answer-like'));
            
                var numOfLikes = parseInt($('#class-answer-num-of-likes-' + id).text());
                if (numOfLikes > 0) {
                    $('#class-answer-num-of-likes-' + id).text(numOfLikes - 1);
                    likeObject.text('Like');
                    
                    if (numOfLikes > 1) {
                        $('#class-answer-num-of-likes-' + id).removeClass('class-answer-feedback-num-of-likes-hidden')
                        .css({
                            'paddingLeft' : '18px'
                        });
                    } else {
                        $('#class-answer-num-of-likes-' + id).addClass('class-answer-feedback-num-of-likes-hidden');
                        $('#class-answer-like-separator-' + id).addClass('element-hidden');
                    }
                    
                }
            }
        });
    });
    
//    $(window).scroll(function(){
//        if ($(this).scrollTop() > 100) {
//            $('.scrollup').fadeIn();
//        } else {
//            $('.scrollup').fadeOut();
//        }
//    }); 
// 
//    $('.scrollup').click(function(){
//        $("html, body").animate({
//            scrollTop: 0
//        }, 600);
//        return false;
//    });
});