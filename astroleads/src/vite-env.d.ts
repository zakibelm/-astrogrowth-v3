/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_OPENROUTER_API_KEY: string
    readonly VITE_SENTRY_DSN: string
    readonly VITE_POSTHOG_KEY: string
    readonly VITE_MIXPANEL_TOKEN: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
