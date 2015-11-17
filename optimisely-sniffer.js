function main () {
  
  
  function handler(event){
    if(event.data.state==='eval'){
      var executable = window.optimizely['allVariations'][event.data.id]['code'];

      if(typeof executable !== 'undefined'){
        console.log(executable);  
        eval(executable);
        var msg ={type:'executed : '};
      }
      // else{
      //   console.log(window.optimizely['allVariations'][event.data.id]);
      //   console.log(window.optimizely['allExperiments'][event.data.id]);
      // }
    }
  }

  var isFunction = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Function]';
  };

  if (window.optimizely) {
    // listen();  
    window.addEventListener("message",handler,false);    
    var msg ={type:'variation',experiments: optimizely['allExperiments'],variations:optimizely['allVariations']};
    window.postMessage(msg, "*");
  } else {
      var msg ={type:'no-optimisely'};
      window.postMessage(msg, "*");
  }
}

main();	
