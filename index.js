require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const Middleauth = require('./middlewares/authentication')
const app = express()

// app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({extended: true, }),)


// Models
const User = require('./models/User')

// ROTAS DA API //
app.use('/auth', authRoutes)

// TESTANDO A API
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Api está funcionando" })
})

// TESTANDO A PRIVATE ROUTE
app.get("/user/:id", Middleauth, async (req, res) => {
    const id = req.params.id

    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" })
    }
    res.status(200).json({ user })
})

// CONEXÃO DO BANCO

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@kanbancluster.yfz5p.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000)
        console.log("Deu certo conectar ao banco")
    }).catch((error) => console.log(error))

app.listen(3001)