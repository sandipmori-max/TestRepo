import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDBConnection,
  createAccountsTable,
  insertAccount,
  updateAccountActive,
  getAccounts,
  getActiveAccount,
  removeAccount as sqliteRemoveAccount,
} from '../../../utils/sqlite';
import { Account, User } from './type';
import { DevERPService } from '../../../services/api';

export const checkAuthStateThunk = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { rejectWithValue }) => {
    try {
      const db = await getDBConnection();
      await createAccountsTable(db);
      const accounts = await getAccounts(db);
      const activeAccount = await getActiveAccount(db);

      if (activeAccount?.user?.token && activeAccount?.user?.tokenValidTill) {
        const validTill =
          typeof activeAccount.user.tokenValidTill === 'number'
            ? new Date(activeAccount.user.tokenValidTill * 1000)
            : new Date(activeAccount.user.tokenValidTill);

        if (validTill.getTime() > Date.now()) {
          return {
            accounts,
            activeAccountId: activeAccount.id,
            user: activeAccount.user,
          };
        }
      }

      // token invalid/expired → refresh
      await DevERPService.getAuth();

      const updatedAccounts = await getAccounts(db);
      const updatedActiveAccount = await getActiveAccount(db);

      return {
        accounts: updatedAccounts,
        activeAccountId: updatedActiveAccount?.id || null,
        user: updatedActiveAccount?.user || null,
      };
    } catch (error) {
      console.error('Error checking auth state:', error);
      return rejectWithValue('Failed to check authentication state');
    }
  },
);

export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async (
    {
      newToken,
      newvalidTill,
      company_code,
      password,
      isAddingAccount = false,
      user_credentials,
      response,
      companyData,
    }: {
      company_code: string;
      password: string;
      isAddingAccount?: boolean;
      newToken?: string;
      newvalidTill?: string;
      user_credentials?: { user: string; name?: string };
      response;
      companyData;
    },
    { rejectWithValue },
  ) => {
    try {
      const token = isAddingAccount ? newToken : await AsyncStorage.getItem('erp_token');
      
      const tokenValidTill = isAddingAccount
        ? newvalidTill
        : await AsyncStorage.getItem('erp_token_valid_till');

      if (!token) {
        return rejectWithValue('No authentication token found. Please login again.');
      }

      await AsyncStorage.setItem('auth_token', token);

      const erpUser: User = {
        id: response?.userid,
        name: user_credentials?.name || user_credentials?.user || company_code.toUpperCase(),
        company_code: company_code,
        avatar: `https://ui-avatars.com/api/?name=${(
          user_credentials?.name ||
          user_credentials?.user ||
          company_code
        ).toUpperCase()}&background=007AFF&color=fff`,
        accountType: 'erp',
        token: token,
        tokenValidTill: tokenValidTill,
        emailid: response?.emailid || '',
        fullname: response?.fullname,
        mobileno: response?.mobileno,
        roleid: response?.roleid,
        rolename: response?.rolename,
        username: response?.username,
        companyLink: companyData?.response?.link,
        companyName: companyData?.response?.name,
        app_id: response?.app_id,
      };
      console.log('🚀 ~ erpUser:------------------', erpUser);

      const db = await getDBConnection();
      await createAccountsTable(db);
      const currentAccounts = await getAccounts(db);
      const existingAccount = currentAccounts?.find(
        (acc: Account) => acc.user.company_code === company_code,
      );

      if (existingAccount && !isAddingAccount) {
        await updateAccountActive(db, existingAccount?.id);
        return {
          user: existingAccount.user,
          accountId: existingAccount.id,
          isNewAccount: false,
        };
      }

      const newAccount: Account = {
        id: erpUser?.id,
        user: erpUser,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
      };

      for (const acc of currentAccounts ?? []) {
        await insertAccount(db, { ...acc, isActive: false });
      }

      await insertAccount(db, newAccount);
      await updateAccountActive(db, newAccount?.id);
      const updatedAccounts = await getAccounts(db);

      return {
        user: erpUser,
        accountId: erpUser?.id,
        isNewAccount: true,
        accounts: updatedAccounts,
      };
    } catch (error: any) {
      console.log('Login error:', error);
      return rejectWithValue(error?.message || 'Login failed. Please try again.');
    }
  },
);

export const switchAccountThunk = createAsyncThunk(
  'auth/switchAccount',
  async (accountId: string, { rejectWithValue }) => {
    try {
      const db = await getDBConnection();
      await createAccountsTable(db);
 
      await updateAccountActive(db, accountId);
      const accounts = await getAccounts(db);
       const targetAccount = accounts?.find((acc: Account) => acc?.id === accountId);
 
      if (!targetAccount) {
        return rejectWithValue('Account not found');
      }

      if (targetAccount?.user?.token) {
        const tokenValidTill = targetAccount.user.tokenValidTill;
        if (tokenValidTill) {
          const validTill = new Date(tokenValidTill);
          if (validTill > new Date()) {
            await AsyncStorage.setItem('erp_token', targetAccount?.user?.token || '');
            await AsyncStorage.setItem('auth_token', targetAccount?.user?.token || '');
            DevERPService.setToken(targetAccount?.user?.token);
             return {
              user: targetAccount.user,
              accountId,
              accounts,
            };
          }
        }
      }
      await DevERPService.getAuth();
      const updatedAccounts = await getAccounts(db);
      const updatedActiveAccount = await getActiveAccount(db);

      return {
        accounts: updatedAccounts,
        activeAccountId: updatedActiveAccount?.id || null,
        user: updatedActiveAccount?.user || null,
      };
    } catch (error) {
      console.error('Error switching account:', error);
      return rejectWithValue('Failed to switch account');
    }
  },
);

export const removeAccountThunk = createAsyncThunk(
  'auth/removeAccount',
  async (accountId: string, { rejectWithValue }) => {
    try {
      const db = await getDBConnection();
      await createAccountsTable(db);
      await sqliteRemoveAccount(db, accountId);
      const updatedAccounts = await getAccounts(db);
      let newActiveAccountId = null;
      let newActiveAccount = null;
      if (updatedAccounts && updatedAccounts?.length > 0) {
        const wasActive = !updatedAccounts.some(acc => acc.isActive);
        if (wasActive) {
          await updateAccountActive(db, updatedAccounts[0].id);
        }
        const activeAccount = await getActiveAccount(db);
        newActiveAccountId = activeAccount?.id || null;
        newActiveAccount = activeAccount?.user || null;
      }
      return {
        accounts: updatedAccounts,
        user: newActiveAccount,
        activeAccountId: newActiveAccountId,
      };
    } catch (error) {
      console.error('Error removing account:', error);
      return rejectWithValue('Failed to remove account');
    }
  },
);

export const logoutUserThunk = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await DevERPService.clearData();
      await AsyncStorage.multiRemove([
        'auth_token',
        'refresh_token',
        'token_expires_at',
        'erp_link',
        'erp_token',
        'erp_token_valid_till',
        'erp_appid',
      ]);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      await AsyncStorage.multiRemove([
        'auth_token',
        'refresh_token',
        'token_expires_at',
        'erp_link',
        'erp_token',
        'erp_token_valid_till',
        'erp_appid',
      ]);
      return { success: true };
    }
  },
);

export const validateCompanyCodeThunk = createAsyncThunk(
  'auth/validateCompanyCode',
  async ({ companyCode, user }: { companyCode: string; user: string }, { rejectWithValue }) => {
    try {
      const result = await DevERPService.validateCompanyCode(companyCode, user);
      return result;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to validate company code');
    }
  },
);

export const getERPMenuThunk = createAsyncThunk(
  'auth/getERPMenu',
  async (_, { rejectWithValue }) => {
    try {
      const response = await DevERPService.getMenu();

      if (response && typeof response === 'string') {
        return response;
      } else if (response && typeof response === 'object') {
        return response;
      }

      return rejectWithValue('Invalid menu response format');
    } catch (error: any) {
      console.error('🚀 ~ getERPMenuThunk ~ error:', error);
      return rejectWithValue(error?.message || 'Failed to get ERP menu');
    }
  },
);

export const getERPDashboardThunk = createAsyncThunk(
  'auth/getERPDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const dashboard = await DevERPService.getDashboard();
      return dashboard;
    } catch (error: any) {
      console.log('🚀 ~ error:', error);
      return rejectWithValue(error?.message || 'Failed to get ERP dashboard');
    }
  },
);

export const getERPPageThunk = createAsyncThunk<
  any,
  { page: string; id: string },
  { rejectValue: string }
>('auth/getERPPage', async ({ page, id }, { rejectWithValue }) => {
  try {
    const pageData = await DevERPService.getPage(page, id);
    return pageData;
  } catch (error: any) {
    console.log('🚀 ~ error:', error);
    return rejectWithValue(error || 'Failed to get ERP page data');
  }
});

export const getERPListDataThunk = createAsyncThunk(
  'auth/getERPListData',
  async (
    {
      page,
      fromDate,
      toDate,
      param,
    }: { page: string; fromDate: string; toDate: string; param?: string },
    { rejectWithValue },
  ) => {
    try {
      const listData = await DevERPService.getListData(page, fromDate, toDate, param);
      return listData;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to get ERP list data');
    }
  },
);
