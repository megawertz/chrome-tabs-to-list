// Globals, for easier reading and to pass data to the eventListener
// Probably a better way to deal with this
// Modify template to your liking
var _template = '<li><a href="{{URL}}"><b>{{TITLE}}</b> [<i>{{URL}}</i>]</a></li>';
var _html = "";

// Called on the copy event to put html on the clipboard
document.addEventListener("copy", function(event) {
	event.preventDefault();
 	event.clipboardData.setData('text/html', _html);
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

	chrome.tabs.query( {"currentWindow": true} , function(tabs) {

		// Loop through and generate the list
		_html = "<ul>";
		for(var i = 0 ; i < tabs.length ; i++) {
			var temp = _template.replace(/{{URL}}/gi,tabs[i].url);
			var temp = temp.replace(/{{TITLE}}/gi,tabs[i].title);
			_html += temp;
		}		
		_html += "</ul>";
		
		document.execCommand('copy');
		
		// var action_url = "javascript:window.alert('" + _html + "');";
   		// chrome.tabs.update(tab.id, {url: action_url});
	
	});
  
});

// Todo:
// Add a domain filter so you can exclude items from the list
// Add some type of interface? Settings?
