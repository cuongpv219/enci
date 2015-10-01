var callerEditor;
CKEDITOR.plugins.add( 'audioplayer',
{
	init: function( editor )
	{
		editor.addCommand( 'insertAudioplayer',
			{
				// Define a function that will be fired when the command is executed.
				// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.commandDefinition.html#exec
				exec : function( editor )
				{   
					var url = '/upload/browseaudio.php';
					callerEditor = editor;
					window.open(url,'Browse files','width=1024,height=768,scrollbars=yes');
					//editor.insertHtml( 'Return audio url:' + audioUrl);
				}
			});
		// Create a toolbar button that executes the plugin command. 
		// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.ui.html#addButton
		editor.ui.addButton( 'Audioplayer',
		{
			// Toolbar button tooltip.
			label: 'Insert Audio Player',
			// Reference to the plugin command name.
			command: 'insertAudioplayer',
			// Button's icon file path.
			icon: this.path + 'images/audioplayer.png'
		} );
	}
} );