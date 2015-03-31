var mongoose = require('mongoose');

module.exports = function(connection){
	
	var Schema = mongoose.Schema;

	var regimenSchema = new Schema({
		name : { type: String, required :true },
		medicationlist : {
			type: Array
		},
		created_at: Date,
        updated_at: Date 
	})

	// on every save, add the date
	regimenSchema.pre('save', function(next) {
	  // get the current date
	  var currentDate = new Date();
	  
	  // change the updated_at field to current date
	  this.updated_at = currentDate;

	  // if created_at doesn't exist, add to that field
	  if (!this.created_at)
	    this.created_at = currentDate;

	  next();
	});

   var Regimen = connection.model('Regimen', regimenSchema);

   return Regimen;

}