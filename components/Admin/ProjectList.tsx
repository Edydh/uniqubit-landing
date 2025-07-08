import { FC } from 'react';

const mockProjects = [
  { id: 1, name: 'Project Alpha', client: 'Client A', status: 'In Progress', progress: 60 },
  { id: 2, name: 'Project Beta', client: 'Client B', status: 'Completed', progress: 100 },
  { id: 3, name: 'Project Gamma', client: 'Client A', status: 'On Hold', progress: 25 },
];

const ProjectList: FC = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-5 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4">Recent Projects</h3>
      <div className="space-y-4">
        {mockProjects.map((project) => (
          <div key={project.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">{project.name}</p>
              <p className="text-sm text-gray-400">{project.client}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${project.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                {project.status}
              </p>
              <div className="w-24 bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
