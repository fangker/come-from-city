const multer=require('multer');

var fleetStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/tmp')
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,  Date.now() + "." + fileFormat[fileFormat.length - 1])
    }
});
var licenseStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public\\tmp')
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        if(req.session.user){
            cb(null,'license'+req.session.user+ "." + fileFormat[fileFormat.length - 1])
        }
    }
});
var photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public\\tmp')
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,"photo" + "." + fileFormat[fileFormat.length - 1])
    }
});

let fleetUpload = multer({ storage: fleetStorage  });
let licenseUpload = multer({ storage: licenseStorage  });
let photoUpload = multer({ storage: photoStorage  });

let uploads={
      fleet:fleetUpload,
    license:licenseUpload,
    photo:photoUpload
};
module.exports=uploads;