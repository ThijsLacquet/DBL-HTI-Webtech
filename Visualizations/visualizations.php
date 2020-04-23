<?php
/*
	Author: Thijs Lacquet
*/

/*
*	Opens the image on the given path and returns it
*/
function openimage($path) {
	//TODO support more image types
	switch (exif_imagetype ($path)) {
		case IMAGETYPE_JPEG :
			$img = imagecreatefromjpeg($path);
			break;
		case IMAGETYPE_PNG :
			$img = imagecreatefrompng($path);
			break;
		case IMAGETYPE_GIF :
			$img = imagecreatefromgif($path);
			break;
		default :
			echo "error";
			die("Image must be a jpg, png or gif");
	}

	if (! $img) {
		die("Image could not be opened");
	}
	
	return $img;
}

//header("Content-type: image/jpg");
//imagejpeg(openimage("../Provided_data/stimuli/01_Antwerpen_S1.jpg"));

?>