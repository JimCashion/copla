var globals = require('../ServerGlobals');  //  configuration options
var db = require('.' + globals.config.db_location + '/db');  //  database tables and functions
var tables = require('.' + globals.config.db_location + '/tableDefinitions');  //  database table definitions

//  Set up Generic BE web service requests
exports.web_requests = function() {
  console.log('setting up Generic web request handlers....');
	
  console.log('    ' + 'list Anything');
  globals.app.get('/list', function (req, res) {
      
     

      result = {ok: false, data: ''};
      var q = globals.url.parse(req.url, true);
      var tbl = q.query.table;
      var opt = q.query.options;
     
      console.log( 'Starting list Anything for table ' + tbl); 

      try
      {
      
        result = db_list(tbl, opt); 
        console.log('jim');  
        console.log(result);
        console.log('endjim');  
      } 
      catch(e)
      {
         result.ok = false;
         result.data = e;
        
      }
      finally
      {
        res.end(JSON.stringify(result) );

        console.log( 'Ending List anything, ' + result.data.length + ' records listed from ' + tbl + ', Success=' + result.ok);
      }
    })

  console.log('    ' + 'add Anything');
  globals.app.post('/add', function (req, res) {
      
      result = {ok: false, data: ''};

      var q = globals.url.parse(req.url, true);
      var tbl = q.query.table;
      console.log( 'Starting add Anything for table ' + tbl); 

      try
      {

       
        if(q.query.tokenrequest != null && q.query.tokenrequest == "new")
        {
          var d = q.query.payload;
          result.ok = true;
          result.data = globals.functions.getGuid();
          //console.log('token generated ' + result.data);

          db.payloads.push({token: result.data, payload: d});

        }
        else
        if(q.query.tokenrequest == null && q.query.token != null)
        {
          var d = q.query.payload;
          result.ok = true;
          for(var i = 0; i< db.payloads.length; i++)
          {

            if(db.payloads[i].token == q.query.token)
            {
                db.payloads[i].payload += d;
            }
          }

           //console.log('Payloads ' + JSON.stringify(db.payloads));
        }
        else
        {
           //  get the object from the URL
            var o = JSON.parse(q.query.object);
     
          //  check integrity of object we are trying to create
          var checkResult = checkForBadFields(tbl, o);
          if (checkResult != '')
            throw checkResult;
      
          //  All OK so lets get on with it

          //  get a new id

          var newid = 0;

          var data = JSON.parse(JSON.stringify(db.Table(tbl)));  //  clone
          var recs = data[tbl];   // [] notation allow access to property held in a variable 
        
          for(var i = 0; i< recs.length;i++)
          {
            if (recs[i].id > newid)
              newid = recs[i].id;
          }
          o.id = newid + 1;

          //  add the object
          db.Table(tbl)[tbl].push(o);
          
          result.ok = true;
          result.data = o;

          //  write an after image only for the created object
          globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'CRT' + globals.config.journal_delimiter + tbl + globals.config.journal_delimiter + "A" + globals.config.journal_delimiter + JSON.stringify(o) + globals.config.journal_newline);

          //  if we are adding a ticker then notify all connected clients

          if (tbl == 'tickers')
          {
            for(var i = 0; i<globals.connectedclients.length; i++)
            {
              if (globals.connectedclients[i] != null)
              {
                globals.connectedclients[i].emit("new-ticker", JSON.stringify(o));
              }
            }
               
          }
        }       

      }
      catch(e)
      {
         result.ok = false;
         result.data = e;
         console.log('ERROR in add anything, response is..');
         console.log(result);
      }
      finally
      {
        res.end( JSON.stringify(result) );
        console.log( 'Ending add Anything for table ' + tbl + q.query.token + ', Success=' + result.ok);
       
      }
    })

  console.log('    ' + 'Update Anything');
  globals.app.post('/update', function (req, res) {
        
      result = {ok: false, data: ''};
      var q = globals.url.parse(req.url, true);
      var tbl = q.query.table;
      
      console.log( 'Starting Update Anything for table ' + tbl); 

        try
        {
          //  get the object from the URL
          var q = globals.url.parse(req.url, true);
          var o = JSON.parse(q.query.object);
          
          console.log( 'updating ' + tbl + ' with id=' + o.id);

          //  find the object and delete
      
          var l = db.Table(tbl)[tbl].length;
          var obj = null;
          for(var i = 0; i<l;i++)
          {
           
            obj = db.Table(tbl)[tbl][0];
            db.Table(tbl)[tbl].shift();
            if (obj.id == o.id)
            {
              break;
            } 
            else
            {
              db.Table(tbl)[tbl].push(obj);
              obj = null;
            }
          }
           
          if (obj != null)
          {
            //  now add the modified object back
            db.Table(tbl)[tbl].push(o);
            result.ok = true;
            result.data = tbl + ' with id ' + o.id + " was successfully updated.";

            //  write a before and after images for the updated object
            globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'UPD' + globals.config.journal_delimiter + tbl + globals.config.journal_delimiter + "B" + globals.config.journal_delimiter + JSON.stringify(obj) + globals.config.journal_newline);
            globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'UPD' + globals.config.journal_delimiter + tbl + globals.config.journal_delimiter + "A" + globals.config.journal_delimiter + JSON.stringify(o) + globals.config.journal_newline);
          }
          else
          {
              //  could not update object!  What ot do??
              result.data = tbl +  'with id ' + o.id + " was not found.";
          }
        }   
        catch(e)
        {
           result.data = e.message;
        }
        finally
        {
          res.end( JSON.stringify(result) );
          console.log('Ending update Anything for table ' + tbl + ', Success=' + result.ok);
        }
        
  })

  console.log('    ' + 'Delete Anything');
  globals.app.post('/delete', function (req, res) {
        
      result = {ok: false, data: ''};
      var q = globals.url.parse(req.url, true);
      var tbl = q.query.table;
      
      console.log( 'Starting delete Anything for table ' + tbl); 

        try
        {
          //  get the object from the URL
          var q = globals.url.parse(req.url, true);
          var o = JSON.parse(q.query.object);
          
          console.log( 'deleting ' + tbl + ' with id=' + o.id);

          //  find the object and delete
      
          var l = db.Table(tbl)[tbl].length;
          var obj = null;
          for(var i = 0; i<l;i++)
          {
           
            obj = db.Table(tbl)[tbl][0];
            db.Table(tbl)[tbl].shift();
            if (obj.id == o.id)
            {
              break;
            } 
            else
            {
              db.Table(tbl)[tbl].push(obj);
              obj = null;
            }
          }
           
          if (obj != null)
          {
            
            result.ok = true;
            result.data = tbl + ' with id ' + o.id + " was successfully deleted.";

            //  write a before and after images for the updated object
            globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'DEL' + globals.config.journal_delimiter + tbl + globals.config.journal_delimiter + "B" + globals.config.journal_delimiter + JSON.stringify(obj) + globals.config.journal_newline);
          }
          else
          {
              //  could not update object!  What ot do??
              result.data = tbl +  'with id ' + o.id + " was not found.";
          }
        }   
        catch(e)
        {
           result.data = e.message;
        }
        finally
        {
          res.end( JSON.stringify(result) );
          console.log('Ending delete Anything for table ' + tbl + ', Success=' + result.ok);
        }
        
  })

  console.log('    ' + 'Convert GPX to Waypoints');
  globals.app.post('/gpx2wpts', function (req, res) {
      result = {ok: false, data: ''};

      var q = globals.url.parse(req.url, true);
     
     console.log( 'Convert GPX to Waypoints for token ' + q.query.token); 

      try
      {
          for(var i = 0; i< db.payloads.length; i++)
          {

            if(db.payloads[i].token == q.query.token)
            {
                result.ok = true;
                console.log('found payload');
               // console.log(db.payloads[i].payload);
                result.data = xml2wpts(db.payloads[i].payload);

                console.log('Persisting Waypoint');
                var wpts = {caches: result.data};
                //console.log(wpts);

                var newid = 0;

                var data = JSON.parse(JSON.stringify(db.Table('waypoints')));  //  clone
                var recs = data['waypoints'];  
        
                for(var i = 0; i< recs.length;i++)
                {
                  if (recs[i].id > newid)
                    newid = recs[i].id;
                }
                wpts.id = newid + 1;

                //console.log(wpts);

                //  add the object
                db.Table('waypoints')['waypoints'].push(wpts);
          
                result.ok = true;
                result.data = wpts;

                //  write an after image only for the created object
                globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'CRT' + globals.config.journal_delimiter + 'waypoints' + globals.config.journal_delimiter + "A" + globals.config.journal_delimiter + JSON.stringify(wpts) + globals.config.journal_newline);



            }
          }

       
      }
      catch(e)
      {
         result.ok = false;
         result.data = e;
         console.log('ERROR in Convert GPX to Waypoints, response is..');
         console.log(result);
      }
      finally
      {
        res.end( JSON.stringify(result) );
        console.log( 'Ending Convert GPX to Waypoints for token ' + q.query.token + ', Success=' + result.ok);
        
      }
    })

    console.log('Generic Web request handler setup is complete!');
}

function checkForBadFields(tbl, o)
{
   // firstly check the table exists
  var found = false;
  for (var i = 0; i< tables.tables.length; i++)
  {
    if (tables.tables[i].name == tbl)
    {
       found = true;
    }
  }

  if(!found)
    return 'Attempt to create a row in an undefined table (' + tbl + ')';

  //  now check for missing fields
  for (var i = 0; i< tables.tables.length; i++)
  {
    if (tables.tables[i].name == tbl)
    {
       for(var k = 0; k< tables.tables[i].fields.length; k++)
       {
          if(tables.tables[i].fields[k].name != 'id')
          {
            if (o[tables.tables[i].fields[k].name] == null)
            {
              console.log('    ' + tables.tables[i].fields[k].name + ' is null, setting to default');
              o[tables.tables[i].fields[k].name] = tables.tables[i].fields[k].default;
            }
          }
        }
     }
  }
  return '';

};

function db_list(tbl,opt){

  console.log('dblist  ' + tbl);
  console.log(opt);
  result = {ok: false, data: ''};
 
  var data = null;

    if(tbl == 'waypoints' && opt !== null)
    {
        result.ok = true;
        result.data = db.Table(tbl)[tbl];
        return result;

    }
    else
    {
      data = JSON.parse(JSON.stringify(db.Table(tbl)));  //  clone

    }


  console.log('parsed');
  data = data[tbl];   // [] notation allow access to property held in a variable 
 
  //  do we have any optons?

  if (opt != null)
  {
   
    var options = JSON.parse(opt);
   
    var fila = [];
    if (options.filter != null)
    {
      //  apply a filter  (needs to be rewritten so it doesnlt use eval :( )
      console.log('applying filter: ' + options.filter);
      
      for(var i = 0; i<data.length;i++)
      {
         var T = data[i];
         
         //  this may fail if we are filtering on a joinde field
         try
         {
            if (eval(options.filter))
               fila.push(T);

         }
         catch(ex)
         {
            fila.push(T);
         }
        
         
      }
      
    }
    else
    {
      fila = JSON.parse(JSON.stringify(data));  //  clone
    }

    if(tbl == 'waypoints')
    {
      result.ok = true;
      result.data = fila;
      return result;

    }

    data = JSON.parse(JSON.stringify(fila));  //  clone

    if (options.joins != null)
    {
      console.log('joining to ' + tbl);

      for(var r = 0; r< data.length; r++)
      {
        for(var i = 0; i< options.joins.length; i++)
        {
          var j = options.joins[i];
          if (j.from == tbl)
          {
            if (j.on != null)
                options.filter = "T.id == " + data[r][j.on];
            else
            if (j.onright != null)
            {
             // console.log(data[r]);
                options.filter = "T." + j.onright + " == "  + data[r].id;
            }
            
            opt = JSON.stringify(options);
           
            var joinedresults = db_list(j.to, opt);
            data[r][j.to] = joinedresults.data[0];
           }
        }
      }
    }

    if (options.sort != null)
    {
      console.log(' sorting by ' + options.sort);
    
      //  apply a sort  (only one field allowed at the moment :( )
       data.sort(function(a, b) {
        if (options.sort.split(".").length == 1)
        {
          if (a[options.sort] > b[options.sort]) 
            return 1;
          else 
          if (a[options.sort] < b[options.sort])
            return -1;
          else
            return 0;
        }
        else
        if (options.sort.split(".").length == 2)
        {
          if (a[options.sort.split(".")[0]] == null || b[options.sort.split(".")[0]] == null)
              return 0;  //  inner join failed (should be impossible under normal circumstances)

          if (a[options.sort.split(".")[0]][options.sort.split(".")[1]]  > b[options.sort.split(".")[0]][options.sort.split(".")[1]]) 
            return 1;
          else 
          if (a[options.sort.split(".")[0]][options.sort.split(".")[1]] < b[options.sort.split(".")[0]][options.sort.split(".")[1]])
            return -1;
          else
            return 0;
        }


      });


    }
  }

  result.ok = true;
  result.data = data;
  return result;
}

function xml2wpts(xml)
{
  //  GPX merge stuff here for now
console.log('converting');
//console.log(xml);
//
//globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "jim.xml", xml);

//xml = globals.fs.readFileSync( globals.config.db_journal_location + "/" + "smallafter1.gpx", 'utf8').split(/\r\n|\n/);


  var convert = require('xml-js');
  var xmls = replaceAll(xml,"|","!");
  var lo_lat = 9999999;
  var lo_lat_code = '';
  var lo_lon = 9999999;
  var lo_lon_code = '';
  var hi_lat = 0;
  var hi_lat_code = '';
  var hi_lon = 0;
  var hi_lon_code = '';

  // turn into a single string
  // for(var i = 0; i< xml.length; i++)
  // {
  // xmls += xml[i];
  // }

  //  convert into a javescript/JSON object
  var result1 = convert.xml2js(xmls, {compact: true, spaces: 4, alwaysArray: true});
  //console.log(result1);
  console.log('converted ' + result1.gpx[0].wpt.length);
  var caches = [];

  //  convert lon and lat into integers, remove negatives, record min and max values  
  //  and filter so we have welsh caches only for now
  for(var i = 0; i< result1.gpx[0].wpt.length; i++)
  {
    //console.log(result1.gpx[0].wpt[i]);
   //  if((result1.gpx[0].wpt[i]['groundspeak:cache'][0]['groundspeak:state'][0]._text == "North West England") ||
     //   (result1.gpx[0].wpt[i]['groundspeak:cache'][0]['groundspeak:state'][0]._text == "South Wales") )
    {
      result1.gpx[0].wpt[i]._attributes.lat_orig = result1.gpx[0].wpt[i]._attributes.lat;
      result1.gpx[0].wpt[i]._attributes.lon_orig = result1.gpx[0].wpt[i]._attributes.lon;

      delete result1.gpx[0].wpt[i]["groundspeak:cache"];  //  temporay clean up to reduce size
      // delete result1.gpx[0].wpt[i]["desc"];
      delete result1.gpx[0].wpt[i]["url"];
      delete result1.gpx[0].wpt[i]["urlname"];
      delete result1.gpx[0].wpt[i]["sym"];
      //delete result1.gpx[0].wpt[i]["type"];
      delete result1.gpx[0].wpt[i]["time"];

      result1.gpx[0].wpt[i]._attributes.lat = Math.floor(result1.gpx[0].wpt[i]._attributes.lat * 100000);
      result1.gpx[0].wpt[i]._attributes.lon = Math.floor(result1.gpx[0].wpt[i]._attributes.lon * -100000);

      if (result1.gpx[0].wpt[i]._attributes.lat < lo_lat)
      {
        lo_lat = result1.gpx[0].wpt[i]._attributes.lat;
        lo_lat_code = result1.gpx[0].wpt[i].name._text;
      }
      if (result1.gpx[0].wpt[i]._attributes.lat > hi_lat)
      {
        hi_lat = result1.gpx[0].wpt[i]._attributes.lat;
        hi_lat_code = result1.gpx[0].wpt[i].name._text;
      }

      if (result1.gpx[0].wpt[i]._attributes.lon < lo_lon)
      {
        lo_lon = result1.gpx[0].wpt[i]._attributes.lon;
        lo_lon_code = result1.gpx[0].wpt[i].name._text;
      }
      if (result1.gpx[0].wpt[i]._attributes.lon > hi_lon)
      {
        hi_lon = result1.gpx[0].wpt[i]._attributes.lon;
        hi_lon_code = result1.gpx[0].wpt[i].name._text;
      }
      caches.push(result1.gpx[0].wpt[i]);
    }
  }

  //  now we have our limits turn the lowest values into 0 and adjust all other values to be relative to that.
  for(var i = 0; i< caches.length; i++)
  {
    caches[i]._attributes.lat -= lo_lat;
    caches[i]._attributes.lon -= lo_lon;
  }
  hi_lat -= lo_lat;
  lo_lat = 0;
  hi_lon -= lo_lon;
  lo_lon = 0;

  //  and adjust lon and lat to fit bitmap coordinates (0,0 is at top left)

  for(var i = 0; i< caches.length; i++)
  {
    caches[i]._attributes.lat = hi_lat - caches[i]._attributes.lat;
    caches[i]._attributes.lon = hi_lon - caches[i]._attributes.lon;
  }

  //  now after all that find the min and max again

  lo_lat = 9999999;
  lo_lat_code = '';
  lo_lon = 9999999;
  lo_lon_code = '';
  hi_lat = 0;
  hi_lat_code = '';
  hi_lon = 0;
  hi_lon_code = '';
  for(var i = 0; i< caches.length; i++)
  {
    if (caches[i]._attributes.lat < lo_lat)
    {
      lo_lat = caches[i]._attributes.lat;
      lo_lat_code = caches[i].name[0]._text;
    }
    if (caches[i]._attributes.lat > hi_lat)
    {
      hi_lat = caches[i]._attributes.lat;
      hi_lat_code = caches[i].name[0]._text;
    }

    if (caches[i]._attributes.lon < lo_lon)
    {
      lo_lon = caches[i]._attributes.lon;
      lo_lon_code = caches[i].name[0]._text;
    }
    if (caches[i]._attributes.lon > hi_lon)
    {
      hi_lon = caches[i]._attributes.lon;
      hi_lon_code = caches[i].name[0]._text;
    }
  }
  //  blat them out to the console
  // for(var i = 0; i< caches.length; i++)
  // {
  // console.log(i + '    ' + caches[i]._attributes.lat + ',' + caches[i]._attributes.lon + '  -  ' + caches[i]['groundspeak:cache']['groundspeak:state']._text);
  // }

  console.log ("lat : " + lo_lat_code + "(" + lo_lat + ") to " + hi_lat_code + "(" + hi_lat + ")")
  console.log ("lon : " + lo_lon_code + "(" + lo_lon + ") to " + hi_lon_code + "(" + hi_lon + ")")

  return caches;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};
