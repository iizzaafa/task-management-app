import { CheckCircle2, Users, Zap, Shield } from "lucide-react";

export default function SplitLayout({ children }) {
  return (
    <div style={s.container}>
      {/* Left side — Branding */}
      <div style={s.leftPanel}>
        {/* Animated background blobs */}
        <div style={{ ...s.blob, ...s.blob1 }} />
        <div style={{ ...s.blob, ...s.blob2 }} />
        <div style={{ ...s.blob, ...s.blob3 }} />

        {/* Grid pattern overlay */}
        <div style={s.gridPattern} />

        {/* Content */}
        <div style={s.leftContent}>
          {/* Logo */}
          <div style={s.logoWrap}>
            <div style={s.logoIcon}>
              <CheckCircle2 size={28} color="white" strokeWidth={2.5} />
            </div>
            <span style={s.logoText}>TaskFlow</span>
          </div>

          {/* Hero */}
          <div style={s.hero}>
            <h1 style={s.heading}>
              Organize your work,
              <br />
              <span style={s.headingAccent}>amplify your day.</span>
            </h1>
            <p style={s.subheading}>
              A beautifully simple task manager built for teams who ship.
            </p>
          </div>

          {/* Feature pills */}
          <div style={s.features}>
            <FeatureItem
              icon={<Zap size={14} />}
              text="Lightning-fast workflow"
            />
            <FeatureItem
              icon={<Users size={14} />}
              text="Built for collaboration"
            />
            <FeatureItem
              icon={<Shield size={14} />}
              text="Enterprise-grade security"
            />
          </div>
        </div>
      </div>

      {/* Right side — Form */}
      <div style={s.rightPanel}>
        <div style={s.formWrapper}>
          {children}
        </div>
      </div>

      {/* Global animation keyframes */}
      <style>{`
        @keyframes blob-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes blob-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.15); }
          66% { transform: translate(20px, -30px) scale(0.95); }
        }
        @keyframes blob-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, 25px) scale(1.2); }
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function FeatureItem({ icon, text }) {
  return (
    <div style={s.featureItem}>
      <div style={s.featureIconWrap}>{icon}</div>
      <span>{text}</span>
    </div>
  );
}

const s = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    overflow: "hidden",
  },

  // ===== LEFT PANEL =====
  leftPanel: {
    flex: 1,
    position: "relative",
    background: "linear-gradient(135deg, #0d9488 0%, #0f9b8e 45%, #06b6a1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 48,
    color: "white",
  },

  // Animated background blobs
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(60px)",
    opacity: 0.5,
    pointerEvents: "none",
  },
  blob1: {
    width: 400,
    height: 400,
    background: "rgba(255, 255, 255, 0.15)",
    top: "-100px",
    left: "-100px",
    animation: "blob-float 20s ease-in-out infinite",
  },
  blob2: {
    width: 350,
    height: 350,
    background: "rgba(6, 182, 161, 0.4)",
    bottom: "-80px",
    right: "-80px",
    animation: "blob-float-2 18s ease-in-out infinite",
  },
  blob3: {
    width: 250,
    height: 250,
    background: "rgba(253, 224, 71, 0.2)",
    top: "40%",
    left: "20%",
    animation: "blob-float-3 25s ease-in-out infinite",
  },

  // Grid pattern overlay
  gridPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },

  leftContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 480,
    width: "100%",
    animation: "fade-slide-up 0.8s ease-out",
  },

  // Logo
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 60,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },

  // Hero
  hero: {
    marginBottom: 48,
  },
  heading: {
    fontSize: 44,
    fontWeight: 800,
    lineHeight: 1.1,
    margin: 0,
    marginBottom: 20,
    letterSpacing: "-0.03em",
  },
  headingAccent: {
    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subheading: {
    fontSize: 16,
    fontWeight: 400,
    opacity: 0.85,
    lineHeight: 1.6,
    margin: 0,
    maxWidth: 400,
  },

  // Features
  features: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginBottom: 48,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.95,
  },
  featureIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // Left Footer
  leftFooter: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    paddingTop: 32,
    borderTop: "1px solid rgba(255, 255, 255, 0.15)",
  },
  avatars: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 12,
    fontWeight: 600,
    border: "2px solid #0f9b8e",
  },
  footerText: {
    fontSize: 13,
    opacity: 0.8,
    margin: 0,
  },

  // ===== RIGHT PANEL =====
  rightPanel: {
    flex: 1,
    background: "#fafbfc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 32px",
    overflowY: "auto",
    position: "relative",
  },
  formWrapper: {
    width: "100%",
    maxWidth: 400,
    background: "white",
    padding: "40px 36px",
    borderRadius: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(15, 155, 142, 0.08)",
    border: "1px solid #f1f5f9",
    animation: "fade-slide-up 0.6s ease-out",
  },
};