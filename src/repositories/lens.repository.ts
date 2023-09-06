import fs from "fs/promises";
import path from "path";

// Define the path to the file where services will be stored
const servicesFilePath = "./data/service-meta.json";

// Repository for Lens services (persisted on disk)
export type LensServiceMeta = {
  label?: string;
  icon?: string;
};

export type ServiceMetaState = {
  [serviceId: string]: LensServiceMeta;
};

const readServiceMeta = async (): Promise<ServiceMetaState> => {
  try {
    const data = await fs.readFile(servicesFilePath, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const writeServiceMeta = async (serviceMeta: ServiceMetaState) => {
  const folderPath = path.dirname(servicesFilePath);

  // Create the directory if it doesn't exist
  await fs.mkdir(folderPath, { recursive: true });

  await fs.writeFile(servicesFilePath, JSON.stringify(serviceMeta));
};

export class LensRepository {
  async getServiceMeta(): Promise<ServiceMetaState> {
    return await readServiceMeta();
  }

  async updateServiceMeta(
    id: string,
    meta: LensServiceMeta
  ): Promise<ServiceMetaState> {
    const serviceMeta = await readServiceMeta();

    serviceMeta[id] = {
      ...serviceMeta[id],
      ...meta,
    };

    await writeServiceMeta(serviceMeta);

    return serviceMeta;
  }
}
