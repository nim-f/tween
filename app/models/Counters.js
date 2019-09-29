const mongoose = require('mongoose');
const { Schema } = mongoose;

const CountersSchema = new Schema({
  name: String,
  value: Number,
});

mongoose.model('Counters', CountersSchema);
