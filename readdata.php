<?php
/*
	Author: Thijs Lacquet
*/
require 'sql.php';

class Readdata {
	private $mysql_connection;
	
	function __construct() {
		//Create database and tables if they do not exist yet
		$this->mysql_connection = connectsql();

		if (! $this->mysql_connection->query("CREATE DATABASE IF NOT EXISTS fixationdata")) {
			die('Could not create mysql database fixationdata: ' . $this->mysql_connection->error);
		}

		if (! $this->mysql_connection->query("
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
				
			die('Could not create mysql table fixationdata: ' . $this->mysql_connection->error);
		}
	}
	
	function __destruct() {
		$this->mysql_connection->close();
	}
	
	public function read($path, $maxlines) {
		$data = file($path);
		$n_lines = count($data);
		$linesperquery = 5000;
		
		if ($n_lines > $maxlines) {
			$n_lines = $maxlines;
		}

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
			
			if (! $this->mysql_connection->query($query)) {
				die('sql error: ' . $this->mysql_connection->error);
			}
		}
	}
}
?>