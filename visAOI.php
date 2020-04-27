<?php

$xmin = $_POST['xmin'];
$xmax = $_POST['xmax'];
$ymin = $_POST['ymin'];
$ymax = $_POST['ymax'];


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
	WHERE stimuliname = '01_Antwerpen_S1.jpg') X) Y
	WHERE AOI <> prevAOI OR timestamp = 0
	ORDER BY timestamp, user
";

$result = $conn->query($query);


echo "<table style='width:150px'>";
echo "<tr>";
echo "<th>t</th>";
echo "<th>user</th>";
echo "<th>AOI</th>";
echo "</tr>";

if($result)
    while($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>".$row['timestamp']."</td>";
        echo "<td>".$row['user']."</td>";
        echo "<td>".$row['AOI']."</td>";
        echo "</tr>";
    }
else
	die("Something wrong with the query: ".$conn->error);

echo "</table>";

?>