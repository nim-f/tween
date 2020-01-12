const mongoose = require('mongoose');
const { Schema } = mongoose;

const FieldSchema = new Schema({
  type: Number,
  name: String,
  is_required: Boolean,
})
