import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TARGET_DIR = __dirname // Current folder

const generateContent = (className) => {
  return `import { ${className} } from "../models/${className}"
import { Repository } from "./Repository"

export class ${className}Repository extends Repository<${className}> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ${className})
  }
}
`
}

// Export the function to be used by the master script
export const generateRepos = async (classesData) => {
  console.log("\n--- 1. Generating Repository Files ---")

  classesData.forEach((item) => {
    const className = item.name // Access property from object
    const fileName = `${className}Repository.ts`
    const filePath = path.join(TARGET_DIR, fileName)

    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipped (exists): ${fileName}`)
      return
    }

    try {
      fs.writeFileSync(filePath, generateContent(className))
      console.log(`✅ Created: ${fileName}`)
    } catch (err) {
      console.error(`❌ Error creating ${fileName}:`, err)
    }
  })
}
