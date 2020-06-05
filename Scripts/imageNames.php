<?php
//Author: Marleen van Gent
include_once 'user.php';

$dir = dirname(__FILE__)."/../../data/"; //Directory with uploaded data

$myUser = new User($dir);
$user = $myUser->addUser();


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

?>