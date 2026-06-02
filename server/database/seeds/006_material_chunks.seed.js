export const seedMaterialChunks = async (db) => {
  const chunks = [
    ['L1_C1', 'Vokal Tunggal', 'concept', 'ㅏ (a), ㅑ (ya), ㅓ (eo), ㅕ (yeo), ㅡ (eu), ㅗ (o), ㅛ (yo), ㅜ (u), ㅠ (yu), ㅣ (i)', 'R1'],
    ['L1_C2', 'Vokal Ganda', 'concept', 'ㅐ (ae)=ㅏ+ㅣ, ㅒ (yae)=ㅑ+ㅣ, ㅔ (e)=ㅓ+ㅣ, ㅖ (ye)=ㅕ+ㅣ, ㅢ (eui)=ㅡ+ㅣ, ㅘ (wa)=ㅗ+ㅏ, ㅝ (wo)=ㅜ+ㅓ, ㅟ (wi)=ㅜ+ㅣ, ㅚ (oe/we)=ㅗ+ㅣ, ㅙ (wae)=ㅗ+ㅐ, ㅞ (we)=ㅜ+ㅔ', 'R1'],
    ['L1_C3', 'Konsonan Tunggal', 'concept', 'ㄱ (g/k), ㄴ (n), ㄷ (d/t), ㄹ (r/l), ㅁ (m), ㅂ (b/p), ㅅ (s), ㅇ (silent awal/ng akhir), ㅈ (j), ㅊ (ch), ㅋ (k), ㅌ (t), ㅍ (p), ㅎ (h)', 'R1'],
    ['L1_C4', 'Contoh Baca Konsonan Tunggal', 'example', '가 (ga), 나 (na), 다 (da), 라 (ra/la), 마 (ma), 바 (ba), 사 (sa), 자 (ja)', 'R1'],
    ['L1_C5', 'Konsonan Ganda', 'concept', 'ㄲ (kk), ㄸ (tt), ㅃ (pp), ㅆ (ss), ㅉ (jj); konsonan dibaca lebih kuat/tegang', 'R2'],
    ['L1_C6', 'Contoh Baca Konsonan Ganda', 'example', '끼 (kki), 따 (tta), 빠 (ppa), 씨 (ssi), 짜 (jja)', 'R2'],
    ['L1_C7', 'Batchim Dasar', 'rule', 'ㄱ/ㅋ/ㄲ→k, ㄴ→n, ㄷ/ㅌ/ㅅ/ㅈ/ㅊ/ㅎ→t, ㄹ→l, ㅁ→m, ㅂ/ㅍ→p, ㅇ→ng', 'R2'],
    ['L1_C8', 'Contoh Baca Batchim', 'example', '각 (gak), 안 (an), 닫 (dat), 칼 (kal), 삼 (sam), 밥 (bap), 영 (yeong)', 'R2'],
    ['L1_C9', 'Batchim Ganda', 'rule', 'Batchim ganda dibaca salah satu bunyi utama: 삯 (sak), 많다 (man-ta), 앉다 (an-da), 여덟 (yeo-deol), 핥다 (hal-ta), 값 (gap)', 'R2'],
    ['L1_C10', 'Perubahan Bunyi Liaison', 'rule', '없음→없어 (eop-sseo), 있어→있어 (i-sseo), 입어요→이버요 (i-beo-yo), 먹어요→머거요 (meo-geo-yo)', 'R2'],

    ['L2_C1', 'Perkenalan Diri & Nama', 'concept', '이름 (i-reum) = Nama; 이름이 뭐예요? = Siapa nama kamu?; 제 이름은 ___예요 = Nama saya ___', 'R3'],
    ['L2_C2', 'Pola Noun + 이에요/예요', 'concept', '이에요 / 예요 = adalah; 이에요 setelah konsonan, 예요 setelah vokal', 'R3'],
    ['L2_C3', 'Pola Tanya Benda', 'concept', '이게 뭐예요? = Ini apa?', 'R3'],
    ['L2_C4', 'Partikel Topik 은/는', 'concept', '은 / 는 = penanda topik; 은 setelah konsonan, 는 setelah vokal', 'R3'],
    ['L2_C5', 'Sapaan & Ekspresi Sosial', 'concept', '안녕하세요, 감사합니다, 죄송합니다, 안녕히 가세요', 'R4'],
    ['L2_C6', 'Kosakata Benda Traveling', 'concept', '여권, 캐리어, 카메라, 가방, 공항, 비행기', 'R4'],
    ['L2_C7', 'Kosakata Profesi', 'concept', '가수, 배우, 학생, 경찰, 의사, 선생님', 'R4'],

    ['L3_C1', 'Frasa Bertanya & Respon Dasar', 'concept', '실례하지만, 물어봐도 돼요?, 여기는 어디예요?', 'U1'],
    ['L3_C2', 'Kata Tunjuk Benda (이/그/저)', 'concept', '이 = ini, 그 = itu dekat pendengar, 저 = itu jauh', 'U1'],
    ['L3_C3', 'Kata Tunjuk Tempat (여기/거기/저기)', 'concept', '여기 = di sini, 거기 = di situ, 저기 = di sana', 'U2'],
    ['L3_C4', 'Arah Lokasi (쪽)', 'concept', '이쪽, 그쪽, 저쪽', 'U2'],
    ['L3_C5', 'Pola Tempat -에 가요', 'concept', '-에 가요 = pergi ke', 'U3'],

    ['L4_C1', 'Pola Lokasi -에 있어요', 'concept', '-에 있어요 = berada di', 'U3'],
    ['L4_C2', 'Kosakata Posisi', 'concept', '위, 아래, 앞, 뒤, 옆, 사이, 안, 밖', 'U4'],
    ['L4_C3', 'Pola Tanya Transportasi', 'concept', '어떻게 가요? = Pergi naik apa?', 'U4'],
    ['L4_C4', 'Kosakata Transportasi', 'concept', '지하철, 버스, 택시, 기차, 자동차', 'U5'],
    ['L4_C5', 'Pola (으)로 가요', 'concept', '-(으)로 가요 = pergi menggunakan', 'U5'],

    ['L5_C1', 'Kata benda umum', 'concept', '밥, 물, 커피, 식당, 카페, 호텔, 버스, 가방', 'A1'],
    ['L5_C2', 'Partikel Objek 을/를', 'rule', '을/를 = partikel objek', 'A1'],
    ['L5_C3', 'Kata sifat', 'concept', '맛있어요, 비싸요, 싸요, 가까워요, 멀어요', 'A1'],
    ['L5_C4', 'Kata kerja', 'concept', '가요, 와요, 봐요, 먹어요, 사요, 마셔요', 'A2'],
    ['L5_C5', 'Pola kalimat sederhana', 'rule', 'S + O + V dan N + 이/가 + Kata Sifat', 'A2'],

    ['L6_C1', 'Angka Sino', 'concept', '공, 일, 이, 삼, 사, 오, 육, 칠, 팔, 구', 'A2'],
    ['L6_C2', 'Frasa menanyakan harga', 'concept', '이거 얼마예요?', 'A2'],
    ['L6_C3', 'Angka Native', 'concept', '하나, 둘, 셋, 넷, 다섯', 'A3'],
    ['L6_C4', 'Kata satuan', 'concept', '개, 명/분, 병, 잔, 인분', 'A3'],
    ['L6_C5', 'Frasa membeli barang', 'example', '하나 주세요, 몇 명이에요?', 'A3'],
    ['L6_C6', 'Latihan dialog membeli barang', 'exercise', '이거 얼마예요? 이거 하나 주세요 감사합니다', 'A3'],
  ];

  for (const chunk of chunks) {
    await db.query(
      `
      INSERT INTO material_chunks
      (code, name, type, content, stage_code)
      VALUES (?, ?, ?, ?, ?)
      `,
      [chunk[0], chunk[1], chunk[2], chunk[3], chunk[4]]
    );
  }

  console.log("✅ Material chunks seeded");
};