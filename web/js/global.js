global = {

//  dialog stuff
activeDialog: [],

//  messages
messages: [],
suspendMessages: false,
panelexpandspeed: 50,

//  panel defaults, to be moved to user record at some point

titleHeight: 14,
sidePanelWidth: 150,
topPanelHeight: 150,

//  color control
selectedColor: "",
selectedItem: "",

//  user interface defaults

istyle: {
    font: '18px Arial',
    fill: '#212121',
    fontWeight: 'bold',
    width: 200,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    placeHolder: ''},

//  general system control/session management
systemBotName: 'The Steg',
loggedInUser: {},
userClasses: [{type: "SuperAdmin"}, {type: "Admin"}, {type: "User"}]

}

//  Global variables, just to keep things tidy
var indev = true;

//  some styles
var dialogStyle = { font: "30px Arial", 
		          fill: "#fff", 
		          align: "center", 
		          boundsAlignH: "center", 
		          boundsAlignV: "top", 
		          wordWrap: false};

//  menu stuff
var activemenu = null;

//  panel stuff
var panels = null;
var panelexpandinterval = 2000;



var cpwidth = 150;  // check out if used

var sidewidth = 10; // check out if used
var expandspeed = 4; // check out if used

var VdockedPanelsPerCol = 99;  //  i.e. no max as not implemented yet
var DdockedPanelsPerRow = 99;  //  i.e. no max as not implemented yet
var panelBoarderColor = "rgba(0, 0, 255, 1)";
var titleBoarderColor = "rgba(255, 0, 0, 1)";

var expandedx = 100;
var expandedy = 75;
var expandedw = 600;
var expandedh = 450;  //  Size of data panel

//  Ticker
var pollInterval = 10000; //  10 seconds

// general stuff
var errorstyle = { font: "15px Arial", fill: "#f00", 
		           align: "left", 
		           boundsAlignH: "left", 
		           boundsAlignV: "top", 
		           wordWrap: true, wordWrapWidth: 600 };




//  Options



var menuoptions = [
{text: "My Account", userstypes: [{type: "SuperAdmin"}, {type: "Admin"}, {type: "User"}]},
{text: "Users", userstypes: [{type: "SuperAdmin"}, {type: "Admin"}]},
{text: "Map Segments", userstypes: [{type: "SuperAdmin"}, {type: "Admin"}]},
{text: "Groups", userstypes: [{type: "SuperAdmin"}, {type: "Admin"}]},
{text: "User Groups", userstypes: [{type: "SuperAdmin"}, {type: "Admin"}]},
{text: "Ideas", userstypes: [{type: "SuperAdmin"}, {type: "Admin"}]},
{text: "Map", userstypes: [{type: "SuperAdmin"}, {type: "Admin"}, {type: "User"}]}
];

//  Panel menu options
var panelFunctions =
[
	{
	name: "My hidden items",
	options: [
	         {
			 name: "Restore",
			 menuFunction: function(item) {hiddenPanelsBE.unminimise(item);}
			 },
			 ],
	rebuildContent: function(user) {hiddenPanelsBE.getContent(user);},
	executeOption: function(opt) {for(var i = 0; i< this.options.length; i++)
								  {

									if (this.options[i].name == opt)
									{
										return this.options[i].menuFunction;
									}
								 }}
	},
	{
	name: "My options",
	options: [
	         {
			 name: "Run",
			 menuFunction: function(item) {optionsBE.runOption(item);}
			 },
			 ],
	rebuildContent: function(user) {optionsBE.getContent(user);},
	executeOption: function(opt) {for(var i = 0; i< this.options.length; i++)
								  {

									if (this.options[i].name == opt)
									{
										return this.options[i].menuFunction;
									}
								 }}
	},
	
	{
	name: "My groups",
	options: [
	         {
			 name: "Run",
			 menuFunction: function(item) {userGroupsDLG.displayUserGroup.construct(item);}
			 },
			 ],
	rebuildContent: function(user) {userGroupsBE.getContent(user);},
	executeOption: function(opt) {for(var i = 0; i< this.options.length; i++)
								  {

									if (this.options[i].name == opt)
									{
										return this.options[i].menuFunction;
									}
								 }}
	},
	
	
	{
	name: "My ideas",
	options: [
	         {
			 name: "Display",
			 menuFunction: function(item) {ideasDLG.displayIdea.construct(item);}
			 },
			 {
			 name: "Opinions",
			 menuFunction: function(item) {ideasDLG.getFriendsOpinion.construct(item);}
			 },
			 ],
	rebuildContent: function(user) {ideasBE.getContent(user);},
	executeOption: function(opt) {for(var i = 0; i< this.options.length; i++)
								  {

									if (this.options[i].name == opt)
									{
										return this.options[i].menuFunction;
									}
								 }}
	},
	
	
	{
	name: "My friends",
	options: [
	         {
			 name: "Display",
			 menuFunction: function(item) {usersDLG.myAccount.construct(item);}
			 },
			 ],
	rebuildContent: function(user) {friendsBE.getContent(user);},
	executeOption: function(opt) {for(var i = 0; i< this.options.length; i++)
								  {

									if (this.options[i].name == opt)
									{
										return this.options[i].menuFunction;
									}
								 }}
	}
];

