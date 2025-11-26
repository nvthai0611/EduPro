// src/repositories/role.repository.ts

import Role, { IRole } from './role.model';

export interface IRoleRepository {
    findAll(): Promise<IRole[]>;
    findById(id: string): Promise<IRole | null>;
    create(role: IRole): Promise<IRole>;
    update(id: string, role: Partial<IRole>): Promise<IRole | null>;
    delete(id: string): Promise<IRole | null>;
}

class RoleRepository implements IRoleRepository {
    async findAll(): Promise<IRole[]> {
        return await Role.find();
    }

    async findById(id: string): Promise<IRole | null> {
        return await Role.findById(id);
    }

    async create(role: IRole): Promise<IRole> {
        return await Role.create(role);
    }

    async update(id: string, role: Partial<IRole>): Promise<IRole | null> {
        return await Role.findByIdAndUpdate(id, role, { new: true });
    }

    async delete(id: string): Promise<IRole | null> {
        return await Role.findByIdAndDelete(id);
    }
}

export const roleRepository = new RoleRepository();
