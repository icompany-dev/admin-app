const fs = require("fs")
const path = require("path")

// Helper to convert string to kebab-case
const toKebabCase = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_/]+/g, "-")
    .toLowerCase()

// Get the component path from the command line argument
const componentPath = process.argv[2]

if (!componentPath) {
  console.error("Please provide a component path (e.g., LegalDocuments/LetterOfNomination)")
  process.exit(1)
}

// Split path into segments
const segments = componentPath.split("/")
const componentName = segments[segments.length - 1]
const subDir = segments.length > 1 ? segments.slice(0, -1).join("/") : ""

// Logic for specialized naming
const kebabSubDir = subDir ? toKebabCase(subDir) : ""
const kebabComponentName = toKebabCase(componentName)
const cssId = subDir ? `${kebabSubDir}-${kebabComponentName}` : kebabComponentName

// Define the file locations
const paths = {
  vue: path.join(__dirname, "components", subDir, `${componentName}.vue`),
  // TS uses kebab-case for the directory only, but keeps PascalCase for the Controller file name
  ts: path.join(__dirname, "scripts/components", kebabSubDir, `${componentName}Controller.ts`),
  scss: path.join(__dirname, "assets/scss/components", subDir, `${componentName}.scss`),
}

// --- Templates ---

const vueTemplate = `<template>
  <div id="${cssId}">
  </div>
</template>

<script lang="ts" setup>
import { ${componentName}Controller } from '~/scripts/components/${kebabSubDir}/${componentName}Controller'

const props = defineProps({})
const emit = defineEmits([]) 

const controller = new ${componentName}Controller(props, emit)
</script>

<style lang="scss">
@use '~/assets/scss/components/${subDir}/${componentName}' as *;
</style>
`

const tsTemplate = `export class ${componentName}Controller {
  emitEvents: any | null = null

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }
}
`

const scssTemplate = `#${cssId} {
  // Styles go here
}
`

// --- File Creation Logic ---

function createFile(filePath, content) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content)
    console.log(`✅ Created: \${filePath}`)
  } else {
    console.warn(`⚠️  File already exists: \${filePath}`)
  }
}

createFile(paths.vue, vueTemplate)
createFile(paths.ts, tsTemplate)
createFile(paths.scss, scssTemplate)

console.log(`\n🚀 Component "${componentName}" is ready for action!`)
