// app.get("/allUsers", async (req, res) => {
//     let tempUsers = [
//         {
//             name: "Rahul Sharma",
//             email: "rahul.sharma@gmail.com",
//             phone: 9876543210,
//             password: "Rahul@123",
//             standard: "12th",
//             marks: "92%",
//             hobbies: "Cricket, Reading"
//         },
//         {
//             name: "Priya Patel",
//             email: "priya.patel@gmail.com",
//             phone: 8765432109,
//             password: "Priya@456",
//             standard: "11th",
//             marks: "88%",
//             hobbies: "Dancing, Painting"
//         },
//         {
//             name: "Amit Desai",
//             email: "amit.desai@yahoo.com",
//             phone: 7654321098,
//             password: "Amit@789",
//             standard: "10th",
//             marks: "95%",
//             hobbies: "Football, Gaming"
//         },
//         {
//             name: "Sneha Kulkarni",
//             email: "sneha.kulkarni@outlook.com",
//             phone: 6543210987,
//             password: "Sneha@321",
//             standard: "12th",
//             marks: "78%",
//             hobbies: "Singing, Cooking"
//         },
//         {
//             name: "Vikram Singh",
//             email: "vikram.singh@gmail.com",
//             phone: 9512367845,
//             password: "Vikram@654",
//             standard: "11th",
//             marks: "85%",
//             hobbies: "Chess, Coding"
//         },
//         {
//             name: "Anjali Mehta",
//             email: "anjali.mehta@gmail.com",
//             phone: 9823456710,
//             password: "Anjali@987",
//             standard: "10th",
//             marks: "90%",
//             hobbies: "Drawing, Swimming"
//         },
//         {
//             name: "Rohan Joshi",
//             email: "rohan.joshi@gmail.com",
//             phone: 7896541230,
//             password: "Rohan@111",
//             standard: "12th",
//             marks: "72%",
//             hobbies: "Basketball, Music"
//         },
//         {
//             name: "Neha Gupta",
//             email: "neha.gupta@outlook.com",
//             phone: 8907654321,
//             password: "Neha@222",
//             standard: "11th",
//             marks: "96%",
//             hobbies: "Reading, Yoga"
//         },
//         {
//             name: "Arjun Nair",
//             email: "arjun.nair@yahoo.com",
//             phone: 9345678901,
//             password: "Arjun@333",
//             standard: "10th",
//             marks: "81%",
//             hobbies: "Cycling, Photography"
//         },
//         {
//             name: "Pooja Verma",
//             email: "pooja.verma@gmail.com",
//             phone: 9012345678,
//             password: "Pooja@444",
//             standard: "12th",
//             marks: "89%",
//             hobbies: "Sketching, Gardening"
//         }
//     ];
//     await UserModel.insertMany(tempUsers);
//     res.send("Data inserted");

// })

// app.get("/insertadmin", async (req, res) => {
//    await AdminModel.insertMany(tempadmin);
//    console.log("Data inserted");
// })


const sampleAdmin = [
   {
      name: "sumedh",
      phone: 1000000000,
      password: "admin",
   },
   {
      name: "vaibhav",
      phone: 1000000000,
      password: "admin",
   }
];

const sampleTestResults = [
   {
      "user": "Sumedh R",
      "Score": "85",
      "career": "Full Stack Developer",
      "skills": "JavaScript, Node.js, Express, MongoDB, HTML, CSS",
      "colleges": "IIT Bombay, COEP Pune, VJTI Mumbai",
      "roadmap": "Learn fundamentals → Build projects → Master MERN stack → Contribute to open source → Apply for internships"
   },
   {
      "user": "Amit Sharma",
      "Score": "78",
      "career": "Data Analyst",
      "skills": "Python, Pandas, SQL, Excel, Power BI",
      "colleges": "Delhi University, IIT Delhi",
      "roadmap": "Learn Python → Master data analysis → Build dashboards → Work on real datasets → Apply for analyst roles"
   },
   {
      "user": "Priya Patel",
      "Score": "90",
      "career": "AI Engineer",
      "skills": "Python, TensorFlow, Machine Learning, Deep Learning",
      "colleges": "IISc Bangalore, IIT Madras",
      "roadmap": "Learn Python → Study ML concepts → Build AI models → Participate in hackathons → Research projects"
   },
   {
      "user": "Rahul Verma",
      "Score": "72",
      "career": "Cyber Security Analyst",
      "skills": "Networking, Ethical Hacking, Linux, Kali Tools",
      "colleges": "NIT Trichy, Amity University",
      "roadmap": "Learn networking → Study security basics → Practice ethical hacking → Get certifications → Apply for jobs"
   },
   {
      "user": "Sneha Iyer",
      "Score": "88",
      "career": "UI/UX Designer",
      "skills": "Figma, Adobe XD, Wireframing, Prototyping",
      "colleges": "NIFT, MIT Institute of Design",
      "roadmap": "Learn design basics → Master tools → Create portfolio → Work on real projects → Apply for design roles"
   },
   {
      "user": "Karan Singh",
      "Score": "81",
      "career": "Software Engineer",
      "skills": "Java, Spring Boot, MySQL, OOP",
      "colleges": "BITS Pilani, IIIT Hyderabad",
      "roadmap": "Learn Java → Master DSA → Build backend apps → Practice coding → Crack interviews"
   },
   {
      "user": "Neha Gupta",
      "Score": "76",
      "career": "Cloud Engineer",
      "skills": "AWS, Docker, Kubernetes, Linux",
      "colleges": "IIT Kanpur, SRM University",
      "roadmap": "Learn cloud basics → Get AWS certification → Practice deployments → Work on cloud projects → Apply for roles"
   },
   {
      "user": "Arjun Mehta",
      "Score": "69",
      "career": "Game Developer",
      "skills": "Unity, C#, Game Design, Animation",
      "colleges": "Arena Animation, IIT Roorkee",
      "roadmap": "Learn game engines → Develop small games → Improve graphics → Publish projects → Join gaming studios"
   },
   {
      "user": "Pooja Desai",
      "Score": "84",
      "career": "Digital Marketer",
      "skills": "SEO, SEM, Social Media Marketing, Google Ads",
      "colleges": "NMIMS, Symbiosis Pune",
      "roadmap": "Learn marketing basics → Master SEO → Run campaigns → Analyze results → Freelance or job"
   },
   {
      "user": "Vikram Joshi",
      "Score": "91",
      "career": "DevOps Engineer",
      "skills": "CI/CD, Jenkins, Docker, Kubernetes, AWS",
      "colleges": "IIT Kharagpur, VNIT Nagpur",
      "roadmap": "Learn DevOps tools → Practice automation → Build pipelines → Work on cloud infra → Apply for DevOps roles"
   }

];

export default { dataAdmin: sampleAdmin, dataTestResult: sampleTestResults };

