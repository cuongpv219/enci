
$(document).ready(function(){
    $('#program_id').on('change', function() {
        var optionSelected = $(this).find("option:selected");
        var valueSelected  = optionSelected.val();
        var textSelected   = optionSelected.text();
        if($('#curr-element').length > 0) {
            $('#curr-element').remove();
        }
        $("<dd id='curr-element'></dd>").insertAfter($(this).parent());
        showList(valueSelected, ids, starts, ends);
        //console.log(valueSelected + textSelected);
    });
    var selected = $(this).find("option:selected");
    var id  = selected.val();
    if(parseInt(id) !== 'NaN') {
        $("<dd id='curr-element'></dd>").insertAfter($('#program_id-element'));
        showList(id, ids, starts, ends);
    }
});

function showList(id, ids, starts, ends) {
    $('#curr-element').append('<ul></ul>');
    $.get(currUrl+"getobjs/id/"+id, function(data, status){
        if(status == 'success') {
            var objs = jQuery.parseJSON(data).data;
            var select = false;
            var starting = ending = checked = '';
            for(var i=0; i<objs.length; i++) {
                for(var j=0; j<ids.length; j++) {
                    console.log('sel true:', ids[j], objs[i]);
                    if(ids[j] == objs[i].id) {
                        select = true;
                        starting = starts[j];
                        ending = ends[j];
                        break;
                    }
                }
                if(select) {
                    checked = 'checked="checked"';
                } else {
                    checked = '';
                }
                var elm = '<li>';
                elm += '<div class="curr-elm"><input class="input-checkbox" type="checkbox" '+checked+' name="currId[]" value="'+objs[i].id+'"/>'+objs[i].title+'</div>';
                elm += '<div class="curr-elm">Starting time<input class="input-starting" type="text" name="starting'+objs[i].id+'" value="'+starting+'"/></div>';
                elm += '<div class="curr-elm">Ending time<input class="input-ending" type="text" name="ending'+objs[i].id+'" value="'+ending+'"/></div>';
                elm += '</li>';
                $('#curr-element ul').append(elm);
                $('.input-starting').datetimepicker({
                                        format:'d.m.Y H:i',
                                        step:5
                                    });
                $('.input-ending').datetimepicker({
                                        format:'d.m.Y H:i',
                                        step:5
                                    });
                select = false;
                starting = ending = checked = '';
            }
        }
    });
}