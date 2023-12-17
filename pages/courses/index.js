import styles from './Course.module.css';
import Link from 'next/link';
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/courses')
      .then((response) => {
        setCourses(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return <div className={styles.loadingSpinner}></div>;
  }

  return (
    <div>
      <Head>
        <title>Online Learning English: Courses</title>
      </Head>
      <h1 className="jumbotron text-center bg-primary square">
        Online Learning English: Courses
      </h1>
      <div>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div className={styles.courseBox} key={course.courseID}>
              <Link href={`/courses/${course.courseID}`}>{course.title}</Link>
            </div>
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
