<?php
/*
	Author: Thijs Lacquet
*/
$address = 'localhost';
$username = 'root';
$password = '';

function connectsql() {
	$mysql_connection = new mysqli('localhost', 'root', '');

	if ($mysql_connection->connect_errno) {
		die("Failed to connect to mysql: " . $mysql_connection->connect_error);
	}
	return $mysql_connection;
}

?>