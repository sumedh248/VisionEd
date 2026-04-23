const ExpressError = require("./utils/ExpressError.js");

// login checkups

module.exports.isloggedin = (req, res, next) => {
   if (!req.isAuthenticated()) {
      req.session.redirecturl = req.originalUrl;
      req.flash("error", "You've must be logged in!");
      return res.redirect("/login");
   }
   next();
}


// last urls

module.exports.redirecturl = (req, res, next) => {
   if (req.session.redirecturl) {
      res.locals.redirecturl = req.session.redirecturl;
   }
   next();
}


