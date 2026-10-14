import React, { useState, useMemo } from 'react';
import ProjectFormModal from "../../components/forms/ProjectFormModal/ProjectFormModal";
import {FolderKanban,Plus,Search,Building,Calendar,User,Edit2,Trash2,CheckCircle2,Clock,Trophy} from "lucide-react";
import StatCard from '../../components/StatCard/StatCard';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import "./CurrentProjectsView.css";
import { useCRM } from '../../context/CRMContext';
import { formatDate, formatINR } from '../../utils/Formatters';
import Swal from 'sweetalert2';
import { SearchIcon,EditIcon,TrashIcon } from '../../components/StatCard/StatCard';

const yearOptions= ['Monthly', 'Quarterly', 'Halfly', 'Annually'];
function CurrentProjectsView() {
  // const [projects, setProjects] = useState(INITIAL_GROUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingProject, setEditingProject] = useState(null);
  const [yearFilter, setYearFilter]= useState("Monthly");
  const { isAddProjectOpen, setIsAddProjectOpen, deleteProject, projects, updateProject } = useCRM();
  const filterTabs = ['All', 'Planning', 'In Progress', 'On Hold', 'Completed'];
  const isWithinFilter = (dateString, filter) => {
    if (!dateString) return false;
    const itemDate = new Date(dateString);
    if (isNaN(itemDate.getTime())) return false;

    const now = new Date();
    const daysDifference = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);

    switch (filter) {
        case 'Monthly':
            return daysDifference <= 30;
        case 'Quarterly':
            return daysDifference <= 90;
        case 'Halfly':
            return daysDifference <= 180;
        case 'Annually':
            return daysDifference <= 365;
        default:
            return true;
    }
  };
  const filteredProjectsHeader = projects.filter(p => isWithinFilter(p.createdAt, yearFilter));
  // Summary metrics
  const totalCount = filteredProjectsHeader.length;
  const inProgressCount = filteredProjectsHeader.filter((p) => p.status === 'In Progress').length;
  const completedCount = filteredProjectsHeader.filter((p) => p.status === 'Completed').length;
  const totalProjectValue = filteredProjectsHeader.reduce((sum, p) => sum + (p.projectValue || 0), 0);

  // Group by Company
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.assignedTo && p.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesDate = isWithinFilter(p.createdAt, yearFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });
  // Grouping map: customerName -> Project[]
  const groupedByCompany = filteredProjects.reduce((acc, proj) => {
    const company = proj.customerName || 'General Client';
    if (!acc[company]) acc[company] = [];
    acc[company].push(proj);
    return acc;
  }, {});
  const companyNames = Object.keys(groupedByCompany);

  // const handleDeleteProject = (companyId, projectId) => {
  //   setProjects((prevGroups) =>
  //     prevGroups.map((g) => {
  //       if (g.companyId === companyId) {
  //         return {
  //           ...g,
  //           projects: g.projects.filter((p) => p.id !== projectId)
  //         };
  //       }
  //       return g;
  //     })
  //   );
  // }; 
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete project "${name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await deleteProject(id);
        // Optional: Show success toast/alert after successful deletion
        Swal.fire({
          title: 'Deleted!',
          text: `Project "${name}" has been deleted.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Failed to delete project:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete project. Please try again.',
          icon: 'error',
        });
      }
    }
  };
  // update progress 
  const handleUpdateProgress= (id, newProgress)=> {
    const status=
      newProgress >= 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : 'Planning';
    updateProject(id, { progress: newProgress, status });
  };
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Current Projects</h2>
          <p>Track client deliverables organized neatly by company.</p>
        </div>
        <div className='year-container'>
          <select
            className="select-filter year-select"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            {yearOptions.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
          </select>
          <button onClick={() => {
            setEditingProject(null);
            setIsAddProjectOpen(true);
          }}>Add project</button>
        </div>
       
      </div>

      <div className='stat-cards-wrapper'>
        <div className="stat-cards-grid">
         
          <StatCard
            // key={index}
            title="Total Projects"
            value={totalCount}
            subtitle="All active & planned"
            icon={<FolderKanban />}
            colorScheme="purple"
      
          />
          <StatCard
            // key={index}
            title="In Progress"
            value={inProgressCount}
            subtitle="Actively in development"
            icon={<Clock />}
            colorScheme="blue"
     
          />
          <StatCard
            // key={index}
            title="Completed"
            value={completedCount}
            subtitle="Delivered to clients"
            icon={<CheckCircle2 />}
            colorScheme="green"
            valueColor="#7c3aed"
          />
          <StatCard
            // key={index}
            title="Total project value"
            value={formatINR(totalProjectValue)}
            subtitle="Active project portfolio"
            icon={<Trophy />}
            colorScheme="blue"
          // valueColor="#7c3aed"
          />

        </div>
      </div>

      <div className='projects-container'>
        {/* Filter / Search Bar */}
        <div className="projects-controls">
          <div className="projects-search-wrapper">
            <span className="search-icon">
              <SearchIcon />
            </span>
            <input
              type="text"
              className="projects-search-input"
              placeholder="Search projects by name, company, assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab-btn ${statusFilter === tab ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List Grouped by Company */}
        {filteredProjects.length === 0 ? (
          <div className='empty-state'>
            No projects found matching your search and filter criteria.
          </div>
        ) : (
          companyNames.map((company) => {
            const companyProjects = groupedByCompany[company];
            return (
              <div key={company} className="company-group">
                {/* Company Section Header */}
                <div className="company-header">
                  <div className="company-title-area">
                    <h3 className="company-name">{company}</h3>
                    <span className="projects-count-label">
                      {companyProjects.length} project(s) assigned
                    </span>
                  </div>
                  <button type="button" className="add-project-btn" title="Add Project" onClick={() => {
                    setEditingProject(null);
                    setIsAddProjectOpen(true);
                  }}>
                    + Add Project
                  </button>
                </div>

                {/* Grid of Project Cards */}
                <div className="cards-grid">
                  {companyProjects.map((project) => (
                    <div key={project.id} className="project-card">
                      {/* Card Title & Status Badge */}
                      <div className="card-top">
                        <h4 className="project-title">{project.projectName}</h4>
                        <StatusBadge status={project.status} size="md" />
                      </div>

                      {/* Description */}
                      {project.description && (
                        <p className="project-desc">{project.description}</p>
                      )}

                      {/* Progress Bar */}
                      <div className="progress-wrapper">
                        <div className="progress-labels">
                          <span className="progress-title">Progress</span>
                          <span className="progress-percentage">{project.progress}%</span>
                        </div>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Footer: Metadata & Action Icons */}
                      <div className="card-footer2">
                        <div className="meta-info">
                          <div className="meta-item">
                            {/* <span className="meta-icon">
                              <CalendarIcon />
                            </span> */}
                            <span>Due: {formatDate(project.deadline)}</span>
                          </div>
                          {project.assignedTo && (
                            <div className="meta-item">
                              {/* <span className="meta-icon">
                                <UserIcon />
                              </span> */}
                              <span>{project.assignedTo}</span>
                            </div>
                          )}
                        </div>

                        <div className="card-actions">
                          <button type="button" className="action-icon-btn1" title="Edit" onClick={() => {
                            setEditingProject(project);
                            setIsAddProjectOpen(true);
                          }}>
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="action-icon-btn2"
                            title="Delete"
                            onClick={() => handleDelete(project.id, project.projectName)}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

    <ProjectFormModal 
      isOpen={isAddProjectOpen}
      onClose={()=> {
        setIsAddProjectOpen(false);
        setEditingProject(null);
      }}
      projectToEdit={editingProject}
     />
    </>
  );
}

export default CurrentProjectsView
