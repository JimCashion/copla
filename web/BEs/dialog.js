//  hidden panels BE functions

dialogBE = {

	//  List users
	getStandardDialog: function(title, buttons, validate, save, newrecord, deleterecord, dlgtype)
	{

		global.activeDialog.push({type: "info", subtype: null, title: title, buttons: buttons});
		this.validate = validate;
		this.save = save;
		this.newrecord = newrecord;
		this.deleterecord = deleterecord;
		this.dlgtype = dlgtype;
		this.layout = null;

		var headerbmd = game.add.bitmapData(100, 100);
	    headerbmd.ctx.fillStyle = global.loggedInUser.dialogTitleColor.BG;
		headerbmd.ctx.beginPath();
		headerbmd.ctx.fillRect(0, 0, 100, 100);
		headerbmd.ctx.closePath();
		global.activeDialog.push({type: "control", subtype: "bitmap", control: headerbmd, name: "headerBG"});

		var panelbmd = game.add.bitmapData(100, 100);
	    panelbmd.ctx.fillStyle = global.loggedInUser.dialogPanelColor.BG;
		panelbmd.ctx.beginPath();
		panelbmd.ctx.fillRect(0, 0, 100, 100);
		panelbmd.ctx.closePath();
		global.activeDialog.push({type: "control", subtype: "bitmap", control: panelbmd, name: "bodyBG"});


		var panelheader = game.add.sprite(0, runState.title.height , headerbmd);
		panelheader.scale.setTo((game.world.width)/100 ,(runState.title.height)/100);  //  100 is the bitmap size
		global.activeDialog.push({type: "control", subtype: "header", control: panelheader});


		if (buttons.close != null && buttons.close.render)
		{
			this.bclose = game.add.sprite(game.world.width - runState.title.height - 2, runState.title.height + 2, 'close');
			this.bclose.scale.setTo((runState.title.height - 4)/100 ,(runState.title.height - 4)/100);  //  100 is the bitmap size
			this.bclose.visible = !buttons.close.hidden;
			this.bclose.inputEnabled = true;
			this.bclose.tag = "close";
			this.bclose.events.onInputDown.add(this.controlButtonPressed, this);
		    global.activeDialog.push({type: "control", subtype: "button", control: this.bclose, name: "bclose"});

		}

		if (buttons.save != null && buttons.save.render)
		{
			this.bsave = game.add.sprite(game.world.width - runState.title.height - 2 - runState.title.height, runState.title.height + 2, 'save');
			this.bsave.scale.setTo((runState.title.height - 4)/100 ,(runState.title.height - 4)/100);  //  100 is the bitmap size
			this.bsave.visible = !buttons.save.hidden;
			this.bsave.inputEnabled = true;
			this.bsave.tag = "save";
			this.bsave.events.onInputDown.add(this.controlButtonPressed, this);
		    global.activeDialog.push({type: "control", subtype: "button", control: this.bsave, name: "bsave"});

		}

		if (buttons.new != null && buttons.new.render)
		{
			this.bnew = game.add.sprite(game.world.width - runState.title.height - 2 - runState.title.height - runState.title.height, runState.title.height + 2, 'new');
			this.bnew.scale.setTo((runState.title.height - 4)/100 ,(runState.title.height - 4)/100);  //  100 is the bitmap size
			this.bnew.visible = !buttons.new.hidden;
			this.bnew.inputEnabled = true;
			this.bnew.tag = "new";
			this.bnew.events.onInputDown.add(this.controlButtonPressed, this);
		    global.activeDialog.push({type: "control", subtype: "button", control: this.bnew, name: "bnew"});

		}

		if (buttons.delete != null && buttons.delete.render)
		{
			this.bdelete = game.add.sprite(game.world.width - runState.title.height - 2 - runState.title.height - runState.title.height - runState.title.height, runState.title.height + 2, 'delete');
			this.bdelete.scale.setTo((runState.title.height - 4)/100 ,(runState.title.height - 4)/100);  //  100 is the bitmap size
			this.bdelete.visible = !buttons.delete.hidden;
			this.bdelete.inputEnabled = true;
			this.bdelete.tag = "delete";
			this.bdelete.events.onInputDown.add(this.controlButtonPressed, this);
		    global.activeDialog.push({type: "control", subtype: "button", control: this.bdelete, name: "bdelete"});

		}

		var paneltext = game.add.text(0, 0, title, dialogStyle );
	    paneltext.setTextBounds(0, runState.title.height, game.world.width,runState.title.height);
	    var s = paneltext.style;
		s.fill = global.loggedInUser.dialogTitleColor.FG;
		paneltext.setStyle(s);
	    global.activeDialog.push({type: "control", subtype: "headertext", control: paneltext, name: "headerFG"});

        var panelBody = game.add.sprite(0, runState.title.height + runState.title.height, panelbmd);
		panelBody.scale.setTo((game.world.width)/100 ,(game.world.height - runState.title.height - runState.title.height)/100);
		global.activeDialog.push({type: "control", subtype: "body", control: panelBody});


		var dialogdiv = document.getElementById("dialogDiv");
		dialogdiv.hidden = false;

		//  lets have a status field

		var stsDiv = document.createElement('div'); 
		stsDiv.style.width = "750px";
		stsDiv.style.textAlign = "right";
		
		this.updatestatus = document.createElement('label'); 
		this.updatestatus.id = "updatestatus";
		this.updatestatus.innerHTML = "&nbsp;";
		stsDiv.appendChild(this.updatestatus); 
		dialogdiv.appendChild(stsDiv); 

    	if(this.dlgtype == "simpleCRUD")
    	{
			this.supertable = document.createElement('table'); 
			this.supertable.width = game.world.width;
			//this.supertable.border = "2px 2px 2px 2px";
			var tr = this.supertable.insertRow();
			this.listcell = tr.insertCell();
			this.listcell.style.verticalAlign = "top";
			this.listcell.width = 150;
			this.contentcell = tr.insertCell();
			this.contentcell.width = 650;
			this.contentcell.style.verticalAlign = "top";
			dialogdiv.appendChild(this.supertable); 

		}


    	this.layout = document.createElement('table');  //  the layout is in fact an html table!!
    		
		this.layout.id = "dlgTable";
		//simpleCRUDthis.layout.border = "1px 1px 1px 1px";

		var tableh = this.layout.createTHead();
		this.headerrow = tableh.insertRow(); 
		
		switch(this.dlgtype)
		{
			case "simpleForm":
				//  set up the body of a simple form

				var tabled = this.headerrow.insertCell(); 
				tabled.width = 150;
				//tabled.height=100;
				tabled.align = "right";
				tabled = this.headerrow.insertCell();  
				tabled.width = 400;
				//tabled.height=100;
				tabled.align = "left";
				tabled = this.headerrow.insertCell(); 
				tabled.width = 10;
				//tabled.height=100;
				tabled.align = "center";
				tabled = this.headerrow.insertCell(); 
				tabled.width = 190;
				//tabled.height=100;
				tabled.align = "left";
				
			break;
			case "simpleCRUD":

				
				tabled = this.headerrow.insertCell(); 
				tabled.width = 100;
				tabled.align = "right";
				tabled = this.headerrow.insertCell();  
				tabled.width = 300;
				tabled.align = "left";
				tabled = this.headerrow.insertCell(); 
				tabled.width = 10;
				tabled.align = "center";
				tabled = this.headerrow.insertCell(); 
				tabled.width = 190;
				tabled.align = "left";
			break;
		}
		this.layout.appendChild(tableh);  
		//  now the cells
		//  ready for rows to be added
		var tableb = this.layout.createTBody();
		tableb.id = "dlgTableBody";
		this.layout.appendChild(tableb);  

		//  add the form layout to the DIV for display
		if(this.dlgtype == "simpleCRUD")
    	{
    		this.layout.width = game.world.width - 150;
		
    		this.contentcell.appendChild(this.layout);
    	}
    	else
    	{
    		this.layout.width = game.world.width;
		
			dialogdiv.appendChild(this.layout); 
		}
	},

	controlButtonPressed: function(button) {
		
		switch (button.tag)
		{
			case "close":
				this.event_close();
				break;
			case "save":
				this.event_save();
				break;
			case "new":
				this.event_new();
				break;
			case "delete":
				this.event_delete();
				break;
		}

	},

	event_save: async function(button) 
	{
		var ok = await this.event_validate();
		if(ok)
		{
			this.save();
			if (this.dlgtype == "simpleForm")
				this.event_close(button);
			else
			if (this.dlgtype == "simpleCRUD")
			{
				
				var sts = document.getElementById("updatestatus");
				sts.innerHTML = "Changes have been saved";
				sts.style.color = "green";
					
			}
				
		}
		
	},

	event_validate: async function()
	{
		var manderror = false;
		
		var table = document.getElementById('dlgTableBody');
		for (var i = 0; i< table.rows.length; i++)
		{
 			//  get rid if existing errors
			if (table.rows[i].cells[3].firstChild != null)
			{
				table.rows[i].cells[3].firstChild.innerHTML = "&nbsp;";
			}

			//  check for mandatory fields
			if (table.rows[i].cells[2].firstChild != null)
			{
				if (table.rows[i].cells[2].firstChild.innerHTML == "*")
				{
					//  a mandatory field was found
					if (replaceAll(table.rows[i].cells[1].firstChild.value, " ", "") == "")
					{
						manderror = true;
						table.rows[i].cells[3].firstChild.innerHTML = "This is a required field";
					}
				}
			}
		}

		//  now check everything else and return true of no errors at all
	
		var othererrors = await this.validate();
		
		return !othererrors && !manderror;

	},

	event_new: function()
	{
		var sts = document.getElementById("updatestatus")
		sts.innerHTML = "&nbsp;";
		
		this.newrecord();
	},
	
	event_delete: function()
	{
		this.deleterecord();
	},

	//changed
	event_close: function(button) {

		for(var i = 0; i< global.activeDialog.length; i++)
		{
			if(global.activeDialog[i].type == "control")
			{
				global.activeDialog[i].control.destroy();
			}

		}
	
		global.activeDialog = [];
		global.suspendMessages = false;
		var dialogdiv = document.getElementById("dialogDiv");
		dialogdiv.innerHTML = "";
		dialogdiv.hidden = true;
	},

	addList: function(p)
	{
		var selectuser = document.createElement("select");
		selectuser.id = replaceAll(p.label, " ", "");
		selectuser.setAttribute("multiple", true);
		selectuser.style.width = "100%";
		selectuser.size = "34";


		//  get some content
		p.contentBuilder(selectuser);
		this.listcell.appendChild(selectuser);

		selectuser.onchange = function() {p.valueChanged()};

	},

	addTextBox: function(p)
	{
		//  for now we will cater for a simple dialog with only 1 column of data (4 cells)
		//  but put that into a variable to make it easier to change leter if required

		var startcell = 0;

		
		var table = document.getElementById('dlgTableBody');
		var row = table.insertRow();


		for (var i = 0; i< this.headerrow.cells.length; i++)
		{
			var cell = row.insertCell(i);
			cell.align = this.headerrow.cells[i].align;
			cell.width = this.headerrow.cells[i].width;
		}
		
		var labelPadding = '   ';
		var heightAdjuster = 5;
		this.style = JSON.parse(JSON.stringify(global.istyle));
		this.style.placeHolder = p.label;
		this.style.width = p.w;
		this.style.fill = global.loggedInUser.dialogPanelColor.FG;
		this.style.type = p.type;

		var textBox = null;
		if(p.multilines == null)
		{
			textBox = document.createElement('input'); 
			if(p.type == null)
				textBox.type = "text"; 
			else
				textBox.type = p.type;
			textBox.setAttribute("value", p.value.toString());


		
		}
		else
		{
			textBox = document.createElement('textarea'); 
			textBox.rows = p.multilines;
			//textBox.setAttribute("value", p.value.toString());
			textBox.innerHTML = p.value.toString();
		
			
		}
		
		textBox.id = replaceAll(p.label, " ", "");

		//textBox.value = p.value.toString();
		textBox.style.width = "100%";
		textBox.onchange = function() {dialogBE.textChanged()};
		textBox.onkeypress = function() {dialogBE.textChanged()};
		textBox.onpaste = function() {dialogBE.textChanged()};
		textBox.oninput = function() {dialogBE.textChanged()};
   
		row.cells[startcell + 1].style.padding = "0px 10px 0px 10px";
   		row.cells[startcell + 1].appendChild(textBox); 

		if(p.usage == "-display")
	    {
	    	textBox.disabled = true;
		}

		// global.activeDialog.push({type: "control", subtype: "textbox" + p.usage, control: this.textBox, name: p.label, field: p.value, mandatory: p.mandatory, usage: p.usage});

		var textBoxLabel = document.createElement('label'); 
		textBoxLabel.innerHTML = p.label + labelPadding;
   		row.cells[startcell + 0].appendChild(textBoxLabel); 

		var textBoxMandatory = document.createElement('label'); 
		textBoxMandatory.innerHTML = "&nbsp;";
		textBoxMandatory.style.color = "red";
		textBoxMandatory.id = replaceAll(p.label, " ", "") + "-mandatory";
		row.cells[startcell + 2].appendChild(textBoxMandatory); 
		if(p.mandatory)
		{

			textBoxMandatory.innerHTML = "*";
		
		}
		
		var textBoxError = document.createElement('label'); 
		textBoxError.innerHTML = "&nbsp;";
		textBoxError.style.color = "red";
		textBoxError.style.font = "bold 12px arial";
		textBoxError.id = replaceAll(p.label, " ", "") + "-error";
		row.cells[startcell + 3].appendChild(textBoxError); 
		
		if(p.hidden)
		{
			textBox.setAttribute("hidden", p.hidden.toString());
			textBoxLabel.setAttribute("hidden", p.hidden.toString());
			textBoxError.setAttribute("hidden", p.hidden.toString());
			textBoxMandatory.setAttribute("hidden", p.hidden.toString());
		}


	},

	addSelectFile: function(p)
	{
		//  for now we will cater for a simple dialog with only 1 column of data (4 cells)
		//  but put that into a variable to make it easier to change leter if required

		var startcell = 0;

		
		var table = document.getElementById('dlgTableBody');
		var row = table.insertRow();


		for (var i = 0; i< this.headerrow.cells.length; i++)
		{
			var cell = row.insertCell(i);
			cell.align = this.headerrow.cells[i].align;
			cell.width = this.headerrow.cells[i].width;
		}
		
		var labelPadding = '   ';
		var heightAdjuster = 5;
		this.style = JSON.parse(JSON.stringify(global.istyle));
		this.style.placeHolder = p.label;
		this.style.width = p.w;
		this.style.fill = global.loggedInUser.dialogPanelColor.FG;
		this.style.type = p.type;

		var inp = null;
		inp = document.createElement('input'); 
				
		inp.id = replaceAll(p.label, " ", "");

		inp.type = "file";
		inp.accept = ".gpx";
		dialogBE[inp.id + "_save"] = p.savefile;
		inp.onchange = function (event) {dialogBE.openFile(event)};
   

		//textBox.value = p.value.toString();
		// textBox.style.width = "100%";
		// textBox.onchange = function() {dialogBE.textChanged()};
		// textBox.onkeypress = function() {dialogBE.textChanged()};
		// textBox.onpaste = function() {dialogBE.textChanged()};
		// textBox.oninput = function() {dialogBE.textChanged()};
   
		row.cells[startcell + 3].style.padding = "0px 10px 0px 10px";
		row.cells[startcell + 3].appendChild(inp); 

		var inpstatus = document.createElement('label'); 
		inpstatus.id = "loadingstatus";
		inpstatus.innerHTML = p.value;  //  put last updated and no of caches here
   		row.cells[startcell + 1].appendChild(inpstatus); 

		var inpLabel = document.createElement('label'); 
		inpLabel.innerHTML = p.label + labelPadding;
   		row.cells[startcell + 0].appendChild(inpLabel); 

		if(p.usage == "-display")
	    {
	    	inp.disabled = true;
		}

		if(p.hidden)
		{
			inp.setAttribute("hidden", p.hidden.toString());
		}


	},

    openFile: function(event) {
    
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function(){
          
          
          dialogBE[input.id + "_save"](reader.result);

        };
        reader.readAsText(input.files[0]);
      },

	addGrid: function(p)
	{
		//  for now we will cater for a simple dialog with only 1 column of data (4 cells)
		//  but put that into a variable to make it easier to change leter if required

		var startcell = 0;

		//  create a delete column if needed

		if (p.delete != null)
		{

			p.columns.push({text: p.delete.text, link: p.delete.linkBuilder});
		}

		var table = document.getElementById('dlgTableBody');

		//  remove existing grid if there is one 
		if (document.getElementById('gridtitle') != null)
		{
			document.getElementById('gridtitle').innerHTML = null;
			document.getElementById('gridcontents').innerHTML = null;
		}

		var row = document.getElementById('gridtitle');
		if (row == null)
			row = table.insertRow();

		row.id = "gridtitle";
		var cell = row.insertCell();
		cell.setAttribute("colspan", this.headerrow.cells.length);
		cell.align = "center";
		cell.innerHTML = p.label; 
		cell.style.backgroundColor = "red";

		row = document.getElementById('gridcontents');
		if (row == null)
			row = table.insertRow();

		row.id = "gridcontents";
		cell = row.insertCell();
		cell.setAttribute("colspan", this.headerrow.cells.length);
		cell.style.backgroundColor = "grey";
		cell.align = "center";


		grid = document.createElement('table');  //  the grid is in fact aN html table!!
		grid.id = replaceAll(p.label, " ", "");
		grid.style.width = (game.world.width - p.sidelistwidth) + "px";
		row.cells[startcell + 0].appendChild(grid); 

		var tableh = grid.createTHead();
		tableh.style.backgroundColor = "pink";

		row = tableh.insertRow(); 
		for(var i = 0; i<p.columns.length; i++)
		{
			
			cell = row.insertCell();
			cell.align = "left";
			cell.style.width = Math.floor(((game.world.width - p.sidelistwidth) / game.world.width * 100) / p.columns.length).toString() + "pc";
			cell.innerHTML = p.columns[i].text; 
		}
			
		var tableb = grid.createTBody();
		tableb.id = grid.id + "_body";
		p.contentBuilder(tableb, p.columns);


		if (p.add != null)
		{
			row = table.insertRow();
			cell = row.insertCell();
			cell.align = "left";
			cell.style.backgroundColor = "green";

			var btn = document.createElement("BUTTON"); 
			//btn.onclick = p.add.onclick;   

			btn.addEventListener('click', function(){
			    p.add.onclick(tableb, p.columns);
			});

			var t = document.createTextNode(p.add.text);      
			btn.appendChild(t);                                
			cell.appendChild(btn);

			cell = row.insertCell();
			cell.align = "left";
			cell.style.backgroundColor = "green";

			dialogBE.addSelect({label: p.add.text, contentBuilder: p.add.contentBuilder, adhoc: true, parent: cell});
			

		}

	},

	addSelect: function(p)
	{
		//  for now we will cater for a simple dialog with only 1 column of data (4 cells)
		//  but put that into a variable to make it easier to change leter if required

		var startcell = 0;

		var selectBox = document.createElement('select'); 
		selectBox.id = replaceAll(p.label, " ", "");
		selectBox.style.width = "100%";
        selectBox.oninput = function() {dialogBE.textChanged()};
	   
		if(p.adhoc != true)
		{
			//  a form level select
		
			var table = document.getElementById('dlgTableBody');
			var row = table.insertRow();


			for (var i = 0; i< this.headerrow.cells.length; i++)
			{
				var cell = row.insertCell(i);
				cell.align = this.headerrow.cells[i].align;
				cell.width = this.headerrow.cells[i].width;
			}
			
			var labelPadding = '   ';
			var heightAdjuster = 5;
			this.style = JSON.parse(JSON.stringify(global.istyle));
			this.style.placeHolder = p.label;
			this.style.width = p.w;
			this.style.fill = global.loggedInUser.dialogPanelColor.FG;
			this.style.type = p.type;

			
	   		
			row.cells[startcell + 1].style.padding = "0px 10px 0px 10px";
	   		row.cells[startcell + 1].appendChild(selectBox); 
			if(p.usage == "-display")
		    {
		    	selectBox.disabled = true;
			}
			p.contentBuilder();
		
			// global.activeDialog.push({type: "control", subtype: "textbox" + p.usage, control: this.textBox, name: p.label, field: p.value, mandatory: p.mandatory, usage: p.usage});

			var textBoxLabel = document.createElement('label'); 
			textBoxLabel.innerHTML = p.label + labelPadding;
	   		row.cells[startcell + 0].appendChild(textBoxLabel); 

			var textBoxMandatory = document.createElement('label'); 
			textBoxMandatory.innerHTML = "&nbsp;";
			textBoxMandatory.style.color = "red";
			textBoxMandatory.id = replaceAll(p.label, " ", "") + "-mandatory";
			row.cells[startcell + 2].appendChild(textBoxMandatory); 
			if(p.mandatory)
			{

				textBoxMandatory.innerHTML = "*";
			
			}
			
			var textBoxError = document.createElement('label'); 
			textBoxError.innerHTML = "&nbsp;";
			textBoxError.style.color = "red";
			textBoxError.style.font = "bold 12px arial";
			textBoxError.id = replaceAll(p.label, " ", "") + "-error";
			row.cells[startcell + 3].appendChild(textBoxError); 
		}
		else
		{
			//  a select which will go where it has benn requested

			p.parent.appendChild(selectBox); 
			p.contentBuilder(selectBox);
		}

	},

	textChanged: function()
	{
		//  called when a textbox is altered
		var sts = document.getElementById("updatestatus")
		sts.innerHTML = "Changes have not been saved";
		sts.style.color = "red";
		this.bsave.visible = true;
	},

	//  changed
	addSpacer: function()
	{
		//  for now we will cater for a simple dialog with only 1 column of data (4 cells)
		//  but put that into a variable to make it easier to change leter if required

		var startcell = 0;

		var table = document.getElementById('dlgTableBody');
		var row = table.insertRow();

		for (var i = 0; i< this.headerrow.cells.length; i++)
		{
			var cell = row.insertCell(i);
			cell.align = this.headerrow.cells[i].align;
			cell.width = this.headerrow.cells[i].width;
			cell.innerHTML = "&nbsp;";
		}
		
	},
}
