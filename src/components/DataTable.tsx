import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
}

const mockData: Employee[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 85000,
    hireDate: '2022-01-15',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 72000,
    hireDate: '2021-08-20',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    department: 'Engineering',
    position: 'Frontend Developer',
    salary: 68000,
    hireDate: '2023-03-10',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    department: 'HR',
    position: 'HR Specialist',
    salary: 55000,
    hireDate: '2022-06-01',
    status: 'On Leave'
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 60000,
    hireDate: '2021-11-15',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    salary: 78000,
    hireDate: '2022-09-05',
    status: 'Inactive'
  },
  {
    id: 7,
    name: 'James Taylor',
    email: 'james.taylor@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 65000,
    hireDate: '2023-01-20',
    status: 'Active'
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@company.com',
    department: 'Marketing',
    position: 'Content Specialist',
    salary: 58000,
    hireDate: '2022-04-12',
    status: 'Active'
  },
  {
    id: 9,
    name: 'Robert Garcia',
    email: 'robert.garcia@company.com',
    department: 'Engineering',
    position: 'Backend Developer',
    salary: 75000,
    hireDate: '2021-12-08',
    status: 'Active'
  },
  {
    id: 10,
    name: 'Mary Rodriguez',
    email: 'mary.rodriguez@company.com',
    department: 'Sales',
    position: 'Sales Manager',
    salary: 82000,
    hireDate: '2021-05-30',
    status: 'Active'
  },
  {
    id: 11,
    name: 'William Lee',
    email: 'william.lee@company.com',
    department: 'IT',
    position: 'System Administrator',
    salary: 70000,
    hireDate: '2022-10-18',
    status: 'Active'
  },
  {
    id: 12,
    name: 'Patricia Thompson',
    email: 'patricia.thompson@company.com',
    department: 'HR',
    position: 'HR Manager',
    salary: 80000,
    hireDate: '2021-07-14',
    status: 'Active'
  }
];

type SortField = keyof Employee;
type SortOrder = 'asc' | 'desc';

const DataTable: React.FC = () => {
  const [data] = useState<Employee[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const departments = useMemo(() => {
    const depts = Array.from(new Set(data.map(item => item.department)));
    return depts.sort();
  }, [data]);

  const statuses = useMemo(() => {
    const stats = Array.from(new Set(data.map(item => item.status)));
    return stats.sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesDepartment = !selectedDepartment || item.department === selectedDepartment;
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [data, searchTerm, selectedDepartment, selectedStatus]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200";
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case 'Inactive':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case 'On Leave':
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Employee Directory</h2>
            <p className="text-slate-600">Manage and view employee information</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {(searchTerm || selectedDepartment || selectedStatus) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 flex items-center gap-1"
              >
                <Filter className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'department', label: 'Department' },
                { key: 'position', label: 'Position' },
                { key: 'salary', label: 'Salary' },
                { key: 'hireDate', label: 'Hire Date' },
                { key: 'status', label: 'Status' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                  onClick={() => handleSort(key as SortField)}
                >
                  <div className="flex items-center">
                    {label}
                    {getSortIcon(key as SortField)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedData.map((employee, index) => (
              <tr
                key={employee.id}
                className="hover:bg-slate-50 transition-all duration-200 group"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.3s ease-out forwards'
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="font-semibold text-slate-900">{employee.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{employee.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                    {employee.department}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-700 font-medium">{employee.position}</td>
                <td className="px-6 py-4 text-slate-900 font-semibold">{formatSalary(employee.salary)}</td>
                <td className="px-6 py-4 text-slate-600">{formatDate(employee.hireDate)}</td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(employee.status)}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">No results found</div>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      {sortedData.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;