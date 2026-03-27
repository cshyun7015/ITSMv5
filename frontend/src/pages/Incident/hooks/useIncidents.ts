import { useState, useEffect, useCallback } from 'react';
import { incidentApi } from '../api/incidentApi';
import type { Incident, IncidentCreateRequest } from '../types';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await incidentApi.getIncidents();
      setIncidents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createIncident = async (data: any, files: File[]) => {
    try {
      const created = await incidentApi.createIncident(data);
      if (files.length > 0) {
        for (const file of files) {
          await incidentApi.uploadAttachment(created.id, file);
        }
      }
      await fetchIncidents();
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return { incidents, loading, error, refresh: fetchIncidents, createIncident };
}
