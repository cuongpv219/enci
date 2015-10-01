var canPlay = true;
var wordCount;
var unShowClickResult = 0;
var pictures = [];
var words = [];
var canClickShowAnswer = false;
var canClickRedo = false;
var i, j;
var numberOfGroup;
var keys = [];
var score;
$(document).ready(function() {
    var numViewedPage = 0 ;
    wordCount = activityContent.group.length; //number of word

    // Tạo ra đối tượng mapping để chấm điểm
    for (i = 0; i < wordCount; i++) {
        // Picture object
        var picObj = {};
        picObj.id = i;
        picObj.link = $.trim(activityContent.group[i].picture);
        pictures[i] = picObj;
        
        // Word object
        var wordObj = {};
        wordObj.id = i + 7;
        wordObj.text = $.trim(activityContent.group[i].word);
        words[i] = wordObj;

        // mapping
        var map = {};
        map.picID = picObj.id;
        map.wordID = wordObj.id;
        map.group = $.trim(activityContent.group[i].page ? activityContent.group[i].page : 1);
        keys[i] = map;
    }
    
    displayActivity();
    editGUI();

    function displayActivity() {
        // Tính số lượng các Group
        var tmp = [];
        for (var i = 0; i < keys.length; i++) {
            var group = keys[i].group;
            if (tmp.indexOf(group) == -1) {
                tmp.push(group);
            }
        }
        numberOfGroup = tmp.length;
        
        // In ra các Tab + block
        if (numberOfGroup > 1) {
            for (i = 0; i < numberOfGroup; i++) {
                $('#groups-container').append('<div class="concrete-group order' + i + '"></div>');
                $('.global-tab-container').append('<div class="unselected" data-order="' + i + '">' + (i + 1) + '</div>');
            }
        } else {
            $('#groups-container').append('<div class="concrete-group order1"></div>');
            $('.global-activity-guide').removeClass('with-tab');
            $('.global-tab-container, #next-tab, #back-tab').remove();
        }
        
        // Đặt dữ liệu vào các single-group
        $('.concrete-group').each(function(counter) {
            $(this).append('<div class="word-container"></div>'
                + '<div class="picture-container"></div>');
            
            var picArrTemp = [];
            var wordArrTemp = [];
            // Chọn những từ có group giống nhau
            for (i = 0; i < keys.length; i++) {
                if (keys[i].group == tmp[counter]) {
                    // Mảng tạm để shuffle
                    picArrTemp.push(pictures[i]);
                    wordArrTemp.push(words[i]);
                }
            }

            shuffle(picArrTemp);
            shuffle(wordArrTemp);
            for (i = 0; i < picArrTemp.length; i++) {
                $(this).children('.word-container').append('<div class="word" data-id="' + wordArrTemp[i].id + '">' + wordArrTemp[i].text + '</div>');
                $(this).find('.picture-container').append('<div class="wrapper">'
                    + '<img src="' + resourceUrl + picArrTemp[i].link + '" class="img-main" data-id="' + picArrTemp[i].id + '" alt="Image"/>'
                    + '</div>');
            }
        });
        
        // Cho ảnh cùng cỡ
        makeImageSameSize();
        
        $('.word-container .word').draggable({
            revert: "invalid",
            helper: "clone",
            zIndex: 3000,
            start: function(event,ui){
                ui.helper.toggleClass('dragging');
                $(this).data('draggable').offset.click.top = 22;
                $(this).data('draggable').offset.click.left = $(ui.helper).width() / 2;
            }
        });
	
        $(".word-container .word").hover(
            function(){
                if (!$(this).parent().hasClass('wrapper')) {
                    $(this).stop(true, true).css('line-height', '23px').animate({
                        fontSize : '20px'
                    }, 300);
                }
            }, function(){   
                if (!$(this).parent().hasClass('wrapper')) {
                    $(this).css('line-height', '22px').animate({
                        fontSize : '16px'
                    }, 100);
                }
            });
	
        $('.picture-container .img-main').droppable({
            accept: ".word",
            over: function() {
                $(this).parent().addClass('over');
            },
            out: function() {
                $(this).parent().removeClass('over');
            },
            drop: function(event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).parent().removeClass('over');
                
                if ($(this).siblings('.word').index(ui.draggable) != -1) {
                    return;
                }
                
                if ($(this).siblings('.word').size() > 0) {
                    ui.draggable.after($(this).stop(true, true).siblings('.word').hide().fadeIn(500));
                }
                $(this).after(ui.draggable.stop(true, true).hide().fadeIn(500));
            }
        });
        
        $('.word-container').droppable({
            accept: ".picture-container .word",
            over: function() {
                $(this).addClass('over');
            },
            out: function() {
                $(this).removeClass('over');
            },
            drop: function(event, ui) { 
                $(this).removeClass('over');
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).append(ui.draggable);
            }
        });
        
        /*
         * EVENT CLICK
         */
        $('.global-tab-container > *').click(function() {
            moveToTab(parseInt($(this).attr('data-order')));
        });
        
        $('#next-tab').click(function() {
            var order = parseInt($('.global-tab-container .selected').attr('data-order'));
            if (order >= 0 && order < numberOfGroup) {
                moveToTab(order + 1);
            }
        });
        
        $('#back-tab').click(function() {
            var order = $('.global-tab-container .selected').attr('data-order');
            if (order >= 0 && order > 0) {
                moveToTab(order - 1);
            }
        });
        
        moveToTab(0);
    }
    
    // View answers
    $("#show-answer").click(function() {
        if (canClickShowAnswer) {
            return;
        }
        playSound(Ucan.Resource.Audio.getShowAnswerSound());
        canClickShowAnswer = true;
        $('.word-container .word, .picture-container .word').each(function() {
            var wordID = $(this).attr('data-id');
            var wordDOM = $(this);
            $('.picture-container .img-main').each(function() {
                var picID = $(this).attr('data-id');
                if ((parseInt(picID) + 7) == wordID) {
                    $(this).after(wordDOM);
                    return false;
                }
            });
        });
        $('.picture-container .word').stop(true, true).fadeOut(500).fadeIn(500);
        $(".word-container").html("");
    });

    //get Result
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function() {
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) & (numberOfGroup > 1)){
            unShowClickResult++;
            if(unShowClickResult == 1){
                $('.overlay-black').show();
                $('#multipage-confirm-dialog').fadeIn(500);
            }
        }
        else{
            loadResult();
        }
    });
    
    $("#redo").click(function() {
        unShowClickResult = 0;
        numViewedPage = 0;
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
            
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            $("#groups-container").html("");
            $(".word-container").html("");
            $('.global-tab-container').html("");
            displayActivity();
            canPlay = true;
            canClickShowAnswer = false;
        });
    });
    
    function makeImageSameSize() {
        // Cho ảnh hiển thị cùng 1 size
        var img = new Image();
        img.src = pictures[0].link;
        img.onload = function() {
            var newWrapperHeight = (img.height * $('.picture-container .wrapper:first').width() / img.width);
            $('.picture-container .wrapper').height(newWrapperHeight);
        };
    }
    
    function moveToTab(index) {
        numViewedPage++;
        $('.global-tab-container').ucanMoveToTab(index);
        $('.concrete-group.order' + index).stop(true, true).fadeIn(500).siblings('.concrete-group').hide();
    }
    
    function editGUI() {
        $('#groups-container .concrete-group').each(function() {
            var maxHeight = Math.max($(this).children('.word-container').height(), $(this).children('.picture-container').height());
            $(this).css('min-height', maxHeight + 4);
        });
    }
});

function loadResult(){
    if (!canPlay) {
        return;
    }
    canPlay = false;
    $('.ui-draggable').draggable("disable");
        
    playSound(Ucan.Resource.Audio.getShowResultSound());
    numberOfTrueAnswers = 0; //reset after clicking result
    $(".picture-container .wrapper").each(function() {
        if ($(this).children('.word').size() > 0) {
            var picID = $(this).children('.img-main').attr("data-id");
            var wordID = $(this).find('.word').attr("data-id");
            var isCorrect = false;
            for (var j = 0; j < keys.length; j++) {
                if (picID == keys[j].picID && wordID == keys[j].wordID) {
                    isCorrect = true;
                    break;
                }
            }
            if (isCorrect){	
                numberOfTrueAnswers++;
                $(this).prepend(Ucan.Resource.Image.getIconTrueWithoutShadow());
            } else {
                $(this).prepend(Ucan.Resource.Image.getIconFalseWithoutShadow());
            }
        } else {
            $(this).children().first().before(Ucan.Resource.Image.getIconFalseWithoutShadow());
                
        }
    });
        
    $('.picture-container img.true, .picture-container img.false').css({
        'margin-top' : function() {
            return ($(this).parent('.wrapper').height() - 40 - $(this).height()) / 2;
        }
    });
    $('.wrapper .true, .wrapper .false').ucanAnimateTrueFalseIcon();
        
    $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + wordCount);
    score = Math.floor((numberOfTrueAnswers / wordCount) * 100);
    $("#score-text").text(score);
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
    canClickRedo = true;
}