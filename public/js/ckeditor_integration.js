$(document).ready(function() {
    ckEditorTextareas = $('.ckeditor-input');
    ckEditorTextareas.each(function() {
        var editor = CKEDITOR.replace($(this).attr('id'),{
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
    });
    CKEDITOR.config.entities_latin = false;
//    if ( CKEDITOR.instances.editor1.getData() == '' ) {
//        alert( 'There is no data available' );
//    } else {
//        alert('ok');
//    }
        
});