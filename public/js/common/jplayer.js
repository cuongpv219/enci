function playSound(url, useNewPlayer, newPlayerName) {
    var playerName = '#jquery_jplayer_1';

    if ($(playerName).size() === 0) {
        $('body').append('<div id="jquery_jplayer_1"></div>');
    }

    if (useNewPlayer) {
        playerName = '#' + newPlayerName;
        if ($(playerName).size() == 0) {
            $('body').append('<div id="' + newPlayerName + '"></div>');
        }
    }
    
    $(playerName).jPlayer("setMedia", {
        mp3: url
    }).jPlayer("play");
                        
    $(playerName).jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: url
            }).jPlayer("play");
        },
        swfPath: baseUrl + "/js/common",
        wmode: "window",
        supplied: "mp3"
    });
}

/**
 * Pause âm thanh khi sử dụng jPlayer
 * @param id id của jPlayer cần pause
 */
function pauseSound(id) {
    $(id).jPlayer("pause",0);
}