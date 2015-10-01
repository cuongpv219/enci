var choices = [];
var answers = [];
var canPlay = true;
var canClickRedo = false;
var unShowClickResult = 0;
var count;
var curTabIndex;
var pageNumber

// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
// var videoYtId = 'M7lc1UVf-VE';
var videoYt = activityContent.video.split(':');
var videoYtId = videoYt[1];
var specifyTimes = [];

for (var h = 0; h < activityContent.question.length; h++) {
    specifyTimes.push(activityContent.question[h].time);
};

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '250',
        width: '100%',
        videoId: videoYtId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 3. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // event.target.playVideo();
}

// 4. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
var timer;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        //player play
        timer = setInterval(
            function() {
                currentTime = player.getCurrentTime();
                for (var h = 0; h < specifyTimes.length; h++) {
                    if (Math.floor(currentTime) == parseInt(specifyTimes[h])) {
                        stopVideo();
                        activeQuestionBox();
                        $('#question-container_' + h).show().siblings().hide();
                        $('#sentence-button_' + h).addClass('selected').removeClass('unselected').siblings().removeClass('selected').addClass('unselected');
                    }
                }
            }, 1000);
    } else if (event.data == YT.PlayerState.ENDED) {
        activeQuestionBox();
        clearInterval(timer);
    } else {
        //player pause
        clearInterval(timer);
    }
}

function stopVideo() {
    player.stopVideo();
}

function playVideo() {
    player.playVideo();
}

function activeQuestionBox() {
    $('#question-box').show();
    $('#player').hide();
}

function inactiveQuestionBox() {
    $('#question-box').hide();
    $('#player').show();
}

// // Active nav-question in question box
// function navQuestionActive() {
//     $('#subtitle').hide();
//     $('#question-box').show();
//     $('#nav-question').addClass('nav-item-active').siblings().removeClass('nav-item-active');
// }

// // Active nav-subtitle in question box
// function navSubtitleActive() {
//     $('#subtitle').show();
//     $('#question-box').hide();
//     $('#nav-subtitle').addClass('nav-item-active').siblings().removeClass('nav-item-active');
// }

$(document).ready(function() {
    // $('#nav-subtitle').click(function() {
    //     navSubtitleActive();
    // });

    // $('#nav-question').click(function() {
    //     navQuestionActive();
    // });
    var numViewedPage = 0;
    count = activityContent.question.length; //number of questions
    pageNumber = 1;
    for (var i = 0; i < count; i++) {
        if (activityContent.question[i].page != undefined) {
            if (activityContent.question[i].page > pageNumber) {
                pageNumber = activityContent.question[i].page;
            }
        }
    }
    curTabIndex = 0;
    //check a word contain [#] or not
    function isAnswer(word) {
        if (word.indexOf("#") == 0) {
            return true;
        } else {
            return false;
        }
    }

    //normalize a word ( cut off [#] if necessary)
    function normalizedWord(word) {
        if (isAnswer(word) == false) {
            //alert('aaa');
            return word;
        } else {
            //alert('bbb');
            return word.substring(1)
        };
    }

    function moveToTab(index) {
        curTabIndex = parseInt(index);
        $('.global-tab-container').ucanMoveToTab(index);
        inactiveAllTabAndButton();
        activeTabAndButton(index);
        numViewedPage++;
    }

    function inactiveAllTabAndButton() {
        $('.question-container').hide();
    }

    function activeTabAndButton(index) {
        for (var i = 0; i < count; i++) {
            if (activityContent.question[i].page == undefined) {
                if (index == 0) {
                    $('#question-container_' + i).show();
                }
            } else if ((parseInt(activityContent.question[i].page) - 1) == index) {
                $('#question-container_' + i).show();
            }
        }
    }

    function insertOrder() {
        var orderChar = 0;
        for (var i = 0; i < pageNumber; i++) {
            for (var k = 0; k < count; k++) {
                if (activityContent.question[k].page == undefined) {
                    if (i == 0) {
                        $('#question-container_' + k + ' .order-char').html((++orderChar) + '.');
                    }
                } else {
                    if ((parseInt(i) + 1) == activityContent.question[k].page) {
                        $('#question-container_' + k + ' .order-char').html((++orderChar) + '.');
                    }
                }
            }
        }
    }

    function displayActivity() {
        var html = "";
        var buttonHtml = '';
        canPlay = true;
        choices = [];
        answers = [];
        for (var i = pageNumber - 1; i >= 0; i--) {
            buttonHtml += '<div id="sentence-button_' + (pageNumber - 1 - i) + '" data-order="' + (pageNumber - 1 - i) + '" class="inactive-button unselected"></div>';
        }
        for (i = 0; i < count; i++) {
            var ask = '';
            if (typeof activityContent.question[i].ask != undefined) {
                ask = activityContent.question[i].ask;
            }
            html += '<div id="notification_'+ i + '" class="notification">';
            html+='<div class="correct notification-box"><i class="fa fa-thumbs-o-up"></i><span>Đúng</span></div>';
            html+='<div class="incorrect notification-box"><i class="fa fa-thumbs-o-down"></i><span>Sai</span></div>';
            html+='</div>';
            var askArr = ask.split('[]');
            if (askArr[1] == undefined) {
                html += '<div id="question-container_' + i + '" class="question-container" ><span class="ask-container"><span class="order-char"></span>' + askArr[0] + '<span id="true-false-icon_' + i + '"></span></span>';
            } else {
                html += '<div id="question-container_' + i + '" class="question-container" ><span class="ask-container"><span class="order-char"></span>' + askArr[0] + '<span class="blank"> _______ </span>' + askArr[1] + '<span id="true-false-icon_' + i + '"></span></span>';
            }
            choices[i] = activityContent.question[i].choice.split("||");
            answers[i] = [];

            for (var j = 0; j < choices[i].length; j++) {
                html += '<div class="choice-container" id="choice-container_' + i + "_" + j + '" value="0">';
                html += '<div id="check_' + i + '_' + j + '" class="choice global-choice-square" value="0"></div>';
                html += '<span class="radio-label">' + normalizedWord(choices[i][j]) + '</span></div>';
                if (isAnswer(choices[i][j])) {
                    answers[i].push(j);
                }
            }
            html += '<div id="btn-submit_' + i + '" question-number="' + i + '" class="btn-submit-question btn btn-primary btn-lg btn-block">Trả lời</div>';
            html += '<div id="btn-redo_' + i + '" question-number="' + i + '" class="btn-redo-question btn btn-primary btn-lg btn-block">Làm lại</div>';
            html += '<div id="play-youtube-video_'+ i +'" class="play-youtube-video btn btn-primary btn-lg btn-block">Xem tiếp video</div>';
            html += '<div id="btn-show-answer_' + i + '" question-number="' + i + '" class="btn-show-answer btn btn-primary btn-lg btn-block">Xem đáp án</div>';
            html += '</div>';
        }
        $('#question-link').append(buttonHtml);
        $('#question-container').append(html);
        $('.inactive-button').click(function() {
            curTabIndex = parseInt($(this).attr('data-order'));
            // $('.notification').hide();
            $('#notification_'+curTabIndex).show().siblings().hide();
            moveToTab(curTabIndex);
        });
        if (pageNumber < 2) {
            // $('#question-link').hide();
            $('#next-link').hide();
            $('#prev-link').hide();
            $('#loadResult').css({
                'float': 'none',
                'margin': '0 auto'
            });
        }
        $('.choice-container').click(function() {
            if (!canPlay) return;
            if($(this).attr('value')==0) {
                $(this).attr('value','1');
                $(this).children('.choice').addClass('checked');
            }
            else {
                $(this).attr('value','0');
                $(this).children('.choice').removeClass('checked');
            }
        });
        $('.btn-submit-question').click(function() {
            // canPlay = false;
            numberQuestion = $(this).attr('question-number');
            $('#btn-redo_' + numberQuestion).show();
            $('#btn-submit_' + numberQuestion).hide();

            //ẩn các dấu true/false nếu có trong câu hỏi hiện tại nếu đã có
            $('#sentence-button_' + numberQuestion + ' i').hide();
            $('#notification_' + numberQuestion +' .notification-box').hide();
            
            //hiện nút xem tiếp video khi đã nhấn vào nút trả lời
            $('#play-youtube-video_' + numberQuestion).show();

            $('#btn-show-answer_' + numberQuestion).show();

            var inputValue = 0;
            var trueValue = 0;
            var choices = activityContent.question[numberQuestion].choice.split("||");
            for (var j = 0; j<choices.length;j++) {
                inputValue += ($('#choice-container_' + numberQuestion + '_' + j).attr("value") == "1")?Math.pow(2,j):0;
                trueValue += (isAnswer(choices[j]))?Math.pow(2,j):0;
            }
            if (inputValue == trueValue){
                insertTrueFalseIconFontawesome(true,'#sentence-button_' + numberQuestion);
                playSound(Ucan.Resource.Audio.getHitSound()); 
                $('#notification_' + numberQuestion).show();
                $('#notification_' + numberQuestion + ' .correct').show();
            }
            else {
                insertTrueFalseIconFontawesome(false,'#sentence-button_' + numberQuestion);
                playSound(Ucan.Resource.Audio.getMissSound()); 
                $('#notification_' + numberQuestion).show();
                $('#notification_' + numberQuestion + ' .incorrect').show();
            }
        });

        $('.btn-redo-question').click(function() {
            // canPlay = true;
            numberQuestion = $(this).attr('question-number');
            $('#btn-redo_' + numberQuestion).hide();
            $('#btn-submit_' + numberQuestion).show();
            $('#btn-show-answer_' + numberQuestion).hide();
            $('#play-youtube-video_' + numberQuestion).hide();
            $('#notification_' + numberQuestion +' .notification-box').hide();
            $('#question-container_'+ numberQuestion + ' .choice').removeClass('checked');
            $('#question-container_' + numberQuestion + ' .choice-container').attr('value', '0');
            $('#question-container_' + numberQuestion + ' i').remove();
        });

        $('.btn-show-answer').click(function() {
            playSound(Ucan.Resource.Audio.getShowAnswerSound());
            numberQuestion = $(this).attr('question-number');
            for (j = 0; j < answers[numberQuestion].length; j++) {
                $('#choice-container_' + numberQuestion + '_' + answers[numberQuestion][j]).append('<i class="fa fa-check"></i>');
            }
            $('#btn-show-answer_' + numberQuestion).hide();
        });

        $('.play-youtube-video').click(function() {
            inactiveQuestionBox();
            playVideo();
        });
        insertOrder();
    }

    $('.video-outer-click-result').hide();

    $("#multipage-confirm-dialog-button-no").click(function() {
        $('#my_player').show();
        $('.video-outer-click-result').hide();
    });

    $("#multipage-confirm-dialog-button-yes").click(function() {
        $('#my_player').show();
        $('.video-outer-click-result').hide();
    });

    $('#prev-link').click(function() {
        if (curTabIndex > 0) {
            moveToTab(--curTabIndex);
        }
    })
    $('#next-link').click(function() {
        if (curTabIndex < pageNumber - 1) {
            moveToTab(++curTabIndex);
        }
    })
    setTimeout(function() {
        displayActivity();
        moveToTab(0);
    }, 500)


    // $("#loadResult").click(function() {
    //     if (!canPlay) return;
    //     $(document).keyup(function(e) {
    //         if (e.keyCode == 13) {
    //             $('#multipage-confirm-dialog-button-no').click();
    //         }
    //     });
    //     if ((numViewedPage == 1) && (pageNumber > 1)) {
    //         $('#my_player').hide();
    //         $('.video-outer-click-result').show();
    //         unShowClickResult++;
    //         if (unShowClickResult == 1) {
    //             $('.overlay-black').show();
    //             $('#multipage-confirm-dialog').fadeIn(500);
    //         }
    //     } else {
    //         loadResult();
    //     }
    // });
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
            $("#question-container").html('');
            $("#question-link").html('');
            displayActivity();
            moveToTab(0);
            if ($f()) {
                $f().stop();
            }
            if ((activityContent.video.indexOf('1:') == 0)) {
                setTimeout(500, function() {
                    document.getElementById("my_player").pauseVideo()
                });
            }
        })
    });

});

