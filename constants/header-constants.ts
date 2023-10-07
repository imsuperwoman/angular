export const IMAGE_FOLDER = 'assets/images/ui/';

export type MENU_ITEM = {
  label: string;
  queryParams: any;
  target?: string;
};

export const HEADER_MENU: MENU_ITEM[] = [
  {
    label: 'Allianz Website',
    queryParams: 'https://www.allianz.com.my/personal.html',
    target: '_blank'
  }
]