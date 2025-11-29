
import React, { useState, useEffect } from 'react';
import { backendLogin, backendRegister } from '../services/backendService';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    setError(null);
    setFormData({ name: '', email: '', password: '' });
  }, [isLogin]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character.";
    return null;
  };

  const handleSuccess = (user: any) => {
    localStorage.setItem('collabsphere_active_user', JSON.stringify(user));
    onLogin();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const user = await backendLogin(formData.email, formData.password);
        handleSuccess(user);
      } else {
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          setError(passwordError);
          setIsLoading(false);
          return;
        }
        const user = await backendRegister({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
        handleSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    setIsLoading(true);
    try {
        // Authenticate with the default demo user created in initDatabase
        const user = await backendLogin('demo@collabsphere.ai', 'Password1!');
        handleSuccess(user);
    } catch (e) {
        // Fallback just in case
        const demoUser = {
            name: 'Demo Creator',
            email: 'demo@collabsphere.ai',
            bio: 'Just exploring.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Demo&background=random'
        };
        handleSuccess(demoUser);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-brand-deep">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-brand-pink/30 rounded-full blur-[100px] animate-float-large"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-brand-plum/40 rounded-full blur-[100px] animate-float-delayed"></div>
      <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] bg-brand-base/20 rounded-full blur-[80px] animate-float-slow"></div>

      {/* Floating Particles */}
      <div className="absolute w-3 h-3 bg-brand-blue rounded-full blur-[2px] shadow-[0_0_15px_#69B3D8] animate-drift" style={{ top: '70%', left: '-10%' }}></div>
      <div className="absolute w-2 h-2 bg-white rounded-full blur-[1px] shadow-[0_0_10px_white] animate-drift" style={{ top: '20%', left: '-10%', animationDelay: '8s' }}></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-2 animate-fade-in-up">
        <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl border border-brand-pink/20">
          
          <div className="p-8 pb-0 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-pink to-brand-plum mx-auto flex items-center justify-center mb-6 shadow-lg shadow-brand-pink/30 animate-pulse-glow">
              <i className="fas fa-network-wired text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">CollabSphere</h1>
            <p className="text-gray-400">
              {isLogin ? 'Welcome back, Creator.' : 'Join the revolution.'}
            </p>
          </div>

          <div className="p-8 pt-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <i className="fas fa-exclamation-circle text-red-500 mt-1"></i>
                <span className="text-sm text-red-200">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-brand-deep/60 border border-brand-base text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:bg-brand-deep transition-all placeholder-gray-600"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                  <input
                    type="email"
                    required
                    placeholder="creator@example.com"
                    className="w-full bg-brand-deep/60 border border-brand-base text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:bg-brand-deep transition-all placeholder-gray-600"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-brand-deep/60 border border-brand-base text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:bg-brand-deep transition-all placeholder-gray-600"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                {!isLogin && (
                   <p className="text-[10px] text-gray-500 px-1 leading-tight">
                     Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char.
                   </p>
                )}
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-brand-blue hover:text-white transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-pink to-brand-plum hover:from-brand-plum hover:to-brand-base text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-pink/20 transform transition-all hover:scale-[1.03] active:scale-[0.97] duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <i className="fas fa-arrow-right text-sm"></i>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px bg-brand-base flex-1"></div>
              <span className="text-gray-500 text-xs font-medium uppercase">Or</span>
              <div className="h-px bg-brand-base flex-1"></div>
            </div>

            <button
              type="button"
              onClick={handleDemo}
              className="mt-6 w-full bg-brand-base/40 border border-brand-base hover:bg-brand-base text-gray-300 font-semibold py-3 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] duration-200 flex items-center justify-center gap-2 group"
            >
              <i className="fas fa-rocket text-brand-blue group-hover:text-white group-hover:translate-x-1 transition-transform"></i>
              <span>Try Demo Mode</span>
            </button>
          </div>

          <div className="bg-brand-deep/50 p-4 text-center border-t border-brand-base/50">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-pink hover:text-white font-semibold ml-1 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
