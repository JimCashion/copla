//  users table BE functions

usersBE = {

	//  List users
	list: function(filter, sort, joins)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort, joins: joins};

	     	fetch('http://127.0.0.1:8081/list?table=users&options=' + encodeURIComponent(JSON.stringify(opt)))
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

	//  Add User
	add: function(user, creator)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/add?table=users&object=' + JSON.stringify(user), {method: "post"})
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

		            	//  also we need to create a ticker item

		            	var nicname = systemBotName;
		            	if(creator != null)
		            		nicname = creator.nicname;

		            	tickersBE.add({priority: 0, 
		            	  			   domain: 'Record Added',
		            	  			   entity: 'users',
	                                   date: new Date(), 
	                                   text: 'User ' + user.nicname + '(' + user.firstname + ' ' + user.surname + ') was created by ' + nicname });
		               
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

	//  Update User
	update: function(user)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/update?table=users&object=' + JSON.stringify(user), {method: "post"})
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
	delete: function(user)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/delete?table=users&object=' + JSON.stringify(user), {method: "post"})
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

	getAsContent: function(select)
	{

		usersBE.list(null, "nicname")
	            .then(
	                function(response) 
	                {
	                	select.innerText = null
	                	for(var j = 0; j<response.length; j++)
			        	{
			        		var option = document.createElement("option");
							option.text = response[j].nicname;
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

usersDLG = {


	maintainUsers: {
		construct: function()
		{
			dialogBE.getStandardDialog('Maintain Users', 
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
			dialogBE.addTextBox({label: "Nicname", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "First name", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Surname", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Login name", value: "", usage: '-display', mandatory: false});
			dialogBE.addSelect({label: "User class",  value: "", usage: '-display', mandatory: false, contentBuilder: this.getUserClasses});
			dialogBE.addSpacer();
			dialogBE.addTextBox({label: "Password", value: "", usage: '-display', mandatory: false, type: "password"});
			dialogBE.addTextBox({label: "Confirm", value: "", usage: '-display', mandatory: false,type: "password"});
			dialogBE.addTextBox({label: "Last ticker time",value: "", usage: '-display', hidden: true});
			dialogBE.addTextBox({label: "Id",value: "", usage: '-display', hidden: false});
			
			dialogBE.addTextBox({label: "My Finds GPX",  value: "", usage: '-display', hidden: false});


			//  and a list of all users
			dialogBE.addList({label: "User List",
				              contentBuilder: function(select) {usersBE.getAsContent(select);},
				              valueChanged: function() {usersDLG.maintainUsers.ValueChanged();},
							   });

		

		},

		
		
		ValueChanged: function()
		{
			var sel = document.getElementById("UserList").value;
    		
    		if(sel == null || sel == '')
    			return;

			var filter = "T.id == " + sel;

	        usersBE.list(filter)
	        .then(
	        function(result) 
	        {
	            //  we got something
	            //  Lets Gooooo!!!!!
            	var seluser = JSON.parse(JSON.stringify(result[0]));
	            document.getElementById("Nicname").value = seluser.nicname;
				document.getElementById("Firstname").value = seluser.firstname;
				document.getElementById("Surname").value = seluser.surname;
				document.getElementById("Loginname").value = seluser.loginname;
				document.getElementById("Userclass").value = seluser.class;
				document.getElementById("Password").value = seluser.password;
				document.getElementById("Confirm").value = seluser.password;
				document.getElementById("Lasttickertime").value = seluser.lastticker;
				document.getElementById("Id").value = seluser.id;
	            document.getElementById("MyFindsGPX").value = "WP " + seluser.waypointid + " was last upload: " + seluser.lastwaypointupload + " (" + seluser.cachecount + " caches)";


				document.getElementById("Nicname").disabled = false;
				document.getElementById("Firstname").disabled = false;
				document.getElementById("Surname").disabled = false;
				document.getElementById("Password").disabled = false;
				document.getElementById("Confirm").disabled = false;
				
				document.getElementById("Nicname-mandatory").innerHTML = "*";
				document.getElementById("Firstname-mandatory").innerHTML = "*";
				document.getElementById("Surname-mandatory").innerHTML = "*";
				document.getElementById("Password-mandatory").innerHTML = "*";
				document.getElementById("Confirm-mandatory").innerHTML = "*";

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
			document.getElementById("Nicname").value = "";
			document.getElementById("Firstname").value = "";
			document.getElementById("Surname").value = "";
			document.getElementById("Loginname").value = "";
			document.getElementById("Userclass").value = "";
			document.getElementById("Password").value = "";
			document.getElementById("Confirm").value = "";
			document.getElementById("MyFindsGPX").value = "";
			
			document.getElementById("Id").value = -1;
			document.getElementById("UserList").value = -1;

			document.getElementById("Nicname").disabled = false;
			document.getElementById("Firstname").disabled = false;
			document.getElementById("Surname").disabled = false;
			document.getElementById("Userclass").disabled = false;
			document.getElementById("Loginname").disabled = false;
			document.getElementById("Password").disabled = false;
			document.getElementById("Confirm").disabled = false;
			
			document.getElementById("Nicname-mandatory").innerHTML = "*";
			document.getElementById("Firstname-mandatory").innerHTML = "*";
			document.getElementById("Surname-mandatory").innerHTML = "*";
			document.getElementById("Userclass-mandatory").innerHTML = "*";
			document.getElementById("Loginname-mandatory").innerHTML = "*";
			document.getElementById("Password-mandatory").innerHTML = "*";
			document.getElementById("Confirm-mandatory").innerHTML = "*";

			document.getElementById("Nicname-error").innerHTML = "&nbsp;";
			document.getElementById("Firstname-error").innerHTML = "&nbsp;";
			document.getElementById("Surname-error").innerHTML = "&nbsp;";
			document.getElementById("Password-error").innerHTML = "&nbsp;";
			document.getElementById("Userclass-error").innerHTML = "&nbsp;";
			document.getElementById("Loginname-error").innerHTML = "&nbsp;";
			document.getElementById("Confirm-error").innerHTML = "&nbsp;";

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

	        var user = await usersBE.list(filter);

	        var result = await usersBE.delete(user[0]);
	      
	      	var idx = document.getElementById("UserList").selectedIndex;
	      	document.getElementById("UserList").remove(idx);
	      	document.getElementById("UserList").selectedIndex = idx;
	      	usersDLG.maintainUsers.ValueChanged();
		},

		Validate: async function(item)
		{

				var error = false; //  no errors

				//  password and confirm password must be the same
				pwd = document.getElementById("Password");
				conf = document.getElementById("Confirm");
				if (pwd.value != conf.value)
				{
					error = true;
					document.getElementById("Password" + "-error").innerHTML = 'Password and Confirm do not match';
					document.getElementById("Confirm" + "-error").innerHTML = 'Password and Confirm do not match';
				}

				//  duplicate nicname

				if (document.getElementById("Id").value == -1)
				{
					var filter = "T.nicname == '" + document.getElementById("Nicname").value + "'";

			        var result = await usersBE.list(filter);
			        if(result.length != 0)
		            {
		            	error = true;
						document.getElementById("Nicname-error").innerHTML = 'This has already been taken!';
					}
				
					var filter = "T.loginname == '" + document.getElementById("Loginname").value + "'";

			        var result = await usersBE.list(filter);
			        if(result.length != 0)
		            {
		            	error = true;
						document.getElementById("Loginname-error").innerHTML = 'This has already been taken!';
					}

				}

			return error;
		 
		},

		Save: async function(item)
		{

			//  do we want any tickers?

			if (document.getElementById("Id").value == -1)
			{
				document.getElementById("Nicname").disabled = false;
				document.getElementById("Firstname").disabled = false;
				document.getElementById("Surname").disabled = false;
				document.getElementById("Password").disabled = false;
				document.getElementById("Confirm").disabled = false;
				
				//  add the user
				await usersBE.add({firstname: document.getElementById("Firstname").value, 
	                               surname: document.getElementById("Surname").value, 
	                               nicname: document.getElementById("Nicname").value, 
	                               class: document.getElementById("Userclass").value, 
	                               loginname: document.getElementById("Loginname").value, 
	                               password: document.getElementById("Password").value});
	             
			}
			else
			{
				var filter = "T.id == " + document.getElementById("Id").value;

	        	var user = await usersBE.list(filter);

			    user[0].firstname = document.getElementById("Firstname").value;
                user[0].surname = document.getElementById("Surname").value;
                user[0].nicname = document.getElementById("Nicname").value;
                user[0].class = document.getElementById("Userclass").value;
                user[0].loginname = document.getElementById("Loginname").value;
                user[0].password = document.getElementById("Password").value;

	        	var result = await usersBE.update(user[0]);

			}

			var idx = document.getElementById("UserList").selectedIndex;
	      	usersBE.getAsContent(document.getElementById("UserList"));
	      	document.getElementById("UserList").selectedIndex = idx;
	      	usersDLG.maintainUsers.ValueChanged();


			//  changed nicname
			// if(global.loggedInUser.nicname != document.getElementById("Nicname").value)
			// {
			// 	tickersBE.add({priority: 1, 
			// 	  			   domain: 'Users',
			// 	  			   entity: 'User',
			//                    date: new Date(), 
			//                    text: global.loggedInUser.nicname + " changed their nicname to " + document.getElementById("Nicname").value});
			// }

			// //  changed name
			// if(global.loggedInUser.firstname != document.getElementById("Firstname").value ||
			//    global.loggedInUser.surname != document.getElementById("Surname").value)
			// {
			// 	tickersBE.add({priority: 1, 
			// 	  			   domain: 'Users',
			// 	  			   entity: 'User',
			//                    date: new Date(), 
			//                    text: global.loggedInUser.nicname + " changed their name to " + document.getElementById("Firstname").value + ' ' + document.getElementById("Surname").value});
			// }

			// global.loggedInUser.nicname = document.getElementById("Nicname").value;
			// global.loggedInUser.firstname = document.getElementById("Firstname").value;
			// global.loggedInUser.surname = document.getElementById("Surname").value;
			// global.loggedInUser.password = document.getElementById("Password").value;
			
			// usersBE.update(global.loggedInUser);

		},
	

		getUserClasses: function()
		{
			for (var i = 0; i< global.userClasses.length; i++)
			{
				var option = document.createElement("option");
				option.text = global.userClasses[i].type;
				option.value = global.userClasses[i].type;
				document.getElementById("Userclass").add(option);
			}
		}
	},

	myAccount: 
    { 
		construct: function()
		{
			dialogBE.getStandardDialog('My Account', 
		                              {
		                              	close: {render: true, hidden: false},
		                              	save: {render: true, hidden: true}
		                              },
		                              this.Validate,
		                              this.Save,
		                              null,
		                              null,
		                              "simpleForm");

			dialogBE.addTextBox({label: "Nicname",  value: global.loggedInUser.nicname, usage: '-update', mandatory: true});
			dialogBE.addTextBox({label: "First name", value: global.loggedInUser.firstname, usage: '-update', mandatory: true});
			dialogBE.addTextBox({label: "Surname", value: global.loggedInUser.surname, usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Login name", value: global.loggedInUser.loginname, usage: '-display'});
			dialogBE.addTextBox({label: "User class",value: global.loggedInUser.class, usage: '-display'});
			dialogBE.addSpacer();
			dialogBE.addTextBox({label: "Password",value: global.loggedInUser.password, usage: '-update', mandatory: true, type: "password"});
			dialogBE.addTextBox({label: "Confirm",value: global.loggedInUser.password, usage: '-update', mandatory: true,type: "password"});
			dialogBE.addTextBox({label: "Id",value: global.loggedInUser.id, usage: '-display', hidden: true});
			dialogBE.addSpacer();
			
			dialogBE.addSelectFile({label: "My Finds GPX",  value: "WP " +  global.loggedInUser.waypointid + " was last upload: " + global.loggedInUser.lastwaypointupload + " (" + global.loggedInUser.cachecount + " caches)", usage: '-update', mandatory: false, savefile: this.saveGPX});

			//  Add a grid of friends

			dialogBE.addGrid({label: "My friends",
				              contentBuilder: function(grid, columns) {friendsBE.getFriendsAsGridContent(grid, columns);},
				              columns: [{text: "User ID", field: "friendid"}, {text: "User Name", field: "users.nicname"}],
				              add: {text: "Add friend", contentBuilder: this.getNonFriends, onclick: this.addAFriend},
				              delete: {text: "Remove"}
				          	  });
			


		},

		saveGPX: async function(xml)
		{
			var chunks = xml.match(/.{1,1800}/g);

			//  send the first chunk along with the token request
			var response = await gpxBE.add(chunks[0], global.loggedInUser);
			
			document.getElementById('loadingstatus').innerHTML = "Uploading file..." + chunks.length + " chunks to load";

			var j = 0;
			//  now send all other requests
			for(var i = 1; i<chunks.length; i++)
			{
				j+=1;
				if(j==1000)
				{
					document.getElementById('loadingstatus').innerHTML = "Uploading file..." + Math.floor(i / chunks.length * 100) + "%";
					j=0;
				}
            	await gpxBE.add(chunks[i], global.loggedInUser, response.data);
            }

			document.getElementById('loadingstatus').innerHTML = "Processing file...";
			//  convert into a waypoints array 
			var wpts = await gpxBE.gpx2wpts(response.data);		
			
			var oldwpid = global.loggedInUser.waypointid;

			//response = await waypointsBE.add({caches: wpts.data}); //  no need, created as part of gpxBE.gpx2wpts whilst on server anyway
			global.loggedInUser.lastwaypointupload = new Date();
			global.loggedInUser.cachecount = wpts.data.caches.length;
			global.loggedInUser.waypointid = wpts.data.id;
			await usersBE.update(global.loggedInUser);

			//  remove any pre-existing waypoints for this user
			//  reinstate with a small waypoint (just id)
			// if (oldwpid != 0)
			// {

			// 	var filter = "T.id == " + oldwpid;

			// 	var result = await waypointsBE.list(filter);
				
			// 	if (result.length == 1)
		 //        	await waypointsBE.delete(result[0]);
		                
			// }

            document.getElementById('loadingstatus').innerHTML = "WP " +  global.loggedInUser.waypointid + " was last upload: " + global.loggedInUser.lastwaypointupload + " (" + global.loggedInUser.cachecount + " caches)"
			
			// await waypointsBE.list();      
		},

		addAFriend: function(grid, columns)
		{
			var friend = {userid: global.loggedInUser.id, friendid: document.getElementById("Addfriend").value}
			friendsBE.add(friend)
		            .then(
		                function(response) 
		                {
		                	//  all cool so rebuild grid content
		                	friendsBE.getFriendsAsGridContent(grid, columns);
		                	usersDLG.myAccount.getNonFriends(document.getElementById('Addfriend'));

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

		getNonFriends: function(select)
		{

			//  modify this to exclude existing friends
			var filter = "T.id != " + global.loggedInUser.id;

			//  using 'onright' is like using 'on' except target.userid = source.id 
			//  instead of using 'on' where source.userid = target.id ( get it?  :o) )
			var joins = [{from: "users", to: "friends", onright: "friendid"}];  
			

			usersBE.list(filter, "nicname", joins)
		            .then(
		                function(response) 
		                {

		                	select.innerText = null
		                	for(var j = 0; j<response.length; j++)
				        	{
				        		if(response[j].friends == null)  //  join failed, therefore not a friend already :o)
				        		{
					        		var option = document.createElement("option");
									option.text = response[j].nicname;
									option.value = response[j].id;
									select.add(option);
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

		Validate: function()
		{

			var error = false; //  no errors

			//  password and confirm password must be the same
			pwd = document.getElementById("Password");
			conf = document.getElementById("Confirm");
			if (pwd.value != conf.value)
			{
				error = true;
				document.getElementById("Password" + "-error").innerHTML = 'Password and Confirm do not match';
				document.getElementById("Confirm" + "-error").innerHTML = 'Password and Confirm do not match';
			}
			return error; 
		},

		Save: function()
		{
			//  do we want any tickers?

			//  changed nicname
			if(global.loggedInUser.nicname != document.getElementById("Nicname").value)
			{
				tickersBE.add({priority: 1, 
				  			   domain: 'Users',
				  			   entity: 'User',
			                   date: new Date(), 
			                   text: global.loggedInUser.nicname + " changed their nicname to " + document.getElementById("Nicname").value});
			}

			//  changed name
			if(global.loggedInUser.firstname != document.getElementById("Firstname").value ||
			   global.loggedInUser.surname != document.getElementById("Surname").value)
			{
				tickersBE.add({priority: 1, 
				  			   domain: 'Users',
				  			   entity: 'User',
			                   date: new Date(), 
			                   text: global.loggedInUser.nicname + " changed their name to " + document.getElementById("Firstname").value + ' ' + document.getElementById("Surname").value});
			}

			global.loggedInUser.nicname = document.getElementById("Nicname").value;
			global.loggedInUser.firstname = document.getElementById("Firstname").value;
			global.loggedInUser.surname = document.getElementById("Surname").value;
			global.loggedInUser.password = document.getElementById("Password").value;
			
			usersBE.update(global.loggedInUser);

			
		}
	}

}

