<?php
/*
* Author: Thijs Lacquet
*/ 
include_once __DIR__.'../sql.php';

define('COOKIE_NAME', 'user');
define('EXPIRE', '86400');

Class User {
    private $mysql_connection;
    private $dir;

    function __construct($dir) {
        $this->dir = $dir;
        $this->mysql_connection = connectsql();
    }

    function __destruct() {
		$this->mysql_connection->close();
	}

    public function addUser() {
        //Create database if it does not exist yet
		if (! $this->mysql_connection->query("CREATE DATABASE IF NOT EXISTS fixationdata")) {
			throw new Exception('Could not create mysql database fixationdata: ' . $this->mysql_connection->error);
		}

        //Create user table if it does not exist yet
		if (! $this->mysql_connection->query("
            CREATE TABLE IF NOT EXISTS fixationdata.users(
            user_id INT(32) NOT NULL,
            created INT(32) NOT NULL
            )")) {
            
            throw new Exception('Could not create mysql table user: ' . $this->mysql_connection->error);
        }

        //Retrieve user_id, create new user if it did not visit the site recently
        if (isset($_COOKIE[COOKIE_NAME])) {
            $user_id = $_COOKIE[COOKIE_NAME];
        } else {
            $user_id = rand(0, 2147483647); //TODO generate completely unique user
            $created = time();
            if (! $this->mysql_connection->query("
                INSERT INTO fixationdata.users(user_id, created)VALUES({$user_id}, {$created})
                ")) {

                throw new Exception('sql error: ' . $this->mysql_connection->error);
            }
            setcookie(COOKIE_NAME, $user_id, time() + EXPIRE, '/');
        }

        /*if (count($_COOKIE) <= 0) {
            die("Cookies are disabled");
        }*/

        //Create folder for user if it does not exists yet
        $folder = $this->dir . $user_id;
        if (!file_exists($folder)) {
            mkdir($folder);
        }

        return $user_id;
    }

    /*
    * Recursively remove directory
    */
    private function removeDir($dir) {
        if (!file_exists($dir)) {
            return;
        }

        $files = glob($dir . '*', GLOB_MARK);

        foreach ($files as $file) {
            if (is_dir($file)) {
                $this->removeDir($file);
                rmdir($file);
            } else {
                unlink($file);
            }
        }
    }

    public function removeExpired() {
        $threshold = time() - EXPIRE;
        $toremove = mysqli_query($this->mysql_connection, 
            "SELECT user_id FROM fixationdata.users WHERE created < {$threshold}");

        if (!$toremove) {
            throw new Exception('sql error: ' . $this->mysql_connection->error);
        }
        if (mysqli_num_rows($toremove) > 0) {
            while ($row = mysqli_fetch_assoc($toremove)) {
                $current_user = $row['user_id'];
                $this->removeDir($this->dir . $current_user);

                if (! $this->mysql_connection->query("
                    DELETE FROM fixationdata.users WHERE user_id = {$current_user}")) {

                    throw new Exception('sql error: ' . $this->mysql_connection->error);
                }
            }
        }

        if (! $this->mysql_connection->query("DELETE FROM fixationdata.users WHERE created < {$threshold}")) {
            throw new Exception('sql error: ' . $this->mysql_connection->error);
        }
    }
}
?>