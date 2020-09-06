// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps=(req,res, next)=>{
    res.status(200).json(
        {
            msg: 'Twoje bootcampy poniżej:',
            success: true,
        })
}
// @desc Get  bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json(
        {
            msg: `Wyświetlono bootcamp ${req.params.id}`,
            success: true
        })
}
// @desc Add bootcamp
// @route POST /api/v1/bootcamps/:id
// @access private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json(
        {
            msg: `Dodano bootcamp`,
            success: true
        })
}
// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp=(req,res,next)=>{
    res.status(200).json(
        {
            msg:`Zaktualizowano Boocampt  ${req.params.id}`
        }
    )
}
// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json(
        {
            msg: `Usunięto bootcamp ${req.params.id}`,
            success: true
        })
}