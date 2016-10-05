var list_formats = ["Tab Title",
					"Url",
					"Tab Title - <i>[Url]</i>"];

function save_options() {

	var m_list_type = document.getElementById('list_type').value;
	var m_clipboard_format = document.getElementById('clipboard_format').value;
	var m_list_item_format = document.getElementById('list_item_format').value;

	chrome.storage.sync.set({
		list_type: m_list_type,
		clipboard_format: m_clipboard_format,
		list_item_format:m_list_item_format
	  }, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
		  status.textContent = '';
		}, 1250);
	  });

}


function restore_options() {

	 // Use default value color = 'red' and likesColor = true.
	  chrome.storage.sync.get({
		list_type: 'unordered',
		clipboard_format: 'html',
		list_item_format:'all'
	  }, function(items) {
	  	
	  	var status = document.getElementById('status');
		status.textContent = "Options: " + items.list_type + ", " + items.clipboard_format + ", " + items.list_item_format ;
	  
		document.getElementById('list_type').value = items.list_type;
		document.getElementById('clipboard_format').value = items.clipboard_format;
		document.getElementById('list_item_format').value = items.list_item_format;		
	  });

}

function update_list_format_sampletext() {
	// Get currently selected values
	
	// Build string
	var content = "";
	
	// Set it
	var status = document.getElementById('sampletext');
	status.textContent = content;
}

function configItemsOnLoad() {
	restore_options();
	document.getElementById('saveoptions').addEventListener('click', save_options);
}

document.addEventListener('DOMContentLoaded', configItemsOnLoad);

    