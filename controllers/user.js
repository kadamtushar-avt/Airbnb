const User = require("../models/user")

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signUp = async(req,res,next)=>{

    try{
        let {username,email,password} = req.body;
        let newUser = new User({username,email});

        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
                
            }
            console.log(registeredUser);   
            req.flash("success","User Registered Successfully !");
            res.redirect("/listings")
        });
        
        
    }catch(e){
        console.log(e);
        req.flash("error",e.message);
        return res.redirect("/signup");
    }
    
}


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}


module.exports.login = async(req,res)=>{
    req.flash("success","Successfully Logged In .. Welcome to wanderLust")
    res.redirect(res.locals.redirectUrl || "/listings"); 
}

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You LoggedOut Successfully!");
        res.redirect("/listings");

    })
}