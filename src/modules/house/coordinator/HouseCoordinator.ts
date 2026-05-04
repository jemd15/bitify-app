import { router } from 'expo-router';

import { HOUSE_ROUTES } from '../constants/house.constants';

export class HouseCoordinator {
  static navigateToCreateHouse() {
    router.push(HOUSE_ROUTES.CREATE);
  }

  static navigateToHome() {
    router.replace(HOUSE_ROUTES.HOME);
  }

  static navigateToHouseDetail(houseId: string) {
    router.push({
      pathname: HOUSE_ROUTES.DETAIL,
      params: { id: houseId },
    });
  }

  static navigateToHouseRequired() {
    router.replace(HOUSE_ROUTES.HOUSE_REQUIRED);
  }

  static navigateToAcceptInvitation() {
    router.replace(HOUSE_ROUTES.ACCEPT_INVITATION);
  }

  static goBack() {
    router.back();
  }
}
