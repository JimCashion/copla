//  Database table definitions

//  globals including config settngs
var globals = require('../ServerGlobals');  //  configuration options



exports.tables = 
[
	{name: 'users',
	 dirty: true,
	 fields: [{name: 'id',
			   required: false,
			   default: null},

			   {name: 'firstname',
	 		   required: true,
			   default: 'not entered'},

			  {name: 'surname',
	 		   required: false,
			   default: ''},

			  {name: 'nicname',
	 		   required: true,
			   default: ''},

			  {name: 'class',
	 		   required: true,
			   default: 'user'},

			  {name: 'loginname',
	 		   required: true,
			   default: ''},

			  {name: 'password',
	 		   required: true,
			   default: ''},

			  {name: 'panels',
	 		   required: true,
			   default: JSON.parse(JSON.stringify(globals.defaultpanels))},

			  {name: 'dialogTitleColor',
			   required: true,
			   default: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(0, 0, 0, 1)'}},

			  {name: 'dialogPanelColor',
			   required: true,
			   default: {BG: 'rgba(0, 0, 128, 1)', FG: 'rgba(0, 0, 0, 1)'}},

			  {name: 'lastwaypointupload',
			   required: true,
			   default: "Not Uploaded"},

			  {name: 'cachecount',
			   required: true,
			   default: 0},

			  {name: 'waypointid',
			   required: true,
			   default: 0},

			  {name: 'lastticker',
	 		   required: true,
			   default: new Date()}
			 ]
	},
	{name: 'tickers',
	 dirty: true,
	 fields: [{name: 'priority',
	 		   required: true,
	 		   default: null},

			  {name: 'domain',
	 		   required: true,
			   default: 'none'},

			  {name: 'entity',
	 		   required: false,
			   default: 'none'},

			  {name: 'date',
	 		   required: true,
			   default: null},

			  {name: 'text',
	 		   required: true,
			   default: ''},

			  {name: 'id',
			   required: false,
			   default: null}
			  ]
	},
	{name: 'groups',
	 dirty: true,
	 fields: [{name: 'name',
	 		   required: true,
	 		   default: null},
	 		   {name: 'description',

	 		   required: true,
	 		   default: 'Enter the description of this group'},
	 		   {name: 'purpose',

	 		   required: true,
	 		   default: 'Enter the purpose of this group'},

			  {name: 'id',
			   required: false,
			   default: null}
			  ]
	},

	{name: 'usergroups',
	 dirty: true,
	 fields: [ {name: 'userid',
	 		   required: true,
	 		   default: null},

	 		   {name: 'groupid',
	 		   required: true,
	 		   default: null},

			  {name: 'id',
			   required: false,
			   default: null}
			  ]
	},

	{name: 'ideas',
	 dirty: true,
	 fields: [ {name: 'userid',
	 		   required: true,
	 		   default: null},

	 		   {name: 'summary',
	 		   required: true,
	 		   default: 'Enter a short summary of your idea'},

	 		   {name: 'description',
	 		   required: true,
	 		   default: 'Enter a full description of your idea'},

	 		   {name: 'status',
	 		   required: true,
	 		   default: 'Private'},

			   {name: 'friendrating',
	 		   required: true,
	 		   default: '0'},

	 		   {name: 'friendattendance',
	 		   required: true,
	 		   default: '0'},
			  
			  {name: 'dateentered',
	 		   required: true,
			   default: new Date()},

			  {name: 'id',
			   required: false,
			   default: null}
			  ]
	},

	{name: 'ideafriends',
	 dirty: true,
	 fields: [ {name: 'ideaid',
	 		   required: true,
	 		   default: null},

			   {name: 'friendid',
	 		   required: true,
	 		   default: null},

	 		   {name: 'id',
			   required: false,
			   default: null}
			  ]
	},

	{name: 'friends',
	 dirty: true,
	 fields: [ {name: 'userid',
	 		   required: true,
	 		   default: null},

	 		   {name: 'friendid',
	 		   required: true,
	 		   default: null},

	 		   {name: 'id',
			   required: false,
			   default: null}
			  ]
	},

	{name: 'todolist',
	 dirty: true,
	 fields: [ {name: 'userid',
	 		   required: true,
	 		   default: null},

	 		   {name: 'originuserid',
	 		   required: true,
	 		   default: null},

			   {name: 'type',
	 		   required: true,
	 		   default: null},

			   {name: 'status',
	 		   required: true,
	 		   default: 'Outstandng'},

 			   {name: 'dateentered',
	 		   required: true,
			   default: new Date()},

			   {name: 'actiondate',
	 		   required: true,
			   default: new Date()},

	 		   {name: 'id',
			   required: false,
			   default: null}
			  ]
	},

	{name: 'waypoints',
	 dirty: true,
	 fields: [ {name: 'caches',
	 		   required: true,
	 		   default: null},

	 		   {name: 'id',
			   required: false,
			   default: null}
			  ]
	},

	{name: 'mapsegments',
	 dirty: true,
	 fields: [ {name: 'name',
	 		   required: true,
	 		   default: ''},

			   {name: 'lastwaypointupload',
			   required: true,
			   default: "Not Uploaded"},

			  {name: 'cachecount',
			   required: true,
			   default: 0},

			  {name: 'waypointid',
			   required: true,
			   default: 0},

	 		   {name: 'id',
			   required: false,
			   default: null}
			  ]
	}

];


