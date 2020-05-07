<?php
# author: Marleen van Gent
require 'sql.php';
$mysql_connection = connectsql();

if ($mysql_connection->connect_error) {
    die("Failed to connect to mysql: " . $mysql_connection->connect_error);
}

# $sql = "SELECT * FROM fixationdata.fixationdata";
$sql = "SELECT fixationduration, mappedfixationpointx, mappedfixationpointy FROM fixationdata.fixationdata WHERE stimuliname = '01_Antwerpen_S1.jpg'";
$result = $mysql_connection->query($sql);

if (!$result) {
    trigger_error('Invalid query: ' . $mysql_connection->error);
}

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "fixationduration: " . $row["fixationduration"]. " - X: " . $row["mappedfixationpointx"]. " - Y: " . $row["mappedfixationpointy"]. "<br>";
    }
} else {
    echo "0 results";
}

# mysqli_result object converteren naar array

?>
