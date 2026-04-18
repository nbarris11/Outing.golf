/* Test the course pricing enrichment end-to-end. Run with:
 *   npx tsx scripts/test-course-pricing.ts
 */
import { fetchAndCacheCoursePricing, getCachedCoursePricing } from "../src/modules/pricing/course-pricing";

const courses = [
  { name: "Nightmare Golf Course", location: "West Branch, MI" },
  { name: "Dream Golf Course", location: "West Branch, MI" }
];

async function run() {
  for (const course of courses) {
    console.log(`\n── ${course.name} (${course.location}) ──`);
    const cached = await getCachedCoursePricing(course.name, course.location);
    if (cached) {
      console.log("CACHED:", cached);
      continue;
    }
    console.log("No cache — fetching from Google Places…");
    const pricing = await fetchAndCacheCoursePricing(course.name, course.location);
    console.log("RESULT:", pricing);
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
