const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  customFields: Array,
  managerId: Number,
  teamIds: Array,
  id: Number,
});
mongoose.model('Events', EventSchema);
