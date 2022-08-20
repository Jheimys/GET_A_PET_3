# 1.Iniciando o Projeto

- Instalando o Packge.json

```js
                npm init -y
```

- **Pacotes instalados p/ execução do projeto**

```js
 "bcrypt": "^5.0.1", ---> Algo. de senha
 "cookie-parser": "^1.4.6", -->  middlewares de terceiros para incluir funcionalidades aos aplicativos do Express
 "cors": "^2.8.5", --> integração do front com back
 "express": "^4.18.1", ---> Framework p/ aplicativo web do node.js
 "jsonwebtoken": "^8.5.1", --> Metodo de altenticação
 "mongoose": "^6.4.3", --> P/ trabalhar com MongoDB
 "multer": "^1.4.5-lts.1", --> upload de fotos
 "nodemon": "^2.0.19" --> atualiza o backend quando salvamos o arquivo
```

- **Criação das pastas básicas**
  **(i)** MVC
  **(ii)** db
  **(iii)** helpers
  **(iv)** public
  **(v)** rotas

### Iniciando o index.js

- **Criando um servidor: "doc do express"**

https://expressjs.com/pt-br/starter/hello-world.html

- **Entregando arquivos estáticos no Express**

Para entregar arquivos estáticos como imagens, arquivos CSS, e arquivos JavaScript, use a função de middleware express.static integrada no Express.

```js
app.use(express.static("public"));
```

- **CORS**
  Compartilhamento de recursos entre origens (CORS)

```js
const cors = require("cors");
//Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
```

- **_express.json()_**

Esta é uma função de middleware integrada no Express. Ele analisa as solicitações recebidas com cargas JSON e é baseado em body-parser .

# 2. Conexão com BD

```js
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/getapet");
  console.log("Conectou ao Mongoose!");
}

main().catch((err) => console.log(err));

module.exports = mongoose;
```

# 3. Criando o modelo (Schema)

Dcumentação: https://mongoosejs.com/docs/guide.html

# 4.Rotas

- Importar rota e controller.

```js
const router = require("express").Router();
const UserController = require("../controllers/UserController");
```

- Criando a rota

```js
router.verbohttp('/' Usercontroller.função)
```

- Exportar a router

```js
module.exports = router;
```

# 5. Controllers

- importar o model
- sintaxe:

```js
module.exports = class UserController {
  staic async função(req, res){

  }
}
```

# 6.Gerando uma senha:

```js
const bcrypt = require("bcrypt");

//create a password
const salt = await bcrypt.genSalt(12);
const passwordHash = await bcrypt.hash(password, salt);
```

# 7.Criando token

```js
const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  //create token
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },

    "nossosecret"
  );

  //return token
  res.status(200).json({
    message: "Você está altenticado",
    token: token,
    userId: user._id,
  });
};

module.exports = createUserToken;
```

# 8.Função login (Método post)

### Validações:

- Verificar se o email foi digitado.
- verificar se a senha foi digitada.
- Verificar se o email já existe.
- verificar se a senha cadastrada é igual a digitada.

Estudar a aula 247
