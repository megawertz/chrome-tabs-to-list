// TODO: Need a better way to manage values across files
// Possible values are:
// 		clipboard_format = [ html | text ]
// 		list_type = [ ordered | unordered ]
// 		list_item_format = [ title | url | all ]

var _templates = ['<li><a href="{{URL}}"><b>{{TITLE}}</b></a></li>',
				  '<li><a href="{{URL}}"><b>{{URL}}</b></a></li>',
				  '<li><a href="{{URL}}"><b>{{TITLE}}</b> [<i>{{URL}}</i>]</a></li>'];
				  
var _html = "";
var _mime = "text/plain";

// TODO: Not thrilled about using globals to make this work
// Called on the copy event to put html on the clipboard
document.addEventListener("copy", function(event) {
	  event.preventDefault();
	  console.log(_mime);
	  event.clipboardData.setData(_mime, _html);
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

	// Get settings
	 chrome.storage.sync.get({
		list_type: 'unordered',
		clipboard_format: 'html',
		list_item_format:'all'
	  }, function(items) {
	  
		var list_type = items.list_type;
		var list_item_format= items.list_item_format;		
		
		_mime = (items.clipboard_format === 'html') ? "text/html" : "text/plain";

		chrome.tabs.query( {"currentWindow": true} , function(tabs) {

			// Set type of list
			_html = (items.list_type === 'ordered') ? "<ol>" : "<ul>";

			// Set list item template
		    var template = "";
		    if(items.list_item_format === 'title') {
		    	template = _templates[0];
		    } else if (items.list_item_format === 'url') {
		    	template = _templates[1];
		    } else {
		    	template = _templates[2];
		    }
		    
		    // Loop through and process template
			for(var i = 0 ; i < tabs.length ; i++) {
				var temp = template.replace(/{{URL}}/gi,tabs[i].url);
				var temp = temp.replace(/{{TITLE}}/gi,tabs[i].title);
				_html += temp;
			}		
			
			// Set end of list type
			_html += (items.list_type === 'ordered') ? "</ol>" : "</ul>";;
		
			// Copy it to clipboard
			document.execCommand('copy');
		
			var action_url = "javascript:window.alert('" + _html + "');";
			chrome.tabs.update(tab.id, {url: action_url});
	
		});

	  });

});

// TODO: General
// Add a domain filter so you can exclude items from the list
