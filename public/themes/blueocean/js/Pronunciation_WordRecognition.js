google.load("visualization", "1", {
    packages:["corechart"]
});
var count;   
var unShowClickResult = 0;
$(document).ready(function() {
     var numViewedPage = 0;
    function drawChart(arr) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Times');
        data.addColumn('number', '%');
        for(var i = 0; i < arr.length; i++) {
            data.addRows([[i.toString(10),arr[i]]]);
        }
        
        var options = {
            width: 557, 
            height: 309,
            title: 'Pronunciation progress'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
    
    function inputChange(e) {
        if (e.results) {             
            var precision = getPrecision(activityContent.group[curTabIndex].words,e.results[0].utterance,e.results[0].confidence);
            $('#raw-result').text(e.results[0].utterance + ' - ' + e.results[0].confidence);
            $('#microphone-input').val('').blur();
            $('#result-pointer').animate({
                'margin-left': Math.round($('#score-bar').width()*precision -  $('#result-pointer').width()/2) + 'px'
            },2000);
            resultArr[curTabIndex][resultArr[curTabIndex].length] = precision;
            statisticArr[curTabIndex][0] = statisticArr[curTabIndex][0] + 1;
            if (precision > 0.8) {
                statisticArr[curTabIndex][1] = statisticArr[curTabIndex][1] + 1;
            } 
            else if (precision < 0.5) {
                statisticArr[curTabIndex][3] = statisticArr[curTabIndex][3] + 1;
            } else {
                statisticArr[curTabIndex][2] = statisticArr[curTabIndex][2] + 1;
            }
            updateStatistic();
        }
    }

    function updateStatistic() {    
        $('#number-try-label').text(statisticArr[curTabIndex][0]<10?'0' + statisticArr[curTabIndex][0]:statisticArr[curTabIndex][0]);
        $('#number-great-label').text(statisticArr[curTabIndex][1]<10?'0' + statisticArr[curTabIndex][1]:statisticArr[curTabIndex][1]);
        $('#number-acceptable-label').text(statisticArr[curTabIndex][2]<10?'0' + statisticArr[curTabIndex][2]:statisticArr[curTabIndex][2]);
        $('#number-bad-label').text(statisticArr[curTabIndex][3]<10?'0' + statisticArr[curTabIndex][3]:statisticArr[curTabIndex][3]);
        drawChart(resultArr[curTabIndex]);
    }
    
    function moveToTab(index){
        numViewedPage++;
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activateTabAndButton(index);
    }

    function inactivateAllTabAndNavigatorButton(){     
        $('#result-pointer').css('margin-left', Math.round(- $('#result-pointer').width()/2) + 'px');
        $('.navigator-button').attr('data-active','0');
    }

    function activateTabAndButton(index){
        curTabIndex = parseInt(index);
        $('#speak-word').text(activityContent.group[curTabIndex].words);        
        $('#sentence-button_' + index).attr('data-active','1');
        updateStatistic();
    }
    
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if (!is_chrome){
        var errorMessageHtml = '<div id="error-message">This activity only works on Chrome</div>';
        $('#activity-container').html(errorMessageHtml);
        return;
    }
    
    var count = activityContent.group.length; //number of sentences
    var resultArr = [];
    var statisticArr = [];
    var curTabIndex = 0;
    var buttonHtml = '';     
    for(var i = count - 1; i>= 0; i--){
        var arr = [];
        resultArr[count - i - 1] = arr;
        statisticArr[count - i - 1] = new Array(0,0,0,0);
        buttonHtml += '<div id="sentence-button_' + i + '" data-order="' + i + '" class="inactive-button navigator-button global-float-right unselected" data-active="0">' + (i+1) + '</div>';
    }
    $("#navigator-bar").append(buttonHtml);    
    moveToTab('0');
    
    // speech process
    
    
    $('#microphone-input').focus(function(){
        $('#result-pointer').css('margin-left', Math.round(- $('#result-pointer').width()/2) + 'px');
    });

    $('.navigator-button').click(function(){
        moveToTab($(this).attr('data-order'));
    });
    
    $('#next-button').click(function(){
        if (curTabIndex<count + 1){
            moveToTab((curTabIndex + 1).toString());
        }
    });
    
    $('#previous-button').click(function(){
        if (curTabIndex>0){
            moveToTab((curTabIndex - 1).toString());
        }
    });
    
    $("#finish").click(function(){
        $(document).keyup(function(e){
            if(e.keyCode == 13) {
                $('#multipage-confirm-dialog-button-no').click();
            }
        });
        if((numViewedPage == 1) && (count > 1)){
            unShowClickResult++;
            if(unShowClickResult == 1){
                $('.overlay-black').show();
                $('#multipage-confirm-dialog').fadeIn(500);
            }
        }
        else{
            window.location.replace(nextActivityUrl);
        }
    });
    
//    $('#speaker-wrapper').click(function(){
//        speak(activityContent.group[curTabIndex].words);
//    });
    var finalTranscript = '';
    var recognizing = false;
    var ignoreOnEnd;
    var pause_img = baseUrl + '/themes/blueocean/img/mic.png';

    $('#start_button').click(function(){
        clickMe();
    });

    function clickMe() {
        if (recognizing) {
            recognition.stop();
            return;
        }

        finalTranscript = '';
        recognition.start();
        ignoreOnEnd = false;

        start_img.src=baseUrl+'/themes/blueocean/img/mic-animate.gif';

    }

    function upgrade() {
        alert('Trình duyệt của bạn không hỗ trợ chức năng ghi âm.');
    }

    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            recognizing = true;
        }

        recognition.onresult = function(event) {
            if (typeof(event.results) == 'undefined') {
                recognition.onend = null;
                recognition.stop();
                upgrade();
                return;
            }

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                    drawPrecision(event.results[i][0]);
                }
            }
            
            $('#result_final').text(finalTranscript);
            recognition.stop();
            recognizing = false;
        }

        recognition.onerror = function(event) {
            if (event.error == 'no-speech') {
                window.alert('Không có tín hiệu');
                ignoreOnEnd = true;
            }

            if (event.error == 'audio-capture') {
                window.alert('Không tìm thấy microphone');
                ignoreOnEnd = true;
            }

            if (event.error == 'not-allowed') {
                window.alert('Chưa cho quyền sử dụng microphone');
                ignoreOnEnd = true;
            }
        }

        recognition.onend = function() {
            recognizing = false;
            start_img.src= pause_img ;
            if (ignoreOnEnd) {
                return;
            }

            if (!finalTranscript) {
                return;
            }
        }
    }

    function drawPrecision(eventResults){
        var precision = getPrecision(activityContent.group[curTabIndex].words,eventResults.transcript,eventResults.confidence);
        $('#raw-result').text(eventResults.transcript + ' - ' + eventResults.confidence);
        $('#microphone-input').val('').blur();
        $('#result-pointer').animate({
            'margin-left': Math.round($('#score-bar').width()*precision -  $('#result-pointer').width()/2) + 'px'
        },2000);
        resultArr[curTabIndex][resultArr[curTabIndex].length] = precision;
        statisticArr[curTabIndex][0] = statisticArr[curTabIndex][0] + 1;
        if (precision > 0.8) {
            statisticArr[curTabIndex][1] = statisticArr[curTabIndex][1] + 1;
        } 
        else if (precision < 0.5) {
            statisticArr[curTabIndex][3] = statisticArr[curTabIndex][3] + 1;
        } else {
            statisticArr[curTabIndex][2] = statisticArr[curTabIndex][2] + 1;
        }
        updateStatistic();
    }


function loadResult(){
    window.location.replace(nextActivityUrl);
}

});









