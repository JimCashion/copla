//  groups table BE functions

ideasBE = {

	//  List groups
	list: function(filter, sort)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort};

	     	fetch('http://127.0.0.1:8081/list?table=ideas&options=' + encodeURIComponent(JSON.stringify(opt)))
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
     
     		fetch('http://127.0.0.1:8081/add?table=ideas&object=' + JSON.stringify(group), {method: "post"})
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

		            	// var nicname = global.systemBotName;
		            	// if(creator != null)
		            	// 	nicname = creator.nicname;

		            	// tickersBE.add({priority: 0, 
		            	//   			   domain: 'Record Added',
		            	//   			   entity: 'groups',
	              //                      date: new Date(), 
	              //                      text: 'Group ' + group.name + ' was created by ' + nicname });
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
     
     		fetch('http://127.0.0.1:8081/update?table=ideas&object=' + JSON.stringify(group), {method: "post"})
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
     
     		fetch('http://127.0.0.1:8081/delete?table=ideas&object=' + JSON.stringify(group), {method: "post"})
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

	getContent: function()
	{
		ideasBE.list("T.userid == " + global.loggedInUser.id, "dateentered")
	            .then(
	                function(response) 
	                {
	                	for(var i = 0; i<panels.length; i++)
				        {
				        	if (panels.children[i].tag == 'My ideas')
				        	{
				        		panels.children[i].clearContent();

								for(var j = response.length - 1; j>= 0; j--)
				        		{
				        			panels.children[i].content.push({text: response[j].summary});
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

		ideasBE.list(null, "dateentered")
	            .then(
	                function(response) 
	                {
	                	select.innerText = null
	                	for(var j = 0; j<response.length; j++)
			        	{
			        		var option = document.createElement("option");
							option.text = response[j].summary;
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

ideasDLG = {


	maintainIdeas: {
		construct: function()
		{
			dialogBE.getStandardDialog('Maintain Ideas', 
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

			//  now the group 
			dialogBE.addTextBox({label: "User Id", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Summary", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Description", value: "", usage: '-display', mandatory: false, multilines: 5});
			dialogBE.addTextBox({label: "Status", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Date Entered", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Id", value: "", usage: '-display', mandatory: false});
			
				//  and a list of all groups
			dialogBE.addList({label: "Idea List",
				              contentBuilder: function(select) {ideasBE.getAsContent(select);},
				              valueChanged: function() {ideasDLG.maintainIdeas.ValueChanged();},
							   });

		},

		ValueChanged: function()
		{
			 var sel = document.getElementById("IdeaList").value;
    		
    		if(sel == null || sel == '')
    			return;

			var filter = "T.id == " + sel;

	        ideasBE.list(filter)
	        .then(
	        function(result) 
	        {
	            //  we got something
	            //  Lets Gooooo!!!!!

            	var selgroup = JSON.parse(JSON.stringify(result[0]));
	            document.getElementById("UserId").value = selgroup.userid;
	            document.getElementById("Summary").value = selgroup.summary;
				document.getElementById("Description").value = selgroup.description;
				document.getElementById("Status").value = selgroup.status;
				document.getElementById("DateEntered").value = selgroup.dateentered;
				document.getElementById("Id").value = selgroup.id;
	
				document.getElementById("UserId").disabled = false;
				document.getElementById("Summary").disabled = false;
				document.getElementById("Description").disabled = false;
				document.getElementById("Status").disabled = false;
				
				document.getElementById("UserId-mandatory").innerHTML = "*";
				document.getElementById("Summary-mandatory").innerHTML = "*";
				document.getElementById("Description-mandatory").innerHTML = "*";
				document.getElementById("Status-mandatory").innerHTML = "*";
				
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
	            alert("meep" + err.message);}
	        );
		},

		New: function(item)
		{

			// now the idea textboxes
			document.getElementById("UserId").value = "";
			document.getElementById("Summary").value = "";
			document.getElementById("Description").value = "";
			document.getElementById("Status").value = "";
			document.getElementById("DateEntered").value = "";
			document.getElementById("Id").value = -1;


			document.getElementById("UserId").disabled = false;
			document.getElementById("Summary").disabled = false;
			document.getElementById("Description").disabled = false;
			document.getElementById("Status").disabled = false;
			
			document.getElementById("UserId-mandatory").innerHTML = "*";
			document.getElementById("Summary-mandatory").innerHTML = "*";
			document.getElementById("Description-mandatory").innerHTML = "*";
			document.getElementById("Status-mandatory").innerHTML = "*";
			
			document.getElementById("UserId-error").innerHTML = "&nbsp;";
			document.getElementById("Summary-error").innerHTML = "&nbsp;";
			document.getElementById("Description-error").innerHTML = "&nbsp;";
			document.getElementById("Status-error").innerHTML = "&nbsp;";
			
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

	        var idea = await ideasBE.list(filter);

	        var result = await ideasBE.delete(idea[0]);
	      
	      	var idx = document.getElementById("IdeaList").selectedIndex;
	      	document.getElementById("IdeaList").remove(idx);
	      	document.getElementById("IdeaList").selectedIndex = idx;
	      	ideasDLG.maintainIdeas.ValueChanged();
		},

		Validate: async function(item)
		{

			var error = false; //  no errors

				
			return error;
		 
		},

		Save: async function(item)
		{
			
			if (document.getElementById("Id").value == -1)
			{
				document.getElementById("UserId").disabled = false;
				document.getElementById("Summary").disabled = false;
				document.getElementById("Description").disabled = false;
				document.getElementById("Status").disabled = false;
				
				//  add the idea
				await ideasBE.add({userid: document.getElementById("UserId").value,
			                       summary: document.getElementById("Summary").value,
			                       description: document.getElementById("Description").value,
			                       status: document.getElementById("Status").value});
			}
			else
			{
				var filter = "T.id == " + document.getElementById("Id").value;

	        	var idea = await ideasBE.list(filter);

			    idea[0].userid = document.getElementById("UserId").value;
                idea[0].summary = document.getElementById("Summary").value;
                idea[0].description = document.getElementById("Description").value;
                idea[0].status = document.getElementById("Status").value;
                
	        	var result = await ideasBE.update(idea[0]);

			}

			var idx = document.getElementById("IdeaList").selectedIndex;
	      	ideasBE.getAsContent(document.getElementById("IdeaList"));
	      	document.getElementById("IdeaList").selectedIndex = idx;
	      	ideasDLG.maintainIdeas.ValueChanged();

			//  need to rebuild the My Ideas window in case the name changed

			for(var i = 0; i<panels.length; i++)
	        {
	        	if (panels.children[i].tag == 'My ideas')
	        	{
	        		panels.children[i].ipanel.contentBuilder(global.loggInUser);

					break;
	        	}
			}


		}


	},

	displayIdea: {

		// TODO
		construct: async function( idea)
		{
			global.suspendMessages = true;
			
			dialogBE.getStandardDialog('Display ' + idea.text, 
		                              {
		                              	close: {render: true, hidden: false}
		                              },
		                              null,
		                              null,
		                              null,
		                              null,
		                              "simpleForm"
							 		  );

			 var dspidea = await ideasBE.list("T.summary == '" + idea.text + "'");
			 dspidea = JSON.parse(JSON.stringify(dspidea[0]));
			
			//  now the user textboxes
			dialogBE.addTextBox({label: "Summary", value: dspidea.summary, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Description", value: dspidea.description, usage: '-display', mandatory: false, multilines: 5});
			dialogBE.addTextBox({label: "Status", value: dspidea.status, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Friend rating", value: dspidea.friendrating, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Friend attendance", value: dspidea.friendattendance, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Date entered", value: dspidea.dateentered, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Id",value: dspidea.id, usage: '-display', hidden: true});
		},

	},

	getFriendsOpinion: {

		// TODO
		construct: async function( idea)
		{
			global.suspendMessages = true;
			
			dialogBE.getStandardDialog('Get Opinions from friends', 
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

			 var dspidea = await ideasBE.list("T.summary == '" + idea.text + "'");
			 dspidea = JSON.parse(JSON.stringify(dspidea[0]));
			
			//  now the user textboxes
			dialogBE.addTextBox({label: "Summary", value: dspidea.summary, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Description", value: dspidea.description, usage: '-display', mandatory: false, multilines: 5});
			dialogBE.addTextBox({label: "Friend rating", value: dspidea.friendrating, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Friend attendance", value: dspidea.friendattendance, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Id",value: dspidea.id, usage: '-display', hidden: false});
	
			dialogBE.addGrid({label: "Opinionated friends!",
				              contentBuilder: function(grid, columns) {ideaFriendsBE.getFriendsAsGridContent(grid, columns);},
				              columns: [{text: "Friend ID", field: "friendid"}, {text: "User Name", field: "friends.users.nicname"}],
				              add: {text: "Add friend", contentBuilder: ideaFriendsBE.getNonPolledFriends, onclick: this.addAFriend},
				              delete: {text: "Remove"}
				          	  });
			
		},

		addAFriend: function(grid, columns)
		{
			var ideafriend = {ideaid: document.getElementById("Id").value, friendid: document.getElementById("Addfriend").value}
			ideaFriendsBE.add(ideafriend)
		            .then(
		                function(response) 
		                {
		                	//  all cool so rebuild grid content
		                	ideaFriendsBE.getFriendsAsGridContent(grid, columns);
		                	ideaFriendsBE.getNonPolledFriends(document.getElementById('Addfriend'));

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

		getUsersAsContent: function(select)
		{
			// var joins = [{from: "usergroups", to: "groups", on: "groupid"}, {from: "usergroups",to: "users", on: "userid"}]
			// var filter = "T.groupid == " + document.getElementById("Id").value;
			// userGroupsBE.list(filter, "users.name", joins)
		 //            .then(
		 //                function(response) 
		 //                {
		 //                	select.innerText = null
		 //                	for(var j = 0; j<response.length; j++)
			// 	        	{
			// 	        		var option = document.createElement("option");
			// 					//option.text = response[j].name;
			// 					option.text = (response[j].users == null ? "*unknown*" : response[j].users.nicname);
			// 					option.value = response[j].id;
			// 					select.add(option);
			// 	        	}
							
			// 	        },
		 //                function(err) 
		 //                {
		 //                    //  promise rejected because of error
		 //                    alert(err.data);

		 //                    //  abort the whole thing
		 //                    return;
		                    
		 //            	}
		 //            );

		},
		
		getUsersAsGridContent: function(grid, columns)
		{
			// var joins = [{from: "usergroups", to: "groups", on: "groupid"}, {from: "usergroups",to: "users", on: "userid"}]
			// var filter = "T.groupid == " + document.getElementById("Id").value;
			// userGroupsBE.list(filter, "users.name", joins)
		 //            .then(
		 //                function(response) 
		 //                {
		 //                	for(var i = 0; i<response.length; i++)
			// 	        	{

			// 	        		var row = grid.insertRow(); 
			// 	        		row.style.backgroundColor = "violet";

			// 					for(var j = 0; j< columns.length; j++)
			// 					{
									
			// 						cell = row.insertCell();
			// 						cell.align = "left";
			// 						cell.style.width = Math.floor(100 / columns.length).toString() + "pc";

			// 						var val = "response[i]." + columns[j].field;

			// 						cell.innerHTML = eval(val); 
			// 					}
			// 		    	}
			// 			},
		 //                function(err) 
		 //                {
		 //                    //  promise rejected because of error
		 //                    alert(err.data);

		 //                    //  abort the whole thing
		 //                    return;
		                    
		 //            	}
		            // );

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

	      	


		}
	}
		
}

