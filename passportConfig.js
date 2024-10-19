const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('./model');



exports.intializingpassport = (passport) => {
   
    passport.use(new LocalStrategy(
        async (username,password,done) => {
             try{
               const user = await User.findOne({username: username});
                if(!user) {
                 return done(null, false, {message: "User not present"});
                }
                
                if(user.password !== password){
                 return done(null, false, {message: "Incorrect passowrd"});
                }
     
                return done(null, user, {message: "User verified"});
     
             }catch(error){
     
                 return done(null, false, { message: "External Error Occured" });
             }
         }
     ))

} 

passport.serializeUser((user,done)=> {
    return done(null, user);
});

passport.deserializeUser(async(id, done)=> {
    try{
     const user = await User.findOne(id);
     if(!user){
        return done(null, false, {message: "User with id not found"});
     } 
        return done(null, user);
    }catch(error){
        return done(null, error);
    } 
});



exports.isAuthenticateuser = (req,res,next)=> {
     if(req.user){
         // console.log(req.user);
      return next();
     }


      res.redirect("/login");
};




