/***************************************** //
// This Javascript file is created to hold //
// the different general utilities that    //
// affect images.                          //
// *****************************************/

// Edit Image -> Suppose already have one
// User will need to input:
//		ImageElement
//		Can get Location Element

//Initializes image events (copied from ParticipantView.js)
	function addImageEvents(){
		var cvsUpld = document.getElementById("uploadImg"),
			ctxUpld = cvsUpld.getContext("2d"),
			cvsSave = document.getElementById("saveImg"),
			ctxSave = cvsSave.getContext("2d"),
			img 	= document.createElement("img"),
			zoom 	= 1,
			maxZoom	= 0,
			zoomSpd = .3;
			stop 	= false;
		
		//Prevents browser from taking the picture link and displaying it
		$("#createEventView").on("dragover", function(e) {
			e.preventDefault();
		}, false);

		//Enables drag and drop
		cvsUpld.addEventListener("dragover", function(e) {
			e.preventDefault();
		}, false);
		
		//Waits for image to be dropped and then load
		img.addEventListener("load", function() {
			ctxUpld.drawImage(img, 0, 0, cvsUpld.width, cvsUpld.height);
		}, false);
		
		//Handles dropped image (currently reading all drops in entire body)
		//Can use jquery to get drop zone instead of document.getElementById("body")
		var loadImage = function(e) {
			var files = e.target.files;			//For input
			if (typeof files == "undefined") {
				files = e.dataTransfer.files;	//For drag and drop
			}
			if (files.length > 0) {
				var file = files[0];
				if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
					var reader = new FileReader();
					reader.onload = function (e) {
						img.src = e.target.result;
					};
					reader.readAsDataURL(file);
				}
			}
			e.preventDefault();
		};
		$("#createEventView").on("drop", loadImage, false);
		document.getElementById("uploadBtn").addEventListener("change", loadImage, false);

		//Follows the mouse on the upload canvas and displays in the save canvas
		//Uses other form in order to use when zooming in
		var selectImg = function(e) {
			if (!stop) {
				//Determines origin and transformation locations and sizes
				var rect = cvsUpld.getBoundingClientRect(),
					originX = (e.clientX-rect.left) * (img.width/cvsUpld.width) - (cvsSave.width*zoom/2),
					originY = (e.clientY-rect.top) * (img.height/cvsUpld.height) - (cvsSave.height*zoom/2),
					originW = cvsSave.width * zoom,
					originH = cvsSave.height * zoom,
					transfX = 0,
					transfY = 0,
					transfW = cvsSave.width,
					transfH = cvsSave.height;
				//If it goes out of bounds because the area of the saveImage canvas is too big
				if (originX < 0) {
					//transfX = -originX/zoom; //Show whitespace, comment out to stop at edge
					originX = 0;
				}
				if (originY < 0) {
					//transfY = -originY/zoom; //Show whitespace, comment out to stop at edge
					originY = 0;
				}
				if (img.width < originX + originW) {
					//transfW = (img.width - originX)/zoom;	//Show whitespace
					originX = img.width - originW;		//Switch code to stop at edge
				}
				if (img.height < originY + originH) {
					//transfH = (img.height - originY)/zoom;	//Show whitespace
					originY = img.height - originH;		//Switch code to stop at edge
				}
				//Clears the saveImage canvas
				ctxSave.clearRect(0, 0, cvsSave.width, cvsSave.height);
				//Draws onto the saveImage canvas
				ctxSave.drawImage(img, originX, originY, originW, originH, transfX, transfY, transfW, transfH);
			}
		};
		cvsUpld.addEventListener("mousemove", selectImg);	
		
		//Sets the upper boundary of zoom for Firefox's sake AFTER image loads
		img.addEventListener("load", function(){
			zoom = 1;
			maxZoom = img.width/cvsSave.width;
			if (maxZoom > img.height/cvsSave.height) {
				maxZoom = img.height/cvsSave.height;
			}
		}, false);
			
		//Zooms in and out, boundaries are for firefox
		cvsUpld.addEventListener("wheel", function(e) {
			if (e.deltaY < 0){
				if (zoom + zoomSpd < maxZoom) {
					zoom += zoomSpd;  
				}
			} else {
				if (zoom > zoomSpd){
					zoom -= zoomSpd;
				}
			};
			//Rounds the number
			zoom = Math.round(zoom * 100) / 100; 
			//Updates the picture after zooming
			selectImg(e); 
		}, false);

		//Stops the save canvas from following the mouse
		cvsUpld.addEventListener("click", function() {
			stop = !stop;
		}, false);

		//Saves the image as a quadrilateral png
		$("#saveButton").click(function(user) {
			var data = cvsSave.toDataURL("image/png");
			var image = data.replace('data:image/png;base64,', '');
			var imgJSON = '{"data":"' + image + '","extension":"png","ownerid":"' + gLoginUserId + '"}';
			$.ajax({
				type: 'POST',
				url: 'creator/upload',
				data: imgJSON,
				contentType: 'application/json',
				dataType: 'json',
				complete: function(xhr) {
					if (xhr.status == 200) {
						$('#editProfileImage').css('background-image','url(' + data + ')');
						$("#participant-show").toggle( "slow", function() {	});
					} else {
						alert("Image not uploaded");
					}
				}
			});
		});
	}