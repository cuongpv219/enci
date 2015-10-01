$(document).ready(function() {
    var imageWidth = 480;
    outputName = window.opener.callerObject.attr('data-outputsource');
    outputObject = window.opener.$('#' + outputName);
    pageInputName = outputName.replace('group___position___', 'group___page___');
    pageId = window.opener.$('#' + pageInputName).val();
    if (pageId == "") {
        alert('You need to enter page number first');
        window.close();
    }
    pId = parseInt(pageId) - 1;
        
    var src = window.opener.$('#page___map___' + pId).val();	
    if (src == "") {
        alert('You need to select map first');
        window.close();
    }
    
    if (window.opener.$('#page___markSize___' + pId).val() != "") {
        $('#mark-size').val(window.opener.$('#page___markSize___' + pId).val());
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
