var curId;
var slideId = 0;
var timer;
var assArr = [];

function timedCount(){
    nextSlide();
    timer = setTimeout("timedCount()",5000);    
}

function nextSlide(){
    var numOfSlide = $('#description-wrapper-' + curId + ' .slideshow-pictures-wrapper').length;
    if (numOfSlide == 0) return;
    $('#description-wrapper-' + curId + ' .slideshow-pictures-wrapper').eq(slideId).fadeOut(500,function(){
        slideId = (slideId >= numOfSlide - 1)?0:slideId + 1;
        $('#description-wrapper-' + curId + ' .slideshow-pictures-wrapper').eq(slideId).fadeIn(500);
    });    
}

function prevSlide(){
    var numOfSlide = $('#description-wrapper-' + curId + ' .slideshow-pictures-wrapper').length;
    if (numOfSlide == 0) return;
    $('#description-wrapper-' + curId + ' .slideshow-pictures-wrapper').eq(slideId).fadeOut(500,function(){
        slideId = (slideId == 0)?numOfSlide - 1:slideId - 1;
        $('#description-wrapper-' + curId + ' .slideshow-pictures-wrapper').eq(slideId).fadeIn(500);
    });
}

$(document).ready(function() {	
    function displayActivity() {
        updateElementState();
    }
    
    function updateElementState() {
        $('.map-wrapper').hide();
        $('.description-wrapper').hide();
        if (assArr[curId].picture == undefined) {
            $('#map-wrapper-' + assArr[curId].parent_id).show();
        } else {
            $('#map-wrapper-' + curId).show();            
        }
        $('#description-wrapper-' + curId).show();
        if (curId == rootId) {
            $('#back-button').hide();
        } else {
            $('#back-button').show();
        }
        
        // Thay doi border
        if ($('#maps-container').height() > $('#description-container').height()) {
            $('#maps-container').css('border-right-width','1px');
            $('#description-container').css('border-left-width','0px');
        } else {
            $('#maps-container').css('border-right-width','0px');
            $('#description-container').css('border-left-width','1px');
        }
        // Thay doi mau cua mark
        $('.mark[data-target="' + curId + '"]').addClass('mark-selected');
        
        // Tinh Path to root
        var path = assArr[curId].name;
        var setId = curId;
        while(setId != rootId) {
            setId = assArr[setId].parent_id;
            path = assArr[setId].name + ' > ' + path;
        }
        $('#path-to-root').text(path);
    }
    
    var canPlay = true;
    var count = activityContent.group.length; //number of word groups
    var rootId;     
    for (var i = 0; i< count; i++){
        if (activityContent.group[i].parent_id == undefined) {
            rootId = parseInt(activityContent.group[i].id);
        }        
        assArr[activityContent.group[i].id] = activityContent.group[i];
        if (activityContent.group[i].position != undefined) {
            var posX = activityContent.group[i].position.split(':')[0];
            var posY = activityContent.group[i].position.split(':')[1];
            $('#map-wrapper-' + activityContent.group[i].parent_id).append('<div class="mark" style="left: ' + posX + 'px; top: ' + posY + 'px; " data-target="' + activityContent.group[i].id + '"></div>');        
            if (activityContent.group[i].name != undefined) {
                $('#map-wrapper-' + activityContent.group[i].parent_id).append('<div class="mark-label" style="left: ' + posX + 'px; top: ' + posY + 'px; ">' + activityContent.group[i].name + '</div>');        
            }
        }        
    }
    curId = rootId;
    $('.description-slideshow').each(function(){
        $(this).children('.slideshow-pictures-wrapper').first().show();
    });
    
    $('#back-button').click(function(){
        curId = assArr[curId].parent_id;
        updateElementState();
    });
    
    $('.description-audio-speaker').click(function(){
        playSound(resourceUrl + '/audio/' + assArr[curId].audio);
    });
    
    $('.mark').click(function(){
        curId = parseInt($(this).attr('data-target'));
        updateElementState();
    });
    
    $('.slideshow-navigator-prev').click(function(){
        prevSlide();
    });
    
    $('.slideshow-navigator-next').click(function(){
        nextSlide();
    });
    
    displayActivity();
    timedCount();
    
    $('#description-container').ucanEditMediaUrl();
});