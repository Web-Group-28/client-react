import Link from 'next/link';
import axios from 'axios';
import React from 'react';

const Courses = () => {
  const [courses, setCourses] = React.useState([]);
  // Fetch courses data on component mount
  React.useEffect(() => {
    axios.get('/api/courses')
      .then((response) => {
        console.log('Courses', courses);
        console.log('Got the response', response.data.data);
        setCourses(response.data.data);
      })
      .catch((error) => {
        console.warn('There was an error!', error);
      });
  }, []);
  return (
    <html>
      <head>
        <title>COURSES</title>
      </head>
      <div>
        <h1 className="jumbotron text-center bg-primary square">
          Online Learning English: Courses
        </h1>
        <div>
          {courses.map(course => {
            return <div class="course-box">
              <Link href={`/courses/${course.courseID}`} key ={course.courseID}>
                {course.title}
              </Link>
            </div>
          })}
        </div>
      </div>
    </html>
  );

};

export default Courses;
