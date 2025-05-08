
import { useSqlQuery } from "@/lib/sql-query-component";
import React, { useState } from "react";


export function SqlQueryComponent() {
  const [query, setQuery] = useState<string>("");
  const { results, loading, error, executeQuery } = useSqlQuery();
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await executeQuery(query);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sqlQuery" className="text-sm font-medium">
            SQL Query
          </label>
          <textarea
            id="sqlQuery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded-md font-mono text-sm"
            rows={5}
            placeholder="SELECT * FROM patients"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Executing..." : "Execute Query"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 font-medium">Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {value !== null ? String(value) : "null"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
