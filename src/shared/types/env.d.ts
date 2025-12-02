/**
 * Type definitions for environment variables
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase Configuration
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_PASS: string;
  }
}
