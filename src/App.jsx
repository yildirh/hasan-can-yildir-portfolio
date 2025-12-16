import { useState, useEffect } from 'react'
import { useLanguage } from './context/LanguageContext'
import { useTheme } from './context/ThemeContext'

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState('running')
  const [cycleCount, setCycleCount] = useState(0)
  const [message, setMessage] = useState({ type: '', text: '', subtext: '' })
  const [expandedExp, setExpandedExp] = useState(0) // Kolay default open
  const { language, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  // Dynamic experience calculation
  const CAREER_START_YEAR = 2015
  const experienceYears = new Date().getFullYear() - CAREER_START_YEAR

  const steps = [
    { full: 'Build', short: 'Build' },
    { full: 'Smoke Test', short: 'Smoke' },
    { full: 'Regression Test', short: 'Regr.' },
    { full: 'Deploy', short: 'Deploy' },
    { full: 'Monitor', short: 'Monitor' }
  ]

  useEffect(() => {
    // Lock scroll during loader
    document.body.classList.add('no-scroll')
    
    // Loader animation duration
    const timer = setTimeout(() => {
      setIsLoading(false)
      document.body.classList.remove('no-scroll')
      
      // Trigger page reveal on next frame for smooth transition
      requestAnimationFrame(() => {
        setIsReady(true)
      })
    }, 2200)
    
    return () => {
      clearTimeout(timer)
      document.body.classList.remove('no-scroll')
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 200)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Pipeline animation logic
  useEffect(() => {
    const runCycle = () => {
      const cycleIndex = cycleCount % 5

      if (step === 0 && status === 'running') {
        setMessage({ type: 'build', text: 'Successfully deployed to test environment 🎯', subtext: '' })
        setTimeout(() => {
          setMessage({ type: '', text: '', subtext: '' })
          setStep(1)
        }, 1800)
        return
      }

      if (step === 1 && cycleIndex === 3) {
        // Smoke fails on cycle 3
        setStatus('error')
        setMessage({ type: 'error', text: '2 failed · 8 passed · 0 skipped', subtext: 'Success rate: 80%' })
        setTimeout(() => {
          setStatus('running')
          setStep(0)
          setCycleCount(prev => prev + 1)
          setMessage({ type: '', text: '', subtext: '' })
        }, 2500)
        return
      }

      if (step === 1 && status === 'running' && cycleIndex !== 3) {
        setMessage({ type: 'passed', text: 'Smoke Test: 10 tests passed', subtext: 'Success rate: 100%' })
        setTimeout(() => {
          setMessage({ type: '', text: '', subtext: '' })
          setStep(2)
        }, 1800)
        return
      }

      if (step === 2 && cycleIndex === 1) {
        // Regression fails on cycle 1
        setStatus('error')
        setMessage({ type: 'error', text: '5 failed · 45 passed · 0 skipped', subtext: 'Success rate: 90%' })
        setTimeout(() => {
          setStatus('running')
          setStep(0)
          setCycleCount(prev => prev + 1)
          setMessage({ type: '', text: '', subtext: '' })
        }, 2500)
        return
      }

      if (step === 2 && status === 'running' && cycleIndex !== 1) {
        setMessage({ type: 'passed', text: 'Regression Test: 50 tests passed', subtext: 'Success rate: 100%' })
        setTimeout(() => {
          setMessage({ type: '', text: '', subtext: '' })
          setStep(3)
        }, 1800)
        return
      }

      if (step === 3 && status === 'running') {
        setMessage({ type: 'deploy', text: 'Successfully deployed to production 🎉', subtext: '' })
        setTimeout(() => {
          setMessage({ type: '', text: '', subtext: '' })
          setStep(4)
        }, 1800)
        return
      }

      if (step === 4) {
        setStatus('success')
        setMessage({ type: 'complete', text: 'Pipeline complete ✨', subtext: '' })
        setTimeout(() => {
          setStep(0)
          setStatus('running')
          setCycleCount(prev => prev + 1)
          setMessage({ type: '', text: '', subtext: '' })
        }, 2500)
        return
      }

      if (step < steps.length - 1) {
        setStep(prev => prev + 1)
      }
    }

    // Faster start for build step, normal timing for others
    const delay = step === 0 ? 800 : (status === 'error' ? 2500 : 1400)
    const interval = setTimeout(runCycle, delay)
    return () => clearTimeout(interval)
  }, [step, status, cycleCount])

  const experiences = [
    { 
      company: 'KOLAY', 
      role: 'QA Engineering Lead', 
      period: '2023 — Present',
      featured: true,
      highlights: [
        { title: 'Test Strategy', desc: language === 'en' ? 'Defined end-to-end quality roadmap and automation strategy' : 'Uçtan uca kalite yol haritası ve otomasyon stratejisi belirleme' },
        { title: 'Cypress E2E', desc: language === 'en' ? 'Personally built and maintained E2E test suites' : 'E2E test suite\'lerini bizzat kurma ve yönetme' },
        { title: 'Team Leadership', desc: language === 'en' ? 'Led a team of QA engineers, mentoring growth' : 'QA ekibine liderlik ve mentorluk' },
        { title: 'CI/CD Pipeline', desc: language === 'en' ? 'Integrated Cypress tests into GitHub Actions' : 'Cypress testlerini GitHub Actions\'a entegre etme' },
        { title: 'Smoke & Regression', desc: language === 'en' ? 'Designed smoke and regression test frameworks' : 'Smoke ve regression test framework\'leri tasarlama' },
      ]
    },
    { 
      company: 'SAHİBİNDEN.COM', 
      role: 'Senior QA Engineer', 
      period: '2020 — 2023',
      highlights: [
        { title: 'E2E Automation', desc: language === 'en' ? 'Built test suite with 500+ scenarios' : '500+ senaryo ile test suite\'i kurma' },
        { title: 'Performance Testing', desc: language === 'en' ? 'Load testing for Turkey\'s highest-traffic platform' : 'Türkiye\'nin en yüksek trafikli platformu için yük testi' },
        { title: 'API Testing', desc: language === 'en' ? 'Contract & integration testing pipelines' : 'Kontrat ve entegrasyon test pipeline\'ları' },
        { title: 'Mobile Testing', desc: language === 'en' ? 'iOS & Android native app automation' : 'iOS ve Android native uygulama otomasyonu' },
        { title: 'Regression Suite', desc: language === 'en' ? 'Comprehensive regression coverage' : 'Kapsamlı regression coverage\'ı' },
      ]
    },
    { 
      company: 'GETİR', 
      role: 'QA Automation Engineer', 
      period: '2020',
      highlights: [
        { title: 'Hypergrowth', desc: language === 'en' ? 'Testing during rapid scaling phase' : 'Hızlı büyüme döneminde test' },
        { title: 'Mobile Automation', desc: language === 'en' ? 'Native iOS & Android test automation' : 'Native iOS ve Android test otomasyonu' },
        { title: 'Web Testing', desc: language === 'en' ? 'E2E web application testing' : 'E2E web uygulama testleri' },
        { title: 'Getir Yemek', desc: language === 'en' ? 'Food ordering flows & restaurant integrations' : 'Yemek sipariş akışları ve restoran entegrasyonları' },
        { title: 'Agile Delivery', desc: language === 'en' ? 'Fast-paced sprint delivery cycles' : 'Hızlı sprint teslimat döngüleri' },
      ]
    },
    { 
      company: 'ADPHORUS', 
      role: 'QA Test Engineer', 
      period: '2017 — 2020',
      highlights: [
        { title: 'TestCafe Framework', desc: language === 'en' ? 'Built automation framework with TestCafe' : 'TestCafe ile otomasyon framework\'ü kurma' },
        { title: 'AdTech Testing', desc: language === 'en' ? 'Complex ad platform testing' : 'Karmaşık reklam platformu testleri' },
        { title: 'Regression Testing', desc: language === 'en' ? 'Comprehensive regression test suites' : 'Kapsamlı regression test suite\'leri' },
        { title: 'Automation', desc: language === 'en' ? 'E2E and API test automation' : 'E2E ve API test otomasyonu' },
      ]
    },
    { 
      company: 'MOBİLİKE', 
      role: 'QA Engineer', 
      period: '2015 — 2017',
      highlights: [
        { title: 'Web & Mobile', desc: language === 'en' ? 'Cross-platform web and mobile testing' : 'Çapraz platform web ve mobil testleri' },
        { title: 'Manual Testing', desc: language === 'en' ? 'Exploratory & functional testing' : 'Keşif ve fonksiyonel testler' },
        { title: 'Automation Basics', desc: language === 'en' ? 'First automation projects with Selenium' : 'Selenium ile ilk otomasyon projeleri' },
        { title: 'QA Foundation', desc: language === 'en' ? 'Building strong QA fundamentals' : 'Güçlü QA temelleri oluşturma' },
      ]
    },
  ]

  const expertise = [
    'Automation Architecture',
    'Test Strategy & Leadership',
    'CI/CD Integration', 
    'API Testing', 
    'Performance Testing',
    'Mobile Testing',
    'Team Mentorship'
  ]

  const technologies = [
    { name: 'Cypress', desc: language === 'en' ? 'Large-scale UI & API automation' : 'Büyük ölçekli UI ve API otomasyonu' },
    { name: 'Selenium', desc: language === 'en' ? 'Cross-browser test automation' : 'Çapraz tarayıcı test otomasyonu' },
    { name: 'Playwright', desc: language === 'en' ? 'Modern E2E testing framework' : 'Modern E2E test framework\'ü' },
    { name: 'TestCafe', desc: language === 'en' ? 'Node.js-based automation' : 'Node.js tabanlı otomasyon' },
    { name: 'GitHub Actions', desc: language === 'en' ? 'Nightly health checks & reporting' : 'Gece sağlık kontrolleri ve raporlama' },
    { name: 'Jenkins', desc: language === 'en' ? 'Legacy pipeline support & orchestration' : 'Pipeline yönetimi ve orkestrasyon' },
    { name: 'TestRail', desc: language === 'en' ? 'Test case management & reporting' : 'Test case yönetimi ve raporlama' },
    { name: 'JavaScript', desc: language === 'en' ? 'Primary automation language' : 'Ana otomasyon dili' },
    { name: 'Python', desc: language === 'en' ? 'Scripting & data validation' : 'Script ve veri doğrulama' },
    { name: 'Postman', desc: language === 'en' ? 'API testing & contract validation' : 'API testi ve kontrat doğrulama' },
    { name: 'Charles Proxy', desc: language === 'en' ? 'Network debugging & mocking' : 'Ağ hata ayıklama ve mocking' },
  ]

  const qualityPrinciples = [
    {
      title: language === 'en' ? 'Shift-Left Mindset' : 'Shift-Left Yaklaşımı',
      desc: language === 'en' 
        ? 'Quality starts at design. I collaborate with PMs, developers, and stakeholders during refinement to identify risks before implementation—reducing costly rework and late-stage defects.'
        : 'Kalite tasarımda başlar. Refinement sürecinde PM, geliştirici ve paydaşlarla işbirliği yaparak riskleri uygulama öncesinde belirliyorum—maliyetli yeniden çalışma ve geç aşama hatalarını azaltıyorum.'
    },
    {
      title: language === 'en' ? 'Automation as a Safety Net' : 'Güvenlik Ağı Olarak Otomasyon',
      desc: language === 'en'
        ? 'Automation is not just about speed; it\'s about trust. I design robust UI and API suites that act as a safety net for rapid releases, ensuring critical user journeys remain intact.'
        : 'Otomasyon sadece hız için değil, güven içindir. Hızlı sürümler için güvenlik ağı görevi gören sağlam UI ve API suite\'leri tasarlıyorum, kritik kullanıcı yolculuklarının bozulmamasını sağlıyorum.'
    },
    {
      title: language === 'en' ? 'Business-Driven Test Strategy' : 'İş Odaklı Test Stratejisi',
      desc: language === 'en'
        ? 'Every test has a purpose. I prioritize scenarios based on business impact, user risk, and system criticality—protecting data integrity and customer trust rather than chasing coverage metrics.'
        : 'Her testin bir amacı var. Senaryoları iş etkisi, kullanıcı riski ve sistem kritikliğine göre önceliklendiriyorum—coverage metriklerini kovalamak yerine veri bütünlüğünü ve müşteri güvenini koruyorum.'
    },
    {
      title: language === 'en' ? 'Preventing, Not Just Finding' : 'Bulmak Değil, Önlemek',
      desc: language === 'en'
        ? 'My goal is not to find bugs—it\'s to prevent them from reaching production. Through continuous monitoring and CI health-checks, I help teams detect anomalies early and build long-term stability.'
        : 'Amacım bug bulmak değil—production\'a ulaşmalarını önlemek. Sürekli izleme ve CI sağlık kontrolleri ile ekiplerin anomalileri erken tespit etmesine ve uzun vadeli stabilite kurmasına yardımcı oluyorum.'
    }
  ]

  if (isLoading) {
    return (
      <div className="loader">
        <div className="loader-content">
          <div className="loader-name">Hasan Can YILDIR</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Sticky Header */}
      <div className={`sticky-header ${scrolled ? 'visible' : ''}`}>
        <div className="sticky-header-content">
          <span className="sticky-header-name">HASAN CAN YILDIR</span>
          <div className="sticky-header-links">
            <a 
              href="https://www.linkedin.com/in/hasan-can-yildir-b56848131" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="mailto:yldrhsncn@gmail.com" aria-label="Email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className={`app ${isReady ? 'ready' : ''}`}>
        {/* Header */}
        <header className="header">
          <a href="#" className="header-logo">Hasan Can YILDIR</a>
          <div className="header-controls">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="lang-btn" onClick={toggleLanguage}>
              {language === 'en' ? 'TR' : 'EN'}
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <p className="hero-label">
            {language === 'en' ? 'QA Engineering Lead' : 'QA Mühendislik Lideri'}
          </p>

          <h1 className="hero-title">
            {language === 'en' 
              ? 'Building scalable, automation-first quality systems for complex products.'
              : 'Karmaşık ürünler için ölçeklenebilir, otomasyon öncelikli kalite sistemleri kuruyorum.'
            }
          </h1>

          <p className="hero-subtitle">
            {language === 'en' 
              ? "Hands-on QA Engineering Lead with experience in designing automation architectures and driving quality initiatives at Turkey's top technology companies."
              : "Türkiye'nin önde gelen teknoloji şirketlerinde otomasyon mimarileri tasarlama ve kalite girişimleri yürütme deneyimine sahip QA Mühendislik Lideri."
            }
          </p>
        </section>

        {/* QA Pipeline Animation - DARK CARD */}
        <div className="dark-card">
          <div className="card-header">CI/CD Pipeline</div>
          <div className="pipeline">
            <div className="pipeline-track">
              <div className="track-bg" />
              <div 
                className="track-glow"
                style={{ left: `${(step / (steps.length - 1)) * 100}%` }}
              />
              <div 
                className={`track-fill ${status === 'error' ? 'error' : ''}`}
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            <div className="pipeline-nodes">
              {steps.map((s, index) => (
                <div 
                  key={s.full}
                  className={`pipeline-node 
                    ${index < step ? 'done' : ''} 
                    ${index === step ? 'active' : ''} 
                    ${index === step && status === 'error' ? 'error' : ''}
                    ${status === 'success' && step === steps.length - 1 ? 'complete' : ''}
                  `}
                >
                  <div className="node-circle">
                    {index < step || (status === 'success' && step === steps.length - 1) ? (
                      <svg className="node-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : index === step && status === 'error' ? (
                      <svg className="node-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    ) : index === step && status === 'running' ? (
                      <div className="node-spinner" />
                    ) : (
                      <span className="node-num">{index + 1}</span>
                    )}
                  </div>
                  <span className="node-label">
                    <span className="label-full">{s.full}</span>
                    <span className="label-short">{s.short}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className={`pipeline-console ${message.text ? 'visible' : ''}`}>
              {message.type === 'error' && (
                <div className="console-line error">
                  <span className="console-prefix">✕</span>
                  <div className="console-content">
                    <span className="console-text">{message.text}</span>
                    {message.subtext && <span className="console-subtext">{message.subtext}</span>}
                  </div>
                  <span className="console-action">Retrying...</span>
                </div>
              )}
              {message.type === 'passed' && (
                <div className="console-line passed">
                  <span className="console-prefix">✓</span>
                  <div className="console-content">
                    <span className="console-text">{message.text}</span>
                    {message.subtext && <span className="console-subtext">{message.subtext}</span>}
                  </div>
                </div>
              )}
              {message.type === 'build' && (
                <div className="console-line build">
                  <span className="console-prefix">✓</span>
                  <span className="console-text">{message.text}</span>
                </div>
              )}
              {message.type === 'deploy' && (
                <div className="console-line deploy">
                  <span className="console-prefix">🚀</span>
                  <span className="console-text">{message.text}</span>
                </div>
              )}
              {message.type === 'complete' && (
                <div className="console-line complete">
                  <span className="console-prefix">✓</span>
                  <span className="console-text">{message.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Info Grid */}
        <section className="info-grid">
          <div className="info-item featured">
            <span className="info-label">{language === 'en' ? 'Current Role' : 'Mevcut Pozisyon'}</span>
            <span className="info-value">QA Engineering Lead</span>
            <span className="info-sub">Kolay</span>
          </div>
          <div className="info-item">
            <span className="info-label">{language === 'en' ? 'Based in' : 'Lokasyon'}</span>
            <span className="info-value">İstanbul</span>
            <span className="info-sub">Türkiye</span>
          </div>
          <div className="info-item">
            <span className="info-label">{language === 'en' ? 'Background' : 'Akademik'}</span>
            <span className="info-value">İTÜ</span>
            <span className="info-sub">Electrical Engineering</span>
          </div>
          <div className="info-item">
            <span className="info-label">{language === 'en' ? 'Experience' : 'Deneyim'}</span>
            <span className="info-value">{experienceYears}+ {language === 'en' ? 'Years' : 'Yıl'}</span>
            <span className="info-sub">Quality Engineering</span>
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* How I Approach Quality */}
        <section className="section">
          <h2 className="section-title">
            {language === 'en' ? 'How I Approach Quality' : 'Kaliteye Yaklaşımım'}
          </h2>
          <p className="approach-intro">
            {language === 'en' 
              ? "I treat quality as an engineering responsibility shared across the entire product lifecycle—not a phase owned by QA alone. My approach focuses on early risk detection, automation-driven confidence, and business-aligned decision making."
              : "Kaliteyi sadece QA'in sahiplendiği bir aşama olarak değil, tüm ürün yaşam döngüsünde paylaşılan bir mühendislik sorumluluğu olarak görüyorum. Yaklaşımım erken risk tespiti, otomasyon odaklı güven ve iş hedeflerine uygun karar verme üzerine odaklanır."
            }
          </p>
          <div className="quality-principles">
            {qualityPrinciples.map((principle, idx) => (
              <div key={idx} className="principle-card">
                <h3 className="principle-title">{principle.title}</h3>
                <p className="principle-desc">{principle.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* Experience - DARK CARD with expandable */}
        <div className="dark-card">
          <div className="card-header">{language === 'en' ? 'Professional Experience' : 'Profesyonel Deneyim'}</div>
          <div className="experience-list">
            {experiences.map((exp, idx) => (
              <div 
                key={exp.company} 
                className={`experience-item ${expandedExp === idx ? 'expanded' : ''} ${exp.featured ? 'featured' : ''} ${idx > 1 ? 'muted' : ''}`}
                onClick={() => setExpandedExp(expandedExp === idx ? null : idx)}
              >
                <div className="exp-header">
                  <div className="exp-main">
                    <span className="exp-company">{exp.company}</span>
                    <span className="exp-role">{exp.role}</span>
                  </div>
                  <div className="exp-right">
                    <span className="exp-period">{exp.period}</span>
                    <span className="exp-toggle">{expandedExp === idx ? '−' : '+'}</span>
                  </div>
                </div>
                <div className="exp-details">
                  <div className="exp-highlights">
                    {exp.highlights.map((h, i) => (
                      <div key={i} className="highlight-item">
                        <span className="highlight-title">{h.title}</span>
                        <span className="highlight-desc">{h.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Expertise */}
        <section className="section">
          <h2 className="section-title">
            {language === 'en' ? 'Areas of Expertise' : 'Uzmanlık Alanları'}
          </h2>
          <div className="tags-list">
            {expertise.map((item) => (
              <span key={item} className="tag">{item}</span>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* Technologies */}
        <section className="section">
          <h2 className="section-title">
            {language === 'en' ? 'Technologies & Tools' : 'Teknolojiler ve Araçlar'}
          </h2>
          <div className="tools-grid">
            {technologies.map((tech) => (
              <div key={tech.name} className="tool-item">
                <span className="tool-name">{tech.name}</span>
                <span className="tool-desc">{tech.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* Contact */}
        <section className="section">
          <h2 className="section-title">
            {language === 'en' ? 'Connect' : 'İletişim'}
          </h2>
          <p className="contact-text">
            {language === 'en' 
              ? "Open to senior QA engineering and leadership roles in remote or distributed teams."
              : "Uzaktan veya dağıtık ekiplerde kıdemli QA mühendisliği ve liderlik rollerine açığım."
            }
          </p>
          <div className="contact-links">
            <a href="mailto:yldrhsncn@gmail.com" className="contact-link primary">
              yldrhsncn@gmail.com
            </a>
            <a 
              href="https://www.linkedin.com/in/hasan-can-yildir-b56848131" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              LinkedIn
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <span>© 2024 Hasan Can YILDIR</span>
        </footer>
      </div>
    </>
  )
}

export default function App() {
  return <AppContent />
}
