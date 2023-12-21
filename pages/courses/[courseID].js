import Link from "next/link";
import styles from './Course.module.css';
import 'dotenv/config';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
const getLessons = async (courseID) => {
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
      ids: ids
   };
}
const Course = () => {
   const router = useRouter();
   const firstState = {
      courseID: String,
      lessonTitles: [],
      ids: []
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
      return <p>Loading...</p>;
   }

   if (error) {
      return <p>Error: {error}</p>;
   }

   return (
      <React.Fragment>
         <h1>Course: {router.query.courseID}</h1>
         <h2>Lessons:</h2>
         <ul>
            {property.lessonTitles.map((title, index) => {
               return <div className={styles.courseBox} key={property.ids[index]}>
                  <Link href={`/lesson/${property.courseID}/${property.ids[index]}`}>
                     <a className={styles.lessonLink}>{title}</a>
                  </Link>
               </div>
            })}
         </ul>
      </React.Fragment>
   );
}
export default Course;