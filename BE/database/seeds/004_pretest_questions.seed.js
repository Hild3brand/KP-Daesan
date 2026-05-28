export const seedQuestions = async (db) => {
  const questions = [
    ['R1',1,'Which letter sounds like "a"?','b','Able to recognize basic vowel sounds','Not yet mastering basic vowels'],
    ['R1',2,'Which one is a consonant?','c','Able to distinguish consonant vs vowel','Confused between vowel and consonant'],
    ['R1',3,'What is the correct reading of 가?','a','Recognizes simple syllable combination','Not yet recognizing consonant + vowel combination'],
    ['R2',4,'What is the reading of 각?','b','Understands basic batchim sound (ㄱ → k)','Not yet mastering final consonant (batchim)'],
    ['R2',5,'What is the reading of 안?','a','Can recall nasal ending sound (ㄴ → n)','Confused with final consonant sounds'],
    ['R2',6,'Which one is read “kka”?','b','Understands double consonant pronunciation','Cannot distinguish tense consonants'],
    ['R3',7,'Which sentence means “This is a bag”?','a','Recognizes basic sentence pattern “N + 이에요”','Does not understand basic grammar structure'],
    ['R3',8,'Which is the correct question for “What is this?”','a','Recognizes object question pattern','Cannot identify correct question form'],
    ['R3',9,'Which sentence uses 은/는 particle correctly?','a','Understands topic particle 은/는 usage','Does not understand sentence structure'],
    ['R4',10,'What is “passport” in Korean?','b','Can recall travel vocabulary','Weak vocabulary memory'],
    ['R4',11,'What is “airport” in Korean?','a','Understands common travel places','Limited vocabulary for places'],
    ['R4',12,'What is “camera” in Korean?','b','Able to retrieve object vocabulary','Confused between object vocabulary'],
    ['U1',13,'“실례지만, 여기는 어디예요?”','a','Can understand a simple polite question','Does not understand basic question meaning'],
    ['U1',14,'“이 가방” means?','c','Understands basic demonstratives (이/그/저)','Confused between “this / that”'],
    ['U1',15,'“여기는 경복궁이에요”','b','Can understand simple location statements','Cannot interpret sentence meaning'],
    ['U2',16,'Which group contains ONLY places (장소)?','c','Can group vocabulary by category','Cannot distinguish place vs object'],
    ['U2',17,'Which word is a position word (위치 표현)?','a','Recognizes position vocabulary','Cannot categorize function of words'],
    ['U2',18,'Which sentence is used to ASK location?','b','Can classify sentence function (location vs movement)','Confused between similar question types'],
    ['U3',19,'Difference between “집에 가요” vs “집에 있어요”','b','Can distinguish movement vs location','Cannot differentiate verb meaning'],
    ['U3',20,'Which sentence shows MOVEMENT?','b','Can distinguish movement vs non-movement','Confused between verb usage'],
    ['U3',21,'Difference between “여기” and “저기”','b','Understands spatial difference','Cannot distinguish distance reference'],
    ['U4',22,'Main idea: “가방이 책상 위에 있어요”','b','Can understand main idea of a sentence','Focuses on wrong meaning'],
    ['U4',23,'Same meaning: “어떻게 가요?”','d','Can restate meaning clearly','Cannot recognize equivalent meaning'],
    ['U4',24,'Summary: “경복궁에 버스로 가요”','a','Can extract the main idea of a short sentence','Cannot identify the core meaning'],
    ['U5',25,'Why use “(으)로 가요” in “버스로 가요”?','b','Can explain grammar function','Does not understand purpose of expression'],
    ['U5',26,'“지하철로 가요” describes?','c','Can describe meaning of the sentence','Cannot identify function'],
    ['U5',27,'Why use “어디에 있어요?”','a','Can explain the function of a location question','Does not understand the purpose'],
    ['A1',28,'Which sentence uses particle correctly?','b','Understands correct use of object particle 을/를','Confused between particles'],
    ['A1',29,'Coffee is expensive. What do you say?','b','Able to apply adjective based on real situation','Cannot match adjective with situation'],
    ['A1',30,'Which sentence means “The restaurant is near”?','c','Understands adjective usage','Cannot distinguish similar adjectives'],
    ['A2',31,'I drink coffee.','a','Able to apply S + O + V with correct particle','Confused between particles'],
    ['A2',32,'Buying 2 bottles of water.','a','Able to apply number + counter correctly','Cannot match correct counter'],
    ['A2',33,'How much is this?','b','Able to choose correct expression','Confused between question types'],
    ['A3',34,'Which sentence is CORRECT?','b','Able to identify correct particle usage','Cannot distinguish grammatical roles'],
    ['A3',35,'Fix: 물 두 명 주세요','a','Able to correct wrong counter usage','Does not understand object-counter pairing'],
    ['A3',36,'Best correction: 이거 얼마 가요?','a','Able to fix incorrect verb usage','Cannot identify incorrect structure']
  ];

  const insertedIds = [];

  for (const q of questions) {
    const [result] = await db.query(
      `INSERT INTO pretest_questions 
      (stage_code, question_number, question_text, correct_answer, error_correct, error_wrong)
      VALUES (?, ?, ?, ?, ?, ?)`,
      q
    );

    insertedIds.push(result.insertId);
  }

  return insertedIds;
};