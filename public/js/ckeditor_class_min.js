$(document).ready(function() {
    ckEditorTextareas = $('.ckeditor-input');
    ckEditorTextareas.each(function() {
        var editor = CKEDITOR.replace($(this).attr('id'),{
//                        enterMode : Number(2),
                        extraPlugins : 'youtube',
			toolbar :
			[
                            { name: 'document',    items : [ 'Source'] },
                            { name: 'basicstyles', items : [ 'Bold','Italic'] },
                            { name: 'paragraph',   items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
                            { name: 'links',       items : [ 'Link','Unlink' ] },
                            { name: 'insert',      items : [ 'Image', 'Youtube'] },
			]
		});
    });
    CKEDITOR.config.entities_latin = false;
    CKEDITOR.config.resize_enabled = false;
    CKEDITOR.config.height = '240px';
    CKEDITOR.config.forcePasteAsPlainText = true;
    CKEDITOR.config.removeFormatTags = 'b,big,code,del,dfn,em,font,i,ins,kbd,span,style,font-family';
//    CKEDITOR.on('instanceReady', function (ev) {
//        ev.editor.on('paste', function (ev) {
//            ev.data.html = ev.data.html.replace(/<br>\s*<br>/g, '</p><p>');
//        });
//    });
});