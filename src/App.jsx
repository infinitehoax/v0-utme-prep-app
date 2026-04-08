import { useState, useEffect } from "react";
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { supabase } from "./supabaseClient";
import "./App.css";

// Your Quiz Data
const allQuizData = [
  { id: 1, question: "Who is the author of 'The Lekki Headmaster'?", options: ["A) Wole Soyinka", "B) Kabir Alabi Garba", "C) Chinua Achebe", "D) Akeem Lasisi"], answer: 1 },
  { id: 2, question: "What is the full name of the protagonist?", options: ["A) Jeremi Amos", "B) Mr. Ope Wande", "C) Adebepo Adewale", "D) Funso Daniels"], answer: 2 },
  { id: 3, question: "What nickname do the students affectionately call the principal?", options: ["A) Oga Tisa", "B) Principoo", "C) Lekki Boss", "D) Mr. Wala"], answer: 1 },
  { id: 4, question: "Why was Bepo given the nickname 'The Lekki Headmaster'?", options: ["A) Because he lived in Lekki.", "B) He mimicked King Oloja from the Village Headmaster TV series.", "C) He was the oldest staff member.", "D) He had a large, bald head."], answer: 1 },
  { id: 5, question: "Who was the first person to speak to Bepo when he started weeping on the assembly ground?", options: ["A) Mrs. Ibidun Gloss", "B) Mr. Audu", "C) Mrs. Grace Apeh", "D) Nurse Titi"], answer: 2 },
  { id: 6, question: "Which student gave a speech about the excursion to Jos just before Bepo cried?", options: ["A) Ikenna Egbu", "B) Tosh Ogba", "C) Banky", "D) Bibi Ladele"], answer: 0 },
  { id: 7, question: "What is the strict penalty for a teacher at Stardom if a student scores F9 in WASSCE?", options: ["A) Salary deduction", "B) Demotion to Stardom Hub", "C) Immediate sack", "D) Three months suspension without pay"], answer: 2 },
  { id: 8, question: "Who is the Managing Director of Stardom Schools?", options: ["A) Chief Mrs. Solape Bayo", "B) Mrs. Ibidun Gloss", "C) Mrs. Grace Apeh", "D) Mrs. Mary Ladele"], answer: 1 },
  { id: 9, question: "What is Bepo's wife's name?", options: ["A) Seri", "B) Ibidun", "C) Sola", "D) Titi"], answer: 0 },
  { id: 10, question: "Where does Bepo's wife work, and what is her profession?", options: ["A) Canada / Tailor", "B) USA / Doctor", "C) UK / Nurse", "D) Manchester / Home Economics Teacher"], answer: 2 },
  { id: 11, question: "At what age was Bepo originally planning to retire?", options: ["A) 60", "B) 50", "C) 55", "D) 65"], answer: 2 },
  { id: 12, question: "What was the name of the neighborhood school Bepo started after his NYSC?", options: ["A) Stardom Kiddies", "B) Beesway Group of Schools", "C) Fruitful Future", "D) Royal Ambassador School"], answer: 2 },
  { id: 13, question: "Why did Bepo's neighborhood school fail?", options: ["A) Embezzlement by his partner", "B) Collapsed access roads and a ruptured water pipe", "C) Ritual scandals", "D) Government demolition"], answer: 1 },
  { id: 14, question: "What subject does Mr. Audu teach?", options: ["A) Chemistry", "B) Fine Arts", "C) CRK", "D) Government"], answer: 1 },
  { id: 15, question: "What is Bepo’s monthly salary at Stardom Schools?", options: ["A) N250,000", "B) N400,000", "C) N1.7 million", "D) N100,000"], answer: 1 },
  { id: 16, question: "How much was Bepo promised for his new teaching job in the UK?", options: ["A) £10,000", "B) N400,000", "C) £3,600", "D) £1,000"], answer: 2 },
  { id: 17, question: "How much does Seri (Bepo's wife) reportedly earn per month in the UK?", options: ["A) £1,500", "B) £3,600", "C) £10,000", "D) £650"], answer: 2 },
  { id: 18, question: "Who took a N2 million loan from the school cooperative and disappeared abroad?", options: ["A) Mr. Fafore", "B) Mr. Oyelana", "C) Mr. Nku", "D) Mr. Akindele"], answer: 2 },
  { id: 19, question: "Who is Sola in the novel?", options: ["A) The school nurse", "B) The former Home Economics teacher who relocated to the UK", "C) Bepo's daughter", "D) The MD's sister"], answer: 1 },
  { id: 20, question: "What secret business did Sola run while pretending to be on sick leave?", options: ["A) A salon", "B) A boutique", "C) A creche", "D) A catering service"], answer: 2 },
  { id: 21, question: "What skill did Mrs. Ignatius learn in preparation for relocating to Canada?", options: ["A) Coding", "B) Nursing", "C) Bridal art and traditional hairdressing", "D) Commercial driving"], answer: 2 },
  { id: 22, question: "How much did Mrs. Ignatius estimate she could charge for braiding hair abroad?", options: ["A) $50", "B) $100", "C) $250", "D) $500"], answer: 1 },
  { id: 23, question: "Why was the Ignatius family denied their visa?", options: ["A) They submitted fake bank statements.", "B) The husband had a criminal record.", "C) A DNA test proved Mr. Ignatius was not Favour's biological father.", "D) They missed their interview."], answer: 2 },
  { id: 24, question: "What is the real name of the teacher nicknamed 'Mr. Wala'?", options: ["A) Mr. Ayesoro", "B) Mr. Fafore", "C) Mr. Justus Anabel", "D) Mr. Oyelana"], answer: 0 },
  { id: 25, question: "What subject did Mr. Wala teach?", options: ["A) Physics", "B) Government", "C) English", "D) Geography"], answer: 1 },
  { id: 26, question: "Why did Bibi Ladele have nightmares about Mr. Wala?", options: ["A) He caned her mercilessly.", "B) He had deep, wild tribal marks on his face.", "C) He always shouted in class.", "D) He failed her in Government."], answer: 1 },
  { id: 27, question: "Where was Mr. Wala transferred to appease the angry parent?", options: ["A) Stardom Kiddies", "B) Stardom Hub", "C) The school clinic", "D) The security post"], answer: 1 },
  { id: 28, question: "What time did Mrs. Ladele mandate her children to always go to bed?", options: ["A) 8:00 pm", "B) 9:00 pm", "C) 10:00 pm", "D) 11:00 pm"], answer: 2 },
  { id: 29, question: "What chronic ailment did the Managing Director suffer from?", options: ["A) Migraines", "B) Asthma", "C) Peppery pain in her buttocks", "D) High blood pressure"], answer: 2 },
  { id: 30, question: "What did the MD discover parked at the school's back gate?", options: ["A) Stolen school buses", "B) Expensive cars owned by the teachers", "C) Construction equipment", "D) Parents hiding from the PTA"], answer: 1 },
  { id: 31, question: "Who is the school accountant?", options: ["A) Jeremi Amos", "B) Martins Bayo", "C) Oye Bayo", "D) Mr. Obi"], answer: 0 },
  { id: 32, question: "How much money was in the purse of the Stardom Cooperative Society?", options: ["A) N50 million", "B) N95 million", "C) N250,000", "D) N2 million"], answer: 1 },
  { id: 33, question: "How much of the cooperative's money had been loaned out to staff?", options: ["A) N95 million", "B) N10 million", "C) N50 million", "D) N17 million"], answer: 2 },
  { id: 34, question: "What new maximum loan limit did the Board set for staff?", options: ["A) N100,000", "B) N250,000", "C) N500,000", "D) N1 million"], answer: 1 },
  { id: 35, question: "Who made the statement: 'It's like hanging a snake in the roof and going to bed'?", options: ["A) Mrs. Ibidun Gloss", "B) Principal Bepo", "C) Chief Mrs. Solape Bayo", "D) Mr. Audu"], answer: 2 },
  { id: 36, question: "Who was almost sacked for writing 'Ade as well as Jide comes early'?", options: ["A) Mr. Oyelana", "B) Mr. Fafore", "C) Mr. Bepo", "D) Mr. Anabel"], answer: 1 },
  { id: 37, question: "Which parent complained about the grammar in the note?", options: ["A) Mr. Guta", "B) Chief Didi Ogba", "C) Mr. Ignatius", "D) Mrs. Ladele"], answer: 0 },
  { id: 38, question: "What degree does the Managing Director (Mrs. Ibidun Gloss) possess?", options: ["A) Education", "B) Economics", "C) Law", "D) Medicine"], answer: 2 },
  { id: 39, question: "What school did Bepo work at before joining Stardom?", options: ["A) Fruitful Future", "B) Beesway Group of School", "C) Royal Ambassador", "D) Legacy Memorial"], answer: 1 },
  { id: 40, question: "Who was the Director of Beesway?", options: ["A) Mr. Egi Meko", "B) Chief David Aje", "C) Chief Waliem", "D) Mr. Ogo"], answer: 0 },
  { id: 41, question: "What grammatical error did Bepo constantly try to correct at his old school?", options: ["A) The spelling of 'Principal'", "B) The phrase 'Group of School' instead of 'Schools'", "C) 'Ade as well as Jide come'", "D) 'Japa'"], answer: 1 },
  { id: 42, question: "What shocking event did Bepo witness at Beesway at 2:51 am?", options: ["A) The Director stealing school funds", "B) Thugs burying a live cow for a ritual", "C) The accountant altering results", "D) Students escaping from the hostel"], answer: 1 },
  { id: 43, question: "What injury did Bepo sustain while trying to stop the ritual at Beesway?", options: ["A) A bullet wound to the leg", "B) A machete cut to the right wrist", "C) A broken rib", "D) A bruised eye"], answer: 1 },
  { id: 44, question: "Which parent offered to sprinkle magical corn to bring students to Fruitful Future?", options: ["A) Chief Ogba", "B) Mr. Ogo", "C) Mr. Guta", "D) Mr. Ibe"], answer: 1 },
  { id: 45, question: "What positions were Banky and Tosh contesting for during the Speech Day?", options: ["A) Head Boy", "B) Chapel Prefect", "C) Social Prefect", "D) Labour Prefect"], answer: 2 },
  { id: 46, question: "What insult did Banky hurl at Tosh's father?", options: ["A) He called him a ritualist.", "B) He called him a thief.", "C) He called him an ex-convict.", "D) He called him an illiterate."], answer: 2 },
  { id: 47, question: "What was the name of Tosh's father?", options: ["A) Chief Didi Ogba", "B) Chief David Aje", "C) Chief Waliem", "D) Martins Bayo"], answer: 0 },
  { id: 48, question: "Where did Bepo travel to in order to renew his passport?", options: ["A) Ikoyi, Lagos", "B) Ikeja, Lagos", "C) Ibadan, Oyo State", "D) Abeokuta, Ogun State"], answer: 2 },
  { id: 49, question: "What was the name of the corrupt passport agent Bepo used?", options: ["A) Tai", "B) Jombo", "C) Ige", "D) Dele"], answer: 0 },
  { id: 50, question: "How much bribe did Bepo pay the passport agent?", options: ["A) N250,000", "B) N20,000", "C) N70,000", "D) N100,000"], answer: 3 },
  { id: 51, question: "To which state did the students travel to see the Ikogosi Warm Springs?", options: ["A) Osun State", "B) Ekiti State", "C) Plateau State", "D) Niger State"], answer: 1 },
  { id: 52, question: "What town in Lagos did Bepo take his students to, which made him reflect heavily on slavery?", options: ["A) Epe", "B) Ikorodu", "C) Badagry", "D) Ajegunle"], answer: 2 },
  { id: 53, question: "What airline did Bepo book for his flight to London?", options: ["A) British Airways", "B) Virgin Atlantic", "C) Emirates", "D) Qatar Airways"], answer: 2 },
  { id: 54, question: "What time was Bepo’s flight scheduled to take off?", options: ["A) 5:00 pm", "B) 8:00 pm", "C) 10:00 pm", "D) 12:00 am"], answer: 2 },
  { id: 55, question: "Who is Bepo’s landlord?", options: ["A) Mr. Ogunwale", "B) Mr. Oyelana", "C) Mr. Tai", "D) Pastor Wande"], answer: 0 },
  { id: 56, question: "How much cash did Bepo give to his landlord's grandchildren?", options: ["A) N1,000", "B) N5,000", "C) N10,000", "D) N20,000"], answer: 1 },
  { id: 57, question: "What specific item did Bepo’s wife ask him to buy from Oyingbo market?", options: ["A) Yam and palm oil", "B) Dry snail, iru, and egusi", "C) Ankara fabric", "D) Cassava powder"], answer: 1 },
  { id: 58, question: "What kind of car did Bepo sell before traveling?", options: ["A) Toyota Muscle", "B) Honda Pilot", "C) Pathfinder SUV", "D) Toyota Sienna"], answer: 2 },
  { id: 59, question: "Who bought Bepo’s car?", options: ["A) The landlord", "B) Mrs. Apeh (VP)", "C) Mr. Jeremi Amos (Accountant)", "D) Mr. Audu"], answer: 2 },
  { id: 60, question: "How much did Bepo sell his car for?", options: ["A) N1.5 million", "B) N2 million", "C) N4 million", "D) N650,000"], answer: 0 },
  { id: 61, question: "Which of these teachers accompanied Bepo to the airport?", options: ["A) Mr. Fafore", "B) Mr. Audu", "C) Mr. Justus Anabel", "D) Mrs. Ibidun Gloss"], answer: 1 },
  { id: 62, question: "What did Stardom Schools give Bepo as a parting gift?", options: ["A) A new car", "B) A house in Lekki", "C) A $10,000 domiciliary cheque", "D) N5 million cash"], answer: 2 },
  { id: 63, question: "According to Mrs. Gloss, who originally hired Bepo 24 years ago?", options: ["A) Chief Mrs. Solape Bayo", "B) Chief David Aje (her late father)", "C) The Board of Directors", "D) Chief Ogba"], answer: 1 },
  { id: 64, question: "During his farewell party, which cultural dance reminded Bepo of travelers floating on a river?", options: ["A) Bata dance", "B) Koroso dance", "C) Canoe dance of the Badagry people", "D) Atilogwu dance"], answer: 2 },
  { id: 65, question: "What does Bepo compare the modern 'Japa' wave to?", options: ["A) An economic boom", "B) A search for the Golden Fleece", "C) Voluntary slavery (Trans-Atlantic Slave Trade)", "D) A religious pilgrimage"], answer: 2 },
  { id: 66, question: "What was the name of the technological project Bepo patronized at the school?", options: ["A) The Invention Club Breath Project (phone making)", "B) The Stardom Hub Robotics", "C) The Solar Power Initiative", "D) The Waterworks Project"], answer: 0 },
  { id: 67, question: "What caused Bepo to jump up from his seat on the airplane?", options: ["A) He forgot his passport.", "B) He had a nightmare where a White man shouted 'Enter!' at a slave ship.", "C) He received a text from his wife.", "D) He realized he left his phone in his landlord's car."], answer: 1 },
  { id: 68, question: "On what day of the week did Bepo dramatically return to Stardom Schools?", options: ["A) Saturday", "B) Monday", "C) Wednesday", "D) Friday"], answer: 1 },
  { id: 69, question: "What did Bepo shout when he returned to the school?", options: ["A) 'I lost my visa!'", "B) 'I am back! My heart is here!'", "C) 'The flight was cancelled!'", "D) 'I need my job back!'"], answer: 1 },
  { id: 70, question: "What university did Bepo graduate from?", options: ["A) University of Lagos", "B) University of Ibadan", "C) University of Benin", "D) Lagos State University"], answer: 2 },
  { id: 71, question: "What course did Bepo study at the university?", options: ["A) Law", "B) Economics", "C) English/History Education", "D) Theatre Arts"], answer: 2 },
  { id: 72, question: "Who authored the poem 'Ibadan' which Bepo recalled during his trip?", options: ["A) Wole Soyinka", "B) J.P. Clark", "C) Chinua Achebe", "D) Abimbola Adelakun"], answer: 1 },
  { id: 73, question: "Who is the Igbo Language teacher at Stardom?", options: ["A) Mrs. Ose", "B) Mr. Obi", "C) Nurse Titi", "D) Miss Taye Kareem"], answer: 0 },
  { id: 74, question: "Who was the 55-year-old immigrant who ended up as a correctional officer in the US?", options: ["A) Jare", "B) Hope", "C) Akindele", "D) Nku"], answer: 2 },
  { id: 75, question: "Which teacher joked that he would slaughter seven cows if he got a visa to Afghanistan?", options: ["A) Mr. Fafore", "B) Mr. Audu", "C) Mr. Oyelana", "D) Mr. Ayesoro"], answer: 1 },
  { id: 76, question: "What was the phrase the MD used when firing Mr. Fafore (before Bepo saved him)?", options: ["A) 'You are a disgrace to this school.'", "B) 'You are more illiterate than the woman from whom you buy onions in Obalende.'", "C) 'You are hanging a snake in the roof.'", "D) 'You are a bloody absentee teacher.'"], answer: 1 },
  { id: 77, question: "What Yoruba proverb does Bepo believe in regarding his legacy?", options: ["A) Oga ta, oga o ta, owo alaaru a pe", "B) B’Onirese ofingba mo, eyi to ti fin sile ‘ko le p’arun", "C) Ile la tii kesoo r’ode", "D) Oja Oyingbo ko mo’p’enikan o wa"], answer: 1 },
  { id: 78, question: "How did Sola solve her accommodation problem in the UK?", options: ["A) She lived in a shelter.", "B) She rented a flat in London.", "C) She moved to Manchester to rent a cheaper two-bedroom flat.", "D) She lived in her hospital's staff quarters."], answer: 2 },
  { id: 79, question: "How much did Sola pay for rent in Manchester?", options: ["A) £1,500", "B) £1,000", "C) £650", "D) £3,600"], answer: 2 },
  { id: 80, question: "What is the name of the security guard at Stardom's back gate?", options: ["A) Jombo", "B) Ige", "C) Tai", "D) Dele"], answer: 0 },
  { id: 81, question: "Who is the Chemistry teacher?", options: ["A) Mr. Justus Anabel", "B) Mr. Ope Wande", "C) Miss Taye Kareem", "D) Mr. Obi"], answer: 0 },
  { id: 82, question: "Which teacher handled Geography?", options: ["A) Mr. Oyelana", "B) Miss Taye Kareem", "C) Mr. Ayesoro", "D) Mrs. Ose"], answer: 1 },
  { id: 83, question: "How much did teachers whose students scored distinctions in WASSCE receive as a bonus?", options: ["A) N20,000", "B) N30,000", "C) N50,000", "D) N100,000"], answer: 1 },
  { id: 84, question: "What was the name of the school bus driver who tried to steal a bus to send his son abroad?", options: ["A) The novel does not state his name.", "B) Jombo", "C) Tai", "D) Nku"], answer: 0 },
  { id: 85, question: "Who asked Bepo the rhetorical question: 'Principal, why these questions? Why would I argue with anyone?'", options: ["A) Mr. Audu", "B) Mr. Fafore", "C) Mr. Guta", "D) Pastor Wande"], answer: 1 },
  { id: 86, question: "What was the name of the student who called Mr. Ayesoro 'Mr. Wala'?", options: ["A) Bibi Ladele", "B) Favour Ignatius", "C) Nike Adewale", "D) Betty"], answer: 0 },
  { id: 87, question: "How long had Hope (the accountant) been in London before his wife stopped paying for his Master's?", options: ["A) One year", "B) Six months", "C) Four months", "D) Two years"], answer: 2 },
  { id: 88, question: "In the debate during Bepo’s send-off, what was the topic?", options: ["A) Science vs. Arts in national development", "B) Japa vs. Patriotism", "C) Boarding vs. Day School", "D) British English vs. American English"], answer: 0 },
  { id: 89, question: "What color is the suit Bepo was wearing when he first cried at the assembly?", options: ["A) Black", "B) Navy Blue", "C) Grey", "D) Brown"], answer: 2 },
  { id: 90, question: "Which state is the Erin Ijesha Waterfalls located in?", options: ["A) Ekiti State", "B) Osun State", "C) Kwara State", "D) Niger State"], answer: 1 },
  { id: 91, question: "What is another name for the Erin Ijesha Waterfalls?", options: ["A) Olumirin", "B) Gurara", "C) Assop", "D) Agbokim"], answer: 0 },
  { id: 92, question: "Why did the MD initially suspect the teachers of stealing?", options: ["A) The safe was empty.", "B) She saw their expensive cars at the back gate.", "C) Parents complained about extortion.", "D) The accountant confessed to her."], answer: 1 },
  { id: 93, question: "Who was the student that Banky competed against?", options: ["A) Ikenna", "B) Tosh", "C) Jide", "D) Tim"], answer: 1 },
  { id: 94, question: "What did Chief Ogba demand after his son was insulted?", options: ["A) That the principal be sacked", "B) That the school refund his fees", "C) Separate letters of apology published in the school magazine", "D) That Banky be expelled"], answer: 2 },
  { id: 95, question: "Where does Mr. Audu live?", options: ["A) Lekki", "B) Ogba", "C) Ikorodu", "D) Mowe"], answer: 2 },
  { id: 96, question: "Where does Bepo live in Lagos?", options: ["A) Victoria Island", "B) Adeniyi Jones, Ikeja", "C) Ajah", "D) Magodo"], answer: 1 },
  { id: 97, question: "What item did the clownish teacher Audu push into his mouth to demonstrate his shock at the MD's policies?", options: ["A) A piece of chalk", "B) His finger", "C) A pen", "D) A handkerchief"], answer: 1 },
  { id: 98, question: "What condition must a student meet to contest for a prefect position at Stardom?", options: ["A) Must be an SS3 student", "B) Must not owe fees", "C) Must have an international passport", "D) Must be a science student"], answer: 1 },
  { id: 99, question: "How much does the intent form for Head Boy/Head Girl cost at Stardom?", options: ["A) N10,000", "B) N25,000", "C) N40,000", "D) N50,000"], answer: 3 },
  { id: 100, question: "How does the novel end?", options: ["A) Bepo arrives in London and hugs his wife.", "B) Bepo returns to the school and the students carry him in celebration.", "C) Bepo starts a new school called Fruitful Future.", "D) Bepo is arrested at the airport."], answer: 1 },
  { id: 101, question: "At Stardom Schools, on which days are normal Christian and Muslim prayers said?", options: ["A) Tuesdays and Thursdays", "B) Mondays, Wednesdays, and Fridays", "C) Only on Fridays", "D) Every day"], answer: 1 },
  { id: 102, question: "On Tuesdays and Thursdays, what is used as the morning prayer at Stardom?", options: ["A) The Lord's Prayer", "B) The National Pledge", "C) The second stanza of the National Anthem", "D) The Stardom Anthem"], answer: 2 },
  { id: 103, question: "Which student delivered the pep talk about the excursion to Plateau State?", options: ["A) Tosh Ogba", "B) Banky", "C) Ikenna Egbu", "D) Bibi Ladele"], answer: 2 },
  { id: 104, question: "Which of these tourist attractions is NOT in Jos, Plateau State, as mentioned by the student?", options: ["A) Lamingo Dam", "B) Shere Hills", "C) Wase Rocks", "D) Owu Waterfalls"], answer: 3 },
  { id: 105, question: "The student who spoke about Jos noted that his mother's profession was what?", options: ["A) A nurse", "B) A broadcaster and poet", "C) A banker", "D) A civil servant"], answer: 1 },
  { id: 106, question: "What was Stardom's previous boarding fee per session before it was reduced?", options: ["A) N165,000", "B) N200,000", "C) N250,000", "D) N300,000"], answer: 2 },
  { id: 107, question: "What was the new, reduced boarding fee that caused a massive influx of boarding students?", options: ["A) N93,000", "B) N150,000", "C) N165,000", "D) N100,000"], answer: 2 },
  { id: 108, question: "How much did the management secretly add to the 'Excursion and Other Items' fee?", options: ["A) N50,000", "B) N93,000", "C) N165,000", "D) N250,000"], answer: 1 },
  { id: 109, question: "Who was the MD's cousin that was sacked because his students scored F9?", options: ["A) Mr. Justus Anabel", "B) Mr. Obong Ukaku", "C) Mr. Funso Daniels", "D) Mr. Egi Meko"], answer: 2 },
  { id: 110, question: "The Physics teacher, Mr. Ope Wande, also served what role outside the school?", options: ["A) An immigration agent", "B) A pastor", "C) A choirmaster", "D) A mechanic"], answer: 1 },
  { id: 111, question: "Sola, the former Home Economics teacher, has a daughter who suffered a seizure in the UK. What is the daughter's name?", options: ["A) Nike", "B) Kike", "C) Betty", "D) Favour"], answer: 2 },
  { id: 112, question: "How old was Sola's daughter when she had the seizure?", options: ["A) 2 years old", "B) 3 years old", "C) 5 years old", "D) 7 years old"], answer: 1 },
  { id: 113, question: "According to Sola, how long does it take to travel by rail from Manchester to London?", options: ["A) About 30 minutes", "B) One hour", "C) Two hours", "D) 15 minutes"], answer: 0 },
  { id: 114, question: "The text mentions a Nigerian maintenance worker in the US who had a bit of carpentry knowledge. How much did he earn daily?", options: ["A) $150", "B) $250", "C) $500", "D) $1,000"], answer: 2 },
  { id: 115, question: "Riike, the woman who migrated to the US, was able to buy two houses in which Nigerian city?", options: ["A) Lagos", "B) Abeokuta", "C) Ibadan", "D) Ekiti"], answer: 2 },
  { id: 116, question: "Mr. Akindele (the 55-year-old immigrant) had two children from his divorced Nigerian wife. What were their ages?", options: ["A) 12 and 8", "B) 16 and 10", "C) 18 and 15", "D) 20 and 17"], answer: 1 },
  { id: 117, question: "What was Mr. Akindele's first job in America?", options: ["A) Correctional service", "B) Freight loading", "C) Taxi driving", "D) Carpentry"], answer: 1 },
  { id: 118, question: "What is the name of Mrs. Ignatius's son (Favour's brother), who started asking disturbing questions about the visa?", options: ["A) Ibe", "B) Iyi", "C) Tosh", "D) Jide"], answer: 1 },
  { id: 119, question: "How many children did the Ignatius family have in total?", options: ["A) Two", "B) Three", "C) Four", "D) Five"], answer: 1 },
  { id: 120, question: "What was Mrs. Ladele's husband's name?", options: ["A) Dele", "B) Ibe", "C) Jombo", "D) Ogo"], answer: 0 },
  { id: 121, question: "Where did Mrs. Ladele's husband work?", options: ["A) Lagos", "B) Port Harcourt", "C) Abuja", "D) London"], answer: 2 },
  { id: 122, question: "What are the names of Bibi Ladele's siblings?", options: ["A) Tim and Love", "B) Iyi and Favour", "C) Nike and Kike", "D) Jide and Kemi"], answer: 0 },
  { id: 123, question: "What is the name of the MD's brother (a non-executive director)?", options: ["A) Oye Bayo", "B) Martins Bayo", "C) Dele Bayo", "D) David Aje"], answer: 1 },
  { id: 124, question: "Who serves as the board's secretary?", options: ["A) Chief Mrs. Solape Bayo", "B) Martins Bayo", "C) Oye Bayo", "D) Mrs. Ibidun Gloss"], answer: 2 },
  { id: 125, question: "During the Open Day, which family would gift the school packets of beverages?", options: ["A) The Ignatius family", "B) The Gbayi family", "C) The Ladele family", "D) The Ogba family"], answer: 1 },
  { id: 126, question: "Where was Bepo living when he suffered the embarrassing NEPA disconnection?", options: ["A) Adeniyi Jones", "B) Iyana Ipaja", "C) Magboro", "D) Ijaye"], answer: 1 },
  { id: 127, question: "How much was the electricity tariff Bepo collected but failed to remit?", options: ["A) N1,000", "B) N2,500", "C) N5,000", "D) N10,000"], answer: 1 },
  { id: 128, question: "What is the name of the co-tenant who humiliated Bepo over the NEPA issue?", options: ["A) Iya Mathew", "B) Mrs. Nike", "C) Sola", "D) Riike"], answer: 0 },
  { id: 129, question: "What exactly did the co-tenant dunk on Bepo's head?", options: ["A) Garri", "B) Elubo (cassava powder)", "C) Dirty water", "D) Palm oil"], answer: 1 },
  { id: 130, question: "Mr. Fafore eventually built a two-bedroom apartment in which location?", options: ["A) Sango", "B) Ijaye", "C) Ifo", "D) Mowe"], answer: 2 },
  { id: 131, question: "To guarantee punctuality from his faraway house, what time does Mr. Fafore wake up daily?", options: ["A) 3:00 am", "B) 4:00 am", "C) 5:00 am", "D) 6:00 am"], answer: 1 },
  { id: 132, question: "Who was the parent involved in the grammar dispute with Mr. Fafore?", options: ["A) Mr. Guta", "B) Chief Ogba", "C) Mr. Ibe", "D) Mr. Ogunwale"], answer: 0 },
  { id: 133, question: "What are the names of the parent's children involved in the grammar dispute?", options: ["A) Nike and Kike", "B) Tim and Love", "C) Dorah and Nicholas", "D) Jide and Kemi"], answer: 2 },
  { id: 134, question: "What is the full title of the former school Bepo worked at?", options: ["A) Beesway Group of Schools", "B) Beesway Group of School", "C) Beesway International School", "D) Beesway Academy"], answer: 1 },
  { id: 135, question: "Where was the Beesway Staff Quarters located?", options: ["A) Ojikutu", "B) Iyana Ipaja", "C) Lekki", "D) Agodi-Gate"], answer: 0 },
  { id: 136, question: "What religion was Bepo originally, which he returned to when his wife left for the UK?", options: ["A) Pentecostal", "B) Anglican", "C) Catholic", "D) Methodist"], answer: 2 },
  { id: 137, question: "Bepo's wife, Seri, convinced him to attend which church when she was in Nigeria?", options: ["A) Redeemed Christian Church of God", "B) Truth Tellers Mission", "C) Mountain of Fire and Miracles", "D) Christ Embassy"], answer: 1 },
  { id: 138, question: "What exactly did Bepo grab and hang on his neck before confronting the ritualists at Beesway?", options: ["A) A whistle", "B) A rosary/crucifix", "C) A flashlight", "D) A Bible"], answer: 1 },
  { id: 139, question: "By the end of Fruitful Future's third session, how many students had enrolled?", options: ["A) Over 50", "B) Over 70", "C) Over 100", "D) Over 150"], answer: 1 },
  { id: 140, question: "Name the well-reported school that offered a 2-bedroom apartment to any teacher who stayed for 15 years.", options: ["A) Stardom Schools", "B) Heroes Haven", "C) Royal Ambassador", "D) Legacy Memorial"], answer: 1 },
  { id: 141, question: "Ten years after Fruitful Future closed, Bepo saw Mr. Ogo on TV. What crime was Mr. Ogo arrested for?", options: ["A) Armed robbery", "B) Kidnapping a student", "C) Murdering a civil servant for a spiritual infertility solution", "D) Stealing school funds"], answer: 2 },
  { id: 142, question: "How much fee had Mr. Ogo received from the victim before murdering her?", options: ["A) N2 million", "B) N5 million", "C) N9 million", "D) N15 million"], answer: 2 },
  { id: 143, question: "What are the costs for the intent forms for Deputy Head Boy/Girl?", options: ["A) N50,000", "B) N40,000", "C) N25,000", "D) N10,000"], answer: 1 },
  { id: 144, question: "During the Speech Day clash, what was the value of the government contract Chief Ogba was tried for misappropriating?", options: ["A) N1 billion", "B) N2.5 billion", "C) N5 billion", "D) N10 billion"], answer: 1 },
  { id: 145, question: "How many months did Chief Ogba spend in detention during his trial?", options: ["A) 12 months", "B) 24 months", "C) 36 months", "D) 48 months"], answer: 2 },
  { id: 146, question: "Tosh and Banky's rivalry started in JSS3 during which competition?", options: ["A) Best Debater", "B) Best Dancer (Hip-hop category)", "C) Best Athlete", "D) Best Speller"], answer: 1 },
  { id: 147, question: "What was the judge's voting score that gave Banky the victory over Tosh in JSS3?", options: ["A) 4-1", "B) 5-0", "C) 3-2", "D) 2-1"], answer: 2 },
  { id: 148, question: "What is the name of the NGO that committed funds to the Invention Club's Breath Project?", options: ["A) Save the Children", "B) Life Grid", "C) Tech Future", "D) OYASAF Foundation"], answer: 1 },
  { id: 149, question: "Where do teachers lodge when Stardom goes on excursion to Badagry?", options: ["A) Point of No Return Hotel", "B) Whispering Palms Resort", "C) Badagry Heritage Inn", "D) Agiya Tree Lodge"], answer: 1 },
  { id: 150, question: "How high is the Owu Waterfalls in Kwara State above water level?", options: ["A) 50 meters", "B) 100 meters", "C) 120 meters", "D) 200 meters"], answer: 2 },
  { id: 151, question: "Who is said to have discovered the Ikogosi Warm Springs in 1852?", options: ["A) Rev. Henry Townsend", "B) Rev. John S. McGee", "C) Ajayi Crowther", "D) A Gwari hunter named Buba"], answer: 1 },
  { id: 152, question: "Where is the Kwa Falls located?", options: ["A) Anambra", "B) Anegeje, Calabar", "C) Gembu, Taraba State", "D) Kafanchan, Kaduna State"], answer: 1 },
  { id: 153, question: "Under which tree was Christianity first preached in Nigeria?", options: ["A) The Oak Tree", "B) The Agiya Tree", "C) The Baobab Tree", "D) The Iroko Tree"], answer: 1 },
  { id: 154, question: "Who hosted the Stardom students and served them refreshment in Badagry?", options: ["A) The Seriki Abass", "B) The Mayor of Badagry", "C) The Akran of Badagry", "D) The Mobee Royal Family"], answer: 2 },
  { id: 155, question: "According to the monarch, freed slaves returning in the 1830s established what kind of plantations?", options: ["A) Cocoa plantations", "B) Coconut plantations", "C) Palm oil plantations", "D) Rubber plantations"], answer: 1 },
  { id: 156, question: "Which museum in Badagry houses chains, padlocks, and rods used on slaves?", options: ["A) Black Heritage Museum", "B) Seriki Abass Slave Museum", "C) Mobee Royal Family Slave Relics Museum", "D) First Storey Building"], answer: 2 },
  { id: 157, question: "In order to fast-track his passport, what time did Bepo aim to be at the Agodi-Gate office in Ibadan?", options: ["A) 6:00 am", "B) 7:00 am", "C) 8:00 am", "D) 9:00 am"], answer: 1 },
  { id: 158, question: "Bepo travelled to Ibadan via which motor park in Lagos?", options: ["A) Berger", "B) Oshodi", "C) Ojota", "D) Iyana Ipaja"], answer: 2 },
  { id: 159, question: "What type of vehicle did Bepo board to Ibadan?", options: ["A) A luxurious bus", "B) A six-passenger Toyota Sienna", "C) A Toyota Hiace", "D) A Honda Pilot"], answer: 1 },
  { id: 160, question: "Which poet described Ibadan as a 'running splash of rust and gold'?", options: ["A) Wole Soyinka", "B) Chinua Achebe", "C) J.P. Clark", "D) Christopher Okigbo"], answer: 2 },
  { id: 161, question: "What is the title of the novel by Abimbola Adelakun that caught Bepo's eye on Google?", options: ["A) 'The Rusted City'", "B) 'Under the Brown Rusted Roofs'", "C) 'Ibadan: The Golden City'", "D) 'The Hills of Rust'"], answer: 1 },
  { id: 162, question: "What time did Bepo wake up in his hotel room in Ibadan?", options: ["A) 5:00 am", "B) 5:30 am", "C) 6:05 am", "D) 6:40 am"], answer: 2 },
  { id: 163, question: "In the passport office, Bepo gave the immigration officer an extra tip of how much?", options: ["A) N500", "B) N1,000", "C) N2,000", "D) N5,000"], answer: 2 },
  { id: 164, question: "After data capturing, what office was Bepo instructed to visit because of network issues?", options: ["A) The Bank", "B) The Police Station", "C) The NIN office", "D) The VIO office"], answer: 2 },
  { id: 165, question: "How much was the fine Bepo paid to Emirates airline to shift his flight by a week?", options: ["A) $50", "B) $100", "C) $200", "D) $500"], answer: 1 },
  { id: 166, question: "What was the score of the novelty football match during Bepo's farewell week?", options: ["A) Staff 2 - Students 1", "B) Staff 3 - Students 2", "C) Students 3 - Staff 0", "D) Staff 1 - Students 1"], answer: 1 },
  { id: 167, question: "Who acted as the referee during the novelty match?", options: ["A) Mr. Audu", "B) Mr. Ibe", "C) Mr. Fafore", "D) Pastor Wande"], answer: 1 },
  { id: 168, question: "What is the name of Stardom's talented goalkeeper?", options: ["A) Chido (Chidi)", "B) Banky", "C) Tosh", "D) Jide"], answer: 0 },
  { id: 169, question: "What was the name of the lead debater who argued for the Arts during the send-off?", options: ["A) Angel", "B) Maryam", "C) Favour", "D) Nike"], answer: 1 },
  { id: 170, question: "What traditional instrument was NOT available for the Bata dancers, forcing them to improvise?", options: ["A) The talking drum", "B) The Bata drum", "C) The Djembe", "D) The flute"], answer: 1 },
  { id: 171, question: "Which state is the Koroso dance associated with?", options: ["A) Hausa states (Kano)", "B) Igbo states", "C) Yoruba states", "D) Efik states"], answer: 0 },
  { id: 172, question: "Before his final trip, what time did Bepo step out of his house for the airport?", options: ["A) 1:00 pm", "B) 3:00 pm", "C) 5:00 pm", "D) 7:00 pm"], answer: 1 },
  { id: 173, question: "What are the names of Bepo's landlord's grandchildren?", options: ["A) Nike and Kike", "B) Jide and Kemi", "C) Tim and Love", "D) Dorah and Nicholas"], answer: 1 },
  { id: 174, question: "How old is Kemi?", options: ["A) Five", "B) Seven", "C) Ten", "D) Twelve"], answer: 1 },
  { id: 175, question: "What brand of car did the landlord use to drive Bepo to the airport?", options: ["A) Honda Pilot", "B) Toyota Sienna", "C) Pathfinder SUV", "D) Toyota Venza"], answer: 0 },
  { id: 176, question: "Which famous Lagos market did Seri ask Bepo to buy local ingredients from?", options: ["A) Mile 12 Market", "B) Oyingbo Market", "C) Tejuosho Market", "D) Balogun Market"], answer: 1 },
  { id: 177, question: "From where did the Vice Principal, Mrs. Apeh, drive to join the airport convoy?", options: ["A) Ogba", "B) Ikorodu", "C) Mowe", "D) Ojodu"], answer: 0 },
  { id: 178, question: "Where does the school accountant, Mr. Jeremi Amos, live?", options: ["A) Ogba", "B) Ikorodu", "C) Ojodu", "D) Lekki"], answer: 2 },
  { id: 179, question: "Where does the CRK teacher, Mr. Oyelana, live?", options: ["A) Ogba", "B) Ikorodu", "C) Mowe", "D) Ojodu"], answer: 2 },
  { id: 180, question: "At what specific location did Bepo urge his colleagues to wait for him so they could head to the airport together?", options: ["A) Toll Gate", "B) Ikeja Underbridge", "C) Ojota Park", "D) Berger"], answer: 1 },
  { id: 181, question: "At what exact time did they arrive at the MM2 departure hall?", options: ["A) 3:00 pm", "B) 4:07 pm", "C) 5:30 pm", "D) 6:00 pm"], answer: 1 },
  { id: 182, question: "What color of clothes was Bepo wearing to the airport?", options: ["A) A grey suit", "B) A white T-shirt and black jeans trousers", "C) A native Ankara", "D) A tracksuit"], answer: 1 },
  { id: 183, question: "Where did Bepo leave his mobile phone?", options: ["A) In his landlord's car", "B) In the inner pocket of his jacket", "C) At the check-in counter", "D) At home"], answer: 1 },
  { id: 184, question: "What time did airport check-in start?", options: ["A) 4:00 pm", "B) 5:30 pm", "C) 8:00 pm", "D) 9:30 pm"], answer: 1 },
  { id: 185, question: "What was Bepo's assigned gate at the airport?", options: ["A) Gate 1B", "B) Gate 2A", "C) Gate 5", "D) Gate 7C"], answer: 1 },
  { id: 186, question: "What was Bepo's seat number on the flight?", options: ["A) 24A", "B) 56 (Window side)", "C) 12B", "D) 45 (Aisle)"], answer: 1 },
  { id: 187, question: "What time did the plane actually take off (without Bepo)?", options: ["A) 9:30 pm", "B) 10:00 pm", "C) 10:45 pm", "D) 11:00 pm"], answer: 2 },
  { id: 188, question: "In Bepo's nightmare, how many slaves did he count before the White man pointed at him?", options: ["A) One million", "B) Three million", "C) Seven million", "D) Ten million"], answer: 2 },
  { id: 189, question: "Who did Bepo take the microphone from during the gloomy assembly in Chapter One?", options: ["A) Mrs. Apeh", "B) Angel, the chapel prefect", "C) Mrs. Ibidun Gloss", "D) Mr. Oyelana"], answer: 1 },
  { id: 190, question: "What was the name of Bepo's friend who advised him about working hourly jobs in the USA?", options: ["A) The text does not name him.", "B) Ige", "C) Akindele", "D) Hope"], answer: 0 },
  { id: 191, question: "What is the name of the parent who died, leaving his kids unable to pay school fees?", options: ["A) Chief Didi Ogba", "B) Chief Waliem", "C) Mr. Guta", "D) Chief David Aje"], answer: 1 },
  { id: 192, question: "What is the meaning of the Yoruba phrase 'onile gogoro' mentioned in relation to Mrs. Ignatius's hairdressing?", options: ["A) Braids shaped like a basket", "B) A cone so tall it threatens to kiss the sky", "C) Threaded hair", "D) Cornrows"], answer: 1 },
  { id: 193, question: "What department of Stardom Schools handles real estate and property management?", options: ["A) Stardom Kiddies", "B) Stardom Hub", "C) Stardom Ventures", "D) Stardom Properties"], answer: 1 },
  { id: 194, question: "What is the name of the student whose handwriting was so good her father sued the school for exploiting her?", options: ["A) The novel does not state her name.", "B) Favour", "C) Bibi", "D) Dorah"], answer: 0 },
  { id: 195, question: "What did the parents of the student with good handwriting want her to study at the university?", options: ["A) Education", "B) Law", "C) Medicine", "D) Engineering"], answer: 2 },
  { id: 196, question: "During the grammar dispute, who said, 'Audu, if I lay my hands on you!'", options: ["A) Mrs. Grace Apeh", "B) Mrs. Ibidun Gloss", "C) Chief Mrs. Solape Bayo", "D) Bepo"], answer: 1 },
  { id: 197, question: "What is the relationship between Mrs. Ibidun Gloss and Chief David Aje?", options: ["A) He is her husband.", "B) He is her brother.", "C) He is her late father.", "D) He is her uncle."], answer: 2 },
  { id: 198, question: "Who provided the 'abracadabra' voodoo refereeing during the novelty match?", options: ["A) Mr. Audu", "B) Mr. Ibe", "C) Mr. Fafore", "D) Pastor Wande"], answer: 1 },
  { id: 199, question: "In what month was Bepo originally supposed to resume work at Stardom 24 years ago?", options: ["A) January", "B) May", "C) September", "D) October"], answer: 2 },
  { id: 200, question: "How many days late was Bepo when he first resumed work at Stardom 24 years ago?", options: ["A) Two days", "B) Five days", "C) Eight days", "D) Ten days"], answer: 2 }
  // ... Add the rest of your questions here
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function App() {
  const [screen, setScreen] = useState("login");
  const [name, setName] = useState("");
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // New state to track what the user actually clicked
  const [userAnswers, setUserAnswers] = useState([]);

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attemptResult, setAttemptResult] = useState(0);

  useEffect(() => {
    const lockedData = JSON.parse(localStorage.getItem("utme_username_lock"));
    if (lockedData) {
      const now = new Date().getTime();
      if (now < lockedData.expiry) {
        setName(lockedData.name);
        setIsNameLocked(true);
      } else {
        localStorage.removeItem("utme_username_lock");
      }
    }
  }, []);

  useEffect(() => {
    if (screen !== "quiz") return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, screen]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startQuiz = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return alert("Please enter your name!");

    if (!isNameLocked) {
      const expiryTime = new Date().getTime() + (15 * 24 * 60 * 60 * 1000);
      localStorage.setItem("utme_username_lock", JSON.stringify({ name: trimmedName, expiry: expiryTime }));
      setIsNameLocked(true);
    }

    const requestedAmount = Math.min(Math.max(Number(numQuestions), 5), allQuizData.length);
    const shuffled = shuffleArray(allQuizData).slice(0, requestedAmount);

    setActiveQuestions(shuffled);
    setCurrentQ(0);
    setScore(0);
    setUserAnswers([]); // Clear previous answers
    setSelectedOpt(null);
    setTimeLeft(requestedAmount * 45);
    setScreen("quiz");
  };

  const handleTimeout = () => {
    // If timer runs out, record the current question with whatever they had selected (or null)
    const newAnswers = [...userAnswers, {
      question: activeQuestions[currentQ].question,
      options: activeQuestions[currentQ].options,
      correctAnswer: activeQuestions[currentQ].answer,
      selectedAnswer: selectedOpt
    }];
    handleEndQuiz(score, newAnswers);
  };

  const nextQuestion = () => {
    let newScore = score;
    const isCorrect = selectedOpt === activeQuestions[currentQ].answer;

    if (isCorrect) newScore += 1;

    // Save their selection to history for the Review Screen
    const newAnswers = [...userAnswers, {
      question: activeQuestions[currentQ].question,
      options: activeQuestions[currentQ].options,
      correctAnswer: activeQuestions[currentQ].answer,
      selectedAnswer: selectedOpt
    }];

    setUserAnswers(newAnswers);
    setScore(newScore);

    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      handleEndQuiz(newScore, newAnswers);
    }
  };

  const handleEndQuiz = async (finalScore = score, finalAnswers = userAnswers) => {
    setScreen("result");
    setScore(finalScore);
    setUserAnswers(finalAnswers); // Make sure the last question gets saved to state

    const percentage = Number(((finalScore / activeQuestions.length) * 100).toFixed(2));
    setAttemptResult(percentage);
    setLoading(true);

    try {
      const safeId = name.trim().toLowerCase().replace(/\s+/g, "_");

      const { data: existingUser } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('id', safeId)
        .single();

      let newAvg = percentage;
      let newAttempts = 1;

      if (existingUser) {
        const oldAvg = existingUser.average_percentage || 0;
        const oldAttempts = existingUser.total_attempts || 0;
        newAvg = ((oldAvg * oldAttempts) + percentage) / (oldAttempts + 1);
        newAttempts = oldAttempts + 1;
      }

      await supabase.from('leaderboard').upsert({
        id: safeId,
        name: name.trim(),
        average_percentage: Number(newAvg.toFixed(2)),
        total_attempts: newAttempts,
        last_attempt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Critical error saving to Supabase:", e);
    }
    setLoading(false);
  };

  const fetchLeaderboard = async () => {
    setScreen("leaderboard");
    setLoading(true);
    try {
      const { data } = await supabase.from('leaderboard').select('*').order('average_percentage', { ascending: false }).limit(50);
      if (data) setLeaderboard(data);
    } catch (e) {
      console.error("Error fetching from Supabase:", e);
    }
    setLoading(false);
  };

  // Filter out only the wrong answers for the Review Screen
  const wrongAnswers = userAnswers.filter(ans => ans.selectedAnswer !== ans.correctAnswer);

  return (
    <div className="container">
      {/* 1. LOGIN SCREEN */}
      {screen === "login" && (
        <>
          <h1>UTME Mock Exam</h1>
          <h2>The Lekki Headmaster</h2>
          {isNameLocked ? (
            <p style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "0.9rem" }}>
              🔒 Your name is locked to this device for 15 days.
            </p>
          ) : (
            <p>Enter your real name. It will be locked for 15 days!</p>
          )}

          <input type="text" placeholder="Enter your full name..." value={name} onChange={(e) => setName(e.target.value)} disabled={isNameLocked} />

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ fontWeight: "600", color: "#333" }}>Select Number of Questions:</label>
            <input type="number" min="5" max={allQuizData.length} value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} />
            <small style={{ color: "#888" }}>Max available: {allQuizData.length} (Randomized)</small>
          </div>

          <button onClick={startQuiz}>Start Exam</button>
          <button className="btn-secondary" onClick={fetchLeaderboard}>View Global Leaderboard</button>
        </>
      )}

      {/* 2. QUIZ SCREEN */}
      {screen === "quiz" && activeQuestions.length > 0 && (
        <>
          <div className="header">
            <span>Question {currentQ + 1} of {activeQuestions.length}</span>
            <span className="timer">⏱ {formatTime(timeLeft)}</span>
          </div>
          <div className="question">{activeQuestions[currentQ].question}</div>
          <div className="options">
            {activeQuestions[currentQ].options.map((opt, i) => (
              <div key={i} className={`option ${selectedOpt === i ? "selected" : ""}`} onClick={() => setSelectedOpt(i)}>{opt}</div>
            ))}
          </div>
          <button style={{ marginTop: "20px" }} disabled={selectedOpt === null} onClick={nextQuestion}>
            {currentQ === activeQuestions.length - 1 ? "Submit Exam" : "Next Question"}
          </button>
        </>
      )}

      {/* 3. RESULT SCREEN */}
      {screen === "result" && (
        <>
          <h1>Exam Completed!</h1>
          <div className="score-display">{attemptResult}%</div>
          <p>You scored {score} out of {activeQuestions.length}.</p>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "30px" }}>
            {loading ? "Saving to global database..." : "Your average has been updated globally!"}
          </p>

          <button onClick={fetchLeaderboard} disabled={loading}>View Global Leaderboard</button>
          <button className="btn-warning" onClick={() => setScreen("review")}>Review Wrong Answers</button>
          <button className="btn-secondary" onClick={() => setScreen("login")}>Take Another Batch</button>
        </>
      )}

      {/* 4. REVIEW SCREEN */}
      {screen === "review" && (
        <>
          <h1>Review Answers</h1>
          <div className="review-list">
            {wrongAnswers.length === 0 ? (
              <p style={{ textAlign: "center", fontWeight: "bold", color: "#00c853", marginTop: "20px" }}>
                🎉 Perfect Score! You got everything right.
              </p>
            ) : (
              wrongAnswers.map((ans, i) => (
                <div key={i} className="review-card">
                  <div className="review-q">{ans.question}</div>
                  <div className="review-wrong">
                    ❌ You Selected: {ans.selectedAnswer !== null ? ans.options[ans.selectedAnswer] : "No Answer Provided (Time Ran Out)"}
                  </div>
                  <div className="review-correct">
                    ✅ Correct Answer: {ans.options[ans.correctAnswer]}
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setScreen("result")}>Back to Results</button>
          <button className="btn-secondary" onClick={() => setScreen("login")}>Take Another Batch</button>
        </>
      )}

      {/* 5. LEADERBOARD SCREEN */}
      {screen === "leaderboard" && (
        <>
          <h1>🌍 Global Ranking</h1>
          <p style={{ fontSize: "0.85rem", color: "#666" }}>Ranked by Cumulative Average Percentage</p>
          {loading ? <p>Loading scores from cloud...</p> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Rank</th><th>Name</th><th>Avg %</th><th>Attempts</th></tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={index}>
                      <td>#{index + 1}</td>
                      <td>{entry.name}</td>
                      <td style={{ color: "#00c853", fontWeight: "bold" }}>{entry.average_percentage}%</td>
                      <td style={{ textAlign: "center" }}>{entry.total_attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button onClick={() => setScreen("login")}>Back to Home</button>
        </>
      )}
    </div>
  );
}