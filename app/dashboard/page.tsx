"use client";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { db } from "@/lib/firebase/firestore";
import { type Course } from "@/lib/firebase/schema";
import { collection, onSnapshot, query } from "firebase/firestore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "../(context)/auth-context";

export default function Dashboard() {
  // 1: Create a state variable that will hold the data to be fetched
  const [courses, setCourses] = useState<Course[] | null | "loading">("loading");

  // 2: Set up a useEffect hook that runs the FIRST time the component renders
  useEffect(() => {
    // What we're asking for
    const q = query(collection(db, "courses"));

    // Start listening to Firestore (set up a snapshot)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const courseList = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Course);

      setCourses(courseList);
    });

    // Tells useEffect to STOP listening if the component is unmounted
    return unsubscribe;
  }, []);

  const { user } = useAuthContext();

  if (!user) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  if (user === "loading") {
    return <TypographyP>Loading...</TypographyP>;
  }

  return (
    <>
      <TypographyH2>Dashboard</TypographyH2>
      {courses === "loading" ? (
        <p>Loading...</p>
      ) : courses === null ? (
        <p>Courses not found</p>
      ) : (
        courses.map((course) => <p key={course.id}>{course.name}</p>)
      )}
      <TypographyP>This is a protected route accessible only to signed-in users.</TypographyP>
      {user.email && <TypographyP>{`Your email is ${user.email}`}</TypographyP>}
    </>
  );
}
