//  Database Memory

//TODO:
//	genericize initialising tables from directory list of ./Persisted
//	automate periodic commitment/persist
//  truncate journal option. (automatic at startup)

var globals = require('../ServerGlobals');  //  configuration options
var tables = [];
exports.payloads = [];

exports.Table = function(name) {
	
	for(var i = 0; i<tables.length; i++)
	{
		if(tables[i].name == name)
		{

			return tables[i].table;
		}
	}
	var newtable = JSON.parse('{"' + name + '" : []}');
	tables.push({name: name, table: newtable});
	console.log('    New Table Created: ' + name );
	return newtable;
};

var db = require('.' + globals.config.db_location + '/db');  //  database tables and functions

//  Persist pending changes
exports.persist = function(activecommit)
{
	console.log('Starting Persisting database Changes....');

	console.log('    ' + 'Writing Commitment Boundary Indicator');

	var guid = globals.functions.getGuid();
	
 	globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'CMT' + globals.config.journal_delimiter + guid + globals.config.journal_newline);

    var data = globals.fs.readFileSync( globals.config.db_journal_location + "/" + "receiver.json", 'utf8').split(/\r\n|\n/);

	console.log('    Getting Commitment Range..');
	var startpoint = 0;
	var endpoint = 0;
	for(var startpoint = data.length - 1; startpoint>=0; startpoint--)
    {
    	var lineElements = data[startpoint].split(globals.config.journal_delimiter);
		if( lineElements[0] == "CMT" & lineElements[1] == guid)
		{
			endpoint = startpoint - 1;
		}
		if( lineElements[0] == "CMT" & lineElements[1] != guid)
		{
			startpoint += 1;
			break;
		}
	}

	console.log('    Commitment Range is ' + startpoint + " to " + endpoint);
	if(startpoint > endpoint || startpoint < 0 || endpoint < 0)
	{
		console.log('    Nothing to do!');
	}
	else
	{
		if (activecommit)
		{
			console.log('    Active Commit - setting memory to persisted state.')
			initialise(false);
		}

   	    for(var rec = startpoint; rec<= endpoint; rec++)
	    {
	    	if(data[rec] == null)
	    		break;

			console.log('    Processing: ' + rec + ' - ' + data[rec]);
			var lineElements = data[rec].split(globals.config.journal_delimiter);
			var op = lineElements[0];
			var tablename = lineElements[1];
			var image = lineElements[2];
			var obj = JSON.parse(lineElements[3]);

			//  lets play a crafty one..  If this is an update then depenging on the image it is
			//  either an add or delete in effect!

			if (op == 'UPD')
			{
				if (image == 'B')
					op = "DEL";
				else
				if (image == 'A')
					op = "CRT";
			}

			//  now process the operation as appropriate
			switch(op)
			{
				case "CRT":
					
					//  put into memory
					db.Table(tablename)[tablename].push(obj);
	                
	                //  put onto disk to persist
					globals.fs.writeFileSync(globals.config.db_physical_location + "/" + tablename + ".json", JSON.stringify(db.Table(tablename)), 'utf8'); 
			        console.log('    ' + tablename + ' created');
					break;
				case "DEL":
					//  remove from memory
				    var l = db.Table(tablename)[tablename].length;
			   	    for(var i = 0; i<l;i++)
			        {
			       	 
				       	var tobj = db.Table(tablename)[tablename][0];
				       	db.Table(tablename)[tablename].shift();
				       	if (tobj.id == obj.id)
			       	 	{
			       	 		break;
			       	 	}	
			       		else
			       	 	{
			       	 		db.Table(tablename)[tablename].push(tobj);
			       	 	}
			        }
	  				//  put onto disk to persist
					globals.fs.writeFileSync(globals.config.db_physical_location + "/" + tablename + ".json", JSON.stringify(db.Table(tablename)), 'utf8');  //  put onto disk to persist
			        console.log('    ' + tablename + ' deleted');
					break;

				default:
					console.log('Ignoring...');
					break;
			}

		}
	}	
	console.log('Ending Persisting database Changes');
}

//  Initialise memory resident database

exports.initialise = function()
{
	initialise(true);

}
function initialise(logmessages)
{
	if (logmessages)
	{
		console.log('Starting database initialisation....');
	}

	tables = [];
	var files = globals.fs.readdirSync(globals.config.db_physical_location);
	for(var i in files) {
		if (files[i].split('.').pop() === 'json')
	    {
	    	if (logmessages)
			{
				console.log('    ' + 'Loading ' + files[i]);
			}
			// var newtable = JSON.parse('{"' + name + '" : []}');
			// tables.push({name: name, table: newtable});
 			tables.push({name: files[i].split('.')[0], table: JSON.parse( globals.fs.readFileSync(  globals.config.db_physical_location + "/" + files[i], 'utf8'))});
		}
	}
	
	if (logmessages)
	{
		console.log('Ending database initialisation');
	}

}





