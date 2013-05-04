var kat=require('./providers/kat.js');

kat.getShows(function(err, shows){
	if (err) throw(err);
	console.log(shows);
});