//  waypoints table BE functions

waypointsBE = {

	//  List users
	list: function(filter, sort, joins)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort, joins: joins};

	     	fetch('http://127.0.0.1:8081/list?table=waypoints&options=' + encodeURIComponent(JSON.stringify(opt)))
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

	// sendWaypointsInChunks: async function(waypoint)
	// {
	// 	var chunks = waypoint.match(/.{1,1800}/g);

	// 	//  send the first chunk along with the token request
	// 	var response = await gpxBE.add(chunks[0], global.loggedInUser);
		
	// 	document.getElementById('loadingstatus').innerHTML = "Finalising file..." + chunks.length + " chunks to load";

	// 	var j = 0;
	// 	//  now send all other requests
	// 	for(var i = 1; i<chunks.length; i++)
	// 	{
	// 		j+=1;
	// 		if(j==1000)
	// 		{
	// 			document.getElementById('loadingstatus').innerHTML = "Finalising file..." + Math.floor(i / chunks.length * 100) + "%";
	// 			j=0;
	// 		}
 //        	await gpxBE.add(chunks[i], global.loggedInUser, response.data);
 //        }
 //    },

	//  Add Waypoint
	add: function(waypoint, creator)
	{
		//  has to be done in chunks because could be more than 2K )or maybe not ;o)

		//this.sendWaypointsInChunks(waypoint);

		return new Promise(function(resolve, reject) {
     
     		
     		fetch('http://127.0.0.1:8081/add?table=waypoints&object=' + JSON.stringify(waypoint), {method: "post"})
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

	
	//  Update User
	update: function(user)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/update?table=waypoints&object=' + JSON.stringify(user), {method: "post"})
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
     
     		fetch('http://127.0.0.1:8081/delete?table=waypoints&object=' + JSON.stringify(user), {method: "post"})
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


}
