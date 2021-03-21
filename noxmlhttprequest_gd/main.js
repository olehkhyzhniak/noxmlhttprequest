/** Bind the custom clicks to buttons */
document.addEventListener("DOMContentLoaded", function(event) {
    
    event.preventDefault();
                    
    let button = document.getElementById('formsubmit');
    button.addEventListener("click", function(event){

        event.preventDefault();
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;

        if (email == '' || username == '') {
            alert('Please specify username and email');
            return;
        }

        let invoker = new NoXMLHTTPRequestInvoker(username, email);
        invoker.doRequest();
    },false);
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
    * Run request based on available functionality
    * @return {null} Directs output to the page
    */
    doRequest() {
        
        //use the most modern approch (Fetch API) if available
        if (window.fetch !== undefined) {
            
            this.processFetchAPI();
            
        // If iframe rendering is available    
        } else if (this.isIframeRenderAvailable()) {
            
            this.processIframe();            
        
        //Request by adding new script to the page if possible      
        } else if (this.isNewScriptTagAvailable()) {

           this.processNewScriptTag();
           
        // The last option that works for sure (of course if js is enabled)
        } else {
            
            this.processOrdinarySubmit();      
        }        
    }
    
    /**
    * Process request based on Fetch API
    * @return {null} Directs output to the page
    */
    processFetchAPI() {
        
        var email_ = this.email;
        var username_ = this.username;
        fetch('/noxmlhttprequest_gd/handler.php?t=fetchAPI', {
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
    
    /**
    * Process request based on iframe
    * @return {null} Directs output to the page
    */
    processIframe() {
        
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
    }
    
    /**
    * Process request via new script tag src
    * @return {null} Directs output to the page
    */
    processNewScriptTag() {
        
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
    }    
    
    /**
    * Trigger ordinary form submit
    * @return {null}
    */
    processOrdinarySubmit() {
        document.forms.testform.submit();
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
    
    /**
     * Stub function | Check if we can render the needed site in iframe
     * @param no input params
     * @return {boolean}
     */
    isIframeRenderAvailable() {
        
        //check possible issues for example iframe display forbidden by X-Frame-Options
               
        return true;
    }
    
    /**
     * Stub function | Check if we can add new script element or replace a src of the existing one
     * @param no input params
     * @return {boolean}
     */
    isNewScriptTagAvailable() {
        
        //check possible issues for example DOM manipulations are somehow disabled
               
        return true;
    }
}