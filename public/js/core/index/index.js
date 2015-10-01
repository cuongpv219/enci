$(document).ready(function() {
    $('.video-intro-btn').click(function(){
        // $("#youtube_player").attr('src','//www.youtube.com/embed/bSP8Sw2cKg0'); 
        $('#dark-background').fadeIn(1000);
        $('#video-intro').fadeIn(1000);
    });

    $('#video-intro .cancel, #dark-background').click(function(){
        $('#video-intro').fadeOut(500);
        $('#dark-background').fadeOut(500);
        $('#youtube_player')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*'); 
        // $("#youtube_player").attr('src',''); 
    });

    $('.video-intro-btn').click(function(event){
        return false;
    });

//    $('#flashcard-intro .clock-countdown').TimeCircles({
//        circle_bg_color: "#dadada",
//        fg_width: 0.06,
//        bg_width: 0.2,
//        time: {
//            Days: {
//                color: "#b00000",
//                text: "ngày"
//            },
//            Hours: {
//                color: "#0094db",
//                text: "giờ"
//            },
//            Minutes: {
//                color: "#6fcc1a",
//                text: "phút"
//            },
//            Seconds: {
//                color: "#f36d00",
//                text: "giây"
//            }
//        }
//    });
});