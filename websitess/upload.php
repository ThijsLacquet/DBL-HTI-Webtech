<?php

$dir = dirname(__FILE__)."/CSV/";
$file = $dir . basename($_FILES["Upload_file"]["name"]);


if(strtolower(pathinfo($file, PATHINFO_EXTENSION)) != "csv"){
	die("Only CSV files allowed");
}

if(file_exists($file)){
	die("File already exists");
}

if(!move_uploaded_file($_FILES["Upload_file"]["tmp_name"], $file)){
	die("Something went wrong while uploading");
}

?>
