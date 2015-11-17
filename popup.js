function setChildTextNode(elementId, text) {
  document.getElementById(elementId).innerText = text;
}

function addClickEvents(port,ids){
  for (var i = 0; i < ids.length; i++) {
    console.log(ids[i]);
    var n = document.getElementById(ids[i]);
        n.addEventListener('click', function() {
          console.log(this.id);
          port.postMessage({state:'eval',id: this.id});
        return ids[i];
      });
  };
}

function populateVariationsTable(data,vars){
  var ids = [];
  var html = '<div id="varTable"> <table>'; 
  
  for(id in vars){
    var o = vars[id];
    ids.push(id);

    //Header Row
    html +="<tr>";
    for (var i = 0; i < Object.keys(o).length; i++) {
        var k = Object.keys(o)[i];
        html+="<th>" +"Variation ID"+"</th>";
        if(typeof o[k] ==='undefined' || o[k] === "Original" ){}
        else{
          console.log(k);
          html+="<th>" +k+"</th>";
        }
    }
    html +="</tr>";

    //Info Row
    html +="<tr>" + '<td id="'+id+'">' +id;+ "</td>";
    for (var i = 0; i < Object.keys(o).length; i++) {
        var k = Object.keys(o)[i];
        if(typeof o[k] === 'undefined'|| o[k] === "Original" ){}
        else{
          if(Array.isArray(o[k])){
            html+="<td>" +o[key].join(",");+ "</td>";
          }
          else{
            console.log(k,o[k]);  
            html+="<td>" +o[k]+ "</td>";
          }
        }
    }
    html +="</tr>";
  }
   html += "</table></div>"
    var d1 = document.getElementById('myTest');
    d1.insertAdjacentHTML('beforeend', html);  
  console.log(ids);
  return ids;
}

function populateExperimentsTable (data,vars){
  var ids = [];
  var html = '<div id="experimentsTable"> <table>';

  for(id in data){
    
    var o = data[id];
    html += "<tr> ";
    for(k in Object.keys(o)){
      var key = Object.keys(o)[k];
      html+="<th>"
        html+= key;
        html+="</th>"     
    }
    html += "</tr> ";

    html += "<tr> ";
    for(k in Object.keys(o)){

      var key = Object.keys(o)[k];
      if(key === "enabled_variation_ids" || key === "variation_ids" ){
        html+="<td>";
        for (var i = 0; i < o[key].length; i++) {
          var l = o[key][i]
          var k = Object.keys(vars).indexOf(l);
          var m = Object.keys(vars)[k]

          console.log(vars[m])
          if(typeof vars[m] !=='undefined' && vars[m].name !== "Original"){
            console.log(l);  
            html += '<div id='+o[key][i]+'>'+ o[key][i] +"</div>";

            if(ids.indexOf(o[key][i]) === -1){
              ids = ids.concat(o[key])
            }  
          }
          
          html+="</td>";
        }
      }
      else{
        if (Array.isArray(o[key])){

          if(typeof o[key][0] === 'object'){
            html+="<td>"
            html+= JSON.stringify(o[key][0]);
            html+="</td>"  
          }
          else{
            html+="<td>"
            html+= o[key].join(",");
            html+="</td>"  
          }
        }
        else if(typeof o[key] === 'object'){
            html+="<td>"
            html+= JSON.stringify(o[key]);
            html+="</td>"  
          }
        else{
          html+="<td>"
          html+= o[key];
          html+="</td>"  
        }
      }      
    }

    html += "</tr>";


  }
  html += "</table></div>";
    var d1 = document.getElementById('myTest');
    d1.insertAdjacentHTML('beforeend', html);  
  console.log(ids);
  return ids;
}

function populateExperiments (data){
  var ids = []
  for(id in data){
    var html = "";
    var o = data[id];
    var name = "";
    var code = "";
    // console.log(o);
    html += "<ul> " + o['name'];
    for (var i = 0; i < o['enabled_variation_ids'].length; i++) {
      console.log(Object.keys(o));
      html += '<li id='+o['enabled_variation_ids'][i]+'>'+ o['enabled_variation_ids'][i] +"</li>";

      if(ids.indexOf(o['enabled_variation_ids'][i]) === -1){
        ids = ids.concat(o['enabled_variation_ids'])
      }
    };
    html += "</ul>"
    var d1 = document.getElementById('myTest');
    d1.insertAdjacentHTML('beforeend', html);  
  }
  return ids;
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    var port = chrome.tabs.connect(tabs[0].id,{name: "optimisely"});
    port.postMessage({state: "init"});
    setChildTextNode('status',"Haz optimisely?");

    port.onMessage.addListener(function(msg) {
      // console.log(msg);
      if(msg.state === "doing it"){
        setChildTextNode('myTest',"still looking...");
      }
      else if(msg.state === 'variation'){
          setChildTextNode('myTest',"Yup. Here's what we see:\r\n");
          
          var ids = populateVariationsTable(msg.experiments,msg.variations);
          addClickEvents(port,ids);
          // populateExperimentsTable(msg.experiments,msg.variations);
      }
      else if(msg.state === 'no-optimisely'){
          setChildTextNode("myTest", "Doesn't look like it");
      }
      else{
        // for msg
        // console.log(msg);
      }
    });
});

