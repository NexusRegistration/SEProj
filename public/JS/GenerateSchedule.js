let classes = [
  {name: "Math", start: "4:29 AM", end: "6:00 AM",days:["M","W","F"]},
  {name: "Math", start: "7:45 AM", end: "8:35 AM",days:["T","Tu"]}
]
const map1 = new Map();

map1.set('M', 1);
map1.set('T', 2);
map1.set('W', 3);
map1.set('Tu', 4);
map1.set('F', 5);
// creates a <table> element and a <tbody> element
const tbl = document.getElementById("table");
const tblBody = document.getElementById("tbody");

// creating all cells
const mySchedule = buildSchedule(classes)


for (let i = 0; i < 29; i++) {
  // creates a table row
     //FIXME replace with actual iterator for class start times
     const row = document.createElement("tr");
  

  for (let j = 0; j < 6; j++) {
    var maker = false
    // Create a <td> element and a text node, make the text
    // node the contents of the <td>, and put the <td> at
    // the end of the table row
    const cell = document.createElement("td");
    if (j == 0 ){
    cell.className = "headcol";
      if (i%2 == 0) {var cellText = document.createTextNode((i/2)+4 +':00')
      maker = true}
    }
    else if(mySchedule[i][j] != null){
     
      curr_height =timemath(mySchedule[i][j].start,mySchedule[i][j].end)
      marginTop = marginTopMath(mySchedule[i][j].start);

      cell.innerHTML = '<div class="event double" style ="height:'+curr_height+'%; margin-top:' +marginTop+'px;"><input id="check" type="checkbox" class="checkbox" /><label for="check"></label>' + mySchedule[i][j].start + '-'+ mySchedule[i][j].end+ ' Class</div>'
      
    }
    
      
    
    if (maker){
      cell.appendChild(cellText);
    }
    row.appendChild(cell);
  }

  // add the row to the end of the table body
  tblBody.appendChild(row);
}

// put the <tbody> in the <table>
//tbl.appendChild(tblBody);
// appends <table> into <body>
//document.body.appendChild(tbl);  
function timemath(t1,t2){
  t1_Msplit =t1.split(" ")
  t2_Msplit = t2.split(" ")
  const t1_array = t1_Msplit[0].split(":");
  console.log(t1_array);
  const t2_array = t2_Msplit[0].split(":");
  if (t1_Msplit == "PM"){
    t2_array[0]+=12
  }
  if (t2_Msplit == "PM"){
    t1_array[0]+=12
  }
  
  var hours = t2_array[0]-t1_array[0];
  var minutes = t2_array[1]-t1_array[1];
  
  
  
  
  minutes = minutes+(hours*60);
  hours = 0;
  
  const height = 3.5*minutes;
  
  return(height)
  
}
function marginTopMath(t1){
  t1_M = t1.split(" ");
  
  const t1_arrray = t1_M[0].split(":");
  var startMin = t1_arrray[1];
  if (startMin >=30){
    startMin-=30;
  }
  var marginTop = 70*(startMin/60);
  return(marginTop);



}

function buildSchedule(classes1){
  var arr = [];
  for (i =0; i<29 ;i++){
    arr[i] = []
    for(j=0; j<6; j++){
     arr[i][j]=null;
    }
  }
  for(x of classes1){
    const timeandM = x.start.split(" ");
    t1 = timeandM[0].split(":");
    slot = Number(t1[0])*2-8 ;  //FIXME replace with actual iterator for class start times
    
    if ( 
        (t1[1])>=30){
        slot +=1;
    }
    for(day of x.days){
        arr[slot][map1.get(day)] = x;
       
    }
    
  } 
  
  return(arr);
}

    