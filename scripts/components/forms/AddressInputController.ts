import { City, Country, Location, PostcodeMapping, State } from "~/scripts/models/Location"
import { usePostcodeStore } from "#imports"
import { useCityStore } from "~/stores/Cities"
import { useStateStore } from "#imports"
import { useCountryStore } from "#imports"
import { StringUtil } from "~/scripts/utils/String"
import { Filter } from "~/scripts/library/Filter"

export class AddressInputController {
  addressLine1 = ref<string | null>(null)
  addressLine2 = ref<string | null>(null)
  postcode = ref<string | null>(null)
  cities = ref<City[]>([])
  selectedCity = ref<City | null>(null)
  states = ref<State[]>([])
  selectedState = ref<State | null>(null)
  countries = ref<Country[]>([])
  selectedCountry = ref<Country | null>()

  postcodeRepository = usePostcodeStore()
  cityRepository = useCityStore()
  stateRepository = useStateStore()
  countryRepository = useCountryStore()

  emitEvents: any | null = null
  initialLocation: Location | null = null

  constructor(emitEvents: any | null, location: Location | null = null) {
    this.emitEvents = emitEvents
    this.initialLocation = location
    this.setLocationValues(location)
    this.init()
  }

  setLocation(location: Location | null): void {
    this.initialLocation = location
    this.setLocationValues(location)
  }

  setLocationValues(location: Location | null): void {
    if (location) {
      this.addressLine1.value = location.addressLine1
      this.addressLine2.value = location.addressLine2
      this.postcode.value = location.postcode
      if (location.city) {
        this.selectedCity.value = new City(location.city)
      }
      if (location.state) {
        this.selectedState.value = new State(location.state)
      }
      if (location.country) {
        this.selectedCountry.value = new Country(location.country)
      }
    }
  }

  async init(): Promise<void> {
    await Promise.all([this.fetchCountries(), this.fetchAllStates()])
  }

  async fetchCountries(): Promise<void> {
    await this.countryRepository.fetchAll()
    if (!this.countryRepository.error) {
      this.countries.value = this.countryRepository.countries.map((country: Country) => {
        return new Country(country)
      })

      // Only set default country if no initial location country was provided
      if (this.selectedCountry.value && this.selectedCountry.value.id > 0) {
        // Find and use the matching country from fetched list to ensure full data
        const matchingCountry = this.countries.value.find((c: Country) => c.id === this.selectedCountry.value?.id)
        if (matchingCountry) {
          this.selectedCountry.value = new Country(matchingCountry)
        }
      } else if (this.countryRepository.totalCountries > 0) {
        this.selectedCountry.value = new Country(this.countries.value[0])
      }
      this.emitEvents("updateCountry", this.selectedCountry.value)
    }
  }

  async fetchAllStates(): Promise<void> {
    //State - fetch endpoint requires country id. 87 is the default malaysia's country id
    let countryId = this.selectedCountry.value && this.selectedCountry.value.id > 0 ? this.selectedCountry.value.id : 87
    await this.stateRepository.byCountryId(countryId)
    if (!this.stateRepository.error) {
      this.states.value = this.stateRepository.states.map((state: State) => {
        return new State(state)
      })
    }

    if (this.selectedState.value && this.selectedState.value.id > 0) {
      return
    }

    //Fetch cities for first Selangor & KL
    let selangorKL = this.states.value.filter((state: State) => {
      return state.name === "Kuala Lumpur" || state.name === "Selangor"
    })
    let tempContainer: City[] = []
    for (let s = 0; s < selangorKL.length; s++) {
      await this.cityRepository.byStateId(selangorKL[s].id)
      if (!this.cityRepository.error) {
        tempContainer = tempContainer.concat(
          this.cityRepository.cities.map((city: City) => {
            return new City(city)
          })
        )
      }
    }
    this.cities.value = tempContainer
  }

  async onStateChanged(): Promise<void> {
    this.emitEvents("updateState", this.selectedState.value)

    if (!this.selectedState.value) {
      return
    }

    await this.cityRepository.byStateId(this.selectedState.value.id)
    if (!this.cityRepository.error) {
      this.cities.value = this.cityRepository.cities.map((city: City) => {
        return new City(city)
      })

      if (this.selectedCity.value) {
        let tempToClone = this.cities.value.find((city: City) => {
          return city.id === this.selectedCity.value?.id
        })
        this.selectedCity.value = tempToClone ? new City(tempToClone) : null
      }
    }
  }

  onCityChanged(): void {
    this.emitEvents("updateCity", this.selectedCity.value)

    if (!this.selectedCity.value) {
      this.selectedState.value = null
      return
    }

    let tempToClone = this.states.value.find((state: State) => {
      return state.id === this.selectedCity.value?.stateId
    })
    this.selectedState.value = tempToClone ? new State(tempToClone) : null
  }

  async onPostcodeChanged(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.postcode.value) || this.postcodeRepository.isLoading) {
      return
    }

    let searchFilter = new Filter()
    searchFilter.searchText = this.postcode.value
    await this.postcodeRepository.search(searchFilter)
    if (!this.postcodeRepository.error && this.postcodeRepository.postcodes.length > 0) {
      let firstMatchWithCityId = this.postcodeRepository.postcodes.find((pm: PostcodeMapping) => {
        return pm.cityId !== null
      })

      if (!firstMatchWithCityId) {
        return
      }

      let tempToClone = this.states.value.find((state: State) => {
        return state.id === firstMatchWithCityId?.stateId
      })
      this.selectedState.value = tempToClone ? new State(tempToClone) : null
      await this.onStateChanged()

      if (firstMatchWithCityId.cityId) {
        if (this.selectedCity.value && this.selectedCity.value.stateId === this.selectedState.value?.id) {
          return
        }
        this.onCitySelected(firstMatchWithCityId.cityId)
      }

      this.onCountrySelected(87) //This works for now because we only have one country
    }
  }

  onCountrySelected(id: number): void {
    let tempToClone = this.countries.value.find((country: Country) => {
      return country.id === id
    })

    this.selectedCountry.value = tempToClone ? new Country(tempToClone) : null
    this.emitEvents("updateCountry", this.selectedCountry.value)
  }

  onStateSelected(id: number): void {
    let tempToClone = this.states.value.find((state: State) => {
      return state.id === id
    })

    this.selectedState.value = tempToClone ? new State(tempToClone) : null

    this.onStateChanged()
  }

  onCitySelected(id: number): void {
    let tempToClone = this.cities.value.find((city: City) => {
      return city.id === id
    })
    this.selectedCity.value = tempToClone ? new City(tempToClone) : null

    this.onCityChanged()
  }

  async onSearchCity(searchText: string): Promise<void> {
    if (this.cityRepository.isLoading) {
      setTimeout(() => {
        this.onSearchCity(searchText)
      }, 500)
    }

    let filter: Filter = new Filter()
    filter.searchText = searchText
    await this.cityRepository.search(filter)
    if (!this.cityRepository.error) {
      this.cities.value = this.cityRepository.cities.map((city: City) => {
        return new City(city)
      })
    }
  }
}
