import { useState, useEffect } from "react";
import "../styles.css";

interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
}

const LOCAL_STORAGE_KEY = "employeeList";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: Date.now(),
    name: "",
    department: "",
    role: "",
  });
  useEffect(() => {
    fetch("/employees.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.Employees) {
          setEmployees(data.Employees);
          setFilteredEmployees(data.Employees);
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(data.Employees)
          );
        }
      })
      .catch((error) => {
        console.error("Error loading employees:", error);
      });
  }, []);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.department) {
      alert("Name and Department are required!");
      return;
    }

    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEmployees));
    setNewEmployee({ id: Date.now(), name: "", department: "", role: "" });
  };

  const handleDeleteEmployee = (id: number) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== id);
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEmployees));
  };

  const handleSearch = () => {
    const results = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(results);
  };

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

  const handleSort = () => {
    const sortedEmployees = [...filteredEmployees].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredEmployees(sortedEmployees);
  };

  return (
    <div className="container">
      <h1>Employee Management</h1>

      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Filter by department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        />
        <button onClick={handleFilterByDepartment}>Filter</button>
      </div>

      <div>
        <button onClick={handleSort}>Sort Alphabetically</button>
      </div>

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

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.role}</td>
                <td>
                  <button onClick={() => handleDeleteEmployee(employee.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No match found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
