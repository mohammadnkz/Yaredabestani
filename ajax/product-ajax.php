<?php
if(isset($_POST['product']) && $_POST['product'] != "") {
    include '../../php/functions.php';
    $control = new Control;
    $config = $control -> get_config(['page' => 'product-ajax'], '../../php/config.php');

    $index = substr($_POST['product'], 2);
    if($index < 10) $index = '0'.$index;
    $config['index'] = $index;

    $skin = $_POST['skin'];

    echo '<div class="tt-qv">';
    include '../product-page/product-head.php';
    echo '</div>';
} else {
    echo '<div class="tt-qv">Product index is empty!</div>';
}
?>
