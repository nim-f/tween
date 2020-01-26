const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttendeeSchema = new Schema({
  id: Number,
  email: String,
  first_name: String,
  last_name: String,
  invited: Boolean,
  registered: Boolean,
  type: String,
  title: String,
  event: Number
});

mongoose.model('Attendees', AttendeeSchema);
