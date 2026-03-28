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
      if (files && files.length > 0) {
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

export function useIncidentDetail(id: number | null) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (id === null) return;
    setLoading(true);
    try {
      const data = await incidentApi.getDetail(id);
      setIncident(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updateIncident = async (updates: Partial<Incident>) => {
    if (!id) return null;
    try {
      const updated = await incidentApi.updateIncident(id, updates);
      setIncident(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteIncident = async () => {
    if (!id) return false;
    try {
      await incidentApi.deleteIncident(id);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { incident, loading, error, refresh: fetchDetail, updateIncident, deleteIncident };
}
