UDict = $(document).ready(function() {

    var url;
    var selectionObj;

    function getSelection() {
        var txt = '';
        if (window.getSelection) {
            txt = window.getSelection();
        } else if (document.getSelection) {
            txt = document.getSelection();
        } else if (document.selection) {
            txt = document.selection.createRange().text;
        }
        return txt;
    }
    function displayVDictIFrame(e) {
        if (isValidSelection(e)) {
            url = encodeURI(baseUrl + '/resource/dict/index/source/' + $.trim(selectionObj.toString()));

            // Tạo diff
            if ($('#type-anchors').size() == 0) {
                $('#dict-wrapper').append('<ul id="type-anchors"></ul>');
            }
            if ($('#type-anchors *').size() > 0) {
                $('#type-anchors').empty();
            }
            var diff = $('#type-anchors');

            // Set position
            if (!$(e.target).parents('#dict-iframe').size() > 0) {
                var nearRight = false;
                var nearBottom = false;
                if ((e.clientX + 400) > screen.width) {
                    nearRight = true;
                }
                if ((e.clientY + 400 > screen.height)) {
                    nearBottom = true;
                }
                $('#dict-wrapper').css({
                    'top': function() {
                        if (nearBottom) {
                            return e.pageY - $('#dict-iframe').height() - 40;
                        }
                        return e.pageY + 16;
                    },
                    'left': function() {
                        if (nearRight) {
                            return e.clientX - $('#dict-iframe').width() + 40;
                        }
                        return e.clientX - 80;
                    }
                });
            }

            // Loading...
            if ($('#ajax-loading-dict').size() > 0) {
                $('#ajax-loading-dict').show();
            } else {
                $('#dict-wrapper').append('<div id="ajax-loading-dict"><img src="' + baseUrl + '/css/img/ajax-loading-dict.gif' + '" alt="Loading dictionary..."/></div>');
            }

            // Ajax request nội dung từ điển 
            $.get(url, function(data) {
                if ($('#dict-wrapper .jspPane').size() === 1) {
                    $('#dict-wrapper .jspPane').empty().append(data);
                } else {
                    $('#dict-iframe').empty().append(data);
                }

                // Anchor codes
                if ($('.phanloai, .idioms').size() > 1) {
                    $('#dict-wrapper .phanloai, #dict-wrapper .idioms').each(function(index) {
                        var tip = $('<li data-anchor=' + index + '><span class="tip">' + $(this).text() + '</span></li>');
                        diff.append(tip);
                        $(this).attr('data-anchor', index);
                    });

                    // Click anchors
                    $('#type-anchors li').click(function() {
                        var anchor = $(this).attr('data-anchor');
                        var top = 0;
                        var li = $(this);
                        $('.phanloai, .idioms').each(function() {
                            if ($(this).attr('data-anchor') == anchor) {
                                var titleTop = $('#dict-iframe #word-title').offset().top;
                                var typeTop = $(this).offset().top;
                                var liTop = li.offset().top - $('#dict-iframe').offset().top - li.children('.tip').height() + 14;
                                top = typeTop - titleTop - liTop;
                                return false;
                            }
                        });
                        if (top >= 0) {
                            $('#dict-iframe').data('jsp').scrollTo(0, top);
                        }
                    }).hover(function() {
                        var left = $('.tip', this).width() + 28;
                        var top = $(this).position().top - 10;
                        $('.tip', this).css({
                            'left': -left,
                            'top': top
                        });
                    }, function() {
                        $('.tip', this).css('left', -9999999);
                    });
                }

                // JScroll
                $('#dict-iframe').ucanJScrollPane('#dict-wrapper', {
                    autoReinitialise: true,
                    animateScroll: true,
                    maintainPosition: false
                });

                // Show anchors
                if ($('#dict-iframe .jspPane').height() > $('#dict-wrapper').height() + 100) {
                    diff.show();
                } else {
                    diff.hide();
                }

                // Append white space
                if ($('#type-anchors:visible').size() > 0 && $('#dict-white-space').size() === 0) {
                    if ($('#dict-iframe .jspPane').size() > 0) {
                        $('#dict-iframe .jspPane').append('<div id=dict-white-space></div>');
                    } else {
                        $('#dict-iframe').append('<div id=dict-white-space></div>');
                    }
                }

                // dict-wrapper events
                $('#dict-wrapper').draggable({
                    cancel: '#dict-iframe, #type-anchors, #dictionary-player'
                });

                // Clear
                clearSelection();

                // Listening
                $('#word-listen-pronunciation').click(function(event) {
                    event.preventDefault();
                    $('#dictionary-player').remove();
                    playSound(mediaUrl + $(this).attr('data-url'), true, 'dictionary-player');
                });

                // Hide ajax loading
                $('#ajax-loading-dict').stop(true, true).fadeOut(200);

                // Check NO RESULT
                if ($('#word-title').size() == 0) {
                    $('#dict-navigator .dict-method').hide();
                } else {
                    $('#dict-navigator .dict-method').show();
                }
            }); // end ajax

            // Show dict
            $('#dict-wrapper').show();

            // Hide dict
            $('#dict-button-close').unbind().on('click', function() {
                $('#dict-wrapper').hide();
            });

            // Add word to collection
            $('#dict-button-add-word-collection').unbind().on('click', function() {
                // Wait...
                $('#dict-action-message').stop(true, true).text('').removeClass('wait error').addClass('wait').show();

                // Call ajax
                var url = baseUrl + '/resource/user-word-collection/add/wordid/' + $('#word-title').attr('data-id');
                $.get(url, function(data) {
                    if ($.trim(data) == '0') {
                        $('#dict-action-message').stop(true, true).fadeOut(100, function() {
                            $(this).removeClass('wait error').text('Added successfully').show().delay(2000).fadeOut(500);
                        });
                    } else {
                        console.log(data);
                        $('#dict-action-message').stop(true, true).fadeOut(100, function() {
                            $(this).removeClass('wait').addClass('error').text('Error').show().delay(2000).fadeOut(500);
                        });
                    }
                });
            });
        }
    }

    function isValidSelection(e) {
        if (!selectionObj) {
            return false;
        }
        var text = $.trim(selectionObj.toString());
        return text != ''
                && !$(e.target).is('input')
                && !$(e.target).is('#word-title')
                && !$(e.target).is('.jspPane')
                && text.indexOf(':') == -1
                && text.indexOf('/') == -1
                && text.indexOf('\\') == -1
                && text.indexOf('[') == -1
                && text.indexOf(']') == -1
                && text.indexOf('!') == -1
                && text.indexOf('@') == -1
                && text.indexOf('#') == -1
                && text.indexOf('$') == -1
                && text.indexOf('%') == -1
                && text.indexOf('^') == -1
                && text.indexOf('&') == -1
                && text.indexOf(',') == -1
                && text.indexOf('>') == -1
                && text.indexOf('<') == -1
                && text.indexOf('{') == -1
                && text.indexOf('}') == -1
                && text.indexOf('"') == -1
                && text.indexOf('+') == -1
                && text.indexOf('=') == -1
                && text.indexOf('~') == -1
                && text.indexOf('`') == -1
                ;
    }

    $(document).mouseup(function(e) {
        try {
            selectionObj = getSelection();
            if ($.trim(selectionObj.toString()) != '' && selectionObj.toString().length < 23) {
                displayVDictIFrame(e);
            }
        } catch (exception) {
            $('#dict-wrapper').hide();
            console.log(exception);
        }

    });

    // Hide khi press ESC
    $(document).keyup(function(event) {
        if (event.keyCode == 27) {
            $('#dict-wrapper').hide();
        }
    });

    function clearSelection() {
        try {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            }

            if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }

            if (document.selection) {  // IE?
                document.selection.empty();
            }
        } catch (exception) {
            $('#dict-wrapper').hide();
            console.log(exception);
        }
    }
});