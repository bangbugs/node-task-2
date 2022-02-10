const jwt = require('jsonwebtoken');
const expJwt = require('express-jwt');

const Role = {
    Admin: "1",
    User: "0",
    SuperAdmin: "2"
};

const authenticate = (payload) => {
    const { id, role } = payload;
    try {
        const token = jwt.sign(
            {
                id,
                role: role.join()
            },
            process.env.JWT_SECRET || "SAFGDBGNYTHWEFBVBDIVFVBFEIG16679831cvdbASASDAGS" ,
            {expiresIn: 60 * 60}
        );
        return token
    }catch(err){
        throw err
    }
}

const authorize = (roles = []) => {
    if (typeof roles === 'string'){
        roles = [roles];
    }
    return [
        expJwt({ secret: process.env.JWT_SECRET || "SAFGDBGNYTHWEFBVBDIVFVBFEIG16679831cvdbASASDAGS", algorithms: ['HS256']  }),
        (req, res, next) => {
            if(roles.length && !roles.includes(req.user.role)) {
                return res.status(401).json({
                    message: "unauthorized"
                })
            };
            next();
        }
    ];
}

const checkHeaders = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(401).json({
            message: "restricted resource"
        })
    }
    next();
}

const frameQueries = (queries = {}) => {
    let result = {};
    for(let query in queries){
        result[query.toLowerCase()] = queries[query].replace(/["]+/g, '')
    }
    return result
}



module.exports = {
    authenticate,
    authorize,
    checkHeaders,
    Role,
    frameQueries
}