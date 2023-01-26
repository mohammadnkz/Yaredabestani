<?php
if($_POST['album_id']) {
    $id = $_POST['album_id'];

    $gallery = [
        [
            'src' => $id,
            'title' => 'Duis Aute Irure Dolor',
            'tags' => ['Watches', 'Trackers']
        ],
        [
            'src' => 'images/gallery/3_thumbs/gallery-3thumbs-01.jpg',
            'title' => 'Duis Aute Irure Dolor',
            'tags' => ['Trackers', 'Headphones']
        ],
        [
            'src' => 'images/gallery/3_thumbs/gallery-3thumbs-02.jpg',
            'title' => 'Duis Aute Irure Dolor',
            'tags' => ['Speakers', 'Earphones']
        ],
        [
            'src' => 'images/gallery/3_thumbs/gallery-3thumbs-03.jpg',
            'title' => 'Duis Aute Irure Dolor',
            'tags' => ['Headphones']
        ],
        [
            'src' => 'images/gallery/3_thumbs/gallery-3thumbs-04.jpg',
            'title' => 'Duis Aute Irure Dolor',
            'tags' => ['Power Banks']
        ],
        [
            'src' => 'images/gallery/3_thumbs/gallery-3thumbs-05.jpg',
            'title' => 'Duis Aute Irure Dolor',
            'tags' => ['Speakers', 'Watches']
        ],
        [
            'src' => 'images/gallery/3_thumbs/gallery-3thumbs-06.jpg',
            'title' => 'Duis Aute Irure Dolor',
            'tags' => ['Earphones', 'Watches']
        ],
    ];

    echo json_encode($gallery);
}
?>