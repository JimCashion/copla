var globals = require('../ServerGlobals');  //  configuration options
var db = require('.' + globals.config.db_location + '/db');  //  database tables and functions

//  Set up Users BE web service requests
exports.web_requests = function() {
  console.log('setting up User web request handlers....');
	
  console.log('    ' + 'List Users - retired?');
  globals.app.get('/listUsers', function (req, res) {
   		
      console.log( 'Starting ListUsers' ); 
      result = {ok: false, data: ''};

      try
      {
        result.ok = true;
        result.data = db.Table('users').users;
       
      }
      catch(e)
      {
         result.data = e.message;
      }
      finally
      {
        res.end( JSON.stringify(result) );
        console.log( 'Ending ListUsers, Success=' + result.ok);
      }
  	})

	console.log('    ' + 'Add Users - retired?');
	globals.app.post('/addUser', function (req, res) {
		    console.log( 'Starting AddUser');
   		  result = {ok: false, data: ''};

      try
      {
        //  get the user from the URL
        var q = globals.url.parse(req.url, true);
   	    var u = JSON.parse(q.query.user);
        
        //  get a new id

		    var newid = 0;
        for(var i = 0; i< db.Table('users').users.length;i++)
        {
       	 	if (db.Table('users').users[i].id > newid)
       	 		newid = db.Table('users').users[i].id;
        }
        u.id = newid + 1;

        //  add the user
        db.Table('users').users.push(u);
        
        result.ok = true;
        result.data = 'User with id ' + u.id + " was successfully created.";

        //  write an after image only for the created user
        globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'CRT' + globals.config.journal_delimiter + "users" + globals.config.journal_delimiter + "A" + globals.config.journal_delimiter + JSON.stringify(u) + globals.config.journal_newline);
      }
      catch(e)
      {
         result.data = e.message;
      }
      finally
      {
        res.end( JSON.stringify(result) );
        console.log( 'Ending addUsers, Success=' + result.ok);
      }
    })

	    
	console.log('    ' + 'Get User - retired (use list)');
	globals.app.get('/getUser', function (req, res) {
		  console.log('Starting Getuser ');
      var result = {ok: false, data: ''};

      try
      {

       	var q = globals.url.parse(req.url, true);
       	var uid = JSON.parse(q.query.uid);
        console.log( 'Getting user ' + uid);

        //  find the user
     	  var user = null;
        for(var i = 0; i<db.Table('users').users.length;i++)
        {

         	if (db.Table('users').users[i].id == uid)
       	 	{
             user = db.Table('users').users[i];
             break;
       		}
        }

        if (user != null)
        {
          result.ok = true;
          result.data = user;

          //  write a before image only for the created user
          globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'DEL' + globals.config.journal_delimiter + "users" + globals.config.journal_delimiter + "B" + globals.config.journal_delimiter + JSON.stringify(user) + globals.config.journal_newline);
        }
        else
        {
            result.data = 'User with id ' + uid + " was not found.";
           
        }

		  }
      catch(e)
      {
         result.data = e.message;
      }
      finally
      {

        res.end( JSON.stringify(result) );
        console.log( 'Ending addUsers, Success=' + result.ok);
      }
    })

	console.log('    ' + 'Delete User  - retired');
	globals.app.delete('/deleteUser', function (req, res) {
		    console.log('Starting DeleteUser ');
       
        result = {ok: false, data: ''};

        try
        {
          var q = globals.url.parse(req.url, true);
     	    var uid = JSON.parse(q.query.uid);
          console.log( 'deleting user ' + uid);

          //  find the user and delete
          var l = db.Table('users').users.length;
          var user = null;
          for(var i = 0; i<l;i++)
          {
           
            user = db.Table('users').users[0];
            db.Table('users').users.shift();
            if (user.id == uid)
            {
              break;
            } 
            else
            {
              db.Table('users').users.push(user);
              user = null;
            }
          }
          
          if (user != null)
          {
            result.ok = true;
            result.data = 'User with id ' + uid + " was successfully deleted.";

            //  write a before image only for the created user
            globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'DEL' + globals.config.journal_delimiter + "users" + globals.config.journal_delimiter + "B" + globals.config.journal_delimiter + JSON.stringify(user) + globals.config.journal_newline);
          }
          else
          {
              result.data = 'User with id ' + uid + " was not found.";
             
          }

          
        }
        catch(e)
        {
           result.data = e.message;
        }
        finally
        {
          res.end( JSON.stringify(result) );
          console.log('Ending deleteUser, Success=' + result.ok);
        }
  })

  console.log('    ' + 'Update User - retired');
  globals.app.put('/updateUser', function (req, res) {
        console.log('Starting UpdateUser ');
         result = {ok: false, data: ''};

        try
        {
          //  get the user from the URL
          var q = globals.url.parse(req.url, true);
          var u = JSON.parse(q.query.user);
          
          console.log( 'updating user ' + u.id);

          //  find the user and delete
          var l = db.Table('users').users.length;
          var user = null;
          for(var i = 0; i<l;i++)
          {
           
            user = db.Table('users').users[0];
            db.Table('users').users.shift();
            if (user.id == u.id)
            {
              break;
            } 
            else
            {
              db.Table('users').users.push(user);
              user = null;
            }
          }
           
          if (user != null)
          {
            //  now add the new user back
            db.Table('users').users.push(u);
            result.ok = true;
            result.data = 'User with id ' + user.id + " was successfully updated.";

            //  write a before and after images for the updated user
            globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'UPD' + globals.config.journal_delimiter + "users" + globals.config.journal_delimiter + "B" + globals.config.journal_delimiter + JSON.stringify(user) + globals.config.journal_newline);
            globals.fs.appendFileSync(globals.config.db_journal_location + "/" + "receiver.json", 'UPD' + globals.config.journal_delimiter + "users" + globals.config.journal_delimiter + "A" + globals.config.journal_delimiter + JSON.stringify(u) + globals.config.journal_newline);
          }
          else
          {
              //  could not update user!  What ot do??
              result.data = 'User with id ' + u.id + " was not found.";
          }
        }   
        catch(e)
        {
           result.data = e.message;
        }
        finally
        {
          res.end( JSON.stringify(result) );
          console.log('Ending updateUser, Success=' + result.ok);
        }
        
  })

	console.log('Users Web request handler setup is complete!');

}

