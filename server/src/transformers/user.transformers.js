const Transformer = require("../core/transformers");
module.exports = class extends Transformer {
    response(instance) {
        return {
            UID: instance._id,
            name: instance.fullName,
            email: instance.email,
            status: instance.status,
            image: instance.image,
            type: instance.type,
            dateOfBirth: instance.birthDate,
            branchId: instance?.branchId || null,
            phoneNumber: instance.phoneNumber,
            createAt: instance.created_at,
            updateAt: instance.updated_at
        };
    };
};