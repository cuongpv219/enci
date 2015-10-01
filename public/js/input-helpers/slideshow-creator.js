curEditIndex = -1;
$(document).ready(function() {
    outputName = window.opener.callerObject.attr('data-outputsource');    
    outputObject = window.opener.$('#' + outputName);       
    curText = outputObject.val();
    
    if (curText != ''){
        slideArr = curText.split('||');
        var listHtml = '';
        for(var i = 0; i< slideArr.length; i++){
            elementArr = slideArr[i].split('--');
            imgUrl = elementArr[0];
            description = elementArr.length > 1 ? elementArr[1] : '';
            listHtml += '<div class="slide-item" id="slide-item-' + i + '" data-index="' + i + '"> \n\
                <img class="item-picture slide-item-cell" src="' + imgUrl + '">\n\
                <span class="slide-item-description slide-item-cell">' + description + '</span>\n\
                <span class="slide-item-edit slide-item-cell">Edit</span>\n\
                <span class="slide-item-delete slide-item-cell">Delete</span>\n\
            </div>';
        }
        $('#slide-list').html(listHtml);
        $('#number-of-slides').text(slideArr.length);
    }
    
    $('.slide-item-edit').click(editSlide);
    $('.slide-item-delete').click(deleteSlide);

    $('#add_slide_submit_button').click(function(){
        if($('#add_slide_image').val() == '') return;
        if (curEditIndex != -1){
            $('#slide-item-' + curEditIndex).children('img').attr('src',$('#add_slide_image').val());
            $('#add_slide_image').val('');
            $('#slide-item-' + curEditIndex).children('.slide-item-description').text($('#add_slide_description').val());
            $('#add_slide_description').val('');
            $('#slide-item-' + curEditIndex).children('.slide-item-edit').text('Edit');
            $('#add_slide_submit_button').attr('value','Add slide')
            curEditIndex = -1;
        } else {
            index = parseInt($('#slide-list').children().last().attr('data-index')) + 1;
            slideHtml = '<div class="slide-item" id="slide-item-' + index + '" data-index="' + index + '"> \n\
                <img class="item-picture slide-item-cell" src="' + $('#add_slide_image').val() + '">\n\
                <span class="slide-item-description slide-item-cell">' + $('#add_slide_description').val() + '</span>\n\
                <span class="slide-item-edit slide-item-cell">Edit</span>\n\
                <span class="slide-item-delete slide-item-cell">Delete</span>\n\
            </div>';
            $('#slide-list').append(slideHtml);
            $('#slide-list').children().last().children('.slide-item-edit').click(editSlide);
            $('#slide-list').children().last().children('.slide-item-delete').click(deleteSlide);
            $('#add_slide_image').val('');
            $('#add_slide_description').val('');
            $('#number-of-slides').text($('#slide-list').children().length);
        }
    })

    function editSlide(){
        curEditIndex = $(this).parent().attr('data-index');
        $('.slide-item-edit').text('Edit');
        $(this).text('Editting');
        $('#add_slide_image').val($(this).siblings('img').attr('src'));
        $('#add_slide_description').val($(this).siblings('.slide-item-description').text());
        $('#add_slide_submit_button').attr('value','Finish edit');
    }
     
    function deleteSlide(){
        if (curEditIndex != -1) return;
        $(this).parent().remove();
        $('#number-of-slides').text($('#slide-list').children().length);
    } 
    
    $('#confirm').click(function(){        
        retStr = "";
        $('.slide-item').each(function(){
            retStr += '||' + $(this).children('img').attr('src') + 
                ($(this).children('.slide-item-description').text()==''?'':'--' + $(this).children('.slide-item-description').text());
        })        
        retStr = retStr.length>2 ? retStr.substr(2):'';
        outputObject.val(retStr);
        window.close();
    })
})
