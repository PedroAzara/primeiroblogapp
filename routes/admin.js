const express = require('express')
const router = express.Router() //Para chamar o express
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de posts')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date:'desc'}).then((categorias) => {



        for(let cat in categorias){

            categorias[cat].dateFormatted = formatarData(categorias[cat].date);

        }

        res.render('admin/categorias', {categorias: categorias})


    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias' + err)
        res.redirect('/admin')
    })

})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
        erros.push({texto: 'Nome inválido!'})
    }


    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ){
        erros.push({texto: 'Slug inválido!'})
    }

    if(req.body.nome.length <= 3){
        erros.push({texto: "O nome da categoria é muito pequeno!"})
    }

    if(erros.length > 0 ){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        } //Isso aqui pega os dados preenchidos durante o cadastro de uma nova categoria

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente!')
            res.redirect('/admin')
        })

    }






})

router.get('/categorias/edit/:id', (req, res) =>{
    Categoria.findOne({_id:req.params.id})
        .then((categoria) =>{
            res.render('admin/editcategorias', {categoria: categoria})
        }).catch((err)=>{
        req.flash('error_msg', 'Esta categoria não existe!' + err)
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', `Houve um erro interno ao salvar a edição da categoria, tente novamente! ${err}`)
            res.redirect('/admin/categorias')
        })

    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao editar a categoria' + err)
        res.redirect('/admin/categorias')
    })
})


router.post('/categorias/deletar', (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash('success_msg', `Categoria deletada com sucesso!`)
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', `Houve um erro ao deletar a categoria! ${err}`)
        res.redirect('/admin/categorias')
    })
})




function formatarData(date){
    var data = date,
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear(),
        hora = data.getHours().toString()
        minutos = data.getMinutes().toString()
        segundos = data.getSeconds().toString()
    return diaF+"/"+mesF+"/"+anoF+" - Às " + hora + ':' + minutos + ":" + segundos  ;
}

router.get('/postagens', (req, res)=>{
    res.render('admin/postagens')

})

router.get('/postagens/add', (req, res)=>{
    Categoria.find().then((categorias)=>{
        res.render('admin/addpostagem', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulário!' + err)
    })
    

})

router.post('/postagens/nova', (req, res)=>{
    
})

module.exports = router