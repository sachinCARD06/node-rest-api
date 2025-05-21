const bankAccountsList = [
  {
    accountId: "ACC_102102",
    accountHolderName: "Alice Smith",
    maskedAccountNumber: "XXXXXXXX4321",
    ifscCode: "MOCK0005678",
    accountType: "Current",
    address: {
      line1: "456 Other St",
      line2: "Suite 789",
      line3: null,
      city: "Mumbai",
      stateCode: "MH",
      pinCode: "400001",
      countryCode: "IN",
    },
    email: null,
    gstNumber: "27ZZZCX9876Z1ZZ",
    invalidFields: [
      {
        fieldName: "email",
        value: "alice.invalid",
        reason: "Invalid email format",
      },
    ],
  },
  {
    accountId: "ACC_103103",
    accountHolderName: "Bob Johnson",
    maskedAccountNumber: "XXXXXXXX5678",
    ifscCode: "MOCK0009012",
    accountType: "Savings",
    address: {
      line1: "789 Third St",
      line2: "Floor 10",
      line3: null,
      city: "Delhi",
      stateCode: "DL",
      pinCode: null,
      countryCode: "IN",
    },
    email: "bob.johnson@example.com",
    gstNumber: null,
    invalidFields: [
      {
        fieldName: "gstNumber",
        value: "INVALID-GST",
        reason: "Invalid GST number format",
      },
      {
        fieldName: "address.pinCode",
        value: "00000",
        reason: "Invalid pincode format",
      },
    ],
  },
  {
    accountId: "ACC_101101",
    accountHolderName: "John Doe",
    maskedAccountNumber: "XXXXXXXX7890",
    ifscCode: "MOCK0001234",
    accountType: "Savings",
    address: {
      line1: "123 Main St",
      line2: "Apt 456",
      line3: null,
      city: "Bangalore",
      stateCode: "KA",
      pinCode: "560102",
      countryCode: "IN",
    },
    email: "john.doe@example.com",
    gstNumber: "29AABCZ1234Z1ZZ",
    invalidFields: [],
  },
];

exports.getBankAccounts = async (req, res) => {
  try {
    res.json(bankAccountsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
