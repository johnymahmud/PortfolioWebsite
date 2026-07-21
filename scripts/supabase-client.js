const config = window.PORTFOLIO_SUPABASE;

const client = supabase.createClient(config.url, config.anonKey);

window.portfolioDb = client;
