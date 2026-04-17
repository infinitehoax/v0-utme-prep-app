import { useState, useEffect, useMemo } from "react";
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
  { id: 300, question: "Some claimed that up to how many vehicles plied the Lagos-Ibadan Expressway daily?", options: ["A) 50,000 vehicles", "B) 100,000 vehicles", "C) 250,000 vehicles", "D) 500,000 vehicles"], answer: 2 },
  { id: 301, question: "Which religious organization's camp is the first big one you see on the left at Magboro when traveling from Berger to Ibadan?", options: ["A) Redeemed Christian Church of God (RCCG)", "B) Deeper Life Bible Church", "C) Mountain of Fire and Miracles Ministry (MFM)", "D) Christ Embassy"], answer: 2 },
  { id: 302, question: "Which religious camp is located on the right, just after Ibafo?", options: ["A) Christian Pentecostal Mission", "B) NASFAT", "C) MFM", "D) Guru Maharaj Ji"], answer: 0 },
  { id: 303, question: "The Christ Embassy ground along the expressway is located around which area?", options: ["A) Magboro", "B) Ibafo", "C) Aseese", "D) Toll Gate"], answer: 2 },
  { id: 304, question: "Which major Islamic organization has its headquarters on the left of the Lagos-Ibadan expressway?", options: ["A) Ansar-Ud-Deen", "B) NASFAT", "C) FOMWAN", "D) MURIC"], answer: 1 },
  { id: 305, question: "Which church is located adjacent to the NASFAT headquarters?", options: ["A) MFM", "B) RCCG", "C) Deeper Life Bible Church", "D) Christ Embassy"], answer: 2 },
  { id: 306, question: "About a kilometre away from Deeper Life is the expansive camp of which church?", options: ["A) Winners Chapel", "B) RCCG (Redemption Camp)", "C) Catholic Diocese", "D) CPM"], answer: 1 },
  { id: 307, question: "Which spiritual base precedes the Ibadan Toll Gate and has been there longer than many conventional churches?", options: ["A) Guru Maharaj base", "B) Osun Oshogbo shrine", "C) Traditionalists hub", "D) NASFAT"], answer: 0 },
  { id: 308, question: "Which multi-faceted industry was observed by Bepo on the Long Bridge?", options: ["A) Dangote", "B) Mikano", "C) Multi-Trex", "D) Lifemate Furniture"], answer: 1 },
  { id: 309, question: "Which company located at Wawa was noted by Bepo to be distressed due to debt issues?", options: ["A) Punch Nigeria Limited", "B) Mikano", "C) Multi-Trex", "D) Lifemate Furniture"], answer: 2 },
  { id: 310, question: "Punch Nigeria Limited and Lifemate Furniture are located in which area along the expressway?", options: ["A) Mowe", "B) Ibafo", "C) Magboro", "D) Aseese"], answer: 2 },
  { id: 311, question: "Which of the following is NOT a private university observed by Bepo along the route?", options: ["A) McPherson", "B) Babcock", "C) Dominion", "D) Covenant"], answer: 3 },
  { id: 312, question: "Which university at the Ibadan end was founded by the Oyo State Government?", options: ["A) University of Ibadan", "B) First Technical University", "C) Lead City University", "D) Dominion University"], answer: 1 },
  { id: 313, question: "What infrastructure change did Bepo notice at 'Challenge' in Ibadan to ease traffic?", options: ["A) A new flyover", "B) A defining roundabout was no more there", "C) A new toll gate", "D) Traffic lights were installed"], answer: 1 },
  { id: 314, question: "After descending the Molete overhead bridge, what sight reminded Bepo of J.P. Clark's poem?", options: ["A) The tall skyscrapers", "B) The University of Ibadan", "C) The brown roofs", "D) The heavy traffic"], answer: 2 },
  { id: 315, question: "In J.P. Clark's poem 'Ibadan', the city is described as scattered among how many hills?", options: ["A) Five", "B) Seven", "C) Nine", "D) Twelve"], answer: 1 },
  { id: 316, question: "In the poem, Ibadan is compared to what item broken in the sun?", options: ["A) Broken glass", "B) Broken mirrors", "C) Broken china", "D) Broken clay"], answer: 2 },
  { id: 317, question: "Which of the following is considered a slum or interior location in Ibadan where mud buildings dominate?", options: ["A) Ring Road", "B) Bodija", "C) Akala", "D) Idi Arere"], answer: 3 },
  { id: 318, question: "Which of these is considered an elitist area in Ibadan?", options: ["A) Oja Oba", "B) Bere", "C) Aremo zone", "D) Oluyole"], answer: 3 },
  { id: 319, question: "When Stardom students visited the University of Ibadan, which road did the school bus take to let them appreciate the city's ancient essence?", options: ["A) Iwo Road directly", "B) Challenge route, passing through the belly of the city", "C) Ring Road bypass", "D) The Expressway straight to Agbowo"], answer: 1 },
  { id: 320, question: "What did Bepo consider to be the 'Ibadan miracle of commuting'?", options: ["A) Free public transport", "B) The absence of the fear of traffic palaver common to Lagosians", "C) Cheap taxi fares", "D) The new train system"], answer: 1 },
  { id: 321, question: "Where did Tai, the passport agent, actually operate from instead of the main immigration office?", options: ["A) Inside the passport controller's office", "B) An open space opposite the office harbouring business centres", "C) A bank nearby", "D) A restaurant"], answer: 1 },
  { id: 322, question: "What document did Bepo have to validate at another office, causing a three-week delay?", options: ["A) His birth certificate", "B) His Local Government Identification", "C) His National Identity Number (NIN)", "D) His WAEC certificate"], answer: 2 },
  { id: 323, question: "What were the background colours of the 3-D banner at Bepo's farewell party?", options: ["A) Blue and white", "B) Purple and black", "C) Green and gold", "D) Red and yellow"], answer: 1 },
  { id: 324, question: "What exact words were headlined on Bepo's farewell banner?", options: ["A) FAREWELL TO THE LEKKI HEADMASTER", "B) FOR HE GAVE STARDOM HIS VERY BEST", "C) GOODBYE PRINCIPOO", "D) WE WILL MISS YOU MR. BEPO"], answer: 1 },
  { id: 325, question: "The subtitle on the banner revealed Bepo's full name. What is it?", options: ["A) Adebepo Adewale", "B) Bepo Adebayo", "C) Adebepo Oyelana", "D) Adewale Bepo"], answer: 0 },
  { id: 326, question: "On what day of the week did the farewell programme officially begin with a novelty match?", options: ["A) Monday", "B) Wednesday", "C) Thursday", "D) Friday"], answer: 1 },
  { id: 327, question: "Who did the school team play against in the novelty match?", options: ["A) The PTA team", "B) The alumni team", "C) The staff team", "D) A rival school"], answer: 2 },
  { id: 328, question: "Who was the referee during the novelty match who ensured the staff won?", options: ["A) Mr. Audu", "B) Mr. Ibe", "C) Mr. Fafore", "D) Pastor Wande"], answer: 1 },
  { id: 329, question: "How many times did the staff have to retake their mysterious penalty before beating the Stardom goalkeeper?", options: ["A) Twice", "B) Three times", "C) Four times", "D) Five times"], answer: 3 },
  { id: 330, question: "What is the name of Stardom's talented goalkeeper who had been invited to the country's Under-17 team?", options: ["A) Banky", "B) Chido (Chidi)", "C) Tosh", "D) Ikenna"], answer: 1 },
  { id: 331, question: "How many minutes to the end of the match did the staff score their third goal?", options: ["A) Two minutes", "B) Five minutes", "C) Eight minutes", "D) Ten minutes"], answer: 2 },
  { id: 332, question: "On Thursday of the farewell week, a debate was held. What was the central topic?", options: ["A) That boarding school is better than day school", "B) That the Arts have contributed more to development than the Sciences", "C) That migrating abroad is unpatriotic", "D) That private schools are better than public schools"], answer: 1 },
  { id: 333, question: "Which class proposed (supported) the assertion in the debate?", options: ["A) SS 1", "B) SS 2", "C) SS 3", "D) JSS 3"], answer: 1 },
  { id: 334, question: "Who was the lead debater for the Arts team?", options: ["A) Angel", "B) Favour", "C) Maryam", "D) Dorah"], answer: 2 },
  { id: 335, question: "The Arts proponents argued that Nigeria won the Nobel Prize in Literature in what year?", options: ["A) 1960", "B) 1986", "C) 1999", "D) 2005"], answer: 1 },
  { id: 336, question: "Which class was adjudged the winner of the debate?", options: ["A) SS 1", "B) SS 2", "C) SS 3", "D) It was a tie"], answer: 2 },
  { id: 337, question: "Bepo quoted the Yoruba proverb: 'B'Onirese ofingba mo...' What trade does the proverb refer to?", options: ["A) A master blacksmith", "B) A master carver", "C) A master drummer", "D) A master hunter"], answer: 1 },
  { id: 338, question: "At Stardom Schools, what time is dedicated to socio-cultural activities every Friday?", options: ["A) 12:00pm to 2:00pm", "B) 1:00pm to 3:00pm", "C) 2:00pm to 4:00pm", "D) 3:00pm to 5:00pm"], answer: 1 },
  { id: 339, question: "During the comedy skits, students mimicked Bepo's habit of putting which hand in which pocket?", options: ["A) Right hand in right pocket", "B) Left hand in left pocket", "C) Both hands in his pockets", "D) Hands folded across his chest"], answer: 1 },
  { id: 340, question: "Which of these was NOT one of Bepo's trademark phrases mimicked by the students?", options: ["A) 'other things being equal...'", "B) 'by the way...'", "C) 'if you say education is too expensive try ignorance!'", "D) 'Are you an idiot?'"], answer: 3 },
  { id: 341, question: "Which traditional dance dazzled the crowd with spirited body movements and acrobatics?", options: ["A) Bata", "B) Koroso", "C) Atilogwu", "D) Canoe dance"], answer: 2 },
  { id: 342, question: "The Koroso dance, featuring performers in identical outfits moving simultaneously, is associated with which culture?", options: ["A) Yoruba", "B) Hausa", "C) Igbo", "D) Efik"], answer: 1 },
  { id: 343, question: "Three years prior, Bepo had invited a professional dancer from where to teach the students the Canoe dance?", options: ["A) The National Troupe", "B) The Badagry Heritage Council", "C) The Lagos State Arts Council", "D) The OYASAF Foundation"], answer: 0 },
  { id: 344, question: "While watching the Canoe dance, Bepo became emotional because it reminded him of what?", options: ["A) His youth in Warri", "B) Slaves and their agonies at the Heritage Slavery Museum", "C) The fishermen in his village", "D) His upcoming flight across the ocean"], answer: 1 },
  { id: 345, question: "What is the name of Mrs. Ibidun Gloss's late father who originally hired Bepo?", options: ["A) Chief Solape Bayo", "B) Chief Didi Ogba", "C) Chief David Aje", "D) Chief Waliem"], answer: 2 },
  { id: 346, question: "In what month was Bepo originally interviewed by the late founder 24 years ago?", options: ["A) Early July", "B) Early September", "C) Late October", "D) Mid December"], answer: 1 },
  { id: 347, question: "When Bepo first joined Stardom, which classes was he assigned to teach?", options: ["A) JSS 1-3", "B) SS 1-3", "C) Primary 4-6", "D) Only SS 3"], answer: 1 },
  { id: 348, question: "Why did Mrs. Gloss joke that they would not gift Bepo a car or electronic gadget?", options: ["A) Because he was already rich", "B) Because he was going to the UK ('the heaven and haven of good things')", "C) Because the cooperative society forbade it", "D) Because he sold his own car"], answer: 1 },
  { id: 349, question: "During the handshake, multiple voices asked 'How much?' regarding the cheque. What did one specific voice jokingly yell out?", options: ["A) 'One million!'", "B) 'Ten billion!'", "C) 'One thousand pounds!'", "D) 'A billion dollars!'"], answer: 1 },
  { id: 350, question: "What is Mrs. Gloss's exact height as described in the text?", options: ["A) 4 feet, 9 inches", "B) 5 feet, 2 inches", "C) 5 feet, 5 inches", "D) 6 feet tall"], answer: 0 },
  { id: 351, question: "What is Bepo's exact height as described during the cheque presentation?", options: ["A) 5 feet, 9 inches", "B) 6 feet flat", "C) 6 feet, 2 inches", "D) 6 feet, 5 inches"], answer: 2 },
  { id: 352, question: "As Bepo sobbed during his farewell speech, members of the Stardom family dabbed their eyes with handkerchiefs of all the following colors EXCEPT?", options: ["A) White", "B) Blue", "C) Pink", "D) Red"], answer: 2 },
  { id: 353, question: "Bepo was billed to jet out with Emirates airline on what day of the week?", options: ["A) Friday", "B) Saturday", "C) Sunday", "D) Monday"], answer: 1 },
  { id: 354, question: "What time did Bepo plan to be at the airport, even though boarding wouldn't start until 5:00pm?", options: ["A) 12:00pm", "B) 2:00pm", "C) 3:00pm", "D) Early as possible / afternoon"], answer: 3 },
  { id: 355, question: "Six years earlier, Bepo missed a flight with which airline?", options: ["A) Virgin Atlantic", "B) British Airways", "C) Emirates", "D) Qatar Airways"], answer: 1 },
  { id: 356, question: "Why did Bepo miss his flight six years earlier?", options: ["A) Heavy Lagos traffic", "B) He forgot his passport", "C) He thought the flight was 1:00pm but it was fixed for 11:00am", "D) His car broke down"], answer: 2 },
  { id: 357, question: "What fine did Bepo pay the airline six years earlier for missing his flight?", options: ["A) $50 penalty", "B) $100 penalty", "C) $200 penalty", "D) No penalty, he bought a new ticket"], answer: 1 },
  { id: 358, question: "In Lagos, what were commercial motorcycles popularly known as?", options: ["A) Keke Napep", "B) Danfo", "C) Okada", "D) Molue"], answer: 2 },
  { id: 359, question: "Before the government banned them, Okada riders were often seen as the last resort to beat what?", options: ["A) High transport fares", "B) The Lagos traffic demon", "C) Police checkpoints", "D) Flooded roads"], answer: 1 },
  { id: 360, question: "Just as Bepo was about to call an Uber, who knocked on his door?", options: ["A) VP Mrs. Apeh", "B) Mr. Audu", "C) His landlord, Mr. Ogunwale", "D) Pastor Wande"], answer: 2 },
  { id: 361, question: "What does the 7-year-old Kemi chipp in and exclaim to Bepo?", options: ["A) 'Don't go!'", "B) 'You want to Japa!'", "C) 'Bring me chocolates!'", "D) 'Goodbye Principoo!'"], answer: 1 },
  { id: 362, question: "What had Bepo been teaching the landlord's grandson, Jide, for free on weekends?", options: ["A) Mathematics and Physics", "B) Elocution and African history", "C) Fine Arts", "D) French"], answer: 1 },
  { id: 363, question: "What brand of car did the landlord bring out of his garage to drive Bepo to the airport?", options: ["A) Toyota Venza", "B) Honda Pilot", "C) Toyota Sienna", "D) Ford Explorer"], answer: 1 },
  { id: 364, question: "How many bags did Bepo pack for his relocation?", options: ["A) One big bag", "B) Two big bags and a smaller one", "C) Four suitcases", "D) One backpack"], answer: 1 },
  { id: 365, question: "Which of the following was NOT an item Bepo's wife asked him to buy from Oyingbo market?", options: ["A) Iru (locust beans)", "B) Egusi (melon seeds)", "C) Dry snail", "D) Stockfish"], answer: 3 },
  { id: 366, question: "The Yoruba proverb 'Oja Oyingbo ko mo'p'enikan o wa' implies what?", options: ["A) The market is always expensive", "B) The market never gets to find out a certain person did not turn up (life goes on without you)", "C) Nobody knows who is buying", "D) A good market sells itself"], answer: 1 },
  { id: 367, question: "What specific type of car had Bepo sold for N1.5 million before his trip?", options: ["A) Toyota Corolla", "B) Pathfinder Sports Utility Vehicle", "C) Honda Civic", "D) Nissan Altima"], answer: 1 },
  { id: 368, question: "Who bought Bepo's Pathfinder SUV?", options: ["A) Mr. Audu", "B) Mr. Ogunwale", "C) Mr. Jeremi Amos, the accountant", "D) Mrs. Grace Apeh"], answer: 2 },
  { id: 369, question: "What items did Bepo choose to gift to his landlady instead of auctioning them?", options: ["A) His bed and mattress", "B) His deep freezer and electronics", "C) His library of books", "D) His generator"], answer: 1 },
  { id: 370, question: "At what location did Bepo ask his Stardom colleagues to wait for him so they could go to the airport together?", options: ["A) Oshodi", "B) Ikeja Underbridge", "C) Ojota Park", "D) NAHCO bus stop"], answer: 1 },
  { id: 371, question: "The convoy arrived at the Murtala Muhammed International Airport (MM2) departure hall at exactly what time?", options: ["A) 3:30 pm", "B) 4:07 pm", "C) 5:00 pm", "D) 6:15 pm"], answer: 1 },
  { id: 372, question: "How much cash did Bepo give to Jide and his sister at the airport?", options: ["A) N2,000", "B) N5,000", "C) N10,000", "D) £50"], answer: 1 },
  { id: 373, question: "What did Mr. Audu jokingly say he was happy about regarding Bepo's departure?", options: ["A) That he could take over as Principal", "B) That he would get Bepo's office", "C) That it wasn't the accountant advising him on what he should borrow", "D) That he didn't have to listen to his grammar corrections anymore"], answer: 2 },
  { id: 374, question: "What proverb did Mrs. Apeh use to explain Audu's intention to borrow money like Bepo did?", options: ["A) 'To borrow a leaf'", "B) 'To cut your coat according to your size'", "C) 'To rob Peter to pay Paul'", "D) 'A snake in the roof'"], answer: 0 },
  { id: 375, question: "Mr. Audu swore he would never cry like 'some people' and would instead slaughter seven cows if he got a visa to which country?", options: ["A) Canada", "B) The USA", "C) Afghanistan", "D) Ukraine"], answer: 2 },
  { id: 376, question: "Where does the CRK teacher, Mr. Oyelana, live?", options: ["A) Ikorodu", "B) Mowe, Ogun State", "C) Ogba", "D) Ojodu"], answer: 1 },
  { id: 377, question: "Where does the Fine Arts teacher, Mr. Audu, live?", options: ["A) Ikorodu", "B) Mowe", "C) Ogba", "D) Ojodu"], answer: 0 },
  { id: 378, question: "Where do the VP (Mrs. Apeh) and the accountant (Mr. Amos) stay, respectively?", options: ["A) Ikeja and Magodo", "B) Ogba and Ojodu", "C) Lekki and Ajah", "D) Surulere and Yaba"], answer: 1 },
  { id: 379, question: "What was Bepo wearing at the airport?", options: ["A) A grey suit", "B) A white T-shirt and a pair of black jeans trousers", "C) A native attire", "D) A tracksuit"], answer: 1 },
  { id: 380, question: "Where did Bepo realize he had forgotten his phone?", options: ["A) On the kitchen counter at home", "B) In his landlord's car", "C) In the inner pocket of his jacket", "D) At the check-in desk"], answer: 2 },
  { id: 381, question: "Whose missed calls did Bepo find most prominently on his phone?", options: ["A) His landlord's", "B) The MD and former colleagues", "C) His wife's", "D) The airline's"], answer: 2 },
  { id: 382, question: "In Bepo's nightmare on the plane, what historical location did he dream he was at?", options: ["A) The Point of No Return in Badagry", "B) The Lamingo Dam", "C) The Shere Hills", "D) The Wase Rocks"], answer: 0 },
  { id: 383, question: "In the nightmare, what were the captives pierced with?", options: ["A) Needles", "B) Red-hot iron", "C) Wooden stakes", "D) Swords"], answer: 1 },
  { id: 384, question: "How many slaves did Bepo count in his dream before the White man pointed at him?", options: ["A) One million", "B) Three million", "C) Five million", "D) Seven million"], answer: 3 },
  { id: 385, question: "What exact command did the White man in the dream yell at Bepo?", options: ["A) 'Move!'", "B) 'Board!'", "C) 'Enter!'", "D) 'Kneel!'"], answer: 2 },
  { id: 386, question: "Who had whispered into Bepo's ears to wake him up from his nightmare?", options: ["A) A White airline official", "B) His wife", "C) A security guard", "D) Sola"], answer: 0 },
  { id: 387, question: "At what exact time did the plane take off, leaving Bepo behind?", options: ["A) 10:00 pm", "B) 10:30 pm", "C) 10:45 pm", "D) 11:00 pm"], answer: 2 },
  { id: 388, question: "On what day do Bepo normally stand at the gate to welcome learners brought by school buses?", options: ["A) Tuesdays and Thursdays", "B) Every Monday and Wednesday", "C) Only on Fridays", "D) Every day"], answer: 1 },
  { id: 389, question: "On the Monday morning after Bepo's supposed departure, who stepped in to address the students?", options: ["A) The MD, Mrs. Gloss", "B) The VP, Mrs. Apeh", "C) Mr. Oyelana", "D) The Chapel Prefect"], answer: 1 },
  { id: 390, question: "During the gloomy Monday assembly, what did the MD assure the students to try and appease them?", options: ["A) That they would get a public holiday", "B) That Bepo would visit them soon", "C) That they will soon have another principal", "D) That the boarding fees would be reduced again"], answer: 2 },
  { id: 391, question: "What was Bepo doing as he rushed towards the students at the end of the novel?", options: ["A) Crying uncontrollably", "B) Grinning, arms wide open, screaming excitedly", "C) Holding his luggage", "D) Dragging his wife along"], answer: 1 },
  { id: 392, question: "What did Bepo shout to confirm he had abandoned his migration plans?", options: ["A) 'I lost my ticket!'", "B) 'I am here! I didn't go! My heart is here!'", "C) 'Nigeria is better than London!'", "D) 'I want to teach!'"], answer: 1 },
  { id: 393, question: "What did the students do to Bepo when he returned?", options: ["A) They clapped for him", "B) They swept him off his feet, bore him high on their shoulders and danced", "C) They ran away in shock", "D) They hugged him one by one"], answer: 1 },
  { id: 394, question: "Which of the following lines is from the Stardom Schools victory song sung at the end?", options: ["A) Arise O Compatriots!", "B) No night so dark! No cloud so mean! Yet Stardom Schools will win!", "C) We are the leaders of tomorrow!", "D) Shine bright like a Stardom star!"], answer: 1 },
  { id: 395, question: "According to the back cover, Akeem Lasisi describes the novel as having a lot of wit, suspense, and even what?", options: ["A) Romance", "B) Mischief", "C) Tragedy", "D) Action"], answer: 1 },
  { id: 396, question: "Who is the poet and publisher of Phenomenal.com.ng who reviewed the book?", options: ["A) Sola Balogun", "B) Tony Okuyeme", "C) Akeem Lasisi", "D) Kabir Alabi Garba"], answer: 2 },
  { id: 397, question: "Sola Balogun, PhD, is a lecturer at which university?", options: ["A) University of Lagos", "B) Federal University, Oye-Ekiti", "C) University of Ibadan", "D) First Technical University"], answer: 1 },
  { id: 398, question: "Sola Balogun states that the novel is not just about the art of literature but also an advocacy in the line of what?", options: ["A) Economics", "B) Patriotism", "C) Migration", "D) Religion"], answer: 1 },
  { id: 399, question: "Tony Okuyeme, who reviewed the book, is the Arts Editor for which publication?", options: ["A) The Punch", "B) The Guardian", "C) New Telegraph", "D) Vanguard"], answer: 2 },
  { id: 400, question: "As an actor, Tony Okuyeme noted that he sees almost every chapter of the novel easily unfolding where?", options: ["A) On screen", "B) On stage", "C) In real life", "D) In a classroom"], answer: 1 },
  { id: 401, question: "How did the author describe Bepo's movement to the podium before he broke down in tears?", options: ["A) He walked briskly", "B) He moved his tall frame rather ponderously", "C) He jogged lightly", "D) He staggered weakly"], answer: 1 },
  { id: 402, question: "When Bepo dropped the microphone, what did it hit to send a vexatious clatter?", options: ["A) The chapel prefect's shoes", "B) The podium desk", "C) The twin sound boxes", "D) The assembly bell"], answer: 2 },
  { id: 403, question: "What Yoruba phrase did a parent claim Bepo kept muttering while weeping uncontrollably?", options: ["A) 'E gba mi o!'", "B) 'Oluwa gba mi o!' (Save me, O God!)", "C) 'O ti pari!'", "D) 'Mo ti gbe!'"], answer: 1 },
  { id: 404, question: "What was the 'shrewd incentive' Stardom management used to try and tame lateness?", options: ["A) Buying more school buses", "B) Fining latecomers N5,000", "C) Lowering boarding fees", "D) Starting assembly later"], answer: 2 },
  { id: 405, question: "After the boarding fee policy change, what time did almost all students begin to turn up for assembly?", options: ["A) 7:00am", "B) 7:30am", "C) 7:45am", "D) 8:05am"], answer: 2 },
  { id: 406, question: "When Mr. Audu joked about the MD being a 'witch and wizard rolled into one', what gesture did he make?", options: ["A) He clapped his hands", "B) He pushed a finger into his mouth, drew it out, and pointed skywards", "C) He prostrated on the floor", "D) He crossed his heart"], answer: 1 },
  { id: 407, question: "How did Ikenna describe Nigeria's beauty in Jos during his assembly speech?", options: ["A) Astonishing beauty", "B) Acrobatic beauty", "C) Majestic beauty", "D) Unrivalled beauty"], answer: 1 },
  { id: 408, question: "During Ikenna's speech about Jos, he mentioned seeing a small rock confidently doing what?", options: ["A) Balancing on a pin", "B) Backing another rock big enough to give birth to it", "C) Shielding a larger rock", "D) Standing upside down"], answer: 1 },
  { id: 409, question: "The students loved when Bepo imitated characters from which old TV drama?", options: ["A) Things Fall Apart", "B) Papa Ajasco", "C) Village Headmaster", "D) Checkmate"], answer: 2 },
  { id: 410, question: "What was the exact WASSCE success rate Stardom Schools had just celebrated prior to Bepo's breakdown?", options: ["A) Over 70 percent", "B) Over 80 percent", "C) Over 90 percent", "D) 100 percent"], answer: 2 },
  { id: 411, question: "The rule at Stardom was that a teacher would be sacked if a student scored F9 in WASSCE or which other exam?", options: ["A) JAMB", "B) NECO", "C) GCE", "D) IGCSE"], answer: 1 },
  { id: 412, question: "What did the MD believe her school was NOT, contrary to how people were acting about Bepo's tears?", options: ["A) A charity organization", "B) A rehabilitation centre", "C) A government parastatal", "D) A playground"], answer: 1 },
  { id: 413, question: "Where did Bepo fetch the card containing his wife's UK phone number from?", options: ["A) His wallet", "B) His briefcase", "C) The breast pocket of his grey suit", "D) His trousers pocket"], answer: 2 },
  { id: 414, question: "What did Pastor Wande advise the MD regarding Bepo going home after his breakdown?", options: ["A) That he should be fired immediately", "B) That he should drive himself", "C) That it might not be a very good idea if he is left to go alone in his circumstance", "D) That they should call the police"], answer: 2 },
  { id: 415, question: "How many days of interrogation passed before Bepo finally opened up about his relocation?", options: ["A) Two days", "B) Three days", "C) Five days", "D) Seven days"], answer: 2 },
  { id: 416, question: "What was Seri's profession in the UK?", options: ["A) A doctor", "B) A nurse", "C) A teacher", "D) An accountant"], answer: 1 },
  { id: 417, question: "What was the uncharitable phrase folks used to describe menial jobs immigrants did abroad?", options: ["A) Scrubbing toilets", "B) Washing corpses", "C) Sweeping snow", "D) Plucking chickens"], answer: 1 },
  { id: 418, question: "Bepo was 51 years old. How many years away from his planned retirement was he?", options: ["A) Two years", "B) Three years", "C) Four years", "D) Five years"], answer: 2 },
  { id: 419, question: "What major principle of entrepreneurship did Bepo recall from his seminars?", options: ["A) The customer is always right", "B) Starting small", "C) High risk, high reward", "D) Location is everything"], answer: 1 },
  { id: 420, question: "Apart from farming and schools, what other business inclination did Bepo have?", options: ["A) Real estate", "B) Commercial transportation", "C) Oil and gas", "D) Banking"], answer: 1 },
  { id: 421, question: "What negative experience did Stardom staff face when they ventured into the transport business?", options: ["A) Government banned their routes", "B) Drivers defaulted, autos broke down, and mechanics colluded to defraud them", "C) They couldn't afford petrol", "D) Passengers refused to enter"], answer: 1 },
  { id: 422, question: "Which two major transport companies did Bepo admire and hope to emulate?", options: ["A) GUO and Peace Mass", "B) ABC and God is Good Motors", "C) Chisco and Young Shall Grow", "D) Libra and GIG"], answer: 1 },
  { id: 423, question: "In the story Bepo read, what question did a UK student ask a Nigerian teacher on his first day?", options: ["A) 'Can you speak English?'", "B) 'Why are you Black?'", "C) 'Are you an idiot?'", "D) 'Are you my new slave?'"], answer: 2 },
  { id: 424, question: "According to Bepo's friend in the USA, how many days a week could one work to earn up to $2,400 a month?", options: ["A) Two days", "B) Three days", "C) Up to four days", "D) Seven days"], answer: 2 },
  { id: 425, question: "What was the prevailing black-market exchange rate Bepo used to calculate his potential earnings?", options: ["A) N1,000", "B) N1,200", "C) N1,500", "D) N1,600"], answer: 3 },
  { id: 426, question: "A Nigerian switched from driving to maintenance in the US and earned how much daily?", options: ["A) $100", "B) $250", "C) $500", "D) $1,000"], answer: 2 },
  { id: 427, question: "What type of visa was noted to largely allow students to travel with their spouses and children?", options: ["A) Tourist visa", "B) Work visa", "C) Education visa", "D) Medical visa"], answer: 2 },
  { id: 428, question: "To fund their Japa dreams, what did the 'classical rogues' sell that did not belong to them?", options: ["A) School properties", "B) Government assets", "C) Houses, land, cars, as well as office and home furniture", "D) Their parents' jewelry"], answer: 2 },
  { id: 429, question: "How long had Sola been in the UK before Bepo confided in her?", options: ["A) About two months", "B) About four months", "C) About six months", "D) About one year"], answer: 2 },
  { id: 430, question: "Why was Sola's husband not under much financial pressure in the UK?", options: ["A) He had a rich uncle", "B) Sola was working while he pursued his Master's", "C) He won the lottery", "D) The government paid him"], answer: 1 },
  { id: 431, question: "Sola told Bepo she and her husband had changed jobs how many times since arriving?", options: ["A) Once", "B) Twice", "C) More than three times", "D) Five times"], answer: 2 },
  { id: 432, question: "Why did some elite parents at Stardom complain when fees were too cheap?", options: ["A) They thought the education quality would drop", "B) They felt the fees were 'paltry' and did not want their children mixing with folks from low society", "C) They thought the school was going bankrupt", "D) They wanted more excursions"], answer: 1 },
  { id: 433, question: "Who was the young chap that abandoned his banking job, only to burst into tears when caring for an old couple in London?", options: ["A) Hope", "B) Jare", "C) Ige", "D) Banky"], answer: 1 },
  { id: 434, question: "How long did it take Riike to buy two houses in Ibadan while working in the US?", options: ["A) One year", "B) Less than three years", "C) Five years", "D) Ten years"], answer: 1 },
  { id: 435, question: "The academic who returned empty-handed after 20 years in the US returned to which specific town?", options: ["A) Ikole, in Ekiti State", "B) Ado-Ekiti", "C) Ogbomoso", "D) Ilesha"], answer: 0 },
  { id: 436, question: "At what age did Akindele migrate to the US?", options: ["A) 45", "B) 50", "C) 55", "D) 60"], answer: 2 },
  { id: 437, question: "What specific insect did Bepo compare his fair complexion to?", options: ["A) The monarch butterfly", "B) The salamo ant", "C) The golden spider", "D) The yellow wasp"], answer: 1 },
  { id: 438, question: "Why did the salamo ant never bite Bepo when his family harvested kola nuts?", options: ["A) Because he wore thick clothes", "B) Because his skin bore the same colour as theirs", "C) Because he used an insect repellent", "D) Because he didn't climb the trees"], answer: 1 },
  { id: 439, question: "Mr. Ibe Ignatius was a manager in what type of firm before planning to Japa?", options: ["A) An oil firm", "B) A banking firm", "C) A telecommunications firm", "D) An engineering firm"], answer: 0 },
  { id: 440, question: "What was Mrs. Ignatius's former job before she pulled out to learn hairdressing for Canada?", options: ["A) A teacher", "B) A clerical officer", "C) A nurse", "D) A caterer"], answer: 1 },
  { id: 441, question: "What was the name of Favour's brother who started asking disturbing questions about their visa delay?", options: ["A) Ibe", "B) Jide", "C) Iyi", "D) Tosh"], answer: 2 },
  { id: 442, question: "Where was Mrs. Mary Ladele's husband, Dele, working when the 'Mr. Wala' incident happened?", options: ["A) Lagos", "B) Port Harcourt", "C) Abuja", "D) London"], answer: 2 },
  { id: 443, question: "In the movie Mrs. Ladele was watching, Dr. Ajayi was performing a Caesarean Section at which hospital?", options: ["A) Legacy Memorial Hospital", "B) General Hospital", "C) St. Nicholas Hospital", "D) Heritage Hospital"], answer: 0 },
  { id: 444, question: "The derogatory Yoruba appellation 'Owala' refers to a person with what?", options: ["A) Bad breath", "B) Wild facial marks", "C) A limp", "D) A stutter"], answer: 1 },
  { id: 445, question: "Stardom Schools comprised a total of how many folks (students and staff)?", options: ["A) About 500", "B) About 1,000", "C) About 1,500", "D) About 2,000"], answer: 2 },
  { id: 446, question: "Where was the MD's secret getaway room located?", options: ["A) In the basement", "B) In her spacious office", "C) Near the sickbay", "D) In the Stardom Hub building"], answer: 1 },
  { id: 447, question: "When the MD approached the back gate, what did she command the second security guard to do?", options: ["A) Open the gate wider", "B) Remain at their duty post", "C) Call the principal", "D) Arrest the drivers"], answer: 1 },
  { id: 448, question: "What color were the two commercial buses the MD saw parked on the school's land?", options: ["A) Both were yellow", "B) One white, one yellow", "C) Both were white", "D) One green, one yellow"], answer: 1 },
  { id: 449, question: "Who was the Chairman of the Stardom Board of Directors?", options: ["A) Mrs. Ibidun Gloss", "B) Chief Mrs. Solape Bayo", "C) Martins Bayo", "D) Oye Bayo"], answer: 1 },
  { id: 450, question: "When was the best-dressed teacher identified and presented with an award at Stardom?", options: ["A) Every Friday", "B) At the end of a term", "C) At the end of a session", "D) During Open Day"], answer: 2 },
  { id: 451, question: "What specific gift did Mrs. Nike Gbayi usually bring for the school during Open Day?", options: ["A) Packets of biscuits", "B) Packets of beverages", "C) Cartons of wine", "D) Reams of paper"], answer: 1 },
  { id: 452, question: "Mrs. Nike Gbayi's husband worked in what type of company?", options: ["A) An oil company", "B) A leading beverages company", "C) A bank", "D) A telecommunications firm"], answer: 1 },
  { id: 453, question: "What is the English translation of the Hausa proverb 'kullum ta barawo, rana daya ta mai kaya'?", options: ["A) Every day for the thief, one day for the owner", "B) A thief always returns to the scene", "C) What you sow is what you reap", "D) The guilty run when no one pursues"], answer: 0 },
  { id: 454, question: "What kind of house did Bepo live in when he stayed in Iyana Ipaja?", options: ["A) A duplex", "B) A crowded face-me-I-face-you house", "C) A self-contain", "D) A boys' quarters"], answer: 1 },
  { id: 455, question: "How much was the NEPA tariff Bepo 'ate' during his financial drought?", options: ["A) N1,500", "B) N2,500", "C) N5,000", "D) N10,000"], answer: 1 },
  { id: 456, question: "Why did a parent sue the school regarding his daughter's good handwriting?", options: ["A) She was asked to forge documents", "B) She was asked to scribble notes on the marker board for others to copy, bordering on exploitation", "C) She was forced to write exams for others", "D) She was punished for writing too slowly"], answer: 1 },
  { id: 457, question: "In the handwriting lawsuit, what did the parent accuse the teacher's 'corrosive eyes' of doing?", options: ["A) Glaring at her angrily", "B) Making her go blind", "C) Sexually leering at her as she stood in front of the class", "D) Intimidating her into silence"], answer: 2 },
  { id: 458, question: "How was the handwriting lawsuit settled by the school?", options: ["A) The teacher was jailed", "B) It was settled out of court, and the student was compensated with one tuition-free term", "C) The school won the case", "D) The student was expelled"], answer: 1 },
  { id: 459, question: "To illustrate the housing crisis, Bepo noted that a government-built two-bedroom flat cost about how much?", options: ["A) N5 million", "B) N10 million", "C) N15 million", "D) N20 million"], answer: 1 },
  { id: 460, question: "When the staff heard about Fafore's sack, what did the Agric teacher, Mr. Obi, ask them?", options: ["A) 'Can we protest?'", "B) 'What power do you have to change anything?'", "C) 'Should we write a petition?'", "D) 'Who will teach his class?'"], answer: 1 },
  { id: 461, question: "Where did the MD angrily say illiterate teachers should go?", options: ["A) Back to university", "B) To the village", "C) To the woman from whom they buy onions and pepper in Obalende", "D) To a public school"], answer: 2 },
  { id: 462, question: "How many notebooks did Mrs. Ibidun Gloss collect from Fafore's class to check for errors?", options: ["A) Two", "B) Three", "C) Five", "D) Ten"], answer: 2 },
  { id: 463, question: "During the MD's query of Fafore, who was seated to the left of the MD?", options: ["A) Bepo", "B) The VP", "C) The secretary", "D) Mr. Guta"], answer: 2 },
  { id: 464, question: "According to Bepo's grammar lesson, when you use 'as well as', the clause is in what mood?", options: ["A) Indicative mood", "B) Imperative mood", "C) Subjunctive mood", "D) Conditional mood"], answer: 2 },
  { id: 465, question: "Who was the Director of Beesway Group of School?", options: ["A) Mr. Egi Meko", "B) Chief David Aje", "C) Mr. Ogo", "D) Chief Waliem"], answer: 0 },
  { id: 466, question: "How did the Beesway Director justify the grammatically incorrect name 'Group of School'?", options: ["A) He said it sounded more British", "B) He claimed the name was divinely inspired", "C) He said it was a typographical error", "D) He said it saved money on signage"], answer: 1 },
  { id: 467, question: "What phrase erroneously used by the Beesway Director made Bepo skip a breath?", options: ["A) 'More better'", "B) 'Talk less'", "C) 'Off head'", "D) 'Revert back'"], answer: 2 },
  { id: 468, question: "Where did the Beesway Director threaten Bepo by saying 'You can choose between working here or criticising the name of the school that pays your salary'?", options: ["A) In the staff room", "B) In his office after the PTA meeting", "C) On the assembly ground", "D) Over the phone"], answer: 1 },
  { id: 469, question: "Before joining the Truth Tellers Mission, Bepo was originally a member of what faith?", options: ["A) Anglican", "B) Methodist", "C) Catholic", "D) Pentecostal"], answer: 2 },
  { id: 470, question: "On the night of the ritual at Beesway, what time had Bepo forced himself to bed?", options: ["A) 10:00 pm", "B) 11:00 pm", "C) 12:00 am", "D) 1:00 am"], answer: 2 },
  { id: 471, question: "How many men did Bepo initially spot digging the pit for the cow in the darkness?", options: ["A) Two", "B) Three", "C) Five", "D) Seven"], answer: 2 },
  { id: 472, question: "What item of clothing lay beside Bepo's pillow that he put on before confronting the ritualists?", options: ["A) A sweater", "B) A T-shirt", "C) A jacket", "D) A raincoat"], answer: 1 },
  { id: 473, question: "To up their game against competitors, what did Fruitful Future use instead of chalkboards?", options: ["A) Smartboards", "B) Marker boards", "C) Projectors", "D) Glass boards"], answer: 1 },
  { id: 474, question: "The well-reported school, Heroes Haven, offered a two-bedroom apartment to teachers who spent up to how many years in the school?", options: ["A) 5 years", "B) 10 years", "C) 15 years", "D) 20 years"], answer: 2 },
  { id: 475, question: "What did Mr. Ogo propose sprinkling at the corners of Fruitful Future to magically flood the school with pupils?", options: ["A) Holy water", "B) A few grains of corn", "C) Salt", "D) Incense"], answer: 1 },
  { id: 476, question: "What time did Bepo's phone ring from the Beesway Director the morning after the assault?", options: ["A) 7:00 am", "B) 8:00 am", "C) 9:07 am", "D) 10:00 am"], answer: 2 },
  { id: 477, question: "What excuse did the Beesway Director give for burying the cow?", options: ["A) To fertilize the soil", "B) It was a special prayer for his late father who had given him the land", "C) It was an agricultural experiment", "D) The cow was diseased"], answer: 1 },
  { id: 478, question: "How much did the intent form for Head Boy/Head Girl cost at Stardom?", options: ["A) N25,000", "B) N40,000", "C) N50,000", "D) N100,000"], answer: 2 },
  { id: 479, question: "Tosh and Banky first clashed fiercely in JSS 3 during what school event?", options: ["A) Inter-house sports", "B) End-of-year party", "C) Speech Day", "D) Excursion to Jos"], answer: 1 },
  { id: 480, question: "What was the objective of the Breath Project created by the Invention Club?", options: ["A) A water purification system", "B) A phone-making initiative using recycled panels and chips", "C) A solar-powered car", "D) An agricultural drone"], answer: 1 },
  { id: 481, question: "Which NGO committed funds to the development of the Breath Project?", options: ["A) Save the Children", "B) Life Grid", "C) OYASAF", "D) Tech Cares"], answer: 1 },
  { id: 482, question: "Bepo argued that participation in the Invention Club was not necessarily limited to students of which discipline?", options: ["A) Arts", "B) Commercial", "C) Science", "D) Vocational"], answer: 2 },
  { id: 483, question: "The JSS 1 'Welcome to Stardom' excursion to Badagry described it as the city of what?", options: ["A) Slaves and chains", "B) White sand and coconuts", "C) History and culture", "D) Palm oil and fish"], answer: 1 },
  { id: 484, question: "Who discussed using the Ikogosi Warm Springs to build a Youth Camp with the Nigerian Baptist Convention?", options: ["A) Ajayi Crowther", "B) Rev. John S. McGee", "C) Henry Townsend", "D) Lord Lugard"], answer: 1 },
  { id: 485, question: "The Erin-Ijesha Waterfalls is also known by what traditional name?", options: ["A) Olumirin", "B) Gurara", "C) Assop", "D) Arinta"], answer: 0 },
  { id: 486, question: "Where is the Hanging Lake, which Stardom students visited, located?", options: ["A) Ikogosi, Ekiti", "B) Ado Awaye, Oyo State", "C) Gembu, Taraba", "D) Kafanchan, Kaduna"], answer: 1 },
  { id: 487, question: "Which museum in Badagry was originally built by an ex-slave who turned into a slave trader?", options: ["A) Black Heritage Museum", "B) Mobee Royal Family Museum", "C) Seriki Abass Slave Museum", "D) First Storey Building"], answer: 2 },
  { id: 488, question: "In what year was the first primary school in Nigeria (Nursery of Infant Church) established in Badagry?", options: ["A) 1820", "B) 1843", "C) 1852", "D) 1900"], answer: 1 },
  { id: 489, question: "Why had Bepo not renewed his passport when it expired two years earlier?", options: ["A) He had no money", "B) He developed a phobia for the renewal, new rules, and non-availability of booklets", "C) He lost his birth certificate", "D) His wife told him not to"], answer: 1 },
  { id: 490, question: "To avoid the massive crowds in Ikoyi or Ikeja, Bepo settled for an agent in which city?", options: ["A) Abeokuta", "B) Ibadan", "C) Osogbo", "D) Ilorin"], answer: 1 },
  { id: 491, question: "While travelling to Ibadan, Bepo was worried that bandits had relocated from the North to which region?", options: ["A) The South-East", "B) The South-South", "C) The South-West", "D) The Middle Belt"], answer: 2 },
  { id: 492, question: "As Bepo drove past, he thought which state prided itself as possibly hosting the highest number of universities in the country?", options: ["A) Lagos State", "B) Oyo State", "C) Ogun State", "D) Osun State"], answer: 2 },
  { id: 493, question: "Who is the author of the poem 'Ibadan' that Bepo searched for on Google?", options: ["A) Wole Soyinka", "B) J.P. Clark", "C) Chinua Achebe", "D) Gabriel Okara"], answer: 1 },
  { id: 494, question: "What exact time did Bepo arrive at the passport office in Agodi, feeling proud of the 'Ibadan miracle of commuting'?", options: ["A) 6:00 am", "B) 6:40 am", "C) 7:00 am", "D) 7:30 am"], answer: 1 },
  { id: 495, question: "Bepo woke up late at 6:05 am because his wife kept him on a lengthy phone call until what time?", options: ["A) 1:00 am", "B) 2:00 am", "C) 3:00 am", "D) 4:00 am"], answer: 2 },
  { id: 496, question: "What was the exact subtitle written on Bepo's 3-D farewell banner?", options: ["A) 'Goodbye to the Best Teacher'", "B) 'Memorable Farewell for a Most Committed Principal, Adebepo Adewale'", "C) 'The Lekki Headmaster Retires'", "D) 'Wishing You Success in the UK'"], answer: 1 },
  { id: 497, question: "How much did Stardom Schools pay as a fine to Emirates airline to shift Bepo's flight by a week?", options: ["A) $50", "B) $100", "C) $150", "D) $200"], answer: 1 },
  { id: 498, question: "During the comedy skits, students recalled Bepo's famous saying: 'If you say education is too expensive...'", options: ["A) '...try ignorance!'", "B) '...try business!'", "C) '...try illiteracy!'", "D) '...try farming!'"], answer: 0 },
  { id: 499, question: "During the cultural dances, which instrument was notably unavailable, forcing the Bata dancers to improvise with the djembe?", options: ["A) The talking drum", "B) The Bata drum", "C) The Ogene", "D) The flute"], answer: 1 },
  { id: 500, question: "At the airport on his final day, what time did the check-in process start for Bepo's flight?", options: ["A) 4:00 pm", "B) 5:00 pm", "C) 5:30 pm", "D) 8:00 pm"], answer: 2 }
  // ... Add the rest of your questions here
];

const allCategoryData = [
  { "id": 1, "chapter": "Back Cover" },
  { "id": 2, "chapter": "Chapter 11" },
  { "id": 3, "chapter": "Chapter 1" },
  { "id": 4, "chapter": "Chapter 2" },
  { "id": 5, "chapter": "Chapter 1" },
  { "id": 6, "chapter": "Chapter 1" },
  { "id": 7, "chapter": "Chapter 1" },
  { "id": 8, "chapter": "Chapter 1" },
  { "id": 9, "chapter": "Chapter 2" },
  { "id": 10, "chapter": "Chapter 2" },
  { "id": 11, "chapter": "Chapter 2" },
  { "id": 12, "chapter": "Chapter 2" },
  { "id": 13, "chapter": "Chapter 7" },
  { "id": 14, "chapter": "Chapter 1" },
  { "id": 15, "chapter": "Chapter 2" },
  { "id": 16, "chapter": "Chapter 2" },
  { "id": 17, "chapter": "Chapter 2" },
  { "id": 18, "chapter": "Chapter 3" },
  { "id": 19, "chapter": "Chapter 3" },
  { "id": 20, "chapter": "Chapter 3" },
  { "id": 21, "chapter": "Chapter 4" },
  { "id": 22, "chapter": "Chapter 4" },
  { "id": 23, "chapter": "Chapter 4" },
  { "id": 24, "chapter": "Chapter 4" },
  { "id": 25, "chapter": "Chapter 4" },
  { "id": 26, "chapter": "Chapter 4" },
  { "id": 27, "chapter": "Chapter 4" },
  { "id": 28, "chapter": "Chapter 4" },
  { "id": 29, "chapter": "Chapter 5" },
  { "id": 30, "chapter": "Chapter 5" },
  { "id": 31, "chapter": "Chapter 5" },
  { "id": 32, "chapter": "Chapter 5" },
  { "id": 33, "chapter": "Chapter 5" },
  { "id": 34, "chapter": "Chapter 5" },
  { "id": 35, "chapter": "Chapter 5" },
  { "id": 36, "chapter": "Chapter 6" },
  { "id": 37, "chapter": "Chapter 6" },
  { "id": 38, "chapter": "Chapter 9" },
  { "id": 39, "chapter": "Chapter 7" },
  { "id": 40, "chapter": "Chapter 7" },
  { "id": 41, "chapter": "Chapter 7" },
  { "id": 42, "chapter": "Chapter 7" },
  { "id": 43, "chapter": "Chapter 7" },
  { "id": 44, "chapter": "Chapter 7" },
  { "id": 45, "chapter": "Chapter 8" },
  { "id": 46, "chapter": "Chapter 8" },
  { "id": 47, "chapter": "Chapter 8" },
  { "id": 48, "chapter": "Chapter 10" },
  { "id": 49, "chapter": "Chapter 10" },
  { "id": 50, "chapter": "Chapter 10" },
  { "id": 51, "chapter": "Chapter 9" },
  { "id": 52, "chapter": "Chapter 9" },
  { "id": 53, "chapter": "Chapter 12" },
  { "id": 54, "chapter": "Chapter 12" },
  { "id": 55, "chapter": "Chapter 12" },
  { "id": 56, "chapter": "Chapter 12" },
  { "id": 57, "chapter": "Chapter 12" },
  { "id": 58, "chapter": "Chapter 12" },
  { "id": 59, "chapter": "Chapter 12" },
  { "id": 60, "chapter": "Chapter 12" },
  { "id": 61, "chapter": "Chapter 12" },
  { "id": 62, "chapter": "Chapter 11" },
  { "id": 63, "chapter": "Chapter 11" },
  { "id": 64, "chapter": "Chapter 11" },
  { "id": 65, "chapter": "Chapter 9" },
  { "id": 66, "chapter": "Chapter 8" },
  { "id": 67, "chapter": "Chapter 12" },
  { "id": 68, "chapter": "Chapter 12" },
  { "id": 69, "chapter": "Chapter 12" },
  { "id": 70, "chapter": "Chapter 2" },
  { "id": 71, "chapter": "Chapter 2" },
  { "id": 72, "chapter": "Chapter 10" },
  { "id": 73, "chapter": "Chapter 6" },
  { "id": 74, "chapter": "Chapter 3" },
  { "id": 75, "chapter": "Chapter 12" },
  { "id": 76, "chapter": "Chapter 6" },
  { "id": 77, "chapter": "Chapter 11" },
  { "id": 78, "chapter": "Chapter 3" },
  { "id": 79, "chapter": "Chapter 3" },
  { "id": 80, "chapter": "Chapter 5" },
  { "id": 81, "chapter": "Chapter 1" },
  { "id": 82, "chapter": "Chapter 1" },
  { "id": 83, "chapter": "Chapter 1" },
  { "id": 84, "chapter": "Chapter 3" },
  { "id": 85, "chapter": "Chapter 6" },
  { "id": 86, "chapter": "Chapter 4" },
  { "id": 87, "chapter": "Chapter 3" },
  { "id": 88, "chapter": "Chapter 11" },
  { "id": 89, "chapter": "Chapter 1" },
  { "id": 90, "chapter": "Chapter 9" },
  { "id": 91, "chapter": "Chapter 9" },
  { "id": 92, "chapter": "Chapter 5" },
  { "id": 93, "chapter": "Chapter 8" },
  { "id": 94, "chapter": "Chapter 8" },
  { "id": 95, "chapter": "Chapter 12" },
  { "id": 96, "chapter": "Chapter 4" },
  { "id": 97, "chapter": "Chapter 1" },
  { "id": 98, "chapter": "Chapter 8" },
  { "id": 99, "chapter": "Chapter 8" },
  { "id": 100, "chapter": "Chapter 12" },
  { "id": 101, "chapter": "Chapter 1" },
  { "id": 102, "chapter": "Chapter 1" },
  { "id": 103, "chapter": "Chapter 1" },
  { "id": 104, "chapter": "Chapter 1" },
  { "id": 105, "chapter": "Chapter 1" },
  { "id": 106, "chapter": "Chapter 1" },
  { "id": 107, "chapter": "Chapter 1" },
  { "id": 108, "chapter": "Chapter 1" },
  { "id": 109, "chapter": "Chapter 1" },
  { "id": 110, "chapter": "Chapter 1" },
  { "id": 111, "chapter": "Chapter 3" },
  { "id": 112, "chapter": "Chapter 3" },
  { "id": 113, "chapter": "Chapter 3" },
  { "id": 114, "chapter": "Chapter 3" },
  { "id": 115, "chapter": "Chapter 3" },
  { "id": 116, "chapter": "Chapter 3" },
  { "id": 117, "chapter": "Chapter 3" },
  { "id": 118, "chapter": "Chapter 4" },
  { "id": 119, "chapter": "Chapter 4" },
  { "id": 120, "chapter": "Chapter 4" },
  { "id": 121, "chapter": "Chapter 4" },
  { "id": 122, "chapter": "Chapter 4" },
  { "id": 123, "chapter": "Chapter 5" },
  { "id": 124, "chapter": "Chapter 5" },
  { "id": 125, "chapter": "Chapter 6" },
  { "id": 126, "chapter": "Chapter 6" },
  { "id": 127, "chapter": "Chapter 6" },
  { "id": 128, "chapter": "Chapter 6" },
  { "id": 129, "chapter": "Chapter 6" },
  { "id": 130, "chapter": "Chapter 6" },
  { "id": 131, "chapter": "Chapter 6" },
  { "id": 132, "chapter": "Chapter 6" },
  { "id": 133, "chapter": "Chapter 6" },
  { "id": 134, "chapter": "Chapter 7" },
  { "id": 135, "chapter": "Chapter 7" },
  { "id": 136, "chapter": "Chapter 7" },
  { "id": 137, "chapter": "Chapter 7" },
  { "id": 138, "chapter": "Chapter 7" },
  { "id": 139, "chapter": "Chapter 7" },
  { "id": 140, "chapter": "Chapter 7" },
  { "id": 141, "chapter": "Chapter 7" },
  { "id": 142, "chapter": "Chapter 7" },
  { "id": 143, "chapter": "Chapter 8" },
  { "id": 144, "chapter": "Chapter 8" },
  { "id": 145, "chapter": "Chapter 8" },
  { "id": 146, "chapter": "Chapter 8" },
  { "id": 147, "chapter": "Chapter 8" },
  { "id": 148, "chapter": "Chapter 8" },
  { "id": 149, "chapter": "Chapter 9" },
  { "id": 150, "chapter": "Chapter 9" },
  { "id": 151, "chapter": "Chapter 9" },
  { "id": 152, "chapter": "Chapter 9" },
  { "id": 153, "chapter": "Chapter 9" },
  { "id": 154, "chapter": "Chapter 9" },
  { "id": 155, "chapter": "Chapter 9" },
  { "id": 156, "chapter": "Chapter 9" },
  { "id": 157, "chapter": "Chapter 10" },
  { "id": 158, "chapter": "Chapter 10" },
  { "id": 159, "chapter": "Chapter 10" },
  { "id": 160, "chapter": "Chapter 10" },
  { "id": 161, "chapter": "Chapter 10" },
  { "id": 162, "chapter": "Chapter 10" },
  { "id": 163, "chapter": "Chapter 10" },
  { "id": 164, "chapter": "Chapter 10" },
  { "id": 165, "chapter": "Chapter 11" },
  { "id": 166, "chapter": "Chapter 11" },
  { "id": 167, "chapter": "Chapter 11" },
  { "id": 168, "chapter": "Chapter 11" },
  { "id": 169, "chapter": "Chapter 11" },
  { "id": 170, "chapter": "Chapter 11" },
  { "id": 171, "chapter": "Chapter 11" },
  { "id": 172, "chapter": "Chapter 12" },
  { "id": 173, "chapter": "Chapter 12" },
  { "id": 174, "chapter": "Chapter 12" },
  { "id": 175, "chapter": "Chapter 12" },
  { "id": 176, "chapter": "Chapter 12" },
  { "id": 177, "chapter": "Chapter 12" },
  { "id": 178, "chapter": "Chapter 12" },
  { "id": 179, "chapter": "Chapter 12" },
  { "id": 180, "chapter": "Chapter 12" },
  { "id": 181, "chapter": "Chapter 12" },
  { "id": 182, "chapter": "Chapter 12" },
  { "id": 183, "chapter": "Chapter 12" },
  { "id": 184, "chapter": "Chapter 12" },
  { "id": 185, "chapter": "Chapter 12" },
  { "id": 186, "chapter": "Chapter 12" },
  { "id": 187, "chapter": "Chapter 12" },
  { "id": 188, "chapter": "Chapter 12" },
  { "id": 189, "chapter": "Chapter 1" },
  { "id": 190, "chapter": "Chapter 3" },
  { "id": 191, "chapter": "Chapter 3" },
  { "id": 192, "chapter": "Chapter 4" },
  { "id": 193, "chapter": "Chapter 4" },
  { "id": 194, "chapter": "Chapter 6" },
  { "id": 195, "chapter": "Chapter 6" },
  { "id": 196, "chapter": "Chapter 6" },
  { "id": 197, "chapter": "Chapter 11" },
  { "id": 198, "chapter": "Chapter 11" },
  { "id": 199, "chapter": "Chapter 11" },
  { "id": 200, "chapter": "Chapter 11" },
  { "id": 201, "chapter": "Chapter 1" },
  { "id": 202, "chapter": "Chapter 1" },
  { "id": 203, "chapter": "Chapter 1" },
  { "id": 204, "chapter": "Chapter 1" },
  { "id": 205, "chapter": "Chapter 1" },
  { "id": 206, "chapter": "Chapter 1" },
  { "id": 207, "chapter": "Chapter 1" },
  { "id": 208, "chapter": "Chapter 1" },
  { "id": 209, "chapter": "Chapter 1" },
  { "id": 210, "chapter": "Chapter 2" },
  { "id": 211, "chapter": "Chapter 3" },
  { "id": 212, "chapter": "Chapter 3" },
  { "id": 213, "chapter": "Chapter 3" },
  { "id": 214, "chapter": "Chapter 3" },
  { "id": 215, "chapter": "Chapter 3" },
  { "id": 216, "chapter": "Chapter 3" },
  { "id": 217, "chapter": "Chapter 3" },
  { "id": 218, "chapter": "Chapter 3" },
  { "id": 219, "chapter": "Chapter 3" },
  { "id": 220, "chapter": "Chapter 3" },
  { "id": 221, "chapter": "Chapter 3" },
  { "id": 222, "chapter": "Chapter 3" },
  { "id": 223, "chapter": "Chapter 4" },
  { "id": 224, "chapter": "Chapter 4" },
  { "id": 225, "chapter": "Chapter 4" },
  { "id": 226, "chapter": "Chapter 4" },
  { "id": 227, "chapter": "Chapter 4" },
  { "id": 228, "chapter": "Chapter 4" },
  { "id": 229, "chapter": "Chapter 4" },
  { "id": 230, "chapter": "Chapter 4" },
  { "id": 231, "chapter": "Chapter 4" },
  { "id": 232, "chapter": "Chapter 4" },
  { "id": 233, "chapter": "Chapter 5" },
  { "id": 234, "chapter": "Chapter 5" },
  { "id": 235, "chapter": "Chapter 5" },
  { "id": 236, "chapter": "Chapter 5" },
  { "id": 237, "chapter": "Chapter 5" },
  { "id": 238, "chapter": "Chapter 5" },
  { "id": 239, "chapter": "Chapter 6" },
  { "id": 240, "chapter": "Chapter 6" },
  { "id": 241, "chapter": "Chapter 6" },
  { "id": 242, "chapter": "Chapter 6" },
  { "id": 243, "chapter": "Chapter 6" },
  { "id": 244, "chapter": "Chapter 6" },
  { "id": 245, "chapter": "Chapter 6" },
  { "id": 246, "chapter": "Chapter 6" },
  { "id": 247, "chapter": "Chapter 6" },
  { "id": 248, "chapter": "Chapter 6" },
  { "id": 249, "chapter": "Chapter 6" },
  { "id": 250, "chapter": "Chapter 6" },
  { "id": 251, "chapter": "Chapter 6" },
  { "id": 252, "chapter": "Chapter 7" },
  { "id": 253, "chapter": "Chapter 7" },
  { "id": 254, "chapter": "Chapter 7" },
  { "id": 255, "chapter": "Chapter 7" },
  { "id": 256, "chapter": "Chapter 7" },
  { "id": 257, "chapter": "Chapter 7" },
  { "id": 258, "chapter": "Chapter 7" },
  { "id": 259, "chapter": "Chapter 7" },
  { "id": 260, "chapter": "Chapter 7" },
  { "id": 261, "chapter": "Chapter 7" },
  { "id": 262, "chapter": "Chapter 7" },
  { "id": 263, "chapter": "Chapter 7" },
  { "id": 264, "chapter": "Chapter 8" },
  { "id": 265, "chapter": "Chapter 8" },
  { "id": 266, "chapter": "Chapter 8" },
  { "id": 267, "chapter": "Chapter 8" },
  { "id": 268, "chapter": "Chapter 8" },
  { "id": 269, "chapter": "Chapter 8" },
  { "id": 270, "chapter": "Chapter 8" },
  { "id": 271, "chapter": "Chapter 8" },
  { "id": 272, "chapter": "Chapter 9" },
  { "id": 273, "chapter": "Chapter 9" },
  { "id": 274, "chapter": "Chapter 9" },
  { "id": 275, "chapter": "Chapter 9" },
  { "id": 276, "chapter": "Chapter 9" },
  { "id": 277, "chapter": "Chapter 9" },
  { "id": 278, "chapter": "Chapter 9" },
  { "id": 279, "chapter": "Chapter 9" },
  { "id": 280, "chapter": "Chapter 9" },
  { "id": 281, "chapter": "Chapter 9" },
  { "id": 282, "chapter": "Chapter 9" },
  { "id": 283, "chapter": "Chapter 9" },
  { "id": 284, "chapter": "Chapter 9" },
  { "id": 285, "chapter": "Chapter 9" },
  { "id": 286, "chapter": "Chapter 9" },
  { "id": 287, "chapter": "Chapter 9" },
  { "id": 288, "chapter": "Chapter 9" },
  { "id": 289, "chapter": "Chapter 9" },
  { "id": 290, "chapter": "Chapter 9" },
  { "id": 291, "chapter": "Chapter 9" },
  { "id": 292, "chapter": "Chapter 9" },
  { "id": 293, "chapter": "Chapter 10" },
  { "id": 294, "chapter": "Chapter 10" },
  { "id": 295, "chapter": "Chapter 10" },
  { "id": 296, "chapter": "Chapter 10" },
  { "id": 297, "chapter": "Chapter 10" },
  { "id": 298, "chapter": "Chapter 10" },
  { "id": 299, "chapter": "Chapter 10" },
  { "id": 300, "chapter": "Chapter 10" },
  { "id": 301, "chapter": "Chapter 10" },
  { "id": 302, "chapter": "Chapter 10" },
  { "id": 303, "chapter": "Chapter 10" },
  { "id": 304, "chapter": "Chapter 10" },
  { "id": 305, "chapter": "Chapter 10" },
  { "id": 306, "chapter": "Chapter 10" },
  { "id": 307, "chapter": "Chapter 10" },
  { "id": 308, "chapter": "Chapter 10" },
  { "id": 309, "chapter": "Chapter 10" },
  { "id": 310, "chapter": "Chapter 10" },
  { "id": 311, "chapter": "Chapter 10" },
  { "id": 312, "chapter": "Chapter 10" },
  { "id": 313, "chapter": "Chapter 10" },
  { "id": 314, "chapter": "Chapter 10" },
  { "id": 315, "chapter": "Chapter 10" },
  { "id": 316, "chapter": "Chapter 10" },
  { "id": 317, "chapter": "Chapter 10" },
  { "id": 318, "chapter": "Chapter 10" },
  { "id": 319, "chapter": "Chapter 10" },
  { "id": 320, "chapter": "Chapter 10" },
  { "id": 321, "chapter": "Chapter 10" },
  { "id": 322, "chapter": "Chapter 10" },
  { "id": 323, "chapter": "Chapter 11" },
  { "id": 324, "chapter": "Chapter 11" },
  { "id": 325, "chapter": "Chapter 11" },
  { "id": 326, "chapter": "Chapter 11" },
  { "id": 327, "chapter": "Chapter 11" },
  { "id": 328, "chapter": "Chapter 11" },
  { "id": 329, "chapter": "Chapter 11" },
  { "id": 330, "chapter": "Chapter 11" },
  { "id": 331, "chapter": "Chapter 11" },
  { "id": 332, "chapter": "Chapter 11" },
  { "id": 333, "chapter": "Chapter 11" },
  { "id": 334, "chapter": "Chapter 11" },
  { "id": 335, "chapter": "Chapter 11" },
  { "id": 336, "chapter": "Chapter 11" },
  { "id": 337, "chapter": "Chapter 11" },
  { "id": 338, "chapter": "Chapter 11" },
  { "id": 339, "chapter": "Chapter 11" },
  { "id": 340, "chapter": "Chapter 11" },
  { "id": 341, "chapter": "Chapter 11" },
  { "id": 342, "chapter": "Chapter 11" },
  { "id": 343, "chapter": "Chapter 11" },
  { "id": 344, "chapter": "Chapter 11" },
  { "id": 345, "chapter": "Chapter 11" },
  { "id": 346, "chapter": "Chapter 11" },
  { "id": 347, "chapter": "Chapter 11" },
  { "id": 348, "chapter": "Chapter 11" },
  { "id": 349, "chapter": "Chapter 11" },
  { "id": 350, "chapter": "Chapter 11" },
  { "id": 351, "chapter": "Chapter 11" },
  { "id": 352, "chapter": "Chapter 11" },
  { "id": 353, "chapter": "Chapter 12" },
  { "id": 354, "chapter": "Chapter 12" },
  { "id": 355, "chapter": "Chapter 12" },
  { "id": 356, "chapter": "Chapter 12" },
  { "id": 357, "chapter": "Chapter 12" },
  { "id": 358, "chapter": "Chapter 12" },
  { "id": 359, "chapter": "Chapter 12" },
  { "id": 360, "chapter": "Chapter 12" },
  { "id": 361, "chapter": "Chapter 12" },
  { "id": 362, "chapter": "Chapter 12" },
  { "id": 363, "chapter": "Chapter 12" },
  { "id": 364, "chapter": "Chapter 12" },
  { "id": 365, "chapter": "Chapter 12" },
  { "id": 366, "chapter": "Chapter 12" },
  { "id": 367, "chapter": "Chapter 12" },
  { "id": 368, "chapter": "Chapter 12" },
  { "id": 369, "chapter": "Chapter 12" },
  { "id": 370, "chapter": "Chapter 12" },
  { "id": 371, "chapter": "Chapter 12" },
  { "id": 372, "chapter": "Chapter 12" },
  { "id": 373, "chapter": "Chapter 12" },
  { "id": 374, "chapter": "Chapter 12" },
  { "id": 375, "chapter": "Chapter 12" },
  { "id": 376, "chapter": "Chapter 12" },
  { "id": 377, "chapter": "Chapter 12" },
  { "id": 378, "chapter": "Chapter 12" },
  { "id": 379, "chapter": "Chapter 12" },
  { "id": 380, "chapter": "Chapter 12" },
  { "id": 381, "chapter": "Chapter 12" },
  { "id": 382, "chapter": "Chapter 12" },
  { "id": 383, "chapter": "Chapter 12" },
  { "id": 384, "chapter": "Chapter 12" },
  { "id": 385, "chapter": "Chapter 12" },
  { "id": 386, "chapter": "Chapter 12" },
  { "id": 387, "chapter": "Chapter 12" },
  { "id": 388, "chapter": "Chapter 12" },
  { "id": 389, "chapter": "Chapter 12" },
  { "id": 390, "chapter": "Chapter 12" },
  { "id": 391, "chapter": "Chapter 12" },
  { "id": 392, "chapter": "Chapter 12" },
  { "id": 393, "chapter": "Chapter 12" },
  { "id": 394, "chapter": "Chapter 12" },
  { "id": 395, "chapter": "Back Cover" },
  { "id": 396, "chapter": "Back Cover" },
  { "id": 397, "chapter": "Back Cover" },
  { "id": 398, "chapter": "Back Cover" },
  { "id": 399, "chapter": "Back Cover" },
  { "id": 400, "chapter": "Back Cover" },
  { "id": 401, "chapter": "Chapter 1" },
  { "id": 402, "chapter": "Chapter 1" },
  { "id": 403, "chapter": "Chapter 1" },
  { "id": 404, "chapter": "Chapter 1" },
  { "id": 405, "chapter": "Chapter 1" },
  { "id": 406, "chapter": "Chapter 1" },
  { "id": 407, "chapter": "Chapter 1" },
  { "id": 408, "chapter": "Chapter 1" },
  { "id": 409, "chapter": "Chapter 1" },
  { "id": 410, "chapter": "Chapter 1" },
  { "id": 411, "chapter": "Chapter 1" },
  { "id": 412, "chapter": "Chapter 1" },
  { "id": 413, "chapter": "Chapter 1" },
  { "id": 414, "chapter": "Chapter 1" },
  { "id": 415, "chapter": "Chapter 2" },
  { "id": 416, "chapter": "Chapter 2" },
  { "id": 417, "chapter": "Chapter 2" },
  { "id": 418, "chapter": "Chapter 2" },
  { "id": 419, "chapter": "Chapter 2" },
  { "id": 420, "chapter": "Chapter 2" },
  { "id": 421, "chapter": "Chapter 2" },
  { "id": 422, "chapter": "Chapter 2" },
  { "id": 423, "chapter": "Chapter 2" },
  { "id": 424, "chapter": "Chapter 3" },
  { "id": 425, "chapter": "Chapter 3" },
  { "id": 426, "chapter": "Chapter 3" },
  { "id": 427, "chapter": "Chapter 3" },
  { "id": 428, "chapter": "Chapter 3" },
  { "id": 429, "chapter": "Chapter 3" },
  { "id": 430, "chapter": "Chapter 3" },
  { "id": 431, "chapter": "Chapter 3" },
  { "id": 432, "chapter": "Chapter 3" },
  { "id": 433, "chapter": "Chapter 3" },
  { "id": 434, "chapter": "Chapter 3" },
  { "id": 435, "chapter": "Chapter 3" },
  { "id": 436, "chapter": "Chapter 3" },
  { "id": 437, "chapter": "Chapter 4" },
  { "id": 438, "chapter": "Chapter 4" },
  { "id": 439, "chapter": "Chapter 4" },
  { "id": 440, "chapter": "Chapter 4" },
  { "id": 441, "chapter": "Chapter 4" },
  { "id": 442, "chapter": "Chapter 4" },
  { "id": 443, "chapter": "Chapter 4" },
  { "id": 444, "chapter": "Chapter 4" },
  { "id": 445, "chapter": "Chapter 5" },
  { "id": 446, "chapter": "Chapter 5" },
  { "id": 447, "chapter": "Chapter 5" },
  { "id": 448, "chapter": "Chapter 5" },
  { "id": 449, "chapter": "Chapter 5" },
  { "id": 450, "chapter": "Chapter 6" },
  { "id": 451, "chapter": "Chapter 6" },
  { "id": 452, "chapter": "Chapter 6" },
  { "id": 453, "chapter": "Chapter 6" },
  { "id": 454, "chapter": "Chapter 6" },
  { "id": 455, "chapter": "Chapter 6" },
  { "id": 456, "chapter": "Chapter 6" },
  { "id": 457, "chapter": "Chapter 6" },
  { "id": 458, "chapter": "Chapter 6" },
  { "id": 459, "chapter": "Chapter 6" },
  { "id": 460, "chapter": "Chapter 6" },
  { "id": 461, "chapter": "Chapter 6" },
  { "id": 462, "chapter": "Chapter 6" },
  { "id": 463, "chapter": "Chapter 6" },
  { "id": 464, "chapter": "Chapter 6" },
  { "id": 465, "chapter": "Chapter 7" },
  { "id": 466, "chapter": "Chapter 7" },
  { "id": 467, "chapter": "Chapter 7" },
  { "id": 468, "chapter": "Chapter 7" },
  { "id": 469, "chapter": "Chapter 7" },
  { "id": 470, "chapter": "Chapter 7" },
  { "id": 471, "chapter": "Chapter 7" },
  { "id": 472, "chapter": "Chapter 7" },
  { "id": 473, "chapter": "Chapter 7" },
  { "id": 474, "chapter": "Chapter 7" },
  { "id": 475, "chapter": "Chapter 7" },
  { "id": 476, "chapter": "Chapter 7" },
  { "id": 477, "chapter": "Chapter 7" },
  { "id": 478, "chapter": "Chapter 8" },
  { "id": 479, "chapter": "Chapter 8" },
  { "id": 480, "chapter": "Chapter 8" },
  { "id": 481, "chapter": "Chapter 8" },
  { "id": 482, "chapter": "Chapter 8" },
  { "id": 483, "chapter": "Chapter 9" },
  { "id": 484, "chapter": "Chapter 9" },
  { "id": 485, "chapter": "Chapter 9" },
  { "id": 486, "chapter": "Chapter 9" },
  { "id": 487, "chapter": "Chapter 9" },
  { "id": 488, "chapter": "Chapter 9" },
  { "id": 489, "chapter": "Chapter 10" },
  { "id": 490, "chapter": "Chapter 10" },
  { "id": 491, "chapter": "Chapter 10" },
  { "id": 492, "chapter": "Chapter 10" },
  { "id": 493, "chapter": "Chapter 10" },
  { "id": 494, "chapter": "Chapter 10" },
  { "id": 495, "chapter": "Chapter 10" },
  { "id": 496, "chapter": "Chapter 11" },
  { "id": 497, "chapter": "Chapter 11" },
  { "id": 498, "chapter": "Chapter 11" },
  { "id": 499, "chapter": "Chapter 11" },
  { "id": 500, "chapter": "Chapter 12" }
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function App() {
  const [screen, setScreen] = useState("login");
  const [name, setName] = useState("");
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("Random");
  const [deviceToken, setDeviceToken] = useState("");

  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Tracks selected option index for each question
  const [userAnswers, setUserAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [reviewAnswers, setReviewAnswers] = useState([]);

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attemptResult, setAttemptResult] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [hasSavedSession, setHasSavedSession] = useState(false);

  useEffect(() => {
    // 1. Device Token Logic
    let token = localStorage.getItem("utme_device_token");
    if (!token) {
      token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("utme_device_token", token);
    }
    setDeviceToken(token);

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

    const passedIds = JSON.parse(localStorage.getItem("utme_passed_ids") || "[]");
    setPassedCount(passedIds.length);

    const savedSession = localStorage.getItem("utme_quiz_session");
    if (savedSession) {
      setHasSavedSession(true);
    }
  }, []);

  // Save session on important state changes
  useEffect(() => {
    if (screen === "quiz") {
      const sessionData = {
        activeQuestions,
        currentQ,
        userAnswers,
        flaggedQuestions,
        timeLeft,
        selectedCategory,
        numQuestions,
        name
      };
      localStorage.setItem("utme_quiz_session", JSON.stringify(sessionData));
    }
  }, [screen, activeQuestions, currentQ, userAnswers, flaggedQuestions, selectedCategory, numQuestions, name]);

  // Save time separately to throttle localStorage writes if necessary,
  // though every second is okay for this size.
  // Updating to save every 5 seconds to address review feedback.
  useEffect(() => {
    if (screen === "quiz" && timeLeft % 5 === 0) {
      const saved = JSON.parse(localStorage.getItem("utme_quiz_session") || "{}");
      if (saved.activeQuestions) {
        saved.timeLeft = timeLeft;
        localStorage.setItem("utme_quiz_session", JSON.stringify(saved));
      }
    }
  }, [timeLeft, screen]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (screen === "quiz") {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your progress will be saved.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [screen]);

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

  const resumeQuiz = () => {
    const savedSession = localStorage.getItem("utme_quiz_session");
    if (!savedSession) return;

    try {
      const data = JSON.parse(savedSession);
      setActiveQuestions(data.activeQuestions);
      setCurrentQ(data.currentQ);
      setUserAnswers(data.userAnswers);
      setFlaggedQuestions(data.flaggedQuestions);
      setTimeLeft(data.timeLeft);
      setSelectedCategory(data.selectedCategory);
      setNumQuestions(data.numQuestions);
      setName(data.name);
      setScreen("quiz");
    } catch (e) {
      console.error("Error parsing saved session:", e);
      localStorage.removeItem("utme_quiz_session");
      setHasSavedSession(false);
    }
  };

  const startQuiz = async () => {
    if (hasSavedSession) {
      if (!window.confirm("You have an uncompleted session. Starting a new exam will discard it. Continue?")) {
        return;
      }
    }
    const trimmedName = name.trim();
    if (!trimmedName) return alert("Please enter your name!");

    setLoading(true);
    try {
      const safeId = trimmedName.toLowerCase().replace(/\s+/g, "_");
      const { data: existingUser, error } = await supabase
        .from('leaderboard')
        .select('device_token')
        .eq('id', safeId)
        .maybeSingle();

      if (error) throw error;

      if (existingUser && existingUser.device_token && existingUser.device_token !== deviceToken) {
        alert("This username has already been claimed on another device. Please use a different name.");
        setLoading(false);
        return;
      }

      if (!isNameLocked) {
        const expiryTime = new Date().getTime() + (15 * 24 * 60 * 60 * 1000);
        localStorage.setItem("utme_username_lock", JSON.stringify({ name: trimmedName, expiry: expiryTime }));
        setIsNameLocked(true);
      }
    } catch (e) {
      console.error("Error checking username:", e);
      alert("An error occurred. Please check your internet connection.");
      setLoading(false);
      return;
    }
    setLoading(false);

    const passedIds = JSON.parse(localStorage.getItem("utme_passed_ids") || "[]");
    const failedIds = JSON.parse(localStorage.getItem("utme_failed_ids") || "[]");

    let categoryPool = selectedCategory === "Random"
      ? allQuizData
      : allQuizData.filter(q => allCategoryData.find(c => c.id === q.id && c.chapter === selectedCategory));

    let pool = categoryPool.filter(q => !passedIds.includes(q.id));
    if (pool.length === 0) pool = categoryPool;

    const requestedAmount = Math.min(Math.max(Number(numQuestions), 5), pool.length);

    const failedInPool = pool.filter(q => failedIds.includes(q.id));
    const freshInPool = pool.filter(q => !failedIds.includes(q.id));

    const selection = [...shuffleArray(failedInPool), ...shuffleArray(freshInPool)].slice(0, requestedAmount);

    setActiveQuestions(selection);
    setCurrentQ(0);
    setScore(0);
    setUserAnswers(new Array(requestedAmount).fill(null));
    setFlaggedQuestions(new Array(requestedAmount).fill(false));
    setTimeLeft(requestedAmount * 45);
    setScreen("quiz");
  };

  const handleTimeout = () => {
    handleEndQuiz();
  };

  const nextQuestion = () => {
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      handleEndQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  };

  const selectOption = (index) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQ] = index;
    setUserAnswers(updatedAnswers);
  };

  const toggleFlag = () => {
    const updatedFlags = [...flaggedQuestions];
    updatedFlags[currentQ] = !updatedFlags[currentQ];
    setFlaggedQuestions(updatedFlags);
  };

  const handleEndQuiz = async () => {
    localStorage.removeItem("utme_quiz_session");
    setHasSavedSession(false);

    // Calculate final score and prepare format for review
    let finalScore = 0;
    const reviewData = activeQuestions.map((q, i) => {
      const selectedAnswer = userAnswers[i];
      const isCorrect = selectedAnswer === q.answer;
      if (isCorrect) finalScore++;
      return {
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        selectedAnswer: selectedAnswer
      };
    });

    setScore(finalScore);
    setReviewAnswers(reviewData);
    setScreen("result");

    // Update passed/failed tracking
    const passedIds = new Set(JSON.parse(localStorage.getItem("utme_passed_ids") || "[]"));
    const failedIds = new Set(JSON.parse(localStorage.getItem("utme_failed_ids") || "[]"));

    reviewData.forEach(ans => {
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
    setPassedCount(passedIds.size);

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
        last_attempt: new Date().toISOString(),
        device_token: deviceToken
      });

      // Clear leaderboard cache so the next view gets fresh data
      localStorage.removeItem("utme_leaderboard_cache");
    } catch (e) {
      console.error("Critical error saving to Supabase:", e);
    }
    setLoading(false);
  };

  const fetchLeaderboard = async () => {
    setScreen("leaderboard");

    // Check Cache
    const cached = localStorage.getItem("utme_leaderboard_cache");
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = new Date().getTime();
      if (now - timestamp < 5 * 60 * 1000) { // 5 minutes cache
        setLeaderboard(data);
        return;
      }
    }

    setLoading(true);
    try {
      const { data } = await supabase.from('leaderboard').select('*').order('average_percentage', { ascending: false });
      if (data) {
        setLeaderboard(data);
        localStorage.setItem("utme_leaderboard_cache", JSON.stringify({
          data,
          timestamp: new Date().getTime()
        }));
      }
    } catch (e) {
      console.error("Error fetching from Supabase:", e);
    }
    setLoading(false);
  };

  const shareToWhatsApp = () => {
    const message = `I just scored ${score}/${activeQuestions.length} (${attemptResult}%) on the UTME Prep - The Lekki Headmaster mock exam! Think you can beat my score? Try it here: https://v0-utme-lekki.vercel.app/`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Filter out only the wrong answers for the Review Screen
  const wrongAnswers = useMemo(() =>
    reviewAnswers.filter(ans => ans.selectedAnswer !== ans.correctAnswer),
    [reviewAnswers]
  );

  const categories = useMemo(() =>
    ["Random", ...new Set(allCategoryData.map(c => c.chapter))],
    []
  );

  const poolInfo = useMemo(() => {
    const passedIds = JSON.parse(localStorage.getItem("utme_passed_ids") || "[]");
    const categoryPool = selectedCategory === "Random"
      ? allQuizData
      : allQuizData.filter(q => allCategoryData.find(c => c.id === q.id && c.chapter === selectedCategory));

    const unanswered = categoryPool.filter(q => !passedIds.includes(q.id));
    return {
      questions: unanswered.length > 0 ? unanswered : categoryPool,
      isMastered: unanswered.length === 0,
      unansweredCount: unanswered.length,
      totalCount: categoryPool.length
    };
  }, [selectedCategory, passedCount]);

  useEffect(() => {
    const max = poolInfo.questions.length;
    if (numQuestions > max) {
      setNumQuestions(max);
    }
  }, [poolInfo.questions.length]);

  return (
    <div className="container">
      {/* 1. LOGIN SCREEN */}
      {screen === "login" && (
        <>
          <h1>UTME Mock Exam</h1>
          <h2>The Lekki Headmaster</h2>

          <div className="notification-banner">
            📖 <strong>JAMB Special:</strong> Get the summarized story with key details that JAMB loves!
            <a href="https://litter.catbox.moe/9e1xdbq321r9bj6i.pdf" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "5px", color: "#e65100", fontWeight: "bold" }}>
              Download PDF Summary
            </a>
          </div>

          {isNameLocked ? (
            <p style={{ color: "#d32f2f", fontWeight: "bold", fontSize: "0.9rem" }}>
              🔒 Your name is locked to this device for 15 days.
            </p>
          ) : (
            <p>Enter your real name. It will be locked for 15 days!</p>
          )}

          <input type="text" placeholder="Enter your full name..." value={name} onChange={(e) => setName(e.target.value)} disabled={isNameLocked} />

          <div className="progress-section">
            <div className="progress-label">
              <span>Overall Progress</span>
              <span>{passedCount} / {allQuizData.length} Mastered</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-filler"
                style={{ width: `${allQuizData.length > 0 ? (passedCount / allQuizData.length) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="progress-hype">
              {passedCount === 0 ? "🚀 Start your journey today!" :
               passedCount === allQuizData.length ? "👑 You are a Master! Keep it up!" :
               "🔥 You're doing great! Keep pushing!"}
            </p>
          </div>

          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ fontWeight: "600", color: "#333", display: "block", marginBottom: "5px" }}>Choose Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setNumQuestions(5);
              }}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "15px" }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label style={{ fontWeight: "600", color: "#333", display: "block", marginBottom: "5px" }}>Number of Questions:</label>
            <input
              type="number"
              min={Math.min(5, poolInfo.questions.length)}
              max={poolInfo.questions.length}
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
            <small style={{ color: "#888" }}>
              {poolInfo.isMastered
                ? `Category Mastered! Reviewing all ${poolInfo.totalCount} questions.`
                : `Max available (unanswered): ${poolInfo.unansweredCount} (out of ${poolInfo.totalCount})`}
            </small>
          </div>

          {hasSavedSession && (
            <button className="btn-resume" onClick={resumeQuiz} style={{ backgroundColor: "#673ab7", marginBottom: "10px" }}>
              🔄 Resume Last Session
            </button>
          )}

          <button onClick={startQuiz} disabled={loading}>
            {loading ? "Checking name..." : "Start Exam"}
          </button>
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
              <div key={i} className={`option ${userAnswers[currentQ] === i ? "selected" : ""}`} onClick={() => selectOption(i)}>{opt}</div>
            ))}
          </div>

          <div className="quiz-controls">
            <button className="btn-nav" onClick={prevQuestion} disabled={currentQ === 0}>Previous</button>
            <button className="btn-flag" onClick={toggleFlag}>
              {flaggedQuestions[currentQ] ? "Unflag" : "Flag"}
            </button>
            <button className="btn-nav" onClick={nextQuestion}>
              {currentQ === activeQuestions.length - 1 ? "Submit Exam" : "Next"}
            </button>
          </div>

          <div className="navigator">
            <p>Question Navigator</p>
            <div className="nav-grid">
              {activeQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`nav-item ${currentQ === i ? "active" : ""} ${userAnswers[i] !== null ? "answered" : ""} ${flaggedQuestions[i] ? "flagged" : ""}`}
                  onClick={() => setCurrentQ(i)}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
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
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    let rankClass = "";
                    let medal = "";
                    if (rank === 1) {
                      rankClass = "rank-gold";
                      medal = "🥇 ";
                    } else if (rank === 2) {
                      rankClass = "rank-silver";
                      medal = "🥈 ";
                    } else if (rank === 3) {
                      rankClass = "rank-bronze";
                      medal = "🥉 ";
                    }

                    return (
                      <tr key={index} className={rankClass}>
                        <td>{medal}#{rank}</td>
                        <td>{entry.name}</td>
                        <td style={{ color: "#00c853", fontWeight: "bold" }}>{entry.average_percentage}%</td>
                        <td style={{ textAlign: "center" }}>{entry.total_attempts}</td>
                      </tr>
                    );
                  })}
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
