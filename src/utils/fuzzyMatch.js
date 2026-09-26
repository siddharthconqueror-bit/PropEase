// Bulletproof fuzzy similarity and multi-technique typo matcher
export const calculateSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;

  // Levenshtein distance
  const an = s1.length;
  const bn = s2.length;
  if (an === 0 || bn === 0) return 0;

  const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));
  for (let i = 0; i <= bn; ++i) matrix[i][0] = i;
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLen = Math.max(an, bn);
  return 1 - (matrix[bn][an] / maxLen);
};

// Complete master dictionary with all aliases, phonetic misspellings, short codes, and typos
export const MASTER_TN_DESTINATIONS = [
  {
    district: "Coimbatore",
    aliases: [
      "coimbatore", "cbe", "kovai", "coimbator", "coimbatur", "coimbathur", "coimbathoor", "combator", "coimbat", 
      "saravanampatti", "saravanampaty", "saravanampatty", "saravanam", "race course", "racecourse", "racecours", "racecors",
      "rs puram", "rspuram", "r.s. puram", "peelamedu", "pelamedu", "pilamedu", "vadavalli", "gandhipuram",
      "kovaipudur", "thudiyalur", "singanallur", "kalapatti", "avinashi road", "chil sez"
    ]
  },
  {
    district: "Madurai",
    aliases: [
      "madurai", "madrai", "madura", "madhura", "madhurai", "maduri", "mdurai", "mdu",
      "mattuthavani", "matuthavani", "mattuthavni", "kk nagar", "kknagar", "anna nagar madurai",
      "simmakkal", "simakkal", "othakadai", "tvs nagar", "pasumalai", "villapuram", "kochadai", "uthangudi", "aiims madurai"
    ]
  },
  {
    district: "Tiruchirappalli (Trichy)",
    aliases: [
      "trichy", "tiruchirappalli", "tiruchirapalli", "thiruchirapalli", "thiruchi", "trichi", "tiruchi", "tiruchy", "tpj",
      "thillai nagar", "thillainagar", "thillai", "cantonment", "srirangam", "shrirangam", "srirangm",
      "vayalur", "kattur", "karumandapam", "samayapuram", "lalgudi", "crawford", "bhel trichy"
    ]
  },
  {
    district: "Salem",
    aliases: [
      "salem", "selam", "salm", "saalem", "slm",
      "fairlands", "fair lands", "farelands", "alagapuram", "hasthampatti", "hastampatti",
      "yercaud", "yerkadu", "yercad", "suramangalam", "shevapet", "kannankurichi", "mookaneri", "ammapet"
    ]
  },
  {
    district: "Tirunelveli",
    aliases: [
      "tirunelveli", "nellai", "thirunelveli", "tirunelvli", "tirunelvely", "nelai", "nellai city",
      "palayamkottai", "palayamkotai", "palayankottai", "vannarpettai", "vannarpet", "perumalpuram",
      "thamirabarani", "tamirabarani", "maharaja nagar", "ktc nagar", "reddiarpatti"
    ]
  },
  {
    district: "Erode",
    aliases: [
      "erode", "erod", "erodu", "eroda", "ed",
      "perundurai", "perunthurai", "perundurai road", "thindal", "thindal temple",
      "sathy road", "brough road", "kollampalayam", "solar erode", "veerappanchatram", "bhavani", "chithode"
    ]
  },
  {
    district: "Tiruppur",
    aliases: [
      "tiruppur", "tirupur", "thiruppur", "tirpur", "tpr",
      "palladam", "palladam road", "kangeyam", "kangeyam road", "uthukuli", "dharapuram",
      "veerapandi", "perumanallur", "nallur", "rakkiapalayam", "kumaran road"
    ]
  },
  {
    district: "Vellore",
    aliases: [
      "vellore", "vellor", "velor", "veloor", "vlr",
      "katpadi", "kaatpadi", "katpadi junction", "vit", "vit university", "vit vellore",
      "gandhi nagar vellore", "sathuvachari", "bagayam", "cmc vellore", "vellore fort", "ranipet", "arcot"
    ]
  },
  {
    district: "Thanjavur",
    aliases: [
      "thanjavur", "tanjore", "thanjavoor", "tanjavur", "thanjai", "tj",
      "medical college thanjavur", "brihadeeswarar", "big temple", "periya kovil",
      "sastra", "sastra university", "vallam", "papanasam", "kumbakonam", "vennar"
    ]
  },
  {
    district: "Kanchipuram",
    aliases: [
      "kanchipuram", "kanchi", "kancheepuram", "kanchipura", "conjeevaram",
      "silk city", "sriperumbudur", "parandur", "parandur airport", "orikkai",
      "sunguvarchatram", "walajabad", "enathur", "sevilimedu"
    ]
  },
  {
    district: "Dindigul",
    aliases: [
      "dindigul", "dindugul", "dindigal", "dindigul city", "dg",
      "palani", "palani road", "kodaikanal", "kodai", "kodaikanal foothills",
      "sirumalai", "batlagundu", "vedasandur", "gtn college"
    ]
  },
  {
    district: "Cuddalore",
    aliases: [
      "cuddalore", "kadalur", "cuddalor", "koodalur", "cud",
      "silver beach", "chidambaram", "neyveli", "nlc", "pichavaram", "vadalur", "panruti", "manjakuppam"
    ]
  },
  {
    district: "Thoothukudi",
    aliases: [
      "thoothukudi", "tuticorin", "thuthukudi", "tutikorn", "thoothukudi city", "tut",
      "pearl city", "tiruchendur", "thiruchendur", "spic nagar", "voc port", "kulasekharapatnam", "isro spaceport", "kovilpatti"
    ]
  },
  {
    district: "Chennai",
    aliases: [
      "chennai", "madras", "chenai", "chnnai", "chenna", "chn", "maa",
      "omr", "sholinganallur", "solinganallur", "ecr", "injambakkam", "anna nagar",
      "adyar", "velachery", "porur", "guindy", "medavakkam", "tambaram", "perungudi", "kelambakkam", "vandalur"
    ]
  }
];

export const MASTER_CATEGORIES = [
  { standard: "Apartment", aliases: ["apartment", "appartment", "aprtment", "apartmnt", "flat", "flats", "apts", "apt", "flatts"] },
  { standard: "Villa", aliases: ["villa", "villas", "vila", "vilas", "bungalow", "bunglow", "independent house", "individual house", "house", "villa house"] },
  { standard: "Plot", aliases: ["plot", "plots", "plt", "plts", "land", "lands", "dtcp", "dtcp plot", "site", "sites", "ground", "acres"] },
  { standard: "Renthouse", aliases: ["renthouse", "renthouses", "rent", "rental", "rent house", "house for rent", "renting", "lease"] },
  { standard: "Penthouse", aliases: ["penthouse", "penthous", "pent house", "sky villa", "duplex penthouse", "duplex"] },
  { standard: "Commercial", aliases: ["commercial", "commercl", "office", "offices", "shop", "shops", "commercial space", "workspace", "showroom"] }
];

export const MASTER_NAMES = [
  { standard: "Senthil Kumar", aliases: ["senthil", "senthl", "senthil kumar", "senthel"] },
  { standard: "Kavitha Raman", aliases: ["kavitha", "kavita", "kavitha raman"] },
  { standard: "Murugan Selvam", aliases: ["murugan", "murugn", "murugan selvam"] },
  { standard: "Praveen Sundaram", aliases: ["praveen", "pravin", "praveen sundaram"] },
  { standard: "Dinesh Natarajan", aliases: ["dinesh", "dnesh", "dinesh natarajan"] }
];

// Deep Intent & Entity Extractor with Typo Tolerance
export const identifyEntitiesFromQuery = (queryText) => {
  if (!queryText || typeof queryText !== 'string') {
    return { detectedDistrict: null, detectedCategory: null, detectedName: null, detectedBhk: null, corrections: [] };
  }

  const cleanInput = queryText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = cleanInput.split(/\s+/).filter(t => t.length > 0);
  const corrections = [];

  let detectedDistrict = null;
  let detectedCategory = null;
  let detectedName = null;
  let detectedBhk = null;

  // 1. Check BHK
  const bhkMatch = cleanInput.match(/([1-5])\s*(bhk|bed|bedroom)/) || cleanInput.match(/([1-5])bhk/);
  if (bhkMatch) {
    detectedBhk = parseInt(bhkMatch[1], 10);
  }

  // 2. Scan entire query against all District aliases with Multi-word, substring & Levenshtein matching
  let highestDistrictScore = 0;
  for (const item of MASTER_TN_DESTINATIONS) {
    for (const alias of item.aliases) {
      // Direct whole-word or substring match
      if (cleanInput.includes(alias)) {
        detectedDistrict = item.district;
        highestDistrictScore = 1.0;
        if (alias !== item.district.toLowerCase()) {
          corrections.push({ original: alias, identifiedAs: item.district, type: "District / Location" });
        }
        break;
      }

      // Token fuzzy check (handles "coimbator", "madrai", "trichi", "salm", "nelai", "tutikorn", etc.)
      for (const token of tokens) {
        if (token.length >= 3) {
          const sim = calculateSimilarity(token, alias);
          if (sim >= 0.72 && sim > highestDistrictScore) {
            highestDistrictScore = sim;
            detectedDistrict = item.district;
            corrections.push({ original: token, identifiedAs: item.district, type: "District" });
          }
        }
      }
    }
    if (highestDistrictScore === 1.0) break;
  }

  // 3. Scan for Category with Typo tolerance (handles "appartment", "aprtment", "vla", "plts", "commercl", etc.)
  let highestCatScore = 0;
  for (const cat of MASTER_CATEGORIES) {
    for (const alias of cat.aliases) {
      if (cleanInput.includes(alias)) {
        detectedCategory = cat.standard;
        highestCatScore = 1.0;
        break;
      }
      for (const token of tokens) {
        if (token.length >= 3) {
          const sim = calculateSimilarity(token, alias);
          if (sim >= 0.75 && sim > highestCatScore) {
            highestCatScore = sim;
            detectedCategory = cat.standard;
            corrections.push({ original: token, identifiedAs: cat.standard, type: "Category" });
          }
        }
      }
    }
    if (highestCatScore === 1.0) break;
  }

  // 4. Scan for Names
  for (const person of MASTER_NAMES) {
    for (const alias of person.aliases) {
      if (cleanInput.includes(alias)) {
        detectedName = person.standard;
        break;
      }
      for (const token of tokens) {
        if (token.length >= 3 && calculateSimilarity(token, alias) >= 0.8) {
          detectedName = person.standard;
          corrections.push({ original: token, identifiedAs: person.standard, type: "Agent / Person" });
          break;
        }
      }
    }
    if (detectedName) break;
  }

  return {
    detectedDistrict,
    detectedCategory,
    detectedName,
    detectedBhk,
    corrections
  };
};
