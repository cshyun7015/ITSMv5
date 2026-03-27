import { useState, useCallback, useEffect } from 'react';
import { serviceRequestApi } from '../api/serviceRequestApi';
import type { ServiceRequest, ServiceRequestFilters, ServiceRequestListResponse } from '../types';

export const useServiceRequests = (initialFilters: Partial<ServiceRequestFilters> = {}) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServiceRequestFilters>({
    page: 0,
    size: 10,
    search: '',
    status: '',
    sort: 'id,desc',
    ...initialFilters
  });
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviceRequestApi.getRequests(filters);
      setRequests(data.content || []);
      setPagination({
        totalPages: data.totalPages,
        totalElements: data.totalElements
      });
    } catch (e) {
      setError('요청 데이터를 불러오는 중 오류가 발생했습니다.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchRequests]);

  const updateFilters = (newFilters: Partial<ServiceRequestFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page ?? 0 }));
  };

  const handleSort = (field: string) => {
    const [prevField, prevDir] = filters.sort.split(',');
    const isSame = prevField === field;
    const dir = isSame ? (prevDir === 'asc' ? 'desc' : 'asc') : 'asc';
    updateFilters({ sort: `${field},${dir}` });
  };

  const deleteRequest = async (id: number) => {
    try {
      await serviceRequestApi.deleteRequest(id);
      fetchRequests();
      return true;
    } catch (e) {
      setError('삭제 중 오류가 발생했습니다.');
      return false;
    }
  };

  return {
    requests,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    handleSort,
    deleteRequest,
    refresh: fetchRequests
  };
};

export const useServiceRequestDetail = (id: number | null) => {
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (id === null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await serviceRequestApi.getDetail(id);
      setRequest(data);
    } catch (e) {
      setError('상세 정보를 불러오는 중 오류가 발생했습니다.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updateRequest = async (updates: Partial<ServiceRequest> & { assigneeId?: number }) => {
    if (!id) return false;
    try {
      await serviceRequestApi.updateRequest(id, updates);
      fetchDetail();
      return true;
    } catch (e) {
      setError('저장 중 오류가 발생했습니다.');
      return false;
    }
  };

  return {
    request,
    loading,
    error,
    updateRequest,
    refresh: fetchDetail
  };
};
