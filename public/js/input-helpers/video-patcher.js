curEditIndex = -1;
$(document).ready(function() {
    outputName = window.opener.callerObject.attr('data-outputsource');    
    
    outputObject = window.opener.$('#' + outputName);       
    curText = outputObject.val();
    $('#confirm').click(function(){        
        retStr = "";
        if($('#add_video_description').val() == "") 
        {
            outputObject.val('0:'+$('#add_video_image').val());
        }
        else {
            var linkyoutube = $('#add_video_description').val();
            if(linkyoutube.indexOf('v=', 0) != -1) {
                linkyoutube = linkyoutube.split('v=')[1].split('&')[0];
                outputObject.val('1:'+linkyoutube);
            }
            else if(linkyoutube.indexOf('youtu.be',0) != -1){
                linkyoutube = linkyoutube.split('youtu.be/')[1];
                outputObject.val('1:'+linkyoutube);
            }
        }
        window.close();
    })
})
