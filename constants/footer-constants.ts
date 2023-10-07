type MENU_ITEM = {
  label: string,
  expanded?: boolean,
  children?: MENU_CHILD[]
}

type MENU_CHILD = {
  label: string;
  link: string;
}

export type FOOTER_MENU_ITEM = {
  label: string;
  queryParams: any;
}

export const FOOTER_MENU: MENU_ITEM[] = [
  {
    label: 'Help & Services',
    expanded: false,
    children: [
      {
        label: 'How to Make a Claim',
        link: 'https://www.allianz.com.my/personal/help-and-services/how-to-and-faqs/how-to-make-a-claim.html'
      },
      {
        label: 'How to Make a Payment',
        link: 'https://www.allianz.com.my/personal/help-and-services/how-to-and-faqs/how-to-make-a-payment.html'
      },
      {
        label: 'Policy Self Service',
        link: 'https://www.allianz.com.my/personal/help-and-services/how-to-and-faqs/policy-self-service.html'
      },
      {
        label: 'What to Expect From Your Life Agent',
        link: 'https://www.allianz.com.my/personal/help-and-services/how-to-and-faqs/what-to-expect-from-your-life-agent.html'
      },
      {
        label: 'Fund Resources',
        link: 'https://www.allianz.com.my/personal/help-and-services/fund-resources.html'
      },
    ]
  },
  {
    label: 'Our Products',
    expanded: false,
    children: [
      {
        label: 'Life Protection',
        link: 'https://www.allianz.com.my/personal/life-health-and-savings/life-protection.html'
      },
      {
        label: 'Medical & Hospitalisation',
        link: 'https://www.allianz.com.my/personal/life-health-and-savings/medical-and-hospitalisation.html'
      },
      {
        label: 'Personal Accident',
        link: 'https://www.allianz.com.my/personal/life-health-and-savings/personal-accident.html'
      },
      {
        label: 'Car & Motorcycle',
        link: 'https://www.allianz.com.my/personal/home-motor-and-travel/car-and-motorcycle.html'
      },
      {
        label: 'Roadside Assistance',
        link: 'https://www.allianz.com.my/personal/home-motor-and-travel/roadside-assistance.html'
      },
    ]
  },
  {
    label: 'Why Choose Allianz',
    children: [
      {
        label: 'Background & Core Values',
        link: 'https://www.allianz.com.my/personal/allianz-at-a-glance/about-allianz/background-and-core-values.html'
      },
      {
        label: 'Service Charter',
        link: 'https://www.allianz.com.my/personal/allianz-at-a-glance/about-allianz/service-charters.html'
      },
      {
        label: 'Investor Relations',
        link: 'https://www.allianz.com.my/personal/allianz-at-a-glance/investor-relations.html'
      },
      {
        label: 'Corporate Careers',
        link: 'https://www.allianz.com.my/personal/allianz-at-a-glance/careers/corporate-careers.html'
      },
      {
        label: 'Our Agents',
        link: 'https://www.allianz.com.my/personal/allianz-at-a-glance/careers/agents.html'
      },
    ]
  },
  {
    label: 'Our Unique Offerings',
    children: [
      {
        label: 'Allianz We Care Community',
        link: 'https://www.allianz.com.my/personal/whats-new/allianz-we-care-community.html'
      },
      {
        label: 'Blue Ribbon',
        link: 'https://www.allianz.com.my/personal/whats-new/blue-ribbon.html'
      },
      {
        label: 'Friends of Allianz',
        link: 'https://www.allianz.com.my/personal/whats-new/friends-of-allianz.html'
      },
      {
        label: 'Allianz Road Rangers',
        link: 'https://www.allianz.com.my/personal/whats-new/allianz-road-rangers.html'
      },
    ]
  }
];


export const FOOTER_MENU_LINK: FOOTER_MENU_ITEM[] = [
  {
    label: 'Legal Notes',
    queryParams: 'https://www.allianz.com.my/personal/legal-notes.html'
  },
  {
    label: 'Privacy Statement',
    queryParams: 'https://www.allianz.com.my/personal/privacy-statement.html'
  },
  {
    label: 'Terms of Use',
    queryParams: 'https://www.allianz.com.my/personal/terms-of-use.html'
  },
];