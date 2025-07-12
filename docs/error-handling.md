# ❗ Error Handling Report

## `page.tsx` (in `confirm-account/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `forget-password/`)
```ts
try {
} catch (err) {
toast.error(
```

## `page.tsx` (in `login/`)
```ts
try {
} catch (err: any) {
toast.error(
try {
} catch (e) {}
```

## `page.tsx` (in `new-password/`)
```ts
try {
} catch (error) {
toast.error(`${(error as any).data.message}`);
```

## `page.tsx` (in `otp/`)
```ts
try {
} catch (error) {
toast.error(
: "Failed to verify OTP. Please try again.",
```

## `page.tsx` (in `signup/`)
```ts
countryName: any;
label: `${school.name} - ${school.regionName}, ${school.cityName}, ${school.countryName}`,
countryName: any;
try {
} catch (err: any) {
toast.error(
```

## `page.tsx` (in `add-note/`)
```ts
toast.error("Please fill in all fields and select at least one role.");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `bus/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `driver/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `employee/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `parent/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `digital-resource/`)
```ts
try {
} catch (err: any) {
toast.error(err?.data?.message || "Failed to restore resource");
```

## `page.tsx` (in `equipment/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `facilities/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `instructional-materials/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `textbooks/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `student/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `teacher/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `worker/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `driver-attendance/`)
```ts
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `employee-attendance/`)
```ts
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `student-attendance/`)
```ts
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `teacher-attendance/`)
```ts
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `worker-attendance/`)
```ts
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
.catch(err => {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `chat/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `course-management/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[courseId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-course/`)
```ts
import { useGetAllCountrysQuery } from "@/features/dashboard/dashboardApi";
const { data: CountryData, isLoading: CountryLoading } =
useGetAllCountrysQuery(null);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
if (CountryLoading || LevelLoading || RegLoading || LangLoading || loading)
htmlFor="countryId"
: "Country"}
id="countryId"
{...register("countryId")}
className={`border ${errors.countryId ? "border-warning" : "border-borderPrimary"} h-full w-full rounded-xl px-4 py-3 text-sm text-blackOrWhite outline-none max-[458px]:w-[350px]`}
: "Select Country"}
{CountryData &&
Object.entries(CountryData.data).map(([key, value]) => (
{errors.countryId && (
: "Country is Required"}
```

## `dashboard.tsx` (in `Dashboard/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `certificate/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `achievement/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-achievement/`)
```ts
try {
} catch (error: any) {
(error instanceof Error ? error.message : "Something went wrong");
toast.error(
```

## `page.tsx` (in `add-new-certificate/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-participation/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-professional/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `participation/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `professional-development/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `date/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `status/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `disciplinary/`)
```ts
try {
} catch (error) {
toast.error(
```

## `page.tsx` (in `add-disciplinary/`)
```ts
try {
} catch (err: any) {
toast.error(errorMessage);
```

## `LegalComponent.tsx` (in `legal/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-medical/`)
```ts
toast.error(
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `events/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[eventId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `exams/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[examId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-exam/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[examResId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `schedule/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
toast.error("Please select a file");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[eventId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-schedule/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `class/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `activity/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-activity/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `bank/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
toast.error(
toast.error(
toast.error(
toast.error(
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
toast.error(
toast.error(
toast.error(
toast.error(
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `fees-management/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `new-invoice/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `new-scholarship/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `scholarship/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[scholarshipId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `material/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-material/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `taxes/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[taxesId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-taxes/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `transport/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-transport/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
{region.regionName} - {region.cityName} - {region.countryName}
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `tuition/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-tuition/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `uniform/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-uniform/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `bus/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-bus/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[busId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `classes/`)
```ts
toast.error("Please select a file");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-class/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[classId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[classId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `lab/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[labId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-lab/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `library/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-library/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `office/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[officeId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-office/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `digital-resource/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-digital/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `equipment/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-equipment/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `facilities/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-facilities/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `instructional-materials/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-instructional/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `textbooks/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-textbooks/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[id]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `notifies/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `send-notifications/`)
```ts
toast.error("Please fill in all fields and select at least one role.");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `annual/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-annual/`)
```ts
try {
toast.error(
} catch (err) {
toast.error(errorMessage);
```

## `page.tsx` (in `[id]/`)
```ts
try {
toast.error(
} catch (error) {
toast.error(errorMessage);
```

## `page.tsx` (in `complaint/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `parent/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `department/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[departmentId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-department/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `edit-school-logo/`)
```ts
toast.error(
toast.error("No file selected.");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
toast.error("Please select a logo to upload.");
```

## `page.tsx` (in `exams/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-exam/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `payment/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `employee/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[empolyeeId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `position/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[positionId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-position/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `reports/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `semester/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[semesterId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-semester/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `suggestions/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `post-management/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `[postId]/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-post/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `news/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `profile/`)
```ts
useGetAllCountryCodeQuery,
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
countryName: any;
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
toast.error("No picture selected");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
if (loading || userLoading || nationalityLoading || isCountryCode)
countryCodeData={countryCode.data}
```

## `page.tsx` (in `password/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `driver/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-driver/`)
```ts
useGetAllCountryCodeQuery,
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
countryName: any;
try {
} catch (error: any) {
toast.error(error.data.message);
if (loading || nationalityLoading || isPosition || isCountryCode)
countryCodeData={countryCode.data}
```

## `page.tsx` (in `[driverId]/`)
```ts
useGetAllCountryCodeQuery,
countryName: any;
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
setValue("countryCode", data.data.countryCode);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
countryCodeData={countryCode.data}
```

## `page.tsx` (in `employee/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
toast.error("Please select a file");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-employee/`)
```ts
useGetAllCountryCodeQuery,
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
countryName: any;
try {
} catch (error: any) {
toast.error(error.data.message);
if (loading || isCountryCode)
countryCodeData={countryCode.data}
```

## `page.tsx` (in `[employeeId]/`)
```ts
useGetAllCountryCodeQuery,
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
countryCodeData={countryCode.data}
```

## `page.tsx` (in `parent/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
toast.error("Please select a file");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-parent/`)
```ts
useGetAllCountryCodeQuery,
countryName: any;
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
countryCode: data.countryCode,
try {
} catch (error: any) {
toast.error(
if (loading || isCountryCode)
countryCodeData={countryCode.data}
```

## `page.tsx` (in `[parentId]/`)
```ts
useGetAllCountryCodeQuery,
countryName: any;
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
countryCodeData={
countryCode?.data !== null ? countryCode?.data : {}
```

## `page.tsx` (in `student/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch {
toast.error("Failed to lock the Student");
```

## `page.tsx` (in `add-new-student/`)
```ts
useGetAllCountryCodeQuery,
countryName: any;
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
try {
} catch (error: any) {
toast.error(error.data.message);
if (loading || isCountryCode || LevelLoading || LangLoading)
countryCodeData={countryCode.data}
```

## `page.tsx` (in `[studentId]/`)
```ts
countryName: any;
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `graduated/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `teacher/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
toast.error("Please select a file");
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-teacher/`)
```ts
useGetAllCountryCodeQuery,
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
countryName: any;
try {
} catch (error: any) {
toast.error(
countryCodeData={countryCode.data}
```

## `page.tsx` (in `[teacherId]/`)
```ts
useGetAllCountryCodeQuery,
countryName: any;
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
countryCodeData={countryCode?.data}
```

## `page.tsx` (in `worker/`)
```ts
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
```

## `page.tsx` (in `add-new-worker/`)
```ts
useGetAllCountryCodeQuery,
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
countryName: any;
try {
} catch (error: any) {
toast.error(error.data.message);
countryCodeData={countryCode.data}
```

## `page.tsx` (in `[workerId]/`)
```ts
useGetAllCountryCodeQuery,
const { data: countryCode, isLoading: isCountryCode } =
useGetAllCountryCodeQuery(null);
try {
} catch (err) {
toast.error((err as { data: { message: string } }).data?.message);
countryCodeData={countryCode.data}
```

## `signupApi.ts` (in `features/`)
```ts
getAllCountryCode: builder.query({
query: () => "/api/v1/public/enumeration/country-code",
useGetAllCountryCodeQuery,
```

## `dashboardApi.ts` (in `dashboard/`)
```ts
getAllCountrys: builder.query({
query: () => "/api/v1/management/country/all",
useGetAllCountrysQuery,
```
