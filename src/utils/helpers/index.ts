import { ERP_GIF, ERP_ICON } from '../../assets';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import moment from 'moment';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import WebView from 'react-native-webview';

export const getBottomTabIcon = (iconName: string, focused: boolean) => {
  switch (iconName) {
    case 'home':
      return focused ? ERP_ICON.ACTIVE_HOME : ERP_ICON.HOME;
    case 'profile':
      return focused ? ERP_ICON.ACTIVE_PROFILE : ERP_ICON.PROFILE;
    case 'report':
      return focused ? ERP_ICON.ACTIVE_REPORT : ERP_ICON.REPORT;
    case 'entry':
      return focused ? ERP_ICON.ACTIVE_ENTRY : ERP_ICON.ENTRY;
    case 'auth':
      return focused ? ERP_ICON.ACTIVE_AUTH : ERP_ICON.AUTH;
    default:
      return ERP_ICON.HOME;
  }
};

export const formatDateMonthDateYear = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export function formatHeaderTitle(key: string): string {
  let result = key.replace(/[_\.\-]+/g, ' ');
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');
  result = result.replace(/([a-zA-Z])([0-9]+)/g, '$1 $2');
  result = result.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  return result.trim();
}

export const firstLetterUpperCase = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getGifSource = (type: 'error' | 'success' | 'info') => {
  switch (type) {
    case 'error':
      return ERP_GIF.ERROR;
    case 'success':
      return ERP_GIF.SUCCESS;
    default:
      return ERP_GIF.SEARCH_LOADER;
  }
};

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const cameraPerm = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const cameraStatus = await check(cameraPerm);
    let cameraGranted = false;
    if (cameraStatus === RESULTS.GRANTED) {
      cameraGranted = true;
    } else if (cameraStatus === RESULTS.DENIED) {
      const res = await request(cameraPerm);
      cameraGranted = res === RESULTS.GRANTED;
      if (!cameraGranted) {
        return false;
       }
    } else if (cameraStatus === RESULTS.BLOCKED) {
      return false; 
    }
    return cameraGranted;
  } catch (error) {
    console.warn('⚠️ Permission error:', error);
    return false;
  }
};

export const requestCameraAndLocationPermission = async (): Promise<boolean> => {
  try {
    const cameraPerm = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

    const locationPerm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    // 📌 Check current statuses
    const cameraStatus = await check(cameraPerm);
    const locationStatus = await check(locationPerm);

    // ✅ Handle camera permission
    let cameraGranted = false;
    if (cameraStatus === RESULTS.GRANTED) {
      cameraGranted = true;
    } else if (cameraStatus === RESULTS.DENIED) {
      const res = await request(cameraPerm);
      cameraGranted = res === RESULTS.GRANTED;
      if (!cameraGranted) {
        return false;
       }
    } else if (cameraStatus === RESULTS.BLOCKED) {
      return false; 
    }

    // ✅ Handle location permission
    let locationGranted = false;
    if (locationStatus === RESULTS.GRANTED) {
      locationGranted = true;
    } else if (locationStatus === RESULTS.DENIED) {
      const res = await request(locationPerm);
      locationGranted = res === RESULTS.GRANTED;
      // if (!locationGranted) {
      //   Alert.alert('Location Permission Denied', 'Location access is required for this feature.');
      // }
      return false;
    } else if (locationStatus === RESULTS.BLOCKED) {
      // Alert.alert(
      //   'Location Permission Blocked',
      //   'Location access has been permanently denied. Please enable it in Settings.',
      //   [
      //     { text: 'Cancel', style: 'cancel' },
      //     { text: 'Open Settings', onPress: () => Linking.openSettings() },
      //   ],
      // );
      return false;
    }

    return cameraGranted && locationGranted;
  } catch (error) {
    console.warn('⚠️ Permission error:', error);
    return false;
  }
};

export function formatDateToDDMMMYYYY(dateStr: string): string {
  const formatDate = (date: Date): string => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) return 'Today';

    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const dmyRegex = /^(\d{1,2}) (\w{3}) (\d{4})$/;
  const dmyMatch = dateStr.match(dmyRegex);
  if (dmyMatch) {
    const [, dayStr, monthStr, yearStr] = dmyMatch;
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames.findIndex(m => m.toLowerCase() === monthStr.toLowerCase());
    if (month >= 0) {
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return formatDate(date);
      }
    }
  }

  const mdYRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (\w{2})$/;
  const mdYMatch = dateStr.match(mdYRegex);
  if (mdYMatch) {
    let [, month, day, year, hour, minute, second, ampm] = mdYMatch;
    month = month.padStart(2, '0');
    day = day.padStart(2, '0');

    let h = parseInt(hour, 10);
    if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
    if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;

    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      h,
      parseInt(minute, 10),
      parseInt(second, 10),
    );
    if (!isNaN(date.getTime())) {
      return formatDate(date);
    }
  }

  const fallbackDate = new Date(dateStr);
  if (!isNaN(fallbackDate.getTime())) {
    return formatDate(fallbackDate);
  }

  return '';
}

export function formatTimeTo12Hour(dateStr: string): string {
  const mdYRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (\w{2})$/;
  const match = dateStr.match(mdYRegex);
  if (match) {
    let [, month, day, year, hour, minute, , ampm] = match;
    hour = hour.padStart(2, '0');
    minute = minute.padStart(2, '0');
    return `${hour}:${minute} ${ampm.toUpperCase()}`;
  }

  const fallbackDate = new Date(dateStr);
  if (!isNaN(fallbackDate.getTime())) {
    const hours = fallbackDate.getHours();
    const minutes = fallbackDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${hour12}:${paddedMinutes} ${ampm}`;
  }

  return '';
}

export const parseCustomDate = (dateStr: string): Date => {
  const [day, monthStr, year] = dateStr.split('-');
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ].indexOf(monthStr);
  return new Date(Number(year), month, Number(day));
};
export const parseCustomDatePage = (dateStr: string): Date => {
  if (!dateStr) return new Date();

  if (!isNaN(Date.parse(dateStr))) {
    return new Date(dateStr);
  }

  const [datePart, timePart, ampm] = dateStr.split(' ');
  const [month, day, year] = datePart.split('/').map(Number);

  let hours = 0,
    minutes = 0,
    seconds = 0;
  if (timePart) {
    const [h, m, s] = timePart.split(':').map(Number);
    hours = h % 12;
    if (ampm?.toUpperCase() === 'PM') hours += 12;
    minutes = m;
    seconds = s;
  }

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

export const formatDatePage = (dateStr: string): string => {
  if (!dateStr) return '';

  let date: Date;

  if (!isNaN(Date.parse(dateStr))) {
    date = new Date(dateStr);
  } else {
    const [datePart, timePart, ampm] = dateStr.split(' ');
    const [month, day, year] = datePart.split('/').map(Number);

    let hours = 0,
      minutes = 0,
      seconds = 0;
    if (timePart) {
      const [h, m, s] = timePart.split(':').map(Number);
      hours = h % 12;
      if (ampm?.toUpperCase() === 'PM') hours += 12;
      minutes = m;
      seconds = s;
    }

    date = new Date(year, month - 1, day, hours, minutes, seconds);
  }

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
};

export const findKeyByKeywords = (obj: any, keywords: string[]) => {
  if (!obj) return null;
  const lowerKeys = Object.keys(obj).map(k => k.toLowerCase());
  for (const keyword of keywords) {
    const found = lowerKeys.find(k => k.includes(keyword.toLowerCase()));
    if (found) return found;
  }
  return null;
};

export const formatDateForAPI = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const generateGUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const formatDate = dateStr => {
  const date = moment(dateStr);
  if (moment().isSame(date, 'day')) return 'Today';
  if (moment().subtract(1, 'day').isSame(date, 'day')) return 'Yesterday';
  return date.format('MMM DD, YYYY');
};
export function formatDateHr(input, isFullDate) {
  if (!input) return input;

  const normalized = input?.replace(' ', 'T');
  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    const [mdy, time, ampm] = input?.split(' ');
    const [m, d, y] = (mdy || '').split('/').map(Number);
    let [hh, mm, ss] = (time || '').split(':').map(Number);

    if (ampm === 'PM' && hh < 12) hh += 12;
    if (ampm === 'AM' && hh === 12) hh = 0;

    const parsed = new Date(y, m - 1, d, hh, mm, ss);
    if (isNaN(parsed.getTime())) {
      return input;
    }
    return buildFormatted(parsed, isFullDate);
  }

  return buildFormatted(date, isFullDate) || input;
}

function buildFormatted(date, isFullDate) {
  if (isNaN(date?.getTime?.())) return null;
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours() || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (isFullDate) {
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  } else {
    return `${day}-${month}-${year}`;
  }
}

export const isTokenValid = (tokenValidTill: string) => {
  return new Date(tokenValidTill).getTime() > Date.now();
};
export async function requestLocationPermissions(): Promise<
  'granted' | 'foreground-only' | 'denied' | 'blocked'
> {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      const fine = granted['android.permission.ACCESS_FINE_LOCATION'];
      const coarse = granted['android.permission.ACCESS_COARSE_LOCATION'];
      const background = granted['android.permission.ACCESS_BACKGROUND_LOCATION'];

      const allGranted =
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED &&
        background === PermissionsAndroid.RESULTS.GRANTED;

      if (allGranted) return 'granted';

      // ✅ Case 1: Foreground allowed, background denied
      const foregroundGranted =
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED &&
        background !== PermissionsAndroid.RESULTS.GRANTED;

      if (foregroundGranted) {
        console.log('📍 Foreground location granted, background denied.');
        return 'foreground-only';
      }

      // 🚫 Case 2: Permanently denied (NEVER ASK AGAIN)
      const blocked =
        fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        coarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        background === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;

      if (blocked) {
        console.log('🚫 Location permission permanently denied');
        return 'blocked';
      }

      // ❌ Otherwise → denied
      return 'denied';
    } catch (err) {
      console.warn('⚠️ requestLocationPermissions error:', err);
      return 'denied';
    }
  }
  return 'granted'; // iOS handled via Info.plist
}



export const formatTo12Hour = (time: string) => {
  if (!time) return '--';
  const [hourStr, minute] = time.split(':');
  let hour = parseInt(hourStr, 10);

  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${hour.toString().padStart(2, '0')}:${minute} ${suffix}`;
};

export const isLatePunchIn = (punchIn: string) => {
  if (!punchIn) return false;
  const [hours, minutes] = punchIn.split(':').map(Number);
  return hours > 10 || (hours === 10 && minutes > 15);
};

export const isAfter830 = (punchIn: string) => {
  if (!punchIn) return false;
  const [hours, minutes] = punchIn.split(':').map(Number);
  return hours > 8 || (hours === 8 && minutes > 30);
};

export const isBefore830 = (punchIn: string) => {
  if (!punchIn) return false;
  const [hours, minutes] = punchIn.split(':').map(Number);
  return hours < 8 || (hours === 8 && minutes < 30);
};

export const normalizeDate = (dateStr: string) => {
  const [day, monthStr, year] = dateStr && dateStr.split(' ');
  const monthMap: Record<string, string> = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };
  return `${year}-${monthMap[monthStr]}-${day.padStart(2, '0')}`;
};

export const getWorkedHours = (punchIn: string, punchOut: string): number => {
  if (!punchIn || !punchOut) return 0;
  const [inH, inM] = punchIn.split(':').map(Number);
  const [outH, outM] = punchOut.split(':').map(Number);
  const inDate = new Date(0, 0, 0, inH, inM);
  const outDate = new Date(0, 0, 0, outH, outM);
  return (outDate.getTime() - inDate.getTime()) / 1000 / 60 / 60;
};
export const getWorkedHours2 = (punchIn: string, punchOut: string) => {
  if (!punchIn || !punchOut) return '0:00 hr';

  const [inH, inM] = punchIn.split(':').map(Number);
  const [outH, outM] = punchOut.split(':').map(Number);

  if (isNaN(inH) || isNaN(inM) || isNaN(outH) || isNaN(outM)) {
    return '0:00 hr';
  }

  const inDate = new Date(0, 0, 0, inH, inM);
  const outDate = new Date(0, 0, 0, outH, outM);

  let diffMs = outDate.getTime() - inDate.getTime();
  if (diffMs <= 0) return '0:00 hr';

  const totalMinutes = Math.floor(diffMs / 60000);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return `${hours - 1}:${mins.toString().padStart(2, '0')} hr`;
};

export const clearAllTempFiles = async () => {
  try {
    const tempDir = RNFS.TemporaryDirectoryPath;
    const files = await RNFS.readDir(tempDir);

    for (const file of files) {
      try {
        await RNFS.unlink(file.path);
      } catch (err) {
        console.log('Error deleting file:', file.path, err);
      }
    }
    FastImage.clearMemoryCache();
    FastImage.clearDiskCache();
    if (Platform.OS === 'android') {
      // WebView.clearCache(true);
    }
    console.log('All temp files cleared!');
  } catch (err) {
    console.log('Error reading temp directory:', err);
  }
};
