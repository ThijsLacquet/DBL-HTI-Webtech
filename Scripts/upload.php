<?php
/*
* Author: Thijs Lacquet and Marleen van Gent
*/ 
include_once 'readdata.php';
include_once 'user.php';

$dir = dirname(__FILE__)."/../../data/"; //Directory with uploaded data
$expire = 24 * 3600; //Time before cookie/user expires in seconds; currently 1 day

if (!file_exists($dir)) {
	mkdir($dir);
}

//Establish user
$myUser = new User($dir);
$user = $myUser->addUser();

//Remove expired users
$myUser->removeExpired();

//Upload all files
if (count($_FILES["Upload_file"]["name"]) > 0) {
    for ($i = 0; $i < count($_FILES["Upload_file"]["name"]); $i++) {
        $filename = basename($_FILES["Upload_file"]["name"][$i]);
        $file = $dir . $user . '/' . $filename;
        $extension = strtoLower(pathinfo($file, PATHINFO_EXTENSION));
        if (!(in_array( $extension, array('jpg', 'jpeg', 'png', 'csv')))) {
            echo("File '" . $file . "' is not a jpg, jpeg, png or csv file. Ignoring this file. <br>");
            //die("Only CSV, JPG, JPEG, and PNG files are allowed");
        } else if (file_exists($file)) {
            echo("File '" . $file . "' already exists. Ignoring this file. <br>");
            //die("File already exists");
        } else if (!move_uploaded_file($_FILES["Upload_file"]["tmp_name"][$i], $file)) {
            echo("Something went wrong while uploading '" . $filename . "'. Ignoring this file. <br>");
            //die("Something went wrong while uploading");
        } else { //No problems with uploading
            //Read csv into database
            if ($extension == 'csv') {
                $readdata = new Readdata();
                $readdata->read($file, 200000, $user, $filename);
                unset($readdata);
                unset($myUser);
            }
        }
    }
    $countImg = count(glob("../../data/" . $user . "/*.jpg"));
    $countCsv = count(glob("../../data/" . $user . "/*.csv"));
    
    echo "You have $countImg images in total";
    echo "You have $countCsv files in total";
}


?>
