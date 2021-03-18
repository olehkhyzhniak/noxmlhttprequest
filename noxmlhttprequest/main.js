/**
 * Bind the clicks to buttons
 */
document.addEventListener("DOMContentLoaded", function(event) {
    
    event.preventDefault();
    
    let idContainer = ['formsubmit', 'newscript', 'iframe', 'fetchAPI'];
    
    idContainer.forEach(function(buttonId) {       
        let button = document.getElementById(buttonId);
        button.addEventListener("click", function(e){
            makeRequest(this.getAttribute('name'));
        },false);
    });
    
});

/**
 * Listen to iframe messages
 */
window.addEventListener('message', function(event) {    
    /**
     * check event.origin for domain check if needed
     */
//    if (event.origin !== "http://domain.com"){
//        
//    }    
    let dataObj = JSON.parse(event.data);
    showMessage(
        'Response from iframe has been successfully received: ' 
        + dataObj.message 
        + '. Status: ' 
        + dataObj.result
    );
});

/**
* Make request base on type
* @return {null}
*/
function makeRequest(type)
{
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    
    if (email == '' || username == '') {
        alert('Please specify username and email');
        return;
    }    
    /**
     * Ordinary form submit
     */
    if (type === 'formsubmit') {
                
        document.forms.testform.submit();
        
    /**
     * Add new script to the page
     */
    } else if (type === 'newscript') {
        
        var newScript = document.createElement("script");
        newScript.src = '/noxmlhttprequest/handler.php?t=newscript'
            + '&email=' + encodeURIComponent(email) 
            + '&username=' + encodeURIComponent(username);
        newScript.addEventListener('load', function() {
            showMessage(
                'Response from php script has been successfully received: ' 
                + response.message 
                + '. Status: ' 
                + response.result
            );
        });
        document.body.appendChild(newScript);        
        
    /**
     * Add iframe to the page
     */
    } else if (type === 'iframe') {
        
        var iframes = document.getElementsByTagName("iframe");
        while (iframes.length) {
            iframes[0].parentNode.removeChild(iframes[0]);
        }        
        
        var iframe = document.createElement('iframe');
        iframe.width = "600";
        iframe.height = "150";
        iframe.style.marginLeft = "40px";
        iframe.src = '/noxmlhttprequest/handler.php?t=iframe'
            + '&email=' + encodeURIComponent(email) 
            + '&username=' + encodeURIComponent(username);
        document.body.appendChild(iframe);
        
    /**
     * Use fetch API
     */
    } else if (type === 'fetchAPI') {
        
        fetch('/noxmlhttprequest/handler.php?t=fetchAPI', {
            method: 'POST',            
            mode: 'cors',
            body: JSON.stringify({
                "username": document.getElementById("username").value,
                "email": document.getElementById("email").value,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/json'
            }
        })
        .then(
            function(response) {
                
                if (response.status !== 200) {
                    console.log('Error. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function(data) {
                    showMessage(
                        'Response via Fetch API from has been successfully received: ' 
                        + data.message 
                        + '. Status: ' 
                        + data.result
                    );
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error:', err);
        });        
    }
}

/**
 * Output the result message to the page
 * @param {string} message 
 * @returns {null}
 */
function showMessage(message)
{
    var el = document.getElementById('container');
    if (el !== null) {
        el.parentNode.removeChild(el);
    }
    
    var div = document.createElement('div');
    div.id = 'container';
    div.innerHTML = message;
    div.className = 'green';
    document.body.appendChild(div);
}