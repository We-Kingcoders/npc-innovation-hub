// types/hire-request.ts
export type HireInquiry = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  job_title: string;
  country: string;
  message: string;
  consent: boolean;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
  updated_at: string;
};

export type HireInquiriesResponse = {
  status: string;
  results: number;
  data: {
    inquiries: HireInquiry[];
  };
};
