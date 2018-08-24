var introState = {

	
	user: '',
    password: '',
    error: '',

     create: function() {
	
		game.add.plugin(PhaserInput.Plugin);
        game.add.sprite(0,0,'background'); 

   
		var style = { font: "30px Arial", fill: "#000", 
		        align: "center", 
                boundsAlignH: "center", 
		        boundsAlignV: "top", 
		        wordWrap: true, wordWrapWidth: 600 };

		var stylel = { font: "15px Arial", fill: "#fff", 
		        align: "left", 
		        boundsAlignH: "left", 
		        boundsAlignV: "top", 
		        wordWrap: true, wordWrapWidth: 600 };

var istyle = {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: 200,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: 'User name'
}
var pstyle = {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: 200,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: 'Password',
    type: PhaserInput.InputType.password
}

        var title = game.add.text(0, 0, 'COPLA', style);
        title.setTextBounds(0, 0, game.world.width, game.world.height);
	        
	    var subtitle = game.add.text(0, 0, 'The Collaborative Planner', style);
        subtitle.setTextBounds(0, 75, game.world.width, game.world.height);

        error = game.add.text(0, 0, 'Invalid User name or password', errorstyle);
        error.setTextBounds(300, 150, game.world.width, game.world.height);
        error.visible = false;

		this.user = game.add.inputField(300, 200, istyle);

		this.password = game.add.inputField(300, 250, pstyle);

        if (indev)
        {
            this.user.setText('jim');
            this.password.setText('jim');
        }

		var blogin = game.add.button(300, 300, 'login', this.loginclick, this, 1, 1, 1, 1);

	
	},

    loginclick: function() {

        var filter = "T.loginname == '" + this.user.value + "' && T.password == '" + this.password.value + "'";

        usersBE.list(filter)
        .then(
        function(result) 
        {
            //  we got something
            if(result.length == 0)
            {
                //  login failed
               
                this.error.visible = true;
                return;
            }    

            //  Lets Gooooo!!!!!
            global.loggedInUser = JSON.parse(JSON.stringify(result[0]));
            

            for(var i = 0; i<global.loggedInUser.panels.length; i++)
            {
                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
                {
                    global.selectedColor = global.loggedInUser.panels[i].panelColor.BG;
                    global.selectedItem = "Panel background";
                    document.getElementById("item").value = "Panel background";
                    document.getElementById("color_value").value = RGBtoHex(global.loggedInUser.panels[i].panelColor.BG);
                    document.getElementById("color_button").style.backgroundColor = "#" + RGBtoHex(global.loggedInUser.panels[i].panelColor.BG);
                    //  get the hex value of the color here and chuck oit intothe bucket below
                    break;
                }
            }
            
        


            game.state.start('run');
        },
        function(err) 
        {
            //  error condition
            alert(err);
        }
        );

    }

}