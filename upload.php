<?php

$dir = dirname(__FILE__)."/CSV/";
$file = $dir . basename($_FILES["Upload_file"]["name"]);


if(strtolower(pathinfo($file, PATHINFO_EXTENSION)) != "csv"){
	die("Je kan alleen CSV-files uploaden");
}


if(file_exists($file)){
	die("File bestaat al");
}

if(!move_uploaded_file($_FILES["Upload_file"]["tmp_name"], $file)){
	die("Er ging iets mis met uploaden");
}

?>