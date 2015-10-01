function getPrecision(baseStr,utterance,confident) {
    baseStr = baseStr.toLowerCase();
    utterance = utterance.toLowerCase();
    if (baseStr.indexOf(utterance)>-1 || utterance.indexOf(baseStr)>-1){        
        return 0.5 + 0.5 * confident;
    }
    var baseSoundex = soundex(baseStr);
    var utteranceSoundex = soundex(utterance);
    var matchCount = 0;
    for(var i = 0; i< 4; i++){
        if(baseSoundex[i] == utteranceSoundex[i]){
            matchCount++;
        }
    }    
    return (confident*matchCount/4);
}

function soundex (str) {
    str = (str + '').toUpperCase();
    if (!str) {
        return '';
    }
    var sdx = [0, 0, 0, 0],
        m = {
            B: 1,
            F: 1,
            P: 1,
            V: 1,
            C: 2,
            G: 2,
            J: 2,
            K: 2,
            Q: 2,
            S: 2,
            X: 2,
            Z: 2,
            D: 3,
            T: 3,
            L: 4,
            M: 5,
            N: 5,
            R: 6
        },
        i = 0,
        j, s = 0,
        c, p;
 
    while ((c = str.charAt(i++)) && s < 4) {
        if (j = m[c]) {
            if (j !== p) {
                sdx[s++] = p = j;
            }
        } else {
            s += i === 1;
            p = 0;
        }
    }
 
    sdx[0] = str.charAt(0);
    return sdx.join('');
}