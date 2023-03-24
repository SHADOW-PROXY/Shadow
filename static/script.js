function darkMode() {
  const body = document.querySelector('body');
  const bgColor = window.getComputedStyle(body).getPropertyValue('background-color');

  // Check if background color is dark
  function isColorDark(color) {
    const rgb = color.match(/\d+/g).map(Number);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness < 128;
  }

  if (isColorDark(bgColor)) {
    console.log('website is in dark mode');
  } else {
    console.log('website is not in dark mode');
    function invert(str,type){
      var t1 = str.split("(");
      var t2 = t1[1].split(")");
      var t3 = t2[0].split(",");
      t3.forEach(function(v,i){
       if(i<3){
        if(type=="color")
            t3[i] = (255 - parseInt(v))<50?120:(255 - parseInt(v));
        else
            t3[i] = (255 - parseInt(v));
       }
      })
      t3 = t3.join(",");
      return t1[0]+"("+t3+")";
    }
    //invert color and backgroundcolor of every dom node
    document.querySelectorAll('*:not([invTouch])').forEach(function(node) {
        var style  = window.getComputedStyle(node);
        node.style.backgroundColor = invert(style.backgroundColor,"back");
        node.style.color = invert(style.color,"color");
        node.setAttribute("invTouch", "true");
    });
  }
}

function myFunction() {
  alert("Hello World!");
}






function byId(id) {
  return document.getElementById(id);
}

function byClass(c) {
  return document.getElementsByClassName(c);
}

function fullscreen(elm) {
  (elm.requestFullscreen ? elm.requestFullscreen() : (elm.webkitRequestFullscreen ? elm.webkitRequestFullscreen() : (elm.mozRequestFullScreen ? elm.mozRequestFullScreen() : (elm.msRequestFullscreen ? elm.msRequestFullscreen() : alert('Your browser does not support fullscreen!')))))
}

var currentTab = 1;
var currentTabs = 1;

function closeTabs(index) {
  for (var i = index, tabcontents = byId('tabs').children; i < tabcontents.length; i++) {
    var tabId = tabcontents[i].id;
    byId('tabb'+tabId.substring(3)).parentNode.removeChild(byId('tabb'+tabId.substring(3)));
    byId(tabId).parentNode.removeChild(byId(tabId));
    currentTabs--;
  }
  if (currentTab >= currentTabs) {
    currentTab = currentTabs;
    openTab(currentTab, false);
  }
}

function openTab(id, closeable = true) {
  for (var i = 0, tabcontents = byId('tabs').children; i < tabcontents.length; i++) {
    tabcontents[i].style.display = 'none';
  }
  for (var i = 0, tabbtns = byId('tabbtns').children; i < tabbtns.length; i++) {
    tabbtns[i].className = tabbtns[i].className.replace(' active', '');
    if (tabbtns[i].dataset.tab == id) {
      var closeButton = byClass('topright', tabbtns[i])[0];
      if (closeable && !closeButton) {
        closeButton = document.createElement('span');
        closeButton.className = 'topright';
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', function() {
          closeTabs(parseInt(this.parentNode.dataset.tab) + 1);
        });
        tabbtns[i].appendChild(closeButton);
      } else if (!closeable && closeButton) {
        closeButton.parentNode.removeChild(closeButton);
      }
    }
  }
  byId('tab'+id).style.display = 'block';
  currentTab = id;
  byId('tabb'+id).className += ' active';
}


window.onload = function() {
  byId('address').addEventListener('keyup', function (event) {
    if (event.keyCode == 13) {
      load();
    }
  });
}

function load() {
  var url = byId('address').value;
  var iframe = byId('iweb' + currentTab);

  if (url === "shadow:welcome") {
    iframe.src = "int/welcome.html";
    byId('tabb'+currentTab).innerHTML = 'Welcome <span class="topright2" onclick="closeTab(' + currentTab + ')">X</span>';
  } else if (url === "shadow:settings") {
    iframe.src = "int/settings.html";
    byId('tabb'+currentTab).innerHTML = 'Settings <span class="topright2" onclick="closeTab(' + currentTab + ')">X</span>';
  } else {
    byId('tabb'+currentTab).innerHTML = 'Loading... <span class="topright2" onclick="closeTab(' + currentTab + ')">X</span>';
    if (url !== '') {
      let uri = search(url, 'https://google.com/search?q=%s')
      iframe.src = window.location.origin + __uv$config.prefix + __uv$config.encodeUrl(uri);
    }
  }

  iframe.addEventListener('load', function() {
    const iframeWindow = iframe.contentWindow;
    var title = iframe.contentDocument.title || "Welcome";
    byId('tabb'+currentTab).innerHTML = title + ' <span class="topright2" onclick="closeTab(' + currentTab + ')">X</span>';
    var functionCode = darkMode.toString();
    // Execute the code in the iframe's context
    iframeWindow.eval("(" + functionCode + ")()");
  });
}

function refresh() {
  var iframe = document.getElementById('iweb' + currentTab);
  iframe.contentWindow.location.reload();
}









function close() {
  byId('tabb'+currentTab).parentNode.removeChild(byId('tab'+currentTab));
  byId('tab'+currentTab).parentNode.removeChild(byId('tab'+currentTab));
}

function newtab() {
  var t = ++currentTab;
  var tabbtn = document.createElement('button');
  tabbtn.className = 'btn';
  tabbtn.setAttribute('onclick', 'openTab('+t+')');
  tabbtn.id = 'tabb'+t;
  tabbtn.innerHTML = 'New Tab ';
  tabbtn.style = 'width: 100%;';
  // Create the close button and add it to the tab button
  var closeButton = document.createElement('span');
  closeButton.className = 'topright2';
  closeButton.innerHTML = 'X';
  closeButton.setAttribute('onclick', 'closeTab('+t+')');
  tabbtn.appendChild(closeButton);

  var div = document.createElement('div');
  div.id = 'tab'+t;
  div.className = 'tabcontent';
  div.style.display = 'none';
  var iframe = document.createElement('iframe');
  iframe.src = '/int/newtab.html';
  iframe.height = '100%';
  iframe.width = '100%';
  iframe.id = 'iweb'+t;
  iframe.allowFullscreen = true;
  iframe.style.border = 'none';
  iframe.style.backgroundColor = 'black'; // Set the background color of the iframe
  iframe.style.display = 'none'; // Hide the iframe initially
  div.appendChild(iframe);

  byId('tabbtns').appendChild(tabbtn);
  byId('tabs').appendChild(div);
  openTab(t);

  // Wait for the iframe to fully load before displaying it
  iframe.addEventListener('load', function() {
    iframe.style.display = 'block';
  });
}



function closeTab(id) {
  var tabbtn = byId('tabb'+id);
  var tabcontent = byId('tab'+id);
  tabbtn.parentNode.removeChild(tabbtn);
  tabcontent.parentNode.removeChild(tabcontent);
  // switch to another tab if the current tab is closed
  if (currentTab == id) {
    var tabbtns = byClass('btn');
    if (tabbtns.length > 0) {
      var newid = tabbtns[tabbtns.length-1].id.slice(4);
      openTab(newid);
    }
  }
}


function unencodeSpans() {
  // Get all the span elements on the page
  const spans = document.getElementsByTagName('span');

  // Loop through all the span elements
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];

    // Check if the HTML content of the span contains 'Ã—'
    if (span.innerHTML.includes('Ã—')) {

      // Replace 'Ã—' with 'X'
      const newHtml = span.innerHTML.replace(/Ã—/g, 'X');

      // Set the new HTML content for the span
      span.innerHTML = newHtml;
    }
  }
}
function isUrl() { 
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
}


function shadowSettings() {
  var url = "int/settings.html";
  var iframe = byId('iweb' + currentTab);
  iframe.src = url;
  iframe.addEventListener('load', function() {
    const iframeWindow = iframe.contentWindow;
    var title = iframe.contentDocument.title || "Welcome";
    byId('tabb'+currentTab).innerHTML = title + ' <span class="topright2" onclick="closeTab(' + currentTab + ')">X</span>';
    var functionCode = darkMode.toString();
    // Execute the code in the iframe's context
    iframeWindow.eval("(" + functionCode + ")()");
  });
}