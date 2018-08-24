//  users table BE functions

optionsBE = {

	//  List users
	getContent: function(user)
	{
		var allowed = [];
		for(var i = 0; i<menuoptions.length; i++)
		{
			//  select based on user type here!!

			for (var j = 0; j< menuoptions[i].userstypes.length; j++)
			{
				//alert(menuoptions[i].userstypes[j]global.loggedInUser.class
				if (menuoptions[i].userstypes[j].type == global.loggedInUser.class)
				{
					allowed.push(menuoptions[i]);
					break;
				}
			}
			
		}

		for(var i = 0; i<panels.length; i++)
        {
        	if (panels.children[i].tag == 'My options')
        	{
        		panels.children[i].clearContent();

				for(var j = 0; j<allowed.length; j++)
        		{
        			panels.children[i].content.push({text: allowed[j].text});
        		}

        		panels.children[i].insertContent();
        	}
		}

	},

	runOption: function(item, group)
	{
		//  note:  if group is defined (not null) then item and group are reversed
		//         to simplify this switch statement

		switch(item.text)
		{
			case "Users":
			    // document.getElementById('gameDiv').hidden = true;
			    // document.getElementById('debug').hidden = false;
				global.suspendMessages = true;
				activeDialog = usersDLG.maintainUsers.construct();
				break;
			case "Map Segments":
			    // document.getElementById('gameDiv').hidden = true;
			    // document.getElementById('debug').hidden = false;
				global.suspendMessages = true;
				activeDialog = mapsegmentsDLG.maintainMapSegments.construct();
				break;
			case "Groups":
			    // document.getElementById('gameDiv').hidden = true;
			    // document.getElementById('debug').hidden = false;
				global.suspendMessages = true;
				activeDialog = groupsDLG.maintainGroups.construct();
				break;
			case "My Account":
				global.suspendMessages = true;
				activeDialog = usersDLG.myAccount.construct();
				break;
			case "User Groups":
				global.suspendMessages = true;
				activeDialog = userGroupsDLG.maintainUserGroups.construct();
				break;
			case "Ideas":
				global.suspendMessages = true;
				activeDialog = ideasDLG.maintainIdeas.construct();
				break;
			case "Map":
				document.getElementById("container").hidden = true;
				document.getElementById("map").hidden = false;
				
				break;
			
		}

	},

}


