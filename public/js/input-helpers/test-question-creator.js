$(document).ready(function() {
    outputName = window.opener.callerObject.attr('data-outputsource');
    outputObject = window.opener.$('#' + outputName);       
    curText = outputObject.val();
    if (curText != '') {
        try
        {
            var obj = JSON.parse(curText);
            $('input[name="type"][value="' + obj.type + '"]').attr('checked',true);
            for(var key in obj){
                if (key != 'type') {
                    $('.input-form[data-value="' + obj.type + '"] input[data-name="' + key + '"]').val(obj[key]);
                    $('.input-form[data-value="' + obj.type + '"] textarea[data-name="' + key + '"]').val(obj[key]);
                }
            }
            $('.input-form[data-value="' + obj.type + '"]').show();
        }
        catch(e)
        {
            console.log(e);
        }
    } else if (outputName != 'group___question___0') {
        //get previous data
        var index = parseInt(outputName.replace('group___question___',''));
        prevObject = window.opener.$('#group___question___' + (index-1));       
        prevText = prevObject.val();
        if (prevText != '') {
            try
            {
                var prevObj = JSON.parse(prevText); 
                if (prevObj.type != 0) {
                    $('input[name="type"][value="' + prevObj.type + '"]').attr('checked',true);            
                    $('.input-form[data-value="' + prevObj.type + '"]').show();   
                    if (prevObj.type == 7){
                        $('#marktrueanswer-choices').val(prevObj.choices.replace('#',''));
                    }
                } else {
                    $('input[name="type"][value="0"]').parent().hide();
                }                
            }
            catch(e)
            {
                console.log(e);
            }
        }
    }
    
    if (outputName == 'group___question___0'){
        $('input[name="type"][value!="0"]').parent().hide();
        $('input[name="type"][value="0"]').attr('checked',true);            
        $('.input-form[data-value="0"]').show();
    } 
    
    $('.activity-type-select-box').click(function(){
        $(this).children('input').attr('checked',true);
        $('.input-form').hide();
        $('.input-form[data-value="' + $(this).children('input').attr('value') + '"]').show();
    });

    $('#confirm').click(function(){
        var retStr = '';
        var retObj = new Object();
        retObj.type = $('input:radio[name=type]:checked').val(); 
        $('.input-form[data-value=' + retObj.type + '] input, .input-form[data-value=' + retObj.type + '] textarea').each(function(){
            if ($(this).attr('data-name')) {
                var cke = CKEDITOR.instances[$(this).attr('name')];
                if ($(this).val() && !cke) {
                    retObj[$(this).attr('data-name')] = $(this).val();                
                }                
                if (cke && cke.getData()) {
                    retObj[$(this).attr('data-name')] = cke.getData(); 
                }
            }
        })
        retStr = JSON.stringify(retObj, null, 2);
        console.log(retStr);
        outputObject.val(retStr);
        window.close();
    });
})
