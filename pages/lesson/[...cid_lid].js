import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './lesson.module.css';
import Link from 'antd/lib/typography/Link';
import axios from 'axios';
const tmpState = new Set([]);

async function getQuiz(courseID, lessonID) {
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseID}/lessons/${lessonID}/exercises`);
   if (!response.ok) {
      throw new Error('Failed to fetch quiz data');
   }

   const { data } = await response.json();
   return data;
}

const QuizApp = () => {
   const initialState = {
      fill: [],
      sentence: [],
      choice: [],
      match: {},
      courseID: String,
      lessonID: String
   };
   const [quizData, setQuizData] = useState(initialState);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const router = useRouter();
   console.log("ROUTER:", router.query.cid_lid);
   const params = router.query.cid_lid;

   useEffect(() => {
      const fetchData = async () => {
         if (params) {
            try {
               const courseID = router.query.cid_lid[0];
               const lessonID = router.query.cid_lid[1];
               const allQuiz = await getQuiz(courseID, lessonID);
               setQuizData({
                  fill: allQuiz.fill,
                  sentence: allQuiz.sentence,
                  choice: allQuiz.choice,
                  match: allQuiz.match,
                  courseID: courseID,
                  lessonID: lessonID
               });
            } catch (error) {
               setError(error.message);
            } finally {
               setLoading(false);
            }
         }
      };

      fetchData();
   }, [params]);

   if (loading) {
      return <div className={styles.loadingSpinner}></div>;
   }

   if (error) {
      return <p>Error: {error}</p>;
   }

   return <QuizContent quizData={quizData} />;
};

const QuizContent = ({ quizData }) => {
   const choice = quizData.choice;
   const sentence = quizData.sentence;
   const fill = quizData.fill;
   const match = quizData.match;
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [userAnswer, setUserAnswer] = useState("");
   const [userSentenceAnswer, setUserSentenceAnswer] = useState([]);
   const [sentenceButtonStates, setSentenceButtonStates] = useState({});
   const [showResult, setShowResult] = useState(false);
   const [correct, setCorrect] = useState(0);
   const [click, setClick] = useState(0);
   const [isEnabled, setEnabled] = useState(false);
   var correctAnswer = ""

   const handleChoiceSubmit = () => {
      console.log("CLICKED:", click);
      const submitButton = document.querySelector(`.${styles.submitButton}`);
      const submitResult = document.querySelector(`.${styles.submitResult}`);
      const bottomBar = document.querySelector(`.${styles.bottomBar}`);
      if (click % 2 == 0) {
         // Your submission logic here
         submitButton.textContent = "Tiếp tục"
         if (userAnswer === correctAnswer) {
            // console.log("CORRECT");
            submitResult.textContent = 'Làm tốt lắm!';
            submitResult.style.color = `#58a700`
            submitButton.style.backgroundColor = '#58cc02';
            bottomBar.style.backgroundColor = '#d7ffb8';
            setCorrect(correct + 1);
            console.log(correct);
         } else {
            // console.log("FALSE");
            submitResult.textContent = `Đáp án đúng: ${correctAnswer}`
            submitResult.style.color = `#ea2b2b`
            submitButton.style.backgroundColor = '#ff4b4b';
            bottomBar.style.backgroundColor = '#ffdfe0';
         }
      } else {
         bottomBar.style.backgroundColor = '#ffffff';

         submitButton.style.backgroundColor = '#e5e5e5';
         submitButton.style.color = '#afafaf';
         submitResult.textContent = "";
         submitButton.textContent = "Kiểm tra"
         setEnabled(false);
         // Move to the next question
         setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

         // Reset userAnswers for the next question
         setUserAnswer("");

         // Check if it's the last question
         if (currentQuestionIndex === choice.length + sentence.length + 1) {
            setShowResult(true);
         }
      }
      setClick(click + 1);
   };
   const handleSentenceSubmit = () => {
      const submitButton = document.querySelector(`.${styles.submitButton}`);
      const submitResult = document.querySelector(`.${styles.submitResult}`);
      const bottomBar = document.querySelector(`.${styles.bottomBar}`);
      if (click % 2 == 0) {
         submitButton.textContent = "Tiếp tục"
         if (Array.from(tmpState).map(id => {
            return document.getElementById(id).innerText;
         }).join(' ') === correctAnswer) {
            submitResult.textContent = 'Làm tốt lắm!';
            submitResult.style.color = `#58a700`
            submitButton.style.backgroundColor = '#58cc02';
            bottomBar.style.backgroundColor = '#d7ffb8';
            setCorrect(correct + 1);
            console.log(correct);
         } else {
            submitResult.textContent = `Đáp án đúng:`
            document.querySelector(`.${styles.submitAnswer}`).textContent = correctAnswer;
            submitResult.style.color = `#ea2b2b`
            submitButton.style.backgroundColor = '#ff4b4b';
            bottomBar.style.backgroundColor = '#ffdfe0';
         }
      } else {
         document.querySelector(`.${styles.submitAnswer}`).textContent = '';
         tmpState.forEach(id => {
            document.getElementById(id).style.background = '#ffffff';
         });
         tmpState.clear();
         document.querySelector('.answerText').textContent = ''
         bottomBar.style.backgroundColor = '#ffffff';

         submitButton.style.backgroundColor = '#e5e5e5';
         submitButton.style.color = '#afafaf';
         submitResult.textContent = "";
         submitButton.textContent = "Kiểm tra"
         setEnabled(false);
         setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

         if (currentQuestionIndex === choice.length + fill.length + sentence.length) {
            setShowResult(true);
         }
      }
      setClick(click + 1);
   };

   const renderQuizContent = (courseID, lessonID) => {
      if (currentQuestionIndex < choice.length) {
         const currentQuestion = choice[currentQuestionIndex];
         correctAnswer = currentQuestion.correct
         console.log("USER:", userAnswer);
         console.log("CORRECT:", currentQuestion.answers);
         return (
            <div style={{ position: 'relative', marginTop: '80px', display: 'flex', flexDirection: 'column', height: '650px' }}>
               <p style={{ marginLeft: '475px', textAlign: 'left', fontSize: '32px', fontWeight: 'bold' }}>{"Chọn nghĩa đúng"}</p>
               <p style={{ marginTop: '50px', textAlign: 'center', fontSize: '19px' }}>{currentQuestion.question}</p>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {currentQuestion.answers.map((answer, index) => (
                     <button key={index} className={styles.answerButton} onClick={() => handleChoiceOptionSelect(answer)}>
                        {answer}
                     </button>
                  ))}
               </div>
               <div className={styles.bottomBar}>
                  <h2 className={styles.submitResult}></h2>
                  <button disabled={!isEnabled} className={styles.submitButton} onClick={handleChoiceSubmit}>
                     Kiểm tra
                  </button>
               </div>
            </div>
         );

      } else if (currentQuestionIndex < choice.length + fill.length) {
         const currentQuestion = match;
         correctAnswer = currentQuestion.correct
         var old_left = null, old_right = null;
         var matched = 0;

         const compareLeftRight = () => {
            if (old_left != null && old_right != null) {
               console.log("DOUBLE CHOICE");
               const left_btn = document.getElementById(old_left);
               const right_btn = document.getElementById(old_right);
               if (match[left_btn.textContent] === right_btn.textContent) {
                  matched++;
                  old_left = null, old_right = null;
                  left_btn.style.background = `#91eda9`;
                  right_btn.style.background = `#91eda9`;
                  left_btn.style.color = `#05962b`;
                  right_btn.style.color = `#05962b`;
                  setTimeout(() => {
                     left_btn.disabled = true;
                     right_btn.disabled = true;
                     left_btn.style.background = `#ffffff`;
                     right_btn.style.background = `#ffffff`;
                     left_btn.style.color = `#e5e5e5`;
                     right_btn.style.color = `#e5e5e5`;
                  }, 1000);
                  console.log("MATCHED:", matched);
                  if (matched == 5) {
                     setCorrect(correct + 1);
                     setClick(click + 1);
                     setEnabled(true);
                     const submitButton = document.querySelector(`.${styles.submitButton}`);
                     const submitResult = document.querySelector(`.${styles.submitResult}`);
                     const bottomBar = document.querySelector(`.${styles.bottomBar}`);
                     submitResult.textContent = 'Làm tốt lắm!';
                     submitResult.style.color = `#58a700`
                     submitButton.textContent = "Tiếp tục"
                     submitButton.style.backgroundColor = '#58cc02';
                     submitButton.style.color = '#ffffff';
                     bottomBar.style.backgroundColor = '#d7ffb8';
                  }
               } else {
                  old_left = null, old_right = null;
                  left_btn.style.background = `#f0a1a2`;
                  right_btn.style.background = `#f0a1a2`;
                  left_btn.style.color = `#a30203`;
                  right_btn.style.color = `#a30203`;
                  setTimeout(() => {
                     left_btn.style.background = `#ffffff`;
                     right_btn.style.background = `#ffffff`;
                     left_btn.style.color = `#000000`;
                     right_btn.style.color = `#000000`;
                  }, 1000);
               }
               console.log("END DOUBLE CHOICE");

            }
         }
         const handleLeftChoice = (left_id) => {
            if (old_left != null) {
               if (old_left == left_id) {
                  console.log("OLD:", old_left);
                  const oldBtn = document.getElementById(old_left);
                  oldBtn.style.background = `#ffffff`;
                  oldBtn.style.color = `#4b4b4b`;
                  old_left = null;
               } else {
                  console.log("OLD:", old_left);
                  const oldBtn = document.getElementById(old_left);
                  oldBtn.style.background = `#ffffff`;
                  oldBtn.style.color = `#4b4b4b`;
                  console.log("NEW:", left_id);
                  const newBtn = document.getElementById(left_id);
                  newBtn.style.background = `#ddf4ff`;
                  newBtn.style.color = `#1899d6`;
                  old_left = left_id;
               }
               compareLeftRight()
            }
            else {
               console.log("NEW:", left_id);
               const newBtn = document.getElementById(left_id);
               newBtn.style.background = `#ddf4ff`;
               newBtn.style.color = `#1899d6`;
               old_left = left_id;
               compareLeftRight()
            }
         }
         const handleRightChoice = (right_id) => {
            if (old_right != null) {
               if (old_right == right_id) {
                  console.log("OLD:", old_right);
                  const oldBtn = document.getElementById(old_right);
                  oldBtn.style.background = `#ffffff`;
                  oldBtn.style.color = `#4b4b4b`;
                  old_right = null;
               } else {
                  console.log("OLD:", old_right);
                  const oldBtn = document.getElementById(old_right);
                  oldBtn.style.background = `#ffffff`;
                  oldBtn.style.color = `#4b4b4b`;
                  console.log("NEW:", right_id);
                  const newBtn = document.getElementById(right_id);
                  newBtn.style.background = `#ddf4ff`;
                  newBtn.style.color = `#1899d6`;
                  old_right = right_id;
               }
               compareLeftRight()
            }
            else {
               console.log("NEW:", right_id);
               const newBtn = document.getElementById(right_id);
               newBtn.style.background = `#ddf4ff`;
               newBtn.style.color = `#1899d6`;
               old_right = right_id;
               compareLeftRight()
            }
         }
         return (
            <div style={{ position: 'relative', marginTop: '80px', display: 'flex', flexDirection: 'column', height: '650px' }}>
               <p style={{ marginLeft: '475px', textAlign: 'left', fontSize: '32px', fontWeight: 'bold' }}>{"Chọn cặp từ"}</p>
               <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', marginLeft: '500px', marginTop: '100px' }}>
                  {Object.keys(match).map((key, index) => {
                     return <button id={`left_${index}`} onClick={() => handleLeftChoice(`left_${index}`)} style={{ color: '#4b4b4b', fontSize: '19px', fontFamily: 'din-round, sans-serif', background: '#ffffff', width: '256px', height: '50px', marginTop: '10px' }}>{key}</button>
                  })}
               </div>
               <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', marginLeft: '800px', marginTop: '100px' }}>
                  {Object.values(match).map((key, index) => {
                     return <button id={`right_${index}`} onClick={() => handleRightChoice(`right_${index}`)} style={{ color: '#4b4b4b', fontSize: '19px', fontFamily: 'din-round, sans-serif', background: '#ffffff', width: '256px', height: '50px', marginTop: '10px' }}>{key}</button>
                  })}
               </div>
               <div className={styles.bottomBar}>
                  <h2 className={styles.submitResult}></h2>
                  <button disabled={!isEnabled} className={styles.submitButton} onClick={handleChoiceSubmit}>
                     Kiểm tra
                  </button>
               </div>
            </div>
         );
      } else if (currentQuestionIndex < choice.length + fill.length + 1) {
         const currentQuestion = fill[currentQuestionIndex - choice.length - 1];
         correctAnswer = currentQuestion.correct
         console.log("USER:", userAnswer);
         return (
            <div style={{ position: 'relative', marginTop: '80px', display: 'flex', flexDirection: 'column', height: '650px' }}>
               <p style={{ marginLeft: '475px', textAlign: 'left', fontSize: '32px', fontWeight: 'bold' }}>{"Chọn từ chính xác"}</p>
               <p style={{ marginTop: '50px', textAlign: 'center', fontSize: '19px' }}>{`${currentQuestion.left_sentence} _____ ${currentQuestion.right_sentence}`}</p>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {currentQuestion.answers.map((answer, index) => (
                     <button key={index} className={styles.answerButton} onClick={() => handleChoiceOptionSelect(answer)}>
                        {answer}
                     </button>
                  ))}
               </div>
               <div className={styles.bottomBar}>
                  <h2 className={styles.submitResult}></h2>
                  <button disabled={!isEnabled} className={styles.submitButton} onClick={handleChoiceSubmit}>
                     Kiểm tra
                  </button>
               </div>
            </div>
         );

      } else {
         if (showResult) {
            const userID = String(JSON.parse(window.localStorage.getItem('user')).data._id);
            const isPerfect = correct === choice.length + fill.length + sentence.length + 1 ? 1 : 0;
            axios.post(`http://localhost:3000/api/courses/${courseID}/lessons/${lessonID}/submit/${isPerfect}`, {
               userID
            });
            return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '15%' }}>
               <div style={{
                  fontSize: '32px', color: `#ffc800`
               }}><strong>Tập luyện hoàn tất</strong></div>
               <p style={{ marginTop: '20px', fontSize: '19px', color: `#afafaf` }}>Chính xác: {correct} / {choice.length + fill.length + sentence.length + 1}</p>
               <div style={{ marginTop: '50px', display: 'flex' }}>
                  <div style={{ marginRight: '10px', height: '100px', width: '170px', border: '5px solid #FFC800' }}>
                     <div style={{ marginTop: '5px', fontSize: '19px', textAlign: 'center' }}>Tổng điểm: </div>
                     <div style={{ textAlign: 'center', fontSize: '32px' }}>{20 + (isPerfect ? 5 : 0)}</div>
                  </div>
                  <div style={{ marginLeft: '10px', height: '100px', width: '170px', border: '5px solid #58CC02' }}>
                     <div style={{ marginTop: '5px', fontSize: '19px', textAlign: 'center' }}>Độ chính xác</div>
                     <div style={{ textAlign: 'center', fontSize: '32px' }}>{Math.round(correct * 100 / (choice.length + fill.length + sentence.length + 1))}%</div>
                  </div>
               </div>
               <a href={`/courses/${courseID}`}>
                  <button className={styles.submitButtonEnable}>
                     Tiếp tục
                  </button>
               </a>

            </div>;
         }
         const currentQuestion = sentence[currentQuestionIndex - choice.length - 1 - fill.length];
         correctAnswer = currentQuestion.correct
         console.log("USER:", userAnswer);
         console.log("CORRECT:", currentQuestion.correct);
         return (
            <div style={{ position: 'relative', marginTop: '80px', display: 'flex', flexDirection: 'column', height: '650px' }}>
               <p style={{ marginLeft: '475px', textAlign: 'left', fontSize: '32px', fontWeight: 'bold' }}>{"Viết lại bằng tiếng Việt"}</p>
               <p style={{ marginTop: '50px', textAlign: 'center', fontSize: '19px' }}>{currentQuestion.left_sentence}</p>
               <div className='answerText' style={{ alignSelf: 'center', width: '60%', marginTop: '99px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}></div>
               <div style={{ alignSelf: 'center', width: '60%', marginTop: '1px', borderTop: '2px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center' }}></div>
               <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  {currentQuestion.words.map((answer, index) => (
                     <button key={index} id={`button_${index}`} className={styles.sentenceButton} onClick={() => handleSentenceOptionSelect(answer, index, tmpState)}>
                        {answer}
                     </button>
                  ))}
               </div>
               <div className={styles.bottomBar}>
                  <h2 className={styles.submitResult}></h2>
                  <div className={styles.submitAnswer}></div>
                  <button disabled={!isEnabled} className={styles.submitButton} onClick={() => handleSentenceSubmit()}>
                     Kiểm tra
                  </button>
               </div>
            </div>
         );

      }
   };

   const handleChoiceOptionSelect = (selectedOption) => {
      setUserAnswer(selectedOption);
      const s = document.querySelector(`.${styles.submitButton}`);
      setEnabled(true);
      s.style.backgroundColor = '#58cc02';
      s.style.color = '#ffffff';
   };
   const handleSentenceOptionSelect = (selectedOption, index, tmpState) => {
      console.log("CLICK BEFORE:", tmpState);
      console.log("ANSWER:", userSentenceAnswer);
      const clickedButton = document.querySelector(`#button_${index}`);
      if (!sentenceButtonStates[selectedOption]) {
         clickedButton.style.backgroundColor = '#e5e5e5';
         tmpState.add(`button_${index}`);
         setUserSentenceAnswer(old => old.filter(o => o !== `button_${index}`));
      } else {
         tmpState.delete(`button_${index}`);
         clickedButton.style.backgroundColor = '#ffffff';
         setUserSentenceAnswer(old => [...old, `button_${index}`]);
      }
      setSentenceButtonStates((prevStates) => ({
         ...prevStates,
         [selectedOption]: !prevStates[selectedOption],
      }));

      const s = document.querySelector(`.${styles.submitButton}`);
      setEnabled(true);
      s.style.backgroundColor = '#58cc02';
      s.style.color = '#ffffff';
      console.log("CLICK AFTER:", tmpState);
      const answer = Array.from(tmpState).map(id => {
         return document.getElementById(id).innerText;
      });
      const text = document.querySelector('.answerText');
      text.textContent = answer.join(' ');
   };
   return (
      <div>
         {renderQuizContent(quizData.courseID, quizData.lessonID)}
      </div>
   );
};

export default QuizApp;
