
const express = require('express'),
router = express.Router(),
{ createOrganization, createDepartment, createEmployess, getAllEmployees, loginController } = require('../controller');

const { authorize, Role, checkHeaders } = require('../helpers');
const { organizationValidator, departmentValidator, employeeValidator } = require('../validators')

router.post("/createOrganization", checkHeaders, authorize(Role.SuperAdmin), organizationValidator, createOrganization);

router.post("/createDepartments", checkHeaders, authorize(Role.SuperAdmin), departmentValidator, createDepartment);

router.post("/createEmployees", checkHeaders, authorize(Role.SuperAdmin), employeeValidator, createEmployess);

router.get("/getAllEmployees", checkHeaders, authorize(Role.SuperAdmin), getAllEmployees);

router.post("/login", loginController);


module.exports = router;