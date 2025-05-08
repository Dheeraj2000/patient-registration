import React, { useEffect } from "react";
import { useState } from "react";
import { getPatientDataServiceInstance } from "./patient-service";


export function useSqlQuery() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const patientDataService = getPatientDataServiceInstance();
  
    useEffect(() => {
      const unsubscribe = patientDataService.addListener(async () => {
        if (results.length > 0) {
          await executeQuery(lastQuery.current);
        }
      });
  
      return unsubscribe;
    }, [results]);
  
    const lastQuery = React.useRef<string>("");
  
    const executeQuery = async (sql: string) => {
      try {
        setLoading(true);
        setError(null);
        lastQuery.current = sql;
        const queryResults = await patientDataService.executeQuery(sql);
        setResults(queryResults);
      } catch (err: any) {
        setError(err.message || "Failed to execute query");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
  
    return { results, loading, error, executeQuery };
  }