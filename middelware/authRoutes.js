// identify admin to display spesific routes
module.exports = (req, res, next) => {
    if( !(req.session.idetifyUser === process.env.ADMIN_EMAIL) ){
        return res.redirect("/");
    }
    next();
};