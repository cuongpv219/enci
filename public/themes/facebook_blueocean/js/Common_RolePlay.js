/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var currentScenario = 0;
function onMicStatus(event){
    if (event == 'Unmuted'){
        canRecord = true;
        hidePromptFlash();
    } else if (event == "Muted") {
        if (!flashDisplayed) {
            flashDisplayed = true;
        }
        else {
            hidePromptFlash();
        }
    }
}

function hidePromptFlash() {
    $('#flashcontent').css({
        'left' : '-3000px',
        'width' : '1px',
        'height' : '1px'
    });
}
var count = activityContent.group.length;
function moveToScenario(index) {
    inactiveAllScenario();
    activeScenario(index);
    $('#scenario_'+index).siblings().css('background','');
    $('#scenario_'+index).css('background','#EDEDEA');
    $('#scenario_'+index).siblings().children().removeClass('scenario-inactive').removeClass('scenario-active').addClass('scenario-inactive').children('.red-poly').hide().siblings().removeClass('order-active').addClass('order-inactive');
    $('#scenario_'+index).children().removeClass('scenario-inactive').addClass('scenario-active').children('.red-poly').show().siblings().removeClass('order-inactive').addClass('order-active');
}
function inactiveAllScenario(){
    for(i=0; i< pageNumber;i++) {
        $('#intro_'+i).hide();
    }
    $('.listening-container').hide();
} 
function activeScenario(index) {
    currentScenario = index;
    $('#intro_'+index).show();
    for(var i=0;i<count;i++) {
        if(activityContent.group[i].page == undefined) {
            if(index==0)    {
                $('#listening-container_'+i).show();
            }
        }
        else {
            if 
            (parseInt(activityContent.group[i].page) == (1+index)) {
                $('#listening-container_'+i).show();
            }
        }
    } 
}
$(document).ready(function(){
    function displayActivity(){
        var scenarioHtml = '';
        var introHtml = '';
        $('#top-wellcome h2').html("Bài tập thực hành nói ");
        for(var i=0;i<pageNumber;i++) {
            if(activityContent.reading_list[i].reading != undefined) introHtml += '<div id="intro_'+i+'">'+activityContent.reading_list[i].reading+'</div>';
            scenarioHtml += '<div id="scenario_'+i+'" data-order="'+i+'" class="scenario"><div class=scenario-inactive>'+'<div class="order-inactive">'+(i+1)+'</div>Bài nghe số '+(i+1)+'<img class="red-poly" src="'+baseUrl+'/img/global/red-poly.png"/>'+'</div></div>';
        }
        $('#intro-container').html(introHtml);
        $('#scenario-container').html(scenarioHtml);
        $('#dialog-audio-container-0').jPlayer("play");
        $('#scenario_0').css({
            'background':'#ededea'
        });
        $('#scenario_0 .scenario-inactive').addClass('scenario-active').removeClass('scenario-inactive');
        $('#scenario_0').find('.order-inactive').addClass('order-active').removeClass('order-inactive');
        $('#scenario_0').find('.red-poly').show();
        $('.dialog-audio-container').each(function(){
            $(this).attr('title','Bấm vào đây để nghe câu nói mẫu');
        })
        $('.record-container').each(function(){
            $(this).attr('title','Bấm vào đây để bắt đầu thu âm. Bấm lại lần nữa để dừng thu âm');
        })
        $('.scenario').click(function(){
            if($(this).children().hasClass('scenario-inactive')) {
                currentScenario = parseInt($(this).attr('data-order'));
                moveToScenario(currentScenario);
                $(this).siblings().css('background','');
                $(this).css('background','#EDEDEA');
                $(this).siblings().children().removeClass('scenario-inactive').removeClass('scenario-active').addClass('scenario-inactive').children('.red-poly').hide().siblings().removeClass('order-active').addClass('order-inactive');
                $(this).children().removeClass('scenario-inactive').addClass('scenario-active').children('.red-poly').show().siblings().removeClass('order-inactive').addClass('order-active');
            }
        })
        setTimeout(function(){
            $('#col-div').height($('#menu-container').height()-60);
        },200)
    }
    displayActivity();
    moveToScenario(0);
    for(var i=0; i<count;i++) {
        $('#scenario_'+i).each(function(){
            $(this).attr('title','Bấm vào đây để chọn đoạn hội thoại');
        })
    }
    $('#help-container').click(function(){
        if($(this).find('.help-text').attr('data-value')=='0') {
            $('#bottom-wellcome').show();
            $(this).find('.help-text').html('Ẩn hướng dẫn');
            $(this).find('.help-text').attr('data-value','1');
        }
        else {
            $('#bottom-wellcome').hide();
            $(this).find('.help-text').html('Hướng dẫn');
            $(this).find('.help-text').attr('data-value','0');
        }
        
    })
    $('.sample').click(function(){
        $('.review-block').attr('data-value','-1');
        $('.item-best').attr('data-value','0');
        $('.item-best').attr('src',baseUrl+'/img/global/best-inactive.png');
    })
    $('#next-link').click(function(){
        if(currentScenario<pageNumber-1) {
            currentScenario++;
            moveToScenario(currentScenario); }
    })
    $('#prev-link').click(function(){
        if(currentScenario>0) {
            currentScenario--;
            moveToScenario(currentScenario);
        }
    })
    $()
    $('#flashcontent').click(function() {
        $(this).css({
            'width':'1px',
            'height':'1px',
            'overflow':'hidden'
        });
    })
    $('.start').click(function(){
        currentAudio = $(this).parent().parent().attr('data-order');
        $('#record-container_'+currentAudio).click();
    })
    $('#sample-listen').click(function(){
        if($(this).attr('data-value')=='0') {
            $(this).attr('data-value','1');
            $("#dialog-audio-container-0").click();
        }
    })
    $('#replayAll').click(function(){
        moveToScenario(0);
        if($(this).attr('data-value')=='0')
        {
            $(this).attr('data-value','1') ;
            $('#replay').click();
        }
    })
    $('#replay').click(function(){
     
        $('.dialog-audio-container').attr('data-value','0');
        if(currentI >=(count-1)) {
            currentI = 0;
        }
        
        if($(this).attr('data-value')=='0') {
            $(this).attr('data-value','1');
            $("#dialog-audio-container-0").click();
        }
    })
    $('.record-container').click(function() {
        if($(this).attr("data-value")=="0") {
            startRecording();
            $(this).attr("data-value","1");
            $(this).children('img').attr('src',baseUrl+'/img/global/record.png');
        }
        else {
            stopRecording();
            var index = parseInt($(this).attr('data-order'));
            var record = parseInt($(this).attr('data-record'));
            var recordHtml ='';
            recordHtml += '<div id="review-item_'+temp+'" class="review-item">';
            recordHtml += '<div class="number-review" id="number-review_'+record+'">0'+(record+1)+'</div>';
            recordHtml += '<ul class="rating">';
            for(var i=0; i<5; i++) {
                recordHtml += '<li id="star_'+i+'" class="star" data-order="'+i+'"><img src="'+baseUrl+'/img/global/star.png"/></li>';
            }
            recordHtml += '</ul>';
            recordHtml += '<img  id="item-del_'+temp+'" data-order="'+temp+'" class="item-delete" src="'+baseUrl+'/img/global/delete.png"/>';
            recordHtml += '<img id="item-play_'+temp+'" class="item-play" data-order="'+temp+'" src="'+baseUrl+'/img/global/play-button.png"/>';
            recordHtml += '<img class="item-best" id="item-best_'+temp+'" data-value="0" data-order="'+temp+'"  src="'+baseUrl+'/img/global/best-inactive.png"/>';
            recordHtml += '</div>';
            if (record == 0) {
                $('#review_'+index).html(recordHtml);
            }
            else {
                $('#review_'+index).append(recordHtml);
            }
            $(this).attr("data-record",++record);
            $(this).children('img').attr('src',baseUrl+'/img/global/black-record.png');
            $(this).attr("data-value","0");
            $('#review-item_'+temp).find('.star').click(function(){
                currentstar = parseInt($(this).attr('data-order'));
                $(this).children().attr('src',baseUrl+'/img/global/ratedstar.png');
                $(this).siblings().each(function(){
                    if(parseInt($(this).attr("data-order")) < currentstar)
                    {
                        $(this).children().attr('src',baseUrl+'/img/global/ratedstar.png');
                    }
                    else {
                        $(this).children().attr('src',baseUrl+'/img/global/star.png');
                    }
                })
            })
            
            $('#item-del_'+temp).click(function(){
                var delnumber = parseInt($(this).attr('data-order'));
                var delconfirm = "";
                delconfirm += '<div class="delconfirm">Sure to delete ?<img class="yestodel" src="'+baseUrl+'/img/global/yestodel.png"/> <img class="notodel" src="'+baseUrl+'/img/global/notodel.png"/> <div>'
                // $("#review-item_"+delnumber).hide();
                $('#review-item_'+delnumber).append(delconfirm);
                $('.yestodel').click(function(){
                    $(this).parent().parent().hide();
                    $('#col-div').height($('#menu-container').height()-60);
                })
                $('.notodel').click(function(){
                    $(this).parent().hide();
                    $('#col-div').height($('#menu-container').height()-60);
                })
                if(parseInt($(this).parent().parent().attr('data-value'))==delnumber) {
                    $(this).parent().parent().attr('data-value','-1');
                }
                $('#col-div').height($('#menu-container').height()-60);
            })
            $('#item-best_'+temp).click(function(){
                if($(this).attr("data-value")=="0")
                {
                    $(this).attr("data-value","1");
                    var best = $(this).attr('data-order');
                    $(this).parent().parent().attr("data-value",best);
                    $(this).attr("src",baseUrl+'/img/global/best.png');
                    $(this).parent().siblings().find('.item-best').attr("src",baseUrl+'/img/global/best-inactive.png');
                    $(this).parent().siblings().find('.item-best').attr('data-value','0');
                }
                else {
                    $(this).attr("data-value","0")
                    $(this).attr("src",baseUrl+'/img/global/best-inactive.png');
                    $(this).parent().parent().attr("data-value","-1");
                }
            })
            $('#item-play_'+temp).click(function(){
                var index = parseInt($(this).attr('data-order'));
                playSound(index);
                $(this).parent().removeClass('review-item').addClass('reviewing-item');
            })
        }
        $('#col-div').height($('#menu-container').height()-60);
    })
    
})

