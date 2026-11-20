import type { WeddingConfig } from "@/types/wedding";

/**
 * THE single source of truth for every name, date, venue detail, number and
 * line of copy on the site. Components read from here — never hardcode.
 *
 * `null` means "not supplied". Leave it null rather than inventing a value:
 * the UI hides that element or shows an honest fallback.
 */
export const wedding: WeddingConfig = {
  theme: {
    name: "The Royal Sands: A Prince of Persia Wedding",
    inspiration:
      "Fan inspired by the atmosphere and visual world of Prince of Persia, particularly its ancient Persian architecture, mystical sands, time manipulation, enchanted environments and royal grandeur.",
    mood: ["Majestic", "Mystical", "Cinematic", "Romantic", "Enchanting"],
    disclaimer:
      "An unofficial Prince of Persia inspired wedding experience. Not affiliated with or endorsed by Ubisoft.",
  },

  couple: {
    groom: {
      fullName: "Tahir Zaheer Mirza",
      firstName: "Tahir",
      parents: {
        relation: "Son of",
        mother: "Mrs. Mehrunnisa Zaheer Mirza",
        father: "Mr. Zaheer Yusuf Mirza",
      },
    },
    bride: {
      fullName: "Nazneen Rais Shaikh",
      firstName: "Nazneen",
      parents: {
        relation: "Daughter of",
        mother: "Mrs. Shadab Rais Shaikh",
        father: "Mr. Rais Hammad Shaikh",
      },
    },
    monogram: "TN",
  },

  event: {
    occasion: "Dawat e Walima",
    date: "2026-12-19",
    day: "Saturday",
    startTime: "19:00",
    endTime: null,
    timeDisplay: "7 PM onwards",
    timeZone: "Asia/Kolkata",
    timeZoneLabel: "IST",
  },

  venue: {
    name: "The Grand FM Banquet",
    area: "Jogeshwari West",
    addressLines: [
      "Dilshad Banquet, 1st Floor, E.E. Heights,",
      "Above Jaffar Bhai Delhi Darbar Restaurant,",
      "S.V. Road, Jogeshwari West,",
      "Mumbai 400102.",
    ],
    city: "Mumbai, India",
    // Shared by the family — resolves to the Google place "Dilshad Banquet Hall" (kgmid /g/11f_c06981).
    mapsUrl: "https://share.google/sDT3jLqSsR662lLl3",
    // See README "Map coordinates" for how these were checked.
    coordinates: {
      lat: 19.1356062,
      lng: 72.8476525,
      source:
        "OpenStreetMap node 10218172785 'Delhi Darbar', Swami Vivekanand (S.V.) Road, Jogeshwari West 400102 — the venue is on the 1st floor of the same building (E.E. Heights). Google place 'Dilshad Banquet Hall' from the family's link; pin compared visually, not numerically (Google blocks automated lookups). Checked 2026-11-20.",
    },
    landmark: null,
  },

  contact: {
    label: "For any queries",
    phone: "+91 8433783337",
    whatsapp: true,
  },

  hashtag: null,

  opening: {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the most Gracious, the most Merciful.",
  },

  // Surah Ar-Rum 30:21 — Arabic and Sahih International translation as published by
  // api.alquran.cloud (editions "quran-simple" and "en.sahih"), checked 2026-11-20.
  verse: {
    text: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ",
    translation:
      "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.",
    translationSource: "Sahih International",
    reference: "Surah Ar-Rum 30:21",
  },

  // Outlined star on the calendar. Add a label (e.g. what happens that day) for screen readers.
  calendarMarks: [{ date: "2026-12-17", label: null }],

  story: [],

  rsvp: {
    enabled: false,
    maxPartySize: null,
    dietaryOptions: [],
    deadline: null,
  },

  closing: {
    eyebrow: "A Celebration to Remember",
    message:
      "Your presence would make our celebration even more special. We look forward to welcoming you.",
    blessing: null,
    signOff: "With love and gratitude,",
    signature: "Mirza Family",
  },

  // Played only when a guest presses play, through YouTube's own (visible) embedded player.
  music: {
    kind: "youtube",
    videoId: "0_W7fMSBeJg",
    title: "Narnia Lullaby",
    volume: 0.45,
  },

  developerCredit: "Sadaf Mirza",

  site: {
    url: null,
    indexing: false,
    title: "Tahir & Nazneen · Dawat e Walima · The Royal Sands",
    description:
      "You are invited to the Dawat e Walima of Tahir Zaheer Mirza and Nazneen Rais Shaikh — Saturday, 19 December 2026, 7 PM onwards at The Grand FM Banquet, Jogeshwari West, Mumbai.",
  },

  copy: {
    opening: {
      blessingLead: "With the blessings of our families,",
      request: "We request the pleasure of your company at the",
      connector: "of",
      and: "and",
      enter: "Enter the Kingdom",
      skip: "Skip",
      openHint: "Tap the royal seal to open your invitation",
      openLabel: "Break the royal seal and open the invitation",
      sealHint: "The royal seal",
      sealSecret: "Sealed beneath the stars",
    },
    hero: {
      eyebrow: "A Celebration Written in the Stars",
      subtitle: "An evening of love, family and celebration.",
      location: "Mumbai, India",
      cta: "Discover the Celebration",
      scrollCue: "Scroll to begin your journey.",
    },
    story: { eyebrow: "Our Story", title: "The Ancient Chronicles" },
    journey: {
      eyebrow: "The Journey",
      title: "Through the Sands of Time",
      captions: [
        "Beyond the last dune, the old road begins to glow.",
        "Ancient gates rise from the sand to mark the way.",
        "Here the sands of time flow against the wind.",
        "And at the end of the path, the palace awaits.",
      ],
      ticketHeading: "The Royal Celebration",
    },
    details: {
      eyebrow: "Event Details",
      title: "The Royal Decree",
      blessing: "With the blessings of our families, we request the pleasure of your company.",
      and: "and",
      labels: { date: "Date", time: "Time", venue: "Venue", contact: "Contact" },
      actions: {
        maps: "View on Google Maps",
        googleCalendar: "Add to Google Calendar",
        call: "Call the Family",
        whatsapp: "WhatsApp the Family",
      },
    },
    countdown: {
      eyebrow: "Countdown",
      title: "The Hourglass of Destiny",
      units: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
      complete: "The moment has arrived",
      completeSub: "The palace doors are open and the lanterns are lit. Welcome to the celebration.",
      hourglassHint: "Turn the hourglass",
    },
    calendar: {
      eyebrow: "Save the Date",
      title: "The Royal Calendar",
      selectHint: "Select the celebration date",
    },
    map: {
      eyebrow: "Location",
      title: "The Palace",
      reveal: "Reveal the Kingdom",
      gateHint: "Behind these doors lies the way to the celebration.",
      google: "Google Maps",
      directions: "Get Directions",
      explore: "Explore Location",
      tapToExplore: "Tap to explore the map",
      unverified:
        "Precise map coordinates for the venue have not been verified yet, so no pin is shown. Use the address search links below — they open the exact address in Google Maps and OpenStreetMap.",
    },
    rsvp: { eyebrow: "RSVP", title: "Kindly Reply" },
    closing: { back: "Back to the Beginning", replay: "Open the Royal Invitation Again" },
    secrets: {
      hourglassLabel: "A tiny golden hourglass",
      hourglassMessage: "The sands of time swirl around you.",
      passageLabel: "A curious carved rosette",
      passageTitle: "The Hidden Passage",
      passageText:
        "A sliver of ancient golden light spills from a passage few travellers ever find. Keep its secret — the celebration awaits within the palace.",
      reverseMessage: "For a moment, the sands flow backwards.",
    },
    nav: {
      home: "Home",
      story: "Our Story",
      journey: "Journey",
      details: "Details",
      countdown: "Countdown",
      calendar: "Calendar",
      location: "Location",
      rsvp: "RSVP",
    },
    footer: { creditPrefix: "Developed by" },
  },
};

