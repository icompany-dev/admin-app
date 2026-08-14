import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TARGET_DIR = __dirname // Current folder

// Helper Functions
const getCamelSingular = (str) => str.charAt(0).toLowerCase() + str.slice(1)

const getPlural = (str) => {
  if (str.endsWith("y") && !/[aeiou]y$/.test(str)) {
    return str.slice(0, -1) + "ies"
  } else if (str.endsWith("s")) {
    return str
  } else {
    return str + "s"
  }
}

const getRepoKey = (str) => {
  const plural = getPlural(str)
  return plural.charAt(0).toLowerCase() + plural.slice(1)
}

const generateStoreContent = (className) => {
  const camelSingular = getCamelSingular(className)
  const camelPlural = getRepoKey(className)
  const pascalPlural = getPlural(className)

  return `import { defineStore } from "pinia"
import { useNuxtApp } from "#app"
import { useStoreActions } from "~/stores/StoreActions"
import { ${className} } from "~/scripts/models/${className}"

export const use${className}Store = defineStore("${camelSingular}", () => {
  const { $repositories } = useNuxtApp()

  const ${camelPlural} = ref<${className}[]>([])
  const ${camelSingular} = ref<${className} | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const crudActions = useStoreActions($repositories.${camelPlural}, {
    items: ${camelPlural},
    item: ${camelSingular},
    isLoading: isLoading,
    error: error,
  })

  const total${pascalPlural} = computed(() => ${camelPlural}.value.length)

  return {
    ${camelPlural},
    ${camelSingular},
    isLoading,
    error,
    total${pascalPlural},
    ...crudActions
  }
})
`
}

export const generateStores = async (classesData) => {
  console.log("\n--- 3. Generating Store Files ---")

  classesData.forEach((item) => {
    const className = item.name
    const fileName = `${getPlural(className)}.ts`
    const filePath = path.join(TARGET_DIR, fileName)

    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipped (exists): ${fileName}`)
      return
    }

    try {
      fs.writeFileSync(filePath, generateStoreContent(className))
      console.log(`✅ Created: ${fileName}`)
    } catch (err) {
      console.error(`❌ Error creating ${fileName}:`, err)
    }
  })
}
