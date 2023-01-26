<?php

    $skin = $_POST['skin'];

    echo '<li>
            <div>
                <a href="#"><img src='.$base_url.'"images/'.$skin.'products/product-01.jpg" alt="Image name"></a>
            </div>
            <div>
                <p><a href="#">Elegant and fresh. A most attractive mobile...</a></p>
                <span class="tt-header__cart-list-price">
                    <span class="tt-header__cart-list-price-count">1</span>
                    <span>x</span>
                    <span class="tt-header__cart-list-price-val">$25</span>
                </span>
                <span class="tt-header__cart-list-color">Color: <span>Orange</span></span>
                <span class="tt-header__cart-list-size">Size: <span>XL</span></span>
                <div class="tt-counter" data-min="1" data-max="10">
                    <form action="#">
                        <input type="text" class="form-control" value="1">
                    </form>
                    <div class="tt-counter__control">
                        <span class="icon-up-circle" data-direction="next"></span>
                        <span class="icon-down-circle" data-direction="prev"></span>
                    </div>
                </div>
            </div>
            <div>
                <a href="#" class="tt-header__cart-list-edit"><i class="icon-pencil-circled"></i></a>
                <a href="#" class="tt-header__cart-list-delete"><i class="icon-trash"></i></a>
            </div>
        </li>
        <li>
            <div>
                <a href="#"><img src='.$base_url.'"images/'.$skin.'products/product-02.jpg" alt="Image name"></a>
            </div>
            <div>
                <p><a href="#">Elegant and fresh. A most attractive mobile...</a></p>
                <span class="tt-header__cart-list-price">
                    <span class="tt-header__cart-list-price-count">1</span>
                    <span>x</span>
                    <span class="tt-header__cart-list-price-val">$25</span>
                </span>
                <span class="tt-header__cart-list-color">Color: <span>Orange</span></span>
                <span class="tt-header__cart-list-size">Size: <span>XL</span></span>
                <div class="tt-counter" data-min="1" data-max="10">
                    <form action="#">
                        <input type="text" class="form-control" value="1">
                    </form>
                    <div class="tt-counter__control">
                        <span class="icon-up-circle" data-direction="next"></span>
                        <span class="icon-down-circle" data-direction="prev"></span>
                    </div>
                </div>
            </div>
            <div>
                <a href="#" class="tt-header__cart-list-edit"><i class="icon-pencil-circled"></i></a>
                <a href="#" class="tt-header__cart-list-delete"><i class="icon-trash"></i></a>
            </div>
        </li>';
?>