var gport = null;
chrome.runtime.onConnect.addListener(function connectListener(port) {
  gport = port;
  console.log("CONNECTED",port.name);
  // chrome.runtime.onConnect.removeListener(connectListener);
  // console.assert(port.name == "optimisely");
  port.onMessage.addListener(function(msg) {
    
    
    if(msg.state === "init"){
      injectScript( chrome.extension.getURL('optimisely-sniffer.js'), 'body');
      window.addEventListener("message",injectedMessageHandler,false);
      port.postMessage({state: "doing it"});
    }
    else if(msg.state == 'eval'){
      console.log(msg.id);
      // var msg ={type:'variation',data: optimizely['allExperiments']};
      window.postMessage(msg, "*");
    }
  });

  port.onDisconnect.removeListener(function(){
    console.log("removing listener"); 
    window.removeEventListener("message",injectedMessageHandler,false);
  })
});


function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    (document.head||document.documentElement).appendChild(s);
}

// function onConnectListener()

function injectedMessageHandler(event){
  // console.log(event.data);
  if(gport === null)console.log("No active port");
  if(event.data.type === 'no-optimisely'){
    gport.postMessage({state: 'no-optimisely'});
  }
  else if(event.data.type === 'variation' ){
    console.log("I am here");
    gport.postMessage({state: event.data.type,experiments:event.data.experiments,variations:event.data.variations});
  }
}

// chrome.pageAction.show(integer tabId)
// Ensure the current selected tab is set up.
// console.log(chrome.app,"here")
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   // updateAddress(tabs[0].id);
//   chrome.pageAction.show(tabs[0].id);
// });
