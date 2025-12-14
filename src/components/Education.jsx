import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const education = [
  {
    school: 'İstanbul Teknik Üniversitesi',
    degree: 'Electrical & Electronics Engineering',
    type: "Engineer's Degree",
    period: '2011 - 2017',
    icon: '🎓',
    highlight: true
  },
  {
    school: 'Menderes Anadolu Lisesi',
    degree: 'Mathematics & Science',
    type: 'Valedictorian (2nd)',
    period: '2008 - 2011',
    gpa: '4.00 / 4.00',
    icon: '🏫',
    highlight: false
  }
]

function Education() {
  const { t } = useLanguage()

  return (
    <section id="education" className="education section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-tag">{t('education.tag')}</span>
          <h2 className="section-title">{t('education.title')}</h2>
        </motion.div>

        <div className="education-grid">
          {education.map((edu, index) => (
            <motion.div
              key={edu.school}
              className={`education-card ${edu.highlight ? 'highlight' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="edu-icon">{edu.icon}</div>
              
              <div className="edu-content">
                <h3 className="edu-school">{edu.school}</h3>
                <p className="edu-degree">{edu.degree}</p>
                <p className="edu-type">{edu.type}</p>
                
                <div className="edu-meta">
                  <span className="edu-period">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {edu.period}
                  </span>
                  
                  {edu.gpa && (
                    <span className="edu-gpa">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      {edu.gpa}
                    </span>
                  )}
                </div>
              </div>

              <div className="edu-decoration"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
