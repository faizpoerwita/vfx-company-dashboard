// Common work preferences used across the application
export const WORK_PREFERENCES = [
  'Bekerja dalam tim',
  'Bekerja mandiri',
  'Proyek jangka panjang',
  'Proyek jangka pendek',
  'Remote work',
] as const;

export type WorkPreference = typeof WORK_PREFERENCES[number];

// Areas that users might dislike or find challenging
export const dislikedWorkAreas = [
  "Tugas berulang",
  "Tenggat waktu ketat",
  "Pekerjaan administratif",
  "Pekerjaan tanpa variasi"
] as const;

export type DislikedWorkArea = typeof dislikedWorkAreas[number];

// Helper function to transform preferences for backend
export const transformPreferencesForBackend = (preferences: string[]) => {
  return preferences.map(pref => ({ name: pref, value: 'true' }));
};

// Helper function to transform preferences for frontend
export const transformPreferencesForFrontend = (preferences: Array<{ name: string; value: string } | string>) => {
  return preferences.map(pref => typeof pref === 'string' ? pref : pref.name);
};
