/**
 * NLP Training Script — trains a Naive Bayes classifier on 195+ sample statements
 * across 3 categories: admissions, scholarship, internship.
 *
 * Run once:  node scripts/trainClassifier.js
 * Output:    data/classifier.json
 */
const natural = require("natural");
const fs = require("fs");
const path = require("path");

const classifier = new natural.BayesClassifier();

// ═══════════════════════════════════════════════════════════════════════════════
// ADMISSIONS (65 statements)
// ═══════════════════════════════════════════════════════════════════════════════
const admissions = [
  "I wish to apply for admission to the computer science program",
  "Application for admission to the engineering department",
  "I am writing to request enrollment in the undergraduate program",
  "Please consider my application for the upcoming academic session",
  "Subject: Admission inquiry for MBA program",
  "I have completed my board examinations and wish to join your institution",
  "Requesting admission to the graduate program in data science",
  "I would like to seek admission in the bachelor of arts program",
  "This is a formal application for admission to your esteemed university",
  "I am interested in enrolling for the diploma course in civil engineering",
  "Kindly consider my candidature for admission to the medical program",
  "I hereby apply for a seat in the mechanical engineering department",
  "Application for admission to the master of science program",
  "I am submitting my application for the upcoming semester enrollment",
  "Request for admission to the PhD program in physics",
  "I want to join the BBA program starting from the next academic year",
  "Seeking admission to the law school for the current session",
  "I am applying for enrollment in the bachelor of commerce program",
  "Subject: Application for admission to the nursing program",
  "Please find attached my application for admission to the architecture course",
  "I wish to be considered for admission into the biotechnology department",
  "This letter is regarding my application for the MCA program",
  "I have passed the entrance examination and wish to secure admission",
  "Respectfully requesting admission to the college of pharmacy",
  "Application for enrollment in the postgraduate diploma program",
  "I am a qualified candidate seeking admission to your dental college",
  "Request to be admitted to the bachelor of education program",
  "I would like to apply for the integrated five-year program",
  "Formal request for admission to the school of management",
  "I am eager to pursue my studies at your institution starting next term",
  "Dear admissions committee, I am writing to express my interest in joining",
  "To the registrar: please process my admission application for the fall semester",
  "I have secured the required percentage and wish to apply for admission",
  "My qualification meets the eligibility criteria for admission to your program",
  "I am a transfer student seeking admission from another university",
  "Application for lateral entry admission to the third semester",
  "I wish to apply for the evening batch admission in your college",
  "Request for admission under the management quota",
  "I am applying for admission on the basis of my entrance test score",
  "Kindly grant me admission to the distance learning program",
  "Subject: Application for readmission to the university",
  "I was previously enrolled and wish to seek readmission this year",
  "I am writing regarding admission to the honors program in economics",
  "Please accept my application for the foundation year program",
  "I would like to enroll in the certificate course offered by your department",
  "Application for admission to the summer school program",
  "I am interested in the dual degree program offered by your institution",
  "This is to formally apply for admission to the fine arts department",
  "Seeking enrollment in the sports science program at your university",
  "I am applying for admission to the school of journalism",
  "Request for admission to the applied mathematics program",
  "I have completed my higher secondary education and seek college admission",
  "My academic transcripts are attached for your review for admission",
  "I am submitting my statement of purpose along with this admission application",
  "Letters of recommendation are enclosed with my admission request",
  "Application for the spring semester admission to the chemistry department",
  "I meet all the prerequisites for admission to the graduate school",
  "Respectfully applying for enrollment in the agricultural sciences program",
  "I am a first-generation college applicant seeking admission",
  "Request for provisional admission pending final examination results",
  "I scored above the cutoff marks and am eligible for admission",
  "Dear principal, I request admission to the eleventh standard science stream",
  "I am applying for admission to the ITI course in electrical trade",
  "This application is for admission to your polytechnic institution",
  "I wish to join the research program under the professor's guidance",
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCHOLARSHIP (65 statements)
// ═══════════════════════════════════════════════════════════════════════════════
const scholarship = [
  "I am applying for a merit-based scholarship for the current year",
  "Request for financial aid for the academic year 2026",
  "My family's annual income is below the threshold for fee waiver",
  "Application for the national scholarship scheme",
  "I seek financial assistance to continue my education",
  "Requesting tuition waiver based on academic performance",
  "I am eligible for the minority community scholarship",
  "Application for the post-matric scholarship for SC/ST students",
  "I need financial support to pay my college fees",
  "Kindly consider me for the need-based scholarship program",
  "I have maintained a GPA above 3.5 and qualify for the dean's scholarship",
  "Application for the government merit scholarship for toppers",
  "My family cannot afford the tuition fees without financial help",
  "I am writing to apply for the research fellowship grant",
  "Request for scholarship under the central government scheme",
  "I am a single parent and seek scholarship for my child's education",
  "Application for the sports scholarship based on national level achievement",
  "I have been selected for the state-level scholarship examination",
  "Requesting financial grant for pursuing higher studies abroad",
  "My income certificate is attached for scholarship eligibility verification",
  "I am applying for the full tuition scholarship offered by the trust",
  "Application for the endowment scholarship for economically weaker sections",
  "I qualify for the scholarship based on my family income being below two lakhs",
  "Request for renewal of the scholarship for the next academic year",
  "I was a previous scholarship recipient and wish to continue receiving aid",
  "Application for the talent-based scholarship in performing arts",
  "My bank account details are provided for scholarship fund disbursement",
  "I am seeking a partial fee waiver due to financial constraints",
  "Request for the doctoral research scholarship in the sciences",
  "I belong to an economically backward family and need scholarship support",
  "Application for the international student scholarship program",
  "I am applying for the women empowerment scholarship scheme",
  "Kindly process my scholarship application at the earliest",
  "I have been awarded the district-level scholarship for academic excellence",
  "Request for the disability scholarship under the government policy",
  "My father is a daily wage worker and I need financial assistance",
  "Application for the institutional scholarship for outstanding students",
  "I am eligible for the fee reimbursement scheme of the state government",
  "Request for the scholarship provided by the alumni association",
  "I have secured first rank in my class and apply for the topper scholarship",
  "Application for the study abroad scholarship funded by the ministry",
  "I am a war veteran's dependent applying for the defense scholarship",
  "Kindly consider my application for the agricultural scholarship",
  "I need a scholarship to cover my hostel and mess expenses",
  "Application for the scholarship offered to students from rural areas",
  "My annual family income does not exceed the prescribed limit for aid",
  "I am applying for the scholarship for students with physical disabilities",
  "Request for the corporate-sponsored scholarship for engineering students",
  "I have cleared the scholarship entrance test with distinction",
  "Application for the scholarship under the minority welfare department",
  "I seek financial support for attending the international conference",
  "My academic record supports my eligibility for this scholarship",
  "I am the first person in my family to attend college and need financial help",
  "Application for the graduate teaching assistantship scholarship",
  "Request for emergency financial aid due to sudden family hardship",
  "I am applying for the scholarship advertised on the university website",
  "My income tax returns are attached as proof for the scholarship application",
  "Application for the free education scheme for orphan students",
  "I qualify for the scholarship as per the reservation policy",
  "Request for scholarship extension for the additional semester",
  "I am a meritorious student from a low-income background seeking support",
  "Application for the government loan-cum-scholarship program",
  "I am applying for the cultural scholarship for traditional art forms",
  "Kindly release the pending scholarship amount for the current semester",
  "My BPL card details are enclosed for scholarship verification",
  "I request consideration for any available financial aid or scholarship",
];

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNSHIP (65 statements)
// ═══════════════════════════════════════════════════════════════════════════════
const internship = [
  "This is to certify that the student has completed an internship",
  "Certificate of completion for the summer training program",
  "To whom it may concern: the intern has successfully completed the program",
  "Training completion certificate for the legal internship",
  "The candidate served as an intern from January to March 2026",
  "This certifies that the bearer has undergone industrial training",
  "Certificate of internship completion at ABC Technologies",
  "The student has satisfactorily completed the required internship hours",
  "This is to confirm that the intern worked in the marketing department",
  "Internship experience certificate for the software development team",
  "The intern has demonstrated excellent performance during the training period",
  "Certificate of practical training in the hospital under Dr. Kumar",
  "The candidate completed a six-month internship in our research lab",
  "This letter certifies the completion of apprenticeship training",
  "The intern was assigned to the finance department for the duration",
  "Certificate of summer internship in the civil engineering division",
  "The student has completed vocational training at our manufacturing unit",
  "This is an internship completion letter for the journalism program",
  "The intern successfully completed all assigned tasks and projects",
  "Certificate of field training in the agricultural research station",
  "The candidate underwent internship training in our legal firm",
  "This certifies that the student worked as a trainee in our organization",
  "Internship certificate for the human resources department",
  "The intern contributed to the project on data analytics during training",
  "Certificate of completion for the teacher training internship",
  "The student has fulfilled the internship requirements of the curriculum",
  "This is to certify the completion of clinical internship in the hospital",
  "The intern worked on web development projects during the training",
  "Certificate of industrial visit and training at the power plant",
  "The candidate has completed the mandatory internship for the degree",
  "Internship letter confirming the student's role as a research assistant",
  "This certifies that the intern was trained in quality assurance",
  "The student completed the internship with an outstanding evaluation",
  "Certificate for the completion of the accounting internship program",
  "The intern has been trained in AutoCAD and site supervision",
  "This letter confirms the successful completion of the pharmacy internship",
  "The candidate interned at our NGO in the community outreach program",
  "Certificate of workshop training in advanced manufacturing techniques",
  "The student underwent hands-on training in our electronics lab",
  "Internship verification letter for the architecture firm",
  "The intern participated in the design and development team",
  "This certifies completion of the media and communications internship",
  "The candidate trained in network administration during the internship",
  "Certificate of completion for the government internship program",
  "The student completed an internship in the environmental science division",
  "This is a training certificate from the national skill development center",
  "The intern has gained practical experience in supply chain management",
  "Certificate of internship in the hospitality and tourism industry",
  "The student completed field work training as part of the internship",
  "This certifies that the candidate underwent training in our bank",
  "Internship completion certificate from the district collector office",
  "The intern worked in the cybersecurity division for three months",
  "Certificate of practical training in the textile manufacturing plant",
  "The student has completed the co-op education program at our company",
  "This is to certify the intern's contribution to the mobile app project",
  "The candidate received training in graphic design and digital marketing",
  "Certificate of completion for the summer research internship",
  "The intern demonstrated strong analytical skills during the program",
  "This certifies that the student trained in our pathology laboratory",
  "The candidate completed a winter internship in our consulting firm",
  "Certificate of on-the-job training at the automobile service center",
  "The intern was mentored by the senior advocate during the legal training",
  "This letter serves as proof of internship completion for academic credit",
  "The student underwent practical training as required by the university",
  "Certificate confirming the candidate's internship in our IT department",
];

// ═══════════════════════════════════════════════════════════════════════════════
// OTHER / UNRELATED (65 statements — catch-all for out-of-domain documents)
// ═══════════════════════════════════════════════════════════════════════════════
const other = [
  "Meeting agenda for the staff meeting on Monday morning",
  "Please bring your laptops and the quarterly sales report",
  "The weather forecast calls for rain throughout the week",
  "Preheat the oven to three hundred fifty degrees and bake for twenty five minutes",
  "Mix the flour sugar eggs and butter in a large mixing bowl",
  "The stock market saw gains as tech shares rallied on strong earnings",
  "The football match ended in a draw after extra time",
  "Recipe for chicken biryani with basmati rice and aromatic spices",
  "Minutes of the board meeting held on the fifteenth of January",
  "Buy eggs milk bread cheese and vegetables from the grocery store",
  "The cat sat on the mat near the window watching birds fly by",
  "Traffic advisory: road construction on the main highway until Friday",
  "Happy birthday wishes to our dear friend on this special occasion",
  "Movie review: the latest thriller is a must watch for action fans",
  "Invoice for office supplies purchased last month from the vendor",
  "The plumber will arrive between ten and twelve to fix the kitchen sink",
  "Travel itinerary for the family vacation to the beach resort",
  "Reminder to submit your timesheet before the end of the business day",
  "Book recommendation: the latest bestseller on artificial intelligence",
  "Gym workout plan for building upper body strength in four weeks",
  "The annual company picnic will be held at the central park pavilion",
  "Electricity bill for the month of September is due next week",
  "Yoga class schedule: Monday Wednesday and Friday at seven AM",
  "The new restaurant downtown serves excellent Italian cuisine",
  "Car maintenance checklist includes oil change tire rotation and brake inspection",
  "Complaint about the noise levels in the residential neighborhood",
  "Property listing: three bedroom apartment available for rent from March",
  "Instructions for assembling the bookshelf from the hardware store",
  "Donation receipt for the charity event held last weekend",
  "Newsletter: top ten tips for healthy eating during the winter season",
  "The software update will be deployed during the maintenance window tonight",
  "Wedding invitation for the ceremony on the twentieth of December",
  "Prescription refill request for blood pressure medication",
  "Public notice regarding water supply disruption on Thursday",
  "The gardener will trim the hedges and mow the lawn this weekend",
  "Parking permit renewal form for the fiscal year two thousand twenty six",
  "Volunteer sign up sheet for the community cleanup drive",
  "Lost and found notice for a set of keys near the cafeteria",
  "Menu for the week includes pasta salad grilled chicken and soup",
  "The conference call has been rescheduled to three PM tomorrow",
  "Feedback form for the customer service experience at the retail outlet",
  "House cleaning schedule bathroom on Monday kitchen on Wednesday",
  "Warranty claim for the defective refrigerator purchased last month",
  "Daily horoscope your stars predict good fortune in business ventures today",
  "Attendance register for the workshop on digital marketing strategies",
  "Grocery shopping list cereal pasta sauce canned tomatoes onions garlic",
  "The hiking trail is closed due to recent landslides in the area",
  "Pet vaccination records for the annual veterinary checkup",
  "Bus schedule for route forty two effective from the first of February",
  "Potluck sign up please bring a dessert or a side dish to share",
  "The air conditioning unit in the second floor office needs repair",
  "Fishing license application for the upcoming spring season",
  "Laundry instructions wash on cold cycle and tumble dry on low heat",
  "Library book return reminder your items are due on Friday",
  "The fire drill will be conducted at two PM sharp do not use the elevator",
  "Leave application for three days due to family medical emergency",
  "Complaint about poor maintenance of the dormitory living quarters",
  "I am writing to report a damaged streetlight on Park Avenue",
  "Request for transfer to the branch office located in the northern region",
  "This email is to confirm your dental appointment for next Tuesday",
  "Notice of rent increase effective from the first of April",
  "The annual sports day events include relay races and shot put",
  "Safety guidelines for operating heavy machinery in the warehouse",
  "Please confirm your attendance for the team building event next Friday",
  "Tax return filing instructions for the current assessment year",
];

// ═══════════════════════════════════════════════════════════════════════════════
// TRAIN
// ═══════════════════════════════════════════════════════════════════════════════
console.log("Training NLP classifier...");
console.log(`  Admissions:  ${admissions.length} statements`);
console.log(`  Scholarship: ${scholarship.length} statements`);
console.log(`  Internship:  ${internship.length} statements`);
console.log(`  Other:       ${other.length} statements`);
console.log(`  Total:       ${admissions.length + scholarship.length + internship.length + other.length} statements`);

admissions.forEach((s) => classifier.addDocument(s, "admissions"));
scholarship.forEach((s) => classifier.addDocument(s, "scholarship"));
internship.forEach((s) => classifier.addDocument(s, "internship"));
other.forEach((s) => classifier.addDocument(s, "other"));

classifier.train();

// ═══════════════════════════════════════════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════════════════════════════════════════
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const outputPath = path.join(dataDir, "classifier.json");

classifier.save(outputPath, (err) => {
  if (err) {
    console.error("Failed to save classifier:", err);
    process.exit(1);
  }
  console.log(`\n✅ Classifier saved to ${outputPath}`);

  // Quick test
  console.log("\n── Quick Test ──");
  const tests = [
    "I wish to apply for admission to the engineering program",
    "Application for merit-based scholarship due to financial need",
    "This certifies that the student completed the summer internship",
    "Grocery shopping list for the week",
    "Invoice for office supplies purchased last month",
    "Meeting agenda for the staff meeting on Monday",
    "I want to join your program next year please consider my application",
    "Leave application for three days due to family emergency",
  ];
  tests.forEach((t) => {
    const classifications = classifier.getClassifications(t);
    const sum = classifications.reduce((a, c) => a + c.value, 0);
    const best = classifications[0];
    const pct = ((best.value / sum) * 100).toFixed(1);
    console.log(`  "${t.substring(0, 65)}"`);
    console.log(`    → ${best.label} (${pct}%)`);
    console.log(`    All: ${classifications.map((c) => `${c.label}=${((c.value / sum) * 100).toFixed(1)}%`).join(", ")}`);
    console.log();
  });
});
