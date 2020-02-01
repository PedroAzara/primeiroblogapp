// TESTE Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')

//Configurações
    //Sessão
        app.use(session({
            secret: 'cursodenode',
            resave: true,
            saveUninitialized: true
            
        }))
        app.use(flash())

    //Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })


    //BodyParser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')

    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log('Conectado ao MongoDB!')
        }).catch((err) => {
            console.log(`Ops, não foi possível se conectar ao MongoDB! ${err}`)
        })

    //Public
    app.use(express.static(path.join(__dirname, 'public')))

    app.use((req, res, next) => {
        
        next()
    }) //Middleware


//Rotas
    app.use('/admin', admin)



//Outros
const port = 3333
app.listen(port, () => {
    console.log("Servidor rodando!")
})