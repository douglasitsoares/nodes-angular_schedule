const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  service: { type: String, required: true } ,
  details: { type: String, required: false },
  //date: { type: Date, required: false },
  hour: { type: String, required: false },
  imagePath: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}
});

//scheduleSchema.index({ service: 1, details: 1 });

module.exports = mongoose.model("Schedule", scheduleSchema);

