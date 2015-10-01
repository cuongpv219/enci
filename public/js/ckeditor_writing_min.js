$(document).ready(function() {
    ckEditorTextareas = $('.ckeditor-input');
    ckEditorTextareas.each(function() {
        var editor = CKEDITOR.replace($(this).attr('id'),{
			toolbar :
			[
                            { name: 'basicstyles', items : [ 'Bold','Italic'] },
                            { name: 'paragraph',   items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
			]
		});
    });
    CKEDITOR.config.entities_latin = false;
    CKEDITOR.config.resize_enabled = false;
    CKEDITOR.config.height = '400px';
    CKEDITOR.config.forcePasteAsPlainText = true;
    CKEDITOR.config.removeFormatTags = 'b,big,code,del,dfn,em,font,i,ins,kbd,span,style,font-family';
});