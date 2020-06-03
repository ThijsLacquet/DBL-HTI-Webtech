<?php
$dataNames = array();
$files = [];
$images = preg_grep('/\.(jpg|jpeg|png|gif)(?:[\?\#].*)?$/i', $files);

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
print_r($dataNames);

$dataImages = json_encode($dataNames);

echo $dataImages;

?>