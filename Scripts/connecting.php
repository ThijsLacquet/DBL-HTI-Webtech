<?php
# author: Marleen van Gent

#connecting to the database
require 'sql.php';
include_once 'user.php';

if(isset($_POST['stimuliPicture'])){
	$stimuliPicture = $_POST['stimuliPicture']; //Comment out for scanpath demo

	$mysql_connection = connectsql();

    //Establish user
    $dir = dirname(__FILE__)."/../../data/";
    $myUser = new User($dir);
    $user = $myUser->addUser();

    #throws error if not connected to database
    if ($mysql_connection->connect_error) {
        die("Failed to connect to mysql: " . $mysql_connection->connect_error);
    }

    #the variable stimuliPicture needs to be altered such that the participant can select the stimuli picture

    $sql = "SELECT user, timestamp, mappedfixationpointx, mappedfixationpointy, fixationduration FROM fixationdata.fixationdata WHERE stimuliname = '$stimuliPicture' AND user_id = '$user' ORDER BY user, timestamp";
    //$sql = "SELECT user, timestamp, mappedfixationpointx, mappedfixationpointy, fixationduration FROM fixationdata.fixationdata WHERE stimuliname = '$stimuliPicture' ORDER BY user";
    //$result = $mysql_connection->query($sql);

    $result = $mysql_connection->query($sql);

    // $sql = "SELECT fixationduration, mappedfixationpointx, mappedfixationpointy, timestamp, user FROM fixationdata.fixationdata WHERE stimuliname = '$stimuliPicture'";
    // $result = $mysql_connection->query($sql);

    #throws error if the query is not correctly implemented
    if (!$result) {
        trigger_error('Invalid query: ' . $mysql_connection->error);
    }

    #outputs the selected data from the query
    # if ($result->num_rows > 0) {
    #    while($row = $result->fetch_assoc()) {
    #        echo "fixationduration: " . $row["fixationduration"]. " - X: " . $row["mappedfixationpointx"]. " - Y: " . $row["mappedfixationpointy"]. "<br>";
    #    }
    #} else {
    #    echo "0 results";
    #}

    $scanpathData = [];

    while($row = mysqli_fetch_assoc($result)) {
        $scanpathData[] = $row;
    }

    $dataJSON = json_encode($scanpathData);

    echo $dataJSON;

    #to print the array (to see how it looks) you can remove the two #'s below
    # $printing = print_r($scanpathData, true);
    # echo $printing;
}else{
	echo json_encode(null);
}


?>
