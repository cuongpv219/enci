/* Phai include diff_match_patch.js
$this->headScript()->appendFile($this->baseUrl() . '/js/diff_match_patch.js');
*/
function getCompareArray(newStr,oldStr) {
    var dmp = new diff_match_patch();
    var d = diff_wordMode(oldStr + ' ', newStr + ' ');
    var d1 = new Array();
    var count1 = 0;
    for (var x = 0; x < d.length; x++) {    
	
        if (d[x][0] == -1 && x < d.length-1 && d[x][1].toLowerCase().replace(/[^A-z0-9']/g, '') == d[x + 1][1].toLowerCase().replace(/[^A-z0-9']/g, '')) {
            var tempArr = new Array();
            tempArr[0] = 0;
            tempArr[1] = (x == d.length-2)?d[x][1]:d[x][1] + d[x+2][1];
            d1[count1++] = tempArr;
            x+=2;		
        }
        else if (d[x][0] == 0 && x < d.length-2 && d[x+1][1].toLowerCase().replace(/[^A-z0-9']/g, '') == d[x+2][1].toLowerCase().replace(/[^A-z0-9']/g, '')) {
            var tempArr = new Array();
            tempArr[0] = 0;
            tempArr[1] = (x == d.length-3)?d[x][1] + d[x+1][1]:d[x][1] + d[x+1][1] + d[x+3][1];
            d1[count1++] = tempArr;
            x+=3;		
        } else {
            var tempArr = new Array();
            tempArr[0] = d[x][0];
            tempArr[1] = d[x][1];
            d1[count1++] = tempArr;
        }	
    }
    var d2 = new Array();
    var count2 = 0;
    for (var x = 0; x < d1.length; x++) { 
        if (x < d1.length-1 && d1[x][0] == 0 && d1[x+1][0] == 0) {
            var tempArr = new Array();
            tempArr[0] = 0;
            tempArr[1] = d1[x][1] + d1[x+1][1];
            d2[count2++] = tempArr;
            x+=1;		
        } else {
            var tempArr = new Array();
            tempArr[0] = d1[x][0];
            tempArr[1] = d1[x][1];
            d2[count2++] = tempArr;
        }	
    }       
    return d2;
}

function getCompareSentence(newStr,oldStr) {
    var dmp = new diff_match_patch();
    return dmp.diff_prettyHtml(getCompareArray(newStr,oldStr));
}

function getNumOfDiff(newStr,oldStr) {
    return getCompareArray(newStr,oldStr).length;
} 

function getBestMatch(str, arr){
    if (arr.length == 0) return null;
    if (arr.length == 1) return arr[0];
    var minNumOfDiff = getNumOfDiff(arr[0],str);
    var minNum = 0;
    for(var i = 1; i < arr.length; i++) {
        var curNumOfDiff = getNumOfDiff(arr[i], str);
        if (curNumOfDiff < minNumOfDiff){
            minNumOfDiff = curNumOfDiff;
            minNum = i;
        }
    }
    return arr[minNum];
}

function isEqualString(newStr, oldStr){
    return (newStr.toLowerCase().replace(/[^A-z0-9']/g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '') 
        == oldStr.toLowerCase().replace(/[^A-z0-9']/g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, ''));
}

function makeSentenceCase(str){
    var retStr = str.toLowerCase().replace(/[^A-z0-9']/g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
    return retStr.substr(0,1).toUpperCase()+retStr.substr(1).toLowerCase();
}