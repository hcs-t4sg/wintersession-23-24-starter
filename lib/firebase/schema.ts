// Type definitions for all Firestore collections

export interface Profile {
  user_id: string;
  display_name: string;
  biography: string;
}

export interface Course {
  id: string;
  name: string;
}
