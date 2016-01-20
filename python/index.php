<?php
 header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
$im = file_get_contents("http://" . $_SERVER['SERVER_ADDR'] . ":8080/?action=snapshot");
$img = base64_encode($im);

$arr = array ('image'=>$img);

echo json_encode($arr);
?>
