// todo

//	ticker - retrieve from last ticker id ( now uses sockets so not urgent but might be nice when first logged in)
//	ticker - only update content if visible, reverse order, display date if changed.

//  database relationshis so deletes work automatically (or perhaps allow archives only)
//	if we are implementing archives then periodically perge records.  Invoiving functions to get them back again though
//  db.list	-	sort descending
//	all panels - implement scrollbar

//  add dock and undock buttons
//  stuff in globals shold all be against the user
//  rounding for all messages like that done for expand
//  function to retrieve db defaults

//  BUGS
//	Hover doesnt seem to work when docked left!  (pretty certain is becasue od dialogSpacerDIv being in the way)

//  Done
//  hiddenitems - restore (using a function)
//  hiddenitems - initial state (up/down)
//  give custm text its own class file
//	db - upgrade functions in start to initialise fields
//	options - only  optons for user based on type

var runState = {

	 preload: function() 

    {

	},

    create: function() 
	{
		   
		
        //  enable keyboard cursor keys 
	    cursors = game.input.keyboard.createCursorKeys();
		panels = game.add.group();
	    //  draw the background
	    this.setBackground();
	    this.cc = 9;
	

	    //  use some text to display where the view point is from
		style = { font: "30px Arial", 
		          fill: "#fff", 
		          align: "center", 
		          boundsAlignH: "center", 
		          boundsAlignV: "top", 
		          wordWrap: false};

		stylesm = { font: "12px Arial", fill: "#fff", 
		            align: "center", 
		            boundsAlignH: "center", 
		            boundsAlignV: "top", 
		            wordWrap: true, wordWrapWidth: 600 };

        this.title = game.add.text(0, 0,'Welcome to COPLA ' + global.loggedInUser.nicname, style);
        this.title.setTextBounds(0, 0, 800, 20);

        var blogout = game.add.button(700, 0, 'logout', this.logoutclick, this, 1, 1, 1, 1);

		var colors = game.add.sprite(game.world.width - 24, 4, 'colors');
			colors.inputEnabled = true;
			colors.events.onInputDown.add(this.colorsPressed, this);
			colors.scale.setTo(.2,.2);
		    
        //  set up user panels

        sortPanelsForUser(global.loggedInUser);
        global.loggedInUser.class = "SuperAdmin";
        usersBE.update(global.loggedInUser);

        for(var i = 0; i<global.loggedInUser.panels.length; i++)
        {
    		//  have to do this here as can't get function back from the RESTful call
    		switch (global.loggedInUser.panels[i].name)
    		{
    			case "My options":
					global.loggedInUser.panels[i].contentBuilder = function(opt) {optionsBE.getContent(global.loggedInUser);};
    			break;
    			case "My hidden items":
					global.loggedInUser.panels[i].contentBuilder = function(opt) {hiddenPanelsBE.getContent(global.loggedInUser);};
    			break;
    			case "My groups":
					global.loggedInUser.panels[i].contentBuilder = function(opt) {userGroupsBE.getContent(global.loggedInUser);};
    			break;
    			case "My ideas":
					global.loggedInUser.panels[i].contentBuilder = function(opt) {ideasBE.getContent(global.loggedInUser);};
    			break;
    			case "My friends":
					global.loggedInUser.panels[i].contentBuilder = function(opt) {friendsBE.getContent(global.loggedInUser);};
    			break;
    			case "My to do list":
					global.loggedInUser.panels[i].contentBuilder = function(opt) {toDoListBE.getContent(global.loggedInUser);};
    			break;
    			default:
    			global.loggedInUser.panels[i].contentBuilder = function(opt) {getNoContent(opt);};
    			break;
    		}

        	if (global.loggedInUser.panels[i].manifest != "menu")
        	{
        		new SlidingPanel(game, global.loggedInUser.panels[i]);
        	}
		}
      
      	//  lets start poling the ticker for its content (no need now, done using sockets)
      	//setInterval(tickersBE.getContent, pollInterval, true); 

      	//  now populate some other windows
		//
		//hiddenPanelsBE.getContent(loggedInUser);  

		//  listen for new ticks
		ioClient = io.connect("http://localhost:8000");
		ioClient.on("new-ticker", (msg) => this.tickerpushnotificationreceived(msg));

		//  lets get all way points now to save time later
		this.allWPS = [];
		waypointsBE.list()
	    .then(
        function(result) 
        {
            //  we got something
            runState.allWPS = result;
             
        },
        function(err) 
        {
            //  error condition
            alert(err);
        }
        );

		
		//  set up map canvas stuffc
		
		this.canvas = document.getElementById("mapCanvas");
		this.canvasWidth = this.canvas.width;
		this.canvasHeight = this.canvas.height;
		this.ctx = this.canvas.getContext("2d");
		this.canvasData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
		//  Map zoom rectangle stuff

		this.startx = 0;
		this.endx = this.canvas.width;
		this.starty = 0;
		this.endy = this.canvas.height;
		this.xscale = this.endx - this.startx;
		this.yscale = this.endy - this.starty;

		//this.drawMap();

		this.createMapOptions();


	 },

	hideMap:  function()
	{
		document.getElementById("container").hidden = false;
		document.getElementById("map").hidden = true;
	},

	// getCaches: async function()
	// {
	// 	var filter = "T.id == " + global.loggedInUser.waypointid;
	// 	var usercaches = await waypointsBE.list(filter);
	
	// 	return usercaches[0].caches;

	// },
	createMapOptions: async function()
	{
		this.mapSegments = await mapsegmentsBE.list(null,'name');
		var ctlarea = document.getElementById('cache');
		
		var b = document.createElement('input');
	    b.type = 'button';
		b.value = "Hide Map";
		b.onclick = function() {runState.hideMap()};
        ctlarea.appendChild(b); 
		
		for(var i = 0; i<this.mapSegments.length; i++)
		{
			var s = this.mapSegments[i];
			var label = document.createElement('label'); 
				label.innerHTML = s.name;
		   		ctlarea.appendChild(label); 
		   	var cb = document.createElement('input');
	            cb.type = 'checkbox';
	            cb.id = 'mapsegment' + i;
	            cb.onchange = function() {runState.drawMap()};
	        ctlarea.appendChild(cb); 
        }

        this.users = await usersBE.list( "T.id != 1");
		for(var i = 0; i<this.users.length; i++)
		{
			var s = this.users[i];
			var label = document.createElement('label'); 
				label.innerHTML = s.nicname;
		   		ctlarea.appendChild(label); 
		   	var cb = document.createElement('input');
	            cb.type = 'checkbox';
	            cb.id = 'usertoadd' + i;
	            cb.onchange = function() {runState.drawMap()};
	        ctlarea.appendChild(cb); 
        }
		
		for(var i = 0; i<this.users.length; i++)
		{
			var s = this.users[i];
			var label = document.createElement('label'); 
				label.innerHTML = s.nicname;
		   		ctlarea.appendChild(label); 
		   	var cb = document.createElement('input');
	            cb.type = 'checkbox';
	            cb.id = 'user' + i;
	            cb.onchange = function() {runState.drawMap()};
	        ctlarea.appendChild(cb); 
        }
	},

	drawMap: async function()
	{

		if(this.wps != null)
		{
			for (var i = 0; i< this.wps.length; i++)
			{
				var x = Math.floor(this.wps[i]._attributes.lon / this.hi * document.getElementById("mapCanvas").width);
				var y = Math.floor(this.wps[i]._attributes.lat / this.hi * document.getElementById("mapCanvas").height);
				var r = 255;
				var g = 255;
				var b = 255;
				var a = 255;

				this.drawPixel(x, y, r, g, b, a);
				this.drawPixel(x+1, y, r, g, b, a);
				this.drawPixel(x, y+1, r, g, b, a);
				this.drawPixel(x+1, y, r, g, b, a);
			}
		}

		this.wps = [];
		var twps = [];
		//  copy all selected map segments into the waypoints to plot

		for(var i = 0; i<this.mapSegments.length; i++)
		{
			id = 'mapsegment' + i;
			if(document.getElementById(id).checked)
			{
				for(var k = 0; k<this.allWPS.length; k++)
				{
					if (this.allWPS[k].id == this.mapSegments[i].waypointid)
					{
						for(var j = 0; j<this.allWPS[k].caches.length; j++)
						{
							if(this.isUnique(twps, this.allWPS[k].caches[j]))
							{
								twps.push(this.allWPS[k].caches[j]);
							}
						}
						break;
					}
				}
			}
			
        }

        //  add all selected users from the  waypoints to plot

		for(var i = 0; i<this.users.length; i++)
		{
			id = 'usertoadd' + i;
			if(document.getElementById(id).checked)
			{
				for(var k = 0; k<this.allWPS.length; k++)
				{
					if (this.allWPS[k].id == this.users[i].waypointid)
					{
						for(var j = 0; j<this.allWPS[k].caches.length; j++)
						{
							if(this.isUnique(twps, this.allWPS[k].caches[j]))
							{
								twps.push(this.allWPS[k].caches[j]);
							}
						}
						break;
					}
				}
			}
			
        }

        //  now do some scaling stuff
		var lo_lat = 9999999;
	    var lo_lat_code = '';
	    var lo_lon = 9999999;
	    var lo_lon_code = '';
	    var hi_lat = 0;
	    var hi_lat_code = '';
	    var hi_lon = 0;
	    var hi_lon_code = '';


//  convert lon and lat into integers, remove negatives, record min and max values  
  //  and filter so we have welsh caches only for now
  for(var i = 0; i< twps.length; i++)
  {
  	//  reinstate lon and lat from original values
  	twps[i]._attributes.lat = twps[i]._attributes.lat_orig;
    twps[i]._attributes.lon = twps[i]._attributes.lon_orig;

    //  if((result1.gpx[0].wpt[i]['groundspeak:cache'][0]['groundspeak:state'][0]._text == "North West England") ||
     //   (result1.gpx[0].wpt[i]['groundspeak:cache'][0]['groundspeak:state'][0]._text == "South Wales") )
     {
      
      twps[i]._attributes.lat = Math.floor(twps[i]._attributes.lat * 100000);
      twps[i]._attributes.lon = Math.floor(twps[i]._attributes.lon * -100000);

      if (twps[i]._attributes.lat < lo_lat)
      {
        lo_lat = twps[i]._attributes.lat;
        lo_lat_code = twps[i].name._text;
      }
      if (twps[i]._attributes.lat > hi_lat)
      {
        hi_lat = twps[i]._attributes.lat;
        hi_lat_code = twps[i].name._text;
      }

      if (twps[i]._attributes.lon < lo_lon)
      {
        lo_lon = twps[i]._attributes.lon;
        lo_lon_code = twps[i].name._text;
      }
      if (twps[i]._attributes.lon > hi_lon)
      {
        hi_lon = twps[i]._attributes.lon;
        hi_lon_code = twps[i].name._text;
      }
      this.wps.push(twps[i]);
    }
  }

 //  now we have our limits turn the lowest values into 0 and adjust all other values to be relative to that.
  for(var i = 0; i< this.wps.length; i++)
  {
    this.wps[i]._attributes.lat -= lo_lat;
    this.wps[i]._attributes.lon -= lo_lon;
  }
  hi_lat -= lo_lat;
  lo_lat = 0;
  hi_lon -= lo_lon;
  lo_lon = 0;


//  and adjust lon and lat to fit bitmap coordinates (0,0 is at top left)

  for(var i = 0; i< this.wps.length; i++)
  {
    this.wps[i]._attributes.lat = hi_lat - this.wps[i]._attributes.lat;
    this.wps[i]._attributes.lon = hi_lon - this.wps[i]._attributes.lon;
  }



        //  end of scalling stuff


		// //  get the highest coordinate (they are relative and its a square!)
		this.hi = 0;
		
		for (var i = 0; i< this.wps.length; i++)
		{

			if(this.wps[i]._attributes.lon > this.hi)
			   this.hi = this.wps[i]._attributes.lon;
			if(this.wps[i]._attributes.lat > this.hi)
			   this.hi = this.wps[i]._attributes.lat;

		}
		//  removing user caches here so scaling isnt afffected and we can see the gaps with luck
//alert(this.wps.length);
//  remove all selected users from the  waypoints to plot

		for(var i = 0; i<this.users.length; i++)
		{
			id = 'user' + i;
			if(document.getElementById(id).checked)
			{
				for(var k = 0; k<this.allWPS.length; k++)
				{
					if (this.allWPS[k].id == this.users[i].waypointid)
					{
						for(var j = 0; j<this.allWPS[k].caches.length; j++)
						{
							this.removeWP(this.allWPS[k].caches[j]);
							// if(this.isUnique(twps, this.allWPS[k].caches[j]))
							// {
							// 	twps.push(this.allWPS[k].caches[j]);
							// }
						}
						break;
					}
				}
			}
			
        }
//alert(this.wps.length);
	
		//  now potentialy swap the zoom window around if they dragged up or left

		// if (this.startx > this.endx)
		// {
		// 	var t = this.endx;
		// 	this.endx = this.startx;
		// 	this.startx - t;
		// }
		// if (this.starty > this.endy)
		// {
		// 	var t = this.endy;
		// 	this.endy = this.starty;
		// 	this.starty - t;
		// }

		for (var i = 0; i< this.wps.length; i++)
		{
			//  now select only those in the zoom window

			var x = Math.floor(this.wps[i]._attributes.lon / this.hi * document.getElementById("mapCanvas").width);
			var y = Math.floor(this.wps[i]._attributes.lat / this.hi * document.getElementById("mapCanvas").height);
			var r = 0;
			var g = 0;
			var b = 0;
			var a = 255;

			this.drawPixel(x, y, r, g, b, a);
			this.drawPixel(x+1, y, r, g, b, a);
			this.drawPixel(x, y+1, r, g, b, a);
			this.drawPixel(x+1, y, r, g, b, a);
		}

		this.updateCanvas();



	},

	isUnique: function (twps, cache) {
		var ret = true;

		// alert(cache.name[0]._text);
		// for(var j = 0; j<twps.length; j++)
		// {
		// 	if(twps[j].name[0]._text[0] == cache.name[0]._text[0])
		// 		return false;
		// }

		return ret;
	},

	removeWP: function (cache) {

		var c = cache.name[0]._text[0];
		//var c = JSON.stringify(cache.name[0]._text[0]);
		//console.log(c);
		for(var j = 0; j<this.wps.length; j++)
		{
            var obj = this.wps[0];
            var oc = obj.name[0]._text[0];

	        this.wps.shift();
            
            if (oc.valueOf() == c.valueOf())
			{
				//alert('hell yes');
				break;
				
			}
			else
            {
              this.wps.push(obj);
              
            }
       }
	},

	writeMessage: function (x, y) {
        // var context = canvas.getContext('2d');
        // context.clearRect(0, 0, canvas.width, canvas.height);
        // context.font = '18pt Calibri';
        // context.fillStyle = 'black';
        // context.fillText(message, 10, 25);
		if (runState.wps == null)
			return;


        //document.getElementById("cache").innerHTML = runState.wps.length + runState.cc;
        runState.cc+=1;

        for (var i = 0; i< runState.wps.length; i++)
        {
        	var c = runState.wps[i];
        	var x1 = Math.floor(c._attributes.lon / runState.hi * 600);
			var y1 = Math.floor(c._attributes.lat / runState.hi * 600);
			

        	if(x1 == x && y1 == y)
        	{
        		var m = 
        				c.name[0]._text + "<br/>" +
        				c.type[0]._text + "<br/>" +
        				c.desc[0]._text + "<br/>" +
        				c["groundspeak:cache"][0]["groundspeak:country"][0]._text + "/" +
        				c["groundspeak:cache"][0]["groundspeak:state"][0]._text + "<br/>" +
						"<br/>" +
						"<br/>Logs (" + c["groundspeak:cache"][0]["groundspeak:logs"].length + ")"  + "<br/>";

				for(var j = 0; j< c["groundspeak:cache"][0]["groundspeak:logs"].length; j++)
				{
					m += c["groundspeak:cache"][0]["groundspeak:logs"][j]["groundspeak:log"][0]["groundspeak:finder"][0]._text + " " +
				         c["groundspeak:cache"][0]["groundspeak:logs"][j]["groundspeak:log"][0]["groundspeak:type"][0]._text + " on " +
				         c["groundspeak:cache"][0]["groundspeak:logs"][j]["groundspeak:log"][0]["groundspeak:date"][0]._text + " and said...<br/>" + 
			             c["groundspeak:cache"][0]["groundspeak:logs"][j]["groundspeak:log"][0]["groundspeak:text"][0]._text;
				}
				document.getElementById("cache").innerHTML = m;

        		break;
        	}

        }
    },

    tickerpushnotificationreceived(msg)
    {
    	tickersBE.addContent(JSON.parse(msg));
    },

    drawPixel: function (x, y, r, g, b, a) {

    	var index = (x + y * this.canvasWidth) * 4;

	    this.canvasData.data[index + 0] = r;
	    this.canvasData.data[index + 1] = g;
	    this.canvasData.data[index + 2] = b;
	    this.canvasData.data[index + 3] = a;
	},

	updateCanvas: function() {
		 this.ctx.putImageData(this.canvasData, 0, 0);
	},

	logoutclick: function() {

        loggedInUser = {};
        game.state.start('intro');
    },
	
    setBackground: function() 
	{
		 game.add.sprite(0,0,'background'); 
		 game.add.sprite(0,0,'gameheader').scale.setTo(8,.31); 

    },

	colorsPressed: function() 
	{
		 var colordiv = document.getElementById("colorDiv");
		 colordiv.hidden = !colordiv.hidden;
    },

    update: function() 
	{
		//  process any messages

		var l = global.messages.length;
		
		
		for(var i = 0; i<l; i++)
		{
			msg = global.messages[0];
			global.messages.shift();  //  remove it from the message queue
			if(global.suspendMessages == false)
			{
				switch(msg.name)
				{
					case 'redrawall':
						//   {name: 'redrawall'}
					

						for(var i = 0; i<global.loggedInUser.panels.length; i++)
				        {
				        	if (global.loggedInUser.panels[i].manifest != "menu" &&
				        		global.loggedInUser.panels[i].manifest != "dropdown")
				        	{
				        		
						        for(var j = 0; j<panels.length; j++)
						        {
						        	if (panels.children[j].ipanel.name == global.loggedInUser.panels[i].name)
						        		panels.children[j].applyManifest(global.loggedInUser.panels[i].manifest);
						        		
								}

				      		}
						}

						//  better put some content back in there
					break;
					case 'expandpanel':
					//   {name: 'expandpanel', panel: panel, panelexpandspeed: global.panelexpandspeed, jumps: 0}
						msg.jumps += 1;
						
						if(msg.incrementx == null)
						{
							msg.incrementx = (expandedx - msg.panel.ipanel.x) / msg.panelexpandspeed;
							msg.lastincrementx = (expandedx - msg.panel.ipanel.x) - (msg.incrementx * (msg.panelexpandspeed - 1));
							//  also store the original min/max/restore x values
							msg.expander_deltax = msg.panel.panel.x + msg.panel.panel.width - msg.panel.expander.x;
							msg.restorer_deltax = msg.panel.panel.x + msg.panel.panel.width - msg.panel.restorer.x;
							msg.minimiser_deltax = msg.panel.panel.x + msg.panel.panel.width - msg.panel.minimiser.x;
						}
						
						if(msg.incrementy == null)
						{
							msg.incrementy = (expandedy - msg.panel.ipanel.y) / msg.panelexpandspeed;
						    msg.lastincrementy = (expandedy - msg.panel.ipanel.y) - (msg.incrementy * (msg.panelexpandspeed - 1));
						}

						if(msg.incrementh == null)
							msg.incrementh = (expandedh - msg.panel.ipanel.height) / msg.panelexpandspeed;

						if(msg.incrementw == null)
							msg.incrementw = (expandedw - msg.panel.ipanel.width) / msg.panelexpandspeed;

						for(var j = 0; j<msg.panel.controls.length; j++)
						{
							if(msg.jumps != msg.panelexpandspeed)
							{
								msg.panel.controls[j].x += msg.incrementx;
								msg.panel.controls[j].y += msg.incrementy;

								if (msg.panel.controls[j].menux != null)
									msg.panel.controls[j].menux += msg.incrementx;
								if (msg.panel.controls[j].menuy != null)
									msg.panel.controls[j].menuy += msg.incrementy;
							}
							else
							{
								//correct rounding on last jump
								msg.panel.controls[j].x += msg.lastincrementx;
								msg.panel.controls[j].y += msg.lastincrementy;

								if (msg.panel.controls[j].menux != null)
									msg.panel.controls[j].menux += msg.lastincrementx;
								if (msg.panel.controls[j].menuy != null)
									msg.panel.controls[j].menuy += msg.lastincrementy;

							}
						}

						if(msg.jumps != msg.panelexpandspeed)
						{
							//  only stretch certain controls
							msg.panel.panel.height += msg.incrementh;
							msg.panel.panel.width += msg.incrementw;
							msg.panel.panelheader.width += msg.incrementw;

							//  and move others depending on the width change so they stay right aligned in effect
							msg.panel.expander.x += msg.incrementw;
							msg.panel.restorer.x += msg.incrementw;
							msg.panel.minimiser.x += msg.incrementw;
						}
						else
						{
							//  correct rounding on last jump
							//  only stretch certain controls
							msg.panel.panel.height = expandedh;
							msg.panel.panel.width = expandedw;
							msg.panel.panelheader.width = expandedw;

							// //  and move others depending on the width change so they stay right aligned in effect
							msg.panel.expander.x = msg.panel.panel.x + msg.panel.panel.width - msg.expander_deltax;
							msg.panel.restorer.x = msg.panel.panel.x + msg.panel.panel.width - msg.restorer_deltax;
							msg.panel.minimiser.x = msg.panel.panel.x + msg.panel.panel.width - msg.minimiser_deltax;
							
								
						}

						if (msg.jumps != msg.panelexpandspeed)
						{
							global.messages.push(msg);   //  ready for the next screen update
							msg.panel.setpanels(msg.panel.panel);
						}
						else
						{
							//global.messages.push({name: 'givefocus', panel: msg.panel});
							msg.panel.setpanels(msg.panel.panel);

						}

						
	                    break;
	                case 'center':
					//   {name: 'center', panel: panel, panelexpandspeed: global.panelexpandspeed, jumps: 0}
						msg.jumps += 1;
						
						if(msg.incrementx == null)
						{
							msg.incrementx = (((game.world.width - msg.panel.ipanel.width) / 2) - msg.panel.ipanel.x) / msg.panelexpandspeed;
							msg.lastincrementx = (((game.world.width - msg.panel.ipanel.width) / 2) - msg.panel.ipanel.x) - (msg.incrementx * (msg.panelexpandspeed - 1));
								}
						
						if(msg.incrementy == null)
						{
							msg.incrementy = (((game.world.height - msg.panel.ipanel.height) / 2) - msg.panel.ipanel.y) / msg.panelexpandspeed;
						    msg.lastincrementy = (((game.world.height - msg.panel.ipanel.height) / 2) - msg.panel.ipanel.y) - (msg.incrementy * (msg.panelexpandspeed - 1));
						}

						for(var j = 0; j<msg.panel.controls.length; j++)
						{
							if(msg.jumps != msg.panelexpandspeed)
							{
								msg.panel.controls[j].x += msg.incrementx;
								msg.panel.controls[j].y += msg.incrementy;

								if (msg.panel.controls[j].menux != null)
									msg.panel.controls[j].menux += msg.incrementx;
								if (msg.panel.controls[j].menuy != null)
									msg.panel.controls[j].menuy += msg.incrementy;
							}
							else
							{
								//correct rounding on last jump
								msg.panel.controls[j].x += msg.lastincrementx;
								msg.panel.controls[j].y += msg.lastincrementy;

								if (msg.panel.controls[j].menux != null)
									msg.panel.controls[j].menux += msg.lastincrementx;
								if (msg.panel.controls[j].menuy != null)
									msg.panel.controls[j].menuy += msg.lastincrementy;

							}
						}

						if (msg.jumps != msg.panelexpandspeed)
						{
							global.messages.push(msg);   //  ready for the next screen update
							msg.panel.setpanels(msg.panel.panel);
						}
						else
						{
							//global.messages.push({name: 'givefocus', panel: msg.panel});
							msg.panel.setpanels(msg.panel.panel);

							var ph = msg.panel.controls[0];
							// update the user so things are in the same position next time 
							msg.panel.ipanel.x = ph.x;
							msg.panel.ipanel.y = ph.y;

							usersBE.update(global.loggedInUser);

						}

						
	                    break;
				case 'collapsepanel':
					//   {name: 'collapsepanel', panel: panel, panelexpandspeed: global.panelexpandspeed, jumps: 0}
						msg.jumps += 1;
						
						if(msg.incrementx == null)
							msg.incrementx = (expandedx - msg.panel.currentState.ox) / msg.panelexpandspeed * -1;
						
						if(msg.incrementy == null)
							msg.incrementy = (expandedy - msg.panel.currentState.oy) / msg.panelexpandspeed * -1;

						if(msg.incrementh == null)
							msg.incrementh = (expandedh - msg.panel.currentState.oh) / msg.panelexpandspeed * -1;

						if(msg.incrementw == null)
							msg.incrementw = (expandedw - msg.panel.currentState.ow) / msg.panelexpandspeed * -1;

						for(var j = 0; j<msg.panel.controls.length; j++)
						{
							msg.panel.controls[j].x += msg.incrementx;
							msg.panel.controls[j].y += msg.incrementy;

							if (msg.panel.controls[j].menux != null)
								msg.panel.controls[j].menux += msg.incrementx;
							if (msg.panel.controls[j].menuy != null)
								msg.panel.controls[j].menuy += msg.incrementy;

						}

						//  only stretch certain controls
						msg.panel.panel.height += msg.incrementh;
						msg.panel.panel.width += msg.incrementw;
						msg.panel.panelheader.width += msg.incrementw;

						//  and move others depending on the width change so they stay right aligned in effect
						msg.panel.expander.x += msg.incrementw;
						msg.panel.restorer.x += msg.incrementw;
						msg.panel.minimiser.x += msg.incrementw;

						if (msg.jumps != msg.panelexpandspeed)
						{
							global.messages.push(msg);   //  ready for the next screen update
						}
						else
						{

							
						}

	                    msg.panel.setpanels(msg.panel.panel);
						break;
					case 'minimisepanel':
						//   {name: 'minimisepanel', panel: panel}
					
						for(var j = 0; j<msg.panel.controls.length; j++)
						{
							msg.panel.controls[j].visible = false;
							
						}
						msg.panel.ipanel.manifest = 'minimised';
	                	hiddenPanelsBE.getPanelFunctions('My hidden items').rebuildContent(global.loggedInUser);
	    				usersBE.update(global.loggedInUser);
						break;
					case 'unminimisepanel':
						//   {name: 'restorepanel', panel: panel}
						for(var j = 0; j<msg.panel.controls.length; j++)
						{
							msg.panel.controls[j].visible = true;
							
						}
						msg.panel.ipanel.manifest = 'float';
						hiddenPanelsBE.getPanelFunctions('My hidden items').rebuildContent(global.loggedInUser);
						usersBE.update(global.loggedInUser);
						break;
					case 'uppanel':
						//{name: 'uppanel', panel: parent}
						msg.panel.clearContent();
						msg.panel.panel.height = 0;
						msg.panel.ipanel.manifest = 'dropdownhidden';
						msg.panel.upper.visible = false;
    					msg.panel.downer.visible = true;
						usersBE.update(global.loggedInUser);
						break;
					case 'downpanel':
						//{name: 'uppanel', panel: parent}
						msg.panel.ipanel.manifest = 'dropdown';
						hiddenPanelsBE.getPanelFunctions('My hidden items').rebuildContent(global.loggedInUser);
						msg.panel.upper.visible = true;
    					msg.panel.downer.visible = false;
						
						usersBE.update(global.loggedInUser);
						break;
					case 'givefocus':
						//{name: 'givefocus', panel: parent}

						for(var j = 0; j<msg.panel.controls.length; j++)
						{
							game.world.bringToTop(msg.panel.controls[j]);
						}
						break;

				}
			}
		}

		//  were there any changes on color?

		var item = document.getElementById("item");
		var curritem = item.options[item.selectedIndex].value;
		var currcol = document.getElementById("color_value").value;

		if(curritem.toUpperCase() != global.selectedItem.toUpperCase())
		{
			//  changing the item
			//alert(curritem);
			switch(curritem)
			{
				case "Panel background":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                     currcol = RGBtoHex(global.loggedInUser.panels[i].panelColor.BG);
		                  	
		                }
		            }

				break;
				case "Panel foreground":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                     currcol = RGBtoHex(global.loggedInUser.panels[i].panelColor.FG);
		                  	
		                   	
		                }
		            }

				break;
				case "Panel title background":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                     currcol = RGBtoHex(global.loggedInUser.panels[i].titleColor.BG);
		                  	
		                   	
		                }
		            }

				break;
				case "Panel title foreground":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                     currcol = RGBtoHex(vloggedInUser.panels[i].titleColor.FG);
		                  	
		                   	
		                }
		            }

				break;

				case "Hover":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                    currcol = RGBtoHex(global.loggedInUser.panels[i].hoverColor.FG);
		                  	
		                   	
		                }
		            }

				break;
				
				case "Dialog background":
					
		            currcol = RGBtoHex(global.loggedInUser.dialogPanelColor.BG);
		            
				break;
				case "Dialog foreground":
					 currcol = RGBtoHex(global.loggedInUser.dialogPanelColor.FG);

				break;
				case "Dialog title background":
					 currcol = RGBtoHex(global.loggedInUser.dialogTitleColor.BG);

				break;
				case "Dialog title foreground":
					 currcol = RGBtoHex(global.loggedInUser.dialogTitleColor.FG);

				break;


			}


			global.selectedItem = curritem.toUpperCase();
			global.selectedColor = hexToRgb("#" + currcol).toUpperCase();
			document.getElementById("color_value").value = currcol;
            document.getElementById("color_button").style.backgroundColor = "#" + currcol;
                          

		}
		else
		if(currcol.toUpperCase() != RGBtoHex(global.selectedColor).toUpperCase())
		{
			//  change the colour of the current items

			switch(curritem)
			{
				case "Panel background":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                    global.loggedInUser.panels[i].panelColor.BG = hexToRgb("#" + currcol);
		                   	
		                }
		            }

				break;
				case "Panel foreground":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                    global.loggedInUser.panels[i].panelColor.FG = hexToRgb("#" + currcol);
		                   	
		                }
		            }

				break;
				case "Panel title background":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                    global.loggedInUser.panels[i].titleColor.BG = hexToRgb("#" + currcol);
		                   	
		                }
		            }

				break;
				case "Panel title foreground":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                    global.loggedInUser.panels[i].titleColor.FG = hexToRgb("#" + currcol);
		                   	
		                }
		            }

				break;

				case "Hover":
					for(var i = 0; i<global.loggedInUser.panels.length; i++)
		            {
		                if (global.loggedInUser.panels[i].manifest != "menu" && global.loggedInUser.panels[i].manifest != "dropdown")
		                {
		                    global.loggedInUser.panels[i].hoverColor.FG = hexToRgb("#" + currcol);
		                   	
		                }
		            }

				break;

				case "Dialog background":
					
		            global.loggedInUser.dialogPanelColor.BG = hexToRgb("#" + currcol);
		            
				break;
				case "Dialog foreground":
					 global.loggedInUser.dialogPanelColor.FG = hexToRgb("#" + currcol);

				break;
				case "Dialog title background":
					 global.loggedInUser.dialogTitleColor.BG = hexToRgb("#" + currcol);

				break;
				case "Dialog title foreground":
					 global.loggedInUser.dialogTitleColor.FG = hexToRgb("#" + currcol);

				break;

			}

 			usersBE.update(global.loggedInUser);
		    global.messages.push({name: 'redrawall'});
		    
		    if(global.activeDialog.length != 0)
		    {
		    	//  change the active dialog colour

				var headerbmd = game.add.bitmapData(100, 100);
			    headerbmd.ctx.fillStyle = global.loggedInUser.dialogTitleColor.BG;
				headerbmd.ctx.beginPath();
				headerbmd.ctx.fillRect(0, 0, 100, 100);
				headerbmd.ctx.closePath();

				var panelbmd = game.add.bitmapData(100, 100);
			    panelbmd.ctx.fillStyle = global.loggedInUser.dialogPanelColor.BG;
				panelbmd.ctx.beginPath();
				panelbmd.ctx.fillRect(0, 0, 100, 100);
				panelbmd.ctx.closePath();

		    	for(var n = 0; n< global.activeDialog.length; n++)
		    	{
		    		if(global.activeDialog[n].name == "headerBG")
		    		{
						global.activeDialog[n] = {type: "control", subtype: "bitmap", control: headerbmd, name: "headerBG"};

		    		}
		    		if(global.activeDialog[n].name == "bodyBG")
		    		{
						global.activeDialog[n] = {type: "control", subtype: "bitmap", control: panelbmd, name: "bodyBG"};

		    		}

					if(global.activeDialog[n].name == "headerFG")
		    		{
						var s = global.activeDialog[n].control.style;
						s.fill = global.loggedInUser.dialogTitleColor.FG;
						global.activeDialog[n].control.setStyle(s);
					}

					if(global.activeDialog[n].type == "control" && 
						(global.activeDialog[n].subtype == "textbox" ||
							global.activeDialog[n].subtype == "textbox-display" ||
							global.activeDialog[n].subtype == "textbox-label"))
						
		    		{
		    			alert(global.activeDialog[n].control.fill );
		    			var s = global.activeDialog[n].control.style;
messageJSON(s);
						s.fill = global.loggedInUser.dialogPanelColor.FG;
                        global.activeDialog[n].control.setStyle(s);
					}

		    		if(global.activeDialog[n].subtype == "header")
		    		{
						global.activeDialog[n].control.loadTexture(headerbmd);
					}
					if(global.activeDialog[n].subtype == "body")
		    		{
						global.activeDialog[n].control.loadTexture(panelbmd);
					}
		    	}
		    }

		    global.selectedColor = hexToRgb("#" + currcol).toUpperCase();
			
		}


    }
}