import fs from "fs/promises";

// Define the path to the file where services will be stored
const servicesFilePath = "services.json";

// Repository for Lens services (persisted on disk)
export type LensService = {
  id: string;
  label?: string;
  fqdn: string;
  host: string;
  port: number;
  isSecure: boolean;
};

export const writeServices = async (services: LensService[]) => {
  try {
    const existingServices = await readServices();

    // Update existing services with new labels, create new services if they don't exist, and remove services that no longer exist
    const updatedServices = services.map((service) => {
      const existingService = existingServices.find((s) => s.id === service.id);

      if (existingService === undefined) {
        return service;
      }

      return {
        ...existingService,
        label: service.label || existingService.label,
      };
    });

    await fs.writeFile(servicesFilePath, JSON.stringify(updatedServices));

    return updatedServices;
  } catch (error) {
    console.error("Error writing services:", error);

    return [];
  }
};

export const readServices = async (): Promise<LensService[]> => {
  try {
    const data = await fs.readFile(servicesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const updateServiceLabel = async (id: string, label: string) => {
  try {
    const services = await readServices();
    const updatedServices = services.map((service) =>
      service.id === id ? { ...service, label } : service
    );
    await writeServices(updatedServices);

    return updatedServices;
  } catch (error) {
    console.error("Error updating service label:", error);

    return [];
  }
};
