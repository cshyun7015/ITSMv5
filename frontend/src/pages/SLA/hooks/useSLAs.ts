import { useState, useCallback, useEffect } from 'react';
import type { Sla } from '../types';
import { slaApi } from '../api/slaApi';

export const useSlas = () => {
    const [slas, setSlas] = useState<Sla[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSlas = useCallback(async () => {
        setLoading(true);
        try {
            const data = await slaApi.getSlas();
            setSlas(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSlas();
    }, [fetchSlas]);

    const createSla = async (data: Partial<Sla>) => {
        try {
            const res = await slaApi.createSla(data);
            await fetchSlas();
            return res;
        } catch (e: any) {
            setError(e.message);
            return null;
        }
    };

    return { slas, loading, error, createSla, refresh: fetchSlas };
};

export const useSlaDetail = (id: number | null) => {
    const [sla, setSla] = useState<Sla | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSla = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await slaApi.getSla(id);
            setSla(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSla();
    }, [fetchSla]);

    const updateSla = async (data: Partial<Sla>) => {
        if (!id) return null;
        try {
            const res = await slaApi.updateSla(id, data);
            setSla(res);
            return res;
        } catch (e: any) {
            setError(e.message);
            return null;
        }
    };

    const deleteSla = async () => {
        if (!id) return false;
        try {
            await slaApi.deleteSla(id);
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        }
    };

    return { sla, loading, error, updateSla, deleteSla, refresh: fetchSla };
};
