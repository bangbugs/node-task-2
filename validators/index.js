const organizationValidator = (req, res, next) => {
    if(!req.body){
        return res.status(500).json({
            message: "insufficient data"
        });
    }
    try {
        const { organizationName } = req.body;
        if(!organizationName){
            return res.status(500).json({
                message: "insufficient data"
            });
        }
        next();
    }catch(err){
        console.error(err)
        return res.status(500).json({
            message: "insufficient data"
        });
    }
}

const departmentValidator = (req, res, next) => {
    if(!req.body){
        return res.status(500).json({
            message: "insufficient data"
        });
    }
    try {
        const { organizationName, department } = req.body;
        if(!organizationName || !department){
            return res.status(500).json({
                message: "insufficient data"
            });
        }
        next();
    }catch(err){
        console.error(err)
        return res.status(500).json({
            message: "insufficient data"
        });
    }
}

const employeeValidator = (req, res, next) => {
    if(!req.body){
        return res.status(500).json({
            message: "insufficient data"
        });
    }
    try {
        const { organizationName, department, employee } = req.body;
        if(!organizationName || !department || !employee){
            return res.status(500).json({
                message: "insufficient data"
            });
        }
        next();
    }catch(err){
        console.error(err)
        return res.status(500).json({
            message: "insufficient data"
        });
    }
}

module.exports = {
    organizationValidator,
    employeeValidator,
    departmentValidator
}