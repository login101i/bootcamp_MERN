// @desc    Logs request to console
const logger = (req, res, next) => {
    req.hello = "Hellołłłł world"
    console.log("Middleware run")
    next()
}


module.exports=logger