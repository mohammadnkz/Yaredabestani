
<?php
    if(isset($_POST['answer'])) {
        if ($_POST['answer'] == "true") echo true;
        elseif ($_POST['answer'] == "false") echo false;
    }
?>