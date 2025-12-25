import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';

const auth = getAuth(app);

export default function AdminLogin({ onLogin }) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    en: {
      title: 'Admin Login',
      subtitle: 'ScheduleIt Management',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'admin@example.com',
      passwordPlaceholder: 'Enter password',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      note: 'Authorized personnel only',
      errorInvalid: 'Invalid email or password',
      errorTooMany: 'Too many failed attempts. Please try again later.',
      errorGeneric: 'Login failed. Please try again.'
    },
    tr: {
      title: 'Yönetici Girişi',
      subtitle: 'ScheduleIt Yönetimi',
      email: 'E-posta',
      password: 'Şifre',
      emailPlaceholder: 'admin@example.com',
      passwordPlaceholder: 'Şifrenizi girin',
      signIn: 'Giriş Yap',
      signingIn: 'Giriş yapılıyor...',
      note: 'Sadece yetkili personel',
      errorInvalid: 'Geçersiz e-posta veya şifre',
      errorTooMany: 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.',
      errorGeneric: 'Giriş başarısız. Lütfen tekrar deneyin.'
    }
  };

  const t = texts[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(true);
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(t.errorInvalid);
      } else if (err.code === 'auth/too-many-requests') {
        setError(t.errorTooMany);
      } else {
        setError(t.errorGeneric);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>{t.password}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="admin-login-error">
              <p>{error}</p>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="admin-login-btn">
            {isLoading ? t.signingIn : t.signIn}
          </button>
        </form>

        <p className="admin-login-note">{t.note}</p>
      </div>
    </div>
  );
}
