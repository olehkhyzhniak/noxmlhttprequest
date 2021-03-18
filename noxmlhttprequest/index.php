<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" >
        <title>No AJAX requests</title>
        <script type="text/javascript" src="main.js"></script>
        <style type="text/css">
            .longinput {width:200px;}
            .divclass {margin-left: 40px;}
            .green {color: green; font-size:14px; margin-left: 40px; padding:10px 0; }
        </style>
    </head>
    <body>   
        <div class="divclass">
        <p><b>No AJAX requests</b></p>
        <form name="testform" id="testform" action="handler.php?t=formsubmit" method="POST">
            <p>Username:<br/><input type="text" name="username" id="username" value="Test User" class="longinput"/></p>
            <p>Email:<br/><input type="text" name="email" id="email" value="oleh.khyzhniak@gmail.com" class="longinput"/></p>
            <p>
                <button id="formsubmit" name="formsubmit">
                    Send via form submit
                </button>
            </p>
        </form>
        <br/><br/>
        <p>
            <button id="newscript" name="newscript" type="button">
                Send via dynamically added script
            </button>
        </p>        
        <p>
            <button id="fetchAPI" name="fetchAPI" type="button">
                Send using Fetch API
            </button>
        </p>
        <p>
            <button id="iframe" name="iframe" type="button">
                Send to iframe
            </button>
        </p>
        </div>
    </body>    
</html>