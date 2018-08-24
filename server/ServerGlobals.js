//  Server Globals

var express = require('express');

exports.express = require('express');
exports.app = express();
exports.fs = require("fs");
exports.url = require('url');
exports.cors = require('cors');

//  Configuration Options
exports.config = require('./ServerConfig'); 

exports.functions = require('./functions');

exports.connectedclients = [];

exports.defaultpanels = [
{
name: "Menu", 
order: 0, 
adjustToContent: 'stretch',
manifest: 'menu', 
x: 0, 
y: 0, 
width: 100, 
height: 100, 
contentBuilder: function(opt) {getNoContent();}, 
titleColor: {BG: 'rgba(130, 101, 94, 1)', FG: 'rgba(0, 0, 0, 1)'}, 
panelColor: {BG: 'rgba(130, 101, 94, 1)', FG: 'rgba(0, 255, 0, 1)'}, 
hoverColor: {BG: 'rgba(130, 101, 94, 1)', FG: 'rgba(0, 0, 255, 1)'} 
},
{
name: "My friends", 
order: 1, 
adjustToContent: 'scrollbar',
manifest: 'float', 
x: 520, 
y: 390, 
width: 200, 
height: 150, 
contentBuilder: function(opt) {getNoContent();}, 
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
hoverColor: {BG: "rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My options", 
corder: 2, 
adjustToContent: 'stretch',  // could also be 'scrollbar' or false!! 
manifest: 'float', 
x: 300, 
y: 390, 
width: 200, 
height: 150, 
contentBuilder: function(opt) {optionsBE.getContent(global.loggedInUser);},
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 0, 0, 1, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My upcoming events", 
order: 3, 
adjustToContent: 'scrollbar',
manifest: 'float', 
x: 80, 
y: 390, 
width: 200, 
height: 150, 
contentBuilder: function(opt) {getNoContent();},
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My groups",
order: 4, 
adjustToContent: 'scrollbar', 
manifest: 'float', 
x: 520, 
y: 220, 
width: 200, 
height: 150, 
contentBuilder: function(opt) {userGroupsBE.getContent(global.loggedInUser)}, 
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My ideas", 
order: 5, 
adjustToContent: 'scrollbar', 
manifest: 'float', 
x: 300, 
y: 220, 
width: 200, 
height: 150, 
contentBuilder: function(opt) {getNoContent();}, 
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My to do list", 
order: 6, 
adjustToContent: 'scrollbar', 
manifest: 'float', 
x: 80, 
y: 220, 
width: 200, 
height: 150, 
contentBuilder: function(opt) {getNoContent();}, 
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My calendar", 
order: 7, 
adjustToContent: 'scrollbar', 
manifest: 'float', 
x: 520, 
y: 50, 
width: 200, 
height: 150, 
contentBuilder: function(opt) {getNoContent();}, 
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My planned events", 
order: 8, 
adjustToContent: 'scrollbar', 
manifest: 'float', 
x: 300, 
y: 50, 
width: 200, 
height: 150, 
contentBuilder: function(opt) {getNoContent();}, 
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My ticker", 
order: 9, 
adjustToContent: 'scrollbar', 
manifest: 'float', 
x: 80, 
y: 50, 
width: 150, 
height: 150, 
contentBuilder: function(opt) {getNoContent();}, 
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
},
{
name: "My hidden items", 
order: 10, 
adjustToContent: 'stretch', 
manifest: "dropdown", 
x: 0,
y: 14, 
width: 150, 
height: 14, 
contentBuilder: function(opt) {getNoContent();}, 
titleColor: {BG: 'rgba(0, 0, 255, 1)', FG: 'rgba(255, 255, 255, 1)'}, 
panelColor: {BG: 'rgba(0, 200, 255, 1)', FG: 'rgba(0, 0, 0, 1)'}, 
hoverColor: {BG:"rgba(255, 255, 255, 1)",FG:"rgba(255, 0, 0, 1)"}
}
];