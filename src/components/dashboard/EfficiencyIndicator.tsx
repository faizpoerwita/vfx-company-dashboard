import React from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface EfficiencyMetrics {
  timeline: number;
  resources: number;
  milestones: number;
  overall: number;
}

interface EfficiencyIndicatorProps {
  metrics: EfficiencyMetrics;
}

export const EfficiencyIndicator: React.FC<EfficiencyIndicatorProps> = ({ metrics }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Efficiency Score</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <IconInfoCircle className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/80 border border-neutral-800 text-neutral-200">
                <div className="space-y-2 max-w-xs">
                  <p className="text-sm font-medium">Project Efficiency Score</p>
                  <ul className="text-xs space-y-1 text-neutral-400">
                    <li>• Timeline: Meeting deadlines and milestone targets</li>
                    <li>• Resources: Team and budget utilization</li>
                    <li>• Milestones: Quality and deliverable completion</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-sm font-semibold text-neutral-300">{metrics.overall}%</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-500">Timeline</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <IconInfoCircle className="w-3 h-3 text-neutral-600 hover:text-neutral-400 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-black/80 border border-neutral-800 text-neutral-200">
                    <div className="space-y-1 max-w-xs">
                      <p className="text-sm font-medium">Timeline Efficiency</p>
                      <p className="text-xs text-neutral-400">
                        Measures adherence to project schedule and milestone timing
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs text-neutral-400">{metrics.timeline}%</span>
          </div>
          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${metrics.timeline}%` }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-500">Resources</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <IconInfoCircle className="w-3 h-3 text-neutral-600 hover:text-neutral-400 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-black/80 border border-neutral-800 text-neutral-200">
                    <div className="space-y-1 max-w-xs">
                      <p className="text-sm font-medium">Resource Efficiency</p>
                      <p className="text-xs text-neutral-400">
                        Tracks team productivity and resource allocation
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs text-neutral-400">{metrics.resources}%</span>
          </div>
          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${metrics.resources}%` }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-500">Milestones</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <IconInfoCircle className="w-3 h-3 text-neutral-600 hover:text-neutral-400 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-black/80 border border-neutral-800 text-neutral-200">
                    <div className="space-y-1 max-w-xs">
                      <p className="text-sm font-medium">Milestone Efficiency</p>
                      <p className="text-xs text-neutral-400">
                        Evaluates completion quality and client feedback
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs text-neutral-400">{metrics.milestones}%</span>
          </div>
          <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${metrics.milestones}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
