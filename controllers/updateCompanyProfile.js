const Company = require("../models/companyModel");
const cloudinary = require("../utils/cloudinary");

const updateCompanyProfile = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'Companies Images',
            use_filename: true,
        });

        const company = req.user;
        const updatedProfile = await Company.findByIdAndUpdate(company.id, {description: req.body.description, profileImg: result.url}, {
            new: true,
            runValidators: true
        });

        if (!updatedProfile) {
            return res.status(301).json({
                message: "No Company Found",
            })
        }

        const { hashPassword, ...user } = updatedProfile._doc;
        return res.status(202).json({
            message: "Profile Updated Successfully",
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            error
        })
    }
}

module.exports = updateCompanyProfile