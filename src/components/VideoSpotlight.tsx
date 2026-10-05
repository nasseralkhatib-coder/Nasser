import React, { useState } from 'react';
import { 
  Play, 
  Settings2, 
  ExternalLink, 
  Film, 
  CheckCircle2, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { Language } from '../types';
import { siteContent } from '../data/translations';

interface VideoSpotlightProps {
  lang: Language;
  videoUrl: string;
  onOpenCustomizer: () => void;
}

export const VideoSpotlight: React.FC<VideoSpotlightProps> = ({
  lang,
  videoUrl,
  onOpenCustomizer,
}) => {
  const content = siteContent[lang];
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper to extract embed url if youtube or format standard url
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <section id="media" className="py-20 bg-slate-900 relative border-t border-slate-800 overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-3">
            {content.video.sectionBadge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {content.video.heading}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {content.video.subheading}
          </p>
        </div>

        {/* Video Player Frame Container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
            
            {isPlaying ? (
              <div className="relative w-full aspect-video">
                <iframe
                  src={embedUrl}
                  title="Kemizone Corporate Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Custom Video Poster & Ambient Backdrop */
              <div className="relative w-full aspect-video flex items-center justify-center p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                
                {/* Decorative Industrial Pattern & Molecules */}
                <div 
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Animated Waves */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Center Content & Big Play Button */}
                <div className="relative z-10 text-center flex flex-col items-center">
                  
                  <button
                    id="video-play-btn"
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-teal-500/40 hover:scale-105 transition-all cursor-pointer group/play mb-4"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1 group-hover/play:scale-110 transition-transform" />
                  </button>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {lang === 'ar' ? 'شركة كميزون كميكال التجارية' : 'Kemizone Chemical Commercial .Co'}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-4">
                    {lang === 'ar' 
                      ? 'شاهد استعراض مرافق التخزين المتقدمة وتوريد المواد الكيميائية' 
                      : 'Explore our specialized chemical logistics & certified supply facilities'}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-xs text-teal-400 bg-teal-950/70 px-3 py-1 rounded-full border border-teal-500/30">
                    <Film className="w-3.5 h-3.5" />
                    <span>{content.video.playButtonText}</span>
                  </span>
                </div>

              </div>
            )}

            {/* Bottom Bar with Admin Quick Customizer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{content.video.customVideoNote}</span>
              </div>

              <button
                id="edit-video-btn"
                onClick={onOpenCustomizer}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-teal-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 font-medium"
              >
                <Settings2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{content.video.changeVideoBtn}</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
