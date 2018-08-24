
//  globals including config settngs
var globals = require('./ServerGlobals');  //  configuration options
var tables = require(globals.config.db_location + '/tableDefinitions');  //  database table definitions

//  server parameters
var help = false;
var clean = false;
var nointegritycheck = false;

//  echo out any command line parameters

console.log('server started with parameters...');
process.argv.forEach(function (val, index, array) {
  if (val == '-help')
  {
  	 help = true;
  	 console.log('  -help:  List help options and exit');
  	 console.log('     -help lists these options');
  	 console.log('     -clean Undefined record properties will be deleted');
  	 console.log('     -nointegritycheck Skip the integrity check (not recommended)');
  	 process.exit(1);

  }

  if (val == '-clean')
  {
  	 clean = true;
  	 console.log('  -clean: Undefined record properties will be deleted');
  }
  if (val == '-nointegritycheck')
  {
  	 nointegritycheck = true;
  	 console.log('  -nointegritycheck: Skip the integrity check (not recommended)');
  }
});

console.log('end of parameter listing')

//  Start Database
var db = require(globals.config.db_location + '/db')    //  database tables and functions
db.initialise();   //  load up previously persisted tables
db.persist(true);  //  persist previous requests.  So memory needs to be updated also

//  Business Entities
var BE_Generic = require(globals.config.be_location + '/Generic');
//var BE_Users = require(globals.config.be_location + '/Users');

// all cross donain/port postings
globals.app.use(globals.cors({origin: '*'}));

//  Set up Users BE web service requests
BE_Generic.web_requests();
//BE_Users.web_requests();

//  Schedule auto persist if required
if (globals.config.auto_persist_interval != null && globals.config.auto_persist_interval != 0)
{
	console.log('Scheduling auto-persist every ' + globals.config.auto_persist_interval + ' miliseconds' );
	setInterval(db.persist, globals.config.auto_persist_interval, true); 
}



console.log("Initialising push notifications..");

io = require("socket.io"),
server = io.listen(8000);

server.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    globals.connectedclients.push(socket);
    
    // when socket disconnects, remove it from the list:
    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });
});


console.log("Push notifications ready");

if (nointegritycheck == false)
{
	console.log("Checking and correcting table integrity...");

	for (var i = 0; i< tables.tables.length; i++)
	{
	    console.log('Table ' + tables.tables[i].name + (tables.tables[i].dirty ? ' is dirty' : ''));
	    if(tables.tables[i].dirty)
	    {
	        var data = JSON.parse(JSON.stringify(db.Table(tables.tables[i].name)));
	        data = data[tables.tables[i].name];
	        
	        for(var j = 0; j < data.length; j++)
	        {
	          //console.log(Object.keys(data[j]));
	          //console.log(data[j]);
	            for(var k = 0; k< tables.tables[i].fields.length; k++)
	            {
	                //console.log(tables.tables[i].fields[k].name + '... ' + data[j][tables.tables[i].fields[k].name]);

	                if (data[j][tables.tables[i].fields[k].name] == null)
	                {
	                  console.log('    ' + tables.tables[i].fields[k].name + ' is null, setting to ' + tables.tables[i].fields[k].default);
	                  data[j][tables.tables[i].fields[k].name] = tables.tables[i].fields[k].default;
	                }

	            }
	        }

	        db.Table(tables.tables[i].name)[tables.tables[i].name] = data;
	        globals.fs.writeFileSync(globals.config.db_physical_location + "/" + tables.tables[i].name + ".json", JSON.stringify(db.Table(tables.tables[i].name)), 'utf8');  //  put onto disk to persist
	              
	    }
	}
	console.log("Table integrity check complete.  ");
}

if (clean == true)
{
	console.log("Removing undefined table fields.  ");

	for (var i = 0; i< tables.tables.length; i++)
	{
	    console.log('   Cleaning table ' + tables.tables[i].name);
	    
		var data = JSON.parse(JSON.stringify(db.Table(tables.tables[i].name)));
	        data = data[tables.tables[i].name];
	       
	    
	     for(var j = 0; j < data.length; j++)
	     {
			keys = Object.keys(data[j]);
			for (var k = 0; k< keys.length; k++)
			{
				var found = false;
				for(var l = 0; l< tables.tables[i].fields.length; l++)
				{
					if (keys[k] == tables.tables[i].fields[l].name)
					{
						found = true;
						break;
						
					}

				}
				if(!found)
				{
					console.log('    deleting property ' + keys[k] + ' id=' + data[j].id);
					delete data[j][keys[k]];
				}
			}

	     }
		
		 db.Table(tables.tables[i].name)[tables.tables[i].name] = data;
	     globals.fs.writeFileSync(globals.config.db_physical_location + "/" + tables.tables[i].name + ".json", JSON.stringify(db.Table(tables.tables[i].name)), 'utf8');  //  put onto disk to persist
	        
	}

	console.log("Removing undefined table fields complete.  ");
}

//  Start Listening for REST requests
var server = globals.app.listen(globals.config.listen_port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Copla Server listening at http://" + host + ":" + port);




})

