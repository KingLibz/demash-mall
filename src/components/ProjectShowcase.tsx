import React, { useState } from 'react';
import { PROJECTS, TESTIMONIALS } from '../data/companyData';
import { ProjectItem } from '../types';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Maximize2, 
  ArrowRight, 
  CheckCircle2, 
  Quote, 
  ShieldCheck 
} from 'lucide-react';

interface ProjectShowcaseProps {
  onOpenDirectorModal: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onOpenDirectorModal }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Residential' | 'Commercial' | 'Swimming Pool' | 'Civil Engineering'>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = activeFilter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
          <Building2 className="w-3.5 h-3.5" />
          <span>PROVEN ZIMBABWE EXECUTION TRACK RECORD</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          Featured Projects & Civil Works
        </h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Explore our marquee residential villas, commercial distribution centers, and architectural infinity pools across Borrowdale, Highlands, Glen Lorne, and Harare.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {(['All', 'Residential', 'Commercial', 'Swimming Pool', 'Civil Engineering'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col shadow-xl"
          >
            {/* Image banner */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                  {project.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1 text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {project.location}
                </span>
                <span className="font-mono text-slate-400">{project.year}</span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Built Area</div>
                  <div className="font-mono font-semibold text-slate-200 mt-0.5">{project.stats.area}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Timeline</div>
                  <div className="font-mono font-semibold text-slate-200 mt-0.5">{project.stats.timeline}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Specification</div>
                  <div className="font-semibold text-amber-400 mt-0.5 truncate">{project.stats.spec}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <button
                  onClick={onOpenDirectorModal}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Inquire About Similar Build</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Client Testimonials Section */}
      <div className="pt-8 space-y-6 border-t border-slate-800">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase text-amber-400 font-semibold">
            Client Verifications
          </div>
          <h3 className="text-2xl font-bold text-white">Client Testimonials & Diaspora Feedback</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-amber-400 opacity-60" />
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-sm font-bold text-white">{t.author}</div>
                <div className="text-[11px] text-amber-400">{t.location}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.project}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
