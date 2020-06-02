<?php
/*
* Author: Thijs Lacquet and Marleen van Gent
*/ 
include_once 'readdata.php';
include_once 'user.php';

$dir = dirname(__FILE__)."/../../data/"; //Directory with uploaded data
$expire = 24 * 3600; //Time before cookie/user expires in seconds; currently 1 day

if (!file_exists($dir)) {
	die("Please make the data folder outside the repository");
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
        if (!(in_array( $extension, array('jpg', 'jpeg', 'csv')))) {
            die("Only CSV, JPG, and JPEG files are allowed");
        }

        if (file_exists($file)) {
            die("File already exists");
        }
        
        if (!move_uploaded_file($_FILES["Upload_file"]["tmp_name"][$i], $file)) {
            die("Something went wrong while uploading");
        }
        
        //Read csv into database
        if ($extension == 'csv') {
            $readdata = new Readdata();
            $readdata->read($file, 200000, $user, $filename);
            unset($readdata);
            unset($myUser);
        }
    }
    
    $dataNames = array();
    $files = [];
    $images = preg_grep('/\.(jpg|jpeg)(?:[\?\#].*)?$/i', $files);
    
    if ($handle = opendir($dir . $user)) {
        
        while (false !== ($entry = readdir($handle))) {
            $files[] = $entry;
        }
        $imagesName = preg_grep('/\.jpg$/i', $files);
        
        foreach($imagesName as $imageName)
        {
            $dataNames[] = $imageName.'<br/>';
        }
        closedir($handle);
    }
    
    $dataImages = json_encode($dataNames);
    
    echo $dataImages;
}


?>
