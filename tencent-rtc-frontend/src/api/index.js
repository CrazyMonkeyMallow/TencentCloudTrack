// RIGHT NOW: returns fake data
// LATER: replace with real API calls e.g. fetch("/api/consultations")

export async function getPatientHistory() {
  return [
    {
      id: 1,
      date: "2026-05-14",
      doctor: "Dr. Chen",
      symptoms: "Chest pain, shortness of breath",
      advice: "Rest, avoid strenuous activity. Take prescribed medication.",
    },
    {
      id: 2,
      date: "2026-05-10",
      doctor: "Dr. Wang",
      symptoms: "High fever, headache",
      advice: "Stay hydrated, take paracetamol every 6 hours.",
    },
    {
      id: 3,
      date: "2026-05-02",
      doctor: "Dr. Li",
      symptoms: "Sprained ankle",
      advice: "Ice and elevate for 48 hours. Avoid walking.",
    },
  ];
}

export async function getDoctorHistory() {
  return [
    {
      id: 1,
      date: "2026-05-14",
      patient: "Patient A",
      symptoms: "Chest pain, shortness of breath",
      notes: "Advised rest and medication. Follow up in 3 days.",
    },
    {
      id: 2,
      date: "2026-05-10",
      patient: "Patient B",
      symptoms: "High fever, headache",
      notes: "Prescribed paracetamol. Recommended blood test if fever persists.",
    },
    {
      id: 3,
      date: "2026-05-02",
      patient: "Patient C",
      symptoms: "Sprained ankle",
      notes: "RICE method recommended. X-ray if no improvement in 48h.",
    },
  ];
}