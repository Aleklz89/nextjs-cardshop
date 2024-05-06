// src/types/payload.ts
import { JWTPayload } from 'jose';

export interface AdminPayload extends JWTPayload {
  is_staff?: boolean;
}