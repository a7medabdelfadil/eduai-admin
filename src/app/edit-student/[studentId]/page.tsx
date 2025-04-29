"use client";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import SearchableSelect from "@/components/select";
import Spinner from "@/components/spinner";
import {
  useUpdateStudentsMutation,
  useGetStudentByIdUpdateQuery,
} from "@/features/User-Management/studentApi";
import {
  useGetAllNationalitysQuery,
  useGetAllReginionIDQuery,
} from "@/features/signupApi";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Params {
  studentId: string;
}

const EditStudent = ({ params }: { params: Params }) => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Student",
      nameAr: "طالب",
      nameFr: "Élève",
      href: "/student",
    },
    {
      nameEn: "Edit Student",
      nameAr: "تعديل الغرفة",
      nameFr: "Modifier l'élève",
      href: `/edit-student/${params.studentId}`,
    },
  ];

  const { data, isLoading: isStudent } = useGetStudentByIdUpdateQuery(
    params.studentId,
  );

  const router = useRouter();

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const { data: nationalityData } = useGetAllNationalitysQuery(null);
  const { data: regionData } = useGetAllReginionIDQuery(null);

  // State for each field
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [regionId, setRegionId] = useState("");
  const [graduated, setGraduated] = useState("false");
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");
  const [name_fr, setNameFr] = useState("");
  const [about, setAbout] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const optionsRigon =
    regionData?.data?.map(
      (rigion: {
        cityName: any;
        countryName: any;
        regionName: any;
        regionId: any;
        name: any;
      }) => ({
        value: rigion.regionId,
        label: `${rigion.regionName} - ${rigion.cityName}`,
      }),
    ) || [];

  // Pre-fill form fields when data is loaded
  useEffect(() => {
    if (data?.data) {
      const studentData = data.data;
      // Set each state variable with the corresponding value
      setEmail(studentData.email);
      setNid(studentData.nid);
      setGender(studentData.gender);
      setNationality(studentData.nationality);
      setRegionId(studentData.regionId);
      setGraduated(studentData.graduated.toString());
      setNameEn(studentData.name_en);
      setNameAr(studentData.name_ar);
      setNameFr(studentData.name_fr);
      setAbout(studentData.about);
      setBirthDate(studentData.birthDate);
      console.log("👾 ~ useEffect ~ studentData:", studentData);
    }
  }, [data]);

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const [updateSudent, { isLoading }] = useUpdateStudentsMutation();

  const { handleSubmit } = useForm(); // handleSubmit here

  const onSubmit = async (data: any) => {
    const formData = {
      ...data,
      religion: null,
      birthDate: birthDate === "" ? null : birthDate,
      nid: nid === "" ? null : nid,
      about: about === "" ? null : about,
      regionId: regionId ? Number(regionId) : null,
      graduated,
      gender,
      nationality,
      name_en,
      name_ar,
      name_fr,
      email,
    };

    try {
      await updateSudent({ id: params.studentId, formData }).unwrap();
      toast.success("Student Updated successfully");
      router.back();
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };


  if (loading || isStudent)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
          } mx-3 mt-5 grid h-[850px] items-center justify-center`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-10 grid items-center justify-center gap-5 rounded-xl bg-bgPrimary p-10 sm:w-[500px] md:w-[600px] lg:w-[750px] xl:w-[1000px]">
            <div className="grid grid-cols-2 gap-4 max-[1278px]:grid-cols-1">
              {/* Email */}
              <label htmlFor="email" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "البريد الإلكتروني"
                  : currentLanguage === "fr"
                    ? "Email"
                    : "Email"}
                <input
                  id="email"
                  type="email"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={email || ""}
                  onChange={e => setEmail(e.target.value)}
                />
                {/* Validation error */}
              </label>

              {/* NID */}
              <label htmlFor="nid" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "الرقم الهوية"
                  : currentLanguage === "fr"
                    ? "NID"
                    : "NID"}
                <input
                  id="nid"
                  type="number"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={nid}
                  onChange={e => setNid(e.target.value)}
                />
                {/* Validation error */}
              </label>

              {/* Gender */}
              <label
                htmlFor="gender"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الجنس"
                  : currentLanguage === "fr"
                    ? "Sexe"
                    : "Gender"}
                <select
                  id="gender"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                >
                  <option value="">
                    {currentLanguage === "en"
                      ? "Select gender"
                      : currentLanguage === "ar"
                        ? "اختر الجنس"
                        : "Sélectionner le genre"}
                  </option>
                  <option value="MALE">
                    {currentLanguage === "en" ? "Male" : "ذكر"}
                  </option>
                  <option value="FEMALE">
                    {currentLanguage === "en" ? "Female" : "أنثى"}
                  </option>
                </select>
                {/* Validation error */}
              </label>

              {/* Nationality */}
              <label
                htmlFor="nationality"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "جنسيتك"
                  : currentLanguage === "fr"
                    ? "Votre nationalité"
                    : "Your Nationality"}
                <select
                  id="nationality"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={nationality}
                  onChange={e => setNationality(e.target.value)}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر الجنسية"
                      : currentLanguage === "fr"
                        ? "Sélectionner la nationalité"
                        : "Select Nationality"}
                  </option>
                  {nationalityData &&
                    Object.entries(nationalityData.data).map(([key, value]) => (
                      <option key={key} value={key}>
                        {String(value)}
                      </option>
                    ))}
                </select>
                {/* Validation error */}
              </label>

              {/* Region */}
              <label
                htmlFor="regionId"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "المنطقة"
                  : currentLanguage === "fr"
                    ? "Région"
                    : "Region"}
                <select
                  id="regionId"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={regionId}
                  onChange={e => setRegionId(e.target.value)}
                >
                  <option value="">
                    {currentLanguage === "ar"
                      ? "اختر المنطقة"
                      : currentLanguage === "fr"
                        ? "Sélectionner la région"
                        : "Select Region"}
                  </option>
                  {optionsRigon.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* Graduation Status */}
              <label
                htmlFor="graduated"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "تخرج"
                  : currentLanguage === "fr"
                    ? "Diplômé"
                    : "Graduated"}
                <select
                  id="graduated"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={graduated}
                  onChange={e => setGraduated(e.target.value)}
                >
                  <option value="false">
                    {currentLanguage === "ar" ? "لا" : "No"}
                  </option>
                  <option value="true">
                    {currentLanguage === "ar" ? "نعم" : "Yes"}
                  </option>
                </select>
              </label>

              {/* Name in English */}
              <label
                htmlFor="name_en"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم بالإنجليزي"
                  : currentLanguage === "fr"
                    ? "Nom en anglais"
                    : "Name in English"}
                <input
                  id="name_en"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={name_en}
                  onChange={e => setNameEn(e.target.value)}
                />
                {/* Validation error */}
              </label>

              {/* Name in Arabic */}
              <label
                htmlFor="name_ar"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم بالعربي"
                  : currentLanguage === "fr"
                    ? "Nom en arabe"
                    : "Name in Arabic"}
                <input
                  id="name_ar"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={name_ar}
                  onChange={e => setNameAr(e.target.value)}
                />
                {/* Validation error */}
              </label>

              {/* Name in French */}
              <label
                htmlFor="name_fr"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "الاسم بالفرنسي"
                  : currentLanguage === "fr"
                    ? "Nom en français"
                    : "Name in French"}
                <input
                  id="name_fr"
                  type="text"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={name_fr}
                  onChange={e => setNameFr(e.target.value)}
                />
                {/* Validation error */}
              </label>

              {/* About */}
              <label htmlFor="about" className="grid text-[18px] font-semibold">
                {currentLanguage === "ar"
                  ? "نبذة"
                  : currentLanguage === "fr"
                    ? "À propos"
                    : "About"}
                <textarea
                  id="about"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                />
              </label>

              {/* Birth Date */}
              <label
                htmlFor="birthDate"
                className="grid text-[18px] font-semibold"
              >
                {currentLanguage === "ar"
                  ? "تاريخ الميلاد"
                  : currentLanguage === "fr"
                    ? "Date de naissance"
                    : "Birth Date"}
                <input
                  id="birthDate"
                  type="date"
                  className="w-[400px] rounded-xl border border-borderPrimary px-4 py-3 outline-none max-[471px]:w-[350px]"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-primary py-3 text-[18px] font-semibold text-white transition-all duration-200 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditStudent;
