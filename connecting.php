<?php

require 'sql.php';
$mysql_connection = connectsql();

$sql = "
	SELECT *
	FROM
	(SELECT *, LAG(AOI) OVER(PARTITION BY user ORDER BY timestamp) prevAOI
	FROM
	(SELECT user,
	timestamp - MIN(timestamp) OVER(PARTITION BY user) AS timestamp,
		CASE
";

$result = mysqli_query($dbc, $sql) or die("Bad Query: $sql");

?>
