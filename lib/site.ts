// Built-in content. The site shows this wherever the matching Sanity field is empty,
// and scripts/seed-sanity.ts imports it into Sanity as the starting content.

export const site = {
  name: "Olea Social",
  tagline: "The modern Mediterranean in the heart of Covent Garden.",
  address: {
    line1: "10 Upper St Martin's Lane",
    city: "London",
    postcode: "WC2H 9FB",
  },
  phone: "+44 20 3149 1016",
  phoneHref: "tel:+442031491016",
  email: "booking@oleasocial.co.uk",
  bookingUrl:
    "https://www.opentable.co.uk/booking/restref/availability?lang=en-GB&correlationId=cb23b425-3861-4c8d-998e-2ef41d1075c5&restRef=334638&otSource=Restaurant%20website",
  hours: [
    { days: "Monday – Friday", time: "11:30am – 11:30pm" },
    { days: "Saturday – Sunday", time: "9:30am – 11:30pm" },
  ],
  mapsUrl: "https://maps.app.goo.gl/uB2yXdj9VMmqxZVC6",
  // Pin for the OpenStreetMap embed on the contact page.
  mapLocation: { lat: 51.51318, lon: -0.12715 },
  // Add profile URLs here to show them in the footer.
  social: [] as { label: string; href: string }[],
};

export const nav = [
  { href: "/about", label: "About Us" },
  { href: "/menu", label: "Menu" },
  { href: "/private-dining", label: "Private Dining" },
  { href: "/whats-on", label: "What's On" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export const home = {
  intro:
    "Welcome to Olea Social.",
  introSub:
    "Where the spirit of the modern Mediterranean brings people together over great food, vibrant flavours and shared experiences. From day to night, it's a place to eat, drink, connect and enjoy the moment in the heart of Covent Garden.",
  body: "It's time to discover the modern Mediterranean. Explore a menu inspired by the coasts of Turkey, Greece, Spain, Italy, Morocco and France, where fresh ingredients meet timeless cooking techniques and a contemporary touch. From the kitchen to the bar, everything at Olea Social is made for sharing.",
  promos: [
    {
      id: "christmas",
      eyebrow: "Gather around the table this festive season",
      title: "Christmas at Olea Social",
      body: [
        "Celebrate Christmas in the heart of Covent Garden at Olea Social. From festive dinners with friends and family to office parties and group celebrations, enjoy our specially created festive set menu in a warm and stylish setting.",
        "For something more intimate, celebrate in our private dining room, perfect for your Christmas gathering.",
      ],
      cta: { label: "Book your celebration", href: "/whats-on/festive-season" },
      image: "/images/christmas-home.png",
      alt: "Decorated Christmas tree beside a table set with red berries at Olea Social",
    },
    {
      id: "set-lunch",
      eyebrow: "Make lunch worth looking forward to",
      title: "Lunch at Olea Social",
      body: [
        "Take a break in the heart of Covent Garden with our Lunch Set Menu at £19.50 per person, or enjoy our Meze Lunch for £15 per person. Choose from Mediterranean-inspired starters and mains, from Babaganoush and Hummus to Chicken Tagine, Pide and Vegetable Moussaka.",
        "Perfect for a quick weekday lunch, a business catch-up or a leisurely afternoon.",
      ],
      cta: { label: "Book your table", href: site.bookingUrl },
      image: "/images/set-lunch.jpg",
      alt: "A freshly baked pide served with Mediterranean dips and salad",
    },
  ],
};

export const story = {
  title: "Our story",
  paragraphs: [
    "Olea Social began with a simple idea: to bring the flavours and food cultures of the Mediterranean together under one roof.",
    "The vision came before the restaurant itself – a place inspired by the generosity, simplicity and sociability of Mediterranean dining, drawing freely from across the region rather than defining itself through any single cuisine.",
    "When the opportunity arose to take on Olea's Covent Garden site, its generosity of space offered the chance to bring the concept to life. Olea could become more than somewhere to eat: a restaurant and bar built around gathering, sharing and spending time together.",
  ],
  name: [
    "The name reflects that same idea. Olea, the botanical name associated with the olive tree, connects the restaurant to something shared across much of the Mediterranean – its landscapes, its food and its culture of hospitality. Social expresses the other half of the idea: food as something best enjoyed together.",
    "Today, Olea continues to evolve, but that original idea remains at its heart – a contemporary expression of Mediterranean food, hospitality and social life in the heart of Covent Garden.",
  ],
  regions: ["Turkey", "Greece", "Spain", "Italy", "Morocco", "France"],
  slides: [
    { src: "/images/our-story-1.jpg", alt: "Olea Social dining room with a hanging garden ceiling and herringbone terracotta floor" },
    { src: "/images/our-story-2.jpg", alt: "Tables set beside Olea Social's tall street-facing windows" },
    { src: "/images/our-story-3.jpg", alt: "The marble-topped bar with green stools and back-lit shelves of bottles" },
  ],
  gallery: [
    { src: "/images/hero.jpg", alt: "Guests sharing Mediterranean dishes and drinks at Olea Social" },
    { src: "/images/meze-table.jpg", alt: "Meze of tabbouleh, hummus, aubergine, bread and fried calamari on a marble table" },
    { src: "/images/lunch-spread.jpg", alt: "A table of aubergine, hummus and tabbouleh" },
    { src: "/images/blog-christmas.jpg", alt: "Guests raising glasses together at Olea Social" },
    { src: "/images/our-story-1.jpg", alt: "Olea Social dining room with a hanging garden ceiling and herringbone terracotta floor" },
  ],
};

export const privateDining =
  "Made for sharing, celebrating and coming together. From relaxed lunches and group dinners to special celebrations and corporate gatherings, Olea Social offers a vibrant setting for memorable Mediterranean dining in the heart of Covent Garden.";

export type WhatsOnItem = {
  slug: string;
  title: string;
  category: "Festive" | "Menus" | "Events";
  summary: string;
  image: string;
  alt: string;
  menu?: string;
  date?: string;
};

export const whatsOn = {
  eyebrow: "Events & updates",
  title: "What's on at Olea Social",
  intro:
    "Seasonal celebrations, special gatherings and moments worth sharing. Find your next reason to visit Olea Social in the heart of Covent Garden.",
  items: [
    {
      slug: "festive-season",
      title: "Festive season at Olea Social",
      category: "Festive",
      summary:
        "Celebrate the festive season at Olea Social with specially curated menus, vibrant Mediterranean flavours and a warm, lively atmosphere — perfect for Christmas lunches, group dinners and festive celebrations in Covent Garden.",
      image: "/images/festive-card.png",
      alt: "Olea Social shopfront at night, lit sign and windows decorated with gold and silver baubles",
      menu: "christmas",
    },
    {
      slug: "kizlarla-bulusuyoruz",
      title: "Kızlarla Buluşuyoruz!",
      category: "Events",
      summary:
        "Join SuSu × INO Beauty at Olea Social on 7 November for an unforgettable evening of conversation, new connections and live music from Gizem Özbek. The event begins at 19:30.",
      image: "/images/event-kizlarla-v2.png",
      alt: "Poster for Kızlarla Buluşuyoruz! at Olea Social on 7 November",
      date: "7 November 2026 · 19:30",
    },
    {
      slug: "ekim-kahvalti-bulusmasi",
      title: "Ekim Kahvaltı Buluşması",
      category: "Events",
      summary:
        "Join Anneler Kulübü Londra for a Halloween breakfast at Olea Social on Sunday 25 October, 11:00–14:00. Enjoy a traditional breakfast spread and unlimited tea while children take part in fancy dress, face painting, crafts and games. Tickets are £45 per adult; children aged 0–5 dine free with an adult and ages 5–11 are £15.",
      image: "/images/event-ekim-kahvalti-v2.png",
      alt: "Poster for the Halloween breakfast gathering at Olea Social on 25 October",
      date: "25 October 2026 · 11:00–14:00 · £45 per person",
    },
  ] satisfies WhatsOnItem[],
};

export const posts = [
  {
    slug: "christmas-in-covent-garden",
    title: "Christmas in Covent Garden: Gather at Olea Social",
    excerpt:
      "Christmas lunches, festive dinners and group gatherings with Mediterranean flavours on Upper St Martin's Lane.",
    image: "/images/blog-exterior.jpg",
    alt: "Olea Social shopfront lit up at night with festive decorations",
    date: "2026-10-20",
    intro: [
      "Covent Garden feels especially lively during the festive season. It's a place to meet before an evening out, catch up with friends and make time for a proper celebration. At Olea Social, Christmas dining begins with Mediterranean food and the pleasure of sharing a table.",
      "Located on Upper St Martin's Lane, a short walk from Covent Garden and Leicester Square, Olea Social is well placed for a Christmas lunch, dinner or group gathering in central London.",
    ],
    sections: [
      {
        heading: "Turn Christmas lunch into an occasion",
        body: [
          "A festive lunch can be the highlight of the working week. Bring colleagues together to mark the end of the year, or meet friends for an afternoon that stretches beyond a quick meal.",
          "Olea Social's menu draws inspiration from the food cultures of Turkey, Greece, Spain, Italy and Morocco. Its approach to Mediterranean dining makes it a natural setting for a relaxed celebration with people you enjoy spending time with.",
        ],
      },
      {
        heading: "Dinner plans in the heart of Covent Garden",
        body: [
          "If you're planning a Christmas dinner, location matters. Olea Social gives your guests a central place to meet, whether dinner is the main event or part of a bigger evening in London.",
          "Start with drinks, take your time over dinner and enjoy the company around the table. For an office Christmas party or a gathering with friends and family, share your preferred date and group size with the team so they can help you plan.",
        ],
      },
      {
        heading: "Find your way to celebrate",
        body: [
          "Every group has its own idea of a good Christmas meal. Some want a long lunch; others are looking forward to an evening of conversation, Mediterranean flavours and Christmas drinks. Olea Social offers a setting for both.",
        ],
      },
    ],
    outro: "Planning a festive gathering? Explore Olea Social's menus and send an enquiry.",
  },
];
