const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
  // Hero Section
  heroTitle: { type: String, default: 'Abhisek Methodist Church' },
  heroSubtitle: { type: String, default: 'A place of faith, hope, and boundless love. Come as you are, and be transformed by God\'s grace.' },
  heroBadge: { type: String, default: 'Welcome to Our Church Family' },
  heroSaturday: { type: String, default: 'Join us every Saturday for our weekly fellowship service' },

  // Pastor Welcome
  pastorName: { type: String, default: 'Rev. Singa Bahadur Tamang' },
  pastorTitle: { type: String, default: 'Senior Pastor, Abhisek Methodist Church' },
  pastorQuote: { type: String, default: '"Where two or three gather in my name, there am I with them."' },
  pastorMessage1: { type: String, default: 'Dear beloved friends and visitors, you are warmly welcomed to Abhisek Methodist Church — a community built on love, rooted in Scripture, and committed to making disciples of Christ.' },
  pastorMessage2: { type: String, default: 'We believe that every person has a unique purpose, and we are here to walk alongside you on your journey. Come, worship with us every Saturday and experience the transforming power of God\'s presence.' },

  // About Section
  visionText: { type: String, default: 'To be a vibrant, Christ-centered community that impacts every sphere of life — family, society, and nation — with the Gospel of Jesus Christ.' },
  missionText: { type: String, default: 'To love God, grow together in faith, serve our community, and make disciples who transform the world through the power of the Holy Spirit.' },
  valuesText: { type: String, default: 'We are guided by love, integrity, worship, discipleship, community, and a deep commitment to Scripture as the Word of God.' },
  spiritText: { type: String, default: 'We welcome all people regardless of background, age, or status. In Christ, we are one family — united in love, purpose, and praise.' },

  // Fellowship / Members
  fellowshipTitle: { type: String, default: 'Every Saturday — Weekly Fellowship Service' },
  fellowshipDesc: { type: String, default: 'Our weekly Saturday gatherings are the heartbeat of our community. We come together for worship, prayer, the Word, and meaningful fellowship. All are welcome.' },

  // Announcements / Event Banner
  eventBannerText: { type: String, default: 'Weekly Fellowship — Join us every Saturday for worship, prayer, and community. Service begins at 10:00 AM.' },

  // Stats
  memberCount: { type: Number, default: 100 },
  yearsOfService: { type: Number, default: 25 },
  branchCount: { type: Number, default: 2 },
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', SiteContentSchema);
