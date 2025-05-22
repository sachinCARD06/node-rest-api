const stateCodeList = {
  content: {
    stateDetails: [
      {
        stateCode: "AN",
        stateName: "Andaman and Nicobar Islands",
      },
      {
        stateCode: "AP",
        stateName: "Andhra Pradesh",
      },
      {
        stateCode: "AR",
        stateName: "Arunachal Pradesh",
      },
      {
        stateCode: "AS",
        stateName: "Assam",
      },
      {
        stateCode: "BR",
        stateName: "Bihar",
      },
      {
        stateCode: "CH",
        stateName: "Chandigarh",
      },
      {
        stateCode: "CT",
        stateName: "Chhattisgarh",
      },
      {
        stateCode: "DD",
        stateName: "Dadra and Nagar Haveli and Daman and Diu",
      },
      {
        stateCode: "DL",
        stateName: "Delhi",
      },
      {
        stateCode: "GA",
        stateName: "Goa",
      },
      {
        stateCode: "GJ",
        stateName: "Gujarat",
      },
      {
        stateCode: "HR",
        stateName: "Haryana",
      },
      {
        stateCode: "HP",
        stateName: "Himachal Pradesh",
      },
      {
        stateCode: "JK",
        stateName: "Jammu and Kashmir",
      },
      {
        stateCode: "JH",
        stateName: "Jharkhand",
      },
      {
        stateCode: "KA",
        stateName: "Karnataka",
      },
      {
        stateCode: "KL",
        stateName: "Kerala",
      },
      {
        stateCode: "LA",
        stateName: "Ladakh",
      },
      {
        stateCode: "LD",
        stateName: "Lakshadweep",
      },
      {
        stateCode: "MP",
        stateName: "Madhya Pradesh",
      },
      {
        stateCode: "MH",
        stateName: "Maharashtra",
      },
      {
        stateCode: "MN",
        stateName: "Manipur",
      },
      {
        stateCode: "ML",
        stateName: "Meghalaya",
      },
      {
        stateCode: "MZ",
        stateName: "Mizoram",
      },
      {
        stateCode: "NL",
        stateName: "Nagaland",
      },
      {
        stateCode: "OD",
        stateName: "Odisha",
      },
      {
        stateCode: "PY",
        stateName: "Puducherry",
      },
      {
        stateCode: "PB",
        stateName: "Punjab",
      },
      {
        stateCode: "RJ",
        stateName: "Rajasthan",
      },
      {
        stateCode: "SK",
        stateName: "Sikkim",
      },
      {
        stateCode: "TN",
        stateName: "Tamil Nadu",
      },
      {
        stateCode: "TG",
        stateName: "Telangana",
      },
      {
        stateCode: "TR",
        stateName: "Tripura",
      },
      {
        stateCode: "UP",
        stateName: "Uttar Pradesh",
      },
      {
        stateCode: "UK",
        stateName: "Uttarakhand",
      },
      {
        stateCode: "WB",
        stateName: "West Bengal",
      },
    ],
  },
};

exports.getStateCodeList = async (req, res) => {
  try {
    res.status(200).json(stateCodeList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
