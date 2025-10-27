import moment from 'moment';
import { DrawerItemConfig } from '../components/types';

export const ERP_DRAWER_LIST: DrawerItemConfig[] = [
  { label: 'Home', route: 'Home', icon: 'home' },
  { label: 'Attendance', route: 'Attendance', icon: 'calendar-month' },
  { label: 'Business Card', route: 'List', icon: 'assignment' },
  { label: 'Alert', route: 'Alert', icon: 'notifications-active' },
  { label: 'Privacy Policy', route: 'Privacy Policy', icon: 'policy' },
];

export 
const NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Leave Policy',
    description: 'HR has updated the leave policy. Please check.',
    sender: 'HR Department',
    date: moment().subtract(0, 'days').toISOString(),
    viewed: false,
  },
  {
    id: '2',
    title: 'Project Deadline',
    description: 'Reminder: Submit the final report by EOD.',
    sender: 'Project Manager',
    date: moment().subtract(1, 'days').toISOString(),
    viewed: true,
  },
  {
    id: '3',
    title: 'System Maintenance',
    description: 'Server maintenance scheduled for this weekend.',
    sender: 'IT Admin',
    date: moment().subtract(5, 'days').toISOString(),
    viewed: false,
  },
];