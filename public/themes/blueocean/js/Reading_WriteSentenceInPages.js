$(document).ready(function() {
    function editGUI(){
        var maxHeight = Math.max(500,$('#activity-board').height());
        if ($('#reading-board').height() > $('#activity-board').height()) {
            if($('#activity-board').height() < 450) {
                $('#activity-board').height(450);
            }
            else {
                maxHeight = $('#activity-board').height();
            }
        }
        else maxHeight = $('#activity-board').height();
        $('#reading-board').height(maxHeight-20);
        $('#activity-board').height(maxHeight);
    }
    var count = activityContent.group.length; //number of sentences
    function displayActivity() {       
        var sentenceListHtml = '<ul id="sentences">'; // to display sentences needing to fill in the blank
        for(var i = 0; i < activityContent.reading.length; i++){
            $('#question-link').prepend('<div id="sentence-button_' + i + '" data-order="' + i + '" class="inactive-button unselected">' + (i + 1) + '</div>');
        }
        for (i =0; i < count; i++) {
            sentenceListHtml += '<li id="sentence_' + i + '" class="sentence"><span class="ofrder-char">' + (i+1) + '. </span>'+ activityContent.group[i].sentence.replace(/\[(.*?)\]/,"") +
            '<br><span class="textbox"><textarea class="text" type="text" tabindex='+ (i+1) +' rows="2" cols="30"></textarea></span>' +
            '<br><span class ="showdiff">Answer</span>' +
            '<span class="result">&nbsp&nbsp' + activityContent.group[i].result + '</span></li>';
        }
        sentenceListHtml += '</ul>';
        //display given words and sentences with blank
        $('#sentence-list').append($(sentenceListHtml));
        moveToTab(0);
        $('.inactive-button').click(function(){	
            var id = $(this).attr('data-order');
            moveToTab(id);
        });
        $('.inactive-button').hover(function(){
            $(this).css('opacity','0.5');
        },function(){
            $(this).css('opacity','1');
        })
    }
   
    var curTabIndex = 0;
    var reading = [];
    for(i=0;i<activityContent.reading.length;i++) {
        reading[i] = activityContent.reading[i].page;
    }
    var askSentences = [];
    for(i=0; i<count; i++){
        askSentences[i] = activityContent.group[i].sentence;  
    }
    displayActivity();
    $('#reading-board').jScrollPane({
        autoReinitialise: true
    });
    $('#reading-board').hover(function(){
        $('.jspVerticalBar').fadeIn(200);
    },function(){
        $('.jspVerticalBar').fadeOut(200);
    });
    // An hien vi du
    $(".showdiff").live('click', 	
        function(){
            if($(this).parent().children('.result').css("display") == "none") {
                var sentencesHeight = $('#sentences').height();
                $(this).parent().children('.result').css({
                    "color":"white",
                    "display":"inline"
                });
                $(this).parent().children('.result').css({
                    "color":"#a6a6a6"
                });
                if (($('#sentences').height()+70) > $('#activity-board').height()) {
                    console.log($('#activity-board').height());
                    console.log($('#sentences').height());
                    $('#activity-board').height($('#sentences').height()+ $(this).siblings('.result').height());    
                }
                editGUI();
            }
            else {
                var resultHeight = $(this).siblings('.result').height();
                sentencesHeight = $('#sentences').height();
                console.log(($('#sentences').height()+100)+'--'+$('#activity-board').height());
                $(this).parent().children('.result').animate({
                    "color":"white"
                },400, function(){
                    if ((sentencesHeight+70) > 450) {
                        $('#activity-board').height($('#activity-board').height()-resultHeight);
                    }
                    editGUI();
                    $(this).css({
                        "display":"none"
                    });
                });
            }
        });
        
    $(".text:first").focus();
    //get Result
    $("#loadResult").click(function(){
        playSound(Ucan.Resource.Audio.getShowResultSound());
        var first = $(".sentence:first");
        flashSentence(first);
    });
    
    function moveToTab(index){
        $('.global-tab-container').ucanMoveToTab(index);
        inactivateAllTabAndNavigatorButton();
        activeTabAndButton(index);
        curTabIndex = parseInt(index);
        if (index == 0)editGUI();
    }
    function inactivateAllTabAndNavigatorButton() {
        $(".sentence").hide();
    }
    function activeTabAndButton(index) {
        for(var i = 0; i < count; i++) {           
            var temp = activityContent.group[i].page;
            if (temp == (parseInt(index)+1))
                $('#sentence_' + i).show();
            $('#reading-container').html(reading[index]);
        }
    }
    $('#next-link').click(function(){
        if (curTabIndex < reading.length-1){
            moveToTab(curTabIndex + 1) ;
        }
    });
    $('#prev-link').click(function(){
        if(curTabIndex > 0) {
            moveToTab(curTabIndex - 1 );
        }
    });
    function flashSentence(e) {
        if($(e).text()!= ''){
            $(e).children('.result').css({
                "color":"white",
                "display":"inline"
            });
            $(e).children('.result').animate({
                "color":"#a6a6a6"
            },1500, function(){
                flashSentence($(this).parent().next());
            });
            editGUI();
        }
    }
    /*
     * ======= TOOLTIP  =========
     */
    changeData();
    displayTooltip();
// END TOOLTIP
});
