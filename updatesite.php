<?php
/*
	Author: Thijs Lacquet
*/

$error = Array();

exec("~/updatesite", $error);

var_dump($error);

?>