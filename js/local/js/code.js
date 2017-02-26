var source = function(inGame){
     var holes = 4;
    var rows = 12;
    var numColors = 6;
    var curRound = rows;
    var selectColor="black";
    var selectRow = 12;
    var selectCol = 1;
    var keyCol = 1;
    var jStr;
    var initGame = false;
    var setDisabled = false;
    var userNum = 1;
    var success = false;
    //var actList = ['#FF9999', '#0000FF', '#00FF00', '#FFFF00'];
    var actLidt = ['pink', 'blue', 'green', 'yellow'];
    
    colorList = ["rgb(255, 153, 153)", "rgb(0, 0, 255)", "rgb(0, 255, 0)", "rgb(255, 255, 0)", "rgb(128, 128, 0)", "rgb(128, 0, 128)", "rgb(0, 0, 0)"]
    hexList = ['#FF9999', '#0000FF', '#00FF00', '#FFFF00', '#808000', '#800080'];
    colVal = ['pink', 'blue', 'green', 'yellow', 'kaki', 'purple']
    var whites = 0;
    var reds = 0;
    var localInGame = false;
    
   
    resetInit = function init_game(){
       
        curRound = rows;
        selectColor="black";
        selectRow = 12;
        selectCol = 1;
        keyCol = 1;
        whites = 0;
        reds = 0; 
        setDisabled = false;
        
        //createEmptyTable();
        //alert("Init called");     
    }
    resetInit();
    
    $(".rect").click(function() {
        //alert("rect");
        
        selectColor = colorList[parseInt(this.id.charAt(0))];
        //alert(selectColor); 
    });
    
    $(".rectKey").click(function() {
        var c = this.id.charAt(1);
        //alert("rectKey");
        if ( setDisabled == false)   $('#'+this.id).css('background',selectColor);
        /*
        if(selectRow == curRound ){
            $('#'+this.id).css('background',selectColor);
        } 
        */
    });
    
    
    $(document).on('click', ".circle", function() {
    //alert("Circle");
        if ( $('#code').is(':visible') ){}
        else {
        var c = this.id.charAt(1);
        //alert(this.id);
        var row;
        var col;
        if((c >= '0') && (c<='9'))  {
            selectRow = this.id.substr(0,2);
            selectCol = this.id.substr(3,1);
        }
        else {
            selectRow = this.id.substr(0,1);
            selectCol = this.id.substr(2,1);
        }
        
        if(selectRow == curRound){
            $('#'+this.id).css('background',selectColor);
        }
        //alert(this.id);
        //selectColor = colorList[parseInt(this.id.charAt(0))];
        //alert(row+" "+col); 
        }
    });
    
    function getHex(col){
        //alert(col);
        for(var i=0;i<numColors;i++){
            if(col == colorList[i]) return hexList[i];
        }
    }
   
   function updateStatus(colList, jStr){
        reds = 0;
        whites=0;
        //alert(colList);
        //alert(actList);
        for(var i=0;i<holes;i++){
            for(var j=0;j<holes;j++){
            if(colList[i] == actList[i])    {reds++;break;}
                if((colList[j] == actList[i]))  {
                    whites++;
                    break;
                }
            }
        }
    
    var i = 1;
    var blacks = 0;
    blacks = holes-(reds+whites);
    success = false;
    if(reds == holes)   success=true;
    //alert(reds+'-'+whites+'-'+blacks);
    while(reds>0)    {
        var id = '#'+(curRound)+'_'+i+'_'+'acc';
        $(id).css('background','orange');
        i++;reds--;
        jStr = jStr+'"'+id+'": "'+'orange",';
        }
    while(whites>0)  {
        var id = '#'+(curRound)+'_'+i+'_'+'acc';
        $(id).css('background','brown');
        i++;whites--;
        jStr = jStr+'"'+id+'": "'+'brown",';
        }
    while(blacks>0)  {
        var id = '#'+(curRound)+'_'+i+'_'+'acc';
        $(id).css('background','cyan');
        i++;blacks--;
        jStr = jStr+'"'+id+'": "'+'cyan",';
        }
        return jStr;
   }
   $("#setBtn").on("click", function() {
    
    
    var jStr='{"msg":"keyCode",';
    var b = false;
    for(var i=1;i<=holes;i++){    //holes
            var idX = i+'_code';
            var x = $('#'+idX).css('background-color'); 
            if(x == "rgb(0, 0, 0)")    {
                    alert("Key can't be black");
                    b = true;
                    break;
                }
                else    {
                    //alert(x);
                    var curCol = getHex(x);
                    jStr = jStr+'"keyCode'+i+'": "'+curCol+'",';
                    
                    //jStr = jStr+'{ keyCode: '+curCol+'}';
                }
        }
        
        if(b == false && i==5){
            jStr = jStr.slice(0,-1);
            jStr = jStr + '}';
            console.log(jStr);
            updateKeyInfo(jStr);
            $("#setBtn").prop("disabled",true);
            setDisabled = true;
        }
        
   });
    resetBuble = function resetCodeBubbles(){
        //alert('CAlled bubble');
        for(var i=1;i<=holes;i++){
            $('#'+i+'_code').css('background','black');
        }
    }
    
    function end_game(){
        
        
        if(success == true) $('#actCode').append('<p><h3>Congratulations you won!</h3></p>');
        else $('#actCode').append('<p><h3>Actual Code Set:</h3></p>');
        $('#actCode').show();
        //$('body').css('background-image',  "url('css/images/congrats.jpg')");
        $('#restartGame').append('<p><h5>Press End Game for New Game</h5></p>');
        $('#restartGame').show();
        for(var i=1;i<=holes;i++){
            $('#'+i+'_code').css('background',actList[i-1]);
            $('#checkBtn').hide();
        }
        $('#code').show();
    }
    
   $("#checkBtn").on("click", function() {
        var b = false;
        var colList = []
        var jStr='{"msg":"status",';
        for(var i=1;i<=holes;i++){    //holes
            var idX = curRound+'_'+i+'_'+'tab';
            //alert(idX);
            var x = $('#'+idX).css('background-color'); 
            if(x == "rgb(0, 0, 0)")    {
                
                   alert("Empty bubble shouldn't exist in current step");
                    b = true;
                    break;
                }
                else    {
                    var curCol = getHex(x);
                    jStr = jStr+'"#'+idX+'": "'+curCol+'",';
                    //jStr = jStr+'{ color'+i+': '+curCol+'}';
                    colList.push(curCol);
                }
            }
            if(b == false && i==5){
                jStr = updateStatus(colList, jStr);
                console.log(jStr);
                jStr = jStr.slice(0,-1);
                jStr = jStr + '}';
                
                updateInfo(colList, jStr);
                curRound--;
                if(curRound == 0 || success == true)   end_game();
                  
            }
    });
    
    //createEmptyTable();
    
    resetCreate = function createEmptyTable(){
        //alert('Created called');
        var rowStr1 = "<tr>";
        var rowStr2 = "</tr>";
        
        var colStr1 = '<td><div class="circle" id=';
        var colStr2 = '></div></div></td>';
        var accStr1 = '<td><table>';
        var accStr2 = '<td><div class="s_circle" id=';
        var accStr3 = '</table>';
        var td = "</td>";
        var colStr3 = '<td><div class="text" id=';
        var sizeStr1 = '<div style="height:10px;overflow:hidden;">'
        var sizeStr2 = '</div>'
        var tabStr;
        var rowVal = rows;
        
        for(var i=1;i<=rows;i++)
        {
            tabStr="";
            tabStr = rowStr1;
            rowVal--;
            //alert(tabStr);
            for(var j=1;j<=holes;j++)
            {
                id = '"'+i+'_'+j+'_tab"';
                //if(i == 1)  tabStr = tabStr+colStrInit+id+colStr2;
                tabStr = tabStr+colStr1+id+colStr2;
                
            }
            tabStr=tabStr+accStr1;
            
            for(var x=1,m=1;x<=holes/2;x++)
            {
                tabStr = tabStr+rowStr1;
                for(var j=1;j<=holes/2;j++)
                {
                    id = '"'+i+'_'+m+'_acc"';
                    m++;
                    tabStr = tabStr+accStr2+id+colStr2;
                }
                tabStr=tabStr+rowStr2;
            }
            
            //for(var x=1;x<=holes/2;x++
            //tabStr = tabStr + colStr3 +i+"_row'><p>Round : "+i+"</p></td>";
            
            tabStr = tabStr+accStr3+td+rowStr2;
            
            $("#tab").append(tabStr);
            //$("#tab").append('</br>');
           
           
        }
    }
    resetCreate();
    $('#gameBtn').click(function(){
	//alert('gameBtn');
    $('#checkBtn').hide();
        $('#gameBtn').hide();
        $('#setBtn').hide();
        $("#Role").html('');
        $("#tab").empty();
        $("#code").hide();
        
        resetBuble();
        //resetCodeBubbles();
        resetInit();//init_game();
        resetCreate();//createEmptyTable();
        updateGameEnd();
    });
};

$(document).ready(function() {
    source(false);
 });  