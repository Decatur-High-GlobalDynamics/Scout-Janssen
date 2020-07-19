function cartesian(a){
  var b = [];
  var sIndex = 0;
  for(var i = 0; i < a.length; i++){
    b.push(0);
  }
  var s = []
  s[sIndex] = [];
  for(var i = 0; i < b.length; i++){
    s[sIndex][i] = a[i][b[i]];
  }
  sIndex++;
  while(b[0] < a[0].length){
    b[b.length - 1]++;
    if(b[b.length - 1] >= a[b.length - 1].length){
      for(var j  = b.length - 1; j >= 0; j--){
        if(b[j] >= a[j].length){
          if(j == 0) return s;
          b[j] = 0;
          if(j != 0) b[j - 1]++;
        }
      }
    }
    s[sIndex] = [];
    for(var i = 0; i < b.length; i++){
      s[sIndex][i] = a[i][b[i]] ;
    }
    sIndex++;
  }
}