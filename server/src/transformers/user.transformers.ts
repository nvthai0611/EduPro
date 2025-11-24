import { log } from "console";
import Transformer from "../core/transformers";
export default class extends Transformer {
    response(instance: { _id: any; fullName: any; email: any; status: any; image: any; type: any; birthDate: any; branchId: any; phoneNumber: any; created_at: any; updated_at: any; }, user?: Express.User) {
        return {
            UID: instance[`${"_id"}`],
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