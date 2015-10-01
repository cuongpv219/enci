function editGUI() {
        
    if($('#phrases2').height()<$('#phrases1').height()-100)
        $('#phrases2').height($('#phrases1').height())
    for(var i= 0; i< activityContent.group.length;i++)
    {        
        var top1 = ($('#phrase1_'+i).height()-32) /2 + 3;
        var top2 = ($('#phrase2_'+i).height()-18) /2 + 2;
        if (top1 > 0) {
            $('#phrase1_'+i).children().css({
                'top':top1+'px'
            });
        }
        if (top2 > 0) {
            $('#phrase2_'+i).children().css({
                'top':top2+'px'
            });
        }
    }       
}
$(document).ready(function() {
    var canPlay = true;
    var canClickRedo = false;
    
    //show message when giving a result
    function displayActivity() {
        count = activityContent.group.length; //number of word groups
        words1 = [];
        words2 = [];
	
        var html = '<div id="phrase-container1">'
        + '<div id="phrases1"></div>'
        + '</div>'
        + '<div id="phrase-container2">'
        + '<div id="phrases2"></div>'
        + '</div>';
	
        $("#phrase-container").append(html);
	
        var words1Html = "";
        var words2Html = "";
        for(var i=0;i<count;i++){ 
            var word_temp = new Array(2);
            word_temp = activityContent.group[i].words.split("--"); 
            words1[i] = word_temp[0];
            words2[i] = word_temp[1];
        }
        //words1 = shuffle(words1);
        words2 = shuffle(words2);
        for( i=0;i<count;i++){ 
            words1Html += '<div class="phrases" id="pharseses_'+i+'"><div class="phrase1" id="phrase1_'+ i +'"><p class="text">' + words1[i] + '</p><img class="unmoveable" src="'+baseUrl +'/themes/blueocean/img/matching-concave-element-gray.png'+'"/></div> </div>';
            words2Html += '<div class="phrase2" id="phrase2_'+i+'"><p class="text">' + words2[i] +'</p><img class="moveable" src="'+baseUrl +'/themes/blueocean/img/matching-convex-element-orange.png'+'"/> </div>';
        }
        $("#phrases1").append(words1Html + '<div class="clearBoth"></div>');
        $("#phrases2").append(words2Html + '<div class="clearBoth"></div>');
	
        // Chinh lai css de hien thi phu hop
        if ($('#phrase-container1').height()>600) {
            var maxHeight = 0;
            $('.phrase1,.phrase2,.phrases').css({
                'min-height':'0px'
            })
            $('.phrase1,.phrase2').each(function(){
                if ($(this).height()>maxHeight){
                    maxHeight = $(this).height();
                }
            });
            maxHeight = (maxHeight<25)?25:maxHeight;
            $('.phrase1,.phrase2').height(maxHeight);
        } 
        
        //Drag and drop
        $("#phrases2 div").draggable({
            revert:"invalid",
            helper:"clone",
            start:function(event,ui){
                ui.helper.css({
                    "opacity":"1",
                    'z-index':'1'
                });
            }
        });
        $('#phrases2 .phrase2').hover( function(){
            $(this).children().attr('src',baseUrl +'/themes/blueocean/img/matching-convex-element-green.png');
            $(this).css({
                'border':'1px solid #83c937',
                'background-color':'#fff'
            });
        }
        , function() {
            if (!$(this).parent().hasClass('phrases')) {
                $(this).css({
                    'border':'1px solid #F68C34'
                });
                $(this).children().attr('src',baseUrl +'/themes/blueocean/img/matching-convex-element-orange.png');
            }
        }
        )
        $(".phrases").droppable({
            accept: "#phrases2 div, #phrases1 div div",
            drop: function( event, ui ) {
                if (!($(this).children().hasClass("phrase2"))){
                    // keo' tu` ben  trai' sang ben trai' ko co san phrase2
                    var orgParentId = ui.draggable.parent().attr('id');
                    if (ui.draggable.parent().hasClass("phrases")) {
                        ui.draggable.siblings().css({
                            'border':'solid 1px #e2e2e2'
                        });
                        $(this).children().eq(0).css({
                            'background-color':''
                        })
                        ui.draggable.siblings().children().attr("src",baseUrl + '/themes/blueocean/img/matching-concave-element-gray.png');
                        ui.draggable.siblings().height('');
                    } 
                    $(this).append(ui.draggable);
                    var firstChild = $(this).children().eq(0);
                    var secondChild = $(this).children().eq(1);
                    firstChild.css({
                        'float':'left',
                        'border':'1px solid #83c937'
                    });
                    firstChild.children().attr("src",baseUrl + '/themes/blueocean/img/matching-concave-element-green.png');
                    secondChild.css({
                        'float':'left',
                        'border':'1px solid #83c937',
                        'z-index':'0'
                    });
                    secondChild.children().attr("src",baseUrl + '/themes/blueocean/img/matching-convex-element-green.png');
                    
                    if (($('#phrases1 .phrase2').length == count) && (orgParentId == 'phrases2')){
                        $('#phrase-container2').hide();
                        $('#phrase-container1').animate({
                            'margin-left':'200px'
                        },500);
                    }
                } else {
                    if (ui.draggable.parent().hasClass("phrases")){
                        var oldParent = ui.draggable.parent();
                        ui.draggable.parent().children().eq(0).height('');
                        ui.draggable.parent().append($(this).children().eq(1).height(''));
                        ui.draggable.height('');
                        $(this).children().eq(0).height('');
                        $(this).append(ui.draggable);
                        if($(oldParent).children().eq(0).height()> $(oldParent).children().eq(2).height()){
                            $(oldParent).children().eq(2).height($(oldParent).children().eq(0).height());
                        }
                        else {
                            $(oldParent).children().eq(0).height($(oldParent).children().eq(2).height());
                        }
                    }
                    else{
                        $(this).children().eq(1).css({
                            'float':''
                        });
                        $(this).children().eq(1).children().attr("src",baseUrl + '/themes/blueocean/img/matching-convex-element-orange.png');
                        $("#phrases2").append($(this).children().eq(1).css({
                            'border':'1px solid #F68C34',
                            'height':''
                        }));
                        ui.draggable.children().attr("src",baseUrl + '/themes/blueocean/img/matching-convex-element-green.png');
                        $(this).append(ui.draggable.css({
                            'border':'1px solid #83c937'
                        }));
                        $(this).children().eq(1).css({
                            'float':'left'
                        });
                        $(this).children().eq(1).height('');
                        $(this).children().eq(0).height('');
                    }
                }
                
                $(this).children().eq(0).css({
                    'background-color':'#fff'
                });
                $(this).children().eq(1).animate({
                    'opacity':'0.4'
                },500,function(){
                    $(this).animate({
                        'opacity':'1'
                    },500);															
                });
                playSound(Ucan.Resource.Audio.getClickedSound());
                if($(this).children().eq(0).height()> $(this).children().eq(1).height()){
                    $(this).children().eq(1).height($(this).children().eq(0).height());
                }
                else {
                    $(this).children().eq(0).height($(this).children().eq(1).height());
                }
                editGUI(); 
            },
            over: function(event, ui) { 
                $(this).children().eq(0).css({
                    'border':'solid 1px #83c937',
                    'z-index':'-1'
                });
                $(this).children().eq(0).children().attr("src",baseUrl + '/themes/blueocean/img/matching-concave-element-green.png');
            },
            out: function(event, ui) { 
                if (!$(this).children().hasClass("phrase2")) {
                    $(this).children().eq(0).css({
                        'border':'solid 1px #e2e2e2'
                    });
                    $(this).children().eq(0).children().attr("src",baseUrl + '/themes/blueocean/img/matching-concave-element-gray.png');
                }
            }
            
        });
        $("#phrases2").droppable({
            accept: "#phrases1 div .phrase2",
            drop: function( event, ui ) {
                ui.draggable.siblings().css({
                    'border':'1px solid #e2e2e2'
                });
                ui.draggable.siblings().children().attr("src",baseUrl+'/themes/blueocean/img/matching-concave-element-gray.png');
                ui.draggable.children().attr("src",baseUrl + '/themes/blueocean/img/matching-convex-element-orange.png');
                ui.draggable.siblings().height('');
                setTimeout("editGUI()",1);
                $('#phrases2').height();
                $(this).append(ui.draggable.css({
                    'border':'solid 1px #F68C34',
                    'height':''
                }));
                
                $("#phrases2 .phrase2").css({
                    'float':''
                });
            }
        });
    }
    var count = activityContent.group.length; //number of word groups
    var words1 = [];
    var words2 = [];
    displayActivity();
    setTimeout("editGUI()",1);
    // View answers
    $("#show-answer").click(function() {
        var i = 0;
        $("#phrases1 .phrases").each(function() {
            var parentLoop = this;
            $('.phrase2').each(function(){
                var left = $(parentLoop).children('div.phrase1');
                if (($(left).children('p').text() + '--' + $(this).children('p').text()) == htmlEncode(activityContent.group[i].words)){
                    $(this).children('img').attr("src",baseUrl+'/themes/blueocean/img/matching-convex-element-green.png');
                    $(left).children('img').attr("src",baseUrl+'/themes/blueocean/img/matching-concave-element-green.png');
                    $(left).css({
                        'border':'1px solid #83C937'
                    })
                    $(left).addClass('fl').after($(this).addClass('fl').css({
                        'border':'1px solid #83C937'
                    }));
                    if($(this).height()<$(left).height()) {
                        $(this).height($(left).height());
                        
                    }
                    else $(left).height($(this).height());
                    editGUI();
                }
            });
            i++;
        });
        $('.phrase2').stop(true, true).fadeOut(500).fadeIn(500);
    });
      
    //get Result
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function(){
        if (!canPlay) {
            return;
        }
        canPlay = false;
        $('.ui-draggable').draggable("disable");

        playSound(Ucan.Resource.Audio.getShowResultSound());
        numberOfTrueAnswers = 0; //reset after clicking result
        var i = 0;
        $("#phrases1 .phrases").each(function() {
            if (($(this).children().eq(0).children('p').text() + '--' + $(this).children().eq(1).children('p').text())== htmlEncode(activityContent.group[i].words)){	
                numberOfTrueAnswers++;
                //                $(this).children(".phrase1").before('<img src="' + baseUrl + '/img/nef/icons/true1.png" class="true-icon global-float-left"/>');
                insertTrueFalseIconBefore(true, $(this).children(".phrase1"));
            } else {
                //                $(this).children(".phrase1").before('<img src="' + baseUrl + '/img/nef/icons/wrong1.png" class="false-icon global-float-left"/>');
                insertTrueFalseIconBefore(false, $(this).children(".phrase1"));
            }
            i++;
        });
        
        // Nhấp nháy icon đúng sai
        $(".true-icon, .false-icon").ucanAnimateTrueFalseIcon();
		
        $("#num-of-correct-answers-result").text(numberOfTrueAnswers + '/' + count);
        score = Math.floor((numberOfTrueAnswers / count) * 100);
        $("#score-text").text(score);
        $('#show-result').show('slide', {
            direction: "left"
        }, Ucan.Constants.getShowResultSpeed());
        canClickRedo = true;
        $('input:radio').button("disable");
		
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
            $("#phrase-container").html("");
            displayActivity();
        });
    });
});