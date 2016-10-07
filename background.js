// TODO: Need a better way to manage values across files
// Possible values are:
// 	    list_type_language = [ html | markdown | plain ]
// 		clipboard_format = [ html | text ]
// 		list_order = [ ordered | unordered ]
// 		list_item_format = [ title | url | all ]
				  
var _templates_html = ['<li><a href="{{URL}}"><b>{{TITLE}}</b></a></li>',
				 	   '<li><a href="{{URL}}"><b>{{URL}}</b></a></li>',
				       '<li><a href="{{URL}}"><b>{{TITLE}}</b> [<i>{{URL}}</i>]</a></li>'
				      ];

var _templates_markdown = [ '[__{{TITLE}}__]({{URL}})\n',
				 			'[__{{URL}}__]({{URL}})\n',
				 			'[__{{TITLE}}__ {{URL}}]({{URL}})\n'];	

var _templates_plain = ['{{{TITLE}}\n\n',
				 		'{{URL}}\n\n',
				 		'{{TITLE}}\n{{URL}}\n\n'];			  
	  
// Additional format possibilities
//
// dt/dd list (must be both)
//'<dt><b>{{TITLE}}</b></dt><dd><a href="{{URL}}">[<i>{{URL}}</i>]</a></dd>'
					  
var _html = "";
var _mime = "text/plain";

// TODO: Not thrilled about using globals to make this work
// Called on the copy event to put html on the clipboard
document.addEventListener("copy", function(event) {
	  event.preventDefault();
	  event.clipboardData.setData(_mime, _html);
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

	// Easy feedback this action has occured
	chrome.browserAction.setBadgeText({text: "copy"});

	// Get settings
	 chrome.storage.sync.get({
	 	list_type_language: 'html',
		list_order: 'unordered',
		clipboard_format: 'html',
		list_item_format:'all'
	  }, function(items) {
	  
		var list_order = items.list_order;
		var list_item_format = items.list_item_format;
		var list_type_language = items.list_type_language;		
		_mime = (items.clipboard_format === 'html') ? "text/html" : "text/plain";
		_html = "";

		chrome.tabs.query( {"currentWindow": true} , function(tabs) {

			// Set type of list
			var active_templates;
			if(list_type_language === 'html') {
				_html = (items.list_order === 'ordered') ? "<ol>" : "<ul>";
				active_templates = _templates_html;
			} else if(list_type_language === 'markdown') {
				active_templates = _templates_markdown;
			} else {
				active_templates = _templates_plain;
			}
			
			// Set list item template
		    var template = "";
		    if(items.list_item_format === 'title') {
		    	template = active_templates[0];
		    } else if (items.list_item_format === 'url') {
		    	template = active_templates[1];
		    } else {
		    	template = active_templates[2];
		    }
		    
		    // Loop through and process template
			for(var i = 0 ; i < tabs.length ; i++) {
				
				if(list_type_language !== 'html' && list_order === 'ordered') {
					_html +=  (i+1) + ". ";
			} else if(list_type_language === 'markdown' && list_order === 'unordered') {
					_html +=  "* ";
			
			}
				var temp = template.replace(/{{URL}}/gi,tabs[i].url);
				var temp = temp.replace(/{{TITLE}}/gi,tabs[i].title);
				_html += temp;
			}		
			
			// Set end of list type
			if(list_type_language === 'html') {
				_html += (items.list_order === 'ordered') ? "</ol>" : "</ul>";;
			}
				
			// Copy it to clipboard
			document.execCommand('copy');
		
			// Remove copy
			setTimeout(function() {
		  		chrome.browserAction.setBadgeText({text: ""});
			}, 600);
			
			// var action_url = "javascript:window.alert('" + _html + "');";
			// chrome.tabs.update(tab.id, {url: action_url});
	
		});

	  });

});

// TODO: General
// Add a domain filter so you can exclude items from the list
