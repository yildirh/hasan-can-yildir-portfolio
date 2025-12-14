import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const skillCategories = [
  {
    titleKey: 'testing',
    icon: '🔍',
    skills: [
      { name: 'Test Automation', level: 95 },
      { name: 'API Testing', level: 90 },
      { name: 'Mobile Testing', level: 88 },
      { name: 'Performance Testing', level: 85 },
      { name: 'Manual Testing', level: 95 },
    ]
  },
  {
    titleKey: 'tools',
    icon: '🛠️',
    skills: [
      { name: 'Cypress', level: 92 },
      { name: 'Selenium', level: 92 },
      { name: 'TestCafe', level: 88 },
      { name: 'Playwright', level: 85 },
      { name: 'Postman', level: 90 },
    ]
  },
  {
    titleKey: 'technical',
    icon: '💻',
    skills: [
      { name: 'JavaScript', level: 85 },
      { name: 'Python', level: 80 },
      { name: 'Git & GitHub', level: 90 },
      { name: 'CI/CD', level: 85 },
      { name: 'Agile/Scrum', level: 90 },
    ]
  }
]

const tools = [
  { name: 'Cypress', icon: '🌲' },
  { name: 'Selenium', icon: '🔷' },
  { name: 'TestCafe', icon: '☕' },
  { name: 'Playwright', icon: '🎭' },
  { name: 'Postman', icon: '🚀' },
  { name: 'JIRA', icon: '📋' },
  { name: 'Jenkins', icon: '🔧' },
  { name: 'GitHub', icon: '🐙' },
  { name: 'GitHub Actions', icon: '⚡' },
  { name: 'JavaScript', icon: '🟨' },
  { name: 'Python', icon: '🐍' },
  { name: 'Linux', icon: '🐧' },
]

function Skills() {
  const { t } = useLanguage()

  return (
    <section id="skills" className="skills section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-tag">{t('skills.tag')}</span>
          <h2 className="section-title">{t('skills.title')}</h2>
        </motion.div>

        <div className="skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.titleKey}
              className="skill-category"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3>{t(`skills.categories.${category.titleKey}`)}</h3>
              </div>
              
              <div className="skill-list">
                {category.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="skill-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-progress"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="tools-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="tools-title">{t('skills.toolsTitle')}</h3>
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                className="tool-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -3 }}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
