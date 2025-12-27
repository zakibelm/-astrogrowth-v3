import { supabase } from '@/lib/supabaseClient';

export { supabase };

// Types for database tables
export interface DbLead {
    id?: string;
    campaign_id: string;
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    position: string;
    linkedin_url?: string;
    score: number;
    status: 'new' | 'qualified' | 'contacted' | 'replied' | 'converted' | 'disqualified';
    created_at?: string;
    updated_at?: string;
}

export interface DbSentEmail {
    id?: string;
    campaign_id: string;
    lead_id: string;
    subject: string;
    body: string;
    status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced';
    resend_id?: string;
    sent_at?: string;
    opened_at?: string;
    clicked_at?: string;
    created_at?: string;
}

export interface DbEmailEvent {
    id?: string;
    email_id: string;
    event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
    timestamp: string;
    metadata?: Record<string, unknown>;
}

// Lead operations
export const leadOperations = {
    async create(lead: DbLead): Promise<DbLead | null> {
        const { data, error } = await supabase
            .from('leads')
            .insert(lead)
            .select()
            .single();
        if (error) {
            console.error('Error creating lead:', error);
            return null;
        }
        return data;
    },

    async getByCampaign(campaignId: string): Promise<DbLead[]> {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('campaign_id', campaignId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching leads:', error);
            return [];
        }
        return data || [];
    },

    async updateStatus(id: string, status: DbLead['status']): Promise<boolean> {
        const { error } = await supabase
            .from('leads')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);
        return !error;
    },
};

// Sent email operations  
export const emailOperations = {
    async create(email: DbSentEmail): Promise<DbSentEmail | null> {
        const { data, error } = await supabase
            .from('sent_emails')
            .insert(email)
            .select()
            .single();
        if (error) {
            console.error('Error creating email record:', error);
            return null;
        }
        return data;
    },

    async getByCampaign(campaignId: string): Promise<DbSentEmail[]> {
        const { data, error } = await supabase
            .from('sent_emails')
            .select('*')
            .eq('campaign_id', campaignId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching emails:', error);
            return [];
        }
        return data || [];
    },

    async updateStatus(id: string, status: DbSentEmail['status'], additionalData?: Partial<DbSentEmail>): Promise<boolean> {
        const { error } = await supabase
            .from('sent_emails')
            .update({ status, ...additionalData })
            .eq('id', id);
        return !error;
    },
};

// Email event operations
export const eventOperations = {
    async create(event: DbEmailEvent): Promise<DbEmailEvent | null> {
        const { data, error } = await supabase
            .from('email_events')
            .insert(event)
            .select()
            .single();
        if (error) {
            console.error('Error creating event:', error);
            return null;
        }
        return data;
    },

    async getByEmail(emailId: string): Promise<DbEmailEvent[]> {
        const { data, error } = await supabase
            .from('email_events')
            .select('*')
            .eq('email_id', emailId)
            .order('timestamp', { ascending: false });
        if (error) {
            console.error('Error fetching events:', error);
            return [];
        }
        return data || [];
    },
};

export default supabase;
