$(document).ready(function() {
    var count = activityContent.group.length;
    var canPlay = true;	
    var rate = 3/4;
    var canClickRedo = false;
    displayActivity();  
    editGUI();
    
    function editGUI(){
        // Lam cho anh hien thi size nhu nhau
        var img = new Image();
        img.onload = function() {
            rate = this.height/this.width; 
            $('.represent-picture').width($('.represent-picture').height()/rate);            
            $('.character-picture').width($('.character-picture').height()/rate);
        }
        img.src = activityContent.group[0].pictures;        
    }
    
    function displayActivity(){
        var picturesHtmlArray = [];
        var picturesHtml = "";
        var sentencesHtml = "";
        for(i=0;i<count;i++){ 
            picturesHtmlArray[picturesHtmlArray.length] = '<div class="character-picture-holder" id="picture_' + i + '" ><img class="character-picture character-picture-normal" src="' + resourceUrl + activityContent.group[i].pictures + '" data-id="' + i + '" /></div>';                
        }
        picturesHtmlArray = shuffle(picturesHtmlArray);
        for(k=0;k<picturesHtmlArray.length;k++){ 
            picturesHtml += picturesHtmlArray[k];
        }
        
        $('#pictures-container').append(picturesHtml);
        $('#sentences-container').append(sentencesHtml);                
        
        $('.character-picture').draggable({
            revert:"invalid",
            helper:"clone"
        });                               
    }
    
    $('.dialog-audio-container').droppable({
        accept: ".character-picture",
        over: function(event, ui) {
            $(this).children('.represent-picture').removeClass('represent-picture-unmatch').addClass('represent-picture-over');
        },
        out: function(event, ui) {
            $(this).children('.represent-picture').removeClass('represent-picture-over').addClass('represent-picture-unmatch');
        },
        drop: function(event, ui) {
            if (!canPlay) return;
            playSound(Ucan.Resource.Audio.getClickedSound());
            // Truong hop keo tu danh sach anh
            if (ui.draggable.parent().hasClass('character-picture-holder')){
                // Neu da co san anh
                if ($(this).children('.represent-picture').children('.character-picture').length > 0) {
                    $('#picture_' + $(this).children('.represent-picture').children('.character-picture').attr('data-id')).show()
                    .switchClass('character-picture-normal','character-picture-slash', 500, function(){
                        $(this).switchClass('character-picture-slash','character-picture-normal');
                    });
                    $(this).children('.represent-picture').children().remove();
                }                                        
                
                $(this).children('.represent-picture').append((ui.draggable.clone().draggable({
                    revert:"invalid",
                    helper:"clone"
                }))).switchClass('represent-picture-over','represent-picture-slash', 500, function(){
                    $(this).switchClass('represent-picture-slash','represent-picture-match');
                });
                ui.draggable.parent().hide();
            // Truong hop keo tu anh nho
            } else {
                // Neu da co san anh
                if ($(this).children('.represent-picture').children().length > 0) {
                    ui.draggable.parent().append($(this).children('.represent-picture').children())
                    .switchClass('represent-picture-match','represent-picture-slash', 500, function(){
                        $(this).switchClass('represent-picture-slash','represent-picture-match');
                    });
                } else {
                    ui.draggable.parent().switchClass('represent-picture-match','represent-picture-slash', 500, function(){
                        $(this).switchClass('represent-picture-slash','represent-picture-unmatch');
                    });
                }
                        
                $(this).children('.represent-picture').append((ui.draggable.clone().draggable({
                    revert:"invalid",
                    helper:"clone"
                }))).switchClass('represent-picture-over','represent-picture-slash', 500, function(){
                    $(this).switchClass('represent-picture-slash','represent-picture-match');
                });
                ui.draggable.remove();
            }
        } 
    });
        
    $('#pictures-container').droppable({
        accept: ".character-picture",
        drop: function(event, ui){
            if (!canPlay) return;
            playSound(Ucan.Resource.Audio.getClickedSound());
            if (!ui.draggable.parent().hasClass('character-picture-holder')){
                $('#picture_' + ui.draggable.attr('data-id')).show().switchClass('character-picture-normal','character-picture-slash', 500, function(){
                    $(this).switchClass('character-picture-slash','character-picture-normal');
                });
                ui.draggable.parent().switchClass('represent-picture-match','represent-picture-slash', 500, function(){
                    $(this).switchClass('represent-picture-slash','represent-picture-unmatch');
                });
                ui.draggable.remove();
            }
        }
    }); 
    
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function(){
        if (!canPlay) return;
        canPlay = false;
        $('.cp-jplayer').jPlayer("stop");
        $('.character-picture').draggable('disable');
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0; //reset after clicking result
        
        $('.dialog-audio-container').each(function(){
            if($(this).children('.represent-picture').attr('data-id') == $(this).children('.represent-picture').children('img').attr('data-id')){
                numberOfTrueAnswers++;
                $(this).children('.represent-picture').append('<div class="represent-picture-mask"></div><div class="true-false-icon"><img class="true-icon" src="'+ baseUrl +'/themes/blueocean/img/true-false-tick-white-108.png" /></div>');
            }
            else{
                $(this).children('.represent-picture').append('<div class="represent-picture-mask"></div><div class="true-false-icon"><img class="false-icon" src="'+ baseUrl +'/themes/blueocean/img/true-false-cross-white-108.png" /></div>');
            }
        });
        $('.represent-picture-mask').width($('.represent-picture-mask').height()/rate);
        $('.true-false-icon').width($('.true-false-icon').height()/rate);
        // Nhấp nháy icon đúng sai
        $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
		
        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
        score = Math.floor((numberOfTrueAnswers / count) * 100);
        $("#score-text").text(score);
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
        canClickRedo = true;
    });
        
    $("#redo").click(function() {
        if (!canClickRedo) {
            return;
        }
        canClickRedo = false;
        
        $("#show-result").hide('slide', {
            direction: 'left'
        }, Ucan.Constants.getHideResultSpeed(), function() {
            canPlay = true;
            $("#pictures-container").html("");
            $('.represent-picture').children().remove();    
            $('.represent-picture').switchClass('represent-picture-match','represent-picture-unmatch');    
            numberOfTrueAnswers = 0;
            displayActivity();
        });
    });
    
    $("#show-answer").click(function() {
        $('.represent-picture').each(function(){
            $(this).switchClass('represent-picture-unmatch','represent-picture-match');
            $(this).html('<img class="character-picture character-picture-normal" src="' + resourceUrl + activityContent.group[$(this).attr("data-id")].pictures + '">').fadeOut(500).fadeIn(500);             
        });
    });
});