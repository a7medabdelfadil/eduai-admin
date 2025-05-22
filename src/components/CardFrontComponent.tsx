interface CardProps {
  name: string;
  studentId: string;
  gradeYear: string;
  issueDate: string;
  imageSrc: string;
  role: string;
}

export default function CardFrontComponent({
  name,
  studentId,
  gradeYear,
  issueDate,
  imageSrc,
  role,
}: CardProps) {
  return (
    <div className="relative w-full h-full min-w-[400px] min-h-[200px] rounded-md shadow-xl overflow-hidden font-sans">
      {/* Background Frame */}
      <img
        src="/images/card_frame.png"
        alt="Card Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />


      {/* Content */}
      <div className="relative z-10 flex w-full h-full">
        {/* Left - Profile Image */}
        <div className="flex items-center justify-center w-[40%] p-4">
          <div className="w-[100px] h-[130px] border-2 border-green-500 rounded-xl overflow-hidden">
            <img
              src={imageSrc}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right - Info */}
        <div className="w-[60%] pt-8 pr-6 pb-4 space-y-1 text-gray-900">
          <img src="/images/logo.png" alt="Logo" className="w-20 mb-1" />
          <h3 className="text-lg font-bold text-gray-700">{role} ID CARD</h3>

          <div className="text-sm space-y-[2px]">
            <p><span className="font-semibold">Name:</span> {name}</p>
            <p><span className="font-semibold">Student ID:</span> {studentId}</p>
            <p><span className="font-semibold">Grade/Year:</span> {gradeYear}</p>
            <p><span className="font-semibold">Issued On:</span> {issueDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
