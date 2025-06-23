interface GradeReportCardProps {
  studentName: string;
  className: string;
  courseName: string;
  points: number;
  continuousAssessment: number;
  gpa: number;
}

const GradeReportCard = ({
  studentName,
  className,
  courseName,
  points,
  continuousAssessment,
  gpa,
}: GradeReportCardProps) => {
  return (
    <div className="flex w-full gap-4 rounded-xl bg-white p-4 shadow-md dark:bg-[#0d0d0d]">
      {/* Yellow Box */}
      <div className="flex h-[150px] w-[250px] items-center justify-center rounded-md bg-yellow-400 text-2xl font-bold text-white">
        {courseName?.toUpperCase() || "-"}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between gap-1 text-sm text-textPrimary">
        <div>
          <h2 className="text-lg font-bold">{studentName}</h2>
          <p className="text-muted-foreground">{className}</p>
        </div>
      </div>

      {/* Options */}
      <div className="ms-auto pt-1 text-gray-400">
        <button className="text-xl">⋮</button>
      </div>
    </div>
  );
};

export default GradeReportCard;
