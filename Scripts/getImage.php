<?php
    include_once 'user.php';

    $dir = dirname(__FILE__)."/../../data/"; //Directory with uploaded data

    //Establish user
    $myUser = new User($dir);
    $user = $myUser->addUser();

    header('Content-Type: image/jpg');

    readfile("../../data/" . $user . "/" . $_GET['img']);
?>