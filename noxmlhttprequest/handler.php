<?php
/*
 * process ordinary data from submitted form
 * very simple request but works without js
 */

if (
    !empty($_GET['t']) 
    && $_GET['t'] == 'formsubmit' 
    && !empty($_POST['username'])
    && !empty($_POST['email'])
) {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    /*
     * some dummy processing here and get back to submit form page
     */
    header('Location: index.php');
    exit();
}
/*
 * process dynamically added script request processing
 */
if (!empty($_GET['t']) && $_GET['t'] == 'newscript') {
    
    /*
     * some dummy processing here and then reply back with js data
     */
    $username = trim($_GET['username']);    
    
    $messageToParentWindow = json_encode(
        [
            'message'=>'Request for ' . $username . ' have been processed successfully', 
            'result'=>'ok'
        ]);
    header('Content-Type: text/javascript');
    echo 'var response = ' . $messageToParentWindow . ';';
    exit();
}

/*
 * iframe request processing
 */
if (!empty($_GET['t']) && $_GET['t'] == 'iframe') {
        
    $username = trim($_GET['username']);
    $email = trim($_GET['email']);
    
    $messageToParentWindow = json_encode(
        [
            'message'=>'Request for ' . $username . ' have been processed successfully', 
            'result'=>'ok'
        ]);
    
    /*
     * some dummy processing here and then reply back with html page
     */
    echo "<html>" 
            . "<body>"
                . '<p>Response message:<br/><input type="text" name="message" id="message" value="Request for ' 
                    . $_GET['username'] . ' (' . $_GET['email'] . ') have been processed successfully" style="width:550px;"/></p>'
                . '<p>Response status:<br/><input type="text" name="status" id="status" value="ok" /></p>'
                /**
                 * cross origin messaging with "*"
                 */
                . '<script type="text/javascript">parent.postMessage(JSON.stringify(' . $messageToParentWindow . '), "*");</script>'//
            . "</body>" 
        . "</html>";
    exit();
}

/*
 * fetch API request processing
 */
if (!empty($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] == 'application/json') {
    $rawContent = trim(file_get_contents("php://input"));
    
    /*
     * some dummy processing here and then reply back with some dummy data
     */
    $content = json_decode($rawContent);   
    header('Content-Type: application/json');
    if (isset($content->username)) {        
        echo json_encode(
            [
                'message'=>'Request for ' . $content->username . ' have been processed successfully', 
                'result'=>'ok'
            ]
        );
    } else {
        echo json_encode(['message'=>'Data hasn\'t been received', 'result'=>'ok']);
    }    
    exit();
}
