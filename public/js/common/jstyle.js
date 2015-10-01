/**
 * Thêm icon hiển thị câu trả lời là đúng hay sai.
 * @param value true or false
 * @param afterObj đối tượng để insert vào sau nó
 */
function insertTrueFalseIconAfter(value, afterObj) {
    if (value) {
        $(afterObj).after(
            "  <img class='true-icon' src='" + baseUrl + "/themes/blueocean/img/true-false-tick-green-24.png'/>"
        );
    } else {
        $(afterObj).after(
            "  <img class='false-icon' src='" + baseUrl + "/themes/blueocean/img/true-false-cross-red-24.png'/>"
        );
    }
}

function insertTrueFalseIconBefore(value, beforeObj) {
        if (value) {
            $(beforeObj).before(
                "  <img class='true-icon' src='" + baseUrl + "/themes/blueocean/img/true-false-tick-green-24.png'/>"
            );
        } else {
            $(beforeObj).before(
                "  <img class='false-icon' src='" + baseUrl + "/themes/blueocean/img/true-false-cross-red-24.png'/>"
            );
        }
    }
    /**
     * Thêm icon hiển thị câu trả lời là đúng hay sai.
     * @param value true or false
     * @param pos vị trí để insert
     */
function insertTrueFalseIcon(value, pos) {
    if (value) {
        $(pos).append(
            "  <img class='true-icon' src='" + baseUrl + "/themes/blueocean/img/true-false-tick-green-24.png'/>"
        );
    } else {
        $(pos).append(
            "  <img class='false-icon' src='" + baseUrl + "/themes/blueocean/img/true-false-cross-red-24.png'/>"
        );
    }
}

    /**
     * Thêm icon (của fontawesome) hiển thị câu trả lời là đúng hay sai.
     * @param value true or false
     * @param pos vị trí để insert
     */
function insertTrueFalseIconFontawesome(value, pos) {
    if (value) {
        $(pos).append(
            '<i class="fa fa-check"></i>'
        );
    } else {
        $(pos).append(
            '<i class="fa fa-times"></i>'
        );
    }
}


/**
 * Chuẩn hóa chuỗi. Ví dụ: dolPHiN sẽ trở thành Dolphin
 * @param word từ cần được chuẩn hóa
 */
function normalizeSingleWord(word) {
    var s1 = word.substr(0, 1).toUpperCase();
    var s2 = word.substr(1, word.length).toLowerCase();
    return s1 + s2;
}

/**
 * So sánh 2 chuỗi sau khi trim() và biến thành lowerCase
 * @return true nếu bằng nhau. Ngược lại return false
 */
function compareTwoString(str1, str2) {
    if ($.trim(str1).toLowerCase() == $.trim(str2).toLowerCase()) {
        return true;
    }
    return false;
}

/**
 * Tính số lượng trang hoặc tab
 * @param total Tổng số các phần tử
 * @param amountEachPage số phần tử trong 1 trang
 * @return số trang
 */
function getPaginationAmount(total, amountEachPage) {
    if (total % amountEachPage == 0) {
        return Math.floor(total / amountEachPage);
    }
    return Math.floor(total / amountEachPage) + 1;
}

/**
 * Fade In lần lưọt từng phần tử với speed được truyền vào
 * @param arr 1 tập hợp các đối tượng jquery. Ví dụ $('.abc') hoặc mảng các
 * đối tượng jquery
 * @param speed tốc độ fadeIn
 */
function fadeInEachElementInTurn(arr, speed) {
    var index = 0;
    run();
    try {
        function run() {
            if (index == arr.length) {
                return;
            }
            $(arr).eq(index++).stop(true, true).fadeIn(speed, function() {
                run();
            });
        }
    } catch (exception) {
        console.log(exception);
    }
}

/**
 * Fade In lần lưọt từng phần tử với speed được truyền vào
 * @param arr 1 tập hợp các đối tượng jquery. Ví dụ $('.abc') hoặc mảng các
 * đối tượng jquery
 * @param speed tốc độ fadeIn
 * @param audio mảng chứa audio, có length bằng với mảng <b>arr</b>
 */
function fadeInEachElementInTurnWithAudio(arr, speed, audio) {
    var index = 0;
    return run();

    function run() {
        try {
            if (index == arr.length) {
                return;
            }
            playSound(audio[index]);
            $(arr).eq(index++).stop(true, true).fadeIn(speed, function() {
                run();
            });
        } catch (exception) {
            console.log(exception);
        }
    }
}



/**
 * Gom các khoảng trắng trong đoạn văn bằng 1 khoảng trắng và bỏ các khoảng trắng
 * ở hai đầu.
 * @param paragraph đoạn cần chuẩn hóa
 * @return đoạn văn sau khi được chuẩn hóa
 */
function normalizeSpace(paragraph) {
    var pattern = /\s+/g;
    return paragraph.replace(pattern, '');
}

/**
 * Bỏ tất cả các space trong String
 * @param str chuỗi cần bỏ khoảng trắng
 * @return chuỗi sau khi đã bỏ tất cả các khoảng trắng
 */
function removeSpace(str) {
    var pattern = /\s+/g;
    return str.replace(pattern, '');
}

/**
 * Dùng để encode một chuỗi.
 * Ví dụ dấu phẩy trong English khi so sánh nó sẽ là chuỗi linh tinh kiểu dạng *&^&%
 * Hàm này sẽ trả về kí tự đó lúc nguyên thủy
 * @param str chuỗi muốn encode
 */
function htmlEncode(str) {
    var sentenceHtml = '<div id="elem-for-decode-str">' + str + '</div>';
    $("body").append(sentenceHtml);
    var retStr = $("#elem-for-decode-str").text();
    $("#elem-for-decode-str").remove();
    return retStr;
}

/**
 * Để chuyển dấu &lt; thành {{{ và &gt; thành }}}
 * @param html đối tượng cần biến đổi
 */
function htmlToUcanMarkup(html) {
    return html.replace(/</g, '{{{').replace(/>/g, '}}}');
}

/**
 * Để chuyển dấu {{{ thành &lt; và }}} thành &gt;
 * @param markup đối tượng cần biến đổi
 */
function ucanMarkupToHtml(markup) {
    return markup.replace(/{{{/g, '<').replace(/}}}/g, '>');
}

/**
 * Xáo trộn 1 array
 */
function shuffle(array) {
    var tmp;
    var current;
    var top = array.length;
    if (top) {
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    }
    return array;
}

/**
 * Xáo trộn trong 1 tập hợp các phần tử HTML
 */
function shuffleHTMLElements(selector) {
    var size = $(selector).size();
    for (var i = 0; i < size / 2; i++) {
        var tmp = $(selector).eq(i);
        var ran = randomFromTo(0, size);
        eq(i).replaceWith(eq(ran));
        eq(ran).replaceWith(tmp);
    }
}

/**
 * Cho ảnh đậm từ 0.7 đến 1
 */
function animatePicture(objToAnimate) {
    $(objToAnimate).animate({
        "opacity": "0.5"
    }, 300, function() {
        $(this).animate({
            "opacity": "1"
        }, 1000);
    });
}

/**
 * Random trong 1 khoảng nào đó và có lấy 2 đầu mút. Ví dụ random 1 số trong
 * khoảng từ 10 đến 20 thì giá trị trả về có bao gồm 10 và 20
 */

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

/**
 * Kiểm tra có Flash ko
 */
function hasFlashPlugin() {
    if (swfobject.hasFlashPlayerVersion('9')) {
        return true;
    }
    return false;
}

/**
 * Ucan Object
 */
Ucan = {};

/**
 * Bao gồm các hàm liên quan đến xử lí Audio
 */
Ucan.Audio = {};

/**
 * Bao gồm các hàm liên quan đến xử lí Video
 */
Ucan.Video = {};

/**
 * Bao gồm các hàm liên quan đến xử lí Object
 */
Ucan.Object = {};

/**
 * Bao gồm các hàm liên quan đến xử lí String
 */
Ucan.String = {};

/**
 * Bao gồm các hàm liên quan đến xử lí Array
 */
Ucan.Array = {};

/**
 * Các function tự viết
 */
Ucan.Function = {};

/**
 * Các funtion liên quan tới việc điều hướng trang
 **/
Ucan.Function.Navigation = {};

/**
 * Các funtion liên quan tới HTML
 **/
Ucan.Function.HTML = {};

/**
 * Ucan Resource, chứa đường link tới ảnh, audio, video....
 */
Ucan.Resource = {};

/**
 * Chứa đường link tới các file audio
 */
Ucan.Resource.Audio = {};

/**
 * Chứa đường link tới các file ảnh
 */
Ucan.Resource.Image = {};

/**
 * Chứa các hằng số như tốc độ ẩn, hiện bảng result, số lần nhấp nháy icon xxx...
 */
Ucan.Constants = {};

/**
 * Tốc độ hiện bảng Result
 */
Ucan.Constants.getShowResultSpeed = function() {
    return 1000;
};

/**
 * Tốc độ ẩn bảng Result
 */
Ucan.Constants.getHideResultSpeed = function() {
    return 1000;
};

/**
 * Thời gian delay khi ko di chuột lên jScrollPane để nó biến mất
 */
Ucan.Constants.getDelayTimeJScrollPane = function() {
    return 600;
};

/**
 * Tốc độ hiện jScrollPane
 */
Ucan.Constants.getShowJScrollPaneSpeed = function() {
    return 0;
};

/**
 * Tốc độ ẩn jScrollPane
 */
Ucan.Constants.getHideJScrollPaneSpeed = function() {
    return 500;
};

/**
 * Tiếng cạch cạch
 * @return kiểu dữ liệu String - đường link tới file
 */
Ucan.Resource.Audio.getClickedSound = function() {
    return baseUrl + '/audio/partnersinrhyme_CLICK17C.mp3';
};

/**
 * Tiếng cạch cạch hơi xoạch xoạch :))
 * @return kiểu dữ liệu String - đường link tới file
 */
Ucan.Resource.Audio.getClickedSound2 = function() {
    return baseUrl + '/audio/partnersinrhyme_CLICK14A.mp3';
};

/**
 * Tiếng Ố Ồ như trong Pikachu
 * @return kiểu dữ liệu String - đường link tới file
 */
Ucan.Resource.Audio.getMissSound = function() {
    return baseUrl + '/audio/miss.mp3';
};

/**
 * Tiếng chíu chíu như trong trò Pikachu
 * @return kiểu dữ liệu String - đường link tới file
 */
Ucan.Resource.Audio.getHitSound = function() {
    return baseUrl + '/audio/hit.mp3';
};

/**
 * Tiếng kết quả đúng trong game answer và game picture khi click
 * @return kiểu dữ liệu String - đường link tới file
 */
Ucan.Resource.Audio.getCorrectSound = function() {
    return baseUrl + '/audio/correct.mp3';
};

/**
 * Tiếng xuất hiện bảng Result
 * @return kiểu dữ liệu String - đường link tới file
 */
Ucan.Resource.Audio.getShowResultSound = function() {
    return baseUrl + '/audio/show-result.mp3';
};

/**
 * Tiếng khi hiện đáp án
 * @return kiểu dữ liệu String - đường link tới file
 */
Ucan.Resource.Audio.getShowAnswerSound = function() {
    return baseUrl + '/audio/result_1.mp3';
};

/**
 * Dấu tick cho đáp án TRUE khi show result. Không có shadow
 * @return kiểu dữ liệu String - đường link tới ảnh
 */
Ucan.Resource.Image.getIconTrueWithoutShadow = function() {
    return '<img class="true" src="' + baseUrl + '/themes/blueocean/img/true-false-tick-white-108.png">';
};

/**
 * Dấu tick cho đáp án FALSE khi show result. Không có shadow
 * @return kiểu dữ liệu String - đường link tới ảnh
 */
Ucan.Resource.Image.getIconFalseWithoutShadow = function() {
    return '<img class="false" src="' + baseUrl + '/themes/blueocean/img/true-false-cross-white-108.png">';
};

/**
 * Chuyển sang bài tập kế tiếp
 */
Ucan.Function.Navigation.nextActivity = function() {
    if (nextActivityUrl) {
        window.location.replace(nextActivityUrl);
    }
};

/**
 * Tạo ra nền đen
 */
Ucan.Function.HTML.createOverlayBackground = function(mainObject, disableScroll) {
    if ($('#overlay-background').size() == 0) {
        var overlayBlock = $('<div id="overlay-background"></div>');
        overlayBlock.css({
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'background': 'black',
            'opacity': '0.8',
            'top': '0',
            'left': '0'
        });

        if (!disableScroll) {
            $('body').css('overflow', 'hidden');
        }

        $('body').append(overlayBlock);
    } else if ($('#overlay-background').css('display')) {
        $('#overlay-background').show();
    }
    $('body').append($(mainObject));
    var docWidth = $(document).width();
    var screenHeight = window.screen.height;

    $(mainObject).css({
        'position': 'fixed',
        'top': function() {
            return (screenHeight - $(mainObject).height()) / 4;
        },
        'left': function() {
            return (docWidth - $(mainObject).width()) / 2;
        }
    });

    return $('#overlay-background').on('click', function() {
        $(this).hide();
        $(mainObject).css('left', '-999999px');
        $('body').css('overflow', 'auto');
    });
};

Ucan.Function.HTML.hideOverlayBackground = function(overlay, mainObject, callBackFunction) {
    if (!overlay) {
        overlay = '#overlay-background';
    }
    $(overlay).hide();
    $(mainObject).css('left', '-999999px');
    if (typeof(callBackFunction) == 'function') {
        callBackFunction();
    }
};

/**
 * Thêm resource url cho media. Ví dụ, trước đây src của thẻ img là
 * src="/upload/...." thì bây h sẽ là src="http://ucan.vn/upload..."
 * @param {text} html đoạn text html
 * @return kiểu dữ liệu text, ko phải object nhé
 */
Ucan.Function.HTML.editMediaUrl = function(html) {
    if (!html || !$.trim(html)) {
        window.console.log('html code is null or empty');
        return html;
    }

    if (typeof(mediaUrl) != 'undefined') {
        resourceUrl = mediaUrl;
    }
    var u1 = html.replace(/"\/upload\//g, '"' + resourceUrl + '/upload/'); // img or ...
    var u2 = u1.replace(/=\/upload\//g, '=' + resourceUrl + '/upload/'); // sound

    return u2;
};

/**
 * Kiểm tra 1 đoạn html có nội dung không.
 * @return true nếu chỉ chứa các tag rỗng. Ví dụ: <p>   </p>
 */
Ucan.Function.HTML.isEmptyContent = function(html) {
    if (!html) {
        return true;
    }

    var wrap = $('<div></div>').append(html);

    if ($.trim(wrap.text()) !== '') {
        return false;
    }

    return true;
};

Ucan.Resource.Image.normalizeUrl = function(imgUrl) {
    return imgUrl.replace(/\/\//g, '/').replace(/\\\\/, '\\')
        .replace(/http:\//, 'http://')
        .replace(/https:\//, 'https://');
};

/**
 * Trả về code embed của youtube
 * Ví dụ link: <a href="#">http://www.youtube.com/watch?v=MLU6WgXejZc</a>
 * thì video code ở đây là <b>MLU6WgXejZc</b>
 * <p>Nếu không truyền width và height thì mặc định width=420px, height=315px</p>
 * @param link dữ liệu video.
 * @param width chiều rộng video muốn hiển thị.
 * @param height chiều cao muốn hiển thị.
 */
Ucan.Video.generateEmbedCode = function(link, width, height) {
    var w = width ? width : 420;
    var h = height ? height : 315;
    var embedCode;

    try {
        var splittedLink = Ucan.String.removeAllSpace(link).split(':');
        var type = parseInt(splittedLink[0]);
    } catch (exception) {
        console.log(exception);
    }

    switch (type) {
        case 0: // direct link
            embedCode = 'direct';
            break;
        case 1: // youtube
            embedCode = '<iframe width="' + w + '" height="' + h + '" src="http://www.youtube.com/embed/' + splittedLink[1] + '" frameborder="0" allowfullscreen></iframe>';
            break;
        default:
            break;
    }
    return embedCode;
};

/**
 * Bỏ tất cả các space trong String
 * @param str chuỗi cần bỏ khoảng trắng
 * @return chuỗi sau khi đã bỏ tất cả các khoảng trắng
 */
Ucan.String.removeAllSpace = function(str) {
    return str.replace(/\s+/g, '');
};

/**
 * Một câu writing có thể có nhiều đáp án. Ví dụ:
 * it's a dog === it is a dog => true.
 */
Ucan.String.checkWithMultiAnswers = function(answer, list) {
    if (!list || list.length === 0) {
        return false;
    }

    var correct = false;

    for (var i = 0; i < list.length; i++) {
        if (compareTwoString(answer, list[i])) {
            correct = true;
        }
    }

    return correct;
};

/**
 * Xóa phần tử khỏi mảng. Điều kiện: tất cả các phần tử phải chung kiểu dữ liệu
 * @returns mảng sau khi xóa
 */
Ucan.Array.deleteElement = function(element, elementList) {
    if (elementList && elementList.length > 0) {
        for (var i = 0; i < elementList.length; i++) {
            if (elementList[i] === element) {
                return elementList.splice(i, 1);
            }
        }
    }
};

/**
 * Trả về 1 object kế thừa các thuộc tính của mảng objects truyền vào
 */
Ucan.Object.extendObjects = function(objects) {
    if (!objects) {
        return null;
    }

    var result = {};
    for (var i = 0; i < objects.length; i++) {
        result = angular.extend(result, objects[i]);
    }

    return result;
};
