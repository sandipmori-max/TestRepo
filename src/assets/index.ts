const ERP_BASE_URL_ICONS = './icons';
const ERP_BASE_URL_GIF = './gif';
const ERP_BASE_URL_SVG = './svg';

const APP_LOGO = require(`${ERP_BASE_URL_ICONS}/logo.png`);

const HOME = require(`${ERP_BASE_URL_ICONS}/home.png`);
const ACTIVE_HOME = require(`${ERP_BASE_URL_ICONS}/active_home.png`);
const ENTRY = require(`${ERP_BASE_URL_ICONS}/entry.png`);
const ACTIVE_ENTRY = require(`${ERP_BASE_URL_ICONS}/active_entry.png`);
const REPORT = require(`${ERP_BASE_URL_ICONS}/report.png`);
const ACTIVE_REPORT = require(`${ERP_BASE_URL_ICONS}/active_report.png`);
const AUTH = require(`${ERP_BASE_URL_ICONS}/auth.png`);
const ACTIVE_AUTH = require(`${ERP_BASE_URL_ICONS}/active_auth.png`);
const PROFILE = require(`${ERP_BASE_URL_ICONS}/user.png`);
const ACTIVE_PROFILE = require(`${ERP_BASE_URL_ICONS}/active_user.png`);
const BACK = require(`${ERP_BASE_URL_ICONS}/back.png`);
const ERROR_ICON = require(`${ERP_BASE_URL_ICONS}/error.png`);
const MENU = require(`${ERP_BASE_URL_ICONS}/menu.png`);

const ERROR = require(`${ERP_BASE_URL_GIF}/error.gif`);
const LOADING = require(`${ERP_BASE_URL_GIF}/loader.gif`);
const SEARCH_LOADER = require(`${ERP_BASE_URL_GIF}/search.gif`);
const NO_INTERNET = require(`${ERP_BASE_URL_GIF}/not_internet.png`);
const NO_DATA = require(`${ERP_BASE_URL_GIF}/no_data.png`);
const SUCCESS = require(`${ERP_BASE_URL_GIF}/success.gif`);

const NO_SIGNAL = require(`${ERP_BASE_URL_GIF}/no_signal.svg`);
const EMPTY = require(`${ERP_BASE_URL_GIF}/empty.svg`);
const ERRORS = require(`${ERP_BASE_URL_GIF}/error.svg`);
const NODATA = require(`${ERP_BASE_URL_GIF}/no_data.svg`);
 

export const ERP_ICON = {
  APP_LOGO,
  HOME,
  ACTIVE_HOME,
  ENTRY,
  ACTIVE_ENTRY,
  REPORT,
  ACTIVE_REPORT,
  AUTH,
  ACTIVE_AUTH,
  PROFILE,
  ACTIVE_PROFILE,
  BACK,
  ERROR_ICON,
  MENU,
};

export const ERP_GIF = {
  ERROR,
  LOADING,
  SEARCH_LOADER,
  NO_DATA,
  NO_INTERNET,
  SUCCESS,
};

export const ERP_SVG = {
  NO_SIGNAL,
  EMPTY,
  ERRORS,
  NODATA
}
