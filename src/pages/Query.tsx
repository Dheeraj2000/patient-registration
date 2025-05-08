import { SqlQueryComponent } from "@/components/sql-query-component";

export default function Query() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SQL Query</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <SqlQueryComponent />
      </div>
    </div>
  );
}
