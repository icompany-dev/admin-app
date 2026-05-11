// NOTE (Bahiyah): This file is to automate the process of
//  1. Creating the ${classname}Repository.ts file
//  2. Adding the repository to plugin
//  3. Creating the corresponding stores class
//
//  To run: node add-repositories.js

import { generateRepos } from "./scripts/repositories/generate-repos.js"
import { updateRepoPlugin } from "./plugins/update-repo-plugin.js"
import { generateStores } from "./stores/generate-stores.js"

// --- 1. THE MASTER DATA SOURCE ---
// Add or remove classes here. This is the only source of truth.
const classes = [
  {
    name: "AdminPaymentReceived",
    url: "admin/payments-received",
    singleUrl: "admin/payment-received",
  },
]

// --- 2. ORCHESTRATION ---
const run = async () => {
  console.clear()
  console.log(`🚀 STARTING SCAFFOLDING FOR ${classes.length} CLASSES...`)

  try {
    await generateRepos(classes)
    await updateRepoPlugin(classes)
    await generateStores(classes)

    console.log(`\n🎉🎉🎉 ALL TASKS COMPLETED SUCCESSFULLY!`)
    console.log(`\nCheck the repositories.ts. If everything is correct, remove the backup file for repositories.ts`)
  } catch (error) {
    console.error("\n❌ CRITICAL ERROR:", error)
  }
}

run()
