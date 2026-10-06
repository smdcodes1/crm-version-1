import React, { useState, useMemo } from 'react';
import ProjectFormModal from "../../components/forms/ProjectFormModal/ProjectFormModal";
import {FolderKanban,Plus,Search,Building,Calendar,User,Edit2,Trash2,CheckCircle2,Clock,Trophy} from "lucide-react";
import StatCard from '../../components/StatCard/StatCard';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import "./CurrentProjectsView.css";
import { useCRM } from '../../context/CRMContext';
import { formatDate, formatINR } from '../../utils/Formatters';
// const statsData = [
//   {
//     title: 'TOTAL PROJECTS',
//     value: '4',
//     subtitle: 'All active & planned',
//     icon: <FolderKanbanIcon />,
//     colorScheme: 'purple',
//   },
//   {
//     title: 'IN PROGRESS',
//     value: '3',
//     subtitle: 'Actively in development',
//     icon: <ClockIcon />,
//     colorScheme: 'blue',
//   },
//   {
//     title: 'COMPLETED',
//     value: '0',
//     subtitle: 'Delivered to clients',
//     icon: <CheckCircleIcon />,
//     colorScheme: 'green',
//     valueColor: '#7c3aed',
//   },
//   {
//     title: 'TOTAL PROJECT VALUE',
//     value: '₹3,70,000',
//     subtitle: 'Active project portfolio',
//     icon: <TrophyIcon />,
//     colorScheme: 'blue',
//   },
// ];
// const INITIAL_GROUPS = [
//   {
//     companyId: 1,
//     companyName: 'ABC Technologies',
//     projects: [
//       {
//         id: 101,
//         title: 'Website Development',
//         description: 'Corporate portal redesign with customer dashboard and analytics.',
//         progress: 65,
//         dueDate: '15 Sept 2026',
//         assignee: 'Alex Morgan',
//         status: 'In Progress'
//       },
//       {
//         id: 102,
//         title: 'SEO Campaign',
//         description: 'Keyword research, on-page optimization, and technical audit.',
//         progress: 45,
//         dueDate: '1 Oct 2026',
//         assignee: 'Priya Sharma',
//         status: 'In Progress'
//       }
//     ]
//   },
//   {
//     companyId: 2,
//     companyName: 'XYZ Ltd',
//     projects: [
//       {
//         id: 201,
//         title: 'Mobile Application',
//         description: 'Cross-platform customer loyalty and instant ordering app.',
//         progress: 15,
//         dueDate: '30 Aug 2026',
//         assignee: 'Rohan Patel',
//         status: 'Planning'
//       }
//     ]
//   }
// ];
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);
const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

function CurrentProjectsView() {
  // const [projects, setProjects] = useState(INITIAL_GROUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingProject, setEditingProject] = useState(null);
  const { isAddProjectOpen, setIsAddProjectOpen, deleteProject, projects, updateProject } = useCRM();
  const filterTabs = ['All', 'Planning', 'In Progress', 'On Hold', 'Completed'];
  // Summary metrics
  const totalCount = projects.length;
  const inProgressCount = projects.filter((p) => p.status === 'In Progress').length;
  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const totalProjectValue = projects.reduce((sum, p) => sum + (p.projectValue || 0), 0);

  // const filteredProjects = useMemo(() => {
  //   const term = searchQuery.toLowerCase().trim();

  //   return projects
  //     .map((group) => {
  //       const matchingProjects = group.projects.filter((project) => {
  //         const matchesStatus =
  //           statusFilter === 'All' || project.status === statusFilter;

  //         const matchesSearch =
  //           term === '' ||
  //           project.title.toLowerCase().includes(term) ||
  //           project.description.toLowerCase().includes(term) ||
  //           project.assignee.toLowerCase().includes(term) ||
  //           group.companyName.toLowerCase().includes(term);

  //         return matchesStatus && matchesSearch;
  //       });

  //       return {
  //         ...group,
  //         projects: matchingProjects
  //       };
  //     })
  //     .filter((group) => group.projects.length > 0);
  // }, [projects, searchQuery, statusFilter]);

  // Group by Company
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.assignedTo && p.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
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
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete project "${name}"?`)) {
      deleteProject(id);
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
        <button onClick={() => {
          setEditingProject(null);
          setIsAddProjectOpen(true);
        }}>Add project</button>
      </div>

      <div className='stat-cards-wrapper'>
        <div className="stat-cards-grid">
          {/* {statsData.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                        colorScheme={stat.colorScheme}
                        valueColor={stat.valueColor}
                    />
                ))} */}
          <StatCard
            // key={index}
            title="Total Projects"
            value={totalCount}
            subtitle="All active & planned"
            icon={<FolderKanban />}
            colorScheme="purple"
          // valueColor={stat.valueColor}
          />
          <StatCard
            // key={index}
            title="In Progress"
            value={inProgressCount}
            subtitle="Actively in development"
            icon={<Clock />}
            colorScheme="blue"
          // valueColor={stat.valueColor}
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
                            <DeleteIcon />
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
