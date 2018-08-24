//  hidden panels BE functions

menusBE = {

	//  List users
	getContent: function(menu, opts)
	{
		
		menu.clearContent();

	    for(var j = 0; j< opts.length; j++)
		{
			menu.content.push({text: opts[j].name, menuFunction: opts[j].menuFunction,  parentItem: menu.parentItem});
		}

		menu.insertContent();
		
	},

	getPanelFunctions: function(paneltag)
	{
		for(var i = 0; i< this.panelFunctions.length; i++)
		{
			if (this.panelFunctions[i].name == paneltag)
			{
				return this.panelFunctions[i];

			}
		}

	},

	getPanelItemOptions: function(paneltag)
	{
		var options = [];

		for(var i = 0; i< this.panelFunctions.length; i++)
		{

			if (this.panelFunctions[i].name == paneltag)
			{
				return this.panelFunctions[i].options;
			}
		}
	},

	

}
