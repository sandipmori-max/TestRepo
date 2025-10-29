import { createAsyncThunk } from '@reduxjs/toolkit';
import { DevERPService } from '../../../services/api';

export const savePageThunk = createAsyncThunk<
  any,
  { page: string; id: string; data: any },
  { rejectValue: string }
>('savePage/save', async ({ page, id, data }, { rejectWithValue }) => {
  try {
    const response = await DevERPService.savePage(page, id, data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to save page');
  }
});

export const handlePageActionThunk = createAsyncThunk<
  any,
  {
    action: string;
    id: string;
    remarks: string;
    page: string;
  },
  { rejectValue: string }
>('page/action', async ({ action, id, remarks, page }, { rejectWithValue }) => {
  try {
    
    const response = await DevERPService.handlePageAction(action, id, remarks, page);
    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to perform page action');
  }
});

export const handleDeleteActionThunk = createAsyncThunk<
  any,
  { 
    id: string; 
    page: string;
  },
  { rejectValue: string }
>('page/action', async ({  id, page }, { rejectWithValue }) => {
  try {
    const response = await DevERPService.handleDeleteAction( id, page);
    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to perform page action');
  }
});