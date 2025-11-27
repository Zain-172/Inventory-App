export default function Table({ data, headers, accent = "bg-blue-500/40" }) {
  if (data.length <= 0) return
  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="">
            <tr>
              {Object.keys(data[0]).map((key, index) => (
                <th key={index} className="px-4 py-2 border text-left">
                  {key === "Action" ? "" : key.toUpperCase().replaceAll("_", " ")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border" onClick={() => alert("Hello")}>
                {Object.keys(row).map((col, colIndex) => (
                  <td key={colIndex} className={`px-4 py-2 border ${accent} ${headers[colIndex] == "Action" ? "w-6" : ""}`}>
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
