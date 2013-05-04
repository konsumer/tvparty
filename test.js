var kat=require('./providers/kat.js');

kat.list(function(shows){
	console.log(shows);
});