const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório!" })
    }

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" })
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" })
    }

    if (!confirmpassword) {
        return res.status(422).json({ msg: "A confirmação de senha é obrigatória!" })
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: "As senhas não são iguais!" })
    }

    const userExist = await User.findOne({ email: email })

    if (userExist) {
        return res.status(422).json({ msg: "Email já está em uso!" })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        await user.save()
        res.status(201).json({ msg: "Usuário criado com sucesso!" })
    } catch (err) {
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório!" })
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" })
    }

    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(404).json({ msg: "Usuário não existe!" })
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(404).json({ msg: "Senha inválida!" })
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        }, secret)
        res.status(200).json({ msg: "Autenticação realizada com sucesso", token })
    } catch (err) {
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde" })
    }

})

module.exports = router