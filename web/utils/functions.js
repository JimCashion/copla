//  General functions
//  object specific functions are included in their class file

var messageJSON = function(obj)
{
	alert(JSON.stringify(obj));
};

function shortentextbypixel(phasertext, maxpixel){
  for(var i = 0; phasertext.width > maxpixel; i++){
    phasertext.text = phasertext.text.substring(0, phasertext.text.length - 1);
  }

};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ",1)";


    // return result ? {
    //     r: parseInt(result[1], 16),
    //     g: parseInt(result[2], 16),
    //     b: parseInt(result[3], 16)
    // } : null;
};

 function RGBtoHex(color) {
	//rgba(0, 0, 255, 1) receives
		
 	var hexa = color.split(",");

    return Number(hexa[0].split("(")[1]).toString(16).padStart(2,"0") + Number(hexa[1]).toString(16).padStart(2,"0") + Number(hexa[2]).toString(16).padStart(2,"0");

};

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

function removeListItem( sel1, inp1)
{
 len1 = sel1.options.length;
 for (i=0;i<len1 ;i++ )
 {
  if (sel1.options[i].value == inp1.value)
  {
   sel1.options[i] = null;
    //or
  //sel1.remove(i);
    break;
  }
 }
}





function getNoContent(panel)
{

	panel.clearContent();
	panel.content.push({text: "(No Content)"});
	panel.insertContent();
};


