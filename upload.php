<?php
/*
* Author: Thijs Lacquet and ??
*/ 
include_once __DIR__.'/readdata.php';
include_once __DIR__.'user.php';

$dir = dirname(__FILE__)."/CSV/";
$expire = 24 * 3600; //Time before cookie/user expires in seconds; currently 1 day

//Establish user
$myUser = new User($dir);
$user = $myUser->addUser();

//Remove expired users
$myUser->removeExpired();

//Upload file
$filename = basename($_FILES["Upload_file"]["name"]);
$file = $dir . $user . '/' . $filename;

if(strtolower(pathinfo($file, PATHINFO_EXTENSION)) != "csv"){
	die("Only CSV files allowed");
}

if(file_exists($file)){
	die("File already exists");
}

if(!move_uploaded_file($_FILES["Upload_file"]["tmp_name"], $file)){
	die("Something went wrong while uploading");
}

//Read csv into database
$readdata = new Readdata();

$readdata->read($file, 200000, $user, $filename);

unset($readddata);
unset($myUser);

?>
