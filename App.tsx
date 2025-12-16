import React from 'react';
import { PointerProvider } from './components/PointerContext';
import { Cursor } from './components/Cursor';
import { MagneticItem } from './components/MagneticItem';
import { CursorRegion } from './components/CursorRegion';
import {
  AppWindow,
  MessageSquare,
  Music,
  Settings,
  Camera,
  Mail,
  Map as MapIcon,
  Calendar,
  Search,
  ChevronRight,
  Plus,
  Image as ImageIcon,
  Wifi,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

const DOCK_ITEMS = [
  { icon: MessageSquare, gradient: 'bg-gradient-to-b from-green-400 to-green-600', iconColor: 'text-white', label: 'Messages' },
  { icon: Calendar, gradient: 'bg-white', iconColor: 'text-red-500', label: 'Calendar' },
  { icon: ImageIcon, gradient: 'bg-gradient-to-b from-white to-neutral-100', iconColor: 'text-sky-500', label: 'Photos' },
  { icon: Camera, gradient: 'bg-gradient-to-b from-neutral-300 to-neutral-400', iconColor: 'text-neutral-800', label: 'Camera' },
  { icon: Mail, gradient: 'bg-gradient-to-b from-blue-400 to-blue-600', iconColor: 'text-white', label: 'Mail' },
  { icon: Music, gradient: 'bg-gradient-to-b from-pink-500 to-red-600', iconColor: 'text-white', label: 'Music' },
  { icon: Settings, gradient: 'bg-gradient-to-b from-neutral-500 to-neutral-600', iconColor: 'text-white', label: 'Settings' },
];

const SectionHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
    <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
  </div>
);

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#0f0f11] flex flex-col items-center relative font-sans pb-16 overflow-x-hidden">

      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-4xl px-6 pt-12 flex flex-col gap-8">

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white tracking-tight">
            iPadOS Pointer Reproducing
          </h1>
          <p className="text-base text-neutral-400 font-medium text-balance">
            Interactive playground demonstrating the adaptive pointer behavior defined in Apple's Human Interface Guidelines.
          </p>

          {/* References - Moved Here */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
             <MagneticItem variant="highlight" borderRadius={8} className="px-3 py-1.5" hitAreaPadding={5}>
               <a
                 href="https://examples.motion.dev/react/ios-pointer?utm_source=embed&is_plus=true"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-xs text-neutral-500 group-hover:text-white transition-colors"
               >
                 Motion Example
               </a>
             </MagneticItem>
             <MagneticItem variant="highlight" borderRadius={8} className="px-3 py-1.5" hitAreaPadding={5}>
               <a
                 href="https://developer.apple.com/design/human-interface-guidelines/pointing-devices"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-xs text-neutral-500 group-hover:text-white transition-colors"
               >
                 Apple HIG
               </a>
             </MagneticItem>
          </div>
        </div>

        {/* GUIDELINE SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 1. BUTTONS: HIGHLIGHT VS LIFT */}
          <div className="bg-neutral-800/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/5">
            <SectionHeader
              title="Highlight vs. Lift"
              description="Use 'Highlight' for transparent elements. Use 'Lift' for opaque elements."
            />
            <div className="flex flex-col gap-6 items-center justify-center min-h-[140px] bg-neutral-900/30 rounded-2xl border border-white/5 p-6">

              {/* Highlight Example (Toolbar) */}
              <div className="flex items-center gap-3 p-1.5 rounded-xl bg-neutral-800/50 border border-white/5">
                {[Bold, Italic, Underline].map((Icon, i) => (
                  <MagneticItem
                    key={i}
                    variant="highlight"
                    className="w-9 h-9 text-neutral-300 rounded-lg"
                    borderRadius={8}
                    hitAreaPadding={5}
                  >
                    <Icon size={18} />
                  </MagneticItem>
                ))}
              </div>
              <span className="text-xs text-neutral-500">Highlight (Transparent Background)</span>

              <div className="w-full h-px bg-white/5 my-0" />

              {/* Lift Example */}
              <div className="flex items-center gap-6">
                <MagneticItem variant="lift" className="px-5 py-2 bg-blue-600 rounded-full text-white text-sm font-medium shadow-lg shadow-blue-900/20" borderRadius={999} hitAreaPadding={8}>
                  Save
                </MagneticItem>
                <MagneticItem variant="lift" className="w-10 h-10 bg-neutral-700 rounded-xl text-white" borderRadius={12} hitAreaPadding={8}>
                  <Wifi size={18} />
                </MagneticItem>
              </div>
              <span className="text-xs text-neutral-500">Lift (Opaque Background)</span>

            </div>
          </div>

          {/* 2. TEXT INTERACTION */}
          <div className="bg-neutral-800/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/5">
            <SectionHeader
              title="Text Selection"
              description="Over text regions, the pointer transforms into a vertical I-beam for precise placement."
            />
            <div className="min-h-[140px] flex items-center bg-neutral-900/30 rounded-2xl border border-white/5 p-6">
              <CursorRegion type="text">
                <p className="text-neutral-300 text-base leading-relaxed selection:bg-blue-500/30">
                  The <span className="text-blue-400 font-semibold">adaptive pointer</span> maintains context.
                  When hovering over non-interactive text, it becomes an I-beam.
                  <br/>
                  <span className="text-xs text-neutral-500 mt-2 block">Try selecting this text to see the native behavior simulation.</span>
                </p>
              </CursorRegion>
            </div>
          </div>

          {/* 3. LISTS & REGIONS */}
          <div className="bg-neutral-800/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/5">
             <SectionHeader
              title="List Highlighting"
              description="For lists, the pointer often acts as a highlight for the entire row."
            />
            <div className="bg-neutral-900/30 rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-1.5 space-y-1">
                {[
                  { label: 'Wi-Fi', value: 'MyNetwork', icon: Wifi },
                  { label: 'Bluetooth', value: 'On', icon: Music },
                  { label: 'Display', value: '', icon: AppWindow },
                ].map((item, i) => (
                  <MagneticItem
                    key={i}
                    variant="highlight"
                    className="w-full flex items-center justify-between p-3 rounded-xl text-neutral-200 group transition-colors"
                    borderRadius={12}
                    hitAreaPadding={4}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                        <item.icon size={13} />
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500 ml-2">
                      <span className="text-xs">{item.value}</span>
                      <ChevronRight size={14} />
                    </div>
                  </MagneticItem>
                ))}
              </div>
            </div>
          </div>

          {/* 4. HOVER (LARGE ELEMENTS) */}
          <div className="bg-neutral-800/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/5">
            <SectionHeader
              title="Hover (Large Elements)"
              description="For large cards, we scale the element slightly to indicate interactivity without shape morphing."
            />
            <div className="flex flex-col gap-4">
               {/* Large Card using 'Hover' variant */}
               <MagneticItem
                  variant="hover"
                  className="w-full h-44 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/5 p-5 flex items-start gap-4 overflow-hidden relative group"
                  borderRadius={16}
               >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                    <Music size={28} className="text-white" />
                  </div>
                  <div className="flex flex-col gap-1 z-10">
                    <h3 className="text-base font-semibold text-white">Music Library</h3>
                    <p className="text-sm text-neutral-400">Browse your favorite tracks. This large card uses the 'hover' variant.</p>
                  </div>
               </MagneticItem>
            </div>
          </div>

        </div>

        {/* Footer Dock Area */}
        <div className="mt-4 flex flex-col items-center gap-6 w-full">
           <div
            className="w-full max-w-sm h-11 bg-neutral-800/40 backdrop-blur-xl rounded-xl flex items-center px-2 gap-1 text-neutral-400 border border-neutral-700/50 shadow-2xl"
           >
              <MagneticItem variant="highlight" className="w-8 h-8 text-neutral-400" borderRadius={8} hitAreaPadding={4}>
                <Search size={16} />
              </MagneticItem>

              <CursorRegion type="text" className="flex-1 h-full flex items-center px-2">
                 <span className="text-sm font-medium text-neutral-500">Spotlight Search</span>
              </CursorRegion>

              <MagneticItem variant="highlight" className="w-8 h-8" borderRadius={8} hitAreaPadding={4}>
                <div className="flex gap-0.5">
                   <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
                   <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
                   <div className="w-1 h-1 rounded-full bg-neutral-500"></div>
                </div>
              </MagneticItem>
           </div>

          {/* Dock */}
          <div className="flex items-end gap-2.5 px-3 pb-3 pt-3 bg-white/10 backdrop-blur-2xl rounded-[28px] border border-white/10 shadow-2xl shadow-black/80">
            {DOCK_ITEMS.map((item, i) => (
              <MagneticItem
                key={i}
                variant="lift"
                className="relative z-20"
                borderRadius={16}
                hitAreaPadding={8} // 8px padding + 8px neighbor padding > 10px gap. Ensures continuous sticky cursor.
              >
                <div className={`w-[52px] h-[52px] ${item.gradient} ${item.iconColor} rounded-[14px] flex items-center justify-center shadow-lg relative overflow-hidden group`}>

                  {/* Inner highlight/reflection for that "squarcle" shine */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none" />

                  <item.icon size={26} className="fill-current opacity-90 relative z-10" strokeWidth={2} />
                </div>
              </MagneticItem>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <PointerProvider>
      <Cursor />
      <AppContent />
    </PointerProvider>
  );
}

export default App;