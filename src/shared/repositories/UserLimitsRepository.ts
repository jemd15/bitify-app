export interface UserLimits {
  maxHouses: number;
}

export interface UserLimitsRepository {
  findByUserType(userType: string): Promise<UserLimits>;
}

export class UserLimitsRepositoryImpl implements UserLimitsRepository {
  async findByUserType(userType: string): Promise<UserLimits> {
    if (userType === 'pro') {
      return { maxHouses: 999 };
    }

    return { maxHouses: 1 };
  }
}
