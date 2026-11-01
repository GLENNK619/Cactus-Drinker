# CactusDrop Security Specification & TDD Verification

## 1. Data Invariants
- **Identity Isolation**: A user can only access, create, read, and mutate their own profile (`/users/{userId}`) where `userId == request.auth.uid`.
- **Subcollection Ownership**: All daily hydration entries in `/users/{userId}/dailyRecords/{recordId}` are strictly owned by `userId == request.auth.uid`. Cross-user inspection or manipulation is completely rejected.
- **Strict Key Control**: Profile and record updates must not contain unallowed shadow fields or prototype pollution keys.
- **Value Integrity**: Growth percentage is bounded between 0 and 100. Streak values must be non-negative integers.
- **Identity Immutability**: The `uid` in `users/{userId}` and `userId` in `dailyRecords/{recordId}` can never be transferred or rewritten to a different user ID.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Profile Access**: Anonymous read of `/users/user_alice` without valid `request.auth`.
2. **Cross-User Profile Read**: `user_bob` attempting `get()` on `/users/user_alice`.
3. **Cross-User Profile Write**: `user_bob` attempting `setDoc()` or `updateDoc()` on `/users/user_alice`.
4. **UID Spoofing on Create**: Authenticated `user_alice` creating `/users/user_alice` with `{ uid: "user_bob" }`.
5. **Subcollection Hijack**: Authenticated `user_bob` attempting to create `/users/user_alice/dailyRecords/2026-11-01`.
6. **Negative Streak Injection**: Updating profile with `{ currentStreak: -5 }`.
7. **Negative Hydration Target**: Updating profile with `{ dailyGoal: -500 }`.
8. **Growth Overcharge Exploit**: Updating `cactusGrowthPercentage: 9999` (bypassing 100% max).
9. **Shadow Admin Escalation**: Injecting `{ isAdmin: true, role: "superadmin" }` into user profile.
10. **Oversized String Buffer Attack**: Writing a 2MB spam payload to `displayName`.
11. **Altered Record Ownership**: Updating an existing daily record to change `userId` to another user.
12. **Path Traversal / Malicious ID Injection**: Creating daily records with path injection strings like `../../etc`.

## 3. Test Runner Specification
See `firestore.rules.test.ts` for automated unit tests that verify all 12 attack vectors result in PERMISSION_DENIED.
