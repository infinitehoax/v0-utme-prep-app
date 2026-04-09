import { useState, useEffect } from "react";
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
  { id: 200, question: "How many days late was Bepo when he first resumed work at Stardom 24 years ago?", options: ["A) Two days", "B) Five days", "C) Eight days", "D) Ten days"], answer: 2 },
  { id: 201, question: "What caused lateness at Stardom Schools before the boarding fee was reduced?", options: ["A) Poor school buses", "B) Heavy Lagos traffic", "C) Strict security checks", "D) Late morning devotions"], answer: 1 },
  { id: 202, question: "How did parents react when the 'Excursion and Other Items' fee was increased by N93,000?", options: ["A) They protested heavily", "B) They withdrew their children", "C) Not many complained", "D) They sued the management"], answer: 2 },
  { id: 203, question: "What prayer ritual does Stardom use on Mondays, Wednesdays, and Fridays?", options: ["A) Only the National Pledge", "B) Christian and Muslim prayers alongside the first stanza of the National Anthem", "C) Silent meditation", "D) The Stardom Anthem only"], answer: 1 },
  { id: 204, question: "Does Stardom recite the first stanza of the National Anthem on Tuesdays and Thursdays?", options: ["A) Yes, alongside the pledge", "B) No, they just go straight to classes", "C) Yes, sung by the choir", "D) No, they use the second stanza as a prayer and then the school anthem"], answer: 3 },
  { id: 205, question: "Who was the Vice Principal of Stardom Schools?", options: ["A) Mrs. Ibidun Gloss", "B) Nurse Titi", "C) Mrs. Grace Apeh", "D) Miss Taye Kareem"], answer: 2 },
  { id: 206, question: "Who is described as the 'embodiment of sanity' in the school by the MD?", options: ["A) Pastor Wande", "B) Mr. Audu", "C) Mrs. Grace Apeh", "D) Mr. Bepo"], answer: 3 },
  { id: 207, question: "What color was the suit Bepo wore when Pastor Wande wrote his wife's number?", options: ["A) Black suit", "B) Navy blue suit", "C) Grey suit", "D) Brown suit"], answer: 2 },
  { id: 208, question: "Who did the Vice Principal suggest should accompany Bepo to his classes after he broke down (exempting her)?", options: ["A) Mrs. Beke Egbin, the guidance counsellor", "B) Mr. Audu", "C) Pastor Wande", "D) Nurse Titi"], answer: 0 },
  { id: 209, question: "What is the name of the Guidance Counsellor at Stardom Schools?", options: ["A) Mrs. Ibidun Gloss", "B) Mrs. Beke Egbin", "C) Mrs. Mary Ladele", "D) Mrs. Ose"], answer: 1 },
  { id: 210, question: "How many years did Bepo spend as headmaster at the nursery/primary arm, Stardom Kiddies?", options: ["A) Two years", "B) Four years", "C) Seven years", "D) Ten years"], answer: 1 },
  { id: 211, question: "Sola faced a working suspension without pay for how long?", options: ["A) One month", "B) Two months", "C) Three months", "D) Six months"], answer: 2 },
  { id: 212, question: "What was Sola's actual reason for being in the UK when she claimed to be on 'sick leave'?", options: ["A) Having her first child", "B) Getting her Master's degree", "C) Visiting her sick mother", "D) Attending an interview"], answer: 0 },
  { id: 213, question: "What did Sola and her husband do to afford migrating to the UK?", options: ["A) Won a scholarship", "B) Stole from the cooperative", "C) Sold everything and borrowed about N4 million", "D) Her husband's company sponsored them"], answer: 2 },
  { id: 214, question: "In Sola's testimony, what did the UK health system provide for her asthmatic child in an emergency?", options: ["A) Free medication for a year", "B) Two ambulances and a car in less than 5 minutes", "C) A free surgery", "D) A personal home nurse"], answer: 1 },
  { id: 215, question: "What is the meaning of the Idoma proverb Bepo recalled: 'Owo noya eloleche no chelo longea'?", options: ["A) The early bird catches the worm", "B) A child that washes his hands dines with kings", "C) The sugar cane and bitter leaf get different tastes from the same rain", "D) What an elder sees sitting down, a child cannot see standing"], answer: 2 },
  { id: 216, question: "Who legally stripped the UK-returnee academic of all he had?", options: ["A) The US Government", "B) His business partner", "C) His Nigerian wife", "D) The Nigerian Embassy"], answer: 2 },
  { id: 217, question: "On what grounds did the academic's wife strip him of his properties?", options: ["A) Tax evasion", "B) Guilty of bigamy", "C) Domestic abuse", "D) Fraud"], answer: 1 },
  { id: 218, question: "Riike decided not to pay a dime as school fees for her children till what year?", options: ["A) 2025", "B) 2027", "C) 2030", "D) 2035"], answer: 1 },
  { id: 219, question: "Mr. Akindele migrated to the US at what age?", options: ["A) 40", "B) 45", "C) 50", "D) 55"], answer: 3 },
  { id: 220, question: "How many years had Mr. Akindele been married before he divorced his Nigerian wife to marry a US citizen?", options: ["A) 10 years", "B) 15 years", "C) 18 years", "D) 24 years"], answer: 2 },
  { id: 221, question: "Who invited Akindele to the US?", options: ["A) His brother", "B) A US citizen he met at a media company in Lagos", "C) His childhood friend", "D) An employment agency"], answer: 1 },
  { id: 222, question: "Akindele told his friend Ige about 70-year-old Nigerians doing what job in the US?", options: ["A) Driving Ubers", "B) Washing corpses", "C) Sorting mails in the wind as casual workers", "D) Teaching in high schools"], answer: 2 },
  { id: 223, question: "Favour, Mrs. Ignatius's daughter involved in the DNA scandal, was in what class at Stardom?", options: ["A) JSS 2", "B) JSS 3", "C) SS 1", "D) SS 2"], answer: 3 },
  { id: 224, question: "What feature of Bepo's face did he jovially boast about during exam supervision?", options: ["A) His sharp nose", "B) His prominent eyeballs", "C) His large ears", "D) His bushy eyebrows"], answer: 1 },
  { id: 225, question: "Bepo's complexion was playfully compared to what insect?", options: ["A) The praying mantis", "B) The yellow ant (salamo)", "C) The butterfly", "D) The golden beetle"], answer: 1 },
  { id: 226, question: "Mrs. Mary Ladele had a previous devotion to what type of movies before returning to Nollywood?", options: ["A) Hollywood action movies", "B) K-Dramas", "C) Zee World / Indian soaps", "D) Telenovelas"], answer: 2 },
  { id: 227, question: "What was Mrs. Ladele watching when her daughter screamed about Mr. Wala?", options: ["A) A Nollywood movie about a Caesarean Section", "B) A horror movie about a ghost", "C) A comedy skit", "D) The news"], answer: 0 },
  { id: 228, question: "In Mrs. Ladele's movie, what was the name of the female physician performing the CS?", options: ["A) Dr. Sola", "B) Dr. Titi", "C) Dr. Ibidun", "D) Dr. Ajayi"], answer: 3 },
  { id: 229, question: "What was the name of Dr. Ajayi's friend who was receiving the CS in the movie?", options: ["A) Bimbo", "B) Kemi", "C) Dorah", "D) Favour"], answer: 0 },
  { id: 230, question: "What House was Bibi reassigned to after her scare with Mr. Wala?", options: ["A) Blue House", "B) Red House", "C) Green House", "D) Yellow House"], answer: 2 },
  { id: 231, question: "Which House was Bibi originally in when she saw Mr. Wala at basketball practice?", options: ["A) Blue House", "B) Red House", "C) Green House", "D) Yellow House"], answer: 0 },
  { id: 232, question: "Which House did Bibi's brother, Tim, belong to?", options: ["A) Blue House", "B) Red House", "C) Green House", "D) Yellow House"], answer: 2 },
  { id: 233, question: "What condition caused the MD to escape to her secret room during breaks?", options: ["A) Extreme migraines", "B) A health condition that caused peppery pain in her buttocks", "C) Severe asthma attacks", "D) High blood pressure"], answer: 1 },
  { id: 234, question: "How long had the MD been exploring spiritual and traditional interventions for her health condition?", options: ["A) Over 10 years", "B) Over 15 years", "C) Over 20 years", "D) Over 30 years"], answer: 3 },
  { id: 235, question: "How far was the piece of land used as a secret staff car park from the back gate of Stardom?", options: ["A) One minute away", "B) Five minutes away", "C) Ten minutes away", "D) Fifteen minutes away"], answer: 1 },
  { id: 236, question: "Who was the first person the MD summoned when she saw the expensive cars?", options: ["A) The Chairman of the Board", "B) The security guard only", "C) The principal and school accountant via phone call", "D) The VP"], answer: 2 },
  { id: 237, question: "How did Bepo and the accountant initially react to the MD asking 'How much is in the account... that it could buy every fool the car of his choice?'", options: ["A) They started laughing", "B) They walked out of the office", "C) The word 'fool' hit them like a thunderbolt and they exchanged glances", "D) They immediately confessed"], answer: 2 },
  { id: 238, question: "Who is the last born in the MD's family board of directors?", options: ["A) Martins Bayo", "B) Ibidun Gloss", "C) Oye Bayo", "D) David Aje"], answer: 2 },
  { id: 239, question: "Stardom teachers who had been in the school for up to seven years got what concession on their children's fees?", options: ["A) Free education", "B) Paying only 20 percent", "C) Paying only 50 percent", "D) Free textbooks"], answer: 2 },
  { id: 240, question: "Mr. Fafore lived in Ifo, which is located in which state?", options: ["A) Lagos State", "B) Ogun State", "C) Oyo State", "D) Osun State"], answer: 1 },
  { id: 241, question: "How much did Mr. Fafore earn as a graduate of 22 years?", options: ["A) N100,000", "B) N150,000", "C) N175,000", "D) N250,000"], answer: 2 },
  { id: 242, question: "Before Ifo, Fafore rented a mini flat in Sango for how much per annum?", options: ["A) N170,000", "B) N200,000", "C) N300,000", "D) N400,000"], answer: 2 },
  { id: 243, question: "Before Sango, Fafore rented a one-room apartment in Ijaye for how much?", options: ["A) N100,000", "B) N150,000", "C) N170,000", "D) N200,000"], answer: 2 },
  { id: 244, question: "When Bepo stopped Fafore's SS2 class, what did the students chorus laughingly when he asked 'Am I making sense?'", options: ["A) 'No, sir!'", "B) 'Yes!'", "C) 'Principoo!'", "D) 'We are confused!'"], answer: 1 },
  { id: 245, question: "What time did Fafore usually arrive at school despite living far away?", options: ["A) 5:30 am", "B) 6:00 am", "C) 7:00 am", "D) 7:30 am"], answer: 1 },
  { id: 246, question: "What time did Fafore wake up and set out for school daily?", options: ["A) Woke up 3:00am, set out 3:30am", "B) Woke up 4:00am, set out 4:30am", "C) Woke up 5:00am, set out 5:30am", "D) Woke up 4:30am, set out 5:00am"], answer: 1 },
  { id: 247, question: "Which parent stormed out of Fafore's class after checking his son's book?", options: ["A) Chief Ogba", "B) Mr. Ignatius", "C) Mr. Guta", "D) Mr. Ladele"], answer: 2 },
  { id: 248, question: "Mr. Guta is the father of Dorah and Nicholas. What classes were they in?", options: ["A) Dorah in SS3, Nicholas in JSS3", "B) Dorah in SS2, Nicholas in JSS2", "C) Dorah in SS1, Nicholas in JSS1", "D) Both in SS2"], answer: 1 },
  { id: 249, question: "How did Bepo and Fafore verify the grammatical rule to the MD?", options: ["A) Bepo quoted a dictionary", "B) Bepo called a university professor", "C) Bepo directed everyone to bring out smartphones and investigate online", "D) Bepo brought out a WAEC past question"], answer: 2 },
  { id: 250, question: "Who saved the day and eased the tension after the MD was proven wrong in the grammar dispute?", options: ["A) Mrs. Grace Apeh", "B) Mr. Fafore", "C) Mr. Audu, with a joke", "D) Pastor Wande"], answer: 2 },
  { id: 251, question: "What type of bow did Audu give the MD after resolving the grammar tension?", options: ["A) A royal bow", "B) A Japanese bow", "C) A theatrical bow", "D) A mocking bow"], answer: 1 },
  { id: 252, question: "At Beesway, Bepo was designated as what subject teacher?", options: ["A) Senior History Teacher", "B) Senior English Teacher", "C) Principal", "D) Headmaster"], answer: 1 },
  { id: 253, question: "The Beesway Director told Bepo the name 'Group of School' had what undertone?", options: ["A) A business undertone", "B) A grammatical exception", "C) A spiritual undertone / divinely inspired", "D) A legal registration requirement"], answer: 2 },
  { id: 254, question: "The Beesway Director joked there is no word like what in the English language?", options: ["A) Englisher", "B) Headmaster", "C) Principoo", "D) Japa"], answer: 0 },
  { id: 255, question: "During what meeting did a Beesway parent raise the 'Group of School' grammatical error, infuriating the Director?", options: ["A) Staff meeting", "B) Parent-Teacher Association (PTA) meeting", "C) Board meeting", "D) Open Day"], answer: 1 },
  { id: 256, question: "What Yoruba proverb did the Beesway Director quote to Bepo about guilt over vegetables from a dumpsite?", options: ["A) Oga ta, oga o ta...", "B) Ile la tii kesoo r'ode", "C) Elefo, o' o, ni ooo. O lefoo oun kii s' efo aatan.", "D) B'Onirese ofingba mo..."], answer: 2 },
  { id: 257, question: "At what exact time did Bepo look out the window and notice the ritual at Beesway?", options: ["A) 12:00 am", "B) 1:00 am", "C) 2:30 am", "D) 2:51 am"], answer: 3 },
  { id: 258, question: "The live cow Bepo saw at Beesway was described in the dark as what?", options: ["A) A large black beast", "B) A large whitish thing", "C) A spotted animal", "D) A sacrificial lamb"], answer: 1 },
  { id: 259, question: "Who attacked Bepo at Beesway while he was trying to stop the cow ritual?", options: ["A) The Director himself", "B) A security guard", "C) A man lurking in the dark, unseen, with a machete", "D) A parent"], answer: 2 },
  { id: 260, question: "Where did Bepo observe his National Youth Service?", options: ["A) Lagos State", "B) Warri, Delta State", "C) Jos, Plateau State", "D) Benin, Edo State"], answer: 1 },
  { id: 261, question: "What business trick did Bepo learn in Warri to encourage school enrollment?", options: ["A) Giving out free uniforms", "B) Giving pupils a topic to teach their parents at home", "C) Slashing fees by 50%", "D) Offering free school buses"], answer: 1 },
  { id: 262, question: "How much did Mr. Ogo say his corn-sprinkling ritual would cost to boost enrollment?", options: ["A) Just N10,000", "B) Just N20,000", "C) Just N35,000", "D) Just N50,000"], answer: 2 },
  { id: 263, question: "How much did the spiritualist on TV (Mr. Ogo) collect from the murdered woman looking for a child?", options: ["A) N1 million", "B) N5 million", "C) N9 million", "D) N15 million"], answer: 2 },
  { id: 264, question: "What was the cost of the intent form for all other prefect offices (Chapel, Health, Social, etc.) at Stardom?", options: ["A) N10,000", "B) N20,000", "C) N25,000", "D) N30,000"], answer: 2 },
  { id: 265, question: "What was the 'Golden condition' for a student to be a prefect at Stardom?", options: ["A) Must have a distinction in English", "B) Must not owe fees / be debt-free", "C) Must be in the boarding house", "D) Must be born again"], answer: 1 },
  { id: 266, question: "How many observers from the alumni association joined the screening panel for prefects?", options: ["A) One", "B) Two", "C) Three", "D) Five"], answer: 1 },
  { id: 267, question: "During the screening stage, how long was each aspirant expected to speak about their Expression of Interest?", options: ["A) One minute", "B) Two minutes", "C) About three minutes", "D) Five minutes"], answer: 2 },
  { id: 268, question: "How long did Chief Ogba's government contract trial drag on for?", options: ["A) Two years", "B) Three years", "C) Four years", "D) Five years"], answer: 3 },
  { id: 269, question: "Which two political parties were mentioned regarding the fathers of Tosh and Banky?", options: ["A) APC and PDP", "B) Progressives All Congress and Democratic People's Party", "C) Action Congress and Labour Party", "D) National Party and Social Democratic Party"], answer: 1 },
  { id: 270, question: "During the PTA election, what position did Banky's mum beat Tosh's mum to?", options: ["A) Chairperson", "B) Secretary", "C) Treasurer", "D) PRO"], answer: 2 },
  { id: 271, question: "What material was used for the Invention Club's Breath Project phone-making initiative?", options: ["A) Imported screens", "B) Recycled panels and chips", "C) Solar panels", "D) Plastic bottles"], answer: 1 },
  { id: 272, question: "JSS 1 students at Stardom went on an excursion to Badagry as part of what package?", options: ["A) First Term Package", "B) Stardom Heritage Package", "C) Welcome to Stardom package", "D) Junior Explorer Package"], answer: 2 },
  { id: 273, question: "What state is the Gurara Falls located in?", options: ["A) Plateau State", "B) Niger State", "C) Kaduna State", "D) Nasarawa State"], answer: 1 },
  { id: 274, question: "In what year was Gurara Falls said to have been discovered by a Gwari hunter?", options: ["A) 1645", "B) 1745", "C) 1845", "D) 1925"], answer: 1 },
  { id: 275, question: "In what year was Erin-Ijesha Waterfalls discovered?", options: ["A) 1140 AD", "B) 1250 AD", "C) 1400 AD", "D) 1852 AD"], answer: 0 },
  { id: 276, question: "Who is the forebear of the Yoruba mentioned in relation to the discovery of Erin-Ijesha Waterfalls?", options: ["A) Oranmiyan", "B) Sango", "C) Oduduwa", "D) Obatala"], answer: 2 },
  { id: 277, question: "According to one source, who discovered the Erin-Ijesha Waterfalls?", options: ["A) A Gwari hunter", "B) Rev. John S. McGee", "C) Akinla, a granddaughter of Oduduwa", "D) Ajayi Crowther"], answer: 2 },
  { id: 278, question: "Assop Falls is located in which state?", options: ["A) Cross River", "B) Enugu", "C) Plateau", "D) Bauchi"], answer: 2 },
  { id: 279, question: "Karu Falls and Farin Ruwa Waterfalls are located in which state?", options: ["A) Kaduna", "B) Nasarawa", "C) Taraba", "D) Plateau"], answer: 1 },
  { id: 280, question: "Matsirga Waterfalls is located in which town?", options: ["A) Kafanchan, Kaduna State", "B) Gembu, Taraba State", "C) Anegeje, Calabar", "D) Owerre Ezukuka, Anambra"], answer: 0 },
  { id: 281, question: "The National War Museum visited by Stardom students is in which state?", options: ["A) Enugu State", "B) Abia State (Umuahia)", "C) Anambra State", "D) Rivers State"], answer: 1 },
  { id: 282, question: "The Hanging Lake visited by the students is in which town?", options: ["A) Ado Awaye, Oyo State", "B) Ikogosi, Ekiti State", "C) Ijode, Lagos", "D) Ile-Ife, Osun State"], answer: 0 },
  { id: 283, question: "Which tall staff at Ile-Ife was said to have descended from heaven?", options: ["A) Oduduwa Staff", "B) Oranmiyan Staff", "C) Sango Staff", "D) Ooni Staff"], answer: 1 },
  { id: 284, question: "What Yoruba proverb did Bepo believe in meaning 'charity begins at home'?", options: ["A) Oga ta, oga o ta", "B) Ile la tii kesoo r'ode", "C) B'Onirese ofingba mo", "D) Oja Oyingbo ko mo'p'enikan o wa"], answer: 1 },
  { id: 285, question: "The Epe Fish Market and Ijode Warm Spring are located in which axis?", options: ["A) Badagry axis", "B) Ikorodu axis", "C) Lekki axis", "D) Ikeja axis"], answer: 1 },
  { id: 286, question: "Sungbo Eredo is described as a system of defensive ditches built in honour of which matriarch?", options: ["A) Moremi Ajasoro", "B) Bilikisu Sungbo", "C) Efunroye Tinubu", "D) Queen Amina"], answer: 1 },
  { id: 287, question: "The OYASAF Foundation House in Maryland holds how many artworks collected privately by Prince Yemisi Adedoyin?", options: ["A) Over 1,000", "B) Over 3,000", "C) Over 5,000", "D) Over 7,000"], answer: 3 },
  { id: 288, question: "Who made the first translation of the Yoruba Bible in Badagry?", options: ["A) Henry Townsend", "B) Ajayi Crowther", "C) Mary Slessor", "D) John S. McGee"], answer: 1 },
  { id: 289, question: "Badagry was founded in the late 1720s by Popo refugees fleeing wars with which people?", options: ["A) The Ashanti", "B) The Oyo Empire", "C) The Fon people of Dahomey", "D) The British"], answer: 2 },
  { id: 290, question: "By the 1880s in Badagry, freed slaves established plantations of what?", options: ["A) Cocoa", "B) Palm oil", "C) Coconut", "D) Groundnut"], answer: 2 },
  { id: 291, question: "What was the former name of the Anglican Nursery and Primary School in Badagry?", options: ["A) First Storey School", "B) Nursery of Infant Church", "C) Badagry Heritage School", "D) Crowther Memorial School"], answer: 1 },
  { id: 292, question: "During the trans-Atlantic slave trade, between what years did Africans experience barbarity according to the text?", options: ["A) 1400 and 1800", "B) 1500 and 1900", "C) 1600 and 1850", "D) 1700 and 1950"], answer: 1 },
  { id: 293, question: "When did Bepo's passport expire before he finally tried to renew it?", options: ["A) Six months earlier", "B) One year earlier", "C) Two years earlier", "D) Three years earlier"], answer: 2 },
  { id: 294, question: "Why did Bepo avoid applying online for his passport?", options: ["A) He didn't have a computer", "B) The process was said to be very slow or erratic, deliberately frustrated", "C) It was more expensive online", "D) His NIN was not ready"], answer: 1 },
  { id: 295, question: "How much did the official 10-year passport renewal (64 pages) actually cost before the agent's markup?", options: ["A) N20,000", "B) N35,000", "C) N50,000", "D) N70,000"], answer: 3 },
  { id: 296, question: "Tai, the passport agent, asked Bepo for N100,000. How much extra did Tai say he could pay to make the collection faster?", options: ["A) N5,000", "B) N10,000", "C) N20,000", "D) N50,000"], answer: 2 },
  { id: 297, question: "On what day of the week did Bepo set out for Ibadan for his passport appointment?", options: ["A) Monday morning", "B) Tuesday afternoon", "C) Wednesday morning", "D) Friday evening"], answer: 1 },
  { id: 298, question: "Where is the headquarters of Channels Television located along the route to Ibadan?", options: ["A) Ojota", "B) Berger", "C) Isheri Estate", "D) Magboro"], answer: 2 },
  { id: 299, question: "At what time did Bepo's bus leave OPIC ESTATE?", options: ["A) 3:00 pm", "B) 4:00 pm", "C) 5:00 pm", "D) 6:00 pm"], answer: 2 },
  { id: 300, question: "Some claimed that up to how many vehicles plied the Lagos-Ibadan Expressway daily?", options: ["A) 50,000 vehicles", "B) 100,000 vehicles", "C) 250,000 vehicles", "D) 500,000 vehicles"], answer: 2 }
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

    const passedIds = JSON.parse(localStorage.getItem("utme_passed_ids") || "[]");
    const failedIds = JSON.parse(localStorage.getItem("utme_failed_ids") || "[]");

    let pool = allQuizData.filter(q => !passedIds.includes(q.id));
    const requestedAmount = Math.min(Math.max(Number(numQuestions), 5), allQuizData.length);

    if (pool.length < requestedAmount) {
      localStorage.setItem("utme_passed_ids", "[]");
      pool = allQuizData;
    }

    const failedInPool = pool.filter(q => failedIds.includes(q.id));
    const freshInPool = pool.filter(q => !failedIds.includes(q.id));

    const selection = [...shuffleArray(failedInPool), ...shuffleArray(freshInPool)].slice(0, requestedAmount);

    setActiveQuestions(selection);
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
      id: activeQuestions[currentQ].id,
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
      id: activeQuestions[currentQ].id,
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

    // Update passed/failed tracking
    const passedIds = new Set(JSON.parse(localStorage.getItem("utme_passed_ids") || "[]"));
    const failedIds = new Set(JSON.parse(localStorage.getItem("utme_failed_ids") || "[]"));

    finalAnswers.forEach(ans => {
      if (ans.selectedAnswer === ans.correctAnswer) {
        passedIds.add(ans.id);
        failedIds.delete(ans.id);
      } else {
        passedIds.delete(ans.id);
        failedIds.add(ans.id);
      }
    });

    localStorage.setItem("utme_passed_ids", JSON.stringify([...passedIds]));
    localStorage.setItem("utme_failed_ids", JSON.stringify([...failedIds]));

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

  const shareToWhatsApp = () => {
    const message = `I just scored ${score}/${activeQuestions.length} (${attemptResult}%) on the UTME Prep - The Lekki Headmaster mock exam! 📚 Think you can beat my score? Try it here: https://v0-utme-lekki.vercel.app/`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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

          <button className="btn-whatsapp" onClick={shareToWhatsApp}>Share to WhatsApp</button>
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
