$(document).ready(function() {

    function getFirtCharArray(groupChoice) {
        var choiceArray = groupChoice.split("/");
        var firtCharArray = [];
        for(var i=0;i<choiceArray.length;i++){ 
            firtCharArray[i] = (choiceArray[i]).replace(/^\s+|\s+$/g,"").substring(0, 1);                
        }
        return firtCharArray;
    }
        
    var count = activityContent.group.length; //number of sentences
    var html ="";
    var firtCharArray = getFirtCharArray(activityContent.choices);
    var truefalsewidth = firtCharArray.length * 45;
    
    var sentences = [];
    var canPlay = true;
    if (count > 0){
        html += '<table id="sentences" border="0" cellspacing="0" width="100%"><thead>';
        var sentenseTitle = ''; 
        if (typeof activityContent.sentenseTitle!='undefined') {
            sentenseTitle = activityContent.sentenseTitle; 
        }
        html += '<td class="sentences-title">' + sentenseTitle + '</td><td class="sentences-choices">';
        for(i=0; i<firtCharArray.length; i++){
            html += '<span >' + firtCharArray[i] + '</span>';
        }
        html += '</td><td class="sentences-answers"><span></span></td></thead>';
        for(var i=0;i<count;i++){ 
            sentences[i] = activityContent.group[i].sentence.replace(/^\s+|\s+$/g,"");
            //alert(sentences[i] + ' - ' + answers[i]);
            html += '<tr class="sentences-row"><td class="sentences">'+ sentences[i] +'</td>\n\
                    <td  class="true-false" groupid="'+ i +'">';
            for(j=0;j<firtCharArray.length;j++){
                html += '<div id="check_' + i + '_' + j +'" class="ui-button-text global-choice-circle" value="0">';
                html += '</div>';
            }                                
				
            html += '</td><td class="answers"><span id="true-false-icon_' + i + '"></span></td>\n\
                    </tr>';
            
        };
        html += '</table>';
    }
    $("#sentences-container").append(html);
    $(".true-false").css({
        "width":truefalsewidth+"px"
    });
    //create button set
    $(".ui-button-text").click(function(){
        if (!canPlay) return;
        playSound(Ucan.Resource.Audio.getClickedSound());
            $(this).attr("value","1");
            $(this).addClass('checked');
            $(this).siblings().attr("value","0").removeClass('checked');
    });
    //get Result
    $("#loadResult").click(function(){
        alert('next activity');
    });
});