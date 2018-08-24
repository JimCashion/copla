//  groups table BE functions

groupsBE = {

	//  List groups
	list: function(filter, sort)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort};

	     	fetch('http://127.0.0.1:8081/list?table=groups&options=' + encodeURIComponent(JSON.stringify(opt)))
	        .then(response => response.json()) 
	        .then(function(response) {
	      			
	      			//  Success
		            if (!response.ok)
		            {
		            	//  pass one any error condition
		            	reject(response.data);

		            	
		            }
		            else
		            {	
		            	//  pass on the retrieved data
		            	//  In this case a list of groups
		            	resolve(response.data);
		               
		            }
		        },
		        function(err) {
		        	//  failed to convert to json!!!
		        	reject('FATAL JSON conversion error!  Response from server was not valid JSON');
		        }
	        )
	        .catch(function(err)
	        {
	        	//  if a fatal error is encountered then pass on as a rejection 
	            reject('ERROR:   ' + err);
	        })
	    });

	},

	//  Add group
	add: function(group, creator)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/add?table=groups&object=' + JSON.stringify(group), {method: "post"})
	     	.then(response => response.json()) 
	        .then(function(response) {
	      			
	      			//  got some JSON back
		            if (!response.ok)
		            {
		            	//  pass on the response containing the error condition
		            	reject(response);
		                
		            }
		            else
		            {	
		            	

		            	//  also we need to create a ticker item

		            	var nicname = global.systemBotName;
		            	if(creator != null)
		            		nicname = creator.nicname;

		            	tickersBE.add({priority: 0, 
		            	  			   domain: 'Record Added',
		            	  			   entity: 'groups',
	                                   date: new Date(), 
	                                   text: 'Group ' + group.name + ' was created by ' + nicname });
		               //  pass one the retrieved data
		            	//  In this case the group we just created with a new id 
		            	resolve(response);
		            }
		        },
		        function(err) {
		        	//  server rejection (can't really happen)
		        	reject('FATAL JSON conversion error!  Response from server was not valid JSON' + err);
		        }
	        )
	        .catch(function(err)
	        {
	        	//  if a fatal error is encountered then pass on as a rejection 
	            reject('FATAL ERROR:   ' + err);
	        })
	    });
	},

	//  Update group
	update: function(group)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/update?table=groups&object=' + JSON.stringify(group), {method: "post"})
	     	.then(response => response.json()) 
	        .then(function(response) {
	      			
	      			//  Success
		            if (!response.ok)
		            {
		            	//  pass one any error condition
		            	reject(response.data);
		               
		            }
		            else
		            {	
		            	//  pass one the retrieved data
		            	//  In this case the group we just created with a new id 
		            	resolve(response.data);
		               
		            }
		        },
		        function(err) {
		        	//  failed to convert to json!!!
		        	reject('FATAL JSON conversion error!  Response from server was not valid JSON');
		        }
	        )
	        .catch(function(err)
	        {
	        	//  if a fatal error is encountered then pass on as a rejection 
	            reject('ERROR:   ' + err);
	        })
	    });
	},

	//  Delete group
	delete: function(group)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/delete?table=groups&object=' + JSON.stringify(group), {method: "post"})
	     	.then(response => response.json()) 
	        .then(function(response) {
	      			
	      			//  Success
		            if (!response.ok)
		            {
		            	//  pass one any error condition
		            	reject(response.data);
		               
		            }
		            else
		            {	
		            	//  pass one the retrieved data
		            	//  In this case the group we just created with a new id 
		            	resolve(response.data);
		               
		            }
		        },
		        function(err) {
		        	//  failed to convert to json!!!
		        	reject('FATAL JSON conversion error!  Response from server was not valid JSON');
		        }
	        )
	        .catch(function(err)
	        {
	        	//  if a fatal error is encountered then pass on as a rejection 
	            reject('ERROR:   ' + err);
	        })
	    });
	},

	getAsContent: function(select)
	{

		groupsBE.list(null, "name")
	            .then(
	                function(response) 
	                {
	                	select.innerText = null
	                	for(var j = 0; j<response.length; j++)
			        	{
			        		var option = document.createElement("option");
							option.text = response[j].name;
							option.value = response[j].id;
							select.add(option);
			        	}
						
			        },
	                function(err) 
	                {
	                    //  promise rejected because of error
	                    alert(err.data);

	                    //  abort the whole thing
	                    return;
	                    
	            	}
	            );

	}

}

groupsDLG = {


	maintainGroups: {
		construct: function()
		{
			dialogBE.getStandardDialog('Maintain Groups', 
		                              {
		                              	close: {render: true, hidden: false},
		                              	save: {render: true, hidden: true},
		                              	new: {render: true, hidden: false},
		                              	delete: {render: true, hidden: true}
		                              },
		                              this.Validate,
		                              this.Save,
		                              this.New,
		                              this.Delete,
		                              "simpleCRUD"
							 		  );

			//  now the group textboxes
			dialogBE.addTextBox({label: "Name", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Description", value: "", usage: '-display', mandatory: false, multilines: 5});
			dialogBE.addTextBox({label: "Purpose", value: "", usage: '-display', mandatory: false, multilines: 5});
			dialogBE.addTextBox({label: "Id", value: "", usage: '-display', mandatory: false});
			
				//  and a list of all groups
			dialogBE.addList({label: "Group List",
				              contentBuilder: function(select) {groupsBE.getAsContent(select);},
				              valueChanged: function() {groupsDLG.maintainGroups.ValueChanged();},
							  });



			

		},

		
		
		ValueChanged: function()
		{
			var sel = document.getElementById("GroupList").value;
    		
    		if(sel == null || sel == '')
    			return;

			var filter = "T.id == " + sel;

	        groupsBE.list(filter)
	        .then(
	        function(result) 
	        {
	            //  we got something
	            //  Lets Gooooo!!!!!

            	var selgroup = JSON.parse(JSON.stringify(result[0]));
	            document.getElementById("Name").value = selgroup.name;
	            document.getElementById("Description").value = selgroup.description;
				document.getElementById("Purpose").value = selgroup.purpose;
				document.getElementById("Id").value = selgroup.id;
	
				document.getElementById("Name").disabled = false;
				document.getElementById("Description").disabled = false;
				document.getElementById("Purpose").disabled = false;
				
				document.getElementById("Name-mandatory").innerHTML = "*";
				document.getElementById("Description-mandatory").innerHTML = "*";
				document.getElementById("Purpose-mandatory").innerHTML = "*";
				
				for(var i = 0; i<global.activeDialog.length; i++ )
				{
					
					if(global.activeDialog[i].type == "control" &&
					   global.activeDialog[i].subtype == "button" &&
					   (global.activeDialog[i].name == "bdelete"))
					{
						global.activeDialog[i].control.visible = true;
					}
					if(global.activeDialog[i].type == "control" &&
					   global.activeDialog[i].subtype == "button" &&
					   (global.activeDialog[i].name == "bsave"))
					{
						global.activeDialog[i].control.visible = true;
					}
				}
				
				var sts = document.getElementById("updatestatus");
				sts.innerHTML = "&nbsp;";
		
				//  lets have a grid listing users in this group
				dialogBE.addGrid({label: "Users in " + selgroup.name,
					              contentBuilder: function(grid, columns) {userGroupsDLG.displayUserGroup.getUsersAsGridContent(grid, columns);},
					              columns: [{text: "User ID", field: "userid"}, {text: "User Name", field: "users.nicname"}],
					              sidelistwidth: 150
					          	  });

				
            },
	        function(err) 
	        {
	            //  error condition
	            alert("meep" + err.message);}
	        );
		},

		New: function(item)
		{

			//  now the group textboxes
			document.getElementById("Name").value = "";
			document.getElementById("Description").value = "";
			document.getElementById("Purpose").value = "";
			document.getElementById("Id").value = -1;
			document.getElementById("GroupList").value = -1;

			document.getElementById("Name").disabled = false;
			document.getElementById("Description").disabled = false;
			document.getElementById("Purpose").disabled = false;
			
			document.getElementById("Name-mandatory").innerHTML = "*";
			document.getElementById("Description-mandatory").innerHTML = "*";
			document.getElementById("Purpose-mandatory").innerHTML = "*";
			
			document.getElementById("Name-error").innerHTML = "&nbsp;";
			document.getElementById("Description-error").innerHTML = "&nbsp;";
			document.getElementById("Purpose-error").innerHTML = "&nbsp;";
			
			for(var i = 0; i<global.activeDialog.length; i++ )
				{
					
					if(global.activeDialog[i].type == "control" &&
					   global.activeDialog[i].subtype == "button" &&
					   (global.activeDialog[i].name == "bdelete"))
					{
						global.activeDialog[i].control.visible = false;
					}
					if(global.activeDialog[i].type == "control" &&
					   global.activeDialog[i].subtype == "button" &&
					   (global.activeDialog[i].name == "bsave"))
					{
						global.activeDialog[i].control.visible = true;
					}
				}
			
		},

		Delete: async function(item)
		{
			var filter = "T.id == " + document.getElementById("Id").value;

	        var group = await groupsBE.list(filter);

	        var result = await groupsBE.delete(group[0]);
	      
	      	var idx = document.getElementById("GroupList").selectedIndex;
	      	document.getElementById("GroupList").remove(idx);
	      	document.getElementById("GroupList").selectedIndex = idx;
	      	groupsDLG.maintainGroups.ValueChanged();
		},

		Validate: async function(item)
		{

			var error = false; //  no errors

				
			return error;
		 
		},

		Save: async function(item)
		{

			//  do we want any tickers?

			if (document.getElementById("Id").value == -1)
			{
				document.getElementById("Name").disabled = false;
				document.getElementById("Description").disabled = false;
				document.getElementById("Purpose").disabled = false;
				
				//  add the group
				await groupsBE.add({name: document.getElementById("Name").value,
			                        description: document.getElementById("Description").value,
			                        purpose: document.getElementById("Purpose").value});
	             
			}
			else
			{
				var filter = "T.id == " + document.getElementById("Id").value;

	        	var group = await groupsBE.list(filter);

			    group[0].name = document.getElementById("Name").value;
                group[0].description = document.getElementById("Description").value;
                group[0].purpose = document.getElementById("Purpose").value;
                
	        	var result = await groupsBE.update(group[0]);

			}

			var idx = document.getElementById("GroupList").selectedIndex;
	      	groupsBE.getAsContent(document.getElementById("GroupList"));
	      	document.getElementById("GroupList").selectedIndex = idx;
	      	groupsDLG.maintainGroups.ValueChanged();

			//  need to rebuild the My groups window in case the name changed

			for(var i = 0; i<panels.length; i++)
	        {
	        	if (panels.children[i].tag == 'My groups')
	        	{
	        		panels.children[i].ipanel.contentBuilder(global.loggInUser);

					break;
	        	}
			}


		},
	}
}

