import Link from "next/link";
import styles from './Course.module.css';
import 'dotenv/config';
import React from "react";
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses`;


export const getStaticPaths = async () => {
   try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
         throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      const paths = data.data.map(n => {
         return {
            params: { courseID: String(n.courseID) }
         }
      })
      return {
         paths,
         fallback: false
      }
   } catch (error) {
      console.error("URL: ", apiUrl);
      console.error('Error fetching data:', error);
      return {
         paths: [],
         fallback: false
      }
   }
}
export const getStaticProps = async (context) => {
   const courseID = context.params.courseID;
   const lessonsID = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseID}/lessons`)).json();
   const promises = lessonsID.data.map(async (lessonID) => {
      const lessonDetail = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseID}/lessons/${lessonID}`)).json();
      return lessonDetail.data;
   });

   const lessonsData = await Promise.all(promises);

   const titles = lessonsData.map((lesson) => lesson.title);
   const ids = lessonsData.map((lesson) => lesson._id);

   return {
      props: {
         courseID: courseID,
         lessonTitles: titles,
         ids: ids,
      },
   };
};
const Course = ({ courseID, lessonTitles, ids }) => {
   return (
      <React.Fragment>
         <h1>Course: {courseID}</h1>
         <h2>Lessons:</h2>
         <ul>
            {lessonTitles.map((title, index) => {
               return <div className={styles.courseBox} key={ids[index]}>
                  <Link href={`/lessons/${courseID}/${ids[index]}`}>
                     <a className={styles.lessonLink}>{title}</a>
                  </Link>
               </div>
            })}
            </ul>
      </React.Fragment>
   );
}
export default Course;