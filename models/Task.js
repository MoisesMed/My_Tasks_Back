const mongoose = require('mongoose')

const Task = mongoose.model('Task',{
    id_user:String,
    title:String,
    status: Number,
    description: String,
    due_date: String
})

module.exports = Task