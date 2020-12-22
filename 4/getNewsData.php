<?php
/**
 * Created by PhpStorm.
 * User: lenovo
 * Date: 2016/8/2
 * Time: 19:30
 */

header('Content-Type:application/json');

$page = $_REQUEST['page'];

$db_pages = [
    1 => [
        'header' => 'this is page1 header',
        'caption' => 'this is page1 caption'
    ],
    2 => [
        'header' => 'this is page2 header',
        'caption' => 'this is page2 caption'
    ]
];

echo json_encode($db_pages[$page]);
//var_dump(json_encode($db_pages[$page]));

