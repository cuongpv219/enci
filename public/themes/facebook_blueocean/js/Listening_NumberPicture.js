$(document).ready(function() {
    var count = activityContent.group.length; //number of sentences
    var curTabIndex = 0;
    var answer = [];
    var canClickRedo = false;
    
    displayActivity();
    
    function editGUI(){
        $('.picture-text').hide();
        $('.true-false-icon').hide();
        if($('.picture-title').length==0){
            $('.picture-text-wrap').css('margin-bottom','10px');
        }
        var numLoad=0;
        for(var i=0; i<count; i++){
            $('#picture-' + i +' img').load(function(){
                numLoad++;
                if(numLoad == count){
                    var pictureHeight = $('.represent-picture').width()*this.height/this.width;
                    $('.represent-picture').height(pictureHeight);
                    $('.picture-title').css('margin-top',pictureHeight + 10);
                    if($('#numbers-container').height() < $('#pictures-container').height() + 20){
                        $('#numbers-container').height($('#pictures-container').height() + 20);
                    }    
                }
            });
        }
    }
    
    function moveToTab(index){
        inactivateAllTabAndNavigatorButton();
        activateTabAndButton(index);
    }

    function inactivateAllTabAndNavigatorButton(){
        $('.dialog-audio-container').hide();
        $('.number[selected="0"]').css({
            'background-color':'#fff',
            'color':'#000',
            'cursor':'pointer',
            '-moz-box-shadow': 'inset 0 8px 15px -10px #d9d9d9',
            '-webkit-box-shadow': 'inset 0 8px 15px -10px #d9d9d9',
            'box-shadow': 'inset 0 8px 15px -10px #d9d9d9'
        }).draggable('disable');
        $('.number[selected="1"]').css({
            'background-color':'#FFF',
            'color':'#d9d9d9',
            'cursor':'pointer',
            '-moz-box-shadow': '',
            '-webkit-box-shadow': '',
            'box-shadow': ''
        }).draggable('disable');
    }
    
    function activateTabAndButton(index){
        curTabIndex = index;
        $('#dialog-audio-container-'+index).show();
        $('#number-'+index).css({
            'background-color':'#f5770f',
            'color':'#FFF',
            '-moz-box-shadow': '',
            '-webkit-box-shadow': '',
            'box-shadow': ''
        });
        $('#number-'+index).siblings().css({
            'background-color':'#fff',
            'color':'#000'
        });
        if($('#number-'+index).attr('selected')==0) {
            $('#number-'+index).draggable('enable').css({
                'cursor':'move'
            });
        };
        $("#dialog-audio-"+ index).jPlayer("play");
    }
    
    function displayActivity(){
        curTabIndex = 0;
        answer = [];
        for(var i = 0; i< count; i++){
            answer[i] = i;
        }
        answer = shuffle(answer);
        var pictureHtml = '';
        for(var j = 0; j < count; j++){
            if (typeof activityContent.group[answer[j]].audioTitle != 'undefined'){
                pictureHtml += '<div id="picture-' + j + '" class="picture-text-wrap" value="-1"><span class="picture-title">' + activityContent.group[answer[j]].audioTitle  + '</span><span class="picture-text"></span><img alt="picture ' + j + '" class="represent-picture" src="'+ resourceUrl + activityContent.group[answer[j]].pictures + '"></img><img alt="true-false" class="true-false-icon"></img></div>';
            } else {
                pictureHtml += '<div id="picture-' + j + '" class="picture-text-wrap" value="-1"><span class="picture-text"></span><img alt="picture ' + j + '" class="represent-picture" src="'+ resourceUrl + activityContent.group[answer[j]].pictures + '"></img><img alt="true-false" class="true-false-icon"></img></div>';
            }
        }
        $('#pictures-container').append(pictureHtml);
        editGUI();
        $('.number').draggable({
            revert:"invalid",
            helper:"clone",
            disable:'false'
        }).attr('selected','0');
        $('.picture-text').draggable({
            revert:"invalid",
            helper:"clone",
            disabled:"true"
        });
        moveToTab('0');
        
        $('.number').click(function(){
            moveToTab($(this).attr('order'));
        });
        
        $('.picture-text-wrap').droppable({
            accept: ".number,.picture-text",
            over: function(event, ui) {
                if (ui.draggable.hasClass('picture-text') && (ui.draggable.parent().attr('value') == $(this).attr('value'))) return;
                $(this).children('.picture-text').show().fadeOut(500).fadeIn(500);    
                playSound(Ucan.Resource.Audio.getClickedSound());
            },
            out: function(event, ui) {
                $(this).children('.picture-text').stop(true,true).fadeIn(500);
                if ($(this).attr('value')==-1){
                    $(this).children('.picture-text').hide();
                }
            },
            drop: function(event, ui) {
                playSound(Ucan.Resource.Audio.getClickedSound());
                // Neu keo tu list
                if (ui.draggable.hasClass('number')){
                    if ($(this).attr('value')!=-1){
                        $('#number-' + $(this).attr('value')).attr('selected','0').fadeOut(500).fadeIn(500);
                        moveToTab(curTabIndex);
                    } 
                    $(this).attr('value',ui.draggable.attr('order'));
                    $(this).children('.picture-text').text((parseInt(ui.draggable.attr('order')) + 1)).stop(true,true);
                    $(this).children('.picture-text').show().draggable('enable');
                    ui.draggable.attr('selected','1').draggable('disable');
                } 
                // Neu keo tu tranh
                else {
                    var temp = $(this).attr('value');
                    $(this).attr('value',ui.draggable.parent().attr('value'));
                    $(this).children('.picture-text').text(ui.draggable.text()).stop(true,true);
                    $(this).children('.picture-text').show().draggable('enable');
                    ui.draggable.parent().attr('value',temp);
                    if (temp == '-1'){
                        ui.draggable.hide();
                    } else {
                        ui.draggable.text((parseInt(temp)+1)).stop().show();
                    }
                }
            } 
        });
    }
    
    var numberOfTrueAnswers = 0;
    $("#loadResult").click(function(){
        playSound(Ucan.Resource.Audio.getShowResultSound());
        $('.ui-draggable').draggable("disable");
        $('.picture-text').css('cursor','default');
        numberOfTrueAnswers = 0;
        for(var k = 0; k < count; k++){
            if (parseInt($('#picture-' + k).attr('value')) == answer[k]){
                numberOfTrueAnswers++;
                $('#picture-' + k).children('.true-false-icon').attr('src',baseUrl + '/themes/blueocean/img/true-false-tick-white-108.png').addClass('true-icon').show();
            } else {
                $('#picture-' + k).children('.true-false-icon').attr('src',baseUrl + '/themes/blueocean/img/true-false-cross-white-108.png').addClass('false-icon').show();
            }
        }
        
        // Nhấp nháy icon đúng sai
        $('.true-icon, .false-icon').ucanAnimateTrueFalseIcon();
        
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
            $('#pictures-container').html('');
            $('.ui-draggable').draggable("enable");
            displayActivity();
        });
    }); 
    
    $('#show-answer').click(function(){
        for(var k = 0; k < count; k++){
            $('#picture-' + k).children('.picture-text').text((parseInt(answer[k])+1));
        }
        $('.picture-text').css({
            'background-color':'#00b0f0'
        }).stop(true,true).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
    });
});