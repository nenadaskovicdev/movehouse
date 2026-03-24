import { db, providersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const PROVIDERS = [
  // Energy
  { name: "Octopus Energy", category: "energy", isAffiliate: true, affiliateUrl: "https://octopus.energy/", description: "Green energy supplier" },
  { name: "British Gas", category: "energy", isAffiliate: false, description: "UK's largest energy supplier" },
  { name: "EDF Energy", category: "energy", isAffiliate: false, description: "Low-carbon energy" },
  { name: "E.ON", category: "energy", isAffiliate: false, description: "Energy supplier" },
  { name: "OVO Energy", category: "energy", isAffiliate: true, affiliateUrl: "https://www.ovoenergy.com/", description: "Renewable energy" },
  { name: "Bulb Energy", category: "energy", isAffiliate: false, description: "Renewable energy" },

  // Broadband
  { name: "YouFibre", category: "broadband", isAffiliate: true, affiliateUrl: "https://youfibre.com/", description: "Full-fibre broadband" },
  { name: "BT", category: "broadband", isAffiliate: false, description: "UK's largest broadband provider" },
  { name: "Sky Broadband", category: "broadband", isAffiliate: false, description: "Broadband and TV" },
  { name: "Virgin Media", category: "broadband", isAffiliate: false, description: "Cable broadband" },
  { name: "Hyperoptic", category: "broadband", isAffiliate: true, affiliateUrl: "https://www.hyperoptic.com/", description: "Full-fibre broadband" },
  { name: "Vodafone", category: "broadband", isAffiliate: false, description: "Broadband and mobile" },

  // Mobile
  { name: "Smarty", category: "mobile", isAffiliate: true, affiliateUrl: "https://smarty.co.uk/", description: "SIM-only mobile plans" },
  { name: "EE", category: "mobile", isAffiliate: false, description: "UK's largest mobile network" },
  { name: "Three", category: "mobile", isAffiliate: false, description: "Mobile network" },
  { name: "O2", category: "mobile", isAffiliate: false, description: "Mobile and broadband" },
  { name: "iD Mobile", category: "mobile", isAffiliate: false, description: "Budget mobile plans" },
  { name: "giffgaff", category: "mobile", isAffiliate: true, affiliateUrl: "https://www.giffgaff.com/", description: "Community mobile network" },

  // Water
  { name: "Thames Water", category: "water", isAffiliate: false, description: "Water supplier - London/SE" },
  { name: "Anglian Water", category: "water", isAffiliate: false, description: "Water supplier - East England" },
  { name: "Severn Trent", category: "water", isAffiliate: false, description: "Water supplier - Midlands" },
  { name: "Yorkshire Water", category: "water", isAffiliate: false, description: "Water supplier - Yorkshire" },
  { name: "South West Water", category: "water", isAffiliate: false, description: "Water supplier - South West" },
  { name: "United Utilities", category: "water", isAffiliate: false, description: "Water supplier - North West" },
  { name: "Wessex Water", category: "water", isAffiliate: false, description: "Water supplier - Wessex" },

  // TV
  { name: "Sky TV", category: "tv", isAffiliate: false, description: "Satellite TV" },
  { name: "Virgin Media TV", category: "tv", isAffiliate: false, description: "Cable TV" },
  { name: "Freeview", category: "tv", isAffiliate: false, description: "Free digital TV" },

  // Postal
  { name: "Royal Mail Redirection", category: "postal", isAffiliate: false, description: "Mail redirection service" },

  // Council (generic - in practice we'd have specific councils)
  { name: "Local Council", category: "council", isAffiliate: false, description: "Update your local council records" },
] as const;

export async function seedProviders() {
  const existing = await db.select({ id: providersTable.id }).from(providersTable).limit(1);
  if (existing.length > 0) {
    logger.info("Providers already seeded, skipping");
    return;
  }

  logger.info("Seeding providers...");
  await db.insert(providersTable).values(
    PROVIDERS.map((p) => ({ ...p, isActive: true }))
  );
  logger.info(`Seeded ${PROVIDERS.length} providers`);
}
