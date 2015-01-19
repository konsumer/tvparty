/*

Data-provider for eztv torrents

 */

var moment = require('moment'),
	events = require('events');

/**
 * Get list of shows
*/
exports.all = function(){
	var emitter = new events.EventEmitter();
	return emitter;
};

/**
 * Get episode listings for a single show
 * 
 * @param  {String}   id       The ID from list()
 */
exports.show = function(id){
	var emitter = new events.EventEmitter();
	return emitter;
};

/**
 * Get list of torrents for an episode
 * 
 * @param  {String}   id       The ID from show()
 */
exports.torrents = function(id){
	var emitter = new events.EventEmitter();
	return emitter;
};

/**
 * Find "best" torrent, from a list of available torrents for a show
 *
 * Criteria for "best" is smallest file w/ seeds
 * 
 * @param   {Array}   torrents list of torrents available for a show
 * @returns {Object}  the "best" torrent
 */
exports.best = function(torrents){

};