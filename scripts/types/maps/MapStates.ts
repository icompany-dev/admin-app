export const MALAYSIA_STATES = [
  "Kuala Lumpur",
  "Selangor",
  "Penang",
  "Johor",
  "Perak",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Terengganu",
  "Kelantan",
  "Kedah",
  "Perlis",
  "Sabah",
  "Sarawak",
  "Putrajaya",
  "Labuan",
  "(Not in Malaysia)",
] as const

export type MalaysiaState = (typeof MALAYSIA_STATES)[number]
