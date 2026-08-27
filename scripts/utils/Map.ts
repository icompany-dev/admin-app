import type { MalaysiaState } from "../types/maps/MapStates"
import type { ProximityTier } from "../types/maps/MapProximityTier"
import type { UserCategoryMode, CompanyCategoryMode } from "../types/maps/MapFilterState"
import type { Gender, AgeGroup, CompanyRole } from "../types/maps/MapUserLocation"
import { UserLocation } from "../types/maps/MapUserLocation"
import { CompanyLocation } from "../types/maps/MapCompanyLocation"

export class MapUtil {
  static GENDER_COLORS: Record<Gender, { bg: string; text: string; border: string; hex: string }> = {
    Male: {
      bg: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-500",
      hex: "#3b82f6",
    },
    Female: {
      bg: "bg-pink-500",
      text: "text-pink-500",
      border: "border-pink-500",
      hex: "#ec4899",
    },
  }

  static AGE_GROUP_COLORS: Record<AgeGroup, { bg: string; text: string; border: string; hex: string }> = {
    "< 30": {
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      border: "border-emerald-500",
      hex: "#10b981",
    },
    "30 - 49": {
      bg: "bg-amber-500",
      text: "text-amber-500",
      border: "border-amber-500",
      hex: "#f59e0b",
    },
    "> 50": {
      bg: "bg-purple-500",
      text: "text-purple-500",
      border: "border-purple-500",
      hex: "#a855f7",
    },
    Unknown: {
      bg: "bg-slate-500",
      text: "text-slate-500",
      border: "border-slate-500",
      hex: "#64748b",
    },
  }

  static ROLE_COLORS: Record<CompanyRole, { bg: string; text: string; border: string; hex: string; badge: string }> = {
    Director: {
      bg: "bg-amber-500",
      text: "text-amber-500",
      border: "border-amber-500",
      hex: "#f59e0b",
      badge:
        "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700",
    },
    Shareholder: {
      bg: "bg-teal-500",
      text: "text-teal-500",
      border: "border-teal-500",
      hex: "#14b8a6",
      badge: "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300 dark:border-teal-700",
    },
    Officer: {
      bg: "bg-indigo-500",
      text: "text-indigo-500",
      border: "border-indigo-500",
      hex: "#6366f1",
      badge:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700",
    },
    "Director & Shareholder": {
      bg: "bg-teal-500",
      text: "text-teal-500",
      border: "border-teal-500",
      hex: "#14b8a6",
      badge: "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300 dark:border-teal-700",
    },
  }

  static PROXIMITY_COLORS: Record<ProximityTier, { bg: string; text: string; border: string; hex: string }> = {
    "< 5 km": {
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      border: "border-emerald-500",
      hex: "#10b981",
    },
    "5 - 15 km": {
      bg: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-500",
      hex: "#3b82f6",
    },
    "15 - 50 km": {
      bg: "bg-orange-500",
      text: "text-orange-500",
      border: "border-orange-500",
      hex: "#f97316",
    },
    "> 50 km": {
      bg: "bg-violet-600",
      text: "text-violet-600",
      border: "border-violet-600",
      hex: "#7c3aed",
    },
  }

  // static BUSINESS_NATURE_COLORS: Record<BusinessNature, { hex: string; bg: string; text: string }> = {
  //   "Technology & Software": { hex: "#0284c7", bg: "bg-sky-600", text: "text-sky-600" },
  //   "Financial & Professional Services": { hex: "#059669", bg: "bg-emerald-600", text: "text-emerald-600" },
  //   "Retail & E-Commerce": { hex: "#d97706", bg: "bg-amber-600", text: "text-amber-600" },
  //   "Manufacturing & Industrial": { hex: "#dc2626", bg: "bg-red-600", text: "text-red-600" },
  //   "Food & Beverage": { hex: "#ea580c", bg: "bg-orange-600", text: "text-orange-600" },
  //   "Healthcare & Wellness": { hex: "#0d9488", bg: "bg-teal-600", text: "text-teal-600" },
  //   "Construction & Real Estate": { hex: "#78350f", bg: "bg-yellow-900", text: "text-yellow-800" },
  //   "Logistics & Transportation": { hex: "#4f46e5", bg: "bg-indigo-600", text: "text-indigo-600" },
  //   "Consulting & Legal": { hex: "#7c3aed", bg: "bg-violet-600", text: "text-violet-600" },
  //   "Education & Training": { hex: "#db2777", bg: "bg-pink-600", text: "text-pink-600" },
  // }

  static STATE_COLORS: Record<MalaysiaState, { hex: string; bg: string }> = {
    "Kuala Lumpur": { hex: "#ef4444", bg: "bg-red-500" },
    Selangor: { hex: "#f97316", bg: "bg-orange-500" },
    Penang: { hex: "#06b6d4", bg: "bg-cyan-500" },
    Johor: { hex: "#3b82f6", bg: "bg-blue-500" },
    Perak: { hex: "#eab308", bg: "bg-yellow-500" },
    Melaka: { hex: "#ec4899", bg: "bg-pink-500" },
    "Negeri Sembilan": { hex: "#8b5cf6", bg: "bg-violet-500" },
    Pahang: { hex: "#10b981", bg: "bg-emerald-500" },
    Terengganu: { hex: "#14b8a6", bg: "bg-teal-500" },
    Kelantan: { hex: "#84cc16", bg: "bg-lime-500" },
    Kedah: { hex: "#6366f1", bg: "bg-indigo-500" },
    Perlis: { hex: "#a855f7", bg: "bg-purple-500" },
    Sabah: { hex: "#0284c7", bg: "bg-sky-600" },
    Sarawak: { hex: "#059669", bg: "bg-emerald-600" },
    Putrajaya: { hex: "#d946ef", bg: "bg-fuchsia-500" },
    Labuan: { hex: "#64748b", bg: "bg-slate-500" },
    "(Not in Malaysia)": { hex: "#64748b", bg: "bg-slate-500" },
  }

  static MALAYSIA_STATE_COORDINATES: Record<MalaysiaState, { lat: number; lng: number; zoom: number }> = {
    "Kuala Lumpur": { lat: 3.139, lng: 101.6869, zoom: 12 },
    Selangor: { lat: 3.0738, lng: 101.5183, zoom: 10 },
    Penang: { lat: 5.4164, lng: 100.3327, zoom: 11 },
    Johor: { lat: 1.4854, lng: 103.7618, zoom: 10 },
    Perak: { lat: 4.5921, lng: 101.0901, zoom: 10 },
    Melaka: { lat: 2.1896, lng: 102.2501, zoom: 12 },
    "Negeri Sembilan": { lat: 2.7258, lng: 101.9424, zoom: 11 },
    Pahang: { lat: 3.8126, lng: 103.3256, zoom: 9 },
    Terengganu: { lat: 5.3117, lng: 103.1324, zoom: 9 },
    Kelantan: { lat: 6.1254, lng: 102.2381, zoom: 9 },
    Kedah: { lat: 6.1184, lng: 100.3685, zoom: 10 },
    Perlis: { lat: 6.4449, lng: 100.2048, zoom: 12 },
    Sabah: { lat: 5.9804, lng: 116.0735, zoom: 8 },
    Sarawak: { lat: 1.5533, lng: 110.3592, zoom: 8 },
    Putrajaya: { lat: 2.9264, lng: 101.6964, zoom: 13 },
    Labuan: { lat: 5.2831, lng: 115.2308, zoom: 12 },
    "(Not in Malaysia)": { lat: 5.2831, lng: 115.2308, zoom: 12 },
  }

  static getUserMarkerColor(user: UserLocation, mode: UserCategoryMode): string {
    if (mode === "gender") {
      return this.GENDER_COLORS[user.gender]?.hex || "#3b82f6"
    }
    if (mode === "age_group") {
      return this.AGE_GROUP_COLORS[user.ageGroup]?.hex || "#10b981"
    }
    // mode === 'role'
    return this.ROLE_COLORS[user.role]?.hex || "#f59e0b"
  }

  static getCompanyMarkerColor(company: CompanyLocation, mode: CompanyCategoryMode): string {
    if (mode === "state") {
      return this.STATE_COLORS[company.state]?.hex || "#3b82f6"
    }
    if (mode === "proximity") {
      return company.proximityTier ? this.PROXIMITY_COLORS[company.proximityTier]?.hex || "#3b82f6" : "#3b82f6"
    }

    return ""
    // mode === 'business_nature'
    // return BUSINESS_NATURE_COLORS[company.businessNature]?.hex || "#0284c7"
  }
}
