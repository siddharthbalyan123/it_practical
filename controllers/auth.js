const mysql = require('mysql');
const db = require('../model/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const nodemailer = require('nodemailer');

//login 
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).render("login", {
        message: 'Please provide email and password'
      });
    }
  
    // 2) Check if user exists && password is correct
    db.start.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
        if(results==0) {
            return res.status(401).render("login", {
            message: 'Email does not exist'
             });
        }
        console.log(results);
        console.log(password);
        const isMatch = await bcrypt.compare(password, results[0].password);
        console.log(isMatch);
        if(!results || !isMatch ) {
         return res.status(401).render("login", {
           message: 'Incorrect email or password'
        });
      } else {
        // 3) If everything ok, send token to client
        const id = results[0].id;
        console.log(id);
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
        });
  
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        };
        res.cookie('jwt', token, cookieOptions);
        res.status(201).redirect("/edit");
       // res.render('edit', {message : 'Login Successful!'});
     }
    });
  };

//register
exports.register = (req, res) => {
    
    console.log(req.body);
    const {name, email, password, c_password} = req.body;

    db.start.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(!name || !email || !password || !c_password) {
            return res.status(401).render("register", {
            message: 'Fill all the fields'
             });
        }
        if(results.length > 0){
            return res.render('register', {
                message : 'That email is already in use!'
            })
        }
        else if(password !== c_password){
            return res.render('register', {
                message : 'Passwords do not match!'
            })
        }

        let h_password = await bcrypt.hash(password,8);
        console.log(h_password);

        db.start.query('INSERT INTO users SET ?', {name: name, email: email, password: h_password}, (error,results) => {
            if(error){
                console.log(error);
            }else{
                db.start.query('SELECT id FROM users WHERE email = ?', [email], (error, result) => {
                    const id = result[0].id;
                    console.log(id);
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                      expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
                    });
                    console.log(token);
                    const cookieOptions = {
                      expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                      ),
                      httpOnly: true
                    };
                    res.cookie('jwt', token, cookieOptions);
          
                    const output='<p>You\'re successfully registered with Our Blogs website with <br> Username : '+req.body.name+' <br> Password : '+req.body.password+' <br> Now you can add blogs to this site and also read blogs by other people.</p><br><p>Wish you a happy reading!!!</p>'
                    let transporter = nodemailer.createTransport({
                      host: "smtp.gmail.com",
                      port: 465,
                      secure: true, // true for 465, false for other ports
                      auth: {
                        user: 'id here', // generated ethereal user
                        pass: 'pass', // generated ethereal password
                      },
                      tls:{
                        rejectUnauthorized: false
                      }
                    });
                                
                    // send mail with defined transport object
                    let info = transporter.sendMail({
                        from: '"Our Blogs " <id pass>', // sender address
                        to: req.body.email, // list of receivers
                        subject: "Registration Confirmed", // Subject line
                        text: "Hello world?", // plain text body
                        html: output, // html body
                      });

                    res.status(201).redirect("/edit");
                    //res.render('edit',{message : 'Registeration Successful'})
                  });
            }
        });
    });
    
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt, 
        process.env.JWT_SECRET
        );

      console.log(decoded);
      
      // 2) Check if user still exists
      db.start.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result)
        if(!result) {
          return next();
        }
        // THERE IS A LOGGED IN USER
        //req.user = result[0];
        req.user = result[0];
        return next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};

//logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect("/index");
  //res.render('index',{message : 'Logout Successful'})
};

exports.view = async(req,res,next) => {
  db.start.query('SELECT * FROM blogs', (err,result) => {
    if(!err)
    {
      console.log(result);
      req.user=result;
    }
    else{
      console.log(err);
    }
    return next();
  })
}

exports.viewU = async(req,res,next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt, 
        process.env.JWT_SECRET
        );

      console.log(decoded);
      
      // 2) Check if user still exists
      db.start.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result)
        if(!result) {
          return next();
        }
        // THERE IS A LOGGED IN USER
        //req.user = result[0];
        req.user = result[0];

          db.start.query('SELECT * FROM blogs WHERE uid = ?',[decoded.id], (err, blog) => {
          if(!err)
          {
            console.log(blog);
            res.render('edit', {
              user:req.user,
              blog})
          }
          else{
            console.log(err);
          }
        });

        return next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};

exports.add = async(req,res,next) => {

  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt, 
    process.env.JWT_SECRET
    );

  const {title, category, content} = req.body;

  db.start.query('INSERT INTO blogs SET ?', {uid: decoded.id, title:title,category:category,content:content}, (error,results) => {
    if(error){
        console.log(error);
    }
    else{
      res.redirect('/index');
    }
  });
  return next();
};

exports.viewB = async(req,res,next) => {
  db.start.query('SELECT * FROM blogs where id =?',[req.params.id], (err,result) => {
    if(!err)
    {
      res.render('view_blog',{result});
    }
    else{
      console.log(err);
    }
  })
  return next();
};

exports.delB = async(req,res,next) => {
  db.start.query('DELETE FROM blogs where id =?',[req.params.id], (err,result) => {
    if(!err)
    {
      res.redirect('/index');
    }
    else{
      console.log(err);
    }
  })
  return next();
};

exports.editB = async(req,res,next) => {
  db.start.query('DELETE FROM blogs where id =?',[req.params.id], (err,result) => {
    if(!err)
    {  
      res.redirect('/edits_blog');
    }
    else{
      console.log(err);
    }
  })
  return next();
};
