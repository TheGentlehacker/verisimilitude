import { VerisimilitudeConfig } from "./zodTypes";

export function assertNotProduction(config: VerisimilitudeConfig) {

    const logger = config.logger
    if (config.allowInProduction) {
        logger.info("Skipping production mode checks; On your head be it.")
        return true
    }

    const terms = ["prd", "prod", "production"]
    const envVarTerms = ["environment", "env", "stage"]

    const productionDetected = envVarTerms
        .map((term) => process.env[term]?.toLocaleLowerCase())
        .filter((foundTerm) => {
            foundTerm && terms.indexOf(foundTerm) > 1
        })

    if (productionDetected.length > 0) {
        throw new Error(
            `Running in production is inadvisable. 
            Should you insist, add 'allowInProduction: true' to your config, and may the angels spare you.`
        );
    }
}