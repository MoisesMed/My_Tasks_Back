const router = require('express').Router()
const Task = require('../models/Task')
const MiddleAuth = require("../middlewares/authentication");
router.use(MiddleAuth)

router.post('/create', async (req, res) => {
    const {
        title,
        status,
        description,
        due_date
    } = req.body

    if (!title) {
        res.status(422).json({ error: "Título é obrigatório" })
        return
    }

    if (!status) {
        res.status(422).json({ error: "Escolha o status da tarefa !" })
        return
    }
    
    const task = { id_user: req.user_id, title, status, description, due_date }

    try {
        await Task.create(task)
        res.status(201).json({ message: "Tarefa criada com sucesso !!!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }

})

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({id_user:req.user_id})
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router