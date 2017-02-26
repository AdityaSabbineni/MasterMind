var updateInfo = null;
var updateKeyInfo = null;
var updateGameEnd = null;
var numOfCon = 0;
var actList = [];
var resetBuble = null;
var resetInit = null;
var resetCreate = null;
var end = false;

$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
    var btnCheck = $('#checkBtn');
    
    
    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
  
    var connection = new WebSocket('ws://127.0.0.1:1337');
    numOfCon++;
    
    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        status.text('You are :');
       
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.' } ));
    };
    
    

    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        var json;
        try {
             json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'role') { // first response from the server with user's color
             //alert("role");
             $("#Role").html('');
             actList=[]; 
            //alert(json.data);
             if(json.data == "CodeMaker")   {
                 $('#Role').append('You are : <h2><b>CodeMaker</b></h2>');
                 $('body').css('background-image',  "url('css/images/back1.png')");
                 //$('#checkBtn').attr('id','setBtn');
                 $('#checkBtn').hide();
                 $('#setBtn').show();
                  $("#setBtn").prop("disabled",false);
                $('#actCode').hide();
                $('#gameBtn').hide();
                $('#code').show();
                $('#restartGame').html('');
                
                //$('#setBtn').html('');
                $('#restartGame').html('');
             }
             else if(json.data == "CodeBreaker") {
                    $('#Role').append('You are : <h2><b>CodeBreaker</b></h2>');
                    $('#gameBtn').show();
                    $("#gameBtn").prop("disabled",true);
                    $('#checkBtn').show();
                    $("#checkBtn").prop("disabled",true);
                    $('#code').hide();
                    $('#actCode').html('');
                    //$('#setBtn').html('');
                    $('#restartGame').html('');
                    $('body').css('background-image',  "url('css/images/back1.png')");
             }
             else if(json.data == "End") {
                
                //alert('gameBtn');
                end = true;
                $('#checkBtn').hide();
                $('#gameBtn').hide();
                $('#setBtn').hide();
                $("#Role").html('');
                $("#tab").empty();
                $("#code").hide();
                
                resetBuble();
                resetInit();
                resetCreate();//createEmptyTable();
                //updateGameEnd();
                
                //source(true);
             }
            
        } 
        
   
            
       
        else if (json.type === 'message') { // it's a single message
            
            
            console.log(json.data[0]);
            
            var d = JSON.parse(json.data);
            //console.log(d.keyCode1);
            if(d.msg == "keyCode"){
                $('#gameBtn').removeAttr('disabled');
                $('#checkBtn').removeAttr('disabled');
            
            actList.push(d.keyCode1);
            actList.push(d.keyCode2);
            actList.push(d.keyCode3);
            actList.push(d.keyCode4);
            console.log(actList);
            }
            else if(d.msg == "status"){
                var first = false;
                for (var key in d) {
                    
                    if (d.hasOwnProperty(key)) {
                        if(first == true){
                            $(key).css('background',d[key])
                            
                        }
                        first = true;
                        //console.log(key + " -> " + d[key]);
                    }
                    
                }
            }
            
            //$('#gameBtn').removeAttr('disabled'); // let the user write another message
        }

    };

    /**
     * Send mesage when user presses Enter key
     */
    
    function updateData(colList, jStr){
       
        //jStr = JSON.stringify(jStr);
        
        // alert(jStr);
        jStr = jStr.replace(/\\/g,'')
        console.log(jStr);
        connection.send(jStr);
        
    } 
    
    function updateEnd(){
       var jStr= "End";
       connection.send(jStr);
       
       jStr = "Next";
       connection.send(jStr);
        //JSON.stringify(jStr)
    }
    
    updateGameEnd=updateEnd;
    
    updateInfo=updateData;
    function updateKeyData(jStr){
       //alert(jStr);
       console.log(jStr);
        jStr = jStr.replace(/\\/g,'')
        connection.send(jStr);    
    } 
    updateKeyInfo=updateKeyData;
   
    
    
    
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
                        
            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate '
                                                 + 'with the WebSocket server.');
        }
    }, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.prepend('<p><span style="color:' + color + '">' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
    }
    
     
    
});

   
