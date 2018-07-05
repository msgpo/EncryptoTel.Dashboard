export class ContactModel {
  constructor(public company: string,
              public countryId: number,
              public department: string,
              public firstname: string,
              public lastname: string,
              public contactAddresses: Contact[],
              public contactEmails: Contact[],
              public contactPhones: Contact[],
              public tablePhone?: string,
              public tableEmail?: string,
              public countryName?: string,
              public id?: number) {}
}

export class Contact {
  constructor(public value: string,
              public typeId: null | string | undefined,
              public extension?: string,
              public id?: number) {}
}

export class Country {
  constructor(public id: number,
              public code: string,
              public title: string) {}
}

export class Countries {
  constructor(public countries: Country[]) {}
}

export class Types {
  constructor(public contactAddress: object,
              public contactEmail: object,
              public contactPhone: PhoneTypes) {}
}

export class PhoneTypes {
  constructor(public type: string,
              public value: number) {}
}
