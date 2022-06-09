const mongoose = require('mongoose')

const Task = mongoose.model('Task',{
    id_user:String,
    title:String,
    status: {type: Number,enum:[1,2,3]},
    description: String,
    due_date: String
})

module.exports = Task