import {
  faAppleAlt,
  faCoffee,
  faWineGlassAlt,
  faBirthdayCake,
  faConciergeBell,
  faEgg,
  faCookie,
  faLeaf,
  faMortarPestle,
  faSprayCan,
  faSeedling,
  faBox,
  faBeer
} from '@fortawesome/free-solid-svg-icons';

export default class Category {
  constructor(category) {
    this.category = category;
  }

  iconReturn() {
    switch (this.category) {
      case 'Beer, Wine and Spirit':
        return faBeer;
      case 'Food Cupboard and Breakfast Food':
        return faAppleAlt;
      case 'Beverages':
        return faCoffee;
      case 'Drinks':
        return faWineGlassAlt;
      case 'Cooking, Spices and Baking Ingredients':
        return faBirthdayCake;
      case 'Dried Beans, Grains & Rice':
        return faConciergeBell;
      case 'Breakfast Foods':
        return faEgg;
      case 'Herbs Spices & Seasoning':
        return faLeaf;
      case 'Biscuits, Candy and Chocolate':
        return faCookie;
      case 'Jams, Canned and Packaged Condiments':
        return faMortarPestle;
      case 'Household Supplies':
        return faSprayCan;
      case 'Condiments & Salad Dressings':
        return faSeedling;
      case 'Canned, Jarred & Packaged Foods':
        return faBox;
      default:
        return faCoffee;
    }
  }
}
