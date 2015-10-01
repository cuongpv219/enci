(function($) {
    /**
     * Thay đổi css cho tab. Nếu có thêm các icon khác như hình home, intro...
     * thì phải code thêm trong file js của activity đó.
     */
    $.fn.ucanMoveToTab = function(index) {
        this.find('.unselected').each(function() {
            if ($(this).attr('data-order') == index) {
                $(this).removeClass('unselected').addClass('selected');
                $(this).siblings('.selected').removeClass('selected').addClass('unselected');
                return false;
            }
            return true;
        });
        return this;
    };

    /**
     * Remove các thẻ rỗng. Nếu nội dung trống + ko có class nào + ko có style 
     * thì sẽ remove thẻ đó
     */
    $.fn.ucanRemoveAllEmptyTags = function() {
        if (!this) {
            return '';
        }

        this.each(function() {
            if ($(this).html().replace(/\s+/g, '') == '' && !$(this).attr('id') && !$(this).attr('class') && !$(this).attr('type') && !$(this).is('img') && !$(this).attr('style')) {
                $(this).remove();
            }
        });
        return this;
    };

    /**
     * Nhấp nháy icon đúng sai khi show result
     */
    $.fn.ucanAnimateTrueFalseIcon = function() {
        this.each(function() {
            if ($(this).hasClass('true') || $(this).hasClass('true-icon')) {
                $(this).stop(true, true).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
            } else {
                $(this).stop(true, true).fadeIn(500).fadeOut(500).fadeIn(500);
            }
        });
        return this;
    };

    /**
     * Nhấp nháy đáp án
     */
    $.fn.ucanAnimateAnswers = function() {
        this.stop(true, true).fadeOut(500).fadeIn(500);
    };

    /**
     * Tinh chỉnh lại jScrollPane. Khi di chuột vào thì fadeIn, di ra thì fadeOut
     * @param holder cái chứa jScrollPane mà cần fadeIn, fadeOut khi di chuột vào hoặc ra
     * @param options nếu muốn tinh chỉnh thì truyền các options vào đây
     */
    $.fn.ucanJScrollPane = function(holder, options) {
        var isOverScrollPane = false;
        if (options) {
            this.jScrollPane(options);
        } else {
            this.jScrollPane({
                autoReinitialise: true,
                animateScroll: true
            });
        }

        if (!holder) {
            return this;
        }

        $(holder).hover(function() {
            $('.jspVerticalBar, .jspHorizontalBar')
                .stop(true, true)
                .fadeIn(Ucan.Constants.getShowJScrollPaneSpeed());
            isOverScrollPane = true;
        }, function() {
            if ($('.jspActive').size() < 1) {
                $('.jspVerticalBar, .jspHorizontalBar')
                    .stop(true, true)
                    .delay(Ucan.Constants.getDelayTimeJScrollPane())
                    .fadeOut(Ucan.Constants.getHideJScrollPaneSpeed());
            }
            isOverScrollPane = false;
        });

        $(document).mouseup(function() {
            if (!isOverScrollPane) {
                $('.jspVerticalBar, .jspHorizontalBar')
                    .delay(Ucan.Constants.getDelayTimeJScrollPane())
                    .fadeOut(200);
            }
        });
        return this;
    };

    /**
     * Auto complete nhiều giá trị
     * @param values mảng chứa giá trị
     * @param delimitor dấu ngăn cách
     */
    $.fn.ucanAutoCompleteMultiValues = function(values, delimitor) {
        if (!delimitor) {
            delimitor = ', ';
        }

        function split(val) {
            return val.split(/,\s*/);
        }

        function extractLast(term) {
            return split(term).pop();
        }

        this.bind("keydown", function(event) {
            if (event.keyCode === $.ui.keyCode.TAB &&
                $(this).data("autocomplete").menu.active) {
                event.preventDefault();
            }
        }).autocomplete({
            source: function(request, response) {
                // delegate back to autocomplete, but extract the last term
                response($.ui.autocomplete.filter(
                    values, extractLast(request.term)));
            },
            focus: function() {
                // prevent value inserted on focus
                return false;
            },
            select: function(event, ui) {
                var terms = split(this.value);
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.value);
                // add placeholder to get the comma-and-space at the end
                terms.push("");
                this.value = terms.join(delimitor);
                return false;
            }
        });
    };

    $.fn.ucanScrollTo = function(target, speed, callback) {
        if (!speed) {
            speed = 500;
        }
        this.animate({
            scrollTop: $(target).offset().top
        }, speed, function() {
            if ($.isFunction(callback)) {
                callback.call();
            }
        });
    };

    $.fn.ucanEditMediaUrl = function() {
        this.each(function() {
            $(this).html($(this).html().replace(/"\/upload\//g, '"' + resourceUrl + '/upload/'));
        });

        return this;
    };

    /**
     * Đếm ngược số kí tự còn lại khi input vào textbox, textarea... <br/>
     * Nhớ phải thêm attribute data-limit.
     * @param {type} printer phần tử DOM hiển thị số kí tự còn lại
     * @returns {Boolean} nếu vượt quá data-limit
     */
    $.fn.ucanLimitCharacters = function(printer) {
        if (!this.attr('data-fired-limit', true)) {
            this.keydown(runLimitCounter(this));
        } else {
            runLimitCounter(this);
        }

        function runLimitCounter(own) {
            var max = $(own).attr('data-limit');
            var len = $(own).length;

            if (len > max) {
                $(printer).text(0);
            } else {
                $(printer).text(max - len);
            }

            return $(own);
        }
    };

    /* Thay doi audio player 1pixelout */
    $.fn.ucanMigrate1pixelout = function(tutorialText) {
        var TUTORIAL_TEXT_DEFAULT = tutorialText || "Click to Play";
        valueObject = $(this).attr('value')
        soundFile = valueObject.split('&soundFile=');
        srcSoundFile = soundFile[1];
        $(this).parents('object:first').after('<div class="sound-manager-2"><div class="ui360 player"><a href="' +
            srcSoundFile + '"></a></div><span class="tutorial">' + TUTORIAL_TEXT_DEFAULT + '</span></div>');
    }
})(jQuery);
