<?php
/*
	Author: Thijs Lacquet
*/

/*
* Connects to the mysql database and returns the connection. If an access denied error is given,
    it tries to connect without a password and echo's an error.
*/
function connectsql() {
	$mysql_connection = new mysqli('localhost', 'root', 'traffic');

	if ($mysql_connection->connect_errno) {
	    if (strpos($mysql_connection->connect_error, "Access denied for user") !== false) { //Access denied
	        $mysql_connection = new mysqli('localhost', 'root', ''); //Try to connect without password

	        if (!$mysql_connection->connect_errno) {
	            echo("Could not connect to the mysql database using the given password.
	                Succeeded connecting to the database without a pasword.<br>");
	            return $mysql_connection;
	        }
	    }
		die("Failed to connect to mysql: " . $mysql_connection->connect_error);
	}
	return $mysql_connection;
}

?>