import { supabase } from '@/lib/supabaseClient';
import type { Lead } from '@/types';

export async function fetchLeadsFromDB(): Promise<Lead[]> {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }

    return data || [];
}

export async function addLeadToDB(lead: Omit<Lead, 'id'>): Promise<Lead> {
    const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();

    if (error) {
        console.error('Error adding lead:', error);
        throw error;
    }

    return data;
}

export async function updateLeadInDB(id: string, updates: Partial<Lead>): Promise<void> {
    const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating lead:', error);
        throw error;
    }
}

export async function deleteLeadFromDB(id: string): Promise<void> {
    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting lead:', error);
        throw error;
    }
}
