    //Arquivo onde fica as rotas dos artigos//
    const express = require('express');
    const router = express.Router();
    const Category = require('../categories/Category')
    const Article = require("./Article")
    const slugify = require("slugify")
    
    router.get("/admin/articles", (req,res) => { //rota listando os artigos
        Article.findAll({
            include: [{model: Category}] //funciona como um "join", "sequelize inclua  na busca de artigos, os dados do tipo categoty"
        }).then(articles => {
            res.render("admin/articles/index",{articles: articles})
        })
    })
    
    router.get("/admin/articles/new", (req, res) => {//rota de criar um novo artigo
        Category.findAll().then(categories => {
            res.render("admin/articles/new", { categories: categories})
        })

    })

    router.post("/articles/save", (req,res) => { //rota para salvar dados do formulari ode artigo
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
    
    router.post("/articles/delete", (req,res) => {
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



    router.post("/articles/update", (req,res) => { //atualizando uma rota
        var id = req.body.id;
        var title = req.body.title;
        var body = req.body.body;
    

        Article.update({title: title,body: body, slug: slugify(title)},{//slugify atualizando o titulo com base nele
            where: {id: id}
        }).then(() => {
            res.redirect("/admin/articles");
        })

    })


module.exports = router; //exportando para linkar no arquivo principal (index.js)
