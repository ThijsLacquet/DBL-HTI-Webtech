	/*
	* Reads data from the csv indicated by path and puts it in the SQL database
	*
	* @param string $path Path to the csv to be read
	* @param int $maxlines Maximum number of lines to be read
	* $param int $document_id Unique document id for the csv. This is added to the database entries
	* $throws Exception If the mysql query did not succeed
	* $throws Exception If the file could not be opened
	*/	
	public function read($path, $maxlines, $document_id) {		
		$data = file($path);
		
		if (!$data) {
			throw new Exception('File could not be opened');
		}
		
		$n_lines = count($data);
		
		//Makes sure that the number of lines won't exceed the maximum number of lines
		if ($n_lines > $maxlines) {
			$n_lines = $maxlines;
		}
		
		//Extract lines from data
		$line = array();

		for ($i = 0; $i < $n_lines; $i = $i = $i + 1) {
			$line[$i] = explode('	', $data[$i]);
		}
		
		//Send SQL quaries
		for ($i = 1; $i < $n_lines; $i = $i + LINESPERQUERY) { 
			$linestoinsert = LINESPERQUERY;
			
			if ($n_lines - $i < $linestoinsert) {
				$linestoinsert = $n_lines - $i;
			}
			
			//Build SQL query
			$query = 'INSERT INTO fixationdata.fixationdata(document_id, timestamp, stimuliname, fixationindex, fixationduration,
				mappedfixationpointx, mappedfixationpointy, user, description)VALUES';
			
			for ($offset = 0; $offset < $linestoinsert; $offset = $offset + 1) {
				$query .= "({$document_id}, ";
				
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
			
			//Send SQL query
			if (! $this->mysql_connection->query($query)) {
				throw new Exception('sql error: ' . $this->mysql_connection->error);
			}
		}
	}
}
?>