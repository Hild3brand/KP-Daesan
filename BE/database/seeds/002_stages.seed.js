export default async (db) => {
  const stages = [
    {
      stage_code: "R1",
      stage_name: "Recognition",
      skill_name: "Remember",
      focus_area: "Peserta didik mampu mengenali kosakata, bentuk tata bahasa, atau ekspresi yang pernah dipelajari sebelumnya ketika melihatnya."
    },
    {
      stage_code: "R2",
      stage_name: "Recall",
      skill_name: "Remember",
      focus_area: "Peserta didik mampu mengingat kembali kosakata atau informasi dasar dari memori tanpa bantuan konteks tambahan."
    },
    {
      stage_code: "R3",
      stage_name: "Grammar Identification",
      skill_name: "Remember",
      focus_area: "Peserta didik mampu mengidentifikasi pola atau struktur tata bahasa dasar yang terdapat dalam sebuah kalimat."
    },
    {
      stage_code: "R4",
      stage_name: "Vocabulary Retrieval",
      skill_name: "Remember",
      focus_area: "Peserta didik mampu mengambil kembali kosakata atau ekspresi yang tepat dari memori ketika diberikan petunjuk sederhana atau terjemahan."
    },
    {
      stage_code: "U1",
      stage_name: "Interpretation",
      skill_name: "Understand",
      focus_area: "Peserta didik mampu menafsirkan makna kata atau kalimat dalam konteks yang sederhana."
    },
    {
      stage_code: "U2",
      stage_name: "Classification",
      skill_name: "Understand",
      focus_area: "Peserta didik mampu mengelompokkan kosakata atau tata bahasa berdasarkan fungsi atau jenisnya."
    },
    {
      stage_code: "U3",
      stage_name: "Comparison",
      skill_name: "Understand",
      focus_area: "Peserta didik mampu membandingkan dua kosakata, pola tata bahasa, atau ekspresi dan mengenali perbedaannya."
    },
    {
      stage_code: "U4",
      stage_name: "Summarization",
      skill_name: "Understand",
      focus_area: "Peserta didik mampu merangkum ide utama dari kalimat pendek atau teks sederhana."
    },
    {
      stage_code: "U5",
      stage_name: "Explanation",
      skill_name: "Understand",
      focus_area: "Peserta didik mampu menjelaskan makna atau fungsi suatu kosakata atau aturan tata bahasa berdasarkan pemahamannya sendiri."
    },
    {
      stage_code: "A1",
      stage_name: "Guided Sentence",
      skill_name: "Apply",
      focus_area: "Peserta didik mampu menyusun kalimat menggunakan kosakata atau tata bahasa yang diberikan dengan bantuan atau panduan."
    },
    {
      stage_code: "A2",
      stage_name: "Contextual Usage",
      skill_name: "Apply",
      focus_area: "Peserta didik mampu menggunakan kosakata atau tata bahasa secara tepat dalam situasi atau konteks tertentu."
    },
    {
      stage_code: "A3",
      stage_name: "Language Problem Solving",
      skill_name: "Apply",
      focus_area: "Peserta didik mampu menyelesaikan tugas bahasa sederhana dengan menerapkan kosakata dan tata bahasa yang telah dipelajari untuk menghasilkan ekspresi yang benar."
    }
  ];

  for (const s of stages) {
    await db.query(
      `INSERT INTO stages 
      (stage_code, stage_name, skill_name, focus_area)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE stage_name = stage_name`,
      [s.stage_code, s.stage_name, s.skill_name, s.focus_area]
    );
  }

  console.log("Stages seeded");
};