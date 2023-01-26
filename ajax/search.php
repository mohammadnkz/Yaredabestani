<?php
if(isset($_POST['search'])) {

    if($_POST['search'] === '') {
        return;
    }

    $skin = $_POST['skin'];

    for($i = 0; $i < rand(9, 7); $i++) {
        $img_num = rand(1, 20);

        if($img_num < 10) $img_num = '0'.$img_num;

        echo '<div>
                <a href="#"><img src="images/'.$skin.'products/product-'.$img_num.'.jpg" alt="Image name"></a>
                <a href="#"><p>Elegant and fresh. A most attractive mobile power supply.</p></a>
              </div>';
    }
}
?>