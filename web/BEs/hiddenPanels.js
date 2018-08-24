//  hidden panels BE functions

hiddenPanelsBE = {

	//  List users
	getContent: function(user)
	{
		

		for(var i = 0; i<panels.length; i++)
        {
        	if (panels.children[i].tag == 'My hidden items')
        	{
        		if (panels.children[i].ipanel.manifest != 'titlehidden')
        		{
					panels.children[i].clearContent();

					for(var j = 0; j< panels.length; j++)
					{
						if (panels.children[j].controls[0].visible == false)
							panels.children[i].content.push({text: panels.children[j].tag});
					}

					panels.children[i].insertContent();
				}
        	}
		}

	},

	unminimise: function(contentitem)
	{
		var paneltag = contentitem.text;

		for(var i = 0; i< panels.length; i++)
		{
			if (panels.children[i].tag == paneltag)
			{
				panels.children[i].unminimisepanel(panels.children[i].panel);

			}
		}

	},

	alertpanelname: function(item)
	{

		alert('alertpanelname menu option executed for ' + item.text);

	},

	getPanelFunctions: function(paneltag)
	{
		for(var i = 0; i< panelFunctions.length; i++)
		{
			if (panelFunctions[i].name == paneltag)
			{
				return panelFunctions[i];

			}
		}

	},

	getPanelItemOptions: function(paneltag)
	{
		var options = [];

		for(var i = 0; i< panelFunctions.length; i++)
		{

			if (panelFunctions[i].name == paneltag)
			{
				return panelFunctions[i].options;
			}
		}
	},

	

}
