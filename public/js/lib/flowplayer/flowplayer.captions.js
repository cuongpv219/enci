
$f.addPlugin("captions", function(captions) {

	// first we generate the cuepoints Array from captions
	var cuepoints = [];

	for (time in captions) {
	  cuepoints.push(parseInt(time));
	}

	// get handle to the content plugin. this plugin is required
	var content = this.getPlugin("content");

	// plugin was found
	if (content) {

		// register cuepoints and its handler function
		this.onCuepoint(cuepoints, function(clip, time) {

			// this function simply updates the content with the given captions
			var displayString = captions[time];
			if (displayString.substr(0,3) == '[A]' || displayString.substr(0,3) == '[B]') {
				displayString = displayString.substring(3);
			}
			content.setHtml(displayString);
		});
	}

	// return the Player instance for fellow developers
	return this;

});
