const express = require('express');
const {getCompanies,getCompany,createCompany,updateCompany,deleteCompany} = require('../controllers/companies');
const app = express();

const InterviewRouter = require('./interviews');

const router = express.Router();

const{protect,authorize} = require('../middleware/auth');

router.use('/:companyId/interviews',InterviewRouter);

router.route('/').get(getCompanies).post(protect,authorize('admin'),createCompany);
router.route('/:id').get(getCompany).put(protect,authorize('admin'),updateCompany).delete(protect,authorize('admin'),deleteCompany);

module.exports=router;