import { DiagnosisResult } from '../types';

export interface DiagnosisReport {
  id: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  probability: number;
  details: DiagnosisResult;
}

// This function would save the diagnosis report to the backend
export const saveDiagnosisReport = async (diagnosis: DiagnosisResult, symptoms: string[]) => {
  try {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        date: new Date().toISOString(),
        symptoms,
        diagnosis: diagnosis.predictions[0].disease,
        probability: diagnosis.predictions[0].confidence,
        details: diagnosis,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save diagnosis report');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving diagnosis report:', error);
    throw error;
  }
};

// This function would fetch all diagnosis reports for the current user
export const getUserReports = async (): Promise<DiagnosisReport[]> => {
  try {
    const response = await fetch('/api/reports', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch diagnosis reports');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching diagnosis reports:', error);
    throw error;
  }
};
