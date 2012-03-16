<?php 
    header('Content-type: application/json');
    echo file_get_contents("https://maps.googleapis.com/maps/api/place/search/json?" .
      "location=" . $_GET['location'] .
      "&radius=" . $_GET['radius'] .
      "&sensor=" . $_GET['sensor'] .
      "&types=" . $_GET['types'] .
      "&key=" .$_GET['key']);
?>
