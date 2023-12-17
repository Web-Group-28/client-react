export const getStaticPaths = async () => {
   const res = await fetch('http://localhost:3000/api/courses');
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
}
export const getStaticProps = async (context) => {
   const courseID = context.params.courseID;
   return {
      props: {
         courseID: courseID
      }
   }
}
const Course = ({ courseID }) => {
   return (
      <div>
         <h1>Details about {courseID}</h1>
      </div>
   );
}
export default Course;