const mongoose = require('mongoose');

const { Schema } = mongoose;

const entry = new Schema({
    page: Number,
    questions: Array,
    
})

const workflow = mongoose.model('Workflow', entry);

module.exports = workflow;
