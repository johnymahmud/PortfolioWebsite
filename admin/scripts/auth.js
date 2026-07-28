/**
 * Admin Authentication & Session Module
 */

export async function checkAdminSession(redirectIfUnauthenticated = false, redirectIfAuthenticated = false) {
  if (!window.portfolioDb) return null;

  const { data: { session }, error } = await window.portfolioDb.auth.getSession();

  if (error) {
    console.error("Session check failed:", error);
    if (redirectIfUnauthenticated) window.location.replace("./index.html");
    return null;
  }

  if (session && redirectIfAuthenticated) {
    window.location.replace("./dashboard.html");
    return session;
  }

  if (!session && redirectIfUnauthenticated) {
    window.location.replace("./index.html");
    return null;
  }

  return session;
}

export async function handleAdminLogin(email, password) {
  if (!window.portfolioDb) throw new Error("Database connection unavailable.");

  const { data, error } = await window.portfolioDb.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function handleAdminLogout() {
  if (!window.portfolioDb) return;
  await window.portfolioDb.auth.signOut();
  window.location.replace("./index.html");
}
