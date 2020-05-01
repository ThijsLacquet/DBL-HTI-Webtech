<?php
/*
	Author: Thijs Lacquet
*/
require 'readdata.php';

$readdata = new Readdata;

$readdata->read("C:\Users\Thijs\Documents\GitHub\DBL-HTI-Webtech\Provided_data\all_fixation_data_cleaned_up.csv", 200000, 1);
unset($readddata);

?>