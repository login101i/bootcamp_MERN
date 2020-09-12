const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')


// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {


    // wykonanie query
    res.status(200).json(res.advancedResults)
})
// @desc Get  bootcamp
// @route GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return new ErrorResponse(`Bootcamp z id ${req.params.id} nie został odnaleziony`, 404)
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })
})
// @desc Add bootcamp
// @route POST /api/v1/bootcamps/:id
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // dodanie też użytkownika do reqest.body bo normalnie to user nie wychodzi od clienta
    req.body.user = req.user.id

    // checked for published bootcamp   
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `Użytkowik o ID ${req.user.id} już obublilkował bootcamp`,
                400
            )
        );
    }

    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success: true,
        data: bootcamp
    })
})
// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return new ErrorResponse(`Bootcamp z id ${req.params.id} nie został odnaleziony`, 404)

    }
    // Upewnienie się że zalogowany użytkownik jest właścicielem bootcampu
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `Użytkownik ${req.params.id} nie jest upoważniony do edycji tego bootcampu`,
                401
            )
        );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: bootcamp
    })

})
// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return new ErrorResponse(`Bootcamp z id ${req.params.id} nie został odnaleziony`, 404)

    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `Użytkowniko o ID ${req.params.id} nie jest upoważniony aby usunąć ten bootcamp`,
                401
            )
        );
    }
    bootcamp.remove()

    res.status(200).json({
        success: true,
        msg: `Usunięto bootcamp o id: ${req.params.id}`
    })

})


// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// _______________________________________________-PHOTO-_____________________________________________
// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this bootcamp`,
                401
            )
        );
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    console.log(req.files)
    const file = req.files.file;


    //Sprawdzenie czy obraz to obraz
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Proszę załadować obraz, nie jakieś głupoty.`, 400));
    }

    // Sprawdzenie rozmiaru obrazu
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Tworzenie nazwy obrazu
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Wystąpił problem z załadowaniem zdjęcia.`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});