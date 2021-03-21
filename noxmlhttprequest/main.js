
/** Bind the custom clicks to buttons */
document.addEventListener("DOMContentLoaded", function(event) {
    
    event.preventDefault();
                
    NoXMLHTTPRequestInvoker.requestTypes.forEach(function(buttonId) {      
        let button = document.getElementById(buttonId);
        button.addEventListener("click", function(event){
            
            event.preventDefault();
            let username = document.getElementById("username").value;
            let email = document.getElementById("email").value;

            if (email == '' || username == '') {
                alert('Please specify username and email');
                return;
            } 

            let invoker = new NoXMLHTTPRequestInvoker(username, email);    
            invoker.doRequest(this.getAttribute('name'));
        },false);
    });
    
});

/** Class to process diffent types of no ajax requests */
class NoXMLHTTPRequestInvoker
{
    /**
     * constructor
     * @param {string} username - Username
     * @param {string} email - Email
     */
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }
    
    /**
     * Get the request types.
     * @return {Array.<string>} Request types
     */
    static get requestTypes() {
        return [
            'formsubmit',
            'newscript', 
            'iframe', 
            'fetchAPI'
        ];
    }
    
    /**
    * Run request base on type
    * @return {null} Directs output to the page
    */
    doRequest(type)
    {
        //Ordinary form submit
        if (type === 'formsubmit') {

            document.forms.testform.submit();            
       
        //Add new script to the page        
        } else if (type === 'newscript') {

            var newScript = document.createElement("script");
            newScript.src = '/noxmlhttprequest/handler.php?t=newscript'
                + '&email=' + encodeURIComponent(this.email)
                + '&username=' + encodeURIComponent(this.username);
            newScript.addEventListener('load', function() {
                NoXMLHTTPRequestInvoker.showMessage(
                    'Response from php script has been successfully received: ' 
                    + response.message 
                    + '. Status: ' 
                    + response.result
                );
            });
            document.body.appendChild(newScript);        
        
        // Add iframe to the page
        } else if (type === 'iframe') {

            var listenerReference;            
            window.addEventListener('message', listenerReference = (ev) => { this.onIframeMessage(ev); });

            var iframes = document.getElementsByTagName("iframe");
            while (iframes.length) {
                iframes[0].parentNode.removeChild(iframes[0]);
            }        

            var iframe = document.createElement('iframe');
            iframe.width = "600";
            iframe.height = "150";
            iframe.style.marginLeft = "40px";
            iframe.src = '/noxmlhttprequest/handler.php?t=iframe'
                + '&email=' + encodeURIComponent(this.email) 
                + '&username=' + encodeURIComponent(this.username);
            iframe.onload = function(){
                window.removeEventListener('message', listenerReference);
            }
            document.body.appendChild(iframe);
                    
        // Use fetch API        
        } else if (type === 'fetchAPI') {

            var email_ = this.email;
            var username_ = this.username;
            fetch('/noxmlhttprequest/handler.php?t=fetchAPI', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify({
                    "username": email_,
                    "email": username_,
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
                        NoXMLHTTPRequestInvoker.showMessage(
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
    * @return {null}
    */
    static showMessage(message) {
        
        var el = document.getElementById('container');
        if (el !== null) {
            el.parentNode.removeChild(el);
        }

        let div = document.createElement('div');
        div.id = 'container';
        div.innerHTML = message;
        div.className = 'green';
        document.body.appendChild(div);
    }    
    
    /**
     * Listens to the messages from iframe
     * @param Event object
     * @return {null}
     */
    onIframeMessage(event) {
        
        let dataObj = JSON.parse(event.data);
        NoXMLHTTPRequestInvoker.showMessage(
            'Response from iframe has been successfully received: ' 
            + dataObj.message 
            + '. Status: ' 
            + dataObj.result
        );        
    }   
}