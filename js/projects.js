/**
 * Portfolio content.
 *
 * Everything the page says about the owner and the projects lives here, so
 * the presentation code in main.js never needs to change when a project is
 * added or edited.
 *
 * To add a project: append an object to `projects` with a unique `id`, add a
 * desktop (1440px wide) and mobile (390px @2x) screenshot to assets/shots/,
 * and pick a panel colour that suits the project.
 */
window.PORTFOLIO = {
  site: {
    ownerName: "Abigail Amoah & John Yelbert",
    // Listed in the contact section; the brief form addresses its email to everyone here.
    people: [
      { name: "Abigail Amoah", email: "abigailamoah3@gmail.com", phone: "+233554771170" },
      { name: "John Yelbert", email: "n.yelbert@gmail.com", phone: "+233548761498" },
    ],
    wordmark: "Portfolio",
    // Shown in the hero with a live dot. Set to "" to hide it.
    availability: "Taking on new projects",
  },

  services: [
    "Company websites",
    "Product & platform sites",
    "Nonprofit & community sites",
    "Interface design",
    "Front-end development",
    "Responsive by default",
    "Accessible by default",
    "Redesigns",
  ],

  // "What we can build for you" – each links to the project that shows it.
  capabilities: [
    {
      title: "Company websites",
      text: "Credible, well-organised sites that explain what a business does and make it easy to get in touch.",
      project: "rightmasters",
    },
    {
      title: "Product & platform sites",
      text: "Sites that explain a product to more than one audience and walk each of them towards the next step.",
      project: "heartlink",
    },
    {
      title: "Nonprofit & community sites",
      text: "Warm, human sites that tell an organisation's story and give people clear ways to support it.",
      project: "nurtureville",
    },
    {
      title: "Redesigns",
      text: "Taking an existing site and giving it clearer structure, a sharper identity and a faster, responsive build.",
      project: null,
    },
  ],

  projects: [
    {
      id: "rightmasters",
      number: "01",
      category: "Corporate website",
      sector: "Logistics",
      name: "Right Masters Ltd",
      description:
        "A corporate website for Right Masters Company Limited, a freight forwarding and logistics company in Tema, Ghana. It sets out six core services clearly, from international freight forwarding and customs clearance to warehousing and vessel chartering, and gives every visitor a direct route to request a quote.",
      tags: ["Corporate", "Logistics", "Service pages", "Quote request", "Responsive"],
      url: "https://www.rightmastersltd.com/",
      layout: "half",
      panel: { bg: "#0d1b33", ink: "#eaf2fb" },
      shots: {
        desktop: "assets/shots/rightmasters-desktop.jpg",
        mobile: "assets/shots/rightmasters-mobile.jpg",
      },
    },
    {
      id: "heartlink",
      number: "02",
      category: "Digital health",
      sector: "Cardiac care",
      name: "HeartLINK+",
      description:
        "A website for an accessible cardiac-care platform. It speaks to individuals and loved ones, healthcare facilities and partners, and explains the mobile app, AI-powered cardiac analysis, remote patient monitoring and the Identify, Triage, Connect pathway to specialist care.",
      tags: ["Healthcare", "Product storytelling", "Multi-audience", "App promotion"],
      url: "https://www.hlinkplus.com/",
      layout: "half",
      panel: { bg: "#d9e6fb", ink: "#0f2a5c" },
      shots: {
        desktop: "assets/shots/heartlink-desktop.jpg",
        mobile: "assets/shots/heartlink-mobile.jpg",
      },
    },
    {
      id: "nurtureville",
      number: "03",
      category: "Purpose-led",
      sector: "Nonprofit",
      name: "Nurture Ville",
      description:
        "A website for Nurture Ville, a nonprofit supporting vulnerable people and young people through community outreach. Built around the message “Nurturing Dreams. Inspiring Hope. Empowering People.”, it shares the organisation's story, mission and values, its outreach events, a gallery, and clear ways to volunteer or donate.",
      tags: ["Nonprofit", "Community", "Events", "Gallery", "Donations"],
      url: "https://nurture-ville.vercel.app/",
      layout: "full",
      panel: { bg: "#2e5d3c", ink: "#f7f4ec" },
      shots: {
        desktop: "assets/shots/nurtureville-desktop.jpg",
        mobile: "assets/shots/nurtureville-mobile.jpg",
      },
    },
  ],
};
