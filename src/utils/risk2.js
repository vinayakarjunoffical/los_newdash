

export const riskData = [
  {
    id: 1,
    application_id: "APP-1001",
    name: "Rahul Sharma",
    phone_number: "9876543210",
    email: "rahul.sharma1@example.com",
    user_type: "customer",
    business_type: "-",
    loanType: "Personal Loan",
    amountApplied: 200000,
    tenureMonths: 48,
    incomeMonthly: 50000,
    fixedObligationsMonthly: 25000,
    application_date: "2025-08-01",
    fi_date: "2025-08-05",
    credit_date: "2025-08-08",
    pdi_date: "2025-08-12",
    status: {
      application: "approved",
      fi: "approved",
      credit: "pending",
      pdi: "pending"
    },
    employment: {
      type: "Salaried",
      company: "Tech Mahindra",
      experienceYears: 5,
    },
    loginData: {
      personalDetails: {
        fullName: "Rahul Sharma",
        mobileNumber: "9876543210",
        emailAddress: "rahul.sharma@example.com"
      },
      addressInformation: {
        currentAddress: "123 MG Road, Mumbai",
        permanentAddress: "123 MG Road, Mumbai",
     
      },
      bankDetails: {
        personal: {
          ifscCode: "HDFC0001234",
          bankName: "HDFC Bank",
          accountNumber: "1234567890",
          accountHolderName: "Rahul Sharma"
        },
        company: {
          ifscCode: "HDFC0005678",
          bankName: "HDFC Bank",
          accountNumber: "9876543210",
          accountHolderName: "Rahul Enterprises"
        }
      },
      documentsInfo: {
        aadhaar_card: { holderName: "Rahul Sharma", aadhaarNumber: "1234 5678 9012" },
        pan_card: { holderName: "Rahul Sharma", panNumber: "ABCDE1234F" },
        shop_licence: { licenceNumber: "LIC1234567" },
        bank_statement: { accountHolder: "Rahul Sharma" },
        bank_passbook: { accountHolder: "Rahul Sharma" }
      }
    },
    fiData: {
      applicationId: "APP-1001",
      name: "Rahul Sharma",
      loanType: "Personal Loan",
      fiDate: "2025-08-05",
      investigationEmployee: { id: 101, name: "Sunita Joshi" },
      location: { latitude: 19.0760, longitude: 72.8777 },
      documents: [
        { name: "PAN", status: "verified" },
        { name: "Aadhaar", status: "verified" },
        { name: "Bank Statement", status: "pending" }
      ],
      questionsAndAnswers: [
        { id: 1, question: "Is the shop physically verified?", required: true, length: 50, supportedDocument: "Shop License", answer: "Yes", uploadedDocument: "shop_license_rahul.pdf" },
        { id: 2, question: "Does the customer have a valid ID proof?", required: true, length: 20, answer: "Yes", uploadedDocument: "aadhaar_rahul.pdf" }
      ]
    },
    pdiData: {
      applicationId: "APP-1001",
      name: "Rahul Sharma",
      userType: "customer",
      email: "rahul.sharma@example.com",
      phone: "9876543210",
      address: "Mumbai, India",
      questions: [
        { qid: 1, question: "Is the shop physically verified?", required: true, length: 50, supportedDocument: "Shop License", answer: "Yes", uploadedDocument: "shop_license_rahul.pdf" },
        { qid: 2, question: "Does the customer have a valid ID proof?", required: true, length: 20, answer: "Yes", uploadedDocument: "id_proof_rahul.pdf" }
      ]
    },
    credit: {
    id: 1,
    applicationId: "APP-2024-00087",
    userType: "customer",
    name: "Amit Sharma",
    loanType: "Personal Loan",
    amountApplied: 500000,
    tenureMonths: 48,
    incomeMonthly: 75000,
    fixedObligationsMonthly: 25000,
    applicationDate: "2024-08-01",
    fiDate: "2024-08-05",
    creditAnalysisDate: "2024-08-08",
    creditAnalysisStatus: "verified",
    employment: {
      type: "Salaried",
      company: "Tech Mahindra",
      experienceYears: 5,
    },
    bankAccounts: [
      {
        bankName: "SBI",
        accountNumber: "XXXXXXXX1234",
        ifscCode: "SBIN0000456",
        branchCode: "0456",
        branchName: "Mumbai Main Branch",
        accountType: "Salary",
        currentBalance: 60000,
        avgBalance: 50000,
        avgInflow: 80000,
        avgOutflow: 70000,
        redFlags: [],
      },
    ],
    cibil: {
      score: 720,
      utilization: 32,
      onTimeEMIRatio: 95,
    },
    bureau: {
      historyYears: 6,
      activeLines: [
        {
          type: "Credit Card",
          organization: "SBI",
          limit: 150000,
          balance: 45000,
          status: "Active",
          dpd: 0,
          emiHistory: [
            { month: "2024-01", emiAmount: 5000, paidOnTime: true },
            { month: "2024-02", emiAmount: 5000, paidOnTime: true },
            {
              month: "2024-03",
              emiAmount: 5000,
              paidOnTime: false,
              delayDays: 5,
            },
            { month: "2024-04", emiAmount: 5000, paidOnTime: true },
            { month: "2024-05", emiAmount: 5000, paidOnTime: true },
            { month: "2024-06", emiAmount: 5000, paidOnTime: true },
            {
              month: "2024-07",
              emiAmount: 5000,
              paidOnTime: false,
              delayDays: 8,
            },
            { month: "2024-08", emiAmount: 5000, paidOnTime: true },
            { month: "2024-09", emiAmount: 5000, paidOnTime: true },
            { month: "2024-10", emiAmount: 5000, paidOnTime: true },
            { month: "2024-11", emiAmount: 5000, paidOnTime: true },
            { month: "2024-12", emiAmount: 5000, paidOnTime: true },
            { month: "2025-01", emiAmount: 5000, paidOnTime: true },
            { month: "2025-02", emiAmount: 5000, paidOnTime: true },
            { month: "2025-03", emiAmount: 5000, paidOnTime: true },
            {
              month: "2025-04",
              emiAmount: 5000,
              paidOnTime: false,
              delayDays: 12,
            },
            { month: "2025-05", emiAmount: 5000, paidOnTime: true },
            { month: "2025-06", emiAmount: 5000, paidOnTime: true },
            { month: "2025-07", emiAmount: 5000, paidOnTime: true },
            { month: "2025-08", emiAmount: 5000, paidOnTime: true },
          ],
        },
        {
          type: "Two-Wheeler Loan",
          organization: "Bajaj Fin",
          limit: 0,
          balance: 80000,
          status: "Active",
          dpd: 2,
          emiHistory: [
            { month: "2024-01", emiAmount: 3000, paidOnTime: true },
            { month: "2024-02", emiAmount: 3000, paidOnTime: true },
            {
              month: "2024-03",
              emiAmount: 3000,
              paidOnTime: false,
              delayDays: 5,
            },
            { month: "2024-04", emiAmount: 3000, paidOnTime: true },
            { month: "2024-05", emiAmount: 3000, paidOnTime: true },
            { month: "2024-06", emiAmount: 3000, paidOnTime: true },
            {
              month: "2024-07",
              emiAmount: 3000,
              paidOnTime: false,
              delayDays: 8,
            },
            { month: "2024-08", emiAmount: 3000, paidOnTime: true },
            { month: "2024-09", emiAmount: 3000, paidOnTime: true },
            { month: "2024-10", emiAmount: 3000, paidOnTime: true },
            { month: "2024-11", emiAmount: 3000, paidOnTime: true },
            { month: "2024-12", emiAmount: 3000, paidOnTime: true },
            { month: "2025-01", emiAmount: 3000, paidOnTime: true },
            { month: "2025-02", emiAmount: 3000, paidOnTime: true },
            { month: "2025-03", emiAmount: 3000, paidOnTime: true },
            {
              month: "2025-04",
              emiAmount: 3000,
              paidOnTime: false,
              delayDays: 12,
            },
            { month: "2025-05", emiAmount: 3000, paidOnTime: true },
            { month: "2025-06", emiAmount: 3000, paidOnTime: true },
            { month: "2025-07", emiAmount: 3000, paidOnTime: true },
            { month: "2025-08", emiAmount: 3000, paidOnTime: true },
          ],
        },
      ],
      delinquencies: 0,
      inquiriesLast6m: 3,
    },
    documents: [
      { name: "PAN", status: "verified" },
      { name: "Aadhaar", status: "verified" },
      { name: "Salary Slip (3M)", status: "pending" },
      { name: "Bank Statement (6M)", status: "verified" },
    ],
  },
  },
  {
    id: 2,
    application_id: "APP-1002",
    name: "Neha Verma",
    phone_number: "9988776655",
    email: "neha.verma@example.com",
    user_type: "retailer",
    business_type: "proprietorship",
    loanType: "Personal Loan",
    amountApplied: 500000,
    tenureMonths: 48,
    incomeMonthly: 75000,
    fixedObligationsMonthly: 25000,
    application_date: "2025-08-03",
    fi_date: "2025-08-07",
    credit_date: "2025-08-10",
    pdi_date: "2025-08-15",
    status: {
      application: "approved",
      fi: "rejected",
      credit: "pending",
      pdi: "pending"
    },
    employment: {
      type: "Salaried",
      company: "Tech Mahindra",
      experienceYears: 5,
    },
    loginData: {
      personalDetails: {
        fullName: "Neha Verma",
        mobileNumber: "9988776655",
        emailAddress: "neha.verma@example.com"
      },
      addressInformation: {
        currentAddress: "456 MG Road, Bangalore",
        permanentAddress: "456 MG Road, Bangalore",
      },
      bankDetails: {
        personal: {
          ifscCode: "HDFC0002345",
          bankName: "HDFC Bank",
          accountNumber: "2345678901",
          accountHolderName: "Neha Verma"
        },
        company: {
          ifscCode: "HDFC0006789",
          bankName: "HDFC Bank",
          accountNumber: "9876543211",
          accountHolderName: "Neha Enterprises"
        }
      },
      documentsInfo: {
        aadhaar_card: { holderName: "Neha Verma", aadhaarNumber: "2345 6789 0123" },
        pan_card: { holderName: "Neha Verma", panNumber: "BCDEF2345G" },
        shop_licence: { licenceNumber: "LIC2345678" }
      }
    },
    fiData: {
      applicationId: "APP-1002",
      name: "Neha Verma",
      loanType: "Business Loan",
      fiDate: "2025-08-07",
      investigationEmployee: { id: 102, name: "Rohit Jain" },
      location: { latitude: 28.6139, longitude: 77.2090 },
      documents: [
        { name: "PAN", status: "verified" },
        { name: "Aadhaar", status: "verified" },
        { name: "Bank Statement", status: "pending" }
      ],
      questionsAndAnswers: [
        { id: 1, question: "Is the shop physically verified?", required: true, length: 50, supportedDocument: "Shop License", answer: "Yes", uploadedDocument: "shop_license_neha.pdf" },
        { id: 2, question: "Does the customer have a valid ID proof?", required: true, length: 20, answer: "Yes", uploadedDocument: "aadhaar_neha.pdf" }
      ]
    },
    pdiData: {
      applicationId: "APP-1002",
      name: "Neha Verma",
      userType: "retailer",
      email: "neha.verma@example.com",
      phone: "9988776655",
      address: "Bangalore, India",
      questions: [
        { qid: 1, question: "Is the shop physically verified?", required: true, length: 50, supportedDocument: "Shop License", answer: "Yes", uploadedDocument: "shop_license_neha.pdf" },
        { qid: 2, question: "Does the customer have a valid ID proof?", required: true, length: 20, answer: "Yes", uploadedDocument: "id_proof_neha.pdf" },
        { qid: 3, question: "Has the income proof document been collected?", required: false, length: 100, supportedDocument: "Salary Slip", answer: "No", uploadedDocument: null }
      ]
    }
  },
  {
    id: 3,
    application_id: "APP-1003",
    name: "Amit Patel",
    phone_number: "9123456789",
    email: "amit.patel@example.com",
    user_type: "retailer",
    business_type: "private-limited",
    loanType: "Business Loan",
    amountApplied: 1500000,
    tenureMonths: 48,
    incomeMonthly: 175000,
    fixedObligationsMonthly: 55000,
    application_date: "2025-08-10",
    fi_date: "2025-08-14",
    credit_date: "2025-08-18",
    pdi_date: "2025-08-22",
    status: {
      application: "approved",
      fi: "approved",
      credit: "approved",
      pdi: "approved"
    },
    employment: {
      type: "Salaried",
      company: "Tech Mahindra",
      experienceYears: 5,
    },
    loginData: {
      personalDetails: {
        fullName: "Amit Patel",
        mobileNumber: "9123456789",
        emailAddress: "amit.patel@example.com"
      },
      addressInformation: {
        currentAddress: "789 MG Road, Pune",
        permanentAddress: "789 MG Road, Pune",
      },
      bankDetails: {
        personal: {
          ifscCode: "HDFC0003456",
          bankName: "HDFC Bank",
          accountNumber: "3456789012",
          accountHolderName: "Amit Patel"
        },
        company: {
          ifscCode: "HDFC0007890",
          bankName: "HDFC Bank",
          accountNumber: "9876543212",
          accountHolderName: "Amit Enterprises"
        }
      },
      documentsInfo: {
        aadhaar_card: { holderName: "Amit Patel", aadhaarNumber: "3456 7890 1234" },
        pan_card: { holderName: "Amit Patel", panNumber: "CDEFG3456H" },
        shop_licence: { licenceNumber: "LIC3456789" }
      }
    },
    fiData: {
      applicationId: "APP-1003",
      name: "Amit Patel",
      loanType: "Home Loan",
      fiDate: "2025-08-14",
      investigationEmployee: { id: 103, name: "Sunil Mehta" },
      location: { latitude: 18.5204, longitude: 73.8567 },
      documents: [
        { name: "PAN", status: "verified" },
        { name: "Aadhaar", status: "verified" },
        { name: "Bank Statement", status: "verified" }
      ],
      questionsAndAnswers: [
        { id: 1, question: "Is the shop physically verified?", required: true, length: 50, supportedDocument: "Shop License", answer: "Yes", uploadedDocument: "shop_license_amit.pdf" },
        { id: 2, question: "Does the customer have a valid ID proof?", required: true, length: 20, answer: "Yes", uploadedDocument: "aadhaar_amit.pdf" }
      ]
    },
    pdiData: {
      applicationId: "APP-1003",
      name: "Amit Patel",
      userType: "retailer",
      email: "amit.patel@example.com",
      phone: "9123456789",
      address: "Pune, India",
      questions: [
        { qid: 1, question: "Is the shop physically verified?", required: true, length: 50, supportedDocument: "Shop License", answer: "Yes", uploadedDocument: "shop_license_amit.pdf" },
        { qid: 2, question: "Does the customer have a valid ID proof?", required: true, length: 20, answer: "Yes", uploadedDocument: "id_proof_amit.pdf" }
      ]
    }
  },
  {
    id: 4,
    application_id: "APP-1004",
    name: "Sneha Kapoor",
    phone_number: "9811122233",
    email: "sneha.kapoor@example.com",
    user_type: "customer",
    business_type: "-",
    loanType: "Personal Loan",
    amountApplied: 300000,
    tenureMonths: 24,
    incomeMonthly: 55000,
    fixedObligationsMonthly: 25000,
    application_date: "2025-08-12",
    fi_date: "2025-08-16",
    credit_date: "2025-08-20",
    pdi_date: "2025-08-25",
    status: {
      application: "pending",
      fi: "pending",
      credit: "pending",
      pdi: "pending"
    },
    employment: {
      type: "Salaried",
      company: "Tech Mahindra",
      experienceYears: 5,
    },
    loginData: {
      personalDetails: {
        fullName: "Sneha Kapoor",
        mobileNumber: "9811122233",
        emailAddress: "sneha.kapoor@example.com"
      },
      addressInformation: {
        currentAddress: "101 MG Road, Delhi",
        permanentAddress: "101 MG Road, Delhi",
      },
      bankDetails: {
        personal: {
          ifscCode: "HDFC0004567",
          bankName: "HDFC Bank",
          accountNumber: "4567890123",
          accountHolderName: "Sneha Kapoor"
        },
        company: {
          ifscCode: "HDFC0008901",
          bankName: "HDFC Bank",
          accountNumber: "9876543213",
          accountHolderName: "Sneha Enterprises"
        }
      },
      documentsInfo: {
        aadhaar_card: { holderName: "Sneha Kapoor", aadhaarNumber: "4567 8901 2345" },
        pan_card: { holderName: "Sneha Kapoor", panNumber: "DEFGH4567I" },
        shop_licence: { licenceNumber: "LIC4567890" }
      }
    },
    fiData: {
      applicationId: "APP-1004",
      name: "Sneha Kapoor",
      loanType: "Personal Loan",
      fiDate: "2025-08-16",
      investigationEmployee: { id: 104, name: "Anil Kumar" },
      location: { latitude: 28.7041, longitude: 77.1025 },
      documents: [
        { name: "PAN", status: "pending" },
        { name: "Aadhaar", status: "pending" },
        { name: "Bank Statement", status: "pending" }
      ],
      questionsAndAnswers: [
        { id: 1, question: "Is the shop physically verified?", required: true, length: 50, supportedDocument: "Shop License", answer: "No", uploadedDocument: null },
        { id: 2, question: "Does the customer have a valid ID proof?", required: true, length: 20, answer: "No", uploadedDocument: null }
      ]
    },
    pdiData: {
      applicationId: "APP-1004",
      name: "Sneha Kapoor",
      userType: "customer",
      email: "sneha.kapoor@example.com",
      phone: "9811122233",
      address: "Delhi, India",
      questions: [
        { qid: 1, question: "Is the shop physically verified?", required: true, length: 50, supportedDocument: "Shop License", answer: "No", uploadedDocument: null },
        { qid: 2, question: "Does the customer have a valid ID proof?", required: true, length: 20, answer: "No", uploadedDocument: null }
      ]
    }
  }
]
