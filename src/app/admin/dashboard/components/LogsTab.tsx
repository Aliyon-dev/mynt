export function LogsTab({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Audit Logs</h2>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200">
              <th className="pb-3 font-semibold px-2">Timestamp</th>
              <th className="pb-3 font-semibold px-2">User</th>
              <th className="pb-3 font-semibold px-2">Action</th>
              <th className="pb-3 font-semibold px-2">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.logs?.map((log: any) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="py-3 px-2 text-slate-500 font-mono text-xs">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-2 font-medium text-slate-800">
                  {log.user.username}
                </td>
                <td className="py-3 px-2 text-slate-600">
                  {log.action}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${log.status === "Allowed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
