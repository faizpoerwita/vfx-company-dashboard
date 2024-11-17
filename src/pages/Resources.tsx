const Resources = () => {
  const resources = [
    {
      id: 1,
      name: 'Render Farm',
      type: 'Hardware',
      status: 'Available',
      utilization: 65,
      lastUpdated: '2 hours ago',
    },
    {
      id: 2,
      name: 'Motion Capture Studio',
      type: 'Facility',
      status: 'In Use',
      utilization: 100,
      lastUpdated: '30 minutes ago',
    },
    {
      id: 3,
      name: 'Compositing Workstations',
      type: 'Hardware',
      status: 'Maintenance',
      utilization: 0,
      lastUpdated: '1 day ago',
    },
    {
      id: 4,
      name: 'Animation Software Licenses',
      type: 'Software',
      status: 'Available',
      utilization: 80,
      lastUpdated: '1 hour ago',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{resource.name}</h3>
                <p className="text-sm text-gray-500">{resource.type}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  resource.status === 'Available'
                    ? 'bg-green-100 text-green-800'
                    : resource.status === 'In Use'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {resource.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Utilization</span>
                <span>{resource.utilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    resource.utilization > 80
                      ? 'bg-red-500'
                      : resource.utilization > 60
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${resource.utilization}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last Updated</span>
              <span>{resource.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
