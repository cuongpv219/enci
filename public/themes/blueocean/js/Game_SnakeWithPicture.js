var canPlay = false;
$(document).ready(function() {	
    //get Result
    $("#finish-game").click(loadResult);
    $("#redo").click(replayGame);
});

function replayGame(){
    $("#show-result").hide('slide', {
        direction: 'left'
    }, Ucan.Constants.getHideResultSpeed(), function() {
        document.getElementById("ucanFlashGame_preview").startFlashGame();
    });
}

function startFlashGame() {
    canPlay = true;
}

function loadResult(){
    if (!canPlay) {
        return;
    }
    canPlay = false;
    playSound(Ucan.Resource.Audio.getShowResultSound());
        
    var retStr = document.getElementById("ucanFlashGame_preview").getResultFlashGame(); 
    var retArr = retStr.split('||');
    var numCorrect = parseInt(retArr[0]);
    var numWrong = parseInt(retArr[1]);
    var count = parseInt(retArr[2]);    
    var displayNumCorrect = numCorrect > (count*5)?(count*5):numCorrect;
    $("#num-of-correct-answers-result").text(displayNumCorrect  + '/' + (count*5)); 
    score = (numCorrect / (numCorrect + numWrong)) * ((numCorrect + numWrong)/(5*count)) * 100;
    score = score > 100?100:Math.floor(score);
    $("#score-text").text(score);   
    $('#show-result').show('slide', {
        direction: "left"
    }, Ucan.Constants.getShowResultSpeed());
    onFinishActivity();
}