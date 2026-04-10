import { getDemoState } from "@/lib/demo/store";

async function main() {
  const state = await getDemoState();

  console.log("Outing.golf demo seed summary");
  console.log("==============================");
  console.log(`Profiles: ${state.profiles.length}`);
  console.log(`Outings: ${state.outings.length}`);
  console.log(`Destination options: ${state.destinationOptions.length}`);
  console.log(`Golf course options: ${state.golfCourseOptions.length}`);
  console.log(`Lodging options: ${state.lodgingOptions.length}`);
  console.log("");
  console.log("Demo accounts:");
  state.profiles.forEach((profile) => {
    console.log(`- ${profile.email} (${profile.fullName})`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
