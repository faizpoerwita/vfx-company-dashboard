import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Card } from "@/components/ui/card";
import { IconCheck, IconAlertCircle, IconClock } from '@tabler/icons-react';

const tasks = [
  {
    id: "1",
    title: "Render Final Scene",
    project: "Product Animation",
    assignee: "Budi Santoso",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-03-10"
  },
  {
    id: "2",
    title: "Character Rigging",
    project: "VFX Short Film",
    assignee: "Dewi Putri",
    priority: "medium",
    status: "pending",
    dueDate: "2024-03-15"
  },
  {
    id: "3",
    title: "Texture Mapping",
    project: "Architectural Viz",
    assignee: "Andi Wijaya",
    priority: "low",
    status: "completed",
    dueDate: "2024-03-08"
  },
  {
    id: "4",
    title: "Motion Graphics",
    project: "Brand Campaign",
    assignee: "Sarah Chen",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-03-12"
  }
];

export const TasksSection = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <IconCheck className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <IconClock className="w-5 h-5 text-blue-500" />;
      default:
        return <IconAlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Active Tasks</h2>
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <BackgroundGradient key={task.id} className="rounded-[22px] p-1 bg-zinc-900">
            <Card className="p-6 rounded-[20px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(task.status)}
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-400">{task.project}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{task.assignee}</p>
                    <p className="text-xs text-gray-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </Card>
          </BackgroundGradient>
        ))}
      </div>
    </div>
  );
}

export default TasksSection;
