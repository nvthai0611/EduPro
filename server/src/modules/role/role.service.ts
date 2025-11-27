import { IRole } from "./role.model";
import { roleRepository } from "./role.repository";

export interface IRoleService {
    getAllRoles(): Promise<IRole[]>;
    getRoleById(id: string): Promise<IRole | null>;
    createRole(roleData: IRole): Promise<IRole>;
    updateRole(id: string, roleData: Partial<IRole>): Promise<IRole | null>;
    deleteRole(id: string): Promise<IRole | null>;
}

class RoleService implements IRoleService {
    async getAllRoles(): Promise<IRole[]> {
        return await roleRepository.findAll();
    }

    async getRoleById(id: string): Promise<IRole | null> {
        return await roleRepository.findById(id);
    }

    async createRole(roleData: IRole): Promise<IRole> {
        return await roleRepository.create(roleData);
    }

    async updateRole(id: string, roleData: Partial<IRole>): Promise<IRole | null> {
        return await roleRepository.update(id, roleData);
    }

    async deleteRole(id: string): Promise<IRole | null> {
        return await roleRepository.delete(id);
    }
}

export const roleService = new RoleService();
