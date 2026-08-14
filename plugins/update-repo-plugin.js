import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TARGET_FILE = path.join(__dirname, "repositories.ts")
const BACKUP_FILE = path.join(__dirname, "repositories (backup_full).ts")

// Pluralization Logic
const getPropertyKey = (className) => {
  let key = className.charAt(0).toLowerCase() + className.slice(1)
  if (key.endsWith("y") && !/[aeiou]y$/.test(key)) {
    return key.slice(0, -1) + "ies"
  } else if (key.endsWith("s")) {
    return key
  } else {
    return key + "s"
  }
}

export const updateRepoPlugin = async (newClassesData) => {
  console.log("\n--- 2. Updating Plugin File (repositories.ts) ---")

  if (!fs.existsSync(TARGET_FILE)) {
    throw new Error(`Target file not found: ${TARGET_FILE}`)
  }

  // 1. Create Backup
  fs.copyFileSync(TARGET_FILE, BACKUP_FILE)
  console.log(`📦 Backup created: ${BACKUP_FILE}`)

  const content = fs.readFileSync(TARGET_FILE, "utf-8")

  // 2. Parse Existing
  const objStart = content.indexOf("const repositories: Repositories = {")
  const objEnd = content.lastIndexOf("nuxtApp.provide")
  const objectBlock = content.substring(objStart, objEnd)

  const allRepos = []
  let match
  const extractionRegex = /([a-zA-Z0-9]+):\s+new\s+([a-zA-Z0-9]+)\(([\s\S]*?)\)/g

  while ((match = extractionRegex.exec(objectBlock)) !== null) {
    allRepos.push({
      key: match[1],
      className: match[2],
      args: match[3].trim(),
      isNew: false,
    })
  }

  // 3. Merge New Data from Master Script
  newClassesData.forEach((item) => {
    const key = getPropertyKey(item.name)
    const newArgs = `
      "${item.url}",
      "${item.singleUrl}",
      config.public.apiBaseUrl,
      getAuthToken
    `

    const existingIndex = allRepos.findIndex((r) => r.className === item.name + "Repository")
    if (existingIndex > -1) {
      allRepos.splice(existingIndex, 1) // Remove old to replace with new
    }

    allRepos.push({
      key,
      className: item.name + "Repository",
      args: newArgs,
      isNew: true,
    })
  })

  allRepos.sort((a, b) => a.key.localeCompare(b.key))

  // 4. Generate Sections
  const standardImports = `import { useCookie } from "#app"`
  const repoImports = allRepos
    .map((r) => `import { ${r.className} } from "~/scripts/repositories/${r.className}"`)
    .join("\n")
  const interfaceContent = allRepos.map((r) => `  ${r.key}: ${r.className}`).join("\n")
  const objectContent = allRepos
    .map((r) => {
      let cleanArgs = r.args
      if (!cleanArgs.includes("\n") && cleanArgs.includes(",")) {
        cleanArgs =
          "\n      " +
          cleanArgs
            .split(",")
            .map((s) => s.trim())
            .join(",\n      ") +
          "\n    "
      }
      return `    ${r.key}: new ${r.className}(${cleanArgs})`
    })
    .join(",\n")
  const typeContent = allRepos
    .map((r) => `      ${r.key}: import("~/scripts/repositories/${r.className}").${r.className}`)
    .join("\n")

  // 5. Assemble
  const cookiePrefix = `auth.\${config.public.appName}_\${config.public.appEnv}_`
  const finalFileContent = `${repoImports}
${standardImports}

interface Repositories {
${interfaceContent}
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const authTokenCookie = useCookie(\`${cookiePrefix}_token\`)
  const getAuthToken = () => authTokenCookie.value

  const repositories: Repositories = {
${objectContent}
  }

  nuxtApp.provide("repositories", repositories)
})

declare module "#app" {
  interface NuxtApp {
    $repositories: {
${typeContent}
    }
  }
}

declare module "pinia" {
  export interface PiniaCustomProperties {
    $repositories: {
${typeContent}
    }
  }
}
`

  fs.writeFileSync(TARGET_FILE, finalFileContent)
  console.log("✅ Plugin file updated.")
}
