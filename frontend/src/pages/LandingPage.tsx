import { Link } from "react-router-dom";

export default function LandingPage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/assets/images/Man_scanning_woman_with_app_202608291411.mp4"
          />
        </div>

        {/* Watercolor Blob Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-30"
            style={{ background: "radial-gradient(circle, #1a7a5c, transparent)" }}
          />
          <div
            className="absolute top-[50%] right-[10%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-20"
            style={{ background: "radial-gradient(circle, #34d399, transparent)" }}
          />
          <div
            className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] rounded-full blur-[110px] opacity-25"
            style={{ background: "radial-gradient(circle, #6ee7b7, transparent)" }}
          />
          <div
            className="absolute bottom-[30%] right-[30%] w-[250px] h-[250px] rounded-full blur-[90px] opacity-15"
            style={{ background: "radial-gradient(circle, #a7f3d0, transparent)" }}
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
          >
            Find Profiles.
            <br />
            With Consent.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
            A privacy-conscious platform for face matching. Upload a photo to find
            professional profiles — always with explicit consent and full control
            over your biometric data.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-[#1a7a5c] text-white font-semibold hover:bg-[#15644a] dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors shadow-lg text-lg"
            >
              Start Searching
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/25 hover:bg-white/20 transition-colors text-lg"
            >
              Create Your Profile
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center text-white/60 animate-bounce">
            <span className="text-sm mb-2">Scroll down</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Visual Flow Section */}
      <section className="py-20 bg-[#f8fafc] dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-[#64748b] dark:text-surface-400 max-w-2xl mx-auto">
              Simple, secure, and privacy-focused face matching
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white">Upload Photo</h3>
              <p className="mt-2 text-sm text-[#64748b] dark:text-surface-400 max-w-[180px]">Upload a photo of the person you're looking for</p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:flex items-center text-[#1a7a5c] dark:text-primary-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <div className="md:hidden text-[#1a7a5c] dark:text-primary-400">
              <svg className="w-8 h-8 rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white">Face Matching</h3>
              <p className="mt-2 text-sm text-[#64748b] dark:text-surface-400 max-w-[180px]">AI-powered matching against consented profiles</p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:flex items-center text-[#1a7a5c] dark:text-primary-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <div className="md:hidden text-[#1a7a5c] dark:text-primary-400">
              <svg className="w-8 h-8 rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white">Possible Match</h3>
              <p className="mt-2 text-sm text-[#64748b] dark:text-surface-400 max-w-[180px]">View matching profiles with similarity scores</p>
            </div>

            {/* Arrow 3 */}
            <div className="hidden md:flex items-center text-[#1a7a5c] dark:text-primary-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <div className="md:hidden text-[#1a7a5c] dark:text-primary-400">
              <svg className="w-8 h-8 rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white">Public Links</h3>
              <p className="mt-2 text-sm text-[#64748b] dark:text-surface-400 max-w-[180px]">Connect through the matched profile's public links</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white">
              Privacy-First Identity Discovery
            </h2>
            <p className="mt-4 text-lg text-[#64748b] dark:text-surface-400 max-w-2xl mx-auto">
              Built with privacy at its core, designed for professional networking
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Consent-Based */}
            <div className="bg-[#f8fafc] dark:bg-surface-900 p-8 rounded-2xl border border-[#e2e8f0] dark:border-surface-600 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0f172a] dark:text-white">Consent-Based</h3>
              <p className="mt-2 text-[#64748b] dark:text-surface-400">
                Users opt-in to be searchable. No one is indexed without their
                explicit permission. Every match respects individual consent.
              </p>
            </div>

            {/* Card 2: Privacy-Protected */}
            <div className="bg-[#f8fafc] dark:bg-surface-900 p-8 rounded-2xl border border-[#e2e8f0] dark:border-surface-600 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0f172a] dark:text-white">Privacy-Protected</h3>
              <p className="mt-2 text-[#64748b] dark:text-surface-400">
                Biometric data is encrypted, hashed, and never stored as raw
                images. Your data stays secure and private at all times.
              </p>
            </div>

            {/* Card 3: Professional Focus */}
            <div className="bg-[#f8fafc] dark:bg-surface-900 p-8 rounded-2xl border border-[#e2e8f0] dark:border-surface-600 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0f172a] dark:text-white">Professional Focus</h3>
              <p className="mt-2 text-[#64748b] dark:text-surface-400">
                Designed for professional networking and identity verification.
                Connect with verified professionals securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-[#f8fafc] dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white">
              Built on Transparency
            </h2>
            <p className="mt-4 text-lg text-[#64748b] dark:text-surface-400 max-w-2xl mx-auto">
              Our platform is built on core principles that put user privacy first
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white">Voluntary Enrollment</h3>
              <p className="mt-2 text-sm text-[#64748b] dark:text-surface-400">
                Everyone on the platform chose to be here. No one is added without their knowledge and consent.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white">Probabilistic Matching</h3>
              <p className="mt-2 text-sm text-[#64748b] dark:text-surface-400">
                Results are probabilistic, not definitive. We show similarity scores, not absolute identifications.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white">Full Control</h3>
              <p className="mt-2 text-sm text-[#64748b] dark:text-surface-400">
                Update, hide, or delete your profile and biometric data at any time with a single click.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#d1f5e8] dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1a7a5c] dark:text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] dark:text-white">No Surveillance</h3>
              <p className="mt-2 text-sm text-[#64748b] dark:text-surface-400">
                We don't track, monitor, or sell user data. This is a tool for connection, not surveillance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0f5c42] via-[#1a7a5c] to-[#15644a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Take Control of Your Digital Identity?
          </h2>
          <p className="mt-4 text-lg text-[#d1f5e8]">
            Join FaceProfile today and create your consent-based profile.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-[#0f5c42] font-semibold hover:bg-[#f0fdf4] transition-colors shadow-lg"
            >
              Create Your Profile
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/FaceID_Hub_logo_design_2K_202608291407.jpeg"
                alt="FaceID Hub Logo"
                className="w-8 h-8 rounded-full object-cover opacity-80"
              />
              <span className="text-lg font-bold">FaceID Hub</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#94a3b8]">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-[#94a3b8]">
              &copy; 2024 FaceProfile. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
