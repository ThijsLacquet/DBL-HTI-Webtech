<?php

$xmin = $_POST['xmin'];
$xmax = $_POST['xmax'];
$ymin = $_POST['ymin'];
$ymax = $_POST['ymax'];

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
		WHEN (mappedfixationpointx BETWEEN ".$xmin." AND ".$xmax.")
			AND (mappedfixationpointy BETWEEN ".$ymin." AND ".$ymax.")
			THEN 1
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
			echo print_r($userarray)."<br>";
		}



		$userarray = array();
	}

	echo $row['user']."	".$row['timestamp']." ".$row['AOI']."<br>";
	array_push($userarray, [$row['timestamp'], $row['AOI']]);


	if($row['timestamp'] > $maxt){
		$maxt = $row['timestamp'];
	}

	$prev = $row['user'];
}

$data = new stdClass();

$data->switchtimes = $switchtimes;
$data->maxt = $maxt;

echo json_encode($data);

?>