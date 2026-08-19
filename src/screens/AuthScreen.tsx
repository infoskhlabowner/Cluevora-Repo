import { useState } from "react";
import { useStore } from "../store/useStore";
import { Fingerprint, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AuthScreen() {
  const { loginGuest, loginWithEmail, signUpWithEmail, loginWithGoogle, resetPassword, loading } = useStore();
  
  const [mode, setMode] = useState<'landing' | 'login' | 'signup' | 'forgot'>('landing');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#7D8F69]" size={32} />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMessage("Password reset email sent! Please check your inbox.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E9EDC6]/40 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm z-10">
        <AnimatePresence mode="wait">
          {mode === 'landing' ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-white border border-[#E9EDC6] rounded-[24px] flex items-center justify-center mb-6 shadow-sm">
                <Fingerprint size={40} className="text-[#7D8F69]" />
              </div>
              
              <h1 className="text-3xl font-serif text-[#2D331F] mb-2 italic">Cluevora</h1>
              <p className="text-[#7D8F69] text-xs tracking-widest uppercase font-bold mb-12 opacity-80">Every Clue Tells A Story</p>
              
              <div className="w-full space-y-4">
                <button 
                  onClick={() => setMode('signup')}
                  className="w-full bg-[#434832] hover:bg-[#2D331F] text-white font-semibold tracking-wide py-3.5 rounded-full transition-all"
                >
                  Create Account
                </button>
                
                <button 
                  onClick={() => setMode('login')}
                  className="w-full bg-transparent border border-[#434832] hover:bg-[#E9EDC6]/20 text-[#434832] font-semibold tracking-wide py-3.5 rounded-full transition-all"
                >
                  Sign In to Account
                </button>

                <div className="pt-4 border-t border-[#E9EDC6]/50">
                  <button 
                    onClick={loginGuest}
                    className="text-sm font-semibold text-[#7D8F69] hover:text-[#434832] transition-colors"
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full bg-white p-6 rounded-[24px] shadow-sm border border-[#E9EDC6]"
            >
              <button 
                onClick={() => {
                  setMode('landing');
                  setError("");
                  setMessage("");
                }}
                className="mb-6 text-[#7D8F69] hover:text-[#434832] transition-colors flex items-center text-sm font-semibold"
              >
                <ArrowLeft size={16} className="mr-2" /> Back
              </button>
              
              <h2 className="text-2xl font-serif text-[#2D331F] mb-6">
                {mode === 'login' && "Welcome Back"}
                {mode === 'signup' && "Join the Bureau"}
                {mode === 'forgot' && "Reset Password"}
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-100 text-green-600 text-sm">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7D8F69] mb-1.5">Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E9EDC6] rounded-xl px-4 py-3 text-[#2D331F] focus:outline-none focus:border-[#7D8F69] transition-colors"
                    placeholder="detective@agency.com"
                  />
                </div>
                
                {mode !== 'forgot' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7D8F69] mb-1.5">Password</label>
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#E9EDC6] rounded-xl px-4 py-3 text-[#2D331F] focus:outline-none focus:border-[#7D8F69] transition-colors"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-[#434832] hover:bg-[#2D331F] text-white font-semibold tracking-wide py-3.5 rounded-xl transition-all mt-6"
                >
                  {mode === 'login' && "Sign In"}
                  {mode === 'signup' && "Create Account"}
                  {mode === 'forgot' && "Send Reset Link"}
                </button>
              </form>

              {mode === 'login' && (
                <div className="mt-4 flex flex-col items-center space-y-4">
                  <button 
                    onClick={() => setMode('forgot')}
                    className="text-sm font-semibold text-[#7D8F69] hover:text-[#434832] transition-colors"
                  >
                    Forgot Password?
                  </button>
                  <div className="w-full border-t border-[#E9EDC6] relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs uppercase tracking-widest text-[#7D8F69] font-bold">
                      OR
                    </span>
                  </div>
                  <button 
                    onClick={handleGoogle}
                    type="button"
                    className="w-full bg-white border border-[#E9EDC6] hover:bg-[#FDFBF7] text-[#2D331F] font-semibold py-3 rounded-xl transition-all flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
