const mongoose = require('mongoose');
const { Schema } = mongoose;

const FieldSchema = new Schema({
  type: Number,
  name: String,
  value: String,
  is_required: Boolean,
})

const EventSchema = new Schema({
  title: {
    value: String,
    updated_by: String,
  },
  subtitle: {
    value: String,
    updated_by: String,
  },
  description: {
    value: String,
    updated_by: String,
  },
  start: {
    value: String,
    updated_by: String,
  },
  end: {
    value: String,
    updated_by: String,
  },
  venue: {
    value: String,
    updated_by: String,
  },
  lpLink: {
    value: String,
    updated_by: String,
  },
  surveyLink: {
    value: String,
    updated_by: String,
  },
  color: {
    value: String,
    updated_by: String,
  },
  customFields: [{
    category: Number,
    name: String,
    value: String,
  }],
  managerId: {
    value: Number,
    updated_by: String,
  },
  teamIds: Array,
  id: Number,
  createdAt: { type : Date},
  updatedAt: { type : Date },
});
mongoose.model('Events', EventSchema);
