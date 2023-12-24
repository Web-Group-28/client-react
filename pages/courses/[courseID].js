import styles from './Course.module.css';
import Head from 'next/head';
import 'dotenv/config';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import axios from 'axios';
const getLessons = async (courseID) => {
   const userID = String(JSON.parse(window.localStorage.getItem('user')).data._id);
   const progress = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/progress/${userID}/${courseID}`)).data;
   const fetchData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseID}/lessons`);
   const lessonsID = await fetchData.json();
   const promises = lessonsID.data.map(async (lessonID) => {
      const lessonDetail = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseID}/lessons/${lessonID}`)).json();
      return lessonDetail.data;
   });

   const lessonsData = await Promise.all(promises);

   const titles = lessonsData.map((lesson) => lesson.title);
   const ids = lessonsData.map((lesson) => lesson._id);
   return {
      courseID: courseID,
      lessonTitles: titles,
      ids: ids,
      learned: progress.data
   };
}
const Course = () => {
   const router = useRouter();
   const firstState = {
      courseID: String,
      lessonTitles: [],
      ids: [],
      learned: []
   };
   const courseID = router.query.courseID;
   console.log("ROUTER:", courseID);
   const [property, setProperty] = useState(firstState);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      if (courseID) {
         getLessons(courseID).then(result => {
            console.log(result);
            setProperty(result);
            setLoading(false);
         }).catch((err) => {
            setError(err.message)
         });
      }
   }, [courseID]);
   if (loading) {
      return <div className={styles.loadingSpinner}></div>;
   }

   if (error) {
      return <p>Error: {error}</p>;
   }
   return (
      <React.Fragment>
         <Head>
            <title>Online Learning English: Lessons</title>
         </Head>
         <h1 className="jumbotron text-center bg-primary square">
            Online Learning English: Lessons
         </h1>
         {property.lessonTitles.map((title, index) => {
            const isLearned = property.learned.includes(property.ids[index]);
            return <div className={styles.courseBox} key={property.ids[index]} style={{ background: isLearned ? '#FFC800' : '#89E219' }}>
               <div className={styles.lessonLink}>
                  <p>{title}</p>
                  <a href={`/lesson/${property.courseID}/${property.ids[index]}`}>
                     <button style={{
                        width: '120px', height: '30px', position: 'absolute', right: '2%', color: isLearned ? '#FFC800' : '#89E219'
                        , background: '#ffffff', border: 'none'
                     }}>
                        <strong>{isLearned ? 'Luyện tập' : 'Học'}</strong>
                     </button>
                  </a>
               </div>
            </div>
         })}
      </React.Fragment>
   );
}
export default Course;