import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact'
    },
    hero: {
      badge: 'Currently working at Kolay',
      greeting: "Hi, I'm",
      name: 'Hasan Can YILDIR',
      role: 'Software QA Team Lead',
      description: 'Quality is not a phase—it\'s a mindset. I lead the design of end-to-end testing strategies that embed quality into every stage of the development lifecycle. With a strong hands-on background, I build scalable automation architectures, integrate continuous testing into CI/CD pipelines, and help teams adopt a sustainable, quality-first engineering culture.',
      cta: 'Get in Touch',
      ctaSecondary: 'View Experience',
      stats: {
        years: 'Years Experience',
        companies: 'Companies',
        tests: 'Test Scenarios'
      },
      scroll: 'Scroll Down'
    },
    about: {
      tag: '01. About',
      title: 'Get to Know Me',
      text1: "I'm an Electrical & Electronics Engineering graduate from Istanbul Technical University. I've been working in software quality assurance since 2015, and currently serve as QA Team Lead at Kolay.",
      text2: "Throughout my career, I've had the opportunity to work at leading Turkish tech companies including Mobilike, Adphorus, Getir, and sahibinden.com. During this time, I've gained extensive experience from manual testing to automation, mobile app testing to API testing.",
      text3: "Currently, I'm leading a team focused on improving test processes, defining automation strategies, and elevating quality standards.",
      languages: 'Languages',
      native: 'Native',
      professional: 'Professional',
      elementary: 'Elementary'
    },
    experience: {
      tag: '02. Experience',
      title: 'Career Journey',
      current: 'Current',
      responsibilities: {
        kolay: [
          'Leading and mentoring the QA team',
          'Defining and implementing test strategies',
          'Developing automation frameworks',
          'Tracking and reporting quality metrics',
          'Coordinating with cross-functional teams'
        ],
        sahibinden: [
          'Creating and executing comprehensive test scenarios',
          'Developing automation test cases',
          'Integrating tests into CI/CD pipelines',
          'Performing performance and load testing',
          'Mentoring junior engineers'
        ],
        getir: [
          'Mobile application automation testing',
          'API test automation',
          'Setting up and maintaining test frameworks',
          'Bug tracking and reporting processes'
        ],
        adphorus: [
          'Analyzing and improving QA processes',
          'Creating comprehensive test plans',
          'Automation test cases with Selenium',
          'CI/CD integration with Jenkins, Travis CI',
          'API testing with Postman',
          'Unix/Linux, Git, Agile/Scrum methodologies'
        ],
        mobilike: [
          'Mobile application testing (iOS & Android)',
          'Test case creation and execution',
          'Bug tracking and documentation',
          'Regression testing',
          'Cross-browser and cross-device testing'
        ]
      }
    },
    skills: {
      tag: '03. Skills',
      title: 'What I Can Do',
      categories: {
        testing: 'Testing & QA',
        tools: 'Tools',
        technical: 'Technical'
      },
      toolsTitle: 'Tools I Use'
    },
    education: {
      tag: '04. Education',
      title: 'Academic Background'
    },
    contact: {
      tag: '05. Contact',
      title: 'Get in Touch',
      intro: "I'm open to new opportunities, collaborations, or just saying hello. I'll do my best to get back to you as soon as possible!",
      email: 'Email',
      or: 'Or directly',
      sendEmail: 'Send Email'
    },
    footer: '© 2024 Hasan Can YILDIR. All rights reserved.',
    schedule: {
      title: 'Book a Call',
      subtitle: 'Schedule an Appointment',
      selectTime: 'Select a Time',
      portfolio: 'Portfolio',
      noSlots: 'No available slots',
      selectDay: 'Select a day to see available times',
      available: 'Available',
      booked: 'Booked',
      pending: 'Pending',
      footer: 'Crafted in Istanbul',
      modal: {
        title: 'Request Appointment',
        name: 'Full Name',
        namePlaceholder: 'Enter your full name',
        phone: 'Phone Number',
        phonePlaceholder: '+90 5XX XXX XX XX',
        note: 'Note (Optional)',
        notePlaceholder: 'Any additional information...',
        submit: 'Send Request',
        submitting: 'Sending...',
        success: 'Request Sent!',
        successMessage: 'We will contact you to confirm your appointment.'
      },
      calendar: {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        today: 'Today'
      },
      admin: {
        title: 'Admin Panel',
        logout: 'Logout',
        pending: 'Pending',
        today: 'Today',
        upcoming: 'Upcoming',
        cancelled: 'Cancelled',
        tabs: {
          requests: 'Pending Requests',
          calendar: 'Calendar & Slots',
          appointments: 'Appointments',
          settings: 'Settings'
        },
        noRequests: 'No pending requests',
        todayAppointments: "Today's Appointments",
        noAppointmentsToday: 'No appointments today',
        approve: 'Approve',
        reject: 'Reject',
        settings: {
          title: 'Slot Settings',
          duration: 'Slot Duration',
          minutes: 'minutes',
          save: 'Save Settings'
        }
      }
    }
  },
  tr: {
    nav: {
      home: 'Ana Sayfa',
      about: 'Hakkımda',
      experience: 'Deneyim',
      skills: 'Yetenekler',
      education: 'Eğitim',
      contact: 'İletişim'
    },
    hero: {
      badge: "Kolay'da Çalışıyorum",
      greeting: 'Merhaba, Ben',
      name: 'Hasan Can YILDIR',
      role: 'Software QA Team Lead',
      description: 'Kalite bir aşama değil, bir zihniyettir. Kaliteyi geliştirme yaşam döngüsünün her aşamasına entegre eden uçtan uca test stratejileri tasarlıyorum. Güçlü bir uygulamalı geçmişle, ölçeklenebilir otomasyon mimarileri kuruyorum, sürekli testi CI/CD pipeline\'larına entegre ediyorum ve ekiplerin sürdürülebilir, kalite odaklı bir mühendislik kültürü benimsemesine yardımcı oluyorum.',
      cta: 'İletişime Geç',
      ctaSecondary: 'Deneyimlerimi Gör',
      stats: {
        years: 'Yıl Deneyim',
        companies: 'Şirket',
        tests: 'Test Senaryosu'
      },
      scroll: 'Aşağı Kaydır'
    },
    about: {
      tag: '01. Hakkımda',
      title: 'Beni Tanıyın',
      text1: "İstanbul Teknik Üniversitesi'nden Elektrik-Elektronik Mühendisliği mezunuyum. 2015'ten bu yana yazılım kalite güvencesi alanında çalışıyorum ve şu an Kolay'da QA Team Lead olarak görev yapıyorum.",
      text2: "Kariyerim boyunca Mobilike, Adphorus, Getir ve sahibinden.com gibi Türkiye'nin önde gelen teknoloji şirketlerinde çalışma fırsatı buldum. Bu süreçte manuel testlerden otomasyon testlerine, mobil uygulama testlerinden API testlerine kadar geniş bir yelpazede deneyim kazandım.",
      text3: 'Şu an ekip liderliği yaparak, test süreçlerinin iyileştirilmesi, otomasyon stratejilerinin belirlenmesi ve kalite standartlarının yükseltilmesi üzerine çalışıyorum.',
      languages: 'Diller',
      native: 'Anadil',
      professional: 'Profesyonel',
      elementary: 'Başlangıç'
    },
    experience: {
      tag: '02. Deneyim',
      title: 'Kariyer Yolculuğum',
      current: 'Aktif',
      responsibilities: {
        kolay: [
          'QA ekibine liderlik etme ve mentorluk',
          'Test stratejilerinin belirlenmesi ve uygulanması',
          "Otomasyon framework'lerinin geliştirilmesi",
          'Kalite metriklerinin takibi ve raporlanması',
          'Cross-functional ekiplerle koordinasyon'
        ],
        sahibinden: [
          'Kapsamlı test senaryoları oluşturma ve yürütme',
          "Otomasyon test case'lerinin geliştirilmesi",
          "CI/CD pipeline'larına test entegrasyonu",
          'Performans ve yük testlerinin gerçekleştirilmesi',
          'Junior mühendislere mentorluk'
        ],
        getir: [
          'Mobil uygulama otomasyon testleri',
          'API test otomasyonu',
          "Test framework'ünün kurulumu ve bakımı",
          'Hata takibi ve raporlama süreçleri'
        ],
        adphorus: [
          'QA süreçlerinin analizi ve iyileştirilmesi',
          'Kapsamlı test planları oluşturma',
          "Selenium ile otomasyon test case'leri",
          'Jenkins, Travis CI ile CI/CD entegrasyonu',
          'API testing (Postman)',
          'Unix/Linux, Git, Agile/Scrum metodolojileri'
        ],
        mobilike: [
          'Mobil uygulama testleri (iOS & Android)',
          'Test case oluşturma ve yürütme',
          'Hata takibi ve dokümantasyon',
          'Regresyon testleri',
          'Cross-browser ve cross-device testleri'
        ]
      }
    },
    skills: {
      tag: '03. Yetenekler',
      title: 'Neler Yapabilirim?',
      categories: {
        testing: 'Testing & QA',
        tools: 'Araçlar',
        technical: 'Teknik'
      },
      toolsTitle: 'Kullandığım Araçlar'
    },
    education: {
      tag: '04. Eğitim',
      title: 'Akademik Geçmişim'
    },
    contact: {
      tag: '05. İletişim',
      title: 'Bana Ulaşın',
      intro: 'Yeni fırsatlar, işbirlikleri veya sadece merhaba demek için benimle iletişime geçebilirsiniz. En kısa sürede dönüş yapmaya çalışacağım!',
      email: 'E-posta',
      or: 'Veya direkt olarak',
      sendEmail: 'Mail Gönder'
    },
    footer: '© 2024 Hasan Can YILDIR. Tüm hakları saklıdır.',
    schedule: {
      title: 'Randevu Al',
      subtitle: 'Görüşme Planla',
      selectTime: 'Saat Seçin',
      portfolio: 'Portfolio',
      noSlots: 'Müsait slot yok',
      selectDay: 'Müsait saatleri görmek için gün seçin',
      available: 'Müsait',
      booked: 'Dolu',
      pending: 'Beklemede',
      footer: "İstanbul'da Yapıldı",
      modal: {
        title: 'Randevu Talebi',
        name: 'Ad Soyad',
        namePlaceholder: 'Adınızı ve soyadınızı girin',
        phone: 'Telefon Numarası',
        phonePlaceholder: '+90 5XX XXX XX XX',
        note: 'Not (İsteğe bağlı)',
        notePlaceholder: 'Eklemek istediğiniz bilgiler...',
        submit: 'Talep Gönder',
        submitting: 'Gönderiliyor...',
        success: 'Talep Gönderildi!',
        successMessage: 'Randevunuzu onaylamak için sizinle iletişime geçeceğiz.'
      },
      calendar: {
        months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        days: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
        today: 'Bugün'
      },
      admin: {
        title: 'Admin Paneli',
        logout: 'Çıkış',
        pending: 'Bekleyen',
        today: 'Bugün',
        upcoming: 'Yaklaşan',
        cancelled: 'İptal',
        tabs: {
          requests: 'Bekleyen Talepler',
          calendar: 'Takvim & Slotlar',
          appointments: 'Randevular',
          settings: 'Ayarlar'
        },
        noRequests: 'Bekleyen talep yok',
        todayAppointments: 'Bugünkü Randevular',
        noAppointmentsToday: 'Bugün randevu yok',
        approve: 'Onayla',
        reject: 'Reddet',
        settings: {
          title: 'Slot Ayarları',
          duration: 'Slot Süresi',
          minutes: 'dakika',
          save: 'Ayarları Kaydet'
        }
      }
    }
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en')
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

