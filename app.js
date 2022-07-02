const express = require('express')
const app = express()
const port = process.env.PORT 
const mysql = require('mysql')
const bodyParser = require('body-parser')
var acao = 0
var listaUsuraios
var nome=""
var senha=""
var acesso=0
//-- para usar body-parser
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//-- para usar body-parser
//------------conexão com banco de dados 
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"siteNodeJS" 
});

function registraUsuarios(pNome,pSenha) {
//------------grava os dados 
con.connect(function(err) {
  if (err) throw err;
  
  //------------comando sql 
    //var sql = "INSERT INTO usuarios (nome, senha) VALUES ('Jon', 'superman')";
    pNome="'"+pNome+"'"
    pSenha="'"+pSenha+"'"
    var sql = "INSERT INTO usuarios (nome, senha) VALUES "+"("+ pNome+","+pSenha+")";
   
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("foi inserido um úsurio "); 
  });
   //------------comando sql
  console.log("Conectado ao banco de dados");
}); 

}//end registraUsuarios
//------------grava os dados 

//------------------------ acessa os dados 
 

function buscaUsuario(pNome,pSenha) {
con.connect(function(err) {
  if (err) throw err;
  con.query(" SELECT * FROM usuarios", function (err, result, fields) {
    if (err) throw err;
    //console.log(result);
    listaUsuraios=result
   
//---mostra todos os nomes 
    acesso=1
   for (const property in listaUsuraios) {
  console.log( listaUsuraios[property].nome);
  console.log( property);
   
    if(listaUsuraios[property].nome == pNome && listaUsuraios[property].senha == pSenha) {
	 console.log("nome e senha corretos" ); 
	 acesso=2
	  
    }else {
    	
    	if (acesso==1) {
    	console.log("nome ou senha não corretos" );
    	}
    }//fimelse
    console.log("o acesso é igual a: "+acesso);
}
//---mostra todos os nomes 
  });
}); 
return acesso 
}

//------------------------ acessa os dados 

//------------conexão com banco de dados 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html')
  
})

app.post('/rlogin', (req, res) => {
  //res.sendFile(__dirname + '/rlogin.html')
  //res.send('nome:'+req.body.nome+'<br/>'+' senha:'+req.body.senha)
  nome=req.body.nome // vou madar nome e senha como paramentro para a função que verifica 
  senha=req.body.senha// vou madar nome e senha como paramentro para a função que verifica 
  buscaUsuario(nome,senha)
  //espera a função buscaUsuario
  //setTimeout(function() { esperar(); }, 0100);
  function esperar() {
  	if (acesso==2) {
  	console.log("o acesso está com nota"+acesso);
  	res.send(nome+"<br/>"+senha+acesso+"<br/>"+"!!!!!!")
  	}
  	if (acesso==0) {
  	setTimeout(function() { esperar(); }, 0001);
  	}
  	if (acesso==1) {
  	console.log("o acesso está com nota"+acesso);
  	res.send("não cadastrado")
  	}
   }
   esperar() 
  //espera a função buscaUsuario
  
})

app.get('/cadastro', (req, res) => {
  res.sendFile(__dirname + '/cadastro.html')
})
// aqui vai ficar a página pos cadastro 
app.post('/rCadastro', (req, res) => {
  res.sendFile(__dirname + '/rCadastro.html')
  res.send('nome:'+req.body.cNome +'<br/>'+' senha:'+req.body.cSenha)
  nome=req.body.cNome// vou madar nome e senha como paramentro para a função que verifica 
  senha=req.body.cSenha// vou madar nome e senha como paramentro para a função que verifica 
  console.log(nome)
  registraUsuarios(nome,senha)
  
})
// aqui vai ficar a página pos cadastro
//app.listen(port || 3000,()=>{console.log(`Example app listening on port')})
app.listen(port || 3000, () => {
  console.log(`servidor rodando`)
})
