const axios = require('axios');

async function test() {
  try {
    const res = await axios.post("http://localhost:5000/career-predict", {
      programming: 5,
      algorithms: 4,
      os_networks: 3,
      dbms: 4,
      oop: 4,
      computer_architecture: 4,
      software_engineering: 3,
      cyber_security: 2,
      machine_learning: 5,
      cloud_computing: 4,
      compiler_design: 4,
      computer_graphics: 2
    });
    console.log("career-predict OK", res.data);
  } catch (err) {
    console.error("career-predict ERROR", err.response ? err.response.data : err.message);
  }
}

test();
