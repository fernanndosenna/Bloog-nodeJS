            //ARQUIVO PRINCIPAL//
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database") //conexão banco

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")

const Article = require("./articles/Article");
const Category = require("./categories/Category");

             //CONFIGURAÇOES//
//template ejs
app.set("view engine","ejs");

//express para arquivos estaticos
app.use(express.static('public'));


//Body parser para pegar dados do formulario
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// configuracao da conexao com o banco de dados
connection
        .authenticate()
        .then(() => {
            console.log("COnexao feita com sucesso")
        }).catch((error) => {
            console.log(error)
        })


//importando rotas dos controllers
app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req,res) => { //rendeizando a homepage, e os artigos nela
    Article.findAll({
        order: [
            ["id", "DESC"]
        ]
    }).then(articles => {

        Category.findAll().then(categories => { //passando as categories para a view principal para mostrar elas dinamicamente
            res.render("index", {articles: articles, categories: categories});

        })
    })

})

app.get("/:slug", (req, res) => { //rota procura artigo, e passando o article
//para exibir todo conteudo do arquivo
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }        
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => { //passando as categories para a view principal para mostrar elas dinamicamente
                res.render("article", {article: article, categories: categories});
    
            })        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");;
    })
})

app.get("/category/:slug",(req, res) => { //pesquisando por um slug de uma categoria
    var slug = req.params.slug;
    Category.findOne({      //essa rota está ligando os artigos que pertencem a uma determinada categoria
        where: {
            slug: slug
        },
        include: [{model: Article}] //ei sequelize, incluua todos os artigos que fazem parte dessa categoria (join)
    }).then( category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            })
        }else{
            res.redirect("/")
        }

    }).catch(err => { //se ouver algum erro durante a pesquisa
        res.redirect("/");
    })
})



app.listen(8080,()=>{
    console.log("Servidor rodando na porta 8080")
})







