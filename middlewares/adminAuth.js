//arquivo autenticacao de admin 
//middlware responsável por bloquear rotas que não foram autenticadas


//middlware está entre a requisiçao e a resposta
function adminAuth(req, res, next) {
//next serve para da contiuidade na requisiçao
    if(req.session.user != undefined) {//se usuario logado
        next();//pode passar para rota
    }else{
        res.redirect("/login")
    }


}


module.exports = adminAuth