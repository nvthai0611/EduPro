import Transformer from "../../core/transformers";
export interface UserInstance {
    _id: any;
    fullName: string;
    email: string;
    status: string;
    image?: string;
    type: string;
    birthDate?: Date | string;
    phoneNumber?: string;
    created_at: Date | string;
    updated_at: Date | string;
}


export default class UserTransformer extends Transformer {
    response(instance: UserInstance, user?: Express.User) {
        return {
            UID: instance._id,
            name: instance.fullName,
            email: instance.email,
            status: instance.status,
            image: instance.image,
            type: instance.type,
            dateOfBirth: instance.birthDate,
            phoneNumber: instance.phoneNumber,
            createAt: instance.created_at,
            updateAt: instance.updated_at
        };
    };
};