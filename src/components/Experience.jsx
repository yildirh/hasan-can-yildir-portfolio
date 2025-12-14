import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

function Experience() {
  const { t } = useLanguage()

  const experiences = [
    {
      company: 'Kolay',
      role: 'Software Quality Assurance Team Lead',
      period: 'Jul 2023 - Present',
      duration: '1.5+ yrs',
      current: true,
      key: 'kolay'
    },
    {
      company: 'sahibinden.com',
      role: 'Senior Software Quality Assurance Engineer',
      period: 'Nov 2020 - Aug 2023',
      duration: '2 yrs 10 mos',
      current: false,
      key: 'sahibinden'
    },
    {
      company: 'Getir',
      role: 'Quality Assurance Automation Engineer',
      period: 'May 2020 - Nov 2020',
      duration: '7 mos',
      current: false,
      key: 'getir'
    },
    {
      company: 'Adphorus',
      role: 'QA Test Engineer',
      period: 'May 2017 - May 2020',
      duration: '3 yrs 1 mo',
      current: false,
      key: 'adphorus'
    },
    {
      company: 'Mobilike',
      role: 'QA Engineer',
      period: 'Jun 2015 - May 2017',
      duration: '2 yrs',
      current: false,
      key: 'mobilike'
    }
  ]

  return (
    <section id="experience" className="experience section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-tag">{t('experience.tag')}</span>
          <h2 className="section-title">{t('experience.title')}</h2>
        </motion.div>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              className={`timeline-item ${exp.current ? 'current' : ''}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="timeline-marker">
                <div className="marker-dot"></div>
              </div>
              
              <div className="timeline-content">
                <div className="exp-header">
                  <div className="exp-company">
                    <h3>{exp.company}</h3>
                    {exp.current && <span className="current-badge">{t('experience.current')}</span>}
                  </div>
                  <span className="exp-duration">{exp.duration}</span>
                </div>
                
                <p className="exp-role">{exp.role}</p>
                <p className="exp-period">{exp.period}</p>
                
                <ul className="exp-responsibilities">
                  {t(`experience.responsibilities.${exp.key}`)?.map((resp, i) => (
                    <li key={i}>
                      <span className="bullet">▹</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
