import React, { useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../configs/FirebaseConfig";

export default function TestFirebase() {
  useEffect(() => {
    async function test() {
      try {
        console.log("🟢 Testing Firebase connection...");
        const snapshot = await get(ref(db, "users"));
        if (snapshot.exists()) {
          console.log("✅ Users data:", snapshot.val());
        } else {
          console.log("⚠️ No data found at /users");
        }
      } catch (err) {
        console.error("❌ Firebase error:", err);
      }
    }
    test();
  }, []);

  return <div>Testing Firebase connection...</div>;
}
