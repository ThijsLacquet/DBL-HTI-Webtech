<?php
/*
	Author: Thijs Lacquet
*/

require 'sql.php';

set_time_limit(600); //Allows this script to run for a maximum of 5 minutes

//TODO optimize database memory usage
//Create database and tables if they do not exist yet
$mysql_connection = connectsql();

if (! $mysql_connection->query("CREATE DATABASE IF NOT EXISTS fixationdata")) {
	die('Could not create mysql database fixationdata: ' . $mysql_connection->error);
}

if ( $mysql_connection->query("DESCRIBE fixationdata.fixationdata")) {
	die('This table already exists');
}

if (! $mysql_connection->query("
	CREATE TABLE IF NOT EXISTS fixationdata.fixationdata(
	entry_id INT(32) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	timestamp INT(32) NOT NULL,
	stimuliname VARCHAR(50) NOT NULL,
	fixationindex INT(32) NOT NULL,
	fixationduration INT(32) NOT NULL,
	mappedfixationpointx INT(32) NOT NULL,
	mappedfixationpointy INT(32) NOT NULL,
	user VARCHAR(50) NOT NULL,
	description VARCHAR(50) NOT NULL
	)")) {
		
	die('Could not create mysql table fixationdata: ' . $mysql_connection->error);
}

//Read csv file
//TODO use user uploaded csv file
$input = fopen("Provided_data/all_fixation_data_cleaned_up.csv", "r") or die("File could not be opened");

fgets($input); //Skip first line in file

while (!feof($input)) {
	$line = explode('	', fgets($input));
	
	//TODO nice error message if input is in the wrong format
	//TODO prevent SQL injection
	if (! $mysql_connection->query("
		INSERT INTO fixationdata.fixationdata(timestamp, stimuliname, fixationindex, fixationduration,
		mappedfixationpointx, mappedfixationpointy, user, description)
		VALUES('$line[0]', '$line[1]', '$line[2]', '$line[3]', '$line[4]', '$line[5]', '$line[6]', '$line[7]')")) {
			
		die('sql error: ' . $mysql_connection->error);
	}
}

fclose ($input);
$mysql_connection->close();
?>