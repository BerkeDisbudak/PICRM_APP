import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set up real-time subscription for reports
if (Platform.OS === 'web') {
  supabase
    .channel('reports')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'Reports',
    }, () => {
      // Dispatch custom event for real-time updates
      const event = new CustomEvent('reportUpdate');
      window.dispatchEvent(event);
    })
    .subscribe();
}

export interface Report {
  id: string;
  user_id: string;
  title: string;
  report: string;
  created_at: string;
}

export async function createReport(title: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('Reports')
    .insert([
      {
        title,
        report: content,
        user_id: user.id
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReports() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('Reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteReport(id: string) {
  const { error } = await supabase
    .from('Reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
}