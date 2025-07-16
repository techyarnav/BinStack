import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Copy, 
  Check, 
  History, 
  Trash2, 
  ExternalLink,
  AlertCircle,
  Clipboard,
  Share2,
  Download,
  Search,
  Clock,
  Users,
  Database
} from "lucide-react";
import clsx from "clsx";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

// const BACKEND_URL = "http://localhost:3001";
const BACKEND_URL = "https://binstack-backend-59021fc50595.herokuapp.com"; // Backend URL for production (Deployed on Heroku)

const Popup = () => {
  const { isDark } = useTheme();
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentPastes, setRecentPastes] = useState([]);
  const [copiedStates, setCopiedStates] = useState({});
  const [activeTab, setActiveTab] = useState("create");
  const [shareResult, setShareResult] = useState(null);
  const [importUrl, setImportUrl] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importedPaste, setImportedPaste] = useState(null);
  const [recentShareResults, setRecentShareResults] = useState({});

  const themeStyles = {
    container: isDark 
      ? "bg-gradient-to-b from-black via-black to-gray-900" 
      : "bg-gradient-to-br from-white via-blue-50 to-blue-100",
    text: isDark ? "text-white" : "text-gray-900",
    cardBg: isDark ? "bg-gray-900/50" : "bg-white",
    cardBorder: isDark ? "border-gray-700/50" : "border-blue-200",
    cardShadow: isDark ? "shadow-orange-900/20" : "shadow-blue-500/10",
    inputBg: isDark ? "bg-gray-900/50" : "bg-white",
    inputBorder: isDark ? "border-gray-700/50" : "border-blue-200",
    inputText: isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-blue-400/70",
    buttonPrimary: isDark 
      ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white" 
      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white",
    buttonSecondary: isDark 
      ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600" 
      : "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200",
    tabBg: isDark ? "from-black to-gray-900" : "from-blue-50 to-blue-100",
    tabActive: isDark 
      ? "bg-gray-800 border-orange-500 text-white" 
      : "bg-white border-blue-500 text-blue-700",
    tabInactive: isDark 
      ? "text-gray-400 hover:text-gray-200" 
      : "text-blue-600 hover:text-blue-800",
    headerBg: isDark 
      ? "bg-gradient-to-b from-black to-gray-900" 
      : "bg-gradient-to-r from-white via-blue-50 to-blue-100",
    successBg: isDark ? "bg-gray-800/70" : "bg-green-50",
    successBorder: isDark ? "border-gray-600" : "border-green-200",
    successText: isDark ? "text-gray-200" : "text-green-800",
    successButton: isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-green-600 hover:bg-green-700 text-white",
    shareBg: isDark ? "bg-gray-800/70" : "bg-purple-50",
    shareBorder: isDark ? "border-gray-600" : "border-purple-200",
    shareText: isDark ? "text-gray-200" : "text-purple-800",
    shareButton: isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white",
    shareAccent: isDark ? "text-gray-400" : "text-purple-600",
    importBg: isDark ? "bg-gray-800/70" : "bg-blue-50",
    importBorder: isDark ? "border-gray-600" : "border-blue-200",
    importText: isDark ? "text-gray-200" : "text-blue-800",
    importButton: isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white",
    importAccent: isDark ? "text-gray-400" : "text-blue-600",
  };

  useEffect(() => {
    chrome.storage.local.get(["recentPastes"], (result) => {
      if (result.recentPastes) {
        setRecentPastes(result.recentPastes);
      }
    });
  }, []);

  const saveRecentPaste = (paste) => {
    const newPastes = [paste, ...recentPastes.slice(0, 9)];
    setRecentPastes(newPastes);
    chrome.storage.local.set({ recentPastes: newPastes });
  };

  const clearRecentPastes = () => {
    setRecentPastes([]);
    setRecentShareResults({});
    chrome.storage.local.clear();
  };

  const getClipboardContent = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent(text);
    } catch (err) {
      setError("Failed to read clipboard. Please paste manually.");
    }
  };

  const handleSave = async () => {
    setError("");
    setResult(null);
    setShareResult(null);
    
    if (!content.trim()) {
      setError("Please enter some text.");
      return;
    }
    
    if (new Blob([content]).size > 1024 * 1024) {
      setError("Paste too large (max 1MB).");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/paste`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        return;
      }
      
      const { id } = await res.json();
      const newPaste = {
        id,
        content: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
        timestamp: Date.now()
      };
      
      setResult({ id });
      saveRecentPaste(newPaste);
      setContent("");
      
    } catch (err) {
      setError("Error connecting to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShare = async (pasteId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pasteId, expirationHours: 24 }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create share.");
        return;
      }
      
      const shareData = await res.json();
      setShareResult(shareData);
      setResult(null);
      
    } catch (err) {
      setError("Error creating share link.");
    }
  };

  const handleCreateShareFromRecent = async (pasteId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pasteId, expirationHours: 24 }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create share.");
        return;
      }
      
      const shareData = await res.json();
      setRecentShareResults({ ...recentShareResults, [pasteId]: shareData });
      
    } catch (err) {
      setError("Error creating share link.");
    }
  };

  const handleImportPaste = async () => {
    setError("");
    setImportedPaste(null);
    
    if (!importUrl.trim()) {
      setError("Please enter a share URL.");
      return;
    }
    
    let shareId = importUrl.trim();
    if (shareId.startsWith("pastebin:")) {
      shareId = shareId.substring(9);
    }
    
    if (shareId.length !== 12) {
      setError("Invalid share URL format.");
      return;
    }
    
    setImportLoading(true);
    
    try {
      const res = await fetch(`${BACKEND_URL}/import/${shareId}`);
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to import paste.");
        return;
      }
      
      const importData = await res.json();
      setImportedPaste(importData);
      setImportUrl("");
      
    } catch (err) {
      setError("Error importing paste.");
    } finally {
      setImportLoading(false);
    }
  };

  const useImportedPaste = () => {
    if (importedPaste) {
      setContent(importedPaste.content);
      setActiveTab("create");
      setImportedPaste(null);
    }
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [key]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden ${themeStyles.container}`}>
      {/* Header */}
      <div className={`p-6 shadow-lg ${themeStyles.headerBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${isDark ? 'bg-orange-600' : 'bg-blue-600'} flex items-center justify-center`}>
              <Database className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${themeStyles.text}`}>BinStack</h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-blue-700/80'}`}>
                Professional text sharing & storage
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex border-b ${themeStyles.cardBorder} bg-gradient-to-r ${themeStyles.tabBg}`}>
        <button
          onClick={() => setActiveTab("create")}
          className={clsx(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200",
            activeTab === "create" ? themeStyles.tabActive : themeStyles.tabInactive
          )}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Create
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={clsx(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200",
            activeTab === "import" ? themeStyles.tabActive : themeStyles.tabInactive
          )}
        >
          <Download className="w-4 h-4 inline mr-2" />
          Import
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={clsx(
            "flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200",
            activeTab === "recent" ? themeStyles.tabActive : themeStyles.tabInactive
          )}
        >
          <History className="w-4 h-4 inline mr-2" />
          Recent ({recentPastes.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "create" ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full p-6 flex flex-col"
            >
              {/* Clipboard Button */}
              <div className="mb-4">
                <button
                  onClick={getClipboardContent}
                  className={`w-full py-3 px-4 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${themeStyles.buttonSecondary}`}
                >
                  <Clipboard className="w-4 h-4" />
                  Paste from Clipboard
                </button>
              </div>

              {/* Text Area */}
              <div className="flex-1 mb-4">
                <textarea
                  className={`w-full h-full border p-4 text-sm focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-orange-500' : 'focus:ring-blue-500'} focus:border-transparent resize-none ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                  placeholder="Enter your text here..."
                  maxLength={1048576}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {/* Character Count */}
              <div className={`text-xs mb-4 flex items-center gap-1 ${themeStyles.text}`}>
                <div className={`w-2 h-2 ${isDark ? 'bg-orange-500' : 'bg-blue-500'} rounded-full`}></div>
                {content.length.toLocaleString()} characters
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={isLoading || !content.trim()}
                className={clsx(
                  "w-full py-3 px-6 font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg",
                  isLoading || !content.trim()
                    ? `${themeStyles.buttonSecondary} opacity-50 cursor-not-allowed`
                    : `${themeStyles.buttonPrimary} ${isDark ? 'shadow-orange-500/25' : 'shadow-blue-500/25'} hover:shadow-xl`
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Paste
                  </>
                )}
              </motion.button>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 border text-sm flex items-center gap-2 ${isDark ? 'bg-red-900/30 border-red-700/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              {/* Success Result - Localhost Link */}
              {result && !shareResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 border ${themeStyles.successBg} ${themeStyles.successBorder}`}
                >
                  <div className={`text-sm font-medium mb-2 ${themeStyles.successText}`}>
                    Paste created successfully!
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={`http://localhost:3001/p/${result.id}`}
                      readOnly
                      className={`flex-1 px-3 py-2 border text-sm font-mono ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                    />
                    <button
                      onClick={() => copyToClipboard(`http://localhost:3001/p/${result.id}`, 'result')}
                      className={`px-3 py-2 text-sm transition-colors duration-200 ${themeStyles.successButton}`}
                    >
                      {copiedStates.result ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={() => handleCreateShare(result.id)}
                    className={`w-full py-2 px-4 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${themeStyles.buttonPrimary}`}
                  >
                    <Share2 className="w-4 h-4" />
                    Create Universal Share Link
                  </button>
                </motion.div>
              )}

              {/* Universal Share Result - Replaces Localhost Link */}
              {shareResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 border ${themeStyles.shareBg} ${themeStyles.shareBorder}`}
                >
                  <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${themeStyles.shareText}`}>
                    <Users className="w-4 h-4" />
                    Universal Share Link Created!
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={shareResult.shareUrl}
                      readOnly
                      className={`flex-1 px-3 py-2 border text-sm font-mono ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                    />
                    <button
                      onClick={() => copyToClipboard(shareResult.shareUrl, 'share')}
                      className={`px-3 py-2 text-sm transition-colors duration-200 ${themeStyles.shareButton}`}
                    >
                      {copiedStates.share ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${themeStyles.shareAccent}`}>
                    <Clock className="w-3 h-3" />
                    Expires in {shareResult.expirationHours} hours
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : activeTab === "import" ? (
            <motion.div
              key="import"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Fixed height container for import form */}
              <div className="p-6 flex-shrink-0">
                <h3 className={`font-medium mb-2 ${themeStyles.text}`}>Import Shared Paste</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-blue-700/70'}`}>
                  Enter a universal share link to import paste content from another device.
                </p>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="pastebin:abc123def456"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    className={`w-full px-4 py-3 border text-sm font-mono focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-orange-500' : 'focus:ring-blue-500'} focus:border-transparent ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                  />
                  
                  <button
                    onClick={handleImportPaste}
                    disabled={importLoading || !importUrl.trim()}
                    className={clsx(
                      "w-full py-3 px-6 font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg",
                      importLoading || !importUrl.trim()
                        ? `${themeStyles.buttonSecondary} opacity-50 cursor-not-allowed`
                        : `${themeStyles.buttonPrimary} ${isDark ? 'shadow-orange-500/25' : 'shadow-blue-500/25'} hover:shadow-xl`
                    )}
                  >
                    {importLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Import Paste
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scrollable area for results and errors */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {/* Imported Paste Result */}
                {importedPaste && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border ${themeStyles.importBg} ${themeStyles.importBorder}`}
                  >
                    <div className={`text-sm font-medium mb-2 ${themeStyles.importText}`}>
                      Paste Imported Successfully!
                    </div>
                    <div className="mb-3">
                      <div className={`text-xs mb-1 ${themeStyles.importAccent}`}>Preview:</div>
                      <div className={`p-3 border max-h-40 overflow-y-auto text-sm font-mono ${themeStyles.cardBg} ${themeStyles.cardBorder} ${themeStyles.text}`}>
                        {importedPaste.content}
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={useImportedPaste}
                        className={`flex-1 py-2 px-4 text-sm transition-all duration-200 ${themeStyles.buttonPrimary}`}
                      >
                        Use This Paste
                      </button>
                      <button
                        onClick={() => copyToClipboard(importedPaste.content, 'imported')}
                        className={`px-4 py-2 text-sm transition-colors duration-200 ${themeStyles.importButton}`}
                      >
                        {copiedStates.imported ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className={`text-xs ${themeStyles.importAccent}`}>
                      Access: {importedPaste.accessCount}/{importedPaste.maxAccess}
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 border text-sm flex items-center gap-2 ${isDark ? 'bg-red-900/30 border-red-700/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Recent Pastes Header */}
              <div className={`p-4 border-b flex items-center justify-between ${themeStyles.cardBorder}`}>
                <h3 className={`font-medium ${themeStyles.text}`}>Recent Pastes</h3>
                {recentPastes.length > 0 && (
                  <button
                    onClick={clearRecentPastes}
                    className={`transition-colors duration-200 p-1 ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Recent Pastes List */}
              <div className="flex-1 overflow-y-auto">
                {recentPastes.length === 0 ? (
                  <div className={`h-full flex items-center justify-center text-sm ${isDark ? 'text-gray-400' : 'text-blue-700/50'}`}>
                    <div className="text-center">
                      <History className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-blue-300'}`} />
                      <p>No recent pastes</p>
                      <p className="text-xs mt-1">Create your first paste!</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {recentPastes.map((paste) => (
                      <div key={paste.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 border transition-colors duration-200 ${themeStyles.cardBg} ${themeStyles.cardBorder} ${themeStyles.cardShadow} ${isDark ? 'hover:bg-gray-800/70' : 'hover:bg-blue-50'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-mono truncate ${themeStyles.text}`}>
                                {paste.content}
                              </div>
                              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-blue-600/50'}`}>
                                {formatTimestamp(paste.timestamp)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => copyToClipboard(`http://localhost:3001/p/${paste.id}`, `link-${paste.id}`)}
                                className={`p-1.5 transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/20' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                title="Copy link"
                              >
                                {copiedStates[`link-${paste.id}`] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                              <button
                                onClick={() => handleCreateShareFromRecent(paste.id)}
                                className={`p-1.5 transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'}`}
                                title="Create share link"
                              >
                                <Share2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => window.open(`http://localhost:3001/p/${paste.id}`, '_blank')}
                                className={`p-1.5 transition-colors duration-200 ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
                                title="Open in new tab"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>

                        {/* Share Result for Recent Paste */}
                        {recentShareResults[paste.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-2 p-3 border ${themeStyles.shareBg} ${themeStyles.shareBorder}`}
                          >
                            <div className={`text-sm font-medium mb-2 flex items-center gap-2 ${themeStyles.shareText}`}>
                              <Users className="w-4 h-4" />
                              Universal Share Link Created!
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={recentShareResults[paste.id].shareUrl}
                                readOnly
                                className={`flex-1 px-3 py-2 border text-sm font-mono ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText}`}
                              />
                              <button
                                onClick={() => copyToClipboard(recentShareResults[paste.id].shareUrl, `recent-share-${paste.id}`)}
                                className={`px-3 py-2 text-sm transition-colors duration-200 ${themeStyles.shareButton}`}
                              >
                                {copiedStates[`recent-share-${paste.id}`] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                            <div className={`text-xs mt-2 flex items-center gap-1 ${themeStyles.shareAccent}`}>
                              <Clock className="w-3 h-3" />
                              Expires in {recentShareResults[paste.id].expirationHours} hours
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Popup;
