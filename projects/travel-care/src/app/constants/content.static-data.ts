export const data = {
  uspInfos: [
    {
      image: 'product-car-emergency.svg',
      header: 'Accidental death & permanent disablement',
      description:
        'Pays for accidental death and permanent disablement occurring during the period of travel.',
    },
    {
      image: 'Injury-and-Sickness.png',
      header: 'Medical expenses & other expenses',
      description:
        'Reimburses the actual necessary and reasonable medical, surgical or hospital charges and emergency dental treatment charges incurred as a result of accidental bodily injuries or death, illness during your travel.',
    },
    {
      image: 'Travel-Coverage.png',
      header: 'Travel coverage',
      description:
        'Includes coverage for luggage delay, travel delay, loss or damage to travel documents, personal luggage and personal valuables and many more',
    },
  ]
};

export const TRAVEL_DETAILS: any = [
  { label: 'Coverage type' },
  { label: 'Departure date' },
  { label: 'Expiry date' },
  { label: 'Journey from' },
  { label: 'Journey to' },
  { label: 'Mountaineering start date' },
  { label: 'Mountaineering end date' }
];

export const TRAVELLER_DETAILS: any = [
  { label: 'Full name as per ID' },
  { label: 'ID type' },
  { label: 'ID no.' },
  { label: 'Date of birth' },
  { label: 'Gender' },
  { label: 'Nationality' },
  { label: 'Relationship' },
  { label: 'Mobile no.' },
  { label: 'Email address' },
  { label: 'Mailing address' }
];


export const NOMINEE_DETAILS: any = [
  { label: '' },
  { label: 'Full name as per ID' },
  { label: 'ID type' },
  { label: 'ID no.' },
  { label: 'Relationship' },
  { label: 'Nationality' },
  { label: 'Percentage' }
];

export const TRGRPCODE: { [key: string]: string } = {
  FM: <any>"FAMILY",
  MS: <any>"MYSELF",
  MT: <any>"MULTIPLE TRAVELLERS",
}


export const TRDESTINATION: { [key: string]: string } = {
  ASI: <any>"Asia",
  DOM: <any>"Domestic",
  WRW1: <any>"Worldwide"
}

export const GENDER: { [key: string]: string } = {
  M: <any>"MALE",
  F: <any>"FEMALE"
}
