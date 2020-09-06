const Bootcamp = require('../models/Bootcamps')


// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            count:bootcamps.length,
            success: true,
            data: bootcamps
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }

}
// @desc Get  bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
                msg: "Nieprawidłowe ID"
            })
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        // res.status(400).json({
        //     success: false,
        //     msg: 'coś nie tak'
        // })
        next(err)
    }
}
// @desc Add bootcamp
// @route POST /api/v1/bootcamps/:id
// @access private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)

        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }

}
// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req, res, next) => {
    try {
       
        const bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        })
        if (!bootcamp){
            return res.status(400).json({
                success:false
            })
        }
        res.status(200).json({
            success:true,
            data:bootcamp
        })
    } catch{
        res.status(400).json({
            success: false
        })
    }
}
// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp) {
            return res.status(400).json({
                success: false
            })
        }
        res.status(200).json({
            success: true,
            msg:`Usunięto bootcamp o id: ${req.params.id}`
        })
    } catch{
        res.status(400).json({
            success: false
        })
    }
}