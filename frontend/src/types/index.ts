export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'ProposalSent' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  status: LeadStatus;
  followUpAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastNote?: string | null;
  lastNoteAt?: string | null;
}

export interface Discussion {
  id: string;
  leadId: string;
  note: string;
  followUpAt: string | null;
  createdAt: string;
}

export interface CreateLeadDto {
  name: string;
  company?: string | null;
  phone?: string | null;
  status?: LeadStatus;
}

export interface UpdateLeadDto {
  status?: LeadStatus;
  followUpAt?: string | null;
}

export interface CreateDiscussionDto {
  note: string;
  followUpAt?: string | null;
}
