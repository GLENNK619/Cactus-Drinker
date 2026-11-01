import React, { useState } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Droplet, Sparkles, Mail, Lock, User, ArrowRight, X, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onContinueAsGuest,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isForgotPassword) {
        if (!email) {
          setError('Please enter your email address to receive reset instructions.');
          setLoading(false);
          return;
        }
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
        setLoading(false);
        return;
      }

      if (isSignUp) {
        if (!email || !password) {
          setError('Please fill in both email and password.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password should be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name && userCred.user) {
          await updateProfile(userCred.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: unknown) {
      console.error(err);
      let msg = 'Authentication failed. Please check your credentials.';
      if (err instanceof Error) {
        if (err.message.includes('auth/invalid-credential')) {
          msg = 'Invalid email or password.';
        } else if (err.message.includes('auth/email-already-in-use')) {
          msg = 'This email is already registered. Try logging in instead!';
        } else if (err.message.includes('auth/weak-password')) {
          msg = 'Password is too weak. Please use at least 6 characters.';
        } else if (err.message.includes('auth/user-not-found')) {
          msg = 'No account found with this email.';
        } else if (err.message.includes('auth/operation-not-allowed')) {
          msg = 'Email/password auth is being prepared. You can sign in with Google or continue as Guest right away!';
        } else {
          msg = err.message;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#131e18] border border-amber-200/80 dark:border-[#1e352a] rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[95vh] overflow-y-auto transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-emerald-200 hover:bg-stone-100 dark:hover:bg-[#1a2b22] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-3">
            <Droplet className="w-8 h-8 fill-white/80" />
          </div>
          <h2 className="text-2xl font-black text-stone-800 dark:text-emerald-50 tracking-tight flex items-center gap-1.5">
            CactusDrop <span className="text-xl">🌵</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mt-1">
            Drink Water. Grow Your Cactus. Build Your Streak.
          </p>
        </div>

        {/* Tab Toggle */}
        {!isForgotPassword && (
          <div className="flex p-1 bg-stone-100 dark:bg-[#0d1410] rounded-2xl mb-5 border border-transparent dark:border-[#1e352a]">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isSignUp
                  ? 'bg-white dark:bg-[#182a20] text-stone-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isSignUp
                  ? 'bg-white dark:bg-[#182a20] text-stone-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* One-click Google Login */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl border border-stone-200 dark:border-[#223d30] bg-white dark:bg-[#0d1410] hover:bg-stone-50 dark:hover:bg-[#182820] text-stone-700 dark:text-emerald-100 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-stone-200 dark:border-[#1e352a]" />
          <span className="absolute bg-white dark:bg-[#131e18] px-3 text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Or with email
          </span>
        </div>

        {/* Error message banner */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Password reset success notice */}
        {resetSent && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
            Password reset link sent to {email}. Check your inbox!
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {isSignUp && !isForgotPassword && (
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Green Thumb Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-[#223d30] bg-stone-50/50 dark:bg-[#0d1410] text-stone-800 dark:text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#131e18]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="hydrated@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-[#223d30] bg-stone-50/50 dark:bg-[#0d1410] text-stone-800 dark:text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#131e18]"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-600 dark:text-stone-300">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError(null);
                    }}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-[#223d30] bg-stone-50/50 dark:bg-[#0d1410] text-stone-800 dark:text-emerald-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-[#131e18]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {loading ? (
              <span>Processing...</span>
            ) : isForgotPassword ? (
              <span>Send Reset Email</span>
            ) : isSignUp ? (
              <>
                <span>Create CactusDrop Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {isForgotPassword && (
          <button
            type="button"
            onClick={() => {
              setIsForgotPassword(false);
              setError(null);
              setResetSent(false);
            }}
            className="text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-emerald-100 mt-4 text-center cursor-pointer"
          >
            ← Back to Sign In
          </button>
        )}

        {/* Guest / Instant Test Drive Option */}
        <div className="pt-4 mt-4 border-t border-stone-100 dark:border-[#1e352a] flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              onContinueAsGuest();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-amber-50 dark:bg-[#0d1410] hover:bg-amber-100 dark:hover:bg-[#1a2b22] text-amber-900 dark:text-amber-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-amber-200/60 dark:border-[#1e352a]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Try Instant Guest Mode (No sign up required)</span>
          </button>
          <span className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
            You can link a permanent account anytime from Settings.
          </span>
        </div>
      </div>
    </div>
  );
};
