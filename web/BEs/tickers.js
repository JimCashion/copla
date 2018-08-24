//  tickers table BE functions

//  ticker priority
//		0	not very interesting
//

tickersBE = 
{

	//  List tickers
	list: function(filter, sort)
	{
		return new Promise(function(resolve, reject) {
     
   			var opt = {filter: filter, sort: sort};

	     	fetch('http://127.0.0.1:8081/list?table=tickers&options=' + encodeURIComponent(JSON.stringify(opt)))
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
		            	//  In this case a list of tickers
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

	//  Add ticker
	add: function(ticker)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/add?table=tickers&object=' + JSON.stringify(ticker), {method: "post"})
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
		            	//  In this case the ticker we just created with a new id 
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

	//  Update ticker
	update: function(ticker)
	{
		return new Promise(function(resolve, reject) {
     
     		fetch('http://127.0.0.1:8081/update?table=ticker&object=' + JSON.stringify(ticker), {method: "post"})
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
		            	//  In this case the ticker we just created with a new id 
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

	//  Update ticker
	getContent: function()
	{
		var crit = null;  // TODO set up some sort of range

		tickersBE.list(crit)
		.then(
            function(result) 
            {
				for(var i = 0; i<panels.length; i++)
		        {
		        	if (panels.children[i].tag == 'My ticker')
		        	{
		        		panels.children[i].clearContent();

						for(var j = 0; j<result.length; j++)
		        		{
		        			panels.children[i].content.push({text: result[j].text, date: result[j].date});
		        		}

		        		panels.children[i].insertContent();
		        	}
				}
			},
            function(err) 
            {
                //  error condition
                alert(err);
            }

        );
	},

	addContent: function(tick)
	{
		var crit = null;  // TODO set up some sort of range

		
		for(var i = 0; i<panels.length; i++)
        {
        	if (panels.children[i].tag == 'My ticker')
        	{
        		panels.children[i].content.push({text: tick.text, date: tick.date});
				panels.children[i].clearContent(true);
				panels.children[i].insertContent();
        	}
		}
	}
}







