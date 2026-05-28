import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Calendar, FileText, Sparkles, FolderOpen, Heart, Save } from 'lucide-react';
import { Note } from '../types';

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize
  useEffect(() => {
    const saved = localStorage.getItem('toolnest-notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        if (parsed.length > 0) {
          setSelectedNoteId(parsed[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Seed initial notes
      const initialNotes: Note[] = [
        {
          id: '1',
          title: 'Welcome to ToolNest Notes',
          content: 'Keep simple records, write checklist templates, and store temporary code blocks and URLs here.\n\nKey features:\n- All data is saved automatically in local memory\n- Categorize by functional tags and custom color themes\n- Filter list synchronously as you type\n\nMade for high-performance productivity!',
          color: 'indigo',
          category: 'Personal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Weekly Task List',
          content: '- Double check currency real-time rates API integration\n- Render new layout guidelines to user interface\n- Deploy testing logs to testing container',
          color: 'emerald',
          category: 'Work',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      setNotes(initialNotes);
      setSelectedNoteId(initialNotes[0].id);
      localStorage.setItem('toolnest-notes', JSON.stringify(initialNotes));
    }
  }, []);

  // Sync to local storage on changes with debounce/auto-save simulated effect
  const saveNotesToStorage = (updatedNotes: Note[]) => {
    setIsSaving(true);
    localStorage.setItem('toolnest-notes', JSON.stringify(updatedNotes));
    setTimeout(() => {
      setIsSaving(false);
    }, 400); // Quick feedback effect
  };

  const currentSelectedNote = notes.find(n => n.id === selectedNoteId) || null;

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      color: 'indigo',
      category: activeCategory === 'All' ? 'Personal' : activeCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setSelectedNoteId(newNote.id);
    saveNotesToStorage(updated);
  };

  const handleUpdateNoteField = (id: string, field: keyof Note, value: string) => {
    const updated = notes.map(n => {
      if (n.id === id) {
        return {
          ...n,
          [field]: value,
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    });
    setNotes(updated);
    saveNotesToStorage(updated);
  };

  const handleDeleteNote = (id: string) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    saveNotesToStorage(remaining);

    if (selectedNoteId === id) {
      if (remaining.length > 0) {
        setSelectedNoteId(remaining[0].id);
      } else {
        setSelectedNoteId(null);
      }
    }
  };

  const categories = ['All', 'Personal', 'Work', 'Ideas', 'Urgent'];
  const colorSchemes = [
    { name: 'indigo', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20', text: 'text-indigo-400', active: 'ring-2 ring-indigo-500 bg-indigo-500' },
    { name: 'purple', border: 'border-purple-500/30', bg: 'bg-purple-500/10 hover:bg-purple-500/20', text: 'text-purple-400', active: 'ring-2 ring-purple-500 bg-purple-500' },
    { name: 'emerald', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20', text: 'text-emerald-400', active: 'ring-2 ring-emerald-500 bg-emerald-500' },
    { name: 'rose', border: 'border-rose-500/30', bg: 'bg-rose-500/10 hover:bg-rose-500/20', text: 'text-rose-400', active: 'ring-2 ring-rose-500 bg-rose-500' },
    { name: 'amber', border: 'border-amber-500/30', bg: 'bg-amber-500/10 hover:bg-amber-500/20', text: 'text-amber-400', active: 'ring-2 ring-amber-500 bg-amber-500' },
  ];

  const getNoteStyle = (colorName: string) => {
    return colorSchemes.find(s => s.name === colorName) || colorSchemes[0];
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || note.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="notes-tool" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
      {/* Sidebar List panel */}
      <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 flex flex-col overflow-hidden h-full">
        {/* Header toolbar */}
        <div className="p-4 border-b border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 font-display">
              <FileText className="w-5 h-5 text-indigo-400" />
              Scratchpad Notes
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Save className={`w-3 h-3 ${isSaving ? 'text-indigo-400 animate-spin' : 'text-slate-600'}`} />
                {isSaving ? 'Autosaving' : 'Auto-saved'}
              </span>
              <button
                onClick={handleCreateNote}
                className="bg-indigo-500 hover:bg-indigo-600 p-1.5 rounded-lg text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                title="Create note"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Tag filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors shrink-0 ${
                  activeCategory === cat
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/35'
                    : 'bg-slate-950/40 text-slate-500 border border-slate-900 hover:text-slate-300 hover:bg-slate-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {filteredNotes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-600">
              <FolderOpen className="w-8 h-8 mb-2 text-slate-700" />
              <p className="text-sm font-medium">No records found</p>
              <p className="text-xs text-slate-500 mt-1">Create a new container or change your search key.</p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const style = getNoteStyle(note.color);
              const isActive = selectedNoteId === note.id;
              const formattedDate = new Date(note.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                    isActive
                      ? 'bg-slate-950 border-indigo-500/60 glow-blue'
                      : 'bg-slate-950/20 border-slate-850 hover:bg-slate-950/50 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-medium text-slate-200 text-sm truncate flex-1">{note.title || 'Untitled Note'}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded capitalize ${style.bg} ${style.text} border ${style.border}`}>
                      {note.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 pr-2 font-light">
                    {note.content || 'Empty block...'}
                  </p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-900">
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Editor detailed area */}
      <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800 flex flex-col overflow-hidden h-full">
        {currentSelectedNote ? (
          <div className="flex-1 flex flex-col h-full">
            {/* Top Editor controls */}
            <div className="p-4 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Color selects */}
                <div className="flex items-center gap-1.5 mr-2">
                  {colorSchemes.map(sch => (
                    <button
                      key={sch.name}
                      onClick={() => handleUpdateNoteField(currentSelectedNote.id, 'color', sch.name)}
                      className={`w-4 h-4 rounded-full ${sch.active} cursor-pointer hover:scale-110 transition-transform ${
                        currentSelectedNote.color === sch.name ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-slate-900' : ''
                      }`}
                      title={`Theme: ${sch.name}`}
                    />
                  ))}
                </div>

                {/* Category select dropdown */}
                <select
                  className="bg-slate-950 border border-slate-850 px-3 py-1 text-xs text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={currentSelectedNote.category}
                  onChange={(e) => handleUpdateNoteField(currentSelectedNote.id, 'category', e.target.value)}
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 border border-slate-800 px-2.5 py-1 rounded bg-slate-950/40">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Auto-saved in local cache</span>
              </div>
            </div>

            {/* Note title */}
            <input
              type="text"
              placeholder="Give your note a title..."
              className="px-6 pt-4 pb-2 bg-transparent text-white font-semibold text-lg focus:outline-none border-none placeholder:text-slate-600 font-display"
              value={currentSelectedNote.title}
              onChange={(e) => handleUpdateNoteField(currentSelectedNote.id, 'title', e.target.value)}
            />

            {/* Note text content */}
            <textarea
              placeholder="Start drafting code or typing details here..."
              className="flex-1 px-6 pb-6 pt-2 bg-transparent text-slate-200 placeholder:text-slate-600 focus:outline-none border-none resize-none font-sans text-sm leading-relaxed"
              value={currentSelectedNote.content}
              onChange={(e) => handleUpdateNoteField(currentSelectedNote.id, 'content', e.target.value)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-600">
            <Heart className="w-12 h-12 mb-3 text-slate-800" />
            <p className="text-base font-medium">Draft dynamic updates</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Create a note using the sidebar action block to record links, code snippets, or draft paragraphs instantly.
            </p>
            <button
              onClick={handleCreateNote}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 text-sm rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Note</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
