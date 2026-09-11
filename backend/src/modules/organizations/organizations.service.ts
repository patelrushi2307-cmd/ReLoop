import { OrganizationModel, IOrganization } from './organizations.model.js';

export class OrganizationsService {
  async getById(id: string): Promise<IOrganization | null> {
    return OrganizationModel.findOne({ _id: id, isDeleted: false });
  }

  async create(data: Partial<IOrganization>): Promise<IOrganization> {
    return OrganizationModel.create(data);
  }

  async list(): Promise<IOrganization[]> {
    return OrganizationModel.find({ isDeleted: false }).limit(50);
  }
}

export const organizationsService = new OrganizationsService();
