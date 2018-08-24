//  to do list table BE functions

toDoListBE = {

	//  List usergroups
	list: function(filter, sort, joins)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort, joins: joins};


	     	fetch('http://127.0.0.1:8081/list?table=todolist&options=' + encodeURIComponent(JSON.stringify(opt)))
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
     
     		fetch('http://127.0.0.1:8081/add?table=todolist&object=' + JSON.stringify(obj), {method: "post"})
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
     
     		fetch('http://127.0.0.1:8081/update?table=todolist&object=' + JSON.stringify(usergroup), {method: "post"})
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
     
     		fetch('http://127.0.0.1:8081/delete?table=todolist&object=' + JSON.stringify(usergroup), {method: "post"})
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
		var joins = [{from: "todolist", to: "users", on: "originuserid"}];
		toDoListBE.list("T.userid == " + global.loggedInUser.id, "users.name", joins)
	            .then(
	                function(response) 
	                {
	                	for(var i = 0; i<panels.length; i++)
				        {
				        	if (panels.children[i].tag == 'My to do list')
				        	{
				        		panels.children[i].clearContent();

								for(var j = response.length - 1; j>= 0; j--)
				        		{
									var text = "";
									switch (response[j].type)
									{
										case 1:
										text = 'Rate ' + response[j].users.nicname + "'s idea";
										break;

									}

				        			panels.children[i].content.push({text: text});
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
}

