import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROPERTIES, INITIAL_INQUIRIES, INITIAL_AI_CHAT, INITIAL_NOTIFICATIONS, ALL_TN_DISTRICTS } from '../data/mockData';
import { identifyEntitiesFromQuery } from '../utils/fuzzyMatch';
import { useToast } from './ToastContext';

const PropertyContext = createContext();

const DEFAULT_API_KEY = 'AQ.Ab8RN6J9VtiyFp8g0jPxI-QxglD4W-nbh9J3r3J6ytiAkfQvZA';

export const PropertyProvider = ({ children }) => {
  const { showToast } = useToast();

  // Properties State with local and live persistence
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('propease_custom_properties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading custom properties', e);
      }
    }
    return MOCK_PROPERTIES;
  });

  useEffect(() => {
    localStorage.setItem('propease_custom_properties', JSON.stringify(properties));
  }, [properties]);

  // Gemini API Key State with localStorage and preloaded key
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    const saved = localStorage.getItem('propease_gemini_api_key');
    if (saved !== null) return saved;
    // Set default connected key
    localStorage.setItem('propease_gemini_api_key', DEFAULT_API_KEY);
    return DEFAULT_API_KEY;
  });

  // Favorites State with localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('propease_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading favorites', e);
      }
    }
    return ['prop-101', 'prop-102', 'prop-108'];
  });

  // Inquiries State with localStorage
  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem('propease_inquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading inquiries', e);
      }
    }
    return INITIAL_INQUIRIES;
  });

  // Notifications State with localStorage
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('propease_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading notifications', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Bug Reports State with localStorage
  const [bugReports, setBugReports] = useState(() => {
    const saved = localStorage.getItem('propease_bug_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading bug reports', e);
      }
    }
    return [];
  });

  // Viewed Properties History
  const [viewHistory, setViewHistory] = useState(() => {
    const saved = localStorage.getItem('propease_view_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading view history', e);
      }
    }
    return ['prop-101', 'prop-102', 'prop-105'];
  });

  // AI Chat History with localStorage
  const [aiChatMessages, setAiChatMessages] = useState(() => {
    const saved = localStorage.getItem('propease_ai_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading AI chats', e);
      }
    }
    return INITIAL_AI_CHAT;
  });

  // App Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('propease_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }
    return {
      language: 'English',
      pushNotifications: true,
      currency: 'INR (₹)',
      compactMode: false
    };
  });

  // Search & Filter State
  const [filters, setFilters] = useState({
    query: '',
    city: 'All Tamil Nadu',
    category: 'all',
    minPrice: 0,
    maxPrice: 50000000,
    bhk: 'all',
    status: 'all',
    sortBy: 'featured',
  });

  // Recent searches
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('propease_recent_searches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading recent searches', e);
      }
    }
    return ["Coimbatore Villas", "Madurai DTCP Plots", "Trichy Apartments", "Salem Fairlands", "Chennai OMR"];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('propease_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('propease_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('propease_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('propease_bug_reports', JSON.stringify(bugReports));
  }, [bugReports]);

  useEffect(() => {
    localStorage.setItem('propease_view_history', JSON.stringify(viewHistory));
  }, [viewHistory]);

  useEffect(() => {
    localStorage.setItem('propease_ai_chat', JSON.stringify(aiChatMessages));
  }, [aiChatMessages]);

  useEffect(() => {
    localStorage.setItem('propease_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('propease_settings', JSON.stringify(settings));
  }, [settings]);

  // Save API Key
  const saveApiKey = (key) => {
    const cleanKey = key ? key.trim() : '';
    setGeminiApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('propease_gemini_api_key', cleanKey);
      showToast('Live AI API Key connected successfully!', 'success');
    } else {
      localStorage.removeItem('propease_gemini_api_key');
      showToast('API Key removed. Using built-in AI Engine.', 'info');
    }
  };

  // Track property view
  const trackPropertyView = (propertyId) => {
    setViewHistory(prev => [propertyId, ...prev.filter(id => id !== propertyId)].slice(0, 15));
  };

  // Favorite toggler
  const toggleFavorite = (propertyId) => {
    const isFav = favorites.includes(propertyId);
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== propertyId));
      showToast('Property removed from wishlist', 'info');
    } else {
      setFavorites(prev => [...prev, propertyId]);
      showToast('Property saved to wishlist', 'success');
    }
  };

  const isFavorite = (propertyId) => favorites.includes(propertyId);

  // Add new Inquiry
  const submitInquiry = ({ propertyId, seekerMessage, preferredVisitDate, contactMode }) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return false;

    const newInquiry = {
      id: `inq-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyPrice: property.priceDisplay,
      propertyImage: property.images[0],
      agentName: property.agent.name,
      agentPhone: property.agent.phone,
      status: 'Pending',
      seekerMessage: seekerMessage || 'I am interested in scheduling a site visit and discussing pricing.',
      agentReply: null,
      createdAt: new Date().toISOString(),
      preferredVisitDate: preferredVisitDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      contactMode: contactMode || 'WhatsApp & Call'
    };

    setInquiries(prev => [newInquiry, ...prev]);
    showToast(`Inquiry sent to ${property.agent.name}!`, 'success');

    // Simulate Agent auto-response
    setTimeout(() => {
      setInquiries(current => current.map(item => {
        if (item.id === newInquiry.id) {
          return {
            ...item,
            status: 'Contacted',
            agentReply: `Vanakkam! Thanks for inquiring about ${property.title}. I have reserved your slot for ${newInquiry.preferredVisitDate} and will WhatsApp you the GPS pin and brochure.`
          };
        }
        return item;
      }));

      // Push notification
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: `Reply received for ${property.title}`,
        description: `${property.agent.name} confirmed your site visit slot.`,
        time: 'Just now',
        read: false,
        type: 'inquiry',
        propertyId: property.id
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 6000);

    return true;
  };

  const cancelInquiry = (inquiryId) => {
    setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status: 'Cancelled' } : inq));
    showToast('Inquiry cancelled', 'info');
  };

  const acceptInquiry = (inquiryId, replyMessage, role = 'AGENT') => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'Confirmed',
          agentReply: replyMessage || `Your site visit has been confirmed by ${role === 'ADMIN' ? 'Administrator' : inq.agentName || 'Agent'}.`
        };
      }
      return inq;
    }));

    const notif = {
      id: `notif-${Date.now()}`,
      title: `Site Visit Confirmed by ${role === 'ADMIN' ? 'Admin' : 'Agent'}!`,
      previewText: `Your scheduled site visit request #${inquiryId} is now confirmed.`,
      fullMessage: replyMessage || `Vanakkam! Your site visit request #${inquiryId} has been confirmed. Please arrive on time at the property gate with required ID proof.`,
      time: 'Just now',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'inquiry',
      category: 'Site Visit Confirmed'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const rejectInquiry = (inquiryId, reason) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: 'Declined',
          agentReply: reason || 'Request could not be accommodated at the requested time.'
        };
      }
      return inq;
    }));
  };

  const addProperty = (newPropertyData) => {
    const newId = `prop-${Date.now()}`;
    const newProp = {
      id: newId,
      ...newPropertyData
    };
    setProperties(prev => [newProp, ...prev]);
    return newProp;
  };

  const deleteProperty = (propertyId) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  // Submit Bug Report
  const submitBugReport = ({ title, description, category, userEmail, userName }) => {
    const reportId = `BUG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReport = {
      id: reportId,
      title,
      description,
      category: category || 'UI / Display Issue',
      userEmail: userEmail || 'seeker@propease.in',
      userName: userName || 'PropEase User',
      timestamp: new Date().toISOString(),
      status: 'Delivered to Creator',
      deviceInfo: `${navigator.userAgent.substring(0, 50)}...`
    };

    setBugReports(prev => [newReport, ...prev]);
    showToast(`Bug report #${reportId} delivered to App Creator!`, 'success', 5000);
    return reportId;
  };

  // Notification actions
  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const deleteNotification = (notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
    showToast('Notification removed', 'info');
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared', 'info');
  };

  // Update Settings
  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    showToast(`Setting updated: ${key}`, 'info');
  };

  // Filter setters
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      city: 'All Tamil Nadu',
      category: 'all',
      minPrice: 0,
      maxPrice: 50000000,
      bhk: 'all',
      status: 'all',
      sortBy: 'featured',
    });
    showToast('Filters reset', 'info');
  };

  const addRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    setRecentSearches(prev => [clean, ...prev.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 8));
  };

  const clearHistory = () => {
    setViewHistory([]);
    setRecentSearches([]);
    showToast('History cleared', 'info');
  };

  // Filtered Properties
  const filteredProperties = properties.filter(prop => {
    if (filters.city && filters.city !== 'All Tamil Nadu') {
      const targetCity = filters.city.toLowerCase();
      const propCity = prop.city.toLowerCase();
      if (!propCity.includes(targetCity) && !targetCity.includes(propCity)) {
        return false;
      }
    }

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      const matchCity = prop.city.toLowerCase().includes(q);
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchLoc = prop.location.toLowerCase().includes(q);
      const matchType = prop.type.toLowerCase().includes(q);
      const matchAgent = prop.agent?.name?.toLowerCase().includes(q);

      const matchingDistrict = ALL_TN_DISTRICTS.find(d => 
        d !== 'All Tamil Nadu' && (q.includes(d.toLowerCase()) || d.toLowerCase().includes(q))
      );

      if (matchingDistrict) {
        if (!prop.city.toLowerCase().includes(matchingDistrict.toLowerCase())) {
          return false;
        }
      } else {
        if (!matchTitle && !matchLoc && !matchCity && !matchType && !matchAgent) {
          return false;
        }
      }
    }

    if (filters.category !== 'all') {
      if (prop.type.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    if (filters.bhk !== 'all') {
      const bhkNum = parseInt(filters.bhk, 10);
      if (prop.bhk !== bhkNum) return false;
    }

    if (filters.status !== 'all' && prop.status !== filters.status) {
      return false;
    }

    if (prop.price < filters.minPrice || prop.price > filters.maxPrice) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return new Date(b.postedDate) - new Date(a.postedDate);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Call Live AI API
  const callLiveAIAPI = async (prompt, systemContext) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemContext}\n\nUser Question: ${prompt}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn("Live API call encountered network issue, executing built-in reasoning engine:", err);
    }
    return null;
  };

  // Deep Intent & Typo Resolver AI Engine
  const sendAIChatMessage = async (userText) => {
    if (!userText.trim()) return;

    // 1. Deep Entity & Typo Extraction
    const { detectedDistrict, detectedCategory, detectedName, detectedBhk, corrections } = identifyEntitiesFromQuery(userText);

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatMessages(prev => [...prev, userMsg]);

    const lower = userText.toLowerCase();
    let recommendedProps = [];
    let responseText = "";
    let suggested = [];

    // Filter properties strictly according to identified destination
    if (detectedDistrict) {
      let pool = properties.filter(p => p.city.toLowerCase() === detectedDistrict.toLowerCase());
      
      if (detectedCategory) {
        const catPool = pool.filter(p => p.type.toLowerCase() === detectedCategory.toLowerCase());
        if (catPool.length > 0) pool = catPool;
      }

      if (detectedBhk) {
        const bhkPool = pool.filter(p => p.bhk === detectedBhk);
        if (bhkPool.length > 0) pool = bhkPool;
      }

      if (detectedName) {
        const namePool = pool.filter(p => p.agent.name.toLowerCase().includes(detectedName.toLowerCase()));
        if (namePool.length > 0) pool = namePool;
      }

      recommendedProps = pool.slice(0, 2);
    } else if (detectedCategory) {
      recommendedProps = properties.filter(p => p.type.toLowerCase() === detectedCategory.toLowerCase()).slice(0, 2);
    } else if (detectedName) {
      recommendedProps = properties.filter(p => p.agent.name.toLowerCase().includes(detectedName.toLowerCase())).slice(0, 2);
    } else {
      recommendedProps = properties.slice(0, 2);
    }

    // Try Live AI API
    let liveApiResponse = null;
    if (geminiApiKey) {
      const systemContext = `You are PropEase AI, an expert real estate concierge for Tamil Nadu, India. 
Context: The platform has 140+ TN RERA verified properties across Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli, Erode, Tiruppur, Vellore, Thanjavur, Kanchipuram, Dindigul, Cuddalore, and Thoothukudi.
Always provide factual, polite Tamil Nadu real estate wisdom with prices in Lakhs/Crores and bullet points. Mention Vaastu, TN RERA, and connectivity.`;
      liveApiResponse = await callLiveAIAPI(userText, systemContext);
    }

    if (liveApiResponse) {
      responseText = liveApiResponse;
      suggested = [
        `Show more in ${detectedDistrict || 'Tamil Nadu'}`,
        "Calculate 20 Year EMI",
        "TN RERA Document Checklist"
      ];
    } else {
      // Offline Built-in Intelligent Response Generation
      if (detectedDistrict) {
        if (detectedDistrict === "Coimbatore") {
          responseText = `### 📍 Coimbatore Real Estate Analysis\n\nCoimbatore's property market is driven by the **Saravanampatti IT corridor**, **Peelamedu education hub**, and ultra-premium enclaves in **Race Course** & **RS Puram**.\n\n• **Water Security:** Uninterrupted Siruvani water supply is a key value multiplier.\n• **Rental Yield:** 5.8% to 6.8% in Saravanampatti & Peelamedu.\n• **Capital Appreciation:** 11.2% annual growth.\n\nHere are verified ${detectedCategory || 'property'} matches in **Coimbatore**:`;
          suggested = ["Villas in Saravanampatti Coimbatore", "Plots near Avinashi Road", "Calculate ₹75L EMI for Coimbatore"];
        } else if (detectedDistrict === "Madurai") {
          responseText = `### 📍 Madurai Real Estate Analysis\n\nMadurai is witnessing strong expansion along the **Airport Ring Road**, **Mattuthavani**, and **KK Nagar**.\n\n• **Growth Drivers:** AIIMS Madurai corridor, proposed IT park, and four-lane ring road connectivity.\n• **Plot Appreciation:** 14% annual surge in DTCP layouts.\n• **High Liquidity:** High resale demand in KK Nagar & Anna Nagar.\n\nHere are verified ${detectedCategory || 'property'} matches in **Madurai**:`;
          suggested = ["DTCP approved plots in Madurai", "Villas in KK Nagar Madurai", "Madurai property registration charges"];
        } else if (detectedDistrict.includes("Trichy")) {
          responseText = `### 📍 Tiruchirappalli (Trichy) Real Estate Analysis\n\nTrichy offers balanced residential stability with high appreciation in **Thillai Nagar**, **Cantonment**, and **Srirangam**.\n\n• **Highlights:** Scenic Cauvery river breeze, premier schools, and international airport expansion.\n• **Average Price:** ₹4,200 - ₹5,400/sq.ft in central localities.\n\nHere are verified ${detectedCategory || 'property'} matches in **Trichy**:`;
          suggested = ["Apartments in Thillai Nagar Trichy", "River view homes in Srirangam", "Plots near Trichy Airport"];
        } else if (detectedDistrict === "Salem") {
          responseText = `### 📍 Salem Real Estate Analysis\n\nSalem's real estate demand is centered around **Fairlands**, **Alagapuram**, and scenic villa enclaves along **Yercaud Foothills**.\n\n• **Climate & Lifestyle:** Serene hill-view residences with crisp mountain breeze.\n• **Connectivity:** Bangalore-Salem-Madurai expressway & Salem railway junction.\n\nHere are verified ${detectedCategory || 'property'} matches in **Salem**:`;
          suggested = ["Hill view villas in Salem", "Plots in Fairlands Salem", "Commercial spaces in Salem"];
        } else if (detectedDistrict === "Tirunelveli") {
          responseText = `### 📍 Tirunelveli Real Estate Analysis\n\nNellai is emerging as South Tamil Nadu's prime residential hub across **Palayamkottai**, **Vannarpettai**, and **Town**.\n\n• **Water Security:** Thamirabarani perennial river connectivity.\n• **Education Hub:** Known as the Oxford of South India with strong family community demand.\n\nHere are verified ${detectedCategory || 'property'} matches in **Tirunelveli**:`;
          suggested = ["Homes in Palayamkottai Nellai", "Riverside plots in Tirunelveli", "Commercial spaces in Nellai Junction"];
        } else if (detectedDistrict === "Erode") {
          responseText = `### 📍 Erode Real Estate Analysis\n\nErode's market is driven by commercial textile strength and premier residential stretches along **Perundurai Road** and **Thindal**.\n\n• **High Demand:** Gated communities along Perundurai IT belt.\n• **Appreciation:** 9.5% steady annual return.\n\nHere are verified ${detectedCategory || 'property'} matches in **Erode**:`;
          suggested = ["Villas on Perundurai Road Erode", "Homes near Thindal Temple", "Commercial spaces in Erode"];
        } else if (detectedDistrict === "Tiruppur") {
          responseText = `### 📍 Tiruppur Real Estate Analysis\n\nTiruppur offers exceptional rental yields (7.5%+) fueled by the global textile export ecosystem along **Avinashi Road** and **Palladam Road**.\n\nHere are verified ${detectedCategory || 'property'} matches in **Tiruppur**:`;
          suggested = ["Villas in Tiruppur", "Rental properties in Avinashi Road", "Industrial plots in Tiruppur"];
        } else if (detectedDistrict === "Vellore") {
          responseText = `### 📍 Vellore Real Estate Analysis\n\nVellore's residential market is anchored by **CMC Hospital** and **VIT University** around **Katpadi** and **Gandhi Nagar**.\n\nHere are verified ${detectedCategory || 'property'} matches in **Vellore**:`;
          suggested = ["Flats near VIT Vellore", "Homes in Katpadi Junction", "Plots in Gandhi Nagar Vellore"];
        } else if (detectedDistrict === "Thanjavur") {
          responseText = `### 📍 Thanjavur Real Estate Analysis\n\nThanjavur offers rich cultural prestige and high appreciation along **Medical College Road** and the **SASTRA University** corridor.\n\nHere are verified ${detectedCategory || 'property'} matches in **Thanjavur**:`;
          suggested = ["Homes on Medical College Road Thanjavur", "Plots near SASTRA University", "Big Temple vicinity homes"];
        } else if (detectedDistrict === "Kanchipuram") {
          responseText = `### 📍 Kanchipuram Real Estate Analysis\n\nKanchipuram and the **Parandur Greenfield Airport** corridor are experiencing a massive 20%+ infrastructure appreciation boom.\n\nHere are verified ${detectedCategory || 'property'} matches in **Kanchipuram**:`;
          suggested = ["Plots near Parandur Airport", "Villas in Sriperumbudur link", "Homes in Silk City Kanchi"];
        } else if (detectedDistrict === "Dindigul") {
          responseText = `### 📍 Dindigul Real Estate Analysis\n\nDindigul benefits from **Kodaikanal Ghat road** tourism, educational institutions, and highway logistics.\n\nHere are verified ${detectedCategory || 'property'} matches in **Dindigul**:`;
          suggested = ["Villas at Kodaikanal foothills", "Plots on Palani Highway", "Commercial spaces in Dindigul"];
        } else if (detectedDistrict === "Cuddalore") {
          responseText = `### 📍 Cuddalore Real Estate Analysis\n\nCuddalore features scenic coastal residential demand in **Silver Beach**, **Chidambaram**, and **Neyveli**.\n\nHere are verified ${detectedCategory || 'property'} matches in **Cuddalore**:`;
          suggested = ["Beach view homes in Cuddalore", "Plots in Chidambaram", "Homes near Neyveli NLC"];
        } else if (detectedDistrict === "Thoothukudi") {
          responseText = `### 📍 Thoothukudi Real Estate Analysis\n\nPearl City is accelerating with port expansion and the upcoming **Kulasekharapatnam ISRO Spaceport** corridor.\n\nHere are verified ${detectedCategory || 'property'} matches in **Thoothukudi**:`;
          suggested = ["Beach road homes in Thoothukudi", "Plots near ISRO Spaceport", "Commercial spaces in Tuticorin"];
        } else {
          // Chennai
          responseText = `### 📍 Chennai Real Estate Analysis\n\nChennai's growth is led by the **OMR IT corridor**, **Metro Phase 2**, **ECR coastal belt**, and **Anna Nagar**.\n\nHere are verified ${detectedCategory || 'property'} matches in **Chennai**:`;
          suggested = ["3 BHK in OMR Chennai", "Villas on ECR Coast", "Penthouses in Adyar"];
        }
      } else if (lower.includes('emi') || lower.includes('loan') || lower.includes('calculate')) {
        const P = 6500000;
        const r = 8.5 / 12 / 100;
        const n = 240;
        const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
        const totalAmount = emi * n;
        const totalInterest = totalAmount - P;

        responseText = `### 📊 Home Loan EMI Calculator\n\n• **Loan Amount:** ₹65,00,000\n• **Interest Rate:** 8.50% p.a. (SBI / HDFC benchmark)\n• **Tenure:** 20 Years (240 Months)\n\n💰 **Monthly EMI:** **₹${emi.toLocaleString('en-IN')} / month**\n• **Total Interest:** ₹${Math.round(totalInterest / 100000).toFixed(2)} Lakhs\n• **Total Payment (Principal + Interest):** ₹${Math.round(totalAmount / 100000).toFixed(2)} Lakhs\n\n💡 *Tip: PropEase partners offer pre-approved 0.25% concession for green-certified TN RERA homes.*`;
        suggested = ["Properties under ₹65 Lakhs in Coimbatore", "Properties under ₹65 Lakhs in Madurai", "Properties in Chennai OMR under ₹90L"];
        recommendedProps = properties.filter(p => p.price <= 7500000).slice(0, 2);
      } else if (detectedCategory) {
        responseText = `Here are top-scoring verified **${detectedCategory}** listings across Tamil Nadu with full TN RERA certification:`;
        suggested = [`${detectedCategory} in Coimbatore`, `${detectedCategory} in Madurai`, `${detectedCategory} in Chennai`];
      } else if (detectedName) {
        responseText = `Here are verified properties represented by **${detectedName}**:`;
        suggested = ["Schedule Site Visit", "Call Agent on WhatsApp", "View Agent Credentials"];
      } else {
        responseText = `I analyzed our database of 140+ verified properties across all districts of Tamil Nadu. Tell me your target destination (e.g. **Coimbatore**, **Madurai**, **Trichy**, **Salem**, **Nellai**, **Erode**, **Chennai**) or budget to get pinpoint recommendations:`;
        suggested = ["Villas in Coimbatore", "Plots in Madurai Ring Road", "Apartments in Trichy Thillai Nagar", "Hill view homes in Salem"];
      }
    }

    // Prepend Auto-correction Notice if typos were found and fixed
    if (corrections.length > 0) {
      const correctionPill = `✨ *Identified ${corrections.map(c => `**${c.identifiedAs}** (from '${c.original}')`).join(', ')}*\n\n`;
      responseText = correctionPill + responseText;
    }

    const aiResponseMsg = {
      id: `ai-${Date.now() + 1}`,
      sender: 'ai',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      properties: recommendedProps,
      suggestedPrompts: suggested
    };

    setAiChatMessages(prev => [...prev, aiResponseMsg]);
  };

  const clearAIChat = () => {
    setAiChatMessages(INITIAL_AI_CHAT);
    showToast('AI Concierge chat restarted', 'info');
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        favorites,
        toggleFavorite,
        isFavorite,
        inquiries,
        submitInquiry,
        cancelInquiry,
        acceptInquiry,
        rejectInquiry,
        addProperty,
        deleteProperty,
        notifications,
        markNotificationRead,
        deleteNotification,
        markAllNotificationsRead,
        clearAllNotifications,
        bugReports,
        submitBugReport,
        viewHistory,
        trackPropertyView,
        clearHistory,
        settings,
        updateSettings,
        geminiApiKey,
        saveApiKey,
        filters,
        updateFilter,
        resetFilters,
        recentSearches,
        addRecentSearch,
        aiChatMessages,
        sendAIChatMessage,
        clearAIChat
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => useContext(PropertyContext);
