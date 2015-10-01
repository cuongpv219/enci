var slideId = 0;
var curTabIndex = 0;
var clicked = 0;

for (var i = 0; i < activityContent.group.length; i++) {
    activityContent.group[i].reading = Ucan.Function.HTML.editMediaUrl(activityContent.group[i].reading);
}

function timedCount() {
    nextSlide();
    timer = setTimeout("timedCount()", 5000);

}

function nextSlide() {
    curId = curTabIndex;
    var numOfSlide = $('#slideshow-' + curId + ' .slideshow-pictures-wrapper').length;
    if (numOfSlide == 0)
        return;
    $('#slideshow-' + curId + ' .slideshow-pictures-wrapper').eq(slideId).fadeOut(500, function() {
        $('#slideshow-' + curId + ' .slideshow-pictures-wrapper').hide();
        slideId = (slideId >= numOfSlide - 1) ? 0 : slideId + 1;
        $('#slideshow-' + curId + ' .slideshow-pictures-wrapper').eq(slideId).fadeIn(500);
    });

}

function prevSlide() {
    var numOfSlide = $('#description-wrapper-' + curId + ' .slideshow-pictures-wrapper').length;
    if (numOfSlide == 0)
        return;
    $('#description-wrapper-' + curId + ' .slideshow-pictures-wrapper').eq(slideId).fadeOut(500, function() {
        slideId = (slideId == 0) ? numOfSlide - 1 : slideId - 1;
        $('#slideshow-' + curId + ' .slideshow-pictures-wrapper').eq(slideId).fadeIn(500);
    });
}

$(document).ready(function() {
    var count = activityContent.group.length;
    function moveToTab(index) {
        $('.global-tab-container').ucanMoveToTab(index);
        if (index == -1) {
            $('#sentence-button_' + index).addClass('selected');
        }
        inactivateAllTabAndNavigatorButton();
        curTabIndex = parseInt(index);
        activeTabAndButton(index);
    }
    function inactivateAllTabAndNavigatorButton() {
        $('.audio-container div').hide();
        $('#picture-board').children().hide();
        $('#lession-content').hide();
        $('#intro-container').hide();
        $('.home-img').attr("src", baseUrl + '/themes/blueocean/img/home-tab-inactive-icon.png');
    }

    function activeTabAndButton(index) {

        $('#next-link').hide();
        $('#prev-link').hide();
        $('#startNow').show();
        if (index != -1) {
            $('#startNow').hide();
            $('#next-link').show();
            $('#paragraph-container').show();
            $('#prev-link').show();
            $('#pixelout-player-' + index).show();
            $('#paragraph-container_' + index).show();
            $('#picture-' + index).show();
            $('#video-' + index).show();
            $('#slideshow-' + index).show();
            $('#lession-content').html(activityContent.group[index].reading).show();

        }
        else {
            $('#paragraph-container').hide();
            $('#paragraph-container_' + index).hide();
            $('#intro-container').show();
            $('.home-img').attr("src", baseUrl + '/themes/blueocean/img/home-tab-active-icon.png');
        }
    }
    function displayActivity() {
        $('#paragraph-container').hide();
        var buttonHtml = "";
        for (var i = 0; i < count; i++) {
            buttonHtml += '<div id="sentence-button_' + (count - i - 1) + '" data-order="' + (count - i - 1) + '" class="inactive-button unselected">' + '<span>' + (count - i) + '</span></div>';
        }
        buttonHtml += '<div id="sentence-button_' + (-1) + '" data-order="' + (-1) + '"class="inactive-button">' + '<img class="home-img" src="' + baseUrl + '/themes/blueocean/img/home-tab-inactive-icon.png"/></div>';
        buttonHtml += '<div id="lession-title">' + activityContent.lession_title + '</div>';
        $('#paragraph-number').append(buttonHtml);
        $('#intro-title').append(activityContent.lession_title_detail);
        $('#intro-example').append(activityContent.lession_example.replace(/\[\[/g, '<span class="exactly">').replace(/\]\]/g, '</span>'));
        $('.inactive-button').click(function() {
            var id = $(this).attr('data-order');
            moveToTab(id);
        });
        $('#next-link').click(function() {
            if (curTabIndex < count - 1) {
                moveToTab(curTabIndex + 1);
            }
        });
        $('#prev-link').click(function() {
            if (curTabIndex > -1) {
                moveToTab(curTabIndex - 1);
            }
        });
        $('#sentence-button_-1').hover(function() {
            $('.home-img').attr("src", baseUrl + '/themes/blueocean/img/home-tab-active-icon.png');
        }, function() {
            if (curTabIndex != -1)
                $('.home-img').attr("src", baseUrl + '/themes/blueocean/img/home-tab-inactive-icon.png');
        })
        $('#startNow').click(function() {
            moveToTab(0);
        })
        $('.description-slideshow').each(function() {
            $(this).children('.slideshow-pictures-wrapper').first().show();
        });
        $('.slideshow-navigator-prev').click(function() {
            prevSlide();
        });

        $('.slideshow-navigator-next').click(function() {
            clicked = 1;
            $('#slideshow-' + curId + ' .slideshow-pictures-wrapper').stop(true, true);
            nextSlide();
        });
    }
    displayActivity();
    moveToTab(-1);
    timedCount();
})

