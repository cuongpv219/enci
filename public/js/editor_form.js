$(document).ready(function() {
    count = 0;
    $('.editor-form-element-group').each(function() {
        id = $(this).attr('id');
        group = id.substring(9, id.indexOf('___'));
        $(this).prepend('<div class="editor-form-element-group-numbering" id="editor-form-element-group-numbering-' + group + 
            '___' + (count) + '">' + (count + 1) + '</div>');
        count++;
        if ($('#fieldset-' + group + '___' + count).length == 0) {
            count = 0;
        }
    });
        
    $('.global_repeat_add_button').click(function() {
        group = $(this).attr('data-source');
        numOfGroups = $(this).parent().parent().children().size() - 1;
        clonedGroup = $('#fieldset-' + group + '___0').clone();
        cloneDescendants = clonedGroup.find("*");
        newId = clonedGroup.attr("id").replace("___0", "___" + numOfGroups);
        clonedGroup.attr("id", newId);
        names = [];
        $.each(cloneDescendants, function() {					
            if ($(this).attr('type') != 'radio' 
                    && $(this).attr('type') != 'checkbox' && $(this).attr('type') != 'select') {
                $(this).attr("value", "");
            }
            attributes = $(this).getAttributes();
            for (attr in attributes) {
                if (attributes[attr] != "") {
                    value = attributes[attr];
                    newValue = value.replace("___0", "___" + numOfGroups);
                    if (newValue != value) {
                        $(this).attr(attr, newValue);
                    }
                }
            }
            if ($(this).hasClass('ckeditor-input')) {
                names[names.length] = $(this).attr('name');
                $(this).next().remove();
                $(this).show().css('visibility', 'visible');
            }
        });
        clonedGroup.children('#editor-form-element-group-numbering-' + group + '___' + numOfGroups).html((numOfGroups + 1));
        $(this).parent().before(clonedGroup);
        
        for (i = 0; i < names.length; i++) {
            var editor = CKEDITOR.replace(names[i],{
			extraPlugins : 'audioplayer',
			toolbar :
			[
                            { name: 'document',    items : [ 'Source','-','Preview','Templates' ] },
                            { name: 'clipboard',   items : [ 'Undo','Redo' ] },
                            { name: 'editing',     items : [ 'SpellChecker', 'Scayt' ] },
                            { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
                            { name: 'paragraph',   items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
                            { name: 'links',       items : [ 'Link','Unlink' ] },
                            { name: 'insert',      items : [ 'Image','Table','SpecialChar','PageBreak' ] },
                            '/',
                            { name: 'styles',      items : [ 'Styles','Format','Font','FontSize' ] },
                            { name: 'colors',      items : [ 'TextColor','BGColor' ] },
                            { name: 'tools',       items : [ 'Maximize', 'ShowBlocks' ] },
                            { name: 'plugins',     items : [ 'Audioplayer'] }
			]
		});
            CKFinder.setupCKEditor(editor, uploadPath) ;
        }
    });
    
    $('.global_repeat_delete_last_button').click(function() {
        group = $(this).attr('data-source');
        numOfGroups = $(this).parent().parent().children().size() - 1;
        if (numOfGroups == 1) {
            return;
        }
        cloneDescendants = $('#fieldset-' + group + '___' + (numOfGroups - 1)).find("*");
        $.each(cloneDescendants, function() {					
            if ($(this).hasClass('ckeditor-input')) {
                if ($(this).attr('name') in CKEDITOR.instances) {
                    CKEDITOR.instances[$(this).attr('name')].destroy();
                }
            }
        });
        $('#fieldset-' + group + '___' + (numOfGroups - 1)).remove();
    });
});