// An array to hold all the images to load
var allImages = new Array();
// The number of images to load simultaneously
var imageStackSize = 5;
//TODO: create a class for the images that failed to load
function getOffset(img) {
    var x = 0;
    var y = 0;
    while (img && !isNaN(img.offsetLeft) && !isNaN(img.offsetTop)) {
        x += img.offsetLeft - img.scrollLeft;
        y += img.offsetTop - img.scrollTop;
        img = img.offsetParent;
    }
    return { top: y, left: x };
}
// Sort element from top to bottom and left to right
function ySort(img1, img2) {
    var diff = getOffset(img2).top - getOffset(img1).top;
    if (diff == 0) {
        diff = getOffset(img2).left - getOffset(img1).left;
    }
    return diff;
}

// Called when finished loading, display the image and pop another one in the stack
function loadingDone(img) {
    jQuery(img).fadeOut(0).attr("src", jQuery(img).attr("data-src")).fadeIn(600, function () {
        jQuery(img).removeClass("loading");
    });
    jQuery(img).removeAttr("data-src");
    if (allImages.length > 0) {
        load(allImages.pop());
    }
}

//Load the image
function load(img) {
    //jQuery(img).attr("style", "border:1px solid black");
    var objImage = new Image();
    objImage.onload = function () { loadingDone(img); };
    objImage.src = jQuery(img).attr("data-src");
}

jQuery(document).ready(function () {
    // Put all the images with data-src in a stack
    jQuery("img").each(function () {
        if (this.hasAttribute("data-src")) {
            allImages.push(this);
            jQuery(this).addClass("loading");
        }
    });
    allImages.sort(ySort);

    // start loading the first images
    if (allImages.length > 0) {
        for (var i = 0; i < imageStackSize; i++) {
            load(allImages.pop());
        }
    }
});