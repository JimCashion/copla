//  users table BE functions

userGroupsBE = {

	//  List usergroups
	list: function(filter, sort, joins)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort, joins: joins};


	     	fetch('http://127.0.0.1:8081/list?table=usergroups&options=' + encodeURIComponent(JSON.stringify(opt)))
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
		            	//  In this case a list of users
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

	//  Add Usergroup
	add: function(usergroup)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/add?table=usergroups&object=' + JSON.stringify(usergroup), {method: "post"})
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
		            	//  pass one the retrieved data
		            	//  In this case the user we just created with a new id 
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

	//  Update Usergroups
	update: function(usergroup)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/update?table=usergroups&object=' + JSON.stringify(usergroup), {method: "post"})
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
		            	//  In this case the user we just created with a new id 
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

	//  Delete User
	delete: function(usergroup)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/delete?table=usergroups&object=' + JSON.stringify(usergroup), {method: "post"})
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
		            	//  In this case the user we just created with a new id 
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

	getContent: function()
	{
		var joins = [{from: "usergroups", to: "groups", on: "groupid"}, {from: "usergroups",to: "users", on: "userid"}]
		userGroupsBE.list("T.userid == " + global.loggedInUser.id, "groups.name", joins)
	            .then(
	                function(response) 
	                {
	                	for(var i = 0; i<panels.length; i++)
				        {
				        	if (panels.children[i].tag == 'My groups')
				        	{
				        		panels.children[i].clearContent();

								for(var j = response.length - 1; j>= 0; j--)
				        		{
				        			panels.children[i].content.push({text: response[j].groups.name});
				        		}

				        		panels.children[i].insertContent();
				        	}
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

	},
	
	getAsContent: function(select)
	{
		var joins = [{from: "usergroups", to: "groups", on: "groupid"}, {from: "usergroups",to: "users", on: "userid"}]
		userGroupsBE.list(null, "name", joins)
	            .then(
	                function(response) 
	                {
	                	select.innerText = null
	                	for(var j = 0; j<response.length; j++)
			        	{
			        		var option = document.createElement("option");
							//option.text = response[j].name;
							option.text = (response[j].users == null ? "*unknown*" : response[j].users.nicname) + "/" + (response[j].groups == null ? "*unknown*" : response[j].groups.name);
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

userGroupsDLG = {


	maintainUserGroups: {

		// TODO
		construct: function()
		{
			dialogBE.getStandardDialog('Maintain User Groups', 
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

			//  now the user textboxes
			dialogBE.addTextBox({label: "User ID", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Group ID", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Id",value: "", usage: '-display', hidden: true});
			
			//  and a list of all users
			dialogBE.addList({label: "User Group List",
				              contentBuilder: function(select) {userGroupsBE.getAsContent(select);},
				              valueChanged: function() {userGroupsDLG.maintainUserGroups.ValueChanged();},
							   });

		

		},

		
		
		ValueChanged: function()
		{
			var sel = document.getElementById("UserGroupList").value;
    		
    		if(sel == null || sel == '')
    			return;

			var filter = "T.id == " + sel;

	        userGroupsBE.list(filter)
	        .then(
	        function(result) 
	        {
	            //  we got something
	            //  Lets Gooooo!!!!!
            	var seltbl = JSON.parse(JSON.stringify(result[0]));
	            document.getElementById("UserID").value = seltbl.userid;
				document.getElementById("GroupID").value = seltbl.groupid;
				document.getElementById("Id").value = seltbl.id;
	
				document.getElementById("UserID").disabled = false;
				document.getElementById("GroupID").disabled = false;
				
				document.getElementById("UserID-mandatory").innerHTML = "*";
				document.getElementById("GroupID-mandatory").innerHTML = "*";
				
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
				
            },
	        function(err) 
	        {
	            //  error condition
	            alert(err);}
	        );
		},

		New: function(item)
		{

			//  now the user textboxes
			document.getElementById("UserID").value = "";
			document.getElementById("GroupID").value = "";
			document.getElementById("Id").value = -1;
			
			document.getElementById("UserID").disabled = false;
			document.getElementById("GroupID").disabled = false;
			
			document.getElementById("UserID-mandatory").innerHTML = "*";
			document.getElementById("GroupID-mandatory").innerHTML = "*";
			
			document.getElementById("UserID-error").innerHTML = "&nbsp;";
			document.getElementById("GroupID-error").innerHTML = "&nbsp;";
			
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

	        var obj = await userGroupsBE.list(filter);

	        var result = await userGroupsBE.delete(obj[0]);
	      
	      	var idx = document.getElementById("UserGroupList").selectedIndex;
	      	document.getElementById("UserGroupList").remove(idx);
	      	document.getElementById("UserGroupList").selectedIndex = idx;
	      	userGroupsDLG.maintainUserGroups.ValueChanged();
		},

		Validate: async function(item)
		{

				var error = false; //  no errors


			//  in an ideal world we would validate that the user and group exist here but this is throw away

			return error;
		 
		},

		Save: async function(item)
		{

			//  do we want any tickers?

			if (document.getElementById("Id").value == -1)
			{
				document.getElementById("UserID").disabled = false;
				document.getElementById("GroupID").disabled = false;
				
				//  add the user
				await userGroupsBE.add({userid: document.getElementById("UserID").value, 
	                                    groupid: document.getElementById("GroupID").value});
	             
			}
			else
			{
				var filter = "T.id == " + document.getElementById("Id").value;

	        	var obj = await userGroupsBE.list(filter);

			    obj[0].userid = document.getElementById("UserID").value;
                obj[0].groupid = document.getElementById("GroupID").value;
                
	        	var result = await userGroupsBE.update(obj[0]);

			}


			var idx = document.getElementById("UserGroupList").selectedIndex;
	      	userGroupsBE.getAsContent(document.getElementById("UserGroupList"));
	      	document.getElementById("UserGroupList").selectedIndex = idx;
	      	userGroupsDLG.maintainUserGroups.ValueChanged();

	      	


		},
	

	},

	displayUserGroup: {

		// TODO
		construct: async function( group)
		{
			global.suspendMessages = true;
			
			dialogBE.getStandardDialog('Display ' + group.text, 
		                              {
		                              	close: {render: true, hidden: false},
		                              	save: {render: true, hidden: true}
		                              },
		                              this.Validate,
		                              this.Save,
		                              this.New,
		                              this.Delete,
		                              "simpleForm"
							 		  );

			var dspgroup = await groupsBE.list("T.name == '" + group.text + "'");
			dspgroup = JSON.parse(JSON.stringify(dspgroup[0]));
			
			//  now the user textboxes
			dialogBE.addTextBox({label: "Name", value: dspgroup.name, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Description", value: dspgroup.description, usage: '-display', mandatory: false, multilines: 5});
			dialogBE.addTextBox({label: "Purpose", value: dspgroup.purpose, usage: '-display', mandatory: false, multilines: 5});
			dialogBE.addTextBox({label: "Id",value: dspgroup.id, usage: '-display', hidden: true});
			
			
			//  lets have a grid listing users in this group
			dialogBE.addGrid({label: "Users in " + group.text,
				              contentBuilder: function(grid, columns) {userGroupsDLG.displayUserGroup.getUsersAsGridContent(grid, columns);},
				              columns: [{text: "User ID", field: "userid"}, {text: "User Name", field: "users.nicname"}],
					          sidelistwidth: 0
				          	  });
		},

		getUsersAsContent: function(select)
		{
			var joins = [{from: "usergroups", to: "groups", on: "groupid"}, {from: "usergroups",to: "users", on: "userid"}];
			var filter = "T.groupid == " + document.getElementById("Id").value;
			userGroupsBE.list(filter, "users.name", joins)
		            .then(
		                function(response) 
		                {
		                	select.innerText = null
		                	for(var j = 0; j<response.length; j++)
				        	{
				        		var option = document.createElement("option");
								//option.text = response[j].name;
								option.text = (response[j].users == null ? "*unknown*" : response[j].users.nicname);
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

		},
		
		getUsersAsGridContent: function(grid, columns)
		{
			if (document.getElementById("Id").value == "")
				return;

			var joins = [{from: "usergroups", to: "groups", on: "groupid"}, {from: "usergroups",to: "users", on: "userid"}]
			var filter = "T.groupid == " + document.getElementById("Id").value;
			
			userGroupsBE.list(filter, "users.name", joins)
		            .then(
		                function(response) 
		                {
		                	for(var i = 0; i<response.length; i++)
				        	{

				        		var row = grid.insertRow(); 
				        		row.style.backgroundColor = "violet";

								for(var j = 0; j< columns.length; j++)
								{
									
									cell = row.insertCell();
									cell.align = "left";
									cell.style.width = Math.floor(100 / columns.length).toString() + "pc";

									var val = "response[i]." + columns[j].field;

									cell.innerHTML = eval(val); 
								}
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

		},

		ValueChanged: function()
		{
			// var sel = document.getElementById("UserGroupList").value;
    		
   //  		if(sel == null || sel == '')
   //  			return;

			// var filter = "T.id == " + sel;

	  //       userGroupsBE.list(filter)
	  //       .then(
	  //       function(result) 
	  //       {
	  //           //  we got something
	  //           //  Lets Gooooo!!!!!
   //          	var seltbl = JSON.parse(JSON.stringify(result[0]));
	  //           document.getElementById("UserID").value = seltbl.userid;
			// 	document.getElementById("GroupID").value = seltbl.groupid;
			// 	document.getElementById("Id").value = seltbl.id;
	
			// 	document.getElementById("UserID").disabled = false;
			// 	document.getElementById("GroupID").disabled = false;
				
			// 	document.getElementById("UserID-mandatory").innerHTML = "*";
			// 	document.getElementById("GroupID-mandatory").innerHTML = "*";
				
			// 	for(var i = 0; i<global.activeDialog.length; i++ )
			// 	{
					
			// 		if(global.activeDialog[i].type == "control" &&
			// 		   global.activeDialog[i].subtype == "button" &&
			// 		   (global.activeDialog[i].name == "bdelete"))
			// 		{
			// 			global.activeDialog[i].control.visible = true;
			// 		}
			// 		if(global.activeDialog[i].type == "control" &&
			// 		   global.activeDialog[i].subtype == "button" &&
			// 		   (global.activeDialog[i].name == "bsave"))
			// 		{
			// 			global.activeDialog[i].control.visible = true;
			// 		}
			// 	}
				
			// 	var sts = document.getElementById("updatestatus");
			// 	sts.innerHTML = "&nbsp;";
				
   //          },
	  //       function(err) 
	  //       {
	  //           //  error condition
	  //           alert(err);}
	  //       );
		},

		New: function(item)
		{

			// //  now the user textboxes
			// document.getElementById("UserID").value = "";
			// document.getElementById("GroupID").value = "";
			// document.getElementById("Id").value = -1;
			
			// document.getElementById("UserID").disabled = false;
			// document.getElementById("GroupID").disabled = false;
			
			// document.getElementById("UserID-mandatory").innerHTML = "*";
			// document.getElementById("GroupID-mandatory").innerHTML = "*";
			
			// document.getElementById("UserID-error").innerHTML = "&nbsp;";
			// document.getElementById("GroupID-error").innerHTML = "&nbsp;";
			
			// for(var i = 0; i<global.activeDialog.length; i++ )
			// 	{
					
			// 		if(global.activeDialog[i].type == "control" &&
			// 		   global.activeDialog[i].subtype == "button" &&
			// 		   (global.activeDialog[i].name == "bdelete"))
			// 		{
			// 			global.activeDialog[i].control.visible = false;
			// 		}
			// 		if(global.activeDialog[i].type == "control" &&
			// 		   global.activeDialog[i].subtype == "button" &&
			// 		   (global.activeDialog[i].name == "bsave"))
			// 		{
			// 			global.activeDialog[i].control.visible = true;
			// 		}
			// 	}
			
		},

		Delete: async function(item)
		{
			// var filter = "T.id == " + document.getElementById("Id").value;

	  //       var obj = await userGroupsBE.list(filter);

	  //       var result = await userGroupsBE.delete(obj[0]);
	      
	  //     	var idx = document.getElementById("UserGroupList").selectedIndex;
	  //     	document.getElementById("UserGroupList").remove(idx);
	  //     	document.getElementById("UserGroupList").selectedIndex = idx;
	  //     	userGroupsDLG.maintainUserGroups.ValueChanged();
		},

		Validate: async function(item)
		{

				var error = false; //  no errors


			//  in an ideal world we would validate that the user and group exist here but this is throw away

			return error;
		 
		},

		Save: async function(item)
		{

			//  do we want any tickers?

			// if (document.getElementById("Id").value == -1)
			// {
			// 	document.getElementById("UserID").disabled = false;
			// 	document.getElementById("GroupID").disabled = false;
				
			// 	//  add the user
			// 	await userGroupsBE.add({userid: document.getElementById("UserID").value, 
	  //                                   groupid: document.getElementById("GroupID").value});
	             
			// }
			// else
			// {
			// 	var filter = "T.id == " + document.getElementById("Id").value;

	  //       	var obj = await userGroupsBE.list(filter);

			//     obj[0].userid = document.getElementById("UserID").value;
   //              obj[0].groupid = document.getElementById("GroupID").value;
                
	  //       	var result = await userGroupsBE.update(obj[0]);

			// }


			// var idx = document.getElementById("UserGroupList").selectedIndex;
	  //     	userGroupsBE.getAsContent(document.getElementById("UserGroupList"));
	  //     	document.getElementById("UserGroupList").selectedIndex = idx;
	  //     	userGroupsDLG.maintainUserGroups.ValueChanged();

	      	


		},
	

	}
}

