import { Location } from '../models/Location'

export default class SsmInformation {
  static ADDRESS_LIST = [
    {
      id: 'SSM Shah Alam, Selangor',
      name: 'SURUHANJAYA SYARIKAT MALAYSIA',
      location: new Location({
        address_line_1: '2, Jalan RU 3/9 A',
        address_line_2: 'Seksyen 3',
        postcode: '40000',
        city: { name: 'Shah Alam' },
        state: { name: 'Selangor' },
        country: { name: 'Malaysia' }
      })
    }
  ]
}

Object.freeze(SsmInformation)
