//  to do list table BE functions

ideaFriendsBE = {

	//  List usergroups
	list: function(filter, sort, joins)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort, joins: joins};


	     	fetch('http://127.0.0.1:8081/list?table=ideafriends&options=' + encodeURIComponent(JSON.stringify(opt)))
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
	add: function(obj)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/add?table=ideafriends&object=' + JSON.stringify(obj), {method: "post"})
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
     
     		fetch('http://127.0.0.1:8081/update?table=ideafriends&object=' + JSON.stringify(usergroup), {method: "post"})
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
     
     		fetch('http://127.0.0.1:8081/delete?table=ideafriends&object=' + JSON.stringify(usergroup), {method: "post"})
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

	getFriendsAsGridContent: function(grid, columns)
	{

		var joins = [{from: "ideafriends", to: "friends", on: "friendid"}, {from: "friends", to: "users", on: "friendid"}]
		var filter = "T.ideaid == " + document.getElementById("Id").value;
		ideaFriendsBE.list(filter, "users.name", joins)
	            .then(
	                function(response) 
	                {

	                	grid.innerHTML = null;
			        		
	                	for(var i = 0; i<response.length; i++)
			        	{
			        		var row = grid.insertRow(); 
			        		row.style.backgroundColor = "violet";

							for(var j = 0; j< columns.length; j++)
							{
								
								var cell = row.insertCell();
								cell.align = "left";
								cell.style.width = Math.floor(100 / columns.length).toString() + "pc";

								var val = "not set";
								if (columns[j].text == "Remove")
								{
									var link = document.createElement("a");
									link.setAttribute("href", "#");
									link.id = "deleteLink_" + response[i].id;

									var linkText = document.createTextNode(columns[j].text);
									link.appendChild(linkText);
									link.addEventListener('click', function() {friendsBE.DeleteAFriendFromGrid(this, grid, columns);});
									cell.appendChild(link);


								}
								else
								{
									val = "response[i]." + columns[j].field;
									cell.innerHTML = eval(val); 
								}
								
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
	
	getNonPolledFriends: function(select)
		{

			//  modify this to exclude existing friends
			var filter = "T.userid == " + global.loggedInUser.id; // + " && " + "T.ideafriends.ideaid == " + document.getElementById("Id").value;;

			//  using 'onright' is like using 'on' except target.userid = source.id 
			//  instead of using 'on' where source.userid = target.id ( get it?  :o) )
			var joins = [{from: "friends", to: "users", on: "friendid"}];

			friendsBE.list(filter, "users.nicname", joins)
		            .then(
		                function(response) 
		                {

		                	select.innerText = null
		                	for(var j = 0; j<response.length; j++)
				        	{
				        		//messageJSON(' friends ' + document.getElementById('Id') + ' ' + response[j].ideafriends.ideaid + ' ' + response[j].userid + ' ' + response[j].friendid + ' ' + response[j].id + ' ' + response[j].users.nicname);
				        		//alert(response[j].ideafriends);
				        		//if(response[j].ideafriends == null ||
				        		//   response[j].ideafriends.ideaid != document.getElementById('Id').value)  //  join failed, th

				        		// {

				        			//  i think this will select users that are not added to ANY idea.  change to check for this idea
					        		var option = document.createElement("option");
									option.text = response[j].users.nicname;
									option.value = response[j].id;
									select.add(option);
								// }
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
	// getContent: function()
	// {
	// 	var joins = [{from: "todolist", to: "users", on: "originuserid"}];
	// 	toDoListBE.list("T.userid == " + global.loggedInUser.id, "users.name", joins)
	//             .then(
	//                 function(response) 
	//                 {
	//                 	for(var i = 0; i<panels.length; i++)
	// 			        {
	// 			        	if (panels.children[i].tag == 'My friends')
	// 			        	{
	// 			        		panels.children[i].clearContent();

	// 							for(var j = response.length - 1; j>= 0; j--)
	// 			        		{
	// 								var text = "";
	// 								switch (response[j].type)
	// 								{
	// 									case 1:
	// 									text = 'Rate ' + response[j].users.nicname + "'s idea";
	// 									break;

	// 								}

	// 			        			panels.children[i].content.push({text: text});
	// 			        		}

	// 			        		panels.children[i].insertContent();
	// 			        	}
	// 					}
	// 				},
	//                 function(err) 
	//                 {
	//                     //  promise rejected because of error
	//                     alert(err.data);

	//                     //  abort the whole thing
	//                     return;
	                    
	//             	}
	//             );

	// },
}

