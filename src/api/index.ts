import { supabase } from '../lib/supabase';

// API handler for widget settings
export async function getWidgetSettings(uid: string) {
  try {
    const { data, error } = await supabase
      .from('widget_settings')
      .select('*')
      .eq('user_id', uid)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching widget settings:', error);
    throw error;
  }
}

// API handler for auto replies
export async function getAutoReplies(uid: string) {
  try {
    const { data, error } = await supabase
      .from('auto_replies')
      .select('*')
      .eq('user_id', uid);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching auto replies:', error);
    throw error;
  }
}

// API handler for AI settings
export async function getAISettings(uid: string) {
  try {
    const { data, error } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('user_id', uid)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    throw error;
  }
}

// API handler to update AI settings
export async function updateAISettings(uid: string, settings: any) {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('ai_settings')
      .select('id')
      .eq('user_id', uid)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    if (existingData) {
      // Update existing settings
      const { data, error } = await supabase
        .from('ai_settings')
        .update(settings)
        .eq('id', existingData.id)
        .select();
        
      if (error) throw error;
      return data;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('ai_settings')
        .insert({
          user_id: uid,
          ...settings
        })
        .select();
        
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating AI settings:', error);
    throw error;
  }
}