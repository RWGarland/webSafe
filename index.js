(function(){  


	//--------------------------------------------------------------------------------
	// Notes API url  
	//--------------------------------------------------------------------------------
	// Change this to your own notes.php url 
	//--------------------------------------------------------------------------------
	//
	//
	//
	const NOTES_API_URL = "http://itsuite.it.brighton.ac.uk/rg425/ci227/2ndAssignment";
	//
	//
	//
	//--------------------------------------------------------------------------------
	// Do not change any other code in this file
	//--------------------------------------------------------------------------------


	
	
	
	//--------------------------------------------------------------------------------
	// V&A API and related urls
	//--------------------------------------------------------------------------------
	const VA_API_URL = "https://www.vam.ac.uk/api/json/museumobject/search";
	const VA_IMAGE_BASE_URL = "https://media.vam.ac.uk/media/thira/collection_images/";
	const VA_OBJECT_BASE_URL = "https://collections.vam.ac.uk/item/";



	window.addEventListener("load", function(){

		document.querySelector("#search").addEventListener("submit", SearchListener);
		document.querySelector("#notes_add").addEventListener("click", NotesAddListener);
		document.querySelector("#notes_close").addEventListener("click", NotesCloseListener);	
	});

	
	function SearchListener(evt){

		evt.preventDefault();
		
		var query = document.querySelector("#query").value.trim();
		if(query.length > 0) {
			
			document.querySelector("#result").style.display = "none";
			document.querySelector("#loading").style.display = "block";

			var url = VA_API_URL + "?images=1&q="+ query;
			
			var xhr = new XMLHttpRequest(); 
			xhr.onreadystatechange = function(){
				
				if(xhr.readyState==4 && xhr.status==200){
					
					document.querySelector("#search").classList.add("search_again");
					document.querySelector("#query").classList.add("input_again");
					document.querySelector("#submit").classList.add("input_again");
					updateSearchResults(xhr.responseText);
				} 
			};
			xhr.open("GET", url, true);
			xhr.send(null);
		}
	}


	function MoreShowListener(){
		var win = window.open(this.getAttribute("url"), '_blank');
		win.focus();
	}	


	function NotesShowListener(){
		
		document.querySelector("#notes_add").setAttribute("oid", this.getAttribute("oid"));
		document.querySelector("#notes_img").setAttribute("src", this.getAttribute("img_url")); 
		document.querySelector("#notes_img").setAttribute("alt", this.getAttribute("description")); 

		document.querySelector("#notes_loading").style.display = "block";
		document.querySelector("#notes_list").style.display = "none";
		
		document.querySelector("#notes_overlay").style.display = "block";
		
		var url = NOTES_API_URL + "?oid=" + this.getAttribute("oid");

		var xhr = new XMLHttpRequest(); 
		xhr.onreadystatechange = function(){
			if(xhr.readyState==4){
				
				// request completed: update notes list accordingly
				updateNotesList(xhr.status, xhr.statusText, xhr.responseText);
				
			}
		};
		xhr.open("GET", url, true);
		xhr.send(null);
		
	}

	
	function NotesCloseListener(evt){
		evt.preventDefault();
		document.querySelector("#notes_overlay").style.display = "none";
	}

	
	function NotesAddListener(){

		var input_name = document.querySelector("#notes_name");
		var input_notes = document.querySelector("#notes_text");
		
		var name = input_name.value.trim();
		var notes = input_notes.value.trim();

		if(name.length == 0) name = "Anonymous";
		
		if(notes.length == 0) {
			input_notes.style.border = "2px solid #ff0000";
		} else {

			// reset fields
			input_name.value = "";
			input_notes.value = "";
			input_notes.style.border = "";
		
			// create notes item
			var notes_item = createDiv("notes_item");
			notes_item.appendChild(createP(name + " said:"));
			notes_item.appendChild(createP(notes));
			
			// append to list
			var notes_list = document.querySelector("#notes_list");
			if(notes_list.firstChild) {
				if(notes_list.firstChild.classList.contains("notes_item")) {
					notes_list.insertBefore(notes_item, notes_list.firstChild);
				} else {
					notes_list.replaceChild(notes_item, notes_list.firstChild);
				} 
			} else {
				notes_list.appendChild(notes_item);
			} 

		
			// upload to server
			var url = NOTES_API_URL;
			var data = "oid=" + this.getAttribute("oid") 
					 + "&name=" + encodeURIComponent(name) 
					 + "&notes=" + encodeURIComponent(notes);

			var xhr = new XMLHttpRequest(); 
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					
					// request completed: update notes list accordingly
					if(xhr.status==201){
						// ok - created: ignore
					} else if(xhr.status==400){
						// bad request: ignore
					} else if(xhr.status==500){
						// server error: ignore
					} 
				}
			};
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(data);
		}
	}


	function updateSearchResults(txt) {

		var i, fields, oid, obj_url, img_url, description, title, artist, created, item, meta,
			loading = document.querySelector("#loading"),
			result = document.querySelector("#result"),
			json = JSON.parse(txt);


		// step 1: clear results list and control visibility
		while(result.firstChild) {
			result.removeChild(result.firstChild)
		}
		result.style.display = "block";
		loading.style.display = "none";
		
		
		// step 2: update results list with data (or hint)
		for(i=0; i < json.records.length; i++) {
		
			fields = json.records[i].fields;
		
			oid = fields.object_number;
			
			obj_url = VA_OBJECT_BASE_URL + oid;
		
			description = fields.object;
		
			// *** url to pre-processed 265 square crop image
			img_url = VA_IMAGE_BASE_URL + fields.primary_image_id.substr(0, 6) + "/"
										+ fields.primary_image_id + "_jpg_w.jpg";
			
			title = (fields.title && fields.title.length > 0) ? fields.title : "Untitled";
			artist = (fields.artist && fields.artist.length > 0) ? fields.artist : "Unknown";
			created = (fields.date_text && fields.date_text.length > 0) ? fields.date_text : "Undated";

			item = createDiv("item");
				item.appendChild(createImg(img_url, description));
					meta = createDiv("meta");
					meta.appendChild(createP("Title: " + title));
					meta.appendChild(createP("Artist: " + artist));
					meta.appendChild(createP("Date: " + created));
				item.appendChild(meta);
					action = createDiv("action");
					action.appendChild(createNotesButton(oid, img_url, description));
					action.appendChild(createMoreButton(obj_url));
				item.appendChild(action);
			result.appendChild(item);
		}		
	}

	
	function updateNotesList(statusCode, statusText, responseText) {

		// step 1: clear notes list and control visibility
		var notes_loading = document.querySelector("#notes_loading");
			notes_list = document.querySelector("#notes_list");

		while(notes_list.firstChild) {
			notes_list.removeChild(notes_list.firstChild)
		}
		notes_list.style.display = "block";
		notes_loading.style.display = "none";

		// step 2: update notes list with data (or hint)
		if(statusCode==200){
			
			// ok - content
			var i, item, notes_item, data = JSON.parse(responseText);
			for(i=0; i < data.length; i++) {
			
				item = data[i];
				notes_item = createDiv("notes_item");
				notes_item.appendChild(createP(item.name + " said:"));
				notes_item.appendChild(createP(item.notes));
				
				// reverse order: latest first
				if(i == 0) {
					notes_list.appendChild(notes_item);
				} else {
					notes_list.insertBefore(notes_item, notes_list.firstChild);
				}
			}						
			
		} else if(statusCode==204){  
			// ok - no content
			notes_list.appendChild(createP("No notes yet - be the first to add your notes"));
		} else {  
			// 400 bad request or 500 server error
			notes_list.appendChild(createP("Could not retrieve notes: " + statusText));
		} 
	}


	function createDiv(cls){
		var div = document.createElement("div");
		div.setAttribute("class", cls);
		return div;
	}
	function createP(txt){
		var p = document.createElement("p");
		p.textContent = txt;
		return p;
	}
	function createImg(src, description){
		var img = document.createElement("img");
		img.setAttribute("src", src);
		img.setAttribute("alt", description);
		return img;
	}
	function createMoreButton(url) {
		var div = createDiv("more");
		div.setAttribute("url", url);
		div.addEventListener("click", MoreShowListener);
		return div;
	}
	function createNotesButton(oid, img_url, description) {
		var div = createDiv("notes");
		div.setAttribute("oid", oid);
		div.setAttribute("img_url", img_url);
		div.setAttribute("description", description);
		div.addEventListener("click", NotesShowListener);
		return div;
	}

})();
