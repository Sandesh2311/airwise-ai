// Static, reviewed guidance only. Current readings are handled by the live-data
// path and must never be answered from this knowledge base.
export const KNOWLEDGE_BASE = [
  {
    id: 'aqi-basics',
    question: 'What is AQI?',
    aliases: ['What does AQI mean?', 'Air quality index kya hai?', 'AQI ka matlab kya hai?', 'हवा गुणवत्ता सूचकांक क्या है?'],
    keywords: ['aqi', 'meaning', 'index', 'hawa', 'air', 'quality'],
    answer: 'AQI means Air Quality Index. It combines available pollutant measurements into a scale that is easier to interpret; it is not a pollutant concentration by itself. India’s CPCB National AQI uses six categories from Good to Severe. This app’s Open-Meteo readings are modelled and its displayed US/EU AQI values are not CPCB National AQI.'
  },
  {
    id: 'aqi-categories',
    question: 'What are India’s CPCB AQI categories?',
    aliases: ['Explain AQI categories', 'CPCB AQI range kya hai?', 'AQI categories in India', 'भारत के AQI स्तर क्या हैं?'],
    keywords: ['cpcb', 'india', 'category', 'categories', 'range', 'levels', 'standard'],
    answer: 'CPCB National AQI ranges are: Good 0–50; Satisfactory 51–100; Moderate 101–200; Poor 201–300; Very Poor 301–400; Severe 401–500. These are CPCB bands; do not apply them to a US AQI or European AQI value.'
  },
  {
    id: 'aqi-good', question: 'What does Good AQI mean?',
    aliases: ['AQI 0 to 50 meaning', 'Good air quality meaning', 'AQI achha ho to kya matlab?'],
    keywords: ['good', 'aqi', '0 50', 'minimal'],
    answer: 'Under CPCB’s National AQI, Good is 0–50 and is associated with minimal impact. It is an index category, not a guarantee that every person or every indoor location has zero exposure.'
  },
  {
    id: 'aqi-satisfactory', question: 'What does Satisfactory AQI mean?',
    aliases: ['AQI 51 to 100 meaning', 'Satisfactory air quality', 'AQI satisfactory ka matlab'],
    keywords: ['satisfactory', 'aqi', '51 100', 'sensitive'],
    answer: 'CPCB’s Satisfactory band is 51–100. CPCB notes that sensitive people may experience minor breathing discomfort. People with health concerns should follow advice from their clinician and local advisories.'
  },
  {
    id: 'aqi-moderate', question: 'What does Moderate AQI mean?',
    aliases: ['AQI 101 to 200 meaning', 'Moderate air pollution effects', 'AQI moderate ka matlab'],
    keywords: ['moderate', 'aqi', '101 200', 'asthma', 'heart', 'children', 'elderly'],
    answer: 'CPCB’s Moderate band is 101–200. CPCB associates it with possible breathing discomfort for people with lung disease such as asthma, and discomfort for people with heart disease, children, and older adults. Consider lighter or shorter strenuous activity if you are sensitive.'
  },
  {
    id: 'aqi-poor', question: 'What does Poor AQI mean?',
    aliases: ['AQI 201 to 300 meaning', 'Poor air quality precautions', 'AQI poor ka matlab'],
    keywords: ['poor', 'aqi', '201 300', 'prolonged', 'exposure'],
    answer: 'CPCB’s Poor band is 201–300. CPCB says prolonged exposure may cause breathing discomfort to people, with discomfort possible for people with heart disease even after shorter exposure. Reduce prolonged or strenuous outdoor activity and check local public-health guidance.'
  },
  {
    id: 'aqi-very-poor', question: 'What does Very Poor AQI mean?',
    aliases: ['AQI 301 to 400 meaning', 'Very poor air quality precautions', 'AQI bahut kharab ho to?'],
    keywords: ['very poor', 'aqi', '301 400', 'respiratory', 'illness'],
    answer: 'CPCB’s Very Poor band is 301–400. CPCB associates prolonged exposure with respiratory illness, with effects potentially more pronounced for people with lung or heart disease. Keep strenuous activity shorter or move it indoors where indoor air is cleaner.'
  },
  {
    id: 'aqi-severe', question: 'What does Severe AQI mean?',
    aliases: ['AQI 401 to 500 meaning', 'Severe air quality precautions', 'AQI severe ho to kya karein?'],
    keywords: ['severe', 'aqi', '401 500', 'healthy', 'light activity'],
    answer: 'CPCB’s Severe band is 401–500. CPCB warns that respiratory effects may occur even in healthy people, with serious impacts for people with lung or heart disease; effects may occur during light activity. Follow local official advisories and reduce outdoor exposure.'
  },
  {
    id: 'pm25', question: 'What is PM2.5?',
    aliases: ['Explain PM2.5 simply', 'PM 2.5 kya hota hai?', 'What does PM 2.5 measure?', 'PM2.5 ka matlab'],
    keywords: ['pm25', 'fine', 'particles', 'small', 'hawa', 'dust'],
    answer: 'PM2.5 is airborne particulate matter with an aerodynamic diameter of 2.5 micrometres or smaller. These fine particles can travel deep into the respiratory tract. A concentration is usually reported in micrograms per cubic metre (µg/m³); it is not itself an AQI value.'
  },
  {
    id: 'pm10', question: 'What is PM10?',
    aliases: ['PM 10 kya hota hai?', 'What does PM10 measure?', 'PM10 ka matlab'],
    keywords: ['pm10', 'coarse', 'particles', 'dust', 'pollen'],
    answer: 'PM10 refers to inhalable particles with an aerodynamic diameter of 10 micrometres or smaller. It includes coarse particles such as some dust and pollen as well as smaller particles. Concentrations are commonly reported in µg/m³.'
  },
  {
    id: 'pm-comparison', question: 'What is the difference between PM2.5 and PM10?',
    aliases: ['PM2.5 vs PM10', 'PM 2.5 aur PM 10 mein kya farq hai?', 'Which particles are smaller?'],
    keywords: ['pm25', 'pm10', 'difference', 'compare', 'smaller', 'farq'],
    answer: 'PM2.5 particles are 2.5 µm or smaller; PM10 includes particles up to 10 µm. PM2.5 is a subset of PM10 by size range, so the two measurements are related but are not interchangeable. Both are concentrations, not AQI scores.'
  },
  {
    id: 'pollution-causes', question: 'What causes air pollution?',
    aliases: ['Why is air polluted?', 'Air pollution ke causes kya hain?', 'Hawa pradushan kyon hota hai?', 'air pollution kya hai'],
    keywords: ['causes', 'sources', 'pollution', 'air', 'vehicles', 'industry', 'dust', 'burning', 'pradushan'],
    answer: 'Common sources include vehicle exhaust, power generation and industry, construction and road dust, waste or biomass burning, household fuels, and some natural dust or smoke events. Weather can trap or disperse pollution, but weather does not create all emissions. The mix varies by place and time.'
  },
  {
    id: 'health-effects', question: 'How can air pollution affect health?',
    aliases: ['What are the health effects of air pollution?', 'Pollution se health par kya asar hota hai?', 'Can polluted air affect breathing?'],
    keywords: ['health', 'effects', 'breathing', 'respiratory', 'heart', 'pollution', 'asar'],
    answer: 'Air pollution can irritate the eyes and airways and can worsen symptoms for some people with respiratory or cardiovascular conditions. Risk depends on the pollutant, concentration, duration, and individual factors. This is general information, not a diagnosis; seek a clinician’s advice for personal symptoms.'
  },
  {
    id: 'exercise', question: 'How should I exercise outdoors when air quality is poor?',
    aliases: ['Outdoor exercise precautions', 'Can I go for a walk?', 'Kharab AQI mein walk kar sakte hain?', 'Is it a good time for a walk?'],
    keywords: ['exercise', 'outdoor', 'walk', 'run', 'activity', 'poor', 'precaution'],
    answer: 'This is general guidance, not a live assessment of your location. Check the current local reading and official advisory first. When pollution is elevated, consider a shorter, less strenuous session, a cleaner route or time, or moving activity indoors; people with relevant health conditions should follow their clinician’s plan.'
  },
  {
    id: 'poor-air-protection', question: 'How can I protect myself during poor air quality?',
    aliases: ['What should I do when AQI is high?', 'Poor air quality protection', 'AQI high ho to kya karein?', 'How can I reduce exposure?'],
    keywords: ['protect', 'poor', 'high', 'aqi', 'exposure', 'reduce', 'precautions', 'bachav'],
    answer: 'Check local readings and advisories; reduce prolonged or strenuous outdoor activity during high-pollution periods; choose routes away from heavy traffic; and use cleaner indoor air when outdoor air is worse. A well-fitting particulate respirator may reduce particle exposure for some people, but it does not remove gases or make polluted air risk-free.'
  },
  {
    id: 'masks', question: 'Do masks help with air pollution?',
    aliases: ['Which mask helps with PM2.5?', 'Mask pollution se bachata hai?', 'Should I wear an N95 for pollution?'],
    keywords: ['mask', 'n95', 'n99', 'respirator', 'pm25', 'particles', 'fit'],
    answer: 'A properly fitted, certified particulate respirator such as an N95/FFP2-type product can reduce inhalation of particles when worn correctly. Fit and seal matter; facial hair or gaps reduce protection. These masks do not filter many gases, are not suitable for every person or activity, and do not replace reducing exposure or medical advice.'
  },
  {
    id: 'indoor-air', question: 'How can I improve indoor air quality?',
    aliases: ['How do I keep the air clean at home?', 'Ghar ki hawa saaf kaise rakhein?', 'Indoor pollution kaise kam karein?'],
    keywords: ['indoor', 'home', 'house', 'ghar', 'air', 'quality', 'clean', 'ventilation'],
    answer: 'Reduce indoor sources first: avoid smoking and open burning, use cleaner cooking fuels where available, and maintain cooking exhaust. Ventilate when outdoor air is cleaner; during a high-pollution episode, limit outdoor air entering and use filtration if available. Indoor conditions differ from outdoor readings.'
  },
  {
    id: 'air-purifier', question: 'Do air purifiers help?',
    aliases: ['Should I buy an air purifier?', 'HEPA purifier for PM2.5', 'Air purifier kaam karta hai?'],
    keywords: ['purifier', 'air cleaner', 'hepa', 'filter', 'cadr', 'pm25'],
    answer: 'A correctly sized mechanical HEPA-type room cleaner can reduce airborne particles in the room it serves, but it cannot remove every pollutant or replace source control and ventilation when outdoor air is clean. Match its clean-air delivery rate to room size, maintain filters, and avoid devices that intentionally generate ozone.'
  },
  {
    id: 'children', question: 'What precautions should children take during poor air quality?',
    aliases: ['Air pollution and children', 'Bachchon ko pollution se kaise bachayein?', 'Precautions for kids in bad AQI'],
    keywords: ['children', 'child', 'kids', 'bachche', 'school', 'poor', 'precautions'],
    answer: 'Children are identified by CPCB among groups that may be affected at Moderate AQI. Check local advisories, reduce strenuous outdoor play when pollution is high, and choose a cleaner indoor space if its air is better. For a child with symptoms or a known condition, follow the family’s clinician-provided guidance.'
  },
  {
    id: 'elderly', question: 'What precautions should older adults take?',
    aliases: ['Air pollution and elderly people', 'Buzurgon ko pollution se kaise bachayein?', 'Precautions for senior citizens'],
    keywords: ['elderly', 'older', 'senior', 'buzurg', 'moderate', 'precautions'],
    answer: 'CPCB identifies older adults among groups who may experience discomfort at Moderate AQI. Check local readings and advisories, avoid prolonged strenuous activity outdoors during elevated pollution, and use cleaner indoor air when possible. Follow any advice already given by a healthcare professional.'
  },
  {
    id: 'asthma', question: 'What should people with asthma do when pollution is high?',
    aliases: ['Asthma and air pollution', 'Asthma mein AQI high ho to?', 'Precautions for asthma during bad AQI'],
    keywords: ['asthma', 'lung', 'high', 'pollution', 'plan', 'doctor', 'precautions'],
    answer: 'CPCB notes that Moderate AQI may cause breathing discomfort for people with lung disease such as asthma. Reduce exposure when pollution is high and follow your existing clinician-provided asthma action plan and medication instructions. Seek medical help for worsening or severe symptoms; this assistant cannot diagnose or change treatment.'
  },
  {
    id: 'personal-exposure', question: 'How can I reduce my personal pollution exposure?',
    aliases: ['Ways to reduce exposure to pollution', 'Pollution exposure kam kaise karein?', 'How can I avoid traffic pollution?'],
    keywords: ['reduce', 'personal', 'exposure', 'avoid', 'route', 'traffic', 'pollution'],
    answer: 'Use current local information to plan: choose less busy routes where practical, avoid strenuous activity near traffic or visible smoke, and shift timing or location when conditions are worse. At home, reduce pollution sources and filter particles if appropriate. These steps reduce exposure; they do not eliminate it.'
  },
  {
    id: 'transport', question: 'Which transportation choices are more environment-friendly?',
    aliases: ['How can transport reduce air pollution?', 'Environment friendly travel', 'Pollution kam karne ke liye kaise travel karein?'],
    keywords: ['transport', 'transportation', 'travel', 'walk', 'cycle', 'public', 'transit', 'environment', 'friendly'],
    answer: 'For suitable trips, walking, cycling, public transport, and carpooling can reduce per-person vehicle use and tailpipe emissions. Combine trips, avoid unnecessary idling, and maintain vehicles. Choose options that are safe and practical for the route, weather, and current air conditions.'
  },
  {
    id: 'urban-prevention', question: 'How can cities prevent air pollution?',
    aliases: ['Urban pollution prevention', 'How can a city improve air?', 'Shehar ka pradushan kaise kam ho?'],
    keywords: ['urban', 'city', 'cities', 'prevent', 'prevention', 'pollution', 'shehar', 'pradushan'],
    answer: 'Cities can reduce emissions at source through cleaner public transport, walking and cycling infrastructure, clean energy and cooking, dust control at roads and construction sites, reliable waste collection instead of burning, and effective industrial and vehicle standards. Monitoring and enforcement should be paired with public access to current data.'
  },
  {
    id: 'measurements', question: 'How is air quality measured?',
    aliases: ['How are air pollution measurements made?', 'AQI kaise measure hota hai?', 'Understanding air quality measurements'],
    keywords: ['measured', 'measurement', 'monitor', 'station', 'sensor', 'aqi', 'concentration'],
    answer: 'Monitors measure pollutant concentrations using pollutant-specific methods and averaging periods. An AQI system converts eligible pollutant sub-indices into a summary category; it is not a direct sensor reading. For CPCB National AQI, at least three pollutants must have data, including PM2.5 or PM10.'
  },
  {
    id: 'aqi-calculation', question: 'How is CPCB National AQI calculated?',
    aliases: ['What pollutants are used for India AQI?', 'CPCB AQI kaise calculate hota hai?', 'How many pollutants are needed for AQI?'],
    keywords: ['cpcb', 'national', 'aqi', 'calculated', 'calculation', 'pollutants', 'three'],
    answer: 'CPCB National AQI considers eight pollutants. It is calculated when data are available for at least three pollutants, including at least one of PM2.5 or PM10; pollutant-specific sub-indices use their prescribed averaging periods. The overall AQI is the highest eligible sub-index, so it should not be reconstructed from one pollutant alone.'
  },
  {
    id: 'aqi-vs-pollutant', question: 'Is AQI the same as PM2.5 concentration?',
    aliases: ['AQI vs PM2.5', 'AQI aur PM2.5 same hain?', 'Is AQI a pollutant measurement?'],
    keywords: ['aqi', 'pm25', 'same', 'concentration', 'difference'],
    answer: 'No. PM2.5 is a pollutant concentration, usually reported in µg/m³. AQI is a scale computed from pollutant sub-indices under a particular system. A PM2.5 reading alone does not determine the full CPCB AQI.'
  },
  {
    id: 'modelled-vs-cpcb', question: 'Is this app’s AQI the official CPCB AQI?',
    aliases: ['Is Open-Meteo AQI the Indian AQI?', 'Does this show CPCB readings?', 'Kya yeh CPCB ka AQI hai?'],
    keywords: ['app', 'open meteo', 'cpcb', 'official', 'india', 'modelled', 'modeled', 'us', 'european'],
    answer: 'No. AirWise currently displays Open-Meteo modelled pollutant information and, when supplied, US AQI and European AQI. It does not connect to CPCB monitoring stations or calculate India’s CPCB National AQI. Use the label shown beside any reading to identify its source and index system.'
  },
  {
    id: 'aqi-fluctuation', question: 'Why does AQI change during the day?',
    aliases: ['Why does air quality change?', 'AQI din bhar kyon badalta hai?', 'Does weather affect AQI?'],
    keywords: ['aqi', 'change', 'day', 'weather', 'wind', 'emissions', 'vary'],
    answer: 'Pollution levels can change as emissions, wind, mixing height, sunlight, and other weather conditions change. Different pollutants also have different patterns. Compare readings from the same provider and index system, and check their timestamps and averaging periods.'
  },
  {
    id: 'open-windows', question: 'Should I open windows when outdoor air is polluted?',
    aliases: ['When should I ventilate my home?', 'Pollution mein khidki kholni chahiye?', 'Should windows stay closed during smog?'],
    keywords: ['windows', 'open', 'ventilate', 'indoor', 'outdoor', 'polluted', 'smog'],
    answer: 'Ventilate when outdoor air is cleaner than indoor air. During a short high-pollution episode, reducing outdoor air entry and using particle filtration may help lower indoor particle levels, but do not ignore heat, cooking emissions, or other indoor sources. Air rooms out when outdoor conditions improve.'
  },
  {
    id: 'commute', question: 'How can I reduce pollution exposure during my commute?',
    aliases: ['Cleaner commute tips', 'Traffic pollution se kaise bachein?', 'How do I avoid roadside pollution?'],
    keywords: ['commute', 'traffic', 'route', 'travel', 'roadside', 'exposure'],
    answer: 'When practical, choose a route away from heavily congested roads, avoid waiting beside idling vehicles, and check local conditions before strenuous cycling or walking. Public transport or carpooling can reduce vehicle use. A mask is not a substitute for reducing exposure and may not suit everyone.'
  },
  {
    id: 'construction-dust', question: 'How can construction and road dust be reduced?',
    aliases: ['Construction dust control', 'Road dust pollution kaise kam karein?', 'Why is there so much dust?'],
    keywords: ['construction', 'road', 'dust', 'control', 'cover', 'sweeping'],
    answer: 'Practical controls include covering transported material, preventing soil and debris from spreading onto roads, maintaining site boundaries, using suitable wet suppression, and removing deposited dust safely. Cities and site operators should follow applicable local requirements; sweeping that re-suspends dust can worsen exposure.'
  },
  {
    id: 'waste-burning', question: 'Why should I avoid burning waste?',
    aliases: ['Is burning rubbish harmful?', 'Kachra jalana kyon avoid karein?', 'Does open burning cause pollution?'],
    keywords: ['burning', 'waste', 'rubbish', 'garbage', 'open', 'smoke', 'kachra'],
    answer: 'Open waste burning releases smoke and a mixture of particles and gases, and can expose nearby people. Use municipal collection, compost suitable organic waste, or follow local disposal rules instead. Never burn waste indoors or near people.'
  },
  {
    id: 'vehicle-maintenance', question: 'Does vehicle maintenance help reduce air pollution?',
    aliases: ['How do vehicles make less pollution?', 'Vehicle pollution kam kaise karein?', 'Should I avoid engine idling?'],
    keywords: ['vehicle', 'maintenance', 'idling', 'emissions', 'pollution', 'pucc'],
    answer: 'Maintaining a vehicle, keeping emissions equipment working, complying with required inspections, and avoiding unnecessary idling can reduce avoidable emissions. Follow manufacturer and local transport guidance; maintenance does not make a high-emitting trip pollution-free.'
  },
  {
    id: 'cooking-smoke', question: 'How can I reduce cooking smoke indoors?',
    aliases: ['Kitchen smoke and indoor air', 'Cooking se ghar ki hawa kharab hoti hai?', 'How can I ventilate while cooking?'],
    keywords: ['cooking', 'kitchen', 'smoke', 'indoor', 'fuel', 'ventilation'],
    answer: 'Use a cleaner cooking fuel or electric appliance where available, keep burners maintained, and use an exhaust vent that sends pollutants outdoors. Ventilate when outdoor air is cleaner. Avoid burning candles, incense, or other materials near people, especially in poorly ventilated rooms.'
  },
  {
    id: 'outdoor-workers', question: 'What can outdoor workers do during high pollution?',
    aliases: ['Outdoor worker pollution precautions', 'Working outside in bad AQI', 'Outdoor kaam aur pollution'],
    keywords: ['outdoor', 'worker', 'work', 'job', 'high', 'pollution', 'break'],
    answer: 'Follow workplace and local public-health guidance. Where practical, reduce strenuous work during high-pollution periods, schedule breaks in a cleaner indoor space, and avoid sources such as traffic and smoke. A worker with symptoms or a health condition should seek advice from a qualified clinician or occupational-health professional.'
  },
  {
    id: 'school-activity', question: 'Should schools change outdoor activities when air is polluted?',
    aliases: ['School sports during poor AQI', 'Bachchon ki outdoor activity pollution mein?', 'School outdoor exercise precautions'],
    keywords: ['school', 'children', 'outdoor', 'activity', 'sports', 'polluted'],
    answer: 'Schools should use current local readings and applicable official guidance to decide whether to shorten, move, or reschedule strenuous outdoor activity. Children can be more sensitive to pollution; avoid asserting a universal cutoff beyond the relevant local advisory. Families should follow clinician guidance for children with health conditions.'
  },
  {
    id: 'measurement-units', question: 'What does µg/m³ mean?',
    aliases: ['What are air pollution units?', 'PM reading unit kya hai?', 'Micrograms per cubic metre meaning'],
    keywords: ['µg', 'microgram', 'unit', 'concentration', 'pm25', 'pm10'],
    answer: 'µg/m³ means micrograms per cubic metre. It expresses the mass of a pollutant in a volume of air. It is a concentration unit, not an AQI category.'
  },
  {
    id: 'reading-time', question: 'Why should I check the timestamp on an air-quality reading?',
    aliases: ['Are air-quality readings real time?', 'How old is my AQI reading?', 'Reading timestamp kyon zaroori hai?'],
    keywords: ['timestamp', 'time', 'reading', 'real time', 'average', 'current'],
    answer: 'A timestamp and averaging period show when the underlying measurement or model estimate applies. AQI systems may use pollutant-specific averaging periods, so a displayed value is not necessarily an instantaneous reading. Check the provider and time before making a decision.'
  },
  {
    id: 'aqi-monitoring', question: 'Where can I find a current official CPCB AQI?',
    aliases: ['How do I check India’s official AQI?', 'CPCB live AQI kahan dekhein?', 'How can I check current AQI?'],
    keywords: ['official', 'cpcb', 'current', 'india', 'aqi', 'check', 'live'],
    answer: 'Use CPCB’s official AQI/monitoring service for current station-based Indian National AQI. Check the station, timestamp, and pollutant data. AirWise does not currently fetch CPCB station readings; it provides modelled Open-Meteo data and labels its US/EU indices separately.'
  },
  {
    id: 'gases', question: 'Does a HEPA filter remove air-pollution gases?',
    aliases: ['Does an air purifier remove NO2 or ozone?', 'Can HEPA filter gases?', 'HEPA gas filtration'],
    keywords: ['hepa', 'filter', 'gases', 'gas', 'no2', 'ozone', 'purifier'],
    answer: 'A HEPA mechanical filter is designed to capture particles, not gases such as nitrogen dioxide or ozone. Some devices include a separate sorbent medium for certain gases, but performance depends on its design and condition. Check the manufacturer’s verified specifications and keep source control and ventilation in mind.'
  },
  {
    id: 'ventilation', question: 'Why does ventilation matter for indoor air?',
    aliases: ['Fresh air at home', 'Indoor ventilation and air quality', 'Ghar mein hawa aana kyon zaroori hai?'],
    keywords: ['ventilation', 'fresh', 'air', 'indoor', 'home', 'dilute'],
    answer: 'Ventilation can dilute indoor pollutants by exchanging indoor air with outdoor air. It helps when outdoor air is cleaner, but can bring more particles indoors when outdoor pollution is high. Reduce indoor sources and choose ventilation timing based on local conditions.'
  },
  {
    id: 'pollution-forecast', question: 'Can a forecast guarantee tomorrow’s air quality?',
    aliases: ['Are air pollution forecasts exact?', 'AQI forecast kitna accurate hota hai?', 'Can the AQI change after a forecast?'],
    keywords: ['forecast', 'guarantee', 'tomorrow', 'exact', 'estimate', 'change'],
    answer: 'No. A forecast is a model estimate based on available inputs and can differ from later observations as emissions and weather change. Treat it as planning information, then check the latest provider reading and timestamp.'
  },
  {
    id: 'pollen-dust', question: 'Is all visible dust the same as PM2.5?',
    aliases: ['Can I see PM2.5?', 'Does visible dust show AQI?', 'Kya PM2.5 aankhon se dikh sakta hai?'],
    keywords: ['visible', 'dust', 'pm25', 'see', 'particle', 'measurement'],
    answer: 'No. PM2.5 particles are much smaller than what is usually visible individually, and visible haze or dust does not identify a specific pollutant or concentration. Use a monitor or clearly labelled provider reading rather than judging AQI by appearance alone.'
  },
  {
    id: 'home-sources', question: 'What are common sources of indoor air pollution?',
    aliases: ['Indoor pollution ke sources kya hain?', 'What makes indoor air polluted?', 'Sources of home air pollution'],
    keywords: ['indoor', 'sources', 'home', 'cooking', 'smoking', 'burning', 'cleaning'],
    answer: 'Common indoor sources can include cooking and heating emissions, tobacco smoke, incense or candles, cleaning products, dampness and mould, and outdoor particles entering the building. Source control, safe ventilation, and suitable filtration can help; outdoor AQI does not measure indoor air.'
  },
  {
    id: 'AQI-sources', question: 'Which pollutants are included in CPCB National AQI?',
    aliases: ['List the eight pollutants in CPCB AQI', 'CPCB AQI pollutants kaun se hain?', 'What does Indian AQI measure?'],
    keywords: ['cpcb', 'national', 'aqi', 'pollutants', 'pm25', 'pm10', 'no2', 'so2', 'co', 'ozone', 'nh3', 'lead'],
    answer: 'CPCB National AQI considers PM2.5, PM10, nitrogen dioxide (NO₂), sulphur dioxide (SO₂), carbon monoxide (CO), ozone (O₃), ammonia (NH₃), and lead (Pb). The reported AQI requires sufficient pollutant data; it is not a simple average of all eight.'
  }
];

export const SUGGESTED_QUESTIONS = [
  'Is it a good time for a walk?',
  'Explain PM2.5 simply',
  'How can I reduce exposure?'
];

const STRONG_MATCH_THRESHOLD = 0.62;
export const FALLBACK_MATCH_THRESHOLD = 0.48;
const STOP_WORDS = new Set(['a','about','an','and','are','as','at','be','can','do','does','for','from','how','i','in','is','it','me','of','on','or','should','the','to','what','when','which','why','with','would','kya','hai','hain','ka','ki','ke','ko','kya','batao','bataye','samjhao','samjha','hota','hoti','hote','kaise','mein','me','par','se','karein','karen','kya','matlab']);
const REPLACEMENTS = [
  [new RegExp('\\u0935\\u093e\\u092f\\u0941', 'g'), 'air'],
  [new RegExp('\\u0939\\u0935\\u093e', 'g'), 'air'],
  [new RegExp('\\u092a\\u094d\\u0930\\u0926\\u0942\\u0937\\u0923', 'g'), 'pollution'],
  [new RegExp('\\u0915\\u094d\\u092f\\u093e', 'g'), 'kya'],
  [new RegExp('\\u0939\\u0948', 'g'), 'hai'],
  [new RegExp('\\u0915\\u0948\\u0938\\u0947', 'g'), 'kaise'],
  [new RegExp('\\u092c\\u091a\\u093e\\u0935', 'g'), 'protect'],
  [new RegExp('\\u092c\\u091a\\u094d\\u091a\\u094b\\u0902', 'g'), 'child'],
  [new RegExp('\\u092c\\u0941\\u091c\\u0941\\u0930\\u094d\\u0917\\u094b\\u0902', 'g'), 'elderly'],
  [new RegExp('\\u0905\\u092d\\u0940', 'g'), 'current'],
  [new RegExp('\\u0938\\u093e\\u0902\\u0938', 'g'), 'breathing'],
  [new RegExp('\\u0918\\u0930', 'g'), 'home'],
  [/\bair quality index\b/g, 'aqi'], [/\bair quality\b/g, 'air quality'],
  [/\bpm\s*[-_]?\s*2[.,]?\s*5\b/g, 'pm25'], [/\bpm\s*[-_]?\s*10\b/g, 'pm10'],
  [/\bpolution\b/g, 'pollution'], [/\bpollutants?\b/g, 'pollution'], [/\bpolluted\b/g, 'pollution'],
  [/\bparticals?\b/g, 'particles'], [/\bcatagor(?:y|ies)\b/g, 'categories'],
  [/\bchildren|kids|child\b/g, 'child'], [/\bbach(?:che|chon|cho|on)\b/g, 'child'],
  [/\belderly|seniors?|older adults?\b/g, 'elderly'], [/\bbuzurg(?:on)?\b/g, 'elderly'],
  [/\bpradushan\b/g, 'pollution'], [/\bhawa|hava|vayu\b/g, 'air'],
  [/\bsaans\b/g, 'breathing'], [/\bdhool\b/g, 'dust'], [/\bkhidki\b/g, 'windows'],
  [/\bghar\b/g, 'home'], [/\bachha|achhi|achhe\b/g, 'good'], [/\bkharab\b/g, 'poor'],
  [/\babhi|aaj|filhal|vartaman\b/g, 'current'], [/\bmatlab\b/g, 'meaning'],
  [/\bfarq\b/g, 'difference'], [/\bbachav\b/g, 'protect']
];
const TOKEN_SYNONYMS = new Map([
  ['walk','exercise'], ['walking','exercise'], ['run','exercise'], ['running','exercise'],
  ['seniors','elderly'], ['senior','elderly'], ['old','elderly'], ['aged','elderly'],
  ['bad','poor'], ['unhealthy','poor'], ['dirty','pollution'], ['breath','breathing'],
  ['breathe','breathing'], ['measure','measurement'], ['measuring','measurement'], ['measured','measurement'],
  ['cause','causes'], ['effects','effect'], ['precautions','precaution'], ['levels','level'],
  ['masks','mask'], ['purifiers','purifier'], ['filters','filter'], ['polluting','pollution'],
  ['categories','category'], ['ranges','range'], ['standards','standard']
]);

export function normalizeQuestion(value) {
  let text = String(value ?? '').normalize('NFKC').toLowerCase().replace(/[’']/g, '');
  for (const [pattern, replacement] of REPLACEMENTS) text = text.replace(pattern, replacement);
  return text.replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function tokenSet(normalized) {
  return new Set(normalized.split(' ').filter(token => token && !STOP_WORDS.has(token))
    .map(token => TOKEN_SYNONYMS.get(token) || token));
}

function entryScore(normalized, queryTokens, entry) {
  const variants = [entry.question, ...(entry.aliases || [])].map(normalizeQuestion);
  if (variants.includes(normalized)) return 1;
  if (!queryTokens.size) return 0;
  const entryTokens = tokenSet(normalizeQuestion([entry.question, ...(entry.aliases || []), ...(entry.keywords || [])].join(' ')));
  let overlap = 0;
  for (const token of queryTokens) if (entryTokens.has(token)) overlap++;
  const queryCoverage = overlap / queryTokens.size;
  const entryCoverage = overlap / Math.max(1, Math.min(entryTokens.size, 6));
  const phraseBonus = variants.some(variant => variant.length > 4 && normalized.includes(variant)) ? 0.22 : 0;
  return Math.min(0.95, queryCoverage * 0.68 + entryCoverage * 0.32 + phraseBonus);
}

const LIVE_TERMS = /\b(current|now|today|live|latest|currently|abhi|aaj|filhal|vartaman)\b/u;
const READING_TERMS = /\b(aqi|pm25|pm10|air quality|pollution level|pollution today|air pollution)\b/u;
const LOCATION_WORDS = /\b(?:in|at|for|near|mein|me)\b|\b(?:ka|ki)\s+(?:aqi|air quality|pollution)\b/u;
const STATIC_QUESTION_TERMS = /\b(category|categories|range|ranges|standard|standards|calculate|calculated|calculation|meaning|mean|define|measurements?)\b/u;
const STATIC_LOOKUP_HELP = /\b(where can i find|how do i check|how can i check|official source|official cpcb)\b/u;
const CITY_BEFORE_READING = /\b[a-z][a-z -]{1,40}\s+(?:aqi|air quality|pollution level)\b/u;

export function isLiveAirQuestion(value) {
  const normalized = normalizeQuestion(value);
  if (!READING_TERMS.test(normalized)) return false;
  if (STATIC_QUESTION_TERMS.test(normalized) || STATIC_LOOKUP_HELP.test(normalized)) return false;
  if (LIVE_TERMS.test(normalized)) return true;
  // The city-prefix heuristic would otherwise treat “what is the” as a place.
  if (/\bwhat is\b/u.test(normalized)) return false;
  return LOCATION_WORDS.test(normalized) || CITY_BEFORE_READING.test(normalized);
}

export function matchKnowledgeBase(question, { threshold = STRONG_MATCH_THRESHOLD } = {}) {
  if (isLiveAirQuestion(question)) return null;
  const normalized = normalizeQuestion(question);
  if (!normalized) return null;
  const queryTokens = tokenSet(normalized);
  let best = null;
  for (const entry of KNOWLEDGE_BASE) {
    const confidence = entryScore(normalized, queryTokens, entry);
    if (!best || confidence > best.confidence) best = { entry, confidence };
  }
  return best && best.confidence >= threshold ? best : null;
}

export function getSuggestedAnswer(question) {
  if (!SUGGESTED_QUESTIONS.some(item => normalizeQuestion(item) === normalizeQuestion(question))) return null;
  const match = matchKnowledgeBase(question, { threshold: 1 });
  return match ? { answer: match.entry.answer, question: match.entry.question, id: match.entry.id } : null;
}

export function extractLiveCity(question) {
  const normalized = normalizeQuestion(question);
  const stop = new Set(['aqi','air','quality','pollution','level','levels','pm25','pm10','current','today','now','live','latest','right','currently','kya','hai','hain','kitna','kitni','batao','abhi','aaj','filhal','vartaman','category','categories','meaning','standard','standards']);
  const clean = part => {
    const words = part.trim().split(/\s+/u).filter(Boolean);
    while (words.length && /^(what|is|the|current|live|latest|aqi|air|quality|pollution|pm25|pm10|kya|hai|hain|kitna|kitni|abhi|aaj)$/u.test(words[0])) words.shift();
    const city = [];
    for (const word of words) {
      if (stop.has(word)) break;
      city.push(word);
      if (city.length === 4) break;
    }
    const candidate = city.join(' ').replace(/\b(?:today|current|now|right)\b.*$/u, '').trim();
    if (!candidate || /^(india|world|city|cities|home|here|there|my location)$/u.test(candidate)) return '';
    return candidate;
  };
  const afterPrep = normalized.match(/\b(?:in|at|for|near|mein|me)\s+(.+)$/u);
  if (afterPrep) {
    const candidate = clean(afterPrep[1]);
    if (candidate) return candidate;
  }
  const beforeHindiPossessive = normalized.match(/\b(.+?)\s+(?:ka|ki)\s+(?:aqi|air quality|pollution)\b/u);
  if (beforeHindiPossessive) {
    const candidate = clean(beforeHindiPossessive[1]);
    if (candidate) return candidate;
  }
  const beforeReading = normalized.match(/^(.+?)\s+(?:aqi|air quality|pm25|pm10|pollution level)\b/u);
  if (beforeReading) {
    const candidate = clean(beforeReading[1]);
    if (candidate) return candidate;
  }
  return '';
}
