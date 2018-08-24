//  Sliding Panel class 'class'

SlidingPanel = function (game, ipanel) {

	
    //  Needed but not needed!!!
  	Phaser.Sprite.call(this, game, ipanel.x, ipanel.y, 'slidingpanel');  
	
	if(ipanel.manifest != 'menu')   //  menues aren't panels as such
		panels.add(this);

	this.controls = [];
   	this.content = [];
   	this.currentOperation = 'static';
   	this.currentState = {manifest: ipanel.manifest, ox: ipanel.x, oy: ipanel.y, oh: ipanel.height ,ow: ipanel.width};
   	this.tag = ipanel.name;

   	this.titlestyle = { font: "12px Arial", 
   	                    fill: "#fff", 
   	                    align: "center", 
	 	                boundsAlignH: "center", 
	 	                boundsAlignV: "center", 
	 	                wordWrap: true, wordWrapWidth: 600 };

    this.bodystyle = { font: "12px Arial", 
   	                    fill: "#fff", 
   	                    align: "left", 
	 	                boundsAlignH: "left",
	 	                boundsAlignV: "center" };

	this.ipanel = ipanel;   //  contains persisted state of sliding panel

	this.itemOptions = hiddenPanelsBE.getPanelItemOptions(this.tag);

	// this.headerbmd = this.getHeaderBitmap();
	// this.panelbmd = this.getPanelBitmap();

	this.applyManifest(this.ipanel.manifest);
   
    
   

};


SlidingPanel.prototype = Object.create(Phaser.Sprite.prototype);
SlidingPanel.prototype.constructor = SlidingPanel;


SlidingPanel.prototype.getHeaderBitmap = function() {

	var headerbmd = game.add.bitmapData(100, 100);
    headerbmd.ctx.fillStyle = this.ipanel.titleColor.BG;
	headerbmd.ctx.beginPath();
	headerbmd.ctx.fillRect(0, 0, 100, 100);
	headerbmd.ctx.closePath();

	return headerbmd;
};

SlidingPanel.prototype.getPanelBitmap = function() {

	var panelbmd = game.add.bitmapData(100, 100);
    panelbmd.ctx.fillStyle = this.ipanel.panelColor.BG;
	panelbmd.ctx.beginPath();
	panelbmd.ctx.fillRect(0, 0, 100, 100);
	panelbmd.ctx.closePath();

	return panelbmd;
};

SlidingPanel.prototype.applyManifest = function(newManifest) {

	var manifestChanged = false;
	if(this.ipanel.manifest != newManifest)
	{
		manifestChanged = true;
	}

	this.ipanel.manifest = newManifest;
	this.currentState.manifest = newManifest;
	this.headerbmd = this.getHeaderBitmap();
	this.panelbmd = this.getPanelBitmap();

	
	for(var i = 0 ; i< this.controls.length; i++)
	{
		this.controls[i].visible = false;
		delete this.controls[i];
	}

	this.content = [];
	this.controls = [];
   	
    if(this.ipanel.manifest == 'float' || this.ipanel.manifest == 'minimised')
	{

		//  Panel Header needs to go first so we can find it easily
		this.panelheader = game.add.sprite(this.ipanel.x ,this.ipanel.y, this.headerbmd);
		this.panelheader.tag = 'panelheader';
		this.panelheader.scale.setTo(this.ipanel.width/100 ,global.titleHeight/100);  //  100 is the bitmap size
		this.panelheader.inputEnabled = true;
		this.panelheader.input.enableDrag();
		this.panelheader.events.onDragStart.add(this.startDrag, this);
		this.panelheader.events.onDragStop.add(this.stopDrag, this);
        this.controls.push(this.panelheader);

        this.panel = game.add.sprite(this.ipanel.x, this.ipanel.y + global.titleHeight, this.panelbmd);
		this.panel.scale.setTo(this.ipanel.width/100 ,(this.ipanel.height - global.titleHeight)/100);
		this.panel.enableBody = true;  
		this.panel.inputEnabled = true;
		this.panel.events.onInputOver.add(this.mouseover, this);
		this.panel.events.onInputOut.add(this.mouseout, this);
		this.panel.tag = this.tag;
		this.controls.push(this.panel);

		//  do these last so they always have ficus and aren't hidden behind anything
		
		this.paneltext = game.add.text(0, 0, this.ipanel.name, this.titlestyle );
	    this.paneltext.setTextBounds(this.ipanel.x,this.ipanel.y, this.ipanel.width,this.ipanel.height);
	    this.paneltext.addColor(this.ipanel.titleColor.FG, 0); 
	    this.controls.push(this.paneltext);

		this.expander = game.add.sprite(this.ipanel.x + this.ipanel.width - (global.titleHeight * 3), this.ipanel.y, 'expand');
		this.expander.tag = 'expander';
		this.expander.scale.setTo(global.titleHeight/100 ,global.titleHeight/100);  //  100 is the bitmap size
		this.expander.inputEnabled = true;
		this.expander.events.onInputDown.add(this.expandpanel, this);
		this.expander.tag = this.tag;
		this.controls.push(this.expander);

		this.restorer = game.add.sprite(this.ipanel.x + this.ipanel.width - (global.titleHeight * 2), this.ipanel.y, 'restore');
		this.restorer.tag = 'restorer';
		this.restorer.scale.setTo(global.titleHeight/100 ,global.titleHeight/100);  //  100 is the bitmap size
		this.restorer.inputEnabled = true;
		this.restorer.events.onInputDown.add(this.restorepanel, this);
		this.restorer.tag = this.tag;
		this.controls.push(this.restorer);

		this.minimiser = game.add.sprite(this.ipanel.x + this.ipanel.width - (global.titleHeight * 1), this.ipanel.y, 'minimise');
		this.minimiser.tag = 'minimiser';
		this.minimiser.scale.setTo(global.titleHeight/100 ,global.titleHeight/100);  //  100 is the bitmap size
		this.minimiser.inputEnabled = true;
		this.minimiser.events.onInputDown.add(this.minimisepanel, this);
		this.minimiser.tag = this.tag;
		this.controls.push(this.minimiser);

		if (this.ipanel.manifest == 'minimised')
		{
			this.currentState.manifest = 'float';  //  it will be changed back to mimimised in a microsecond
			this.minimisepanel(this.minimiser);
		}
	}

	//  lets do the graphics for a menu
    if(this.ipanel.manifest == 'menu')
	{

		this.panel = game.add.sprite(this.ipanel.x, this.ipanel.y, this.panelbmd);
		this.panel.scale.setTo(this.ipanel.width/100 ,(this.ipanel.height)/100);
		this.panel.enableBody = true;  
		this.panel.inputEnabled = true;
		this.panel.events.onInputOut.add(this.mouseoutmenu, this);
		this.panel.tag = this.tag;
		this.controls.push(this.panel);

	}


	if(this.ipanel.manifest == 'dropdown' || this.ipanel.manifest == 'dropdownhidden')
	{

		//  Panel Header needs to go first so we can fnid it easily
		this.panelheader = game.add.sprite(this.ipanel.x ,this.ipanel.y, this.headerbmd);
		this.panelheader.tag = 'panelheader';
		this.panelheader.scale.setTo(this.ipanel.width/100 ,global.titleHeight/100);  //  100 is the bitmap size
		this.panelheader.inputEnabled = true;
		this.controls.push(this.panelheader);


		if(this.ipanel.alwaysOpen == null || !this.ipanel.alwaysOpen)
		{
			this.downer = game.add.sprite(this.ipanel.x + this.ipanel.width - (global.titleHeight * 1), this.ipanel.y, 'down');
			this.downer.tag = 'downer';
			this.downer.scale.setTo(global.titleHeight/100 ,global.titleHeight/100);  //  100 is the bitmap size
			this.downer.inputEnabled = true;
			this.downer.events.onInputDown.add(this.downpanel, this);
			this.downer.tag = this.tag;
			if(this.ipanel.manifest == 'dropdown')
				this.downer.visible = false;
			this.controls.push(this.downer);

			this.upper = game.add.sprite(this.ipanel.x + this.ipanel.width - (global.titleHeight * 1), this.ipanel.y, 'up');
			this.upper.tag = 'upper';
			this.upper.scale.setTo(global.titleHeight/100 ,global.titleHeight/100);  //  100 is the bitmap size
			this.upper.inputEnabled = true;
			this.upper.events.onInputDown.add(this.uppanel, this);
			this.upper.tag = this.tag;
			if(this.ipanel.manifest == 'dropdownhidden')
				this.upper.visible = false;
			this.controls.push(this.upper);

		}

		this.paneltext = game.add.text(0, 0, this.ipanel.name, this.titlestyle );
	    this.paneltext.setTextBounds(this.ipanel.x,this.ipanel.y, this.ipanel.width,this.ipanel.height);
	    this.paneltext.addColor(this.ipanel.titleColor.FG, 0); 
        this.controls.push(this.paneltext);

        this.panel = game.add.sprite(this.ipanel.x, this.ipanel.y + global.titleHeight, this.panelbmd);
		this.panel.scale.setTo(this.ipanel.width/100 ,(this.ipanel.height - global.titleHeight)/100);
		this.panel.enableBody = true;  
		this.panel.inputEnabled = true;
		this.panel.events.onInputOver.add(this.mouseover, this);
		this.panel.events.onInputOut.add(this.mouseout, this);
		this.panel.tag = this.tag;
		this.controls.push(this.panel);
	}

	if(this.ipanel.manifest == 'left' || this.ipanel.manifest == 'leftclosed')
	{
		// calculate some stuff first

		var totalheight = game.world.height - runState.title.height;
		var leftpanels = 0;
		var topPanelsHeight = 0;
		var bottomPanelsHeight = 0;
		
		//  firstly calculate the lowest order for this manifest to determine display priority
		var lowestorder = 999;
		
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'left' || panels.children[i].ipanel.manifest == 'leftclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
					lowestorder = panels.children[i].ipanel.order;
			}
		}

		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'left' || panels.children[i].ipanel.manifest == 'leftclosed')
				leftpanels += 1;
		
			if (panels.children[i].ipanel.manifest == 'top' || panels.children[i].ipanel.manifest == 'topclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
				{
					if (topPanelsHeight == 0)
						topPanelsHeight = global.topPanelHeight;

					if (panels.children[i].ipanel.manifest == 'topclosed')
						topPanelsHeight += global.titleHeight;
				}
			}
			
			if (panels.children[i].ipanel.manifest == 'bottom' || panels.children[i].ipanel.manifest == 'bottomclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
				{
					if (bottomPanelsHeight == 0)
						bottomPanelsHeight = global.topPanelHeight;

					if (panels.children[i].ipanel.manifest == 'bottomclosed')
						bottomPanelsHeight += global.titleHeight;
				}
			}


		}

		var panelheight = Math.floor((totalheight - topPanelsHeight - bottomPanelsHeight) / leftpanels);

		//  Everything the same as a floater but it will be adjusted afterwards

		//  Panel Header needs to go first so we can find it easily
		
		this.panelheader = game.add.sprite(this.ipanel.x + global.sidePanelWidth, this.ipanel.y, this.headerbmd);
		this.panelheader.tag = 'panelheader';
		this.panelheader.scale.setTo(global.titleHeight/100 ,this.ipanel.height/100);  //  100 is the bitmap size
		this.panelheader.inputEnabled = true;
		this.panelheader.input.enableDrag();
		this.panelheader.events.onDragStart.add(this.startDrag, this);
		this.panelheader.events.onDragStop.add(this.stopDrag, this);
       
		this.controls.push(this.panelheader);

		this.panel = game.add.sprite(this.ipanel.x, this.ipanel.y, this.panelbmd);
        this.panel.scale.setTo(global.sidePanelWidth/100 ,(this.ipanel.height)/100);
		this.panel.enableBody = true;  
		this.panel.inputEnabled = true;
		this.panel.events.onInputOver.add(this.mouseover, this);
		this.panel.events.onInputOut.add(this.mouseout, this);
		this.panel.tag = this.tag;
		this.controls.push(this.panel);

		this.panelsidetext = new CustomText(game, this.ipanel.x + global.sidePanelWidth, this.ipanel.y + global.titleHeight, this.ipanel.name, this.titlestyle );
        game.add.existing(this.panelsidetext);
        this.panelsidetext.addColor(this.ipanel.titleColor.FG, 0); 
	    this.panelsidetext.anchor.set(.75);
        this.panelsidetext.angle = 90;
        this.panelsidetext.y += this.panelsidetext.width / 1.5;
        this.controls.push(this.panelsidetext);

        if (this.ipanel.manifest == 'leftclosed')
		{
			this.currentState.manifest = 'left';  //  it will be changed back to mimimised in a microsecond
			this.minimisepanel(this.minimiser);
		}

		//  adjust all existing left docked panels

		var leftcount = 0;
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'left' || panels.children[i].ipanel.manifest == 'leftclosed')
			{

				var deltay = runState.title.height + topPanelsHeight + (leftcount * panelheight) - panels.children[i].panel.y;
				var deltax = 0 - panels.children[i].panel.x ;
				
				for (var j = 0; j< panels.children[i].controls.length; j++)  
				{
					panels.children[i].controls[j].x += deltax;
					panels.children[i].controls[j].y += deltay;

				}
				// also adjust the height of the actual content panel and the side header
				panels.children[i].panel.height = panelheight;
				panels.children[i].panelheader.height = panelheight;

				leftcount += 1;
				
			}
		}

		
	}
	
	if(this.ipanel.manifest == 'right' || this.ipanel.manifest == 'rightclosed')
	{
		// calculate some stuff first

		var totalheight = game.world.height - runState.title.height;
		var rightpanels = 0;
		var topPanelsHeight = 0;
		var bottomPanelsHeight = 0;
		
		//  firstly calculate the lowest order for this manifest to determine display priority
		var lowestorder = 999;
		
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'right' || panels.children[i].ipanel.manifest == 'rightclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
					lowestorder = panels.children[i].ipanel.order;
			}
		}
		
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'right' || panels.children[i].ipanel.manifest == 'rightclosed')
				rightpanels += 1;


			if (panels.children[i].ipanel.manifest == 'top' || panels.children[i].ipanel.manifest == 'topclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
				{
					if (topPanelsHeight == 0)
						topPanelsHeight = global.topPanelHeight;

					if (panels.children[i].ipanel.manifest == 'topclosed')
						topPanelsHeight += global.titleHeight;
				}
			}
			
			if (panels.children[i].ipanel.manifest == 'bottom' || panels.children[i].ipanel.manifest == 'bottomclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
				{
					if (bottomPanelsHeight == 0)
						bottomPanelsHeight = global.topPanelHeight;

					if (panels.children[i].ipanel.manifest == 'bottomclosed')
						bottomPanelsHeight += global.titleHeight;
				}
			}


		}

		var panelheight = Math.floor((totalheight - topPanelsHeight - bottomPanelsHeight) / rightpanels);

		//  Everything the same as a floater but it will be adjusted afterwards

		//  Panel Header needs to go first so we can find it easily
		
		this.panelheader = game.add.sprite(this.ipanel.x , this.ipanel.y, this.headerbmd);
		this.panelheader.tag = 'panelheader';
		this.panelheader.scale.setTo(global.titleHeight/100 ,this.ipanel.height/100);  //  100 is the bitmap size
		this.panelheader.inputEnabled = true;
		this.panelheader.input.enableDrag();
		this.panelheader.events.onDragStart.add(this.startDrag, this);
		this.panelheader.events.onDragStop.add(this.stopDrag, this);
        this.controls.push(this.panelheader);

		this.panel = game.add.sprite(this.ipanel.x + global.titleHeight, this.ipanel.y, this.panelbmd);
        this.panel.scale.setTo(global.sidePanelWidth/100 ,(this.ipanel.height)/100);
		this.panel.enableBody = true;  
		this.panel.inputEnabled = true;
		this.panel.events.onInputOver.add(this.mouseover, this);
		this.panel.events.onInputOut.add(this.mouseout, this);
		this.panel.tag = this.tag;
		this.controls.push(this.panel);

		this.panelsidetext = new CustomText(game, this.ipanel.x, this.ipanel.y + global.titleHeight, this.ipanel.name, this.titlestyle );
        game.add.existing(this.panelsidetext);
        this.panelsidetext.addColor(this.ipanel.titleColor.FG, 0); 
	    this.panelsidetext.anchor.set(.75);
        this.panelsidetext.angle = 90;
        this.panelsidetext.y += this.panelsidetext.width / 1.5;
        this.controls.push(this.panelsidetext);

        if (this.ipanel.manifest == 'rightclosed')
		{
			this.currentState.manifest = 'right';  //  it will be changed back to mimimised in a microsecond
			this.minimisepanel(this.minimiser);
		}

		//  adjust all existing right docked panels

		var rightcount = 0;
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'right' || panels.children[i].ipanel.manifest == 'rightclosed')
			{

				var deltay = runState.title.height + topPanelsHeight + (rightcount * panelheight) - panels.children[i].panel.y;
				var deltax = game.world.width - global.sidePanelWidth - panels.children[i].panel.x ;
				
				for (var j = 0; j< panels.children[i].controls.length; j++)  
				{
					panels.children[i].controls[j].x += deltax;
					panels.children[i].controls[j].y += deltay;

				}
				// also adjust the height of the actual content panel and the side header
				panels.children[i].panel.height = panelheight;
				panels.children[i].panelheader.height = panelheight;

				rightcount += 1;
				
			}
		}
			
	}

	if(this.ipanel.manifest == 'bottom' || this.ipanel.manifest == 'bottomclosed')
	{
		// calculate some stuff first

		var totalwidth = game.world.width;
		var leftPanelsWidth = 0;
		var rightPanelsWidth = 0;
		var bottompanels = 0;
		
		//  firstly calculate the lowest order for this manifest to determine display priority
		var lowestorder = 999;
		
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'bottom' || panels.children[i].ipanel.manifest == 'bottomclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
					lowestorder = panels.children[i].ipanel.order;
			}
		}

		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'left' || panels.children[i].ipanel.manifest == 'leftclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
				{
					if (leftPanelsWidth == 0)
						leftPanelsWidth = global.sidePanelWidth + global.titleHeight;

					if (panels.children[i].ipanel.manifest == 'leftclosed')
						leftPanelsWidth += global.titleHeight;
				}
			}
			if (panels.children[i].ipanel.manifest == 'bottom' || panels.children[i].ipanel.manifest == 'bottomclosed')
				bottompanels += 1;

			if (panels.children[i].ipanel.manifest == 'right' || panels.children[i].ipanel.manifest == 'rightclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
				{
					if (rightPanelsWidth == 0)
						rightPanelsWidth = global.sidePanelWidth + global.titleHeight;

					if (panels.children[i].ipanel.manifest == 'rightclosed')
						rightPanelsWidth += global.titleHeight;
				}
			}
		}

		var panelwidth = (totalwidth - leftPanelsWidth - rightPanelsWidth) / bottompanels;
		
		//  Everything the same as a floater but it will be adjusted afterwards

		//  Panel Header needs to go first so we can find it easily
		
		this.panelheader = game.add.sprite(this.ipanel.x, this.ipanel.y, this.headerbmd);
		this.panelheader.tag = 'panelheader';
		this.panelheader.scale.setTo(panelwidth/100 , global.titleHeight/100);  //  100 is the bitmap size
		this.panelheader.inputEnabled = true;
		this.panelheader.input.enableDrag();
		this.panelheader.events.onDragStart.add(this.startDrag, this);
		this.panelheader.events.onDragStop.add(this.stopDrag, this);
        this.controls.push(this.panelheader);

		this.panel = game.add.sprite(this.ipanel.x, this.ipanel.y + global.titleHeight, this.panelbmd);
        this.panel.scale.setTo(panelwidth/100 ,(global.topPanelHeight - global.titleHeight)/100);
		this.panel.enableBody = true;  
		this.panel.inputEnabled = true;
		this.panel.events.onInputOver.add(this.mouseover, this);
		this.panel.events.onInputOut.add(this.mouseout, this);
		this.panel.tag = this.tag;
		this.controls.push(this.panel);

		this.paneltext = game.add.text(0, 0, this.ipanel.name, this.titlestyle );
	    this.paneltext.setTextBounds(this.ipanel.x,this.ipanel.y, this.ipanel.width,this.ipanel.height);
	    this.paneltext.addColor(this.ipanel.titleColor.FG, 0); 
	    this.paneltext.tag = 'paneltext';
		this.controls.push(this.paneltext);

        if (this.ipanel.manifest == 'bottomclosed')
		{
			this.currentState.manifest = 'bottom';  //  it will be changed back to mimimised in a microsecond
			this.minimisepanel(this.minimiser);
		}

		// //  adjust all existing bottom docked panels

		var bottomcount = 0;
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'bottom' || panels.children[i].ipanel.manifest == 'bottomclosed')
			{

				var deltax  = leftPanelsWidth + (bottomcount * panelwidth) - panels.children[i].panel.x;
				var deltay = (game.world.height - global.topPanelHeight) - panels.children[i].panel.y + global.titleHeight;
				for (var j = 0; j< panels.children[i].controls.length; j++)  
				{
					panels.children[i].controls[j].x += deltax;
					panels.children[i].controls[j].y += deltay;
					
				}
				// also adjust the width of the actual content panel and the side header
				panels.children[i].panel.width = panelwidth;
				panels.children[i].panelheader.width = panelwidth;

				bottomcount += 1;
			}
		}

		
	}

	if(this.ipanel.manifest == 'top' || this.ipanel.manifest == 'topclosed')
	{
		// calculate some stuff first

		var totalwidth = game.world.width;
		var leftPanelsWidth = 0;
		var rightPanelsWidth = 0;
		var toppanels = 0;
		
		//  firstly calculate the lowest order for this manifest to determine display priority
		var lowestorder = 999;
		
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'top' || panels.children[i].ipanel.manifest == 'topclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
					lowestorder = panels.children[i].ipanel.order;
			}
		}

		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'left' || panels.children[i].ipanel.manifest == 'leftclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
				{
					if (leftPanelsWidth == 0)
						leftPanelsWidth = global.sidePanelWidth + global.titleHeight;

					if (panels.children[i].ipanel.manifest == 'leftclosed')
						leftPanelsWidth += global.titleHeight;
				}
			}
			if (panels.children[i].ipanel.manifest == 'top' || panels.children[i].ipanel.manifest == 'topclosed')
				toppanels += 1;

			if (panels.children[i].ipanel.manifest == 'right' || panels.children[i].ipanel.manifest == 'rightclosed')
			{
				if(panels.children[i].ipanel.order < lowestorder)
				{
					if (rightPanelsWidth == 0)
						rightPanelsWidth = global.sidePanelWidth + global.titleHeight;

					if (panels.children[i].ipanel.manifest == 'rightclosed')
						rightPanelsWidth += global.titleHeight;
				}
			}
		}

		var panelwidth = (totalwidth - leftPanelsWidth - rightPanelsWidth) / toppanels;
		
		//  Everything the same as a floater but it will be adjusted afterwards

		//  Panel Header needs to go first so we can find it easily
		
		this.panelheader = game.add.sprite(this.ipanel.x, this.ipanel.y + global.topPanelHeight - global.titleHeight, this.headerbmd);
		this.panelheader.tag = 'panelheader';
		this.panelheader.scale.setTo(panelwidth/100 , global.titleHeight/100);  //  100 is the bitmap size
		this.panelheader.inputEnabled = true;
		this.panelheader.input.enableDrag();
		this.panelheader.events.onDragStart.add(this.startDrag, this);
		this.panelheader.events.onDragStop.add(this.stopDrag, this);
        this.controls.push(this.panelheader);

		this.panel = game.add.sprite(this.ipanel.x, this.ipanel.y, this.panelbmd);
        this.panel.scale.setTo(panelwidth/100 ,(global.topPanelHeight - global.titleHeight)/100);
		this.panel.enableBody = true;  
		this.panel.inputEnabled = true;
		this.panel.events.onInputOver.add(this.mouseover, this);
		this.panel.events.onInputOut.add(this.mouseout, this);
		this.panel.tag = this.tag;
		this.controls.push(this.panel);

		this.paneltext = game.add.text(0, 0, this.ipanel.name, this.titlestyle );
	    this.paneltext.setTextBounds(this.ipanel.x,this.ipanel.y + global.topPanelHeight - global.titleHeight, this.ipanel.width,this.ipanel.height);
	    this.paneltext.addColor(this.ipanel.titleColor.FG, 0); 
	    this.paneltext.tag = 'paneltext';
		this.controls.push(this.paneltext);

        if (this.ipanel.manifest == 'bottomclosed')
		{
			this.currentState.manifest = 'bottom';  //  it will be changed back to mimimised in a microsecond
			this.minimisepanel(this.minimiser);
		}

		// //  adjust all existing bottom docked panels

		var topcount = 0;
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == 'top' || panels.children[i].ipanel.manifest == 'topclosed')
			{

				var deltax  = leftPanelsWidth + (topcount * panelwidth) - panels.children[i].panel.x;
				var deltay = (runState.title.height) - panels.children[i].panel.y;
				for (var j = 0; j< panels.children[i].controls.length; j++)  
				{
					panels.children[i].controls[j].x += deltax;
					panels.children[i].controls[j].y += deltay;
					
				}
				// also adjust the width of the actual content panel and the side header
				panels.children[i].panel.width = panelwidth;
				panels.children[i].panelheader.width = panelwidth;

				topcount += 1;
			}
		}

		
	}

	//  pretty borders
	if(this.ipanel.manifest != 'menu')
		this.setpanels(this.panel);

	//  update the order of panels and manifest for the user
	
	if (manifestChanged)
	{
		//  group like manifests so screen docking priority is maintain if panels are undocked in a funny order

		var higestOrder = 0;
		for(var i = 0; i<panels.length; i++)
		{
			if (panels.children[i].ipanel.manifest == this.ipanel.manifest && panels.children[i].tag != this.tag)
			{
				if(panels.children[i].ipanel.order > higestOrder)
					higestOrder = panels.children[i].ipanel.order;
			}
		}

		if (higestOrder == 0)
			this.ipanel.order = 999;
		else
			this.ipanel.order = higestOrder + 0.00001;

		sortPanelsForUser(global.loggedInUser);
		usersBE.update(global.loggedInUser);

		//  All done here, now redraw everything in order
		global.messages.push({name: 'redrawall'});
	}

	//  temporary switch to build content until I 
    //  databaseize the content builder function

  //   switch (this.ipanel.name)
  //   {
  //   	case "My options":
 	 	//optionsBE.getContent(global.loggedInUser);
		// break;
  //   }
	
	this.ipanel.contentBuilder(this);


};



SlidingPanel.prototype.uppanel = function(panel) {

	var parent = null;
	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == panel.tag)
		{
			parent = panels.children[i];
			break;
		}
	}

	global.messages.push({name: 'givefocus', panel: parent});


	global.messages.push({name: 'uppanel', panel: parent});
   
}

SlidingPanel.prototype.downpanel = function(panel) {

	var parent = null;
	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == panel.tag)
		{
			parent = panels.children[i];
			break;
		}
	}

	global.messages.push({name: 'givefocus', panel: parent});


	global.messages.push({name: 'downpanel', panel: parent});
    parent.upper.visible = true;
    parent.downer.visible = false;


}
SlidingPanel.prototype.restorepanel = function(panel) {

	var parent = null;
	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == panel.tag)
		{
			parent = panels.children[i];
			break;
		}
	}

	global.messages.push({name: 'givefocus', panel: parent});


	if (parent.currentState.manifest == 'float')
		return;

	global.messages.push({name: 'collapsepanel', panel: parent, panelexpandspeed: global.panelexpandspeed, jumps: 0});
    parent.currentState.manifest = 'float';

}

SlidingPanel.prototype.expandpanel = function(panel) {

	var parent = null;
	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == panel.tag)
		{
			parent = panels.children[i];
			break;
		}
	}

	if (parent.currentState.manifest != 'expanded')
		this.expand(parent, panel);

	
		

}

SlidingPanel.prototype.minimisepanel = function(panel) {
	
	var parent = null;
	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == panel.tag)
		{
			parent = panels.children[i];
			break;
		}
	}

	if (parent.currentState.manifest != 'minimised')
	{
		global.messages.push({name: 'minimisepanel', panel: parent});
		parent.currentState.unminimisemanifest = parent.currentState.manifest;
    	parent.currentState.manifest = 'minimised';
	}

}

SlidingPanel.prototype.unminimisepanel = function(panel) {

	var parent = null;
	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == panel.tag)
		{
			parent = panels.children[i];
			break;
		}
	}

	if (parent.currentState.manifest != 'float')
	{
		global.messages.push({name: 'unminimisepanel', panel: parent});
    	parent.currentState.manifest = parent.currentState.unminimisemanifest;
	}

}

SlidingPanel.prototype.mouseover = function(panel) {


	var parent = null;
	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == panel.tag)
		{
			parent = panels.children[i];
			break;
		}
	}

	global.messages.push({name: 'givefocus', panel: parent});

	if (parent.currentState.manifest == 'dropdown' || 
		parent.currentState.manifest == 'left' ||
		parent.currentState.manifest == 'right' ||
		parent.currentState.manifest == 'top' ||
		parent.currentState.manifest == 'bottom')
		return;

	//  auto expand when lingering over a panel (probably need to become optional as it irrittes me!!)
	 //if (parent.currentState.manifest != 'expanded')
	// 	parent.expandingIn = setInterval(parent.expand, panelexpandinterval, parent, panel); 
}

SlidingPanel.prototype.mouseout = function(panel) {

	var parent = null;
	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == panel.tag)
		{
			parent = panels.children[i];
			break;
		}
	}

	if (parent.currentState.manifest == 'dropdown')
		return;

	clearInterval(parent.expandingIn);
	
}

SlidingPanel.prototype.mouseoutmenu = function(panel) {

	//blow the menu away and everything in it
	panel.visible = false;
	this.destroy();
	
}

SlidingPanel.prototype.expand = function(parent, panel) {

	clearInterval(parent.expandingIn);
	
	
	global.messages.push({name: 'givefocus', panel: parent});

	
	parent.currentState = {manifest: 'expanded', ox: parent.ipanel.x, oy: parent.ipanel.y, oh: parent.ipanel.height ,ow: parent.ipanel.width};
    global.messages.push({name: 'expandpanel', panel: parent, panelexpandspeed: global.panelexpandspeed, jumps: 0});
}

SlidingPanel.prototype.startDrag = function(sprite, pointer) {

	var ph = this.controls[0];
	this.currentOperation = 'dragging';
	//paneltext

	ph.ox = ph.x;
	ph.oy = ph.y;

	if (pointer != null)
	{
		//  I.E. called as a listener rather than directly
	
		if(this.ipanel.manifest == 'left' ||
			this.ipanel.manifest == 'leftclosed' ||
			this.ipanel.manifest == 'right' ||
			this.ipanel.manifest == 'rightclosed' ||
			this.ipanel.manifest == 'bottom' ||
			this.ipanel.manifest == 'bottomclosed' ||
			this.ipanel.manifest == 'top' ||
			this.ipanel.manifest == 'topclosed')
		{
			//  we are liberating a previously docked panel

			//  firstly float it
			this.ipanel.x = Math.floor(pointer.x);
			this.ipanel.y = Math.floor(pointer.y);
			this.currentOperation = 'undocking';  //  stop update() getting in on the act
			this.applyManifest('float');

			//  and now send a message to ccentralise it
			global.messages.push({name: 'center', panel: this, panelexpandspeed: global.panelexpandspeed, jumps: 0});
		}
	}
}


SlidingPanel.prototype.stopDrag = function(sprite, pointer) {

	this.currentOperation = 'static';
	var ph = this.controls[0];

	// update the user so things are in the same position next time 
	this.ipanel.x = ph.x;
	this.ipanel.y = ph.y;

	usersBE.update(global.loggedInUser);

}

SlidingPanel.prototype.update = function() {

	//  keep everything upto date during a D&D
	if (this.currentOperation == 'dragging')
	{
		var ph = this.controls[0];

		var deltax = ph.x - ph.ox;
		var deltay = ph.y - ph.oy;
		ph.ox = ph.x;
		ph.oy = ph.y;

		for (var i = 1; i< this.controls.length; i++)  //  misses the panel header (already moved by the mouse!)
		{
			this.controls[i].x += deltax;
			this.controls[i].y += deltay;

			if (this.controls[i].menux != null)
				this.controls[i].menux += deltax;
			if (this.controls[i].menuy != null)
				this.controls[i].menuy += deltay;
		}

		if(this.ipanel.manifest == 'float' || this.ipanel.manifest == 'minimised')
		{
			//  have we gone off the edges and should therefore change manifest?

			if (ph.x < 0)
			{
				//  dock left hand side
				this.applyManifest('left');
				this.stopDrag();

			}
			else
			if (ph.x + this.panel.width > game.world.width)
			{
				//  dock right hand side
				this.applyManifest('right');
				this.stopDrag();

			}
			else
			if (ph.y + this.panel.height + global.titleHeight > game.world.height)
			{
				//  dock at the bottom
				this.applyManifest('bottom');
				this.stopDrag();

			}
			else
			if (ph.y < runState.title.height)
			{
				//  dock at the top

				this.applyManifest('top');
				this.stopDrag();

			}
		}
		else
		{
			// we are liberating a docked panel

			//  Do nothing for now, I think!!

		}
		
	}

}

function sortPanelsForUser(user)
{

	user.panels.sort(function(a, b) {
         
              if (a.order > b.order) 
                return 1;
              else 
              if (a.order < b.order)
                return -1;
              else
                return 0;

    });

    for(var i = 0; i< user.panels.length; i++)
    {
    	user.panels[i].order = i + 1;
    }

}

SlidingPanel.prototype.clearContent = function(noclear)
{

	//  destroy content objects first
	for(var i = 0 ; i< this.controls.length; i++)
	{
		if (this.controls[i].deleteme != null && this.controls[i].deleteme)
		{
			this.controls[i].visible = false;
			delete this.controls[i];
		}
	}

	//  now clean up the controls array by removing null entries

	var l = this.controls.length;
	for(var i = 0 ; i< l; i++)
	{
		var c = this.controls[0];
		this.controls.shift();
		if (c != null)
			this.controls.push(c);
	}

	//  now empty the content array
	if (noclear)
		return;
	
	this.content = [];
	
}

SlidingPanel.prototype.insertContent = function() 
{
	var contentsize = 0;
	for(var i = this.content.length - 1; i>=0; i--)
	{
		var line = this.content[i];
		var txt = '';
		if (line.date != null)
			{	var d = new Date(line.date)
			txt = d.toLocaleString() + ' - ' + line.text;
		}
		
		else
			txt = line.text;
		
		var x = this.panel.x;
		var y = this.panel.y + ((this.content.length - i - 1) * (global.titleHeight + 1));

		this.newtext = game.add.text(0, 0, txt, this.bodystyle);
		shortentextbypixel(this.newtext, this.panel.width);
		this.newtext.setTextBounds(x, y, global.titleHeight);
		this.newtext.events.onInputOver.add(this.mouseovercontent, this);
		this.newtext.events.onInputOut.add(this.mouseoutcontent, this);
	    this.newtext.deleteme = true;
	    this.newtext.inputEnabled = true;
	    this.newtext.paneltag = this.tag;
	    this.newtext.texttag = this.tag + '-' + txt;
	    this.newtext.events.onInputDown.add(this.clickonContent, this);
	    if (this.content[i].menuFunction != null)
	    	this.newtext.menuFunction = this.content[i].menuFunction;
	    this.newtext.parentItem = this.content[i].parentItem;
	   	var s = this.newtext.style;
		s.fill = this.ipanel.panelColor.FG;
		this.newtext.setStyle(s);

      	this.newtext.menux = x;
		this.newtext.menuy = y;
        contentsize += global.titleHeight + 1;
        this.controls.push(this.newtext);
	    
    }

	if (this.ipanel.manifest != 'left' &&
		this.ipanel.manifest != 'right' &&
		this.ipanel.manifest != 'top' &&
		this.ipanel.manifest != 'bottom')
	{
	    switch(this.ipanel.adjustToContent)
	    {

	    	case 'stretch':
	    		
	    			this.panel.height = contentsize;
	    		break;

	    }
	}

    this.setpanels(this.panel);
}

SlidingPanel.prototype.mouseovercontent = function(content) {
	
	var parent = null;

	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == content.paneltag)
		{
			parent = panels.children[i];
			break;
		}
	}

	if(parent == null)
	{
		//  all things being good this mean its menu content
		parent = activemenu;
		
	}
 
 	var s = content.style;
	s.fill = parent.ipanel.hoverColor.FG;
	content.setStyle(s);
	    
}

SlidingPanel.prototype.mouseoutcontent = function(content) {

	var parent = null;

	for(var i = 0; i<panels.length;i++)
	{
		if (panels.children[i].tag == content.paneltag)
		{
			parent = panels.children[i];
			break;
		}
	}

	if(parent == null)
	{
		//  all things being good this menu its menu content
		parent = activemenu;
	}

	var s = content.style;
	s.fill = parent.ipanel.panelColor.FG;
	content.setStyle(s);
  
}

SlidingPanel.prototype.clickonContent = function(item) 
{

	if(this.ipanel.manifest != "menu")
	{
		//  a menu was requested by clicking on an item in THIS panel
		var opts = this.itemOptions;
		var menu = null;

		if(opts == null)
		{
			//  must be a panel acting as a dropdown so
			//  perform a 'value-changed'

			//  of may be the no content label

			if(item.text != "(No Content)")
			{
				this.ipanel.valueChanged(item);
			}
			return;
		}

		if(opts.length == 1)
		{
			//  just execute it
			opts[0].menuFunction(item);
		}
		else
		{
			for(var i = 0; i<global.loggedInUser.panels.length; i++)
			{
				if(global.loggedInUser.panels[i].manifest == "menu")
				{
					global.loggedInUser.panels[i].x = item.menux;
					global.loggedInUser.panels[i].y = item.menuy;
		    		activemenu = new SlidingPanel(game, global.loggedInUser.panels[i]);
		    		activemenu.parentItem = item;
		    		menusBE.getContent(activemenu, opts)
		    	}
		    }
 		}
	}
	else
	{
		//  this is a menu item and an item was clicked so execute the associated function
		item.menuFunction(item.parentItem);

		
	}
}

SlidingPanel.prototype.setpanels = function() 
{ 


	// the header
	if (this.panelheader != null)
	{
		if (this.panelheader.width < this.panelheader.height)
		{
			//  must be a side panel so give it a groove champher
		}
		else
		{
			this.headerbmd = game.add.bitmapData(this.panelheader.width, this.panelheader.height);
		    this.headerbmd.ctx.fillStyle = this.ipanel.titleColor.BG;
			this.headerbmd.ctx.beginPath();
			this.headerbmd.ctx.fillRect(0, 0, this.panelheader.width, this.panelheader.height);
			this.headerbmd.ctx.closePath();

			this.headerbmd.ctx.fillStyle = titleBoarderColor;
			this.headerbmd.ctx.beginPath();
			this.headerbmd.ctx.fillRect(0, 0, 1, this.panelheader.height);
			this.headerbmd.ctx.closePath();

		    this.headerbmd.ctx.beginPath();
			this.headerbmd.ctx.fillRect(0, this.panelheader.height - 1, this.panelheader.width, 1);
			this.headerbmd.ctx.closePath();

			this.headerbmd.ctx.beginPath();
			this.headerbmd.ctx.fillRect(this.panelheader.width - 1, 0, 1, this.panelheader.height);
			this.headerbmd.ctx.closePath();

			this.headerbmd.ctx.beginPath();
			this.headerbmd.ctx.fillRect(0, 0, this.panelheader.width, 1);
			this.headerbmd.ctx.closePath();

			this.panelheader.loadTexture(this.headerbmd);
			this.panelheader.scale.setTo(1 ,1);
		}
	}
	//  and the panel itself

	this.panelbmd = game.add.bitmapData(this.panel.width, this.panel.height);
    this.panelbmd.ctx.fillStyle = this.ipanel.panelColor.BG;
	this.panelbmd.ctx.beginPath();
	this.panelbmd.ctx.fillRect(0, 0, this.panel.width, this.panel.height);
	this.panelbmd.ctx.closePath();

	this.panelbmd.ctx.fillStyle = panelBoarderColor;
	this.panelbmd.ctx.beginPath();
	this.panelbmd.ctx.fillRect(0, 0, 1, this.panel.height);
	this.panelbmd.ctx.closePath();

    this.panelbmd.ctx.beginPath();
	this.panelbmd.ctx.fillRect(0, this.panel.height - 1, this.panel.width, 1);
	this.panelbmd.ctx.closePath();

	this.panelbmd.ctx.beginPath();
	this.panelbmd.ctx.fillRect(this.panel.width - 1, 0, 1, this.panel.height);
	this.panelbmd.ctx.closePath();

	this.panelbmd.ctx.beginPath();
	this.panelbmd.ctx.fillRect(0, 0, this.panel.width, 1);
	this.panelbmd.ctx.closePath();

	this.panel.loadTexture(this.panelbmd);
	this.panel.scale.setTo(1 ,1);


}


