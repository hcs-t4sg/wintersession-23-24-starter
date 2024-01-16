"use client";
import { TypographyH2 } from "@/components/ui/typography";
import { db } from "@/lib/firebase/firestore";
import { type Pet } from "@/lib/firebase/schema";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // 1: Create a state variable that will hold the data to be fetched
  const [pets, setPets] = useState<"loading" | null | Pet[]>("loading");

  // 2: Set up a useEffect hook that runs the FIRST time the component renders
  useEffect(() => {
    // What we're asking for
    const q = query(collection(db, "pets"));

    // Start listening to Firestore (set up a snapshot)
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const courseList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Pet);
        setPets(courseList);
      },
      (error) => {
        console.log(error.message);
        setPets(null);
      },
    );

    // Tells useEffect to STOP listening if the component is unmounted
    return unsubscribe;
  }, []);

  let petsSection;
  if (pets === "loading") {
    petsSection = <p>Loading...</p>;
  } else if (pets === null) {
    petsSection = <p>An error occurred</p>;
  } else {
    petsSection = pets.map((pet) => <p key={pet.id}>{pet.name}</p>);
  }

  return (
    <>
      <TypographyH2>Dashboard</TypographyH2>
      {petsSection}
    </>
  );
}
