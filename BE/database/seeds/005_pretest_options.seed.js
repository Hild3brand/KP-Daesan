export const seedOptions = async (db, questionIds) => {
  const options = [
    [1,'a','ㅓ'],[1,'b','ㅏ'],[1,'c','ㅗ'],[1,'d','ㅜ'],
    [2,'a','ㅏ'],[2,'b','ㅓ'],[2,'c','ㄱ'],[2,'d','ㅗ'],
    [3,'a','ga'],[3,'b','na'],[3,'c','da'],[3,'d','ma'],
    [4,'a','gan'],[4,'b','gak'],[4,'c','gam'],[4,'d','gal'],
    [5,'a','an'],[5,'b','am'],[5,'c','ang'],[5,'d','at'],
    [6,'a','가'],[6,'b','까'],[6,'c','카'],[6,'d','나'],
    [7,'a','가방이에요'],[7,'b','가방 가요'],[7,'c','가방 있어요'],[7,'d','가방 먹어요'],
    [8,'a','이게 뭐예요?'],[8,'b','어디 가요?'],[8,'c','뭐 가요?'],[8,'d','누구 가요?'],
    [9,'a','저는 학생이에요'],[9,'b','저은 학생이에요'],[9,'c','민수은 가수예요'],[9,'d','준는 학교에 가요'],
    [10,'a','가방'],[10,'b','여권'],[10,'c','카메라'],[10,'d','비행기'],
    [11,'a','공항'],[11,'b','학교'],[11,'c','식당'],[11,'d','호텔'],
    [12,'a','가방'],[12,'b','카메라'],[12,'c','여권'],[12,'d','비행기'],
    [13,'a','Where is this place?'],[13,'b','What is this?'],[13,'c','Where are you going?'],[13,'d','Who are you?'],
    [14,'a','That bag (far away)'],[14,'b','That bag (near listener)'],[14,'c','This bag'],[14,'d','My bag'],
    [15,'a','Where is Gyeongbok Palace?'],[15,'b','This is Gyeongbok Palace'],[15,'c','Go to Gyeongbok Palace'],[15,'d','I like Gyeongbok Palace'],
    [16,'a','여기, 저기, 식당'],[16,'b','가방, 카메라, 여권'],[16,'c','식당, 공항, 호텔'],[16,'d','버스, 택시, 기차'],
    [17,'a','위'],[17,'b','가방'],[17,'c','물'],[17,'d','버스'],
    [18,'a','어디에 가요?'],[18,'b','어디에 있어요?'],[18,'c','뭐예요?'],[18,'d','어떻게 가요?'],
    [19,'a','Both mean go home'],[19,'b','Go home vs stay at home'],[19,'c','Question vs answer'],[19,'d','Past vs present'],
    [20,'a','가방이 집에 있어요'],[20,'b','저는 집에 가요'],[20,'c','가방이 책상 위에 있어요'],[20,'d','저는 학생이에요'],
    [21,'a','Same meaning'],[21,'b','Near vs far location'],[21,'c','Object vs place'],[21,'d','Question vs answer'],
    [22,'a','Someone buys a bag'],[22,'b','A bag is located somewhere'],[22,'c','Someone goes somewhere'],[22,'d','A bag is expensive'],
    [23,'a','어디에 있어요?'],[23,'b','뭐예요?'],[23,'c','어떻게 먹어요?'],[23,'d','How do you go there?'],
    [24,'a','Going to Gyeongbokgung by bus'],[24,'b','Eating at Gyeongbokgung'],[24,'c','Asking where Gyeongbokgung is'],[24,'d','Buying a bus'],
    [25,'a','To show place'],[25,'b','To show transportation method'],[25,'c','To show object'],[25,'d','To show time'],
    [26,'a','Location'],[26,'b','Object'],[26,'c','Transportation method'],[26,'d','Time'],
    [27,'a','To ask where something is'],[27,'b','To ask how to go'],[27,'c','To say what something is'],[27,'d','To say transportation method'],
    [28,'a','물 마셔요'],[28,'b','물을 마셔요'],[28,'c','물에 마셔요'],[28,'d','물은 마셔요'],
    [29,'a','싸요'],[29,'b','비싸요'],[29,'c','가까워요'],[29,'d','멀어요'],
    [30,'a','식당이 멀어요'],[30,'b','식당이 비싸요'],[30,'c','식당이 가까워요'],[30,'d','식당이 맛있어요'],
    [31,'a','저는 커피를 마셔요'],[31,'b','저는 커피가 마셔요'],[31,'c','저는 커피에 마셔요'],[31,'d','저는 커피 마셔요'],
    [32,'a','물 두 병 주세요'],[32,'b','물 두 개 주세요'],[32,'c','물 이 병 주세요'],[32,'d','물 두 명 주세요'],
    [33,'a','이거 뭐예요?'],[33,'b','이거 얼마예요?'],[33,'c','이거 어디예요?'],[33,'d','이거 어떻게 가요?'],
    [34,'a','저는 버스를 가요'],[34,'b','저는 버스로 가요'],[34,'c','저는 버스에 가요'],[34,'d','저는 버스가 가요'],
    [35,'a','물 두 병 주세요'],[35,'b','물 두 개 주세요'],[35,'c','물 두 명 가요'],[35,'d','물 두 분 있어요'],
    [36,'a','이거 얼마예요?'],[36,'b','이거 뭐예요?'],[36,'c','이거 어디 가요?'],[36,'d','이거 얼마 가요?'],
  ];

  for (const opt of options) {
    const questionIndex = opt[0] - 1;

    await db.query(
      `INSERT INTO pretest_options 
      (question_id, option_label, option_text)
      VALUES (?, ?, ?)`,
      [questionIds[questionIndex], opt[1], opt[2]]
    );
  }

  console.log("✅ Options seeded");
};