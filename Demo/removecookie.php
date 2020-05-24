<?php
/*
* Author: Thijs Lacquet
* Removes the user cookie for testing
*/ 
include_once '../Scripts/user.php';

setcookie(COOKIE_NAME, 0); //Sets the expire time at 0, so the cookie expires

?>