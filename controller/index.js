const Organization = require('../models/organization');
const Department = require('../models/departments');
const Employee = require('../models/employees');
const User = require('../models/user');

const { authenticate } = require('../helpers')

const checkOrganizationExists = async (organizationName) => {
    const isOrganizationExists = await Organization.findOne({name: organizationName});
    if(!isOrganizationExists){
        return {status: false, data: {}}
    };
    return {status: true, data: isOrganizationExists}
}

const createOrganization = async (req, res) => {
    const { organizationName } = req.body;
    console.log('-------------------'+organizationName)
    const isOrganizationExists = await checkOrganizationExists(organizationName)
    if(isOrganizationExists["status"]){
       return res.status(502).json({
            message: "Organization already exists"
        })
    }
    let organization = new Organization({name: organizationName});
    console.log('----------------------' + organization)
    organization.save(function(err){
        if(err){
            console.error(err);
            return res.status(504).json({
                message: "internal server error"
            })
        }
        return res.status(200).json({
            message: "organization created succesfully"
        })
    });
};

const createDepartment = async (req, res) => {
    let { organizationName, department } = req.body;
    const isOrganizationExists = await checkOrganizationExists(organizationName);
    if(!isOrganizationExists["status"]){
        return res.status(502).json({
            message: "Organization not exists"
        })
    }
    if(typeof department === 'string'){
        department = [department]
    }
    const organization = isOrganizationExists["data"];
    for(let dep of department){
        const isDepartmentExists = await Department.findOne({name: dep, organization: organization["_id"]})
        if(!isDepartmentExists){
            const newDepartment = await new Department({name: dep, organization: organization._id, employees: []})
            newDepartment.save(function(err){
                if(err){
                    console.error(err);
                    return res.status(504).json({
                        message: "internal server error"
                    })
                }
            })
        }else{
            return res.status(502).json({
                message: `Department ${dep}  already exists`
            })
        }
    }
    return res.status(200).json({
        message: "department created succesfully"
    })
};

const createEmployess = async (req, res) => {
    let { organizationName, department, employee } = req.body;
    const isOrganizationExists = await checkOrganizationExists(organizationName);
    if(!isOrganizationExists["status"]){
        return res.status(502).json({
            message: "Organization not exists"
        })
    }
    const organization = isOrganizationExists["data"];
    const isDepartmentExists = await Department.findOne({name: department, organization: organization["_id"]});
    if(!isDepartmentExists){
        return res.status(502).json({
            message: "Department not exists"
        })
    }

    if(typeof employee === 'object' && !Array.isArray(employee)){
        employee = [employee]
    }
    for(let emp of employee){
        console.log(emp)
        const newEmployee = await new Employee({...emp, department: isDepartmentExists._id, organization: organization._id})
        newEmployee.save(function(err){
            if(err){
                console.error(err);
                return res.status(504).json({
                    message: "internal server error"
                })
            }
        });
    }
    return res.status(200).json({
        message: "employee created succesfully"
    })
}

const getAllEmployees = async (req, res) => {
    let queries = {}
    console.log(req.query)
    if(req.query.Organization){
        let organization = await Organization.findOne({name: req.query.Organization.replace(/["]+/g, '')});
        console.log({name: req.query.Organization.replace(/["]+/g, '')})
        if(organization){
            queries["organization"] = organization._id
        }else {
            return res.status(502).json({
                message: "Organization not exists"
            })
        }
    }
    if(req.query.Organization && req.query.Department){
        let department = await Department.findOne({name: req.query.Department.replace(/["]+/g, ''), organization: queries.organization});
        if(department){
            queries["department"] = department._id
        }else {
            return res.status(502).json({
                message: "Department not exists"
            })
        }
    }
    if(req.query.FirstName){
        queries["firstName"] = req.query.FirstName.replace(/["]+/g, '')
    }
    let employees = await Employee.find(queries);
    return res.status(200).json({
        message: employees
    })
}

const loginController = (req, res) => {
    const { email, password } = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(401).json({
                error: "user doesn't exist"
            });
        };
        user.comparePassword(password, function(err, match){
            if(err){
                console.error(err)
                return res.status(400).json({
                    error: "internal server error"
                });
            }
            if(!match){
                return res.status(401).json({
                    error: "Email and Password doesn't match"
                });
            };
            const {_id, name, email, role } = user;
            const token = authenticate({id: _id, role})
            return res.json({
                message: "sigin successful", user: { _id, name, email }, token
            });
        });
    });
};

module.exports = {
    createDepartment,
    createOrganization,
    createEmployess,
    getAllEmployees,
    loginController
}