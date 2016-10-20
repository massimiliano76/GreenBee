var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sensoreSchema = new Schema({
	'id_ble': { type: String, required: true },
	'reachable': { type: String, enum: ['yes', 'no'] },
	'temperature': Number,
	'humidity_gnd': Number,
	'battery_lvl': Number,
	'humidity_air': Number,
	'ph': Number
});

module.exports = mongoose.model('sensore', sensoreSchema);
