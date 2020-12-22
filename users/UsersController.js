const express = require('express');
const router = express.Router();
const User = require('./User')
const bcrypt = require('bcryptjs');



router.get("/admin/users", (req, res) => { //listagem de usuarios

    User.findAll().then(users => {
        res.render("admin/users/index", {users: users} );
    })
})

router.get("/admin/users/create", (req, res) => { //rota renderizando o formulario de criar usuario
    res.render("admin/users/create")
});

router.post("/users/create", (req, res) => { //recebendo dados do formulario de criar usuario
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user => { //verificar se o email ja esta cadastrado
        if(user == undefined){

            var salt = bcrypt.genSaltSync(10); //gerar o sal
            var hash = bcrypt.hashSync(password, salt);
            
            User.create({
                email: email,
                password: hash
            }).then(()=>{
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            })

        }else {
            res.redirect("/admin/users/create")
        }
    })


   // res.json({email, password}); //teste para ver se chega os dados ou nao
})

router.get("/login", (req, res) => { //renderizando formu de login
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {//rota recebendo dados do formulario de login
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined) { //se existe um usuário com este email
            //validar senha
            var correct = bcrypt.compareSync(password, user.password);
            
            if(correct) {
                req.session.user = { //logado com sucesso
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            }else{


                res.redirect("/login");
            }


        }else{

            res.redirect("/login");
        
        }

    })

})

router.get("/logout",(req, res) =>{
    req.session.user = undefined;
    res.redirect("/");
})



module.exports = router;









