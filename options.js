var list_formats_html = ["<b>Tab Title</b>",
						 "<b>Url</b>",
						 "<b>Tab Title</b> <i>[Url]</i>"];

var list_formats_markdown = ["[__Tab Title__](Url)",
						 	 "[__Url__](Url)",
						  	 "[__Tab Title__ Url](Url)"];	

var list_formats_plain = ["Tab Title",
						  "Url",
						  "Tab Title<br>Url"];							  	 


function save_options() {

	var m_list_type_language = document.getElementById('list_type_language').value;
	var m_list_order = document.getElementById('list_order').value;
	var m_clipboard_format = document.getElementById('clipboard_format').value;
	var m_list_item_format = document.getElementById('list_item_format').value;
	var m_domain_filter = document.getElementById('domain_filter').value;

	chrome.storage.sync.set({
		list_type_language: m_list_type_language,
		list_order: m_list_order,
		clipboard_format: m_clipboard_format,
		list_item_format: m_list_item_format,
		domain_filter: m_domain_filter
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
	    list_type_language: 'html',
		list_order: 'unordered',
		clipboard_format: 'html',
		list_item_format: 'all',
		domain_filter: ''
	  }, function(items) {
	  	
	  	var status = document.getElementById('status');
		status.textContent = "Current Options: " + 
									items.list_type_language +
							 ", " + items.list_order + 
							 ", " + ((items.list_item_format === 'all') ? "title+url" :  items.list_item_format) + 
							 ", " + items.clipboard_format;
	  
		document.getElementById('list_order').value = items.list_order;
		document.getElementById('clipboard_format').value = items.clipboard_format;
		document.getElementById('list_item_format').value = items.list_item_format;
		document.getElementById('list_type_language').value = items.list_type_language;
		document.getElementById('domain_filter').value = items.domain_filter;
		
		update_list_format_sampletext()		

	  });

}

function update_list_format_sampletext() {
	// Get currently selected values	
	var list_order = document.getElementById('list_order').value;
	var list_item_format_index = document.getElementById('list_item_format').selectedIndex;
	var list_type_language = document.getElementById('list_type_language').value;
	
 	var clipboard_format_html = document.getElementById('clipboard_format_html');
 	var clipboard_format_text = document.getElementById('clipboard_format_text');
 	var clipboard_status = document.getElementById('clipboard_feedback');
 	
 	if(list_type_language === "html") {
 		clipboard_status.innerHTML = "";
 	
 		clipboard_format_html.removeAttribute("hidden");
 	} else {	
		clipboard_status.innerHTML = "* Markdown and Plain Text can only be copied as text";
	
		var clipboard_format = document.getElementById('clipboard_format');
		clipboard_format.value = 'text';
 		clipboard_format_html.setAttribute("hidden", true);
 	}
	
	
	// Build string
	// This will get ungainly with lots of formats, need to refactor
	var content = "";
	if(list_order === "ordered") {
		content = "1. ";
	} else {
		if(list_type_language === "html") {
			content = "&bull; "
		} else if(list_type_language === "markdown") {
			content = "* "
		}
	}
	
	// How to handle multiple formats easily?
	if(list_type_language === "html") {
		content += list_formats_html[list_item_format_index];
	} else if(list_type_language === "markdown") {
		content += list_formats_markdown[list_item_format_index];
	} else {
		content += list_formats_plain[list_item_format_index];
	}
	
	// Set it
	var status = document.getElementById('sampletext');
	status.innerHTML = content;
}

function configItemsOnLoad() {
	restore_options();
	document.getElementById('list_order').addEventListener('change', update_list_format_sampletext);
		document.getElementById('list_type_language').addEventListener('change', update_list_format_sampletext);
	document.getElementById('list_item_format').addEventListener('change', update_list_format_sampletext);
	document.getElementById('saveoptions').addEventListener('click', save_options);
}

document.addEventListener('DOMContentLoaded', configItemsOnLoad);

    