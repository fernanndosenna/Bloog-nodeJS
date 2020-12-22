    //Arquivo onde fica as rotas dos artigos//
    const express = require('express');
    const router = express.Router();
    const Category = require('../categories/Category')
    const Article = require("./Article")
    const slugify = require("slugify")
    const adminAuth = require("../middlewares/adminAuth") //colocar em rotas que precisar de autenticacao

    
    router.get("/admin/articles",adminAuth, (req,res) => { //rota listando os artigos
        Article.findAll({
            include: [{model: Category}] //funciona como um "join", "sequelize inclua  na busca de artigos, os dados do tipo categoty"
        }).then(articles => {
            res.render("admin/articles/index",{articles: articles})
        })
    })
    
    router.get("/admin/articles/new",adminAuth, (req, res) => {//rota de criar um novo artigo
        Category.findAll().then(categories => {
            res.render("admin/articles/new", { categories: categories})
        })

    })

    router.post("/articles/save",adminAuth, (req,res) => { //rota para salvar dados do formulari ode artigo
        var title = req.body.title;
        var body = req.body.body;
        var category = req.body.category;

        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category // campo gerado por relacionamento (chave estrangeira)

        }).then(() => {
            res.redirect("/admin/articles")
        })

    })
    
    router.post("/articles/delete",adminAuth, (req,res) => {
        var id = req.body.id;
        if (id != undefined){
            if(!isNaN(id)){
                Article.destroy({
                    where: {
                        id: id
                    }
                }).then(() => {
                    res.redirect('/admin/articles');
                })
            }else{ // não for um numero
                res.redirect("/admin/articles");
            }

        }else{ // NULL
            res.redirect("/admin/articles")
        }
    })

router.get("/admin/articles/edit/:id", adminAuth,(req, res) => {
    var id = req.params.id;

    Article.findByPk(id).then(article => {
       
        if(article != undefined) {
            
            Category.findAll().then(categories => {

                res.render("admin/articles/edit", {
                    article: article,
                    categories: categories
                
                });

            })

        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})

router.post("/articles/update",adminAuth, (req,res) => { //essa rota irá atualizar os dados da ediçao no banco de dados
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.update({title: title, body: body, categoryId: category, slug:slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect('/')
    })

})

//Lógica de Paginação em NodeJS

//requesitos para acompanhar este passo a passo é, ter uma noção de nodeJS, e lógica de programação.

//Primeiramente vamos criar uma rota que vai receber como parametro o numero da página
router.get("/articles/page/:num", (req,res) => {
        var page = req.params.num //logo em seguida iremos criar uma variavel que vai receber o parametro passado acima
        var offset = 0;

        
        if (isNaN(page) || page == 1){ // se nao for um numero ou for igual a 1, o offset será 0
            offset = 0; //pq 0 ? pq quer exibir a partir do primeiro elemento
        }else{
            offset = (parseInt(page) - 1 ) * 4; //se tiver tudo certo, o offset será o valor da pagina passado no parametro, parseInt porque o valor que vem no parametro é uma string
            //e depois o calculo vai ser a pagina passada nos parametros multiplicado pela quantidade de elementos na pagina,

        }

    /*
        1 = 0 //quandi digitar 1, o offset será 0, pq quero demonstrar a partir do 1 artigo
        2 = 4 // quando digitar 2, o offset será 4, pq quero mostrar a partir do 4 artigo
        3 = 8
        4 = 12

        1 = 0 = 3 //depois será mostrado do artigo 0 À o artigo 3
        2 = 4  = 7
        3 = 8 = 11
        4 = 12 = 15
        5 = 16 = 19                
*/

    //o numero passado no parametro será multiplicado por 4, porque é a quantidade de artigos que queira exibir
        Article.findAndCountAll({

            limit: 4, //irá trazer uma resposta de 4 elementos apenas
            offset: offset, //irá retornar dados apartir de um valor, exemplo, "só quero  os elementos a partir do 10 artigo"
            order: [
                ["id", "DESC"]
            ]

        }).then(articles => { //ira pesquisar todos os elementos no banco de dados, e além disso, a quantidade desses elementos
           
           //logica, se existe uma proxima pagina ou nao
            var next;
            if(offset + 4 >= articles.count){//somar com a quantidade de elemntos da pagina, for maior que //a contagem total de artigos
                next = false //nao existe outra pagina para ser exibida
            } else{
                next = true;
            }


           var result = { //resultado final da paginacao
               page: parseInt(page),
               next: next,
               articles : articles
           }
           
           Category.findAll().then(categories => {
                res.render("admin/articles/page", {result: result, categories: categories});
           });
           
        })


})







module.exports = router; //exportando para linkar no arquivo principal (index.js)

















