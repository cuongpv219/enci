$(document).ready(function() {
    
    var wordCount = activityContent.group.length; //number of word groups
    var canPlay = true;	
    var pictures = [];
    var rate = 3/4;
    var canClickRedo = true;
    
    displayActivity();    
    
    function editGUI(){
        // Lam cho anh hien thi size nhu nhau
        var img = new Image();
        img.onload = function() {
            rate = this.height/this.width;
            $('.represent-picture').height($('.represent-picture').width()*rate);
            $('.character-picture').height($('.character-picture').width()*rate);
        }
        img.src = resourceUrl + activityContent.group[0].character;        
        var maxSentenceHeight = 0;
        $('.sentence').each(function(){
            maxSentenceHeight = $(this).height()>maxSentenceHeight?$(this).height():maxSentenceHeight;
        });
        $('.sentence').height(maxSentenceHeight);
        // Hien thi voi truong hop it tranh
        if (wordCount<7) {
            var margin = Math.floor((960/wordCount - $('.character-picture').width())/2); 
            $('.character-picture-holder').css({
                'margin-left':margin + 'px',
                'margin-right':margin + 'px'
            });
            $('.sentence-holder').css({
                'margin-left':(margin + 4) + 'px',
                'margin-right':(margin + 5) + 'px'
            });
        }
    }

    function displayActivity(){
        pictures = [];
        var picturesHtmlArray = [];
        var picturesHtml = "";
        var sentencesHtml = "";
        var randomInputArr = shuffle(activityContent.group);
        for(i=0;i<wordCount;i++){ 
            if ($.inArray(randomInputArr[i].character,pictures) == -1){
                picturesHtmlArray[picturesHtmlArray.length] = '<div class="character-picture-holder" id="picture_' + pictures.length + '" ><img class="character-picture" src="' + resourceUrl + randomInputArr[i].character + '" pictureId="' + pictures.length + '" /></div>';
                if(randomInputArr[i].words != undefined){
                    sentencesHtml += '<div class="sentence-picture-wrap"><div class="sentence-holder"><div class="represent-picture represent-picture-normal" pictureId="' + pictures.length + '"></div><span class="sentence" sentenceId="' + i +'">' + randomInputArr[i].words + '</span></div></div>';
                }
                pictures[pictures.length] = randomInputArr[i].character;
            } else {
                if(randomInputArr[i].words != undefined){
                    sentencesHtml += '<div class="sentence-picture-wrap"><div class="sentence-holder"><div class="represent-picture represent-picture-normal" pictureId="' + $.inArray(randomInputArr[i].character,pictures) + '"></div><span class="sentence">' + randomInputArr[i].words + '</span></div></div>';
                }
            }
        }        
        picturesHtmlArray = shuffle(picturesHtmlArray);
        for(k=0;k<picturesHtmlArray.length;k++){ 
            picturesHtml += picturesHtmlArray[k];
        }
        picturesHtml+='<div class="clear-both"></div>';
        $('#pictures-container').append(picturesHtml);
        $('#sentences-container').append(sentencesHtml);
        
        editGUI();
        
        $('.character-picture').draggable({
            revert:"invalid",
            helper:"clone"
        });
        
        $('.sentence-holder').droppable({
            accept: ".character-picture",
            over: function(event, ui) {
                $(this).children('.represent-picture').removeClass('represent-picture-normal').addClass('represent-picture-over');
            },
            out: function(event, ui) {
                $(this).children('.represent-picture').removeClass('represent-picture-over').addClass('represent-picture-normal');
            },
            drop: function(event, ui) {
                if (!canPlay) return;
                playSound(Ucan.Resource.Audio.getClickedSound());
                $(this).children('.represent-picture').removeClass('represent-picture-over').addClass('represent-picture-normal');
                // Truong hop keo tu danh sach anh
                if (ui.draggable.parent().hasClass('character-picture-holder')){
                    // Neu da co san anh
                    if ($(this).children('.represent-picture').children('.character-picture').length > 0) {
                        $('#picture_' + $(this).children('.represent-picture').children('.character-picture').attr('pictureid')).css({
                            'display':'inline'
                        }).animate({
                            "opacity":"0.3"
                        },500,function(){
                            $(this).animate({
                                "opacity":"1"
                            },500)
                        });
                    }
                    
                    $(this).children('.represent-picture').children().remove();
                
                    $(this).children('.represent-picture').append((ui.draggable.clone().css({
                        "width":"100px",
                        "height": Math.floor(100*rate) + 'px'
                    }).draggable({
                        revert:"invalid",
                        helper:"clone"
                    }))).animate({
                        "opacity":"0.3"
                    },500,function(){
                        $(this).animate({
                            "opacity":"1"
                        },500)
                    })
                    ui.draggable.parent().css({
                        'display':'none'
                    });    
                // Truong hop keo tu anh nho
                } else {
                    // Neu da co san anh
                    ui.draggable.parent().append($(this).children('.represent-picture').children()).animate({
                        "opacity":"0.3"
                    },500,function(){
                        $(this).animate({
                            "opacity":"1"
                        },500)
                    });
                    $(this).children('.represent-picture').append((ui.draggable.clone().draggable({
                        revert:"invalid",
                        helper:"clone"
                    }))).animate({
                        "opacity":"0.3"
                    },500,function(){
                        $(this).animate({
                            "opacity":"1"
                        },500)
                    })
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
                    $('#picture_' + ui.draggable.attr('pictureid')).css({
                        'display':'inline'
                    }).animate({
                        "opacity":"0.3"
                    },500,function(){
                        $(this).animate({
                            "opacity":"1"
                        },500)
                    });
                    ui.draggable.remove();
                }
            }
        });
    }
    
    //get Result
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        canPlay = false;
        
        $('.character-picture').draggable('disable');
        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0; //reset after clicking result
        
        $('.sentence-holder').each(function(){
            if($(this).children('.represent-picture').attr('pictureId') == $(this).children('.represent-picture').children('img').attr('pictureId')){
                numberOfTrueAnswers++;
                $(this).children('.represent-picture').append('<div class="represent-picture-mask"><img class="true-icon true-false-icon" src="'+ baseUrl +'/themes/blueocean/img/true-false-tick-white-108.png" /></div>');
            }
            else{
                $(this).children('.represent-picture').append('<div class="represent-picture-mask"><img class="false-icon true-false-icon" src="'+ baseUrl +'/themes/blueocean/img/true-false-cross-white-108.png" /></div>');
            }
        });
        $('.represent-picture-mask').height($('.represent-picture-mask').width()*rate);
        $('.true-icon, .false-icon').ucanAnimateTrueFalseIcon();
        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + wordCount);
        score = Math.floor((numberOfTrueAnswers / wordCount) * 100);
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
            $("#sentences-container").html("");
            numberOfTrueAnswers = 0;
            displayActivity();
        });
    });
    
    $("#show-answer").click(function() {
        $('.represent-picture').each(function(){
            $(this).html('');
            $(this).append('<img class="character-picture" src="' + resourceUrl + pictures[$(this).attr("pictureId")] + '" style="width: 100px; height: ' + Math.floor(100*rate) + 'px">').fadeOut(500).fadeIn(500); 
        })
    });
});