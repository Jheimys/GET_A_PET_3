const { JsonWebTokenError } = require("jsonwebtoken")

const getToken = (req) => {

    const authHeader = req.headers.authorization

    //Observe que no split(' ') tem um espaço, quando damos  esse espaço transformamos
    // em um array quem contém o o Bearer e o token [Bearer, token] como queremos apenas
    // o token colocamos no final [1].
    const token = authHeader.split(' ')[1]
    return token
}

module.exports = getToken