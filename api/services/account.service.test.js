const { mongoose, AccountModel } = require('arroyo-erp-models');
const systemUserConstants = require('../../../constants/system-user');
const AccountService = require('./account.service');
const errors = require('../../../errors');
const testDB = require('../../test')(mongoose);

describe('SystemUserService', () => {
  const systemUserService = new SystemUserService(SystemUser, errors, mappersSystemUser);

  beforeAll(() => testDB.connect());

  afterAll(() => testDB.disconnect());

  describe('SystemUser Authenticate', () => {
    const testPassword = 'aabbccdd1234';
    const systemUserId = new mongoose.Types.ObjectId();
    const baseSystemUser = {
      _id: systemUserId,
      username: 'test',
      email: 'test@email.com',
    };
    const baseSystemUser2 = {
      _id: new mongoose.Types.ObjectId(),
      username: 'testusername3',
      email: 'test3@email.com',
    };

    beforeAll(async () => {
      baseSystemUser.password = await createHash(testPassword);
      baseSystemUser2.password = await createHash('abcde1234578.3');
      await SystemUser.create(baseSystemUser);
      await SystemUser.create(baseSystemUser2);
    });

    afterAll(() => SystemUser.deleteMany({}));

    test('should return systemUser doc if password is correct', async (done) => {
      const systemUser = await systemUserService
        .authenticate(baseSystemUser.username, testPassword);
      expect(systemUser.id).toEqual(systemUserId.toString());
      done();
    });

    test('should throw an error if user does not exist', async (done) => {
      try {
        await systemUserService.authenticate('notexistUsername', testPassword);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User not found');
        done();
      }
    });

    test('should throw an error if it is wrong password', async (done) => {
      try {
        await systemUserService.authenticate(baseSystemUser.username, 'wrongpassword');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User invalid login');
        done();
      }
    });

    test('should throw an error if user is blocked ', async (done) => {
      try {
        await systemUserService.authenticate(baseSystemUser2.username, baseSystemUser2.password);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User is blocked');
        done();
      }
    });
  });

  describe('Unblocked system user', () => {
    let blockedSystemUser = {
      username: 'test',
      email: 'test@email.com',
      loginRetryLeft: 0,
      blocked: true,
      passwordExpiryDate: moment().add(systemUserConstants.DEFAULT_PASSWORD_EXPIRE_MONTHS, 'month'),
      role: roleTypes.ADMIN,
    };

    beforeAll(async () => {
      blockedSystemUser.password = await createHash('Aabbccdd1234');
      blockedSystemUser = await SystemUser.create(blockedSystemUser);
    });

    afterAll(() => SystemUser.deleteMany({}));

    test('Fail went the user do not exist', async (done) => {
      try {
        await systemUserService.unblockSystemUser(new mongoose.Types.ObjectId());
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User not found');
        done();
      }
    });

    test('Success unblocked user', async (done) => {
      await systemUserService.unblockSystemUser(blockedSystemUser.id);
      const user = await systemUserService.SystemUserModel.findById(blockedSystemUser.id);
      expect(user.blocked).toBe(false);
      expect(user.loginRetryLeft).toBe(systemUserConstants.DEFAULT_LOGIN_RETRY_TRY);
      done();
    });
  });

  describe('Create system  user', () => {
    const passwordInvalidLenght = '1234';
    const newSystemUserPasswordInvalid = {
      username: 'test',
      email: 'test@email.com',
      password: passwordInvalidLenght,
    };
    const newSystemUserPasswordInvalid1 = {
      username: 'test',
      email: 'test@email.com',
      password: 'fdafasdf',
    };
    const newSystemUserPasswordInvalid2 = {
      username: 'test',
      email: 'test@email.com',
      password: 'AAAAAAAA',
    };
    // this is to create a new user with the password
    const newSystemUser = {
      _id: new mongoose.Types.ObjectId(),
      username: 'test',
      email: 'test@email.com',
      password: 'Prueb4555',
      loginRetryLeft: systemUserConstants.DEFAULT_LOGIN_RETRY_TRY,
      passwordExpiryDate: moment().add(systemUserConstants.DEFAULT_PASSWORD_EXPIRE_MONTHS, 'month'),
      role: roleTypes.ADMIN,
    };
    const newSystemUserFailer = {
      username: 'test',
      email: 'tester@email.com',
      password: 'aAbbCcDd',
    };
    const newSystemUserFailer2 = {
      username: 'test1',
      email: 'test@email.com',
      password: 'Aabbccdd1234',
    };
    const newSystemUser2 = {
      username: 'test2',
      email: 'test2@email.com',
      password: 'Aabbccdd1234',
      role: roleTypes.ADMIN,
    };

    beforeAll(async () => {
      newSystemUser.password = await createHash('Aabbccdd1234');
      await systemUserService.SystemUserModel.create(newSystemUser);
    });

    afterAll(() => systemUserService.SystemUserModel.deleteMany({}));

    test('Fail went the user password has an invalid format, fail with length', async (done) => {
      try {
        await systemUserService.createSystemUser(newSystemUserPasswordInvalid);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User password has an invalid format');
        done();
      }
    });

    test('Fail went the user password has an invalid format, all is in lowercase', async (done) => {
      try {
        await systemUserService.createSystemUser(newSystemUserPasswordInvalid1);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User password has an invalid format');
        done();
      }
    });

    test('Fail went the user password has an invalid format, all is in uppercase', async (done) => {
      try {
        await systemUserService.createSystemUser(newSystemUserPasswordInvalid2);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User password has an invalid format');
        done();
      }
    });

    test('Fail went the username already exist', async (done) => {
      try {
        await systemUserService.createSystemUser(newSystemUserFailer);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User already exists');
        done();
      }
    });

    test('Fail went the email already exist', async (done) => {
      try {
        await systemUserService.createSystemUser(newSystemUserFailer2);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User already exists');
        done();
      }
    });

    test('Went it is success', async (done) => {
      const newUserId = await systemUserService.createSystemUser(newSystemUser2);
      const user = await systemUserService.SystemUserModel.findOne({ _id: newUserId._id });

      expect(user).not.toBe(null);
      expect(user.passwordHistory.length).toBe(1);
      expect(user.loginRetryLeft).toBe(5);
      expect(user.blocked).toBe(false);
      expect(await compareTextToHash(newSystemUser2.password, user.password)).toBe(true);
      expect(user.passwordDate).not.toBe(null);
      expect(user.passwordExpiredDate).not.toBe(null);

      const timestampPasswordExpiredDate = Number(moment(user.passwordExpiryDate).format('X'));
      const timestampPasswordDate = Number(moment(user.passwordDate).format('X'));
      expect(timestampPasswordExpiredDate).toBeGreaterThan(timestampPasswordDate);
      done();
    });
  });

  describe('GET system users', () => {
    const newSystemUser = {
      username: 'test',
      email: 'test@email.com',
      loginRetryLeft: 0,
      passwordExpiryDate: moment().add(systemUserConstants.DEFAULT_PASSWORD_EXPIRE_MONTHS, 'month'),
      role: roleTypes.ADMIN,
    };

    const newSystemUser1 = {
      username: 'test1',
      email: 'test1@email.com',
      loginRetryLeft: 0,
      passwordExpiryDate: moment().add(systemUserConstants.DEFAULT_PASSWORD_EXPIRE_MONTHS, 'month'),
      role: roleTypes.ADMIN,
    };

    const newSystemUser2 = {
      username: 'test2',
      email: 'test2@email.com',
      loginRetryLeft: 0,
      passwordExpiryDate: moment().add(systemUserConstants.DEFAULT_PASSWORD_EXPIRE_MONTHS, 'month'),
      role: roleTypes.ADMIN,
    };

    const newSystemUser3 = {
      username: 'test3',
      email: 'test3@email.com',
      loginRetryLeft: 0,
      passwordExpiryDate: moment().add(systemUserConstants.DEFAULT_PASSWORD_EXPIRE_MONTHS, 'month'),
      role: roleTypes.ADMIN,
    };

    beforeAll(async () => {
      const passwordHash = await createHash('aAbbCcDd');
      newSystemUser.password = passwordHash;
      newSystemUser1.password = passwordHash;
      newSystemUser2.password = passwordHash;
      newSystemUser3.password = passwordHash;

      await SystemUser.create(newSystemUser);
      await SystemUser.create(newSystemUser1);
      await SystemUser.create(newSystemUser2);
      await SystemUser.create(newSystemUser3);
    });

    afterAll(() => SystemUser.deleteMany({}));

    test('Success to get users', async (done) => {
      const users = await systemUserService.getSystemUsers();
      expect(users.length).toBe(4);
      done();
    });
  });

  describe('GET system user', () => {
    const newSystemUser = {
      _id: new mongoose.Types.ObjectId(),
      username: 'test',
      email: 'test@email.com',
      loginRetryLeft: 0,
      blocked: true,
      passwordExpiryDate: moment().add(systemUserConstants.DEFAULT_PASSWORD_EXPIRE_MONTHS, 'month'),
      role: roleTypes.ADMIN,
    };

    beforeAll(async () => {
      const passwordHash = await createHash('Aabbccdd1234');
      newSystemUser.password = passwordHash;
      await SystemUser.create(newSystemUser);
    });

    afterAll(() => SystemUser.deleteMany({}));

    test('Fail went the user do not exist', async (done) => {
      try {
        await systemUserService.getSystemUser(new mongoose.Types.ObjectId());
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User not found');
        done();
      }
    });

    test('Success to get user', async (done) => {
      const user = await systemUserService.getSystemUser(newSystemUser._id);
      expect(user.username).toBe(newSystemUser.username);
      expect(user.email).toBe(newSystemUser.email);
      expect(user.password).not.toBe('Aabbccdd1234');
      done();
    });
  });

  describe('Change Password system user', () => {
    const newPassword = 'aAbbCcDd';
    const oldPassword = 'Aabbccdd1234';
    const newSystemUser = {
      _id: new mongoose.Types.ObjectId(),
      username: 'test',
      email: 'test@email.com',
      loginRetryLeft: 5,
      blocked: false,
      passwordExpiryDate: moment().add(2, 'month'),
      role: roleTypes.ADMIN,
    };

    beforeAll(async () => {
      const passwordHash = await createHash(oldPassword);
      newSystemUser.password = passwordHash;
      newSystemUser.passwordHistory = [passwordHash];
      await SystemUser.create(newSystemUser);
    });

    afterAll(() => SystemUser.deleteMany({}));

    test('Fail went the user do not exist', async (done) => {
      try {
        await systemUserService.changePassword(new mongoose.Types.ObjectId(),
          oldPassword,
          'aAbbCcDd');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User not found');
        done();
      }
    });

    test('Fail went new password has a invalid format', async (done) => {
      try {
        await systemUserService.changePassword(newSystemUser._id, oldPassword, '123');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('User password has an invalid format');
        done();
      }
    });

    test('Fail went old password is not correct', async (done) => {
      try {
        await systemUserService.changePassword(newSystemUser._id, 'aAbbCcDd1256', '123');
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toEqual('Password Invalid');
        done();
      }
    });

    test('Success change password user', async (done) => {
      await systemUserService.changePassword(newSystemUser._id, oldPassword, newPassword);
      const systemUser = await SystemUser.findById(newSystemUser._id);

      expect(systemUser.passwordHistory.length).toBeGreaterThanOrEqual(1);
      expect(await compareTextToHash(newPassword,
        systemUser.passwordHistory[1])).toBe(true);
      expect(await compareTextToHash(oldPassword,
        systemUser.passwordHistory[0])).toBe(true);
      expect(await compareTextToHash(newPassword, systemUser.password)).toBe(true);
      expect(systemUser).toHaveProperty('passwordDate');
      expect(systemUser).toHaveProperty('passwordExpiryDate');
      done();
    });
  });
});
