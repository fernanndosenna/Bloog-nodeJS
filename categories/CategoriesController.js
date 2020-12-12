    //Arquivo onde fica as rotas das categorias//
const express = require('express');
const router = express.Router();
const Category = require("./Category")
const slugify = require('slugify');

router.get("/admin/categories/new", (req,res) =>{//ROTA DE NOVA CATEGORIA
    res.render("admin/categories/new");
});

router.post("/categories/save", (req,res)=>{//salvando dados do formulario de categoria
    var title = req.body.title;
    if(title != undefined){

        Category.create({
            title: title,
            slug: slugify(title) //versao otimizada para url
        }).then(()=>{
            res.redirect("/admin/categories/");
        })


    }else{
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories", (req,res)=>{//listar categorias
    Category.findAll().then(categories=>{
        res.render("admin/categories/index", {categories: categories});
    })

})


router.post("/categories/delete",(req, res)=>{
    var id = req.body.id;
    if( id != undefined ){

        if(!isNaN(id)){ //for um numero

            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })


        }else{//nao for um numero
            res.redirect("/admin/categories")
        }

    }else{// se o id for null
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", (req,res)=>{
    var id = req.params.id;

    if(isNaN(id)){//se o id nao for um numero
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(category =>{
        if (category != undefined){
            res.render("admin/categories/edit",{category: category});
        }else{
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
});

router.post("/categories/update", (req,res) => { //atualizando uma rota
    var id = req.body.id;
    var title = req.body.title;

    Category.update({title: title, slug: slugify(title)},{//slugify atualizando o titulo com base nele
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/categories");
    })
})

module.exports = router; //exportando para linkar no arquivo principal (index.js)









