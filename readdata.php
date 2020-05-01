<?php
/*
	Author: Thijs Lacquet
*/
echo "start <br>";

require 'sql.php';

$path = "Provided_data/all_fixation_data_cleaned_up.csv";

set_time_limit(600); //Allows this script to run for a maximum of 5 minutes

//TODO optimize database memory usage
//Create database and tables if they do not exist yet
$mysql_connection = connectsql();

if (! $mysql_connection->query("CREATE DATABASE IF NOT EXISTS fixationdata")) {
	die('Could not create mysql database fixationdata: ' . $mysql_connection->error);
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


$data = file($path);
$n_lines = count($data);
$linesperquery = 10000;

$line = array();

for ($i = 0; $i < $n_lines; $i = $i = $i + 1) {
	$line[$i] = explode('	', $data[$i]);
}


for ($i = 1; $i < $n_lines; $i = $i + $linesperquery) { 
	$linestoinsert = $linesperquery;
	
	if ($n_lines - $i < $linestoinsert) {
		$linestoinsert = $n_lines - $i;
	}
	
	$query = 'INSERT INTO fixationdata.fixationdata(timestamp, stimuliname, fixationindex, fixationduration,
		mappedfixationpointx, mappedfixationpointy, user, description)VALUES';
	
	for ($offset = 0; $offset < $linestoinsert; $offset = $offset + 1) {
		$query .= '(';
		
		for ($column = 0; $column < 8; $column = $column + 1) {
			$query .= "'";
			$query .= $line[$i + $offset][$column];
			$query .= "'";
			if ($column != 7) {
				$query .= ',';
			}
		}
		$query .= ')';
		
		if ($offset != $linestoinsert - 1) {
			$query .= ',';
		}
	}
	
	//echo $query;
	//echo '<br>', '<br>';
	
	
	if (! $mysql_connection->query($query)) {
		die('sql error: ' . $mysql_connection->error);
	}
}

/*
//Read csv file
//TODO use user uploaded csv file
$input = fopen($path, "r") or die("File could not be opened");

while (!feof($input)) {
	$line = explode('	', fgets($input));
	echo $line[0];
	//TODO nice error message if input is in the wrong format
	//TODO prevent SQL injection
	if (! $mysql_connection->query("
		INSERT INTO fixationdata.fixationdata(timestamp, stimuliname, fixationindex, fixationduration,
		mappedfixationpointx, mappedfixationpointy, user, description)
		VALUES('$line[0]', '$line[1]', '$line[2]', '$line[3]', '$line[4]', '$line[5]', '$line[6]', '$line[7]')")) {
			
		die('sql error: ' . $mysql_connection->error);
	}
}*/

//fclose ($input);

$mysql_connection->close();
?>