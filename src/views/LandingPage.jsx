import { Building2, ArrowRight, BarChart3, Lock, Zap, Globe, Users, Smartphone, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import landingImage from '../../uiux design/12070.jpg'

function LandingPage() {
    // Marketing content here is static.
    // If needed, replace copy/testimonials/stats with CMS or backend content later.
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <div className="brand-mark">
                            <Building2 size={18} />
                        </div>
                        <div>
                            <h1 className="brand-title mb-0">Finvo</h1>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Link to="/login" className="btn btn-outline-light btn-sm">
                            Sign In
                        </Link>
                        <Link to="/signup" className="btn btn-primary btn-sm">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="landing-hero">
                <section className="hero-content">
                    <p className="eyebrow text-center mb-2">Architectural Excellence Ledger</p>
                    <h2 className="hero-title">Invoicing Made Simple</h2>
                    <p className="hero-subtitle">
                        An architectural approach to fiscal management. Streamline your billing workflow with precision, clarity, and
                        automated reconciliation.
                    </p>

                    <div className="hero-cta d-flex justify-content-center gap-2 flex-wrap">
                        <div className="d-flex flex-column align-items-center">
                            <div className="d-flex gap-2 mb-3">
                                <Link to="/signup" className="btn btn-primary btn-lg">
                                    Get Started
                                </Link>
                                <button className="btn btn-outline-light btn-lg" type="button">
                                    View Demo
                                </button>
                            </div>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <div className="text-warning d-flex">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <span className="small text-muted fw-medium">Loved by 10,000+ Teams</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-placeholder mt-5 text-center">
                        <img src={landingImage} alt="Finvo Platform Design" className="img-fluid rounded-3 shadow-lg" style={{ border: '1px solid var(--border-color)' }} />
                    </div>
                </section>

                <section className="features-grid">
                    <div className="features-intro">
                        <p className="eyebrow mb-2">Precision Engineering</p>
                        <h3 className="section-title">Built for Scale</h3>
                        <p className="section-desc">
                            The Architectural Ledger provides a robust foundation for firms that require absolute precision in their financial records.
                        </p>
                    </div>

                    <div className="feature-card">
                        <Zap size={24} className="feature-icon" />
                        <h4>Instant Generation</h4>
                        <p>Create architecturally sound invoices in seconds with our pre-built structural templates.</p>
                    </div>

                    <div className="feature-card">
                        <Lock size={24} className="feature-icon" />
                        <h4>Audit Trails</h4>
                        <p>Every action is logged with cryptographic precision, ensuring a perfect paper trail for all transactions.</p>
                    </div>

                    <div className="feature-card">
                        <BarChart3 size={24} className="feature-icon" />
                        <h4>Deep Analytics</h4>
                        <p>Gain structural insights into your cash flow with advanced fiscal modeling and projection tools.</p>
                    </div>

                    <div className="feature-card">
                        <Globe size={24} className="feature-icon" />
                        <h4>Global Reach</h4>
                        <p>Seamlessly handle international transactions with multi-currency support and localized tax routing.</p>
                    </div>

                    <div className="feature-card">
                        <Users size={24} className="feature-icon" />
                        <h4>Team Collaboration</h4>
                        <p>Empower your entire financial team with role-based access control and real-time collaborative editing.</p>
                    </div>

                    <div className="feature-card">
                        <Smartphone size={24} className="feature-icon" />
                        <h4>Mobile First</h4>
                        <p>Manage your architectural ledger on-the-go with full support for mobile and tablet devices.</p>
                    </div>
                </section>

                <section className="testimonials-section py-5 my-5">
                    <div className="text-center mb-5">
                        <p className="eyebrow mb-2">Success Stories</p>
                        <h3 className="section-title">Trusted by Industry Leaders</h3>
                    </div>

                    <div className="row g-4 px-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-start">
                                <p className="fst-italic mb-4 text-muted">"Finvo completely transformed our billing process. The architectural approach saved us countless hours of manual data entry and reconciliation."</p>
                                <div className="d-flex align-items-center mt-auto">
                                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Jenkins" className="rounded-circle me-3 shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                    <div>
                                        <h6 className="mb-0 fw-bold">Sarah Jenkins</h6>
                                        <span className="text-muted small">CFO, TechFlow Industries</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-start">
                                <p className="fst-italic mb-4 text-muted">"The audit trails and precision engineering give us absolute peace of mind. It's the most robust ledger system we've ever used in our decade of business."</p>
                                <div className="d-flex align-items-center mt-auto">
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael Chen" className="rounded-circle me-3 shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                    <div>
                                        <h6 className="mb-0 fw-bold">Michael Chen</h6>
                                        <span className="text-muted small">Lead Architect, Nexus</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-start">
                                <p className="fst-italic mb-4 text-muted">"Instant invoice generation with their structural templates allowed our firm to scale globally without hiring additional administrative overhead."</p>
                                <div className="d-flex align-items-center mt-auto">
                                    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Elena Rodriguez" className="rounded-circle me-3 shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                    <div>
                                        <h6 className="mb-0 fw-bold">Elena Rodriguez</h6>
                                        <span className="text-muted small">Director, GlobalBuild</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-final">
                    <div className="cta-box">
                        <h3>Ready to Architect Your Future?</h3>
                        <p>Join leading firms in revolutionizing their billing infrastructure.</p>
                        <Link to="/signup" className="btn btn-primary btn-lg mt-3">
                            Start Free Trial <ArrowRight size={15} className="ms-2" />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <p>&copy; 2024 Finvo Architectural Ledger. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default LandingPage
