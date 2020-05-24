<?php

$numofAOIs = 0;

$AOIs = array();

while(isset($_POST['xmin'.$numofAOIs])){
	$AOI = array($_POST['xmin'.$numofAOIs], $_POST['xmax'.$numofAOIs], $_POST['ymin'.$numofAOIs], $_POST['ymax'.$numofAOIs]);

	array_push($AOIs, $AOI);

	$numofAOIs++;
}

$stimuliname = "01_Antwerpen_S1.jpg";


$conn = new mysqli('localhost:3306', 'root', '', 'fixationdata');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$query = "
	SELECT *
	FROM
	(SELECT *, LAG(AOI) OVER(PARTITION BY user ORDER BY timestamp) prevAOI
	FROM
	(SELECT user,
	timestamp - MIN(timestamp) OVER(PARTITION BY user) AS timestamp,
		CASE 
";

for ($i=0; $i < $numofAOIs; $i++) { 	
	$query .= "
			WHEN (mappedfixationpointx BETWEEN ".$AOIs[$i][0]." AND ".$AOIs[$i][1].")
				AND (mappedfixationpointy BETWEEN ".$AOIs[$i][2]." AND ".$AOIs[$i][3].")
				THEN ".($i+1)."
	";

}

$query .= "
			ELSE 0
	END AS AOI
	FROM fixationdata
	WHERE stimuliname = '".$stimuliname."') X) Y
	WHERE AOI <> prevAOI OR timestamp = 0
	ORDER BY user, timestamp
";

$result = $conn->query($query);


$switchtimes = array();

$prev = NULL;

$maxt = 0;

while($row = $result->fetch_assoc()){
	if($row['user'] != $prev){
		if(isset($userarray)){
			array_push($switchtimes, $userarray);
		}



		$userarray = array();
	}

	array_push($userarray, [$row['timestamp'], $row['AOI']]);


	if($row['timestamp'] > $maxt){
		$maxt = $row['timestamp'];
	}

	$prev = $row['user'];
}

$data = new stdClass();

$data->switchtimes = $switchtimes;
$data->maxt = $maxt;
$data->numofAOIs = $numofAOIs+1;

echo json_encode($data);

?>