$(document).ready(function() {
    $('object[data*="/1pixelout/AudioPlayer.swf"]').each(function() {
        $(this).hide().find('param[name="FlashVars"]').ucanMigrate1pixelout();
    });
});
