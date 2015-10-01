$(document).ready(function() {
    var imageWidth = 480;
    outputName = window.opener.callerObject.attr('data-outputsource');
    tempArr = outputName.split("___");
    curId = tempArr[tempArr.length - 1];
    outputObject = window.opener.$('#' + outputName);
    parentOrder = window.opener.$('#group___parent_id___' + curId).val();
    console.log(parentOrder);
    parentId = '';
    for(var i = 0; i< curId; i++){
        if (window.opener.$('#group___id___' + i).val() == parentOrder) {
            parentId = i;
            break;
        }
    }
    
    if (parentOrder == "") {
        alert('Order of parent picture required');
        window.close();
    }
    var src = window.opener.$('#group___picture___' + parentId).val();	
    if (src == "") {
        alert('Picture of parent required');
        window.close();
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
    
    var markSize = 20;	
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
        window.close();
    })
})
