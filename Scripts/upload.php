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

$errors = 0;
$statusMessage = "";

//Upload all files
if (count($_FILES["Upload_file"]["name"]) > 0) {
    for ($i = 0; $i < count($_FILES["Upload_file"]["name"]); $i++) {
        $filename = basename($_FILES["Upload_file"]["name"][$i]);
        $file = $dir . $user . '/' . $filename;
        $extension = strtoLower(pathinfo($file, PATHINFO_EXTENSION));
        if (!(in_array( $extension, array('jpg', 'jpeg', 'png', 'csv')))) {
            $statusMessage = $statusMessage . "File '" . $filename . "' is not a jpg, jpeg, png or csv file. Ignoring this file. <br>";
            $errors++;
        } else if (file_exists($file)) {
            $statusMessage = $statusMessage . "File '" . $filename . "' already exists. Ignoring this file. <br>";
            $errors++;
        } else if (!move_uploaded_file($_FILES["Upload_file"]["tmp_name"][$i], $file)) {
            $statusMessage = $statusMessage . "Something went wrong while uploading '" . $filename . "'. Ignoring this file. <br>";
            $errors++;
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
    $countImg = count(glob("../../data/" . $user . "/*.jpg")) + count(glob("../../data/" . $user . "/*.png"))
        + count(glob("../../data/" . $user . "/*.jpeg"));
    $countCsv = count(glob("../../data/" . $user . "/*.csv"));
    
    $statusMessage = $statusMessage . "You have $countImg images in total <br>";
    $statusMessage = $statusMessage . "You have $countCsv csv files in total <br>";
    $statusMessage = $statusMessage . "$errors files could not be uploaded";

    //If at least one image and csv is uploaded, and no errors occurred, direct the user to the visualization page, otherwise stay on the upload page
    if ($countImg > 0 && $countCsv > 0 && $errors == 0) {
        header("Location: /../test.htm");
    } else {
        header("Location: /../upload.htm");
    }
}
?>