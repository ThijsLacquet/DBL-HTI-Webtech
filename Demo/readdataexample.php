<?php
/*
	Author: Thijs Lacquet
*/
require '../Scripts/readdata.php';

$readdata = new Readdata;

$readdata->read("C:\Users\Thijs\Documents\GitHub\DBL-HTI-Webtech\Provided_data\all_fixation_data_cleaned_up.csv", 200000, 0, 'test');
unset($readddata);

?>
