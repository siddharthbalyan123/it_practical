const express= require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/index',authController.view,(req,res,next) => {
    res.render('index',{blog : req.user});
});

router.get('/login',authController.isLoggedIn,(req,res) => {
    if(req.user == undefined) {
        res.render('login');
        }
    else{
        res.redirect('/edit');
    }
});

router.get('/register',(req,res) => {
    res.render('register');
});

router.get('/edit_t',authController.isLoggedIn,(req,res) => {
    if(req.user == undefined) {
        res.render('login');
        }
    else{
        res.redirect('/edit');
    }
});
router.get('/new_t',authController.isLoggedIn,(req,res) => {
    if(req.user == undefined) {
        res.render('login');
        }
    else{
        res.redirect('/new');
    }
});

router.get('/new',(req,res) => {
    res.render('new')
});
router.get('/edit',authController.viewU,(req,res) => {
});

router.post('/add_new', authController.add, (req,res) => {
})

router.get('/view_blog/:id',authController.viewB,(req,res) => {
})

router.get('/del_blog/:id',authController.delB,(req,res) => {
})

router.get('/edit_blog/:id',authController.editB,(req,res) => {
})

router.get('/edits_blog',(req,res) => {
    res.render('edits_blog');
})

module.exports = router;