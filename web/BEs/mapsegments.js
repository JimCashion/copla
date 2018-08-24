//  users table BE functions

mapsegmentsBE = {

	//  List users
	list: function(filter, sort, joins)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort, joins: joins};

	     	fetch('http://127.0.0.1:8081/list?table=mapsegments&options=' + encodeURIComponent(JSON.stringify(opt)))
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
     
     		fetch('http://127.0.0.1:8081/add?table=mapsegments&object=' + JSON.stringify(user), {method: "post"})
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
     
     		fetch('http://127.0.0.1:8081/update?table=mapsegments&object=' + JSON.stringify(user), {method: "post"})
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
     
     		fetch('http://127.0.0.1:8081/delete?table=mapsegments&object=' + JSON.stringify(user), {method: "post"})
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
				mapsegmentsBE.list(null, "name")
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

mapsegmentsDLG = {


	maintainMapSegments: {
		construct: function()
		{
			dialogBE.getStandardDialog('Maintain Map Segments', 
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
			dialogBE.addTextBox({label: "Name", value: "", usage: '-display', mandatory: false});
			dialogBE.addTextBox({label: "Id",value: "", usage: '-display', hidden: false});
			
			dialogBE.addSelectFile({label: "GPX",  value: "", usage: '-update', mandatory: false, savefile: this.saveGPX});

			//  and a list of all map segments
			dialogBE.addList({label: "Map Segment List",
				              contentBuilder: function(select) {mapsegmentsBE.getAsContent(select);},
				              valueChanged: function() {mapsegmentsDLG.maintainMapSegments.ValueChanged();},
							   });

		
			document.getElementById("GPX").hidden = true;  //  hide browse button to start with
			
		},

		
		
		ValueChanged: function()
		{
			var sel = document.getElementById("MapSegmentList").value;
    		
    		if(sel == null || sel == '')
    			return;

			var filter = "T.id == " + sel;

	        mapsegmentsBE.list(filter)
	        .then(
	        function(result) 
	        {
	            //  we got something
	            //  Lets Gooooo!!!!!
            	var selseg = JSON.parse(JSON.stringify(result[0]));
	            document.getElementById("Name").value = selseg.name;
				document.getElementById("Id").value = selseg.id;
				document.getElementById("GPX").hidden = false;
	            document.getElementById("loadingstatus").innerHTML = "WP " + selseg.waypointid + " was last upload: " + selseg.lastwaypointupload + " (" + selseg.cachecount + " caches)";


				document.getElementById("Name").disabled = false;
					
				document.getElementById("Name-mandatory").innerHTML = "*";
				
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
			document.getElementById("Name").value = "";
			document.getElementById("loadingstatus").value = "";
			document.getElementById("GPX").hidden = true;
				
			document.getElementById("Id").value = -1;
			document.getElementById("MapSegmentList").value = -1;

			document.getElementById("Name").disabled = false;
			document.getElementById("GPX").disabled = false;
			
			document.getElementById("Name-mandatory").innerHTML = "*";
			
			document.getElementById("Name-error").innerHTML = "&nbsp;";
			

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

	        var wp = await mapsegmentsBE.list(filter);

	        var result = await mapsegmentsBE.delete(wp[0]);
	      
	      	var idx = document.getElementById("MapSegmentList").selectedIndex;
	      	document.getElementById("MapSegmentList").remove(idx);
	      	document.getElementById("MapSegmentList").selectedIndex = idx;
	      	mapsegmentsDLG.maintainMapSegments.ValueChanged();
		},

		Validate: async function(item)
		{

				var error = false; //  no errors

				//  duplicate name

				if (document.getElementById("Id").value == -1)
				{
					var filter = "T.name == '" + document.getElementById("Name").value + "'";

			        var result = await mapsegmentsBE.list(filter);
			        if(result.length != 0)
		            {
		            	error = true;
						document.getElementById("Name-error").innerHTML = 'This has already been taken!';
					}
				
					
				}

			return error;
		 
		},

		Save: async function(item)
		{

			if (document.getElementById("Id").value == -1)
			{
				document.getElementById("Name").disabled = false;
				
				//  add the user
				await mapsegmentsBE.add({name: document.getElementById("Name").value});
	             
			}
			else
			{
				var filter = "T.id == " + document.getElementById("Id").value;

	        	var wp = await mapsegmentsBE.list(filter);

			    wp[0].name = document.getElementById("Name").value;
                
	        	var result = await mapsegmentsBE.update(wp[0]);

			}

			var idx = document.getElementById("MapSegmentList").selectedIndex;
	      	mapsegmentsBE.getAsContent(document.getElementById("MapSegmentList"));
	      	document.getElementById("MapSegmentList").selectedIndex = idx;
	      	mapsegmentsDLG.maintainMapSegments.ValueChanged();

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
				
			filter = "T.id == " + document.getElementById('Id').value;
			var segment = await mapsegmentsBE.list(filter);

			//messageJSON(segment[0]);
			var oldwpid = segment[0].waypointid;

			// //response = await waypointsBE.add({caches: wpts.data}); //  no need, created as part of gpxBE.gpx2wpts whilst on server anyway
			segment[0].lastwaypointupload = new Date();
			segment[0].cachecount = wpts.data.caches.length;
			segment[0].waypointid = wpts.data.id;
			await mapsegmentsBE.update(segment[0]);

			//remove any pre-existing waypoints for this user
			// reinstate with a small waypoint (just id)
			// if (oldwpid != 0)
			// {

			// 	var filter = "T.id == " + oldwpid;

			// 	var result = await waypointsBE.list(filter);
				
			// 	if (result.length == 1)
		 //        	await waypointsBE.delete(result[0]);
		                
			// }

            document.getElementById('loadingstatus').innerHTML = "WP " +  segment[0].waypointid + " was last upload: " + segment[0].lastwaypointupload + " (" + segment[0].cachecount + " caches)"
			
			 //await waypointsBE.list();      
		}

	}
}

