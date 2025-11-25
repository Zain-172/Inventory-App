export default function Table({ data, headers, accent = "bg-blue-500/40" }) {
  // const columns = Object.keys(data[0]);
  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-2 border text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border">
                {Object.keys(row).map((col, colIndex) => (
                  <td key={colIndex} className={`px-4 py-2 border ${accent}`}>
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
