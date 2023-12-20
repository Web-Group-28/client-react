import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './lesson.module.css';

async function getQuiz(courseID, lessonID) {
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseID}/lessons/${lessonID}/exercises`);
   if (!response.ok) {
      throw new Error('Failed to fetch quiz data');
   }

   const { data } = await response.json();
   return data;
}

const QuizApp = () => {
   const router = useRouter();
   console.log("ROUTER:", router.query.cid_lid);
   const courseID = router.query.cid_lid[0];
   const lessonID = router.query.cid_lid[1];

   const initialState = {
      fill: [],
      sentence: [],
      choice: [],
      match: {},
   };

   const [quizData, setQuizData] = useState(initialState);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const allQuiz = await getQuiz(courseID, lessonID);
            setQuizData({
               fill: allQuiz.fill,
               sentence: allQuiz.sentence,
               choice: allQuiz.choice,
               match: allQuiz.match,
            });
         } catch (error) {
            setError(error.message);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   if (loading) {
      return <p>Loading...</p>;
   }

   if (error) {
      return <p>Error: {error}</p>;
   }

   return <QuizContent quizData={quizData} />;
};

const QuizContent = ({ quizData }) => {
   const choice = quizData.choice;
   const sentence = quizData.sentence;
   console.log(sentence);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [userAnswer, setUserAnswer] = useState("");
   const [showResult, setShowResult] = useState(false);
   const [correct, setCorrect] = useState(0);
   const [click, setClick] = useState(0);
   const [isEnabled, setEnabled] = useState(false);
   var correctAnswer = ""

   const handleSubmit = () => {
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
         if (currentQuestionIndex === choice.length + sentence.length - 1) {
            setShowResult(true);
         }

      }
      setClick(click + 1);
   };

   const renderQuizContent = () => {
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
                     <button key={index} className={styles.answerButton} onClick={() => handleOptionSelect(answer)}>
                        {answer}
                     </button>
                  ))}
               </div>
               <div className={styles.bottomBar}>
                  <h2 className={styles.submitResult}></h2>
                  <button disabled={!isEnabled} className={styles.submitButton} onClick={handleSubmit}>
                     Kiểm tra
                  </button>
               </div>
            </div>
         );

      } else {
         if (showResult) {
            return <p>Correct: {correct} / {choice.length}</p>;
         }
         const currentQuestion = sentence[currentQuestionIndex - choice.length];
         correctAnswer = currentQuestion.correct
         console.log("USER:", userAnswer);
         console.log("CORRECT:", currentQuestion.correct);
         return (
            <div style={{ position: 'relative', marginTop: '80px', display: 'flex', flexDirection: 'column', height: '650px' }}>
               <p style={{ marginLeft: '475px', textAlign: 'left', fontSize: '32px', fontWeight: 'bold' }}>{"Viết lại bằng tiếng Việt"}</p>
               <p style={{ marginTop: '50px', textAlign: 'center', fontSize: '19px' }}>{currentQuestion.left_sentence}</p>
               <div style={{ alignSelf: 'center', width: '60%', marginTop: '99px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}></div>
               <div style={{ alignSelf: 'center', width: '60%', marginTop: '1px', borderTop: '2px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center' }}></div>
               <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  {currentQuestion.words.map((answer, index) => (
                     <button key={index} className={styles.answerButton} onClick={() => handleOptionSelect(answer)}>
                        {answer}
                     </button>
                  ))}
               </div>
               <div className={styles.bottomBar}>
                  <h2 className={styles.submitResult}></h2>
                  <button disabled={!isEnabled} className={styles.submitButton} onClick={handleSubmit}>
                     Kiểm tra
                  </button>
               </div>
            </div>
         );

      }
   };

   const handleOptionSelect = (selectedOption) => {
      setUserAnswer(selectedOption);
      const s = document.querySelector(`.${styles.submitButton}`);
      setEnabled(true);
      s.style.backgroundColor = '#58cc02';
      s.style.color = '#ffffff';
   };

   return (
      <div>
         {renderQuizContent()}
      </div>
   );
};

export default QuizApp;
