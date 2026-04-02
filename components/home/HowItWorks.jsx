import Link from 'next/link';

const steps = [
  {
    num: '01',
    icon: 'fas fa-gift',
    title: 'Gift or Adopt a Tree',
    desc: 'Choose a tree for any occasion — birthdays, weddings, memorials, or just because. Each tree is planted on GreenEye\'s landbank.',
    link: '/gift-a-tree',
  },
  {
    num: '02',
    icon: 'fas fa-map-marked-alt',
    title: 'We Plant & Track',
    desc: 'Our field team plants your tree and uploads real photos with GPS coordinates. You get a certificate with a unique tracking ID.',
    link: null,
  },
  {
    num: '03',
    icon: 'fas fa-eye',
    title: 'Watch It Grow',
    desc: 'Follow your tree\'s journey — from sapling to forest. Get updates, photos, and see your tree on the live map.',
    link: '/forest',
  },
];

const HowItWorks = () => {
  return (
    <section className="ge-how ge-section">
      <div className="ge-container">
        <div className="ge-how__header">
          <span className="ge-overline">How It Works</span>
          <h2>From your heart to the earth — in 3 steps</h2>
          <hr className="ge-divider ge-divider-center" />
        </div>

        <div className="ge-how__grid">
          {steps.map((step, i) => (
            <div key={step.num} className="ge-how__card">
              <div className="ge-how__num">{step.num}</div>
              <div className="ge-how__icon">
                <i className={step.icon}></i>
              </div>
              <h3 className="ge-how__title">{step.title}</h3>
              <p className="ge-how__desc">{step.desc}</p>
              {step.link && (
                <Link href={step.link} className="ge-how__link">
                  Learn more <i className="fas fa-arrow-right"></i>
                </Link>
              )}
              {i < steps.length - 1 && (
                <div className="ge-how__connector" aria-hidden="true">
                  <i className="fas fa-chevron-right"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
