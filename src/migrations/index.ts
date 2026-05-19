import * as migration_20260519_200413_entitlements_and_promotion_codes from './20260519_200413_entitlements_and_promotion_codes';

export const migrations = [
  {
    up: migration_20260519_200413_entitlements_and_promotion_codes.up,
    down: migration_20260519_200413_entitlements_and_promotion_codes.down,
    name: '20260519_200413_entitlements_and_promotion_codes'
  },
];
