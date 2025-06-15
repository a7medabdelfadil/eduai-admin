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
    <div className="relative h-full min-h-[200px] w-full min-w-[400px] overflow-hidden rounded-md font-sans shadow-xl">
      {/* Background Frame */}
      <img
        src="/images/card_frame.png"
        alt="Card Background"
        className="absolute left-0 top-0 z-0 h-full w-full object-cover"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full">
        {/* Left - Profile Image */}
        <div className="flex w-[40%] items-center justify-center p-4">
          <div className="h-[130px] w-[100px] overflow-hidden rounded-xl border-2 border-green-500">
            <img
              src={imageSrc}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Right - Info */}
        <div className="w-[60%] space-y-1 pb-4 pr-6 pt-8 text-gray-900">
          <img src="/images/logo.png" alt="Logo" className="mb-1 w-20" />
          <h3 className="text-lg font-bold text-gray-700">{role} ID CARD</h3>

          <div className="space-y-[2px] text-sm">
            <p>
              <span className="font-semibold">Name:</span> {name}
            </p>
            <p>
              <span className="font-semibold">Student ID:</span> {studentId}
            </p>
            <p>
              <span className="font-semibold">Grade/Year:</span> {gradeYear}
            </p>
            <p>
              <span className="font-semibold">Issued On:</span> {issueDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
