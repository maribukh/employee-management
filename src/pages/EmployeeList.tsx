import { useState, useEffect } from "react";
import "../styles.css"; 
// Define the type for an employee
interface Employee {
  name: string;
  department: string;
  role: string;
}

const LOCAL_STORAGE_KEY = "employeeList";

const EmployeeList = () => {
  // Define types for the states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    department: "",
    role: "",
  });

  useEffect(() => {
    const storedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedEmployees) {
      const parsedEmployees: Employee[] = JSON.parse(storedEmployees);
      setEmployees(parsedEmployees);
      setFilteredEmployees(parsedEmployees);
    } else {
      const defaultEmployees: Employee[] = [
        { name: "Alice", department: "HR", role: "Manager" },
        { name: "Bob", department: "Engineering", role: "Developer" },
        { name: "Charlie", department: "Sales", role: "Representative" },
      ];
      setEmployees(defaultEmployees);
      setFilteredEmployees(defaultEmployees);
    }
  }, []);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.department) {
      alert("Name and Department are required!");
      return;
    }

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);

    // Save the updated list to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEmployees));
    setNewEmployee({ name: "", department: "", role: "" });
  };

  // Search function
  const handleSearch = () => {
    const results = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(results);
  };

  // Filter by department function
  const handleFilterByDepartment = () => {
    if (departmentFilter === "") {
      setFilteredEmployees(employees);
    } else {
      const results = employees.filter((employee) =>
        employee.department
          .toLowerCase()
          .includes(departmentFilter.toLowerCase())
      );
      setFilteredEmployees(results);
    }
  };

  // Sorting function
  const handleSort = () => {
    const sortedEmployees = [...filteredEmployees].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredEmployees(sortedEmployees);
  };

  return (
    <div className="container">
      <h1>Employee Management</h1>

      {/* Search by name */}
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Filter by department */}
      <div>
        <input
          type="text"
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        />
        <button onClick={handleFilterByDepartment}>Filter</button>
      </div>

      {/* Sort alphabetically */}
      <div>
        <button onClick={handleSort}>Sort Alphabetically</button>
      </div>

      {/* Add new employee */}
      <div>
        <h3>Add New Employee</h3>
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Department"
          value={newEmployee.department}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, department: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Role"
          value={newEmployee.role}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, role: e.target.value })
          }
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>

      {/* Employee List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No match found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
