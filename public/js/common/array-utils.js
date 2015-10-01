// random elements of an array
function shuffle(array) {
    var tmp, current, top = array.length;
    if (top){
        while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    } 
    return array;
}
    
function generateRandomArr(num){
    var retArr = new Array();
    for(var i=0;i<num;i++){
        retArr[i]=i;
    }
    return shuffle(retArr);
}

function getInvertRandomArr(ranArr){
    var retArr = new Array(ranArr.length);
    for(var i=0;i<ranArr.length;i++){
        retArr[ranArr[i]] = i;
    }
    return retArr;
}