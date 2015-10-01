curEditIndex = -1;
$(document).ready(function() {
    outputName = window.opener.callerObject.attr('data-outputsource');    
    outputObject = window.opener.$('#' + outputName);       
    curText = outputObject.val();
    
    if (curText != ''){
        choiceArr = curText.split('||');
        var listHtml = '';
        for(var i = 0; i< choiceArr.length; i++){
            elementArr = choiceArr[i].split('--');
            isAnswer = ($.trim(elementArr[0]).indexOf("#") == 0);
            choiceText = isAnswer?($.trim(elementArr[0])).substring(1):$.trim(elementArr[0]) ;
            explanation = elementArr.length > 1 ? elementArr[1] : '';
            listHtml += '<div class="choice-item" id="choice-item-' + i + '" data-index="' + i + '">\n\
                <input type="radio" name="answer" value="' + i + '" ' + (isAnswer?'checked':'') + ' /> \n\
                <span class="choice-item-text choice-item-cell">' + encodeHighlight(choiceText) + '</span>\n\
                <span class="choice-item-explanation choice-item-cell">' + encodeHighlight(explanation) + '</span>\n\
                <span class="choice-item-edit choice-item-cell">Edit</span>\n\
                <span class="choice-item-delete choice-item-cell">Delete</span>\n\
            </div>';
        }
        $('#choice-list').html(listHtml);
        $('#number-of-choices').text(choiceArr.length);
    }
    
    $('.choice-item-edit').click(editChoice);
    $('.choice-item-delete').click(deleteChoice);

    $('#add_choice_submit_button').click(function(){
        if($('#add_choice_text').val() == '') return;
        if (curEditIndex != -1){
            $('#choice-item-' + curEditIndex).children('.choice-item-text').html(encodeHighlight($('#add_choice_text').val()));
            $('#add_choice_text').val('');
            $('#choice-item-' + curEditIndex).children('.choice-item-explanation').html(encodeHighlight($('#add_choice_explanation').val()));
            $('#add_choice_explanation').val('');
            $('#choice-item-' + curEditIndex).children('.choice-item-edit').text('Edit');
            $('#add_chocie_submit_button').attr('value','Add choice')
            curEditIndex = -1;
        } else {
            index = parseInt($('#choice-list').children().last().attr('data-index')) + 1;
            slideHtml = '<div class="choice-item" id="choice-item-' + index + '" data-index="' + index + '">\n\
                <input type="radio" name="answer" value="' + index + '" /> \n\
                <span class="choice-item-text choice-item-cell">' + encodeHighlight($('#add_choice_text').val()) + '</span>\n\
                <span class="choice-item-explanation choice-item-cell">' + encodeHighlight($('#add_choice_explanation').val()) + '</span>\n\
                <span class="choice-item-edit choice-item-cell">Edit</span>\n\
                <span class="choice-item-delete choice-item-cell">Delete</span>\n\
            </div>';
            $('#choice-list').append(slideHtml);
            $('#choice-list').children().last().children('.choice-item-edit').click(editChoice);
            $('#choice-list').children().last().children('.choice-item-delete').click(deleteChoice);
            $('#add_choice_text').val('');
            $('#add_choice_explanation').val('');
            $('#number-of-choices').text($('#choice-list').children().length);
        }
    })

    function editChoice(){
        curEditIndex = $(this).parent().attr('data-index');
        $('.choice-item-edit').text('Edit');
        $(this).text('Editting');
        $('#add_choice_text').val(decodeHighlight($(this).siblings('.choice-item-text').html()));
        $('#add_choice_explanation').val(decodeHighlight($(this).siblings('.choice-item-explanation').html()));
        $('#add_choice_submit_button').attr('value','Finish edit');
    }
     
    function deleteChoice(){
        if (curEditIndex != -1) return;
        $(this).parent().remove();
        $('#number-of-choices').text($('#choice-list').children().length);
    } 
    
    $('#confirm').click(function(){        
        retStr = "";
        ans = $('input:radio[name=answer]:checked').val();
        $('.choice-item').each(function(){
            retStr += '||' + ($(this).attr('data-index') == ans?'#':'') + decodeHighlight($(this).children('.choice-item-text').html()) + 
                ($(this).children('.choice-item-explanation').text()==''?'':'--' + decodeHighlight($(this).children('.choice-item-explanation').html()));
        })        
        retStr = retStr.length>2 ? retStr.substr(2):'';
        outputObject.val(retStr);
        window.close();
    })
    
    function encodeHighlight(str) {
        return str.replace('<<', '<span class="global-highlight-orange">').replace('>>','</span>');
    }
    
    function decodeHighlight(str) {
        return str.replace('<span class="global-highlight-orange">','<<').replace('</span>','>>');
    }
})
