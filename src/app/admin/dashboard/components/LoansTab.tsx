export function LoansTab({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          Loan Activity
        </h2>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200">
              <th className="pb-3 font-semibold px-2">Date</th>
              <th className="pb-3 font-semibold px-2">Student</th>
              <th className="pb-3 font-semibold px-2">Bank</th>
              <th className="pb-3 font-semibold px-2">Amount</th>
              <th className="pb-3 font-semibold px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.loans?.map((loan: any) => (
              <tr key={loan.id} className="hover:bg-slate-50">
                <td className="py-3 px-2 text-slate-500">
                  {new Date(loan.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-2 font-medium text-slate-800">
                  {loan.student.username}
                </td>
                <td className="py-3 px-2 text-slate-600">
                  {loan.bank.name}
                </td>
                <td className="py-3 px-2 font-semibold text-slate-900">
                  ${loan.amount.toFixed(2)}
                </td>
                <td className="py-3 px-2">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-semibold border border-emerald-100">
                    {loan.status}
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
