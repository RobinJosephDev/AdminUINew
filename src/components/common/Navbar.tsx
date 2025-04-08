import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../../styles/Navbar.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FiClipboard, FiUsers, FiLogOut, FiFileText, FiPackage, FiTruck, FiSettings } from 'react-icons/fi';
import { useUser } from '../../UserProvider';

const API_URL = process.env.VITE_API_BASE_URL;


const CustomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole } = useUser();

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Logout failed', error);
    }

    // Clear stored credentials
    localStorage.clear();
    setUserRole(null);

    Swal.fire({
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/login', { replace: true });
      window.location.reload(); // Ensure a full state reset
    });
  };

  useEffect(() => {
    if (!userRole) {
      navigate('/login', { replace: true });
    }
  }, [userRole, navigate]);

  if (!userRole) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand as={NavLink} to="/">
        Sealink Logistics
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav>
          <NavDropdown title="CRM" id="crm-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={NavLink} to="/lead" className="custom-dropdown-item">
              <FiClipboard className="dropdown-icon" /> Leads
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/follow-up" className="custom-dropdown-item">
              <FiUsers className="dropdown-icon" /> Follow-up
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Quotes" id="quotes-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={NavLink} to="/quote" className="custom-dropdown-item">
              <FiFileText className="dropdown-icon" /> Quotes
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/quotes-lead" className="custom-dropdown-item">
              <FiUsers className="dropdown-icon" /> Leads with Quotes
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link as={NavLink} to="/customer">
            <FiUsers className="nav-icon" /> Customers
          </Nav.Link>
          <Nav.Link as={NavLink} to="/order">
            <FiPackage className="nav-icon" /> Orders
          </Nav.Link>
          <Nav.Link as={NavLink} to="/carrier">
            <FiTruck className="nav-icon" /> Carriers
          </Nav.Link>
          <Nav.Link as={NavLink} to="/vendor">
            <FiPackage className="nav-icon" /> Vendors
          </Nav.Link>
          <Nav.Link as={NavLink} to="/broker">
            <FiUsers className="nav-icon" /> Brokers
          </Nav.Link>

          <NavDropdown title="More" id="more-dropdown" className="custom-dropdown">
            <NavDropdown.Item as={NavLink} to="/user" className="custom-dropdown-item">
              <FiUsers className="dropdown-icon" /> Users
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/settings" className="custom-dropdown-item">
              <FiSettings className="dropdown-icon" /> Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout} className="custom-dropdown-item logout">
              <FiLogOut className="dropdown-icon" /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
