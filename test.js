var kat=require('./providers/kat.js');

kat.list(function(err, shows){
	if (err) throw(err);
	console.log(shows);
});