import React, { createContext, useState, ReactNode } from 'react';

export type Survey = {
  id: string;
  siteName: string;
  clientName: string;
  description: string;
  priority: string;
  date: string;
  contact?: string;
  location?: string;
  photo?: string;
};

type SurveyContextType = {
  surveys: Survey[];
  addSurvey: (survey: Survey) => void;
  deleteSurvey: (id: string) => void;
};

export const SurveyContext = createContext<SurveyContextType>({
  surveys: [],
  addSurvey: () => {},
  deleteSurvey: () => {},
});

export const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      siteName: 'Site A Inspection',
      clientName: 'Acme Corp',
      description: '',
      priority: 'High',
      date: '2023-10-25 10:30 AM',
    },
    {
      id: '2',
      siteName: 'Downtown Plot',
      clientName: 'Globex',
      description: '',
      priority: 'Medium',
      date: '2023-10-25 09:15 AM',
    },
  ]);

  const addSurvey = (survey: Survey) => {
    setSurveys((prev) => [survey, ...prev]);
  };

  const deleteSurvey = (id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SurveyContext.Provider value={{ surveys, addSurvey, deleteSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export default function SurveyContextComponent() {
  return null;
}
