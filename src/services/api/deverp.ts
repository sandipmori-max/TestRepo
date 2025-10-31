import { Platform } from 'react-native';
import { generateGUID } from '../../utils/helpers';
import { getActiveAccount, getDBConnection } from '../../utils/sqlite';
import apiClient from './config';
import {
  DevERPResponse,
  LoginRequest,
  LoginResponse,
  TokenRequest,
  TokenResponse,
  MenuResponse,
  DashboardResponse,
  ListDataResponse,
  AttendanceResponse,
} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class DevERPService {
  private readonly baseUrl = '/devws';
  private link: string = '';
  private token: string = '';
  private tokenValidTill: string = '';
  private appid: string = generateGUID();
  private device: string = '';

  private async checkNetwork() {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) throw new Error('No internet connection');
  }

  private async ensureAuthToken(forceRefresh = false) {
    if (!forceRefresh && this.token && this.tokenValidTill) {
      if (new Date(this.tokenValidTill) > new Date()) return this.token;
    }

    const storedToken = await AsyncStorage.getItem('erp_token');
    const storedTokenValidTill = await AsyncStorage.getItem('erp_token_valid_till');
   
    if (storedToken && storedTokenValidTill && new Date(storedTokenValidTill) > new Date()) {
      this.token = storedToken;
      this.tokenValidTill = storedTokenValidTill;
      return this.token;
    }

    return this.getAuth();
  }

  private async apiCall<T>(endpoint: string, payload: any): Promise<T> {
    try {
      
      await this.checkNetwork();
      await this.ensureAuthToken();
      console.log("link", this.link)
      console.log("endpoint", endpoint)
      console.log("payload", payload)

      const response = await apiClient.post<T>(`${this.link}${endpoint}`, payload);
      console.log("🚀 ~ DevERPService ~ apiCall ~ response:", response)

      if (
        (response as any).data?.success === 0 &&
        (response as any).data?.message?.includes('Token Expire')
      ) {
        await this.ensureAuthToken(true);
        const retryResponse = await apiClient.post<T>(`${this.link}${endpoint}`, {
          ...payload,
          token: this.token,
        });
        return retryResponse.data;
      }

      return response.data;
    } catch (error) {
      console.log('🚀 ~ DevERPService ~ apiCall ~ error:', error);
      throw error;
    }
  }

  async getAppLink(code: string): Promise<DevERPResponse> {
    await this.checkNetwork();

    const response = await apiClient.post<DevERPResponse>(`${this.baseUrl}/appcode.aspx/getLink`, {
      code,
    });
    console.log("🚀 ~ DevERPService ~ getAppLink ~ response:", response)

    if (response.data.success === 1 && response.data.link) {

      if (Platform.OS !== 'ios' && response.data.link.startsWith('https://')) {
        this.link = response.data.link.replace(/^https:\/\//i, 'http://');
      }else{
         this.link =response.data.link;
      }
      await AsyncStorage.setItem('erp_link', this.link);
    }
    return response.data;
  }

  async validateCompanyCode(code: string) {
     
    try {
      console.log("code++++++++++++-------------", code)

      const response = await this.getAppLink(code);
      console.log("response-------------", response)
      return response.success === 1
        ? {
            isValid: true,
            appName: response?.name,
            appUrl: response?.link,
            message: 'Company code validated successfully',
            response: response
          }
        : { isValid: false, message: 'Invalid company code' };
    } catch (e){
      console.log("e*********************", e)
      return { isValid: false, message: 'Failed to validate company code' };
    }
  }

  async loginToERP(credentials: {
    user: string;
    pass: string;
    firebaseid?: string;
   }): Promise<LoginResponse> {
    console.log("log----------------------------" , this.link)

    await this.checkNetwork();
    const app_id = generateGUID();
    await AsyncStorage.setItem('appid', app_id)
    this.appid = app_id;
    this.link = (await AsyncStorage.getItem('erp_link')) || this.link;
    // if (!this.link) throw new Error('No ERP link available. Please validate company code first.');

    console.log(this.link)
    const loginData: LoginRequest = {
      user: credentials.user,
      pass: credentials.pass,
      appid: app_id,
      firebaseid: credentials.firebaseid || '',
      device: this.device,
    };
    try {
      const response = await apiClient.post<LoginResponse>(
      `${this.link}msp_api.aspx/setAppID`,
      loginData,
    );
    return {...response.data, app_id: app_id};
    } catch (error) {
      console.log("🚀 ~ DevERPService ~ loginToERP ~ error:", error?.data?.message)
       return { success: 0, message :  error?.data?.message.toString() };
      
    }
  }

  async getAuth(): Promise<string> {
    await this.checkNetwork();

    const tokenData: TokenRequest = { appid: this.appid, device: this.device };
    const response = await apiClient.post<TokenResponse>(
      `${this.link}msp_api.aspx/getAuth`,
      tokenData,
    );

    if (String(response?.data.success) !== '1')
      throw new Error(response?.data?.message || 'Failed to get token');

    this.token = response?.data?.token || '';
    this.tokenValidTill = response?.data?.validTill || '';
    await AsyncStorage.multiSet([
      ['erp_token', this.token],
      ['erp_token_valid_till', this.tokenValidTill],
    ]);

    try {
      const db = await getDBConnection();
      const tableCheckResult = await db.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        ['erp_accounts'],
      );
      if (tableCheckResult[0].rows.length > 0) {
        const activeAccount = await getActiveAccount(db);
       
        this.token = response.data.token || '';
        if (activeAccount) {
          const updatedUser = {
            ...activeAccount.user,
            token: response.data.token,
            tokenValidTill: response.data.validTill ,
          };
          await db.executeSql(`UPDATE erp_accounts SET user_json = ? WHERE id = ?`, [
            JSON.stringify(updatedUser),
            activeAccount.id,
          ]);
        }
      }
    } catch (err) {
      console.log('⚠️ SQLite update skipped:', err);
    }

    return this.token;
  }

  getMenu() {
    return this.apiCall<MenuResponse>('msp_api.aspx/getMenu', { token: this.token }).then(res =>
      JSON.stringify(res),
    );
  }

  getDashboard() {
    return this.apiCall<DashboardResponse>('msp_api.aspx/getDB', { token: this.token }).then(res => {
    console.log("🚀 ~ DevERPService ~ getDashboard ~ res:", res)
    return JSON.stringify(res);
},
    );
  }

  getPage(page: string, id: string) {
    return this.apiCall<any>('msp_api.aspx/getPage', { token: this.token, page, id });
  }

  getListData(page: string, fd: string, td: string, param: string) {
    return this.apiCall<ListDataResponse>('msp_api.aspx/getListData', {
      token: this.token,
      page,
      fd,
      td,
      param,
    }).then(res => JSON.stringify({ data: res.data, config: res.config || [] }));
  }

  markAttendance(rawData: any, isPunchIn: boolean, user: any, id: any) {
    const pageType = isPunchIn ? 'punchin' : 'punchout';
    const punchOutData = {
      id: id,
      employeeid: user.id,
      outimage: rawData.imageBase64,
      outremarks: rawData?.remark || '',
      outlocation: `${rawData?.latitude},${rawData?.longitude}`,
    };

    const punchInData = {
      id: '0',
      employeeid: user.id.toString(),
      inimage: rawData.imageBase64,
      inremarks: rawData?.remark || '',
      inlocation: `${rawData?.latitude.toString()},${rawData?.longitude.toString()}`,
    };
   

    return this.apiCall<AttendanceResponse>(`msp_api.aspx/pageSave`, {
      token: this.token,
      page: pageType,
      data: JSON.stringify(isPunchIn ? punchInData : punchOutData),
    });
  }

  savePage(page: string, id: string, rawData: any) {
    return this.apiCall<any>(`msp_api.aspx/pageSave`, {
      token: this.token,
      page,
      data: JSON.stringify(rawData),
    });
  }

  getDDL(dtlid: string, where: string) {
    return this.apiCall<any>('msp_api.aspx/getDDL', { token: this.token, dtlid, where });
  }

  getAjax(dtlid: string, where: string, search: string) {
    return this.apiCall<any>('msp_api.aspx/getAjax', { token: this.token, dtlid, where, search });
  }

  getLastPunchIn() {
    return this.apiCall<any>('msp_api.aspx/getLastPunchIn', { token: this.token });
  }

  getLastPunchList(id: any, fd: any, td: any) {
    return this.apiCall<any>('msp_api.aspx/getListData', {
      token: this.token,
      page: 'PunchIn',
      id,
      fd: fd,
      td: td,
    });
  }

  async handlePageAction(action: string, id: string, remarks: string, page: string) {
    return this.apiCall<any>(`msp_api.aspx/${action}`, {
      token: this.token,
      id,
      remarks,
      page,
    });
  }

  async handleDeleteAction(  id: string,   page: string) {
    return this.apiCall<any>(`msp_api.aspx/pageDelete`, {
      token: this.token,
      id,
      page,
    });
  }

  async syncLocation(token: string, location: string) {
    console.log('🚀 ~ DevERPService ~ syncLocation ---------++++++-----++++++~ token:', token);
    return this.apiCall<any>(`msp_api.aspx/syncLocation`, {
      token: token,
      location: location,
    });
  }

  async initialize() {
    this.link = (await AsyncStorage.getItem('erp_link')) || '';
    this.token = (await AsyncStorage.getItem('erp_token')) || '';
    this.tokenValidTill = (await AsyncStorage.getItem('erp_token_valid_till')) || '';
    this.appid = (await AsyncStorage.getItem('erp_appid')) || '';
    this.device = (await AsyncStorage.getItem('device')) || '';
  }

  async clearData() {
    this.link = '';
    this.token = '';
    this.tokenValidTill = '';
    this.appid = '';
    await AsyncStorage.multiRemove(['erp_link', 'erp_token', 'erp_token_valid_till', 'erp_appid']);
  }

  setToken(token: string) {
    this.token = token;
    AsyncStorage.setItem('erp_token', token);
  }
  setDevice(device: string) {
    AsyncStorage.setItem('device', device);

    this.device = device;
  }
  setAppId(appId: string) {
    AsyncStorage.setItem('erp_appid', appId);
    this.appid = appId;
  }
}

export default new DevERPService();