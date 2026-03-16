require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const path = require('path');

const SiteContent = require('../models/SiteContent');
const History = require('../models/History');
const Branch = require('../models/Branch');
const Testimony = require('../models/Testimony');
const Contact = require('../models/Contact');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB. Seeding data...');

  // Site Content
  await SiteContent.deleteMany({});
  await SiteContent.create({});
  console.log('✅ SiteContent seeded');

  // History
  await History.deleteMany({});
  await History.insertMany([
    { year: '2001', tag: 'The Beginning', title: 'A Seed Planted in Prayer', pullQuote: '"Faith the size of a mustard seed can move mountains."', description1: 'It began not with grand plans, but with a handful of broken hearts and a desperate hunger for God. In 2001, twelve believers gathered for the first time in a humble room — no stage, no microphone, only a wooden cross nailed to the wall and a tattered Bible.', description2: 'They prayed, wept, and believed. The vision was simple yet profound: to build a community where every person could encounter the living God.', facts: [{ icon: 'fas fa-users', text: '12 founding members' }, { icon: 'fas fa-map-marker-alt', text: 'First meeting: a rented room' }], image: 'images/history-2001.png', order: 1 },
    { year: '2005', tag: 'A Place to Call Home', title: 'The First House of God', pullQuote: '"Unless the Lord builds the house, the builders labour in vain."', description1: 'Four years of faithful tithing, sacrifice, and prayer — and God was faithful. In 2005, Abhisek Methodist Church dedicated its first permanent building.', description2: 'Membership swelled to over 100 believers, each one a living stone in the house God was building.', facts: [{ icon: 'fas fa-users', text: "100+ members by year's end" }, { icon: 'fas fa-pray', text: 'First dedicated worship space' }], image: 'images/history-2005.png', order: 2 },
    { year: '2008', tag: 'Love in Action', title: 'Going Beyond the Four Walls', pullQuote: '"Pure religion is this: to care for orphans and widows in their distress."', description1: 'In 2008, Abhisek Methodist launched its first large-scale community outreach programs — food drives, free medical camps and educational sponsorships for underprivileged children.', description2: 'Hundreds of families in the surrounding community felt the tangible love of God through the hands and hearts of church volunteers.', facts: [{ icon: 'fas fa-box-open', text: '500+ families served' }, { icon: 'fas fa-graduation-cap', text: 'Education sponsors launched' }], artBackground: 'linear-gradient(145deg, #1a3a8f 0%, #be123c 60%, #7c3aed 100%)', artIcon: 'fas fa-hand-holding-heart', artText: 'Serving the Community', order: 3 },
    { year: '2012', tag: 'Multiplication', title: 'The First Branch is Born', pullQuote: '"Go therefore and make disciples of all nations."', description1: 'In 2012, the first branch of Abhisek Methodist Church was opened in a neighbouring community.', description2: 'On opening day, the branch was already packed. People who had never been to church before walked through those doors, many moved to tears by the warmth and worship they encountered.', facts: [{ icon: 'fas fa-church', text: '1st branch officially established' }, { icon: 'fas fa-users', text: '200+ strong congregation' }], artBackground: 'linear-gradient(145deg, #0c6e5c 0%, #0891b2 50%, #1a56db 100%)', artIcon: 'fas fa-map-marked-alt', artText: 'Spreading the Gospel', order: 4 },
    { year: '2024', tag: '25 Years of Grace', title: "A Quarter Century of God's Faithfulness", pullQuote: '"Surely goodness and mercy shall follow me all the days of my life."', description1: 'Twenty-five years. In 2024, Abhisek Methodist Church celebrated its Silver Anniversary — surrounded by over 500 members, 8 established branches, and a legacy that will outlast all of us.', description2: 'The celebration was filled with tears of joy, testimonies of healing and restoration, and a renewed commitment to carry the Gospel to every corner of the region and beyond.', facts: [{ icon: 'fas fa-church', text: '8 branches established' }, { icon: 'fas fa-users', text: '500+ church family members' }, { icon: 'fas fa-star', text: '25 years of unbroken faith' }], artBackground: 'linear-gradient(145deg, #b45309 0%, #be123c 40%, #1a56db 100%)', artIcon: 'fas fa-trophy', artText: '25 Years of Grace', order: 5 },
  ]);
  console.log('✅ History seeded');

  // Branches
  await Branch.deleteMany({});
  await Branch.insertMany([
    { tag: 'Main Campus', name: 'Abhisek Methodist Church — Main', location: 'Central District, City', schedule: 'Every Saturday, 10:00 AM', phone: '+91-98765-43210', colorClass: 'branch-blue', order: 1 },
    { tag: 'North Branch', name: 'Abhisek Methodist — North Campus', location: 'North District, City', schedule: 'Every Saturday, 9:30 AM', phone: '+91-98765-43211', colorClass: 'branch-red', order: 2 },
    { tag: 'South Branch', name: 'Abhisek Methodist — South Campus', location: 'South District, City', schedule: 'Every Saturday, 10:00 AM', phone: '+91-98765-43212', colorClass: 'branch-purple', order: 3 },
    { tag: 'East Branch', name: 'Abhisek Methodist — East Campus', location: 'East District, City', schedule: 'Every Saturday, 10:30 AM', phone: '+91-98765-43213', colorClass: 'branch-teal', order: 4 },
    { tag: 'West Branch', name: 'Abhisek Methodist — West Campus', location: 'West District, City', schedule: 'Every Saturday, 9:00 AM', phone: '+91-98765-43214', colorClass: 'branch-gold', order: 5 },
    { tag: 'Rural Outreach', name: 'Abhisek Methodist — Rural Ministry', location: 'Rural District, Outskirts', schedule: 'Every Saturday, 8:30 AM', phone: '+91-98765-43215', colorClass: 'branch-green', order: 6 },
  ]);
  console.log('✅ Branches seeded');

  // Testimonies
  await Testimony.deleteMany({});
  await Testimony.insertMany([
    { name: 'Mary Johnson', role: 'Member since 2015', message: 'Joining Abhisek Methodist Church changed my life completely. I had lost all hope, but through the prayers and love of this community, God restored my family, my health, and my faith. I am forever grateful.', initial: 'M', avatarColor: 'linear-gradient(135deg, #1a56db, #3b82f6)', order: 1 },
    { name: 'Rajesh Kumar', role: 'Member since 2018', message: 'I came to this church broken and searching. The Saturday fellowship became my anchor. Through the Word and the worship, I found my purpose and calling. God is truly present in this place.', initial: 'R', avatarColor: 'linear-gradient(135deg, #be123c, #f43f5e)', order: 2 },
    { name: 'Priya Mehra', role: 'Youth Leader, Member since 2012', message: 'The youth ministry here gave me a foundation of faith that has carried me through university and life. The leaders poured into us with such love and wisdom. I am now leading my own small group!', initial: 'P', avatarColor: 'linear-gradient(135deg, #7c3aed, #a855f7)', order: 3 },
    { name: 'Samuel Osei', role: 'Member since 2010', message: 'When my business failed and I was in deep debt, the church community came alongside me. They prayed, supported, and encouraged me. Within a year, God opened new doors. This church is a true family.', initial: 'S', avatarColor: 'linear-gradient(135deg, #d97706, #f59e0b)', order: 4 },
    { name: 'Grace Lindokuhle', role: 'Member since 2019', message: 'I was diagnosed with a serious illness, and the intercessory team prayed faithfully for months. The doctors were amazed at my recovery. I know it was God working through those prayers. My faith is stronger than ever.', initial: 'G', avatarColor: 'linear-gradient(135deg, #059669, #10b981)', order: 5 },
  ]);
  console.log('✅ Testimonies seeded');

  // Contact
  await Contact.deleteMany({});
  await Contact.create({});
  console.log('✅ Contact seeded');

  console.log('\n🎉 Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed error:', err.message); process.exit(1); });
