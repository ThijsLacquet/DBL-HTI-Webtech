<?php
/*
	Author: Thijs Lacquet
*/

require '../sql.php';

function openimage($path) {
	$img = imagecreatefromjpeg($path);

	if (! $img) {
		die("Image could not be opened");
	}
	
	return $img;
}

//header("Content-type: image/jpg");
//imagejpeg(openimage("../Provided_data/stimuli/01_Antwerpen_S1.jpg"));


?>