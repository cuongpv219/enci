$(document).ready(function() {
    var imageWidth = 480;
    outputObject = window.opener.$('#' + window.opener.callerObject.attr('data-outputsource'));
    var src = window.opener.$('#map').val();	
    if (src == "") {
        alert('You need to select map first');
        window.close();
    }
    
    if (window.opener.$('#markSize').val() != "") {
        $('#mark-size').val(window.opener.$('#markSize').val());
    }
    
    if (outputObject.val() != "") {
        $('#position').val(outputObject.val());
    }
    
    $('#image-holder').html('<img id="map" src="' + src + '" alt="map" /><div id="mark">88</div>');
    var img = new Image();
    img.onload = function() {
        var rate = this.height/this.width; 
        $('#confirm').css('margin-top', rate * imageWidth + 20);
    }
    img.src = src;      
    
    var markSize = $('#mark-size').val();	
    var postion = $('#position').val();	
    
    $('#map').css({
        'width':imageWidth + 'px'
    });
    
    
    $('#mark').css({
        'width':markSize  + 'px',
        'height':markSize  + 'px',
        'font-size':Math.round(markSize*4/5) + 'px',
        'left': postion.split(':')[0] + 'px',
        'top': postion.split(':')[1] + 'px',
        'line-height':markSize  + 'px'
    });
    
    $('#mark').draggable({
        stop:function(event,ui){
            $('#position').val($('#mark').css('left').replace('px', '') + ':' + $('#mark').css('top').replace('px', ''));
        }
    });
    
    $('#confirm').click(function(){        
        outputObject.val($('#position').val());
        window.opener.$('#markSize').val($('#mark-size').val());
        window.close();
    })
})
