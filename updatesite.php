<?php
/*
	Author: Thijs Lacquet

	Updates the online site by executing a batch script on the webserver which pulls the master branch
*/

$error = Array();

exec("~/updatesite", $error);

var_dump($error);

?>