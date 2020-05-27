<?php
/*
* Author: Thijs Lacquet and Marleen van Gent
*/ 
include_once __DIR__.'/readdata.php';
include_once __DIR__.'/user.php';

$dir = dirname(__FILE__).'/../data/';
$expire = 24 * 3600; //Time before cookie/user expires in seconds; currently 1 day;

//Establish user
$myUser = new User($dir);
$user = $myUser->addUser();

//Remove expired users
$myUser->removeExpired();

//Upload file
if (count($_FILES["Upload_file"]["name"]) > 0) {
    for ($i = 0; $i < count($_FILES["Upload_file"]["name"]); $i++) {
        $filename = basename($_FILES["Upload_file"]["name"][$i]);
        $file = $dir . $user . '/' . $filename;
        
        if (strtoLower(pathinfo($file, PATHINFO_EXTENSION)) != 'csv') {
            die("Only CSV files allowed");
        }
        
        if (file_exists($file)) {
            die("File already exists");
        }
        
        if (!move_uploaded_file($_FILES["Upload_file"]["tmp_name"][$i], $file)) {
            die("Something went wrong while uploading");
        }
    }
}

//Read csv into database
$readdata = new Readdata();

$readdata->read($file, 200000, $user, $filename);

unset($readddata);
unset($myUser);

?>
