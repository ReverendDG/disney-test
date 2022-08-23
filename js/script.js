//Global variables
var lastRowNum;
var selectedTile = '';
var selectedTileId = '';
var tilesInRow = [];
var rowNumbers = {};
var modalPresent = false;

// Go forth and bringeth back the data!
fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
  .then((response) => response.json()) // Make it easily readable.
  .then((data) => {
      // Create the main div and insert it into the body.
      var mainSection = document.createElement("div");
      mainSection.setAttribute("id", "main");
      document.body.appendChild(mainSection);

      var rows = data.data.StandardCollection.containers;
      var sectionNumber = 0; // This is just a fallback id number in case we, somehow, don't have a ref/set id.
      var rowNum = 1; // We start with one to make it easier to navigate.
      lastRowNum = rows.length; // For navigational purposes. We'll need to know that we can't go further than the bottom.

      rows.forEach(element => {
        // Add the main row...
        var newSection = document.createElement("div"); // Create a new grouping.
        let sectionId = "section-"; // Create an ID for this section. This really isn't used in this project, but it seemed like a good idea, on a grander scale, for each one to have a unique ID.
        let rowId = ''; // This will be used in navigation to know where we're jumping to when we jump rows.
        if (element.set.refId) {
          rowId = element.set.refId;
        }
        else if (element.set.setId) {
          rowId = element.set.setId;
        } 
        else { // Again, fallback. We should never really hit this block.
          rowId = sectionNumber;
          sectionNumber++;
        }

        // Set the row nums above it all to keep it in order.
        // If we do it below, the delay caused by the various fetches can corrupt the order of the numbering and cause erratic jumping when navigating through sections.
        rowNumbers[rowId] = rowNum;
        rowNum++;

        sectionId = sectionId + rowId;

        newSection.setAttribute("id", sectionId);
        newSection.classList.add("category-section");

        // Add the section title...
        var newSectionTitle = document.createElement("div");
        var sectionTitle = document.createTextNode(element.set.text.title.full.set.default.content);
        newSectionTitle.classList.add("section-title");
        newSectionTitle.appendChild(sectionTitle); // Add section title text to section title div...
        newSection.appendChild(newSectionTitle); // Add section title div to section div...

        // Add titles to the section...
        // We get the titles different ways depending on the section...

        // If we have a refId, we need to go out and fetch the data from elsewhere....
        if (element.set.refId) {
          let newTitleTiles = document.createElement("div"); // Create a new tile section.
          newTitleTiles.classList.add("tile-row");
          var tileNumber = 1; // This is the number given to each tile in the row.

          let dataUrl = 'https://cd-static.bamgrid.com/dp-117731241344/sets/' + element.set.refId + '.json';
          fetch(dataUrl)
          .then((response) => response.json())
          .then((showData) => {
            let titlelist = findTheThing(showData.data, 'items'); // First we need to find the list of titles.
            let thisRowNum = rowNumbers[element.set.refId]; // We need to know which row number this is.
            tilesInRow[thisRowNum] = titlelist.length; // This keeps track of how many tiles we have in each row so we know, during navigation, when to round the corner.

            newTitleTiles.setAttribute("id", `row_${thisRowNum}`);

            titlelist.forEach(titleinfo => {
              var tileId = `${thisRowNum}_${tileNumber}`; // Create a unique ID for each title.
              let imgurlObj = titleinfo.image.tile['1.78']; // Based on looking through the data, I determined that this was the object that held the appropriate image url.
              let imgUrl = findTheThing(imgurlObj, 'url'); // The object structure is not consistent, so we need this function to nail down the image url.

              // Create a new image tile for this title.
              let newTile = document.createElement("div");
              newTile.classList.add("title-tile");
              newTile.setAttribute("id", tileId);

              // Attach the actual title to this tile.
              let titlesrc = titleinfo.text.title.full;
              let title = findTheThing(titlesrc, 'content');
              newTile.title = title;
  
              // Attach the rating, if it exists, to this tile.
              newTile.rating = '';
              if (titleinfo.ratings) { // Collections and the like don't have ratings.
                let rating = titleinfo.ratings[0].value; // This is an assumption/educated guess, based on reviewing the JSON.
                newTile.rating = rating;
              }
  
              // Add an easy way to identify the final tile in the row.
              if (tileNumber === titlelist.length) {
                newTile.classList.add("last-tile");
              }

              // Add the actual image.
              let tileImg = document.createElement("img");
              tileImg.src = imgUrl;
              tileImg.setAttribute("id", `${tileId}_img`); // Set the img id, which we'll need later.
              newTile.appendChild(tileImg);
              newTitleTiles.appendChild(newTile); // Add tile to row...

              // Increment the tile number.
              tileNumber++;
            });

            newSection.appendChild(newTitleTiles); // Add tile row to section div...
          });
        }
        // If we have a setId, that means the data is already here...
        else if (element.set.setId) {
          let newTitleTiles = document.createElement("div"); // Create a new tile section.
          newTitleTiles.classList.add("tile-row");
          var tileNumber = 1; // This is the number given to each tile in the row.

          // Create a new tile for each title...
          let titlelist = element.set.items; // No need to go out looking for the data, it's all right here!
          let thisRowNum = rowNumbers[element.set.setId];
          tilesInRow[thisRowNum] = titlelist.length;

          newTitleTiles.setAttribute("id", `row_${thisRowNum}`);

          titlelist.forEach(titleinfo => {

            var tileId = `${thisRowNum}_${tileNumber}`;
            let imgurlObj = titleinfo.image.tile['1.78']; // Same as above
            let imgUrl = findTheThing(imgurlObj, 'url'); // Same as above

            // Create a new tile for the title
            let newTile = document.createElement("div");
            newTile.classList.add("title-tile");
            newTile.setAttribute("id", tileId);
            let titlesrc = titleinfo.text.title.full;
            let title = findTheThing(titlesrc, 'content');
            newTile.title = title;

            newTile.rating = '';

            if (titleinfo.ratings) { // Collections and the like don't have ratings.
              let rating = titleinfo.ratings[0].value; // This is an assumption/educated guess, based on reviewing the JSON.
              newTile.rating = rating;
            }

            // Add a way to identify the final tile in the row.
            if (tileNumber === titlelist.length) {
              newTile.classList.add("last-tile");
            }

            // Add the actual image.
            let tileImg = document.createElement("img");
            tileImg.src = imgUrl;
            tileImg.setAttribute("id", `${tileId}_img`); // Set the img id, which we'll need later.
            newTile.appendChild(tileImg);
            newTitleTiles.appendChild(newTile); // Add tile to row...

            // Increment the tile number
            tileNumber++;
          });

          newSection.appendChild(newTitleTiles); // Add tile row to section div...

        }
        // On the off chance we don't have a refId or setId.
        else {
          let newTitleTiles = document.createElement("div"); // Create a new tile section.
          newTitleTiles.classList.add("tile-row");

          // Create a new tile for each title...
          let newTile = document.createElement("div");
          newTile.classList.add("title-tile");
          let cntnt = document.createTextNode("Nothing here. :( ");
          newTile.appendChild(cntnt); // Add content to tile...

          newTitleTiles.appendChild(newTile); // Add tile to row...

          newSection.appendChild(newTitleTiles); // Add tile row to section div...
        }

        // Add the new section to the main div.
        mainSection.appendChild(newSection);

      });

      // Once everything is loaded, we set an interval to check that all images really are there...
      imgInterval = setInterval(() => {
        fixImages();
      }, "100")
  });

// Useful Functions

// This goes through the images and checks their widths as they complete. 
// We are making the assumption that a 16px wide image is a broken image and we replace it.
function fixImages() {
  var counter = 0;
  var imgs = document.images;

  [].forEach.call( imgs, function( img ) {
    if(img.complete){
      if (img.width === 16) {
        img.src = 'images/not-found.gif';
      }
      counter++;
    }
  });

  // Once we've established that all the images have completed, we stop the interval since we don't want this to go on forever.
  if (counter >= imgs.length) {
    clearInterval(imgInterval);
  }
}

// The JSON tree is not consistent, so we can't always directly path to the thing we're looking for. So, we use this to find it.
function findTheThing(haystack, needle) {
  var result = null;
  for(var prop in haystack) {

    if(prop == needle) {
      return haystack[prop];
    }

    if(haystack[prop] instanceof Object) {
      result = findTheThing(haystack[prop], needle);
      if (result) {
        break;
      }
    } 
  }
  return result;
}

// Navigational Code
// This prevents scrolling with the mouse wheel - which would mess up where we are in the navigation.
document.addEventListener('wheel', preventScroll, {passive: false});

function preventScroll(e){
    e.preventDefault();
    e.stopPropagation();

    return false;
}

// This listens out for the keys we want to use.
document.addEventListener('keydown', (event) => {
  if (modalPresent === false) { // If the title modal is not open, the only keys that should do anything are the arrow keys and Enter.
    if (event.key.match('Arrow')) {
      event.preventDefault();
      processArrowKey(event);
    }
    else if (event.key.match('Enter')) {
      processEnterKey(event);
    }
    else { // Any other key should be disabled.
      event.preventDefault();
      event.stopPropagation();
    }
  }
  else if (event.key.match('Backspace')) { // If the modal is open, the only valid key is a Backspace.
    processBackSpaceKey(event);
  }
  else { // Everything else we want to disable.
    event.preventDefault();
    event.stopPropagation();
  }
}, false);

// This uses the arrow keys to navigate the page.
function processArrowKey(event) {
  let tmpArray = []; // This will be used to hold the id info of the selected tile.
  let newRow; // This will hold the ID of the new row to navigate to in the case of an up/down arrow.
  let nextTile; // This will hold the ID of the new tile to navigate to in the case of a left/right arrow.
  var windowWidth =  document.documentElement.clientWidth; // We need to keep track of this to make sure selected tiles are in view.
  var windowHeight = document.documentElement.clientHeight; // We need to keep track of this to make sure selected rows are in view.

  if (event && event.key) {
    if (event.key === 'ArrowLeft') {
      // If this is the first key pressed, we set the selected tile to the top left tile....
      if (selectedTile === '') {
        selectedTileId = '1_1';  
        selectedTile = document.getElementById(selectedTileId);
        selectedTile.classList.add("active");
        tmpArray = selectedTileId.split('_');
      }
      // Otherwise, we jump backwards to the previous tile
      else {
        tmpArray = selectedTileId.split('_');
        // If we're on the first tile and need to swing around to the end of the row...
        if (parseInt(tmpArray[1]) === 1) {
          nextTile = tilesInRow[parseInt(tmpArray[0])];
          selectedTileId = `${tmpArray[0]}_${nextTile}`;
        } 
        // Otherwise, just jump back one
        else {
          nextTile = parseInt(tmpArray[1]) - 1;
          selectedTileId = `${tmpArray[0]}_${nextTile}`;
        }

        // Remove the active class, select the new tile, and add the active class to the new tile
        selectedTile.classList.remove("active");
        selectedTile = document.getElementById(selectedTileId);
        selectedTile.classList.add("active");
      }

      // If we're now on a tile that's out of view and needs to come into view...
      let thisRow = document.getElementById('row_' + tmpArray[0]);

      // Either shift the appropriate amount...
      if (selectedTile.offsetLeft < (thisRow.offsetLeft * -1)) {
        let newLeft = (selectedTile.offsetLeft - 5) * (-1);
        thisRow.style.left = `${newLeft}px`;
      }
      // Or jump the row to the end if we're rounding the corner
      else if (selectedTile.classList.contains('last-tile')) {
        let newLeft = (selectedTile.offsetLeft - 5) * (-1);
        thisRow.style.left = `${newLeft}px`;
      }
    }

    if (event.key === 'ArrowRight') {
      // If this is the first key pressed...
      if (selectedTile === '') {
        selectedTileId = '1_1'; 
        selectedTile = document.getElementById(selectedTileId);
        selectedTile.classList.add("active");
        tmpArray = selectedTileId.split('_');
      }
      // Otherwise, we jump forward to the next tile
      else {
        tmpArray = selectedTileId.split('_');
        // If we're on the last tile and need to swing around to the beginning of the row...
        if (selectedTile.classList.contains('last-tile')) {
          nextTile = 1;
          selectedTileId = `${tmpArray[0]}_1`;
        } 
        // Otherwise, just jump forward one
        else {
          nextTile = parseInt(tmpArray[1]) + 1;
          selectedTileId = `${tmpArray[0]}_${nextTile}`;
        }

        // Remove the active class, select the new tile, and add the active class to the new tile
        selectedTile.classList.remove("active");
        selectedTile = document.getElementById(selectedTileId);
        selectedTile.classList.add("active");
      }

      // If we're now on a tile that's out of view and needs to come into view...
      let thisRow = document.getElementById('row_' + tmpArray[0]);

      // Either just shift the tile into view...
      if (thisRow.offsetLeft + selectedTile.offsetLeft + 300 > windowWidth) {
        let newLeft = thisRow.offsetLeft - 400;
        thisRow.style.left = newLeft + 'px';
      }
      // Or jump back to the beginning of the row if we're rounding the corner
      if (thisRow.offsetLeft < 0 && selectedTile.offsetLeft < (thisRow.offsetLeft * -1)) {
        thisRow.style.left = '0px';
      }
    }

    if (event.key === 'ArrowUp') {
      // If this is the first key pressed...
      if (selectedTile === '') {
        selectedTileId = '1_1'; 
        selectedTile = document.getElementById(selectedTileId);
        selectedTile.classList.add("active");
        newRow = 1;
      }
      // Otherwise, just jump up a row
      else {
        tmpArray = selectedTileId.split('_');
        // If we're not on the first row already...
        if (tmpArray[0] > 1) {
          newRow = parseInt(tmpArray[0]) - 1;
          selectedTileId = `${newRow}_1`;
          selectedTile.classList.remove("active");
          selectedTile = document.getElementById(selectedTileId);
          selectedTile.classList.add("active");
        }
        // Otherwise, just stay on the first row
        else {
          newRow = 1;
        }
      }

      // When changing rows, we always jump it back to the beginning of the row
      let thisRow = document.getElementById('row_' + newRow);
      thisRow.style.left = '0px';

      // We need to check if the selected row is in view, and shift the screen if needed
      var maindiv = document.getElementById('main');
      
      if (maindiv.offsetTop + thisRow.offsetTop < 0) {
        if (!(maindiv.style.top )) {
          maindiv.style.top = '-225px';
        }
        else {
          let newTop = maindiv.offsetTop + 225;
          maindiv.style.top = newTop + 'px';            
        }
      }
    }

    if (event.key === 'ArrowDown') {
      // If this is the first key pressed...
      if (selectedTile === '') {
        selectedTileId = '1_1'; 
        selectedTile = document.getElementById(selectedTileId);
        selectedTile.classList.add("active");
        newRow = 1;
      }
      // Otherwise, just go down a row
      else {
        tmpArray = selectedTileId.split('_');
        // If we're not already on the last row
        if (lastRowNum > tmpArray[0]) {
          newRow = parseInt(tmpArray[0]) + 1;
          selectedTileId = `${newRow}_1`;
          selectedTile.classList.remove("active");
          selectedTile = document.getElementById(selectedTileId);
          selectedTile.classList.add("active");
        }
        // Otherwise, just stay here on the last row
        else {
          newRow = lastRowNum;
        }
      }

      // We always jump to the beginning of the row on a row change
      let thisRow = document.getElementById('row_' + newRow);
      thisRow.style.left = '5px';

      // We need to check if the new row in view, and shift the screen if needed
      var maindiv = document.getElementById('main');
      
      if (maindiv.offsetTop + (thisRow.offsetTop + 225) > windowHeight) {
        if (!(maindiv.style.top )) {
          maindiv.style.top = '-225px';
        }
        else {
          let newTop = maindiv.offsetTop - 225;
          maindiv.style.top = newTop + 'px';            
        }
      }
    }
  }
}

// This selects the highlighted tile and pops up a modal with more information.
function processEnterKey(event) {
  if (modalPresent === false) { // Only if there isn't already a modal open.
    displayTitleInfo(selectedTile);
    modalPresent = true;
  }
}

// This closes the open modal.
function processBackSpaceKey(event) {
  if (modalPresent === true) { // Checks to make sure the modal is open.
    let modalDiv = document.getElementById('modal-bg');
    modalDiv.remove();
    modalPresent = false;
  }
}

// This pops open the modal and displays more information about the selected title.
function displayTitleInfo (theTile) {
  let titleImage = document.getElementById(`${theTile.id}_img`);
  let titleImageSrc = titleImage.src;

  // Create the modal overlay
  let modalDiv = document.createElement("div");
  modalDiv.setAttribute("id", "modal-bg");

  // Create the modal info portion
  let modalInfoDiv = document.createElement("div");
  modalInfoDiv.classList.add("modal-content");

  // Add the image
  let modalImg = document.createElement("img");
  modalImg.src = titleImageSrc;
  modalInfoDiv.appendChild(modalImg);

  // Add the title
  let modalTitle = document.createTextNode(theTile.title);
  let modalTitleDiv = document.createElement("div");
  modalTitleDiv.classList.add("modal-title");
  modalTitleDiv.appendChild(modalTitle);
  modalInfoDiv.appendChild(modalTitleDiv);

  // Add the rating
  if (theTile.rating !== '') {
    let modalRating = document.createTextNode(`Rating: ${theTile.rating}`);
    let modalRatingDiv = document.createElement("div");
    modalRatingDiv.classList.add("modal-rating");
    modalRatingDiv.appendChild(modalRating);
    modalInfoDiv.appendChild(modalRatingDiv);
  }

  // Add the footer
  let modalFooter = document.createTextNode('Press the [Backspace] button to return to title list');
  let modalFooterDiv = document.createElement("div");
  modalFooterDiv.classList.add("modal-footer");
  modalFooterDiv.appendChild(modalFooter);
  modalInfoDiv.appendChild(modalFooterDiv);
   
  modalDiv.appendChild(modalInfoDiv);

  document.body.appendChild(modalDiv);
}